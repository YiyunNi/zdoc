import type {Source, ConfidenceLevel} from './types.js';
import {zillizRequest, ZILLIZ_ENDPOINT, ZILLIZ_TOKEN, isZillizConfigured, EMBEDDING_DIM} from './zilliz-client.js';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'baai/bge-large-en-v1.5';
const EMBEDDING_API_KEY = process.env.EMBEDDING_API_KEY || process.env.AI_API_KEY || '';
const EMBEDDING_BASE_URL = (process.env.EMBEDDING_BASE_URL || process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const COLLECTION_NAME = 'doc_chunks';
const TOP_K = 6;

// ---------------------------------------------------------------------------
// Title sanitization — strip markdown heading IDs like {#slug-text}
// ---------------------------------------------------------------------------

function cleanTitle(title: string): string {
  return title
    .replace(/\\?\{#[^}]*\}?/g, '')  // {#slug} or truncated {#slug-without-closing
    .replace(/\\+$/, '')
    .trim();
}

// ---------------------------------------------------------------------------
// Embedding generation
// ---------------------------------------------------------------------------

export async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch(`${EMBEDDING_BASE_URL}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${EMBEDDING_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {data: Array<{embedding: number[]}>};
  return data.data[0].embedding;
}

// ---------------------------------------------------------------------------
// LRU cache for search results
// ---------------------------------------------------------------------------

interface CachedResult {
  results: SearchResult[];
  timestamp: number;
}

const searchCache = new Map<string, CachedResult>();
const CACHE_MAX = 200;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function cacheGet(key: string): SearchResult[] | null {
  const entry = searchCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    searchCache.delete(key);
    return null;
  }
  return entry.results;
}

function cacheSet(key: string, results: SearchResult[]): void {
  if (searchCache.size >= CACHE_MAX) {
    const firstKey = searchCache.keys().next().value;
    if (firstKey) searchCache.delete(firstKey);
  }
  searchCache.set(key, {results, timestamp: Date.now()});
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface SearchResult {
  id: string;
  doc_url: string;
  doc_url_md: string;
  doc_title: string;
  section: string;
  content: string;
  score: number;
}

export async function searchDocs(query: string, topK = TOP_K, sectionFilter?: string): Promise<SearchResult[]> {
  // Check cache
  const cacheKey = `${query}:${topK}:${sectionFilter || ''}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  try {
    const embedding = await generateEmbedding(query);

    const searchBody: Record<string, unknown> = {
      collectionName: COLLECTION_NAME,
      data: [embedding],
      annsField: 'embedding',
      limit: topK,
      outputFields: ['doc_url', 'doc_url_md', 'doc_title', 'section', 'content'],
    };
    if (sectionFilter) {
      searchBody.filter = sectionFilter;
    }

    const hits = await zillizRequest('/entities/search', searchBody);

    const results: SearchResult[] = (hits || []).map((hit: any) => ({
      id: hit.id || '',
      doc_url: hit.doc_url || '',
      doc_url_md: hit.doc_url_md || '',
      doc_title: cleanTitle(hit.doc_title || ''),
      section: hit.section || '',
      content: hit.content || '',
      score: hit.distance ?? hit.score ?? 0,
    }));

    console.log(`[RAG] Vector search: ${results.length} results${sectionFilter ? ` (filter: ${sectionFilter})` : ''}, sections: [${results.map(r => r.section).join(', ')}], scores: [${results.map(r => r.score.toFixed(3)).join(', ')}]`);

    cacheSet(cacheKey, results);
    return results;
  } catch (err) {
    console.error('[RAG] Search error:', (err as Error).message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Confidence from retrieval scores
// ---------------------------------------------------------------------------

export function computeRetrievalConfidence(results: SearchResult[]): {level: ConfidenceLevel; avgScore: number} {
  if (results.length === 0) return {level: 'low', avgScore: 0};
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  const level: ConfidenceLevel = avgScore >= 0.8 ? 'high' : avgScore >= 0.5 ? 'medium' : 'low';
  return {level, avgScore};
}

// ---------------------------------------------------------------------------
// RAG pipeline: search + format context
// ---------------------------------------------------------------------------

export interface RagResult {
  context: string;
  sources: Source[];
  confidence: {level: ConfidenceLevel; avgScore: number};
  rawResults: SearchResult[];
}

export async function retrieveContext(query: string, sectionFilter?: string): Promise<RagResult> {
  const results = await searchDocs(query, TOP_K, sectionFilter);
  if (results.length === 0) {
    return {
      context: '',
      sources: [],
      confidence: {level: 'low', avgScore: 0},
      rawResults: [],
    };
  }

  const confidence = computeRetrievalConfidence(results);

  // Deduplicate sources by doc_url
  const seenUrls = new Set<string>();
  const sources: Source[] = [];
  for (const r of results) {
    if (r.doc_url && !seenUrls.has(r.doc_url)) {
      seenUrls.add(r.doc_url);
      sources.push({title: r.doc_title, url: r.doc_url, score: r.score, section: r.section});
    }
  }

  // Build context string from top results
  let context = '## Retrieved Documentation\nUse the information below to answer the question. Do NOT list or reference sources in your response — the UI handles source attribution automatically.\n';
  for (const r of results) {
    const sourceLabel = r.section?.startsWith('external-') ? ' [External]' : '';
    context += `\n### [${r.doc_title}${sourceLabel}](${r.doc_url})\n`;
    context += `${r.content}\n`;
  }

  return {context, sources, confidence, rawResults: results};
}

// ---------------------------------------------------------------------------
// Collection setup (called during initialization)
// ---------------------------------------------------------------------------

export async function ensureCollection(): Promise<void> {
  if (!isZillizConfigured()) {
    console.warn('[RAG] Zilliz Cloud credentials not configured — vector search disabled');
    return;
  }

  const data = await zillizRequest('/collections/has', {collectionName: COLLECTION_NAME});
  if (data?.has) {
    console.log(`[RAG] Collection ${COLLECTION_NAME} exists`);
    return;
  }

  console.log(`[RAG] Creating collection: ${COLLECTION_NAME}`);
  await zillizRequest('/collections/create', {
    collectionName: COLLECTION_NAME,
    schema: {
      fields: [
        {fieldName: 'id', dataType: 'VarChar', isPrimary: true, elementTypeParams: {max_length: '512'}},
        {fieldName: 'doc_url', dataType: 'VarChar', elementTypeParams: {max_length: '512'}},
        {fieldName: 'doc_url_md', dataType: 'VarChar', elementTypeParams: {max_length: '512'}},
        {fieldName: 'doc_title', dataType: 'VarChar', elementTypeParams: {max_length: '256'}},
        {fieldName: 'section', dataType: 'VarChar', elementTypeParams: {max_length: '128'}},
        {fieldName: 'content', dataType: 'VarChar', elementTypeParams: {max_length: '16384'}},
        {fieldName: 'content_hash', dataType: 'VarChar', elementTypeParams: {max_length: '64'}},
        {fieldName: 'embedding', dataType: 'FloatVector', elementTypeParams: {dim: String(EMBEDDING_DIM)}},
      ],
    },
    indexParams: [
      {fieldName: 'embedding', indexType: 'AUTOINDEX', metricType: 'COSINE'},
    ],
  });
  console.log(`[RAG] Collection ${COLLECTION_NAME} created`);
}

// ---------------------------------------------------------------------------
// Fallback: keyword search over llms.txt (used when Zilliz is not configured)
// ---------------------------------------------------------------------------

export interface DocEntry {
  title: string;
  url: string;
  type: string;
  languages: string[];
  description: string;
  section: string;
  searchText: string;
}

let docIndex: DocEntry[] = [];
let indexLoaded = false;
let indexLoading = false;

const DOCS_SITE_URL = (process.env.DOCS_SITE_URL || 'https://docs.zilliz.com').replace(/\/$/, '');

const INDEX_PATHS = [
  '/docs/llms.txt',
  '/docs/byoc-guides/llms.txt',
  '/reference/llms.txt',
];

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'it', 'to', 'in', 'for', 'of', 'on', 'at', 'by',
  'and', 'or', 'but', 'not', 'with', 'from', 'as', 'this', 'that', 'be',
  'are', 'was', 'were', 'been', 'has', 'have', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'can', 'may', 'might', 'shall',
  'i', 'me', 'my', 'we', 'us', 'you', 'your', 'he', 'she', 'they', 'them',
  'what', 'which', 'who', 'whom', 'how', 'when', 'where', 'why',
  'if', 'then', 'so', 'because', 'about', 'up', 'out', 'just', 'also',
]);

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

    if (linkMatch) {
      title = linkMatch[1];
      url = linkMatch[2];
    } else {
      title = titleLine;
      url = '';
    }

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

export async function loadIndex(): Promise<void> {
  if (indexLoaded || indexLoading) return;
  indexLoading = true;

  console.log('[RAG] Loading doc index from', DOCS_SITE_URL);
  const allEntries: DocEntry[] = [];

  for (const path of INDEX_PATHS) {
    try {
      const res = await fetch(`${DOCS_SITE_URL}${path}`);
      if (!res.ok) {
        console.warn(`[RAG] Failed to fetch ${path}: ${res.status}`);
        continue;
      }
      const text = await res.text();
      const section = path.includes('byoc') ? 'byoc-guides' : path.includes('reference') ? 'api-reference' : 'cloud-guides';
      const entries = parseLlmsTxt(text, section);
      allEntries.push(...entries);
      console.log(`[RAG] Loaded ${entries.length} entries from ${path}`);
    } catch (err) {
      console.warn(`[RAG] Error fetching ${path}:`, err);
    }
  }

  docIndex = allEntries;
  indexLoaded = true;
  indexLoading = false;
  console.log(`[RAG] Total index: ${docIndex.length} entries`);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s.,;:!?'"()\[\]{}<>\/\\|@#$%^&*+=~`]+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

export function keywordSearchDocs(query: string, topK = 3, minScore = 0.3): DocEntry[] {
  if (docIndex.length === 0) return [];
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const scored: {entry: DocEntry; score: number}[] = [];
  for (const entry of docIndex) {
    let matchCount = 0;
    for (const token of queryTokens) {
      if (entry.searchText.includes(token)) matchCount++;
    }
    const score = matchCount / queryTokens.length;
    if (score >= minScore) scored.push({entry, score});
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(s => s.entry);
}

// Content fetch with LRU cache
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

export async function retrieveContextFallback(query: string, sectionFilter?: string): Promise<RagResult> {
  let entries = keywordSearchDocs(query);

  // Apply section filter to keyword results
  if (sectionFilter && entries.length > 0) {
    const match = sectionFilter.match(/section\s*!=\s*"([^"]+)"/);
    if (match) {
      entries = entries.filter(e => e.section !== match[1]);
    }
  }

  if (entries.length === 0) {
    return {context: '', sources: [], confidence: {level: 'low', avgScore: 0}, rawResults: []};
  }

  const sources: Source[] = entries.map(e => ({
    title: e.title,
    url: e.url.replace(/\.md$/, ''),
  }));

  const contentEntries = entries.slice(0, 2);
  const contents = await Promise.all(contentEntries.map(e => fetchDocContent(e.url)));

  let context = '## Retrieved Documentation\nUse the information below to answer the question. Do NOT list sources in your response — the UI handles source display automatically.\n';
  for (let i = 0; i < contentEntries.length; i++) {
    const entry = contentEntries[i];
    const content = contents[i];
    const displayUrl = entry.url.replace(/\.md$/, '');
    context += `\n### [${entry.title}](${displayUrl})\n`;
    context += content ? `${content}\n` : `${entry.description || 'No content available.'}\n`;
  }

  for (let i = 2; i < entries.length; i++) {
    const entry = entries[i];
    const displayUrl = entry.url.replace(/\.md$/, '');
    context += `\n### [${entry.title}](${displayUrl})\n${entry.description || ''}\n`;
  }

  // Compute confidence from keyword match quality
  const matchScores = keywordSearchDocs(query).map(e => {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return 0;
    let matchCount = 0;
    for (const token of queryTokens) {
      if (e.searchText.includes(token)) matchCount++;
    }
    return matchCount / queryTokens.length;
  });
  const avgScore = matchScores.length > 0 ? matchScores.reduce((a, b) => a + b, 0) / matchScores.length : 0;
  const level: ConfidenceLevel = avgScore >= 0.8 ? 'high' : avgScore >= 0.5 ? 'medium' : 'low';

  return {context, sources, confidence: {level, avgScore}, rawResults: []};
}

// ---------------------------------------------------------------------------
// Smart retrieve: uses Zilliz if available, falls back to keyword
// ---------------------------------------------------------------------------

let vectorSearchDisabled = false;

export function isVectorSearchAvailable(): boolean {
  return !vectorSearchDisabled && isZillizConfigured();
}

export function disableVectorSearch(): void {
  vectorSearchDisabled = true;
}

// Request-scoped section filter — set before streaming, used by tools
let activeSectionFilter: string | undefined;

export function setActiveSectionFilter(filter: string | undefined): void {
  activeSectionFilter = filter;
}

export function getActiveSectionFilter(): string | undefined {
  return activeSectionFilter;
}

export async function retrieve(query: string, sectionFilter?: string): Promise<RagResult> {
  if (isVectorSearchAvailable()) {
    return retrieveContext(query, sectionFilter);
  }
  return retrieveContextFallback(query, sectionFilter);
}
