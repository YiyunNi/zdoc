import {describe, it, expect, vi, beforeEach} from 'vitest';
import {Hono} from 'hono';

vi.mock('ai', async () => {
  const actual = await vi.importActual('ai');
  return {
    ...(actual as any),
    generateObject: vi.fn(),
  };
});
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

import {routeIntent, clearSessionRoute} from './router.js';
import {generateObject} from 'ai';

const mockGenerateObject = vi.mocked(generateObject);

describe('routeIntent', () => {
  beforeEach(() => {
    mockGenerateObject.mockReset();
  });

  it('routes to correct agent based on LLM response', async () => {
    mockGenerateObject.mockResolvedValueOnce({
      object: {agent: 'schema', reasoning: 'test'},
    } as any);

    const result = await routeIntent('design my collection', [], 'sess-1');
    expect(result.agent).toBe('schema');
    expect(result.reasoning).toBe('test');
  });

  it('includes sticky agent in prompt for same session', async () => {
    mockGenerateObject.mockResolvedValueOnce({
      object: {agent: 'resources', reasoning: 'first call'},
    } as any);
    await routeIntent('how many CUs', [], 'sess-sticky');

    mockGenerateObject.mockResolvedValueOnce({
      object: {agent: 'resources', reasoning: 'second call'},
    } as any);
    await routeIntent('what about storage', [], 'sess-sticky');

    const secondCallArgs = mockGenerateObject.mock.calls[1][0] as any;
    expect(secondCallArgs.prompt).toContain('Current agent');
    expect(secondCallArgs.prompt).toContain('resources');
  });

  it('falls back to general on error', async () => {
    mockGenerateObject.mockRejectedValueOnce(new Error('API down'));

    const result = await routeIntent('hello', [], 'sess-err');
    expect(result.agent).toBe('general');
    expect(result.reasoning).toContain('Fallback');
  });

  it('falls back to sticky agent when error occurs', async () => {
    // First call succeeds and sets sticky route to 'code'
    mockGenerateObject.mockResolvedValueOnce({
      object: {agent: 'code', reasoning: 'ok'},
    } as any);
    await routeIntent('generate code', [], 'sess-sticky-err');

    // Second call fails — should return sticky 'code', not 'general'
    mockGenerateObject.mockRejectedValueOnce(new Error('API down'));
    const result = await routeIntent('more code', [], 'sess-sticky-err');
    expect(result.agent).toBe('code');
  });

  it('clearSessionRoute resets sticky so error falls back to general', async () => {
    mockGenerateObject.mockResolvedValueOnce({
      object: {agent: 'product', reasoning: 'ok'},
    } as any);
    await routeIntent('compare tiers', [], 'sess-clear');

    clearSessionRoute('sess-clear');

    mockGenerateObject.mockRejectedValueOnce(new Error('API down'));
    const result = await routeIntent('compare tiers', [], 'sess-clear');
    expect(result.agent).toBe('general');
  });

  it('only sends last 4 messages as context', async () => {
    mockGenerateObject.mockResolvedValueOnce({
      object: {agent: 'general', reasoning: 'ok'},
    } as any);

    const messages = Array.from({length: 8}, (_, i) => ({
      role: 'user' as const,
      content: `message-${i}`,
    }));

    await routeIntent('latest', messages, 'sess-ctx');

    const callArgs = mockGenerateObject.mock.calls[0][0] as any;
    // Should contain messages 4-7 (last 4), not 0-3
    expect(callArgs.prompt).toContain('message-4');
    expect(callArgs.prompt).toContain('message-7');
    expect(callArgs.prompt).not.toContain('message-0');
    expect(callArgs.prompt).not.toContain('message-3');
  });
});

describe('getClientIp', () => {
  it('uses first non-private IP from X-Forwarded-For', async () => {
    const {getClientIp} = await import('./index.js');
    const app = new Hono();
    let capturedIp = '';
    app.use('*', async (c) => {
      capturedIp = getClientIp(c);
      return c.text('ok');
    });

    const res = await app.request('/', {
      headers: {'x-forwarded-for': '10.0.0.1, 192.168.1.1, 203.0.113.5'},
    });
    expect(res.status).toBe(200);
    expect(capturedIp).toBe('203.0.113.5');
  });

  it('falls back to first IP when all are private', async () => {
    const {getClientIp} = await import('./index.js');
    const app = new Hono();
    let capturedIp = '';
    app.use('*', async (c) => {
      capturedIp = getClientIp(c);
      return c.text('ok');
    });

    const res = await app.request('/', {
      headers: {'x-forwarded-for': '192.168.1.100'},
    });
    expect(res.status).toBe(200);
    expect(capturedIp).toBe('192.168.1.100');
  });

  it('falls back to x-real-ip when x-forwarded-for is absent', async () => {
    const {getClientIp} = await import('./index.js');
    const app = new Hono();
    let capturedIp = '';
    app.use('*', async (c) => {
      capturedIp = getClientIp(c);
      return c.text('ok');
    });

    const res = await app.request('/', {
      headers: {'x-real-ip': '198.51.100.10'},
    });
    expect(res.status).toBe(200);
    expect(capturedIp).toBe('198.51.100.10');
  });
});
