---
title: "getFunctions() | Java | v2"
slug: /java/java/v2-FunctionScore-getFunctions
sidebar_label: "getFunctions()"
beta: false
added_since: v2.6.x
last_modified: v2.6.x
deprecate_since: false
notebook: false
description: "This getter returns the list of functions defined in this FunctionScore object. | Java | v2"
type: docx
token: RsqKdZaMnoHbaRxYr1fcqRbRnth
sidebar_position: 3
keywords: 
  - vector database tutorial
  - how do vector databases work
  - vector db comparison
  - openai vector db
  - zilliz
  - zilliz cloud
  - cloud
  - getFunctions()
  - javaV226
displayed_sidebar: javaSidebar

displayed_sidbar: javaSidebar
---

import Admonition from '@theme/Admonition';


# getFunctions()

This getter returns the list of functions defined in this FunctionScore object.

```java
public List<CreateCollectionReq.Function> getFunctions()
```

**RETURNS:**

*List\<CreateCollectionReq.Function\>*

**EXCEPTIONS:**

- **MilvusClientException**

    This exception will be raised when any error occurs during this operation.

## Example\{#example}

```java
FunctionScore score = FunctionScore.builder()
    .addFunction(func)
    .build();
List<CreateCollectionReq.Function> functions = score.getFunctions();
```
