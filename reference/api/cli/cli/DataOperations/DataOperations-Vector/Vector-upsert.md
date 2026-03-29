---
title: "upsert | Cloud"
slug: /cli/cli/Vector-upsert
sidebar_label: "upsert"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation upserts entities (insert or update if exists). | Cloud"
type: docx
token: PLojdlFoioPDSEx6vKpcsmevnTf
sidebar_position: 7
keywords: 
  - Video deduplication
  - Video similarity search
  - Vector retrieval
  - Audio similarity search
  - zilliz
  - zilliz cloud
  - cloud
  - upsert
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# upsert

This operation upserts entities (insert or update if exists).

## Usage\{#usage}

```bash
zilliz vector upsert [OPTIONS]
```

**OPTIONS:**

- **--collection** (*string*) -

    **[REQUIRED]**

    Indicates the collection name.

- **--data** (*array*) -

    Indicates the entities as JSON array or file://path.json. Required unless `--body` is provided.

- **--partition** (*string*) -

    Indicates the partition name.

- **--database** (*string*) -

    Indicates the database name.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when the output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates a JMESPath expression to filter output.

- **--body** (*json*) -

    Indicates a raw JSON body (or `file://path`).

- **--partial-update** (*boolean*) -

    Indicates whether to enable partial updates. When enabled, only the provided fields are updated.

## Example\{#example}

```bash
# Upsert with inline JSON
zilliz vector upsert --collection my_col --data '[{"id": 1, "vector": [0.1, 0.2, 0.3]}]'

# Upsert from a JSON file
zilliz vector upsert --collection my_col --data file:///path/to/data.json
```
