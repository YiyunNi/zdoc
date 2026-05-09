import {generateObject, generateText, tool} from 'ai';
import {z} from 'zod';
import type {AgentType, ChatMessage} from './types.js';
import {saveTokenUsage} from './db.js';
import {resolveModel, createModelInstance} from './runtime-config.js';
import {summarizeForDebugLog} from './logger.js';
import {makeTelemetry} from './telemetry.js';
import {bedrockAiSdkMaxRetries} from './bedrock-guard.js';
import {incCounter} from './metrics.js';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROUTER_V2_ENABLED = process.env.ROUTER_V2_ENABLED !== 'false'; // default true

// ---------------------------------------------------------------------------
// Intent classification schema
// ---------------------------------------------------------------------------

const TOPIC_ENUM = [
  'schema-design', 'search', 'resources', 'cluster-connection',
  'import', 'migration', 'access-control', 'integrations', 'pricing',
  'security', 'compliance-and-privacy', 'reranking', 'on-demand-search',
] as const;

export type TopicName = (typeof TOPIC_ENUM)[number];

const routeSchema = z.object({
  agent: z.enum(['general', 'schema', 'resources', 'product', 'code']),
  topics: z.array(z.enum(TOPIC_ENUM)).describe('Relevant topic areas (1-2 max)'),
  reasoning: z.string(),
});

// ---------------------------------------------------------------------------
// Route tool for fallback tool-based routing
// ---------------------------------------------------------------------------

const routeTool = tool({
  description: 'Route the user query to the best specialized agent and identify relevant topics.',
  inputSchema: z.object({
    agent: z.enum(['general', 'schema', 'resources', 'product', 'code'])
      .describe('The agent that best matches the user intent'),
    topics: z.array(z.enum(TOPIC_ENUM)).max(2)
      .describe('Relevant topic areas (1-2 max)'),
    reasoning: z.string()
      .describe('Brief explanation of why this agent was chosen'),
  }),
});

// ---------------------------------------------------------------------------
// Provider detection for prompt adaptation
// ---------------------------------------------------------------------------

function detectProviderFamily(model: string, baseURL?: string): string {
  const m = model.toLowerCase();
  const b = (baseURL || '').toLowerCase();

  if (m.includes('deepseek') || b.includes('deepseek')) return 'deepseek';
  if (m.includes('glm') || b.includes('bigmodel') || b.includes('zhipin')) return 'glm';
  if (m.includes('kimi') || m.includes('moonshot') || b.includes('moonshot')) return 'kimi';
  if (m.includes('claude') || m.includes('sonnet') || m.includes('opus') || m.includes('haiku')) return 'anthropic';
  if (m.includes('gpt') || m.includes('o1') || m.includes('o3')) return 'openai';
  if (m.includes('gemini') || m.includes('flash') || m.includes('pro-2')) return 'google';
  if (m.includes('qwen') || m.includes('通义')) return 'qwen';
  return 'unknown';
}

// ---------------------------------------------------------------------------
// Prompt builders
// ---------------------------------------------------------------------------

const AGENT_DESCRIPTIONS = `
Agents:
- general: Conceptual explanations, "what is X", product overview, account/org questions, greetings, off-topic
- schema: Collection schema design, field types, index selection, data modeling, partition keys
- resources: Cluster sizing, CU estimation, storage planning, pricing, deployment tier selection
- product: Product comparison (Serverless vs Dedicated vs BYOC), feature availability, migration
- code: Explicit requests for SDK code, API calls, runnable examples, syntax, implementation details, or troubleshooting code errors. For schema design questions (collections, fields, indexes, partition keys, BM25), route to schema even if phrased as "how do I". Do not route conceptual product, reranking, tuning, tradeoff, limitation, cost, latency, or "when should I use..." questions to code unless the user explicitly asks for code.
`;

const TOPIC_DESCRIPTIONS = `
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
- security: Authentication, SSO/MFA, API keys, cluster credentials, Private Link, IP allowlists, encryption, CMEK, data isolation, audit logs
- compliance-and-privacy: Trust Center, SOC 2 Type II, ISO/IEC 27001, GDPR, HIPAA/BAA, privacy posture, vendor review
- reranking: Cohere, Voyage AI, Boost, Decay, RRF, Weighted rankers, reranker selection, limitations, tuning, cost and latency tradeoffs
- on-demand-search: On-demand search architecture, external collections, refresh/indexing flow, session-attached compute, on-demand vs serverless tradeoffs
`;

const FEW_SHOT_EXAMPLES = `
Examples:
Input: "How do I create a collection with auto-id?"
Output: {"agent": "schema", "topics": ["schema-design"], "reasoning": "The user is asking about collection creation and field configuration, which is schema design."}

Input: "What cluster size do I need for 10M vectors?"
Output: {"agent": "resources", "topics": ["resources"], "reasoning": "The user is asking about capacity planning and CU estimation."}

Input: "Compare Serverless and Dedicated"
Output: {"agent": "product", "topics": ["resources", "pricing"], "reasoning": "The user wants a product comparison and likely cares about pricing implications."}

Input: "Show me Python code for vector search"
Output: {"agent": "code", "topics": ["search"], "reasoning": "The user explicitly asks for code example in Python."}

Input: "How do I set up a partition key?"
Output: {"agent": "schema", "topics": ["schema-design"], "reasoning": "Partition keys are a schema design concern, not a code/SDK question."}

Input: "How do I enable BM25 full-text search?"
Output: {"agent": "schema", "topics": ["schema-design"], "reasoning": "BM25 setup is part of collection schema and index configuration."}

Input: "When should I use Cohere Reranker instead of Boost Reranker?"
Output: {"agent": "product", "topics": ["reranking", "integrations"], "reasoning": "The user is asking for reranker selection and tradeoffs, not SDK code."}

Input: "What weights should I use for Weighted Reranker in production?"
Output: {"agent": "general", "topics": ["reranking"], "reasoning": "The user is asking for conceptual tuning guidance, not an implementation example."}

Input: "Should I use on-demand search or serverless for bursty 20TB queries?"
Output: {"agent": "product", "topics": ["on-demand-search", "resources"], "reasoning": "The user is choosing architecture and sizing tradeoffs for large bursty workloads."}

Input: "What is Zilliz Cloud?"
Output: {"agent": "general", "topics": [], "reasoning": "General product overview question."}
`;

function buildRouterPrompt(
  latestMessage: string,
  recentMessages: ChatMessage[],
  stickyAgent?: AgentType,
  providerFamily?: string,
): string {
  const contextMessages = recentMessages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n');

  const weakModelHint = (providerFamily === 'deepseek' || providerFamily === 'glm' || providerFamily === 'kimi')
    ? '\nIMPORTANT: You MUST respond with ONLY a valid JSON object. Do not add markdown formatting, explanations, or extra text. Follow the examples exactly.\n'
    : '';

  return `Classify the user's intent to route to the best specialized agent and identify relevant topics.

${AGENT_DESCRIPTIONS}
${TOPIC_DESCRIPTIONS}
${FEW_SHOT_EXAMPLES}
${stickyAgent ? `\nCurrent agent: ${stickyAgent}. Stay with this agent unless the topic has clearly changed.\n` : ''}
Recent conversation:
${contextMessages}

Latest user message: ${latestMessage}
${weakModelHint}
Route to the most appropriate agent and select relevant topics. Output ONLY valid JSON with this exact shape:
{"agent": "...", "topics": ["..."], "reasoning": "..."}`;
}

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
// Cross-session route cache (short TTL)
// ---------------------------------------------------------------------------

const routeCache = new Map<string, {agent: AgentType; topics: TopicName[]; reasoning: string; timestamp: number}>();
const ROUTE_CACHE_TTL_MS = parseInt(process.env.ROUTE_CACHE_TTL_MS || '', 10) || 30 * 60 * 1000;
const ROUTE_CACHE_MAX = parseInt(process.env.ROUTE_CACHE_MAX || '', 10) || 5000;

function getRouteCacheKey(query: string, stickyAgent?: AgentType): string {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, ' ');
  return stickyAgent ? `${stickyAgent}:${normalized}` : normalized;
}

function getCachedRoute(query: string, stickyAgent?: AgentType): {agent: AgentType; topics: TopicName[]; reasoning: string} | null {
  const key = getRouteCacheKey(query, stickyAgent);
  const entry = routeCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ROUTE_CACHE_TTL_MS) {
    routeCache.delete(key);
    return null;
  }
  return {agent: entry.agent, topics: entry.topics, reasoning: entry.reasoning};
}

function setCachedRoute(query: string, agent: AgentType, topics: TopicName[], reasoning: string, stickyAgent?: AgentType): void {
  if (routeCache.size >= ROUTE_CACHE_MAX) {
    const oldest = routeCache.keys().next().value!;
    routeCache.delete(oldest);
  }
  routeCache.set(getRouteCacheKey(query, stickyAgent), {agent, topics, reasoning, timestamp: Date.now()});
}

// ---------------------------------------------------------------------------
// Follow-up fast-path: skip LLM router for obvious continuations
// ---------------------------------------------------------------------------

const FOLLOW_UP_RE = /^(ok|yes|no|thanks?|thx|got it|sure|please|why|how)\b|^(what about|how about)\s+(it|that|this|them)\s*[\?\.]?$|^(can you|could you)\s+(elaborate|explain|clarify|expand)\s*[\?\.]?$/i;

function isObviousFollowUp(query: string): boolean {
  return FOLLOW_UP_RE.test(query.trim());
}

// ---------------------------------------------------------------------------
// Legacy router (v1) — kept for rollback
// ---------------------------------------------------------------------------

async function routeIntentLegacy(
  latestMessage: string,
  recentMessages: ChatMessage[],
  sessionId?: string,
  requestId?: string,
): Promise<{agent: AgentType; topics: TopicName[]; reasoning: string}> {
  const stickyAgent = sessionId ? sessionRoutes.get(sessionId) : undefined;

  try {
    const contextMessages = recentMessages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n');

    const resolvedModel = await resolveModel('router');
    const result = await generateObject({
      model: await createModelInstance(resolvedModel),
      maxRetries: bedrockAiSdkMaxRetries(resolvedModel.provider),
      schema: routeSchema,
      maxOutputTokens: 250,
      abortSignal: AbortSignal.timeout(30000),
      experimental_telemetry: makeTelemetry('router-legacy', {sessionId, requestId}),
      prompt: `Classify the user's intent to route to the best specialized agent and identify relevant topics.

Agents:
- general: Conceptual explanations, "what is X", product overview, account/org questions, greetings, off-topic
- schema: Collection schema design, field types, index selection, data modeling, partition keys
- resources: Cluster sizing, CU estimation, storage planning, pricing, deployment tier selection
- product: Product comparison (Serverless vs Dedicated vs BYOC), feature availability, migration
- code: Explicit requests for SDK code, API calls, runnable examples, syntax, implementation details, or troubleshooting code errors. For schema design questions (collections, fields, indexes, partition keys, BM25), route to schema even if phrased as "how do I". Do not route conceptual product, reranking, tuning, tradeoff, limitation, cost, latency, or "when should I use..." questions to code unless the user explicitly asks for code.

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
- security: Authentication, SSO/MFA, API keys, cluster credentials, Private Link, IP allowlists, encryption, CMEK, data isolation, audit logs
- compliance-and-privacy: Trust Center, SOC 2 Type II, ISO/IEC 27001, GDPR, HIPAA/BAA, privacy posture, vendor review
- reranking: Cohere, Voyage AI, Boost, Decay, RRF, Weighted rankers, reranker selection, limitations, tuning, cost and latency tradeoffs
- on-demand-search: On-demand search architecture, external collections, refresh/indexing flow, session-attached compute, on-demand vs serverless tradeoffs

${stickyAgent ? `Current agent: ${stickyAgent}. Stay with this agent unless the topic has clearly changed.` : ''}

Recent conversation:
${contextMessages}

Latest user message: ${latestMessage}

Route to the most appropriate agent and select relevant topics.`,
    });

    const agentType = result.object.agent;

    try {
      const u = result.usage;
      if (u?.inputTokens != null && u?.outputTokens != null) {
        saveTokenUsage({
          sessionId: sessionId,
          model: resolvedModel.model,
          agentType: 'router',
          inputTokens: u.inputTokens,
          outputTokens: u.outputTokens,
          totalTokens: u.totalTokens ?? u.inputTokens + u.outputTokens,
          cachedInputTokens: u.cachedInputTokens ?? 0,
        }).catch(() => {});
      }
    } catch { /* fire-and-forget */ }

    if (sessionId) {
      sessionRoutes.set(sessionId, agentType);
    }

    return {agent: agentType, topics: result.object.topics || [], reasoning: result.object.reasoning};
  } catch (err) {
    console.error('[Router] Classification error', JSON.stringify({requestId, error: summarizeForDebugLog(err instanceof Error ? err.message : String(err), 'error')}));
    const fallback = stickyAgent || 'general';
    return {agent: fallback, topics: [], reasoning: 'Fallback due to classification error'};
  }
}

// ---------------------------------------------------------------------------
// v2 hybrid router — object first, tool fallback
// ---------------------------------------------------------------------------

async function routeIntentV2(
  latestMessage: string,
  recentMessages: ChatMessage[],
  sessionId?: string,
  requestId?: string,
): Promise<{agent: AgentType; topics: TopicName[]; reasoning: string}> {
  const stickyAgent = sessionId ? sessionRoutes.get(sessionId) : undefined;

  // Fast-path 1: obvious follow-ups stay with the sticky agent
  // Use the raw last message (not the enriched ragQuery) so short replies like "ok" match.
  const rawLatestMessage = recentMessages[recentMessages.length - 1]?.content || '';
  if (stickyAgent && isObviousFollowUp(rawLatestMessage)) {
    console.log('[Router] Follow-up fast-path', JSON.stringify({requestId, agent: stickyAgent}));
    return {agent: stickyAgent, topics: [], reasoning: 'Follow-up fast-path'};
  }

  // Fast-path 2: cross-session route cache
  const cached = getCachedRoute(latestMessage, stickyAgent);
  if (cached) {
    console.log('[Router] Cache hit', JSON.stringify({requestId, query: summarizeForDebugLog(latestMessage, 'query')}));
    incCounter('chat_proxy_cache_hits_total', {type: 'route'});
    if (sessionId) sessionRoutes.set(sessionId, cached.agent);
    return cached;
  }
  incCounter('chat_proxy_cache_misses_total', {type: 'route'});

  const resolvedModel = await resolveModel('router');
  const modelInstance = await createModelInstance(resolvedModel);

  const providerFamily = detectProviderFamily(
    resolvedModel.model,
    resolvedModel.provider === 'openai-compatible' && resolvedModel.source === 'profile'
      ? resolvedModel.baseURL
      : process.env.AI_BASE_URL,
  );

  // --- Attempt 1: generateObject (fast path for well-behaved models) ---
  try {
    const prompt = buildRouterPrompt(latestMessage, recentMessages, stickyAgent, providerFamily);

    const result = await generateObject({
      model: modelInstance,
      maxRetries: bedrockAiSdkMaxRetries(resolvedModel.provider),
      schema: routeSchema,
      maxOutputTokens: 250,
      abortSignal: AbortSignal.timeout(30000),
      experimental_telemetry: makeTelemetry('router-v2-object', {providerFamily, sessionId, requestId}),
      prompt,
    });

    const agentType = result.object.agent;
    if (isValidAgent(agentType)) {
      await persistRouterUsage(result.usage, resolvedModel.model, sessionId);
      if (sessionId) sessionRoutes.set(sessionId, agentType);
      const topics = (result.object.topics || []).filter(isValidTopic);
      setCachedRoute(latestMessage, agentType, topics, result.object.reasoning, stickyAgent);
      return {
        agent: agentType,
        topics,
        reasoning: result.object.reasoning,
      };
    }
    console.warn('[Router] generateObject returned invalid agent', JSON.stringify({requestId, agent: agentType}));
  } catch (err) {
    console.warn('[Router] generateObject failed', JSON.stringify({requestId, error: summarizeForDebugLog(err instanceof Error ? err.message : String(err), 'error')}));
  }

  // --- Attempt 2: generateText with route tool (better for weak JSON models) ---
  try {
    const prompt = buildRouterPrompt(latestMessage, recentMessages, stickyAgent, providerFamily);

    const result = await generateText({
      model: modelInstance,
      maxRetries: bedrockAiSdkMaxRetries(resolvedModel.provider),
      tools: {route: routeTool},
      toolChoice: 'required',
      maxOutputTokens: 250,
      abortSignal: AbortSignal.timeout(30000),
      experimental_telemetry: makeTelemetry('router-v2-tool', {providerFamily, sessionId, requestId}),
      prompt,
    });

    const toolCall = result.toolCalls.find(tc => tc.toolName === 'route');
    if (toolCall) {
      const input = toolCall.input as Record<string, unknown>;
      const agentType = String(input.agent || '');
      if (isValidAgent(agentType)) {
        await persistRouterUsage(result.usage, resolvedModel.model, sessionId);
        if (sessionId) sessionRoutes.set(sessionId, agentType);
        const topics = ((input.topics || []) as string[]).filter(isValidTopic);
        setCachedRoute(latestMessage, agentType, topics, String(input.reasoning || ''), stickyAgent);
        return {
          agent: agentType,
          topics,
          reasoning: String(input.reasoning || ''),
        };
      }
    }
    console.warn('[Router] Tool-based routing returned no valid route tool call', JSON.stringify({requestId}));
  } catch (err) {
    console.warn('[Router] generateText tool fallback failed', JSON.stringify({requestId, error: summarizeForDebugLog(err instanceof Error ? err.message : String(err), 'error')}));
  }

  // --- Attempt 3: plain text fallback (for reasoning models that don't support tools or JSON mode) ---
  try {
    const prompt = buildRouterPrompt(latestMessage, recentMessages, stickyAgent, providerFamily);

    const result = await generateText({
      model: modelInstance,
      maxRetries: bedrockAiSdkMaxRetries(resolvedModel.provider),
      maxOutputTokens: 250,
      temperature: 0,
      abortSignal: AbortSignal.timeout(30000),
      experimental_telemetry: makeTelemetry('router-v2-text', {providerFamily, sessionId, requestId}),
      prompt: `${prompt}\n\nCRITICAL: Output ONLY a JSON object. No markdown, no explanations, no <think> tags. Example:\n{"agent": "schema", "topics": ["schema-design"], "reasoning": "User is asking about collection schema design."}`,
    });

    const parsed = extractRouterJson(result.text);
    if (parsed && isValidAgent(parsed.agent)) {
      await persistRouterUsage(result.usage, resolvedModel.model, sessionId);
      if (sessionId) sessionRoutes.set(sessionId, parsed.agent);
      const topics = (parsed.topics || []).filter(isValidTopic);
      setCachedRoute(latestMessage, parsed.agent, topics, parsed.reasoning || '', stickyAgent);
      return {
        agent: parsed.agent,
        topics,
        reasoning: parsed.reasoning || '',
      };
    }
    console.warn('[Router] Plain text fallback returned no valid JSON', JSON.stringify({requestId}));
  } catch (err) {
    console.warn('[Router] Plain text fallback failed', JSON.stringify({requestId, error: summarizeForDebugLog(err instanceof Error ? err.message : String(err), 'error')}));
  }

  // --- Attempt 4: sticky/general fallback ---
  console.log('[Router] All routing attempts failed; falling back to sticky/general.', JSON.stringify({requestId}));
  const fallback = stickyAgent || 'general';
  if (sessionId) sessionRoutes.set(sessionId, fallback);
  return {agent: fallback, topics: [], reasoning: 'Fallback after all routing attempts failed'};
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isValidAgent(agent: unknown): agent is AgentType {
  return typeof agent === 'string' && ['general', 'schema', 'resources', 'product', 'code'].includes(agent);
}

/**
 * Extract router JSON from LLM response text, handling markdown fences
 * and extra text that reasoning models often add.
 */
function extractRouterJson(text: string): {agent: string; topics: string[]; reasoning: string} | null {
  // Strip reasoning tags (DeepSeek <think>, etc.) before parsing
  const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  // Try direct parse first
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === 'object' && 'agent' in parsed) {
      return parsed as any;
    }
  } catch { /* continue */ }

  // Try extracting from markdown code blocks
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (parsed && typeof parsed === 'object' && 'agent' in parsed) {
        return parsed as any;
      }
    } catch { /* continue */ }
  }

  // Try finding JSON object in text
  const jsonMatch = cleaned.match(/\{[\s\S]*"agent"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed && typeof parsed === 'object' && 'agent' in parsed) {
        return parsed as any;
      }
    } catch { /* continue */ }
  }

  return null;
}

function isValidTopic(topic: unknown): topic is TopicName {
  return typeof topic === 'string' && TOPIC_ENUM.includes(topic as TopicName);
}

async function persistRouterUsage(
  usage: {inputTokens?: number; outputTokens?: number; totalTokens?: number; cachedInputTokens?: number} | undefined,
  model: string,
  sessionId?: string,
): Promise<void> {
  try {
    if (usage?.inputTokens != null && usage?.outputTokens != null) {
      saveTokenUsage({
        sessionId: sessionId,
        model,
        agentType: 'router',
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens ?? usage.inputTokens + usage.outputTokens,
        cachedInputTokens: usage.cachedInputTokens ?? 0,
      }).catch(() => {});
    }
  } catch { /* fire-and-forget */ }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function routeIntent(
  latestMessage: string,
  recentMessages: ChatMessage[],
  sessionId?: string,
  requestId?: string,
): Promise<{agent: AgentType; topics: TopicName[]; reasoning: string}> {
  if (ROUTER_V2_ENABLED) {
    return routeIntentV2(latestMessage, recentMessages, sessionId, requestId);
  }
  return routeIntentLegacy(latestMessage, recentMessages, sessionId, requestId);
}

export function clearSessionRoute(sessionId: string): void {
  sessionRoutes.delete(sessionId);
}

export function clearRouteCache(): void {
  routeCache.clear();
}
