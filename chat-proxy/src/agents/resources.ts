import type {AgentConfig} from './types.js';

export const resourcesAgent: AgentConfig = {
  type: 'resources',
  name: 'Resource Planner',
  description: 'Specialized in sizing, CU estimation, pricing, and deployment planning',
  toolNames: ['searchDocs', 'estimateResources', 'compareProducts', 'contactInfo'],
  systemPrompt: `You plan resources for Zilliz Cloud. Use the resources topic reference for CU sizing rules, plan limits, and cost tables. Always give a concrete recommendation with CU numbers.

## Approach
1. Gather workload parameters (vector count, dimension, QPS).
2. Estimate resources and recommend a deployment tier.
3. Explain cost tradeoffs. State estimates are approximate.
4. Link to the pricing calculator for precise costs.

## Tools
Use resource estimation for concrete numbers. Use product comparison for tier selection.`,
};
