---
title: "Access Logs Overview | Cloud"
slug: /access-log-overview
sidebar_label: "Access Logs Overview"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "In high-volume workloads, understanding which data is accessed most frequently is critical for optimization decisions such as index tuning or partition strategy. Without visibility into query patterns, these decisions rely on guesswork. | Cloud"
type: origin
token: PIfLwbrMmiOZKAkqtpScjnhinXf
sidebar_position: 1
keywords: 
  - zilliz
  - vector database
  - cloud
  - access
  - logs
  - overview

---

import Admonition from '@theme/Admonition';


# Access Logs Overview

In high-volume workloads, understanding which data is accessed most frequently is critical for optimization decisions such as index tuning or partition strategy. Without visibility into query patterns, these decisions rely on guesswork.

Access Logs give you that visibility. When enabled on a Zilliz Cloud cluster, the access log pipeline captures query activities and delivers it as structured log files to your own object storage. You can then load these logs into a data warehouse and aggregate by entity ID to identify hot data, slow queries, and usage trends.

<Admonition type="info" icon="📘" title="Notes">

<p>This release logs search- or query-class actions only: Search, HybridSearch, and Query. Support for the full action list is planned for a future release.</p>

</Admonition>

## How the pipeline works\{#how-the-pipeline-works}

The access log pipeline has two phases: collection on the Zilliz Cloud side and analysis on yours.

### Zilliz Cloud collects and delivers logs\{#zilliz-cloud-collects-and-delivers-logs}

When you enable Access Logs on a cluster, Zilliz Cloud begins capturing query activities at the proxy layer. You configure two settings at the cluster level:

- **Sample rate**: The percentage of queries to log. For high-volume workloads, a lower rate (such as 1%) reduces storage costs while still producing statistically meaningful data.

- **Output fields**: Which response fields to include. The `params.ids` field records the primary key values returned by each query, and `params.scores` records the corresponding similarity scores.

Logs are written in **JSON Lines** format (one JSON object per line) and delivered automatically to the object storage bucket you configured during setup. Each file follows a predictable path convention:

```plaintext
/<Cluster ID>/<Log type>/<Date>/<HH:MM:SS>-<UUID>.log
```

For example: `/in03-c7be749d5f403ad/access/2024-12-20/09:16:53-jz5l7D8Q.log`

### You analyze the logs\{#you-analyze-the-logs}

Because logs arrive as standard JSON Lines files in your own bucket, you can process them with any tool that reads JSON. Each log entry contains structured fields including `action`, `cluster_id`, `timestamp`, and `params.ids` (the list of primary keys in the query result).

The general analysis approach is:

1. Load the JSON Lines files into a data warehouse or analytics tool.

1. Parse the `action` and `params.ids` fields from each entry.

1. Aggregate by primary key across a time window to surface access frequency.

The result is a heat map of your data, which entities are queried most often, through which actions, and at what times.

## Reliability and billing\{#reliability-and-billing}

The access log pipeline is designed around a core principle: logging never degrades query performance.

### Non-blocking guarantee\{#non-blocking-guarantee}

Access log collection never delays or blocks user requests. If the system must choose between completing a query and writing a log entry, the query always wins.

### Graceful degradation\{#graceful-degradation}

Under extreme load, the system may drop access log entries to preserve query throughput. This means access logs provide a best-effort record of query activity rather than a guaranteed complete record.

### Billing\{#billing}

Access log billing is time-based, not volume-based. The cost is **12.5% of the Query CU unit price**, billed by the duration that Access Logs remain enabled on a cluster. This makes costs predictable regardless of query volume, where you pay the same whether your cluster handles 100 or 100,000 queries per hour.

## What's next\{#whats-next}

- [Configure Access Logs](./configure-access-logs): Enable access logs, adjust sampling rate and output params, or disable logging.

- [Access Log Reference](./access-log-reference): Full field schema, complete action list, and file path conventions.

