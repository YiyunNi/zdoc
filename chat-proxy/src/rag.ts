import type {ConfidenceLevel} from './types.js';
import {isDemotedSource} from './demotion.js';
import {getPool, resetDb} from './db.js';
import {computeEmbedding} from './semantic-cache.js';

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

// ---------------------------------------------------------------------------
// Reciprocal Rank Fusion (RRF)
// ---------------------------------------------------------------------------

const RRF_K = 60; // standard RRF constant

export function fuseWithRRF(
  ftsResults: SearchResult[],
  vectorResults: SearchResult[],
  topK: number,
): SearchResult[] {
  const scores = new Map<string, {score: number; result: SearchResult}>();

  // Score FTS results by rank
  for (let i = 0; i < ftsResults.length; i++) {
    const r = ftsResults[i];
    const rrfScore = 1 / (RRF_K + i + 1); // rank is 1-based
    const existing = scores.get(r.id);
    if (existing) {
      existing.score += rrfScore;
    } else {
      scores.set(r.id, {score: rrfScore, result: r});
    }
  }

  // Score vector results by rank, merging with FTS scores
  for (let i = 0; i < vectorResults.length; i++) {
    const r = vectorResults[i];
    const rrfScore = 1 / (RRF_K + i + 1);
    const existing = scores.get(r.id);
    if (existing) {
      existing.score += rrfScore;
    } else {
      scores.set(r.id, {score: rrfScore, result: r});
    }
  }

  // Sort by combined RRF score descending, take topK
  return [...scores.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({score, result}) => ({
      ...result,
      score,
      contextScore: score,
    }));
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

export async function getIndexSize(): Promise<number> {
  try {
    const pool = getPool();
    const { rows } = await pool.query('SELECT COUNT(*)::int as n FROM doc_chunks');
    return rows[0]?.n ?? 0;
  } catch { return 0; }
}

export async function getIndexStatus(): Promise<{ready: boolean; chunks: number; lastRefreshed: string | null}> {
  let chunks = 0;
  if (indexReady) {
    try {
      const pool = getPool();
      const { rows } = await pool.query('SELECT COUNT(*)::int as n FROM doc_chunks');
      chunks = rows[0]?.n ?? 0;
    } catch { /* db not ready yet */ }
  }
  return {ready: indexReady, chunks, lastRefreshed: lastRefreshedAt};
}

// ---------------------------------------------------------------------------
// Full-text search (PostgreSQL tsvector)
// ---------------------------------------------------------------------------

export async function searchDocsFTS5(query: string, topK = TOP_K, sectionFilter?: string): Promise<SearchResult[]> {
  if (!indexReady) return [];

  const pool = getPool();

  let sql = `
    SELECT c.id, c.doc_url, c.doc_url_md, c.doc_title, c.section,
           c.content, c.weight,
           ts_rank_cd(c.search_vector, query) AS rank
    FROM doc_chunks c, plainto_tsquery('english', $1) query
    WHERE c.search_vector @@ query
      AND c.doc_url != '/docs/home'`;

  const params: (string | number)[] = [query];
  let paramIdx = 2;

  if (sectionFilter) {
    const m = sectionFilter.match(/section\s*(!=|==)\s*"([^"]+)"/);
    if (m) {
      sql += m[1] === '!=' ? ` AND c.section != $${paramIdx}` : ` AND c.section = $${paramIdx}`;
      params.push(m[2]);
      paramIdx++;
    }
  }

  sql += ` ORDER BY rank DESC LIMIT $${paramIdx}`;
  params.push(topK);

  try {
    const { rows } = await pool.query(sql, params);
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
        score: r.rank,
        weight: r.weight,
        contextScore: r.rank,
      });
    }
    console.log(`[RAG] FTS search: ${results.length} results${sectionFilter ? ` (filter: ${sectionFilter})` : ''}`);
    return results;
  } catch (err) {
    console.warn('[RAG] FTS search error:', (err as Error).message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Vector similarity search (pgvector cosine distance)
// ---------------------------------------------------------------------------

export async function searchDocsVector(
  queryEmbedding: number[],
  topK = TOP_K,
  sectionFilter?: string,
): Promise<SearchResult[]> {
  if (!indexReady) return [];

  const pool = getPool();
  const embeddingStr = JSON.stringify(queryEmbedding);

  let sql = `
    SELECT c.id, c.doc_url, c.doc_url_md, c.doc_title, c.section,
           c.content, c.weight,
           1 - (c.embedding <=> $1::vector) AS similarity
    FROM doc_chunks c
    WHERE c.embedding IS NOT NULL
      AND c.doc_url != '/docs/home'`;

  const params: (string | number)[] = [embeddingStr];
  let paramIdx = 2;

  if (sectionFilter) {
    const m = sectionFilter.match(/section\s*(!=|==)\s*"([^"]+)"/);
    if (m) {
      sql += m[1] === '!=' ? ` AND c.section != $${paramIdx}` : ` AND c.section = $${paramIdx}`;
      params.push(m[2]);
      paramIdx++;
    }
  }

  sql += ` ORDER BY c.embedding <=> $1::vector LIMIT $${paramIdx}`;
  params.push(topK);

  try {
    const { rows } = await pool.query(sql, params);
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
        score: r.similarity,
        weight: r.weight,
        contextScore: r.similarity,
      });
    }
    console.log(`[RAG] Vector search: ${results.length} results${sectionFilter ? ` (filter: ${sectionFilter})` : ''}`);
    return results;
  } catch (err) {
    console.warn('[RAG] Vector search error:', (err as Error).message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Hybrid search: parallel FTS + vector, fused with RRF
// ---------------------------------------------------------------------------

export async function searchDocsHybrid(
  query: string,
  topK = TOP_K,
  sectionFilter?: string,
): Promise<SearchResult[]> {
  const queryEmbedding = getQueryEmbedding();

  if (!queryEmbedding) {
    return searchDocsFTS5(query, topK, sectionFilter);
  }

  const [ftsResults, vectorResults] = await Promise.all([
    searchDocsFTS5(query, topK * 2, sectionFilter),
    searchDocsVector(queryEmbedding, topK * 2, sectionFilter),
  ]);

  if (vectorResults.length === 0) {
    console.log('[RAG] Hybrid: vector search empty, using FTS-only results');
    return ftsResults.slice(0, topK);
  }

  const fused = fuseWithRRF(ftsResults, vectorResults, topK);
  console.log(`[RAG] Hybrid search: FTS=${ftsResults.length}, Vec=${vectorResults.length}, Fused=${fused.length}`);
  return fused;
}

export async function searchDocs(query: string, topK = TOP_K, sectionFilter?: string): Promise<SearchResult[]> {
  return searchDocsHybrid(query, topK, sectionFilter);
}

// ---------------------------------------------------------------------------
// List pages — structural browse
// ---------------------------------------------------------------------------

export async function listPages(sectionFilter?: string, titleContains?: string): Promise<{title: string; url: string; section: string}[]> {
  if (!indexReady) return [];
  const pool = getPool();

  let sql = `SELECT DISTINCT doc_url, doc_title, section FROM doc_chunks WHERE doc_url != '/docs/home'`;
  const params: (string | number)[] = [];
  let paramIdx = 1;

  if (sectionFilter) {
    const m = sectionFilter.match(/section\s*(!=|==)\s*"([^"]+)"/);
    if (m) {
      sql += m[1] === '!=' ? ` AND section != $${paramIdx}` : ` AND section = $${paramIdx}`;
      params.push(m[2]);
      paramIdx++;
    }
  }
  if (titleContains) {
    sql += ` AND doc_title ILIKE $${paramIdx}`;
    params.push(`%${titleContains}%`);
    paramIdx++;
  }
  sql += ' LIMIT 200';

  try {
    const { rows } = await pool.query(sql, params);
    return rows.map((r: any) => ({
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

export async function getTitleByUrl(url: string): Promise<string | null> {
  if (!indexReady) return null;
  const normalized = url.replace(/\.md$/, '');
  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT doc_title FROM doc_chunks WHERE doc_url = $1 LIMIT 1`,
      [normalized]
    );
    if (rows.length > 0) return cleanTitle(rows[0].doc_title);
    // Try suffix match
    const path = normalized.startsWith('http')
      ? new URL(normalized).pathname
      : normalized;
    const { rows: rows2 } = await pool.query(
      `SELECT doc_title FROM doc_chunks WHERE doc_url ILIKE $1 LIMIT 1`,
      [`%${path}`]
    );
    return rows2.length > 0 ? cleanTitle(rows2[0].doc_title) : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Index loading from llms.txt files
// ---------------------------------------------------------------------------

/** Parse /llms.txt to discover index files dynamically.
 *  Each `- [Title](url)` line under any heading is treated as a sub-index.
 *  Section name is derived from the filename (e.g. cloud-guides.txt → cloud-guides).
 *  Absolute URLs pointing to the canonical docs site are rewritten to INDEX_BASE_URL
 *  so that local dev loads from the local server instead. */
async function fetchIndexPaths(): Promise<{url: string; section: string}[]> {
  const res = await fetchWithRetry(`${DOCS_SITE_URL}/llms.txt`);
  const text = await res.text();
  const results: {url: string; section: string}[] = [];
  for (const line of text.split('\n')) {
    const m = line.match(/^-\s*\[.*?\]\(([^)]+)\)/);
    if (!m) continue;
    let url = m[1];
    const filename = url.split('/').pop() ?? '';
    const section = filename.replace(/\.txt$/, '');
    if (!section) continue;
    // Rewrite absolute URLs to use INDEX_BASE_URL so local dev loads from local server
    if (url.startsWith('http')) {
      url = `${INDEX_BASE_URL}/${filename}`;
    } else if (!url.startsWith('/')) {
      url = `${INDEX_BASE_URL}/${url}`;
    } else {
      url = `${DOCS_SITE_URL}${url}`;
    }
    results.push({url, section});
  }
  return results;
}

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

/** Parse an llms.txt file into chunks for indexing.
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

    // Normalize to path-only so URLs are consistent regardless of which host served the index
    try {
      const parsed = new URL(url);
      url = parsed.pathname + (parsed.search || '');
    } catch { /* keep as-is if not a valid URL */ }

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
        id: `${section}:${url}#${i}`,
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

// ---------------------------------------------------------------------------
// Batch embedding: populate doc_chunks.embedding during index load
// ---------------------------------------------------------------------------

const EMBEDDING_BATCH_SIZE = 20;

async function backfillEmbeddings(allChunks: ParsedChunk[]): Promise<void> {
  const pool = getPool();
  const totalChunks = allChunks.length;
  let embedded = 0;
  let failed = 0;
  embeddingProgress = { total: totalChunks, done: 0, failed: 0, active: true };

  console.log(`[RAG] Starting embedding backfill for ${totalChunks} chunks (batch size: ${EMBEDDING_BATCH_SIZE})`);

  for (let i = 0; i < totalChunks; i += EMBEDDING_BATCH_SIZE) {
    const batch = allChunks.slice(i, i + EMBEDDING_BATCH_SIZE);

    const texts = batch.map(c => `${c.doc_title}\n${c.content}`);

    try {
      const embeddings: number[][] = [];
      for (const text of texts) {
        try {
          const emb = await computeEmbedding(text);
          embeddings.push(emb);
        } catch {
          embeddings.push([]); // empty = failure for this chunk
        }
      }

      // Update chunks with embeddings
      for (let j = 0; j < batch.length; j++) {
        if (embeddings[j].length > 0) {
          try {
            await pool.query(
              `UPDATE doc_chunks SET embedding = $1::vector WHERE id = $2`,
              [JSON.stringify(embeddings[j]), batch[j].id]
            );
            embedded++;
          } catch (err) {
            failed++;
            console.warn(`[RAG] Failed to store embedding for ${batch[j].id}:`, (err as Error).message);
          }
        } else {
          failed++;
        }
      }

      if (embeddingProgress) {
        embeddingProgress.done = embedded;
        embeddingProgress.failed = failed;
      }

      // Progress log every 200 chunks
      if ((i + batch.length) % 200 === 0 || i + batch.length >= totalChunks) {
        console.log(`[RAG] Embedding progress: ${Math.min(i + batch.length, totalChunks)}/${totalChunks} (embedded: ${embedded}, failed: ${failed})`);
      }
    } catch (err) {
      failed += batch.length;
      console.warn(`[RAG] Embedding batch failed at chunk ${i}:`, (err as Error).message);
    }
  }

  console.log(`[RAG] Embedding backfill complete: ${embedded} embedded, ${failed} failed out of ${totalChunks}`);
  if (embeddingProgress) {
    embeddingProgress.done = embedded;
    embeddingProgress.failed = failed;
    embeddingProgress.active = false;
  }
}

let indexLoading = false;

let embeddingProgress: {total: number; done: number; failed: number; active: boolean} | null = null;

export function getEmbeddingProgress() {
  return embeddingProgress;
}

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

  let indexPaths: {url: string; section: string}[];
  try {
    indexPaths = await fetchIndexPaths();
    console.log(`[RAG] Discovered ${indexPaths.length} index files from llms.txt`);
  } catch (err) {
    console.warn('[RAG] Failed to fetch llms.txt, aborting index load:', (err as Error).message);
    indexLoading = false;
    return;
  }

  for (const {url, section} of indexPaths) {
    try {
      const res = await fetchWithRetry(url);
      const text = await res.text();
      const chunks = parseLlmsFullText(text, section);
      allChunks.push(...chunks);
      console.log(`[RAG] Loaded ${chunks.length} chunks from ${url}`);
    } catch (err) {
      console.warn(`[RAG] Skipping ${url}:`, (err as Error).message);
    }
  }

  if (allChunks.length > 0) {
    const pool = getPool();

    // Check if existing index in DB is fresh (same source, built within 30 min)
    // This avoids unnecessary rebuild on pod restart when the PVC still has recent data
    if (!force && !indexReady) {
      try {
        const { rows: metaRows } = await pool.query(
          "SELECT key, value FROM metadata WHERE key IN ('last_build', 'source')"
        );
        const metaMap = Object.fromEntries(metaRows.map((r: any) => [r.key, r.value]));
        if (metaMap.last_build && metaMap.source) {
          const lastBuild = new Date(metaMap.last_build).getTime();
          const ageMin = (Date.now() - lastBuild) / 60000;
          if (ageMin < 30 && metaMap.source === INDEX_BASE_URL) {
            console.log(`[RAG] Index in DB is fresh (${ageMin.toFixed(0)}min old, same source) — using existing`);
            indexReady = true;
            lastRefreshedAt = metaMap.last_build;
            indexLoading = false;
            return;
          }
        }
      } catch { /* DB not ready or empty — proceed with build */ }
    }

    await resetDb();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const c of allChunks) {
        await client.query(
          `INSERT INTO doc_chunks (id, doc_url, doc_url_md, doc_title, section, content, weight)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET
             doc_url = EXCLUDED.doc_url, doc_url_md = EXCLUDED.doc_url_md,
             doc_title = EXCLUDED.doc_title, section = EXCLUDED.section,
             content = EXCLUDED.content, weight = EXCLUDED.weight`,
          [c.id, c.doc_url, c.doc_url_md, c.doc_title, c.section, c.content, c.weight]
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    // Backfill embeddings in the background — do NOT block index readiness
    const embeddingPromise = backfillEmbeddings(allChunks)
      .catch(err => console.warn('[RAG] Embedding backfill failed:', (err as Error).message));

    // Do NOT await — embeddings are populated asynchronously
    // The index is usable immediately with FTS; vector search degrades gracefully
    void embeddingPromise;

    // Write metadata
    await pool.query(
      `INSERT INTO metadata(key, value) VALUES($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      ['schema_version', '1']
    );
    await pool.query(
      `INSERT INTO metadata(key, value) VALUES($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      ['last_build', new Date().toISOString()]
    );
    await pool.query(
      `INSERT INTO metadata(key, value) VALUES($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      ['total_chunks', String(allChunks.length)]
    );
    await pool.query(
      `INSERT INTO metadata(key, value) VALUES($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      ['source', INDEX_BASE_URL]
    );

    indexReady = true;
    lastRefreshedAt = new Date().toISOString();
    console.log(`[RAG] PostgreSQL index ready: ${allChunks.length} chunks`);
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

export async function keywordSearchDocs(query: string, topK = 3): Promise<DocEntry[]> {
  const results = await searchDocsFTS5(query, topK);
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

// ---------------------------------------------------------------------------
// Request-scoped query embedding — set before search, reused across tools
// ---------------------------------------------------------------------------

let activeQueryEmbedding: number[] | null = null;

export function setQueryEmbedding(embedding: number[] | null): void {
  activeQueryEmbedding = embedding;
}

export function getQueryEmbedding(): number[] | null {
  return activeQueryEmbedding;
}
