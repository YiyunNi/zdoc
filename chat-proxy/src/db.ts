import { Pool } from 'pg';
import type { PoolConfig } from 'pg';

// ---------------------------------------------------------------------------
// PostgreSQL schema DDL
// ---------------------------------------------------------------------------

const SCHEMA_DDL = `
  -- doc_chunks: indexed document chunks with full-text search + vector embedding
  CREATE TABLE IF NOT EXISTS doc_chunks (
    id          TEXT PRIMARY KEY,
    doc_url     TEXT NOT NULL,
    doc_url_md  TEXT NOT NULL,
    doc_title   TEXT NOT NULL,
    section     TEXT NOT NULL,
    content     TEXT NOT NULL,
    weight      DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    embedding   vector(1536),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    search_vector tsvector GENERATED ALWAYS AS (
      setweight(to_tsvector('english', coalesce(doc_title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(content, '')), 'B')
    ) STORED
  );

  CREATE INDEX IF NOT EXISTS idx_chunks_url ON doc_chunks(doc_url);
  CREATE INDEX IF NOT EXISTS idx_chunks_section ON doc_chunks(section);
  CREATE INDEX IF NOT EXISTS idx_chunks_search ON doc_chunks USING GIN(search_vector);
  CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON doc_chunks USING hnsw (embedding vector_cosine_ops);

  -- metadata: key-value store for index build info
  CREATE TABLE IF NOT EXISTS metadata (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  -- answer_cache: semantic answer cache with vector embeddings
  CREATE TABLE IF NOT EXISTS answer_cache (
    id              SERIAL PRIMARY KEY,
    query_text      TEXT NOT NULL,
    query_embedding vector(1536),
    agent           TEXT NOT NULL,
    section_filter  TEXT,
    sse_events      JSONB NOT NULL,
    sources         JSONB NOT NULL,
    chunk_hashes    JSONB NOT NULL,
    confidence      JSONB NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    hits            INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_cache_agent ON answer_cache(agent);
  CREATE INDEX IF NOT EXISTS idx_cache_created ON answer_cache(created_at);

  -- token_usage: per-request token consumption tracking
  CREATE TABLE IF NOT EXISTS token_usage (
    id                  SERIAL PRIMARY KEY,
    session_id          TEXT,
    user_id             TEXT,
    model               TEXT NOT NULL,
    agent_type          TEXT,
    input_tokens        INTEGER NOT NULL,
    output_tokens       INTEGER NOT NULL,
    total_tokens        INTEGER NOT NULL,
    cached_input_tokens INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_token_usage_model ON token_usage(model);
  CREATE INDEX IF NOT EXISTS idx_token_usage_session ON token_usage(session_id);
  CREATE INDEX IF NOT EXISTS idx_token_usage_created ON token_usage(created_at);

  -- doc_gaps: content gap tracking
  CREATE TABLE IF NOT EXISTS doc_gaps (
    id               SERIAL PRIMARY KEY,
    query            TEXT NOT NULL,
    session_id       TEXT,
    detected_intent  TEXT,
    tools_called     JSONB,
    confidence_level TEXT,
    response_text    TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    resolved         INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_gaps_resolved ON doc_gaps(resolved);
  CREATE INDEX IF NOT EXISTS idx_gaps_created ON doc_gaps(created_at);

  -- content_quality: source quality issues
  CREATE TABLE IF NOT EXISTS content_quality (
    id               SERIAL PRIMARY KEY,
    url              TEXT NOT NULL,
    issue_type       TEXT NOT NULL,
    suggestion       TEXT,
    occurrence_count INTEGER NOT NULL DEFAULT 1,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(url, issue_type)
  );
`;

// ---------------------------------------------------------------------------
// Connection pool
// ---------------------------------------------------------------------------

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) throw new Error('Database not initialized. Call initDb() first.');
  return pool;
}

export async function initDb(): Promise<void> {
  if (pool) return;

  const config: PoolConfig = {
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };

  pool = new Pool(config);

  pool.on('error', (err) => {
    console.error('[DB] Unexpected pool error:', err.message);
  });

  // Verify connection
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }

  // Enable extensions
  await pool.query('CREATE EXTENSION IF NOT EXISTS vector');
  await pool.query('CREATE EXTENSION IF NOT EXISTS unaccent');

  // Run DDL
  await pool.query(SCHEMA_DDL);

  console.log('[DB] PostgreSQL initialized');
}

export function isDbReady(): boolean {
  return pool !== null;
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

export async function resetDb(): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM doc_chunks');
  await pool.query('DELETE FROM metadata');
}

export async function getIndexStats(): Promise<{ chunks: number; lastBuild: string | null }> {
  const pool = getPool();
  const { rows: [row] } = await pool.query('SELECT COUNT(*)::int as count FROM doc_chunks');
  const { rows: metaRows } = await pool.query("SELECT value FROM metadata WHERE key = 'last_build'");
  return {
    chunks: row.count,
    lastBuild: metaRows[0]?.value ?? null,
  };
}

// ---------------------------------------------------------------------------
// Semantic cache helpers
// ---------------------------------------------------------------------------

export interface CacheEntry {
  id: number;
  query_text: string;
  query_embedding: string;
  agent: string;
  section_filter: string | null;
  sse_events: string;
  sources: string;
  chunk_hashes: string;
  confidence: string;
  created_at: string;
  hits: number;
}

export async function invalidateCacheByChunkHashes(chunkHashes: string[]): Promise<void> {
  if (chunkHashes.length === 0) return;
  const pool = getPool();
  const placeholders = chunkHashes.map((_, i) => `$${i + 1}`).join(',');
  await pool.query(
    `DELETE FROM answer_cache
     WHERE jsonb_array_length(chunk_hashes) > 0
     AND EXISTS (
       SELECT 1 FROM jsonb_array_elements(chunk_hashes) AS je
       WHERE je.value::text IN (${placeholders})
     )`,
    chunkHashes,
  );
}

export async function getCacheStats(): Promise<{ totalEntries: number; totalHits: number }> {
  const pool = getPool();
  const { rows: [row] } = await pool.query(
    'SELECT COUNT(*)::int as "totalEntries", COALESCE(SUM(hits), 0)::int as "totalHits" FROM answer_cache',
  );
  return row;
}

export async function getCacheEntriesCount(): Promise<number> {
  const pool = getPool();
  const { rows: [row] } = await pool.query('SELECT COUNT(*)::int as count FROM answer_cache');
  return row.count;
}

// ---------------------------------------------------------------------------
// Token usage persistence
// ---------------------------------------------------------------------------

export interface TokenUsageRecord {
  sessionId?: string;
  userId?: string;
  model: string;
  agentType: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cachedInputTokens?: number;
}

export async function saveTokenUsage(record: TokenUsageRecord): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO token_usage (session_id, user_id, model, agent_type, input_tokens, output_tokens, total_tokens, cached_input_tokens)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [record.sessionId || null, record.userId || null, record.model, record.agentType,
     record.inputTokens, record.outputTokens, record.totalTokens, record.cachedInputTokens || 0],
  );
}

export interface TokenUsageByModel {
  model: string;
  requestCount: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  totalCachedInputTokens: number;
}

export async function getTokenUsageByModel(): Promise<TokenUsageByModel[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT model, COUNT(*)::int as "requestCount",
       COALESCE(SUM(input_tokens), 0)::int as "totalInputTokens",
       COALESCE(SUM(output_tokens), 0)::int as "totalOutputTokens",
       COALESCE(SUM(total_tokens), 0)::int as "totalTokens",
       COALESCE(SUM(cached_input_tokens), 0)::int as "totalCachedInputTokens"
     FROM token_usage GROUP BY model ORDER BY "totalTokens" DESC`,
  );
  return rows;
}

export async function getTokenUsageSummary(): Promise<{
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  totalCachedInputTokens: number;
  cachedPercentage: number;
}> {
  const pool = getPool();
  const { rows: [row] } = await pool.query(
    `SELECT COUNT(*)::int as "totalRequests",
       COALESCE(SUM(input_tokens), 0)::int as "totalInputTokens",
       COALESCE(SUM(output_tokens), 0)::int as "totalOutputTokens",
       COALESCE(SUM(total_tokens), 0)::int as "totalTokens",
       COALESCE(SUM(cached_input_tokens), 0)::int as "totalCachedInputTokens"
     FROM token_usage`,
  );
  const totalInput = Number(row.totalInputTokens);
  const totalCached = Number(row.totalCachedInputTokens);
  return {
    totalRequests: Number(row.totalRequests),
    totalInputTokens: totalInput,
    totalOutputTokens: Number(row.totalOutputTokens),
    totalTokens: Number(row.totalTokens),
    totalCachedInputTokens: totalCached,
    cachedPercentage: totalInput > 0 ? Math.round((totalCached / totalInput) * 1000) / 10 : 0,
  };
}

export async function getTokenUsageCount(): Promise<number> {
  const pool = getPool();
  const { rows: [row] } = await pool.query('SELECT COUNT(*)::int as count FROM token_usage');
  return row.count;
}

export async function getRecentTokenUsage(limit = 50): Promise<any[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, session_id, model, agent_type, input_tokens, output_tokens,
       total_tokens, cached_input_tokens, created_at
     FROM token_usage ORDER BY created_at DESC LIMIT $1`,
    [limit],
  );
  return rows;
}

// ---------------------------------------------------------------------------
// Content gap tracking
// ---------------------------------------------------------------------------

export async function insertDocGap(gap: {
  query: string;
  sessionId?: string;
  detectedIntent?: string;
  toolsCalled?: string[];
  confidenceLevel: string;
  responseText: string;
}): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO doc_gaps (query, session_id, detected_intent, tools_called, confidence_level, response_text)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [gap.query, gap.sessionId || null, gap.detectedIntent || null,
     gap.toolsCalled ? JSON.stringify(gap.toolsCalled) : null,
     gap.confidenceLevel, gap.responseText],
  );
}

export async function getDocGaps(limit = 100): Promise<any[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, query, session_id, detected_intent, tools_called, confidence_level,
       response_text, created_at, resolved
     FROM doc_gaps WHERE resolved = 0 ORDER BY created_at DESC LIMIT $1`,
    [limit],
  );
  return rows;
}

export async function resolveDocGap(id: number, status: 1 | 2): Promise<void> {
  const pool = getPool();
  await pool.query('UPDATE doc_gaps SET resolved = $1 WHERE id = $2', [status, id]);
}

export async function getDocGapsCount(): Promise<number> {
  const pool = getPool();
  const { rows: [row] } = await pool.query(
    'SELECT COUNT(*)::int as count FROM doc_gaps WHERE resolved = 0',
  );
  return row.count;
}

// ---------------------------------------------------------------------------
// Content quality tracking
// ---------------------------------------------------------------------------

export async function upsertContentQuality(entry: {
  url: string;
  issueType: string;
  suggestion?: string;
}): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO content_quality (url, issue_type, suggestion, occurrence_count)
     VALUES ($1, $2, $3, 1)
     ON CONFLICT (url, issue_type) DO UPDATE SET
       occurrence_count = content_quality.occurrence_count + 1,
       updated_at = NOW(),
       suggestion = EXCLUDED.suggestion`,
    [entry.url, entry.issueType, entry.suggestion || null],
  );
}

export async function getContentQuality(limit = 50): Promise<any[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, url, issue_type, suggestion, occurrence_count, created_at, updated_at
     FROM content_quality ORDER BY occurrence_count DESC, updated_at DESC LIMIT $1`,
    [limit],
  );
  return rows;
}
