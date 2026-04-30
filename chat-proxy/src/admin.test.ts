import {describe, it, expect, vi, beforeEach} from 'vitest';

function createDbMock(overrides: Record<string, unknown> = {}) {
  return {
    getPool: () => ({query: vi.fn().mockResolvedValue({rows: []})}),
    isDbReady: () => true,
    getTokenUsageByModel: vi.fn().mockResolvedValue([]),
    getTokenUsageSummary: vi.fn().mockResolvedValue([]),
    getTokenUsageCount: vi.fn().mockResolvedValue(0),
    getRecentTokenUsage: vi.fn().mockResolvedValue([]),
    getDocGaps: vi.fn().mockResolvedValue([]),
    resolveDocGap: vi.fn().mockResolvedValue(undefined),
    getDocGapsCount: vi.fn().mockResolvedValue(0),
    getContentQuality: vi.fn().mockResolvedValue([]),
    getObsOverview: vi.fn().mockResolvedValue({}),
    getObsTrends: vi.fn().mockResolvedValue({conversations: [], messages: [], users: [], confidence: []}),
    getObsRecentActivity: vi.fn().mockResolvedValue([]),
    getObsLiveSessions: vi.fn().mockResolvedValue([]),
    getObsPerformance: vi.fn().mockResolvedValue([]),
    getObsFeedback: vi.fn().mockResolvedValue([]),
    getObsErrors: vi.fn().mockResolvedValue([]),
    getObsLowConfidence: vi.fn().mockResolvedValue([]),
    listObsSessions: vi.fn().mockResolvedValue([]),
    getObsSessionDetail: vi.fn().mockResolvedValue(null),
    getObsTokenUsage: vi.fn().mockResolvedValue([]),
    getObsUsers: vi.fn().mockResolvedValue({users: [], total: 0}),
    getTokenTrends: vi.fn().mockResolvedValue([]),
    getRuntimeConfigAll: vi.fn().mockResolvedValue([]),
    setRuntimeConfigValue: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('adminApp', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doUnmock('hono/cookie');
  });

  it('returns 401 when Authorization header is missing', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/live');
    expect(res.status).toBe(401);
    process.env.ADMIN_API_KEY = '';
  });

  it('returns 401 when token is wrong', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/live', {
      headers: {Authorization: 'Bearer wrong-key'},
    });
    expect(res.status).toBe(401);
    process.env.ADMIN_API_KEY = '';
  });

  it('returns 503 when ADMIN_API_KEY is not set', async () => {
    process.env.ADMIN_API_KEY = '';
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/live', {
      headers: {Authorization: 'Bearer anything'},
    });
    expect(res.status).toBe(503);
  });

  it('GET /api/live returns sessions array', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';

    vi.doMock('./rag.js', () => ({
      loadIndex: vi.fn().mockResolvedValue(undefined),
      getIndexSize: () => 42,
    }));
    vi.doMock('./db.js', () => ({
      getObsLiveSessions: vi.fn().mockResolvedValue([]),
    }));

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/live', {
      headers: {Authorization: 'Bearer secret-key'},
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.sessions).toBeInstanceOf(Array);
    process.env.ADMIN_API_KEY = '';
  });

  it('GET /api/analytics/users returns users array', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    vi.doMock('./db.js', () => ({
      getObsUsers: vi.fn().mockResolvedValue({users: [], total: 0}),
    }));
    vi.doMock('./rag.js', () => ({
      loadIndex: vi.fn(),
      getIndexSize: () => 42,
    }));
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/analytics/users', {
      headers: {Authorization: 'Bearer secret-key'},
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
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/config/chat', {
      method: 'PUT',
      headers: {Authorization: 'Bearer secret-key', 'Content-Type': 'application/json'},
      body: JSON.stringify({provider: 'bedrock', model: 'claude-3'}),
    });
    expect(res.status).toBe(200);
    process.env.ADMIN_API_KEY = '';
  });

  it('GET /auth/config returns feishu_enabled false when OAuth not configured', async () => {
    delete process.env.FEISHU_APP_ID;
    delete process.env.FEISHU_APP_SECRET;
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/auth/config');
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.feishu_enabled).toBe(false);
  });

  it('GET /auth/config returns feishu_enabled true when OAuth configured', async () => {
    process.env.FEISHU_APP_ID = 'cli_xxx';
    process.env.FEISHU_APP_SECRET = 'secret';
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/auth/config');
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.feishu_enabled).toBe(true);
    delete process.env.FEISHU_APP_ID;
    delete process.env.FEISHU_APP_SECRET;
  });

  it('GET /auth/feishu returns 503 when OAuth not configured', async () => {
    delete process.env.FEISHU_APP_ID;
    delete process.env.FEISHU_APP_SECRET;
    delete process.env.FEISHU_OAUTH_REDIRECT_URI;
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/auth/feishu');
    expect(res.status).toBe(503);
  });

  it('GET /auth/me returns 401 without credentials', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/auth/me');
    expect(res.status).toBe(401);
    process.env.ADMIN_API_KEY = '';
  });

  it('GET /auth/me returns admin role with valid API key', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/auth/me', {
      headers: {Authorization: 'Bearer secret-key'},
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.role).toBe('admin');
    expect(body.authMethod).toBe('apikey');
    process.env.ADMIN_API_KEY = '';
  });

  it('POST /auth/logout returns ok', async () => {
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/auth/logout', {method: 'POST'});
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.ok).toBe(true);
  });

  it('GET /api/admins returns 401 without auth', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    delete process.env.FEISHU_APP_ID;
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/admins');
    expect(res.status).toBe(401);
    process.env.ADMIN_API_KEY = '';
  });

  it('GET /api/admins returns admins list with API key', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    vi.doMock('./db.js', () => createDbMock());
    vi.doMock('./auth/admin-users.js', () => ({
      listAdmins: vi.fn().mockResolvedValue([
        {open_id: 'ou_1', name: 'Alice', email: 'a@example.com', added_at: '2026-01-01', added_by: 'bootstrap'},
      ]),
      addAdmin: vi.fn(),
      removeAdmin: vi.fn(),
      healAdminProfile: vi.fn(),
      isAdminOpenId: vi.fn().mockResolvedValue(true),
    }));
    vi.doMock('./rag.js', () => ({
      loadIndex: vi.fn(),
      getIndexSize: () => 42,
    }));
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/admins', {
      headers: {Authorization: 'Bearer secret-key'},
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.admins).toBeInstanceOf(Array);
    expect(body.admins[0].name).toBe('Alice');
    process.env.ADMIN_API_KEY = '';
  });

  it('POST /api/admins returns 403 for non-admin role', async () => {
    process.env.ADMIN_API_KEY = '';
    process.env.ADMIN_SESSION_SECRET = 'session-secret';
    process.env.FEISHU_APP_ID = 'cli_xxx';
    process.env.FEISHU_APP_SECRET = 'secret';

    const {signSession} = await import('./auth/session.js');
    const token = signSession({
      open_id: 'ou_viewer',
      name: 'Viewer',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    }, 'session-secret');

    // Mock hono/cookie so getSignedCookie returns our raw token (bypassing Hono's signing layer)
    vi.doMock('hono/cookie', () => ({
      getSignedCookie: vi.fn().mockResolvedValue(token),
      setSignedCookie: vi.fn(),
      deleteCookie: vi.fn(),
    }));

    vi.doMock('./db.js', () => createDbMock());
    vi.doMock('./auth/admin-users.js', () => ({
      listAdmins: vi.fn(),
      addAdmin: vi.fn(),
      removeAdmin: vi.fn(),
      healAdminProfile: vi.fn(),
      isAdminOpenId: vi.fn().mockResolvedValue(false),
    }));
    vi.doMock('./rag.js', () => ({
      loadIndex: vi.fn(),
      getIndexSize: () => 42,
    }));

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/admins', {
      method: 'POST',
      headers: {
        Cookie: `__admin_session=${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({open_id: 'ou_new', name: 'New'}),
    });
    expect(res.status).toBe(403);

    delete process.env.ADMIN_SESSION_SECRET;
    delete process.env.FEISHU_APP_ID;
    delete process.env.FEISHU_APP_SECRET;
  });

  it('GET /api/provider-profiles returns env default first, then DB profiles', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    vi.doMock('./db.js', () => createDbMock({
      listProviderProfiles: vi.fn().mockResolvedValue([
        {name: 'openai', provider_type: 'openai-compatible', base_url: 'https://api.openai.com/v1', region: null, credentials: {api_key: '***'}, notes: null, created_at: '2026-01-01', updated_at: '2026-01-01'},
      ]),
    }));
    vi.doMock('./rag.js', () => ({loadIndex: vi.fn(), getIndexSize: () => 42}));
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/provider-profiles', {
      headers: {Authorization: 'Bearer secret-key'},
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body).toBeInstanceOf(Array);
    expect(body[0].name).toBe('env default');
    expect(body[0].is_env).toBe(true);
    expect(body[1].name).toBe('openai');
    process.env.ADMIN_API_KEY = '';
  });

  it('POST /api/provider-profiles creates a profile', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    vi.doMock('./db.js', () => createDbMock({
      upsertProviderProfile: vi.fn().mockResolvedValue(undefined),
      getProviderProfile: vi.fn().mockResolvedValue({name: 'bedrock', provider_type: 'bedrock', region: 'us-east-1', base_url: null, credentials: {access_key_id: '***'}, notes: 'test', created_at: '2026-01-01', updated_at: '2026-01-01'}),
    }));
    vi.doMock('./rag.js', () => ({loadIndex: vi.fn(), getIndexSize: () => 42}));
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/provider-profiles', {
      method: 'POST',
      headers: {Authorization: 'Bearer secret-key', 'Content-Type': 'application/json'},
      body: JSON.stringify({name: 'bedrock', provider_type: 'bedrock', region: 'us-east-1', credentials: {access_key_id: 'AKIA'}, notes: 'test'}),
    });
    expect(res.status).toBe(200);
    process.env.ADMIN_API_KEY = '';
  });

  it('DELETE /api/provider-profiles/:name removes a profile', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    vi.doMock('./db.js', () => createDbMock({
      deleteProviderProfile: vi.fn().mockResolvedValue(undefined),
    }));
    vi.doMock('./rag.js', () => ({loadIndex: vi.fn(), getIndexSize: () => 42}));
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/provider-profiles/old', {
      method: 'DELETE',
      headers: {Authorization: 'Bearer secret-key'},
    });
    expect(res.status).toBe(200);
    process.env.ADMIN_API_KEY = '';
  });

  it('GET /api/oauth-profiles returns profiles array', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    vi.doMock('./db.js', () => createDbMock({
      listOAuthProfiles: vi.fn().mockResolvedValue([
        {name: 'feishu-prod', provider_type: 'feishu', is_active: true, host: 'https://open.feishu.cn', redirect_uri: 'https://example.com/callback', app_id: 'cli_xxx', credentials: {app_secret: '***'}, notes: null, created_at: '2026-01-01', updated_at: '2026-01-01'},
      ]),
    }));
    vi.doMock('./rag.js', () => ({loadIndex: vi.fn(), getIndexSize: () => 42}));
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/oauth-profiles', {
      headers: {Authorization: 'Bearer secret-key'},
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body).toBeInstanceOf(Array);
    expect(body[0].name).toBe('feishu-prod');
    process.env.ADMIN_API_KEY = '';
  });

  it('POST /api/oauth-profiles/:name/activate sets active profile', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    vi.doMock('./db.js', () => createDbMock({
      setOAuthProfileActive: vi.fn().mockResolvedValue(undefined),
      getActiveOAuthProfile: vi.fn().mockResolvedValue({name: 'feishu-prod', provider_type: 'feishu', is_active: true, host: 'https://open.feishu.cn', redirect_uri: 'https://example.com/callback', app_id: 'cli_xxx', credentials: {app_secret: '***'}, notes: null, created_at: '2026-01-01', updated_at: '2026-01-01'}),
    }));
    vi.doMock('./rag.js', () => ({loadIndex: vi.fn(), getIndexSize: () => 42}));
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/oauth-profiles/feishu-prod/activate', {
      method: 'POST',
      headers: {Authorization: 'Bearer secret-key'},
    });
    expect(res.status).toBe(200);
    process.env.ADMIN_API_KEY = '';
  });

  it('PUT /api/config/:key stores profileName', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    vi.doMock('./db.js', () => createDbMock({
      setRuntimeConfigValue: vi.fn().mockResolvedValue(undefined),
    }));
    vi.doMock('./rag.js', () => ({loadIndex: vi.fn(), getIndexSize: () => 42}));
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/config/chat', {
      method: 'PUT',
      headers: {Authorization: 'Bearer secret-key', 'Content-Type': 'application/json'},
      body: JSON.stringify({provider: 'bedrock', model: 'claude-3', profileName: 'my-provider'}),
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.profileName).toBe('my-provider');
    process.env.ADMIN_API_KEY = '';
  });

  it('GET /api/health reports resolved model config, not env vars', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    process.env.AI_BASE_URL = 'https://openrouter.ai/api/v1';
    process.env.AI_MODEL = 'anthropic/claude-sonnet-4.6';

    vi.doMock('./db.js', () => createDbMock());
    vi.doMock('./rag.js', () => ({
      loadIndex: vi.fn(),
      getIndexSize: () => 42,
      getIndexStatus: vi.fn().mockResolvedValue({ready: true, chunks: 100, lastRefreshed: new Date().toISOString()}),
      getEmbeddingProgress: vi.fn().mockReturnValue({}),
    }));
    vi.doMock('./runtime-config.js', () => ({
      resolveModel: vi.fn().mockResolvedValue({
        source: 'profile',
        provider: 'openai-compatible',
        model: 'deepseek-v4-pro',
        baseURL: 'https://api.deepseek.com/v1',
        apiKey: 'sk-test',
      }),
      createModelInstance: vi.fn(),
      CONFIG_KEYS: ['chat', 'router', 'grounding', 'rewrite', 'embedding'],
    }));

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/health', {
      headers: {Authorization: 'Bearer secret-key'},
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.llm.model).toBe('deepseek-v4-pro');
    expect(body.llm.provider).toBe('api.deepseek.com');
    expect(body.llm.source).toBe('profile');
    process.env.ADMIN_API_KEY = '';
  });

  it('GET /api/health/llm tests the resolved chat model', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';

    vi.doMock('./db.js', () => createDbMock());
    vi.doMock('./rag.js', () => ({loadIndex: vi.fn(), getIndexSize: () => 42}));
    const mockGenerateText = vi.fn().mockResolvedValue(undefined);
    vi.doMock('ai', () => ({
      generateText: mockGenerateText,
      streamText: vi.fn(),
    }));
    vi.doMock('./runtime-config.js', () => ({
      resolveModel: vi.fn().mockResolvedValue({
        source: 'profile',
        provider: 'openai-compatible',
        model: 'deepseek-v4-pro',
        baseURL: 'https://api.deepseek.com/v1',
        apiKey: 'sk-test',
      }),
      createModelInstance: vi.fn().mockReturnValue('mock-model-instance'),
      CONFIG_KEYS: ['chat', 'router', 'grounding', 'rewrite', 'embedding'],
    }));

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/health/llm', {
      headers: {Authorization: 'Bearer secret-key'},
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.ok).toBe(true);
    expect(body.model).toBe('deepseek-v4-pro');
    expect(body.source).toBe('profile');
    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({model: 'mock-model-instance', prompt: 'Say "ok"', maxOutputTokens: 5}),
    );
    process.env.ADMIN_API_KEY = '';
  });

  it('POST /api/config/:key/test uses resolved model with profile credentials', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';

    vi.doMock('./db.js', () => createDbMock());
    vi.doMock('./rag.js', () => ({loadIndex: vi.fn(), getIndexSize: () => 42}));
    const mockGenerateText = vi.fn().mockResolvedValue(undefined);
    vi.doMock('ai', () => ({
      generateText: mockGenerateText,
      streamText: vi.fn(),
    }));
    vi.doMock('./runtime-config.js', () => ({
      resolveModel: vi.fn().mockResolvedValue({
        source: 'profile',
        provider: 'openai-compatible',
        model: 'gpt-4o',
        baseURL: 'https://api.openai.com/v1',
        apiKey: 'sk-test',
      }),
      createModelInstance: vi.fn().mockReturnValue('mock-model-instance'),
      CONFIG_KEYS: ['chat', 'router', 'grounding', 'rewrite', 'embedding'],
    }));

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/config/chat/test', {
      method: 'POST',
      headers: {Authorization: 'Bearer secret-key'},
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.ok).toBe(true);
    expect(body.model).toBe('gpt-4o');
    expect(body.source).toBe('profile');
    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({model: 'mock-model-instance'}),
    );
    process.env.ADMIN_API_KEY = '';
  });

  it('GET /admin/stats requires authentication', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    process.env.ADMIN_SESSION_SECRET = 'session-secret';
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/stats');
    expect(res.status).toBe(401);
    process.env.ADMIN_API_KEY = '';
    delete process.env.ADMIN_SESSION_SECRET;
  });

  it('GET /admin/dashboard requires authentication', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    process.env.ADMIN_SESSION_SECRET = 'session-secret';
    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/dashboard');
    expect(res.status).toBe(401);
    process.env.ADMIN_API_KEY = '';
    delete process.env.ADMIN_SESSION_SECRET;
  });
});
