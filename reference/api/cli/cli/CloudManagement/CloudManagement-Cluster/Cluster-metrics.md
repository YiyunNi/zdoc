---
title: "metrics | Cloud"
slug: /cli/cli/Cluster-metrics
sidebar_label: "metrics"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation queries cluster performance metrics (QPS, latency, storage, etc.). | Cloud"
type: docx
token: SoWFdvNGKoOEMpxODQScdKEmnze
sidebar_position: 5
keywords: 
  - Annoy vector search
  - milvus
  - Zilliz
  - milvus vector database
  - zilliz
  - zilliz cloud
  - cloud
  - metrics
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# metrics

This operation queries cluster performance metrics (QPS, latency, storage, etc.).

## Usage\{#usage}

```bash
zilliz cluster metrics [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    Indicates a cluster ID. For example, `in01-xxxxxxxxxxxx`.

- **--metric, -m** (*array*) -

    Indicates the metric name(s). You can chain this option after another to configure multiple metric names.

- **--period** (*string*) -

    Indicates a relative time period from now. 

    Uses `d` for days, `m` for months. The value defaults to `1h`, indicating that the statistics are collected within the next hour.

- **--start** (*string*) -

    Indicates the start time of a time range. For example, `2026-03-01` or `2026-03-01T10:00:00Z`.

- **--end** (*string*) -

    Indicates the end time of a time range. For example, `2026-03-15` or `2026-03-15T18:00:00Z`.

- **--granularity, -g** (*string*) -

    Indicates the data point interval. For example, `30s`, `5m`, `1h`. This option defaults to `auto`.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`.

## Example\{#example}

```bash
zilliz cluster metrics
```
