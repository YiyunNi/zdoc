---
title: "describe | Cloud"
slug: /cli/cli/Cluster-describe
sidebar_label: "describe"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation gets details of a cluster. | Cloud"
type: docx
token: WsJBdDbB2ouQC0xk8c1cwDFanGf
sidebar_position: 3
keywords: 
  - Neural Network
  - Deep Learning
  - Knowledge base
  - natural language processing
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

This operation gets details of a cluster.

## Usage\{#usage}

```bash
zilliz cluster describe [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates a cluster ID. For example, `in01-xxxxxxxxxxxx`.

## Example\{#example}

```bash
zilliz cluster describe --cluster-id in01-xxxxxxxxxxxx
```
