import React, {type ReactNode, useState, useRef, useCallback, useEffect} from 'react';
import {useLocation} from '@docusaurus/router';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BrowserOnly from '@docusaurus/BrowserOnly';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutSidebar from '@theme/DocRoot/Layout/Sidebar';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import type {Props} from '@theme/DocRoot/Layout';
import SecondaryNavbar from '@site/src/components/SecondaryNavbar';
import ChatPanel, {ChatProvider} from '@site/src/components/ChatPanel';

import styles from './styles.module.css';

const CHAT_MIN_WIDTH = 260;
const CHAT_MAX_WIDTH = 560;
const CHAT_DEFAULT_WIDTH = 420;
// Collapse sidebar when chat is dragged past this width; restore with hysteresis
const SIDEBAR_COLLAPSE_THRESHOLD = 400;
const SIDEBAR_RESTORE_THRESHOLD = 360;

// Module-level state that persists across remounts (e.g. cross-plugin navigation)
let persistedHiddenContainer = true;
let persistedHidden = true;

export default function DocRootLayout({children}: Props): ReactNode {
  const sidebar = useDocsSidebar();
  const {pathname} = useLocation();

  // Close full-screen chat overlay on navigation
  useEffect(() => {
    setIsChatExpanded(false);
  }, [pathname]);
  const [hiddenSidebarContainer, _setHiddenSidebarContainer] = useState(persistedHiddenContainer);
  const setHiddenSidebarContainer = useCallback((v: boolean | ((prev: boolean) => boolean)) => {
    _setHiddenSidebarContainer(prev => {
      const next = typeof v === 'function' ? v(prev) : v;
      persistedHiddenContainer = next;
      return next;
    });
  }, []);
  const [hiddenSidebar, _setHiddenSidebar] = useState(persistedHidden);
  const setHiddenSidebar = useCallback((v: boolean | ((prev: boolean) => boolean)) => {
    _setHiddenSidebar(prev => {
      const next = typeof v === 'function' ? v(prev) : v;
      persistedHidden = next;
      return next;
    });
  }, []);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  // Track whether we auto-collapsed the sidebar so we can auto-restore it
  const autoCollapsedSidebar = useRef(false);
  // Pending rAF handle — keeps resize updates capped to display refresh rate
  const rafRef = useRef<number | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = chatWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [chatWidth]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    const STEP = 20;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setChatWidth(w => Math.min(CHAT_MAX_WIDTH, w + STEP));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setChatWidth(w => Math.max(CHAT_MIN_WIDTH, w - STEP));
    }
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      // Capture position synchronously — event object may be recycled before rAF fires
      const clientX = e.clientX;
      // Skip if a frame update is already queued — caps work to display refresh rate
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const delta = clientX - startX.current;
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
      });
    };
    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      // Cancel any pending frame so a stale position isn't applied after release
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const {siteConfig} = useDocusaurusContext();
  const chatEndpoint = (siteConfig.customFields?.chatEndpoint as string) || 'http://localhost:8787/chat';

  return (
    <BrowserOnly fallback={<div className={styles.docsWrapper} />}>
      {() => (
        <ChatProvider chatEndpoint={chatEndpoint}>
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
                onKeyDown={onKeyDown}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize chat panel"
                aria-valuenow={chatWidth}
                aria-valuemin={CHAT_MIN_WIDTH}
                aria-valuemax={CHAT_MAX_WIDTH}
                tabIndex={0}
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

              {/* Pane 3: Content — click to collapse sidebar */}
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
              <div
                style={{display: 'contents'}}
                onMouseDown={() => {
                  if (!hiddenSidebarContainer) {
                    setHiddenSidebarContainer(true);
                    setHiddenSidebar(true);
                  }
                }}>
                <DocRootLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>
                  {children}
                </DocRootLayoutMain>
              </div>
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
        </ChatProvider>
      )}
    </BrowserOnly>
  );
}
