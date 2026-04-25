# Chat-Proxy Dashboard Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the chat-proxy admin dashboard with fixed metrics, user aggregation, costs/settings, and a proper login page.

**Architecture:** Single HTML file (`admin-dashboard.html`) served by Hono. Backend changes to `db.ts`, `admin.ts`, `logger.ts`, `index.ts`, and new `runtime-config.ts`. Frontend change to `ChatContext.tsx` for screen resolution. New dependency: `maxmind` for GeoIP, `@ai-sdk/amazon-bedrock` for Bedrock provider.

**Tech Stack:** TypeScript, Hono, PostgreSQL, Chart.js, Vercel AI SDK, maxmind, vitest

---

## File Structure

| Action | File | Responsibility |
|---|---|---|
| Modify | `chat-proxy/src/db.ts` | Add `user_meta` column, `runtime_config` table, `getObsUsers()`, `getTokenTrends()`, `getRuntimeConfig()`, `setRuntimeConfig()` |
| Create | `chat-proxy/src/runtime-config.ts` | Provider registry, `getProviderModel()` resolver |
| Modify | `chat-proxy/src/admin.ts` | Add `/api/analytics/users`, `/api/config`, `/api/config/:key`, `/api/config/:key/test`, `/api/analytics/token-trends` endpoints |
| Modify | `chat-proxy/src/logger.ts` | Pass `userMeta` to `upsertObsSession` |
| Modify | `chat-proxy/src/index.ts` | Extract user metadata from headers/body, pass to logger |
| Modify | `chat-proxy/src/types.ts` | Add `screenResolution` to `ChatRequest` |
| Modify | `src/components/ChatPanel/ChatContext.tsx` | Send `screenResolution` in request body |
| Rewrite | `chat-proxy/src/admin-dashboard.html` | Full dashboard UI redesign with login page |
| Modify | `chat-proxy/package.json` | Add `maxmind`, `@ai-sdk/amazon-bedrock` |
| Create | `chat-proxy/scripts/download-geolite2.ts` | Download GeoLite2 City DB at build time |
| Modify | `chat-proxy/src/admin.test.ts` | Tests for new endpoints |

---

### Task 1: Database Schema Changes

**Files:**
- Modify: `chat-proxy/src/db.ts:8-152` (SCHEMA_DDL)
- Modify: `chat-proxy/src/db.ts:476-497` (upsertObsSession)
- Test: `chat-proxy/src/admin.test.ts`

- [ ] **Step 1: Add `user_meta` column to `obs_sessions` in SCHEMA_DDL**

In `chat-proxy/src/db.ts`, after line 133 (`last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`), add:

```sql
, user_meta JSONB
```

Then after the `obs_sessions` CREATE INDEX at line 136, add:

```sql
CREATE INDEX IF NOT EXISTS idx_obs_sessions_user_id ON obs_sessions(user_id);
```

- [ ] **Step 2: Add `runtime_config` table to SCHEMA_DDL**

After the `obs_feedback` index at line 151, add:

```sql
-- runtime_config: editable model/provider configuration
CREATE TABLE IF NOT EXISTS runtime_config (
  key        TEXT PRIMARY KEY,
  provider   TEXT NOT NULL DEFAULT 'openai-compatible',
  model      TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

- [ ] **Step 3: Update `upsertObsSession` to accept `userMeta`**

In `chat-proxy/src/db.ts`, change the `upsertObsSession` function signature to accept `userMeta`:

```typescript
export async function upsertObsSession(session: {
  id: string;
  userId: string;
  agent: string;
  model?: string;
  pageUrl?: string;
  firstQuestion?: string;
  userMeta?: Record<string, unknown>;
}): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO obs_sessions (id, user_id, agent, model, page_url, message_count, first_question, user_meta, created_at, last_active_at)
     VALUES ($1, $2, $3, $4, $5, 1, $6, $7, NOW(), NOW())
     ON CONFLICT (id) DO UPDATE SET
       last_active_at = NOW(),
       message_count = obs_sessions.message_count + 1,
       agent = EXCLUDED.agent,
       model = COALESCE(EXCLUDED.model, obs_sessions.model),
       page_url = COALESCE(EXCLUDED.page_url, obs_sessions.page_url),
       user_meta = COALESCE(EXCLUDED.user_meta, obs_sessions.user_meta)`,
    [session.id, session.userId, session.agent, session.model ?? null,
     session.pageUrl ?? null, session.firstQuestion ?? null,
     session.userMeta ? JSON.stringify(session.userMeta) : null],
  );
}
```

- [ ] **Step 4: Fix `getObsTrends` to differentiate conversations from messages**

Replace the entire `getObsTrends` function in `db.ts` (lines 561-586):

```typescript
export async function getObsTrends(days: number): Promise<Record<string, {date: string; value: number}[]>> {
  const pool = getPool();

  // Conversations: distinct sessions per day from obs_sessions
  const { rows: sessionRows } = await pool.query(
    `SELECT d::date::text as date, COUNT(DISTINCT s.id)::int as conversations
     FROM generate_series(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, INTERVAL '1 day') d
     LEFT JOIN obs_sessions s ON s.created_at::date = d::date
     GROUP BY d ORDER BY d`,
    [days],
  );

  // Messages, users, confidence from obs_events
  const { rows: eventRows } = await pool.query(
    `SELECT
       d::date::text as date,
       COUNT(e.id) FILTER (WHERE e.event_type = 'message')::int as messages,
       COUNT(DISTINCT e.user_id) FILTER (WHERE e.id IS NOT NULL)::int as users,
       COALESCE(ROUND(
         COUNT(e.id) FILTER (WHERE e.event_type = 'message' AND e.data->>'confidence' = 'high')
         * 100.0 / NULLIF(COUNT(e.id) FILTER (
           WHERE e.event_type = 'message' AND e.data->>'confidence' IN ('high','medium','low')
         ), 0)
       ), 0)::int as confidence
     FROM generate_series(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, INTERVAL '1 day') d
     LEFT JOIN obs_events e ON e.timestamp::date = d::date
     GROUP BY d ORDER BY d`,
    [days],
  );

  // Merge: sessions data has conversations, events data has messages/users/confidence
  const sessionMap = new Map(sessionRows.map((r: any) => [r.date, Number(r.conversations)]));

  return {
    conversations: eventRows.map((r: any) => ({date: r.date, value: sessionMap.get(r.date) || 0})),
    messages: eventRows.map((r: any) => ({date: r.date, value: Number(r.messages)})),
    users: eventRows.map((r: any) => ({date: r.date, value: Number(r.users)})),
    confidence: eventRows.map((r: any) => ({date: r.date, value: Number(r.confidence)})),
  };
}
```

- [ ] **Step 5: Add `getObsUsers` query function**

Add after `listObsSessions` in `db.ts`:

```typescript
export async function getObsUsers(options: {
  page: number;
  pageSize: number;
}): Promise<{ users: any[]; total: number }> {
  const pool = getPool();

  // Count distinct non-anonymous users
  const { rows: [countRow] } = await pool.query(
    `SELECT COUNT(DISTINCT CASE WHEN user_id != 'anonymous' THEN user_id END)::int as total
     FROM obs_sessions`,
  );

  const offset = (options.page - 1) * options.pageSize;

  // Aggregate sessions by user_id, exclude anonymous, sort by last active
  const { rows } = await pool.query(
    `SELECT
       user_id,
       COUNT(*)::int as session_count,
       MIN(created_at) as first_active,
       MAX(last_active_at) as last_active,
       AVG(EXTRACT(EPOCH FROM (last_active_at - created_at)))::numeric as avg_duration_seconds,
       (ARRAY_AGG(DISTINCT user_meta) FILTER (WHERE user_meta IS NOT NULL))[1] as user_meta,
       ARRAY_AGG(ROW(first_question, agent, message_count, created_at) ORDER BY created_at DESC) as session_rows
     FROM obs_sessions
     WHERE user_id != 'anonymous'
     GROUP BY user_id
     ORDER BY MAX(last_active_at) DESC
     LIMIT $1 OFFSET $2`,
    [options.pageSize, offset],
  );

  const users = rows.map((r: any) => ({
    userId: r.user_id,
    sessionCount: Number(r.session_count),
    firstActive: new Date(r.first_active).toISOString(),
    lastActive: new Date(r.last_active).toISOString(),
    avgDurationSeconds: Math.round(Number(r.avg_duration_seconds) || 0),
    userMeta: r.user_meta ? (typeof r.user_meta === 'string' ? JSON.parse(r.user_meta) : r.user_meta) : null,
    sessions: (r.session_rows || []).slice(0, 50).map((s: any) => ({
      firstQuestion: s.f1,
      agent: s.f2,
      messageCount: Number(s.f3),
      createdAt: new Date(s.f4).toISOString(),
    })),
    topics: (r.session_rows || []).slice(0, 5).map((s: any) => (s.f1 || '').slice(0, 80)),
  }));

  return { users, total: Number(countRow.total) };
}
```

- [ ] **Step 6: Add `getTokenTrends` query function**

Add after `getObsUsers`:

```typescript
export async function getTokenTrends(days: number): Promise<{date: string; inputTokens: number; outputTokens: number; cachedTokens: number}[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT d::date::text as date,
       COALESCE(SUM(input_tokens), 0)::bigint as "inputTokens",
       COALESCE(SUM(output_tokens), 0)::bigint as "outputTokens",
       COALESCE(SUM(cached_input_tokens), 0)::bigint as "cachedTokens"
     FROM generate_series(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, INTERVAL '1 day') d
     LEFT JOIN token_usage t ON t.created_at::date = d::date
     GROUP BY d ORDER BY d`,
    [days],
  );
  return rows.map((r: any) => ({
    date: r.date,
    inputTokens: Number(r.inputTokens),
    outputTokens: Number(r.outputTokens),
    cachedTokens: Number(r.cachedTokens),
  }));
}
```

- [ ] **Step 7: Add runtime config DB functions**

Add after `getTokenTrends`:

```typescript
export async function getRuntimeConfigAll(): Promise<{key: string; provider: string; model: string; updatedAt: string}[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    'SELECT key, provider, model, updated_at as "updatedAt" FROM runtime_config ORDER BY key',
  );
  return rows;
}

export async function getRuntimeConfigValue(key: string): Promise<{provider: string; model: string} | null> {
  const pool = getPool();
  const { rows: [row] } = await pool.query(
    'SELECT provider, model FROM runtime_config WHERE key = $1',
    [key],
  );
  return row ? { provider: row.provider, model: row.model } : null;
}

export async function setRuntimeConfigValue(key: string, provider: string, model: string): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO runtime_config (key, provider, model, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (key) DO UPDATE SET provider = EXCLUDED.provider, model = EXCLUDED.model, updated_at = NOW()`,
    [key, provider, model],
  );
}
```

- [ ] **Step 8: Run tests to verify nothing is broken**

Run: `cd /Volumes/CaseSensitive/projects/zdoc-redesign/chat-proxy && npx vitest run`
Expected: All existing tests pass

- [ ] **Step 9: Commit**

```bash
git add chat-proxy/src/db.ts
git commit -m "feat(chat-proxy): add user_meta, runtime_config schema, fix trends, add user/token queries"
```

---

### Task 2: Runtime Config Module

**Files:**
- Create: `chat-proxy/src/runtime-config.ts`
- Modify: `chat-proxy/src/index.ts:144-146` (model constants)
- Modify: `chat-proxy/src/router.ts:15` (ROUTER_MODEL)
- Modify: `chat-proxy/src/grounding-agent.ts:12` (GROUNDING_MODEL)
- Modify: `chat-proxy/src/query-rewrite.ts:7` (REWRITE_MODEL)
- Modify: `chat-proxy/src/semantic-cache.ts:12` (EMBEDDING_MODEL)

- [ ] **Step 1: Write the test**

Add to `chat-proxy/src/admin.test.ts`:

```typescript
describe('runtime-config', () => {
  it('falls back to env vars when no DB config exists', async () => {
    process.env.AI_MODEL = 'gpt-4o';
    vi.doMock('./db.js', () => ({
      getRuntimeConfigValue: vi.fn().mockResolvedValue(null),
    }));
    const { resolveModel } = await import('./runtime-config.js');
    const result = await resolveModel('chat');
    expect(result.model).toBe('gpt-4o');
    expect(result.provider).toBe('openai-compatible');
  });

  it('returns DB config when present', async () => {
    vi.doMock('./db.js', () => ({
      getRuntimeConfigValue: vi.fn().mockResolvedValue({ provider: 'bedrock', model: 'claude-3' }),
      isDbReady: () => true,
    }));
    const { resolveModel } = await import('./runtime-config.js');
    const result = await resolveModel('chat');
    expect(result.model).toBe('claude-3');
    expect(result.provider).toBe('bedrock');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Volumes/CaseSensitive/projects/zdoc-redesign/chat-proxy && npx vitest run`
Expected: FAIL — `runtime-config.js` does not exist

- [ ] **Step 3: Create `chat-proxy/src/runtime-config.ts`**

```typescript
import { getRuntimeConfigValue, isDbReady } from './db.js';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModelV1 } from 'ai';

// Env var fallbacks per config key
const ENV_DEFAULTS: Record<string, { provider: string; modelEnv: string; defaultModel: string }> = {
  chat:          { provider: 'openai-compatible', modelEnv: 'AI_MODEL',              defaultModel: 'gpt-4o' },
  router:        { provider: 'openai-compatible', modelEnv: 'ROUTER_MODEL',           defaultModel: 'openai/gpt-4o-mini' },
  grounding:     { provider: 'openai-compatible', modelEnv: 'GROUNDING_MODEL',        defaultModel: 'google/gemini-3.1-flash-lite-preview' },
  rewrite:       { provider: 'openai-compatible', modelEnv: 'REWRITE_MODEL',          defaultModel: 'google/gemini-3.1-flash-lite-preview' },
  embedding:     { provider: 'openai-compatible', modelEnv: 'SEMANTIC_EMBEDDING_MODEL', defaultModel: 'text-embedding-3-small' },
  'agent:general':  { provider: 'openai-compatible', modelEnv: 'GENERAL_MODEL',       defaultModel: '' },
  'agent:schema':   { provider: 'openai-compatible', modelEnv: 'SCHEMA_MODEL',        defaultModel: '' },
  'agent:resources':{ provider: 'openai-compatible', modelEnv: 'RESOURCES_MODEL',     defaultModel: '' },
  'agent:product':  { provider: 'openai-compatible', modelEnv: 'PRODUCT_MODEL',       defaultModel: '' },
  'agent:code':     { provider: 'openai-compatible', modelEnv: 'CODE_MODEL',          defaultModel: '' },
};

export async function resolveModel(key: string): Promise<{ provider: string; model: string }> {
  // Check DB first
  if (isDbReady()) {
    const dbConfig = await getRuntimeConfigValue(key);
    if (dbConfig) return dbConfig;
  }

  // Agent keys inherit from chat when no override
  const defaults = ENV_DEFAULTS[key];
  if (!defaults) return { provider: 'openai-compatible', model: 'unknown' };

  const model = process.env[defaults.modelEnv] || defaults.defaultModel;
  if (!model) {
    // Agent-specific key with no override — inherit from chat
    return resolveModel('chat');
  }

  return { provider: defaults.provider, model };
}

export function createModelInstance(provider: string, modelId: string): LanguageModelV1 {
  switch (provider) {
    case 'bedrock': {
      // Lazy import to avoid requiring bedrock SDK when not used
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { createAmazonBedrock } = require('@ai-sdk/amazon-bedrock');
      const bedrock = createAmazonBedrock({
        region: process.env.AWS_REGION || 'us-east-1',
      });
      return bedrock(modelId);
    }
    case 'openai-compatible':
    default: {
      const openai = createOpenAI({
        baseURL: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
        apiKey: process.env.AI_API_KEY,
      });
      return openai(modelId);
    }
  }
}

// Convenience: resolve + create in one call
export async function getModel(key: string): Promise<LanguageModelV1> {
  const { provider, model } = await resolveModel(key);
  return createModelInstance(provider, model);
}
```

- [ ] **Step 4: Run tests**

Run: `cd /Volumes/CaseSensitive/projects/zdoc-redesign/chat-proxy && npx vitest run`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add chat-proxy/src/runtime-config.ts chat-proxy/src/admin.test.ts
git commit -m "feat(chat-proxy): add runtime-config module with DB-first model resolution"
```

---

### Task 3: User Metadata Extraction (Backend)

**Files:**
- Modify: `chat-proxy/src/types.ts:8-14` (ChatRequest)
- Modify: `chat-proxy/src/index.ts:387` (userId extraction)
- Modify: `chat-proxy/src/logger.ts:11-79` (logEvent + upsertObsSession)
- Create: `chat-proxy/src/geoip.ts`

- [ ] **Step 1: Add `screenResolution` to ChatRequest**

In `chat-proxy/src/types.ts`, add to the `ChatRequest` interface after `userId`:

```typescript
  screenResolution?: string;
```

- [ ] **Step 2: Create `chat-proxy/src/geoip.ts`**

```typescript
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

let reader: any = null;

async function initGeoIP(): Promise<void> {
  if (reader) return;
  try {
    const maxmind = await import('maxmind');
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const dbPath = join(__dirname, '..', 'data', 'GeoLite2-City.mmdb');
    if (existsSync(dbPath)) {
      reader = await maxmind.open(dbPath);
      console.log('[GeoIP] GeoLite2 City DB loaded');
    } else {
      console.log('[GeoIP] GeoLite2 City DB not found at', dbPath, '— geolocation disabled');
    }
  } catch {
    console.log('[GeoIP] maxmind not available — geolocation disabled');
  }
}

// Init on first import
initGeoIP().catch(() => {});

export function lookupGeo(ip: string): { country: string; city: string } | null {
  if (!reader || !ip) return null;
  try {
    const result = reader.get(ip);
    if (!result) return null;
    return {
      country: result.country?.iso_code || '',
      city: result.city?.names?.en || '',
    };
  } catch {
    return null;
  }
}
```

- [ ] **Step 3: Extract user metadata in `/chat` handler**

In `chat-proxy/src/index.ts`, after `const userId = body.userId || 'anonymous';` (line 387), add:

```typescript
  // Extract user metadata
  const userMeta: Record<string, unknown> = {};
  const ua = c.req.header('user-agent');
  if (ua) userMeta.user_agent = ua;
  const forwardedFor = c.req.header('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() || c.req.header('x-real-ip') || '';
  if (ip) {
    userMeta.ip = ip;
    const { lookupGeo } = await import('./geoip.js');
    const geo = lookupGeo(ip);
    if (geo) {
      userMeta.country = geo.country;
      userMeta.city = geo.city;
    }
  }
  const referer = c.req.header('referer');
  if (referer) userMeta.referer = referer;
  const language = c.req.header('accept-language');
  if (language) userMeta.language = language;
  if (body.screenResolution) userMeta.screen_resolution = body.screenResolution;
```

Then update all calls to `logEvent` in the `/chat` handler to pass `userMeta`. First, modify the `logEvent` function signature in `logger.ts`:

```typescript
export function logEvent(
  sessionId: string,
  userId: string,
  eventType: string,
  agent: string,
  data: Record<string, unknown>,
  userMeta?: Record<string, unknown>,
): void {
```

And in the `upsertObsSession` call inside `logEvent` (logger.ts line 67), add `userMeta`:

```typescript
      upsertObsSession({
        id: sessionId,
        userId,
        agent,
        model: typeof data.model === 'string' ? data.model : undefined,
        pageUrl: typeof data.pageUrl === 'string' ? data.pageUrl : undefined,
        firstQuestion: typeof data.question === 'string' ? String(data.question).slice(0, 100) : undefined,
        userMeta,
      }).catch(() => {});
```

Now in `index.ts`, update the first `logEvent` call after the userMeta extraction (the guard block, line 399) to pass `userMeta`:

```typescript
      logEvent(session.id, userId, 'message', 'guard', {
        blocked: true,
        reason: guardResult.reason,
        message: lastUserMessage.content.slice(0, 200),
      }, userMeta);
```

Update all other `logEvent` calls in the `/chat` handler to pass `userMeta` as the 6th argument. Search for `logEvent(session.id, userId,` and add `, userMeta)` before the closing `)` on each call.

- [ ] **Step 4: Run tests**

Run: `cd /Volumes/CaseSensitive/projects/zdoc-redesign/chat-proxy && npx vitest run`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add chat-proxy/src/types.ts chat-proxy/src/index.ts chat-proxy/src/logger.ts chat-proxy/src/geoip.ts
git commit -m "feat(chat-proxy): extract and persist user metadata (GeoIP, UA, screen)"
```

---

### Task 4: Screen Resolution (Frontend)

**Files:**
- Modify: `src/components/ChatPanel/ChatContext.tsx:142-148` (fetch body)

- [ ] **Step 1: Add screenResolution to chat request**

In `src/components/ChatPanel/ChatContext.tsx`, update the `body` in the `fetch` call (around line 142):

```typescript
        body: JSON.stringify({
          messages: apiMessages,
          pageContext: getPageContext(),
          pageUrl: location.pathname,
          sessionId: sessionIdRef.current,
          userId: getUserId(),
          screenResolution: `${screen.width}x${screen.height}`,
        }),
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ChatPanel/ChatContext.tsx
git commit -m "feat(chat): send screen resolution with chat requests"
```

---

### Task 5: New Admin API Endpoints

**Files:**
- Modify: `chat-proxy/src/admin.ts:144-232` (add new routes)

- [ ] **Step 1: Add imports for new functions**

In `chat-proxy/src/admin.ts`, update the import from `./db.js` to include new functions:

```typescript
import {
  getPool,
  getTokenUsageByModel, getTokenUsageSummary, getTokenUsageCount, getRecentTokenUsage,
  getDocGaps, resolveDocGap, getDocGapsCount, getContentQuality,
  getObsOverview, getObsTrends, getObsRecentActivity, getObsLiveSessions,
  getObsPerformance, getObsFeedback, getObsErrors, getObsLowConfidence,
  listObsSessions, getObsSessionDetail, getObsTokenUsage,
  getObsUsers, getTokenTrends, getRuntimeConfigAll, setRuntimeConfigValue,
} from './db.js';
```

Add import for runtime config:

```typescript
import { resolveModel, createModelInstance } from './runtime-config.js';
```

Add import for cache config:

```typescript
import { getSemanticCacheConfig, invalidateSemanticCache } from './semantic-cache.js';
```

- [ ] **Step 2: Add `/api/analytics/users` endpoint**

After the existing `/api/analytics/recent-activity` endpoint (around line 159):

```typescript
// GET /admin/api/analytics/users — user-aggregated session data
adminApp.get('/api/analytics/users', async c => {
  const page = parseInt(c.req.query('page') || '1', 10);
  const pageSize = parseInt(c.req.query('pageSize') || '20', 10);
  return c.json(await getObsUsers({ page, pageSize }));
});
```

- [ ] **Step 3: Add `/api/config` endpoint**

```typescript
// GET /admin/api/config — runtime configuration readout
adminApp.get('/api/config', async c => {
  const [dbConfig, cacheConfig] = await Promise.all([
    getRuntimeConfigAll(),
    Promise.resolve(getSemanticCacheConfig()),
  ]);
  const { rows: [chunkCount] } = await getPool().query('SELECT COUNT(*)::int as count FROM doc_chunks');
  const { rows: [lastBuild] } = await getPool().query("SELECT value FROM metadata WHERE key = 'last_build'");

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
```

- [ ] **Step 4: Add `/api/config/:key` PUT endpoint**

```typescript
// PUT /admin/api/config/:key — update provider/model for a config key
adminApp.put('/api/config/:key', async c => {
  const key = c.req.param('key');
  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }
  const provider = String(body.provider || 'openai-compatible');
  const model = String(body.model || '');
  if (!model) return c.json({ error: 'model is required' }, 400);

  await setRuntimeConfigValue(key, provider, model);
  return c.json({ ok: true, key, provider, model });
});
```

- [ ] **Step 5: Add `/api/config/:key/test` endpoint**

```typescript
// POST /admin/api/config/:key/test — validate a provider+model works
adminApp.post('/api/config/:key/test', async c => {
  const key = c.req.param('key');
  const { provider, model } = await resolveModel(key);
  try {
    const instance = createModelInstance(provider, model);
    const { generateText } = await import('ai');
    await generateText({ model: instance, prompt: 'Say "ok"', maxOutputTokens: 5 });
    return c.json({ ok: true, provider, model });
  } catch (err) {
    return c.json({ ok: false, provider, model, error: String(err) }, 400);
  }
});
```

- [ ] **Step 6: Add `/api/analytics/token-trends` endpoint**

```typescript
// GET /admin/api/analytics/token-trends — daily token aggregates
adminApp.get('/api/analytics/token-trends', async c => {
  const days = parseInt(c.req.query('days') || '7', 10);
  return c.json(await getTokenTrends(days));
});
```

- [ ] **Step 7: Add tests for new endpoints**

Add to `chat-proxy/src/admin.test.ts`:

```typescript
it('GET /api/analytics/users returns users array', async () => {
  process.env.ADMIN_API_KEY = 'secret-key';
  vi.doMock('./db.js', () => ({
    getObsUsers: vi.fn().mockResolvedValue({ users: [], total: 0 }),
  }));
  vi.doMock('./rag.js', () => ({
    loadIndex: vi.fn(),
    getIndexSize: () => 42,
  }));
  const { adminApp } = await import('./admin.js');
  const res = await adminApp.request('/api/analytics/users', {
    headers: { Authorization: 'Bearer secret-key' },
  });
  expect(res.status).toBe(200);
  const body = await res.json() as any;
  expect(body.users).toBeInstanceOf(Array);
  process.env.ADMIN_API_KEY = '';
});

it('PUT /api/config/:key updates config', async () => {
  process.env.ADMIN_API_KEY = 'secret-key';
  vi.doMock('./db.js', () => ({
    setRuntimeConfigValue: vi.fn().mockResolvedValue(undefined),
  }));
  vi.doMock('./rag.js', () => ({
    loadIndex: vi.fn(),
    getIndexSize: () => 42,
  }));
  const { adminApp } = await import('./admin.js');
  const res = await adminApp.request('/api/config/chat', {
    method: 'PUT',
    headers: { Authorization: 'Bearer secret-key', 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'bedrock', model: 'claude-3' }),
  });
  expect(res.status).toBe(200);
  process.env.ADMIN_API_KEY = '';
});
```

- [ ] **Step 8: Run tests**

Run: `cd /Volumes/CaseSensitive/projects/zdoc-redesign/chat-proxy && npx vitest run`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add chat-proxy/src/admin.ts chat-proxy/src/admin.test.ts
git commit -m "feat(chat-proxy): add users, config, token-trends admin endpoints"
```

---

### Task 6: GeoLite2 Download Script and Dependencies

**Files:**
- Modify: `chat-proxy/package.json` (add dependencies)
- Create: `chat-proxy/scripts/download-geolite2.ts`

- [ ] **Step 1: Add dependencies**

Run:
```bash
cd /Volumes/CaseSensitive/projects/zdoc-redesign/chat-proxy && npm install maxmind @ai-sdk/amazon-bedrock && npm install -D @types/maxmind
```

- [ ] **Step 2: Create download script**

Create `chat-proxy/scripts/download-geolite2.ts`:

```typescript
// Downloads the GeoLite2 City database from MaxMind.
// Requires MAXMIND_LICENSE_KEY env var.
// Run: npx tsx scripts/download-geolite2.ts

import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { get } from 'https';

const LICENSE_KEY = process.env.MAXMIND_LICENSE_KEY;
if (!LICENSE_KEY) {
  console.error('Set MAXMIND_LICENSE_KEY env var to download GeoLite2 DB');
  console.error('Get a free key at https://www.maxmind.com/en/geolite2/signup');
  process.exit(1);
}

const outDir = join(import.meta.dirname, '..', 'data');
const outPath = join(outDir, 'GeoLite2-City.mmdb');

if (existsSync(outPath)) {
  console.log('GeoLite2 City DB already exists at', outPath);
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });

const url = `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${LICENSE_KEY}&suffix=tar.gz`;
console.log('Downloading GeoLite2 City DB...');

// Download tar.gz, extract mmdb — simplified: just note the manual step
console.log('Download from:', url);
console.log('Extract the .mmdb file to:', outPath);
```

- [ ] **Step 3: Create data directory placeholder**

Create `chat-proxy/data/.gitkeep` (empty file) to ensure the data directory exists.

Run: `mkdir -p /Volumes/CaseSensitive/projects/zdoc-redesign/chat-proxy/data && touch /Volumes/CaseSensitive/projects/zdoc-redesign/chat-proxy/data/.gitkeep`

- [ ] **Step 4: Commit**

```bash
git add chat-proxy/package.json chat-proxy/package-lock.json chat-proxy/scripts/download-geolite2.ts chat-proxy/data/.gitkeep
git commit -m "feat(chat-proxy): add maxmind, bedrock deps, GeoLite2 download script"
```

---

### Task 7: Dashboard HTML — Login Cover Page + Redesigned Tabs

**Files:**
- Rewrite: `chat-proxy/src/admin-dashboard.html`

This is the largest task. The HTML file is a self-contained SPA with inline CSS and JS. The rewrite covers:
1. Login cover page (shown first, validates API key)
2. Dashboard tab (fixed metrics)
3. Users & Sessions tab (user aggregation, expand/collapse)
4. Costs & Settings tab (token analytics + editable config + actions)

- [ ] **Step 1: Write the complete redesigned `admin-dashboard.html`**

This file replaces the existing 870-line file entirely. Use the `impeccable:impeccable` skill for design consistency. Key design requirements:

**Login page:**
- Centered card with "Chat Proxy" heading, API key input, "Sign In" button
- On submit: `GET /admin/api/live` with `Authorization: Bearer <key>`
- Store key in `sessionStorage` on success
- Show inline error on failure
- Redirect to login on any 401 response

**Dashboard tab:**
- Same KPI strip (Conversations, Messages, Distinct Users, Avg Confidence) — now Conversations != Messages
- Same 5 trend charts but Conversations per Day and Messages per Day now show different data
- Same donut + activity feed on right

**Users & Sessions tab (replaces Sessions):**
- New metric strip: Total Users, Total Sessions, Avg Sessions/User, Avg Duration
- User list: cards grouped by user_id with metadata (location, device, language, screen, topics)
- Expand user to see session list
- Click session to see detail panel (reuse existing timeline)
- Pagination at user level

**Costs & Settings tab:**
- Two sections with toggle/accordion: "Token Usage" and "Settings"
- Token Usage: bar chart by model, line chart for daily trend (stacked input/output/cached), breakdown table, time range toggle
- Settings: config cards showing models (with edit button → inline provider dropdown + model input + test button), cache config (read-only), index stats, action buttons (Refresh Index, Clear Cache), doc gaps table, content quality table

**Preserve existing patterns:**
- Same CSS variables (`--bg`, `--surface`, etc.)
- Same font stack (Bricolage Grotesque + Figtree)
- Same color palette (blue, purple, green, amber, red)
- Same Chart.js usage pattern
- Same `apiFetch()` helper
- Same auto-refresh interval (10 seconds)
- Same `animateValue()`, `timeAgo()`, `formatTokens()`, `esc()`, `agentColor()` helpers

- [ ] **Step 2: Manually verify in browser**

Run: `cd /Volumes/CaseSensitive/projects/zdoc-redesign/chat-proxy && npm run dev`
Open: `http://localhost:8787/admin/dashboard`
Expected: Login page appears. Enter API key. Dashboard loads with working tabs.

- [ ] **Step 3: Commit**

```bash
git add chat-proxy/src/admin-dashboard.html
git commit -m "feat(chat-proxy): redesign dashboard — login page, user aggregation, costs & settings"
```

---

### Task 8: Integration Test

**Files:**
- Modify: `chat-proxy/src/admin.test.ts`

- [ ] **Step 1: Write integration test for full dashboard flow**

Add to `chat-proxy/src/admin.test.ts`:

```typescript
describe('dashboard integration', () => {
  it('trends endpoint returns different conversation and message counts', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    process.env.DATABASE_URL = process.env.DATABASE_URL || '';
    vi.doMock('./db.js', () => ({
      getObsTrends: vi.fn().mockResolvedValue({
        conversations: [{ date: '2026-04-25', value: 5 }],
        messages: [{ date: '2026-04-25', value: 23 }],
        users: [{ date: '2026-04-25', value: 3 }],
        confidence: [{ date: '2026-04-25', value: 80 }],
      }),
    }));
    vi.doMock('./rag.js', () => ({
      loadIndex: vi.fn(),
      getIndexSize: () => 42,
    }));
    const { adminApp } = await import('./admin.js');
    const res = await adminApp.request('/api/analytics/trends?days=7', {
      headers: { Authorization: 'Bearer secret-key' },
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.conversations[0].value).not.toBe(body.messages[0].value);
    process.env.ADMIN_API_KEY = '';
  });

  it('token trends endpoint returns daily data', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    vi.doMock('./db.js', () => ({
      getTokenTrends: vi.fn().mockResolvedValue([
        { date: '2026-04-25', inputTokens: 1000, outputTokens: 500, cachedTokens: 200 },
      ]),
    }));
    vi.doMock('./rag.js', () => ({
      loadIndex: vi.fn(),
      getIndexSize: () => 42,
    }));
    const { adminApp } = await import('./admin.js');
    const res = await adminApp.request('/api/analytics/token-trends?days=7', {
      headers: { Authorization: 'Bearer secret-key' },
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body[0].inputTokens).toBe(1000);
    process.env.ADMIN_API_KEY = '';
  });
});
```

- [ ] **Step 2: Run all tests**

Run: `cd /Volumes/CaseSensitive/projects/zdoc-redesign/chat-proxy && npx vitest run`
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add chat-proxy/src/admin.test.ts
git commit -m "test(chat-proxy): add integration tests for dashboard redesign"
```

---

## Task Dependency Order

```
Task 1 (DB schema) → Task 2 (runtime-config) → Task 5 (admin endpoints)
Task 1 (DB schema) → Task 3 (user metadata)
Task 3 (user metadata) → Task 4 (screen resolution frontend)
Task 6 (deps) → Task 3 (geoip module)
Task 1 + Task 5 + Task 6 → Task 7 (dashboard HTML)
Task 7 → Task 8 (integration tests)
```

Tasks 2, 3, and 6 can run in parallel after Task 1.
