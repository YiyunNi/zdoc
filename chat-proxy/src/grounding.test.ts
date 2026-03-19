import {describe, it, expect} from 'vitest';
import {computeGrounding} from './grounding.js';
import type {SearchResult} from './rag.js';
import type {Source} from './types.js';

function makeResult(overrides: Partial<SearchResult> = {}): SearchResult {
  return {
    id: 'chunk-1',
    doc_url: 'https://docs.zilliz.com/test',
    doc_url_md: 'https://docs.zilliz.com/test.md',
    doc_title: 'Test Doc',
    section: 'cloud-guides',
    content: 'Milvus supports vector similarity search using HNSW and IVF_FLAT index types for high-performance approximate nearest neighbor queries.',
    score: 0.85,
    ...overrides,
  };
}

function makeSource(overrides: Partial<Source> = {}): Source {
  return {
    title: 'Test Doc',
    url: 'https://docs.zilliz.com/test',
    score: 0.85,
    ...overrides,
  };
}

describe('computeGrounding', () => {
  it('matches paragraphs with clear source overlap to citations', () => {
    const response = `Milvus supports vector similarity search using HNSW and IVF_FLAT index types for high-performance approximate nearest neighbor queries.

This allows you to find the most similar items in your dataset with low latency and high recall.`;

    const rawResults = [makeResult()];
    const sources = [makeSource()];

    const result = computeGrounding(response, rawResults, sources);

    expect(result.sources.length).toBeGreaterThan(0);
    expect(result.citations.length).toBeGreaterThan(0);
    // First paragraph should cite the source
    expect(result.citations[0].sourceIndices).toContain(0);
  });

  it('skips short paragraphs (greetings, transitions)', () => {
    const response = `Sure, I can help!

Milvus supports vector similarity search using HNSW and IVF_FLAT index types for high-performance approximate nearest neighbor queries in large-scale datasets.`;

    const rawResults = [makeResult()];
    const sources = [makeSource()];

    const result = computeGrounding(response, rawResults, sources);

    // Should not have a citation for paragraph 0 ("Sure, I can help!")
    const firstParaCitation = result.citations.find(c => c.paragraphIndex === 0);
    expect(firstParaCitation).toBeUndefined();
  });

  it('skips headings', () => {
    const response = `## Vector Search

Milvus supports vector similarity search using HNSW and IVF_FLAT index types for high-performance approximate nearest neighbor queries in large datasets.`;

    const rawResults = [makeResult()];
    const sources = [makeSource()];

    const result = computeGrounding(response, rawResults, sources);

    const headingCitation = result.citations.find(c => c.paragraphIndex === 0);
    expect(headingCitation).toBeUndefined();
  });

  it('filters out sources with no overlap', () => {
    const response = `Python is a popular programming language used for data science and machine learning applications across many different industries worldwide.

It provides excellent libraries for scientific computing and numerical analysis.`;

    const rawResults = [makeResult({
      content: 'Milvus supports HNSW and IVF_FLAT index types for vector similarity search.',
      doc_url: 'https://docs.zilliz.com/indexes',
    })];
    const sources = [makeSource({url: 'https://docs.zilliz.com/indexes', title: 'Index Types'})];

    const result = computeGrounding(response, rawResults, sources);

    expect(result.sources).toHaveLength(0);
    expect(result.citations).toHaveLength(0);
  });

  it('returns top matches when multiple sources match one paragraph', () => {
    const response = `Milvus supports vector similarity search using HNSW and IVF_FLAT index types. You can configure collection schemas with dynamic fields for flexible data modeling in production.`;

    const rawResults = [
      makeResult({
        id: 'chunk-1',
        doc_url: 'https://docs.zilliz.com/indexes',
        doc_title: 'Index Types',
        content: 'Milvus supports vector similarity search using HNSW and IVF_FLAT index types for approximate nearest neighbor queries.',
      }),
      makeResult({
        id: 'chunk-2',
        doc_url: 'https://docs.zilliz.com/schema',
        doc_title: 'Schema Design',
        content: 'Configure collection schemas with dynamic fields for flexible data modeling in your Milvus deployment.',
      }),
    ];
    const sources = [
      makeSource({url: 'https://docs.zilliz.com/indexes', title: 'Index Types'}),
      makeSource({url: 'https://docs.zilliz.com/schema', title: 'Schema Design'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    // Should have citations and at most 2 sources per paragraph
    expect(result.citations.length).toBeGreaterThan(0);
    for (const c of result.citations) {
      expect(c.sourceIndices.length).toBeLessThanOrEqual(2);
    }
  });

  it('returns empty for empty response', () => {
    const result = computeGrounding('', [makeResult()], [makeSource()]);
    expect(result.sources).toHaveLength(0);
    expect(result.citations).toHaveLength(0);
  });

  it('returns empty when no RAG results', () => {
    const result = computeGrounding('Some response text with enough words to pass the minimum.', [], []);
    expect(result.sources).toHaveLength(0);
    expect(result.citations).toHaveLength(0);
  });

  it('skips code blocks', () => {
    const response = `Here is an example:

\`\`\`python
from pymilvus import Collection
collection = Collection("test")
results = collection.search(vectors, "embedding", params)
\`\`\`

The search function returns the nearest neighbors based on the configured index type.`;

    const rawResults = [makeResult({
      content: 'The pymilvus Collection class provides search functionality for finding nearest neighbors using configured vector index types.',
    })];
    const sources = [makeSource()];

    const result = computeGrounding(response, rawResults, sources);

    // Code block paragraph should not be cited
    const codeBlockCitations = result.citations.filter(c => {
      const para = response.split(/\n\n+/);
      // The code block is the middle paragraph
      return para[c.paragraphIndex]?.includes('```');
    });
    expect(codeBlockCitations).toHaveLength(0);
  });

  it('re-indexes sources correctly when some are filtered out', () => {
    const response = `Milvus supports vector similarity search using HNSW and IVF_FLAT index types for high-performance approximate nearest neighbor queries in large datasets.`;

    const rawResults = [
      makeResult({
        doc_url: 'https://docs.zilliz.com/indexes',
        content: 'Milvus supports vector similarity search using HNSW and IVF_FLAT index types for approximate nearest neighbor queries.',
      }),
    ];
    const sources = [
      makeSource({url: 'https://docs.zilliz.com/unrelated', title: 'Unrelated Doc'}),
      makeSource({url: 'https://docs.zilliz.com/indexes', title: 'Index Types'}),
      makeSource({url: 'https://docs.zilliz.com/also-unrelated', title: 'Also Unrelated'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    // Only the matching source should be in the filtered list
    expect(result.sources).toHaveLength(1);
    expect(result.sources[0].url).toBe('https://docs.zilliz.com/indexes');
    // Citations should reference index 0 (re-indexed)
    expect(result.citations[0].sourceIndices).toContain(0);
  });

  it('handles different paragraphs citing different sources', () => {
    const response = `Milvus supports vector similarity search using HNSW and IVF_FLAT index types for high-performance approximate nearest neighbor queries in datasets.

Zilliz Cloud provides serverless deployment options with automatic scaling, managed infrastructure, and built-in monitoring for production workloads.`;

    const rawResults = [
      makeResult({
        doc_url: 'https://docs.zilliz.com/indexes',
        content: 'Milvus supports vector similarity search using HNSW and IVF_FLAT index types for approximate nearest neighbor queries.',
      }),
      makeResult({
        doc_url: 'https://docs.zilliz.com/serverless',
        content: 'Zilliz Cloud provides serverless deployment options with automatic scaling and built-in monitoring for production workloads.',
      }),
    ];
    const sources = [
      makeSource({url: 'https://docs.zilliz.com/indexes', title: 'Index Types'}),
      makeSource({url: 'https://docs.zilliz.com/serverless', title: 'Serverless'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    expect(result.sources.length).toBe(2);
    expect(result.citations.length).toBe(2);

    // Different paragraphs should cite different sources
    const para0Sources = result.citations.find(c => c.paragraphIndex === 0)?.sourceIndices;
    const para1Sources = result.citations.find(c => c.paragraphIndex === 1)?.sourceIndices;
    expect(para0Sources).toBeDefined();
    expect(para1Sources).toBeDefined();
  });
});
