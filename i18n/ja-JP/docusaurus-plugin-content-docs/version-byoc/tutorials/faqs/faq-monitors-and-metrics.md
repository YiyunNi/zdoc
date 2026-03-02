---
title: "FAQ: モニターとメトリクス | BYOC"
slug: /faq-monitors-and-metrics
sidebar_label: "FAQ: モニターとメトリクス"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud で発生する可能性のあるモニターとメトリクスに関する問題と、それに対応する解決策をリストアップします。 | BYOC"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 9

---

# FAQ: モニターとメトリクス

このトピックでは、Zilliz Cloud で発生する可能性のあるモニターとメトリクスに関する問題と、それに対応する解決策をリストアップします。

## 目次

- [頻繁な挿入および削除操作中に、クラスターの CU 容量とストレージ使用量が一時的に増加するのはなぜですか？](#why-does-the-clusters-cu-capacity-and-storage-usage-increase-temporarily-during-frequent-insert-and-delete-operations)
- [クラスターのメモリクォータが使い果たされ、結果としてデータを挿入できない場合、どうすればよいですか？](#what-can-i-do-if-my-cluster-memory-quota-has-been-exhausted-and-i-cannot-insert-data-as-a-result)
- [コレクションを削除してもメモリ消費量が減少しないのはなぜですか？](#why-doesnt-the-memory-consumption-decrease-even-if-i-dropped-a-collection)

## よくある質問




### 頻繁な挿入および削除操作中に、クラスターの CU 容量とストレージ使用量が一時的に増加するのはなぜですか？{#why-does-the-clusters-cu-capacity-and-storage-usage-increase-temporarily-during-frequent-insert-and-delete-operations}

頻繁な挿入および削除操作は、*[コンパクション](https://milvus.io/blog/2022-2-21-compact.md)* と呼ばれる内部プロセスをトリガーします。

- **挿入の場合**: コンパクションは、より小さなセグメントをより大きなセグメントに結合し、検索パフォーマンスを大幅に向上させることができます。

- **削除の場合**: データはすぐに削除されません。代わりに、削除対象としてマークされ、コンパクション後にのみ削除されます。

コンパクション中、新しいセグメントが一時的に作成されるため、ストレージ使用量と CU 容量が一時的に増加する可能性があります。ガベージコレクション (GC) が発生すると、古いセグメントが削除され、ストレージと CU 容量の両方が期待されるレベルに戻ります。

この動作は正常であり、システムパフォーマンスには影響しません。

### クラスターのメモリクォータが使い果たされ、結果としてデータを挿入できない場合、どうすればよいですか？{#what-can-i-do-if-my-cluster-memory-quota-has-been-exhausted-and-i-cannot-insert-data-as-a-result}

次の2つの方法を試すことができます。

1. クラスターをより大きな CU サイズに[スケールアップ](./manage-cluster)します。CU サイズが大きいクラスターは、より多くのデータを処理できます。

1. 頻繁に使用されないロードされたコレクションをリリースして、メモリ使用量を節約します。

### コレクションを削除してもメモリ消費量が減少しないのはなぜですか？{#why-doesnt-the-memory-consumption-decrease-even-if-i-dropped-a-collection}

削除されたコレクションのデータは24時間後にクリーンアップされます。24時間経過してもメモリ消費量が減少しない場合は、[リクエストを送信](https://support.zilliz.com/hc/en-us)してください。
