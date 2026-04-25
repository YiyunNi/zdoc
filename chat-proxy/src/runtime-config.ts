import { getRuntimeConfigValue, isDbReady } from './db.js';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModelV1 } from 'ai';

// Env var fallbacks per config key
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

export async function resolveModel(key: string): Promise<{ provider: string; model: string }> {
  // Check DB first
  if (isDbReady()) {
    const dbConfig = await getRuntimeConfigValue(key);
    if (dbConfig) return dbConfig;
  }

  // Agent keys inherit from chat when no override
  const defaults = ENV_DEFAULTS[key];
  if (!defaults) return { provider: 'openai-compatible', model: 'unknown' };

  const model = process.env[defaults.modelEnv] || defaults.defaultModel;
  if (!model) {
    // Agent-specific key with no override — inherit from chat
    return resolveModel('chat');
  }

  return { provider: defaults.provider, model };
}

export function createModelInstance(provider: string, modelId: string): LanguageModelV1 {
  switch (provider) {
    case 'bedrock': {
      // Lazy import to avoid requiring bedrock SDK when not used
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

// Convenience: resolve + create in one call
export async function getModel(key: string): Promise<LanguageModelV1> {
  const { provider, model } = await resolveModel(key);
  return createModelInstance(provider, model);
}
