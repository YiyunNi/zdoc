import type {ConfidenceLevel} from './types.js';
import {isDemotedSource} from './demotion.js';
import {getPool, ensureShadowTable, swapDocChunksTables, dropOldDocChunks, recreateAnswerCache, getEmbeddingSchemaDimension} from './db.js';
import {computeEmbedding, computeEmbeddingsBatch} from './semantic-cache.js';
import {resolveModel, inferEmbeddingDimension, detectEmbeddingDimension} from './runtime-config.js';
import {extractTripletsBatch, flattenEntities} from './triplet-extract.js';

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
  entities?: string[];
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

export async function searchDocsFTS5(query: string, topK = TOP_K, sectionFilter?: string, entityFilter?: string[]): Promise<SearchResult[]> {
  if (!indexReady) return [];

  const pool = getPool();

  let sql = `
    SELECT c.id, c.doc_url, c.doc_url_md, c.doc_title, c.section,
           c.content, c.weight,
           ts_rank_cd(c.search_vector, query) AS rank
    FROM doc_chunks c, plainto_tsquery('english', $1) query
    WHERE c.search_vector @@ query
      AND c.doc_url != '/docs/home'`;

  const params: (string | number | string[])[] = [query];
  let paramIdx = 2;

  if (sectionFilter) {
    const m = sectionFilter.match(/section\s*(!=|==)\s*"([^"]+)"/);
    if (m) {
      sql += m[1] === '!=' ? ` AND c.section != $${paramIdx}` : ` AND c.section = $${paramIdx}`;
      params.push(m[2]);
      paramIdx++;
    }
  }

  if (entityFilter && entityFilter.length > 0) {
    sql += ` AND c.entities ?| $${paramIdx}::text[]`;
    params.push(entityFilter);
    paramIdx++;
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
    const filterInfo = [
      sectionFilter ? `filter: ${sectionFilter}` : '',
      entityFilter ? `entities: [${entityFilter.join(', ')}]` : '',
    ].filter(Boolean).join(', ');
    console.log(`[RAG] FTS search: ${results.length} results${filterInfo ? ` (${filterInfo})` : ''}`);
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
  entityFilter?: string[],
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

  const params: (string | number | string[])[] = [embeddingStr];
  let paramIdx = 2;

  if (sectionFilter) {
    const m = sectionFilter.match(/section\s*(!=|==)\s*"([^"]+)"/);
    if (m) {
      sql += m[1] === '!=' ? ` AND c.section != $${paramIdx}` : ` AND c.section = $${paramIdx}`;
      params.push(m[2]);
      paramIdx++;
    }
  }

  if (entityFilter && entityFilter.length > 0) {
    sql += ` AND c.entities ?| $${paramIdx}::text[]`;
    params.push(entityFilter);
    paramIdx++;
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
    const filterInfo = [
      sectionFilter ? `filter: ${sectionFilter}` : '',
      entityFilter ? `entities: [${entityFilter.join(', ')}]` : '',
    ].filter(Boolean).join(', ');
    console.log(`[RAG] Vector search: ${results.length} results${filterInfo ? ` (${filterInfo})` : ''}`);
    return results;
  } catch (err) {
    console.warn('[RAG] Vector search error:', (err as Error).message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Entity-aware boost
// ---------------------------------------------------------------------------

const ENTITY_BOOST_PER_MATCH = 0.01;
const MAX_ENTITY_BOOST = 0.03;

function applyEntityBoost(results: SearchResult[], entities: string[]): SearchResult[] {
  if (!entities.length) return results;
  let boostedCount = 0;
  const boosted = results.map(r => {
    const text = (r.doc_title + ' ' + r.content).toLowerCase();
    let matchCount = 0;
    for (const entity of entities) {
      if (text.includes(entity.toLowerCase())) {
        matchCount++;
      }
    }
    const boost = Math.min(matchCount * ENTITY_BOOST_PER_MATCH, MAX_ENTITY_BOOST);
    if (boost > 0) boostedCount++;
    return {...r, score: r.score + boost, contextScore: r.contextScore + boost};
  });
  console.log(`[RAG] Entity boost applied: ${boostedCount}/${results.length} results boosted for entities [${entities.join(', ')}]`);
  return boosted.sort((a, b) => b.score - a.score);
}

// ---------------------------------------------------------------------------
// Hybrid search: parallel FTS + vector, fused with RRF
// ---------------------------------------------------------------------------

export async function searchDocsHybrid(
  query: string,
  topK = TOP_K,
  sectionFilter?: string,
  entities?: string[],
  entityFilter?: string[],
): Promise<SearchResult[]> {
  const queryEmbedding = getQueryEmbedding();

  if (!queryEmbedding) {
    const results = await searchDocsFTS5(query, topK, sectionFilter, entityFilter);
    if (entities && entities.length > 0) {
      return applyEntityBoost(results, entities);
    }
    return results;
  }

  const [ftsResults, vectorResults] = await Promise.all([
    searchDocsFTS5(query, topK * 2, sectionFilter, entityFilter),
    searchDocsVector(queryEmbedding, topK * 2, sectionFilter, entityFilter),
  ]);

  if (vectorResults.length === 0) {
    console.log('[RAG] Hybrid: vector search empty, using FTS-only results');
    const results = ftsResults.slice(0, topK);
    if (entities && entities.length > 0) {
      return applyEntityBoost(results, entities);
    }
    return results;
  }

  const fused = fuseWithRRF(ftsResults, vectorResults, topK);
  console.log(`[RAG] Hybrid search: FTS=${ftsResults.length}, Vec=${vectorResults.length}, Fused=${fused.length}`);

  if (entities && entities.length > 0) {
    return applyEntityBoost(fused, entities);
  }
  return fused;
}

export async function searchDocs(query: string, topK = TOP_K, sectionFilter?: string, entities?: string[], entityFilter?: string[]): Promise<SearchResult[]> {
  return searchDocsHybrid(query, topK, sectionFilter, entities, entityFilter);
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

/** Parse an llms.txt section file into chunks for indexing.
 *  Supports both full-content format (# Title, URL:, --- separators)
 *  and legacy summary format (## Title, - URL:) for transition safety. */
function parseLlmsFullText(text: string, section: string): ParsedChunk[] {
  const chunks: ParsedChunk[] = [];

  // Detect format: full-content uses page separators and # Title headings
  const trimmed = text.trimStart();
  const isFullContent = trimmed.startsWith('# ') || text.includes('\n\n---\n\n');

  if (isFullContent) {
    // Full-content format: pages separated by \n\n---\n\n
    const pages = text.split(/\n\s*---\s*\n/).filter(p => p.trim().length > 0);
    for (const page of pages) {
      const lines = page.trim().split('\n');
      if (lines.length === 0) continue;

      let title = '';
      let url = '';
      let contentStartIdx = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!title && line.startsWith('# ')) {
          title = cleanTitle(line.slice(2).trim());
          contentStartIdx = i + 1;
        } else if (line.startsWith('URL:')) {
          url = line.slice(4).trim();
          contentStartIdx = i + 1;
        } else if (line === '' && contentStartIdx === i) {
          contentStartIdx = i + 1;
        } else if (line !== '') {
          // First non-empty, non-metadata line marks content start
          if (contentStartIdx <= i) {
            contentStartIdx = i;
          }
          break;
        }
      }

      if (!title) continue;
      if (!url) {
        console.warn(`[RAG] Missing URL for page "${title}" in section ${section}`);
        continue;
      }

      // Normalize URL
      if (!url.startsWith('http')) {
        url = `${DOCS_SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
      }
      try {
        const parsed = new URL(url);
        url = parsed.pathname + (parsed.search || '');
      } catch { /* keep as-is if not a valid URL */ }

      const content = lines.slice(contentStartIdx).join('\n').trim();
      const searchContent = content || title;
      const contentChunks = chunkContent(searchContent);
      for (let i = 0; i < contentChunks.length; i++) {
        chunks.push({
          id: `${section}:${url}#${i}`,
          doc_url: url.replace(/\.md$/, ''),
          doc_url_md: url,
          doc_title: title,
          section,
          content: contentChunks[i],
          weight: 1.0,
        });
      }
    }
  } else {
    // Legacy summary format: blocks separated by ^##
    const blocks = text.split(/^## /m).filter(Boolean);
    for (const block of blocks) {
      const lines = block.trim().split('\n');
      if (lines.length === 0) continue;

      const titleLine = lines[0].trim();
      const linkMatch = titleLine.match(/\[([^\]]+)\]\(([^)]+)\)/);
      let title = linkMatch ? linkMatch[1] : titleLine;
      let url = linkMatch ? linkMatch[2] : '';

      if (!url) {
        const urlLine = lines.find(l => l.trim().startsWith('- URL:'));
        if (urlLine) url = urlLine.replace('- URL:', '').trim();
      }

      if (url && !url.startsWith('http')) {
        url = `${DOCS_SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
      }
      try {
        const parsed = new URL(url);
        url = parsed.pathname + (parsed.search || '');
      } catch { /* keep as-is if not a valid URL */ }

      const contentLines = lines.slice(1).filter(l => {
        const trimmed = l.trim();
        if (trimmed.startsWith('- URL:')) return false;
        return true;
      });
      const content = contentLines.join('\n').trim();
      if (!title) continue;
      const searchContent = content || title;
      const contentChunks = chunkContent(searchContent);
      for (let i = 0; i < contentChunks.length; i++) {
        chunks.push({
          id: `${section}:${url}#${i}`,
          doc_url: url.replace(/\.md$/, ''),
          doc_url_md: url,
          doc_title: title,
          section,
          content: contentChunks[i],
          weight: 1.0,
        });
      }
    }
  }

  return chunks;
}

// ---------------------------------------------------------------------------
// Batch embedding: populate doc_chunks.embedding during index load
// ---------------------------------------------------------------------------

const EMBEDDING_BATCH_SIZE = 10;
const BASE_INTER_BATCH_DELAY_MS = 1000;
const MAX_INTER_BATCH_DELAY_MS = 16000;

async function backfillEmbeddings(allChunks: ParsedChunk[]): Promise<void> {
  const pool = getPool();
  const totalChunks = allChunks.length;
  let embedded = 0;
  let failed = 0;
  let interBatchDelay = BASE_INTER_BATCH_DELAY_MS;
  embeddingProgress = { total: totalChunks, done: 0, failed: 0, active: true };

  console.log(`[RAG] Starting embedding backfill for ${totalChunks} chunks (batch size: ${EMBEDDING_BATCH_SIZE}, base delay: ${BASE_INTER_BATCH_DELAY_MS}ms)`);

  for (let i = 0; i < totalChunks; i += EMBEDDING_BATCH_SIZE) {
    const batch = allChunks.slice(i, i + EMBEDDING_BATCH_SIZE);

    const texts = batch.map(c => `${c.doc_title}\n${c.content}`);

    try {
      const embeddings = await computeEmbeddingsBatch(texts);

      // Update chunks with embeddings
      for (let j = 0; j < batch.length; j++) {
        if (embeddings[j]?.length > 0) {
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

      // After success, gradually reduce delay back toward base
      if (interBatchDelay > BASE_INTER_BATCH_DELAY_MS) {
        interBatchDelay = Math.max(BASE_INTER_BATCH_DELAY_MS, Math.floor(interBatchDelay / 2));
      }

      if (embeddingProgress) {
        embeddingProgress.done = embedded;
        embeddingProgress.failed = failed;
      }

      // Progress log every 200 chunks
      if ((i + batch.length) % 200 === 0 || i + batch.length >= totalChunks) {
        console.log(`[RAG] Embedding progress: ${Math.min(i + batch.length, totalChunks)}/${totalChunks} (embedded: ${embedded}, failed: ${failed}, delay: ${interBatchDelay}ms)`);
      }
    } catch (err) {
      failed += batch.length;
      const msg = (err as Error).message || '';
      const isThrottled = /throttl|too many requests|rate exceeded|provisioned throughput/i.test(msg) || (err as any).name === 'ThrottlingException';
      if (isThrottled && interBatchDelay < MAX_INTER_BATCH_DELAY_MS) {
        interBatchDelay = Math.min(MAX_INTER_BATCH_DELAY_MS, interBatchDelay * 2);
        console.warn(`[RAG] Embedding batch throttled at chunk ${i}, increasing delay to ${interBatchDelay}ms`);
      } else {
        console.warn(`[RAG] Embedding batch failed at chunk ${i}:`, msg);
      }
    }

    // Adaptive delay between batches to avoid rate limits
    if (i + EMBEDDING_BATCH_SIZE < totalChunks) {
      await new Promise(r => setTimeout(r, interBatchDelay));
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

export async function loadIndex(force = false, options?: { extractTriplets?: boolean }): Promise<void> {
  if (indexLoading) return;
  if (indexReady && !force) return;
  indexLoading = true;

  // Resolve expected embedding dimension from runtime config
  let expectedDim: number | undefined;
  try {
    const resolved = await resolveModel('embedding');
    expectedDim = resolved.dimensions;
    if (!expectedDim) {
      // Try to infer from model name, then auto-detect if still unknown
      expectedDim = inferEmbeddingDimension(resolved.model) ?? undefined;
      if (!expectedDim) {
        const { getEmbeddingModel } = await import('./runtime-config.js');
        const model = await getEmbeddingModel('embedding');
        expectedDim = await detectEmbeddingDimension(model);
        console.log(`[RAG] Auto-detected embedding dimension: ${expectedDim}`);
      }
    }
  } catch (err) {
    console.warn('[RAG] Could not resolve embedding dimension:', (err as Error).message);
  }

  // Check DB schema dimension. If mismatch, invalidate cache and let the normal
  // shadow-table rebuild flow handle table recreation zero-downtime.
  let dimensionMismatch = false;
  if (expectedDim) {
    try {
      const schemaDim = await getEmbeddingSchemaDimension();
      if (schemaDim !== null && schemaDim !== expectedDim) {
        console.log(`[RAG] Embedding dimension mismatch: schema=${schemaDim}, expected=${expectedDim}. Rebuilding via shadow table...`);
        await recreateAnswerCache(expectedDim);
        dimensionMismatch = true;
      } else if (schemaDim === null) {
        // Table doesn't exist yet or has no embedding column; ensure schema is created with correct dim
        await recreateAnswerCache(expectedDim);
        dimensionMismatch = true;
      }
    } catch (err) {
      console.warn('[RAG] Schema dimension check failed:', (err as Error).message);
    }
  }
  if (dimensionMismatch) {
    force = true;
  }

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

    // Check if existing index in DB is fresh (same source, built within 30 min,
    // and chunk count matches metadata to catch truncated builds)
    if (!force && !indexReady) {
      try {
        const { rows: metaRows } = await pool.query(
          "SELECT key, value FROM metadata WHERE key IN ('last_build', 'source', 'total_chunks')"
        );
        const metaMap = Object.fromEntries(metaRows.map((r: any) => [r.key, r.value]));
        if (metaMap.last_build && metaMap.source) {
          const lastBuild = new Date(metaMap.last_build).getTime();
          const ageMin = (Date.now() - lastBuild) / 60000;
          if (ageMin < 30 && metaMap.source === INDEX_BASE_URL) {
            // Verify embedding dimension hasn't changed since last build
            const schemaDim = await getEmbeddingSchemaDimension();
            if (schemaDim !== null && expectedDim !== undefined && schemaDim !== expectedDim) {
              console.log(`[RAG] Index is fresh but dimension mismatch: schema=${schemaDim}, expected=${expectedDim}. Rebuilding...`);
              // fall through to rebuild
            } else {
              // Verify chunk count consistency (catch truncated/partial builds)
              const storedChunks = parseInt(metaMap.total_chunks || '0', 10);
              const { rows: [{ n: dbChunks }] } = await pool.query('SELECT COUNT(*)::int AS n FROM doc_chunks');
              const chunkDiff = storedChunks > 0 ? Math.abs(dbChunks - storedChunks) / storedChunks : 0;
              if (storedChunks > 0 && chunkDiff > 0.3) {
                console.log(`[RAG] Index chunk count mismatch: DB=${dbChunks}, metadata=${storedChunks} (${(chunkDiff * 100).toFixed(0)}% diff). Rebuilding...`);
                // fall through to rebuild
              } else {
                console.log(`[RAG] Index in DB is fresh (${ageMin.toFixed(0)}min old, same source, ${dbChunks} chunks) — using existing`);
                indexReady = true;
                lastRefreshedAt = metaMap.last_build;
                indexLoading = false;
                return;
              }
            }
          }
        }
      } catch { /* DB not ready or empty — proceed with build */ }
    }

    // Use shadow table for zero-downtime rebuild — old index stays live until swap
    console.log('[RAG] Creating shadow table for zero-downtime rebuild');
    await ensureShadowTable(expectedDim || 1024);

    // Optional triplet extraction for entity enrichment
    if (options?.extractTriplets) {
      const TRIPLET_BATCH_SIZE = 5;
      console.log(`[RAG] Extracting triplets for ${allChunks.length} chunks (batch size: ${TRIPLET_BATCH_SIZE})`);
      for (let i = 0; i < allChunks.length; i += TRIPLET_BATCH_SIZE) {
        const batch = allChunks.slice(i, i + TRIPLET_BATCH_SIZE);
        const batchTexts = batch.map(c => c.content);
        try {
          const batchResults = await extractTripletsBatch(batchTexts);
          for (let j = 0; j < batch.length; j++) {
            const triplets = batchResults.get(j) ?? [];
            batch[j].entities = flattenEntities(triplets);
          }
          if ((i + batch.length) % 20 === 0 || i + batch.length >= allChunks.length) {
            console.log(`[RAG] Extracted triplets for ${Math.min(i + batch.length, allChunks.length)}/${allChunks.length} chunks`);
          }
        } catch (err) {
          console.warn(`[RAG] Triplet extraction failed for batch ${i}:`, (err as Error).message);
          // Graceful degradation: continue with empty entities
          for (const chunk of batch) {
            chunk.entities = [];
          }
        }
      }
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const c of allChunks) {
        await client.query(
          `INSERT INTO doc_chunks_new (id, doc_url, doc_url_md, doc_title, section, content, weight, entities)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO UPDATE SET
             doc_url = EXCLUDED.doc_url, doc_url_md = EXCLUDED.doc_url_md,
             doc_title = EXCLUDED.doc_title, section = EXCLUDED.section,
             content = EXCLUDED.content, weight = EXCLUDED.weight,
             entities = EXCLUDED.entities`,
          [c.id, c.doc_url, c.doc_url_md, c.doc_title, c.section, c.content, c.weight, JSON.stringify(c.entities ?? [])]
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    // Atomic swap: old index stays live until swap completes
    console.log('[RAG] Swapping shadow table to active');
    await swapDocChunksTables();
    await dropOldDocChunks();

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

    // Backfill embeddings in the background — do NOT block index readiness
    const embeddingPromise = backfillEmbeddings(allChunks)
      .catch(err => console.warn('[RAG] Embedding backfill failed:', (err as Error).message));

    // Do NOT await — embeddings are populated asynchronously
    // The index is usable immediately with FTS; vector search degrades gracefully
    void embeddingPromise;
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
