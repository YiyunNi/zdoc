---
title: "enable | Cloud"
slug: /cli/cli/Alert-enable
sidebar_label: "enable"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation enables an alert rule. | Cloud"
type: docx
token: G8Xtd9rypofGjax3HUbcWUNPn3g
sidebar_position: 4
keywords: 
  - Zilliz database
  - Unstructured Data
  - vector database
  - IVF
  - zilliz
  - zilliz cloud
  - cloud
  - enable
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# enable

This operation enables an alert rule.

## Usage\{#usage}

```bash
zilliz alert enable [OPTIONS]
```

**OPTIONS:**

- **--id** (*string*) -

    Indicates the ID of the alert rule to enable.

- **--project-id** (*string*) -

    Indicates the project ID if you expect to select an alert rule from a list.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`.

## Example\{#example}

```bash
zilliz alert enable --id xxxx
```
