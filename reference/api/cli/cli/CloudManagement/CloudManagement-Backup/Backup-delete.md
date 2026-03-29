---
title: "delete | Cloud"
slug: /cli/cli/Backup-delete
sidebar_label: "delete"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation deletes a backup. | Cloud"
type: docx
token: HXoRdtosOo9mFLxdKLic4telnWW
sidebar_position: 2
keywords: 
  - Managed vector database
  - Pinecone vector database
  - Audio search
  - what is semantic search
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

This operation deletes a backup.

## Usage\{#usage}

```bash
zilliz backup delete [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates a cluster ID

- **--backup-id** (*string*) -

    **[REQUIRED]**

    Indicates the ID of the backup to delete

## Example\{#example}

```bash
zilliz backup delete --cluster-id in01-xxxx --backup-id backup-xxxx
```
