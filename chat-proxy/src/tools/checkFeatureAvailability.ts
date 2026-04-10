import {z} from 'zod';
import {tool} from 'ai';

// Feature availability matrix
const FEATURES: Record<string, {serverless: boolean; dedicated: boolean; byoc: boolean; notes?: string}> = {
  'vector-search': {serverless: true, dedicated: true, byoc: true},
  'hybrid-search': {serverless: true, dedicated: true, byoc: true},
  'full-text-search': {serverless: true, dedicated: true, byoc: true},
  'dynamic-schema': {serverless: true, dedicated: true, byoc: true},
  'partition-key': {serverless: true, dedicated: true, byoc: true},
  'auto-scaling': {serverless: true, dedicated: true, byoc: true},
  'vpc-peering': {serverless: false, dedicated: true, byoc: true, notes: 'Available on Dedicated Standard and above'},
  'private-link': {serverless: false, dedicated: true, byoc: true, notes: 'Available on Dedicated Standard and above'},
  'rbac': {serverless: true, dedicated: true, byoc: true},
  'cross-region-replication': {serverless: false, dedicated: true, byoc: true, notes: 'Enterprise feature'},
  'resource-groups': {serverless: false, dedicated: true, byoc: true},
  'multiple-replicas': {serverless: false, dedicated: true, byoc: true},
  'gpu-index': {serverless: false, dedicated: true, byoc: true, notes: 'Requires GPU-enabled instances'},
  'diskann': {serverless: true, dedicated: true, byoc: true},
  'range-search': {serverless: true, dedicated: true, byoc: true},
  'groupby-search': {serverless: true, dedicated: true, byoc: true},
  'iterators': {serverless: true, dedicated: true, byoc: true},
  'backup-restore': {serverless: false, dedicated: true, byoc: true},
  'data-import': {serverless: true, dedicated: true, byoc: true},
  'cdc': {serverless: false, dedicated: true, byoc: true, notes: 'Change Data Capture — enterprise feature'},
};

export const checkFeatureAvailabilityTool = tool({
  description: 'Check if a specific Zilliz Cloud feature is available on Serverless, Dedicated, or BYOC tiers.',
  inputSchema: z.object({
    feature: z.string().describe('Feature name to check (e.g., "vpc-peering", "hybrid-search", "gpu-index")'),
  }),
  execute: async ({feature}) => {
    const normalized = feature.toLowerCase().replace(/[\s_]/g, '-');

    // Exact match
    if (FEATURES[normalized]) {
      return {
        feature: normalized,
        availability: FEATURES[normalized],
        found: true,
      };
    }

    // Fuzzy match
    const matches = Object.entries(FEATURES).filter(
      ([key]) => key.includes(normalized) || normalized.includes(key),
    );

    if (matches.length > 0) {
      return {
        feature: matches[0][0],
        availability: matches[0][1],
        found: true,
        otherMatches: matches.slice(1).map(([k]) => k),
      };
    }

    return {
      feature: normalized,
      found: false,
      suggestion: `Feature "${feature}" not found in the availability matrix. Available features: ${Object.keys(FEATURES).join(', ')}`,
    };
  },
});
