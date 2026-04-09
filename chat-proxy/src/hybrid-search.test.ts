import {describe, it, expect} from 'vitest';
import type {SearchResult} from './rag.js';

// fuseWithRRF was removed in the FTS5 migration.
// These tests are kept as documentation of the old RRF behavior.

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

describe('fuseWithRRF (removed)', () => {
  it('placeholder — RRF fusion replaced by FTS5', () => {
    // fuseWithRRF was removed when BM25/vector hybrid search was replaced by FTS5.
    expect(true).toBe(true);
  });
});
