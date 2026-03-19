#!/usr/bin/env npx tsx
/**
 * Fetch Milvus integration docs from GitHub, chunk, embed, and insert
 * directly into doc_chunks with a configurable weight.
 *
 * Usage:
 *   ZILLIZ_ENDPOINT=<endpoint> ZILLIZ_TOKEN=<token> \
 *   EMBEDDING_API_KEY=<key> npx tsx scripts/seed-milvus-integrations.ts
 *
 * Options:
 *   --weight <n>    Chunk weight (default 0.85)
 *   --dry-run       Fetch and chunk but don't insert
 */

const GH_RAW = 'https://raw.githubusercontent.com/milvus-io/milvus-docs/v2.6.x/site/en/integrations';

const MILVUS_INTEGRATIONS: Array<{file: string; label: string}> = [
  // Embedding models
  {file: 'integrate_with_openai.md', label: 'Milvus + OpenAI Embeddings'},
  {file: 'integrate_with_cohere.md', label: 'Milvus + Cohere'},
  {file: 'integrate_with_hugging-face.md', label: 'Milvus + HuggingFace'},
  {file: 'integrate_with_voyageai.md', label: 'Milvus + Voyage AI'},
  {file: 'integrate_with_jina.md', label: 'Milvus + Jina AI'},
  {file: 'integrate_with_sentencetransformers.md', label: 'Milvus + Sentence Transformers'},
  {file: 'integrate_with_pytorch.md', label: 'Milvus + PyTorch'},

  // LLMs
  {file: 'milvus_rag_with_vllm.md', label: 'Milvus + vLLM'},
  {file: 'mistral_ocr_with_milvus.md', label: 'Milvus + Mistral OCR'},
  {file: 'build_RAG_with_milvus_and_ollama.md', label: 'RAG with Milvus + Ollama'},
  {file: 'build_RAG_with_milvus_and_deepseek.md', label: 'RAG with Milvus + DeepSeek'},
  {file: 'build_RAG_with_milvus_and_gemini.md', label: 'RAG with Milvus + Gemini'},
  {file: 'build_RAG_with_milvus_and_fireworks.md', label: 'RAG with Milvus + Fireworks'},
  {file: 'build_RAG_with_milvus_and_lepton.md', label: 'RAG with Milvus + Lepton'},
  {file: 'build_RAG_with_milvus_and_siliconflow.md', label: 'RAG with Milvus + SiliconFlow'},
  {file: 'use_milvus_with_sambanova.md', label: 'Milvus + SambaNova'},

  // Orchestration
  {file: 'integrate_with_llamaindex.md', label: 'Milvus + LlamaIndex'},
  {file: 'integrate_with_dspy.md', label: 'Milvus + DSPy'},
  {file: 'integrate_with_haystack.md', label: 'Milvus + Haystack'},
  {file: 'integrate_with_camel.md', label: 'Milvus + CAMEL'},
  {file: 'quickstart_mem0_with_milvus.md', label: 'Milvus + Mem0'},
  {file: 'integrate_with_agno.md', label: 'Milvus + Agno'},
  {file: 'llama_stack_with_milvus.md', label: 'Milvus + Llama Stack'},
  {file: 'milvus_rag_with_dynamiq.md', label: 'Milvus + Dynamiq'},
  {file: 'rag_with_langflow.md', label: 'Milvus + Langflow'},

  // Agents
  {file: 'openai_agents_milvus.md', label: 'Milvus + OpenAI Agents'},
  {file: 'llama_agents_metadata.md', label: 'Milvus + Llama Agents'},
  {file: 'milvus_and_mcp.md', label: 'Milvus + MCP'},
  {file: 'milvus_and_n8n.md', label: 'Milvus + n8n'},
  {file: 'integrate_with_memgpt.md', label: 'Milvus + MemGPT'},

  // Evaluation
  {file: 'integrate_with_ragas.md', label: 'Milvus + Ragas'},
  {file: 'integrate_with_langfuse.md', label: 'Milvus + LangFuse'},
  {file: 'evaluation_with_deepeval.md', label: 'Milvus + DeepEval'},
  {file: 'evaluation_with_phoenix.md', label: 'Milvus + Phoenix'},
  {file: 'integrate_with_whyhow.md', label: 'Milvus + WhyHow'},
  {file: 'AIMon_milvus_integration.md', label: 'Milvus + AIMon'},

  // Data pipelines
  {file: 'integrate_with_airbyte.md', label: 'Milvus + Airbyte'},
  {file: 'kafka-connect-milvus.md', label: 'Milvus + Kafka Connect'},
  {file: 'integrate_with_spark.md', label: 'Milvus + Spark'},
  {file: 'ETL_using_vectorETL.md', label: 'Milvus + VectorETL'},
  {file: 'apify_milvus_rag.md', label: 'Milvus + Apify'},
  {file: 'build_RAG_from_s3_with_milvus.md', label: 'RAG from S3 with Milvus'},
  {file: 'langextract_milvus_demo.md', label: 'Milvus + LangExtract'},

  // RAG & Applications
  {file: 'integrate_with_bentoml.md', label: 'Milvus + BentoML'},
  {file: 'integrate_with_snowpark.md', label: 'Milvus + Snowpark'},
  {file: 'integrate_with_fastgpt.md', label: 'Milvus + FastGPT'},
  {file: 'integrate_with_voxel51.md', label: 'Milvus + Voxel51'},
  {file: 'integrate_with_vanna.md', label: 'Milvus + Vanna'},
  {file: 'video_search_with_twelvelabs_and_milvus.md', label: 'Milvus + Twelve Labs'},
  {file: 'RAG_with_pii_and_milvus.md', label: 'Milvus + PII Masking'},
  {file: 'kotaemon_with_milvus.md', label: 'Milvus + Kotaemon'},
  {file: 'dify_with_milvus.md', label: 'Milvus + Dify'},
  {file: 'NLWeb_with_milvus.md', label: 'Milvus + NLWeb'},
  {file: 'knowledge_table_with_milvus.md', label: 'Milvus + Knowledge Table'},
  {file: 'use_milvus_in_anythingllm.md', label: 'Milvus + AnythingLLM'},
  {file: 'use_milvus_in_docsgpt.md', label: 'Milvus + DocsGPT'},
  {file: 'use_milvus_in_private_gpt.md', label: 'Milvus + PrivateGPT'},
  {file: 'rag_with_milvus_and_unstructured.md', label: 'RAG with Milvus + Unstructured'},
  {file: 'build_RAG_with_milvus_and_cognee.md', label: 'RAG with Milvus + Cognee'},
  {file: 'build_RAG_with_milvus_and_crawl4ai.md', label: 'RAG with Milvus + Crawl4AI'},
  {file: 'build_RAG_with_milvus_and_docling.md', label: 'RAG with Milvus + Docling'},
  {file: 'build_RAG_with_milvus_and_embedAnything.md', label: 'RAG with Milvus + EmbedAnything'},
  {file: 'build_RAG_with_milvus_and_exa.md', label: 'RAG with Milvus + Exa'},
  {file: 'build_RAG_with_milvus_and_feast.md', label: 'RAG with Milvus + Feast'},
  {file: 'build_RAG_with_milvus_and_firecrawl.md', label: 'RAG with Milvus + Firecrawl'},
  {file: 'build_rag_on_arm.md', label: 'RAG with Milvus on ARM'},

  // LlamaIndex advanced
  {file: 'llamaindex_milvus_async.md', label: 'LlamaIndex + Milvus Async'},
  {file: 'llamaindex_milvus_full_text_search.md', label: 'LlamaIndex + Milvus Full Text Search'},
  {file: 'llamaindex_milvus_hybrid_search.md', label: 'LlamaIndex + Milvus Hybrid Search'},
  {file: 'llamaindex_milvus_metadata_filter.md', label: 'LlamaIndex + Milvus Metadata Filter'},
  {file: 'full_text_search_with_milvus_and_haystack.md', label: 'Haystack + Milvus Full Text Search'},

  // MindsDB
  {file: 'integration_with_mindsdb.md', label: 'Milvus + MindsDB'},
];

// ---------------------------------------------------------------------------
// Config from env
// ---------------------------------------------------------------------------

const ZILLIZ_ENDPOINT = (process.env.ZILLIZ_ENDPOINT || '').replace(/\/$/, '');
const ZILLIZ_TOKEN = process.env.ZILLIZ_TOKEN || '';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'baai/bge-large-en-v1.5';
const EMBEDDING_API_KEY = process.env.EMBEDDING_API_KEY || process.env.AI_API_KEY || '';
const EMBEDDING_BASE_URL = (process.env.EMBEDDING_BASE_URL || process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const COLLECTION_NAME = 'doc_chunks';

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;
const CHARS_PER_TOKEN = 4;
const CONCURRENCY = 3;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch(`${EMBEDDING_BASE_URL}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${EMBEDDING_API_KEY}`,
    },
    body: JSON.stringify({model: EMBEDDING_MODEL, input: text}),
  });
  if (!res.ok) {
    throw new Error(`Embedding API error: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as {data: Array<{embedding: number[]}>};
  return data.data[0].embedding;
}

function chunkText(text: string): string[] {
  const chunkChars = CHUNK_SIZE * CHARS_PER_TOKEN;
  const overlapChars = CHUNK_OVERLAP * CHARS_PER_TOKEN;
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    if ((current.length + para.length + 2) > chunkChars && current.length > 0) {
      chunks.push(current.trim());
      current = current.slice(-overlapChars) + '\n\n' + para;
    } else {
      current += (current ? '\n\n' : '') + para;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  if (chunks.length === 0 && text.trim()) {
    for (let i = 0; i < text.length; i += chunkChars - overlapChars) {
      chunks.push(text.slice(i, i + chunkChars).trim());
    }
  }
  return chunks;
}

function extractTitle(md: string): string {
  const m = md.match(/^#\s+(.+)/m);
  return m ? m[1].trim() : '';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const weight = process.argv.includes('--weight')
    ? parseFloat(process.argv[process.argv.indexOf('--weight') + 1])
    : 0.85;
  const dryRun = process.argv.includes('--dry-run');

  if (!ZILLIZ_ENDPOINT || !ZILLIZ_TOKEN) {
    console.error('Error: ZILLIZ_ENDPOINT and ZILLIZ_TOKEN env vars are required');
    process.exit(1);
  }
  if (!EMBEDDING_API_KEY) {
    console.error('Error: EMBEDDING_API_KEY (or AI_API_KEY) env var is required');
    process.exit(1);
  }

  console.log(`Seeding ${MILVUS_INTEGRATIONS.length} Milvus integration docs (weight: ${weight}${dryRun ? ', DRY RUN' : ''})`);
  console.log(`Source: ${GH_RAW}\n`);

  // Delete existing ext:milvus:* chunks first
  if (!dryRun) {
    console.log('Clearing existing ext:milvus:* chunks...');
    try {
      await zillizRequest('/entities/delete', {
        collectionName: COLLECTION_NAME,
        filter: 'id like "ext:milvus:%"',
      });
      console.log('  Done\n');
    } catch (err) {
      console.warn('  Warning:', (err as Error).message, '\n');
    }
  }

  // Process docs with concurrency limit
  let idx = 0;
  let totalChunks = 0;
  let totalDocs = 0;

  async function processNext(): Promise<void> {
    while (idx < MILVUS_INTEGRATIONS.length) {
      const i = idx++;
      const entry = MILVUS_INTEGRATIONS[i];
      const url = `${GH_RAW}/${entry.file}`;
      const milvusUrl = `https://milvus.io/docs/${entry.file}`;

      try {
        // Fetch raw markdown
        const res = await fetch(url, {
          headers: {'User-Agent': 'ZdocBot/1.0'},
          signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) {
          console.error(`  SKIP ${entry.label}: ${res.status}`);
          continue;
        }
        const md = await res.text();
        const title = (extractTitle(md) || entry.label).slice(0, 250);
        const chunks = chunkText(md);

        if (dryRun) {
          console.log(`  ${entry.label}: ${chunks.length} chunks`);
          totalChunks += chunks.length;
          totalDocs++;
          continue;
        }

        // Embed and insert
        const chunkData: Array<Record<string, unknown>> = [];
        for (let ci = 0; ci < chunks.length; ci++) {
          const embedding = await generateEmbedding(chunks[ci]);
          chunkData.push({
            id: `ext:milvus:${i}#${ci}`,
            doc_url: milvusUrl,
            doc_url_md: milvusUrl,
            doc_title: title,
            section: 'external-web',
            content: chunks[ci].slice(0, 16000),
            content_hash: '',
            weight,
            embedding,
          });
        }

        if (chunkData.length > 0) {
          await zillizRequest('/entities/insert', {
            collectionName: COLLECTION_NAME,
            data: chunkData,
          });
        }

        totalChunks += chunkData.length;
        totalDocs++;
        console.log(`  ✓ ${entry.label}: ${chunkData.length} chunks`);
      } catch (err) {
        console.error(`  FAIL ${entry.label}: ${(err as Error).message}`);
      }
    }
  }

  const workers = Array.from({length: CONCURRENCY}, () => processNext());
  await Promise.all(workers);

  console.log(`\nDone! ${totalDocs}/${MILVUS_INTEGRATIONS.length} docs, ${totalChunks} chunks total`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
