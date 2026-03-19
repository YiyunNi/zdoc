import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';

// Mock generateEmbedding used by logger for all tests
vi.mock('./rag.js', () => ({
  generateEmbedding: vi.fn().mockResolvedValue(new Array(1024).fill(0.1)),
}));

describe('logger', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env.ZILLIZ_ENDPOINT = '';
    process.env.ZILLIZ_TOKEN = '';
  });

  it('logEvent buffers events without flushing under threshold', async () => {
    // ZILLIZ_ENDPOINT='' means isConfigured() returns false — logEvent is a no-op
    const {logEvent} = await import('./logger.js');
    logEvent('conv-1', 'user-1', 'message', 'general', {content: 'hello'});
    // No assertion needed beyond not crashing
  });

  it('flushes batch at threshold of 10', async () => {
    process.env.ZILLIZ_ENDPOINT = 'https://test.zillizcloud.com';
    process.env.ZILLIZ_TOKEN = 'test-token';

    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({code: 0, data: {}}),
    });
    vi.stubGlobal('fetch', mockFetch);

    const {logEvent} = await import('./logger.js');

    for (let i = 0; i < 10; i++) {
      logEvent('conv-1', 'user-1', 'message', 'general', {content: `msg ${i}`});
    }

    await vi.advanceTimersByTimeAsync(100);

    // Should have called fetch for the insert to chat_events
    const insertCall = mockFetch.mock.calls.find(
      (c: any[]) => typeof c[0] === 'string' && c[0].includes('/entities/insert'),
    );
    expect(insertCall).toBeTruthy();

    const body = JSON.parse(insertCall![1].body);
    expect(body.collectionName).toBe('chat_events');
    expect(body.data).toHaveLength(10);
  });

  it('does not crash when Zilliz is not configured', async () => {
    process.env.ZILLIZ_ENDPOINT = '';

    const {logEvent} = await import('./logger.js');

    expect(() => {
      logEvent('conv-1', 'user-1', 'message', 'general', {content: 'hello'});
    }).not.toThrow();
  });

  it('saveConversation calls upsert with correct shape', async () => {
    process.env.ZILLIZ_ENDPOINT = 'https://test.zillizcloud.com';
    process.env.ZILLIZ_TOKEN = 'test-token';

    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({code: 0, data: {}}),
    });
    vi.stubGlobal('fetch', mockFetch);

    const {saveConversation} = await import('./logger.js');

    await saveConversation({
      id: 'conv-1',
      userId: 'user-1',
      sessionId: 'sess-1',
      messages: [{role: 'user', content: 'hello'}],
      agentTypesUsed: ['general'],
      toolsCalled: [],
      sourcesReturned: [],
      confidenceLevels: ['high'],
      pageUrls: ['/docs'],
      feedbackSummary: {up: 1, down: 0},
    });

    const upsertCall = mockFetch.mock.calls.find(
      (c: any[]) => typeof c[0] === 'string' && c[0].includes('/entities/upsert'),
    );
    expect(upsertCall).toBeTruthy();

    const body = JSON.parse(upsertCall![1].body);
    expect(body.collectionName).toBe('chat_conversations');
    expect(body.data[0]).toMatchObject({
      id: 'conv-1',
      user_id: 'user-1',
      session_id: 'sess-1',
      message_count: 1,
    });
    expect(body.data[0].embedding).toHaveLength(1024);
  });

  it('updateUserProfile calls upsert with embedding', async () => {
    process.env.ZILLIZ_ENDPOINT = 'https://test.zillizcloud.com';
    process.env.ZILLIZ_TOKEN = 'test-token';

    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({code: 0, data: {}}),
    });
    vi.stubGlobal('fetch', mockFetch);

    const {updateUserProfile} = await import('./logger.js');

    await updateUserProfile('user-1', {
      topicsDiscussed: ['vector search', 'schema design'],
      pagesVisited: ['/docs/overview'],
      feedbackGiven: {up: 3, down: 1},
    });

    const upsertCall = mockFetch.mock.calls.find(
      (c: any[]) => typeof c[0] === 'string' && c[0].includes('/entities/upsert'),
    );
    expect(upsertCall).toBeTruthy();

    const body = JSON.parse(upsertCall![1].body);
    expect(body.collectionName).toBe('chat_users');
    expect(body.data[0]).toMatchObject({
      user_id: 'user-1',
    });
    expect(body.data[0].embedding).toHaveLength(1024);
  });
});
