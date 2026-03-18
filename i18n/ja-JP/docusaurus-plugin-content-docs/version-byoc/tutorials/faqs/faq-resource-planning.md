---
title: "FAQ: リソース計画 | BYOC"
slug: /faq-resource-planning
sidebar_label: "FAQ: リソース計画"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud でリソースを計画する際に発生する可能性のある問題と、それに対応する解決策を一覧にしています。| BYOC"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 6

---

# FAQ: リソース計画

このトピックでは、Zilliz Cloud 上でリソースを計画する際に発生する可能性のある問題と、それに対応する解決策を一覧にしています。

## 目次

- [Compute Unit (CU) とは何ですか？](#what-is-a-compute-unit-cu)
- [使用されていないクラスターによる費用をどのように回避できますか？](#how-can-i-avoid-expenses-on-unused-clusters)
- [特定のコレクションにはいくつのクエリ CU が必要ですか？](#how-many-query-cus-do-i-need-for-a-given-collection)
- [どのタイプのクラスターを選ぶべきですか？](#which-type-of-cluster-should-i-pick)
- [パフォーマンス最適化済み CU と容量最適化済み CU の違いは何ですか？](#whats-the-difference-between-performance-optimized-cu-and-capacity-optimized-cu)

## よくある質問




### What is a Compute Unit (CU)?\{#what-is-a-compute-unit-cu}

Compute Unit (CU) は、インデックスと検索リクエストを提供するためのハードウェアリソースのグループです。CU は、検索サービスをデプロイするためのフルマネージド型の物理ノードと簡単に考えることができます。

詳細については、[適切な CU の選択](./cu-types-explained) をご覧ください。

### How can I avoid expenses on unused clusters?\{#how-can-i-avoid-expenses-on-unused-clusters}

計算コストを節約するために、使用されていないクラスターの一時停止をお勧めします。必要に応じて後で再開することができます。

### How many query CUs do I need for a given collection?\{#how-many-query-cus-do-i-need-for-a-given-collection}

- パフォーマンス最適化済み：最大 150 万個の 768 次元ベクトルをサポートします。

- 容量最適化済み：最大 500 万個の 768 次元ベクトルをサポートします。

- Tiered-storage：最大 2000 万個の 768 次元ベクトルをサポートします。

これらの見積もりは、プライマリキーのみを持つベクトルに基づいています。ID やラベルなどの追加のスカラーフィールドがあると、容量が減少する可能性があります。正確な評価のためには、独自のテストを実施することをお勧めします。

### Which type of cluster should I pick?\{#which-type-of-cluster-should-i-pick}

リアルタイムアプリケーションのために即時の検索結果と高い同時トラフィックが必要な場合は、パフォーマンス最適化済みを選択してください。
信頼性の高い検索速度を維持しながら大規模なベクトルデータセットを処理する必要がある場合は、容量最適化済みを選択してください。
明確なホットデータとコールドデータのパターンを持つ、超大規模でコストに敏感なワークロードを処理する必要がある場合は、Tiered-storage クラスターを選択してください。Tiered-storage クラスターを選択するには、クラスターに少なくとも 8 つのクエリ CU が必要です。

### What's the difference between パフォーマンス最適化済み CU and 容量最適化済み CU?\{#whats-the-difference-between-performance-optimized-cu-and-capacity-optimized-cu}

「パフォーマンス最適化済み CU」は、低レイテンシまたは高スループットの類似性検索に適しています。このオプションは、高い検索パフォーマンスが求められるシナリオに最適です。

「容量最適化済み CU」は、パフォーマンス最適化済み CU オプションよりも 5 倍大きいデータ量に適しています。このオプションは、ストレージ容量を増やす必要があるシナリオに最適です。

詳細については、[適切な CU の選択](./cu-types-explained) をご覧ください。
