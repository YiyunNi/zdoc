import {z} from 'zod';
import {tool} from 'ai';
import {searchDocsFTS5} from '../rag.js';
import type {RagToolContext} from './searchDocs.js';
import {truncateForModel} from './index.js';

export function createGetCodeExampleTool(context: RagToolContext = {}) {
  return tool({
    description: 'Search for code examples in the documentation for a specific topic and programming language.',
    inputSchema: z.object({
      topic: z.string().describe('The topic to find code examples for (e.g., "create collection", "vector search")'),
      language: z.enum(['python', 'node', 'java', 'go', 'rest']).describe('The programming language'),
    }),
    execute: async ({topic, language}) => {
      const query = `${topic} ${language} code example`;
      const results = await searchDocsFTS5(query, 4, context.sectionFilter);

      // Extract code blocks from results
      const codeBlocks: Array<{title: string; url: string; code: string}> = [];
      for (const r of results) {
        const codePattern = /```(?:python|javascript|typescript|java|go|bash|shell|curl|json)?\n([\s\S]*?)```/g;
        let match;
        while ((match = codePattern.exec(r.content)) !== null) {
          codeBlocks.push({
            title: r.doc_title,
            url: r.doc_url,
            code: match[1].trim(),
          });
        }
      }

      return {
        examples: codeBlocks.slice(0, 3).map(e => ({...e, code: truncateForModel(e.code, 800)})),
        relatedDocs: results.map(r => ({title: r.doc_title, url: r.doc_url})),
        language,
        topic,
      };
    },
  });
}

export const getCodeExampleTool = createGetCodeExampleTool();
