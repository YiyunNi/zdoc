import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import yaml from 'js-yaml';
import type {AgentType, ConfidenceLevel} from '../types.js';
import type {Rule, HookContext} from './types.js';
import {matchCondition} from './matcher.js';

export type {Rule, RuleCondition, RuleAction, HookContext} from './types.js';

const VALID_AGENTS = new Set<string>(['general', 'schema', 'resources', 'product', 'code']);
const VALID_CONFIDENCE = new Set<string>(['high', 'medium', 'low']);
const MAX_PRE_PROMPT_RULES = 5;

function validateRule(raw: Record<string, any>, index: number): Rule | null {
  if (!raw.name || typeof raw.name !== 'string') {
    console.warn(`[Hooks] Rule #${index}: missing or invalid 'name', skipping`);
    return null;
  }
  if (!raw.when || typeof raw.when !== 'object') {
    console.warn(`[Hooks] Rule "${raw.name}": missing 'when' condition, skipping`);
    return null;
  }
  if (!raw.then || typeof raw.then !== 'object') {
    console.warn(`[Hooks] Rule "${raw.name}": missing 'then' action, skipping`);
    return null;
  }
  if (!raw.then.inject && !raw.then.append) {
    console.warn(`[Hooks] Rule "${raw.name}": 'then' must have at least 'inject' or 'append', skipping`);
    return null;
  }

  // Validate agents
  const agents = raw.when.agents as string[] | undefined;
  if (agents) {
    const invalid = agents.filter(a => !VALID_AGENTS.has(a));
    if (invalid.length > 0) {
      console.warn(`[Hooks] Rule "${raw.name}": invalid agents [${invalid.join(', ')}], skipping`);
      return null;
    }
  }

  // Validate confidence
  const confidence = raw.when.confidence as string[] | undefined;
  if (confidence) {
    const invalid = confidence.filter(c => !VALID_CONFIDENCE.has(c));
    if (invalid.length > 0) {
      console.warn(`[Hooks] Rule "${raw.name}": invalid confidence [${invalid.join(', ')}], skipping`);
      return null;
    }
  }

  // Validate regex patterns at load time
  const patterns = raw.when.patterns as string[] | undefined;
  if (patterns) {
    const validPatterns: string[] = [];
    for (const pat of patterns) {
      try {
        new RegExp(pat, 'i');
        validPatterns.push(pat);
      } catch {
        console.warn(`[Hooks] Rule "${raw.name}": invalid regex "${pat}", skipping pattern`);
      }
    }
    raw.when.patterns = validPatterns;
  }

  return {
    name: raw.name,
    enabled: raw.enabled !== false,
    priority: typeof raw.priority === 'number' ? raw.priority : 100,
    when: {
      keywords: raw.when.keywords as string[] | undefined,
      patterns: raw.when.patterns as string[] | undefined,
      agents: agents as AgentType[] | undefined,
      confidence: confidence as ConfidenceLevel[] | undefined,
    },
    then: {
      inject: raw.then.inject as string | undefined,
      append: raw.then.append as string | undefined,
    },
  };
}

export function loadRules(baseUrl: string): Rule[] {
  try {
    const dir = dirname(fileURLToPath(baseUrl));
    const filePath = join(dir, '..', '..', 'prompt-hooks.yaml');
    const content = readFileSync(filePath, 'utf-8');
    const doc = yaml.load(content) as {rules?: Record<string, any>[]};

    if (!doc || !Array.isArray(doc.rules)) {
      console.warn('[Hooks] prompt-hooks.yaml has no rules array');
      return [];
    }

    const rules: Rule[] = [];
    for (let i = 0; i < doc.rules.length; i++) {
      const rule = validateRule(doc.rules[i], i);
      if (rule && rule.enabled) rules.push(rule);
    }

    rules.sort((a, b) => a.priority - b.priority);
    console.log(`[Hooks] Loaded ${rules.length} enabled rule(s)`);
    return rules;
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && (err as any).code === 'ENOENT') {
      console.warn('[Hooks] prompt-hooks.yaml not found, running with no rules');
    } else {
      console.warn('[Hooks] Failed to load prompt-hooks.yaml:', err instanceof Error ? err.message : err);
    }
    return [];
  }
}

export function evaluatePrePrompt(rules: Rule[], ctx: HookContext): string[] {
  const matched: {name: string; text: string}[] = [];

  for (const rule of rules) {
    if (!rule.then.inject) continue;
    if (matchCondition(ctx, rule.when, 'pre')) {
      matched.push({name: rule.name, text: rule.then.inject});
    }
    if (matched.length >= MAX_PRE_PROMPT_RULES) break;
  }

  if (matched.length > 0) {
    console.log(`[Hooks] Pre-prompt matched ${matched.length} rule(s): ${matched.map(m => m.name).join(', ')}`);
  }

  return matched.map(m => m.text);
}

export function evaluatePostResponse(rules: Rule[], ctx: HookContext): string[] {
  const matched: {name: string; text: string}[] = [];

  for (const rule of rules) {
    if (!rule.then.append) continue;
    if (matchCondition(ctx, rule.when, 'post')) {
      matched.push({name: rule.name, text: rule.then.append});
    }
  }

  if (matched.length > 0) {
    console.log(`[Hooks] Post-response matched ${matched.length} rule(s): ${matched.map(m => m.name).join(', ')}`);
  }

  return matched.map(m => m.text);
}
