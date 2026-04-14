// ---------------------------------------------------------------------------
// Shared demotion patterns for release notes and generic pages
// ---------------------------------------------------------------------------

export const DEMOTE_TITLE_PATTERNS = [
  /release[\s-]*notes?/i, /changelog/i, /what's\s*new/i, /v\d+\.\d+\.\d+/,
  /feature[\s-]*availability/i,
];

export const DEMOTE_URL_PATTERNS = [
  /release-notes/i, /changelog/i, /whats-new/i, /feature-availability/i,
];

// ---------------------------------------------------------------------------
// API reference demotion — applied when the question is conceptual
// (not asking for a specific API endpoint or code sample).
// These patterns match /reference/ paths so they can be down-weighted
// for non-API questions like "What cluster size do I need?"
// ---------------------------------------------------------------------------

export const API_REF_URL_PATTERNS = [
  /^\/reference\//i,
  /^\/docs\/reference\//i,
];

export function isDemotedSource(title: string, url: string): boolean {
  return (
    DEMOTE_TITLE_PATTERNS.some(p => p.test(title)) ||
    DEMOTE_URL_PATTERNS.some(p => p.test(url))
  );
}

/** Check if a source is an API reference document */
export function isApiRefSource(url: string): boolean {
  return API_REF_URL_PATTERNS.some(p => p.test(url));
}

export function buildDemotionFunctionScore(): Record<string, unknown> {
  return {
    functions: [
      {
        name: 'demote_release_notes',
        type: 'Rerank',
        inputFieldNames: [],
        outputFieldNames: [],
        params: {
          reranker: 'boost',
          filter: 'doc_url like "%release-notes%"',
          weight: '0.3',
        },
      },
      {
        name: 'demote_changelogs',
        type: 'Rerank',
        inputFieldNames: [],
        outputFieldNames: [],
        params: {
          reranker: 'boost',
          filter: 'doc_url like "%changelog%"',
          weight: '0.3',
        },
      },
      {
        name: 'demote_feature_availability',
        type: 'Rerank',
        inputFieldNames: [],
        outputFieldNames: [],
        params: {
          reranker: 'boost',
          filter: 'doc_url like "%feature-availability%"',
          weight: '0.3',
        },
      },
    ],
    params: {
      boost_mode: 'multiply',
      function_mode: 'multiply',
    },
  };
}
