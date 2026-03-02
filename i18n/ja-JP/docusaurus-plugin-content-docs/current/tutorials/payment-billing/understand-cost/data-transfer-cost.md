---
title: "データ転送コスト | Cloud"
slug: /data-transfer-cost
sidebar_label: "データ転送"
beta: FALSE
notebook: FALSE
description: "データ転送とは、Zilliz Cloudへのトラフィック、Zilliz Cloudからインターネットへのトラフィック、またはZilliz Cloud内の2つのリソース間のトラフィックを指します。Zilliz Cloudにおけるデータ転送コストは、転送されたデータ量に基づいて課金されます。 | Cloud"
type: origin
token: BClgwKlHaiushBkPPssclTkYnef
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - データ転送
  - コスト
  - 課金
  - 画像検索
  - LLMs
  - 機械学習
  - RAG

---

import Admonition from '@theme/Admonition';


# データ転送コスト

データ転送とは、Zilliz Cloudへのトラフィック、Zilliz Cloudからインターネットへのトラフィック、またはZilliz Cloud内の2つのリソース間のトラフィックを指します。Zilliz Cloudにおけるデータ転送コストは、転送されるデータ量に基づいて課金されます。

<Admonition type="info" icon="📘" title="Notes">

<p>各組織は月額10ドルのデータ転送割引を受けられ、最初の100GBをカバーします。</p>

</Admonition>

以下の表は、異なるデータ転送タイプを比較したものです。

<table>
   <tr>
     <th><p><strong>データ転送タイプ</strong></p></th>
     <th><p><strong>説明</strong></p></th>
     <th><p><strong>料金</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>インターネットエグレス</strong></p></td>
     <td><p>パブリックインターネットエグレスとは、Zilliz Cloudクラスターからパブリックインターネット、またはパブリックエンドポイントを介してアクセスされる別のクラウドプロバイダーへのアウトバウンドトラフィックです。</p><p>これは、パブリックエンドポイントを介した読み取り、書き込み、クエリ、または移行トラフィックが現在のクラウドプロバイダーのネットワークを離れるときに発生します。</p><p>同じクラウドプロバイダーのバックボーン内（例：リージョン間）にとどまるトラフィックは、インターネットエグレスではなく、リージョン間データ転送として別途課金されます。</p></td>
     <td><p>最も高価で、コストは送信先によって決まります。</p><p>詳細な料金については、<a href="https://zilliz.com/pricing/pricing-guide">Zilliz Cloud料金ガイド</a>を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><strong>リージョン間</strong></p></td>
     <td><p>リージョン間データ転送とは、同じクラウドプロバイダーの異なるリージョン間で移動されるデータを指します。これには以下が含まれます。</p><ul><li><p>リージョン間クラスター移行</p></li><li><p>リージョン間バックアップ</p><p>パブリックエンドポイントを介してアクセスされる、同じクラウドプロバイダーの他のリージョンにあるクラスターへのトラフィック。</p></li></ul></td>
     <td><ul><li><p>AWSの場合、コストは送信元大陸によって決まります。</p></li><li><p>AzureおよびGoogle Cloudの場合、コストは送信元と送信先の両方の大陸によって決まります。</p><p>詳細な料金については、<a href="https://zilliz.com/pricing/pricing-guide">Zilliz Cloud料金ガイド</a>を参照してください。</p></li></ul></td>
   </tr>
   <tr>
     <td><p><strong>リージョン内</strong></p></td>
     <td><p>リージョン内データ転送とは、クラウドプロバイダーの同じリージョン内でのデータ転送を指します。これには以下が含まれます。</p><ul><li><p>監査ログをリージョン内クラウドオブジェクトストレージに転送する</p></li><li><p>同じリージョンにデプロイされたZilliz Cloudクラスター間のデータ移行。</p></li></ul></td>
     <td><p>無料</p></td>
   </tr>
</table>

## データ転送コストの発生源{#sources-of-data-transfer-cost}

以下のシナリオでデータ転送の料金が請求されます。

- [検索/クエリ](./search-query-get)などの操作

- [監査ログ](./audit-logs)をクラウドオブジェクトストレージに転送する

- [ゼロダウンタイム移行](./zero-downtime-migration)データ同期

- [オフライン移行](./offline-migration)

- [リージョン間バックアップ](/docs/backup-to-other-regions)

<Admonition type="info" icon="📘" title="Note">

<p>データ転送が同じクラウドリージョン内で発生する場合、コストは0ドルになることがあります。</p>
<p>検索やクエリなどの操作にプライベートエンドポイントを使用する場合、データ転送コストは発生しません。</p>

</Admonition>

## コスト計算{#cost-calculation}

```plaintext
Data Transfer Cost = Data Transfer Unit Price × Transferred Data Size
```

- **データ転送料金**: クラスターのクラウドプロバイダーとリージョン、データ転送タイプ（パブリックインターネット、クロスリージョン、またはイントラリージョン）によって決定されます。詳細な料金については、[Zilliz Cloud 料金ガイド](https://zilliz.com/pricing/pricing-guide)を参照してください。

- **転送データサイズ**: GB単位で測定され、ネットワーク経由で送信されたデータのサイズに基づいて計算されます。

## 例\{#examples}

ストレージコストがどのように計算されるかを理解するのに役立ついくつかの例を以下に示します。

### 例1: パブリックインターネットからのデータ転送\{#example-1-public-internet-egress}

クラスターがAWS us-east-1（バージニア）にデプロイされており、パブリックインターネット経由で検索結果をクライアントに返す場合を想定します。

- **転送データサイズ**: 1ヶ月で500 GB

- **転送タイプ**: パブリックインターネットからのデータ転送

- **送信元大陸**: 北米

- **単価**: &#36;0.09/GB（北米からのパブリックインターネットからのデータ転送料金に基づく）

データ転送コストは `$0.09 × 500 = $45.00` です。

### 例2: クロスリージョン転送\{#example-2-cross-region-transfer}

クラスターがGCP us-west1（オレゴン）にデプロイされており、このクラスターを2つの異なるリージョン、GCP us-central1（アイオワ）とGCP europe-west3（フランクフルト）にバックアップする必要がある場合を想定します。

- **バックアップファイルサイズ**: 20 GB

- **転送タイプ**: クロスリージョン転送

- **送信元大陸**: 北米

- **送信先大陸**: 北米およびヨーロッパ

- **単価**: 

    - 北米（GCP us-west1）から北米（GCP us-central1）へのデータ転送は、**&#36;0.02/GB**の料金で課金されます。

    - 北米（GCP us-west1）からヨーロッパ（GCP europe-west3）へのデータ転送は、**&#36;0.05/GB**の料金で課金されます。

データ転送コストは `$0.02 × 20 + $0.05 x 20 = $1.40` です。

### 例3: イントラリージョン転送\{#example-3-intra-region-transfer}

AWS us-east-1（バージニア）にデプロイされたクラスターで監査ログを有効にしており、このクラスターの監査ログを同じクラウドリージョンに作成されたAWS S3バケットに転送する必要がある場合を想定します。この場合のデータ転送コストは、イントラリージョンデータ転送が無料であるため、**&#36;0**になります。

