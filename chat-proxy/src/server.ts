// Entry point that starts the HTTP server.
// Separated from index.ts so tests can import `app` without triggering startup().
//
// IMPORTANT: dotenv must be loaded before any other imports so that modules
// that read process.env at the top level (router.ts, rag.ts) see the values.
// ES module static imports are hoisted, so we use dynamic import() instead.
import {config} from 'dotenv';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({path: resolve(__dirname, '../../.env')});

const {serve} = await import('@hono/node-server');
const {app} = await import('./index.js');
const {isVectorSearchAvailable, disableVectorSearch, ensureCollection, loadIndex} = await import('./rag.js');
const {ensureLogCollections} = await import('./logger.js');

// Prevent MilvusClient background gRPC reconnection from crashing the process
// when Zilliz Cloud is unreachable (e.g. expired TLS cert).
process.on('unhandledRejection', (reason: unknown) => {
  const msg = reason instanceof Error ? reason.message : String(reason);
  if (msg.includes('UNAVAILABLE') || msg.includes('certificate')) {
    console.warn('[gRPC] Background connection error (suppressed):', msg);
  } else {
    console.error('Unhandled rejection:', reason);
  }
});

const PORT = Number(process.env.PORT) || 8787;

async function startup() {
  // RAG setup
  if (isVectorSearchAvailable()) {
    try {
      await ensureCollection();
      console.log('[RAG] Vector search mode (Zilliz Cloud)');
    } catch (err) {
      console.warn('[Startup] Zilliz Cloud connection failed, falling back to keyword search:', (err as Error).message);
      disableVectorSearch();
      await loadIndex().catch(e => console.warn('[RAG] Failed to load index:', e));
      console.log('[RAG] Keyword search mode (fallback)');
    }
  } else {
    await loadIndex().catch(err => console.warn('[RAG] Failed to load index:', err));
    console.log('[RAG] Keyword search mode (fallback)');
  }

  // Logging setup (independent of RAG mode — uses REST API)
  await ensureLogCollections().catch(err =>
    console.warn('[Logger] Collection setup failed:', (err as Error).message)
  );

  // External sources collection setup
  const {ensureSourcesCollection} = await import('./sources.js');
  await ensureSourcesCollection().catch(err =>
    console.warn('[Sources] Collection setup failed:', (err as Error).message)
  );

  console.log(`Chat proxy listening on :${PORT}`);
  serve({fetch: app.fetch, port: PORT});
}

startup();
