---
title: "データベース | Cloud"
slug: /database
sidebar_label: "データベース"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、クラスターとコレクションの間にデータベース層を導入し、マルチテナンシーをサポートしながら、データを管理および整理するより効率的な方法を提供します。 | Cloud"
type: origin
token: Z0oiwVpsliiW1zksnlFc3ZsVnxf
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - milvus
  - ベクトル埋め込みとは
  - ベクトルデータベースチュートリアル
  - ベクトルデータベースの仕組み
  - ベクトルDB比較

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# データベース

Zilliz Cloud は、クラスターとコレクションの間に**データベース**レイヤーを導入し、マルチテナンシーをサポートしながらデータを管理および整理するより効率的な方法を提供します。

## データベースとは{#what-is-a-database}

Zilliz Cloud では、データベースはデータを整理および管理するための論理ユニットとして機能します。データセキュリティを強化し、マルチテナンシーを実現するために、複数のデータベースを作成して、異なるアプリケーションまたはテナントのデータを論理的に分離できます。たとえば、ユーザー A のデータを保存するデータベースと、ユーザー B のデータを保存する別のデータベースを作成します。

Zilliz Cloud のリソースは、次の階層順に構造化されています。

![KkS9wtS5IhcP9obYvc1cK10snfg](https://zdoc-images.s3.us-west-2.amazonaws.com/KkS9wtS5IhcP9obYvc1cK10snfg.png)

データベースの概念は、Dedicated クラスターでのみ利用可能です。Serverless および Free クラスターにはデータベースがありません。

## 前提条件{#prerequisites}

データベースを管理するには、**Organization Owner** または **Project Admin** のアクセス権が必要です。

## データベースの作成{#create-database}

データベースは Dedicated クラスターでのみ作成できます。クラスターの作成時に、デフォルトのデータベースが作成されます。

Dedicated クラスターでは、コンソールで手動で、またはプログラムで、最大 1,024 個のデータベースを作成できます。

### コンソールでデータベースを作成する{#create-a-database-on-the-console}

次の図に示すように、コンソールでデータベースを作成できます。

![create-database](https://zdoc-images.s3.us-west-2.amazonaws.com/create-database.png "create-database")

作成したコレクションをあるデータベースから別のデータベースに移動することもできます。詳細については、「[コレクションの管理 (コンソール)](./manage-collections-console#manage-collection)」を参照してください。

### プログラムでデータベースを作成する{#create-a-database-programmatically}

Milvus RESTful API または SDK を使用して、プログラムでデータを作成できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
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
        .uri("YOUR_CLUSTER_ENDPOINT")
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
    address: "YOUR_CLUSTER_ENDPOINT",
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
    Address: "YOUR_CLUSTER_ENDPOINT",
    Username: "Milvus",
    Password: "root",
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
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
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

データベースを作成する際に、データベースのプロパティを設定することもできます。次の例では、データベースのレプリカ数を設定します。

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

<TabItem value='javascript'>

```javascript
await client.createDatabase({
    db_name: "my_database_2",
    properties: {
        "database.replica.number": 3
    }
});
```

</TabItem>

<TabItem value='go'>

```go
err := cli.CreateDatabase(ctx, milvusclient.NewCreateDatabaseOption("my_database_2").WithProperty("database.replica.number", 3))
if err != nil {
    // handle err
}
```

</TabItem>

<TabItem value='bash'>

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

## データベースの表示{#view-databases}

Milvus RESTful APIまたはSDKを使用して、既存のすべてのデータベースをリストし、その詳細を表示できます。

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

<TabItem value='javascript'>

```javascript
await client.describeDatabase({ 
    db_name: 'default'
});
```

</TabItem>

<TabItem value='go'>

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

<TabItem value='bash'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
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

## データベースプロパティの管理{#manage-database-properties}

各データベースには独自のプロパティがあり、[プログラムでデータベースを作成する](./database#create-a-database-programmatically)で説明されているように、データベースを作成する際にデータベースのプロパティを設定したり、既存のデータベースのプロパティを変更したり削除したりできます。

次の表に、可能なデータベースプロパティを示します。

<table>
   <tr>
     <th><p>プロパティ名</p></th>
     <th><p>タイプ</p></th>
     <th><p>プロパティの説明</p></th>
   </tr>
   <tr>
     <td><p><code>database.replica.number</code></p></td>
     <td><p>integer</p></td>
     <td><p>指定されたデータベースのレプリカ数。</p></td>
   </tr>
   <tr>
     <td><p><code>database.max.collections</code></p></td>
     <td><p>integer</p></td>
     <td><p>指定されたデータベースで許可されるコレクションの最大数。</p></td>
   </tr>
   <tr>
     <td><p><code>database.force.deny.writing</code></p></td>
     <td><p>boolean</p></td>
     <td><p>指定されたデータベースに書き込み操作を強制的に拒否させるかどうか。</p></td>
   </tr>
   <tr>
     <td><p><code>database.force.deny.reading</code></p></td>
     <td><p>boolean</p></td>
     <td><p>指定されたデータベースに読み取り操作を強制的に拒否させるかどうか。</p></td>
   </tr>
</table>

### データベースプロパティの変更{#alter-database-properties}

既存のデータベースのプロパティは次のように変更できます。次の例では、データベースに作成できるコレクションの数を制限しています。

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

<TabItem value='javascript'>

```javascript
await milvusClient.alterDatabaseProperties({
  db_name: "my_database_1",
  properties: {"database.max.collections", "10" },
})
```

</TabItem>

<TabItem value='go'>

```go
err := cli.AlterDatabaseProperties(ctx, milvusclient.NewAlterDatabasePropertiesOption("my_database_1").
    WithProperty("database.max.collections", 1))
if err != nil {
    // handle err
}
```

</TabItem>

<TabItem value='bash'>

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

### データベースプロパティを削除する{#drop-database-properties}

データベースプロパティを削除してリセットすることもできます。以下の例では、データベースに作成できるコレクション数の制限を削除します。

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

<TabItem value='javascript'>

```javascript
await milvusClient.dropDatabaseProperties({
  db_name: my_database_1,
  properties: ["database.max.collections"],
});
```

</TabItem>

<TabItem value='go'>

```go
err := cli.DropDatabaseProperties(ctx, milvusclient.NewDropDatabasePropertiesOption("my_database_1", "database.max.collections"))
if err != nil {
    // handle err
}
```

</TabItem>

<TabItem value='bash'>

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

## データベースを使用する{#use-database}

Zilliz Cloudから切断することなく、あるデータベースから別のデータベースに切り替えることができます。

<Admonition type="info" icon="📘" title="備考">

<p>RESTful APIはこの操作をサポートしていません。</p>

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

<TabItem value='javascript'>

```javascript
await milvusClient.useDatabase({
  db_name: "my_database_2",
});
```

</TabItem>

<TabItem value='go'>

```go
err = cli.UseDatabase(ctx, milvusclient.NewUseDatabaseOption("my_database_2"))
if err != nil {
    // handle err
}
```

</TabItem>

<TabItem value='bash'>

```bash
# This operation is unsupported because RESTful does not provide a persistent connection.
# As a workaround, initiate the required request again with the target database.
```

</TabItem>
</Tabs>

## データベースを削除する{#drop-database}

データベースが不要になったら、削除できます。注意点：

- デフォルトデータベースは削除できません。

- データベースを削除する前に、そのデータベース内のすべてのコレクションを削除する必要があります。

### コンソールでデータベースを削除する{#drop-a-database-on-the-console}

以下の図の手順に従って、コンソールでデータベースを削除できます。

![drop-database](https://zdoc-images.s3.us-west-2.amazonaws.com/drop-database.png "drop-database")

### プログラムでデータベースを削除する{#drop-a-database-programmatically}

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

<TabItem value='javascript'>

```javascript
await milvusClient.dropDatabase({
  db_name: "my_database_2",
});
```

</TabItem>

<TabItem value='go'>

```go
err = cli.DropDatabase(ctx, milvusclient.NewDropDatabaseOption("my_database_2"))
if err != nil {
    // handle err
}
```

</TabItem>

<TabItem value='bash'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
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

