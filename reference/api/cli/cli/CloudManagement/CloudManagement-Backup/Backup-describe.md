---
title: "describe | Cloud"
slug: /cli/cli/Backup-describe
sidebar_label: "describe"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation gets details of a backup. | Cloud"
type: docx
token: TrNZd8OCnocoj0x7imqcrEiJnKh
sidebar_position: 3
keywords: 
  - Serverless vector database
  - milvus open source
  - how does milvus work
  - Zilliz vector database
  - zilliz
  - zilliz cloud
  - cloud
  - describe
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# describe

This operation gets details of a backup.

## Usage\{#usage}

```bash
zilliz backup describe [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates a cluster ID.

- **--backup-id** (*string*) -

    **[REQUIRED]**

    Indicates a backup ID.

## Example\{#example}

```bash
zilliz backup describe --cluster-id in01-xxxx --backup-id backup-xxxx
```
