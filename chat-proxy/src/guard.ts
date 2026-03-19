// Relevance guard: injection detection + greeting redirect
// Domain keyword allowlist removed — agents handle relevance now

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+a/i,
  /system\s+prompt/i,
  /forget\s+(all\s+)?your\s+(instructions|rules)/i,
  /disregard\s+(all\s+)?prior/i,
  /new\s+instructions?\s*:/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /act\s+as\s+if/i,
  /override\s+(your|the)\s+(system|rules)/i,
];

const GREETING_PATTERNS = [
  /^(hi|hello|hey|howdy|greetings|yo|sup|hola|good\s+(morning|afternoon|evening))[\s!.,?]*$/i,
];

export const DEFLECTION_MESSAGE =
  "I'm the Zilliz Cloud documentation assistant — I can help with schema design, cluster configuration, SDK usage, and vector search. Could you rephrase your question about one of these topics?";

export const GREETING_REDIRECT =
  "Hi! I'm the Zilliz Cloud documentation assistant. I can help you with schema design, cluster setup, SDK code examples, and vector search optimization. What would you like to know?";

export interface GuardResult {
  allowed: boolean;
  reason?: 'injection' | 'greeting';
  deflection?: string;
}

export function checkGuard(message: string): GuardResult {
  // Block prompt injection
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(message)) {
      return {allowed: false, reason: 'injection', deflection: DEFLECTION_MESSAGE};
    }
  }

  // Friendly redirect for greetings
  for (const pattern of GREETING_PATTERNS) {
    if (pattern.test(message.trim())) {
      return {allowed: false, reason: 'greeting', deflection: GREETING_REDIRECT};
    }
  }

  // Let the agent system handle relevance
  return {allowed: true};
}
