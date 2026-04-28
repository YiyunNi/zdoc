---
title: "Create Database | BYOC"
slug: /create-database
sidebar_label: "Create Database"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "You can create multiple databases to separate data by environment (staging vs. production), by team, by tenant, or by business domain. | BYOC"
type: origin
token: CTkUwnI4oiTS2kkcy1YcrjC0nLy
sidebar_position: 1

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Procedures from '@site/src/components/Procedures';

# Create Database

You can create multiple databases to separate data by environment (staging vs. production), by team, by tenant, or by business domain. 

Zilliz Cloud supports creating two types of databases: 

- **Create databases in serving cluster:** For production workloads that require always-on, low-latency access to data.

- **Create databases in on-demand compute:** For batch operations, external collections, and workloads where you don't need a persistent cluster — compute is allocated per request.

For details about the difference between these two types of databases, see [Database](./database). This page provides instructions on how to create a database.

## Considerations\{#considerations}

- **Access Control**: You need to have **Organization Owner** or **Project Admin** access to manage databases.

- **Limitations**:

    - You can create up to 1,024 cluster databases in a serving Dedicated cluster.

    - You can create up to 100 databases in on-demand compute in each project.

## Create database in serving cluster\{#create-database-in-serving-cluster}

You can only create database in serving Dedicated clusters. Free and serverless clusters do not provide the database layer.

When a Dedicated serving cluster is created, a default database is automatically created with it. The default database cannot be dropped. 

- **Via SDKs**

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
    <TabItem value='python'>

    ```python
    from pymilvus import MilvusClient
    
    client = MilvusClient(
        uri="https://{cluster-id}.{region}.vectordb.zillizcloud.com:19530",
        token="YOUR_CLUSTER_TOKEN"
    )
    
    client.create_database(
        db_name="my_database_1"
    )
    ```

    </TabItem>

    <TabItem value='java'>

    ```java
    import io.milvus.v2.client.MilvusClientV2;
    import io.milvus.v2.client.ConnectConfig;
    import io.milvus.v2.service.database.request.*;
    
    ConnectConfig config = ConnectConfig.builder()
            .uri("https://{cluster-id}.{region}.vectordb.zillizcloud.com:19530")
            .token("YOUR_CLUSTER_TOKEN")
            .build();
    MilvusClientV2 client = new MilvusClientV2(config);
    
    CreateDatabaseReq createDatabaseReq = CreateDatabaseReq.builder()
            .databaseName("my_database_1")
            .build();
    client.createDatabase(createDatabaseReq);
    ```

    </TabItem>

    <TabItem value='javascript'>

    ```javascript
    import {MilvusClient} from '@zilliz/milvus2-sdk-node';
    const client = new MilvusClient({ 
        address: "https://{cluster-id}.{region}.vectordb.zillizcloud.com:19530",
        token: 'YOUR_CLUSTER_TOKEN' 
    });
    
    await client.createDatabase({
        db_name: "my_database_1"
     });
    ```

    </TabItem>

    <TabItem value='go'>

    ```go
    cli, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
        Address: "https://{cluster-id}.{region}.vectordb.zillizcloud.com:19530",
        APIKey: "YOUR_CLUSTER_TOKEN"
    })
    if err != nil {
        // handle err
    }
    
    err = cli.CreateDatabase(ctx, milvusclient.NewCreateDatabaseOption("my_database_1"))
    if err != nil {
        // handle err
    }
    ```

    </TabItem>

    <TabItem value='bash'>

    ```bash
    export CLUSTER_ENDPOINT="https://{cluster-id}.{region}.vectordb.zillizcloud.com:19530"
    export TOKEN="YOUR_CLUSTER_TOKEN"
    
    curl --request POST \
    --url "${CLUSTER_ENDPOINT}/v2/vectordb/databases/create" \
    --header "Authorization: Bearer ${TOKEN}" \
    --header "Content-Type: application/json" \
    -d '{
        "dbName": "my_database_1"
    }'
    ```

    </TabItem>
    </Tabs>

- **Via web console**

    ![QevkwIJI5hYpKBbTgehckJE3nFh](https://zdoc-images.s3.us-west-2.amazonaws.com/QevkwIJI5hYpKBbTgehckJE3nFh.png)

    <Procedures>

    1. Navigate to your project and select the target serving cluster.

    1. In the **Databases** tab, click **Create Database**.

    1. Enter a database name.

    1.  Click **Create**.

    </Procedures>

