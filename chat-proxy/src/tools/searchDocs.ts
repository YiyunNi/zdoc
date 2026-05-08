import {z} from 'zod';
import {tool} from 'ai';
import {searchDocs, computeRetrievalConfidence} from '../rag.js';
import {truncateForModel} from './index.js';

export interface RagToolContext {
  sectionFilter?: string;
  queryEmbedding?: number[] | null;
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
      const results = await searchDocs(query, topK, context.sectionFilter, undefined, undefined, context.queryEmbedding);
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
