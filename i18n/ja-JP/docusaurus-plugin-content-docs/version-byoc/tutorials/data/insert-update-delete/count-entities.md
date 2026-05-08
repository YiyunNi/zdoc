---
title: "エンティティのカウント | BYOC"
slug: /count-entities
sidebar_key: count-entities
sidebar_label: "カウント"
beta: FALSE
notebook: FALSE
description: "この記事では、コレクション内のエンティティをカウントする方法を説明し、エンティティ数が実際の数値と異なる理由を解説します。 | BYOC"
type: origin
token: OfUIwNWVuimZgFk3gBVc61GnnKW
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - データ
  - upsert
  - update
  - カウント

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# エンティティのカウント

この記事では、コレクション内のエンティティをカウントする方法を説明し、エンティティ数が実際の数値と異なる理由を解説します。

## 概要\{#overview}

Zilliz Cloud では、コレクション内のエンティティをカウントする方法が 2 つ提供されています。

- **count(&ast;) を出力フィールドとして使用したクエリ**

    コレクション内の正確なエンティティ数を取得するには、この方法を使用し、以下を確実に行ってください。

    - 対象のコレクションをロードしていること。

    - クエリリクエストで `consistency_level` を `Strong` に設定していること。

    - `output_field` を `['count(*)']` に設定していること。

    このようなクエリを受信すると、Zilliz Cloud はクエリノードにリクエストを送信し、メモリに既にロードされているエンティティをカウントします。

    クエリで複数のパーティション名を指定して、これらのパーティション内の対応するエンティティ数を取得することもできます。詳細については、[count(*) を出力フィールドとして使用したクエリ](./count-entities) を参照してください。

- **get_collection_stats() の使用**

    上記の方法を使用してコレクションの正確なカウントを取得できますが、あらゆる場面で使用することは推奨されません。この処理は基本的にクエリであり、頻繁な呼び出しはネットワークのジッターを引き起こしたり、ビジネスに関連する検索やクエリに影響を与えたりする可能性があります。

    精度が主要な懸念事項でない場合は、代わりに `get_collection_stats()` および `get_partition_stats()` を使用してください。この呼び出しは推定エンティティ数を提供しますが、対象のコレクションをロードする必要がなく、内部トラッカーが記録している内容を報告するだけなので、コストは無視できるほど小さいです。

    参考までに、すべてのデータ操作は非同期であるため、内部トラッカーはエンティティ数をリアルタイムで反映できません。詳細については、[get_collection_stats() の使用](./count-entities#use-getcollectionstats) を参照してください。

<Admonition type="info" icon="📘" title="Notes">

上記の両方の方法では、同じプライマリキーを持つエンティティを別々のエンティティとしてカウントします。

</Admonition>

プログラムでエンティティ数を取得する代わりに、Zilliz Cloud コンソールでクラスター、コレクション、またはパーティションの数値にアクセスすることもできます。詳細については、[Zilliz Cloud コンソールでのエンティティ数](./count-entities) を参照してください。

## `count(*)` を出力フィールドとして使用したクエリ\{#query-with-count-as-the-output-field}

正確なエンティティ数を取得するには、コレクションをロードし、`count(*)` を出力フィールドとしてクエリを実行し、クエリの一貫性レベルを `Strong` に設定します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Count without the entities in growing segments
res = client.query(
    collection_name="test_collection",
    # highlight-next-line
    output_fields=['count(*)']
)

# Count with the entities in growing segments
res = client.query(
    collection_name="test_collection",
    # highlight-start
    output_fields=['count(*)'],
    consistency_level="Strong"
    # highlight-end
)

# Count the entities in a specific partition
res = client.query(
    collection_name="test_collection",
    # highlight-start
    output_fields=['count(*)'],
    partition_names=['_default']
    # highlight-end
)

# Get the entity count
print(res[0]['count(*)'])
# Output
# 20
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.QueryReq
import io.milvus.v2.service.vector.request.QueryResp

// Count without the entities in growing segments
QueryResp count = client.query(QueryReq.builder()
        .collectionName("test_collection")
        .filter("")
        // highlight-next-line
        .outputFields(Collections.singletonList("count(*)"))
        .build());

// Count with the entities in growing segments
count = client.query(QueryReq.builder()
        .collectionName("test_collection")
        .filter("")
        // highlight-start
        .outputFields(Collections.singletonList("count(*)"))
        .consistencyLevel(ConsistencyLevel.STRONG)
        // highlight-end
        .build());

// Count the entities in a specific partition
countR = client.query(QueryReq.builder()
        .collectionName("test_collection")
        .filter("")
        // highlight-start
        .outputFields(Collections.singletonList("count(*)"))
        .partitionNames(Collections.singletonList("_default"))
        // highlight-end
        .build());

System.out.print(count.getQueryResults().get(0).getEntity().get("count(*)"));

// Output
// 20
```

</TabItem>

<TabItem value='java'>

```go
resultSet, err := client.Query(ctx, milvusclient.NewQueryOption("test_collection").
    WithFilter("").
    WithOutputFields("count(*)").
    WithConsistencyLevel(entity.ClStrong))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

fmt.Println("count: ", resultSet.GetColumn("count").FieldData().GetScalars())

```

</TabItem>

<TabItem value='java'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const address = "YOUR_CLUSTER_ENDPOINT";
const token = "YOUR_CLUSTER_TOKEN";
const client = new MilvusClient({address, token});

// Count with the entities in growing segments
let res = await client.query({
    collection_name: "test_collection",
    output_fields: ["count(*)"],
    consistency_level: 'Strong'
});

// Count the entities in a specific partition
res = await client.query({
    collection_name: "test_collection",
    output_fields: ["count(*)"],
    partition_names: ['_default']
});

// Get the entity count
console.log(res.data[0]['count(*)'])
// Output
// 20

```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/query" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "test_collection",
    "filter": "",
    "outputFields": ["count(*)"]
}'
#{"code":0,"cost":0,"data":[{count: 20}]}
```

</TabItem>
</Tabs>

## `get_collection_stats()` の使用\{#use-getcollectionstats}

前述のとおり、`get_collection_stats()` はコレクション内のエンティティ数の推定値を返します。この値は実際のエンティティ数と異なる場合があります。このメソッドはコレクションをロードせずに参照として使用できます。

以下の例では、`test_collection` という名前のコレクションがすでに存在しているものと仮定しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

# 1. Set up a milvus client
client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# 2. Get the entity count of a collection
client.get_collection_stats(collection_name="test_collection") 

# Output
# 
# {
#     'row_count': 1000
# }

# 3. Get the entity count of a partition
client.get_partition_stats(
    collection_name="test_collection",
    partition_name="_default"
) 

# Output
# 
# {
#     'row_count': 1000
# }
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.collection.request.GetCollectionStatsReq;
import io.milvus.v2.service.collection.response.GetCollectionStatsResp;
import io.milvus.v2.service.partition.request.GetPartitionStatsReq;
import io.milvus.v2.service.partition.response.GetPartitionStatsResp;

// 1. Set up a milvus client
MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .token("YOUR_CLUSTER_TOKEN")
        .build());

// 2. Get the entity count of a collection
GetCollectionStatsResp stats = client.getCollectionStats(GetCollectionStatsReq.builder()
        .collectionName("test_collection")
        .build());
System.out.print(stats.getNumOfEntities());

// 3. Get the entity count of a partition
GetPartitionStatsResp partitionStats = client.getPartitionStats(GetPartitionStatsReq.builder()
        .collectionName("test_collection")
        .partitionName("_default")
        .build());
System.out.print(partitionStats.getNumOfEntities());
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```javascript
import { MilvusClient } from '@zilliz/milvus2-sdk-node';

// 1. Set up a milvus client
const milvusClient = new MilvusClient({
    address: 'YOUR_CLUSTER_ENDPOINT',
    token: 'YOUR_CLUSTER_TOKEN'
});

// 2. Get the entity count
milvusClient.getCollectionStats({
 collection_name: 'test_collection',
 partition_name: '_default'
});

// Output
//
// {
//      data: {'row_count': 1000 }
// }
```

</TabItem>

<TabItem value='java'>

```bash
# curl
```

</TabItem>
</Tabs>

## Zilliz Cloud コンソールでのエンティティ数\{#entity-counts-on-the-zilliz-cloud-console}

プログラムでエンティティをカウントする代わりに、Zilliz Cloud コンソールにアクセスして、クラスター、コレクション、またはパーティションのエンティティ数を以下のページで確認することもできます。

### メトリクス\{#metrics}

クラスターの **メトリクス** タブで、**エンティティ数** と **ロードされたエンティティ（概算）** を確認できます。両方の値は推定値です。グラフの値は [get_collection_stats()](./count-entities#use-getcollectionstats) [を使用して](./count-entities#use-getcollectionstats)取得されます。これ以上のデータの挿入や削除がない場合、**エンティティ数** のグラフは最終的に現在のコレクション内の実際のエンティティ数を反映します。

![ZVYcwdlqAhOUqDb4vC3c2Hf8n5e](https://zdoc-images.s3.us-west-2.amazonaws.com/ZVYcwdlqAhOUqDb4vC3c2Hf8n5e.png)

### コレクション詳細\{#collection-details}

コレクションの詳細タブで、コレクションの実際のエンティティ数を確認できます。この値は、[count(*)](./count-entities) [を出力フィールドとして使用したクエリ](./count-entities) [で](./count-entities)取得されます。

![PfXfwGQoLhW0OBbVMMfccM0Qnaf](https://zdoc-images.s3.us-west-2.amazonaws.com/PfXfwGQoLhW0OBbVMMfccM0Qnaf.png)

### パーティション\{#partitions}

コレクションの **パーティション** タブを使用して、子パーティション内のロードされたエンティティの推定数を確認することもできます。この値は `get_partition_stats()` を使用して取得されます。

![LKThwnS2fhTj8vbFJpEcjAMunwf](https://zdoc-images.s3.us-west-2.amazonaws.com/LKThwnS2fhTj8vbFJpEcjAMunwf.png)

## よくある質問\{#faqs}

- **エンティティを挿入した後、get_collection_stats() または get_partition_stats() を使用して取得したエンティティ数が、対象のコレクションまたはパーティション内の実際のエンティティ数を反映していないのはなぜですか？**

    これらのメソッドは、内部トラッカーが記録している内容のみを報告するため、すべてのデータ操作が非同期であるため、実際のエンティティ数と異なる場合があります。

- **エンティティを挿入または削除した後、コレクションのメトリクス タブのエンティティ数グラフが変化しないのはなぜですか？**

    **エンティティ数** グラフの値は、特定の時点で推定されます。すべてのデータ操作が非同期であるため、グラフに反映されるまでに遅延が生じる場合があります。

- **エンティティを挿入または削除した後、コレクションのパーティション タブのエンティティ数（概算）列に表示される値が変化しないのはなぜですか？**

    一覧表示されたパーティションの値はすべて推定値です。すべてのデータ操作が非同期であるため、グラフに反映されるまでに遅延が生じる場合があります。

- **コレクションの概要タブのロードされたエンティティに表示される値が、コレクション内の実際のエンティティ数を反映していないのはなぜですか？**

    **ロードされたエンティティ** に表示される値は正確です。この値と通常のクエリから取得したエンティティ数に差がある場合、コレクション内の一部のエンティティが同一の主キーを持っている可能性があります。

    `count(*)` を出力フィールドとするクエリは、同一の主キーを持つエンティティを別々のエンティティとして扱いますが、他のクエリは同じ主キーを持つエンティティを省略してから最終結果を返します。

