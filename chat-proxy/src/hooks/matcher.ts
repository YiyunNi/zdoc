import type {HookContext, RuleCondition} from './types.js';

const MAX_INPUT_LEN = 500;

export function matchKeywords(message: string, keywords: string[]): boolean {
  if (keywords.length === 0) return false;
  const truncated = message.slice(0, MAX_INPUT_LEN).toLowerCase();
  return keywords.some(kw => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Use \b for word-char boundaries, lookaround for non-word-char keywords (e.g. "c++")
    const startsWithWordChar = /^\w/.test(kw);
    const endsWithWordChar = /\w$/.test(kw);
    const prefix = startsWithWordChar ? '\\b' : '(?<=\\s|^)';
    const suffix = endsWithWordChar ? '\\b' : '(?=\\s|$)';
    const pattern = new RegExp(`${prefix}${escaped}${suffix}`, 'i');
    return pattern.test(truncated);
  });
}

export function matchPatterns(message: string, patterns: string[]): boolean {
  if (patterns.length === 0) return false;
  const truncated = message.slice(0, MAX_INPUT_LEN);
  return patterns.some(pat => {
    try {
      return new RegExp(pat, 'i').test(truncated);
    } catch {
      return false;
    }
  });
}

export function matchCondition(ctx: HookContext, condition: RuleCondition, phase: 'pre' | 'post'): boolean {
  // Text matching: keywords OR patterns (at least one must be present)
  const hasKeywords = condition.keywords && condition.keywords.length > 0;
  const hasPatterns = condition.patterns && condition.patterns.length > 0;

  if (hasKeywords || hasPatterns) {
    const keywordMatch = hasKeywords ? matchKeywords(ctx.message, condition.keywords!) : false;
    const patternMatch = hasPatterns ? matchPatterns(ctx.message, condition.patterns!) : false;
    if (!keywordMatch && !patternMatch) return false;
  }

  // Agent filter (OR within)
  if (condition.agents && condition.agents.length > 0) {
    if (!condition.agents.includes(ctx.agentType)) return false;
  }

  // Confidence filter — only checked in post phase
  if (phase === 'post' && condition.confidence && condition.confidence.length > 0) {
    if (!ctx.confidence || !condition.confidence.includes(ctx.confidence)) return false;
  }

  return true;
}
