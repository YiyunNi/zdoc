import {describe, it, expect} from 'vitest';
import type {SearchResult} from './rag.js';
import {fuseWithRRF} from './rag.js';

function makeResult(id: string, url: string, score: number, section = 'cloud-guides'): SearchResult {
  return {
    id,
    doc_url: url,
    doc_url_md: `${url}.md`,
    doc_title: `Title for ${id}`,
    section,
    content: `Content for ${id}`,
    score,
    weight: 1.0,
    contextScore: score,
  };
}

describe('fuseWithRRF', () => {
  it('returns empty when both lists are empty', () => {
    const result = fuseWithRRF([], [], 6);
    expect(result).toEqual([]);
  });

  it('returns FTS-only results when vector list is empty', () => {
    const fts = [makeResult('1', '/a', 0.9), makeResult('2', '/b', 0.7)];
    const result = fuseWithRRF(fts, [], 6);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1'); // rank 1 in FTS, highest RRF score
  });

  it('returns vector-only results when FTS list is empty', () => {
    const vec = [makeResult('1', '/a', 0.95), makeResult('2', '/b', 0.8)];
    const result = fuseWithRRF([], vec, 6);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
  });

  it('boosts documents found by both FTS and vector', () => {
    const fts = [makeResult('1', '/a', 0.9), makeResult('2', '/b', 0.8)];
    const vec = [makeResult('2', '/b', 0.95), makeResult('3', '/c', 0.7)];

    const result = fuseWithRRF(fts, vec, 6);

    // Doc '2' appears in both lists: score = 1/(60+2) + 1/(60+1) = highest
    expect(result[0].id).toBe('2');
    expect(result).toHaveLength(3);
  });

  it('respects topK limit', () => {
    const fts = Array.from({length: 10}, (_, i) => makeResult(`fts-${i}`, `/f${i}`, 0.9 - i * 0.05));
    const vec = Array.from({length: 10}, (_, i) => makeResult(`vec-${i}`, `/v${i}`, 0.9 - i * 0.05));

    const result = fuseWithRRF(fts, vec, 5);
    expect(result).toHaveLength(5);
  });

  it('uses correct RRF score formula with k=60', () => {
    const fts = [makeResult('1', '/a', 0.9)];
    const vec = [makeResult('1', '/a', 0.95)];

    const result = fuseWithRRF(fts, vec, 6);

    // Doc '1' is rank 1 in both lists: score = 1/(60+1) + 1/(60+1) = 2/61
    expect(result).toHaveLength(1);
    expect(result[0].score).toBeCloseTo(2 / 61, 10);
  });

  it('deduplicates by id, merging fields from FTS result', () => {
    const fts = [makeResult('1', '/a', 0.9, 'cloud-guides')];
    const vec = [makeResult('1', '/a', 0.95, 'byoc-guides')];

    const result = fuseWithRRF(fts, vec, 6);

    expect(result).toHaveLength(1);
    // Content/title/url come from the FTS result (first list)
    expect(result[0].doc_url).toBe('/a');
    expect(result[0].section).toBe('cloud-guides');
  });

  it('preserves descending score order', () => {
    const fts = [makeResult('a', '/a', 0.9), makeResult('b', '/b', 0.8), makeResult('c', '/c', 0.7)];
    const vec = [makeResult('b', '/b', 0.95), makeResult('a', '/a', 0.85), makeResult('d', '/d', 0.6)];

    const result = fuseWithRRF(fts, vec, 6);

    const scores = result.map(r => r.score);
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeLessThanOrEqual(scores[i - 1]);
    }
  });
});

describe('setQueryEmbedding / getQueryEmbedding', () => {
  it('stores and retrieves an embedding', async () => {
    const {setQueryEmbedding, getQueryEmbedding} = await import('./rag.js');
    const testEmbedding = [0.1, 0.2, 0.3];
    setQueryEmbedding(testEmbedding);
    expect(getQueryEmbedding()).toEqual(testEmbedding);
    setQueryEmbedding(null);
    expect(getQueryEmbedding()).toBeNull();
  });

  it('resets between calls', async () => {
    const {setQueryEmbedding, getQueryEmbedding} = await import('./rag.js');
    setQueryEmbedding([1, 2, 3]);
    expect(getQueryEmbedding()).toEqual([1, 2, 3]);
    setQueryEmbedding(null);
    expect(getQueryEmbedding()).toBeNull();
  });
});
