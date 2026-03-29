---
title: "revoke-privilege | Cloud"
slug: /cli/cli/Role-revokeprivilege
sidebar_label: "revoke-privilege"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation revokes a privilege from a role. | Cloud"
type: docx
token: PT02de9SeooyPYxZW2ucueP1nAd
sidebar_position: 6
keywords: 
  - what is a vector database
  - vectordb
  - multimodal vector database retrieval
  - Retrieval Augmented Generation
  - zilliz
  - zilliz cloud
  - cloud
  - revoke-privilege
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# revoke-privilege

This operation revokes a privilege from a role.

<Admonition type="info" icon="📘" title="Notes">

<p>This command is available for Dedicated clusters only.</p>

</Admonition>

## Usage\{#usage}

```bash
zilliz role revoke-privilege [OPTIONS]
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

    Indicates the privilege name.

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
zilliz role revoke-privilege --role my_role --object-type Collection --object-name my_col --privilege Search
```
