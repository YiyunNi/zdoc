---
title: "queryIterator() | Java | v2"
slug: /java/java/v2-Vector-queryIterator
sidebar_label: "queryIterator()"
beta: false
added_since: v2.4.x
last_modified: v2.6.x
deprecate_since: false
notebook: false
description: "This method returns a query iterator to iterate data. | Java | v2"
type: docx
token: NsUVdEgjBo6kThxoQGpcZe4CnqX
sidebar_position: 6
keywords: 
  - sentence transformers
  - Recommender systems
  - information retrieval
  - dimension reduction
  - zilliz
  - zilliz cloud
  - cloud
  - queryIterator()
  - javaV226
  - open source vector db
  - vector database example
  - rag vector database
  - what is vector db
displayed_sidebar: javaSidebar

displayed_sidbar: javaSidebar
---

import Admonition from '@theme/Admonition';


# queryIterator()

This method returns a query iterator to iterate data.

```java
public QueryIterator queryIterator(QueryIteratorReq request)
```

## Request Syntax\{#request-syntax}

```java
queryIterator(QueryIteratorReq.builder()
    .databaseName(String databaseName)
    .collectionName(String collectionName)
    .partitionNames(List<String> partitionNames)
    .outputFields(List<String> outputFields)
    .expr(String expr)
    .consistencyLevel(ConsistencyLevel consistencyLevel)
    .offset(long offset)
    .limit(long limit)
    .ignoreGrowing(boolean ignoreGrowing)
    .timezone(String timezone)
    .batchSize(long batchSize)
    .reduceStopForBest(boolean reduceStopForBest)
    .filterTemplateValues(Map<String, Object> filterTemplateValues)
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

- `outputFields(List<String> outputFields)` -

    A list of field names to include in the output.

- `expr(String expr)` -

    A boolean expression to filter results.

- `consistencyLevel(ConsistencyLevel consistencyLevel)` -

    The consistency level for the operation.

- `offset(long offset)` -

    The number of results to skip before returning.

- `limit(long limit)` -

    The maximum number of results to return.

- `ignoreGrowing(boolean ignoreGrowing)` -

    Whether to ignore growing segments during the operation.

- `timezone(String timezone)` -

    The timezone string for time-related filters.

- `batchSize(long batchSize)` -

    The batch size for iterator operations.

- `reduceStopForBest(boolean reduceStopForBest)` -

    Whether to stop iteration when the best result is found.

- `filterTemplateValues(Map<String, Object> filterTemplateValues)` -

    A map of template variable values for parameterized filters.

**RETURNS:**

*QueryIterator*

A *QueryIterator* object to iterate data.

**EXCEPTIONS:**

- **MilvusClientException**

    This exception will be raised when any error occurs during this operation.

## Example\{#example}

```java
import io.milvus.orm.iterator.QueryIterator;
import io.milvus.response.QueryResultsWrapper;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.ConsistencyLevel;
import io.milvus.v2.service.vector.request.QueryIteratorReq;

// 1. Set up a client
ConnectConfig connectConfig = ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .token("YOUR_CLUSTER_TOKEN")
        .build();
        
MilvusClientV2 client = new MilvusClientV2(connectConfig);

// 2. Iterator data
QueryIterator queryIterator = client.queryIterator(QueryIteratorReq.builder()
        .collectionName("test")
        .expr("id < 300")
        .outputFields(Lists.newArrayList("id", "vector"))
        .batchSize(50L)
        .offset(5)
        .limit(400)
        .consistencyLevel(ConsistencyLevel.BOUNDED)
        .build());

while (true) {
    List<QueryResultsWrapper.RowRecord> res = queryIterator.next();
    if (res.isEmpty()) {
        System.out.println("query iteration finished, close");
        queryIterator.close();
        break;
    }

    for (QueryResultsWrapper.RowRecord record : res) {
        System.out.println(record);
    }
}
```
