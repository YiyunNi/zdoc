---
title: "JSONインデックス | BYOC"
slug: /json-indexing
sidebar_key: json-indexing
sidebar_label: "インデックス作成"
beta: FALSE
notebook: FALSE
description: "JSON フィールドは、Zilliz Cloud で構造化メタデータを柔軟に保存する方法を提供します。インデックスがない場合、JSON フィールドに対するクエリはコレクション全体のスキャンが必要となり、データセットが大きくなるにつれて処理が遅くなります。JSON インデックスは、JSON データ内にインデックスを作成することで高速なルックアップを可能にします。 | BYOC"
type: origin
token: MBVVww2Zii8k6Bk77GJcXbZJnpf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - json field
  - index
  - path index
  - flat index

---

import Admonition from '@theme/Admonition';


# JSONインデックス

JSONフィールドは、Zilliz Cloud において構造化メタデータを柔軟に保存する方法を提供します。インデックスがない場合、JSONフィールドに対するクエリはコレクション全体のスキャンが必要となり、データセットが大きくなるにつれて処理が遅くなります。JSONインデックスは、JSONデータ内にインデックスを作成することで高速なルックアップを可能にします。

JSONインデックスは、以下のような場合に最適です：

- 一貫性があり、既知のキーを持つ構造化スキーマ

- 特定のJSONパスに対する等価比較および範囲クエリ

- どのキーをインデックス化するかを正確に制御する必要があるシナリオ

- 対象を絞ったクエリのストレージ効率の良い高速化

<Admonition type="info" icon="📘" title="Notes">

多様なクエリパターンを持つ複雑なJSONドキュメントの場合は、代替手段として [JSON Shredding](./json-shredding) を検討してください。

</Admonition>

## JSONインデックスの構文\{#json-indexing-syntax}

JSONインデックスを作成する際は、以下を指定します：

- **JSONパス**: インデックス化したいデータの正確な位置

- **データキャストタイプ**: インデックス化された値をどのように解釈して保存するか

- **オプションの型変換**: 必要に応じて、インデックス作成時にデータを変換する

JSONフィールドをインデックス化する構文は以下の通りです：

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
     <td><p>JSONオブジェクト内でインデックス作成したいキーへのパス。</p></td>
     <td><ul><li><p>トップレベルキー: <code>'metadata["category"]'</code></p></li><li><p>ネストされたキー: <code>'metadata["supplier"]["contact"]["email"]'</code></p></li><li><p>JSONオブジェクト全体: <code>"metadata"</code></p></li><li><p>サブオブジェクト: <code>'metadata["supplier"]'</code></p></li></ul></td>
   </tr>
   <tr>
     <td><p><code>json_cast_type</code></p></td>
     <td><p>値の解釈とインデックス作成時に使用するデータ型。キーの実際のデータ型と一致している必要があります。</p><p>利用可能なキャスト型の一覧については、<a href="./json-indexing#supported-cast-types">サポートされているキャスト型</a><a href="./json-indexing#supported-cast-types">を以下で参照</a>してください。</p></td>
     <td><p><code>"VARCHAR"</code></p></td>
   </tr>
   <tr>
     <td><p><code>json_cast_function</code></p></td>
     <td><p><strong>（オプション）</strong> インデックス作成時に元のキー値をターゲット型に変換します。この設定は、キー値が誤った形式で保存されており、インデックス作成中にデータ型を変換したい場合にのみ必要です。</p><p>利用可能なキャスト関数の一覧については、<a href="./json-indexing#supported-cast-functions">以下のサポートされているキャスト関数</a>を参照してください。</p></td>
     <td><p><code>"STRING_TO_DOUBLE"</code></p></td>
   </tr>
</table>

### サポートされているキャスト型\{#supported-cast-types}

Zilliz Cloud は、インデックス作成時のキャストに対して以下のデータ型をサポートしています。これらの型により、データが効率的なフィルタリングのために正しく解釈されることが保証されます。

<table>
   <tr>
     <th><p>キャスト型</p></th>
     <th><p>説明</p></th>
     <th><p>JSON値の例</p></th>
   </tr>
   <tr>
     <td><p><code>BOOL</code> / <code>bool</code></p></td>
     <td><p>ブール値のインデックス作成に使用され、true/false条件でフィルタリングするクエリを有効にします。</p></td>
     <td><p><code>true</code>, <code>false</code></p></td>
   </tr>
   <tr>
     <td><p><code>DOUBLE</code> / <code>double</code></p></td>
     <td><p>整数と浮動小数点数の両方を含む数値に使用されます。範囲や等価性に基づくフィルタリング（例: <code>&gt;</code>, <code>&lt;</code>, <code>==</code>）を有効にします。</p></td>
     <td><p><code>42</code>, <code>99.99</code></p></td>
   </tr>
   <tr>
     <td><p><code>VARCHAR</code> / <code>varchar</code></p></td>
     <td><p>文字列値のインデックス作成に使用され、名前、カテゴリ、IDなどのテキストベースのデータに一般的です。</p></td>
     <td><p><code>"electronics"</code>, <code>"BrandA"</code></p></td>
   </tr>
   <tr>
     <td><p><code>ARRAY_BOOL</code> / <code>array_bool</code></p></td>
     <td><p>ブール値の配列のインデックス作成に使用されます。</p></td>
     <td><p><code>[true, false, true]</code></p></td>
   </tr>
   <tr>
     <td><p><code>ARRAY_DOUBLE</code> / <code>array_double</code></p></td>
     <td><p>数値の配列のインデックス作成に使用されます。</p></td>
     <td><p><code>[1.2, 3.14, 42]</code></p></td>
   </tr>
   <tr>
     <td><p><code>ARRAY_VARCHAR</code> / <code>array_varchar</code></p></td>
     <td><p>文字列の配列のインデックス作成に使用され、タグやキーワードのリストに最適です。</p></td>
     <td><p><code>["tag1", "tag2", "tag3"]</code></p></td>
   </tr>
   <tr>
     <td><p><code>JSON</code> / <code>json</code></p></td>
     <td><p>自動型推論とフラット化によるJSONオブジェクト全体またはサブオブジェクト。</p><p>JSONオブジェクト全体のインデックス作成はインデックスサイズを増加させます。多キーのシナリオでは、<a href="./json-shredding">JSON Shredding</a>を検討してください。</p></td>
     <td><p>任意のJSONオブジェクト</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

配列は、最適なインデックス作成のために同じ型の要素を含める必要があります。詳細については、[配列フィールド](./use-array-fields)を参照してください。

</Admonition>

### サポートされているキャスト関数\{#supported-cast-functions}

JSONフィールドのキーに誤った形式の値が含まれている場合（例: 文字列として保存された数値）、キャスト関数を `json_cast_function` 引数に渡して、インデックス作成時にこれらの値を変換できます。

キャスト関数は大文字と小文字を区別しません。以下の関数がサポートされています:

<table>
   <tr>
     <th><p>キャスト関数</p></th>
     <th><p>変換元 → 変換先</p></th>
     <th><p>ユースケース</p></th>
   </tr>
   <tr>
     <td><p><code>STRING_TO_DOUBLE</code> / <code>string_to_double</code></p></td>
     <td><p>文字列 → 数値（double）</p></td>
     <td><p><code>"99.99"</code> を <code>99.99</code> に変換</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

変換に失敗した場合（例: 非数値の文字列）、その値はスキップされインデックス作成されません。

</Admonition>

## JSONインデックスの作成\{#create-json-indexes}

このセクションでは、実用的な例を使用して、さまざまなタイプのJSONデータに対するインデックス作成方法を説明します。すべての例は、以下に示すサンプルJSON構造を使用し、適切に定義されたコレクションスキーマで **MilvusClient** への接続が既に確立されていることを前提としています。

### サンプルJSON構造\{#sample-json-structure}

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

### 基本的なセットアップ\{#basic-setup}

JSONインデックスを作成する前に、インデックスパラメータを準備してください。

```python
# Prepare index params
index_params = MilvusClient.prepare_index_params()
```

### 例 1: シンプルな JSON キーのインデックス作成\{#example-1-index-a-simple-json-key}

`category` フィールドにインデックスを作成して、商品カテゴリによる高速なフィルタリングを有効化します。

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

サプライヤーの連絡先検索用に、深くネストされた `email` フィールドに対してインデックスを作成します。

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

### 例 3: インデックス作成時にデータ型を変換する\{#example-3-convert-data-type-at-index-time}

数値データが誤って文字列として保存されている場合があります。`STRING_TO_DOUBLE` キャスト関数を使用して、適切に変換およびインデックス作成します。

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

**重要**: 変換に失敗したドキュメントがある場合（例: 数値以外の文字列 `"invalid"` など）、そのドキュメントの値はインデックスから除外され、フィルタリング結果にも表示されません。

### 例 4: オブジェクト全体をインデックス化する\{#example-4-index-entire-objects}

オブジェクト内の任意のフィールドでクエリを実行できるように、完全な JSON オブジェクトをインデックス化します。`json_cast_type="JSON"` を使用すると、システムは自動的に以下を行います:

- **JSON構造をフラット化する**: ネストされたオブジェクトが効率的なインデックス化のためにフラットなパスに変換されます

- **データ型を推論する**: 各値はその内容に基づいて、数値、文字列、ブール値、または日付として自動的に分類されます

- **包括的なカバレッジを作成する**: オブジェクト内のすべてのキーとネストされたパスが検索可能になります

上記の [サンプル JSON 構造](./json-indexing#sample-json-structure) に対して、 `metadata` オブジェクト全体をインデックス化します:

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

JSON構造の一部のみをインデックスすることもできます。たとえば、すべての `supplier` 情報などです。

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

### インデックス設定の適用\{#apply-index-configuration}

すべてのインデックスパラメータを定義したら、それらをコレクションに適用します。

```python
# Apply all index configurations to the collection
MilvusClient.create_index(
    collection_name="your_collection_name",
    index_params=index_params
)
```

インデックス作成が完了すると、JSONフィールドに対するクエリは自動的にこれらのインデックスを使用し、パフォーマンスが向上します。

## FAQ\{#faq}

### クエリのフィルター式で、インデックスのキャスト型とは異なる型を使用した場合、どうなりますか？\{#what-happens-if-a-querys-filter-expression-uses-a-different-type-than-the-indexed-cast-type}

フィルター式でインデックスの `json_cast_type` とは異なる型を使用した場合、Zilliz Cloud はそのインデックスを使用せず、データの内容によってはより遅いブルートフォーススキャンにフォールバックする可能性があります。最高のパフォーマンスを得るには、常にフィルター式をインデックスのキャスト型に合わせてください。たとえば、`json_cast_type="double"` で数値インデックスを作成した場合、数値型のフィルター条件のみがインデックスを利用します。

### JSONインデックス作成時に、JSONキーのデータ型がエンティティ間で不一致だった場合はどうなりますか？\{#when-creating-a-json-index-what-if-a-json-key-has-inconsistent-data-types-across-different-entities}

データ型が不一致である場合、**部分インデックス**が発生します。たとえば、`metadata["price"]` フィールドが数値（`99.99`）と文字列（`"99.99"`）の両方で保存されており、`json_cast_type="double"` でインデックスを作成した場合、数値の値のみがインデックスされます。文字列形式のエントリはスキップされ、フィルター結果に表示されません。

### 同じJSONキーに対して複数のインデックスを作成できますか？\{#can-i-create-multiple-indexes-on-the-same-json-key}

いいえ、各JSONキーに対して作成できるインデックスは1つだけです。データに合った単一の `json_cast_type` を選択する必要があります。ただし、JSONオブジェクト全体に対してインデックスを作成しつつ、そのオブジェクト内のネストされたキーに対しても別途インデックスを作成することは可能です。