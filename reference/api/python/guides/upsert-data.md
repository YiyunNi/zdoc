---
title: Upsert Data | Python SDK
slug: /python/guides/upsert-data
displayed_sidebar: pythonSidebar
sidebar_label: Upsert Data
sidebar_position: 6
---

# Upsert Data

Insert or update entities in your collections using the Python SDK.

[Full guide →](/docs/upsert-entities)

## Upsert entities in a collection

In this section, we will upsert entities into a collection named `my_collection`. This collection has only two fields, named `id`, `vector`, `title`, and `issue`. The `id` field is the primary field, while the `title` and `issue` fields are scalar fields.

The three entities, if exists in the collection, will be overridden by those included the upsert request.

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

data=[
    {
        "id": 0, 
        "vector": [-0.619954382375778, 0.4479436794798608, -0.17493894838751745, -0.4248030059917294, -0.8648452746018911],
        "title": "Artificial Intelligence in Real Life", 
        "issue": "vol.12"
    }, {
        "id": 1, 
        "vector": [0.4762662251462588, -0.6942502138717026, -0.4490002642657902, -0.628696575798281, 0.9660395877041965], 
        "title": "Hollow Man", 
        "issue": "vol.19"
    }, {
        "id": 2, 
        "vector": [-0.8864122635045097, 0.9260170474445351, 0.801326976181461, 0.6383943392381306, 0.7563037341572827], 
        "title": "Treasure Hunt in Missouri", 
        "issue": "vol.12"
    }
]

res = client.upsert(
    collection_name='my_collection',
    data=data
)

print(res)

# Output
# {'upsert_count': 3}
```

## Upsert entities in a partition

You can also upsert entities into a specified partition. The following code snippets assume that you have a partition named **PartitionA** in your collection.

The three entities, if exists in the partition, will be overridden by those included in the request. 

```python
data=[
    {
        "id": 10, 
        "vector": [0.06998888224297328, 0.8582816610326578, -0.9657938677934292, 0.6527905683627726, -0.8668460657158576], 
        "title": "Layour Design Reference", 
        "issue": "vol.34"
    },
    {
        "id": 11, 
        "vector": [0.6060703043917468, -0.3765080534566074, -0.7710758854987239, 0.36993888322346136, 0.5507513364206531], 
        "title": "Doraemon and His Friends", 
        "issue": "vol.2"
    },
    {
        "id": 12, 
        "vector": [-0.9041813104515337, -0.9610546012461163, 0.20033003106083358, 0.11842506351635174, 0.8327356724591011], 
        "title": "Pikkachu and Pokemon", 
        "issue": "vol.12"
    },
]

res = client.upsert(
    collection_name="my_collection",
    data=data,
    partition_name="partitionA"
)

print(res)

# Output
# {'upsert_count': 3}
```

## Upsert entities in merge mode

The following code example demonstrates how to upsert entities with partial updates. Provide only the fields needing updates and their new values, along with the explicit partial update flag.

In the following example, the `issue` field of the entities specified in the upsert request will be updated to the values included in the request.

```python
data=[
    {
        "id": 1,
        "issue": "vol.14"
    },
    {
        "id": 2, 
        "issue": "vol.7"
    }
]

res = client.upsert(
    collection_name="my_collection",
    data=data,
    partial_update=True
)

print(res)

# Output
# {'upsert_count': 2}
```

## API Reference

- [`upsert()`](/reference/python/python/MilvusClient/MilvusClient-Vector/Vector-upsert)
