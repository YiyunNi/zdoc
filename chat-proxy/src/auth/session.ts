import crypto from 'crypto';

export interface SessionPayload {
  open_id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  iat: number;
  exp: number;
}

export const SESSION_COOKIE = '__admin_session';
export const STATE_COOKIE = '__oauth_state';

export function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error('ADMIN_SESSION_SECRET is not configured');
  }
  return secret;
}

export function isOAuthEnabled(): boolean {
  return !!(process.env.FEISHU_APP_ID && process.env.FEISHU_APP_SECRET);
}

export function signSession(payload: SessionPayload, secret: string): string {
  const json = Buffer.from(JSON.stringify(payload));
  const hmac = crypto.createHmac('sha256', secret).update(json).digest();
  return `${json.toString('base64url')}.${hmac.toString('base64url')}`;
}

export function verifySession(token: string, secret: string): SessionPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const json = Buffer.from(parts[0], 'base64url');
  const expected = crypto.createHmac('sha256', secret).update(json).digest();
  const actual = Buffer.from(parts[1], 'base64url');

  if (actual.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(actual, expected)) return null;

  try {
    const payload = JSON.parse(json.toString()) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    // 60s grace for clock skew
    if (!payload.exp || payload.exp < now - 60) return null;
    return payload;
  } catch {
    return null;
  }
}

export function generateOAuthState(): string {
  return crypto.randomBytes(16).toString('hex');
}
