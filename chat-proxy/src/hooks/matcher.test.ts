import {describe, it, expect} from 'vitest';
import {matchKeywords, matchPatterns, matchCondition} from './matcher.js';
import type {HookContext, RuleCondition} from './types.js';

describe('matchKeywords', () => {
  it('matches whole words case-insensitively', () => {
    expect(matchKeywords('What is the pricing?', ['pricing'])).toBe(true);
    expect(matchKeywords('PRICING info please', ['pricing'])).toBe(true);
  });

  it('does not match partial words', () => {
    expect(matchKeywords('repricing the model', ['pricing'])).toBe(false);
  });

  it('matches any keyword (OR)', () => {
    expect(matchKeywords('I want to buy', ['pricing', 'buy'])).toBe(true);
    expect(matchKeywords('Tell me the cost', ['pricing', 'buy', 'cost'])).toBe(true);
  });

  it('returns false for empty keywords', () => {
    expect(matchKeywords('anything', [])).toBe(false);
  });

  it('returns false for empty message', () => {
    expect(matchKeywords('', ['pricing'])).toBe(false);
  });

  it('truncates long input to 500 chars', () => {
    const longMsg = 'a '.repeat(300) + 'pricing';
    // 'pricing' is at position 600, past the 500-char cutoff
    expect(matchKeywords(longMsg, ['pricing'])).toBe(false);
  });

  it('escapes special regex characters in keywords', () => {
    expect(matchKeywords('use c++ for this', ['c++'])).toBe(true);
  });
});

describe('matchPatterns', () => {
  it('matches regex patterns', () => {
    expect(matchPatterns('enterprise plan info', ['\\benterprise\\s+plan'])).toBe(true);
  });

  it('returns false when no match', () => {
    expect(matchPatterns('hello world', ['\\benterprise\\s+plan'])).toBe(false);
  });

  it('returns false for empty patterns', () => {
    expect(matchPatterns('anything', [])).toBe(false);
  });

  it('handles invalid regex gracefully', () => {
    expect(matchPatterns('test', ['[invalid'])).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(matchPatterns('ENTERPRISE PLAN', ['enterprise\\s+plan'])).toBe(true);
  });
});

describe('matchCondition', () => {
  const baseCtx: HookContext = {message: 'What is the pricing?', agentType: 'product'};

  it('matches when keywords match and no other conditions', () => {
    const cond: RuleCondition = {keywords: ['pricing']};
    expect(matchCondition(baseCtx, cond, 'pre')).toBe(true);
  });

  it('fails when keywords do not match', () => {
    const cond: RuleCondition = {keywords: ['enterprise']};
    expect(matchCondition(baseCtx, cond, 'pre')).toBe(false);
  });

  it('filters by agent type', () => {
    const cond: RuleCondition = {keywords: ['pricing'], agents: ['general']};
    expect(matchCondition(baseCtx, cond, 'pre')).toBe(false);

    const cond2: RuleCondition = {keywords: ['pricing'], agents: ['product', 'general']};
    expect(matchCondition(baseCtx, cond2, 'pre')).toBe(true);
  });

  it('skips confidence check in pre phase', () => {
    const cond: RuleCondition = {keywords: ['pricing'], confidence: ['high']};
    const ctx: HookContext = {...baseCtx, confidence: 'low'};
    expect(matchCondition(ctx, cond, 'pre')).toBe(true);
  });

  it('checks confidence in post phase', () => {
    const cond: RuleCondition = {keywords: ['pricing'], confidence: ['high']};
    const ctx: HookContext = {...baseCtx, confidence: 'low'};
    expect(matchCondition(ctx, cond, 'post')).toBe(false);

    const ctx2: HookContext = {...baseCtx, confidence: 'high'};
    expect(matchCondition(ctx2, cond, 'post')).toBe(true);
  });

  it('matches with patterns OR keywords', () => {
    const cond: RuleCondition = {keywords: ['nope'], patterns: ['pric\\w+']};
    expect(matchCondition(baseCtx, cond, 'pre')).toBe(true);
  });

  it('matches when no text conditions are specified', () => {
    const cond: RuleCondition = {agents: ['product']};
    expect(matchCondition(baseCtx, cond, 'pre')).toBe(true);
  });
});
