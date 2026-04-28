import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import type {Props} from '@theme/DocSidebarItem/Html';
import {CATEGORY_ICONS} from '../Category';

import styles from './styles.module.css';

export default function DocSidebarItemHtml({
  item,
  level,
  index,
}: Props): ReactNode {
  const {value, defaultStyle, className} = item;
  const iconKey = (item as {customProps?: {icon?: string}}).customProps?.icon;
  const IconComponent = iconKey ? CATEGORY_ICONS[iconKey] : undefined;

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        defaultStyle && [styles.menuHtmlItem, 'menu__list-item'],
        className,
        IconComponent && styles.hasIcon,
      )}
      key={index}>
      {IconComponent ? (
        <span className={styles.iconSectionLabel}>
          <span className={styles.sectionIcon} aria-hidden="true">
            <IconComponent size={20} />
          </span>
          <span className={styles.sectionLabelText}>{value}</span>
        </span>
      ) : (
        // eslint-disable-next-line react/no-danger
        <span dangerouslySetInnerHTML={{__html: value}} />
      )}
    </li>
  );
}
