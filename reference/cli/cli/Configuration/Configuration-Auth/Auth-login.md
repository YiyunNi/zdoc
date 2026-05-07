---
title: "login | Cloud"
slug: /cli/cli/Auth-login
sidebar_key: cli/Auth-login
sidebar_label: "login"
added_since: v0.1.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation logs you into Zilliz Cloud. | Cloud"
type: docx
token: KZkqdaHxNo82J9xaZJlcn2KGnTe
sidebar_position: 1
keywords: 
  - Annoy vector search
  - milvus
  - Zilliz
  - milvus vector database
  - zilliz
  - zilliz cloud
  - cloud
  - login
  - cliv13
displayed_sidebar: cliSidebar

---

import Admonition from '@theme/Admonition';


# login

This operation logs you into Zilliz Cloud.

## Synopsis\{#synopsis}

```bash
zilliz login
[--no-browser]
[--api-key]
[--cn]
```

## Options\{#options}

- **--no-browser** (*boolean*) -

    Indicates whether to automatically open the browser.

- **--api-key** (*boolean*) -

    Indicates whether to log in with an API key instead of a browser.

- **--cn** (*boolean*) -

    Indicates whether to log in to the China cloud (api.cloud.zilliz.com.cn). API key authentication only.

## Example\{#example}

```bash
zilliz login
```
