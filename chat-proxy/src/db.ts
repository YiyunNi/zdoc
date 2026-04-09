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
