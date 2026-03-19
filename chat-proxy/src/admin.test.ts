import {describe, it, expect, vi, beforeEach} from 'vitest';

vi.mock('./rag.js', () => ({
  generateEmbedding: vi.fn().mockResolvedValue(new Array(1536).fill(0.1)),
}));

describe('adminApp', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns 401 when Authorization header is missing', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    process.env.ZILLIZ_ENDPOINT = 'https://test.zillizcloud.com';
    process.env.ZILLIZ_TOKEN = 'test-token';

    vi.doMock('@zilliz/milvus2-sdk-node', () => ({
      MilvusClient: class {},
    }));

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/conversations');
    expect(res.status).toBe(401);

    process.env.ADMIN_API_KEY = '';
    process.env.ZILLIZ_ENDPOINT = '';
    process.env.ZILLIZ_TOKEN = '';
  });

  it('returns 401 when token is wrong', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    process.env.ZILLIZ_ENDPOINT = 'https://test.zillizcloud.com';
    process.env.ZILLIZ_TOKEN = 'test-token';

    vi.doMock('@zilliz/milvus2-sdk-node', () => ({
      MilvusClient: class {},
    }));

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/conversations', {
      headers: {Authorization: 'Bearer wrong-key'},
    });
    expect(res.status).toBe(401);

    process.env.ADMIN_API_KEY = '';
    process.env.ZILLIZ_ENDPOINT = '';
    process.env.ZILLIZ_TOKEN = '';
  });

  it('returns 503 when ADMIN_API_KEY is not set', async () => {
    process.env.ADMIN_API_KEY = '';

    vi.doMock('@zilliz/milvus2-sdk-node', () => ({
      MilvusClient: class {},
    }));

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/conversations', {
      headers: {Authorization: 'Bearer anything'},
    });
    expect(res.status).toBe(503);
  });

  it('GET /conversations returns conversations on happy path', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    process.env.ZILLIZ_ENDPOINT = 'https://test.zillizcloud.com';
    process.env.ZILLIZ_TOKEN = 'test-token';

    const mockQuery = vi.fn().mockResolvedValue({data: [{id: 'conv-1', user_id: 'u1'}]});

    vi.doMock('@zilliz/milvus2-sdk-node', () => ({
      MilvusClient: class {
        query = mockQuery;
        search = vi.fn();
        getCollectionStatistics = vi.fn();
      },
    }));

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/conversations', {
      headers: {Authorization: 'Bearer secret-key'},
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.conversations).toEqual([{id: 'conv-1', user_id: 'u1'}]);

    process.env.ADMIN_API_KEY = '';
    process.env.ZILLIZ_ENDPOINT = '';
    process.env.ZILLIZ_TOKEN = '';
  });

  it('GET /conversations with filters passes correct filter string', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    process.env.ZILLIZ_ENDPOINT = 'https://test.zillizcloud.com';
    process.env.ZILLIZ_TOKEN = 'test-token';

    const mockQuery = vi.fn().mockResolvedValue({data: []});

    vi.doMock('@zilliz/milvus2-sdk-node', () => ({
      MilvusClient: class {
        query = mockQuery;
        search = vi.fn();
        getCollectionStatistics = vi.fn();
      },
    }));

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/conversations?userId=u1&agent=schema', {
      headers: {Authorization: 'Bearer secret-key'},
    });

    expect(res.status).toBe(200);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: expect.stringContaining('user_id == "u1"'),
      }),
    );
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: expect.stringContaining('array_contains(agent_types_used, "schema")'),
      }),
    );

    process.env.ADMIN_API_KEY = '';
    process.env.ZILLIZ_ENDPOINT = '';
    process.env.ZILLIZ_TOKEN = '';
  });

  it('GET /conversations/search returns 400 when q is missing', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    process.env.ZILLIZ_ENDPOINT = 'https://test.zillizcloud.com';
    process.env.ZILLIZ_TOKEN = 'test-token';

    vi.doMock('@zilliz/milvus2-sdk-node', () => ({
      MilvusClient: class {
        query = vi.fn();
        search = vi.fn();
        getCollectionStatistics = vi.fn();
      },
    }));

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/conversations/search', {
      headers: {Authorization: 'Bearer secret-key'},
    });

    expect(res.status).toBe(400);

    process.env.ADMIN_API_KEY = '';
    process.env.ZILLIZ_ENDPOINT = '';
    process.env.ZILLIZ_TOKEN = '';
  });

  it('GET /conversations/search returns results on happy path', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    process.env.ZILLIZ_ENDPOINT = 'https://test.zillizcloud.com';
    process.env.ZILLIZ_TOKEN = 'test-token';

    const mockSearch = vi.fn().mockResolvedValue({results: [{id: 'conv-2'}]});

    vi.doMock('@zilliz/milvus2-sdk-node', () => ({
      MilvusClient: class {
        query = vi.fn();
        search = mockSearch;
        getCollectionStatistics = vi.fn();
      },
    }));

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/conversations/search?q=vector+search', {
      headers: {Authorization: 'Bearer secret-key'},
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results).toEqual([{id: 'conv-2'}]);

    process.env.ADMIN_API_KEY = '';
    process.env.ZILLIZ_ENDPOINT = '';
    process.env.ZILLIZ_TOKEN = '';
  });

  it('GET /users returns users on happy path', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    process.env.ZILLIZ_ENDPOINT = 'https://test.zillizcloud.com';
    process.env.ZILLIZ_TOKEN = 'test-token';

    const mockQuery = vi.fn().mockResolvedValue({data: [{user_id: 'u1'}]});

    vi.doMock('@zilliz/milvus2-sdk-node', () => ({
      MilvusClient: class {
        query = mockQuery;
        search = vi.fn();
        getCollectionStatistics = vi.fn();
      },
    }));

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/users', {
      headers: {Authorization: 'Bearer secret-key'},
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.users).toEqual([{user_id: 'u1'}]);

    process.env.ADMIN_API_KEY = '';
    process.env.ZILLIZ_ENDPOINT = '';
    process.env.ZILLIZ_TOKEN = '';
  });

  it('GET /stats returns aggregated counts', async () => {
    process.env.ADMIN_API_KEY = 'secret-key';
    process.env.ZILLIZ_ENDPOINT = 'https://test.zillizcloud.com';
    process.env.ZILLIZ_TOKEN = 'test-token';

    const mockQuery = vi.fn().mockResolvedValue({data: [{id: 'x'}]});
    const mockStats = vi.fn().mockResolvedValue({data: {row_count: 42}});

    vi.doMock('@zilliz/milvus2-sdk-node', () => ({
      MilvusClient: class {
        query = mockQuery;
        search = vi.fn();
        getCollectionStatistics = mockStats;
      },
    }));

    const {adminApp} = await import('./admin.js');
    const res = await adminApp.request('/stats', {
      headers: {Authorization: 'Bearer secret-key'},
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.conversations.count).toBe(42);
    expect(body.events.count).toBe(42);
    expect(body.users.count).toBe(42);

    process.env.ADMIN_API_KEY = '';
    process.env.ZILLIZ_ENDPOINT = '';
    process.env.ZILLIZ_TOKEN = '';
  });
});
