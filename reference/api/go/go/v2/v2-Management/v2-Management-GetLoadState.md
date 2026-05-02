---
title: "GetLoadState() | Go | v2"
slug: /go/v2-Management-GetLoadState
sidebar_key: v2-Management-GetLoadState
sidebar_label: "GetLoadState()"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation returns the current load state and progress of a collection or partitions. | Go | v2"
type: docx
token: AvOXd92pPoAXPcxvArwcvKnSnph
sidebar_position: 12
keywords: 
  - Context Window
  - Natural language search
  - Similarity Search
  - multimodal RAG
  - zilliz
  - zilliz cloud
  - cloud
  - GetLoadState()
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# GetLoadState()

This operation returns the current load state and progress of a collection or partitions.

```go
func (c *Client) GetLoadState(ctx context.Context, option GetLoadStateOption, callOptions ...grpc.CallOption) (entity.LoadState, error)
```

## Request Syntax\{#request-syntax}

```go
option := milvusclient.NewGetLoadStateOption(collectionName, partitionNames)

result, err := client.GetLoadState(ctx, option)
```

**PARAMETERS:**

- **collectionName** (*string*)

    The name of the target collection.

- **partitionNames** (*...string*)

    The name(s) of the partition(s).

**RETURN TYPE:**

*[entity.LoadState](./v2-Management-LoadState), error*

**RETURNS:**

The current load state of the collection or partitions. Returns an error if the operation fails.

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

collectionName := \`customized_setup_1\`

cli, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
	Address: milvusAddr,
})
if err != nil {
	// handle err
}

loadState, err := cli.GetLoadState(ctx, milvusclient.NewGetLoadStateOption(collectionName))
if err != nil {
	// handle err
}
fmt.Println(loadState)
```
