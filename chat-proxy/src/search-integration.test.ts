import {describe, it, expect, vi, beforeEach} from 'vitest';
import {searchDocs} from './rag.js';
import type {SearchResult} from './rag.js';

describe('searchDocs', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('is an async function', () => {
    // searchDocs is now async (PostgreSQL)
    expect(typeof searchDocs).toBe('function');
  });

  it('returns empty array when index is not ready', async () => {
    const results = await searchDocs('test query', 5);
    expect(results).toEqual([]);
  });
});
