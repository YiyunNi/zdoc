# zdoc-chat-proxy

Agent-based AI chat backend for Zilliz Cloud documentation. Routes questions to specialized agents, retrieves context via RAG (vector or keyword fallback), streams responses over SSE, and logs analytics to Zilliz Cloud.

## Architecture

```
POST /chat
  │
  ├─ Rate limit (20 req/min per IP)
  ├─ Guard (injection detection + greeting redirect)
  │
  ├─ Session exact answer cache (10min TTL) ──► replay on hit
  ├─ Cross-session exact answer cache (safe public docs answers, 30min TTL) ──► replay on hit
  ├─ In-flight answer coalescing ──► wait/replay identical concurrent public queries
  │
  ├─ [parallel] Route intent ──► Agent selection (sticky per session, cached)
  ├─ [parallel] RAG retrieval ──► PostgreSQL FTS/vector search (cached) or fallback
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

1. **Hybrid search** (primary) — PostgreSQL full-text search plus optional pgvector similarity, fused with RRF. Results are cached in-process with the doc index version in the cache key.
2. **Keyword/FTS fallback** — If query embeddings or vector rows are unavailable, retrieval degrades to PostgreSQL full-text search with the same section filtering.

### Source Grounding

Deterministic source attribution replaces LLM-dependent citation numbering. After the LLM streams its response:

1. **Text matching** — Each paragraph is compared against RAG chunks using bigram overlap scoring
2. **Source mapping** — Paragraphs with sufficient overlap (≥15%) are linked to their matching source documents
3. **Citation emission** — A `grounding` SSE event provides `{paragraphIndex, sourceIndices[]}` tuples for the frontend to render inline citation superscripts
4. **Deflection suppression** — Regex patterns detect off-topic deflections and suppress sources entirely

### Response Cache (Node-first)

The service uses in-process caches first, avoiding external dependencies on the hot path:

- **Session exact cache** — normalized exact-match replay within one session. Defaults: 10 minutes, max 1000 entries.
- **Cross-session exact answer cache** — normalized exact-match replay across sessions for safe public documentation answers. Defaults: 30 minutes, max 2000 entries. It skips user-specific/private-looking queries, page-context requests, low-confidence answers, guard/error responses, and oversized SSE payloads.
- **In-flight coalescing** — identical concurrent public queries share the first request's result instead of generating multiple LLM answers.
- **Embedding cache** — short query embeddings are cached for 24 hours and reused by semantic cache and hybrid RAG.
- **RAG search cache** — `searchDocs` results are cached for 10 minutes with the current doc index version in the key.
- **Page content cache** — full fetched markdown pages are cached, then sliced per request `maxChars`; failed fetches use a short negative TTL.
- **DB semantic answer cache** — optional (`SEMANTIC_CACHE_ENABLED=true`) pgvector-backed semantic replay after the Node exact caches miss.

```
request → session exact → cross-session exact → in-flight → optional DB semantic → route + cached RAG + LLM
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
| `SEMANTIC_CACHE_ENABLED` | `false` | Enables the optional DB/pgvector semantic answer cache when set to `true` |
| `RESPONSE_CACHE_TTL_MS` | `600000` | TTL for session-scoped exact SSE replay cache |
| `RESPONSE_CACHE_MAX` | `1000` | Max session-scoped exact response cache entries per Node process |
| `ANSWER_EXACT_CACHE_ENABLED` | `true` | Enables cross-session exact answer replay for safe public docs answers |
| `ANSWER_EXACT_CACHE_TTL_MS` | `1800000` | TTL for cross-session exact answer cache |
| `ANSWER_EXACT_CACHE_MAX` | `2000` | Max cross-session exact answer cache entries per Node process |
| `ANSWER_INFLIGHT_ENABLED` | `true` | Coalesces identical concurrent public answer generations within one Node process |
| `ANSWER_INFLIGHT_WAIT_MS` | `30000` | Max time a duplicate request waits for an in-flight answer before falling through |
| `CACHE_REPLAY_STREAM_ENABLED` | `true` | Replays cached deltas with small delays to preserve streaming UX instead of dumping instantly |
| `CACHE_REPLAY_INITIAL_DELAY_MS` | `120` | Delay before the first cached delta when stream replay is enabled |
| `CACHE_REPLAY_DELTA_DELAY_MS` | `12` | Delay between cached delta events when stream replay is enabled |
| `CACHE_REPLAY_MAX_TOTAL_DELAY_MS` | `2500` | Maximum artificial delay budget for a cached replay |
| `RAG_CACHE_ENABLED` | `true` | Enables in-process cached `searchDocs` results |
| `RAG_CACHE_TTL_MS` | `600000` | TTL for cached RAG search results |
| `RAG_CACHE_MAX` | `5000` | Max cached RAG search result entries per Node process |
| `EMBEDDING_CACHE_ENABLED` | `true` | Enables in-process query embedding cache |
| `EMBEDDING_CACHE_TTL_MS` | `86400000` | TTL for query embedding cache |
| `EMBEDDING_CACHE_MAX` | `2000` | Max query embedding cache entries per Node process |
| `EMBEDDING_CACHE_MAX_TEXT_CHARS` | `1000` | Only texts up to this length are cached as query embeddings |
| `PAGE_CONTENT_CACHE_TTL_MS` | `1800000` | TTL for fetched docs markdown page content |
| `PAGE_CONTENT_NEGATIVE_CACHE_TTL_MS` | `60000` | TTL for failed page-content fetch cache entries |
| `PAGE_CONTENT_CACHE_MAX` | `500` | Max cached page-content entries per Node process |
| `ROUTE_CACHE_TTL_MS` | `1800000` | TTL for cross-session route cache |
| `ROUTE_CACHE_MAX` | `5000` | Max route cache entries per Node process |
| `FAST_PATH_ENABLED` | `true` | Streams most agents in one tool-enabled LLM pass instead of tool-collection plus final-synthesis; set `false` to restore the two-pass path |
| `FAST_PATH_MAX_TOOL_ROUNDS` | `2` | Maximum tool rounds before fast-path forces final text generation |
| `FAST_PATH_CODE_MAX_TOOL_ROUNDS` | `1` | Maximum tool rounds for code-agent fast path; defaults to one search before generating code |
| `FAST_PATH_MAX_OUTPUT_TOKENS` | `1200` | Output token cap for fast-path chat responses |
| `TOOLLESS_RAG_ENABLED` | `true` | Runs server-side RAG for selected agents and streams a single no-tool LLM response, avoiding model tool-call planning latency |
| `TOOLLESS_RAG_AGENTS` | `code,general` | Comma-separated agents that use server-side RAG before falling back to tool-enabled paths |
| `TOOLLESS_RAG_TOP_K` | `4` | Number of documentation chunks injected into the toolless RAG prompt |
| `TOOLLESS_RAG_CONTEXT_MAX_CHARS` | `4500` | Maximum retrieved-context characters sent to the toolless RAG model call |
| `TOOLLESS_RAG_MAX_OUTPUT_TOKENS` | `1100` | Output token cap for toolless RAG responses |
| `GROUNDING_LLM_ENABLED` | `true` | Allows LLM-based source attribution for larger candidate sets; small/simple answers use deterministic grounding |
| `GROUNDING_LLM_MIN_SOURCES` | `8` | Minimum candidate sources before LLM grounding is used |
| `QUERY_EMBEDDING_ENABLED` | `true` | Computes query embeddings opportunistically for hybrid RAG; set `false` for FTS-only retrieval unless semantic cache is enabled |
| `TOOL_EMBEDDING_BUDGET_MS` | `75` | Maximum wait for an in-flight query embedding inside search tools before falling back to FTS-only |
| `EMBEDDING_BUDGET_MS` | `1500` | Maximum wait for query embedding when semantic cache is enabled |
| `SEMANTIC_CACHE_LOOKUP_BUDGET_MS` | `250` | Maximum wait for semantic cache lookup after embedding |
| `BEDROCK_GUARD_ENABLED` | `true` | Enables Bedrock concurrency limiting and throttle retry guards |
| `BEDROCK_CHAT_MAX_CONCURRENCY` | `3` | Maximum concurrent Bedrock chat/model invocations per process |
| `BEDROCK_EMBEDDING_MAX_CONCURRENCY` | `2` | Maximum concurrent Bedrock embedding invocations per process |
| `BEDROCK_QUEUE_TIMEOUT_MS` | `15000` | Maximum time a Bedrock call waits for a limiter slot before failing fast |
| `BEDROCK_RETRY_MAX_ATTEMPTS` | `3` | Maximum Bedrock attempts for throttle/429 retry guard |
| `BEDROCK_RETRY_BASE_DELAY_MS` | `500` | Initial exponential-backoff delay for Bedrock throttle retries |
| `BEDROCK_RETRY_MAX_DELAY_MS` | `4000` | Maximum exponential-backoff delay for Bedrock throttle retries |

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
    ├── cache.ts                   # In-process LRU/TTL cache helpers
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
- **Node-first caching** — In-process LRU/TTL caches cover session exact replay, cross-session exact public-docs answers, in-flight duplicate coalescing, query embeddings, RAG search results, and fetched page content. The optional DB semantic cache remains available for paraphrased common questions when enabled.
