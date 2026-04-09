import type {ConfidenceLevel} from './types.js';
import {isDemotedSource} from './demotion.js';
import {getDb, resetDb} from './db.js';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const TOP_K = 6;
const DOCS_SITE_URL = (process.env.DOCS_SITE_URL || 'https://docs.zilliz.com').replace(/\/$/, '');
// INDEX_BASE_URL: base URL containing the llms index .txt files.
// In production, point to S3 (e.g. https://bucket.s3.region.amazonaws.com/llms-index).
// Falls back to the docs site's /llms/ directory.
const INDEX_BASE_URL = (process.env.INDEX_BASE_URL || `${DOCS_SITE_URL}/llms`).replace(/\/$/, '');

// ---------------------------------------------------------------------------
// Title sanitization — strip markdown heading IDs like {#slug-text}
// ---------------------------------------------------------------------------

function cleanTitle(title: string): string {
  return title
    .replace(/\\?\{#[^}]*\}?/g, '')
    .replace(/\\+$/, '')
    .trim();
}

// ---------------------------------------------------------------------------
// Search result types
// ---------------------------------------------------------------------------

export interface SearchResult {
  id: string;
  doc_url: string;
  doc_url_md: string;
  doc_title: string;
  section: string;
  content: string;
  score: number;
  weight: number;
  contextScore: number;
}

export function computeRetrievalConfidence(results: SearchResult[]): {level: ConfidenceLevel; avgScore: number} {
  if (results.length === 0) return {level: 'low', avgScore: 0};
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  const level: ConfidenceLevel = avgScore >= 0.8 ? 'high' : avgScore >= 0.5 ? 'medium' : 'low';
  return {level, avgScore};
}

// ---------------------------------------------------------------------------
// Language detection from retrieved content
// ---------------------------------------------------------------------------

const FENCE_TO_LANG: Record<string, string> = {
  python: 'Python', javascript: 'Node.js', typescript: 'Node.js',
  java: 'Java', go: 'Go', bash: 'REST/curl', shell: 'REST/curl', curl: 'REST/curl',
};

const SDK_PATTERNS: [RegExp, string][] = [
  [/pymilvus/i, 'Python'], [/milvus2-sdk-node|@zilliz/i, 'Node.js'],
  [/io\.milvus/i, 'Java'], [/milvus-sdk-go/i, 'Go'], [/\bcurl\s+-/i, 'REST/curl'],
];

const FENCE_RE = /```(python|javascript|typescript|java|go|bash|shell|curl)\b/gi;

export function detectLanguages(results: SearchResult[]): string[] {
  const langs = new Set<string>();
  for (const r of results) {
    for (const m of r.content.matchAll(FENCE_RE)) {
      const canon = FENCE_TO_LANG[m[1].toLowerCase()];
      if (canon) langs.add(canon);
    }
    for (const [re, lang] of SDK_PATTERNS) {
      if (re.test(r.content)) langs.add(lang);
    }
  }
  return [...langs].sort();
}

export interface DocEntry {
  title: string;
  url: string;
  type: string;
  languages: string[];
  description: string;
  section: string;
  searchText: string;
}

export function detectLanguagesFromEntries(entries: DocEntry[]): string[] {
  const langs = new Set<string>();
  for (const e of entries) {
    for (const l of e.languages) {
      const trimmed = l.trim();
      if (trimmed) langs.add(trimmed);
    }
  }
  return [...langs].sort();
}

// ---------------------------------------------------------------------------
// Index state
// ---------------------------------------------------------------------------

interface ParsedChunk {
  id: string;
  doc_url: string;
  doc_url_md: string;
  doc_title: string;
  section: string;
  content: string;
  weight: number;
}

let indexReady = false;
let lastRefreshedAt: string | null = null;

export function getIndexSize(): number {
  try {
    const db = getDb();
    const row = db.prepare('SELECT COUNT(*) as n FROM doc_chunks').get() as any;
    return row?.n ?? 0;
  } catch { return 0; }
}

export function getIndexStatus(): {ready: boolean; chunks: number; lastRefreshed: string | null} {
  let chunks = 0;
  if (indexReady) {
    try {
      const db = getDb();
      const row = db.prepare('SELECT COUNT(*) as n FROM doc_chunks').get() as any;
      chunks = row?.n ?? 0;
    } catch { /* db not ready yet */ }
  }
  return {ready: indexReady, chunks, lastRefreshed: lastRefreshedAt};
}

// ---------------------------------------------------------------------------
// FTS5 query builder
// ---------------------------------------------------------------------------

function queryToFTS(query: string): string {
  const tokens = query
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 1);
  if (tokens.length === 0) return '""';
  return tokens.map(t => `"${t.replace(/"/g, '')}"`).join(' OR ');
}

// ---------------------------------------------------------------------------
// FTS5 search
// ---------------------------------------------------------------------------

export function searchDocsFTS5(query: string, topK = TOP_K, sectionFilter?: string): SearchResult[] {
  if (!indexReady) return [];

  const ftsQuery = queryToFTS(query);
  const db = getDb();

  let sql = `
    SELECT c.id, c.doc_url, c.doc_url_md, c.doc_title, c.section,
           c.content, c.weight,
           bm25(doc_chunks_fts, 2.0, 1.0) AS rank
    FROM doc_chunks_fts f
    JOIN doc_chunks c ON c.rowid = f.rowid
    WHERE f.doc_chunks_fts MATCH ?
      AND c.doc_url != '/docs/home'`;

  const params: unknown[] = [ftsQuery];

  if (sectionFilter) {
    const m = sectionFilter.match(/section\s*(!=|==)\s*"([^"]+)"/);
    if (m) {
      sql += m[1] === '!=' ? ' AND c.section != ?' : ' AND c.section = ?';
      params.push(m[2]);
    }
  }

  sql += ' ORDER BY rank LIMIT ?';
  params.push(topK);

  try {
    const rows = db.prepare(sql).all(...params) as any[];
    const MAX_EXTERNAL = 2;
    let extCount = 0;
    const results: SearchResult[] = [];
    for (const r of rows) {
      if (r.id.startsWith('ext:')) {
        extCount++;
        if (extCount > MAX_EXTERNAL) continue;
      }
      results.push({
        id: r.id,
        doc_url: r.doc_url,
        doc_url_md: r.doc_url_md,
        doc_title: cleanTitle(r.doc_title),
        section: r.section,
        content: r.content,
        score: -r.rank,
        weight: r.weight,
        contextScore: -r.rank,
      });
    }
    console.log(`[RAG] FTS5 search: ${results.length} results${sectionFilter ? ` (filter: ${sectionFilter})` : ''}`);
    return results;
  } catch (err) {
    console.warn('[RAG] FTS5 search error:', (err as Error).message);
    return [];
  }
}

export function searchDocs(query: string, topK = TOP_K, sectionFilter?: string): SearchResult[] {
  return searchDocsFTS5(query, topK, sectionFilter);
}

// ---------------------------------------------------------------------------
// List pages — structural browse
// ---------------------------------------------------------------------------

export function listPages(sectionFilter?: string, titleContains?: string): {title: string; url: string; section: string}[] {
  if (!indexReady) return [];
  const db = getDb();

  let sql = `SELECT DISTINCT doc_url, doc_title, section FROM doc_chunks WHERE doc_url != '/docs/home'`;
  const params: unknown[] = [];

  if (sectionFilter) {
    const m = sectionFilter.match(/section\s*(!=|==)\s*"([^"]+)"/);
    if (m) {
      sql += m[1] === '!=' ? ' AND section != ?' : ' AND section = ?';
      params.push(m[2]);
    }
  }
  if (titleContains) {
    sql += ' AND doc_title LIKE ?';
    params.push(`%${titleContains}%`);
  }
  sql += ' LIMIT 200';

  try {
    return (db.prepare(sql).all(...params) as any[]).map(r => ({
      title: cleanTitle(r.doc_title),
      url: r.doc_url,
      section: r.section,
    }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Title lookup
// ---------------------------------------------------------------------------

export function getTitleByUrl(url: string): string | null {
  if (!indexReady) return null;
  const normalized = url.replace(/\.md$/, '');
  try {
    const db = getDb();
    const row = db.prepare(
      `SELECT doc_title FROM doc_chunks WHERE doc_url = ? LIMIT 1`
    ).get(normalized) as any;
    if (row) return cleanTitle(row.doc_title);
    // Try suffix match
    const path = normalized.startsWith('http')
      ? new URL(normalized).pathname
      : normalized;
    const row2 = db.prepare(
      `SELECT doc_title FROM doc_chunks WHERE doc_url LIKE ? LIMIT 1`
    ).get(`%${path}`) as any;
    return row2 ? cleanTitle(row2.doc_title) : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Index loading from llms.txt files
// ---------------------------------------------------------------------------

const FULL_INDEX_PATHS = [
  {path: '/cloud-guides.txt', section: 'cloud-guides'},
  {path: '/byoc-guides.txt', section: 'byoc-guides'},
  {path: '/api-reference.txt', section: 'api-reference'},
];

// Chunk size in characters (~500 tokens ≈ 2000 chars)
const CHUNK_SIZE = 2000;
const CHUNK_OVERLAP = 200;

export function chunkContent(content: string): string[] {
  if (content.length <= CHUNK_SIZE) return [content];
  const chunks: string[] = [];
  let start = 0;
  while (start < content.length) {
    const end = Math.min(start + CHUNK_SIZE, content.length);
    chunks.push(content.slice(start, end));
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}

/** Parse an llms.txt file into chunks for SQLite indexing.
 *  Handles both summary format (title + URL + description) and full-content format.
 *  Each ## heading becomes a doc; long docs are further chunked. */
function parseLlmsFullText(text: string, section: string): ParsedChunk[] {
  const chunks: ParsedChunk[] = [];
  const blocks = text.split(/^## /m).filter(Boolean);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length === 0) continue;

    const titleLine = lines[0].trim();
    const linkMatch = titleLine.match(/\[([^\]]+)\]\(([^)]+)\)/);
    let title = linkMatch ? linkMatch[1] : titleLine;
    let url = linkMatch ? linkMatch[2] : '';

    // Extract URL from "- URL: ..." metadata line if not in title
    if (!url) {
      const urlLine = lines.find(l => l.trim().startsWith('- URL:'));
      if (urlLine) url = urlLine.replace('- URL:', '').trim();
    }

    if (url && !url.startsWith('http')) {
      url = `${DOCS_SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    // Build searchable content: include metadata lines and description
    const contentLines = lines.slice(1).filter(l => {
      // Keep description lines (starting with >) and all non-metadata content
      const trimmed = l.trim();
      if (trimmed.startsWith('- URL:')) return false; // already extracted
      return true;
    });
    const content = contentLines.join('\n').trim();
    if (!title) continue;
    // Allow entries with just a title and URL (no content body)
    const searchContent = content || title;

    const contentChunks = chunkContent(searchContent);
    for (let i = 0; i < contentChunks.length; i++) {
      const chunkText = contentChunks[i];

      chunks.push({
        id: `${url}#${i}`,
        doc_url: url.replace(/\.md$/, ''),
        doc_url_md: url,
        doc_title: title,
        section,
        content: chunkText,
        weight: 1.0,
      });
    }
  }

  return chunks;
}

let indexLoading = false;

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {signal: AbortSignal.timeout(30000)});
      if (res.ok) return res;
      console.warn(`[RAG] Fetch ${url}: HTTP ${res.status} (attempt ${i + 1}/${retries})`);
    } catch (err) {
      console.warn(`[RAG] Fetch ${url} failed (attempt ${i + 1}/${retries}):`, (err as Error).message);
    }
    if (i < retries - 1) await new Promise(r => setTimeout(r, 2000 * (i + 1)));
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

export async function loadIndex(force = false): Promise<void> {
  if (indexLoading) return;
  if (indexReady && !force) return;
  indexLoading = true;

  console.log('[RAG] Loading doc index from', INDEX_BASE_URL);
  const allChunks: ParsedChunk[] = [];

  for (const {path, section} of FULL_INDEX_PATHS) {
    try {
      const res = await fetchWithRetry(`${INDEX_BASE_URL}${path}`);
      const text = await res.text();
      const chunks = parseLlmsFullText(text, section);
      allChunks.push(...chunks);
      console.log(`[RAG] Loaded ${chunks.length} chunks from ${path}`);
    } catch (err) {
      console.warn(`[RAG] Skipping ${path}:`, (err as Error).message);
    }
  }

  if (allChunks.length > 0) {
    const db = getDb();
    resetDb();

    const insert = db.prepare(`
      INSERT INTO doc_chunks (id, doc_url, doc_url_md, doc_title, section, content, weight)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const insertMany = db.transaction((chunks: ParsedChunk[]) => {
      for (const c of chunks) {
        insert.run(c.id, c.doc_url, c.doc_url_md, c.doc_title, c.section, c.content, c.weight);
      }
    });
    insertMany(allChunks);

    // Optimize FTS5 index segments
    db.exec("INSERT INTO doc_chunks_fts(doc_chunks_fts) VALUES('optimize')");

    // Write metadata
    const upsert = db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES(?, ?)");
    upsert.run('schema_version', '1');
    upsert.run('last_build', new Date().toISOString());
    upsert.run('total_chunks', String(allChunks.length));
    upsert.run('source', INDEX_BASE_URL);

    indexReady = true;
    lastRefreshedAt = new Date().toISOString();
    console.log(`[RAG] SQLite index ready: ${allChunks.length} chunks`);
  } else {
    console.warn('[RAG] No chunks loaded — search will return empty results');
  }

  indexLoading = false;
}

// ---------------------------------------------------------------------------
// Legacy exports (used by old keyword search fallback)
// ---------------------------------------------------------------------------

export function parseLlmsTxt(text: string, section: string): DocEntry[] {
  const entries: DocEntry[] = [];
  const blocks = text.split(/^## /m).filter(Boolean);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length === 0) continue;

    const titleLine = lines[0].trim();
    const linkMatch = titleLine.match(/\[([^\]]+)\]\(([^)]+)\)/);
    let title: string;
    let url: string;
    if (linkMatch) { title = linkMatch[1]; url = linkMatch[2]; }
    else { title = titleLine; url = ''; }

    if (url && !url.startsWith('http')) {
      url = `${DOCS_SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    let type = '';
    let languages: string[] = [];
    let description = '';

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('- Type:')) type = line.replace('- Type:', '').trim();
      else if (line.startsWith('- Languages:')) {
        languages = line.replace('- Languages:', '').trim().split(',').map(s => s.trim());
      } else if (line.startsWith('- Description:') || line.startsWith('> ')) {
        description = line.replace(/^-\s*Description:\s*/, '').replace(/^>\s*/, '').trim();
      } else if (line && !line.startsWith('-') && !description) {
        description = line;
      }
    }

    if (title) {
      const searchText = [title, description, type, ...languages].join(' ').toLowerCase();
      entries.push({title, url, type, languages, description, section, searchText});
    }
  }

  return entries;
}

export function keywordSearchDocs(query: string, topK = 3): DocEntry[] {
  const results = searchDocsFTS5(query, topK);
  return results.map(r => ({
    title: r.doc_title,
    url: r.doc_url,
    type: '',
    languages: [],
    description: r.content.slice(0, 200),
    section: r.section,
    searchText: r.content.toLowerCase(),
  }));
}

// ---------------------------------------------------------------------------
// Content fetch with LRU cache
// ---------------------------------------------------------------------------

const contentCache = new Map<string, string>();
const CONTENT_CACHE_MAX = 100;

function lruSet(key: string, value: string): void {
  if (contentCache.size >= CONTENT_CACHE_MAX) {
    const firstKey = contentCache.keys().next().value;
    if (firstKey) contentCache.delete(firstKey);
  }
  contentCache.set(key, value);
}

export async function fetchDocContent(url: string, maxChars = 6000): Promise<string | null> {
  if (!url) return null;
  const cached = contentCache.get(url);
  if (cached !== undefined) return cached;

  try {
    let mdUrl = url;
    if (!mdUrl.endsWith('.md')) mdUrl = mdUrl.replace(/\/?$/, '.md');

    const res = await fetch(mdUrl, {
      headers: {Accept: 'text/plain, text/markdown'},
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      lruSet(url, '');
      return null;
    }

    const text = await res.text();
    const truncated = text.slice(0, maxChars);
    lruSet(url, truncated);
    return truncated;
  } catch {
    lruSet(url, '');
    return null;
  }
}

// ---------------------------------------------------------------------------
// Request-scoped section filter — set before streaming, used by tools
// ---------------------------------------------------------------------------

let activeSectionFilter: string | undefined;

export function setActiveSectionFilter(filter: string | undefined): void {
  activeSectionFilter = filter;
}

export function getActiveSectionFilter(): string | undefined {
  return activeSectionFilter;
}
