---
title: "PrivilegeGroup | Go | v2"
slug: /go/v2-Authentication-PrivilegeGroup
sidebar_key: v2-Authentication-PrivilegeGroup
sidebar_label: "PrivilegeGroup"
added_since: v2.6.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "Represents a named group of privileges that can be granted together. | Go | v2"
type: docx
token: IPv6dB9pdoGXeRxdoL4c70pWnmg
sidebar_position: 17
keywords: 
  - LLMs
  - Machine Learning
  - RAG
  - NLP
  - zilliz
  - zilliz cloud
  - cloud
  - PrivilegeGroup
  - gov230
displayed_sidebar: goSidebar

---

import Admonition from '@theme/Admonition';


# PrivilegeGroup

Represents a named group of privileges that can be granted together.

```go
type PrivilegeGroup struct {
    GroupName string
    Privileges []string
}
```

**FIELDS:**

- **GroupName** (*string*)

    The name of the privilege group.

- **Privileges** (*[]string*)

    The list of granted privileges.