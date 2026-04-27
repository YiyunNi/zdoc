import React from 'react';

interface Issue {
  id: number;
  url: string;
  issue_type: string;
  occurrence_count: number;
}

interface Props {
  issues: Issue[];
}

export default function ContentQuality({ issues }: Props): React.ReactElement {
  return (
    <div>
      <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Content Quality Issues ({issues.length})</h4>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
              <th style={thStyle}>URL</th>
              <th style={thStyle}>Issue</th>
              <th style={thStyle}>Count</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => {
              let urlObj: URL | null = null;
              try { urlObj = new URL(issue.url); } catch { /* ignore */ }
              const displayUrl = urlObj ? `${urlObj.host}${urlObj.pathname}` : issue.url;
              const color = issue.issue_type === 'broken_link' || issue.issue_type === 'missing' ? 'var(--red)' : 'var(--amber)';
              const bg = issue.issue_type === 'broken_link' || issue.issue_type === 'missing' ? 'var(--red-bg)' : 'var(--amber-bg)';
              return (
                <tr key={issue.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{displayUrl.slice(0, 80)}{displayUrl.length > 80 ? '…' : ''}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: bg, color }}>
                      {issue.issue_type}
                    </span>
                  </td>
                  <td style={tdStyle}>{issue.occurrence_count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: '8px 12px', fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: '8px 12px' };
