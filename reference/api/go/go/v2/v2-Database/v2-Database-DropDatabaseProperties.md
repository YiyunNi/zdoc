---
title: "DropDatabaseProperties() | Go | v2"
slug: /go/v2-Database-DropDatabaseProperties
sidebar_key: v2-Database-DropDatabaseProperties
sidebar_label: "DropDatabaseProperties()"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation removes specified properties from a database. | Go | v2"
type: docx
token: Le2bdLZXCoKVXXxF2kgcuDt2neh
sidebar_position: 6
keywords: 
  - milvus db
  - milvus vector db
  - Zilliz Cloud
  - what is milvus
  - zilliz
  - zilliz cloud
  - cloud
  - DropDatabaseProperties()
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# DropDatabaseProperties()

This operation removes specified properties from a database.

```go
func (c *Client) DropDatabaseProperties(ctx context.Context, option DropDatabasePropertiesOption, callOptions ...grpc.CallOption) error
```

## Request Syntax\{#request-syntax}

```go
option := milvusclient.NewDropDatabasePropertiesOption(dbName, propertyKeys)

err := client.DropDatabaseProperties(ctx, option)
```

**PARAMETERS:**

- **dbName** (*string*)

    The name of the database.

- **propertyKeys** (*...string*)

    The property keys.

**RETURN TYPE:**

*error*

**RETURNS:**

Returns nil on success, or an error describing what went wrong.

**EXCEPTIONS:**

- **error**

    Check `err != nil` for failure details.

## Example\{#example}

```go
import (
	"context"

	"github.com/milvus-io/milvus/client/v2/milvusclient"
	"github.com/milvus-io/milvus/pkg/v2/common"
)

ctx, cancel := context.WithCancel(context.Background())
defer cancel()

cli, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
	Address: "YOUR_CLUSTER_ENDPOINT",
})
if err != nil {
	// handle err
}
defer cli.Close(ctx)

err = cli.DropDatabaseProperties(ctx, milvusclient.NewDropDatabasePropertiesOption("my_database", common.DatabaseReplicaNumber))
if err != nil {
	// handle err
}
```
