// Integration tests for admin endpoints against the live chat-proxy running in
// the local Kubernetes cluster (OrbStack). These exercise the real Hono app +
// PostgreSQL and verify the dashboard-redesign endpoints end-to-end.
//
// Configuration:
//   CHAT_PROXY_URL  Base URL of the chat-proxy service.
//                   Default: http://chat-proxy.zdocs-local.svc.cluster.local:8787
//                   (resolvable from host via OrbStack DNS.)
//   ADMIN_API_KEY   Bearer token for /admin/api/* endpoints.
//                   Default: the local-dev secret value.
//
// The suite probes /health at module load and skips itself if the cluster is
// unreachable, so this file is safe to run in environments without a cluster.

import {describe, it, expect, vi} from 'vitest';

// setup.ts installs vi.useFakeTimers globally to keep module-level setInterval
// timers from leaking. Real fetch + AbortSignal.timeout below need real timers.
vi.useRealTimers();

const BASE_URL = process.env.CHAT_PROXY_URL ?? 'http://chat-proxy.zdocs-local.svc.cluster.local:8787';
const ADMIN_KEY = process.env.ADMIN_API_KEY || 'b92b9c5b9d2f48d9b93966867ffc3f15929dd19fe554b3e95c3faad133385082';

async function probe(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`, {signal: AbortSignal.timeout(3000)});
    return res.ok;
  } catch {
    return false;
  }
}

const reachable = await probe();
if (!reachable) {
  console.warn(`[k8s integration] chat-proxy not reachable at ${BASE_URL} — admin.k8s.test.ts will be skipped`);
}

function authed(path: string, init: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
    Authorization: `Bearer ${ADMIN_KEY}`,
  };
  return fetch(`${BASE_URL}${path}`, {...init, headers});
}

describe.skipIf(!reachable)('admin endpoints (k8s integration)', () => {
  it('GET /admin/api/analytics/trends returns separate conversations and messages arrays', async () => {
    const res = await authed('/admin/api/analytics/trends?days=7');
    expect(res.status).toBe(200);
    const body = await res.json() as {
      conversations: {date: string; value: number}[];
      messages: {date: string; value: number}[];
      users: {date: string; value: number}[];
      confidence: {date: string; value: number}[];
    };
    expect(body.conversations).toBeInstanceOf(Array);
    expect(body.messages).toBeInstanceOf(Array);
    expect(body.users).toBeInstanceOf(Array);
    expect(body.confidence).toBeInstanceOf(Array);
    expect(body.conversations.length).toBe(7);
    expect(body.messages.length).toBe(7);
    expect(body.conversations).not.toBe(body.messages);
    for (const entry of body.conversations) {
      expect(entry).toHaveProperty('date');
      expect(typeof entry.value).toBe('number');
    }
    for (const entry of body.messages) {
      expect(entry).toHaveProperty('date');
      expect(typeof entry.value).toBe('number');
    }
  });

  it('GET /admin/api/analytics/token-trends returns daily token aggregates', async () => {
    const res = await authed('/admin/api/analytics/token-trends?days=7');
    expect(res.status).toBe(200);
    const body = await res.json() as {
      date: string;
      inputTokens: number;
      outputTokens: number;
      cachedTokens: number;
    }[];
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(7);
    for (const entry of body) {
      expect(entry).toHaveProperty('date');
      expect(typeof entry.inputTokens).toBe('number');
      expect(typeof entry.outputTokens).toBe('number');
      expect(typeof entry.cachedTokens).toBe('number');
    }
  });

  it('GET /admin/api/analytics/users returns paginated user aggregation', async () => {
    const res = await authed('/admin/api/analytics/users?page=1&pageSize=20');
    expect(res.status).toBe(200);
    const body = await res.json() as {
      users: {
        userId: string;
        sessionCount: number;
        firstActive: string;
        lastActive: string;
        avgDurationSeconds: number;
        userMeta: Record<string, unknown> | null;
        sessions: {firstQuestion: string | null; agent: string | null; messageCount: number; createdAt: string}[];
        topics: string[];
      }[];
      total: number;
    };
    expect(Array.isArray(body.users)).toBe(true);
    expect(typeof body.total).toBe('number');
    for (const u of body.users) {
      expect(typeof u.userId).toBe('string');
      expect(u.userId).not.toBe('anonymous');
      expect(typeof u.sessionCount).toBe('number');
      expect(Array.isArray(u.sessions)).toBe(true);
      expect(Array.isArray(u.topics)).toBe(true);
    }
  });

  it('GET /admin/api/config returns models, cache, and index info', async () => {
    const res = await authed('/admin/api/config');
    expect(res.status).toBe(200);
    const body = await res.json() as {
      models: {key: string; provider: string; model: string; updatedAt: string}[];
      cache: Record<string, unknown>;
      index: {totalChunks: number; lastBuild: string | null; refreshInterval: string; sourceUrl: string};
    };
    expect(Array.isArray(body.models)).toBe(true);
    expect(body.cache).toBeTypeOf('object');
    expect(typeof body.index.totalChunks).toBe('number');
    expect(typeof body.index.refreshInterval).toBe('string');
    expect(typeof body.index.sourceUrl).toBe('string');
  });

  it('PUT /admin/api/config/:key persists provider and model', async () => {
    const key = `_test:${Date.now()}`;
    const putRes = await authed(`/admin/api/config/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({provider: 'openai-compatible', model: 'integration-test-model'}),
    });
    expect(putRes.status).toBe(200);
    const putBody = await putRes.json() as {ok: boolean; key: string; provider: string; model: string};
    expect(putBody.ok).toBe(true);
    expect(putBody.key).toBe(key);
    expect(putBody.model).toBe('integration-test-model');

    // Verify it's readable via /api/config
    const cfgRes = await authed('/admin/api/config');
    const cfg = await cfgRes.json() as {models: {key: string; model: string}[]};
    const stored = cfg.models.find(m => m.key === key);
    expect(stored).toBeDefined();
    expect(stored?.model).toBe('integration-test-model');
  });

  it('PUT /admin/api/config/:key rejects empty model', async () => {
    const res = await authed('/admin/api/config/chat', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({provider: 'openai-compatible'}),
    });
    expect(res.status).toBe(400);
  });

  it('rejects requests without Authorization header', async () => {
    const res = await fetch(`${BASE_URL}/admin/api/live`);
    expect(res.status).toBe(401);
  });

  it('rejects requests with wrong API key', async () => {
    const res = await fetch(`${BASE_URL}/admin/api/live`, {
      headers: {Authorization: 'Bearer not-the-real-key'},
    });
    expect(res.status).toBe(401);
  });
});
