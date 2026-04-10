import type {ConfidenceLevel} from './types.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ConfidenceInput {
  toolsCalled: string[];
  toolSources: {title: string; url: string; score?: number}[];
  fullText: string;
  pageContext?: string;
  pageUrl?: string;
}

export interface ConfidenceResult {
  level: ConfidenceLevel;
  score: number;
  breakdown: {
    toolSuccess: number;
    sourceAgreement: number;
    responseSubstance: number;
    pageContextAlignment: number;
  };
}

// ---------------------------------------------------------------------------
// Signal 1: Tool Success (weight 0.35)
// Primary signal in agentic mode — did the LLM search and find relevant docs?
// ---------------------------------------------------------------------------

function scoreToolSuccess(
  toolsCalled: string[],
  toolSources: {title: string; url: string; score?: number}[],
): number {
  const searchCalls = toolsCalled.filter(t => t === 'searchDocs' || t === 'listPages');
  if (searchCalls.length === 0 && toolsCalled.length === 0) return 0.5; // no tools needed (greeting)

  // Called search but got nothing — near-zero confidence
  if (searchCalls.length > 0 && toolSources.length === 0) return 0.05;

  // Got sources
  let score = 0.65;
  if (toolSources.length >= 2) score += 0.15;
  if (toolSources.length >= 4) score += 0.1;

  // Multiple search calls = thorough research
  if (searchCalls.length >= 2) score += 0.15;

  return clamp(score);
}

// ---------------------------------------------------------------------------
// Signal 2: Source Agreement (weight 0.25)
// ---------------------------------------------------------------------------

function scoreSourceAgreement(
  sources: {title: string; url: string; score?: number}[],
): number {
  if (sources.length === 0) return 0.0;
  if (sources.length === 1) return 0.7;

  const scores = sources.map(s => s.score).filter((s): s is number => s != null);
  if (scores.length === 0) return 0.5;

  const topScore = Math.max(...scores);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const spread = topScore - Math.min(...scores);

  // Strong top hit relative to average
  let signal = avgScore > 0 ? Math.min(topScore / avgScore, 1.5) / 1.5 : 0;

  // Tight score cluster = consistent topic
  if (spread < 0.15) signal = Math.min(signal + 0.2, 1.0);

  // Slight penalty for scattered URLs (all different docs) — diverse sources is normal, not bad
  const uniqueUrls = new Set(sources.map(s => s.url)).size;
  if (uniqueUrls === sources.length && sources.length >= 5) {
    signal = Math.max(signal - 0.05, 0);
  }

  return clamp(signal);
}

// ---------------------------------------------------------------------------
// Signal 3: Response Substance (weight 0.25)
// ---------------------------------------------------------------------------

const UNCERTAINTY_PATTERNS = /\b(i'm not sure|i don't have (any|enough|specific) information|uncertain|unclear|cannot find|no documentation|i couldn't find|i was unable)\b/i;
const HEDGE_PATTERN = /\b(might|perhaps|possibly)\b/gi;
const APOLOGY_PATTERNS = /\b(i apologize|sorry|unfortunately i|i'm unable to)\b/i;

function scoreResponseSubstance(text: string): {score: number; forcelow: boolean} {
  // Empty or near-empty response — always low
  if (text.trim().length < 50) return {score: 0.0, forcelow: true};

  if (UNCERTAINTY_PATTERNS.test(text)) return {score: 0.0, forcelow: true};
  if (APOLOGY_PATTERNS.test(text) && text.length < 300) return {score: 0.0, forcelow: true};

  let score = 0.5;

  // Positive signals
  if (/```/.test(text)) score += 0.15;           // code blocks
  if (/\[.*?\]\(.*?\)/.test(text)) score += 0.1; // markdown links

  // Negative signals
  const hedges = text.match(HEDGE_PATTERN);
  if (hedges && hedges.length >= 3) score -= 0.15;
  if (text.length < 80) score -= 0.2;

  return {score: clamp(score), forcelow: false};
}

// ---------------------------------------------------------------------------
// Signal 4: Page Context Alignment (weight 0.15)
// ---------------------------------------------------------------------------

function scorePageContextAlignment(
  pageUrl: string | undefined,
  pageContext: string | undefined,
  sources: {title: string; url: string}[],
  fullText: string,
): number {
  if (!pageContext) return 0.5; // neutral

  let score = 0.6;

  // Check if any source matches current page URL
  if (pageUrl && sources.some(s => s.url === pageUrl || s.url.includes(pageUrl))) {
    score += 0.2;
  }

  // Check if response references terms from the page context (first 200 chars)
  const pageTerms = extractSignificantTerms(pageContext.slice(0, 200));
  const textLower = fullText.toLowerCase();
  const matchCount = pageTerms.filter(t => textLower.includes(t)).length;
  if (matchCount >= 2) score += 0.2;

  return clamp(score);
}

function extractSignificantTerms(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'and',
    'but', 'or', 'nor', 'not', 'so', 'yet', 'this', 'that', 'these',
    'those', 'it', 'its', 'you', 'your', 'we', 'our', 'they', 'their',
  ]);
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
}

// ---------------------------------------------------------------------------
// Composite scorer
// ---------------------------------------------------------------------------

export function computeConfidence(input: ConfidenceInput): ConfidenceResult {
  const tools = scoreToolSuccess(input.toolsCalled, input.toolSources);
  const agreement = scoreSourceAgreement(input.toolSources);
  const substance = scoreResponseSubstance(input.fullText);
  const pageCtx = scorePageContextAlignment(
    input.pageUrl, input.pageContext, input.toolSources, input.fullText,
  );

  const composite =
    0.35 * tools +
    0.25 * agreement +
    0.25 * substance.score +
    0.15 * pageCtx;

  let level: ConfidenceLevel;
  if (composite >= 0.70) level = 'high';
  else if (composite >= 0.40) level = 'medium';
  else level = 'low';

  // Hard overrides
  if (substance.forcelow) level = 'low';

  // No sources at all — cap at medium
  if (input.toolSources.length === 0 && level === 'high') {
    level = 'medium';
  }
  if (input.toolSources.length === 0 && substance.score < 0.5) {
    level = 'low';
  }

  // Force medium max if long text but 0 sources
  if (input.fullText.length > 200 && input.toolSources.length === 0 && level === 'high') {
    level = 'medium';
  }

  return {
    level,
    score: composite,
    breakdown: {
      toolSuccess: tools,
      sourceAgreement: agreement,
      responseSubstance: substance.score,
      pageContextAlignment: pageCtx,
    },
  };
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function clamp(v: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, v));
}
