const API_BASE = '';

async function apiFetch(path: string, options?: RequestInit): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 401) {
    window.location.href = '/admin/dashboard';
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
};
