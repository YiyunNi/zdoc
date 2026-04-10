import {describe, it, expect, vi, beforeEach} from 'vitest';

vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));
vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: vi.fn(() => { const m = vi.fn(); m.chat = vi.fn(); return m; }),
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
