---
title: "JSONインデックス | BYOC"
slug: /json-indexing
sidebar_label: "JSONインデックス"
beta: FALSE
notebook: FALSE
description: "JSONフィールドは、Zilliz Cloudに構造化されたメタデータを保存するための柔軟な方法を提供します。インデックスがない場合、JSONフィールドに対するクエリはコレクション全体のスキャンを必要とし、データセットが大きくなるにつれて遅くなります。JSONインデックスは、JSONデータ内にインデックスを作成することで、高速なルックアップを可能にします。 | BYOC"
type: origin
token: MBVVww2Zii8k6Bk77GJcXbZJnpf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - コレクション
  - スキーマ
  - JSONフィールド
  - インデックス
  - パスインデックス
  - フラットインデックス
  - ハイブリッドベクトル検索
  - 動画の重複排除
  - 動画類似性検索
  - ベクトル検索

---

import Admonition from '@theme/Admonition';


# JSONインデックス

JSONフィールドは、Zilliz Cloudに構造化されたメタデータを保存するための柔軟な方法を提供します。インデックスなしでは、JSONフィールドに対するクエリはコレクション全体のスキャンを必要とし、データセットが大きくなるにつれて遅くなります。JSONインデックスは、JSONデータ内にインデックスを作成することで、高速なルックアップを可能にします。

JSONインデックスは、以下の用途に最適です。

- 一貫性のある既知のキーを持つ構造化スキーマ

- 特定のJSONパスに対する等価クエリおよび範囲クエリ

- インデックスを作成するキーを正確に制御する必要があるシナリオ

- ターゲットを絞ったクエリのストレージ効率の良い高速化

<Admonition type="info" icon="📘" title="Notes">

<p>多様なクエリパターンを持つ複雑なJSONドキュメントの場合、代替として<a href="./json-shredding">JSON Shredding</a>を検討してください。</p>

</Admonition>

## JSONインデックスの構文{#json-indexing-syntax}

JSONインデックスを作成する際には、以下を指定します。

- **JSONパス**: インデックスを作成するデータの正確な場所

- **データキャストタイプ**: インデックス付きの値をどのように解釈し、保存するか

- **オプションの型変換**: 必要に応じて、インデックス作成中にデータを変換する

JSONフィールドをインデックスするための構文は次のとおりです。

```python
# Prepare index params
index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name="<json_field_name>",  # Name of the JSON field
    index_type="AUTOINDEX",  # Must be AUTOINDEX
    index_name="<unique_index_name>",  # Index name
    params={
        "json_path": "<path_to_json_key>",  # Specific key to be indexed within JSON data
        "json_cast_type": "<data_type>",  # Data type to use when interpreting and indexing the value
        # "json_cast_function": "<cast_function>"  # Optional: convert key values into a target type at index time
    }
)
```

<table>
   <tr>
     <th><p>パラメータ</p></th>
     <th><p>説明</p></th>
     <th><p>値 / 例</p></th>
   </tr>
   <tr>
     <td><p><code>field_name</code></p></td>
     <td><p>コレクションスキーマ内のJSONフィールドの名前。</p></td>
     <td><p><code>"metadata"</code></p></td>
   </tr>
   <tr>
     <td><p><code>index_type</code></p></td>
     <td><p>JSONインデックスの場合、<code>"AUTOINDEX"</code>である必要があります。</p></td>
     <td><p><code>"AUTOINDEX"</code></p></td>
   </tr>
   <tr>
     <td><p><code>index_name</code></p></td>
     <td><p>このインデックスの一意の識別子。</p></td>
     <td><p><code>"category_index"</code></p></td>
   </tr>
   <tr>
     <td><p><code>json_path</code></p></td>
     <td><p>JSONオブジェクト内でインデックスを作成したいキーへのパス。</p></td>
     <td><ul><li><p>トップレベルキー: <code>'metadata["category"]'</code></p></li><li><p>ネストされたキー: <code>'metadata["supplier"]["contact"]["email"]'</code></p></li><li><p>JSONオブジェクト全体: <code>"metadata"</code></p></li><li><p>サブオブジェクト: <code>'metadata["supplier"]'</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><code>json_cast_type</code></p></td>
     <td><p>値を解釈およびインデックス化する際に使用するデータ型。キーの実際のデータ型と一致する必要があります。</p><p>利用可能なキャストタイプのリストについては、<a href="./json-indexing#supported-cast-types">サポートされているキャストタイプ</a>を参照してください。</p></td>
     <td><p><code>"VARCHAR"</code></p></td>
   </tr>
   <tr>
     <td><p><code>json_cast_function</code></p></td>
     <td><p><strong>(オプション)</strong> インデックス作成時に元のキー値をターゲットタイプに変換します。この設定は、キー値が誤った形式で保存されており、インデックス作成時にデータ型を変換したい場合にのみ必要です。</p><p>利用可能なキャスト関数のリストについては、<a href="./json-indexing#supported-cast-functions">サポートされているキャスト関数</a>を参照してください。</p></td>
     <td><p><code>"STRING_TO_DOUBLE"</code></p></td>
   </tr>
</table>

### サポートされているキャストタイプ{#supported-cast-types}

Zilliz Cloudは、インデックス作成時のキャストに以下のデータ型をサポートしています。これらの型は、効率的なフィルタリングのためにデータが正しく解釈されることを保証します。

<table>
   <tr>
     <th><p>キャストタイプ</p></th>
     <th><p>説明</p></th>
     <th><p>JSON値の例</p></th>
   </tr>
   <tr>
     <td><p><code>BOOL</code> / <code>bool</code></p></td>
     <td><p>ブール値をインデックス化するために使用され、true/false条件でフィルタリングするクエリを可能にします。</p></td>
     <td><p><code>true</code>, <code>false</code></p></td>
   </tr>
   <tr>
     <td><p><code>DOUBLE</code> / <code>double</code></p></td>
     <td><p>整数と浮動小数点数の両方を含む数値に使用されます。範囲または等価性に基づくフィルタリング（例: <code>&gt;</code>, <code>&lt;</code>, <code>==</code>）を可能にします。</p></td>
     <td><p><code>42</code>, <code>99.99</code></p></td>
   </tr>
   <tr>
     <td><p><code>VARCHAR</code> / <code>varchar</code></p></td>
     <td><p>文字列値をインデックス化するために使用され、名前、カテゴリ、IDなどのテキストベースのデータによく使用されます。</p></td>
     <td><p><code>"electronics"</code>, <code>"BrandA"</code></p></td>
   </tr>
   <tr>
     <td><p><code>ARRAY_BOOL</code> / <code>array_bool</code></p></td>
     <td><p>ブール値の配列をインデックス化するために使用されます。</p></td>
     <td><p><code>[true, false, true]</code></p></td>
   </tr>
   <tr>
     <td><p><code>ARRAY_DOUBLE</code> / <code>array_double</code></p></td>
     <td><p>数値の配列をインデックス化するために使用されます。</p></td>
     <td><p><code>[1.2, 3.14, 42]</code></p></td>
   </tr>
   <tr>
     <td><p><code>ARRAY_VARCHAR</code> / <code>array_varchar</code></p></td>
     <td><p>文字列の配列をインデックス化するために使用され、タグやキーワードのリストに最適です。</p></td>
     <td><p><code>["tag1", "tag2", "tag3"]</code></p></td>
   </tr>
   <tr>
     <td><p><code>JSON</code> / <code>json</code></p></td>
     <td><p>自動型推論とフラット化を備えたJSONオブジェクト全体またはサブオブジェクト。</p><p>JSONオブジェクト全体をインデックス化すると、インデックスサイズが増加します。多くのキーがあるシナリオでは、<a href="./json-shredding">JSON Shredding</a>を検討してください。</p></td>
     <td><p>任意のJSONオブジェクト</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>最適なインデックス作成のためには、配列は同じ型の要素を含む必要があります。詳細については、<a href="./use-array-fields">配列フィールド</a>を参照してください。</p>

</Admonition>

### サポートされているキャスト関数{#supported-cast-functions}

JSONフィールドキーに誤った形式の値が含まれている場合（例: 文字列として保存された数値）、`json_cast_function`引数にキャスト関数を渡すことで、インデックス作成時にこれらの値を変換できます。

キャスト関数は大文字と小文字を区別しません。以下の関数がサポートされています。

<table>
   <tr>
     <th><p>キャスト関数</p></th>
     <th><p>変換元 → 変換先</p></th>
     <th><p>ユースケース</p></th>
   </tr>
   <tr>
     <td><p><code>STRING_TO_DOUBLE</code> / <code>string_to_double</code></p></td>
     <td><p>文字列 → 数値 (double)</p></td>
     <td><p><code>"99.99"</code>を<code>99.99</code>に変換</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>変換が失敗した場合（例: 非数値文字列）、値はスキップされ、インデックス化されません。</p>

</Admonition>

## JSONインデックスの作成{#create-json-indexes}

このセクションでは、実用的な例を使用して、さまざまな種類のJSONデータにインデックスを作成する方法を説明します。すべての例は、以下に示すサンプルJSON構造を使用しており、適切に定義されたコレクションスキーマを持つ**MilvusClient**への接続がすでに確立されていることを前提としています。

### サンプルJSON構造{#sample-json-structure}

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

### 基本的なセットアップ{#basic-setup}

JSON インデックスを作成する前に、インデックスのパラメータを準備します。

```python
# Prepare index params
index_params = MilvusClient.prepare_index_params()
```

### 例 1: 単純な JSON キーのインデックス作成{#example-1-index-a-simple-json-key}

`category` フィールドにインデックスを作成して、製品カテゴリによる高速フィルタリングを可能にします。

```python
index_params.add_index(
    field_name="metadata",
    # highlight-next-line
    index_type="AUTOINDEX", # Must be set to AUTOINDEX for JSON path indexing
    index_name="category_index",  # Unique index name
    # highlight-start
    params={
        "json_path": 'metadata["category"]', # Path to the JSON key
        "json_cast_type": "varchar" # Data cast type
    }
    # highlight-end
)
```

### 例 2: ネストされたキーのインデックス作成\{#example-2-index-a-nested-key}

サプライヤーの連絡先検索のために、深くネストされた `email` フィールドにインデックスを作成します。

```python
# Index the nested key
index_params.add_index(
    field_name="metadata",
    # highlight-next-line
    index_type="AUTOINDEX", # Must be set to AUTOINDEX for JSON path indexing
    index_name="email_index", # Unique index name
    # highlight-start
    params={
        "json_path": 'metadata["supplier"]["contact"]["email"]', # Path to the nested JSON key
        "json_cast_type": "varchar" # Data cast type
    }
    # highlight-end
)
```

### 例 3: インデックス作成時にデータ型を変換する{#example-3-convert-data-type-at-index-time}

数値データが誤って文字列として保存されることがあります。`STRING_TO_DOUBLE` キャスト関数を使用して、適切に変換してインデックスを作成します。

```python
# Convert string numbers to double for indexing
index_params.add_index(
    field_name="metadata",
    # highlight-next-line
    index_type="AUTOINDEX", # Must be set to AUTOINDEX for JSON path indexing
    index_name="string_to_double_index", # Unique index name
    params={
        "json_path": 'metadata["string_price"]', # Path to the JSON key to be indexed
        "json_cast_type": "double", # Data cast type
        # highlight-next-line
        "json_cast_function": "STRING_TO_DOUBLE" # Cast function; case insensitive
    }
)
```

**重要**: ドキュメントの変換が失敗した場合（例: `"invalid"`のような非数値文字列）、そのドキュメントの値はインデックスから除外され、フィルタリングされた結果には表示されません。

### 例4: オブジェクト全体をインデックスする{#example-4-index-entire-objects}

JSONオブジェクト全体をインデックスして、その中の任意のフィールドでクエリを可能にします。`json_cast_type="JSON"`を使用すると、システムは自動的に次の処理を行います。

- **JSON構造をフラット化**: ネストされたオブジェクトは、効率的なインデックス作成のためにフラットなパスに変換されます。

- **データ型を推論**: 各値は、その内容に基づいて数値、文字列、ブール値、または日付として自動的に分類されます。

- **包括的なカバレッジを作成**: オブジェクト内のすべてのキーとネストされたパスが検索可能になります。

上記の[サンプルJSON構造](./json-indexing#sample-json-structure)について、`metadata`オブジェクト全体をインデックスします。

```python
# Index the entire JSON object
index_params.add_index(
    field_name="metadata",
    index_type="AUTOINDEX",
    index_name="metadata_full_index",
    params={
        # highlight-start
        "json_path": "metadata",
        "json_cast_type": "JSON"
        # highlight-end
    }
)
```

JSON構造の一部のみをインデックス化することもできます。例えば、すべての`supplier`情報などです。

```python
# Index a sub-object
index_params.add_index(
    field_name="metadata",
    index_type="AUTOINDEX", 
    index_name="supplier_index",
    params={
        # highlight-start
        "json_path": 'metadata["supplier"]',
        "json_cast_type": "JSON"
        # highlight-end
    }
)
```

### インデックス設定の適用{#apply-index-configuration}

すべてのインデックスパラメータを定義したら、それらをコレクションに適用します。

```python
# Apply all index configurations to the collection
MilvusClient.create_index(
    collection_name="your_collection_name",
    index_params=index_params
)
```

インデックス作成が完了すると、JSONフィールドクエリはこれらのインデックスを自動的に使用し、パフォーマンスが向上します。

## FAQ\{#faq}

### クエリのフィルター式が、インデックス付きキャストタイプとは異なるタイプを使用している場合はどうなりますか？\{#what-happens-if-a-querys-filter-expression-uses-a-different-type-than-the-indexed-cast-type}

フィルター式がインデックスの `json_cast_type` と異なるタイプを使用している場合、Zilliz Cloud はインデックスを使用せず、データが許せばより遅いブルートフォーススキャンにフォールバックする可能性があります。最高のパフォーマンスを得るには、常にフィルター式をインデックスのキャストタイプに合わせるようにしてください。たとえば、`json_cast_type="double"` で数値インデックスが作成された場合、数値フィルター条件のみがインデックスを活用します。

### JSON インデックスを作成する際、JSON キーが異なるエンティティ間で一貫性のないデータ型を持っている場合はどうなりますか？\{#when-creating-a-json-index-what-if-a-json-key-has-inconsistent-data-types-across-different-entities}

型が不整合だと、**部分的なインデックス作成**につながる可能性があります。たとえば、`metadata["price"]` フィールドが数値 (`99.99`) と文字列 (`"99.99"`) の両方として保存されており、`json_cast_type="double"` でインデックスを作成した場合、数値のみがインデックス化されます。文字列形式のエントリはスキップされ、フィルター結果には表示されません。

### 同じ JSON キーに複数のインデックスを作成できますか？\{#can-i-create-multiple-indexes-on-the-same-json-key}

いいえ、各 JSON キーは1つのインデックスのみをサポートします。データに一致する単一の `json_cast_type` を選択する必要があります。ただし、JSON オブジェクト全体にインデックスを作成したり、そのオブジェクト内のネストされたキーにインデックスを作成したりすることはできます。