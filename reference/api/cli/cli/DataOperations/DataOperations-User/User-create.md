---
title: "create | Cloud"
slug: /cli/cli/User-create
sidebar_label: "create"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation creates a new database user. | Cloud"
type: docx
token: USPedjTNOo7vNTxeNiwctLAcnMb
sidebar_position: 1
keywords: 
  - knn algorithm
  - HNSW
  - What is unstructured data
  - Vector embeddings
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

This operation creates a new database user.

<Admonition type="info" icon="📘" title="Notes">

<p>This command is available for Dedicated clusters only.</p>

</Admonition>

## Usage\{#usage}

```bash
zilliz user create [OPTIONS]
```

**OPTIONS:**

- **--user** (*string*) -

    **[REQUIRED]**

    Indicates the username.

- **--password** (*string*) -

    **[REQUIRED]**

    Indicates the password.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when the output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates a JMESPath expression to filter output.

## Example\{#example}

```bash
zilliz user create --user my_user --password my_password
```
