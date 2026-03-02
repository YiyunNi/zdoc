---
title: "テキストマッチ | BYOC"
slug: /text-match
sidebar_label: "テキストマッチ"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud のテキストマッチは、特定の用語に基づいて正確なドキュメント検索を可能にします。この機能は主に、特定の条件を満たすためのフィルタリング検索に使用され、クエリ結果を絞り込むためにスカラーフィルタリングを組み込むことができ、スカラー条件を満たすベクトル内で類似性検索を可能にします。 | BYOC"
type: origin
token: RQQKwqhZUiubFzkHo4WcR62Gnvh
sidebar_position: 11
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - collection
  - データ
  - フィルター
  - フィルタリング式
  - フィルタリング
  - テキストマッチ
  - AI Hallucination
  - AI Agent
  - セマンティック検索
  - 異常検出

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# テキストマッチ

Zilliz Cloudのテキストマッチは、特定の用語に基づいて正確なドキュメント検索を可能にします。この機能は主に、特定の条件を満たすためのフィルタリング検索に使用され、スカラーフィルタリングを組み合わせてクエリ結果を絞り込み、スカラー基準を満たすベクトル内で類似性検索を行うことができます。

<Admonition type="info" icon="📘" title="Notes">

<p>テキストマッチは、クエリ用語の正確な出現箇所を見つけることに焦点を当てており、一致したドキュメントの関連性をスコアリングしません。クエリ用語のセマンティックな意味と重要性に基づいて最も関連性の高いドキュメントを取得したい場合は、<a href="./full-text-search">Full Text Search</a>の使用をお勧めします。</p>

</Admonition>

Zilliz Cloudは、プログラムまたはウェブコンソールを介してテキストマッチを有効にすることをサポートしています。このページでは、プログラムでテキストマッチを有効にする方法に焦点を当てています。ウェブコンソールでの操作の詳細については、[コレクションの管理 (コンソール)](./manage-collections-console#text-match)を参照してください。

## 概要{#overview}

Zilliz Cloudは、基盤となる転置インデックスと用語ベースのテキスト検索を強化するために[Tantivy](https://github.com/quickwit-oss/tantivy)を統合しています。各テキストエントリについて、Zilliz Cloudは次の手順でインデックスを作成します。

1. [アナライザー](./analyzer-overview): アナライザーは、入力テキストを個々の単語（トークン）にトークン化し、必要に応じてフィルターを適用して処理します。これにより、Zilliz Cloudはこれらのトークンに基づいてインデックスを構築できます。

1. [インデックスの管理](./manage-indexes): テキスト分析後、Zilliz Cloudは各一意のトークンをそれを含むドキュメントにマッピングする転置インデックスを作成します。

ユーザーがテキストマッチを実行すると、転置インデックスが使用され、用語を含むすべてのドキュメントが迅速に取得されます。これは、各ドキュメントを個別にスキャンするよりもはるかに高速です。

![N43zw7HuGhmCHRbYDDmctO1bnkd](https://zdoc-images.s3.us-west-2.amazonaws.com/N43zw7HuGhmCHRbYDDmctO1bnkd.png)

## テキストマッチを有効にする{#enable-text-match}

テキストマッチは、Zilliz Cloudの文字列データ型である[`VARCHAR`](./use-string-field)フィールドタイプで機能します。テキストマッチを有効にするには、`enable_analyzer`と`enable_match`の両方を`True`に設定し、必要に応じてコレクションschemaを定義する際にテキスト分析用の[アナライザー](./analyzer-overview)を設定します。

### `enable_analyzer`と`enable_match`を設定する{#set-enableanalyzer-and-enablematch}

特定の`VARCHAR`フィールドでテキストマッチを有効にするには、フィールドschemaを定義する際に`enable_analyzer`と`enable_match`の両方のパラメーターを`True`に設定します。これにより、Zilliz Cloudはテキストをトークン化し、指定されたフィールドの転置インデックスを作成して、高速で効率的なテキストマッチを可能にします。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

schema = MilvusClient.create_schema(enable_dynamic_field=False)
schema.add_field(
    field_name="id",
    datatype=DataType.INT64,
    is_primary=True,
    auto_id=True
)
schema.add_field(
    field_name='text', 
    datatype=DataType.VARCHAR, 
    max_length=1000, 
    enable_analyzer=True, # Whether to enable text analysis for this field
    enable_match=True # Whether to enable text match
)
schema.add_field(
    field_name="embeddings",
    datatype=DataType.FLOAT_VECTOR,
    dim=5
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.DataType;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

CreateCollectionReq.CollectionSchema schema = CreateCollectionReq.CollectionSchema.builder()
        .enableDynamicField(false)
        .build();
schema.addField(AddFieldReq.builder()
        .fieldName("id")
        .dataType(DataType.Int64)
        .isPrimaryKey(true)
        .autoID(true)
        .build());
schema.addField(AddFieldReq.builder()
        .fieldName("text")
        .dataType(DataType.VarChar)
        .maxLength(1000)
        .enableAnalyzer(true)
        .enableMatch(true)
        .build());
schema.addField(AddFieldReq.builder()
        .fieldName("embeddings")
        .dataType(DataType.FloatVector)
        .dimension(5)
        .build());
```

</TabItem>

<TabItem value='go'>

```go
import "github.com/milvus-io/milvus/client/v2/entity"

schema := entity.NewSchema().WithDynamicFieldEnabled(false)
schema.WithField(entity.NewField().
    WithName("id").
    WithDataType(entity.FieldTypeInt64).
    WithIsPrimaryKey(true).
    WithIsAutoID(true),
).WithField(entity.NewField().
    WithName("text").
    WithDataType(entity.FieldTypeVarChar).
    WithEnableAnalyzer(true).
    WithEnableMatch(true).
    WithMaxLength(1000),
).WithField(entity.NewField().
    WithName("embeddings").
    WithDataType(entity.FieldTypeFloatVector).
    WithDim(5),
)
```

</TabItem>

<TabItem value='javascript'>

```javascript
const schema = [
  {
    name: "id",
    data_type: DataType.Int64,
    is_primary_key: true,
  },
  {
    name: "text",
    data_type: "VarChar",
    enable_analyzer: true,
    enable_match: true,
    max_length: 1000,
  },
  {
    name: "embeddings",
    data_type: DataType.FloatVector,
    dim: 5,
  },
];
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
                "fieldName": "text",
                "dataType": "VarChar",
                "elementTypeParams": {
                    "max_length": 1000,
                    "enable_analyzer": true,
                    "enable_match": true
                }
            },
            {
                "fieldName": "embeddings",
                "dataType": "FloatVector",
                "elementTypeParams": {
                    "dim": "5"
                }
            }
        ]
    }'
```

</TabItem>
</Tabs>

### オプション：アナライザーの設定 {#optional-configure-an-analyzer}

キーワードマッチングのパフォーマンスと精度は、選択されたアナライザーに依存します。異なるアナライザーは様々な言語やテキスト構造に合わせて調整されているため、適切なアナライザーを選択することで、特定のユースケースにおける検索結果に大きな影響を与える可能性があります。

デフォルトでは、Zilliz Cloudは`standard`アナライザーを使用します。これは、空白と句読点に基づいてテキストをトークン化し、40文字を超えるトークンを削除し、テキストを小文字に変換します。このデフォルト設定を適用するために追加のパラメータは必要ありません。詳細については、[Standard](./standard-analyzer)を参照してください。

異なるアナライザーが必要な場合は、`analyzer_params`パラメータを使用して設定できます。例えば、英語のテキストを処理するために`english`アナライザーを適用するには、次のようにします。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "type": "english"
}
schema.add_field(
    field_name='text',
    datatype=DataType.VARCHAR,
    max_length=200,
    enable_analyzer=True,
    analyzer_params = analyzer_params,
    enable_match = True,
)
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("type", "english");
schema.addField(AddFieldReq.builder()
        .fieldName("text")
        .dataType(DataType.VarChar)
        .maxLength(200)
        .enableAnalyzer(true)
        .analyzerParams(analyzerParams)
        .enableMatch(true)
        .build());
```

</TabItem>

<TabItem value='go'>

```go
analyzerParams := map[string]any{"type": "english"}
schema.WithField(entity.NewField().
    WithName("text").
    WithDataType(entity.FieldTypeVarChar).
    WithEnableAnalyzer(true).
    WithEnableMatch(true).
    WithAnalyzerParams(analyzerParams).
    WithMaxLength(200),
)
```

</TabItem>

<TabItem value='javascript'>

```javascript
const schema = [
  {
    name: "id",
    data_type: DataType.Int64,
    is_primary_key: true,
  },
  {
    name: "text",
    data_type: "VarChar",
    enable_analyzer: true,
    enable_match: true,
    max_length: 1000,
    analyzer_params: { type: 'english' },
  },
  {
    name: "embeddings",
    data_type: DataType.FloatVector,
    dim: 5,
  },
];
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
                "fieldName": "text",
                "dataType": "VarChar",
                "elementTypeParams": {
                    "max_length": 200,
                    "enable_analyzer": true,
                    "enable_match": true,
                    "analyzer_params": {"type": "english"}
                }
            },
            {
                "fieldName": "embeddings",
                "dataType": "FloatVector",
                "elementTypeParams": {
                    "dim": "5"
                }
            }
        ]
    }'
```

</TabItem>
</Tabs>

Zilliz Cloud は、さまざまな言語やシナリオに適した他のアナライザーも提供しています。詳細については、[アナライザーの概要](./analyzer-overview)を参照してください。

## テキストマッチの使用方法{#use-text-match}

コレクションスキーマで VARCHAR フィールドのテキストマッチを有効にすると、`TEXT_MATCH` 式を使用してテキストマッチを実行できます。

### TEXT_MATCH 式の構文{#textmatch-expression-syntax}

`TEXT_MATCH` 式は、検索するフィールドと用語を指定するために使用されます。その構文は次のとおりです。

```python
TEXT_MATCH(field_name, text)
```

- `field_name`: 検索するVARCHARフィールドの名前。

- `text`: 検索する用語。複数の用語は、言語と設定されたアナライザーに基づいて、スペースまたはその他の適切な区切り文字で区切ることができます。

デフォルトでは、`TEXT_MATCH`は**OR**マッチングロジックを使用します。つまり、指定された用語のいずれかを含むドキュメントを返します。たとえば、`text`フィールドに`machine`または`deep`という用語を含むドキュメントを検索するには、次の式を使用します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
filter = "TEXT_MATCH(text, 'machine deep')"
```

</TabItem>

<TabItem value='java'>

```java
String filter = "TEXT_MATCH(text, 'machine deep')";
```

</TabItem>

<TabItem value='go'>

```go
filter := "TEXT_MATCH(text, 'machine deep')"
```

</TabItem>

<TabItem value='javascript'>

```javascript
const filter = "TEXT_MATCH(text, 'machine deep')";
```

</TabItem>

<TabItem value='bash'>

```bash
export filter="\"TEXT_MATCH(text, 'machine deep')\""
```

</TabItem>
</Tabs>

論理演算子を使用して複数の `TEXT_MATCH` 式を組み合わせることで、**AND** マッチングを実行することもできます。

- `text` フィールドに `machine` と `deep` の両方を含むドキュメントを検索するには、次の式を使用します。

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
    <TabItem value='python'>

    ```python
    filter = "TEXT_MATCH(text, 'machine') and TEXT_MATCH(text, 'deep')"
    ```

    </TabItem>

    <TabItem value='java'>

    ```java
    String filter = "TEXT_MATCH(text, 'machine') and TEXT_MATCH(text, 'deep')";
    ```

    </TabItem>

    <TabItem value='go'>

    ```go
    filter := "TEXT_MATCH(text, 'machine') and TEXT_MATCH(text, 'deep')"
    ```

    </TabItem>

    <TabItem value='javascript'>

    ```javascript
    const filter = "TEXT_MATCH(text, 'machine') and TEXT_MATCH(text, 'deep')"
    ```

    </TabItem>

    <TabItem value='bash'>

    ```bash
    export filter="\"TEXT_MATCH(text, 'machine') and TEXT_MATCH(text, 'deep')\""
    ```

    </TabItem>
    </Tabs>

- `text`フィールドに`machine`と`learning`の両方を含むが、`deep`を含まないドキュメントを検索するには、以下の式を使用します。

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
    <TabItem value='python'>

    ```python
    filter = "not TEXT_MATCH(text, 'deep') and TEXT_MATCH(text, 'machine') and TEXT_MATCH(text, 'learning')"
    ```

    </TabItem>

    <TabItem value='java'>

    ```java
    String filter = "not TEXT_MATCH(text, 'deep') and TEXT_MATCH(text, 'machine') and TEXT_MATCH(text, 'learning')";
    ```

    </TabItem>

    <TabItem value='go'>

    ```go
    filter := "not TEXT_MATCH(text, 'deep') and TEXT_MATCH(text, 'machine') and TEXT_MATCH(text, 'learning')"
    ```

    </TabItem>

    <TabItem value='javascript'>

    ```javascript
    const filter = "not TEXT_MATCH(text, 'deep') and TEXT_MATCH(text, 'machine') and TEXT_MATCH(text, 'learning')";
    ```

    </TabItem>

    <TabItem value='bash'>

    ```bash
    export filter="\"not TEXT_MATCH(text, 'deep') and TEXT_MATCH(text, 'machine') and TEXT_MATCH(text, 'learning')\""
    ```

    </TabItem>
    </Tabs>

### テキストマッチによる検索{#search-with-text-match}

テキストマッチは、検索範囲を絞り込み、検索パフォーマンスを向上させるために、ベクトル類似性検索と組み合わせて使用できます。ベクトル類似性検索の前にテキストマッチを使用してコレクションをフィルタリングすることで、検索する必要があるドキュメントの数を減らし、クエリ時間を短縮できます。

この例では、`filter` 式は、指定された用語 `keyword1` または `keyword2` に一致するドキュメントのみを含むように検索結果をフィルタリングします。その後、このフィルタリングされたドキュメントのサブセットに対してベクトル類似性検索が実行されます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Match entities with `keyword1` or `keyword2`
filter = "TEXT_MATCH(text, 'keyword1 keyword2')"

# Assuming 'embeddings' is the vector field and 'text' is the VARCHAR field
result = client.search(
    collection_name="my_collection", # Your collection name
    anns_field="embeddings", # Vector field name
    data=[query_vector], # Query vector
    # highlight-next-line
    filter=filter,
    search_params={"params": {"nprobe": 10}},
    limit=10, # Max. number of results to return
    output_fields=["id", "text"] # Fields to return
)
```

</TabItem>

<TabItem value='java'>

```java
String filter = "TEXT_MATCH(text, 'keyword1 keyword2')";

SearchResp searchResp = client.search(SearchReq.builder()
        .collectionName("my_collection")
        .annsField("embeddings")
        .data(Collections.singletonList(queryVector)))
        // highlight-next-line
        .filter(filter)
        .topK(10)
        .outputFields(Arrays.asList("id", "text"))
        .build());
```

</TabItem>

<TabItem value='go'>

```go
filter := "TEXT_MATCH(text, 'keyword1 keyword2')"

resultSets, err := client.Search(ctx, milvusclient.NewSearchOption(
    "my_collection", // collectionName
    10,               // limit
    []entity.Vector{entity.FloatVector(queryVector)},
).WithANNSField("embeddings").
    WithFilter(filter).
    WithOutputFields("id", "text"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='javascript'>

```javascript
// Match entities with `keyword1` or `keyword2`
const filter = "TEXT_MATCH(text, 'keyword1 keyword2')";

// Assuming 'embeddings' is the vector field and 'text' is the VARCHAR field
const result = await client.search(
    collection_name: "my_collection", // Your collection name
    anns_field: "embeddings", // Vector field name
    data: [query_vector], // Query vector
    // highlight-next-line
    filter: filter,
    params: {"nprobe": 10},
    limit: 10, // Max. number of results to return
    output_fields: ["id", "text"] //Fields to return
);
```

</TabItem>

<TabItem value='bash'>

```bash
export filter="\"TEXT_MATCH(text, 'keyword1 keyword2')\""

export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/search" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "annsField": "embeddings",
    "data": [[0.19886812562848388, 0.06023560599112088, 0.6976963061752597, 0.2614474506242501, 0.838729485096104]],
    "filter": '"$filter"',
    "searchParams": {
        "params": {
            "nprobe": 10
        }
    },
    "limit": 10,
    "outputFields": ["text","id"]
}'
```

</TabItem>
</Tabs>

### テキストマッチによるクエリ{#query-with-text-match}

テキストマッチは、クエリ操作におけるスカラーフィルタリングにも使用できます。`query()` メソッドの `expr` パラメータに `TEXT_MATCH` 式を指定することで、指定された用語に一致するドキュメントを取得できます。

以下の例では、`text` フィールドに `keyword1` と `keyword2` の両方の用語が含まれるドキュメントを取得します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Match entities with both `keyword1` and `keyword2`
filter = "TEXT_MATCH(text, 'keyword1') and TEXT_MATCH(text, 'keyword2')"

result = client.query(
    collection_name="my_collection",
    # highlight-next-line
    filter=filter, 
    output_fields=["id", "text"]
)
```

</TabItem>

<TabItem value='java'>

```java
String filter = "TEXT_MATCH(text, 'keyword1') and TEXT_MATCH(text, 'keyword2')";

QueryResp queryResp = client.query(QueryReq.builder()
        .collectionName("my_collection")
        // highlight-next-line
        .filter(filter)
        .outputFields(Arrays.asList("id", "text"))
        .build()
);
```

</TabItem>

<TabItem value='go'>

```go
filter = "TEXT_MATCH(text, 'keyword1') and TEXT_MATCH(text, 'keyword2')"
resultSet, err := client.Query(ctx, milvusclient.NewQueryOption("my_collection").
    WithFilter(filter).
    WithOutputFields("id", "text"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

```

</TabItem>

<TabItem value='javascript'>

```javascript
// Match entities with both `keyword1` and `keyword2`
const filter = "TEXT_MATCH(text, 'keyword1') and TEXT_MATCH(text, 'keyword2')";

const result = await client.query(
    collection_name: "my_collection",
    // highlight-next-line
    filter: filter, 
    output_fields: ["id", "text"]
)
```

</TabItem>

<TabItem value='bash'>

```bash
export filter="\"TEXT_MATCH(text, 'keyword1') and TEXT_MATCH(text, 'keyword2')\""

export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/entities/query" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "collectionName": "my_collection",
    "filter": '"$filter"',
    "outputFields": ["id", "text"]
}'
```

</TabItem>
</Tabs>

## 考慮事項{#considerations}

- フィールドの用語マッチングを有効にすると、転置インデックスが作成され、ストレージリソースを消費します。この機能を有効にするかどうかを決定する際には、テキストサイズ、一意のトークン、および使用されるアナライザーによって異なるため、ストレージへの影響を考慮してください。

- スキーマでアナライザーを定義すると、その設定はそのコレクションに対して永続的になります。異なるアナライザーがニーズにより適していると判断した場合は、既存のコレクションを削除し、目的のアナライザー構成で新しいコレクションを作成することを検討してください。

- `filter` 式におけるエスケープルール：

    - 式内で二重引用符または一重引用符で囲まれた文字は、文字列定数として解釈されます。文字列定数にエスケープ文字が含まれる場合、エスケープ文字はエスケープシーケンスで表現する必要があります。たとえば、`\` を表すには `\\` を、タブ `\t` を表すには `\\t` を、改行 `\n` を表すには `\\n` を使用します。

    - 文字列定数が一重引用符で囲まれている場合、定数内の一重引用符は `\\'` として表現する必要があり、二重引用符は `"` または `\\"` のいずれかで表現できます。例：`'It\\'s milvus'`。

    - 文字列定数が二重引用符で囲まれている場合、定数内の二重引用符は `\\"` として表現する必要があり、一重引用符は `'` または `\\'` のいずれかで表現できます。例：`"He said \\"Hi\\""`。

