import React, {type ReactNode, useState, useRef, useEffect} from 'react';
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

function SearchModal({onClose}: {onClose: () => void}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className={styles.searchOverlay} onClick={onClose}>
      <div className={styles.searchModal} onClick={e => e.stopPropagation()}>
        <div className={styles.searchInputRow}>
          <Search className={styles.searchIcon} size={18} />
          <input ref={inputRef} type="text" placeholder="Search documentation..." className={styles.searchInput} />
          <button className={styles.searchClose} onClick={onClose}>ESC</button>
        </div>
        <div className={styles.searchResults}>
          <p className={styles.searchSection}>Popular pages</p>
          {['Getting Started', 'API Reference', 'Installation', 'Examples'].map(p => (
            <button key={p} className={styles.searchResultItem}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
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

  return (
    <div className={styles.navbarInner}>
      {/* Left: mobile toggle + logo */}
      <div className={styles.navbarLeft}>
        {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
        <NavbarLogo />
      </div>

      {/* Center: search */}
      <div className={styles.navbarCenter}>
        <button className={styles.searchBtn} onClick={() => setSearchOpen(true)}>
          <Search size={15} />
          <span>Search documentation...</span>
        </button>
      </div>

      {/* Right: nav items with icons */}
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
      </div>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
