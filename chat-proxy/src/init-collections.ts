// Auto-create required Zilliz collections on startup if they don't exist
import {zillizRequest, isZillizConfigured, EMBEDDING_DIM} from './zilliz-client.js';

const COLLECTIONS = [
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
  {
    name: 'chat_conversations',
    schema: {
      fields: [
        {fieldName: 'id', dataType: 'VarChar', isPrimary: true, elementTypeParams: {max_length: 128}},
        {fieldName: 'user_id', dataType: 'VarChar', elementTypeParams: {max_length: 128}},
        {fieldName: 'session_id', dataType: 'VarChar', elementTypeParams: {max_length: 128}},
        {fieldName: 'messages', dataType: 'JSON'},
        {fieldName: 'agent_types_used', dataType: 'Array', elementDataType: 'VarChar', elementTypeParams: {max_length: 64, max_capacity: 10}},
        {fieldName: 'tools_called', dataType: 'Array', elementDataType: 'VarChar', elementTypeParams: {max_length: 64, max_capacity: 20}},
        {fieldName: 'sources_returned', dataType: 'Array', elementDataType: 'VarChar', elementTypeParams: {max_length: 512, max_capacity: 20}},
        {fieldName: 'confidence_levels', dataType: 'Array', elementDataType: 'VarChar', elementTypeParams: {max_length: 16, max_capacity: 10}},
        {fieldName: 'page_urls_visited', dataType: 'Array', elementDataType: 'VarChar', elementTypeParams: {max_length: 512, max_capacity: 20}},
        {fieldName: 'feedback_summary', dataType: 'JSON'},
        {fieldName: 'started_at', dataType: 'VarChar', elementTypeParams: {max_length: 64}},
        {fieldName: 'ended_at', dataType: 'VarChar', elementTypeParams: {max_length: 64}},
        {fieldName: 'embedding', dataType: 'FloatVector', elementTypeParams: {dim: EMBEDDING_DIM}},
      ],
    },
    indexParams: [{fieldName: 'embedding', indexName: 'embedding_idx', metricType: 'COSINE'}],
  },
];

export async function ensureCollections(): Promise<void> {
  if (!isZillizConfigured()) {
    console.log('[init] Zilliz not configured, skipping collection setup');
    return;
  }

  for (const {name, schema, indexParams} of COLLECTIONS) {
    try {
      const exists = await zillizRequest('/collections/has', {collectionName: name});
      if (!exists?.has) {
        console.log(`[init] Creating collection: ${name}`);
        await zillizRequest('/collections/create', {collectionName: name, schema});
        console.log(`[init] ✓ Created ${name}`);
      }

      // Always try to create index (idempotent if already exists)
      try {
        await zillizRequest('/indexes/create', {collectionName: name, indexParams});
        console.log(`[init] ✓ Created index for ${name}`);
      } catch (err) {
        // Index might already exist, ignore error
      }

      await zillizRequest('/collections/load', {collectionName: name});
      console.log(`[init] ✓ Loaded ${name}`);
    } catch (err) {
      console.error(`[init] Failed to setup ${name}:`, (err as Error).message);
    }
  }
}
