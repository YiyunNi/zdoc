import {generateObject} from 'ai';
import {z} from 'zod';
import {computeGrounding, splitParagraphs, type GroundingResult} from './grounding.js';
import type {SearchResult} from './rag.js';
import type {Source} from './types.js';
import {isApiRefSource} from './demotion.js';
import {saveTokenUsage} from './db.js';
import {resolveModel, createModelInstance} from './runtime-config.js';
import {makeTelemetry} from './telemetry.js';

const groundingSchema = z.object({
  selectedSources: z.array(z.object({
    index: z.number().describe('Index into the candidate sources array'),
    paragraphs: z.array(z.number()).describe('Paragraph indices this source supports'),
  })),
});

/**
 * Aggregate all chunks for a given source URL into a single snippet.
 */
function aggregateChunks(url: string, allChunks: SearchResult[]): string {
  const matching = allChunks.filter(c => c.doc_url === url);
  if (matching.length === 0) return '';
  return matching
    .slice(0, 3)
    .map(c => c.content.slice(0, 400))
    .join(' … ');
}

/**
 * Single-pass LLM source attribution.
 *
 * The LLM receives the full response text (split into paragraphs) and all
 * candidate sources (with multi-chunk snippets). It selects up to 5 sources
 * and maps each to the paragraph indices it supports.
 *
 * Falls back to deterministic keyword-overlap grounding when the LLM returns
 * zero sources or throws an error.
 */
export async function groundAtomically(
  fullText: string,
  candidateSources: Source[],
  allChunks: SearchResult[],
): Promise<GroundingResult> {
  if (!fullText.trim() || candidateSources.length === 0) {
    return {sources: [], citations: [], method: 'fallback'};
  }

  const paragraphs = splitParagraphs(fullText);
  if (paragraphs.length === 0) {
    return {sources: [], citations: [], method: 'fallback'};
  }

  // Build enriched source descriptions with multi-chunk snippets
  const sourceDescriptions = candidateSources.map((src, i) => {
    const section = src.section || 'docs';
    const isApiRef = isApiRefSource(src.url);
    const combinedSnippet = aggregateChunks(src.url, allChunks);
    const snippet = combinedSnippet.slice(0, 600);
    const tag = isApiRef ? ' [API REF]' : '';
    return `[${i}] "${src.title}" (${section})${tag} — ${snippet}`;
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
      experimental_telemetry: makeTelemetry('grounding'),
      prompt: `You are a source attribution agent for Zilliz Cloud documentation. Given a response and candidate sources, select ONLY the sources that genuinely support claims in the response.

Rules:
- Sources marked [API REF] are API endpoint references. Do NOT select them for conceptual questions (e.g., "what cluster size do I need?", "how does X work?", pricing, sizing, planning). Only select API refs if the response paragraph specifically describes an API call or endpoint.
- A source must directly relate to the topic discussed, not just share keywords
- Select 0-5 sources maximum. Fewer highly relevant sources is better than many loosely related ones
- For each selected source, list which paragraph indices [0..${paragraphs.length - 1}] it supports

## Response (${paragraphs.length} paragraphs)
${numberedParagraphs}

## Candidate Sources (${candidateSources.length})
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
      console.log('[Grounding] LLM selected 0 sources, falling back to keyword overlap');
      return computeGrounding(fullText, allChunks, candidateSources);
    }

    // Build filtered sources from selected indices
    const filteredSources: Source[] = [];
    const indexMap = new Map<number, number>(); // candidate index → new index in filteredSources

    for (const s of selected) {
      if (s.index >= 0 && s.index < candidateSources.length) {
        if (!indexMap.has(s.index)) {
          indexMap.set(s.index, filteredSources.length);
          filteredSources.push(candidateSources[s.index]);
        }
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

    citations.sort((a, b) => a.paragraphIndex - b.paragraphIndex);

    console.log(
      `[Grounding] method=llm selected=${filteredSources.length}/${candidateSources.length} citations=${citations.length}`,
    );
    return {sources: filteredSources, citations, method: 'llm'};
  } catch (err) {
    console.warn('[Grounding] LLM failed, falling back to keyword overlap:', err instanceof Error ? err.message : err);
    return computeGrounding(fullText, allChunks, candidateSources);
  }
}
