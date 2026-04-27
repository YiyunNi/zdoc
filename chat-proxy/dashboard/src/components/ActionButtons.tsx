import React, { useState } from 'react';
import { api } from '../api';

interface Props {
  isAdmin: boolean;
}

export default function ActionButtons({ isAdmin }: Props): React.ReactElement {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshResult, setRefreshResult] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    setRefreshResult(null);
    try {
      const start = Date.now();
      await api.refreshIndex();
      setRefreshResult(`Index refreshed (${Date.now() - start}ms)`);
    } catch (e: any) {
      setRefreshResult(`Error: ${e.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const clear = async () => {
    if (!window.confirm('Clear the semantic cache? This cannot be undone.')) return;
    setClearing(true);
    try {
      await api.clearCache();
      alert('Cache cleared');
    } catch (e: any) {
      alert(e.message || 'Failed to clear cache');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        onClick={refresh}
        disabled={!isAdmin || refreshing}
        style={{
          padding: '8px 16px',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          background: isAdmin ? 'var(--text)' : '#ccc',
          color: '#fff',
          border: 'none',
          cursor: isAdmin ? 'pointer' : 'not-allowed',
        }}
      >
        {refreshing ? 'Refreshing…' : 'Refresh Index'}
      </button>
      <button
        onClick={clear}
        disabled={!isAdmin || clearing}
        style={{
          padding: '8px 16px',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          background: isAdmin ? 'var(--red)' : '#ccc',
          color: '#fff',
          border: 'none',
          cursor: isAdmin ? 'pointer' : 'not-allowed',
        }}
      >
        {clearing ? 'Clearing…' : 'Clear Cache'}
      </button>
      {refreshResult && (
        <span style={{ fontSize: 11, color: refreshResult.startsWith('Error') ? 'var(--red)' : 'var(--green)' }}>
          {refreshResult}
        </span>
      )}
    </div>
  );
}
