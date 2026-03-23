---
title: "NULL許容フィールド | Cloud"
slug: /nullable-fields
sidebar_label: "NULL許容フィールド"
beta: FALSE
notebook: FALSE
description: "MilvusはNULL許容フィールドをサポートしており、フィールド値が欠落しているか、明示的にNULLに設定されていることを許可します。NULL許容性はスキーマレベルで定義され、データ取り込み、インデックス作成、検索、クエリ操作全体にわたって一貫して適用されます。 | Cloud"
type: origin
token: DjROwgK6ziCf7Rkoji6ccyEUnsg
sidebar_position: 14
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - スキーマ
  - NULL許容

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# NULL許容フィールド

MilvusはNULL許容フィールドをサポートしており、フィールド値が欠落しているか、明示的にNULLに設定されていることを許可します。NULL許容はスキーマレベルで定義され、データ取り込み、インデックス作成、検索、クエリ操作全体で一貫して適用されます。

NULL許容フィールドは、次の場合に使用します。

- 欠損値を許容する外部システムからデータが取り込まれる場合

- 一部のメタデータがオプションであるか、データセットの一部のみで利用可能な場合

- ベクトル埋め込みが非同期で生成され、後で挿入される場合

## 制限事項\{#limits}

- NULL値を許容するベクトルフィールドは、`IS NULL`または`IS NOT NULL`フィルター式をサポートしません。ベクトルフィールド値がNULLであるかどうかに基づいてエンティティを明示的にフィルタリングすることはできません。

- 構造体の配列フィールドはNULL値をサポートしません。構造体の配列フィールドまたはその中にネストされたフィールドをNULL許容としてマークすることはできません。

- `nullable`属性はフィールドが作成されるときに定義され、後で変更することはできません。既存のフィールドのNULL許容を有効または無効にすることはできません。

- NULL許容としてマークされたフィールドは、パーティションキーとして使用できません。パーティションキーフィールドは常に有効なNULL以外の値を含んでいる必要があります。

## NULL許容フィールドとは？\{#what-is-a-nullable-field}

Milvusでは、フィールドがNULL値を格納できるかどうかは、`nullable`というスキーマレベルのフィールド属性によって制御されます。

フィールドが`nullable=True`で定義されている場合、Milvusはデータ取り込み中にフィールド値が欠落していることを許可します。実際には、Milvusは次の2つの入力を同等に扱い、フィールド値をNULLとして格納します。

- 入力エンティティからフィールドが省略されている場合

- フィールドが明示的にNULLに設定されている場合（例：Pythonの`None`）

フィールドがNULL許容として定義されていない場合（デフォルトの動作）、すべてのエンティティはそのフィールドに有効な値を提供する必要があります。フィールドを省略したり、明示的にNULL値を割り当てたりすると、挿入またはインポート操作が失敗します。

nullable属性は、コレクションスキーマの**スカラーフィールドとベクトルフィールド**の両方でサポートされています。ただし、構造体の配列フィールドはnullable属性をサポートしていません。

<Admonition type="info" icon="📘" title="Notes">

<p>NULL許容は、フィールド値が欠落している可能性があるかどうかを決定します。フィールドが欠落している場合にどの値が使用されるかを定義するものではありません。</p>
<ul>
<li><p>NULL許容フィールドがデフォルト値なしで構成されている場合、フィールドを省略すると、格納されたNULL値になります。</p></li>
<li><p>デフォルト値が構成されている場合、Milvusは代わりにデフォルト値を格納する場合があります。詳細については、<a href="./default-fields">デフォルト値</a>を参照してください。</p></li>
</ul>

</Admonition>

## コレクションスキーマでNULL許容フィールドを定義する\{#define-a-nullable-field-in-the-collection-schema}

NULL許容フィールドを使用するには、コレクションスキーマを定義する際に`nullable`属性を有効にする必要があります。

この例では、コレクションスキーマは`nullable=True`の`embedding`という名前のベクトルフィールドを定義しています。これにより、コレクション内のエンティティは、データ取り込み中にベクトル値を省略したり、明示的にNULLに設定したりすることができます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# Define schema fields
schema = client.create_schema()
schema.add_field("id", DataType.INT64, is_primary=True) # Primary field
schema.add_field(
    field_name="embedding",
    datatype=DataType.FLOAT_VECTOR,
    dim=4,
    # highlight-next-line
    nullable=True, # Enable the nullable attribute; defaults to False
)

client.create_collection(
    collection_name="my_collection",
    schema=schema,
)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// js
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

このスキーマでは、次のようになります。

- `embedding` フィールドは明示的に null 許容としてマークされています。

- エンティティは、挿入時に `embedding` フィールドを省略するか、NULL 値を割り当てることができます。

- NULL 値を許可するかどうかの決定は、コレクション作成時に固定されます。

明確にするために、以下の例では null 許容のベクトルフィールド (`embedding`) に焦点を当てています。null 許容のスカラーフィールドを定義することはオプションであり、このガイドの残りの部分に従うために必須ではありません。

<details>

<summary>**オプション: null 許容のスカラーフィールドを定義する**</summary>

スカラーフィールドも、同じ `nullable` 属性を使用して null 許容として定義でき、取り込み中に同じルールに従います。例:

```python
schema.add_field(
    field_name="age",
    datatype=DataType.INT64,
    # highlight-next-line
    nullable=True,
)
```

</details>

## 欠損値またはNULL値を持つ挿入動作\{#insert-behavior-with-missing-or-null-values}

フィールドがコレクションスキーマでnullableとして定義されると、Milvusはデータ取り込み中にフィールド値が欠落しているか、明示的にNULLに設定されていることを許可します。

以下の例では、[ステップ1](./nullable-fields#define-a-nullable-field-in-the-collection-schema)で作成されたコレクションに3つのエンティティを挿入し、これらの異なるケースを示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
data = [
    {
        "id": 1,
        "embedding": [0.1, 0.2, 0.3, 0.4],
    },
    {
        "id": 2,
        "embedding": None,   # Explicitly set to NULL
    },
    {
        "id": 3,             # Field omitted → stored as NULL
    },
]

client.insert(
    collection_name="my_collection",
    data=data,
)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// js
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

この例では、以下のようにデータが挿入されます。

- エンティティ **id = 1** は有効なベクトル値を提供します。

- エンティティ **id = 2** は、埋め込みフィールドに明示的に NULL 値を割り当てます。

- エンティティ **id = 3** は、埋め込みフィールドを完全に省略します。Milvus はこれを NULL として保存します。

## ヌル許容フィールドでのインデックスの動作\{#index-behavior-on-nullable-fields}

データを挿入した後、通常通りヌル許容フィールドにインデックスを構築できます。主な違いは、インデックス構築中に Milvus が NULL 値をどのように処理するかです。

- NULL 以外の値を持つエンティティのみがインデックスに追加されます。

- NULL 値を持つエンティティはスキップされ、インデックス構築には参加しません。

ヌル許容ベクトルフィールドの場合、これは有効なベクトルを持つエンティティのみがベクトル類似性によって検索可能になることを意味します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Set index parameters
index_params = client.prepare_index_params()
index_params.add_index(
    field_name="embedding",
    index_type="AUTOINDEX",
    metric_type="COSINE",
)

# Create index
client.create_index(
    collection_name="my_collection",
    index_params=index_params,
)

# Load collection for future search operations
client.load_collection(collection_name="my_collection")
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// js
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

この時点では、以下が適用されます。

- 有効な`embedding`値を持つエンティティはインデックス化され、検索の準備ができています。

- `embedding`がNULLのエンティティはコレクションに残りますが、ベクトルインデックスには含まれません。

## ヌル許容フィールドでの検索動作\{#search-behavior-with-nullable-fields}

ヌル許容フィールドで検索操作を実行すると、Milvusは検索に使用されるフィールドに非ヌル値を持つエンティティのみを評価します。ベクトルフィールドがNULLのエンティティは自動的にスキップされます。

この例の`embedding`のようなヌル許容ベクトルフィールドの場合：

- 有効なベクトル値を持つエンティティのみが評価され、ランク付けされます。

- NULLベクトルを持つエンティティはエラーを引き起こしません。

- 有効なベクトルの数が要求されたtopK（`limit`）よりも少ない場合、Milvusは`limit`よりも少ない結果を返すことがあります。

次の例は、ヌル許容ベクトルフィールド`embedding`に対してベクトル検索を実行します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.search(
    collection_name="my_collection",
    data=[[0.1, 0.2, 0.3, 0.4]],
    anns_field="embedding",
    limit=3,
    output_fields=["embedding"],
)

print(res)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// js
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

この検索では、次のようになります。

- `embedding` の値が非NULLのエンティティのみが候補として考慮されます。

- `embedding` の値がNULLのエンティティは評価から除外されます。

- 返される結果の数は、コレクション内に存在する有効なベクトルの数によって異なります。

## クエリとフィルタリングへの影響\{#query-and-filtering-implications}

前の例では、ベクトルフィールドに焦点を当てました。このセクションでは、**スカラーフィルター式**におけるNULL値の動作について説明します。

スカラーフィールドは `nullable=True` で定義でき、ベクトルフィールドと同じ取り込みルールに従います。ただし、**NULLスカラー値はフィルター式では常にfalseと評価されます**。

たとえば、NULL許容スカラーフィールド `age` が与えられた場合、次のフィルターは `age` が18より大きいエンティティを選択します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
expr = "age > 18"
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// js
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

`age` が NULL のエンティティは、NULL 値がフィルター条件を満たさないため、結果から除外されます。

同様に、等価チェックは NULL 値と一致しません。例：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
expr = "status == \"active\""
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// js
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

`status`がNULLのエンティティは結果から除外されます。

## 適用されるルール\{#applicable-rules}

フィールドに対して`nullable`と`default_value`の両方が設定されている場合、Milvusが挿入時にNULL入力または欠落したフィールド値をどのように処理するかは、以下のルールによって決定されます。

<table>
   <tr>
     <th><p>NULL許容</p></th>
     <th><p>デフォルト値</p></th>
     <th><p>ユーザー入力</p></th>
     <th><p>結果</p></th>
   </tr>
   <tr>
     <td><p>✅</p></td>
     <td><p>✅ (非NULL)</p></td>
     <td><p>NULLまたは省略</p></td>
     <td><p>デフォルト値を使用</p></td>
   </tr>
   <tr>
     <td><p>✅</p></td>
     <td><p>❌</p></td>
     <td><p>NULLまたは省略</p></td>
     <td><p>NULLとして保存</p></td>
   </tr>
   <tr>
     <td><p>❌</p></td>
     <td><p>✅ (非NULL)</p></td>
     <td><p>NULLまたは省略</p></td>
     <td><p>デフォルト値を使用</p></td>
   </tr>
   <tr>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>NULLまたは省略</p></td>
     <td><p>エラーをスロー</p></td>
   </tr>
   <tr>
     <td><p>❌</p></td>
     <td><p>✅ (NULL)</p></td>
     <td><p>NULLまたは省略</p></td>
     <td><p>エラーをスロー</p></td>
   </tr>
</table>

**キーポイント:**

- フィールドに非NULLのデフォルト値がある場合、`nullable`が有効になっているかどうかに関係なく、その値が使用されます。

- `nullable=True`だがデフォルト値が設定されていない場合、フィールドはNULLを格納します。

- `nullable=False`でデフォルト値が設定されていない場合、挿入はエラーで失敗します。

- NULL許容ではないフィールドにNULLのデフォルト値を設定することは無効であり、エラーが発生します。

