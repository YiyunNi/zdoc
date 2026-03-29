---
title: "revoke-role | Cloud"
slug: /cli/cli/User-revokerole
sidebar_label: "revoke-role"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation revokes a role from a user. | Cloud"
type: docx
token: Bp4sdXEoYoKuYtxs7WwcZBQFncb
sidebar_position: 6
keywords: 
  - milvus db
  - milvus vector db
  - Zilliz Cloud
  - what is milvus
  - zilliz
  - zilliz cloud
  - cloud
  - revoke-role
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# revoke-role

This operation revokes a role from a user.

<Admonition type="info" icon="📘" title="Notes">

<p>This command is available for Dedicated clusters only.</p>

</Admonition>

## Usage\{#usage}

```bash
zilliz user revoke-role [OPTIONS]
```

**OPTIONS:**

- **--user** (*string*) -

    **[REQUIRED]**

    Indicates the username.

- **--role** (*string*) -

    **[REQUIRED]**

    Indicates the role name to revoke.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when the output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates a JMESPath expression to filter output.

## Example\{#example}

```bash
zilliz user revoke-role --user my_user --role admin
```
