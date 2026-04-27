import React, { useState } from 'react';
import { api } from '../api';

interface ConfigEntry {
  key: string;
  provider: string;
  model: string;
  profileName: string | null;
}

interface ResolvedEntry {
  key: string;
  source: string;
  provider: string;
  model: string;
}

interface Props {
  config: ConfigEntry[];
  resolved: ResolvedEntry[];
  isAdmin: boolean;
  onChange: () => void;
}

export default function ModelConfig({ config, resolved, isAdmin, onChange }: Props): React.ReactElement {
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ provider: '', model: '', profileName: '' });
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ key: string; ok: boolean; msg: string } | null>(null);

  const allKeys = [
    'chat', 'router', 'grounding', 'rewrite', 'embedding',
    'agent:general', 'agent:schema', 'agent:resources', 'agent:product', 'agent:code',
  ];

  const merged = allKeys.map(key => {
    const db = config.find(c => c.key === key);
    const res = resolved.find(r => r.key === key);
    return {
      key,
      provider: db?.provider || res?.provider || '—',
      model: db?.model || res?.model || '—',
      profileName: db?.profileName || null,
      source: res?.source || 'env',
    };
  });

  const startEdit = (key: string, row: any) => {
    setEditing(key);
    setEditForm({ provider: row.provider === '—' ? 'openai-compatible' : row.provider, model: row.model === '—' ? '' : row.model, profileName: row.profileName || '' });
  };

  const save = async (key: string) => {
    try {
      await api.putConfig(key, {
        provider: editForm.provider,
        model: editForm.model,
        profileName: editForm.profileName || null,
      });
      setEditing(null);
      onChange();
    } catch (e: any) {
      alert(e.message || 'Save failed');
    }
  };

  const test = async (key: string) => {
    setTesting(key);
    setTestResult(null);
    try {
      const res = await api.testConfig(key);
      setTestResult({ key, ok: true, msg: res.ok ? 'OK' : JSON.stringify(res) });
    } catch (e: any) {
      setTestResult({ key, ok: false, msg: e.message || 'Test failed' });
    } finally {
      setTesting(null);
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Key</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Provider</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Model</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Profile</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Source</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {merged.map(row => (
            <tr key={row.key} style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '8px 12px', fontWeight: 500 }}>{row.key}</td>
              {editing === row.key ? (
                <>
                  <td style={{ padding: '4px 12px' }}>
                    <select
                      value={editForm.provider}
                      onChange={e => setEditForm(f => ({ ...f, provider: e.target.value }))}
                      style={{ fontSize: 12, padding: '4px 6px', borderRadius: 4, border: '1px solid #d8dae0', width: '100%' }}
                    >
                      <option value="openai-compatible">openai-compatible</option>
                      <option value="bedrock">bedrock</option>
                      <option value="openai">openai</option>
                      <option value="anthropic">anthropic</option>
                      <option value="google">google</option>
                    </select>
                  </td>
                  <td style={{ padding: '4px 12px' }}>
                    <input
                      value={editForm.model}
                      onChange={e => setEditForm(f => ({ ...f, model: e.target.value }))}
                      placeholder="model-id"
                      style={{ fontSize: 12, padding: '4px 6px', borderRadius: 4, border: '1px solid #d8dae0', width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '4px 12px' }}>
                    <input
                      value={editForm.profileName}
                      onChange={e => setEditForm(f => ({ ...f, profileName: e.target.value }))}
                      placeholder="profile name"
                      style={{ fontSize: 12, padding: '4px 6px', borderRadius: 4, border: '1px solid #d8dae0', width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{row.source}</td>
                  <td style={{ padding: '4px 12px', display: 'flex', gap: 4 }}>
                    <button onClick={() => save(row.key)} style={btnStyle}>Save</button>
                    <button onClick={() => setEditing(null)} style={btnStyleSecondary}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ padding: '8px 12px' }}>{row.provider}</td>
                  <td style={{ padding: '8px 12px' }}>{row.model}</td>
                  <td style={{ padding: '8px 12px' }}>{row.profileName || '—'}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{row.source}</td>
                  <td style={{ padding: '4px 12px', display: 'flex', gap: 4 }}>
                    {isAdmin && (
                      <button onClick={() => startEdit(row.key, row)} style={btnStyle}>Edit</button>
                    )}
                    <button onClick={() => test(row.key)} disabled={!!testing} style={btnStyleSecondary}>
                      {testing === row.key ? 'Testing…' : 'Test'}
                    </button>
                    {testResult?.key === row.key && (
                      <span style={{ fontSize: 11, color: testResult.ok ? 'var(--green)' : 'var(--red)', alignSelf: 'center' }}>
                        {testResult.msg}
                      </span>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '4px 10px',
  borderRadius: 4,
  fontSize: 11,
  background: 'var(--text)',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

const btnStyleSecondary: React.CSSProperties = {
  padding: '4px 10px',
  borderRadius: 4,
  fontSize: 11,
  background: 'var(--bg)',
  border: '1px solid #d8dae0',
  color: 'var(--text)',
  cursor: 'pointer',
};
