import React from 'react';

interface TokenRow {
  model: string;
  requestCount: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCachedInputTokens: number;
  totalTokens: number;
}

interface Props {
  data: TokenRow[];
}

export default function TokenTable({ data }: Props): React.ReactElement {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Model</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Requests</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Input</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Output</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Cached</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Total</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Avg/Req</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const avg = row.requestCount > 0 ? Math.round(row.totalTokens / row.requestCount) : 0;
            return (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '8px 12px', fontWeight: 500 }}>{row.model}</td>
                <td style={{ padding: '8px 12px' }}>{row.requestCount.toLocaleString()}</td>
                <td style={{ padding: '8px 12px' }}>{row.totalInputTokens.toLocaleString()}</td>
                <td style={{ padding: '8px 12px' }}>{row.totalOutputTokens.toLocaleString()}</td>
                <td style={{ padding: '8px 12px' }}>{row.totalCachedInputTokens.toLocaleString()}</td>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>{row.totalTokens.toLocaleString()}</td>
                <td style={{ padding: '8px 12px' }}>{avg.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
