import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {APICallError} from '@ai-sdk/provider';

const BEDROCK_ENV_KEYS = [
  'BEDROCK_GUARD_ENABLED',
  'BEDROCK_CHAT_MAX_CONCURRENCY',
  'BEDROCK_EMBEDDING_MAX_CONCURRENCY',
  'BEDROCK_QUEUE_TIMEOUT_MS',
  'BEDROCK_RETRY_MAX_ATTEMPTS',
  'BEDROCK_RETRY_BASE_DELAY_MS',
  'BEDROCK_RETRY_MAX_DELAY_MS',
];

function throttleError(): APICallError {
  return new APICallError({
    message: 'Rate exceeded',
    url: 'https://bedrock-runtime.mock/invoke',
    requestBodyValues: {},
    statusCode: 429,
    isRetryable: true,
  });
}

async function loadGuard(env: Record<string, string> = {}) {
  vi.resetModules();
  process.env.BEDROCK_GUARD_ENABLED = 'true';
  process.env.BEDROCK_CHAT_MAX_CONCURRENCY = '1';
  process.env.BEDROCK_EMBEDDING_MAX_CONCURRENCY = '1';
  process.env.BEDROCK_QUEUE_TIMEOUT_MS = '1000';
  process.env.BEDROCK_RETRY_MAX_ATTEMPTS = '3';
  process.env.BEDROCK_RETRY_BASE_DELAY_MS = '1';
  process.env.BEDROCK_RETRY_MAX_DELAY_MS = '5';
  Object.assign(process.env, env);
  return import('./bedrock-guard.js');
}

function resetBedrockEnv() {
  for (const key of BEDROCK_ENV_KEYS) {
    delete process.env[key];
  }
}

describe('bedrock guard', () => {
  beforeEach(() => {
    resetBedrockEnv();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    resetBedrockEnv();
    vi.restoreAllMocks();
  });

  it('detects Bedrock throttling and 429 errors', async () => {
    const {isBedrockThrottleError} = await loadGuard();

    expect(isBedrockThrottleError(throttleError())).toBe(true);
    expect(isBedrockThrottleError({name: 'ThrottlingException', message: 'Model invocation throttled'})).toBe(true);
    expect(isBedrockThrottleError({$metadata: {httpStatusCode: 429}, message: 'Too many requests'})).toBe(true);
    expect(isBedrockThrottleError(new Error('unrelated provider failure'))).toBe(false);
  });

  it('retries throttled calls with backoff until success', async () => {
    const {withBedrockLimitAndRetry} = await loadGuard();
    let attempts = 0;

    const result = await withBedrockLimitAndRetry('chat', 'mock-sonnet', async () => {
      attempts++;
      if (attempts < 3) throw throttleError();
      return 'ok-after-retry';
    });

    expect(result).toBe('ok-after-retry');
    expect(attempts).toBe(3);
    expect(console.warn).toHaveBeenCalledTimes(2);
  });

  it('throws after max throttle retry attempts', async () => {
    const {withBedrockLimitAndRetry} = await loadGuard();
    let attempts = 0;

    await expect(withBedrockLimitAndRetry('chat', 'mock-sonnet', async () => {
      attempts++;
      throw throttleError();
    }, 2)).rejects.toThrow(/Rate exceeded/);

    expect(attempts).toBe(2);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('limits concurrent Bedrock chat calls', async () => {
    const {withBedrockLimitAndRetry} = await loadGuard({BEDROCK_CHAT_MAX_CONCURRENCY: '1'});
    let active = 0;
    let maxActive = 0;

    const results = await Promise.all(Array.from({length: 4}, (_, i) => withBedrockLimitAndRetry('chat', 'mock-sonnet', async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise(resolve => setTimeout(resolve, 10));
      active--;
      return i;
    })));

    expect(results).toEqual([0, 1, 2, 3]);
    expect(maxActive).toBe(1);
  });

  it('wraps Bedrock language models with limiter and retry behavior', async () => {
    const {guardBedrockLanguageModel} = await loadGuard();
    let attempts = 0;
    const model = {
      provider: 'amazon-bedrock',
      modelId: 'mock-sonnet',
      supportedUrls: {},
      doGenerate: vi.fn(async () => {
        attempts++;
        if (attempts === 1) throw throttleError();
        return {
          content: [],
          finishReason: 'stop',
          usage: {inputTokens: 1, outputTokens: 1, totalTokens: 2},
          warnings: [],
        };
      }),
    } as any;

    const guarded = guardBedrockLanguageModel(model, 'mock-sonnet') as any;
    const result = await guarded.doGenerate({});

    expect(result.finishReason).toBe('stop');
    expect(model.doGenerate).toHaveBeenCalledTimes(2);
  });

  it('disables AI SDK outer retries for Bedrock when guard is enabled', async () => {
    const {bedrockAiSdkMaxRetries} = await loadGuard();

    expect(bedrockAiSdkMaxRetries('bedrock')).toBe(0);
    expect(bedrockAiSdkMaxRetries('openai-compatible')).toBeUndefined();
  });
});
