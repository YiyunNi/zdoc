---
title: "コレクションを作成 | BYOC"
slug: /manage-collections-sdks
sidebar_key: manage-collections-sdks
sidebar_label: "作成"
beta: FALSE
notebook: FALSE
description: "スキーマ、インデックスパラメータ、メトリックタイプ、および作成時のロード有無を定義してコレクションを作成できます。このページでは、ゼロからコレクションを作成する方法を紹介します。 | BYOC"
type: origin
token: EmcowmwYpiFbWgkmnqfcMf3knVc
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - create collections

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# コレクションの作成

スキーマ、インデックスパラメータ、メトリックタイプ、および作成時のロード有無を定義することで、コレクションを作成できます。このページでは、ゼロからコレクションを作成する方法を紹介します。

<Admonition type="info" icon="📘" title="Notes">

強力なデータ分離が必要で、管理するテナントの数が少ない場合は、各テナントに対して個別のコレクションを作成できます。

ただし、[プロジェクトプランとクラスタデプロイメントオプション](./limits) に応じて、最大16,384個のコレクションしか作成できません。そのため、大規模なマルチテナンシーの場合は、ユースケースに応じて、パーティションベースまたはパーティションキーベースのマルチテナンシーなどの代替戦略を検討してください。詳細については、[マルチテナンシーの実装](./multi-tenancy) を参照してください。

</Admonition>

## 概要\{#overview}

コレクションは、固定された列と可変の行を持つ2次元テーブルです。各列はフィールドを表し、各行はエンティティを表します。このような構造化データ管理を実現するには、スキーマが必要です。挿入するすべてのエンティティは、スキーマで定義された制約を満たす必要があります。

コレクションのスキーマ、インデックスパラメータ、メトリックタイプ、および作成時のロード有無を含む、あらゆる側面を決定して、コレクションが要件を完全に満たすようにすることができます。

コレクションを作成するには、以下が必要です。

- [スキーマの作成](./manage-collections-sdks#create-schema)

- [インデックスパラメータの設定](./manage-collections-sdks#optional-set-index-parameters)（オプション）

- [コレクションの作成](./manage-collections-sdks#create-a-collection)

## スキーマの作成\{#create-schema}

スキーマは、コレクションのデータ構造を定義します。コレクションを作成する際は、要件に基づいてスキーマを設計する必要があります。詳細については、[スキーマの解説](./schema-explained) を参照してください。

以下のコードスニペットは、動的フィールドを有効にし、`my_id`、`my_vector`、`my_varchar` という3つの必須フィールドを持つスキーマを作成します。

<Admonition type="info" icon="📘" title="Notes">

任意のスカラーフィールドにデフォルト値を設定し、NULL許容にすることができます。詳細については、[NULL許容 & Default](./nullable-fields) を参照してください。

</Admonition>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# 3. Create a collection in customized setup mode
from pymilvus import MilvusClient, DataType

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# 3.1. Create schema
schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=True,
)

# 3.2. Add fields to schema
schema.add_field(field_name="my_id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="my_vector", datatype=DataType.FLOAT_VECTOR, dim=5)
schema.add_field(field_name="my_varchar", datatype=DataType.VARCHAR, max_length=512)
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

// 1. Connect to Milvus server
ConnectConfig connectConfig = ConnectConfig.builder()
        .uri(CLUSTER_ENDPOINT)
        .token(TOKEN)
        .build();

MilvusClientV2 client = new MilvusClientV2(connectConfig);

// 3. Create a collection in customized setup mode

// 3.1 Create schema
CreateCollectionReq.CollectionSchema schema = client.createSchema();

// 3.2 Add fields to schema
schema.addField(AddFieldReq.builder()
        .fieldName("my_id")
        .dataType(DataType.Int64)
        .isPrimaryKey(true)
        .autoID(false)
        .build());

schema.addField(AddFieldReq.builder()
        .fieldName("my_vector")
        .dataType(DataType.FloatVector)
        .dimension(5)
        .build());

schema.addField(AddFieldReq.builder()
        .fieldName("my_varchar")
        .dataType(DataType.VarChar)
        .maxLength(512)
        .build());
```

</TabItem>

<TabItem value='java'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const address = "YOUR_CLUSTER_ENDPOINT";
const token = "YOUR_CLUSTER_TOKEN";
const client = new MilvusClient({address, token});

// 3. Create a collection in customized setup mode
// 3.1 Define fields
const fields = [
    {
        name: "my_id",
        data_type: DataType.Int64,
        is_primary_key: true,
        auto_id: false
    },
    {
        name: "my_vector",
        data_type: DataType.FloatVector,
        dim: 5
    },
    {
        name: "my_varchar",
        data_type: DataType.VarChar,
        max_length: 512
    }
]
```

</TabItem>

<TabItem value='java'>

```go
import (
    "context"
    "fmt"
    
    "github.com/milvus-io/milvus/client/v2/entity"
    "github.com/milvus-io/milvus/client/v2/index"
    "github.com/milvus-io/milvus/client/v2/milvusclient"
    "github.com/milvus-io/milvus/pkg/v2/common"
)
ctx, cancel := context.WithCancel(context.Background())
defer cancel()

milvusAddr := "YOUR_CLUSTER_ENDPOINT"
token := "YOUR_CLUSTER_TOKEN"

client, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
    Address: milvusAddr,
    APIKey: token
})
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
defer client.Close(ctx)

schema := entity.NewSchema().WithDynamicFieldEnabled(true).
        WithField(entity.NewField().WithName("my_id").WithIsAutoID(false).WithDataType(entity.FieldTypeInt64).WithIsPrimaryKey(true)).
        WithField(entity.NewField().WithName("my_vector").WithDataType(entity.FieldTypeFloatVector).WithDim(5)).
        WithField(entity.NewField().WithName("my_varchar").WithDataType(entity.FieldTypeVarChar).WithMaxLength(512))
```

</TabItem>

<TabItem value='java'>

```bash
export schema='{
        "autoId": false,
        "enabledDynamicField": false,
        "fields": [
            {
                "fieldName": "my_id",
                "dataType": "Int64",
                "isPrimary": true
            },
            {
                "fieldName": "my_vector",
                "dataType": "FloatVector",
                "elementTypeParams": {
                    "dim": "5"
                }
            },
            {
                "fieldName": "my_varchar",
                "dataType": "VarChar",
                "elementTypeParams": {
                    "max_length": 512
                }
            }
        ]
    }'
```

</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Notes">

データプレーンの RESTful API エンドポイントを呼び出す際、ターゲットクラスターのユーザー名とパスワードをコロン区切りで連結した `username:password` を認証トークンとして使用します。

</Admonition>

## (Optional) Set Index Parameters\{#optional-set-index-parameters}

特定のフィールドにインデックスを作成すると、そのフィールドに対する検索が高速化されます。インデックスは、コレクション内のエンティティの順序を記録します。以下のコードスニペットに示すように、`metric_type` と `index_type` を使用して、Zilliz Cloud がフィールドをインデックス化し、ベクトル埋め込み間の類似性を測定するための適切な方法を選択できます。

Zilliz Cloud では、すべてのベクトルフィールドのインデックスタイプとして `AUTOINDEX` を使用でき、必要に応じて `COSINE`、`L2`、`IP` のいずれかをメトリックタイプとして使用できます。

上記のコードスニペットに示すように、ベクトルフィールドにはインデックスタイプとメトリックタイプの両方を設定する必要があり、スカラーフィールドにはインデックスタイプのみを設定する必要があります。インデックスはベクトルフィールドに必須であり、フィルタ条件で頻繁に使用されるスカラーフィールドにもインデックスを作成することをお勧めします。

詳細については、[インデックスの管理](./manage-indexes) を参照してください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# 3.3. Prepare index parameters
index_params = client.prepare_index_params()

# 3.4. Add indexes
index_params.add_index(
    field_name="my_id",
    index_type="AUTOINDEX"
)

index_params.add_index(
    field_name="my_vector", 
    index_type="AUTOINDEX",
    metric_type="COSINE"
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.IndexParam;
import java.util.*;

// 3.3 Prepare index parameters
IndexParam indexParamForIdField = IndexParam.builder()
        .fieldName("my_id")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .build();

IndexParam indexParamForVectorField = IndexParam.builder()
        .fieldName("my_vector")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.COSINE)
        .build();

List<IndexParam> indexParams = new ArrayList<>();
indexParams.add(indexParamForIdField);
indexParams.add(indexParamForVectorField);
```

</TabItem>

<TabItem value='java'>

```javascript
// 3.2 Prepare index parameters
const index_params = [{
    field_name: "my_id",
    index_type: "AUTOINDEX"
},{
    field_name: "my_vector",
    index_type: "AUTOINDEX",
    metric_type: "COSINE"
}]
```

</TabItem>

<TabItem value='java'>

```go
import (
    "github.com/milvus-io/milvus/client/v2/entity"
    "github.com/milvus-io/milvus/client/v2/index"
    "github.com/milvus-io/milvus/client/v2/milvusclient"
)

collectionName := "customized_setup_1"
indexOptions := []milvusclient.CreateIndexOption{
    milvusclient.NewCreateIndexOption(collectionName, "my_vector", index.NewAutoIndex(entity.COSINE)),
    milvusclient.NewCreateIndexOption(collectionName, "my_id", index.NewAutoIndex(entity.COSINE)),
}
```

</TabItem>

<TabItem value='java'>

```bash
export indexParams='[
        {
            "fieldName": "my_vector",
            "metricType": "COSINE",
            "indexName": "my_vector",
            "indexType": "AUTOINDEX"
        },
        {
            "fieldName": "my_id",
            "indexName": "my_id",
            "indexType": "AUTOINDEX"
        }
    ]'
```

</TabItem>
</Tabs>

## コレクションの作成\{#create-a-collection}

インデックスパラメータを指定してコレクションを作成した場合、Zilliz Cloud はそのコレクションを自動的にロードします。この場合、インデックスパラメータで指定されたすべてのフィールドがインデックスされます。

以下のコードスニペットは、インデックスパラメータ付きでコレクションを作成し、そのロード状態を確認する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# 3.5. Create a collection with the index loaded simultaneously
client.create_collection(
    collection_name="customized_setup_1",
    schema=schema,
    index_params=index_params
)

res = client.get_load_state(
    collection_name="customized_setup_1"
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
import io.milvus.v2.service.collection.request.CreateCollectionReq;
import io.milvus.v2.service.collection.request.GetLoadStateReq;

// 3.4 Create a collection with schema and index parameters
CreateCollectionReq customizedSetupReq1 = CreateCollectionReq.builder()
        .collectionName("customized_setup_1")
        .collectionSchema(schema)
        .indexParams(indexParams)
        .build();

client.createCollection(customizedSetupReq1);

// 3.5 Get load state of the collection
GetLoadStateReq customSetupLoadStateReq1 = GetLoadStateReq.builder()
        .collectionName("customized_setup_1")
        .build();

Boolean loaded = client.getLoadState(customSetupLoadStateReq1);
System.out.println(loaded);

// Output:
// true
```

</TabItem>

<TabItem value='java'>

```javascript
// 3.3 Create a collection with fields and index parameters
res = await client.createCollection({
    collection_name: "customized_setup_1",
    fields: fields,
    index_params: index_params,
})

console.log(res.error_code)  

// Output
// 
// Success
// 

res = await client.getLoadState({
    collection_name: "customized_setup_1"
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
err = client.CreateCollection(ctx, milvusclient.NewCreateCollectionOption("customized_setup_1", schema).
    WithIndexOptions(indexOptions...))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println("collection created")
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"customized_setup_1\",
    \"schema\": $schema,
    \"indexParams\": $indexParams
}"
```

</TabItem>
</Tabs>

インデックスパラメータを指定せずにコレクションを作成し、後から追加することもできます。この場合、Zilliz Cloud はコレクションの作成時にコレクションをロードしません。既存のコレクションにインデックスを作成する方法の詳細については、[AUTOINDEX の解説](./autoindex-explained) を参照してください。

以下のコードスニペットは、インデックスなしでコレクションを作成する方法を示しており、作成時のコレクションのロード状態は未ロードのままになります。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# 3.6. Create a collection and index it separately
client.create_collection(
    collection_name="customized_setup_2",
    schema=schema,
)

res = client.get_load_state(
    collection_name="customized_setup_2"
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
// 3.6 Create a collection and index it separately
CreateCollectionReq customizedSetupReq2 = CreateCollectionReq.builder()
    .collectionName("customized_setup_2")
    .collectionSchema(schema)
    .build();

client.createCollection(customizedSetupReq2);

GetLoadStateReq customSetupLoadStateReq2 = GetLoadStateReq.builder()
        .collectionName("customized_setup_2")
        .build();
        
Boolean loaded = client.getLoadState(customSetupLoadStateReq2);
System.out.println(loaded);

// Output:
// false
```

</TabItem>

<TabItem value='java'>

```javascript
// 3.4 Create a collection and index it seperately
res = await client.createCollection({
    collection_name: "customized_setup_2",
    fields: fields,
})

console.log(res.error_code)

// Output
// 
// Success
// 

res = await client.getLoadState({
    collection_name: "customized_setup_2"
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
err = client.CreateCollection(ctx, milvusclient.NewCreateCollectionOption("customized_setup_2", schema))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println("collection created")

state, err := client.GetLoadState(ctx, milvusclient.NewGetLoadStateOption("customized_setup_2"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println(state.State)
```

</TabItem>

<TabItem value='java'>

```bash
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"customized_setup_2\",
    \"schema\": $schema
}"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/get_load_state" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"customized_setup_2\"
}"
```

</TabItem>
</Tabs>

## Set Collection Properties\{#set-collection-properties}

コレクションのプロパティを設定して、サービスに適したコレクションを作成できます。適用可能なプロパティは以下のとおりです。

### Set Shard Number\{#set-shard-number}

シャードはコレクションの水平方向への分割であり、各シャードはデータ入力チャネルに対応します。デフォルトでは、すべてのコレクションには1つのシャードがあります。コレクション作成時にシャード数を指定することで、データ量やワークロードにより適した構成にできます。

シャード数を設定する際の一般的なガイドラインは次のとおりです。

- **データ size:** 一般的には、2億エンティティごとに1つのシャードを持つようにします。また、挿入予定のデータの総サイズに基づいて見積もることも可能です。たとえば、100 GBのデータごとに1つのシャードを追加します。

以下のコードスニペットは、コレクション作成時にシャード数を設定する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# With shard number
client.create_collection(
    collection_name="customized_setup_3",
    schema=schema,
    # highlight-next-line
    num_shards=1
)
```

</TabItem>

<TabItem value='java'>

```java
// With shard number
CreateCollectionReq customizedSetupReq3 = CreateCollectionReq.builder()
    .collectionName("customized_setup_3")
    .collectionSchema(collectionSchema)
    // highlight-next-line
    .numShards(1)
    .build();
client.createCollection(customizedSetupReq3);
```

</TabItem>

<TabItem value='java'>

```javascript
const createCollectionReq = {
    collection_name: "customized_setup_3",
    schema: schema,
    // highlight-next-line
    shards_num: 1
}
```

</TabItem>

<TabItem value='java'>

```go
err = client.CreateCollection(ctx, milvusclient.NewCreateCollectionOption("customized_setup_3", schema).WithShardNum(1))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println("collection created")
```

</TabItem>

<TabItem value='java'>

```bash
export params='{
    "shardsNum": 1
}'

export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"customized_setup_3\",
    \"schema\": $schema,
    \"params\": $params
}"
```

</TabItem>
</Tabs>

### Enable mmap\{#enable-mmap}

Zilliz Cloud はすべてのコレクションで mmap をデフォルトで有効にしており、Zilliz Cloud が生のフィールドデータを完全にロードするのではなくメモリにマッピングできるようにしています。これによりメモリフットプリントが削減され、コレクションの容量が増加します。mmap の詳細については、[Use mmap](./use-mmap) を参照してください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"}]}>
<TabItem value='python'>

```python
# With mmap
client.create_collection(
    collection_name="customized_setup_4",
    schema=schema,
    # highlight-next-line
    enable_mmap=False
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.param.Constant;

// With MMap
CreateCollectionReq customizedSetupReq4 = CreateCollectionReq.builder()
        .collectionName("customized_setup_4")
        .collectionSchema(schema)
        // highlight-next-line
        .property(Constant.MMAP_ENABLED, "false")
        .build();
client.createCollection(customizedSetupReq4);
```

</TabItem>

<TabItem value='java'>

```javascript
client.create_collection({
    collection_name: "customized_setup_4",
    schema: schema,
     properties: {
        'mmap.enabled': true,
     },
})
```

</TabItem>

<TabItem value='java'>

```go
err = client.CreateCollection(ctx, milvusclient.NewCreateCollectionOption("customized_setup_4", schema).
    WithProperty(common.MmapEnabledKey, true))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println("collection created")
```

</TabItem>
</Tabs>

```plaintext
export params='{
    "mmap.enabled": True
}'

export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"customized_setup_5\",
    \"schema\": $schema,
    \"params\": $params
}"
```

### コレクションのTTLを設定する\{#set-collection-ttl}

コレクション内のデータを特定の期間後に削除する必要がある場合は、そのコレクションのTime-To-Live（TTL）を秒単位で設定することを検討してください。TTLがタイムアウトすると、Zilliz Cloudはそのコレクション内のエンティティを削除します。この削除は非同期で行われるため、削除が完了するまでは検索やクエリが引き続き可能です。

以下のコードスニペットでは、TTLを1日（86400秒）に設定しています。TTLは最低でも数日程度に設定することをお勧めします。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# With TTL
client.create_collection(
    collection_name="customized_setup_5",
    schema=schema,
    # highlight-start
    properties={
        "collection.ttl.seconds": 86400
    }
    # highlight-end
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.param.Constant;

// With TTL
CreateCollectionReq customizedSetupReq5 = CreateCollectionReq.builder()
        .collectionName("customized_setup_5")
        .collectionSchema(schema)
        // highlight-next-line
        .property(Constant.TTL_SECONDS, "86400")
        .build();
client.createCollection(customizedSetupReq5);
```

</TabItem>

<TabItem value='java'>

```javascript
const createCollectionReq = {
    collection_name: "customized_setup_5",
    schema: schema,
    // highlight-start
    properties: {
        "collection.ttl.seconds": 86400
    }
    // highlight-end
}
```

</TabItem>

<TabItem value='java'>

```go
err = client.CreateCollection(ctx, milvusclient.NewCreateCollectionOption("customized_setup_5", schema).
    WithProperty(common.CollectionTTLConfigKey, true))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println("collection created")
```

</TabItem>

<TabItem value='java'>

```bash
export params='{
    "ttlSeconds": 86400
}'

export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"customized_setup_5\",
    \"schema\": $schema,
    \"params\": $params
}"
```

</TabItem>
</Tabs>

### 一貫性レベルの設定\{#set-consistency-level}

コレクションを作成する際に、そのコレクション内の検索およびクエリに対して一貫性レベルを設定できます。また、特定の検索またはクエリ実行時に、コレクションの一貫性レベルを変更することも可能です。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# With consistency level
client.create_collection(
    collection_name="customized_setup_6",
    schema=schema,
    # highlight-next
    consistency_level="Bounded",
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.ConsistencyLevel;

// With consistency level
CreateCollectionReq customizedSetupReq6 = CreateCollectionReq.builder()
        .collectionName("customized_setup_6")
        .collectionSchema(schema)
        // highlight-next-line
        .consistencyLevel(ConsistencyLevel.BOUNDED)
        .build();
client.createCollection(customizedSetupReq6);
```

</TabItem>

<TabItem value='java'>

```javascript
const createCollectionReq = {
    collection_name: "customized_setup_6",
    schema: schema,
    // highlight-next
    consistency_level: "Bounded",
    // highlight-end
}

client.createCollection(createCollectionReq);
```

</TabItem>

<TabItem value='java'>

```go
err = client.CreateCollection(ctx, milvusclient.NewCreateCollectionOption("customized_setup_6", schema).
    WithConsistencyLevel(entity.ClBounded))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
fmt.Println("collection created")
```

</TabItem>

<TabItem value='java'>

```bash
export params='{
    "consistencyLevel": "Bounded"
}'

export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"customized_setup_6\",
    \"schema\": $schema,
    \"params\": $params
}"
```

</TabItem>
</Tabs>

一貫性レベルの詳細については、[一貫性レベル](./consistency-level) を参照してください。

### Enable Dynamic Field\{#enable-dynamic-field}

コレクション内のダイナミックフィールドは、**\&#36;meta** という名前の予約済み JavaScript Object Notation (JSON) フィールドです。このフィールドを有効にすると、Zilliz Cloud は各エンティティに含まれるスキーマ定義外のすべてのフィールドとその値を、予約済みフィールド内のキーと値のペアとして保存します。

ダイナミックフィールドの使用方法の詳細については、[ダイナミックフィールド](./enable-dynamic-field) を参照してください。