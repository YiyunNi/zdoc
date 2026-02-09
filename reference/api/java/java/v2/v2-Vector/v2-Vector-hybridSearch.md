---
title: "hybridSearch() | Java | v2"
slug: /java/java/v2-Vector-hybridSearch
sidebar_label: "hybridSearch()"
beta: false
added_since: v2.4.x
last_modified: v2.6.x
deprecate_since: false
notebook: false
description: "This operation performs multi-vector search on a collection and returns search results after reranking. | Java | v2"
type: docx
token: FwKNdsH8To0y6sx7gjqchTCMnHc
sidebar_position: 3
keywords: 
  - vector similarity search
  - approximate nearest neighbor search
  - DiskANN
  - Sparse vector
  - zilliz
  - zilliz cloud
  - cloud
  - hybridSearch()
  - javaV226
  - multimodal vector database retrieval
  - Retrieval Augmented Generation
  - Large language model
  - Vectorization
displayed_sidebar: javaSidebar

displayed_sidbar: javaSidebar
---

import Admonition from '@theme/Admonition';


# hybridSearch()

This operation performs multi-vector search on a collection and returns search results after reranking.

```java
public SearchResp hybridSearch(HybridSearchReq request)
```

## Request Syntax\{#request-syntax}

```java
hybridSearch(HybridSearchReq.builder()
    .databaseName(String databaseName)
    .collectionName(String collectionName)
    .partitionNames(List<String> partitionNames)
    .searchRequests(List<AnnSearchReq> searchRequests)
    .topK(int topK)
    .limit(long limit)
    .outFields(List<String> outFields)
    .offset(long offset)
    .roundDecimal(int roundDecimal)
    .consistencyLevel(ConsistencyLevel consistencyLevel)
    .groupByFieldName(String groupByFieldName)
    .groupSize(Integer groupSize)
    .strictGroupSize(Boolean strictGroupSize)
    .functionScore(FunctionScore functionScore)
    .build()
);
```

**BUILDER METHODS:**

- `databaseName(String databaseName)` -

    The name of the database. Defaults to the current database if not specified.

- `collectionName(String collectionName)` -

    The name of the target collection.

- `partitionNames(List<String> partitionNames)` -

    A list of partition names to target.

- `searchRequests(List<AnnSearchReq> searchRequests)` -

    A list of AnnSearchReq objects for hybrid search.

- `topK(int topK)` -

    The number of top results to return.

- `limit(long limit)` -

    The maximum number of results to return.

- `outFields(List<String> outFields)` -

    A list of field names to include in the output.

- `offset(long offset)` -

    The number of results to skip before returning.

- `roundDecimal(int roundDecimal)` -

    The number of decimal places for distance/score rounding.

- `consistencyLevel(ConsistencyLevel consistencyLevel)` -

    The consistency level for the operation.

- `groupByFieldName(String groupByFieldName)` -

    The field name to group search results by.

- `groupSize(Integer groupSize)` -

    The number of results to return per group.

- `strictGroupSize(Boolean strictGroupSize)` -

    Whether to strictly enforce the group size.

- `functionScore(FunctionScore functionScore)` -

    A FunctionScore object for custom scoring.

**RETURNS:**

*SearchResp*

A **SearchResp** object representing specific search results with the specified output fields and relevance score.

**EXCEPTIONS:**

- **MilvusClientException**

    This exception will be raised when any error occurs during this operation.

## Example\{#example}

```java
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.ConsistencyLevel;
import io.milvus.v2.service.vector.request.AnnSearchReq;
import io.milvus.v2.service.vector.request.HybridSearchReq;
import io.milvus.v2.service.vector.request.data.BinaryVec;
import io.milvus.v2.service.vector.request.data.FloatVec;
import io.milvus.v2.service.vector.request.data.SparseFloatVec;
import io.milvus.v2.service.vector.request.ranker.RRFRanker;
import io.milvus.v2.service.vector.response.SearchResp;

import java.nio.ByteBuffer;

// 1. Set up a client
ConnectConfig connectConfig = ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .token("YOUR_CLUSTER_TOKEN")
        .build();
        
MilvusClientV2 client = new MilvusClientV2(connectConfig);

// 2. Setup input
List<Float> floatVector = generateFolatVector();
ByteBuffer binaryVector = generateBinaryVector();
SortedMap<Long, Float> sparseVector = generateSparseVector();

List<AnnSearchReq> searchRequests = new ArrayList<>();
searchRequests.add(AnnSearchReq.builder()
        .vectorFieldName("float_vector")
        .vectors(Collections.singletonList(new FloatVec(floatVector)))
        .params("{\"nprobe\": 10}")
        .topK(10)
        .build());
searchRequests.add(AnnSearchReq.builder()
        .vectorFieldName("binary_vector")
        .vectors(Collections.singletonList(new BinaryVec(binaryVector)))
        .topK(50)
        .build());
searchRequests.add(AnnSearchReq.builder()
        .vectorFieldName("sparse_vector")
        .vectors(Collections.singletonList(new SparseFloatVec(sparseVector)))
        .topK(100)
        .build());

// 3. Hybrid search
HybridSearchReq hybridSearchReq = HybridSearchReq.builder()
        .collectionName(randomCollectionName)
        .searchRequests(searchRequests)
        .ranker(new RRFRanker(20))
        .topK(10)
        .consistencyLevel(ConsistencyLevel.BOUNDED)
        .build();
SearchResp searchResp = client.hybridSearch(hybridSearchReq);

List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
List<SearchResp.SearchResult> results = searchResults.get(0); // nq = 1, searchResults size is 1
for (SearchResp.SearchResult result : results) {
    System.out.printf("ID: %d, Score: %f, %s\n", (long)result.getId(), result.getScore(), result.getEntity().toString());
}
```
