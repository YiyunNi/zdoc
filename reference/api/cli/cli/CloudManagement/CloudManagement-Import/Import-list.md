---
title: "list | Cloud"
slug: /cli/cli/Import-list
sidebar_label: "list"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation lists import jobs for a cluster. | Cloud"
type: docx
token: PbE8dm28yo4rNzxrbIecQtMqnVq
sidebar_position: 1
keywords: 
  - k nearest neighbor algorithm
  - ANNS
  - Vector search
  - knn algorithm
  - zilliz
  - zilliz cloud
  - cloud
  - list
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# list

This operation lists import jobs for a cluster.

## Usage\{#usage}

```bash
zilliz import list [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates a cluster ID.

- **--page-size** (*integer*) -

    Indicates the number of items per page.

- **--page** (*integer*) -

    Indicates the current page number.

- **--database** (*string*) -

    Indicates the name of a database in the specified cluster.

## Example\{#example}

```bash
zilliz import list --cluster-id in01-xxxxxxxxxxxx
```
