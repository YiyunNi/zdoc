#!/usr/bin/env npx tsx
/**
 * One-shot migration: fix mismatched section values in doc_chunks.
 *
 * Queries documents where the URL doesn't match the stored section,
 * then upserts the corrected section value.
 *
 * Usage:
 *   ZILLIZ_ENDPOINT=<endpoint> ZILLIZ_TOKEN=<token> \
 *   npx tsx scripts/fix-section-values.ts [--dry-run]
 */

const COLLECTION_NAME = 'doc_chunks';

const ZILLIZ_ENDPOINT = (process.env.ZILLIZ_ENDPOINT || '').replace(/\/$/, '');
const ZILLIZ_TOKEN = process.env.ZILLIZ_TOKEN || '';

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

interface FixRule {
  label: string;
  filter: string;
  newSection: string;
}

const FIX_RULES: FixRule[] = [
  {
    label: 'milvus.io URLs → external-web',
    filter: 'doc_url like "%milvus.io%" and section != "external-web"',
    newSection: 'external-web',
  },
  {
    label: 'BYOC URLs with wrong section → byoc-guides',
    filter: 'doc_url like "%/byoc%" and section == "cloud-guides"',
    newSection: 'byoc-guides',
  },
  {
    label: 'API reference URLs with wrong section → api-reference',
    filter: 'doc_url like "%/reference/%" and section == "cloud-guides"',
    newSection: 'api-reference',
  },
];

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  if (!ZILLIZ_ENDPOINT || !ZILLIZ_TOKEN) {
    console.error('Error: ZILLIZ_ENDPOINT and ZILLIZ_TOKEN env vars are required');
    process.exit(1);
  }

  console.log(`Fixing section values in ${COLLECTION_NAME}${dryRun ? ' (DRY RUN)' : ''}\n`);

  let totalFixed = 0;

  for (const rule of FIX_RULES) {
    console.log(`Rule: ${rule.label}`);
    console.log(`  Filter: ${rule.filter}`);

    try {
      // Loop until no more mismatched records (query limit is 1000)
      let ruleFixed = 0;
      while (true) {
        const results = await zillizRequest('/entities/query', {
          collectionName: COLLECTION_NAME,
          filter: rule.filter,
          outputFields: ['id', 'doc_url', 'doc_url_md', 'doc_title', 'section', 'content', 'content_hash', 'weight', 'embedding'],
          limit: 1000,
        });

        if (!results || results.length === 0) {
          if (ruleFixed === 0) console.log('  No mismatched records found\n');
          else console.log(`  ✓ Fixed ${ruleFixed} records total\n`);
          break;
        }

        console.log(`  Found ${results.length} records${ruleFixed > 0 ? ` (batch ${Math.floor(ruleFixed / 1000) + 2})` : ''}`);

        if (dryRun) {
          for (const r of results.slice(0, 5)) {
            console.log(`    ${r.id}: ${r.doc_url} (${r.section} → ${rule.newSection})`);
          }
          if (results.length > 5) console.log(`    ... and ${results.length - 5} more`);
          totalFixed += results.length;
          if (results.length < 1000) { console.log(); break; }
          console.log('  (may have more — re-run without --dry-run to process all)\n');
          break;
        }

        // Upsert with corrected section
        const fixedData = results.map((r: any) => ({
          ...r,
          section: rule.newSection,
        }));

        // Upsert in batches of 100
        for (let i = 0; i < fixedData.length; i += 100) {
          const batch = fixedData.slice(i, i + 100);
          await zillizRequest('/entities/upsert', {
            collectionName: COLLECTION_NAME,
            data: batch,
          });
        }

        ruleFixed += results.length;
        totalFixed += results.length;

        // If we got fewer than 1000, we're done for this rule
        if (results.length < 1000) {
          console.log(`  ✓ Fixed ${ruleFixed} records total\n`);
          break;
        }
        console.log(`  ✓ Fixed batch of ${results.length}, checking for more...`);
      }
    } catch (err) {
      console.error(`  FAIL: ${(err as Error).message}\n`);
    }
  }

  console.log(`\nDone! ${totalFixed} records ${dryRun ? 'would be' : ''} fixed.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
