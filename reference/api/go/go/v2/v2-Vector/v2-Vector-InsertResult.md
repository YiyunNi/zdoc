---
title: "InsertResult | Go | v2"
slug: /go/v2-Vector-InsertResult
sidebar_key: v2-Vector-InsertResult
sidebar_label: "InsertResult"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "Contains the result of an Insert operation including the count and IDs of inserted entities. | Go | v2"
type: docx
token: EqKvdT96PoSVzzxyEF7civIgnDh
sidebar_position: 7
keywords: 
  - Audio similarity search
  - Elastic vector database
  - Pinecone vs Milvus
  - Chroma vs Milvus
  - zilliz
  - zilliz cloud
  - cloud
  - InsertResult
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# InsertResult

Contains the result of an Insert operation including the count and IDs of inserted entities.

```go
type InsertResult struct {
    InsertCount int64
    IDs column.Column
}
```

**FIELDS:**

- **InsertCount** (*int64*)

    The number of affected entities.

- **IDs** (*column.Column*)

    The IDs of the affected entities.