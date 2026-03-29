---
title: "modify | Cloud"
slug: /cli/cli/Cluster-modify
sidebar_label: "modify"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation modifies a cluster configuration, such as scaling the number of allocated CUs or the number of replicas to create. | Cloud"
type: docx
token: YmP7dBDHPo5rKAxGFRGcUFjznLd
sidebar_position: 6
keywords: 
  - What is unstructured data
  - Vector embeddings
  - Vector store
  - open source vector database
  - zilliz
  - zilliz cloud
  - cloud
  - modify
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# modify

This operation modifies a cluster configuration, such as scaling the number of allocated CUs or the number of replicas to create.

## Usage\{#usage}

```bash
zilliz cluster modify [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates the ID of the cluster to modify.

- **--cu-size** (*integer*) -

    Indicates the number of compute units (CUs) after this operation.

- **--replica** (*integer*) -

    Indicates the number of replicas after this operation.

## Example\{#example}

```bash
# Scale to 2 CUs
zilliz cluster modify --cluster-id in01-xxxxxxxxxxxx --cu-size 2

# Set replicas
zilliz cluster modify --cluster-id in01-xxxxxxxxxxxx --replica 2
```
