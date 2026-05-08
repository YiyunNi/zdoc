---
title: "Alias | Go | v2"
slug: /go/v2-Collection-Alias
sidebar_key: v2-Collection-Alias
sidebar_label: "Alias"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "Represents a collection alias with its associated database and collection name. | Go | v2"
type: docx
token: GwIxdz90jojeBNx965VcTJHnnFd
sidebar_position: 2
keywords: 
  - Image Search
  - LLMs
  - Machine Learning
  - RAG
  - zilliz
  - zilliz cloud
  - cloud
  - Alias
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# Alias

Represents a collection alias with its associated database and collection name.

```go
type Alias struct {
    DbName string
    Alias string
    CollectionName string
}
```

**FIELDS:**

- **DbName** (*string*)

    The name of the associated database.

- **Alias** (*string*)

    The alias name.

- **CollectionName** (*string*)

    The name of the associated collection.