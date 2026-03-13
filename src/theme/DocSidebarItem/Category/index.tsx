import React, {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useMemo,
} from 'react';
import clsx from 'clsx';
import {
  ThemeClassNames,
  useThemeConfig,
  usePrevious,
  Collapsible,
  useCollapsible,
} from '@docusaurus/theme-common';
import {isSamePath} from '@docusaurus/theme-common/internal';
import {
  isActiveSidebarItem,
  findFirstSidebarItemLink,
  useDocSidebarItemsExpandedState,
  useVisibleSidebarItems,
} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import useIsBrowser from '@docusaurus/useIsBrowser';
import DocSidebarItems from '@theme/DocSidebarItems';
import DocSidebarItemLink from '@theme/DocSidebarItem/Link';
import type {Props} from '@theme/DocSidebarItem/Category';
import type {
  PropSidebarItemCategory,
  PropSidebarItemLink,
} from '@docusaurus/plugin-content-docs';

import type IconData from '@lineiconshq/react-lineicons';
import {LineIcon} from '@site/src/utils/navIcons';
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

import styles from './styles.module.css';

// ─── Icon map ────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, IconData> = {
  // Guides sidebar
  quickstarts:    Rocket5Outlined,
  'deploy-byoc':  CloudUploadOutlined,
  data:           Database2Outlined,
  indexes:        Layers1Outlined,
  search:         Search1Outlined,
  infrastructure: Cloud2Outlined,
  administration: Gear1Outlined,
  faqs:           QuestionMarkCircleOutlined,
  // Reference sidebar
  auth:              Key1Outlined,
  'client-code':     Code1Outlined,
  'collections-ref': Layers1Outlined,
  'db-ref':          Database2Outlined,
  mgmt:              Gears3Outlined,
  partition:         Slice2Outlined,
  'vector-ref':      VectorizeraiOutlined,
  'import-ref':      Upload1Outlined,
  'storage-ref':     StorageHdd2Outlined,
  'embed-ref':       VectorizeraiOutlined,
  'rerank-ref':      SortHighToLowOutlined,
  'cloud-ctrl':      Cloud2Outlined,
  'data-plane':      VectorNodes7Outlined,
  // REST API items
  'rest-cloud-meta': Globe1Outlined,
  'rest-elt':        SyncOutlined,
  'rest-project':    Folder1Outlined,
  'rest-cluster':    VectorNodes6Outlined,
  'rest-migrate':    RefreshCircle1ClockwiseOutlined,
  'rest-backup':     BoxArchive1Outlined,
  'rest-metrics':    BarChart4Outlined,
  'rest-job':        CalendarDaysOutlined,
  'rest-invoices':   CreditCardMultipleOutlined,
  'rest-usage':      PieChart2Outlined,
  'rest-role':       Shield2Outlined,
  'rest-alias':      Link2AngularRightOutlined,
  'rest-user':       User4Outlined,
  'rest-index':      Bookmark1Outlined,
};

// ─── Internals (unchanged from Docusaurus source) ────────────────────────────

function useAutoExpandActiveCategory({
  isActive,
  collapsed,
  updateCollapsed,
  activePath,
}: {
  isActive: boolean;
  collapsed: boolean;
  updateCollapsed: (b: boolean) => void;
  activePath: string;
}) {
  const wasActive = usePrevious(isActive);
  const previousActivePath = usePrevious(activePath);
  useEffect(() => {
    const justBecameActive = isActive && !wasActive;
    const stillActiveButPathChanged =
      isActive && wasActive && activePath !== previousActivePath;
    if ((justBecameActive || stillActiveButPathChanged) && collapsed) {
      updateCollapsed(false);
    }
  }, [isActive, wasActive, collapsed, updateCollapsed, activePath, previousActivePath]);
}

function useCategoryHrefWithSSRFallback(item: Props['item']): string | undefined {
  const isBrowser = useIsBrowser();
  return useMemo(() => {
    if (item.href && !item.linkUnlisted) {
      return item.href;
    }
    if (isBrowser || !item.collapsible) {
      return undefined;
    }
    return findFirstSidebarItemLink(item);
  }, [item, isBrowser]);
}

function CollapseButton({
  collapsed,
  categoryLabel,
  onClick,
}: {
  collapsed: boolean;
  categoryLabel: string;
  onClick: ComponentProps<'button'>['onClick'];
}) {
  return (
    <button
      aria-label={
        collapsed
          ? translate(
              {
                id: 'theme.DocSidebarItem.expandCategoryAriaLabel',
                message: "Expand sidebar category '{label}'",
                description: 'The ARIA label to expand the sidebar category',
              },
              {label: categoryLabel},
            )
          : translate(
              {
                id: 'theme.DocSidebarItem.collapseCategoryAriaLabel',
                message: "Collapse sidebar category '{label}'",
                description: 'The ARIA label to collapse the sidebar category',
              },
              {label: categoryLabel},
            )
      }
      aria-expanded={!collapsed}
      type="button"
      className="clean-btn menu__caret"
      onClick={onClick}
    />
  );
}

function CategoryLinkLabel({
  label,
  iconData,
}: {
  label: string;
  iconData?: IconData;
}) {
  return (
    <>
      {iconData && (
        <span className={styles.categoryIcon} aria-hidden="true">
          <LineIcon icon={iconData} size={20} />
        </span>
      )}
      <span title={label} className={styles.categoryLinkLabel}>
        {label}
      </span>
    </>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function DocSidebarItemCategory(props: Props): ReactNode {
  const visibleChildren = useVisibleSidebarItems(props.item.items, props.activePath);
  if (visibleChildren.length === 0) {
    return <DocSidebarItemCategoryEmpty {...props} />;
  }
  return <DocSidebarItemCategoryCollapsible {...props} />;
}

function isCategoryWithHref(
  category: PropSidebarItemCategory,
): category is PropSidebarItemCategory & {href: string} {
  return typeof category.href === 'string';
}

function DocSidebarItemCategoryEmpty({item, ...props}: Props): ReactNode {
  if (!isCategoryWithHref(item)) {
    return null;
  }
  const {type, collapsed, collapsible, items, linkUnlisted, ...forwardableProps} = item;
  const linkItem: PropSidebarItemLink = {type: 'link', ...forwardableProps};
  return <DocSidebarItemLink item={linkItem} {...props} />;
}

function DocSidebarItemCategoryCollapsible({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props): ReactNode {
  const {items, label, collapsible, className, href} = item;
  const iconKey = item.customProps?.icon as string | undefined;
  const iconData: IconData | undefined = iconKey ? CATEGORY_ICONS[iconKey] : undefined;

  const {
    docs: {
      sidebar: {autoCollapseCategories},
    },
  } = useThemeConfig();
  const hrefWithSSRFallback = useCategoryHrefWithSSRFallback(item);
  const isActive = isActiveSidebarItem(item, activePath);
  const isCurrentPage = isSamePath(href, activePath);

  const {collapsed, setCollapsed} = useCollapsible({
    initialState: () => {
      if (!collapsible) return false;
      return isActive ? false : item.collapsed;
    },
  });

  const {expandedItem, setExpandedItem} = useDocSidebarItemsExpandedState();
  const updateCollapsed = (toCollapsed: boolean = !collapsed) => {
    setExpandedItem(toCollapsed ? null : index);
    setCollapsed(toCollapsed);
  };
  useAutoExpandActiveCategory({isActive, collapsed, updateCollapsed, activePath});
  useEffect(() => {
    if (collapsible && expandedItem != null && expandedItem !== index && autoCollapseCategories) {
      setCollapsed(true);
    }
  }, [collapsible, expandedItem, index, setCollapsed, autoCollapseCategories]);

  const handleItemClick: ComponentProps<'a'>['onClick'] = (e) => {
    onItemClick?.(item);
    if (collapsible) {
      if (href) {
        if (isCurrentPage) {
          e.preventDefault();
          updateCollapsed();
        } else {
          updateCollapsed(false);
        }
      } else {
        e.preventDefault();
        updateCollapsed();
      }
    }
  };

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemCategory,
        ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
        'menu__list-item',
        {'menu__list-item--collapsed': collapsed},
        className,
      )}>
      <div
        className={clsx('menu__list-item-collapsible', {
          'menu__list-item-collapsible--active': isCurrentPage,
        })}>
        <Link
          className={clsx(styles.categoryLink, 'menu__link', {
            'menu__link--sublist': collapsible,
            'menu__link--sublist-caret': !href && collapsible,
            'menu__link--active': isActive,
          })}
          onClick={handleItemClick}
          aria-current={isCurrentPage ? 'page' : undefined}
          role={collapsible && !href ? 'button' : undefined}
          aria-expanded={collapsible && !href ? !collapsed : undefined}
          href={collapsible ? hrefWithSSRFallback ?? '#' : hrefWithSSRFallback}
          {...props}>
          <CategoryLinkLabel label={label} iconData={iconData} />
        </Link>
        {href && collapsible && (
          <CollapseButton
            collapsed={collapsed}
            categoryLabel={label}
            onClick={(e) => {
              e.preventDefault();
              updateCollapsed();
            }}
          />
        )}
      </div>

      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        <DocSidebarItems
          items={items}
          tabIndex={collapsed ? -1 : 0}
          onItemClick={onItemClick}
          activePath={activePath}
          level={level + 1}
        />
      </Collapsible>
    </li>
  );
}
