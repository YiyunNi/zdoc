import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {loadRules, evaluatePrePrompt, evaluatePostResponse} from './index.js';
import type {Rule, HookContext} from './types.js';

// Mock fs and js-yaml for loadRules tests
vi.mock('node:fs', () => ({
  readFileSync: vi.fn(),
}));

vi.mock('js-yaml', () => ({
  default: {load: vi.fn()},
}));

import {readFileSync} from 'node:fs';
import yaml from 'js-yaml';

const mockReadFileSync = vi.mocked(readFileSync);
const mockYamlLoad = vi.mocked(yaml.load);

describe('loadRules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads and sorts rules by priority', () => {
    mockReadFileSync.mockReturnValue('yaml content');
    mockYamlLoad.mockReturnValue({
      rules: [
        {name: 'b', priority: 20, when: {keywords: ['test']}, then: {inject: 'b'}},
        {name: 'a', priority: 10, when: {keywords: ['test']}, then: {inject: 'a'}},
      ],
    });

    const rules = loadRules('file:///fake/src/hooks/index.ts');
    expect(rules).toHaveLength(2);
    expect(rules[0].name).toBe('a');
    expect(rules[1].name).toBe('b');
  });

  it('filters out disabled rules', () => {
    mockReadFileSync.mockReturnValue('yaml content');
    mockYamlLoad.mockReturnValue({
      rules: [
        {name: 'enabled', when: {keywords: ['test']}, then: {inject: 'x'}},
        {name: 'disabled', enabled: false, when: {keywords: ['test']}, then: {inject: 'y'}},
      ],
    });

    const rules = loadRules('file:///fake/src/hooks/index.ts');
    expect(rules).toHaveLength(1);
    expect(rules[0].name).toBe('enabled');
  });

  it('skips rules with invalid agents', () => {
    mockReadFileSync.mockReturnValue('yaml content');
    mockYamlLoad.mockReturnValue({
      rules: [
        {name: 'bad-agent', when: {keywords: ['test'], agents: ['invalid']}, then: {inject: 'x'}},
      ],
    });

    const rules = loadRules('file:///fake/src/hooks/index.ts');
    expect(rules).toHaveLength(0);
  });

  it('skips rules missing then action', () => {
    mockReadFileSync.mockReturnValue('yaml content');
    mockYamlLoad.mockReturnValue({
      rules: [
        {name: 'no-action', when: {keywords: ['test']}, then: {}},
      ],
    });

    const rules = loadRules('file:///fake/src/hooks/index.ts');
    expect(rules).toHaveLength(0);
  });

  it('returns empty array for missing file', () => {
    const err = new Error('ENOENT') as Error & {code: string};
    err.code = 'ENOENT';
    mockReadFileSync.mockImplementation(() => { throw err; });

    const rules = loadRules('file:///fake/src/hooks/index.ts');
    expect(rules).toEqual([]);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('not found'));
  });

  it('defaults priority to 100', () => {
    mockReadFileSync.mockReturnValue('yaml content');
    mockYamlLoad.mockReturnValue({
      rules: [
        {name: 'no-priority', when: {keywords: ['test']}, then: {inject: 'x'}},
      ],
    });

    const rules = loadRules('file:///fake/src/hooks/index.ts');
    expect(rules[0].priority).toBe(100);
  });
});

describe('evaluatePrePrompt', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const makeRule = (name: string, priority: number, keywords: string[], inject?: string, append?: string): Rule => ({
    name,
    enabled: true,
    priority,
    when: {keywords},
    then: {inject, append},
  });

  it('returns inject texts for matching rules', () => {
    const rules = [makeRule('r1', 10, ['pricing'], 'inject1')];
    const ctx: HookContext = {message: 'What is pricing?', agentType: 'general'};
    expect(evaluatePrePrompt(rules, ctx)).toEqual(['inject1']);
  });

  it('skips rules without inject', () => {
    const rules = [makeRule('r1', 10, ['pricing'], undefined, 'append only')];
    const ctx: HookContext = {message: 'What is pricing?', agentType: 'general'};
    expect(evaluatePrePrompt(rules, ctx)).toEqual([]);
  });

  it('caps at 5 rules', () => {
    const rules = Array.from({length: 8}, (_, i) =>
      makeRule(`r${i}`, i, ['pricing'], `inject${i}`)
    );
    const ctx: HookContext = {message: 'pricing', agentType: 'general'};
    expect(evaluatePrePrompt(rules, ctx)).toHaveLength(5);
  });

  it('returns empty for no matches', () => {
    const rules = [makeRule('r1', 10, ['enterprise'], 'inject1')];
    const ctx: HookContext = {message: 'hello world', agentType: 'general'};
    expect(evaluatePrePrompt(rules, ctx)).toEqual([]);
  });
});

describe('evaluatePostResponse', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns append texts for matching rules', () => {
    const rules: Rule[] = [{
      name: 'r1',
      enabled: true,
      priority: 10,
      when: {keywords: ['pricing'], confidence: ['low']},
      then: {append: 'cta text'},
    }];
    const ctx: HookContext = {message: 'pricing info', agentType: 'general', confidence: 'low'};
    expect(evaluatePostResponse(rules, ctx)).toEqual(['cta text']);
  });

  it('respects confidence filter in post phase', () => {
    const rules: Rule[] = [{
      name: 'r1',
      enabled: true,
      priority: 10,
      when: {keywords: ['pricing'], confidence: ['low']},
      then: {append: 'cta text'},
    }];
    const ctx: HookContext = {message: 'pricing info', agentType: 'general', confidence: 'high'};
    expect(evaluatePostResponse(rules, ctx)).toEqual([]);
  });
});
