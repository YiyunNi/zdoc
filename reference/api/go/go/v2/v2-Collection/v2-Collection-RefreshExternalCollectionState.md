---
title: "RefreshExternalCollectionState | Go | v2"
slug: /go/v2-Collection-RefreshExternalCollectionState
sidebar_key: v2-Collection-RefreshExternalCollectionState
sidebar_label: "RefreshExternalCollectionState"
added_since: v3.0.0
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This type represents the state of a refresh external collection job. | Go | v2"
type: docx
token: Or8Gd2JEIo1swQxD3QTccFoBn9b
sidebar_position: 29
keywords: 
  - Zilliz database
  - Unstructured Data
  - vector database
  - IVF
  - zilliz
  - zilliz cloud
  - cloud
  - RefreshExternalCollectionState
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# RefreshExternalCollectionState

This type represents the state of a refresh external collection job.

```go
type RefreshExternalCollectionState milvuspb.RefreshExternalCollectionState
```

**CONSTANTS:**

- **RefreshStatePending** -
The job is pending and has not started yet.

- **RefreshStateInProgress** -
The job is currently in progress.

- **RefreshStateCompleted** -
The job has completed successfully.

