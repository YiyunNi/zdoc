---
title: "Manage Global Cluster | Cloud"
slug: /manage-global-cluster
sidebar_label: "Manage Global Cluster"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "This guide explains how to manage your global cluster. | Cloud"
type: origin
token: DW9wwFlgAiwOhBk2PgucY4URnke
sidebar_position: 3
keywords: 
  - zilliz
  - vector database
  - cloud
  - milvus
  - global cluster
  - lexical search
  - nearest neighbor search
  - Agentic RAG
  - rag llm architecture

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# Manage Global Cluster

This guide explains how to manage your global cluster.

<Admonition type="info" icon="📘" title="Notes">

<p>This feature is available only to <strong>Dedicated</strong> clusters in a <strong>Business Critical</strong> project.</p>

</Admonition>

## Before you start\{#before-you-start}

- Ensure you are a Project Admin.

- Note that the both the primary and secondary clusters cannot be suspended.

## Monitor cluster status\{#monitor-cluster-status}

You can monitor the status of your primary and secondary clusters as well as the data replication status.

<table>
   <tr>
     <th><p><strong>Cluster Status</strong></p></th>
     <th><p><strong>Description</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>CREATING</strong></p></td>
     <td><p>The cluster is being created.</p></td>
   </tr>
   <tr>
     <td><p><strong>RUNNING</strong></p></td>
     <td><p>The cluster is running normally.</p></td>
   </tr>
   <tr>
     <td><p><strong>ABNORMAL</strong></p></td>
     <td><p>An issue has been detected with the cluster. Please <a href="http://support.zilliz.com">contact support</a>.</p></td>
   </tr>
   <tr>
     <td><p><strong>SWITCHING</strong></p></td>
     <td><p>Zilliz Cloud is switching the primary role between the primary and a secondary cluster.</p></td>
   </tr>
   <tr>
     <td><p><strong>FENCED</strong></p></td>
     <td><p>After a switchover or failover, the original primary cluster enters the "Fenced" status and rejects all write requests.</p></td>
   </tr>
   <tr>
     <td><p><strong>REBUILDING</strong></p></td>
     <td><p>When you restore a global cluster, all of its original secondary clusters transition to the "Rebuilding" status.</p></td>
   </tr>
</table>

## Switchover\{#switchover}

For planned regional rotation, you can perform a switchover to promote a secondary cluster to the primary role.

Once you click the button, switchover will take place when data between the old and new primary cluster is fully synced.

The following demo shows how to perform a switchover.

<Supademo id="cmkauk6rl1hqrke4xpnketcbq" title=""  />

## Add secondary clusters\{#add-secondary-clusters}

To improve regional coverage, you can add additional secondary clusters in different regions to an existing global cluster.

<Admonition type="info" icon="📘" title="Notes">

<p>A global cluster can only have up to 5 secondary clusters.</p>

</Admonition>

The following demo shows how to add secondary clusters.

<Supademo id="cmkat4dkp1h55ke4xyc8i7c9y" title=""  />

## Scale primary cluster\{#scale-primary-cluster}

To increase the capacity of a global cluster, you can scale the query CU of its primary cluster. Changes to the query CU of the primary cluster will be automatically synchronized to all secondary clusters.

For details about how to scale the query CU of a primary cluster, see [Scale Query CU](./scale-query-cu).

Currently, replica scaling is not supported for a global cluster.

## Drop secondary cluster\{#drop-secondary-cluster}

For details about how to drop clusters, see [Manage Cluster](./manage-cluster#drop-cluster).

## Drop global cluster\{#drop-global-cluster}

To drop a global cluster, first delete all secondary clusters, then the primary cluster. The global cluster is automatically deleted with the primary.

