---
title: "query | Cloud"
slug: /cli/cli/Vector-query
sidebar_label: "query"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation queries entities by scalar filter expression. | Cloud"
type: docx
token: BFfGdYH1aocKSjx2CLQce7C9nWo
sidebar_position: 5
keywords: 
  - Neural Network
  - Deep Learning
  - Knowledge base
  - natural language processing
  - zilliz
  - zilliz cloud
  - cloud
  - query
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# query

This operation queries entities by scalar filter expression.

## Usage\{#usage}

```bash
zilliz vector query [OPTIONS]
```

**OPTIONS:**

- **--collection** (*string*) -

    **[REQUIRED]**

    Indicates the collection name.

- **--filter** (*string*) -

    Indicates the scalar filter expression.

- **--limit** (*integer*) -

    Indicates the max results to return. Default: `10`.

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

- **--offset** (*integer*) -

    Indicates the number of results to skip before returning matches. Used for pagination with `--limit`.

- **--partition, -p** (*array*) -

    Indicates a list of partition names to query from. Queries all partitions if not specified.

## Example\{#example}

```bash
zilliz vector query --collection my_col --filter 'id > 100' --limit 10
```
