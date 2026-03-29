---
title: "drop | Cloud"
slug: /cli/cli/Role-drop
sidebar_label: "drop"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation drops a role. | Cloud"
type: docx
token: NLHNdWRtSobTj6xGRqTcUgqznQe
sidebar_position: 3
keywords: 
  - Hierarchical Navigable Small Worlds
  - Dense embedding
  - Faiss vector database
  - Chroma vector database
  - zilliz
  - zilliz cloud
  - cloud
  - drop
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# drop

This operation drops a role.

<Admonition type="info" icon="📘" title="Notes">

<p>This command is available for Dedicated clusters only.</p>

</Admonition>

## Usage\{#usage}

```bash
zilliz role drop [OPTIONS]
```

**OPTIONS:**

- **--role** (*string*) -

    **[REQUIRED]**

    Indicates the role name to drop.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when the output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates a JMESPath expression to filter output.

- **--yes, -y** (*boolean*) -

    Indicates whether to skip the confirmation prompt.

- **--database** (*string*) -

    Indicates a database name. The value defaults to `default`.

## Example\{#example}

```bash
zilliz role drop --role my_role
```
