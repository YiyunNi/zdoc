---
title: "rename | Cloud"
slug: /cli/cli/Collection-rename
sidebar_label: "rename"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation renames a collection. | Cloud"
type: docx
token: Wa80d1UXco4S4jxSYKQcPzXjnVe
sidebar_position: 13
keywords: 
  - Anomaly Detection
  - sentence transformers
  - Recommender systems
  - information retrieval
  - zilliz
  - zilliz cloud
  - cloud
  - rename
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# rename

This operation renames a collection.

## Usage\{#usage}

```bash
zilliz collection rename [OPTIONS]
```

**OPTIONS:**

- **--name** (*string*) -

    **[REQUIRED]**

    Indicates the current collection name.

- **--new-name** (*string*) -

    **[REQUIRED]**

    Indicates the new collection name.

- **--database** (*string*) -

    Indicates the current database name.

- **--new-database** (*string*) -

    Indicates the target database name (for cross-db rename).

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when the output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates a JMESPath expression to filter output.

## Example\{#example}

```bash
zilliz collection rename --name old_collection --new-name new_collection
```
