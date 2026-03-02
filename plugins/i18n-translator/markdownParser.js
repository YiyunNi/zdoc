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

module.exports = {
  parseFrontmatter,
  extractTranslatableFields,
  applyTranslatedFields,
  stripEditorialFields,
  splitBodyIntoChunks,
}
