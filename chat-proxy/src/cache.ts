import {createHash} from 'node:crypto';

export interface CacheStats {
  name: string;
  size: number;
  maxEntries: number;
  ttlMs: number;
  hits: number;
  misses: number;
  sets: number;
  evictions: number;
  expirations: number;
}

interface CacheEntry<V> {
  value: V;
  expiresAt: number;
}

export class LruTtlCache<V> {
  private readonly entries = new Map<string, CacheEntry<V>>();
  private hits = 0;
  private misses = 0;
  private sets = 0;
  private evictions = 0;
  private expirations = 0;

  constructor(private readonly options: {name: string; maxEntries: number; ttlMs: number}) {}

  get(key: string): V | undefined {
    const entry = this.entries.get(key);
    if (!entry) {
      this.misses++;
      return undefined;
    }

    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      this.expirations++;
      this.misses++;
      return undefined;
    }

    // Refresh LRU order on hit.
    this.entries.delete(key);
    this.entries.set(key, entry);
    this.hits++;
    return entry.value;
  }

  set(key: string, value: V, ttlMs = this.options.ttlMs): void {
    if (this.options.maxEntries <= 0 || ttlMs <= 0) return;

    if (this.entries.has(key)) {
      this.entries.delete(key);
    }

    while (this.entries.size >= this.options.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (!oldest) break;
      this.entries.delete(oldest);
      this.evictions++;
    }

    this.entries.set(key, {value, expiresAt: Date.now() + ttlMs});
    this.sets++;
  }

  delete(key: string): boolean {
    return this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }

  size(): number {
    this.pruneExpired();
    return this.entries.size;
  }

  stats(): CacheStats {
    this.pruneExpired();
    return {
      name: this.options.name,
      size: this.entries.size,
      maxEntries: this.options.maxEntries,
      ttlMs: this.options.ttlMs,
      hits: this.hits,
      misses: this.misses,
      sets: this.sets,
      evictions: this.evictions,
      expirations: this.expirations,
    };
  }

  private pruneExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.entries) {
      if (entry.expiresAt <= now) {
        this.entries.delete(key);
        this.expirations++;
      }
    }
  }
}

export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
}

export function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {promise, resolve, reject};
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;

  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj).sort().map(key => `${JSON.stringify(key)}:${stableStringify(obj[key])}`).join(',')}}`;
}

export function stableHash(input: unknown): string {
  const serialized = typeof input === 'string' ? input : stableStringify(input);
  return createHash('sha256').update(serialized).digest('hex').slice(0, 24);
}

export function normalizeQuery(query: string): string {
  return query
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?!。！？]+$/g, '')
    .trim();
}
