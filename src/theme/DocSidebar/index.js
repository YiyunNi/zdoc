import React, { useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import DocSidebar from '@theme-original/DocSidebar';

/**
 * Finds the deepest active link in the sidebar (leaf node preferred).
 */
function findActiveLink(container) {
  const activeLinks = container.querySelectorAll('.menu__link--active');
  if (activeLinks.length === 0) return null;

  let target = activeLinks[0];
  activeLinks.forEach((link) => {
    // Prefer leaf nodes — links whose parent <li> has no nested submenu
    if (!link.closest('li')?.querySelector(':scope > .menu__list')) {
      target = link;
    }
  });
  return target;
}

/**
 * Scrolls the sidebar container so the active link is vertically centered.
 * Only scrolls the sidebar's own scroll container — never the page.
 */
function scrollToActiveLink(scrollContainer) {
  const target = findActiveLink(scrollContainer);
  if (!target) return;

  const containerRect = scrollContainer.getBoundingClientRect();
  const linkRect = target.getBoundingClientRect();

  // How far the link is from the top of the scrollable content
  const offsetInContainer =
    linkRect.top - containerRect.top + scrollContainer.scrollTop;

  // Target scrollTop to center the link vertically
  const centeredScrollTop =
    offsetInContainer - containerRect.height / 2 + linkRect.height / 2;

  scrollContainer.scrollTo({
    top: Math.max(0, centeredScrollTop),
    behavior: 'smooth',
  });
}

export default function DocSidebarWrapper(props) {
  const location = useLocation();
  const sidebarRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let scrolled = false;
    let observer = null;
    const timers = [];

    const attemptScroll = () => {
      if (cancelled || scrolled) return;

      // The sidebar's actual scroll container is the <nav class="menu"> element
      const scrollContainer = document.querySelector(
        '.theme-doc-sidebar-container nav.menu'
      );
      if (!scrollContainer) return;
      if (!findActiveLink(scrollContainer)) return;

      scrolled = true;
      observer?.disconnect();
      scrollToActiveLink(scrollContainer);
    };

    // Strategy 1: Try after next paint + small delay (covers fast renders)
    const raf = requestAnimationFrame(() => {
      const t = setTimeout(attemptScroll, 60);
      timers.push(t);
    });

    // Strategy 2: Watch for class changes in case Docusaurus applies
    // active classes asynchronously (e.g. lazy-loaded sidebar items)
    const container = document.querySelector(
      '.theme-doc-sidebar-container nav.menu'
    );
    if (container) {
      observer = new MutationObserver(attemptScroll);
      observer.observe(container, {
        attributes: true,
        attributeFilter: ['class'],
        subtree: true,
      });
      // Safety: stop observing after 3s regardless
      const t = setTimeout(() => observer?.disconnect(), 3000);
      timers.push(t);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      observer?.disconnect();
    };
  }, [location.pathname]);

  return <DocSidebar {...props} ref={sidebarRef} />;
}
