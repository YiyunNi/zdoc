---
title: "list | Cloud"
slug: /cli/cli/Cluster-list
sidebar_label: "list"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation lists all clusters. | Cloud"
type: docx
token: SGifd4eCmoxfMmxLohec5nFnn7g
sidebar_position: 4
keywords: 
  - Vector store
  - open source vector database
  - Vector index
  - vector database open source
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

This operation lists all clusters.

## Usage\{#usage}

```bash
zilliz cluster list [OPTIONS]
```

**OPTIONS:**

- **--page-size** (*integer*) -

    Indicates the items per page.

- **--page** (*integer*) -

    Indicates the page number.

## Example\{#example}

```bash
# List all clusters
zilliz cluster list

# Fetch all pages
zilliz cluster list --all
```
