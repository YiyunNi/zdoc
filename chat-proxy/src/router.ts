import {generateObject, generateText, tool} from 'ai';
import {z} from 'zod';
import type {AgentType, ChatMessage} from './types.js';
import {saveTokenUsage} from './db.js';
import {resolveModel, createModelInstance} from './runtime-config.js';
import {makeTelemetry} from './telemetry.js';

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
- code: ANY "how to" or "how do I" question, SDK code, API usage, search/insert/query operations, integration patterns, troubleshooting code errors. When in doubt between general and code, choose code.
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
// Legacy router (v1) — kept for rollback
// ---------------------------------------------------------------------------

async function routeIntentLegacy(
  latestMessage: string,
  recentMessages: ChatMessage[],
  sessionId?: string,
): Promise<{agent: AgentType; topics: TopicName[]; reasoning: string}> {
  const stickyAgent = sessionId ? sessionRoutes.get(sessionId) : undefined;

  try {
    const contextMessages = recentMessages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n');

    const resolvedModel = await resolveModel('router');
    const result = await generateObject({
      model: createModelInstance(resolvedModel),
      schema: routeSchema,
      maxOutputTokens: 250,
      abortSignal: AbortSignal.timeout(30000),
      experimental_telemetry: makeTelemetry('router-legacy'),
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
    console.error('[Router] Classification error:', err);
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
): Promise<{agent: AgentType; topics: TopicName[]; reasoning: string}> {
  const stickyAgent = sessionId ? sessionRoutes.get(sessionId) : undefined;
  const resolvedModel = await resolveModel('router');
  const modelInstance = createModelInstance(resolvedModel);

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
      schema: routeSchema,
      maxOutputTokens: 250,
      abortSignal: AbortSignal.timeout(30000),
      experimental_telemetry: makeTelemetry('router-v2-object', {providerFamily, sessionId}),
      prompt,
    });

    const agentType = result.object.agent;
    if (isValidAgent(agentType)) {
      await persistRouterUsage(result.usage, resolvedModel.model, sessionId);
      if (sessionId) sessionRoutes.set(sessionId, agentType);
      return {
        agent: agentType,
        topics: (result.object.topics || []).filter(isValidTopic),
        reasoning: result.object.reasoning,
      };
    }
    console.warn(`[Router] generateObject returned invalid agent: ${agentType}. Falling back to tool routing.`);
  } catch (err) {
    console.warn('[Router] generateObject failed:', (err as Error).message);
  }

  // --- Attempt 2: generateText with route tool (better for weak JSON models) ---
  try {
    const prompt = buildRouterPrompt(latestMessage, recentMessages, stickyAgent, providerFamily);

    const result = await generateText({
      model: modelInstance,
      tools: {route: routeTool},
      toolChoice: 'required',
      maxOutputTokens: 250,
      abortSignal: AbortSignal.timeout(30000),
      experimental_telemetry: makeTelemetry('router-v2-tool', {providerFamily, sessionId}),
      prompt,
    });

    const toolCall = result.toolCalls.find(tc => tc.toolName === 'route');
    if (toolCall) {
      const input = toolCall.input as Record<string, unknown>;
      const agentType = String(input.agent || '');
      if (isValidAgent(agentType)) {
        await persistRouterUsage(result.usage, resolvedModel.model, sessionId);
        if (sessionId) sessionRoutes.set(sessionId, agentType);
        return {
          agent: agentType,
          topics: ((input.topics || []) as string[]).filter(isValidTopic),
          reasoning: String(input.reasoning || ''),
        };
      }
    }
    console.warn('[Router] Tool-based routing returned no valid route tool call.');
  } catch (err) {
    console.warn('[Router] generateText tool fallback failed:', (err as Error).message);
  }

  // --- Attempt 3: plain text fallback (for reasoning models that don't support tools or JSON mode) ---
  try {
    const prompt = buildRouterPrompt(latestMessage, recentMessages, stickyAgent, providerFamily);

    const result = await generateText({
      model: modelInstance,
      maxOutputTokens: 250,
      temperature: 0,
      abortSignal: AbortSignal.timeout(30000),
      experimental_telemetry: makeTelemetry('router-v2-text', {providerFamily, sessionId}),
      prompt: `${prompt}\n\nCRITICAL: Output ONLY a JSON object. No markdown, no explanations, no <think> tags. Example:\n{"agent": "schema", "topics": ["schema-design"], "reasoning": "User is asking about collection schema design."}`,
    });

    const parsed = extractRouterJson(result.text);
    if (parsed && isValidAgent(parsed.agent)) {
      await persistRouterUsage(result.usage, resolvedModel.model, sessionId);
      if (sessionId) sessionRoutes.set(sessionId, parsed.agent);
      return {
        agent: parsed.agent,
        topics: (parsed.topics || []).filter(isValidTopic),
        reasoning: parsed.reasoning || '',
      };
    }
    console.warn('[Router] Plain text fallback returned no valid JSON.');
  } catch (err) {
    console.warn('[Router] Plain text fallback failed:', (err as Error).message);
  }

  // --- Attempt 4: sticky/general fallback ---
  console.log('[Router] All routing attempts failed; falling back to sticky/general.');
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
): Promise<{agent: AgentType; topics: TopicName[]; reasoning: string}> {
  if (ROUTER_V2_ENABLED) {
    return routeIntentV2(latestMessage, recentMessages, sessionId);
  }
  return routeIntentLegacy(latestMessage, recentMessages, sessionId);
}

export function clearSessionRoute(sessionId: string): void {
  sessionRoutes.delete(sessionId);
}
