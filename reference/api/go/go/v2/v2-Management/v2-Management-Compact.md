---
title: "Compact() | Go | v2"
slug: /go/v2-Management-Compact
sidebar_key: v2-Management-Compact
sidebar_label: "Compact()"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation triggers compaction to merge small data segments into larger ones for better performance. | Go | v2"
type: docx
token: VJKcdlljXofguixcGe5c2CwwnEf
sidebar_position: 2
keywords: 
  - DiskANN
  - Sparse vector
  - Vector Dimension
  - ANN Search
  - zilliz
  - zilliz cloud
  - cloud
  - Compact()
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# Compact()

This operation triggers compaction to merge small data segments into larger ones for better performance.

```go
func (c *Client) Compact(ctx context.Context, option CompactOption, callOptions ...grpc.CallOption) (int64, error)
```

## Request Syntax\{#request-syntax}

```go
option := milvusclient.NewCompactOption(collectionName)

result, err := client.Compact(ctx, option)
```

**PARAMETERS:**

- **collectionName** (*string*)

    The name of the target collection.

**RETURN TYPE:**

*int64, error*

**RETURNS:**

The numeric result value. Returns an error if the operation fails.

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

compactID, err := cli.Compact(ctx, milvusclient.NewCompactOption(collectionName))
if err != nil {
	// handle err
}
fmt.Println(compactID)
```
