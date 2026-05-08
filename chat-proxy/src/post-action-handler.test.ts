import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('./db.js', () => ({
  insertDocGap: vi.fn().mockResolvedValue(undefined),
  upsertContentQuality: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('./router.js', () => ({
  clearSessionRoute: vi.fn(),
}));

import {insertDocGap} from './db.js';
import {handlePostAction} from './post-action-handler.js';

const mockInsertDocGap = vi.mocked(insertDocGap);

describe('handlePostAction privacy', () => {
  beforeEach(() => {
    mockInsertDocGap.mockClear();
    vi.restoreAllMocks();
  });

  it('stores summarized query and response text with request ID for doc gaps', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    handlePostAction({
      requestId: 'request-1',
      confidenceLevel: 'low',
      toolsCalled: ['searchDocs'],
      sourceCount: 0,
      groundedSourceCount: 0,
      fullText: 'Assistant response mentions alice@example.com',
      query: 'My email is alice@example.com',
      agentType: 'schema',
      model: 'test-model',
      sessionId: 'sess-1',
      isDeflected: false,
      isSelfDescribed: false,
    });

    expect(mockInsertDocGap).toHaveBeenCalledOnce();
    const gap = mockInsertDocGap.mock.calls[0][0];
    expect(gap.requestId).toBe('request-1');
    expect(gap.query).not.toContain('alice@example.com');
    expect(gap.responseText).not.toContain('alice@example.com');
    expect(JSON.parse(gap.query)).toEqual({chars: 29, bytes: 29, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)});
    expect(JSON.parse(gap.responseText)).toEqual({chars: 45, bytes: 45, sha256: expect.stringMatching(/^[a-f0-9]{64}$/)});
    expect(spy.mock.calls.map(call => call.join(' ')).join('\n')).toContain('request-1');
  });
});
