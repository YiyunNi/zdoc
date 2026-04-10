import {z} from 'zod';
import {tool} from 'ai';

export const generateSchemaCodeTool = tool({
  description: 'Generate SDK code for creating a Milvus/Zilliz Cloud collection with the specified schema.',
  inputSchema: z.object({
    collectionName: z.string().describe('Name of the collection'),
    fields: z.array(z.object({
      name: z.string(),
      dataType: z.string(),
      isPrimaryKey: z.boolean().optional(),
      isPartitionKey: z.boolean().optional(),
      dim: z.number().optional(),
      maxLength: z.number().optional(),
    })).describe('Field definitions'),
    language: z.enum(['python', 'node', 'java', 'go', 'rest']).describe('Target SDK language'),
    includeIndex: z.boolean().optional().default(true).describe('Include index creation'),
    includeInsert: z.boolean().optional().default(false).describe('Include sample insert code'),
  }),
  execute: async ({collectionName, fields, language, includeIndex, includeInsert}) => {
    // Build the code based on language
    let code = '';

    if (language === 'python') {
      code = generatePythonCode(collectionName, fields, includeIndex, includeInsert);
    } else if (language === 'node') {
      code = generateNodeCode(collectionName, fields, includeIndex, includeInsert);
    } else if (language === 'rest') {
      code = generateRestCode(collectionName, fields);
    } else {
      code = `// Code generation for ${language} is available. Use the documentation for ${language} SDK examples.`;
    }

    return {code, language, collectionName};
  },
});

function mapDataType(dt: string): string {
  const map: Record<string, string> = {
    Bool: 'DataType.BOOL',
    Int8: 'DataType.INT8',
    Int16: 'DataType.INT16',
    Int32: 'DataType.INT32',
    Int64: 'DataType.INT64',
    Float: 'DataType.FLOAT',
    Double: 'DataType.DOUBLE',
    VarChar: 'DataType.VARCHAR',
    JSON: 'DataType.JSON',
    Array: 'DataType.ARRAY',
    FloatVector: 'DataType.FLOAT_VECTOR',
    Float16Vector: 'DataType.FLOAT16_VECTOR',
    BFloat16Vector: 'DataType.BFLOAT16_VECTOR',
    BinaryVector: 'DataType.BINARY_VECTOR',
    SparseFloatVector: 'DataType.SPARSE_FLOAT_VECTOR',
  };
  return map[dt] || `DataType.${dt.toUpperCase()}`;
}

function generatePythonCode(name: string, fields: any[], includeIndex: boolean, includeInsert: boolean): string {
  let code = `from pymilvus import MilvusClient, DataType

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_API_KEY"
)

schema = client.create_schema(auto_id=False, enable_dynamic_field=True)

`;

  for (const f of fields) {
    const params: string[] = [
      `field_name="${f.name}"`,
      `datatype=${mapDataType(f.dataType)}`,
    ];
    if (f.isPrimaryKey) params.push('is_primary=True');
    if (f.isPartitionKey) params.push('is_partition_key=True');
    if (f.dim) params.push(`dim=${f.dim}`);
    if (f.maxLength) params.push(`max_length=${f.maxLength}`);
    code += `schema.add_field(${params.join(', ')})\n`;
  }

  if (includeIndex) {
    code += `
index_params = client.prepare_index_params()
`;
    const vectorFields = fields.filter((f: any) => f.dataType.includes('Vector'));
    for (const vf of vectorFields) {
      code += `index_params.add_index(field_name="${vf.name}", index_type="AUTOINDEX", metric_type="COSINE")\n`;
    }

    code += `
client.create_collection(
    collection_name="${name}",
    schema=schema,
    index_params=index_params
)

print(f"Collection '{name}' created successfully")`;
  }

  if (includeInsert) {
    code += `

# Insert sample data
data = [
    # Add your data here
]
client.insert(collection_name="${name}", data=data)`;
  }

  return code;
}

function generateNodeCode(name: string, fields: any[], includeIndex: boolean, includeInsert: boolean): string {
  let code = `import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const client = new MilvusClient({
  address: "YOUR_CLUSTER_ENDPOINT",
  token: "YOUR_API_KEY",
});

await client.createCollection({
  collection_name: "${name}",
  fields: [
`;

  for (const f of fields) {
    const props: string[] = [
      `name: "${f.name}"`,
      `data_type: ${mapDataType(f.dataType).replace('DataType.', 'DataType.')}`,
    ];
    if (f.isPrimaryKey) props.push('is_primary_key: true');
    if (f.isPartitionKey) props.push('is_partition_key: true');
    if (f.dim) props.push(`dim: ${f.dim}`);
    if (f.maxLength) props.push(`max_length: ${f.maxLength}`);
    code += `    { ${props.join(', ')} },\n`;
  }

  code += `  ],
});`;

  if (includeIndex) {
    const vectorFields = fields.filter((f: any) => f.dataType.includes('Vector'));
    for (const vf of vectorFields) {
      code += `

await client.createIndex({
  collection_name: "${name}",
  field_name: "${vf.name}",
  index_type: "AUTOINDEX",
  metric_type: "COSINE",
});`;
    }

    code += `

await client.loadCollection({ collection_name: "${name}" });
console.log("Collection '${name}' created and loaded");`;
  }

  return code;
}

function generateRestCode(name: string, fields: any[]): string {
  const fieldDefs = fields.map(f => {
    const def: any = {fieldName: f.name, dataType: f.dataType};
    if (f.isPrimaryKey) def.isPrimary = true;
    if (f.isPartitionKey) def.isPartitionKey = true;
    if (f.dim) def.params = {dim: f.dim};
    if (f.maxLength) def.params = {...(def.params || {}), max_length: f.maxLength};
    return def;
  });

  const body = JSON.stringify({
    collectionName: name,
    schema: {fields: fieldDefs},
  }, null, 2);

  return `curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/collections/create" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${body}'`;
}
