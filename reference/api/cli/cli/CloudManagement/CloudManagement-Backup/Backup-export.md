---
title: "export | Cloud"
slug: /cli/cli/Backup-export
sidebar_label: "export"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation exports a backup to external storage. | Cloud"
type: docx
token: A4XEdRBSZoBVotxjz8Bca39Dnbf
sidebar_position: 5
keywords: 
  - Image Search
  - LLMs
  - Machine Learning
  - RAG
  - zilliz
  - zilliz cloud
  - cloud
  - export
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# export

This operation exports a backup to external storage.

## Usage\{#usage}

```bash
zilliz backup export [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates a cluster ID.

- **--backup-id** (*string*) -

    **[REQUIRED]**

    Indicates a backup ID.

- **--integration-id** (*string*) -

    **[REQUIRED]**

    Indicates a storage integration ID.

- **--directory** (*string*) -

    Indicates the target directory in external storage.

## Example\{#example}

```bash
zilliz backup export --cluster-id in01-xxxx --backup-id backup-xxxx --integration-id integ-xxxx
```
