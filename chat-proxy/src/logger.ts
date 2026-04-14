// Structured JSON logging to stdout + in-memory event store.
// Container orchestrator (CloudWatch, Datadog, etc.) collects stdout logs.
// Event store powers the admin dashboard and S3 log sink.

import {eventStore} from './event-store.js';
import type {StoreEvent} from './event-store.js';
import type {TokenUsage} from './types.js';

export function logEvent(
  sessionId: string,
  userId: string,
  eventType: string,
  agent: string,
  data: Record<string, unknown>,
): void {
  try {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({
      type: 'event',
      timestamp,
      sessionId,
      userId,
      eventType,
      agent,
      ...data,
    }));

    // Push to in-memory event store for dashboard/S3
    eventStore.push({
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
    });
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
    console.log(JSON.stringify(logData));

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
    console.log(JSON.stringify({
      type: 'user_profile',
      timestamp: new Date().toISOString(),
      userId,
      ...data,
    }));
  } catch {
    // Fire and forget
  }
}

export function ensureLogCollections(): void {
  // No-op — logging goes to stdout
}
