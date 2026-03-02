---
title: "フルテキスト検索 | BYOC"
slug: /full-text-search
sidebar_label: "フルテキスト検索"
beta: FALSE
notebook: FALSE
description: "フルテキスト検索は、テキストデータセット内の特定の用語やフレーズを含むドキュメントを検索し、関連性に基づいて結果をランク付けする機能です。この機能は、正確な用語を見落とす可能性のあるセマンティック検索の制限を克服し、最も正確で文脈に関連性の高い結果を確実に受け取れるようにします。さらに、生のテキスト入力を受け入れることでベクトル検索を簡素化し、手動でベクトル埋め込みを生成することなく、テキストデータを自動的にスパース埋め込みに変換します。 | BYOC"
type: origin
token: RQTRwhOVPiwnwokqr4scAtyfnBf
sidebar_position: 10
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - collection
  - データ
  - フィルター
  - フィルタリング式
  - フィルタリング
  - フルテキスト検索
  - データインデータアウト
  - HNSW
  - 非構造化データとは
  - ベクトル埋め込み
  - ベクトルストア

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# フルテキスト検索

フルテキスト検索は、テキストデータセット内の特定の用語やフレーズを含むドキュメントを検索し、関連性に基づいて結果をランク付けする機能です。この機能は、正確な用語を見落とす可能性のあるセマンティック検索の制限を克服し、最も正確で文脈に関連する結果を確実に受け取れるようにします。さらに、生のテキスト入力を受け入れることでベクトル検索を簡素化し、手動でベクトル埋め込みを生成することなく、テキストデータを自動的にスパース埋め込みに変換します。

関連性スコアリングにBM25アルゴリズムを使用するこの機能は、特定の検索用語に密接に一致するドキュメントを優先する検索拡張生成（RAG）シナリオで特に価値があります。

<Admonition type="info" icon="📘" title="Notes">

<p>フルテキスト検索とセマンティックベースの密ベクトル検索を統合することで、検索結果の精度と関連性を高めることができます。詳細については、<a href="./hybrid-search">ハイブリッド検索</a>を参照してください。</p>

</Admonition>

Zilliz Cloudは、プログラムまたはWebコンソールを介したフルテキスト検索の有効化をサポートしています。このページでは、プログラムでフルテキスト検索を有効にする方法に焦点を当てています。Webコンソールでの操作の詳細については、[コレクションの管理（コンソール）](./manage-collections-console#full-text-search)を参照してください。

## BM25の実装{#bm25-implementation}

Zilliz Cloudは、情報検索システムで広く採用されているスコアリング関数であるBM25関連性アルゴリズムを搭載したフルテキスト検索を提供し、Zilliz Cloudはこれを検索ワークフローに統合して、正確で関連性に基づいてランク付けされたテキスト結果を提供します。

Zilliz Cloudのフルテキスト検索は、以下のワークフローに従います。

1. **生のテキスト入力**: テキストドキュメントを挿入するか、埋め込みモデルを必要としないプレーンテキストを使用してクエリを提供します。

1. **テキスト分析**: Zilliz Cloudは、[アナライザー](./analyzer-overview)を使用してテキストをインデックス化および検索可能な意味のある用語に処理します。

1. **BM25関数処理**: 組み込み関数は、これらの用語をBM25スコアリング用に最適化されたスパースベクトル表現に変換します。

1. **コレクションストア**: Zilliz Cloudは、結果のスパース埋め込みをコレクションに保存し、高速な検索とランク付けを可能にします。

1. **BM25関連性スコアリング**: 検索時に、Zilliz CloudはBM25スコアリング関数を適用してドキュメントの関連性を計算し、クエリ用語に最も一致するランク付けされた結果を返します。

![DfPMwP6ZahhHlLbIN0gcG9d7nQM](https://zdoc-images.s3.us-west-2.amazonaws.com/DfPMwP6ZahhHlLbIN0gcG9d7nQM.png)

フルテキスト検索を使用するには、以下の主要な手順に従います。

1. [コレクションの作成](./full-text-search#create-a-collection-for-bm25-full-text-search): 必要なフィールドを設定し、生のテキストをスパース埋め込みに変換するBM25関数を定義します。

1. [データの挿入](./full-text-search#insert-text-data): 生のテキストドキュメントをコレクションに取り込みます。

1. [検索の実行](./full-text-search#perform-full-text-search): 自然言語クエリテキストを使用して、BM25関連性に基づいてランク付けされた結果を取得します。

## BM25フルテキスト検索用のコレクションを作成する{#create-a-collection-for-bm25-full-text-search}

BM25を搭載したフルテキスト検索を有効にするには、必要なフィールドを持つコレクションを準備し、スパースベクトルを生成するBM25関数を定義し、インデックスを設定してから、コレクションを作成する必要があります。

### スキーマフィールドを定義する{#define-schema-fields}

コレクションスキーマには、少なくとも3つの必須フィールドを含める必要があります。

- **プライマリフィールド**: コレクション内の各entityを一意に識別します。

- **テキストフィールド** (`VARCHAR`): 生のテキストドキュメントを保存します。Zilliz CloudがBM25関連性ランク付けのためにテキストを処理できるように、`enable_analyzer=True`を設定する必要があります。デフォルトでは、Zilliz Cloudはテキスト分析に[`standard`](./standard-analyzer)[ analyzer](./standard-analyzer)を使用します。別のアナライザーを設定するには、[アナライザーの概要](./analyzer-overview)を参照してください。

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

<TabItem value='javascript'>

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

上記の構成では、

- `id`: 主キーとして機能し、`auto_id=True` で自動的に生成されます。

- `text`: フルテキスト検索操作のための生のテキストデータを保存します。データ型は `VARCHAR` である必要があります。`VARCHAR` は Zilliz Cloud のテキスト保存用の文字列データ型です。

- `sparse`: フルテキスト検索操作のために内部的に生成された疎な埋め込みを保存するために予約されたベクトルフィールドです。データ型は `SPARSE_FLOAT_VECTOR` である必要があります。

### BM25 関数を定義する {#define-the-bm25-function}

BM25 関数は、トークン化されたテキストを BM25 スコアリングをサポートする疎なベクトルに変換します。

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

<TabItem value='go'>

```go
function := entity.NewFunction().
    WithName("text_bm25_emb").
    WithInputFields("text").
    WithOutputFields("sparse").
    WithType(entity.FunctionTypeBM25)
schema.WithFunction(function)
```

</TabItem>

<TabItem value='javascript'>

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

<table>
   <tr>
     <th><p>パラメータ</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>name</code></p></td>
     <td><p>関数の名前。この関数は、<code>text</code>フィールドの生テキストをBM25互換の疎ベクトルに変換し、<code>sparse</code>フィールドに保存します。</p></td>
   </tr>
   <tr>
     <td><p><code>input_field_names</code></p></td>
     <td><p>テキストから疎ベクトルへの変換が必要な<code>VARCHAR</code>フィールドの名前。<code>FunctionType.BM25</code>の場合、このパラメータは1つのフィールド名のみを受け入れます。</p></td>
   </tr>
   <tr>
     <td><p><code>output_field_names</code></p></td>
     <td><p>内部で生成された疎ベクトルが保存されるフィールドの名前。<code>FunctionType.BM25</code>の場合、このパラメータは1つのフィールド名のみを受け入れます。</p></td>
   </tr>
   <tr>
     <td><p><code>function_type</code></p></td>
     <td><p>使用する関数のタイプ。<code>FunctionType.BM25</code>である必要があります。</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="備考">

<p>複数の<code>VARCHAR</code>フィールドでBM25処理が必要な場合は、**フィールドごとに1つのBM25関数**を定義し、それぞれに一意の名前と出力フィールドを設定してください。</p>

</Admonition>

### インデックスの設定{#configure-the-index}

必要なフィールドと組み込み関数でスキーマを定義したら、コレクションのインデックスを設定します。\<inclcude target="zilliz">このプロセスを簡素化するために、`index_type`として`AUTOINDEX`を使用します。これは、Zilliz Cloudがデータの構造に基づいて最適なインデックスタイプを選択して構成できるオプションです。

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

<TabItem value='go'>

```go
indexOption := milvusclient.NewCreateIndexOption("my_collection", "sparse",
    index.NewAutoIndex(entity.MetricType(entity.BM25)))
    .WithExtraParam("inverted_index_algo", "DAAT_MAXSCORE")
    .WithExtraParam("bm25_k1", 1.2)
    .WithExtraParam("bm25_b", 0.75)
```

</TabItem>

<TabItem value='javascript'>

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

<TabItem value='bash'>

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

<table>
   <tr>
     <th><p>パラメーター</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>field_name</code></p></td>
     <td><p>インデックスを作成するベクトルフィールドの名前。full text search の場合、これは生成された疎ベクトルを格納するフィールドである必要があります。この例では、値を<code>sparse</code>に設定します。</p></td>
   </tr>
   <tr>
     <td><p><code>index_type</code></p></td>
     <td><p>作成するインデックスのタイプ。<code>AUTOINDEX</code>は、Zilliz Cloud がインデックス設定を自動的に最適化することを可能にします。インデックス設定をより詳細に制御する必要がある場合は、Zilliz Cloud で疎ベクトルに利用できるさまざまなインデックスタイプから選択できます。</p></td>
   </tr>
   <tr>
     <td><p><code>metric_type</code></p></td>
     <td><p>このパラメーターの値は、full text search 機能のために<code>BM25</code>に設定する必要があります。</p></td>
   </tr>
   <tr>
     <td><p><code>params</code></p></td>
     <td><p>インデックスに固有の追加パラメーターの辞書。</p></td>
   </tr>
   <tr>
     <td><p><code>params.inverted_index_algo</code></p></td>
     <td><p>インデックスの構築とクエリに使用されるアルゴリズム。有効な値:</p><ul><li><p><code>"DAAT_MAXSCORE"</code> (デフォルト): MaxScore アルゴリズムを使用した最適化された Document-at-a-Time (DAAT) クエリ処理。MaxScore は、影響が最小限である可能性のある用語やドキュメントをスキップすることで、高い <em>k</em> 値または多くの用語を含むクエリに対してより良いパフォーマンスを提供します。これは、最大影響スコアに基づいて用語を必須グループと非必須グループに分割し、上位 k 件の結果に貢献できる用語に焦点を当てることで実現されます。</p></li><li><p><code>"DAAT_WAND"</code>: WAND アルゴリズムを使用した最適化された DAAT クエリ処理。WAND は、最大影響スコアを活用して競合しないドキュメントをスキップすることで、ヒットドキュメントの評価を減らしますが、ヒットあたりのオーバーヘッドが高くなります。これにより、WAND は、スキップがより実現可能な小さな <em>k</em> 値または短いクエリに対してより効率的になります。</p></li><li><p><code>"TAAT_NAIVE"</code>: 基本的な Term-at-a-Time (TAAT) クエリ処理。<code>DAAT_MAXSCORE</code>や<code>DAAT_WAND</code>と比較して遅いですが、<code>TAAT_NAIVE</code>は独自の利点を提供します。DAAT アルゴリズムは、グローバル collection パラメーター (avgdl) の変更に関係なく静的なキャッシュされた最大影響スコアを使用しますが、<code>TAAT_NAIVE</code>はこのような変更に動的に適応します。</p></li></ul></td>
   </tr>
   <tr>
     <td><p><code>params.bm25_k1</code></p></td>
     <td><p>用語頻度の飽和を制御します。値が高いほど、ドキュメントランキングにおける用語頻度の重要性が増します。値の範囲: [1.2, 2.0]。</p></td>
   </tr>
   <tr>
     <td><p><code>params.bm25_b</code></p></td>
     <td><p>ドキュメント長の正規化の程度を制御します。通常、0から1の間の値が使用され、一般的なデフォルトは約0.75です。値が1の場合、長さの正規化は行われず、値が0の場合、完全な正規化が行われます。</p></td>
   </tr>
</table>

### collection を作成する {#create-the-collection}

次に、定義された schema とインデックスパラメーターを使用して collection を作成します。

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

<TabItem value='javascript'>

```javascript
await client.create_collection(
    collection_name: 'my_collection', 
    schema: schema, 
    index_params: index_params,
    functions: functions
);
```

</TabItem>

<TabItem value='bash'>

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

## テキストデータの挿入{#insert-text-data}

コレクションとインデックスを設定したら、テキストデータを挿入する準備が整います。このプロセスでは、生のテキストを提供するだけで済みます。以前に定義した組み込み関数は、各テキストエントリに対応する疎ベクトルを自動的に生成します。

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

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='javascript'>

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

<TabItem value='bash'>

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

## フルテキスト検索の実行{#perform-full-text-search}

コレクションにデータを挿入したら、生のテキストクエリを使用してフルテキスト検索を実行できます。Zilliz Cloudは、クエリを自動的に疎ベクトルに変換し、BM25アルゴリズムを使用して一致した検索結果をランク付けし、上位K個の (`limit`) 結果を返します。

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

<TabItem value='go'>

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

<TabItem value='javascript'>

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

<TabItem value='bash'>

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

<table>
   <tr>
     <th><p>パラメーター</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>search_params</code></p></td>
     <td><p>検索パラメーターを含む辞書。</p></td>
   </tr>
   <tr>
     <td><p><code>params.level</code></p></td>
     <td><p>簡素化された検索最適化で検索精度を制御します。詳細については、「<a href="./tune-recall-rate">リコール率の調整</a>」を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>data</code></p></td>
     <td><p>自然言語の生のクエリテキスト。Zilliz Cloudは、BM25関数を使用してテキストクエリを自動的にスパースベクトルに変換します。事前に計算されたベクトルは提供しないでください。</p></td>
   </tr>
   <tr>
     <td><p><code>anns_field</code></p></td>
     <td><p>内部で生成されたスパースベクトルを含むフィールドの名前。</p></td>
   </tr>
   <tr>
     <td><p><code>output_fields</code></p></td>
     <td><p>検索結果で返されるフィールド名のリスト。BM25で生成された埋め込みを含む**スパースベクトルフィールドを除く**すべてのフィールドをサポートします。一般的な出力フィールドには、主キーフィールド（例：<code>id</code>）と元のテキストフィールド（例：<code>text</code>）が含まれます。詳細については、「<a href="./full-text-search#can-i-output-or-access-the-sparse-vectors-generated-by-the-bm25-function-in-full-text-search">FAQ</a>」を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>limit</code></p></td>
     <td><p>返される上位一致の最大数。</p></td>
   </tr>
</table>

## FAQ{#faq}

### full text searchでBM25関数によって生成されたスパースベクトルを出力またはアクセスできますか？{#can-i-output-or-access-the-sparse-vectors-generated-by-the-bm25-function-in-full-text-search}

いいえ、BM25関数によって生成されたスパースベクトルは、full text searchで直接アクセスしたり出力したりすることはできません。詳細は以下の通りです。

- BM25関数は、ランキングと検索のために内部的にスパースベクトルを生成します。

- これらのベクトルはスパースフィールドに保存されますが、`output_fields`に含めることはできません。

- 元のテキストフィールドとメタデータ（`id`、`text`など）のみを出力できます。

例：

```python
# ❌ This throws an error - you cannot output the sparse field
client.search(
    collection_name='my_collection', 
    data=['query text'],
    anns_field='sparse',
    # highlight-next-line
    output_fields=['text', 'sparse']  # 'sparse' causes an error
    limit=3,
    search_params=search_params
)

# ✅ This works - output text fields only
client.search(
    collection_name='my_collection', 
    data=['query text'],
    anns_field='sparse',
    # highlight-next-line
    output_fields=['text']
    limit=3,
    search_params=search_params
)
```

### アクセスできないのに、なぜ疎ベクトルフィールドを定義する必要があるのですか？{#why-do-i-need-to-define-a-sparse-vector-field-if-i-cant-access-it}

疎ベクトルフィールドは、ユーザーが直接操作しないデータベースインデックスと同様に、内部検索インデックスとして機能します。

**設計の根拠**:

- 関心の分離: ユーザーはテキスト（入力/出力）を扱い、Milvusはベクトル（内部処理）を扱います。

- パフォーマンス: 事前計算された疎ベクトルにより、クエリ中に高速なBM25ランキングが可能になります。

- ユーザーエクスペリエンス: 複雑なベクトル操作をシンプルなテキストインターフェースの背後に抽象化します。

**ベクトルアクセスが必要な場合**:

- full text searchの代わりに手動の疎ベクトル操作を使用します。

- カスタム疎ベクトルワークフロー用に個別のcollectionを作成します。

詳細については、[疎ベクトルを使用する](./use-sparse-vector)を参照してください。