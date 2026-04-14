# Chat-Proxy SQLite Migration Plan

## Summary

Replace the in-memory BM25 index and Zilliz Cloud dependency with a local SQLite database using **FTS5** (full-text search). No embeddings, no sqlite-vec, no `vectorize-docs` plugin.

**Key decisions:**
- **FTS5 only.** No vector search. The LLM handles intent understanding; retrieval just needs relevant docs. FTS5 with Porter stemming is an upgrade over the hand-rolled BM25.
- **No `vectorize-docs` plugin.** Delete it entirely. Its purpose was "embed chunks → push to Zilliz" — neither is needed now.
- **`llms-txt` plugin unchanged.** It already generates the source text files and uploads to S3. That's the only input.
- **Chat-proxy builds its own SQLite index at runtime.** `loadIndex()` already fetches `llms.txt` from S3 and parses chunks. We just write to SQLite instead of an in-memory map.

## Current vs Target

### Current

```
Build time:
  llms-txt plugin       → text files → S3 (already works)
  vectorize-docs plugin → embed chunks → Zilliz Cloud

Runtime:
  chat-proxy loads llms.txt from S3 → in-memory BM25 index (custom)
  chat-proxy queries Zilliz Cloud   → vector search (REST API)
  chat-proxy fuses both             → RRF hybrid search
```

### Target

```
Build time:
  llms-txt plugin → text files → S3 (unchanged)

Runtime:
  chat-proxy loads llms.txt from S3 → writes to local SQLite (FTS5)
  chat-proxy queries SQLite         → FTS5 search
```

### What changes

| Component | Action |
|-----------|--------|
| `plugins/vectorize-docs/` | **DELETE** — no longer needed |
| In-memory BM25 index (`rag.ts`) | **REPLACE** with FTS5 queries |
| Zilliz Cloud vector search | **REMOVE** |
| `src/zilliz-client.ts` | **DELETE** |
| `src/init-collections.ts` | **DELETE** |
| `src/semantic-cache.ts` | **DELETE** (L2 cache relied on Zilliz; L1 exact-match stays in `index.ts`) |
| `src/rag.ts` `loadIndex()` | **REWRITE** — parse llms.txt → write to SQLite instead of in-memory arrays |
| `src/rag.ts` `searchDocsBM25()` | **REPLACE** with `searchDocsFTS5()` |
| `src/rag.ts` `searchDocsVector()` | **DELETE** |
| `src/rag.ts` `fuseWithRRF()` | **DELETE** (no hybrid search) |
| `src/rag.ts` all BM25 internals | **DELETE** — tokenization, IDF, TF, scoring, stop words, synonyms |

### What stays unchanged

| Component | Reason |
|-----------|--------|
| `llms-txt` plugin | Generates source text files — the pipeline input |
| Session store (in-memory Map) | Ephemeral by design |
| Event store (circular buffer) | Analytics buffer |
| Content cache / `fetchDocContent()` | On-demand page fetching still useful |
| S3 log export (`log-sink.ts`) | Unrelated |
| Agent/tool system | Operates above RAG layer |
| Admin dashboard UI | API contracts preserved |

## Database Schema

Single file: `./data/chat-proxy.db` (SQLite, WAL mode).

### `doc_chunks` — document content + metadata

```sql
CREATE TABLE doc_chunks (
  id          TEXT PRIMARY KEY,        -- e.g. "/docs/quick-start#0"
  doc_url     TEXT NOT NULL,
  doc_url_md  TEXT NOT NULL,
  doc_title   TEXT NOT NULL,
  section     TEXT NOT NULL,           -- 'cloud-guides' | 'byoc-guides' | 'api-reference'
  content     TEXT NOT NULL,
  weight      REAL NOT NULL DEFAULT 1.0,
  created_at  TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_chunks_url ON doc_chunks(doc_url);
CREATE INDEX idx_chunks_section ON doc_chunks(section);
```

### `doc_chunks_fts` — FTS5 virtual table

```sql
CREATE VIRTUAL TABLE doc_chunks_fts USING fts5(
  doc_title,
  content,
  content='doc_chunks',
  content_rowid='rowid',
  tokenize='porter unicode61'
);
```

External content table — no duplicate text storage. FTS5 reads from `doc_chunks` via rowid.

Triggers to keep FTS5 in sync (fires during `loadIndex()` bulk insert):

```sql
CREATE TRIGGER doc_chunks_ai AFTER INSERT ON doc_chunks BEGIN
  INSERT INTO doc_chunks_fts(rowid, doc_title, content)
  VALUES (new.rowid, new.doc_title, new.content);
END;

CREATE TRIGGER doc_chunks_ad AFTER DELETE ON doc_chunks BEGIN
  INSERT INTO doc_chunks_fts(doc_chunks_fts, rowid, doc_title, content)
  VALUES ('delete', old.rowid, old.doc_title, old.content);
END;

CREATE TRIGGER doc_chunks_au AFTER UPDATE ON doc_chunks BEGIN
  INSERT INTO doc_chunks_fts(doc_chunks_fts, rowid, doc_title, content)
  VALUES ('delete', old.rowid, old.doc_title, old.content);
  INSERT INTO doc_chunks_fts(rowid, doc_title, content)
  VALUES (new.rowid, new.doc_title, new.content);
END;
```

### `metadata` — index state tracking

```sql
CREATE TABLE metadata (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

Rows written after each index build:
- `schema_version` → `'1'`
- `last_build` → ISO timestamp
- `total_chunks` → count
- `source` → `INDEX_BASE_URL` value

## Implementation Steps

### Phase 1: Foundation — `src/db.ts` (new file)

Add `better-sqlite3` to chat-proxy dependencies and create the database module.

**Step 1.1 — Add dependency**

```bash
cd chat-proxy && pnpm add better-sqlite3 && pnpm add -D @types/better-sqlite3
```

**Step 1.2 — Create `src/db.ts`**

Responsibilities:
- Create/open SQLite database at `SQLITE_PATH` (default `./data/chat-proxy.db`)
- Create schema (tables, FTS5, triggers, metadata) if not exists
- Enable WAL mode
- Export `getDb()` singleton
- Export `resetDb()` for index rebuilds (delete all rows, truncate FTS5)

```typescript
import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const SQLITE_PATH = process.env.SQLITE_PATH || './data/chat-proxy.db';
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export function isDbReady(): boolean { return db !== null; }

export function initDb(): void {
  mkdirSync(dirname(SQLITE_PATH), { recursive: true });
  db = new Database(SQLITE_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  createSchema(db);
}

function createSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS doc_chunks (...);
    CREATE TABLE IF NOT EXISTS metadata (...);
    CREATE VIRTUAL TABLE IF NOT EXISTS doc_chunks_fts USING fts5(...);
    CREATE TRIGGER IF NOT EXISTS doc_chunks_ai ...;
    CREATE TRIGGER IF NOT EXISTS doc_chunks_ad ...;
    CREATE TRIGGER IF NOT EXISTS doc_chunks_au ...;
    CREATE INDEX IF NOT EXISTS idx_chunks_url ON doc_chunks(doc_url);
    CREATE INDEX IF NOT EXISTS idx_chunks_section ON doc_chunks(section);
  `);
}

/** Clear all data for a full rebuild. */
export function resetDb(): void {
  const d = getDb();
  d.exec('DELETE FROM doc_chunks');
  d.exec('INSERT INTO doc_chunks_fts(doc_chunks_fts) VALUES("rebuild")');
  d.exec('DELETE FROM metadata');
}

export function getIndexStats(): { chunks: number; lastBuild: string | null } {
  const d = getDb();
  const row = d.prepare("SELECT value FROM metadata WHERE key = 'total_chunks'").get() as any;
  const ts = d.prepare("SELECT value FROM metadata WHERE key = 'last_build'").get() as any;
  return { chunks: Number(row?.value || 0), lastBuild: ts?.value || null };
}
```

### Phase 2: Index loading — Rewrite `loadIndex()` in `rag.ts`

The current `loadIndex()` fetches `llms.txt` files from S3, parses into chunks, and builds an in-memory BM25 index. We rewrite it to write chunks into SQLite instead.

**Step 2.1 — Rewrite `loadIndex()`**

```
1. Fetch llms.txt files from INDEX_BASE_URL (unchanged — same fetchWithRetry)
2. Parse into chunks (unchanged — same parseLlmsFullText)
3. Reset SQLite: resetDb()
4. Bulk insert into doc_chunks inside a transaction (triggers populate FTS5)
5. Optimize FTS5: INSERT INTO doc_chunks_fts(doc_chunks_fts) VALUES('optimize')
6. Write metadata table
```

The parseLlmsFullText() function stays largely the same — it just returns an array of chunk objects instead of `IndexedChunk` with TF/IDF data. We strip it down to: `{id, doc_url, doc_url_md, doc_title, section, content, weight}`.

**Step 2.2 — Bulk insert pattern**

```typescript
const insertMany = db.transaction((chunks: ParsedChunk[]) => {
  const stmt = db.prepare(`
    INSERT INTO doc_chunks (id, doc_url, doc_url_md, doc_title, section, content, weight)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const c of chunks) stmt.run(c.id, c.doc_url, c.doc_url_md, c.doc_title, c.section, c.content, c.weight);
});
insertMany(allChunks);
```

FTS5 triggers fire automatically on each INSERT. The transaction keeps it fast.

**Step 2.3 — Periodic refresh (unchanged pattern)**

The existing 30-minute refresh interval stays. On refresh:
1. Re-fetch `llms.txt` from `INDEX_BASE_URL`
2. Compare chunk count or content hash with metadata
3. If changed → `resetDb()` → re-insert all chunks

### Phase 3: Search — Replace BM25 with FTS5

**Step 3.1 — New `searchDocsFTS5()` function**

```typescript
export function searchDocsFTS5(query: string, topK = TOP_K, sectionFilter?: string): SearchResult[] {
  const db = getDb();
  const ftsQuery = queryToFTS(query);  // "how to index" → "how OR to OR index"

  let sql = `
    SELECT c.id, c.doc_url, c.doc_url_md, c.doc_title, c.section,
           c.content, c.weight,
           bm25(doc_chunks_fts, 2.0, 1.0) AS rank
    FROM doc_chunks_fts f
    JOIN doc_chunks c ON c.rowid = f.rowid
    WHERE f.doc_chunks_fts MATCH ?
      AND c.doc_url != '/docs/home'`;

  const params: any[] = [ftsQuery];

  if (sectionFilter) {
    const m = sectionFilter.match(/section\s*(!=|==)\s*"([^"]+)"/);
    if (m) {
      sql += m[1] === '!=' ? ' AND c.section != ?' : ' AND c.section = ?';
      params.push(m[2]);
    }
  }

  sql += ' ORDER BY rank LIMIT ?';
  params.push(topK);

  const rows = db.prepare(sql).all(...params);

  return rows.map((r: any) => ({
    id: r.id,
    doc_url: r.doc_url,
    doc_url_md: r.doc_url_md,
    doc_title: cleanTitle(r.doc_title),
    section: r.section,
    content: r.content,
    score: -r.rank,       // FTS5 bm25 is negative; negate for consistency
    weight: r.weight,
    contextScore: -r.rank,
  }));
}
```

**Step 3.2 — `queryToFTS()` helper**

Converts a natural language query to FTS5 match syntax:

```typescript
function queryToFTS(query: string): string {
  // Split on whitespace, filter short tokens, join with OR
  return query
    .split(/\s+/)
    .filter(t => t.length > 1)
    .map(t => `"${t}"`)   // quote each token for exact matching
    .join(' OR ');
}
```

FTS5's Porter stemmer handles morphological variants ("indexing" matches "index", "indexes").

**Step 3.3 — Simplify `searchDocs()`**

```typescript
export function searchDocs(query: string, topK = TOP_K, sectionFilter?: string): SearchResult[] {
  return searchDocsFTS5(query, topK, sectionFilter);
}
```

Signature changes from `async` to sync since `better-sqlite3` is synchronous. Callers using `await` still work fine.

**Step 3.4 — Delete BM25 internals**

Remove from `rag.ts`:
- `STOP_WORDS`, `SOFT_STOP_WORDS`, `SYNONYMS`
- `tokenize()`, `tokenizeQuery()`, `WeightedToken` type
- `IndexedChunk` interface, `indexChunks`, `idf`, `avgDocLen`
- `buildBM25Index()`, `scoreBM25()`
- `searchDocsBM25()`, `searchDocsVector()`, `fuseWithRRF()`
- `SEARCH_MODE` env var logic

### Phase 4: Rewrite `listPages()` and `getTitleByUrl()`

These currently iterate over the in-memory `indexChunks` array. Rewrite to query SQLite.

```typescript
export function listPages(sectionFilter?: string, titleContains?: string): {title: string; url: string; section: string}[] {
  const db = getDb();
  let sql = `SELECT DISTINCT doc_url, doc_title, section FROM doc_chunks WHERE doc_url != '/docs/home'`;
  const params: any[] = [];

  if (sectionFilter) {
    const m = sectionFilter.match(/section\s*(!=|==)\s*"([^"]+)"/);
    if (m) {
      sql += m[1] === '!=' ? ' AND section != ?' : ' AND section = ?';
      params.push(m[2]);
    }
  }
  if (titleContains) {
    sql += ' AND doc_title LIKE ?';
    params.push(`%${titleContains}%`);
  }
  sql += ' LIMIT 200';

  return db.prepare(sql).all(...params).map((r: any) => ({
    title: cleanTitle(r.doc_title),
    url: r.doc_url,
    section: r.section,
  }));
}

export function getTitleByUrl(url: string): string | null {
  const normalized = url.replace(/\.md$/, '');
  const db = getDb();
  const row = db.prepare(
    "SELECT doc_title FROM doc_chunks WHERE doc_url = ? OR doc_url LIKE ? LIMIT 1"
  ).get(normalized, `%${normalized}`) as any;
  return row ? cleanTitle(row.doc_title) : null;
}
```

### Phase 5: Server lifecycle

**Step 5.1 — Update `src/server.ts`**

```typescript
// Before:
import { ensureCollections } from './init-collections.js';
import { loadIndex } from './rag.js';
await ensureCollections();
await loadIndex();

// After:
import { initDb } from './db.js';
import { loadIndex } from './rag.js';
initDb();           // creates schema if needed
await loadIndex();  // fetches llms.txt → writes to SQLite
```

**Step 5.2 — Update `src/index.ts`**

- Remove ZILLIZ_ENDPOINT, ZILLIZ_TOKEN from startup validation
- Remove SEARCH_MODE branching
- Remove precomputedEmbedding passing
- Remove L2 semantic cache calls (`findSemanticCacheHit`)
- Remove ZILLIZ_COLLECTION usage

**Step 5.3 — Update `src/admin.ts`**

```typescript
import { getIndexStats } from './db.js';

app.get('/api/admin/index-status', (c) => {
  const stats = getIndexStats();
  return c.json({ ready: isDbReady(), chunks: stats.chunks, lastRefreshed: stats.lastBuild });
});
```

### Phase 6: Cleanup

**Step 6.1 — Delete files**

```
src/zilliz-client.ts
src/init-collections.ts
src/semantic-cache.ts
plugins/vectorize-docs/         (entire directory)
```

**Step 6.2 — Remove plugin from `docusaurus.config.ts`**

```diff
  plugins: [
    './plugins/llms-txt',
-   './plugins/vectorize-docs',
    ...
  ]
```

**Step 6.3 — Fix imports across all files**

```
grep -r "from './zilliz-client" → remove or replace
grep -r "from './init-collections" → replace with './db'
grep -r "from './semantic-cache" → remove
```

**Step 6.4 — Update tests**

- Delete tests mocking Zilliz REST API
- Delete tests for `vectorize-docs` plugin
- Add test fixture: small SQLite .db with test chunks
- Rewrite `rag.test.ts` to use test DB
- Test FTS5 query edge cases (empty query, special chars, no results)

**Step 6.5 — Update Dockerfile**

```diff
- ENV ZILLIZ_ENDPOINT=""
- ENV ZILLIZ_TOKEN=""
+ ENV SQLITE_PATH="./data/chat-proxy.db"
```

**Step 6.6 — Update README**

Remove env vars: `ZILLIZ_ENDPOINT`, `ZILLIZ_TOKEN`, `ZILLIZ_COLLECTION`, `SEARCH_MODE`, `SEMANTIC_CACHE_*`, `EMBEDDING_*`

Add env vars: `SQLITE_PATH`

## Environment Variable Changes

| Variable | Action |
|----------|--------|
| `ZILLIZ_ENDPOINT` | **REMOVE** |
| `ZILLIZ_TOKEN` | **REMOVE** |
| `ZILLIZ_COLLECTION` | **REMOVE** |
| `SEARCH_MODE` | **REMOVE** |
| `SEMANTIC_CACHE_ENABLED` | **REMOVE** |
| `SEMANTIC_CACHE_THRESHOLD` | **REMOVE** |
| `SEMANTIC_CACHE_MAX_AGE_DAYS` | **REMOVE** |
| `EMBEDDING_MODEL` | **REMOVE** |
| `EMBEDDING_API_KEY` | **REMOVE** |
| `EMBEDDING_BASE_URL` | **REMOVE** |
| `EMBEDDING_DIM` | **REMOVE** |
| `SQLITE_PATH` | **ADD** (default: `./data/chat-proxy.db`) |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| FTS5 quality worse than hybrid | Low | Medium | FTS5 is an upgrade over current BM25; LLM compensates; sqlite-vec can be added later |
| SQLite DB corruption | Low | High | WAL mode + `synchronous=NORMAL`; `loadIndex()` can rebuild from scratch |
| `loadIndex()` slower (SQLite writes vs in-memory) | Low | Low | Bulk insert in transaction; ~1000-5000 chunks inserts in <1s |
| `better-sqlite3` native build issues | Low | Medium | Pre-built binaries available for all platforms; CI runs Linux x64 |

## Performance Expectations

| Operation | Current | Target |
|-----------|---------|--------|
| Keyword search | ~5ms (in-memory scan) | ~2ms (FTS5 indexed) |
| Vector search | ~50-200ms (Zilliz REST) | N/A (removed) |
| Index load | ~2s (fetch + parse) | ~3s (fetch + parse + SQLite bulk insert) |
| Index refresh (no changes) | ~2s (re-parse) | ~2s (fetch + compare) |
| Index refresh (with changes) | ~2s (re-build in-memory) | ~3s (reset + bulk insert) |
| Startup total | ~5s (Zilliz init + index load) | ~3s (initDb + loadIndex) |

## Future Additions (out of scope)

- **sqlite-vec for hybrid search** — Add if FTS5 alone proves insufficient. Plugin would generate embeddings at build time into the .db; chat-proxy would query both FTS5 and sqlite-vec, fusing with RRF.
- **Incremental index updates** — Track content hashes to only update changed chunks instead of full rebuild.
- **Litestream backup** — Replicate WAL to S3 for crash recovery.
