---
title: "GetCompactionState() | Go | v2"
slug: /go/v2-Management-GetCompactionState
sidebar_key: v2-Management-GetCompactionState
sidebar_label: "GetCompactionState()"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation returns the current state of a compaction operation. | Go | v2"
type: docx
token: LLYvdMBa6osxRQx90sHcm02Kn2b
sidebar_position: 11
keywords: 
  - multimodal vector database retrieval
  - Retrieval Augmented Generation
  - Large language model
  - Vectorization
  - zilliz
  - zilliz cloud
  - cloud
  - GetCompactionState()
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# GetCompactionState()

This operation returns the current state of a compaction operation.

```go
func (c *Client) GetCompactionState(ctx context.Context, option GetCompactionStateOption, callOptions ...grpc.CallOption) (entity.CompactionState, error)
```

## Request Syntax\{#request-syntax}

```go
option := milvusclient.NewGetCompactionStateOption(compactionID)

result, err := client.GetCompactionState(ctx, option)
```

**PARAMETERS:**

- **compactionID** (*int64*)

    The compaction i d value.

**RETURN TYPE:**

*entity.CompactionState, error*

**RETURNS:**

The current state of the compaction operation. Returns an error if the operation fails.

**EXCEPTIONS:**

- **error**

    Check `err != nil` for failure details.

## Example\{#example}

```go
import (
	"context"
	"fmt"

	"github.com/milvus-io/milvus/client/v2/milvusclient"
)

ctx, cancel := context.WithCancel(context.Background())
defer cancel()

compactID := int64(123)

cli, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
	Address: milvusAddr,
})
if err != nil {
	// handle err
}

state, err := cli.GetCompactionState(ctx, milvusclient.NewGetCompactionStateOption(compactID))
if err != nil {
	// handle err
}
fmt.Println(state)
```
