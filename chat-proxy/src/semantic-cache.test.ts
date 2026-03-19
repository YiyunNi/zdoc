import {describe, it, expect, vi, beforeEach} from 'vitest';

// Mock dependencies before importing module under test
vi.mock('./rag.js', () => ({
  generateEmbedding: vi.fn().mockResolvedValue(new Array(1024).fill(0)),
}));

vi.mock('./zilliz-client.js', () => ({
  isZillizConfigured: vi.fn().mockReturnValue(true),
  zillizRequest: vi.fn(),
}));

vi.mock('./agents/index.js', () => ({
  getAgent: vi.fn().mockReturnValue({type: 'general', name: 'Zilliz Docs Assistant'}),
}));

import {findSemanticCacheHit} from './semantic-cache.js';
import {zillizRequest, isZillizConfigured} from './zilliz-client.js';

const mockZillizRequest = zillizRequest as ReturnType<typeof vi.fn>;
const mockIsConfigured = isZillizConfigured as ReturnType<typeof vi.fn>;

function makeHit(overrides: Record<string, any> = {}) {
  return {
    distance: 0.95,
    messages: JSON.stringify([
      {role: 'user', content: 'How do I create a collection?'},
      {role: 'assistant', content: 'To create a collection, use the `create_collection` method.'},
    ]),
    sources_returned: ['https://docs.zilliz.com/docs/create-collection'],
    confidence_levels: ['high'],
    agent_types_used: ['general'],
    feedback_summary: JSON.stringify({up: 2, down: 0}),
    page_urls_visited: ['/docs/collections'],
    ...overrides,
  };
}

describe('findSemanticCacheHit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsConfigured.mockReturnValue(true);
    delete process.env.SEMANTIC_CACHE_ENABLED;
  });

  it('returns hit when similarity exceeds threshold', async () => {
    mockZillizRequest.mockResolvedValue([makeHit()]);

    const result = await findSemanticCacheHit('How do I create a collection?');

    expect(result).not.toBeNull();
    expect(result!.text).toContain('create_collection');
    expect(result!.similarity).toBe(0.95);
    expect(result!.confidence).toBe('high');
    expect(result!.sources).toHaveLength(1);
    expect(result!.sources[0].title).toBe('Create Collection');
    expect(result!.agentType).toBe('general');
    expect(result!.agentName).toBe('Zilliz Docs Assistant');
  });

  it('returns null when similarity is below threshold', async () => {
    mockZillizRequest.mockResolvedValue([makeHit({distance: 0.85})]);

    const result = await findSemanticCacheHit('How do I create a collection?');

    expect(result).toBeNull();
  });

  it('returns null when hit has negative feedback', async () => {
    mockZillizRequest.mockResolvedValue([
      makeHit({feedback_summary: JSON.stringify({up: 0, down: 1})}),
    ]);

    const result = await findSemanticCacheHit('How do I create a collection?');

    expect(result).toBeNull();
  });

  it('returns null when no hits returned', async () => {
    mockZillizRequest.mockResolvedValue([]);

    const result = await findSemanticCacheHit('something obscure');

    expect(result).toBeNull();
  });

  it('returns null when Zilliz is not configured', async () => {
    mockIsConfigured.mockReturnValue(false);

    const result = await findSemanticCacheHit('How do I create a collection?');

    expect(result).toBeNull();
    expect(mockZillizRequest).not.toHaveBeenCalled();
  });

  it('returns null when SEMANTIC_CACHE_ENABLED is false', async () => {
    process.env.SEMANTIC_CACHE_ENABLED = 'false';

    const result = await findSemanticCacheHit('How do I create a collection?');

    expect(result).toBeNull();
    expect(mockZillizRequest).not.toHaveBeenCalled();
  });

  it('rejects hit when section filter conflicts with cached page', async () => {
    // Cached answer is from cloud-guides, but user is on a BYOC page
    mockZillizRequest.mockResolvedValue([
      makeHit({page_urls_visited: ['/docs/collections']}),
    ]);

    const result = await findSemanticCacheHit(
      'How do I create a collection?',
      'section != "cloud-guides"',
    );

    expect(result).toBeNull();
  });

  it('accepts hit when section filter does not conflict', async () => {
    // Cached answer is from cloud-guides, user also on cloud page
    mockZillizRequest.mockResolvedValue([
      makeHit({page_urls_visited: ['/docs/collections']}),
    ]);

    const result = await findSemanticCacheHit(
      'How do I create a collection?',
      'section != "byoc-guides"',
    );

    expect(result).not.toBeNull();
  });

  it('handles malformed messages JSON gracefully', async () => {
    mockZillizRequest.mockResolvedValue([
      makeHit({messages: 'not valid json'}),
    ]);

    const result = await findSemanticCacheHit('test');

    expect(result).toBeNull();
  });

  it('handles messages with no assistant response', async () => {
    mockZillizRequest.mockResolvedValue([
      makeHit({messages: JSON.stringify([{role: 'user', content: 'hello'}])}),
    ]);

    const result = await findSemanticCacheHit('test');

    expect(result).toBeNull();
  });

  it('derives readable titles from source URLs', async () => {
    mockZillizRequest.mockResolvedValue([
      makeHit({
        sources_returned: [
          'https://docs.zilliz.com/docs/quick-start',
          'https://docs.zilliz.com/docs/manage-collections.md',
        ],
      }),
    ]);

    const result = await findSemanticCacheHit('test');

    expect(result!.sources[0].title).toBe('Quick Start');
    expect(result!.sources[1].title).toBe('Manage Collections');
  });
});
