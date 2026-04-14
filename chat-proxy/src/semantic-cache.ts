import {createOpenAI} from '@ai-sdk/openai';
import {getDb, invalidateCacheByChunkHashes, getCacheStats, getCacheEntriesCount, isDbReady, type CacheEntry} from './db.js';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SEMANTIC_CACHE_ENABLED = process.env.SEMANTIC_CACHE_ENABLED !== 'false'; // default true
const SEMANTIC_CACHE_TTL_MS = parseInt(process.env.SEMANTIC_CACHE_TTL_MS || '', 10) || 2 * 60 * 60 * 1000; // 2 hours
const SEMANTIC_CACHE_THRESHOLD = parseFloat(process.env.SEMANTIC_CACHE_THRESHOLD || '0.92');
const SEMANTIC_CACHE_MAX_ENTRIES = parseInt(process.env.SEMANTIC_CACHE_MAX_ENTRIES || '5000', 10);
const EMBEDDING_MODEL = process.env.SEMANTIC_EMBEDDING_MODEL || 'text-embedding-3-small';
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
const AI_API_KEY = process.env.AI_API_KEY || '';

// ---------------------------------------------------------------------------
// Embedding provider
// ---------------------------------------------------------------------------

const embeddingProvider = createOpenAI({baseURL: AI_BASE_URL, apiKey: AI_API_KEY});

export async function computeEmbedding(text: string): Promise<number[]> {
  const response = await embeddingProvider.textEmbeddingModel(EMBEDDING_MODEL).doEmbed({
    values: [text],
  });
  return response.embeddings[0];
}

// ---------------------------------------------------------------------------
// Cosine similarity (pure JS — no sqlite-vec dependency)
// ---------------------------------------------------------------------------

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ---------------------------------------------------------------------------
// Cache lookup: find semantically similar queries
// ---------------------------------------------------------------------------

export interface SemanticCacheHit {
  entry: CacheEntry;
  similarity: number;
}

export async function semanticCacheLookup(
  query: string,
  sectionFilter?: string,
): Promise<SemanticCacheHit | null> {
  if (!SEMANTIC_CACHE_ENABLED || !isDbReady()) return null;

  const db = getDb();

  // Compute embedding for the query
  const queryEmbedding = await computeEmbedding(query);
  const queryEmbeddingJson = JSON.stringify(queryEmbedding);

  // Fetch candidates from the last N hours (TTL window) to limit brute-force work
  const cutoff = new Date(Date.now() - SEMANTIC_CACHE_TTL_MS).toISOString();
  const rows = db.prepare(
    `SELECT * FROM answer_cache WHERE created_at >= ? ORDER BY created_at DESC LIMIT 2000`
  ).all(cutoff) as CacheEntry[];

  if (rows.length === 0) return null;

  // Brute-force cosine similarity — fine for <= 2K entries
  let bestHit: SemanticCacheHit | null = null;

  for (const row of rows) {
    // Section filter: if the cached entry has a section_filter, it must match the current one
    if (sectionFilter && row.section_filter && row.section_filter !== sectionFilter) continue;
    if (!sectionFilter && row.section_filter) continue; // current has no filter but cached does

    const cachedEmbedding = JSON.parse(row.query_embedding) as number[];
    const similarity = cosineSimilarity(queryEmbedding, cachedEmbedding);

    if (similarity >= SEMANTIC_CACHE_THRESHOLD && (!bestHit || similarity > bestHit.similarity)) {
      bestHit = {entry: row, similarity};
    }
  }

  if (!bestHit) return null;

  // Validate sources: check that all cached chunk hashes still exist in doc_chunks
  if (!validateSources(bestHit.entry.chunk_hashes)) {
    console.log(`[SemanticCache] Source validation failed for cached query: ${query.slice(0, 60)}`);
    return null;
  }

  // Increment hit counter
  db.prepare('UPDATE answer_cache SET hits = hits + 1 WHERE id = ?').run(bestHit.entry.id);

  console.log(
    `[SemanticCache] HIT (similarity=${bestHit.similarity.toFixed(3)}): ${query.slice(0, 60)}`
  );

  return bestHit;
}

// ---------------------------------------------------------------------------
// Source validation: verify cached chunk hashes still exist in the index
// ---------------------------------------------------------------------------

function validateSources(chunkHashesJson: string): boolean {
  const hashes: string[] = JSON.parse(chunkHashesJson);
  if (hashes.length === 0) return false; // no sources to validate

  const db = getDb();
  // Check that all chunk hashes still exist in doc_chunks
  const placeholders = hashes.map(() => '?').join(',');
  const found = db.prepare(
    `SELECT COUNT(DISTINCT id) as count FROM doc_chunks WHERE id IN (${placeholders})`
  ).get(...hashes) as { count: number };

  return found.count === hashes.length;
}

// ---------------------------------------------------------------------------
// Cache write: store a new entry
// ---------------------------------------------------------------------------

export interface CacheWriteInput {
  queryText: string;
  queryEmbedding: number[];
  agent: string;
  sectionFilter?: string;
  sseEvents: Array<{event: string; data: string}>;
  sources: Array<{url: string}>;
  chunkHashes: string[];
  confidence: string; // JSON {level, score}
}

export function semanticCacheWrite(input: CacheWriteInput): void {
  if (!SEMANTIC_CACHE_ENABLED || !isDbReady()) return;

  const db = getDb();

  // Evict oldest entries if at capacity
  const currentCount = getCacheEntriesCount();
  if (currentCount >= SEMANTIC_CACHE_MAX_ENTRIES) {
    const toDelete = Math.max(100, Math.floor(SEMANTIC_CACHE_MAX_ENTRIES * 0.1));
    db.prepare(
      `DELETE FROM answer_cache WHERE id IN (SELECT id FROM answer_cache ORDER BY created_at ASC LIMIT ?)`
    ).run(toDelete);
    console.log(`[SemanticCache] Evicted ${toDelete} oldest entries (capacity: ${SEMANTIC_CACHE_MAX_ENTRIES})`);
  }

  // Clean up old entries past TTL
  cleanupExpired();

  const insert = db.prepare(`
    INSERT INTO answer_cache (query_text, query_embedding, agent, section_filter, sse_events, sources, chunk_hashes, confidence)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insert.run(
    input.queryText,
    JSON.stringify(input.queryEmbedding),
    input.agent,
    input.sectionFilter || null,
    JSON.stringify(input.sseEvents),
    JSON.stringify(input.sources),
    JSON.stringify(input.chunkHashes),
    input.confidence,
  );

  console.log(`[SemanticCache] Stored: ${input.queryText.slice(0, 60)}`);
}

// ---------------------------------------------------------------------------
// Expiration cleanup
// ---------------------------------------------------------------------------

function cleanupExpired(): void {
  const db = getDb();
  const cutoff = new Date(Date.now() - SEMANTIC_CACHE_TTL_MS).toISOString();
  const result = db.prepare('DELETE FROM answer_cache WHERE created_at < ?').run(cutoff);
  if (result.changes > 0) {
    console.log(`[SemanticCache] Cleaned up ${result.changes} expired entries`);
  }
}

// ---------------------------------------------------------------------------
// Index-wide invalidation: invalidate all entries when doc index refreshes
// ---------------------------------------------------------------------------

export function invalidateSemanticCache(): void {
  if (!SEMANTIC_CACHE_ENABLED) return;
  const db = getDb();
  const result = db.prepare('DELETE FROM answer_cache').run();
  console.log(`[SemanticCache] Full invalidation: ${result.changes} entries removed`);
}

// ---------------------------------------------------------------------------
// Invalidated by feedback (thumbs-down on a cached answer)
// ---------------------------------------------------------------------------

export function invalidateCacheEntry(id: number): void {
  if (!SEMANTIC_CACHE_ENABLED) return;
  const db = getDb();
  db.prepare('DELETE FROM answer_cache WHERE id = ?').run(id);
  console.log(`[SemanticCache] Invalidated entry ${id} (feedback)`);
}

// ---------------------------------------------------------------------------
// Chunk-hash-based invalidation: called when specific doc chunks change
// ---------------------------------------------------------------------------

export {invalidateCacheByChunkHashes};

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export {getCacheStats, getCacheEntriesCount};

export function getSemanticCacheConfig(): {
  enabled: boolean;
  ttlMs: number;
  threshold: number;
  maxEntries: number;
  embeddingModel: string;
} {
  return {
    enabled: SEMANTIC_CACHE_ENABLED,
    ttlMs: SEMANTIC_CACHE_TTL_MS,
    threshold: SEMANTIC_CACHE_THRESHOLD,
    maxEntries: SEMANTIC_CACHE_MAX_ENTRIES,
    embeddingModel: EMBEDDING_MODEL,
  };
}
