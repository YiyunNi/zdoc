---
title: "NewRTreeIndex() | Go | v2"
slug: /go/v2-Index-NewRTreeIndex
sidebar_key: v2-Index-NewRTreeIndex
sidebar_label: "NewRTreeIndex()"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This function creates an R-tree index configuration for spatial data queries on geometry fields. | Go | v2"
type: docx
token: I053djRjsob1JJxKXvUcGelbn2d
sidebar_position: 21
keywords: 
  - llm hallucinations
  - hybrid search
  - lexical search
  - nearest neighbor search
  - zilliz
  - zilliz cloud
  - cloud
  - NewRTreeIndex()
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# NewRTreeIndex()

This function creates an R-tree index configuration for spatial data queries on geometry fields.

```go
func NewRTreeIndex() Index
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
idx := index.NewRTreeIndex()

// Use with CreateIndex
createIdxOption := milvusclient.NewCreateIndexOption("collection_name", "vector_field", idx)
task, err := client.CreateIndex(ctx, createIdxOption)
```
