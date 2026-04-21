import {createOpenAI} from '@ai-sdk/openai';
import {getPool, invalidateCacheByChunkHashes, getCacheStats, getCacheEntriesCount, isDbReady, type CacheEntry} from './db.js';

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
// Cosine similarity (pure JS — kept for local comparisons)
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
// Cache lookup: find semantically similar queries via pgvector
// ---------------------------------------------------------------------------

export interface SemanticCacheHit {
  entry: CacheEntry;
  similarity: number;
}

export async function semanticCacheLookup(
  query: string,
  sectionFilter?: string,
  queryEmbedding?: number[],
): Promise<SemanticCacheHit | null> {
  if (!SEMANTIC_CACHE_ENABLED || !isDbReady()) return null;

  const pool = getPool();

  // Use pre-computed embedding if provided, otherwise compute it
  const embedding = queryEmbedding ?? await computeEmbedding(query);
  const queryEmbeddingStr = JSON.stringify(embedding);

  // Use pgvector to find nearest neighbours within the TTL window
  const cutoff = new Date(Date.now() - SEMANTIC_CACHE_TTL_MS).toISOString();

  let rows: any[];
  if (sectionFilter) {
    const result = await pool.query(
      `SELECT *, 1 - (query_embedding <=> $1::vector) AS similarity
       FROM answer_cache
       WHERE created_at >= $2 AND section_filter = $3
       ORDER BY query_embedding <=> $1::vector LIMIT 20`,
      [queryEmbeddingStr, cutoff, sectionFilter],
    );
    rows = result.rows;
  } else {
    const result = await pool.query(
      `SELECT *, 1 - (query_embedding <=> $1::vector) AS similarity
       FROM answer_cache
       WHERE created_at >= $2 AND section_filter IS NULL
       ORDER BY query_embedding <=> $1::vector LIMIT 20`,
      [queryEmbeddingStr, cutoff],
    );
    rows = result.rows;
  }

  if (rows.length === 0) return null;

  // Pick the best match above threshold
  let bestHit: SemanticCacheHit | null = null;

  for (const row of rows) {
    const similarity = Number(row.similarity);
    if (similarity >= SEMANTIC_CACHE_THRESHOLD && (!bestHit || similarity > bestHit.similarity)) {
      // Build a CacheEntry from the pg row, normalising JSONB columns
      const entry: CacheEntry = {
        id: row.id,
        query_text: row.query_text,
        query_embedding: typeof row.query_embedding === 'string' ? row.query_embedding : JSON.stringify(row.query_embedding),
        agent: row.agent,
        section_filter: row.section_filter,
        sse_events: typeof row.sse_events === 'string' ? row.sse_events : JSON.stringify(row.sse_events),
        sources: typeof row.sources === 'string' ? row.sources : JSON.stringify(row.sources),
        chunk_hashes: typeof row.chunk_hashes === 'string' ? row.chunk_hashes : JSON.stringify(row.chunk_hashes),
        confidence: typeof row.confidence === 'string' ? row.confidence : JSON.stringify(row.confidence),
        created_at: row.created_at,
        hits: row.hits,
      };
      bestHit = {entry, similarity};
    }
  }

  if (!bestHit) return null;

  // Validate sources: check that all cached chunk hashes still exist in doc_chunks
  if (!await validateSources(bestHit.entry.chunk_hashes)) {
    console.log(`[SemanticCache] Source validation failed for cached query: ${query.slice(0, 60)}`);
    return null;
  }

  // Increment hit counter
  await pool.query('UPDATE answer_cache SET hits = hits + 1 WHERE id = $1', [bestHit.entry.id]);

  console.log(
    `[SemanticCache] HIT (similarity=${bestHit.similarity.toFixed(3)}): ${query.slice(0, 60)}`
  );

  return bestHit;
}

// ---------------------------------------------------------------------------
// Source validation: verify cached chunk hashes still exist in the index
// ---------------------------------------------------------------------------

async function validateSources(chunkHashesJson: string): Promise<boolean> {
  const hashes: string[] = typeof chunkHashesJson === 'string' ? JSON.parse(chunkHashesJson) : chunkHashesJson;
  if (hashes.length === 0) return false; // no sources to validate

  const pool = getPool();
  // Check that all chunk hashes still exist in doc_chunks
  const placeholders = hashes.map((_, i) => `$${i + 1}`).join(',');
  const {rows: [found]} = await pool.query(
    `SELECT COUNT(DISTINCT id) as count FROM doc_chunks WHERE id IN (${placeholders})`,
    hashes,
  );

  return Number(found.count) === hashes.length;
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

export async function semanticCacheWrite(input: CacheWriteInput): Promise<void> {
  if (!SEMANTIC_CACHE_ENABLED || !isDbReady()) return;

  const pool = getPool();

  // Evict oldest entries if at capacity
  const currentCount = await getCacheEntriesCount();
  if (currentCount >= SEMANTIC_CACHE_MAX_ENTRIES) {
    const toDelete = Math.max(100, Math.floor(SEMANTIC_CACHE_MAX_ENTRIES * 0.1));
    await pool.query(
      `DELETE FROM answer_cache WHERE id IN (SELECT id FROM answer_cache ORDER BY created_at ASC LIMIT $1)`,
      [toDelete],
    );
    console.log(`[SemanticCache] Evicted ${toDelete} oldest entries (capacity: ${SEMANTIC_CACHE_MAX_ENTRIES})`);
  }

  // Clean up old entries past TTL
  await cleanupExpired();

  await pool.query(
    `INSERT INTO answer_cache (query_text, query_embedding, agent, section_filter, sse_events, sources, chunk_hashes, confidence)
     VALUES ($1, $2::vector, $3, $4, $5, $6, $7, $8)`,
    [
      input.queryText,
      JSON.stringify(input.queryEmbedding),
      input.agent,
      input.sectionFilter || null,
      JSON.stringify(input.sseEvents),
      JSON.stringify(input.sources),
      JSON.stringify(input.chunkHashes),
      input.confidence,
    ],
  );

  console.log(`[SemanticCache] Stored: ${input.queryText.slice(0, 60)}`);
}

// ---------------------------------------------------------------------------
// Expiration cleanup
// ---------------------------------------------------------------------------

async function cleanupExpired(): Promise<void> {
  const pool = getPool();
  const cutoff = new Date(Date.now() - SEMANTIC_CACHE_TTL_MS).toISOString();
  const result = await pool.query('DELETE FROM answer_cache WHERE created_at < $1', [cutoff]);
  if (result.rowCount && result.rowCount > 0) {
    console.log(`[SemanticCache] Cleaned up ${result.rowCount} expired entries`);
  }
}

// ---------------------------------------------------------------------------
// Index-wide invalidation: invalidate all entries when doc index refreshes
// ---------------------------------------------------------------------------

export async function invalidateSemanticCache(): Promise<void> {
  if (!SEMANTIC_CACHE_ENABLED) return;
  const pool = getPool();
  const result = await pool.query('DELETE FROM answer_cache');
  console.log(`[SemanticCache] Full invalidation: ${result.rowCount ?? 0} entries removed`);
}

// ---------------------------------------------------------------------------
// Invalidated by feedback (thumbs-down on a cached answer)
// ---------------------------------------------------------------------------

export async function invalidateCacheEntry(id: number): Promise<void> {
  if (!SEMANTIC_CACHE_ENABLED) return;
  const pool = getPool();
  await pool.query('DELETE FROM answer_cache WHERE id = $1', [id]);
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
