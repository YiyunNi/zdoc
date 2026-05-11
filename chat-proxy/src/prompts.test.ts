import {describe, it, expect, vi, beforeEach} from 'vitest';

describe('prompt registration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('loads zilliz-cli prompt from chat-proxy/prompts/zilliz-cli.md', async () => {
    const prompts = await import('./prompts.js');

    prompts.loadPrompts();

    const cliPrompt = prompts.getTopicPrompt('zilliz-cli');
    expect(cliPrompt).toBeTruthy();
    expect(cliPrompt).toContain('Zilliz Cloud CLI');
  });

  it('loads indexes prompt from chat-proxy/prompts/indexes.md', async () => {
    const prompts = await import('./prompts.js');

    prompts.loadPrompts();

    const indexesPrompt = prompts.getTopicPrompt('indexes');
    expect(indexesPrompt).toBeTruthy();
    expect(indexesPrompt).toContain('Zilliz Cloud Indexes Prompt');
  });

  it('includes index build level tuning reference in indexes prompt', async () => {
    const prompts = await import('./prompts.js');

    prompts.loadPrompts();

    const indexesPrompt = prompts.getTopicPrompt('indexes');
    expect(indexesPrompt).toBeTruthy();
    expect(indexesPrompt).toContain('https://docs.zilliz.com/docs/tune-index-build-level');
  });
});
