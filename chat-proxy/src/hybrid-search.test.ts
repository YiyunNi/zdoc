import {describe, it, expect} from 'vitest';
import {fuseWithRRF} from './rag.js';
import type {SearchResult} from './rag.js';

function makeResult(id: string, url: string, score: number): SearchResult {
  return {
    id,
    doc_url: url,
    doc_url_md: `${url}.md`,
    doc_title: `Title for ${url}`,
    section: 'cloud-guides',
    content: `Content for ${url}`,
    score,
    weight: 1.0,
    contextScore: score,
  };
}

describe('fuseWithRRF', () => {
  it('fuses BM25 and vector results using RRF', () => {
    const bm25Results: SearchResult[] = [
      makeResult('1', '/doc1', 0.9),
      makeResult('2', '/doc2', 0.8),
      makeResult('3', '/doc3', 0.7),
    ];
    const vectorResults: SearchResult[] = [
      makeResult('2', '/doc2', 0.85),
      makeResult('4', '/doc4', 0.75),
      makeResult('5', '/doc5', 0.65),
    ];

    const fused = fuseWithRRF(bm25Results, vectorResults, 5);

    expect(fused.length).toBe(5);
    // doc2 appears in both, should be ranked highest due to RRF
    const doc2Index = fused.findIndex(r => r.doc_url === '/doc2');
    expect(doc2Index).toBe(0);
  });

  it('deduplicates by URL, keeping highest RRF score', () => {
    const bm25Results: SearchResult[] = [
      makeResult('1', '/doc1', 0.9),
      makeResult('2', '/doc2', 0.8),
    ];
    const vectorResults: SearchResult[] = [
      makeResult('3', '/doc1', 0.7), // Same URL as bm25 result 1
      makeResult('4', '/doc3', 0.6),
    ];

    const fused = fuseWithRRF(bm25Results, vectorResults, 3);

    // Should have 3 unique URLs: /doc1, /doc2, /doc3
    const urls = new Set(fused.map(r => r.doc_url));
    expect(urls.size).toBe(3);
    expect(urls.has('/doc1')).toBe(true);
  });

  it('returns only BM25 results when vector is empty', () => {
    const bm25Results: SearchResult[] = [
      makeResult('1', '/doc1', 0.9),
      makeResult('2', '/doc2', 0.8),
    ];
    const vectorResults: SearchResult[] = [];

    const fused = fuseWithRRF(bm25Results, vectorResults, 2);
    expect(fused.length).toBe(2);
    expect(fused[0].doc_url).toBe('/doc1');
    expect(fused[1].doc_url).toBe('/doc2');
  });

  it('respects topK limit', () => {
    const bm25Results: SearchResult[] = [
      makeResult('1', '/doc1', 0.9),
      makeResult('2', '/doc2', 0.8),
      makeResult('3', '/doc3', 0.7),
    ];
    const vectorResults: SearchResult[] = [
      makeResult('4', '/doc4', 0.6),
      makeResult('5', '/doc5', 0.5),
    ];

    const fused = fuseWithRRF(bm25Results, vectorResults, 3);
    expect(fused.length).toBe(3);
  });

  it('handles empty inputs', () => {
    const fused = fuseWithRRF([], [], 5);
    expect(fused.length).toBe(0);
  });
});
