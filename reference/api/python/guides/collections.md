---
title: Collections | Python SDK
slug: /python/guides/collections
displayed_sidebar: pythonSidebar
sidebar_label: Collections
sidebar_position: 3
---

# Collections

Create and configure collections using the Python SDK.

[Full guide →](/docs/manage-collections-sdks)

## Create Schema

A schema defines the data structure of a collection. When creating a collection, you need to design the schema based on your requirements. For details, refer to [Schema Explained](./schema-explained).

The following code snippets create a schema with the enabled dynamic field and three mandatory fields named `my_id`, `my_vector`, and `my_varchar`.

```python
# 3. Create a collection in customized setup mode
from pymilvus import MilvusClient, DataType

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# 3.1. Create schema
schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=True,
)

# 3.2. Add fields to schema
schema.add_field(field_name="my_id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="my_vector", datatype=DataType.FLOAT_VECTOR, dim=5)
schema.add_field(field_name="my_varchar", datatype=DataType.VARCHAR, max_length=512)
```

## (Optional) Set Index Parameters

Creating an index on a specific field accelerates the search against this field. An index records the order of entities within a collection. As shown in the following code snippets, you can use `metric_type` and `index_type` to select appropriate ways for Zilliz Cloud to index a field and measure similarities between vector embeddings.

On Zilliz Cloud, you can use `AUTOINDEX` as the index type for all vector fields, and one of `COSINE`, `L2`, and `IP` as the metric type based on your needs.

As demonstrated in the above code snippet, you need to set both the index type and metric type for vector fields and only the index type for the scalar fields. Indexes are mandatory for vector fields, and you are advised to create indexes on scalar fields frequently used in filtering conditions.

For details, refer to [Manage Indexes](./manage-indexes).

```python
# 3.3. Prepare index parameters
index_params = client.prepare_index_params()

# 3.4. Add indexes
index_params.add_index(
    field_name="my_id",
    index_type="AUTOINDEX"
)

index_params.add_index(
    field_name="my_vector", 
    index_type="AUTOINDEX",
    metric_type="COSINE"
)
```

## Create a Collection

If you have created a collection with index parameters, Zilliz Cloud automatically loads the collection upon its creation. In this case, all fields mentioned in the index parameters are indexed.

The following code snippets demonstrate how to create the collection with index parameters and check its load status.

```python
# 3.5. Create a collection with the index loaded simultaneously
client.create_collection(
    collection_name="customized_setup_1",
    schema=schema,
    index_params=index_params
)

res = client.get_load_state(
    collection_name="customized_setup_1"
)

print(res)

# Output
#
# {
#     "state": "<LoadState: Loaded>"
# }
```

You can also create a collection without any index parameters and add them afterward. In this case, Zilliz Cloud does not load the collection upon its creation. For details on how to create indexes for an existing collection, refer to [AUTOINDEX Explained](./autoindex-explained).

The following code snippet demonstrates how to create a collection without an index, and the load status of the collection remains unloaded upon creation.

```python
# 3.6. Create a collection and index it separately
client.create_collection(
    collection_name="customized_setup_2",
    schema=schema,
)

res = client.get_load_state(
    collection_name="customized_setup_2"
)

print(res)

# Output
#
# {
#     "state": "<LoadState: NotLoad>"
# }
```

## Set Collection Properties

You can set properties for the collection to create to make it fit into your service. The applicable properties are as follows.

### Set Shard Number

Shards are horizontal slices of a collection, and each shard corresponds to a data input channel. By default, every collection has one shard. You can specify the number of shards when creating a collection to better suit your data volume and workload.

As a general guideline, consider the following when setting the number of shards:

- **Data size:** A common practice is to have one shard for every 200 million entities. You can also estimate based on the total data size, for example, adding one shard for every 100 GB of data you plan to insert.

The following code snippet demonstrates how to set the shard number when you create a collection.

```python
# With shard number
client.create_collection(
    collection_name="customized_setup_3",
    schema=schema,
    # highlight-next-line
    num_shards=1
)
```

### Enable mmap

Zilliz Cloud enables mmap on all collections by default, allowing Zilliz Cloud to map raw field data into memory instead of fully loading them. This reduces memory footprints and increases collection capacity. For details on mmap, refer to [Use mmap](./use-mmap).

```python
# With mmap
client.create_collection(
    collection_name="customized_setup_4",
    schema=schema,
    # highlight-next-line
    enable_mmap=False
)
```

```plaintext
export params='{
    "mmap.enabled": True
}'

export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"customized_setup_5\",
    \"schema\": $schema,
    \"params\": $params
}"
```

### Set Collection TTL

If the data in a collection needs to be dropped for a specific period, consider setting its Time-To-Live (TTL) in seconds. Once the TTL times out, Zilliz Cloud deletes entities in the collection. The deletion is asynchronous, indicating that searches and queries are still possible before the deletion is complete.

The following code snippet sets the TTL to one day (86400 seconds). You are advised to set the TTL to a couple of days at minimum.

```python
# With TTL
client.create_collection(
    collection_name="customized_setup_5",
    schema=schema,
    # highlight-start
    properties={
        "collection.ttl.seconds": 86400
    }
    # highlight-end
)
```

### Set Consistency Level

When creating a collection, you can set the consistency level for searches and queries in the collection. You can also change the consistency level of the collection during a specific search or query.

```python
# With consistency level
client.create_collection(
    collection_name="customized_setup_6",
    schema=schema,
    # highlight-next
    consistency_level="Bounded",
)
```

For more on consistency levels, see [Consistency Level](./consistency-level).

### Enable Dynamic Field

The dynamic field in a collection is a reserved JavaScript Object Notation (JSON) field named **\&#36;meta**. Once you have enabled this field, Zilliz Cloud saves all non-schema-defined fields carried in each entity and their values as key-value pairs in the reserved field.

For details on how to use the dynamic field, refer to [Dynamic Field](./enable-dynamic-field).

## API Reference

- [`create_collection()`](/reference/python/python/MilvusClient/MilvusClient-Collections/Collections-create_collection)
- [`create_schema()`](/reference/python/python/MilvusClient/MilvusClient-Collections/Collections-create_schema)
