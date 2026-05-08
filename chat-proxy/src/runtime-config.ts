import { getRuntimeConfigValue, getProviderProfile, isDbReady } from './db.js';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel, EmbeddingModel } from 'ai';
import {guardBedrockEmbeddingModel, guardBedrockLanguageModel} from './bedrock-guard.js';

// ---------------------------------------------------------------------------
// Known embedding model dimensions
// ---------------------------------------------------------------------------

const MODEL_DIMENSIONS: Record<string, number> = {
  'text-embedding-3-small': 1536,
  'text-embedding-3-large': 3072,
  'text-embedding-ada-002': 1536,
  'BAAI/bge-large-en-v1.5': 1024,
  'BAAI/bge-base-en-v1.5': 768,
  'BAAI/bge-small-en-v1.5': 384,
  'BAAI/bge-m3': 1024,
  'nomic-embed-text': 768,
  'jina-embeddings-v2-base-en': 768,
  'jina-embeddings-v3': 1024,
  'gte-large': 1024,
  'gte-base': 768,
  'snowflake-arctic-embed-l': 1024,
  'snowflake-arctic-embed-m': 768,
  'cohere.embed-v4:0': 1536,
  'qwen3-embedding-0.6b': 1024,
};

/** Infer embedding dimension from model name; returns null if unknown */
export function inferEmbeddingDimension(model: string): number | null {
  const lower = model.toLowerCase();
  // Exact match first
  if (MODEL_DIMENSIONS[model] !== undefined) return MODEL_DIMENSIONS[model];
  // Case-insensitive match
  for (const [k, v] of Object.entries(MODEL_DIMENSIONS)) {
    if (lower === k.toLowerCase()) return v;
  }
  // Substring match (handles prefixed models like openai/text-embedding-3-small)
  for (const [k, v] of Object.entries(MODEL_DIMENSIONS)) {
    if (lower.includes(k.toLowerCase())) return v;
  }
  return null;
}

/** Auto-detect dimension by calling the embedding model once */
export async function detectEmbeddingDimension(model: EmbeddingModel): Promise<number> {
  const { embed } = await import('ai');
  const result = await embed({ model, value: 'dimension detection' });
  return result.embedding.length;
}

// ---------------------------------------------------------------------------
// ResolvedModel discriminated union
// ---------------------------------------------------------------------------

export type ResolvedModel =
  | { source: 'profile'; provider: 'openai-compatible'; model: string; baseURL: string; apiKey: string; dimensions?: number }
  | { source: 'profile'; provider: 'bedrock'; model: string; region: string; accessKeyId: string; secretAccessKey: string; sessionToken?: string; dimensions?: number }
  | { source: 'env'; provider: 'openai-compatible'; model: string; dimensions?: number }
  | { source: 'env'; provider: 'bedrock'; model: string; dimensions?: number };

// ---------------------------------------------------------------------------
// Env var fallbacks per config key
// ---------------------------------------------------------------------------

const ENV_DEFAULTS: Record<string, { provider: string; modelEnv: string; defaultModel: string }> = {
  chat:          { provider: 'openai-compatible', modelEnv: 'AI_MODEL',              defaultModel: 'gpt-4o' },
  router:        { provider: 'openai-compatible', modelEnv: 'ROUTER_MODEL',           defaultModel: 'openai/gpt-4o-mini' },
  grounding:     { provider: 'openai-compatible', modelEnv: 'GROUNDING_MODEL',        defaultModel: 'openai/gpt-4o-mini' },
  rewrite:       { provider: 'openai-compatible', modelEnv: 'REWRITE_MODEL',          defaultModel: 'openai/gpt-4o-mini' },
  embedding:     { provider: 'openai-compatible', modelEnv: 'SEMANTIC_EMBEDDING_MODEL', defaultModel: 'text-embedding-3-small' },
  'agent:general':  { provider: 'openai-compatible', modelEnv: 'GENERAL_MODEL',       defaultModel: '' },
  'agent:schema':   { provider: 'openai-compatible', modelEnv: 'SCHEMA_MODEL',        defaultModel: '' },
  'agent:resources':{ provider: 'openai-compatible', modelEnv: 'RESOURCES_MODEL',     defaultModel: '' },
  'agent:product':  { provider: 'openai-compatible', modelEnv: 'PRODUCT_MODEL',       defaultModel: '' },
  'agent:code':     { provider: 'openai-compatible', modelEnv: 'CODE_MODEL',          defaultModel: '' },
};

export const CONFIG_KEYS = Object.keys(ENV_DEFAULTS);

// ---------------------------------------------------------------------------
// In-memory cache for runtime config (avoids repeated DB queries per request)
// ---------------------------------------------------------------------------

const modelCache = new Map<string, {resolved: ResolvedModel; expiresAt: number}>();
const MODEL_CACHE_TTL_MS = 30_000; // 30 seconds

// ---------------------------------------------------------------------------
// resolveModel — returns ResolvedModel with profile credentials or env fallback
// ---------------------------------------------------------------------------

export async function resolveModel(key: string): Promise<ResolvedModel> {
  const now = Date.now();
  const cached = modelCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.resolved;
  }

  let result: ResolvedModel | undefined;

  // Check DB first
  if (isDbReady()) {
    const dbConfig = await getRuntimeConfigValue(key);
    if (dbConfig) {
      const { provider, model, profileName, dimensions } = dbConfig;
      const dims = dimensions ?? inferEmbeddingDimension(model) ?? undefined;

      // If a provider profile is attached, resolve credentials from it
      if (profileName) {
        const profile = await getProviderProfile(profileName);
        if (profile) {
          if (provider === 'openai-compatible') {
            const creds = profile.credentials;
            result = {
              source: 'profile',
              provider: 'openai-compatible',
              model,
              baseURL: profile.base_url || process.env.AI_BASE_URL || 'https://api.openai.com/v1',
              apiKey: creds.api_key,
              dimensions: dims,
            };
          }
          if (provider === 'bedrock') {
            const creds = profile.credentials;
            result = {
              source: 'profile',
              provider: 'bedrock',
              model,
              region: profile.region || process.env.AWS_REGION || 'us-east-1',
              accessKeyId: creds.access_key_id,
              secretAccessKey: creds.secret_access_key,
              sessionToken: creds.session_token,
              dimensions: dims,
            };
          }
        }
      }

      if (!result) {
        // DB had a value but no profile (or profile not found) — use env vars
        const typedProvider = provider as 'openai-compatible' | 'bedrock';
        result = { source: 'env', provider: typedProvider, model, dimensions: dims };
      }
    }
  }

  if (!result) {
    // No DB value — fall through to env defaults
    const defaults = ENV_DEFAULTS[key];
    if (!defaults) {
      result = { source: 'env', provider: 'openai-compatible', model: 'unknown' };
    } else {
      const model = process.env[defaults.modelEnv] || defaults.defaultModel;
      if (!model) {
        // Agent-specific key with no override — inherit from chat (bypass cache for recursion)
        return resolveModel('chat');
      }
      const dims = inferEmbeddingDimension(model) ?? undefined;
      result = { source: 'env', provider: defaults.provider as 'openai-compatible' | 'bedrock', model, dimensions: dims };
    }
  }

  modelCache.set(key, {resolved: result!, expiresAt: Date.now() + MODEL_CACHE_TTL_MS});
  return result!;
}

// ---------------------------------------------------------------------------
// createModelInstance — overloads for backward compat
// ---------------------------------------------------------------------------

export async function createModelInstance(provider: string, modelId: string): Promise<LanguageModel>;
export async function createModelInstance(resolved: ResolvedModel): Promise<LanguageModel>;
export async function createModelInstance(providerOrResolved: string | ResolvedModel, modelId?: string): Promise<LanguageModel> {
  // Backward-compatible (string, string) overload
  if (typeof providerOrResolved === 'string') {
    return await createFromEnv(providerOrResolved, modelId!);
  }

  // New ResolvedModel overload
  const resolved = providerOrResolved;
  switch (resolved.provider) {
    case 'bedrock': {
      // Lazy import to avoid requiring bedrock SDK when not used
      const { createAmazonBedrock } = await import('@ai-sdk/amazon-bedrock');
      if (resolved.source === 'profile') {
        const bedrock = createAmazonBedrock({
          region: resolved.region,
          accessKeyId: resolved.accessKeyId,
          secretAccessKey: resolved.secretAccessKey,
          sessionToken: resolved.sessionToken,
        });
        return guardBedrockLanguageModel(bedrock(resolved.model), resolved.model);
      }
      // env source
      const bedrock = createAmazonBedrock({
        region: process.env.AWS_REGION || 'us-east-1',
      });
      return guardBedrockLanguageModel(bedrock(resolved.model), resolved.model);
    }
    case 'openai-compatible':
    default: {
      if (resolved.source === 'profile') {
        const openai = createOpenAI({
          baseURL: resolved.baseURL,
          apiKey: resolved.apiKey,
        });
        return openai.chat(resolved.model);
      }
      // env source
      return await createFromEnv('openai-compatible', resolved.model);
    }
  }
}

/** Internal helper: create model from env vars (old behavior) */
async function createFromEnv(provider: string, modelId: string): Promise<LanguageModel> {
  switch (provider) {
    case 'bedrock': {
      const { createAmazonBedrock } = await import('@ai-sdk/amazon-bedrock');
      const bedrock = createAmazonBedrock({
        region: process.env.AWS_REGION || 'us-east-1',
      });
      return guardBedrockLanguageModel(bedrock(modelId), modelId);
    }
    case 'openai-compatible':
    default: {
      const openai = createOpenAI({
        baseURL: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
        apiKey: process.env.AI_API_KEY,
      });
      return openai.chat(modelId);
    }
  }
}

// ---------------------------------------------------------------------------
// getModel — convenience: resolve + create in one call
// ---------------------------------------------------------------------------

export async function getModel(key: string): Promise<LanguageModel> {
  const resolved = await resolveModel(key);
  return await createModelInstance(resolved);
}

// ---------------------------------------------------------------------------
// getEmbeddingModel — resolve + create an embedding model
// ---------------------------------------------------------------------------

export async function getEmbeddingModel(key: string = 'embedding'): Promise<EmbeddingModel> {
  const resolved = await resolveModel(key);
  switch (resolved.provider) {
    case 'bedrock': {
      const { createAmazonBedrock } = await import('@ai-sdk/amazon-bedrock');
      if (resolved.source === 'profile') {
        const bedrock = createAmazonBedrock({
          region: resolved.region,
          accessKeyId: resolved.accessKeyId,
          secretAccessKey: resolved.secretAccessKey,
          sessionToken: resolved.sessionToken,
        });
        return guardBedrockEmbeddingModel(bedrock.embedding(resolved.model), resolved.model);
      }
      const bedrock = createAmazonBedrock({
        region: process.env.AWS_REGION || 'us-east-1',
      });
      return guardBedrockEmbeddingModel(bedrock.embedding(resolved.model), resolved.model);
    }
    case 'openai-compatible':
    default: {
      if (resolved.source === 'profile') {
        const openai = createOpenAI({
          baseURL: resolved.baseURL,
          apiKey: resolved.apiKey,
        });
        return openai.embedding(resolved.model);
      }
      const openai = createOpenAI({
        baseURL: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
        apiKey: process.env.AI_API_KEY,
      });
      return openai.embedding(resolved.model);
    }
  }
}
