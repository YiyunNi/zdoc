import {afterEach, describe, it, expect, vi} from 'vitest';

async function importCatalog() {
  return import('./catalog.js');
}

afterEach(() => {
  vi.doUnmock('node:fs');
  vi.resetModules();
});

describe('policy catalog', () => {
  it('loads zilliz-cli pilot intents', async () => {
    const {loadTopicPolicies} = await importCatalog();
    const policies = loadTopicPolicies('zilliz-cli');
    expect(policies.length).toBe(4);
    expect(policies.map(p => p.intent_id).sort()).toEqual([
      'zcli_agent_skill_setup',
      'zcli_get_started_in_minutes',
      'zcli_roadmap_feedback',
      'zcli_usage_patterns',
    ]);
  });

  it('returns null when intent does not exist', async () => {
    const {loadTopicPolicies, getPolicyByIntent} = await importCatalog();
    loadTopicPolicies('zilliz-cli');
    expect(getPolicyByIntent('zilliz-cli', 'unknown_intent')).toBeNull();
  });

  it('returns policy by intent after load', async () => {
    const {loadTopicPolicies, getPolicyByIntent} = await importCatalog();
    loadTopicPolicies('zilliz-cli');
    const policy = getPolicyByIntent('zilliz-cli', 'zcli_get_started_in_minutes');
    expect(policy?.must_include.length).toBeGreaterThan(0);
  });

  it('returns an empty list when the topic file is missing', async () => {
    vi.doMock('node:fs', () => ({
      readFileSync: vi.fn(() => {
        throw new Error('ENOENT');
      }),
    }));

    const {loadTopicPolicies, getPolicyByIntent} = await importCatalog();
    expect(loadTopicPolicies('missing-topic')).toEqual([]);
    expect(getPolicyByIntent('missing-topic', 'unknown_intent')).toBeNull();
  });

  it('returns an empty list when the yaml shape is invalid', async () => {
    vi.doMock('node:fs', () => ({
      readFileSync: vi.fn(() => `policies:\n  - intent_id: bad\n    must_include: []\n`),
    }));

    const {loadTopicPolicies} = await importCatalog();
    expect(loadTopicPolicies('invalid-shape')).toEqual([]);
  });

  it('clears the cache', async () => {
    const readFileSync = vi.fn(() => `policies:\n  - intent_id: cached\n    fixed_facts: []\n    must_include: []\n    must_not_say: []\n    style:\n      language: same as user\n      tone: concise\n`);
    vi.doMock('node:fs', () => ({readFileSync}));

    const {loadTopicPolicies, clearPolicyCache} = await importCatalog();
    loadTopicPolicies('cached-topic');
    loadTopicPolicies('cached-topic');
    expect(readFileSync).toHaveBeenCalledTimes(1);

    clearPolicyCache();
    loadTopicPolicies('cached-topic');
    expect(readFileSync).toHaveBeenCalledTimes(2);
  });

  it('does not expose mutable cached policy references', async () => {
    const {loadTopicPolicies, getPolicyByIntent} = await importCatalog();
    const policies = loadTopicPolicies('zilliz-cli');
    policies[0].intent_id = 'mutated';
    policies[0].must_include.push('mutated');
    policies.push({
      intent_id: 'extra',
      fixed_facts: [],
      must_include: [],
      must_not_say: [],
      style: {language: 'same as user', tone: 'concise'},
    });

    const reloadedPolicies = loadTopicPolicies('zilliz-cli');
    expect(reloadedPolicies).toHaveLength(4);
    expect(reloadedPolicies.some(policy => policy.intent_id === 'mutated')).toBe(false);
    expect(reloadedPolicies.some(policy => policy.intent_id === 'extra')).toBe(false);

    const policy = getPolicyByIntent('zilliz-cli', 'zcli_get_started_in_minutes');
    policy?.must_include.push('another mutation');

    expect(getPolicyByIntent('zilliz-cli', 'zcli_get_started_in_minutes')?.must_include).not.toContain('another mutation');
  });
});
