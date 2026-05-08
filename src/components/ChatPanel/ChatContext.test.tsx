import React from 'react';
import {act, renderHook, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('@docusaurus/router', () => ({
  useLocation: () => ({pathname: '/docs/home'}),
}));

import {ChatProvider, useChatContext} from './ChatContext';

function sseResponse(events: Array<{event: string; data: unknown}>): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const evt of events) {
        controller.enqueue(encoder.encode(`event: ${evt.event}\ndata: ${JSON.stringify(evt.data)}\n\n`));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: {'Content-Type': 'text/event-stream', 'X-Request-ID': 'client-request-1'},
  });
}

function wrapper(debugDefault = false) {
  return function Wrapper({children}: {children: React.ReactNode}) {
    return <ChatProvider chatEndpoint="/api/chat" debugDefault={debugDefault}>{children}</ChatProvider>;
  };
}

describe('ChatProvider request debugging', () => {
  beforeEach(() => {
    localStorage.clear();
    let uuidCount = 0;
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => {
        uuidCount++;
        return uuidCount === 1 ? 'client-request-1' : 'client-user-1';
      }),
      getRandomValues: (arr: Uint8Array) => arr.fill(1),
    });
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(sseResponse([
      {event: 'session', data: {sessionId: 'server-session-1', requestId: 'client-request-1'}},
      {event: 'notice', data: 'short secret notice'},
      {event: 'metadata', data: {detail: 'nested secret payload'}},
      {event: 'delta', data: {text: 'assistant secret answer'}},
      {event: 'done', data: {stop_reason: 'end_turn'}},
    ]))));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('sends a request ID header with chat requests', async () => {
    const {result} = renderHook(() => useChatContext(), {wrapper: wrapper(false)});

    await act(async () => {
      await result.current.send('secret user prompt');
    });

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect((init as RequestInit).headers).toMatchObject({'Content-Type': 'application/json', 'X-Request-ID': 'client-request-1'});
    expect(JSON.parse((init as RequestInit).body as string)).toMatchObject({
      messages: [{role: 'user', content: 'secret user prompt'}],
      pageUrl: '/docs/home',
    });
  });

  it('emits console-only safe debug events when enabled', async () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const {result} = renderHook(() => useChatContext(), {wrapper: wrapper(true)});

    await act(async () => {
      await result.current.send('secret user prompt');
    });

    await waitFor(() => expect(debugSpy).toHaveBeenCalled());
    const logs = debugSpy.mock.calls.map(call => JSON.stringify(call)).join('\n');
    expect(logs).toContain('chat.client.send.started');
    expect(logs).toContain('chat.client.fetch.response');
    expect(logs).toContain('chat.client.sse.event');
    expect(logs).toContain('chat.client.completed');
    expect(logs).toContain('client-request-1');
    expect(logs).not.toContain('secret user prompt');
    expect(logs).not.toContain('assistant secret answer');
    expect(logs).not.toContain('client-user-1');
    expect(logs).not.toContain('server-session-1');
    expect(logs).not.toContain('short secret notice');
    expect(logs).not.toContain('nested secret payload');
  });
});
