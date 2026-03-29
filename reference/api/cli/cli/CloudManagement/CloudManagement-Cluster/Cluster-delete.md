---
title: "delete | Cloud"
slug: /cli/cli/Cluster-delete
sidebar_label: "delete"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation deletes a cluster. This action is irreversible. | Cloud"
type: docx
token: VmQ7dKl8FoFf9sxbmG3c3udOnVe
sidebar_position: 2
keywords: 
  - Sparse vs Dense
  - Dense vector
  - Hierarchical Navigable Small Worlds
  - Dense embedding
  - zilliz
  - zilliz cloud
  - cloud
  - delete
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# delete

This operation deletes a cluster. This action is irreversible.

## Usage\{#usage}

```bash
zilliz cluster delete [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates the ID of the cluster to delete.

## Example\{#example}

```bash
zilliz cluster delete --cluster-id in01-xxxxxxxxxxxx

# Skip confirmation prompt
zilliz cluster delete --cluster-id in01-xxxxxxxxxxxx -y
```
