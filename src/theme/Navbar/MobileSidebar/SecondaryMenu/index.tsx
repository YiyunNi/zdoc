import React, {type ReactNode} from 'react';
import {useNavbarSecondaryMenu} from '@docusaurus/theme-common/internal';

function IconSearch() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconSupport() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function IconLogIn() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}

function IconSignUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

function MobileActionToolbar() {
  function openSearch() {
    document.dispatchEvent(new CustomEvent('open-mobile-search'));
  }

  return (
    <>
      <button
        type="button"
        className="mobile-action-search clean-btn"
        onClick={openSearch}
        aria-label="Search documentation">
        <IconSearch />
        <span>Search documentation…</span>
      </button>
    </>
  );
}

function MobileActionLinks() {
  return (
    <div className="mobile-action-links">
      <a
        href="https://support.zilliz.com/hc/en-us"
        className="mobile-action-link"
        target="_blank"
        rel="noopener noreferrer">
        <IconSupport />
        Support
      </a>
      <a
        href="https://cloud.zilliz.com/login"
        className="mobile-action-link"
        target="_blank"
        rel="noopener noreferrer">
        <IconLogIn />
        Log In
      </a>
      <a
        href="https://cloud.zilliz.com/signup"
        className="mobile-action-link mobile-action-link--primary"
        target="_blank"
        rel="noopener noreferrer">
        <IconSignUp />
        Sign Up Free
      </a>
    </div>
  );
}

export default function NavbarMobileSidebarSecondaryMenu(): ReactNode {
  const secondaryMenu = useNavbarSecondaryMenu();
  return (
    <div className="mobile-secondary-menu-wrapper">
      <MobileActionToolbar />
      <div className="mobile-secondary-menu-content">
        {secondaryMenu.content}
      </div>
      <MobileActionLinks />
    </div>
  );
}
