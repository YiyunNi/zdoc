---
title: "FAQ: はじめに | CLOUD"
slug: /faq-get-started
sidebar_label: "FAQ: はじめに"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Zilliz Cloud の利用を開始する際に発生する可能性のある問題と、その解決策をリストアップしています。 | CLOUD"
type: origin
token: EV41wG08BiOWW8kbo9xcTGoPnKd
sidebar_position: 1

---

# FAQ: はじめに

このトピックでは、Zilliz Cloud を使い始める際に発生する可能性のある問題と、それに対応する解決策をリストアップします。

## 目次

- [Zilliz Cloud と他のベクトル検索ソリューションとのパフォーマンス比較はありますか？](#is-there-any-performance-comparison-between-zilliz-cloud-and-other-vector-search-solutions)
- [Zilliz Cloud はどのタイプのインデックスをサポートしていますか？](#which-type-of-index-is-supported-by-zilliz-cloud)
- [Zilliz Cloud の検索レイテンシーはどのくらいですか？](#what-is-the-search-latency-of-zilliz-cloud)
- [価格はすべてのリージョンで同じですか？](#is-pricing-the-same-in-every-region)
- [無料トライアル終了後はどうなりますか？](#what-happens-after-the-free-trial)
- [マーケットプレイスでの Zilliz Cloud の価格はどのくらいですか？](#what-is-the-pricing-of-zilliz-cloud-on-marketplaces)
- [追加のクレジットを申請できますか？](#can-i-apply-for-more-credits)
- [無料トライアルを延長できますか？](#can-i-extend-my-free-trial)
- [さらに技術サポートを受けるにはどうすればよいですか？](#how-can-i-get-further-technical-support)

## よくある質問

### Zilliz Cloud と他のベクトル検索ソリューションとのパフォーマンス比較はありますか？\{#is-there-any-performance-comparison-between-zilliz-cloud-and-other-vector-search-solutions}

はい、あります。[VectorDBBench](https://zilliz.com/vector-database-benchmark-tool) は、Zilliz Cloud と他の主要なベクトルデータベースおよびクラウドサービスのパフォーマンスを比較するためのベクトルデータベースベンチマークツールです。

### Zilliz Cloud はどのタイプのインデックスをサポートしていますか？\{#which-type-of-index-is-supported-by-zilliz-cloud}

現在、Zilliz Cloud は AUTOINDEX のみをサポートしています。これは、より優れた検索パフォーマンスを実現するのに役立つ独自のインデックスタイプです。詳細については、[AUTOINDEX の説明](./autoindex-explained) を参照してください。

ただし、サポートしている [インデックス](https://milvus.io/docs/index.md) のいずれかの使用に慣れている場合は、[リクエストを送信](https://support.zilliz.com/hc/en-us) してください。お客様のアプリケーションの要求を評価し、インデックスを有効にするお手伝いをいたします。

### Zilliz Cloud の検索レイテンシーはどのくらいですか？\{#what-is-the-search-latency-of-zilliz-cloud}

検索レイテンシーは、CU タイプとデータ量によって異なります。

<table>
   <tr>
     <th><p>top_k</p></th>
     <th><p>パフォーマンス最適化済み CU のレイテンシー (768-dim 1M ベクトル)</p></th>
     <th><p>容量最適化済み CU のレイテンシー (768-dim 5M ベクトル)</p></th>
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

### 価格はすべてのリージョンで同じですか？\{#is-pricing-the-same-in-every-region}

簡単に言えば、クラウドサービスの価格はプロバイダーやリージョンによって異なることがよくあります。これらの違いには、クラウドデータベースサービスが依存する基盤となる物理リソースのコストなど、いくつかの要因が寄与しています。詳細については、[価格](https://zilliz.com/pricing) を参照してください。

### 無料トライアル終了後はどうなりますか？\{#what-happens-after-the-free-trial}

無料トライアルが終了しても、フリークラスターには引き続きアクセスできます。ただし、サーバーレスクラスターと専用クラスターのすべてのデータはごみ箱に移動され、30日間保持されます。クラスターデータを安全に復元するには、支払い方法を提供してください。詳細については、[Zilliz Cloud を無料で試す](./free-trials#use-free-trial) を参照してください。

### マーケットプレイスでの Zilliz Cloud の価格はどのくらいですか？\{#what-is-the-pricing-of-zilliz-cloud-on-marketplaces}

マーケットプレイスの価格条件の詳細については、[支払いと請求](./payment-billing#marketplace-pricing-terms) を参照してください。

### 追加のクレジットを申請できますか？\{#can-i-apply-for-more-credits}

Zilliz Cloud に仕事用メールで登録すると、100ドルの無料クレジットを受け取ることができます。マーケットプレイスで Zilliz Cloud を購読すると、さらに100ドルのクレジットを獲得できます。追加のクレジットや割引については、[営業担当者にお問い合わせください](https://zilliz.com/contact-sales)。

### 無料トライアルを延長できますか？\{#can-i-extend-my-free-trial}

はい、できます。Zilliz Cloud に登録すると、30日間有効な100ドルのクレジットを受け取ります。[支払い方法を追加する](./payment-billing) ことで、これらのクレジットの有効期間を1年間に延長できます。

### さらに技術サポートを受けるにはどうすればよいですか？\{#how-can-i-get-further-technical-support}

Zilliz Cloud の [サポートポータル](https://support.zilliz.com/hc/en-us) からリクエストを送信してください。
