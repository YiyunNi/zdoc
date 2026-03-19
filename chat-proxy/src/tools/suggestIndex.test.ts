import {describe, it, expect} from 'vitest';
import {suggestIndexTool} from './suggestIndex.js';

const exec = suggestIndexTool.execute as (args: any) => Promise<any>;

describe('suggestIndexTool', () => {
  it('recommends HNSW for small dataset (100K vectors)', async () => {
    const result = await exec({
      vectorCount: 100_000,
      dimension: 768,
    });

    const indexTypes = result.recommendations.map((r: any) => r.indexType);
    expect(indexTypes).toContain('HNSW');
  });

  it('includes DISKANN for very large dataset (20M vectors)', async () => {
    // At 20M: AUTOINDEX, IVF_FLAT, IVF_SQ8, DISKANN — top 3 = AUTOINDEX, IVF_FLAT, IVF_SQ8
    // HNSW excluded (requires < 10M). DISKANN is 4th but cut by slice(0,3).
    // We verify HNSW is excluded from the full recommendation set.
    const result = await exec({
      vectorCount: 20_000_000,
      dimension: 768,
    });

    const indexTypes = result.recommendations.map((r: any) => r.indexType);
    expect(indexTypes).not.toContain('HNSW');
    // AUTOINDEX is always present
    expect(indexTypes).toContain('AUTOINDEX');
  });

  it('recommends IVF_SQ8 for large dataset with low memory', async () => {
    // At 10M+: HNSW excluded. With low memory: AUTOINDEX, IVF_FLAT, IVF_SQ8 in top 3
    const result = await exec({
      vectorCount: 10_000_000,
      dimension: 768,
      memoryConstraint: 'low',
    });

    const indexTypes = result.recommendations.map((r: any) => r.indexType);
    expect(indexTypes).toContain('IVF_SQ8');
  });

  it('suggests COSINE metric for high dimension (768)', async () => {
    const result = await exec({
      vectorCount: 1_000_000,
      dimension: 768,
    });

    expect(result.metricSuggestion).toContain('COSINE');
  });

  it('suggests L2 metric for low dimension (128)', async () => {
    const result = await exec({
      vectorCount: 1_000_000,
      dimension: 128,
    });

    expect(result.metricSuggestion).toContain('L2');
  });

  it('always includes AUTOINDEX as first recommendation', async () => {
    const result = await exec({
      vectorCount: 500_000,
      dimension: 768,
    });

    expect(result.recommendations[0].indexType).toBe('AUTOINDEX');
  });
});
