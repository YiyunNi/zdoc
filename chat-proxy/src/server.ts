// Entry point that starts the HTTP server.
// Separated from index.ts so tests can import `app` without triggering startup().
import {config} from 'dotenv';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({path: resolve(__dirname, '../../.env')});

const {serve} = await import('@hono/node-server');
const {app} = await import('./index.js');
const {loadIndex} = await import('./rag.js');
const {startSink} = await import('./log-sink.js');
const {ensureCollections} = await import('./init-collections.js');

const PORT = Number(process.env.PORT) || 8787;
const INDEX_REFRESH_INTERVAL = Number(process.env.INDEX_REFRESH_INTERVAL) || 30 * 60 * 1000; // 30 min

async function startup() {
  // Ensure Zilliz collections exist
  await ensureCollections();

  // Load doc index from live site
  await loadIndex();

  // Periodic background refresh
  setInterval(() => {
    loadIndex(true).catch(err => console.warn('[RAG] Background refresh failed:', err));
  }, INDEX_REFRESH_INTERVAL);

  // Start S3 log sink (if LOG_S3_ENABLED=true)
  startSink();

  console.log(`Chat proxy listening on :${PORT}`);
  serve({fetch: app.fetch, port: PORT});
}

startup();
