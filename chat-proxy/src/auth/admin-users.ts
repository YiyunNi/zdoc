import {getPool} from '../db.js';

export interface AdminUser {
  open_id: string;
  name: string;
  email: string | null;
  added_at: string;
  added_by: string;
}

export async function ensureAdminUsersSchema(): Promise<void> {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      open_id    TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT,
      added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      added_by   TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_admin_users_added_at ON admin_users(added_at DESC);
  `);
}

export async function isAdminOpenId(openId: string): Promise<boolean> {
  const pool = getPool();
  const {rows} = await pool.query(
    'SELECT 1 FROM admin_users WHERE open_id = $1 LIMIT 1',
    [openId],
  );
  return rows.length > 0;
}

export async function listAdmins(): Promise<AdminUser[]> {
  const pool = getPool();
  const {rows} = await pool.query(
    'SELECT open_id, name, email, added_at, added_by FROM admin_users ORDER BY added_at DESC',
  );
  return rows as AdminUser[];
}

export async function addAdmin(input: {
  open_id: string;
  name: string;
  email?: string | null;
  added_by: string;
}): Promise<AdminUser> {
  const pool = getPool();
  const {rows} = await pool.query(
    `INSERT INTO admin_users (open_id, name, email, added_by)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (open_id) DO UPDATE SET
       name = EXCLUDED.name,
       email = EXCLUDED.email,
       added_at = NOW(),
       added_by = EXCLUDED.added_by
     RETURNING open_id, name, email, added_at, added_by`,
    [input.open_id, input.name, input.email ?? null, input.added_by],
  );
  return rows[0] as AdminUser;
}

export async function removeAdmin(openId: string): Promise<boolean> {
  const pool = getPool();
  const {rowCount} = await pool.query(
    'DELETE FROM admin_users WHERE open_id = $1',
    [openId],
  );
  return (rowCount ?? 0) > 0;
}

// Update admin_users.name only when it still matches open_id (the bootstrap placeholder).
// Lets a one-time Feishu login backfill the real display name without ever
// overwriting a manually curated name on subsequent logins.
export async function healAdminProfile(input: {
  open_id: string;
  name: string;
  email?: string | null;
}): Promise<void> {
  const pool = getPool();
  await pool.query(
    `UPDATE admin_users
       SET name = $2, email = COALESCE($3, email)
     WHERE open_id = $1 AND name = open_id`,
    [input.open_id, input.name, input.email ?? null],
  );
}

export async function bootstrapAdmins(): Promise<void> {
  const raw = process.env.ADMIN_BOOTSTRAP_OPEN_IDS;
  if (!raw) return;
  const ids = raw.split(',').map(s => s.trim()).filter(Boolean);
  if (ids.length === 0) return;
  const pool = getPool();
  for (const openId of ids) {
    await pool.query(
      `INSERT INTO admin_users (open_id, name, email, added_by)
       VALUES ($1, $2, NULL, $3)
       ON CONFLICT (open_id) DO NOTHING`,
      [openId, openId, 'bootstrap'],
    ).catch(() => {});
  }
  console.log(`[Auth] Bootstrapped ${ids.length} admin(s)`);
}
