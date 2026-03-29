---
title: "start | Cloud"
slug: /cli/cli/Import-start
sidebar_label: "start"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation starts a data import job. | Cloud"
type: docx
token: EMBrd9PtWoNfh4xBseQcPzaOn2b
sidebar_position: 2
keywords: 
  - AI chatbots
  - cosine distance
  - what is a vector database
  - vectordb
  - zilliz
  - zilliz cloud
  - cloud
  - start
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# start

This operation starts a data import job.

## Usage\{#usage}

```bash
zilliz import start [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates the target cluster ID.

- **--collection** (*string*) -

    **[REQUIRED]**

    Indicates the target collection name.

- **--body** (*string*) -

    **[REQUIRED]**

    Indicates the request body, which should be a stringified JSON object containing multiple file paths, or a path to a single file or folder.

## Example\{#example}

```bash
# Import from S3
zilliz import start --cluster-id in01-xxxx --collection my_col --body '{"files": [["s3://bucket/data.json"]]}'

# Import using a JSON file
zilliz import start --cluster-id in01-xxxx --collection my_col --body file://import-spec.json
```
