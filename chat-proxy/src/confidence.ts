import type {ConfidenceLevel} from './types.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ConfidenceInput {
  ragResults: {score: number; doc_url: string}[];
  ragSources: {title: string; url: string; score?: number}[];
  ragAvgScore: number;
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
    retrievalQuality: number;
    sourceAgreement: number;
    toolSuccess: number;
    responseSubstance: number;
    pageContextAlignment: number;
  };
}

// ---------------------------------------------------------------------------
// Signal 1: Retrieval Quality (weight 0.35)
// Re-calibrated for BAAI/bge-large-en-v1.5 cosine similarity distribution
// ---------------------------------------------------------------------------

function scoreRetrievalQuality(avgScore: number): number {
  if (avgScore >= 0.72) return 1.0;
  if (avgScore >= 0.55) return lerp(0.4, 1.0, (avgScore - 0.55) / (0.72 - 0.55));
  if (avgScore > 0) return lerp(0.0, 0.4, avgScore / 0.55);
  return 0.0;
}

// ---------------------------------------------------------------------------
// Signal 2: Source Agreement (weight 0.20)
// ---------------------------------------------------------------------------

function scoreSourceAgreement(results: {score: number; doc_url: string}[]): number {
  if (results.length === 0) return 0.0;
  if (results.length === 1) return 0.7;

  const scores = results.map(r => r.score);
  const topScore = Math.max(...scores);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const spread = topScore - Math.min(...scores);

  // Strong top hit relative to average
  let signal = avgScore > 0 ? Math.min(topScore / avgScore, 1.5) / 1.5 : 0;

  // Tight score cluster = consistent topic
  if (spread < 0.15) signal = Math.min(signal + 0.2, 1.0);

  // Penalty for scattered URLs (all different docs)
  const uniqueUrls = new Set(results.map(r => r.doc_url)).size;
  if (uniqueUrls === results.length && results.length >= 3) {
    signal = Math.max(signal - 0.2, 0);
  }

  return clamp(signal);
}

// ---------------------------------------------------------------------------
// Signal 3: Tool Success (weight 0.15)
// ---------------------------------------------------------------------------

function scoreToolSuccess(
  toolsCalled: string[],
  toolSources: {title: string; url: string; score?: number}[],
): number {
  if (toolsCalled.length === 0) return 0.5; // neutral

  if (toolSources.length === 0) return 0.2;

  let score = 0.6;
  const scoredSources = toolSources.map(s => s.score).filter((s): s is number => s != null);
  if (scoredSources.length > 0) {
    const avg = scoredSources.reduce((a, b) => a + b, 0) / scoredSources.length;
    if (avg > 0.6) score += 0.2;
  }
  if (toolSources.length >= 2) score += 0.2;

  return clamp(score);
}

// ---------------------------------------------------------------------------
// Signal 4: Response Substance (weight 0.15)
// ---------------------------------------------------------------------------

const UNCERTAINTY_PATTERNS = /\b(i'm not sure|i don't have|uncertain|unclear|cannot find|no documentation)\b/i;
const HEDGE_PATTERN = /\b(might|perhaps|possibly)\b/gi;

function scoreResponseSubstance(text: string): {score: number; forcelow: boolean} {
  if (UNCERTAINTY_PATTERNS.test(text)) return {score: 0.0, forcelow: true};

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
// Signal 5: Page Context Alignment (weight 0.15)
// ---------------------------------------------------------------------------

function scorePageContextAlignment(
  pageUrl: string | undefined,
  pageContext: string | undefined,
  ragResults: {score: number; doc_url: string}[],
  fullText: string,
): number {
  if (!pageContext) return 0.5; // neutral

  let score = 0.6;

  // Check if any RAG source matches current page URL
  if (pageUrl && ragResults.some(r => r.doc_url === pageUrl || r.doc_url.includes(pageUrl))) {
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
  const retrieval = scoreRetrievalQuality(input.ragAvgScore);
  const agreement = scoreSourceAgreement(input.ragResults);
  const tools = scoreToolSuccess(input.toolsCalled, input.toolSources);
  const substance = scoreResponseSubstance(input.fullText);
  const pageCtx = scorePageContextAlignment(
    input.pageUrl, input.pageContext, input.ragResults, input.fullText,
  );

  const composite =
    0.35 * retrieval +
    0.20 * agreement +
    0.15 * tools +
    0.15 * substance.score +
    0.15 * pageCtx;

  let level: ConfidenceLevel;
  if (composite >= 0.70) level = 'high';
  else if (composite >= 0.40) level = 'medium';
  else level = 'low';

  // Hard overrides
  if (substance.forcelow) level = 'low';

  // Source-relevance penalty: if tool sources have low avg score, reduce confidence
  const toolScores = input.toolSources.map(s => s.score).filter((s): s is number => s != null);
  if (toolScores.length > 0) {
    const avgToolScore = toolScores.reduce((a, b) => a + b, 0) / toolScores.length;
    if (avgToolScore < 0.6 && level === 'high') {
      level = 'medium';
    }
  }

  const totalSources = input.ragResults.length + input.toolSources.length;
  if (input.ragResults.length === 0 && input.toolSources.length === 0 && level === 'high') {
    level = 'medium';
  }
  if (totalSources === 0 && substance.score < 0.5) {
    level = 'low';
  }

  // Force medium max if long text but 0 sources
  if (input.fullText.length > 200 && totalSources === 0 && level === 'high') {
    level = 'medium';
  }

  return {
    level,
    score: composite,
    breakdown: {
      retrievalQuality: retrieval,
      sourceAgreement: agreement,
      toolSuccess: tools,
      responseSubstance: substance.score,
      pageContextAlignment: pageCtx,
    },
  };
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t);
}

function clamp(v: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, v));
}
