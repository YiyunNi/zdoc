#!/usr/bin/env npx tsx
/**
 * Migration script:
 * 1. Add `weight` (Float) field to `doc_chunks` collection
 * 2. Delete all external source entries and their chunks
 *
 * Usage:
 *   ZILLIZ_ENDPOINT=<endpoint> ZILLIZ_TOKEN=<token> npx tsx scripts/migrate-weight-field.ts
 */

const ZILLIZ_ENDPOINT = (process.env.ZILLIZ_ENDPOINT || '').replace(/\/$/, '');
const ZILLIZ_TOKEN = process.env.ZILLIZ_TOKEN || '';

if (!ZILLIZ_ENDPOINT || !ZILLIZ_TOKEN) {
  console.error('Error: ZILLIZ_ENDPOINT and ZILLIZ_TOKEN env vars are required');
  process.exit(1);
}

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

async function main() {
  // --- Step 1: Add weight field to doc_chunks ---
  console.log('Step 1: Adding weight field to doc_chunks...');
  try {
    await zillizRequest('/collections/fields/add', {
      collectionName: 'doc_chunks',
      schema: {fieldName: 'weight', dataType: 'Float', nullable: true},
    });
    console.log('  ✓ Added weight field to doc_chunks');
  } catch (err) {
    const msg = (err as Error).message || '';
    if (msg.includes('already exist')) {
      console.log('  ✓ weight field already exists on doc_chunks');
    } else {
      console.error('  ✗ Failed:', msg);
    }
  }

  // --- Step 2: Delete external source chunks from doc_chunks ---
  console.log('\nStep 2: Deleting external source chunks from doc_chunks...');
  try {
    await zillizRequest('/entities/delete', {
      collectionName: 'doc_chunks',
      filter: 'id like "ext:%"',
    });
    console.log('  ✓ Deleted all ext:* chunks from doc_chunks');
  } catch (err) {
    console.error('  ✗ Failed:', (err as Error).message);
  }

  // --- Step 3: Delete all entries from external_sources ---
  console.log('\nStep 3: Clearing external_sources collection...');
  try {
    // Query all source IDs
    const sources = await zillizRequest('/entities/query', {
      collectionName: 'external_sources',
      filter: 'id != ""',
      outputFields: ['id', 'label', 'status', 'chunk_count'],
      limit: 200,
    });

    if (!sources || sources.length === 0) {
      console.log('  ✓ external_sources already empty');
    } else {
      console.log(`  Found ${sources.length} sources:`);
      for (const s of sources) {
        console.log(`    - ${s.label} (${s.id}) [${s.status}, ${s.chunk_count} chunks]`);
      }

      // Delete them all
      const ids = sources.map((s: any) => s.id);
      await zillizRequest('/entities/delete', {
        collectionName: 'external_sources',
        filter: `id in [${ids.map((id: string) => `"${id}"`).join(',')}]`,
      });
      console.log(`  ✓ Deleted ${ids.length} entries from external_sources`);
    }
  } catch (err) {
    const msg = (err as Error).message || '';
    if (msg.includes('not found') || msg.includes('not exist')) {
      console.log('  ✓ external_sources collection does not exist (nothing to clean)');
    } else {
      console.error('  ✗ Failed:', msg);
    }
  }

  console.log('\nDone!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
