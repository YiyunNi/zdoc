import { neon } from '@neondatabase/serverless';

let sql;
function getDb() {
  if (!sql) sql = neon(process.env.DATABASE_URL);
  return sql;
}

function unauthorized(res) {
  res.status(401).json({ error: 'Unauthorized' });
}

function checkAuth(req, res) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  return token === process.env.LOG_SECRET;
}

export default async function handler(req, res) {
  if (!checkAuth(req, res)) return unauthorized(res);

  if (req.method === 'POST') {
    // Fluent Bit sends a JSON array or a single object
    const body = req.body;
    const rows = Array.isArray(body) ? body : [body];

    const values = rows.map(r => ({
      host: r.host || null,
      path: r.path || r.request || '/',
      ua: r.ua || r['user-agent'] || null,
      referer: r.referer || null,
      ip: r.ip || r['x-forwarded-for'] || null,
      status: r.status != null ? Number(r.status) : null,
      bytes: r.bytes != null ? Number(r.bytes) : null,
    }));

    const sql = getDb();
    for (const v of values) {
      await sql`
        INSERT INTO page_views (host, path, ua, referer, ip, status, bytes)
        VALUES (${v.host}, ${v.path}, ${v.ua}, ${v.referer}, ${v.ip}, ${v.status}, ${v.bytes})
      `;
    }

    return res.status(200).json({ inserted: values.length });
  }

  if (req.method === 'GET') {
    const {
      ua_filter,
      path: pathFilter,
      host: hostFilter,
      days = '7',
      limit = '100',
    } = req.query;

    const daysNum = Math.min(Math.max(parseInt(days, 10) || 7, 1), 90);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 1000);

    const db = getDb();
    const params = [];
    const conditions = [];

    if (ua_filter) {
      params.push('%' + ua_filter + '%');
      conditions.push(`ua ILIKE $${params.length}`);
    }
    if (pathFilter) {
      params.push('%' + pathFilter + '%');
      conditions.push(`path ILIKE $${params.length}`);
    }
    if (hostFilter) {
      params.push(hostFilter);
      conditions.push(`host = $${params.length}`);
    }

    const where = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';
    const rows = await db(
      `SELECT ts, host, path, ua, referer, ip, status, bytes FROM page_views
       WHERE ts >= NOW() - INTERVAL '${daysNum} days' ${where}
       ORDER BY ts DESC LIMIT ${limitNum}`,
      params
    );

    return res.status(200).json({ count: rows.length, rows });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
