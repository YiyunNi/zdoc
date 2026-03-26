import {z} from 'zod';
import {tool} from 'ai';
import {listPages, getActiveSectionFilter} from '../rag.js';

export const listPagesTool = tool({
  description:
    'List documentation pages by title keyword. Use this to discover what pages exist ' +
    'about a topic before searching for specific content. Returns titles and URLs only (no content).',
  parameters: z.object({
    titleContains: z.string().optional().describe('Filter pages whose title contains this keyword'),
    section: z.string().optional().describe('Filter by doc section: "cloud-guides", "byoc-guides", or "api-reference"'),
  }),
  execute: async ({titleContains, section}) => {
    const sectionFilter = section ? `section == "${section}"` : getActiveSectionFilter();
    const pages = await listPages(sectionFilter, titleContains);
    return {pages, totalResults: pages.length};
  },
});
