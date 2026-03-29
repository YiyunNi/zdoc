---
title: "grant-privilege | Cloud"
slug: /cli/cli/Role-grantprivilege
sidebar_label: "grant-privilege"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation grants a privilege to a role. | Cloud"
type: docx
token: ZtdUdawpZoLgrYx31XkcQxeOnNb
sidebar_position: 4
keywords: 
  - Elastic vector database
  - Pinecone vs Milvus
  - Chroma vs Milvus
  - Annoy vector search
  - zilliz
  - zilliz cloud
  - cloud
  - grant-privilege
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# grant-privilege

This operation grants a privilege to a role.

<Admonition type="info" icon="📘" title="Notes">

<p>This command is available for Dedicated clusters only.</p>

</Admonition>

## Usage\{#usage}

```bash
zilliz role grant-privilege [OPTIONS]
```

**OPTIONS:**

- **--role** (*string*) -

    **[REQUIRED]**

    Indicates the role name.

- **--object-type** (*string*) -

    **[REQUIRED]**

    Indicates the object type. Choices: `Global`, `Collection`, `Database`.

- **--object-name** (*string*) -

    **[REQUIRED]**

    Indicates the object name (or * for all).

- **--privilege** (*string*) -

    **[REQUIRED]**

    Indicates the privilege name (e.g. Search, Insert, CreateCollection).

- **--database** (*string*) -

    Indicates the database name.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when the output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates a JMESPath expression to filter output.

## Example\{#example}

```bash
# Grant search on a specific collection
zilliz role grant-privilege --role my_role --object-type Collection --object-name my_col --privilege Search

# Grant all privileges on all collections
zilliz role grant-privilege --role my_role --object-type Collection --object-name '*' --privilege '*'
```
