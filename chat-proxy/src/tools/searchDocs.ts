import {z} from 'zod';
import {tool} from 'ai';
import {searchDocs, computeRetrievalConfidence, getActiveSectionFilter} from '../rag.js';
import {rewriteQuery} from '../query-rewrite.js';

export const searchDocsTool = tool({
  description:
    'Search Zilliz Cloud / Milvus documentation using hybrid (keyword + semantic) search. ' +
    'Call this BEFORE answering any technical question — do NOT guess from training data. ' +
    'Use focused, specific queries rather than copying the full user question. ' +
    'Call multiple times with different queries for complex or multi-part questions.',
  inputSchema: z.object({
    query: z.string().describe('A focused keyword search query'),
    topK: z.number().optional().default(6).describe('Number of results to return'),
  }),
  execute: async ({query, topK}) => {
    // Rewrite query for better retrieval
    const optimizedQuery = await rewriteQuery(query);
    const results = await searchDocs(optimizedQuery, topK, getActiveSectionFilter());
    const confidence = computeRetrievalConfidence(results);

    return {
      results: results.map(r => ({
        title: r.doc_title,
        url: r.doc_url,
        section: r.section,
        content: r.content,
        score: r.score,
      })),
      confidence: confidence.level,
      avgScore: confidence.avgScore,
      totalResults: results.length,
    };
  },
});
