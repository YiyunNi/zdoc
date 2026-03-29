---
title: "get-load-state | Cloud"
slug: /cli/cli/Collection-getloadstate
sidebar_label: "get-load-state"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation gets collection load state. | Cloud"
type: docx
token: RnRTdshwloBzIFx5rLHcFTm2nVh
sidebar_position: 7
keywords: 
  - Vector embeddings
  - Vector store
  - open source vector database
  - Vector index
  - zilliz
  - zilliz cloud
  - cloud
  - get-load-state
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# get-load-state

This operation gets collection load state.

## Usage\{#usage}

```bash
zilliz collection get-load-state [OPTIONS]
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

- **--partition-names** (*array*) -

    Indicates the partition names to check their load state.

## Example\{#example}

```bash
zilliz collection get-load-state --name my_collection
```
