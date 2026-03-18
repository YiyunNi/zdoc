---
title: "リコール率の調整 | Cloud"
slug: /tune-recall-rate
sidebar_label: "リコール率の調整"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、検索リコールとパフォーマンスのバランスを取るための検索パラメータ`level`を導入しています。また、現在の検索の推定リコール率をユーザーに提供するための別の検索パラメータ`enablerecallcalculation`も提供しています。これら2つのパラメータを組み合わせて、ベクトル検索のリコール率を調整できます。 | Cloud"
type: origin
token: Fz9swr5WwixkH8kKHircWCejnye
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - データ
  - ベクトル検索
  - ann
  - リコール率
  - リコール率の調整

---

import Admonition from '@theme/Admonition';


# リコール率の調整

Zilliz Cloudは、検索リコールとパフォーマンスのバランスを取るために、検索パラメータ`level`を導入しています。また、現在の検索の推定リコール率をユーザーに提供するために、別の検索パラメータ`enable_recall_calculation`も提供しています。これら2つのパラメータを組み合わせて、ベクトル検索のリコール率を調整できます。

<Admonition type="info" icon="📘" title="Notes">

<p>これは、基本的なベクトル検索、フィルタリング検索、範囲検索、グループ化検索、ハイブリッド検索、検索イテレータを含むすべての検索に適用されます。</p>

</Admonition>

## 概要\{#overview}

Zilliz Cloudにおけるリコール率とは、通常、検索によって正常に取得された関連結果の割合を指します。これは、コレクションからすべての関連アイテムを回復するシステムの能力を測定します。

![OdMnbeHYOoAEqKxNEEnc9SwNnmf](https://zdoc-images.s3.us-west-2.amazonaws.com/odmnbehyooaeqkxneenc9swnnmf.png "OdMnbeHYOoAEqKxNEEnc9SwNnmf")

検索のリコール率を計算するには、取得された関連アイテムの数を、取得されるべき適用可能なアイテムの総数で割ります。たとえば、検索が100個の関連アイテムのうち90個を取得した場合、リコール率は**0.9**または**90%**になります。

高いリコール率は通常、より正確な検索結果を示しますが、時間がかかる場合があります。ベクトル検索の精度と効率のバランスを取るために、リコール率を調整したい場合があります。

## 検索リクエストの設定\{#set-up-a-search-request}

調整可能なリコールで検索リクエストを設定するには、検索パラメータ内に`level`パラメータを次のように含める必要があります。

```python
query_vector = [0.3580376395471989, ..., 0.9029438446296592],

res = client.search(
    collection_name="quick_setup",
    data=[query_vector],
    limit=3, # The number of results to return
    search_params={
        "params": {
            # highlight-next-line
            "level": 1 # The precision control
        }
    }
)
```

`level` パラメータは `1` から `10` の範囲で、デフォルトは `1` です。デフォルト値では、リコール率は90%となり、ほとんどのユースケースで通常十分です。

高いリコール率（**99%**以上）を必要とするシナリオでは、`level` パラメータを `6` から `10` の間の整数に設定してみてください。検索効率が問題にならない場合は、このパラメータを `10` に設定して、最も正確な結果を得ることができます。

<Admonition type="info" icon="📘" title="Notes">

<p>最上位レベルの設定でも不十分な場合は、<a href="https://zilliz.com/contact-sales">Zilliz Cloud サポート</a>にお問い合わせください。</p>

</Admonition>

## リコール率の調整\{#tune-recall-rate}

Zilliz Cloud は、チューニングプロセスを容易にするために、`enable_recall_calculation` という別の検索パラメータも導入しています。このパラメータを `True` に設定すると、Zilliz Cloud は現在の検索のリコール率を推定し、その推定値を検索結果に含めます。

```python
query_vector = [0.3580376395471989, ..., 0.9029438446296592],

res = client.search(
    collection_name="quick_setup",
    data=[query_vector],
    limit=3, # The number of results to return
    search_params={
        "params": {
            "level": 6 # The precision control
            # highlight-next-line
            "enable_recall_calculation": True # Ask for recall rate calculation
        }
    }
)
```

上記の検索リクエストにより、現在の検索の推定リコール率を次のように取得できます。

```python
# data: [...], recalls: [0.98]
```

推定プロセス中、Zilliz Cloud は次のことを行います。

1. `level` パラメータをユーザー定義の値に設定して検索を実行します。

1. 内部の高精度モードで別の検索を実行します。

1. 2 番目の検索をグラウンドトゥルースとして使用し、リコール率を推定します。

`enable_recall_calculation` を `True` に設定すると、`level` パラメータの値を調整して複数のリコール率を取得できます。これらの推定値と各検索の期間を考慮することで、適切なレベル設定を概算できます。

<Admonition type="info" icon="📘" title="Notes">

<p><code>enable_recall_calculation</code> を有効にすると、検索パフォーマンスに影響を与える可能性があり、本番環境での使用は推奨されません。</p>

</Admonition>

## 制限事項\{#limits}

現在、この機能は、Zilliz Cloud クラスターの基本的なベクトル検索、フィルター検索、および範囲検索でのみ利用可能です。

