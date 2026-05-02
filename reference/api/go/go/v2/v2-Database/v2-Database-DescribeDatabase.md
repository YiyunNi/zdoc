---
title: "DescribeDatabase() | Go | v2"
slug: /go/v2-Database-DescribeDatabase
sidebar_key: v2-Database-DescribeDatabase
sidebar_label: "DescribeDatabase()"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation returns detailed information about a database, including its properties. | Go | v2"
type: docx
token: AR0Bdq0okohr1Cxa1rOcDtvTnoc
sidebar_position: 4
keywords: 
  - how do vector databases work
  - vector db comparison
  - openai vector db
  - natural language processing database
  - zilliz
  - zilliz cloud
  - cloud
  - DescribeDatabase()
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# DescribeDatabase()

This operation returns detailed information about a database, including its properties.

```go
func (c *Client) DescribeDatabase(ctx context.Context, option DescribeDatabaseOption, callOptions ...grpc.CallOption) (*entity.Database, error)
```

## Request Syntax\{#request-syntax}

```go
option := milvusclient.NewDescribeDatabaseOption(dbName)

result, err := client.DescribeDatabase(ctx, option)
```

**PARAMETERS:**

- **dbName** (*string*)

    The name of the database.

**RETURN TYPE:**

**entity.Database, error*

**RETURNS:**

The database description including properties. Returns an error if the operation fails.

**EXCEPTIONS:**

- **error**

    Check `err != nil` for failure details.

## Example\{#example}

```go
import (
	"context"
	"log"

	"github.com/milvus-io/milvus/client/v2/milvusclient"
)

ctx, cancel := context.WithCancel(context.Background())
defer cancel()

dbName := \`test_db\`
cli, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
	Address: milvusAddr,
})
if err != nil {
	// handle err
}

db, err := cli.DescribeDatabase(ctx, milvusclient.NewDescribeDatabaseOption(dbName))
if err != nil {
	// handle err
}
log.Println(db)
```
