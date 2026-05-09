import {describe, it, expect, vi, beforeEach} from 'vitest';

describe('prompt registration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('loads zilliz-cli prompt from chat-proxy/cli.md', async () => {
    const prompts = await import('./prompts.js');

    prompts.loadPrompts();

    const cliPrompt = prompts.getTopicPrompt('zilliz-cli');
    expect(cliPrompt).toBeTruthy();
    expect(cliPrompt).toContain('Zilliz Cloud CLI');
  });
});
