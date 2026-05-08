import {insertDocGap, upsertContentQuality} from './db.js';
import {summarizeForDebugLog} from './logger.js';
import {clearSessionRoute} from './router.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FailureClass = 'IndexGap' | 'RoutingError' | 'SourceDemotion' | 'HardError' | 'None';

export interface FailureContext {
  requestId?: string;
  confidenceLevel: string;
  confidenceBreakdown?: {
    toolSuccess: number;
    sourceAgreement: number;
    responseSubstance: number;
    pageContextAlignment: number;
  };
  toolsCalled: string[];
  sourceCount: number;
  groundedSourceCount: number;
  fullText: string;
  query: string;
  agentType: string;
  model: string;
  sectionFilter?: string;
  sessionId?: string;
  isDeflected: boolean;
  isSelfDescribed: boolean;
  error?: string;
}

export interface FailureDiagnosis {
  failureClass: FailureClass;
  severity: 'high' | 'medium' | 'low';
  detectedIntent?: string;
  rootCause: string;
  action: string;
  suggestion?: string;
}

// ---------------------------------------------------------------------------
// Detection patterns
// ---------------------------------------------------------------------------

const DEMOTED_PATTERNS = [
  /release[\s-]*notes?/i,
  /changelog/i,
  /what's\s*new/i,
  /feature[\s-]*availability/i,
];

const INTENT_PATTERNS: Array<{pattern: RegExp; intent: string}> = [
  {pattern: /schema|collection|field|type|index|partition/i, intent: 'schema-design'},
  {pattern: /search|query|vector|bm25|hybrid|filter/i, intent: 'search'},
  {pattern: /cluster|sizing|cu|capacity|plan|pricing|deploy/i, intent: 'resources'},
  {pattern: /serverless|dedicated|byoc|compare|product|migration/i, intent: 'product'},
  {pattern: /sdk|code|api|python|node|java|go|curl|insert|upsert|connect/i, intent: 'code'},
  {pattern: /access|rbac|role|permission|auth|key/i, intent: 'access-control'},
  {pattern: /langchain|lanchain|model|embedding|integration/i, intent: 'integrations'},
  {pattern: /import|bulk|volume|data|csv|parquet/i, intent: 'import'},
  {pattern: /migrat|pinecone|qdrant|opensearch|weaviate/i, intent: 'migration'},
];

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

export function classifyFailure(ctx: FailureContext): FailureDiagnosis {
  // Hard error — always HardError class
  if (ctx.error) {
    return {
      failureClass: 'HardError',
      severity: 'high',
      rootCause: `LLM or infrastructure error: ${ctx.error}`,
      action: 'log_error_and_alert',
      suggestion: 'Check provider status, retry with different model',
    };
  }

  // Intentional deflections or self-description — no action needed
  if (ctx.isDeflected || ctx.isSelfDescribed) {
    return {
      failureClass: 'None',
      severity: 'low',
      rootCause: ctx.isDeflected ? 'Guard deflection (off-topic or injection)' : 'Self-description (capability display)',
      action: 'none',
    };
  }

  // Low confidence with zero sources — likely index gap
  if (ctx.confidenceLevel === 'low' && ctx.sourceCount === 0 && ctx.toolsCalled.length > 0) {
    return diagnoseIndexGap(ctx);
  }

  // Low confidence with zero tools called — LLM didn't search at all
  if (ctx.confidenceLevel === 'low' && ctx.toolsCalled.length === 0) {
    return diagnoseNoToolUse(ctx);
  }

  // Medium/low confidence with some sources but no grounding — source quality issue
  if ((ctx.confidenceLevel === 'low' || ctx.confidenceLevel === 'medium') && ctx.groundedSourceCount === 0 && ctx.sourceCount > 0) {
    return diagnosePoorGrounding(ctx);
  }

  // Check for routing mismatch — user asked about resources but got code agent
  if (ctx.confidenceLevel === 'low' && ctx.sourceCount > 0) {
    const routingIssue = detectRoutingMismatch(ctx);
    if (routingIssue) return routingIssue;
  }

  // Substance-based low confidence — response was uncertain or apologetic
  if (ctx.confidenceLevel === 'low' && ctx.confidenceBreakdown && ctx.confidenceBreakdown.responseSubstance < 0.2) {
    return {
      failureClass: 'IndexGap',
      severity: 'medium',
      detectedIntent: detectIntent(ctx.query),
      rootCause: 'Response was uncertain/apologetic — LLM likely hallucinating or docs insufficient',
      action: 'log_gap',
      suggestion: 'Review docs coverage for detected intent',
    };
  }

  // Not a failure
  return {
    failureClass: 'None',
    severity: 'low',
    rootCause: 'Response within acceptable confidence bounds',
    action: 'none',
  };
}

// ---------------------------------------------------------------------------
// Diagnoses
// ---------------------------------------------------------------------------

function diagnoseIndexGap(ctx: FailureContext): FailureDiagnosis {
  const intent = detectIntent(ctx.query);
  const sectionInfo = ctx.sectionFilter ? ` (section filter: ${ctx.sectionFilter})` : '';

  // Check if wrong agent was used — a resources question sent to code agent, etc.
  const expectedAgent = expectedAgentForIntent(intent);
  const wrongAgent = expectedAgent && expectedAgent !== ctx.agentType;

  if (wrongAgent) {
    return {
      failureClass: 'RoutingError',
      severity: 'high',
      detectedIntent: intent,
      rootCause: `Query about "${intent}" routed to "${ctx.agentType}" instead of "${expectedAgent}"${sectionInfo}`,
      action: 'clear_sticky_route',
      suggestion: `Clear sticky route for session, expected agent: ${expectedAgent}`,
    };
  }

  return {
    failureClass: 'IndexGap',
    severity: ctx.toolsCalled.includes('searchDocs') ? 'high' : 'medium',
    detectedIntent: intent,
    rootCause: `No matching docs found for "${intent}"${sectionInfo}. Searched via ${ctx.toolsCalled.join(', ')}`,
    action: 'log_gap',
    suggestion: `Consider adding docs for: ${intent}`,
  };
}

function diagnoseNoToolUse(ctx: FailureContext): FailureDiagnosis {
  const intent = detectIntent(ctx.query);

  // Greeting or meta-question — not a real failure
  if (ctx.fullText.length < 100 && /(help|assist|code|example|what would you like)/i.test(ctx.fullText)) {
    return {
      failureClass: 'None',
      severity: 'low',
      rootCause: 'Assistant offering help — no tool use expected',
      action: 'none',
    };
  }

  return {
    failureClass: 'IndexGap',
    severity: 'medium',
    detectedIntent: intent,
    rootCause: `LLM did not call any search tools for "${intent}". May be off-topic or lacking context.`,
    action: 'log_gap',
    suggestion: `Review if "${intent}" is within Zilliz Cloud documentation scope`,
  };
}

function diagnosePoorGrounding(ctx: FailureContext): FailureDiagnosis {
  // Check if sources were demoted
  const hasDemotedSignals = ctx.confidenceBreakdown?.sourceAgreement != null && ctx.confidenceBreakdown.sourceAgreement < 0.3;

  if (hasDemotedSignals) {
    return {
      failureClass: 'SourceDemotion',
      severity: 'medium',
      detectedIntent: detectIntent(ctx.query),
      rootCause: `${ctx.sourceCount} sources found but grounding rejected them — likely demoted (release notes, API refs, or low overlap)`,
      action: 'log_content_quality',
      suggestion: 'Review source quality: consider better doc structure or less demoted content',
    };
  }

  return {
    failureClass: 'SourceDemotion',
    severity: 'low',
    detectedIntent: detectIntent(ctx.query),
    rootCause: `${ctx.sourceCount} sources retrieved but grounding found no paragraph-level match (content may be too thin or off-topic)`,
    action: 'log_content_quality',
    suggestion: 'Review retrieved sources for relevance and depth',
  };
}

function detectRoutingMismatch(ctx: FailureContext): FailureDiagnosis | null {
  const intent = detectIntent(ctx.query);
  const expectedAgent = expectedAgentForIntent(intent);

  if (expectedAgent && expectedAgent !== ctx.agentType) {
    return {
      failureClass: 'RoutingError',
      severity: 'medium',
      detectedIntent: intent,
      rootCause: `Query about "${intent}" routed to "${ctx.agentType}" instead of expected "${expectedAgent}"`,
      action: 'clear_sticky_route',
      suggestion: `Sticky route may be trapping session on wrong agent`,
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Intent detection (simple keyword-based, no LLM call)
// ---------------------------------------------------------------------------

function detectIntent(query: string): string {
  const lower = query.toLowerCase();
  for (const {pattern, intent} of INTENT_PATTERNS) {
    if (pattern.test(lower)) return intent;
  }
  return 'unknown';
}

function expectedAgentForIntent(intent: string): string | null {
  const map: Record<string, string> = {
    'schema-design': 'schema',
    'resources': 'resources',
    'product': 'product',
    'code': 'code',
    'access-control': 'general',
    'integrations': 'code',
    'import': 'code',
    'migration': 'code',
    'search': 'general',
    'cluster-connection': 'general',
    'pricing': 'resources',
  };
  return map[intent] ?? null;
}

// ---------------------------------------------------------------------------
// Action dispatcher
// ---------------------------------------------------------------------------

function safeTextForPersistence(value: string, key: string): string {
  return JSON.stringify(summarizeForDebugLog(value, key));
}

export function handlePostAction(ctx: FailureContext): void {
  const diagnosis = classifyFailure(ctx);

  if (diagnosis.action === 'none') return;

  console.log('[PostAction]', JSON.stringify({
    requestId: ctx.requestId,
    class: diagnosis.failureClass,
    severity: diagnosis.severity,
    cause: summarizeForDebugLog(diagnosis.rootCause, 'reasoning'),
  }));

  switch (diagnosis.action) {
    case 'log_gap':
      insertDocGap({
        requestId: ctx.requestId,
        query: safeTextForPersistence(ctx.query, 'query'),
        sessionId: ctx.sessionId,
        detectedIntent: diagnosis.detectedIntent,
        toolsCalled: ctx.toolsCalled,
        confidenceLevel: ctx.confidenceLevel,
        responseText: safeTextForPersistence(ctx.fullText, 'response'),
      }).catch(() => {});
      break;

    case 'clear_sticky_route':
      // Clear the sticky route so next request can re-route correctly
      if (ctx.sessionId) {
        clearSessionRoute(ctx.sessionId);
      }
      // Also log the gap for visibility
      insertDocGap({
        requestId: ctx.requestId,
        query: safeTextForPersistence(ctx.query, 'query'),
        sessionId: ctx.sessionId,
        detectedIntent: diagnosis.detectedIntent,
        toolsCalled: ctx.toolsCalled,
        confidenceLevel: ctx.confidenceLevel,
        responseText: safeTextForPersistence(ctx.fullText, 'response'),
      }).catch(() => {});
      break;

    case 'log_content_quality':
      upsertContentQuality({
        url: ctx.sectionFilter || 'unknown',
        issueType: 'demoted',
        suggestion: diagnosis.suggestion,
      }).catch(() => {});
      break;

    case 'log_error_and_alert':
      // Error already logged via logEvent — additional gap logging for visibility
      insertDocGap({
        requestId: ctx.requestId,
        query: safeTextForPersistence(ctx.query, 'query'),
        sessionId: ctx.sessionId,
        detectedIntent: 'error',
        toolsCalled: ctx.toolsCalled,
        confidenceLevel: 'error',
        responseText: ctx.error ? safeTextForPersistence(`Error: ${ctx.error}`, 'error') : safeTextForPersistence(ctx.fullText, 'response'),
      }).catch(() => {});
      break;
  }
}
