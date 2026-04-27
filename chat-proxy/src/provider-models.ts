// ---------------------------------------------------------------------------
// listModelsForProfile — fetch available models from a provider profile
//
// openai-compatible: GET {base_url}/models with Bearer auth (OpenAI shape)
// bedrock:           ListFoundationModelsCommand, filtered to text + on-demand
// ---------------------------------------------------------------------------

export interface ProviderProfileFull {
  name: string;
  provider_type: string;
  base_url: string | null;
  region: string | null;
  credentials: Record<string, string>;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListedModel {
  id: string;
  name?: string;
}

const FETCH_TIMEOUT_MS = 10_000;

export async function listModelsForProfile(profile: ProviderProfileFull): Promise<ListedModel[]> {
  switch (profile.provider_type) {
    case 'openai-compatible':
      return listOpenAIModels(profile);
    case 'bedrock':
      return listBedrockModels(profile);
    default:
      throw new Error(`Unsupported provider_type: ${profile.provider_type}`);
  }
}

async function listOpenAIModels(profile: ProviderProfileFull): Promise<ListedModel[]> {
  const baseUrl = (profile.base_url || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const apiKey = profile.credentials.api_key;
  if (!apiKey) throw new Error('Profile is missing api_key credential');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(baseUrl + '/models', {
      headers: { Authorization: 'Bearer ' + apiKey },
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const snippet = text.length > 200 ? text.slice(0, 200) + '…' : text;
      throw new Error(`HTTP ${res.status} ${res.statusText}${snippet ? ': ' + snippet : ''}`);
    }
    const json = await res.json() as { data?: Array<{ id: string }> };
    if (!Array.isArray(json.data)) {
      throw new Error('Unexpected response shape: missing data[]');
    }
    return json.data
      .filter(m => m && typeof m.id === 'string')
      .map(m => ({ id: m.id }));
  } finally {
    clearTimeout(timer);
  }
}

async function listBedrockModels(profile: ProviderProfileFull): Promise<ListedModel[]> {
  const region = profile.region || 'us-east-1';
  const { accessKeyId, secretAccessKey, sessionToken } = {
    accessKeyId: profile.credentials.access_key_id,
    secretAccessKey: profile.credentials.secret_access_key,
    sessionToken: profile.credentials.session_token || undefined,
  };
  if (!accessKeyId || !secretAccessKey) {
    throw new Error('Profile is missing access_key_id / secret_access_key credentials');
  }

  const { BedrockClient, ListFoundationModelsCommand, ListInferenceProfilesCommand } = await import('@aws-sdk/client-bedrock');
  const client = new BedrockClient({
    region,
    credentials: { accessKeyId, secretAccessKey, sessionToken },
  });

  // Fetch standard foundation models (in-region/on-demand)
  const foundationOut = await client.send(new ListFoundationModelsCommand({}));
  const foundationSummaries = foundationOut.modelSummaries || [];
  const foundationModels = foundationSummaries
    .filter(m =>
      Array.isArray(m.outputModalities) && m.outputModalities.includes('TEXT') &&
      Array.isArray(m.inferenceTypesSupported) && m.inferenceTypesSupported.includes('ON_DEMAND')
    )
    .filter(m => typeof m.modelId === 'string')
    .map(m => ({ id: m.modelId as string, name: m.modelName || undefined }));

  // Fetch cross-region inference profiles (e.g. us.anthropic.claude-sonnet-4-6)
  const inferenceOut = await client.send(new ListInferenceProfilesCommand({ typeEquals: 'SYSTEM_DEFINED' }));
  const inferenceSummaries = inferenceOut.inferenceProfileSummaries || [];
  const inferenceModels = inferenceSummaries
    .filter(p => p.status === 'ACTIVE' && typeof p.inferenceProfileId === 'string')
    .map(p => ({ id: p.inferenceProfileId as string, name: p.inferenceProfileName || undefined }));

  return [...foundationModels, ...inferenceModels];
}
