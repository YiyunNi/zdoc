import {describe, it, expect} from 'vitest';
import {resolvePolicyIntent} from './intent.js';

describe('resolvePolicyIntent', () => {
  it('returns null when zilliz-cli topic is not present', () => {
    const intent = resolvePolicyIntent('how to install cli quickly', ['indexes']);
    expect(intent).toBeNull();
  });

  it('matches get-started intent for zilliz-cli quickstart phrasing', () => {
    const intent = resolvePolicyIntent('get started with zilliz cli in minutes', ['zilliz-cli']);
    expect(intent).toBe('zcli_get_started_in_minutes');
  });

  it('matches skill-setup intent', () => {
    const intent = resolvePolicyIntent('enable your agent to use zilliz through the official cli skill', ['zilliz-cli']);
    expect(intent).toBe('zcli_agent_skill_setup');
  });

  it('matches usage patterns intent', () => {
    const intent = resolvePolicyIntent('what are others building with the zilliz cli', ['zilliz-cli']);
    expect(intent).toBe('zcli_usage_patterns');
  });

  it('matches roadmap/feature request intent', () => {
    const intent = resolvePolicyIntent('explore the zilliz cli roadmap and share your feature requests', ['zilliz-cli']);
    expect(intent).toBe('zcli_roadmap_feedback');
  });

  it('returns null for ambiguous zilliz-cli messages', () => {
    const intent = resolvePolicyIntent('how does context affect vector operations?', ['zilliz-cli']);
    expect(intent).toBeNull();
  });
});
