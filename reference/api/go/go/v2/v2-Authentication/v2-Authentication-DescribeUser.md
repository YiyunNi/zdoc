---
title: "DescribeUser() | Go | v2"
slug: /go/v2-Authentication-DescribeUser
sidebar_key: v2-Authentication-DescribeUser
sidebar_label: "DescribeUser()"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation returns detailed information about a user, including their assigned roles. | Go | v2"
type: docx
token: EbOodxkWBoRvwAxzJOkcsM6lnic
sidebar_position: 7
keywords: 
  - image similarity search
  - Context Window
  - Natural language search
  - Similarity Search
  - zilliz
  - zilliz cloud
  - cloud
  - DescribeUser()
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# DescribeUser()

This operation returns detailed information about a user, including their assigned roles.

```go
func (c *Client) DescribeUser(ctx context.Context, opt DescribeUserOption, callOpts ...grpc.CallOption) (*entity.User, error)
```

## Request Syntax\{#request-syntax}

```go
option := milvusclient.NewDescribeUserOption(userName)

result, err := client.DescribeUser(ctx, option)
```

**PARAMETERS:**

- **userName** (*string*)

    The name of the user.

**RETURN TYPE:**

**[entity.User](./v2-Authentication-User), error*

**RETURNS:**

The user description including assigned roles. Returns an error if the operation fails.

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

cli, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
	Address: "YOUR_CLUSTER_ENDPOINT",
})
if err != nil {
	// handle error
}
defer cli.Close(ctx)

user, err := cli.DescribeUser(ctx, milvusclient.NewDescribeUserOption("my_user"))
if err != nil {
	// handle error
}
fmt.Println(user)
```
