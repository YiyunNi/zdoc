import {describe, it, expect} from 'vitest';
import {computeConfidence, type ConfidenceInput} from './confidence.js';

function makeInput(overrides: Partial<ConfidenceInput> = {}): ConfidenceInput {
  return {
    toolsCalled: [],
    toolSources: [],
    fullText: '',
    ...overrides,
  };
}

describe('computeConfidence', () => {
  it('returns high for successful tool search + consistent sources + substantive response', () => {
    const result = computeConfidence(makeInput({
      toolsCalled: ['searchDocs', 'searchDocs'],
      toolSources: [
        {title: 'Collections', url: '/docs/collections', score: 0.75},
        {title: 'Collections Create', url: '/docs/collections/create', score: 0.73},
      ],
      fullText: 'To create a collection, use the following code:\n```python\nclient.create_collection(name="test")\n```\nThis creates a new collection with default settings.',
    }));
    expect(result.level).toBe('high');
    expect(result.score).toBeGreaterThanOrEqual(0.70);
  });

  it('forces low when LLM text expresses uncertainty (hard override)', () => {
    const result = computeConfidence(makeInput({
      toolsCalled: ['searchDocs'],
      toolSources: [
        {title: 'Doc A', url: '/docs/a', score: 0.75},
      ],
      fullText: "I'm not sure about that feature. The documentation doesn't seem to cover it.",
    }));
    expect(result.level).toBe('low');
  });

  it('returns medium for scattered sources + hedging', () => {
    const result = computeConfidence(makeInput({
      toolsCalled: ['searchDocs'],
      toolSources: [
        {title: 'A', url: '/docs/a', score: 0.63},
        {title: 'B', url: '/docs/b', score: 0.60},
        {title: 'C', url: '/docs/c', score: 0.58},
        {title: 'D', url: '/docs/d', score: 0.55},
      ],
      fullText: 'This might work. Perhaps you could try using the SDK. It possibly supports this, though it might depend on your version.',
    }));
    expect(result.level).toBe('medium');
  });

  it('returns low for no sources and short/empty response', () => {
    const result = computeConfidence(makeInput({
      fullText: 'Ok',
    }));
    expect(result.level).toBe('low');
  });

  it('tools with multiple searches and good results boost score', () => {
    const withoutTools = computeConfidence(makeInput({
      toolsCalled: [],
      toolSources: [],
      fullText: 'Here is how to do it:\n```python\nfrom pymilvus import Collection\nc = Collection("demo")\nc.insert(data)\n```\nSee the [API reference](/ref/api) for more options.',
    }));
    const withTools = computeConfidence(makeInput({
      toolsCalled: ['searchDocs', 'getCodeExample'],
      toolSources: [
        {title: 'API Ref', url: '/ref/api', score: 0.72},
        {title: 'Example', url: '/examples/basic', score: 0.68},
      ],
      fullText: 'Here is how to do it:\n```python\nfrom pymilvus import Collection\nc = Collection("demo")\nc.insert(data)\n```\nSee the [API reference](/ref/api) for more options.',
    }));
    // Tools should meaningfully boost the score
    expect(withTools.score).toBeGreaterThan(withoutTools.score);
    expect(withTools.level).not.toBe('low');
  });

  it('boosts score when page context matches retrieved sources', () => {
    const baseInput = makeInput({
      toolsCalled: ['searchDocs'],
      toolSources: [
        {title: 'Search', url: '/docs/search', score: 0.62},
        {title: 'Search Params', url: '/docs/search/params', score: 0.60},
      ],
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

  it('populates all 4 breakdown signals', () => {
    const result = computeConfidence(makeInput({
      toolsCalled: ['searchDocs'],
      toolSources: [{title: 'A', url: '/docs/a', score: 0.65}],
      fullText: 'Here is the answer.',
    }));
    const {breakdown} = result;
    expect(breakdown).toHaveProperty('toolSuccess');
    expect(breakdown).toHaveProperty('sourceAgreement');
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
      toolsCalled: [],
      toolSources: [],
      fullText: longText,
    }));
    expect(result.level).toBe('low');
  });

  it('caps at medium when no tool sources even with high substance', () => {
    const result = computeConfidence(makeInput({
      toolsCalled: [],
      toolSources: [],
      fullText: 'Here is a detailed answer:\n```python\nprint("hello")\n```\nCheck the [docs](/docs) for more.',
    }));
    // Should not be high without any sources
    expect(result.level).not.toBe('high');
  });
});
