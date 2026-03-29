import {generateObject} from 'ai';
import {createOpenAI} from '@ai-sdk/openai';
import {z} from 'zod';
import type {AgentType, ChatMessage} from './types.js';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
const AI_API_KEY = process.env.AI_API_KEY || '';
// Router needs structured output reliability — use a dedicated small model
// rather than falling back to the generation model which may not support it.
const AI_MODEL = process.env.ROUTER_MODEL || 'openai/gpt-4o-mini';

const provider = createOpenAI({baseURL: AI_BASE_URL, apiKey: AI_API_KEY});

// ---------------------------------------------------------------------------
// Intent classification schema
// ---------------------------------------------------------------------------

const TOPIC_ENUM = [
  'schema-design', 'search', 'resources', 'cluster-connection',
  'import', 'migration', 'access-control', 'integrations', 'pricing',
] as const;

export type TopicName = (typeof TOPIC_ENUM)[number];

const routeSchema = z.object({
  agent: z.enum(['general', 'schema', 'resources', 'product', 'code']),
  topics: z.array(z.enum(TOPIC_ENUM)).describe('Relevant topic areas (1-2 max)'),
  reasoning: z.string(),
});

// ---------------------------------------------------------------------------
// Session routing state (sticky routing)
// ---------------------------------------------------------------------------

const sessionRoutes = new Map<string, AgentType>();

// Cleanup old routes periodically
setInterval(() => {
  // Trim to 10k entries max
  if (sessionRoutes.size > 10000) {
    const entries = [...sessionRoutes.entries()];
    entries.slice(0, entries.length - 5000).forEach(([k]) => sessionRoutes.delete(k));
  }
}, 5 * 60 * 1000);

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export async function routeIntent(
  latestMessage: string,
  recentMessages: ChatMessage[],
  sessionId?: string,
): Promise<{agent: AgentType; topics: TopicName[]; reasoning: string}> {
  // Check sticky route (stay with same agent unless clear topic change)
  const stickyAgent = sessionId ? sessionRoutes.get(sessionId) : undefined;

  try {
    // Build context from recent messages
    const contextMessages = recentMessages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n');

    const result = await generateObject({
      model: provider(AI_MODEL),
      schema: routeSchema,
      maxTokens: 250,
      prompt: `Classify the user's intent to route to the best specialized agent and identify relevant topics.

Agents:
- general: Conceptual explanations, "what is X", product overview, account/org questions, greetings, off-topic
- schema: Collection schema design, field types, index selection, data modeling, partition keys
- resources: Cluster sizing, CU estimation, storage planning, pricing, deployment tier selection
- product: Product comparison (Serverless vs Dedicated vs BYOC), feature availability, migration
- code: ANY "how to" or "how do I" question, SDK code, API usage, search/insert/query operations, integration patterns, troubleshooting code errors. When in doubt between general and code, choose code.

Topics (select 1-2 most relevant):
- schema-design: Collection schema, field types, indexes, BM25 setup, limits
- search: Vector search, filtered search, BM25 full text search, hybrid search, RRF
- resources: Plan selection (Free/Serverless/Dedicated/BYOC), CU sizing, limits
- cluster-connection: Endpoint, auth, SDK connection, global/private endpoints
- import: Insert/upsert, bulk import, volume import, BulkWriter, data prep
- migration: Milvus→Zilliz migration, Pinecone/Qdrant/pgvector/ES/OpenSearch migration
- access-control: RBAC, org/project/cluster roles, API keys, custom roles
- integrations: LangChain, model providers, Datadog, SDK integrations
- pricing: Pricing, billing, credits, cost optimization

${stickyAgent ? `Current agent: ${stickyAgent}. Stay with this agent unless the topic has clearly changed.` : ''}

Recent conversation:
${contextMessages}

Latest user message: ${latestMessage}

Route to the most appropriate agent and select relevant topics.`,
    });

    const agentType = result.object.agent;

    // Update sticky route
    if (sessionId) {
      sessionRoutes.set(sessionId, agentType);
    }

    return {agent: agentType, topics: result.object.topics || [], reasoning: result.object.reasoning};
  } catch (err) {
    console.error('[Router] Classification error:', err);
    // Fallback: use sticky route or general
    const fallback = stickyAgent || 'general';
    return {agent: fallback, topics: [], reasoning: 'Fallback due to classification error'};
  }
}

export function clearSessionRoute(sessionId: string): void {
  sessionRoutes.delete(sessionId);
}
