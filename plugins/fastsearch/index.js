'use strict';

const fs = require('node:fs');
const path = require('node:path');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse YAML frontmatter from raw markdown content (no js-yaml dep — regex only).
 * Returns a plain object with string/boolean/number values for known fields.
 * @param {string} content
 * @returns {Record<string, any>}
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const block = match[1];
  const result = {};
  for (const line of block.split(/\r?\n/)) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, raw] = kv;
    const val = raw.trim().replace(/^['"]|['"]$/g, '');
    result[key] = val;
  }
  return result;
}

/**
 * Strip markdown formatting to produce plain text for search indexing.
 * Removes: frontmatter, fenced code blocks, HTML tags, links, images,
 * headings, emphasis, horizontal rules, and excess whitespace.
 * @param {string} text
 * @returns {string}
 */
function stripMarkdown(text) {
  return text
    .replace(/^---[\s\S]*?^---\s*/m, '')           // frontmatter
    .replace(/```[\s\S]*?```/g, '')                  // fenced code blocks
    .replace(/`[^`]*`/g, '')                         // inline code
    .replace(/<[^>]+>/g, '')                         // HTML tags
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')        // images → alt text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')         // links → text
    .replace(/^#{1,6}\s+/gm, '')                     // headings
    .replace(/(\*\*|__)(.*?)\1/g, '$2')              // bold
    .replace(/(\*|_)(.*?)\1/g, '$2')                 // italic
    .replace(/^[-*_]{3,}\s*$/gm, '')                 // hr
    .replace(/^\s*[-*+]\s+/gm, '')                   // list bullets
    .replace(/^\s*\d+\.\s+/gm, '')                   // numbered list
    .replace(/\n{3,}/g, '\n\n')                      // collapse blank lines
    .trim();
}

/**
 * Build a canonical URL path from frontmatter slug or file path.
 * @param {Record<string, any>} fm
 * @param {string} filePath   Absolute path to the .md/.mdx file
 * @param {string} srcDir     Absolute path to the source folder (e.g. docs/tutorials)
 * @param {string} route      URL prefix, e.g. "/docs"
 * @returns {string}          URL path, e.g. "/docs/home"
 */
function buildDocUrl(fm, filePath, srcDir, route) {
  if (fm.slug) {
    const slug = String(fm.slug).replace(/^\//, '');
    return `${route}/${slug}`.replace(/\/\/+/g, '/');
  }
  const rel = path.relative(srcDir, filePath)
    .replace(/\.mdx?$/, '')
    .replace(/\\/g, '/');
  return `${route}/${rel}`.replace(/\/\/+/g, '/');
}

/**
 * Recursively walk a directory and yield .md/.mdx file paths.
 * @param {string} dir
 * @returns {AsyncGenerator<string>}
 */
async function* walkDir(dir) {
  let entries;
  try {
    entries = await fs.promises.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkDir(full);
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      yield full;
    }
  }
}

/**
 * Scan a single source definition and return an array of indexed doc objects.
 * @param {string} siteDir
 * @param {{ folder: string, route: string, sectionLabel: string }} src
 * @returns {Promise<object[]>}
 */
async function scanSource(siteDir, src) {
  const { folder, route, sectionLabel } = src;
  const srcDir = path.join(siteDir, folder);

  const docs = [];
  let nextId = 1;

  for await (const filePath of walkDir(srcDir)) {
    let content;
    try {
      content = await fs.promises.readFile(filePath, 'utf-8');
    } catch {
      continue;
    }

    const fm = parseFrontmatter(content);
    const title = String(fm.sidebar_label || fm.title || path.basename(filePath, path.extname(filePath)));
    const description = fm.description ? String(fm.description) : '';
    const url = buildDocUrl(fm, filePath, srcDir, route);

    // Derive section name from the first path component under srcDir
    const rel = path.relative(srcDir, filePath).replace(/\\/g, '/');
    const section = rel.split('/')[0].replace(/\.mdx?$/, '');

    const body = stripMarkdown(content).slice(0, 5000); // cap body size

    docs.push({
      id: nextId++,
      url,
      title,
      sidebar_label: fm.sidebar_label ? String(fm.sidebar_label) : title,
      description,
      section,
      sectionLabel: sectionLabel || section,
      body,
    });
  }

  return docs;
}

// ---------------------------------------------------------------------------
// Docusaurus Plugin
// ---------------------------------------------------------------------------

/**
 * @param {object} context  Docusaurus plugin context
 * @param {object} [options]
 * @param {{ folder: string, route: string, sectionLabel: string }[]} [options.sources]
 * @param {string} [options.outputPath]
 * @param {{ bucket: string, key?: string, region?: string }} [options.s3]
 */
module.exports = function pluginFastsearch(context, options) {
  const {
    sources = [],
    outputPath = 'fastsearch-index.json',
    s3,
  } = options || {};

  return {
    name: 'fastsearch',

    async postBuild({ siteDir, outDir }) {
      // Scan all sources concurrently
      const perSourceDocs = await Promise.all(
        sources.map((src) => scanSource(siteDir, src))
      );

      // Merge and assign global IDs
      let globalId = 1;
      const allDocs = [];
      for (const docs of perSourceDocs) {
        for (const doc of docs) {
          allDocs.push({ ...doc, id: globalId++ });
        }
      }

      const index = { docs: allDocs };
      const json = JSON.stringify(index);

      // Write to build output
      const destPath = path.join(outDir, outputPath);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, json, 'utf-8');
      console.log(`[fastsearch] Wrote ${destPath} — ${allDocs.length} docs indexed.`);

      // Optional S3 upload
      if (s3 && s3.bucket) {
        try {
          const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
          const client = new S3Client({ region: s3.region || 'us-east-1' });
          const key = s3.key || outputPath;
          await client.send(new PutObjectCommand({
            Bucket: s3.bucket,
            Key: key,
            Body: json,
            ContentType: 'application/json',
            CacheControl: 'public, max-age=3600',
          }));
          const region = s3.region || 'us-east-1';
          const publicUrl = `https://${s3.bucket}.s3.${region}.amazonaws.com/${key}`;
          console.log(`[fastsearch] Uploaded → ${publicUrl}`);
        } catch (err) {
          console.error('[fastsearch] S3 upload failed:', err.message);
        }
      }
    },
  };
};
