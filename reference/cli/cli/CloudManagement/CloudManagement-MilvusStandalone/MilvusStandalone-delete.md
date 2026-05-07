---
title: "delete | Cloud"
slug: /cli/cli/MilvusStandalone-delete
sidebar_key: cli/MilvusStandalone-delete
sidebar_label: "delete"
added_since: v1.0.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation removes the `milvus-standalone` container, the `volumes/` data directory, and the `embedEtcd.yaml` / `user.yaml` config files. Destructive — requires confirmation or `--yes`. Useful when you want a clean reinstall. | Cloud"
type: docx
token: OtZ1dcB5EozJlVx3uRUce85Gnog
sidebar_position: 1
keywords: 
  - rag llm architecture
  - private llms
  - nn search
  - llm eval
  - zilliz
  - zilliz cloud
  - cloud
  - delete
  - cliv13
displayed_sidebar: cliSidebar

---

import Admonition from '@theme/Admonition';


# delete

This operation removes the `milvus-standalone` container, the `volumes/` data directory, and the `embedEtcd.yaml` / `user.yaml` config files. Destructive — requires confirmation or `--yes`. Useful when you want a clean reinstall.

## Synopsis\{#synopsis}

```bash
zilliz milvus standalone delete
[--dir <path>]
[--dry-run]
[--yes]
```

## Options\{#options}

- **--dir** (*path*) -

    Indicates the install directory whose contents will be removed. Default: `./milvus-standalone`.

- **--dry-run** (*boolean*) -

    Prints what would be removed without touching the filesystem or Docker.

- **--yes, -y** (*boolean*) -

    Skips the destructive confirmation prompt. Required for non-interactive scripts.

## Example\{#example}

```bash
# Interactive (prompts for confirmation)
zilliz milvus standalone delete

# Non-interactive
zilliz milvus standalone delete --yes

# Preview without touching anything
zilliz milvus standalone delete --dry-run
```
