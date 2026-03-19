import {describe, it, expect} from 'vitest';
import {generateSchemaCodeTool} from './generateSchemaCode.js';

const exec = generateSchemaCodeTool.execute as (args: any) => Promise<any>;

const sampleFields = [
  {name: 'id', dataType: 'Int64', isPrimaryKey: true},
  {name: 'embedding', dataType: 'FloatVector', dim: 768},
  {name: 'text', dataType: 'VarChar', maxLength: 512},
];

describe('generateSchemaCodeTool', () => {
  it('Python code contains pymilvus and collection name', async () => {
    const result = await exec({
      collectionName: 'my_collection',
      fields: sampleFields,
      language: 'python',
      includeIndex: true,
      includeInsert: false,
    });

    expect(result.code).toContain('pymilvus');
    expect(result.code).toContain('my_collection');
    expect(result.collectionName).toBe('my_collection');
    expect(result.language).toBe('python');
  });

  it('Node code contains @zilliz/milvus2-sdk-node', async () => {
    const result = await exec({
      collectionName: 'my_collection',
      fields: sampleFields,
      language: 'node',
      includeIndex: false,
      includeInsert: false,
    });

    expect(result.code).toContain('@zilliz/milvus2-sdk-node');
    expect(result.code).toContain('my_collection');
  });

  it('REST code contains curl command', async () => {
    const result = await exec({
      collectionName: 'my_collection',
      fields: sampleFields,
      language: 'rest',
      includeIndex: false,
      includeInsert: false,
    });

    expect(result.code).toContain('curl');
    expect(result.code).toContain('my_collection');
  });

  it('Python code includes index creation when includeIndex=true', async () => {
    const result = await exec({
      collectionName: 'my_collection',
      fields: sampleFields,
      language: 'python',
      includeIndex: true,
      includeInsert: false,
    });

    expect(result.code).toContain('index_params');
    expect(result.code).toContain('AUTOINDEX');
    expect(result.code).toContain('create_collection');
  });

  it('Python code includes insert sample when includeInsert=true', async () => {
    const result = await exec({
      collectionName: 'my_collection',
      fields: sampleFields,
      language: 'python',
      includeIndex: false,
      includeInsert: true,
    });

    expect(result.code).toContain('Insert sample data');
    expect(result.code).toContain('client.insert');
  });

  it('unsupported language returns fallback message', async () => {
    const result = await exec({
      collectionName: 'my_collection',
      fields: sampleFields,
      language: 'go',
      includeIndex: false,
      includeInsert: false,
    });

    expect(result.code).toContain('go');
    expect(result.code).toContain('documentation');
  });
});
