---
title: "list | Cloud"
slug: /cli/cli/Alert-list
sidebar_label: "list"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation lists alert rules for a project. | Cloud"
type: docx
token: SflPdLKXsoY2iFxIiljcBiIfnKc
sidebar_position: 5
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

This operation lists alert rules for a project.

## Usage\{#usage}

```bash
zilliz alert list [OPTIONS]
```

**OPTIONS:**

- **--project-id** (*string*) -

    Indicates the project ID.

- **--page-size** (*integer*) -

    Indicates the number of items per page. The value defaults to 10.

- **--page** (*integer*) -

    Indicates the page number. The value defaults to 1.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`.

## Example\{#example}

```bash
zilliz alert list
```
