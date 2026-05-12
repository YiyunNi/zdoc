import {describe, it, expect} from 'vitest';
import {loadTopicPolicies, getPolicyByIntent} from './catalog.js';

describe('policy catalog', () => {
  it('loads zilliz-cli pilot intents', () => {
    const policies = loadTopicPolicies('zilliz-cli');
    expect(policies.length).toBe(4);
    expect(policies.map(p => p.intent_id).sort()).toEqual([
      'zcli_agent_skill_setup',
      'zcli_get_started_in_minutes',
      'zcli_roadmap_feedback',
      'zcli_usage_patterns',
    ]);
  });

  it('returns null when intent does not exist', () => {
    loadTopicPolicies('zilliz-cli');
    expect(getPolicyByIntent('zilliz-cli', 'unknown_intent')).toBeNull();
  });

  it('returns policy by intent after load', () => {
    loadTopicPolicies('zilliz-cli');
    const policy = getPolicyByIntent('zilliz-cli', 'zcli_get_started_in_minutes');
    expect(policy?.must_include.length).toBeGreaterThan(0);
  });
});
