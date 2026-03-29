---
title: "alter | Cloud"
slug: /cli/cli/Alias-alter
sidebar_label: "alter"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation reassigns an alias to another collection. | Cloud"
type: docx
token: UTutdcqPLo4B2vxlHk1cAKunnOK
sidebar_position: 1
keywords: 
  - Deep Learning
  - Knowledge base
  - natural language processing
  - AI chatbots
  - zilliz
  - zilliz cloud
  - cloud
  - alter
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# alter

This operation reassigns an alias to another collection.

## Usage\{#usage}

```bash
zilliz alias alter [OPTIONS]
```

**OPTIONS:**

- **--collection** (*string*) -

    **[REQUIRED]**

    Indicates the new target collection.

- **--alias** (*string*) -

    **[REQUIRED]**

    Indicates the alias name to reassign.

- **--database** (*string*) -

    Indicates the database name.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates a JMESPath expression to filter output.

## Example\{#example}

```bash
zilliz alias alter --collection new_collection --alias my_alias
```
