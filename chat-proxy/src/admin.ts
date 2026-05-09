import {Hono} from 'hono';
import {readFileSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {loadIndex, getIndexSize, getIndexStatus, getRagSearchCacheStats, getPageContentCacheStats} from './rag.js';
import {invalidateSemanticCache, getCacheStats, getCacheEntriesCount, getSemanticCacheConfig, invalidateCacheEntry, getEmbeddingCacheStats} from './semantic-cache.js';
import {
  getPool,
  getTokenUsageByModel, getTokenUsageSummary, getTokenUsageCount, getRecentTokenUsage,
  getDocGaps, resolveDocGap, getDocGapsCount, getContentQuality,
  getObsOverview, getObsTrends, getObsRecentActivity, getObsLiveSessions,
  getObsPerformance, getObsFeedback, getObsErrors, getObsLowConfidence,
  listObsSessions, getObsSessionDetail, getObsSessionMessagesDetail, getObsTokenUsage,
  getObsUsers, getObsSources, getTokenTrends, getRuntimeConfigAll, setRuntimeConfigValue, deleteRuntimeConfigValue,
  getEmbeddingSchemaDimension,
  getBuildStatus,
  isDbReady,
  listProviderProfiles, getProviderProfile, upsertProviderProfile, deleteProviderProfile,
  listOAuthProfiles, getActiveOAuthProfile, upsertOAuthProfile, setOAuthProfileActive, deleteOAuthProfile,
} from './db.js';
import {resolveModel, createModelInstance, CONFIG_KEYS, type ResolvedModel} from './runtime-config.js';
import {listModelsForProfile} from './provider-models.js';
import {getSessionCount} from './sessions.js';
import {getStats} from './feedback.js';
import {startedAt, llmHealth, recordLlmSuccess} from './health.js';
import {getFeishuConfig, buildAuthorizeUrl, exchangeCodeForToken, fetchFeishuUserInfo, generateOAuthState} from './auth/feishu.js';
import {isOAuthEnabled} from './auth/session.js';
import {requireAuth, requireAdmin, getAuth, setSessionCookie, setStateCookie, clearStateCookie, clearSessionCookie, verifyStateCookie} from './auth/middleware.js';
import {listAdmins, addAdmin, removeAdmin, healAdminProfile} from './auth/admin-users.js';
import {makeTelemetry} from './telemetry.js';
import {bedrockAiSdkMaxRetries} from './bedrock-guard.js';
import {reloadRules, getRules} from './hooks/index.js';
import {getMetricsData} from './metrics.js';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Pre-load dashboard HTML at startup
let dashboardHtml = '';
try {
  dashboardHtml = readFileSync(join(__dirname, 'admin-dashboard.html'), 'utf-8');
} catch {
  dashboardHtml = '<html><body><h1>Dashboard not found</h1><p>admin-dashboard.html missing from src/</p></body></html>';
}

/** Extract a display host/region from a ResolvedModel for health reporting */
function resolvedProviderDisplay(r: ResolvedModel): string {
  if (r.source === 'profile') {
    if (r.provider === 'openai-compatible') {
      return r.baseURL.replace(/\/v\d+$/, '').replace(/^https?:\/\//, '');
    }
    if (r.provider === 'bedrock') {
      return r.region;
    }
  }
  // env fallback
  return (process.env.AI_BASE_URL || '').replace(/\/v\d+$/, '').replace(/^https?:\/\//, '');
}

export const adminApp = new Hono();

// ---------------------------------------------------------------------------
// Dashboard — served without auth (API calls from JS use auth)
// ---------------------------------------------------------------------------

adminApp.get('/dashboard', requireAuth, c => {
  c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  c.header('Pragma', 'no-cache');
  c.header('Expires', '0');
  return c.html(dashboardHtml);
});

// ---------------------------------------------------------------------------
// Auth routes (no prior auth required)
// ---------------------------------------------------------------------------

adminApp.get('/auth/config', c => {
  return c.json({feishu_enabled: isOAuthEnabled()});
});

adminApp.get('/auth/feishu', async c => {
  const cfg = getFeishuConfig();
  if (!cfg || !cfg.redirectUri) {
    return c.html('<html><body><h1>Feishu OAuth not configured</h1><p>Set FEISHU_APP_ID, FEISHU_APP_SECRET, and FEISHU_OAUTH_REDIRECT_URI.</p></body></html>', 503);
  }
  const state = generateOAuthState();
  await setStateCookie(c, state);
  return c.redirect(buildAuthorizeUrl(cfg, state));
});

adminApp.get('/auth/feishu/callback', async c => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  if (!code || !state) {
    return c.html('<html><body><h1>Invalid callback</h1><p>Missing code or state.</p></body></html>', 400);
  }

  const validState = await verifyStateCookie(c, state);
  await clearStateCookie(c);
  if (!validState) {
    return c.html('<html><body><h1>Invalid state</h1><p>CSRF validation failed.</p></body></html>', 403);
  }

  const cfg = getFeishuConfig();
  if (!cfg) {
    return c.html('<html><body><h1>OAuth not configured</h1></body></html>', 503);
  }

  try {
    const tokens = await exchangeCodeForToken(cfg, code);
    const user = await fetchFeishuUserInfo(tokens.access_token, cfg.host);
    // Backfill placeholder admin names left over from ADMIN_BOOTSTRAP_OPEN_IDS seeding.
    await healAdminProfile({
      open_id: user.open_id,
      name: user.name,
      email: user.email,
    }).catch(() => {});
    await setSessionCookie(c, {
      open_id: user.open_id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
    });
    return c.redirect('/admin/dashboard');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'OAuth callback failed';
    return c.html(`<html><body><h1>Login failed</h1><p>${message}</p></body></html>`, 500);
  }
});

adminApp.post('/auth/logout', async c => {
  await clearSessionCookie(c);
  return c.json({ok: true});
});

adminApp.get('/auth/me', requireAuth, c => {
  const auth = getAuth(c)!;
  if (auth.method === 'apikey') {
    return c.json({role: 'admin', authMethod: 'apikey'});
  }
  return c.json({
    open_id: auth.user?.open_id,
    name: auth.user?.name,
    email: auth.user?.email,
    avatar_url: auth.user?.avatar_url,
    role: auth.role,
    authMethod: auth.method,
  });
});

// ---------------------------------------------------------------------------
// Auth middleware for API endpoints
// ---------------------------------------------------------------------------

adminApp.use('/api/*', requireAuth);
adminApp.use('/api/*', async (c, next) => {
  const m = c.req.method;
  if (m === 'GET' || m === 'HEAD' || m === 'OPTIONS') return next();
  return requireAdmin(c, next);
});

// ---------------------------------------------------------------------------
// Existing admin endpoints
// ---------------------------------------------------------------------------

// POST /admin/refresh-index — re-fetch llms.txt and rebuild BM25 index
adminApp.post('/refresh-index', requireAuth, requireAdmin, async c => {
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

// POST /admin/rebuild-index — rebuild with optional triplet extraction
adminApp.post('/rebuild-index', requireAuth, requireAdmin, async c => {
  try {
    const extractTriplets = c.req.query('entities') === 'true';
    const start = Date.now();
    await loadIndex(true, {extractTriplets});
    invalidateSemanticCache().catch(() => {});
    const took = ((Date.now() - start) / 1000).toFixed(1);
    const chunks = await getIndexSize();
    console.log(`[Admin] Index rebuilt${extractTriplets ? ' with entities' : ''}: ${chunks} chunks in ${took}s`);
    return c.json({ok: true, chunks, took: `${took}s`, extractTriplets, updated: new Date().toISOString()});
  } catch (err) {
    return c.json({error: String(err)}, 500);
  }
});

// POST /admin/api/reload-hooks — reload prompt-hooks.yaml without restart
adminApp.post('/api/reload-hooks', requireAuth, requireAdmin, async c => {
  try {
    const rules = reloadRules(import.meta.url);
    console.log(`[Admin] Prompt hooks reloaded: ${rules.length} rule(s)`);
    return c.json({ok: true, count: rules.length, rules: rules.map(r => ({name: r.name, enabled: r.enabled, priority: r.priority}))});
  } catch (err) {
    return c.json({error: String(err)}, 500);
  }
});

// GET /admin/index/entities — entity enrichment stats
adminApp.get('/index/entities', requireAuth, requireAdmin, async c => {
  try {
    const pool = getPool();
    const { rows: [chunkRow] } = await pool.query(
      `SELECT COUNT(*)::int as total,
              COUNT(*) FILTER (WHERE jsonb_array_length(entities) > 0)::int as enriched
       FROM doc_chunks`
    );
    const { rows: [entityRow] } = await pool.query(
      `SELECT COUNT(DISTINCT e) as unique_entities
       FROM doc_chunks, jsonb_array_elements_text(entities) e`
    );
    const { rows: topEntities } = await pool.query(
      `SELECT e as entity, COUNT(*) as occurrences
       FROM doc_chunks, jsonb_array_elements_text(entities) e
       GROUP BY e
       ORDER BY occurrences DESC
       LIMIT 20`
    );
    return c.json({
      totalChunks: chunkRow.total,
      enrichedChunks: chunkRow.enriched,
      uniqueEntities: entityRow.unique_entities,
      topEntities,
    });
  } catch (err) {
    return c.json({error: String(err)}, 500);
  }
});

// GET /admin/stats — index size, cache stats, and token usage summary
adminApp.get('/stats', requireAuth, async c => {
  const cacheStats = await getCacheStats();
  const cacheConfig = await getSemanticCacheConfig();
  const tokenSummary = await getTokenUsageSummary();
  const schemaDim = await getEmbeddingSchemaDimension();

  // Compute embedding progress from DB so it's accurate across pods
  let embeddingProgress = {total: 0, done: 0, pending: 0, active: false};
  try {
    const pool = getPool();
    const {rows: [{n: total}]} = await pool.query('SELECT COUNT(*)::int AS n FROM doc_chunks');
    const {rows: [{n: done}]} = await pool.query('SELECT COUNT(*)::int AS n FROM doc_chunks WHERE embedding IS NOT NULL');
    embeddingProgress = {total, done, pending: total - done, active: done < total};
  } catch { /* ignore */ }

  // Persistent build status (survives restarts / cross-pod)
  let buildStatus: import('./db.js').BuildStatus = {state: 'idle', total: 0, done: 0, failed: 0, startedAt: null, updatedAt: null};
  try {
    buildStatus = await getBuildStatus();
  } catch { /* ignore */ }

  return c.json({
    doc_chunks: await getIndexSize(),
    semantic_cache: {
      ...cacheStats,
      entries: await getCacheEntriesCount(),
      config: cacheConfig,
    },
    node_cache: {
      embedding: getEmbeddingCacheStats(),
      rag_search: getRagSearchCacheStats(),
      page_content: getPageContentCacheStats(),
    },
    token_usage: tokenSummary,
    embedding: embeddingProgress,
    dimensions: schemaDim,
    build: buildStatus,
  });
});

// GET /admin/api/metrics — structured Prometheus-style metrics for dashboard
adminApp.get('/api/metrics', requireAuth, async c => {
  return c.json(getMetricsData());
});

// GET /admin/api/build-events — SSE stream for live build progress
adminApp.get('/api/build-events', requireAuth, async c => {
  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache');
  c.header('Connection', 'keep-alive');

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) => {
        try {
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch { /* stream closed */ }
      };

      send({type: 'connected'});

      // Poll build status every 2 seconds and push updates
      const interval = setInterval(async () => {
        try {
          const status = await getBuildStatus();
          send({type: 'build', ...status});
        } catch {
          send({type: 'error', message: 'Failed to read build status'});
        }
      }, 2000);

      // Close after 5 minutes to prevent stale connections
      const timeout = setTimeout(() => {
        clearInterval(interval);
        try { controller.close(); } catch { /* ignore */ }
      }, 300_000);

      // Clean up on client disconnect
      c.req.raw.signal.addEventListener('abort', () => {
        clearInterval(interval);
        clearTimeout(timeout);
        try { controller.close(); } catch { /* ignore */ }
      });
    },
  });

  return c.body(stream);
});

// GET /admin/api/health — rich health data (formerly in public /health)
adminApp.get('/api/health', async c => {
  const now = Date.now();
  const index = await getIndexStatus();
  const dbOk = isDbReady();
  let cacheStats = {totalEntries: 0, totalHits: 0};
  let tokenSummary = {totalRequests: 0, totalInputTokens: 0, totalOutputTokens: 0, totalTokens: 0, totalCachedInputTokens: 0, cachedPercentage: 0};
  let gapsCount = 0;

  if (dbOk) {
    try {
      cacheStats = await getCacheStats();
      tokenSummary = await getTokenUsageSummary();
      gapsCount = await getDocGapsCount();
    } catch { /* db may be locked */ }
  }

  let resolvedChat: ResolvedModel | null = null;
  let resolvedEmbed: ResolvedModel | null = null;
  if (dbOk) {
    try { resolvedChat = await resolveModel('chat'); } catch { /* ignore */ }
    try { resolvedEmbed = await resolveModel('embedding'); } catch { /* ignore */ }
  }

  const llmReady = llmHealth.lastSuccessAt !== null &&
    (llmHealth.lastErrorAt === null || new Date(llmHealth.lastSuccessAt) > new Date(llmHealth.lastErrorAt));
  const indexAgeMs = index.lastRefreshed ? now - new Date(index.lastRefreshed).getTime() : null;

  return c.json({
    ok: dbOk && (index.ready || index.chunks === 0),
    startedAt,
    uptime: Math.round((now - new Date(startedAt).getTime()) / 1000),
    db: {ready: dbOk},
    llm: {
      ready: llmReady,
      provider: resolvedProviderDisplay(resolvedChat ?? { source: 'env', provider: 'openai-compatible', model: '' }),
      model: resolvedChat?.model || process.env.AI_MODEL || '',
      source: resolvedChat?.source || 'env',
      lastSuccessAt: llmHealth.lastSuccessAt,
      lastErrorAt: llmHealth.lastErrorAt,
      lastError: llmHealth.lastError,
      totalCalls: llmHealth.totalCalls,
      totalErrors: llmHealth.totalErrors,
    },
    embedding: {
      provider: resolvedProviderDisplay(resolvedEmbed ?? { source: 'env', provider: 'openai-compatible', model: '' }),
      model: resolvedEmbed?.model || process.env.SEMANTIC_EMBEDDING_MODEL || '',
      source: resolvedEmbed?.source || 'env',
      dimensions: resolvedEmbed?.dimensions || null,
    },
    index: {
      ...index,
      ageMs: indexAgeMs,
      ageHuman: indexAgeMs !== null ? `${Math.round(indexAgeMs / 60000)}m` : null,
    },
    sessions: getSessionCount(),
    cache: cacheStats,
    tokens: tokenSummary,
    gaps: gapsCount,
  });
});

// GET /admin/api/health/llm — live LLM connectivity check (makes a real API call)
adminApp.get('/api/health/llm', async c => {
  const t0 = Date.now();
  try {
    const resolved = await resolveModel('chat');
    const model = await createModelInstance(resolved);
    const {generateText} = await import('ai');
    await generateText({model, prompt: 'Say "ok"', maxRetries: bedrockAiSdkMaxRetries(resolved.provider), maxOutputTokens: 5, experimental_telemetry: makeTelemetry('admin-test-chat')});
    recordLlmSuccess();
    return c.json({
      ok: true,
      provider: resolvedProviderDisplay(resolved),
      model: resolved.model,
      source: resolved.source,
      latencyMs: Date.now() - t0,
    });
  } catch (err) {
    const resolved = await resolveModel('chat').catch(() => null);
    return c.json({
      ok: false,
      provider: resolved ? resolvedProviderDisplay(resolved) : (process.env.AI_BASE_URL || '').replace(/\/v\d+$/, '').replace(/^https?:\/\//, ''),
      model: resolved?.model || process.env.AI_MODEL || '',
      source: resolved?.source || 'env',
      latencyMs: Date.now() - t0,
      error: (err as Error).message,
    }, 502);
  }
});

// ---------------------------------------------------------------------------
// Dashboard API endpoints
// ---------------------------------------------------------------------------

// GET /admin/api/live — active sessions
adminApp.get('/api/live', async c => {
  const source = c.req.query('source') || undefined;
  return c.json({sessions: await getObsLiveSessions({ source })});
});

// GET /admin/api/performance — per-agent/model stats
adminApp.get('/api/performance', async c => {
  const source = c.req.query('source') || undefined;
  return c.json({agents: await getObsPerformance({ source })});
});

// GET /admin/api/feedback — recent feedback entries
adminApp.get('/api/feedback', async c => {
  const limit = parseInt(c.req.query('limit') || '50', 10);
  return c.json({entries: await getObsFeedback(limit)});
});

// GET /admin/api/feedback/stats — feedback statistics
adminApp.get('/api/feedback/stats', c => c.json(getStats()));

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

// GET /admin/api/session/:id/messages — get transcript messages for a session id
adminApp.get('/api/session/:id/messages', async c => {
  const sessionId = c.req.param('id');
  return c.json(await getObsSessionMessagesDetail(sessionId));
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
  const source = c.req.query('source') || undefined;
  return c.json(await getObsOverview({ source }));
});

// GET /admin/api/analytics/trends — per-day time series data
adminApp.get('/api/analytics/trends', async c => {
  const days = parseInt(c.req.query('days') || '7', 10);
  const source = c.req.query('source') || undefined;
  return c.json(await getObsTrends(days, { source }));
});

// GET /admin/api/analytics/recent-activity — recent message events
adminApp.get('/api/analytics/recent-activity', async c => {
  const limit = parseInt(c.req.query('limit') || '10', 10);
  const source = c.req.query('source') || undefined;
  return c.json({entries: await getObsRecentActivity(limit, { source })});
});

// GET /admin/api/analytics/users — user-aggregated session data
adminApp.get('/api/analytics/users', async c => {
  const page = parseInt(c.req.query('page') || '1', 10);
  const pageSize = parseInt(c.req.query('pageSize') || '20', 10);
  const country = c.req.query('country') || undefined;
  const agent = c.req.query('agent') || undefined;
  const source = c.req.query('source') || undefined;
  const includeAnonymous = c.req.query('includeAnonymous') === '1';
  const { users, total, totalSessions } = await getObsUsers({ page, pageSize, country, agent, source, includeAnonymous });
  return c.json({ users, total, totalSessions });
});

// GET /admin/api/analytics/token-trends — daily token aggregates
adminApp.get('/api/analytics/token-trends', async c => {
  const days = parseInt(c.req.query('days') || '7', 10);
  const source = c.req.query('source') || undefined;
  return c.json(await getTokenTrends(days, { source }));
});

// GET /admin/api/analytics/sources — distinct traffic sources for filter dropdown
adminApp.get('/api/analytics/sources', async c => {
  return c.json({ sources: await getObsSources() });
});

// ---------------------------------------------------------------------------
// Runtime configuration
// ---------------------------------------------------------------------------

// GET /admin/api/config — runtime configuration readout
adminApp.get('/api/config', async c => {
  const [dbConfig, cacheConfig, resolvedEntries] = await Promise.all([
    getRuntimeConfigAll(),
    Promise.resolve(getSemanticCacheConfig()),
    Promise.all(CONFIG_KEYS.map(async k => {
      try {
        const r = await resolveModel(k);
        return {key: k, source: r.source, provider: r.provider, model: r.model};
      } catch {
        return {key: k, source: 'env', provider: 'openai-compatible', model: ''};
      }
    })),
  ]);
  const {rows: [chunkCount]} = await getPool().query('SELECT COUNT(*)::int as count FROM doc_chunks');
  const {rows: [lastBuild]} = await getPool().query("SELECT value FROM metadata WHERE key = 'last_build'");
  const schemaDim = await getEmbeddingSchemaDimension();

  const rules = getRules();
  return c.json({
    models: dbConfig,
    resolved: resolvedEntries,
    cache: cacheConfig,
    index: {
      totalChunks: chunkCount?.count || 0,
      lastBuild: lastBuild?.value || null,
      refreshInterval: process.env.INDEX_REFRESH_INTERVAL || '1800000',
      sourceUrl: process.env.DOCS_SITE_URL || 'https://docs.zilliz.com',
      dimensions: schemaDim,
    },
    hooks: {
      count: rules.length,
      rules: rules.map(r => ({name: r.name, enabled: r.enabled, priority: r.priority})),
    },
  });
});

// PUT /admin/api/config/:key — update provider/model/profile for a config key
adminApp.put('/api/config/:key', requireAuth, requireAdmin, async c => {
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
  const rawProfile = body.profileName ? String(body.profileName) : null;
  // 'env default' is a synthetic profile — store as null in DB so resolution falls back to env.
  const profileName = rawProfile === 'env default' ? null : rawProfile;
  const rawDimensions = body.dimensions;
  const dimensions = rawDimensions !== undefined && rawDimensions !== null && rawDimensions !== ''
    ? Number(rawDimensions)
    : undefined;

  await setRuntimeConfigValue(key, provider, model, profileName, dimensions);
  return c.json({ok: true, key, provider, model, profileName, dimensions});
});

adminApp.delete('/api/config/:key', requireAuth, requireAdmin, async c => {
  const key = c.req.param('key');
  await deleteRuntimeConfigValue(key);
  return c.json({ok: true});
});

// POST /admin/api/config/:key/test — validate a provider+model works
adminApp.post('/api/config/:key/test', async c => {
  const key = c.req.param('key');
  const resolved = await resolveModel(key);
  try {
    const instance = await createModelInstance(resolved);
    const {generateText} = await import('ai');
    await generateText({model: instance, prompt: 'Say "ok"', maxRetries: bedrockAiSdkMaxRetries(resolved.provider), maxOutputTokens: 5, experimental_telemetry: makeTelemetry('admin-test-model')});
    return c.json({ok: true, provider: resolvedProviderDisplay(resolved), model: resolved.model, source: resolved.source});
  } catch (err) {
    return c.json({ok: false, provider: resolvedProviderDisplay(resolved), model: resolved.model, source: resolved.source, error: String(err)}, 400);
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
    `SELECT id, query_text, agent, section_filter, confidence, created_at, hits, jsonb_array_length(sse_events) as event_size
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
  const source = c.req.query('source') || undefined;
  return c.json({byModel: await getObsTokenUsage({ source })});
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

// ---------------------------------------------------------------------------
// Admin user management
// ---------------------------------------------------------------------------

adminApp.get('/api/admins', requireAuth, async c => {
  return c.json({admins: await listAdmins()});
});

adminApp.post('/api/admins', requireAuth, requireAdmin, async c => {
  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({error: 'Invalid JSON body'}, 400);
  }
  const openId = String(body.open_id || '');
  const name = String(body.name || '');
  if (!openId || !name) {
    return c.json({error: 'open_id and name are required'}, 400);
  }
  const auth = getAuth(c)!;
  const addedBy = auth.user?.open_id || 'apikey';
  const admin = await addAdmin({
    open_id: openId,
    name,
    email: body.email ? String(body.email) : null,
    added_by: addedBy,
  });
  return c.json({ok: true, admin});
});

adminApp.delete('/api/admins/:open_id', requireAuth, requireAdmin, async c => {
  const openId = c.req.param('open_id');
  const removed = await removeAdmin(openId);
  return c.json({ok: true, removed});
});

// ---------------------------------------------------------------------------
// Provider profiles
// ---------------------------------------------------------------------------

// Synthetic profile name representing env-var fallback. Reserved — cannot be
// created/edited/deleted; treated specially by list-models and PUT /api/config/:key.
const ENV_DEFAULT_NAME = 'env default';

function buildEnvDefaultDisplay() {
  return {
    name: ENV_DEFAULT_NAME,
    provider_type: 'openai-compatible',
    base_url: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
    region: null as string | null,
    credentials: {} as Record<string, string>,
    notes: 'Falls back to env vars (AI_BASE_URL, AI_API_KEY)',
    is_env: true,
    created_at: '',
    updated_at: '',
  };
}

function buildEnvDefaultProfileFull() {
  return {
    name: ENV_DEFAULT_NAME,
    provider_type: 'openai-compatible',
    base_url: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
    region: null as string | null,
    credentials: {api_key: process.env.AI_API_KEY || ''},
    notes: null as string | null,
    created_at: '',
    updated_at: '',
  };
}

adminApp.get('/api/provider-profiles', requireAuth, async c => {
  const profiles = await listProviderProfiles();
  return c.json([buildEnvDefaultDisplay(), ...profiles]);
});

adminApp.post('/api/provider-profiles', requireAuth, requireAdmin, async c => {
  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({error: 'Invalid JSON body'}, 400);
  }
  const name = String(body.name || '').trim();
  if (!name) return c.json({error: 'name is required'}, 400);
  if (name === ENV_DEFAULT_NAME) {
    return c.json({error: '"env default" is a reserved profile name'}, 400);
  }

  const credentials: Record<string, string> = {};
  if (typeof body.credentials === 'object' && body.credentials !== null) {
    for (const [k, v] of Object.entries(body.credentials)) {
      if (typeof v === 'string') credentials[k] = v;
    }
  }

  await upsertProviderProfile({
    name,
    provider_type: String(body.provider_type || 'openai-compatible'),
    base_url: body.base_url ? String(body.base_url) : null,
    region: body.region ? String(body.region) : null,
    credentials,
    notes: body.notes ? String(body.notes) : null,
  });
  const profile = await getProviderProfile(name);
  return c.json({ok: true, profile});
});

adminApp.put('/api/provider-profiles/:name', requireAuth, requireAdmin, async c => {
  const name = c.req.param('name');
  if (name === ENV_DEFAULT_NAME) {
    return c.json({error: '"env default" is a reserved profile and cannot be edited'}, 400);
  }
  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({error: 'Invalid JSON body'}, 400);
  }

  const credentials: Record<string, string> = {};
  if (typeof body.credentials === 'object' && body.credentials !== null) {
    for (const [k, v] of Object.entries(body.credentials)) {
      if (typeof v === 'string') credentials[k] = v;
    }
  }

  await upsertProviderProfile({
    name,
    provider_type: String(body.provider_type || 'openai-compatible'),
    base_url: body.base_url ? String(body.base_url) : null,
    region: body.region ? String(body.region) : null,
    credentials,
    notes: body.notes ? String(body.notes) : null,
  });
  const profile = await getProviderProfile(name);
  return c.json({ok: true, profile});
});

adminApp.delete('/api/provider-profiles/:name', requireAuth, requireAdmin, async c => {
  const name = c.req.param('name');
  if (name === ENV_DEFAULT_NAME) {
    return c.json({error: '"env default" is a reserved profile and cannot be removed'}, 400);
  }
  await deleteProviderProfile(name);
  return c.json({ok: true});
});

// POST /admin/api/provider-profiles/:name/list-models — list available models
// from the profile's provider (also serves as a credential test: HTTP 200 = good).
// Special case: name === ENV_DEFAULT_NAME builds a synthetic profile from env vars.
adminApp.post('/api/provider-profiles/:name/list-models', requireAuth, requireAdmin, async c => {
  const name = c.req.param('name');
  const type = c.req.query('type') as 'chat' | 'embedding' | undefined;
  const profile = name === ENV_DEFAULT_NAME
    ? buildEnvDefaultProfileFull()
    : await getProviderProfile(name);
  if (!profile) return c.json({ok: false, error: 'Profile not found'}, 404);
  if (name === ENV_DEFAULT_NAME && !profile.credentials.api_key) {
    return c.json({ok: false, provider: profile.provider_type, error: 'AI_API_KEY env var is not set'}, 400);
  }
  try {
    const models = await listModelsForProfile(profile, type);
    return c.json({ok: true, provider: profile.provider_type, models});
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return c.json({ok: false, provider: profile.provider_type, error: msg}, 400);
  }
});

// ---------------------------------------------------------------------------
// OAuth profiles
// ---------------------------------------------------------------------------

adminApp.get('/api/oauth-profiles', requireAuth, async c => {
  return c.json(await listOAuthProfiles());
});

adminApp.post('/api/oauth-profiles', requireAuth, requireAdmin, async c => {
  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({error: 'Invalid JSON body'}, 400);
  }
  const name = String(body.name || '').trim();
  if (!name) return c.json({error: 'name is required'}, 400);

  const oauthCreds = typeof body.credentials === 'object' && body.credentials !== null
    ? { app_secret: String((body.credentials as Record<string, unknown>).app_secret || '') }
    : { app_secret: '' };

  await upsertOAuthProfile({
    name,
    provider_type: String(body.provider_type || 'feishu'),
    host: body.host ? String(body.host) : null,
    redirect_uri: body.redirect_uri ? String(body.redirect_uri) : null,
    app_id: String(body.app_id || ''),
    credentials: oauthCreds,
    notes: body.notes ? String(body.notes) : null,
    is_active: typeof body.is_active === 'boolean' ? body.is_active : false,
  });
  return c.json({ok: true});
});

adminApp.put('/api/oauth-profiles/:name', requireAuth, requireAdmin, async c => {
  const name = c.req.param('name');
  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({error: 'Invalid JSON body'}, 400);
  }

  const oauthCreds = typeof body.credentials === 'object' && body.credentials !== null
    ? { app_secret: String((body.credentials as Record<string, unknown>).app_secret || '') }
    : { app_secret: '' };

  await upsertOAuthProfile({
    name,
    provider_type: String(body.provider_type || 'feishu'),
    host: body.host ? String(body.host) : null,
    redirect_uri: body.redirect_uri ? String(body.redirect_uri) : null,
    app_id: String(body.app_id || ''),
    credentials: oauthCreds,
    notes: body.notes ? String(body.notes) : null,
    is_active: typeof body.is_active === 'boolean' ? body.is_active : false,
  });
  return c.json({ok: true});
});

adminApp.post('/api/oauth-profiles/:name/activate', requireAuth, requireAdmin, async c => {
  const name = c.req.param('name');
  await setOAuthProfileActive(name);
  const active = await getActiveOAuthProfile('feishu');
  return c.json({ok: true, active});
});

adminApp.delete('/api/oauth-profiles/:name', requireAuth, requireAdmin, async c => {
  const name = c.req.param('name');
  await deleteOAuthProfile(name);
  return c.json({ok: true});
});
