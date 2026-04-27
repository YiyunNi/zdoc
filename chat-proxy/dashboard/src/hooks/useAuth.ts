import { useState, useEffect } from 'react';

interface AuthState {
  method: 'apikey' | 'feishu';
  role: 'admin' | 'viewer';
  user?: { open_id: string; name: string; email?: string; avatar_url?: string };
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/admin/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => setAuth(data))
      .catch(() => setAuth(null))
      .finally(() => setLoading(false));
  }, []);

  const isAdmin = auth?.role === 'admin';
  return { auth, loading, isAdmin };
}
