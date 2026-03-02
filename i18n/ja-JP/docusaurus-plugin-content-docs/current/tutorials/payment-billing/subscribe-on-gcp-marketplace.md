---
title: "Google Cloud Marketplace でサブスクライブ | Cloud"
slug: /subscribe-on-gcp-marketplace
sidebar_label: "Google Cloud Marketplace"
beta: FALSE
notebook: FALSE
description: "このガイドでは、GCP Marketplace での Zilliz Cloud のサブスクリプションプロセスと価格条件について、ステップバイステップで説明します。 | Cloud"
type: origin
token: MIqTw7iJ4iQAtVkYKiEc98a7nsh
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - マーケットプレイス
  - gcp
  - マルチモーダルベクトルデータベース検索
  - Retrieval Augmented Generation
  - 大規模言語モデル
  - ベクトル化

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# Google Cloud Marketplace で購読する

このガイドでは、Zilliz Cloud の GCP Marketplace での購読プロセスと料金体系について、ステップバイステップで説明します。

<Admonition type="info" icon="📘" title="Note">

<p>購読すると、Google Cloud Marketplace を通じて Google Cloud クラスターの使用料を支払うことができます。他のクラウドプロバイダーにデプロイされたクラスターがある場合でも、Google Cloud Marketplace を使用して支払うことができます。</p>

</Admonition>

## 開始する前に{#before-you-start}

- [GCP アカウント](https://cloud.google.com/apigee/docs/hybrid/v1.1/precog-gcpaccount)があることを確認してください。

- 購読に使用する GCP プロジェクトの請求アカウントが設定されていることを確認してください。

- GCP Marketplace アカウントが組織の一部である場合、請求管理者に購入の承認を得る必要があります。

## GCP Marketplace で購読する{#subscribe-on-gcp-marketplace}

[GCP Marketplace](https://console.cloud.google.com/marketplace) にアクセスし、次のように Zilliz Cloud の購読を開始します。

<Procedures>

1. 検索ボックスで **Zilliz Cloud** を検索するか、[GCP Marketplace にアクセス](https://console.cloud.google.com/marketplace/product/zilliz-public/zilliz-cloud?project=zilliz-public&pli=1)して Zilliz Cloud ポータルページを表示します。

    ![search_for_zilliz_on_gcp](https://zdoc-images.s3.us-west-2.amazonaws.com/search_for_zilliz_on_gcp.png "search_for_zilliz_on_gcp")

1. **Zilliz Cloud** をクリックします。

    サービスと料金を確認してください。

1. 購読するプロジェクトを選択し、**Subscribe** をクリックします。

    ![click_subscribe_on_gcp](https://zdoc-images.s3.us-west-2.amazonaws.com/click_subscribe_on_gcp.png "click_subscribe_on_gcp")

1. **New Zilliz Cloud subscription** ページで、次の手順を完了します。

    1. **Purchase details** セクションのドロップダウンから請求アカウントを選択します。

    1. **Terms** を確認し、同意します。

    1. **Subscribe** をクリックします。

    ![new_zilliz_cloud_subscription_on_gcp](https://zdoc-images.s3.us-west-2.amazonaws.com/new_zilliz_cloud_subscription_on_gcp.png "new_zilliz_cloud_subscription_on_gcp")

1. ポップアップウィンドウで、**SIGN UP WITH ZILLIZ** をクリックします。

    <Admonition type="info" icon="📘" title="Notes">

    <p>サインアッププロセスを完了できない場合は、GCP Marketplace の <strong><a href="https://console.cloud.google.com/marketplace/orders">Your Orders</a></strong> ページに移動して再試行できます。</p>

    </Admonition>

    ![gcp_flash_message](https://zdoc-images.s3.us-west-2.amazonaws.com/gcp_flash_message.png "gcp_flash_message")

1. 新しいタブで、以下の手順に従って購読を完了します。

    1. 既に Zilliz Cloud アカウントをお持ちの場合は、ログインするだけです。お持ちでない場合は、[サインアップオプション](./register-with-zilliz-cloud)を選択し、プロセスに従ってください。

    1. 購読を既存の Zilliz Cloud 組織にリンクします。

    1. 認証を完了します。

    ![aws-marketplace-dialog](https://zdoc-images.s3.us-west-2.amazonaws.com/aws-marketplace-dialog.png "aws-marketplace-dialog")

1. **Billing** に移動し、GCP Marketplace の購読が支払い方法として設定されていることを確認します。

    ![gcp-marketplace-success](https://zdoc-images.s3.us-west-2.amazonaws.com/gcp-marketplace-success.png "gcp-marketplace-success")

</Procedures>

## GCP Marketplace 購読の更新{#update-gcp-marketplace-subscription}

GCP Marketplace から購読に成功した後、いつでも購読を更新できます。具体的には、購読に使用する GCP Marketplace アカウントを別のアカウントに変更したり、支払い方法を GCP Marketplace 購読からクレジットカードに切り替えたりできます。

### GCP Marketplace 購読アカウントの変更{#change-gcp-marketplace-subscription-account}

<Procedures>

1. 購読に使用した元の GCP アカウントで GCP Marketplace にサインインします。

1. Zilliz Cloud の購読をキャンセルします。詳細については、[プランのキャンセル](https://cloud.google.com/marketplace/docs/manage-billing#saas-products)を参照してください。

    <Admonition type="info" icon="📘" title="Note">

    <p>購読をキャンセルしても、Zilliz Cloud のデータが削除されることはありませんのでご安心ください。</p>

    </Admonition>

    GCP Marketplace がキャンセルプロセスを完了するのに数分かかります。

1. 元の GCP アカウントからサインアウトします。

1. 購読に使用したい新しい GCP アカウントで GCP Marketplace にサインインします。

1. [GCP Marketplace で購読する](./subscribe-on-gcp-marketplace#subscribe-on-gcp-marketplace)セクションの手順1から4に従って、新しいアカウントで Zilliz Cloud の購読を完了します。

    <Admonition type="info" icon="📘" title="Note">

    <p>GCP Marketplace の購読を更新する際は、新しい購読を Zilliz Cloud 組織にリンクするために「Manage on Provider」ボタンをクリックする必要があります。</p>

    </Admonition>

1. **Billing Overview** ページの **Payment Method** セクションで更新を確認します。購読 ID をクリックし、購読の **Account Id** が新しい Marketplace アカウントに更新されていることを確認します。

    ![view-gcp-subscription-id](https://zdoc-images.s3.us-west-2.amazonaws.com/view-gcp-subscription-id.png "view-gcp-subscription-id")

</Procedures>

<Admonition type="info" icon="📘" title="Note">

<p>サービスの中断を避けるため、1時間以内に操作を完了することをお勧めします。</p>

</Admonition>

### クレジットカード払いへの切り替え{#switch-to-payment-credit-card}

<Procedures>

1. 購読に使用した元の GCP アカウントで GCP Marketplace にサインインします。

1. Zilliz Cloud の購読をキャンセルします。詳細については、[プランのキャンセル](https://cloud.google.com/marketplace/docs/manage-billing#saas-products)を参照してください。

    <Admonition type="info" icon="📘" title="Note">

    <p>購読をキャンセルしても、Zilliz Cloud のデータが削除されることはありませんのでご安心ください。</p>

    </Admonition>

    GCP Marketplace がキャンセルプロセスを完了するのに数分かかります。

1. [クレジットカードの追加による購読](./subscribe-by-adding-credit-card#add-a-credit-card)の手順に従って、支払い用クレジットカードを追加します。

1. **Billing Overview** ページの **Payment Method** セクションで更新を確認します。

</Procedures>

## GCP Marketplace 購読のキャンセル{#cancel-gcp-marketplace-subscription}

GCP Marketplace の購読をキャンセルするには、GCP Marketplace コンソールを開き、[こちら](https://cloud.google.com/marketplace/docs/manage-billing#cancel)の手順に従ってください。

## GCP Marketplace の料金体系{#gcp-marketplace-pricing-terms}

詳細については、[支払いと請求](./payment-billing#marketplace-pricing-terms)を参照してください。

## トラブルシューティング{#troubleshooting}

**マーケットプレイスの購読を Zilliz Cloud にリンクする際に、利用可能な組織がない場合はどうすればよいですか？**

いくつかの理由が考えられます。

- **権限不足**

    これは、十分な権限がない場合に発生する可能性があります。利用できない組織の横に **"Insufficient Permissions"** タグが表示されます。

    ![insufficient-permission-subscription](https://zdoc-images.s3.us-west-2.amazonaws.com/insufficient-permission-subscription.png "insufficient-permission-subscription")

    マーケットプレイスの購読と組織をリンクするには、**組織の所有者**または**組織の請求管理者**である必要があります。組織のメンバーであるだけでは、必要な権限がありません。組織の所有者に連絡して支援を求めてください。

- **すべての組織がすでにマーケットプレイスの購読に正常にリンクされている**

    これは、すべての組織がすでにマーケットプレイスの購読にリンクされている場合に発生する可能性があります。利用できない組織の横に **"Marketplace Linked"** タグが表示されます。

    ![marketplace-already-linked-subscription](https://zdoc-images.s3.us-west-2.amazonaws.com/marketplace-already-linked-subscription.png "marketplace-already-linked-subscription")

    この場合、

    - 既存のマーケットプレイスの購読を更新する必要がある場合は、まず組織の現在の購読を[リンク解除](./subscribe-on-aws-marketplace#cancel-aws-marketplace-subscription)してから、新しい購読を設定してください。

    - 異なるマーケットプレイスの購読のために複数の組織が必要な場合は、次のことができます。

        - 新しい Zilliz Cloud アカウントを[登録](./register-with-zilliz-cloud)して新しい組織を作成します。次に、組織の所有者を新しい組織に[招待](./organization-users#invite-a-user-to-your-organization)します。この組織の所有者は複数の組織に属し、各組織に異なるマーケットプレイスの購読を設定できます。

        - [サポートチケットを作成](http://support.zilliz.com)して、新しい組織を作成してもらいます。現在、Zilliz Cloud はユーザーによる手動での組織作成をサポートしていません。

- **リストに組織がない**

    - これは、アカウントが閉鎖されたか、すべての組織を離れた場合に発生する可能性があります。UI は次のようになります。

    ![no-organization-during-subcription](https://zdoc-images.s3.us-west-2.amazonaws.com/no-organization-during-subcription.png "no-organization-during-subcription")

    この場合、次のことができます。

    - 新しい組織を作成します。

    - 他のユーザーにあなたを組織に[招待](./organization-users#invite-a-user-to-your-organization)してもらい、組織の所有者の役割を付与してもらいます。

    - [サポートチケットを作成](https://support.zilliz.com/hc/en-us)して、新しい組織を作成してもらいます。

## 関連トピック{#related-topics}

- [クレジットカードの追加による購読](./subscribe-by-adding-credit-card)

- [AWS Marketplace で購読する](./subscribe-on-aws-marketplace)

- [Azure Marketplace で購読する](./subscribe-on-azure-marketplace)

- [請求書の表示](./view-invoice) 

