---
title: "JSON フィールドの概要 | BYOC"
slug: /json-field-overview
sidebar_key: json-field-overview
sidebar_label: "概要"
beta: FALSE
notebook: FALSE
description: "製品カタログ、コンテンツ管理システム、ユーザーの嗜好エンジンなどのアプリケーションを構築する際、ベクトル埋め込みとともに柔軟なメタデータを保存する必要があることがよくあります。製品属性はカテゴリごとに異なり、ユーザーの嗜好は時間とともに変化し、ドキュメントのプロパティは複雑な入れ子構造を持っています。Zilliz Cloud の JSON フィールドは、この課題を解決するために、パフォーマンスを犠牲にすることなく柔軟な構造化データを保存・クエリできるようにします。 | BYOC"
type: origin
token: Neq4wR0EdiXokRkhXwbcMPfanCd
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - スキーマ
  - json field
  - 概要

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# JSON フィールドの概要

商品カタログ、コンテンツ管理システム、ユーザープリファレンスエンジンなどのアプリケーションを構築する際、ベクトル埋め込みデータとともに柔軟なメタデータを保存する必要がよくあります。商品属性はカテゴリごとに異なり、ユーザーの好みは時間とともに変化し、ドキュメントのプロパティは複雑な入れ子構造を持つことがあります。Zilliz Cloud の JSON フィールドは、このような課題を解決します。柔軟な構造化データをパフォーマンスを犠牲にすることなく保存・クエリできるようにします。

## JSON フィールドとは？\{#what-is-a-json-field}

JSON フィールドとは、Zilliz Cloud におけるスキーマ定義済みのデータ型（`データType.JSON`）であり、構造化されたキー・バリュー形式のデータを格納します。従来の固定されたデータベースカラムとは異なり、JSON フィールドは入れ子になったオブジェクトや配列、複合データ型をサポートしながら、高速なクエリを実現するための複数のインデックスオプションを提供します。

JSON フィールドの構造例：

```json
{
  "metadata": { 
    "category": "electronics",
    "brand": "BrandA",
    "in_stock": true,
    "price": 99.99,
    "string_price": "99.99",
    "tags": ["clearance", "summer_sale"],
    "supplier": {
      "name": "SupplierX",
      "country": "USA",
      "contact": {
        "email": "support@supplierx.com",
        "phone": "+1-800-555-0199"
      }
    }
  }
}
```

この例では、`metadata` は単一の JSON フィールドであり、フラットな値（例: `category`、`in_stock`）、配列（`tags`）、およびネストされたオブジェクト（`supplier`）が混在しています。

<Admonition type="info" icon="📘" title="Notes">

<p><strong>命名規則:</strong> JSON キーには文字、数字、アンダースコアのみを使用してください。特殊文字、スペース、ドットはクエリでの解析問題を引き起こす可能性があるため、避けてください。</p>

</Admonition>

## JSON フィールドと動的フィールド\{#json-field-vs-dynamic-field}

よく混乱されるポイントとして、JSON フィールドと [動的フィールド](./enable-dynamic-field) の違いがあります。両方とも JSON に関連していますが、目的が異なります。

以下の表は、JSON フィールドと動的フィールドの主な違いをまとめたものです。

<table>
   <tr>
     <th><p>機能</p></th>
     <th><p>JSON フィールド</p></th>
     <th><p>動的フィールド</p></th>
   </tr>
   <tr>
     <td><p>スキーマ定義</p></td>
     <td><p>コレクションスキーマで <code>データType.JSON</code> 型として明示的に宣言する必要があるスカラーフィールド。</p></td>
     <td><p>宣言されていないフィールドを自動的に格納する隠し JSON フィールド（<code>$meta</code> という名前）。</p></td>
   </tr>
   <tr>
     <td><p>ユースケース</p></td>
     <td><p>スキーマが既知で一貫している構造化データを格納する。</p></td>
     <td><p>固定スキーマに適合しない柔軟で進化する、または半構造化のデータを格納する。</p></td>
   </tr>
   <tr>
     <td><p>制御</p></td>
     <td><p>フィールド名と構造を自分で制御する。</p></td>
     <td><p>未定義のフィールドはシステムが管理する。</p></td>
   </tr>
   <tr>
     <td><p>クエリ</p></td>
     <td><p>JSON フィールド内のフィールド名または対象キーを使用してクエリする: <code>metadata["key"]</code>。</p></td>
     <td><p>動的フィールドキーを直接使用してクエリする: <code>"dynamic_key"</code> または <code>&#36;meta</code> 経由: <code>&#36;meta["dynamic_key"]</code></p></td>
   </tr>
</table>

## 基本操作\{#basic-operations}

JSON フィールドを使用するための基本的なワークフローは、スキーマで定義し、データを挿入し、特定のフィルタ式を使用してデータをクエリすることです。

### JSON フィールドの定義\{#define-a-json-field}

JSON フィールドを使用するには、コレクション作成時にコレクションスキーマで明示的に定義します。以下の例は、`データType.JSON` 型の `metadata` フィールドを持つコレクションを作成する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

CLUSTER_ENDPOINT = "YOUR_CLUSTER_ENDPOINT"
TOKEN = "YOUR_CLUSTER_TOKEN" 

# Set up a Milvus client
client = MilvusClient(
    uri=CLUSTER_ENDPOINT,
    token=TOKEN 
)

# Create schema
schema = client.create_schema(auto_id=False, enable_dynamic_field=True)

schema.add_field(field_name="product_id", datatype=DataType.INT64, is_primary=True) # Primary field
schema.add_field(field_name="vector", datatype=DataType.FLOAT_VECTOR, dim=5) # Vector field
# Define a JSON field that allows null values
# highlight-next-line
schema.add_field(field_name="metadata", datatype=DataType.JSON, nullable=True)

client.create_collection(
    collection_name="product_catalog",
    schema=schema
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

<Admonition type="info" icon="📘" title="Notes">

<p>この例では、コレクションスキーマで定義されたJSONフィールドが <code>nullable=True</code> により NULL許容 値を許可しています。詳細については、<a href="./nullable-fields">NULL許容 & デフォルト</a> を参照してください。</p>

</Admonition>

### Insert data\{#insert-data}

コレクションが作成されたら、指定したJSONフィールドに構造化されたJSONオブジェクトを含むエンティティを挿入します。データは辞書のリストとしてフォーマットする必要があります。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
entities = [
    {
        "product_id": 1,
        "vector": [0.1, 0.2, 0.3, 0.4, 0.5],
        # highlight-start
        "metadata": { # JSON field
            "category": "electronics",
            "brand": "BrandA",
            "in_stock": True,
            "price": 99.99,
            "string_price": "99.99",
            "tags": ["clearance", "summer_sale"],
            "supplier": {
                "name": "SupplierX",
                "country": "USA",
                "contact": {
                    "email": "support@supplierx.com",
                    "phone": "+1-800-555-0199"
                }
            }
        }
        # highlight-end
    }
]

client.insert(collection_name="product_catalog", data=entities)
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

### フィルタリング操作\{#filtering-operations}

JSONフィールドに対してフィルタリング操作を実行する前に、以下の点を確認してください:

- 各ベクトルフィールドにインデックスを作成済みであること。

- コレクションがメモリにロード済みであること。

<details>

<summary>コード例を表示</summary>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
index_params = client.prepare_index_params()
index_params.add_index(
    field_name="vector",
    index_type="AUTOINDEX",
    index_name="vector_index",
    metric_type="COSINE"
)

client.create_index(collection_name="product_catalog", index_params=index_params)

client.load_collection(collection_name="product_catalog")
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

</details>

これらの要件を満たせば、JSONフィールド内の値に基づいてコレクションをフィルタリングするための以下の式を使用できます。これらのフィルター式は、特定のJSONパス構文と専用の演算子を活用します。

#### JSONパス構文によるフィルタリング\{#filtering-with-json-path-syntax}

特定のキーをクエリするには、角括弧表記を使用してJSONキーにアクセスします：`json_field_name["key"]`。ネストされたキーの場合は、それらを連鎖させます：`json_field_name["key1"]["key2"]`。

`category`が`"electronics"`であるエンティティをフィルタリングするには：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Define filter expression
filter = 'metadata["category"] == "electronics"'

client.search(
    collection_name="product_catalog",  # Collection name
    data=[[0.1, 0.2, 0.3, 0.4, 0.5]],               # Query vector (must match collection's vector dim)
    limit=5,                           # Max. number of results to return
    # highlight-next-line
    filter=filter,                    # Filter expression
    output_fields=["product_id", "metadata"]   # Fields to include in the search results
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

ネストされたキー `supplier["country"]` が `"USA"` であるエンティティをフィルタリングするには：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Define filter expression
filter = 'metadata["supplier"]["country"] == "USA"'

res = client.search(
    collection_name="product_catalog",  # Collection name
    data=[[0.1, 0.2, 0.3, 0.4, 0.5]],               # Query vector (must match collection's vector dim)
    limit=5,                           # Max. number of results to return
    # highlight-next-line
    filter=filter,                    # Filter expression
    output_fields=["product_id", "metadata"]   # Fields to include in the search results
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

#### JSON固有の演算子によるフィルター\{#filtering-with-json-specific-operators}

Zilliz Cloud は、特定の JSON フィールドキーに対して配列値をクエリするための特殊な演算子も提供しています。例:

- `json_contains(identifier, expr)`: JSON 配列内に特定の要素またはサブ配列が存在するかどうかをチェックします。

- `json_contains_all(identifier, expr)`: 指定された JSON 式のすべての要素がフィールド内に存在することを保証します。

- `json_contains_any(identifier, expr)`: JSON 式のメンバーの少なくとも 1 つがフィールド内に存在するエンティティをフィルターします。

`tags` キーの下に `"summer_sale"` 値を持つ商品を検索するには:

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Define filter expression
filter = 'json_contains(metadata["tags"], "summer_sale")'

res = client.search(
    collection_name="product_catalog",  # Collection name
    data=[[0.1, 0.2, 0.3, 0.4, 0.5]],               # Query vector (must match collection's vector dim)
    limit=5,                           # Max. number of results to return
    # highlight-next-line
    filter=filter,                    # Filter expression
    output_fields=["product_id", "metadata"]   # Fields to include in the search results
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

`tags` キーの下に `"electronics"`、`"new"`、または `"clearance"` のいずれか少なくとも 1 つの値を持つ製品を検索するには：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Define filter expression
filter = 'json_contains_any(metadata["tags"], ["electronics", "new", "clearance"])'

res = client.search(
    collection_name="product_catalog",  # Collection name
    data=[[0.1, 0.2, 0.3, 0.4, 0.5]],               # Query vector (must match collection's vector dim)
    limit=5,                           # Max. number of results to return
    # highlight-next-line
    filter=filter,                    # Filter expression
    output_fields=["product_id", "metadata"]   # Fields to include in the search results
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

JSON固有の演算子の詳細については、[JSON演算子](./json-filtering-operators) を参照してください。

## Next: JSONクエリの高速化\{#next-accelerate-json-queries}

デフォルトでは、高速化なしでJSONフィールドに対するクエリを実行すると、すべての行のフルスキャンが行われ、大規模なデータセットでは遅くなる可能性があります。JSONクエリを高速化するために、Zilliz Cloud は高度なインデックス作成とストレージ最適化機能を提供しています。

以下の表に、それらの違いと最適な使用シナリオをまとめます：

<table>
   <tr>
     <th><p>手法</p></th>
     <th><p>最適な用途</p></th>
     <th><p>配列の高速化</p></th>
     <th><p>備考</p></th>
   </tr>
   <tr>
     <td><p>JSONインデックス</p></td>
     <td><p>頻繁にアクセスされる少数のキー、特定の配列キー上の配列</p></td>
     <td><p>はい（インデックス付き配列キー上）</p></td>
     <td><p>キーを事前に選択する必要があり、スキーマが進化する場合はメンテナンスが必要</p></td>
   </tr>
   <tr>
     <td><p>JSONシュレッディング</p></td>
     <td><p>多くのキー全体の一般的な高速化、様々なクエリに柔軟に対応</p></td>
     <td><p>はい（総当たりクエリと比較して配列値をやや高速化）</p></td>
     <td><p>追加のストレージ設定、配列には引き続きキーごとのインデックスが必要</p></td>
   </tr>
   <tr>
     <td><p>NGRAMインデックス</p></td>
     <td><p>ワイルドカード検索、テキストフィールドでの部分文字列マッチング</p></td>
     <td><p>該当なし</p></td>
     <td><p>数値/範囲フィルタには非対応</p></td>
   </tr>
</table>

**ヒント:** これらのアプローチを組み合わせることができます。例えば、広範なクエリ高速化にはJSONシュレッディングを、高頻度の配列キーにはJSONインデックス作成を、柔軟なテキスト検索にはNGRAMインデックス作成を使用します。

実装の詳細については、以下を参照してください：

-  [JSONインデックス作成](./json-indexing)

- [JSONシュレッディング](./json-shredding)

- [NGRAM](./ngram-index-type)

## FAQ\{#faq}

### JSONフィールドのサイズに制限はありますか？\{#are-there-any-limitations-on-the-size-of-a-json-field}

はい。各JSONフィールドは65,536バイトに制限されています。

### JSONフィールドはデフォルト値の設定をサポートしていますか？\{#does-a-json-field-support-setting-a-default-value}

いいえ、JSONフィールドはデフォルト値をサポートしていません。ただし、フィールド定義時に `nullable=True` を設定して、空のエントリを許可することはできます。

詳細については、[NULL許容 & デフォルト](./nullable-fields) を参照してください。

### JSONフィールドのキーに命名規則はありますか？\{#are-there-any-naming-conventions-for-json-field-keys}

はい、クエリとインデックス作成との互換性を確保するために：

- JSONキーには、文字、数字、アンダースコアのみを使用してください。

- 特殊文字、スペース、ドット（`.`、`/` など）の使用は避けてください。

- 互換性のないキーは、フィルタ式の解析で問題を引き起こす可能性があります。

### Zilliz Cloud はJSONフィールドの文字列値をどのように処理しますか？\{#how-does-zilliz-cloud-handle-string-values-in-json-fields}

Zilliz Cloud は、JSON入力に表示されているとおりに文字列値を正確に保存します—意味的な変換は行われません。不適切に引用符で囲まれた文字列は、解析時にエラーが発生する可能性があります。

**有効な文字列の例**:

```plaintext
"a\"b", "a'b", "a\\b"
```

**無効な文字列の例**:

```plaintext
'a"b', 'a\'b'
```

