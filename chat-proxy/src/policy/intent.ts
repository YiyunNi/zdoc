const PILOT_TOPIC = 'zilliz-cli';

function normalize(input: string): string {
  return input.toLowerCase().replace(/\s+/g, ' ').trim();
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some(pattern => pattern.test(text));
}

export function resolvePolicyIntent(query: string, topics: string[]): string | null {
  if (!topics.includes(PILOT_TOPIC)) return null;

  const text = normalize(query);

  if (hasAny(text, [
    /get started.*zilliz cli.*minutes?/i,
    /quickstart.*zilliz cli/i,
    /install.*login.*create cluster/i,
  ])) return 'zcli_get_started_in_minutes';

  if (hasAny(text, [
    /enable.*agent.*zilliz.*cli skill/i,
    /official cli skill/i,
    /connect.*coding agent.*zilliz/i,
  ])) return 'zcli_agent_skill_setup';

  if (hasAny(text, [
    /what are others building with.*zilliz cli/i,
    /usage patterns.*zilliz cli/i,
    /real[- ]world.*zilliz cli/i,
  ])) return 'zcli_usage_patterns';

  if (hasAny(text, [
    /(?:zilliz cli.*roadmap|roadmap.*zilliz cli)/i,
    /(?:zilliz cli.*feature requests?|feature requests?.*zilliz cli)/i,
  ])) return 'zcli_roadmap_feedback';

  return null;
}
