import { randomUUID } from 'crypto';

export interface StoreEvent {
  id: string;
  timestamp: string;
  type: 'message' | 'routing' | 'tool_call' | 'feedback' | 'error' | 'conversation';
  sessionId: string;
  userId: string;
  agent: string;
  model?: string;
  data: Record<string, unknown>;
  // Token usage fields (populated when type === 'message')
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  cachedInputTokens?: number;
}

export interface LiveSession {
  id: string;
  userId: string;
  lastActive: string;
  messageCount: number;
  agent: string;
  model: string | undefined;
  confidence: string | undefined;
  lastQuestion: string | undefined;
}

export interface PerformanceRow {
  type: string;
  model: string;
  count: number;
  avgLatencyMs: number;
  confidenceDist: { high: number; medium: number; low: number };
  avgSources: number;
  errorRate: number;
}

export interface TokenUsageRow {
  model: string;
  requestCount: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  totalCachedInputTokens: number;
}

class EventStore {
  private buffer: StoreEvent[];
  private head: number;
  private count: number;
  private readonly maxSize: number;

  constructor(maxSize = 5000) {
    this.maxSize = maxSize;
    this.buffer = new Array<StoreEvent>(maxSize);
    this.head = 0;
    this.count = 0;
  }

  push(event: Omit<StoreEvent, 'id'> & { id?: string }): StoreEvent {
    const full: StoreEvent = { ...event, id: event.id ?? randomUUID() } as StoreEvent;
    this.buffer[this.head] = full;
    this.head = (this.head + 1) % this.maxSize;
    if (this.count < this.maxSize) this.count++;
    return full;
  }

  /** Return all events, newest first. */
  getAll(): StoreEvent[] {
    const result: StoreEvent[] = [];
    for (let i = 0; i < this.count; i++) {
      const idx = (this.head - 1 - i + this.maxSize) % this.maxSize;
      result.push(this.buffer[idx]);
    }
    return result;
  }

  /** Active sessions from the last 30 minutes, grouped by sessionId. */
  getLive(): LiveSession[] {
    const cutoff = Date.now() - 30 * 60 * 1000;
    const sessions = new Map<string, {
      userId: string;
      lastActive: string;
      messageCount: number;
      agent: string;
      model: string | undefined;
      confidence: string | undefined;
      lastQuestion: string | undefined;
    }>();

    // Iterate oldest-first so later events overwrite earlier ones
    const all = this.getAll().reverse();
    for (const ev of all) {
      if (new Date(ev.timestamp).getTime() < cutoff) continue;

      const existing = sessions.get(ev.sessionId);
      if (!existing) {
        sessions.set(ev.sessionId, {
          userId: ev.userId,
          lastActive: ev.timestamp,
          messageCount: ev.type === 'message' ? 1 : 0,
          agent: ev.agent,
          model: ev.model,
          confidence: typeof ev.data.confidence === 'string' ? ev.data.confidence : undefined,
          lastQuestion: typeof ev.data.question === 'string' ? ev.data.question : undefined,
        });
      } else {
        if (new Date(ev.timestamp) > new Date(existing.lastActive)) {
          existing.lastActive = ev.timestamp;
        }
        if (ev.type === 'message') existing.messageCount++;
        existing.agent = ev.agent;
        if (ev.model) existing.model = ev.model;
        if (typeof ev.data.confidence === 'string') existing.confidence = ev.data.confidence;
        if (typeof ev.data.question === 'string') existing.lastQuestion = ev.data.question;
      }
    }

    return Array.from(sessions.entries())
      .map(([id, s]) => ({ id, ...s }))
      .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
  }

  /** Aggregate performance stats by agent+model. */
  getPerformance(): PerformanceRow[] {
    const buckets = new Map<string, {
      type: string;
      model: string;
      count: number;
      totalLatency: number;
      confidenceDist: { high: number; medium: number; low: number };
      totalSources: number;
      errorCount: number;
    }>();

    for (let i = 0; i < this.count; i++) {
      const idx = (this.head - 1 - i + this.maxSize) % this.maxSize;
      const ev = this.buffer[idx];
      // Only count message and error events for performance stats
      // (skip routing, tool_call, conversation which don't represent responses)
      if (ev.type !== 'message' && ev.type !== 'error') continue;
      const key = `${ev.agent}|${ev.model ?? 'unknown'}`;

      let bucket = buckets.get(key);
      if (!bucket) {
        bucket = {
          type: ev.agent,
          model: ev.model ?? 'unknown',
          count: 0,
          totalLatency: 0,
          confidenceDist: { high: 0, medium: 0, low: 0 },
          totalSources: 0,
          errorCount: 0,
        };
        buckets.set(key, bucket);
      }

      bucket.count++;

      if (typeof ev.data.latencyMs === 'number') {
        bucket.totalLatency += ev.data.latencyMs;
      }

      const conf = ev.data.confidence;
      if (conf === 'high') bucket.confidenceDist.high++;
      else if (conf === 'medium') bucket.confidenceDist.medium++;
      else if (conf === 'low') bucket.confidenceDist.low++;

      if (typeof ev.data.sources === 'number') {
        bucket.totalSources += ev.data.sources;
      } else if (Array.isArray(ev.data.sources)) {
        bucket.totalSources += ev.data.sources.length;
      }

      if (ev.type === 'error') bucket.errorCount++;
    }

    return Array.from(buckets.values()).map((b) => ({
      type: b.type,
      model: b.model,
      count: b.count,
      avgLatencyMs: b.count > 0 ? Math.round(b.totalLatency / b.count) : 0,
      confidenceDist: b.confidenceDist,
      avgSources: b.count > 0 ? Math.round((b.totalSources / b.count) * 10) / 10 : 0,
      errorRate: b.count > 0 ? Math.round((b.errorCount / b.count) * 1000) / 1000 : 0,
    }));
  }

  /** Feedback events, newest first. */
  getFeedback(limit = 50): StoreEvent[] {
    const result: StoreEvent[] = [];
    for (let i = 0; i < this.count && result.length < limit; i++) {
      const idx = (this.head - 1 - i + this.maxSize) % this.maxSize;
      const ev = this.buffer[idx];
      if (ev.type === 'feedback') result.push(ev);
    }
    return result;
  }

  /** Error events or blocked/empty responses, newest first. */
  getErrors(limit = 50): StoreEvent[] {
    const result: StoreEvent[] = [];
    for (let i = 0; i < this.count && result.length < limit; i++) {
      const idx = (this.head - 1 - i + this.maxSize) % this.maxSize;
      const ev = this.buffer[idx];
      if (
        ev.type === 'error' ||
        ev.data.blocked === true ||
        ev.data.content === ''
      ) {
        result.push(ev);
      }
    }
    return result;
  }

  /** Message events with medium or low confidence, newest first. */
  getLowConfidence(limit = 50): StoreEvent[] {
    const result: StoreEvent[] = [];
    for (let i = 0; i < this.count && result.length < limit; i++) {
      const idx = (this.head - 1 - i + this.maxSize) % this.maxSize;
      const ev = this.buffer[idx];
      if (
        ev.type === 'message' &&
        (ev.data.confidence === 'medium' || ev.data.confidence === 'low')
      ) {
        result.push(ev);
      }
    }
    return result;
  }

  /** Return all events inserted after the event with the given id (for batch upload). */
  getNewSince(lastId: string): StoreEvent[] {
    const all = this.getAll(); // newest first
    const cutIdx = all.findIndex((e) => e.id === lastId);
    if (cutIdx === -1) return all; // id not found, return everything
    return all.slice(0, cutIdx);   // everything newer than lastId
  }

  size(): number {
    return this.count;
  }

  /** Aggregate overview metrics for the dashboard. */
  getOverviewMetrics() {
    let conversations = new Set<string>();
    let messages = 0;
    let users = new Set<string>();
    let thumbsUp = 0;
    let thumbsDown = 0;
    let highConfidence = 0;
    let totalConfidence = 0;

    for (let i = 0; i < this.count; i++) {
      const idx = (this.head - 1 - i + this.maxSize) % this.maxSize;
      const ev = this.buffer[idx];
      conversations.add(ev.sessionId);
      users.add(ev.userId);

      if (ev.type === 'message') {
        messages++;
        const conf = ev.data.confidence;
        if (conf === 'high' || conf === 'medium' || conf === 'low') {
          totalConfidence++;
          if (conf === 'high') highConfidence++;
        }
      }

      if (ev.type === 'feedback') {
        if (ev.data.rating === 'up') thumbsUp++;
        else if (ev.data.rating === 'down') thumbsDown++;
      }
    }

    return {
      conversations: conversations.size,
      messages,
      distinctUsers: users.size,
      avgConfidence: totalConfidence > 0 ? Math.round((highConfidence / totalConfidence) * 100) : 0,
      thumbsUp,
      thumbsDown,
    };
  }

  /** Get daily trend data for the last N days. */
  getTrends(days = 7): Record<string, {date: string; value: number}[]> {
    const metrics = {
      conversations: [] as {date: string; value: number}[],
      messages: [] as {date: string; value: number}[],
      users: [] as {date: string; value: number}[],
      confidence: [] as {date: string; value: number}[],
    };

    // Build day buckets
    const now = new Date();
    const dayBuckets = new Map<string, {
      sessions: Set<string>;
      messages: number;
      users: Set<string>;
      highConf: number;
      totalConf: number;
    }>();

    for (let d = days - 1; d >= 0; d--) {
      const date = new Date(now);
      date.setDate(date.getDate() - d);
      const key = date.toISOString().slice(0, 10);
      dayBuckets.set(key, {
        sessions: new Set(),
        messages: 0,
        users: new Set(),
        highConf: 0,
        totalConf: 0,
      });
    }

    // Aggregate events into day buckets
    for (let i = 0; i < this.count; i++) {
      const idx = (this.head - 1 - i + this.maxSize) % this.maxSize;
      const ev = this.buffer[idx];
      const dayKey = ev.timestamp.slice(0, 10);
      const bucket = dayBuckets.get(dayKey);
      if (!bucket) continue;

      bucket.sessions.add(ev.sessionId);
      bucket.users.add(ev.userId);

      if (ev.type === 'message') {
        bucket.messages++;
        const conf = ev.data.confidence;
        if (conf === 'high' || conf === 'medium' || conf === 'low') {
          bucket.totalConf++;
          if (conf === 'high') bucket.highConf++;
        }
      }
    }

    for (const [date, bucket] of dayBuckets) {
      metrics.conversations.push({date, value: bucket.sessions.size});
      metrics.messages.push({date, value: bucket.messages});
      metrics.users.push({date, value: bucket.users.size});
      metrics.confidence.push({
        date,
        value: bucket.totalConf > 0 ? Math.round((bucket.highConf / bucket.totalConf) * 100) : 0,
      });
    }

    return metrics;
  }

  /** Get recent activity events for the dashboard feed. */
  getRecentActivity(limit = 10): StoreEvent[] {
    const result: StoreEvent[] = [];
    for (let i = 0; i < this.count && result.length < limit; i++) {
      const idx = (this.head - 1 - i + this.maxSize) % this.maxSize;
      const ev = this.buffer[idx];
      if (ev.type === 'message') result.push(ev);
    }
    return result;
  }

  /** Aggregate token usage by model from message events. */
  getTokenUsage(): TokenUsageRow[] {
    const buckets = new Map<string, {
      model: string;
      requestCount: number;
      totalInputTokens: number;
      totalOutputTokens: number;
      totalTokens: number;
      totalCachedInputTokens: number;
    }>();

    for (let i = 0; i < this.count; i++) {
      const idx = (this.head - 1 - i + this.maxSize) % this.maxSize;
      const ev = this.buffer[idx];
      if (ev.type !== 'message') continue;
      if (ev.totalTokens == null) continue; // no token data for this event

      const model = ev.model ?? 'unknown';
      let bucket = buckets.get(model);
      if (!bucket) {
        bucket = { model, requestCount: 0, totalInputTokens: 0, totalOutputTokens: 0, totalTokens: 0, totalCachedInputTokens: 0 };
        buckets.set(model, bucket);
      }

      bucket.requestCount++;
      bucket.totalInputTokens += ev.inputTokens ?? 0;
      bucket.totalOutputTokens += ev.outputTokens ?? 0;
      bucket.totalTokens += ev.totalTokens ?? 0;
      bucket.totalCachedInputTokens += ev.cachedInputTokens ?? 0;
    }

    return Array.from(buckets.values()).sort((a, b) => b.totalTokens - a.totalTokens);
  }
}

export const eventStore = new EventStore();
export { EventStore };
