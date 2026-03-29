---
title: "list | Cloud"
slug: /cli/cli/Volume-list
sidebar_label: "list"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation lists all volumes in a project. | Cloud"
type: docx
token: FDjjdFVzxozhvhxU5tgc42utnZg
sidebar_position: 3
keywords: 
  - sentence transformers
  - Recommender systems
  - information retrieval
  - dimension reduction
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

This operation lists all volumes in a project.

## Usage\{#usage}

```bash
zilliz volume list [OPTIONS]
```

**OPTIONS:**

- **--project-id** (*string*) -

    **[REQUIRED]**

    Indicates a project ID.

- **--page-size** (*integer*) -

    Indicates the number of items per page.

- **--page** (*integer*) -

    Indicates the current page number.

## Example\{#example}

```bash
zilliz volume list --project-id proj-xxxxxxxxxxxx
```
