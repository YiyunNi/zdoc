---
title: "create | Cloud"
slug: /cli/cli/Alias-create
sidebar_label: "create"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation creates an alias pointing to a collection. | Cloud"
type: docx
token: SclAd0NPBoMQ9Pxtg0vcQxK0n2f
sidebar_position: 2
keywords: 
  - cosine distance
  - what is a vector database
  - vectordb
  - multimodal vector database retrieval
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

This operation creates an alias pointing to a collection.

## Usage\{#usage}

```bash
zilliz alias create [OPTIONS]
```

**OPTIONS:**

- **--collection** (*string*) -

    **[REQUIRED]**

    Indicates the target collection name.

- **--alias** (*string*) -

    **[REQUIRED]**

    Indicates the alias name.

- **--database** (*string*) -

    Indicates the database name.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when the output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates the JMESPath expression to filter output.

## Example\{#example}

```bash
zilliz alias create --collection my_collection --alias my_alias
```
