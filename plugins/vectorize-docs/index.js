// @ts-check
/**
 * Docusaurus plugin to index documentation into a local SQLite database on postBuild.
 * Uses better-sqlite3 for FTS5-powered full-text search.
 *
 * Environment variables:
 * - DOCS_SITE_URL — default: https://docs.zilliz.com
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const {extractTitle, chunkText} = require('./utils');

module.exports = function vectorizeDocsPlugin(context, options) {
  return {
    name: 'vectorize-docs',

    async postBuild({outDir}) {
      const siteDir = context.siteDir;
      const docsSiteUrl = (process.env.DOCS_SITE_URL || 'https://docs.zilliz.com').replace(/\/$/, '');

      // Ensure data directory exists
      const dataDir = path.resolve(siteDir, 'data');
      fs.mkdirSync(dataDir, {recursive: true});

      const dbPath = path.resolve(dataDir, 'docs.db');
      const db = new Database(dbPath);

      // Enable WAL mode for better write performance
      db.pragma('journal_mode = WAL');

      // Create tables (inline from db-schema.ts)
      ensureTables(db);

      console.log('[vectorize-docs] Starting documentation indexing...');
      console.log(`[vectorize-docs] Database: ${dbPath}`);

      // 1. Collect all markdown files from build output
      const docDirs = ['docs', 'docs-byoc', 'reference'].map(d => path.join(outDir, d));
      const mdFiles = [];

      for (const dir of docDirs) {
        if (!fs.existsSync(dir)) continue;
        collectMarkdownFiles(dir, mdFiles);
      }

      console.log(`[vectorize-docs] Found ${mdFiles.length} markdown files`);

      // 2. Compute content hashes for incremental sync
      const fileData = mdFiles.map(filePath => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const hash = crypto.createHash('md5').update(content).digest('hex');
        const relativePath = path.relative(outDir, filePath);
        const docUrlMd = `/${relativePath}`;
        const docUrl = docUrlMd.replace(/\.md$/, '').replace(/\/index$/, '');
        const title = extractTitle(content) || path.basename(filePath, '.md');
        const section = relativePath.startsWith('docs-byoc') ? 'byoc-guides'
          : relativePath.startsWith('reference') ? 'api-reference'
          : 'cloud-guides';

        return {filePath, content, hash, docUrlMd, docUrl, title, section};
      });

      // 3. Fetch existing hashes for incremental sync
      const existingHashes = new Map();
      for (const row of db.prepare('SELECT doc_url_md, content_hash FROM doc_chunks').all()) {
        existingHashes.set(row.doc_url_md, row.content_hash);
      }
      console.log(`[vectorize-docs] Found ${existingHashes.size} existing docs in database`);

      // 4. Determine what needs updating
      const newDocUrlMds = new Set(fileData.map(f => f.docUrlMd));
      const toUpsert = fileData.filter(f => existingHashes.get(f.docUrlMd) !== f.hash);
      const toDelete = [...existingHashes.keys()].filter(url => !newDocUrlMds.has(url));

      console.log(`[vectorize-docs] Changes: ${toUpsert.length} new/modified, ${toDelete.length} deleted, ${fileData.length - toUpsert.length} unchanged`);

      // 5. Delete removed docs
      if (toDelete.length > 0) {
        const deleteStmt = db.prepare('DELETE FROM doc_chunks WHERE doc_url_md = ?');
        const deleteMany = db.transaction((urls) => {
          for (const url of urls) {
            deleteStmt.run(url);
          }
        });
        deleteMany(toDelete);
        console.log(`[vectorize-docs] Deleted ${toDelete.length} removed docs`);
      }

      // 6. Chunk and insert changed docs
      if (toUpsert.length === 0) {
        console.log('[vectorize-docs] No changes to index');
        db.close();
        return;
      }

      const allChunks = [];

      // First, delete old chunks for docs that will be re-indexed
      const deleteByDoc = db.prepare('DELETE FROM doc_chunks WHERE doc_url_md = ?');
      const deleteOld = db.transaction((docs) => {
        for (const doc of docs) {
          deleteByDoc.run(doc.docUrlMd);
        }
      });
      deleteOld(toUpsert);

      // Build chunk list
      for (const doc of toUpsert) {
        const chunks = chunkText(doc.content);

        for (let j = 0; j < chunks.length; j++) {
          allChunks.push({
            id: `${doc.docUrlMd}#${j}`,
            doc_url: doc.docUrl,
            doc_url_md: doc.docUrlMd,
            doc_title: doc.title.slice(0, 255),
            section: doc.section,
            content: chunks[j].slice(0, 4000),
            content_hash: doc.hash,
            weight: 1.0,
          });
        }
      }

      // Bulk insert in a transaction
      const insert = db.prepare(
        'INSERT OR REPLACE INTO doc_chunks (id, doc_url, doc_url_md, doc_title, section, content, content_hash, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      );
      const insertMany = db.transaction((chunks) => {
        for (const chunk of chunks) {
          insert.run(
            chunk.id,
            chunk.doc_url,
            chunk.doc_url_md,
            chunk.doc_title,
            chunk.section,
            chunk.content,
            chunk.content_hash,
            chunk.weight
          );
        }
      });
      insertMany(allChunks);

      console.log(`[vectorize-docs] Done! Indexed ${allChunks.length} chunks from ${toUpsert.length} docs`);

      db.close();
    },
  };
};

// ---------------------------------------------------------------------------
// SQLite schema (mirrors chat-proxy/src/db-schema.ts for doc_chunks tables)
// ---------------------------------------------------------------------------

function ensureTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS doc_chunks (
      id TEXT PRIMARY KEY,
      doc_url TEXT NOT NULL,
      doc_url_md TEXT NOT NULL,
      doc_title TEXT NOT NULL,
      section TEXT NOT NULL,
      content TEXT NOT NULL,
      content_hash TEXT NOT NULL,
      weight REAL DEFAULT 1.0
    )
  `);

  db.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS doc_chunks_fts USING fts5(
      content,
      doc_title,
      content='doc_chunks',
      content_rowid='rowid',
      tokenize='porter unicode61'
    )
  `);

  // Triggers to keep FTS index in sync with doc_chunks
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS doc_chunks_ai AFTER INSERT ON doc_chunks BEGIN
      INSERT INTO doc_chunks_fts(rowid, content, doc_title) VALUES (new.rowid, new.content, new.doc_title);
    END
  `);
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS doc_chunks_ad AFTER DELETE ON doc_chunks BEGIN
      INSERT INTO doc_chunks_fts(doc_chunks_fts, rowid, content, doc_title) VALUES ('delete', old.rowid, old.content, old.doc_title);
    END
  `);
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS doc_chunks_au AFTER UPDATE ON doc_chunks BEGIN
      INSERT INTO doc_chunks_fts(doc_chunks_fts, rowid, content, doc_title) VALUES ('delete', old.rowid, old.content, old.doc_title);
      INSERT INTO doc_chunks_fts(rowid, content, doc_title) VALUES (new.rowid, new.content, new.doc_title);
    END
  `);

  // Indexes for filtering
  db.exec(`CREATE INDEX IF NOT EXISTS idx_doc_chunks_section ON doc_chunks(section)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_doc_chunks_url ON doc_chunks(doc_url)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_doc_chunks_hash ON doc_chunks(content_hash)`);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function collectMarkdownFiles(dir, files) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectMarkdownFiles(fullPath, files);
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
}
