---
title: "hybrid-search | Cloud"
slug: /cli/cli/Vector-hybridsearch
sidebar_label: "hybrid-search"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation performs hybrid search with multiple vectors and reranking. | Cloud"
type: docx
token: YVendfgHUotdoxxNTkcc8XUMnxf
sidebar_position: 3
keywords: 
  - lexical search
  - nearest neighbor search
  - Agentic RAG
  - rag llm architecture
  - zilliz
  - zilliz cloud
  - cloud
  - hybrid-search
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# hybrid-search

This operation performs hybrid search with multiple vectors and reranking.

## Usage\{#usage}

```bash
zilliz vector hybrid-search [OPTIONS]
```

**OPTIONS:**

- **--collection** (*string*) -

    **[REQUIRED]**

    Indicates the collection name.

- **--search** (*array*) -

    Indicates the search requests as JSON array (unless --body). Required unless `--body` is provided.

- **--rerank** (*object*) -

    Indicates the reranking strategy as JSON (unless --body). Required unless `--body` is provided.

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

- **--body** (*json*) -

    Indicates a raw JSON body (or `file://path`).

- **--partition, -p** (*array*) -

    Indicates a list of partition names to search within.

- **--offset** (*integer*) -

    Indicates the number of results to skip before returning matches.

## Example\{#example}

```bash
zilliz vector hybrid-search --collection my_col --body file://hybrid-search.json
```
