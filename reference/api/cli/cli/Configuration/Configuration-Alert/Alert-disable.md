---
title: "disable | Cloud"
slug: /cli/cli/Alert-disable
sidebar_label: "disable"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation disables an alert rule. | Cloud"
type: docx
token: Dx3jdB9XjoyDwXxuX2GcTgBanDc
sidebar_position: 3
keywords: 
  - managed milvus
  - Serverless vector database
  - milvus open source
  - how does milvus work
  - zilliz
  - zilliz cloud
  - cloud
  - disable
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# disable

This operation disables an alert rule.

## Usage\{#usage}

```bash
zilliz alert disable [OPTIONS]
```

**OPTIONS:**

- **--id** (*string*) -

    Indicates the ID of the alert rule to disable.

- **--project-id** (*string*) -

    Indicates the ID of the project if you expect to select an alert rule from a list.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`.

## Example\{#example}

```bash
zilliz alert disable --id xxx
```
