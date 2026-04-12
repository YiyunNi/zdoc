---
title: "パーティションキーの使用 | BYOC"
slug: /use-partition-key
sidebar_label: "パーティションキー"
beta: FALSE
notebook: FALSE
description: "パーティションキーは、パーティションに基づく検索最適化ソリューションです。特定のスカラフィールドをパーティションキーとして指定し、検索時にパーティションキーに基づいてフィルタリング条件を設定することで、検索範囲をいくつかのパーティションに絞り込み、検索効率を向上させることができます。この記事では、パーティションキーの使用方法と関連する考慮事項について紹介します。 | BYOC"
type: origin
token: QWqiwrgJViA5AJkv64VcgQX2nKd
sidebar_position: 18
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - data
  - 検索最適化
  - パーティションキー

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# パーティションキーの使用

パーティションキーは、パーティションに基づく検索最適化ソリューションです。特定のスカラー フィールドをパーティションキーとして指定し、検索時にパーティションキーに基づくフィルタリング条件を設定することで、検索範囲をいくつかのパーティションに絞り込むことができ、検索効率が向上します。この記事では、パーティションキーの使用方法と関連する注意点を紹介します。

## 概要\{#overview}

Zilliz Cloud では、パーティションを使用してデータを分離し、検索範囲を特定のパーティションに限定することで検索パフォーマンスを向上させることができます。パーティションを手動で管理する場合、コレクション内に最大 1,024 個のパーティションを作成でき、特定のルールに基づいてエンティティをこれらのパーティションに挿入することで、特定のパーティション内でのみ検索を行うことで検索範囲を絞り込むことができます。

Zilliz Cloud では、コレクション内で作成可能なパーティション数の制限を克服するために、データ分離におけるパーティションの再利用を可能にする「パーティションキー」を導入しています。コレクション作成時に、スカラー フィールドをパーティションキーとして指定できます。コレクションの準備が完了すると、Zilliz Cloud はコレクション内に指定された数のパーティションを自動的に作成します。エンティティの挿入を受信すると、Zilliz Cloud はそのエンティティのパーティションキー値からハッシュ値を計算し、そのハッシュ値とコレクションの `partitions_num` プロパティに基づいて剰余演算（modulo）を実行して対象パーティション ID を取得し、そのエンティティを対象パーティションに格納します。

![IXXIwZdOYhRFXmbTMdwcaN6fnPe](https://zdoc-images.s3.us-west-2.amazonaws.com/IXXIwZdOYhRFXmbTMdwcaN6fnPe.png)

以下の図は、パーティションキー機能を有効にした場合と無効にした場合で、Zilliz Cloud がコレクション内の検索リクエストをどのように処理するかを示しています。

- パーティションキーが無効の場合、Zilliz Cloud はコレクション内でクエリベクトルに最も類似するエンティティを検索します。どのパーティションに最も関連性の高い結果が含まれているかが事前に分かっている場合は、検索範囲を絞り込むことができます。

- パーティションキーが有効の場合、Zilliz Cloud は検索フィルターで指定されたパーティションキーの値に基づいて検索範囲を決定し、一致するパーティション内のエンティティのみをスキャンします。

![RTaqwdaWXhRWPTb4uJTc9Uknn5c](https://zdoc-images.s3.us-west-2.amazonaws.com/RTaqwdaWXhRWPTb4uJTc9Uknn5c.png)

## パーティションキーの使用\{#use-partition-key}

パーティションキーを使用するには、以下の操作が必要です。

- [パーティションキーの設定](./use-partition-key#set-partition-key)、

- [作成するパーティション数の設定](./use-partition-key#set-partition-numbers)（オプション）、および

- [パーティションキーに基づくフィルタリング条件の作成](./use-partition-key#create-filtering-condition)。

### パーティションキーの設定\{#set-partition-key}

スカラー フィールドをパーティションキーとして指定するには、スカラー フィールドを追加する際にその `is_partition_key` 属性を `true` に設定する必要があります。

<Admonition type="info" icon="📘" title="Notes">

<p>スカラー フィールドをパーティションキーとして設定する場合、フィールド値を空または null にすることはできません。</p>

</Admonition>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import (
    MilvusClient, DataType
)

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

schema = client.create_schema()

schema.add_field(field_name="id",
    datatype=DataType.INT64,
    is_primary=True)
    
schema.add_field(field_name="vector",
    datatype=DataType.FLOAT_VECTOR,
    dim=5)

# Add the partition key
schema.add_field(
    field_name="my_varchar", 
    datatype=DataType.VARCHAR, 
    max_length=512,
    # highlight-next-line
    is_partition_key=True,
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.DataType;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .token("YOUR_CLUSTER_TOKEN")
        .build());

// Create schema
CreateCollectionReq.CollectionSchema schema = client.createSchema();

schema.addField(AddFieldReq.builder()
        .fieldName("id")
        .dataType(DataType.Int64)
        .isPrimaryKey(true)
        .build());

schema.addField(AddFieldReq.builder()
        .fieldName("vector")
        .dataType(DataType.FloatVector)
        .dimension(5)
        .build());
        
// Add the partition key
schema.addField(AddFieldReq.builder()
        .fieldName("my_varchar")
        .dataType(DataType.VarChar)
        .maxLength(512)
        // highlight-next-line
        .isPartitionKey(true)
        .build());
```

</TabItem>

<TabItem value='java'>

```go
import (
    "context"
    "fmt"

    "github.com/milvus-io/milvus/client/v2/column"
    "github.com/milvus-io/milvus/client/v2/entity"
    "github.com/milvus-io/milvus/client/v2/index"
    "github.com/milvus-io/milvus/client/v2/milvusclient"
)

ctx, cancel := context.WithCancel(context.Background())
defer cancel()

milvusAddr := "YOUR_CLUSTER_ENDPOINT"
client, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
    Address: milvusAddr,
})
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
defer client.Close(ctx)

schema := entity.NewSchema().WithDynamicFieldEnabled(false)
schema.WithField(entity.NewField().
    WithName("id").
    WithDataType(entity.FieldTypeInt64).
    WithIsPrimaryKey(true),
).WithField(entity.NewField().
    WithName("my_varchar").
    WithDataType(entity.FieldTypeVarChar).
    WithIsPartitionKey(true).
    WithMaxLength(512),
).WithField(entity.NewField().
    WithName("vector").
    WithDataType(entity.FieldTypeFloatVector).
    WithDim(5),
)
```

</TabItem>

<TabItem value='java'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const address = "YOUR_CLUSTER_ENDPOINT";
const token = "YOUR_CLUSTER_TOKEN";
const client = new MilvusClient({address, token});

// 3. Create a collection in customized setup mode
// 3.1 Define fields
const fields = [
  {
    name: 'id',
    data_type: DataType.Int64,
    is_primary_key: true,
  },
  {
    name: 'vector',
    data_type: DataType.FloatVector,
    dim: 5,
  },
  {
    name: 'my_varchar',
    data_type: DataType.VarChar,
    max_length: 512,
    // highlight-next-line
    is_partition_key: true,
  },
];
```

</TabItem>

<TabItem value='java'>

```bash
export schema='{
        "autoId": true,
        "enabledDynamicField": false,
        "fields": [
            {
                "fieldName": "id",
                "dataType": "Int64",
                "isPrimary": true
            },
            {
                "fieldName": "vector",
                "dataType": "FloatVector",
                "elementTypeParams": {
                    "dim": "5"
                }
            },
            {
                "fieldName": "my_varchar",
                "dataType": "VarChar",
                "isPartitionKey": true,
                "elementTypeParams": {
                    "max_length": 512
                }
            }
        ]
    }'
```

</TabItem>
</Tabs>

### Set Partition Numbers\{#set-partition-numbers}

コレクション内のスカラー フィールドをパーティションキーとして指定すると、Zilliz Cloud はそのコレクション内に自動的に 16 個のパーティションを作成します。エンティティを受信すると、Zilliz Cloud はそのエンティティのパーティションキー値に基づいてパーティションを選び、そのパーティション内にエンティティを格納します。この結果、一部またはすべてのパーティションが異なるパーティションキー値を持つエンティティを保持することになります。

コレクション作成時にパーティション数を自分で決定することもできます。ただし、これはスカラー フィールドがパーティションキーとして指定されている場合にのみ有効です。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.create_collection(
    collection_name="my_collection",
    schema=schema,
    # highlight-next-line
    num_partitions=128
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.collection.request.CreateCollectionReq;

CreateCollectionReq createCollectionReq = CreateCollectionReq.builder()
                .collectionName("my_collection")
                .collectionSchema(schema)
                .numPartitions(128)
                .build();
        client.createCollection(createCollectionReq);
```

</TabItem>

<TabItem value='java'>

```go
err = client.CreateCollection(ctx,
    milvusclient.NewCreateCollectionOption("my_collection", schema).
        WithNumPartitions(128))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```javascript
await client.create_collection({
    collection_name: "my_collection",
    schema: schema,
    num_partitions: 128
})
```

</TabItem>

<TabItem value='java'>

```bash
export params='{
    "partitionsNum": 128
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

### フィルタリング条件の作成\{#create-filtering-condition}

パーティションキー機能が有効化されたコレクションでANN検索を実行する際には、検索リクエストにパーティションキーを含むフィルタリング式を指定する必要があります。このフィルタリング式では、パーティションキーの値を特定の範囲内に限定することで、Zilliz Cloudが対応するパーティション内でのみ検索を実行します。

削除操作を実行する際には、単一のパーティションキーを指定するフィルター式を含めることを推奨します。これにより、削除操作が特定のパーティションに限定され、コンパクション時のライトアンプリフィケーションが軽減され、コンパクションおよびインデックス作成のためのリソースを節約できます。

以下の例では、特定のパーティションキー値および複数のパーティションキー値に基づくフィルタリングを示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Filter based on a single partition key value, or
filter='partition_key == "x" && <other conditions>'

# Filter based on multiple partition key values
filter='partition_key in ["x", "y", "z"] && <other conditions>'
```

</TabItem>

<TabItem value='java'>

```java
// Filter based on a single partition key value, or
String filter = "partition_key == 'x' && <other conditions>";

// Filter based on multiple partition key values
String filter = "partition_key in ['x', 'y', 'z'] && <other conditions>";
```

</TabItem>

<TabItem value='java'>

```go
// Filter based on a single partition key value, or
filter = "partition_key == 'x' && <other conditions>"

// Filter based on multiple partition key values
filter = "partition_key in ['x', 'y', 'z'] && <other conditions>"
```

</TabItem>

<TabItem value='java'>

```javascript
// Filter based on a single partition key value, or
const filter = 'partition_key == "x" && <other conditions>'

// Filter based on multiple partition key values
const filter = 'partition_key in ["x", "y", "z"] && <other conditions>'
```

</TabItem>

<TabItem value='java'>

```bash
# Filter based on a single partition key value, or
export filter='partition_key == "x" && <other conditions>'

# Filter based on multiple partition key values
export filter='partition_key in ["x", "y", "z"] && <other conditions>'
```

</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Notes">

<p><code>partition_key</code> は、パーティションキーとして指定されたフィールドの名前に置き換える必要があります。</p>

</Admonition>

## Use パーティションキー Isolation\{#use-partition-key-isolation}

マルチテナントシナリオでは、テナント識別子に関連するスカラー型フィールドをパーティションキーとして指定し、このスカラー型フィールド内の特定の値に基づくフィルターを作成できます。同様のシナリオにおいて検索パフォーマンスをさらに向上させるため、Zilliz Cloud は パーティションキー Isolation（パーティションキー分離）機能を導入しています。

![BVotwv5BvhBWXXbvotUccowZnng](https://zdoc-images.s3.us-west-2.amazonaws.com/BVotwv5BvhBWXXbvotUccowZnng.png)

上図に示すように、Zilliz Cloud はパーティションキーの値に基づいてエンティティをグループ化し、各グループごとに個別のインデックスを作成します。検索リクエストを受信すると、Zilliz Cloud はフィルタリング条件で指定されたパーティションキーの値に基づいて対応するインデックスを特定し、そのインデックスに含まれるエンティティ内でのみ検索範囲を限定します。これにより、検索時に無関係なエンティティをスキャンすることを回避し、検索パフォーマンスを大幅に向上させます。

パーティションキー Isolation を有効にした場合、パーティションキーに基づくフィルターには必ず1つの特定の値のみを含める必要があります。そうすることで、Zilliz Cloud は一致するインデックスに含まれるエンティティ内でのみ検索範囲を限定できます。

### Enable パーティションキー Isolation\{#enable-partition-key-isolation}

以下のコード例は、パーティションキー Isolation を有効にする方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.create_collection(
    collection_name="my_collection",
    schema=schema,
    # highlight-next-line
    properties={"partitionkey.isolation": True}
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.collection.request.CreateCollectionReq;

Map<String, String> properties = new HashMap<>();
properties.put("partitionkey.isolation", "true");

CreateCollectionReq createCollectionReq = CreateCollectionReq.builder()
        .collectionName("my_collection")
        .collectionSchema(schema)
        .properties(properties)
        .build();
client.createCollection(createCollectionReq);
```

</TabItem>

<TabItem value='java'>

```go
err = client.CreateCollection(ctx,
    milvusclient.NewCreateCollectionOption("my_collection", schema).
        WithProperty("partitionkey.isolation", true))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```javascript
res = await client.alterCollection({
    collection_name: "my_collection",
    properties: {
        "partitionkey.isolation": true
    }
})
```

</TabItem>

<TabItem value='java'>

```bash
export params='{
    "partitionKeyIsolation": true
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

パーティションキー分離を有効にした後でも、[パーティション数の設定](./use-partition-key#set-partition-numbers)で説明されているように、パーティションキーとパーティション数を設定できます。ただし、パーティションキーに基づくフィルターには、特定のパーティションキー値を1つだけ含める必要があります。