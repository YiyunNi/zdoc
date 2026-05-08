import {generateObject} from 'ai';
import {z} from 'zod';
import {resolveModel, createModelInstance} from './runtime-config.js';
import {makeTelemetry} from './telemetry.js';
import {bedrockAiSdkMaxRetries} from './bedrock-guard.js';

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

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Extract subject-relation-object triplets from a batch of text chunks.
 *
 * Processes multiple chunks in a single LLM call to amortize latency.
 * Returns a map of chunkIndex → triplet array.
 * Retries on transient failures and throws after exhausting retries so
 * callers can decide whether to degrade gracefully.
 */
export async function extractTripletsBatch(
  chunks: string[],
  retries = 3,
): Promise<Map<number, Array<{subject: string; relation: string; object: string}>>> {
  const result = new Map<number, Array<{subject: string; relation: string; object: string}>>();
  if (!chunks.length) return result;

  const numberedChunks = chunks
    .map((text, i) => `--- Chunk ${i} ---\n${text.slice(0, 1200)}`)
    .join('\n\n');

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resolvedModel = await resolveModel('grounding');

      const llmResult = await generateObject({
        model: await createModelInstance(resolvedModel),
        maxRetries: bedrockAiSdkMaxRetries(resolvedModel.provider),
        schema: batchTripletSchema,
        maxOutputTokens: 4096,
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

      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[TripletExtract] Attempt ${attempt + 1}/${retries + 1} failed:`, msg);
      if (attempt < retries) {
        const delay = 1000 * Math.pow(2, attempt);
        await sleep(delay);
      } else {
        throw new Error(`Triplet extraction failed after ${retries + 1} attempts: ${msg}`);
      }
    }
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
