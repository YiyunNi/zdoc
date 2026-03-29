---
title: "create | Cloud"
slug: /cli/cli/Project-create
sidebar_label: "create"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation creates a new project. | Cloud"
type: docx
token: H6MXdWNhlo3b9lx70Z3ca3VXn2e
sidebar_position: 1
keywords: 
  - Annoy vector search
  - milvus
  - Zilliz
  - milvus vector database
  - zilliz
  - zilliz cloud
  - cloud
  - create
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# create

This operation creates a new project.

## Usage\{#usage}

```bash
zilliz project create [OPTIONS]
```

**OPTIONS:**

- **--name** (*string*) -

    **[REQUIRED]**

    Indicates a project name.

- **--plan** (*string*) -

    **[REQUIRED]**

    Indicates the subscription plan. 

    Possible values: <exclude lang="zh-CN">`Free`, `Serverless`, `Standard`,</exclude> `Enterprise`.

## Example\{#example}

```bash
zilliz project create --name my-project --plan Standard
```
