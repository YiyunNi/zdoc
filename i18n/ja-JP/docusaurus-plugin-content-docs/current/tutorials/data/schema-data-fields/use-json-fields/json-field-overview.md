---
title: "JSONフィールドの概要 | Cloud"
slug: /json-field-overview
sidebar_label: "JSONフィールドの概要"
beta: FALSE
notebook: FALSE
description: "製品カタログ、コンテンツ管理システム、ユーザー嗜好エンジンなどのアプリケーションを構築する際、ベクトル埋め込みと並行して柔軟なメタデータを保存する必要があることがよくあります。製品属性はカテゴリによって異なり、ユーザーの嗜好は時間とともに変化し、ドキュメントのプロパティは複雑なネストされた構造を持っています。Zilliz CloudのJSONフィールドは、パフォーマンスを犠牲にすることなく、柔軟な構造化データを保存およびクエリできるようにすることで、この課題を解決します。 | Cloud"
type: origin
token: Neq4wR0EdiXokRkhXwbcMPfanCd
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - collection
  - schema
  - jsonフィールド
  - 概要
  - rag llmアーキテクチャ
  - プライベートllms
  - nn検索
  - llm評価

---

import Admonition from '@theme/Admonition';


# JSONフィールドの概要

製品カタログ、コンテンツ管理システム、ユーザー設定エンジンなどのアプリケーションを構築する際、ベクトル埋め込みと並行して柔軟なメタデータを保存する必要があることがよくあります。製品属性はカテゴリによって異なり、ユーザー設定は時間とともに変化し、ドキュメントプロパティは複雑なネストされた構造を持っています。Zilliz CloudのJSONフィールドは、パフォーマンスを犠牲にすることなく、柔軟な構造化データを保存およびクエリできるようにすることで、この課題を解決します。

## JSONフィールドとは？{#what-is-a-json-field}

JSONフィールドは、Zilliz Cloudにおけるスキーマ定義されたデータ型（`DataType.JSON`）であり、構造化されたキーと値のデータを保存します。従来の厳格なデータベース列とは異なり、JSONフィールドはネストされたオブジェクト、配列、および混合データ型に対応し、高速なクエリのための複数のインデックスオプションを提供します。

JSONフィールド構造の例：

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

この例では、`metadata` は、フラットな値（例: `category`、`in_stock`）、配列（`tags`）、およびネストされたオブジェクト（`supplier`）が混在する単一の JSON フィールドです。

<Admonition type="info" icon="📘" title="Notes">

<p><strong>命名規則:</strong> JSON キーには、文字、数字、アンダースコアのみを使用してください。特殊文字、スペース、ドットは、クエリで解析の問題を引き起こす可能性があるため避けてください。</p>

</Admonition>

## JSON フィールド vs. dynamic field{#json-field-vs-dynamic-field}

JSON フィールドと [dynamic field](./enable-dynamic-field) の違いは、よく混同される点です。どちらも JSON に関連していますが、異なる目的を果たします。

以下の表は、JSON フィールドと dynamic field の主な違いをまとめたものです。

<table>
   <tr>
     <th><p>機能</p></th>
     <th><p>JSON フィールド</p></th>
     <th><p>Dynamic Field</p></th>
   </tr>
   <tr>
     <td><p>schema 定義</p></td>
     <td><p><code>DataType.JSON</code> 型で collection schema に明示的に宣言する必要があるスカラー フィールド。</p></td>
     <td><p>未宣言のフィールドを自動的に保存する隠し JSON フィールド（<code>$meta</code> という名前）。</p></td>
   </tr>
   <tr>
     <td><p>ユースケース</p></td>
     <td><p>schema が既知で一貫性のある構造化データを保存します。</p></td>
     <td><p>固定 schema に収まらない、柔軟で進化する、または半構造化データを保存します。</p></td>
   </tr>
   <tr>
     <td><p>制御</p></td>
     <td><p>フィールド名と構造を制御します。</p></td>
     <td><p>未定義のフィールドに対してシステムが管理します。</p></td>
   </tr>
   <tr>
     <td><p>クエリ</p></td>
     <td><p>フィールド名または JSON フィールド内のターゲット キーを使用してクエリを実行します: <code>metadata["key"]</code>。</p></td>
     <td><p>dynamic field キーを直接使用してクエリを実行します: <code>"dynamic_key"</code> または <code>$meta</code> を介して: <code>$meta["dynamic_key"]</code></p></td>
   </tr>
</table>

## 基本操作{#basic-operations}

JSON フィールドを使用するための基本的なワークフローは、schema で定義し、データを挿入し、特定のフィルター式を使用してデータをクエリすることです。

### JSON フィールドの定義{#define-a-json-field}

JSON フィールドを使用するには、collection を作成する際に collection schema で明示的に定義します。次の例は、`DataType.JSON` 型の `metadata` フィールドを持つ collection を作成する方法を示しています。

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

<Admonition type="info" icon="📘" title="Notes">

<p>この例では、collection schema で定義された JSON フィールドは <code>nullable=True</code> で null 値を許可しています。詳細については、<a href="./nullable-and-default">Nullable & Default</a> を参照してください。</p>

</Admonition>

### データの挿入{#insert-data}

collection が作成されたら、指定された JSON フィールドに構造化された JSON オブジェクトを含むエンティティを挿入します。データは辞書のリストとしてフォーマットする必要があります。

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

### フィルタリング操作\{#filtering-operations}

JSONフィールドでフィルタリング操作を実行する前に、以下を確認してください。

- 各ベクトルフィールドにインデックスを作成していること。

- コレクションがメモリにロードされていること。

<details>

<summary>コード例を表示</summary>

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

</details>

これらの要件が満たされると、以下の式を使用して、JSONフィールド内の値に基づいてコレクションをフィルタリングできます。これらのフィルター式は、特定のJSONパス構文と専用の演算子を活用します。

#### JSONパス構文によるフィルタリング{#filtering-with-json-path-syntax}

特定のキーをクエリするには、ブラケット表記を使用してJSONキーにアクセスします: `json_field_name["key"]`。ネストされたキーの場合は、それらを連結します: `json_field_name["key1"]["key2"]`。

`category`が`"electronics"`であるエンティティをフィルタリングするには:

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

ネストされたキー `supplier["country"]` が `"USA"` であるエンティティをフィルタリングするには：

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

#### JSON固有の演算子によるフィルタリング{#filtering-with-json-specific-operators}

Zilliz Cloudは、特定のJSONフィールドキーの配列値をクエリするための特別な演算子も提供しています。例：

- `json_contains(identifier, expr)`: 特定の要素またはサブ配列がJSON配列内に存在するかどうかを確認します。

- `json_contains_all(identifier, expr)`: 指定されたJSON式のすべての要素がフィールドに存在することを確認します。

- `json_contains_any(identifier, expr)`: JSON式の少なくとも1つのメンバーがフィールド内に存在するエンティティをフィルタリングします。

`tags`キーの下に`"summer_sale"`値を持つ製品を見つけるには：

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

`tags` キーに `"electronics"`, `"new"`, `"clearance"` のいずれかの値を持つ製品を見つけるには、次のようにします。

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

JSON固有の演算子の詳細については、[JSON演算子](./json-filtering-operators)を参照してください。

## 次に: JSONクエリを高速化する{#next-accelerate-json-queries}

デフォルトでは、高速化されていないJSONフィールドに対するクエリは、すべての行をフルスキャンするため、大規模なデータセットでは遅くなる可能性があります。JSONクエリを高速化するために、Zilliz Cloudは高度なインデックス作成とストレージ最適化機能を提供します。

以下の表は、それらの違いと最適な使用シナリオをまとめたものです。

<table>
   <tr>
     <th><p>手法</p></th>
     <th><p>最適な用途</p></th>
     <th><p>配列の高速化</p></th>
     <th><p>備考</p></th>
   </tr>
   <tr>
     <td><p>JSONインデックス作成</p></td>
     <td><p>頻繁にアクセスされるキーの小さなセット、特定の配列キー上の配列</p></td>
     <td><p>はい (インデックス付き配列キー上)</p></td>
     <td><p>キーを事前に選択する必要があり、スキーマが進化する場合はメンテナンスが必要</p></td>
   </tr>
   <tr>
     <td><p>JSONシュレッディング</p></td>
     <td><p>多くのキーにわたる一般的な高速化、多様なクエリに柔軟に対応</p></td>
     <td><p>はい (ブルートフォースクエリと比較して配列値をわずかに高速化)</p></td>
     <td><p>追加のストレージ設定、配列には依然としてキーごとのインデックスが必要</p></td>
   </tr>
   <tr>
     <td><p>NGRAMインデックス</p></td>
     <td><p>ワイルドカード検索、テキストフィールドでの部分文字列マッチング</p></td>
     <td><p>N/A</p></td>
     <td><p>数値/範囲フィルターには不向き</p></td>
   </tr>
</table>

**ヒント:** これらのアプローチを組み合わせることができます。たとえば、広範なクエリ高速化にはJSONシュレッディング、高頻度配列キーにはJSONインデックス作成、柔軟なテキスト検索にはNGRAMインデックス作成を使用します。

実装の詳細については、以下を参照してください。

- [JSONインデックス作成](./json-indexing)

- [JSONシュレッディング](./json-shredding)

- [NGRAM](./ngram-index-type)

## FAQ{#faq}

### JSONフィールドのサイズに制限はありますか？{#are-there-any-limitations-on-the-size-of-a-json-field}

はい。各JSONフィールドは65,536バイトに制限されています。

### JSONフィールドはデフォルト値の設定をサポートしていますか？{#does-a-json-field-support-setting-a-default-value}

いいえ、JSONフィールドはデフォルト値をサポートしていません。ただし、フィールドを定義する際に`nullable=True`を設定することで、空のエントリを許可できます。

詳細については、[Nullable & Default](./nullable-and-default)を参照してください。

### JSONフィールドのキーに命名規則はありますか？{#are-there-any-naming-conventions-for-json-field-keys}

はい、クエリとインデックス作成との互換性を確保するために、以下の点に注意してください。

- JSONキーには、文字、数字、アンダースコアのみを使用してください。

- 特殊文字、スペース、ドット（`.`、`/`など）の使用は避けてください。

- 互換性のないキーは、フィルター式で解析の問題を引き起こす可能性があります。

### Zilliz CloudはJSONフィールドの文字列値をどのように処理しますか？{#how-does-zilliz-cloud-handle-string-values-in-json-fields}

Zilliz Cloudは、JSON入力に表示される文字列値を、意味的な変換なしにそのまま保存します。不適切に引用された文字列は、解析中にエラーを引き起こす可能性があります。

**有効な文字列の例**:

```plaintext
"a\"b", "a'b", "a\\b"
```

**無効な文字列の例**:

```plaintext
'a"b', 'a\'b'
```

