import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import styles from './UsersList.module.css';

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

interface UsersListProps {
  users: User[];
  selectedSessionId: string | null;
  onSelectSession: (userId: string, sessionIndex: number) => void;
}

export default function UsersList({ users, selectedSessionId, onSelectSession }: UsersListProps): React.ReactElement {
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const toggleUser = (userId: string) => {
    setExpandedUserId(prev => prev === userId ? null : userId);
  };

  return (
    <div className={styles.list}>
      {users.map(u => {
        const expanded = u.userId === expandedUserId;
        const meta = u.userMeta || {};
        const chips: string[] = [];
        if (meta.country || meta.city) chips.push(`${[meta.city, meta.country].filter(Boolean).join(', ')}`);
        if (meta.language) chips.push(meta.language);

        return (
          <div key={u.userId} className={`${styles.userRow} ${expanded ? styles.expanded : ''}`}>
            <div className={styles.userTop} onClick={() => toggleUser(u.userId)}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>{avatarInitials(u.userId)}</div>
                <div>
                  <div className={styles.userId}>{shortId(u.userId, 8)}</div>
                  <div className={styles.lastActive}>last active {timeAgo(u.lastActive)}</div>
                </div>
              </div>
              <div className={styles.userStats}>
                <div><strong>{u.sessionCount}</strong> sessions</div>
                <div><strong>{formatDuration(u.avgDurationSeconds)}</strong> avg</div>
              </div>
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>

            {chips.length > 0 && (
              <div className={styles.chips}>
                {chips.map((c, i) => <span key={i} className={styles.chip}>{c}</span>)}
              </div>
            )}

            {u.topics.length > 0 && (
              <div className={styles.topics}>
                {u.topics.map((t, i) => <div key={i} className={styles.topic}>{t}</div>)}
              </div>
            )}

            {expanded && (
              <div className={styles.sessions}>
                {u.sessions.map((s, i) => {
                  const sid = `${u.userId}__${i}`;
                  const active = sid === selectedSessionId;
                  return (
                    <div
                      key={i}
                      className={`${styles.sessionRow} ${active ? styles.sessionActive : ''}`}
                      onClick={() => onSelectSession(u.userId, i)}
                    >
                      <span className={`${styles.agentBadge} ${styles[`agent_${s.agent || 'general'}`]}`}>
                        {s.agent || 'general'}
                      </span>
                      <span className={styles.sessionQ}>{s.firstQuestion || '(no question)'}</span>
                      <span className={styles.sessionMeta}>{s.messageCount} msg &middot; {timeAgo(s.createdAt)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function avatarInitials(userId: string): string {
  return userId.slice(0, 2).toUpperCase();
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

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}
