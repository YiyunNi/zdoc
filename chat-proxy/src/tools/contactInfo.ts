import {tool} from 'ai';
import {z} from 'zod';

export const contactInfoTool = tool({
  description: 'Get Zilliz Cloud sales contact URLs, support portal links, and booking pages. Use when users ask about pricing, enterprise plans, custom requirements, or need support.',
  inputSchema: z.object({
    type: z.enum(['sales', 'support', 'both']).describe('Type of contact information needed'),
  }),
  execute: async ({type}) => {
    const sales = {
      contactPage: 'https://zilliz.com/contact-sales',
      pricingPage: 'https://zilliz.com/pricing',
      bookDemo: 'https://zilliz.com/book-a-demo',
    };

    const support = {
      supportPortal: 'https://support.zilliz.com',
      documentation: 'https://docs.zilliz.com',
      community: 'https://discord.gg/zilliz',
      github: 'https://github.com/zilliztech',
    };

    if (type === 'sales') return {sales};
    if (type === 'support') return {support};
    return {sales, support};
  },
});
