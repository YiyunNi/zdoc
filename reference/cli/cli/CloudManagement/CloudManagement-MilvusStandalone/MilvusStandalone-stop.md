---
title: "stop | Cloud"
slug: /cli/cli/MilvusStandalone-stop
sidebar_key: cli/MilvusStandalone-stop
sidebar_label: "stop"
added_since: v1.0.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation stops the Milvus standalone container by running `bash standaloneembed.sh stop` from the install directory. Data volumes and config files are left untouched. | Cloud"
type: docx
token: TIo5dZK0vov2TtxkoW7crdsMngf
sidebar_position: 5
keywords: 
  - Multimodal search
  - vector search algorithms
  - Question answering system
  - llm-as-a-judge
  - zilliz
  - zilliz cloud
  - cloud
  - stop
  - cliv13
displayed_sidebar: cliSidebar

---

import Admonition from '@theme/Admonition';


# stop

This operation stops the Milvus standalone container by running `bash standalone_embed.sh stop` from the install directory. Data volumes and config files are left untouched.

## Synopsis\{#synopsis}

```bash
zilliz milvus standalone stop
[--dir <path>]
[--dry-run]
[--yes]
```

## Options\{#options}

- **--dir** (*path*) -

    Indicates the install directory. Default: `./milvus-standalone`.

- **--dry-run** (*boolean*) -

    Prints the command that would run without invoking it.

- **--yes, -y** (*boolean*) -

    Skips confirmation. No-op for non-destructive lifecycle commands but accepted for parity with `delete` / `upgrade`.

## Example\{#example}

```bash
zilliz milvus standalone stop
```
