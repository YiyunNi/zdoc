import {generateObject} from 'ai';
import {z} from 'zod';
import {computeGrounding, splitParagraphs, type GroundingResult} from './grounding.js';
import type {SearchResult} from './rag.js';
import type {Source} from './types.js';
import {isApiRefSource} from './demotion.js';
import {saveTokenUsage} from './db.js';
import {resolveModel, createModelInstance} from './runtime-config.js';

const groundingSchema = z.object({
  selectedSources: z.array(z.object({
    index: z.number().describe('Index into the candidate sources array'),
    paragraphs: z.array(z.number()).describe('Paragraph indices this source supports'),
  })),
});

/**
 * Aggregate all chunks for a given source URL into a single snippet.
 * Uses filter (not find) to collect all matching chunks, fixing the
 * single-chunk-per-source bug in the previous implementation.
 */
function aggregateChunks(url: string, allChunks: SearchResult[]): string {
  const matching = allChunks.filter(c => c.doc_url === url);
  if (matching.length === 0) return '';
  // Take up to 3 chunks, 400 chars each, join with separator
  return matching
    .slice(0, 3)
    .map(c => c.content.slice(0, 400))
    .join(' … ');
}

/**
 * Atomic source attribution: IDF pre-filter → LLM re-rank.
 *
 * Pass 1 (done by caller): IDF scoring via scoreChunksPerParagraph() produces
 * pre-ranked candidate URLs per paragraph with relevance scores.
 *
 * Pass 2 (this function): LLM re-ranks those pre-filtered candidates using
 * enriched multi-chunk snippets and longer paragraph context.
 *
 * Paragraph-level fallback: if LLM returns 0 citations for a paragraph that
 * had IDF candidates, inject the top IDF candidate for that paragraph.
 *
 * Falls back to deterministic keyword-overlap grounding on LLM failure.
 */
export async function groundAtomically(
  fullText: string,
  candidateSources: Source[],
  allChunks: SearchResult[],
  idfScores: Map<number, Array<{url: string; score: number}>>,
): Promise<GroundingResult> {
  if (!fullText.trim() || candidateSources.length === 0) {
    return {sources: [], citations: [], method: 'fallback'};
  }

  const paragraphs = splitParagraphs(fullText);
  if (paragraphs.length === 0) {
    return {sources: [], citations: [], method: 'fallback'};
  }

  // Compute max IDF score per source URL across all paragraphs for pre-sorting
  const maxIdfPerUrl = new Map<string, number>();
  for (const candidates of idfScores.values()) {
    for (const {url, score} of candidates) {
      const existing = maxIdfPerUrl.get(url) ?? 0;
      if (score > existing) maxIdfPerUrl.set(url, score);
    }
  }

  // Sort candidates by max IDF score (best candidates first)
  const sortedCandidates = [...candidateSources].sort(
    (a, b) => (maxIdfPerUrl.get(b.url) ?? 0) - (maxIdfPerUrl.get(a.url) ?? 0),
  );

  // Build enriched source descriptions with multi-chunk snippets and IDF score
  const sourceDescriptions = sortedCandidates.map((src, i) => {
    const idfScore = maxIdfPerUrl.get(src.url) ?? 0;
    const section = src.section || 'docs';
    const isApiRef = isApiRefSource(src.url);
    const combinedSnippet = aggregateChunks(src.url, allChunks);
    const snippet = combinedSnippet.slice(0, 600);
    const tag = isApiRef ? ' [API REF]' : '';
    return `[${i}] "${src.title}" (${section})${tag} idf=${idfScore.toFixed(2)} — ${snippet}`;
  });

  try {
    const numberedParagraphs = paragraphs
      .map((p, i) => `[${i}] ${p.slice(0, 500)}`)
      .join('\n\n');

    const numberedSources = sourceDescriptions.join('\n');

    const resolvedModel = await resolveModel('grounding');
    const result = await generateObject({
      model: createModelInstance(resolvedModel),
      schema: groundingSchema,
      maxOutputTokens: 400,
      prompt: `You are a source attribution agent for Zilliz Cloud documentation. Given a response and candidate sources, select ONLY the sources that genuinely support claims in the response.

Rules:
- Sources are pre-ranked by keyword overlap (idf= score). Higher idf = more keyword overlap with the response.
- Sources marked [API REF] are API endpoint references. Do NOT select them for conceptual questions (e.g., "what cluster size do I need?", "how does X work?", pricing, sizing, planning). Only select API refs if the response paragraph specifically describes an API call or endpoint.
- A source must directly relate to the topic discussed, not just share keywords
- Select 0-5 sources maximum. Fewer highly relevant sources is better than many loosely related ones
- For each selected source, list which paragraph indices [0..${paragraphs.length - 1}] it supports

## Response (${paragraphs.length} paragraphs)
${numberedParagraphs}

## Candidate Sources (${sortedCandidates.length}, pre-ranked by keyword overlap)
${numberedSources}

Select genuinely relevant sources and map them to paragraphs.`,
    });

    const selected = result.object.selectedSources;

    // Persist grounding LLM token usage (fire-and-forget)
    try {
      const u = result.usage;
      if (u?.inputTokens != null && u?.outputTokens != null) {
        saveTokenUsage({
          model: resolvedModel.model,
          agentType: 'grounding',
          inputTokens: u.inputTokens,
          outputTokens: u.outputTokens,
          totalTokens: u.totalTokens ?? u.inputTokens + u.outputTokens,
          cachedInputTokens: u.cachedInputTokens ?? 0,
        }).catch(() => {});
      }
    } catch { /* fire-and-forget */ }

    if (selected.length === 0) {
      // LLM found nothing — still try paragraph-level IDF fallback before full deterministic
      console.log('[Grounding] LLM selected 0 sources, applying paragraph-level IDF fallback');
    }

    // Build index map from sorted candidate positions back to original source objects
    const filteredSources: Source[] = [];
    const indexMap = new Map<number, number>(); // sorted index → new index in filteredSources

    for (const s of selected) {
      if (s.index >= 0 && s.index < sortedCandidates.length) {
        indexMap.set(s.index, filteredSources.length);
        filteredSources.push(sortedCandidates[s.index]);
      }
    }

    // Build citations from LLM output
    const citations: {paragraphIndex: number; sourceIndices: number[]}[] = [];
    for (const s of selected) {
      const newIdx = indexMap.get(s.index);
      if (newIdx === undefined) continue;
      for (const pi of s.paragraphs) {
        if (pi < 0 || pi >= paragraphs.length) continue;
        const existing = citations.find(c => c.paragraphIndex === pi);
        if (existing) {
          if (!existing.sourceIndices.includes(newIdx)) {
            existing.sourceIndices.push(newIdx);
          }
        } else {
          citations.push({paragraphIndex: pi, sourceIndices: [newIdx]});
        }
      }
    }

    // Paragraph-level IDF fallback: for paragraphs with IDF candidates but no LLM citation,
    // inject the top IDF-scored candidate (if it exists in filteredSources)
    let usedIdfFallback = false;
    const citedParas = new Set(citations.map(c => c.paragraphIndex));

    for (const [pi, candidates] of idfScores.entries()) {
      if (citedParas.has(pi)) continue; // LLM already cited this paragraph
      // Find the top IDF candidate that is already in filteredSources
      for (const {url} of candidates) {
        const srcIdx = filteredSources.findIndex(s => s.url === url);
        if (srcIdx !== -1) {
          citations.push({paragraphIndex: pi, sourceIndices: [srcIdx]});
          usedIdfFallback = true;
          break;
        }
        // Candidate not yet in filteredSources — add it from sortedCandidates
        const src = sortedCandidates.find(s => s.url === url);
        if (src) {
          const newIdx = filteredSources.length;
          filteredSources.push(src);
          citations.push({paragraphIndex: pi, sourceIndices: [newIdx]});
          usedIdfFallback = true;
          break;
        }
      }
    }

    citations.sort((a, b) => a.paragraphIndex - b.paragraphIndex);

    const method = usedIdfFallback ? 'llm+idf-fallback' : 'llm';
    console.log(
      `[Grounding] method=${method} selected=${filteredSources.length}/${sortedCandidates.length} citations=${citations.length}`,
    );
    return {sources: filteredSources, citations, method};
  } catch (err) {
    console.warn('[Grounding] LLM failed, falling back to keyword overlap:', err instanceof Error ? err.message : err);
    return computeGrounding(fullText, allChunks, candidateSources);
  }
}
