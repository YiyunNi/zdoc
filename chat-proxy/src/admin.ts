import {Hono} from 'hono';
import {readFileSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {loadIndex, getIndexSize} from './rag.js';
import {eventStore} from './event-store.js';
import {invalidateSemanticCache, getCacheStats, getCacheEntriesCount, getSemanticCacheConfig, invalidateCacheEntry} from './semantic-cache.js';
import {getTokenUsageByModel, getTokenUsageSummary, getTokenUsageCount, getRecentTokenUsage, getDocGaps, resolveDocGap, getDocGapsCount, getContentQuality, getPool} from './db.js';

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
    // Invalidate semantic cache when doc index refreshes (sources may have changed)
    invalidateSemanticCache().catch(() => {});
    const took = ((Date.now() - start) / 1000).toFixed(1);
    const chunks = await getIndexSize();
    console.log(`[Admin] Index refreshed: ${chunks} chunks in ${took}s`);
    return c.json({ok: true, chunks, took: `${took}s`, updated: new Date().toISOString()});
  } catch (err) {
    return c.json({error: String(err)}, 500);
  }
});

// GET /admin/stats — index size, cache stats, and token usage summary
adminApp.get('/stats', async c => {
  const cacheStats = await getCacheStats();
  const cacheConfig = getSemanticCacheConfig();
  const tokenSummary = await getTokenUsageSummary();
  return c.json({
    doc_chunks: await getIndexSize(),
    semantic_cache: {
      ...cacheStats,
      entries: await getCacheEntriesCount(),
      config: cacheConfig,
    },
    token_usage: tokenSummary,
  });
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

// ---------------------------------------------------------------------------
// Semantic cache management
// ---------------------------------------------------------------------------

// GET /admin/api/cache/entries — list cached entries
adminApp.get('/api/cache/entries', async c => {
  const limit = parseInt(c.req.query('limit') || '100', 10);
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, query_text, agent, section_filter, confidence, created_at, hits, length(sse_events) as event_size
     FROM answer_cache ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return c.json({entries: rows});
});

// DELETE /admin/api/cache/:id — invalidate a specific cache entry
adminApp.delete('/api/cache/:id', c => {
  const id = parseInt(c.req.param('id'), 10);
  invalidateCacheEntry(id).catch(() => {});
  return c.json({ok: true, id});
});

// ---------------------------------------------------------------------------
// Token usage endpoints
// ---------------------------------------------------------------------------

// GET /admin/api/token-usage/by-model — aggregate tokens by model
adminApp.get('/api/token-usage/by-model', async c => {
  return c.json({byModel: await getTokenUsageByModel()});
});

// GET /admin/api/token-usage/recent — recent token usage entries
adminApp.get('/api/token-usage/recent', async c => {
  const limit = parseInt(c.req.query('limit') || '50', 10);
  return c.json({entries: await getRecentTokenUsage(limit)});
});

// GET /admin/api/token-usage/live — in-memory buffer aggregation
adminApp.get('/api/token-usage/live', c => {
  return c.json({byModel: eventStore.getTokenUsage()});
});

// ---------------------------------------------------------------------------
// Content gaps and quality
// ---------------------------------------------------------------------------

// GET /admin/api/doc-gaps — unresolved content gaps
adminApp.get('/api/doc-gaps', async c => {
  const limit = parseInt(c.req.query('limit') || '100', 10);
  return c.json({gaps: await getDocGaps(limit)});
});

// PATCH /admin/api/doc-gaps/:id — mark resolved or dismissed
adminApp.patch('/api/doc-gaps/:id', async c => {
  const id = parseInt(c.req.param('id'), 10);
  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({error: 'Invalid JSON body'}, 400);
  }
  const status = body.status === 'dismissed' ? 2 : 1;
  await resolveDocGap(id, status);
  return c.json({ok: true, id, resolved: status});
});

// GET /admin/api/content-quality — content quality issues
adminApp.get('/api/content-quality', async c => {
  const limit = parseInt(c.req.query('limit') || '50', 10);
  return c.json({issues: await getContentQuality(limit)});
});
