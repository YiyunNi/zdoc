import React, {useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ICONS from '../../utils/navIcons';
import {useDropdownClose} from '../../utils/useDropdownClose';
import styles from './styles.module.css';

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href?: string;
  prefix: string | null;
  icon: string;
  hidden?: boolean;
  items?: NavItem[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/** Returns the prefix of the most-specific matching section, or null if none. */
function findActivePrefixes(items: NavItem[], pathname: string): Set<string> {
  // Collect all leaf-level items (expand children)
  const leaves: NavItem[] = [];
  for (const item of items) {
    if (item.hidden) continue;
    if (item.items?.length) {
      leaves.push(...item.items);
    } else {
      leaves.push(item);
    }
  }

  // Find the longest matching prefix
  let best: NavItem | null = null;
  for (const leaf of leaves) {
    if (!leaf.prefix) continue;
    const matches = pathname === leaf.prefix || pathname.startsWith(leaf.prefix + '/');
    if (!matches) continue;
    if (!best || leaf.prefix.length > (best.prefix?.length ?? 0)) {
      best = leaf;
    }
  }

  const active = new Set<string>();
  if (best?.prefix) active.add(best.prefix);
  return active;
}

// ── Dropdown nav item ─────────────────────────────────────────────────────────

function DropdownItem({item, activePrefixes}: {item: NavItem; activePrefixes: Set<string>}): React.ReactElement {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isParentActive = item.items?.some(
    child => child.prefix && activePrefixes.has(child.prefix),
  ) ?? false;

  useDropdownClose(open, setOpen, wrapperRef);

  return (
    <div ref={wrapperRef} className={styles.dropdownWrapper}>
      <button
        type="button"
        className={`${styles.item} ${styles.dropdownButton} ${isParentActive ? styles.itemActive : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}>
        {item.icon && ICONS[item.icon]}
        {item.label}
        <span className={styles.chevron}><ChevronDown /></span>
      </button>

      {open && (
        <div className={styles.dropdownPanel} role="menu">
          {item.items?.map(child => {
            const isActive = child.prefix ? activePrefixes.has(child.prefix) : false;
            return (
              <Link
                key={child.href ?? child.label}
                to={child.href!}
                role="menuitem"
                className={`${styles.dropdownPanelItem} ${isActive ? styles.dropdownPanelItemActive : ''}`}
                onClick={() => setOpen(false)}>
                {child.icon && ICONS[child.icon]}
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SecondaryNavbar(): React.ReactElement {
  const {pathname} = useLocation();
  const {siteConfig} = useDocusaurusContext();
  const navItems = (siteConfig.customFields?.secondaryNavbar ?? []) as NavItem[];

  const visibleItems = navItems.filter(item => !item.hidden);
  const activePrefixes = findActivePrefixes(navItems, pathname);

  return (
    <div className={styles.secondaryNavbar}>
      <div className={styles.items}>
        {visibleItems.map(item => {
          if (item.items?.length) {
            return <DropdownItem key={item.label} item={item} activePrefixes={activePrefixes} />;
          }

          const isActive = item.prefix
            ? activePrefixes.has(item.prefix)
            : activePrefixes.size === 0;

          return (
            <Link
              key={(item.href ?? '') + item.label}
              to={item.href!}
              className={`${styles.item} ${isActive ? styles.itemActive : ''}`}>
              {item.icon && ICONS[item.icon]}
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
