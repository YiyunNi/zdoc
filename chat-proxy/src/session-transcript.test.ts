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
    expect(typeof (db as any).insertObsSessionMessage).toBe('function');
    expect(typeof (db as any).listObsSessionMessages).toBe('function');
    expect(typeof (db as any).deleteObsSessionMessagesOlderThan).toBe('function');
  });

  it('persists raw user and assistant transcript messages', async () => {
    if (!hasDb) return;

    await cleanSessionTranscriptRows();

    await (db as any).insertObsSessionMessage({
      id: 'msg-user-1',
      sessionId: 's1',
      userId: 'u1',
      role: 'user',
      contentRaw: 'hello',
      createdAt: new Date().toISOString(),
    });

    await (db as any).insertObsSessionMessage({
      id: 'msg-assistant-1',
      sessionId: 's1',
      userId: 'u1',
      role: 'assistant',
      contentRaw: 'hi there',
      createdAt: new Date().toISOString(),
    });

    const rows = await (db as any).listObsSessionMessages('s1');
    expect(rows.map((row: any) => row.contentRaw)).toEqual(['hello', 'hi there']);
  });

  it('deletes raw transcript rows older than retention days', async () => {
    if (!hasDb) return;

    await cleanSessionTranscriptRows();

    const deleted = await (db as any).deleteObsSessionMessagesOlderThan(180);
    expect(typeof deleted).toBe('number');
  });
});
