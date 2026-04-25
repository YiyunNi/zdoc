import {Hono} from 'hono';
import {readFileSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {loadIndex, getIndexSize} from './rag.js';
import {invalidateSemanticCache, getCacheStats, getCacheEntriesCount, getSemanticCacheConfig, invalidateCacheEntry} from './semantic-cache.js';
import {
  getPool,
  getTokenUsageByModel, getTokenUsageSummary, getTokenUsageCount, getRecentTokenUsage,
  getDocGaps, resolveDocGap, getDocGapsCount, getContentQuality,
  getObsOverview, getObsTrends, getObsRecentActivity, getObsLiveSessions,
  getObsPerformance, getObsFeedback, getObsErrors, getObsLowConfidence,
  listObsSessions, getObsSessionDetail, getObsTokenUsage,
  getObsUsers, getTokenTrends, getRuntimeConfigAll, setRuntimeConfigValue,
} from './db.js';
import {resolveModel, createModelInstance} from './runtime-config.js';

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
adminApp.get('/api/live', async c => {
  return c.json({sessions: await getObsLiveSessions()});
});

// GET /admin/api/performance — per-agent/model stats
adminApp.get('/api/performance', async c => {
  return c.json({agents: await getObsPerformance()});
});

// GET /admin/api/feedback — recent feedback entries
adminApp.get('/api/feedback', async c => {
  const limit = parseInt(c.req.query('limit') || '50', 10);
  return c.json({entries: await getObsFeedback(limit)});
});

// GET /admin/api/errors — error events
adminApp.get('/api/errors', async c => {
  const limit = parseInt(c.req.query('limit') || '50', 10);
  return c.json({entries: await getObsErrors(limit)});
});

// GET /admin/api/low-confidence — medium/low confidence answers
adminApp.get('/api/low-confidence', async c => {
  const limit = parseInt(c.req.query('limit') || '50', 10);
  return c.json({entries: await getObsLowConfidence(limit)});
});

// GET /admin/api/session/:id — get all events for a session
adminApp.get('/api/session/:id', async c => {
  const sessionId = c.req.param('id');
  const detail = await getObsSessionDetail(sessionId);
  if (detail.events.length === 0) {
    return c.json({error: 'Session not found', sessionId}, 404);
  }
  return c.json(detail);
});

// GET /admin/api/sessions — paginated session list
adminApp.get('/api/sessions', async c => {
  const page = parseInt(c.req.query('page') || '1', 10);
  const pageSize = parseInt(c.req.query('pageSize') || '20', 10);
  const agent = c.req.query('agent');
  return c.json(await listObsSessions({page, pageSize, agent}));
});

// GET /admin/api/analytics/overview — aggregated dashboard metrics
adminApp.get('/api/analytics/overview', async c => {
  return c.json(await getObsOverview());
});

// GET /admin/api/analytics/trends — per-day time series data
adminApp.get('/api/analytics/trends', async c => {
  const days = parseInt(c.req.query('days') || '7', 10);
  return c.json(await getObsTrends(days));
});

// GET /admin/api/analytics/recent-activity — recent message events
adminApp.get('/api/analytics/recent-activity', async c => {
  const limit = parseInt(c.req.query('limit') || '10', 10);
  return c.json({entries: await getObsRecentActivity(limit)});
});

// GET /admin/api/analytics/users — user-aggregated session data
adminApp.get('/api/analytics/users', async c => {
  const page = parseInt(c.req.query('page') || '1', 10);
  const pageSize = parseInt(c.req.query('pageSize') || '20', 10);
  return c.json(await getObsUsers({page, pageSize}));
});

// GET /admin/api/analytics/token-trends — daily token aggregates
adminApp.get('/api/analytics/token-trends', async c => {
  const days = parseInt(c.req.query('days') || '7', 10);
  return c.json(await getTokenTrends(days));
});

// ---------------------------------------------------------------------------
// Runtime configuration
// ---------------------------------------------------------------------------

// GET /admin/api/config — runtime configuration readout
adminApp.get('/api/config', async c => {
  const [dbConfig, cacheConfig] = await Promise.all([
    getRuntimeConfigAll(),
    Promise.resolve(getSemanticCacheConfig()),
  ]);
  const {rows: [chunkCount]} = await getPool().query('SELECT COUNT(*)::int as count FROM doc_chunks');
  const {rows: [lastBuild]} = await getPool().query("SELECT value FROM metadata WHERE key = 'last_build'");

  return c.json({
    models: dbConfig,
    cache: cacheConfig,
    index: {
      totalChunks: chunkCount?.count || 0,
      lastBuild: lastBuild?.value || null,
      refreshInterval: process.env.INDEX_REFRESH_INTERVAL || '1800000',
      sourceUrl: process.env.DOCS_SITE_URL || 'https://docs.zilliz.com',
    },
  });
});

// PUT /admin/api/config/:key — update provider/model for a config key
adminApp.put('/api/config/:key', async c => {
  const key = c.req.param('key');
  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({error: 'Invalid JSON body'}, 400);
  }
  const provider = String(body.provider || 'openai-compatible');
  const model = String(body.model || '');
  if (!model) return c.json({error: 'model is required'}, 400);

  await setRuntimeConfigValue(key, provider, model);
  return c.json({ok: true, key, provider, model});
});

// POST /admin/api/config/:key/test — validate a provider+model works
adminApp.post('/api/config/:key/test', async c => {
  const key = c.req.param('key');
  const {provider, model} = await resolveModel(key);
  try {
    const instance = createModelInstance(provider, model);
    const {generateText} = await import('ai');
    await generateText({model: instance, prompt: 'Say "ok"', maxOutputTokens: 5});
    return c.json({ok: true, provider, model});
  } catch (err) {
    return c.json({ok: false, provider, model, error: String(err)}, 400);
  }
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

// GET /admin/api/token-usage/live — token usage aggregation from DB
adminApp.get('/api/token-usage/live', async c => {
  return c.json({byModel: await getObsTokenUsage()});
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
