#!/usr/bin/env npx tsx
/**
 * Migrate data from doc_chunks → doc_chunks_v2 (BM25 hybrid search).
 *
 * Uses the Milvus Node SDK queryIterator to export all rows (no pagination limits),
 * then reinserts via REST API. The BM25 function on doc_chunks_v2 auto-generates
 * content_sparse on insert.
 *
 * Usage:
 *   export $(grep -v '^#' ../.env | xargs)
 *   npx tsx scripts/migrate-to-v2.ts
 */

import { MilvusClient } from '@zilliz/milvus2-sdk-node';

const SRC_COLLECTION = 'doc_chunks';
const DST_COLLECTION = 'doc_chunks_v2';
const ITERATOR_BATCH = 50;
const INSERT_BATCH = 50;

const ZILLIZ_ENDPOINT = (process.env.ZILLIZ_ENDPOINT || '').replace(/\/$/, '');
const ZILLIZ_TOKEN = process.env.ZILLIZ_TOKEN || '';

if (!ZILLIZ_ENDPOINT || !ZILLIZ_TOKEN) {
  console.error('Error: ZILLIZ_ENDPOINT and ZILLIZ_TOKEN env vars are required');
  process.exit(1);
}

// SDK client for export (gRPC — supports queryIterator)
const grpcAddress = ZILLIZ_ENDPOINT.replace(/^https?:\/\//, '');
const client = new MilvusClient({
  address: grpcAddress,
  token: ZILLIZ_TOKEN,
  ssl: true,
  timeout: 60000,
});

// REST client for insert (keeps consistency with the rest of the codebase)
const restBase = ZILLIZ_ENDPOINT.startsWith('https://') ? ZILLIZ_ENDPOINT : `https://${ZILLIZ_ENDPOINT}`;

async function zillizRequest(path: string, body: unknown): Promise<any> {
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

const OUTPUT_FIELDS = ['id', 'doc_url', 'doc_url_md', 'doc_title', 'section', 'content', 'content_hash', 'weight', 'embedding'];

async function exportAll(): Promise<any[]> {
  // Get actual queryable row count (get_stats includes deleted-but-not-compacted rows)
  const countResult = await client.count({ collection_name: SRC_COLLECTION });
  const totalRows = countResult.data;
  console.log(`[migrate] Source collection has ${totalRows} queryable rows`);

  const iterator = await client.queryIterator({
    collection_name: SRC_COLLECTION,
    output_fields: OUTPUT_FIELDS,
    batchSize: ITERATOR_BATCH,
    expr: 'id != ""',
  });

  const allRows: any[] = [];
  let page = 0;

  for await (const batch of iterator) {
    allRows.push(...batch);
    page++;
    console.log(`[migrate] Exported ${allRows.length}/${totalRows} rows (page ${page})`);
  }

  return allRows;
}

async function insertBatch(rows: any[]): Promise<void> {
  const data = rows.map(row => ({
    id: row.id,
    doc_url: row.doc_url || '',
    doc_url_md: row.doc_url_md || '',
    doc_title: row.doc_title || '',
    section: row.section || '',
    content: row.content || '',
    content_hash: row.content_hash || '',
    weight: row.weight ?? 1.0,
    embedding: row.embedding,
  }));

  await zillizRequest('/entities/insert', {
    collectionName: DST_COLLECTION,
    data,
  });
}

async function main() {
  // Verify both collections exist
  const srcExists = await client.hasCollection({ collection_name: SRC_COLLECTION });
  const dstExists = await zillizRequest('/collections/has', { collectionName: DST_COLLECTION });

  if (!srcExists.value) {
    console.error(`[migrate] Source collection ${SRC_COLLECTION} does not exist`);
    process.exit(1);
  }
  if (!dstExists?.has) {
    console.error(`[migrate] Destination collection ${DST_COLLECTION} does not exist. Run the server once to create it.`);
    process.exit(1);
  }

  // Check if destination already has data
  const dstStats = await zillizRequest('/collections/get_stats', { collectionName: DST_COLLECTION });
  const dstRows = Number(dstStats?.rowCount ?? 0);
  if (dstRows > 0) {
    console.warn(`[migrate] Destination already has ${dstRows} rows. Continuing will add duplicates.`);
    console.warn('[migrate] Press Ctrl+C within 3 seconds to abort...');
    await new Promise(r => setTimeout(r, 3000));
  }

  // Export via SDK iterator
  console.log(`[migrate] Exporting from ${SRC_COLLECTION} using queryIterator...`);
  const rows = await exportAll();
  console.log(`[migrate] Exported ${rows.length} total rows`);

  if (rows.length === 0) {
    console.log('[migrate] Nothing to migrate');
    return;
  }

  const withEmbedding = rows.filter(r => r.embedding && r.embedding.length > 0);
  console.log(`[migrate] ${withEmbedding.length}/${rows.length} rows have embeddings`);

  if (withEmbedding.length === 0) {
    console.error('[migrate] No embeddings found — cannot migrate without vector data');
    process.exit(1);
  }

  // Insert in batches via REST
  console.log(`[migrate] Inserting into ${DST_COLLECTION} in batches of ${INSERT_BATCH}...`);
  let inserted = 0;

  for (let i = 0; i < withEmbedding.length; i += INSERT_BATCH) {
    const batch = withEmbedding.slice(i, i + INSERT_BATCH);
    await insertBatch(batch);
    inserted += batch.length;
    if (inserted % 500 === 0 || inserted === withEmbedding.length) {
      console.log(`[migrate] Inserted ${inserted}/${withEmbedding.length}`);
    }
  }

  // Verify
  const finalStats = await zillizRequest('/collections/get_stats', { collectionName: DST_COLLECTION });
  console.log(`[migrate] Done! ${DST_COLLECTION} now has ${finalStats?.rowCount} rows`);
  console.log(`[migrate] BM25 sparse vectors were auto-generated by the server function`);
}

main().catch(err => {
  console.error('[migrate] Fatal error:', err);
  process.exit(1);
});
