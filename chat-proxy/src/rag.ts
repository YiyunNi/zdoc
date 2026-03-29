import type {ConfidenceLevel} from './types.js';
import {generateEmbedding, zillizRequest, isZillizConfigured} from './zilliz-client.js';
import {isDemotedSource} from './demotion.js';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const TOP_K = 6;
const SEARCH_MODE = (process.env.SEARCH_MODE || 'hybrid').toLowerCase(); // hybrid, bm25, vector
const DOCS_SITE_URL = (process.env.DOCS_SITE_URL || 'https://docs.zilliz.com').replace(/\/$/, '');
// INDEX_BASE_URL: base URL containing the llms index .txt files.
// In production, point to S3 (e.g. https://bucket.s3.region.amazonaws.com/llms-index).
// Falls back to the docs site's /llms/ directory.
const INDEX_BASE_URL = (process.env.INDEX_BASE_URL || `${DOCS_SITE_URL}/llms`).replace(/\/$/, '');

// BM25 parameters
const BM25_K1 = 1.2;   // term frequency saturation
const BM25_B = 0.75;    // document length normalization

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
// Tokenization & stop words
// ---------------------------------------------------------------------------

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'it', 'to', 'in', 'for', 'of', 'on', 'at', 'by',
  'and', 'or', 'but', 'not', 'with', 'from', 'as', 'this', 'that', 'be',
  'are', 'was', 'were', 'been', 'has', 'have', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'can', 'may', 'might', 'shall',
  'i', 'me', 'my', 'we', 'us', 'you', 'your', 'he', 'she', 'they', 'them',
  'if', 'then', 'so', 'because', 'about', 'up', 'out', 'just', 'also',
]);

// Intent-bearing words kept but with reduced weight in scoring
const SOFT_STOP_WORDS = new Set([
  'what', 'which', 'who', 'whom', 'how', 'when', 'where', 'why',
]);

// Synonym expansion: map common user terms to documentation terms
const SYNONYMS: Record<string, string[]> = {
  frozen: ['suspended', 'deactivated', 'paused', 'inactive', 'locked'],
  freeze: ['suspended', 'deactivated', 'paused', 'inactive'],
  sales: ['contact', 'pricing', 'enterprise', 'demo'],
  support: ['help', 'ticket', 'assistance', 'troubleshoot'],
  broken: ['error', 'failed', 'issue', 'troubleshoot'],
  slow: ['latency', 'performance', 'optimization', 'throughput'],
  cost: ['pricing', 'billing', 'credits', 'payment'],
  price: ['pricing', 'billing', 'credits', 'cost'],
  gpu: ['cpu', 'hardware', 'compute', 'accelerator'],
  store: ['storage', 'capacity', 'logical', 'disk'],
  connect: ['connection', 'endpoint', 'sdk', 'client'],
  login: ['authentication', 'sign-in', 'credentials', 'access'],
  signup: ['register', 'account', 'create', 'sign-up'],
  upgrade: ['migrate', 'scale', 'tier', 'plan'],
  delete: ['drop', 'remove', 'truncate', 'purge'],
  update: ['upsert', 'modify', 'alter', 'patch'],
};

export interface WeightedToken {
  token: string;
  weight: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s.,;:!?'"()\[\]{}<>\/\\|@#$%^&*+=~`]+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t) && !SOFT_STOP_WORDS.has(t));
}

/** Tokenize a search query with synonym expansion. Returns weighted tokens. */
function tokenizeQuery(text: string): WeightedToken[] {
  const raw = text
    .toLowerCase()
    .split(/[\s.,;:!?'"()\[\]{}<>\/\\|@#$%^&*+=~`]+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));

  const result: WeightedToken[] = [];
  const seen = new Set<string>();

  for (const t of raw) {
    if (seen.has(t)) continue;
    seen.add(t);

    // Soft stop words get reduced weight
    const weight = SOFT_STOP_WORDS.has(t) ? 0.3 : 1.0;
    result.push({token: t, weight});

    // Add synonyms with reduced weight
    const syns = SYNONYMS[t];
    if (syns) {
      for (const s of syns) {
        if (!seen.has(s)) {
          seen.add(s);
          result.push({token: s, weight: 0.5});
        }
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// In-memory BM25 index
// ---------------------------------------------------------------------------

interface IndexedChunk {
  id: string;
  doc_url: string;
  doc_url_md: string;
  doc_title: string;
  section: string;
  content: string;
  weight: number;
  tokens: string[];
  tokenLen: number;
  tf: Map<string, number>;
  titleTf: Map<string, number>;  // title-only term frequencies for boost
}

let indexChunks: IndexedChunk[] = [];
let idf: Map<string, number> = new Map();
let avgDocLen = 0;
let indexReady = false;
let lastRefreshedAt: string | null = null;

export function getIndexSize(): number {
  return indexChunks.length;
}

/** Look up a doc title by URL from the BM25 index. Handles both full and relative URLs. */
export function getTitleByUrl(url: string): string | null {
  const normalized = url.replace(/\.md$/, '');
  // Extract path portion for matching (e.g., "/docs/single-vector-search")
  let path = normalized;
  try {
    path = new URL(normalized, 'https://docs.zilliz.com').pathname;
  } catch { /* keep as-is */ }

  for (const chunk of indexChunks) {
    // Match by full URL, or by path suffix
    if (chunk.doc_url === normalized || chunk.doc_url === url) {
      return cleanTitle(chunk.doc_title);
    }
    if (chunk.doc_url.endsWith(path)) {
      return cleanTitle(chunk.doc_title);
    }
  }
  return null;
}

export function getIndexStatus(): {ready: boolean; chunks: number; lastRefreshed: string | null} {
  return {ready: indexReady, chunks: indexChunks.length, lastRefreshed: lastRefreshedAt};
}

function buildBM25Index(chunks: IndexedChunk[]): void {
  // Compute document frequency for each term
  const df = new Map<string, number>();
  let totalLen = 0;

  for (const chunk of chunks) {
    totalLen += chunk.tokenLen;
    const seen = new Set<string>();
    for (const t of chunk.tokens) {
      if (!seen.has(t)) {
        seen.add(t);
        df.set(t, (df.get(t) || 0) + 1);
      }
    }
  }

  avgDocLen = chunks.length > 0 ? totalLen / chunks.length : 1;

  // Compute IDF: log((N - df + 0.5) / (df + 0.5) + 1)
  const N = chunks.length;
  const newIdf = new Map<string, number>();
  for (const [term, freq] of df) {
    newIdf.set(term, Math.log((N - freq + 0.5) / (freq + 0.5) + 1));
  }

  // Atomic swap
  indexChunks = chunks;
  idf = newIdf;
  indexReady = true;
  lastRefreshedAt = new Date().toISOString();
}

const TITLE_BOOST = 2.0; // title matches worth 2x body matches

function scoreBM25(chunk: IndexedChunk, queryTokens: WeightedToken[]): number {
  let score = 0;
  const dl = chunk.tokenLen;
  const k1 = BM25_K1;
  const b = BM25_B;

  for (const {token: qt, weight: qw} of queryTokens) {
    const termIdf = idf.get(qt);
    if (!termIdf) continue;
    const tf = chunk.tf.get(qt) || 0;
    if (tf === 0) continue;

    let termScore = termIdf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * dl / avgDocLen)));

    // Title boost: if the term appears in the title, amplify score
    if (chunk.titleTf.has(qt)) {
      termScore *= TITLE_BOOST;
    }

    score += termScore * qw;
  }

  return score * (chunk.weight || 1.0);
}

const ZILLIZ_COLLECTION = process.env.ZILLIZ_COLLECTION || 'doc_chunks_v2';

// ---------------------------------------------------------------------------
// Vector search via Zilliz Cloud
// ---------------------------------------------------------------------------

/**
 * Search docs using vector embeddings via Zilliz Cloud.
 * Falls back to empty array on any error (non-fatal by design).
 */
export async function searchDocsVector(query: string, topK = TOP_K, sectionFilter?: string, precomputedEmbedding?: number[]): Promise<SearchResult[]> {
  if (!isZillizConfigured()) return [];

  const t0 = Date.now();
  try {
    const embedding = precomputedEmbedding ?? await generateEmbedding(query);

    // Exclude generic landing pages at query level
    const baseFilter = 'doc_url != "/docs/home"';
    const filter = sectionFilter ? `${baseFilter} and ${sectionFilter}` : baseFilter;

    const outputFields = ['doc_url', 'doc_url_md', 'doc_title', 'section', 'content', 'weight'];

    const searchBody: Record<string, unknown> = {
      collectionName: ZILLIZ_COLLECTION,
      data: [embedding],
      annsField: 'embedding',
      limit: topK,
      outputFields,
      filter,
    };

    const hits = await zillizRequest('/entities/search', searchBody);

    const MAX_EXTERNAL_RESULTS = 2;
    let externalCount = 0;
    const results: SearchResult[] = [];

    for (const hit of hits || []) {
      if ((hit.id || '').startsWith('ext:')) {
        externalCount++;
        if (externalCount > MAX_EXTERNAL_RESULTS) continue;
      }
      results.push({
        id: hit.id || '',
        doc_url: hit.doc_url || '',
        doc_url_md: hit.doc_url_md || '',
        doc_title: cleanTitle(hit.doc_title || ''),
        section: hit.section || '',
        content: hit.content || '',
        score: hit.distance ?? hit.score ?? 0,
        weight: hit.weight ?? 1.0,
        contextScore: hit.distance ?? hit.score ?? 0,
      });
    }

    console.log(`[RAG] Vector search (${Date.now() - t0}ms): ${results.length} results${sectionFilter ? ` (filter: ${sectionFilter})` : ''}, scores: [${results.map(r => r.score.toFixed(3)).join(', ')}]`);
    return results;
  } catch (err) {
    console.warn(`[RAG] Vector search error (${Date.now() - t0}ms):`, (err as Error).message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Hybrid search: BM25 + Vector (RRF fusion)
// ---------------------------------------------------------------------------

/**
 * Fuse results using Reciprocal Rank Fusion (RRF).
 * RRF = sum(1 / (k + rank)) where k=60 is the default.
 * Robust to outliers and requires no parameter tuning.
 */
export function fuseWithRRF(bm25Results: SearchResult[], vectorResults: SearchResult[], topK: number): SearchResult[] {
  const fusedScores = new Map<string, {score: number; result: SearchResult}>();

  // RRF constant (default 60 per SIGIR paper, configurable via env)
  const k = Number(process.env.RRF_K) || 60;

  // Score BM25 results: rank 1 gets 1/(60+1), rank 2 gets 1/(60+2), etc.
  for (let i = 0; i < bm25Results.length; i++) {
    const result = bm25Results[i];
    const rrfScore = 1 / (k + i + 1);
    fusedScores.set(result.id, {score: rrfScore, result});
  }

  // Score vector results and merge
  for (let i = 0; i < vectorResults.length; i++) {
    const result = vectorResults[i];
    const rrfScore = 1 / (k + i + 1);
    const existing = fusedScores.get(result.id);
    if (existing) {
      existing.score += rrfScore;
    } else {
      fusedScores.set(result.id, {score: rrfScore, result});
    }
  }

  // Sort by fused score and deduplicate by URL (keep highest score)
  const urlBest = new Map<string, {score: number; result: SearchResult}>();
  for (const [id, {score, result}] of fusedScores) {
    const existing = urlBest.get(result.doc_url);
    if (!existing || score > existing.score) {
      urlBest.set(result.doc_url, {score, result});
    }
  }

  const sorted = [...urlBest.values()]
    .sort((a, b) => b.score - a.score)
    .map(({result}) => result);

  return sorted.slice(0, topK);
}

/**
 * Hybrid search combining BM25 (keyword) and vector (semantic) results.
 * Uses RRF fusion for robustness. Falls back to BM25 if vector search fails.
 */
export async function searchDocs(query: string, topK = TOP_K, sectionFilter?: string, precomputedEmbedding?: number[]): Promise<SearchResult[]> {
  // Respect SEARCH_MODE environment variable
  if (SEARCH_MODE === 'bm25') {
    return searchDocsBM25(query, topK, sectionFilter);
  }
  if (SEARCH_MODE === 'vector') {
    return await searchDocsVector(query, topK, sectionFilter, precomputedEmbedding);
  }

  // Default: hybrid search
  const [bm25Results, vectorResults] = await Promise.all([
    searchDocsBM25(query, topK * 2, sectionFilter),
    searchDocsVector(query, topK * 2, sectionFilter, precomputedEmbedding),
  ]);

  if (vectorResults.length === 0) {
    console.log('[RAG] Hybrid fallback: Vector search returned 0 results, using BM25 only');
    return bm25Results.slice(0, topK);
  }

  const fused = fuseWithRRF(bm25Results, vectorResults, topK);
  console.log(`[RAG] Hybrid search: BM25=${bm25Results.length}, Vector=${vectorResults.length}, Fused=${fused.length}`);
  return fused;
}

// ---------------------------------------------------------------------------
// BM25 search over in-memory index
// ---------------------------------------------------------------------------

export function searchDocsBM25(query: string, topK = TOP_K, sectionFilter?: string): SearchResult[] {
  if (!indexReady || indexChunks.length === 0) return [];

  const queryTokens = tokenizeQuery(query);
  if (queryTokens.length === 0) return [];

  // Parse section filter
  let sectionOp: string | null = null;
  let sectionVal: string | null = null;
  if (sectionFilter) {
    const match = sectionFilter.match(/section\s*(!=|==)\s*"([^"]+)"/);
    if (match) { sectionOp = match[1]; sectionVal = match[2]; }
  }

  // Score all chunks
  const scored: {chunk: IndexedChunk; score: number}[] = [];
  for (const chunk of indexChunks) {
    // Apply section filter
    if (sectionOp && sectionVal) {
      if (sectionOp === '!=' && chunk.section === sectionVal) continue;
      if (sectionOp === '==' && chunk.section !== sectionVal) continue;
    }
    if (chunk.doc_url === '/docs/home') continue;

    const score = scoreBM25(chunk, queryTokens);
    if (score > 0) scored.push({chunk, score});
  }

  scored.sort((a, b) => b.score - a.score);

  // Cap external results
  const MAX_EXTERNAL = 2;
  let extCount = 0;
  const results: SearchResult[] = [];
  for (const {chunk, score} of scored) {
    if (chunk.id.startsWith('ext:')) {
      extCount++;
      if (extCount > MAX_EXTERNAL) continue;
    }
    results.push({
      id: chunk.id,
      doc_url: chunk.doc_url,
      doc_url_md: chunk.doc_url_md,
      doc_title: cleanTitle(chunk.doc_title),
      section: chunk.section,
      content: chunk.content,
      score,
      weight: chunk.weight,
      contextScore: score,
    });
    if (results.length >= topK) break;
  }

  console.log(`[RAG] BM25 search: ${results.length} results${sectionFilter ? ` (filter: ${sectionFilter})` : ''}, scores: [${results.map(r => r.score.toFixed(3)).join(', ')}]`);
  return results;
}

// ---------------------------------------------------------------------------
// List pages — structural browse
// ---------------------------------------------------------------------------

export function listPages(sectionFilter?: string, titleContains?: string): {title: string; url: string; section: string}[] {
  const seen = new Set<string>();
  const results: {title: string; url: string; section: string}[] = [];

  let sectionOp: string | null = null;
  let sectionVal: string | null = null;
  if (sectionFilter) {
    const match = sectionFilter.match(/section\s*(!=|==)\s*"([^"]+)"/);
    if (match) { sectionOp = match[1]; sectionVal = match[2]; }
  }

  const titleLower = titleContains?.toLowerCase();

  for (const chunk of indexChunks) {
    if (seen.has(chunk.doc_url)) continue;
    if (chunk.doc_url === '/docs/home') continue;
    if (sectionOp && sectionVal) {
      if (sectionOp === '!=' && chunk.section === sectionVal) continue;
      if (sectionOp === '==' && chunk.section !== sectionVal) continue;
    }
    if (titleLower && !chunk.doc_title.toLowerCase().includes(titleLower)) continue;

    seen.add(chunk.doc_url);
    results.push({title: cleanTitle(chunk.doc_title), url: chunk.doc_url, section: chunk.section});
    if (results.length >= 200) break;
  }

  return results;
}

// ---------------------------------------------------------------------------
// Index loading from llms.txt files
// ---------------------------------------------------------------------------

// Index files generated by the llms-txt plugin during site build.
// These are uploaded to S3 (INDEX_BASE_URL) by the CI pipeline.
// Configure via docusaurus.config.ts plugin options → sources[].outputFile.
// Paths are relative to INDEX_BASE_URL.
// When INDEX_BASE_URL points to S3 (e.g. https://bucket.s3.region.amazonaws.com/llms-index),
// the files are at /cloud-guides.txt directly.
// When falling back to the docs site, INDEX_BASE_URL is the site root and files are at /llms/*.txt.
const FULL_INDEX_PATHS = [
  {path: '/cloud-guides.txt', section: 'cloud-guides'},
  {path: '/byoc-guides.txt', section: 'byoc-guides'},
  {path: '/api-reference.txt', section: 'api-reference'},
];

// Chunk size in characters (~500 tokens ≈ 2000 chars)
const CHUNK_SIZE = 2000;
const CHUNK_OVERLAP = 200;

function chunkContent(content: string): string[] {
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

/** Parse an llms.txt file into chunks for BM25 indexing.
 *  Handles both summary format (title + URL + description) and full-content format.
 *  Each ## heading becomes a doc; long docs are further chunked. */
function parseLlmsFullText(text: string, section: string): IndexedChunk[] {
  const chunks: IndexedChunk[] = [];
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

    // Pre-compute title term frequencies for title boost
    const titleTokens = tokenize(title);
    const titleTf = new Map<string, number>();
    for (const t of titleTokens) titleTf.set(t, (titleTf.get(t) || 0) + 1);

    const contentChunks = chunkContent(searchContent);
    for (let i = 0; i < contentChunks.length; i++) {
      const chunkText = contentChunks[i];
      const tokens = tokenize(`${title} ${chunkText}`);
      const tf = new Map<string, number>();
      for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);

      chunks.push({
        id: `${url}#${i}`,
        doc_url: url.replace(/\.md$/, ''),
        doc_url_md: url,
        doc_title: title,
        section,
        content: chunkText,
        weight: 1.0,
        tokens,
        tokenLen: tokens.length,
        tf,
        titleTf,
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
  const allChunks: IndexedChunk[] = [];

  for (const {path, section} of FULL_INDEX_PATHS) {
    try {
      const res = await fetchWithRetry(`${INDEX_BASE_URL}${path}`);
      const text = await res.text();
      const chunks = parseLlmsFullText(text, section);
      allChunks.push(...chunks);
      console.log(`[RAG] Loaded ${chunks.length} chunks from ${path} (${(text.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.warn(`[RAG] Skipping ${path}:`, (err as Error).message);
    }
  }

  if (allChunks.length > 0) {
    buildBM25Index(allChunks);
    console.log(`[RAG] BM25 index ready: ${allChunks.length} chunks, avgDocLen=${avgDocLen.toFixed(0)} tokens`);
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

export function keywordSearchDocs(query: string, topK = 3, minScore = 0.3): DocEntry[] {
  // Use BM25 search over indexed chunks and convert to DocEntry format
  const results = searchDocsBM25(query, topK);
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
