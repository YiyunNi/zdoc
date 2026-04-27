import React from 'react';
import { api } from '../api';

interface Gap {
  id: number;
  query: string;
  confidence_level: string;
  created_at: string;
}

interface Props {
  gaps: Gap[];
  isAdmin: boolean;
  onChange: () => void;
}

export default function DocGaps({ gaps, isAdmin, onChange }: Props): React.ReactElement {
  const resolve = async (id: number, status: 'resolved' | 'dismissed') => {
    try {
      await api.resolveGap(id, status);
      onChange();
    } catch (e: any) {
      alert(e.message || 'Failed to update gap');
    }
  };

  return (
    <div>
      <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Unresolved Doc Gaps ({gaps.length})</h4>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
              <th style={thStyle}>Query</th>
              <th style={thStyle}>Confidence</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gaps.map(g => (
              <tr key={g.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={tdStyle}>{g.query}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                    background: g.confidence_level === 'high' ? 'var(--green-bg)' : g.confidence_level === 'medium' ? 'var(--amber-bg)' : 'var(--red-bg)',
                    color: g.confidence_level === 'high' ? 'var(--green)' : g.confidence_level === 'medium' ? 'var(--amber)' : 'var(--red)',
                  }}>
                    {g.confidence_level}
                  </span>
                </td>
                <td style={tdStyle}>{new Date(g.created_at).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  {isAdmin && (
                    <>
                      <button onClick={() => resolve(g.id, 'resolved')} style={btnStyle}>Resolve</button>
                      <button onClick={() => resolve(g.id, 'dismissed')} style={dangerBtnStyle}>Dismiss</button>
                    </>
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
const btnStyle: React.CSSProperties = { padding: '4px 10px', borderRadius: 4, fontSize: 11, background: 'var(--green-bg)', color: 'var(--green)', border: 'none', cursor: 'pointer', marginRight: 4 };
const dangerBtnStyle: React.CSSProperties = { padding: '4px 10px', borderRadius: 4, fontSize: 11, background: 'var(--red-bg)', color: 'var(--red)', border: 'none', cursor: 'pointer' };
