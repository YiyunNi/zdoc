import { Pool } from 'pg';
import type { PoolConfig } from 'pg';
import { encryptSecret, decryptSecret } from './crypto.js';

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
    embedding   vector(1024),
    entities    JSONB DEFAULT '[]',
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
  CREATE INDEX IF NOT EXISTS idx_chunks_entities ON doc_chunks USING GIN(entities);

  -- Migration: add entities column to existing doc_chunks tables
  ALTER TABLE doc_chunks ADD COLUMN IF NOT EXISTS entities JSONB DEFAULT '[]';
  CREATE INDEX IF NOT EXISTS idx_chunks_entities ON doc_chunks USING GIN(entities);

  -- metadata: key-value store for index build info
  CREATE TABLE IF NOT EXISTS metadata (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  -- answer_cache: semantic answer cache with vector embeddings
  CREATE TABLE IF NOT EXISTS answer_cache (
    id              SERIAL PRIMARY KEY,
    query_text      TEXT NOT NULL,
    query_embedding vector(1024),
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
    cached_input_tokens  INTEGER,
    source               TEXT NOT NULL DEFAULT 'docs'
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
    last_active_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_meta        JSONB,
    source           TEXT NOT NULL DEFAULT 'docs'
  );

  CREATE INDEX IF NOT EXISTS idx_obs_sessions_last_active ON obs_sessions(last_active_at DESC);
  CREATE INDEX IF NOT EXISTS idx_obs_sessions_agent ON obs_sessions(agent);
  CREATE INDEX IF NOT EXISTS idx_obs_sessions_user_id ON obs_sessions(user_id);

  -- Migration: add user_meta column to existing obs_sessions tables
  ALTER TABLE obs_sessions ADD COLUMN IF NOT EXISTS user_meta JSONB;

  -- Migration: add source column for multi-product traffic attribution
  ALTER TABLE obs_events   ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'docs';
  ALTER TABLE obs_sessions ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'docs';
  CREATE INDEX IF NOT EXISTS idx_obs_events_source   ON obs_events(source);
  CREATE INDEX IF NOT EXISTS idx_obs_sessions_source ON obs_sessions(source);

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

  -- runtime_config: editable model/provider configuration
  CREATE TABLE IF NOT EXISTS runtime_config (
    key        TEXT PRIMARY KEY,
    provider   TEXT NOT NULL DEFAULT 'openai-compatible',
    model      TEXT NOT NULL,
    dimensions INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Migration: add dimensions column to existing runtime_config tables
  ALTER TABLE runtime_config ADD COLUMN IF NOT EXISTS dimensions INTEGER;

  -- admin_users: Feishu OAuth users with admin privileges
  CREATE TABLE IF NOT EXISTS admin_users (
    open_id    TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT,
    added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    added_by   TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_admin_users_added_at ON admin_users(added_at DESC);

  -- provider_profiles: encrypted credential profiles for AI providers
  CREATE TABLE IF NOT EXISTS provider_profiles (
    name           TEXT PRIMARY KEY,
    provider_type  TEXT NOT NULL CHECK (provider_type IN ('openai-compatible','bedrock')),
    base_url       TEXT,
    region         TEXT,
    credentials    JSONB NOT NULL,
    notes          TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Allow runtime_config rows to reference a provider profile
  ALTER TABLE runtime_config ADD COLUMN IF NOT EXISTS profile_name TEXT
    REFERENCES provider_profiles(name) ON DELETE SET NULL;

  -- oauth_profiles: encrypted credential profiles for OAuth providers
  CREATE TABLE IF NOT EXISTS oauth_profiles (
    name           TEXT PRIMARY KEY,
    provider_type  TEXT NOT NULL CHECK (provider_type IN ('feishu')),
    is_active      BOOLEAN NOT NULL DEFAULT FALSE,
    host           TEXT,
    redirect_uri   TEXT,
    app_id         TEXT NOT NULL,
    credentials    JSONB NOT NULL,
    notes          TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Enforce: at most one active row per provider_type
  CREATE UNIQUE INDEX IF NOT EXISTS idx_oauth_profiles_active
    ON oauth_profiles(provider_type) WHERE is_active = TRUE;
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

/** Recreate embedding-related tables with a specific vector dimension */
export async function recreateEmbeddingTables(dimensions: number): Promise<void> {
  const pool = getPool();
  await pool.query('DROP TABLE IF EXISTS doc_chunks');
  await pool.query('DROP TABLE IF EXISTS answer_cache');
  await pool.query('DELETE FROM metadata');

  const ddl = SCHEMA_DDL
    .replace(/vector\(1024\)/g, `vector(${dimensions})`)
    .replace(/vector\(1536\)/g, `vector(${dimensions})`);
  await pool.query(ddl);
}

export async function getEmbeddingSchemaDimension(): Promise<number | null> {
  const pool = getPool();
  try {
    const { rows: [row] } = await pool.query(
      `SELECT atttypmod FROM pg_attribute
       WHERE attrelid = 'doc_chunks'::regclass AND attname = 'embedding'`,
    );
    return row?.atttypmod ?? null;
  } catch {
    return null;
  }
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
     FROM token_usage ORDER BY created_at DESC LIMIT $1::int`,
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
     FROM doc_gaps WHERE resolved = 0 ORDER BY created_at DESC LIMIT $1::int`,
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
     FROM content_quality ORDER BY occurrence_count DESC, updated_at DESC LIMIT $1::int`,
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
  source: string;
}): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO obs_events (id, timestamp, event_type, session_id, user_id, agent, model, data, input_tokens, output_tokens, total_tokens, cached_input_tokens, source)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [event.id, event.timestamp, event.eventType, event.sessionId, event.userId,
     event.agent, event.model ?? null, JSON.stringify(event.data),
     event.inputTokens ?? null, event.outputTokens ?? null, event.totalTokens ?? null,
     event.cachedInputTokens ?? null, event.source],
  );
}

export async function upsertObsSession(session: {
  id: string;
  userId: string;
  agent: string;
  model?: string;
  pageUrl?: string;
  firstQuestion?: string;
  userMeta?: Record<string, unknown>;
  source: string;
}): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO obs_sessions (id, user_id, agent, model, page_url, message_count, first_question, user_meta, source, created_at, last_active_at)
     VALUES ($1, $2, $3, $4, $5, 1, $6, $7, $8, NOW(), NOW())
     ON CONFLICT (id) DO UPDATE SET
       last_active_at = NOW(),
       message_count = obs_sessions.message_count + 1,
       agent = EXCLUDED.agent,
       model = COALESCE(EXCLUDED.model, obs_sessions.model),
       page_url = COALESCE(EXCLUDED.page_url, obs_sessions.page_url),
       user_meta = COALESCE(EXCLUDED.user_meta, obs_sessions.user_meta),
       source = EXCLUDED.source`,
    [session.id, session.userId, session.agent, session.model ?? null,
     session.pageUrl ?? null, session.firstQuestion ?? null,
     session.userMeta ? JSON.stringify(session.userMeta) : null, session.source],
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

export async function getObsOverview(options: { source?: string } = {}): Promise<{
  conversations: number;
  messages: number;
  distinctUsers: number;
  avgConfidence: number;
  thumbsUp: number;
  thumbsDown: number;
}> {
  const pool = getPool();

  // Headline counts (conversations, distinctUsers) come from obs_sessions
  // with the same anonymous-exclusion policy as getObsUsers, so the Dashboard
  // and Users tabs report identical numbers.
  const sessionConditions = [`user_id != 'anonymous'`];
  const sessionParams: any[] = [];
  if (options.source) {
    sessionParams.push(options.source);
    sessionConditions.push(`source = $${sessionParams.length}`);
  }
  const sessionWhere = `WHERE ${sessionConditions.join(' AND ')}`;

  const { rows: [s] } = await pool.query(
    `SELECT
       COUNT(*)::int as conversations,
       COUNT(DISTINCT user_id)::int as "distinctUsers"
     FROM obs_sessions ${sessionWhere}`,
    sessionParams,
  );

  // Per-message metrics (messages count, average confidence) still come from
  // obs_events because obs_sessions doesn't carry message-level granularity.
  const eventParams: any[] = [];
  let eventWhere = `WHERE event_type = 'message'`;
  if (options.source) {
    eventParams.push(options.source);
    eventWhere += ` AND source = $${eventParams.length}`;
  }

  const { rows: [e] } = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE data->>'role' = 'assistant' OR data->>'role' IS NULL)::int as messages,
       COALESCE(ROUND(
         COUNT(*) FILTER (WHERE data->>'confidence' = 'high' AND (data->>'role' = 'assistant' OR data->>'role' IS NULL))
         * 100.0 / NULLIF(COUNT(*) FILTER (
           WHERE data->>'confidence' IN ('high','medium','low') AND (data->>'role' = 'assistant' OR data->>'role' IS NULL)
         ), 0)
       ), 0)::int as "avgConfidence"
     FROM obs_events ${eventWhere}`,
    eventParams,
  );

  // Feedback (thumbs) — feedback events live in obs_feedback. We filter
  // by source via the originating session in obs_sessions when set.
  let fbQuery: string;
  let fbParams: any[];
  if (options.source) {
    fbQuery = `SELECT
         COUNT(*) FILTER (WHERE rating = 'up')::int as "thumbsUp",
         COUNT(*) FILTER (WHERE rating = 'down')::int as "thumbsDown"
       FROM obs_feedback f
       JOIN obs_sessions s ON s.id = f.session_id
       WHERE s.source = $1`;
    fbParams = [options.source];
  } else {
    fbQuery = `SELECT
         COUNT(*) FILTER (WHERE rating = 'up')::int as "thumbsUp",
         COUNT(*) FILTER (WHERE rating = 'down')::int as "thumbsDown"
       FROM obs_feedback`;
    fbParams = [];
  }
  const { rows: [fb] } = await pool.query(fbQuery, fbParams);

  return {
    conversations: Number(s.conversations),
    messages: Number(e.messages),
    distinctUsers: Number(s.distinctUsers),
    avgConfidence: Number(e.avgConfidence),
    thumbsUp: Number(fb.thumbsUp),
    thumbsDown: Number(fb.thumbsDown),
  };
}

export async function getObsTrends(days: number, options: { source?: string } = {}): Promise<Record<string, {date: string; value: number}[]>> {
  const pool = getPool();

  const sessionFilter = options.source ? `AND s.source = $2` : '';
  const eventFilter = options.source ? `AND e.source = $2` : '';
  const params: any[] = options.source ? [days, options.source] : [days];

  // Conversations: distinct sessions per day from obs_sessions
  const { rows: sessionRows } = await pool.query(
    `SELECT d::date::text as date, COUNT(DISTINCT s.id)::int as conversations
     FROM generate_series(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, INTERVAL '1 day') d
     LEFT JOIN obs_sessions s ON s.created_at::date = d::date ${sessionFilter}
     GROUP BY d ORDER BY d`,
    params,
  );

  // Messages, users, confidence from obs_events
  const { rows: eventRows } = await pool.query(
    `SELECT
       d::date::text as date,
       COUNT(e.id) FILTER (WHERE e.event_type = 'message' AND (e.data->>'role' = 'assistant' OR e.data->>'role' IS NULL))::int as messages,
       COUNT(DISTINCT e.user_id) FILTER (WHERE e.id IS NOT NULL)::int as users,
       COALESCE(ROUND(
         COUNT(e.id) FILTER (WHERE e.event_type = 'message' AND e.data->>'confidence' = 'high' AND (e.data->>'role' = 'assistant' OR e.data->>'role' IS NULL))
         * 100.0 / NULLIF(COUNT(e.id) FILTER (
           WHERE e.event_type = 'message' AND e.data->>'confidence' IN ('high','medium','low') AND (e.data->>'role' = 'assistant' OR e.data->>'role' IS NULL)
         ), 0)
       ), 0)::int as confidence
     FROM generate_series(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, INTERVAL '1 day') d
     LEFT JOIN obs_events e ON e.timestamp::date = d::date ${eventFilter}
     GROUP BY d ORDER BY d`,
    params,
  );

  // Merge: sessions data has conversations, events data has messages/users/confidence
  const sessionMap = new Map(sessionRows.map((r: any) => [r.date, Number(r.conversations)]));

  return {
    conversations: eventRows.map((r: any) => ({date: r.date, value: sessionMap.get(r.date) || 0})),
    messages: eventRows.map((r: any) => ({date: r.date, value: Number(r.messages)})),
    users: eventRows.map((r: any) => ({date: r.date, value: Number(r.users)})),
    confidence: eventRows.map((r: any) => ({date: r.date, value: Number(r.confidence)})),
  };
}

export async function getObsRecentActivity(limit: number): Promise<any[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, timestamp, event_type as type, session_id, user_id, agent, model,
       data, input_tokens, output_tokens, total_tokens, cached_input_tokens
     FROM obs_events WHERE event_type = 'message'
     ORDER BY timestamp DESC LIMIT $1::int`,
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
       ) FILTER (WHERE event_type = 'message' AND (data->>'role' = 'assistant' OR data->>'role' IS NULL)), 1), 0) as "avgSources",
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
     ORDER BY timestamp DESC LIMIT $1::int`,
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
     ORDER BY timestamp DESC LIMIT $1::int`,
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
     ORDER BY timestamp DESC LIMIT $1::int`,
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
  const countWhere = options.agent ? `WHERE agent = $1` : '';
  const listWhere = options.agent ? `WHERE agent = $3` : '';
  const countParams = options.agent ? [options.agent] : [];
  const { rows: [countRow] } = await pool.query(
    `SELECT COUNT(*)::int as total FROM obs_sessions ${countWhere}`,
    countParams,
  );
  const params: any[] = [options.pageSize, (options.page - 1) * options.pageSize];
  if (options.agent) params.push(options.agent);
  const { rows } = await pool.query(
    `SELECT id, user_id, agent, model, page_url, message_count, first_question,
       created_at, last_active_at
     FROM obs_sessions ${listWhere}
     ORDER BY last_active_at DESC LIMIT $1::int OFFSET $2::int`,
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

export async function getObsUsers(options: {
  page: number;
  pageSize: number;
  agent?: string;
  country?: string;
  source?: string;
}): Promise<{ users: any[]; total: number; totalSessions: number }> {
  const pool = getPool();

  // Build WHERE clause
  const conditions = [`user_id != 'anonymous'`];
  const params: any[] = [];

  if (options.agent) {
    params.push(options.agent);
    conditions.push(`agent = $${params.length}`);
  }

  if (options.country) {
    params.push(options.country);
    conditions.push(`user_meta->>'country' = $${params.length}`);
  }

  if (options.source) {
    params.push(options.source);
    conditions.push(`source = $${params.length}`);
  }

  const whereClause = conditions.join(' AND ');

  const { rows: [countRow] } = await pool.query(
    `SELECT
       COUNT(DISTINCT user_id)::int as total,
       COUNT(*)::int as "totalSessions"
     FROM obs_sessions
     WHERE ${whereClause}`,
    params,
  );

  const offset = (options.page - 1) * options.pageSize;

  const { rows } = await pool.query(
    `SELECT
       user_id,
       COUNT(*)::int as session_count,
       MIN(created_at) as first_active,
       MAX(last_active_at) as last_active,
       AVG(EXTRACT(EPOCH FROM (last_active_at - created_at)))::numeric as avg_duration_seconds,
       (ARRAY_AGG(DISTINCT user_meta) FILTER (WHERE user_meta IS NOT NULL))[1] as user_meta,
       COALESCE(JSON_AGG(JSON_BUILD_OBJECT('first_question', first_question, 'agent', agent, 'message_count', message_count, 'created_at', created_at) ORDER BY created_at DESC) FILTER (WHERE first_question IS NOT NULL), '[]'::json) as session_rows
     FROM obs_sessions
     WHERE ${whereClause}
     GROUP BY user_id
     ORDER BY MAX(last_active_at) DESC
     LIMIT $${params.length + 1}::int OFFSET $${params.length + 2}::int`,
    [...params, options.pageSize, offset],
  );

  const users = rows.map((r: any) => ({
    userId: r.user_id,
    sessionCount: Number(r.session_count),
    firstActive: new Date(r.first_active).toISOString(),
    lastActive: new Date(r.last_active).toISOString(),
    avgDurationSeconds: Math.round(Number(r.avg_duration_seconds) || 0),
    userMeta: r.user_meta ? (typeof r.user_meta === 'string' ? JSON.parse(r.user_meta) : r.user_meta) : null,
    sessions: (r.session_rows || []).slice(0, 50).map((s: any) => ({
      firstQuestion: s.first_question,
      agent: s.agent,
      messageCount: Number(s.message_count),
      createdAt: new Date(s.created_at).toISOString(),
    })),
    topics: (r.session_rows || []).slice(0, 5).map((s: any) => (s.first_question || '').slice(0, 80)),
  }));

  return {
    users,
    total: Number(countRow.total),
    totalSessions: Number(countRow.totalSessions),
  };
}

export async function getTokenTrends(days: number, options: { source?: string } = {}): Promise<{date: string; inputTokens: number; outputTokens: number; cachedTokens: number}[]> {
  const pool = getPool();

  // When filtering by source, join through obs_sessions (token_usage doesn't
  // carry a source column directly; instead we attribute via the session id).
  if (options.source) {
    const { rows } = await pool.query(
      `SELECT d::date::text as date,
         COALESCE(SUM(t.input_tokens), 0)::bigint as "inputTokens",
         COALESCE(SUM(t.output_tokens), 0)::bigint as "outputTokens",
         COALESCE(SUM(t.cached_input_tokens), 0)::bigint as "cachedTokens"
       FROM generate_series(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, INTERVAL '1 day') d
       LEFT JOIN token_usage t ON t.created_at::date = d::date
       LEFT JOIN obs_sessions s ON s.id = t.session_id AND s.source = $2
       WHERE t.id IS NULL OR s.id IS NOT NULL
       GROUP BY d ORDER BY d`,
      [days, options.source],
    );
    return rows.map((r: any) => ({
      date: r.date,
      inputTokens: Number(r.inputTokens),
      outputTokens: Number(r.outputTokens),
      cachedTokens: Number(r.cachedTokens),
    }));
  }

  const { rows } = await pool.query(
    `SELECT d::date::text as date,
       COALESCE(SUM(input_tokens), 0)::bigint as "inputTokens",
       COALESCE(SUM(output_tokens), 0)::bigint as "outputTokens",
       COALESCE(SUM(cached_input_tokens), 0)::bigint as "cachedTokens"
     FROM generate_series(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, INTERVAL '1 day') d
     LEFT JOIN token_usage t ON t.created_at::date = d::date
     GROUP BY d ORDER BY d`,
    [days],
  );
  return rows.map((r: any) => ({
    date: r.date,
    inputTokens: Number(r.inputTokens),
    outputTokens: Number(r.outputTokens),
    cachedTokens: Number(r.cachedTokens),
  }));
}

export async function getRuntimeConfigAll(): Promise<{key: string; provider: string; model: string; dimensions: number | null; profileName: string | null; updatedAt: string}[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    'SELECT key, provider, model, dimensions, profile_name as "profileName", updated_at as "updatedAt" FROM runtime_config ORDER BY key',
  );
  return rows;
}

export async function getRuntimeConfigValue(key: string): Promise<{provider: string; model: string; dimensions: number | null; profileName: string | null} | null> {
  const pool = getPool();
  const { rows: [row] } = await pool.query(
    'SELECT provider, model, dimensions, profile_name as "profileName" FROM runtime_config WHERE key = $1',
    [key],
  );
  return row ? { provider: row.provider, model: row.model, dimensions: row.dimensions, profileName: row.profileName } : null;
}

export async function setRuntimeConfigValue(key: string, provider: string, model: string, profileName?: string | null, dimensions?: number | null): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO runtime_config (key, provider, model, dimensions, profile_name, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (key) DO UPDATE SET
       provider = EXCLUDED.provider,
       model = EXCLUDED.model,
       dimensions = COALESCE(EXCLUDED.dimensions, runtime_config.dimensions),
       profile_name = EXCLUDED.profile_name,
       updated_at = NOW()`,
    [key, provider, model, dimensions ?? null, profileName ?? null],
  );
}

export async function deleteRuntimeConfigValue(key: string): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM runtime_config WHERE key = $1', [key]);
}

// ---------------------------------------------------------------------------
// Provider profile CRUD
// ---------------------------------------------------------------------------

export async function listProviderProfiles(): Promise<{
  name: string;
  provider_type: string;
  base_url: string | null;
  region: string | null;
  credentials: Record<string, string>;
  notes: string | null;
  created_at: string;
  updated_at: string;
}[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    'SELECT name, provider_type, base_url, region, credentials, notes, created_at, updated_at FROM provider_profiles ORDER BY name',
  );
  return rows.map((r: any) => {
    const masked: Record<string, string> = {};
    if (r.provider_type === 'openai-compatible') {
      masked.api_key = '***';
    } else if (r.provider_type === 'bedrock') {
      masked.access_key_id = '***';
      masked.secret_access_key = '***';
      masked.session_token = '***';
    }
    return {
      name: r.name,
      provider_type: r.provider_type,
      base_url: r.base_url,
      region: r.region,
      credentials: masked,
      notes: r.notes,
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  });
}

export async function getProviderProfile(name: string): Promise<{
  name: string;
  provider_type: string;
  base_url: string | null;
  region: string | null;
  credentials: Record<string, string>;
  notes: string | null;
  created_at: string;
  updated_at: string;
} | null> {
  const pool = getPool();
  const { rows: [row] } = await pool.query(
    'SELECT name, provider_type, base_url, region, credentials, notes, created_at, updated_at FROM provider_profiles WHERE name = $1',
    [name],
  );
  if (!row) return null;

  const envelope = row.credentials as { iv: string; tag: string; ciphertext: string };
  const plaintext = decryptSecret(envelope, 'chat-proxy:provider-profile:v1');
  const credentials = JSON.parse(plaintext) as Record<string, string>;

  return {
    name: row.name,
    provider_type: row.provider_type,
    base_url: row.base_url,
    region: row.region,
    credentials,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function upsertProviderProfile(params: {
  name: string;
  provider_type: string;
  base_url?: string | null;
  region?: string | null;
  credentials: Record<string, string>;
  notes?: string | null;
}): Promise<void> {
  const pool = getPool();
  const encrypted = encryptSecret(JSON.stringify(params.credentials), 'chat-proxy:provider-profile:v1');
  await pool.query(
    `INSERT INTO provider_profiles (name, provider_type, base_url, region, credentials, notes, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (name) DO UPDATE SET
       provider_type = EXCLUDED.provider_type,
       base_url = EXCLUDED.base_url,
       region = EXCLUDED.region,
       credentials = EXCLUDED.credentials,
       notes = EXCLUDED.notes,
       updated_at = NOW()`,
    [params.name, params.provider_type, params.base_url ?? null, params.region ?? null,
     JSON.stringify(encrypted), params.notes ?? null],
  );
}

export async function deleteProviderProfile(name: string): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM provider_profiles WHERE name = $1', [name]);
}

export async function getProviderProfileForRuntimeKey(key: string): Promise<{
  name: string;
  provider_type: string;
  base_url: string | null;
  region: string | null;
  credentials: Record<string, string>;
  notes: string | null;
  created_at: string;
  updated_at: string;
} | null> {
  const config = await getRuntimeConfigValue(key);
  if (!config || !config.profileName) return null;
  return getProviderProfile(config.profileName);
}

// ---------------------------------------------------------------------------
// OAuth profile CRUD
// ---------------------------------------------------------------------------

export async function listOAuthProfiles(): Promise<{
  name: string;
  provider_type: string;
  is_active: boolean;
  host: string | null;
  redirect_uri: string | null;
  app_id: string;
  credentials: { app_secret: string };
  notes: string | null;
  created_at: string;
  updated_at: string;
}[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    'SELECT name, provider_type, is_active, host, redirect_uri, app_id, credentials, notes, created_at, updated_at FROM oauth_profiles ORDER BY name',
  );
  return rows.map((r: any) => ({
    name: r.name,
    provider_type: r.provider_type,
    is_active: r.is_active,
    host: r.host,
    redirect_uri: r.redirect_uri,
    app_id: r.app_id,
    credentials: { app_secret: '***' },
    notes: r.notes,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }));
}

export async function getActiveOAuthProfile(providerType: string): Promise<{
  name: string;
  provider_type: string;
  is_active: boolean;
  host: string | null;
  redirect_uri: string | null;
  app_id: string;
  credentials: { app_secret: string };
  notes: string | null;
  created_at: string;
  updated_at: string;
} | null> {
  const pool = getPool();
  const { rows: [row] } = await pool.query(
    'SELECT name, provider_type, is_active, host, redirect_uri, app_id, credentials, notes, created_at, updated_at FROM oauth_profiles WHERE provider_type = $1 AND is_active = TRUE',
    [providerType],
  );
  if (!row) return null;

  const envelope = row.credentials as { iv: string; tag: string; ciphertext: string };
  const plaintext = decryptSecret(envelope, 'chat-proxy:oauth-profile:v1');
  const credentials = JSON.parse(plaintext) as { app_secret: string };

  return {
    name: row.name,
    provider_type: row.provider_type,
    is_active: row.is_active,
    host: row.host,
    redirect_uri: row.redirect_uri,
    app_id: row.app_id,
    credentials,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function upsertOAuthProfile(params: {
  name: string;
  provider_type: string;
  host?: string | null;
  redirect_uri?: string | null;
  app_id: string;
  credentials: { app_secret: string };
  is_active?: boolean;
  notes?: string | null;
}): Promise<void> {
  const pool = getPool();
  const encrypted = encryptSecret(JSON.stringify(params.credentials), 'chat-proxy:oauth-profile:v1');
  await pool.query(
    `INSERT INTO oauth_profiles (name, provider_type, is_active, host, redirect_uri, app_id, credentials, notes, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
     ON CONFLICT (name) DO UPDATE SET
       provider_type = EXCLUDED.provider_type,
       is_active = EXCLUDED.is_active,
       host = EXCLUDED.host,
       redirect_uri = EXCLUDED.redirect_uri,
       app_id = EXCLUDED.app_id,
       credentials = EXCLUDED.credentials,
       notes = EXCLUDED.notes,
       updated_at = NOW()`,
    [params.name, params.provider_type, params.is_active ?? false,
     params.host ?? null, params.redirect_uri ?? null, params.app_id,
     JSON.stringify(encrypted), params.notes ?? null],
  );
}

export async function setOAuthProfileActive(name: string): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Look up provider_type for the named profile
    const { rows: [profile] } = await client.query(
      'SELECT provider_type FROM oauth_profiles WHERE name = $1',
      [name],
    );
    if (!profile) {
      throw new Error(`OAuth profile not found: ${name}`);
    }

    // Clear is_active for all rows of the same provider_type
    await client.query(
      'UPDATE oauth_profiles SET is_active = FALSE WHERE provider_type = $1 AND is_active = TRUE',
      [profile.provider_type],
    );

    // Set is_active = TRUE for the named row
    await client.query(
      'UPDATE oauth_profiles SET is_active = TRUE WHERE name = $1',
      [name],
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteOAuthProfile(name: string): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM oauth_profiles WHERE name = $1', [name]);
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

export async function getObsSources(): Promise<string[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT DISTINCT source FROM obs_sessions WHERE source IS NOT NULL ORDER BY source`,
  );
  return rows.map((r: any) => r.source);
}

export async function getObsTokenUsage(options: { source?: string } = {}): Promise<any[]> {
  const pool = getPool();
  const sourceFilter = options.source ? ` AND source = $1` : '';
  const params: any[] = options.source ? [options.source] : [];
  const { rows } = await pool.query(
    `SELECT COALESCE(model, 'unknown') as model,
       COUNT(*)::int as "requestCount",
       COALESCE(SUM(input_tokens), 0)::int as "totalInputTokens",
       COALESCE(SUM(output_tokens), 0)::int as "totalOutputTokens",
       COALESCE(SUM(total_tokens), 0)::int as "totalTokens",
       COALESCE(SUM(cached_input_tokens), 0)::int as "totalCachedInputTokens"
     FROM obs_events
     WHERE event_type = 'message' AND total_tokens IS NOT NULL${sourceFilter}
     GROUP BY model ORDER BY "totalTokens" DESC`,
    params,
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
