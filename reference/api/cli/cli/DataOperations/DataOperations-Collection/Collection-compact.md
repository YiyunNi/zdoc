---
title: "compact | Cloud"
slug: /cli/cli/Collection-compact
sidebar_label: "compact"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation compacts collection segments to optimize storage. | Cloud"
type: docx
token: KYOydyGRaoMchUxkS0ucd8VUnve
sidebar_position: 2
keywords: 
  - Unstructured Data
  - vector database
  - IVF
  - knn
  - zilliz
  - zilliz cloud
  - cloud
  - compact
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# compact

This operation compacts collection segments to optimize storage.

## Usage\{#usage}

```bash
zilliz collection compact [OPTIONS]
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

- **--clustering** (*boolean*) -

    Indicates whether to perform clustering compaction.

## Example\{#example}

```bash
zilliz collection compact --name my_collection
```
