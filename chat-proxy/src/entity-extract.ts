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

/**
 * Extract named entities (products, technologies, concepts, features)
 * from a user query using a lightweight LLM call.
 *
 * Results are cached for 1 hour to avoid repeated extraction.
 */
export async function extractEntities(query: string): Promise<string[]> {
  if (!query || query.trim().length === 0) return [];

  const normalized = query.trim().toLowerCase();
  const cached = cache.get(normalized);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.entities;
  }

  try {
    const resolvedModel = await resolveModel('rewrite');
    const result = await generateObject({
      model: createModelInstance(resolvedModel),
      schema: entitySchema,
      maxOutputTokens: 200,
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
    console.warn('[EntityExtract] Failed:', err instanceof Error ? err.message : err);
    return [];
  }
}
