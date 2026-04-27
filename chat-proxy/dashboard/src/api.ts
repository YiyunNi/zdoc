const API_BASE = '';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const key = localStorage.getItem('admin_api_key');
  if (key) headers['Authorization'] = `Bearer ${key}`;
  return headers;
}

async function apiFetch(path: string, options?: RequestInit): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: getHeaders(),
    ...options,
  });
  if (res.status === 401) {
    const body = await res.json().catch(() => ({}));
    window.location.href = body.login_url || '/admin/auth/feishu';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getOverview: () => apiFetch('/admin/api/analytics/overview'),
  getTrends: (days: number) => apiFetch(`/admin/api/analytics/trends?days=${days}`),
  getLive: () => apiFetch('/admin/api/live'),
  getRecentActivity: (limit: number) => apiFetch(`/admin/api/analytics/recent-activity?limit=${limit}`),
  getUsers: (page: number, pageSize: number, country?: string) =>
    apiFetch(`/admin/api/analytics/users?page=${page}&pageSize=${pageSize}${country ? `&country=${encodeURIComponent(country)}` : ''}`),
  getSession: (id: string) => apiFetch(`/admin/api/session/${encodeURIComponent(id)}`),
  getTokenUsageByModel: () => apiFetch('/admin/api/token-usage/by-model'),
  getTokenTrends: (days: number) => apiFetch(`/admin/api/analytics/token-trends?days=${days}`),
  getConfig: () => apiFetch('/admin/api/config'),
  getDocGaps: (limit: number) => apiFetch(`/admin/api/doc-gaps?limit=${limit}`),
  getContentQuality: (limit: number) => apiFetch(`/admin/api/content-quality?limit=${limit}`),
  getProviderProfiles: () => apiFetch('/admin/api/provider-profiles'),
  getOAuthProfiles: () => apiFetch('/admin/api/oauth-profiles'),
  getAdmins: () => apiFetch('/admin/api/admins'),
  getFeedbackStats: () => apiFetch('/admin/api/feedback/stats'),
  getHealth: () => apiFetch('/admin/api/health'),

  putConfig: (key: string, body: { provider: string; model: string; profileName?: string | null }) =>
    apiFetch(`/admin/api/config/${encodeURIComponent(key)}`, { method: 'PUT', body: JSON.stringify(body) }),

  testConfig: (key: string) =>
    apiFetch(`/admin/api/config/${encodeURIComponent(key)}/test`, { method: 'POST' }),

  refreshIndex: () => apiFetch('/admin/refresh-index', { method: 'POST' }),

  clearCache: () => apiFetch('/admin/api/cache/clear', { method: 'POST' }),

  resolveGap: (id: number, status: 'resolved' | 'dismissed') =>
    apiFetch(`/admin/api/doc-gaps/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  deleteProviderProfile: (name: string) =>
    apiFetch(`/admin/api/provider-profiles/${encodeURIComponent(name)}`, { method: 'DELETE' }),

  setOAuthProfileActive: (name: string) =>
    apiFetch(`/admin/api/oauth-profiles/${encodeURIComponent(name)}/activate`, { method: 'POST' }),

  deleteOAuthProfile: (name: string) =>
    apiFetch(`/admin/api/oauth-profiles/${encodeURIComponent(name)}`, { method: 'DELETE' }),

  addAdmin: (body: { open_id: string; name: string; email?: string }) =>
    apiFetch('/admin/api/admins', { method: 'POST', body: JSON.stringify(body) }),

  removeAdmin: (openId: string) =>
    apiFetch(`/admin/api/admins/${encodeURIComponent(openId)}`, { method: 'DELETE' }),

  addProviderProfile: (body: Record<string, unknown>) =>
    apiFetch('/admin/api/provider-profiles', { method: 'POST', body: JSON.stringify(body) }),

  addOAuthProfile: (body: Record<string, unknown>) =>
    apiFetch('/admin/api/oauth-profiles', { method: 'POST', body: JSON.stringify(body) }),
};
