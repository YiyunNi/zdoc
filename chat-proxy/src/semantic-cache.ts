import {generateEmbedding} from './rag.js';
import {zillizRequest, isZillizConfigured} from './zilliz-client.js';
import {getAgent} from './agents/index.js';
import type {ConfidenceLevel, AgentType} from './types.js';

const THRESHOLD = Number(process.env.SEMANTIC_CACHE_THRESHOLD) || 0.92;
const MAX_AGE_DAYS = Number(process.env.SEMANTIC_CACHE_MAX_AGE_DAYS) || 7;

export interface SemanticCacheHit {
  text: string;
  sources: Array<{title: string; url: string}>;
  confidence: ConfidenceLevel;
  agentType: string;
  agentName: string;
  similarity: number;
}

/**
 * Derive a human-readable title from a documentation URL path.
 * `/docs/quick-start.md` → "Quick Start"
 */
function titleFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname;
    const last = path.split('/').filter(Boolean).pop() || '';
    return last
      .replace(/\.md$/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  } catch {
    // Bare path (not a full URL)
    const last = url.split('/').filter(Boolean).pop() || url;
    return last
      .replace(/\.md$/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }
}

/**
 * Derive a section identifier from a page URL.
 * `/docs/byoc/...` → "byoc-guides", `/docs/...` → "cloud-guides", `/reference/...` → "api-reference"
 */
function sectionFromUrl(url: string): string | undefined {
  if (!url) return undefined;
  const path = url.startsWith('http') ? new URL(url).pathname : url;
  if (path.startsWith('/docs/byoc')) return 'byoc-guides';
  if (path.startsWith('/reference')) return 'api-reference';
  if (path.startsWith('/docs')) return 'cloud-guides';
  return undefined;
}

/**
 * Search chat_conversations for a semantically similar past answer.
 * Returns null on miss or any error (non-fatal by design).
 */
export async function findSemanticCacheHit(
  query: string,
  sectionFilter?: string,
): Promise<SemanticCacheHit | null> {
  if (!isZillizConfigured()) return null;
  if (process.env.SEMANTIC_CACHE_ENABLED === 'false') return null;

  const embedding = await generateEmbedding(query);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - MAX_AGE_DAYS);
  const cutoffISO = cutoff.toISOString();

  const hits = await zillizRequest('/entities/search', {
    collectionName: 'chat_conversations',
    data: [embedding],
    annsField: 'embedding',
    limit: 1,
    filter: `array_contains(confidence_levels, "high") and ended_at > "${cutoffISO}"`,
    outputFields: [
      'messages',
      'sources_returned',
      'confidence_levels',
      'agent_types_used',
      'feedback_summary',
      'page_urls_visited',
    ],
  });

  if (!hits || hits.length === 0) return null;

  const hit = hits[0];
  const similarity = hit.distance ?? hit.score ?? 0;
  if (similarity < THRESHOLD) return null;

  // Reject if negative feedback
  try {
    const fb = typeof hit.feedback_summary === 'string'
      ? JSON.parse(hit.feedback_summary)
      : hit.feedback_summary;
    if (fb && fb.down > 0) return null;
  } catch { /* treat parse failure as no feedback */ }

  // Section awareness: reject if cached answer's page conflicts with current section filter
  if (sectionFilter && hit.page_urls_visited?.length > 0) {
    const cachedSection = sectionFromUrl(hit.page_urls_visited[0]);
    // sectionFilter looks like `section != "cloud-guides"` — extract the excluded section
    const excludeMatch = sectionFilter.match(/section\s*!=\s*"([^"]+)"/);
    if (excludeMatch && cachedSection === excludeMatch[1]) return null;
  }

  // Extract last assistant message
  let messages: Array<{role: string; content: string}>;
  try {
    messages = typeof hit.messages === 'string' ? JSON.parse(hit.messages) : hit.messages;
  } catch {
    return null;
  }

  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
  if (!lastAssistant?.content) return null;

  // Reconstruct sources from URLs
  const sources = (hit.sources_returned || []).map((url: string) => ({
    title: titleFromUrl(url),
    url,
  }));

  // Get agent info
  const agentType = (hit.agent_types_used?.[0] || 'general') as AgentType;
  const agentConfig = getAgent(agentType);

  return {
    text: lastAssistant.content,
    sources,
    confidence: 'high',
    agentType: agentConfig.type,
    agentName: agentConfig.name,
    similarity,
  };
}
