import React, {type ReactNode, useState} from 'react';
import {useLocation, useHistory} from '@docusaurus/router';
import DocSidebar from '@theme-original/DocSidebar';
import type DocSidebarType from '@theme/DocSidebar';
import type {WrapperProps} from '@docusaurus/types';
import type {PropSidebarItemCategory} from '@docusaurus/plugin-content-docs';
import {findFirstSidebarItemLink} from '@docusaurus/plugin-content-docs/client';
import type {IconData} from '@lineiconshq/react-lineicons';
import {
  Rocket5Outlined,
  Database2Outlined,
  Cloud2Outlined,
  Gear1Outlined,
} from '@lineiconshq/free-icons';

import styles from './styles.module.css';

type Props = WrapperProps<typeof DocSidebarType>;

const SECTIONS = [
  {
    label: 'Cloud Guides',
    href: '/intro',
    prefix: null as string | null,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
      </svg>
    ),
  },
  {
    label: 'BYOC Guides',
    href: '/tutorial-basics/create-a-document',
    prefix: '/tutorial-basics',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/>
        <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
      </svg>
    ),
  },
  {
    label: 'API & SDK',
    href: '/tutorial-extras/manage-docs-versions',
    prefix: '/tutorial-extras',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    label: 'CLI',
    href: '/intro',
    prefix: null as string | null,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
      </svg>
    ),
  },
  {
    label: 'Releases',
    href: '/intro',
    prefix: null as string | null,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
];

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/** Same SVG fix as in DocSidebarItem/Category — replaces {color} and //> */
function LineIcon({icon, size = 18}: {icon: IconData; size?: number}) {
  const inner = icon.svg
    .replace(/\{color\}/g, 'currentColor')
    .replace(/\/\/>/g, '/>');
  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill={icon.hasFill ? 'currentColor' : 'none'}
      stroke={icon.hasStroke ? 'currentColor' : 'none'}
      aria-hidden="true"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: inner}}
    />
  );
}

const COLLAPSED_ICONS: {key: string; icon: IconData; label: string}[] = [
  {key: 'quickstarts',    icon: Rocket5Outlined,   label: 'Quickstarts'},
  {key: 'data',           icon: Database2Outlined, label: 'Data'},
  {key: 'infrastructure', icon: Cloud2Outlined,    label: 'Infrastructure'},
  {key: 'administration', icon: Gear1Outlined,     label: 'Administration'},
];

function CollapsedIconColumn({
  onExpand,
  sidebar,
}: {
  onExpand: () => void;
  sidebar: Props['sidebar'];
}): ReactNode {
  const history = useHistory();

  // Build a map of icon key → first link URL from the live sidebar data
  const firstLinks = React.useMemo(() => {
    const map: Record<string, string | undefined> = {};
    for (const item of sidebar) {
      if (item.type === 'category') {
        const key = (item as PropSidebarItemCategory).customProps?.icon as string | undefined;
        if (key) {
          map[key] = findFirstSidebarItemLink(item as PropSidebarItemCategory);
        }
      }
    }
    return map;
  }, [sidebar]);

  const handleIconClick = (key: string) => {
    const href = firstLinks[key];
    if (href) {
      history.push(href);
    }
    onExpand();
  };

  return (
    <div className={styles.collapsedColumn}>
      <div className={styles.collapsedHeader}>
        <button
          type="button"
          className={styles.expandIconButton}
          onClick={onExpand}
          title="Expand sidebar"
          aria-label="Expand sidebar">
          <ChevronRight />
        </button>
      </div>
      <div className={styles.collapsedIcons}>
        {COLLAPSED_ICONS.map(({key, icon, label}) => (
          <button
            key={key}
            type="button"
            className={styles.collapsedIconBtn}
            onClick={() => handleIconClick(key)}
            title={label}
            aria-label={label}>
            <LineIcon icon={icon} size={18} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductDropdown({onCollapse}: {onCollapse?: () => void}): ReactNode {
  const {pathname} = useLocation();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const active =
    SECTIONS.find(s => s.prefix && (pathname === s.prefix || pathname.startsWith(s.prefix + '/'))) ??
    SECTIONS[0];

  return (
    <div className={styles.dropdownWrapper}>
      <button
        type="button"
        className={styles.dropdownTrigger}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}>
        <span className={styles.dropdownTriggerInner}>
          {active.icon}
          {active.label}
        </span>
        <ChevronDown />
      </button>

      {onCollapse && (
        <button
          type="button"
          className={styles.collapseButton}
          onClick={onCollapse}
          title="Collapse sidebar"
          aria-label="Collapse sidebar">
          <ChevronLeft />
        </button>
      )}

      {open && (
        <>
          <div className={styles.dropdownBackdrop} onClick={() => setOpen(false)} />
          <div className={styles.dropdownMenu}>
            {SECTIONS.map(s => (
              <button
                key={s.label}
                type="button"
                className={`${styles.dropdownItem} ${s.label === active.label ? styles.dropdownItemActive : ''}`}
                onClick={() => {
                  history.push(s.href);
                  setOpen(false);
                }}>
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function DocSidebarWrapper(props: Props): ReactNode {
  if (props.isHidden) {
    return <CollapsedIconColumn onExpand={props.onCollapse!} sidebar={props.sidebar} />;
  }

  return (
    <>
      <ProductDropdown onCollapse={props.onCollapse} />
      <div className={styles.sidebarScroll}>
        <DocSidebar {...props} />
      </div>
    </>
  );
}
