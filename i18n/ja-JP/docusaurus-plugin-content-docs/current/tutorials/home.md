---
title: "ホーム | Cloud"
slug: /home
sidebar_label: "ホーム"
beta: FALSE
notebook: FALSE
description: "これは Zilliz Cloud Developer Hub のホームページです。| Cloud"
type: origin
token: KXgEwDH8yifWxukkXXFctMdLnpg
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - はじめに
  - デベロッパーハブ
  - ホームページ
  - ホーム

hide_title: true
hide_table_of_contents: true
---

import Admonition from '@theme/Admonition';



import Hero from '@site/src/components/Hero';


import Bars from '@site/src/components/Bars';


import Blocks from '@site/src/components/Blocks';


import Cards from '@site/src/components/Cards';


import Stories from '@site/src/components/Stories';


import Banner from '@site/src/components/Banner';



<Hero>

# 自信を持って構築し、AI アプリケーションを加速\{#build-with-confidence-and-supercharge-your-ai-applications}

Zilliz Cloud は、セキュリティを考慮したベクトル検索アプリケーションのデプロイとスケーリングを簡素化する、完全マネージド型の Milvus サービスを提供します。

## ベクトル検索の基本\{#basic-vector-search}

近似最近傍（ANN）検索を実行して、クエリベクトルに最も類似したベクトルを見つけます。[詳細はこちら](./single-vector-search)。

```json
// Dataset: 3 items with vectors and color metadata
// Search target: Find top 3 most similar items to query vector
[
    {
        "id": 0,
        "vector": [0.358, -0.602, 0.184, -0.263, 0.903],
        "color": "pink_8682"
    },
    {
        "id": 1,
        "vector": [0.199, 0.060, 0.698, 0.261, 0.839],
        "color": "red_7025"
    },
    {
        "id": 2,
        "vector": [0.437, -0.560, 0.646, 0.789, 0.208],
        "color": "orange_6781"
    }
]
```

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# Query vector to search for similar items
query_vector = [0.358, -0.602, 0.184, -0.263, 0.903]

res = client.search(
    collection_name="my_collection",
    data=[query_vector],
    anns_field="vector",  # Field to search on
    limit=3,  # Return top 3 results
    search_params={"metric_type": "IP"}  # Inner Product similarity
)

for hits in res:
    for hit in hits:
        print(f"ID: {hit['id']}, Distance: {hit['distance']}")
```

```java
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.request.data.FloatVec;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
    .uri("YOUR_CLUSTER_ENDPOINT")
    .token("YOUR_CLUSTER_TOKEN")
    .build());

FloatVec queryVector = new FloatVec(new float[]{0.358f, -0.602f, 0.184f, -0.263f, 0.903f});
SearchReq searchReq = SearchReq.builder()
    .collectionName("my_collection")
    .data(Collections.singletonList(queryVector))
    .annsField("vector")
    .topK(3)
    .build();

SearchResp searchResp = client.search(searchReq);
```

```go
import (
    "context"
    "github.com/milvus-io/milvus/client/v2/entity"
    "github.com/milvus-io/milvus/client/v2/milvusclient"
)

ctx := context.Background()
client, _ := milvusclient.New(ctx, &milvusclient.ClientConfig{
    Address: "YOUR_CLUSTER_ENDPOINT",
    APIKey:  "YOUR_CLUSTER_TOKEN",
})

queryVector := []float32{0.358, -0.602, 0.184, -0.263, 0.903}
resultSets, _ := client.Search(ctx, milvusclient.NewSearchOption(
    "my_collection",
    3,
    []entity.Vector{entity.FloatVector(queryVector)},
).WithANNSField("vector"))
```

```javascript
import { MilvusClient } from "@zilliz/milvus2-sdk-node";

const client = new MilvusClient({
address: "YOUR_CLUSTER_ENDPOINT",
token: "YOUR_CLUSTER_TOKEN",
});

const query_vector = [0.358, -0.602, 0.184, -0.263, 0.903];

const res = await client.search({
collection_name: "my_collection",
data: [query_vector],
anns_field: "vector",
limit: 3,
});

console.log(res.results);
```

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "data": [[0.358, -0.602, 0.184, -0.263, 0.903]],
    "annsField": "vector",
    "limit": 3
}'
```

## フィルター付き検索\{#filtered-search}

ベクトル検索の前にメタデータフィルターを適用して検索範囲を絞り込み、結果の関連性を向上させます。[詳細はこちら](./filtered-search)。

```json
// Dataset: 3 items with vectors and color metadata
// Search target: Find items with color starting with "red"
[
    {
        "id": 0,
        "vector": [0.358, -0.602, 0.184, -0.263, 0.903],
        "color": "pink_8682"
    },
    {
        "id": 1,
        "vector": [0.199, 0.060, 0.698, 0.261, 0.839],
        "color": "red_7025"
    },
    {
        "id": 2,
        "vector": [0.437, -0.560, 0.646, 0.789, 0.208],
        "color": "orange_6781"
    }
]
```

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# Search with metadata filter applied before vector search
res = client.search(
    collection_name="my_collection",
    data=[[0.358, -0.602, 0.184, -0.263, 0.903]],
    filter='color like "red%"',  # Filter: only search items with color starting with "red"
    limit=3,
    output_fields=["color"]  # Return color field in results
)
```

```java
import io.milvus.v2.service.vector.request.SearchReq;

SearchReq searchReq = SearchReq.builder()
    .collectionName("my_collection")
    .data(Collections.singletonList(new FloatVec(new float[]{0.358f, -0.602f, 0.184f, -0.263f, 0.903f})))
    .filter("color like \"red%\"")
    .topK(3)
    .outputFields(Lists.newArrayList("color"))
    .build();

SearchResp searchResp = client.search(searchReq);
```

```go
resultSets, _ := client.Search(ctx, milvusclient.NewSearchOption(
    "my_collection",
    3,
    []entity.Vector{entity.FloatVector([]float32{0.358, -0.602, 0.184, -0.263, 0.903})},
).WithFilter("color like \"red%\"").WithOutputFields("color"))
```

```javascript
const res = await client.search({
    collection_name: "my_collection",
    data: [[0.358, -0.602, 0.184, -0.263, 0.903]],
    filter: 'color like "red%"',
    limit: 3,
    output_fields: ["color"]
});
```

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "data": [[0.358, -0.602, 0.184, -0.263, 0.903]],
    "filter": "color like \"red%\"",
    "limit": 3,
    "outputFields": ["color"]
}'
```

## グルーピング検索\{#grouping-search}

検索結果をフィールドごとにグループ化して、より高レベルでデータを集約し、結果の多様性を向上させます。[詳細はこちら](./grouping-search)。

```json
// Dataset: 3 items from different documents (docId)
// Search target: Get top result from each unique document
[
    {
        "id": 0,
        "vector": [0.358, -0.602, 0.184, -0.263, 0.903],
        "docId": 1
    },
    {
        "id": 1,
        "vector": [0.199, 0.060, 0.698, 0.261, 0.839],
        "docId": 5
    },
    {
        "id": 2,
        "vector": [0.437, -0.560, 0.646, 0.789, 0.208],
        "docId": 2
    }
]
```

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# Group results by docId to get diverse results from different documents
res = client.search(
    collection_name="my_collection",
    data=[[0.145, 0.915, 0.797, 0.701, 0.561]],
    limit=3,
    group_by_field="docId",  # Group by: return top result from each unique docId
    output_fields=["docId"]
)
```

```java
SearchReq searchReq = SearchReq.builder()
    .collectionName("my_collection")
    .data(Collections.singletonList(new FloatVec(new float[]{0.145f, 0.915f, 0.797f, 0.701f, 0.561f})))
    .topK(3)
    .groupByFieldName("docId")
    .outputFields(Lists.newArrayList("docId"))
    .build();

SearchResp searchResp = client.search(searchReq);
```

```go
resultSets, _ := client.Search(ctx, milvusclient.NewSearchOption(
    "my_collection",
    3,
    []entity.Vector{entity.FloatVector([]float32{0.145, 0.915, 0.797, 0.701, 0.561})},
).WithGroupByField("docId").WithOutputFields("docId"))
```

```javascript
const res = await client.search({
    collection_name: "my_collection",
    data: [[0.145, 0.915, 0.797, 0.701, 0.561]],
    limit: 3,
    group_by_field: "docId",
    output_fields: ["docId"]
});
```

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "data": [[0.145, 0.915, 0.797, 0.701, 0.561]],
    "groupByField": "docId",
    "limit": 3,
    "outputFields": ["docId"]
}'
```

## ハイブリッド検索\{#hybrid-search}

複数のベクトルフィールドを組み合わせて、テキスト、画像などに対するマルチモーダル検索を実行します。[詳細はこちら](./hybrid-search)。

```json
// Dataset: 3 items with text and image embeddings
// Search target: Combine text and image similarity for multi-modal search
[
    {
        "id": 0,
        "text_dense": [0.358, -0.602, 0.184],
        "image_dense": [0.123, 0.456, 0.789]
    },
    {
        "id": 1,
        "text_dense": [0.199, 0.060, 0.698],
        "image_dense": [0.789, 0.234, 0.567]
    },
    {
        "id": 2,
        "text_dense": [0.437, -0.560, 0.646],
        "image_dense": [0.567, 0.890, 0.123]
    }
]
```

```python
from pymilvus import MilvusClient, AnnSearchRequest, RRFRanker

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# Search request 1: text dense vector
req1 = AnnSearchRequest(
    data=[[0.358, -0.602, ...]],
    anns_field="text_dense",  # Search on text embeddings
    param={"metric_type": "IP"},
    limit=3
)
# Search request 2: image dense vector
req2 = AnnSearchRequest(
    data=[[0.123, 0.456, ...]],
    anns_field="image_dense",  # Search on image embeddings
    param={"metric_type": "IP"},
    limit=3
)

# Combine multiple vector searches with RRF (Reciprocal Rank Fusion)
res = client.hybrid_search(
    collection_name="my_collection",
    reqs=[req1, req2],  # Multiple search requests
    ranker=RRFRanker(),  # Rerank combined results
    limit=3
)
```

```java
Map<String,Object> params1 = new HashMap<>();
params1.put("metric_type", "IP");
AnnSearchReq req1 = AnnSearchReq.builder()
    .vectorFieldName("text_dense")
    .vectors(Collections.singletonList(new FloatVec(textVector)))
    .params(params1)
    .topK(3)
    .build();

AnnSearchReq req2 = AnnSearchReq.builder()
    .vectorFieldName("image_dense")
    .vectors(Collections.singletonList(new FloatVec(imageVector)))
    .params(params1)
    .topK(3)
    .build();

HybridSearchReq hybridSearchReq = HybridSearchReq.builder()
    .collectionName("my_collection")
    .searchRequests(Arrays.asList(req1, req2))
    .ranker(new RRFRanker(60))
    .topK(3)
    .build();
```

```go
req1 := milvusclient.NewANNSearchRequest(
    "text_dense",
    entity.IP,
    "",
    []entity.Vector{entity.FloatVector(textVector)},
    3,
)
req2 := milvusclient.NewANNSearchRequest(
    "image_dense",
    entity.IP,
    "",
    []entity.Vector{entity.FloatVector(imageVector)},
    3,
)

resultSets, _ := client.HybridSearch(ctx,
    milvusclient.NewHybridSearchOption(
        "my_collection",
        3,
        []milvusclient.ANNSearchRequest{req1, req2},
    ).WithRRFRanker(milvusclient.NewRRFRanker(60)),
)
```

```javascript
const res = await client.search({
    collection_name: "my_collection",
    data: [textVector, imageVector],
    anns_field: ["text_dense", "image_dense"],
    limit: 3
});
```

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/hybrid_search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "search": [
        {"data": [textVector], "annsField": "text_dense", "limit": 3},
        {"data": [imageVector], "annsField": "image_dense", "limit": 3}
    ],
    "limit": 3
}'
```

## Full Text Search\{#full-text-search}

BM25 関連性スコアリングによるキーワードマッチングを使用してテキストを検索し、正確な用語の取得を実現します。[詳細はこちら](./full-text-search)。

```json
// Dataset: 3 text documents with BM25 sparse embeddings
// Search target: Find documents matching "machine learning" keywords
[
    {
        "id": 0,
        "text": "Artificial intelligence and machine learning",
        "text_sparse": {
            "indices": [12, 45, 78],
            "values": [0.8, 0.6, 0.9]
        }
    },
    {
        "id": 1,
        "text": "Neural networks for deep learning",
        "text_sparse": {
            "indices": [23, 56, 89],
            "values": [0.7, 0.5, 0.8]
        }
    },
    {
        "id": 2,
        "text": "Machine learning algorithms and applications",
        "text_sparse": {
            "indices": [12, 67, 90],
            "values": [0.9, 0.7, 0.6]
        }
    }
]
```

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# Full-text search using raw text query (BM25 keyword matching)
res = client.search(
    collection_name="my_collection",
    data=["machine learning"],  # Raw text query (no manual embedding needed)
    anns_field="text_sparse",  # Search on sparse vectors generated by BM25
    limit=3
)
```

```java
SearchReq searchReq = SearchReq.builder()
    .collectionName("my_collection")
    .data(Collections.singletonList("machine learning"))
    .annsField("text_sparse")
    .topK(3)
    .build();

SearchResp searchResp = client.search(searchReq);
```

```go
resultSets, _ := client.Search(ctx, milvusclient.NewSearchOption(
    "my_collection",
    3,
    []entity.Vector{entity.NewSparseEmbedding("machine learning")},
).WithANNSField("text_sparse"))
```

```javascript
const res = await client.search({
    collection_name: "my_collection",
    data: ["machine learning"],
    anns_field: "text_sparse",
    limit: 3
});
```

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "data": ["machine learning"],
    "annsField": "text_sparse",
    "limit": 3
}'
```

## Search Iterator\{#search-iterator}

ページネーションされたイテレーションを使用して、16,384 の制限を超えた大規模な検索結果を取得します。[詳細はこちら](./with-iterators)。

```json
// Dataset: First 3 items with vectors
// Search target: Iterate through 20,000 results in batches of 50
[
    {
        "id": 0,
        "vector": [0.358, -0.602, 0.184, -0.263, 0.903]
    },
    {
        "id": 1,
        "vector": [0.199, 0.060, 0.698, 0.261, 0.839]
    },
    {
        "id": 2,
        "vector": [0.437, -0.560, 0.646, 0.789, 0.208]
    }
]
```

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# Create iterator for large-scale retrieval (beyond 16,384 limit)
iterator = client.search_iterator(
    collection_name="my_collection",
    data=[[0.358, -0.602, 0.184, -0.263, 0.903]],
    anns_field="vector",
    batch_size=50,  # Return 50 results per iteration
    limit=20000  # Total results to retrieve
)

# Iterate through results in batches
while True:
    result = iterator.next()
    if not result:
        iterator.close()
        break
```

```java
SearchIterator searchIterator = client.searchIterator(
    SearchIteratorReq.builder()
        .collectionName("my_collection")
        .vectors(Collections.singletonList(queryVector))
        .vectorFieldName("vector")
        .batchSize(500L)
        .outputFields(Lists.newArrayList("id"))
        .build()
);

while (true) {
    List<QueryResultsWrapper.RowRecord> res = searchIterator.next();
    if (res.isEmpty()) {
        searchIterator.close();
        break;
    }
}
```

```go
itr, _ := client.SearchIterator(ctx, milvusclient.NewSearchIteratorOption(
    "my_collection",
    []entity.Vector{entity.FloatVector(queryVector)},
).WithBatchSize(500))

for {
    rs, err := itr.Next(ctx)
    if err != nil || len(rs) == 0 {
        itr.Close()
        break
    }
}
```

```javascript
const iterator = await client.searchIterator({
    collection_name: "my_collection",
    data: [[0.358, -0.602, 0.184, -0.263, 0.903]],
    batch_size: 50,
    limit: 20000
});

let result = await iterator.next();
while (result.length > 0) {
    result = await iterator.next();
}
```

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search_iterator" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "data": [[0.358, -0.602, 0.184, -0.263, 0.903]],
    "annsField": "vector",
    "batchSize": 50,
    "limit": 20000
}'
```

## Query\{#query}

ベクトル検索を行わず、スカラーフィールドまたはプライマリキーでフィルタリングしてエンティティを取得します。[詳細はこちら](./get-and-scalar-query)。

```json
// Dataset: 3 items with vectors and color metadata
// Search target: Query items where color starts with "red" (no vector search)
[
    {
        "id": 0,
        "vector": [0.358, -0.602, 0.184, -0.263, 0.903],
        "color": "pink_8682"
    },
    {
        "id": 1,
        "vector": [0.199, 0.060, 0.698, 0.261, 0.839],
        "color": "red_7025"
    },
    {
        "id": 2,
        "vector": [0.437, -0.560, 0.646, 0.789, 0.208],
        "color": "orange_6781"
    }
]
```

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# Query entities by scalar field filter (no vector search)
res = client.query(
    collection_name="my_collection",
    filter='color like "red%"',  # Filter condition on scalar field
    output_fields=["id", "color"]  # Fields to return
)
```

```java
QueryReq queryReq = QueryReq.builder()
    .collectionName("my_collection")
    .filter("color like \"red%\"")
    .outputFields(Lists.newArrayList("id", "color"))
    .build();

QueryResp queryResp = client.query(queryReq);
```

```go
resultSets, _ := client.Query(ctx, milvusclient.NewQueryOption(
    "my_collection",
).WithFilter("color like \"red%\"").WithOutputFields("id", "color"))
```

```javascript
const res = await client.query({
    collection_name: "my_collection",
    filter: 'color like "red%"',
    output_fields: ["id", "color"]
});
```

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/query" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "filter": "color like \"red%\"",
    "outputFields": ["id", "color"]
}'
```

</Hero>

<Bars>

プロジェクトの [プラン](./select-zilliz-cloud-service-plans) を選択し、プロジェクト内で異なるデプロイオプションのクラスターを作成します。

- [無料](./create-cluster#create-a-free-cluster)

- [Serverless](./create-cluster#create-a-serverless-cluster)

- [専用](./create-cluster#create-a-dedicated-cluster)

[どのデプロイオプションを選べばよいかわからないですか？](https://zilliz.com/pricing)

</Bars>

<Stories>

# Zilliz Cloud でのデータの操作\{#work-with-your-data-in-zilliz-cloud}

## ベクトルの持ち込み\{#bring-your-own-vectors}

1. クラスターを作成し、接続します。

    必要なコンピューティングおよびストレージリソースを備えた [クラスターを作成](./create-cluster) し、それに [接続](./connect-to-cluster) します。

1. コレクションを作成します。

    コレクションは、固定された列と可変の行を持つ 2 次元テーブルです。データを操作するために [コレクションを作成](./manage-collections-sdks) します。

1. データをインポートします。

    ローカルファイルまたはオブジェクトストレージバケットから [データをインポート](./data-import) します。

1. ベクトル類似検索を実行します。

    [基本的なベクトル類似検索](./single-vector-search) を使用すると、最も類似した結果を見つけることができます。

## 統合埋め込み\{#integrated-embedding}

1. クラスターを作成し、接続します。

    必要なコンピューティングおよびストレージリソースを備えた [クラスターを作成](./create-cluster) し、それに [接続](./connect-to-cluster) します。

1. モデルプロバイダー連携を設定するか、ホスト済みモデルをデプロイします。

    サードパーティのモデルプロバイダーの認証情報を保存するための [連携を作成](./integrate-with-model-providers) します。または、ホスト済みモデルを [デプロイ](./hosted-models) することもできます。

1. コレクションを作成し、埋め込み関数を構成します。

    少なくとも 1 つのベクトルフィールドと 1 つの VARCHAR フィールドを含む [コレクションを作成](./manage-collections-sdks) し、テキスト埋め込み [関数](./model-based-functions) を定義します。

1. 生テキストデータを挿入します。

    生データを [挿入](./insert-entities) します。Zilliz Cloud は取り込み中に自動的にベクトル埋め込みを生成します。

1. 生テキストを使用して検索を実行します。

    生クエリテキストを提供します。Zilliz Cloud はクエリを埋め込み、保存されたベクトルと比較して、最も関連性の高い結果を [返却](./single-vector-search) します。

## 他のデータインフラからの移行\{#migrate-from-other-data-infra}

1. データソースに接続します。

    Zilliz Cloud は、Pinecone、MongoDB、Qdrant、PostgreSQL など、さまざまなデータソースをサポートしています。[移行ガイド](./migrations) をご覧ください。

1. 移行ソースとターゲットを構成します。

    データソース情報を確認し、移行ターゲットを構成します。

1. マッピングを確認します。

    ソースデータとターゲットデータのスキーマ間のマッピングを設定し、確認します。

## バックアップと復元\{#backup-and-restore}

1. クラスターまたはコレクションのバックアップを作成します。

    バックアップは、クラスターまたはコレクションの特定時点のコピーです。バックアップは [手動で](./create-snapshot) 作成するか、定期バックアップのために [バックアップポリシーを設定](./schedule-automatic-backups) できます。また、災害復旧機能を向上させるために、[バックアップを他のリージョンにコピー](/docs/backup-to-other-regions) することもできます。

1. (オプション) バックアップをオブジェクトストレージサービスにエクスポートします。

    作成した [バックアップファイルをエクスポート](./export-backup-files) して、AWS S3 または Azure Blob Storage に保存できます。

1. データを復元します。

    予期せぬシステム障害やデータ損失が発生した場合に、[データを復元](./restore-from-snapshot) します。

</Stories>

<Cards>

# Zilliz Cloud をさらに活用する\{#go-further-with-zilliz-cloud}

- [モニタリングとアラート](./metrics-and-alerts)

    クラスターを監視し、タイムリーにアラートを受け取ります。

- [アクセス制御](./access-control)

    きめ細かいアクセス制御でデータを保護します。

- [プライベートネットワーク](./setup-a-private-link)

    クラスターをプライベートネットワークに接続します。

- break

- [請求](./payment-billing)

    前払い費用なしで使用した分だけ支払います。

- [連携](./integrate-with-third-parties)

    既存のツールやワークフローと連携します。

</Cards>

<Blocks>

# お好みの言語で構築を開始する\{#start-building-with-your-preferred-language}

- [Python](/reference/python)

- [Java](/reference/java)

- [Go](/reference/go)

- [Node.js](/reference/nodejs)

- [RESTful API](/reference/restful)

</Blocks>

<Banner bannerText="Can't find what you're looking for?" bannerLinkText="Try Ask AI" />

