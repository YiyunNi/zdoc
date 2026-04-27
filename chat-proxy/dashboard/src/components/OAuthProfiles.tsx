import React, { useState } from 'react';
import { api } from '../api';

interface Profile {
  name: string;
  provider_type: string;
  app_id: string;
  is_active: boolean;
  host: string | null;
  redirect_uri: string | null;
}

interface Props {
  profiles: Profile[];
  isAdmin: boolean;
  onChange: () => void;
}

export default function OAuthProfiles({ profiles, isAdmin, onChange }: Props): React.ReactElement {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', provider_type: 'feishu', app_id: '', app_secret: '', host: '', redirect_uri: '' });

  const add = async () => {
    try {
      await api.addOAuthProfile({
        name: form.name,
        provider_type: form.provider_type,
        app_id: form.app_id,
        app_secret: form.app_secret,
        host: form.host || null,
        redirect_uri: form.redirect_uri || null,
      });
      setShowAdd(false);
      setForm({ name: '', provider_type: 'feishu', app_id: '', app_secret: '', host: '', redirect_uri: '' });
      onChange();
    } catch (e: any) {
      alert(e.message || 'Failed to add profile');
    }
  };

  const activate = async (name: string) => {
    try {
      await api.setOAuthProfileActive(name);
      onChange();
    } catch (e: any) {
      alert(e.message || 'Failed to activate profile');
    }
  };

  const remove = async (name: string) => {
    if (!window.confirm(`Delete OAuth profile "${name}"?`)) return;
    try {
      await api.deleteOAuthProfile(name);
      onChange();
    } catch (e: any) {
      alert(e.message || 'Failed to delete profile');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ fontSize: 12, fontWeight: 700 }}>OAuth Profiles</h4>
        {isAdmin && (
          <button onClick={() => setShowAdd(s => !s)} style={btnStyle}>Add Profile</button>
        )}
      </div>

      {showAdd && (
        <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 'var(--radius)', marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
          <select value={form.provider_type} onChange={e => setForm(f => ({ ...f, provider_type: e.target.value }))} style={inputStyle}>
            <option value="feishu">feishu</option>
            <option value="google">google</option>
            <option value="github">github</option>
          </select>
          <input placeholder="App ID" value={form.app_id} onChange={e => setForm(f => ({ ...f, app_id: e.target.value }))} style={inputStyle} />
          <input placeholder="App Secret" value={form.app_secret} onChange={e => setForm(f => ({ ...f, app_secret: e.target.value }))} style={inputStyle} type="password" />
          <input placeholder="Host" value={form.host} onChange={e => setForm(f => ({ ...f, host: e.target.value }))} style={inputStyle} />
          <input placeholder="Redirect URI" value={form.redirect_uri} onChange={e => setForm(f => ({ ...f, redirect_uri: e.target.value }))} style={inputStyle} />
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
              <th style={thStyle}>App ID</th>
              <th style={thStyle}>Active</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(p => (
              <tr key={p.name} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.provider_type}</td>
                <td style={tdStyle}>{p.app_id}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                    background: p.is_active ? 'var(--green-bg)' : 'var(--bg)',
                    color: p.is_active ? 'var(--green)' : 'var(--text-muted)',
                  }}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={tdStyle}>
                  {isAdmin && !p.is_active && (
                    <button onClick={() => activate(p.name)} style={btnStyle}>Activate</button>
                  )}
                  {isAdmin && (
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
