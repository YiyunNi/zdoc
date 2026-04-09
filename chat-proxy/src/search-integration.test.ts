import {describe, it, expect, vi, beforeEach} from 'vitest';
import {searchDocs} from './rag.js';
import type {SearchResult} from './rag.js';

describe('searchDocs', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('is a synchronous function', () => {
    // searchDocs is now sync (FTS5 via better-sqlite3)
    expect(typeof searchDocs).toBe('function');
    // Returns an array (not a Promise) when index is not loaded
    const result = searchDocs('test query');
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns empty array when index is not ready', () => {
    const results = searchDocs('test query', 5);
    expect(results).toEqual([]);
  });
});
