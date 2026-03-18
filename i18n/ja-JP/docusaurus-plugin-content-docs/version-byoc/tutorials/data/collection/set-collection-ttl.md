---
title: "コレクション TTL の設定 | BYOC"
slug: /set-collection-ttl
sidebar_label: "TTL"
beta: FALSE
notebook: FALSE
description: "データはデフォルトではコレクションに挿入されたまま残りますが、特定の期間経過後にデータを削除またはクリーンアップしたい場合があります。そのような場合、コレクションの Time-to-Live（TTL）プロパティを設定することで、TTL が期限切れになると Zilliz Cloud が自動的にデータを削除するようにできます。| BYOC"
type: origin
token: GthGwnrpEiGpClkV5JXcgWUgn8c
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - コレクション ttl
  - time-to-live

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# コレクションの TTL を設定する

データがコレクションに挿入されると、デフォルトではそのデータはそこに残り続けます。ただし、特定の期間後にデータを削除またはクリーンアップしたいシナリオもあります。このような場合、コレクションの Time-to-Live（TTL）プロパティを設定することで、Zilliz Cloud が TTL の期限切れ時に自動的にデータを削除します。

## 概要\{#overview}

Time-to-Live（TTL）は、データベースにおいて、データが挿入または更新された後、一定期間のみ有効またはアクセス可能である必要があるシナリオで一般的に使用されます。その後、データは自動的に削除されます。

たとえば、毎日データを取り込み、14日間だけレコードを保持したい場合、コレクションの TTL を **14 × 24 × 3600 = 1209600** 秒に設定することで、Zilliz Cloud がそれより古いデータを自動的に削除するように構成できます。これにより、コレクション内には最新の14日分のデータのみが保持されます。

<Admonition type="info" icon="📘" title="Notes">

<p>期限切れとなったエンティティは、検索やクエリの結果に表示されません。ただし、次回のデータコンパクションが実行されるまではストレージ内に残る可能性があります。このコンパクションは、通常24時間以内に行われます。</p>

</Admonition>

Zilliz Cloud コレクションの TTL プロパティは、秒単位の整数として指定されます。一度設定されると、TTL を超過したデータは自動的にコレクションから削除されます。

削除処理は非同期で行われるため、指定された TTL が経過した直後に検索結果からデータが完全に消えるとは限りません。削除はガベージコレクション（GC）およびコンパクションプロセスに依存しており、これらは不定期に実行されるため、若干の遅延が発生する可能性があります。

## 例\{#examples}

一般に、コレクションの TTL は、TTL 設定が適用されるタイミングと、エンティティが挿入または更新されるタイミングと密接に関係しています。TTL の仕組みをよりよく理解するために、以下の例を参照してください。

### 例 1: コレクション作成時に TTL を設定\{#example-1-set-ttl-upon-collection-creation}

コレクション作成時に **TTL** を **2592000（30日）** に設定します。

**1月1日**の**00:00**に**100億件のエンティティ**を挿入し、その後他の書き込み操作は一切行いません。

**1月31日**の**00:00**以降、**100億件のエンティティ**は検索不可能となり、出力フィールドを `count(*)` に設定したクエリの結果は **0** になります。

### 例 2: 既存のコレクションに TTL を設定\{#example-2-set-ttl-for-an-existing-collection}

TTL を設定せずにコレクションを作成済みです。

**1月1日**の**00:00**に**100億件のエンティティ**を挿入します。

**1月31日**の**00:00**にさらに**200億件のエンティティ**を挿入し、その後他の書き込み操作は一切行いません。

**2月28日**の**10:00**に、コレクションの TTL を **2592000（30日）** に設定します。

1月1日に挿入された**100億件のエンティティ**は、TTL 設定直後に検索不可能となり、出力フィールドを `count(*)` に設定したクエリの結果は **200億** になります。

### 例 3: エンティティの upsert\{#example-3-upsert-entities}

コレクション作成時に **TTL** を **2592000（30日）** に設定します。

**1月1日**の**00:00**に**200億件のエンティティ**を挿入し、その後他の書き込み操作は一切行いません。

**1月15日**の**00:00**から**23:59:59**の間に、すべての200億件のエンティティをマージモードで upsert し、その後他の書き込み操作は一切行いません。

**1月31日**から**2月13日**の期間中、200億件のエンティティは引き続き検索可能であり、クエリのカウント結果も200億のままです。

**2月14日**の**00:00**以降、クエリのカウント結果は徐々に減少し、**2月15日**の**00:00**には **0** になります。

## TTL の設定\{#set-ttl}

以下のタイミングで TTL プロパティを設定できます。

- [コレクション作成時](./set-collection-ttl#set-ttl-when-creating-a-collection)

- [既存のコレクションの TTL プロパティを変更する場合](./set-collection-ttl#set-ttl-for-an-existing-collection)

### コレクション作成時に TTL を設定\{#set-ttl-when-creating-a-collection}

以下のコードスニペットは、コレクション作成時に TTL プロパティを設定する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

# With TTL
client.create_collection(
    collection_name="my_collection",
    schema=schema,
    # highlight-start
    properties={
        "collection.ttl.seconds": 1209600
    }
    # highlight-end
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.collection.request.CreateCollectionReq;
import io.milvus.v2.service.collection.request.AlterCollectionReq;
import io.milvus.param.Constant;
import java.util.HashMap;
import java.util.Map;

// With TTL
CreateCollectionReq customizedSetupReq = CreateCollectionReq.builder()
        .collectionName("my_collection")
        .collectionSchema(schema)
        // highlight-next-line
        .property(Constant.TTL_SECONDS, "1209600")
        .build();
client.createCollection(customizedSetupReq);
```

</TabItem>

<TabItem value='java'>

```javascript
const createCollectionReq = {
    collection_name: "my_collection",
    schema: schema,
    // highlight-start
    properties: {
        "collection.ttl.seconds": 1209600
    }
    // highlight-end
}
```

</TabItem>

<TabItem value='java'>

```go
err = client.CreateCollection(ctx, milvusclient.NewCreateCollectionOption("my_collection", schema).
    WithProperty(common.CollectionTTLConfigKey, 1209600)) //  TTL in seconds
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
export params='{
    "ttlSeconds": 1209600
}'

export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"my_collection\",
    \"schema\": $schema,
    \"params\": $params
}"
```

</TabItem>
</Tabs>

### 既存のコレクションに TTL を設定する\{#set-ttl-for-an-existing-collection}

以下のコードスニペットは、既存のコレクションの TTL プロパティを変更する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.alter_collection_properties(
    collection_name="my_collection",
    properties={"collection.ttl.seconds": 1209600}
)
```

</TabItem>

<TabItem value='java'>

```java
AlterCollectionPropertiesReq alterCollectionReq = AlterCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .property(Constant.TTL_SECONDS, "1209600")
        .build();

client.alterCollectionProperties(alterCollectionReq);
```

</TabItem>

<TabItem value='java'>

```javascript
res = await client.alterCollection({
    collection_name: "my_collection",
    properties: {
        "collection.ttl.seconds": 1209600
    }
})
```

</TabItem>

<TabItem value='java'>

```go
err = client.AlterCollectionProperties(ctx, milvusclient.NewAlterCollectionPropertiesOption("my_collection").
    WithProperty(common.CollectionTTLConfigKey, 60))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/alter_properties" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"my_collection\",
    \"properties\": {
        \"collection.ttl.seconds\": 1209600
    }
}"
```

</TabItem>
</Tabs>

## TTL設定の削除\{#drop-ttl-setting}

コレクション内のデータを無期限に保持することにした場合は、そのコレクションからTTL設定を簡単に削除できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.drop_collection_properties(
    collection_name="my_collection",
    property_keys=["collection.ttl.seconds"]
)
```

</TabItem>

<TabItem value='java'>

```java
client.dropCollectionProperties(DropCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .propertyKeys(Collections.singletonList(Constant.TTL_SECONDS))
        .build());
```

</TabItem>

<TabItem value='java'>

```javascript
res = await client.dropCollectionProperties({
    collection_name: "my_collection",
    properties: ["collection.ttl.seconds"]
})
```

</TabItem>

<TabItem value='java'>

```go
err = client.DropCollectionProperties(ctx, milvusclient.NewDropCollectionPropertiesOption("my_collection", common.CollectionTTLConfigKey))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/drop_properties" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"my_collection\",
    \"propertyKeys\": [
        \"collection.ttl.seconds\"
    ]
}"
```

</TabItem>
</Tabs>

## よくある質問\{#faqs}

### TTL設定によりデータはいつ有効期限切れになりますか？\{#when-does-data-expire-due-to-ttl-settings}

現在、データの有効期限は、そのデータが挿入またはアップサートされた時点を基準として計算されます。有効期限が切れたデータは、検索結果に表示されません。詳細については、[例](./set-collection-ttl#examples)を参照してください。

### 有効期限切れのデータはいつ物理的に削除されますか？\{#when-will-the-expired-data-be-physically-deleted}

データの有効期限が切れると、それ以降の検索結果には含まれなくなります。ただし、物理的な削除は、クラスターのコンパクションポリシーに従って、その後のシステムコンパクションが実行された後に行われます。

有効期限切れ後すぐにデータを削除したい場合は、[お問い合わせください](https://support.zilliz.com/hc/en-us/requests/new)。

### CU容量はいつ減少しますか？\{#when-will-the-cu-capacity-decrease}

クラスターのCU容量は、メモリ使用量とストレージ使用量のうち大きい方によって決まります。ストレージ使用量が適用される場合、有効期限切れのデータが物理的に削除された後、Zilliz Cloud コンソール上でCU容量の減少を確認できます。

