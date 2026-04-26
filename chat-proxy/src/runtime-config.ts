import { getRuntimeConfigValue, getProviderProfile, isDbReady } from './db.js';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel, EmbeddingModel } from 'ai';

// ---------------------------------------------------------------------------
// ResolvedModel discriminated union
// ---------------------------------------------------------------------------

export type ResolvedModel =
  | { source: 'profile'; provider: 'openai-compatible'; model: string; baseURL: string; apiKey: string }
  | { source: 'profile'; provider: 'bedrock'; model: string; region: string; accessKeyId: string; secretAccessKey: string; sessionToken?: string }
  | { source: 'env'; provider: 'openai-compatible'; model: string }
  | { source: 'env'; provider: 'bedrock'; model: string };

// ---------------------------------------------------------------------------
// Env var fallbacks per config key
// ---------------------------------------------------------------------------

const ENV_DEFAULTS: Record<string, { provider: string; modelEnv: string; defaultModel: string }> = {
  chat:          { provider: 'openai-compatible', modelEnv: 'AI_MODEL',              defaultModel: 'gpt-4o' },
  router:        { provider: 'openai-compatible', modelEnv: 'ROUTER_MODEL',           defaultModel: 'openai/gpt-4o-mini' },
  grounding:     { provider: 'openai-compatible', modelEnv: 'GROUNDING_MODEL',        defaultModel: 'google/gemini-3.1-flash-lite-preview' },
  rewrite:       { provider: 'openai-compatible', modelEnv: 'REWRITE_MODEL',          defaultModel: 'google/gemini-3.1-flash-lite-preview' },
  embedding:     { provider: 'openai-compatible', modelEnv: 'SEMANTIC_EMBEDDING_MODEL', defaultModel: 'text-embedding-3-small' },
  'agent:general':  { provider: 'openai-compatible', modelEnv: 'GENERAL_MODEL',       defaultModel: '' },
  'agent:schema':   { provider: 'openai-compatible', modelEnv: 'SCHEMA_MODEL',        defaultModel: '' },
  'agent:resources':{ provider: 'openai-compatible', modelEnv: 'RESOURCES_MODEL',     defaultModel: '' },
  'agent:product':  { provider: 'openai-compatible', modelEnv: 'PRODUCT_MODEL',       defaultModel: '' },
  'agent:code':     { provider: 'openai-compatible', modelEnv: 'CODE_MODEL',          defaultModel: '' },
};

// ---------------------------------------------------------------------------
// resolveModel — returns ResolvedModel with profile credentials or env fallback
// ---------------------------------------------------------------------------

export async function resolveModel(key: string): Promise<ResolvedModel> {
  // Check DB first
  if (isDbReady()) {
    const dbConfig = await getRuntimeConfigValue(key);
    if (dbConfig) {
      const { provider, model, profileName } = dbConfig;

      // If a provider profile is attached, resolve credentials from it
      if (profileName) {
        const profile = await getProviderProfile(profileName);
        if (profile) {
          if (provider === 'openai-compatible') {
            const creds = profile.credentials;
            return {
              source: 'profile',
              provider: 'openai-compatible',
              model,
              baseURL: profile.base_url || process.env.AI_BASE_URL || 'https://api.openai.com/v1',
              apiKey: creds.api_key,
            };
          }
          if (provider === 'bedrock') {
            const creds = profile.credentials;
            return {
              source: 'profile',
              provider: 'bedrock',
              model,
              region: profile.region || process.env.AWS_REGION || 'us-east-1',
              accessKeyId: creds.access_key_id,
              secretAccessKey: creds.secret_access_key,
              sessionToken: creds.session_token,
            };
          }
        }
      }

      // DB had a value but no profile (or profile not found) — use env vars
      const typedProvider = provider as 'openai-compatible' | 'bedrock';
      return { source: 'env', provider: typedProvider, model };
    }
  }

  // No DB value — fall through to env defaults
  const defaults = ENV_DEFAULTS[key];
  if (!defaults) return { source: 'env', provider: 'openai-compatible', model: 'unknown' };

  const model = process.env[defaults.modelEnv] || defaults.defaultModel;
  if (!model) {
    // Agent-specific key with no override — inherit from chat
    return resolveModel('chat');
  }

  return { source: 'env', provider: defaults.provider as 'openai-compatible' | 'bedrock', model };
}

// ---------------------------------------------------------------------------
// createModelInstance — overloads for backward compat
// ---------------------------------------------------------------------------

export function createModelInstance(provider: string, modelId: string): LanguageModel;
export function createModelInstance(resolved: ResolvedModel): LanguageModel;
export function createModelInstance(providerOrResolved: string | ResolvedModel, modelId?: string): LanguageModel {
  // Backward-compatible (string, string) overload
  if (typeof providerOrResolved === 'string') {
    return createFromEnv(providerOrResolved, modelId!);
  }

  // New ResolvedModel overload
  const resolved = providerOrResolved;
  switch (resolved.provider) {
    case 'bedrock': {
      // Lazy import to avoid requiring bedrock SDK when not used
      const { createAmazonBedrock } = require('@ai-sdk/amazon-bedrock');
      if (resolved.source === 'profile') {
        const bedrock = createAmazonBedrock({
          region: resolved.region,
          accessKeyId: resolved.accessKeyId,
          secretAccessKey: resolved.secretAccessKey,
          sessionToken: resolved.sessionToken,
        });
        return bedrock(resolved.model);
      }
      // env source
      const bedrock = createAmazonBedrock({
        region: process.env.AWS_REGION || 'us-east-1',
      });
      return bedrock(resolved.model);
    }
    case 'openai-compatible':
    default: {
      if (resolved.source === 'profile') {
        const openai = createOpenAI({
          baseURL: resolved.baseURL,
          apiKey: resolved.apiKey,
        });
        return openai(resolved.model);
      }
      // env source
      return createFromEnv('openai-compatible', resolved.model);
    }
  }
}

/** Internal helper: create model from env vars (old behavior) */
function createFromEnv(provider: string, modelId: string): LanguageModel {
  switch (provider) {
    case 'bedrock': {
      const { createAmazonBedrock } = require('@ai-sdk/amazon-bedrock');
      const bedrock = createAmazonBedrock({
        region: process.env.AWS_REGION || 'us-east-1',
      });
      return bedrock(modelId);
    }
    case 'openai-compatible':
    default: {
      const openai = createOpenAI({
        baseURL: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
        apiKey: process.env.AI_API_KEY,
      });
      return openai(modelId);
    }
  }
}

// ---------------------------------------------------------------------------
// getModel — convenience: resolve + create in one call
// ---------------------------------------------------------------------------

export async function getModel(key: string): Promise<LanguageModel> {
  const resolved = await resolveModel(key);
  return createModelInstance(resolved);
}

// ---------------------------------------------------------------------------
// getEmbeddingModel — resolve + create an embedding model
// ---------------------------------------------------------------------------

export async function getEmbeddingModel(key: string = 'embedding'): Promise<EmbeddingModel> {
  const resolved = await resolveModel(key);
  switch (resolved.provider) {
    case 'bedrock': {
      const { createAmazonBedrock } = require('@ai-sdk/amazon-bedrock');
      if (resolved.source === 'profile') {
        const bedrock = createAmazonBedrock({
          region: resolved.region,
          accessKeyId: resolved.accessKeyId,
          secretAccessKey: resolved.secretAccessKey,
          sessionToken: resolved.sessionToken,
        });
        return bedrock.embedding(resolved.model);
      }
      const bedrock = createAmazonBedrock({
        region: process.env.AWS_REGION || 'us-east-1',
      });
      return bedrock.embedding(resolved.model);
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
