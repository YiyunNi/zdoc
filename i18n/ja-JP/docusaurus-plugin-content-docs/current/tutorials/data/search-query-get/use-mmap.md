---
title: "mmap の使用 | Cloud"
slug: /use-mmap
sidebar_label: "mmap の使用"
beta: FALSE
notebook: FALSE
description: "メモリマッピング (mmap) は、ディスク上の大きなファイルへの直接メモリアクセスを可能にし、Zilliz Cloud がインデックスとデータをメモリとハードドライブの両方に保存できるようにします。このアプローチは、アクセス頻度に基づいてデータ配置ポリシーを最適化し、検索パフォーマンスに影響を与えることなくコレクションのストレージ容量を拡張するのに役立ちます。このページでは、Zilliz Cloud が mmap を使用して高速かつ効率的なデータストレージと取得を可能にする方法を理解するのに役立ちます。 | Cloud"
type: origin
token: P3wrwSMNNihy8Vkf9p6cTsWYnTb
sidebar_position: 19
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - mmap
  - 検索最適化

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# mmap を使用する

メモリマッピング (mmap) により、ディスク上の大容量ファイルへの直接メモリアクセスが可能になり、Zilliz Cloud はインデックスとデータをメモリとハードドライブの両方に保存できます。このアプローチは、アクセス頻度に基づいてデータ配置ポリシーを最適化し、検索パフォーマンスに影響を与えることなくコレクションのストレージ容量を拡張するのに役立ちます。このページでは、Zilliz Cloud が mmap を使用して高速かつ効率的なデータストレージと取得を可能にする方法を理解するのに役立ちます。

<Admonition type="info" icon="📘" title="Notes">

<p>プランが異なるソースクラスターとターゲットクラスター間でデータを移行または復元する場合、ソースコレクションの mmap 設定はターゲットクラスターに移行されません。ターゲットクラスターで mmap 設定を手動で再構成してください。</p>

</Admonition>

Zilliz Cloud は、mmap 設定をプログラムで、またはウェブコンソール経由で構成することをサポートしています。このページでは、mmap をプログラムで設定する方法に焦点を当てています。ウェブコンソールでの操作の詳細については、[コレクションの管理 (コンソール)](./manage-collections-console#mmap) を参照してください。

## 概要\{#overview}

Zilliz Cloud は、ベクトル埋め込みとそのメタデータを整理するためにコレクションを使用し、コレクションの各行はエンティティを表します。以下の左図に示すように、ベクトルフィールドはベクトル埋め込みを保存し、スカラーフィールドはそれらのメタデータを保存します。特定のフィールドにインデックスを作成し、コレクションをロードすると、Zilliz Cloud は作成されたインデックスとすべてのフィールドの生データをメモリにロードします。

![EPNvwAI7hhCppbbKmuxcW5VRnUh](https://zdoc-images.s3.us-west-2.amazonaws.com/EPNvwAI7hhCppbbKmuxcW5VRnUh.png)

Zilliz Cloud クラスターはメモリ集約型データベースシステムであり、利用可能なメモリサイズがコレクションの容量を決定します。AI 駆動型アプリケーションでは通常、データサイズがメモリ容量を超える場合、大量のデータを含むフィールドをメモリにロードすることは不可能です。

このような問題を解決するために、Zilliz Cloud は mmap を導入し、コレクション内のホットデータとコールドデータのロードのバランスを取ります。上記の右図に示すように、容量最適化済み CU を備えた Zilliz Cloud クラスターを使用している場合、コレクションをロードすると、Zilliz Cloud はベクトルインデックスのみをメモリにロードし、すべてのフィールドの生データとスカラーインデックスをメモリマップします。

左図と右図のデータ配置手順を比較すると、左図の方が右図よりもメモリ使用量が多いことがわかります。mmap を有効にすると、メモリにロードされるはずだったデータがハードドライブにオフロードされ、オペレーティングシステムのページキャッシュにキャッシュされるため、メモリフットプリントが削減されます。ただし、キャッシュヒットの失敗はパフォーマンスの低下につながる可能性があります。詳細については、[この記事](https://en.wikipedia.org/wiki/Mmap) を参照してください。

## グローバル mmap 戦略\{#global-mmap-strategy}

以下の表は、異なるティアのクラスターに対するグローバル mmap 戦略を示しています。

<table>
   <tr>
     <th rowspan="2"><p>Mmap ターゲット</p></th>
     <th colspan="3"><p>専用クラスター</p></th>
     <th rowspan="2"><p>無料クラスター</p><p>サーバーレスクラスター</p></th>
   </tr>
   <tr>
     <td><p>パフォーマンス最適化済み</p></td>
     <td><p>容量最適化済み</p></td>
     <td><p>階層型ストレージ</p></td>
   </tr>
   <tr>
     <td><p>スカラーフィールド生データ</p></td>
     <td><p>無効 & 変更可能</p></td>
     <td><p>有効 & 変更可能</p></td>
     <td colspan="2"><p>有効 & 変更不可</p></td>
   </tr>
   <tr>
     <td><p>スカラーフィールドインデックス</p></td>
     <td><p>無効 & 変更可能</p></td>
     <td><p>有効 & 変更可能</p></td>
     <td colspan="2"><p>有効 & 変更不可</p></td>
   </tr>
   <tr>
     <td><p>ベクトルフィールド生データ</p></td>
     <td><p>有効 & 変更可能</p></td>
     <td><p>有効 & 変更可能</p></td>
     <td colspan="2"><p>有効 & 変更不可</p></td>
   </tr>
   <tr>
     <td><p>ベクトルフィールドインデックス</p></td>
     <td><p>無効 & 変更不可</p></td>
     <td><p>無効 & 変更不可</p></td>
     <td colspan="2"><p>有効 & 変更不可</p></td>
   </tr>
</table>

**パフォーマンス最適化済み** CU を使用する専用クラスターでは、Zilliz Cloud はベクトルフィールドの生データに対してのみ mmap を有効にし、スカラーフィールドの生データとすべてのフィールドインデックスをメモリにロードします。検索およびクエリ中のメタデータフィルタリングと取得のパフォーマンスを確保するために、グローバル設定を維持することをお勧めします。ただし、メタデータフィルタリングに関与しないフィールドや出力フィールドとして使用されないフィールドに対しては、mmap を有効にすることもできます。

**容量最適化済み** CU を使用する専用クラスターでは、Zilliz Cloud は自動インデックス作成のためにベクトルフィールドインデックスの mmap を無効にし、スカラーフィールドのインデックスとすべてのフィールドの生データをメモリマップして、最大のストレージ容量を確保します。メタデータフィルタリング条件で使用されるフィールドや出力フィールドにリストされているフィールドの生データが大きすぎて、ハードドライブに残しておくと応答が遅くなったり、ネットワークのジッターが発生したりする場合は、これらのフィールドの mmap を無効にして検索パフォーマンスを向上させることを検討できます。

**無料**および**サーバーレス**クラスター、および**拡張容量CU**を使用する専用クラスターでは、Zilliz Cloud はすべてのフィールドの生データとインデックスに対して mmap を有効にし、システムキャッシュを最大限に活用し、ホットデータのパフォーマンスを向上させ、コールドデータのコストを削減します。

## コレクション固有の mmap 設定\{#collection-specific-mmap-settings}

mmap 設定を変更するには、コレクションを解放し、再度ロードして変更を有効にする必要があります。特定のフィールド、フィールドインデックス、またはコレクションに対して mmap を構成できます。

<Admonition type="info" icon="📘" title="Notes">

<p>mmap 設定を変更する際は注意してください。不適切な mmap 設定は、以下の問題を引き起こす可能性があります。</p>
<ul>
<li><p>パフォーマンス最適化済み専用クラスターの場合、すべてのスカラーフィールドの生データとベクトルインデックスは、検索およびクエリ中のスカラーフィールドの高速取得を保証するために、デフォルトでメモリにロードされます。デフォルトの mmap 設定を変更すると、パフォーマンスが低下する可能性があります。</p></li>
<li><p>容量最適化済み専用クラスターの場合、最大のストレージ容量を確保するために、ベクトルインデックスのみがデフォルトでメモリにロードされます。デフォルトの mmap 設定を変更すると、メモリ不足 (OOM) の問題によりロードが失敗する可能性があります。</p></li>
</ul>

</Admonition>

### 特定のフィールドの mmap を構成する\{#configure-mmap-for-specific-fields}

小規模なパフォーマンス最適化済み CU を備えた専用クラスターを使用しており、データセット内のフィールドの生データが大きい場合は、mmap が有効なコレクションにそのフィールドを追加することを検討してください。

以下の例では、パフォーマンス最適化済み専用クラスターに接続し、フィールドを追加する際に **doc_chunk** という名前の VarChar フィールドで mmap を有効にする方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
TOKEN="YOUR_CLUSTER_TOKEN"

client = MilvusClient(
    uri=CLUSTER_ENDPOINT,
    token=TOKEN
)

schema = MilvusClient.create_schema()
schema.add_field("id", DataType.INT64, is_primary=True, auto_id=False)
schema.add_field("vector", DataType.FLOAT_VECTOR, dim=5)

# Disable mmap on a field upon creating the schema for a collection
schema.add_field(
    field_name="doc_chunk",
    datatype=DataType.INT64,
    max_length=512,
    # highlight-next-line
    mmap_enabled=False,
)

client.create_collection(collection_name="my_collection", schema=schema)

# Disable mmap on an existing field
# The following assumes that you have a collection named `my_collection`
client.alter_collection_field(
    collection_name="my_collection",
    field_name="doc_chunk",
    field_params={"mmap.enabled": True}
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.param.Constant;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.DataType;
import io.milvus.v2.service.collection.request.*;

import java.util.*;

String CLUSTER_ENDPOINT = "YOUR_CLUSTER_ENDPOINT";
String TOKEN = "YOUR_CLUSTER_TOKEN";
client = new MilvusClientV2(ConnectConfig.builder()
        .uri(CLUSTER_ENDPOINT)
        .token(TOKEN)
        .build());
        
CreateCollectionReq.CollectionSchema schema = client.createSchema();

schema.addField(AddFieldReq.builder()
        .fieldName("id")
        .dataType(DataType.Int64)
        .isPrimaryKey(true)
        .autoID(false)
        .build());

schema.addField(AddFieldReq.builder()
        .fieldName("vector")
        .dataType(DataType.FloatVector)
        .dimension(5)
        .build());

Map<String, String> typeParams = new HashMap<String, String>() {{
    put(Constant.MMAP_ENABLED, "false");
}};
schema.addField(AddFieldReq.builder()
        .fieldName("doc_chunk")
        .dataType(DataType.VarChar)
        .maxLength(512)
        .typeParams(typeParams)
        .build());

CreateCollectionReq req = CreateCollectionReq.builder()
        .collectionName("my_collection")
        .collectionSchema(schema)
        .build();
client.createCollection(req);

client.alterCollectionField(AlterCollectionFieldReq.builder()
        .collectionName("my_collection")
        .fieldName("doc_chunk")
        .property(Constant.MMAP_ENABLED, "true")
        .build());
```

</TabItem>

<TabItem value='java'>

```javascript
import { MilvusClient, DataType } from '@zilliz/milvus2-sdk-node';

const CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT";
const TOKEN="YOUR_TOKEN";

const client = await MilvusClient({
    address: CLUSTER_ENDPOINT,
    token: TOKEN
});

const schema = [
{
    name: 'vector',
    data_type: DataType.FloatVector
},
{
    name: "doc_chunk",
    data_type: DataType.VarChar,
    max_length: 512,
    'mmap.enabled': false,
}
];

await client.createCollection({
    collection_name: "my_collection",
    schema: schema
});

await client.alterCollectionFieldProperties({
    collection_name: "my_collection",
    field_name: "doc_chunk",
    properties: {"mmap_enable": true}
});
```

</TabItem>

<TabItem value='java'>

```go
import (
    "context"
    "fmt"

    "github.com/milvus-io/milvus/client/v2/column"
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

schema := entity.NewSchema().WithDynamicFieldEnabled(false)
schema.WithField(entity.NewField().
    WithName("id").
    WithDataType(entity.FieldTypeInt64).
    WithIsPrimaryKey(true),
).WithField(entity.NewField().
    WithName("vector").
    WithDataType(entity.FieldTypeFloatVector).
    WithDim(5),
).WithField(entity.NewField().
    WithName("doc_chunk").
    WithDataType(entity.FieldTypeVarChar).
    WithMaxLength(512).
    WithTypeParams(common.MmapEnabledKey, "false"),
)

err = client.CreateCollection(ctx,
    milvusclient.NewCreateCollectionOption("my_collection", schema))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

err = client.AlterCollectionFieldProperty(ctx, milvusclient.NewAlterCollectionFieldPropertiesOption("my_collection", "doc_chunk").
    WithProperty(common.MmapEnabledKey, "true"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
#restful
export TOKEN="YOUR_CLUSTER_TOKEN"
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"

export idField='{
    "fieldName": "id",
    "dataType": "Int64",
    "isPrimary": true,
    "auto_id": false
}'

export vectorField='{
    "fieldName": "vector",
    "dataType": "FloatVector",
    "elementTypeParams": {
       "dim": 5
    }
}'

export docChunkField='{
    "fieldName": "doc_chunk",
    "dataType": "Varchar",
    "elementTypeParams": {
        "max_length": 512,
        "mmap.enabled": false
    }
}'

export schema="{
    \"autoID\": false,
    \"fields\": [
        $idField,
        $docChunkField,
        $vectorField
    ]
}"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
--data "{
    \"collectionName\": \"my_collection\",
    \"schema\": $schema
}"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/fields/alter_properties" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "fieldName": "doc_chunk",
    "fieldParams":{
        "mmap.enabled": true
    }
}'

```

</TabItem>
</Tabs>

上記スキーマで作成されたコレクションをロードすると、Zilliz Cloudは**doc_chunk**フィールドの生データをメモリマップします。フィールドのmmap設定を変更するにはコレクションを解放し、変更後に再度コレクションをロードする必要があることに注意してください。

### スカラーインデックスのmmap設定\{#configure-mmap-for-scalar-indexes}

メタデータフィルタリングに関与する、または出力フィールドとして使用されるスカラーフィールドについては、それらをメモリにロードし、他のスカラーフィールドはハードドライブに保持することを検討してください。

以下の例では、容量最適化された専用クラスターに接続し、迅速な取得のために**title**という名前のVarCharフィールドのインデックスでmmapを無効にする方法を示します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Add a varchar field
schema.add_field(
    field_name="title",
    datatype=DataType.VARCHAR,
    max_length=512   
)

index_params = MilvusClient.prepare_index_params()

# Create index on the varchar field with mmap settings
index_params.add_index(
    field_name="title",
    index_type="AUTOINDEX",
    # highlight-next-line
    params={ "mmap.enabled": "false" }
)

# Change mmap settings for an index
# The following assumes that you have a collection named `my_collection`
client.alter_index_properties(
    collection_name="my_collection",
    index_name="title",
    properties={"mmap.enabled": True}
)
```

</TabItem>

<TabItem value='java'>

```java
schema.addField(AddFieldReq.builder()
        .fieldName("title")
        .dataType(DataType.VarChar)
        .maxLength(512)
        .build());
        
List<IndexParam> indexParams = new ArrayList<>();
Map<String, Object> extraParams = new HashMap<String, Object>() {{
    put(Constant.MMAP_ENABLED, false);
}};
indexParams.add(IndexParam.builder()
        .fieldName("title")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .extraParams(extraParams)
        .build());
        
client.alterIndexProperties(AlterIndexPropertiesReq.builder()
        .collectionName("my_collection")
        .indexName("title")
        .property(Constant.MMAP_ENABLED, "true")
        .build());
```

</TabItem>

<TabItem value='java'>

```javascript
// Create index on the varchar field with mmap settings
await client.createIndex({
    collection_name: "my_collection",
    field_name: "title",
    params: { "mmap.enabled": false }
});

// Change mmap settings for an index
// The following assumes that you have a collection named `my_collection`
await client.alterIndexProperties({
    collection_name: "my_collection",
    index_name: "title",
    properties:{"mmap.enabled": true}
});
```

</TabItem>

<TabItem value='java'>

```go
schema.WithField(entity.NewField().
    WithName("title").
    WithDataType(entity.FieldTypeVarChar).
    WithMaxLength(512),
)

indexOption := milvusclient.NewCreateIndexOption("my_collection", "title",
    index.NewInvertedIndex())
indexOption.WithExtraParam(common.MmapEnabledKey, "false")

err = client.AlterIndexProperties(ctx, milvusclient.NewAlterIndexPropertiesOption("my_collection", "title").
    WithProperty(common.MmapEnabledKey, "true"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/indexes/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "indexParams": [
        {
            "fieldName": "title",
            "params": {
                "index_type": "AUTOINDEX",
                "mmap.enabled": false
            }
        }
    ]
}'

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/indexes/alter_properties" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "indexName": "title",
    "properties": {
        "mmap.enabled": true
    }
}'
```

</TabItem>
</Tabs>

上記インデックスパラメータで作成されたコレクションをロードする際、Zilliz Cloudは**title**フィールドのインデックスをメモリにロードします。フィールドのmmap設定を変更し、変更後にコレクションを再度ロードするには、コレクションを解放する必要があることに注意してください。

### コレクションでのmmap設定\{#configure-mmap-in-collection}

コレクションでmmap設定を無効にすると、Zilliz Cloudはすべてのフィールドの生データを完全にメモリにロードします。

以下の例は、パフォーマンス最適化された専用クラスターに接続し、コレクション作成時にmmapを無効にする方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Enable mmap when creating a collection
client.create_collection(
    collection_name="my_collection",
    schema=schema,
    properties={ "mmap.enabled": "false" }
)
```

</TabItem>

<TabItem value='java'>

```java
CreateCollectionReq req = CreateCollectionReq.builder()
        .collectionName("my_collection")
        .collectionSchema(schema)
        .property(Constant.MMAP_ENABLED, "false")
        .build();
client.createCollection(req);
```

</TabItem>

<TabItem value='java'>

```javascript
await client.createCollection({
    collection_name: "my_collection",
    scheme: schema,
    properties: { "mmap.enabled": false }
});
```

</TabItem>

<TabItem value='java'>

```go
err = client.CreateCollection(ctx,
    milvusclient.NewCreateCollectionOption("my_collection", schema).
        WithProperty(common.MmapEnabledKey, "false"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
--data "{
    \"collectionName\": \"my_collection\",
    \"schema\": $schema,
    \"params\": {
        \"mmap.enabled\": \"false\"
    }
}"
```

</TabItem>
</Tabs>

既存のコレクションのmmap設定を変更することもできます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Release collection before change mmap settings
client.release_collection("my_collection")

# Ensure that the collection has already been released 
# and run the following
client.alter_collection_properties(
    collection_name="my_collection",
    properties={
        "mmap.enabled": false
    }
)

# Load the collection to make the above change take effect
client.load_collection("my_collection")
```

</TabItem>

<TabItem value='java'>

```java
client.releaseCollection(ReleaseCollectionReq.builder()
        .collectionName("my_collection")
        .build());
        
client.alterCollectionProperties(AlterCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .property(Constant.MMAP_ENABLED, "false")
        .build());

client.loadCollection(LoadCollectionReq.builder()
        .collectionName("my_collection")
        .build());
       
```

</TabItem>

<TabItem value='java'>

```javascript
// Release collection before change mmap settings
await client.releaseCollection({
    collection_name: "my_collection"
});

// Ensure that the collection has already been released 
// and run the following
await client.alterCollectionProperties({
    collection_name: "my_collection",
    properties: {
        "mmap.enabled": false
    }
});

// Load the collection to make the above change take effect
await client.loadCollection({
    collection_name: "my_collection"
});
```

</TabItem>

<TabItem value='java'>

```go
err = client.ReleaseCollection(ctx, milvusclient.NewReleaseCollectionOption("my_collection"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

err = client.AlterCollectionProperties(ctx, milvusclient.NewAlterCollectionPropertiesOption("my_collection").
    WithProperty(common.MmapEnabledKey, "false"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

_, err := client.LoadCollection(ctx, milvusclient.NewLoadCollectionOption("my_collection"))
if err != nil {
    fmt.Println(err.Error())
    // handle err
}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/release" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection"
}'

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/alter_properties" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "properties": {
        "mmmap.enabled": false
    }
}'

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/load" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection"
}'
```

</TabItem>
</Tabs>

コレクションのプロパティを変更するには、コレクションを解放し、変更を有効にするにはコレクションを再ロードする必要があります。