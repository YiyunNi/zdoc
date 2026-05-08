---
title: "プライマリキー検索 | Cloud"
slug: /primary-key-search
sidebar_key: primary-key-search
sidebar_label: "プライマリキー検索"
beta: FALSE
notebook: FALSE
description: "類似性検索を行う際、クエリベクトルが対象のコレクションに既に存在する場合でも、常に1つ以上のクエリベクトルを指定する必要があります。検索前にベクトルを取得するのを避けるため、代わりにプライマリキーを使用できます。"
type: origin
token: U7OvwHP3AiUWlckzIEKclLQQnPr
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - data
  - グループ化検索
  - primary key
  - primary key search

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 主キー検索

類似度検索を実行する際、クエリベクトルがターゲットコレクションに既に存在する場合でも、常に1つ以上のクエリベクトルを提供する必要があります。検索前にベクトルを取得することを避けるため、代わりに主キーを使用できます。

## 概要\{#overview}

ECプラットフォームでは、ユーザーがキーワードを入力して一致する商品を検索できます。ユーザーが商品詳細ページを閲覧すると、プラットフォームはページ下部に類似商品の一覧も表示し、比較を希望するユーザーに提供します。

推奨商品は、キーワードまたは現在の商品との類似度順に並べられます。これを実現するため、プラットフォーム開発者は実際の類似度検索の前に、Milvusからキーワードまたは現在の商品のベクトル表現を取得する必要があり、これによりプラットフォームとMilvus間の往復が増加し、ネットワークを介して大量の高次元浮動小数点値が送信されることになります。

アプリケーションとMilvus間のインタラクションロジックを簡素化し、往復回数を削減し、ネットワークを介した大量の高次元浮動小数点値の送信を避けるため、主キー検索の使用を検討してください。

主キー検索では、クエリベクトルを提供する必要はありません。代わりに、クエリベクトルを含むエンティティの主キー（`ids`）を提供する必要があります。

## 制限と制約\{#limits-and-restrictions}

- 主キーを使用した検索は、すべてのベクトルデータ型に適用されますが、BM25関数のようにVarCharフィールドから派生したスパースベクトルフィールドは除きます。

- フィルタリング検索、範囲検索、グループ化検索において、オプションでページネーションを有効にしながら、主キーをクエリベクトルの代わりに使用できます。ただし、この機能はハイブリッド検索や検索イテレータには適用されません。

- 埋め込みリストを含む類似度検索の場合、クエリベクトルを取得し、それらを埋め込みリストに配置してから検索を実行する必要があります。

- 存在しない主キー、または形式が正しくない主キーについては、Milvusがエラーを返します。

- 主キーとクエリベクトルは相互に排他的です。両方を提供した場合もエラーになります。

## 例\{#examples}

以下の例では、提供されたすべてのInt64 IDがターゲットコレクションで利用可能であることを前提としています。

<Admonition type="info" icon="📘" title="Notes">

主キーはフィルタリングには使用されず、ベクトル取得のみに使用されます。

</Admonition>

### 例1: 基本的な主キー検索\{#example-1-basic-primary-key-search}

基本的な主キー検索を実行するには、クエリベクトルを主キーに置き換えるだけです。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

res = client.search(
    collection_name="my_collection",
    anns_field="vector",
    # highlight-start
    ids=[551, 296, 43], # a list of primary keys
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
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.vector.request.SearchReq
import io.milvus.v2.service.vector.response.SearchResp

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .token("YOUR_CLUSTER_TOKEN")
        .build());
        
List<Object> ids = Arrays.asList(551L, 296L, 43L);
SearchResp searchResp = client.search(SearchReq.builder()
        .collectionName("my_collection")
        .annsField("vector")
        .ids(ids)
        .limit(3)
        .metricType(IndexParam.MetricType.IP)
        .build());
List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
for (List<SearchResp.SearchResult> results : searchResults) {
    System.out.println("TopK results:");
    for (SearchResp.SearchResult result : results) {
        System.out.println(result);
    }
}
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
    "collectionName": "my_collection",
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

### 例2: 主キーを使用したフィルター検索\{#example-2-filtered-search-using-primary-keys}

以下の例では、`color` および `likes` が対象コレクション内でスキーマ定義された2つのフィールドであることを前提としています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.search(
    collection_name="my_collection",
    # highlight-start
    ids=[551, 296, 43], #
    filter='color like "red%" and likes > 50',
    output_fields=["color", "likes"],
    # highlight-end
    limit=3,
)
```

</TabItem>

<TabItem value='java'>

```java
List<Object> ids = Arrays.asList(551L, 296L, 43L);
SearchResp searchResp = client.search(SearchReq.builder()
        .collectionName("my_collection")
        .ids(ids)
        .filter("color like \"red%\" and likes > 50")
        .limit(3)
        .outputFields(Arrays.asList("color", "likes"))
        .build());
List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
for (List<SearchResp.SearchResult> results : searchResults) {
    System.out.println("TopK results:");
    for (SearchResp.SearchResult result : results) {
        System.out.println(result);
    }
}
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
    "collectionName": "my_collection",
    "annsField": "vector",
    "ids": [551, 296, 43],
    "filter": "color like \"red%\" and likes > 50",
    "outputFields": ["color", "likes"],
    "limit": 3
  }'
```

</TabItem>
</Tabs>

### 例3: 主キーを使用した範囲検索\{#example-3-range-search-using-primary-keys}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.search(
    collection_name="my_collection",
    # highlight-start
    ids=[551, 296, 43],
    # highlight-end
    limit=3,
    search_params={
        # highlight-start
        "params": {
            "radius": 0.4,
            "range_filter": 0.6
        }
        # highlight-end
    }
)
```

</TabItem>

<TabItem value='java'>

```java
ap<String, Object> params = new HashMap<>();
params.put("radius", "0.4");
params.put("range_filter", "0.6");

List<Object> ids = Arrays.asList(551L, 296L, 43L);
SearchResp searchResp = client.search(SearchReq.builder()
        .collectionName("my_collection")
        .ids(ids)
        .limit(3)
        .searchParams(params)
        .build());
List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
for (List<SearchResp.SearchResult> results : searchResults) {
    System.out.println("TopK results:");
    for (SearchResp.SearchResult result : results) {
        System.out.println(result);
    }
}
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
    "collectionName": "my_collection",
    "annsField": "vector",
    "ids": [551, 296, 43],
    "limit": 3,
    "searchParams": {
      "params": {
        "radius": 0.4,
        "range_filter": 0.6
      }
    }
  }'
```

</TabItem>
</Tabs>

### 例4: 主キーを使用したグループ化検索\{#example-4-grouping-search-using-primary-keys}

以下の例では、`docId` が対象コレクションのスキーマで定義されたフィールドであることを前提としています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.search(
    collection_name="my_collection",
    # highlight-start
    ids=[551, 296, 43],
    # highlight-end
    limit=3,
    group_by_field="docId",
    output_fields=["docId"]
)
```

</TabItem>

<TabItem value='java'>

```java
List<Object> ids = Arrays.asList(551L, 296L, 43L);
SearchResp searchResp = client.search(SearchReq.builder()
        .collectionName("my_collection")
        .ids(ids)
        .limit(3)
        .groupByFieldName("docId")
        .outputFields(Collections.singletonList("docId"))
        .build());
List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
for (List<SearchResp.SearchResult> results : searchResults) {
    System.out.println("TopK results:");
    for (SearchResp.SearchResult result : results) {
        System.out.println(result);
    }
}
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
    "collectionName": "my_collection",
    "annsField": "vector",
    "ids": [551, 296, 43],
    "limit": 3,
    "groupingField": "docId",
    "outputFields": ["docId"]
  }'
```

</TabItem>
</Tabs>

