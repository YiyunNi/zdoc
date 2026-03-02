---
title: "一貫性レベル | Cloud"
slug: /consistency-level
sidebar_label: "一貫性レベル"
beta: FALSE
notebook: FALSE
description: "分散型ベクトルデータベースとして、Zilliz Cloud は、読み取りおよび書き込み操作中に各ノードまたはレプリカが同じデータにアクセスできるように、複数のレベルの一貫性を提供します。現在サポートされている一貫性レベルには、Strong、Bounded、Eventually、および Session があり、Bounded がデフォルトの一貫性レベルとして使用されます。 | Cloud"
type: origin
token: Xx9EwWtekinLZfkWKqic37dDnFb
sidebar_position: 20
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - collection
  - データ
  - 一貫性レベル
  - Milvus ベクトルデータベース
  - Milvus DB
  - Milvus ベクトル DB
  - Zilliz Cloud

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 一貫性レベル

分散型ベクトルデータベースとして、Zilliz Cloud は、読み取りおよび書き込み操作中に各ノードまたはレプリカが同じデータにアクセスできるように、複数のレベルの一貫性を提供します。現在サポートされている一貫性レベルには、**Strong**、**Bounded**、**Eventually**、および **Session** があり、**Bounded** がデフォルトの一貫性レベルとして使用されます。

## 概要{#overview}

Zilliz Cloud は、ストレージと計算を分離するシステムです。このシステムでは、**DataNodes** がデータの永続性を担当し、最終的に MinIO/S3 などの分散オブジェクトストレージに保存します。**QueryNodes** は、検索などの計算タスクを処理します。これらのタスクには、**バッチデータ**と**ストリーミングデータ**の両方の処理が含まれます。簡単に言えば、バッチデータはすでにオブジェクトストレージに保存されているデータとして理解でき、ストリーミングデータはまだオブジェクトストレージに保存されていないデータを指します。ネットワーク遅延のため、QueryNodes は最新のストリーミングデータを保持していないことがよくあります。追加の保護なしにストリーミングデータに対して直接検索を実行すると、多くのコミットされていないデータポイントが失われ、検索結果の精度に影響を与える可能性があります。

![UlOJwpWuKhj5LAbGSp9cwMFznEb](https://zdoc-images.s3.us-west-2.amazonaws.com/UlOJwpWuKhj5LAbGSp9cwMFznEb.png)

上記の図に示すように、QueryNodes は検索リクエストを受信した後、ストリーミングデータとバッチデータの両方を同時に受信できます。ただし、ネットワーク遅延のため、QueryNodes が取得するストリーミングデータは不完全である可能性があります。

この問題に対処するため、Zilliz Cloud はデータキュー内の各レコードにタイムスタンプを付け、同期タイムスタンプをデータキューに継続的に挿入します。同期タイムスタンプ (syncTs) が受信されるたびに、QueryNodes はそれを ServiceTime として設定します。これは、QueryNodes がその ServiceTime 以前のすべてのデータを見ることができることを意味します。ServiceTime に基づいて、Zilliz Cloud は、一貫性と可用性に関するさまざまなユーザー要件を満たすために、保証タイムスタンプ (GuaranteeTs) を提供できます。ユーザーは、検索リクエストで GuaranteeTs を指定することにより、指定された時点以前のデータを検索スコープに含める必要があることを QueryNodes に通知できます。

![Owddb7D3Fo8zyFxJgWWcZCxanIf](https://zdoc-images.s3.us-west-2.amazonaws.com/owddb7d3fo8zyfxjgwwczcxanif.png "Owddb7D3Fo8zyFxJgWWcZCxanIf")

上記の図に示すように、GuaranteeTs が ServiceTime より小さい場合、指定された時点以前のすべてのデータが完全にディスクに書き込まれていることを意味し、QueryNodes はすぐに検索操作を実行できます。GuaranteeTs が ServiceTime より大きい場合、QueryNodes は ServiceTime が GuaranteeTs を超えるまで待機してから、検索操作を実行する必要があります。

ユーザーは、クエリの精度とクエリのレイテンシの間でトレードオフを行う必要があります。ユーザーが一貫性要件が高く、クエリのレイテンシに敏感でない場合は、GuaranteeTs を可能な限り大きな値に設定できます。ユーザーが検索結果を迅速に受け取りたいが、クエリの精度に対してより寛容である場合は、GuaranteeTs をより小さな値に設定できます。

![Y9YabwvmjoWMXhxt9kRc8Atmnid](https://zdoc-images.s3.us-west-2.amazonaws.com/y9yabwvmjowmxhxt9krc8atmnid.png "Y9YabwvmjoWMXhxt9kRc8Atmnid")

Zilliz Cloud は、異なる GuaranteeTs を持つ4種類の一貫性レベルを提供します。

- **Strong**

    最新のタイムスタンプが GuaranteeTs として使用され、QueryNodes は ServiceTime が GuaranteeTs を満たすまで待機してから検索リクエストを実行する必要があります。

- **Eventual**

    GuaranteeTs は、一貫性チェックを回避するために、1などの非常に小さい値に設定され、QueryNodes はすべてのバッチデータに対してすぐに検索リクエストを実行できます。

- **Bounded Staleness**

    GuaranteeTs は、最新のタイムスタンプよりも前の時点に設定され、QueryNodes は特定のデータ損失を許容して検索を実行します。

- **Session**

    クライアントがデータを挿入した最新の時点が GuaranteeTs として使用され、QueryNodes はクライアントが挿入したすべてのデータに対して検索を実行できます。

Zilliz Cloud は、デフォルトの一貫性レベルとして Bounded Staleness を使用します。GuaranteeTs が指定されていない場合、最新の ServiceTime が GuaranteeTs として使用されます。

## 一貫性レベルの設定{#set-consistency-level}

コレクションを作成する際、および検索とクエリを実行する際に、異なる一貫性レベルを設定できます。検索またはクエリに対して一貫性レベルが指定されていない場合、コレクション作成時に指定された一貫性レベルが適用されます。

### コレクション作成時の一貫性レベルの設定{#set-consistency-level-upon-creating-collection}

コレクションを作成する際、コレクション内の検索とクエリの一貫性レベルを設定できます。以下のコード例では、一貫性レベルを **Bounded** に設定しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.create_collection(
    collection_name="my_collection",
    schema=schema,
    # highlight-next-line
    consistency_level="Bounded",
)
```

</TabItem>

<TabItem value='java'>

```java
CreateCollectionReq createCollectionReq = CreateCollectionReq.builder()
        .collectionName("my_collection")
        .collectionSchema(schema)
        // highlight-next-line
        .consistencyLevel(ConsistencyLevel.Bounded)
        .build();
client.createCollection(createCollectionReq);
```

</TabItem>

<TabItem value='go'>

```go
err = client.CreateCollection(ctx,
    milvusclient.NewCreateCollectionOption("my_collection", schema).
        WithConsistencyLevel(entity.ClBounded))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

```bash
export schema='{
        "autoId": true,
        "enabledDynamicField": false,
        "fields": [
            {
                "fieldName": "id",
                "dataType": "Int64",
                "isPrimary": true
            },
            {
                "fieldName": "vector",
                "dataType": "FloatVector",
                "elementTypeParams": {
                    "dim": "5"
                }
            },
            {
                "fieldName": "my_varchar",
                "dataType": "VarChar",
                "isClusteringKey": true,
                "elementTypeParams": {
                    "max_length": 512
                }
            }
        ]
    }'

export params='{
    "consistencyLevel": "Bounded"
}'

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

`consistency_level` パラメータの指定可能な値は、`Strong`、`Bounded`、`Eventually`、および `Session` です。

### 検索における一貫性レベルの設定 {#set-consistency-level-in-search}

特定の検索に対して、一貫性レベルをいつでも変更できます。以下のコード例では、一貫性レベルを **Bounded** に戻しています。この変更は、現在の検索リクエストにのみ適用されます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.search(
    collection_name="my_collection",
    data=[query_vector],
    limit=3,
    search_params={"metric_type": "IP"}，
    # highlight-start
    consistency_level="Bounded",
    # highlight-next
)
```

</TabItem>

<TabItem value='java'>

```java
SearchReq searchReq = SearchReq.builder()
        .collectionName("my_collection")
        .data(Collections.singletonList(queryVector))
        .topK(3)
        .searchParams(params)
        .consistencyLevel(ConsistencyLevel.BOUNDED)
        .build();

SearchResp searchResp = client.search(searchReq);
```

</TabItem>

<TabItem value='go'>

```go
resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "my_collection", // collectionName
    3,               // limit
    []entity.Vector{entity.FloatVector(queryVector)},
).WithConsistencyLevel(entity.ClBounded).
    WithANNSField("vector"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "data": [
        [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]
    ],
    "limit": 3,
    "consistencyLevel": "Bounded"
}'
```

</TabItem>
</Tabs>

このパラメータは、ハイブリッド検索と検索イテレータでも利用できます。`consistency_level` パラメータの可能な値は、`Strong`、`Bounded`、`Eventually`、および `Session` です。

### クエリでの整合性レベルの設定{#set-consistency-level-in-query}

特定の検索の整合性レベルはいつでも変更できます。以下のコード例では、整合性レベルを **Eventually** に設定しています。この設定は、現在のクエリリクエストにのみ適用されます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.query(
    collection_name="my_collection",
    filter="color like \"red%\"",
    output_fields=["vector", "color"],
    limit=3，
    # highlight-start
    consistency_level="Bounded",
    # highlight-next
)
```

</TabItem>

<TabItem value='java'>

```java
QueryReq queryReq = QueryReq.builder()
        .collectionName("my_collection")
        .filter("color like \"red%\"")
        .outputFields(Arrays.asList("vector", "color"))
        .limit(3)
        .consistencyLevel(ConsistencyLevel.Bounded)
        .build();
        
 QueryResp getResp = client.query(queryReq);
```

</TabItem>

<TabItem value='go'>

```go
resultSet, err := client.Query(ctx, milvusclient.NewQueryOption("my_collection").
    WithFilter("color like \"red%\"").
    WithOutputFields("vector", "color").
    WithLimit(3).
    WithConsistencyLevel(entity.ClBounded))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/query" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "filter": "color like \"red_%\"",
    "consistencyLevel": "Bounded",
    "limit": 3
}'
```

</TabItem>
</Tabs>

このパラメータはクエリイテレータでも利用できます。`consistency_level` パラメータの取りうる値は、`Strong`、`Bounded`、`Eventually`、`Session` です。