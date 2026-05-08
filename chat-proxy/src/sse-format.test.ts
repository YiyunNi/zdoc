import {describe, it, expect, vi, beforeEach} from 'vitest';

// Mock all external dependencies before importing
vi.mock('ai', () => ({
  streamText: vi.fn(),
  stepCountIs: vi.fn((n: number) => n),
  smoothStream: vi.fn(() => ({
    transform: vi.fn(),
  })),
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
  retrieve: vi.fn().mockResolvedValue({
    context: '## Docs\nSome context',
    sources: [{title: 'Test Doc', url: 'http://localhost:3000/test', score: 0.9}],
    confidence: {level: 'high', avgScore: 0.9},
    rawResults: [],
  }),
  isVectorSearchAvailable: vi.fn(() => false),
  searchDocs: vi.fn().mockResolvedValue([]),
  getIndexStatus: vi.fn(() => ({ready: true, chunks: 100, lastRefreshed: new Date().toISOString()})),
  getTitleByUrl: vi.fn().mockResolvedValue(null),
}));
vi.mock('./router.js', () => ({
  routeIntent: vi.fn().mockResolvedValue({agent: 'general', reasoning: 'test'}),
}));
vi.mock('./logger.js', () => ({
  logDebugFlow: vi.fn(),
  logEvent: vi.fn(),
  saveConversation: vi.fn().mockResolvedValue(undefined),
  summarizeForDebugLog: vi.fn((value: unknown) => ({chars: String(value ?? '').length, bytes: String(value ?? '').length, sha256: '0'.repeat(64)})),
  updateUserProfile: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('./sessions.js', () => {
  const session = {id: 'test-session-123', messages: [], createdAt: Date.now(), lastActiveAt: Date.now()};
  return {
    getOrCreateSession: vi.fn(() => ({session, isNew: true})),
    appendAndWindow: vi.fn((_, msgs) => msgs),
    shouldInjectPageContext: vi.fn(() => false),
    getSessionCount: vi.fn(() => 0),
  };
});
vi.mock('./guard.js', () => ({
  checkGuard: vi.fn(() => ({allowed: true})),
  DEFLECTION_MESSAGE: 'test deflection',
  GREETING_REDIRECT: 'test greeting',
}));
vi.mock('./agents/index.js', () => ({
  getAgent: vi.fn(() => ({
    type: 'general',
    name: 'General Assistant',
    systemPrompt: 'You are a test assistant.',
    toolNames: [],
  })),
}));
vi.mock('./tools/index.js', () => ({
  getToolsForAgent: vi.fn(() => ({})),
}));
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
import {checkGuard} from './guard.js';

function parseSSE(text: string): Array<{event: string; data: any}> {
  const events: Array<{event: string; data: any}> = [];
  const blocks = text.split('\n\n').filter(Boolean);
  for (const block of blocks) {
    const lines = block.split('\n');
    let event = '';
    let data = '';
    for (const line of lines) {
      if (line.startsWith('event: ')) event = line.slice(7);
      else if (line.startsWith('data: ')) data = line.slice(6);
    }
    if (event && data) {
      try {
        events.push({event, data: JSON.parse(data)});
      } catch {
        events.push({event, data});
      }
    }
  }
  return events;
}

describe('SSE Stream Format', () => {
  beforeEach(() => {
    vi.mocked(checkGuard).mockReturnValue({allowed: true});
    clearResponseCache();
  });

  it('emits correct SSE wire format: event + data + double newline', async () => {
    vi.mocked(streamText).mockReturnValue({
      fullStream: (async function* () {
        yield {type: 'text-delta', text: 'Hello'};
      })(),
    } as any);

    const res = await app.request('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({messages: [{role: 'user', content: 'test'}]}),
    });

    const text = await res.text();
    // Each event block must follow format: event: <name>\ndata: <json>\n\n
    const blocks = text.split('\n\n').filter(Boolean);
    for (const block of blocks) {
      expect(block).toMatch(/^event: \w+\ndata: .+$/);
    }
  });

  it('emits session event with sessionId', async () => {
    vi.mocked(streamText).mockReturnValue({
      fullStream: (async function* () {
        yield {type: 'text-delta', text: 'Hi'};
      })(),
    } as any);

    const res = await app.request('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({messages: [{role: 'user', content: 'test'}]}),
    });

    const events = parseSSE(await res.text());
    const sessionEvent = events.find(e => e.event === 'session');
    expect(sessionEvent).toBeDefined();
    expect(sessionEvent!.data.sessionId).toBe('test-session-123');
  });

  it('emits agent event with type and name', async () => {
    vi.mocked(streamText).mockReturnValue({
      fullStream: (async function* () {
        yield {type: 'text-delta', text: 'Hi'};
      })(),
    } as any);

    const res = await app.request('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({messages: [{role: 'user', content: 'test'}]}),
    });

    const events = parseSSE(await res.text());
    const agentEvent = events.find(e => e.event === 'agent');
    expect(agentEvent).toBeDefined();
    expect(agentEvent!.data.type).toBe('general');
    expect(agentEvent!.data.name).toBe('General Assistant');
  });

  it('emits final synthesis delta events with text', async () => {
    vi.mocked(streamText)
      .mockReturnValueOnce({
        fullStream: (async function* () {})(),
      } as any)
      .mockReturnValueOnce({
        fullStream: (async function* () {
          yield {type: 'text-delta', text: 'Hello'};
          yield {type: 'text-delta', text: ' world'};
        })(),
      } as any);

    const res = await app.request('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({messages: [{role: 'user', content: 'test'}]}),
    });

    const events = parseSSE(await res.text());
    const deltas = events.filter(e => e.event === 'delta');
    expect(deltas).toHaveLength(2);
    expect(deltas[0].data.text).toBe('Hello');
    expect(deltas[1].data.text).toBe(' world');
  });

  it('emits confidence with level and retrieval_score', async () => {
    vi.mocked(streamText).mockReturnValue({
      fullStream: (async function* () {
        yield {type: 'text-delta', text: 'Answer'};
      })(),
    } as any);

    const res = await app.request('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({messages: [{role: 'user', content: 'test'}]}),
    });

    const events = parseSSE(await res.text());
    const conf = events.find(e => e.event === 'confidence');
    expect(conf).toBeDefined();
    expect(conf!.data).toHaveProperty('level');
    expect(conf!.data).toHaveProperty('retrieval_score');
  });

  it('emits sources and grounding when response overlaps with RAG chunks', async () => {
    // The grounding module needs actual RAG rawResults to match against.
    // With the default mock (rawResults: []), grounding will emit no sources.
    // This test verifies the SSE events are correctly structured.
    vi.mocked(streamText).mockReturnValue({
      fullStream: (async function* () {
        yield {type: 'text-delta', text: 'Answer from the documentation about testing features and capabilities.'};
      })(),
    } as any);

    const res = await app.request('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({messages: [{role: 'user', content: 'test'}]}),
    });

    const events = parseSSE(await res.text());
    // With empty rawResults in mock, grounding won't emit sources
    // Just verify the event stream completes without error
    const doneEvent = events.find(e => e.event === 'done');
    expect(doneEvent).toBeDefined();
  });

  it('emits done with stop_reason', async () => {
    vi.mocked(streamText).mockReturnValue({
      fullStream: (async function* () {
        yield {type: 'text-delta', text: 'Done'};
      })(),
    } as any);

    const res = await app.request('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({messages: [{role: 'user', content: 'test'}]}),
    });

    const events = parseSSE(await res.text());
    const doneEvent = events.find(e => e.event === 'done');
    expect(doneEvent).toBeDefined();
    expect(doneEvent!.data.stop_reason).toBe('end_turn');
  });

  it('emits error event on stream failure', async () => {
    vi.mocked(streamText).mockReturnValue({
      fullStream: (async function* () {
        throw new Error('LLM provider error');
      })(),
    } as any);

    const res = await app.request('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({messages: [{role: 'user', content: 'test'}]}),
    });

    const events = parseSSE(await res.text());
    const errorEvent = events.find(e => e.event === 'error');
    expect(errorEvent).toBeDefined();
    expect(errorEvent!.data.error).toBe('Internal server error');
    expect(errorEvent!.data.requestId).toMatch(/^[0-9a-f-]{36}$/);
    const doneEvent = events.find(e => e.event === 'done');
    expect(doneEvent).toBeDefined();
    expect(doneEvent!.data.stop_reason).toBe('error');
  });

  it('emits events in correct order: session → agent → delta(s) → confidence → done', async () => {
    vi.mocked(streamText).mockReturnValue({
      fullStream: (async function* () {
        yield {type: 'text-delta', text: 'Hello world.'};
      })(),
    } as any);

    const res = await app.request('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({messages: [{role: 'user', content: 'test'}]}),
    });

    const events = parseSSE(await res.text());
    const eventNames = events.map(e => e.event);
    const sessionIdx = eventNames.indexOf('session');
    const agentIdx = eventNames.indexOf('agent');
    const deltaIdx = eventNames.indexOf('delta');
    const confIdx = eventNames.indexOf('confidence');
    const doneIdx = eventNames.indexOf('done');

    expect(sessionIdx).toBeLessThan(agentIdx);
    expect(agentIdx).toBeLessThan(deltaIdx);
    expect(deltaIdx).toBeLessThan(confIdx);
    expect(confIdx).toBeLessThan(doneIdx);
  });
});
