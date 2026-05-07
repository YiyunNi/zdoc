---
title: "オンデマンド DQL Operations | Cloud"
slug: /dql-sessions-external-collection
sidebar_key: dql-sessions-external-collection
sidebar_label: "DQL セッション"
beta: PUBLIC
notebook: FALSE
description: "検索、クエリ、取得、ハイブリッド検索などのオンデマンドコンピューティングのためのコレクション内 DQL 操作では、オンデマンドクラスターからコンピュートリソースをアタッチする必要があります。Zilliz Cloud では、オンデマンドのコンピュートニーズに応えるためのセッションを作成できます。 | Cloud"
type: origin
token: T23Rwd19Dixzh8kugLfc7RZSnMe
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - external collection
  - session

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# オンデマンド DQL 運用

オンデマンドコンピューティングにおけるコレクションの DQL 運用（検索、クエリ、取得、ハイブリッド検索など）には、オンデマンドクラスタからコンピュートリソースをアタッチする必要があります。Zilliz Cloud では、オンデマンドコンピュートニーズに対応するためのセッションを作成できます。

この記事では、プロジェクトエンドポイントを使用してデータベースにコレクションを作成済みであることを前提としています。詳細については、[外部コレクションの作成](./create-external-collection) を参照してください。

## プロジェクトエンドポイントへの接続\{#connect-to-a-project-endpoint}

プロジェクトエンドポイントは、オンデマンドコンピュートリソースへのアクセスを提供するために設計されています。これを使用して、オンデマンドクラスタやデータベースを管理し、コレクションに格納されたデータを操作できます。

以下のコード例では、デフォルトデータベースに `my_collection` という名前の外部コレクションがあることを前提としています。また、接続を設定するには、十分な権限を持つ有効な API キーを常に使用する必要があります。

```python
client = MilvusClient(
    uri="https://{project-id}.{region}.vectordb.zillizcloud.com",
    token="YOUR_API_KEY"
)

client.has_collection(
    collection_name="my_collection"
)
```

```typescript
const client = new MilvusClient({
    address: "https://{project-id}.{region}.vectordb.zillizcloud.com",
    token: "YOUR_API_KEY"
});

client.has_collection({
    collection_name: "my_collection"
});
```

```bash
export PROJECT_ENDPOINT='https://{project-id}.{region}.vectordb.zillizcloud.com'
export TOKEN="YOUR_API_KEY"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/has" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection"
}'
```

## セッションの作成\{#create-a-session}

プロジェクトエンドポイントへの接続を設定したら、指定したオンデマンドクラスターからコンピュートリソースをアタッチするセッションを作成します。

以下の例では、ID が `inxx-xxxxxxxxxxxxxxxxx` のオンデマンドクラスターがすでに作成されていることを前提としています。

<Admonition type="info" icon="📘" title="Notes">

<p>RESTful API リクエストの場合、セッションを作成する代わりに、クラスター ID を DQL 呼び出しのクエリパラメーターとして渡す必要があります。</p>

</Admonition>

```python
session = client.session(
    cluster_id="inxx-xxxxxxxxxxxxxxxxx"
)
```

```typescript
const session = client.session("inxx-xxxxxxxxxxxxxxxxx");
```

```bash
export CLUSTER_ID="inxx-xxxxxxxxxxxxxxxxx"
```

## DQL 操作の実行\{#conduct-dql-operations}

セッションの準備ができたら、検索を実行できます。次の例では、基本的なベクトル検索を例として使用しています。これはクエリ、get、およびハイブリッド検索にも適用されます。

```python
query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, ..., 0.9029438446296592]
res = session.search(
    db_name="my_database",
    collection_name="my_collection",
    anns_field="vector",
    data=[query_vector],
    limit=3,
    output_fields=["product_id", "title", "main_category", "price", "average_rating", "rating_number"],
    search_params={"metric_type": "COSINE"}
)
```

```typescript
const query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, ..., 0.9029438446296592];
const res = session.search({
    db_name: "my_database",
    collection_name: "my_collection",
    anns_field: "vector",
    data: [query_vector],
    limit: 3,
    output_fields: ["product_id", "title", "main_category", "price", "average_rating", "rating_number"],
});
```

```bash
curl --request POST \
--url "${PROJECT_ENDPOINT}/v2/vectordb/entities/search?cluster_id=inxx-xxxxxxxxxxxxxxxxx" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "dbName": "my_database",
    "collectionName": "my_collection",
    "data": [
        [
            0.3580376395471989,
            -0.6023495712049978,
            0.18414012509913835,
            -0.26286205330961354,
            0.9029438446296592
        ]
    ],
    "annsField": "vector",
    "limit": 3,
    "outputFields": [
        "product_id",
        "title",
        "main_category",
        "price",
        "average_rating",
        "rating_number"
    ]
}'
```

## セッションを閉じる\{#close-a-session}

オンデマンドのコンピューティングタスクが完了したら、セッションを閉じることができます。閉じたセッションは、それ以上の DQL 操作に使用できません。

<Admonition type="info" icon="📘" title="Notes">

<p>RESTful API 呼び出しではこれは不要です。</p>

</Admonition>

```python
session.close()
```

```typescript
session.close();
```
