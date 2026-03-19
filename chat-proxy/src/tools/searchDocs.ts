import {z} from 'zod';
import {tool} from 'ai';
import {searchDocs, computeRetrievalConfidence, getActiveSectionFilter, type SearchResult} from '../rag.js';

export const searchDocsTool = tool({
  description: 'Search the Zilliz Cloud documentation using semantic search. Returns relevant documentation chunks with similarity scores.',
  parameters: z.object({
    query: z.string().describe('The search query to find relevant documentation'),
    topK: z.number().optional().default(6).describe('Number of results to return'),
  }),
  execute: async ({query, topK}) => {
    const results = await searchDocs(query, topK, getActiveSectionFilter());
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
