---
title: "基本演算子 | Cloud"
slug: /basic-filtering-operators
sidebar_label: "基本演算子"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、データを効率的にフィルタリングおよびクエリするのに役立つ豊富な基本演算子セットを提供します。これらの演算子を使用すると、スカラーフィールド、数値計算、論理条件などに基づいて検索条件を絞り込むことができます。これらの演算子の使用方法を理解することは、正確なクエリを構築し、検索の効率を最大化するために不可欠です。 | Cloud"
type: origin
token: LBbUwOGcwi1UMak3eE2cM1gvnUe
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - データ
  - フィルター
  - フィルタリング式
  - フィルタリング
  - 基本演算子
  - 情報検索
  - 次元削減
  - hnsw アルゴリズム
  - ベクトル類似性検索

---

import Admonition from '@theme/Admonition';


# 基本演算子

Zilliz Cloudは、データを効率的にフィルタリングおよびクエリするのに役立つ豊富な基本演算子を提供します。これらの演算子を使用すると、スカラーフィールド、数値計算、論理条件などに基づいて検索条件を絞り込むことができます。これらの演算子の使用方法を理解することは、正確なクエリを構築し、検索の効率を最大化するために不可欠です。

## 比較演算子{#comparison-operators}

比較演算子は、等価性、不等価性、またはサイズに基づいてデータをフィルタリングするために使用されます。これらは数値フィールドとテキストフィールドに適用できます。

### サポートされている比較演算子{#supported-comparison-operators}

- `==` (等しい)

- `!=` (等しくない)

- `>` (より大きい)

- `<` (より小さい)

- `>=` (より大きいか等しい)

- `<=` (より小さいか等しい)

### 例1: 等しい (`==`) を使用したフィルタリング{#example-1-filtering-with-equal-to}

`status`という名前のフィールドがあり、`status`が「active」であるすべてのentityを見つけたいとします。等価演算子`==`を使用できます。

```python
filter = 'status == "active"'
```

### 例 2: 不等号 (`!=`) を使用したフィルタリング{#example-2-filtering-with-not-equal-to}

`status` が "inactive" ではないエンティティを検索するには、次のようにします。

```python
filter = 'status != "inactive"'
```

### 例3：より大きい（`>`）によるフィルタリング{#example-3-filtering-with-greater-than-greater}

`age`が30より大きいすべてのエンティティを検索したい場合：

```python
filter = 'age > 30'
```

### 例 4: 未満でのフィルタリング\{#example-4-filtering-with-less-than}

`price` が 100 未満のエンティティを見つけるには:

```python
filter = 'price < 100'
```

### 例 5: 以上 (`>=`) を使用したフィルタリング{#example-5-filtering-with-greater-than-or-equal-to-greater}

`rating` が 4 以上のすべてのエンティティを検索する場合:

```python
filter = 'rating >= 4'
```

### 例 6: 以下でフィルタリングする\{#example-6-filtering-with-less-than-or-equal-to}

`discount` が 10% 以下のエンティティを見つけるには:

```python
filter = 'discount <= 10'
```

## 範囲演算子{#range-operators}

範囲演算子は、特定のセットまたは値の範囲に基づいてデータをフィルタリングするのに役立ちます。

### サポートされている範囲演算子：{#supported-range-operators}

- `IN`: 特定のセットまたは範囲内の値と一致させるために使用されます。

- `LIKE`: パターンと一致させるために使用されます（主にテキストフィールド用）。

### 例 1: `IN` を使用して複数の値と一致させる{#example-1-using-in-to-match-multiple-values}

`color` が「red」、「green」、または「blue」のいずれかであるすべてのエンティティを検索したい場合：

```python
filter = 'color in ["red", "green", "blue"]'
```

これは、値のリストにメンバーシップがあるかどうかを確認したい場合に便利です。

### 例 2: パターンマッチングに `LIKE` を使用する{#example-2-using-like-for-pattern-matching}

`LIKE` 演算子は、文字列フィールドでのパターンマッチングに使用されます。テキスト内の異なる位置でサブストリングを照合できます。**プレフィックス**、**インフィックス**、または**サフィックス**としてです。`LIKE` 演算子は、`%` 記号をワイルドカードとして使用し、任意の数の文字（ゼロを含む）と一致させることができます。

<Admonition type="info" icon="📘" title="Notes">

<p>ほとんどの場合、<strong>インフィックス</strong>または<strong>サフィックス</strong>マッチングは、プレフィックスマッチングよりも大幅に遅くなります。パフォーマンスが重要な場合は、注意して使用してください。</p>

</Admonition>

### プレフィックスマッチ (で始まる){#prefix-match-starts-with}

文字列が特定のパターンで始まる**プレフィックス**マッチを実行するには、パターンを先頭に配置し、`%` を使用してそれに続く任意の文字と一致させます。たとえば、`name` が「Prod」で始まるすべての製品を見つけるには、次のようにします。

```python
filter = 'name LIKE "Prod%"'
```

これは、「Product A」、「Product B」など、「Prod」で始まるすべての製品に一致します。

### 後方一致 (Ends With){#suffix-match-ends-with}

**後方一致**の場合、つまり文字列が特定のパターンで終わる場合は、パターンの先頭に `%` 記号を配置します。たとえば、`name` が「XYZ」で終わるすべての製品を見つけるには、次のようにします。

```python
filter = 'name LIKE "%XYZ"'
```

これは、「ProductXYZ」、「SampleXYZ」など、「XYZ」で終わる名前を持つすべての製品に一致します。

### 中間一致 (含む){#infix-match-contains}

文字列内の任意の場所にパターンが出現する**中間**一致を実行するには、パターンの先頭と末尾の両方に`%`記号を配置します。たとえば、「Pro」という単語を含むすべての製品の`name`を見つけるには、次のようにします。

```python
filter = 'name LIKE "%Pro%"'
```

これは、「Product」、「ProLine」、「SuperPro」など、「Pro」という部分文字列を含む製品名に一致します。

## 算術演算子{#arithmetic-operators}

算術演算子を使用すると、数値フィールドを含む計算に基づいて条件を作成できます。

### サポートされている算術演算子：{#supported-arithmetic-operators}

- `+` (加算)

- `-` (減算)

- `*` (乗算)

- `/` (除算)

- `%` (剰余)

- `**` (累乗)

### 例 1: 剰余 (`%`) の使用{#example-1-using-modulus-percent}

`id` が偶数 (つまり、2 で割り切れる) のエンティティを見つけるには：

```python
filter = 'id % 2 == 0'
```

### 例2：累乗演算子（`**`）の使用{#example-2-using-exponentiation}

`price`を2乗した値が1000より大きいエンティティを検索するには、次のようにします。

```python
filter = 'price ** 2 > 1000'
```

## 論理演算子{#logical-operators}

論理演算子は、複数の条件を組み合わせてより複雑なフィルター式を作成するために使用されます。これには、`AND`、`OR`、`NOT` が含まれます。

### サポートされている論理演算子{#supported-logical-operators}

- `AND`: すべてが真でなければならない複数の条件を結合します。

- `OR`: 少なくとも1つが真でなければならない条件を結合します。

- `NOT`: 条件を否定します。

### 例1: `AND` を使用した条件の結合{#example-1-using-and-to-combine-conditions}

`price` が100より大きく、かつ `stock` が50より大きいすべての製品を見つけるには：

```python
filter = 'price > 100 AND stock > 50'
```

### 例 2: `OR` を使用して条件を結合する\{#example-2-using-or-to-combine-conditions}

`color` が「red」または「blue」のすべての製品を見つけるには、次のようにします。

```python
filter = 'color == "red" OR color == "blue"'
```

### 例 3: `NOT` を使用して条件を除外する{#example-3-using-not-to-exclude-a-condition}

`color` が「green」ではないすべての製品を見つけるには、次のようにします。

```python
filter = 'NOT color == "green"'
```

## IS NULL および IS NOT NULL 演算子{#is-null-and-is-not-null-operators}

`IS NULL` および `IS NOT NULL` 演算子は、フィールドが null 値 (データがないこと) を含むかどうかに基づいてフィールドをフィルタリングするために使用されます。

- `IS NULL`: 特定のフィールドに null 値が含まれる、つまり値が存在しないか未定義である entity を識別します。

- `IS NOT NULL`: 特定のフィールドに null 以外の値が含まれる、つまりフィールドに有効で定義された値がある entity を識別します。

<Admonition type="info" icon="📘" title="Notes">

<p>これらの演算子は大文字と小文字を区別しないため、<code>IS NULL</code> または <code>is null</code>、および <code>IS NOT NULL</code> または <code>is not null</code> を使用できます。</p>

</Admonition>

### null 値を持つ通常のスカラフィールド{#regular-scalar-fields-with-null-values}

Zilliz Cloud は、文字列や数値などの通常のスカラフィールドを null 値でフィルタリングできます。

<Admonition type="info" icon="📘" title="Notes">

<p>空の文字列 <code>""</code> は、<code>VARCHAR</code> フィールドの null 値として扱われません。</p>

</Admonition>

`description` フィールドが null である entity を取得するには:

```python
filter = 'description IS NULL'
```

`description` フィールドが null でないエンティティを取得するには、次のようにします。

```python
filter = 'description IS NOT NULL'
```

`description` フィールドが null ではなく、`price` フィールドが 10 より大きいエンティティを取得するには、以下のようにします。

```python
filter = 'description IS NOT NULL AND price > 10'
```

### Null値を持つJSONフィールド\{#json-fields-with-null-values}

Zilliz Cloudは、null値を含むJSONフィールドでのフィルタリングを可能にします。JSONフィールドは、以下の方法でnullとして扱われます。

- JSONオブジェクト全体が明示的にNone (null) に設定されている場合。例: `{"metadata": None}`。

- JSONフィールド自体がentityから完全に欠落している場合。

<Admonition type="info" icon="📘" title="Notes">

<p>JSONオブジェクト内の一部の要素がnullである場合（例：個々のキー）、そのフィールドは依然として非nullと見なされます。例えば、<code>\{"metadata": \{"category": None, "price": 99.99}}</code>は、<code>category</code>キーがnullであっても、nullとしては扱われません。</p>

</Admonition>

Zilliz Cloudがnull値を持つJSONフィールドをどのように処理するかをさらに説明するために、JSONフィールド`metadata`を持つ以下のサンプルデータを検討します。

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
  {  # JSON field `metadata` is completely missing
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

**例 1: メタデータが null のエンティティを取得する**

`metadata` フィールドが存在しないか、明示的に None に設定されているエンティティを検索するには、次のようにします。

```python
filter = 'metadata IS NULL'

# Example output:
# data: [
#     "{'metadata': None, 'pk': 2}",
#     "{'metadata': None, 'pk': 3}"
# ]
```

**例2：メタデータがnullではないエンティティを取得する**

`metadata`フィールドがnullではないエンティティを見つけるには：

```python
filter = 'metadata IS NOT NULL'

# Example output:
# data: [
#     "{'metadata': {'category': 'electronics', 'price': 99.99, 'brand': 'BrandA'}, 'pk': 1}",
#     "{'metadata': {'category': None, 'price': 99.99, 'brand': 'BrandA'}, 'pk': 4}"
# ]
```

### NULL値を持つARRAYフィールド\{#array-fields-with-null-values}

Zilliz Cloudは、NULL値を含むARRAYフィールドでのフィルタリングをサポートしています。ARRAYフィールドは、以下の方法でNULLとして扱われます。

- ARRAYフィールド全体が明示的にNone（null）に設定されている場合。例: `"tags": None`。

- ARRAYフィールドがentityから完全に欠落している場合。

<Admonition type="info" icon="📘" title="Notes">

<p>ARRAYフィールド内のすべての要素は同じデータ型である必要があるため、ARRAYフィールドに部分的なNULL値を含めることはできません。詳細については、<a href="./use-array-fields">Array Field</a>を参照してください。</p>

</Admonition>

Zilliz CloudがNULL値を持つARRAYフィールドをどのように処理するかをさらに説明するために、ARRAYフィールド`tags`を持つ以下のサンプルデータを考えてみましょう。

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

**例 1: tags が null のエンティティを取得する**

`tags` フィールドが存在しないか、明示的に `None` に設定されているエンティティを取得するには、次のようにします。

```python
filter = 'tags IS NULL'

# Example output:
# data: [
#     "{'tags': None, 'ratings': [4, 5], 'embedding': [0.78, 0.91, 0.23], 'pk': 2}",
#     "{'tags': None, 'ratings': [9, 5], 'embedding': [0.18, 0.11, 0.23], 'pk': 3}"
# ]
```

**例 2: tags が null でないエンティティを取得する**

`tags` フィールドが null でないエンティティを取得するには、次のようにします。

```python
filter = 'tags IS NOT NULL'

# Example output:
# data: [
#     "{'metadata': {'category': 'electronics', 'price': 99.99, 'brand': 'BrandA'}, 'pk': 1}",
#     "{'metadata': {'category': None, 'price': 99.99, 'brand': 'BrandA'}, 'pk': 4}"
# ]
```

## JSONフィールドとARRAYフィールドで基本演算子を使用するためのヒント{#tips-on-using-basic-operators-with-json-and-array-fields}

Zilliz Cloudクラスターの基本演算子は多用途で、スカラーフィールドに適用できるだけでなく、JSONフィールドとARRAYフィールドのキーとインデックスにも効果的に使用できます。

たとえば、`price`、`model`、`tags`などの複数のキーを含む`product`フィールドがある場合、常にキーを直接参照してください。

```python
filter = 'product["price"] > 1000'
```

記録された温度の配列の最初の温度が特定の値を超えるレコードを見つけるには、次を使用します。

```python
filter = 'history_temperatures[0] > 30'
```

## まとめ{#conclusion}

Zilliz Cloudは、データのフィルタリングとクエリに柔軟性をもたらす基本的な演算子を幅広く提供しています。比較演算子、範囲演算子、算術演算子、論理演算子を組み合わせることで、強力なフィルター式を作成し、検索結果を絞り込み、必要なデータを効率的に取得できます。

## FAQ{#faq}

**フィルター条件におけるマッチ値リストの長さに制限はありますか（例：`filter='color in ["red", "green", "blue"]'`）？リストが長すぎる場合はどうすればよいですか？**

Zilliz Cloudは、フィルター条件におけるマッチ値リストの長さに制限を設けていません。ただし、リストが長すぎると、クエリのパフォーマンスに大きな影響を与える可能性があります。
フィルター条件に長いマッチ値リストや多くの要素を含む複雑な式が含まれる場合は、クエリのパフォーマンスを向上させるために[フィルターテンプレート](./filtering-templating)を使用することをお勧めします。