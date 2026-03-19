import {generateObject} from 'ai';
import {createOpenAI} from '@ai-sdk/openai';
import {z} from 'zod';
import type {AgentType, ChatMessage} from './types.js';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
const AI_API_KEY = process.env.AI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o';

const provider = createOpenAI({baseURL: AI_BASE_URL, apiKey: AI_API_KEY});

// ---------------------------------------------------------------------------
// Intent classification schema
// ---------------------------------------------------------------------------

const routeSchema = z.object({
  agent: z.enum(['general', 'schema', 'resources', 'product', 'code']),
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
): Promise<{agent: AgentType; reasoning: string}> {
  // Check sticky route (stay with same agent unless clear topic change)
  const stickyAgent = sessionId ? sessionRoutes.get(sessionId) : undefined;

  try {
    // Build context from recent messages
    const contextMessages = recentMessages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n');

    const result = await generateObject({
      model: provider(AI_MODEL),
      schema: routeSchema,
      maxTokens: 150,
      prompt: `Classify the user's intent to route to the best specialized agent.

Agents:
- general: General questions about Zilliz Cloud, Milvus, vector databases, documentation navigation
- schema: Collection schema design, field types, index selection, data modeling, partition keys
- resources: Cluster sizing, CU estimation, storage planning, pricing, deployment tier selection
- product: Product comparison (Serverless vs Dedicated vs BYOC), feature availability, migration
- code: SDK code generation, code examples, API usage, integration patterns (LangChain, etc.)

${stickyAgent ? `Current agent: ${stickyAgent}. Stay with this agent unless the topic has clearly changed.` : ''}

Recent conversation:
${contextMessages}

Latest user message: ${latestMessage}

Route to the most appropriate agent.`,
    });

    const agentType = result.object.agent;

    // Update sticky route
    if (sessionId) {
      sessionRoutes.set(sessionId, agentType);
    }

    return {agent: agentType, reasoning: result.object.reasoning};
  } catch (err) {
    console.error('[Router] Classification error:', err);
    // Fallback: use sticky route or general
    const fallback = stickyAgent || 'general';
    return {agent: fallback, reasoning: 'Fallback due to classification error'};
  }
}

export function clearSessionRoute(sessionId: string): void {
  sessionRoutes.delete(sessionId);
}
