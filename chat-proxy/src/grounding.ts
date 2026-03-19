import type {SearchResult} from './rag.js';
import type {Source} from './types.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GroundingCitation {
  paragraphIndex: number;
  sourceIndices: number[];
}

export interface GroundingResult {
  /** Sources that actually contributed to the response (re-indexed 0-based) */
  sources: Source[];
  /** Maps paragraph index → array of source indices (into sources array above) */
  citations: GroundingCitation[];
}

// ---------------------------------------------------------------------------
// Stop words (shared with rag.ts keyword search)
// ---------------------------------------------------------------------------

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'it', 'to', 'in', 'for', 'of', 'on', 'at', 'by',
  'and', 'or', 'but', 'not', 'with', 'from', 'as', 'this', 'that', 'be',
  'are', 'was', 'were', 'been', 'has', 'have', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'can', 'may', 'might', 'shall',
  'i', 'me', 'my', 'we', 'us', 'you', 'your', 'he', 'she', 'they', 'them',
  'what', 'which', 'who', 'whom', 'how', 'when', 'where', 'why',
  'if', 'then', 'so', 'because', 'about', 'up', 'out', 'just', 'also',
  'its', 'our', 'their', 'these', 'those', 'been', 'being', 'into',
  'than', 'too', 'very', 'more', 'most', 'such', 'only', 'other',
  'some', 'any', 'each', 'every', 'all', 'both', 'few', 'many',
  'use', 'used', 'using', 'like', 'make', 'made',
]);

// ---------------------------------------------------------------------------
// Tokenizer
// ---------------------------------------------------------------------------

function tokenize(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .split(/[\s.,;:!?'"()\[\]{}<>\/\\|@#$%^&*+=~`\-_]+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));
  return new Set(words);
}

// ---------------------------------------------------------------------------
// Paragraph classification
// ---------------------------------------------------------------------------

const HEADING_RE = /^#{1,6}\s/;
const CODE_BLOCK_RE = /^```/;

function isSkippable(para: string): boolean {
  const trimmed = para.trim();
  if (!trimmed) return true;

  // Headings
  if (HEADING_RE.test(trimmed)) return true;

  // Code blocks
  if (CODE_BLOCK_RE.test(trimmed)) return true;

  // Short paragraphs (greetings, transitions)
  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount < 10) return true;

  return false;
}

// ---------------------------------------------------------------------------
// Split response into paragraphs
// ---------------------------------------------------------------------------

function splitParagraphs(text: string): string[] {
  // Split on double newlines but keep code blocks together
  const parts: string[] = [];
  let current = '';
  let inCodeBlock = false;

  for (const line of text.split('\n')) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      current += line + '\n';
      continue;
    }
    if (inCodeBlock) {
      current += line + '\n';
      continue;
    }
    if (line.trim() === '' && current.trim()) {
      parts.push(current.trim());
      current = '';
    } else {
      current += line + '\n';
    }
  }
  if (current.trim()) parts.push(current.trim());

  return parts;
}

// ---------------------------------------------------------------------------
// Core: computeGrounding
// ---------------------------------------------------------------------------

const MIN_OVERLAP = 0.15;
const MAX_SOURCES_PER_PARAGRAPH = 2;

/**
 * Deterministically match response paragraphs to RAG source chunks
 * using keyword overlap. Returns filtered sources + citation map.
 */
export function computeGrounding(
  responseText: string,
  rawResults: SearchResult[],
  allSources: Source[],
): GroundingResult {
  if (!responseText.trim() || rawResults.length === 0) {
    return {sources: [], citations: []};
  }

  const paragraphs = splitParagraphs(responseText);
  if (paragraphs.length === 0) {
    return {sources: [], citations: []};
  }

  // Pre-tokenize all RAG chunks
  const chunkTokens = rawResults.map(r => ({
    tokens: tokenize(r.content),
    url: r.doc_url,
  }));

  // Track which source URLs are actually used
  const usedUrls = new Set<string>();
  const rawCitations: Array<{paragraphIndex: number; urls: string[]}> = [];

  for (let pi = 0; pi < paragraphs.length; pi++) {
    if (isSkippable(paragraphs[pi])) continue;

    const paraTokens = tokenize(paragraphs[pi]);
    if (paraTokens.size === 0) continue;

    // Score each chunk against this paragraph
    const scores: Array<{url: string; overlap: number}> = [];
    for (const chunk of chunkTokens) {
      let matchCount = 0;
      for (const word of paraTokens) {
        if (chunk.tokens.has(word)) matchCount++;
      }
      const overlap = matchCount / paraTokens.size;
      if (overlap >= MIN_OVERLAP) {
        scores.push({url: chunk.url, overlap});
      }
    }

    if (scores.length === 0) continue;

    // Deduplicate by URL, keeping best score
    const urlBest = new Map<string, number>();
    for (const s of scores) {
      const existing = urlBest.get(s.url);
      if (!existing || s.overlap > existing) {
        urlBest.set(s.url, s.overlap);
      }
    }

    // Sort by overlap, take top N
    const sorted = [...urlBest.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_SOURCES_PER_PARAGRAPH);

    const urls = sorted.map(([url]) => url);
    for (const url of urls) usedUrls.add(url);
    rawCitations.push({paragraphIndex: pi, urls});
  }

  if (usedUrls.size === 0) {
    return {sources: [], citations: []};
  }

  // Build filtered, re-indexed source list
  const filteredSources: Source[] = [];
  const urlToNewIndex = new Map<string, number>();

  for (const src of allSources) {
    if (usedUrls.has(src.url)) {
      urlToNewIndex.set(src.url, filteredSources.length);
      filteredSources.push(src);
    }
  }

  // Build citation map using new indices
  const citations: GroundingCitation[] = [];
  for (const raw of rawCitations) {
    const sourceIndices: number[] = [];
    for (const url of raw.urls) {
      const idx = urlToNewIndex.get(url);
      if (idx !== undefined) sourceIndices.push(idx);
    }
    if (sourceIndices.length > 0) {
      citations.push({paragraphIndex: raw.paragraphIndex, sourceIndices});
    }
  }

  return {sources: filteredSources, citations};
}
