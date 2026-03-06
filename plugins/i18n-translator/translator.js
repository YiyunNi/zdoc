'use strict'

const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const fetch = require('node-fetch')
const Bottleneck = require('bottleneck')

const {
  parseFrontmatter,
  extractTranslatableFields,
  applyTranslatedFields,
  stripEditorialFields,
  splitBodyIntoChunks,
  placeholderifyTags,
  restorePlaceholders,
} = require('./markdownParser')
const { TranslationCache } = require('./cache')
const { harvestTerms, proposeTerms, approveTerms, loadGlossary, walkDir } = require('./harvest')
const { validateMdxStructure } = require('../mdx-parse/mdxPatcher')

// ---------------------------------------------------------------------------
// Config loading
// ---------------------------------------------------------------------------

function loadConfig(siteDir) {
  const configPath = path.join(siteDir, 'config/i18n-translator.config.js')
  if (!fs.existsSync(configPath)) return {}
  try {
    return require(configPath)
  } catch {
    return {}
  }
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function hashContent(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex').slice(0, 16)
}

function hashGlossary(glossary, untranslatables = []) {
  const glossaryStr = [...glossary.entries()].sort().map(([k, v]) => `${k}=${v}`).join('|')
  const untranslatableStr = [...untranslatables].filter(Boolean).sort().join('|')
  return hashContent(glossaryStr + '\n' + untranslatableStr)
}

/**
 * Build a focused glossary hint containing only entries whose source term
 * actually appears in the given text. Keeps the prompt concise.
 */
function buildGlossaryHint(glossary, text) {
  const relevant = []
  for (const [source, target] of glossary.entries()) {
    if (text.includes(source)) {
      relevant.push(`  ${source} → ${target}`)
    }
  }
  return relevant.length ? relevant.join('\n') : null
}

/**
 * Deterministic post-processing: replace any source term that slipped
 * through LLM translation with its confirmed glossary target.
 * Handles terms appearing in plain text and inside **bold** markers.
 */
function applyGlossaryPostProcess(text, glossary) {
  for (const [source, target] of glossary.entries()) {
    if (!source || !target || source === target) continue
    const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Replace plain occurrences and bold-wrapped occurrences
    text = text.replace(new RegExp(`\\*\\*${escaped}\\*\\*`, 'g'), `**${target}**`)
    text = text.replace(new RegExp(escaped, 'g'), target)
  }
  return text
}

// ---------------------------------------------------------------------------
// LLM call
// ---------------------------------------------------------------------------

const LLM_TIMEOUT_MS = 120_000
const LLM_MAX_RETRIES = 3
const LLM_RETRY_DELAYS_MS = [2_000, 5_000, 10_000]

async function callLLM(messages, llmConfig, _retryCount = 0) {
  const { baseUrl, apiKey, modelId } = llmConfig
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS)

  let response
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: modelId, messages, temperature: 0.1 }),
      signal: controller.signal,
    })
  } catch (err) {
    if (err.name === 'AbortError') throw new Error(`LLM request timed out after ${LLM_TIMEOUT_MS / 1000}s`)
    throw err
  } finally {
    clearTimeout(timer)
  }

  // Retry on 5xx server errors with exponential backoff
  if (response.status >= 500 && _retryCount < LLM_MAX_RETRIES) {
    const delay = LLM_RETRY_DELAYS_MS[_retryCount] ?? 10_000
    console.warn(`[i18n-translator] LLM returned HTTP ${response.status}, retrying in ${delay / 1000}s (attempt ${_retryCount + 1}/${LLM_MAX_RETRIES})`)
    await new Promise(resolve => setTimeout(resolve, delay))
    return callLLM(messages, llmConfig, _retryCount + 1)
  }

  const data = await response.json()
  if (!response.ok || !data.choices?.[0]?.message?.content) {
    throw new Error(`LLM error: ${JSON.stringify(data).slice(0, 300)}`)
  }
  return data.choices[0].message.content.trim()
}

// ---------------------------------------------------------------------------
// Frontmatter translation
// ---------------------------------------------------------------------------

async function translateFrontmatterFields(fields, glossary, untranslatables, llmConfig, limiter) {
  // Build a compact JSON payload — avoids parsing issues vs. free text
  const toTranslate = {}
  if (fields.title) toTranslate.title = fields.title
  if (fields.sidebar_label) toTranslate.sidebar_label = fields.sidebar_label
  if (fields.description) toTranslate.description = fields.description
  if (fields.keywords?.length) toTranslate.keywords = fields.keywords

  if (!Object.keys(toTranslate).length) return {}

  const glossaryHint = buildGlossaryHint(glossary, JSON.stringify(toTranslate))
  const untranslatableList = untranslatables.filter(Boolean).join(', ')

  const systemPrompt = `You are a professional technical translator (English → Japanese) for Zilliz Cloud documentation.
Translate the JSON field values from English to Japanese.

Rules:
- Return valid JSON with the SAME keys as the input
- title and sidebar_label: translate the human-readable part; keep suffixes like " | Cloud" verbatim
- description: natural Japanese sentence
- keywords: translate each keyword to natural Japanese; keep proper nouns in English
- Do NOT translate these terms (keep as-is): ${untranslatableList}
${glossaryHint ? `- Use EXACTLY these translations:\n${glossaryHint}` : ''}
- Return ONLY the JSON object, no explanation`

  const userPrompt = JSON.stringify(toTranslate, null, 2)

  const translated = await limiter.schedule(() =>
    callLLM([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], llmConfig)
  )

  try {
    // Strip markdown code fences if the model wrapped the JSON
    const cleaned = translated.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    return JSON.parse(cleaned)
  } catch {
    console.warn('[i18n-translator] Could not parse frontmatter translation JSON — skipping fields')
    return {}
  }
}

// ---------------------------------------------------------------------------
// Quality control
// ---------------------------------------------------------------------------

/**
 * Audit a single translated file for common issues. Returns an array of
 * human-readable issue strings (empty = clean).
 *
 * Checks:
 *  1. Untranslatable terms present in source still present in output —
 *     catches cases where the LLM ignored the "keep as English" instruction.
 *  2. Markdown link URL count matches — catches dropped/added links.
 *  3. Output contains Japanese characters — catches untranslated files.
 */
function auditTranslation(source, output, untranslatables) {
  const issues = []

  // 1. Untranslatable term preservation
  for (const term of untranslatables) {
    if (!term) continue
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(escaped, 'g')
    const srcCount = (source.match(re) || []).length
    const outCount = (output.match(re) || []).length
    if (srcCount > 0 && outCount < srcCount) {
      issues.push(`"${term}": ${srcCount}× in source but only ${outCount}× in output`)
    }
  }

  // 2. Markdown link URL count (ignore anchor-only links like #section)
  const linkRe = /\]\(([^)]+)\)/g
  const srcUrls = [], outUrls = []
  let m
  while ((m = linkRe.exec(source)) !== null) if (!m[1].startsWith('#')) srcUrls.push(m[1])
  linkRe.lastIndex = 0
  while ((m = linkRe.exec(output)) !== null) if (!m[1].startsWith('#')) outUrls.push(m[1])
  if (srcUrls.length !== outUrls.length) {
    issues.push(`link count: ${srcUrls.length} in source, ${outUrls.length} in output`)
  }

  // 3. Japanese characters present (skip trivially short or code-only files)
  const strippedSrc = source.replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, '').trim()
  if (strippedSrc.length > 100 && !/[\u3040-\u30FF\u4E00-\u9FFF]/.test(output)) {
    issues.push('no Japanese characters found in output')
  }

  return issues
}

/**
 * Walk all source→dest folder pairs, find translated files that exist on disk,
 * and run auditTranslation on each. Prints a report; returns the count of
 * files with issues.
 */
async function auditAllFiles({ sources, untranslatables }) {
  let totalFiles = 0
  let filesWithIssues = 0

  for (const { folder, destFolder } of sources) {
    if (!fs.existsSync(folder)) continue
    const sourceFiles = walkDir(folder)

    for (const sourcePath of sourceFiles) {
      const destPath = path.join(destFolder, path.relative(folder, sourcePath))
      if (!fs.existsSync(destPath)) continue

      totalFiles++
      const sourceContent = fs.readFileSync(sourcePath, 'utf8')
      const outputContent = fs.readFileSync(destPath, 'utf8')
      const issues = auditTranslation(sourceContent, outputContent, untranslatables)

      if (issues.length) {
        filesWithIssues++
        console.warn(`[i18n-translator]   ⚠  ${path.relative(folder, sourcePath)}`)
        for (const issue of issues) {
          console.warn(`[i18n-translator]        ${issue}`)
        }
      }
    }
  }

  console.log(`[i18n-translator] Audit: ${totalFiles} files checked, ${filesWithIssues} with issues`)
  return filesWithIssues
}

// ---------------------------------------------------------------------------
// Body translation
// ---------------------------------------------------------------------------

async function translateBody(body, glossary, untranslatables, llmConfig, limiter, cache, locale, glossaryHash, force = false) {
  if (!body.trim()) return body

  // Split into prose (translate=true) vs. code block / import (translate=false) chunks.
  // Code blocks are passed through verbatim — the LLM never sees their content.
  // Each prose chunk is one LLM call, keeping inputs small and reliable.
  const chunks = splitBodyIntoChunks(body)
  const result = []

  // Build the untranslatable instruction once; it's the same for all chunks.
  const untranslatableList = untranslatables.filter(Boolean).join(', ')

  for (const chunk of chunks) {
    // Code blocks and imports pass through verbatim.
    if (!chunk.translate || !chunk.content.trim()) {
      result.push(chunk.content)
      continue
    }

    // Preserve surrounding whitespace: LLMs always strip it from their output.
    // Without this, import lines and code fences lose the blank lines that
    // separate them from the following prose, corrupting the markdown structure.
    const trimmed = chunk.content.trim()
    const preLen = chunk.content.length - chunk.content.trimStart().length
    const postLen = chunk.content.length - chunk.content.trimEnd().length
    const pre  = chunk.content.slice(0, preLen)
    const post = postLen > 0 ? chunk.content.slice(-postLen) : ''

    // Replace JSX component tags and structural HTML block tags with numbered
    // placeholders before hashing and sending to the LLM. This prevents the
    // model from reordering or mis-closing tags like <Tabs>, <TabItem>,
    // <table>, <tr>, <li>, etc. which causes MDX compilation failures.
    const { placeholderText, placeholders } = placeholderifyTags(trimmed)

    const chunkHash = hashContent(placeholderText)
    const cachedChunk = force ? null : await cache.getTranslation(chunkHash, locale, glossaryHash)
    if (cachedChunk) {
      result.push(pre + restorePlaceholders(cachedChunk.output, placeholders) + post)
      continue
    }

    const glossaryHint = buildGlossaryHint(glossary, placeholderText)

    const systemPrompt = `You are a professional technical translator (English → Japanese) for Zilliz Cloud documentation.
Translate the provided markdown text from English to Japanese.

Rules:
1. Preserve ALL markdown syntax exactly: ##, **, *, >, -, tables, numbered lists, etc.
2. Preserve ALL XTAGX placeholders (e.g. XTAG0X, XTAG1X) exactly as-is — do not translate, reorder, or remove them
3. Preserve ALL markdown link URLs — only translate the visible link text: [translate this](keep-url-unchanged)
4. Preserve ALL heading anchor IDs exactly: \\{#heading-id} stays unchanged
5. Preserve ALL inline code: \`code\` stays unchanged
6. Preserve ALL leading whitespace on every line exactly — do not add or remove spaces or tabs at the start of any line
${untranslatableList ? `6. Do NOT translate these technical terms — output them exactly as English: ${untranslatableList}\n` : ''}${glossaryHint ? `7. Use EXACTLY these translations:\n${glossaryHint}\n` : ''}
Return ONLY the translated markdown, no explanation.`

    let raw = await limiter.schedule(() =>
      callLLM([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: placeholderText },
      ], llmConfig)
    )

    // Detect instruction echo: some models translate the system prompt itself
    // instead of the content when confused. Retry once with a minimal prompt.
    const ECHO_MARKERS = [
      '翻訳されたマークダウンのみを返してください',
      '以下の技術用語は翻訳しないでください',
      '提供されたマークダウンテキストを英語から日本語に翻訳してください',
    ]
    if (ECHO_MARKERS.some(m => raw.includes(m))) {
      console.warn(`[i18n-translator] Instruction echo detected — retrying with minimal prompt`)
      raw = await limiter.schedule(() =>
        callLLM([
          { role: 'system', content: 'Translate the following markdown text from English to Japanese. Preserve all XTAGX placeholders (e.g. XTAG0X, XTAG1X) exactly as-is. Output only the translated text.' },
          { role: 'user', content: placeholderText },
        ], llmConfig)
      )
    }

    // Restore structural tags from placeholders before post-processing
    raw = restorePlaceholders(raw, placeholders)

    const translated = applyGlossaryPostProcess(raw, glossary)
    await cache.setTranslation(chunkHash, locale, glossaryHash, { output: translated })
    result.push(pre + translated + post)
  }

  return result.join('')
}

// ---------------------------------------------------------------------------
// Single file translation
// ---------------------------------------------------------------------------

async function translateFile({
  sourcePath,
  destPath,
  relPath,
  glossary,
  untranslatables,
  llmConfig,
  limiter,
  cache,
  locale,
  glossaryHash,
  dryRun,
  force = false,
  sidebarLabelsSeen = null, // Map<label, firstRelPath> — shared across calls for dup detection
}) {
  const sourceContent = fs.readFileSync(sourcePath, 'utf8')
  const sourceHash = hashContent(sourceContent)

  const { frontmatter, body } = parseFrontmatter(sourceContent)

  let outputFrontmatter = frontmatter
  let outputBody = body

  if (frontmatter) {
    const fields = extractTranslatableFields(frontmatter)
    const translatedFields = await translateFrontmatterFields(fields, glossary, untranslatables, llmConfig, limiter)
    outputFrontmatter = stripEditorialFields(applyTranslatedFields(frontmatter, translatedFields))
  }

  outputBody = await translateBody(body, glossary, untranslatables, llmConfig, limiter, cache, locale, glossaryHash, force)

  // Inject sidebar_key into category index docs (filename == parent folder name).
  // Docusaurus derives the sidebar i18n key from sidebar_label, so two categories
  // translated to the same Japanese label (e.g. "ベストプラクティス") produce
  // duplicate keys and crash the locale build. sidebar_key overrides the key with
  // a path-derived value that is unique by construction.
  if (frontmatter && !outputFrontmatter.includes('sidebar_key:')) {
    const fileBase = path.basename(sourcePath, path.extname(sourcePath))
    const folderName = path.basename(path.dirname(sourcePath))
    if (fileBase === folderName) {
      const sidebarKey = path.dirname(relPath).replace(/^.*\/tutorials\//, '')
      outputFrontmatter += `\nsidebar_key: "${sidebarKey}"`
    }
  }

  const output = frontmatter
    ? `---\n${outputFrontmatter}\n---\n${outputBody}`
    : outputBody

  // Quality control — run after assembly, before writing
  const issues = auditTranslation(sourceContent, output, untranslatables)
  if (issues.length) {
    console.warn(`[i18n-translator]   ⚠  ${relPath} (${issues.length} issue${issues.length > 1 ? 's' : ''})`)
    for (const issue of issues) console.warn(`[i18n-translator]        ${issue}`)
  }

  // Sidebar label duplicate detection: warn if this file's translated
  // sidebar_label collides with another file already seen in this run.
  // Duplicate labels cause Docusaurus to crash with "Multiple docs sidebar
  // items produce the same translation key" when building the locale.
  if (sidebarLabelsSeen) {
    const labelMatch = output.match(/^sidebar_label:\s*"(.+?)"\s*$/m)
    if (labelMatch) {
      const label = labelMatch[1]
      if (sidebarLabelsSeen.has(label)) {
        console.warn(`[i18n-translator]   ⚠  sidebar_label duplicate detected: "${label}"`)
        console.warn(`[i18n-translator]        first seen in: ${sidebarLabelsSeen.get(label)}`)
        console.warn(`[i18n-translator]        also in:       ${relPath}`)
        console.warn(`[i18n-translator]        This will cause a Docusaurus build failure for locale ${locale}.`)
      } else {
        sidebarLabelsSeen.set(label, relPath)
      }
    }
  }

  if (dryRun) {
    // Print translated output to stdout so the user can inspect it
    process.stdout.write('\n' + '─'.repeat(60) + '\n')
    process.stdout.write(`Preview: ${relPath}\n`)
    process.stdout.write('─'.repeat(60) + '\n')
    process.stdout.write(output + '\n')
    return
  }

  fs.mkdirSync(path.dirname(destPath), { recursive: true })
  fs.writeFileSync(destPath, output, 'utf8')

  await cache.setFileRecord(relPath, locale, sourceHash, glossaryHash)

  console.log(`[i18n-translator]   ✓ ${relPath}${issues.length ? ' ⚠' : ''}`)
}

// ---------------------------------------------------------------------------
// sidebar_key back-fill
// ---------------------------------------------------------------------------

/**
 * Scan all category index docs in the translated dest folders and inject a
 * unique sidebar_key if one is missing. This fixes existing translated files
 * that were written before this logic was added, without requiring a full
 * retranslation.
 *
 * A category index doc is any file where basename(file) == basename(dir),
 * e.g. best-practices/best-practices.md.
 */
function backfillSidebarKeys(sources, siteDir, locale) {
  let patched = 0
  for (const { folder, destFolder } of sources) {
    if (!fs.existsSync(destFolder)) continue
    const destFiles = walkDir(destFolder)
    for (const destFilePath of destFiles) {
      const fileBase = path.basename(destFilePath, path.extname(destFilePath))
      const folderName = path.basename(path.dirname(destFilePath))
      if (fileBase !== folderName) continue

      const content = fs.readFileSync(destFilePath, 'utf8')
      if (content.includes('sidebar_key:')) continue

      // Derive sidebar_key from the source-side relative path
      const relDestPath = path.relative(destFolder, destFilePath)
      const sourcePath = path.join(folder, relDestPath)
      const relSourcePath = path.relative(siteDir, sourcePath)
      const sidebarKey = path.dirname(relSourcePath).replace(/^.*\/tutorials\//, '')

      // Insert sidebar_key after the last frontmatter field (before closing ---)
      const patched_content = content.replace(
        /^(---\n[\s\S]*?)(---)/m,
        (_, fm, close) => `${fm}sidebar_key: "${sidebarKey}"\n${close}`
      )
      if (patched_content !== content) {
        fs.writeFileSync(destFilePath, patched_content, 'utf8')
        console.log(`[i18n-translator]   🔑 sidebar_key added: ${relDestPath}`)
        patched++
      }
    }
  }
  if (patched > 0) console.log(`[i18n-translator] sidebar_key back-fill: ${patched} file(s) patched`)
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

async function run({ siteDir, locale = 'ja-JP', forceAll = false, dryRun = false, harvestOnly = false, proposeOnly = false, approveOnly = false, targetFile = null, clearCache = false, auditOnly = false }) {
  const config = loadConfig(siteDir)

  const llmConfig = {
    baseUrl: config.modelConfig?.baseUrl || process.env.MODEL_API_BASE_URL,
    apiKey:  config.modelConfig?.apiKey  || process.env.MODEL_API_KEY,
    modelId: config.modelConfig?.modelId || process.env.MODEL_ID,
  }

  const throttle = {
    minTime:       config.throttleConfig?.minTime       || parseInt(process.env.THROTTLE_MIN_TIME)       || 1000,
    maxConcurrent: config.throttleConfig?.maxConcurrent || parseInt(process.env.THROTTLE_MAX_CONCURRENT) || 1,
  }

  const untranslatables = config.untranslatables || []

  const glossaryPath  = path.join(siteDir, `config/glossary.${locale}.tsv`)
  const proposedPath  = path.join(siteDir, `config/glossary.${locale}.proposed.tsv`)
  const dbPath        = path.join(siteDir, 'translation.db')

  // Source → destination folder mappings
  const sources = [
    {
      folder:     path.join(siteDir, 'docs/tutorials'),
      destFolder: path.join(siteDir, 'i18n', locale, 'docusaurus-plugin-content-docs/current/tutorials'),
    },
    {
      folder:     path.join(siteDir, 'versioned_docs/version-byoc/tutorials'),
      destFolder: path.join(siteDir, 'i18n', locale, 'docusaurus-plugin-content-docs/version-byoc/tutorials'),
    },
  ]

  // ------------------------------------------------------------------
  // Audit-only mode: scan translated files without re-translating
  // ------------------------------------------------------------------
  if (auditOnly) {
    await auditAllFiles({ sources, untranslatables })
    return
  }

  // ------------------------------------------------------------------
  // Step 0c: approve proposed terms → promote into approved glossary
  // ------------------------------------------------------------------
  if (approveOnly) {
    await approveTerms({ proposedPath, glossaryPath, dryRun })
    return
  }

  // ------------------------------------------------------------------
  // Step 0a: term extraction (fast, local, always runs before translation)
  // ------------------------------------------------------------------
  if (!proposeOnly) {
    await harvestTerms({ sourceDirs: sources, glossaryPath, proposedPath, untranslatables, dryRun })
  }

  if (harvestOnly) {
    console.log('[i18n-translator] Done. Review proposed terms, then run --propose-terms to fill in translations.')
    return
  }

  // ------------------------------------------------------------------
  // Step 0b: LLM term proposals (optional, separate command)
  // ------------------------------------------------------------------
  if (proposeOnly) {
    await proposeTerms({ proposedPath, locale, llmConfig, dryRun })
    console.log(`[i18n-translator] Done. Review ${proposedPath} and merge approved rows into ${glossaryPath}`)
    return
  }

  // ------------------------------------------------------------------
  // Cache clear (standalone — no LLM needed)
  // ------------------------------------------------------------------
  if (clearCache) {
    const cache = await new TranslationCache(dbPath).ready()
    await cache.clearCache(locale)
    await cache.close()
    console.log(`[i18n-translator] Cache cleared for locale: ${locale}`)
    return
  }

  if (!llmConfig.baseUrl || !llmConfig.apiKey || !llmConfig.modelId) {
    console.error('[i18n-translator] LLM config missing (MODEL_API_BASE_URL / MODEL_API_KEY / MODEL_ID). Aborting.')
    process.exit(1)
  }

  // ------------------------------------------------------------------
  // Steps 1–5: translate changed/new files
  // ------------------------------------------------------------------
  const glossary     = loadGlossary(glossaryPath)
  const glossaryHash = hashGlossary(glossary, untranslatables)
  const limiter      = new Bottleneck({ maxConcurrent: throttle.maxConcurrent, minTime: throttle.minTime })
  const cache        = await new TranslationCache(dbPath).ready()

  // ------------------------------------------------------------------
  // Single-file mode: --file <path>
  // ------------------------------------------------------------------
  if (targetFile) {
    const sourcePath = path.isAbsolute(targetFile)
      ? targetFile
      : path.join(siteDir, targetFile)

    if (!fs.existsSync(sourcePath)) {
      console.error(`[i18n-translator] File not found: ${sourcePath}`)
      process.exit(1)
    }

    // Determine which source mapping this file belongs to
    const mapping = sources.find(({ folder }) => sourcePath.startsWith(folder))
    if (!mapping) {
      console.error(`[i18n-translator] File is not inside a known source folder:\n  ${sourcePath}`)
      console.error(`  Expected paths under:\n  ${sources.map(s => s.folder).join('\n  ')}`)
      process.exit(1)
    }

    const destPath = path.join(mapping.destFolder, path.relative(mapping.folder, sourcePath))
    const relPath  = path.relative(siteDir, sourcePath)

    console.log(`[i18n-translator] Translating: ${relPath}`)
    if (dryRun) console.log('[i18n-translator] (dry-run — output printed to stdout, nothing written)\n')

    await translateFile({ sourcePath, destPath, relPath, glossary, untranslatables, llmConfig, limiter, cache, locale, glossaryHash, dryRun, force: true })
    await cache.close()
    return
  }

  let translated = 0
  let skipped    = 0
  let removed    = 0

  for (const { folder, destFolder } of sources) {
    if (!fs.existsSync(folder)) continue

    const sourceFiles = walkDir(folder)
    const sourceRelPaths = new Set(sourceFiles.map(f => path.relative(folder, f)))

    // Full mirror cleanup: walk the dest folder on disk and delete any file
    // that has no corresponding source file, regardless of DB state.
    const folderRel = path.relative(siteDir, folder)
    const destFiles = walkDir(destFolder)
    for (const destFilePath of destFiles) {
      const rel = path.relative(destFolder, destFilePath)
      if (!sourceRelPaths.has(rel)) {
        if (!dryRun) {
          fs.unlinkSync(destFilePath)
          await cache.deleteFileRecord(path.join(folderRel, rel), locale)
        }
        console.log(`[i18n-translator]   🗑  removed ${rel}`)
        removed++
      }
    }

    // Translate new / changed files
    const tasks = []
    for (const sourcePath of sourceFiles) {
      const relPath = path.relative(siteDir, sourcePath)
      const destPath = path.join(destFolder, path.relative(folder, sourcePath))

      if (!forceAll) {
        const record = await cache.getFileRecord(relPath, locale)
        if (record) {
          const sourceContent = fs.readFileSync(sourcePath, 'utf8')
          const sourceHash = hashContent(sourceContent)
          if (record.sourceHash === sourceHash && record.glossaryHash === glossaryHash) {
            skipped++
            continue
          }
        }
      }

      tasks.push({ sourcePath, destPath, relPath })
    }

    console.log(`[i18n-translator] ${folder}: ${tasks.length} file(s) to translate, ${skipped} unchanged`)

    // Track sidebar_label values seen in this source folder to detect duplicates
    // that would cause Docusaurus to crash with "Multiple docs sidebar items
    // produce the same translation key". Each source folder is a separate
    // Docusaurus version so keys don't collide across folders.
    const sidebarLabelsSeen = new Map()

    for (const { sourcePath, destPath, relPath } of tasks) {
      try {
        await translateFile({
          sourcePath,
          destPath,
          relPath,
          glossary,
          untranslatables,
          llmConfig,
          limiter,
          cache,
          locale,
          glossaryHash,
          dryRun,
          force: forceAll,
          sidebarLabelsSeen,
        })
        translated++
      } catch (err) {
        console.error(`[i18n-translator]   ✗ ${relPath}: ${err.message}`)
      }
    }
  }

  // Back-fill sidebar_key on any existing category index docs that predate this
  // logic — prevents "duplicate translation key" crashes on locale builds.
  if (!dryRun) backfillSidebarKeys(sources, siteDir, locale)

  await cache.close()

  console.log(`[i18n-translator] Done. translated=${translated} skipped=${skipped} removed=${removed}`)
}

// ---------------------------------------------------------------------------
// Validate translated files and revert broken ones
// ---------------------------------------------------------------------------

/**
 * After translate-i18n + mdx-parse have run, compile every translated file
 * with @mdx-js/mdx. Files that still fail are:
 *   1. Reverted to their last committed state (git checkout HEAD -- <file>),
 *      or deleted if they were never committed (new file).
 *   2. Removed from both cache tables so the next translate-i18n run
 *      calls the LLM fresh instead of replaying the cached bad result.
 *
 * @param {{ sources: Array<{folder,destFolder}>, siteDir: string, locale: string, dbPath: string }} opts
 */
async function validateAndRevert({ sources, siteDir, locale, dbPath }) {
  const { compile } = await import('@mdx-js/mdx')
  const { spawnSync } = require('child_process')
  const cache = await new TranslationCache(dbPath).ready()

  const revertedPaths = []
  let kept = 0

  for (const { folder, destFolder } of sources) {
    if (!fs.existsSync(destFolder)) continue
    const destFiles = walkDir(destFolder)

    for (const destPath of destFiles) {
      const content = fs.readFileSync(destPath, 'utf8')

      let valid = true
      let failReason = null
      try {
        await compile(content, { development: false })
      } catch (err) {
        valid = false
        failReason = err.message?.split('\n')[0] ?? 'MDX compile error'
      }

      // Structural check: catches React render-time errors that compile() misses
      // (prose between TabItems, unbalanced Tabs/TabItem tags, escaped JSX tags)
      if (valid) {
        const structureErrors = validateMdxStructure(content)
        if (structureErrors.length) {
          valid = false
          failReason = structureErrors.join('; ')
        }
      }

      if (valid) {
        kept++
        continue
      }

      // --- Revert the file ---
      const relDest = path.relative(siteDir, destPath)
      console.warn(`[i18n-translator] invalid translation: ${relDest} — ${failReason}`)
      const gitShow = spawnSync('git', ['show', `HEAD:${relDest}`], { encoding: 'utf8', cwd: siteDir })
      if (gitShow.status === 0 && gitShow.stdout) {
        fs.writeFileSync(destPath, gitShow.stdout, 'utf8')
        console.warn(`[i18n-translator] reverted broken translation: ${relDest}`)
      } else {
        // New file — not in HEAD, just delete so it won't be committed
        fs.unlinkSync(destPath)
        console.warn(`[i18n-translator] deleted broken new translation: ${relDest}`)
      }

      // --- Invalidate cache so next run retranslates from LLM ---
      // Map dest path → source relPath (key used in i18n_file_manifest)
      const relFromDest = path.relative(destFolder, destPath)
      const sourcePath = path.join(folder, relFromDest)
      const relPath = path.relative(siteDir, sourcePath)

      const record = await cache.getFileRecord(relPath, locale)
      if (record) {
        await cache.deleteTranslation(record.sourceHash, locale, record.glossaryHash)
        await cache.deleteFileRecord(relPath, locale)
      }

      revertedPaths.push(relDest)
    }
  }

  await cache.close()
  console.log(`[i18n-translator] validate-and-revert done. kept=${kept} reverted=${revertedPaths.length}`)
  if (revertedPaths.length > 0) {
    console.log(`[i18n-translator] ${revertedPaths.length} file(s) reverted — will be retried on next translation run.`)
  }
  return revertedPaths
}

module.exports = { run, validateAndRevert }
