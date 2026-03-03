'use strict';

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

/**
 * Parse YAML frontmatter from a markdown file.
 * @param {string} filePath
 * @returns {Record<string, any>}
 */
function parseFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return {};
    return /** @type {Record<string, any>} */ (yaml.load(match[1])) || {};
  } catch {
    return {};
  }
}

/**
 * Strip trailing " | Suffix" patterns common in Zilliz doc titles/descriptions,
 * and remove any inline markdown (links, emphasis, code) from plain-text fields.
 * @param {string} str
 */
function cleanText(str) {
  return str
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) → text
    .replace(/`([^`]+)`/g, '$1')              // `code` → code
    .replace(/\*+([^*]+)\*+/g, '$1')          // **bold** / *italic* → text
    .replace(/\s*\|.*$/, '')                   // trailing " | Cloud" suffix
    .trim();
}

/**
 * Build a canonical URL from frontmatter slug or file path.
 * @param {Record<string, any>} fm
 * @param {string} filePath     Absolute path to the .md file
 * @param {string} sectionDir   Absolute path to the source root dir
 * @param {string} route        URL route prefix, e.g. "/docs"
 * @param {string} siteUrl      Base URL, e.g. "https://docs.zilliz.com"
 */
function buildUrl(fm, filePath, sectionDir, route, siteUrl) {
  if (fm.slug) {
    const slug = String(fm.slug).replace(/^\//, '');
    return `${siteUrl}${route}/${slug}`.replace(/([^:])\/\/+/g, '$1/');
  }
  const rel = path.relative(path.dirname(sectionDir), filePath)
    .replace(/\.mdx?$/, '')
    .replace(/\\/g, '/');
  return `${siteUrl}${route}/${rel}`.replace(/([^:])\/\/+/g, '$1/');
}

/**
 * Strip MDX-specific syntax from raw markdown content, leaving clean prose + code blocks.
 * Processes line-by-line, preserving fenced code blocks as-is.
 * @param {string} rawContent
 * @returns {string}
 */
function stripMdxBody(rawContent) {
  // Remove frontmatter block
  const noFrontmatter = rawContent.replace(/^---[\s\S]*?^---[ \t]*\n/m, '');

  const lines = noFrontmatter.split('\n');
  const out = [];
  let inCodeFence = false;

  for (let line of lines) {
    // Track fenced code blocks (``` or ~~~); do not process MDX inside them
    if (/^(`{3,}|~{3,})/.test(line)) {
      inCodeFence = !inCodeFence;
      out.push(line);
      continue;
    }
    if (inCodeFence) {
      out.push(line);
      continue;
    }

    // Remove JS/TS import statements (MDX component imports)
    if (/^import\s+.+\s+from\s+['"]/.test(line)) continue;

    // Remove <Tabs> / </Tabs> wrapper tags
    if (/^<\/?(Tabs)[\s/>]/.test(line) || line.trim() === '</Tabs>') continue;

    // <TabItem value="python"> → **Python:** label
    const tabMatch = line.match(/^<TabItem\s[^>]*value=['"]([^'"]+)['"]/);
    if (tabMatch) {
      out.push(`**${tabMatch[1]}:**`);
      continue;
    }
    // </TabItem>
    if (/^<\/TabItem>/.test(line)) continue;

    // <Admonition type="..." title="Note"> → > **Note**
    const admonMatch = line.match(/^<Admonition[^>]*title="([^"]*)"[^>]*>/);
    if (admonMatch) {
      out.push(`> **${admonMatch[1]}**`);
      continue;
    }
    // </Admonition>
    if (/^<\/Admonition>/.test(line)) continue;

    // <Supademo .../> → [Interactive demo]
    if (/^<Supademo[\s/]/.test(line)) {
      out.push('[Interactive demo]');
      continue;
    }

    // Remove <DocCardList />, <Procedures>, </Procedures>
    if (/^<DocCardList[\s/>]/.test(line)) continue;
    if (/^<\/?(Procedures)[\s/>]/.test(line) || line.trim() === '</Procedures>') continue;

    // Remove bare <ul>, </ul>, <table>, </table> wrapper tags
    if (/^<\/?(ul|table)>/.test(line.trim())) continue;

    // Strip anchor IDs from headings: \{#id} or {#id}
    line = line.replace(/\\?\{#[a-z0-9-]+\}/g, '').trimEnd();

    // <li><p>content</p></li> → - content
    line = line.replace(/^<li><p>(.*?)<\/p><\/li>$/, '- $1');
    // <li>content</li> → - content
    line = line.replace(/^<li>(.*?)<\/li>$/, '- $1');

    // Strip bare <p> / </p> tags
    line = line.replace(/^<p>/, '').replace(/<\/p>$/, '');

    out.push(line);
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Recursively walk all .md/.mdx files in a directory, sorted by sidebar_position
 * at each level before descending into subdirectories.
 * @param {string} dir
 * @returns {string[]}
 */
function walkAllFiles(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  /** @type {{ path: string, pos: number }[]} */
  const files = [];
  const subdirs = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      subdirs.push(fullPath);
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      const pos = Number(parseFrontmatter(fullPath).sidebar_position) || 999;
      files.push({ path: fullPath, pos });
    }
  }

  files.sort((a, b) => a.pos - b.pos);

  const result = files.map((f) => f.path);
  for (const sub of subdirs) {
    result.push(...walkAllFiles(sub));
  }
  return result;
}

/**
 * Build full concatenated content for one source (all pages as markdown blocks).
 * Each page block is separated by a --- divider.
 * @param {string} sourceDir
 * @param {string} route
 * @param {string} siteUrl
 * @returns {{ content: string, count: number }}
 */
function buildSectionContent(sourceDir, route, siteUrl) {
  const files = walkAllFiles(sourceDir);
  const parts = [];

  for (const filePath of files) {
    let raw;
    try {
      raw = fs.readFileSync(filePath, 'utf-8');
    } catch {
      continue;
    }

    const fm = parseFrontmatter(filePath);
    const title = fm.sidebar_label || fm.title;
    if (!title) continue;

    const url = buildUrl(fm, filePath, sourceDir, route, siteUrl);
    const body = stripMdxBody(raw);

    // Remove the leading H1 from the stripped body to avoid duplication
    // (the page body typically opens with # Title, which we emit ourselves)
    const cleanedTitle = cleanText(String(title));
    const bodyLines = body.split('\n');
    const deduped = bodyLines[0] === `# ${cleanedTitle}`
      ? bodyLines.slice(1).join('\n').trimStart()
      : body;

    parts.push(`# ${cleanedTitle}\n\nURL: ${url}\n\n${deduped}`);
  }

  return {
    content: parts.join('\n\n---\n\n'),
    count: parts.length,
  };
}

/**
 * Render the slim root llms.txt that links to per-section content files.
 * @param {{ label: string, outputFile: string, optional?: boolean }[]} sources
 * @param {string} outDirUrl  Full URL prefix for section files, e.g. "https://docs.zilliz.com/llms"
 * @param {string} header
 * @param {string} summary
 */
function renderRoot(sources, outDirUrl, header, summary) {
  const lines = [`# ${header}`, ''];

  if (summary) {
    lines.push(`> ${summary}`, '');
  }

  const regular = sources.filter((s) => !s.optional);
  const optional = sources.filter((s) => s.optional);

  for (const { label, outputFile } of regular) {
    lines.push(`- [${label}](${outDirUrl}/${outputFile}.txt)`);
  }
  if (regular.length) lines.push('');

  if (optional.length > 0) {
    lines.push('## Optional', '');
    for (const { label, outputFile } of optional) {
      lines.push(`- [${label}](${outDirUrl}/${outputFile}.txt)`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Docusaurus plugin: generates a slim root llms.txt + per-section full-content files.
 *
 * Configuration:
 *   sources     — array of source descriptors:
 *                   folder      {string}   directory containing the docs (relative to siteDir)
 *                   route       {string}   URL route prefix, e.g. "/docs"
 *                   outputFile  {string}   filename (without extension) for the section file
 *                   label       {string}   display name used in root llms.txt link
 *                   optional    {boolean}  if true, listed under ## Optional in root file
 *   outputDir   — subdirectory (relative to outDir) for section files (default: 'llms')
 *   outputPaths — paths relative to outDir for the root index file (default: ['llms.txt'])
 */
module.exports = function pluginLlmsTxt(context, options) {
  const {
    sources = /** @type {{ folder: string, route: string, outputFile?: string, label?: string, sectionPrefix?: string, optional?: boolean }[]} */ ([]),
    outputDir = 'llms',
    outputPaths = /** @type {string[]} */ (['llms.txt']),
  } = options || {};

  return {
    name: 'llms-txt',

    async postBuild({ siteDir, outDir, siteConfig }) {
      const siteUrl = siteConfig.url;
      const header = siteConfig.title;
      const summary = siteConfig.tagline || '';
      const outDirUrl = `${siteUrl}/${outputDir}`;

      // Normalize sources: fill in defaults for label and outputFile
      const normalized = sources.map((s) => ({
        ...s,
        outputFile: s.outputFile || path.basename(s.folder),
        label: s.label || s.sectionPrefix || path.basename(s.folder),
      }));

      // Write per-section full content files
      let totalPages = 0;
      for (const { folder, route, outputFile } of normalized) {
        const sourceDir = path.join(siteDir, folder);
        const { content, count } = buildSectionContent(sourceDir, route, siteUrl);
        const dest = path.join(outDir, outputDir, `${outputFile}.txt`);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, content, 'utf-8');
        totalPages += count;
        console.log(`[llms-txt] ${dest} — ${count} pages`);
      }

      // Write root slim index
      const rootContent = renderRoot(normalized, outDirUrl, header, summary);
      for (const rel of outputPaths) {
        const dest = path.join(outDir, rel);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, rootContent, 'utf-8');
      }

      const writtenPaths = outputPaths.map((rel) => path.join(outDir, rel));
      console.log(
        `[llms-txt] Root index: ${writtenPaths.join(', ')} — ` +
        `${normalized.length} sections, ${totalPages} total pages.`
      );
    },
  };
};
