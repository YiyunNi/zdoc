---
title: "NewBitmapIndex() | Go | v2"
slug: /go/v2-Index-NewBitmapIndex
sidebar_key: v2-Index-NewBitmapIndex
sidebar_label: "NewBitmapIndex()"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This function creates a bitmap index configuration for efficient filtering on low-cardinality scalar fields. | Go | v2"
type: docx
token: EhzHdkYfUoOsprxhtPNcmMPKnEc
sidebar_position: 5
keywords: 
  - hybrid search
  - lexical search
  - nearest neighbor search
  - Agentic RAG
  - zilliz
  - zilliz cloud
  - cloud
  - NewBitmapIndex()
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# NewBitmapIndex()

This function creates a bitmap index configuration for efficient filtering on low-cardinality scalar fields.

```go
func NewBitmapIndex() Index
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
idx := index.NewBitmapIndex()

// Use with CreateIndex
createIdxOption := milvusclient.NewCreateIndexOption("collection_name", "vector_field", idx)
task, err := client.CreateIndex(ctx, createIdxOption)
```
