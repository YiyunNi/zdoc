---
title: "専用クラスターのコスト | Cloud"
slug: /dedicated-cluster-cost
sidebar_label: "専用クラスター"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud の専用クラスターは従量課金制を採用しており、主にクラスターが消費するコンピューティングリソースに対して課金されます。これにより、事前にリソースを過剰にプロビジョニングすることなく、実際に使用した分だけを支払うことができます。"
type: origin
token: J2prwh2KLis9oqkqNIAcU1d6nsd
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 専用
  - コスト
  - 請求
  - ANN検索
  - ベクトル埋め込みとは
  - ベクトルデータベースチュートリアル
  - ベクトルデータベースの仕組み

---

import Admonition from '@theme/Admonition';


# Dedicated Cluster の費用

Zilliz Cloud の Dedicated Cluster は従量課金制を採用しており、主にクラスターが消費するコンピューティングリソースに対して課金されます。これにより、事前にリソースを過剰にプロビジョニングすることなく、実際に使用した分だけを支払うことができます。

Dedicated Cluster の総費用は、以下の要素の合計です。

- [Vector database の費用](./dedicated-cluster-cost#vector-database-cost)

- [ストレージ費用](./dedicated-cluster-cost#storage-cost)

上記の2つの主要な課金項目に加えて、以下のオプションの追加料金が適用される場合があります。

- [データ転送費用](./data-transfer-cost)

- [監査ログ費用](./audit-log-cost)

## Vector database の費用{#vector-database-cost}

Vector database の費用には、Dedicated Cluster のコンピューティングリソースの使用料が含まれます。

### 費用計算{#cost-calculation}

```plaintext
Vector Database Cost = Query CU Unit Price x Total Number of Query CU x Cluster Runtime
```

- **クエリCU単価**: クラスターのリージョン、タイプ、プロジェクトプランによって決定されます。詳細な料金については、[Zilliz Cloud Pricing](http://zilliz.com/pricing) を参照してください。

- **クエリCUの総数**: レプリカを考慮した、クラスター内のクエリCUの総数。

    ```plaintext
    Total Number of Query CU = Number of Query CU × Replica Count
    ```

    例えば、2つのクエリCUと2つのレプリカを持つクラスターのCUの合計は4です。

- **クラスター実行時間**: クラスターが課金対象ステータスである合計時間（時間単位）：

    - 課金対象ステータス: Running、Modifyingなど。

    - 非課金対象ステータス: Creating、Suspending、Resuming、Suspendedなど。非課金対象ステータス中、CU料金は停止しますが、ストレージ料金は引き続き適用されます。

### 例{#example}

クラスター構成が以下の通りであると仮定します。

- **プロジェクトプラン:** Enterprise

- **クラスターデプロイオプション**: Dedicated

- **クラウドプロバイダーとリージョン:** AWS us-east-1 (バージニア)

- **クラスタータイプ:** パフォーマンス最適化

- **クエリCU数:** 8 CU

- **レプリカ数:** 2

- **クラスター** **実行時間:** 720時間 (1ヶ月)。

プラン、クラウドプロバイダーとリージョン、クラスタータイプの情報から、[料金ページ](https://zilliz.com/pricing)でCU単価が**&#36;0.248/時間**であることがわかります。

![find-cu-unit-price](https://zdoc-images.s3.us-west-2.amazonaws.com/find-cu-unit-price.png "find-cu-unit-price")

クエリCU数とレプリカ数に応じて、クエリCUの合計数は`8 CU x 2 レプリカ = 16 CU`です。

例のDedicatedクラスターのベクトルデータベースの総コストは、&#36;0.248 x 16 x 720 = &#36;2856.96です。

## ストレージコスト{#storage-cost}

ストレージコストはCUコストとは別に課金され、以下に依存します。

- クラスターのクラウドプロバイダーとリージョン、タイプ、プラン

- ストレージ使用量

詳細については、[ストレージ](./storage-cost)を参照してください。

## よくある質問{#faqs}

1. **Dedicatedクラスターを一時停止した場合、料金は発生しますか？**

    Dedicatedクラスターが一時停止されている間は、ベクトルデータベースのコストは停止しますが、クラスターを削除するまでストレージ料金は継続します。

1. **クラスターの作成中または一時停止中に課金されますか？**

    Creating、Suspending、Resuming、またはSuspendedステータス中は、ベクトルデータベースのコストは課金されません。ただし、ストレージコストは引き続き適用されます。

