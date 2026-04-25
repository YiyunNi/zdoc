# Chat-Proxy Dashboard Redesign

## Problem

The admin dashboard has three issues:
1. Sessions page shows a flat list with no user-level aggregation or topic summaries
2. "Conversations per day" and "Chat messages per day" charts show identical numbers
3. Costs and Settings tabs are non-functional placeholders that fall through to the Dashboard page
4. The API key entry UX is awkward — no proper login cover page

## Architecture

Single HTML file (`admin-dashboard.html`) served by the chat-proxy Hono app. No build step, no framework. Chart.js for charts. All API calls to `/admin/api/*` endpoints.

---

## Section 1: Dashboard Tab — Metrics Fix

### Problem
Conversations/day and Messages/day count the same `obs_events` rows, producing identical numbers.

### Solution
- **Conversations/day** → count distinct `session_id` per day from `obs_sessions`. Represents how many chat sessions started each day.
- **Messages/day** → count rows where `event_type = 'message'` in `obs_events`. Represents total chat turns (a multi-round conversation has multiple messages).

### Backend change
Update `/admin/api/analytics/trends`:
- Conversation count: `SELECT DATE(created_at), COUNT(DISTINCT id) FROM obs_sessions GROUP BY DATE(created_at)`
- Message count: `SELECT DATE(timestamp), COUNT(*) FROM obs_events WHERE event_type = 'message' GROUP BY DATE(timestamp)`

### KPI strip
Same labels (Conversations, Messages, Distinct Users, Avg Confidence) but Conversations now differs from Messages.

---

## Section 2: Users & Sessions Tab

### Problem
Sessions page shows flat individual sessions with no user grouping or topic summary.

### Solution: Two-level view

**Level 1 — User List**
- Group sessions by `user_id` from `obs_sessions`
- Each user card shows:
  - User ID (truncated, e.g. `a3f2...8b1c`)
  - Session count
  - Date range (first session → last active)
  - Last active time (relative, e.g. "2 hours ago")
  - Topics: list of `first_question` values from their sessions (up to 5, truncated to ~80 chars)
  - Location (country/city from GeoIP)
  - Device (parsed User-Agent: browser + OS)
  - Language (from Accept-Language)
  - Screen resolution (from frontend)
  - Avg session duration (computed from `created_at` to `last_active_at`)
- Sort by most recent activity
- Paginated at the user level (not session level)
- Users with `user_id = 'anonymous'` grouped into a single "Anonymous" bucket at the bottom

**Level 2 — Session Detail** (expand a user)
- Show their sessions as a collapsible list (session cards: ID, agent badge, first question, message count, time ago)
- Clicking a session opens the existing detail panel (event timeline with messages, confidence, sources, tokens)

### User metadata capture

Add a `user_meta` JSONB column on `obs_sessions` storing:
```json
{
  "user_agent": "Mozilla/5.0 ...",
  "ip": "1.2.3.4",
  "country": "US",
  "city": "San Francisco",
  "referer": "https://www.google.com/",
  "language": "en-US,en;q=0.9",
  "screen_resolution": "1920x1080"
}
```

**Data sources:**
| Field | Source |
|---|---|
| user_agent | `req.header('user-agent')` |
| ip | `req.header('x-forwarded-for')` |
| country, city | `maxmind` GeoIP lookup on IP (GeoLite2 DB) |
| referer | `req.header('referer')` |
| language | `req.header('accept-language')` |
| screen_resolution | Frontend: `window.screen.width + 'x' + window.screen.height`, sent in chat request body |

**GeoIP dependency:** Add `maxmind` npm package and bundle the GeoLite2 City database (downloaded at build time or included in the Docker image).

### Backend changes
- New endpoint: `GET /admin/api/analytics/users` — queries `obs_sessions` grouped by `user_id`, returns user_id, session_count, first_active, last_active, avg_duration, user_meta, and array of {session_id, first_question, agent, message_count, created_at}. Supports pagination (page, pageSize).
- Add `user_meta` JSONB column to `obs_sessions` schema
- Extract headers + frontend screen data in the `/chat` handler, pass to `upsertObsSession`
- Add `maxmind` library for GeoIP lookups

### Frontend changes
- `ChatContext.tsx`: send `screenResolution: '${screen.width}x${screen.height}'` in the chat request body
- Dashboard: new `pageUsers` HTML section with user list, expand/collapse, session detail

---

## Section 3: Costs & Settings Tab

### Problem
Both Costs and Settings are non-functional placeholders.

### Solution: Single tab with two sections (accordion/toggle)

### Costs Section
- **Token usage by model** — horizontal bar chart showing total tokens per model
- **Token usage trend** — line chart showing daily token consumption over time (input vs output vs cached, stacked)
- **Breakdown table** — per model/agent: total requests, input tokens, output tokens, cached tokens, avg tokens per request
- **Time range toggle** — 1d / 7d / 30d (applies to all cost widgets)

### Settings Section

**Config readout (from `runtime_config` table + env var fallback):**

| Category | Settings displayed |
|---|---|
| Models | chat model, router model, grounding model, rewrite model, per-agent overrides |
| Cache | enabled, TTL, threshold, max entries, embedding model |
| Index | total chunks, last refresh time, refresh interval, source URL |

**Editable model configuration:**

Provider + model pairs stored in `runtime_config` table:
| config_key | provider | model |
|---|---|---|
| `chat` | `bedrock` | `us.anthropic.claude-sonnet-4-20250514` |
| `router` | `openai-compatible` | `gpt-4o-mini` |
| `grounding` | `openai-compatible` | `gemini-3.1-flash-lite` |
| `rewrite` | `openai-compatible` | `gemini-3.1-flash-lite` |
| `agent:general` | (inherits chat) | (null = inherit) |
| `agent:code` | `bedrock` | `us.anthropic.claude-sonnet-4-20250514` |
| `embedding` | `openai-compatible` | `text-embedding-3-small` |

Provider registry in the backend:
```
providers = {
  'openai-compatible': () => createOpenAI({ baseURL, apiKey }),
  'bedrock':           () => createAmazonBedrock({ region, ... }),
}
```

- Multiple providers can coexist (e.g., router uses OpenAI, chat uses Bedrock)
- Provider credentials set via env vars (not editable in dashboard — security boundary)
- Dashboard shows provider dropdown + model text input + test button per config row
- Env var fallback: if no `runtime_config` entry exists, use current env vars (zero-config migration)

**Actions:**
| Action | What it does |
|---|---|
| Refresh Index | Re-fetches `llms.txt`, rebuilds `doc_chunks`, triggers embedding backfill, clears `answer_cache` |
| Clear Cache | Deletes all rows from `answer_cache` |
| Invalidate cache entry | Deletes one row from `answer_cache` by ID |
| Resolve/Dismiss doc gap | Updates `doc_gaps.resolved` to 1 or 2 |

**Doc Gaps table:** Unresolved content gaps with resolve/dismiss buttons
**Content Quality table:** Quality issues with occurrence counts

### Backend changes
- New table: `runtime_config` (key TEXT PK, provider TEXT, model TEXT, updated_at TIMESTAMPTZ)
- New endpoints:
  - `GET /admin/api/config` — returns all runtime config (models, cache params, index stats)
  - `PUT /admin/api/config/:key` — updates provider/model for a config key
  - `GET /admin/api/analytics/token-trends` — daily token aggregates (input/output/cached) for selected time range
- Add `@ai-sdk/amazon-bedrock` package
- Refactor model resolution: replace module-level constants with async function `getRuntimeConfig(key)` that checks DB first, falls back to env var
- Provider registry: select provider based on config, create model instance at request time

---

## Section 4: Admin Login Cover Page

### Problem
The dashboard HTML loads without auth, and the API key input is awkward.

### Solution

**Cover page (shown first):**
- Centered card with product name/logo, API key input field, "Sign In" button
- On submit, validates key by calling `GET /admin/api/live` with `Authorization: Bearer <key>`
- If valid → store key in `sessionStorage`, render dashboard
- If invalid → inline error "Invalid API key"

**Session management:**
- Key stored in `sessionStorage` (survives refresh, cleared on tab close)
- All dashboard API calls include `Authorization: Bearer <key>` from `sessionStorage`
- If any API call returns 401 → redirect back to cover page with "Session expired" message

**Security note:** The API key is a single admin secret (not per-user auth). The cover page prevents casual browsing without the key. This is appropriate for an internal ops dashboard.

---

## Summary of Changes

### Database changes
- Add `user_meta` JSONB column to `obs_sessions`
- Add `runtime_config` table (key, provider, model, updated_at)

### New npm packages
- `maxmind` + GeoLite2 City DB (GeoIP)
- `@ai-sdk/amazon-bedrock` (Bedrock provider)

### New API endpoints
- `GET /admin/api/analytics/users` — user-aggregated session data
- `GET /admin/api/config` — runtime configuration readout
- `PUT /admin/api/config/:key` — update model/provider config
- `GET /admin/api/analytics/token-trends` — daily token aggregates

### Modified API endpoints
- `GET /admin/api/analytics/trends` — fix conversations vs messages counting
- `GET /admin/api/config` — return current models + cache config + index stats

### Frontend changes
- `admin-dashboard.html` — redesign all three tabs, add login cover page
- `ChatContext.tsx` — send screen resolution in request body

### Backend logic changes
- Model resolution: async `getRuntimeConfig(key)` with DB → env var fallback
- Provider registry: support `openai-compatible` and `bedrock` providers
- GeoIP lookup on `/chat` handler using maxmind
- User metadata extraction from headers + request body
