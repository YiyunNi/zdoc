---
title: "describe | Cloud"
slug: /cli/cli/Alias-describe
sidebar_label: "describe"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation gets details of an alias. | Cloud"
type: docx
token: Qnx9d72SIo9CzrxvmcFcMRconNu
sidebar_position: 3
keywords: 
  - openai vector db
  - natural language processing database
  - cheap vector database
  - Managed vector database
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

This operation gets details of an alias.

## Usage\{#usage}

```bash
zilliz alias describe [OPTIONS]
```

**OPTIONS:**

- **--alias** (*string*) -

    **[REQUIRED]**

    Indicates the alias name.

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
zilliz alias describe --alias my_alias
```
