---
title: "describe | Cloud"
slug: /cli/cli/User-describe
sidebar_label: "describe"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation gets details of a user. | Cloud"
type: docx
token: IgAUdLDvcoWDR6xOu2XcmRoznIh
sidebar_position: 2
keywords: 
  - vector database tutorial
  - how do vector databases work
  - vector db comparison
  - openai vector db
  - zilliz
  - zilliz cloud
  - cloud
  - describe
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# describe

This operation gets details of a user.

<Admonition type="info" icon="📘" title="Notes">

<p>This command is available for Dedicated clusters only.</p>

</Admonition>

## Usage\{#usage}

```bash
zilliz user describe [OPTIONS]
```

**OPTIONS:**

- **--user** (*string*) -

    **[REQUIRED]**

    Indicates the username.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`, `yaml`, `csv`.

- **--no-header** (*boolean*) -

    Indicates whether to omit the header row when the output is set to `table` or `csv`.

- **--query, -q** (*string*) -

    Indicates a JMESPath expression to filter output.

## Example\{#example}

```bash
zilliz user describe --user my_user
```
