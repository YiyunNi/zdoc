// Structured JSON logging to stdout + in-memory event store.
// Container orchestrator (CloudWatch, Datadog, etc.) collects stdout logs.
// Event store powers the admin dashboard and S3 log sink.

import {eventStore} from './event-store.js';
import type {StoreEvent} from './event-store.js';

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
}

export function saveConversation(conv: ConversationData): void {
  try {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({
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
    }));

    eventStore.push({
      timestamp,
      type: 'conversation',
      sessionId: conv.sessionId,
      userId: conv.userId,
      agent: conv.agentTypesUsed[0] || 'unknown',
      data: {
        messageCount: conv.messages.length,
        agentTypesUsed: conv.agentTypesUsed,
        toolsCalled: conv.toolsCalled,
        sourcesCount: conv.sourcesReturned.length,
        confidenceLevels: conv.confidenceLevels,
      },
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
