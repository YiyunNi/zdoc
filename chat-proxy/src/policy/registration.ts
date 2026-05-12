import {readFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRATION_FILE = join(__dirname, '..', '..', 'policies', 'registration.yml');
const TOPIC_NAME_PATTERN = /^[a-z0-9-]+$/;

interface RegistrationConfigDoc {
  policyMode?: {
    enabled?: unknown;
    topics?: unknown;
  };
}

interface PolicyModeRegistrationCached {
  enabled: boolean;
  topics: string[];
}

let cache: PolicyModeRegistrationCached | null = null;

function toSafeDefault(): PolicyModeRegistrationCached {
  return {enabled: false, topics: []};
}

function parseTopics(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const normalized = value
    .filter(item => typeof item === 'string')
    .map(item => item.trim().toLowerCase())
    .filter(item => item.length > 0 && TOPIC_NAME_PATTERN.test(item));

  return [...new Set(normalized)];
}

function loadRegistrationConfig(): PolicyModeRegistrationCached {
  try {
    const raw = readFileSync(REGISTRATION_FILE, 'utf-8');
    const doc = yaml.load(raw) as RegistrationConfigDoc;
    const enabled = doc?.policyMode?.enabled === true;
    const topics = parseTopics(doc?.policyMode?.topics);

    if (!enabled) {
      return {enabled: false, topics: []};
    }

    if (topics.length === 0) {
      return toSafeDefault();
    }

    return {enabled: true, topics};
  } catch {
    return toSafeDefault();
  }
}

export function getPolicyModeRegistration(): {enabled: boolean; topics: Set<string>} {
  if (!cache) {
    cache = loadRegistrationConfig();
  }

  return {
    enabled: cache.enabled,
    topics: new Set(cache.topics),
  };
}

export function clearPolicyRegistrationCache(): void {
  cache = null;
}
