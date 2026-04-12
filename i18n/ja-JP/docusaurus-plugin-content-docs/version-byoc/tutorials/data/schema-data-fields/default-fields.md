---
title: "デフォルト値 | BYOC"
slug: /default-fields
sidebar_label: "デフォルト値"
beta: FALSE
notebook: FALSE
description: "Milvus では、スカラーフィールド（プライマリフィールドを除く）にデフォルト値を設定できます。フィールドにデフォルト値が構成されている場合、挿入時にデータが提供されていないと、Milvus が自動的にこの値を適用します。| BYOC"
type: origin
token: SsGkwyGJDirNDwk170rcHbUjnVe
sidebar_position: 15
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - デフォルト値

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# デフォルト値

Milvus では、スカラーフィールド（主キーを除く）に対してデフォルト値を設定できます。フィールドにデフォルト値が設定されている場合、データ挿入時に値が提供されない場合に Milvus が自動的にこの値を適用します。

デフォルト値を使用すると、他のデータベースシステムから Milvus へのデータ移行が簡素化され、既存のデフォルト値設定を維持できます。また、挿入時に値が不確かなフィールドに対してもデフォルト値を利用できます。

## 制限\{#limits}

- デフォルト値はスカラーフィールドのみサポートされます。主キーフィールドおよびベクトルフィールドにはデフォルト値を設定できません。

- `JSON` および `ARRAY` フィールドはデフォルト値をサポートしません。

- デフォルト値はコレクション作成時のみ設定可能で、その後変更することはできません。

## デフォルト値の設定\{#set-default-values}

コレクション作成時に、`add_field()` の `default_value` パラメータを使用してフィールドのデフォルト値を定義します。

以下の例では、デフォルト値を持つ2つのスカラーフィールド（`age` は `18`、`status` は `"active"`）を持つコレクションを作成しています。

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

データを挿入する際、デフォルト値が設定されているフィールドを省略したり、明示的に NULL を設定したりした場合、Milvus は自動的に設定されたデフォルト値を使用します。

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

デフォルト値を含むエンティティは、ベクトル検索およびスカラーによるフィルタリング中に他のエンティティと同様に動作します。`search` 操作および `query` 操作の両方で、デフォルト値によるフィルタリングが可能です。

次の例では、`age` がデフォルト値 `18` に等しいエンティティを検索します：

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

<summary>予想される出力</summary>

```plaintext
Output:
Search results (age == 18):
  id: 2, age: 18, status: active
  id: 4, age: 18, status: inactive
```

</details>

デフォルト値を直接照合してエンティティをクエリすることもできます：

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

<summary>予想される出力</summary>

```plaintext
Query results (age == 18):
  id: 2, age: 18, status: active
  id: 4, age: 18, status: inactive

Query results (status == 'active'):
  id: 2, age: 18, status: active
  id: 3, age: 25, status: active
```

</details>

## 適用ルール\{#applicable-rules}

フィールドに対して `nullable` と `default_value` の両方が設定されている場合、Milvus は挿入時に NULL 入力またはフィールド値の欠落を以下のルールに従って処理します。

<table>
   <tr>
     <th><p>NULL許容</p></th>
     <th><p>デフォルト値</p></th>
     <th><p>User Input</p></th>
     <th><p>Result</p></th>
   </tr>
   <tr>
     <td><p>✅</p></td>
     <td><p>✅ (non-NULL)</p></td>
     <td><p>NULL or omitted</p></td>
     <td><p>Uses the default value</p></td>
   </tr>
   <tr>
     <td><p>✅</p></td>
     <td><p>❌</p></td>
     <td><p>NULL or omitted</p></td>
     <td><p>Stored as NULL</p></td>
   </tr>
   <tr>
     <td><p>❌</p></td>
     <td><p>✅ (non-NULL)</p></td>
     <td><p>NULL or omitted</p></td>
     <td><p>Uses the default value</p></td>
   </tr>
   <tr>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>NULL or omitted</p></td>
     <td><p>Throws an error</p></td>
   </tr>
   <tr>
     <td><p>❌</p></td>
     <td><p>✅ (NULL)</p></td>
     <td><p>NULL or omitted</p></td>
     <td><p>Throws an error</p></td>
   </tr>
</table>

**キー takeaways:**

- フィールドに NULL でないデフォルト値が設定されている場合、`nullable` が有効かどうかに関係なくその値が使用されます。

- `nullable=True` だがデフォルト値が設定されていない場合、フィールドには NULL が格納されます。

- `nullable=False` かつデフォルト値が設定されていない場合、挿入時にエラーが発生します。

- NULL 許容でないフィールドに NULL のデフォルト値を設定することは無効であり、エラーが発生します。

