---
title: "April 2026 Release Notes | Cloud"
slug: /release-notes-2604
sidebar_label: "April, 2026"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "April 2026 Release Notes | Cloud"
type: origin
token: N2XtwwchPi79M7kW1UjcnjC4nzc
sidebar_position: 0
keywords: 
  - zilliz
  - vector database
  - cloud
  - changelogs

---

import Admonition from '@theme/Admonition';


import Grid from '@site/src/components/Grid';

# April 2026 Release Notes

<Grid columnSize="2" widthRatios="20,80">

    <div>

        **2026-04-11**

    </div>

    <div>

        ## Global Cluster\{#global-cluster}

        Global Cluster now fully supports region-level disaster recovery failover with refined platform capabilities.

        - Failover: You can now trigger a failover at any time when the primary cluster becomes unavailable. After failover, new secondaries are automatically recreated.

        - Independent Replica Scaling: Primary and secondary clusters can now independently manage replica counts, Dynamic Scaling, and Schedule Scaling configurations.

        - Easy Conversion: You can now seamlessly convert between a Global Cluster and a regular dedicated cluster.

        - Audit Logging: All Global Cluster topology changes — including creation, switchover, failover, and secondary management — are now recorded in the audit log. For details, refer to [Global Cluster Explained](./global-cluster-explained) and Switchover and Failover.

        ## Collection-Level Metrics\{#collection-level-metrics}

        The following metrics now support collection-level breakdown, helping you pinpoint performance issues and plan capacity for individual collections: 

        - QPS (Read/Write),

        - Latency (Read/Write, Average and P99),

        - Entity Count, and

        - Loaded Entities.

        You can access collection-level metrics from the Console UI, Prometheus endpoint, or RESTful API. For details, refer to [Metrics Reference](./metrics-alerts-reference) and [Integrate with Prometheus](./prometheus-monitoring).

        ## Performance Log (Access logs)  | PUBLIC\{#performance-log-access-logs}

        Zilliz Cloud now supports **Access Logs**, a new observability feature that captures detailed query-level activity on your clusters. Access Log records every Search, Hybrid Search, and Query operation.Unlike Audit Log, which provides a complete compliance record of all operations, Access Log is designed for**performance analysis and business insights**. It uses asynchronous, non-blocking logging with configurable sampling rates, so you can monitor query patterns at scale with minimal impact on latency.Key capabilities include:

        - **Configurable sampling** — Set a sampling rate (e.g., 1%) to balance statistical accuracy against storage cost for high-throughput workloads.

        - **Customizable output fields** — Choose which parameters to include in each log entry to control verbosity and cost.

        - **Hot data identification** — Analyze returned primary keys (`params.result_pks`) to discover which records are accessed most frequently, informing caching and tiering strategies.

        - **Structured JSON Lines format** — Each log entry is a self-contained JSON object, ready for ingestion into any data warehouse or analytics pipeline.For details, refer to [Access Logs](./access-logs).

        ## Maintenance Window\{#maintenance-window}

        The maintenance window experience has been redesigned with extended 4-hour minimum duration, email and in-console notifications at 7/3/1 days before upgrades, the ability to defer upgrades by 7 days, and availability for all Business Critical and Enterprise plans.For details, refer to [Configure Maintenance Windows](./organization-settings#set-up-preferred-maintenance-window).

        ## Cluster Admin Role\{#cluster-admin-role}

        A new Cluster Admin role lets you grant team members operational access to specific clusters without full project-level admin privileges.

        - Cluster Operations: Cluster Admins can perform day-to-day operational tasks — including scaling, suspend/resume, backup/restore, and DB user management.

        - Per-Cluster Scoping: The role can be assigned to specific clusters, enabling fine-grained separation of duties across environments and workloads.

        - Note: Customized API Keys do not currently support the Cluster Admin role.For details, refer to [Manage Project Users](./project-users).

        ## Zilliz Cloud BYOC supports Tiered-Storage Cluster\{#zilliz-cloud-byoc-supports-tiered-storage-cluster}

        You can now create Tiered Storage clusters in BYOC deployments. To support this, BYOC projects introduce Tiered Query Node group configuration, allowing you to independently set instance types, node counts, and scaling for Query Nodes of Tiered Storage clusters. For details, refer to [Deploy BYOC on AWS](/docs/byoc/deploy-byoc-aws).

        ## Enhancements\{#enhancements}

        - You can now sort collection data previews in ascending or descending order by primary key, numeric, or other scalar fields. For details, refer to the Preview collection data section in [Manage Collections (Console)](./manage-collections-console).

    </div>

</Grid>
