---
title: "Nullable & Default | Cloud"
slug: /nullable-and-default
sidebar_label: "Nullable & Default"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudでは、プライマリフィールドを除くスカラーフィールドに対して、`nullable`属性とデフォルト値を設定できます。`nullable=True`とマークされたフィールドの場合、データ挿入時にそのフィールドをスキップするか、直接null値を設定することができ、システムはエラーを発生させることなくnullとして扱います。フィールドにデフォルト値が設定されている場合、挿入時にそのフィールドにデータが指定されなければ、システムはこの値を自動的に適用します。"
type: origin
token: DjROwgK6ziCf7Rkoji6ccyEUnsg
sidebar_position: 14
keywords: 
  - zilliz
  - ベクターデータベース
  - cloud
  - collection
  - schema
  - nullable
  - デフォルト値
  - 自然言語検索
  - 類似性検索
  - multimodal RAG
  - llm hallucinations

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Nullable & Default

Zilliz Cloud では、プライマリフィールドを除くスカラーフィールドに対して `nullable` 属性とデフォルト値を設定できます。`nullable=True` とマークされたフィールドの場合、データ挿入時にフィールドをスキップするか、直接 null 値に設定することができ、システムはエラーを発生させることなく null として扱います。フィールドにデフォルト値がある場合、挿入時にそのフィールドにデータが指定されていないと、システムはこの値を自動的に適用します。

デフォルト値と nullable 属性は、null 値を持つデータセットの処理とデフォルト値設定の保持を可能にすることで、他のデータベースシステムから Zilliz Cloud へのデータ移行を効率化します。コレクションを作成する際、値が不確実なフィールドに対して nullable を有効にしたり、デフォルト値を設定したりすることもできます。

## 制限事項{#limits}

- プライマリフィールドを除くスカラーフィールドのみが、デフォルト値と nullable 属性をサポートします。

- JSON および Array フィールドはデフォルト値をサポートしません。

- デフォルト値または nullable 属性は、コレクション作成時にのみ設定でき、後で変更することはできません。

- nullable 属性が有効になっているスカラーフィールドは、Grouping Search で `group_by_field` として使用できません。Grouping Search の詳細については、[Grouping Search](./grouping-search) を参照してください。

- nullable とマークされたフィールドは、パーティションキーとして使用できません。パーティションキーの詳細については、[パーティションキーの使用](./use-partition-key) を参照してください。

- nullable 属性が有効になっているスカラーフィールドにインデックスを作成する場合、null 値はインデックスから除外されます。

- **JSON および ARRAY フィールド**: `IS NULL` または `IS NOT NULL` 演算子を使用して JSON または ARRAY フィールドをフィルタリングする場合、これらの演算子は列レベルで機能します。これは、JSON オブジェクトまたは配列全体が null であるかどうかのみを評価することを意味します。たとえば、JSON オブジェクト内のキーが null であっても、`IS NULL` フィルタでは認識されません。詳細については、[基本的な演算子](./basic-filtering-operators) を参照してください。

## Nullable 属性{#nullable-attribute}

`nullable` 属性を使用すると、コレクションに null 値を格納でき、不明なデータを処理する際の柔軟性が向上します。

### Nullable 属性の設定{#set-the-nullable-attribute}

コレクションを作成する際、`nullable=True` を使用して nullable フィールドを定義します (デフォルトは `False`)。次の例では、`my_collection` という名前のコレクションを作成し、`age` フィールドを nullable に設定します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(uri='YOUR_CLUSTER_ENDPOINT')

# Define collection schema
schema = client.create_schema(
    auto_id=False,
    enable_dynamic_schema=True,
)

schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="vector", datatype=DataType.FLOAT_VECTOR, dim=5)
schema.add_field(field_name="age", datatype=DataType.INT64, nullable=True) # Nullable field

# Set index params
index_params = client.prepare_index_params()
index_params.add_index(field_name="vector", index_type="AUTOINDEX", metric_type="L2")

# Create collection
client.create_collection(collection_name="my_collection", schema=schema, index_params=index_params)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.DataType;
import io.milvus.v2.common.IndexParam;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

import java.util.*;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .build());
        
CreateCollectionReq.CollectionSchema schema = client.createSchema();
schema.setEnableDynamicField(true);

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

schema.addField(AddFieldReq.builder()
        .fieldName("age")
        .dataType(DataType.Int64)
        .isNullable(true)
        .build());

List<IndexParam> indexes = new ArrayList<>();
Map<String,Object> extraParams = new HashMap<>();

indexes.add(IndexParam.builder()
        .fieldName("vector")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.L2)
        .build());

CreateCollectionReq requestCreate = CreateCollectionReq.builder()
        .collectionName("my_collection")
        .collectionSchema(schema)
        .indexParams(indexes)
        .build();
client.createCollection(requestCreate);
```

</TabItem>

<TabItem value='javascript'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const client = new MilvusClient({
  address: "YOUR_CLUSTER_ENDPOINT",
  token: "YOUR_CLUSTER_TOKEN",
});

await client.createCollection({
  collection_name: "my_collection",
  schema: [
    {
      name: "id",
      is_primary_key: true,
      data_type: DataType.int64,
    },
    { name: "vector", data_type: DataType.Int64, dim: 5 },

    { name: "age", data_type: DataType.FloatVector, nullable: true },
  ],

  index_params: [
    {
      index_name: "vector_inde",
      field_name: "vector",
      metric_type: MetricType.L2,
      index_type: IndexType.AUTOINDEX,
    },
  ],
});

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

schema := entity.NewSchema()
schema.WithField(entity.NewField().
    WithName("id").
    WithDataType(entity.FieldTypeInt64).
    WithIsPrimaryKey(true),
).WithField(entity.NewField().
    WithName("vector").
    WithDataType(entity.FieldTypeFloatVector).
    WithDim(5),
).WithField(entity.NewField().
    WithName("age").
    WithDataType(entity.FieldTypeInt64).
    WithNullable(true),
)

indexOption := milvusclient.NewCreateIndexOption("my_collection", "vector",
    index.NewAutoIndex(index.MetricType(entity.L2)))

err = client.CreateCollection(ctx,
    milvusclient.NewCreateCollectionOption("my_collection", schema).
        WithIndexOptions(indexOption))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

```bash
export pkField='{
    "fieldName": "id",
    "dataType": "Int64",
    "isPrimary": true
}'

export vectorField='{
    "fieldName": "vector",
    "dataType": "FloatVector",
    "elementTypeParams": {
        "dim": 5
    }
}'

export nullField='{
    "fieldName": "age",
    "dataType": "Int64",
    "nullable": true
}'

export schema="{
    \"autoID\": false,
    \"fields\": [
        $pkField,
        $vectorField,
        $nullField
    ]
}"

export indexParams='[
        {
            "fieldName": "vector",
            "metricType": "L2",
            "indexType": "AUTOINDEX"
        }
    ]'

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

### エンティティの挿入 {#insert-entities}

NULL許容フィールドにデータを挿入する場合、NULLを挿入するか、このフィールドを直接省略します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
data = [
    {"id": 1, "vector": [0.1, 0.2, 0.3, 0.4, 0.5], "age": 30},
    {"id": 2, "vector": [0.2, 0.3, 0.4, 0.5, 0.6], "age": None},
    {"id": 3, "vector": [0.3, 0.4, 0.5, 0.6, 0.7]}
]

client.insert(collection_name="my_collection", data=data)
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
rows.add(gson.fromJson("{\"id\": 1, \"vector\": [0.1, 0.2, 0.3, 0.4, 0.5], \"age\": 30}", JsonObject.class));
rows.add(gson.fromJson("{\"id\": 2, \"vector\": [0.2, 0.3, 0.4, 0.5, 0.6], \"age\": null}", JsonObject.class));
rows.add(gson.fromJson("{\"id\": 3, \"vector\": [0.3, 0.4, 0.5, 0.6, 0.7]}", JsonObject.class));

InsertResp insertR = client.insert(InsertReq.builder()
        .collectionName("my_collection")
        .data(rows)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
const data = [
  { id: 1, vector: [0.1, 0.2, 0.3, 0.4, 0.5], age: 30 },
  { id: 2, vector: [0.2, 0.3, 0.4, 0.5, 0.6], age: null },
  { id: 3, vector: [0.3, 0.4, 0.5, 0.6, 0.7] },
];

client.insert({
  collection_name: "my_collection",
  data: data,
});

```

</TabItem>

<TabItem value='go'>

```go
column, _ := column.NewNullableColumnInt64("age",
    []int64{30},
    []bool{true, false, false})

_, err = client.Insert(ctx, milvusclient.NewColumnBasedInsertOption("my_collection").
    WithInt64Column("id", []int64{1, 2, 3}).
    WithFloatVectorColumn("vector", 5, [][]float32{
        {0.1, 0.2, 0.3, 0.4, 0.5},
        {0.2, 0.3, 0.4, 0.5, 0.6},
        {0.3, 0.4, 0.5, 0.6, 0.7},
    }).
    WithColumns(column),
)
if err != nil {
    fmt.Println(err.Error())
    // handle err
}
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/insert" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "data": [
        {"id": 1, "vector": [0.1, 0.2, 0.3, 0.4, 0.5], "age": 30},
        {"id": 2, "vector": [0.2, 0.3, 0.4, 0.5, 0.6], "age": null}, 
        {"id": 3, "vector": [0.3, 0.4, 0.5, 0.6, 0.7]} 
    ],
    "collectionName": "my_collection"
}'
```

</TabItem>
</Tabs>

### null値による検索とクエリ{#search-and-query-with-null-values}

`search` メソッドを使用する場合、フィールドに `null` 値が含まれていると、検索結果はそのフィールドをnullとして返します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.search(
    collection_name="my_collection",
    data=[[0.1, 0.2, 0.4, 0.3, 0.128]],
    limit=2,
    search_params={"params": {"nprobe": 16}},
    output_fields=["id", "age"]
)

print(res)

# Output
# data: ["[{'id': 1, 'distance': 0.15838398039340973, 'entity': {'age': 30, 'id': 1}}, {'id': 2, 'distance': 0.28278401494026184, 'entity': {'age': None, 'id': 2}}]"] 
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.request.data.FloatVec;
import io.milvus.v2.service.vector.response.SearchResp;

Map<String,Object> params = new HashMap<>();
params.put("nprobe", 16);
SearchResp resp = client.search(SearchReq.builder()
        .collectionName("my_collection")
        .annsField("vector")
        .data(Collections.singletonList(new FloatVec(new float[]{0.1f, 0.2f, 0.3f, 0.4f, 0.5f})))
        .topK(2)
        .searchParams(params)
        .outputFields(Arrays.asList("id", "age"))
        .build());

System.out.println(resp.getSearchResults());

// Output
//
// [[SearchResp.SearchResult(entity={id=1, age=30}, score=0.0, id=1), SearchResp.SearchResult(entity={id=2, age=null}, score=0.050000004, id=2)]]
```

</TabItem>

<TabItem value='javascript'>

```javascript
client.search({
    collection_name: 'my_collection',
    data: [0.3, -0.6, 0.1, 0.3, 0.5],
    limit: 2,
    output_fields: ['age', 'id'],
    params: {
        nprobe: 16
    }
});
```

</TabItem>

<TabItem value='go'>

```go
queryVector := []float32{0.1, 0.2, 0.4, 0.3, 0.128}

annParam := index.NewCustomAnnParam()
annParam.WithExtraParam("nprobe", 16)
resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "my_collection", // collectionName
    2,                    // limit
    []entity.Vector{entity.FloatVector(queryVector)},
).WithANNSField("vector").
    WithAnnParam(annParam).
    WithOutputFields("id", "age"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

for _, resultSet := range resultSets {
    fmt.Println("IDs: ", resultSet.IDs.FieldData().GetScalars())
    fmt.Println("Scores: ", resultSet.Scores)
    fmt.Println("age: ", resultSet.GetColumn("age").FieldData().GetScalars())
}
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "data": [
        [0.1, -0.2, 0.3, 0.4, 0.5]
    ],
    "annsField": "vector",
    "limit": 2,
    "outputFields": ["id", "age"]
}'

#{"code":0,"cost":0,"data":[{"age":30,"distance":0.16000001,"id":1},{"age":null,"distance":0.28999996,"id":2}]}
```

</TabItem>
</Tabs>

`query` メソッドをスカラーフィルタリングに使用する場合、null 値のフィルタリング結果はすべて false になり、選択されないことを示します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Reviewing previously inserted data:
# {"id": 1, "vector": [0.1, 0.2, ..., 0.128], "age": 30}
# {"id": 2, "vector": [0.2, 0.3, ..., 0.129], "age": None}
# {"id": 3, "vector": [0.3, 0.4, ..., 0.130], "age": None}  # Omitted age  column is treated as None

results = client.query(
    collection_name="my_collection",
    filter="age >= 0",
    output_fields=["id", "age"]
)

# Example output:
# [
#     {"id": 1, "age": 30}
# ]
# Note: Entities with `age` as `null` (id 2 and 3) will not appear in the result.
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.QueryReq;
import io.milvus.v2.service.vector.response.QueryResp;

QueryResp resp = client.query(QueryReq.builder()
        .collectionName("my_collection")
        .filter("age >= 0")
        .outputFields(Arrays.asList("id", "age"))
        .build());

System.out.println(resp.getQueryResults());

// Output
//
// [QueryResp.QueryResult(entity={id=1, age=30})]
```

</TabItem>

<TabItem value='javascript'>

```javascript
const results = await client.query(
    collection_name: "my_collection",
    filter: "age >= 0",
    output_fields: ["id", "age"]
);
```

</TabItem>

<TabItem value='go'>

```go
resultSet, err := client.Query(ctx, milvusclient.NewQueryOption("my_collection").
    WithFilter("age >= 0").
    WithOutputFields("id", "age"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println("id: ", resultSet.GetColumn("id").FieldData().GetScalars())
fmt.Println("age: ", resultSet.GetColumn("age").FieldData().GetScalars())
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/query" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "filter": "age >= 0",
    "outputFields": ["id", "age"]
}'

# {"code":0,"cost":0,"data":[{"age":30,"id":1}]}
```

</TabItem>
</Tabs>

`null` 値を持つエンティティを返すには、スカラーフィルタリング条件なしで次のようにクエリします。

<Admonition type="info" icon="📘" title="Notes">

<p><code>query</code> メソッドは、フィルタリング条件なしで使用すると、null 値を持つエンティティを含むコレクション内のすべてのエンティティを取得します。返されるエンティティの数を制限するには、<code>limit</code> パラメータを指定する必要があります。</p>

</Admonition>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
null_results = client.query(
    collection_name="my_collection",
    filter="",     # Query without any filtering condition
    output_fields=["id", "age"],
    limit=10
)

# Example output:
# [{"id": 2, "age": None}, {"id": 3, "age": None}]
```

</TabItem>

<TabItem value='java'>

```java
QueryResp resp = client.query(QueryReq.builder()
        .collectionName("my_collection")
        .filter("")
        .outputFields(Arrays.asList("id", "age"))
        .limit(10)
        .build());

System.out.println(resp.getQueryResults());
```

</TabItem>

<TabItem value='javascript'>

```javascript
const results = await client.query(
    collection_name: "my_collection",
    filter: "",
    output_fields: ["id", "age"],
    limit: 10
);
```

</TabItem>

<TabItem value='go'>

```go
resultSet, err = client.Query(ctx, milvusclient.NewQueryOption("my_collection").
    WithFilter("").
    WithLimit(10).
    WithOutputFields("id", "age"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println("id: ", resultSet.GetColumn("id"))
fmt.Println("age: ", resultSet.GetColumn("age"))
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/query" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "expr": "",
    "outputFields": ["id", "age"],
    "limit": 10
}'

# {"code":0,"cost":0,"data":[{"age":30,"id":1},{"age":null,"id":2},{"age":null,"id":3}]}
```

</TabItem>
</Tabs>

## デフォルト値{#default-values}

デフォルト値は、スカラーフィールドに割り当てられる事前設定された値です。挿入時にデフォルト値を持つフィールドに値が指定されない場合、システムは自動的にデフォルト値を使用します。

### デフォルト値の設定{#set-default-values}

コレクションを作成する際、`default_value` パラメータを使用してフィールドのデフォルト値を定義します。次の例は、`age` のデフォルト値を `18` に、`status` のデフォルト値を `"active"` に設定する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"},{"label":"Shell","value":"shell"}]}>
<TabItem value='python'>

```python
schema = client.create_schema(
    auto_id=False,
    enable_dynamic_schema=True,
)

schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="vector", datatype=DataType.FLOAT_VECTOR, dim=5)
schema.add_field(field_name="age", datatype=DataType.INT64, default_value=18)
schema.add_field(field_name="status", datatype=DataType.VARCHAR, default_value="active", max_length=10)

index_params = client.prepare_index_params()
index_params.add_index(field_name="vector", index_type="AUTOINDEX", metric_type="L2")

client.create_collection(collection_name="my_collection", schema=schema, index_params=index_params)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.DataType;
import io.milvus.v2.common.IndexParam;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

import java.util.*;

CreateCollectionReq.CollectionSchema schema = client.createSchema();
schema.setEnableDynamicField(true);

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

schema.addField(AddFieldReq.builder()
        .fieldName("age")
        .dataType(DataType.Int64)
        .defaultValue(18L)
        .build());

schema.addField(AddFieldReq.builder()
        .fieldName("status")
        .dataType(DataType.VarChar)
        .maxLength(10)
        .defaultValue("active")
        .build());

List<IndexParam> indexes = new ArrayList<>();
Map<String,Object> extraParams = new HashMap<>();

indexes.add(IndexParam.builder()
        .fieldName("vector")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.L2)
        .build());

CreateCollectionReq requestCreate = CreateCollectionReq.builder()
        .collectionName("my_collection")
        .collectionSchema(schema)
        .indexParams(indexes)
        .build();
client.createCollection(requestCreate);
```

</TabItem>

<TabItem value='javascript'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const client = new MilvusClient({
  address: "YOUR_CLUSTER_ENDPOINT",
  token: "YOUR_CLUSTER_TOKEN",
});

await client.createCollection({
  collection_name: "my_collection",
  schema: [
    {
      name: "id",
      is_primary_key: true,
      data_type: DataType.int64,
    },
    { name: "vector", data_type: DataType.FloatVector, dim: 5 },
    { name: "age", data_type: DataType.Int64, default_value: 18 },
    { name: 'status', data_type: DataType.VarChar, max_length: 30, default_value: 'active'},
  ],

  index_params: [
    {
      index_name: "vector_inde",
      field_name: "vector",
      metric_type: MetricType.L2,
      index_type: IndexType.AUTOINDEX,
    },
  ],
});

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

schema := entity.NewSchema()
schema.WithField(entity.NewField().
    WithName("id").
    WithDataType(entity.FieldTypeInt64).
    WithIsPrimaryKey(true),
).WithField(entity.NewField().
    WithName("vector").
    WithDataType(entity.FieldTypeFloatVector).
    WithDim(5),
).WithField(entity.NewField().
    WithName("age").
    WithDataType(entity.FieldTypeInt64).
    WithDefaultValueLong(18),
).WithField(entity.NewField().
    WithName("status").
    WithDataType(entity.FieldTypeVarChar).
    WithMaxLength(10).
    WithDefaultValueString("active"),
)

indexOption := milvusclient.NewCreateIndexOption("my_collection", "vector",
    index.NewAutoIndex(index.MetricType(entity.L2)))

err = client.CreateCollection(ctx,
    milvusclient.NewCreateCollectionOption("my_collection", schema).
        WithIndexOptions(indexOption))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

```bash
export pkField='{
    "fieldName": "id",
    "dataType": "Int64",
    "isPrimary": true
}'

export vectorField='{
    "fieldName": "vector",
    "dataType": "FloatVector",
    "elementTypeParams": {
        "dim": 5
    }
}'

export defaultValueField1='{
    "fieldName": "age",
    "dataType": "Int64",
    "defaultValue": 18
}'

export defaultValueField2='{
    "fieldName": "status",
    "dataType": "VarChar",
    "defaultValue": "active",
    "elementTypeParams": {
        "max_length": 10
    }
}'

export schema="{
    \"autoID\": false,
    \"fields\": [
        $pkField,
        $vectorField,
        $defaultValueField1,
        $defaultValueField2
    ]
}"

export indexParams='[
        {
            "fieldName": "vector",
            "metricType": "L2",
            "indexType": "AUTOINDEX"
        }
    ]'

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

```shell
milvus::CollectionSchemaPtr schema = std::make_shared<milvus::CollectionSchema>();
schema->AddField({"id", milvus::DataType::INT64, "", true, false});
schema->AddField(milvus::FieldSchema("vector", milvus::DataType::FLOAT_VECTOR).WithDimension(5));
schema->AddField(milvus::FieldSchema("age", milvus::DataType::INT64).WithDefaultValue(18));
schema->AddField(milvus::FieldSchema("status", milvus::DataType::VARCHAR).WithDefaultValue("active").WithMaxLength(10);

std::vector<milvus::IndexDesc> indexes = {
    milvus::IndexDesc("vector", "vector_index", milvus::IndexType::AUTOINDEX, milvus::MetricType::L2)
}

auto status = client->CreateCollection(milvus::CreateCollectionRequest()
                                        .WithCollectionName("my_collection")
                                        .WithIndexes(std::move(indexes))
                                        .WithCollectionSchema(schema));
if (!status.IsOk()) {
    std::cout << status.Message() << std::endl;
}

```

### エンティティの挿入{#insert-entities}

データを挿入する際、デフォルト値を持つフィールドを省略するか、その値をnullに設定すると、システムはデフォルト値を使用します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
data = [
    {"id": 1, "vector": [0.1, 0.2, ..., 0.128], "age": 30, "status": "premium"},
    {"id": 2, "vector": [0.2, 0.3, ..., 0.129]},  # `age` and `status` use default values
    {"id": 3, "vector": [0.3, 0.4, ..., 0.130], "age": 25, "status": None},  # `status` uses default value
    {"id": 4, "vector": [0.4, 0.5, ..., 0.131], "age": None, "status": "inactive"}  # `age` uses default value
]

client.insert(collection_name="my_collection", data=data)
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
rows.add(gson.fromJson("{\"id\": 1, \"vector\": [0.1, 0.2, 0.3, 0.4, 0.5], \"age\": 30, \"status\": \"premium\"}", JsonObject.class));
rows.add(gson.fromJson("{\"id\": 2, \"vector\": [0.2, 0.3, 0.4, 0.5, 0.6]}", JsonObject.class));
rows.add(gson.fromJson("{\"id\": 3, \"vector\": [0.3, 0.4, 0.5, 0.6, 0.7], \"age\": 25, \"status\": null}", JsonObject.class));
rows.add(gson.fromJson("{\"id\": 4, \"vector\": [0.4, 0.5, 0.6, 0.7, 0.8], \"age\": null, \"status\": \"inactive\"}", JsonObject.class));

InsertResp insertR = client.insert(InsertReq.builder()
        .collectionName("my_collection")
        .data(rows)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
const data = [
    {"id": 1, "vector": [0.1, 0.2, 0.3, 0.4, 0.5], "age": 30, "status": "premium"},
    {"id": 2, "vector": [0.2, 0.3, 0.4, 0.5, 0.6]}, 
    {"id": 3, "vector": [0.3, 0.4, 0.5, 0.6, 0.7], "age": 25, "status": null}, 
    {"id": 4, "vector": [0.4, 0.5, 0.6, 0.7, 0.8], "age": null, "status": "inactive"}  
];

client.insert({
  collection_name: "my_collection",
  data: data,
});
```

</TabItem>

<TabItem value='go'>

```go
column1, _ := column.NewNullableColumnInt64("age",
    []int64{30, 25},
    []bool{true, false, true, false})
column2, _ := column.NewNullableColumnVarChar("status",
    []string{"premium", "inactive"},
    []bool{true, false, false, true})

_, err = client.Insert(ctx, milvusclient.NewColumnBasedInsertOption("my_collection").
    WithInt64Column("id", []int64{1, 2, 3, 4}).
    WithFloatVectorColumn("vector", 5, [][]float32{
        {0.1, 0.2, 0.3, 0.4, 0.5},
        {0.2, 0.3, 0.4, 0.5, 0.6},
        {0.3, 0.4, 0.5, 0.6, 0.7},
        {0.4, 0.5, 0.6, 0.7, 0.8},
    }).
    WithColumns(column1, column2),
)
if err != nil {
    fmt.Println(err.Error())
    // handle err
}
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/insert" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "data": [
        {"id": 1, "vector": [0.1, 0.2, 0.3, 0.4, 0.5], "age": 30, "status": "premium"},
        {"id": 2, "vector": [0.2, 0.3, 0.4, 0.5, 0.6]},
        {"id": 3, "vector": [0.3, 0.4, 0.5, 0.6, 0.7], "age": 25, "status": null}, 
        {"id": 4, "vector": [0.4, 0.5, 0.6, 0.7, 0.8], "age": null, "status": "inactive"}      
    ],
    "collectionName": "my_collection"
}'
```

</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Notes">

<p>nullable およびデフォルト値の設定がどのように適用されるかの詳細については、<a href="./nullable-and-default#applicable-rules">適用されるルール</a>を参照してください。</p>

</Admonition>

### デフォルト値を使用した検索とクエリ{#search-and-query-with-default-values}

デフォルト値を含むエンティティは、ベクトル検索およびスカラーフィルタリング中に他のエンティティと同様に扱われます。`search` および `query` 操作の一部としてデフォルト値を含めることができます。

たとえば、`search` 操作では、`age` がデフォルト値の `18` に設定されているエンティティが結果に含まれます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.search(
    collection_name="my_collection",
    data=[[0.1, 0.2, 0.4, 0.3, 0.5]],
    search_params={"params": {"nprobe": 16}},
    filter="age == 18",  # 18 is the default value of the `age` field
    limit=10,
    output_fields=["id", "age", "status"]
)

print(res)

# Output
# data: ["[{'id': 2, 'distance': 0.050000004, 'entity': {'id': 2, 'age': 18, 'status': 'active'}}, {'id': 4, 'distance': 0.45000002, 'entity': {'id': 4, 'age': 18, 'status': 'inactive'}}]"] 

```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.request.data.FloatVec;
import io.milvus.v2.service.vector.response.SearchResp;

Map<String,Object> params = new HashMap<>();
params.put("nprobe", 16);
SearchResp resp = client.search(SearchReq.builder()
        .collectionName("my_collection")
        .annsField("vector")
        .data(Collections.singletonList(new FloatVec(new float[]{0.1f, 0.2f, 0.3f, 0.4f, 0.5f})))
        .searchParams(params)
        .filter("age == 18")
        .topK(10)
        .outputFields(Arrays.asList("id", "age", "status"))
        .build());

System.out.println(resp.getSearchResults());

// Output
//
// [[SearchResp.SearchResult(entity={id=2, age=18, status=active}, score=0.050000004, id=2), SearchResp.SearchResult(entity={id=4, age=18, status=inactive}, score=0.45000002, id=4)]]
```

</TabItem>

<TabItem value='javascript'>

```javascript
client.search({
    collection_name: 'my_collection',
    data: [0.3, -0.6, 0.1, 0.3, 0.5],
    limit: 2,
    output_fields: ['age', 'id', 'status'],
    filter: 'age == 18',
    params: {
        nprobe: 16
    }
});
```

</TabItem>

<TabItem value='go'>

```go
queryVector := []float32{0.1, 0.2, 0.4, 0.3, 0.5}

annParam := index.NewCustomAnnParam()
annParam.WithExtraParam("nprobe", 16)
resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "my_collection", // collectionName
    10,              // limit
    []entity.Vector{entity.FloatVector(queryVector)},
).WithANNSField("vector").
    WithFilter("age == 18").
    WithAnnParam(annParam).
    WithOutputFields("id", "age", "status"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

for _, resultSet := range resultSets {
    fmt.Println("IDs: ", resultSet.IDs.FieldData().GetScalars())
    fmt.Println("Scores: ", resultSet.Scores)
    fmt.Println("age: ", resultSet.GetColumn("age").FieldData().GetScalars())
    fmt.Println("status: ", resultSet.GetColumn("status").FieldData().GetScalars())
}
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "data": [
        [0.1, 0.2, 0.3, 0.4, 0.5]
    ],
    "annsField": "vector",
    "limit": 10,
    "filter": "age == 18",
    "outputFields": ["id", "age", "status"]
}'

# {"code":0,"cost":0,"data":[{"age":18,"distance":0.050000004,"id":2,"status":"active"},{"age":18,"distance":0.45000002,"id":4,"status":"inactive"}]}
```

</TabItem>
</Tabs>

`query` 操作では、デフォルト値で直接一致またはフィルタリングできます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Query all entities where `age` equals the default value (18)
default_age_results = client.query(
    collection_name="my_collection",
    filter="age == 18",
    output_fields=["id", "age", "status"]
)

# Query all entities where `status` equals the default value ("active")
default_status_results = client.query(
    collection_name="my_collection",
    filter='status == "active"',
    output_fields=["id", "age", "status"]
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.QueryReq;
import io.milvus.v2.service.vector.response.QueryResp;

QueryResp ageResp = client.query(QueryReq.builder()
        .collectionName("my_collection")
        .filter("age == 18")
        .outputFields(Arrays.asList("id", "age", "status"))
        .build());

System.out.println(ageResp.getQueryResults());

// Output
//
// [QueryResp.QueryResult(entity={id=2, age=18, status=active}), QueryResp.QueryResult(entity={id=4, age=18, status=inactive})]

QueryResp statusResp = client.query(QueryReq.builder()
        .collectionName("my_collection")
        .filter("status == \"active\"")
        .outputFields(Arrays.asList("id", "age", "status"))
        .build());

System.out.println(statusResp.getQueryResults());

// Output
//
// [QueryResp.QueryResult(entity={id=2, age=18, status=active}), QueryResp.QueryResult(entity={id=3, age=25, status=active})]
```

</TabItem>

<TabItem value='javascript'>

```javascript
// Query all entities where `age` equals the default value (18)
const default_age_results = await client.query(
    collection_name: "my_collection",
    filter: "age == 18",
    output_fields: ["id", "age", "status"]
);
// Query all entities where `status` equals the default value ("active")
const default_status_results = await client.query(
    collection_name: "my_collection",
    filter: 'status == "active"',
    output_fields: ["id", "age", "status"]
)
```

</TabItem>

<TabItem value='go'>

```go
resultSet, err := client.Query(ctx, milvusclient.NewQueryOption("my_collection").
    WithFilter("age == 18").
    WithOutputFields("id", "age", "status"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println("id: ", resultSet.GetColumn("id").FieldData().GetScalars())
fmt.Println("age: ", resultSet.GetColumn("age").FieldData().GetScalars())
fmt.Println("status: ", resultSet.GetColumn("status").FieldData().GetScalars())

resultSet, err = client.Query(ctx, milvusclient.NewQueryOption("my_collection").
    WithFilter("status == \"active\"").
    WithOutputFields("id", "age", "status"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println("id: ", resultSet.GetColumn("id").FieldData().GetScalars())
fmt.Println("age: ", resultSet.GetColumn("age").FieldData().GetScalars())
fmt.Println("status: ", resultSet.GetColumn("status").FieldData().GetScalars())
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/query" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "filter": "age == 18",
    "outputFields": ["id", "age", "status"]
}'

# {"code":0,"cost":0,"data":[{"age":18,"id":2,"status":"active"},{"age":18,"id":4,"status":"inactive"}]}

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/query" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "filter": "status == \"active\"",
    "outputFields": ["id", "age", "status"]
}'

# {"code":0,"cost":0,"data":[{"age":18,"id":2,"status":"active"},{"age":25,"id":3,"status":"active"}]}
```

</TabItem>
</Tabs>

## 適用されるルール{#applicable-rules}

次の表は、異なる構成の組み合わせにおけるNULL許容列とデフォルト値の動作をまとめたものです。これらのルールは、NULL値を挿入しようとした場合、またはフィールド値が提供されなかった場合に、Zilliz Cloudがデータをどのように処理するかを決定します。

<table>
   <tr>
     <th><p>NULL許容</p></th>
     <th><p>デフォルト値</p></th>
     <th><p>デフォルト値の型</p></th>
     <th><p>ユーザー入力</p></th>
     <th><p>結果</p></th>
     <th><p>例</p></th>
   </tr>
   <tr>
     <td><p>✅</p></td>
     <td><p>✅</p></td>
     <td><p>非NULL</p></td>
     <td><p>なし/NULL</p></td>
     <td><p>デフォルト値を使用</p></td>
     <td><p>フィールド: <code>age</code></p><p>デフォルト値: <code>18</code></p><p>ユーザー入力: NULL</p><p>結果: <code>18</code>として保存</p></td>
   </tr>
   <tr>
     <td><p>✅</p></td>
     <td><p>❌</p></td>
     <td><p>-</p></td>
     <td><p>なし/NULL</p></td>
     <td><p>NULLとして保存</p></td>
     <td><p>フィールド: <code>middle_name</code></p><p>デフォルト値: -</p><p>ユーザー入力: NULL</p><p>結果: NULLとして保存</p></td>
   </tr>
   <tr>
     <td><p>❌</p></td>
     <td><p>✅</p></td>
     <td><p>非NULL</p></td>
     <td><p>なし/NULL</p></td>
     <td><p>デフォルト値を使用</p></td>
     <td><p>フィールド: <code>status</code></p><p>デフォルト値: <code>"active"</code></p><p>ユーザー入力: NULL</p><p>結果: <code>"active"</code>として保存</p></td>
   </tr>
   <tr>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>-</p></td>
     <td><p>なし/NULL</p></td>
     <td><p>エラーをスロー</p></td>
     <td><p>フィールド: <code>email</code></p><p>デフォルト値: -</p><p>ユーザー入力: NULL</p><p>結果: 操作が拒否され、システムがエラーをスロー</p></td>
   </tr>
   <tr>
     <td><p>❌</p></td>
     <td><p>✅</p></td>
     <td><p>NULL</p></td>
     <td><p>なし/NULL</p></td>
     <td><p>エラーをスロー</p></td>
     <td><p>フィールド: <code>username</code></p><p>デフォルト値: NULL</p><p>ユーザー入力: NULL</p><p>結果: 操作が拒否され、システムがエラーをスロー</p></td>
   </tr>
</table>

