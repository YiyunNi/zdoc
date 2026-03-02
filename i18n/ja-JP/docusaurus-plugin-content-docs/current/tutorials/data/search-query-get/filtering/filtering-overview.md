---
title: "フィルタリングの説明 | Cloud"
slug: /filtering-overview
sidebar_label: "フィルタリングの説明"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、データの正確なクエリを可能にする強力なフィルタリング機能を提供します。フィルター式を使用すると、特定のスカラフィールドをターゲットにし、さまざまな条件で検索結果を絞り込むことができます。このガイドでは、Zilliz Cloudクラスターでフィルター式を使用する方法を、クエリ操作に焦点を当てた例とともに説明します。これらのフィルターは、検索および削除リクエストにも適用できます。 | Cloud"
type: origin
token: AIb1wNAE3iiKVSk8MHAcVA4QnJb
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - データ
  - フィルター
  - フィルタリング式
  - フィルタリング
  - knnアルゴリズム
  - HNSW
  - 非構造化データとは
  - ベクトル埋め込み

---

import Admonition from '@theme/Admonition';


# フィルタリングの説明

Zilliz Cloud は、データの正確なクエリを可能にする強力なフィルタリング機能を提供します。フィルター式を使用すると、特定のスカラフィールドをターゲットにし、さまざまな条件で検索結果を絞り込むことができます。このガイドでは、Zilliz Cloud クラスターでフィルター式を使用する方法を説明し、クエリ操作に焦点を当てた例を示します。これらのフィルターは、検索および削除リクエストにも適用できます。

## 基本演算子{#basic-operators}

Zilliz Cloud は、データをフィルタリングするためのいくつかの基本演算子をサポートしています。

- **比較演算子**: `==`、`!=`、`>`、`<`、`>=`、および `<=` は、数値フィールドまたはテキストフィールドに基づいてフィルタリングできます。

- **範囲フィルター**: `IN` および `LIKE` は、特定の値の範囲またはセットを照合するのに役立ちます。

- **算術演算子**: `+`、`-`、`*`、`/`、`%`、および `**` は、数値フィールドを含む計算に使用されます。

- **論理演算子**: `AND`、`OR`、および `NOT` は、複数の条件を複雑な式に結合します。

- **IS NULL および IS NOT NULL 演算子**: `IS NULL` および `IS NOT NULL` 演算子は、フィールドに null 値 (データがないこと) が含まれているかどうかに基づいてフィールドをフィルタリングするために使用されます。詳細については、[基本演算子](./basic-filtering-operators#is-null-and-is-not-null-operators)を参照してください。

### 例: 色によるフィルタリング{#example-filtering-by-color}

スカラフィールド `color` で原色 (赤、緑、または青) を持つエンティティを見つけるには、次のフィルター式を使用します。

```python
filter='color in ["red", "green", "blue"]'
```

### 例: JSONフィールドのフィルタリング{#example-filtering-json-fields}

Zilliz Cloudでは、JSONフィールド内のキーを参照できます。例えば、`price`と`model`というキーを持つ`product`というJSONフィールドがあり、特定のモデルで価格が1,850未満の製品を見つけたい場合、以下のフィルタ式を使用します。

```python
filter='product["model"] == "JSN-087" AND product["price"] < 1850'
```

### 例: 配列フィールドのフィルタリング{#example-filtering-array-fields}

2000年以降に観測所から報告された平均気温の記録を含む配列フィールド `history_temperatures` があり、2009年の気温（10番目に記録された）が23°Cを超える観測所を見つけたい場合は、次の式を使用します。

```python
filter='history_temperatures[10] > 23'
```

これらの基本的な演算子の詳細については、[基本的なフィルタリング演算子](./basic-filtering-operators)を参照してください。

## フィルター式テンプレート{#filter-expression-templates}

CJK文字を使用してフィルタリングする場合、文字セットが大きくエンコーディングの違いがあるため、処理がより複雑になることがあります。これにより、特に`IN`演算子を使用した場合にパフォーマンスが低下する可能性があります。

Zilliz Cloudは、CJK文字を扱う際のパフォーマンスを最適化するために、フィルター式テンプレートを導入しています。動的な値をフィルター式から分離することで、クエリエンジンはパラメータの挿入をより効率的に処理します。

### 例{#example}

25歳以上で「北京」または「上海」に住んでいる個人を見つけるには、次のテンプレート式を使用します。

```python
filter = "age > 25 AND city IN ['北京', '上海']"
```

パフォーマンスを向上させるには、パラメータを持つこのバリエーションを使用します。

```python
filter = "age > {age} AND city in {city}",
filter_params = {"age": 25, "city": ["北京", "上海"]}
```

このアプローチにより、パースのオーバーヘッドが削減され、クエリ速度が向上します。詳細については、[フィルタリングテンプレート](./filtering-templating)を参照してください。

## データ型固有の演算子{#data-type-specific-operators}

Zilliz Cloudは、JSON、ARRAY、VARCHARフィールドなど、特定のデータ型に対して高度なフィルタリング演算子を提供します。

### JSONフィールド固有の演算子{#json-field-specific-operators}

Zilliz Cloudは、JSONフィールドをクエリするための高度な演算子を提供し、複雑なJSON構造内で正確なフィルタリングを可能にします。

**JSON_CONTAINS(identifier, jsonExpr)**: JSON式がフィールドに存在するかどうかをチェックします。

```python
# JSON data: {"tags": ["electronics", "sale", "new"]}
filter='json_contains(tags, "sale")'
```

**JSON_CONTAINS_ALL(identifier, jsonExpr)**: JSON 式のすべての要素が存在することを確認します。

```python
# JSON data: {"tags": ["electronics", "sale", "new", "discount"]}
filter='json_contains_all(tags, ["electronics", "sale", "new"])'
```

**JSON_CONTAINS_ANY(identifier, jsonExpr)**: JSON 式に少なくとも 1 つの要素が存在するエンティティをフィルタリングします。

```python
# JSON data: {"tags": ["electronics", "sale", "new"]}
filter='json_contains_any(tags, ["electronics", "new", "clearance"])'
```

JSON オペレーターの詳細については、[JSON オペレーター](./json-filtering-operators)を参照してください。

### ARRAY フィールド固有のオペレーター{#array-field-specific-operators}

Zilliz Cloud は、`ARRAY_CONTAINS`、`ARRAY_CONTAINS_ALL`、`ARRAY_CONTAINS_ANY`、`ARRAY_LENGTH` など、array フィールド用の高度なフィルタリングオペレーターを提供しており、array データをきめ細かく制御できます。

**ARRAY_CONTAINS**: 特定の要素を含む entity をフィルタリングします。

```python
filter="ARRAY_CONTAINS(history_temperatures, 23)"
```

**ARRAY_CONTAINS_ALL**: リスト内のすべての要素が存在するエンティティをフィルタリングします。

```python
filter="ARRAY_CONTAINS_ALL(history_temperatures, [23, 24])"
```

**ARRAY_CONTAINS_ANY**: リスト内のいずれかの要素を含むエンティティをフィルタリングします。

```python
filter="ARRAY_CONTAINS_ANY(history_temperatures, [23, 24])"
```

**ARRAY_LENGTH**: 配列の長さに基づいてフィルタリングします。

```python
filter="ARRAY_LENGTH(history_temperatures) < 10"
```

配列演算子の詳細については、[配列演算子](./array-filtering-operators)を参照してください。

### VARCHARフィールド固有の演算子{#varchar-field-specific-operators}

Zilliz Cloudは、VARCHARフィールドでの正確なテキストベースの検索のために、特殊な演算子を提供します。

#### `TEXT_MATCH`演算子{#textmatch-operator}

`TEXT_MATCH`演算子を使用すると、特定のクエリ用語に基づいて正確なドキュメント検索が可能です。これは、スカラーフィルターとベクトル類似性検索を組み合わせたフィルター検索に特に役立ちます。セマンティック検索とは異なり、Text Matchは正確な用語の出現に焦点を当てています。

Zilliz Cloudは、Tantivyを使用して転置インデックスと用語ベースのテキスト検索をサポートしています。このプロセスには以下が含まれます。

1. **Analyzer**: 入力テキストをトークン化して処理します。

1. **Indexing**: 一意のトークンをドキュメントにマッピングする転置インデックスを作成します。

詳細については、[Text Match](./text-match)を参照してください。

