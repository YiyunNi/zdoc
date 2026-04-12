---
title: "NULL 許容フィールド | BYOC"
slug: /nullable-fields
sidebar_label: "NULL 許容フィールド"
beta: FALSE
notebook: FALSE
description: "Milvus は NULL 許容フィールドをサポートしており、フィールド値を欠落させるか、明示的に NULL に設定することができます。NULL 許容性はスキーマレベルで定義され、データ取り込み、インデックス作成、検索、およびクエリ操作全体で一貫して適用されます。| BYOC"
type: origin
token: DjROwgK6ziCf7Rkoji6ccyEUnsg
sidebar_position: 14
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - スキーマ
  - Nullable

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# NULL許容フィールド

Milvus は NULL 許容フィールドをサポートしており、フィールド値を欠損させるか、明示的に NULL に設定することができます。NULL 許容性はスキーマレベルで定義され、データ取り込み、インデックス作成、検索、クエリ操作全体で一貫して適用されます。

NULL 許容フィールドは次のような場合に使用します：

- 外部システムから欠損値を許容するデータを取り込む場合

- メタデータの一部がオプションである、またはデータセットの一部にしか存在しない場合

- ベクトル埋め込みを非同期で生成し、後で挿入する場合

## 制限\{#limits}

- NULL 値を許容するベクトルフィールドでは、`IS NULL` や `IS NOT NULL` のフィルター式はサポートされません。ベクトルフィールドの値が NULL かどうかに基づいてエンティティを明示的にフィルターすることはできません。

- 構造体の配列（配列 of 構造体s）フィールドは NULL 値をサポートしません。構造体の配列フィールドやその内部にネストされたフィールドを NULL 許容としてマークすることはできません。

- `nullable` 属性はフィールド作成時に定義され、その後変更することはできません。既存のフィールドに対して NULL 許容性を有効化または無効化することはできません。

- NULL 許容としてマークされたフィールドはパーティションキーとして使用できません。パーティションキーとなるフィールドは常に有効な非 NULL 値を含む必要があります。

## NULL 許容フィールドとは？\{#what-is-a-nullable-field}

Milvus では、フィールドに NULL 値を格納できるかどうかは、スキーマレベルのフィールド属性である `nullable` によって制御されます。

フィールドが `nullable=True` として定義されている場合、Milvus はデータ取り込み時にそのフィールド値の欠損を許容します。実際には、Milvus は以下の2つの入力を同等と見なし、フィールド値を NULL として格納します：

- 入力エンティティからフィールドが省略された場合

- フィールドが明示的に NULL に設定された場合（例：Python での `None`）

フィールドが NULL 許容として定義されていない場合（デフォルトの動作）、すべてのエンティティはそのフィールドに有効な値を提供する必要があります。フィールドを省略したり、明示的に NULL 値を割り当てたりすると、挿入またはインポート操作が失敗します。

NULL 許容属性は、コレクションスキーマ内の**スカラーおよびベクトルフィールド**の両方でサポートされています。ただし、構造体の配列フィールドでは nullable 属性はサポートされません。

<Admonition type="info" icon="📘" title="Notes">

<p>NULL 許容性はフィールド値が欠損してもよいかどうかを決定するものであり、フィールドが欠損した場合に使用される値を定義するものではありません。</p>
<ul>
<li><p>NULL 許容フィールドにデフォルト値が設定されていない場合、フィールドを省略すると格納される値は NULL になります。</p></li>
<li><p>デフォルト値が設定されている場合、Milvus は代わりにそのデフォルト値を格納する可能性があります。詳細については、<a href="./default-fields">デフォルト値</a>を参照してください。</p></li>
</ul>

</Admonition>

## コレクションスキーマで NULL 許容フィールドを定義する\{#define-a-nullable-field-in-the-collection-schema}

NULL 許容フィールドを使用するには、コレクションスキーマを定義する際に `nullable` 属性を有効にする必要があります。

この例では、コレクションスキーマに `embedding` という名前のベクトルフィールドを `nullable=True` で定義しています。これにより、コレクション内のエンティティがデータ取り込み時にベクトル値を省略するか、明示的に NULL に設定できるようになります。

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

このスキーマでは、以下のようになります。

- `embedding` フィールドは明示的に NULL 許容としてマークされています。

- エンティティは挿入時に `embedding` フィールドを省略するか、NULL 値を割り当てることができます。

- NULL 値を許容するかどうかの決定は、コレクション作成時に固定されます。

わかりやすくするため、以下の例では NULL 許容のベクトルフィールド（`embedding`）に焦点を当てています。スカラーフィールドを NULL 許容として定義することは任意であり、このガイドの残りの部分に従うために必須ではありません。

<details>

<summary>**任意：NULL 許容のスカラーフィールドを定義する**</summary>

スカラーフィールドも同様に `nullable` 属性を使用して NULL 許容として定義でき、取り込み時にも同じルールに従います。例えば：

```python
schema.add_field(
    field_name="age",
    datatype=DataType.INT64,
    # highlight-next-line
    nullable=True,
)
```

</details>

## NULL値または欠損値を含む挿入動作\{#insert-behavior-with-missing-or-null-values}

コレクションスキーマでフィールドがnullable（NULL許容）として定義されている場合、Milvusはデータ取り込み時にそのフィールドの値が欠損していること、または明示的にNULLに設定されていることを許可します。

以下の例では、[ステップ1](./nullable-fields#define-a-nullable-field-in-the-collection-schema)で作成したコレクションに3つのエンティティを挿入し、これら異なるケースを示しています。

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

この例では：

- エンティティ **id = 1** は有効なベクトル値を提供しています。

- エンティティ **id = 2** は明示的に埋め込みフィールドに NULL 値を割り当てています。

- エンティティ **id = 3** は埋め込みフィールドを完全に省略しており、Milvus はこれを NULL として格納します。

## NULL 許容フィールドに対するインデックスの動作\{#index-behavior-on-nullable-fields}

データを挿入した後、通常通り NULL 許容フィールドに対してインデックスを構築できます。主な違いは、インデックス構築時に Milvus が NULL 値をどのように扱うかです：

- 非 NULL 値を持つエンティティのみがインデックスに追加されます。

- NULL 値を持つエンティティはスキップされ、インデックス構築には参加しません。

NULL 許容ベクトルフィールドの場合、これは有効なベクトルを持つエンティティのみがベクトル類似性検索で検索可能になることを意味します。

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

この時点で以下が成り立ちます。

- 有効な `embedding` 値を持つエンティティはインデックスされ、検索可能な状態になります。

- `embedding` が NULL のエンティティはコレクション内に残りますが、ベクトルインデックスには含まれません。

## NULL 許容フィールドでの検索動作\{#search-behavior-with-nullable-fields}

NULL 許容フィールドに対して検索操作を実行すると、Milvus はその検索で使用されるフィールドの値が NULL でないエンティティのみを評価します。ベクトルフィールドが NULL のエンティティは自動的にスキップされます。

この例における `embedding` のような NULL 許容ベクトルフィールドの場合：

- 有効なベクトル値を持つエンティティのみが評価・ランキングされます。

- NULL ベクトルを持つエンティティはエラーを引き起こしません。

- 有効なベクトルの数が要求された topK（`limit`）よりも小さい場合、Milvus は `limit` よりも少ない結果を返す可能性があります。

次の例では、NULL 許容ベクトルフィールド `embedding` に対してベクトル検索を実行しています。

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

この検索では：

- `embedding` の値が NULL でないエンティティのみが候補として考慮されます。

- `embedding` の値が NULL であるエンティティは評価から除外されます。

- 返される結果の数は、コレクション内に存在する有効なベクトルの数に依存します。

## クエリとフィルタリングへの影響\{#query-and-filtering-implications}

前述の例はベクトルフィールドに焦点を当てています。このセクションでは、**スカラー フィルター式**における NULL 値の動作について説明します。

スカラー フィールドは `nullable=True` として定義でき、ベクトルフィールドと同様の取り込みルールに従います。ただし、**NULL のスカラー値はフィルター式において常に false と評価されます**。

たとえば、nullable なスカラー フィールド `age` がある場合、次のフィルターは `age` が 18 より大きいエンティティを選択します：

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

`age` が NULL であるエンティティは、NULL 値がフィルター条件を満たさないため、結果から除外されます。

同様に、等価チェックは NULL 値と一致しません。例えば：

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

`status` が NULL のエンティティは結果から除外されます。

## 適用ルール\{#applicable-rules}

フィールドに対して `nullable` と `default_value` の両方が設定されている場合、Milvus は挿入時に NULL 入力またはフィールド値の欠落を以下のルールに従って処理します。

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
     <td><p>NULL または省略</p></td>
     <td><p>デフォルト値を使用</p></td>
   </tr>
   <tr>
     <td><p>✅</p></td>
     <td><p>❌</p></td>
     <td><p>NULL または省略</p></td>
     <td><p>NULL として格納</p></td>
   </tr>
   <tr>
     <td><p>❌</p></td>
     <td><p>✅ (非NULL)</p></td>
     <td><p>NULL または省略</p></td>
     <td><p>デフォルト値を使用</p></td>
   </tr>
   <tr>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>NULL または省略</p></td>
     <td><p>エラーをスロー</p></td>
   </tr>
   <tr>
     <td><p>❌</p></td>
     <td><p>✅ (NULL)</p></td>
     <td><p>NULL または省略</p></td>
     <td><p>エラーをスロー</p></td>
   </tr>
</table>

**キー takeaways:**

- フィールドに非NULLのデフォルト値が設定されている場合、`nullable` が有効かどうかに関係なくその値が使用されます。

- `nullable=True` だがデフォルト値が設定されていない場合、フィールドには NULL が格納されます。

- `nullable=False` かつデフォルト値が設定されていない場合、挿入時にエラーが発生します。

- NULL許容でないフィールドに NULL のデフォルト値を設定することは無効であり、エラーが発生します。

