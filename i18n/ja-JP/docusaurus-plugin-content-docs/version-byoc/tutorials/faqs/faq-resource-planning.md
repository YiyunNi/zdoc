---
title: "FAQ: リソース計画 | BYOC"
slug: /faq-resource-planning
sidebar_label: "FAQ: リソース計画"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud でリソースを計画する際に発生する可能性のある問題と、それに対応する解決策をリストアップします。 | BYOC"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 6

---

# FAQ: リソース計画

このトピックでは、Zilliz Cloud でリソースを計画する際に発生する可能性のある問題と、それに対応する解決策をリストアップします。

## 目次

- [Compute Unit (CU) とは何ですか？](#what-is-a-compute-unit-cu)
- [未使用のクラスターにかかる費用を避けるにはどうすればよいですか？](#how-can-i-avoid-expenses-on-unused-clusters)
- [特定のコレクションにはいくつのクエリ CU が必要ですか？](#how-many-query-cus-do-i-need-for-a-given-collection)
- [どのタイプのクラスターを選択すべきですか？](#which-type-of-cluster-should-i-pick)
- [Performance-optimized CU と Capacity-optimized CU の違いは何ですか？](#whats-the-difference-between-performance-optimized-cu-and-capacity-optimized-cu)

## FAQ




### Compute Unit (CU) とは何ですか？{#what-is-a-compute-unit-cu}

Compute Unit (CU) は、インデックスと検索リクエストを処理するためのハードウェアリソースのグループです。CU は、検索サービスをデプロイするための完全に管理された物理ノードと考えることができます。

詳細については、[適切な CU の選択](./cu-types-explained)を参照してください。

### 未使用のクラスターにかかる費用を避けるにはどうすればよいですか？{#how-can-i-avoid-expenses-on-unused-clusters}

コンピューティングコストを節約するために、未使用のクラスターを一時停止することをお勧めします。必要に応じて後で再開できます。

### 特定のコレクションにはいくつのクエリ CU が必要ですか？{#how-can-i-avoid-expenses-on-unused-clusters}

- Performance-optimized: 150万個までの768次元ベクトルをサポートします。

- Capacity-optimized: 500万個までの768次元ベクトルをサポートします。

- Tiered-storage: 2000万個までの768次元ベクトルをサポートします。

これらの見積もりは、プライマリキーのみを持つベクトルに基づいています。IDやラベルなどの追加のスカラーフィールドは、容量を減少させる可能性があります。正確な評価のために、独自のテストを実施することをお勧めします。

### どのタイプのクラスターを選択すべきですか？{#which-type-of-cluster-should-i-pick}

リアルタイムアプリケーションで即座の検索結果と高い同時実行トラフィックが必要な場合は、Performance-optimized を選択してください。
信頼性の高い検索速度を維持しながら、大規模なベクトルデータセットを処理する必要がある場合は、Capacity-optimized を選択してください。
ホットデータとコールドデータの明確なパターンを持つ超大規模でコストに敏感なワークロードを処理する必要がある場合は、Tiered-storage クラスターを選択してください。Tiered-storage クラスターを選択するには、クラスターに少なくとも8つのクエリ CU が必要です。

### Performance-optimized CU と Capacity-optimized CU の違いは何ですか？{#whats-the-difference-between-performance-optimized-cu-and-capacity-optimized-cu}

「Performance-optimized CU」は、低レイテンシまたは高スループットの類似性検索に適しています。このオプションは、高い検索パフォーマンスが求められるシナリオに最適です。

「Capacity-optimized CU」は、Performance-optimized CU オプションの5倍のデータ量を処理できます。このオプションは、ストレージ容量の増加が求められるシナリオに最適です。

詳細については、[適切な CU の選択](./cu-types-explained)を参照してください。
