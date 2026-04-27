import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useLiveStatus } from './hooks/useLiveStatus';
import LoginCover from './components/LoginCover';
import styles from './Layout.module.css';

export default function Layout(): React.ReactElement {
  const navigate = useNavigate();
  const { auth, loading } = useAuth();
  const { live, ok } = useLiveStatus();

  const handleSignOut = async () => {
    localStorage.removeItem('admin_api_key');
    await fetch('/admin/logout', { method: 'POST' });
    navigate('/');
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading…
      </div>
    );
  }

  if (!auth) {
    return <LoginCover />;
  }

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h1>Chat Proxy</h1>
          <p>Admin Dashboard</p>
        </div>
        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`} end>
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <Users size={14} />
            <span>Users & Sessions</span>
          </NavLink>
          <NavLink to="/costs" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <Settings size={14} />
            <span>Costs & Settings</span>
          </NavLink>
        </nav>
        <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--blue-bg)', color: 'var(--blue)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
            }}>
              {auth.user?.name ? auth.user.name[0].toUpperCase() : 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {auth.user?.name || 'Admin'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                {auth.role} · {auth.method}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: ok ? 'var(--green)' : 'var(--red)',
            }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {live} active · {ok ? 'live' : 'down'}
            </span>
          </div>
          <button className={styles.signoutBtn} onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
