import React, {useState, useCallback, type ReactNode} from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {useWindowSize} from '@docusaurus/theme-common';
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

  const [tocVisible, setTocVisible] = useState(true);
  const toggleTOC = useCallback(() => setTocVisible(v => !v), []);

  return (
    <div className={styles.docItemContainer}>
      <ContentVisibility metadata={metadata} />
      <DocVersionBanner />
      <div className={styles.docItemRow}>
        <div className={`${styles.docItemCol} ${showDesktopTOC && !tocVisible ? styles.docItemColWide : ''}`}>
          <article>
            <DocBreadcrumbs />
            {hasTOC && windowSize === 'mobile' && <DocItemTOCMobile />}
            <DocVersionBadge />
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
        </div>
        {showDesktopTOC && (
          <div className={`${styles.tocCol} ${!tocVisible ? styles.tocColCollapsed : ''}`}>
            <button
              type="button"
              className={styles.tocToggleBtn}
              onClick={toggleTOC}
              title={tocVisible ? 'Hide table of contents' : 'Show table of contents'}
              aria-label={tocVisible ? 'Hide table of contents' : 'Show table of contents'}>
              <TOCToggleIcon />
            </button>
            {tocVisible && <DocItemTOCDesktop />}
          </div>
        )}
      </div>
    </div>
  );
}
