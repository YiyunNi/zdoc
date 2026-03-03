'use strict'

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/

/** Split content into frontmatter string + body string */
function parseFrontmatter(content) {
  const match = content.match(FRONTMATTER_RE)
  if (!match) return { frontmatter: null, body: content }
  return { frontmatter: match[1], body: content.slice(match[0].length) }
}

/**
 * Extract the fields we want to translate from raw frontmatter YAML text.
 * Returns { title, sidebar_label, description, keywords[] } — only present fields.
 */
function extractTranslatableFields(frontmatter) {
  const fields = {}

  const titleMatch = frontmatter.match(/^title:\s*"(.+?)"\s*$/m)
  if (titleMatch) fields.title = titleMatch[1]

  const labelMatch = frontmatter.match(/^sidebar_label:\s*"(.+?)"\s*$/m)
  if (labelMatch) fields.sidebar_label = labelMatch[1]

  const descMatch = frontmatter.match(/^description:\s*"(.+?)"\s*$/m)
  if (descMatch) fields.description = descMatch[1]

  // keywords block: one or more `  - value` lines after `keywords:`
  const kwMatch = frontmatter.match(/^keywords:\s*\n((?:[ \t]+-[ \t]+.+\n?)+)/m)
  if (kwMatch) {
    fields.keywords = kwMatch[1]
      .split('\n')
      .filter(l => /^[ \t]+-[ \t]+/.test(l))
      .map(l => l.replace(/^[ \t]+-[ \t]+/, '').trim())
      .filter(Boolean)
  }

  return fields
}

/**
 * Write translated field values back into the raw frontmatter string.
 * Only replaces fields that exist in `translated`.
 */
function applyTranslatedFields(frontmatter, translated) {
  let result = frontmatter

  if (translated.title) {
    result = result.replace(/^(title:\s*)"(.+?)"\s*$/m, `$1"${translated.title}"`)
  }
  if (translated.sidebar_label) {
    result = result.replace(/^(sidebar_label:\s*)"(.+?)"\s*$/m, `$1"${translated.sidebar_label}"`)
  }
  if (translated.description) {
    result = result.replace(/^(description:\s*)"(.+?)"\s*$/m, `$1"${translated.description}"`)
  }
  if (translated.keywords && translated.keywords.length) {
    result = result.replace(
      /^(keywords:\s*\n)((?:[ \t]+-[ \t]+.+\n?)+)/m,
      (_, prefix) => prefix + translated.keywords.map(k => `  - ${k}`).join('\n') + '\n'
    )
  }

  return result
}

/**
 * Remove editorial-only fields that exist in the English source but
 * should not appear in translated output files.
 */
function stripEditorialFields(frontmatter) {
  return frontmatter
    .replace(/^added_since:.*\n/m, '')
    .replace(/^last_modified:.*\n/m, '')
    .replace(/^deprecate_since:.*\n/m, '')
}

/**
 * Split a markdown body into alternating translatable/non-translatable chunks.
 *
 * Non-translatable chunks: fenced code blocks (``` ... ```) and bare import lines.
 * Translatable chunks: all prose between them (headings, paragraphs, lists, etc.)
 *
 * Code blocks pass through verbatim — the LLM never sees their content.
 */
function splitBodyIntoChunks(body) {
  const chunks = []
  const spans = []

  // Find fenced code blocks
  const CODE_BLOCK_RE = /```[\s\S]*?```/g
  let m
  while ((m = CODE_BLOCK_RE.exec(body)) !== null) {
    spans.push({ start: m.index, end: m.index + m[0].length })
  }

  // Find bare import lines not already inside a code block
  const IMPORT_LINE_RE = /^import .+$/gm
  while ((m = IMPORT_LINE_RE.exec(body)) !== null) {
    const insideCode = spans.some(s => m.index >= s.start && m.index < s.end)
    if (!insideCode) {
      spans.push({ start: m.index, end: m.index + m[0].length })
    }
  }

  // Sort and remove overlaps
  spans.sort((a, b) => a.start - b.start)
  const filtered = []
  let lastEnd = 0
  for (const span of spans) {
    if (span.start >= lastEnd) {
      filtered.push(span)
      lastEnd = span.end
    }
  }

  // Build alternating chunks
  let pos = 0
  for (const span of filtered) {
    if (span.start > pos) {
      chunks.push({ translate: true, content: body.slice(pos, span.start) })
    }
    chunks.push({ translate: false, content: body.slice(span.start, span.end) })
    pos = span.end
  }
  if (pos < body.length) {
    chunks.push({ translate: true, content: body.slice(pos) })
  }

  return chunks
}

/**
 * Replace JSX component tags and structural HTML block tags in a prose chunk
 * with numbered placeholders ({{TAG_0}}, {{TAG_1}}, …) before sending to the
 * LLM. This prevents the model from reordering, duplicating, or mis-closing
 * tags like <Tabs>, <TabItem>, <table>, <tr>, <td>, <ul>, <li>, etc.
 *
 * Targets:
 *   - PascalCase JSX components: <Tabs ...>, </Tabs>, <TabItem value="x">, …
 *   - Structural HTML block tags: table, thead, tbody, tr, td, th, ul, ol, li
 *
 * Inline formatting tags (b, em, strong, code, a …) are intentionally left
 * alone so the LLM can still translate their surrounding prose naturally.
 *
 * Returns { placeholderText, placeholders } where `placeholders` is the
 * ordered array of original tag strings.
 */
function placeholderifyTags(text) {
  const placeholders = []

  // Match opening tags (with optional attributes), closing tags, and
  // self-closing tags for PascalCase JSX components and structural HTML tags.
  const TAG_RE = /<\/?(?:[A-Z][A-Za-z0-9]*|table|thead|tbody|tfoot|tr|td|th|ul|ol|li)\b[^>]*\/?>/g

  const placeholderText = text.replace(TAG_RE, (match) => {
    const idx = placeholders.length
    placeholders.push(match)
    return `XTAG${idx}X`
  })

  return { placeholderText, placeholders }
}

/**
 * Restore {{TAG_N}} placeholders back to their original tag strings.
 * Any placeholder that the LLM dropped (hallucination or truncation) is
 * re-inserted as-is so the output remains structurally valid.
 * Any placeholder reference beyond the known range is left unchanged
 * (safe fallback — the MDX patcher can handle stray markers).
 *
 * Also normalises common LLM corruption patterns before matching:
 *   {{TAG_N}>  →  {{TAG_N}}  (dropped one closing brace; > is the tag delimiter)
 *   {TAG_N}}   →  {{TAG_N}}  (dropped one opening brace)
 */
function restorePlaceholders(text, placeholders) {
  return text.replace(/XTAG(\d+)X/g, (match, idx) => {
    const i = parseInt(idx, 10)
    return i < placeholders.length ? placeholders[i] : match
  })
}

module.exports = {
  parseFrontmatter,
  extractTranslatableFields,
  applyTranslatedFields,
  stripEditorialFields,
  splitBodyIntoChunks,
  placeholderifyTags,
  restorePlaceholders,
}
