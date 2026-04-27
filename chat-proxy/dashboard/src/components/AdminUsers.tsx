import React, { useState } from 'react';
import { api } from '../api';

interface Admin {
  open_id: string;
  name: string | null;
  email: string | null;
}

interface Props {
  admins: Admin[];
  isAdmin: boolean;
  onChange: () => void;
}

export default function AdminUsers({ admins, isAdmin, onChange }: Props): React.ReactElement {
  const [form, setForm] = useState({ open_id: '', name: '', email: '' });

  const add = async () => {
    try {
      await api.addAdmin({ open_id: form.open_id, name: form.name, email: form.email || undefined });
      setForm({ open_id: '', name: '', email: '' });
      onChange();
    } catch (e: any) {
      alert(e.message || 'Failed to add admin');
    }
  };

  const remove = async (openId: string) => {
    if (!window.confirm('Remove this admin?')) return;
    try {
      await api.removeAdmin(openId);
      onChange();
    } catch (e: any) {
      alert(e.message || 'Failed to remove admin');
    }
  };

  if (!isAdmin) return <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Admin management is restricted to admins.</p>;

  return (
    <div>
      <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Admins</h4>

      <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 'var(--radius)', marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <input placeholder="Open ID" value={form.open_id} onChange={e => setForm(f => ({ ...f, open_id: e.target.value }))} style={inputStyle} />
        <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
        <input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
        <button onClick={add} style={btnStyle}>Add Admin</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Open ID</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.open_id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={tdStyle}>{a.name || <span style={{ color: 'var(--text-muted)' }}>pending sign-in</span>}</td>
                <td style={tdStyle}>{a.email || '—'}</td>
                <td style={tdStyle}><span style={{ fontFamily: 'monospace', fontSize: 11 }}>{a.open_id}</span></td>
                <td style={tdStyle}>
                  <button onClick={() => remove(a.open_id)} style={dangerBtnStyle}>Remove</button>
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
const dangerBtnStyle: React.CSSProperties = { padding: '4px 10px', borderRadius: 4, fontSize: 11, background: 'var(--red-bg)', color: 'var(--red)', border: 'none', cursor: 'pointer' };
