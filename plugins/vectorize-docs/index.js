// @ts-check
/**
 * Docusaurus plugin to vectorize documentation into Zilliz Cloud on postBuild.
 * Uses the Zilliz Cloud REST API (v2) — no SDK dependency needed.
 *
 * Environment variables:
 * - ZILLIZ_ENDPOINT          — e.g. https://in03-xxx.serverless.gcp-us-west1.cloud.zilliz.com
 * - ZILLIZ_TOKEN
 * - EMBEDDING_MODEL          — default: baai/bge-large-en-v1.5
 * - EMBEDDING_API_KEY         (falls back to AI_API_KEY)
 * - EMBEDDING_BASE_URL        (falls back to AI_BASE_URL)
 * - EMBEDDING_DIM             — default: 1024
 * - DOCS_SITE_URL             — default: https://docs.zilliz.com
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const {extractTitle, chunkText} = require('./utils');

const COLLECTION_NAME = 'doc_chunks';

module.exports = function vectorizeDocsPlugin(context, options) {
  return {
    name: 'vectorize-docs',

    async postBuild({outDir}) {
      const endpoint = (process.env.ZILLIZ_ENDPOINT || '').replace(/\/$/, '');
      const token = process.env.ZILLIZ_TOKEN;
      const embeddingApiKey = process.env.EMBEDDING_API_KEY || process.env.AI_API_KEY;
      const embeddingModel = process.env.EMBEDDING_MODEL || 'baai/bge-large-en-v1.5';
      const embeddingBaseUrl = (process.env.EMBEDDING_BASE_URL || process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
      const embeddingDim = Number(process.env.EMBEDDING_DIM) || 1024;
      const docsSiteUrl = (process.env.DOCS_SITE_URL || 'https://docs.zilliz.com').replace(/\/$/, '');

      if (!endpoint || !token) {
        console.log('[vectorize-docs] Skipping — ZILLIZ_ENDPOINT and ZILLIZ_TOKEN not set');
        return;
      }

      if (!embeddingApiKey) {
        console.log('[vectorize-docs] Skipping — EMBEDDING_API_KEY not set');
        return;
      }

      // Derive REST base URL from the gRPC endpoint
      // e.g. https://in03-xxx.serverless.gcp-us-west1.cloud.zilliz.com
      const restBase = endpoint.startsWith('https://') ? endpoint : `https://${endpoint}`;

      const zilliz = createZillizClient(restBase, token);

      console.log('[vectorize-docs] Starting documentation vectorization...');

      // 1. Collect all markdown files from build output
      const docDirs = ['docs', 'docs-byoc', 'reference'].map(d => path.join(outDir, d));
      const mdFiles = [];

      for (const dir of docDirs) {
        if (!fs.existsSync(dir)) continue;
        collectMarkdownFiles(dir, mdFiles);
      }

      console.log(`[vectorize-docs] Found ${mdFiles.length} markdown files`);

      // 2. Compute content hashes for incremental sync
      const fileData = mdFiles.map(filePath => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const hash = crypto.createHash('md5').update(content).digest('hex');
        const relativePath = path.relative(outDir, filePath);
        const docUrlMd = `/${relativePath}`;
        const docUrl = docUrlMd.replace(/\.md$/, '').replace(/\/index$/, '');
        const title = extractTitle(content) || path.basename(filePath, '.md');
        const section = relativePath.startsWith('docs-byoc') ? 'byoc-guides'
          : relativePath.startsWith('reference') ? 'api-reference'
          : 'cloud-guides';

        return {filePath, content, hash, docUrlMd, docUrl, title, section};
      });

      // 3. Ensure collection exists
      const hasCollection = await zilliz.hasCollection(COLLECTION_NAME);
      if (!hasCollection) {
        await zilliz.createCollection(COLLECTION_NAME, embeddingDim);
        console.log(`[vectorize-docs] Created collection: ${COLLECTION_NAME}`);
      }

      // 4. Fetch existing hashes for incremental sync
      let existingHashes = new Map();
      try {
        const rows = await zilliz.query(COLLECTION_NAME, '', ['doc_url_md', 'content_hash'], 16384);
        for (const row of rows) {
          existingHashes.set(row.doc_url_md, row.content_hash);
        }
        console.log(`[vectorize-docs] Found ${existingHashes.size} existing docs in collection`);
      } catch (err) {
        console.warn('[vectorize-docs] Could not fetch existing hashes:', err.message);
      }

      // 5. Determine what needs updating
      const newDocUrlMds = new Set(fileData.map(f => f.docUrlMd));
      const toUpsert = fileData.filter(f => existingHashes.get(f.docUrlMd) !== f.hash);
      const toDelete = [...existingHashes.keys()].filter(url => !newDocUrlMds.has(url));

      console.log(`[vectorize-docs] Changes: ${toUpsert.length} new/modified, ${toDelete.length} deleted, ${fileData.length - toUpsert.length} unchanged`);

      // 6. Delete removed docs
      if (toDelete.length > 0) {
        for (const docUrlMd of toDelete) {
          try {
            await zilliz.deleteByFilter(COLLECTION_NAME, `doc_url_md == "${docUrlMd}"`);
          } catch (err) {
            console.warn(`[vectorize-docs] Failed to delete ${docUrlMd}:`, err.message);
          }
        }
        console.log(`[vectorize-docs] Deleted ${toDelete.length} removed docs`);
      }

      // 7. Chunk, embed, and upsert changed docs
      if (toUpsert.length === 0) {
        console.log('[vectorize-docs] No changes to index');
        return;
      }

      let totalChunks = 0;
      const batchSize = 10; // docs per batch

      for (let i = 0; i < toUpsert.length; i += batchSize) {
        const batch = toUpsert.slice(i, i + batchSize);
        const allChunks = [];

        for (const doc of batch) {
          // Delete old chunks for this doc
          try {
            await zilliz.deleteByFilter(COLLECTION_NAME, `doc_url_md == "${doc.docUrlMd}"`);
          } catch { /* might not exist yet */ }

          // Chunk the content
          const chunks = chunkText(doc.content);

          for (let j = 0; j < chunks.length; j++) {
            allChunks.push({
              id: `${doc.docUrlMd}#${j}`,
              doc_url: doc.docUrl,
              doc_url_md: doc.docUrlMd,
              doc_title: doc.title.slice(0, 255),
              section: doc.section,
              content: chunks[j].slice(0, 4000),
              content_hash: doc.hash,
              _text: chunks[j], // temp field for embedding
            });
          }
        }

        // Generate embeddings in batches
        const embeddingBatchSize = 20;
        for (let j = 0; j < allChunks.length; j += embeddingBatchSize) {
          const embBatch = allChunks.slice(j, j + embeddingBatchSize);
          const texts = embBatch.map(c => c._text.slice(0, 2000));

          try {
            await retry(async () => {
              const embeddings = await generateEmbeddings(texts, embeddingBaseUrl, embeddingApiKey, embeddingModel);

              const insertData = embBatch.map((chunk, idx) => ({
                id: chunk.id,
                doc_url: chunk.doc_url,
                doc_url_md: chunk.doc_url_md,
                doc_title: chunk.doc_title,
                section: chunk.section,
                content: chunk.content,
                content_hash: chunk.content_hash,
                embedding: embeddings[idx],
              }));

              await zilliz.insert(COLLECTION_NAME, insertData);
              totalChunks += insertData.length;
            });
          } catch (err) {
            console.error(`[vectorize-docs] Embedding/insert error (gave up):`, err.message);
          }
        }

        console.log(`[vectorize-docs] Progress: ${Math.min(i + batchSize, toUpsert.length)}/${toUpsert.length} docs processed`);
      }

      console.log(`[vectorize-docs] Done! Indexed ${totalChunks} chunks from ${toUpsert.length} docs`);
    },
  };
};

// ---------------------------------------------------------------------------
// Zilliz Cloud REST API client (v2)
// ---------------------------------------------------------------------------

function createZillizClient(baseUrl, token) {
  async function request(method, path, body) {
    const res = await fetch(`${baseUrl}/v2/vectordb${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json();
    if (json.code !== 0 && json.code !== 200) {
      throw new Error(`Zilliz API error (${path}): ${json.code} ${json.message}`);
    }
    return json.data;
  }

  return {
    async hasCollection(collectionName) {
      const data = await request('POST', '/collections/has', {collectionName});
      return data?.has === true;
    },

    async createCollection(collectionName, dim) {
      await request('POST', '/collections/create', {
        collectionName,
        schema: {
          fields: [
            {fieldName: 'id', dataType: 'VarChar', isPrimary: true, elementTypeParams: {max_length: '512'}},
            {fieldName: 'doc_url', dataType: 'VarChar', elementTypeParams: {max_length: '512'}},
            {fieldName: 'doc_url_md', dataType: 'VarChar', elementTypeParams: {max_length: '512'}},
            {fieldName: 'doc_title', dataType: 'VarChar', elementTypeParams: {max_length: '256'}},
            {fieldName: 'section', dataType: 'VarChar', elementTypeParams: {max_length: '128'}},
            {fieldName: 'content', dataType: 'VarChar', elementTypeParams: {max_length: '16384'}},
            {fieldName: 'content_hash', dataType: 'VarChar', elementTypeParams: {max_length: '64'}},
            {fieldName: 'embedding', dataType: 'FloatVector', elementTypeParams: {dim: String(dim)}},
          ],
        },
        indexParams: [
          {fieldName: 'embedding', indexType: 'AUTOINDEX', metricType: 'COSINE'},
        ],
      });
    },

    async query(collectionName, filter, outputFields, limit) {
      const data = await request('POST', '/entities/query', {
        collectionName,
        filter: filter || '',
        outputFields,
        limit,
      });
      return data || [];
    },

    async deleteByFilter(collectionName, filter) {
      await request('POST', '/entities/delete', {
        collectionName,
        filter,
      });
    },

    async insert(collectionName, data) {
      await request('POST', '/entities/insert', {
        collectionName,
        data,
      });
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function retry(fn, maxAttempts = 3, baseDelayMs = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.warn(`[vectorize-docs] Attempt ${attempt}/${maxAttempts} failed: ${err.message}. Retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

function collectMarkdownFiles(dir, files) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectMarkdownFiles(fullPath, files);
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
}

async function generateEmbeddings(texts, baseUrl, apiKey, model) {
  const res = await fetch(`${baseUrl}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({model, input: texts}),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.data.map(d => d.embedding);
}
