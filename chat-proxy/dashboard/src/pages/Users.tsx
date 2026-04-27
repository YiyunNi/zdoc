import React, { useEffect, useState, useRef } from 'react';
import { api } from '../api';
import UsersList from '../components/UsersList';
import SessionDetail from '../components/SessionDetail';
import { useInterval } from '../hooks/useInterval';
import { formatDuration, formatNumber } from '../lib/formatters';

interface Session {
  firstQuestion: string;
  agent: string;
  messageCount: number;
  createdAt: string;
}

interface User {
  userId: string;
  sessionCount: number;
  lastActive: string;
  avgDurationSeconds: number;
  userMeta?: Record<string, any>;
  sessions: Session[];
  topics: string[];
}

export default function Users(): React.ReactElement {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [countryFilter, setCountryFilter] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pageSize = 10;

  const [countries, setCountries] = useState<string[]>([]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await api.getUsers(page, pageSize, countryFilter || undefined);
      setUsers(res.users || []);
      setTotal(res.total || 0);

      if (!countryFilter) {
        const allRes = await api.getUsers(1, 9999);
        const geoSet = new Set<string>();
        (allRes.users || []).forEach((u: User) => {
          if (u.userMeta?.country) geoSet.add(u.userMeta.country);
        });
        setCountries(Array.from(geoSet).sort());
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [page, countryFilter]);

  const fetchRef = useRef(fetchUsers);
  fetchRef.current = fetchUsers;
  useInterval(() => fetchRef.current(), 10000);

  const handleSelectSession = (userId: string, sessionIndex: number) => {
    setSelectedSessionId(`${userId}__${sessionIndex}`);
  };

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(start + users.length - 1, total);

  const totalSessions = users.reduce((sum, u) => sum + (u.sessionCount || 0), 0);
  const avgSessions = total > 0 ? (totalSessions / total).toFixed(1) : '0';
  const avgDuration = users.length > 0
    ? users.reduce((sum, u) => sum + (u.avgDurationSeconds || 0), 0) / users.length
    : 0;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
          Users & Sessions
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Conversations grouped by user</p>
      </div>

      {/* Metric strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        marginBottom: 28,
        padding: '20px 0',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <Metric label="Total Users" value={formatNumber(total)} />
        <Metric label="Total Sessions" value={formatNumber(totalSessions)} />
        <Metric label="Avg Sessions/User" value={avgSessions} />
        <Metric label="Avg Duration" value={formatDuration(avgDuration)} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr',
        gap: 16,
        minHeight: 540,
      }}>
        {/* Left panel */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Users</span>
            {countries.length > 0 && (
              <select
                value={countryFilter}
                onChange={e => { setCountryFilter(e.target.value); setPage(1); }}
                style={{ fontSize: 11, padding: '4px 8px', borderRadius: 4, border: '1px solid #d8dae0' }}
              >
                <option value="">All countries</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading && <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>}
            {error && <div style={{ padding: 40, textAlign: 'center', color: 'var(--red)' }}>{error}</div>}
            {!loading && !error && <UsersList users={users} selectedSessionId={selectedSessionId} onSelectSession={handleSelectSession} />}
          </div>

          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: 'var(--text-muted)' }}>
            <span>{total === 0 ? 'No users yet' : `Showing ${start}–${end} of ${total}`}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                style={{ padding: '4px 10px', borderRadius: 4, fontSize: 10, background: 'var(--bg)', border: '1px solid #d8dae0', color: 'var(--text)' }}
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                Prev
              </button>
              <button
                style={{ padding: '4px 10px', borderRadius: 4, fontSize: 10, background: 'var(--text)', border: 'none', color: '#fff', fontWeight: 600 }}
                disabled={end >= total}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <SessionDetail sessionId={selectedSessionId} users={users} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }): React.ReactElement {
  return (
    <div style={{ textAlign: 'center', padding: '0 16px' }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--heading)', fontSize: 32, fontWeight: 800, marginTop: 4, letterSpacing: '-1px' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  );
}
