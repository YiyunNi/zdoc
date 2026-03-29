// Shared Zilliz Cloud REST API client
// Used by rag.ts for vector search and semantic caching

export const ZILLIZ_ENDPOINT = (process.env.ZILLIZ_ENDPOINT || '').replace(/\/$/, '');
export const ZILLIZ_TOKEN = process.env.ZILLIZ_TOKEN || '';
export const EMBEDDING_DIM = Number(process.env.EMBEDDING_DIM) || 768;

const restBase = ZILLIZ_ENDPOINT.startsWith('https://') ? ZILLIZ_ENDPOINT : `https://${ZILLIZ_ENDPOINT}`;

export function isZillizConfigured(): boolean {
  return !!(ZILLIZ_ENDPOINT && ZILLIZ_TOKEN);
}

export async function zillizRequest(path: string, body: unknown): Promise<any> {
  const res = await fetch(`${restBase}/v2/vectordb${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ZILLIZ_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (json.code !== 0 && json.code !== 200) {
    throw new Error(`Zilliz API error (${path}): ${json.code} ${json.message}`);
  }
  return json.data;
}

// ---------------------------------------------------------------------------
// Embedding generation (shared between rag.ts and semantic-cache.ts)
// ---------------------------------------------------------------------------

export const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'baai/bge-large-en-v1.5';
export const EMBEDDING_API_KEY = process.env.EMBEDDING_API_KEY || process.env.AI_API_KEY || '';
export const EMBEDDING_BASE_URL = (process.env.EMBEDDING_BASE_URL || process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');

export async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch(`${EMBEDDING_BASE_URL}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${EMBEDDING_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {data: Array<{embedding: number[]}>};
  return data.data[0].embedding;
}
