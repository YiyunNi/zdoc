import {z} from 'zod';
import {tool} from 'ai';
import {searchDocs, computeRetrievalConfidence} from '../rag.js';
import {truncateForModel} from './index.js';

export interface RagToolContext {
  sectionFilter?: string;
  queryEmbedding?: number[] | null;
  queryEmbeddingPromise?: Promise<number[] | null>;
  queryEmbeddingBudgetMs?: number;
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<T>(resolve => {
    timeout = setTimeout(() => resolve(fallback), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeout) clearTimeout(timeout);
  });
}

async function resolveQueryEmbedding(context: RagToolContext): Promise<number[] | null | undefined> {
  if (context.queryEmbedding) return context.queryEmbedding;
  if (!context.queryEmbeddingPromise) return undefined;
  return withTimeout(context.queryEmbeddingPromise, context.queryEmbeddingBudgetMs ?? 75, null);
}

export function createSearchDocsTool(context: RagToolContext = {}) {
  return tool({
    description:
      'Search Zilliz Cloud / Milvus documentation using hybrid (keyword + semantic) search. ' +
      'Call this BEFORE answering any technical question — do NOT guess from training data. ' +
      'Use focused, specific keyword queries. Preserve exact API/function names such as create_collection, MilvusClient, AUTOINDEX, and metric types. ' +
      'Call multiple times with different queries for complex or multi-part questions.',
    inputSchema: z.object({
      query: z.string().describe('A focused keyword search query; include exact API/function names when relevant'),
      topK: z.number().optional().default(6).describe('Number of results to return'),
    }),
    execute: async ({query, topK}) => {
      const queryEmbedding = await resolveQueryEmbedding(context);
      const results = await searchDocs(query, topK, context.sectionFilter, undefined, undefined, queryEmbedding);
      const confidence = computeRetrievalConfidence(results);

      return {
        results: results.map(r => ({
          title: r.doc_title,
          url: r.doc_url,
          section: r.section,
          content: truncateForModel(r.content, 800),
          score: r.score,
        })),
        confidence: confidence.level,
        avgScore: confidence.avgScore,
        totalResults: results.length,
      };
    },
  });
}

export const searchDocsTool = createSearchDocsTool();
