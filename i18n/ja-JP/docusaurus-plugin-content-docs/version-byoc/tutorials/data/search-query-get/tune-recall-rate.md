---
title: "リコール率の調整 | BYOC"
slug: /tune-recall-rate
sidebar_key: tune-recall-rate
sidebar_label: "リコール率を調整"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、検索リコールとパフォーマンスのバランスを取るために `level` という検索パラメータを導入しています。また、現在の検索の推定リコール率をユーザーに提供する `enablerecallcalculation` という検索パラメータも用意されています。これら2つのパラメータを組み合わせて、ベクトル検索のリコール率を調整できます。 | BYOC"
type: origin
token: Fz9swr5WwixkH8kKHircWCejnye
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - data
  - vector search
  - ann
  - recall rate
  - tune recall rate

---

import Admonition from '@theme/Admonition';


# リコール率の調整

Zilliz Cloud では、検索のリコールとパフォーマンスのバランスを取るために、検索パラメータ `level` を導入しています。また、現在の検索の推定リコール率をユーザーに提供するための検索パラメータ `enable_recall_calculation` も用意されています。これら2つのパラメータを組み合わせて、ベクトル検索のリコール率を調整できます。

<Admonition type="info" icon="📘" title="Notes">

<p>これは、基本的なベクトル検索、フィルタリング検索、範囲検索、グループ化検索、ハイブリッド検索、および検索イテレータを含むすべての検索に適用されます。</p>

</Admonition>

## 概要\{#overview}

Zilliz Cloud でのリコール率は、通常、検索によって正常に取得された関連結果の割合を指します。これは、コレクションからすべての関連アイテムを回収するシステムの能力を測定するものです。

![OdMnbeHYOoAEqKxNEEnc9SwNnmf](https://zdoc-images.s3.us-west-2.amazonaws.com/odmnbehyooaeqkxneenc9swnnmf.png "OdMnbeHYOoAEqKxNEEnc9SwNnmf")

検索のリコール率を計算するには、取得された関連アイテムの数を、取得すべき適用可能なアイテムの総数で割ることができます。例えば、検索が100個の関連アイテムのうち90個を取得した場合、リコール率は **0.9** または **90%** となります。

高いリコール率は通常、より正確な検索結果を示しますが、時間がかかる場合があります。ベクトル検索の精度と効率のバランスを取るために、リコール率を調整したい場合があります。

## 検索リクエストの設定\{#set-up-a-search-request}

調整可能なリコールで検索リクエストを設定するには、検索パラメータ内に `level` パラメータを含める必要があります。以下のように設定します。

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

`level` パラメータは `1` から `10` の範囲で設定でき、デフォルト値は `1` です。このデフォルト値ではリコール率が 90% となり、ほとんどのユースケースで十分です。

リコール率を高くする必要がある場合（**99%** 以上）、`level` パラメータを `6` から `10` の間の整数に設定してみてください。検索効率を考慮しないのであれば、このパラメータを `10` に設定することで最も精度の高い結果を得られます。

<Admonition type="info" icon="📘" title="Notes">

<p>最上位レベルの設定でも要件を満たせない場合は、<a href="https://zilliz.com/contact-sales">Zilliz Cloud サポート</a>までお問い合わせください。</p>

</Admonition>

## リコール率の調整\{#tune-recall-rate}

Zilliz Cloud では、調整プロセスを支援するために `enable_recall_calculation` という別の検索パラメータも導入されています。このパラメータを `True` に設定すると、Zilliz Cloud は現在の検索に対するリコール率を推定し、その推定値を検索結果とともに返します。

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

上記の検索リクエストを使用すると、現在の検索の推定リコール率を次のように取得できます。

```python
# data: [...], recalls: [0.98]
```

推定プロセス中に、Zilliz Cloud は以下の処理を実行します。

1. ユーザーが定義した値に設定された `level` パラメータを使用して検索を実行し、
1. 内部の高精度モードで別の検索を実行します。
1. 2 番目の検索結果を正解（ground truth）として使用し、リコール率を推定します。

`enable_recall_calculation` を `True` に設定すると、`level` パラメータの値を調整して複数のリコール率を取得できます。これらの推定値と各検索の所要時間を考慮することで、適切な level 設定を概算できます。

<Admonition type="info" icon="📘" title="Notes">

<p><code>enable_recall_calculation</code> を有効にすると検索パフォーマンスに影響を与える可能性があるため、本番環境での使用は推奨されません。</p>

</Admonition>

## 制限\{#limits}

現在、この機能は Zilliz Cloud クラスターにおける基本的なベクトル検索、フィルター検索、および範囲検索でのみ利用可能です。

