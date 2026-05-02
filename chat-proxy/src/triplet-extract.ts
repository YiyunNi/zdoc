import {generateObject} from 'ai';
import {z} from 'zod';
import {resolveModel, createModelInstance} from './runtime-config.js';
import {makeTelemetry} from './telemetry.js';

const batchTripletSchema = z.object({
  chunks: z.array(z.object({
    chunkIndex: z.number().describe('Index of the chunk in the batch'),
    triplets: z.array(z.object({
      subject: z.string().describe('The entity or concept'),
      relation: z.string().describe('The relationship'),
      object: z.string().describe('The related entity or concept'),
    })).max(5).describe('Up to 5 triplets for this chunk'),
  })).describe('Triplet extraction results for each chunk'),
});

/**
 * Extract subject-relation-object triplets from a batch of text chunks.
 *
 * Processes multiple chunks in a single LLM call to amortize latency.
 * Returns a map of chunkIndex → triplet array.
 */
export async function extractTripletsBatch(
  chunks: string[],
): Promise<Map<number, Array<{subject: string; relation: string; object: string}>>> {
  const result = new Map<number, Array<{subject: string; relation: string; object: string}>>();
  if (!chunks.length) return result;

  try {
    const resolvedModel = await resolveModel('grounding');

    const numberedChunks = chunks
      .map((text, i) => `--- Chunk ${i} ---\n${text.slice(0, 1200)}`)
      .join('\n\n');

    const llmResult = await generateObject({
      model: createModelInstance(resolvedModel),
      schema: batchTripletSchema,
      maxOutputTokens: 800,
      experimental_telemetry: makeTelemetry('triplet-extract'),
      prompt: `Extract up to 5 key subject-relation-object triplets from each chunk below. Focus on technical concepts, product features, and relationships relevant to Zilliz Cloud / Milvus documentation.

${numberedChunks}

For each chunk, return its chunkIndex and a list of triplets. If a chunk has no meaningful triplets, return an empty array.`,
    });

    for (const chunkResult of llmResult.object.chunks) {
      const idx = chunkResult.chunkIndex;
      if (idx >= 0 && idx < chunks.length) {
        result.set(idx, chunkResult.triplets);
      }
    }
  } catch (err) {
    console.warn('[TripletExtract] Batch extraction failed:', err instanceof Error ? err.message : err);
  }

  return result;
}

/**
 * Flatten triplets into a deduplicated list of entity strings (subjects + objects).
 * Suitable for storing in a JSONB array column for filtering/boosting.
 */
export function flattenEntities(
  triplets: Array<{subject: string; relation: string; object: string}>,
): string[] {
  const set = new Set<string>();
  for (const t of triplets) {
    const s = t.subject.trim();
    const o = t.object.trim();
    if (s) set.add(s);
    if (o) set.add(o);
  }
  return [...set];
}
