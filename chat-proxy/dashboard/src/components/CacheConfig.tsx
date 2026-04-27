import React from 'react';

interface Props {
  cache: Record<string, unknown>;
  index: Record<string, unknown>;
}

export default function CacheConfig({ cache, index }: Props): React.ReactElement {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <div>
        <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Cache Settings</h4>
        <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(cache || {}).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ fontWeight: 500 }}>{String(v)}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Index Info</h4>
        <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(index || {}).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ fontWeight: 500 }}>{String(v)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
