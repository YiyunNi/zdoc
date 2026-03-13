import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useCodeBlockContext} from '@docusaurus/theme-common/internal';
import Container from '@theme/CodeBlock/Container';
import Content from '@theme/CodeBlock/Content';
import CopyButton from '@theme/CodeBlock/Buttons/CopyButton';
import styles from './styles.module.css';

function TrafficLights() {
  return (
    <div className={styles.trafficLights} aria-hidden="true">
      <span className={clsx(styles.dot, styles.dotRed)} />
      <span className={clsx(styles.dot, styles.dotYellow)} />
      <span className={clsx(styles.dot, styles.dotGreen)} />
    </div>
  );
}

export default function CodeBlockLayout({className}: {className?: string}): ReactNode {
  const {metadata} = useCodeBlockContext();
  const rawName = typeof (metadata.title ?? metadata.language) === 'string'
    ? (metadata.title ?? metadata.language) as string
    : undefined;
  const LANG_LABELS: Record<string, string> = {
    javascript: 'JavaScript', typescript: 'TypeScript', python: 'Python',
    bash: 'Bash', shell: 'Shell', json: 'JSON', yaml: 'YAML',
    html: 'HTML', css: 'CSS', java: 'Java', go: 'Go', rust: 'Rust',
    cpp: 'C++', c: 'C', sql: 'SQL', graphql: 'GraphQL',
    markdown: 'Markdown', mdx: 'MDX', tsx: 'TSX', jsx: 'JSX',
    toml: 'TOML', xml: 'XML',
  };
  const displayName = rawName
    ? (LANG_LABELS[rawName.toLowerCase()] ?? rawName.charAt(0).toUpperCase() + rawName.slice(1))
    : undefined;

  return (
    <Container as="div" className={clsx(styles.windowFrame, className, metadata.className)}>
      <div className={styles.titleBar}>
        <TrafficLights />
        {displayName && (
          <span className={styles.filename}>{displayName}</span>
        )}
        <div className={styles.titleBarRight}>
          <CopyButton className={styles.copyBtn} />
        </div>
      </div>
      <div className={styles.codeContent}>
        <Content />
      </div>
    </Container>
  );
}
