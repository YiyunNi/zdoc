---
title: "install | Cloud"
slug: /cli/cli/MilvusStandalone-install
sidebar_key: cli/MilvusStandalone-install
sidebar_label: "install"
added_since: v1.0.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation downloads the official `standaloneembed.sh` script into a local install directory. Pass `--start` to launch the container immediately after download. Requires `bash` and a working Docker daemon if `--start` is used. | Cloud"
type: docx
token: I4XDdrxCVoa9I1xaezEcc0qPnMe
sidebar_position: 2
keywords: 
  - Image Search
  - LLMs
  - Machine Learning
  - RAG
  - zilliz
  - zilliz cloud
  - cloud
  - install
  - cliv13
displayed_sidebar: cliSidebar

---

import Admonition from '@theme/Admonition';


# install

This operation downloads the official `standalone_embed.sh` script into a local install directory. Pass `--start` to launch the container immediately after download. Requires `bash` and a working Docker daemon if `--start` is used.

## Synopsis\{#synopsis}

```bash
zilliz milvus standalone install
[--dir <path>]
[--script-url <url>]
[--dry-run]
[--start]
[--force]
```

## Options\{#options}

- **--dir** (*path*) -

    Indicates the install directory. Default: `./milvus-standalone`. Created if missing.

- **--script-url** (*url*) -

    Indicates an HTTPS URL to download `standalone_embed.sh` from. Default: `https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh`. Non-HTTPS URLs are rejected.

- **--dry-run** (*boolean*) -

    Prints the download and start steps without touching the filesystem or Docker.

- **--start** (*boolean*) -

    After downloading, runs `bash standalone_embed.sh start` to launch the Milvus container.

- **--force** (*boolean*) -

    Overwrites an existing `standalone_embed.sh` in the install directory. Without `--force`, install fails if the script is already present.

## Example\{#example}

```bash
# Download into the default directory
zilliz milvus standalone install

# Download and start in one step
zilliz milvus standalone install --start

# Custom install directory and overwrite existing script
zilliz milvus standalone install --dir ~/milvus --force
```
