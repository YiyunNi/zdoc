---
title: "UpsertResult | Go | v2"
slug: /go/v2-Vector-UpsertResult
sidebar_key: v2-Vector-UpsertResult
sidebar_label: "UpsertResult"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "Contains the result of an Upsert operation including the count and IDs of affected entities. | Go | v2"
type: docx
token: KlfGdGLbxo7zfNxin91cgFxWnQO
sidebar_position: 15
keywords: 
  - Zilliz Cloud
  - what is milvus
  - milvus database
  - milvus lite
  - zilliz
  - zilliz cloud
  - cloud
  - UpsertResult
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# UpsertResult

Contains the result of an Upsert operation including the count and IDs of affected entities.

```go
type UpsertResult struct {
    UpsertCount int64
    IDs column.Column
}
```

**FIELDS:**

- **UpsertCount** (*int64*)

    The number of affected entities.

- **IDs** (*column.Column*)

    The IDs of the affected entities.