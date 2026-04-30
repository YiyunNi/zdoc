// Structured JSON logging to stdout + in-memory event store.
// Container orchestrator (CloudWatch, Datadog, etc.) collects stdout logs.
// Event store powers the admin dashboard and S3 log sink.

import {randomUUID} from 'crypto';
import {eventStore} from './event-store.js';
import type {StoreEvent} from './event-store.js';
import type {TokenUsage} from './types.js';
import {saveObsEvent, upsertObsSession} from './db.js';

function sanitizeLogValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(/[\x00-\x1f\x7f]/g, '');
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeLogValue);
  }
  if (value && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      sanitized[k] = sanitizeLogValue(v);
    }
    return sanitized;
  }
  return value;
}

export function logEvent(
  sessionId: string,
  userId: string,
  eventType: string,
  agent: string,
  data: Record<string, unknown>,
  userMeta?: Record<string, unknown>,
  source: string = 'docs',
): void {
  try {
    const timestamp = new Date().toISOString();
    const id = randomUUID();
    console.log(JSON.stringify(sanitizeLogValue({
      type: 'event',
      timestamp,
      sessionId,
      userId,
      eventType,
      agent,
      source,
      ...data,
    })));

    const event = {
      id,
      timestamp,
      type: eventType as StoreEvent['type'],
      sessionId,
      userId,
      agent,
      model: typeof data.model === 'string' ? data.model : undefined,
      data,
      inputTokens: typeof data.inputTokens === 'number' ? data.inputTokens : undefined,
      outputTokens: typeof data.outputTokens === 'number' ? data.outputTokens : undefined,
      totalTokens: typeof data.totalTokens === 'number' ? data.totalTokens : undefined,
      cachedInputTokens: typeof data.cachedInputTokens === 'number' ? data.cachedInputTokens : undefined,
    };

    // Push to in-memory event store for dashboard/S3
    eventStore.push(event);

    // Persist to PostgreSQL
    saveObsEvent({
      id: event.id,
      timestamp: event.timestamp,
      eventType,
      sessionId,
      userId,
      agent,
      model: event.model,
      data,
      inputTokens: event.inputTokens,
      outputTokens: event.outputTokens,
      totalTokens: event.totalTokens,
      cachedInputTokens: event.cachedInputTokens,
      source,
    }).catch(() => {});

    // Upsert session metadata on assistant message events
    if (eventType === 'message' && data.role === 'assistant') {
      upsertObsSession({
        id: sessionId,
        userId,
        agent,
        model: typeof data.model === 'string' ? data.model : undefined,
        pageUrl: typeof data.pageUrl === 'string' ? data.pageUrl : undefined,
        firstQuestion: typeof data.question === 'string' ? String(data.question).slice(0, 100) : undefined,
        userMeta,
        source,
      }).catch(() => {});
    }
  } catch {
    // Fire and forget
  }
}

export interface ConversationData {
  id: string;
  userId: string;
  sessionId: string;
  messages: Array<{role: string; content: string}>;
  agentTypesUsed: string[];
  toolsCalled: string[];
  sourcesReturned: string[];
  confidenceLevels: string[];
  pageUrls: string[];
  feedbackSummary: {up: number; down: number};
  tokenUsage?: TokenUsage;
}

export function saveConversation(conv: ConversationData): void {
  try {
    const timestamp = new Date().toISOString();
    const logData: Record<string, unknown> = {
      type: 'conversation',
      timestamp,
      id: conv.id,
      userId: conv.userId,
      sessionId: conv.sessionId,
      messageCount: conv.messages.length,
      agentTypesUsed: conv.agentTypesUsed,
      toolsCalled: conv.toolsCalled,
      sourcesCount: conv.sourcesReturned.length,
      confidenceLevels: conv.confidenceLevels,
      pageUrls: conv.pageUrls,
      feedbackSummary: conv.feedbackSummary,
    };
    if (conv.tokenUsage) {
      logData.tokenUsage = conv.tokenUsage;
    }
    console.log(JSON.stringify(sanitizeLogValue(logData)));

    const storeData: Record<string, unknown> = {
      messageCount: conv.messages.length,
      agentTypesUsed: conv.agentTypesUsed,
      toolsCalled: conv.toolsCalled,
      sourcesCount: conv.sourcesReturned.length,
      confidenceLevels: conv.confidenceLevels,
    };
    if (conv.tokenUsage) {
      storeData.inputTokens = conv.tokenUsage.inputTokens;
      storeData.outputTokens = conv.tokenUsage.outputTokens;
      storeData.totalTokens = conv.tokenUsage.totalTokens;
      storeData.cachedInputTokens = conv.tokenUsage.cachedInputTokens ?? 0;
    }

    eventStore.push({
      timestamp,
      type: 'conversation',
      sessionId: conv.sessionId,
      userId: conv.userId,
      agent: conv.agentTypesUsed[0] || 'unknown',
      data: storeData,
    });
  } catch {
    // Fire and forget
  }
}

export function updateUserProfile(
  userId: string,
  data: {
    agentsUsed?: Record<string, number>;
    topicsDiscussed?: string[];
    pagesVisited?: string[];
    feedbackGiven?: {up: number; down: number};
  },
): void {
  try {
    console.log(JSON.stringify(sanitizeLogValue({
      type: 'user_profile',
      timestamp: new Date().toISOString(),
      userId,
      ...data,
    })));
  } catch {
    // Fire and forget
  }
}

export function ensureLogCollections(): void {
  // No-op — logging goes to stdout
}
