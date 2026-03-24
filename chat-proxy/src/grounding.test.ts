import {describe, it, expect} from 'vitest';
import {computeGrounding} from './grounding.js';
import type {SearchResult} from './rag.js';
import type {Source} from './types.js';

function makeResult(overrides: Partial<SearchResult> = {}): SearchResult {
  return {
    id: 'chunk-1',
    doc_url: 'https://docs.zilliz.com/test',
    doc_url_md: 'https://docs.zilliz.com/test.md',
    doc_title: 'Test Doc',
    section: 'cloud-guides',
    content: 'Milvus supports vector similarity search using HNSW and IVF_FLAT index types for high-performance approximate nearest neighbor queries.',
    score: 0.85,
    weight: 1,
    contextScore: 0.85,
    ...overrides,
  };
}

function makeSource(overrides: Partial<Source> = {}): Source {
  return {
    title: 'Test Doc',
    url: 'https://docs.zilliz.com/test',
    score: 0.85,
    ...overrides,
  };
}

describe('computeGrounding', () => {
  it('matches paragraphs with clear source overlap to citations', () => {
    const response = `Milvus supports vector similarity search using HNSW and IVF_FLAT index types for high-performance approximate nearest neighbor queries.

This allows you to find the most similar items in your dataset with low latency and high recall.`;

    const rawResults = [makeResult()];
    const sources = [makeSource()];

    const result = computeGrounding(response, rawResults, sources);

    expect(result.sources.length).toBeGreaterThan(0);
    expect(result.citations.length).toBeGreaterThan(0);
    // First paragraph should cite the source
    expect(result.citations[0].sourceIndices).toContain(0);
  });

  it('skips short paragraphs (greetings, transitions)', () => {
    const response = `Sure, I can help!

Milvus supports vector similarity search using HNSW and IVF_FLAT index types for high-performance approximate nearest neighbor queries in large-scale datasets.`;

    const rawResults = [makeResult()];
    const sources = [makeSource()];

    const result = computeGrounding(response, rawResults, sources);

    // Should not have a citation for paragraph 0 ("Sure, I can help!")
    const firstParaCitation = result.citations.find(c => c.paragraphIndex === 0);
    expect(firstParaCitation).toBeUndefined();
  });

  it('includes headings in grounding (they carry topic keywords)', () => {
    const response = `## Vector Similarity Search with Milvus HNSW Index

Milvus supports vector similarity search using HNSW and IVF_FLAT index types for high-performance approximate nearest neighbor queries in large datasets.`;

    const rawResults = [makeResult()];
    const sources = [makeSource()];

    const result = computeGrounding(response, rawResults, sources);

    // Heading should now participate in grounding
    expect(result.sources.length).toBeGreaterThan(0);
  });

  it('filters out sources with no overlap', () => {
    const response = `Python is a popular programming language used for data science and machine learning applications across many different industries worldwide.

It provides excellent libraries for scientific computing and numerical analysis.`;

    const rawResults = [makeResult({
      content: 'Milvus supports HNSW and IVF_FLAT index types for vector similarity search.',
      doc_url: 'https://docs.zilliz.com/indexes',
    })];
    const sources = [makeSource({url: 'https://docs.zilliz.com/indexes', title: 'Index Types'})];

    const result = computeGrounding(response, rawResults, sources);

    expect(result.sources).toHaveLength(0);
    expect(result.citations).toHaveLength(0);
  });

  it('returns top matches when multiple sources match one paragraph', () => {
    const response = `Milvus supports vector similarity search using HNSW and IVF_FLAT index types. You can configure collection schemas with dynamic fields for flexible data modeling in production.`;

    const rawResults = [
      makeResult({
        id: 'chunk-1',
        doc_url: 'https://docs.zilliz.com/indexes',
        doc_title: 'Index Types',
        content: 'Milvus supports vector similarity search using HNSW and IVF_FLAT index types for approximate nearest neighbor queries.',
      }),
      makeResult({
        id: 'chunk-2',
        doc_url: 'https://docs.zilliz.com/schema',
        doc_title: 'Schema Design',
        content: 'Configure collection schemas with dynamic fields for flexible data modeling in your Milvus deployment.',
      }),
    ];
    const sources = [
      makeSource({url: 'https://docs.zilliz.com/indexes', title: 'Index Types'}),
      makeSource({url: 'https://docs.zilliz.com/schema', title: 'Schema Design'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    // Should have citations and at most 2 sources per paragraph
    expect(result.citations.length).toBeGreaterThan(0);
    for (const c of result.citations) {
      expect(c.sourceIndices.length).toBeLessThanOrEqual(2);
    }
  });

  it('returns empty for empty response', () => {
    const result = computeGrounding('', [makeResult()], [makeSource()]);
    expect(result.sources).toHaveLength(0);
    expect(result.citations).toHaveLength(0);
  });

  it('returns empty when no RAG results', () => {
    const result = computeGrounding('Some response text with enough words to pass the minimum.', [], []);
    expect(result.sources).toHaveLength(0);
    expect(result.citations).toHaveLength(0);
  });

  it('skips code blocks', () => {
    const response = `Here is an example:

\`\`\`python
from pymilvus import Collection
collection = Collection("test")
results = collection.search(vectors, "embedding", params)
\`\`\`

The search function returns the nearest neighbors based on the configured index type.`;

    const rawResults = [makeResult({
      content: 'The pymilvus Collection class provides search functionality for finding nearest neighbors using configured vector index types.',
    })];
    const sources = [makeSource()];

    const result = computeGrounding(response, rawResults, sources);

    // Code block paragraph should not be cited
    const codeBlockCitations = result.citations.filter(c => {
      const para = response.split(/\n\n+/);
      // The code block is the middle paragraph
      return para[c.paragraphIndex]?.includes('```');
    });
    expect(codeBlockCitations).toHaveLength(0);
  });

  it('re-indexes sources correctly when some are filtered out', () => {
    const response = `Milvus supports vector similarity search using HNSW and IVF_FLAT index types for high-performance approximate nearest neighbor queries in large datasets.`;

    const rawResults = [
      makeResult({
        doc_url: 'https://docs.zilliz.com/indexes',
        content: 'Milvus supports vector similarity search using HNSW and IVF_FLAT index types for approximate nearest neighbor queries.',
      }),
    ];
    const sources = [
      makeSource({url: 'https://docs.zilliz.com/unrelated', title: 'Unrelated Doc'}),
      makeSource({url: 'https://docs.zilliz.com/indexes', title: 'Index Types'}),
      makeSource({url: 'https://docs.zilliz.com/also-unrelated', title: 'Also Unrelated'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    // Only the matching source should be in the filtered list
    expect(result.sources).toHaveLength(1);
    expect(result.sources[0].url).toBe('https://docs.zilliz.com/indexes');
    // Citations should reference index 0 (re-indexed)
    expect(result.citations[0].sourceIndices).toContain(0);
  });

  it('handles different paragraphs citing different sources', () => {
    const response = `Milvus supports vector similarity search using HNSW and IVF_FLAT index types for high-performance approximate nearest neighbor queries in datasets.

Zilliz Cloud provides serverless deployment options with automatic scaling, managed infrastructure, and built-in monitoring for production workloads.`;

    const rawResults = [
      makeResult({
        doc_url: 'https://docs.zilliz.com/indexes',
        content: 'Milvus supports vector similarity search using HNSW and IVF_FLAT index types for approximate nearest neighbor queries.',
      }),
      makeResult({
        doc_url: 'https://docs.zilliz.com/serverless',
        content: 'Zilliz Cloud provides serverless deployment options with automatic scaling and built-in monitoring for production workloads.',
      }),
    ];
    const sources = [
      makeSource({url: 'https://docs.zilliz.com/indexes', title: 'Index Types'}),
      makeSource({url: 'https://docs.zilliz.com/serverless', title: 'Serverless'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    expect(result.sources.length).toBe(2);
    expect(result.citations.length).toBe(2);

    // Different paragraphs should cite different sources
    const para0Sources = result.citations.find(c => c.paragraphIndex === 0)?.sourceIndices;
    const para1Sources = result.citations.find(c => c.paragraphIndex === 1)?.sourceIndices;
    expect(para0Sources).toBeDefined();
    expect(para1Sources).toBeDefined();
  });

  it('reranks sources by cumulative overlap (most relevant first)', () => {
    // Response is about Mem0 integration — high overlap with mem0 doc
    const response = `To integrate Mem0 with Zilliz Cloud, configure the Mem0 client to use your Zilliz Cloud endpoint and API key for persistent memory storage.

Mem0 uses Milvus as the vector backend. Set the connection URI to your Zilliz Cloud cluster endpoint and provide your authentication token.`;

    const rawResults = [
      makeResult({
        id: 'faq',
        doc_url: 'https://docs.zilliz.com/faq-cluster',
        content: 'FAQ about Zilliz Cloud clusters. How to create a cluster, manage resources, and configure endpoints.',
      }),
      makeResult({
        id: 'mem0',
        doc_url: 'https://docs.zilliz.com/mem0-integration',
        content: 'Mem0 integrates with Zilliz Cloud for persistent memory storage. Configure the Mem0 client with your Zilliz Cloud endpoint and API key. Mem0 uses Milvus as the vector backend.',
      }),
    ];
    const sources = [
      makeSource({url: 'https://docs.zilliz.com/faq-cluster', title: 'FAQ: Cluster'}),
      makeSource({url: 'https://docs.zilliz.com/mem0-integration', title: 'Mem0 Integration'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    // Mem0 doc should be ranked first (highest overlap), not FAQ
    expect(result.sources.length).toBeGreaterThanOrEqual(1);
    expect(result.sources[0].url).toBe('https://docs.zilliz.com/mem0-integration');
  });

  it('grounds tool-discovered chunks that are not in RAG results', () => {
    const response = `Mem0 provides a memory layer for AI applications. Configure it with your Zilliz Cloud endpoint to enable persistent vector storage for conversation memory.`;

    // Tool chunk has the relevant content; RAG chunk does not
    const rawResults = [
      makeResult({
        id: 'rag-generic',
        doc_url: 'https://docs.zilliz.com/getting-started',
        content: 'Getting started with Zilliz Cloud. Create your first cluster and begin building applications.',
      }),
      makeResult({
        id: 'tool-mem0',
        doc_url: 'https://docs.zilliz.com/mem0-quickstart',
        content: 'Mem0 provides a memory layer for AI applications. Configure Mem0 with your Zilliz Cloud endpoint for persistent vector storage and conversation memory.',
      }),
    ];
    const sources = [
      makeSource({url: 'https://docs.zilliz.com/getting-started', title: 'Getting Started'}),
      makeSource({url: 'https://docs.zilliz.com/mem0-quickstart', title: 'Mem0 Quickstart'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    // The tool-discovered Mem0 doc should appear in grounded sources
    const mem0Source = result.sources.find(s => s.url === 'https://docs.zilliz.com/mem0-quickstart');
    expect(mem0Source).toBeDefined();
    // And it should be ranked first
    expect(result.sources[0].url).toBe('https://docs.zilliz.com/mem0-quickstart');
  });

  it('returns no sources when response is mostly code with no citable paragraphs', () => {
    const response = `Here is how:

\`\`\`python
from pymilvus import connections
connections.connect(uri="https://your-endpoint.zillizcloud.com", token="your-token")
from mem0 import Memory
m = Memory()
m.add("User prefers dark mode", user_id="alice")
\`\`\`

Done!`;

    const rawResults = [
      makeResult({
        doc_url: 'https://docs.zilliz.com/mem0-quickstart',
        content: 'Connect to Zilliz Cloud using pymilvus connections. Use mem0 Memory class to add and retrieve user memories with Milvus vector backend.',
      }),
    ];
    const sources = [
      makeSource({url: 'https://docs.zilliz.com/mem0-quickstart', title: 'Mem0 Quickstart'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    // Whole-response fallback may match the URL, but since no paragraph
    // actually cites the source, it gets pruned — no ghost sources
    expect(result.sources).toHaveLength(0);
    expect(result.citations).toHaveLength(0);
  });

  it('excludes sources matched by whole-response fallback but not cited by any paragraph', () => {
    // Response is mostly code blocks + short lines → paragraph matching yields 0 sources
    // Fallback matches two chunks against whole response, but only one has paragraph citation
    const response = `Connect to your cluster first.

\`\`\`python
from pymilvus import connections
connections.connect(uri="https://endpoint.zillizcloud.com", token="token")
col = Collection("test")
results = col.search(vectors, "embedding", params, limit=10)
\`\`\`

The search function returns nearest neighbors using the configured HNSW index type for approximate similarity queries.`;

    const rawResults = [
      makeResult({
        id: 'chunk-search',
        doc_url: 'https://docs.zilliz.com/search-guide',
        content: 'The search function returns nearest neighbors using the configured HNSW index type for approximate similarity queries in large datasets.',
      }),
      makeResult({
        id: 'chunk-boost',
        doc_url: 'https://docs.zilliz.com/boost-ranker',
        content: 'Boost ranker configuration for pymilvus connections and Collection search results with vector embedding parameters and token authentication.',
      }),
    ];
    const sources = [
      makeSource({url: 'https://docs.zilliz.com/search-guide', title: 'Search Guide'}),
      makeSource({url: 'https://docs.zilliz.com/boost-ranker', title: 'Boost Ranker'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    // Search Guide should be cited (last paragraph matches)
    const searchSource = result.sources.find(s => s.url === 'https://docs.zilliz.com/search-guide');
    expect(searchSource).toBeDefined();

    // Boost Ranker may match whole-response fallback keywords but should be pruned
    // because no paragraph actually cites it
    for (const c of result.citations) {
      const citedUrls = c.sourceIndices.map(i => result.sources[i]?.url);
      expect(citedUrls).not.toContain('https://docs.zilliz.com/boost-ranker');
    }
  });

  it('matches short technical terms like API, SDK, RAG', () => {
    const response = `The Zilliz Cloud SDK provides API access for RAG pipelines. Use the SDK client to build retrieval-augmented generation workflows.`;

    const rawResults = [
      makeResult({
        doc_url: 'https://docs.zilliz.com/sdk-guide',
        content: 'The Zilliz Cloud SDK provides API access for building RAG pipelines and retrieval-augmented generation workflows.',
      }),
    ];
    const sources = [
      makeSource({url: 'https://docs.zilliz.com/sdk-guide', title: 'SDK Guide'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    // "API", "SDK", "RAG" (3 chars) should participate in matching
    expect(result.sources.length).toBeGreaterThan(0);
    expect(result.sources[0].url).toBe('https://docs.zilliz.com/sdk-guide');
  });

  it('tutorial-style response grounds to correct source over generic docs', () => {
    const response = `## Using Mem0 with Zilliz Cloud

Mem0 is an open-source memory layer for AI applications that uses Milvus as its vector backend.

To get started, install the Mem0 package and configure your Zilliz Cloud credentials:

\`\`\`python
from mem0 import Memory
config = {"vector_store": {"provider": "milvus", "config": {"url": "https://your-cluster.zillizcloud.com"}}}
m = Memory.from_config(config)
\`\`\`

Once configured, you can store and retrieve memories for your users through the Mem0 interface connected to Zilliz Cloud.`;

    const rawResults = [
      makeResult({
        id: 'faq',
        doc_url: 'https://docs.zilliz.com/faq-cluster',
        content: 'Frequently asked questions about billing, invoicing, payment methods, and resource allocation for enterprise accounts.',
      }),
      makeResult({
        id: 'release',
        doc_url: 'https://docs.zilliz.com/release-notes',
        content: 'Release notes for version updates, changelog entries, deprecation notices, and migration warnings.',
      }),
      makeResult({
        id: 'mem0',
        doc_url: 'https://docs.zilliz.com/mem0-integration',
        content: 'Mem0 is an open-source memory layer for AI applications. It uses Milvus as the vector backend. Configure Mem0 with your Zilliz Cloud credentials to store and retrieve memories.',
      }),
    ];
    const sources = [
      makeSource({url: 'https://docs.zilliz.com/faq-cluster', title: 'FAQ: Cluster'}),
      makeSource({url: 'https://docs.zilliz.com/release-notes', title: 'Release Notes'}),
      makeSource({url: 'https://docs.zilliz.com/mem0-integration', title: 'Mem0 Integration'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    // Mem0 doc should be in results AND ranked first
    expect(result.sources.length).toBeGreaterThanOrEqual(1);
    expect(result.sources[0].url).toBe('https://docs.zilliz.com/mem0-integration');
    // FAQ and release notes should NOT appear (no overlap with response)
    const faqSource = result.sources.find(s => s.url === 'https://docs.zilliz.com/faq-cluster');
    const releaseSource = result.sources.find(s => s.url === 'https://docs.zilliz.com/release-notes');
    expect(faqSource).toBeUndefined();
    expect(releaseSource).toBeUndefined();
  });

  it('demotes release notes even when they have high keyword overlap', () => {
    // This tests the core bug: release notes contain generic feature vocabulary
    // (e.g. "hybrid search", "sparse vector") that spuriously matches responses
    const response = `Zilliz Cloud supports hybrid search combining dense and sparse vectors for improved retrieval accuracy.

You can use the RRF (Reciprocal Rank Fusion) ranker to merge results from multiple ANN searches into a single ranked list.`;

    const rawResults = [
      makeResult({
        id: 'release',
        doc_url: '/docs/release-notes-2100',
        doc_title: 'Release Notes (Sept 4, 2024)',
        // Release notes mention the same features — high keyword overlap
        content: 'Added support for hybrid search combining dense and sparse vectors. New RRF ranker for merging multiple ANN search results with improved retrieval accuracy.',
      }),
      makeResult({
        id: 'hybrid-search',
        doc_url: '/docs/hybrid-search',
        doc_title: 'Hybrid Search',
        content: 'Zilliz Cloud hybrid search lets you combine dense and sparse vector searches using the RRF ranker for improved retrieval accuracy across multiple ANN queries.',
      }),
    ];
    const sources = [
      makeSource({url: '/docs/release-notes-2100', title: 'Release Notes (Sept 4, 2024)'}),
      makeSource({url: '/docs/hybrid-search', title: 'Hybrid Search'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    // The real doc should be grounded, not the release notes
    expect(result.sources.length).toBeGreaterThanOrEqual(1);
    expect(result.sources[0].url).toBe('/docs/hybrid-search');
    // Release notes should be excluded due to demotion
    const releaseSource = result.sources.find(s => s.url.includes('release-notes'));
    expect(releaseSource).toBeUndefined();
  });

  it('demotes release notes in URL even without title match', () => {
    const response = `You can create collections with dynamic fields enabled for flexible schema design in Zilliz Cloud.`;

    const rawResults = [
      makeResult({
        id: 'release',
        doc_url: '/docs/release-notes-2130',
        doc_title: '', // no title available (e.g. tool-discovered chunk)
        content: 'Added dynamic fields support for flexible schema design, allowing collections to store varied field structures.',
      }),
      makeResult({
        id: 'schema',
        doc_url: '/docs/manage-collections',
        doc_title: 'Manage Collections',
        content: 'Create collections with dynamic fields enabled for flexible schema design in Zilliz Cloud.',
      }),
    ];
    const sources = [
      makeSource({url: '/docs/release-notes-2130', title: ''}),
      makeSource({url: '/docs/manage-collections', title: 'Manage Collections'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    expect(result.sources.length).toBeGreaterThanOrEqual(1);
    expect(result.sources[0].url).toBe('/docs/manage-collections');
    const releaseSource = result.sources.find(s => s.url.includes('release-notes'));
    expect(releaseSource).toBeUndefined();
  });

  it('caps total grounded sources at 5', () => {
    // Generate a response that matches many different sources
    const response = `Zilliz Cloud offers vector search, hybrid search, schema design, data migration, cost optimization, serverless clusters, and advanced indexing capabilities for production workloads.`;

    const rawResults = Array.from({length: 8}, (_, i) => makeResult({
      id: `chunk-${i}`,
      doc_url: `/docs/topic-${i}`,
      doc_title: `Topic ${i}`,
      content: `Zilliz Cloud offers vector search, hybrid search, schema design, data migration, cost optimization, serverless clusters, and advanced indexing capabilities for production workloads topic ${i}.`,
    }));
    const sources = Array.from({length: 8}, (_, i) => makeSource({
      url: `/docs/topic-${i}`,
      title: `Topic ${i}`,
    }));

    const result = computeGrounding(response, rawResults, sources);

    expect(result.sources.length).toBeLessThanOrEqual(5);
  });

  it('does not ground payment paragraph to SSO doc sharing only generic words', () => {
    const response = `To use the Pay-as-you-go option, set up a Zilliz Cloud account online and add your payment method in the billing dashboard.`;

    const rawResults = [
      makeResult({
        id: 'sso',
        doc_url: '/docs/openid-connect',
        doc_title: 'Okta (OIDC)',
        content: 'Configure single sign-on for your enterprise account using Okta as the identity provider. Set up OIDC authentication for organization members.',
      }),
      makeResult({
        id: 'billing',
        doc_url: '/docs/payment-billing',
        doc_title: 'Payment & Billing',
        content: 'Set up your Zilliz Cloud payment method. Pay-as-you-go billing charges based on actual usage. Add a credit card in the billing dashboard.',
      }),
    ];
    const sources = [
      makeSource({url: '/docs/openid-connect', title: 'Okta (OIDC)'}),
      makeSource({url: '/docs/payment-billing', title: 'Payment & Billing'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    // Billing doc should be grounded, NOT the SSO doc
    expect(result.sources.length).toBeGreaterThanOrEqual(1);
    expect(result.sources[0].url).toBe('/docs/payment-billing');
    const ssoSource = result.sources.find(s => s.url === '/docs/openid-connect');
    expect(ssoSource).toBeUndefined();
  });

  it('does not ground field update paragraph to password utility doc', () => {
    const response = `You can update fields in your Milvus collection using the upsert operation to modify existing vector entries.`;

    const rawResults = [
      makeResult({
        id: 'password',
        doc_url: '/reference/python/update_password',
        doc_title: 'update_password()',
        content: 'Update the password for a Milvus user account. Requires the old password and new password parameters.',
      }),
      makeResult({
        id: 'upsert',
        doc_url: '/reference/python/upsert',
        doc_title: 'upsert()',
        content: 'Upsert operation to update existing vector entries or insert new ones into a Milvus collection with modified fields.',
      }),
    ];
    const sources = [
      makeSource({url: '/reference/python/update_password', title: 'update_password()'}),
      makeSource({url: '/reference/python/upsert', title: 'upsert()'}),
    ];

    const result = computeGrounding(response, rawResults, sources);

    expect(result.sources.length).toBeGreaterThanOrEqual(1);
    expect(result.sources[0].url).toBe('/reference/python/upsert');
    const passwordSource = result.sources.find(s => s.url.includes('update_password'));
    expect(passwordSource).toBeUndefined();
  });
});
