---
title: "DeleteResult | Go | v2"
slug: /go/v2-Vector-DeleteResult
sidebar_key: v2-Vector-DeleteResult
sidebar_label: "DeleteResult"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "Contains the result of a Delete operation including the count of deleted entities. | Go | v2"
type: docx
token: Gh4ydrMIBopZekxncUFcrJctnBl
sidebar_position: 3
keywords: 
  - llm-as-a-judge
  - hybrid vector search
  - Video deduplication
  - Video similarity search
  - zilliz
  - zilliz cloud
  - cloud
  - DeleteResult
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# DeleteResult

Contains the result of a Delete operation including the count of deleted entities.

```go
type DeleteResult struct {
    DeleteCount int64
}
```

**FIELDS:**

- **DeleteCount** (*int64*)

    The number of affected entities.