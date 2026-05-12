---
title: "addCollectionField() | Java | v2"
slug: /java/java/v2-Collections-addCollectionField
sidebar_key: java/v2-Collections-addCollectionField
sidebar_label: "addCollectionField()"
added_since: v2.6.x
last_modified: v2.6.x
deprecate_since: false
beta: false
notebook: false
description: "This operation adds a new scalar field to an existing collection without recreating it. The field becomes available almost immediately with minimal delay due to internal schema synchronization. | Java | v2"
type: docx
token: V9rBdJEGzoCybDx9FIfcpqJbnlc
sidebar_position: 23
keywords: 
  - rag llm architecture
  - private llms
  - nn search
  - llm eval
  - zilliz
  - zilliz cloud
  - cloud
  - addCollectionField()
  - javaV230
displayed_sidebar: javaSidebar

---

import Admonition from '@theme/Admonition';


# addCollectionField()

This operation adds a new scalar field to an existing collection without recreating it. The field becomes available almost immediately with minimal delay due to internal schema synchronization.

```java
public void addCollectionField(AddCollectionFieldReq request)
```

## Request Syntax\{#request-syntax}

```java
addCollectionField(AddCollectionFieldReq.builder()
    .collectionName(String collectionName)
    .databaseName(String databaseName)
    .build()
);
```

**BUILDER METHODS:**

- `collectionName(String collectionName)` -

    The name of the target collection.

- `databaseName(String databaseName)` -

    The name of the database. Defaults to the current database if not specified.

**RETURNS:**

*void*

**EXCEPTIONS:**

- **MilvusClientException**

    This exception will be raised when any error occurs during this operation.

## Example\{#example}

```java
import io.milvus.v2.service.collection.request.AddCollectionFieldReq;
import io.milvus.v2.common.DataType;

// Add a nullable VarChar field to an existing collection.
// The new field must be nullable so that existing rows get null values.
client.addCollectionField(AddCollectionFieldReq.builder()
        .collectionName("my_collection")
        .fieldName("text")
        .dataType(DataType.VarChar)
        .maxLength(100)
        .isNullable(true)
        .build());
```
