import {z} from 'zod';
import {tool} from 'ai';
import {fetchDocContent} from '../rag.js';

const DOCS_SITE_URL = (process.env.DOCS_SITE_URL || 'https://docs.zilliz.com').replace(/\/$/, '');

export const getPageContentTool = tool({
  description: 'Fetch the full content of a specific documentation page by its URL path. Use this when you need detailed information from a specific page.',
  inputSchema: z.object({
    url: z.string().describe('The documentation page URL path (e.g., /docs/tutorials/get-started/quickstart)'),
    maxChars: z.number().optional().default(8000).describe('Maximum characters to return'),
  }),
  execute: async ({url, maxChars}) => {
    let fullUrl = url;
    if (!fullUrl.startsWith('http')) {
      fullUrl = `${DOCS_SITE_URL}${fullUrl.startsWith('/') ? '' : '/'}${fullUrl}`;
    }

    const content = await fetchDocContent(fullUrl, maxChars);
    if (!content) {
      return {success: false, content: '', error: `Could not fetch content from ${url}`};
    }

    return {success: true, content, url};
  },
});
