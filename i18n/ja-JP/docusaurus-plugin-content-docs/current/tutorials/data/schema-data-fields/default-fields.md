---
title: "デフォルト値 | Cloud"
slug: /default-fields
sidebar_label: "デフォルト値"
beta: FALSE
notebook: FALSE
description: "Milvusでは、スカラーフィールド（プライマリフィールドを除く）にデフォルト値を設定できます。フィールドにデフォルト値が設定されている場合、挿入時にデータが提供されないと、Milvusはこの値を自動的に適用します。 | Cloud"
type: origin
token: SsGkwyGJDirNDwk170rcHbUjnVe
sidebar_position: 15
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - スキーマ
  - デフォルト値

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# デフォルト値

Milvusでは、スカラーフィールド（プライマリフィールドを除く）にデフォルト値を設定できます。フィールドにデフォルト値が設定されている場合、挿入時にデータが提供されないと、Milvusはこの値を自動的に適用します。

デフォルト値は、既存のデフォルト値設定を保持することで、他のデータベースシステムからMilvusへのデータ移行を簡素化します。また、挿入時に値が不確かなフィールドにデフォルト値を使用することもできます。

## 制限事項\{#limits}

- スカラーフィールドのみがデフォルト値をサポートします。プライマリフィールドとベクトルフィールドはデフォルト値を持つことができません。

- `JSON` および `ARRAY` フィールドはデフォルト値をサポートしません。

- デフォルト値はコレクション作成時にのみ設定でき、後で変更することはできません。

## デフォルト値の設定\{#set-default-values}

コレクションを作成する際、`add_field()` の `default_value` パラメータを使用してフィールドのデフォルト値を定義します。

以下の例では、デフォルト値を持つ2つのスカラーフィールドを持つコレクションを作成します。`age` はデフォルトで `18`、`status` はデフォルトで `"active"` です。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(uri='YOUR_CLUSTER_ENDPOINT')

# Define collection schema
schema = client.create_schema(
    auto_id=False,
    enable_dynamic_schema=True,
)

schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="vector", datatype=DataType.FLOAT_VECTOR, dim=5)
# highlight-start
schema.add_field(field_name="age", datatype=DataType.INT64, default_value=18)
schema.add_field(field_name="status", datatype=DataType.VARCHAR, default_value="active", max_length=10)
# highlight-end

# Set index params
index_params = client.prepare_index_params()
index_params.add_index(field_name="vector", index_type="AUTOINDEX", metric_type="L2")

# Create collection
client.create_collection(collection_name="my_collection", schema=schema, index_params=index_params)
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

## エンティティの挿入\{#insert-entities}

データを挿入する際、デフォルト値を持つフィールドを省略したり、明示的にNULLに設定したりすると、Milvusは自動的に設定されたデフォルト値を使用します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
data = [
    # All fields provided explicitly
    {"id": 1, "vector": [0.1, 0.2, 0.3, 0.4, 0.5], "age": 30, "status": "premium"},
    # age and status omitted → both use default values (18 and "active")
    {"id": 2, "vector": [0.2, 0.3, 0.4, 0.5, 0.6]},
    # status set to None → uses default value "active"
    {"id": 3, "vector": [0.3, 0.4, 0.5, 0.6, 0.7], "age": 25, "status": None},
    # age set to None → uses default value 18
    {"id": 4, "vector": [0.4, 0.5, 0.6, 0.7, 0.8], "age": None, "status": "inactive"}
]

client.insert(collection_name="my_collection", data=data)
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

## デフォルト値を使用した検索とクエリ\{#search-and-query-with-default-values}

デフォルト値を含むエンティティは、ベクトル検索およびスカラーフィルタリング中に他のエンティティと同様に動作します。`search`操作と`query`操作の両方で、デフォルト値でフィルタリングできます。

次の例は、`age`がデフォルト値`18`と等しいエンティティを検索します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
res = client.search(
    collection_name="my_collection",
    data=[[0.1, 0.2, 0.4, 0.3, 0.5]],
    search_params={"params": {"nprobe": 16}},
    filter="age == 18",
    limit=10,
    output_fields=["id", "age", "status"]
)

print("Search results (age == 18):")
for hit in res[0]:
    print(f"  id: {hit['id']}, age: {hit['entity']['age']}, status: {hit['entity']['status']}")
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

<details>

<summary>期待される出力</summary>

```plaintext
Output:
Search results (age == 18):
  id: 2, age: 18, status: active
  id: 4, age: 18, status: inactive
```

</details>

デフォルト値に直接一致させることで、エンティティをクエリすることもできます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Query entities where age equals the default value (18)
default_age_results = client.query(
    collection_name="my_collection",
    filter="age == 18",
    output_fields=["id", "age", "status"]
)

print("\nQuery results (age == 18):")
for r in default_age_results:
    print(f"  id: {r['id']}, age: {r['age']}, status: {r['status']}")

# Query entities where status equals the default value ("active")
default_status_results = client.query(
    collection_name="my_collection",
    filter='status == "active"',
    output_fields=["id", "age", "status"]
)

print("\nQuery results (status == 'active'):")
for r in default_status_results:
    print(f"  id: {r['id']}, age: {r['age']}, status: {r['status']}")
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

<details>

<summary>期待される出力</summary>

```plaintext
Query results (age == 18):
  id: 2, age: 18, status: active
  id: 4, age: 18, status: inactive

Query results (status == 'active'):
  id: 2, age: 18, status: active
  id: 3, age: 25, status: active
```

</details>

## 適用されるルール\{#applicable-rules}

フィールドに対して`nullable`と`default_value`の両方が設定されている場合、挿入時にMilvusがNULL入力または欠落しているフィールド値をどのように処理するかは、以下のルールによって決定されます。

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

**主なポイント:**

- フィールドに非NULLのデフォルト値がある場合、`nullable`が有効になっているかどうかに関係なく、その値が使用されます。

- `nullable=True`だがデフォルト値が設定されていない場合、フィールドはNULLを格納します。

- `nullable=False`でデフォルト値が設定されていない場合、挿入はエラーで失敗します。

- NULL許容ではないフィールドにNULLのデフォルト値を設定することは無効であり、エラーが発生します。

