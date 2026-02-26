#!/usr/bin/env node
'use strict';

/**
 * Zilliz Cloud Docs MCP Server
 *
 * Exposes four tools for searching and retrieving Zilliz Cloud documentation:
 *   search_docs        — full-text search across all docs
 *   get_doc            — fetch raw markdown for a specific doc URL
 *   list_sections      — list all available doc sections
 *   search_by_section  — search within a specific section
 *
 * Transport: MCP stdio (NDJSON over stdin/stdout).
 * Index:     Fetched from FASTSEARCH_INDEX_URL (or --index <url>),
 *            cached to os.tmpdir() with configurable TTL.
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const https = require('node:https');
const http = require('node:http');
const crypto = require('node:crypto');
const readline = require('node:readline');
const { Document } = require('flexsearch');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// Index is served from S3 — not from the docs site — to avoid affecting user page loads.
// This URL must match the S3 bucket configured in docusaurus.config.js.
// Override with FASTSEARCH_INDEX_URL env var or --index <url> for local testing.
const DEFAULT_INDEX_URL = 'https://<AWS_BUCKET>.s3.<AWS_REGION>.amazonaws.com/fastsearch-index.json';
const DEFAULT_SITE_URL = 'https://docs.zilliz.com';
const CACHE_TTL_MS = (parseInt(process.env.FASTSEARCH_CACHE_TTL_MINUTES || '60', 10)) * 60 * 1000;

// Parse --index <url> CLI arg
let cliIndexUrl = null;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--index' && args[i + 1]) {
    cliIndexUrl = args[i + 1];
    break;
  }
}

const INDEX_URL = cliIndexUrl || process.env.FASTSEARCH_INDEX_URL || DEFAULT_INDEX_URL;
const SITE_URL = (process.env.FASTSEARCH_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');

// ---------------------------------------------------------------------------
// Index loading + caching
// ---------------------------------------------------------------------------

/**
 * Compute a short hash of a string for use in cache filenames.
 * @param {string} str
 * @returns {string}
 */
function urlHash(str) {
  return crypto.createHash('md5').update(str).digest('hex').slice(0, 12);
}

const CACHE_FILE = path.join(os.tmpdir(), `zilliz-fastsearch-${urlHash(INDEX_URL)}.json`);

/**
 * Fetch a URL and return the body as a string.
 * Supports file://, http://, and https:// schemes.
 * @param {string} url
 * @returns {Promise<string>}
 */
function fetchUrl(url) {
  if (url.startsWith('file://')) {
    const filePath = url.replace(/^file:\/\//, '');
    return fs.promises.readFile(filePath, 'utf-8');
  }
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https://') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(fetchUrl(res.headers.location));
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} fetching ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/** @type {{ docs: object[], loadedAt: number } | null} */
let cachedIndex = null;

/**
 * Load the search index, using a file-based cache.
 * @returns {Promise<object[]>}
 */
async function loadIndex() {
  const now = Date.now();

  // In-memory cache still fresh?
  if (cachedIndex && (now - cachedIndex.loadedAt) < CACHE_TTL_MS) {
    return cachedIndex.docs;
  }

  // Try file cache
  try {
    const stat = fs.statSync(CACHE_FILE);
    if ((now - stat.mtimeMs) < CACHE_TTL_MS) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      cachedIndex = { docs: parsed.docs, loadedAt: stat.mtimeMs };
      return cachedIndex.docs;
    }
  } catch {
    // Cache miss or invalid — fall through to fetch
  }

  // Fetch fresh index
  const raw = await fetchUrl(INDEX_URL);
  const parsed = JSON.parse(raw);
  fs.writeFileSync(CACHE_FILE, raw, 'utf-8');
  cachedIndex = { docs: parsed.docs, loadedAt: Date.now() };
  return cachedIndex.docs;
}

// ---------------------------------------------------------------------------
// FlexSearch index
// ---------------------------------------------------------------------------

/** @type {InstanceType<typeof Document> | null} */
let searchIndex = null;
/** @type {Map<number, object>} */
let docsById = new Map();

/**
 * Build (or rebuild) the FlexSearch Document index from raw docs array.
 * @param {object[]} docs
 */
function buildSearchIndex(docs) {
  searchIndex = new Document({
    tokenize: 'forward',
    document: {
      id: 'id',
      index: ['title', 'description', 'body'],
      store: ['url', 'title', 'description', 'section', 'sectionLabel'],
    },
  });

  docsById = new Map();
  for (const doc of docs) {
    searchIndex.add(doc);
    docsById.set(doc.id, doc);
  }
}

/**
 * Ensure index is loaded and built.
 */
async function ensureIndex() {
  const docs = await loadIndex();
  if (!searchIndex || docsById.size !== docs.length) {
    buildSearchIndex(docs);
  }
}

// ---------------------------------------------------------------------------
// Search helpers
// ---------------------------------------------------------------------------

/**
 * Extract a ~200-char excerpt from body containing the first query term.
 * @param {string} body
 * @param {string} query
 * @returns {string}
 */
function extractExcerpt(body, query) {
  if (!body) return '';
  const term = query.split(/\s+/)[0].toLowerCase();
  const idx = body.toLowerCase().indexOf(term);
  if (idx === -1) return body.slice(0, 200).trim();
  const start = Math.max(0, idx - 80);
  const end = Math.min(body.length, idx + 120);
  return (start > 0 ? '...' : '') + body.slice(start, end).trim() + (end < body.length ? '...' : '');
}

/**
 * Run a search query and return merged, deduplicated results.
 * @param {string} query
 * @param {{ limit?: number, section?: string }} [opts]
 * @returns {object[]}
 */
function runSearch(query, opts = {}) {
  const { limit = 10, section } = opts;
  if (!searchIndex) return [];

  const raw = searchIndex.search(query, { limit: limit * 3, enrich: true });

  // Merge results from all indexed fields, deduplicate by id
  const seen = new Map();
  for (const fieldResult of raw) {
    for (const item of (fieldResult.result || [])) {
      if (!seen.has(item.id)) {
        seen.set(item.id, item.doc);
      }
    }
  }

  // Filter by section if requested
  let results = [...seen.values()];
  if (section) {
    results = results.filter((d) => d.section === section || d.sectionLabel === section);
  }

  // Enrich with body for excerpt
  return results.slice(0, limit).map((doc) => {
    const full = docsById.get(Number(doc.id || 0));
    return {
      title: doc.title,
      url: doc.url,
      description: doc.description,
      excerpt: full ? extractExcerpt(String(full.body || ''), query) : '',
      section: doc.section,
      sectionLabel: doc.sectionLabel,
    };
  });
}

// ---------------------------------------------------------------------------
// Tool implementations
// ---------------------------------------------------------------------------

const TOOL_DEFS = [
  {
    name: 'search_docs',
    description: 'Full-text search across all Zilliz Cloud documentation.',
    inputSchema: {
      type: 'object',
      properties: {
        query:   { type: 'string',  description: 'Search query' },
        limit:   { type: 'number',  description: 'Max results (default 10)' },
        section: { type: 'string',  description: 'Filter by section slug or label (optional)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_doc',
    description: 'Fetch the raw markdown content of a documentation page by its URL path.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL path of the doc, e.g. /docs/home' },
      },
      required: ['url'],
    },
  },
  {
    name: 'list_sections',
    description: 'List all available documentation sections with doc counts.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'search_by_section',
    description: 'Search within a specific documentation section.',
    inputSchema: {
      type: 'object',
      properties: {
        section: { type: 'string', description: 'Section slug or label' },
        query:   { type: 'string', description: 'Search query' },
        limit:   { type: 'number', description: 'Max results (default 10)' },
      },
      required: ['section', 'query'],
    },
  },
];

/**
 * Fetch raw markdown from `${SITE_URL}${url}.md`.
 * @param {string} url  Doc URL path, e.g. /docs/home
 * @returns {Promise<string>}
 */
async function toolGetDoc(url) {
  const normalised = url.replace(/\.md$/, '');
  const fetchTarget = `${SITE_URL}${normalised}.md`;
  try {
    return await fetchUrl(fetchTarget);
  } catch (err) {
    return `Error fetching ${fetchTarget}: ${err.message}`;
  }
}

/**
 * List sections from loaded docs.
 * @returns {object[]}
 */
function toolListSections() {
  const counts = new Map();
  for (const doc of docsById.values()) {
    const key = doc.section || '';
    if (!counts.has(key)) {
      counts.set(key, { section: doc.section, sectionLabel: doc.sectionLabel, count: 0 });
    }
    counts.get(key).count++;
  }
  return [...counts.values()].sort((a, b) => a.sectionLabel.localeCompare(b.sectionLabel));
}

/**
 * Dispatch a tool call and return a text result.
 * @param {string} name
 * @param {object} args
 * @returns {Promise<string>}
 */
async function callTool(name, args) {
  await ensureIndex();

  if (name === 'search_docs') {
    const results = runSearch(String(args.query || ''), {
      limit: Number(args.limit) || 10,
      section: args.section,
    });
    return JSON.stringify(results, null, 2);
  }

  if (name === 'get_doc') {
    return toolGetDoc(String(args.url || ''));
  }

  if (name === 'list_sections') {
    return JSON.stringify(toolListSections(), null, 2);
  }

  if (name === 'search_by_section') {
    const results = runSearch(String(args.query || ''), {
      limit: Number(args.limit) || 10,
      section: String(args.section || ''),
    });
    return JSON.stringify(results, null, 2);
  }

  throw new Error(`Unknown tool: ${name}`);
}

// ---------------------------------------------------------------------------
// JSON-RPC 2.0 stdio transport
// ---------------------------------------------------------------------------

/**
 * Write a JSON-RPC response to stdout.
 * @param {object} msg
 */
function respond(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

/**
 * Handle a single parsed JSON-RPC message.
 * @param {object} msg
 */
async function handleMessage(msg) {
  const { id, method, params } = msg;

  if (method === 'initialize') {
    respond({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'zilliz-doc-search', version: '1.0.0' },
      },
    });
    return;
  }

  if (method === 'notifications/initialized') {
    // No response needed for notifications
    return;
  }

  if (method === 'tools/list') {
    respond({
      jsonrpc: '2.0',
      id,
      result: { tools: TOOL_DEFS },
    });
    return;
  }

  if (method === 'tools/call') {
    const toolName = params && params.name;
    const toolArgs = (params && params.arguments) || {};
    try {
      const text = await callTool(toolName, toolArgs);
      respond({
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text }],
        },
      });
    } catch (err) {
      respond({
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: `Error: ${err.message}` }],
          isError: true,
        },
      });
    }
    return;
  }

  // Unknown method
  if (id !== undefined) {
    respond({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Method not found: ${method}` },
    });
  }
}

// ---------------------------------------------------------------------------
// Main: read NDJSON from stdin
// ---------------------------------------------------------------------------

const rl = readline.createInterface({ input: process.stdin, terminal: false });

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    respond({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
    return;
  }
  handleMessage(msg).catch((err) => {
    process.stderr.write(`[server] Unhandled error: ${err.message}\n`);
  });
});

rl.on('close', () => {
  process.exit(0);
});
