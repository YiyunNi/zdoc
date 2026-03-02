---
title: "範囲検索 | Cloud"
slug: /range-search
sidebar_label: "範囲検索"
beta: FALSE
notebook: FALSE
description: "範囲検索は、返されるエンティティの距離またはスコアを特定の範囲内に制限することで、検索結果の関連性を向上させます。このページでは、範囲検索とは何か、および範囲検索を実行する手順について説明します。 | Cloud"
type: origin
token: GnvtwMeQWi8iRCk7dGccCBQZnOh
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - データ
  - 範囲検索
  - 類似性検索
  - マルチモーダルRAG
  - LLMの幻覚
  - ハイブリッド検索

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# レンジ検索

レンジ検索は、返されるエンティティの距離またはスコアを特定の範囲内に制限することで、検索結果の関連性を向上させます。このページでは、レンジ検索とは何か、およびレンジ検索を実行する手順について説明します。

## 概要{#overview}

レンジ検索リクエストを実行すると、Zilliz CloudはANN検索結果からクエリベクトルに最も類似したベクトルを中心として使用し、検索リクエストで指定された**radius**を外円の半径として、**range_filter**を内円の半径として2つの同心円を描画します。これら2つの同心円によって形成される環状領域内に類似度スコアが収まるすべてのベクトルが返されます。ここで、**range_filter**は**0**に設定でき、これは指定された類似度スコア（radius）内のすべてのエンティティが返されることを示します。

![Sewjwp5DShFgKAbC1Mwcrr7enOD](https://zdoc-images.s3.us-west-2.amazonaws.com/Sewjwp5DShFgKAbC1Mwcrr7enOD.png)

上記の図は、レンジ検索リクエストが**radius**と**range_filter**の2つのパラメータを持つことを示しています。レンジ検索リクエストを受信すると、Zilliz Cloudは次のことを行います。

- 指定されたメトリックタイプ（**COSINE**）を使用して、クエリベクトルに最も類似したすべてのベクトル埋め込みを検索します。

- クエリベクトルに対する**距離**または**スコア**が**radius**と**range_filter**パラメータで指定された範囲内に収まるベクトル埋め込みをフィルタリングします。

- フィルタリングされたエンティティの中から**top-K**個のエンティティを返します。

**radius**と**range_filter**の設定方法は、検索のメトリックタイプによって異なります。次の表は、異なるメトリックタイプでこれら2つのパラメータを設定するための要件を示しています。

<table>
   <tr>
     <th><p>メトリックタイプ</p></th>
     <th><p>表記</p></th>
     <th><p>radiusとrange_filterの設定要件</p></th>
   </tr>
   <tr>
     <td><p><code>L2</code></p></td>
     <td><p>L2距離が小さいほど類似度が高いことを示します。</p></td>
     <td><p>最も類似したベクトル埋め込みを無視するには、</p><p><code>range_filter</code> &lt;= 距離 &lt; <code>radius</code></p><p>であることを確認してください。</p></td>
   </tr>
   <tr>
     <td><p><code>IP</code></p></td>
     <td><p>IP距離が大きいほど類似度が高いことを示します。</p></td>
     <td><p>最も類似したベクトル埋め込みを無視するには、</p><p><code>radius</code> &lt; 距離 &lt;= <code>range_filter</code></p><p>であることを確認してください。</p></td>
   </tr>
   <tr>
     <td><p><code>COSINE</code></p></td>
     <td><p>COSINE距離が大きいほど類似度が高いことを示します。</p></td>
     <td><p>最も類似したベクトル埋め込みを無視するには、</p><p><code>radius</code> &lt; 距離 &lt;= <code>range_filter</code></p><p>であることを確認してください。</p></td>
   </tr>
   <tr>
     <td><p><code>JACCARD</code></p></td>
     <td><p>Jaccard距離が小さいほど類似度が高いことを示します。</p></td>
     <td><p>最も類似したベクトル埋め込みを無視するには、</p><p><code>range_filter</code> &lt;= 距離 &lt; <code>radius</code></p><p>であることを確認してください。</p></td>
   </tr>
   <tr>
     <td><p><code>HAMMING</code></p></td>
     <td><p>Hamming距離が小さいほど類似度が高いことを示します。</p></td>
     <td><p>最も類似したベクトル埋め込みを無視するには、</p><p><code>range_filter</code> &lt;= 距離 &lt; <code>radius</code></p><p>であることを確認してください。</p></td>
   </tr>
</table>

## 例{#examples}

このセクションでは、レンジ検索を実行する方法を示します。以下のコードスニペットの検索リクエストにはメトリックタイプが含まれていませんが、これはデフォルトのメトリックタイプ**COSINE**が適用されることを示しています。この場合、**radius**の値が**range_filter**の値よりも小さいことを確認してください。

以下のコードスニペットでは、`radius`を`0.4`に、`range_filter`を`0.6`に設定し、Zilliz Cloudがクエリベクトルに対する距離またはスコアが**0.4**から**0.6**の範囲内にあるすべてのエンティティを返すようにします。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]

res = client.search(
    collection_name="my_collection",
    data=[query_vector],
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

for hits in res:
    print("TopK results:")
    for hit in hits:
        print(hit)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
 io.milvus.v2.service.vector.request.SearchReq
import io.milvus.v2.service.vector.request.data.FloatVec;
import io.milvus.v2.service.vector.response.SearchResp

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .token("YOUR_CLUSTER_TOKEN")
        .build());

FloatVec queryVector = new FloatVec(new float[]{0.3580376395471989f, -0.6023495712049978f, 0.18414012509913835f, -0.26286205330961354f, 0.9029438446296592f});
Map<String,Object> extraParams = new HashMap<>();
extraParams.put("radius", 0.4);
extraParams.put("range_filter", 0.6);
SearchReq searchReq = SearchReq.builder()
        .collectionName("my_collection")
        .data(Collections.singletonList(queryVector))
        .topK(5)
        .searchParams(extraParams)
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
// SearchResp.SearchResult(entity={}, score=0.5975797, id=4)
// SearchResp.SearchResult(entity={}, score=0.46704385, id=5)
```

</TabItem>

<TabItem value='go'>

```go
import (
    "context"
    "fmt"
    
    "github.com/milvus-io/milvus/client/v2/index"
    "github.com/milvus-io/milvus/client/v2/entity"
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

queryVector := []float32{0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592}

annParam := index.NewCustomAnnParam()
annParam.WithRadius(0.4)
annParam.WithRangeFilter(0.6)
resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "my_collection", // collectionName
    5,               // limit
    []entity.Vector{entity.FloatVector(queryVector)},
).WithConsistencyLevel(entity.ClStrong).
    WithANNSField("vector").
    WithAnnParam(annParam))
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

<TabItem value='javascript'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const address = "YOUR_CLUSTER_ENDPOINT";
const token = "YOUR_CLUSTER_TOKEN";
const client = new MilvusClient({address, token});

var query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]

res = await client.search({
    collection_name: "my_collection",
    data: [query_vector],
    limit: 5,
    // highlight-start
    params: {
        "radius": 0.4,
        "range_filter": 0.6
    }
    // highlight-end
})
```

</TabItem>

<TabItem value='bash'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "data": [
        [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]
    ],
    "annsField": "vector",
    "limit": 5,
    "searchParams": {
        "params": {
            "radius": 0.4,
            "range_filter": 0.6
        }
    }
}'
# {"code":0,"cost":0,"data":[]}
```

</TabItem>
</Tabs>

