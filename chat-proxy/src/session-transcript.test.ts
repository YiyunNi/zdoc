import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import * as db from './db.js';
import { logEvent } from './logger.js';

const hasDb = !!process.env.DATABASE_URL;

beforeAll(async () => {
  if (!hasDb) return;
  await db.initDb();
});

afterAll(async () => {
  if (!hasDb) return;
  await db.closeDb();
});

async function cleanSessionTranscriptRows(): Promise<void> {
  const pool = db.getPool();
  await pool.query('DELETE FROM obs_session_messages');
}

async function waitForTranscriptRows(sessionId: string, expectedCount: number): Promise<db.ObsSessionMessageRow[]> {
  const maxAttempts = 20;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const rows = await db.listObsSessionMessages(sessionId);
    if (rows.length >= expectedCount) return rows;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  return db.listObsSessionMessages(sessionId);
}

describe('session transcript storage', () => {
  it('exports transcript db helpers', () => {
    expect(typeof db.insertObsSessionMessage).toBe('function');
    expect(typeof db.listObsSessionMessages).toBe('function');
    expect(typeof db.deleteObsSessionMessagesOlderThan).toBe('function');
  });

  it('dual-write: logger writes raw transcript for user message events', async () => {
    vi.resetModules();
    const insertObsSessionMessage = vi.fn().mockResolvedValue(undefined);
    const saveObsEvent = vi.fn().mockResolvedValue(undefined);
    const upsertObsSession = vi.fn().mockResolvedValue(undefined);

    vi.doMock('./db.js', async () => {
      const actual = await vi.importActual<typeof import('./db.js')>('./db.js');
      return {
        ...actual,
        saveObsEvent,
        upsertObsSession,
        insertObsSessionMessage,
      };
    });

    const { logEvent: logEventUnderTest } = await import('./logger.js');

    logEventUnderTest('s-dual-mock-user', 'u1', 'message', 'general', {
      requestId: 'req-user',
      role: 'user',
      contentSummary: { chars: 5, bytes: 5, sha256: 'abc' },
      rawContent: 'hello',
    });

    await Promise.resolve();

    expect(insertObsSessionMessage).toHaveBeenCalledTimes(1);
    expect(insertObsSessionMessage).toHaveBeenCalledWith(expect.objectContaining({
      sessionId: 's-dual-mock-user',
      userId: 'u1',
      role: 'user',
      contentRaw: 'hello',
      requestId: 'req-user',
      source: 'docs',
      agent: 'general',
    }));

    vi.doUnmock('./db.js');
  });

  it('dual-write: logger skips transcript inserts for non-message events', async () => {
    vi.resetModules();
    const insertObsSessionMessage = vi.fn().mockResolvedValue(undefined);
    const saveObsEvent = vi.fn().mockResolvedValue(undefined);
    const upsertObsSession = vi.fn().mockResolvedValue(undefined);

    vi.doMock('./db.js', async () => {
      const actual = await vi.importActual<typeof import('./db.js')>('./db.js');
      return {
        ...actual,
        saveObsEvent,
        upsertObsSession,
        insertObsSessionMessage,
      };
    });

    const { logEvent: logEventUnderTest } = await import('./logger.js');

    logEventUnderTest('s-dual-mock-cache', 'u1', 'cache', 'general', {
      requestId: 'req-cache',
      role: 'user',
      rawContent: 'should-not-save',
    });

    await Promise.resolve();

    expect(insertObsSessionMessage).not.toHaveBeenCalled();

    vi.doUnmock('./db.js');
  });

  it('persists raw user and assistant transcript messages with metadata', async () => {
    if (!hasDb) return;

    await cleanSessionTranscriptRows();

    await db.insertObsSessionMessage({
      id: 'msg-user-1',
      sessionId: 's1',
      userId: 'u1',
      role: 'user',
      contentRaw: 'hello',
      createdAt: new Date().toISOString(),
    });

    await db.insertObsSessionMessage({
      id: 'msg-assistant-1',
      sessionId: 's1',
      userId: 'u1',
      role: 'assistant',
      contentRaw: 'hi there',
      requestId: 'req-123',
      source: 'docs',
      geoMeta: { country: 'US', city: 'SF' },
      createdAt: new Date().toISOString(),
    });

    const rows = await db.listObsSessionMessages('s1');
    expect(rows.map((row) => row.contentRaw)).toEqual(['hello', 'hi there']);

    const assistantRow = rows[1];
    expect(assistantRow.requestId).toBe('req-123');
    expect(assistantRow.source).toBe('docs');
    expect(assistantRow.geoMeta).toEqual({ country: 'US', city: 'SF' });
  });

  it('rejects invalid retention day values', async () => {
    await expect(db.deleteObsSessionMessagesOlderThan(-1)).rejects.toThrow(
      'Invalid retention days: -1. Expected a finite integer >= 0.',
    );
    await expect(db.deleteObsSessionMessagesOlderThan(Number.NaN)).rejects.toThrow(
      'Invalid retention days: NaN. Expected a finite integer >= 0.',
    );
    await expect(db.deleteObsSessionMessagesOlderThan(1.5)).rejects.toThrow(
      'Invalid retention days: 1.5. Expected a finite integer >= 0.',
    );
  });

  it('deletes only rows older than retention days', async () => {
    if (!hasDb) return;

    await cleanSessionTranscriptRows();

    const now = Date.now();
    await db.insertObsSessionMessage({
      id: 'msg-old',
      sessionId: 's1',
      userId: 'u1',
      role: 'user',
      contentRaw: 'old message',
      createdAt: new Date(now - (181 * 24 * 60 * 60 * 1000)).toISOString(),
    });

    await db.insertObsSessionMessage({
      id: 'msg-new',
      sessionId: 's1',
      userId: 'u1',
      role: 'assistant',
      contentRaw: 'new message',
      createdAt: new Date(now - (10 * 24 * 60 * 60 * 1000)).toISOString(),
    });

    const deleted = await db.deleteObsSessionMessagesOlderThan(180);
    expect(deleted).toBe(1);

    const rows = await db.listObsSessionMessages('s1');
    expect(rows.map((row) => row.id)).toEqual(['msg-new']);
    expect(rows[0]?.contentRaw).toBe('new message');
  });

  it('dual-write: keeps event persistence summarized while writing raw transcript for user role', async () => {
    if (!hasDb) return;

    await cleanSessionTranscriptRows();

    logEvent('s-dual-user', 'u1', 'message', 'general', {
      requestId: 'req-user',
      role: 'user',
      contentSummary: { chars: 5, bytes: 5, sha256: 'abc' },
      rawContent: 'hello',
    });

    const rows = await waitForTranscriptRows('s-dual-user', 1);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.contentRaw).toBe('hello');
    expect(rows[0]?.role).toBe('user');
    expect(rows[0]?.requestId).toBe('req-user');
    expect(rows[0]?.agent).toBe('general');
    expect(rows[0]?.source).toBe('docs');
  });

  it('dual-write: writes assistant transcript row and skips non-message events', async () => {
    if (!hasDb) return;

    await cleanSessionTranscriptRows();

    logEvent('s-dual-assistant', 'u1', 'message', 'general', {
      requestId: 'req-assistant',
      role: 'assistant',
      contentSummary: { chars: 8, bytes: 8, sha256: 'def' },
      rawContent: 'hi there',
      sourceCount: 2,
    });

    logEvent('s-dual-assistant', 'u1', 'cache', 'general', {
      requestId: 'req-cache',
      cacheType: 'response_session',
      rawContent: 'should-not-be-saved',
    });

    const rows = await waitForTranscriptRows('s-dual-assistant', 1);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.contentRaw).toBe('hi there');
    expect(rows[0]?.role).toBe('assistant');
    expect(rows[0]?.requestId).toBe('req-assistant');
  });
});
