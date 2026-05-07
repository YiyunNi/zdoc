---
title: "status | Cloud"
slug: /cli/cli/Completion-status
sidebar_key: cli/Completion-status
sidebar_label: "status"
added_since: v0.1.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation checks if shell completion is installed. | Cloud"
type: docx
token: LbIpdBlKsotqHFxgRxmcGsk0n5g
sidebar_position: 3
keywords: 
  - nn search
  - llm eval
  - Sparse vs Dense
  - Dense vector
  - zilliz
  - zilliz cloud
  - cloud
  - status
  - cliv13
displayed_sidebar: cliSidebar

---

import Admonition from '@theme/Admonition';


# status

This operation checks if shell completion is installed.

## Synopsis\{#synopsis}

```bash
zilliz completion status <SHELL>
```

## Options\{#options}

- **SHELL** (*string*) -

    Indicates the name of the target shell. The current shell applies if this is not specified. Possible values:

    - `bash`,

    - `zsh`,

    - `fish`.

## Example\{#example}

```bash
zilliz completion status
```
