import {randomUUID} from 'crypto';
import {generateEmbedding} from './rag.js';
import {zillizRequest, isZillizConfigured, EMBEDDING_DIM} from './zilliz-client.js';

// ---------------------------------------------------------------------------
// Event buffer (batched writes)
// ---------------------------------------------------------------------------

interface LogEvent {
  id: string;
  conversation_id: string;
  user_id: string;
  timestamp: string;
  event_type: string;
  agent: string;
  data: string;
}

const eventBuffer: LogEvent[] = [];
const FLUSH_INTERVAL_MS = 5000;
const FLUSH_BATCH_SIZE = 10;

async function flushEvents(): Promise<void> {
  if (eventBuffer.length === 0 || !isZillizConfigured()) return;

  const batch = eventBuffer.splice(0, Math.min(eventBuffer.length, 50));

  try {
    // Generate embedding from concatenated event texts
    const embedTexts = batch.map(e => {
      try {
        const parsed = JSON.parse(e.data);
        return parsed.content || parsed.message || e.event_type;
      } catch {
        return e.event_type;
      }
    });

    const embedding = await generateEmbedding(embedTexts.join(' ').slice(0, 500));

    await zillizRequest('/entities/insert', {
      collectionName: 'chat_events',
      data: batch.map(e => ({
        ...e,
        embedding,
      })),
    });
  } catch (err) {
    console.error('[Logger] Flush error:', (err as Error).message);
    // Don't re-queue — drop failed events to avoid infinite loops
  }
}

// Start periodic flush
setInterval(flushEvents, FLUSH_INTERVAL_MS);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function logEvent(
  conversationId: string,
  userId: string,
  eventType: 'message' | 'tool_call' | 'routing' | 'feedback' | 'error',
  agent: string,
  data: Record<string, unknown>,
): void {
  if (!isZillizConfigured()) return;

  eventBuffer.push({
    id: randomUUID(),
    conversation_id: conversationId,
    user_id: userId,
    timestamp: new Date().toISOString(),
    event_type: eventType,
    agent,
    data: JSON.stringify(data),
  });

  if (eventBuffer.length >= FLUSH_BATCH_SIZE) {
    flushEvents().catch(() => {});
  }
}

export async function saveConversation(conversation: {
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
}): Promise<void> {
  if (!isZillizConfigured()) return;

  try {
    const userMessages = conversation.messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join(' ');
    const embedding = await generateEmbedding(userMessages.slice(0, 1000));

    await zillizRequest('/entities/upsert', {
      collectionName: 'chat_conversations',
      data: [{
        id: conversation.id,
        user_id: conversation.userId,
        session_id: conversation.sessionId,
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        messages: JSON.stringify(conversation.messages),
        agent_types_used: conversation.agentTypesUsed,
        tools_called: conversation.toolsCalled,
        sources_returned: conversation.sourcesReturned,
        confidence_levels: conversation.confidenceLevels,
        page_urls_visited: conversation.pageUrls,
        feedback_summary: JSON.stringify(conversation.feedbackSummary),
        message_count: conversation.messages.length,
        embedding,
      }],
    });
  } catch (err) {
    console.error('[Logger] Save conversation error:', (err as Error).message);
  }
}

export async function updateUserProfile(userId: string, data: {
  agentsUsed?: Record<string, number>;
  topicsDiscussed?: string[];
  pagesVisited?: string[];
  feedbackGiven?: {up: number; down: number};
}): Promise<void> {
  if (!isZillizConfigured()) return;

  try {
    const embedding = await generateEmbedding(
      (data.topicsDiscussed || []).join(' ').slice(0, 500) || 'user profile',
    );

    await zillizRequest('/entities/upsert', {
      collectionName: 'chat_users',
      data: [{
        user_id: userId,
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        total_conversations: 1,
        topics_discussed: data.topicsDiscussed || [],
        agents_used: JSON.stringify(data.agentsUsed || {}),
        pages_visited: data.pagesVisited || [],
        feedback_given: JSON.stringify(data.feedbackGiven || {up: 0, down: 0}),
        embedding,
      }],
    });
  } catch (err) {
    console.error('[Logger] Update user profile error:', (err as Error).message);
  }
}

// ---------------------------------------------------------------------------
// Collection setup (REST API)
// ---------------------------------------------------------------------------

export async function ensureLogCollections(): Promise<void> {
  if (!isZillizConfigured()) {
    console.warn('[Logger] Zilliz Cloud not configured — logging disabled');
    return;
  }

  const collections = [
    {
      name: 'chat_events',
      fields: [
        {fieldName: 'id', dataType: 'VarChar', isPrimary: true, elementTypeParams: {max_length: '64'}},
        {fieldName: 'conversation_id', dataType: 'VarChar', elementTypeParams: {max_length: '64'}},
        {fieldName: 'user_id', dataType: 'VarChar', elementTypeParams: {max_length: '64'}},
        {fieldName: 'timestamp', dataType: 'VarChar', elementTypeParams: {max_length: '32'}},
        {fieldName: 'event_type', dataType: 'VarChar', elementTypeParams: {max_length: '32'}},
        {fieldName: 'agent', dataType: 'VarChar', elementTypeParams: {max_length: '32'}},
        {fieldName: 'data', dataType: 'VarChar', elementTypeParams: {max_length: '16384'}},
        {fieldName: 'embedding', dataType: 'FloatVector', elementTypeParams: {dim: String(EMBEDDING_DIM)}},
      ],
    },
    {
      name: 'chat_conversations',
      fields: [
        {fieldName: 'id', dataType: 'VarChar', isPrimary: true, elementTypeParams: {max_length: '64'}},
        {fieldName: 'user_id', dataType: 'VarChar', elementTypeParams: {max_length: '64'}},
        {fieldName: 'session_id', dataType: 'VarChar', elementTypeParams: {max_length: '64'}},
        {fieldName: 'started_at', dataType: 'VarChar', elementTypeParams: {max_length: '32'}},
        {fieldName: 'ended_at', dataType: 'VarChar', elementTypeParams: {max_length: '32'}},
        {fieldName: 'messages', dataType: 'VarChar', elementTypeParams: {max_length: '65535'}},
        {fieldName: 'agent_types_used', dataType: 'Array', elementDataType: 'VarChar', elementTypeParams: {max_capacity: '10', max_length: '32'}},
        {fieldName: 'tools_called', dataType: 'Array', elementDataType: 'VarChar', elementTypeParams: {max_capacity: '20', max_length: '64'}},
        {fieldName: 'sources_returned', dataType: 'Array', elementDataType: 'VarChar', elementTypeParams: {max_capacity: '20', max_length: '256'}},
        {fieldName: 'confidence_levels', dataType: 'Array', elementDataType: 'VarChar', elementTypeParams: {max_capacity: '10', max_length: '16'}},
        {fieldName: 'page_urls_visited', dataType: 'Array', elementDataType: 'VarChar', elementTypeParams: {max_capacity: '20', max_length: '256'}},
        {fieldName: 'feedback_summary', dataType: 'VarChar', elementTypeParams: {max_length: '128'}},
        {fieldName: 'message_count', dataType: 'Int32'},
        {fieldName: 'embedding', dataType: 'FloatVector', elementTypeParams: {dim: String(EMBEDDING_DIM)}},
      ],
    },
    {
      name: 'chat_users',
      fields: [
        {fieldName: 'user_id', dataType: 'VarChar', isPrimary: true, elementTypeParams: {max_length: '64'}},
        {fieldName: 'first_seen', dataType: 'VarChar', elementTypeParams: {max_length: '32'}},
        {fieldName: 'last_seen', dataType: 'VarChar', elementTypeParams: {max_length: '32'}},
        {fieldName: 'total_conversations', dataType: 'Int32'},
        {fieldName: 'topics_discussed', dataType: 'Array', elementDataType: 'VarChar', elementTypeParams: {max_capacity: '50', max_length: '64'}},
        {fieldName: 'agents_used', dataType: 'VarChar', elementTypeParams: {max_length: '512'}},
        {fieldName: 'pages_visited', dataType: 'Array', elementDataType: 'VarChar', elementTypeParams: {max_capacity: '100', max_length: '256'}},
        {fieldName: 'feedback_given', dataType: 'VarChar', elementTypeParams: {max_length: '128'}},
        {fieldName: 'embedding', dataType: 'FloatVector', elementTypeParams: {dim: String(EMBEDDING_DIM)}},
      ],
    },
  ];

  for (const coll of collections) {
    try {
      const data = await zillizRequest('/collections/has', {collectionName: coll.name});
      if (data?.has) {
        console.log(`[Logger] Collection ${coll.name} exists`);
        continue;
      }

      await zillizRequest('/collections/create', {
        collectionName: coll.name,
        schema: {fields: coll.fields},
        indexParams: [
          {fieldName: 'embedding', indexType: 'AUTOINDEX', metricType: 'COSINE'},
        ],
      });
      console.log(`[Logger] Created collection: ${coll.name}`);
    } catch (err) {
      console.error(`[Logger] Failed to setup ${coll.name}:`, (err as Error).message);
      throw err;
    }
  }

  console.log('[Logger] Log collections ready');
}
