---
title: "ベクトルフィールドのインデックス作成 | BYOC"
slug: /index-vector-fields
sidebar_label: "ベクトルフィールドのインデックス作成"
beta: FALSE
notebook: FALSE
description: "このガイドでは、コレクション内のベクトルフィールドにインデックスを作成し、管理するための基本的な操作について説明します。 | BYOC"
type: origin
token: Qc0SwFomWiEXvMkDAH9cMAhlnIh
sidebar_position: 1
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - ベクトルフィールド
  - インデックス
  - ベクトル検索
  - knnアルゴリズム
  - HNSW
  - 非構造化データとは

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ベクトルフィールドのインデックス

このガイドでは、コレクション内のベクトルフィールドに対するインデックスの作成と管理に関する基本的な操作について説明します。

## 概要{#overview}

インデックスファイルに保存されたメタデータを活用することで、Zilliz Cloudはデータを特殊な構造で整理し、検索やクエリ中に要求された情報を迅速に取得できるようにします。

Zilliz Cloudは、効率的な類似性検索を可能にするために[AUTOINDEX](./autoindex-explained)を採用しています。また、ベクトル埋め込み間の距離を測定するために、**コサイン類似度** (COSINE)、**ユークリッド距離** (L2)、**内積** (IP)、**JACCARD**、**HAMMING** の[メトリックタイプ](./search-metrics-explained)も提供しています。ベクトルフィールドのタイプとメトリックの詳細については、[メトリックタイプ](./search-metrics-explained)と[スキーマの説明](./schema-explained)を参照してください。

頻繁にアクセスされるベクトルフィールドとスカラーフィールドの両方にインデックスを作成することをお勧めします。コレクションに複数のベクトルフィールドが含まれている場合は、各ベクトルフィールドに個別にインデックスを作成できます。

## 準備{#preparations}

[コレクションの作成](./manage-collections-sdks)で説明したように、Zilliz Cloudは、コレクション作成リクエストで次のいずれかの条件が指定されている場合、コレクションの作成時にインデックスを自動的に生成し、メモリにロードします。

- ベクトルフィールドの次元とメトリックタイプ、または

- スキーマとインデックスパラメータ。

以下のコードスニペットは、Zilliz Cloudへの接続を確立し、インデックスパラメータを指定せずにコレクションを作成するために既存のコードを再利用しています。この場合、コレクションにはインデックスがなく、アンロードされたままになります。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

CLUSTER_ENDPOINT = "YOUR_CLUSTER_ENDPOINT"
TOKEN = "YOUR_CLUSTER_TOKEN"

# 1. Set up a Milvus client
client = MilvusClient(
    uri=CLUSTER_ENDPOINT,
    token=TOKEN 
)

# 2. Create schema
# 2.1. Create schema
schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=True,
)

# 2.2. Add fields to schema
schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
# The dim value should be an integer greater than 1
schema.add_field(field_name="vector", datatype=DataType.FLOAT_VECTOR, dim=5)

# 3. Create collection
client.create_collection(
    collection_name="customized_setup", 
    schema=schema, 
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.DataType;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

String CLUSTER_ENDPOINT = "YOUR_CLUSTER_ENDPOINT";
String TOKEN = "YOUR_TOKEN";

// 1. Connect to Milvus server
ConnectConfig connectConfig = ConnectConfig.builder()
    .uri(CLUSTER_ENDPOINT)
    .token(TOKEN)
    .build();

MilvusClientV2 client = new MilvusClientV2(connectConfig);

// 2. Create a collection

// 2.1 Create schema
CreateCollectionReq.CollectionSchema schema = client.createSchema();

// 2.2 Add fields to schema
schema.addField(AddFieldReq.builder().fieldName("id").dataType(DataType.Int64).isPrimaryKey(true).autoID(false).build());
// The dimension value should be an integer greater than 1.
schema.addField(AddFieldReq.builder().fieldName("vector").dataType(DataType.FloatVector).dimension(5).build());

// 3 Create a collection without schema and index parameters
CreateCollectionReq customizedSetupReq = CreateCollectionReq.builder()
.collectionName("customized_setup")
.collectionSchema(schema)
.build();

client.createCollection(customizedSetupReq);
```

</TabItem>

<TabItem value='javascript'>

```javascript
// 1. Set up a Milvus Client
client = new MilvusClient({address, token});

// 2. Define fields for the collection
const fields = [
    {
        name: "id",
        data_type: DataType.Int64,
        is_primary_key: true,
        auto_id: false
    },
    {
        name: "vector",
        data_type: DataType.FloatVector,
        dim: 5 // The dim value should be greater than 1.
    },
]

// 3. Create a collection
res = await client.createCollection({
    collection_name: "customized_setup",
    fields: fields,
})

console.log(res.error_code)  

// Output
// 
// Success
// 
```

</TabItem>
</Tabs>

## コレクションのインデックス作成{#index-a-collection}

コレクションのインデックスを作成するには、インデックスパラメータを設定し、`create_index()`を呼び出す必要があります。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"}]}>
<TabItem value='python'>

```python
# 4. Set up index
# 4.1. Set up the index parameters
index_params = MilvusClient.prepare_index_params()

# 4.2. Add an index on the vector field.
index_params.add_index(
    field_name="vector",
    metric_type="COSINE",
    index_type="AUTOINDEX",
    index_name="vector_index"
)

# 4.4. Create an index file
client.create_index(
    collection_name="customized_setup",
    index_params=index_params
)

# 5. Describe index
res = client.list_indexes(
    collection_name="customized_setup"
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.IndexParam;
import io.milvus.v2.service.index.request.CreateIndexReq;

// 4 Prepare index parameters

// 4.2 Add an index for the vector field "vector"
IndexParam indexParamForVectorField = IndexParam.builder()
    .fieldName("vector")
    .indexName("vector_index")
    .indexType(IndexParam.IndexType.AUTOINDEX)
    .metricType(IndexParam.MetricType.COSINE)
    .build();

List<IndexParam> indexParams = new ArrayList<>();
indexParams.add(indexParamForVectorField);

// 4.3 Crate an index file
CreateIndexReq createIndexReq = CreateIndexReq.builder()
    .collectionName("customized_setup")
    .indexParams(indexParams)
    .build();

client.createIndex(createIndexReq);
```

</TabItem>

<TabItem value='javascript'>

```javascript
// 4. Set up index for the collection
// 4.1. Set up the index parameters
res = await client.createIndex({
    collection_name: "customized_setup",
    field_name: "vector",
    index_type: "AUTOINDEX",
    metric_type: "COSINE",   
    index_name: "vector_index"
})

console.log(res.error_code)

// Output
// 
// Success
// 
```

</TabItem>
</Tabs>

上記のコードスニペットでは、インデックスタイプを`AUTOINDEX`、メトリックタイプを`COSINE`に設定してベクトルフィールドにインデックスを確立しました。さらに、インデックスタイプを`AUTOINDEX`に設定してスカラフィールドにインデックスを作成しました。インデックスタイプとメトリックタイプについて詳しく知るには、[AUTOINDEX Explained](./autoindex-explained)と[Metric Types](./search-metrics-explained)をお読みください。

<Admonition type="info" icon="📘" title="Notes">

<p>現在、コレクション内の各フィールドに対して1つのインデックスファイルのみを作成できます。</p>

</Admonition>

## インデックスの詳細を確認する{#check-index-details}

インデックスを作成したら、その詳細を確認できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"}]}>
<TabItem value='python'>

```python
# 5. Describe index
res = client.list_indexes(
    collection_name="customized_setup"
)

print(res)

# Output
#
# [
#     "vector_index"
# ]

res = client.describe_index(
    collection_name="customized_setup",
    index_name="vector_index"
)

print(res)

# Output
#
# {
#     "index_type": "AUTOINDEX",
#     "metric_type": "COSINE",
#     "field_name": "vector",
#     "index_name": "vector_index"
# }
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.index.request.DescribeIndexReq;
import io.milvus.v2.service.index.response.DescribeIndexResp;

// 5. Describe index
// 5.1 List the index names
ListIndexesReq listIndexesReq = ListIndexesReq.builder()
    .collectionName("customized_setup")
    .build();

List<String> indexNames = client.listIndexes(listIndexesReq);

System.out.println(indexNames);

// Output:
// [
//     "vector_index"
// ]

// 5.2 Describe an index
DescribeIndexReq describeIndexReq = DescribeIndexReq.builder()
    .collectionName("customized_setup")
    .indexName("vector_index")
    .build();

DescribeIndexResp describeIndexResp = client.describeIndex(describeIndexReq);

System.out.println(JSONObject.toJSON(describeIndexResp));

// Output:
// {
//     "metricType": "COSINE",
//     "indexType": "AUTOINDEX",
//     "fieldName": "vector",
//     "indexName": "vector_index"
// }
```

</TabItem>

<TabItem value='javascript'>

```javascript
// 5. Describe the index
res = await client.describeIndex({
    collection_name: "customized_setup",
    index_name: "vector_index"
})

console.log(JSON.stringify(res.index_descriptions, null, 2))

// Output
// 
// [
//   {
//     "params": [
//       {
//         "key": "index_type",
//         "value": "AUTOINDEX"
//       },
//       {
//         "key": "metric_type",
//         "value": "COSINE"
//       }
//     ],
//     "index_name": "vector_index",
//     "indexID": "449007919953063141",
//     "field_name": "vector",
//     "indexed_rows": "0",
//     "total_rows": "0",
//     "state": "Finished",
//     "index_state_fail_reason": "",
//     "pending_index_rows": "0"
//   }
// ]
// 
```

</TabItem>
</Tabs>

特定のフィールドに作成されたインデックスファイルを確認し、このインデックスファイルを使用してインデックス付けされた行数の統計を収集できます。

## インデックスを削除する{#drop-an-index}

不要になったインデックスは、簡単に削除できます。

<Admonition type="info" icon="📘" title="Notes">

<p>インデックスを削除する前に、まずリリースされていることを確認してください。</p>

</Admonition>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"}]}>
<TabItem value='python'>

```python
# 6. Drop index
client.drop_index(
    collection_name="customized_setup",
    index_name="vector_index"
)
```

</TabItem>

<TabItem value='java'>

```java
// 6. Drop index

DropIndexReq dropIndexReq = DropIndexReq.builder()
    .collectionName("customized_setup")
    .indexName("vector_index")
    .build();

client.dropIndex(dropIndexReq);
```

</TabItem>

<TabItem value='javascript'>

```javascript
// 6. Drop the index
res = await client.dropIndex({
    collection_name: "customized_setup",
    index_name: "vector_index"
})

console.log(res.error_code)

// Output
// 
// Success
// 
```

</TabItem>
</Tabs>

## 高度な機能{#advanced-features}

ベクトルインデックスに関する高度な機能もいくつかあります。



import DocCardList from '@theme/DocCardList';

<DocCardList />