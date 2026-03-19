import {describe, it, expect} from 'vitest';
import {computeConfidence, type ConfidenceInput} from './confidence.js';

function makeInput(overrides: Partial<ConfidenceInput> = {}): ConfidenceInput {
  return {
    ragResults: [],
    ragSources: [],
    ragAvgScore: 0,
    toolsCalled: [],
    toolSources: [],
    fullText: '',
    ...overrides,
  };
}

describe('computeConfidence', () => {
  it('returns high for strong RAG + consistent sources + substantive response', () => {
    const result = computeConfidence(makeInput({
      ragResults: [
        {score: 0.75, doc_url: '/docs/collections'},
        {score: 0.73, doc_url: '/docs/collections'},
        {score: 0.71, doc_url: '/docs/collections/create'},
      ],
      ragSources: [{title: 'Collections', url: '/docs/collections'}],
      ragAvgScore: 0.73,
      fullText: 'To create a collection, use the following code:\n```python\nclient.create_collection(name="test")\n```\nThis creates a new collection with default settings.',
    }));
    expect(result.level).toBe('high');
    expect(result.score).toBeGreaterThanOrEqual(0.70);
  });

  it('forces low when LLM text expresses uncertainty (hard override)', () => {
    const result = computeConfidence(makeInput({
      ragResults: [
        {score: 0.75, doc_url: '/docs/a'},
        {score: 0.73, doc_url: '/docs/b'},
      ],
      ragAvgScore: 0.74,
      fullText: "I'm not sure about that feature. The documentation doesn't seem to cover it.",
    }));
    expect(result.level).toBe('low');
  });

  it('returns medium for decent RAG but scattered sources + hedging', () => {
    const result = computeConfidence(makeInput({
      ragResults: [
        {score: 0.63, doc_url: '/docs/a'},
        {score: 0.60, doc_url: '/docs/b'},
        {score: 0.58, doc_url: '/docs/c'},
        {score: 0.55, doc_url: '/docs/d'},
      ],
      ragAvgScore: 0.59,
      fullText: 'This might work. Perhaps you could try using the SDK. It possibly supports this, though it might depend on your version.',
    }));
    expect(result.level).toBe('medium');
  });

  it('returns low for no sources and short/empty response (no text-length bump)', () => {
    const result = computeConfidence(makeInput({
      ragResults: [],
      ragAvgScore: 0,
      fullText: 'Ok',
    }));
    expect(result.level).toBe('low');
  });

  it('tools boost weak RAG significantly toward high', () => {
    const withoutTools = computeConfidence(makeInput({
      ragResults: [{score: 0.45, doc_url: '/docs/a'}],
      ragAvgScore: 0.45,
      toolsCalled: [],
      toolSources: [],
      fullText: 'Here is how to do it:\n```python\nfrom pymilvus import Collection\nc = Collection("demo")\nc.insert(data)\n```\nSee the [API reference](/ref/api) for more options.',
    }));
    const withTools = computeConfidence(makeInput({
      ragResults: [{score: 0.45, doc_url: '/docs/a'}],
      ragAvgScore: 0.45,
      toolsCalled: ['searchDocs', 'getCodeExample'],
      toolSources: [
        {title: 'API Ref', url: '/ref/api', score: 0.72},
        {title: 'Example', url: '/examples/basic', score: 0.68},
      ],
      fullText: 'Here is how to do it:\n```python\nfrom pymilvus import Collection\nc = Collection("demo")\nc.insert(data)\n```\nSee the [API reference](/ref/api) for more options.',
    }));
    // Tools should meaningfully boost the score
    expect(withTools.score).toBeGreaterThan(withoutTools.score);
    expect(withTools.breakdown.toolSuccess).toBe(1.0);
    // With good tools the level should be at least medium (tool signal alone can't override weak RAG to high)
    expect(withTools.level).not.toBe('low');
  });

  it('boosts score when page context matches retrieved sources', () => {
    const baseInput = makeInput({
      ragResults: [
        {score: 0.62, doc_url: '/docs/search'},
        {score: 0.60, doc_url: '/docs/search/params'},
      ],
      ragAvgScore: 0.61,
      fullText: 'You can configure search parameters including the metric type and nprobe value for your search queries.',
    });

    const withoutPage = computeConfidence(baseInput);
    const withPage = computeConfidence({
      ...baseInput,
      pageUrl: '/docs/search',
      pageContext: 'Search parameters allow you to configure metric type, nprobe, and other search settings.',
    });

    expect(withPage.score).toBeGreaterThan(withoutPage.score);
  });

  it('populates all 5 breakdown signals', () => {
    const result = computeConfidence(makeInput({
      ragResults: [{score: 0.65, doc_url: '/docs/a'}],
      ragAvgScore: 0.65,
      fullText: 'Here is the answer.',
    }));
    const {breakdown} = result;
    expect(breakdown).toHaveProperty('retrievalQuality');
    expect(breakdown).toHaveProperty('sourceAgreement');
    expect(breakdown).toHaveProperty('toolSuccess');
    expect(breakdown).toHaveProperty('responseSubstance');
    expect(breakdown).toHaveProperty('pageContextAlignment');
    // All values should be between 0 and 1
    for (const val of Object.values(breakdown)) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(1);
    }
  });

  it('does not blindly bump long text with zero sources to medium+', () => {
    const longText = 'This is a very long response that goes into great detail about many topics. '.repeat(20);
    const result = computeConfidence(makeInput({
      ragResults: [],
      ragAvgScore: 0,
      toolsCalled: [],
      toolSources: [],
      fullText: longText,
    }));
    expect(result.level).toBe('low');
  });

  it('caps at medium when no RAG and no tool sources even with high substance', () => {
    const result = computeConfidence(makeInput({
      ragResults: [],
      ragAvgScore: 0,
      toolsCalled: [],
      toolSources: [],
      fullText: 'Here is a detailed answer:\n```python\nprint("hello")\n```\nCheck the [docs](/docs) for more.',
    }));
    // Should not be high without any sources
    expect(result.level).not.toBe('high');
  });
});
