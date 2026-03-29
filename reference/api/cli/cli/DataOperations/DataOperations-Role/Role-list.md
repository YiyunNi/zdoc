---
title: "list | Cloud"
slug: /cli/cli/Role-list
sidebar_label: "list"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation lists all roles. | Cloud"
type: docx
token: RnVSdpa8Uog0ufxOa5Bc2LN2n9d
sidebar_position: 5
keywords: 
  - what is semantic search
  - Embedding model
  - image similarity search
  - Context Window
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

This operation lists all roles.

<Admonition type="info" icon="📘" title="Notes">

<p>This command is available for Dedicated clusters only.</p>

</Admonition>

## Usage\{#usage}

```bash
zilliz role list
```

**OPTIONS:**

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when the output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates a JMESPath expression to filter output.

- **--database** (*string*) -

    Indicates a database name. The value defaults to `default`.

## Example\{#example}

```bash
zilliz role list
```
