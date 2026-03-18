---
title: "Cohere | Cloud"
slug: /cohere
sidebar_label: "Cohere"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Milvus で Cohere 埋め込み関数を設定して使用する方法について説明します。 | Cloud"
type: origin
token: WVaVw8J7UiYZ52kaqVUcktqAnAf
sidebar_position: 8
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 関数
  - モデル
  - 推論
  - テキスト
  - 埋め込み
  - cohere

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Cohere

このトピックでは、Milvus で Cohere 埋め込み関数を設定して使用する方法について説明します。

## モデルの選択肢\{#model-choices}

Milvus は Cohere が提供する埋め込みモデルをサポートしています。以下は、すぐに参照できる現在利用可能な埋め込みモデルです。

<table>
   <tr>
     <th><p>モデル名</p></th>
     <th><p>次元</p></th>
     <th><p>最大トークン数</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>embed-english-v3.0</p></td>
     <td><p>1,024</p></td>
     <td><p>512</p></td>
     <td><p>テキストを分類したり、埋め込みに変換したりできるモデル。英語のみ。</p></td>
   </tr>
   <tr>
     <td><p>embed-multilingual-v3.0</p></td>
     <td><p>1,024</p></td>
     <td><p>512</p></td>
     <td><p>多言語分類と埋め込みをサポートします。<a href="https://docs.cohere.com/docs/supported-languages">サポートされている言語はこちら</a>。</p></td>
   </tr>
   <tr>
     <td><p>embed-english-light-v3.0</p></td>
     <td><p>384</p></td>
     <td><p>512</p></td>
     <td><p><code>embed-english-v3.0</code> の小型で高速なバージョン。ほぼ同等の機能を持つが、はるかに高速。英語のみ。</p></td>
   </tr>
   <tr>
     <td><p>embed-multilingual-light-v3.0</p></td>
     <td><p>384</p></td>
     <td><p>512</p></td>
     <td><p><code>embed-multilingual-v3.0</code> の小型で高速なバージョン。ほぼ同等の機能を持つが、はるかに高速。多言語をサポート。</p></td>
   </tr>
   <tr>
     <td><p>embed-english-v2.0</p></td>
     <td><p>4,096</p></td>
     <td><p>512</p></td>
     <td><p>テキストを分類したり、埋め込みに変換したりできる古い埋め込みモデル。英語のみ。</p></td>
   </tr>
   <tr>
     <td><p>embed-english-light-v2.0</p></td>
     <td><p>1,024</p></td>
     <td><p>512</p></td>
     <td><p>embed-english-v2.0 の小型で高速なバージョン。ほぼ同等の機能を持つが、はるかに高速。英語のみ。</p></td>
   </tr>
   <tr>
     <td><p>embed-multilingual-v2.0</p></td>
     <td><p>768</p></td>
     <td><p>256</p></td>
     <td><p>多言語分類と埋め込みをサポートします。<a href="https://docs.cohere.com/docs/supported-languages">サポートされている言語はこちら</a>。</p></td>
   </tr>
</table>

詳細については、[Cohere の Embed Models](https://docs.cohere.com/docs/cohere-embed) を参照してください。

## 開始する前に\{#before-you-start}

テキスト埋め込み関数を使用する前に、以下の前提条件が満たされていることを確認してください。

- **埋め込みモデルを選択**

    埋め込みモデルの選択は、埋め込みの動作と出力形式を決定するため、どの埋め込みモデルを使用するかを決定します。詳細については、[埋め込みモデルを選択](./cohere#model-choices) を参照してください。

- **Cohere と連携し、統合IDを取得する**

    Cohere が提供する埋め込みモデルを使用する前に、Cohere とモデルプロバイダー連携を作成し、統合IDを取得する必要があります。詳細については、[モデルプロバイダーと連携する](./integrate-with-model-providers) を参照してください。

- **互換性のあるコレクションスキーマを設計する**

    コレクションスキーマには、以下を含めるように計画してください。

    - 生の入力テキスト用のテキストフィールド (`VARCHAR`)

    - 選択した埋め込みモデルのデータ型と次元に一致する密ベクトルフィールド

- **挿入時および検索時に生のテキストを扱う準備をする**

    テキスト埋め込み関数を有効にすると、生のテキストを直接挿入およびクエリできます。埋め込みはシステムによって自動的に生成されます。

## ステップ 1: テキスト埋め込み関数を使用してコレクションを作成する\{#step-1-create-a-collection-with-a-text-embedding-function}

### スキーマフィールドを定義する\{#define-schema-fields}

埋め込み関数を使用するには、特定のスキーマを持つコレクションを作成します。このスキーマには、少なくとも3つの必要なフィールドを含める必要があります。

- コレクション内の各エンティティを一意に識別するプライマリフィールド。

- 埋め込む生のデータを格納する `VARCHAR` フィールド。

- テキスト埋め込み関数が `VARCHAR` フィールドに対して生成する密ベクトル埋め込みを格納するために予約されたベクトルフィールド。

次の例では、テキストデータを格納するための1つのスカラーフィールド `"document"` と、関数モジュールによって生成される埋め込みを格納するための1つのベクトルフィールド `"dense"` を持つスキーマを定義しています。ベクトル次元 (`dim`) を選択した埋め込みモデルの出力と一致するように設定することを忘れないでください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType, Function, FunctionType

# Initialize Milvus client
client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# Create a new schema for the collection
schema = client.create_schema()

# Add primary field "id"
schema.add_field("id", DataType.INT64, is_primary=True, auto_id=False)

# Add scalar field "document" for storing textual data
schema.add_field("document", DataType.VARCHAR, max_length=9000)

# Add vector field "dense" for storing embeddings.
# IMPORTANT: Set dim to match the exact output dimension of the embedding model.
schema.add_field("dense", DataType.FLOAT_VECTOR, dim=1024)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.DataType;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

String CLUSTER_ENDPOINT = "YOUR_CLUSTER_ENDPOINT";
String TOKEN = "YOUR_CLUSTER_TOKEN";

ConnectConfig connectConfig = ConnectConfig.builder()
        .uri(CLUSTER_ENDPOINT)
        .token(TOKEN)
        .build();

MilvusClientV2 client = new MilvusClientV2(connectConfig);

CreateCollectionReq.CollectionSchema schema = client.createSchema();

schema.addField(AddFieldReq.builder()
        .fieldName("id")
        .dataType(DataType.Int64)
        .isPrimaryKey(true)
        .autoID(false)
        .build());

schema.addField(AddFieldReq.builder()
        .fieldName("document")
        .dataType(DataType.VarChar)
        .maxLength(9000)
        .build());
        
schema.addField(AddFieldReq.builder()
        .fieldName("dense")
        .dataType(DataType.FloatVector)
        .dimension(1024)
        .build());
```

</TabItem>

<TabItem value='java'>

```javascript
// nodejs
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

### テキスト埋め込み関数を定義する\{#define-the-text-embedding-function}

MilvusのFunctionモジュールは、スカラーフィールドに保存された生データを自動的に埋め込みに変換し、明示的に定義されたベクトルフィールドに保存します。

以下の例では、スカラーフィールド`"document"`を埋め込みに変換し、結果のベクトルを以前に定義した`"dense"`ベクトルフィールドに保存するFunctionモジュール（`cohere_func`）を追加しています。

埋め込み関数を定義したら、それをコレクションスキーマに追加します。これにより、Milvusは指定された埋め込み関数を使用してテキストデータから埋め込みを処理および保存するように指示されます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Define embedding function specifically for embedding model provider
text_embedding_function = Function(
    name="cohere_func",                                 # Unique identifier for this embedding function
    function_type=FunctionType.TEXTEMBEDDING,           # Indicates a text embedding function
    input_field_names=["document"],                     # Scalar field(s) containing text data to embed
    output_field_names=["dense"],                       # Vector field(s) for storing embeddings
    params={                                            # Provider-specific embedding parameters (function-level)
        "provider": "cohere",                           # Must be set to "cohere"
        "model_name": "embed-english-v3.0",             # Specifies the embedding model to use

        "integration_id": "YOUR_INTEGRATION_ID",    # Integration ID generated in the Zilliz Cloud console for the selected model provider

        # "url": "https://api.cohere.com/v2/embed",     # Defaults to the official endpoint if omitted
        # "truncate": "NONE",                           # Specifies how the API will handle inputs longer than the maximum token length.
    }
)

# Add the configured embedding function to your existing collection schema
schema.add_function(text_embedding_function)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.collection.request.CreateCollectionReq.Function;

Function function = Function.builder()
        .functionType(FunctionType.TEXTEMBEDDING)
        .name("cohere_func")
        .inputFieldNames(Collections.singletonList("document"))
        .outputFieldNames(Collections.singletonList("dense"))
        .param("provider", "cohere")
        .param("model_name", "embed-english-v3.0")

        .param("integration_id", "YOUR_INTEGRATION_ID")

        .build();
schema.addFunction(function);
```

</TabItem>

<TabItem value='java'>

```javascript
// nodejs
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

### インデックスの設定\{#configure-the-index}

必要なフィールドと組み込み関数でスキーマを定義したら、コレクションのインデックスを設定します。このプロセスを簡素化するために、`index_type`として`AUTOINDEX`を使用します。これは、Zilliz Cloudがデータの構造に基づいて最も適切なインデックスタイプを選択し、設定できるようにするオプションです。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Prepare index parameters
index_params = client.prepare_index_params()

# Add AUTOINDEX to automatically select optimal indexing method
index_params.add_index(
    field_name="dense",
    index_type="AUTOINDEX",
    metric_type="COSINE" 
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.IndexParam;

List<IndexParam> indexes = new ArrayList<>();
indexes.add(IndexParam.builder()
        .fieldName("dense")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.COSINE)
        .build());
```

</TabItem>

<TabItem value='java'>

```javascript
// nodejs
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

### コレクションの作成\{#create-the-collection}

次に、定義されたスキーマとインデックスパラメータを使用してコレクションを作成します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Create collection named "demo"
client.create_collection(
    collection_name='demo', 
    schema=schema, 
    index_params=index_params
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.collection.request.CreateCollectionReq;

CreateCollectionReq requestCreate = CreateCollectionReq.builder()
        .collectionName("demo")
        .collectionSchema(schema)
        .indexParams(indexes)
        .build();
client.createCollection(requestCreate);
```

</TabItem>

<TabItem value='java'>

```javascript
// nodejs
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

## ステップ2: データの挿入\{#step-2-insert-data}

コレクションとインデックスを設定したら、生データを挿入する準備が整います。このプロセスでは、生テキストを提供するだけで済みます。以前に定義したFunctionモジュールは、各テキストエントリに対応する疎ベクトルを自動的に生成します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Insert sample documents
client.insert('demo', [
    {'id': 1, 'document': 'Milvus simplifies semantic search through embeddings.'},
    {'id': 2, 'document': 'Vector embeddings convert text into searchable numeric data.'},
    {'id': 3, 'document': 'Semantic search helps users find relevant information quickly.'},
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
        gson.fromJson("{\"id\": 0, \"document\": \"Milvus simplifies semantic search through embeddings.\"}", JsonObject.class),
        gson.fromJson("{\"id\": 1, \"document\": \"Vector embeddings convert text into searchable numeric data.\"}", JsonObject.class),
        gson.fromJson("{\"id\": 2, \"document\": \"Semantic search helps users find relevant information quickly.\"}", JsonObject.class),
);

client.insert(InsertReq.builder()
        .collectionName("demo")
        .data(rows)
        .build());
```

</TabItem>

<TabItem value='java'>

```javascript
// nodejs
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

## ステップ3: テキストで検索する\{#step-3-search-with-text}

データ挿入後、生のクエリテキストを使用してセマンティック検索を実行します。Milvusは自動的にクエリを埋め込みベクトルに変換し、類似性に基づいて関連ドキュメントを取得し、最も一致する結果を返します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Perform semantic search
results = client.search(
    collection_name='demo', 
    data=['How does Milvus handle semantic search?'], # Use text query rather than query vector
    anns_field='dense',   # Use the vector field that stores embeddings
    limit=1,
    output_fields=['document'],
)

print(results)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.request.data.EmbeddedText;
import io.milvus.v2.service.vector.response.SearchResp;

SearchResp searchResp = client.search(SearchReq.builder()
        .collectionName("demo")
        .data(Collections.singletonList(new EmbeddedText("How does Milvus handle semantic search?")))
        .limit(1)
        .outputFields(Collections.singletonList("document"))
        .build());
List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
for (List<SearchResp.SearchResult> results : searchResults) {
    for (SearchResp.SearchResult result : results) {
        System.out.println(result);
    }
}
```

</TabItem>

<TabItem value='java'>

```javascript
// nodejs
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

