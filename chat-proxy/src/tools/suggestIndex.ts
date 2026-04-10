import {z} from 'zod';
import {tool} from 'ai';

export const suggestIndexTool = tool({
  description: 'Recommend the best index type based on dataset characteristics and query requirements.',
  inputSchema: z.object({
    vectorCount: z.number().describe('Approximate number of vectors in the collection'),
    dimension: z.number().describe('Vector dimension'),
    queryLatencyMs: z.number().optional().describe('Target query latency in milliseconds'),
    recallTarget: z.number().optional().describe('Target recall rate (0.0-1.0)'),
    memoryConstraint: z.enum(['low', 'medium', 'high']).optional().describe('Memory budget'),
    updateFrequency: z.enum(['rare', 'moderate', 'frequent']).optional().describe('How often data is inserted/updated'),
  }),
  execute: async ({vectorCount, dimension, queryLatencyMs, recallTarget, memoryConstraint, updateFrequency}) => {
    const recommendations: Array<{indexType: string; reason: string; tradeoffs: string}> = [];

    // AUTOINDEX — always a safe default
    recommendations.push({
      indexType: 'AUTOINDEX',
      reason: 'Zilliz Cloud automatically selects and tunes the best index. Recommended for most use cases.',
      tradeoffs: 'Optimized by the platform; no manual tuning needed.',
    });

    // HNSW — high recall, moderate memory
    if (vectorCount < 10_000_000) {
      recommendations.push({
        indexType: 'HNSW',
        reason: `Good for ${vectorCount < 1_000_000 ? 'small to medium' : 'medium'} datasets. Excellent recall and low latency.`,
        tradeoffs: 'Higher memory usage. Build time increases with dataset size.',
      });
    }

    // IVF_FLAT — balanced
    if (vectorCount >= 100_000) {
      recommendations.push({
        indexType: 'IVF_FLAT',
        reason: 'Good balance of recall, speed, and memory for large datasets.',
        tradeoffs: 'Slightly lower recall than HNSW. Requires choosing nlist parameter.',
      });
    }

    // IVF_SQ8 — memory efficient
    if (memoryConstraint === 'low' || vectorCount >= 5_000_000) {
      recommendations.push({
        indexType: 'IVF_SQ8',
        reason: 'Quantized variant of IVF_FLAT with ~75% memory reduction.',
        tradeoffs: 'Slightly lower recall due to quantization.',
      });
    }

    // DISKANN — very large scale
    if (vectorCount >= 10_000_000) {
      recommendations.push({
        indexType: 'DISKANN',
        reason: 'Designed for billion-scale datasets. Stores index on disk with in-memory cache.',
        tradeoffs: 'Higher query latency than in-memory indexes. Best for very large datasets.',
      });
    }

    // Metric type suggestion
    const metricSuggestion = dimension >= 768
      ? 'COSINE (best for normalized embeddings from language models)'
      : 'L2 (Euclidean distance, good for image embeddings) or IP (inner product)';

    return {
      recommendations: recommendations.slice(0, 3),
      metricSuggestion,
      context: {
        vectorCount,
        dimension,
        estimatedMemoryMB: Math.round((vectorCount * dimension * 4) / (1024 * 1024)),
      },
    };
  },
});
