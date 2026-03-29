import {describe, it, expect, vi} from 'vitest';
import {logEvent, saveConversation, updateUserProfile} from './logger.js';

describe('logger', () => {
  it('logEvent logs structured JSON to stdout', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logEvent('conv-1', 'user-1', 'message', 'general', {content: 'hello'});

    expect(spy).toHaveBeenCalledOnce();
    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged.type).toBe('event');
    expect(logged.sessionId).toBe('conv-1');
    expect(logged.eventType).toBe('message');
    spy.mockRestore();
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
});
