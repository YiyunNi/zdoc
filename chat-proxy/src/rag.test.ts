import {describe, it, expect} from 'vitest';
import {computeRetrievalConfidence, parseLlmsTxt} from './rag.js';
import type {SearchResult} from './rag.js';

function makeResult(score: number): SearchResult {
  return {
    id: '1',
    doc_url: 'https://docs.zilliz.com/test',
    doc_url_md: '/test.md',
    doc_title: 'Test',
    section: 'cloud-guides',
    content: 'Test content',
    score,
  };
}

describe('computeRetrievalConfidence', () => {
  it('returns low for empty results', () => {
    const {level, avgScore} = computeRetrievalConfidence([]);
    expect(level).toBe('low');
    expect(avgScore).toBe(0);
  });

  it('returns high when all scores >= 0.8', () => {
    const results = [makeResult(0.9), makeResult(0.85), makeResult(0.8)];
    const {level} = computeRetrievalConfidence(results);
    expect(level).toBe('high');
  });

  it('returns medium for average 0.5–0.8', () => {
    const results = [makeResult(0.7), makeResult(0.6), makeResult(0.5)];
    const {level} = computeRetrievalConfidence(results);
    expect(level).toBe('medium');
  });

  it('returns low for average < 0.5', () => {
    const results = [makeResult(0.3), makeResult(0.4), makeResult(0.2)];
    const {level} = computeRetrievalConfidence(results);
    expect(level).toBe('low');
  });

  it('boundary: exactly 0.8 average → high', () => {
    const results = [makeResult(0.8)];
    const {level} = computeRetrievalConfidence(results);
    expect(level).toBe('high');
  });

  it('boundary: exactly 0.5 average → medium', () => {
    const results = [makeResult(0.5)];
    const {level} = computeRetrievalConfidence(results);
    expect(level).toBe('medium');
  });

  it('calculates avgScore correctly', () => {
    const results = [makeResult(0.9), makeResult(0.7)];
    const {avgScore} = computeRetrievalConfidence(results);
    expect(avgScore).toBeCloseTo(0.8);
  });
});

describe('parseLlmsTxt', () => {
  it('parses entries with link format', () => {
    const input = `## [Create Collection](https://docs.zilliz.com/docs/create-collection)
- Type: Guide
- Description: Learn how to create a collection

## [Search](https://docs.zilliz.com/docs/search)
- Type: Guide
- Description: Perform vector search`;

    const entries = parseLlmsTxt(input, 'cloud-guides');
    expect(entries).toHaveLength(2);
    expect(entries[0].title).toBe('Create Collection');
    expect(entries[0].url).toBe('https://docs.zilliz.com/docs/create-collection');
    expect(entries[0].section).toBe('cloud-guides');
    expect(entries[0].type).toBe('Guide');
    expect(entries[0].description).toBe('Learn how to create a collection');
  });

  it('handles entries without links', () => {
    const input = `## Getting Started
- Type: Overview
- Description: Introduction to Milvus`;

    const entries = parseLlmsTxt(input, 'cloud-guides');
    expect(entries).toHaveLength(1);
    expect(entries[0].title).toBe('Getting Started');
    expect(entries[0].url).toBe('');
  });

  it('builds searchText for keyword matching', () => {
    const input = `## [SDK Guide](https://example.com)
- Type: Tutorial
- Languages: Python, Node
- Description: SDK integration guide`;

    const entries = parseLlmsTxt(input, 'cloud-guides');
    expect(entries[0].searchText).toContain('sdk guide');
    expect(entries[0].searchText).toContain('python');
    expect(entries[0].searchText).toContain('tutorial');
  });

  it('returns empty for empty input', () => {
    const entries = parseLlmsTxt('', 'cloud-guides');
    expect(entries).toHaveLength(0);
  });
});
