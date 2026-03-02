---
title: "コレクションフィールドの変更 | BYOC"
slug: /alter-collection-field
sidebar_label: "コレクションフィールドの変更"
beta: FALSE
notebook: FALSE
description: "コレクションフィールドのプロパティを変更して、列の制約を変更したり、より厳格なデータ整合性ルールを適用したりできます。 | BYOC"
type: origin
token: PLjFwlcT8ilFBakYXyfcg6S2n7d
sidebar_position: 16
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - フィールドプロパティ
  - コレクションフィールドの変更
  - milvusデータベース
  - milvus lite
  - milvus benchmark
  - managed milvus

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# コレクションフィールドの変更

コレクションフィールドのプロパティを変更して、列の制約を変更したり、より厳密なデータ整合性ルールを適用したりできます。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>各コレクションは1つのプライマリフィールドのみで構成されます。コレクション作成時に設定されたプライマリフィールドは、変更したり、そのプロパティを変更したりすることはできません。</p></li>
<li><p>各コレクションは1つのパーティションキーのみを持つことができます。コレクション作成時に設定されたパーティションキーは、変更することはできません。</p></li>
</ul>

</Admonition>

## VarCharフィールドの変更{#alter-varchar-field}

VarCharフィールドには`max_length`というプロパティがあり、フィールド値が含むことができる最大文字数を制約します。`max_length`プロパティを変更できます。

以下の例では、コレクションに`varchar`という名前のVarCharフィールドがあり、その`max_length`プロパティを設定することを想定しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

client.alter_collection_field(
    collection_name="my_collection",
    field_name="varchar",
    field_params={
        "max_length": 1024
    }
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.service.collection.request.*;

ConnectConfig config = ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .token("YOUR_CLUSTER_TOKEN")
        .build();
MilvusClientV2 client = new MilvusClientV2(config);

client.alterCollectionField(AlterCollectionFieldReq.builder()
        .collectionName("my_collection")
        .fieldName("varchar")
        .property("max_length", "1024")
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
await client.alterCollectionFieldProperties({
  collection_name: LOAD_COLLECTION_NAME,
  field_name: 'varchar',
  properties: { max_length: 1024 },
});
```

</TabItem>

<TabItem value='go'>

```go
import (
    "context"
    "fmt"

    "github.com/milvus-io/milvus/client/v2/entity"
    "github.com/milvus-io/milvus/client/v2/milvusclient"
    "github.com/milvus-io/milvus/pkg/v2/common"
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

err = client.AlterCollectionFieldProperty(ctx, milvusclient.NewAlterCollectionFieldPropertiesOption(
    "my_collection", "varchar").WithProperty(common.MaxLengthKey, 1024))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/collections/fields/alter_properties" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
--data "{
    "collectionName": "my_collection",
    "field_name": "varchar",
    "properties": {
        "max_length": "1024"
    }
}"
```

</TabItem>
</Tabs>

## 配列フィールドの変更{#alter-array-field}

配列フィールドには、`element_type` と `max_capacity` の2つのプロパティがあります。前者は配列内の要素のデータ型を決定し、後者は配列内の要素の最大数を制約します。`max_capacity` プロパティのみを変更できます。

以下の例では、コレクションに `array` という名前の配列フィールドがあり、その `max_capacity` プロパティを設定することを想定しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.alter_collection_field(
    collection_name="my_collection",
    field_name="array",
    field_params={
        "max_capacity": 64
    }
)
```

</TabItem>

<TabItem value='java'>

```java
client.alterCollectionField(AlterCollectionFieldReq.builder()
        .collectionName("my_collection")
        .fieldName("array")
        .property("max_capacity", "64")
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
await client.alterCollectionFieldProperties({
  collection_name: "my_collection",
  field_name: 'array',
  properties: { 
      max_capacity: 64 
  }
});
```

</TabItem>

<TabItem value='go'>

```go
err = client.AlterCollectionFieldProperty(ctx, milvusclient.NewAlterCollectionFieldPropertiesOption(
    "my_collection", "array").WithProperty(common.MaxCapacityKey, 64))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/collections/fields/alter_properties" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
--data "{
    "collectionName": "my_collection",
    "field_name": "array",
    "properties": {
        "max_capacity": "64"
    }
}"
```

</TabItem>
</Tabs>

## フィールドレベルのmmap設定を変更する{#alter-field-level-mmap-settings}

メモリマッピング (Mmap) は、ディスク上の大きなファイルへの直接メモリアクセスを可能にし、Zilliz Cloudがインデックスとデータをメモリとハードドライブの両方に保存できるようにします。このアプローチは、アクセス頻度に基づいてデータ配置ポリシーを最適化し、検索パフォーマンスに影響を与えることなくコレクションのストレージ容量を拡張するのに役立ちます。

以下の例では、コレクションに`doc_chunk`という名前のフィールドがあり、その`mmap_enabled`プロパティを設定することを想定しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.alter_collection_field(
    collection="my_collection",
    field_name="doc_chunk",
    properties={"mmap.enabled": True}
)
```

</TabItem>

<TabItem value='java'>

```java
client.alterCollectionField(AlterCollectionFieldReq.builder()
        .collectionName("my_collection")
        .fieldName("doc_chunk")
        .property("mmap.enabled", "True")
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
await client.alterCollectionProperties({
  collection_name: "my_collection",
  field_name: 'doc_chunk',
  properties: { 
      'mmap.enabled': true, 
  }
});
```

</TabItem>

<TabItem value='go'>

```go
err = client.AlterCollectionFieldProperty(ctx, milvusclient.NewAlterCollectionFieldPropertiesOption(
    "my_collection", "doc_chunk").WithProperty(common.MmapEnabledKey, true))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/collections/fields/alter_properties" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
--data "{
    "collectionName": "my_collection",
    "field_name": "doc_chunk",
    "properties": {
        "mmap.enabled": True
    }
}"
```

</TabItem>
</Tabs>

