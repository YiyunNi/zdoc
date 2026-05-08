---
title: "配列フィールド | BYOC"
slug: /use-array-fields
sidebar_key: use-array-fields
sidebar_label: "配列"
beta: FALSE
notebook: FALSE
description: "ARRAY フィールドは、同じデータ型の要素の順序付きセットを保存します。 | BYOC"
type: origin
token: N0RmwUtmqinQvokWdYLc3yV5nJh
sidebar_position: 9
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - スキーマ
  - 配列フィールド

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 配列 Field

ARRAYフィールドは、同じデータ型の要素の順序付きセットを格納します。

以下は、ARRAYフィールドがデータを格納する方法の例です。

```json
{
  "tags": ["pop", "rock", "classic"],
  "ratings": [5, 4, 3]
}
```

## 制限\{#limits}

- **デフォルト値**: ARRAY フィールドはデフォルト値をサポートしません。ただし、`nullable` 属性を `True` に設定して NULL 値を許容することができます。詳細については、[NULL許容 & デフォルト値](./nullable-fields) を参照してください。

- **データ型:** ARRAY フィールド内のすべての要素は、同じデータ型を共有する必要があります。これは `element_type` パラメーターで定義されます。`element_type` を `VARCHAR` に設定する場合は、配列要素の `max_length` も指定する必要があります。`element_type` は、任意のスカラーデータ型、`JSON`、および `STRUCT` を受け入れます。

- **配列容量**: ARRAY フィールド内の要素数は、配列作成時に `max_capacity` で指定された最大容量以下である必要があります。値は **1** から **4096** の範囲内の整数である必要があります。

- **文字列処理**: 配列 フィールド内の文字列値は、意味的なエスケープや変換なしにそのまま保存されます。例えば、`'a"b'`、`"a'b"`、`'a\'b'`、および `"a\"b"` は入力されたとおりに保存されますが、`'a'b'` および `"a"b"` は無効な値と見なされます。

## ARRAY フィールドの追加\{#add-array-field}

Zilliz Cloud クラスターで ARRAY フィールドを使用するには、コレクションスキーマの作成時に関連するフィールド型を定義します。このプロセスには以下が含まれます：

1. `datatype` をサポートされている配列データ型である `ARRAY` に設定します。

1. `element_type` パラメーターを使用して、配列内の要素のデータ型を指定します。同じ配列内のすべての要素は同じデータ型である必要があります。

1. `max_capacity` パラメーターを使用して、配列の最大容量、つまり含めることができる要素の最大数を定義します。

ARRAY フィールドを含むコレクションスキーマを定義する方法は以下の通りです：

<Admonition type="info" icon="📘" title="Notes">

<p>スキーマの定義時に <code>enable_dynamic_fields=True</code> を設定した場合、Zilliz Cloud では事前に定義されていないスカラーフィールドの挿入が許可されます。ただし、これによりクエリと管理の複雑性が増し、パフォーマンスに影響を与える可能性があります。詳細については、<a href="./enable-dynamic-field">ダイナミックフィールド</a> を参照してください。</p>

</Admonition>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Import necessary libraries
from pymilvus import MilvusClient, DataType

# Define server address
SERVER_ADDR = "YOUR_CLUSTER_ENDPOINT"

# Create a MilvusClient instance
client = MilvusClient(uri=SERVER_ADDR)

# Define the collection schema
schema = client.create_schema(
    auto_id=False,
    enable_dynamic_fields=True,
)

#  Add \`tags\` and \`ratings\` ARRAY fields with nullable=True
schema.add_field(field_name="tags", datatype=DataType.ARRAY, element_type=DataType.VARCHAR, max_capacity=10, max_length=65535, nullable=True)
schema.add_field(field_name="ratings", datatype=DataType.ARRAY, element_type=DataType.INT64, max_capacity=5, nullable=True)
schema.add_field(field_name="pk", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="embedding", datatype=DataType.FLOAT_VECTOR, dim=3)
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
        .build());
        
CreateCollectionReq.CollectionSchema schema = client.createSchema();
schema.setEnableDynamicField(true);

schema.addField(AddFieldReq.builder()
        .fieldName("tags")
        .dataType(DataType.Array)
        .elementType(DataType.VarChar)
        .maxCapacity(10)
        .maxLength(65535)
        .isNullable(true)
        .build());

schema.addField(AddFieldReq.builder()
        .fieldName("ratings")
        .dataType(DataType.Array)
        .elementType(DataType.Int64)
        .maxCapacity(5)
        .isNullable(true)
        .build());

schema.addField(AddFieldReq.builder()
        .fieldName("pk")
        .dataType(DataType.Int64)
        .isPrimaryKey(true)
        .build());

schema.addField(AddFieldReq.builder()
        .fieldName("embedding")
        .dataType(DataType.FloatVector)
        .dimension(3)
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

schema := entity.NewSchema()
schema.WithField(entity.NewField().
    WithName("pk").
    WithDataType(entity.FieldTypeInt64).
    WithIsPrimaryKey(true),
).WithField(entity.NewField().
    WithName("embedding").
    WithDataType(entity.FieldTypeFloatVector).
    WithDim(3),
).WithField(entity.NewField().
    WithName("tags").
    WithDataType(entity.FieldTypeArray).
    WithElementType(entity.FieldTypeVarChar).
    WithMaxCapacity(10).
    WithMaxLength(65535).
    WithNullable(true),
).WithField(entity.NewField().
    WithName("ratings").
    WithDataType(entity.FieldTypeArray).
    WithElementType(entity.FieldTypeInt64).
    WithMaxCapacity(5).
    WithNullable(true),
)
```

</TabItem>

<TabItem value='java'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";
const schema = [
  {
    name: "tags",
    data_type: DataType.Array,
    element_type: DataType.VarChar,
    max_capacity: 10,
    max_length: 65535
  },
  {
    name: "rating",
    data_type: DataType.Array,
    element_type: DataType.Int64,
    max_capacity: 5,
  },
  {
    name: "pk",
    data_type: DataType.Int64,
    is_primary_key: true,
  },
  {
    name: "embedding",
    data_type: DataType.FloatVector,
    dim: 3,
  },
];
```

</TabItem>

<TabItem value='java'>

```bash
export arrayField1='{
    "fieldName": "tags",
    "dataType": "Array",
    "elementDataType": "VarChar",
    "elementTypeParams": {
        "max_capacity": 10,
        "max_length": 65535
    }
}'

export arrayField2='{
    "fieldName": "ratings",
    "dataType": "Array",
    "elementDataType": "Int64",
    "elementTypeParams": {
        "max_capacity": 5
    }
}'

export pkField='{
    "fieldName": "pk",
    "dataType": "Int64",
    "isPrimary": true
}'

export vectorField='{
    "fieldName": "embedding",
    "dataType": "FloatVector",
    "elementTypeParams": {
        "dim": 3
    }
}'

export schema="{
    \"autoID\": false,
    \"fields\": [
        $arrayField1,
        $arrayField2,
        $pkField,
        $vectorField
    ]
}"
```

</TabItem>
</Tabs>

## インデックスパラメータの設定\{#set-index-params}

インデックス作成は、検索およびクエリのパフォーマンスを向上させます。Zilliz Cloudクラスターでは、ベクトルフィールドに対してはインデックス作成が必須ですが、スカラーフィールドに対しては任意です。

次の例では、ベクトルフィールド `embedding` とARRAYフィールド `tags` の両方に `AUTOINDEX` インデックスタイプを使用してインデックスを作成しています。このタイプでは、Milvusがデータ型に基づいて最も適したインデックスを自動的に選択します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Set index params

index_params = client.prepare_index_params()

# Index \`age\` with AUTOINDEX
index_params.add_index(
    field_name="tags",
    index_type="AUTOINDEX",
    index_name="tags_index"
)

# Index \`embedding\` with AUTOINDEX and specify similarity metric type
index_params.add_index(
    field_name="embedding",
    index_type="AUTOINDEX",  # Use automatic indexing to simplify complex index settings
    metric_type="COSINE"  # Specify similarity metric type, options include L2, COSINE, or IP
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.IndexParam;
import java.util.*;

List<IndexParam> indexes = new ArrayList<>();
indexes.add(IndexParam.builder()
        .fieldName("tags")
        .indexName("tags_index")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .build());
        
indexes.add(IndexParam.builder()
        .fieldName("embedding")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.COSINE)
        .build());
```

</TabItem>

<TabItem value='java'>

```go
indexOpt1 := milvusclient.NewCreateIndexOption("my_collection", "tags", index.NewInvertedIndex())
indexOpt2 := milvusclient.NewCreateIndexOption("my_collection", "embedding", index.NewAutoIndex(entity.COSINE))
```

</TabItem>

<TabItem value='java'>

```javascript
const indexParams = [{
    index_name: 'inverted_index',
    field_name: 'tags',
    index_type: IndexType.AUTOINDEX,
)];

indexParams.push({
    index_name: 'embedding_index',
    field_name: 'embedding',
    index_type: IndexType.AUTOINDEX,
});
```

</TabItem>

<TabItem value='java'>

```bash
export indexParams='[
        {
            "fieldName": "tags",
            "indexName": "inverted_index",
            "indexType": "AUTOINDEX"
        },
        {
            "fieldName": "embedding",
            "metricType": "COSINE",
            "indexType": "AUTOINDEX"
        }
    ]'
```

</TabItem>
</Tabs>

## コレクションの作成\{#create-collection}

スキーマとインデックスが定義されたら、ARRAYフィールドを含むコレクションを作成します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.create_collection(
    collection_name="my_collection",
    schema=schema,
    index_params=index_params
)
```

</TabItem>

<TabItem value='java'>

```java
CreateCollectionReq requestCreate = CreateCollectionReq.builder()
        .collectionName("my_collection")
        .collectionSchema(schema)
        .indexParams(indexes)
        .build();
client.createCollection(requestCreate);
```

</TabItem>

<TabItem value='java'>

```go
err = client.CreateCollection(ctx, milvusclient.NewCreateCollectionOption("my_collection", schema).
    WithIndexOptions(indexOpt1, indexOpt2))
if err != nil {
    fmt.Println(err.Error())
    // handler err
}
```

</TabItem>

<TabItem value='java'>

```javascript
client.create_collection({
    collection_name: "my_collection",
    schema: schema,
    index_params: indexParams
})
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"my_collection\",
    \"schema\": $schema,
    \"indexParams\": $indexParams
}"
```

</TabItem>
</Tabs>

## データの挿入\{#insert-data}

コレクションを作成した後、ARRAYフィールドを含むデータを挿入できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Sample data
data = [
  {
      "tags": ["pop", "rock", "classic"],
      "ratings": [5, 4, 3],
      "pk": 1,
      "embedding": [0.12, 0.34, 0.56]
  },
  {
      "tags": None,  # Entire ARRAY is null
      "ratings": [4, 5],
      "pk": 2,
      "embedding": [0.78, 0.91, 0.23]
  },
  {  # The tags field is completely missing
      "ratings": [9, 5],
      "pk": 3,
      "embedding": [0.18, 0.11, 0.23]
  }
]

client.insert(
    collection_name="my_collection",
    data=data
)
```

</TabItem>

<TabItem value='java'>

```java
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import io.milvus.v2.service.vector.request.InsertReq;
import io.milvus.v2.service.vector.response.InsertResp;

List<JsonObject> rows = new ArrayList<>();
Gson gson = new Gson();
rows.add(gson.fromJson("{\"tags\": [\"pop\", \"rock\", \"classic\"], \"ratings\": [5, 4, 3], \"pk\": 1, \"embedding\": [0.12, 0.34, 0.56]}", JsonObject.class));
rows.add(gson.fromJson("{\"tags\": null, \"ratings\": [4, 5], \"pk\": 2, \"embedding\": [0.78, 0.91, 0.23]}", JsonObject.class));
rows.add(gson.fromJson("{\"ratings\": [9, 5], \"pk\": 3, \"embedding\": [0.18, 0.11, 0.23]}", JsonObject.class));

InsertResp insertR = client.insert(InsertReq.builder()
        .collectionName("my_collection")
        .data(rows)
        .build());
```

</TabItem>

<TabItem value='java'>

```go
column1, _ := column.NewNullableColumnVarCharArray("tags",
    [][]string{{"pop", "rock", "classic"}},
    []bool{true, false, false})
column2, _ := column.NewNullableColumnInt64Array("ratings",
    [][]int64{{5, 4, 3}, {4, 5}, {9, 5}},
    []bool{true, true, true})

_, err = client.Insert(ctx, milvusclient.NewColumnBasedInsertOption("my_collection").
    WithInt64Column("pk", []int64{1, 2, 3}).
    WithFloatVectorColumn("embedding", 3, [][]float32{
        {0.12, 0.34, 0.56},
        {0.78, 0.91, 0.23},
        {0.18, 0.11, 0.23},
    }).WithColumns(column1, column2))
if err != nil {
    fmt.Println(err.Error())
    // handle err
}
```

</TabItem>

<TabItem value='java'>

```javascript
const data = [
    {
        "tags": ["pop", "rock", "classic"],
        "ratings": [5, 4, 3],
        "pk": 1,
        "embedding": [0.12, 0.34, 0.56]
    },
    {
        "tags": ["jazz", "blues"],
        "ratings": [4, 5],
        "pk": 2,
        "embedding": [0.78, 0.91, 0.23]
    },
    {
        "tags": ["electronic", "dance"],
        "ratings": [3, 3, 4],
        "pk": 3,
        "embedding": [0.67, 0.45, 0.89]
    }
];

client.insert({
  collection_name: "my_collection",
  data: data,
});
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/insert" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "data": [
        {
        "tags": ["pop", "rock", "classic"],
        "ratings": [5, 4, 3],
        "pk": 1,
        "embedding": [0.12, 0.34, 0.56]
    },
    {
        "tags": ["jazz", "blues"],
        "ratings": [4, 5],
        "pk": 2,
        "embedding": [0.78, 0.91, 0.23]
    },
    {
        "tags": ["electronic", "dance"],
        "ratings": [3, 3, 4],
        "pk": 3,
        "embedding": [0.67, 0.45, 0.89]
    }       
    ],
    "collectionName": "my_collection"
}'
```

</TabItem>
</Tabs>

## フィルター式を使用したクエリ\{#query-with-filter-expressions}

エンティティを挿入した後、指定されたフィルター式に一致するエンティティを取得するには `query` メソッドを使用します。

`tags` が null でないエンティティを取得するには：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Query to exclude entities where \`tags\` is not null

filter = 'tags IS NOT NULL'

res = client.query(
    collection_name="my_collection",
    filter=filter,
    output_fields=["tags", "ratings", "pk"]
)

print(res)

# Example output:
# data: [
#     "{'tags': ['pop', 'rock', 'classic'], 'ratings': [5, 4, 3], 'pk': 1}"
# ]
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.QueryReq;
import io.milvus.v2.service.vector.response.QueryResp;

String filter = "tags IS NOT NULL";
QueryResp resp = client.query(QueryReq.builder()
        .collectionName("my_collection")
        .filter(filter)
        .outputFields(Arrays.asList("tags", "ratings", "pk"))
        .build());

System.out.println(resp.getQueryResults());

// Output
//
// [QueryResp.QueryResult(entity={ratings=[5, 4, 3], pk=1, tags=[pop, rock, classic]})]
```

</TabItem>

<TabItem value='java'>

```go
filter := "tags IS NOT NULL"
rs, err := client.Query(ctx, milvusclient.NewQueryOption("my_collection").
    WithFilter(filter).
    WithOutputFields("tags", "ratings", "pk"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

fmt.Println("pk", rs.GetColumn("pk").FieldData().GetScalars())
fmt.Println("tags", rs.GetColumn("tags").FieldData().GetScalars())
fmt.Println("ratings", rs.GetColumn("ratings").FieldData().GetScalars())
```

</TabItem>

<TabItem value='java'>

```javascript
client.query({
    collection_name: 'my_collection',
    filter: 'tags IS NOT NULL',
    output_fields: ['tags', 'ratings', 'embedding']
});
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/query" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "filter": "tags IS NOT NULL",
    "outputFields": ["tags", "ratings", "embedding"]
}'

```

</TabItem>
</Tabs>

`ratings` の最初の要素の値が 4 より大きいエンティティを取得するには、次のとおりです：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
filter = 'ratings[0] > 4'

res = client.query(
    collection_name="my_collection",
    filter=filter,
    output_fields=["tags", "ratings", "embedding"]
)

print(res)

# Example output:
# data: [
#     "{'tags': ['pop', 'rock', 'classic'], 'ratings': [5, 4, 3], 'embedding': [0.12, 0.34, 0.56], 'pk': 1}",
#     "{'tags': None, 'ratings': [9, 5], 'embedding': [0.18, 0.11, 0.23], 'pk': 3}"
# ]
```

</TabItem>

<TabItem value='java'>

```java
String filter = "ratings[0] > 4"

QueryResp resp = client.query(QueryReq.builder()
        .collectionName("my_collection")
        .filter(filter)
        .outputFields(Arrays.asList("tags", "ratings", "pk"))
        .build());

System.out.println(resp.getQueryResults());

// Output
// [
//    QueryResp.QueryResult(entity={ratings=[5, 4, 3], pk=1, tags=[pop, rock, classic]}), 
//    QueryResp.QueryResult(entity={ratings=[9, 5], pk=3, tags=[]})
// ]
```

</TabItem>

<TabItem value='java'>

```go
filter = "ratings[0] > 4"
rs, err = client.Query(ctx, milvusclient.NewQueryOption("my_collection").
    WithFilter(filter).
    WithOutputFields("tags", "ratings", "pk"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

fmt.Println("pk", rs.GetColumn("pk"))
fmt.Println("tags", rs.GetColumn("tags"))
fmt.Println("ratings", rs.GetColumn("ratings"))
```

</TabItem>

<TabItem value='java'>

```javascript
// node
const filter = 'ratings[0] > 4';

const res = await client.query({
    collection_name:"my_collection",
    filter:filter,
    output_fields: ["tags", "ratings", "embedding"]
});

console.log(res)

// Example output:
// data: [
//     "{'tags': ['pop', 'rock', 'classic'], 'ratings': [5, 4, 3], 'embedding': [0.12, 0.34, 0.56], 'pk': 1}",
//     "{'tags': None, 'ratings': [9, 5], 'embedding': [0.18, 0.11, 0.23], 'pk': 3}"
// ]
```

</TabItem>

<TabItem value='java'>

```bash
# restful
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/query" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
  "collectionName": "my_collection",
  "filter": "ratings[0] > 4",
  "outputFields": ["tags", "ratings", "embedding"]
}'
```

</TabItem>
</Tabs>

## フィルター式を用いたベクトル検索\{#vector-search-with-filter-expressions}

基本的なスカラー型フィールドによるフィルタリングに加えて、ベクトル類似性検索とスカラー型フィールドのフィルターを組み合わせることもできます。たとえば、以下のコードはベクトル検索にスカラー型フィールドのフィルターを追加する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
filter = 'tags[0] == "pop"'

res = client.search(
    collection_name="my_collection",
    data=[[0.3, -0.6, 0.1]],
    limit=5,
    search_params={"params": {"nprobe": 10}},
    output_fields=["tags", "ratings", "embedding"],
    filter=filter
)

print(res)

# Example output:
# data: [
#     "[{'id': 1, 'distance': -0.2479381263256073, 'entity': {'tags': ['pop', 'rock', 'classic'], 'ratings': [5, 4, 3], 'embedding': [0.11999999731779099, 0.3400000035762787, 0.5600000023841858]}}]"
# ]
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.response.SearchResp;

String filter = "tags[0] == \"pop\"";
SearchResp resp = client.search(SearchReq.builder()
        .collectionName("my_collection")
        .annsField("embedding")
        .data(Collections.singletonList(new FloatVec(new float[]{0.3f, -0.6f, 0.1f})))
        .topK(5)
        .outputFields(Arrays.asList("tags", "ratings", "embedding"))
        .filter(filter)
        .build());

System.out.println(resp.getSearchResults());

// Output
//
// [[SearchResp.SearchResult(entity={ratings=[5, 4, 3], embedding=[0.12, 0.34, 0.56], tags=[pop, rock, classic]}, score=-0.24793813, id=1)]]
```

</TabItem>

<TabItem value='java'>

```go
queryVector := []float32{0.3, -0.6, 0.1}
filter = "tags[0] == \"pop\""

annParam := index.NewCustomAnnParam()
annParam.WithExtraParam("nprobe", 10)
resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "my_collection", // collectionName
    5,               // limit
    []entity.Vector{entity.FloatVector(queryVector)},
).WithANNSField("embedding").
    WithFilter(filter).
    WithOutputFields("tags", "ratings", "embedding").
    WithAnnParam(annParam))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

for _, resultSet := range resultSets {
    fmt.Println("IDs: ", resultSet.IDs.FieldData().GetScalars())
    fmt.Println("Scores: ", resultSet.Scores)
    fmt.Println("tags", resultSet.GetColumn("tags").FieldData().GetScalars())
    fmt.Println("ratings", resultSet.GetColumn("ratings").FieldData().GetScalars())
    fmt.Println("embedding", resultSet.GetColumn("embedding").FieldData().GetVectors())
}
```

</TabItem>

<TabItem value='java'>

```javascript
client.search({
    collection_name: 'my_collection',
    data: [0.3, -0.6, 0.1],
    limit: 5,
    output_fields: ['tags', 'ratings', 'embdding'],
    filter: 'tags[0] == "pop"'
});
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "data": [
        [0.3, -0.6, 0.1]
    ],
    "annsField": "embedding",
    "limit": 5,
    "filter": "tags[0] == \"pop\"",
    "outputFields": ["tags", "ratings", "embedding"]
}'

# {"code":0,"cost":0,"data":[{"distance":-0.24793813,"embedding":[0.12,0.34,0.56],"id":1,"ratings":{"Data":{"LongData":{"data":[5,4,3]}}},"tags":{"Data":{"StringData":{"data":["pop","rock","classic"]}}}}]}
```

</TabItem>
</Tabs>

さらに、Zilliz Cloud は高度な配列フィルタリング演算子として `ARRAY_CONTAINS`、`ARRAY_CONTAINS_ALL`、`ARRAY_CONTAINS_ANY`、および `ARRAY_LENGTH` をサポートしており、クエリ機能をさらに強化します。詳細については、[配列演算子](./array-filtering-operators) を参照してください。