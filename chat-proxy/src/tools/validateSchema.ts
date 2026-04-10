import {z} from 'zod';
import {tool} from 'ai';

const VALID_DATA_TYPES = [
  'Bool', 'Int8', 'Int16', 'Int32', 'Int64',
  'Float', 'Double',
  'VarChar', 'JSON', 'Array',
  'FloatVector', 'Float16Vector', 'BFloat16Vector', 'BinaryVector', 'SparseFloatVector',
];

const VALID_INDEX_TYPES = [
  'AUTOINDEX', 'FLAT', 'IVF_FLAT', 'IVF_SQ8', 'IVF_PQ',
  'HNSW', 'SCANN', 'DISKANN', 'GPU_IVF_FLAT', 'GPU_IVF_PQ',
];

const VALID_METRIC_TYPES = ['L2', 'IP', 'COSINE', 'HAMMING', 'JACCARD'];

export const validateSchemaTool = tool({
  description: 'Validate a Milvus/Zilliz Cloud collection schema definition. Checks field types, index types, and best practices.',
  inputSchema: z.object({
    fields: z.array(z.object({
      name: z.string(),
      dataType: z.string(),
      isPrimaryKey: z.boolean().optional(),
      isPartitionKey: z.boolean().optional(),
      dim: z.number().optional(),
      maxLength: z.number().optional(),
      indexType: z.string().optional(),
      metricType: z.string().optional(),
    })).describe('Array of field definitions'),
    collectionName: z.string().optional().describe('Collection name for naming convention checks'),
  }),
  execute: async ({fields, collectionName}) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check primary key
    const pks = fields.filter(f => f.isPrimaryKey);
    if (pks.length === 0) errors.push('Schema must have exactly one primary key field');
    if (pks.length > 1) errors.push('Schema can only have one primary key field');
    if (pks.length === 1 && !['VarChar', 'Int64'].includes(pks[0].dataType)) {
      errors.push('Primary key must be VarChar or Int64');
    }

    // Check vector fields
    const vectorFields = fields.filter(f => f.dataType.includes('Vector'));
    if (vectorFields.length === 0) {
      warnings.push('No vector field defined — this collection cannot perform vector search');
    }

    for (const f of fields) {
      // Validate data type
      if (!VALID_DATA_TYPES.includes(f.dataType)) {
        errors.push(`Field "${f.name}": unknown data type "${f.dataType}". Valid types: ${VALID_DATA_TYPES.join(', ')}`);
      }

      // Vector fields need dimension
      if (f.dataType.includes('Vector') && f.dataType !== 'SparseFloatVector' && !f.dim) {
        errors.push(`Field "${f.name}": vector fields require a "dim" property`);
      }

      // VarChar needs maxLength
      if (f.dataType === 'VarChar' && !f.maxLength) {
        warnings.push(`Field "${f.name}": VarChar without maxLength will use default (65535)`);
      }

      // Validate index type
      if (f.indexType && !VALID_INDEX_TYPES.includes(f.indexType)) {
        errors.push(`Field "${f.name}": unknown index type "${f.indexType}". Valid types: ${VALID_INDEX_TYPES.join(', ')}`);
      }

      // Validate metric type
      if (f.metricType && !VALID_METRIC_TYPES.includes(f.metricType)) {
        errors.push(`Field "${f.name}": unknown metric type "${f.metricType}". Valid types: ${VALID_METRIC_TYPES.join(', ')}`);
      }
    }

    // Suggestions
    if (vectorFields.length > 0 && !vectorFields.some(f => f.indexType)) {
      suggestions.push('Consider using AUTOINDEX for vector fields — it automatically selects the best index type');
    }

    const partitionKeys = fields.filter(f => f.isPartitionKey);
    if (partitionKeys.length > 1) {
      errors.push('Only one partition key is allowed per collection');
    }

    if (fields.length > 64) {
      warnings.push('Collections support up to 64 fields. Consider using JSON type for dynamic attributes');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      fieldCount: fields.length,
      vectorFieldCount: vectorFields.length,
    };
  },
});
