import React, { useState } from 'react';

export default function LoginCover(): React.ReactElement {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const signInWithKey = async () => {
    setError('');
    try {
      const res = await fetch('/admin/auth/me', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) throw new Error('Invalid API key');
      localStorage.setItem('admin_api_key', apiKey);
      window.location.reload();
    } catch (e: any) {
      setError(e.message || 'Authentication failed');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: '32px 36px',
        maxWidth: 360,
        width: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Chat Proxy</h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Admin Dashboard</p>

        <button
          onClick={() => window.location.href = '/admin/auth/feishu'}
          style={{
            width: '100%', padding: '10px 16px', borderRadius: 6,
            fontSize: 13, fontWeight: 600,
            background: 'var(--blue)', color: '#fff',
            border: 'none', cursor: 'pointer', marginBottom: 12,
          }}
        >
          Continue with Feishu
        </button>

        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <button
            onClick={() => setShowApiKey(s => !s)}
            style={{
              fontSize: 11, color: 'var(--text-muted)',
              background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            Advanced: enter API key
          </button>
        </div>

        {showApiKey && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="API key"
              style={{
                padding: '8px 12px', borderRadius: 6, fontSize: 13,
                border: '1px solid var(--border)', background: 'var(--bg)',
              }}
              onKeyDown={e => { if (e.key === 'Enter') signInWithKey(); }}
            />
            <button
              onClick={signInWithKey}
              style={{
                width: '100%', padding: '10px 16px', borderRadius: 6,
                fontSize: 13, fontWeight: 600,
                background: 'var(--text)', color: '#fff',
                border: 'none', cursor: 'pointer',
              }}
            >
              Sign In
            </button>
            {error && <p style={{ fontSize: 11, color: 'var(--red)', textAlign: 'center' }}>{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
