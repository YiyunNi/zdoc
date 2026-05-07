# Chat Proxy External Integration Guide

This guide is for teams that want to embed the Zilliz documentation chat widget on their own domain or build a custom UI that calls the shared chat-proxy backend.

## Endpoint

```
POST https://<chat-proxy-host>/api/chat
```

## Minimal Request

```javascript
fetch('https://<chat-proxy-host>/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Traffic-Source': 'your-domain-id',
  },
  body: JSON.stringify({
    messages: [{role: 'user', content: 'How do I create a collection?'}],
    userId: 'stable-user-id',
  }),
});
```

## Required Fields

| Field | Location | Description |
|-------|----------|-------------|
| `messages` | Body | Array of `{role: 'user' \| 'assistant', content: string}` |
| `userId` | Body | Stable identifier for the end user. **If omitted, it defaults to `anonymous` and the session will not appear on the Users & Sessions dashboard page.** |
| `X-Traffic-Source` | Header | Domain/product identifier. Must match `/^[a-z0-9-]{1,32}$/i`. Examples: `docs`, `console`, `partner-acme`. Defaults to `docs` if omitted. |

## Optional Fields

| Field | Description |
|-------|-------------|
| `sessionId` | Reuse the same `sessionId` for follow-up messages in the same conversation. If omitted, the server creates one and returns it in the SSE `session` event. |
| `pageUrl` | URL of the page where the chat is embedded. Helps with context and analytics. |
| `pageContext` | Additional page context (e.g., section heading, product name) to improve answer relevance. |
| `screenResolution` | Screen size as `"WxH"`, e.g. `"1920x1080"`. |

## Server-Extracted Metadata

The following are derived automatically from the HTTP request. **You do not need to send them explicitly**, but you should ensure the browser sends standard headers (which it does by default):

| Data | Source |
|------|--------|
| **Geo-location** (country, city) | Client IP address |
| **Device / Browser** | `User-Agent` header |
| **Language** | `Accept-Language` header |
| **Referrer** | `Referer` header |

> **Note for server-to-server proxies:** If you call the API from your backend instead of the user's browser, forward the end-user's `X-Forwarded-For`, `User-Agent`, and `Accept-Language` headers so geo and device tracking remain accurate.

## Response Format

The endpoint returns a Server-Sent Events (SSE) stream. Key events:

```
event: session
data: {"sessionId": "uuid-v4"}

event: delta
data: {"text": "To create a collection..."}

event: done
data: {"stop_reason": "complete"}
```

- `session` — emitted first. Contains the `sessionId` to reuse for follow-up messages.
- `delta` — streamed answer fragments.
- `done` — signals completion. `stop_reason` can be `complete`, `guard`, or `error`.

## Feedback Endpoint

After receiving an answer, you can send thumbs-up/down feedback:

```javascript
fetch('https://<chat-proxy-host>/feedback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Traffic-Source': 'your-domain-id',
  },
  body: JSON.stringify({
    sessionId: 'uuid-from-session-event',
    messageIndex: 0,          // index of the assistant message being rated
    rating: 'up',             // or 'down'
    userId: 'stable-user-id',
    pageUrl: 'https://your-site.com/page',
  }),
});
```

## CORS

Your domain must be added to the chat-proxy `ALLOWED_ORIGINS` environment variable (comma-separated list). Contact the chat-proxy admin team to have your origin allowlisted.

## Session Persistence Rules

- Reuse `sessionId` for messages in the same conversation.
- The server keeps sessions in memory for **30 minutes** of inactivity.
- A session's **source is locked to the first `X-Traffic-Source` it receives**. Later messages with a different source will not change the session's attribution.
- A session without a `userId` is labeled `anonymous`. Anonymous sessions are tracked in the database but are **excluded from the Users & Sessions dashboard page**.

## Example: Complete Browser Integration

```javascript
const CHAT_ENDPOINT = 'https://chat-proxy.example.com/chat';
const FEEDBACK_ENDPOINT = 'https://chat-proxy.example.com/feedback';
const TRAFFIC_SOURCE = 'partner-site';

function getUserId() {
  let id = localStorage.getItem('chat_user_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('chat_user_id', id);
  }
  return id;
}

let currentSessionId = null;

async function sendMessage(text) {
  const res = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Traffic-Source': TRAFFIC_SOURCE,
    },
    body: JSON.stringify({
      messages: [{role: 'user', content: text}],
      sessionId: currentSessionId,
      userId: getUserId(),
      pageUrl: window.location.href,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    }),
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, {stream: true});

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        if (data.sessionId) currentSessionId = data.sessionId;
        if (data.text) renderChunk(data.text);
      }
    }
  }
}
```

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| CORS error | Origin not in `ALLOWED_ORIGINS` | Contact admin to add your domain |
| Sessions missing from Users & Sessions dashboard | `userId` not sent or defaults to `anonymous` | Always send a stable `userId` |
| Sessions attributed to `docs` instead of your domain | `X-Traffic-Source` header missing | Add the header to every request |
| Geo/device data missing | API called from backend without forwarding headers | Forward `X-Forwarded-For`, `User-Agent`, `Accept-Language` |
