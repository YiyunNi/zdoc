import {Hono, type Context, type MiddlewareHandler} from 'hono';
import {cors} from 'hono/cors';
import {streamText, stepCountIs, smoothStream} from 'ai';
import type {ChatRequest} from './types.js';
import {resolveModel, createModelInstance} from './runtime-config.js';
import {getOrCreateSession, appendAndWindow, shouldInjectPageContext} from './sessions.js';
import {checkGuard} from './guard.js';
import {setActiveSectionFilter, setQueryEmbedding, searchDocs, getIndexStatus, getTitleByUrl} from './rag.js';
import {groundAtomically} from './grounding-agent.js';
import {routeIntent} from './router.js';
import {getAgent} from './agents/index.js';
import {getToolsForAgent, type ToolName} from './tools/index.js';
import {logEvent, saveConversation, updateUserProfile} from './logger.js';
import {adminApp} from './admin.js';
import {makeTelemetry} from './telemetry.js';
import {incCounter, renderMetrics} from './metrics.js';
import type {FeedbackRequest} from './types.js';
import {recordFeedback, getStats} from './feedback.js';
import {inferSection} from './sources.js';
import {getRules, evaluatePrePrompt, evaluatePostResponse} from './hooks/index.js';
import type {AgentType} from './types.js';
import {computeConfidence} from './confidence.js';
import {loadPrompts, getBasePrompt, getTopicPrompt} from './prompts.js';
import {
  semanticCacheLookup,
  semanticCacheWrite,
  computeEmbedding,
  getSemanticCacheConfig,
} from './semantic-cache.js';
import type {SemanticCacheHit} from './semantic-cache.js';
import type {TokenUsage} from './types.js';
import {saveTokenUsage, isDbReady} from './db.js';
import {startedAt, llmHealth, recordLlmSuccess, recordLlmError} from './health.js';
import {handlePostAction} from './post-action-handler.js';
import type {ResolvedModel} from './runtime-config.js';

// Load topic prompts from disk at startup
loadPrompts();

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const MAX_FALLBACK_SOURCES = 5;  // Max sources to show when grounding returns empty

// ---------------------------------------------------------------------------
// Reasoning-model workaround: DeepSeek reasoning models require
// reasoning_content to be passed back on follow-up calls, which AI SDK v6
// doesn't handle automatically during tool loops. Map them to the chat
// variant for the streaming chat endpoint only.
// ---------------------------------------------------------------------------

function getChatModelForStream(resolved: ResolvedModel): ResolvedModel {
  const m = resolved.model.toLowerCase();
  if (!m.includes('deepseek')) return resolved;
  // Known safe chat models that support tool loops
  const safeChatModels = new Set([
    'deepseek-chat',
    'deepseek-v3',
    'deepseek/deepseek-chat',
    'deepseek/deepseek-v3',
  ]);
  if (safeChatModels.has(m)) return resolved;
  // Everything else (reasoner, r1, v4-pro, etc.) is treated as a reasoning
  // model that AI SDK v6 can't loop with. Map to the chat variant.
  const chatModel = m.includes('/') ? 'deepseek/deepseek-chat' : 'deepseek-chat';
  return {...resolved, model: chatModel};
}

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
// Self-description detection: suppress sources on capability/meta responses
// ---------------------------------------------------------------------------

const SELF_DESCRIPTION_PATTERNS = [
  /what\s+would\s+you\s+like\s+me\s+to\s+code/i,
  /i\s+can\s+(help|assist)\s+(you\s+)?(with|generate|write|create)\s+(code|examples)/i,
  /just\s+tell\s+me\s+what\s+you\s+need/i,
  /here('s|\s+are)\s+(what|some\s+things)\s+i\s+can/i,
  /i('m|\s+am)\s+(a\s+)?(code|coding|sdk)\s+(assistant|expert|specialist)/i,
  /for\s+example[,:]\s*\n/i,
];

function isSelfDescription(text: string): boolean {
  // Must match at least 2 patterns — a single match could be coincidental
  let matches = 0;
  for (const p of SELF_DESCRIPTION_PATTERNS) {
    if (p.test(text)) matches++;
    if (matches >= 2) return true;
  }
  return false;
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
const ALLOWED_ORIGINS = [
  ...(process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').map(s => s.trim()),
  ...(process.env.DEV_SERVER ? [process.env.DEV_SERVER.trim()] : []),
].filter((v, i, a) => a.indexOf(v) === i); // deduplicate
// Hono's cors middleware treats the string "*" as a wildcard, but an array
// containing "*" does NOT match every origin (it checks includes()). Pass the
// string wildcard through so CORS works as expected when configured broadly.
const CORS_ORIGIN = ALLOWED_ORIGINS.length === 1 && ALLOWED_ORIGINS[0] === '*' ? '*' : ALLOWED_ORIGINS;
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

// ---------------------------------------------------------------------------
// Rate limiter (in-memory, per IP)
// ---------------------------------------------------------------------------

const rateLimitMap = new Map<string, {count: number; resetAt: number}>();

// ---------------------------------------------------------------------------
// Traffic source attribution (X-Traffic-Source header)
// ---------------------------------------------------------------------------

const SOURCE_RE = /^[a-z0-9-]{1,32}$/i;

function parseSource(c: Context): string {
  const raw = c.req.header('x-traffic-source')?.trim();
  return raw && SOURCE_RE.test(raw) ? raw.toLowerCase() : 'docs';
}

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

function isPrivateIp(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length === 4) {
    const [a, b] = parts;
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 127) return true;
  }
  return ip === '::1' || ip.startsWith('fc00:') || ip.startsWith('fe80:');
}

export function getClientIp(c: Context): string {
  const forwarded = c.req.header('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map(s => s.trim()).filter(Boolean);
    for (const ip of ips) {
      if (!isPrivateIp(ip)) {
        return ip;
      }
    }
    return ips[0] || 'unknown';
  }
  return c.req.header('x-real-ip') || 'unknown';
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
  '/search',
  cors({
    origin: CORS_ORIGIN,
    allowMethods: ['GET', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
);

app.use(
  '/chat',
  cors({
    origin: CORS_ORIGIN,
    allowMethods: ['POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
);

app.use(
  '/feedback',
  cors({
    origin: CORS_ORIGIN,
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
);

app.use(
  '/admin/*',
  cors({
    origin: CORS_ORIGIN,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(
  '/health/*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'OPTIONS'],
  }),
);

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get('/health', async c => {
  const now = Date.now();
  const index = await getIndexStatus();
  const dbOk = isDbReady();

  // LLM is considered "ready" if we've had at least one successful call
  // and no errors in the last 5 minutes
  const llmReady = llmHealth.lastSuccessAt !== null &&
    (llmHealth.lastErrorAt === null || new Date(llmHealth.lastSuccessAt) > new Date(llmHealth.lastErrorAt));

  // Index freshness
  const indexAgeMs = index.lastRefreshed ? now - new Date(index.lastRefreshed).getTime() : null;

  return c.json({
    ok: dbOk && (index.ready || index.chunks === 0), // ok if DB is up; index may still be loading
    startedAt,
    uptime: Math.round((now - new Date(startedAt).getTime()) / 1000),
    db: {ready: dbOk},
    llm: {ready: llmReady},
    index: {
      ready: index.ready,
      chunks: index.chunks,
      lastRefreshed: index.lastRefreshed,
      ageMs: indexAgeMs,
      ageHuman: indexAgeMs !== null ? `${Math.round(indexAgeMs / 60000)}m` : null,
    },
  });
});

// ---------------------------------------------------------------------------
// Body size limit for /chat
// ---------------------------------------------------------------------------

const MAX_BODY_SIZE_BYTES = 1024 * 1024; // 1 MB

function bodySizeLimit(): MiddlewareHandler {
  return async (c, next) => {
    const contentLength = c.req.header('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE_BYTES) {
      return c.json({error: 'Request body too large'}, 413);
    }
    const cloned = c.req.raw.clone();
    const blob = await cloned.blob();
    if (blob.size > MAX_BODY_SIZE_BYTES) {
      return c.json({error: 'Request body too large'}, 413);
    }
    return next();
  };
}

app.use('/chat', bodySizeLimit());

// ---------------------------------------------------------------------------
// GET /search — lightweight BM25 search for the search bar (no LLM)
// ---------------------------------------------------------------------------

app.get('/search', async c => {
  const q = c.req.query('q');
  if (!q || q.length < 2) return c.json({results: []});
  const section = c.req.query('section') || undefined;

  try {
    const results = await searchDocs(q, 8, section);
    return c.json({
      results: results.map(r => ({
        title: r.doc_title,
        url: r.doc_url,
        section: r.section,
        snippet: r.content.slice(0, 150).replace(/\n/g, ' '),
        score: r.score,
      })),
    });
  } catch {
    return c.json({results: []});
  }
});

// ---------------------------------------------------------------------------
// POST /chat — streaming SSE with agent routing
// ---------------------------------------------------------------------------

app.post('/chat', async c => {
  // Rate limit
  const ip = getClientIp(c);
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
  const source = parseSource(c);

  // Extract user metadata for observability
  const userMeta: Record<string, unknown> = {};
  const ua = c.req.header('user-agent');
  if (ua) userMeta.user_agent = ua;
  if (ip && ip !== 'unknown') {
    userMeta.ip = ip;
    try {
      const { lookupGeo } = await import('./geoip.js');
      const geo = await lookupGeo(ip);
      if (geo) { userMeta.country = geo.country; userMeta.city = geo.city; }
    } catch {}
  }
  const referer = c.req.header('referer');
  if (referer) userMeta.referer = referer;
  const acceptLanguage = c.req.header('accept-language');
  if (acceptLanguage) userMeta.language = acceptLanguage;
  if (body.screenResolution) userMeta.screen_resolution = body.screenResolution;

  // Session management
  const {session, isNew} = getOrCreateSession(body.sessionId);
  const windowedMessages = appendAndWindow(session, body.messages);

  // Relevance guard
  const lastUserMessage = [...body.messages].reverse().find(m => m.role === 'user');
  if (lastUserMessage) {
    const guardResult = checkGuard(lastUserMessage.content);
    if (!guardResult.allowed) {
      console.log(`[Guard] Blocked (${guardResult.reason}): ${lastUserMessage.content.slice(0, 80)}`);
      incCounter('chat_proxy_requests_total', {agent: 'guard', model: 'none', status: guardResult.reason === 'injection' ? 'blocked_injection' : 'blocked_greeting'});
      logEvent(session.id, userId, 'message', 'guard', {
        blocked: true,
        reason: guardResult.reason,
        message: lastUserMessage.content,
      }, userMeta, source);

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
  const rawQuery = lastUserMessage?.content || '';
  // Enrich short follow-up queries with recent conversation context
  const isFollowUp = rawQuery.length < 40 && windowedMessages.length > 2;
  const ragQuery = isFollowUp
    ? windowedMessages.slice(-3).filter(m => m.role === 'user').map(m => m.content).join(' ')
    : rawQuery;

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
        const tChatStart = Date.now();
        const sectionFilter = deriveSectionFilter(body.pageUrl);
        const responseCacheKey = `${session.id}:${ragQuery}:${sectionFilter || ''}`;
        const cachedEvents = responseCacheGet(responseCacheKey);
        if (cachedEvents) {
          console.log(`[Cache] Response cache hit for: ${ragQuery.slice(0, 60)}`);
          incCounter('chat_proxy_cache_hits_total', {type: 'response'});
          send('cache', JSON.stringify({type: 'session'}));
          for (const evt of cachedEvents) {
            send(evt.event, evt.data);
          }
          controller.close();
          return;
        }
        incCounter('chat_proxy_cache_misses_total', {type: 'response'});

        // Kick off embedding and routing concurrently. They are independent until
        // after the semantic cache check; parallelizing removes the serial wait
        // that was the dominant first-token bottleneck.
        const tEmbedStart = Date.now();
        const embeddingPromise = computeEmbedding(ragQuery).catch((err: Error) => {
          console.warn('[Embedding] Failed to compute query embedding:', err.message);
          return null;
        });

        const routePromise = routeIntent(ragQuery, body.messages, session.id).catch(() =>
          ({agent: 'general' as const, topics: [] as string[], reasoning: 'Router fallback'}),
        );

        // Check semantic cache for similar queries across sessions
        let semanticHit: SemanticCacheHit | null = null;
        const queryEmbedding = await embeddingPromise;
        const tEmbed = Date.now() - tEmbedStart;
        if (queryEmbedding) {
          try {
            semanticHit = await semanticCacheLookup(ragQuery, sectionFilter, queryEmbedding);
          } catch (err) {
            console.warn('[SemanticCache] Lookup failed:', (err as Error).message);
          }
        }
        if (semanticHit) {
          console.log(`[SemanticCache] Replay cached response: ${ragQuery.slice(0, 60)}`);
          incCounter('chat_proxy_cache_hits_total', {type: 'semantic'});
          send('cache', JSON.stringify({type: 'semantic', similarity: semanticHit.similarity}));
          const events = JSON.parse(semanticHit.entry.sse_events) as Array<{event: string; data: string}>;
          for (const evt of events) {
            send(evt.event, evt.data);
          }
          controller.close();
          return;
        }
        incCounter('chat_proxy_cache_misses_total', {type: 'semantic'});

        // Track events for caching on successful response
        const recordedEvents: Array<{event: string; data: string}> = [];
        const sendAndRecord = (event: string, data: string) => {
          send(event, data);
          recordedEvents.push({event, data});
        };

        let currentAgent = 'unknown';
        let currentModel = 'unknown';

        try {
          setActiveSectionFilter(sectionFilter);
          setQueryEmbedding(queryEmbedding);
          console.log(`[Section] pageUrl=${body.pageUrl} filter=${sectionFilter || 'none'}`);
          const tRouteStart = Date.now();
          const routeResult = await routePromise;
          const tRoute = Date.now() - tRouteStart;

          const agentConfig = getAgent(routeResult.agent as any);
          currentAgent = agentConfig.type;
          const agentTools = getToolsForAgent(agentConfig.toolNames);

          // Resolve model from runtime config (DB override → env var → default)
          const resolvedModel = await resolveModel(`agent:${agentConfig.type}`);
          const chatModelResolved = getChatModelForStream(resolvedModel);
          const activeModel = chatModelResolved.model;
          currentModel = activeModel;
          if (chatModelResolved.model !== resolvedModel.model) {
            console.log(`[Model] Mapped reasoning model ${resolvedModel.model} → ${chatModelResolved.model} for streaming`);
          }

          logEvent(session.id, userId, 'routing', routeResult.agent, {
            reasoning: routeResult.reasoning,
            topics: routeResult.topics,
            model: activeModel,
            message: rawQuery.slice(0, 200),
          }, userMeta, source);

          // Log the user message for session reconstruction
          if (lastUserMessage) {
            logEvent(session.id, userId, 'message', agentConfig.type, {
              role: 'user',
              content: lastUserMessage.content,
              question: ragQuery,
            }, userMeta, source);
          }

          // Emit agent info (including model for observability)
          sendAndRecord('agent', JSON.stringify({
            type: agentConfig.type,
            name: agentConfig.name,
            model: activeModel,
          }));

          // Build system prompt: base + agent role + topic prompts + RAG context
          let systemPrompt = getBasePrompt() + '\n\n' + agentConfig.systemPrompt;

          // Inject topic-specific prompts (max 2 to stay within context limits)
          const topics = routeResult.topics || [];
          for (const topic of topics.slice(0, 2)) {
            const topicContent = getTopicPrompt(topic);
            if (topicContent) {
              systemPrompt += `\n\n## Topic Reference: ${topic}\n${topicContent}`;
            }
          }

          if (body.pageContext && shouldInjectPageContext(session, body.pageUrl)) {
            systemPrompt += `\n\n## Current Page Content (HIGHEST PRIORITY)\nThe user is currently viewing the page below. When their question relates to this page, answer from this content FIRST before using other sources.\n\n${body.pageContext.slice(0, 8000)}`;
          }

          // Evaluate pre-prompt hooks (confidence not yet known)
          const preCtx = {message: ragQuery, agentType: routeResult.agent as AgentType};
          const injections = evaluatePrePrompt(getRules(), preCtx);
          if (injections.length > 0) {
            systemPrompt += '\n\n## Additional Instructions\n' + injections.join('\n\n');
          }

          const tLlmStart = Date.now();
          const result = streamText({
            model: await createModelInstance(chatModelResolved),
            maxOutputTokens: 4096,
            temperature: 0.2,
            tools: agentTools,
            stopWhen: stepCountIs(8),
            abortSignal: AbortSignal.timeout(120000),
            system: systemPrompt,
            messages: windowedMessages.map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            })),
            experimental_transform: smoothStream({delayInMs: 15}),
            experimental_telemetry: makeTelemetry('chat-stream', {
              agentType: agentConfig.type,
              sessionId: session.id,
              model: activeModel,
            }),
          });

          const toolsCalled: string[] = [];
          const toolSources: {title: string; url: string; score?: number; section?: string}[] = [];
          const toolChunks: {doc_url: string; doc_title: string; section: string; content: string}[] = [];
          let fullText = '';
          let groundedSourceCount = 0;

          for await (const part of result.fullStream) {
            if (part.type === 'error') {
              throw new Error((part as any).error || 'LLM stream error');
            }
            if (part.type === 'text-delta') {
              fullText += part.text;
              sendAndRecord('delta', JSON.stringify({text: part.text}));
            } else if (part.type === 'tool-call') {
              toolsCalled.push(part.toolName);
              incCounter('chat_proxy_tool_calls_total', {tool: part.toolName});
              sendAndRecord('tool-call', JSON.stringify({tool: part.toolName, count: toolsCalled.length}));
              logEvent(session.id, userId, 'tool_call', agentConfig.type, {
                tool: part.toolName,
                args: (part as any).input ?? (part as any).args,
              }, userMeta, source);
            } else if ((part as any).type === 'tool-result') {
              // Extract sources from any tool that returns doc URLs
              // AI SDK v6 fullStream uses .output for tool-result events
              const toolResult = (part as any).output as Record<string, any>;
              if (toolResult?.results) {
                // searchDocs returns { results: [{title, url, score, content, section, ...}] }
                for (const r of toolResult.results) {
                  if (r.url) {
                    toolSources.push({title: r.title || '', url: r.url, score: r.score, section: r.section});
                    if (r.content) toolChunks.push({
                      doc_url: r.url,
                      doc_title: r.title || '',
                      section: r.section || '',
                      content: r.content,
                    });
                  }
                }
              }
              if (toolResult?.relatedDocs) {
                // getCodeExample returns { relatedDocs: [{title, url}] }
                for (const r of toolResult.relatedDocs) {
                  if (r.url) toolSources.push({title: r.title || '', url: r.url});
                }
              }
              if (toolResult?.url && toolResult?.success) {
                // getPageContent returns { url, success, content } — look up real title from index
                const titleFromIndex = await getTitleByUrl(toolResult.url);
                const pageTitle = toolResult.title || titleFromIndex || toolResult.url;
                toolSources.push({title: pageTitle, url: toolResult.url});
                if (toolResult.content) toolChunks.push({
                  doc_url: toolResult.url,
                  doc_title: pageTitle,
                  section: '',
                  content: toolResult.content,
                });
              }
            }
          }

          // Stream completed successfully — mark LLM health as good
          recordLlmSuccess();

          // Capture total token usage across all LLM steps (important with tool calls)
          let tokenUsage: TokenUsage | null = null;
          try {
            const usage = await result.totalUsage;
            if (usage.inputTokens != null && usage.outputTokens != null) {
              tokenUsage = {
                inputTokens: usage.inputTokens,
                outputTokens: usage.outputTokens,
                totalTokens: usage.totalTokens ?? usage.inputTokens + usage.outputTokens,
                cachedInputTokens: usage.cachedInputTokens ?? 0,
                model: activeModel,
                agentType: agentConfig.type,
              };
              incCounter('chat_proxy_token_usage_total', {model: activeModel, agent: agentConfig.type, type: 'input'}, usage.inputTokens);
              incCounter('chat_proxy_token_usage_total', {model: activeModel, agent: agentConfig.type, type: 'output'}, usage.outputTokens);
              incCounter('chat_proxy_token_usage_total', {model: activeModel, agent: agentConfig.type, type: 'total'}, tokenUsage.totalTokens);
            }
          } catch (err) {
            console.warn('[Usage] Failed to read totalUsage:', (err as Error).message);
          }

          // Deduplicate tool sources by URL
          const seenUrls = new Set<string>();
          const allSources: {title: string; url: string; score?: number; section?: string}[] = [];
          for (const src of toolSources) {
            if (!seenUrls.has(src.url)) {
              seenUrls.add(src.url);
              allSources.push({...src, section: inferSection(src.section, src.url)});
            }
          }

          const tLlm = Date.now() - tLlmStart;

          // Compute confidence (agentic mode — tool-based signals only)
          const confidenceResult = computeConfidence({
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
            retrieval_score: 0,
          }));

          // Atomic source attribution: IDF pre-filter → LLM re-rank
          const tGroundStart = Date.now();
          // Suppress sources on deflected/off-topic or self-description responses
          const deflected = isDeflection(fullText);
          const selfDescribed = isSelfDescription(fullText);
          if (deflected || selfDescribed) {
            console.log(`[Sources] Suppressed — ${deflected ? 'deflection' : 'self-description'} detected`);
          } else {
            // Build grounding chunks from tool results
            const allChunks = toolChunks.map(tc => ({
              id: '', doc_url: tc.doc_url, doc_url_md: tc.doc_url,
              doc_title: tc.doc_title, section: tc.section, content: tc.content,
              score: 0, weight: 1.0, contextScore: 0,
            }));

            // Pre-LLM section filter: exclude sources the LLM shouldn't even consider
            let filteredCandidates = allSources;
            if (sectionFilter) {
              const excludeMatch = sectionFilter.match(/section\s*!=\s*"([^"]+)"/);
              if (excludeMatch) {
                const excluded = excludeMatch[1];
                filteredCandidates = allSources.filter(s =>
                  inferSection(s.section, s.url) !== excluded
                );
              }
            }

            // Single-pass LLM source attribution
            const grounding = await groundAtomically(fullText, filteredCandidates, allChunks);

            console.log(
              `[Sources] method=${grounding.method} Tools: ${toolSources.length}, Deduped: ${allSources.length}, Filtered: ${filteredCandidates.length}, Grounded: ${grounding.sources.length}`,
            );

            if (process.env.DEBUG_GROUNDING === 'true') {
              sendAndRecord('attribution_debug', JSON.stringify({
                method: grounding.method,
                candidateCount: filteredCandidates.length,
                selectedCount: grounding.sources.length,
              }));
            }

            // Always send sources - prefer over-attribution to under-attribution (industry standard)
            if (grounding.sources.length > 0) {
              groundedSourceCount = grounding.sources.length;
              // Grounding succeeded — send with paragraph-level citations
              sendAndRecord('sources', JSON.stringify({sources: grounding.sources}));
              sendAndRecord('grounding', JSON.stringify({citations: grounding.citations}));
            } else if (allSources.length > 0) {
              // Grounding found no matches, but tools retrieved relevant docs - show them as fallback
              console.log(`[Sources] Grounding returned empty, showing ${allSources.length} tool sources as fallback`);
              sendAndRecord('sources', JSON.stringify({
                sources: allSources.slice(0, MAX_FALLBACK_SOURCES),
              }));
            }
          }

          // Evaluate post-response hooks (confidence now known)
          const postCtx = {message: ragQuery, agentType: agentConfig.type as AgentType, confidence};
          const appends = evaluatePostResponse(getRules(), postCtx);
          for (const text of appends) {
            sendAndRecord('hook-append', JSON.stringify({text: '\n\n' + text.trim()}));
          }

          sendAndRecord('done', JSON.stringify({stop_reason: 'end_turn'}));

          // Emit token usage event (before caching, fire-and-forget)
          if (tokenUsage) {
            sendAndRecord('usage', JSON.stringify({
              inputTokens: tokenUsage.inputTokens,
              outputTokens: tokenUsage.outputTokens,
              totalTokens: tokenUsage.totalTokens,
              cachedInputTokens: tokenUsage.cachedInputTokens,
              model: tokenUsage.model,
            }));
          }

          // Cache the successful response for replay (session-scoped exact match)
          responseCacheSet(responseCacheKey, recordedEvents);

          // Store in semantic cache (cross-session, similarity-based) — fire-and-forget
          // Reuse the pre-computed embedding from the beginning of the request
          if (queryEmbedding) {
            const sourceChunkHashes = toolChunks.map(tc => tc.doc_url + '#' + (tc.section ? tc.section + ':' : '') + tc.content.slice(0, 100));
            const sourceEntries = allSources.map(s => ({url: s.url}));
            const confidenceJson = JSON.stringify({level: confidence, score: 0});

            semanticCacheWrite({
              queryText: ragQuery,
              queryEmbedding,
              agent: agentConfig.type,
              sectionFilter,
              sseEvents: recordedEvents,
              sources: sourceEntries,
              chunkHashes: sourceChunkHashes.slice(0, 20),
              confidence: confidenceJson,
            }).catch(() => {});
          }

          // Log the message (fire-and-forget)
          logEvent(session.id, userId, 'message', agentConfig.type, {
            role: 'assistant',
            content: fullText,
            question: ragQuery.slice(0, 200),
            model: activeModel,
            confidence,
            toolsCalled,
            sourceCount: allSources.length,
            sources: allSources.map(s => ({ title: s.title, url: s.url, section: s.section })),
            pageUrl: body.pageUrl,
            inputTokens: tokenUsage?.inputTokens,
            outputTokens: tokenUsage?.outputTokens,
            totalTokens: tokenUsage?.totalTokens,
            cachedInputTokens: tokenUsage?.cachedInputTokens,
          }, userMeta, source);

          const tGround = Date.now() - tGroundStart;
          console.log(`[timing] embed=${tEmbed}ms route=${tRoute}ms llm=${tLlm}ms ground=${tGround}ms total=${Date.now() - tChatStart}ms tools=${toolsCalled.length} sources=${allSources.length}`);

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
            tokenUsage: tokenUsage ?? undefined,
          });

          // Persist token usage to PostgreSQL (fire-and-forget)
          if (tokenUsage) {
            saveTokenUsage({
              sessionId: session.id,
              userId,
              model: tokenUsage.model,
              agentType: tokenUsage.agentType,
              inputTokens: tokenUsage.inputTokens,
              outputTokens: tokenUsage.outputTokens,
              totalTokens: tokenUsage.totalTokens,
              cachedInputTokens: tokenUsage.cachedInputTokens,
            }).catch(() => {});
          }

          // Update user profile (fire-and-forget)
          updateUserProfile(userId, {
            agentsUsed: {[agentConfig.type]: 1},
            topicsDiscussed: [ragQuery.slice(0, 64)],
            pagesVisited: body.pageUrl ? [body.pageUrl] : [],
          });

          // Post-action handler: diagnose and act on low-confidence/error responses (fire-and-forget)
          handlePostAction({
            confidenceLevel: confidence,
            confidenceBreakdown: confidenceResult.breakdown,
            toolsCalled,
            sourceCount: allSources.length,
            groundedSourceCount,
            fullText,
            query: ragQuery,
            agentType: agentConfig.type,
            model: activeModel,
            sectionFilter,
            sessionId: session.id,
            isDeflected: deflected,
            isSelfDescribed: selfDescribed,
          });
          incCounter('chat_proxy_requests_total', {agent: currentAgent, model: currentModel, status: 'success'});
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Internal server error';
          console.error('[Chat] Stream error:', message);
          send('error', JSON.stringify({error: message}));
          // Allow the error event to flush before the finally block closes the controller
          await new Promise(r => setTimeout(r, 100));
          logEvent(session.id, userId, 'error', 'unknown', {error: message}, userMeta, source);
          recordLlmError(message);
          incCounter('chat_proxy_requests_total', {agent: currentAgent, model: currentModel, status: 'error'});

          // Post-action for hard errors
          handlePostAction({
            confidenceLevel: 'low',
            toolsCalled: [],
            sourceCount: 0,
            groundedSourceCount: 0,
            fullText: '',
            query: ragQuery,
            agentType: 'unknown',
            model: '',
            sectionFilter,
            sessionId: session.id,
            isDeflected: false,
            isSelfDescribed: false,
            error: message,
          });
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

  const source = parseSource(c);

  // Log feedback event
  logEvent(body.sessionId, body.userId || 'anonymous', 'feedback', '', {
    rating: body.rating,
    messageIndex: body.messageIndex,
    pageUrl: body.pageUrl,
  }, undefined, source);

  return c.json({ok: true});
});

// GET /feedback/stats — public feedback statistics
app.get('/feedback/stats', c => {
  return c.json(getStats());
});

// ---------------------------------------------------------------------------
// Metrics endpoint (Prometheus-style)
// ---------------------------------------------------------------------------

app.get('/metrics', c => {
  return c.text(renderMetrics(), 200, {'Content-Type': 'text/plain; charset=utf-8'});
});

// ---------------------------------------------------------------------------
// Admin routes
// ---------------------------------------------------------------------------

app.route('/admin', adminApp);
