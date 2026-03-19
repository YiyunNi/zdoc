// Shared Zilliz Cloud REST API client
// Used by rag.ts, logger.ts, and sources.ts

export const ZILLIZ_ENDPOINT = (process.env.ZILLIZ_ENDPOINT || '').replace(/\/$/, '');
export const ZILLIZ_TOKEN = process.env.ZILLIZ_TOKEN || '';
export const EMBEDDING_DIM = Number(process.env.EMBEDDING_DIM) || 1024;

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
