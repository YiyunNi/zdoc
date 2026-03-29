---
title: "flush | Cloud"
slug: /cli/cli/Collection-flush
sidebar_label: "flush"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation flushes collection data to disk. | Cloud"
type: docx
token: R0FRdiaHuo4IElxDELmcyR90nLd
sidebar_position: 6
keywords: 
  - Hierarchical Navigable Small Worlds
  - Dense embedding
  - Faiss vector database
  - Chroma vector database
  - zilliz
  - zilliz cloud
  - cloud
  - flush
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# flush

This operation flushes collection data to disk.

## Usage\{#usage}

```bash
zilliz collection flush [OPTIONS]
```

**OPTIONS:**

- **--name** (*string*) -

    **[REQUIRED]**

    Indicates the collection name.

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
zilliz collection flush --name my_collection
```
