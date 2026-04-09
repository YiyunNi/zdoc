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
  ├─ Emit: session → agent → deltas → confidence → sources → grounding → hook-appends → done
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

**L2 — Semantic answer cache** (cross-session) searches the `chat_conversations` collection for a previously answered similar question when L1 misses:

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

Streaming SSE endpoint. Accepts JSON body:

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
| `session` | `{sessionId}` | Emitted immediately on connection |
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
| `SQLITE_PATH` | `./data/chat-proxy.db` | Path to the SQLite database file |
| `DOCS_SITE_URL` | `https://docs.zilliz.com` | Docs site for keyword fallback |
| `ADMIN_API_KEY` | — | Protects admin routes (disabled if unset) |
| `GITHUB_TOKEN` | — | Optional GitHub token for higher API rate limits (external source indexing) |
| `PORT` | `8787` | Server port |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS origins (comma-separated) |

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
