---
title: "Create Global Cluster | Cloud"
slug: /create-global-cluster
sidebar_label: "Create Global Cluster"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "This guide explains how to create a global cluster. | Cloud"
type: origin
token: MZ2WwklE5ifX4hkO4ZOcXz0indc
sidebar_position: 2
keywords: 
  - zilliz
  - vector database
  - cloud
  - milvus
  - global cluster

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Supademo from '@site/src/components/Supademo';

# Create Global Cluster

This guide explains how to create a global cluster. 

If you need to enable the global cluster feature for an existing cluster, see [Manage Cluster](./manage-cluster#convert-to-a-global-cluster).

<Admonition type="info" icon="📘" title="Notes">

<p>This feature is available only to <strong>Dedicated</strong> clusters in a <strong>Business Critical</strong> project.</p>

</Admonition>

## Before you start\{#before-you-start}

- Ensure you are a Project Admin.

## Create a global cluster\{#create-a-global-cluster}

Turn on the switch next to **Global Cluster** in **Cluster Settings** and provide a name for the global cluster. A global cluster must have 1 primary cluster and 1 to 5 secondary cluster. The cloud provider, cluster type, number of query CU should be consistent with those of the primary cluster.

The following demo shows how to create a global cluster via the web console.

<Supademo id="cmkasmmcr1glake4xm2kdnfbt" title=""  />

Zilliz Cloud starts to create the global cluster and its primary and secondary clusters. After creation completes, Zilliz Cloud starts replicating data from the primary cluster to each secondary cluster.

You can monitor the sync status and replication latency between the primary and secondary clusters in the **Global Topology** section on the **Global Cluster** page.

![WJNNb0XQ9oG1tjxmYCSc00WJnxe](https://zdoc-images.s3.us-west-2.amazonaws.com/wjnnb0xq9og1tjxmycsc00wjnxe.png "WJNNb0XQ9oG1tjxmYCSc00WJnxe")

## Connect to a global cluster\{#connect-to-a-global-cluster}

After your global cluster is running, connect to it using a **global endpoint** or **public endpoint** and an **authentication token**.

- **Global endpoint/Public Endpoint:** You can obtain this on the Zilliz Cloud web console. Navigate to the **Cluster Details** page of the target cluster. On the **Connect** card, you can copy the global endpoint or public endpoint. To understand when to use which endpoint, see [Global Cluster Explained](./global-cluster-explained#typical-use-cases).

    <Admonition type="info" icon="📘" title="Note">

    <p>If you have configured a private endpoint, you can choose to disable the public endpoint and global endpoint for greater security. For details, see <a href="./setup-a-private-link-aws#manage-internet-access-to-your-clusters">Manage internet access to your clusters</a>.</p>

    </Admonition>

    ![VmvpbMxW8oXwYyxk2n0cZ2f7nsh](https://zdoc-images.s3.us-west-2.amazonaws.com/vmvpbmxw8oxwyyxk2n0cz2f7nsh.png "VmvpbMxW8oXwYyxk2n0cZ2f7nsh")

- **Token:** This token can be  an [API key](./manage-api-keys) or a [cluster credential](./cluster-credentials) that consists of a username and password pair. 

    The following example shows how to connect to a cluster.

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
    <TabItem value='python'>

    ```python
    # Connect using a MilvusClient object
    from pymilvus import MilvusClient
    CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT" # Set your cluster endpoint
    TOKEN="YOUR_CLUSTER_TOKEN" # Set your token
    
    # Initialize a MilvusClient instance
    # Replace uri and token with your own
    client = MilvusClient(
        uri=CLUSTER_ENDPOINT, # Cluster endpoint obtained from the console
        token=TOKEN # API key or a colon-separated cluster username and password
    )
    ```

    </TabItem>

    <TabItem value='java'>

    ```java
    import io.milvus.v2.client.MilvusClientV2;
    import io.milvus.v2.client.ConnectConfig;
    
    String CLUSTER_ENDPOINT = "YOUR_CLUSTER_ENDPOINT";
    String TOKEN = "YOUR_CLUSTER_TOKEN";
    
    // 1. Connect to Milvus server
    ConnectConfig connectConfig = ConnectConfig.builder()
        .uri(CLUSTER_ENDPOINT)
        .token(TOKEN)
        .build();
    
    MilvusClientV2 client = new MilvusClientV2(connectConfig);
    
    ```

    </TabItem>

    <TabItem value='javascript'>

    ```javascript
    const { MilvusClient, DataType, sleep } = require("@zilliz/milvus2-sdk-node")
    
    const address = "YOUR_CLUSTER_ENDPOINT"
    const token = "YOUR_CLUSTER_TOKEN"
    
    // 1. Connect to the cluster
    const client = new MilvusClient({address, token})
    ```

    </TabItem>

    <TabItem value='go'>

    ```go
    import "github.com/milvus-io/milvus/client/v2/milvusclient"
    
    client, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
        Address: "YOUR_CLUSTER_ENDPOINT",
        APIKey:  "YOUR_CLUSTER_TOKEN",
    })
    ```

    </TabItem>

    <TabItem value='bash'>

    ```bash
    curl --request POST \
      --url "YOUR_CLUSTER_ENDPOINT" \
      --header "Authorization: Bearer YOUR_CLUSTER_TOKEN" \
      --header "Content-Type: application/json" \
      --data '{"dbName": "default"}'
    ```

    </TabItem>
    </Tabs>