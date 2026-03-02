---
title: "パーティションの管理 | BYOC"
slug: /manage-partitions
sidebar_label: "パーティションの管理"
beta: FALSE
notebook: FALSE
description: "パーティションはcollectionのサブセットです。各パーティションは親collectionと同じデータ構造を共有しますが、collection内のデータの一部のみを含みます。このページでは、パーティションの管理方法について説明します。 | BYOC"
type: origin
token: JCMPwIyVciCT4Hk4O20c96MEnch
sidebar_position: 8
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - partition
  - パーティション
  - マルチモーダルベクトルデータベース検索
  - Retrieval Augmented Generation
  - 大規模言語モデル
  - ベクトル化

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# パーティションの管理

パーティションはコレクションのサブセットです。各パーティションは親コレクションと同じデータ構造を共有しますが、コレクション内のデータの一部のみを含みます。このページでは、パーティションの管理方法について説明します。

## 概要{#overview}

コレクションを作成すると、Zilliz Cloud はコレクション内に **_default** という名前のパーティションも作成します。他のパーティションを追加しない場合、コレクションに挿入されるすべてのエンティティはデフォルトパーティションに入り、すべての検索とクエリもデフォルトパーティション内で実行されます。

より多くのパーティションを追加し、特定の基準に基づいてエンティティをそれらに挿入できます。これにより、検索とクエリを特定のパーティション内に制限し、検索パフォーマンスを向上させることができます。

1つのコレクションは最大1,024個のパーティションを持つことができます。

<Admonition type="info" icon="📘" title="Notes">

<p><strong>パーティションキー</strong>機能は、パーティションに基づく検索最適化であり、Zilliz Cloud が特定のスカラフィールドの値に基づいてエンティティを異なるパーティションに分散することを可能にします。この機能は、パーティション指向のマルチテナンシーを実装し、検索パフォーマンスを向上させるのに役立ちます。</p>
<p>この機能については、このページでは説明しません。詳細については、<a href="./use-partition-key">パーティションキーの使用</a>を参照してください。</p>

</Admonition>

## パーティションのリスト表示{#list-partitions}

コレクションを作成すると、Zilliz Cloud はコレクション内に **_default** という名前のパーティションも作成します。コレクション内のパーティションは次のようにリスト表示できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

res = client.list_partitions(
    collection_name="my_collection"
)

print(res)

# Output
#
# ["_default"]
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.partition.request.ListPartitionsReq;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;

import java.util.*;

String CLUSTER_ENDPOINT = "YOUR_CLUSTER_ENDPOINT";
String TOKEN = "YOUR_CLUSTER_TOKEN";

// 1. Connect to Milvus server
ConnectConfig connectConfig = ConnectConfig.builder()
        .uri(CLUSTER_ENDPOINT)
        .token(TOKEN)
        .build();

MilvusClientV2 client = new MilvusClientV2(connectConfig);

ListPartitionsReq listPartitionsReq = ListPartitionsReq.builder()
        .collectionName("my_collection")
        .build();

List<String> partitionNames = client.listPartitions(listPartitionsReq);
System.out.println(partitionNames);

// Output:
// [_default]
```

</TabItem>

<TabItem value='javascript'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const address = "YOUR_CLUSTER_ENDPOINT";
const token = "YOUR_CLUSTER_TOKEN";
const client = new MilvusClient({address, token});

let res = await client.listPartitions({
    collection_name: "my_collection"
})

console.log(res);

// Output
// ["_default"]
```

</TabItem>

<TabItem value='go'>

```go
import (
    "context"
    
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

partitionNames, err := client.ListPartitions(ctx, milvusclient.NewListPartitionOption("my_collection"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

fmt.Println(partitionNames)
```

</TabItem>

<TabItem value='bash'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/partitions/list" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection"
}'

# {
#     "code": 0,
#     "data": [
#         "_default"
#     ]
# }
```

</TabItem>
</Tabs>

## パーティションの作成{#create-partition}

コレクションにパーティションを追加し、特定の基準に基づいてこれらのパーティションにエンティティを挿入できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.create_partition(
    collection_name="my_collection",
    partition_name="partitionA"
)

res = client.list_partitions(
    collection_name="my_collection"
)

print(res)

# Output
#
# ["_default", "partitionA"]
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.partition.request.CreatePartitionReq;

CreatePartitionReq createPartitionReq = CreatePartitionReq.builder()
        .collectionName("my_collection")
        .partitionName("partitionA")
        .build();

client.createPartition(createPartitionReq);

ListPartitionsReq listPartitionsReq = ListPartitionsReq.builder()
        .collectionName("my_collection")
        .build();

List<String> partitionNames = client.listPartitions(listPartitionsReq);
System.out.println(partitionNames);

// Output:
// [_default, partitionA]
```

</TabItem>

<TabItem value='javascript'>

```javascript
await client.createPartition({
    collection_name: "my_collection",
    partition_name: "partitionA"
})

res = await client.listPartitions({
    collection_name: "my_collection"
})

console.log(res)

// Output
// ["_default", "partitionA"]
```

</TabItem>

<TabItem value='go'>

```go
import (
    "fmt"
    
    client "github.com/milvus-io/milvus/client/v2/milvusclient"
)

ctx, cancel := context.WithCancel(context.Background())
defer cancel()

err = client.CreatePartition(ctx, milvusclient.NewCreatePartitionOption("my_collection", "partitionA"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

partitionNames, err := client.ListPartitions(ctx, milvusclient.NewListPartitionOption("my_collection"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

fmt.Println(partitionNames)
// Output
// ["_default", "partitionA"]
```

</TabItem>

<TabItem value='bash'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/partitions/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "partitionName": "partitionA"
}'

# {
#     "code": 0,
#     "data": {}
# }

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/partitions/list" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection"
}'

# {
#     "code": 0,
#     "data": [
#         "_default",
#         "partitionA"
#     ]
# }
```

</TabItem>
</Tabs>

## 特定のパーティションの確認 {#check-for-a-specific-partition}

以下のコードスニペットは、特定のコレクションにパーティションが存在するかどうかを確認する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.has_partition(
    collection_name="my_collection",
    partition_name="partitionA"
)

print(res)

# Output
#
# True
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.partition.request.HasPartitionReq;

HasPartitionReq hasPartitionReq = HasPartitionReq.builder()
        .collectionName("my_collection")
        .partitionName("partitionA")
        .build();

Boolean hasPartitionRes = client.hasPartition(hasPartitionReq);
System.out.println(hasPartitionRes);

// Output:
// true
```

</TabItem>

<TabItem value='javascript'>

```javascript
res = await client.hasPartition({
    collection_name: "my_collection",
    partition_name: "partitionA"
})

console.log(res.value)

// Output
// true
```

</TabItem>

<TabItem value='go'>

```go
result, err := client.HasPartition(ctx, milvusclient.NewHasPartitionOption("my_collection", "partitionA"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

fmt.Println(result)

// Output:
// true
```

</TabItem>

<TabItem value='bash'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/partitions/has" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "partitionName": "partitionA"
}'

# {
#     "code": 0,
#     "data": {
#        "has": true
#     }
# }
```

</TabItem>
</Tabs>

## パーティションのロードとリリース{#load-and-release-partitions}

1つまたは特定のパーティションを個別にロードまたはリリースできます。

### パーティションのロード{#load-partitions}

コレクション内の特定のパーティションを個別にロードできます。コレクション内にアンロードされたパーティションがある場合、コレクションのロード状態はアンロードされたままであることに注意してください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.load_partitions(
    collection_name="my_collection",
    partition_names=["partitionA"]
)

res = client.get_load_state(
    collection_name="my_collection",
    partition_name="partitionA"
)

print(res)
# Output
#
# {
#     "state": "<LoadState: Loaded>"
# }
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.partition.request.LoadPartitionsReq;
import io.milvus.v2.service.collection.request.GetLoadStateReq;

LoadPartitionsReq loadPartitionsReq = LoadPartitionsReq.builder()
        .collectionName("my_collection")
        .partitionNames(Collections.singletonList("partitionA"))
        .build();

client.loadPartitions(loadPartitionsReq);

GetLoadStateReq getLoadStateReq = GetLoadStateReq.builder()
        .collectionName("my_collection")
        .partitionName("partitionA")
        .build();

Boolean getLoadStateRes = client.getLoadState(getLoadStateReq);
System.out.println(getLoadStateRes);

// True
```

</TabItem>

<TabItem value='javascript'>

```javascript
await client.loadPartitions({
    collection_name: "my_collection",
    partition_names: ["partitionA"]
})

res = await client.getLoadState({
    collection_name: "my_collection",
    partition_name: "partitionA"
})

console.log(res)

// Output
// 
// LoadStateLoaded
// 
```

</TabItem>

<TabItem value='go'>

```go
task, err := client.LoadPartitions(ctx, milvusclient.NewLoadPartitionsOption("my_collection", "partitionA"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

// sync wait collection to be loaded
err = task.Await(ctx)
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

state, err := client.GetLoadState(ctx, milvusclient.NewGetLoadStateOption("my_collection", "partitionA"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println(state)
```

</TabItem>

<TabItem value='bash'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/partitions/load" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "partitionNames": ["partitionA"]
}'

# {
#     "code": 0,
#     "data": {}
# }

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/get_load_state" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "partitionNames": ["partitionA"]
}'

# {
#     "code": 0,
#     "data": {
#         "loadProgress": 100,
#         "loadState": "LoadStateLoaded",
#         "message": ""
#     }
# }
```

</TabItem>
</Tabs>

### パーティションのリリース{#release-partitions}

特定のパーティションをリリースすることもできます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.release_partitions(
    collection_name="my_collection",
    partition_names=["partitionA"]
)

res = client.get_load_state(
    collection_name="my_collection",
    partition_name="partitionA"
)

print(res)

# Output
#
# {
#     "state": "<LoadState: NotLoaded>"
# }
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.partition.request.ReleasePartitionsReq;

ReleasePartitionsReq releasePartitionsReq = ReleasePartitionsReq.builder()
        .collectionName("my_collection")
        .partitionNames(Collections.singletonList("partitionA"))
        .build();

client.releasePartitions(releasePartitionsReq);

GetLoadStateReq getLoadStateReq = GetLoadStateReq.builder()
        .collectionName("my_collection")
        .partitionName("partitionA")
        .build();

Boolean getLoadStateRes = client.getLoadState(getLoadStateReq);
System.out.println(getLoadStateRes);

// False
```

</TabItem>

<TabItem value='javascript'>

```javascript
await client.releasePartitions({
    collection_name: "my_collection",
    partition_names: ["partitionA"]
})

res = await client.getLoadState({
    collection_name: "my_collection",
    partition_name: "partitionA"
})

console.log(res)

// Output
// 
// LoadStateNotLoaded
// 
```

</TabItem>

<TabItem value='go'>

```go
err = client.ReleasePartitions(ctx, milvusclient.NewReleasePartitionsOptions("my_collection", "partitionA"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

state, err := client.GetLoadState(ctx, milvusclient.NewGetLoadStateOption("my_collection", "partitionA"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println(state)
```

</TabItem>

<TabItem value='bash'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/partitions/release" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "partitionNames": ["partitionA"]
}'

# {
#     "code": 0,
#     "data": {}
# }

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/get_load_state" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "partitionNames": ["partitionA"]
}'

# {
#     "code": 0,
#     "data": {
#         "loadProgress": 0,
#         "loadState": "LoadStateNotLoaded",
#         "message": ""
#     }
# }
```

</TabItem>
</Tabs>

## パーティション内でのデータ操作{#data-operations-within-partitions}

### エンティティの挿入と削除{#insert-and-delete-entities}

特定の操作で挿入、アップサート、削除操作を実行できます。詳細については、以下を参照してください。

- [パーティションへのエンティティの挿入](./insert-entities#insert-entities-into-a-partition)

- [パーティションへのエンティティのアップサート](./upsert-entities#upsert-entities-in-a-partition)

- [パーティションからのエンティティの削除](./delete-entities#delete-entities-from-partitions)

### 検索とクエリ{#search-and-query}

特定のパーティション内で検索とクエリを実行できます。詳細については、以下を参照してください。

- [パーティション内でのANN検索の実行](./single-vector-search#ann-search-in-partition)

- [パーティション内でのメタデータフィルタリングの実行](./get-and-scalar-query#queries-in-partitions)

## パーティションの削除{#drop-partition}

不要になったパーティションは削除できます。パーティションを削除する前に、パーティションがreleaseされていることを確認してください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.release_partitions(
    collection_name="my_collection",
    partition_names=["partitionA"]
)

client.drop_partition(
    collection_name="my_collection",
    partition_name="partitionA"
)

res = client.list_partitions(
    collection_name="my_collection"
)

print(res)

# ["_default"]
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.partition.request.DropPartitionReq;
import io.milvus.v2.service.partition.request.ReleasePartitionsReq;
import io.milvus.v2.service.partition.request.ListPartitionsReq;

ReleasePartitionsReq releasePartitionsReq = ReleasePartitionsReq.builder()
        .collectionName("my_collection")
        .partitionNames(Collections.singletonList("partitionA"))
        .build();

client.releasePartitions(releasePartitionsReq);

DropPartitionReq dropPartitionReq = DropPartitionReq.builder()
        .collectionName("my_collection")
        .partitionName("partitionA")
        .build();

client.dropPartition(dropPartitionReq);

ListPartitionsReq listPartitionsReq = ListPartitionsReq.builder()
        .collectionName("my_collection")
        .build();

List<String> partitionNames = client.listPartitions(listPartitionsReq);
System.out.println(partitionNames);

// Output:
// [_default]
```

</TabItem>

<TabItem value='javascript'>

```javascript
await client.releasePartitions({
    collection_name: "my_collection",
    partition_names: ["partitionA"]
})

await client.dropPartition({
    collection_name: "my_collection",
    partition_name: "partitionA"
})

res = await client.listPartitions({
    collection_name: "my_collection"
})

console.log(res)

// Output
// ["_default"]
```

</TabItem>

<TabItem value='go'>

```go
err = client.ReleasePartitions(ctx, milvusclient.NewReleasePartitionsOptions("my_collection", "partitionA"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

err = client.DropPartition(ctx, milvusclient.NewDropPartitionOption("my_collection", "partitionA"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

partitionNames, err := client.ListPartitions(ctx, milvusclient.NewListPartitionOption("my_collection"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println(partitionNames)
```

</TabItem>

<TabItem value='bash'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/partitions/release" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "partitionNames": ["partitionA"]
}'

# {
#     "code": 0,
#     "data": {}
# }

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/partitions/drop" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "partitionName": "partitionA"
}'

# {
#     "code": 0,
#     "data": {}
# }

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/partitions/list" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection"
}'

# {
#     "code": 0,
#     "data": [
#         "_default"
#     ]
# }
```

</TabItem>
</Tabs>

