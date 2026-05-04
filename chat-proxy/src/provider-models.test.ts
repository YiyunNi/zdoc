import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listModelsForProfile, type ProviderProfileFull } from './provider-models.js';

const mockSend = vi.fn();

vi.mock('@aws-sdk/client-bedrock', async () => {
  return {
    BedrockClient: vi.fn().mockImplementation(function (this: { send: typeof mockSend }) { this.send = mockSend; }),
    ListFoundationModelsCommand: vi.fn().mockImplementation(function (this: { __type: string; input: any }, input: any) { this.__type = 'ListFoundationModels'; this.input = input; }),
    ListInferenceProfilesCommand: vi.fn().mockImplementation(function (this: { __type: string; input: any }, input: any) { this.__type = 'ListInferenceProfiles'; this.input = input; }),
  };
});

function buildBedrockProfile(overrides: Partial<ProviderProfileFull> = {}): ProviderProfileFull {
  return {
    name: 'bedrock-test',
    provider_type: 'bedrock',
    base_url: null,
    region: 'us-east-1',
    credentials: {
      access_key_id: 'AKIA_TEST',
      secret_access_key: 'secret',
    },
    notes: null,
    created_at: '',
    updated_at: '',
    ...overrides,
  };
}

describe('listModelsForProfile — bedrock', () => {
  beforeEach(() => {
    mockSend.mockReset();
  });

  it('returns foundation models with TEXT/EMBEDDING + ON_DEMAND/INFERENCE_PROFILE', async () => {
    mockSend.mockImplementation(async (cmd: any) => {
      if (cmd.__type === 'ListFoundationModels') {
        return {
          modelSummaries: [
            { modelId: 'anthropic.claude-3-sonnet', modelName: 'Claude 3 Sonnet', outputModalities: ['TEXT'], inferenceTypesSupported: ['ON_DEMAND'] },
            { modelId: 'anthropic.claude-3-haiku', modelName: 'Claude 3 Haiku', outputModalities: ['TEXT'], inferenceTypesSupported: ['ON_DEMAND'] },
            { modelId: 'amazon.titan-embeddings', modelName: 'Titan Embeddings', outputModalities: ['EMBEDDING'], inferenceTypesSupported: ['ON_DEMAND'] },
            { modelId: 'anthropic.claude-sonnet-4-5', modelName: 'Claude Sonnet 4.5', outputModalities: ['TEXT'], inferenceTypesSupported: ['INFERENCE_PROFILE'] },
            { modelId: 'cohere.embed-v4', modelName: 'Cohere Embed v4', outputModalities: ['EMBEDDING'], inferenceTypesSupported: ['INFERENCE_PROFILE'] },
          ],
        };
      }
      if (cmd.__type === 'ListInferenceProfiles') {
        return { inferenceProfileSummaries: [] };
      }
      throw new Error('Unexpected command');
    });

    const models = await listModelsForProfile(buildBedrockProfile());
    expect(models.map(m => m.id)).toEqual([
      'anthropic.claude-3-sonnet',
      'anthropic.claude-3-haiku',
      'amazon.titan-embeddings',
      'anthropic.claude-sonnet-4-5',
      'cohere.embed-v4',
    ]);
  });

  it('includes SYSTEM_DEFINED inference profiles', async () => {
    mockSend.mockImplementation(async (cmd: any) => {
      if (cmd.__type === 'ListFoundationModels') {
        return { modelSummaries: [] };
      }
      if (cmd.__type === 'ListInferenceProfiles') {
        return {
          inferenceProfileSummaries: [
            { inferenceProfileId: 'us.anthropic.claude-sonnet-4-6', inferenceProfileName: 'Claude Sonnet 4.6 US', status: 'ACTIVE', type: 'SYSTEM_DEFINED' },
            { inferenceProfileId: 'eu.anthropic.claude-sonnet-4-6', inferenceProfileName: 'Claude Sonnet 4.6 EU', status: 'ACTIVE', type: 'SYSTEM_DEFINED' },
            { inferenceProfileId: 'inactive-profile', inferenceProfileName: 'Inactive', status: 'INACTIVE', type: 'SYSTEM_DEFINED' },
          ],
        };
      }
      throw new Error('Unexpected command');
    });

    const models = await listModelsForProfile(buildBedrockProfile());
    expect(models.map(m => m.id)).toEqual([
      'us.anthropic.claude-sonnet-4-6',
      'eu.anthropic.claude-sonnet-4-6',
    ]);
  });

  it('merges foundation models and inference profiles', async () => {
    mockSend.mockImplementation(async (cmd: any) => {
      if (cmd.__type === 'ListFoundationModels') {
        return {
          modelSummaries: [
            { modelId: 'anthropic.claude-3-sonnet', modelName: 'Claude 3 Sonnet', outputModalities: ['TEXT'], inferenceTypesSupported: ['ON_DEMAND'] },
          ],
        };
      }
      if (cmd.__type === 'ListInferenceProfiles') {
        return {
          inferenceProfileSummaries: [
            { inferenceProfileId: 'us.anthropic.claude-sonnet-4-6', inferenceProfileName: 'Claude Sonnet 4.6 US', status: 'ACTIVE', type: 'SYSTEM_DEFINED' },
          ],
        };
      }
      throw new Error('Unexpected command');
    });

    const models = await listModelsForProfile(buildBedrockProfile());
    expect(models).toEqual([
      { id: 'anthropic.claude-3-sonnet', name: 'Claude 3 Sonnet' },
      { id: 'us.anthropic.claude-sonnet-4-6', name: 'Claude Sonnet 4.6 US' },
    ]);
  });

  it('passes typeEquals SYSTEM_DEFINED to ListInferenceProfilesCommand', async () => {
    const { ListInferenceProfilesCommand } = await import('@aws-sdk/client-bedrock');
    mockSend.mockResolvedValue({ modelSummaries: [], inferenceProfileSummaries: [] });

    await listModelsForProfile(buildBedrockProfile());

    expect(ListInferenceProfilesCommand).toHaveBeenCalledWith({ typeEquals: 'SYSTEM_DEFINED' });
  });

  it('filters to chat-only models when type=chat', async () => {
    mockSend.mockImplementation(async (cmd: any) => {
      if (cmd.__type === 'ListFoundationModels') {
        return {
          modelSummaries: [
            { modelId: 'anthropic.claude-3-sonnet', modelName: 'Claude 3 Sonnet', outputModalities: ['TEXT'], inferenceTypesSupported: ['ON_DEMAND'] },
            { modelId: 'amazon.titan-embeddings', modelName: 'Titan Embeddings', outputModalities: ['EMBEDDING'], inferenceTypesSupported: ['ON_DEMAND'] },
          ],
        };
      }
      if (cmd.__type === 'ListInferenceProfiles') {
        return {
          inferenceProfileSummaries: [
            { inferenceProfileId: 'us.anthropic.claude-sonnet-4-6', inferenceProfileName: 'Claude Sonnet 4.6 US', status: 'ACTIVE', type: 'SYSTEM_DEFINED' },
            { inferenceProfileId: 'us.cohere.embed-v4', inferenceProfileName: 'Cohere Embed v4 US', status: 'ACTIVE', type: 'SYSTEM_DEFINED' },
          ],
        };
      }
      throw new Error('Unexpected command');
    });

    const models = await listModelsForProfile(buildBedrockProfile(), 'chat');
    expect(models.map(m => m.id)).toEqual([
      'anthropic.claude-3-sonnet',
      'us.anthropic.claude-sonnet-4-6',
    ]);
  });

  it('filters to embedding-only models when type=embedding', async () => {
    mockSend.mockImplementation(async (cmd: any) => {
      if (cmd.__type === 'ListFoundationModels') {
        return {
          modelSummaries: [
            { modelId: 'anthropic.claude-3-sonnet', modelName: 'Claude 3 Sonnet', outputModalities: ['TEXT'], inferenceTypesSupported: ['ON_DEMAND'] },
            { modelId: 'amazon.titan-embeddings', modelName: 'Titan Embeddings', outputModalities: ['EMBEDDING'], inferenceTypesSupported: ['ON_DEMAND'] },
          ],
        };
      }
      if (cmd.__type === 'ListInferenceProfiles') {
        return {
          inferenceProfileSummaries: [
            { inferenceProfileId: 'us.anthropic.claude-sonnet-4-6', inferenceProfileName: 'Claude Sonnet 4.6 US', status: 'ACTIVE', type: 'SYSTEM_DEFINED' },
            { inferenceProfileId: 'us.cohere.embed-v4', inferenceProfileName: 'Cohere Embed v4 US', status: 'ACTIVE', type: 'SYSTEM_DEFINED' },
          ],
        };
      }
      throw new Error('Unexpected command');
    });

    const models = await listModelsForProfile(buildBedrockProfile(), 'embedding');
    expect(models.map(m => m.id)).toEqual([
      'amazon.titan-embeddings',
      'us.cohere.embed-v4',
    ]);
  });
});
