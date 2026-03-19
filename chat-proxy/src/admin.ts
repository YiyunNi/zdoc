import {Hono} from 'hono';
import {MilvusClient} from '@zilliz/milvus2-sdk-node';
import {generateEmbedding} from './rag.js';

const ZILLIZ_ENDPOINT = process.env.ZILLIZ_ENDPOINT || '';
const ZILLIZ_TOKEN = process.env.ZILLIZ_TOKEN || '';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';

let adminClient: MilvusClient | null = null;

function getClient(): MilvusClient | null {
  if (!ZILLIZ_ENDPOINT || !ZILLIZ_TOKEN) return null;
  if (!adminClient) {
    adminClient = new MilvusClient({address: ZILLIZ_ENDPOINT, token: ZILLIZ_TOKEN});
  }
  return adminClient;
}

export const adminApp = new Hono();

// Auth middleware
adminApp.use('*', async (c, next) => {
  if (!ADMIN_API_KEY) {
    return c.json({error: 'Admin API not configured'}, 503);
  }
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (token !== ADMIN_API_KEY) {
    return c.json({error: 'Unauthorized'}, 401);
  }
  await next();
});

// GET /admin/conversations — filtered list
adminApp.get('/conversations', async c => {
  const client = getClient();
  if (!client) return c.json({error: 'Zilliz not configured'}, 503);

  const from = c.req.query('from');
  const to = c.req.query('to');
  const agent = c.req.query('agent');
  const userId = c.req.query('userId');
  const limit = parseInt(c.req.query('limit') || '20', 10);

  try {
    let filter = '';
    const conditions: string[] = [];
    if (userId) conditions.push(`user_id == "${userId}"`);
    if (agent) conditions.push(`array_contains(agent_types_used, "${agent}")`);
    if (from) conditions.push(`started_at >= "${from}"`);
    if (to) conditions.push(`started_at <= "${to}"`);
    if (conditions.length > 0) filter = conditions.join(' and ');

    const res = await client.query({
      collection_name: 'chat_conversations',
      filter: filter || undefined,
      output_fields: ['id', 'user_id', 'session_id', 'started_at', 'ended_at', 'agent_types_used', 'message_count', 'feedback_summary'],
      limit,
    });

    return c.json({conversations: res.data || []});
  } catch (err) {
    return c.json({error: String(err)}, 500);
  }
});

// GET /admin/conversations/search — semantic search
adminApp.get('/conversations/search', async c => {
  const client = getClient();
  if (!client) return c.json({error: 'Zilliz not configured'}, 503);

  const q = c.req.query('q');
  if (!q) return c.json({error: 'Query parameter "q" is required'}, 400);

  try {
    const embedding = await generateEmbedding(q);
    const res = await client.search({
      collection_name: 'chat_conversations',
      data: [embedding],
      limit: 10,
      output_fields: ['id', 'user_id', 'started_at', 'agent_types_used', 'message_count'],
    });

    return c.json({results: res.results || []});
  } catch (err) {
    return c.json({error: String(err)}, 500);
  }
});

// GET /admin/users — user list
adminApp.get('/users', async c => {
  const client = getClient();
  if (!client) return c.json({error: 'Zilliz not configured'}, 503);

  const limit = parseInt(c.req.query('limit') || '20', 10);

  try {
    const res = await client.query({
      collection_name: 'chat_users',
      filter: '',
      output_fields: ['user_id', 'first_seen', 'last_seen', 'total_conversations', 'agents_used', 'feedback_given'],
      limit,
    });

    return c.json({users: res.data || []});
  } catch (err) {
    return c.json({error: String(err)}, 500);
  }
});

// GET /admin/stats — aggregated dashboard data
adminApp.get('/stats', async c => {
  const client = getClient();
  if (!client) return c.json({error: 'Zilliz not configured'}, 503);

  try {
    const [convos, events, users] = await Promise.all([
      client.query({collection_name: 'chat_conversations', filter: '', output_fields: ['id'], limit: 1}),
      client.query({collection_name: 'chat_events', filter: '', output_fields: ['id'], limit: 1}),
      client.query({collection_name: 'chat_users', filter: '', output_fields: ['user_id'], limit: 1}),
    ]);

    // Get collection stats
    const [convoStats, eventStats, userStats] = await Promise.all([
      client.getCollectionStatistics({collection_name: 'chat_conversations'}),
      client.getCollectionStatistics({collection_name: 'chat_events'}),
      client.getCollectionStatistics({collection_name: 'chat_users'}),
    ]);

    return c.json({
      conversations: {count: convoStats.data?.row_count ?? 0},
      events: {count: eventStats.data?.row_count ?? 0},
      users: {count: userStats.data?.row_count ?? 0},
    });
  } catch (err) {
    return c.json({error: String(err)}, 500);
  }
});

