---
title: "NewTrieIndex() | Go | v2"
slug: /go/v2-Index-NewTrieIndex
sidebar_key: v2-Index-NewTrieIndex
sidebar_label: "NewTrieIndex()"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This function creates a Trie index configuration for efficient prefix-based string field filtering. | Go | v2"
type: docx
token: MSFrdlGjaoh9zdxHuZqcf6VsnDw
sidebar_position: 26
keywords: 
  - Zilliz vector database
  - Zilliz database
  - Unstructured Data
  - vector database
  - zilliz
  - zilliz cloud
  - cloud
  - NewTrieIndex()
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# NewTrieIndex()

This function creates a Trie index configuration for efficient prefix-based string field filtering.

```go
func NewTrieIndex() Index
```

**RETURNS:**

*[Index](./v2-Management-Index)*

An index configuration instance. Pass this to `CreateIndex()` via the index option.

## Example\{#example}

```go
import (
	"github.com/milvus-io/milvus/client/v2/index"
	"github.com/milvus-io/milvus/client/v2/milvusclient"
)

// Create index configuration
idx := index.NewTrieIndex()

// Use with CreateIndex
createIdxOption := milvusclient.NewCreateIndexOption("collection_name", "vector_field", idx)
task, err := client.CreateIndex(ctx, createIdxOption)
```
