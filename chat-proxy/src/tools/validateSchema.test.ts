import {describe, it, expect} from 'vitest';
import {validateSchemaTool} from './validateSchema.js';

const exec = validateSchemaTool.execute as (args: any) => Promise<any>;

describe('validateSchemaTool', () => {
  it('validates minimal valid schema (PK + vector)', async () => {
    const result = await exec({
      fields: [
        {name: 'id', dataType: 'Int64', isPrimaryKey: true},
        {name: 'embedding', dataType: 'FloatVector', dim: 128},
      ],
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.fieldCount).toBe(2);
    expect(result.vectorFieldCount).toBe(1);
  });

  it('errors on missing primary key', async () => {
    const result = await exec({
      fields: [{name: 'embedding', dataType: 'FloatVector', dim: 128}],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.stringContaining('primary key'));
  });

  it('errors on two primary keys', async () => {
    const result = await exec({
      fields: [
        {name: 'id1', dataType: 'Int64', isPrimaryKey: true},
        {name: 'id2', dataType: 'VarChar', isPrimaryKey: true, maxLength: 64},
        {name: 'vec', dataType: 'FloatVector', dim: 128},
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.stringContaining('one primary key'));
  });

  it('errors on PK with wrong type (Float)', async () => {
    const result = await exec({
      fields: [
        {name: 'id', dataType: 'Float', isPrimaryKey: true},
        {name: 'vec', dataType: 'FloatVector', dim: 128},
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.stringContaining('VarChar or Int64'));
  });

  it('errors on vector field without dim', async () => {
    const result = await exec({
      fields: [
        {name: 'id', dataType: 'Int64', isPrimaryKey: true},
        {name: 'vec', dataType: 'FloatVector'},
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.stringContaining('dim'));
  });

  it('no error for SparseFloatVector without dim', async () => {
    const result = await exec({
      fields: [
        {name: 'id', dataType: 'Int64', isPrimaryKey: true},
        {name: 'sparse', dataType: 'SparseFloatVector'},
      ],
    });
    const dimErrors = result.errors.filter((e: string) => e.includes('dim'));
    expect(dimErrors).toHaveLength(0);
  });

  it('errors on unknown data type', async () => {
    const result = await exec({
      fields: [
        {name: 'id', dataType: 'Int64', isPrimaryKey: true},
        {name: 'foo', dataType: 'UnknownType'},
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.stringContaining('unknown data type'));
  });

  it('warns on VarChar without maxLength', async () => {
    const result = await exec({
      fields: [
        {name: 'id', dataType: 'Int64', isPrimaryKey: true},
        {name: 'name', dataType: 'VarChar'},
        {name: 'vec', dataType: 'FloatVector', dim: 128},
      ],
    });
    expect(result.warnings).toContainEqual(expect.stringContaining('VarChar without maxLength'));
  });

  it('errors on unknown index type', async () => {
    const result = await exec({
      fields: [
        {name: 'id', dataType: 'Int64', isPrimaryKey: true},
        {name: 'vec', dataType: 'FloatVector', dim: 128, indexType: 'BANANA_INDEX'},
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.stringContaining('unknown index type'));
  });

  it('errors on unknown metric type', async () => {
    const result = await exec({
      fields: [
        {name: 'id', dataType: 'Int64', isPrimaryKey: true},
        {name: 'vec', dataType: 'FloatVector', dim: 128, metricType: 'EUCLIDEAN'},
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.stringContaining('unknown metric type'));
  });

  it('warns on no vector fields', async () => {
    const result = await exec({
      fields: [
        {name: 'id', dataType: 'Int64', isPrimaryKey: true},
        {name: 'name', dataType: 'VarChar', maxLength: 64},
      ],
    });
    expect(result.warnings).toContainEqual(expect.stringContaining('No vector field'));
  });

  it('errors on multiple partition keys', async () => {
    const result = await exec({
      fields: [
        {name: 'id', dataType: 'Int64', isPrimaryKey: true},
        {name: 'a', dataType: 'VarChar', maxLength: 32, isPartitionKey: true},
        {name: 'b', dataType: 'VarChar', maxLength: 32, isPartitionKey: true},
        {name: 'vec', dataType: 'FloatVector', dim: 128},
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.stringContaining('one partition key'));
  });

  it('warns when > 64 fields', async () => {
    const fields = [
      {name: 'id', dataType: 'Int64', isPrimaryKey: true},
      {name: 'vec', dataType: 'FloatVector', dim: 128},
      ...Array.from({length: 63}, (_, i) => ({name: `f${i}`, dataType: 'Int32'})),
    ];
    const result = await exec({fields});
    expect(result.warnings).toContainEqual(expect.stringContaining('64 fields'));
  });
});
