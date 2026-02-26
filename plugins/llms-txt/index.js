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
 * @param {string} sectionDir   Absolute path to the section root dir
 * @param {string} route        URL route prefix, e.g. "/docs"
 * @param {string} siteUrl      Base URL, e.g. "https://docs.zilliz.com"
 */
function buildUrl(fm, filePath, sectionDir, route, siteUrl) {
  if (fm.slug) {
    const slug = String(fm.slug).replace(/^\//, '');
    return `${siteUrl}${route}/${slug}`.replace(/([^:])\/\/+/g, '$1/');
  }
  // Derive from path relative to section dir's parent (so route aligns)
  const rel = path.relative(path.dirname(sectionDir), filePath)
    .replace(/\.mdx?$/, '')
    .replace(/\\/g, '/');
  return `${siteUrl}${route}/${rel}`.replace(/([^:])\/\/+/g, '$1/');
}

/**
 * Collect all items from a section directory.
 *
 * Rules:
 *  - The section index file itself ({dirname}/{dirname}.md) is skipped.
 *  - Direct .md/.mdx files → each becomes an item.
 *  - Sub-directories that contain a same-name .md file → collapsed to
 *    a single item using that index file.
 *  - Sub-directories without a same-name .md file → recursed for more items.
 *
 * @param {string} sectionDir  Absolute path to the section root directory
 * @param {string} indexFile   Absolute path to the section's own index file (to skip)
 * @param {string} route
 * @param {string} siteUrl
 * @returns {{ title: string, url: string, description: string, position: number }[]}
 */
function collectItems(sectionDir, indexFile, route, siteUrl) {
  const items = [];

  const walk = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const subIndex = ['.md', '.mdx']
          .map((ext) => path.join(fullPath, entry.name + ext))
          .find(fs.existsSync);

        if (subIndex) {
          // Collapsed entry: use the sub-directory's own index file
          const fm = parseFrontmatter(subIndex);
          const title = fm.sidebar_label || fm.title;
          if (title) {
            items.push({
              title: cleanText(String(title)),
              url: buildUrl(fm, subIndex, sectionDir, route, siteUrl),
              description: fm.description ? cleanText(String(fm.description)) : '',
              position: Number(fm.sidebar_position) || 999,
            });
          }
        } else {
          // No same-name index — recurse to pick up loose .md files inside
          walk(fullPath);
        }
        continue;
      }

      if (!entry.name.endsWith('.md') && !entry.name.endsWith('.mdx')) continue;
      if (fullPath === indexFile) continue; // skip the section index itself

      const fm = parseFrontmatter(fullPath);
      const title = fm.sidebar_label || fm.title;
      if (!title) continue;

      items.push({
        title: cleanText(String(title)),
        url: buildUrl(fm, fullPath, sectionDir, route, siteUrl),
        description: fm.description ? cleanText(String(fm.description)) : '',
        position: Number(fm.sidebar_position) || 999,
      });
    }
  };

  walk(sectionDir);
  return items.sort((a, b) => a.position - b.position);
}

/**
 * Scan a source folder for sections (immediate subdirs with a same-name .md file).
 *
 * @param {string} sourceDir  Absolute path to the folder containing section subdirs
 * @param {string} route         URL route prefix
 * @param {string} siteUrl
 * @param {string} [sectionPrefix]  Optional prefix prepended to every section label, e.g. "BYOC"
 * @returns {{ label: string, description: string, position: number, items: ReturnType<typeof collectItems> }[]}
 */
function collectSections(sourceDir, route, siteUrl, sectionPrefix) {
  const sections = [];

  let entries;
  try {
    entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  } catch {
    console.warn(`[llms-txt] Source directory not found: ${sourceDir}`);
    return sections;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const sectionDir = path.join(sourceDir, entry.name);
    const indexFile = ['.md', '.mdx']
      .map((ext) => path.join(sectionDir, entry.name + ext))
      .find(fs.existsSync);

    // When no same-name index file exists, still create a section using the dir name
    const fm = indexFile ? parseFrontmatter(indexFile) : {};
    const rawLabel = fm.sidebar_label || fm.title || entry.name;
    let label = sectionPrefix
      ? `${sectionPrefix}: ${cleanText(String(rawLabel))}`
      : cleanText(String(rawLabel));

    // Append beta tag if present and not falsy/FALSE
    const betaVal = fm.beta;
    if (betaVal && betaVal !== false) {
      label = `${label} (${betaVal})`;
    }

    sections.push({
      label: cleanText(String(label)),
      description: fm.description ? cleanText(String(fm.description)) : '',
      position: Number(fm.sidebar_position) || 999,
      items: collectItems(sectionDir, indexFile || '', route, siteUrl),
    });
  }

  return sections.sort((a, b) => a.position - b.position);
}

/**
 * Render sections to llms.txt markdown format.
 * @param {ReturnType<typeof collectSections>} regularSections
 * @param {ReturnType<typeof collectSections>} optionalSections
 * @param {string} header
 * @param {string} summary
 */
function render(regularSections, optionalSections, header, summary) {
  const lines = [`# ${header}`, ''];

  if (summary) {
    lines.push(`> ${summary}`, '');
  }

  for (const { label, items } of regularSections) {
    lines.push(`## ${label}`);
    for (const { title, url, description } of items) {
      lines.push(`- [${title}](${url})${description ? ': ' + description : ''}`);
    }
    lines.push('');
  }

  if (optionalSections.length > 0) {
    lines.push('## Optional', '');
    for (const { label, items } of optionalSections) {
      lines.push(`## ${label}`);
      for (const { title, url, description } of items) {
        lines.push(`- [${title}](${url})${description ? ': ' + description : ''}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Docusaurus plugin: generates llms.txt at postBuild from source markdown files.
 *
 * Configuration:
 *   sources      — array of `{ folder, route }` where `folder` is the directory
 *                  that directly contains section sub-folders (each sub-folder
 *                  must have a same-name .md file as its index).
 *   outputPaths  — paths relative to outDir to write (default: ['llms.txt']).
 *
 * Header and summary are derived automatically from siteConfig.title / tagline.
 */
module.exports = function pluginLlmsTxt(context, options) {
  const {
    sources = /** @type {{ folder: string, route: string, sectionPrefix?: string, optional?: boolean }[]} */ ([]),
    outputPaths = /** @type {string[]} */ (['llms.txt']),
  } = options || {};

  return {
    name: 'llms-txt',

    async postBuild({ siteDir, outDir, siteConfig }) {
      const siteUrl = siteConfig.url;
      const header = siteConfig.title;
      const summary = siteConfig.tagline || '';

      // Collect sections from all sources, split into regular and optional
      const regularSections = [];
      const optionalSections = [];
      for (const { folder, route, sectionPrefix, optional } of sources) {
        const sections = collectSections(path.join(siteDir, folder), route, siteUrl, sectionPrefix);
        if (optional) {
          optionalSections.push(...sections);
        } else {
          regularSections.push(...sections);
        }
      }

      const allSections = [...regularSections, ...optionalSections];
      const content = render(regularSections, optionalSections, header, summary);

      for (const rel of outputPaths) {
        const dest = path.join(outDir, rel);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, content, 'utf-8');
      }

      const totalItems = allSections.reduce((n, s) => n + s.items.length, 0);
      const writtenPaths = outputPaths.map((rel) => path.join(outDir, rel));
      console.log(
        `[llms-txt] Wrote ${writtenPaths.join(', ')} — ` +
        `${allSections.length} sections, ${totalItems} items.`
      );
    },
  };
};
