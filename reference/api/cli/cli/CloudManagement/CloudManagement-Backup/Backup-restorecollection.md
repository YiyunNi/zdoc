---
title: "restore-collection | Cloud"
slug: /cli/cli/Backup-restorecollection
sidebar_label: "restore-collection"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation restores specific collections from a backup. | Cloud"
type: docx
token: AloudGinroMIAHxCT0GcJt5An4g
sidebar_position: 8
keywords: 
  - Vectorization
  - k nearest neighbor algorithm
  - ANNS
  - Vector search
  - zilliz
  - zilliz cloud
  - cloud
  - restore-collection
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# restore-collection

This operation restores specific collections from a backup.

## Usage\{#usage}

```bash
zilliz backup restore-collection [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates the source cluster ID.

- **--backup-id** (*string*) -

    **[REQUIRED]**

    Indicates the backup ID.

- **--dest-cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates the destination cluster ID.

## Example\{#example}

```bash
zilliz backup restore-collection --cluster-id in01-xxxx --backup-id backup-xxxx --dest-cluster-id in01-yyyy
```
