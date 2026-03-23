---
title: "FAQ: モニターとメトリクス | BYOC"
slug: /faq-monitors-and-metrics
sidebar_label: "FAQ: モニターとメトリクス"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud で発生する可能性のあるモニターとメトリクスに関する問題とその解決策を一覧にしています。| BYOC"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 9

---

# FAQ: モニターとメトリクス

このトピックでは、Zilliz Cloudでモニターやメトリクスに関して発生する可能性のある問題と、それに対する解決策を紹介します。

## 目次

- [頻繁な挿入および削除操作中にクラスターのCU容量とストレージ使用量が一時的に増加するのはなぜですか？](#why-does-the-clusters-cu-capacity-and-storage-usage-increase-temporarily-during-frequent-insert-and-delete-operations)
- [クラスターのメモリクォータが枯渇し、データを挿入できなくなった場合はどうすればよいですか？](#what-can-i-do-if-my-cluster-memory-quota-has-been-exhausted-and-i-cannot-insert-data-as-a-result)
- [コレクションを削除してもメモリ消費量が減少しないのはなぜですか？](#why-doesnt-the-memory-consumption-decrease-even-if-i-dropped-a-collection)

## よくある質問




### 頻繁な挿入および削除操作中にクラスターのCU容量とストレージ使用量が一時的に増加するのはなぜですか？\{#why-does-the-clusters-cu-capacity-and-storage-usage-increase-temporarily-during-frequent-insert-and-delete-operations}

頻繁な挿入および削除操作は、*[compaction](https://milvus.io/blog/2022-2-21-compact.md)* と呼ばれる内部プロセスをトリガーします。

- **挿入の場合**: Compaction combines smaller segments into larger ones, which can significantly improve search performance.

- **削除の場合**: データ is not immediately deleted; instead, it’s marked for deletion and removed only after compaction.

Compaction中には新しいセグメントが一時的に作成されるため、ストレージ使用量とCU容量が短期間増加する可能性があります。ガベージコレクション（GC）が実行されると、古いセグメントが削除され、ストレージとCU容量は期待されるレベルまで低下します。

この動作は正常であり、システムパフォーマンスに影響はありません。

### クラスターのメモリクォータが枯渇し、データを挿入できなくなった場合はどうすればよいですか？\{#what-can-i-do-if-my-cluster-memory-quota-has-been-exhausted-and-i-cannot-insert-data-as-a-result}

以下の2つの方法をお試しください。

1. クラスターをより大きなCUサイズに[スケールアップ](./manage-cluster)します。CUサイズが大きいクラスターは、より多くのデータを処理できます。

1. 使用頻度の低いロード済みコレクションを解放して、メモリ使用量を節約します。

### コレクションを削除してもメモリ消費量が減少しないのはなぜですか？\{#why-doesnt-the-memory-consumption-decrease-even-if-i-dropped-a-collection}

削除されたコレクションのデータは、24時間後にクリーンアップされます。24時間経過後もメモリ消費量が減少しない場合は、[サポートリクエストを送信](https://support.zilliz.com/hc/en-us)してください。
