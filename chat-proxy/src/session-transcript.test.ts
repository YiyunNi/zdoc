import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as db from './db.js';

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

describe('session transcript storage', () => {
  it('exports transcript db helpers', () => {
    expect(typeof db.insertObsSessionMessage).toBe('function');
    expect(typeof db.listObsSessionMessages).toBe('function');
    expect(typeof db.deleteObsSessionMessagesOlderThan).toBe('function');
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
});
