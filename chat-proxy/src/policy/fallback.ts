import type {PolicyPayload} from './types.js';

export function buildPolicyFallback(policy: PolicyPayload): string {
  const header = 'Here is the safest verified guidance:';

  const facts = policy.fixed_facts.map(fact => `- ${fact}`);
  const required = policy.must_include.map(item => `- ${item}`);

  return [
    header,
    '',
    'Verified facts:',
    ...facts,
    '',
    'Required guidance:',
    ...required,
  ].join('\n');
}
