---
title: "insert | Cloud"
slug: /cli/cli/Vector-insert
sidebar_label: "insert"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation inserts entities into a collection. | Cloud"
type: docx
token: O4dddYwASo2Rx9xXi3Ccn9dcnSc
sidebar_position: 4
keywords: 
  - Anomaly Detection
  - sentence transformers
  - Recommender systems
  - information retrieval
  - zilliz
  - zilliz cloud
  - cloud
  - insert
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# insert

This operation inserts entities into a collection.

## Usage\{#usage}

```bash
zilliz vector insert [OPTIONS]
```

**OPTIONS:**

- **--collection** (*string*) -

    **[REQUIRED]**

    Indicates the collection name.

- **--data** (*array*) -

    Indicates the entities as JSON array or file://path.json. Required unless `--body` is provided.

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

- **--partition, -p** (*string*) -

    Indicates the name of the partition to insert data into.

- **--partial-update** (*boolean*) -

    Indicates whether to enable partial updates. When enabled, only the provided fields are updated.

## Example\{#example}

```bash
# Insert with inline JSON
zilliz vector insert --collection my_col --data '[{"id": 1, "vector": [0.1, 0.2, 0.3]}]'

# Insert from a JSON file
zilliz vector insert --collection my_col --data file:///path/to/data.json
```
