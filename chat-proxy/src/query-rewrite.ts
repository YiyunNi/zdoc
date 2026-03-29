import {generateObject} from 'ai';
import {createOpenAI} from '@ai-sdk/openai';
import {z} from 'zod';

const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
const AI_API_KEY = process.env.AI_API_KEY || '';
const REWRITE_MODEL = process.env.REWRITE_MODEL || 'google/gemini-3.1-flash-lite-preview';

const provider = createOpenAI({baseURL: AI_BASE_URL, apiKey: AI_API_KEY});

const rewriteSchema = z.object({
  searchQuery: z.string().describe('Rewritten query optimized for keyword search'),
});

/**
 * Rewrite a user query into search-optimized terms for BM25 retrieval.
 * Falls back to the original query on failure.
 */
export async function rewriteQuery(question: string): Promise<string> {
  // Skip rewrite for very short or already-technical queries
  const words = question.trim().split(/\s+/);
  if (words.length <= 2) return question;

  try {
    const result = await generateObject({
      model: provider(REWRITE_MODEL),
      schema: rewriteSchema,
      maxTokens: 100,
      prompt: `You are a search query optimizer for Zilliz Cloud / Milvus documentation.

Rewrite the user's question into a keyword search query that will find the most relevant documentation pages. Add technical synonyms, expand abbreviations, and include terms that documentation would use. Keep the rewritten query under 20 words.

Examples:
- "What cluster size do I need?" → "CU estimation capacity planning cluster types sizing guide dedicated serverless"
- "why is my org frozen" → "organization suspended deactivated billing payment overdue inactive"
- "talk to sales" → "contact sales enterprise pricing demo booking"
- "how to do vector search" → "basic vector search ANN similarity search query example"
- "can I use rust" → "Rust SDK client REST API language support"
- "how much does it cost" → "pricing billing CU cost payment plan serverless dedicated free tier"

User question: ${question}`,
    });

    const rewritten = result.object.searchQuery.trim();
    if (rewritten.length > 0) {
      console.log(`[Rewrite] "${question.slice(0, 60)}" → "${rewritten.slice(0, 80)}"`);
      return rewritten;
    }
    return question;
  } catch (err) {
    console.warn('[Rewrite] Failed, using original query:', err instanceof Error ? err.message : err);
    return question;
  }
}
