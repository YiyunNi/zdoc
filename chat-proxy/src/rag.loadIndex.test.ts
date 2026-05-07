import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';

describe('loadIndex build status', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    delete process.env.INDEX_BASE_URL;
    vi.restoreAllMocks();
  });

  it('resets build status to idle when existing index is fresh (fast path)', async () => {
    const updateBuildStatus = vi.fn();

    vi.doMock('./db.js', () => ({
      getPool: vi.fn(() => ({
        query: vi.fn().mockImplementation((sql: string) => {
          if (sql.includes("metadata WHERE key IN")) {
            return {rows: [
              {key: 'last_build', value: new Date().toISOString()},
              {key: 'source', value: 'http://zdocs/llms'},
              {key: 'total_chunks', value: '1'},
            ]};
          }
          if (sql.includes('COUNT(*)')) {
            return {rows: [{n: 1}]};
          }
          if (sql.includes('attrelid')) {
            return {rows: [{atttypmod: 1024}]};
          }
          return {rows: []};
        }),
      })),
      updateBuildStatus: vi.fn().mockResolvedValue(undefined),
      getBuildStatus: vi.fn(),
      getEmbeddingSchemaDimension: vi.fn().mockResolvedValue(1024),
      recreateAnswerCache: vi.fn().mockResolvedValue(undefined),
      ensureShadowTable: vi.fn().mockResolvedValue(undefined),
      getSemanticCacheConfig: vi.fn().mockResolvedValue({}),
      getCacheEntriesCount: vi.fn().mockResolvedValue(0),
      getIndexStats: vi.fn().mockResolvedValue({chunks: 1, lastBuild: new Date().toISOString()}),
      copyExistingEmbeddingsToShadow: vi.fn().mockResolvedValue(0),
      swapDocChunksTables: vi.fn().mockResolvedValue(undefined),
      dropOldDocChunks: vi.fn().mockResolvedValue(undefined),
      tryAcquireEmbeddingLock: vi.fn().mockResolvedValue(true),
      releaseEmbeddingLock: vi.fn().mockResolvedValue(undefined),
    }));

    vi.doMock('./runtime-config.js', () => ({
      resolveModel: vi.fn().mockResolvedValue({dimensions: 1024}),
    }));

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (String(url).includes('llms.txt')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('- [Guide](test.txt)\n'),
        });
      }
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve('# Guide\nURL: http://example.com/guide\n\nThis is content.\n'),
      });
    }) as any;

    process.env.INDEX_BASE_URL = 'http://zdocs/llms';

    const {loadIndex} = await import('./rag.js');
    const dbModule = await import('./db.js');
    await loadIndex(false);

    expect(dbModule.updateBuildStatus).toHaveBeenCalledWith(
      expect.objectContaining({state: 'idle'})
    );
  });
});
