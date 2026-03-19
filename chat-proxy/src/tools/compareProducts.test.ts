import {describe, it, expect} from 'vitest';
import {compareProductsTool} from './compareProducts.js';

const exec = compareProductsTool.execute as (args: any) => Promise<any>;

describe('compareProductsTool', () => {
  it('focus=all returns all fields for all tiers', async () => {
    const result = await exec({focus: 'all'});

    for (const tier of ['serverless', 'dedicated', 'byoc']) {
      expect(result[tier]).toBeDefined();
      expect(result[tier].name).toBeDefined();
      expect(result[tier].pricing).toBeDefined();
      expect(result[tier].performance).toBeDefined();
      expect(result[tier].security).toBeDefined();
      expect(result[tier].features).toBeDefined();
      expect(result[tier].bestFor).toBeDefined();
    }
  });

  it('focus=pricing returns only pricing and bestFor per tier', async () => {
    const result = await exec({focus: 'pricing'});

    for (const tier of ['serverless', 'dedicated', 'byoc']) {
      expect(result[tier]).toBeDefined();
      expect(result[tier].name).toBeDefined();
      expect(result[tier].pricing).toBeDefined();
      expect(result[tier].bestFor).toBeDefined();
      // Should not include other fields
      expect(result[tier].performance).toBeUndefined();
      expect(result[tier].security).toBeUndefined();
      expect(result[tier].features).toBeUndefined();
    }
  });

  it('includes all three tiers (serverless, dedicated, byoc)', async () => {
    const result = await exec({focus: 'all'});

    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(['serverless', 'dedicated', 'byoc']),
    );
    expect(result.serverless.name).toBe('Serverless');
    expect(result.dedicated.name).toBe('Dedicated');
    expect(result.byoc.name).toContain('BYOC');
  });
});
