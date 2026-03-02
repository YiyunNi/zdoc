---
title: "エンティティのカウント | Cloud"
slug: /count-entities
sidebar_label: "エンティティのカウント"
beta: FALSE
notebook: FALSE
description: "この記事では、collection内のエンティティをカウントする方法と、エンティティのカウントが実際の数値と異なる可能性がある理由について説明します。 | Cloud"
type: origin
token: OfUIwNWVuimZgFk3gBVc61GnnKW
sidebar_position: 3
keywords: 
  - zilliz
  - ベクターデータベース
  - cloud
  - collection
  - データ
  - upsert
  - update
  - カウント
  - ベクターDB比較
  - openai ベクターDB
  - 自然言語処理データベース
  - 安価なベクターデータベース

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# エンティティをカウントする

この記事では、コレクション内のエンティティをカウントする方法と、エンティティのカウントが実際の数値と異なる可能性がある理由について説明します。

## 概要{#overview}

Zilliz Cloudでは、コレクション内のエンティティをカウントする方法が2つあります。

- **出力フィールドとしてcount(*)を使用してクエリを実行する**

    コレクション内の正確なエンティティ数を取得するには、この方法を使用し、以下のことを確認する必要があります。

    - ターゲットコレクションをロードしていること。

    - クエリリクエストで`consistency_level`を`Strong`に設定していること。

    - `output_field`を`['count(*)']`に設定していること。

    このようなクエリを受け取ると、Zilliz Cloudはクエリノードにリクエストを送信し、すでにメモリにロードされているエンティティをカウントします。

    クエリで複数のパーティション名を指定して、これらのパーティション内の対応するエンティティ数を取得できます。詳細については、[出力フィールドとしてcount(*)を使用してクエリを実行する](./count-entities)を参照してください。

- **get_collection_stats()を使用する**

    上記のメソッドを使用してコレクションの正確なカウントを取得できますが、すべての場所で使用することはお勧めしません。このプロセスは基本的にクエリであり、頻繁な呼び出しはネットワークのジッターを引き起こしたり、ビジネスに関連する検索やクエリに影響を与えたりする可能性があります。

    精度が主な関心事でない場合は、代わりに`get_collection_stats()`と`get_partition_stats()`を使用する必要があります。この呼び出しは推定エンティティ数を提供しますが、実行するためにターゲットコレクションをロードする必要はなく、内部トラッカーが記録したものを報告するだけなので、コストは無視できるほど小さいです。

    参考までに、すべてのデータ操作は非同期であるため、内部トラッカーはエンティティ数をリアルタイムで反映できません。詳細については、[get_collection_stats()を使用する](./count-entities#use-getcollectionstats)を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<p>上記の2つのメソッドはどちらも、同じプライマリキーを持つエンティティを別々のエンティティとしてカウントします。</p>

</Admonition>

プログラムでエンティティ数を取得する代わりに、Zilliz Cloudコンソールでクラスター、コレクション、またはパーティションの数値にアクセスすることもできます。詳細については、[Zilliz Cloudコンソールでのエンティティ数](./count-entities)を参照してください。

## 出力フィールドとして`count(*)`を使用してクエリを実行する{#query-with-count-as-the-output-field}

正確なエンティティ数を取得するには、コレクションをロードし、`count(*)`を出力フィールドとしてクエリを実行し、クエリの整合性レベルを`Strong`に設定します。

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

<TabItem value='go'>

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

<TabItem value='javascript'>

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

<TabItem value='bash'>

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

## `get_collection_stats()` の使用方法 {#use-getcollectionstats}

上記で説明したように、`get_collection_stats()` はコレクション内のエンティティの推定数を返します。これは実際のエンティティ数とは異なる場合があります。コレクションをロードせずに、これを参照として使用できます。

以下の例では、`test_collection` という名前のコレクションが存在することを前提としています。

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

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='javascript'>

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

<TabItem value='bash'>

```bash
# curl
```

</TabItem>
</Tabs>

## Zilliz Cloud コンソールでのエンティティ数{#entity-counts-on-the-zilliz-cloud-console}

プログラムでエンティティをカウントする代わりに、Zilliz Cloud コンソールにアクセスして、以下のページでクラスター、コレクション、またはパーティションのエンティティ数を確認することもできます。

### メトリクス{#metrics}

クラスターの**メトリクス**タブで、**エンティティ数**と**ロードされたエンティティ (概算)** を確認できます。どちらの値も推定値です。曲線内の値は、[`get_collection_stats()`](./count-entities#use-getcollectionstats) を[使用して取得されます](./count-entities#use-getcollectionstats)。それ以上のデータ挿入や削除がない場合、**エンティティ数**曲線は最終的に現在のコレクション内の実際のエンティティ数を反映します。

![UGT3bXxnjordXpxhTZUcMYK6nQg](https://zdoc-images.s3.us-west-2.amazonaws.com/ugt3bxxnjordxpxhtzucmyk6nqg.png "UGT3bXxnjordXpxhTZUcMYK6nQg")

### コレクションの詳細{#collection-details}

コレクションの実際のエンティティ数は、その詳細タブで確認できます。この値は、出力フィールドとして[`count(*)`](./count-entities) を[使用したクエリ](./count-entities)によって取得されます。

![L8ImbqFLIonMTxx47WBcF5IbnTf](https://zdoc-images.s3.us-west-2.amazonaws.com/l8imbqflionmtxx47wbcf5ibntf.png "L8ImbqFLIonMTxx47WBcF5IbnTf")

### パーティション{#partitions}

コレクションの**パーティション**タブを使用して、子パーティションにロードされたエンティティの推定数を見つけることもできます。この値は `get_partition_stats()` を使用して取得されます。

![Y4Etb0AITotVQNxvzs4cZCHsn9d](https://zdoc-images.s3.us-west-2.amazonaws.com/y4etb0aitotvqnxvzs4czchsn9d.png "Y4Etb0AITotVQNxvzs4cZCHsn9d")

## よくある質問{#faqs}

- **get_collection_stats() または get_partition_stats() を使用して取得したエンティティ数が、エンティティを挿入した後もターゲットコレクションまたはパーティション内の実際のエンティティ数を反映しないのはなぜですか？**

    これらのメソッドは、内部トラッカーが記録したものを報告するだけであり、すべてのデータ操作は非同期であるため、実際のエンティティ数とは異なる場合があります。

- **エンティティを挿入または削除した後も、コレクションのメトリクスタブのエンティティ数曲線が変化しないのはなぜですか？**

    **エンティティ数**曲線内の値は、特定の時点での推定値です。すべてのデータ操作は非同期であるため、曲線に反映されるまでに遅延が生じる場合があります。

- **エンティティを挿入または削除した後も、コレクションのパーティションタブのエンティティ数 (概算) 列に表示される値が変化しないのはなぜですか？**

    リストされたパーティションに表示される値はすべて推定値です。すべてのデータ操作は非同期であるため、曲線に反映されるまでに遅延が生じる場合があります。

- **コレクションの概要タブに表示されるロードされたエンティティの値が、コレクション内の実際のエンティティ数を反映しないのはなぜですか？**

    **ロードされたエンティティ**に表示される値は正確です。この値と通常のクエリから取得されるエンティティ数との間にギャップがある場合、コレクション内の一部のエンティティが同一のプライマリキーを持っている可能性があります。

    出力フィールドとして `count(*)` を持つクエリは、同一のプライマリキーを持つエンティティを個別のエンティティとして扱いますが、他のクエリは最終結果を返す前に同一のプライマリキーを持つエンティティを省略することに注意してください。

