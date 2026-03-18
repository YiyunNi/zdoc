---
title: "コレクションの変更 | BYOC"
slug: /modify-collections
sidebar_label: "変更"
beta: FALSE
notebook: FALSE
description: "コレクションの名前を変更したり、設定を変更したりできます。このページでは、コレクションを変更する方法に焦点を当てています。| BYOC"
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

## コレクションの名前変更\{#rename-collection}

以下のようにしてコレクションの名前を変更できます。

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

## Set Collection Properties\{#set-collection-properties}

コレクション作成後も、コレクションレベルのプロパティを変更できます。

### Supported properties\{#supported-properties}

<table>
   <tr>
     <th><p>Property</p></th>
     <th><p>Description</p></th>
   </tr>
   <tr>
     <td><p><code>collection.ttl.seconds</code></p></td>
     <td><p>コレクションのデータを特定の期間後に削除する必要がある場合は、Time-To-Live (TTL) を秒単位で設定することを検討してください。TTL の期限が切れると、Zilliz Cloud はそのコレクションからすべてのエンティティを削除します。</p><p>削除は非同期で行われるため、削除が完了するまでは検索およびクエリが可能です。</p><p>詳細については、「<a href="./set-collection-ttl">Set Collection TTL</a>」を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>mmap.enabled</code></p></td>
     <td><p>メモリマッピング（mmap）により、ディスク上の大規模ファイルに直接メモリアクセスできるようになり、Zilliz Cloud はインデックスとデータをメモリおよびハードドライブの両方に格納できます。このアプローチにより、アクセス頻度に基づいたデータ配置ポリシーを最適化し、検索パフォーマンスに影響を与えることなくコレクションのストレージ容量を拡張できます。</p><p>Zilliz Cloud はクラスターに対して<a href="./use-mmap#global-mmap-strategy">グローバルな mmap 設定</a>を実装しています。特定のフィールドまたはそのインデックスに対して設定を変更できます。</p><p>詳細については、「Use mmap」を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>partitionkey.isolation</code></p></td>
     <td><p>パーティションキー分離（パーティションキー Isolation）を有効にすると、Zilliz Cloud はパーティションキーの値に基づいてエンティティをグループ化し、各グループごとに個別のインデックスを作成します。検索リクエストを受信すると、Zilliz Cloud はフィルタリング条件で指定されたパーティションキーの値に基づいて対応するインデックスを特定し、そのインデックスに含まれるエンティティの範囲内でのみ検索を実行します。これにより、関係のないエンティティをスキャンせずに済み、検索パフォーマンスが大幅に向上します。</p><p>詳細については、「<a href="./use-partition-key#use-partition-key-isolation">Use パーティションキー Isolation</a>」を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>dynamicfield.enabled</code></p></td>
     <td><p>元々動的フィールド（dynamic field）を有効にしていなかったコレクションに対して、動的フィールドを有効化します。有効化後は、元のスキーマで定義されていないフィールドを持つエンティティを挿入できます。詳細については、「<a href="./enable-dynamic-field">Dynamic Field</a>」を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>allow_insert_auto_id</code></p></td>
     <td><p>コレクションで AutoID が有効になっている場合に、ユーザー提供の主キー値を受け入れるかどうかを指定します。</p><ul><li><p><strong>"true"</strong> に設定されている場合：挿入（insert）、アップサート（upsert）、一括インポート（bulk import）時に、ユーザー提供の主キーが存在すればそれを利用し、存在しない場合は自動生成された主キー値を使用します。</p></li><li><p><strong>"false"</strong> に設定されている場合：ユーザー提供の主キー値は拒否または無視され、常に自動生成された主キー値が使用されます。デフォルト値は <strong>"false"</strong> です。</p></li></ul></td>
   </tr>
   <tr>
     <td><p><code>timezone</code></p></td>
     <td><p>このコレクションにおけるタイムゾーン依存操作（特に <code>TIMESTAMPTZ</code> フィールドの処理）のデフォルトタイムゾーンを指定します。内部的にはタイムスタンプは UTC で保存され、Milvus はこの設定に従って表示や比較のために値を変換します。この設定が行われた場合、コレクションのタイムゾーンはデータベースのデフォルトタイムゾーンより優先されます。また、クエリ時のタイムゾーンパラメータにより、一時的に上記両方を上書きすることも可能です。値には有効な<a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones">IANA タイムゾーン識別子</a>（例：<strong>Asia/Shanghai</strong>、<strong>America/Chicago</strong>、<strong>UTC</strong>）を指定する必要があります。<code>TIMESTAMPTZ</code> フィールドの使用方法の詳細については、「<a href="./use-timestamptz-field">TIMESTAMPTZ Field</a>」を参照してください。</p></td>
   </tr>
</table>

### Example 1: Set collection TTL\{#example-1-set-collection-ttl}

以下のコードスニペットは、コレクションの TTL を設定する方法を示しています。

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

### 例 3: パーティションキーの有効化\{#example-3-enable-partition-key}

次のコードスニペットは、パーティションキーを有効にする方法を示しています。

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

### 例4: 動的フィールドの有効化\{#example-4-enable-dynamic-field}

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

### 例5: allow_insert_auto_idを有効化する\{#example-5-enable-allowinsertautoid}

`allow_insert_auto_id` プロパティを有効にすると、AutoIDが有効になっているコレクションに対して、insert、upsert、および一括インポート時にユーザーが主キー値を指定できるようになります。このプロパティを **"true"** に設定すると、Zilliz Cloudはユーザーが提供した主キー値が存在する場合はそれを利用し、存在しない場合は自動生成します。デフォルト値は **"false"** です。

以下の例では、`allow_insert_auto_id` を有効にする方法を示しています:

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

### 例6: コレクションのタイムゾーンを設定する\{#example-6-set-collection-time-zone}

`timezone` プロパティを使用して、コレクションのデフォルトタイムゾーンを設定できます。これにより、コレクション内のすべての操作（データ挿入、クエリ、結果表示など）において、時刻関連データの解釈および表示方法が決定されます。

`timezone` の値は、`Asia/Shanghai`、`America/Chicago`、`UTC` などの有効な [IANA タイムゾーン識別子](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) でなければなりません。無効または非標準の値を使用すると、コレクションプロパティの変更時にエラーが発生します。

以下の例では、コレクションのタイムゾーンを **Asia/Shanghai** に設定する方法を示しています：

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

以下のようにコレクションプロパティを削除することで、リセットすることもできます。

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

