/**
 * TOCItems wrapper — Fumadocs-style SVG rail.
 *
 * Uses IntersectionObserver on article headings to determine which are
 * currently visible in the scroll container. The blue rail segment spans
 * all visible headings simultaneously and slides smoothly via CSS transition.
 */
import React, { useEffect, useId, useRef, useState } from 'react';
import TOCItemsOriginal from '@theme-original/TOCItems';
import type TOCItemsType from '@theme/TOCItems';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof TOCItemsType>;

const STEP = 12;

interface Rail {
  path: string;
  activeY: number;
  activeH: number;
  totalH: number;
}

function countULAncestors(el: Element, stop: Element): number {
  let n = 0;
  let cur: Element | null = el.parentElement;
  while (cur && cur !== stop) {
    if (cur.tagName === 'UL') n++;
    cur = cur.parentElement;
  }
  return n;
}

function buildRail(wrapper: HTMLElement, visibleIds: Set<string>): Rail | null {
  const links = wrapper.querySelectorAll<HTMLElement>('.table-of-contents__link');
  if (!links.length) return null;

  const box = wrapper.getBoundingClientRect();
  let d = '';
  let activeTop = Infinity;
  let activeBottom = -Infinity;
  let prevX = -1;
  let prevY = 0;

  links.forEach((link, i) => {
    const r = link.getBoundingClientRect();
    const y = r.top - box.top;
    const bottom = y + r.height;
    const depth = Math.max(0, countULAncestors(link, wrapper) - 1);
    const x = depth * STEP + 0.5;

    const href = link.getAttribute('href');
    const id = href ? href.slice(1) : '';
    if (id && visibleIds.has(id)) {
      activeTop = Math.min(activeTop, y);
      activeBottom = Math.max(activeBottom, bottom);
    }

    if (i === 0) {
      d += `M ${x} ${y}`;
    } else if (x !== prevX) {
      const mid = (prevY + y) / 2;
      d += ` C ${prevX} ${mid},${x} ${mid},${x} ${y}`;
    } else {
      d += ` L ${x} ${y}`;
    }
    d += ` L ${x} ${bottom}`;
    prevX = x;
    prevY = bottom;
  });

  return {
    path: d,
    activeY: activeTop === Infinity ? -1 : activeTop,
    activeH: activeTop === Infinity ? 0 : activeBottom - activeTop,
    totalH: box.height,
  };
}

function getScrollContainer(el: HTMLElement): HTMLElement | null {
  let cur: HTMLElement | null = el.parentElement;
  while (cur && cur !== document.body) {
    const { overflowY } = getComputedStyle(cur);
    if (overflowY === 'auto' || overflowY === 'scroll') return cur;
    cur = cur.parentElement;
  }
  return null;
}

export default function TOCItems(props: Props): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rail, setRail] = useState<Rail | null>(null);
  const uid = useId().replace(/:/g, '');

  useEffect(() => {
    const tocEl = wrapperRef.current;
    const article = document.querySelector<HTMLElement>('article');
    if (!tocEl || !article) return;

    // visible is a plain mutable Set — no stale-closure or re-render issues
    const visible = new Set<string>();

    let rafId = 0;
    const scheduleRebuild = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const next = buildRail(tocEl, visible);
        if (next) setRail(next);
      });
    };

    // Find the scroll container from the article side so IO root is correct
    const scrollRoot = getScrollContainer(article);

    const headings = article.querySelectorAll<HTMLElement>('h1[id], h2[id], h3[id], h4[id]');

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        });
        scheduleRebuild();
      },
      {
        root: scrollRoot,
        threshold: 0,
        rootMargin: '0px 0px -20% 0px',
      },
    );
    headings.forEach(h => io.observe(h));

    // ResizeObserver keeps geometry current when the sidebar or window resizes
    const ro = new ResizeObserver(scheduleRebuild);
    ro.observe(tocEl);

    scheduleRebuild();

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  const svgW = STEP * 5;

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      {rail && (
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: svgW,
            height: rail.totalH,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          <path d={rail.path} stroke="#e5e7eb" strokeWidth="1" fill="none" strokeLinecap="round" />
          {rail.activeY >= 0 && (
            <>
              <defs>
                <clipPath id={`toc-active-${uid}`}>
                  <rect
                    x={-2}
                    y={0}
                    width={svgW + 4}
                    height={rail.activeH}
                    style={{
                      transform: `translateY(${rail.activeY}px)`,
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </clipPath>
              </defs>
              <path
                d={rail.path}
                stroke="#175fff"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                clipPath={`url(#toc-active-${uid})`}
              />
            </>
          )}
        </svg>
      )}
      <TOCItemsOriginal {...props} />
    </div>
  );
}
