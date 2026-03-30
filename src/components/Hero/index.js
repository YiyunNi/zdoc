import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python.min';
import 'prismjs/components/prism-java.min';
import 'prismjs/components/prism-go.min';
import 'prismjs/components/prism-bash.min';
import 'prismjs/components/prism-json.min';
import styles from './styles.module.css';

const PRISM_LANG_MAP = {
  Python: 'python',
  Java: 'java',
  Go: 'go',
  NodeJS: 'javascript',
  cURL: 'bash',
};

function highlight(code, lang) {
  const prismLang = PRISM_LANG_MAP[lang] || lang || 'plain';

  console.log('Available languages:', Object.keys(Prism.languages));
  console.log('Trying to highlight with:', prismLang);

  if (Prism.languages[prismLang]) {
    const highlighted = Prism.highlight(code, Prism.languages[prismLang], prismLang);
    console.log('Highlighted', lang, '- has tokens:', highlighted.includes('token'));
    return highlighted;
  }
  console.log('No language found for:', prismLang);
  return code;
}

const LANG_ORDER = ['Python', 'Java', 'NodeJS', 'Go', 'cURL'];

// Maps fenced code fence identifiers to display tab names.
// Add entries here for aliases or special display names (e.g. cpp → C++).
// Any identifier NOT in this map falls back to: first letter uppercased.
const LANG_MAP = {
  python: 'Python',
  java: 'Java',
  javascript: 'NodeJS',
  js: 'NodeJS',
  nodejs: 'NodeJS',
  go: 'Go',
  bash: 'cURL',
  shell: 'cURL',
  curl: 'cURL',
  cpp: 'C++',
  typescript: 'TypeScript',
  ts: 'TypeScript',
};

function tabName(lang) {
  return LANG_MAP[lang] || (lang.charAt(0).toUpperCase() + lang.slice(1));
}

function parseSlidesFromChildren(children) {
  const slides = [];
  let current = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === 'h2' || child.type?.mdxTag === 'h2') {
      if (current) slides.push(current);
      const raw = child.props.children;
      const label = Array.isArray(raw)
        ? raw.filter(c => typeof c === 'string').join('')
        : String(raw || '');
      current = { id: label.toLowerCase().replace(/\s+/g, '-'), label, json: '', snippets: {} };

    } else if ((child.type === 'p' || child.type?.mdxTag === 'p') && current && !current.description) {
      // Extract description from paragraph following h2, preserving links
      current.description = child.props.children;

    } else if ((child.type === 'pre' || child.type?.mdxTag === 'pre') && current) {
      const codeEl = child.props.children;
      if (!React.isValidElement(codeEl)) return;
      const lang = (codeEl.props.className || '').replace('language-', '').toLowerCase();
      if (!lang) return;
      const text = typeof codeEl.props.children === 'string'
        ? codeEl.props.children.trimEnd()
        : '';
      if (lang === 'json') {
        current.json = text;
      } else {
        current.snippets[tabName(lang)] = text;
      }
    }
  });

  if (current) slides.push(current);
  return slides.filter(s => s.json || Object.keys(s.snippets).length > 0);
}

// Parse CTAs from a leading <ul> that appears before the first <h2> slide.
// Returns [{label, href}] or [] if none found.
function parseCtasFromChildren(children) {
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement(child)) continue;
    if (child.type === 'h2' || child.type?.mdxTag === 'h2') break; // reached slides — stop
    if (child.type === 'ul') {
      return React.Children.toArray(child.props.children)
        .filter(c => React.isValidElement(c))
        .map(li => {
          let el = React.Children.toArray(li.props.children)
            .filter(c => typeof c !== 'string' || c.trim() !== '')[0];
          // unwrap p > a
          if (React.isValidElement(el) && el.type === 'p') {
            el = React.Children.toArray(el.props.children)
              .find(c => React.isValidElement(c));
          }
          if (React.isValidElement(el) && el.props.href !== undefined) {
            return { label: el.props.children, href: el.props.href };
          }
          return null;
        })
        .filter(Boolean);
    }
  }
  return [];
}

/* Decorative SVG — flowing curves + gradient splashes */
function BgDecor() {
  return (
    <svg
      className={styles.bgDecor}
      viewBox="0 0 1400 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Gradient splashes */}
        <radialGradient id="splash1" cx="0.2" cy="0.15" r="0.4">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="splash2" cx="0.85" cy="0.7" r="0.35">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="splashWarm" cx="0.9" cy="0.1" r="0.2">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient gradient splashes */}
      <circle cx="280" cy="80" r="320" fill="url(#splash1)" />
      <circle cx="1180" cy="400" r="280" fill="url(#splash2)" />
      <circle cx="1280" cy="60" r="160" fill="url(#splashWarm)" />

      {/* Flowing curves — group 1 (left side) */}
      <g className={styles.driftGroup1}>
        <path d="M-20 180 C120 60, 300 140, 420 80 S600 20, 720 120" stroke="#818cf8" strokeWidth="1.8" strokeOpacity="0.25" fill="none" />
        <path d="M-40 320 C80 200, 240 340, 400 240 S560 160, 680 280" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.2" fill="none" />
        <path d="M-10 460 C140 360, 280 440, 380 360 S520 280, 620 380" stroke="#a78bfa" strokeWidth="1.5" strokeOpacity="0.15" fill="none" />
      </g>

      {/* Flowing curves — group 2 (right side) */}
      <g className={styles.driftGroup2}>
        <path d="M700 40 C840 140, 960 20, 1100 100 S1260 180, 1420 60" stroke="#818cf8" strokeWidth="1.8" strokeOpacity="0.3" fill="none" />
        <path d="M680 200 C820 100, 980 240, 1120 160 S1280 80, 1420 200" stroke="#93c5fd" strokeWidth="1.5" strokeOpacity="0.2" fill="none" />
        <path d="M740 380 C880 280, 1020 400, 1160 320 S1300 240, 1440 360" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.2" fill="none" />
        <path d="M800 480 C920 400, 1060 500, 1200 420 S1340 340, 1440 440" stroke="#a78bfa" strokeWidth="1.5" strokeOpacity="0.15" fill="none" />
      </g>

      {/* Accent dots */}
      <circle cx="680" cy="268" r="4" fill="#818cf8" fillOpacity="0.5" />
      <circle cx="980" cy="340" r="3.5" fill="#60a5fa" fillOpacity="0.45" />
      <circle cx="420" cy="160" r="3" fill="#a78bfa" fillOpacity="0.4" />
      <circle cx="1120" cy="120" r="2.5" fill="#f97316" fillOpacity="0.35" />
    </svg>
  );
}

const SLIDE_DURATION = 5000;

export default function Hero({ children }) {
  // Separate title/subtitle from slide content
  const childArray = React.Children.toArray(children)
    .filter(c => typeof c !== 'string' || c.trim() !== '');
  const title = childArray[0];
  const subtitle = childArray[1];

  const afterSubtitle = childArray.slice(2);

  const activeSlides = parseSlidesFromChildren(afterSubtitle);

  // Parse CTA buttons from a leading <ul> before the first <h2> slide
  const parsedCtas = parseCtasFromChildren(afterSubtitle);

  // Derive available language tabs from first slide:
  // known languages in canonical order first, then any unknowns in insertion order
  const firstSnippetKeys = Object.keys(activeSlides[0]?.snippets || {});
  const defaultTab = firstSnippetKeys[0] || 'Python';

  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [topPanel, setTopPanel] = useState('right'); // 'left' or 'right'
  const [highlightedJson, setHighlightedJson] = useState('');
  const [highlightedCode, setHighlightedCode] = useState('');

  // Highlight code when slide or tab changes
  useEffect(() => {
    if (activeSlides.length === 0) return;
    const slide = activeSlides[activeSlide];
    setHighlightedJson(highlight(slide.json, 'json'));
    setHighlightedCode(highlight(slide.snippets[activeTab], activeTab));
  }, [activeSlide, activeTab, activeSlides]);

  useEffect(() => {
    setProgress(0);
    if (isPaused) return;
    const start = Date.now();
    const id = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setActiveSlide((prev) => (prev + 1) % activeSlides.length);
        setCopiedJson(false);
        setCopiedCode(false);
      }
    }, 50);
    return () => clearInterval(id);
  }, [isPaused, activeSlide, activeSlides.length]);

  // If the active tab isn't available in the new slide, reset to first available
  useEffect(() => {
    const keys = Object.keys(activeSlides[activeSlide]?.snippets || {});
    if (keys.length > 0 && !keys.includes(activeTab)) {
      setActiveTab(keys[0]);
    }
  }, [activeSlide, activeSlides, activeTab]);

  // Guard: if no slides parsed, render only text area (after all hooks)
  if (activeSlides.length === 0) {
    return (
      <div className={styles.heroWrapper}>
        <BgDecor />
        <div className={styles.hero}>
          <div className={styles.textArea}>
            {title}
            {subtitle}
          </div>
        </div>
      </div>
    );
  }

  const slide = activeSlides[activeSlide];
  // Known langs in canonical order, then any extras (e.g. C++, TypeScript)
  const slideSnippetKeys = Object.keys(slide?.snippets || {});
  const slideLanguages = [
    ...LANG_ORDER.filter(l => slideSnippetKeys.includes(l)),
    ...slideSnippetKeys.filter(l => !LANG_ORDER.includes(l)),
  ];

  function handleSlideChange(index) {
    setActiveSlide(index);
    setCopiedJson(false);
    setCopiedCode(false);
  }

  function handleCopyJson() {
    navigator.clipboard.writeText(slide.json).then(() => {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 1500);
    });
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(slide.snippets[activeTab]).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1500);
    });
  }

  return (
    <div className={styles.heroWrapper}>
      <BgDecor />
      <div className={styles.hero}>
        <div className={styles.textArea}>
          {title}
          {subtitle}
          <div className={styles.quickActions}>
            {(parsedCtas.length > 0 ? parsedCtas : [
              { label: 'Free Trial →', href: './get-started' },
              { label: 'Quickstart',   href: './create-cluster' },
              { label: 'API Reference', href: '/reference/restful' },
            ]).map((cta, i) => (
              <a
                key={i}
                href={cta.href}
                className={i === 0 ? styles.quickActionPrimary : styles.quickAction}
              >
                {cta.label}
              </a>
            ))}
          </div>
        </div>

        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/*
            Panel geometry:
              Left panel  → top: 0,    height: 300px
              Right panel → top: 100px (= 300/3)
              Slide title → top: 0, right: 0, width: 56% (above right panel)
          */}
          <div className={styles.codePanels}>
            {/* Title + description — top-right corner above right panel */}
            <div className={styles.slideTitle}>
              {slide.label}
            </div>
            <div className={styles.slideDesc}>
              {slide.description}
            </div>

            {/* Left: JSON document panel */}
            <div
              className={styles.jsonPanel}
              style={{ zIndex: topPanel === 'left' ? 2 : 1 }}
              onClick={() => setTopPanel('left')}
            >
              <div className={styles.panelHeader}>
                <div className={styles.dots}>
                  <span className={`${styles.dot} ${styles.dotRed}`} />
                  <span className={`${styles.dot} ${styles.dotYellow}`} />
                  <span className={`${styles.dot} ${styles.dotGreen}`} />
                </div>
                <span className={styles.panelLabel} />
                <button
                  className={styles.copyBtn}
                  onClick={handleCopyJson}
                  title="Copy JSON"
                  aria-label="Copy JSON"
                >
                  {copiedJson ? '✓' : <Copy size={16} />}
                </button>
              </div>
              <pre
                className={`${styles.code} language-json`}
                dangerouslySetInnerHTML={{ __html: highlightedJson }}
              />
            </div>

            {/* Right: Search code panel */}
            <div
              className={styles.searchOuter}
              style={{ zIndex: topPanel === 'right' ? 2 : 1 }}
              onClick={() => setTopPanel('right')}
            >
              <div className={styles.tabs}>
                {slideLanguages.map((lang) => (
                  <button
                    key={lang}
                    className={`${styles.tab} ${activeTab === lang ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <div className={styles.searchPanel}>
                <div className={styles.panelHeader}>
                  <div className={styles.dots}>
                    <span className={`${styles.dot} ${styles.dotRed}`} />
                    <span className={`${styles.dot} ${styles.dotYellow}`} />
                    <span className={`${styles.dot} ${styles.dotGreen}`} />
                  </div>
                  <span className={styles.panelLabel}>{activeTab}</span>
                  <button
                    className={styles.copyBtn}
                    onClick={handleCopyCode}
                    title="Copy code"
                    aria-label="Copy code"
                  >
                    {copiedCode ? '✓' : <Copy size={16} />}
                  </button>
                </div>
                <pre
                  className={`${styles.code} language-${PRISM_LANG_MAP[activeTab] || 'plain'}`}
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
              </div>
            </div>
          </div>

          {/* Progress bars — clickable to jump to slide */}
          <div className={styles.progressBars}>
            {activeSlides.map((s, i) => (
              <button
                key={s.id}
                className={styles.progressTrack}
                onClick={() => handleSlideChange(i)}
                aria-label={`Go to ${s.label}`}
              >
                <div
                  className={styles.progressFill}
                  style={{
                    width:
                      i < activeSlide ? '100%' :
                      i === activeSlide ? `${progress}%` :
                      '0%',
                  }}
                />
                <span className={styles.progressLabel}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
