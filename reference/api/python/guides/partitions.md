---
title: Partitions | Python SDK
slug: /python/guides/partitions
displayed_sidebar: pythonSidebar
sidebar_label: Partitions
sidebar_position: 11
---

# Partitions

Manage partitions to organize your data using the Python SDK.

[Full guide →](/docs/manage-partitions)

## List Partitions

When creating a collection, Zilliz Cloud also creates a partition named **_default** in the collection. You can list the partitions in a collection as follows.

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

res = client.list_partitions(
    collection_name="my_collection"
)

print(res)

# Output
#
# ["_default"]
```

## Create Partition

You can add more partitions to the collection and insert entities into these partitions based on certain criteria.

```python
client.create_partition(
    collection_name="my_collection",
    partition_name="partitionA"
)

res = client.list_partitions(
    collection_name="my_collection"
)

print(res)

# Output
#
# ["_default", "partitionA"]
```

## Check for a Specific Partition

The following code snippets demonstrate how to check whether a partition exists in a specific collection.

```python
res = client.has_partition(
    collection_name="my_collection",
    partition_name="partitionA"
)

print(res)

# Output
#
# True
```

## Load and Release Partitions

You can separately load or release one or certain partitions.

### Load Partitions

You can separately load specific partitions in a collection. It is worth noting that the load status of a collection stays unloaded if there is an unloaded partition in the collection.

```python
client.load_partitions(
    collection_name="my_collection",
    partition_names=["partitionA"]
)

res = client.get_load_state(
    collection_name="my_collection",
    partition_name="partitionA"
)

print(res)
# Output
#
# {
#     "state": "<LoadState: Loaded>"
# }
```

### Release Partitions

You can also release specific partitions.

```python
client.release_partitions(
    collection_name="my_collection",
    partition_names=["partitionA"]
)

res = client.get_load_state(
    collection_name="my_collection",
    partition_name="partitionA"
)

print(res)

# Output
#
# {
#     "state": "<LoadState: NotLoaded>"
# }
```

## Drop Partition

You can drop partitions that are no longer needed. Before dropping a partition, ensure that the partition has been released.

```python
client.release_partitions(
    collection_name="my_collection",
    partition_names=["partitionA"]
)

client.drop_partition(
    collection_name="my_collection",
    partition_name="partitionA"
)

res = client.list_partitions(
    collection_name="my_collection"
)

print(res)

# ["_default"]
```

## API Reference

- [`list_partitions()`](/reference/python/python/MilvusClient/MilvusClient-Partitions/Partitions-list_partitions)
- [`create_partition()`](/reference/python/python/MilvusClient/MilvusClient-Partitions/Partitions-create_partition)
