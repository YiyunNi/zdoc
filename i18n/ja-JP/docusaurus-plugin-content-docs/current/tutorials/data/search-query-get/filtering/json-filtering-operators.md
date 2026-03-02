---
title: "JSON演算子 | Cloud"
slug: /json-filtering-operators
sidebar_label: "JSON演算子"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、JSONフィールドのクエリとフィルタリングのための高度な演算子をサポートしており、複雑な構造化データの管理に最適です。これらの演算子により、JSONドキュメントの非常に効果的なクエリが可能になり、JSONフィールド内の特定の要素、値、または条件に基づいてエンティティを取得できます。このセクションでは、Zilliz CloudでJSON固有の演算子を使用する方法を、その機能を説明する実用的な例を交えてご紹介します。 | Cloud"
type: origin
token: Py6zwu6r4iPMqVkKAYXcUYLEnXg
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - データ
  - フィルター
  - フィルタリング式
  - フィルタリング
  - JSON演算子
  - ベクトルデータベースの仕組み
  - ベクトルDB比較
  - OpenAI ベクトルDB
  - 自然言語処理データベース

---

import Admonition from '@theme/Admonition';


# JSON演算子

Zilliz Cloudは、JSONフィールドのクエリとフィルタリングのための高度な演算子をサポートしており、複雑な構造化データを管理するのに最適です。これらの演算子を使用すると、JSONドキュメントを非常に効果的にクエリでき、JSONフィールド内の特定の要素、値、または条件に基づいてエンティティを取得できます。このセクションでは、Zilliz CloudでJSON固有の演算子を使用する方法を、その機能を説明する実用的な例を交えて説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>JSONフィールドは、複雑なネストされた構造を処理できず、すべてのネストされた構造をプレーンな文字列として扱います。したがって、JSONフィールドを扱う際には、過度に深いネストを避け、最適なパフォーマンスのためにデータ構造を可能な限りフラットにすることをお勧めします。</p>

</Admonition>

## 利用可能なJSON演算子{#available-json-operators}

Zilliz Cloudは、JSONデータをフィルタリングおよびクエリするのに役立ついくつかの強力なJSON演算子を提供しており、これらの演算子は次のとおりです。

- [`JSON_CONTAINS(identifier, expr)`](./json-filtering-operators#jsoncontains): 指定されたJSON式がフィールド内に見つかったエンティティをフィルタリングします。

- [`JSON_CONTAINS_ALL(identifier, expr)`](./json-filtering-operators#jsoncontainsall): 指定されたJSON式のすべての要素がフィールドに存在することを確認します。

- [`JSON_CONTAINS_ANY(identifier, expr)`](./json-filtering-operators#jsoncontainsany): JSON式の少なくとも1つのメンバーがフィールド内に存在するエンティティをフィルタリングします。

これらの演算子を例とともに見て、実際のシナリオでどのように適用できるかを確認しましょう。

## JSON_CONTAINS{#jsoncontains}

`json_contains`演算子は、JSONフィールド内に特定の要素またはサブアレイが存在するかどうかをチェックします。JSON配列またはオブジェクトに特定の値が含まれていることを確認したい場合に便利です。

**例**

`tags`フィールドに`["electronics", "sale", "new"]`のような文字列のJSON配列が含まれる製品のコレクションがあるとします。`"sale"`タグを持つ製品をフィルタリングしたいとします。

```python
# JSON data: {"tags": ["electronics", "sale", "new"]}
filter = 'json_contains(product["tags"], "sale")'
```

この例では、Zilliz Cloud は `tags` フィールドに要素 `"sale"` が含まれるすべての製品を返します。

## JSON_CONTAINS_ALL{#jsoncontainsall}

`json_contains_all` 演算子は、指定された JSON 式のすべての要素がターゲットフィールドに存在することを保証します。これは、JSON 配列内で複数の値を照合する必要がある場合に特に便利です。

**例**

製品タグのシナリオを続けると、`"electronics"`、`"sale"`、`"new"` のタグを持つすべての製品を見つけたい場合、`json_contains_all` 演算子を使用できます。

```python
# JSON data: {"tags": ["electronics", "sale", "new", "discount"]}
filter = 'json_contains_all(product["tags"], ["electronics", "sale", "new"])'
```

このクエリは、`tags` 配列に指定された3つの要素すべて（`"electronics"`、`"sale"`、`"new"`）が含まれるすべての製品を返します。

## JSON_CONTAINS_ANY{#jsoncontainsany}

`json_contains_any` 演算子は、JSON 式の少なくとも1つのメンバーがフィールド内に存在するエンティティをフィルタリングします。これは、いくつかの可能な値のいずれかに基づいてエンティティを照合したい場合に便利です。

**例**

`"electronics"`、`"sale"`、または`"new"`のいずれかのタグを持つ製品をフィルタリングしたいとします。これには `json_contains_any` 演算子を使用できます。

```python
# JSON data: {"tags": ["electronics", "sale", "new"]}
filter = 'json_contains_any(tags, ["electronics", "new", "clearance"])'
```

この場合、Zilliz Cloudは、リスト`["electronics", "new", "clearance"]`にあるタグの少なくとも1つを持つすべての製品を返します。製品がこれらのタグの1つしか持っていない場合でも、結果に含まれます。