---
title: "describe-policy | Cloud"
slug: /cli/cli/Backup-describepolicy
sidebar_label: "describe-policy"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation describes the backup policy for a cluster. | Cloud"
type: docx
token: L7cCdeeP2oszbnxQE5ccCpIJnGb
sidebar_position: 4
keywords: 
  - Faiss vector database
  - Chroma vector database
  - nlp search
  - hallucinations llm
  - zilliz
  - zilliz cloud
  - cloud
  - describe-policy
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# describe-policy

This operation describes the backup policy for a cluster.

## Usage\{#usage}

```bash
zilliz backup describe-policy [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates a cluster ID.

## Example\{#example}

```bash
zilliz backup describe-policy --cluster-id in01-xxxxxxxxxxxx
```
