---
title: "update-password | Cloud"
slug: /cli/cli/User-updatepassword
sidebar_label: "update-password"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation updates the user password. | Cloud"
type: docx
token: CLzGdXUNzo2XaHxRvBYcaYSZnud
sidebar_position: 7
keywords: 
  - Sparse vs Dense
  - Dense vector
  - Hierarchical Navigable Small Worlds
  - Dense embedding
  - zilliz
  - zilliz cloud
  - cloud
  - update-password
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# update-password

This operation updates the user password.

<Admonition type="info" icon="📘" title="Notes">

<p>This command is available for Dedicated clusters only.</p>

</Admonition>

## Usage\{#usage}

```bash
zilliz user update-password [OPTIONS]
```

**OPTIONS:**

- **--user** (*string*) -

    **[REQUIRED]**

    Indicates the username.

- **--password** (*string*) -

    **[REQUIRED]**

    Indicates the current password.

- **--new-password** (*string*) -

    **[REQUIRED]**

    Indicates the new password.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when the output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates a JMESPath expression to filter output.

## Example\{#example}

```bash
zilliz user update-password --user my_user --password old_pass --new-password new_pass
```
