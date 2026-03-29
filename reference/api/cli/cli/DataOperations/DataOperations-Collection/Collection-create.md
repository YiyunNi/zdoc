---
title: "create | Cloud"
slug: /cli/cli/Collection-create
sidebar_label: "create"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation creates a new collection. | Cloud"
type: docx
token: P5jpdMWcMoW2MMxMBtcczRjInYc
sidebar_position: 3
keywords: 
  - Chroma vector database
  - nlp search
  - hallucinations llm
  - Multimodal search
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

This operation creates a new collection.

## Usage\{#usage}

```bash
zilliz collection create [OPTIONS]
```

**OPTIONS:**

- **--name** (*string*) -

    **[REQUIRED]**

    Indicates the collection name.

- **--dimension** (*integer*) -

    Indicates the vector dimension. Required unless `--body` is provided.

- **--metric-type** (*string*) -

    Indicates the distance metric. Choices: `COSINE`, `L2`, `IP`, `JACCARD`, `HAMMING`. Default: `COSINE`.

- **--id-type** (*string*) -

    Indicates the primary key type. Choices: `Int64`, `VarChar`.

- **--auto-id** (*boolean*) -

    Indicates the auto-generate primary key.

- **--primary-field** (*string*) -

    Indicates the primary key field name.

- **--vector-field** (*string*) -

    Indicates the vector field name.

- **--database** (*string*) -

    Indicates the database name.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when the output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates a JMESPath expression to filter output.

- **--body** (*json*) -

    Indicates the raw JSON body (or `file://path`).

- **--description** (*string*) -

    Indicates the description of the collection.

## Example\{#example}

```bash
# Quick create with defaults (COSINE metric, auto schema)
zilliz collection create --name my_collection --dimension 768

# Create with L2 metric and VarChar primary key
zilliz collection create --name my_collection --dimension 768 --metric-type L2 --id-type VarChar

# Create with full schema via JSON body
zilliz collection create --name my_collection --body file://schema.json
```
