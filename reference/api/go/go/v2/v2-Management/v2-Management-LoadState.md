---
title: "LoadState | Go | v2"
slug: /go/v2-Management-LoadState
sidebar_key: v2-Management-LoadState
sidebar_label: "LoadState"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "Represents the load state of a collection or partition, including progress percentage. | Go | v2"
type: docx
token: XWSAdFkdDoaDPnxOtkEcuFETngL
sidebar_position: 20
keywords: 
  - llm hallucinations
  - hybrid search
  - lexical search
  - nearest neighbor search
  - zilliz
  - zilliz cloud
  - cloud
  - LoadState
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# LoadState

Represents the load state of a collection or partition, including progress percentage.

```go
type LoadState struct {
    State LoadStateCode
    Progress int64
}
```

**FIELDS:**

- **State** (*LoadStateCode*)

    The current state.

- **Progress** (*int64*)

    The progress percentage.