# Chat-Proxy Metrics Tab — Design Spec

## Context

The chat-proxy admin dashboard currently has three tabs: Dashboard, Users & Sessions, and Costs & Settings. A `/metrics` endpoint already exists and returns Prometheus text format for pipeline metrics (requests, tokens, cache, tool calls, step durations), but these metrics are not visualized anywhere in the dashboard UI.

## Goal

Add a **Pipeline Metrics** tab to the admin dashboard that visualizes the existing Prometheus pipeline metrics as metric cards and charts, following the existing dashboard design language.

## Architecture

### Backend

1. **Extend `chat-proxy/src/metrics.ts`** with a new `getMetricsData()` function that returns the in-memory counters, gauges, and histograms as structured JSON (not just Prometheus text).
2. **Add `GET /admin/api/metrics`** in `chat-proxy/src/admin.ts` that calls `getMetricsData()` and returns JSON. This follows the existing admin API pattern and requires no database queries.

### Frontend

1. **Add a 4th sidebar nav item** in `chat-proxy/src/admin-dashboard.html` labeled "Pipeline Metrics" with `data-page="metrics"`.
2. **Add a new `<main>` page section** `#pageMetrics` styled like the existing Dashboard page.
3. **Content layout:**
   - **Metric strip** (auto-refreshing cards at the top):
     - Total Requests
     - Total Tokens
     - Cache Hit Rate
     - Total Tool Calls
     - Active Sessions
     - Router Accuracy
   - **Charts** (using Chart.js, reusing existing chart utilities):
     - Requests by Agent (horizontal bar)
     - Token Usage by Model (stacked bar: input vs output)
     - Cache Hits vs Misses (donut)
     - Tool Calls by Name (bar)
   - **Histogram section**:
     - Step Duration distribution (bar chart of bucket counts for `chat_proxy_step_duration_ms`)
4. **Auto-refresh**: Poll `/admin/api/metrics` every 30 seconds, consistent with the existing Dashboard live badge.

## Data Flow

```
Browser (admin-dashboard.html)
  └── polls GET /admin/api/metrics every 30s
        └── admin.ts
              └── getMetricsData() from metrics.ts
                    └── reads in-memory counters, gauges, histograms
                          └── returns JSON
        └── renders cards + charts via existing Chart.js setup
```

## API Contract

`GET /admin/api/metrics` → `200 OK`

```json
{
  "counters": [
    {
      "name": "chat_proxy_requests_total",
      "help": "Total number of chat requests",
      "values": [
        { "labels": { "agent": "general", "model": "claude-sonnet-4-6", "status": "success" }, "value": 42 }
      ]
    }
  ],
  "gauges": [
    {
      "name": "chat_proxy_active_sessions",
      "help": "Number of active sessions",
      "values": [
        { "labels": {}, "value": 3 }
      ]
    }
  ],
  "histograms": [
    {
      "name": "chat_proxy_step_duration_ms",
      "help": "Duration of each pipeline step in milliseconds",
      "values": [
        {
          "labels": { "step": "llm" },
          "buckets": [50, 100, 200, 500, 1000, 2000, 5000, 10000, 30000],
          "counts": [5, 12, 30, 45, 38, 20, 8, 2, 0],
          "totalCount": 160
        }
      ]
    }
  ]
}
```

## Files to Modify

| File | Change |
|------|--------|
| `chat-proxy/src/metrics.ts` | Add `getMetricsData()` export |
| `chat-proxy/src/admin.ts` | Add `GET /admin/api/metrics` route |
| `chat-proxy/src/admin-dashboard.html` | Add nav item, new page section, JS for fetching/rendering |

## Error Handling

- If the metrics endpoint returns an error, the dashboard shows a small inline error state on the metric strip (consistent with how other pages handle fetch failures) and retries on the next 30-second poll.
- The page gracefully handles empty metrics (all zeros / no data yet) by showing "—" or empty charts.

## Testing Plan

1. Start the chat-proxy server.
2. Open `/admin/dashboard` and navigate to the new "Pipeline Metrics" tab.
3. Verify cards populate with values from the in-memory registry.
4. Verify charts render breakdowns by label.
5. Verify the histogram section shows bucket counts.
6. Verify auto-refresh updates values every 30 seconds.
7. Send a chat request and confirm the request counter increments on the next poll.
