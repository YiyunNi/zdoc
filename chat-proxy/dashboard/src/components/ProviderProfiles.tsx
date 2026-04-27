import React, { useState } from 'react';
import { api } from '../api';

interface Profile {
  name: string;
  provider_type: string;
  base_url: string | null;
  region: string | null;
  credentials: Record<string, string>;
  notes: string | null;
}

interface Props {
  profiles: Profile[];
  isAdmin: boolean;
  onChange: () => void;
}

export default function ProviderProfiles({ profiles, isAdmin, onChange }: Props): React.ReactElement {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', provider_type: 'openai-compatible', base_url: '', region: '', api_key: '' });

  const add = async () => {
    try {
      await api.addProviderProfile({
        name: form.name,
        provider_type: form.provider_type,
        base_url: form.base_url || null,
        region: form.region || null,
        credentials: form.provider_type === 'openai-compatible' ? { api_key: form.api_key } : {},
      });
      setShowAdd(false);
      setForm({ name: '', provider_type: 'openai-compatible', base_url: '', region: '', api_key: '' });
      onChange();
    } catch (e: any) {
      alert(e.message || 'Failed to add profile');
    }
  };

  const remove = async (name: string) => {
    if (!window.confirm(`Delete provider profile "${name}"?`)) return;
    try {
      await api.deleteProviderProfile(name);
      onChange();
    } catch (e: any) {
      alert(e.message || 'Failed to delete profile');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ fontSize: 12, fontWeight: 700 }}>Provider Profiles</h4>
        {isAdmin && (
          <button onClick={() => setShowAdd(s => !s)} style={btnStyle}>Add Profile</button>
        )}
      </div>

      {showAdd && (
        <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 'var(--radius)', marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
          <select value={form.provider_type} onChange={e => setForm(f => ({ ...f, provider_type: e.target.value }))} style={inputStyle}>
            <option value="openai-compatible">openai-compatible</option>
            <option value="bedrock">bedrock</option>
            <option value="openai">openai</option>
            <option value="anthropic">anthropic</option>
            <option value="google">google</option>
          </select>
          <input placeholder="Base URL" value={form.base_url} onChange={e => setForm(f => ({ ...f, base_url: e.target.value }))} style={inputStyle} />
          <input placeholder="Region" value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} style={inputStyle} />
          <input placeholder="API Key" value={form.api_key} onChange={e => setForm(f => ({ ...f, api_key: e.target.value }))} style={inputStyle} type="password" />
          <button onClick={add} style={btnStyle}>Save</button>
          <button onClick={() => setShowAdd(false)} style={btnStyleSecondary}>Cancel</button>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Base URL</th>
              <th style={thStyle}>Region</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(p => (
              <tr key={p.name} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.provider_type}</td>
                <td style={tdStyle}>{p.base_url || '—'}</td>
                <td style={tdStyle}>{p.region || '—'}</td>
                <td style={tdStyle}>
                  {isAdmin && p.name !== 'env default' && (
                    <button onClick={() => remove(p.name)} style={dangerBtnStyle}>Remove</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: '8px 12px', fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: '8px 12px' };
const inputStyle: React.CSSProperties = { fontSize: 12, padding: '4px 6px', borderRadius: 4, border: '1px solid #d8dae0' };
const btnStyle: React.CSSProperties = { padding: '4px 10px', borderRadius: 4, fontSize: 11, background: 'var(--text)', color: '#fff', border: 'none', cursor: 'pointer' };
const btnStyleSecondary: React.CSSProperties = { padding: '4px 10px', borderRadius: 4, fontSize: 11, background: 'var(--bg)', border: '1px solid #d8dae0', color: 'var(--text)', cursor: 'pointer' };
const dangerBtnStyle: React.CSSProperties = { padding: '4px 10px', borderRadius: 4, fontSize: 11, background: 'var(--red-bg)', color: 'var(--red)', border: 'none', cursor: 'pointer' };
