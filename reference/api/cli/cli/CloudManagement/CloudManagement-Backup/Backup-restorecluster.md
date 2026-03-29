---
title: "restore-cluster | Cloud"
slug: /cli/cli/Backup-restorecluster
sidebar_label: "restore-cluster"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation restores a backup to a new cluster. | Cloud"
type: docx
token: TUQ6df38Do0bKbxu9ODcbZMtnAb
sidebar_position: 7
keywords: 
  - vector database tutorial
  - how do vector databases work
  - vector db comparison
  - openai vector db
  - zilliz
  - zilliz cloud
  - cloud
  - restore-cluster
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# restore-cluster

This operation restores a backup to a new cluster.

## Usage\{#usage}

```bash
zilliz backup restore-cluster [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates the source cluster ID.

- **--backup-id** (*string*) -

    **[REQUIRED]**

    Indicates the ID of the backup to restore.

- **--project-id** (*string*) -

    **[REQUIRED]**

    Indicates the target project ID.

- **--name** (*string*) -

    **[REQUIRED]**

    Indicates the new cluster name.

- **--cu-size** (*integer*) -

    **[REQUIRED]**

    Indicates the compute units (CUs) for the new cluster.

- **--collection-status** (*string*) -

    **[REQUIRED]**

    Indicates the collection state after restoration.

    Possible values: `LOADED` and `NOT_LOADED`.

## Example\{#example}

```bash
# Restore with collections loaded
zilliz backup restore-cluster --cluster-id in01-xxxx --backup-id backup-xxxx --project-id proj-xxxx --name restored --cu-size 1 --collection-status LOADED
```
