import crypto from 'crypto';

export interface FeishuConfig {
  appId: string;
  appSecret: string;
  host: string;
  redirectUri: string;
}

export interface FeishuTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  refresh_token_expires_in?: number;
  scope: string;
  token_type: string;
}

export interface FeishuUserInfo {
  open_id: string;
  union_id?: string;
  name: string;
  en_name?: string;
  email?: string;
  avatar_url?: string;
}

export function getFeishuConfig(): FeishuConfig | null {
  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;
  if (!appId || !appSecret) return null;
  return {
    appId,
    appSecret,
    host: process.env.FEISHU_HOST || 'https://open.feishu.cn',
    redirectUri: process.env.FEISHU_OAUTH_REDIRECT_URI || '',
  };
}

export function buildAuthorizeUrl(cfg: FeishuConfig, state: string): string {
  const url = new URL(`${cfg.host}/open-apis/authen/v1/authorize`);
  url.searchParams.set('app_id', cfg.appId);
  url.searchParams.set('redirect_uri', cfg.redirectUri);
  url.searchParams.set('scope', 'offline_access auth:user.id:read');
  url.searchParams.set('state', state);
  return url.toString();
}

export async function exchangeCodeForToken(
  cfg: FeishuConfig,
  code: string,
): Promise<FeishuTokenResponse> {
  const res = await fetch(`${cfg.host}/open-apis/authen/v2/oauth/token`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: cfg.appId,
      client_secret: cfg.appSecret,
      code,
      redirect_uri: cfg.redirectUri,
    }),
  });

  const data = (await res.json()) as any;

  if (data.code !== 0) {
    throw new Error(
      `OAuth token exchange failed: ${data.error_description || data.msg || data.error || JSON.stringify(data)}`,
    );
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    refresh_token_expires_in: data.refresh_token_expires_in,
    scope: data.scope,
    token_type: data.token_type,
  };
}

export async function fetchFeishuUserInfo(
  accessToken: string,
  host: string,
): Promise<FeishuUserInfo> {
  const res = await fetch(`${host}/open-apis/authen/v1/user_info`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const data = (await res.json()) as any;

  if (data.code !== 0 || !data.data) {
    throw new Error(
      `Failed to fetch user info: ${data.error_description || data.msg || data.error || JSON.stringify(data)}`,
    );
  }

  const d = data.data;
  return {
    open_id: d.open_id,
    union_id: d.union_id,
    name: d.name,
    en_name: d.en_name,
    email: d.email,
    avatar_url: d.avatar_url,
  };
}

export function generateOAuthState(): string {
  return crypto.randomBytes(16).toString('hex');
}
