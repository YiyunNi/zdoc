---
title: "list | Cloud"
slug: /cli/cli/User-list
sidebar_label: "list"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation lists all database users. | Cloud"
type: docx
token: HfpOdcNw3ovpRgxrIQAcFW0Jnlp
sidebar_position: 5
keywords: 
  - how does milvus work
  - Zilliz vector database
  - Zilliz database
  - Unstructured Data
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

This operation lists all database users.

<Admonition type="info" icon="📘" title="Notes">

<p>This command is available for Dedicated clusters only.</p>

</Admonition>

## Usage\{#usage}

```bash
zilliz user list
```

**OPTIONS:**

- **--output, -o** (*string*) -

    Output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Omit header row (table/csv output).

- **--query, -q** (*string*) -

    JMESPath expression to filter output.

## Example\{#example}

```bash
zilliz user list
```
