---
title: "search() | Java | v2"
slug: /java/java/v2-Vector-search
sidebar_label: "search()"
beta: false
added_since: v2.3.x
last_modified: v2.6.x
deprecate_since: false
notebook: false
description: "This operation conducts a vector similarity search with an optional scalar filtering expression. | Java | v2"
type: docx
token: TU67dq9Drou7ubx4suFcJD7uns1
sidebar_position: 7
keywords: 
  - AI chatbots
  - cosine distance
  - what is a vector database
  - vectordb
  - zilliz
  - zilliz cloud
  - cloud
  - search()
  - javaV226
  - Hierarchical Navigable Small Worlds
  - Dense embedding
  - Faiss vector database
  - Chroma vector database
displayed_sidebar: javaSidebar

displayed_sidbar: javaSidebar
---

import Admonition from '@theme/Admonition';


# search()

This operation conducts a vector similarity search with an optional scalar filtering expression.

```java
public SearchResp search(SearchReq request)
```

## Request Syntax\{#request-syntax}

```java
search(SearchReq.builder()
    .databaseName(String databaseName)
    .collectionName(String collectionName)
    .partitionNames(List<String> partitionNames)
    .annsField(String annsField)
    .topK(int topK)
    .filter(String filter)
    .outputFields(List<String> outputFields)
    .data(List<BaseVector> data)
    .ids(List<Object> ids)
    .offset(long offset)
    .limit(long limit)
    .roundDecimal(int roundDecimal)
    .searchParams(Map<String, Object> searchParams)
    .guaranteeTimestamp(long guaranteeTimestamp)
    .gracefulTime(Long gracefulTime)
    .consistencyLevel(ConsistencyLevel consistencyLevel)
    .ignoreGrowing(boolean ignoreGrowing)
    .timezone(String timezone)
    .groupByFieldName(String groupByFieldName)
    .groupSize(Integer groupSize)
    .strictGroupSize(Boolean strictGroupSize)
    .functionScore(FunctionScore functionScore)
    .filterTemplateValues(Map<String, Object> filterTemplateValues)
    .highlighter(Highlighter highlighter)
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

- `annsField(String annsField)` -

    The name of the vector field for approximate nearest neighbor search.

- `topK(int topK)` -

    The number of top results to return.

- `filter(String filter)` -

    A boolean expression to filter results.

- `outputFields(List<String> outputFields)` -

    A list of field names to include in the output.

- `data(List<BaseVector> data)` -

    A list of data rows to insert/upsert as JSON objects.

- `ids(List<Object> ids)` -

    A list of primary key values to identify specific entities.

- `offset(long offset)` -

    The number of results to skip before returning.

- `limit(long limit)` -

    The maximum number of results to return.

- `roundDecimal(int roundDecimal)` -

    The number of decimal places for distance/score rounding.

- `searchParams(Map<String, Object> searchParams)` -

    Additional search parameters as key-value pairs.

- `guaranteeTimestamp(long guaranteeTimestamp)` -

    A timestamp guaranteeing that all operations before it are visible.

- `gracefulTime(Long gracefulTime)` -

    The graceful time in milliseconds for consistency.

- `consistencyLevel(ConsistencyLevel consistencyLevel)` -

    The consistency level for the operation.

- `ignoreGrowing(boolean ignoreGrowing)` -

    Whether to ignore growing segments during the operation.

- `timezone(String timezone)` -

    The timezone string for time-related filters.

- `groupByFieldName(String groupByFieldName)` -

    The field name to group search results by.

- `groupSize(Integer groupSize)` -

    The number of results to return per group.

- `strictGroupSize(Boolean strictGroupSize)` -

    Whether to strictly enforce the group size.

- `functionScore(FunctionScore functionScore)` -

    A FunctionScore object for custom scoring.

- `filterTemplateValues(Map<String, Object> filterTemplateValues)` -

    A map of template variable values for parameterized filters.

- `highlighter(Highlighter highlighter)` -

    A Highlighter object for text highlighting in search results.

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
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.request.data.FloatVec;
import io.milvus.v2.service.vector.response.SearchResp;

// 1. Set up a client
ConnectConfig connectConfig = ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .token("YOUR_CLUSTER_TOKEN")
        .build();
        
MilvusClientV2 client = new MilvusClientV2(connectConfig);

// 2. Search
SearchResp searchR = client.search(SearchReq.builder()
        .collectionName(collectionName)
        .data(Collections.singletonList(new FloatVec(new float[]{1.0f, 2.0f})))
        .filter("id < 100")
        .topK(10)
        .outputFields(Collections.singletonList("*"))
        .build());
        
List<List<SearchResp.SearchResult>> searchResults = searchR.getSearchResults();
System.out.println("\nSearch results:");
for (List<SearchResp.SearchResult> results : searchResults) {
    for (SearchResp.SearchResult result : results) {
        System.out.printf("ID: %d, Score: %f, %s\n", (long)result.getId(), result.getScore(), result.getEntity().toString());
    }
}
```
