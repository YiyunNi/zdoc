---
title: "CreateIndexTask | Go | v2"
slug: /go/v2-Management-CreateIndexTask
sidebar_key: v2-Management-CreateIndexTask
sidebar_label: "CreateIndexTask"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "An async task returned by CreateIndex. Call Await() to block until the index build completes. | Go | v2"
type: docx
token: Y0IAdifhVoYQVAxiZEdcjIS0nog
sidebar_position: 5
keywords: 
  - NLP
  - Neural Network
  - Deep Learning
  - Knowledge base
  - zilliz
  - zilliz cloud
  - cloud
  - CreateIndexTask
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# CreateIndexTask

An async task returned by CreateIndex. Call Await() to block until the index build completes.

```go
type CreateIndexTask struct {
}
```

**METHODS:**

- `Await(ctx context.Context) error`

    Blocks until the async operation completes or the context is cancelled. Returns an error if the operation fails.