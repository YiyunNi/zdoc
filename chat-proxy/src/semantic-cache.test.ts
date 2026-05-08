import {describe, expect, it, vi} from 'vitest';

vi.mock('./db.js', () => ({
  getPool: vi.fn(),
  invalidateCacheByChunkHashes: vi.fn(),
  getCacheStats: vi.fn(),
  getCacheEntriesCount: vi.fn(),
  isDbReady: vi.fn(() => false),
}));

vi.mock('./runtime-config.js', () => ({
  resolveModel: vi.fn().mockResolvedValue({model: 'test-embedding-model'}),
  getEmbeddingModel: vi.fn(),
}));

describe('semantic cache privacy defaults', () => {
  it('is disabled unless explicitly enabled', async () => {
    delete process.env.SEMANTIC_CACHE_ENABLED;
    vi.resetModules();

    const {getSemanticCacheConfig} = await import('./semantic-cache.js');
    const config = await getSemanticCacheConfig();

    expect(config.enabled).toBe(false);
  });
});
