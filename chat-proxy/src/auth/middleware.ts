import type {Context, MiddlewareHandler} from 'hono';
import {getSignedCookie, setSignedCookie, deleteCookie} from 'hono/cookie';
import {
  SESSION_COOKIE,
  STATE_COOKIE,
  getSessionSecret,
  isOAuthEnabled,
  verifySession,
} from './session.js';
import {isAdminOpenId} from './admin-users.js';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';

export type AuthMethod = 'apikey' | 'feishu';
export type Role = 'admin' | 'viewer';

export interface AdminAuth {
  method: AuthMethod;
  role: Role;
  user?: {open_id: string; name: string; email?: string; avatar_url?: string};
}

const AUTH_CONTEXT_KEY = 'adminAuth';

export function getAuth(c: Context): AdminAuth | undefined {
  return c.get(AUTH_CONTEXT_KEY);
}

export function constantTimeCompare(a: string, b: string): boolean {
  const maxLen = Math.max(a.length, b.length);
  let result = 0;
  for (let i = 0; i < maxLen; i++) {
    const ca = i < a.length ? a.charCodeAt(i) : 0;
    const cb = i < b.length ? b.charCodeAt(i) : 0;
    result |= ca ^ cb;
  }
  return result === 0;
}

export const requireAuth: MiddlewareHandler = async (c, next) => {
  // 1. API key path
  const authHeader = c.req.header('Authorization');
  const bearerToken = authHeader?.replace('Bearer ', '');
  if (bearerToken && ADMIN_API_KEY && constantTimeCompare(bearerToken, ADMIN_API_KEY)) {
    c.set(AUTH_CONTEXT_KEY, {method: 'apikey', role: 'admin'});
    return next();
  }

  // 2. Cookie session path
  const secret = getSessionSecret();
  if (secret) {
    const sessionToken = await getSignedCookie(c, secret, SESSION_COOKIE);
    if (sessionToken) {
      const payload = verifySession(sessionToken, secret);
      if (payload) {
        const isAdmin = await isAdminOpenId(payload.open_id);
        c.set(AUTH_CONTEXT_KEY, {
          method: 'feishu',
          role: isAdmin ? 'admin' : 'viewer',
          user: {
            open_id: payload.open_id,
            name: payload.name,
            email: payload.email,
            avatar_url: payload.avatar_url,
          },
        });
        return next();
      }
    }
  }

  // 3. No valid credentials
  const anyAuthConfigured = ADMIN_API_KEY || isOAuthEnabled();
  if (!anyAuthConfigured) {
    return c.json({error: 'Admin API not configured (set ADMIN_API_KEY or Feishu OAuth vars)'}, 503);
  }

  return c.json({error: 'Unauthorized', login_url: '/admin/auth/feishu'}, 401);
};

export const requireAdmin: MiddlewareHandler = async (c, next) => {
  const auth = getAuth(c);
  if (!auth || auth.role !== 'admin') {
    return c.json({error: 'Forbidden: admin role required'}, 403);
  }
  return next();
};

export async function setSessionCookie(
  c: Context,
  payload: {open_id: string; name: string; email?: string; avatar_url?: string},
): Promise<void> {
  const secret = getSessionSecret();
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not configured');

  const now = Math.floor(Date.now() / 1000);
  const exp = now + 8 * 60 * 60; // 8 hours

  const {signSession} = await import('./session.js');
  const token = signSession({...payload, iat: now, exp}, secret);

  const isProd = process.env.NODE_ENV === 'production';
  await setSignedCookie(c, SESSION_COOKIE, token, secret, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'Lax',
    path: '/admin',
    maxAge: 8 * 60 * 60,
  });
}

export async function setStateCookie(c: Context, state: string): Promise<void> {
  const secret = getSessionSecret();
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not configured');

  const isProd = process.env.NODE_ENV === 'production';
  await setSignedCookie(c, STATE_COOKIE, state, secret, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'Lax',
    path: '/admin/auth',
    maxAge: 5 * 60,
  });
}

export async function clearStateCookie(c: Context): Promise<void> {
  const secret = getSessionSecret();
  if (!secret) return;
  deleteCookie(c, STATE_COOKIE, {path: '/admin/auth'});
}

export async function clearSessionCookie(c: Context): Promise<void> {
  const secret = getSessionSecret();
  if (!secret) return;
  deleteCookie(c, SESSION_COOKIE, {path: '/admin'});
}

export async function verifyStateCookie(c: Context, expected: string): Promise<boolean> {
  const secret = getSessionSecret();
  if (!secret) return false;
  const state = await getSignedCookie(c, secret, STATE_COOKIE);
  return !!state && state === expected;
}
