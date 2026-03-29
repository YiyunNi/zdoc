---
title: Schema & Fields | Python SDK
slug: /python/guides/schema
displayed_sidebar: pythonSidebar
sidebar_label: Schema & Fields
sidebar_position: 4
---

# Schema & Fields

Define schemas with primary, vector, scalar, and composite fields using the Python SDK.

[Full guide →](/docs/schema-explained)

## Create Schema

The following code snippet demonstrates how to create a schema.

```python
from pymilvus import MilvusClient, DataType

schema = MilvusClient.create_schema()
```

## Add Primary Field

The primary field in a collection uniquely identifies an entity. It only accepts **Int64** or **VarChar** values. The following code snippets demonstrate how to add the primary field.

```python
schema.add_field(
    field_name="my_id",
    datatype=DataType.INT64,
    # highlight-start
    is_primary=True,
    auto_id=False,
    # highlight-end
)
```

When adding a field, you can explicitly clarify the field as the primary field by setting its `is_primary` property to `True`. A primary field accepts **Int64** values by default. In this case, the primary field value should be integers similar to `12345`. If you choose to use **VarChar** values in the primary field, the value should be strings similar to `my_entity_1234`.

You can also set the `autoId` properties to `True` to make Zilliz Cloud automatically allocate primary field values upon data insertions.

For details, refer to [Primary Field & AutoId](./primary-field-auto-id).

## Add Vector Fields

Vector fields accept various sparse and dense vector embeddings. On Zilliz Cloud, you can add four vector fields to a collection. The following code snippets demonstrate how to add a vector field.

```python
schema.add_field(
    field_name="my_vector",
    datatype=DataType.FLOAT_VECTOR,
    # highlight-next-line
    dim=5
)
```

The `dim` paramter in the above code snippets indicates the dimensionality of the vector embeddings to be held in the vector field. The `FLOAT_VECTOR` value indicates that the vector field holds a list of 32-bit floating numbers, which are usually used to represent antilogarithms.In addition to that, Zilliz Cloud also supports the following types of vector embeddings:

- `FLOAT16_VECTOR`

    A vector field of this type holds a list of 16-bit half-precision floating numbers and usually applies to memory- or bandwidth-restricted deep learning or GPU-based computing scenarios.

- `BFLOAT16_VECTOR`

    A vector field of this type holds a list of 16-bit floating-point numbers that have reduced precision but the same exponent range as Float32. This type of data is commonly used in deep learning scenarios, as it reduces memory usage without significantly impacting accuracy.

- `INT8_VECTOR`

    A vector field of this type stores vectors composed of 8-bit signed integers (int8), with each component ranging from –128 to 127. Tailored for quantized deep learning architectures—such as ResNet and EfficientNet—it substantially shrinks model size and boosts inference speed, all while incurring only minimal precision loss. **Note**: This vector type is supported only for HNSW indexes.

- `BINARY_VECTOR`

    A vector field of this type holds a list of 0s and 1s. They serve as compact features for representing data in image processing and information retrieval scenarios.

- `SPARSE_FLOAT_VECTOR`

    A vector field of this type holds a list of non-zero numbers and their sequence numbers to represent sparse vector embeddings.

## Add Scalar Fields

In common cases, you can use scalar fields to store the metadata of the vector embeddings stored in Zilliz Cloud clusters, and conduct ANN searches with metadata filtering to improve the correctness of the search results. Zilliz Cloud supports multiple scalar field types, including **VarChar**, **Boolean**, **Int**, **Float**, and **Double**.

### Add String Fields

In Zilliz Cloud clusters, you can use VarChar fields to store strings. For more on the VarChar field, refer to [String Field](./use-string-field).

```python
schema.add_field(
    field_name="my_varchar",
    datatype=DataType.VARCHAR,
    # highlight-next-line
    max_length=512
)
```

### Add Number Fields

The types of numbers that Zilliz Cloud supports are `Int8`, `Int16`, `Int32`, `Int64`, `Float`, and `Double`. For more on the number fields, refer to [Number Field](./use-number-field).

```python
schema.add_field(
    field_name="my_int64",
    datatype=DataType.INT64,
)
```

### Add Boolean Fields

Zilliz Cloud supports boolean fields. The following code snippets demonstrate how to add a boolean field.

```python
schema.add_field(
    field_name="my_bool",
    datatype=DataType.BOOL,
)
```

## Add Composite Fields

In Milvus, a composite field is a field that can be divided into smaller sub-fields, such as the keys in a JSON field or the indices in an Array field.

### Add JSON fields

A JSON field usually stores half-structured JSON data. For more on the JSON fields, refer to [JSON Field](./use-json-fields).

```python
schema.add_field(
    field_name="my_json",
    datatype=DataType.JSON,
)
```

### Add Array Fields

An array field stores a list of elements. The data types of all elements in an array field should be the same. For more on the array fields, refer to [Array Field](./use-array-fields).

```python
schema.add_field(
    field_name="my_array",
    datatype=DataType.ARRAY,
    element_type=DataType.VARCHAR,
    max_capacity=5,
    max_length=512,
)
```

## API Reference

- [`create_schema()`](/reference/python/python/MilvusClient/MilvusClient-Collections/Collections-create_schema)
