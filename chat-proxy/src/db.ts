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

  -- obs_events: observability event log (sessions, messages, routing, feedback, errors)
  CREATE TABLE IF NOT EXISTS obs_events (
    id                   TEXT PRIMARY KEY,
    timestamp            TIMESTAMPTZ NOT NULL,
    event_type           TEXT NOT NULL,
    session_id           TEXT NOT NULL,
    user_id              TEXT NOT NULL,
    agent                TEXT NOT NULL DEFAULT '',
    model                TEXT,
    data                 JSONB NOT NULL DEFAULT '{}',
    input_tokens         INTEGER,
    output_tokens        INTEGER,
    total_tokens         INTEGER,
    cached_input_tokens  INTEGER
  );

  CREATE INDEX IF NOT EXISTS idx_obs_events_ts ON obs_events(timestamp DESC);
  CREATE INDEX IF NOT EXISTS idx_obs_events_session ON obs_events(session_id, timestamp DESC);
  CREATE INDEX IF NOT EXISTS idx_obs_events_type ON obs_events(event_type, timestamp DESC);
  CREATE INDEX IF NOT EXISTS idx_obs_events_agent ON obs_events(agent, timestamp DESC);

  -- obs_sessions: session metadata for dashboard
  CREATE TABLE IF NOT EXISTS obs_sessions (
    id               TEXT PRIMARY KEY,
    user_id          TEXT NOT NULL DEFAULT 'anonymous',
    agent            TEXT NOT NULL DEFAULT '',
    model            TEXT,
    page_url         TEXT,
    message_count    INTEGER NOT NULL DEFAULT 0,
    first_question   TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_obs_sessions_last_active ON obs_sessions(last_active_at DESC);
  CREATE INDEX IF NOT EXISTS idx_obs_sessions_agent ON obs_sessions(agent);

  -- obs_feedback: thumbs up/down ratings
  CREATE TABLE IF NOT EXISTS obs_feedback (
    id             SERIAL PRIMARY KEY,
    session_id     TEXT NOT NULL,
    message_index  INTEGER NOT NULL,
    rating         TEXT NOT NULL,
    page_url       TEXT,
    user_id        TEXT NOT NULL DEFAULT 'anonymous',
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, message_index)
  );

  CREATE INDEX IF NOT EXISTS idx_obs_feedback_created ON obs_feedback(created_at DESC);
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

// ---------------------------------------------------------------------------
// Observability: write functions
// ---------------------------------------------------------------------------

export async function saveObsEvent(event: {
  id: string;
  timestamp: string;
  eventType: string;
  sessionId: string;
  userId: string;
  agent: string;
  model?: string;
  data: Record<string, unknown>;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  cachedInputTokens?: number;
}): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO obs_events (id, timestamp, event_type, session_id, user_id, agent, model, data, input_tokens, output_tokens, total_tokens, cached_input_tokens)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [event.id, event.timestamp, event.eventType, event.sessionId, event.userId,
     event.agent, event.model ?? null, JSON.stringify(event.data),
     event.inputTokens ?? null, event.outputTokens ?? null, event.totalTokens ?? null,
     event.cachedInputTokens ?? null],
  );
}

export async function upsertObsSession(session: {
  id: string;
  userId: string;
  agent: string;
  model?: string;
  pageUrl?: string;
  firstQuestion?: string;
}): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO obs_sessions (id, user_id, agent, model, page_url, message_count, first_question, created_at, last_active_at)
     VALUES ($1, $2, $3, $4, $5, 1, $6, NOW(), NOW())
     ON CONFLICT (id) DO UPDATE SET
       last_active_at = NOW(),
       message_count = obs_sessions.message_count + 1,
       agent = EXCLUDED.agent,
       model = COALESCE(EXCLUDED.model, obs_sessions.model),
       page_url = COALESCE(EXCLUDED.page_url, obs_sessions.page_url)`,
    [session.id, session.userId, session.agent, session.model ?? null,
     session.pageUrl ?? null, session.firstQuestion ?? null],
  );
}

export async function saveObsFeedback(entry: {
  sessionId: string;
  messageIndex: number;
  rating: string;
  pageUrl?: string;
  userId?: string;
}): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO obs_feedback (session_id, message_index, rating, page_url, user_id)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (session_id, message_index) DO UPDATE SET
       rating = EXCLUDED.rating,
       page_url = EXCLUDED.page_url,
       updated_at = NOW()`,
    [entry.sessionId, entry.messageIndex, entry.rating, entry.pageUrl ?? null,
     entry.userId ?? 'anonymous'],
  );
}

// ---------------------------------------------------------------------------
// Observability: read functions (replace in-memory eventStore queries)
// ---------------------------------------------------------------------------

export async function getObsOverview(): Promise<{
  conversations: number;
  messages: number;
  distinctUsers: number;
  avgConfidence: number;
  thumbsUp: number;
  thumbsDown: number;
}> {
  const pool = getPool();
  const { rows: [ev] } = await pool.query(
    `SELECT
       COUNT(DISTINCT session_id)::int as conversations,
       COUNT(*) FILTER (WHERE event_type = 'message')::int as messages,
       COUNT(DISTINCT user_id)::int as "distinctUsers",
       COALESCE(ROUND(
         COUNT(*) FILTER (WHERE event_type = 'message' AND data->>'confidence' = 'high')
         * 100.0 / NULLIF(COUNT(*) FILTER (
           WHERE event_type = 'message' AND data->>'confidence' IN ('high','medium','low')
         ), 0)
       ), 0)::int as "avgConfidence"
     FROM obs_events`,
  );
  const { rows: [fb] } = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE rating = 'up')::int as "thumbsUp",
       COUNT(*) FILTER (WHERE rating = 'down')::int as "thumbsDown"
     FROM obs_feedback`,
  );
  return {
    conversations: Number(ev.conversations),
    messages: Number(ev.messages),
    distinctUsers: Number(ev.distinctUsers),
    avgConfidence: Number(ev.avgConfidence),
    thumbsUp: Number(fb.thumbsUp),
    thumbsDown: Number(fb.thumbsDown),
  };
}

export async function getObsTrends(days: number): Promise<Record<string, {date: string; value: number}[]>> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT
       d::date::text as date,
       COUNT(DISTINCT e.session_id)::int as conversations,
       COUNT(e.id) FILTER (WHERE e.event_type = 'message')::int as messages,
       COUNT(DISTINCT e.user_id)::int as users,
       COALESCE(ROUND(
         COUNT(e.id) FILTER (WHERE e.event_type = 'message' AND e.data->>'confidence' = 'high')
         * 100.0 / NULLIF(COUNT(e.id) FILTER (
           WHERE e.event_type = 'message' AND e.data->>'confidence' IN ('high','medium','low')
         ), 0)
       ), 0)::int as confidence
     FROM generate_series(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, INTERVAL '1 day') d
     LEFT JOIN obs_events e ON e.timestamp::date = d::date
     GROUP BY d ORDER BY d`,
    [days],
  );
  return {
    conversations: rows.map((r: any) => ({date: r.date, value: Number(r.conversations)})),
    messages: rows.map((r: any) => ({date: r.date, value: Number(r.messages)})),
    users: rows.map((r: any) => ({date: r.date, value: Number(r.users)})),
    confidence: rows.map((r: any) => ({date: r.date, value: Number(r.confidence)})),
  };
}

export async function getObsRecentActivity(limit: number): Promise<any[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, timestamp, event_type as type, session_id, user_id, agent, model,
       data, input_tokens, output_tokens, total_tokens, cached_input_tokens
     FROM obs_events WHERE event_type = 'message'
     ORDER BY timestamp DESC LIMIT $1`,
    [limit],
  );
  return rows.map(normalizeObsEvent);
}

export async function getObsLiveSessions(): Promise<any[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT s.id, s.user_id, s.agent, s.model, s.message_count, s.first_question,
       s.last_active_at,
       e.data->>'confidence' as confidence
     FROM obs_sessions s
     LEFT JOIN LATERAL (
       SELECT data FROM obs_events
       WHERE session_id = s.id AND event_type = 'message' AND data->>'confidence' IS NOT NULL
       ORDER BY timestamp DESC LIMIT 1
     ) e ON true
     WHERE s.last_active_at > NOW() - INTERVAL '30 minutes'
     ORDER BY s.last_active_at DESC`,
  );
  return rows.map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    lastActive: new Date(r.last_active_at).toISOString(),
    messageCount: Number(r.message_count),
    agent: r.agent,
    model: r.model,
    confidence: r.confidence,
    lastQuestion: r.first_question,
  }));
}

export async function getObsPerformance(): Promise<any[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT agent as type,
       COALESCE(model, 'unknown') as model,
       COUNT(*)::int as count,
       COALESCE(ROUND(AVG(
         (data->>'latencyMs')::numeric
       ) FILTER (WHERE data->>'latencyMs' IS NOT NULL)), 0)::int as "avgLatencyMs",
       JSONB_BUILD_OBJECT(
         'high',   COUNT(*) FILTER (WHERE data->>'confidence' = 'high'),
         'medium', COUNT(*) FILTER (WHERE data->>'confidence' = 'medium'),
         'low',    COUNT(*) FILTER (WHERE data->>'confidence' = 'low')
       ) as "confidenceDist",
       COALESCE(ROUND(AVG(
         CASE
           WHEN jsonb_typeof(data->'sources') = 'array' THEN jsonb_array_length(data->'sources')
           WHEN data->>'sourceCount' IS NOT NULL THEN (data->>'sourceCount')::numeric
           ELSE 0
         END
       ) FILTER (WHERE event_type = 'message'), 1), 0) as "avgSources",
       COALESCE(ROUND(
         COUNT(*) FILTER (WHERE event_type = 'error') * 1000.0 / NULLIF(COUNT(*), 0)
       ), 0)::numeric / 1000 as "errorRate"
     FROM obs_events
     WHERE event_type IN ('message', 'error')
     GROUP BY agent, model
     ORDER BY count DESC`,
  );
  return rows.map((r: any) => ({
    type: r.type,
    model: r.model,
    count: Number(r.count),
    avgLatencyMs: Number(r.avgLatencyMs),
    confidenceDist: r.confidenceDist,
    avgSources: Number(r.avgSources),
    errorRate: Number(r.errorRate),
  }));
}

export async function getObsFeedback(limit: number): Promise<any[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, timestamp, 'feedback' as type, session_id, user_id, agent, model,
       data, input_tokens, output_tokens, total_tokens, cached_input_tokens
     FROM obs_events WHERE event_type = 'feedback'
     ORDER BY timestamp DESC LIMIT $1`,
    [limit],
  );
  return rows.map(normalizeObsEvent);
}

export async function getObsErrors(limit: number): Promise<any[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, timestamp, event_type as type, session_id, user_id, agent, model,
       data, input_tokens, output_tokens, total_tokens, cached_input_tokens
     FROM obs_events
     WHERE event_type = 'error' OR data->>'blocked' = 'true' OR data->>'content' = ''
     ORDER BY timestamp DESC LIMIT $1`,
    [limit],
  );
  return rows.map(normalizeObsEvent);
}

export async function getObsLowConfidence(limit: number): Promise<any[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, timestamp, event_type as type, session_id, user_id, agent, model,
       data, input_tokens, output_tokens, total_tokens, cached_input_tokens
     FROM obs_events
     WHERE event_type = 'message' AND data->>'confidence' IN ('medium', 'low')
     ORDER BY timestamp DESC LIMIT $1`,
    [limit],
  );
  return rows.map(normalizeObsEvent);
}

export async function listObsSessions(options: {
  page: number;
  pageSize: number;
  agent?: string;
}): Promise<{ sessions: any[]; total: number }> {
  const pool = getPool();
  const where = options.agent ? `WHERE agent = $3` : '';
  const countParams = options.agent ? [options.agent] : [];
  const { rows: [countRow] } = await pool.query(
    `SELECT COUNT(*)::int as total FROM obs_sessions ${where}`,
    countParams,
  );
  const params: any[] = [options.pageSize, (options.page - 1) * options.pageSize];
  if (options.agent) params.push(options.agent);
  const { rows } = await pool.query(
    `SELECT id, user_id, agent, model, page_url, message_count, first_question,
       created_at, last_active_at
     FROM obs_sessions ${where}
     ORDER BY last_active_at DESC LIMIT $1 OFFSET $2`,
    params,
  );
  return {
    sessions: rows.map((r: any) => ({
      id: r.id,
      messageCount: Number(r.message_count),
      createdAt: new Date(r.created_at).getTime(),
      lastActiveAt: new Date(r.last_active_at).getTime(),
      firstQuestion: r.first_question,
    })),
    total: Number(countRow.total),
  };
}

export async function getObsSessionDetail(sessionId: string): Promise<{
  sessionId: string;
  events: any[];
  messages: any[];
}> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, timestamp, event_type as type, session_id, user_id, agent, model,
       data, input_tokens, output_tokens, total_tokens, cached_input_tokens
     FROM obs_events WHERE session_id = $1
     ORDER BY timestamp ASC`,
    [sessionId],
  );
  return {
    sessionId,
    events: rows.map(normalizeObsEvent),
    messages: [],
  };
}

export async function getObsTokenUsage(): Promise<any[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT COALESCE(model, 'unknown') as model,
       COUNT(*)::int as "requestCount",
       COALESCE(SUM(input_tokens), 0)::int as "totalInputTokens",
       COALESCE(SUM(output_tokens), 0)::int as "totalOutputTokens",
       COALESCE(SUM(total_tokens), 0)::int as "totalTokens",
       COALESCE(SUM(cached_input_tokens), 0)::int as "totalCachedInputTokens"
     FROM obs_events
     WHERE event_type = 'message' AND total_tokens IS NOT NULL
     GROUP BY model ORDER BY "totalTokens" DESC`,
  );
  return rows;
}

// Normalize a DB row to match the StoreEvent shape expected by the dashboard
function normalizeObsEvent(r: any): any {
  return {
    id: r.id,
    timestamp: r.timestamp instanceof Date ? r.timestamp.toISOString() : r.timestamp,
    type: r.type,
    sessionId: r.session_id,
    userId: r.user_id,
    agent: r.agent,
    model: r.model,
    data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data,
    inputTokens: r.input_tokens,
    outputTokens: r.output_tokens,
    totalTokens: r.total_tokens,
    cachedInputTokens: r.cached_input_tokens,
  };
}
