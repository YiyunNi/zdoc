---
title: "FAQ: はじめに | BYOC"
slug: /faq-get-started
sidebar_label: "FAQ: はじめに"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud の利用を開始する際に発生する可能性のある問題と、それに対応する解決策をリストアップしています。 | BYOC"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 1

---

# FAQ: はじめに

このトピックでは、Zilliz Cloud の使用を開始する際に発生する可能性のある問題と、それに対応する解決策をリストアップします。

## 目次

- [Zilliz Cloud と他のベクトル検索ソリューションとのパフォーマンス比較はありますか？](#is-there-any-performance-comparison-between-zilliz-cloud-and-other-vector-search-solutions)
- [Zilliz Cloud はどのタイプのインデックスをサポートしていますか？](#which-type-of-index-is-supported-by-zilliz-cloud)
- [Zilliz Cloud の検索レイテンシーはどのくらいですか？](#what-is-the-search-latency-of-zilliz-cloud)
- [さらに技術的なサポートを受けるにはどうすればよいですか？](#how-can-i-get-further-technical-support)

## FAQ




### Zilliz Cloud と他のベクトル検索ソリューションとのパフォーマンス比較はありますか？{#is-there-any-performance-comparison-between-zilliz-cloud-and-other-vector-search-solutions}

はい、あります。[VectorDBBench](https://zilliz.com/vector-database-benchmark-tool) は、Zilliz Cloud と他の主要なベクトルデータベースおよびクラウドサービスのパフォーマンスを比較するためのベクトルデータベースベンチマークツールです。

### Zilliz Cloud はどのタイプのインデックスをサポートしていますか？{#which-type-of-index-is-supported-by-zilliz-cloud}

現在、Zilliz Cloud は AUTOINDEX のみをサポートしています。これは、より優れた検索パフォーマンスを実現できる独自のインデックスタイプです。詳細については、[AUTOINDEX の説明](./autoindex-explained) を参照してください。

ただし、[サポートしているインデックス](https://milvus.io/docs/index.md) の使用に慣れている場合は、[リクエストを送信](https://support.zilliz.com/hc/en-us) してください。お客様のアプリケーションの要件を評価し、インデックスを有効にするお手伝いをいたします。

### Zilliz Cloud の検索レイテンシーはどのくらいですか？{#what-is-the-search-latency-of-zilliz-cloud}

検索レイテンシーは、CU タイプとデータ量によって異なります。

<table>
   <tr>
     <th><p>top_k</p></th>
     <th><p>パフォーマンス最適化 CU のレイテンシー (768 次元 1M ベクトル)</p></th>
     <th><p>容量最適化 CU のレイテンシー (768 次元 5M ベクトル)</p></th>
   </tr>
   <tr>
     <td><p>10</p></td>
     <td><p>&lt; 10 ms</p></td>
     <td><p>&lt; 50 ms</p></td>
   </tr>
   <tr>
     <td><p>100</p></td>
     <td><p>&lt; 10 ms</p></td>
     <td><p>&lt; 50 ms</p></td>
   </tr>
   <tr>
     <td><p>250</p></td>
     <td><p>&lt; 10 ms</p></td>
     <td><p>&lt; 50 ms</p></td>
   </tr>
   <tr>
     <td><p>1000</p></td>
     <td><p>10 - 20 ms</p></td>
     <td><p>50 - 100 ms</p></td>
   </tr>
</table>

テスト結果の詳細については、[適切な CU の選択](./cu-types-explained) を参照してください。

### さらに技術的なサポートを受けるにはどうすればよいですか？{#how-can-i-get-further-technical-support}

Zilliz Cloud の [サポートポータル](https://support.zilliz.com/hc/en-us) からリクエストを送信してください。
