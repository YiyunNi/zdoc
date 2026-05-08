---
title: "コレクションのTTL設定 | BYOC"
slug: /set-collection-ttl
sidebar_key: set-collection-ttl
sidebar_label: "TTL"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、Time-to-Live（TTL）ポリシーを使用してエンティティを自動的に期限切れにすることができます。期限切れのエンティティは、クエリおよび検索結果に即座に表示されなくなり、次のコンパクションサイクルでストレージから物理的に削除されます — 通常24時間以内です。 | BYOC"
type: origin
token: GthGwnrpEiGpClkV5JXcgWUgn8c
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - collection ttl
  - time-to-live

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# コレクション TTL の設定

Zilliz Cloud は、**Time-to-Live (TTL)** ポリシーを通じてエンティティを自動的に期限切れにすることができます。期限切れのエンティティは、クエリおよび検索結果に即座に表示されなくなり、次のコンパクションサイクルでストレージから物理的に削除されます — 通常は24時間以内です。

TTL には2つのモードがあります。

- **コレクションレベル TTL** — すべてのエンティティで共有される1つの保持期間ウィンドウ。`collection.ttl.seconds` プロパティを通じて設定します。

- **エンティティレベル TTL** — 各エンティティが専用の `TIMESTAMPTZ` フィールドに独自の絶対有効期限を持ち、`ttl_field` プロパティを通じて TTL フィールドとして指定されます。

## 制限\{#limits}

- コレクションレベル TTL は、コレクション全体に1つのウィンドウを適用します。単一の行に異なる有効期間が必要な場合は、エンティティレベル TTL を使用してください。

- エンティティレベル TTL のフィールドは `TIMESTAMPTZ` である必要があります。他の型は拒否されます。

- コレクションあたり1つの TTL フィールドです。スキーマに複数の `TIMESTAMPTZ` フィールドを含めることはできますが、`ttl_field` で指定できるのは1つだけです。

- `ttl_field` を削除しても、期限切れのエンティティは復活しません。期限切れのエンティティを復元するには、`NULL` または将来の有効期限タイムスタンプでアップサートしてください。

## 概要\{#overview}

<details>

<summary>展開</summary>

### TTL を使用するタイミング\{#when-to-use-ttl}

TTL は、保持が**ポリシー**である場合に適切なツールです — 特定のエンティティが最終的に削除されるべきであることを事前に把握しており、クラスターに自動的に適用させたい場合に、cron ジョブを書く必要なく実現できます。

典型的なシナリオ:

- **時間枠付きデータセット。** ログ、メトリクス、イベント、または短命なフィーチャーキャッシュの最後の N 日間のみを保持します。

- **マルチテナントコレクション。** 異なるテナントが同じコレクション内で異なる保持期間を持ちます。

- **レコードごとの保持ポリシー。** IoT パイプライン、ドキュメントストア、または MLOps フィーチャーストアでのドキュメントごとの有効期間。

- **ホット/コールドデータの混在。** 短命なエンティティが、同じコレクション内の長期間のものと共存します。

- **コンプライアンス主導の有効期限。** GDPR スタイルのデータ最小化で、各レコードが独自の「削除期限日」を持ちます。

- **ビジネスタイムの有効期限。** エンティティが、ある絶対的な時点（キャンペーンの終了、セッションの期限切れなど）までのみ有効なレコードを表す場合。

<Admonition type="info" icon="📘" title="Notes">

<p>期限切れのエンティティは、検索またはクエリ結果に表示されません。ただし、次のデータコンパクションが実行されるまでストレージに残る可能性があり、これは次の24時間以内に実施される必要があります。</p>

</Admonition>

### TTL モード\{#ttl-modes}

2つのモードは、異なる保持に関する質問に答えます。

- **コレクションレベル TTL** は、すべてのエンティティに単一の保持期間を適用します。各エンティティは `insert_ts + ttl_seconds` で期限切れになります。

- **エンティティレベル TTL** は、各エンティティが `TIMESTAMPTZ` フィールドに独自の絶対有効期限を格納できるようにします。そのフィールドの `NULL` は、エンティティが期限切れにならないことを意味します。

コレクションは一度に**1つ**のモードのみを使用します — 2つは相互に排他的です。モード間の切り替えは複数ステップの操作です。2つのモード間の移行を参照してください。

モードの選択にはこのテーブルを使用してください。

<table>
   <tr>
     <th><p><strong>状況が次の場合…</strong></p></th>
     <th><p><strong>使用するもの</strong></p></th>
   </tr>
   <tr>
     <td><p>コレクション内のすべてのエンティティが同じ保持期間ウィンドウに従うべき場合</p></td>
     <td><p>コレクションレベル TTL</p></td>
   </tr>
   <tr>
     <td><p>保持が「挿入時点から N 秒間保持する」場合</p></td>
     <td><p>コレクションレベル TTL</p></td>
   </tr>
   <tr>
     <td><p>同じコレクション内で異なるエンティティに異なる有効期間が必要な場合（テナントごと、ホット/コールド、ドキュメントごと）</p></td>
     <td><p>エンティティレベル TTL</p></td>
   </tr>
   <tr>
     <td><p>保持が絶対的な壁時計時間の場合（例: 2027-01-01T00:00:00Z）</p></td>
     <td><p>エンティティレベル TTL</p></td>
   </tr>
   <tr>
     <td><p>保持が挿入タイムスタンプではなくビジネスタイムスタンプによって決まる場合</p></td>
     <td><p>エンティティレベル TTL</p></td>
   </tr>
   <tr>
     <td><p>挿入後にエンティティの有効期間を更新または延長したい場合</p></td>
     <td><p>エンティティレベル TTL</p></td>
   </tr>
   <tr>
     <td><p>一部のエンティティは期限切れにならず、他のエンティティは期限切れになるべき場合</p></td>
     <td><p>エンティティレベル TTL（期限切れにならないものには NULL を使用）</p></td>
   </tr>
</table>

</details>

## コレクションレベル TTL の設定\{#set-collection-level-ttl}

コレクション内のすべてのエンティティが同じ保持期間ウィンドウに従うべき場合に、コレクションレベル TTL を使用します。

### 新規コレクションでの有効化\{#enable-on-a-new-collection}

作成時に `properties` マップを通じて `collection.ttl.seconds`（整数、秒単位）を渡します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

schema = client.create_schema(auto_id=False, enable_dynamic_field=False)
schema.add_field("id", DataType.INT64, is_primary=True, auto_id=False)
schema.add_field("vector", DataType.FLOAT_VECTOR, dim=128)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name="vector", index_type="AUTOINDEX", metric_type="COSINE"
)

client.create_collection(
    collection_name="my_collection",
    schema=schema,
    index_params=index_params,
    # highlight-start
    properties={
        "collection.ttl.seconds": 1209600  # 14 days
    },
    # highlight-end
)
```

</TabItem>

<TabItem value='java'>

```java
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.DataType;
import io.milvus.v2.common.IndexParam;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .build());

CreateCollectionReq.CollectionSchema schema = CreateCollectionReq.CollectionSchema.builder().build();
schema.addField(AddFieldReq.builder().fieldName("id").dataType(DataType.Int64)
        .isPrimaryKey(true).autoID(false).build());
schema.addField(AddFieldReq.builder().fieldName("vector").dataType(DataType.FloatVector)
        .dimension(128).build());

IndexParam indexParam = IndexParam.builder().fieldName("vector")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.COSINE).build();

// highlight-start
Map<String, String> properties = new HashMap<>();
properties.put("collection.ttl.seconds", "1209600"); // 14 days

client.createCollection(CreateCollectionReq.builder()
        .collectionName("my_collection")
        .collectionSchema(schema)
        .indexParams(Collections.singletonList(indexParam))
        .properties(properties)
        .build());
// highlight-end
```

</TabItem>

<TabItem value='java'>

```javascript
const { MilvusClient, DataType } = require("@zilliz/milvus2-sdk-node");

const client = new MilvusClient({ address: "YOUR_CLUSTER_ENDPOINT" });

await client.createCollection({
  collection_name: "my_collection",
  fields: [
    { name: "id", data_type: DataType.Int64, is_primary_key: true, autoID: false },
    { name: "vector", data_type: DataType.FloatVector, dim: 128 },
  ],
  index_params: [
    { field_name: "vector", index_type: "AUTOINDEX", metric_type: "COSINE" },
  ],
  // highlight-start
  properties: {
    "collection.ttl.seconds": 1209600, // 14 days
  },
  // highlight-end
});
```

</TabItem>

<TabItem value='java'>

```go
err = client.CreateCollection(ctx, milvusclient.NewCreateCollectionOption("my_collection", schema).
    WithProperty(common.CollectionTTLConfigKey, 1209600)) //  TTL in seconds
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
export params='{
    "ttlSeconds": 1209600
}'

export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"my_collection\",
    \"schema\": $schema,
    \"params\": $params
}"
```

</TabItem>
</Tabs>

### 既存のコレクションで有効にする\{#enable-on-an-existing-collection}

`properties` マップに `collection.ttl.seconds` を指定して `alter_collection_properties` を呼び出すことで、すでに使用されているコレクションに TTL を適用できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

# Assumes "my_collection" was created earlier without TTL
schema = client.create_schema(auto_id=False, enable_dynamic_field=False)
schema.add_field("id", DataType.INT64, is_primary=True, auto_id=False)
schema.add_field("vector", DataType.FLOAT_VECTOR, dim=128)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name="vector", index_type="AUTOINDEX", metric_type="COSINE"
)

if not client.has_collection("my_collection"):
    client.create_collection(
        collection_name="my_collection",
        schema=schema,
        index_params=index_params,
    )

# highlight-start
client.alter_collection_properties(
    collection_name="my_collection",
    properties={"collection.ttl.seconds": 1209600},
)
# highlight-end
```

</TabItem>

<TabItem value='java'>

```java
import java.util.HashMap;
import java.util.Map;

import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.collection.request.AlterCollectionPropertiesReq;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .build());

// Assumes "my_collection" was created earlier without TTL.

// highlight-start
Map<String, String> properties = new HashMap<>();
properties.put("collection.ttl.seconds", "1209600");

client.alterCollectionProperties(AlterCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .properties(properties)
        .build());
// highlight-end
```

</TabItem>

<TabItem value='java'>

```javascript
const { MilvusClient } = require("@zilliz/milvus2-sdk-node");

const client = new MilvusClient({ address: "YOUR_CLUSTER_ENDPOINT" });

// Assumes "my_collection" was created earlier without TTL.
// highlight-start
await client.alterCollectionProperties({
  collection_name: "my_collection",
  properties: { "collection.ttl.seconds": 1209600 },
});
// highlight-end
```

</TabItem>

<TabItem value='java'>

```go
err = client.AlterCollectionProperties(ctx, milvusclient.NewAlterCollectionPropertiesOption("my_collection").
    WithProperty(common.CollectionTTLConfigKey, 60))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/alter_properties" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"my_collection\",
    \"properties\": {
        \"collection.ttl.seconds\": 1209600
    }
}"
```

</TabItem>
</Tabs>

### TTL 設定の削除\{#drop-the-ttl-setting}

コレクション内のデータを無期限に保持する場合は、そのコレクションから TTL 設定を単純に削除できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

# highlight-start
client.drop_collection_properties(
    collection_name="my_collection",
    property_keys=["collection.ttl.seconds"],
)
# highlight-end
```

</TabItem>

<TabItem value='java'>

```java
import java.util.Collections;

import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.collection.request.DropCollectionPropertiesReq;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .build());

// highlight-start
client.dropCollectionProperties(DropCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .propertyKeys(Collections.singletonList("collection.ttl.seconds"))
        .build());
// highlight-end
```

</TabItem>

<TabItem value='java'>

```javascript
const { MilvusClient } = require("@zilliz/milvus2-sdk-node");

const client = new MilvusClient({ address: "YOUR_CLUSTER_ENDPOINT" });

// highlight-start
await client.dropCollectionProperties({
  collection_name: "my_collection",
  properties: ["collection.ttl.seconds"],
});
// highlight-end
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
-d "{
    \"collectionName\": \"my_collection\",
    \"propertyKeys\": [
        \"collection.ttl.seconds\"
    ]
}"
```

</TabItem>
</Tabs>

## エンティティレベルの TTL の設定 | プライベートプレビュー\{#set-entity-level-ttl}

エンティティレベルの TTL を使用すると、各エンティティに固有の絶対有効期限を持たせることができます。この時間は、スキーマで宣言した専用の `TIMESTAMPTZ` 列に保存され、その列を `ttl_field` コレクションプロパティを通じて TTL フィールドとしてマークします。

### 新しいコレクションでの有効化\{#enable-on-a-new-collection}

作成時にエンティティレベルの TTL を有効にするには、同じ `create_collection` 呼び出し内で 2 つの追加が必要です。スキーマ内の `TIMESTAMPTZ` フィールドと、そのフィールドを指す `ttl_field` プロパティです。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

schema = client.create_schema(enable_dynamic_field=False)
schema.add_field("id", DataType.INT64, is_primary=True, auto_id=False)
# highlight-next-line
schema.add_field("expire_at", DataType.TIMESTAMPTZ, nullable=True)
schema.add_field("vector", DataType.FLOAT_VECTOR, dim=128)

index_params = client.prepare_index_params()
index_params.add_index(field_name="vector", index_type="AUTOINDEX",
                       metric_type="COSINE")

client.create_collection(
    collection_name="my_collection",
    schema=schema,
    index_params=index_params,
    # highlight-next-line
    properties={"ttl_field": "expire_at"},
)
```

</TabItem>

<TabItem value='java'>

```java
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.DataType;
import io.milvus.v2.common.IndexParam;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .build());

CreateCollectionReq.CollectionSchema schema = CreateCollectionReq.CollectionSchema.builder().build();
schema.addField(AddFieldReq.builder().fieldName("id").dataType(DataType.Int64)
        .isPrimaryKey(true).autoID(false).build());
// highlight-next-line
schema.addField(AddFieldReq.builder().fieldName("expire_at").dataType(DataType.Timestamptz)
        .isNullable(true).build());
schema.addField(AddFieldReq.builder().fieldName("vector").dataType(DataType.FloatVector)
        .dimension(128).build());

IndexParam indexParam = IndexParam.builder().fieldName("vector")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.COSINE).build();

// highlight-next-line
Map<String, String> properties = new HashMap<>();
// highlight-next-line
properties.put("ttl_field", "expire_at");

client.createCollection(CreateCollectionReq.builder()
        .collectionName("my_collection")
        .collectionSchema(schema)
        .indexParams(Collections.singletonList(indexParam))
        .properties(properties)
        .build());
```

</TabItem>

<TabItem value='java'>

```javascript
const { MilvusClient, DataType } = require("@zilliz/milvus2-sdk-node");

const client = new MilvusClient({ address: "YOUR_CLUSTER_ENDPOINT" });

await client.createCollection({
  collection_name: "my_collection",
  fields: [
    { name: "id", data_type: DataType.Int64, is_primary_key: true, autoID: false },
    // highlight-next-line
    { name: "expire_at", data_type: DataType.Timestamptz, nullable: true },
    { name: "vector", data_type: DataType.FloatVector, dim: 128 },
  ],
  index_params: [
    { field_name: "vector", index_type: "AUTOINDEX", metric_type: "COSINE" },
  ],
  // highlight-next-line
  properties: { ttl_field: "expire_at" },
});
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

コレクションが作成されたら、[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) タイムスタンプ文字列を使用してエンティティを挿入します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
import random
from pymilvus import MilvusClient

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

# Assumes "my_collection" was created earlier with \`ttl_field\`: "expire_at"
# highlight-start
rows = [
    # Never expires
    {"id": 1, "expire_at": None,
     "vector": [random.random() for _ in range(128)]},
    # Expires at 2026-12-31 UTC midnight
    {"id": 2, "expire_at": "2026-12-31T00:00:00Z",
     "vector": [random.random() for _ in range(128)]},
    # Shanghai local time — normalized to UTC internally
    {"id": 3, "expire_at": "2027-01-01T00:00:00+08:00",
     "vector": [random.random() for _ in range(128)]},
]

client.insert("my_collection", rows)
# highlight-end
```

</TabItem>

<TabItem value='java'>

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.google.gson.Gson;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;

import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.vector.request.InsertReq;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .build());

// Assumes "my_collection" was created earlier with \`ttl_field\`: "expire_at".
Gson gson = new Gson();
Random rng = new Random();

List<Float> vector = new ArrayList<>();
for (int i = 0; i < 128; i++) vector.add(rng.nextFloat());

// highlight-start
List<JsonObject> rows = new ArrayList<>();

// Never expires
JsonObject r1 = new JsonObject();
r1.addProperty("id", 1);
r1.add("expire_at", JsonNull.INSTANCE);
r1.add("vector", gson.toJsonTree(vector));
rows.add(r1);

// Expires at 2026-12-31 UTC midnight
JsonObject r2 = new JsonObject();
r2.addProperty("id", 2);
r2.addProperty("expire_at", "2026-12-31T00:00:00Z");
r2.add("vector", gson.toJsonTree(vector));
rows.add(r2);

// Shanghai local time — normalized to UTC internally
JsonObject r3 = new JsonObject();
r3.addProperty("id", 3);
r3.addProperty("expire_at", "2027-01-01T00:00:00+08:00");
r3.add("vector", gson.toJsonTree(vector));
rows.add(r3);

client.insert(InsertReq.builder()
        .collectionName("my_collection")
        .data(rows)
        .build());
// highlight-end
```

</TabItem>

<TabItem value='java'>

```javascript
const { MilvusClient } = require("@zilliz/milvus2-sdk-node");

const client = new MilvusClient({ address: "YOUR_CLUSTER_ENDPOINT" });

const vector = Array.from({ length: 128 }, () => Math.random());

// Assumes "my_collection" was created earlier with \`ttl_field\`: "expire_at".
// highlight-start
await client.insert({
  collection_name: "my_collection",
  data: [
    // Never expires
    { id: 1, expire_at: null, vector },
    // Expires at 2026-12-31 UTC midnight
    { id: 2, expire_at: "2026-12-31T00:00:00Z", vector },
    // Shanghai local time — normalized to UTC internally
    { id: 3, expire_at: "2027-01-01T00:00:00+08:00", vector },
  ],
});
// highlight-end
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

すべてのクエリおよびベクトル検索において、サーバーが自動的に TTL フィルターを注入します。ユーザー自身がフィルターを記述する必要はなく、有効期限が切れたエンティティは結果に表示されることはありません。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

client.load_collection("my_collection")

# highlight-start
# Expired rows are filtered out automatically
results = client.query(
    collection_name="my_collection",
    filter="id >= 0",
    output_fields=["id", "expire_at"],
    limit=10,
)
print(results)
# highlight-end
```

</TabItem>

<TabItem value='java'>

```java
import java.util.Arrays;

import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.collection.request.LoadCollectionReq;
import io.milvus.v2.service.vector.request.QueryReq;
import io.milvus.v2.service.vector.response.QueryResp;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .build());

client.loadCollection(LoadCollectionReq.builder()
        .collectionName("my_collection")
        .build());

// highlight-start
// Expired rows are filtered out automatically
QueryResp results = client.query(QueryReq.builder()
        .collectionName("my_collection")
        .filter("id >= 0")
        .outputFields(Arrays.asList("id", "expire_at"))
        .limit(10L)
        .build());
System.out.println(results.getQueryResults());
// highlight-end
```

</TabItem>

<TabItem value='java'>

```javascript
const { MilvusClient } = require("@zilliz/milvus2-sdk-node");

const client = new MilvusClient({ address: "YOUR_CLUSTER_ENDPOINT" });

await client.loadCollection({ collection_name: "my_collection" });

// highlight-start
// Expired rows are filtered out automatically
const results = await client.query({
  collection_name: "my_collection",
  filter: "id >= 0",
  output_fields: ["id", "expire_at"],
  limit: 10,
});
console.log(results.data);
// highlight-end
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

同じ自動フィルタリングは `client.search()` にも適用されます。

エンティティがコンパクションによって物理的に削除される前にその有効期限を延長するには、より遅い有効期限タイムスタンプ（または `None`）を使用して upsert を実行し、エンティティをクエリ可能なセットに戻します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
import random
from pymilvus import MilvusClient

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

# highlight-start
client.upsert("my_collection", [
    {"id": 2,
     "vector": [random.random() for _ in range(128)],
     "expire_at": "2028-01-01T00:00:00Z"},
])
# highlight-end
```

</TabItem>

<TabItem value='java'>

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.vector.request.UpsertReq;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .build());

Gson gson = new Gson();
Random rng = new Random();
List<Float> vector = new ArrayList<>();
for (int i = 0; i < 128; i++) vector.add(rng.nextFloat());

// highlight-start
JsonObject row = new JsonObject();
row.addProperty("id", 2);
row.add("vector", gson.toJsonTree(vector));
row.addProperty("expire_at", "2028-01-01T00:00:00Z");

client.upsert(UpsertReq.builder()
        .collectionName("my_collection")
        .data(Collections.singletonList(row))
        .build());
// highlight-end
```

</TabItem>

<TabItem value='java'>

```javascript
const { MilvusClient } = require("@zilliz/milvus2-sdk-node");

const client = new MilvusClient({ address: "YOUR_CLUSTER_ENDPOINT" });

const vector = Array.from({ length: 128 }, () => Math.random());

// highlight-start
await client.upsert({
  collection_name: "my_collection",
  data: [
    { id: 2, vector, expire_at: "2028-01-01T00:00:00Z" },
  ],
});
// highlight-end
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

### 既存のコレクションで有効にする\{#enable-on-an-existing-collection}

コレクションが既に存在し、`collection.ttl.seconds` が設定されていない場合、`add_collection_field` を使用して `TIMESTAMPTZ` カラムを追加し、その後 `alter_collection_properties` を使用してそれを TTL フィールドとしてマークします。オプションで、履歴行をアップサートして期限切れタイムスタンプをバックフィルできます。バックフィルしない行は `NULL` のままとなり、期限切れになりません。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
import random
from pymilvus import MilvusClient, DataType

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

# highlight-start
# Step 1 — add a TIMESTAMPTZ column to the schema
client.add_collection_field(
    collection_name="my_collection",
    field_name="expire_at",
    data_type=DataType.TIMESTAMPTZ,
    nullable=True,
)

# Step 2 — mark the new column as the TTL field
client.alter_collection_properties(
    collection_name="my_collection",
    properties={"ttl_field": "expire_at"},
)

# Step 3 (optional) — backfill expiration timestamps for historical rows
client.upsert("my_collection", [
    {"id": 1,
     "vector": [random.random() for _ in range(128)],
     "expire_at": "2026-12-31T00:00:00Z"},
])
# highlight-end
```

</TabItem>

<TabItem value='java'>

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.DataType;
import io.milvus.v2.service.collection.request.AddCollectionFieldReq;
import io.milvus.v2.service.collection.request.AlterCollectionPropertiesReq;
import io.milvus.v2.service.vector.request.UpsertReq;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .build());

// highlight-start
// Step 1 — add a TIMESTAMPTZ column to the schema
client.addCollectionField(AddCollectionFieldReq.builder()
        .collectionName("my_collection")
        .fieldName("expire_at")
        .dataType(DataType.Timestamptz)
        .isNullable(true)
        .build());

// Step 2 — mark the new column as the TTL field
Map<String, String> properties = new HashMap<>();
properties.put("ttl_field", "expire_at");
client.alterCollectionProperties(AlterCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .properties(properties)
        .build());

// Step 3 (optional) — backfill expiration timestamps for historical rows
Gson gson = new Gson();
Random rng = new Random();
List<Float> vector = new ArrayList<>();
for (int i = 0; i < 128; i++) vector.add(rng.nextFloat());

JsonObject row = new JsonObject();
row.addProperty("id", 1);
row.add("vector", gson.toJsonTree(vector));
row.addProperty("expire_at", "2026-12-31T00:00:00Z");

client.upsert(UpsertReq.builder()
        .collectionName("my_collection")
        .data(Collections.singletonList(row))
        .build());
// highlight-end
```

</TabItem>

<TabItem value='java'>

```javascript
const { MilvusClient, DataType } = require("@zilliz/milvus2-sdk-node");

const client = new MilvusClient({ address: "YOUR_CLUSTER_ENDPOINT" });

const vector = Array.from({ length: 128 }, () => Math.random());

// highlight-start
// Step 1 — add a TIMESTAMPTZ column to the schema
await client.addCollectionField({
  collection_name: "my_collection",
  field: { name: "expire_at", data_type: DataType.Timestamptz, nullable: true },
});

// Step 2 — mark the new column as the TTL field
await client.alterCollectionProperties({
  collection_name: "my_collection",
  properties: { ttl_field: "expire_at" },
});

// Step 3 (optional) — backfill expiration timestamps for historical rows
await client.upsert({
  collection_name: "my_collection",
  data: [
    { id: 1, vector, expire_at: "2026-12-31T00:00:00Z" },
  ],
});
// highlight-end
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

### TTL 設定の削除\{#drop-the-ttl-setting}

`property_keys` に `ttl_field` を含めて `drop_collection_properties` を呼び出すと、エンティティごとの有効期限が停止します。`TIMESTAMPTZ` カラム自体はスキーマに残ったままとなり、通常のフィールドとして引き続きクエリを実行できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

# highlight-start
client.drop_collection_properties(
    collection_name="my_collection",
    property_keys=["ttl_field"],
)
# highlight-end
```

</TabItem>

<TabItem value='java'>

```java
import java.util.Collections;

import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.collection.request.DropCollectionPropertiesReq;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .build());

// highlight-start
client.dropCollectionProperties(DropCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .propertyKeys(Collections.singletonList("ttl_field"))
        .build());
// highlight-end
```

</TabItem>

<TabItem value='java'>

```javascript
const { MilvusClient } = require("@zilliz/milvus2-sdk-node");

const client = new MilvusClient({ address: "YOUR_CLUSTER_ENDPOINT" });

// highlight-start
await client.dropCollectionProperties({
  collection_name: "my_collection",
  properties: ["ttl_field"],
});
// highlight-end
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

`ttl_field` を削除すると、今後のクエリに対する自動フィルタが無効になりますが、すでに期限切れとなったエンティティが自動的に再表示されることはありません。以前に期限切れとなったエンティティを可視化するには、`None` または将来の有効期限タイムスタンプを指定して upsert してください — これが同じロードセッション内で期限切れの行へのアクセスを復元する唯一の方法です。

## FAQs\{#faqs}

### TTL設定によりデータはいつ期限切れになりますか？\{#when-does-data-expire-due-to-ttl-settings}

現在、データは挿入または upsert された時点に基づいて期限切れになります。期限切れのデータは検索結果に表示されません。詳細については、[例](./set-collection-ttl) を参照してください。

### 期限切れのデータはいつ物理的に削除されますか？\{#when-will-the-expired-data-be-physically-deleted}

データが期限切れになると、検索結果に含まれなくなります。ただし、物理的な削除は、クラスターのコンパクションポリシーに従って、後続のシステムコンパクションが実行された後にのみ行われます。

期限切れ直後にデータを削除する必要がある場合は、[お問い合わせ](https://support.zilliz.com/hc/en-us/requests/new) ください。

### CU容量はいつ減少しますか？\{#when-will-the-cu-capacity-decrease}

クラスターの CU容量 は、メモリ使用量とストレージ使用量のいずれか大きい方となります。ストレージ使用量が適用される場合、期限切れのデータが物理的に削除された後、Zilliz Cloud コンソールで CU容量 の減少を確認できます。

