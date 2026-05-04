import {generateObject} from 'ai';
import {z} from 'zod';
import {resolveModel, createModelInstance} from './runtime-config.js';
import {makeTelemetry} from './telemetry.js';

const entitySchema = z.object({
  entities: z.array(z.string()).describe('Named entities extracted from the query'),
});

interface CacheEntry {
  entities: string[];
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Extract named entities (products, technologies, concepts, features)
 * from a user query using a lightweight LLM call.
 *
 * Results are cached for 1 hour to avoid repeated extraction.
 * Retries on transient failures and falls back to empty array.
 */
export async function extractEntities(query: string, retries = 3): Promise<string[]> {
  if (!query || query.trim().length === 0) return [];

  const normalized = query.trim().toLowerCase();
  const cached = cache.get(normalized);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.entities;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resolvedModel = await resolveModel('rewrite');
      const result = await generateObject({
        model: await createModelInstance(resolvedModel),
        schema: entitySchema,
        maxOutputTokens: 500,
        experimental_telemetry: makeTelemetry('entity-extract'),
        prompt: `Extract named entities (products, technologies, people, concepts, features) from this query. Return them as a JSON array of strings. Be concise — only extract distinctive technical terms.

Query: "${query}"`,
      });

      const entities = result.object.entities
        .map(e => e.trim())
        .filter(e => e.length > 0 && e.length < 50);

      cache.set(normalized, {entities, expiresAt: Date.now() + CACHE_TTL_MS});
      return entities;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[EntityExtract] Attempt ${attempt + 1}/${retries + 1} failed:`, msg);
      if (attempt < retries) {
        const delay = 1000 * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  return [];
}
