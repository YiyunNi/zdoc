---
title: "構造体の配列 | Cloud"
slug: /use-array-of-structs
sidebar_label: "構造体"
beta: FALSE
notebook: FALSE
description: "エンティティ内の構造体の配列フィールドは、順序付けられた構造体要素のセットを格納します。配列内の各構造体は、複数のベクトルとスカラーフィールドで構成される、事前に定義された同一のスキーマを共有します。| Cloud"
type: origin
token: LIMbwXk1OiS5SykUyNhc5FtSnPb
sidebar_position: 10
keywords: 
  - zilliz
  - vector database
  - cloud
  - collection
  - schema
  - 配列フィールド
  - 構造体の配列
  - 構造体

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 構造体の配列

エンティティ内の構造体の配列フィールドは、構造体要素の順序付きセットを格納します。配列内の各構造体は、事前に定義された同じスキーマを共有し、複数のベクトルとスカラーフィールドで構成されます。

以下は、構造体の配列フィールドを含むコレクションのエンティティの例です。

```json
{
    'id': 0,
    'title': 'Walden',
    'title_vector': [0.1, 0.2, 0.3, 0.4, 0.5],
    'author': 'Henry David Thoreau',
    'year_of_publication': 1845,
    // highlight-start
    'chunks': [
        {
            'text': 'When I wrote the following pages, or rather the bulk of them...',
            'text_vector': [0.3, 0.2, 0.3, 0.2, 0.5],
            'chapter': 'Economy',
        },
        {
            'text': 'I would fain say something, not so much concerning the Chinese and...',
            'text_vector': [0.7, 0.4, 0.2, 0.7, 0.8],
            'chapter': 'Economy'
        }
    ]
    // hightlight-end
}
```

上記の例では、`chunks` フィールドは 構造体 の配列（配列 of 構造体s）フィールドであり、各 構造体 要素には `text`、`text_vector`、および `chapter` という独自のフィールドが含まれています。

## 使用するタイミング\{#when-to-use}

自動運転からマルチモーダル検索に至るまで、現代の AI アプリケーションはますますネストされた異種データに依存しています。従来のフラットなデータモデルでは、「**1つの文書に多数の注釈付きチャンクが含まれる**」や「**1つの運転シーンに複数の観測されたマニューバーが含まれる**」といった複雑な関係を表現することが困難です。このようなケースにおいて、Zilliz Cloud の 配列 of 構造体s データ型がその真価を発揮します。

配列 of 構造体s があなたのアプリケーションシナリオに適しているかどうかを迅速に判断するには、以下の点を考慮してください：

- データが階層構造になっており、例えば 1 つの文書に多数の注釈付きチャンクが含まれている。

- 検索結果として返すべきはチャンクではなく文書である（上記の例と同様）。

- 検索結果に大量の重複エンティティが含まれており、グルーピング、重複排除、リランキングなどの手法を使って最終結果を取得するのが困難である。

上記の質問に対して「はい」と答える場合は、配列 of 構造体s を使用すべきです。

## 制限\{#limits}

- **データ型**

    コレクションを作成する際、配列フィールドの要素のデータ型として 構造体 型を使用できます。ただし、既存のコレクションに 配列 of 構造体s を追加することはできず、Zilliz Cloud はコレクションフィールドのデータ型として 構造体 型をサポートしていません。

    配列フィールド内の 構造体 はすべて同じスキーマを共有し、このスキーマは配列フィールド作成時に定義する必要があります。

    構造体 スキーマにはベクトルフィールドとスカラーフィールドの両方が含まれます。次の表に示すとおりです：

    <table>
       <tr>
         <th><p>フィールドタイプ</p></th>
         <th><p>データ型</p></th>
       </tr>
       <tr>
         <td><p>ベクトル</p></td>
         <td><p><code>FLOAT_VECTOR</code></p></td>
       </tr>
       <tr>
         <td rowspan="5"><p>スカラー</p></td>
         <td><p><code>VARCHAR</code></p></td>
       </tr>
       <tr>
         <td><p><code>INT8/16/32/64</code></p></td>
       </tr>
       <tr>
         <td><p><code>FLOAT</code></p></td>
       </tr>
       <tr>
         <td><p><code>DOUBLE</code></p></td>
       </tr>
       <tr>
         <td><p><code>BOOLEAN</code></p></td>
       </tr>
    </table>

    コレクションレベルと 構造体 内のベクトルフィールドの合計数が、クラスターの上限を超えないようにしてください。詳細については、[Zilliz Cloud 制限s](./limits#fields) を参照してください。

- **NULL許容とデフォルト値**

    配列 of 構造体s フィールドは NULL 許容ではなく、デフォルト値も受け付けません。

- **関数**

    構造体 内のスカラーフィールドからベクトルフィールドを導出する関数は使用できません。

- **インデックスタイプとメトリックタイプ**

    コレクション内のすべてのベクトルフィールドにはインデックスを付与する必要があります。配列 of 構造体s フィールド内のベクトルフィールドにインデックスを付与する際、Zilliz Cloud は各 構造体 要素内のベクトル埋め込みを埋め込みリスト（embedding list）として整理し、この埋め込みリスト全体に対してインデックスを構築します。

    配列 of 構造体s フィールドの埋め込みリストに対しては、インデックスタイプとして `AUTOINDEX` を使用でき、以下のいずれかのメトリックタイプを指定してインデックスを構築できます。

    <table>
       <tr>
         <th><p>インデックスタイプ</p></th>
         <th><p>メトリックタイプ</p></th>
         <th><p>備考</p></th>
       </tr>
       <tr>
         <td rowspan="3"><p><code>AUTOINDEX</code></p></td>
         <td><p><code>MAX_SIM_COSINE</code></p></td>
         <td rowspan="3"><p>以下のタイプの埋め込みリスト用：</p><ul><li>FLOAT_VECTOR</li></ul></td>
       </tr>
       <tr>
         <td><p><code>MAX_SIM_IP</code></p></td>
       </tr>
       <tr>
         <td><p><code>MAX_SIM_L2</code></p></td>
       </tr>
    </table>

    Zilliz Cloud がクエリと埋め込みリスト間の類似度をどのように計算するかの詳細については、[Maximum Similarity](./search-metrics-explained#maximum-similarity) を参照してください。

    配列 of 構造体s フィールド内のスカラーフィールドにはインデックスを付与できません。

- **データのアップサート**

    構造体 はマージモードでのアップサートをサポートしていません。ただし、オーバーライドモードでのアップサートは可能であり、構造体 内のデータを更新できます。マージモードとオーバーライドモードの違いの詳細については、[Upsert Entities](./upsert-entities#overview) を参照してください。

- **スカラーフィルタリング**

    検索およびクエリ内のフィルタリング式で、配列 of 構造体s フィールドまたはその 構造体 要素内の任意のフィールドを使用することはできません。

## 配列 of 構造体s の追加\{#add-array-of-structs}

Zilliz Cloud クラスターで 配列 of 構造体s を使用するには、コレクション作成時に配列フィールドを定義し、その要素のデータ型を 構造体 に設定する必要があります。手順は以下のとおりです：

1. コレクションスキーマにフィールドを配列フィールドとして追加する際に、そのデータ型を `データType.ARRAY` に設定します。

1. フィールドの `element_type` 属性を `データType.STRUCT` に設定して、配列 of 構造体s フィールドにします。

1. 構造体 スキーマを作成し、必要なフィールドを含めます。その後、フィールドの `struct_schema` 属性でこの 構造体 スキーマを参照します。

1. フィールドの `max_capacity` 属性に適切な値を設定し、各エンティティがこのフィールドに含めることができる 構造体 の最大数を指定します。

1. （**オプション**）構造体 要素内の任意のフィールドに対して `mmap.enabled` を設定することで、構造体 内のホットデータとコールドデータのバランスを調整できます。

以下は、配列 of 構造体s を含むコレクションスキーマを定義する方法の例です：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

schema = client.create_schema()

# add the primary field to the collection
schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True, auto_id=True)

# add some scalar fields to the collection
schema.add_field(field_name="title", datatype=DataType.VARCHAR, max_length=512)
schema.add_field(field_name="author", datatype=DataType.VARCHAR, max_length=512)
schema.add_field(field_name="year_of_publication", datatype=DataType.INT64)

# add a vector field to the collection
schema.add_field(field_name="title_vector", datatype=DataType.FLOAT_VECTOR, dim=5)

# highlight-start
# Create a struct schema
struct_schema = client.create_struct_field_schema()

# add a scalar field to the struct
struct_schema.add_field("text", DataType.VARCHAR, max_length=65535)
struct_schema.add_field("chapter", DataType.VARCHAR, max_length=512)

# add a vector field to the struct with mmap enabled
struct_schema.add_field("text_vector", DataType.FLOAT_VECTOR, mmap_enabled=True, dim=5)

# reference the struct schema in an Array field with its 
# element type set to \`DataType.STRUCT\`
schema.add_field("chunks", datatype=DataType.ARRAY, element_type=DataType.STRUCT, 
                    struct_schema=struct_schema, max_capacity=1000)
# highlight-end
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.DataType;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

CreateCollectionReq.CollectionSchema collectionSchema = CreateCollectionReq.CollectionSchema.builder()
        .build();
collectionSchema.addField(AddFieldReq.builder()
        .fieldName("id")
        .dataType(DataType.Int64)
        .isPrimaryKey(true)
        .autoID(true)
        .build());
collectionSchema.addField(AddFieldReq.builder()
        .fieldName("title")
        .dataType(DataType.VarChar)
        .maxLength(512)
        .build());
collectionSchema.addField(AddFieldReq.builder()
        .fieldName("author")
        .dataType(DataType.VarChar)
        .maxLength(512)
        .build());
collectionSchema.addField(AddFieldReq.builder()
        .fieldName("year_of_publication")
        .dataType(DataType.Int64)
        .build());
collectionSchema.addField(AddFieldReq.builder()
        .fieldName("title_vector")
        .dataType(DataType.FloatVector)
        .dimension(5)
        .build());

Map<String, String> params = new HashMap<>();
params.put("mmap_enabled", "true");
collectionSchema.addField(AddFieldReq.builder()
        .fieldName("chunks")
        .dataType(DataType.Array)
        .elementType(DataType.Struct)
        .maxCapacity(1000)
        .addStructField(AddFieldReq.builder()
                .fieldName("text")
                .dataType(DataType.VarChar)
                .maxLength(65535)
                .build())
        .addStructField(AddFieldReq.builder()
                .fieldName("chapter")
                .dataType(DataType.VarChar)
                .maxLength(512)
                .build())
        .addStructField(AddFieldReq.builder()
                .fieldName("text_vector")
                .dataType(DataType.FloatVector)
                .dimension(VECTOR_DIM)
                .typeParams(params)
                .build())
        .build());
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const milvusClient = new MilvusClient("YOUR_CLUSTER_ENDPOINT");

const schema = [
  {
    name: "id",
    data_type: DataType.INT64,
    is_primary_key: true,
    auto_id: true,
  },
  {
    name: "title",
    data_type: DataType.VARCHAR,
    max_length: 512,
  },
  {
    name: "author",
    data_type: DataType.VARCHAR,
    max_length: 512,
  },
  {
    name: "year_of_publication",
    data_type: DataType.INT64,
  },
  {
    name: "title_vector",
    data_type: DataType.FLOAT_VECTOR,
    dim: 5,
  },
  // highlight-start
  {
    name: "chunks",
    data_type: DataType.ARRAY,
    element_type: DataType.STRUCT,
    fields: [
      {
        name: "text",
        data_type: DataType.VARCHAR,
        max_length: 65535,
      },
      {
        name: "chapter",
        data_type: DataType.VARCHAR,
        max_length: 512,
      },
      {
        name: "text_vector",
        data_type: DataType.FLOAT_VECTOR,
        dim: 5,
        mmap_enabled: true,
      },
    ],
    max_capacity: 1000,
  },
  // highlight-end
];
```

</TabItem>

<TabItem value='java'>

```bash
# restful
SCHEMA='{
  "autoID": true,
  "fields": [
    {
      "fieldName": "id",
      "dataType": "Int64",
      "isPrimary": true
    },
    {
      "fieldName": "title",
      "dataType": "VarChar",
      "elementTypeParams": { "max_length": "512" }
    },
    {
      "fieldName": "author",
      "dataType": "VarChar",
      "elementTypeParams": { "max_length": "512" }
    },
    {
      "fieldName": "year_of_publication",
      "dataType": "Int64"
    },
    {
      "fieldName": "title_vector",
      "dataType": "FloatVector",
      "elementTypeParams": { "dim": "5" }
    }
  ],
  "structArrayFields": [
    {
      "name": "chunks",
      "description": "Array of document chunks with text and vectors",
      "elementTypeParams":{
         "max_capacity": 1000
      },
      "fields": [
        {
          "fieldName": "text",
          "dataType": "VarChar",
          "elementTypeParams": { "max_length": "65535" }
        },
        {
          "fieldName": "chapter",
          "dataType": "VarChar",
          "elementTypeParams": { "max_length": "512" }
        },
        {
          "fieldName": "text_vector",
          "dataType": "FloatVector",
          "elementTypeParams": {
            "dim": "5",
            "mmap_enabled": "true"
          }
        }
      ]
    }
  ]
}'
```

</TabItem>
</Tabs>

上記のコード例でハイライトされた行は、コレクションスキーマに 構造体 の配列を含める手順を示しています。

## インデックスパラメータの設定\{#set-index-params}

ベクトルフィールド（コレクション内のベクトルフィールドおよび要素 構造体 内で定義されたベクトルフィールドを含む）すべてに対して、インデックス作成が必須です。

埋め込みリスト（embedding list）に対してインデックスを作成するには、そのインデックスタイプを `AUTOINDEX` に設定し、Zilliz Cloud クラスターにおいて埋め込みリスト間の類似度を測定するためのメトリックタイプとして `MAX_SIM_COSINE` を使用する必要があります。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Create index parameters
index_params = client.prepare_index_params()

# Create an index for the vector field in the collection
index_params.add_index(
    field_name="title_vector",
    index_type="AUTOINDEX",
    metric_type="L2",
)

# highlight-start
# Create an index for the vector field in the element Struct
index_params.add_index(
    field_name="chunks[text_vector]",
    index_type="AUTOINDEX",
    metric_type="MAX_SIM_COSINE",
)
# highlight-end
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.IndexParam;

List<IndexParam> indexParams = new ArrayList<>();
indexParams.add(IndexParam.builder()
        .fieldName("title_vector")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.L2)
        .build());
indexParams.add(IndexParam.builder()
        .fieldName("chunks[text_vector]")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.MAX_SIM_COSINE)
        .build());
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```javascript
await milvusClient.createCollection({
  collection_name: "books",
  fields: schema,
});

const indexParams = [
  {
    field_name: "title_vector",
    index_type: "AUTOINDEX",
    metric_type: "L2",
  },
  // highlight-start
  {
    field_name: "chunks[text_vector]",
    index_type: "AUTOINDEX",
    metric_type: "MAX_SIM_COSINE",
  },
  // highlight-end
];
```

</TabItem>

<TabItem value='java'>

```bash
# restful
INDEX_PARAMS='[
  {
    "fieldName": "title_vector",
    "indexName": "title_vector_index",
    "indexType": "AUTOINDEX",
    "metricType": "L2"
  },
  {
    "fieldName": "chunks[text_vector]",
    "indexName": "chunks_text_vector_index",
    "indexType": "AUTOINDEX",
    "metricType": "MAX_SIM_COSINE"
  }
]'
```

</TabItem>
</Tabs>

## Create a collection\{#create-a-collection}

スキーマとインデックスの準備が整ったら、構造体 の配列フィールドを含むコレクションを作成できます。

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
import io.milvus.v2.service.collection.request.CreateCollectionReq;

CreateCollectionReq requestCreate = CreateCollectionReq.builder()
        .collectionName("my_collection")
        .collectionSchema(collectionSchema)
        .indexParams(indexParams)
        .build();
client.createCollection(requestCreate);
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```javascript
await milvusClient.createCollection({
  collection_name: "my_collection",
  fields: schema,
  indexes: indexParams,
});
```

</TabItem>

<TabItem value='java'>

```bash
# restful
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/collections/create" \
  -H "Content-Type: application/json" \
  -d "{
    \"collectionName\": \"my_collection\",
    \"description\": \"A collection for storing book information with struct array chunks\",
    \"schema\": $SCHEMA,
    \"indexParams\": $INDEX_PARAMS
  }"
```

</TabItem>
</Tabs>

## Insert data\{#insert-data}

コレクションを作成した後、次のように 構造体 の配列を含むデータを挿入できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Sample data
data = {
    'title': 'Walden',
    'title_vector': [0.1, 0.2, 0.3, 0.4, 0.5],
    'author': 'Henry David Thoreau',
    'year_of_publication': 1845,
    'chunks': [
        {
            'text': 'When I wrote the following pages, or rather the bulk of them...',
            'text_vector': [0.3, 0.2, 0.3, 0.2, 0.5],
            'chapter': 'Economy',
        },
        {
            'text': 'I would fain say something, not so much concerning the Chinese and...',
            'text_vector': [0.7, 0.4, 0.2, 0.7, 0.8],
            'chapter': 'Economy'
        }
    ]
}

# insert data
client.insert(
    collection_name="my_collection",
    data=[data]
)
```

</TabItem>

<TabItem value='java'>

```java
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import io.milvus.v2.service.vector.request.InsertReq;
import io.milvus.v2.service.vector.response.InsertResp;

Gson gson = new Gson();
JsonObject row = new JsonObject();
row.addProperty("title", "Walden");
row.add("title_vector", gson.toJsonTree(Arrays.asList(0.1f, 0.2f, 0.3f, 0.4f, 0.5f)));
row.addProperty("author", "Henry David Thoreau");
row.addProperty("year_of_publication", 1845);

JsonArray structArr = new JsonArray();
JsonObject struct1 = new JsonObject();
struct1.addProperty("text", "When I wrote the following pages, or rather the bulk of them...");
struct1.add("text_vector", gson.toJsonTree(Arrays.asList(0.3f, 0.2f, 0.3f, 0.2f, 0.5f)));
struct1.addProperty("chapter", "Economy");
structArr.add(struct1);
JsonObject struct2 = new JsonObject();
struct2.addProperty("text", "I would fain say something, not so much concerning the Chinese and...");
struct2.add("text_vector", gson.toJsonTree(Arrays.asList(0.7f, 0.4f, 0.2f, 0.7f, 0.8f)));
struct2.addProperty("chapter", "Economy");
structArr.add(struct2);

row.add("chunks", structArr);

InsertResp insertResp = client.insert(InsertReq.builder()
        .collectionName("my_collection")
        .data(Collections.singletonList(row))
        .build());
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```javascript
  {
    id: 0,
    title: "Walden",
    title_vector: [0.1, 0.2, 0.3, 0.4, 0.5],
    author: "Henry David Thoreau",
    "year-of-publication": 1845,
    chunks: [
      {
        text: "When I wrote the following pages, or rather the bulk of them...",
        text_vector: [0.3, 0.2, 0.3, 0.2, 0.5],
        chapter: "Economy",
      },
      {
        text: "I would fain say something, not so much concerning the Chinese and...",
        text_vector: [0.7, 0.4, 0.2, 0.7, 0.8],
        chapter: "Economy",
      },
    ],
  },
];

await milvusClient.insert({
  collection_name: "books",
  data: data,
});
```

</TabItem>

<TabItem value='java'>

```bash
# restful
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/entities/insert" \
  -H "Content-Type: application/json" \
  -d '{
    "collectionName": "my_collection",
    "data": [
      {
        "title": "Walden",
        "title_vector": [0.1, 0.2, 0.3, 0.4, 0.5],
        "author": "Henry David Thoreau",
        "year_of_publication": 1845,
        "chunks": [
          {
            "text": "When I wrote the following pages, or rather the bulk of them...",
            "text_vector": [0.3, 0.2, 0.3, 0.2, 0.5],
            "chapter": "Economy"
          },
          {
            "text": "I would fain say something, not so much concerning the Chinese and...",
            "text_vector": [0.7, 0.4, 0.2, 0.7, 0.8],
            "chapter": "Economy"
          }
        ]
      }
    ]
  }'
```

</TabItem>
</Tabs>

<details>

<summary>さらにデータが必要ですか?</summary>

```python
import json
import random
from typing import List, Dict, Any

# Real classic books (title, author, year)
BOOKS = [
    ("Pride and Prejudice", "Jane Austen", 1813),
    ("Moby Dick", "Herman Melville", 1851),
    ("Frankenstein", "Mary Shelley", 1818),
    ("The Picture of Dorian Gray", "Oscar Wilde", 1890),
    ("Dracula", "Bram Stoker", 1897),
    ("The Adventures of Sherlock Holmes", "Arthur Conan Doyle", 1892),
    ("Alice's Adventures in Wonderland", "Lewis Carroll", 1865),
    ("The Time Machine", "H.G. Wells", 1895),
    ("The Scarlet Letter", "Nathaniel Hawthorne", 1850),
    ("Leaves of Grass", "Walt Whitman", 1855),
    ("The Brothers Karamazov", "Fyodor Dostoevsky", 1880),
    ("Crime and Punishment", "Fyodor Dostoevsky", 1866),
    ("Anna Karenina", "Leo Tolstoy", 1877),
    ("War and Peace", "Leo Tolstoy", 1869),
    ("Great Expectations", "Charles Dickens", 1861),
    ("Oliver Twist", "Charles Dickens", 1837),
    ("Wuthering Heights", "Emily Brontë", 1847),
    ("Jane Eyre", "Charlotte Brontë", 1847),
    ("The Call of the Wild", "Jack London", 1903),
    ("The Jungle Book", "Rudyard Kipling", 1894),
]

# Common chapter names for classics
CHAPTERS = [
    "Introduction", "Prologue", "Chapter I", "Chapter II", "Chapter III",
    "Chapter IV", "Chapter V", "Chapter VI", "Chapter VII", "Chapter VIII",
    "Chapter IX", "Chapter X", "Epilogue", "Conclusion", "Afterword",
    "Economy", "Where I Lived", "Reading", "Sounds", "Solitude",
    "Visitors", "The Bean-Field", "The Village", "The Ponds", "Baker Farm"
]

# Placeholder text snippets (mimicking 19th-century prose)
TEXT_SNIPPETS = [
    "When I wrote the following pages, or rather the bulk of them...",
    "I would fain say something, not so much concerning the Chinese and...",
    "It is a truth universally acknowledged, that a single man in possession...",
    "Call me Ishmael. Some years ago—never mind how long precisely...",
    "It was the best of times, it was the worst of times...",
    "All happy families are alike; each unhappy family is unhappy in its own way.",
    "Whether I shall turn out to be the hero of my own life, or whether that station...",
    "You will rejoice to hear that no disaster has accompanied the commencement...",
    "The world is too much with us; late and soon, getting and spending...",
    "He was an old man who fished alone in a skiff in the Gulf Stream..."
]

def random_vector() -> List[float]:
    return [round(random.random(), 1) for _ in range(5)]

def generate_chunk() -> Dict[str, Any]:
    return {
        "text": random.choice(TEXT_SNIPPETS),
        "text_vector": random_vector(),
        "chapter": random.choice(CHAPTERS)
    }

def generate_record(record_id: int) -> Dict[str, Any]:
    title, author, year = random.choice(BOOKS)
    num_chunks = random.randint(1, 5)  # 1 to 5 chunks per book
    chunks = [generate_chunk() for _ in range(num_chunks)]
    return {
        "title": title,
        "title_vector": random_vector(),
        "author": author,
        "year_of_publication": year,
        "chunks": chunks
    }

# Generate 1000 records
data = [generate_record(i) for i in range(1000)]

# Insert the generated data
client.insert(collection_name="my_collection", data=data)
```

</details>

## 配列 of 構造体s フィールドに対するベクトル検索\{#vector-search-against-an-array-of-structs-field}

コレクションのベクトルフィールドおよび 配列 of 構造体s 内のベクトルフィールドに対してベクトル検索を実行できます。

具体的には、検索リクエストの `anns_field` パラメータの値として、配列 of 構造体s フィールド名と 構造体 要素内の対象ベクトルフィールド名を連結し、さらにクエリベクトルを整理するために `EmbeddingList` を使用する必要があります。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloud は、配列 of 構造体s 内の埋め込みリスト（embedding list）に対して検索を行う際、クエリベクトルをより整理して扱えるように <code>EmbeddingList</code> を提供しています。<code>EmbeddingList</code> には少なくとも1つのベクトル埋め込みが含まれ、返されるべき上位K件のエンティティ数を指定します。</p>
<p>ただし、<code>EmbeddingList</code> は範囲検索やグループ化検索のパラメータを含まない <code>search()</code> リクエストでのみ使用可能であり、<code>search_iterator()</code> リクエストでは使用できません。</p>

</Admonition>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus.client.embedding_list import EmbeddingList

# each query embedding list triggers a single search
embeddingList1 = EmbeddingList()
embeddingList1.add([0.2, 0.9, 0.4, -0.3, 0.2])

embeddingList2 = EmbeddingList()
embeddingList2.add([-0.2, -0.2, 0.5, 0.6, 0.9])
embeddingList2.add([-0.4, 0.3, 0.5, 0.8, 0.2])

# a search with a single embedding list
results = client.search(
    collection_name="my_collection",
    data=[ embeddingList1 ],
    anns_field="chunks[text_vector]",
    search_params={"metric_type": "MAX_SIM_COSINE"},
    limit=3,
    output_fields=["chunks[text]"]
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.data.EmbeddingList;
import io.milvus.v2.service.vector.request.data.FloatVec;

EmbeddingList embeddingList1 = new EmbeddingList();
embeddingList1.add(new FloatVec(new float[]{0.2f, 0.9f, 0.4f, -0.3f, 0.2f}));

EmbeddingList embeddingList2 = new EmbeddingList();
embeddingList2.add(new FloatVec(new float[]{-0.2f, -0.2f, 0.5f, 0.6f, 0.9f}));
embeddingList2.add(new FloatVec(new float[]{-0.4f, 0.3f, 0.5f, 0.8f, 0.2f}));

Map<String, Object> params = new HashMap<>();
params.put("metric_type", "MAX_SIM_COSINE");
SearchResp searchResp = client.search(SearchReq.builder()
        .collectionName("my_collection")
        .annsField("chunks[text_vector]")
        .data(Collections.singletonList(embeddingList1))
        .searchParams(params)
        .limit(3)
        .outputFields(Collections.singletonList("chunks[text]"))
        .build());
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```javascript
const embeddingList1 = [[0.2, 0.9, 0.4, -0.3, 0.2]];
const embeddingList2 = [
  [-0.2, -0.2, 0.5, 0.6, 0.9],
  [-0.4, 0.3, 0.5, 0.8, 0.2],
];
const results = await milvusClient.search({
  collection_name: "books",
  data: embeddingList1,
  anns_field: "chunks[text_vector]",
  search_params: { metric_type: "MAX_SIM_COSINE" },
  limit: 3,
  output_fields: ["chunks[text]"],
});

```

</TabItem>

<TabItem value='java'>

```bash
# restful
embeddingList1='[[0.2,0.9,0.4,-0.3,0.2]]'
embeddingList2='[[-0.2,-0.2,0.5,0.6,0.9],[-0.4,0.3,0.5,0.8,0.2]]'
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/entities/search" \
  -H "Content-Type: application/json" \
  -d "{
    \"collectionName\": \"my_collection\",
    \"data\": [$embeddingList1],
    \"annsField\": \"chunks[text_vector]\",
    \"searchParams\": {\"metric_type\": \"MAX_SIM_COSINE\"},
    \"limit\": 3,
    \"outputFields\": [\"chunks[text]\"]
  }"
```

</TabItem>
</Tabs>

上記の検索リクエストでは、`chunks[text_vector]` を使用して 構造体 要素内の `text_vector` フィールドを参照しています。この構文を使用して、`anns_field` パラメータおよび `output_fields` パラメータを設定できます。

出力は、最も類似した上位3つのエンティティのリストになります。

<details>

<summary>出力</summary>

```python
# [
#     [
#         {
#             'id': 461417939772144945,
#             'distance': 0.9675756096839905,
#             'entity': {
#                 'chunks': [
#                     {'text': 'The world is too much with us; late and soon, getting and spending...'},
#                     {'text': 'All happy families are alike; each unhappy family is unhappy in its own way.'}
#                 ]
#             }
#         },
#         {
#             'id': 461417939772144965,
#             'distance': 0.9555778503417969,
#             'entity': {
#                 'chunks': [
#                     {'text': 'Call me Ishmael. Some years ago—never mind how long precisely...'},
#                     {'text': 'He was an old man who fished alone in a skiff in the Gulf Stream...'},
#                     {'text': 'When I wrote the following pages, or rather the bulk of them...'},
#                     {'text': 'It was the best of times, it was the worst of times...'},
#                     {'text': 'The world is too much with us; late and soon, getting and spending...'}
#                 ]
#             }
#         },
#         {
#             'id': 461417939772144962,
#             'distance': 0.9469035863876343,
#             'entity': {
#                 'chunks': [
#                     {'text': 'Call me Ishmael. Some years ago—never mind how long precisely...'},
#                     {'text': 'The world is too much with us; late and soon, getting and spending...'},
#                     {'text': 'He was an old man who fished alone in a skiff in the Gulf Stream...'},
#                     {'text': 'Call me Ishmael. Some years ago—never mind how long precisely...'},
#                     {'text': 'The world is too much with us; late and soon, getting and spending...'}
#                 ]
#             }
#         }
#     ]
# ]
```

</details>

`data` パラメータに複数の埋め込みリストを含めることもでき、これらの各埋め込みリストに対する検索結果を取得できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# a search with multiple embedding lists
results = client.search(
    collection_name="my_collection",
    data=[ embeddingList1, embeddingList2 ],
    anns_field="chunks[text_vector]",
    search_params={"metric_type": "MAX_SIM_COSINE"},
    limit=3,
    output_fields=["chunks[text]"]
)

print(results)
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> params = new HashMap<>();
params.put("metric_type", "MAX_SIM_COSINE");
SearchResp searchResp = client.search(SearchReq.builder()
        .collectionName("my_collection")
        .annsField("chunks[text_vector]")
        .data(Arrays.asList(embeddingList1, embeddingList2))
        .searchParams(params)
        .limit(3)
        .outputFields(Collections.singletonList("chunks[text]"))
        .build());
        
List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
for (int i = 0; i < searchResults.size(); i++) {
    System.out.println("Results of No." + i + " embedding list");
    List<SearchResp.SearchResult> results = searchResults.get(i);
    for (SearchResp.SearchResult result : results) {
        System.out.println(result);
    }
}
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```javascript
const results2 = await milvusClient.search({
  collection_name: "books",
  data: [embeddingList1, embeddingList2],
  anns_field: "chunks[text_vector]",
  search_params: { metric_type: "MAX_SIM_COSINE" },
  limit: 3,
  output_fields: ["chunks[text]"],
});
```

</TabItem>

<TabItem value='java'>

```bash
# restful
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/entities/search" \
  -H "Content-Type: application/json" \
  -d "{
    \"collectionName\": \"my_collection\",
    \"data\": [$embeddingList1, $embeddingList2],
    \"annsField\": \"chunks[text_vector]\",
    \"searchParams\": {\"metric_type\": \"MAX_SIM_COSINE\"},
    \"limit\": 3,
    \"outputFields\": [\"chunks[text]\"]
  }"
```

</TabItem>
</Tabs>

出力は、各埋め込みリストに対して最も類似した上位3つのエンティティのリストになります。

<details>

<summary>出力</summary>

```python
# [
#   [
#     {
#       'id': 461417939772144945,
#       'distance': 0.9675756096839905,
#       'entity': {
#         'chunks': [
#           {'text': 'The world is too much with us; late and soon, getting and spending...'},
#           {'text': 'All happy families are alike; each unhappy family is unhappy in its own way.'}
#         ]
#       }
#     },
#     {
#       'id': 461417939772144965,
#       'distance': 0.9555778503417969,
#       'entity': {
#         'chunks': [
#           {'text': 'Call me Ishmael. Some years ago—never mind how long precisely...'},
#           {'text': 'He was an old man who fished alone in a skiff in the Gulf Stream...'},
#           {'text': 'When I wrote the following pages, or rather the bulk of them...'},
#           {'text': 'It was the best of times, it was the worst of times...'},
#           {'text': 'The world is too much with us; late and soon, getting and spending...'}
#         ]
#       }
#     },
#     {
#       'id': 461417939772144962,
#       'distance': 0.9469035863876343,
#       'entity': {
#         'chunks': [
#           {'text': 'Call me Ishmael. Some years ago—never mind how long precisely...'},
#           {'text': 'The world is too much with us; late and soon, getting and spending...'},
#           {'text': 'He was an old man who fished alone in a skiff in the Gulf Stream...'},
#           {'text': 'Call me Ishmael. Some years ago—never mind how long precisely...'},
#           {'text': 'The world is too much with us; late and soon, getting and spending...'}
#         ]
#       }
#     }
#   ],
#   [
#     {
#       'id': 461417939772144663,
#       'distance': 1.9761409759521484,
#       'entity': {
#         'chunks': [
#           {'text': 'It was the best of times, it was the worst of times...'},
#           {'text': 'It is a truth universally acknowledged, that a single man in possession...'},
#           {'text': 'Whether I shall turn out to be the hero of my own life, or whether that station...'},
#           {'text': 'He was an old man who fished alone in a skiff in the Gulf Stream...'}
#         ]
#       }
#     },
#     {
#       'id': 461417939772144692,
#       'distance': 1.974656581878662,
#       'entity': {
#         'chunks': [
#           {'text': 'It is a truth universally acknowledged, that a single man in possession...'},
#           {'text': 'Call me Ishmael. Some years ago—never mind how long precisely...'}
#         ]
#       }
#     },
#     {
#       'id': 461417939772144662,
#       'distance': 1.9406685829162598,
#       'entity': {
#         'chunks': [
#           {'text': 'It is a truth universally acknowledged, that a single man in possession...'}
#         ]
#       }
#     }
#   ]
# ]
```

</details>

上記のコード例では、`embeddingList1` は1つのベクトルからなる埋め込みリストであり、一方 `embeddingList2` は2つのベクトルを含んでいます。それぞれが個別の検索リクエストをトリガーし、上位K件の類似エンティティのリストを返します。

## Next steps\{#next-steps}

ネイティブな 構造体 の配列（配列 of 構造体s）データ型の開発は、Zilliz Cloud が複雑なデータ構造を扱う能力において大きな進歩を示しています。この新機能のユースケースをより深く理解し、その効果を最大限に引き出すために、[Schema Design Using an 配列 of 構造体s](./schema-design-with-structs) をぜひお読みください。

