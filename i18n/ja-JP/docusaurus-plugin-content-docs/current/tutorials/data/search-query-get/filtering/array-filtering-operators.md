---
title: "ARRAY演算子 | Cloud"
slug: /array-filtering-operators
sidebar_label: "ARRAY演算子"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、配列フィールドをクエリするための強力な演算子を提供し、配列の内容に基づいてエンティティをフィルタリングおよび取得できます。"
type: origin
token: MaWywRYCniq6vwkJsT7c2wAyn0f
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - データ
  - フィルター
  - フィルタリング式
  - フィルタリング
  - array operators
  - multimodal RAG
  - llm hallucinations
  - ハイブリッド検索
  - 語彙検索

---

import Admonition from '@theme/Admonition';


# ARRAY演算子

Zilliz Cloudは、配列フィールドをクエリするための強力な演算子を提供し、配列の内容に基づいてエンティティをフィルタリングおよび取得できます。

<Admonition type="info" icon="📘" title="Notes">

<p>配列内のすべての要素は同じ型である必要があり、配列内のネストされた構造はプレーンな文字列として扱われます。したがって、ARRAYフィールドを扱う際には、過度に深いネストを避け、最適なパフォーマンスのためにデータ構造を可能な限りフラットにすることをお勧めします。</p>

</Admonition>

## 利用可能なARRAY演算子{#available-array-operators}

ARRAY演算子を使用すると、Zilliz Cloudクラスター内の配列フィールドをきめ細かくクエリできます。これらの演算子は次のとおりです。

- [`ARRAY_CONTAINS(identifier, expr)`](./array-filtering-operators#arraycontains): 配列フィールドに特定の要素が存在するかどうかをチェックします。

- [`ARRAY_CONTAINS_ALL(identifier, expr)`](./array-filtering-operators#arraycontainsall): 指定されたリストのすべての要素が配列フィールドに存在することを確認します。

- [`ARRAY_CONTAINS_ANY(identifier, expr)`](./array-filtering-operators#arraycontainsany): 指定されたリストのいずれかの要素が配列フィールドに存在するかどうかをチェックします。

- [`ARRAY_LENGTH(identifier)`](./array-filtering-operators#arraylength): 配列フィールドの要素数を返し、比較演算子と組み合わせてフィルタリングに使用できます。

## ARRAY_CONTAINS{#arraycontains}

`ARRAY_CONTAINS`演算子は、配列フィールドに特定の要素が存在するかどうかをチェックします。特定の要素が配列に存在するエンティティを見つけたい場合に便利です。

**例**

`history_temperatures`という配列フィールドがあり、異なる年の記録された最低気温が含まれているとします。配列に値`23`が含まれるすべてのエンティティを見つけるには、次のフィルター式を使用できます。

```python
filter = 'ARRAY_CONTAINS(history_temperatures, 23)'
```

これは、`history_temperatures` 配列に値 `23` が含まれるすべてのエンティティを返します。

## ARRAY_CONTAINS_ALL{#arraycontainsall}

`ARRAY_CONTAINS_ALL` 演算子は、指定されたリストのすべての要素が配列フィールドに存在することを保証します。この演算子は、配列に複数の値を含むエンティティを照合したい場合に便利です。

**例**

`history_temperatures` 配列に `23` と `24` の両方が含まれるすべてのエンティティを検索したい場合は、次のように使用できます。

```python
filter = 'ARRAY_CONTAINS_ALL(history_temperatures, [23, 24])'
```

これは、`history_temperatures` 配列に指定された両方の値が含まれるすべてのエンティティを返します。

## ARRAY_CONTAINS_ANY\{#arraycontainsany}

`ARRAY_CONTAINS_ANY` 演算子は、指定されたリストのいずれかの要素が配列フィールドに存在するかどうかをチェックします。これは、配列内に指定された値の少なくとも1つを含むエンティティを照合したい場合に便利です。

**例**

`history_temperatures` 配列に `23` または `24` のいずれかが含まれるすべてのエンティティを見つけるには、次のように使用します。

```python
filter = 'ARRAY_CONTAINS_ANY(history_temperatures, [23, 24])'
```

これは、`history_temperatures` 配列に `23` または `24` のいずれかの値が少なくとも1つ含まれるすべてのエンティティを返します。

## ARRAY_LENGTH{#arraylength}

`ARRAY_LENGTH` は、配列フィールドの長さ（要素数）を返します。正確に1つのパラメータを受け入れます。それは配列フィールド識別子です。

**例**

`history_temperatures` 配列の要素数が10未満のすべてのエンティティを検索するには、次のようにします。

```python
filter = 'ARRAY_LENGTH(history_temperatures) < 10'
```

これは、`history_temperatures` 配列の要素が10未満であるすべてのエンティティを返します。