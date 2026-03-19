import {describe, it, expect} from 'vitest';
import {checkFeatureAvailabilityTool} from './checkFeatureAvailability.js';

const exec = checkFeatureAvailabilityTool.execute as (args: any) => Promise<any>;

describe('checkFeatureAvailabilityTool', () => {
  it('finds exact match for "vpc-peering" with tier matrix', async () => {
    const result = await exec({feature: 'vpc-peering'});

    expect(result.found).toBe(true);
    expect(result.feature).toBe('vpc-peering');
    expect(result.availability.serverless).toBe(false);
    expect(result.availability.dedicated).toBe(true);
    expect(result.availability.byoc).toBe(true);
  });

  it('normalizes "VPC Peering" to find the feature', async () => {
    const result = await exec({feature: 'VPC Peering'});

    expect(result.found).toBe(true);
    expect(result.feature).toBe('vpc-peering');
    expect(result.availability.serverless).toBe(false);
    expect(result.availability.dedicated).toBe(true);
  });

  it('fuzzy matches partial term "search"', async () => {
    const result = await exec({feature: 'search'});

    expect(result.found).toBe(true);
    // Should match one of the search-related features
    expect(result.feature).toMatch(/search/);
  });

  it('returns found: false with suggestions for unknown feature', async () => {
    const result = await exec({feature: 'quantum-entanglement'});

    expect(result.found).toBe(false);
    expect(result.suggestion).toBeDefined();
    expect(result.suggestion).toContain('not found');
  });
});
