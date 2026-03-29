---
title: "list | Cloud"
slug: /cli/cli/Backup-list
sidebar_label: "list"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation lists all backups. | Cloud"
type: docx
token: IO8UdHyHmotVsLx6D18cRBpYn8y
sidebar_position: 6
keywords: 
  - what is a vector database
  - vectordb
  - multimodal vector database retrieval
  - Retrieval Augmented Generation
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

This operation lists all backups.

## Usage\{#usage}

```bash
zilliz backup list [OPTIONS]
```

**OPTIONS:**

- **--project-id** (*string*) -

    Indicates a project ID as a filtering condition.

- **--cluster-id** (*string*) -

    Indicates a cluster ID as a filtering condition.

- **--creation-method** (*string*) -

    Indicates the creation method as a filtering condition. 

    Possible values are: `manual` and `auto`.

- **--backup-type** (*string*) -

    Indicates a backup type as a filtering condition.

    Possible values are `CLUSTER` and `COLLECTION`.

- **--page-size** (*integer*) -

    Indicates the items per page.

- **--page** (*integer*) -

    Indicates the page number.

## Example\{#example}

```bash
# List all backups
zilliz backup list

# List backups for a specific cluster
zilliz backup list --cluster-id in01-xxxxxxxxxxxx
```
