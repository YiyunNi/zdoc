import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';

describe('session', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.ADMIN_SESSION_SECRET;
    delete process.env.FEISHU_APP_ID;
    delete process.env.FEISHU_APP_SECRET;
  });

  it('getSessionSecret returns env var', async () => {
    process.env.ADMIN_SESSION_SECRET = 'my-secret';
    const {getSessionSecret} = await import('./session.js');
    expect(getSessionSecret()).toBe('my-secret');
  });

  it('getSessionSecret returns empty string when unset', async () => {
    const {getSessionSecret} = await import('./session.js');
    expect(getSessionSecret()).toBe('');
  });

  it('isOAuthEnabled returns true when both env vars are set', async () => {
    process.env.FEISHU_APP_ID = 'app-id';
    process.env.FEISHU_APP_SECRET = 'app-secret';
    const {isOAuthEnabled} = await import('./session.js');
    expect(isOAuthEnabled()).toBe(true);
  });

  it('isOAuthEnabled returns false when env vars are missing', async () => {
    const {isOAuthEnabled} = await import('./session.js');
    expect(isOAuthEnabled()).toBe(false);
  });

  it('signSession and verifySession round-trip', async () => {
    const {signSession, verifySession} = await import('./session.js');
    const payload = {
      open_id: 'ou_123',
      name: 'Alice',
      email: 'alice@example.com',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    const token = signSession(payload, 'secret');
    const verified = verifySession(token, 'secret');
    expect(verified).not.toBeNull();
    expect(verified!.open_id).toBe('ou_123');
    expect(verified!.name).toBe('Alice');
    expect(verified!.email).toBe('alice@example.com');
  });

  it('verifySession rejects tampered token', async () => {
    const {signSession, verifySession} = await import('./session.js');
    const payload = {
      open_id: 'ou_123',
      name: 'Alice',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    const token = signSession(payload, 'secret');
    const tampered = token.slice(0, -4) + 'xxxx';
    expect(verifySession(tampered, 'secret')).toBeNull();
  });

  it('verifySession rejects wrong secret', async () => {
    const {signSession, verifySession} = await import('./session.js');
    const payload = {
      open_id: 'ou_123',
      name: 'Alice',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    const token = signSession(payload, 'secret-a');
    expect(verifySession(token, 'secret-b')).toBeNull();
  });

  it('verifySession rejects expired token', async () => {
    const {signSession, verifySession} = await import('./session.js');
    const payload = {
      open_id: 'ou_123',
      name: 'Alice',
      iat: Math.floor(Date.now() / 1000) - 7200,
      exp: Math.floor(Date.now() / 1000) - 3600,
    };
    const token = signSession(payload, 'secret');
    expect(verifySession(token, 'secret')).toBeNull();
  });

  it('verifySession rejects malformed token', async () => {
    const {verifySession} = await import('./session.js');
    expect(verifySession('not-a-token', 'secret')).toBeNull();
    expect(verifySession('only.one.part', 'secret')).toBeNull();
    expect(verifySession('a.b.c', 'secret')).toBeNull();
  });

  it('verifySession accepts token within 60s clock skew grace', async () => {
    const {signSession, verifySession} = await import('./session.js');
    const payload = {
      open_id: 'ou_123',
      name: 'Alice',
      iat: Math.floor(Date.now() / 1000) - 10,
      exp: Math.floor(Date.now() / 1000) - 30, // 30s past expiry, within 60s grace
    };
    const token = signSession(payload, 'secret');
    expect(verifySession(token, 'secret')).not.toBeNull();
  });

  it('generateOAuthState returns 32-character hex', async () => {
    const {generateOAuthState} = await import('./session.js');
    const state = generateOAuthState();
    expect(state).toMatch(/^[a-f0-9]{32}$/);
  });

  it('constantTimeCompare handles length mismatch without short-circuit', async () => {
    const {constantTimeCompare} = await import('./middleware.js');

    // Different lengths should still return false without throwing
    expect(constantTimeCompare('short', 'muchlongersecret')).toBe(false);
    expect(constantTimeCompare('muchlongersecret', 'short')).toBe(false);

    // Same length mismatch should also return false
    expect(constantTimeCompare('wrong', 'muchlongersecret')).toBe(false);

    // Exact match should return true
    expect(constantTimeCompare('exact', 'exact')).toBe(true);
  });
});

describe('feishu', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.FEISHU_APP_ID;
    delete process.env.FEISHU_APP_SECRET;
    delete process.env.FEISHU_HOST;
    delete process.env.FEISHU_OAUTH_REDIRECT_URI;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getFeishuConfig returns null when env vars missing', async () => {
    const {getFeishuConfig} = await import('./feishu.js');
    expect(getFeishuConfig()).toBeNull();
  });

  it('getFeishuConfig returns config with defaults', async () => {
    process.env.FEISHU_APP_ID = 'cli_xxx';
    process.env.FEISHU_APP_SECRET = 'secret';
    const {getFeishuConfig} = await import('./feishu.js');
    const cfg = getFeishuConfig();
    expect(cfg).not.toBeNull();
    expect(cfg!.appId).toBe('cli_xxx');
    expect(cfg!.appSecret).toBe('secret');
    expect(cfg!.host).toBe('https://open.feishu.cn');
    expect(cfg!.redirectUri).toBe('');
  });

  it('getFeishuConfig uses custom host and redirect URI', async () => {
    process.env.FEISHU_APP_ID = 'cli_xxx';
    process.env.FEISHU_APP_SECRET = 'secret';
    process.env.FEISHU_HOST = 'https://open.larksuite.com';
    process.env.FEISHU_OAUTH_REDIRECT_URI = 'https://example.com/callback';
    const {getFeishuConfig} = await import('./feishu.js');
    const cfg = getFeishuConfig();
    expect(cfg!.host).toBe('https://open.larksuite.com');
    expect(cfg!.redirectUri).toBe('https://example.com/callback');
  });

  it('buildAuthorizeUrl constructs correct URL', async () => {
    const {buildAuthorizeUrl} = await import('./feishu.js');
    const cfg = {
      appId: 'cli_xxx',
      appSecret: 'secret',
      host: 'https://open.feishu.cn',
      redirectUri: 'https://example.com/callback',
    };
    const url = buildAuthorizeUrl(cfg, 'state123');
    const parsed = new URL(url);
    expect(parsed.pathname).toBe('/open-apis/authen/v1/authorize');
    expect(parsed.searchParams.get('app_id')).toBe('cli_xxx');
    expect(parsed.searchParams.get('redirect_uri')).toBe('https://example.com/callback');
    expect(parsed.searchParams.get('scope')).toBe('offline_access auth:user.id:read');
    expect(parsed.searchParams.get('state')).toBe('state123');
  });

  it('exchangeCodeForToken sends correct request', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({
        code: 0,
        access_token: 'at_123',
        refresh_token: 'rt_456',
        expires_in: 7200,
        refresh_token_expires_in: 2592000,
        scope: 'auth:user.id:read',
        token_type: 'Bearer',
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const {exchangeCodeForToken} = await import('./feishu.js');
    const cfg = {
      appId: 'cli_xxx',
      appSecret: 'secret',
      host: 'https://open.feishu.cn',
      redirectUri: 'https://example.com/callback',
    };
    const result = await exchangeCodeForToken(cfg, 'code123');
    expect(result.access_token).toBe('at_123');
    expect(result.refresh_token).toBe('rt_456');
    expect(result.expires_in).toBe(7200);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://open.feishu.cn/open-apis/authen/v2/oauth/token');
    expect(options.method).toBe('POST');
    const body = JSON.parse(options.body);
    expect(body.grant_type).toBe('authorization_code');
    expect(body.client_id).toBe('cli_xxx');
    expect(body.client_secret).toBe('secret');
    expect(body.code).toBe('code123');
    expect(body.redirect_uri).toBe('https://example.com/callback');
  });

  it('exchangeCodeForToken throws on error response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({
        code: 99991671,
        error_description: 'Invalid authorization code',
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const {exchangeCodeForToken} = await import('./feishu.js');
    const cfg = {
      appId: 'cli_xxx',
      appSecret: 'secret',
      host: 'https://open.feishu.cn',
      redirectUri: 'https://example.com/callback',
    };
    await expect(exchangeCodeForToken(cfg, 'bad-code')).rejects.toThrow('Invalid authorization code');
  });

  it('fetchFeishuUserInfo returns user data', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({
        code: 0,
        data: {
          open_id: 'ou_123',
          union_id: 'on_456',
          name: 'Alice',
          en_name: 'Alice Chen',
          email: 'alice@example.com',
          avatar_url: 'https://example.com/avatar.png',
        },
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const {fetchFeishuUserInfo} = await import('./feishu.js');
    const user = await fetchFeishuUserInfo('at_123', 'https://open.feishu.cn');
    expect(user.open_id).toBe('ou_123');
    expect(user.name).toBe('Alice');
    expect(user.email).toBe('alice@example.com');
    expect(user.avatar_url).toBe('https://example.com/avatar.png');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://open.feishu.cn/open-apis/authen/v1/user_info');
    expect(options.headers.Authorization).toBe('Bearer at_123');
  });

  it('fetchFeishuUserInfo throws on error response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({
        code: 99991663,
        msg: 'Access token invalid',
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const {fetchFeishuUserInfo} = await import('./feishu.js');
    await expect(fetchFeishuUserInfo('bad-token', 'https://open.feishu.cn')).rejects.toThrow('Access token invalid');
  });
});

describe('admin-users', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.ADMIN_BOOTSTRAP_OPEN_IDS;
  });

  function createMockPool(rows: any[] = [], rowCount?: number) {
    return {
      query: vi.fn().mockResolvedValue({rows, rowCount: rowCount ?? rows.length}),
    };
  }

  it('isAdminOpenId returns true when user exists', async () => {
    const mockPool = createMockPool([{1: 1}]);
    vi.doMock('../db.js', () => ({getPool: () => mockPool}));

    const {isAdminOpenId} = await import('./admin-users.js');
    const result = await isAdminOpenId('ou_123');
    expect(result).toBe(true);
    expect(mockPool.query).toHaveBeenCalledWith(
      'SELECT 1 FROM admin_users WHERE open_id = $1 LIMIT 1',
      ['ou_123'],
    );
  });

  it('isAdminOpenId returns false when user does not exist', async () => {
    const mockPool = createMockPool([]);
    vi.doMock('../db.js', () => ({getPool: () => mockPool}));

    const {isAdminOpenId} = await import('./admin-users.js');
    const result = await isAdminOpenId('ou_999');
    expect(result).toBe(false);
  });

  it('listAdmins returns ordered rows', async () => {
    const mockPool = createMockPool([
      {open_id: 'ou_1', name: 'Alice', email: 'a@example.com', added_at: '2026-01-01', added_by: 'bootstrap'},
      {open_id: 'ou_2', name: 'Bob', email: null, added_at: '2026-01-02', added_by: 'admin'},
    ]);
    vi.doMock('../db.js', () => ({getPool: () => mockPool}));

    const {listAdmins} = await import('./admin-users.js');
    const admins = await listAdmins();
    expect(admins).toHaveLength(2);
    expect(admins[0].name).toBe('Alice');
    expect(admins[1].name).toBe('Bob');
  });

  it('addAdmin inserts and returns user', async () => {
    const mockPool = createMockPool([
      {open_id: 'ou_new', name: 'New Admin', email: 'new@example.com', added_at: '2026-04-26', added_by: 'bootstrap'},
    ]);
    vi.doMock('../db.js', () => ({getPool: () => mockPool}));

    const {addAdmin} = await import('./admin-users.js');
    const result = await addAdmin({
      open_id: 'ou_new',
      name: 'New Admin',
      email: 'new@example.com',
      added_by: 'bootstrap',
    });
    expect(result.open_id).toBe('ou_new');
    expect(result.name).toBe('New Admin');
  });

  it('removeAdmin returns true when row deleted', async () => {
    const mockPool = createMockPool([], 1);
    vi.doMock('../db.js', () => ({getPool: () => mockPool}));

    const {removeAdmin} = await import('./admin-users.js');
    const result = await removeAdmin('ou_123');
    expect(result).toBe(true);
  });

  it('removeAdmin returns false when no row deleted', async () => {
    const mockPool = createMockPool([], 0);
    vi.doMock('../db.js', () => ({getPool: () => mockPool}));

    const {removeAdmin} = await import('./admin-users.js');
    const result = await removeAdmin('ou_missing');
    expect(result).toBe(false);
  });

  it('healAdminProfile updates placeholder name only', async () => {
    const mockPool = createMockPool([], 0);
    vi.doMock('../db.js', () => ({getPool: () => mockPool}));

    const {healAdminProfile} = await import('./admin-users.js');
    await healAdminProfile({open_id: 'ou_123', name: 'Real Name', email: 'real@example.com'});
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE admin_users'),
      ['ou_123', 'Real Name', 'real@example.com'],
    );
  });

  it('bootstrapAdmins does nothing when env var unset', async () => {
    const mockPool = createMockPool([]);
    vi.doMock('../db.js', () => ({getPool: () => mockPool}));

    const {bootstrapAdmins} = await import('./admin-users.js');
    await bootstrapAdmins();
    expect(mockPool.query).not.toHaveBeenCalled();
  });

  it('bootstrapAdmins adds admins from comma-separated env var', async () => {
    process.env.ADMIN_BOOTSTRAP_OPEN_IDS = 'ou_1, ou_2 ,ou_3';
    const mockPool = createMockPool([
      {open_id: 'ou_1', name: 'ou_1', email: null, added_at: '2026-04-26', added_by: 'bootstrap'},
    ]);
    vi.doMock('../db.js', () => ({getPool: () => mockPool}));

    const {bootstrapAdmins} = await import('./admin-users.js');
    await bootstrapAdmins();
    // Called 3 times (once per ID), but mock returns same result each time
    expect(mockPool.query).toHaveBeenCalledTimes(3);
  });
});
