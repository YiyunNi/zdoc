---
title: "get | Cloud"
slug: /cli/cli/Vector-get
sidebar_label: "get"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation gets entities by primary key IDs. | Cloud"
type: docx
token: KwQLdb4UZo41g6xySjfcFtiCnl9
sidebar_position: 2
keywords: 
  - Context Window
  - Natural language search
  - Similarity Search
  - multimodal RAG
  - zilliz
  - zilliz cloud
  - cloud
  - get
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# get

This operation gets entities by primary key IDs.

## Usage\{#usage}

```bash
zilliz vector get [OPTIONS]
```

**OPTIONS:**

- **--collection** (*string*) -

    **[REQUIRED]**

    Indicates the collection name.

- **--id** (*array*) -

    **[REQUIRED]**

    Indicates the primary key IDs as JSON array.

- **--output-fields** (*array*) -

    Indicates the fields to return as JSON array.

- **--database** (*string*) -

    Indicates the database name.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when the output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates a JMESPath expression to filter output.

## Example\{#example}

```bash
zilliz vector get --collection my_col --id '[1, 2, 3]'
```
