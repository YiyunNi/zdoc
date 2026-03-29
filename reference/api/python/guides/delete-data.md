---
title: Delete Data | Python SDK
slug: /python/guides/delete-data
displayed_sidebar: pythonSidebar
sidebar_label: Delete Data
sidebar_position: 7
---

# Delete Data

Delete entities from your collections using the Python SDK.

[Full guide →](/docs/delete-entities)

## Delete Entities by Filtering Conditions

When deleting multiple entities that share some attributes in a batch, you can use filter expressions. The example code below uses the **in** operator to bulk delete all Entities with their **color** field set to the values of **red** and **purple**. You can also use other operators to construct filter expressions that meet your requirements. For more information about filter expressions, please refer to [Filtering Explained](./filtering-overview).

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

res = client.delete(
    collection_name="quick_setup",
    # highlight-next-line
    filter="color in ['red_7025', 'purple_4976']"
)

print(res)

# Output
# {'delete_count': 2}
```

## Delete Entities by Primary Keys

In most cases, a primary key uniquely identifies an Entity. You can delete Entities by setting their primary keys in the delete request. The example code below demonstrates how to delete two entities with primary keys **18** and **19**.

```python
res = client.delete(
    collection_name="quick_setup",
    # highlight-next-line
    ids=[18, 19]
)

print(res)

# Output
# {'delete_count': 2}
```

## Delete Entities from Partitions

You can also delete entities stored in specific partitions. The following code snippets assume that you have a partition named **PartitionA** in your collection. 

```python
res = client.delete(
    collection_name="quick_setup",
    ids=[18, 19],
    partition_name="partitionA"
)

print(res)

# Output
# {'delete_count': 2}
```

## API Reference

- [`delete()`](/reference/python/python/MilvusClient/MilvusClient-Vector/Vector-delete)
