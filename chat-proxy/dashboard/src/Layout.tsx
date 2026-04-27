import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings } from 'lucide-react';
import styles from './Layout.module.css';

export default function Layout(): React.ReactElement {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await fetch('/admin/logout', { method: 'POST' });
    navigate('/');
    window.location.reload();
  };

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
        <div className={styles.footer}>
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
