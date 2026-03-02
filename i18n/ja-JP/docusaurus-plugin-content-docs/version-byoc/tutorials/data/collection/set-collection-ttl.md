---
title: "コレクションのTTLを設定する | BYOC"
slug: /set-collection-ttl
sidebar_label: "コレクションのTTLを設定する"
beta: FALSE
notebook: FALSE
description: "データは一度コレクションに挿入されると、デフォルトではそこに保持されます。しかし、特定のシナリオでは、一定期間後にデータを削除またはクリーンアップしたい場合があります。そのような場合、コレクションのTime-to-Live (TTL) プロパティを設定することで、TTLの期限が切れるとZilliz Cloudが自動的にデータを削除するようにできます。 | BYOC"
type: origin
token: GthGwnrpEiGpClkV5JXcgWUgn8c
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - collection
  - コレクションTTL
  - time-to-live
  - 近傍探索
  - Agentic RAG
  - rag llm アーキテクチャ
  - プライベートLLM

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# コレクションのTTLを設定する

データは一度コレクションに挿入されると、デフォルトではそこに残ります。しかし、特定のシナリオでは、一定期間後にデータを削除またはクリーンアップしたい場合があります。そのような場合、コレクションのTime-to-Live (TTL) プロパティを設定することで、TTLの期限が切れるとZilliz Cloudが自動的にデータを削除するようにできます。

## 概要{#overview}

Time-to-Live (TTL) は、データが挿入または変更されてから一定期間のみ有効またはアクセス可能であるべきシナリオで、データベースで一般的に使用されます。その後、データは自動的に削除されます。

例えば、毎日データを取り込んでいるが、14日間だけレコードを保持する必要がある場合、コレクションのTTLを**14 × 24 × 3600 = 1209600**秒に設定することで、Zilliz Cloudがそれより古いデータを自動的に削除するように設定できます。これにより、コレクションには最新の14日分のデータのみが残ることが保証されます。

<Admonition type="info" icon="📘" title="Notes">

<p>期限切れのエンティティは、検索結果やクエリ結果には表示されません。ただし、次のデータ圧縮までストレージに残る可能性があり、これは次の24時間以内に行われるはずです。</p>

</Admonition>

Zilliz CloudコレクションのTTLプロパティは、秒単位の整数として指定されます。一度設定されると、TTLを超過したデータはコレクションから自動的に削除されます。

削除プロセスは非同期であるため、指定されたTTLが経過した直後に検索結果からデータが削除されない場合があります。代わりに、ガベージコレクション（GC）と圧縮プロセスに依存するため、削除には遅延が生じる可能性があり、これらは非決定的な間隔で発生します。

## 例{#examples}

一般的に、コレクションのTTLは、TTL設定がいつ適用されるか、およびエンティティがいつ挿入または更新されるかと密接に関連しています。TTLメカニズムをよりよく理解するために、以下の例を検討してください。

### 例1：コレクション作成時にTTLを設定する{#example-1-set-ttl-upon-collection-creation}

コレクションを作成する際に、**TTL**を**2592000 (30日)**に設定します。

**1月1日**の**00:00**に、**100億エンティティ**を挿入し、その後書き込み操作は行いませんでした。

**1月31日**の**00:00**以降、**100億エンティティ**は検索不能になり、出力フィールドを`count(*)`に設定したクエリの結果は**0**になります。

### 例2：既存のコレクションにTTLを設定する{#example-2-set-ttl-for-an-existing-collection}

TTLなしでコレクションを作成しました。

**1月1日**の**00:00**に、**100億エンティティ**を挿入します。

**1月31日**の**00:00**に、さらに**200億エンティティ**を挿入し、その後書き込み操作は行いませんでした。

**2月28日**の**10:00**に、コレクションのTTLを**2592000 (30日)**に設定します。

1月1日に挿入された**100億エンティティ**は、TTLが設定された直後に検索不能になり、出力フィールドを`count(*)`に設定したクエリの結果は**200億**になります。

### 例3：エンティティをアップサートする{#example-3-upsert-entities}

コレクションを作成する際に、**TTL**を**2592000 (30日)**に設定します。

**1月1日**の**00:00**に、**200億エンティティ**を挿入し、その後書き込み操作は行いませんでした。

**1月15日**の**00:00**から**23:59:59**の間に、マージモードで200億エンティティすべてをアップサートし、その後書き込み操作は行いませんでした。

**1月31日**から**2月13日**の期間中、200億エンティティは検索可能であり、クエリカウントは200億のままです。

**2月14日**の**00:00**以降、クエリカウントは減少し始め、**2月15日**の**00:00**には**0**に達しました。

## TTLを設定する{#set-ttl}

TTLプロパティは、以下の際に設定できます。

- [コレクションを作成する際。](./set-collection-ttl#set-ttl-when-creating-a-collection)

- [既存のコレクションのTTLプロパティを変更する際。](./set-collection-ttl#set-ttl-for-an-existing-collection)

### コレクション作成時にTTLを設定する{#set-ttl-when-creating-a-collection}

以下のコードスニペットは、コレクション作成時にTTLプロパティを設定する方法を示しています。

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

<TabItem value='javascript'>

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

<TabItem value='go'>

```go
err = client.CreateCollection(ctx, milvusclient.NewCreateCollectionOption("my_collection", schema).
    WithProperty(common.CollectionTTLConfigKey, 1209600)) //  TTL in seconds
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

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

### 既存のコレクションにTTLを設定する{#set-ttl-for-an-existing-collection}

以下のコードスニペットは、既存のコレクションのTTLプロパティを変更する方法を示しています。

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

<TabItem value='javascript'>

```javascript
res = await client.alterCollection({
    collection_name: "my_collection",
    properties: {
        "collection.ttl.seconds": 1209600
    }
})
```

</TabItem>

<TabItem value='go'>

```go
err = client.AlterCollectionProperties(ctx, milvusclient.NewAlterCollectionPropertiesOption("my_collection").
    WithProperty(common.CollectionTTLConfigKey, 60))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

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

## TTL設定の削除{#drop-ttl-setting}

コレクション内のデータを無期限に保持することを決定した場合、そのコレクションからTTL設定を削除するだけです。

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

<TabItem value='javascript'>

```javascript
res = await client.dropCollectionProperties({
    collection_name: "my_collection",
    properties: ["collection.ttl.seconds"]
})
```

</TabItem>

<TabItem value='go'>

```go
err = client.DropCollectionProperties(ctx, milvusclient.NewDropCollectionPropertiesOption("my_collection", common.CollectionTTLConfigKey))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

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

## よくある質問{#faqs}

### TTL設定によるデータ失効はいつ発生しますか？{#when-does-data-expire-due-to-ttl-settings}

現在、データは挿入またはアップサートされた時点に基づいて失効します。失効したデータは検索結果に表示されません。詳細については、[例](./set-collection-ttl#examples)を参照してください。

### 失効したデータはいつ物理的に削除されますか？{#when-will-the-expired-data-be-physically-deleted}

データが失効すると、検索結果には含まれなくなります。ただし、クラスターの圧縮ポリシーに従って、その後のシステム圧縮後にのみ物理的に削除されます。

データが失効した直後に削除する必要がある場合は、[お問い合わせください](https://support.zilliz.com/hc/en-us/requests/new)。

### CU容量はいつ減少しますか？{#when-will-the-cu-capacity-decrease}

クラスターのCU容量は、メモリ使用量とストレージ使用量のいずれか高い方です。ストレージ使用量が適用される場合、失効したデータが物理的に削除された後、Zilliz CloudコンソールでCU容量の減少を確認できます。

