---
title: "Global Cluster Explained | Cloud"
slug: /global-cluster-explained
sidebar_label: "Global Cluster Explained"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "Zilliz Cloud global cluster lets you deploy a primary cluster and multiple read-only secondary clusters across multiple regions on the same cloud provider. | Cloud"
type: origin
token: AICcwQ55yiNqEPkjdV6cb2i8nqe
sidebar_position: 1
keywords: 
  - zilliz
  - vector database
  - cloud
  - milvus
  - global cluster
  - Vector Dimension
  - ANN Search
  - What are vector embeddings
  - vector database tutorial

---

import Admonition from '@theme/Admonition';


# Global Cluster Explained

Zilliz Cloud **global cluster** lets you deploy a primary cluster and multiple read-only secondary clusters across multiple regions on the same cloud provider. 

This feature is designed for globally distributed, mission-critical applications and helps you achieve resilience against regional outage and low-latency local reads for users around the world.

<Admonition type="info" icon="📘" title="Notes">

<p>This feature is available only to <strong>Dedicated</strong> clusters in a <strong>Business Critical</strong> project.</p>

</Admonition>

## Overview\{#overview}

A Zilliz Cloud **global cluster** consists of one **primary cluster** and up to **five read-only** **secondary clusters** deployed in different regions on the same cloud provider.

- Primary cluster: The authoritative heart of your system. It handles all write operations. And its capability to handle read requests is the same as all secondary clusters.

- Secondary clusters: These are geographically distributed followers. They serve two critical purposes: acting as a standby for disaster recovery and serving local read-only traffic to users in that region.

All writes are directed to the primary cluster. Zilliz Cloud then automatically replicates data changes from the primary cluster to all secondary clusters. 

This multi-region setup provides:

- Resilience against regional outages: If the primary cluster fails or experiences an outage, you can promote a secondary cluster as a primary cluster.

- Low-latency reads: Because a full copy of your data is available in multiple geographic locations, applications can read from the nearest region to minimize latency.

### Connectivity and routing\{#connectivity-and-routing}

The following diagram shows how a global cluster works in Zilliz Cloud.

![UZjtwUeaxh2lDsb9eeOclNZ6nae](https://zdoc-images.s3.us-west-2.amazonaws.com/UZjtwUeaxh2lDsb9eeOclNZ6nae.png)

Your application connects to a global cluster through a **global endpoint** which provides the following benefits:

- **One Unified URL:** Your application uses one global endpoint that does not change, regardless of the underlying infrastructure. During planned switchover or emergency failover, the endpoint updates its internal routing automatically, so you do not need to change connection endpoint in your application code.

- **Intelligent Routing:** The global endpoint routes **write requests** to the primary cluster and **read requests** to the primary or an appropriate secondary cluster based on latency and workload.

### Switchover and failover\{#switchover-and-failover}

Zilliz Cloud global clusters support two operations that change which region hosts the primary cluster: 

- **Switchover**: A planned operation that promotes a fully synchronized secondary cluster to become the new primary cluster. To learn how to perform a switchover, see [Manage Global Cluster](./manage-global-cluster#switchover). During a switchover, Zilliz Cloud first ensures that the selected secondary cluster in another region is fully synchronized with the current primary. The secondary is then promoted to become the new primary cluster. Because promotion occurs only after synchronization is complete, no data loss is expected. For more information, see [Manage Global Cluster](./manage-global-cluster#switchover).

- **Failover**: An unplanned emergency recovery operation that promotes a secondary cluster to primary after an outage in the original primary region. During a cross-region failover, Zilliz Cloud first fences the original primary cluster which stops accepting new write requests. Then, a secondary cluster in another region is promoted as the new primary cluster based on its latest replicated state.

The following table compares these two concepts.

<table>
   <tr>
     <th></th>
     <th><p><strong>Switchover</strong></p></th>
     <th><p><strong>Failover</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>Typical use case</strong></p></td>
     <td><p>Planned operations (regional rotation, compliance, data residency, etc.)</p></td>
     <td><p>Unplanned outage or failure in the primary region</p></td>
   </tr>
   <tr>
     <td><p><strong>Trigger</strong></p></td>
     <td><p>Manually initiated for operational reasons</p></td>
     <td><p>Manually initiated as a recovery action after an incident</p></td>
   </tr>
   <tr>
     <td><p><strong>RPO & RTO</strong></p></td>
     <td><p>RPO: 0 (no data loss)</p><p>RTO: near zero</p></td>
     <td><p>RPO: equals the sync latency between the old and new primary cluster, typically a few seconds.</p><p>RTO: typically about a few minutes.</p></td>
   </tr>
</table>

## Typical use cases\{#typical-use-cases}

The global cluster feature has 2 typical use cases:

- **Disaster recovery & high availability:** You need clusters in multiple regions for failover. In this case, connect to the global cluster through a **global endpoint**—Zilliz Cloud automatically routes traffic.

- **Data replication between environments:** You run multiple clusters (for example, production and testing) in the same region and need to replicate data between them. In this case, connect to each cluster using its **public endpoint**.

## Billing\{#billing}

In a global cluster, both the primary and secondary clusters are billed as regular Zilliz Cloud [Dedicated clusters](./dedicated-cluster-cost) for their compute and storage usage, plus additional [data transfer](./data-transfer-cost) charges for data replication between clusters. 

Suppose your global cluster configuration is as follows:

- A primary cluster cluster_01 in Region A

- Two secondary clusters:

    - cluster_02 in Region B

    - cluster_03 in Region C

You’ll be charged for the sum of the following:

- **Vector database (compute) costs** for cluster_01, cluster_02, and cluster_03

- **Storage costs** for `cluster_01`, `cluster_02`, and `cluster_03`.

- **Data transfer costs** from `cluster_01` to `cluster_02` and `cluster_03`

For detailed list prices, see [Zilliz Cloud List Price](https://zilliz.com/pricing/pricing-guide).

## Limitations\{#limitations}

- **Plan availability**: You need to have a project on the Business Critical plan to access the global cluster feature.

- **Access Control**: You need to be a Project Admin to configure a global cluster

- **Usage**:

    - You can only add up to 5 secondary clusters.

    - You cannot suspend a primary or secondary cluster.

    - The cluster type, cloud provider, query CU count, and replica count should all be consistent with those of the primary cluster.

    - You cannot scale the query CU or replica of a global cluster.

    - To drop a global cluster, you need to drop all its secondary clusters.

    - The backup policy is configured on the primary cluster only. After a switchover, the backup policy automatically applies to the new primary cluster.

