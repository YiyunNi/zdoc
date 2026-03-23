---
title: "FAQ: リソース計画 | Cloud"
slug: /faq-resource-planning
sidebar_label: "FAQ: リソース計画"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud でリソースを計画する際に発生する可能性のある問題と、それに対応する解決策を一覧表示します。"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 6

---

# FAQ: リソース計画

このトピックでは、Zilliz Cloud でリソースを計画する際に発生する可能性のある問題と、それに対応する解決策をリストアップします。

## 目次

- [Compute Unit (CU) とは何ですか？](#what-is-a-compute-unit-cu)
- [vCU とは何ですか？どのように計算されますか？](#what-is-a-vcu-how-does-it-get-calculated)
- [未使用のクラスターにかかる費用を避けるにはどうすればよいですか？](#how-can-i-avoid-expenses-on-unused-clusters)
- [Zilliz Cloud の利用コストを見積もるにはどうすればよいですか？](#how-can-i-estimate-the-cost-of-using-zilliz-cloud)
- [Zilliz Cloud は Azure へのデプロイをサポートしていますか？](#does-zilliz-cloud-support-deployment-on-azure)
- [新しいクラウドリージョンをリクエストするにはどうすればよいですか？](#how-can-i-request-a-new-cloud-region)
- [どのプランを利用しているかを知るにはどうすればよいですか？](#how-can-i-know-which-plan-i-am-on)
- [特定のコレクションにはいくつのクエリ CU が必要ですか？](#how-many-query-cus-do-i-need-for-a-given-collection)
- [どのタイプのクラスターを選択すべきですか？](#which-type-of-cluster-should-i-pick)
- [パフォーマンス最適化済み CU と 容量最適化済み CU の違いは何ですか？](#whats-the-difference-between-performance-optimized-cu-and-capacity-optimized-cu)

## FAQ




### Compute Unit (CU) とは何ですか？\{#what-is-a-compute-unit-cu}

Compute Unit (CU) は、インデックスと検索リクエストを処理するためのハードウェアリソースのグループです。CU は、検索サービスをデプロイするための完全に管理された物理ノードと考えることができます。

詳細については、[適切な CU の選択](./cu-types-explained)を参照してください。

### vCU とは何ですか？どのように計算されますか？\{#what-is-a-vcu-how-does-it-get-calculated}

vCU は、読み取り操作（検索やクエリなど）と書き込み操作（挿入、更新、一括挿入、削除など）によって消費されるリソースを測定するために使用される仮想コンピューティングユニットです。書き込まれたり読み取られたりするデータ量は、GB から vCU に変換されます。詳細については、[Serverless Cluster Cost](./serverless-cluster-cost) を参照してください。

### 未使用のクラスターにかかる費用を避けるにはどうすればよいですか？\{#how-can-i-avoid-expenses-on-unused-clusters}

コンピューティングコストを節約するために、未使用のクラスターを一時停止することをお勧めします。必要に応じて後で再開できます。

### Zilliz Cloud の利用コストを見積もるにはどうすればよいですか？\{#how-can-i-estimate-the-cost-of-using-zilliz-cloud}

[計算ツール](https://zilliz.com/pricing)を使用してコスト見積もりを取得するか、詳細については[コストの理解](./understand-cost)を参照してください。

### Zilliz Cloud は Azure へのデプロイをサポートしていますか？\{#does-zilliz-cloud-support-deployment-on-azure}

はい。Zilliz Cloud は現在 Azure へのデプロイをサポートしています。[クラウドプロバイダーとリージョン](./cloud-providers-and-regions)を参照してください。

### 新しいクラウドリージョンをリクエストするにはどうすればよいですか？\{#how-can-i-request-a-new-cloud-region}

Zilliz Cloud の新しいクラウドプロバイダーリージョンをリクエストするには、[フォームに記入してください](https://zilliz.com/cloud-region-request)。

### どのプランを利用しているかを知るにはどうすればよいですか？\{#how-can-i-know-which-plan-i-am-on}

プランを表示するには、プロジェクトリストに移動します。各プロジェクトのプランが表示されます。

![XMRtb3eYsoWUnsxQM0ecyjj2nqf](https://zdoc-images.s3.us-west-2.amazonaws.com/xmrtb3eysowunsxqm0ecyjj2nqf.png "XMRtb3eYsoWUnsxQM0ecyjj2nqf")

### 特定のコレクションにはいくつのクエリ CU が必要ですか？\{#how-many-query-cus-do-i-need-for-a-given-collection}

- パフォーマンス最適化済み: 最大 150 万個の 768 次元ベクトルをサポートします。

- 容量最適化済み: 最大 500 万個の 768 次元ベクトルをサポートします。

- Tiered-storage: 最大 2000 万個の 768 次元ベクトルをサポートします。

これらの見積もりは、プライマリキーのみを持つベクトルに基づいています。ID やラベルなどの追加のスカラーフィールドは容量を減らす可能性があります。正確な評価のために、独自のテストを実施することをお勧めします。

### どのタイプのクラスターを選択すべきですか？\{#which-type-of-cluster-should-i-pick}

リアルタイムアプリケーションで即座の検索結果と高い同時実行トラフィックが必要な場合は、パフォーマンス最適化済み を選択してください。
信頼性の高い検索速度を維持しながら、大規模なベクトルデータセットを処理する必要がある場合は、容量最適化済み を選択してください。
明確なホットデータとコールドデータのパターンを持つ超大規模でコストに敏感なワークロードを処理する必要がある場合は、Tiered-storage クラスターを選択してください。Tiered-storage クラスターを選択するには、クラスターに少なくとも 8 つのクエリ CU が必要です。

### パフォーマンス最適化済み CU と 容量最適化済み CU の違いは何ですか？\{#whats-the-difference-between-performance-optimized-cu-and-capacity-optimized-cu}

「パフォーマンス最適化済み CU」は、低レイテンシまたは高スループットの類似性検索に適しています。このオプションは、高い検索パフォーマンスのシナリオに最適です。

「容量最適化済み CU」は、パフォーマンス最適化済み CU オプションの 5 倍のデータ量に適しています。このオプションは、ストレージ容量を増やすシナリオに最適です。

詳細については、[適切な CU の選択](./cu-types-explained)を参照してください。
