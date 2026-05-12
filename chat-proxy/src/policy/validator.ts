import type {
  PolicyPayload,
  PolicyValidationResult,
  PolicyValidationViolation,
} from './types.js';

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function validatePolicyResponse(
  policy: PolicyPayload,
  responseText: string,
): PolicyValidationResult {
  const violations: PolicyValidationViolation[] = [];
  const normalized = normalize(responseText);

  for (const required of policy.must_include) {
    if (!normalized.includes(normalize(required))) {
      violations.push({
        type: 'missing_must_include',
        value: required,
        message: `Missing required phrase: ${required}`,
      });
    }
  }

  for (const forbidden of policy.must_not_say) {
    if (normalized.includes(normalize(forbidden))) {
      violations.push({
        type: 'contains_must_not_say',
        value: forbidden,
        message: `Contains forbidden phrase: ${forbidden}`,
      });
    }
  }

  if (policy.response_outline && policy.response_outline.length > 0) {
    let cursor = -1;

    for (const section of policy.response_outline) {
      const nextIdx = normalized.indexOf(normalize(section), cursor + 1);
      if (nextIdx === -1 || nextIdx < cursor) {
        violations.push({
          type: 'outline_order',
          value: section,
          message: `Missing or out-of-order outline section: ${section}`,
        });
        break;
      }

      cursor = nextIdx;
    }
  }

  return {ok: violations.length === 0, violations};
}
