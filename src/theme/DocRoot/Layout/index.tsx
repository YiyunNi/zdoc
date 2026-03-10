import React, {type ReactNode, useState, useRef, useCallback, useEffect} from 'react';
import {useLocation} from '@docusaurus/router';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutSidebar from '@theme/DocRoot/Layout/Sidebar';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import type {Props} from '@theme/DocRoot/Layout';
import SecondaryNavbar from '@site/src/components/SecondaryNavbar';
import ChatPanel from '@site/src/components/ChatPanel';

import styles from './styles.module.css';

const CHAT_MIN_WIDTH = 260;
const CHAT_MAX_WIDTH = 560;
const CHAT_DEFAULT_WIDTH = 320;
// Collapse sidebar when chat is dragged past this width; restore with hysteresis
const SIDEBAR_COLLAPSE_THRESHOLD = 400;
const SIDEBAR_RESTORE_THRESHOLD = 360;

export default function DocRootLayout({children}: Props): ReactNode {
  const sidebar = useDocsSidebar();
  const {pathname} = useLocation();

  // Close full-screen chat overlay on navigation
  useEffect(() => {
    setIsChatExpanded(false);
  }, [pathname]);
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  const [hiddenSidebar, setHiddenSidebar] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  // Track whether we auto-collapsed the sidebar so we can auto-restore it
  const autoCollapsedSidebar = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = chatWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [chatWidth]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = e.clientX - startX.current;
      const next = Math.min(CHAT_MAX_WIDTH, Math.max(CHAT_MIN_WIDTH, startWidth.current + delta));
      setChatWidth(next);

      setHiddenSidebarContainer(prev => {
        if (next >= SIDEBAR_COLLAPSE_THRESHOLD && !prev) {
          autoCollapsedSidebar.current = true;
          return true;
        }
        if (next <= SIDEBAR_RESTORE_THRESHOLD && prev && autoCollapsedSidebar.current) {
          autoCollapsedSidebar.current = false;
          setHiddenSidebar(false);
          return false;
        }
        return prev;
      });
    };
    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className={styles.docsWrapper}>
      <BackToTopButton />

      {/* Secondary navbar — full width, above 3-pane area */}
      <SecondaryNavbar />

      {/* 3-pane content area */}
      <div className={styles.docRoot}>
        {/* Pane 1: Chat */}
        <div className={styles.chatPane} style={{width: chatWidth, minWidth: CHAT_MIN_WIDTH}}>
          <ChatPanel
            isExpanded={false}
            onToggle={() => setIsChatExpanded(true)}
          />
        </div>

        {/* Drag-to-resize handle between chat and sidebar */}
        <div
          className={styles.chatResizeHandle}
          onMouseDown={onMouseDown}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize chat panel"
        />

        {/* Pane 2: Sidebar */}
        {sidebar && (
          <DocRootLayoutSidebar
            sidebar={sidebar.items}
            hiddenSidebarContainer={hiddenSidebarContainer}
            setHiddenSidebarContainer={setHiddenSidebarContainer}
            hiddenSidebar={hiddenSidebar}
            setHiddenSidebar={setHiddenSidebar}
          />
        )}

        {/* Pane 3: Content */}
        <DocRootLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>
          {children}
        </DocRootLayoutMain>
      </div>

      {/* Expanded chat overlay */}
      {isChatExpanded && (
        <div className={styles.chatOverlay}>
          <ChatPanel
            isExpanded={true}
            onToggle={() => setIsChatExpanded(false)}
          />
        </div>
      )}

      {/* Mobile chat FAB */}
      <button
        className={styles.mobileChatFab}
        onClick={() => setIsChatExpanded(prev => !prev)}
        title={isChatExpanded ? 'Close chat' : 'Open chat'}
        aria-label={isChatExpanded ? 'Close chat' : 'Open chat'}>
        {isChatExpanded ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
