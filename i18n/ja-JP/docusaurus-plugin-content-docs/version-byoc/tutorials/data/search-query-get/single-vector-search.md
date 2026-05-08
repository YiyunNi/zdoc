---
title: "基本的なベクトル検索 | BYOC"
slug: /single-vector-search
sidebar_key: single-vector-search
sidebar_label: "基本的なベクトル検索"
beta: FALSE
notebook: FALSE
description: "ベクトル埋め込みのソート順を記録したインデックスファイルに基づき、近似最近傍（ANN）検索は受信した検索リクエストに含まれるクエリベクトルに基づいてベクトル埋め込みのサブセットを特定し、クエリベクトルとサブグループ内のベクトルを比較して最も類似した結果を返します。ANN検索により、Zilliz Cloud は効率的な検索体験を提供します。このページでは、基本的なANN検索の実行方法を学ぶことができます。 | BYOC"
type: origin
token: BaGlwzDmyiyVvVk6NurcFclInCd
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - データ
  - ベクトル検索
  - ann

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ベクトル検索の基本

ベクトル埋め込みのソート順を記録したインデックスファイルに基づき、近似最近傍（ANN）検索は受信した検索リクエストに含まれるクエリベクトルに基づいてベクトル埋め込みのサブセットを特定し、クエリベクトルとそのサブグループ内のベクトルを比較して、最も類似した結果を返します。ANN検索により、Zilliz Cloud は効率的な検索体験を提供します。このページでは、基本的な ANN 検索の実行方法を学ぶことができます。

<Admonition type="info" icon="📘" title="Notes">

<p>コレクション作成後に動的に新しいフィールドを追加した場合、これらのフィールドを含む検索では、明示的に値を設定していないエンティティに対して、定義されたデフォルト値または NULL が返されます。詳細については、<a href="./add-fields-to-an-existing-collection">既存のコレクションへのフィールド追加</a>を参照してください。</p>

</Admonition>

## 概要\{#overview}

ANN 検索と k-最近傍（kNN）検索は、ベクトル類似度検索で一般的な方法です。kNN 検索では、最も類似したベクトルを特定する前に、ベクトル空間内のすべてのベクトルを検索リクエストに含まれるクエリベクトルと比較する必要があり、時間とリソースを多く消費します。

kNN 検索とは異なり、ANN 検索アルゴリズムでは、ベクトル埋め込みのソート順を記録した**インデックス**ファイルが必要です。検索リクエストが届くと、インデックスファイルを参照として使用して、クエリベクトルに最も類似したベクトル埋め込みを含む可能性が高いサブグループを迅速に特定できます。次に、指定された**メトリックタイプ**を使用してクエリベクトルとサブグループ内のベクトルの類似度を測定し、クエリベクトルとの類似度に基づいてグループメンバーをソートし、**top-K** のグループメンバーを特定します。

ANN 検索は事前構築されたインデックスに依存し、選択したインデックスタイプによって検索スループット、メモリ使用量、検索の正確性が異なる場合があります。検索パフォーマンスと正確性のバランスを取る必要があります。

学習曲線を緩やかにするため、Zilliz Cloud は **AUTOINDEX** を提供しています。**AUTOINDEX** を使用すると、Zilliz Cloud はインデックス構築時にコレクション内のデータ分布を分析し、その分析に基づいて最適化されたインデックスパラメータを設定し、検索パフォーマンスと正確性のバランスを取ります。

AUTOINDEX と適用可能なメトリックタイプの詳細については、[AUTOINDEX の解説](./autoindex-explained)および[メトリックタイプ](./search-metrics-explained)を参照してください。このセクションでは、以下のトピックについての詳細情報を確認できます。

- [単一ベクトル検索](./single-vector-search#single-vector-search)

- [一括ベクトル検索](./single-vector-search#bulk-vector-search)

- [パーティションでの ANN 検索](./single-vector-search#ann-search-in-partition)

- [出力フィールドの使用](./single-vector-search#use-output-fields)

- [limit と offset の使用](./single-vector-search#use-limit-and-offset)

- [level の使用](./single-vector-search#use-level)

- [再現率の取得](./single-vector-search#get-recall-rate)

- [ANN 検索の強化](./single-vector-search#enhancing-ann-search)

## 単一ベクトル検索\{#single-vector-search}

ANN 検索において、単一ベクトル検索とは、1 つのクエリベクトルのみを含む検索を指します。事前構築されたインデックスと検索リクエストに含まれるメトリックタイプに基づき、Zilliz Cloud はクエリベクトルに最も類似した top-K のベクトルを見つけ出します。

このセクションでは、単一ベクトル検索の実行方法を学びます。検索リクエストには単一のクエリベクトルが含まれ、Zilliz Cloud に対して 内積（IP）を使用してクエリベクトルとコレクション内のベクトルの類似度を計算し、最も類似した 3 つを返すよう要求します。

<Admonition type="info" icon="📘" title="Notes">

<p>データプレーン RESTful API エンドポイントを呼び出す際は、ターゲットクラスターのコロン区切りのユーザー名とパスワード（例: <code>username:password</code>）を認証トークンとして使用してください。</p>

</Admonition>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# 4. Single vector search
query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]
res = client.search(
    collection_name="quick_setup",
    anns_field="vector",
    data=[query_vector],
    limit=3,
    search_params={"metric_type": "IP"}
)

for hits in res:
    for hit in hits:
        print(hit)

# [
#     [
#         {
#             "id": 551,
#             "distance": 0.08821295201778412,
#             "entity": {}
#         },
#         {
#             "id": 296,
#             "distance": 0.0800950899720192,
#             "entity": {}
#         },
#         {
#             "id": 43,
#             "distance": 0.07794742286205292,
#             "entity": {}
#         }
#     ]
# ]
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.request.data.FloatVec;
import io.milvus.v2.service.vector.response.SearchResp;

import java.util.*;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .token("YOUR_CLUSTER_TOKEN")
        .build());
    
FloatVec queryVector = new FloatVec(new float[]{0.3580376395471989f, -0.6023495712049978f, 0.18414012509913835f, -0.26286205330961354f, 0.9029438446296592f});
SearchReq searchReq = SearchReq.builder()
        .collectionName("quick_setup")
        .data(Collections.singletonList(queryVector))
        .annsField("vector")
        .topK(3)
        .build();

SearchResp searchResp = client.search(searchReq);

List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
for (List<SearchResp.SearchResult> results : searchResults) {
    System.out.println("TopK results:");
    for (SearchResp.SearchResult result : results) {
        System.out.println(result);
    }
}

// Output
// TopK results:
// SearchResp.SearchResult(entity={}, score=0.95944905, id=5)
// SearchResp.SearchResult(entity={}, score=0.8689616, id=1)
// SearchResp.SearchResult(entity={}, score=0.866088, id=7)
```

</TabItem>

<TabItem value='java'>

```go
import (
    "context"
    "fmt"

    "github.com/milvus-io/milvus/client/v2/entity"
    "github.com/milvus-io/milvus/client/v2/milvusclient"
)

ctx, cancel := context.WithCancel(context.Background())
defer cancel()

milvusAddr := "YOUR_CLUSTER_ENDPOINT"
token := "YOUR_CLUSTER_TOKEN"

client, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
    Address: milvusAddr,
    APIKey:  token,
})
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
defer client.Close(ctx)

queryVector := []float32{0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592}

resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "quick_setup", // collectionName
    3,               // limit
    []entity.Vector{entity.FloatVector(queryVector)},
).WithANNSField("vector"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

for _, resultSet := range resultSets {
    fmt.Println("IDs: ", resultSet.IDs.FieldData().GetScalars())
    fmt.Println("Scores: ", resultSet.Scores)
}

```

</TabItem>

<TabItem value='java'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const address = "YOUR_CLUSTER_ENDPOINT";
const token = "YOUR_CLUSTER_TOKEN";
const client = new MilvusClient({address, token});

// 4. Single vector search
var query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],

res = await client.search({
    collection_name: "quick_setup",
    data: query_vector,
    limit: 3, // The number of results to return
})

console.log(res.results)

// [
//   { score: 0.08821295201778412, id: '551' },
//   { score: 0.0800950899720192, id: '296' },
//   { score: 0.07794742286205292, id: '43' }
// ]
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "quick_setup",
    "data": [
        [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]
    ],
    "annsField": "vector",
    "limit": 3
}'

# {
#     "code": 0,
#     "data": [
#         {
#             "distance": 0.08821295201778412,
#             "id": 551
#         },
#         {
#             "distance": 0.0800950899720192,
#             "id": 296
#         },
#         {
#             "distance": 0.07794742286205292,
#             "id": 43
#         }
#     ]
# }
```

</TabItem>
</Tabs>

Milvus は、検索結果をクエリベクトルとの類似度スコアに基づいて降順にランキングします。この類似度スコアはクエリベクトルへの距離とも呼ばれ、その値の範囲は使用中のメトリックタイプによって異なります。

次の表は、適用可能なメトリックタイプと対応する距離の範囲を示しています。

<table>
   <tr>
     <th><p>メトリックタイプ</p></th>
     <th><p>Characteristics</p></th>
     <th><p>Distance Range</p></th>
   </tr>
   <tr>
     <td><p><code>L2</code></p></td>
     <td><p>A smaller value indicates a higher similarity.</p></td>
     <td><p>[0, ∞)</p></td>
   </tr>
   <tr>
     <td><p><code>IP</code></p></td>
     <td><p>A greater value indicates a higher similarity.</p></td>
     <td><p>[-1, 1]</p></td>
   </tr>
   <tr>
     <td><p><code>COSINE</code></p></td>
     <td><p>A greater value indicates a higher similarity.</p></td>
     <td><p>[-1, 1]</p></td>
   </tr>
   <tr>
     <td><p><code>JACCARD</code></p></td>
     <td><p>A smaller value indicates a higher similarity.</p></td>
     <td><p>[0, 1]</p></td>
   </tr>
   <tr>
     <td><p><code>HAMMING</code></p></td>
     <td><p>A smaller value indicates a higher similarity.</p></td>
     <td><p>[0, dim(vector)]</p></td>
   </tr>
</table>

## Bulk-Vector Search\{#bulk-vector-search}

同様に、検索リクエストに複数のクエリベクトルを含めることができます。Zilliz Cloud はこれらのクエリベクトルに対して並列で ANN 検索を実行し、2 組の結果を返します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# 7. Search with multiple vectors
# 7.1. Prepare query vectors
query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648],
    [0.0039737443, 0.003020432, -0.0006188639, 0.03913546, -0.00089768134]
]

# 7.2. Start search
res = client.search(
    collection_name="quick_setup",
    data=query_vectors,
    limit=3,
)

for hits in res:
    print("TopK results:")
    for hit in hits:
        print(hit)

# Output
#
# [
#     [
#         {
#             "id": 551,
#             "distance": 0.08821295201778412,
#             "entity": {}
#         },
#         {
#             "id": 296,
#             "distance": 0.0800950899720192,
#             "entity": {}
#         },
#         {
#             "id": 43,
#             "distance": 0.07794742286205292,
#             "entity": {}
#         }
#     ],
#     [
#         {
#             "id": 730,
#             "distance": 0.04431751370429993,
#             "entity": {}
#         },
#         {
#             "id": 333,
#             "distance": 0.04231833666563034,
#             "entity": {}
#         },
#         {
#             "id": 232,
#             "distance": 0.04221535101532936,
#             "entity": {}
#         }
#     ]
# ]

```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.SearchReq
import io.milvus.v2.service.vector.request.data.BaseVector;
import io.milvus.v2.service.vector.request.data.FloatVec;
import io.milvus.v2.service.vector.response.SearchResp

List<BaseVector> queryVectors = Arrays.asList(
        new FloatVec(new float[]{0.041732933f, 0.013779674f, -0.027564144f, -0.013061441f, 0.009748648f}),
        new FloatVec(new float[]{0.0039737443f, 0.003020432f, -0.0006188639f, 0.03913546f, -0.00089768134f})
);
SearchReq searchReq = SearchReq.builder()
        .collectionName("quick_setup")
        .data(queryVectors)
        .topK(3)
        .build();

SearchResp searchResp = client.search(searchReq);

List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
for (List<SearchResp.SearchResult> results : searchResults) {
    System.out.println("TopK results:");
    for (SearchResp.SearchResult result : results) {
        System.out.println(result);
    }
}

// Output
// TopK results:
// SearchResp.SearchResult(entity={}, score=0.49548206, id=1)
// SearchResp.SearchResult(entity={}, score=0.320147, id=3)
// SearchResp.SearchResult(entity={}, score=0.107413776, id=6)
// TopK results:
// SearchResp.SearchResult(entity={}, score=0.5678123, id=6)
// SearchResp.SearchResult(entity={}, score=0.32368967, id=2)
// SearchResp.SearchResult(entity={}, score=0.24108477, id=3)
```

</TabItem>

<TabItem value='java'>

```go
queryVectors := []entity.Vector{
    entity.FloatVector([]float32{0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592}),
    entity.FloatVector([]float32{0.19886812562848388, 0.06023560599112088, 0.6976963061752597, 0.2614474506242501, 0.838729485096104}),
}

resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "quick_setup", // collectionName
    3,               // limit
    queryVectors,
).WithConsistencyLevel(entity.ClStrong).
    WithANNSField("vector"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

for _, resultSet := range resultSets {
    fmt.Println("IDs: ", resultSet.IDs.FieldData().GetScalars())
    fmt.Println("Scores: ", resultSet.Scores)
}
```

</TabItem>

<TabItem value='java'>

```javascript
// 7. Search with multiple vectors
const query_vectors = [
    [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592], 
    [0.19886812562848388, 0.06023560599112088, 0.6976963061752597, 0.2614474506242501, 0.838729485096104]
]

res = await client.search({
    collection_name: "quick_setup",
    vectors: query_vectors,
    limit: 3,
})

console.log(res.results)

// Output
// 
// [
//   [
//     { score: 0.08821295201778412, id: '551' },
//     { score: 0.0800950899720192, id: '296' },
//     { score: 0.07794742286205292, id: '43' }
//   ],
//   [
//     { score: 0.04431751370429993, id: '730' },
//     { score: 0.04231833666563034, id: '333' },
//     { score: 0.04221535101532936, id: '232' },
//   ]
// ]
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "quick_setup",
    "data": [
        [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],
        [0.19886812562848388, 0.06023560599112088, 0.6976963061752597, 0.2614474506242501, 0.838729485096104]
    ],
    "annsField": "vector",
    "limit": 3
}'

# {
#     "code": 0,
#     "data": [
#         [
#           {
#               "distance": 0.08821295201778412,
#               "id": 551
#           },
#           {
#               "distance": 0.0800950899720192,
#               "id": 296
#           },
#           {
#               "distance": 0.07794742286205292,
#               "id": 43
#           }
#         ],
#         [
#           {
#               "distance": 0.04431751370429993,
#               "id": 730
#           },
#           {
#               "distance": 0.04231833666563034,
#               "id": 333
#           },
#           {
#               "distance": 0.04221535101532936,
#               "id": 232
#           }
#        ]
#     ],
#     "topks":[3]
# }
```

</TabItem>
</Tabs>

## Primary-キー Search\{#primary-key-search}

クエリベクトルを設定する代わりに、クエリベクトルがすでにターゲットコレクションに存在している場合、プライマリキーを使用できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.search(
    collection_name="quick_setup",
    anns_field="vector",
    # highlight-start
    ids=[551, 296, 43],
    # highlight-end
    limit=3,
    search_params={"metric_type": "IP"}
)

for hits in res:
    for hit in hits:
        print(hit)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// node.js
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
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/entities/search" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLUSTER_TOKEN" \
  -d '{
    "collectionName": "quick_setup",
    "annsField": "vector",
    "ids": [551, 296, 43],
    "limit": 3,
    "searchParams": {
      "metric_type": "IP"
    }
  }'
```

</TabItem>
</Tabs>

## パーティション内でのANN検索\{#ann-search-in-partition}

コレクション内に複数のパーティションを作成している場合、検索範囲を特定のパーティションに限定できます。その場合は、検索リクエストにターゲットとなるパーティション名を指定することで、検索範囲をそのパーティション内に制限できます。検索対象のパーティション数を減らすことで、検索パフォーマンスが向上します。

以下のコードスニペットでは、コレクション内に **PartitionA** という名前のパーティションが存在することを前提としています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# 4. Single vector search
query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]
res = client.search(
    collection_name="quick_setup",
    # highlight-next-line
    partition_names=["partitionA"],
    data=[query_vector],
    limit=3,
)

for hits in res:
    print("TopK results:")
    for hit in hits:
        print(hit)

# [
#     [
#         {
#             "id": 551,
#             "distance": 0.08821295201778412,
#             "entity": {}
#         },
#         {
#             "id": 296,
#             "distance": 0.0800950899720192,
#             "entity": {}
#         },
#         {
#             "id": 43,
#             "distance": 0.07794742286205292,
#             "entity": {}
#         }
#     ]
# ]
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.SearchReq
import io.milvus.v2.service.vector.request.data.FloatVec;
import io.milvus.v2.service.vector.response.SearchResp

FloatVec queryVector = new FloatVec(new float[]{0.3580376395471989f, -0.6023495712049978f, 0.18414012509913835f, -0.26286205330961354f, 0.9029438446296592f});
SearchReq searchReq = SearchReq.builder()
        .collectionName("quick_setup")
        .partitionNames(Collections.singletonList("partitionA"))
        .data(Collections.singletonList(queryVector))
        .topK(3)
        .build();

SearchResp searchResp = client.search(searchReq);

List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
for (List<SearchResp.SearchResult> results : searchResults) {
    System.out.println("TopK results:");
    for (SearchResp.SearchResult result : results) {
        System.out.println(result);
    }
}

// Output
// TopK results:
// SearchResp.SearchResult(entity={}, score=0.6395302, id=13)
// SearchResp.SearchResult(entity={}, score=0.5408028, id=12)
// SearchResp.SearchResult(entity={}, score=0.49696884, id=17)
```

</TabItem>

<TabItem value='java'>

```go
queryVector := []float32{0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592}

resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "quick_setup", // collectionName
    3,               // limit
    []entity.Vector{entity.FloatVector(queryVector)},
).WithConsistencyLevel(entity.ClStrong).
    WithPartitions("partitionA").
    WithANNSField("vector"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

for _, resultSet := range resultSets {
    fmt.Println("IDs: ", resultSet.IDs.FieldData().GetScalars())
    fmt.Println("Scores: ", resultSet.Scores)
}
```

</TabItem>

<TabItem value='java'>

```javascript
// 4. Single vector search
var query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],

res = await client.search({
    collection_name: "quick_setup",
    // highlight-next-line
    partition_names: ["partitionA"],
    data: query_vector,
    limit: 3, // The number of results to return
})

console.log(res.results)

// [
//   { score: 0.08821295201778412, id: '551' },
//   { score: 0.0800950899720192, id: '296' },
//   { score: 0.07794742286205292, id: '43' }
// ]
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "quick_setup",
    "partitionNames": ["partitionA"],
    "data": [
        [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]
    ],
    "annsField": "vector",
    "limit": 3
}'

# {
#     "code": 0,
#     "data": [
#         {
#             "distance": 0.08821295201778412,
#             "id": 551
#         },
#         {
#             "distance": 0.0800950899720192,
#             "id": 296
#         },
#         {
#             "distance": 0.07794742286205292,
#             "id": 43
#         }
#     ],
#     "topks":[3]
# }
```

</TabItem>
</Tabs>

## 出力フィールドの使用\{#use-output-fields}

検索結果において、Zilliz Cloud はデフォルトで、上位 K 件のベクトル埋め込みを含むエンティティの主キーと類似度距離（またはスコア）を返します。検索リクエストに目的のフィールド名（ベクトルフィールドおよびスカラーフィールドの両方を含む）を出力フィールドとして指定することで、これらのエンティティに含まれる他のフィールドの値も検索結果に含めることができます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# 4. Single vector search
query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],

res = client.search(
    collection_name="quick_setup",
    data=[query_vector],
    limit=3, # The number of results to return
    search_params={"metric_type": "IP"}，
    # highlight-next-line
    output_fields=["color"]
)

print(res)

# [
#     [
#         {
#             "id": 551,
#             "distance": 0.08821295201778412,
#             "entity": {
#                 "color": "orange_6781"
#             }
#         },
#         {
#             "id": 296,
#             "distance": 0.0800950899720192,
#             "entity": {
#                 "color": "red_4794"
#             }
#         },
#         {
#             "id": 43,
#             "distance": 0.07794742286205292,
#             "entity": {
#                 "color": "grey_8510"
#             }
#         }
#     ]
# ]
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.SearchReq
import io.milvus.v2.service.vector.request.data.FloatVec;
import io.milvus.v2.service.vector.response.SearchResp

FloatVec queryVector = new FloatVec(new float[]{0.3580376395471989f, -0.6023495712049978f, 0.18414012509913835f, -0.26286205330961354f, 0.9029438446296592f});
SearchReq searchReq = SearchReq.builder()
        .collectionName("quick_setup")
        .data(Collections.singletonList(queryVector))
        .topK(3)
        .outputFields(Collections.singletonList("color"))
        .build();

SearchResp searchResp = client.search(searchReq);

List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
for (List<SearchResp.SearchResult> results : searchResults) {
    System.out.println("TopK results:");
    for (SearchResp.SearchResult result : results) {
        System.out.println(result);
    }
}

// Output
// TopK results:
// SearchResp.SearchResult(entity={color=black_9955}, score=0.95944905, id=5)
// SearchResp.SearchResult(entity={color=red_7319}, score=0.8689616, id=1)
// SearchResp.SearchResult(entity={color=white_5015}, score=0.866088, id=7)
```

</TabItem>

<TabItem value='java'>

```go
queryVector := []float32{0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592}

resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "quick_setup", // collectionName
    3,               // limit
    []entity.Vector{entity.FloatVector(queryVector)},
).WithConsistencyLevel(entity.ClStrong).
    WithANNSField("vector").
    WithOutputFields("color"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

for _, resultSet := range resultSets {
    fmt.Println("IDs: ", resultSet.IDs.FieldData().GetScalars())
    fmt.Println("Scores: ", resultSet.Scores)
    fmt.Println("color: ", resultSet.GetColumn("color").FieldData().GetScalars())
}
```

</TabItem>

<TabItem value='java'>

```javascript
// 4. Single vector search
var query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],

res = await client.search({
    collection_name: "quick_setup",
    data: query_vector,
    limit: 3, // The number of results to return
    // highlight-next-line
    output_fields: ["color"]
})

console.log(res.results)

// [
//   { score: 0.08821295201778412, id: '551', entity: {"color": "orange_6781"}},
//   { score: 0.0800950899720192, id: '296' entity: {"color": "red_4794"}},
//   { score: 0.07794742286205292, id: '43' entity: {"color": "grey_8510"}}
// ]
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "quick_setup",
    "data": [
        [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]
    ],
    "annsField": "vector",
    "limit": 3,
    "outputFields": ["color"]
}'

# {
#     "code": 0,
#     "data": [
#         {
#             "distance": 0.08821295201778412,
#             "id": 551,
#             "color": "orange_6781"
#         },
#         {
#             "distance": 0.0800950899720192,
#             "id": 296,
#             "color": "red_4794"
#         },
#         {
#             "distance": 0.07794742286205292,
#             "id": 43
#             "color": "grey_8510"
#         }
#     ],
#     "topks":[3]
# }
```

</TabItem>
</Tabs>

## 結果をスカラーフィールドで並べ替える | PRIVATE\{#sort-search-results-by-scalar-fields}

デフォルトでは、Zilliz Cloud は検索結果をクエリベクトルとの類似度スコア順に並べ替えます。返されるエンティティをスカラーフィールドの順序に従わせたい場合は、検索リクエストに `order_by_fields` を追加してください。

`order_by_fields` の各項目は、スカラーフィールドと並べ替え方向を指定します。昇順には `"asc"`、降順には `"desc"` を使用します。`order` を省略した場合、Zilliz Cloud はそのフィールドを昇順で並べ替えます。

以下の例では、検索結果を `price` で低から高へ並べ替えています。レスポンスでフィールド値を確認したい場合は、ソートフィールドを `output_fields` に含めてください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.search(
    collection_name="product_catalog",
    data=query_vectors,
    anns_field="embedding",
    limit=20,
    output_fields=["id", "price", "rating", "category"],
    # highlight-start
    order_by_fields=[
        {"field": "price", "order": "asc"}
    ],
    # highlight-end
)
```

</TabItem>

<TabItem value='java'>

```java
// java
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

複数のスカラーフィールドでソートすることもできます。Zilliz Cloud は、指定された順序でフィールドを適用します。以下の例では、Zilliz Cloud が結果を `price` の昇順でソートします。`price` が同じエンティティについては、さらに `rating` の降順でソートされます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.search(
    collection_name="product_catalog",
    data=query_vectors,
    anns_field="embedding",
    limit=20,
    output_fields=["id", "price", "rating", "category"],
    # highlight-start
    order_by_fields=[
        {"field": "price", "order": "asc"},
        {"field": "rating", "order": "desc"},
    ],
    # highlight-end
)
```

</TabItem>

<TabItem value='java'>

```java
// java
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

すべての指定された order-by フィールドの値が同じエンティティの場合、Zilliz Cloud は元の類似度スコアの順序を維持します。

## 制限 と オフセット の使用\{#use-limit-and-offset}

検索リクエストに含まれる `limit` パラメータが、検索結果に含まれるエンティティの数を決定することに気づかれたかもしれません。このパラメータは、1 回の検索で返されるエンティティの最大数を指定するもので、通常 **top-K** と呼ばれます。

ページネーションされたクエリを実行したい場合は、ループを使用して複数の Search リクエストを送信し、各クエリリクエストに **制限** および **オフセット** パラメータを含めることができます。具体的には、**制限** パラメータを現在のクエリ結果に含めたいエンティティの数に設定し、**オフセット** をすでに返されたエンティティの総数に設定します。

以下の表は、1 回あたり 100 個のエンティティを返す場合の、ページネーションされたクエリにおける **制限** および **オフセット** パラメータの設定方法を示しています。

<table>
   <tr>
     <th><p>クエリ</p></th>
     <th><p>クエリごとに返されるエンティティ</p></th>
     <th><p>これまでに返されたエンティティの総数</p></th>
   </tr>
   <tr>
     <td><p><strong>1 回目</strong>のクエリ</p></td>
     <td><p>100</p></td>
     <td><p>0</p></td>
   </tr>
   <tr>
     <td><p><strong>2 回目</strong>のクエリ</p></td>
     <td><p>100</p></td>
     <td><p>100</p></td>
   </tr>
   <tr>
     <td><p><strong>3 回目</strong>のクエリ</p></td>
     <td><p>100</p></td>
     <td><p>200</p></td>
   </tr>
   <tr>
     <td><p><strong>n 回目</strong>のクエリ</p></td>
     <td><p>100</p></td>
     <td><p>100 x (n-1)</p></td>
   </tr>
</table>

なお、1 回の ANN 検索における `limit` と `offset` の合計は 16,384 未満である必要があります。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# 4. Single vector search
query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],

res = client.search(
    collection_name="quick_setup",
    data=[query_vector],
    limit=3, # The number of results to return
    search_params={
        "metric_type": "IP", 
        # highlight-next-line
        "offset": 10 # The records to skip
    }
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.SearchReq
import io.milvus.v2.service.vector.request.data.FloatVec;
import io.milvus.v2.service.vector.response.SearchResp

FloatVec queryVector = new FloatVec(new float[]{0.3580376395471989f, -0.6023495712049978f, 0.18414012509913835f, -0.26286205330961354f, 0.9029438446296592f});
SearchReq searchReq = SearchReq.builder()
        .collectionName("quick_setup")
        .data(Collections.singletonList(queryVector))
        .topK(3)
        .offset(10)
        .build();

SearchResp searchResp = client.search(searchReq);

List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
for (List<SearchResp.SearchResult> results : searchResults) {
    System.out.println("TopK results:");
    for (SearchResp.SearchResult result : results) {
        System.out.println(result);
    }
}

// Output
// TopK results:
// SearchResp.SearchResult(entity={}, score=0.24120237, id=16)
// SearchResp.SearchResult(entity={}, score=0.22559784, id=9)
// SearchResp.SearchResult(entity={}, score=-0.09906838, id=2)
```

</TabItem>

<TabItem value='java'>

```go
queryVector := []float32{0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592}

resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "quick_setup", // collectionName
    3,               // limit
    []entity.Vector{entity.FloatVector(queryVector)},
).WithConsistencyLevel(entity.ClStrong).
    WithANNSField("vector").
    WithOffset(10))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

for _, resultSet := range resultSets {
    fmt.Println("IDs: ", resultSet.IDs.FieldData().GetScalars())
    fmt.Println("Scores: ", resultSet.Scores)
}
```

</TabItem>

<TabItem value='java'>

```javascript
// 4. Single vector search
var query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],

res = await client.search({
    collection_name: "quick_setup",
    data: query_vector,
    limit: 3, // The number of results to return,
    // highlight-next-line
    offset: 10 // The record to skip.
})
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "quick_setup",
    "data": [
        [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]
    ],
    "annsField": "vector",
    "limit": 3,
    "offset": 10
}'
```

</TabItem>
</Tabs>

## Use Level\{#use-level}

ANN検索を最適化するために、Zilliz Cloudは`level`というパラメータを提供しており、これにより簡略化された検索最適化で検索精度を制御できます。

このパラメータの範囲は`1`から`10`で、デフォルト値は`1`です。値を大きくすると検索の再現率（recall rate）が向上しますが、検索パフォーマンスは低下します。一般的なケースでは、デフォルト値で最大90%の再現率が得られます。必要に応じてこの値を増やすことができます。

<Admonition type="info" icon="📘" title="Notes">

<p><code>level</code> パラメータは現在<strong>パブリックプレビュー</strong>中です。もし<code>5</code>より大きい値を設定できない場合、ご利用のクラスタはこの機能を完全にはサポートしていない可能性があります。回避策として、代わりに<code>1</code>から<code>5</code>の範囲内の値を設定するか、<a href="https://zilliz.com/contact-sales">Zilliz Cloud サポート</a>までお問い合わせください。</p>

</Admonition>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# 4. Single vector search
query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],

res = client.search(
    collection_name="quick_setup",
    data=[query_vector],
    limit=3, # The number of results to return
    search_params={
        "params": {
            # highlight-next-line
            "level": 10 # The precision control
        }
    }
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.SearchReq
import io.milvus.v2.service.vector.request.data.FloatVec;
import io.milvus.v2.service.vector.response.SearchResp

FloatVec queryVector = new FloatVec(new float[]{0.3580376395471989f, -0.6023495712049978f, 0.18414012509913835f, -0.26286205330961354f, 0.9029438446296592f});
Map<String, Object> params = new HashMap<>();
params.put("level", 10);
SearchReq searchReq = SearchReq.builder()
        .collectionName("quick_setup")
        .data(Collections.singletonList(queryVector))
        .topK(3)
        .searchParams(params)
        .build();

SearchResp searchResp = client.search(searchReq);

List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
for (List<SearchResp.SearchResult> results : searchResults) {
    System.out.println("TopK results:");
    for (SearchResp.SearchResult result : results) {
        System.out.println(result);
    }
}

// Output
// TopK results:
// SearchResp.SearchResult(entity={}, score=0.95944905, id=5)
// SearchResp.SearchResult(entity={}, score=0.8689616, id=1)
// SearchResp.SearchResult(entity={}, score=0.866088, id=7)
```

</TabItem>

<TabItem value='java'>

```go
queryVector := []float32{0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592}

resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "quick_setup", // collectionName
    3,               // limit
    []entity.Vector{entity.FloatVector(queryVector)},
).WithConsistencyLevel(entity.ClStrong).
    WithANNSField("vector").
    WithSearchParam("level", "10"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

for _, resultSet := range resultSets {
    fmt.Println("IDs: ", resultSet.IDs.FieldData().GetScalars())
    fmt.Println("Scores: ", resultSet.Scores)
}
```

</TabItem>

<TabItem value='java'>

```javascript
// 4. Single vector search
var query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],

res = await client.search({
    collection_name: "quick_setup",
    data: query_vector,
    limit: 3, // The number of results to return,
    params: {
        // highlight-next-line
        "level": 10 // The precision control
    }
})
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "quick_setup",
    "data": [
        [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],
        [0.19886812562848388, 0.06023560599112088, 0.6976963061752597, 0.2614474506242501, 0.838729485096104]
    ],
    "annsField": "vector",
    "limit": 3,
    "searchParams":{
        "params":{
            "level":10
        }
    }
}'

# {"code":0,"cost":0,"data":[{"distance":1,"id":0},{"distance":0.6290165,"id":1},{"distance":0.5975797,"id":4},{"distance":0.9999999,"id":1},{"distance":0.7408552,"id":7},{"distance":0.6290165,"id":0}],"topks":[3]}
```

</TabItem>
</Tabs>

## Get Recall Rate\{#get-recall-rate}

`level` パラメータを調整する際に `enable_recall_calculation` を `true` に設定することで、異なる `level` 値を使用した検索の精度を評価できます。

<Admonition type="info" icon="📘" title="Notes">

<p><code>enable_recall_calculation</code> パラメータは現在<strong>パブリックプレビュー</strong>中であり、互換性の問題により使用できない場合があります。ご不明な点がございましたら、<a href="https://zilliz.com/contact-sales">Zilliz Cloud サポート</a>までお問い合わせください。</p>

</Admonition>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# 4. Single vector search
query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],

res = client.search(
    collection_name="quick_setup",
    data=[query_vector],
    limit=3, # The number of results to return
    search_params={
        "params": {
            # highlight-next-line
            "level": 10 # The precision control,
            "enable_recall_calculation": True # Ask to return recall rate
        }
    }
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.SearchReq
import io.milvus.v2.service.vector.request.data.FloatVec;
import io.milvus.v2.service.vector.response.SearchResp

FloatVec queryVector = new FloatVec(new float[]{0.3580376395471989f, -0.6023495712049978f, 0.18414012509913835f, -0.26286205330961354f, 0.9029438446296592f});
Map<String, Object> params = new HashMap<>();
params.put("level", 10);
params.put("enable_recall_calculation", true)
SearchReq searchReq = SearchReq.builder()
        .collectionName("quick_setup")
        .data(Collections.singletonList(queryVector))
        .topK(3)
        .searchParams(params)
        .build();

SearchResp searchResp = client.search(searchReq);

List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
for (List<SearchResp.SearchResult> results : searchResults) {
    System.out.println("TopK results:");
    for (SearchResp.SearchResult result : results) {
        System.out.println(result);
    }
}

// Output
// TopK results:
// SearchResp.SearchResult(entity={}, score=0.95944905, id=5)
// SearchResp.SearchResult(entity={}, score=0.8689616, id=1)
// SearchResp.SearchResult(entity={}, score=0.866088, id=7)
```

</TabItem>

<TabItem value='java'>

```go
queryVector := []float32{0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592}

resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "quick_setup", // collectionName
    3,               // limit
    []entity.Vector{entity.FloatVector(queryVector)},
).WithConsistencyLevel(entity.ClStrong).
    WithANNSField("vector").
    WithSearchParam("enable_recall_calculation", "true"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

for _, resultSet := range resultSets {
    fmt.Println("IDs: ", resultSet.IDs.FieldData().GetScalars())
    fmt.Println("Scores: ", resultSet.Scores)
}
```

</TabItem>

<TabItem value='java'>

```javascript
// 4. Single vector search
var query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],

res = await client.search({
    collection_name: "quick_setup",
    data: query_vector,
    limit: 3, // The number of results to return,
    params: {
        // highlight-next-line
        "level": 10 // The precision control
        "enable_recall_calculation": true // Ask to return recall rate
    }
})
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "quick_setup",
    "data": [
        [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592],
        [0.19886812562848388, 0.06023560599112088, 0.6976963061752597, 0.2614474506242501, 0.838729485096104]
    ],
    "annsField": "vector",
    "limit": 3,
    "searchParams":{
        "params":{
            "level":10,
            "enable_recall_calculation": true
        }
    }
}'

# {"code":0,"cost":0,"data":[{"distance":1,"id":0},{"distance":0.6290165,"id":1},{"distance":0.5975797,"id":4},{"distance":0.9999999,"id":1},{"distance":0.7408552,"id":7},{"distance":0.6290165,"id":0}],"topks":[3]}
```

</TabItem>
</Tabs>

## 検索時にタイムゾーンを一時的に設定する\{#temporarily-set-a-timezone-for-a-search}

コレクションに `TIMESTAMPTZ` フィールドがある場合、検索呼び出しで `timezone` パラメータを設定することで、単一の操作に対してデータベースまたはコレクションのデフォルトタイムゾーンを一時的に上書きできます。これにより、操作中の `TIMESTAMPTZ` 値の表示方法と比較方法が制御されます。

`timezone` の値は、有効な [IANA タイムゾーン識別子](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)（例: **Asia/Shanghai**、**America/Chicago**、**UTC**）である必要があります。`TIMESTAMPTZ` フィールドの使用方法の詳細については、[TIMESTAMPTZ フィールド](./use-timestamptz-field) を参照してください。

以下の例は、検索操作でタイムゾーンを一時的に設定する方法を示しています:

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.search(
    collection_name="quick_setup",
    anns_field="vector",
    data=[query_vector],
    limit=3,
    search_params={"metric_type": "IP"},
    # highlight-next-line
    timezone="America/Havana",
)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// js
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
export QUERY_VECTOR='[0.1, 0.2, 0.3, 0.4]'                                                                                                                                                                                                              
                                                                                                                                                                                                                                                          
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/entities/search" \                                                                                                                                                                                     
-H "Content-Type: application/json" \                                                                                                                                                                                                                 
-d '{                                                                                                                                                                                                                                                 
  "collectionName": "quick_setup",                                                                                                                                                                                                                    
  "annsField": "vector",                                                                                                                                                                                                                              
  "data": ['"$QUERY_VECTOR"'],                                                                                                                                                                                                                        
  "limit": 3,                                                                                                                                                                                                                                         
  "searchParams": {                                                                                                                                                                                                                                   
    "metric_type": "IP",                                                                                                                                                                                                                              
    "timezone": "America/Havana"                                                                                                                                                                                                                      
  }                                                                                                                                                                                                                                                   
}'
```

</TabItem>
</Tabs>

## ANN 検索の強化\{#enhancing-ann-search}

AUTOINDEX は ANN 検索の学習曲線を大幅に平坦化します。ただし、top-K が増加すると、検索結果が常に正しいとは限りません。Zilliz Cloud は、検索範囲の縮小、検索結果の関連性向上、検索結果の多様化により、以下の検索強化機能を実現しています。

- フィルタリング検索

    検索リクエストにフィルタリング条件を含めることで、Zilliz Cloud は ANN 検索を実行する前にメタデータフィルタリングを行い、検索範囲をコレクション全体から、指定されたフィルタリング条件に一致するエンティティのみに縮小できます。

    メタデータフィルタリングとフィルタリング条件の詳細については、[フィルタリング検索](./filtered-search) および [フィルタリング](./filtering) を参照してください。

- 範囲検索

    返されるエンティティの距離またはスコアを特定の範囲内に制限することで、検索結果の関連性を向上できます。Zilliz Cloud における範囲検索では、クエリベクトルに最も類似したベクトル埋め込みを中心として、2 つの同心円を描きます。検索リクエストで両方の円の半径を指定し、Zilliz Cloud は外側の円の内側にあり、内側の円の外側にあるすべてのベクトル埋め込みを返します。

    範囲検索の詳細については、[範囲検索](./range-search) を参照してください。

- グルーピング検索

    返されるエンティティが特定のフィールドで同じ値を持つ場合、検索結果はベクトル空間内のすべてのベクトル埋め込みの分布を表していない可能性があります。検索結果を多様化するには、グルーピング検索の使用を検討してください。

    グルーピング検索の詳細については、[グルーピング検索](./grouping-search) を参照してください。

- ハイブリッド検索

    コレクションには、異なる埋め込みモデルを使用して生成されたベクトル埋め込みを保存するための複数のベクトルフィールドを含めることができます。これにより、ハイブリッド検索を使用してこれらのベクトルフィールドからの検索結果を再ランク付けし、再現率を向上できます。

    ハイブリッド検索の詳細については、[ハイブリッド検索](./hybrid-search) を参照してください。

    コレクションで許可されるベクトルフィールドの数の制限の詳細については、[Zilliz Cloud 制限s](./limits#fields) を参照してください。

- 検索イテレータ

    単一の ANN 検索は最大 16,384 個のエンティティを返します。単一の検索でより多くのエンティティを返す必要がある場合は、検索イテレータの使用を検討してください。

    検索イテレータの詳細については、[検索イテレータ](./with-iterators) を参照してください。

- 全文検索

    全文検索は、テキストデータセット内の特定の用語やフレーズを含むドキュメントを検索し、関連性に基づいて結果をランク付けする機能です。この機能は、正確な用語を見落とす可能性があるセマンティック検索の制限を克服し、最も正確で文脈的に関連性の高い結果を確実に受け取ることができます。さらに、生のテキスト入力を受け付けることでベクトル検索を簡素化し、ベクトル埋め込みを手動で生成する必要なく、テキストデータを自動的にスパース埋め込みに変換します。

    全文検索の詳細については、[全文検索](./full-text-search) を参照してください。

- テキストマッチ

    Zilliz Cloud のキーワードマッチにより、特定の用語に基づいて正確なドキュメント検索が可能になります。この機能は主に、特定の条件を満たすためのフィルタリング検索に使用され、スカラーフィルタリングを組み込むことでクエリ結果を絞り込むことができ、スカラ条件を満たすベクトル内での類似性検索を可能にします。

    キーワードマッチの詳細については、[キーワードマッチ](./text-match) を参照してください。

- パーティションキーの使用

    メタデータフィルタリングに複数のスカラーフィールドを含め、比較的複雑なフィルタリング条件を使用すると、検索効率に影響を与える可能性があります。スカラーフィールドをパーティションキーとして設定し、検索リクエストでパーティションキーを含むフィルタリング条件を使用すると、指定されたパーティションキー値に対応するパーティション内に検索範囲を制限するのに役立ちます。

    パーティションキーの詳細については、[パーティションキーの使用](./use-partition-key) を参照してください。

- mmap の使用

    mmap 設定の詳細については、[mmap の使用](./use-mmap) を参照してください。

