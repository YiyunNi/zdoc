import type {
  PolicyPayload,
  PolicyValidationResult,
  PolicyValidationViolation,
} from './types.js';

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function countActionabilitySignals(text: string): number {
  let score = 0;
  const nonEmptyLines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);

  if (/```/.test(text)) score++;
  if (/\n\s*(\d+\.|-\s)/.test(text)) score++;
  if (nonEmptyLines.length >= 4) score++;

  return score;
}

export function validatePolicyResponse(
  _policy: PolicyPayload,
  responseText: string,
): PolicyValidationResult {
  const violations: PolicyValidationViolation[] = [];
  const normalized = normalize(responseText);

  if (!normalized) {
    violations.push({
      type: 'quality_empty',
      value: '',
      message: 'Response is empty.',
    });
    return {ok: false, violations};
  }

  if (normalized.length < 80) {
    violations.push({
      type: 'quality_too_short',
      value: String(normalized.length),
      message: 'Response is too short to be actionable.',
    });
  }

  if (countActionabilitySignals(responseText) < 1) {
    violations.push({
      type: 'quality_low_actionability',
      value: 'actionability_signals<1',
      message: 'Response lacks actionable structure (step format or runnable snippets).',
    });
  }

  return {ok: violations.length === 0, violations};
}
