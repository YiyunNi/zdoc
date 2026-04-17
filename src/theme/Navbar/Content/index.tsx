import React, {type ReactNode, useState, useRef, useEffect, useCallback} from 'react';
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
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import {Search, CircleHelp, LogIn, UserPlus, Sparkles} from 'lucide-react';
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

interface SearchResult {
  title: string;
  url: string;
  section?: string;
  snippet?: string;
}

const POPULAR_PAGES: SearchResult[] = [
  {title: 'Getting Started', url: '/docs/create-cluster', section: 'Docs'},
  {title: 'API Reference', url: '/reference/restful', section: 'Reference'},
  {title: 'Python SDK', url: '/reference/python', section: 'Reference'},
  {title: 'Search Guide', url: '/docs/single-vector-search', section: 'Docs'},
];

function SearchModal({onClose}: {onClose: () => void}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {siteConfig} = useDocusaurusContext();
  const location = useLocation();

  const chatEndpoint = (siteConfig.customFields?.chatEndpoint as string) || '/api/chat';
  const searchEndpoint = chatEndpoint.replace(/\/chat$/, '') + '/search';

  // Focus input and handle Escape
  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Debounced search
  const doSearch = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${searchEndpoint}?q=${encodeURIComponent(q.trim())}`);
        if (res.ok) {
          const data = (await res.json()) as {results?: SearchResult[]};
          setResults(data.results || []);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [searchEndpoint]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1);
    doSearch(val);
  }, [doSearch]);

  // "Ask AI" action
  const askAi = useCallback(() => {
    onClose();
    const isDocsPage = /^\/(docs|reference)(\/|$)/.test(location.pathname);
    if (isDocsPage) {
      document.dispatchEvent(new CustomEvent('open-chat', {detail: {query}}));
    } else {
      window.location.href = `/docs/home?chat=${encodeURIComponent(query)}`;
    }
  }, [query, location.pathname, onClose]);

  // Navigate to a result
  const goTo = useCallback((url: string) => {
    onClose();
    window.location.href = url;
  }, [onClose]);

  // Build the list of selectable items for keyboard nav
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const displayResults = hasQuery ? results : POPULAR_PAGES;
  // Total selectable items: Ask AI row (if query) + results
  const totalItems = (hasQuery ? 1 : 0) + displayResults.length;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex < 0) {
        // No selection: if there's a query, default to Ask AI
        if (hasQuery) askAi();
        return;
      }
      if (hasQuery && activeIndex === 0) {
        askAi();
      } else {
        const resultIndex = hasQuery ? activeIndex - 1 : activeIndex;
        const item = displayResults[resultIndex];
        if (item) goTo(item.url);
      }
    }
  }, [totalItems, activeIndex, hasQuery, askAi, goTo, displayResults]);

  return (
    <div className={styles.searchOverlay} onClick={onClose}>
      <div className={styles.searchModal} onClick={e => e.stopPropagation()}>
        <div className={styles.searchInputRow}>
          <Search className={styles.searchIcon} size={18} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search documentation..."
            className={styles.searchInput}
            value={query}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
          />
          <button className={styles.searchClose} onClick={onClose}>ESC</button>
        </div>
        <div className={styles.searchResults}>
          {hasQuery && (
            <button
              className={`${styles.searchResultItem} ${styles.askAiRow} ${activeIndex === 0 ? styles.searchResultActive : ''}`}
              onClick={askAi}
              onMouseEnter={() => setActiveIndex(0)}>
              <Sparkles size={16} />
              <span>Ask AI: &ldquo;{trimmedQuery}&rdquo;</span>
            </button>
          )}
          {loading && (
            <p className={styles.searchLoading}>Searching...</p>
          )}
          {!loading && hasQuery && results.length === 0 && (
            <p className={styles.searchSection}>No results found</p>
          )}
          {!loading && !hasQuery && (
            <p className={styles.searchSection}>Popular pages</p>
          )}
          {!loading && displayResults.map((item, i) => {
            const itemIndex = hasQuery ? i + 1 : i;
            return (
              <button
                key={item.url + i}
                className={`${styles.searchResultItem} ${activeIndex === itemIndex ? styles.searchResultActive : ''}`}
                onClick={() => goTo(item.url)}
                onMouseEnter={() => setActiveIndex(itemIndex)}>
                <div>
                  <span>{item.title}</span>
                  {item.section && (
                    <span className={styles.searchResultMeta}>{item.section}</span>
                  )}
                </div>
                {item.snippet && (
                  <div className={styles.searchResultSnippet}>{item.snippet}</div>
                )}
              </button>
            );
          })}
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
        <button className={styles.searchBtn} onClick={() => setSearchOpen(true)}>
          <Search size={15} />
          <span>Search documentation...</span>
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
