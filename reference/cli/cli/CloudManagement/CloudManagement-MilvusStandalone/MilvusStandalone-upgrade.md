---
title: "upgrade | Cloud"
slug: /cli/cli/MilvusStandalone-upgrade
sidebar_key: cli/MilvusStandalone-upgrade
sidebar_label: "upgrade"
added_since: v1.0.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation stops the container and replaces `standaloneembed.sh` with the latest version from upstream master, then restarts. Destructive — requires confirmation or `--yes`. Alias `update`. | Cloud"
type: docx
token: G4wZdxKupoYTu6xc2M5c6sATn8d
sidebar_position: 6
keywords: 
  - Sparse vector
  - Vector Dimension
  - ANN Search
  - What are vector embeddings
  - zilliz
  - zilliz cloud
  - cloud
  - upgrade
  - cliv13
displayed_sidebar: cliSidebar

---

import Admonition from '@theme/Admonition';


# upgrade

This operation stops the container and replaces `standalone_embed.sh` with the latest version from upstream master, then restarts. Destructive — requires confirmation or `--yes`. Alias: `update`.

## Synopsis\{#synopsis}

```bash
zilliz milvus standalone upgrade
[--dir <path>]
[--dry-run]
[--yes]
```

## Options\{#options}

- **--dir** (*path*) -

    Indicates the install directory. Default: `./milvus-standalone`.

- **--dry-run** (*boolean*) -

    Prints the upgrade steps without invoking them.

- **--yes, -y** (*boolean*) -

    Skips the destructive confirmation prompt. Required for non-interactive scripts.

## Example\{#example}

```bash
# Interactive
zilliz milvus standalone upgrade

# Non-interactive (alias: update)
zilliz milvus standalone update --yes
```
