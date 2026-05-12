import {describe, it, expect} from 'vitest';
import {buildPolicyFallback} from './fallback.js';
import type {PolicyPayload} from './types.js';
import {validatePolicyResponse} from './validator.js';

const policy: PolicyPayload = {
  intent_id: 'zcli_get_started_in_minutes',
  fixed_facts: ['Use zilliz login as the default auth entry point.'],
  must_include: [
    'How to install',
    'From login, create cluster, create collection, insert, and query: provide one command set example.',
    'Use -h commands for quick capability overview',
    'You can also continue by reading the documentation',
  ],
  must_not_say: ['Use SDK code instead of zilliz CLI for this CLI setup flow'],
  response_outline: ['Installation methods', 'One end-to-end command set', '-h output overview + CLI reference'],
  style: {language: 'same as user', tone: 'concise, helpful'},
};

describe('validatePolicyResponse', () => {
  it('passes actionable structured responses', () => {
    const text = [
      '1. Install the CLI',
      '```bash',
      'curl -fsSL https://zilliz.com/cli/install.sh | bash',
      '```',
      '2. Login',
      '```bash',
      'zilliz login',
      '```',
    ].join('\n');

    const result = validatePolicyResponse(policy, text);
    expect(result.ok).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it('fails empty responses', () => {
    const result = validatePolicyResponse(policy, '   ');
    expect(result.ok).toBe(false);
    expect(result.violations.some(v => v.type === 'quality_empty')).toBe(true);
  });

  it('fails responses that are too short', () => {
    const result = validatePolicyResponse(policy, 'Use zilliz CLI.');
    expect(result.ok).toBe(false);
    expect(result.violations.some(v => v.type === 'quality_too_short')).toBe(true);
  });

  it('fails responses with low actionability signals', () => {
    const text = 'This is a long descriptive paragraph about the CLI with no commands and no step-by-step format, repeated to exceed length threshold for validation checks.';
    const result = validatePolicyResponse(policy, text);
    expect(result.ok).toBe(false);
    expect(result.violations.some(v => v.type === 'quality_low_actionability')).toBe(true);
  });

  it('does not fail only because policy phrases are paraphrased', () => {
    const text = [
      '1. Install and verify',
      '```bash',
      'curl -fsSL https://zilliz.com/cli/install.sh | bash',
      'zilliz --version',
      '```',
      '2. Authenticate and set context',
      '```bash',
      'zilliz login',
      'zilliz context set --cluster-id inxx-xxxxx --database default',
      '```',
    ].join('\n');

    const result = validatePolicyResponse(policy, text);
    expect(result.ok).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it('builds deterministic fallback with the exact expected output', () => {
    const text = buildPolicyFallback(policy);
    expect(text).toBe([
      'Here is the safest verified guidance:',
      '',
      'Verified facts:',
      '- Use zilliz login as the default auth entry point.',
      '',
      'Required guidance:',
      '- How to install',
      '- From login, create cluster, create collection, insert, and query: provide one command set example.',
      '- Use -h commands for quick capability overview',
      '- You can also continue by reading the documentation',
    ].join('\n'));
  });

  it('builds deterministic fallback when facts and required guidance are empty', () => {
    const text = buildPolicyFallback({
      ...policy,
      fixed_facts: [],
      must_include: [],
    });
    expect(text).toBe([
      'Here is the safest verified guidance:',
      '',
      'Verified facts:',
      '',
      'Required guidance:',
    ].join('\n'));
  });
});
