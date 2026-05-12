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
  const phrasePolicy: PolicyPayload = {
    intent_id: 'phrase_boundary_test',
    fixed_facts: [],
    must_include: ['install'],
    must_not_say: [],
    response_outline: [],
    style: {language: 'same as user', tone: 'concise, helpful'},
  };

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

  it('does not match required phrase inside a larger word', () => {
    const result = validatePolicyResponse(phrasePolicy, 'Please reinstall the CLI');
    expect(result.ok).toBe(false);
    expect(result.violations.some(v => v.type === 'missing_must_include')).toBe(true);
  });

  it('matches required phrase with case and whitespace variance', () => {
    const result = validatePolicyResponse(phrasePolicy, '  Please\n   INSTALL   the CLI  ');
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
