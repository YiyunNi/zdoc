---
title: "create | Cloud"
slug: /cli/cli/Database-create
sidebar_label: "create"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation creates a new database. (Dedicated only) | Cloud"
type: docx
token: IKTjdZU2ioqYvbxGD08cp58In7c
sidebar_position: 1
keywords: 
  - hnsw algorithm
  - vector similarity search
  - approximate nearest neighbor search
  - DiskANN
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

This operation creates a new database. (Dedicated only)

<Admonition type="info" icon="📘" title="Note">

</Admonition>

## Usage\{#usage}

```bash
zilliz database create [OPTIONS]
```

**OPTIONS:**

- **--name** (*string*) -

    **[REQUIRED]**

    Indicates the database name.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when the output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates a JMESPath expression to filter output.

- **--body** (*json*) -

    Indicates the raw JSON body (or `file://path`).

## Example\{#example}

```bash
zilliz database create --name my_database
```
