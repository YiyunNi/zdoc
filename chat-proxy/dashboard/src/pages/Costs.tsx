import React, { useState } from 'react';

export default function Costs(): React.ReactElement {
  const [tab, setTab] = useState<'tokens' | 'settings'>('tokens');

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
          Costs & Settings
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Token usage and runtime configuration</p>
      </div>

      <div style={{ display: 'inline-flex', padding: 4, gap: 2, background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border-light)', marginBottom: 20 }}>
        <button
          onClick={() => setTab('tokens')}
          style={{
            padding: '7px 16px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            border: 'none',
            background: tab === 'tokens' ? 'var(--text)' : 'transparent',
            color: tab === 'tokens' ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          Token Usage
        </button>
        <button
          onClick={() => setTab('settings')}
          style={{
            padding: '7px 16px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            border: 'none',
            background: tab === 'settings' ? 'var(--text)' : 'transparent',
            color: tab === 'settings' ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          Settings
        </button>
      </div>

      {tab === 'tokens' && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700 }}>Tokens by Model</h3>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 14 }}>Total tokens consumed per model</p>
          <div style={{ height: 220 }} />
        </div>
      )}

      {tab === 'settings' && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700 }}>Model Configuration</h3>
          <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Settings will be implemented in a follow-up</p>
        </div>
      )}
    </div>
  );
}
