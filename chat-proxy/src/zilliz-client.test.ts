import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';

describe('zilliz-client', () => {
  const originalEnv = {...process.env};

  beforeEach(() => {
    vi.unstubAllGlobals();
    process.env.ZILLIZ_ENDPOINT = 'https://test.zilliz.cloud';
    process.env.ZILLIZ_TOKEN = 'test-token';
  });

  afterEach(() => {
    process.env = {...originalEnv};
    vi.restoreAllMocks();
  });

  it('zillizRequest constructs correct URL and headers', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({code: 0, data: {result: 'ok'}}),
    });
    vi.stubGlobal('fetch', mockFetch);

    // Re-import to pick up env vars
    const {zillizRequest} = await import('./zilliz-client.js');
    await zillizRequest('/collections/has', {collectionName: 'test'});

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v2/vectordb/collections/has'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        }),
      }),
    );
  });

  it('zillizRequest throws on non-0/200 codes', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({code: 1100, message: 'collection not found'}),
    });
    vi.stubGlobal('fetch', mockFetch);

    const {zillizRequest} = await import('./zilliz-client.js');
    await expect(zillizRequest('/entities/search', {})).rejects.toThrow('Zilliz API error');
  });

  it('isZillizConfigured returns true when both env vars set', async () => {
    const {isZillizConfigured} = await import('./zilliz-client.js');
    expect(isZillizConfigured()).toBe(true);
  });
});
