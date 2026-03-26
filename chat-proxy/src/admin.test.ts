import {describe, it, expect, vi, beforeEach} from 'vitest';

describe('adminApp', () => {
  beforeEach(() => {
    vi.resetModules();
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

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/api/live', {
      headers: {Authorization: 'Bearer secret-key'},
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.sessions).toBeInstanceOf(Array);
    process.env.ADMIN_API_KEY = '';
  });
});
