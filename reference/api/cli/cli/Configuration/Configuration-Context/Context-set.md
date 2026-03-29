---
title: "set | Cloud"
slug: /cli/cli/Context-set
sidebar_label: "set"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation sets the current cluster context. | Cloud"
type: docx
token: F17Edjn73ooEBwxN1hWc7iCFngg
sidebar_position: 2
keywords: 
  - Neural Network
  - Deep Learning
  - Knowledge base
  - natural language processing
  - zilliz
  - zilliz cloud
  - cloud
  - set
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# set

This operation sets the current cluster context.

## Usage\{#usage}

```bash
zilliz context set [OPTIONS]
```

**OPTIONS:**

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
