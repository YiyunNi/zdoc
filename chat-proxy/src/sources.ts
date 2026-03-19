import {randomUUID} from 'crypto';
import type {SourceType, ExternalSource} from './types.js';
import {zillizRequest, isZillizConfigured, EMBEDDING_DIM} from './zilliz-client.js';
import {generateEmbedding} from './rag.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SOURCES_COLLECTION = 'external_sources';
const CHUNKS_COLLECTION = 'doc_chunks';
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;
const CHARS_PER_TOKEN = 4;
const MAX_GITHUB_FILES = 50;

// ---------------------------------------------------------------------------
// Text chunking (copied from plugins/vectorize-docs/utils.js)
// ---------------------------------------------------------------------------

export function chunkText(text: string): string[] {
  const chunkChars = CHUNK_SIZE * CHARS_PER_TOKEN;
  const overlapChars = CHUNK_OVERLAP * CHARS_PER_TOKEN;

  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    if ((currentChunk.length + para.length + 2) > chunkChars && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      const overlap = currentChunk.slice(-overlapChars);
      currentChunk = overlap + '\n\n' + para;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // Fallback: character-based splitting for single large paragraphs
  if (chunks.length === 0 && text.trim()) {
    for (let i = 0; i < text.length; i += chunkChars - overlapChars) {
      chunks.push(text.slice(i, i + chunkChars).trim());
    }
  }

  return chunks;
}

// ---------------------------------------------------------------------------
// Title extraction
// ---------------------------------------------------------------------------

function extractTitle(text: string): string {
  const match = text.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : '';
}

// ---------------------------------------------------------------------------
// Collection management
// ---------------------------------------------------------------------------

export async function ensureSourcesCollection(): Promise<void> {
  if (!isZillizConfigured()) {
    console.warn('[Sources] Zilliz not configured — external sources disabled');
    return;
  }

  const data = await zillizRequest('/collections/has', {collectionName: SOURCES_COLLECTION});
  if (data?.has) {
    console.log(`[Sources] Collection ${SOURCES_COLLECTION} exists`);
    return;
  }

  console.log(`[Sources] Creating collection: ${SOURCES_COLLECTION}`);
  await zillizRequest('/collections/create', {
    collectionName: SOURCES_COLLECTION,
    schema: {
      fields: [
        {fieldName: 'id', dataType: 'VarChar', isPrimary: true, elementTypeParams: {max_length: '64'}},
        {fieldName: 'url', dataType: 'VarChar', elementTypeParams: {max_length: '512'}},
        {fieldName: 'source_type', dataType: 'VarChar', elementTypeParams: {max_length: '32'}},
        {fieldName: 'label', dataType: 'VarChar', elementTypeParams: {max_length: '256'}},
        {fieldName: 'status', dataType: 'VarChar', elementTypeParams: {max_length: '16'}},
        {fieldName: 'chunk_count', dataType: 'Int32'},
        {fieldName: 'last_indexed', dataType: 'VarChar', elementTypeParams: {max_length: '32'}},
        {fieldName: 'error_message', dataType: 'VarChar', elementTypeParams: {max_length: '1024'}},
        {fieldName: 'created_at', dataType: 'VarChar', elementTypeParams: {max_length: '32'}},
        {fieldName: 'embedding', dataType: 'FloatVector', elementTypeParams: {dim: String(EMBEDDING_DIM)}},
      ],
    },
    indexParams: [
      {fieldName: 'embedding', indexType: 'AUTOINDEX', metricType: 'COSINE'},
    ],
  });
  console.log(`[Sources] Collection ${SOURCES_COLLECTION} created`);
}

// ---------------------------------------------------------------------------
// Registry CRUD
// ---------------------------------------------------------------------------

export async function addSource(url: string, sourceType: SourceType, label: string): Promise<ExternalSource> {
  const id = randomUUID();
  const now = new Date().toISOString();
  const dummyEmbedding = new Array(EMBEDDING_DIM).fill(0);

  const source: ExternalSource = {
    id,
    url,
    source_type: sourceType,
    label,
    status: 'pending',
    chunk_count: 0,
    last_indexed: '',
    error_message: '',
    created_at: now,
  };

  await zillizRequest('/entities/insert', {
    collectionName: SOURCES_COLLECTION,
    data: [{...source, embedding: dummyEmbedding}],
  });

  return source;
}

export async function listSources(): Promise<ExternalSource[]> {
  const data = await zillizRequest('/entities/query', {
    collectionName: SOURCES_COLLECTION,
    filter: 'id != ""',
    outputFields: ['id', 'url', 'source_type', 'label', 'status', 'chunk_count', 'last_indexed', 'error_message', 'created_at'],
    limit: 100,
  });

  return (data || []).map((row: any) => ({
    id: row.id,
    url: row.url,
    source_type: row.source_type as SourceType,
    label: row.label,
    status: row.status,
    chunk_count: row.chunk_count || 0,
    last_indexed: row.last_indexed || '',
    error_message: row.error_message || '',
    created_at: row.created_at || '',
  }));
}

export async function getSource(id: string): Promise<ExternalSource | null> {
  const data = await zillizRequest('/entities/query', {
    collectionName: SOURCES_COLLECTION,
    filter: `id == "${id}"`,
    outputFields: ['id', 'url', 'source_type', 'label', 'status', 'chunk_count', 'last_indexed', 'error_message', 'created_at'],
    limit: 1,
  });

  if (!data || data.length === 0) return null;

  const row = data[0];
  return {
    id: row.id,
    url: row.url,
    source_type: row.source_type as SourceType,
    label: row.label,
    status: row.status,
    chunk_count: row.chunk_count || 0,
    last_indexed: row.last_indexed || '',
    error_message: row.error_message || '',
    created_at: row.created_at || '',
  };
}

async function updateSourceStatus(
  id: string,
  updates: Partial<Pick<ExternalSource, 'status' | 'chunk_count' | 'last_indexed' | 'error_message'>>,
): Promise<void> {
  const existing = await getSource(id);
  if (!existing) throw new Error(`Source not found: ${id}`);

  const dummyEmbedding = new Array(EMBEDDING_DIM).fill(0);
  await zillizRequest('/entities/upsert', {
    collectionName: SOURCES_COLLECTION,
    data: [{
      id: existing.id,
      url: existing.url,
      source_type: existing.source_type,
      label: existing.label,
      status: updates.status ?? existing.status,
      chunk_count: updates.chunk_count ?? existing.chunk_count,
      last_indexed: updates.last_indexed ?? existing.last_indexed,
      error_message: updates.error_message ?? existing.error_message,
      created_at: existing.created_at,
      embedding: dummyEmbedding,
    }],
  });
}

export async function deleteSource(id: string): Promise<void> {
  // Delete chunks from doc_chunks first
  await deleteChunksForSource(id);

  // Delete registry entry
  await zillizRequest('/entities/delete', {
    collectionName: SOURCES_COLLECTION,
    filter: `id == "${id}"`,
  });
}

async function deleteChunksForSource(sourceId: string): Promise<void> {
  await zillizRequest('/entities/delete', {
    collectionName: CHUNKS_COLLECTION,
    filter: `id like "ext:${sourceId}:%"`,
  });
}

// ---------------------------------------------------------------------------
// Content fetching — web
// ---------------------------------------------------------------------------

export async function fetchWebContent(url: string): Promise<{title: string; content: string}> {
  const res = await fetch(url, {
    headers: {'User-Agent': 'ZdocBot/1.0'},
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }

  let html = await res.text();

  // Limit to 100KB
  html = html.slice(0, 100_000);

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const title = h1Match?.[1]?.trim() || titleMatch?.[1]?.trim() || url;

  // Strip scripts, styles, nav, footer
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  html = html.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  html = html.replace(/<header[\s\S]*?<\/header>/gi, '');

  // Prefer <main> or <article> content
  const mainMatch = html.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i);
  const articleMatch = html.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i);
  const bodyContent = mainMatch?.[1] || articleMatch?.[1] || html;

  // Strip remaining tags
  let content = bodyContent.replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  content = content
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // Collapse whitespace
  content = content.replace(/\s+/g, ' ').trim();

  return {title, content};
}

// ---------------------------------------------------------------------------
// Content fetching — GitHub
// ---------------------------------------------------------------------------

const GITHUB_FILE_PATTERNS = [
  /^README\.md$/i,
  /^docs\/.+\.md$/i,
  /^examples?\/.+\.(md|py|js|ts|go|java)$/i,
  /^samples?\/.+\.(md|py|js|ts|go|java)$/i,
];

export function parseGitHubUrl(url: string): {owner: string; repo: string} {
  // Formats: "github:owner/repo" or "https://github.com/owner/repo"
  const colonMatch = url.match(/^github:([^/]+)\/([^/]+)/);
  if (colonMatch) return {owner: colonMatch[1], repo: colonMatch[2]};

  const urlMatch = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (urlMatch) return {owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, '')};

  throw new Error(`Invalid GitHub URL: ${url}`);
}

export async function fetchGitHubContent(
  owner: string,
  repo: string,
): Promise<Array<{path: string; title: string; content: string}>> {
  const token = process.env.GITHUB_TOKEN || '';
  const headers: Record<string, string> = {
    'User-Agent': 'ZdocBot/1.0',
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Get repo tree
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
    {headers, signal: AbortSignal.timeout(15000)},
  );

  if (!treeRes.ok) {
    throw new Error(`GitHub API error: ${treeRes.status} ${await treeRes.text()}`);
  }

  const treeData = (await treeRes.json()) as {tree: Array<{path: string; type: string}>};

  // Filter to matching files
  const matchingPaths = treeData.tree
    .filter(entry => entry.type === 'blob' && GITHUB_FILE_PATTERNS.some(p => p.test(entry.path)))
    .map(entry => entry.path)
    .slice(0, MAX_GITHUB_FILES);

  // Fetch each file's content
  const results: Array<{path: string; title: string; content: string}> = [];

  for (const path of matchingPaths) {
    try {
      const rawRes = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`,
        {headers: {'User-Agent': 'ZdocBot/1.0'}, signal: AbortSignal.timeout(10000)},
      );

      if (!rawRes.ok) continue;

      const content = await rawRes.text();
      const title = extractTitle(content) || path;
      results.push({path, title, content});
    } catch {
      // Skip files that fail to fetch
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Indexing pipeline
// ---------------------------------------------------------------------------

export async function indexSource(id: string): Promise<{chunkCount: number}> {
  const source = await getSource(id);
  if (!source) throw new Error(`Source not found: ${id}`);

  await updateSourceStatus(id, {status: 'indexing', error_message: ''});

  try {
    // Delete old chunks
    await deleteChunksForSource(id);

    // Fetch content
    let documents: Array<{title: string; content: string; url: string}>;

    if (source.source_type === 'external-github') {
      const {owner, repo} = parseGitHubUrl(source.url);
      const files = await fetchGitHubContent(owner, repo);
      documents = files.map(f => ({
        title: f.title,
        content: f.content,
        url: `https://github.com/${owner}/${repo}/blob/HEAD/${f.path}`,
      }));
    } else {
      // external-web
      const {title, content} = await fetchWebContent(source.url);
      documents = [{title, content, url: source.url}];
    }

    // Chunk and embed
    let totalChunks = 0;
    for (let docIdx = 0; docIdx < documents.length; docIdx++) {
      const doc = documents[docIdx];
      const chunks = chunkText(doc.content);

      // Process chunks in batches
      const chunkData: Array<Record<string, unknown>> = [];
      for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
        const chunk = chunks[chunkIdx];
        const embedding = await generateEmbedding(chunk);
        chunkData.push({
          id: `ext:${id}:${docIdx}#${chunkIdx}`,
          doc_url: doc.url,
          doc_url_md: doc.url,
          doc_title: doc.title,
          section: source.source_type,
          content: chunk.slice(0, 16000),
          content_hash: '',
          embedding,
        });
      }

      if (chunkData.length > 0) {
        await zillizRequest('/entities/insert', {
          collectionName: CHUNKS_COLLECTION,
          data: chunkData,
        });
        totalChunks += chunkData.length;
      }
    }

    await updateSourceStatus(id, {
      status: 'indexed',
      chunk_count: totalChunks,
      last_indexed: new Date().toISOString(),
    });

    console.log(`[Sources] Indexed source ${id} (${source.label}): ${totalChunks} chunks`);
    return {chunkCount: totalChunks};
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await updateSourceStatus(id, {status: 'error', error_message: message}).catch(() => {});
    throw err;
  }
}
