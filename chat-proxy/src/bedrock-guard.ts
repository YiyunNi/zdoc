import {APICallError} from '@ai-sdk/provider';
import {incCounter, observeHistogram} from './metrics.js';

const BEDROCK_GUARD_ENABLED = process.env.BEDROCK_GUARD_ENABLED !== 'false';
const BEDROCK_CHAT_MAX_CONCURRENCY = Number(process.env.BEDROCK_CHAT_MAX_CONCURRENCY || '') || 3;
const BEDROCK_EMBEDDING_MAX_CONCURRENCY = Number(process.env.BEDROCK_EMBEDDING_MAX_CONCURRENCY || '') || 2;
const BEDROCK_QUEUE_TIMEOUT_MS = Number(process.env.BEDROCK_QUEUE_TIMEOUT_MS || '') || 15000;
const BEDROCK_RETRY_MAX_ATTEMPTS = Number(process.env.BEDROCK_RETRY_MAX_ATTEMPTS || '') || 3;
const BEDROCK_RETRY_BASE_DELAY_MS = Number(process.env.BEDROCK_RETRY_BASE_DELAY_MS || '') || 500;
const BEDROCK_RETRY_MAX_DELAY_MS = Number(process.env.BEDROCK_RETRY_MAX_DELAY_MS || '') || 4000;

type BedrockOperation = 'chat' | 'embedding';
type QueueEntry = {
  resolve: (release: () => void) => void;
  reject: (err: Error) => void;
  enqueuedAt: number;
  operation: BedrockOperation;
  model: string;
  timeout: ReturnType<typeof setTimeout>;
};

class AsyncLimiter {
  private active = 0;
  private queue: QueueEntry[] = [];

  constructor(private readonly maxConcurrency: number) {}

  async acquire(operation: BedrockOperation, model: string): Promise<() => void> {
    if (!BEDROCK_GUARD_ENABLED) return () => {};

    if (this.active < this.maxConcurrency) {
      this.active++;
      return this.buildRelease();
    }

    return new Promise<() => void>((resolve, reject) => {
      const entry: QueueEntry = {
        resolve,
        reject,
        enqueuedAt: Date.now(),
        operation,
        model,
        timeout: setTimeout(() => {
          const idx = this.queue.indexOf(entry);
          if (idx >= 0) this.queue.splice(idx, 1);
          incCounter('chat_proxy_bedrock_queue_timeout_total', {operation, model});
          reject(new Error(`Bedrock ${operation} queue timeout after ${BEDROCK_QUEUE_TIMEOUT_MS}ms`));
        }, BEDROCK_QUEUE_TIMEOUT_MS),
      };
      this.queue.push(entry);
    });
  }

  private buildRelease(): () => void {
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.active = Math.max(0, this.active - 1);
      this.drain();
    };
  }

  private drain(): void {
    while (this.active < this.maxConcurrency && this.queue.length > 0) {
      const next = this.queue.shift()!;
      clearTimeout(next.timeout);
      this.active++;
      const waitMs = Date.now() - next.enqueuedAt;
      observeHistogram('chat_proxy_bedrock_queue_wait_ms', {operation: next.operation, model: next.model}, waitMs);
      next.resolve(this.buildRelease());
    }
  }
}

const chatLimiter = new AsyncLimiter(Math.max(1, BEDROCK_CHAT_MAX_CONCURRENCY));
const embeddingLimiter = new AsyncLimiter(Math.max(1, BEDROCK_EMBEDDING_MAX_CONCURRENCY));

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function bedrockAiSdkMaxRetries(provider: string): number | undefined {
  // We do Bedrock throttle retries in this guard. Disable AI SDK outer retries
  // for Bedrock to avoid multiplicative retry storms under account-level quota.
  return BEDROCK_GUARD_ENABLED && provider === 'bedrock' ? 0 : undefined;
}

export function isBedrockThrottleError(error: unknown): boolean {
  if (error instanceof Error && APICallError.isInstance(error)) {
    if (error.statusCode === 429 || error.isRetryable === true) return true;
  }

  const anyErr = error as any;
  const status = anyErr?.statusCode ?? anyErr?.status ?? anyErr?.$metadata?.httpStatusCode;
  if (status === 429 || status === 503) return true;

  const name = String(anyErr?.name || anyErr?.code || '');
  const message = error instanceof Error ? error.message : String(error ?? '');
  return /throttl|too\s*many\s*requests|rate\s*exceeded|provisioned\s*throughput|service\s*quota|quota\s*exceeded|model\s*invocation\s*throttled|429/i.test(`${name} ${message}`);
}

function getRetryAfterMs(error: unknown): number | null {
  const headers = (error as any)?.responseHeaders || (error as any)?.$response?.headers;
  if (!headers) return null;
  const retryAfterMs = headers['retry-after-ms'] ?? headers['Retry-After-Ms'];
  if (retryAfterMs != null) {
    const parsed = Number(retryAfterMs);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  const retryAfter = headers['retry-after'] ?? headers['Retry-After'];
  if (retryAfter == null) return null;
  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const dateMs = Date.parse(String(retryAfter));
  if (Number.isFinite(dateMs)) return Math.max(0, dateMs - Date.now());
  return null;
}

function retryDelayMs(attempt: number, error?: unknown): number {
  const retryAfter = getRetryAfterMs(error);
  if (retryAfter != null && retryAfter <= BEDROCK_RETRY_MAX_DELAY_MS) return retryAfter;
  const exponential = Math.min(BEDROCK_RETRY_MAX_DELAY_MS, BEDROCK_RETRY_BASE_DELAY_MS * Math.pow(2, Math.max(0, attempt - 1)));
  const jitter = Math.random() * Math.min(500, exponential);
  return Math.round(exponential + jitter);
}

function limiterFor(operation: BedrockOperation): AsyncLimiter {
  return operation === 'embedding' ? embeddingLimiter : chatLimiter;
}

export async function withBedrockLimitAndRetry<T>(
  operation: BedrockOperation,
  model: string,
  fn: () => Promise<T>,
  maxAttempts = BEDROCK_RETRY_MAX_ATTEMPTS,
): Promise<T> {
  const attempts = Math.max(1, maxAttempts);
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const release = await limiterFor(operation).acquire(operation, model);
    try {
      const result = await fn();
      release();
      return result;
    } catch (err) {
      release();
      if (!isBedrockThrottleError(err) || attempt >= attempts) throw err;
      const delayMs = retryDelayMs(attempt, err);
      incCounter('chat_proxy_bedrock_retries_total', {operation, model, reason: 'throttle'});
      console.warn('[BedrockGuard] throttled; retrying', JSON.stringify({operation, model, attempt, attempts, delayMs}));
      await sleep(delayMs);
      continue;
    }
  }
  throw new Error('Unexpected Bedrock guard retry exhaustion');
}

function wrapStream<T>(stream: ReadableStream<T>, release: () => void): ReadableStream<T> {
  let released = false;
  const releaseOnce = () => {
    if (released) return;
    released = true;
    release();
  };
  const reader = stream.getReader();
  return new ReadableStream<T>({
    async pull(controller) {
      try {
        const {done, value} = await reader.read();
        if (done) {
          releaseOnce();
          controller.close();
          return;
        }
        controller.enqueue(value);
      } catch (err) {
        releaseOnce();
        controller.error(err);
      }
    },
    async cancel(reason) {
      releaseOnce();
      await reader.cancel(reason).catch(() => {});
    },
  });
}

async function withBedrockStreamLimitAndRetry<T extends {stream?: ReadableStream<any>}>(
  operation: BedrockOperation,
  model: string,
  fn: () => Promise<T>,
  maxAttempts = BEDROCK_RETRY_MAX_ATTEMPTS,
): Promise<T> {
  const attempts = Math.max(1, maxAttempts);
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const release = await limiterFor(operation).acquire(operation, model);
    try {
      const result = await fn();
      if (result?.stream instanceof ReadableStream) {
        return {...result, stream: wrapStream(result.stream, release)};
      }
      release();
      return result;
    } catch (err) {
      release();
      if (!isBedrockThrottleError(err) || attempt >= attempts) throw err;
      const delayMs = retryDelayMs(attempt, err);
      incCounter('chat_proxy_bedrock_retries_total', {operation, model, reason: 'throttle'});
      console.warn('[BedrockGuard] stream throttled before first chunk; retrying', JSON.stringify({operation, model, attempt, attempts, delayMs}));
      await sleep(delayMs);
      continue;
    }
  }
  throw new Error('Unexpected Bedrock guard stream retry exhaustion');
}

export function guardBedrockLanguageModel<T>(model: T, modelId?: string): T {
  if (!BEDROCK_GUARD_ENABLED || !model || typeof model !== 'object') return model;
  const target = model as any;
  const id = modelId || target.modelId || 'unknown';
  if (typeof target.doGenerate !== 'function' && typeof target.doStream !== 'function') return model;

  return new Proxy(target, {
    get(obj, prop, receiver) {
      if (prop === 'doGenerate' && typeof obj.doGenerate === 'function') {
        return (options: unknown) => withBedrockLimitAndRetry('chat', id, () => Promise.resolve(obj.doGenerate.call(obj, options)));
      }
      if (prop === 'doStream' && typeof obj.doStream === 'function') {
        return (options: unknown) => withBedrockStreamLimitAndRetry('chat', id, () => Promise.resolve(obj.doStream.call(obj, options)));
      }
      return Reflect.get(obj, prop, receiver);
    },
  }) as T;
}

export function guardBedrockEmbeddingModel<T>(model: T, modelId?: string): T {
  if (!BEDROCK_GUARD_ENABLED || !model || typeof model !== 'object') return model;
  const target = model as any;
  const id = modelId || target.modelId || 'unknown';
  if (typeof target.doEmbed !== 'function') return model;

  return new Proxy(target, {
    get(obj, prop, receiver) {
      if (prop === 'doEmbed' && typeof obj.doEmbed === 'function') {
        return (options: unknown) => withBedrockLimitAndRetry('embedding', id, () => Promise.resolve(obj.doEmbed.call(obj, options)));
      }
      return Reflect.get(obj, prop, receiver);
    },
  }) as T;
}
