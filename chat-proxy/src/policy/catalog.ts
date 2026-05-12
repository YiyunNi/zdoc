import {readFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import yaml from 'js-yaml';
import type {PolicyPayload} from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const POLICY_DIR = join(__dirname, '..', '..', 'policies');

const cache = new Map<string, PolicyPayload[]>();

export function loadTopicPolicies(topic: string): PolicyPayload[] {
  const filePath = join(POLICY_DIR, `${topic}.yaml`);
  const raw = readFileSync(filePath, 'utf-8');
  const doc = yaml.load(raw) as {policies?: PolicyPayload[]};
  const policies = Array.isArray(doc?.policies) ? doc.policies : [];
  cache.set(topic, policies);
  return policies;
}

export function getPolicyByIntent(topic: string, intentId: string): PolicyPayload | null {
  const policies = cache.get(topic) ?? loadTopicPolicies(topic);
  return policies.find(p => p.intent_id === intentId) || null;
}

export function clearPolicyCache(): void {
  cache.clear();
}
