---
title: "create | Cloud"
slug: /cli/cli/Backup-create
sidebar_label: "create"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation creates a backup for a cluster. | Cloud"
type: docx
token: QZ2zdL2buoahCwxPTp7cbCe4nBc
sidebar_position: 1
keywords: 
  - Vectorization
  - k nearest neighbor algorithm
  - ANNS
  - Vector search
  - zilliz
  - zilliz cloud
  - cloud
  - create
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# create

This operation creates a backup for a cluster.

## Usage\{#usage}

```bash
zilliz backup create [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates the cluster ID.

- **--database** (*string*) -

    Indicates the database name for collection-level backup

- **--collection** (*string*) -

    Indicates a collection name. You can omit it for a full cluster backup.

## Example\{#example}

```bash
# Full cluster backup (default)
zilliz backup create --cluster-id in01-xxxxxxxxxxxx

# Collection-level backup
zilliz backup create --cluster-id in01-xxxxxxxxxxxx --database default --collection my_col
```
