// Relevance guard: injection detection + greeting redirect
// Domain keyword allowlist removed — agents handle relevance now

const INJECTION_PATTERNS = [
  /ignore\s{1,20}(all\s{1,20})?previous\s{1,20}instructions/i,
  /you\s{1,20}are\s{1,20}now\s{1,20}a/i,
  /system\s{1,20}prompt/i,
  /forget\s{1,20}(all\s{1,20})?your\s{1,20}(instructions|rules)/i,
  /disregard\s{1,20}(all\s{1,20})?prior/i,
  /new\s{1,20}instructions?\s{0,20}:/i,
  /pretend\s{1,20}(you\s{1,20}are|to\s{1,20}be)/i,
  /act\s{1,20}as\s{1,20}if/i,
  /override\s{1,20}(your|the)\s{1,20}(system|rules)/i,
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
