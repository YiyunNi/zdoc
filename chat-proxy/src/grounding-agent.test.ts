import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('ai', async () => {
  const actual = await vi.importActual('ai');
  return {
    ...(actual as any),
    generateObject: vi.fn(),
  };
});

vi.mock('./runtime-config.js', () => ({
  resolveModel: vi.fn().mockResolvedValue({source: 'env', provider: 'openai-compatible', model: 'test-grounding-model'}),
  createModelInstance: vi.fn(() => 'test-grounding-model-instance'),
}));

vi.mock('./db.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./db.js')>();
  return {
    ...actual,
    saveTokenUsage: vi.fn(),
  };
});

import {generateObject} from 'ai';
import {groundAtomically} from './grounding-agent.js';

const mockGenerateObject = vi.mocked(generateObject);

describe('groundAtomically telemetry', () => {
  beforeEach(() => {
    mockGenerateObject.mockReset();
  });

  it('does not log raw grounding provider errors', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockGenerateObject.mockRejectedValueOnce(new Error('provider failed for alice@example.com'));

    await groundAtomically(
      'Zilliz Cloud supports vector search with indexed collections.',
      [{title: 'Vector Search', url: 'http://localhost:3000/vector-search', score: 0.9}],
      [{
        id: 'chunk-1',
        doc_url: 'http://localhost:3000/vector-search',
        doc_url_md: 'http://localhost:3000/vector-search.md',
        doc_title: 'Vector Search',
        section: 'cloud-guides',
        content: 'Zilliz Cloud supports vector search with indexed collections.',
        score: 0.9,
        weight: 1,
        contextScore: 0.9,
      }],
      'request-1',
    );

    const logs = warnSpy.mock.calls.map(call => call.join(' ')).join('\n');
    expect(logs).not.toContain('alice@example.com');
  });

  it('passes request ID into grounding telemetry metadata', async () => {
    mockGenerateObject.mockResolvedValueOnce({
      object: {selectedSources: [{index: 0, paragraphs: [0]}]},
      usage: {inputTokens: 1, outputTokens: 2, totalTokens: 3},
    } as any);

    await groundAtomically(
      'Zilliz Cloud supports vector search with indexed collections.',
      [{title: 'Vector Search', url: 'http://localhost:3000/vector-search', score: 0.9}],
      [{
        id: 'chunk-1',
        doc_url: 'http://localhost:3000/vector-search',
        doc_url_md: 'http://localhost:3000/vector-search.md',
        doc_title: 'Vector Search',
        section: 'cloud-guides',
        content: 'Zilliz Cloud supports vector search with indexed collections.',
        score: 0.9,
        weight: 1,
        contextScore: 0.9,
      }],
      'request-1',
    );

    const callArgs = mockGenerateObject.mock.calls[0][0] as any;
    expect(callArgs.experimental_telemetry).toMatchObject({
      metadata: {requestId: 'request-1'},
      recordInputs: false,
      recordOutputs: false,
    });
  });
});
