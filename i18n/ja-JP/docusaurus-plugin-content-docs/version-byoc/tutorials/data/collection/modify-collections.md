---
title: "コレクションの変更 | BYOC"
slug: /modify-collections
sidebar_label: "コレクションの変更"
beta: FALSE
notebook: FALSE
description: "コレクションの名前を変更したり、設定を変更したりできます。このページでは、コレクションを変更する方法について説明します。 | BYOC"
type: origin
token: WMh8w3tbKiBhukk3ICMc4ctznEg
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - コレクションの変更

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# コレクションの変更

コレクションの名前を変更したり、設定を変更したりできます。このページでは、コレクションを変更する方法について説明します。

## コレクション名の変更\{#rename-collection}

コレクションの名前は次のように変更できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

client.rename_collection(
    old_name="my_collection",
    new_name="my_new_collection"
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.collection.request.RenameCollectionReq;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;

String CLUSTER_ENDPOINT = "YOUR_CLUSTER_ENDPOINT";
String TOKEN = "YOUR_CLUSTER_TOKEN";

// 1. Connect to Milvus server
ConnectConfig connectConfig = ConnectConfig.builder()
    .uri(CLUSTER_ENDPOINT)
    .token(TOKEN)
    .build();
    
MilvusClientV2 client = new MilvusClientV2(connectConfig);

RenameCollectionReq renameCollectionReq = RenameCollectionReq.builder()
        .collectionName("my_collection")
        .newCollectionName("my_new_collection")
        .build();

client.renameCollection(renameCollectionReq);
```

</TabItem>

<TabItem value='java'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const address = "YOUR_CLUSTER_ENDPOINT";
const token = "YOUR_CLUSTER_TOKEN";
const client = new MilvusClient({address, token});

const res = await client.renameCollection({
    oldName: "my_collection",
    newName: "my_new_collection"
});
```

</TabItem>

<TabItem value='java'>

```go
import (
    "context"
    "fmt"

    "github.com/milvus-io/milvus/client/v2/milvusclient"
)

ctx, cancel := context.WithCancel(context.Background())
defer cancel()

milvusAddr := "YOUR_CLUSTER_ENDPOINT"
token := "YOUR_CLUSTER_TOKEN"

client, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
    Address: milvusAddr,
    APIKey:  token,
})
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
defer client.Close(ctx)

err = client.RenameCollection(ctx, milvusclient.NewRenameCollectionOption("my_collection", "my_new_collection"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/rename" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "newCollectionName": "my_new_collection"
}'
```

</TabItem>
</Tabs>

## コレクションプロパティの設定\{#set-collection-properties}

コレクション作成後に、コレクションレベルのプロパティを変更できます。

### サポートされているプロパティ\{#supported-properties}

<table>
   <tr>
     <th><p>プロパティ</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>collection.ttl.seconds</code></p></td>
     <td><p>コレクションのデータを特定の期間後に削除する必要がある場合は、そのTime-To-Live (TTL) を秒単位で設定することを検討してください。TTLがタイムアウトすると、Zilliz Cloudはコレクションからすべてのエンティティを削除します。</p><p>削除は非同期であり、削除が完了する前でも検索やクエリが可能です。</p><p>詳細については、<a href="./set-collection-ttl">コレクションTTLの設定</a>を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>mmap.enabled</code></p></td>
     <td><p>メモリマッピング (Mmap) は、ディスク上の大きなファイルへの直接メモリアクセスを可能にし、Zilliz Cloudがインデックスとデータをメモリとハードドライブの両方に保存できるようにします。このアプローチは、アクセス頻度に基づいてデータ配置ポリシーを最適化し、検索パフォーマンスに影響を与えることなくコレクションのストレージ容量を拡張するのに役立ちます。</p><p>Zilliz Cloudは、クラスターの<a href="./use-mmap#global-mmap-strategy">グローバルmmap設定</a>を実装しています。特定のフィールドまたはそのインデックスの設定を変更できます。</p><p>詳細については、mmapの使用を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>partitionkey.isolation</code></p></td>
     <td><p>パーティションキー分離を有効にすると、Zilliz Cloudはパーティションキー値に基づいてエンティティをグループ化し、これらのグループごとに個別のインデックスを作成します。検索リクエストを受信すると、Zilliz Cloudはフィルタリング条件で指定されたパーティションキー値に基づいてインデックスを特定し、インデックスに含まれるエンティティ内の検索範囲を制限するため、検索中に無関係なエンティティをスキャンすることを回避し、検索パフォーマンスを大幅に向上させます。</p><p>詳細については、<a href="./use-partition-key#use-partition-key-isolation">パーティションキー分離の使用</a>を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>dynamicfield.enabled</code></p></td>
     <td><p>動的フィールドを有効にせずに作成されたコレクションの動的フィールドを有効にします。有効にすると、元のスキーマで定義されていないフィールドを持つエンティティを挿入できます。詳細については、<a href="./enable-dynamic-field">動的フィールド</a>を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>allow_insert_auto_id</code></p></td>
     <td><p>AutoIDが有効になっているコレクションで、ユーザーが指定したプライマリキー値を受け入れるかどうか。</p><ul><li><p><strong>"true"</strong>に設定した場合：挿入、アップサート、および一括インポートは、存在する場合はユーザーが指定したプライマリキーを使用します。それ以外の場合、プライマリキー値は自動生成されます。</p></li><li><p><strong>"false"</strong>に設定した場合：ユーザーが指定したプライマリキー値は拒否または無視され、プライマリキー値は常に自動生成されます。デフォルトは<strong>"false"</strong>です。</p></li></ul></td>
   </tr>
   <tr>
     <td><p><code>timezone</code></p></td>
     <td><p>特に<code>TIMESTAMPTZ</code>フィールドを扱う時間依存の操作において、このコレクションのデフォルトのタイムゾーンを指定します。タイムスタンプは内部的にUTCで保存され、Milvusはこの設定に従って表示および比較のために値を変換します。設定されている場合、コレクションのタイムゾーンはデータベースのデフォルトのタイムゾーンを上書きします。クエリのタイムゾーンパラメータは、両方を一時的に上書きできます。値は有効な<a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones">IANAタイムゾーン識別子</a>（例：<strong>Asia/Shanghai</strong>、<strong>America/Chicago</strong>、または<strong>UTC</strong>）である必要があります。<code>TIMESTAMPTZ</code>フィールドの使用方法の詳細については、<a href="./use-timestamptz-field">TIMESTAMPTZフィールド</a>を参照してください。</p></td>
   </tr>
</table>

### 例1：コレクションTTLの設定\{#example-1-set-collection-ttl}

以下のコードスニペットは、コレクションTTLを設定する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client.alter_collection_properties(
    collection_name="my_collection",
    properties={"collection.ttl.seconds": 60}
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.param.Constant;
import io.milvus.v2.service.collection.request.AlterCollectionPropertiesReq;

AlterCollectionPropertiesReq alterCollectionReq = AlterCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .property(Constant.TTL_SECONDS, "60")
        .build();

client.alterCollectionProperties(alterCollectionReq);
```

</TabItem>

<TabItem value='java'>

```javascript
res = await client.alterCollection({
    collection_name: "my_collection",
    properties: {
        "collection.ttl.seconds": 60
    }
})
```

</TabItem>

<TabItem value='java'>

```go
err = client.AlterCollectionProperties(ctx, milvusclient.NewAlterCollectionPropertiesOption("my_collection").WithProperty(common.CollectionTTLConfigKey, 60))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/alter_properties" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "properties": {
        "collection.ttl.seconds": 60
    }
}'
```

</TabItem>
</Tabs>

### 例 2: mmap を有効にする\{#example-2-enable-mmap}

次のコードスニペットは、mmap を有効にする方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client.alter_collection_properties(
    collection_name="my_collection",
    properties={"mmap.enabled": True}
)
```

</TabItem>

<TabItem value='java'>

```java
AlterCollectionPropertiesReq alterCollectionReq = AlterCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .property(Constant.MMAP_ENABLED, "True")
        .build();

client.alterCollectionProperties(alterCollectionReq);
```

</TabItem>

<TabItem value='java'>

```javascript
await client.alterCollectionProperties({
    collection_name: "my_collection",
    properties: {
        "mmap.enabled": true
    }
});
```

</TabItem>

<TabItem value='java'>

```go
err = client.AlterCollectionProperties(ctx, milvusclient.NewAlterCollectionPropertiesOption("my_collection").WithProperty(common.MmapEnabledKey, true))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/collections/alter_properties" \
  -H "Content-Type: application/json" \
  -d '{
    "collectionName": "my_collection",
    "properties": {
      "mmap.enabled": "true"
    }
  }'
```

</TabItem>
</Tabs>

### 例 3: パーティションキーを有効にする\{#example-3-enable-partition-key}

以下のコードスニペットは、パーティションキーを有効にする方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client.alter_collection_properties(
    collection_name="my_collection",
    properties={"partitionkey.isolation": True}
)
```

</TabItem>

<TabItem value='java'>

```java
AlterCollectionPropertiesReq alterCollectionReq = AlterCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .property("partitionkey.isolation", "True")
        .build();

client.alterCollectionProperties(alterCollectionReq);
```

</TabItem>

<TabItem value='java'>

```javascript
await client.alterCollectionProperties({
    collection_name: "my_collection",
    properties: {
        "partitionkey.isolation": true
    }
});
```

</TabItem>

<TabItem value='java'>

```go
err = client.AlterCollectionProperties(ctx, milvusclient.NewAlterCollectionPropertiesOption("my_collection").WithProperty(common.PartitionKeyIsolationKey, true))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/collections/alter_properties" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "collectionName": "my_collection",
    "properties": {
      "partitionkey.isolation": "true"
    }
  }'
```

</TabItem>
</Tabs>

### 例 4: 動的フィールドの有効化\{#example-4-enable-dynamic-field}

以下のコードスニペットは、動的フィールドを有効にする方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client.alter_collection_properties(
    collection_name="my_collection",
    properties={"dynamicfield.enabled": True}
)
```

</TabItem>

<TabItem value='java'>

```java
AlterCollectionPropertiesReq alterCollectionReq = AlterCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .property("dynamicfield.enabled", "True")
        .build();

client.alterCollectionProperties(alterCollectionReq);
```

</TabItem>

<TabItem value='java'>

```javascript
await client.alterCollectionProperties({
    collection_name: "my_collection",
    properties: {
        "dynamicfield.enabled": true
    }
});
```

</TabItem>

<TabItem value='java'>

```go
err = client.AlterCollectionProperties(ctx, milvusclient.NewAlterCollectionPropertiesOption("my_collection").WithProperty(common.EnableDynamicSchemaKey, true))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/collections/alter_properties" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "collectionName": "my_collection",
    "properties": {
      "dynamicfield.enabled": "true"
    }
  }'
```

</TabItem>
</Tabs>

### 例 5: allow_insert_auto_id を有効にする\{#example-5-enable-allowinsertautoid}

`allow_insert_auto_id` プロパティを使用すると、AutoID が有効なコレクションで、挿入、アップサート、および一括インポート中にユーザー指定の主キー値を受け入れることができます。**"true"** に設定すると、Zilliz Cloud は、存在する場合はユーザー指定の主キー値を使用します。それ以外の場合は、自動生成します。デフォルトは **"false"** です。

以下の例は、`allow_insert_auto_id` を有効にする方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.alter_collection_properties(
    collection_name="my_collection",
    # highlight-next-line
    properties={"allow_insert_auto_id": "true"}
)
# After enabling, inserts with a PK column will use that PK; otherwise Zilliz Cloud auto-generates.
```

</TabItem>

<TabItem value='java'>

```java
AlterCollectionPropertiesReq alterCollectionReq = AlterCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .property("allow_insert_auto_id", "True")
        .build();

client.alterCollectionProperties(alterCollectionReq);
```

</TabItem>

<TabItem value='java'>

```javascript
await client.alterCollectionProperties({
    collection_name: "my_collection",
    properties: {
        "allow_insert_auto_id": true
    }
});
```

</TabItem>

<TabItem value='java'>

```go
err = client.AlterCollectionProperties(ctx, milvusclient.NewAlterCollectionPropertiesOption("my_collection").WithProperty(common.AllowInsertAutoIDKey, true))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/collections/alter_properties" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "collectionName": "my_collection",
    "properties": {
      "allow_insert_auto_id": "true"
    }
  }'
```

</TabItem>
</Tabs>

### 例 6: コレクションのタイムゾーンを設定する\{#example-6-set-collection-time-zone}

`timezone` プロパティを使用して、コレクションのデフォルトのタイムゾーンを設定できます。これにより、データの挿入、クエリ、結果の表示など、コレクション内のすべての操作で時間関連のデータがどのように解釈され、表示されるかが決まります。

`timezone` の値は、`Asia/Shanghai`、`America/Chicago`、`UTC` など、有効な [IANA タイムゾーン識別子](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)である必要があります。無効な値または非標準の値を使用すると、コレクションプロパティの変更時にエラーが発生します。

以下の例は、コレクションのタイムゾーンを **Asia/Shanghai** に設定する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.alter_collection_properties(
    collection_name="my_collection",
    # highlight-next-line
    properties={"timezone": "Asia/Shanghai"}
)
```

</TabItem>

<TabItem value='java'>

```java
AlterCollectionPropertiesReq alterCollectionReq = AlterCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .property("timezone", "Asia/Shanghai")
        .build();

client.alterCollectionProperties(alterCollectionReq);
```

</TabItem>

<TabItem value='java'>

```javascript
// js
```

</TabItem>

<TabItem value='java'>

```go
err = client.AlterCollectionProperties(ctx, milvusclient.NewAlterCollectionPropertiesOption("my_collection").WithProperty(common.CollectionDefaultTimezone, true))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/collections/alter_properties" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "collectionName": "my_collection",
    "properties": {
      "timezone": "Asia/Shanghai"
    }
  }'
```

</TabItem>
</Tabs>

## コレクションプロパティの削除\{#drop-collection-properties}

コレクションプロパティは、以下のように削除してリセットすることもできます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.drop_collection_properties(
    collection_name="my_collection",
    property_keys=[
        "collection.ttl.seconds"
    ]
)
```

</TabItem>

<TabItem value='java'>

```java
client.dropCollectionProperties(DropCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .propertyKeys(Collections.singletonList("collection.ttl.seconds"))
        .build());
```

</TabItem>

<TabItem value='java'>

```javascript
client.dropCollectionProperties({
    collection_name:"my_collection",
    properties: ['collection.ttl.seconds'],
});
```

</TabItem>

<TabItem value='java'>

```go
err = client.DropCollectionProperties(ctx, milvusclient.NewDropCollectionPropertiesOption("my_collection", common.CollectionTTLConfigKey))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/drop_properties" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "propertyKeys": [
        "collection.ttl.seconds"
    ]
}'
```

</TabItem>
</Tabs>

