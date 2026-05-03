---
title: "Database | Go | v2"
slug: /go/v2-Database
sidebar_key: v2-Database
sidebar_label: "Database"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "Represents a database description returned by DescribeDatabase, including custom properties. | Go | v2"
type: docx
token: KXgNdgTrWoglBsxXTjvcIwnpnqh
sidebar_position: 3
keywords: 
  - Zilliz Cloud
  - what is milvus
  - milvus database
  - milvus lite
  - zilliz
  - zilliz cloud
  - cloud
  - Database
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# Database

Represents a database description returned by DescribeDatabase, including custom properties.

```go
type Database struct {
    Name string
    Properties map[string]string
}
```

**FIELDS:**

- **Name** (*string*)

    The name.

- **Properties** (*map[string]string*)

    Custom key-value properties.