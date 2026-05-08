// Structured JSON logging to stdout + in-memory event store.
// Container orchestrator (CloudWatch, Datadog, etc.) collects stdout logs.
// Event store powers the admin dashboard and S3 log sink.

import {createHash, randomUUID} from 'crypto';
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

const SECRET_VALUE_PATTERNS = [
  /Bearer\s+[A-Za-z0-9._~+/=-]+/i,
  /sk-[A-Za-z0-9_-]{8,}/,
  /AKIA[0-9A-Z]{12,}/,
  /[A-Za-z0-9_./+=-]{40,}/,
  /(?:token|api[-_]?key|secret|password)=\S+/i,
];
const DEBUG_STRING_SUMMARY_THRESHOLD = 100;
const DEBUG_ARRAY_ITEM_LIMIT = 5;
const DEBUG_OBJECT_KEY_LIMIT = 25;
const DEBUG_MAX_DEPTH = 6;
const SAFE_TOKEN_COUNT_KEYS = new Set(['inputtokens', 'outputtokens', 'totaltokens', 'cachedinputtokens']);
const CORRELATION_ID_KEYS = new Set(['requestid', 'traceid', 'spanid', 'correlationid']);
const TEXT_LIKE_KEYS = new Set([
  'prompt',
  'systemprompt',
  'response',
  'answer',
  'question',
  'query',
  'error',
  'reasoning',
  'detail',
  'safemessage',
  'topicsdiscussed',
  'content',
  'message',
  'input',
  'output',
  'completion',
  'text',
]);

export interface TextLogSummary {
  chars: number;
  bytes: number;
  sha256: string;
}

export interface DebugFlowContext {
  requestId?: string;
  sessionId?: string;
  source?: string;
  agent?: string;
  model?: string;
}

export function summarizeTextForLog(text: string): TextLogSummary {
  return {
    chars: text.length,
    bytes: Buffer.byteLength(text, 'utf8'),
    sha256: createHash('sha256').update(text).digest('hex'),
  };
}

function normalizeDebugKey(key: string): string {
  return key.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function isSensitiveKey(key: string | undefined, value: unknown): boolean {
  if (!key) return false;
  const normalized = normalizeDebugKey(key);
  if (SAFE_TOKEN_COUNT_KEYS.has(normalized) && typeof value === 'number') return false;
  return normalized === 'authorization' ||
    normalized.includes('cookie') ||
    normalized.includes('password') ||
    normalized.includes('secret') ||
    normalized.includes('credential') ||
    normalized === 'apikey' ||
    normalized.endsWith('apikey') ||
    normalized === 'apikeys' ||
    normalized.endsWith('apikeys') ||
    normalized === 'token' ||
    normalized.endsWith('token') ||
    normalized === 'tokens' ||
    normalized.endsWith('tokens');
}

function safeUrlPathForLog(value: string): string {
  try {
    return new URL(value, 'http://local').pathname;
  } catch {
    return value.split(/[?#]/, 1)[0] || '';
  }
}

function isUrlLikeKey(key?: string): boolean {
  if (!key) return false;
  const normalized = normalizeDebugKey(key);
  return normalized === 'pageurl' ||
    normalized === 'pageurls' ||
    normalized === 'pagesvisited' ||
    normalized === 'referer' ||
    normalized === 'referrer';
}

function isTextLikeKey(key?: string): boolean {
  if (!key) return false;
  const normalized = normalizeDebugKey(key);
  return TEXT_LIKE_KEYS.has(normalized) ||
    normalized.endsWith('prompt') ||
    normalized.endsWith('response') ||
    normalized.endsWith('answer') ||
    normalized.endsWith('question') ||
    normalized.endsWith('query') ||
    normalized.endsWith('error') ||
    normalized.endsWith('reasoning') ||
    normalized.endsWith('detail') ||
    normalized.endsWith('safemessage') ||
    normalized.endsWith('content') ||
    normalized.endsWith('message') ||
    normalized.endsWith('input') ||
    normalized.endsWith('output') ||
    normalized.endsWith('completion') ||
    normalized.endsWith('text');
}

function isCorrelationIdKey(key?: string): boolean {
  return Boolean(key && CORRELATION_ID_KEYS.has(normalizeDebugKey(key)));
}

function shouldRedactString(value: string, key?: string): boolean {
  if (isCorrelationIdKey(key)) return false;
  return SECRET_VALUE_PATTERNS.some(pattern => pattern.test(value));
}

export function summarizeForDebugLog(value: unknown, key?: string): unknown {
  return summarizeForDebugLogInner(value, key, new WeakSet<object>(), 0);
}

function summarizeForDebugLogInner(value: unknown, key: string | undefined, seen: WeakSet<object>, depth: number): unknown {
  if (isSensitiveKey(key, value)) {
    return '[redacted]';
  }
  if (depth >= DEBUG_MAX_DEPTH) return '[max-depth]';
  if (typeof value === 'string') {
    const sanitized = value.replace(/[\x00-\x1f\x7f]/g, '');
    if (isUrlLikeKey(key)) return safeUrlPathForLog(sanitized);
    if (shouldRedactString(sanitized, key)) return '[redacted]';
    if (isTextLikeKey(key) || sanitized.length >= DEBUG_STRING_SUMMARY_THRESHOLD) return summarizeTextForLog(sanitized);
    return sanitized;
  }
  if (Array.isArray(value)) {
    if (seen.has(value)) return '[circular]';
    seen.add(value);
    const summary = {
      length: value.length,
      items: value.slice(0, DEBUG_ARRAY_ITEM_LIMIT).map(item => summarizeForDebugLogInner(item, key, seen, depth + 1)),
    };
    seen.delete(value);
    return summary;
  }
  if (value && typeof value === 'object') {
    if (seen.has(value)) return '[circular]';
    seen.add(value);
    const summarized: Record<string, unknown> = {};
    const entries = Object.entries(value).slice(0, DEBUG_OBJECT_KEY_LIMIT);
    for (const [k, v] of entries) {
      summarized[k] = summarizeForDebugLogInner(v, k, seen, depth + 1);
    }
    const totalKeys = Object.keys(value).length;
    if (totalKeys > DEBUG_OBJECT_KEY_LIMIT) {
      summarized.__omittedKeys = totalKeys - DEBUG_OBJECT_KEY_LIMIT;
    }
    seen.delete(value);
    return summarized;
  }
  return value;
}

function safeSummaryString(value: unknown): string | undefined {
  if (value == null) return undefined;
  return typeof value === 'string' ? value : JSON.stringify(value);
}

export function isChatFlowDebugEnabled(): boolean {
  return process.env.DEBUG_CHAT_FLOW === 'true';
}

export function logDebugFlow(
  event: string,
  context: DebugFlowContext = {},
  data: Record<string, unknown> = {},
): void {
  if (!isChatFlowDebugEnabled()) return;
  try {
    const safeContext = summarizeForDebugLog(context) as DebugFlowContext;
    const payload = sanitizeLogValue({
      type: 'debug',
      debugType: 'chat_flow',
      event,
      timestamp: new Date().toISOString(),
      requestId: safeContext.requestId,
      sessionId: safeContext.sessionId,
      source: safeContext.source,
      agent: safeContext.agent,
      model: safeContext.model,
      data: summarizeForDebugLog(data),
    });
    console.log(JSON.stringify(payload));
  } catch {
    // Fire and forget
  }
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
    const safeData = summarizeForDebugLog(data) as Record<string, unknown>;
    const safeUserMeta = userMeta ? summarizeForDebugLog(userMeta) as Record<string, unknown> : undefined;
    console.log(JSON.stringify(sanitizeLogValue({
      type: 'event',
      timestamp,
      sessionId,
      userId,
      eventType,
      agent,
      source,
      ...safeData,
    })));

    const event = {
      id,
      timestamp,
      type: eventType as StoreEvent['type'],
      sessionId,
      userId,
      agent,
      model: typeof safeData.model === 'string' ? safeData.model : undefined,
      data: safeData,
      inputTokens: typeof safeData.inputTokens === 'number' ? safeData.inputTokens : undefined,
      outputTokens: typeof safeData.outputTokens === 'number' ? safeData.outputTokens : undefined,
      totalTokens: typeof safeData.totalTokens === 'number' ? safeData.totalTokens : undefined,
      cachedInputTokens: typeof safeData.cachedInputTokens === 'number' ? safeData.cachedInputTokens : undefined,
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
      data: safeData,
      inputTokens: event.inputTokens,
      outputTokens: event.outputTokens,
      totalTokens: event.totalTokens,
      cachedInputTokens: event.cachedInputTokens,
      source,
    }).catch(() => {});

    // Upsert session metadata on assistant message events
    if (eventType === 'message' && safeData.role === 'assistant') {
      upsertObsSession({
        id: sessionId,
        userId,
        agent,
        model: typeof safeData.model === 'string' ? safeData.model : undefined,
        pageUrl: typeof safeData.pageUrl === 'string' ? safeData.pageUrl : undefined,
        firstQuestion: safeSummaryString(safeData.questionSummary ?? safeData.messageSummary ?? safeData.contentSummary),
        userMeta: safeUserMeta,
        source,
      }).catch(() => {});
    }
  } catch {
    // Fire and forget
  }
}

export interface ConversationData {
  id: string;
  requestId?: string;
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
      requestId: conv.requestId,
      userId: conv.userId,
      sessionId: conv.sessionId,
      messageCount: conv.messages.length,
      agentTypesUsed: conv.agentTypesUsed,
      toolsCalled: conv.toolsCalled,
      sourcesCount: conv.sourcesReturned.length,
      confidenceLevels: conv.confidenceLevels,
      pageUrls: conv.pageUrls.map(safeUrlPathForLog),
      feedbackSummary: conv.feedbackSummary,
    };
    if (conv.tokenUsage) {
      logData.tokenUsage = conv.tokenUsage;
    }
    console.log(JSON.stringify(sanitizeLogValue(logData)));

    const storeData: Record<string, unknown> = {
      requestId: conv.requestId,
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
    requestId?: string;
    agentsUsed?: Record<string, number>;
    topicsDiscussed?: string[];
    pagesVisited?: string[];
    feedbackGiven?: {up: number; down: number};
  },
): void {
  try {
    const safeData = summarizeForDebugLog(data) as Record<string, unknown>;
    console.log(JSON.stringify(sanitizeLogValue({
      type: 'user_profile',
      timestamp: new Date().toISOString(),
      userId,
      ...safeData,
    })));
  } catch {
    // Fire and forget
  }
}

export function ensureLogCollections(): void {
  // No-op — logging goes to stdout
}
