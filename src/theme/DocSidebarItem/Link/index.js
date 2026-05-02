import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import styles from './styles.module.css';

const methodBadgeClass = {
  GET: styles.badgeGet,
  POST: styles.badgePost,
  PUT: styles.badgePut,
  DELETE: styles.badgeDelete,
  PATCH: styles.badgePatch,
};

const Badge = ({ label }) => {
  const method = label.toUpperCase();
  return (
    <span className={clsx(styles.badge, methodBadgeClass[method])}>
      {method}
    </span>
  );
};

const Badges = ({ labels }) => {
  return (
    <>
      {labels.map((label, index) => (
        <Badge key={index} label={label} />
      ))}
    </>
  )
}

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}) {
  const {href, label, className, autoAddBaseUrl, customProps} = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  const badges = customProps?.badges ? customProps.badges : [];

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        className,
      )}
      key={label}>
      <Link
        className={clsx(
          'menu__link',
          !isInternalLink && styles.menuExternalLink,
          {
            'menu__link--active': isActive,
          },
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}>
        {badges.length > 0 && <Badges labels={badges} />} {label}
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}
