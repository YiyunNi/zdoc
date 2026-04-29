import React, {type ReactNode} from 'react';
import {Sparkles} from 'lucide-react';
import ResultItem from './ResultItem';
import RecentSearches from './RecentSearches';
import type {ResultItemData} from './ResultItem';
import styles from './styles.module.css';

interface Props {
  query: string;
  results: ResultItemData[];
  loading: boolean;
  activeIndex: number;
  recentSearches: string[];
  onSelectResult: (url: string) => void;
  onSelectRecent: (query: string) => void;
  onRemoveRecent: (query: string) => void;
  onClearRecent: () => void;
  onAskAi: () => void;
  onSetActive: (index: number) => void;
}

export default function SearchResults({
  query,
  results,
  loading,
  activeIndex,
  recentSearches,
  onSelectResult,
  onSelectRecent,
  onRemoveRecent,
  onClearRecent,
  onAskAi,
  onSetActive,
}: Props): ReactNode {
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const askAiIndex = hasQuery ? 0 : -1;
  const resultOffset = hasQuery ? 1 : 0;

  return (
    <div className={styles.searchResults}>
      {!hasQuery && (
        <RecentSearches
          items={recentSearches}
          onSelect={onSelectRecent}
          onRemove={onRemoveRecent}
          onClear={onClearRecent}
        />
      )}

      {hasQuery && (
        <button
          type="button"
          className={`${styles.searchResultItem} ${styles.askAiRow} ${activeIndex === askAiIndex ? styles.searchResultActive : ''}`}
          onClick={onAskAi}
          onMouseEnter={() => onSetActive(askAiIndex)}>
          <Sparkles size={16} />
          <span>Ask AI: &ldquo;{trimmedQuery}&rdquo;</span>
        </button>
      )}

      {loading && <p className={styles.searchLoading}>Searching...</p>}

      {!loading && hasQuery && results.length === 0 && (
        <p className={styles.noResults}>No results found for &ldquo;{trimmedQuery}&rdquo;</p>
      )}

      {!loading && !hasQuery && results.length === 0 && (
        <p className={styles.searchSection}>Popular pages</p>
      )}

      {!loading &&
        results.map((item, i) => {
          const idx = i + resultOffset;
          return (
            <ResultItem
              key={item.url + i}
              item={item}
              active={activeIndex === idx}
              onClick={() => onSelectResult(item.url)}
              onMouseEnter={() => onSetActive(idx)}
            />
          );
        })}

      <div className={styles.searchFooter}>
        <span>
          <kbd>Enter</kbd> to select
        </span>
        <span>
          <kbd>&uarr;</kbd>
          <kbd>&darr;</kbd> to navigate
        </span>
        <span>
          <kbd>ESC</kbd> to close
        </span>
      </div>
    </div>
  );
}
