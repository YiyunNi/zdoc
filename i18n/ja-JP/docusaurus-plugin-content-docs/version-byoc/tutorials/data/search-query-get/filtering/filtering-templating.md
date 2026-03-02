---
title: "フィルターテンプレート | BYOC"
slug: /filtering-templating
sidebar_label: "フィルターテンプレート"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudでは、多数の要素、特にCJK文字のような非ASCII文字を含む複雑なフィルター式は、クエリパフォーマンスに大きな影響を与える可能性があります。この問題に対処するため、Zilliz Cloudは、複雑な式の解析にかかる時間を短縮することで効率を向上させるように設計されたフィルター式テンプレートメカニズムを導入しています。このページでは、検索、クエリ、および削除操作でフィルター式テンプレートを使用する方法について説明します。 | BYOC"
type: origin
token: TumJwDYrhiDYcUkKsUIcuSnbnCf
sidebar_position: 3
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - collection
  - データ
  - フィルター
  - フィルタリング式
  - フィルタリング
  - フィルタリングテンプレート
  - ベクトル検索
  - 音声類似性検索
  - Elasticベクトルデータベース
  - Pinecone vs Milvus

---

import Admonition from '@theme/Admonition';


# フィルターのテンプレート化

Zilliz Cloudでは、多数の要素を持つ複雑なフィルター式、特にCJK文字のような非ASCII文字を含むものは、クエリのパフォーマンスに大きな影響を与える可能性があります。この問題に対処するため、Zilliz Cloudは、複雑な式を解析するのにかかる時間を短縮することで効率を向上させるように設計されたフィルター式テンプレートメカニズムを導入しています。このページでは、検索、クエリ、および削除操作におけるフィルター式テンプレートの使用方法について説明します。

## 概要{#overview}

フィルター式テンプレートを使用すると、プレースホルダーを含むフィルター式を作成でき、クエリ実行中に値を動的に置き換えることができます。テンプレートを使用することで、大きな配列や複雑な式をフィルターに直接埋め込むことを避け、解析時間を短縮し、クエリのパフォーマンスを向上させることができます。

`age`と`city`の2つのフィールドを含むフィルター式があり、年齢が25歳より大きく、「北京」または「上海」に住んでいるすべての人を見つけたいとします。値をフィルター式に直接埋め込む代わりに、テンプレートを使用できます。

```python
filter = "age > {age} AND city IN {city}"
filter_params = {"age": 25, "city": ["北京", "上海"]}
```

ここで、`{age}`と`{city}`は、クエリ実行時に`filter_params`内の実際の値に置き換えられるプレースホルダーです。

Zilliz Cloudでフィルター式テンプレートを使用することには、いくつかの主要な利点があります。

- **解析時間の短縮**: 大規模または複雑なフィルター式をプレースホルダーに置き換えることで、システムがフィルターの解析と処理に費やす時間が短縮されます。

- **クエリパフォーマンスの向上**: 解析オーバーヘッドが削減されることで、クエリパフォーマンスが向上し、QPSの向上と応答時間の短縮につながります。

- **スケーラビリティ**: データセットが拡大し、フィルター式がより複雑になるにつれて、テンプレート化によりパフォーマンスが効率的でスケーラブルに保たれます。

## 検索操作{#search-operations}

Zilliz Cloudでの検索操作では、`filter`式はフィルタリング条件を定義するために使用され、`filter_params`パラメータはプレースホルダーの値を指定するために使用されます。`filter_params`辞書には、Zilliz Cloudがフィルター式に代入するために使用する動的な値が含まれています。

```python
expr = "age > {age} AND city IN {city}"
filter_params = {"age": 25, "city": ["北京", "上海"]}
res = client.search(
    "hello_milvus",
    vectors[:nq],
    filter=expr,
    limit=10,
    output_fields=["age", "city"],
    search_params={"metric_type": "COSINE", "params": {"search_list": 100}},
    filter_params=filter_params,
)
```

この例では、Zilliz Cloudは検索実行時に`{age}`を`25`に、`{city}`を`["北京", "上海"]`に動的に置き換えます。

## クエリ操作{#query-operations}

同じテンプレートメカニズムをZilliz Cloudのクエリ操作にも適用できます。`query`関数では、フィルター式を定義し、`filter_params`を使用して置換する値を指定します。

```python
expr = "age > {age} AND city IN {city}"
filter_params = {"age": 25, "city": ["北京", "上海"]}
res = client.query(
    "hello_milvus",
    filter=expr,
    output_fields=["age", "city"],
    filter_params=filter_params
)
```

`filter_params`を使用することで、Zilliz Cloudは動的な値の挿入を効率的に処理し、クエリ実行の速度を向上させます。

## 削除操作{#delete-operations}

削除操作でもフィルター式テンプレートを使用できます。検索やクエリと同様に、`filter`式が条件を定義し、`filter_params`がプレースホルダーに動的な値を提供します。

```python
expr = "age > {age} AND city IN {city}"
filter_params = {"age": 25, "city": ["北京", "上海"]}
res = client.delete(
    "hello_milvus",
    filter=expr,
    filter_params=filter_params
)
```

このアプローチにより、特に複雑なフィルター条件を扱う場合に、削除操作のパフォーマンスが向上します。

## 結論{#conclusion}

フィルター式テンプレートは、Zilliz Cloud でクエリパフォーマンスを最適化するための不可欠なツールです。プレースホルダーと `filter_params` ディクショナリを使用することで、複雑なフィルター式の解析にかかる時間を大幅に短縮できます。これにより、クエリ実行が高速化され、全体的なパフォーマンスが向上します。