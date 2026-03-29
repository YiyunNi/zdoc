---
title: Vector Search | Python SDK
slug: /python/guides/vector-search
displayed_sidebar: pythonSidebar
sidebar_label: Vector Search
sidebar_position: 8
---

# Vector Search

Perform approximate nearest neighbor (ANN) search using the Python SDK.

[Full guide →](/docs/single-vector-search)

## Single-Vector Search

In ANN searches, a single-vector search refers to a search that involves only one query vector. Based on the pre-built index and the metric type carried in the search request, Zilliz Cloud will find the top-K vectors most similar to the query vector.

In this section, you will learn how to conduct a single-vector search. The search request carries a single query vector and asks Zilliz Cloud to use Inner Product (IP) to calculate the similarity between query vectors and vectors in the collection and returns the three most similar ones.

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# 4. Single vector search
query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]
res = client.search(
    collection_name="quick_setup",
    anns_field="vector",
    data=[query_vector],
    limit=3,
    search_params={"metric_type": "IP"}
)

for hits in res:
    for hit in hits:
        print(hit)

# [
#     [
#         {
#             "id": 551,
#             "distance": 0.08821295201778412,
#             "entity": {}
#         },
#         {
#             "id": 296,
#             "distance": 0.0800950899720192,
#             "entity": {}
#         },
#         {
#             "id": 43,
#             "distance": 0.07794742286205292,
#             "entity": {}
#         }
#     ]
# ]
```

Milvus ranks the search results by their similarity scores to the query vector in descending order. The similarity score is also termed the distance to the query vector, and its value ranges vary with the metric types in use.

The following table lists the applicable metric types and the corresponding distance ranges.

<table>
   <tr>
     <th><p>Metric Type</p></th>
     <th><p>Characteristics</p></th>
     <th><p>Distance Range</p></th>
   </tr>
   <tr>
     <td><p><code>L2</code></p></td>
     <td><p>A smaller value indicates a higher similarity.</p></td>
     <td><p>[0, ∞)</p></td>
   </tr>
   <tr>
     <td><p><code>IP</code></p></td>
     <td><p>A greater value indicates a higher similarity.</p></td>
     <td><p>[-1, 1]</p></td>
   </tr>
   <tr>
     <td><p><code>COSINE</code></p></td>
     <td><p>A greater value indicates a higher similarity.</p></td>
     <td><p>[-1, 1]</p></td>
   </tr>
   <tr>
     <td><p><code>JACCARD</code></p></td>
     <td><p>A smaller value indicates a higher similarity.</p></td>
     <td><p>[0, 1]</p></td>
   </tr>
   <tr>
     <td><p><code>HAMMING</code></p></td>
     <td><p>A smaller value indicates a higher similarity.</p></td>
     <td><p>[0, dim(vector)]</p></td>
   </tr>
</table>

## Bulk-Vector Search

Similarly, you can include multiple query vectors in a search request. Zilliz Cloud will conduct ANN searches for the query vectors in parallel and return two sets of results.

```python
# 7. Search with multiple vectors
# 7.1. Prepare query vectors
query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648],
    [0.0039737443, 0.003020432, -0.0006188639, 0.03913546, -0.00089768134]
]

# 7.2. Start search
res = client.search(
    collection_name="quick_setup",
    data=query_vectors,
    limit=3,
)

for hits in res:
    print("TopK results:")
    for hit in hits:
        print(hit)

# Output
#
# [
#     [
#         {
#             "id": 551,
#             "distance": 0.08821295201778412,
#             "entity": {}
#         },
#         {
#             "id": 296,
#             "distance": 0.0800950899720192,
#             "entity": {}
#         },
#         {
#             "id": 43,
#             "distance": 0.07794742286205292,
#             "entity": {}
#         }
#     ],
#     [
#         {
#             "id": 730,
#             "distance": 0.04431751370429993,
#             "entity": {}
#         },
#         {
#             "id": 333,
#             "distance": 0.04231833666563034,
#             "entity": {}
#         },
#         {
#             "id": 232,
#             "distance": 0.04221535101532936,
#             "entity": {}
#         }
#     ]
# ]
```

## ANN Search in Partition

Suppose you have created multiple partitions in a collection, and you can narrow the search scope to a specific number of partitions. In that case, you can include the target partition names in the search request to restrict the search scope within the specified partitions. Reducing the number of partitions involved in the search improves search performance.

The following code snippet assumes a partition named **PartitionA** in your collection.

```python
# 4. Single vector search
query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]
res = client.search(
    collection_name="quick_setup",
    # highlight-next-line
    partition_names=["partitionA"],
    data=[query_vector],
    limit=3,
)

for hits in res:
    print("TopK results:")
    for hit in hits:
        print(hit)

# [
#     [
#         {
#             "id": 551,
#             "distance": 0.08821295201778412,
#             "entity": {}
#         },
#         {
#             "id": 296,
#             "distance": 0.0800950899720192,
#             "entity": {}
#         },
#         {
#             "id": 43,
#             "distance": 0.07794742286205292,
#             "entity": {}
#         }
#     ]
# ]
```

## Use Output Fields

In a search result, Zilliz Cloud includes the primary field values and similarity distances/scores of the entities that contain the top-K vector embeddings by default. You can include the names of the target fields, including both the vector and scalar fields, in a search request as the output fields to make the search results carry the values from other fields in these entities.

```python
# 4. Single vector search
query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],

res = client.search(
    collection_name="quick_setup",
    data=[query_vector],
    limit=3, # The number of results to return
    search_params={"metric_type": "IP"}，
    # highlight-next-line
    output_fields=["color"]
)

print(res)

# [
#     [
#         {
#             "id": 551,
#             "distance": 0.08821295201778412,
#             "entity": {
#                 "color": "orange_6781"
#             }
#         },
#         {
#             "id": 296,
#             "distance": 0.0800950899720192,
#             "entity": {
#                 "color": "red_4794"
#             }
#         },
#         {
#             "id": 43,
#             "distance": 0.07794742286205292,
#             "entity": {
#                 "color": "grey_8510"
#             }
#         }
#     ]
# ]
```

## Use Limit and Offset

You may notice that the parameter `limit` carried in the search requests determines the number of entities to include in the search results. This parameter specifies the maximum number of entities to return in a single search, and it is usually termed **top-K**.

If you wish to perform paginated queries, you can use a loop to send multiple Search requests, with the **Limit** and **Offset** parameters carried in each query request. Specifically, you can set the **Limit** parameter to the number of Entities you want to include in the current query results, and set the **Offset** to the total number of Entities that have already been returned.

The table below outlines how to set the **Limit** and **Offset** parameters for paginated queries when returning 100 Entities at a time.

<table>
   <tr>
     <th><p>Queries</p></th>
     <th><p>Entities to return per query</p></th>
     <th><p>Entities already been returned in total</p></th>
   </tr>
   <tr>
     <td><p>The <strong>1st</strong> query</p></td>
     <td><p>100</p></td>
     <td><p>0</p></td>
   </tr>
   <tr>
     <td><p>The <strong>2nd</strong> query</p></td>
     <td><p>100</p></td>
     <td><p>100</p></td>
   </tr>
   <tr>
     <td><p>The <strong>3rd</strong> query</p></td>
     <td><p>100</p></td>
     <td><p>200</p></td>
   </tr>
   <tr>
     <td><p>The <strong>nth</strong> query</p></td>
     <td><p>100</p></td>
     <td><p>100 x (n-1)</p></td>
   </tr>
</table>

Note that, the sum of `limit` and `offset` in a single ANN search should be less than 16,384.

```python
# 4. Single vector search
query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],

res = client.search(
    collection_name="quick_setup",
    data=[query_vector],
    limit=3, # The number of results to return
    search_params={
        "metric_type": "IP", 
        # highlight-next-line
        "offset": 10 # The records to skip
    }
)
```

## API Reference

- [`search()`](/reference/python/python/MilvusClient/MilvusClient-Vector/Vector-search)
