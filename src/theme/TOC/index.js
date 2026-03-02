import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import FeedbackBox from '../../components/FeedbackBox';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './styles.module.css';
// Using a custom className
// This prevents TOCInline/TOCCollapsible getting highlighted by mistake
const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

// Renders the edit/bug/change links. Only mounted when:
//   1. Running in the browser (BrowserOnly parent)
//   2. On a real doc page (isDocPage check in EditThisPage)
//   3. On a dev host (localhost / cloud-uat)
// useDoc() is therefore always called inside a <DocProvider>.
function EditThisPageContent() {
  const {frontMatter, metadata} = useDoc();
  const source = metadata.source.replace('\@site\/', '')

  var editUrl = `https://github.com/zilliztech/zdoc/blob/master/` + source

  if (Object.keys(frontMatter).includes('type') && Object.keys(frontMatter).includes('token')) {
    switch (frontMatter.type) {
      case 'docx':
        editUrl = 'https://zilliverse.feishu.cn/docx/' + frontMatter.token
        break;
      case 'folder':
        editUrl = 'https://zilliverse.feishu.cn/drive/folder/' + frontMatter.token
        break;
      case 'origin':
        editUrl = 'https://zilliverse.feishu.cn/wiki/' + frontMatter.token
        break;
      default:
        editUrl = `https://github.com/zilliztech/zdoc/blob/master/` + source
    }
  }

  return (
    <div id="edit-this-page" style={{padding: '1rem 0', fontSize: '0.8rem'}}>
      <div style={{ marginBottom: '0.25rem' }}>
        <i style={{ display: 'inline-block', minHeight: '2rem', marginRight: '0.5rem' }}>
          <span className="material-symbols-outlined">edit</span>
        </i>
        <span style={{ display: 'inline-block', minHeight: '2rem', verticalAlign: 'top', fontWeight: 'bold' }}>
          <a href={editUrl} target="_blank" rel="noopener noreferrer">EDIT THIS PAGE</a>
        </span>
      </div>
      <div style={{ marginBottom: '0.25rem' }}>
        <i style={{ display: 'inline-block', minHeight: '2rem', marginRight: '0.5rem' }}>
          <span className="material-symbols-outlined">bug_report</span>
        </i>
        <span style={{ display: 'inline-block', minHeight: '2rem', verticalAlign: 'top', fontWeight: 'bold' }}>
          <a href="https://zilliz.atlassian.net/jira/software/projects/CD/boards/59" target="_blank" rel="noopener noreferrer">REPORT A BUG</a>
        </span>
      </div>
      <div style={{ marginBottom: '0.25rem' }}>
        <i style={{ display: 'inline-block', minHeight: '2rem', marginRight: '0.5rem' }}>
          <span className="material-symbols-outlined">lightbulb</span>
        </i>
        <span style={{ display: 'inline-block', minHeight: '2rem', verticalAlign: 'top', fontWeight: 'bold' }}>
          <a href="https://zilliz.atlassian.net/jira/software/projects/CD/boards/59" target="_blank" rel="noopener noreferrer">REQUEST A CHANGE</a>
        </span>
      </div>
    </div>
  );
}

function EditThisPage() {
  const { pathname } = useLocation();
  // Only render on real docs/reference pages that have a <DocProvider>.
  // src/pages/ paths (/agent-guidelines, /ai-tools, …) don't match and get null.
  const isDocPage = /^\/(docs|reference|ja-JP\/(docs|reference))\b/.test(pathname);

  return (
    <BrowserOnly>
      {() => {
        const hostname = window.location.hostname;
        if (!hostname.includes('cloud-uat') && !hostname.includes('localhost')) {
          return null;
        }
        if (!isDocPage) return null;
        return <EditThisPageContent />;
      }}
    </BrowserOnly>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <span className="material-symbols-outlined">arrow_upward</span>
    </button>
  );
}

export default function TOC({className, ...props}) {
  return (
    <>
      <div className={clsx(styles.tableOfContents, 'thin-scrollbar', className)}>
        <EditThisPage />
        <TOCItems
          {...props}
          linkClassName={LINK_CLASS_NAME}
          linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
        />
        <FeedbackBox />
      </div>
      <BackToTop />
    </>
  );
}
