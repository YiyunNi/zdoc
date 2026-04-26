import {vi, afterEach, beforeAll} from 'vitest';

// Safe environment defaults so modules that read process.env at import time
// don't crash or hit real services.
beforeAll(() => {
  process.env.AI_API_KEY = process.env.AI_API_KEY || 'test-key';
  process.env.ZILLIZ_ENDPOINT = process.env.ZILLIZ_ENDPOINT || '';
  process.env.ZILLIZ_TOKEN = process.env.ZILLIZ_TOKEN || '';
  process.env.ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';
  process.env.EMBEDDING_API_KEY = process.env.EMBEDDING_API_KEY || 'test-key';
  process.env.ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'test-session-secret-32-bytes-min!!';
});

// Prevent module-level setInterval timers from leaking across tests
vi.useFakeTimers({shouldAdvanceTime: true});

afterEach(() => {
  vi.restoreAllMocks();
});
