---
title: "set | Cloud"
slug: /cli/cli/Context-set
sidebar_key: cli/Context-set
sidebar_label: "set"
added_since: v0.1.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation sets the current cluster context. | Cloud"
type: docx
token: Mbj7dQ8OmojO2fxa3PPcr8V8n4c
sidebar_position: 3
keywords: 
  - llm hallucinations
  - hybrid search
  - lexical search
  - nearest neighbor search
  - zilliz
  - zilliz cloud
  - cloud
  - set
  - cliv13
displayed_sidebar: cliSidebar

---

import Admonition from '@theme/Admonition';


# set

This operation sets the current cluster context.

## Synopsis\{#synopsis}

```bash
zilliz context set
[--cluster-id <value>]
[--endpoint <value>]
[--database <value>]
```

## Options\{#options}

- **--cluster-id** (*string*) -

    Indicates a cluster ID. Once set, the specified cluster always applies unless otherwise specified.

- **--endpoint** (*string*) -

    Indicates a cluster endpoint URL. This is optional, and will be auto-resolved from the specified cluster ID.

- **--database** (*string*) -

    Indicates a database name in the specified cluster.

## Example\{#example}

```bash
zilliz context set --cluster-id inxx-xxxxx
```
