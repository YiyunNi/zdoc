---
title: "支払いと請求 | Cloud"
slug: /payment-billing
sidebar_label: "支払いと請求"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloud のサービスを購読するための利用可能な方法と、請求書管理に関する関連情報について詳しく説明します。"
type: origin
token: FmkCwm1QHitB7uk9U9ncLnHrnse
sidebar_position: 14
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - プライベートリンク
  - 支払い
  - 請求
  - Zilliz
  - milvus ベクトルデータベース
  - milvus db
  - milvus vector db

---

import Admonition from '@theme/Admonition';


# 支払いと請求

このガイドでは、Zilliz Cloud でサービスを購読するための利用可能な方法と、請求書管理に関する関連メモについて詳しく説明します。

## 概要{#overview}

<Admonition type="info" icon="📘" title="Note">

<p>支払いと請求を管理するには、<strong>組織の所有者</strong>である必要があります。</p>

</Admonition>

### 支払いオプション{#payment-options}

<table>
   <tr>
     <th><p><strong>支払い方法</strong></p></th>
     <th><p><strong>説明</strong></p></th>
   </tr>
   <tr>
     <td><p>クレジット</p></td>
     <td><p>登録時またはZilliz Cloudイベントへの参加などによりクレジットを獲得できます。クレジットはZilliz Cloudサービスの利用費用をカバーするために使用できます。</p></td>
   </tr>
   <tr>
     <td><p>クレジットカード</p></td>
     <td><p>Zilliz Cloudの利用に対して毎月の請求書が発行されます。</p></td>
   </tr>
   <tr>
     <td><p>AWS Marketplaceサブスクリプション</p></td>
     <td><p>AWS Marketplaceを通じてZilliz Cloudの利用に対する請求書が発行されます。</p><p>AWS Marketplaceで当社のサービスを購読し、AWS、GCP、Azureの中から選択してZilliz Cloudクラスターを作成できます。</p></td>
   </tr>
   <tr>
     <td><p>GCP Marketplaceサブスクリプション</p></td>
     <td><p>GCP Marketplaceを通じてZilliz Cloudの利用に対する請求書が発行されます。</p><p>GCP Marketplaceで当社のサービスを購読し、AWS、GCP、Azureの中から選択してZilliz Cloudクラスターを作成できます。</p></td>
   </tr>
   <tr>
     <td><p>Azure Marketplaceサブスクリプション</p></td>
     <td><p>Azure Marketplaceを通じてZilliz Cloudの利用に対する請求書が発行されます。</p><p>Azure Marketplaceで当社のサービスを購読し、AWS、GCP、Azureの中から選択してZilliz Cloudクラスターを作成できます。</p></td>
   </tr>
   <tr>
     <td><p>前払い</p></td>
     <td><p>Zilliz Cloudサービスに対して一定の金額を前払いします。</p></td>
   </tr>
</table>

クレジットと前払いは、クレジットカードまたはMarketplaceサブスクリプション (AWS/GCP/Azure) のいずれかと組み合わせることができます。ただし、クレジットカードとMarketplaceサブスクリプションの両方を同時に設定することはできません。

<Admonition type="info" icon="📘" title="Note">

<p>Marketplaceサブスクリプションは支払い方法に過ぎず、クラスター作成時のクラウドサービスプロバイダーには影響しません。例えば、AWS Marketplaceを通じて購読した後でも、GCP、Azure、またはAWS上にクラスターを<a href="./create-cluster">作成</a>できます。</p>

</Admonition>

### 支払い方法の優先順位{#payment-method-priority}

複数の支払い方法が使用されている場合、その優先順位は次のとおりです。

1. クレジット

1. 前払い資金

1. クレジットカード / AWS Marketplaceサブスクリプション / GCP Marketplaceサブスクリプション / Azure Marketplaceサブスクリプション。

**例:** 500ドルの未払い請求があり、100ドルのクレジットと200ドルの前払い資金が利用可能で、クレジットカードがリンクされている場合：

- まず100ドルのクレジットが使用され、請求額は400ドルに減額されます。

- 次に200ドルの前払い資金が適用され、残高は200ドルになります。

- 最後に、残りの200ドルがリンクされたクレジットカードに請求されます。

### 支払い方法の切り替え{#switching-payment-methods}

Zilliz Cloudは、異なる支払い方法間の柔軟な切り替えを提供します。

#### クレジットカードからMarketplaceサブスクリプションへ{#from-credit-card-to-marketplace-subscription}

- [AWS](./subscribe-on-aws-marketplace) または [GCP](./subscribe-on-gcp-marketplace) または [Azure](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/zillizinc1703056661329.zilliz_cloud?tab=Overview) Marketplaceで直接購読します。

- クレジットカードを手動で削除する必要はありません。

- Marketplaceサブスクリプションが成功すると、支払い方法が自動的に更新されます。

#### Marketplaceサブスクリプションからクレジットカードへ{#from-marketplace-subscription-to-credit-card}

- 元の [AWS](./subscribe-on-aws-marketplace#cancel-aws-marketplace-subscription) または [GCP](./subscribe-on-gcp-marketplace#cancel-gcp-marketplace-subscription) または [Azure](./subscribe-on-azure-marketplace) Marketplaceから手動で購読を解除します。

- Zilliz Cloudウェブコンソールで[クレジットカードを追加](./subscribe-by-adding-credit-card)します。

#### Marketplaceサブスクリプション間{#between-marketplace-subscriptions}

- 現在のMarketplaceの購読を解除します。

- 新しい [AWS](./subscribe-on-aws-marketplace) または [GCP](./subscribe-on-gcp-marketplace) または [Azure](./subscribe-on-azure-marketplace) Marketplaceアカウントを使用して再購読します。

## Marketplaceの料金条件{#marketplace-pricing-terms}

[AWS](./subscribe-on-aws-marketplace)、[GPC](./subscribe-on-gcp-marketplace)、または[Azure](./subscribe-on-azure-marketplace) MarketplaceでZilliz Cloudサービスを購読し、[サポートされているクラウドプロバイダー](./cloud-providers-and-regions)にデプロイされたクラスターを作成できます。

料金は、クラウドプロバイダー、リージョン、およびクラスタープランによって異なります。詳細については、[Zilliz Cloud Pricing](https://zilliz.com/pricing)を参照してください。

料金情報を使用して、AWS-us-east-1 (バージニア) に1つのパフォーマンス最適化されたCUを持つ**Standard Plan**でZilliz Cloudクラスターをデプロイした場合、Marketplaceサブスクリプションを通じて1時間あたり0.159ドルが請求されます。

## 関連トピック{#related-topics}

異なる支払い方法を使用してZilliz Cloudを購読し、請求書を表示する方法の詳細については、以下のトピックを参照してください。



import DocCardList from '@theme/DocCardList';

<DocCardList />