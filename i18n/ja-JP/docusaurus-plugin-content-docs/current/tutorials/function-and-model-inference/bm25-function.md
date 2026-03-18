---
title: "BM25関数 | Cloud"
slug: /bm25-function
sidebar_label: "BM25関数"
beta: FALSE
notebook: FALSE
description: "BM25関数は、生テキストを疎ベクトルに変換し、語彙の関連性に基づいてドキュメントをスコアリングすることで、全文検索を可能にします。用語ベースのマッチングと頻度を考慮した重み付けを適用し、クエリ用語に密接に一致するテキストドキュメントの効率的な検索をサポートします。 | Cloud"
type: origin
token: YbChwcPMBim5ryk1EQocEbDenDd
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 関数
  - モデル
  - 推論
  - bm25

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Supademo from '@site/src/components/Supademo';

# BM25関数

**BM25関数**は、生テキストを**疎ベクトル**に変換し、語彙の関連性に基づいてドキュメントをスコアリングすることで、[全文検索](./full-text-search)を可能にします。これは、用語ベースのマッチングと頻度を考慮した重み付けを適用し、クエリ用語に密接に一致するテキストドキュメントの効率的な取得をサポートします。

ローカルテキスト関数として、BM25関数はZilliz Cloud内で実行され、モデル推論や外部統合を必要としません。テキストベースの検索シナリオに対して、決定的で透過的な取得メカニズムを提供します。

## BM25の仕組み\{#how-bm25-works}

[BM25](https://en.wikipedia.org/wiki/Okapi_BM25)アルゴリズムは、全文検索で広く使用されている用語ベースの関連性スコアリングアルゴリズムです。Zilliz Cloudでは、BM25はテキストを用語重み表現に変換し、分散疎インデックスを使用して上位*K*個のドキュメントを取得する疎検索パイプラインとして実装されています。

全体的なワークフローは、**ドキュメントの取り込み**と**クエリテキスト処理**という2つの対称的なパスで構成されており、同じテキスト分析ロジックを共有しています。

### ドキュメントの取り込み：テキストから疎表現へ\{#document-ingestion-from-text-to-sparse-representation}

ドキュメントが挿入されると、その生テキストはまず**[アナライザー](./analyzer-overview)**によって処理され、テキストを個々の用語にトークン化します。

たとえば、次のドキュメント：

```plaintext
"We are loving Milvus!"
```

次の用語に分析できます。

```plaintext
["we", "love", "milvus"]
```

各ドキュメントは、各用語がドキュメントに何回出現するかを記録する用語頻度（TF）表現として表されます。例：

```plaintext
{
  "we": 1,
  "love": 1,
  "milvus": 1
}
```

同時に、Zilliz Cloud はコーパスレベルの統計を更新します。これには以下が含まれます。

- 各用語のドキュメント頻度 (DF)

- 平均ドキュメント長

- 各用語をそれを含むドキュメントにマッピングするポスティングリスト

ドキュメントの TF 表現は**スパース埋め込み**に挿入され、用語のポスティングはスケーラブルな検索のためにノード間で分割されます。

### クエリテキストの処理: IDF 重み付けの適用\{#query-text-process-apply-idf-weighting}

テキストベースのクエリが発行されると、[ドキュメントの取り込み](./bm25-function#document-ingestion-from-text-to-sparse-representation)時に使用された**同じアナライザー**によって処理され、一貫した用語分割が保証されます。

たとえば、次のクエリの場合：

```plaintext
"who loves Milvus?"
```

に分析できます。

```plaintext
["who", "love", "milvus"]
```

クエリタームごとに、Zilliz Cloud はコーパス統計からその[逆文書頻度](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) (IDF) を検索します。IDF は、データセット全体でタームがどれだけ情報量があるかを反映します。まれなタームは高い重みを受け取り、一般的なタームは低い重みを受け取ります。

概念的には、これにより次のような IDF 重み付けされたクエリタームのセットが生成されます。

```plaintext
{
  "who": 0.1,
  "love": 0.5,
  "milvus": 1.2
}
```

### BM25 スコアリングとトップ K 検索リトリーバル\{#bm25-scoring-and-top-k-retrieval}

BM25 は、一致したクエリタームに基づいて関連性スコアを計算することでドキュメントをランク付けします。スコアリングは**タームレベル**で実行され、**ドキュメントレベル**で集計されます。

**タームレベルスコアリング**

ドキュメントに表示される各クエリタームについて、BM25 はタームレベルのスコアを計算します。

```plaintext
term_score =
  IDF(term) ×
  TF_boost(term, document, k1) ×
  length_normalization(document, b)
```

場所：

- **IDF(term)** は、コレクション内での用語の希少性を反映します。

- **TF_boost(…, k1)** は、用語の頻度とともに増加しますが、頻度が増加するにつれて飽和します。

- **length_normalization(…, b)** は、ドキュメントの長さに基づいてスコアを調整します。

**ドキュメントレベルのスコアリングとTop-K検索**

最終的なドキュメントスコアは、一致したすべてのクエリ用語の用語レベルのスコアの合計です。

```plaintext
document_score =
  sum of term_score over all matched query terms
```

ドキュメントは最終スコアによってランク付けされ、スコアが最も高い上位K個のドキュメントが返されます。

## 始める前に\{#before-you-start}

BM25関数を使用する前に、レキシカルな全文検索をサポートするようにコレクションスキーマを計画してください。

- **生コンテンツ用のテキストフィールド**

    コレクションには、生テキストを保存するための `VARCHAR` フィールドを含める必要があります。このフィールドは、全文検索のために処理されるテキストのソースです。

- **テキストフィールド用のアナライザー**

    テキストフィールドにはアナライザーを有効にする必要があります。アナライザーは、BM25関数によってレキシカルな関連性が計算される前に、テキストがどのようにトークン化および正規化されるかを定義します。

    デフォルトでは、Zilliz Cloudは空白と句読点に基づいてテキストをトークン化する組み込みアナライザーを提供します。アプリケーションがカスタムのトークン化または正規化動作を必要とする場合は、カスタムアナライザーを定義できます。詳細については、[ユースケースに適したアナライザーを選択する](./choose-the-right-analyzer-for-your-use-case)を参照してください。

- **BM25出力用のスパースベクトル**

    コレクションには、BM25関数によって生成されたスパース表現を保存するための `SPARSE_FLOAT_VECTOR` フィールドを含める必要があります。このフィールドは、全文検索中のインデックス作成と取得に使用されます。

これらのスキーマレベルの考慮事項が解決されたら、コレクションを作成し、BM25関数を使用するに進みます。

## ステップ1：BM25関数を使用してコレクションを作成する\{#step-1-create-a-collection-with-a-bm25-function}

BM25関数を使用するには、コレクションを作成するときにそれを定義する必要があります。この関数はコレクションスキーマの一部となり、データの挿入と検索中に自動的に適用されます。

### SDK経由\{#via-sdk}

#### スキーマフィールドを定義する\{#define-schema-fields}

コレクションスキーマには、少なくとも3つの必須フィールドを含める必要があります。

- **プライマリフィールド**: コレクション内の各エンティティを一意に識別します。

- **テキストフィールド** (`VARCHAR`): 生のテキストドキュメントを保存します。Zilliz CloudがBM25関連性ランキングのためにテキストを処理できるように、`enable_analyzer=True`を設定する必要があります。デフォルトでは、Zilliz Cloudはテキスト分析に[`standard`](./standard-analyzer)[アナライザー](./standard-analyzer)を使用します。異なるアナライザーを設定するには、[アナライザーの概要](./analyzer-overview)を参照してください。

- **スパースベクトルフィールド** (`SPARSE_FLOAT_VECTOR`): BM25関数によって自動的に生成されたスパース埋め込みを保存します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType, Function, FunctionType

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

schema = client.create_schema()

schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True, auto_id=True) # Primary field
# highlight-start
schema.add_field(field_name="text", datatype=DataType.VARCHAR, max_length=1000, enable_analyzer=True) # Text field
schema.add_field(field_name="sparse", datatype=DataType.SPARSE_FLOAT_VECTOR) # Sparse vector field; no dim required for sparse vectors
# highlight-end
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.DataType;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

CreateCollectionReq.CollectionSchema schema = CreateCollectionReq.CollectionSchema.builder()
        .build();
schema.addField(AddFieldReq.builder()
        .fieldName("id")
        .dataType(DataType.Int64)
        .isPrimaryKey(true)
        .autoID(true)
        .build());
schema.addField(AddFieldReq.builder()
        .fieldName("text")
        .dataType(DataType.VarChar)
        .maxLength(1000)
        .enableAnalyzer(true)
        .build());
schema.addField(AddFieldReq.builder()
        .fieldName("sparse")
        .dataType(DataType.SparseFloatVector)
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
    WithName("id").
    WithDataType(entity.FieldTypeInt64).
    WithIsPrimaryKey(true).
    WithIsAutoID(true),
).WithField(entity.NewField().
    WithName("text").
    WithDataType(entity.FieldTypeVarChar).
    WithEnableAnalyzer(true).
    WithMaxLength(1000),
).WithField(entity.NewField().
    WithName("sparse").
    WithDataType(entity.FieldTypeSparseVector),
)
```

</TabItem>

<TabItem value='java'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const address = "YOUR_CLUSTER_ENDPOINT";
const token = "YOUR_CLUSTER_TOKEN";
const client = new MilvusClient({address, token});
const schema = [
  {
    name: "id",
    data_type: DataType.Int64,
    is_primary_key: true,
  },
  {
    name: "text",
    data_type: "VarChar",
    enable_analyzer: true,
    enable_match: true,
    max_length: 1000,
  },
  {
    name: "sparse",
    data_type: DataType.SparseFloatVector,
  },
];

console.log(res.results)
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
                "fieldName": "text",
                "dataType": "VarChar",
                "elementTypeParams": {
                    "max_length": 1000,
                    "enable_analyzer": true
                }
            },
            {
                "fieldName": "sparse",
                "dataType": "SparseFloatVector"
            }
        ]
    }'
```

</TabItem>
</Tabs>

#### BM25関数を定義する\{#define-the-bm25-function}

BM25関数は、トークン化されたテキストをBM25スコアリングをサポートする疎ベクトルに変換します。

関数を定義し、スキーマに追加します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
bm25_function = Function(
    name="text_bm25_emb", # Function name
    input_field_names=["text"], # Name of the VARCHAR field containing raw text data
    output_field_names=["sparse"], # Name of the SPARSE_FLOAT_VECTOR field reserved to store generated embeddings
    # highlight-next-line
    function_type=FunctionType.BM25, # Set to `BM25`
)

schema.add_function(bm25_function)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.common.clientenum.FunctionType;
import io.milvus.v2.service.collection.request.CreateCollectionReq.Function;

import java.util.*;

schema.addFunction(Function.builder()
        .functionType(FunctionType.BM25)
        .name("text_bm25_emb")
        .inputFieldNames(Collections.singletonList("text"))
        .outputFieldNames(Collections.singletonList("sparse"))
        .build());
```

</TabItem>

<TabItem value='java'>

```go
function := entity.NewFunction().
    WithName("text_bm25_emb").
    WithInputFields("text").
    WithOutputFields("sparse").
    WithType(entity.FunctionTypeBM25)
schema.WithFunction(function)
```

</TabItem>

<TabItem value='java'>

```javascript
const functions = [
    {
      name: 'text_bm25_emb',
      description: 'bm25 function',
      type: FunctionType.BM25,
      input_field_names: ['text'],
      output_field_names: ['sparse'],
      params: {},
    },
]；
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
                "fieldName": "text",
                "dataType": "VarChar",
                "elementTypeParams": {
                    "max_length": 1000,
                    "enable_analyzer": true
                }
            },
            {
                "fieldName": "sparse",
                "dataType": "SparseFloatVector"
            }
        ],
        "functions": [
            {
                "name": "text_bm25_emb",
                "type": "BM25",
                "inputFieldNames": ["text"],
                "outputFieldNames": ["sparse"],
                "params": {}
            }
        ]
    }'
```

</TabItem>
</Tabs>

#### インデックスの設定\{#configure-the-index}

必要なフィールドと組み込み関数でスキーマを定義したら、コレクションのインデックスを設定します。このプロセスを簡素化するには、`index_type`として`AUTOINDEX`を使用します。これは、Zilliz Cloudがデータの構造に基づいて最適なインデックスタイプを選択して構成できるようにするオプションです。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
index_params = client.prepare_index_params()

index_params.add_index(
    field_name="sparse",

    index_type="AUTOINDEX", 
    metric_type="BM25"

)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.IndexParam;

Map<String,Object> params = new HashMap<>();
params.put("inverted_index_algo", "DAAT_MAXSCORE");
params.put("bm25_k1", 1.2);
params.put("bm25_b", 0.75);

List<IndexParam> indexes = new ArrayList<>();
indexes.add(IndexParam.builder()
        .fieldName("sparse")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.BM25)
        .extraParams(params)
        .build());    
```

</TabItem>

<TabItem value='java'>

```go
indexOption := milvusclient.NewCreateIndexOption("my_collection", "sparse",
    index.NewAutoIndex(entity.MetricType(entity.BM25)))
    .WithExtraParam("inverted_index_algo", "DAAT_MAXSCORE")
    .WithExtraParam("bm25_k1", 1.2)
    .WithExtraParam("bm25_b", 0.75)
```

</TabItem>

<TabItem value='java'>

```javascript
const index_params = [
  {
    field_name: "sparse",
    metric_type: "BM25",
    index_type: "SPARSE_INVERTED_INDEX",
    params: {
        "inverted_index_algo": "DAAT_MAXSCORE",
        "bm25_k1": 1.2,
        "bm25_b": 0.75
    }
  },
];
```

</TabItem>

<TabItem value='java'>

```bash
export indexParams='[
        {
            "fieldName": "sparse",
            "metricType": "BM25",
            "indexType": "AUTOINDEX",
            "params":{
               "inverted_index_algo": "DAAT_MAXSCORE",
               "bm25_k1": 1.2,
               "bm25_b": 0.75
            }
        }
    ]'
```

</TabItem>
</Tabs>

#### コレクションの作成\{#create-the-collection}

次に、定義されたスキーマとインデックスパラメータを使用してコレクションを作成します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.create_collection(
    collection_name='my_collection', 
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
        .collectionSchema(schema)
        .indexParams(indexes)
        .build();
client.createCollection(requestCreate);
```

</TabItem>

<TabItem value='java'>

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

<TabItem value='java'>

```javascript
await client.create_collection(
    collection_name: 'my_collection', 
    schema: schema, 
    index_params: index_params,
    functions: functions
);
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

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

### ウェブコンソール経由\{#via-web-console}

あるいは、[Zilliz Cloud コンソール](https://cloud.zilliz.com/login)でBM25関数を持つコレクションを作成することもできます。

<Supademo id="cmjl3i2jg4mkb3zz206xgz4tr" title=""  />

BM25関数を持つコレクションが作成されたら、テキストを挿入し、テキストクエリに基づいて語彙検索を実行できます。

## ステップ2: テキストデータをコレクションに挿入する\{#step-2-insert-text-data-into-the-collection}

コレクションとインデックスを設定したら、テキストデータを挿入する準備が整います。このプロセスでは、生のテキストを提供するだけで済みます。以前に定義したBM25関数は、各テキストエントリに対してスパースベクトルを自動的に生成します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.insert('my_collection', [
    {'text': 'information retrieval is a field of study.'},
    {'text': 'information retrieval focuses on finding relevant information in large datasets.'},
    {'text': 'data mining and information retrieval overlap in research.'},
])
```

</TabItem>

<TabItem value='java'>

```java
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import io.milvus.v2.service.vector.request.InsertReq;

Gson gson = new Gson();
List<JsonObject> rows = Arrays.asList(
        gson.fromJson("{\"text\": \"information retrieval is a field of study.\"}", JsonObject.class),
        gson.fromJson("{\"text\": \"information retrieval focuses on finding relevant information in large datasets.\"}", JsonObject.class),
        gson.fromJson("{\"text\": \"data mining and information retrieval overlap in research.\"}", JsonObject.class)
);

client.insert(InsertReq.builder()
        .collectionName("my_collection")
        .data(rows)
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
await client.insert({
collection_name: 'my_collection', 
data: [
    {'text': 'information retrieval is a field of study.'},
    {'text': 'information retrieval focuses on finding relevant information in large datasets.'},
    {'text': 'data mining and information retrieval overlap in research.'},
]);
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
        {"text": "information retrieval is a field of study."},
        {"text": "information retrieval focuses on finding relevant information in large datasets."},
        {"text": "data mining and information retrieval overlap in research."}       
    ],
    "collectionName": "my_collection"
}'

```

</TabItem>
</Tabs>

## ステップ3: テキストクエリで検索する\{#step-3-search-with-text-query}

コレクションにデータを挿入したら、生のテキストクエリを使用して全文検索を実行できます。Zilliz Cloudは、クエリを自動的に疎ベクトルに変換し、BM25アルゴリズムを使用して一致した検索結果をランク付けし、上位K個（`limit`）の結果を返します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
search_params = {
    'params': {'level': 10},
}

res = client.search(
    collection_name='my_collection', 
    # highlight-start
    data=['whats the focus of information retrieval?'],
    anns_field='sparse',
    output_fields=['text'], # Fields to return in search results; sparse field cannot be output
    # highlight-end
    limit=3,
    search_params=search_params
)

print(res)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.request.data.EmbeddedText;
import io.milvus.v2.service.vector.response.SearchResp;

Map<String,Object> searchParams = new HashMap<>();
searchParams.put("level", 10);
SearchResp searchResp = client.search(SearchReq.builder()
        .collectionName("my_collection")
        .data(Collections.singletonList(new EmbeddedText("whats the focus of information retrieval?")))
        .annsField("sparse")
        .topK(3)
        .searchParams(searchParams)
        .outputFields(Collections.singletonList("text"))
        .build());
```

</TabItem>

<TabItem value='java'>

```go
annSearchParams := index.NewCustomAnnParam()
resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "my_collection", // collectionName
    3,               // limit
    []entity.Vector{entity.Text("whats the focus of information retrieval?")},
).WithConsistencyLevel(entity.ClStrong).
    WithANNSField("sparse").
    WithAnnParam(annSearchParams).
    WithOutputFields("text"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

for _, resultSet := range resultSets {
    fmt.Println("IDs: ", resultSet.IDs.FieldData().GetScalars())
    fmt.Println("Scores: ", resultSet.Scores)
    fmt.Println("text: ", resultSet.GetColumn("text").FieldData().GetScalars())
}
```

</TabItem>

<TabItem value='java'>

```javascript
await client.search(
    collection_name: 'my_collection', 
    data: ['whats the focus of information retrieval?'],
    anns_field: 'sparse',
    output_fields: ['text'],
    limit: 3,
    params: {'level': 10},
)
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
--data-raw '{
    "collectionName": "my_collection",
    "data": [
        "whats the focus of information retrieval?"
    ],
    "annsField": "sparse",
    "limit": 3,
    "outputFields": [
        "text"
    ],
    "searchParams":{
        "params":{}
    }
}'
```

</TabItem>
</Tabs>

