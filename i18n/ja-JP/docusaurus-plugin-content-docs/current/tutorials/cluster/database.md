---
title: "データベース | Cloud"
slug: /database
sidebar_key: database
sidebar_label: "データベース"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、クラスターとコレクションの間にデータベース層を導入し、データをより効率的に管理・整理できるようにするとともに、マルチテナンシーをサポートします。 | Cloud"
type: origin
token: Z0oiwVpsliiW1zksnlFc3ZsVnxf
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - milvus

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# データベース

Zilliz Cloud は、クラスタとコレクションの間に **データベース** 層を導入し、データをより効率的に管理・整理しながら、マルチテナンシーをサポートする方法を提供します。

## データベースとは\{#what-is-a-database}

Zilliz Cloud では、データベースはデータを整理・管理するための論理単位として機能します。データセキュリティを強化し、マルチテナンシーを実現するために、異なるアプリケーションやテナントのデータを論理的に分離するために複数のデータベースを作成できます。たとえば、ユーザー A のデータを格納するデータベースと、ユーザー B のデータを格納するデータベースを別々に作成できます。

Zilliz Cloud では、リソースは以下の階層順に構成されています。

![KkS9wtS5IhcP9obYvc1cK10snfg](https://zdoc-images.s3.us-west-2.amazonaws.com/KkS9wtS5IhcP9obYvc1cK10snfg.png)

データベースの概念は Dedicated クラスタでのみ利用可能であることに注意してください。Serverless クラスタおよび Free クラスタにはデータベースがありません。

## 前提条件\{#prerequisites}

データベースを管理するには、**組織オーナー** または **プロジェクト管理者** のアクセス権が必要です。

## データベースの作成\{#create-database}

データベースは Dedicated クラスタでのみ作成できます。クラスタの作成時に、デフォルトのデータベースが作成されます。

Dedicated クラスタには、コンソールから手動で、またはプログラムで、最大 1,024 個のデータベースを作成できます。

### コンソールでのデータベース作成\{#create-a-database-on-the-console}

コンソールでデータベースを作成する方法は、以下の図のとおりです。

![create-database](https://zdoc-images.s3.us-west-2.amazonaws.com/create-database.png "create-database")

作成済みのコレクションをあるデータベースから別のデータベースに移動することもできます。詳細については、[コレクションの管理（コンソール）](./manage-collections-console#manage-collection) を参照してください。

### プログラムによるデータベース作成\{#create-a-database-programmatically}

Milvus RESTful API または SDK を使用して、プログラムでデータを作成できます。

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

<TabItem value='java'>

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

<TabItem value='java'>

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

<TabItem value='java'>

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

データベース作成時に、そのプロパティを設定することもできます。以下の例では、データベースのレプリカ数を設定しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.create_database(
    db_name="my_database_2",
    properties={
        "database.replica.number": 3
    }
)
```

</TabItem>

<TabItem value='java'>

```java
Map<String, String> properties = new HashMap<>();
properties.put("database.replica.number", "3");
CreateDatabaseReq createDatabaseReq = CreateDatabaseReq.builder()
        .databaseName("my_database_2")
        .properties(properties)
        .build();
client.createDatabase(createDatabaseReq);
```

</TabItem>

<TabItem value='java'>

```javascript
await client.createDatabase({
    db_name: "my_database_2",
    properties: {
        "database.replica.number": 3
    }
});
```

</TabItem>

<TabItem value='java'>

```go
err := cli.CreateDatabase(ctx, milvusclient.NewCreateDatabaseOption("my_database_2").WithProperty("database.replica.number", 3))
if err != nil {
    // handle err
}
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/databases/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "dbName": "my_database_2",
    "properties": {
        "database.replica.number": 3
    }
}'
```

</TabItem>
</Tabs>

## データベースの表示\{#view-databases}

Milvus RESTful API または SDK を使用して、既存のすべてのデータベースを一覧表示し、その詳細を確認できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# List all existing databases
client.list_databases()

# Output
# ['default', 'my_database_1', 'my_database_2']

# Check database details
client.describe_database(
    db_name="default"
)

# Output
# {"name": "default"}
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.database.response.*;

ListDatabasesResp listDatabasesResp = client.listDatabases();

DescribeDatabaseResp descDBResp = client.describeDatabase(DescribeDatabaseReq.builder()
        .databaseName("default")
        .build());
```

</TabItem>

<TabItem value='java'>

```javascript
await client.describeDatabase({ 
    db_name: 'default'
});
```

</TabItem>

<TabItem value='java'>

```go
// List all existing databases
databases, err := cli.ListDatabase(ctx, milvusclient.NewListDatabaseOption())
if err != nil {
    // handle err
}
log.Println(databases)

db, err := cli.DescribeDatabase(ctx, milvusclient.NewDescribeDatabaseOption("default"))
if err != nil {
    // handle err
}
log.Println(db)
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="https://{cluster-id}.{region}.vectordb.zillizcloud.com:19530"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/databases/describe" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "dbName": "default"
}'
```

</TabItem>
</Tabs>

## データベースプロパティの管理\{#manage-database-properties}

各データベースには独自のプロパティがあります。データベースのプロパティは、[プログラムによるデータベースの作成](./database#create-a-database-programmatically) で説明されているようにデータベース作成時に設定することも、既存のデータベースのプロパティを変更または削除することもできます。

次の表に、設定可能なデータベースプロパティを示します。

<table>
   <tr>
     <th><p>プロパティ名</p></th>
     <th><p>型</p></th>
     <th><p>プロパティの説明</p></th>
   </tr>
   <tr>
     <td><p><code>database.replica.number</code></p></td>
     <td><p>整数</p></td>
     <td><p>指定されたデータベースのレプリカ数。</p></td>
   </tr>
   <tr>
     <td><p><code>database.max.collections</code></p></td>
     <td><p>整数</p></td>
     <td><p>指定されたデータベースで許可されるコレクションの最大数。</p></td>
   </tr>
   <tr>
     <td><p><code>database.force.deny.writing</code></p></td>
     <td><p>ブール値</p></td>
     <td><p>指定されたデータベースに書き込み操作を強制的に拒否させるかどうか。</p></td>
   </tr>
   <tr>
     <td><p><code>database.force.deny.reading</code></p></td>
     <td><p>ブール値</p></td>
     <td><p>指定されたデータベースに読み取り操作を強制的に拒否させるかどうか。</p></td>
   </tr>
</table>

### データベースプロパティの変更\{#alter-database-properties}

既存のデータベースのプロパティは、次のように変更できます。次の例では、データベース内に作成できるコレクションの数を制限しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.alter_database_properties(
    db_name="my_database_1",
    properties={
        "database.max.collections": 10
    }
)
```

</TabItem>

<TabItem value='java'>

```java
client.alterDatabaseProperties(AlterDatabasePropertiesReq.builder()
        .databaseName("my_database_1")
        .property("database.max.collections", "10")
        .build());
```

</TabItem>

<TabItem value='java'>

```javascript
await milvusClient.alterDatabaseProperties({
  db_name: "my_database_1",
  properties: {"database.max.collections", "10" },
})
```

</TabItem>

<TabItem value='java'>

```go
err := cli.AlterDatabaseProperties(ctx, milvusclient.NewAlterDatabasePropertiesOption("my_database_1").
    WithProperty("database.max.collections", 1))
if err != nil {
    // handle err
}
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/databases/alter" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "dbName": "my_database",
    "properties": {
        "database.max.collections": 10
    }
}'
```

</TabItem>
</Tabs>

### データベースプロパティの削除\{#drop-database-properties}

以下のようにプロパティを削除することで、データベースのプロパティをリセットすることもできます。次の例では、データベース内で作成可能なコレクション数の制限を解除しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.drop_database_properties(
    db_name="my_database_1",
    property_keys=[
        "database.max.collections"
    ]
)
```

</TabItem>

<TabItem value='java'>

```java
client.dropDatabaseProperties(DropDatabasePropertiesReq.builder()
        .databaseName("my_database_1")
        .propertyKeys(Collections.singletonList("database.max.collections"))
        .build());
```

</TabItem>

<TabItem value='java'>

```javascript
await milvusClient.dropDatabaseProperties({
  db_name: my_database_1,
  properties: ["database.max.collections"],
});
```

</TabItem>

<TabItem value='java'>

```go
err := cli.DropDatabaseProperties(ctx, milvusclient.NewDropDatabasePropertiesOption("my_database_1", "database.max.collections"))
if err != nil {
    // handle err
}
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/databases/alter" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "dbName": "my_database",
    "propertyKeys": [
        "database.max.collections"
    ]
}'
```

</TabItem>
</Tabs>

## データベースの使用\{#use-database}

Zilliz Cloud から切断することなく、あるデータベースから別のデータベースに切り替えることができます。

<Admonition type="info" icon="📘" title="Notes">

<p>RESTful API はこの操作をサポートしていません。</p>

</Admonition>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.use_database(
    db_name="my_database_2"
)
```

</TabItem>

<TabItem value='java'>

```java
client.useDatabase("my_database_2");
```

</TabItem>

<TabItem value='java'>

```javascript
await milvusClient.useDatabase({
  db_name: "my_database_2",
});
```

</TabItem>

<TabItem value='java'>

```go
err = cli.UseDatabase(ctx, milvusclient.NewUseDatabaseOption("my_database_2"))
if err != nil {
    // handle err
}
```

</TabItem>

<TabItem value='java'>

```bash
# This operation is unsupported because RESTful does not provide a persistent connection.
# As a workaround, initiate the required request again with the target database.
```

</TabItem>
</Tabs>

## データベースの削除\{#drop-database}

データベースが不要になった場合、削除することができます。ただし、以下の点に注意してください。

- デフォルトのデータベースは削除できません。

- データベースを削除する前に、データベース内のすべてのコレクションを先に削除する必要があります。

### コンソールでデータベースを削除する\{#drop-a-database-on-the-console}

以下の手順に従って、コンソール上でデータベースを削除できます。

![drop-database](https://zdoc-images.s3.us-west-2.amazonaws.com/drop-database.png "drop-database")

### プログラムでデータベースを削除する\{#drop-a-database-programmatically}

Milvus RESTful API または SDK を使用して、プログラムでデータを削除できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.drop_database(
    db_name="my_database_2"
)
```

</TabItem>

<TabItem value='java'>

```java
client.dropDatabase(DropDatabaseReq.builder()
        .databaseName("my_database_2")
        .build());
```

</TabItem>

<TabItem value='java'>

```javascript
await milvusClient.dropDatabase({
  db_name: "my_database_2",
});
```

</TabItem>

<TabItem value='java'>

```go
err = cli.DropDatabase(ctx, milvusclient.NewDropDatabaseOption("my_database_2"))
if err != nil {
    // handle err
}
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="https://{cluster-id}.{region}.vectordb.zillizcloud.com:19530"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/databases/drop" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "dbName": "my_database"
}'
```

</TabItem>
</Tabs>

