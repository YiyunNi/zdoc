import {afterEach, describe, it, expect, vi} from 'vitest';
import {logDebugFlow, logEvent, saveConversation, summarizeForDebugLog, summarizeTextForLog, updateUserProfile} from './logger.js';

describe('logger', () => {
  afterEach(() => {
    delete process.env.DEBUG_CHAT_FLOW;
    vi.restoreAllMocks();
  });

  it('does not emit chat flow debug logs unless enabled', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logDebugFlow('chat.request.received', {requestId: 'req-1'}, {message: 'hello'});

    expect(spy).not.toHaveBeenCalled();
  });

  it('drops unexpected sensitive context fields in chat flow debug logs', () => {
    process.env.DEBUG_CHAT_FLOW = 'true';
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logDebugFlow('chat.request.received', {requestId: 'req-1', source: 'docs', token: 'Bearer secret-token'} as any, {messageCount: 1});

    expect(spy).toHaveBeenCalledOnce();
    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged.requestId).toBe('req-1');
    expect(logged.token).toBeUndefined();
    expect(spy.mock.calls[0][0]).not.toContain('secret-token');
  });

  it('emits structured chat flow debug logs when enabled', () => {
    process.env.DEBUG_CHAT_FLOW = 'true';
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logDebugFlow('chat.request.received', {requestId: 'req-1', sessionId: 'sess-1', source: 'docs'}, {messageCount: 1});

    expect(spy).toHaveBeenCalledOnce();
    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged).toMatchObject({
      type: 'debug',
      debugType: 'chat_flow',
      event: 'chat.request.received',
      requestId: 'req-1',
      sessionId: 'sess-1',
      source: 'docs',
      data: {messageCount: 1},
    });
    expect(logged.timestamp).toEqual(expect.any(String));
  });

  it('redacts sensitive debug keys and secret-looking values', () => {
    const summarized = summarizeForDebugLog({
      authorization: 'Bearer secret-token',
      apiKey: 'sk-secret123456789',
      nested: {cookie: 'session=secret', harmless: 'ok'},
    });

    expect(summarized).toEqual({
      authorization: '[redacted]',
      apiKey: '[redacted]',
      nested: {cookie: '[redacted]', harmless: 'ok'},
    });
  });

  it('summarizes short text-like fields instead of logging prompt content', () => {
    const summarized = summarizeForDebugLog({
      prompt: 'What is my account status?',
      content: 'My email is alice@example.com',
      response: 'Your account is active',
      model: 'gpt-test',
    });

    expect(summarized).toEqual({
      prompt: {chars: 26, bytes: 26, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)},
      content: {chars: 29, bytes: 29, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)},
      response: {chars: 22, bytes: 22, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)},
      model: 'gpt-test',
    });
    expect(JSON.stringify(summarized)).not.toContain('alice@example.com');
  });

  it('summarizes common text-like key variants instead of logging short user text', () => {
    const summarized = summarizeForDebugLog({
      userPrompt: 'What is my account status?',
      messageContent: 'My email is alice@example.com',
      responseText: 'Your account is active',
      userQuestion: 'Can you reset my password?',
      query: 'How do I create a collection?',
      error: 'provider failed for alice@example.com',
      reasoning: 'user asked about private account status',
    });

    expect((summarized as any).userPrompt).toEqual({chars: 26, bytes: 26, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)});
    expect((summarized as any).messageContent).toEqual({chars: 29, bytes: 29, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)});
    expect((summarized as any).responseText).toEqual({chars: 22, bytes: 22, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)});
    expect((summarized as any).userQuestion).toEqual({chars: 26, bytes: 26, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)});
    expect((summarized as any).query).toEqual({chars: 29, bytes: 29, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)});
    expect((summarized as any).error).toEqual({chars: 37, bytes: 37, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)});
    expect((summarized as any).reasoning).toEqual({chars: 39, bytes: 39, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)});
    expect(JSON.stringify(summarized)).not.toContain('alice@example.com');
  });

  it('redacts sensitive plural token and API key fields', () => {
    const summarized = summarizeForDebugLog({
      tokens: ['short-secret'],
      accessTokens: {primary: 'short-secret'},
      refreshTokens: ['short-secret'],
      sessionTokens: ['short-secret'],
      apiKeys: ['short-secret'],
    });

    expect(summarized).toEqual({
      tokens: '[redacted]',
      accessTokens: '[redacted]',
      refreshTokens: '[redacted]',
      sessionTokens: '[redacted]',
      apiKeys: '[redacted]',
    });
  });

  it('redacts embedded secret-looking values in harmless keys', () => {
    const summarized = summarizeForDebugLog({
      error: 'provider rejected key sk-secret123456789',
      detail: 'Authorization failed for Bearer abc12345678901234567890',
      aws: 'using AKIAABCDEFGHIJKLMNOP for request',
    });

    expect(summarized).toEqual({
      error: '[redacted]',
      detail: '[redacted]',
      aws: '[redacted]',
    });
  });

  it('keeps safe correlation IDs visible even when they are long opaque strings', () => {
    const id = 'a'.repeat(64);

    const summarized = summarizeForDebugLog({requestId: id, correlationId: id, traceId: id, accessToken: id});

    expect(summarized).toEqual({
      requestId: id,
      correlationId: id,
      traceId: id,
      accessToken: '[redacted]',
    });
  });

  it('keeps safe token count fields visible', () => {
    const summarized = summarizeForDebugLog({
      inputTokens: 10,
      outputTokens: 20,
      totalTokens: 30,
      cachedInputTokens: 5,
      accessToken: 'secret',
    });

    expect(summarized).toEqual({
      inputTokens: 10,
      outputTokens: 20,
      totalTokens: 30,
      cachedInputTokens: 5,
      accessToken: '[redacted]',
    });
  });

  it('summarizes long debug strings without emitting raw text', () => {
    const text = 'How do I create a collection in Zilliz Cloud? '.repeat(8);

    const summary = summarizeTextForLog(text);

    expect(summary).toEqual({
      chars: text.length,
      bytes: Buffer.byteLength(text, 'utf8'),
      sha256: expect.stringMatching(/^[a-f0-9]{64}$/),
    });
    expect(JSON.stringify(summary)).not.toContain('create a collection');
  });

  it('does not throw when summarizing circular debug objects', () => {
    const value: Record<string, unknown> = {label: 'root'};
    value.self = value;

    const summarized = summarizeForDebugLog(value);

    expect(summarized).toEqual({label: 'root', self: '[circular]'});
  });

  it('bounds deep and wide debug objects', () => {
    const wide: Record<string, number> = {};
    for (let i = 0; i < 30; i++) wide[`key${i}`] = i;
    const deep = {level1: {level2: {level3: {level4: {level5: {level6: {level7: 'too deep'}}}}}}};

    const summarized = summarizeForDebugLog({wide, deep});

    expect((summarized as any).wide.__omittedKeys).toBe(5);
    expect((summarized as any).wide.key0).toBe(0);
    expect((summarized as any).wide.key24).toBe(24);
    expect((summarized as any).wide.key25).toBeUndefined();
    expect((summarized as any).deep.level1.level2.level3.level4.level5).toBe('[max-depth]');
  });

  it('does not let context override chat flow debug envelope fields', () => {
    process.env.DEBUG_CHAT_FLOW = 'true';
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logDebugFlow('chat.request.received', {requestId: 'req-1', event: 'evil', type: 'evil', debugType: 'evil'} as any, {});

    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged.type).toBe('debug');
    expect(logged.debugType).toBe('chat_flow');
    expect(logged.event).toBe('chat.request.received');
  });

  it('summarizes nested arrays and objects safely', () => {
    const summarized = summarizeForDebugLog({
      results: [
        {title: 'Doc 1', content: 'Documentation paragraph '.repeat(8)},
        {title: 'Doc 2', content: 'Reference paragraph '.repeat(8)},
      ],
    });

    expect(summarized).toEqual({
      results: {
        length: 2,
        items: [
          {title: 'Doc 1', content: {chars: 192, bytes: 192, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)}},
          {title: 'Doc 2', content: {chars: 160, bytes: 160, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)}},
        ],
      },
    });
  });

  it('logEvent logs structured JSON to stdout', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logEvent('conv-1', 'user-1', 'message', 'general', {contentSummary: {chars: 5, bytes: 5, sha256: 'abc'}});

    expect(spy).toHaveBeenCalledOnce();
    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged.type).toBe('event');
    expect(logged.sessionId).toBe('conv-1');
    expect(logged.eventType).toBe('message');
  });

  it('logEvent stores only URL paths for page URLs and referers', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logEvent('conv-1', 'user-1', 'message', 'general', {
      role: 'assistant',
      pageUrl: '/docs/home?email=alice@example.com#private',
    }, {referer: 'https://docs.zilliz.com/docs/home?token=secret#frag'});

    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged.pageUrl).toBe('/docs/home');
    expect(spy.mock.calls[0][0]).not.toContain('alice@example.com');
  });

  it('saveConversation logs only page URL paths and includes request ID', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    saveConversation({
      id: 'conv-1',
      requestId: 'request-1',
      userId: 'user-1',
      sessionId: 'sess-1',
      messages: [{role: 'user', content: 'hello'}],
      agentTypesUsed: ['general'],
      toolsCalled: [],
      sourcesReturned: [],
      confidenceLevels: ['high'],
      pageUrls: ['/docs/home?email=alice@example.com#private'],
      feedbackSummary: {up: 1, down: 0},
    });

    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged.requestId).toBe('request-1');
    expect(logged.pageUrls).toEqual(['/docs/home']);
    expect(spy.mock.calls[0][0]).not.toContain('alice@example.com');
  });

  it('updateUserProfile summarizes raw profile text fields and includes request ID', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    updateUserProfile('user-1', {
      requestId: 'request-1',
      topicsDiscussed: ['My email is alice@example.com'],
      pagesVisited: ['/docs/home?email=alice@example.com#private'],
    });

    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged.requestId).toBe('request-1');
    expect(logged.topicsDiscussed.items[0]).toEqual({chars: 29, bytes: 29, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)});
    expect(logged.pagesVisited.items[0]).toBe('/docs/home');
    expect(spy.mock.calls[0][0]).not.toContain('alice@example.com');
  });

  it('logEvent defensively summarizes raw text-like fields', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logEvent('conv-1', 'user-1', 'message', 'general', {
      content: 'My email is alice@example.com',
      question: 'What is my account status?',
      reasoning: 'The user shared private details',
      inputTokens: 10,
    });

    expect(spy).toHaveBeenCalledOnce();
    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged.content).toEqual({chars: 29, bytes: 29, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)});
    expect(logged.question).toEqual({chars: 26, bytes: 26, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)});
    expect(logged.reasoning).toEqual({chars: 31, bytes: 31, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)});
    expect(logged.inputTokens).toBe(10);
    expect(spy.mock.calls[0][0]).not.toContain('alice@example.com');
  });

  it('saveConversation logs conversation summary', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    saveConversation({
      id: 'conv-1',
      userId: 'user-1',
      sessionId: 'sess-1',
      messages: [{role: 'user', content: 'hello'}],
      agentTypesUsed: ['general'],
      toolsCalled: [],
      sourcesReturned: [],
      confidenceLevels: ['high'],
      pageUrls: ['/docs'],
      feedbackSummary: {up: 1, down: 0},
    });

    expect(spy).toHaveBeenCalledOnce();
    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged.type).toBe('conversation');
    expect(logged.messageCount).toBe(1);
    spy.mockRestore();
  });

  it('updateUserProfile logs profile data', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    updateUserProfile('user-1', {topicsDiscussed: ['vector search']});

    expect(spy).toHaveBeenCalledOnce();
    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged.type).toBe('user_profile');
    expect(logged.userId).toBe('user-1');
    spy.mockRestore();
  });

  it('does not throw on errors', () => {
    expect(() => logEvent('', '', '', '', {})).not.toThrow();
  });

  it('strips newline and control characters from user data', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logEvent('conv-1', 'user-1', 'message', 'general', {
      content: 'Hello\nworld\r\ninject',
      pageUrl: 'https://example.com\nmalicious',
    });

    const logged = spy.mock.calls[0][0];
    expect(logged).not.toContain('\n');
    expect(logged).not.toContain('\r');
    spy.mockRestore();
  });
});
