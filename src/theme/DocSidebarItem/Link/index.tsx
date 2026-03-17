import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import type {Props} from '@theme/DocSidebarItem/Link';
import {Home} from 'lucide-react';

import styles from '../Category/styles.module.css';

// ── Inline icon map ───────────────────────────────────────────────────────────

const LINK_ICONS: Record<string, ReactNode> = {
  home: <Home size={20} />,
};

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props): ReactNode {
  const {href, label, className, autoAddBaseUrl} = item;
  const iconKey = item.customProps?.icon as string | undefined;
  const icon = iconKey ? LINK_ICONS[iconKey] : undefined;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        className,
      )}>
      <Link
        className={clsx('menu__link', {'menu__link--active': isActive})}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}>
        {icon && <span className={styles.categoryIcon} aria-hidden="true">{icon}</span>}
        <span className={styles.categoryLinkLabel}>{label}</span>
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}
