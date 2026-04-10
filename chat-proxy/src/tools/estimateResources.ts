import {z} from 'zod';
import {tool} from 'ai';

export const estimateResourcesTool = tool({
  description: 'Estimate Zilliz Cloud resource requirements (CUs, storage) based on workload parameters.',
  inputSchema: z.object({
    vectorCount: z.number().describe('Number of vectors/entities'),
    dimension: z.number().describe('Vector dimension'),
    scalarFieldBytes: z.number().optional().default(200).describe('Average bytes per entity for scalar fields'),
    qps: z.number().optional().describe('Expected queries per second'),
    indexType: z.string().optional().default('AUTOINDEX').describe('Index type'),
    replicaCount: z.number().optional().default(1).describe('Number of replicas'),
  }),
  execute: async ({vectorCount, dimension, scalarFieldBytes, qps, indexType, replicaCount}) => {
    // Raw vector storage
    const vectorBytes = vectorCount * dimension * 4; // float32
    const scalarBytes = vectorCount * scalarFieldBytes;
    const rawStorageGB = (vectorBytes + scalarBytes) / (1024 ** 3);

    // Index overhead varies by type
    const indexOverhead: Record<string, number> = {
      AUTOINDEX: 1.2,
      HNSW: 1.5,
      IVF_FLAT: 1.1,
      IVF_SQ8: 0.35,
      DISKANN: 1.2,
      FLAT: 1.0,
    };
    const overhead = indexOverhead[indexType] || 1.2;
    const indexStorageGB = (vectorBytes * overhead) / (1024 ** 3);
    const totalStorageGB = rawStorageGB + indexStorageGB;

    // CU estimation (rough — 1 CU ≈ handles ~1M vectors of 768d with basic QPS)
    const baseCUs = Math.max(1, Math.ceil(vectorCount / 1_000_000));
    const qpsCUs = qps ? Math.max(0, Math.ceil(qps / 100)) : 0;
    const estimatedCUs = Math.max(1, (baseCUs + qpsCUs) * replicaCount);

    // Deployment recommendation
    let deploymentTier: string;
    if (vectorCount < 1_000_000 && (!qps || qps < 50)) {
      deploymentTier = 'Serverless (Free Tier available — up to 1M vectors)';
    } else if (vectorCount < 50_000_000) {
      deploymentTier = 'Serverless or Dedicated (Standard)';
    } else {
      deploymentTier = 'Dedicated (Performance) or BYOC';
    }

    return {
      storage: {
        rawDataGB: Math.round(rawStorageGB * 100) / 100,
        indexStorageGB: Math.round(indexStorageGB * 100) / 100,
        totalGB: Math.round(totalStorageGB * 100) / 100,
      },
      compute: {
        estimatedCUs,
        baseCUs,
        qpsCUs,
        replicaCount,
      },
      recommendation: {
        deploymentTier,
        indexType: indexType === 'AUTOINDEX' ? 'AUTOINDEX (recommended — platform auto-optimizes)' : indexType,
      },
      note: 'These are rough estimates. Actual requirements depend on query complexity, filtering, and data distribution. Use the Zilliz Cloud sizing calculator for precise estimates.',
    };
  },
});
