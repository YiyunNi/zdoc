# zdoc-chat-proxy

Agent-based AI chat backend for Zilliz Cloud documentation. Routes questions to specialized agents, retrieves context via RAG (vector or keyword fallback), streams responses over SSE, and logs analytics to Zilliz Cloud.

## Architecture

```
POST /chat
  │
  ├─ Rate limit (20 req/min per IP)
  ├─ Guard (injection detection + greeting redirect)
  │
  ├─ [parallel] Route intent ──► Agent selection (sticky per session)
  ├─ [parallel] RAG retrieval ──► Zilliz vector search or keyword fallback
  │
  ├─ Response cache check (2min TTL, session-scoped) ──► replay on hit
  │
  ├─ Build system prompt (agent + RAG context + page context + prompt hooks)
  ├─ Stream LLM response via SSE (tool calls up to 5 steps)
  │
  ├─ Compute confidence (5-signal weighted composite score)
  ├─ Deterministic source grounding (match response text ↔ RAG chunks)
  ├─ Deflection detection (suppress sources on off-topic responses)
  ├─ Emit: session(requestId) → agent → deltas → confidence → sources → grounding → hook-appends → done
  │
  ├─ Cache successful response for replay
  └─ Fire-and-forget: log conversation + update user profile
```

### Agents

| Agent | Expertise | Tools |
|-------|-----------|-------|
| **General** | Broad docs, navigation, concepts | searchDocs, getPageContent, getCodeExample |
| **Schema** | Collection design, fields, indexes | searchDocs, validateSchema, suggestIndex, generateSchemaCode |
| **Resources** | CU sizing, cost, deployment | searchDocs, estimateResources, compareProducts |
| **Product** | Serverless vs Dedicated vs BYOC | searchDocs, compareProducts, checkFeatureAvailability |
| **Code** | SDK examples (Python, Node, Java, Go, REST) | searchDocs, getCodeExample, generateSchemaCode, getPageContent |

An intent router classifies each message and selects an agent. Routing is **sticky per session** — the agent only changes when the topic clearly shifts.

### Tools

| Tool | Purpose |
|------|---------|
| `searchDocs` | Semantic or keyword doc search (top-K with scores) |
| `getPageContent` | Fetch full markdown page from docs site |
| `getCodeExample` | Extract code blocks for a topic + language |
| `validateSchema` | Validate collection schema (fields, indexes, types) |
| `suggestIndex` | Recommend index type based on workload |
| `generateSchemaCode` | Generate collection creation code in target SDK |
| `estimateResources` | Estimate CUs, storage, and deployment tier |
| `compareProducts` | Compare Serverless / Dedicated / BYOC tiers |
| `checkFeatureAvailability` | Check feature support across tiers (30+ features) |

### Dual-Mode RAG

1. **Vector search** (primary) — Zilliz Cloud REST API with embedding similarity (COSINE). 5-minute LRU cache. Supports section filtering to exclude cross-product docs (Cloud vs BYOC).
2. **Keyword fallback** — Parses `llms.txt` from the docs site, scores by token overlap. Activates automatically if Zilliz is unavailable. Section filter applied post-query.

### Source Grounding

Deterministic source attribution replaces LLM-dependent citation numbering. After the LLM streams its response:

1. **Text matching** — Each paragraph is compared against RAG chunks using bigram overlap scoring
2. **Source mapping** — Paragraphs with sufficient overlap (≥15%) are linked to their matching source documents
3. **Citation emission** — A `grounding` SSE event provides `{paragraphIndex, sourceIndices[]}` tuples for the frontend to render inline citation superscripts
4. **Deflection suppression** — Regex patterns detect off-topic deflections and suppress sources entirely

### Response Cache (Two Layers)

**L1 — Session-scoped exact match** skips routing + RAG + LLM for identical repeated queries within the same session:

- **Key**: `${sessionId}:${query}:${sectionFilter}` — prevents cross-session and cross-section leakage
- **TTL**: 2 minutes, max 200 entries with FIFO eviction
- **Cached**: All SSE events (agent, deltas, confidence, sources, grounding, done) — replayed in order on hit
- **Not cached**: Error responses, guard deflections

**L2 — Semantic answer cache** (cross-session, disabled unless `SEMANTIC_CACHE_ENABLED=true`) searches the `chat_conversations` collection for a previously answered similar question when L1 misses:

- **Vector search**: Embeds the query and runs a COSINE similarity search against past conversation embeddings
- **Quality gates**: similarity ≥ 0.92, confidence = `high` only, age ≤ 7 days, no negative feedback (`down > 0` → reject), section-aware (Cloud answer won't serve BYOC page)
- **On hit**: Replays stored answer as a single delta event with `stop_reason: 'semantic_cache'`, backfills L1 cache
- **Non-fatal**: Any error silently falls through to the normal routing + LLM flow
- **Cost**: ~0.001¢ per check (1 embedding + 1 vector search) vs ~1-5¢ per avoided LLM call

```
request → L1 exact cache → [miss] → L2 semantic cache → [miss] → route + RAG + LLM
```

### Prompt Hooks

Declarative YAML rules in [`prompt-hooks.yaml`](./prompt-hooks.yaml) inject or append content without code changes:

- **inject** — Appended to system prompt before LLM call (influences response content)
- **append** — Emitted as `hook-append` SSE event after streaming (e.g. CTAs, links)

Rules match on keywords (whole-word, case-insensitive), regex patterns, agent type, and confidence level. All matching rules stack, ordered by priority, capped at 5 inject rules.

```yaml
rules:
  - name: sales-lead-cta
    enabled: true
    priority: 10
    when:
      keywords: [pricing, enterprise, sales]
      agents: [product, resources]
      confidence: [low, medium]          # only checked for append
    then:
      inject: |
        Include this link when discussing pricing: [Contact Sales](https://zilliz.com/contact-sales)
      append: |
        ---
        **Want to discuss pricing?** [Talk to our sales team →](https://zilliz.com/contact-sales)
```

Rules load once at startup. Changes require a server restart.

## API

### `POST /chat`

Streaming SSE endpoint. Clients may send `X-Request-ID`; if it is absent or invalid, the proxy generates one. The same request ID is returned in the response `X-Request-ID` header and included in the first `session` SSE event so browser and server logs can be correlated.

Accepts JSON body:

```json
{
  "messages": [{"role": "user", "content": "How do I create a collection?"}],
  "pageContext": "optional page text",
  "pageUrl": "/docs/create-collection",
  "sessionId": "optional-uuid",
  "userId": "optional-uuid"
}
```

SSE event types:

| Event | Payload | Description |
|-------|---------|-------------|
| `session` | `{sessionId, requestId}` | Emitted immediately on connection |
| `agent` | `{type, name}` | Selected agent |
| `delta` | `{text}` | Streaming text chunks |
| `confidence` | `{level, retrieval_score}` | `high`, `medium`, or `low` |
| `sources` | `{sources: [{title, url, score?}]}` | Grounded doc references |
| `grounding` | `{citations: [{paragraphIndex, sourceIndices}]}` | Per-paragraph citation map |
| `hook-append` | `{text}` | Post-response content from prompt hooks |
| `done` | `{stop_reason}` | `end_turn`, `guard`, or `semantic_cache` |
| `error` | `{error}` | Error message |

### `POST /feedback`

Record thumbs up/down on a response.

```json
{
  "sessionId": "uuid",
  "messageIndex": 2,
  "rating": "up",
  "pageUrl": "/docs/overview",
  "userId": "optional-uuid"
}
```

### `GET /feedback/stats`

Returns aggregate feedback: `{totalUp, totalDown, total, positiveRate, recentFeedback[]}`.

### `GET /health`

Returns `{ok, sessions, vectorSearch}`.

### `GET /admin/*`

Protected by `Authorization: Bearer <ADMIN_API_KEY>`.

| Route | Description |
|-------|-------------|
| `/admin/conversations` | Query conversations (filter by date, agent, user) |
| `/admin/conversations/search?q=...` | Semantic search across conversations |
| `/admin/users` | List user profiles |
| `/admin/stats` | Dashboard aggregates (counts across all collections) |
| `POST /admin/sources` | Register external source `{url, source_type, label}` |
| `GET /admin/sources` | List all external sources |
| `GET /admin/sources/:id` | Get single source details |
| `POST /admin/sources/:id/index` | Trigger indexing (synchronous) |
| `DELETE /admin/sources/:id` | Remove source and its chunks |

**Source types:** `external-web` (single URL), `external-github` (repo — fetches README, docs/\*, examples/\*).
GitHub URLs: `github:owner/repo` or `https://github.com/owner/repo` (max 50 files per repo).

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_API_KEY` | — | **Required.** LLM API key |
| `AI_BASE_URL` | `https://api.openai.com/v1` | LLM endpoint |
| `AI_MODEL` | `gpt-4o` | Model name |
| `DATABASE_URL` | — | PostgreSQL/pgvector connection string for conversations, profiles, feedback, and vector-backed admin features |
| `ADMIN_SESSION_SECRET` | — | **Required.** Secret used to derive admin/session encryption keys; startup aborts if missing |
| `ADMIN_API_KEY` | — | Protects admin routes when bearer-token auth is used |
| `DOCS_SITE_URL` | `https://docs.zilliz.com` | Docs site for keyword fallback |
| `GITHUB_TOKEN` | — | Optional GitHub token for higher API rate limits (external source indexing) |
| `PORT` | `8787` | Server port |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS origins (comma-separated) |
| `DEBUG_CHAT_FLOW` | `false` | Enables safe per-request server debug flow logs when set to `true` |
| `DEBUG_CHAT_FLOW_VERBOSE` | `false` | Reserved Docker passthrough for verbose chat-flow diagnostics |
| `DEBUG_STREAM` | `false` | Logs summarized unhandled provider stream parts when set to `true` |
| `CHAT_DEBUG` | `false` | Docusaurus build-time flag that enables browser console `[chat-debug]` logs by default |
| `SEMANTIC_CACHE_ENABLED` | `false` | Enables the cross-session semantic answer cache when set to `true` |

## Debugging Chat Data Flow

Use request IDs to follow one chat turn from browser request construction through `/chat`, routing, retrieval, model/tool streaming, SSE parsing, and UI rendering.

### Correlation contract

- Browser clients send `X-Request-ID` on `POST /chat`.
- The proxy validates that header or generates a request ID if it is absent or invalid.
- Every `/chat` response includes `X-Request-ID`.
- The first SSE event is `session` with `{sessionId, requestId}`.
- Safe server debug events and browser console debug events include the same `requestId`.

### Safe logging policy

Debug logs intentionally omit raw user prompts, assistant responses, page context, tool result content, provider stream objects, authorization headers, cookies, API keys, and secrets. Text-like values are logged as summaries such as character/byte counts and hashes; browser logs use safe summaries and redacted IDs. Server debug flow logs are stdout-only and are not persisted to the event store or PostgreSQL.

### Local debug workflow

1. Start PostgreSQL/pgvector and set `DATABASE_URL` to that database. For the Compose database exposed on the host, use `postgresql://zdoc:zdoc@localhost:5432/zdoc_chat`.
2. Set required secrets and model configuration, including `ADMIN_SESSION_SECRET` and `AI_API_KEY`.
3. Start the proxy with safe flow logs enabled:

   ```bash
   DEBUG_CHAT_FLOW=true npm --prefix chat-proxy run dev
   ```

4. Start Docusaurus with chat pointed at the local proxy and browser debug logs enabled:

   ```bash
   CHAT_ENDPOINT=http://localhost:8787/chat CHAT_DEBUG=true npm run start
   ```

5. Open `/docs/home?chatDebug=1`, ask one question, copy the `requestId` from the browser console, then search the proxy logs for the same ID.

Expected first SSE event:

```text
event: session
data: {"sessionId":"...","requestId":"..."}
```

Manual API smoke test:

```bash
curl -N \
  -H "Content-Type: application/json" \
  -H "X-Request-ID: manual-debug-1" \
  --data '{"messages":[{"role":"user","content":"How do I create a collection?"}],"userId":"debug-user","pageUrl":"/docs/home"}' \
  http://localhost:8787/chat
```

### Docker debug workflow

Run the stack through Docker Compose and use nginx at `http://localhost:3000/api/chat`:

```bash
DEBUG_CHAT_FLOW=true docker compose up --build
```

The compose file passes `DEBUG_CHAT_FLOW` and `DEBUG_CHAT_FLOW_VERBOSE` into the proxy container. With the site running at `localhost:3000`, open `/docs/home?chatDebug=1` and correlate browser and proxy logs by `requestId`.

## Project Structure

```
chat-proxy/
├── prompt-hooks.yaml              # Declarative prompt hook rules
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── server.ts                  # Entry point — startup + init
    ├── index.ts                   # Hono app, routes, streaming logic
    ├── types.ts                   # Shared types (ChatMessage, AgentType, etc.)
    ├── guard.ts                   # Injection detection + greeting redirect
    ├── sessions.ts                # In-memory session management (30min TTL)
    ├── router.ts                  # Intent classification → agent routing
    ├── zilliz-client.ts            # Shared Zilliz REST API client
    ├── rag.ts                     # Dual-mode retrieval (vector + keyword)
    ├── sources.ts                 # External source registry + indexing pipeline
    ├── confidence.ts              # Multi-signal confidence scoring (5 weighted signals)
    ├── grounding.ts               # Deterministic source grounding (bigram overlap)
    ├── semantic-cache.ts          # L2 cross-session semantic answer cache
    ├── logger.ts                  # Batched event logging to Zilliz Cloud
    ├── feedback.ts                # Thumbs up/down collection
    ├── admin.ts                   # Admin API routes (+ source management)
    ├── prompt.ts                  # Legacy system prompt (reference)
    ├── agents/
    │   ├── types.ts               # AgentConfig interface
    │   ├── index.ts               # Agent registry + getAgent()
    │   ├── general.ts             # General documentation agent
    │   ├── schema.ts              # Schema design agent
    │   ├── resources.ts           # Resource estimation agent
    │   ├── product.ts             # Product comparison agent
    │   └── code.ts                # Code generation agent
    ├── tools/
    │   ├── index.ts               # Tool registry + getToolsForAgent()
    │   ├── searchDocs.ts
    │   ├── getPageContent.ts
    │   ├── getCodeExample.ts
    │   ├── validateSchema.ts
    │   ├── suggestIndex.ts
    │   ├── generateSchemaCode.ts
    │   ├── estimateResources.ts
    │   ├── compareProducts.ts
    │   └── checkFeatureAvailability.ts
    ├── hooks/
    │   ├── types.ts               # Rule, RuleCondition, HookContext
    │   ├── matcher.ts             # Keyword + regex + condition matching
    │   └── index.ts               # loadRules, evaluatePrePrompt, evaluatePostResponse
    └── test/
        └── setup.ts               # Vitest setup (env defaults, fake timers)
```

## Development

```bash
# Start dev server with hot reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build
npm start
```

## Key Design Decisions

- **Sliding message window** — Keeps last 8 exchanges (16 messages) in LLM context to control token usage.
- **Sticky agent routing** — Avoids agent switching mid-conversation unless the topic clearly changes.
- **Multi-signal confidence scoring** — Combines 5 weighted signals into a 0–1 composite score mapped to `high`/`medium`/`low`. Signals: retrieval quality (0.35, calibrated for bge-large-en-v1.5), source agreement (0.20, topic clustering vs scatter), tool success (0.15), response substance (0.15, code/links/hedging), and page context alignment (0.15). Hard overrides force `low` on uncertainty phrases and cap at `medium` when zero sources are found. See `src/confidence.ts`.
- **Fire-and-forget logging** — Analytics writes never block the response stream.
- **Graceful degradation** — Vector search falls back to keyword; missing Zilliz disables logging silently; missing YAML disables hooks.
- **Deterministic grounding** — Source attribution uses text overlap scoring instead of relying on the LLM to emit citation markers, making citations consistent and independent of model behavior.
- **Two-layer caching** — L1 (in-memory, session-scoped, exact match, 2min TTL) handles immediate repeats. L2 (semantic vector search against `chat_conversations`) serves cross-session cache hits for paraphrased common questions, with 5 quality gates to prevent stale or bad answers from being replayed.
