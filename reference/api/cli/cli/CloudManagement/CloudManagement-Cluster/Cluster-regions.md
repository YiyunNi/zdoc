---
title: "regions | Cloud"
slug: /cli/cli/Cluster-regions
sidebar_label: "regions"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation lists all available regions for a cloud provider. | Cloud"
type: docx
token: IsRxdCpeEo3RmOxiY0jcCYLhnde
sidebar_position: 8
keywords: 
  - what are vector databases
  - vector databases comparison
  - Faiss
  - Video search
  - zilliz
  - zilliz cloud
  - cloud
  - regions
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# regions

This operation lists all available regions for a cloud provider.

## Usage\{#usage}

```bash
zilliz cluster regions [OPTIONS]
```

**OPTIONS:**

- **--cloud-id** (*string*) -

    Indicates a cloud provider. Possible values are: `aws`, `gcp`, and `azure`.

## Example\{#example}

```bash
# List all regions
zilliz cluster regions

# List AWS regions only
zilliz cluster regions --cloud-id aws
```
