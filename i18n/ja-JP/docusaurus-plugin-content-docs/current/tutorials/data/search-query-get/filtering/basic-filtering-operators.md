---
title: "基本演算子 | Cloud"
slug: /basic-filtering-operators
sidebar_key: basic-filtering-operators
sidebar_label: "基本"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、データを効率的にフィルタリングおよびクエリするための豊富な基本演算子を提供しています。これらの演算子を使用すると、スカラーフィールド、数値計算、論理条件などに基づいて検索条件を絞り込むことができます。これらの演算子の使用方法を理解することは、正確なクエリを構築し、検索の効率を最大化するために不可欠です。"
type: origin
token: LBbUwOGcwi1UMak3eE2cM1gvnUe
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - データ
  - フィルタ
  - フィルタリング式
  - フィルタリング
  - 基本演算子

---

import Admonition from '@theme/Admonition';


# 基本演算子

Zilliz Cloud は、データを効率的にフィルタリングおよびクエリするための豊富な基本演算子を提供します。これらの演算子を使用すると、スカラーフィールド、数値計算、論理条件などに基づいて検索条件を絞り込むことができます。これらの演算子の使い方を理解することは、正確なクエリを構築し、検索の効率を最大化するために不可欠です。

## 比較演算子\{#comparison-operators}

比較演算子は、等価性、非等価性、または大小関係に基づいてデータをフィルタリングするために使用されます。これらは数値フィールドおよびテキストフィールドに適用できます。

### サポートされている比較演算子:\{#supported-comparison-operators}

- `==` (等しい)

- `!=` (等しくない)

- `>` (より大きい)

- `<` (より小さい)

- `>=` (以上)

- `<=` (以下)

### 例1: 等号 (`==`) を使ったフィルタリング\{#example-1-filtering-with-equal-to}

`status` という名前のフィールドがあり、`status` が "active" であるすべてのエンティティを検索したいとします。この場合、等号演算子 `==` を使用できます:

```python
filter = 'status == "active"'
```

### 例 2: Not Equal To (`!=`) を使用したフィルタリング\{#example-2-filtering-with-not-equal-to}

`status` が "inactive" ではないエンティティを検索するには：

```python
filter = 'status != "inactive"'
```

### 例 3: より大きい (`>`) を使ったフィルタリング\{#example-3-filtering-with-greater-than-greater}

`age` が 30 より大きいすべてのエンティティを検索したい場合:

```python
filter = 'age > 30'
```

### 例4: 未満でフィルタリング\{#example-4-filtering-with-less-than}

`price` が100未満のエンティティを検索するには：

```python
filter = 'price < 100'
```

### 例 5: 大なりイコール（`>=`）によるフィルタリング\{#example-5-filtering-with-greater-than-or-equal-to-greater}

`rating` が 4 以上であるすべてのエンティティを検索したい場合：

```python
filter = 'rating >= 4'
```

### 例6: 小なりイコールでのフィルタリング\{#example-6-filtering-with-less-than-or-equal-to}

`discount` が10%以下であるエンティティを検索するには：

```python
filter = 'discount <= 10'
```

## 範囲演算子\{#range-operators}

範囲演算子は、特定の値の集合や範囲に基づいてデータをフィルタリングするのに役立ちます。

### サポートされている範圍演算子:\{#supported-range-operators}

- `IN`: 特定の集合または範囲内の値に一致させるために使用します。

- `LIKE`: パターンに一致させるために使用します（主にテキストフィールド向け）。

### 例1: 複数の値に一致させるための `IN` の使用\{#example-1-using-in-to-match-multiple-values}

`color` が "red"、"green"、または "blue" のいずれかであるすべてのエンティティを検索したい場合：

```python
filter = 'color in ["red", "green", "blue"]'
```

これは、値のリストに対するメンバーシップを確認したい場合に便利です。

### 例 2: パターンマッチングに `LIKE` を使用する\{#example-2-using-like-for-pattern-matching}

`LIKE` 演算子は、文字列フィールドでのパターンマッチングに使用されます。テキスト内の異なる位置にある部分文字列をマッチさせることができます: **プレフィックス**、**インフィックス**、または **サフィックス** として。`LIKE` 演算子は `%` 記号をワイルドカードとして使用し、任意の数の文字（ゼロを含む）にマッチします。

<Admonition type="info" icon="📘" title="Notes">

ほとんどの場合、**インフィックス** または **サフィックス** マッチングは、プレフィックスマッチングよりも著しく遅くなります。パフォーマンスが重要な場合は、注意して使用してください。

</Admonition>

### プレフィックスマッチ（先頭一致）\{#prefix-match-starts-with}

文字列が指定されたパターンで始まる **プレフィックス** マッチを実行するには、パターンを先頭に配置し、その後に続く任意の文字に `%` を使用してマッチさせます。例えば、`name` が "Prod" で始まるすべての製品を検索するには:

```python
filter = 'name LIKE "Prod%"'
```

これは、「Product A」や「Product B」など、名前が "Prod" で始まるすべての製品に一致します。

### 接尾辞マッチ（末尾一致）\{#suffix-match-ends-with}

**接尾辞**マッチ（文字列の末尾が指定されたパターンに一致する場合）では、パターンの先頭に `%` 記号を置きます。たとえば、`name` が "XYZ" で終わるすべての製品を検索するには：

```python
filter = 'name LIKE "%XYZ"'
```

これは、"ProductXYZ" や "SampleXYZ" など、名前が "XYZ" で終わるすべての製品に一致します。

### 中間一致（部分一致）\{#infix-match-contains}

**中間一致**（文字列中の任意の位置にパターンが含まれる場合）を実行するには、パターンの前後に `%` 記号を配置します。たとえば、`name` に "Pro" という単語を含むすべての製品を検索するには：

```python
filter = 'name LIKE "%Pro%"'
```

これは、「Product」、「ProLine」、または「SuperPro」など、名前に部分文字列 "Pro" を含むすべての製品に一致します。

## 算術演算子\{#arithmetic-operators}

算術演算子を使用すると、数値フィールドを用いた計算に基づいて条件を作成できます。

### Supported 算術演算子:\{#supported-arithmetic-operators}

- `+` (加算)

- `-` (減算)

- `*` (乗算)

- `/` (除算)

- `%` (剰余)

- `**` (べき乗)

### Example 1: Using Modulus (`%`)\{#example-1-using-modulus-percent}

`id` が偶数（つまり2で割り切れる）であるエンティティを検索するには：

```python
filter = 'id % 2 == 0'
```

### 例 2: 累乗演算子（`**`）の使用\{#example-2-using-exponentiation}

`price` の 2 乗が 1000 より大きいエンティティを検索する場合：

```python
filter = 'price ** 2 > 1000'
```

## 論理演算子\{#logical-operators}

論理演算子は、複数の条件を組み合わせてより複雑なフィルター式を作成するために使用されます。これには `AND`、`OR`、および `NOT` が含まれます。

### サポートされている論理演算子:\{#supported-logical-operators}

- `AND`: すべて真である必要がある複数の条件を組み合わせます。

- `OR`: 少なくとも1つが真である必要がある条件を組み合わせます。

- `NOT`: 条件を否定します。

### 例1: `AND` を使用して条件を組み合わせる\{#example-1-using-and-to-combine-conditions}

`price` が 100 より大きく、かつ `stock` が 50 より大きいすべての製品を検索する場合:

```python
filter = 'price > 100 AND stock > 50'
```

### 例 2: `OR` を使用して条件を組み合わせる\{#example-2-using-or-to-combine-conditions}

`color` が "red" または "blue" であるすべての製品を検索するには：

```python
filter = 'color == "red" OR color == "blue"'
```

### 例 3: `NOT` を使用して条件を除外する\{#example-3-using-not-to-exclude-a-condition}

`color` が "green" でないすべての製品を検索するには：

```python
filter = 'NOT color == "green"'
```

## IS NULL および IS NOT NULL 演算子\{#is-null-and-is-not-null-operators}

`IS NULL` および `IS NOT NULL` 演算子は、フィールドに null 値（データの欠如）が含まれているかどうかに基づいてフィルタリングするために使用されます。

- `IS NULL`: 特定のフィールドに null 値が含まれているエンティティを識別します。つまり、値が存在しないか未定義です。

- `IS NOT NULL`: 特定のフィールドに null 以外の値が含まれているエンティティを識別します。つまり、フィールドに有効で定義された値があります。

<Admonition type="info" icon="📘" title="Notes">

これらの演算子は大文字と小文字を区別しないため、`IS NULL` または `is null`、`IS NOT NULL` または `is not null` を使用できます。

</Admonition>

### null 値を持つ通常のスカラーフィールド\{#regular-scalar-fields-with-null-values}

Zilliz Cloud では、文字列や数値などの通常のスカラーフィールドに対して null 値でのフィルタリングが可能です。

<Admonition type="info" icon="📘" title="Notes">

空文字列 `""` は、`VARCHAR` フィールドの null 値として扱われません。

</Admonition>

`description` フィールドが null のエンティティを取得するには:

```python
filter = 'description IS NULL'
```

`description` フィールドが null でないエンティティを取得するには：

```python
filter = 'description IS NOT NULL'
```

`description` フィールドが null ではなく、かつ `price` フィールドが 10 より大きいエンティティを取得するには：

```python
filter = 'description IS NOT NULL AND price > 10'
```

### JSON フィールドの Null 値\{#json-fields-with-null-values}

Zilliz Cloud では、null 値を含む JSON フィールドのフィルタリングが可能です。JSON フィールドが null とみなされるのは、以下の場合です。

- JSON オブジェクト全体が明示的に None (null) に設定されている場合。例: `{"metadata": None}`

- JSON フィールド自体がエンティティから完全に欠落している場合

<Admonition type="info" icon="📘" title="Notes">

JSON オブジェクト内の一部の要素が null の場合（例: 個別のキー）、そのフィールドは null ではないとみなされます。例えば、`\{"metadata": \{"category": None, "price": 99.99}}` は `category` キーが null であっても、null として扱われません。

</Admonition>

Zilliz Cloud が null 値を含む JSON フィールドをどのように処理するかをさらに説明するため、JSON フィールド `metadata` を含む以下のサンプルデータを考えてみましょう。

```python
data = [
  {
      "metadata": {"category": "electronics", "price": 99.99, "brand": "BrandA"},
      "pk": 1,
      "embedding": [0.12, 0.34, 0.56]
  },
  {
      "metadata": None, # Entire JSON object is null
      "pk": 2,
      "embedding": [0.56, 0.78, 0.90]
  },
  {  # JSON field \`metadata\` is completely missing
      "pk": 3,
      "embedding": [0.91, 0.18, 0.23]
  },
  {
      "metadata": {"category": None, "price": 99.99, "brand": "BrandA"}, # Individual key value is null
      "pk": 4,
      "embedding": [0.56, 0.38, 0.21]
  }
]
```

**例1: `metadata` が null であるエンティティを取得する**

`metadata` フィールドが存在しない、または明示的に None に設定されているエンティティを検索するには：

```python
filter = 'metadata IS NULL'

# Example output:
# data: [
#     "{'metadata': None, 'pk': 2}",
#     "{'metadata': None, 'pk': 3}"
# ]
```

**例2: `metadata` が null でないエンティティを取得する**

`metadata` フィールドが null でないエンティティを検索するには:

```python
filter = 'metadata IS NOT NULL'

# Example output:
# data: [
#     "{'metadata': {'category': 'electronics', 'price': 99.99, 'brand': 'BrandA'}, 'pk': 1}",
#     "{'metadata': {'category': None, 'price': 99.99, 'brand': 'BrandA'}, 'pk': 4}"
# ]
```

### Null 値を含む ARRAY フィールド\{#array-fields-with-null-values}

Zilliz Cloud では、null 値を含む ARRAY フィールドに対するフィルタリングが可能です。ARRAY フィールドは、以下の方法で null として扱われます。

- ARRAY フィールド全体が明示的に None (null) に設定されている場合。例: `"tags": None`

- ARRAY フィールドがエンティティから完全に欠落している場合

<Admonition type="info" icon="📘" title="Notes">

ARRAY フィールドに部分的な null 値を含めることはできません。ARRAY フィールド内のすべての要素は同じデータ型である必要があります。詳細については、[配列フィールド](./use-array-fields) を参照してください。

</Admonition>

Zilliz Cloud が null 値を含む ARRAY フィールドをどのように処理するかをさらに説明するため、以下に ARRAY フィールド `tags` を含むサンプルデータを示します。

```python
data = [
  {
      "tags": ["pop", "rock", "classic"],
      "ratings": [5, 4, 3],
      "pk": 1,
      "embedding": [0.12, 0.34, 0.56]
  },
  {
      "tags": None,  # Entire ARRAY is null
      "ratings": [4, 5],
      "pk": 2,
      "embedding": [0.78, 0.91, 0.23]
  },
  {  # The tags field is completely missing
      "ratings": [9, 5],
      "pk": 3,
      "embedding": [0.18, 0.11, 0.23]
  }
]
```

**例1: `tags` が null であるエンティティを取得する**

`tags` フィールドが存在しない、または明示的に `None` に設定されているエンティティを取得するには：

```python
filter = 'tags IS NULL'

# Example output:
# data: [
#     "{'tags': None, 'ratings': [4, 5], 'embedding': [0.78, 0.91, 0.23], 'pk': 2}",
#     "{'tags': None, 'ratings': [9, 5], 'embedding': [0.18, 0.11, 0.23], 'pk': 3}"
# ]
```

**例2: `tags` が null でないエンティティを取得する**

`tags` フィールドが null でないエンティティを取得するには:

```python
filter = 'tags IS NOT NULL'

# Example output:
# data: [
#     "{'metadata': {'category': 'electronics', 'price': 99.99, 'brand': 'BrandA'}, 'pk': 1}",
#     "{'metadata': {'category': None, 'price': 99.99, 'brand': 'BrandA'}, 'pk': 4}"
# ]
```

## JSONおよびARRAYフィールドで基本演算子を使用する際のヒント\{#tips-on-using-basic-operators-with-json-and-array-fields}

Zilliz Cloudクラスターの基本演算子は汎用性が高く、スカラーフィールドに適用できるだけでなく、JSONおよびARRAYフィールド内のキーおよびインデックスに対しても効果的に使用できます。

例えば、`price`、`model`、`tags` といった複数のキーを含む `product` フィールドがある場合、常にキーを直接参照してください:

```python
filter = 'product["price"] > 1000'
```

記録された温度の配列において、最初の温度が特定の値を超えるレコードを検索するには、次のようにします。

```python
filter = 'history_temperatures[0] > 30'
```

## まとめ\{#conclusion}

Zilliz Cloud は、データのフィルタリングとクエリに柔軟性を与える基本的な演算子を多数提供しています。比較演算子、範囲演算子、算術演算子、論理演算子を組み合わせることで、強力なフィルタ式を作成し、検索結果を絞り込み、必要なデータを効率的に取得できます。

## FAQ\{#faq}

**フィルタ条件内のマッチ値リストの長さに制限はありますか（例: filter='color in ["red", "green", "blue"]'）？リストが長すぎる場合はどうすればよいですか？**

Zilliz Cloud は、フィルタ条件内のマッチ値リストの長さに制限を設けていません。ただし、過度に長いリストはクエリパフォーマンスに大きな影響を与える可能性があります。
フィルタ条件に長いマッチ値リストや多くの要素を含む複雑な式が含まれる場合は、[Filter Templating](./filtering-templating) を使用してクエリパフォーマンスを向上させることをお勧めします。