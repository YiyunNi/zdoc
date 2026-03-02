---
title: "パーティションキーの使用 | Cloud"
slug: /use-partition-key
sidebar_label: "パーティションキーの使用"
beta: FALSE
notebook: FALSE
description: "パーティションキーは、パーティションに基づく検索最適化ソリューションです。特定のスカラフィールドをパーティションキーとして指定し、検索時にパーティションキーに基づくフィルタリング条件を指定することで、検索範囲をいくつかのパーティションに絞り込み、検索効率を向上させることができます。この記事では、パーティションキーの使用方法と関連する考慮事項について説明します。 | Cloud"
type: origin
token: QWqiwrgJViA5AJkv64VcgQX2nKd
sidebar_position: 17
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - データ
  - 検索最適化
  - パーティションキー
  - オープンソース ベクトルDB
  - ベクトルデータベースの例
  - rag ベクトルデータベース
  - ベクトルDBとは

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# パーティションキーを使用する

パーティションキーは、パーティションに基づく検索最適化ソリューションです。特定のスカラフィールドをパーティションキーとして指定し、検索時にパーティションキーに基づくフィルタリング条件を指定することで、検索範囲をいくつかのパーティションに絞り込み、検索効率を向上させることができます。この記事では、パーティションキーの使用方法と関連する考慮事項について説明します。

## 概要{#overview}

Zilliz Cloudでは、パーティションを使用してデータ分離を実装し、検索範囲を特定のパーティションに制限することで検索パフォーマンスを向上させることができます。パーティションを手動で管理することを選択した場合、コレクション内に最大1,024個のパーティションを作成し、特定のルールに基づいてこれらのパーティションにエンティティを挿入することで、特定の数のパーティション内での検索を制限して検索範囲を絞り込むことができます。

Zilliz Cloudは、データ分離でパーティションを再利用し、コレクション内に作成できるパーティション数の制限を克服するためにパーティションキーを導入しています。コレクションを作成する際、スカラフィールドをパーティションキーとして使用できます。コレクションの準備が整うと、Zilliz Cloudはコレクション内に指定された数のパーティションを作成します。挿入されたエンティティを受け取ると、Zilliz Cloudはエンティティのパーティションキー値を使用してハッシュ値を計算し、ハッシュ値とコレクションの`partitions_num`プロパティに基づいてモジュロ演算を実行してターゲットパーティションIDを取得し、エンティティをターゲットパーティションに保存します。

![IXXIwZdOYhRFXmbTMdwcaN6fnPe](https://zdoc-images.s3.us-west-2.amazonaws.com/IXXIwZdOYhRFXmbTMdwcaN6fnPe.png)

次の図は、パーティションキー機能が有効になっている場合と有効になっていない場合のコレクションでの検索リクエストをZilliz Cloudがどのように処理するかを示しています。

- パーティションキーが無効になっている場合、Zilliz Cloudはクエリベクトルに最も類似したエンティティをコレクション内で検索します。どのパーティションに最も関連性の高い結果が含まれているかを知っている場合は、検索範囲を絞り込むことができます。

- パーティションキーが有効になっている場合、Zilliz Cloudは検索フィルターで指定されたパーティションキー値に基づいて検索範囲を決定し、一致するパーティション内のエンティティのみをスキャンします。

![RTaqwdaWXhRWPTb4uJTc9Uknn5c](https://zdoc-images.s3.us-west-2.amazonaws.com/RTaqwdaWXhRWPTb4uJTc9Uknn5c.png)

## パーティションキーを使用する{#use-partition-key}

パーティションキーを使用するには、次の操作が必要です。

- [パーティションキーを設定する](./use-partition-key#set-partition-key)、

- [作成するパーティション数を設定する](./use-partition-key#set-partition-numbers) (オプション)、および

- [パーティションキーに基づいてフィルタリング条件を作成する](./use-partition-key#create-filtering-condition)。

### パーティションキーを設定する{#set-partition-key}

スカラフィールドをパーティションキーとして指定するには、スカラフィールドを追加する際に`is_partition_key`属性を`true`に設定する必要があります。

<Admonition type="info" icon="📘" title="Notes">

<p>スカラフィールドをパーティションキーとして設定する場合、フィールド値は空またはnullにすることはできません。</p>

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

<TabItem value='go'>

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

<TabItem value='javascript'>

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

<TabItem value='bash'>

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

### パーティション数を設定する{#set-partition-numbers}

コレクション内のスカラフィールドをパーティションキーとして指定すると、Zilliz Cloudはコレクション内に自動的に16個のパーティションを作成します。エンティティを受信すると、Zilliz Cloudはこのエンティティのパーティションキー値に基づいてパーティションを選択し、そのエンティティをパーティションに保存します。これにより、一部またはすべてのパーティションに異なるパーティションキー値を持つエンティティが保持されます。

コレクションとともに作成するパーティションの数を決定することもできます。これは、スカラフィールドがパーティションキーとして指定されている場合にのみ有効です。

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

<TabItem value='go'>

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

<TabItem value='javascript'>

```javascript
await client.create_collection({
    collection_name: "my_collection",
    schema: schema,
    num_partitions: 128
})
```

</TabItem>

<TabItem value='bash'>

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

### フィルタリング条件の作成{#create-filtering-condition}

Partition Key機能が有効なcollectionでANN検索を実行する場合、検索リクエストにPartition Keyを含むフィルタリング式を含める必要があります。フィルタリング式では、特定の範囲内でPartition Key値を制限することで、Zilliz Cloudは対応するpartition内の検索範囲を制限します。

削除操作を実行する際は、より効率的な削除を実現するために、単一のpartition keyを指定するフィルタ式を含めることをお勧めします。このアプローチにより、削除操作が特定のpartitionに限定され、コンパクション中の書き込み増幅が減少し、コンパクションとインデックス作成のためのリソースが節約されます。

以下の例は、特定のPartition Key値と一連のPartition Key値に基づいたPartition-Keyベースのフィルタリングを示しています。

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

<TabItem value='go'>

```go
// Filter based on a single partition key value, or
filter = "partition_key == 'x' && <other conditions>"

// Filter based on multiple partition key values
filter = "partition_key in ['x', 'y', 'z'] && <other conditions>"
```

</TabItem>

<TabItem value='javascript'>

```javascript
// Filter based on a single partition key value, or
const filter = 'partition_key == "x" && <other conditions>'

// Filter based on multiple partition key values
const filter = 'partition_key in ["x", "y", "z"] && <other conditions>'
```

</TabItem>

<TabItem value='bash'>

```bash
# Filter based on a single partition key value, or
export filter='partition_key == "x" && <other conditions>'

# Filter based on multiple partition key values
export filter='partition_key in ["x", "y", "z"] && <other conditions>'
```

</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Notes">

<p><code>partition_key</code> をパーティションキーとして指定されているフィールド名に置き換える必要があります。</p>

</Admonition>

## パーティションキー分離の使用法{#use-partition-key-isolation}

マルチテナンシーのシナリオでは、テナントIDに関連するスカラーフィールドをパーティションキーとして指定し、このスカラーフィールドの特定の値に基づいてフィルターを作成できます。同様のシナリオで検索パフォーマンスをさらに向上させるために、Zilliz Cloudはパーティションキー分離機能を提供します。

![BVotwv5BvhBWXXbvotUccowZnng](https://zdoc-images.s3.us-west-2.amazonaws.com/BVotwv5BvhBWXXbvotUccowZnng.png)

上記の図に示すように、Zilliz Cloudはパーティションキー値に基づいてエンティティをグループ化し、これらのグループごとに個別のインデックスを作成します。検索リクエストを受信すると、Zilliz Cloudはフィルタリング条件で指定されたパーティションキー値に基づいてインデックスを特定し、インデックスに含まれるエンティティ内の検索範囲を制限します。これにより、検索中に無関係なエンティティをスキャンすることを回避し、検索パフォーマンスを大幅に向上させます。

パーティションキー分離を有効にすると、Zilliz Cloudが一致するインデックスに含まれるエンティティ内の検索範囲を制限できるように、パーティションキーベースのフィルターに1つの特定の値のみを含める必要があります。

### パーティションキー分離の有効化{#enable-partition-key-isolation}

以下のコード例は、パーティションキー分離を有効にする方法を示しています。

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

<TabItem value='go'>

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

<TabItem value='javascript'>

```javascript
res = await client.alterCollection({
    collection_name: "my_collection",
    properties: {
        "partitionkey.isolation": true
    }
})
```

</TabItem>

<TabItem value='bash'>

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

パーティションキー分離を有効にした後も、[パーティション数の設定](./use-partition-key#set-partition-numbers)で説明されているように、パーティションキーとパーティション数を設定できます。パーティションキーベースのフィルターには、特定のパーティションキー値のみを含める必要があることに注意してください。