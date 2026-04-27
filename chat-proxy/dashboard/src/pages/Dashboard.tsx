import React, { useEffect, useState } from 'react';
import { api } from '../api';
import GeoChart from '../components/GeoChart';

interface OverviewData {
  conversations?: number;
  messages?: number;
  users?: number;
  avgConfidence?: number;
}

interface TrendData {
  date: string;
  conversations?: number;
  messages?: number;
  users?: number;
  highConfidence?: number;
}

interface LiveSession {
  sessionId: string;
  userId: string;
  agent: string;
  model: string;
  messageCount: number;
  firstQuestion: string;
  lastActive: string;
}

interface ActivityItem {
  timestamp: string;
  agent: string;
  query: string;
}

interface UserData {
  userId: string;
  sessionCount: number;
  userMeta?: { country?: string };
}

export default function Dashboard(): React.ReactElement {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [, setTrends] = useState<TrendData[]>([]);
  const [live, setLive] = useState<LiveSession[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [geoData, setGeoData] = useState<{ country: string; sessions: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAll() {
      try {
        const [overviewRes, trendsRes, liveRes, activityRes, usersRes] = await Promise.all([
          api.getOverview(),
          api.getTrends(7),
          api.getLive(),
          api.getRecentActivity(8),
          api.getUsers(1, 9999),
        ]);
        setOverview(overviewRes);
        setTrends(trendsRes);
        setLive(liveRes.sessions || []);
        setActivity(activityRes);

        // Aggregate geo data from users
        const geoMap = new Map<string, number>();
        (usersRes.users || []).forEach((u: UserData) => {
          const country = u.userMeta?.country || 'Unknown';
          geoMap.set(country, (geoMap.get(country) || 0) + (u.sessionCount || 0));
        });
        setGeoData(Array.from(geoMap.entries()).map(([country, sessions]) => ({ country, sessions })));
      } catch (e: any) {
        setError(e.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>;
  if (error) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--red)' }}>{error}</div>;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>Dashboard</h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Overview of chat proxy activity</p>
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
        <Metric label="Conversations" value={overview?.conversations || 0} />
        <Metric label="Messages" value={overview?.messages || 0} />
        <Metric label="Users" value={overview?.users || 0} />
        <Metric label="Avg Confidence" value={`${Math.round((overview?.avgConfidence || 0) * 100)}%`} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ChartCard title="Conversations / day" />
          <ChartCard title="Messages / day" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ChartCard title="Geo Breakdown">
            <GeoChart data={geoData} />
          </ChartCard>
        </div>
      </div>

      {/* Live sessions + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Active Sessions</h3>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--heading)' }}>{live.length}</div>
          <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Currently active</p>
        </div>
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Recent Activity</h3>
          {activity.length === 0 && <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>No recent activity</p>}
          {activity.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, marginBottom: 10 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: item.agent === 'general' ? 'var(--blue)' :
                  item.agent === 'schema' ? 'var(--purple)' :
                  item.agent === 'code' ? 'var(--green)' : 'var(--amber)'
              }} />
              <span style={{ width: 36, color: 'var(--text-muted)', fontSize: 10, fontWeight: 500, flexShrink: 0 }}>
                {timeAgo(item.timestamp)}
              </span>
              <span style={{
                padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600,
                background: 'var(--blue-bg)', color: 'var(--blue)'
              }}>
                {item.agent}
              </span>
              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                {item.query}
              </span>
            </div>
          ))}
        </div>
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

function ChartCard({ title, children }: { title: string; children?: React.ReactNode }): React.ReactElement {
  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '18px 20px 14px' }}>
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>{title}</div>
      {children || <div style={{ height: 80 }} />}
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}
