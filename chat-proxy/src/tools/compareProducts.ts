import {z} from 'zod';
import {tool} from 'ai';

export const compareProductsTool = tool({
  description: 'Compare Zilliz Cloud deployment options: Serverless, Dedicated, and BYOC (Bring Your Own Cloud).',
  inputSchema: z.object({
    focus: z.enum(['pricing', 'performance', 'security', 'features', 'all']).optional().default('all').describe('Comparison focus area'),
  }),
  execute: async ({focus}) => {
    const comparison = {
      serverless: {
        name: 'Serverless',
        pricing: 'Pay-per-use. Free tier: 1 collection, 500K vectors. No CU management.',
        performance: 'Auto-scales. Best for variable workloads, prototyping, and small-medium datasets.',
        security: 'Shared infrastructure. TLS encryption. RBAC support.',
        features: 'Automatic index optimization. No cluster management. Limited to supported regions.',
        bestFor: 'Startups, prototyping, variable workloads, cost-sensitive projects',
      },
      dedicated: {
        name: 'Dedicated',
        pricing: 'CU-based billing. Predictable costs. Choose CU count and storage.',
        performance: 'Dedicated resources. Consistent performance. Supports high QPS and large datasets.',
        security: 'Isolated compute. VPC peering. Private Link. Enhanced RBAC.',
        features: 'Full configuration control. Multiple replicas. Resource groups. Cross-region replication.',
        bestFor: 'Production workloads, consistent latency requirements, large datasets',
      },
      byoc: {
        name: 'BYOC (Bring Your Own Cloud)',
        pricing: 'License fee + your cloud costs. Most control over infrastructure costs.',
        performance: 'Full control over hardware. Custom instance types. Runs in your VPC.',
        security: 'Data never leaves your cloud account. Full network isolation. Compliance-friendly.',
        features: 'AWS, GCP, Azure support. Managed by Zilliz control plane. Your data, your cloud.',
        bestFor: 'Regulated industries, data residency requirements, existing cloud commitments',
      },
    };

    if (focus === 'all') return comparison;

    return Object.fromEntries(
      Object.entries(comparison).map(([key, val]) => [
        key,
        {name: val.name, [focus]: val[focus], bestFor: val.bestFor},
      ]),
    );
  },
});
