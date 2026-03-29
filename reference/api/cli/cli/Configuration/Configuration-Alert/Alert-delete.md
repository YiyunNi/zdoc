---
title: "delete | Cloud"
slug: /cli/cli/Alert-delete
sidebar_label: "delete"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation deletes an alert rule. | Cloud"
type: docx
token: RAZ5dMgFUoufLJxfmzvcInernmc
sidebar_position: 2
keywords: 
  - Hierarchical Navigable Small Worlds
  - Dense embedding
  - Faiss vector database
  - Chroma vector database
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

This operation deletes an alert rule.

## Usage\{#usage}

```bash
zilliz alert delete [OPTIONS]
```

**OPTIONS:**

- **--id** (*string*) -

    Indicates the ID of the alert rule to delete.

- **--project-id** (*string*) -

    Indicates the ID of a project if you expect to select alert rules from a list.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`.

## Example\{#example}

```bash
zilliz alert delete
```
