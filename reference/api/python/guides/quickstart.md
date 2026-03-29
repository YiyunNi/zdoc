---
title: Quickstart | Python SDK
slug: /python/guides/quickstart
displayed_sidebar: pythonSidebar
sidebar_label: Quickstart
sidebar_position: 1
---

# Quickstart

Get started with Zilliz Cloud using the Python SDK (pymilvus). This guide walks you through connecting, creating a collection, inserting data, and running your first search.

[Full guide →](/docs/quick-start)

## Set up Connection

Once you have obtained the cluster credentials or an API key, you can use it to connect to your cluster now.

```python
from pymilvus import MilvusClient, DataType

CLUSTER_ENDPOINT = "YOUR_CLUSTER_ENDPOINT"
TOKEN = "YOUR_CLUSTER_TOKEN" 
# A valid token could be either
# - An API key, or 
# - A colon-joined cluster username and password, as in `user:pass`

# 1. Set up a Milvus client
client = MilvusClient(
    uri=CLUSTER_ENDPOINT,
    token=TOKEN 
)
```

## Create Collection

On Zilliz Cloud, you need to store your vector embeddings in collections. All vector embeddings stored in a collection share the same dimensionality and distance metric for measuring similarity. 

To create a collection, you need to define the attributes of each field in the collection, including its name, data type, and any additional attributes of a specific field. Additionally, you need to create an index on the fields that require accelerated search performance. Note that indexes are mandatory for vector fields. 

```python
# 3. Create a collection in customized setup mode

# 3.1. Create schema
schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=True,
)

# 3.2. Add fields to schema
schema.add_field(field_name="my_id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="my_vector", datatype=DataType.FLOAT_VECTOR, dim=5)

# 3.3. Prepare index parameters
index_params = client.prepare_index_params()

# 3.4. Add indexes
index_params.add_index(
    field_name="my_id"
)

index_params.add_index(
    field_name="my_vector", 
    index_type="AUTOINDEX",
    metric_type="IP"
)

# 3.5. Create a collection
client.create_collection(
    collection_name="custom_setup",
    schema=schema,
    index_params=index_params
)
```

In the above setup, you have defined various aspects of the collection during its creation, including its schema and index parameters.

- **Schema**

    The schema defines the structure of a collection. Except for adding pre-defined fields and setting their attributes as demonstrated above, you have the option of enabling or disabling

    - **Auto ID**

        Whether to enable the collection to increment the primary field automatically.

    - **Dynamic Field**

        Whether to use the reserved JSON field **&#36;meta** to store non-schema-defined fields and their values. 

     For a detailed explanation of the schema, refer to [Schema Explained](./schema-explained).

- **Index parameters**

    Index parameters dictate how Zilliz Cloud organizes your data within a collection. You can assign specific indexes to fields by configuring their **metric types** and **index types**. 

    - For the vector field, you can use **AUTOINDEX** as the index type and use **COSINE**, **L2**, or **IP** as the `metric_type`.

    - For scalar fields, including the primary field, Zilliz Cloud uses **TRIE** for integers and **STL_SORT** for strings.

    For additional insights into index types, refer to[AUTOINDEX Explained](./autoindex-explained).

## Insert Data

Once the collection is ready, you can add data to it as follows.

```python
# 4. Insert data into the collection
# 4.1. Prepare data
data=[
    {"id": 0, "vector": [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592], "color": "pink_8682"},
    {"id": 1, "vector": [0.19886812562848388, 0.06023560599112088, 0.6976963061752597, 0.2614474506242501, 0.838729485096104], "color": "red_7025"},
    {"id": 2, "vector": [0.43742130801983836, -0.5597502546264526, 0.6457887650909682, 0.7894058910881185, 0.20785793220625592], "color": "orange_6781"},
    {"id": 3, "vector": [0.3172005263489739, 0.9719044792798428, -0.36981146090600725, -0.4860894583077995, 0.95791889146345], "color": "pink_9298"},
    {"id": 4, "vector": [0.4452349528804562, -0.8757026943054742, 0.8220779437047674, 0.46406290649483184, 0.30337481143159106], "color": "red_4794"},
    {"id": 5, "vector": [0.985825131989184, -0.8144651566660419, 0.6299267002202009, 0.1206906911183383, -0.1446277761879955], "color": "yellow_4222"},
    {"id": 6, "vector": [0.8371977790571115, -0.015764369584852833, -0.31062937026679327, -0.562666951622192, -0.8984947637863987], "color": "red_9392"},
    {"id": 7, "vector": [-0.33445148015177995, -0.2567135004164067, 0.8987539745369246, 0.9402995886420709, 0.5378064918413052], "color": "grey_8510"},
    {"id": 8, "vector": [0.39524717779832685, 0.4000257286739164, -0.5890507376891594, -0.8650502298996872, -0.6140360785406336], "color": "white_9381"},
    {"id": 9, "vector": [0.5718280481994695, 0.24070317428066512, -0.3737913482606834, -0.06726932177492717, -0.6980531615588608], "color": "purple_4976"}
]

# 4.2. Insert data
res = client.insert(
    collection_name="custom_setup",
    data=data
)

print(res)

# Output
#
# {
#     "insert_count": 10,
#     "ids": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
# }
```

As shown in the above code, 

- The data to insert is organized into a list of dictionaries, where each dictionary represents a data record, termed as an entity.

- Each dictionary contains a non-schema-defined field named **color**.

- Each dictionary contains the keys corresponding to both pre-defined and dynamic fields.

## Similarity Search

You can conduct similarity searches based on one or more vector embeddings. You can also include a filtering condition in the search request to enhance the similarity search results.

```python
# 8. Search with a filter expression using schema-defined fields
# 1 Prepare query vectors
query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648]
]

# 2. Start search
res = client.search(
    collection_name="custom_setup",
    data=query_vectors,
    filter="4 < id < 8",
    limit=3
)

print(res)

# Output
#
# [
#     [
#         {
#             "id": 5,
#             "distance": 0.08821295201778412,
#             "entity": {}
#         },
#         {
#             "id": 6,
#             "distance": 0.07432225346565247,
#             "entity": {}
#         },
#         {
#             "id": 7,
#             "distance": 0.07279646396636963,
#             "entity": {}
#         }
#     ]
# ]
```

The output should be a sub-list of three dictionaries, each representing a searched entity with its ID, distance, and the specified output fields.

You can also include dynamic fields in a filter expression. In the following code snippet, `color` is a non-schema-defined field. You can include them as keys in the magic `$meta` field, such as `$meta["color"]`, or directly use them like schema-defined fields, such as `color`.

```python
# 9. Search with a filter expression using custom fields
# 9.1.Prepare query vectors
query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648]
]

# 9.2.Start search
res = client.search(
    collection_name="custom_setup",
    data=query_vectors,
    filter='$meta["color"] like "red%"',
    limit=3,
    output_fields=["color"]
)

print(res)

# Output
#
# [
#     [
#         {
#             "id": 5,
#             "distance": 0.08821295201778412,
#             "entity": {
#                 "color": "yellow_4222"
#             }
#         },
#         {
#             "id": 6,
#             "distance": 0.07432225346565247,
#             "entity": {
#                 "color": "red_9392"
#             }
#         },
#         {
#             "id": 7,
#             "distance": 0.07279646396636963,
#             "entity": {
#                 "color": "grey_8510"
#             }
#         }
#     ]
# ]
```

## Delete Entities

Zilliz Cloud allows deleting entities by IDs and by filters.

- **Delete entities by IDs.**

    
```python
# 13. Delete entities by IDs
    res = client.delete(
        collection_name="custom_setup",
        ids=[0,1,2,3,4]
    )
    
    print(res)
    
    # Output
    #
    # {
    #     "delete_count": 5
    # }
```

- **Delete entities by filter**

    
```python
# 14. Delete entities by a filter expression
    res = client.delete(
        collection_name="custom_setup",
        filter="id in [5,6,7,8,9]"
    )
    
    print(res)
    
    # Output
    #
    # {
    #     "delete_count": 5
    # }
```

## API Reference

- [`MilvusClient()`](/reference/python/python/MilvusClient/MilvusClient-Client/Client-MilvusClient)
- [`create_collection()`](/reference/python/python/MilvusClient/MilvusClient-Collections/Collections-create_collection)
- [`insert()`](/reference/python/python/MilvusClient/MilvusClient-Vector/Vector-insert)
- [`search()`](/reference/python/python/MilvusClient/MilvusClient-Vector/Vector-search)
