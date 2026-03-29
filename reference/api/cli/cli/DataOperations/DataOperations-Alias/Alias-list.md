---
title: "list | Cloud"
slug: /cli/cli/Alias-list
sidebar_label: "list"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation lists all aliases. | Cloud"
type: docx
token: FAIsdc3inokLzNxYfpYcUwBznBb
sidebar_position: 5
keywords: 
  - Audio similarity search
  - Elastic vector database
  - Pinecone vs Milvus
  - Chroma vs Milvus
  - zilliz
  - zilliz cloud
  - cloud
  - list
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# list

This operation lists all aliases.

## Usage\{#usage}

```bash
zilliz alias list [OPTIONS]
```

**OPTIONS:**

- **--database** (*string*) -

    **[REQUIRED]**

    Indicates the database name.

- **--collection** (*string*) -

    Indicates the filter by collection name.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when the output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates a JMESPath expression to filter output.

## Example\{#example}

```bash
zilliz alias list --database default
```
