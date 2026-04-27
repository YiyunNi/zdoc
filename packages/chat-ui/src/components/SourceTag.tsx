import React from 'react';
import { resolveSection } from '../utils/resolveSection';
import styles from './SourceTag.module.css';

const SOURCE_TAG_MAP: Record<string, { label: string; className: string }> = {
  'byoc-guides': { label: 'BYOC', className: styles.tagByoc },
  'cloud-guides': { label: 'CLOUD', className: styles.tagCloud },
  'api-reference': { label: 'API', className: styles.tagApi },
  'external-web': { label: 'EXT', className: styles.tagExternal },
  'external-github': { label: 'GITHUB', className: styles.tagExternal },
};

export interface SourceTagProps {
  section?: string;
  url?: string;
}

export function SourceTag({ section, url }: SourceTagProps): React.ReactElement | null {
  const resolved = resolveSection(section, url);
  const tag = SOURCE_TAG_MAP[resolved];
  if (!tag) return null;
  return <span className={`${styles.tag} ${tag.className}`}>{tag.label}</span>;
}
