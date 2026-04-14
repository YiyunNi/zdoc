import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

const SQLITE_PATH = resolve(process.cwd(), process.env.SQLITE_PATH ?? './data/chat-proxy.db');

let db: Database.Database | null = null;

export function initDb(): void {
  mkdirSync(dirname(SQLITE_PATH), { recursive: true });

  db = new Database(SQLITE_PATH);

  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS doc_chunks (
      id          TEXT PRIMARY KEY,
      doc_url     TEXT NOT NULL,
      doc_url_md  TEXT NOT NULL,
      doc_title   TEXT NOT NULL,
      section     TEXT NOT NULL,
      content     TEXT NOT NULL,
      weight      REAL NOT NULL DEFAULT 1.0,
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_chunks_url ON doc_chunks(doc_url);
    CREATE INDEX IF NOT EXISTS idx_chunks_section ON doc_chunks(section);

    CREATE TABLE IF NOT EXISTS metadata (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    -- Semantic answer cache: stores embeddings + full SSE event sequences
    CREATE TABLE IF NOT EXISTS answer_cache (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      query_text      TEXT NOT NULL,
      query_embedding TEXT NOT NULL,        -- JSON array of floats
      agent           TEXT NOT NULL,        -- which agent handled it (general, schema, etc.)
      section_filter  TEXT,                 -- section filter at time of caching
      sse_events      TEXT NOT NULL,        -- JSON array of {event, data} objects
      sources         TEXT NOT NULL,        -- JSON array of {url, chunk_hash} for validation
      chunk_hashes    TEXT NOT NULL,        -- JSON array of source chunk hashes for fast lookup
      confidence      TEXT NOT NULL,        -- JSON {level, score}
      created_at      TEXT DEFAULT (datetime('now')),
      hits            INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_cache_agent ON answer_cache(agent);
    CREATE INDEX IF NOT EXISTS idx_cache_created ON answer_cache(created_at);

    -- Token usage tracking: persists per-request token consumption by model
    CREATE TABLE IF NOT EXISTS token_usage (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id          TEXT,
      user_id             TEXT,
      model               TEXT NOT NULL,
      agent_type          TEXT,
      input_tokens        INTEGER NOT NULL,
      output_tokens       INTEGER NOT NULL,
      total_tokens        INTEGER NOT NULL,
      cached_input_tokens INTEGER NOT NULL DEFAULT 0,
      created_at          TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_token_usage_model ON token_usage(model);
    CREATE INDEX IF NOT EXISTS idx_token_usage_session ON token_usage(session_id);
    CREATE INDEX IF NOT EXISTS idx_token_usage_created ON token_usage(created_at);

    -- Content gaps: queries that received low confidence with no matching docs
    CREATE TABLE IF NOT EXISTS doc_gaps (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      query            TEXT NOT NULL,
      session_id       TEXT,
      detected_intent  TEXT,
      tools_called     TEXT,               -- JSON array of tool names
      confidence_level TEXT,
      response_text    TEXT,               -- first 500 chars of the response
      created_at       TEXT DEFAULT (datetime('now')),
      resolved         INTEGER NOT NULL DEFAULT 0  -- 0=unresolved, 1=docs_added, 2=dismissed
    );

    CREATE INDEX IF NOT EXISTS idx_gaps_resolved ON doc_gaps(resolved);
    CREATE INDEX IF NOT EXISTS idx_gaps_created ON doc_gaps(created_at);

    -- Content quality: sources that exist but are too low-signal to be useful
    CREATE TABLE IF NOT EXISTS content_quality (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      url              TEXT NOT NULL,
      issue_type       TEXT NOT NULL,      -- 'demoted', 'stale', 'thin_content'
      suggestion       TEXT,
      occurrence_count INTEGER NOT NULL DEFAULT 1,
      created_at       TEXT DEFAULT (datetime('now')),
      updated_at       TEXT DEFAULT (datetime('now'))
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_content_quality_url ON content_quality(url, issue_type);

    CREATE VIRTUAL TABLE IF NOT EXISTS doc_chunks_fts USING fts5(
      doc_title,
      content,
      content='doc_chunks',
      content_rowid='rowid',
      tokenize='porter unicode61'
    );

    CREATE TRIGGER IF NOT EXISTS doc_chunks_ai AFTER INSERT ON doc_chunks BEGIN
      INSERT INTO doc_chunks_fts(rowid, doc_title, content)
      VALUES (new.rowid, new.doc_title, new.content);
    END;

    CREATE TRIGGER IF NOT EXISTS doc_chunks_ad AFTER DELETE ON doc_chunks BEGIN
      INSERT INTO doc_chunks_fts(doc_chunks_fts, rowid, doc_title, content)
      VALUES ('delete', old.rowid, old.doc_title, old.content);
    END;

    CREATE TRIGGER IF NOT EXISTS doc_chunks_au AFTER UPDATE ON doc_chunks BEGIN
      INSERT INTO doc_chunks_fts(doc_chunks_fts, rowid, doc_title, content)
      VALUES ('delete', old.rowid, old.doc_title, old.content);
      INSERT INTO doc_chunks_fts(rowid, doc_title, content)
      VALUES (new.rowid, new.doc_title, new.content);
    END;
  `);
}

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

export function isDbReady(): boolean {
  return db !== null;
}

export function resetDb(): void {
  const database = getDb();
  database.exec(`
    DELETE FROM doc_chunks;
    DELETE FROM metadata;
    INSERT INTO doc_chunks_fts(doc_chunks_fts) VALUES('rebuild');
  `);
}

export function getIndexStats(): { chunks: number; lastBuild: string | null } {
  const database = getDb();

  const row = database.prepare('SELECT COUNT(*) as count FROM doc_chunks').get() as { count: number };
  const meta = database.prepare("SELECT value FROM metadata WHERE key = 'last_build'").get() as
    | { value: string }
    | undefined;

  return {
    chunks: row.count,
    lastBuild: meta?.value ?? null,
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

export function invalidateCacheByChunkHashes(chunkHashes: string[]): void {
  if (chunkHashes.length === 0) return;
  const database = getDb();
  // Delete any cache entry whose chunk_hashes array contains any of the invalidated hashes
  const stmt = database.prepare(`
    DELETE FROM answer_cache
    WHERE json_array_length(chunk_hashes) > 0
    AND EXISTS (
      SELECT 1 FROM json_each(chunk_hashes) AS je
      WHERE je.value IN (${chunkHashes.map(() => '?').join(',')})
    )
  `);
  stmt.run(...chunkHashes);
}

export function getCacheStats(): { totalEntries: number; totalHits: number } {
  const database = getDb();
  const row = database.prepare(
    'SELECT COUNT(*) as totalEntries, COALESCE(SUM(hits), 0) as totalHits FROM answer_cache'
  ).get() as { totalEntries: number; totalHits: number };
  return row;
}

export function getCacheEntriesCount(): number {
  const database = getDb();
  const row = database.prepare('SELECT COUNT(*) as count FROM answer_cache').get() as { count: number };
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

export function saveTokenUsage(record: TokenUsageRecord): void {
  const database = getDb();
  const insert = database.prepare(`
    INSERT INTO token_usage (session_id, user_id, model, agent_type, input_tokens, output_tokens, total_tokens, cached_input_tokens)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insert.run(
    record.sessionId || null,
    record.userId || null,
    record.model,
    record.agentType,
    record.inputTokens,
    record.outputTokens,
    record.totalTokens,
    record.cachedInputTokens || 0,
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

export function getTokenUsageByModel(): TokenUsageByModel[] {
  const database = getDb();
  const rows = database.prepare(`
    SELECT
      model,
      COUNT(*) as requestCount,
      COALESCE(SUM(input_tokens), 0) as totalInputTokens,
      COALESCE(SUM(output_tokens), 0) as totalOutputTokens,
      COALESCE(SUM(total_tokens), 0) as totalTokens,
      COALESCE(SUM(cached_input_tokens), 0) as totalCachedInputTokens
    FROM token_usage
    GROUP BY model
    ORDER BY totalTokens DESC
  `).all() as TokenUsageByModel[];
  return rows;
}

export function getTokenUsageSummary(): {
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  totalCachedInputTokens: number;
  cachedPercentage: number;
} {
  const database = getDb();
  const row = database.prepare(`
    SELECT
      COUNT(*) as totalRequests,
      COALESCE(SUM(input_tokens), 0) as totalInputTokens,
      COALESCE(SUM(output_tokens), 0) as totalOutputTokens,
      COALESCE(SUM(total_tokens), 0) as totalTokens,
      COALESCE(SUM(cached_input_tokens), 0) as totalCachedInputTokens
    FROM token_usage
  `).get() as {
    totalRequests: number;
    totalInputTokens: number;
    totalOutputTokens: number;
    totalTokens: number;
    totalCachedInputTokens: number;
  };
  return {
    ...row,
    cachedPercentage: row.totalInputTokens > 0
      ? Math.round((row.totalCachedInputTokens / row.totalInputTokens) * 1000) / 10
      : 0,
  };
}

export function getTokenUsageCount(): number {
  const database = getDb();
  const row = database.prepare('SELECT COUNT(*) as count FROM token_usage').get() as { count: number };
  return row.count;
}

export function getRecentTokenUsage(limit = 50): Array<{
  id: number;
  session_id: string | null;
  model: string;
  agent_type: string | null;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cached_input_tokens: number;
  created_at: string;
}> {
  const database = getDb();
  return database.prepare(`
    SELECT id, session_id, model, agent_type, input_tokens, output_tokens, total_tokens, cached_input_tokens, created_at
    FROM token_usage
    ORDER BY created_at DESC
    LIMIT ?
  `).all(limit) as Array<{
    id: number;
    session_id: string | null;
    model: string;
    agent_type: string | null;
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    cached_input_tokens: number;
    created_at: string;
  }>;
}

// ---------------------------------------------------------------------------
// Content gap tracking
// ---------------------------------------------------------------------------

export function insertDocGap(gap: {
  query: string;
  sessionId?: string;
  detectedIntent?: string;
  toolsCalled?: string[];
  confidenceLevel: string;
  responseText: string;
}): void {
  const database = getDb();
  const insert = database.prepare(`
    INSERT INTO doc_gaps (query, session_id, detected_intent, tools_called, confidence_level, response_text)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insert.run(
    gap.query,
    gap.sessionId || null,
    gap.detectedIntent || null,
    gap.toolsCalled ? JSON.stringify(gap.toolsCalled) : null,
    gap.confidenceLevel,
    gap.responseText,
  );
}

export function getDocGaps(limit = 100): Array<{
  id: number;
  query: string;
  session_id: string | null;
  detected_intent: string | null;
  tools_called: string | null;
  confidence_level: string | null;
  response_text: string | null;
  created_at: string;
  resolved: number;
}> {
  const database = getDb();
  return database.prepare(`
    SELECT id, query, session_id, detected_intent, tools_called, confidence_level, response_text, created_at, resolved
    FROM doc_gaps
    WHERE resolved = 0
    ORDER BY created_at DESC
    LIMIT ?
  `).all(limit) as Array<{
    id: number;
    query: string;
    session_id: string | null;
    detected_intent: string | null;
    tools_called: string | null;
    confidence_level: string | null;
    response_text: string | null;
    created_at: string;
    resolved: number;
  }>;
}

export function resolveDocGap(id: number, status: 1 | 2): void {
  const database = getDb();
  database.prepare('UPDATE doc_gaps SET resolved = ? WHERE id = ?').run(status, id);
}

export function getDocGapsCount(): number {
  const database = getDb();
  const row = database.prepare(
    "SELECT COUNT(*) as count FROM doc_gaps WHERE resolved = 0"
  ).get() as { count: number };
  return row.count;
}

// ---------------------------------------------------------------------------
// Content quality tracking
// ---------------------------------------------------------------------------

export function upsertContentQuality(entry: {
  url: string;
  issueType: string;
  suggestion?: string;
}): void {
  const database = getDb();
  database.prepare(`
    INSERT INTO content_quality (url, issue_type, suggestion, occurrence_count)
    VALUES (?, ?, ?, 1)
    ON CONFLICT(url, issue_type) DO UPDATE SET
      occurrence_count = occurrence_count + 1,
      updated_at = datetime('now'),
      suggestion = excluded.suggestion
  `).run(entry.url, entry.issueType, entry.suggestion || null);
}

export function getContentQuality(limit = 50): Array<{
  id: number;
  url: string;
  issue_type: string;
  suggestion: string | null;
  occurrence_count: number;
  created_at: string;
  updated_at: string;
}> {
  const database = getDb();
  return database.prepare(`
    SELECT id, url, issue_type, suggestion, occurrence_count, created_at, updated_at
    FROM content_quality
    ORDER BY occurrence_count DESC, updated_at DESC
    LIMIT ?
  `).all(limit) as Array<{
    id: number;
    url: string;
    issue_type: string;
    suggestion: string | null;
    occurrence_count: number;
    created_at: string;
    updated_at: string;
  }>;
}
