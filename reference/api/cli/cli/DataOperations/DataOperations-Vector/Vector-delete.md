---
title: "delete | Cloud"
slug: /cli/cli/Vector-delete
sidebar_label: "delete"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation deletes entities by filter expression. | Cloud"
type: docx
token: OTx6dAm4wofwrIxq7w4cjHBIn9v
sidebar_position: 1
keywords: 
  - milvus db
  - milvus vector db
  - Zilliz Cloud
  - what is milvus
  - zilliz
  - zilliz cloud
  - cloud
  - delete
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# delete

This operation deletes entities by filter expression.

## Usage\{#usage}

```bash
zilliz vector delete [OPTIONS]
```

**OPTIONS:**

- **--collection** (*string*) -

    **[REQUIRED]**

    Indicates the collection name.

- **--filter** (*string*) -

    **[REQUIRED]**

    Indicates the filter expression for entities to delete.

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

- **--yes, -y** (*boolean*) -

    Indicates whether to skip the confirmation prompt.

## Example\{#example}

```bash
zilliz vector delete --collection my_col --filter 'id in [1, 2, 3]'
```
