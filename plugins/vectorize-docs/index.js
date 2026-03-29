// @ts-check
/**
 * Docusaurus plugin to index documentation into Zilliz Cloud on postBuild.
 * Generates embeddings and inserts into doc_chunks_v2 collection.
 *
 * Environment variables:
 * - ZILLIZ_ENDPOINT, ZILLIZ_TOKEN (required)
 * - EMBEDDING_MODEL, EMBEDDING_API_KEY, EMBEDDING_BASE_URL, EMBEDDING_DIM
 * - DOCS_SITE_URL
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {extractTitle, chunkText} = require('./utils');

// ---------------------------------------------------------------------------
// Config from env
// ---------------------------------------------------------------------------

const ZILLIZ_ENDPOINT = (process.env.ZILLIZ_ENDPOINT || '').replace(/\/$/, '');
const ZILLIZ_TOKEN = process.env.ZILLIZ_TOKEN || '';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'baai/bge-large-en-v1.5';
const EMBEDDING_API_KEY = process.env.EMBEDDING_API_KEY || '';
const EMBEDDING_BASE_URL = (process.env.EMBEDDING_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const EMBEDDING_DIM = Number(process.env.EMBEDDING_DIM) || 768;
const DOCS_SITE_URL = (process.env.DOCS_SITE_URL || 'https://docs.zilliz.com').replace(/\/$/, '');
const COLLECTION_NAME = 'doc_chunks_v2';
const BATCH_SIZE = 50;
const EMBEDDING_CONCURRENCY = 10;

const restBase = ZILLIZ_ENDPOINT.startsWith('https://') ? ZILLIZ_ENDPOINT : `https://${ZILLIZ_ENDPOINT}`;

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

async function zillizRequest(path, body) {
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

async function generateEmbedding(text) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${EMBEDDING_BASE_URL}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${EMBEDDING_API_KEY}`,
      },
      body: JSON.stringify({model: EMBEDDING_MODEL, input: text}),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Embedding API error: ${res.status} ${errText}`);
    }
    const data = await res.json();
    return data.data[0].embedding;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

function escapeZillizFilter(value) {
  return value.replace(/(["\\])/g, '\\$1');
}

async function ensureCollections() {
  const collections = [
    {
      name: 'doc_chunks_v2',
      schema: {
        fields: [
          {fieldName: 'id', dataType: 'VarChar', isPrimary: true, elementTypeParams: {max_length: 512}},
          {fieldName: 'doc_url', dataType: 'VarChar', elementTypeParams: {max_length: 1024}},
          {fieldName: 'doc_url_md', dataType: 'VarChar', elementTypeParams: {max_length: 1024}},
          {fieldName: 'doc_title', dataType: 'VarChar', elementTypeParams: {max_length: 512}},
          {fieldName: 'section', dataType: 'VarChar', elementTypeParams: {max_length: 128}},
          {fieldName: 'content', dataType: 'VarChar', elementTypeParams: {max_length: 8192}},
          {fieldName: 'content_hash', dataType: 'VarChar', elementTypeParams: {max_length: 64}},
          {fieldName: 'weight', dataType: 'Float'},
          {fieldName: 'embedding', dataType: 'FloatVector', elementTypeParams: {dim: EMBEDDING_DIM}},
        ],
      },
      indexParams: [{fieldName: 'embedding', indexName: 'embedding_idx', metricType: 'COSINE'}],
    },
  ];

  for (const {name, schema, indexParams} of collections) {
    try {
      const exists = await zillizRequest('/collections/has', {collectionName: name});
      if (!exists?.has) {
        console.log(`[vectorize-docs] Creating collection: ${name}`);
        await zillizRequest('/collections/create', {collectionName: name, schema});
        await zillizRequest('/indexes/create', {collectionName: name, indexParams});
        console.log(`[vectorize-docs] Collection ${name} created with index`);
      }
    } catch (err) {
      console.error(`[vectorize-docs] Failed to create ${name}:`, err.message);
    }

    // Load collection with retry — newly created collections may need time
    const MAX_LOAD_RETRIES = 5;
    for (let attempt = 1; attempt <= MAX_LOAD_RETRIES; attempt++) {
      try {
        await zillizRequest('/collections/load', {collectionName: name});
        // Verify load succeeded by describing the collection
        const desc = await zillizRequest('/collections/describe', {collectionName: name});
        console.log(`[vectorize-docs] Collection ${name} loaded (state: ${desc?.loadState || 'unknown'})`);
        break;
      } catch (err) {
        console.warn(`[vectorize-docs] Load attempt ${attempt}/${MAX_LOAD_RETRIES} for ${name}: ${err.message}`);
        if (attempt < MAX_LOAD_RETRIES) {
          await new Promise(r => setTimeout(r, 2000 * attempt));
        } else {
          console.error(`[vectorize-docs] Failed to load ${name} after ${MAX_LOAD_RETRIES} attempts`);
          throw new Error(`Collection ${name} could not be loaded`);
        }
      }
    }
  }
}

function collectMarkdownFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) collectMarkdownFiles(fullPath, results);
    else if (entry.name.endsWith('.md')) results.push(fullPath);
  }
  return results;
}

async function processInBatches(items, batchSize, processor) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    results.push(...await processor(batch));
  }
  return results;
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

module.exports = function vectorizeDocsPlugin(context, options) {
  return {
    name: 'vectorize-docs',

    async postBuild({outDir}) {
      if (!ZILLIZ_ENDPOINT || !ZILLIZ_TOKEN || !EMBEDDING_API_KEY) {
        const missing = [];
        if (!ZILLIZ_ENDPOINT) missing.push('ZILLIZ_ENDPOINT');
        if (!ZILLIZ_TOKEN) missing.push('ZILLIZ_TOKEN');
        if (!EMBEDDING_API_KEY) missing.push('EMBEDDING_API_KEY');
        console.warn(`[vectorize-docs] ⚠️  Skipping - missing env vars: ${missing.join(', ')}`);
        return;
      }

      console.log('[vectorize-docs] Starting documentation indexing...');

      await ensureCollections();
      console.log('[vectorize-docs] Collections ready');

      // 1. Collect markdown files
      const docDirs = ['docs', 'docs-byoc', 'reference'].map(d => path.join(outDir, d));
      const mdFiles = [];
      for (const dir of docDirs) {
        if (fs.existsSync(dir)) collectMarkdownFiles(dir, mdFiles);
      }
      console.log(`[vectorize-docs] Found ${mdFiles.length} markdown files`);

      // 2. Compute content hashes
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

      // 3. Fetch existing hashes from Zilliz
      let existingHashes = new Map();
      try {
        const existing = await zillizRequest('/entities/query', {
          collectionName: COLLECTION_NAME,
          filter: 'id != ""',
          outputFields: ['id', 'content_hash'],
          limit: 16384,
        });
        for (const row of existing || []) {
          const docUrlMd = row.id.split('#')[0];
          existingHashes.set(docUrlMd, row.content_hash);
        }
        console.log(`[vectorize-docs] Found ${existingHashes.size} existing docs`);
      } catch (err) {
        console.log('[vectorize-docs] No existing data or query failed, indexing all');
      }

      // 4. Filter changed docs
      const toUpsert = fileData.filter(f => existingHashes.get(f.docUrlMd) !== f.hash);
      console.log(`[vectorize-docs] ${toUpsert.length} new/modified, ${fileData.length - toUpsert.length} unchanged`);

      if (toUpsert.length === 0) {
        console.log('[vectorize-docs] No changes to index');
        return;
      }

      // 5. Delete old chunks for docs being re-indexed
      const toDeleteIds = toUpsert.map(d => d.docUrlMd);
      if (toDeleteIds.length > 0) {
        try {
          await zillizRequest('/entities/delete', {
            collectionName: COLLECTION_NAME,
            filter: toDeleteIds.map(id => `id like "${escapeZillizFilter(id)}#%"`).join(' or '),
          });
        } catch (err) {
          console.log('[vectorize-docs] Delete failed (may not exist):', err.message);
        }
      }

      // 6. Build chunks (ensuring content ≤8192 chars)
      const allChunks = [];
      for (const doc of toUpsert) {
        const chunks = chunkText(doc.content);
        for (let j = 0; j < chunks.length; j++) {
          const truncatedTitle = doc.title.length > 512 ? doc.title.slice(0, 512) : doc.title;
          // CRITICAL: Truncate BEFORE generating embeddings to avoid mismatch
          let content = chunks[j];
          if (content.length > 8192) {
            content = content.slice(0, 8192);
            console.warn(`[vectorize-docs] Truncated content (${chunks[j].length} chars): ${doc.docUrlMd}#${j}`);
          }
          if (doc.title.length > 512) console.warn(`[vectorize-docs] Truncated title (${doc.title.length} chars): ${doc.docUrlMd}`);
          allChunks.push({
            id: `${doc.docUrlMd}#${j}`,
            doc_url: doc.docUrl,
            doc_url_md: doc.docUrlMd,
            doc_title: truncatedTitle,
            section: doc.section,
            content: content,
            content_hash: doc.hash,
            weight: 1.0,
          });
        }
      }
      console.log(`[vectorize-docs] Created ${allChunks.length} chunks`);

      // 7. Generate embeddings with progress logging
      console.log('[vectorize-docs] Generating embeddings...');
      const chunksWithEmbeddings = [];
      const failed = [];

      const CONCURRENCY = 10;
      for (let i = 0; i < allChunks.length; i += CONCURRENCY) {
        const batch = allChunks.slice(i, i + CONCURRENCY);
        const results = await Promise.allSettled(
          batch.map(async chunk => ({
            chunk,
            embedding: await generateEmbedding(chunk.content)
          }))
        );

        for (let j = 0; j < results.length; j++) {
          const result = results[j];
          if (result.status === 'fulfilled') {
            chunksWithEmbeddings.push({...result.value.chunk, embedding: result.value.embedding});
          } else {
            const chunkId = batch[j].id;
            failed.push({id: chunkId, error: result.reason?.message || 'Unknown error'});
            console.warn(`[vectorize-docs] Failed embedding for ${chunkId}: ${result.reason?.message}`);
          }
        }

        console.log(`[vectorize-docs] Generated ${Math.min(i + CONCURRENCY, allChunks.length)}/${allChunks.length} embeddings`);
      }

      if (failed.length > 0) {
        console.warn(`[vectorize-docs] ${failed.length} chunks failed, continuing with ${chunksWithEmbeddings.length}`);
      }

      // 8. Insert to Zilliz in batches
      console.log('[vectorize-docs] Inserting to Zilliz...');
      let insertedCount = 0;
      let insertFailed = 0;
      for (let i = 0; i < chunksWithEmbeddings.length; i += BATCH_SIZE) {
        const batch = chunksWithEmbeddings.slice(i, i + BATCH_SIZE);
        try {
          await zillizRequest('/entities/insert', {
            collectionName: COLLECTION_NAME,
            data: batch,
          });
          insertedCount += batch.length;
        } catch (err) {
          insertFailed += batch.length;
          console.error(`[vectorize-docs] Insert batch failed (${batch.length} chunks): ${err.message}`);
        }
        if ((i + BATCH_SIZE) % 100 === 0 || i + BATCH_SIZE >= chunksWithEmbeddings.length) {
          console.log(`[vectorize-docs] Inserted ${insertedCount}/${chunksWithEmbeddings.length} (failed: ${insertFailed})`);
        }
      }

      console.log(`[vectorize-docs] Done! Indexed ${insertedCount} chunks from ${toUpsert.length} docs${insertFailed > 0 ? ` (${insertFailed} failed)` : ''}`);
    },
  };
};
