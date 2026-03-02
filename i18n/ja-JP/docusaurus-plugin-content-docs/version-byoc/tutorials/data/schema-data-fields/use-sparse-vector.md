---
title: "疎ベクトル | BYOC"
slug: /use-sparse-vector
sidebar_label: "疎ベクトル"
beta: FALSE
notebook: FALSE
description: "疎ベクトルは、情報検索や自然言語処理において、表面的な用語の一致を捉えるための重要な手法です。密ベクトルが意味理解に優れているのに対し、疎ベクトルは、特に特殊な用語やテキスト識別子を検索する際に、より予測可能なマッチング結果を提供することがよくあります。 | BYOC"
type: origin
token: JbPDwHqd0iZZSuk5tYicGqKbn9c
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - 疎ベクトル
  - ベクトルDB比較
  - OpenAI ベクトルDB
  - 自然言語処理データベース
  - 安価なベクトルデータベース

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# スパースベクトル

スパースベクトルは、情報検索や自然言語処理において、表面的な用語マッチングを捉えるための重要な手法です。密ベクトルが意味理解に優れているのに対し、スパースベクトルは、特に特殊な用語やテキスト識別子を検索する際に、より予測可能なマッチング結果を提供することがよくあります。

## 概要{#overview}

スパースベクトルは、ほとんどの要素がゼロであり、少数の次元のみが非ゼロ値を持つ特殊な高次元ベクトルです。以下の図に示すように、密ベクトルは通常、各位置に値を持つ連続した配列として表現されます（例：`[0.3, 0.8, 0.2, 0.3, 0.1]`）。対照的に、スパースベクトルは非ゼロ要素とその次元のインデックスのみを格納し、多くの場合、`{ index: value}` のキーと値のペアとして表現されます（例：`[{2: 0.2}, ..., {9997: 0.5}, {9999: 0.7}]`）。

![VPhswBhHmhJrh3byaVnc3onYnPc](https://zdoc-images.s3.us-west-2.amazonaws.com/VPhswBhHmhJrh3byaVnc3onYnPc.png)

トークン化とスコアリングにより、ドキュメントは単語の袋ベクトルとして表現でき、各次元は語彙内の特定の単語に対応します。ドキュメント内に存在する単語のみが非ゼロ値を持つため、スパースベクトル表現が作成されます。スパースベクトルは、次の2つのアプローチを使用して生成できます。

- **従来の統計的手法**、例えば [TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) (Term Frequency-Inverse Document Frequency) や [BM25](https://en.wikipedia.org/wiki/Okapi_BM25) (Best Matching 25) は、コーパス全体での単語の頻度と重要度に基づいて単語に重みを割り当てます。これらの手法は、各次元（トークンを表す）のスコアとして単純な統計を計算します。Zilliz Cloud は、BM25 メソッドによる組み込みの **full text search** を提供しており、テキストを自動的にスパースベクトルに変換するため、手動での前処理は不要です。このアプローチは、精度と完全一致が重要なキーワードベースの検索に最適です。詳細については、[Full Text Search](./full-text-search) を参照してください。

- **ニューラルスパース埋め込みモデル**は、大規模なデータセットでトレーニングすることにより、スパース表現を生成する学習済み手法です。これらは通常、Transformer アーキテクチャを持つ深層学習モデルであり、意味的コンテキストに基づいて用語を拡張および重み付けできます。Zilliz Cloud は、[SPLADE](https://arxiv.org/abs/2109.10086) のようなモデルから外部で生成されたスパース埋め込みもサポートしています。詳細については、[Embeddings](https://milvus.io/docs/embeddings.md#Embedding-Overview) を参照してください。

スパースベクトルと元のテキストは、効率的な検索のために Zilliz Cloud に保存できます。以下の図は、全体的なプロセスを示しています。

![A7FvwnB5bhpBlKbgrzYcQijbnxg](https://zdoc-images.s3.us-west-2.amazonaws.com/A7FvwnB5bhpBlKbgrzYcQijbnxg.png)

<Admonition type="info" icon="📘" title="Notes">

<p>スパースベクトルに加えて、Zilliz Cloud は密ベクトルとバイナリベクトルもサポートしています。密ベクトルは深い意味関係を捉えるのに理想的であり、バイナリベクトルは高速な類似性比較やコンテンツの重複排除などのシナリオで優れています。詳細については、<a href="./use-dense-vector">密ベクトル</a>と<a href="./use-binary-vector">バイナリベクトル</a>を参照してください。</p>

</Admonition>

## データ形式{#data-formats}

以下のセクションでは、SPLADE のような学習済みスパース埋め込みモデルからベクトルを保存する方法を説明します。密ベクトルベースのセマンティック検索を補完するものを探している場合は、簡潔さのために SPLADE よりも BM25 を使用した [Full Text Search](./full-text-search) をお勧めします。品質評価を実行し、SPLADE を使用することを決定した場合は、SPLADE でスパースベクトルを生成する方法について [Embeddings](https://milvus.io/docs/embeddings.md#Embedding-Overview) を参照してください。

Zilliz Cloud は、以下の形式のスパースベクトル入力をサポートしています。

- **辞書のリスト（`{dimension_index: value, ...}` の形式）**

    ```python
    # Represent each sparse vector using a dictionary
    sparse_vectors = [{27: 0.5, 100: 0.3, 5369: 0.6} , {100: 0.1, 3: 0.8}]
    ```

- **疎行列 ( `scipy.sparse` クラスを使用)**

    ```python
    from scipy.sparse import csr_matrix
    
    # First vector: indices [27, 100, 5369] with values [0.5, 0.3, 0.6]
    # Second vector: indices [3, 100] with values [0.8, 0.1]
    indices = [[27, 100, 5369], [3, 100]]
    values = [[0.5, 0.3, 0.6], [0.8, 0.1]]
    sparse_vectors = [csr_matrix((vals, ([0]*len(idx), idx)), shape=(1, 5369+1)) for idx, vals in zip(indices, values)]
    ```

- **タプルイテラブルのリスト (例:** `[(dimension_index, value)]`**)**

    ```python
    # Represent each sparse vector using a list of iterables (e.g. tuples)
    sparse_vector = [
        [(27, 0.5), (100, 0.3), (5369, 0.6)],
        [(100, 0.1), (3, 0.8)]
        ]
    ```

## コレクションスキーマの定義\{#define-collection-schema}

コレクションを作成する前に、コレクションスキーマを指定する必要があります。これは、フィールドと、オプションでテキストフィールドを対応する疎ベクトル表現に変換する関数を定義します。

### フィールドの追加\{#add-fields}

Zilliz Cloudクラスターで疎ベクトルを使用するには、以下のフィールドを含むスキーマを持つコレクションを作成する必要があります。

- 疎ベクトルを保存するために予約された`SPARSE_FLOAT_VECTOR`フィールド。これは、`VARCHAR`フィールドから自動生成されるか、入力データで直接提供されます。

- 通常、疎ベクトルが表す生テキストもコレクションに保存されます。生テキストを保存するには、`VARCHAR`フィールドを使用できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

schema = client.create_schema(
    auto_id=True,
    enable_dynamic_fields=True,
)

schema.add_field(field_name="pk", datatype=DataType.VARCHAR, is_primary=True, max_length=100)
schema.add_field(field_name="sparse_vector", datatype=DataType.SPARSE_FLOAT_VECTOR)
schema.add_field(field_name="text", datatype=DataType.VARCHAR, max_length=65535, enable_analyzer=True)
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
        .fieldName("pk")
        .dataType(DataType.VarChar)
        .isPrimaryKey(true)
        .autoID(true)
        .maxLength(100)
        .build());
schema.addField(AddFieldReq.builder()
        .fieldName("sparse_vector")
        .dataType(DataType.SparseFloatVector)
        .build());
schema.addField(AddFieldReq.builder()
        .fieldName("text")
        .dataType(DataType.VarChar)
        .maxLength(65535)
        .enableAnalyzer(true)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
import { DataType } from "@zilliz/milvus2-sdk-node";

const schema = [
  {
    name: "metadata",
    data_type: DataType.JSON,
  },
  {
    name: "pk",
    data_type: DataType.Int64,
    is_primary_key: true,
  },
  {
    name: "sparse_vector",
    data_type: DataType.SparseFloatVector,
  },
  {
    name: "text",
    data_type: "VarChar",
    enable_analyzer: true,
    enable_match: true,
    max_length: 65535,
  },
];

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
    WithName("pk").
    WithDataType(entity.FieldTypeVarChar).
    WithIsAutoID(true).
    WithIsPrimaryKey(true).
    WithMaxLength(100),
).WithField(entity.NewField().
    WithName("sparse_vector").
    WithDataType(entity.FieldTypeSparseVector),
).WithField(entity.NewField().
    WithName("text").
    WithDataType(entity.FieldTypeVarChar).
    WithEnableAnalyzer(true).
    WithMaxLength(65535),
)
```

</TabItem>

<TabItem value='bash'>

```bash
export primaryField='{
    "fieldName": "pk",
    "dataType": "VarChar",
    "isPrimary": true,
    "elementTypeParams": {
        "max_length": 100
    }
}'

export vectorField='{
    "fieldName": "sparse_vector",
    "dataType": "SparseFloatVector"
}'

export textField='{
    "fieldName": "text",
    "dataType": "VarChar",
    "elementTypeParams": {
        "max_length": 65535,
        "enable_analyzer": true
    }
}'

export schema="{
    \"autoID\": true,
    \"fields\": [
        $primaryField,
        $vectorField,
        $textField
    ]
}"
```

</TabItem>
</Tabs>

この例では、3つのフィールドが追加されています。

- `pk`: このフィールドは、`VARCHAR`データ型を使用して主キーを格納します。最大長は100バイトで、自動生成されます。

- `sparse_vector`: このフィールドは、`SPARSE_FLOAT_VECTOR`データ型を使用して疎ベクトルを格納します。

- `text`: このフィールドは、`VARCHAR`データ型を使用してテキスト文字列を格納します。最大長は65535バイトです。

<Admonition type="info" icon="📘" title="Notes">

<p>データ挿入時に、指定されたテキストフィールドから疎ベクトル埋め込みを生成できるようにするには、関数を含む追加の手順が必要です。詳細については、<a href="./full-text-search">Full Text Search</a>を参照してください。</p>

</Admonition>

## インデックスパラメータの設定{#set-index-parameters}

疎ベクトル用のインデックスを作成するプロセスは、[密ベクトル](./use-dense-vector)の場合と似ていますが、指定するインデックスタイプ（`index_type`）、距離メトリック（`metric_type`）、およびインデックスパラメータ（`params`）が異なります。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
index_params = client.prepare_index_params()

index_params.add_index(
    field_name="sparse_vector",
    index_name="sparse_auto_index",
    index_type="AUTOINDEX",
    metric_type="IP"
)

```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.IndexParam;
import java.util.*;

List<IndexParam> indexes = new ArrayList<>();

indexes.add(IndexParam.builder()
        .fieldName("sparse_vector")
        .indexName("sparse_auto_index")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.IP)
        .build());

```

</TabItem>

<TabItem value='javascript'>

```javascript

const indexParams = await client.createIndex({
    field_name: 'sparse_vector',
    metric_type: MetricType.IP,
    index_name: 'sparse_auto_index',
    index_type: IndexType.AUTOINDEX,
});

```

</TabItem>

<TabItem value='go'>

```go
idx := index.NewSparseInvertedIndex(entity.IP, 0.2)
indexOption := milvusclient.NewCreateIndexOption("my_collection", "sparse_vector", idx)
```

</TabItem>

<TabItem value='bash'>

```bash

export indexParams='[
        {
            "fieldName": "sparse_vector",
            "metricType": "IP",
            "indexName": "sparse_auto_index",
            "indexType": "AUTOINDEX"
        }
    ]'

```

</TabItem>
</Tabs>

この例では、`SPARSE_INVERTED_INDEX` インデックスタイプを `IP` メトリックで使用しています。詳細については、以下のリソースを参照してください。

- [メトリックタイプ](./search-metrics-explained): さまざまなフィールドタイプでサポートされているメトリックタイプ

- [フルテキスト検索](./full-text-search): フルテキスト検索に関する詳細なチュートリアル

## コレクションの作成{#create-collection}

疎ベクトルとインデックスの設定が完了したら、疎ベクトルを含むコレクションを作成できます。以下の例では、`create_collection` メソッドを使用して `my_collection` という名前のコレクションを作成します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
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

<TabItem value='javascript'>

```javascript
import { MilvusClient } from "@zilliz/milvus2-sdk-node";

const client = new MilvusClient({
    address: 'YOUR_CLUSTER_ENDPOINT'
});

await client.createCollection({
    collection_name: 'my_collection',
    schema: schema,
    index_params: indexParams
});
```

</TabItem>

<TabItem value='go'>

```go
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

## データの挿入{#insert-data}

コレクション作成時に定義されたすべてのフィールドにデータを提供する必要があります。ただし、自動生成されるフィールド（`auto_id`が有効な主キーなど）は除きます。組み込みのBM25関数を使用して疎ベクトルを自動生成する場合、データ挿入時には疎ベクトルフィールドも省略する必要があります。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
data = [
    {
        "text": "information retrieval is a field of study.",
        "sparse_vector": {1: 0.5, 100: 0.3, 500: 0.8}
    },
    {
        "text": "information retrieval focuses on finding relevant information in large datasets.",
        "sparse_vector": {10: 0.1, 200: 0.7, 1000: 0.9}
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

import java.util.ArrayList;
import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;

Gson gson = new Gson();
List<JsonObject> rows = new ArrayList<>();

{
    JsonObject row = new JsonObject();
    row.addProperty("text", "information retrieval is a field of study.");
    
    SortedMap<Long, Float> sparse = new TreeMap<>();
    sparse.put(1L, 0.5f);
    sparse.put(100L, 0.3f);
    sparse.put(500L, 0.8f);
    row.add("sparse_vector", gson.toJsonTree(sparse));
    rows.add(row);
}
{
    JsonObject row = new JsonObject();
    row.addProperty("text", "information retrieval focuses on finding relevant information in large datasets.");
    
    SortedMap<Long, Float> sparse = new TreeMap<>();
    sparse.put(10L, 0.1f);
    sparse.put(200L, 0.7f);
    sparse.put(1000L, 0.9f);
    row.add("sparse_vector", gson.toJsonTree(sparse));
    rows.add(row);
}

InsertResp insertResp = client.insert(InsertReq.builder()
        .collectionName("my_collection")
        .data(rows)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
const data = [
    {
        text: 'information retrieval is a field of study.',
        sparse_vector: {1: 0.5, 100: 0.3, 500: 0.8}
    {
        text: 'information retrieval focuses on finding relevant information in large datasets.',
        sparse_vector: {10: 0.1, 200: 0.7, 1000: 0.9}
    },
];

client.insert({
    collection_name: "my_collection",
    data: data
});
```

</TabItem>

<TabItem value='go'>

```go
texts := []string{
    "information retrieval is a field of study.",
    "information retrieval focuses on finding relevant information in large datasets.",
}
textColumn := entity.NewColumnVarChar("text", texts)

// Prepare sparse vectors
sparseVectors := make([]entity.SparseEmbedding, 0, 2)
sparseVector1, _ := entity.NewSliceSparseEmbedding([]uint32{1, 100, 500}, []float32{0.5, 0.3, 0.8})
sparseVectors = append(sparseVectors, sparseVector1)
sparseVector2, _ := entity.NewSliceSparseEmbedding([]uint32{10, 200, 1000}, []float32{0.1, 0.7, 0.9})
sparseVectors = append(sparseVectors, sparseVector2)
sparseVectorColumn := entity.NewColumnSparseVectors("sparse_vector", sparseVectors)

_, err = client.Insert(ctx, milvusclient.NewColumnBasedInsertOption("my_collection").
    WithColumns(
        sparseVectorColumn,
        textColumn
        
    ))
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
        {
            "text": "information retrieval is a field of study.",
            "sparse_vector": {"1": 0.5, "100": 0.3, "500": 0.8}
        },
        {
            "text": "information retrieval focuses on finding relevant information in large datasets.",
            "sparse_vector": {"10": 0.1, "200": 0.7, "1000": 0.9}
        }     
    ],
    "collectionName": "my_collection"
}'
```

</TabItem>
</Tabs>

## ベクトル類似性検索の実行{#perform-similarity-search}

スパースベクトルを使用して類似性検索を実行するには、クエリデータと検索パラメータの両方を準備します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Prepare search parameters
search_params = {
    "params": {"drop_ratio_search": 0.2},  # A tunable drop ratio parameter with a valid range between 0 and 1
}

# Query with sparse vector
query_data = [{1: 0.2, 50: 0.4, 1000: 0.7}]
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.data.EmbeddedText;
import io.milvus.v2.service.vector.request.data.SparseFloatVec;

// Prepare search parameters
Map<String,Object> searchParams = new HashMap<>();
searchParams.put("drop_ratio_search", 0.2);

// Query with the sparse vector
SortedMap<Long, Float> sparse = new TreeMap<>();
sparse.put(1L, 0.2f);
sparse.put(50L, 0.4f);
sparse.put(1000L, 0.7f);
SparseFloatVec queryData = new SparseFloatVec(sparse);
```

</TabItem>

<TabItem value='go'>

```go
// Prepare search parameters
annSearchParams := index.NewCustomAnnParam()
annSearchParams.WithExtraParam("drop_ratio_search", 0.2)

// Query with the sparse vector
queryData, _ := entity.NewSliceSparseEmbedding([]uint32{1, 50, 1000}, []float32{0.2, 0.4, 0.7})
```

</TabItem>

<TabItem value='javascript'>

```javascript
// Prepare search parameters
const searchParams = {drop_ratio_search: 0.2}

// Query with the sparse vector
const queryData = [{1: 0.2, 50: 0.4, 1000: 0.7}]
```

</TabItem>

<TabItem value='bash'>

```bash
# Prepare search parameters
export queryData='["What is information retrieval?"]'

# Query with the sparse vector
export queryData='[{1: 0.2, 50: 0.4, 1000: 0.7}]'
```

</TabItem>
</Tabs>

次に、`search` メソッドを使用して類似性検索を実行します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.search(
    collection_name="my_collection",
    data=query_data,
    limit=3,
    output_fields=["pk"],
    search_params=search_params,
    consistency_level="Strong"
)

print(res)

# Output
# data: ["[{'id': '453718927992172266', 'distance': 0.6299999952316284, 'entity': {'pk': '453718927992172266'}}, {'id': '453718927992172265', 'distance': 0.10000000149011612, 'entity': {'pk': '453718927992172265'}}]"]
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.response.SearchResp;

SparseFloatVec queryVector = new SparseFloatVec(sparse);

SearchResp searchR = client.search(SearchReq.builder()
        .collectionName("my_collection")
        .data(Collections.singletonList(queryData))
        .annsField("sparse_vector")
        .searchParams(searchParams)
        .consistencyLevel(ConsistencyLevel.STRONG)
        .topK(3)
        .outputFields(Collections.singletonList("pk"))
        .build());
        
System.out.println(searchR.getSearchResults());

// Output
//
// [[SearchResp.SearchResult(entity={pk=457270974427187729}, score=0.63, id=457270974427187729), SearchResp.SearchResult(entity={pk=457270974427187728}, score=0.1, id=457270974427187728)]]
```

</TabItem>

<TabItem value='javascript'>

```javascript
await client.search({
    collection_name: 'my_collection',
    data: queryData,
    limit: 3,
    output_fields: ['pk'],
    params: searchParams,
    consistency_level: "Strong"
});
```

</TabItem>

<TabItem value='go'>

```go
resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "my_collection",
    3, // limit
    []entity.Vector{queryData},
).WithANNSField("sparse_vector").
    WithOutputFields("pk").
    WithAnnParam(annSearchParams))
if err != nil {
    fmt.Println(err.Error())
    // handle err
}

for _, resultSet := range resultSets {
    fmt.Println("IDs: ", resultSet.IDs.FieldData().GetScalars())
    fmt.Println("Scores: ", resultSet.Scores)
    fmt.Println("Pks: ", resultSet.GetColumn("pk").FieldData().GetScalars())
}

// Results:
//   IDs:  string_data:{data:"457270974427187705"  data:"457270974427187704"}
//   Scores:  [0.63 0.1]
//   Pks:  string_data:{data:"457270974427187705"  data:"457270974427187704"}

```

</TabItem>

<TabItem value='bash'>

```bash
export params='{
    "consistencyLevel": "Strong"
}'

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "data": $queryData,
    "annsField": "sparse_vector",
    "limit": 3,
    "searchParams": $searchParams,
    "outputFields": ["pk"],
    "params": $params
}'

## {"code":0,"cost":0,"data":[{"distance":0.63,"id":"453577185629572535","pk":"453577185629572535"},{"distance":0.1,"id":"453577185629572534","pk":"453577185629572534"}]}
```

</TabItem>
</Tabs>

類似性検索のパラメータに関する詳細は、[基本的なベクトル検索](./single-vector-search)を参照してください。

