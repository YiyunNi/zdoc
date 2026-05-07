---
title: "start | Cloud"
slug: /cli/cli/MilvusStandalone-start
sidebar_key: cli/MilvusStandalone-start
sidebar_label: "start"
added_since: v1.0.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation launches the Milvus standalone container by running `bash standaloneembed.sh start` from the install directory. Default endpoints after start Milvus `localhost:19530`, WebUI `http://localhost:9091`, embedded etcd `localhost:2379`. Requires a working Docker daemon. | Cloud"
type: docx
token: QiujdmjqAozJAlxJi7mcoTrHngc
sidebar_position: 4
keywords: 
  - what is vector db
  - what are vector databases
  - vector databases comparison
  - Faiss
  - zilliz
  - zilliz cloud
  - cloud
  - start
  - cliv13
displayed_sidebar: cliSidebar

---

import Admonition from '@theme/Admonition';


# start

This operation launches the Milvus standalone container by running `bash standalone_embed.sh start` from the install directory. Default endpoints after start: Milvus `YOUR_CLUSTER_ENDPOINT`, WebUI `http://localhost:9091`, embedded etcd `localhost:2379`. Requires a working Docker daemon.

## Synopsis\{#synopsis}

```bash
zilliz milvus standalone start
[--dir <path>]
[--dry-run]
[--yes]
```

## Options\{#options}

- **--dir** (*path*) -

    Indicates the install directory containing `standalone_embed.sh`. Default: `./milvus-standalone`.

- **--dry-run** (*boolean*) -

    Prints the command that would run without invoking it.

- **--yes, -y** (*boolean*) -

    Skips confirmation. No-op for non-destructive lifecycle commands but accepted for parity with `delete` / `upgrade`.

## Example\{#example}

```bash
zilliz milvus standalone start

# From a custom install directory
zilliz milvus standalone start --dir ~/milvus
```
