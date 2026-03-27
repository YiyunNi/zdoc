import {Hono} from 'hono';
import {readFileSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {loadIndex, getIndexSize} from './rag.js';
import {eventStore} from './event-store.js';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Pre-load dashboard HTML at startup
let dashboardHtml = '';
try {
  dashboardHtml = readFileSync(join(__dirname, 'admin-dashboard.html'), 'utf-8');
} catch {
  dashboardHtml = '<html><body><h1>Dashboard not found</h1><p>admin-dashboard.html missing from src/</p></body></html>';
}

export const adminApp = new Hono();

// ---------------------------------------------------------------------------
// Dashboard — served without auth (API calls from JS use auth)
// ---------------------------------------------------------------------------

adminApp.get('/dashboard', c => {
  return c.html(dashboardHtml);
});

// ---------------------------------------------------------------------------
// Auth middleware for API endpoints
// ---------------------------------------------------------------------------

adminApp.use('/api/*', async (c, next) => {
  if (!ADMIN_API_KEY) {
    return c.json({error: 'Admin API not configured (set ADMIN_API_KEY)'}, 503);
  }
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (token !== ADMIN_API_KEY) {
    return c.json({error: 'Unauthorized'}, 401);
  }
  await next();
});

// ---------------------------------------------------------------------------
// Existing admin endpoints
// ---------------------------------------------------------------------------

// POST /admin/refresh-index — re-fetch llms.txt and rebuild BM25 index
adminApp.post('/refresh-index', async c => {
  // This endpoint also needs auth
  if (!ADMIN_API_KEY) return c.json({error: 'Admin API not configured'}, 503);
  const authHeader = c.req.header('Authorization');
  if (authHeader?.replace('Bearer ', '') !== ADMIN_API_KEY) return c.json({error: 'Unauthorized'}, 401);

  try {
    const start = Date.now();
    await loadIndex(true);
    const took = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`[Admin] Index refreshed: ${getIndexSize()} chunks in ${took}s`);
    return c.json({ok: true, chunks: getIndexSize(), took: `${took}s`, updated: new Date().toISOString()});
  } catch (err) {
    return c.json({error: String(err)}, 500);
  }
});

// GET /admin/stats — index size
adminApp.get('/stats', async c => {
  return c.json({doc_chunks: getIndexSize()});
});

// ---------------------------------------------------------------------------
// Dashboard API endpoints
// ---------------------------------------------------------------------------

// GET /admin/api/live — active sessions
adminApp.get('/api/live', c => {
  return c.json({sessions: eventStore.getLive()});
});

// GET /admin/api/performance — per-agent/model stats
adminApp.get('/api/performance', c => {
  return c.json({agents: eventStore.getPerformance()});
});

// GET /admin/api/feedback — recent feedback entries
adminApp.get('/api/feedback', c => {
  const limit = parseInt(c.req.query('limit') || '50', 10);
  return c.json({entries: eventStore.getFeedback(limit)});
});

// GET /admin/api/errors — error events
adminApp.get('/api/errors', c => {
  const limit = parseInt(c.req.query('limit') || '50', 10);
  return c.json({entries: eventStore.getErrors(limit)});
});

// GET /admin/api/low-confidence — medium/low confidence answers
adminApp.get('/api/low-confidence', c => {
  const limit = parseInt(c.req.query('limit') || '50', 10);
  return c.json({entries: eventStore.getLowConfidence(limit)});
});

// GET /admin/api/session/:id — get all events for a session
adminApp.get('/api/session/:id', c => {
  const sessionId = c.req.param('id');
  const allEvents = eventStore.getAll();
  const sessionEvents = allEvents.filter(e => e.sessionId === sessionId);
  if (sessionEvents.length === 0) {
    return c.json({error: 'Session not found', sessionId}, 404);
  }
  return c.json({sessionId, events: sessionEvents});
});
