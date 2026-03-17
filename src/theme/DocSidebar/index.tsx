import React, {type ReactNode, useState} from 'react';
import {useLocation, useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import DocSidebar from '@theme-original/DocSidebar';
import type DocSidebarType from '@theme/DocSidebar';
import type {WrapperProps} from '@docusaurus/types';
import type {PropSidebarItemCategory} from '@docusaurus/plugin-content-docs';
import {findFirstSidebarItemLink} from '@docusaurus/plugin-content-docs/client';
import {
  Rocket,
  Database,
  Layers,
  Cloud,
  CloudUpload,
  Settings,
  CircleHelp,
  Search,
  Key,
  Code,
  Settings2,
  Split,
  Network,
  Workflow,
  Upload,
  HardDrive,
  Brain,
  ArrowDownWideNarrow,
  Globe,
  RefreshCw,
  Folder,
  RotateCw,
  Archive,
  BarChart3,
  CalendarDays,
  CreditCard,
  PieChart,
  Shield,
  Link as LinkIcon,
  User,
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
} from 'lucide-react';
import ICONS from '../../utils/navIcons';
import {useDropdownClose} from '../../utils/useDropdownClose';
import IconButton from '../../components/IconButton';

import styles from './styles.module.css';

// Track whether the sidebar has ever been expanded (persists across remounts)
let hasEverExpanded = false;

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

/** All known sidebar section icon keys → icon element.
 *  New section icons should be added here as they appear in sidebar customProps.
 */
const SIDEBAR_ICON_MAP: Record<string, React.ReactNode> = {
  home:           <Home size={18} />,
  quickstarts:    <Rocket size={18} />,
  'deploy-byoc':  <CloudUpload size={18} />,
  data:           <Database size={18} />,
  indexes:        <Layers size={18} />,
  search:         <Search size={18} />,
  infrastructure: <Cloud size={18} />,
  administration: <Settings size={18} />,
  faqs:           <CircleHelp size={18} />,
  // Reference doc section icons
  auth:            <Key size={18} />,
  'client-code':   <Code size={18} />,
  'collections-ref': <Layers size={18} />,
  'db-ref':        <Database size={18} />,
  mgmt:            <Settings2 size={18} />,
  partition:       <Split size={18} />,
  'vector-ref':    <Brain size={18} />,
  'import-ref':    <Upload size={18} />,
  'storage-ref':   <HardDrive size={18} />,
  'embed-ref':     <Brain size={18} />,
  'rerank-ref':    <ArrowDownWideNarrow size={18} />,
  'cloud-ctrl':    <Cloud size={18} />,
  'data-plane':    <Workflow size={18} />,
  // REST API items
  'rest-cloud-meta': <Globe size={18} />,
  'rest-elt':        <RefreshCw size={18} />,
  'rest-project':    <Folder size={18} />,
  'rest-cluster':    <Network size={18} />,
  'rest-migrate':    <RotateCw size={18} />,
  'rest-backup':     <Archive size={18} />,
  'rest-metrics':    <BarChart3 size={18} />,
  'rest-job':        <CalendarDays size={18} />,
  'rest-invoices':   <CreditCard size={18} />,
  'rest-usage':      <PieChart size={18} />,
  'rest-role':       <Shield size={18} />,
  'rest-alias':      <LinkIcon size={18} />,
  'rest-user':       <User size={18} />,
  'rest-index':      <Bookmark size={18} />,
};

function CollapsedIconColumn({
  onExpand,
  sidebar,
}: {
  onExpand: () => void;
  sidebar: Props['sidebar'];
}): ReactNode {
  const history = useHistory();
  const [showToast, setShowToast] = useState(!hasEverExpanded);

  const handleExpand = () => {
    hasEverExpanded = true;
    setShowToast(false);
    onExpand();
  };

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
          onClick={handleExpand}
          title="Expand sidebar"
          aria-label="Expand sidebar">
          <ChevronRight size={16} />
        </IconButton>
        {showToast && (
          <span className={styles.sidebarToast}>Sidebar</span>
        )}
      </div>
      <div className={styles.collapsedIcons}>
        {iconEntries.map(({key, label, href, icon}) => (
          <IconButton
            key={key}
            activePrimary
            onClick={() => {
              if (href) history.push(href);
              handleExpand();
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
        <ChevronDown size={14} strokeWidth={2.5} />
      </button>

      {onCollapse && (
        <IconButton
          size="sm"
          variant="outlined"
          onClick={onCollapse}
          title="Collapse sidebar"
          aria-label="Collapse sidebar">
          <ChevronLeft size={16} />
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
