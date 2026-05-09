import {describe, it, expect, vi, beforeEach} from 'vitest';

vi.mock('ai', () => ({
  streamText: vi.fn(),
  stepCountIs: vi.fn((n: number) => n),
  smoothStream: vi.fn(() => ({transform: vi.fn()})),
  tool: vi.fn((definition: any) => definition),
}));

vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: vi.fn(() => ({
    chat: vi.fn(),
    textEmbeddingModel: vi.fn(() => ({doEmbed: vi.fn().mockResolvedValue({embeddings: [[0.1, 0.2, 0.3]]})})),
  })),
}));

vi.mock('./runtime-config.js', () => ({
  resolveModel: vi.fn().mockResolvedValue({source: 'env', provider: 'openai-compatible', model: 'test-model'}),
  createModelInstance: vi.fn(() => 'test-model-instance'),
}));

vi.mock('./rag.js', () => ({
  retrieve: vi.fn().mockResolvedValue({context: '', sources: [], confidence: {level: 'high', avgScore: 0.9}, rawResults: []}),
  isVectorSearchAvailable: vi.fn(() => false),
  searchDocs: vi.fn().mockResolvedValue([
    {
      id: 'cloud-guides:/docs/create-collection#0',
      doc_url: '/docs/create-collection',
      doc_url_md: '/docs/create-collection.md',
      doc_title: 'Create a collection',
      section: 'cloud-guides',
      content: 'Create a collection in Zilliz Cloud with Python by creating a MilvusClient and calling create_collection.',
      score: 0.95,
      weight: 1,
      contextScore: 0.95,
    },
  ]),
  getIndexStatus: vi.fn(() => ({ready: true, chunks: 100, lastRefreshed: new Date().toISOString()})),
  getTitleByUrl: vi.fn().mockResolvedValue(null),
}));

vi.mock('./router.js', () => ({
  routeIntent: vi.fn().mockResolvedValue({agent: 'general', topics: [], reasoning: 'test'}),
}));

vi.mock('./logger.js', async () => {
  const actual = await vi.importActual<typeof import('./logger.js')>('./logger.js');
  return {
    ...actual,
    logEvent: vi.fn(),
    saveConversation: vi.fn().mockResolvedValue(undefined),
    updateUserProfile: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock('./sessions.js', () => {
  const sessions = new Map<string, any>();
  return {
    getOrCreateSession: vi.fn((sessionId?: string) => {
      const id = sessionId || 'generated-session';
      let session = sessions.get(id);
      if (!session) {
        session = {id, messages: [], createdAt: Date.now(), lastActiveAt: Date.now()};
        sessions.set(id, session);
      }
      return {session, isNew: false};
    }),
    appendAndWindow: vi.fn((_, msgs) => msgs),
    shouldInjectPageContext: vi.fn(() => false),
    getSessionCount: vi.fn(() => sessions.size),
  };
});

vi.mock('./guard.js', () => ({
  checkGuard: vi.fn(() => ({allowed: true})),
  DEFLECTION_MESSAGE: 'Deflection text',
  GREETING_REDIRECT: 'Greeting redirect',
}));

vi.mock('./agents/index.js', () => ({
  getAgent: vi.fn(() => ({
    type: 'general',
    name: 'General Assistant',
    systemPrompt: 'Test prompt',
    toolNames: [],
  })),
}));

vi.mock('./tools/index.js', () => ({
  getToolsForAgent: vi.fn(() => ({})),
}));

vi.mock('./db.js', async importOriginal => {
  const actual = await importOriginal<typeof import('./db.js')>();
  return {
    ...actual,
    saveTokenUsage: vi.fn(),
    isDbReady: vi.fn(() => false),
    getPool: vi.fn(() => ({query: vi.fn().mockResolvedValue({rows: []})})),
  };
});

vi.mock('./feedback.js', () => ({
  recordFeedback: vi.fn(),
  getStats: vi.fn(() => ({totalUp: 0, totalDown: 0, total: 0, positiveRate: 0, recentFeedback: []})),
}));

vi.mock('./admin.js', async () => {
  const {Hono} = await import('hono');
  return {adminApp: new Hono()};
});

import {app, clearResponseCache} from './index.js';
import {streamText} from 'ai';
import {routeIntent} from './router.js';

function parseSSE(text: string): Array<{event: string; data: any}> {
  const events: Array<{event: string; data: any}> = [];
  for (const block of text.split('\n\n').filter(Boolean)) {
    const lines = block.split('\n');
    let event = '', data = '';
    for (const line of lines) {
      if (line.startsWith('event: ')) event = line.slice(7);
      else if (line.startsWith('data: ')) data = line.slice(6);
    }
    if (event && data) {
      try { events.push({event, data: JSON.parse(data)}); } catch { events.push({event, data}); }
    }
  }
  return events;
}

const cacheableAnswer = 'Create a collection in Zilliz Cloud with Python using MilvusClient and create_collection. First connect with your endpoint and token, then define the collection name, dimension, and metric type before inserting data.';

describe('Node answer caches', () => {
  beforeEach(() => {
    clearResponseCache();
    vi.clearAllMocks();
    vi.mocked(streamText).mockImplementation(() => ({
      fullStream: (async function* () {
        yield {type: 'text-delta', text: cacheableAnswer};
      })(),
      totalUsage: Promise.resolve({inputTokens: 10, outputTokens: 5, totalTokens: 15}),
    } as any));
  });

  it('replays cross-session exact cache for a safe public docs question', async () => {
    const payload = (sessionId: string) => JSON.stringify({
      sessionId,
      userId: 'cache-test-user',
      pageUrl: '/docs/home',
      messages: [{role: 'user', content: 'How do I create a collection in Zilliz Cloud with Python?'}],
    });

    const first = await app.request('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept-Language': 'en'},
      body: payload('cache-session-a'),
    });
    expect(first.status).toBe(200);
    const firstEvents = parseSSE(await first.text());
    expect(firstEvents.find(e => e.event === 'cache')).toBeUndefined();
    expect(firstEvents.find(e => e.event === 'done')?.data.stop_reason).toBe('end_turn');
    expect(vi.mocked(streamText)).toHaveBeenCalledTimes(1);

    const second = await app.request('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept-Language': 'en'},
      body: payload('cache-session-b'),
    });
    expect(second.status).toBe(200);
    const secondEvents = parseSSE(await second.text());

    expect(secondEvents.find(e => e.event === 'cache')?.data).toEqual({type: 'exact'});
    expect(secondEvents.find(e => e.event === 'tool-call')).toBeUndefined();
    expect(secondEvents.find(e => e.event === 'delta')?.data.text).toBe(cacheableAnswer);
    expect(secondEvents.find(e => e.event === 'timing')?.data.cache).toBe('exact');
    expect(secondEvents.find(e => e.event === 'done')?.data.stop_reason).toBe('end_turn');
    expect(vi.mocked(streamText)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(routeIntent)).toHaveBeenCalledTimes(1);
  });

  it('allows public docs pageContext requests to use the cross-session exact cache', async () => {
    const payload = (sessionId: string) => JSON.stringify({
      sessionId,
      userId: 'cache-test-user',
      pageUrl: '/docs/home',
      pageContext: 'Private page-specific context that should stay request scoped.',
      messages: [{role: 'user', content: 'How do I create a collection in Zilliz Cloud with Python?'}],
    });

    const first = await app.request('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: payload('context-session-a'),
    });
    await first.text();

    const second = await app.request('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: payload('context-session-b'),
    });
    const secondEvents = parseSSE(await second.text());

    expect(secondEvents.find(e => e.event === 'cache')?.data).toEqual({type: 'exact'});
    expect(vi.mocked(streamText)).toHaveBeenCalledTimes(1);
  });
});
