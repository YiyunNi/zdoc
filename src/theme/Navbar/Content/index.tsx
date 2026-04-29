import React, {type ReactNode, useState, useEffect} from 'react';
import {
  useThemeConfig,
  ErrorCauseBoundary,
} from '@docusaurus/theme-common';
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import NavbarItem, {type Props as NavbarItemConfig} from '@theme/NavbarItem';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarLogo from '@theme/Navbar/Logo';
import {Search, CircleHelp, LogIn, UserPlus} from 'lucide-react';
import SearchModal from '../../../theme/Search';
import styles from './styles.module.css';

function useNavbarItems() {
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

function NavbarItems({items}: {items: NavbarItemConfig[]}): ReactNode {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.\nPlease double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:\n${JSON.stringify(item, null, 2)}`,
              {cause: error},
            )
          }>
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

function isMac() {
  return typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

export default function NavbarContent(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useNavbarItems();
  const [, rightItems] = splitNavbarItems(items);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = () => setSearchOpen(true);
    document.addEventListener('open-mobile-search', handler);
    return () => document.removeEventListener('open-mobile-search', handler);
  }, []);

  // Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className={styles.navbarInner}>
      {/* Left: logo */}
      <div className={styles.navbarLeft}>
        <NavbarLogo />
      </div>

      {/* Center: search */}
      <div className={styles.navbarCenter}>
        <button className={styles.searchBtn} onClick={() => setSearchOpen(true)} type="button">
          <Search size={15} />
          <span>Search documentation...</span>
          <span className={styles.searchShortcut}>{isMac() ? '⌘K' : 'Ctrl+K'}</span>
        </button>
      </div>

      {/* Right: nav items with icons + mobile toggle */}
      <div className={styles.navbarRight}>
        <a href="https://support.zilliz.com/hc/en-us" className="navbar-support-link" target="_blank" rel="noopener noreferrer">
          <CircleHelp size={14} aria-hidden="true" />
          Support
        </a>
        <a href="https://cloud.zilliz.com/login" className="navbar-login-link" target="_blank" rel="noopener noreferrer">
          <LogIn size={14} aria-hidden="true" />
          Log In
        </a>
        <a href="https://cloud.zilliz.com/signup" className="navbar-signup-btn" target="_blank" rel="noopener noreferrer">
          <UserPlus size={14} aria-hidden="true" />
          Sign Up Free
        </a>
        {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
      </div>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
