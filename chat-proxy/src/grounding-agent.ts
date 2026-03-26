import {generateObject} from 'ai';
import {createOpenAI} from '@ai-sdk/openai';
import {z} from 'zod';
import {computeGrounding, type GroundingResult} from './grounding.js';
import type {SearchResult} from './rag.js';
import type {Source} from './types.js';

const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
const AI_API_KEY = process.env.AI_API_KEY || '';
const GROUNDING_MODEL = process.env.GROUNDING_MODEL || 'google/gemini-3.1-flash-lite-preview';

const provider = createOpenAI({baseURL: AI_BASE_URL, apiKey: AI_API_KEY});

const groundingSchema = z.object({
  selectedSources: z.array(z.object({
    index: z.number().describe('Index into the candidate sources array'),
    paragraphs: z.array(z.number()).describe('Paragraph indices this source supports'),
  })),
});

/**
 * Split response into non-empty paragraphs (matching grounding.ts logic).
 */
function splitParagraphs(text: string): string[] {
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

/**
 * Use an LLM to determine which candidate sources genuinely support the response.
 * Falls back to deterministic keyword-overlap grounding on failure.
 */
export async function groundWithLLM(
  fullText: string,
  candidateSources: Source[],
  allChunks: SearchResult[],
): Promise<GroundingResult> {
  if (!fullText.trim() || candidateSources.length === 0) {
    return {sources: [], citations: []};
  }

  const paragraphs = splitParagraphs(fullText);
  if (paragraphs.length === 0) {
    return {sources: [], citations: []};
  }

  // Build content snippets for each candidate source from chunks
  const sourceSnippets = candidateSources.map(src => {
    const chunk = allChunks.find(c => c.doc_url === src.url);
    const snippet = chunk?.content?.slice(0, 200) || '';
    return `"${src.title}" — ${snippet}`;
  });

  try {
    const numberedParagraphs = paragraphs
      .map((p, i) => `[${i}] ${p.slice(0, 300)}`)
      .join('\n\n');

    const numberedSources = sourceSnippets
      .map((s, i) => `[${i}] ${s}`)
      .join('\n');

    const result = await generateObject({
      model: provider(GROUNDING_MODEL),
      schema: groundingSchema,
      maxTokens: 300,
      prompt: `You are a source attribution agent for Zilliz Cloud documentation. Given a response and candidate sources, select ONLY the sources that genuinely support claims in the response.

Rules:
- An API reference doc (e.g., "Modify Cluster API") is NOT relevant to conceptual advice (e.g., "what cluster size do I need")
- A source must directly relate to the topic discussed, not just share keywords
- Select 0-5 sources maximum. It's better to return fewer, highly relevant sources than many loosely related ones
- For each selected source, list which paragraph indices it supports

## Response (${paragraphs.length} paragraphs)
${numberedParagraphs}

## Candidate Sources (${candidateSources.length})
${numberedSources}

Select genuinely relevant sources and map them to paragraphs.`,
    });

    // Convert LLM output to GroundingResult format
    const selected = result.object.selectedSources;
    if (selected.length === 0) {
      return {sources: [], citations: []};
    }

    // Filter and reindex sources
    const filteredSources: Source[] = [];
    const indexMap = new Map<number, number>(); // old index → new index

    for (const s of selected) {
      if (s.index >= 0 && s.index < candidateSources.length) {
        indexMap.set(s.index, filteredSources.length);
        filteredSources.push(candidateSources[s.index]);
      }
    }

    // Build citations with remapped indices
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

    console.log(`[Grounding] LLM selected ${filteredSources.length}/${candidateSources.length} sources, ${citations.length} citations`);
    return {sources: filteredSources, citations};
  } catch (err) {
    console.warn('[Grounding] LLM failed, falling back to keyword overlap:', err instanceof Error ? err.message : err);
    return computeGrounding(fullText, allChunks, candidateSources);
  }
}
