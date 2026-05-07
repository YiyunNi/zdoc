---
title: "restart | Cloud"
slug: /cli/cli/MilvusStandalone-restart
sidebar_key: cli/MilvusStandalone-restart
sidebar_label: "restart"
added_since: v1.0.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation stops and then starts the Milvus standalone container by running `bash standaloneembed.sh restart`. Requires a working Docker daemon. | Cloud"
type: docx
token: KpgUdQv1Woy0r3xOx1WcGlcNn4d
sidebar_position: 3
keywords: 
  - Large language model
  - Vectorization
  - k nearest neighbor algorithm
  - ANNS
  - zilliz
  - zilliz cloud
  - cloud
  - restart
  - cliv13
displayed_sidebar: cliSidebar

---

import Admonition from '@theme/Admonition';


# restart

This operation stops and then starts the Milvus standalone container by running `bash standalone_embed.sh restart`. Requires a working Docker daemon.

## Synopsis\{#synopsis}

```bash
zilliz milvus standalone restart
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
zilliz milvus standalone restart
```
