import React, {useState, useCallback, type ReactNode} from 'react';
import {useDoc, useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import {useWindowSize} from '@docusaurus/theme-common';
import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemContent from '@theme/DocItem/Content';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import type {Props} from '@theme/DocItem/Layout';
import styles from './styles.module.css';

// Track whether the TOC has ever been expanded (persists across remounts)
let hasEverExpandedTOC = false;

/** Recursively walks the sidebar tree and returns the label of the category
 *  that directly contains the given pathname. */
function findParentLabel(
  items: PropSidebarItem[],
  pathname: string,
  parentLabel: string | null = null,
): string | null {
  const normalize = (p: string) => p.replace(/\/$/, '');
  const norm = normalize(pathname);
  for (const item of items) {
    if (item.type === 'link') {
      if (normalize(item.href) === norm) return parentLabel;
    } else if (item.type === 'category') {
      if (item.href && normalize(item.href) === norm) return parentLabel;
      const found = findParentLabel(item.items, pathname, item.label);
      if (found !== null) return found;
    }
  }
  return null;
}

function ParentCategoryLabel(): ReactNode {
  const sidebar = useDocsSidebar();
  const {pathname} = useLocation();
  if (!sidebar) return null;
  const label = findParentLabel(sidebar.items, pathname);
  if (!label) return null;
  return <div className={styles.parentLabel}>{label}</div>;
}

function TOCToggleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="16" y2="12" />
      <line x1="3" y1="18" x2="11" y2="18" />
    </svg>
  );
}

export default function DocItemLayout({children}: Props): ReactNode {
  const {frontMatter, metadata, toc} = useDoc();
  const windowSize = useWindowSize();
  const hasTOC = toc.length > 0 && frontMatter.hide_table_of_contents !== true;
  const showDesktopTOC = hasTOC && windowSize !== 'mobile';

  const [tocVisible, setTocVisible] = useState(false);
  const [showTocToast, setShowTocToast] = useState(!hasEverExpandedTOC);
  const toggleTOC = useCallback(() => {
    setTocVisible(v => {
      if (!v) {
        // Expanding TOC — dismiss toast permanently
        hasEverExpandedTOC = true;
        setShowTocToast(false);
      }
      return !v;
    });
  }, []);

  return (
    <div className={styles.docItemContainer}>
      <ContentVisibility metadata={metadata} />
      <DocVersionBanner />
      <div className={styles.docItemRow}>
        <div className={`${styles.docItemCol} ${!showDesktopTOC || !tocVisible ? styles.docItemColWide : ''}`}>
          <article>
            <DocBreadcrumbs />
            {hasTOC && windowSize === 'mobile' && <DocItemTOCMobile />}
            <DocVersionBadge />
            <ParentCategoryLabel />
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
        </div>
        {showDesktopTOC && (
          <div className={`${styles.tocCol} ${!tocVisible ? styles.tocColCollapsed : ''}`}>
            <div style={{position: 'relative', display: 'inline-flex'}}>
              <button
                type="button"
                className={styles.tocToggleBtn}
                onClick={toggleTOC}
                title={tocVisible ? 'Hide table of contents' : 'Show table of contents'}
                aria-label={tocVisible ? 'Hide table of contents' : 'Show table of contents'}>
                <TOCToggleIcon />
                {tocVisible && <span className={styles.tocToggleLabel}>On this page</span>}
              </button>
              {showTocToast && !tocVisible && (
                <span className={styles.tocToast}>On this page</span>
              )}
            </div>
            {tocVisible && <DocItemTOCDesktop />}
          </div>
        )}
      </div>
    </div>
  );
}
