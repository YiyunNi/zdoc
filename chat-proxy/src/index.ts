import {config} from 'dotenv';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';
import {Hono} from 'hono';
import {cors} from 'hono/cors';
import {serve} from '@hono/node-server';
import OpenAI from 'openai';
import {SYSTEM_PROMPT} from './prompt.js';
import type {ChatRequest, ChatMessage} from './types.js';
import {getOrCreateSession, appendAndWindow, shouldInjectPageContext, getSessionCount} from './sessions.js';
import {checkGuard} from './guard.js';
import {loadIndex, retrieveContext} from './rag.js';
import type {FeedbackRequest} from './types.js';
import {recordFeedback, getStats} from './feedback.js';

// Load .env from project root (parent of chat-proxy/)
const __dirname = dirname(fileURLToPath(import.meta.url));
config({path: resolve(__dirname, '../../.env')});

const app = new Hono();

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
const RATE_LIMIT_MAX = 20; // requests per window
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

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
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  entry.count++;
  return true;
}

// Periodic cleanup to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now >= entry.resetAt) rateLimitMap.delete(ip);
  }
}, RATE_LIMIT_WINDOW_MS);

// ---------------------------------------------------------------------------
// OpenAI-compatible client (works with OpenRouter, Together, etc.)
// ---------------------------------------------------------------------------

const client = new OpenAI({
  baseURL: AI_BASE_URL,
  apiKey: AI_API_KEY,
});

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

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get('/health', c => c.json({ok: true, sessions: getSessionCount()}));

// ---------------------------------------------------------------------------
// POST /chat — streaming SSE
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

  // Session management
  const {session, isNew} = getOrCreateSession(body.sessionId);
  const windowedMessages = appendAndWindow(session, body.messages);

  // Relevance guard — check the latest user message
  const lastUserMessage = [...body.messages].reverse().find(m => m.role === 'user');
  if (lastUserMessage) {
    const guardResult = checkGuard(lastUserMessage.content);
    if (!guardResult.allowed) {
      console.log(`[Guard] Blocked (${guardResult.reason}): ${lastUserMessage.content.slice(0, 80)}`);
      // Return deflection as SSE stream (no LLM call)
      return c.newResponse(
        new ReadableStream({
          start(controller) {
            const encoder = new TextEncoder();
            const send = (event: string, data: string) => {
              controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
            };
            // Emit session event
            send('session', JSON.stringify({sessionId: session.id}));
            // Emit deflection as a single delta
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

  // RAG — retrieve relevant docs based on latest user message
  const ragQuery = lastUserMessage?.content || '';
  const ragResult = await retrieveContext(ragQuery);

  // Build system prompt
  let systemPrompt = SYSTEM_PROMPT;

  // Inject RAG context first (lower priority — background knowledge)
  if (ragResult.context) {
    systemPrompt += `\n\n${ragResult.context}`;
  }

  // Inject page context last (highest priority — what the user is looking at)
  if (body.pageContext && shouldInjectPageContext(session, body.pageUrl)) {
    systemPrompt += `\n\n## Current Page Content (HIGHEST PRIORITY)\nThe user is currently viewing the page below. When their question relates to this page, answer from this content FIRST before using other sources.\n\n${body.pageContext.slice(0, 8000)}`;
  }

  // Stream response via SSE
  return c.newResponse(
    new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (event: string, data: string) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
        };

        // Emit session ID
        send('session', JSON.stringify({sessionId: session.id}));

        try {
          const stream = await client.chat.completions.create({
            model: AI_MODEL,
            max_tokens: 4096,
            stream: true,
            messages: [
              {role: 'system', content: systemPrompt},
              ...windowedMessages.map(m => ({
                role: m.role as 'user' | 'assistant',
                content: m.content,
              })),
            ],
          });

          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              send('delta', JSON.stringify({text}));
            }
          }

          // Emit sources before done (if RAG found any)
          if (ragResult.sources.length > 0) {
            send('sources', JSON.stringify({sources: ragResult.sources}));
          }

          send('done', JSON.stringify({stop_reason: 'end_turn'}));
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Internal server error';
          send('error', JSON.stringify({error: message}));
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
  return c.json({ok: true});
});

// ---------------------------------------------------------------------------
// GET /feedback/stats — view feedback statistics
// ---------------------------------------------------------------------------

app.get('/feedback/stats', c => c.json(getStats()));

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

// Load RAG index at startup (non-blocking)
loadIndex().catch(err => console.warn('[RAG] Failed to load index:', err));

console.log(`Chat proxy listening on :${PORT}`);
serve({fetch: app.fetch, port: PORT});
