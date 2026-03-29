---
title: "create | Cloud"
slug: /cli/cli/Cluster-create
sidebar_label: "create"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation creates a new cluster. | Cloud"
type: docx
token: KNCGdB4VfolyidxJBWOcuUGin3c
sidebar_position: 1
keywords: 
  - natural language processing
  - AI chatbots
  - cosine distance
  - what is a vector database
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

This operation creates a new cluster.

## Usage\{#usage}

```bash
zilliz cluster create [OPTIONS]
```

**OPTIONS:**

- **--name** (*string*) -

    Indicates the cluster display name.

- **--type** (*string*) -

    Indicates the cluster type. Choices: `serverless`, `free`, `dedicated`.

- **--project-id** (*string*) -

    Indicates the project to create the cluster in.

- **--region** (*string*) -

    Indicates the cloud region (e.g. aws-us-west-2).

- **--cu-type** (*string*) -

    Indicates the compute unit type (dedicated only). Choices: `Performance-optimized`, `Capacity-optimized`.

- **--cu-size** (*integer*) -

    Indicates the number of compute units (dedicated only).

- **--plan** (*string*) -

    Indicates the subscription plan (dedicated only). Choices: `Free`, `Serverless`, `Standard`, `Enterprise`.

- **--output, -o** (*string*) -

    Output format. Choices: `json`, `table`, `text`.

## Example\{#example}

```bash
zilliz cluster create --name my-cluster \
--type serverless \
--region aws-us-west-2
```
