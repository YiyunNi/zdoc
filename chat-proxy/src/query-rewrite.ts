import {generateObject} from 'ai';
import {z} from 'zod';
import {resolveModel, createModelInstance} from './runtime-config.js';
import {makeTelemetry} from './telemetry.js';
import {bedrockAiSdkMaxRetries} from './bedrock-guard.js';

const rewriteSchema = z.object({
  searchQuery: z.string().describe('Rewritten query optimized for keyword search'),
});

/**
 * Extract JSON from LLM response text, handling cases where the model
 * wraps JSON in markdown code blocks or adds explanatory text.
 */
function extractJsonFromResponse(text: string): unknown {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch { /* continue */ }

  // Try extracting from markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch { /* continue */ }
  }

  // Try finding JSON object in text
  const jsonMatch = text.match(/\{[\s\S]*"searchQuery"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch { /* continue */ }
  }

  throw new Error('Invalid JSON response');
}

/**
 * Rewrite a user query into search-optimized terms for BM25 retrieval.
 * Falls back to the original query on failure.
 */
export async function rewriteQuery(question: string, retries = 1): Promise<string> {
  // Skip rewrite for very short or already-technical queries
  const words = question.trim().split(/\s+/);
  if (words.length <= 2) return question;

  const resolvedModel = await resolveModel('rewrite');

  try {
    const result = await generateObject({
      model: await createModelInstance(resolvedModel),
      maxRetries: bedrockAiSdkMaxRetries(resolvedModel.provider),
      schema: rewriteSchema,
      maxOutputTokens: 100,
      experimental_telemetry: makeTelemetry('query-rewrite'),
      prompt: `You are a search query optimizer for Zilliz Cloud / Milvus documentation.

Rewrite the user's question into a keyword search query that will find the most relevant documentation pages. Add technical synonyms, expand abbreviations, and include terms that documentation would use. Keep the rewritten query under 20 words. Output ONLY valid JSON with the format: {"searchQuery": "your query here"}

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
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[Rewrite] Failed (${errMsg}), using original query`);

    // Retry once with a simpler prompt that emphasizes JSON-only output
    if (retries > 0) {
      try {
        const {generateText} = await import('ai');
        const textResult = await generateText({
          model: await createModelInstance(resolvedModel),
          maxRetries: bedrockAiSdkMaxRetries(resolvedModel.provider),
          maxOutputTokens: 80,
          temperature: 0,
          experimental_telemetry: makeTelemetry('query-rewrite-retry'),
          prompt: `Output ONLY a JSON object with exactly this format: {"searchQuery": "query"}. No explanation, no markdown.

Rewrite this query for documentation search: "${question}"`,
        });
        const parsed = extractJsonFromResponse(textResult.text);
        if (parsed && typeof parsed === 'object' && 'searchQuery' in parsed) {
          const rewritten = String((parsed as Record<string, unknown>).searchQuery).trim();
          if (rewritten.length > 0) {
            console.log(`[Rewrite] (retry) "${question.slice(0, 60)}" → "${rewritten.slice(0, 80)}"`);
            return rewritten;
          }
        }
      } catch (retryErr) {
        const retryMsg = retryErr instanceof Error ? retryErr.message : String(retryErr);
        console.warn(`[Rewrite] Retry also failed (${retryMsg})`);
      }
    }
    return question;
  }
}
