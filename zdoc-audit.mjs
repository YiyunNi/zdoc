import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = '/tmp/zdoc-screenshots';
const VIEWPORT_WIDTH = 1440;
const VIEWPORT_HEIGHT = 900;

const pages = [
  { path: '/', name: 'homepage' },
  { path: '/docs/intro', name: 'docs-intro' },
];

async function measureElement(page, selector, label) {
  try {
    const el = await page.$(selector);
    if (!el) {
      return { label, found: false, selector };
    }
    const box = await el.boundingBox();
    const isVisible = await el.isVisible();
    const styles = await el.evaluate((node) => {
      const cs = window.getComputedStyle(node);
      return {
        display: cs.display,
        visibility: cs.visibility,
        overflow: cs.overflow,
        overflowX: cs.overflowX,
        overflowY: cs.overflowY,
        position: cs.position,
        width: cs.width,
        height: cs.height,
        zIndex: cs.zIndex,
      };
    });
    return { label, found: true, selector, box, isVisible, styles };
  } catch (e) {
    return { label, found: false, selector, error: e.message };
  }
}

async function checkOverflow(page) {
  return await page.evaluate(() => {
    const results = [];
    const docWidth = document.documentElement.scrollWidth;
    const winWidth = window.innerWidth;
    if (docWidth > winWidth) {
      results.push(`Horizontal overflow: document.scrollWidth=${docWidth} > window.innerWidth=${winWidth}`);
    }
    // Check for elements causing overflow
    const all = document.querySelectorAll('*');
    const overflowing = [];
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.right > winWidth + 1) {
        const tag = el.tagName.toLowerCase();
        const cls = el.className && typeof el.className === 'string' ? el.className.slice(0, 60) : '';
        overflowing.push(`${tag}.${cls} right=${Math.round(rect.right)} (overflows by ${Math.round(rect.right - winWidth)}px)`);
        if (overflowing.length >= 5) break;
      }
    }
    if (overflowing.length) {
      results.push('Elements causing overflow: ' + overflowing.join(' | '));
    }
    return results;
  });
}

async function auditPage(browser, pageConfig) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`AUDITING: ${pageConfig.name} (${pageConfig.path})`);
  console.log('='.repeat(60));

  const context = await browser.newContext({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const consoleWarnings = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
    if (msg.type() === 'warning') consoleWarnings.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(`PAGE ERROR: ${err.message}`));

  const url = BASE_URL + pageConfig.path;
  console.log(`\nNavigating to: ${url}`);

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    console.log(`Navigation warning: ${e.message}`);
    // Try with domcontentloaded instead
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);
    } catch (e2) {
      console.log(`Navigation failed: ${e2.message}`);
    }
  }

  // Wait a bit for dynamic content
  await page.waitForTimeout(1000);

  // Take full-page screenshot
  const screenshotPath = path.join(SCREENSHOT_DIR, `${pageConfig.name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`\nScreenshot saved: ${screenshotPath}`);

  // Also take viewport-only screenshot
  const viewportScreenshotPath = path.join(SCREENSHOT_DIR, `${pageConfig.name}-viewport.png`);
  await page.screenshot({ path: viewportScreenshotPath, fullPage: false });
  console.log(`Viewport screenshot saved: ${viewportScreenshotPath}`);

  // Console errors
  console.log(`\n--- Console Errors (${consoleErrors.length}) ---`);
  if (consoleErrors.length === 0) {
    console.log('  None');
  } else {
    consoleErrors.forEach((e) => console.log(`  ERROR: ${e}`));
  }

  console.log(`\n--- Console Warnings (${consoleWarnings.length}) ---`);
  if (consoleWarnings.length === 0) {
    console.log('  None');
  } else {
    consoleWarnings.slice(0, 5).forEach((w) => console.log(`  WARN: ${w}`));
  }

  // Layout measurements
  console.log('\n--- Layout Element Measurements ---');

  const elements = [
    // Navbar
    { selector: 'nav.navbar', label: 'Navbar (nav.navbar)' },
    { selector: '.navbar', label: 'Navbar (.navbar)' },
    // Secondary navbar
    { selector: '[class*="secondaryNavbar"]', label: 'SecondaryNavbar (*secondaryNavbar*)' },
    { selector: '[class*="SecondaryNavbar"]', label: 'SecondaryNavbar (cap)' },
    { selector: 'nav[class*="secondary"]', label: 'Secondary nav' },
    // Chat panel
    { selector: '[class*="chatPanel"]', label: 'ChatPanel (*chatPanel*)' },
    { selector: '[class*="ChatPanel"]', label: 'ChatPanel (cap)' },
    { selector: '[class*="chat-panel"]', label: 'ChatPanel (kebab)' },
    // Sidebar
    { selector: '.theme-doc-sidebar-container', label: 'Sidebar container' },
    { selector: 'aside.theme-doc-sidebar-container', label: 'Sidebar aside' },
    { selector: '[class*="docSidebarContainer"]', label: 'DocSidebarContainer' },
    { selector: '[class*="sidebar"]', label: 'First sidebar elem' },
    // Content
    { selector: 'article', label: 'Article (content)' },
    { selector: '.theme-doc-markdown', label: 'Doc markdown content' },
    { selector: 'main', label: 'Main element' },
    // TOC
    { selector: '.table-of-contents', label: 'TOC (.table-of-contents)' },
    { selector: '[class*="tableOfContents"]', label: 'TOC (tableOfContents)' },
    // Layout containers
    { selector: '[class*="docRoot"]', label: 'DocRoot' },
    { selector: '[class*="docPage"]', label: 'DocPage' },
    { selector: '[class*="mainWrapper"]', label: 'MainWrapper' },
    { selector: '[class*="docItemCol"]', label: 'DocItemCol' },
  ];

  for (const el of elements) {
    const result = await measureElement(page, el.selector, el.label);
    if (result.found) {
      const box = result.box;
      const boxStr = box
        ? `x=${Math.round(box.x)} y=${Math.round(box.y)} w=${Math.round(box.width)} h=${Math.round(box.height)}`
        : 'no bounding box';
      console.log(`  [FOUND] ${result.label}`);
      console.log(`    selector: ${result.selector}`);
      console.log(`    box: ${boxStr}`);
      console.log(`    visible: ${result.isVisible}`);
      if (result.styles) {
        console.log(`    styles: display=${result.styles.display} pos=${result.styles.position} overflow=${result.styles.overflow}/${result.styles.overflowX}/${result.styles.overflowY}`);
      }
    } else {
      console.log(`  [MISSING] ${result.label} | selector: ${result.selector}`);
    }
  }

  // Check page dimensions and overflow
  console.log('\n--- Overflow / Scroll Check ---');
  const overflowIssues = await checkOverflow(page);
  if (overflowIssues.length === 0) {
    console.log('  No horizontal overflow detected');
  } else {
    overflowIssues.forEach((i) => console.log(`  ISSUE: ${i}`));
  }

  const scrollInfo = await page.evaluate(() => ({
    documentScrollWidth: document.documentElement.scrollWidth,
    documentScrollHeight: document.documentElement.scrollHeight,
    windowInnerWidth: window.innerWidth,
    windowInnerHeight: window.innerHeight,
    bodyScrollWidth: document.body.scrollWidth,
    bodyScrollHeight: document.body.scrollHeight,
  }));
  console.log(`  document: ${scrollInfo.documentScrollWidth}x${scrollInfo.documentScrollHeight}`);
  console.log(`  window: ${scrollInfo.windowInnerWidth}x${scrollInfo.windowInnerHeight}`);
  console.log(`  body: ${scrollInfo.bodyScrollWidth}x${scrollInfo.bodyScrollHeight}`);

  // Specific layout analysis
  console.log('\n--- Layout Analysis ---');

  // Check navbar height specifically
  const navbarHeight = await page.evaluate(() => {
    const nav = document.querySelector('nav.navbar') || document.querySelector('.navbar');
    if (!nav) return null;
    return nav.getBoundingClientRect().height;
  });
  console.log(`  Navbar height: ${navbarHeight !== null ? navbarHeight + 'px' : 'NOT FOUND'} (expected ~56px)`);

  // Check if secondary navbar exists and measure it
  const secondaryNavInfo = await page.evaluate(() => {
    // Try various selectors
    const selectors = [
      '[class*="secondaryNavbar"]',
      '[class*="SecondaryNavbar"]',
      '[class*="secondary-navbar"]',
      'nav[aria-label*="secondary"]',
      'div[class*="tabs"]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const rect = el.getBoundingClientRect();
        return { selector: sel, height: rect.height, width: rect.width, x: rect.x, y: rect.y, className: el.className };
      }
    }
    return null;
  });
  if (secondaryNavInfo) {
    console.log(`  SecondaryNavbar: FOUND via "${secondaryNavInfo.selector}"`);
    console.log(`    height=${secondaryNavInfo.height}px (expected ~48px) width=${secondaryNavInfo.width}px`);
    console.log(`    className: ${secondaryNavInfo.className}`);
  } else {
    console.log('  SecondaryNavbar: NOT FOUND');
  }

  // Check chat panel
  const chatPanelInfo = await page.evaluate(() => {
    const selectors = [
      '[class*="chatPanel"]',
      '[class*="ChatPanel"]',
      '[class*="chat"]',
      '[class*="inkeep"]',
      '[class*="Inkeep"]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const rect = el.getBoundingClientRect();
        return { selector: sel, height: rect.height, width: rect.width, x: rect.x, y: rect.y, className: el.className };
      }
    }
    return null;
  });
  if (chatPanelInfo) {
    console.log(`  ChatPanel: FOUND via "${chatPanelInfo.selector}"`);
    console.log(`    width=${chatPanelInfo.width}px (expected ~320px) height=${chatPanelInfo.height}px`);
    console.log(`    x=${chatPanelInfo.x} (expected right side)`);
    console.log(`    className: ${chatPanelInfo.className}`);
  } else {
    console.log('  ChatPanel: NOT FOUND');
  }

  // Check sidebar width
  const sidebarInfo = await page.evaluate(() => {
    const selectors = [
      '.theme-doc-sidebar-container',
      'aside[class*="sidebar"]',
      '[class*="docSidebarContainer"]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const rect = el.getBoundingClientRect();
        return { selector: sel, width: rect.width, height: rect.height, x: rect.x, y: rect.y, className: el.className };
      }
    }
    return null;
  });
  if (sidebarInfo) {
    console.log(`  Sidebar: FOUND via "${sidebarInfo.selector}"`);
    console.log(`    width=${sidebarInfo.width}px (expected ~256px) height=${sidebarInfo.height}px`);
    console.log(`    x=${sidebarInfo.x} (should be after ChatPanel)`);
    console.log(`    className: ${sidebarInfo.className}`);
  } else {
    console.log('  Sidebar: NOT FOUND (may not apply to this page)');
  }

  // Dump all top-level layout structure
  console.log('\n--- DOM Structure Dump (top-level) ---');
  const domStructure = await page.evaluate(() => {
    function describeEl(el, depth = 0) {
      if (depth > 3) return '';
      const tag = el.tagName.toLowerCase();
      const cls = el.className && typeof el.className === 'string' ? el.className.slice(0, 80) : '';
      const id = el.id ? `#${el.id}` : '';
      const rect = el.getBoundingClientRect();
      const line = `${'  '.repeat(depth)}${tag}${id}${cls ? '.' + cls.replace(/\s+/g, '.') : ''} [${Math.round(rect.width)}x${Math.round(rect.height)} at ${Math.round(rect.x)},${Math.round(rect.y)}]`;
      let result = line + '\n';
      // Only recurse into certain meaningful children
      const children = Array.from(el.children);
      if (children.length <= 10) {
        for (const child of children) {
          result += describeEl(child, depth + 1);
        }
      } else {
        result += `${'  '.repeat(depth + 1)}... (${children.length} children)\n`;
      }
      return result;
    }
    return describeEl(document.body);
  });
  console.log(domStructure.slice(0, 6000)); // Limit output

  await context.close();

  return {
    page: pageConfig.name,
    consoleErrors,
    consoleWarnings,
    navbarHeight,
    secondaryNavInfo,
    chatPanelInfo,
    sidebarInfo,
    overflowIssues,
  };
}

async function main() {
  console.log('zdoc-redesign UI Audit');
  console.log('='.repeat(60));
  console.log(`Viewport: ${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Screenshots: ${SCREENSHOT_DIR}`);

  const browser = await chromium.launch({ headless: true });

  const results = [];
  for (const pageConfig of pages) {
    try {
      const result = await auditPage(browser, pageConfig);
      results.push(result);
    } catch (e) {
      console.error(`Failed to audit ${pageConfig.name}:`, e);
    }
  }

  await browser.close();

  console.log('\n' + '='.repeat(60));
  console.log('AUDIT SUMMARY');
  console.log('='.repeat(60));

  for (const r of results) {
    console.log(`\nPage: ${r.page}`);
    console.log(`  Console errors: ${r.consoleErrors.length}`);
    console.log(`  Console warnings: ${r.consoleWarnings.length}`);
    console.log(`  Navbar height: ${r.navbarHeight}px`);
    console.log(`  SecondaryNavbar: ${r.secondaryNavInfo ? 'PRESENT' : 'MISSING'}`);
    console.log(`  ChatPanel: ${r.chatPanelInfo ? 'PRESENT' : 'MISSING'}`);
    console.log(`  Sidebar: ${r.sidebarInfo ? 'PRESENT' : 'MISSING'}`);
    console.log(`  Overflow issues: ${r.overflowIssues.length}`);
  }

  console.log('\nScreenshots saved to:', SCREENSHOT_DIR);
  fs.readdirSync(SCREENSHOT_DIR).forEach((f) => console.log(' -', f));
}

main().catch(console.error);
