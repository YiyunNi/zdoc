import {z} from 'zod';
import {tool} from 'ai';
import {listPages} from '../rag.js';
import type {RagToolContext} from './searchDocs.js';

export function createListPagesTool(context: RagToolContext = {}) {
  return tool({
    description:
      'List documentation pages by title keyword. Use this to discover what pages exist ' +
      'about a topic before searching for specific content. Returns titles and URLs only (no content).',
    inputSchema: z.object({
      titleContains: z.string().optional().describe('Filter pages whose title contains this keyword'),
      section: z.string().optional().describe('Filter by doc section: "cloud-guides", "byoc-guides", or "api-reference"'),
    }),
    execute: async ({titleContains, section}) => {
      const sectionFilter = section ? `section == "${section}"` : context.sectionFilter;
      const pages = await listPages(sectionFilter, titleContains);
      return {pages, totalResults: pages.length};
    },
  });
}

export const listPagesTool = createListPagesTool();
