import {describe, it, expect, vi, beforeEach} from 'vitest';
import {Hono} from 'hono';

vi.mock('ai', async () => {
  const actual = await vi.importActual('ai');
  return {
    ...(actual as any),
    generateObject: vi.fn(),
    generateText: vi.fn(),
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

import {routeIntent, clearSessionRoute, clearRouteCache} from './router.js';
import {generateObject, generateText} from 'ai';

const mockGenerateObject = vi.mocked(generateObject);
const mockGenerateText = vi.mocked(generateText);

describe('routeIntent', () => {
  beforeEach(() => {
    mockGenerateObject.mockReset();
    mockGenerateText.mockReset();
    clearRouteCache();
  });

  it('routes to correct agent based on LLM response', async () => {
    mockGenerateObject.mockResolvedValueOnce({
      object: {agent: 'schema', reasoning: 'test'},
    } as any);

    const result = await routeIntent('design my collection', [], 'sess-1');
    expect(result.agent).toBe('schema');
    expect(result.reasoning).toBe('test');
  });

  it('accepts security and compliance topics from the router', async () => {
    mockGenerateObject.mockResolvedValueOnce({
      object: {
        agent: 'general',
        topics: ['security', 'compliance-and-privacy'],
        reasoning: 'security and compliance question',
      },
    } as any);

    const result = await routeIntent('Do you support SOC 2 and Private Link?', [], 'sess-security-topic');

    expect(result.topics).toEqual(['security', 'compliance-and-privacy']);
  });

  it('describes security and compliance topics in the router prompt', async () => {
    mockGenerateObject.mockResolvedValueOnce({
      object: {agent: 'general', topics: [], reasoning: 'ok'},
    } as any);

    await routeIntent('Can you help with a HIPAA vendor review?', [], 'sess-security-prompt');

    const callArgs = mockGenerateObject.mock.calls[0][0] as any;
    expect(callArgs.prompt).toContain('security:');
    expect(callArgs.prompt).toContain('compliance-and-privacy:');
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
    clearRouteCache(); // avoid cache hit so the error fallback path is exercised

    mockGenerateObject.mockRejectedValueOnce(new Error('API down'));
    const result = await routeIntent('compare tiers', [], 'sess-clear');
    expect(result.agent).toBe('general');
  });

  it('follow-up fast-path uses raw last message, not enriched query', async () => {
    // First call sets sticky route to 'code'
    mockGenerateObject.mockResolvedValueOnce({
      object: {agent: 'code', reasoning: 'ok'},
    } as any);
    await routeIntent('generate code', [], 'sess-followup');

    // Second call passes an enriched ragQuery but raw last message is "ok"
    const enriched = 'Show me Python code for vector search ok';
    const recentMessages = [
      {role: 'user' as const, content: 'Show me Python code for vector search'},
      {role: 'assistant' as const, content: 'Here is some code.'},
      {role: 'user' as const, content: 'ok'},
    ];
    const result = await routeIntent(enriched, recentMessages, 'sess-followup');

    expect(result.agent).toBe('code');
    expect(result.reasoning).toBe('Follow-up fast-path');
    // LLM should NOT have been called for the follow-up
    expect(mockGenerateObject).toHaveBeenCalledTimes(1);
    expect(mockGenerateText).not.toHaveBeenCalled();
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

  it('falls back to tool-based routing when generateObject fails', async () => {
    mockGenerateObject.mockRejectedValueOnce(new Error('JSON parse error'));

    mockGenerateText.mockResolvedValueOnce({
      toolCalls: [{
        toolName: 'route',
        input: {agent: 'schema', topics: ['schema-design'], reasoning: 'tool fallback'},
      }],
    } as any);

    const result = await routeIntent('design my collection fields', [], 'sess-tool-fb');
    expect(result.agent).toBe('schema');
    expect(result.reasoning).toBe('tool fallback');
    expect(mockGenerateText).toHaveBeenCalledTimes(1);
  });

  it('falls back to tool-based routing when generateObject returns invalid agent', async () => {
    mockGenerateObject.mockResolvedValueOnce({
      object: {agent: 'invalid-agent', reasoning: 'bad'},
    } as any);

    mockGenerateText.mockResolvedValueOnce({
      toolCalls: [{
        toolName: 'route',
        input: {agent: 'code', topics: [], reasoning: 'corrected via tool'},
      }],
    } as any);

    const result = await routeIntent('how do i search', [], 'sess-invalid');
    expect(result.agent).toBe('code');
    expect(result.reasoning).toBe('corrected via tool');
  });

  it('falls back to sticky agent when both routing attempts fail', async () => {
    // First call sets sticky route
    mockGenerateObject.mockResolvedValueOnce({
      object: {agent: 'product', reasoning: 'ok'},
    } as any);
    await routeIntent('compare tiers', [], 'sess-both-fail');

    // Both attempts fail
    mockGenerateObject.mockRejectedValueOnce(new Error('fail 1'));
    mockGenerateText.mockRejectedValueOnce(new Error('fail 2'));

    const result = await routeIntent('what about pricing', [], 'sess-both-fail');
    expect(result.agent).toBe('product');
    expect(result.reasoning).toContain('Fallback');
  });

  it('falls back to general when both attempts fail and no sticky route', async () => {
    mockGenerateObject.mockRejectedValueOnce(new Error('fail 1'));
    mockGenerateText.mockRejectedValueOnce(new Error('fail 2'));

    const result = await routeIntent('hello', [], 'sess-no-sticky');
    expect(result.agent).toBe('general');
  });

  it('falls back to plain text JSON extraction when object and tool both fail', async () => {
    mockGenerateObject.mockRejectedValueOnce(new Error('JSON mode unavailable'));
    mockGenerateText.mockRejectedValueOnce(new Error('tool_choice unsupported'));

    // Third attempt: plain text succeeds
    mockGenerateText.mockResolvedValueOnce({
      text: 'Some extra text\n```json\n{"agent": "schema", "topics": ["schema-design"], "reasoning": "plain text fallback"}\n```',
    } as any);

    const result = await routeIntent('design my collection schema', [], 'sess-plain');
    expect(result.agent).toBe('schema');
    expect(result.reasoning).toBe('plain text fallback');
    // generateText should be called twice (tool attempt + plain text attempt)
    expect(mockGenerateText).toHaveBeenCalledTimes(2);
  });

  it('parses inline JSON when plain text fallback returns no markdown fences', async () => {
    mockGenerateObject.mockRejectedValueOnce(new Error('JSON mode unavailable'));
    mockGenerateText.mockRejectedValueOnce(new Error('tool_choice unsupported'));

    mockGenerateText.mockResolvedValueOnce({
      text: 'Here is the route: {"agent": "code", "topics": ["search"], "reasoning": "inline json"}',
    } as any);

    const result = await routeIntent('python search example', [], 'sess-inline');
    expect(result.agent).toBe('code');
  });

  it('strips DeepSeek <think> tags before extracting JSON in plain text fallback', async () => {
    mockGenerateObject.mockRejectedValueOnce(new Error('JSON mode unavailable'));
    mockGenerateText.mockRejectedValueOnce(new Error('tool_choice unsupported'));

    mockGenerateText.mockResolvedValueOnce({
      text: '<think>Let me analyze the query...</think>\n\n{"agent": "schema", "topics": ["schema-design"], "reasoning": "User is asking about collection schema design."}',
    } as any);

    const result = await routeIntent('design my collection schema', [], 'sess-think');
    expect(result.agent).toBe('schema');
    expect(result.reasoning).toBe('User is asking about collection schema design.');
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
