import type {
  PolicyPayload,
  PolicyValidationResult,
  PolicyValidationViolation,
} from './types.js';

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function isWordChar(char: string): boolean {
  return /[a-z0-9]/.test(char);
}

function hasPhrase(text: string, phrase: string): boolean {
  const startsWithWordChar = isWordChar(phrase[0] ?? '');
  const endsWithWordChar = isWordChar(phrase[phrase.length - 1] ?? '');

  let searchFrom = 0;
  while (searchFrom <= text.length - phrase.length) {
    const idx = text.indexOf(phrase, searchFrom);
    if (idx === -1) {
      return false;
    }

    const beforeChar = idx > 0 ? text[idx - 1] : '';
    const afterIdx = idx + phrase.length;
    const afterChar = afterIdx < text.length ? text[afterIdx] : '';

    const beforeOk = !startsWithWordChar || beforeChar === '' || !isWordChar(beforeChar);
    const afterOk = !endsWithWordChar || afterChar === '' || !isWordChar(afterChar);

    if (beforeOk && afterOk) {
      return true;
    }

    searchFrom = idx + 1;
  }

  return false;
}

export function validatePolicyResponse(
  policy: PolicyPayload,
  responseText: string,
): PolicyValidationResult {
  const violations: PolicyValidationViolation[] = [];
  const normalized = normalize(responseText);

  for (const required of policy.must_include) {
    if (!hasPhrase(normalized, normalize(required))) {
      violations.push({
        type: 'missing_must_include',
        value: required,
        message: `Missing required phrase: ${required}`,
      });
    }
  }

  for (const forbidden of policy.must_not_say) {
    if (hasPhrase(normalized, normalize(forbidden))) {
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
      if (nextIdx === -1) {
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
