import React, {type ReactNode, useState} from 'react';
import {useLocation, useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import DocSidebar from '@theme-original/DocSidebar';
import type DocSidebarType from '@theme/DocSidebar';
import type {WrapperProps} from '@docusaurus/types';
import type {PropSidebarItemCategory} from '@docusaurus/plugin-content-docs';
import {findFirstSidebarItemLink} from '@docusaurus/plugin-content-docs/client';
import {
  Rocket5Outlined,
  Database2Outlined,
  Layers1Outlined,
  Cloud2Outlined,
  CloudUploadOutlined,
  Gear1Outlined,
  QuestionMarkCircleOutlined,
  Search1Outlined,
  // Reference sidebar icons
  Key1Outlined,
  Code1Outlined,
  Gears3Outlined,
  Slice2Outlined,
  VectorNodes6Outlined,
  VectorNodes7Outlined,
  Upload1Outlined,
  StorageHdd2Outlined,
  VectorizeraiOutlined,
  SortHighToLowOutlined,
  // REST-specific icons
  Globe1Outlined,
  SyncOutlined,
  Folder1Outlined,
  RefreshCircle1ClockwiseOutlined,
  BoxArchive1Outlined,
  BarChart4Outlined,
  CalendarDaysOutlined,
  CreditCardMultipleOutlined,
  PieChart2Outlined,
  Shield2Outlined,
  Link2AngularRightOutlined,
  User4Outlined,
  Bookmark1Outlined,
} from '@lineiconshq/free-icons';
import ICONS, {LineIcon} from '../../utils/navIcons';
import {useDropdownClose} from '../../utils/useDropdownClose';
import IconButton from '../../components/IconButton';

import styles from './styles.module.css';

type Props = WrapperProps<typeof DocSidebarType>;

interface NavItem {
  label: string;
  href?: string;
  prefix: string | null;
  icon: string;
  hidden?: boolean;
  items?: NavItem[];
}

/** Flatten secondaryNavbar config into sections for the ProductDropdown.
 *  Items with sub-items (e.g. API & SDK) are expanded into individual sections.
 *  Hidden items are filtered out.
 */
function flattenNavSections(navItems: NavItem[]): NavItem[] {
  return navItems.flatMap(item => {
    if (item.hidden) return [];
    if (item.items?.length) return item.items;
    return [item];
  });
}

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

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

/** All known sidebar section icon keys → icon element.
 *  New section icons should be added here as they appear in sidebar customProps.
 */
const SIDEBAR_ICON_MAP: Record<string, React.ReactNode> = {
  home:           <HomeIcon />,
  quickstarts:    <LineIcon icon={Rocket5Outlined}           size={18} />,
  'deploy-byoc':  <LineIcon icon={CloudUploadOutlined}       size={18} />,
  data:           <LineIcon icon={Database2Outlined}         size={18} />,
  indexes:        <LineIcon icon={Layers1Outlined}           size={18} />,
  search:         <LineIcon icon={Search1Outlined}           size={18} />,
  infrastructure: <LineIcon icon={Cloud2Outlined}            size={18} />,
  administration: <LineIcon icon={Gear1Outlined}             size={18} />,
  faqs:           <LineIcon icon={QuestionMarkCircleOutlined} size={18} />,
  // Reference doc section icons
  auth:            <LineIcon icon={Key1Outlined}           size={18} />,
  'client-code':   <LineIcon icon={Code1Outlined}          size={18} />,
  'collections-ref': <LineIcon icon={Layers1Outlined}      size={18} />,
  'db-ref':        <LineIcon icon={Database2Outlined}      size={18} />,
  mgmt:            <LineIcon icon={Gears3Outlined}         size={18} />,
  partition:       <LineIcon icon={Slice2Outlined}         size={18} />,
  'vector-ref':    <LineIcon icon={VectorizeraiOutlined}   size={18} />,
  'import-ref':    <LineIcon icon={Upload1Outlined}        size={18} />,
  'storage-ref':   <LineIcon icon={StorageHdd2Outlined}    size={18} />,
  'embed-ref':     <LineIcon icon={VectorizeraiOutlined}   size={18} />,
  'rerank-ref':    <LineIcon icon={SortHighToLowOutlined}  size={18} />,
  'cloud-ctrl':    <LineIcon icon={Cloud2Outlined}         size={18} />,
  'data-plane':    <LineIcon icon={VectorNodes7Outlined}   size={18} />,
  // REST API items
  'rest-cloud-meta': <LineIcon icon={Globe1Outlined}                  size={18} />,
  'rest-elt':        <LineIcon icon={SyncOutlined}                    size={18} />,
  'rest-project':    <LineIcon icon={Folder1Outlined}                 size={18} />,
  'rest-cluster':    <LineIcon icon={VectorNodes6Outlined}            size={18} />,
  'rest-migrate':    <LineIcon icon={RefreshCircle1ClockwiseOutlined} size={18} />,
  'rest-backup':     <LineIcon icon={BoxArchive1Outlined}             size={18} />,
  'rest-metrics':    <LineIcon icon={BarChart4Outlined}               size={18} />,
  'rest-job':        <LineIcon icon={CalendarDaysOutlined}            size={18} />,
  'rest-invoices':   <LineIcon icon={CreditCardMultipleOutlined}      size={18} />,
  'rest-usage':      <LineIcon icon={PieChart2Outlined}               size={18} />,
  'rest-role':       <LineIcon icon={Shield2Outlined}                 size={18} />,
  'rest-alias':      <LineIcon icon={Link2AngularRightOutlined}       size={18} />,
  'rest-user':       <LineIcon icon={User4Outlined}                   size={18} />,
  'rest-index':      <LineIcon icon={Bookmark1Outlined}               size={18} />,
};

function CollapsedIconColumn({
  onExpand,
  sidebar,
}: {
  onExpand: () => void;
  sidebar: Props['sidebar'];
}): ReactNode {
  const history = useHistory();

  // Derive icon entries dynamically from the live sidebar, preserving order.
  // Only items with a customProps.icon that exists in SIDEBAR_ICON_MAP are included.
  const iconEntries = React.useMemo(() => {
    const entries: {key: string; label: string; href: string | undefined; icon: React.ReactNode}[] = [];
    for (const item of sidebar) {
      const key = (item as {customProps?: {icon?: string}}).customProps?.icon;
      if (!key || !SIDEBAR_ICON_MAP[key]) continue;
      const label = (item as {label?: string}).label ?? key;
      let href: string | undefined;
      if (item.type === 'category') {
        href = findFirstSidebarItemLink(item as PropSidebarItemCategory);
      } else if (item.type === 'link') {
        href = (item as {href: string}).href;
      }
      entries.push({key, label, href, icon: SIDEBAR_ICON_MAP[key]});
    }
    return entries;
  }, [sidebar]);

  return (
    <div className={styles.collapsedColumn}>
      <div className={styles.collapsedHeader}>
        <IconButton
          size="sm"
          variant="outlined"
          onClick={onExpand}
          title="Expand sidebar"
          aria-label="Expand sidebar">
          <ChevronRight />
        </IconButton>
      </div>
      <div className={styles.collapsedIcons}>
        {iconEntries.map(({key, label, href, icon}) => (
          <IconButton
            key={key}
            activePrimary
            onClick={() => {
              if (href) history.push(href);
              onExpand();
            }}
            title={label}
            aria-label={label}>
            {icon}
          </IconButton>
        ))}
      </div>
    </div>
  );
}

function ProductDropdown({onCollapse}: {onCollapse?: () => void}): ReactNode {
  const {pathname} = useLocation();
  const history = useHistory();
  const {siteConfig} = useDocusaurusContext();
  const [open, setOpen] = useState(false);

  useDropdownClose(open, setOpen);

  const navItems = (siteConfig.customFields?.secondaryNavbar ?? []) as NavItem[];
  const sections = flattenNavSections(navItems);

  // Use longest-prefix match so /docs/byoc/... prefers BYOC over Cloud Guides
  const active = sections.reduce<NavItem | null>((best, s) => {
    if (!s.prefix) return best;
    const matches = pathname === s.prefix || pathname.startsWith(s.prefix + '/');
    if (!matches) return best;
    if (!best || s.prefix.length > (best.prefix?.length ?? 0)) return s;
    return best;
  }, null) ?? sections[0];

  return (
    <div className={styles.dropdownWrapper}>
      <button
        type="button"
        className={styles.dropdownTrigger}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}>
        <span className={styles.dropdownTriggerInner}>
          {active?.icon && ICONS[active.icon]}
          {active?.label}
        </span>
        <ChevronDown />
      </button>

      {onCollapse && (
        <IconButton
          size="sm"
          variant="outlined"
          onClick={onCollapse}
          title="Collapse sidebar"
          aria-label="Collapse sidebar">
          <ChevronLeft />
        </IconButton>
      )}

      {open && (
        <>
          <div className={styles.dropdownBackdrop} onClick={() => setOpen(false)} aria-hidden="true" />
          <div className={styles.dropdownMenu} role="menu">
            {sections.map(s => (
              <button
                key={s.label}
                type="button"
                role="menuitem"
                className={`${styles.dropdownItem} ${s.label === active?.label ? styles.dropdownItemActive : ''}`}
                onClick={() => {
                  if (s.href) history.push(s.href);
                  setOpen(false);
                }}>
                {s.icon && ICONS[s.icon]}
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
