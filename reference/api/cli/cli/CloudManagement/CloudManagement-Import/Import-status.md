---
title: "status | Cloud"
slug: /cli/cli/Import-status
sidebar_label: "status"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation gets the status of an import job. | Cloud"
type: docx
token: WgScdvYdRoGsQyxTnfDcLim2nBh
sidebar_position: 3
keywords: 
  - Elastic vector database
  - Pinecone vs Milvus
  - Chroma vs Milvus
  - Annoy vector search
  - zilliz
  - zilliz cloud
  - cloud
  - status
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# status

This operation gets the status of an import job.

## Usage\{#usage}

```bash
zilliz import status [OPTIONS]
```

**OPTIONS:**

- **--job-id** (*string*) -

    **[REQUIRED]**

    Indicates an import job ID.

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates the ID of the involved cluster in the specified import job.

## Example\{#example}

```bash
zilliz import status --job-id job-xxxx --cluster-id in01-xxxxxxxxxxxx
```
