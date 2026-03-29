---
title: "create | Cloud"
slug: /cli/cli/Volume-create
sidebar_label: "create"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation creates a new volume. | Cloud"
type: docx
token: GO7LdV0RfoCgcvx18DjcvS27nJb
sidebar_position: 1
keywords: 
  - Zilliz vector database
  - Zilliz database
  - Unstructured Data
  - vector database
  - zilliz
  - zilliz cloud
  - cloud
  - create
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# create

This operation creates a new volume.

## Usage\{#usage}

```bash
zilliz volume create [OPTIONS]
```

**OPTIONS:**

- **--project-id** (*string*) -

    **[REQUIRED]**

    Indicates a project ID.

- **--region** (*string*) -

    **[REQUIRED]**

    Indicates a cloud region. For example, `aws-us-west-2`.

- **--name** (*string*) -

    **[REQUIRED]**

    Indicates a volume name.

## Example\{#example}

```bash
zilliz volume create --project-id proj-xxxx --region aws-us-west-2 --name my-volume
```
