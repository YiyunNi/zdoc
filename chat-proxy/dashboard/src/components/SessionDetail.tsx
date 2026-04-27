import React from 'react';

interface SessionDetailProps {
  sessionId: string | null;
  users: Array<{
    userId: string;
    sessions: Array<{ firstQuestion: string; agent: string; messageCount: number; createdAt: string }>;
  }>;
}

export default function SessionDetail({ sessionId, users }: SessionDetailProps): React.ReactElement {
  if (!sessionId) {
    return (
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
        Select a session to view details
      </div>
    );
  }

  const [userId, indexStr] = sessionId.split('__');
  const sessionIndex = parseInt(indexStr, 10);
  const user = users.find(u => u.userId === userId);
  const session = user?.sessions[sessionIndex];

  if (!session) {
    return (
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
        Session not found
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 20 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Session Detail</h3>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
        <strong>Agent:</strong> {session.agent || 'general'}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
        <strong>Messages:</strong> {session.messageCount}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
        <strong>Created:</strong> {session.createdAt}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
        <strong>First question:</strong> {session.firstQuestion || '(no question)'}
      </div>
    </div>
  );
}
