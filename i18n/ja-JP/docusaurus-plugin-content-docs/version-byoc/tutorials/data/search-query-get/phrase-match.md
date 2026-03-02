---
title: "フレーズ一致 | BYOC"
slug: /phrase-match
sidebar_label: "フレーズ一致"
beta: FALSE
notebook: FALSE
description: "フレーズ一致では、クエリ用語を正確なフレーズとして含むドキュメントを検索できます。デフォルトでは、単語は同じ順序で直接隣接して出現する必要があります。たとえば、「robotics machine learning」というクエリは、「…typical robotics machine learning models…」のようなテキストに一致します。この場合、「robotics」、「machine」、「learning」という単語は、間に他の単語を挟まずに連続して出現します。 | BYOC"
type: origin
token: O2YiwLai5iSjT1k1WEsc06E8nEe
sidebar_position: 13
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - データ
  - フィルター
  - フィルタリング式
  - フィルタリング
  - フレーズ一致
  - 近似最近傍探索
  - DiskANN
  - Sparse vector
  - Vector Dimension

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# フレーズマッチ

フレーズマッチを使用すると、クエリ用語を正確なフレーズとして含むドキュメントを検索できます。デフォルトでは、単語は同じ順序で直接隣接して出現する必要があります。たとえば、**「robotics machine learning」**というクエリは、「…typical robotics machine learning models…」のようなテキストに一致します。この場合、**「robotics」**、**「machine」**、**「learning」**という単語は、間に他の単語を挟まずに連続して出現します。

しかし、現実世界のシナリオでは、厳密なフレーズマッチは厳しすぎる場合があります。たとえば、「…machine learning models widely adopted in robotics…」のようなテキストに一致させたい場合があります。ここでは、同じキーワードが存在しますが、隣接しておらず、元の順序でもありません。これを処理するために、フレーズマッチは柔軟性を導入する`slop`パラメーターをサポートしています。`slop`値は、フレーズ内の用語間に許容される位置シフトの数を定義します。たとえば、`slop`が1の場合、**「machine learning」**というクエリは、「...machine deep learning...」のようなテキストに一致します。この場合、1つの単語（**「deep」**）が元の用語を隔てています。

## 概要{#overview}

[Tantivy](https://github.com/quickwit-oss/tantivy)検索エンジンライブラリを搭載したフレーズマッチは、ドキュメント内の単語の位置情報を分析することで機能します。以下の図は、そのプロセスを示しています。

![AFrdwVT8ChT11ibs9lpcuN7onZc](https://zdoc-images.s3.us-west-2.amazonaws.com/AFrdwVT8ChT11ibs9lpcuN7onZc.png)

1. **ドキュメントのトークン化**: Zilliz Cloudにドキュメントを挿入すると、テキストはアナライザーを使用してトークン（個々の単語または用語）に分割され、各トークンの位置情報が記録されます。たとえば、**doc_1**は**["machine" (pos=0), "learning" (pos=1), "boosts" (pos=2), "efficiency" (pos=3)]**にトークン化されます。アナライザーの詳細については、[アナライザーの概要](./analyzer-overview)を参照してください。

1. **転置インデックスの作成**: Zilliz Cloudは転置インデックスを構築し、各トークンをそれが現れるドキュメントと、それらのドキュメント内でのトークンの位置にマッピングします。

1. **フレーズマッチング**: フレーズクエリが実行されると、Zilliz Cloudは転置インデックス内の各トークンを検索し、それらの位置をチェックして、正しい順序と近接性で出現するかどうかを判断します。`slop`パラメーターは、一致するトークン間に許容される最大位置数を制御します。

    - **slop = 0**は、トークンが**正確な順序で、かつすぐに隣接して**出現する必要があることを意味します（つまり、間に余分な単語がない）。

        - この例では、**doc_1**（**pos=0**の**「machine」**、**pos=1**の**「learning」**）のみが正確に一致します。

    - **slop = 2**は、一致するトークン間に最大2つの位置の柔軟性または再配置を許可します。

        - これにより、逆順（**「learning machine」**）や、トークン間のわずかなギャップが許容されます。

        - その結果、**doc_1**、**doc_2**（**pos=0**の**「learning」**、**pos=1**の**「machine」**）、および**doc_3**（**pos=1**の**「learning」**、**pos=2**の**「machine」**）のすべてが一致します。

## フレーズマッチを有効にする{#enable-phrase-match}

フレーズマッチは、Zilliz Cloudの文字列データ型である`VARCHAR`フィールドタイプで機能します。

フレーズマッチを有効にするには、`enable_analyzer`と`enable_match`パラメーターの両方を`True`に設定してコレクションスキーマを構成します。この設定により、テキストがトークン化され、位置情報を含む転置インデックスが構築され、効率的なフレーズ検索が可能になります。

### スキーマフィールドの定義{#define-schema-fields}

特定の`VARCHAR`フィールドでフレーズマッチを有効にするには、フィールドスキーマを定義する際に`enable_analyzer`と`enable_match`の両方を`True`に設定します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

# Set up a MilvusClient
CLUSTER_ENDPOINT = "YOUR_CLUSTER_ENDPOINT"
TOKEN = "YOUR_CLUSTER_TOKEN" 

client = MilvusClient(
    uri=CLUSTER_ENDPOINT,
    token=TOKEN 
)

# Create a schema for a new collection
schema = client.create_schema(enable_dynamic_field=False)

# Add a primary key field
schema.add_field(
    field_name="id",
    datatype=DataType.INT64,
    is_primary=True,
    auto_id=True
)

# Add a VARCHAR field configured for phrase matching
schema.add_field(
    field_name="text",                  # Name of the field
    # highlight-next-line
    datatype=DataType.VARCHAR,          # Field data type set as VARCHAR (string)
    max_length=1000,                    # Maximum string length
    # highlight-start
    enable_analyzer=True,               # Required. Enables text analysis
    enable_match=True,                  # Required. Enables inverted indexing for phrase matching
    # highlight-end
    # Optional: Use a custom analyzer for better phrase matching in specific languages.
    # analyzer_params = {"type": "english"}     # Example: English analyzer; uncomment to apply custom analyzer
)

# Add a vector field for embeddings
schema.add_field(
    field_name="embeddings",
    datatype=DataType.FLOAT_VECTOR,
    dim=5
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.DataType;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .token("YOUR_CLUSTER_TOKEN")
        .build());

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
        .enableMatch(true)
        // Optional: Use a custom analyzer for better phrase matching in specific languages.
        // .analyzerParams(Map.of("type", "english"))     // Example: English analyzer; uncomment to apply custom analyzer
        .build());
schema.addField(AddFieldReq.builder()
        .fieldName("embeddings")
        .dataType(DataType.FloatVector)
        .dimension(5)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
// Set up a MilvusClient
const address = "YOUR_CLUSTER_ENDPOINT"
const token = "YOUR_CLUSTER_TOKEN"

const client = new MilvusClient({address, token})

const schema = {
  collection_name: 'tech_articles',
  fields: [
    {
      name: "id",
      description: "primary id",
      data_type: DataType.Int64,
      is_primary_key: true,
      autoID: true,
    },
    {
      name: "text",
      description: "text field for phrase matching",
      data_type: DataType.VarChar,
      max_length: 1000,
      enable_analyzer: true, // Enables text analysis
      enable_match: true,    // Enables inverted indexing for
    },
    {
      name: "embeddings",
      description: "vector field",
      data_type: DataType.FloatVector,
      dim: 5,
    },
  ],
};

```

</TabItem>

<TabItem value='go'>

```go
import (
     "github.com/milvus-io/milvus/client/v2/entity"
)

milvusAddr := "YOUR_CLUSTER_ENDPOINT"
APIKey := "YOUR_API_KEY"

client, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
    Address: milvusAddr,
    APIKey: APIKey
})

schema := entity.NewSchema().WithName(collectionName).
        WithField(entity.NewField().WithName("id").WithDataType(entity.FieldTypeInt64).WithIsPrimaryKey(true)).
        WithField(entity.NewField().WithName("text").WithDataType(entity.FieldTypeVarChar).WithMaxLength(1000).WithEnableMatch(true).WithEnableAnalyzer(true)).
        WithField(entity.NewField().WithName("embeddings").WithDataType(entity.FieldTypeFloatVector).WithDim(5))
```

</TabItem>

<TabItem value='bash'>

```bash
export idField='{
  "fieldName": "id",
  "dataType": "Int64",
  "isPrimary": true,
  "autoID": true
}'

export textField='{
  "fieldName": "text",
  "dataType": "VarChar",
  "elementTypeParams": {
    "max_length": 1000,
    "enable_analyzer": true,
    "enable_match": true
  }
}'

export vectorField='{
  "fieldName": "embeddings",
  "dataType": "FloatVector",
  "elementTypeParams": {
    "dim": 5
  }
}'

export schema="{
  \"autoID\": false,
  \"enableDynamicField\": true,
  \"fields\": [
    $idField,
    $textField,
    $vectorField
  ]
}"
```

</TabItem>
</Tabs>

デフォルトでは、Zilliz Cloudは[標準アナライザー](./standard-analyzer)を使用します。これは、空白と句読点によってテキストをトークン化し、テキストを小文字に変換します。

テキストデータが特定の言語または形式である場合は、`analyzer_params`パラメーターを使用してカスタムアナライザーを設定できます（例：`{ "type": "english" }`または`{ "type": "jieba" }`）。

詳細については、[アナライザーの概要](./analyzer-overview)を参照してください。

### collectionの作成{#create-the-collection}

必要なフィールドが定義されたら、以下のコードを使用してcollectionを作成します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Create the collection
COLLECTION_NAME = "tech_articles" # Name your collection

if client.has_collection(COLLECTION_NAME):
    client.drop_collection(COLLECTION_NAME)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema
)
```

</TabItem>

<TabItem value='java'>

```java
String COLLECTION_NAME = "tech_articles"; // Name your collection

if (client.hasCollection(
        HasCollectionReq.builder()
            .collectionName(COLLECTION_NAME)
            .build()
    )) {
    client.dropCollection(
        DropCollectionReq.builder()
            .collectionName(COLLECTION_NAME)
            .build()
    );
}

client.createCollection(
    CreateCollectionReq.builder()
        .collectionName(COLLECTION_NAME)
        .collectionSchema(schema)
        .build()
);
```

</TabItem>

<TabItem value='javascript'>

```javascript
// Create or recreate the collection if it already exists
const COLLECTION_NAME = "tech_articles"; // Name your collection

const hasCollection = await client.hasCollection({ collection_name: COLLECTION_NAME });

if (hasCollection.value) {
    await client.dropCollection({ collection_name: COLLECTION_NAME });
}

await client.createCollection(schema);
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
# check collection exist
export MILVUS_HOST="YOUR_CLUSTER_ENDPOINT"
export COLLECTION_NAME="tech_articles"
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/collections/has" \
  -H "Content-Type: application/json" \
  -d "{
    \"collectionName\": \"$COLLECTION_NAME\"
  }"

# drop existing collection
curl -X POST "http://${MILVUS_HOST}/v2/vectordb/collections/drop" \
  -H "Content-Type: application/json" \
  -d "{
    \"collectionName\": \"${COLLECTION_NAME}\"
  }"
  
# create new collection
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/create" \
--header "Content-Type: application/json" \
--data "{
    \"collectionName\": \"$COLLECTION_NAME\",
    \"schema\": $schema
}"  
```

</TabItem>
</Tabs>

コレクションが作成されたら、[フレーズマッチを使用する](./phrase-match#use-phrase-match)前に、以下の必要な手順が実行されていることを確認してください。

- エンティティがコレクションに挿入されていること。

- 各ベクトルフィールドにインデックスが作成されていること。

- コレクションがメモリにロードされていること。

<details>

<summary>コード例を表示</summary>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Insert sample data with text containing "machine learning" phrases
sample_data = [
    {
        "text": "Machine learning is a subset of artificial intelligence that focuses on algorithms.",
        "embeddings": [0.1, 0.2, 0.3, 0.4, 0.5]
    },
    {
        "text": "Deep learning machine algorithms require large datasets for training.",
        "embeddings": [0.2, 0.3, 0.4, 0.5, 0.6]
    },
    {
        "text": "The machine learning model showed excellent performance on the test set.",
        "embeddings": [0.3, 0.4, 0.5, 0.6, 0.7]
    },
    {
        "text": "Natural language processing and machine learning go hand in hand.",
        "embeddings": [0.4, 0.5, 0.6, 0.7, 0.8]
    },
    {
        "text": "This article discusses various learning machine techniques and applications.",
        "embeddings": [0.5, 0.6, 0.7, 0.8, 0.9]
    }
]

# Insert the data
client.insert(
    collection_name=COLLECTION_NAME,
    data=sample_data
)

# Index the vector field and load the collection
index_params = client.prepare_index_params()
index_params.add_index(
    field_name="embeddings",
    index_type="AUTOINDEX",
    index_name="embeddings_index",
    metric_type="COSINE"
)

client.create_index(collection_name=COLLECTION_NAME, index_params=index_params)

client.load_collection(collection_name=COLLECTION_NAME)
```

</TabItem>

<TabItem value='java'>

```java
// Insert sample data with text containing "machine learning" phrases
List<JsonObject> sampleData = Arrays.asList(
    createSample("Machine learning is a subset of artificial intelligence that focuses on algorithms.", new float[]{0.1f, 0.2f, 0.3f, 0.4f, 0.5f}),
    createSample("Deep learning machine algorithms require large datasets for training.", new float[]{0.2f, 0.3f, 0.4f, 0.5f, 0.6f}),
    createSample("The machine learning model showed excellent performance on the test set.", new float[]{0.3f, 0.4f, 0.5f, 0.6f, 0.7f}),
    createSample("Natural language processing and machine learning go hand in hand.", new float[]{0.4f, 0.5f, 0.6f, 0.7f, 0.8f}),
    createSample("This article discusses various learning machine techniques and applications.", new float[]{0.5f, 0.6f, 0.7f, 0.8f, 0.9f})
);

client.insert(InsertReq.builder()
        .collectionName(COLLECTION_NAME)
        .data(sampleData)
        .build());

// Index the vector field and load the collection
IndexParam indexParam = IndexParam.builder()
        .fieldName("embeddings")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .indexName("embeddings_index")
        .metricType(IndexParam.MetricType.COSINE)
        .build();

client.createIndex(CreateIndexReq.builder()
        .collectionName(COLLECTION_NAME)
        .indexParams(Collections.singletonList(indexParam))
        .build());

client.loadCollection(LoadCollectionReq.builder()
        .collectionName(COLLECTION_NAME)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
// Format and insert sample data for "machine learning" phrase matching
const sampleData = [
    {
        text: "Machine learning is a subset of artificial intelligence that focuses on algorithms.",
        embeddings: [0.1, 0.2, 0.3, 0.4, 0.5],
    },
    {
        text: "Deep learning machine algorithms require large datasets for training.",
        embeddings: [0.2, 0.3, 0.4, 0.5, 0.6],
    },
    {
        text: "The machine learning model showed excellent performance on the test set.",
        embeddings: [0.3, 0.4, 0.5, 0.6, 0.7],
    },
    {
        text: "Natural language processing and machine learning go hand in hand.",
        embeddings: [0.4, 0.5, 0.6, 0.7, 0.8],
    },
    {
        text: "This article discusses various learning machine techniques and applications.",
        embeddings: [0.5, 0.6, 0.7, 0.8, 0.9],
    },
];

// Insert the data into the collection
await client.insert({
    collection_name: COLLECTION_NAME,
    data: sampleData,
});

// Create an index on the vector field and load the collection
await client.createIndex({
    collection_name: COLLECTION_NAME,
    field_name: "embeddings",
    index_type: "AUTOINDEX",
    index_name: "embeddings_index",
    metric_type: "COSINE",
});

await client.loadCollection({
    collection_name: COLLECTION_NAME,
});
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
# Insert the data into the collection
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/entities/insert" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "collectionName": "tech_articles",
    "data": [
      {
        "text": "Machine learning is a subset of artificial intelligence that focuses on algorithms.",
        "embeddings": [0.1, 0.2, 0.3, 0.4, 0.5]
      },
      {
        "text": "Deep learning machine algorithms require large datasets for training.",
        "embeddings": [0.2, 0.3, 0.4, 0.5, 0.6]
      },
      {
        "text": "The machine learning model showed excellent performance on the test set.",
        "embeddings": [0.3, 0.4, 0.5, 0.6, 0.7]
      },
      {
        "text": "Natural language processing and machine learning go hand in hand.",
        "embeddings": [0.4, 0.5, 0.6, 0.7, 0.8]
      },
      {
        "text": "This article discusses various learning machine techniques and applications.",
        "embeddings": [0.5, 0.6, 0.7, 0.8, 0.9]
      }
    ]
  }'
# Create an index on the vector field and load the collection
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/indexes/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "collectionName": "tech_articles",
    "indexParams": [
      {
        "fieldName": "embeddings",
        "indexName": "embeddings_index",
        "metricType": "COSINE",
        "indexType": "AUTOINDEX"
      }
    ]
  }'
    
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/collections/load" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "collectionName": "tech_articles"
  }'
```

</TabItem>
</Tabs>

</details>

## フレーズ一致を使用する{#use-phrase-match}

コレクションスキーマで `VARCHAR` フィールドの照合を有効にすると、`PHRASE_MATCH` 式を使用してフレーズ照合を実行できます。

<Admonition type="info" icon="📘" title="Notes">

<p><code>PHRASE_MATCH</code> 式は大文字と小文字を区別しません。<code>PHRASE_MATCH</code> または <code>phrase_match</code> のどちらでも使用できます。</p>

</Admonition>

### PHRASE_MATCH 式の構文{#phrasematch-expression-syntax}

`PHRASE_MATCH` 式を使用して、検索時にフィールド、フレーズ、およびオプションの柔軟性 (`slop`) を指定します。構文は次のとおりです。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
PHRASE_MATCH(field_name, phrase, slop)
```

</TabItem>

<TabItem value='java'>

```java
String filter = "PHRASE_MATCH(text, 'machine learning')";
```

</TabItem>

<TabItem value='javascript'>

```javascript
PHRASE_MATCH(field_name, phrase, slop)
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
export filter = "PHRASE_MATCH(field_name, phrase, slop)"
```

</TabItem>
</Tabs>

- `field_name`**:** フレーズマッチを実行する`VARCHAR`フィールドの名前。

- `phrase`**:** 検索する正確なフレーズ。

- `slop` (オプション)**:** マッチングトークンで許可される最大位置数を指定する整数。

    - `0` (デフォルト): 正確なフレーズのみをマッチングします。例: **"machine learning"** のフィルターは、**"machine learning"** に正確にマッチしますが、**"machine boosts learning"** や **"learning machine"** にはマッチしません。

    - `1`: わずかなバリエーションを許可します。例えば、1つの余分な単語や位置のわずかなずれ。例: **"machine learning"** のフィルターは、**"machine boosts learning"** ( **"machine"** と **"learning"** の間に1つのトークン) にマッチしますが、**"learning machine"** (単語が逆) にはマッチしません。

    - `2`: より柔軟性を許可します。例えば、単語の順序が逆になったり、間に最大2つのトークンが入ったりします。例: **"machine learning"** のフィルターは、**"learning machine"** (単語が逆) や **"machine quickly boosts learning"** ( **"machine"** と **"learning"** の間に2つのトークン) にマッチします。

### フレーズマッチによるクエリ{#query-with-phrase-match}

`query()` メソッドを使用する場合、**PHRASE_MATCH** はスカラーフィルターとして機能します。指定されたフレーズ（許可されたスロップに従う）を含むドキュメントのみが返されます。

#### 例: slop = 0 (完全一致){#example-slop-0-exact-match}

この例では、間に余分なトークンを含まない正確なフレーズ **"machine learning"** を含むドキュメントを返します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Match documents containing exactly "machine learning"
filter = "PHRASE_MATCH(text, 'machine learning')"

result = client.query(
    collection_name=COLLECTION_NAME,
    # highlight-next-line
    filter=filter,
    output_fields=["id", "text"]
)

print("Query result: ", result)

# Expected output:
# Query result:  data: ["{'id': 461366973343948097, 'text': 'Machine learning is a subset of artificial intelligence that focuses on algorithms.'}", "{'id': 461366973343948099, 'text': 'The machine learning model showed excellent performance on the test set.'}", "{'id': 461366973343948100, 'text': 'Natural language processing and machine learning go hand in hand.'}"]
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.QueryReq;
import io.milvus.v2.service.vector.response.QueryResp;

String filter = "PHRASE_MATCH(text, 'machine learning')";
QueryResp result = client.query(QueryReq.builder()
        .collectionName(COLLECTION_NAME)
        .filter(filter)
        .outputFields(Arrays.asList("id", "text"))
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
const filter = "PHRASE_MATCH(text, 'machine learning')";

const result = await client.query({
    collection_name: COLLECTION_NAME,
    filter: filter,
    output_fields: ["id", "text"]
});
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/entities/query" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "collectionName": "tech_articles",
    "filter": "PHRASE_MATCH(text, '\''machine learning'\'')",
    "outputFields": ["id", "text"],
    "limit": 100
  }'
```

</TabItem>
</Tabs>

### フレーズ一致で検索する{#search-with-phrase-match}

検索操作では、**PHRASE_MATCH** は、ベクトル類似度ランキングを適用する前にドキュメントを事前フィルタリングするために使用されます。この2段階のアプローチでは、まずテキストマッチングによって候補セットを絞り込み、次にベクトル埋め込みに基づいてそれらの候補を再ランク付けします。

#### 例: slop = 1{#example-slop-1}

ここでは、slop を 1 に設定します。このフィルターは、**"learning machine"** というフレーズをわずかな柔軟性をもって含むドキュメントに適用されます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Example: Filter documents containing "learning machine" with slop=1
filter_slop1 = "PHRASE_MATCH(text, 'learning machine', 1)"

result_slop1 = client.search(
    collection_name=COLLECTION_NAME,
    anns_field="embeddings",
    data=[[0.1, 0.2, 0.3, 0.4, 0.5]],
    # highlight-next-line
    filter=filter_slop1,
    search_params={},
    limit=10,
    output_fields=["id", "text"]
)

print("Slop 1 result: ", result_slop1)

# Expected output:
# Slop 1 result:  data: [[{'id': 461366973343948098, 'distance': 0.9949367046356201, 'entity': {'text': 'Deep learning machine algorithms require large datasets for training.', 'id': 461366973343948098}}, {'id': 461366973343948101, 'distance': 0.9710607528686523, 'entity': {'text': 'This article discusses various learning machine techniques and applications.', 'id': 461366973343948101}}]]
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.response.SearchResp;

String filterSlop1 = "PHRASE_MATCH(text, 'learning machine', 1)";
List<Float> queryVector = Arrays.asList(0.1f, 0.2f, 0.3f, 0.4f, 0.5f);

SearchResp resultSlop1 = client.search(SearchReq.builder()
        .collectionName(COLLECTION_NAME)
        .annsField("embeddings")
        .data(Collections.singletonList(queryVector))
        .filter(filterSlop1)
        .searchParams(Collections.emptyMap())
        .topK(10)
        .outputFields(Arrays.asList("id", "text"))
        .build());
        
System.out.println("Slop 1 result: " + resultSlop1);
```

</TabItem>

<TabItem value='javascript'>

```javascript
const filter_slop1 = "PHRASE_MATCH(text, 'learning machine', 1)";

const result_slop1 = await client.search({
  collection_name: COLLECTION_NAME,
  anns_field: "embeddings",
  data: [0.1, 0.2, 0.3, 0.4, 0.5],
  filter: filter_slop1,
  limit: 10,
  output_fields: ["id", "text"],
});

```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
export MILVUS_HOST="YOUR_CLUSTER_ENDPOINT"
export COLLECTION_NAME="tech_articles"
export AUTH_TOKEN="your_token_here"

# Search数据
echo "Searching with PHRASE_MATCH filter (slop=1)..."
curl -X POST "http://${MILVUS_HOST}/v2/vectordb/entities/search" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -d "{
    \"collectionName\": \"${COLLECTION_NAME}\",
    \"annsField\": \"embeddings\",
    \"data\": [[0.1, 0.2, 0.3, 0.4, 0.5]],
    \"filter\": \"PHRASE_MATCH(text, 'learning machine', 1)\",
    \"searchParams\": {},
    \"limit\": 10,
    \"outputFields\": [\"id\", \"text\"]
  }"
```

</TabItem>
</Tabs>

#### 例: slop = 2{#example-slop-2}

この例では、slop を 2 に設定しています。これは、**"machine"** と **"learning"** の単語間に最大 2 つの余分なトークン（または逆順の用語）が許容されることを意味します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Example: Filter documents containing "machine learning" with slop=2
filter_slop2 = "PHRASE_MATCH(text, 'machine learning', 2)"

result_slop2 = client.search(
    collection_name=COLLECTION_NAME,
    anns_field="embeddings",             # Vector field name
    data=[[0.1, 0.2, 0.3, 0.4, 0.5]],                 # Query vector
    # highlight-next-line
    filter=filter_slop2,                 # Filter expression
    search_params={},
    limit=10,                            # Maximum results to return
    output_fields=["id", "text"]
)

print("Slop 2 result: ", result_slop2)

# Expected output:
# Slop 2 result:  data: [[{'id': 461366973343948097, 'distance': 0.9999999403953552, 'entity': {'text': 'Machine learning is a subset of artificial intelligence that focuses on algorithms.', 'id': 461366973343948097}}, {'id': 461366973343948098, 'distance': 0.9949367046356201, 'entity': {'text': 'Deep learning machine algorithms require large datasets for training.', 'id': 461366973343948098}}, {'id': 461366973343948099, 'distance': 0.9864400029182434, 'entity': {'text': 'The machine learning model showed excellent performance on the test set.', 'id': 461366973343948099}}, {'id': 461366973343948100, 'distance': 0.9782319068908691, 'entity': {'text': 'Natural language processing and machine learning go hand in hand.', 'id': 461366973343948100}}, {'id': 461366973343948101, 'distance': 0.9710607528686523, 'entity': {'text': 'This article discusses various learning machine techniques and applications.', 'id': 461366973343948101}}]]
```

</TabItem>

<TabItem value='java'>

```java
// Example: Filter documents containing "machine learning" with slop=2
String filterSlop2 = "PHRASE_MATCH(text, 'machine learning', 2)";

SearchReq searchReqSlop2 = SearchReq.builder()
        .collectionName(COLLECTION_NAME)
        .annsField("embeddings")             // Vector field name
        .data(queryVector)                   // Query vector
        // highlight-next-line
        .filter(filterSlop2)                 // Filter expression
        .searchParams(new HashMap<>())
        .topK(10)                            // Maximum results to return
        .outputFields(Arrays.asList("id", "text"))
        .build();

SearchResp resultSlop2 = client.search(searchReqSlop2);

System.out.println("Slop 2 result: " + resultSlop2);
```

</TabItem>

<TabItem value='javascript'>

```javascript
const filter_slop2 = "PHRASE_MATCH(text, 'learning machine', 2)";

const result_slop2 = await client.search({
  collection_name: COLLECTION_NAME,
  anns_field: "embeddings",
  data: [0.1, 0.2, 0.3, 0.4, 0.5],
  filter: filter_slop2,
  limit: 10,
  output_fields: ["id", "text"],
});

```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
#restful
curl -X POST "http://${MILVUS_HOST}/v2/vectordb/entities/search" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -d "{
    \"collectionName\": \"${COLLECTION_NAME}\",
    \"annsField\": \"embeddings\",
    \"data\": [[0.1, 0.2, 0.3, 0.4, 0.5]],
    \"filter\": \"PHRASE_MATCH(text, 'machine learning', 2)\",
    \"searchParams\": {},
    \"limit\": 10,
    \"outputFields\": [\"id\", \"text\"]
  }"
```

</TabItem>
</Tabs>

#### 例: slop = 3{#example-slop-3}

この例では、slopを3にすることで、さらに柔軟性が増します。フィルターは、単語間に最大3つのトークン位置を許容して**"machine learning"**を検索します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Example: Filter documents containing "machine learning" with slop=3
filter_slop3 = "PHRASE_MATCH(text, 'machine learning', 3)"

result_slop3 = client.search(
    collection_name=COLLECTION_NAME,
    anns_field="embeddings",             # Vector field name
    data=[[0.1, 0.2, 0.3, 0.4, 0.5]],                 # Query vector
    # highlight-next-line
    filter=filter_slop3,                 # Filter expression
    search_params={},
    limit=10,                            # Maximum results to return
    output_fields=["id", "text"]
)

print("Slop 3 result: ", result_slop3)

# Expected output:
# Slop 3 result:  data: [[{'id': 461366973343948097, 'distance': 0.9999999403953552, 'entity': {'text': 'Machine learning is a subset of artificial intelligence that focuses on algorithms.', 'id': 461366973343948097}}, {'id': 461366973343948098, 'distance': 0.9949367046356201, 'entity': {'text': 'Deep learning machine algorithms require large datasets for training.', 'id': 461366973343948098}}, {'id': 461366973343948099, 'distance': 0.9864400029182434, 'entity': {'text': 'The machine learning model showed excellent performance on the test set.', 'id': 461366973343948099}}, {'id': 461366973343948100, 'distance': 0.9782319068908691, 'entity': {'text': 'Natural language processing and machine learning go hand in hand.', 'id': 461366973343948100}}, {'id': 461366973343948101, 'distance': 0.9710607528686523, 'entity': {'text': 'This article discusses various learning machine techniques and applications.', 'id': 461366973343948101}}]]
```

</TabItem>

<TabItem value='java'>

```java
// Example: Filter documents containing "machine learning" with slop=3
String filterSlop3 = String.format("PHRASE_MATCH(text, '%s', %d)", "machine learning", 3);

SearchResp resultSlop3 = client.search(
    SearchReq.builder()
        .collectionName(COLLECTION_NAME)
        .annsField("embeddings") // Vector field name
        .data(queryVector)       // Query vector
        .filter(filterSlop3)     // Filter expression
        .searchParams(new HashMap<>())
        .topK(10)                // Maximum results to return
        .outputFields(Arrays.asList("id", "text"))
        .build()
);

System.out.printf("Slop 3 result: %s%n", resultSlop3);
```

</TabItem>

<TabItem value='javascript'>

```javascript
const filter_slop3 = "PHRASE_MATCH(text, 'learning machine', 3)";

const result_slop3 = await client.search({
  collection_name: COLLECTION_NAME,
  anns_field: "embeddings",
  data: [0.1, 0.2, 0.3, 0.4, 0.5],
  filter: filter_slop3,
  limit: 10,
  output_fields: ["id", "text"],
});
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
curl -X POST "http://${MILVUS_HOST}/v2/vectordb/entities/search" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -d "{
    \"collectionName\": \"${COLLECTION_NAME}\",
    \"annsField\": \"embeddings\",
    \"data\": [[0.1, 0.2, 0.3, 0.4, 0.5]],
    \"filter\": \"PHRASE_MATCH(text, 'machine learning', 3)\",
    \"searchParams\": {},
    \"limit\": 10,
    \"outputFields\": [\"id\", \"text\"]
  }"
```

</TabItem>
</Tabs>

## 考慮事項{#considerations}

- フィールドのフレーズマッチングを有効にすると、転置インデックスが作成され、ストレージリソースを消費します。この機能を有効にするかどうかを決定する際には、テキストサイズ、一意のトークン、および使用されるアナライザーによって異なるため、ストレージへの影響を考慮してください。

- スキーマでアナライザーを定義すると、その設定はそのコレクションに対して永続的になります。別のanalyserがニーズにより適していると判断した場合は、既存のコレクションを削除し、目的のanalyser構成で新しいコレクションを作成することを検討してください。

- フレーズマッチのパフォーマンスは、テキストがどのようにトークン化されるかに依存します。アナライザーをコレクション全体に適用する前に、`run_analyzer` メソッドを使用してトークン化の出力を確認してください。詳細については、[アナライザーの概要](./analyzer-overview)を参照してください。

- `filter` 式におけるエスケープルール:

    - 式内で二重引用符または一重引用符で囲まれた文字は、文字列定数として解釈されます。文字列定数にエスケープ文字が含まれる場合、エスケープ文字はエスケープシーケンスで表現する必要があります。たとえば、`\` を表すには `\\`、タブ `\t` を表すには `\\t`、改行を表すには `\\n` を使用します。

    - 文字列定数が一重引用符で囲まれている場合、定数内の一重引用符は `\\'` として表現する必要があり、二重引用符は `"` または `\\"` のいずれかで表現できます。例: `'It\\'s milvus'`。

    - 文字列定数が二重引用符で囲まれている場合、定数内の二重引用符は `\\"` として表現する必要があり、一重引用符は `'` または `\\'` のいずれかで表現できます。例: `"He said \\"Hi\\""`。

