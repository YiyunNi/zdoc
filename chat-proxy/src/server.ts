// Entry point that starts the HTTP server.
// Separated from index.ts so tests can import `app` without triggering startup().
import {config} from 'dotenv';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envDir = resolve(__dirname, '../../');
config({path: resolve(envDir, '.env')});
// Load .env.development overrides when running locally
config({path: resolve(envDir, '.env.development'), override: true});

const {serve} = await import('@hono/node-server');
const {app} = await import('./index.js');
const {loadIndex} = await import('./rag.js');
const {startSink} = await import('./log-sink.js');
const {initDb} = await import('./db.js');
const {isOAuthEnabled, getSessionSecret} = await import('./auth/session.js');
const {ensureAdminUsersSchema, bootstrapAdmins} = await import('./auth/admin-users.js');
const {initMetrics} = await import('./metrics.js');

const PORT = Number(process.env.PORT) || 8787;
const INDEX_REFRESH_INTERVAL = Number(process.env.INDEX_REFRESH_INTERVAL) || 30 * 60 * 1000; // 30 min

async function startup() {
  // Validate session secret unconditionally (used for both API key and OAuth paths)
  try {
    getSessionSecret();
  } catch {
    console.error('[Startup] ADMIN_SESSION_SECRET is missing. Aborting.');
    process.exit(1);
  }

  // Initialize PostgreSQL database
  await initDb();

  // Ensure admin_users schema and bootstrap
  await ensureAdminUsersSchema();
  await bootstrapAdmins();

  // Load doc index from live site
  await loadIndex();

  // Periodic background refresh
  setInterval(() => {
    loadIndex(false).catch(err => console.warn('[RAG] Background refresh failed:', err));
  }, INDEX_REFRESH_INTERVAL);

  // Initialize metrics counters so /metrics always exposes known series
  initMetrics();

  // Start S3 log sink (if LOG_S3_ENABLED=true)
  startSink();

  console.log(`Chat proxy listening on :${PORT}`);
  serve({fetch: app.fetch, port: PORT});
}

startup();
