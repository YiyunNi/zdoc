---
title: "ロードとリリース | Cloud"
slug: /load-release-collections
sidebar_label: "ロードとリリース"
beta: FALSE
notebook: FALSE
description: "コレクションのロードは、コレクション内で類似度検索やクエリを実行するための前提条件です。このページでは、コレクションのロードおよびリリースの手順に焦点を当てています。| Cloud"
type: origin
token: CemEwKryciMUepkgYWZcOw6wncb
sidebar_position: 7
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - load
  - release

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ロードとリリース

コレクションのロードは、コレクション内で類似性検索やクエリを実行するための前提条件です。このページでは、コレクションのロードとリリースの手順に焦点を当てます。

## コレクションのロード\{#load-collection}

コレクションをロードすると、Zilliz Cloud はインデックスファイルとすべてのフィールドの生データをメモリに読み込み、検索やクエリに対して迅速に応答できるようにします。コレクションのロード後に挿入されたエンティティは、自動的にインデックス化されロードされます。

以下のコードスニペットは、コレクションをロードする方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# 7. Load the collection
client.load_collection(
    collection_name="my_collection"
)

res = client.get_load_state(
    collection_name="my_collection"
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
import io.milvus.v2.service.collection.request.LoadCollectionReq;
import io.milvus.v2.service.collection.request.GetLoadStateReq;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;

String CLUSTER_ENDPOINT = "YOUR_CLUSTER_ENDPOINT";
String TOKEN = "YOUR_CLUSTER_TOKEN";

// 1. Connect to Milvus server
ConnectConfig connectConfig = ConnectConfig.builder()
        .uri(CLUSTER_ENDPOINT)
        .token(TOKEN)
        .build();

MilvusClientV2 client = new MilvusClientV2(connectConfig);

// 6. Load the collection
LoadCollectionReq loadCollectionReq = LoadCollectionReq.builder()
        .collectionName("my_collection")
        .build();

client.loadCollection(loadCollectionReq);

// 7. Get load state of the collection
GetLoadStateReq loadStateReq = GetLoadStateReq.builder()
        .collectionName("my_collection")
        .build();

Boolean res = client.getLoadState(loadStateReq);
System.out.println(res);

// Output:
// true
```

</TabItem>

<TabItem value='java'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const address = "YOUR_CLUSTER_ENDPOINT";
const token = "YOUR_CLUSTER_TOKEN";
const client = new MilvusClient({address, token});

// 7. Load the collection
res = await client.loadCollection({
    collection_name: "my_collection"
})

console.log(res.error_code)

// Output
// 
// Success
// 

res = await client.getLoadState({
    collection_name: "my_collection"
})

console.log(res.state)

// Output
// 
// LoadStateLoaded
// 
```

</TabItem>

<TabItem value='java'>

```go
import (
    "context"
    "fmt"
    
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
    
loadTask, err := client.LoadCollection(ctx, milvusclient.NewLoadCollectionOption("my_collection"))
if err != nil {
    fmt.Println(err.Error())
    // handle err
}

// sync wait collection to be loaded
err = loadTask.Await(ctx)
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

state, err := client.GetLoadState(ctx, milvusclient.NewGetLoadStateOption("my_collection"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println(state)
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/load" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection"
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
    "collectionName": "my_collection"
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

## 特定のフィールドのロード\{#load-specific-fields}

Zilliz Cloud は、検索やクエリに関与するフィールドのみをロードできるため、メモリ使用量を削減し、検索パフォーマンスを向上させることができます。

以下のコードスニペットでは、**my_collection** という名前のコレクションが作成されており、そのコレクション内に **my_id** および **my_vector** という 2 つのフィールドが存在することを前提としています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.load_collection(
    collection_name="my_collection",
    # highlight-next-line
    load_fields=["my_id", "my_vector"] # Load only the specified fields
    skip_load_dynamic_field=True # Skip loading the dynamic field
)

res = client.get_load_state(
    collection_name="my_collection"
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
// 6. Load the collection
LoadCollectionReq loadCollectionReq = LoadCollectionReq.builder()
        .collectionName("my_collection")
        .loadFields(Arrays.asList("my_id", "my_vector"))
        .skipLoadDynamicField(true)
        .build();

client.loadCollection(loadCollectionReq);

// 7. Get load state of the collection
GetLoadStateReq loadStateReq = GetLoadStateReq.builder()
        .collectionName("my_collection")
        .build();

Boolean res = client.getLoadState(loadStateReq);
System.out.println(res);
```

</TabItem>

<TabItem value='java'>

```javascript
await client.load_collection({
  collection_name: "my_collection",
  load_fields: ["my_id", "my_vector"], // Load only the specified fields
  skip_load_dynamic_field: true //Skip loading the dynamic field
});

const loadState = client.getCollectionLoadState({
    collection_name: "my_collection",
})

console.log(loadState);
```

</TabItem>

<TabItem value='java'>

```go
loadTask, err := client.LoadCollection(ctx, milvusclient.NewLoadCollectionOption("my_collection").
        WithLoadFields("my_id", "my_vector"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

// sync wait collection to be loaded
err = loadTask.Await(ctx)
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

state, err := client.GetLoadState(ctx, milvusclient.NewGetLoadStateOption("my_collection"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println(state)
```

</TabItem>

<TabItem value='java'>

```bash
# REST
# Not supported yet
```

</TabItem>
</Tabs>

特定のフィールドをロードすることを選択した場合、`load_fields` に含まれるフィールドのみが検索やクエリでのフィルターおよび出力フィールドとして使用できる点に注意してください。`load_fields` には、必ずプライマリフィールドの名前と少なくとも 1 つのベクトルフィールドの名前を含める必要があります。

また、`skip_load_dynamic_field` を使用して、動的フィールドをロードするかどうかを決定することもできます。動的フィールドは **\&#36;meta** という名前の予約済み JSON フィールドであり、スキーマで定義されていないすべてのフィールドとその値をキーと値のペアとして保存します。動的フィールドをロードすると、そのフィールド内のすべてのキーがロードされ、フィルタリングおよび出力に利用可能になります。動的フィールド内のすべてのキーがメタデータフィルタリングや出力に関与しない場合は、`skip_load_dynamic_field` を `True` に設定してください。

コレクションのロード後にさらに多くのフィールドをロードするには、インデックスの変更によって発生する可能性のあるエラーを回避するため、まずコレクションをリリースする必要があります。

## コレクションのリリース\{#release-collection}

検索とクエリはメモリ集約型の操作です。コストを節約するため、現在使用していないコレクションはリリースすることをお勧めします。

以下のコードスニペットは、コレクションをリリースする方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# 8. Release the collection
client.release_collection(
    collection_name="my_collection"
)

res = client.get_load_state(
    collection_name="my_collection"
)

print(res)

# Output
#
# {
#     "state": "<LoadState: NotLoad>"
# }
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.collection.request.ReleaseCollectionReq;

// 8. Release the collection
ReleaseCollectionReq releaseCollectionReq = ReleaseCollectionReq.builder()
        .collectionName("my_collection")
        .build();

client.releaseCollection(releaseCollectionReq);

GetLoadStateReq loadStateReq = GetLoadStateReq.builder()
        .collectionName("my_collection")
        .build();
Boolean res = client.getLoadState(loadStateReq);
System.out.println(res);

// Output:
// false
```

</TabItem>

<TabItem value='java'>

```javascript
// 8. Release the collection
res = await client.releaseCollection({
    collection_name: "my_collection"
})

console.log(res.error_code)

// Output
// 
// Success
// 

res = await client.getLoadState({
    collection_name: "my_collection"
})

console.log(res.state)

// Output
// 
// LoadStateNotLoad
// 
```

</TabItem>

<TabItem value='java'>

```go
err = client.ReleaseCollection(ctx, milvusclient.NewReleaseCollectionOption("my_collection"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

state, err := client.GetLoadState(ctx, milvusclient.NewGetLoadStateOption("my_collection"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println(state)
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/release" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection"
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
    "collectionName": "my_collection"
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

