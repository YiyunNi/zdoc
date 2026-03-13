'use strict'

const fs = require('node:fs')
const path = require('node:path')

// ---------------------------------------------------------------------------
// Term extraction helpers
// ---------------------------------------------------------------------------

// Verbs that start feature descriptions / changelog entries — NOT UI labels.
const ACTION_VERB_RE = /^(Support|Enable|Disable|Configure|Manage|Use|Add|Delete|Remove|Create|Update|Fix|Improve|Allow|Prevent|Set|Get|List|Show|Display|Introduce|Change|Enhance|Optimize|Deprecate|Upgrade|Migrate|Import|Export|Filter|Sort|Search|Connect|Access|Assign|Grant|Revoke|Monitor|View|Edit|Copy|Move|Deploy|Scale|Back\s*up|Restore|Reset|Rename|Merge|Split|Pause|Resume|Stop|Start|Load|Release|Drop|Flush|Compact|Index|Query|Insert|Upsert|Initiate|Generate|Prepare|Switch|Verify|Review|Select|Modif)\b/i

// Common generic English words that don't need glossary entries — LLMs
// translate these correctly without guidance.
const GENERIC_WORDS = new Set([
  'True', 'False', 'None', 'Null', 'Yes', 'No',
  'OK', 'Done', 'Next', 'Back', 'Save', 'Cancel', 'Confirm', 'Continue', 'Submit', 'Close', 'Apply',
  'Status', 'State', 'Type', 'Value', 'Name', 'Description', 'Overview', 'Summary', 'Details',
  'Usage', 'Count', 'Min', 'Max', 'Size', 'Mode', 'Level', 'Target', 'Source', 'Output', 'Input',
  'Active', 'Inactive', 'Pending', 'Running', 'Stopped', 'Suspended', 'Deleted',
  'Error', 'Warning', 'Info', 'Note', 'Tip', 'Important', 'Example',
  'Standard', 'Custom', 'Default', 'Manual', 'Automatic', 'Scheduled',
  'Required', 'Optional',
  'Directory', 'Location', 'Region', 'Namespace', 'Endpoint', 'Endpoints',
  'Security', 'Permissions', 'Roles', 'Actions', 'Settings', 'Requirements',
  'Metrics', 'Architecture', 'Integration', 'Migration',
  'Organization', 'Project', 'Cluster', 'Clusters', 'Backups', 'Integrations',
  'Scalability', 'Subscription', 'Enterprise', 'Admin',
])

/**
 * Extract **bold terms** that look like UI labels.
 *
 * UI labels are short noun phrases (1–4 words) naming a field, button, setting,
 * or product tier. Heavily filtered to avoid code identifiers, formatting
 * artifacts, generic words, and descriptive phrases.
 */
function extractBoldTerms(content) {
  const terms = new Set()
  const re = /\*\*([^*\n]{2,60})\*\*/g
  let m
  while ((m = re.exec(content)) !== null) {
    const term = m[1].trim()
    const words = term.split(/\s+/)

    // Must contain at least one ASCII letter
    if (!/[a-zA-Z]/.test(term)) continue
    // Skip sentence fragments starting with punctuation: ", or select", ". For example"
    if (/^[,;.\-–—]/.test(term)) continue
    // Skip bold markdown links: **[text](url)**
    if (term.includes('[') || term.includes('(')) continue
    // Skip questions and full sentences (end with punctuation)
    if (/[?.!]$/.test(term)) continue
    // Skip anything longer than 4 words
    if (words.length > 4) continue
    // Skip action-verb phrases
    if (ACTION_VERB_RE.test(term)) continue

    // --- Code identifier filters ---
    // ALL_CAPS single word (constants, enum values: VARCHAR, AUTOINDEX, L2, ARN)
    if (words.length === 1 && /^[A-Z0-9_\-]+$/.test(term)) continue
    // Every word is ALL_CAPS (status enums: IN PROGRESS, FLOAT VECTOR)
    if (words.length > 1 && words.every(w => /^[A-Z][A-Z0-9]*$/.test(w))) continue
    // snake_case, function_call(), file.name (underscore, parens, or dot without spaces)
    if (!/ /.test(term) && /[_()\.]/.test(term)) continue
    // camelCase identifiers (QueryIterator, BulkWriter, topK, VarChar)
    if (!/ /.test(term) && /[a-z][A-Z]/.test(term)) continue
    // Purely lowercase single word (code vars: id, color, vector, field)
    if (words.length === 1 && /^[a-z]/.test(term)) continue
    // Example variable names (my_*, PartitionA, PartitionB etc.)
    if (/^(my_|PartitionA|PartitionB)/.test(term)) continue

    // --- Formatting artifact filters ---
    // HTML entities
    if (term.includes('&#') || term.includes('\\&#')) continue
    // Button prefixes: + Create, + Add
    if (/^[+$\\@]/.test(term)) continue
    // Label headers with trailing colon: Token:, Frequency:, Peak hours:
    if (term.endsWith(':')) continue
    // Starts with article or number (descriptive phrases)
    if (/^(a |an |the |one |five |\d)/i.test(term)) continue

    // --- Generic single words already in the GENERIC_WORDS list ---
    if (words.length === 1 && GENERIC_WORDS.has(term)) continue

    terms.add(term)
  }
  return terms
}

/**
 * Extract `backtick labels` that look like UI terms (capital first letter,
 * not raw API params like `clusterName` or `{API_KEY}`).
 */
function extractBacktickTerms(content) {
  const terms = new Set()
  const re = /(?<!`)`([^`\n]{2,40})`(?!`)/g
  let m
  while ((m = re.exec(content)) !== null) {
    const term = m[1].trim()
    if (/^[A-Z]/.test(term) && !/[{}_]/.test(term)) terms.add(term)
  }
  return terms
}

/**
 * Extract high-frequency capitalized n-grams from prose text.
 * Fixes the "false ngram" bug: we only form a gram when the n consecutive
 * words in the ORIGINAL sequence are all capitalized — no filtering first.
 */
function extractNgrams(text, n, minFreq = 4) {
  const clean = text
    .replace(/^---[\s\S]*?---\n/m, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\bhttps?:\/\/\S+/g, ' ')
    .replace(/[*_`#>|[\](){}\\]/g, ' ')
    .replace(/\s+/g, ' ')

  // Tokenize preserving original order
  const tokens = clean.split(' ').map(w => w.replace(/[^a-zA-Z-]/g, '')).filter(Boolean)

  const freq = new Map()
  for (let i = 0; i <= tokens.length - n; i++) {
    const gram = tokens.slice(i, i + n)
    // All words in the gram must be capitalized (proper noun / UI phrase)
    if (!gram.every(w => /^[A-Z][a-zA-Z-]*$/.test(w) && w.length > 1)) continue
    const key = gram.join(' ')
    freq.set(key, (freq.get(key) || 0) + 1)
  }

  return [...freq.entries()]
    .filter(([, count]) => count >= minFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term)
}

// ---------------------------------------------------------------------------
// Glossary I/O
// ---------------------------------------------------------------------------

/**
 * Load a TSV glossary into a Map<source, target>.
 * Skips comment lines (starting with #) and malformed rows.
 */
function loadGlossary(filePath) {
  if (!fs.existsSync(filePath)) return new Map()
  const map = new Map()
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue
    const [source, target] = line.split('\t')
    if (source && target) map.set(source.trim(), target.trim())
  }
  return map
}

/**
 * Load the proposed TSV into an array of row objects.
 * Rows with an empty `target` are the ones that still need LLM proposals.
 */
function loadProposed(filePath) {
  if (!fs.existsSync(filePath)) return []
  const rows = []
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue
    const [source = '', target = '', keep_as_is = '', confidence = '', notes = ''] = line.split('\t')
    rows.push({ source: source.trim(), target: target.trim(), keep_as_is: keep_as_is.trim(), confidence: confidence.trim(), notes: notes.trim() })
  }
  return rows
}

function writeProposed(filePath, rows) {
  const header = '# source\ttarget\tkeep_as_is\tconfidence\tnotes\n'
  const body = rows.map(r => `${r.source}\t${r.target}\t${r.keep_as_is}\t${r.confidence}\t${r.notes}`).join('\n')
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, header + body + '\n', 'utf8')
}

// ---------------------------------------------------------------------------
// Directory walker
// ---------------------------------------------------------------------------

function walkDir(dir) {
  const results = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) results.push(...walkDir(full))
    else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) results.push(full)
  }
  return results
}

// ---------------------------------------------------------------------------
// Phase 1 — extraction (fast, local, no LLM)
// ---------------------------------------------------------------------------

/**
 * Scan source docs and write all candidate terms to `proposedPath` with
 * empty `target` columns. Fast — no LLM calls.
 *
 * Existing rows in `proposedPath` are preserved; only new terms are appended.
 * Terms already confirmed in `glossaryPath` are skipped.
 */
async function harvestTerms({ sourceDirs, glossaryPath, proposedPath, untranslatables = [], dryRun = false }) {
  console.log('[i18n-translator] Step 0a: extracting candidate terms...')

  const existingGlossary = loadGlossary(glossaryPath)
  // Case-insensitive lookup sets for dedup
  const glossaryLower   = new Set([...existingGlossary.keys()].map(k => k.toLowerCase()))
  const existingProposed = new Set(loadProposed(proposedPath).map(r => r.source.toLowerCase()))
  const untranslatableSet = new Set(untranslatables.map(t => t.toLowerCase().trim()).filter(Boolean))

  // term → { signals: Set<string>, sections: Set<string> }
  const termData = new Map()

  // Deduplicate files across source folders by content hash — shared content
  // between docs/tutorials/ and versioned_docs/ should only be counted once.
  const seenHashes = new Set()

  const crypto = require('node:crypto')

  for (const { folder } of sourceDirs) {
    if (!fs.existsSync(folder)) continue
    const files = walkDir(folder)
    console.log(`[i18n-translator]   scanning ${files.length} files in ${folder}`)

    const uniqueFiles = []
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      const hash = crypto.createHash('md5').update(content).digest('hex')
      if (seenHashes.has(hash)) continue
      seenHashes.add(hash)
      uniqueFiles.push({ file, content })
    }

    const skipped = files.length - uniqueFiles.length
    if (skipped > 0) console.log(`[i18n-translator]   skipped ${skipped} duplicate files (shared with another source folder)`)

    const addTerm = (term, signal, section) => {
      if (!termData.has(term)) termData.set(term, { signals: new Set(), sections: new Set() })
      termData.get(term).signals.add(signal)
      termData.get(term).sections.add(section)
    }

    for (const { file, content } of uniqueFiles) {
      // Section = immediate parent directory name (e.g. "cluster", "security")
      const section = path.basename(path.dirname(file))

      for (const term of extractBoldTerms(content))    addTerm(term, 'bold',    section)
      for (const term of extractBacktickTerms(content)) addTerm(term, 'backtick', section)
    }

    // Corpus-wide ngrams over deduplicated content only
    const allText = uniqueFiles.map(f => f.content).join('\n')
    for (const term of extractNgrams(allText, 2, 5)) addTerm(term, 'ngram-2', '__corpus__')
    for (const term of extractNgrams(allText, 3, 3)) addTerm(term, 'ngram-3', '__corpus__')
  }

  // Filter candidates
  const newCandidates = []
  for (const [term, { signals, sections }] of termData.entries()) {
    const lower = term.toLowerCase()
    // Skip if already in confirmed glossary (case-insensitive)
    if (glossaryLower.has(lower)) continue
    // Skip if already in proposed file (case-insensitive)
    if (existingProposed.has(lower)) continue
    // Skip if the term is in the untranslatables list
    if (untranslatableSet.has(lower)) continue
    // Skip if every word of the term is in the untranslatables list
    if (term.split(/\s+/).every(w => untranslatableSet.has(w.toLowerCase()))) continue
    // Require cross-section presence for non-bold terms
    const minSections = signals.has('bold') ? 1 : 2
    const realSections = [...sections].filter(s => s !== '__corpus__')
    if (realSections.length < minSections) continue
    newCandidates.push({ term, signals: [...signals], sectionCount: realSections.length })
  }

  // Sort: bold first → backtick → ngram; then by section spread (more sections = higher priority)
  newCandidates.sort((a, b) => {
    const rank = s => s.includes('bold') ? 2 : s.includes('backtick') ? 1 : 0
    const diff = rank(b.signals) - rank(a.signals)
    return diff !== 0 ? diff : b.sectionCount - a.sectionCount
  })

  console.log(`[i18n-translator] Found ${newCandidates.length} new candidate terms`)

  if (!newCandidates.length) {
    console.log('[i18n-translator] No new terms found — proposed file is already up to date.')
    return
  }

  // Append new candidates to the existing proposed file (empty target = pending)
  const existingRows = loadProposed(proposedPath)
  const newRows = newCandidates.map(c => ({
    source:     c.term,
    target:     '',
    keep_as_is: '',
    confidence: 'pending',
    notes:      `${c.signals.join(', ')} | ${c.sectionCount} section(s)`,
  }))
  const allRows = [...existingRows, ...newRows]

  if (dryRun) {
    console.log(`[i18n-translator] [dry-run] Would append ${newRows.length} terms to ${proposedPath}`)
    console.log(newRows.slice(0, 10).map(r => `  ${r.source} [${r.notes}]`).join('\n'))
    return
  }

  writeProposed(proposedPath, allRows)
  console.log(`[i18n-translator] Appended ${newRows.length} terms → ${proposedPath}`)
  console.log(`[i18n-translator] Run --propose-terms to fill in translations, then merge to ${glossaryPath}`)
}

// ---------------------------------------------------------------------------
// Phase 2 — LLM proposal (slow, network, optional)
// ---------------------------------------------------------------------------

const LLM_TIMEOUT_MS = 60_000

async function fetchWithTimeout(url, options, timeoutMs = LLM_TIMEOUT_MS) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await require('node-fetch')(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Read `proposedPath`, call the LLM for every row whose `target` is empty,
 * and update the file in place. Rows that already have a `target` are skipped.
 */
async function proposeTerms({ proposedPath, locale, llmConfig, dryRun = false }) {
  console.log('[i18n-translator] Step 0b: proposing translations for pending terms...')

  const { baseUrl, apiKey, modelId } = llmConfig || {}
  if (!baseUrl || !apiKey || !modelId) {
    console.error('[i18n-translator] LLM config missing — cannot propose translations.')
    process.exit(1)
  }

  const rows = loadProposed(proposedPath)
  const pending = rows.filter(r => !r.target)

  if (!pending.length) {
    console.log('[i18n-translator] No pending terms — all rows already have translations.')
    return
  }

  console.log(`[i18n-translator] Proposing translations for ${pending.length} terms...`)

  const batchSize = 40
  const proposed = new Map() // source → { target, keep_as_is, confidence, notes }

  for (let i = 0; i < pending.length; i += batchSize) {
    const batch = pending.slice(i, i + batchSize)
    const termList = batch.map((r, j) => `${j + 1}. ${r.source} [${r.notes}]`).join('\n')

    console.log(`[i18n-translator]   batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(pending.length / batchSize)} (${batch.length} terms)`)

    const systemPrompt = `You are a Japanese technical translator for Zilliz Cloud, a vector database SaaS product.

For each numbered English term, respond with a TSV row (tab-separated, no header):
  source<TAB>target<TAB>keep_as_is<TAB>confidence<TAB>notes

Column rules:
- source: copy the term exactly as given (strip the bracketed signal hint)
- target: the standard Japanese translation for technical documentation
- keep_as_is: "true" if the term should stay in English (proper nouns, acronyms, SDK names, API field names, product tier names like "Free"/"Serverless"/"Dedicated"); "false" otherwise
- confidence: "high", "medium", or "low"
- notes: one-line reasoning (optional)

If keep_as_is is true, set target equal to source.
Respond with ONLY the ${batch.length} TSV rows, one per line, no header, no explanation.`

    try {
      const response = await fetchWithTimeout(
        `${baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelId,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Terms:\n${termList}` },
            ],
            temperature: 0.1,
          }),
        }
      )

      const data = await response.json()
      if (!response.ok || !data.choices?.[0]?.message?.content) {
        console.error('[i18n-translator]   LLM error:', JSON.stringify(data).slice(0, 200))
        continue
      }

      const lines = data.choices[0].message.content.trim().split('\n')
      for (let j = 0; j < batch.length; j++) {
        const parts = (lines[j] || '').split('\t')
        proposed.set(batch[j].source, {
          target:     parts[1]?.trim() || '',
          keep_as_is: parts[2]?.trim() || 'false',
          confidence: parts[3]?.trim() || 'unknown',
          notes:      parts[4]?.trim() || batch[j].notes,
        })
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error(`[i18n-translator]   batch timed out after ${LLM_TIMEOUT_MS / 1000}s — skipping`)
      } else {
        console.error('[i18n-translator]   fetch error:', err.message)
      }
    }
  }

  // Merge proposals back into the full rows array
  const updated = rows.map(r => {
    if (proposed.has(r.source)) return { ...r, ...proposed.get(r.source) }
    return r
  })

  if (dryRun) {
    console.log(`[i18n-translator] [dry-run] Would update ${proposed.size} rows in ${proposedPath}`)
    return
  }

  writeProposed(proposedPath, updated)
  console.log(`[i18n-translator] Updated ${proposed.size} rows in ${proposedPath}`)
}

// ---------------------------------------------------------------------------
// Approve terms: promote proposed.tsv rows into the approved glossary TSV
// ---------------------------------------------------------------------------

/**
 * Reads proposed.tsv and promotes rows into glossary.<locale>.tsv.
 *
 * Promotion criteria (all must be true):
 *   - keep_as_is !== 'true'   (keep_as_is=true means "leave as English" — not a glossary entry)
 *   - confidence === 'high'   (LLM was confident; lower confidence rows need manual review)
 *   - target is non-empty
 *   - source not already present in the approved glossary (no overwrites)
 *
 * keep_as_is=true rows are printed as suggestions for the untranslatables config but not written.
 */
async function approveTerms({ proposedPath, glossaryPath, dryRun = false }) {
  if (!fs.existsSync(proposedPath)) {
    console.error(`[i18n-translator] Proposed glossary not found: ${proposedPath}`)
    console.error('  Run --harvest-terms then --propose-terms first.')
    return
  }

  const rows = loadProposed(proposedPath)
  const existing = loadGlossary(glossaryPath)

  const toAdd = []
  const keepAsIs = []
  const skipped = []

  for (const row of rows) {
    if (row.keep_as_is === 'true') {
      keepAsIs.push(row.source)
      continue
    }
    if (!row.target || row.confidence !== 'high') {
      skipped.push(`${row.source} (confidence=${row.confidence || 'empty'}, target=${row.target || 'empty'})`)
      continue
    }
    if (existing.has(row.source)) {
      skipped.push(`${row.source} (already in approved glossary)`)
      continue
    }
    toAdd.push(row)
  }

  if (dryRun) {
    console.log(`[i18n-translator] [dry-run] Would add ${toAdd.length} term(s) to ${glossaryPath}:`)
    for (const r of toAdd) console.log(`  ${r.source} → ${r.target}`)
  } else {
    // Append to existing glossary (or create it)
    fs.mkdirSync(path.dirname(glossaryPath), { recursive: true })
    const lines = toAdd.map(r => `${r.source}\t${r.target}`).join('\n')
    if (toAdd.length > 0) {
      const existing_content = fs.existsSync(glossaryPath) ? fs.readFileSync(glossaryPath, 'utf8') : ''
      const separator = existing_content && !existing_content.endsWith('\n') ? '\n' : ''
      fs.writeFileSync(glossaryPath, existing_content + separator + lines + '\n', 'utf8')
    }
    console.log(`[i18n-translator] Approved ${toAdd.length} term(s) → ${glossaryPath}`)
  }

  if (skipped.length) {
    console.log(`[i18n-translator] Skipped ${skipped.length} term(s) (low confidence or already approved):`)
    for (const s of skipped) console.log(`  ${s}`)
  }

  if (keepAsIs.length) {
    console.log(`[i18n-translator] ${keepAsIs.length} term(s) marked keep_as_is=true (consider adding to untranslatables config):`)
    for (const s of keepAsIs) console.log(`  ${s}`)
  }
}

module.exports = { harvestTerms, proposeTerms, approveTerms, loadGlossary, walkDir }
