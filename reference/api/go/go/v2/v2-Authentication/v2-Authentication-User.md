---
title: "User | Go | v2"
slug: /go/v2-Authentication-User
sidebar_key: v2-Authentication-User
sidebar_label: "User"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "Represents a user with their assigned roles, returned by DescribeUser. | Go | v2"
type: docx
token: FCnndgcaworiHGxozvocjrZonIj
sidebar_position: 26
keywords: 
  - Anomaly Detection
  - sentence transformers
  - Recommender systems
  - information retrieval
  - zilliz
  - zilliz cloud
  - cloud
  - User
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# User

Represents a user with their assigned roles, returned by DescribeUser.

```go
type User struct {
    UserName string
    Roles []string
}
```

**FIELDS:**

- **UserName** (*string*)

    The name of the user.

- **Roles** (*[]string*)

    The list of assigned roles.