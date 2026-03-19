import {Hono} from 'hono';
import {cors} from 'hono/cors';
import {streamText} from 'ai';
import {createOpenAI} from '@ai-sdk/openai';
import type {ChatRequest} from './types.js';
import {getOrCreateSession, appendAndWindow, shouldInjectPageContext, getSessionCount} from './sessions.js';
import {checkGuard} from './guard.js';
import {retrieve, isVectorSearchAvailable, setActiveSectionFilter} from './rag.js';
import {computeGrounding} from './grounding.js';
import {routeIntent} from './router.js';
import {getAgent} from './agents/index.js';
import {getToolsForAgent, type ToolName} from './tools/index.js';
import {logEvent, saveConversation, updateUserProfile} from './logger.js';
import {adminApp} from './admin.js';
import type {FeedbackRequest} from './types.js';
import {recordFeedback, getStats} from './feedback.js';
import {loadRules, evaluatePrePrompt, evaluatePostResponse} from './hooks/index.js';
import type {AgentType} from './types.js';
import {computeConfidence} from './confidence.js';
import {findSemanticCacheHit} from './semantic-cache.js';

const promptRules = loadRules(import.meta.url);

// ---------------------------------------------------------------------------
// Deflection detection: suppress sources when the agent deflects off-topic
// ---------------------------------------------------------------------------

const DEFLECTION_PATTERNS = [
  /outside\s+(my|of\s+my)\s+(area\s+of\s+)?expertise/i,
  /i('m|\s+am)\s+(here\s+to\s+help\s+)?(specifically\s+)?with\s+questions\s+about/i,
  /i\s+can('t|\s+only)\s+help\s+with/i,
  /not\s+the\s+right\s+resource/i,
  /beyond\s+(my|the)\s+scope/i,
  /i('m|\s+am)\s+the\s+zilliz.*documentation\s+assistant/i,
];

function isDeflection(text: string): boolean {
  return DEFLECTION_PATTERNS.some(p => p.test(text));
}

// ---------------------------------------------------------------------------
// Section filter: exclude the opposite product's docs based on current page
// ---------------------------------------------------------------------------

function deriveSectionFilter(pageUrl?: string): string | undefined {
  if (!pageUrl) return undefined;
  if (pageUrl.startsWith('/docs/byoc')) return 'section != "cloud-guides"';
  if (pageUrl.startsWith('/reference')) return undefined; // reference sees all
  if (pageUrl.startsWith('/docs')) return 'section != "byoc-guides"';
  return undefined;
}

// ---------------------------------------------------------------------------
// Response cache: skip routing + LLM for identical repeated queries
// ---------------------------------------------------------------------------

interface CachedResponse {
  events: Array<{event: string; data: string}>;
  timestamp: number;
}

const responseCache = new Map<string, CachedResponse>();
const RESPONSE_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes
const RESPONSE_CACHE_MAX = 200;

function responseCacheGet(key: string): Array<{event: string; data: string}> | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > RESPONSE_CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return entry.events;
}

/** Clear the response cache (exposed for testing) */
export function clearResponseCache(): void {
  responseCache.clear();
}

function responseCacheSet(key: string, events: Array<{event: string; data: string}>): void {
  // Evict oldest entries if at capacity
  if (responseCache.size >= RESPONSE_CACHE_MAX) {
    const oldest = responseCache.keys().next().value!;
    responseCache.delete(oldest);
  }
  responseCache.set(key, {events, timestamp: Date.now()});
}

export const app = new Hono();

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const PORT = Number(process.env.PORT) || 8787;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(s => s.trim());
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
const AI_API_KEY = process.env.AI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o';
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

// ---------------------------------------------------------------------------
// AI provider
// ---------------------------------------------------------------------------

const provider = createOpenAI({baseURL: AI_BASE_URL, apiKey: AI_API_KEY});

// ---------------------------------------------------------------------------
// Rate limiter (in-memory, per IP)
// ---------------------------------------------------------------------------

const rateLimitMap = new Map<string, {count: number; resetAt: number}>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, {count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS});
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now >= entry.resetAt) rateLimitMap.delete(ip);
  }
}, RATE_LIMIT_WINDOW_MS);

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

app.use(
  '/chat',
  cors({
    origin: ALLOWED_ORIGINS,
    allowMethods: ['POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
);

app.use(
  '/feedback',
  cors({
    origin: ALLOWED_ORIGINS,
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
);

app.use(
  '/admin/*',
  cors({
    origin: ALLOWED_ORIGINS,
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get('/health', c =>
  c.json({
    ok: true,
    sessions: getSessionCount(),
    vectorSearch: isVectorSearchAvailable(),
  }),
);

// ---------------------------------------------------------------------------
// POST /chat — streaming SSE with agent routing
// ---------------------------------------------------------------------------

app.post('/chat', async c => {
  // Rate limit
  const ip =
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
    c.req.header('x-real-ip') ||
    'unknown';
  if (!checkRateLimit(ip)) {
    return c.json({error: 'Rate limit exceeded. Please try again in a minute.'}, 429);
  }

  // Parse body
  let body: ChatRequest;
  try {
    body = await c.req.json<ChatRequest>();
  } catch {
    return c.json({error: 'Invalid JSON body'}, 400);
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return c.json({error: 'messages array is required and must not be empty'}, 400);
  }

  const userId = body.userId || 'anonymous';

  // Session management
  const {session, isNew} = getOrCreateSession(body.sessionId);
  const windowedMessages = appendAndWindow(session, body.messages);

  // Relevance guard
  const lastUserMessage = [...body.messages].reverse().find(m => m.role === 'user');
  if (lastUserMessage) {
    const guardResult = checkGuard(lastUserMessage.content);
    if (!guardResult.allowed) {
      console.log(`[Guard] Blocked (${guardResult.reason}): ${lastUserMessage.content.slice(0, 80)}`);
      logEvent(session.id, userId, 'message', 'guard', {
        blocked: true,
        reason: guardResult.reason,
        message: lastUserMessage.content.slice(0, 200),
      });

      return c.newResponse(
        new ReadableStream({
          start(controller) {
            const encoder = new TextEncoder();
            const send = (event: string, data: string) => {
              controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
            };
            send('session', JSON.stringify({sessionId: session.id}));
            send('delta', JSON.stringify({text: guardResult.deflection}));
            send('done', JSON.stringify({stop_reason: 'guard'}));
            controller.close();
          },
        }),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
        },
      );
    }
  }

  // Stream response via SSE — open the connection immediately so the
  // client sees activity while routing + RAG run in the background.
  const ragQuery = lastUserMessage?.content || '';

  return c.newResponse(
    new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (event: string, data: string) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
        };

        // Emit session ID immediately so the client knows the connection is live
        send('session', JSON.stringify({sessionId: session.id}));

        // Check response cache for identical repeated queries
        const sectionFilter = deriveSectionFilter(body.pageUrl);
        const responseCacheKey = `${session.id}:${ragQuery}:${sectionFilter || ''}`;
        const cachedEvents = responseCacheGet(responseCacheKey);
        if (cachedEvents) {
          console.log(`[Cache] Response cache hit for: ${ragQuery.slice(0, 60)}`);
          for (const evt of cachedEvents) {
            send(evt.event, evt.data);
          }
          controller.close();
          return;
        }

        // Track events for caching on successful response
        const recordedEvents: Array<{event: string; data: string}> = [];
        const sendAndRecord = (event: string, data: string) => {
          send(event, data);
          recordedEvents.push({event, data});
        };

        // L2: Semantic answer cache (cross-session)
        if (isVectorSearchAvailable()) {
          try {
            const semanticHit = await findSemanticCacheHit(ragQuery, sectionFilter);
            if (semanticHit) {
              console.log(`[Cache] Semantic hit (sim=${semanticHit.similarity.toFixed(3)}): ${ragQuery.slice(0, 60)}`);
              sendAndRecord('agent', JSON.stringify({type: semanticHit.agentType, name: semanticHit.agentName}));
              sendAndRecord('delta', JSON.stringify({text: semanticHit.text}));
              sendAndRecord('confidence', JSON.stringify({level: semanticHit.confidence, retrieval_score: 0}));
              if (semanticHit.sources.length > 0) {
                sendAndRecord('sources', JSON.stringify({sources: semanticHit.sources}));
              }
              sendAndRecord('done', JSON.stringify({stop_reason: 'semantic_cache'}));
              responseCacheSet(responseCacheKey, recordedEvents);
              logEvent(session.id, userId, 'message', semanticHit.agentType, {
                role: 'assistant', content: semanticHit.text.slice(0, 500),
                confidence: semanticHit.confidence, semanticCacheHit: true, similarity: semanticHit.similarity,
              });
              controller.close();
              return;
            }
          } catch (err) {
            console.warn('[Cache] Semantic cache error:', (err as Error).message);
          }
        }

        try {
          // Route intent and retrieve docs (runs while client is connected)
          setActiveSectionFilter(sectionFilter);
          console.log(`[Section] pageUrl=${body.pageUrl} filter=${sectionFilter || 'none'}`);
          const [routeResult, ragResult] = await Promise.all([
            routeIntent(ragQuery, body.messages, session.id).catch(() => ({agent: 'general' as const, reasoning: 'Router fallback'})),
            retrieve(ragQuery, sectionFilter),
          ]);

          const agentConfig = getAgent(routeResult.agent as any);
          const agentTools = getToolsForAgent(agentConfig.toolNames);

          logEvent(session.id, userId, 'routing', routeResult.agent, {
            reasoning: routeResult.reasoning,
            message: ragQuery.slice(0, 200),
          });

          // Emit agent info
          sendAndRecord('agent', JSON.stringify({
            type: agentConfig.type,
            name: agentConfig.name,
          }));

          // Build system prompt
          let systemPrompt = agentConfig.systemPrompt;

          if (ragResult.context) {
            systemPrompt += `\n\n${ragResult.context}`;
          }

          if (body.pageContext && shouldInjectPageContext(session, body.pageUrl)) {
            systemPrompt += `\n\n## Current Page Content (HIGHEST PRIORITY)\nThe user is currently viewing the page below. When their question relates to this page, answer from this content FIRST before using other sources.\n\n${body.pageContext.slice(0, 8000)}`;
          }

          // Evaluate pre-prompt hooks (confidence not yet known)
          const preCtx = {message: ragQuery, agentType: routeResult.agent as AgentType};
          const injections = evaluatePrePrompt(promptRules, preCtx);
          if (injections.length > 0) {
            systemPrompt += '\n\n## Additional Instructions\n' + injections.join('\n\n');
          }

          const result = streamText({
            model: provider(AI_MODEL),
            maxTokens: 4096,
            tools: agentTools,
            maxSteps: 5,
            system: systemPrompt,
            messages: windowedMessages.map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            })),
          });

          const toolsCalled: string[] = [];
          const toolSources: {title: string; url: string; score?: number}[] = [];
          let fullText = '';

          for await (const part of result.fullStream) {
            if (part.type === 'text-delta') {
              fullText += part.textDelta;
              sendAndRecord('delta', JSON.stringify({text: part.textDelta}));
            } else if (part.type === 'tool-call') {
              toolsCalled.push(part.toolName);
              sendAndRecord('tool-call', JSON.stringify({tool: part.toolName, count: toolsCalled.length}));
              logEvent(session.id, userId, 'tool_call', agentConfig.type, {
                tool: part.toolName,
                args: part.args,
              });
            } else if (part.type === 'tool-result') {
              // Extract sources from any tool that returns doc URLs
              const toolResult = part.result as Record<string, any>;
              if (toolResult?.results) {
                // searchDocs returns { results: [{title, url, score, ...}] }
                for (const r of toolResult.results) {
                  if (r.url) toolSources.push({title: r.title || '', url: r.url, score: r.score});
                }
              }
              if (toolResult?.relatedDocs) {
                // getCodeExample returns { relatedDocs: [{title, url}] }
                for (const r of toolResult.relatedDocs) {
                  if (r.url) toolSources.push({title: r.title || '', url: r.url});
                }
              }
              if (toolResult?.url && toolResult?.success) {
                // getPageContent returns { url, success, content }
                toolSources.push({title: toolResult.url, url: toolResult.url});
              }
            }
          }

          // Merge RAG sources with tool-extracted sources, deduplicating by URL
          const seenUrls = new Set<string>();
          const allSources: {title: string; url: string; score?: number; section?: string}[] = [];
          for (const src of [...ragResult.sources, ...toolSources]) {
            if (!seenUrls.has(src.url)) {
              seenUrls.add(src.url);
              allSources.push(src);
            }
          }

          // Compute confidence
          const confidenceResult = computeConfidence({
            ragResults: ragResult.rawResults.map(r => ({score: r.score, doc_url: r.doc_url})),
            ragSources: ragResult.sources,
            ragAvgScore: ragResult.confidence.avgScore,
            toolsCalled,
            toolSources,
            fullText,
            pageContext: body.pageContext,
            pageUrl: body.pageUrl,
          });
          const confidence = confidenceResult.level;

          console.log(`[Confidence] score=${confidenceResult.score.toFixed(3)} level=${confidence}`,
            JSON.stringify(confidenceResult.breakdown));

          // Emit confidence
          sendAndRecord('confidence', JSON.stringify({
            level: confidence,
            retrieval_score: ragResult.confidence.avgScore,
          }));

          // Deterministic source grounding (replaces LLM-dependent citations)
          // Suppress sources on deflected/off-topic responses
          const deflected = isDeflection(fullText);
          if (deflected) {
            console.log('[Sources] Suppressed — deflection detected');
          } else {
            const grounding = computeGrounding(fullText, ragResult.rawResults, allSources);
            console.log(`[Sources] RAG: ${ragResult.sources.length}, Tools: ${toolSources.length}, Merged: ${allSources.length}, Grounded: ${grounding.sources.length}`);
            if (grounding.sources.length > 0) {
              sendAndRecord('sources', JSON.stringify({sources: grounding.sources}));
            }
            if (grounding.citations.length > 0) {
              sendAndRecord('grounding', JSON.stringify({citations: grounding.citations}));
            }
          }

          // Evaluate post-response hooks (confidence now known)
          const postCtx = {message: ragQuery, agentType: agentConfig.type as AgentType, confidence};
          const appends = evaluatePostResponse(promptRules, postCtx);
          for (const text of appends) {
            sendAndRecord('hook-append', JSON.stringify({text: '\n\n' + text.trim()}));
          }

          sendAndRecord('done', JSON.stringify({stop_reason: 'end_turn'}));

          // Cache the successful response for replay
          responseCacheSet(responseCacheKey, recordedEvents);

          // Log the message (fire-and-forget)
          logEvent(session.id, userId, 'message', agentConfig.type, {
            role: 'assistant',
            content: fullText.slice(0, 500),
            confidence,
            toolsCalled,
            sourceCount: allSources.length,
          });

          // Save conversation (fire-and-forget)
          saveConversation({
            id: session.id,
            userId,
            sessionId: session.id,
            messages: windowedMessages.map(m => ({role: m.role, content: m.content})),
            agentTypesUsed: [agentConfig.type],
            toolsCalled,
            sourcesReturned: allSources.map(s => s.url),
            confidenceLevels: [confidence],
            pageUrls: body.pageUrl ? [body.pageUrl] : [],
            feedbackSummary: {up: 0, down: 0},
          }).catch(() => {});

          // Update user profile (fire-and-forget)
          updateUserProfile(userId, {
            agentsUsed: {[agentConfig.type]: 1},
            topicsDiscussed: [ragQuery.slice(0, 64)],
            pagesVisited: body.pageUrl ? [body.pageUrl] : [],
          }).catch(() => {});
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Internal server error';
          send('error', JSON.stringify({error: message}));
          logEvent(session.id, userId, 'error', 'unknown', {error: message});
        } finally {
          controller.close();
        }
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    },
  );
});

// ---------------------------------------------------------------------------
// POST /feedback — record thumbs up/down
// ---------------------------------------------------------------------------

app.post('/feedback', async c => {
  let body: FeedbackRequest;
  try {
    body = await c.req.json<FeedbackRequest>();
  } catch {
    return c.json({error: 'Invalid JSON body'}, 400);
  }

  if (!body.sessionId || body.messageIndex == null || !['up', 'down'].includes(body.rating)) {
    return c.json({error: 'sessionId, messageIndex, and rating (up|down) are required'}, 400);
  }

  recordFeedback(body.sessionId, body.messageIndex, body.rating, body.pageUrl);

  // Log feedback event
  logEvent(body.sessionId, body.userId || 'anonymous', 'feedback', '', {
    rating: body.rating,
    messageIndex: body.messageIndex,
    pageUrl: body.pageUrl,
  });

  return c.json({ok: true});
});

// ---------------------------------------------------------------------------
// GET /feedback/stats
// ---------------------------------------------------------------------------

app.get('/feedback/stats', c => c.json(getStats()));

// ---------------------------------------------------------------------------
// Admin routes
// ---------------------------------------------------------------------------

app.route('/admin', adminApp);
