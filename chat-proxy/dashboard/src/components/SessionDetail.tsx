import React, { useEffect, useState } from 'react';
import { ChatMessageBubble } from '@zdoc/chat-ui';
import type { ChatMessage } from '@zdoc/chat-ui';
import { api } from '../api';
import styles from './SessionDetail.module.css';

interface Session {
  firstQuestion: string;
  agent: string;
  messageCount: number;
  createdAt: string;
}

interface User {
  userId: string;
  sessions: Session[];
}

interface SessionDetailProps {
  sessionId: string | null;
  users: User[];
}

interface ApiEvent {
  type: string;
  timestamp: string;
  agent?: string;
  model?: string;
  totalTokens?: number;
  data?: {
    role?: 'user' | 'assistant';
    content?: string;
    answer?: string;
    confidence?: 'high' | 'medium' | 'low';
    sources?: Array<{ title: string; url: string; section?: string }>;
  };
}

interface SessionApiResponse {
  sessionId: string;
  events: ApiEvent[];
  messages?: ChatMessage[];
}

export default function SessionDetail({ sessionId, users }: SessionDetailProps): React.ReactElement {
  const [data, setData] = useState<SessionApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setData(null);
      return;
    }
    async function fetchSession() {
      setLoading(true);
      setError('');
      try {
        const res = await api.getSession(sessionId!);
        setData(res);
      } catch (e: any) {
        setError(e.message || 'Failed to load session');
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className={styles.detail}>
        <div className={styles.empty}>Expand a user and select a session to view the conversation</div>
      </div>
    );
  }

  const [userId, sessionIndexStr] = sessionId.split('__');
  const sessionIndex = parseInt(sessionIndexStr, 10);
  const user = users.find(u => u.userId === userId);
  const session = user?.sessions[sessionIndex];

  const agent = data?.events?.[0]?.agent || session?.agent || 'general';
  const model = data?.events?.[0]?.model || '';

  // Transform API response to ChatMessage[]
  const messages: ChatMessage[] = React.useMemo(() => {
    if (!data) return [];
    if (data.messages) return data.messages;

    return data.events
      .filter(e => e.type === 'message')
      .map(e => ({
        role: e.data?.role || 'assistant',
        text: e.data?.content || e.data?.answer || '',
        confidence: e.data?.confidence,
        sources: e.data?.sources,
      }));
  }, [data]);

  const totalTokens = data?.events?.reduce((sum, e) => sum + (e.totalTokens || 0), 0) || 0;

  return (
    <div className={styles.detail}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerInfo}>
            <span className={styles.detailId}>{shortId(sessionId, 8)}</span>
            <span className={`${styles.agentBadge} ${styles[`agent_${agent}`]}`}>{agent}</span>
            {model && <span className={styles.model}>{model}</span>}
          </div>
          <span className={styles.time}>{data?.events?.[0]?.timestamp ? timeAgo(data.events[0].timestamp) : ''}</span>
        </div>
        <div className={styles.stats}>
          <div><strong>{messages.length}</strong> messages</div>
          <div><strong>{formatTokens(totalTokens)}</strong> tokens</div>
          <div>User: <strong>{shortId(userId, 6)}</strong></div>
        </div>
      </div>

      <div className={styles.body}>
        {loading && <div className={styles.empty}>Loading conversation…</div>}
        {error && <div className={styles.empty} style={{ color: 'var(--red)' }}>{error}</div>}
        {!loading && !error && messages.length === 0 && <div className={styles.empty}>No messages in this session</div>}
        {!loading && !error && messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            {i > 0 && msg.role === 'user' && (
              <div className={styles.timeline}>
                <div className={styles.timelineDot} />
                <span>{data?.events?.[i]?.timestamp ? timeAgo(data.events[i].timestamp) : ''}</span>
              </div>
            )}
            <ChatMessageBubble message={msg} />
          </div>
        ))}
      </div>
    </div>
  );
}

function shortId(id: string, len: number): string {
  if (id.length <= len) return id;
  return id.slice(0, len) + '…';
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}
