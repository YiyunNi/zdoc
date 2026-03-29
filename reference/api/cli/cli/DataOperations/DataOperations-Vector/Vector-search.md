---
title: "search | Cloud"
slug: /cli/cli/Vector-search
sidebar_label: "search"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation searches for similar vectors. | Cloud"
type: docx
token: X82qdozLzoGYUaxyRE2cBIBRnff
sidebar_position: 6
keywords: 
  - milvus
  - Zilliz
  - milvus vector database
  - milvus db
  - zilliz
  - zilliz cloud
  - cloud
  - search
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# search

This operation searches for similar vectors.

## Usage\{#usage}

```bash
zilliz vector search [OPTIONS]
```

**OPTIONS:**

- **--collection** (*string*) -

    **[REQUIRED]**

    Indicates the collection name.

- **--data** (*array*) -

    **[REQUIRED]**

    Indicates the query vectors as JSON array.

- **--anns-field** (*string*) -

    Indicates the vector field to search on.

- **--limit** (*integer*) -

    Indicates the max results to return. Default: `10`.

- **--filter** (*string*) -

    Indicates the scalar filter expression.

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

- **--partition, -p** (*array*) -

    Indicates a list of partition names to search in. Searches all partitions if not specified.

- **--offset** (*integer*) -

    Indicates the number of results to skip before returning matches. Used for pagination with `--limit`.

- **--search-params** (*json*) -

    Indicates a JSON string of search parameters. For example, `{"metricType":"COSINE","params":{"nprobe":10}}`).

## Example\{#example}

```bash
# Basic vector search
zilliz vector search --collection my_col --data '[[0.1, 0.2, 0.3]]' --limit 10

# Search with scalar filter
zilliz vector search --collection my_col --data '[[0.1, 0.2]]' --filter 'age > 18' --output-fields '["name", "age"]'
```
