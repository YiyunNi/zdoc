import {describe, it, expect} from 'vitest';
import {validatePolicyResponse} from './validator.js';
import type {PolicyPayload} from './types.js';

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
  it('passes when response satisfies include/exclude/outline rules', () => {
    const text = [
      'Installation methods',
      'How to install',
      'One end-to-end command set',
      'From login, create cluster, create collection, insert, and query: provide one command set example.',
      '-h output overview + CLI reference',
      'Use -h commands for quick capability overview',
      'You can also continue by reading the documentation',
    ].join('\n');

    const result = validatePolicyResponse(policy, text);
    expect(result.ok).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it('fails when must_include is missing', () => {
    const text = 'Installation methods\nOne end-to-end command set\n-h output overview + CLI reference';
    const result = validatePolicyResponse(policy, text);
    expect(result.ok).toBe(false);
    expect(result.violations.some(v => v.type === 'missing_must_include')).toBe(true);
  });

  it('fails when must_not_say appears', () => {
    const text = [
      'Installation methods',
      'How to install',
      'One end-to-end command set',
      'Use SDK code instead of zilliz CLI for this CLI setup flow',
      '-h output overview + CLI reference',
    ].join('\n');
    const result = validatePolicyResponse(policy, text);
    expect(result.ok).toBe(false);
    expect(result.violations.some(v => v.type === 'contains_must_not_say')).toBe(true);
  });

  it('fails when outline order is broken', () => {
    const text = [
      'One end-to-end command set',
      'Installation methods',
      '-h output overview + CLI reference',
    ].join('\n');
    const result = validatePolicyResponse(policy, text);
    expect(result.ok).toBe(false);
    expect(result.violations.some(v => v.type === 'outline_order')).toBe(true);
  });
});
