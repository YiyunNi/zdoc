import {describe, it, expect} from 'vitest';
import {chunkText, extractTitle} from './utils.js';

describe('extractTitle', () => {
  it('extracts the first H1 title from markdown', () => {
    expect(extractTitle('# Hello\nContent')).toBe('Hello');
  });
});

describe('chunkText', () => {
  const CHUNK_SIZE_CHARS = 2000;
  const OVERLAP_CHARS = 200;

  it('returns a single chunk for short text (<2000 chars)', () => {
    const text = 'This is a short paragraph that fits in one chunk.';
    const chunks = chunkText(text);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe(text);
  });

  it('splits long text at paragraph boundaries into multiple chunks', () => {
    // Build text with multiple paragraphs totaling well over 2000 chars
    const paragraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.';
    const paragraphs = [];
    // Each paragraph is ~267 chars; 12 paragraphs = ~3200 chars
    for (let i = 0; i < 12; i++) {
      paragraphs.push(`${paragraph} (${i})`);
    }
    const text = paragraphs.join('\n\n');

    const chunks = chunkText(text);
    expect(chunks.length).toBeGreaterThan(1);
    // First chunk should be <= 2000 chars (no overlap prepended)
    expect(chunks[0].length).toBeLessThanOrEqual(CHUNK_SIZE_CHARS);
    // Subsequent chunks may exceed 2000 slightly due to overlap prefix,
    // but should stay within chunk size + overlap size
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(CHUNK_SIZE_CHARS + OVERLAP_CHARS + 2);
    }
  });

  it('includes overlapping content between consecutive chunks', () => {
    const paragraph = 'Paragraph content that is used to build up enough text for splitting. This sentence adds more length to each paragraph so we can reliably test overlap behavior across chunk boundaries.';
    const paragraphs = [];
    for (let i = 0; i < 20; i++) {
      paragraphs.push(`${paragraph} [${i}]`);
    }
    const text = paragraphs.join('\n\n');

    const chunks = chunkText(text);
    expect(chunks.length).toBeGreaterThan(1);

    // The last ~200 chars of chunk[0] should appear at the start of chunk[1]
    const endOfFirst = chunks[0].slice(-OVERLAP_CHARS);
    expect(chunks[1].startsWith(endOfFirst)).toBe(true);
  });

  it('handles a single giant paragraph without paragraph breaks', () => {
    // A single paragraph with no \n\n breaks produces one chunk
    // (the paragraph loop adds it all to currentChunk, then pushes once)
    const text = 'A'.repeat(5000);
    const chunks = chunkText(text);
    // Single paragraph → single chunk (exceeds size but no split points)
    expect(chunks.length).toBe(1);
    expect(chunks[0]).toBe(text);
  });

  it('returns an empty array for empty text', () => {
    const chunks = chunkText('');
    expect(chunks).toEqual([]);
  });
});
