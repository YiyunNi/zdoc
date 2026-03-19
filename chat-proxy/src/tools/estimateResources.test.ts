import {describe, it, expect} from 'vitest';
import {estimateResourcesTool} from './estimateResources.js';

const exec = estimateResourcesTool.execute as (args: any) => Promise<any>;

describe('estimateResourcesTool', () => {
  it('recommends Serverless tier for small dataset', async () => {
    const result = await exec({
      vectorCount: 500_000,
      dimension: 768,
      scalarFieldBytes: 200,
    });

    expect(result.recommendation.deploymentTier).toContain('Serverless');
    expect(result.recommendation.deploymentTier).toContain('Free Tier');
  });

  it('recommends Dedicated/BYOC for very large dataset', async () => {
    const result = await exec({
      vectorCount: 100_000_000,
      dimension: 768,
      scalarFieldBytes: 200,
    });

    expect(result.recommendation.deploymentTier).toContain('Dedicated');
    expect(result.recommendation.deploymentTier).toContain('BYOC');
  });

  it('computes correct raw vector storage for 1M x 768d', async () => {
    const result = await exec({
      vectorCount: 1_000_000,
      dimension: 768,
      scalarFieldBytes: 0,
    });

    // 1M * 768 * 4 bytes = 3,072,000,000 bytes = ~2.86 GB
    const expectedRawGB = (1_000_000 * 768 * 4) / (1024 ** 3);
    expect(result.storage.rawDataGB).toBeCloseTo(expectedRawGB, 1);
  });

  it('estimates CUs with QPS and replicas', async () => {
    const result = await exec({
      vectorCount: 1_000_000,
      dimension: 768,
      qps: 200,
      replicaCount: 2,
    });

    // baseCUs = ceil(1M / 1M) = 1
    // qpsCUs = ceil(200 / 100) = 2
    // total = (1 + 2) * 2 = 6
    expect(result.compute.baseCUs).toBe(1);
    expect(result.compute.qpsCUs).toBe(2);
    expect(result.compute.estimatedCUs).toBe(6);
    expect(result.compute.replicaCount).toBe(2);
  });

  it('HNSW has 1.5x overhead vs AUTOINDEX 1.2x', async () => {
    const hnswResult = await exec({
      vectorCount: 1_000_000,
      dimension: 768,
      indexType: 'HNSW',
    });

    const autoResult = await exec({
      vectorCount: 1_000_000,
      dimension: 768,
      indexType: 'AUTOINDEX',
    });

    // HNSW overhead 1.5, AUTOINDEX overhead 1.2
    expect(hnswResult.storage.indexStorageGB).toBeGreaterThan(autoResult.storage.indexStorageGB);

    // Verify the ratio is 1.5/1.2 = 1.25
    const ratio = hnswResult.storage.indexStorageGB / autoResult.storage.indexStorageGB;
    expect(ratio).toBeCloseTo(1.25, 1);
  });
});
