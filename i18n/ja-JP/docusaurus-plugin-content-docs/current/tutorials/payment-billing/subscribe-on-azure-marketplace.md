---
title: "Azure Marketplace でサブスクライブ | Cloud"
slug: /subscribe-on-azure-marketplace
sidebar_label: "Azure Marketplace"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Azure Marketplace での Zilliz Cloud のサブスクリプションプロセスと価格条件について、ステップバイステップで説明します。"
type: origin
token: LbFXwpruviFWWokwtkhcVmnhnFh
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - マーケットプレイス
  - azure
  - ハイブリッド検索
  - レキシカル検索
  - 近傍検索
  - Agentic RAG

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Grid from '@site/src/components/Grid';

import Procedures from '@site/src/components/Procedures';

# Azure Marketplace で購読する

このガイドでは、Azure Marketplace での Zilliz Cloud の購読プロセスと料金体系について、ステップバイステップで説明します。

<Admonition type="info" icon="📘" title="Note">

<p>購読すると、Azure Marketplace を通じて Azure クラスターの使用料金を支払うことができます。他のクラウドプロバイダーにデプロイされたクラスターがある場合でも、Azure Marketplace を使用して支払うことができます。</p>

</Admonition>

## 開始する前に{#before-you-start}

Azure Marketplace で購読するには、[Azure Marketplace](https://learn.microsoft.com/en-us/marketplace/azure-marketplace-overview) アカウントと Azure [課金アカウント](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/view-all-accounts)があることを確認してください。

また、請求先の国または地域がサポートされている市場のリストにあることを確認してください。Zilliz Cloud は、税金およびコンプライアンス上の理由により、Azure Marketplace の特定の市場をサポートしていません。サポートされていない市場から購読しようとすると、「`"No plans are available for market '<market_code>'."`」というエラーメッセージが表示される場合があります。この場合、[サポートに連絡](http://support.zilliz.com/)し、エラーメッセージのスクリーンショットと市場コードを提供してください。可能な解決策についてご相談させていただきます。

![YaPcbHnQXovDLIxks0xcItOJnpf](https://zdoc-images.s3.us-west-2.amazonaws.com/yapcbhnqxovdlixks0xcitojnpf.png "YaPcbHnQXovDLIxks0xcItOJnpf")

<details>

<summary>サポートされている市場</summary>

<Grid columnSize="4" widthRatios="25,25,25,25">

    <div>

        - アルメニア

        - オーストラリア

        - オーストリア

        - バーレーン

        - バルバドス

        - ベラルーシ

        - ベルギー

        - ブルガリア

        - カナダ

        - チリ

        - コロンビア

        - クロアチア

        - キプロス

        - チェコ

        - デンマーク

        - エジプト

        - エストニア

        - フィンランド

    </div>

    <div>

        - フランス

        - ジョージア

        - ドイツ

        - ギリシャ

        - 香港特別行政区

        - ハンガリー

        - アイスランド

        - インド

        - インドネシア

        - アイルランド

        - イタリア

        - 日本

        - ケニア

        - ラトビア

        - リヒテンシュタイン

        - リトアニア

        - ルクセンブルク

        - マレーシア

    </div>

    <div>

        - マルタ

        - モルドバ

        - モナコ

        - オランダ

        - ニュージーランド

        - ナイジェリア

        - ノルウェー

        - オマーン

        - フィリピン

        - ポーランド

        - ポルトガル

        - プエルトリコ

        - カタール

        - ルーマニア

        - ロシア

        - サウジアラビア

        - セルビア

        - シンガポール

    </div>

    <div>

        - スロバキア

        - スロベニア

        - 南アフリカ

        - 韓国

        - スペイン

        - スウェーデン

        - スイス

        - 台湾

        - タジキスタン

        - タイ

        - トルコ

        - ウガンダ

        - ウクライナ

        - アラブ首長国連邦

        - イギリス

        - アメリカ合衆国

        - ウズベキスタン

        - ベトナム

    </div>

</Grid>

</details>

## Azure Marketplace で購読する{#subscribe-on-azure-marketplace}

[Azure Marketplace](https://azuremarketplace.microsoft.com/en-us) にアクセスし、以下の手順で Zilliz Cloud の購読を開始します。

<Supademo id="cm9jmpiac3eq2ljv5itt1tn7s" title="Zilliz Cloud - Azure Marketplace Subscription Demo" />

<Procedures>

1. 検索ボックスで **Zilliz Cloud** を検索するか、[Azure Marketplace にアクセス](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/zillizinc1703056661329.zilliz_cloud?tab=Overview)して Zilliz Cloud ポータルページを表示します。

    ![search_for_zilliz_on_azure](https://zdoc-images.s3.us-west-2.amazonaws.com/search_for_zilliz_on_azure.png "search_for_zilliz_on_azure")

1. **Zilliz Cloud** をクリックします。

    サービスと料金を確認してください。

1. **プラン + 料金**タブに切り替えます。**今すぐ入手**をクリックします。

    ![get_it_now_on_azure](https://zdoc-images.s3.us-west-2.amazonaws.com/get_it_now_on_azure.png "get_it_now_on_azure")

1. ポップアップウィンドウで、Zilliz Cloud が要求する基本情報を入力します。

    ![enter_basic_information_azure](https://zdoc-images.s3.us-west-2.amazonaws.com/enter_basic_information_azure.png "enter_basic_information_azure")

1. **Zilliz Cloud を購読する**ページで、以下の手順を完了します。

    1. 適切な**サブスクリプション**と**リソースグループ**を選択して、**プロジェクトの詳細**を設定します。リソースグループがない場合は、作成してください。サブスクリプションとリソースグループの詳細については、Azure の[SaaS 購入体験](https://learn.microsoft.com/en-us/marketplace/purchase-saas-offer-in-azure-portal#the-saas-purchase-experience)を参照してください。

    1. **SaaS の詳細**を設定します。

        1. 後で簡単に識別できるように、サブスクリプションに名前を付けます。

        1. 契約期間を選択します: 1ヶ月または1年。

        1. **自動更新**設定を設定します。

            <Admonition type="info" icon="📘" title="Note">

            <p>自動更新がオンの場合、契約期間の終了時に Azure の Zilliz Cloud に自動的に購読されます。自動更新がオフの場合、契約期間の終了時にサブスクリプションが終了し、Zilliz Cloud の組織とアカウントは、この Azure Marketplace サブスクリプションから自動的にリンク解除されます。</p>

            </Admonition>

    1. サブスクリプションの詳細を確認し、**確認 + 購読**をクリックします。

    ![configure_subscription_on_azure](https://zdoc-images.s3.us-west-2.amazonaws.com/configure_subscription_on_azure.png "configure_subscription_on_azure")

1. 次のページで、**今すぐアカウントを設定**をクリックして、Azure Marketplace サブスクリプションを Zilliz Cloud にリンクします。

    ![configure_account_azure](https://zdoc-images.s3.us-west-2.amazonaws.com/configure_account_azure.png "configure_account_azure")

1. 新しいタブで、以下の手順に従って購読を完了します。

    1. 既に Zilliz Cloud アカウントをお持ちの場合は、ログインするだけです。お持ちでない場合は、[サインアップオプション](./register-with-zilliz-cloud)を選択し、プロセスに従ってください。

    1. 既存の Zilliz Cloud 組織にサブスクリプションをリンクします。

    1. 認証を完了します。

        ![aws-marketplace-dialog](https://zdoc-images.s3.us-west-2.amazonaws.com/aws-marketplace-dialog.png "aws-marketplace-dialog")

1. Zilliz Cloud の**請求**に移動し、Azure Marketplace サブスクリプションが支払い方法として設定されていることを確認します。

    ![azure-marketplace-success](https://zdoc-images.s3.us-west-2.amazonaws.com/azure-marketplace-success.png "azure-marketplace-success")

</Procedures>

## Azure Marketplace サブスクリプションを更新する{#update-azure-marketplace-subscription}

Azure Marketplace からの購読が成功した後、いつでもサブスクリプションを更新できます。具体的には、サブスクリプションに使用する Azure Marketplace アカウントを別のアカウントに変更したり、支払い方法を Azure Marketplace サブスクリプションからクレジットカードに切り替えたりすることができます。

### Azure Marketplace サブスクリプションを変更する{#change-azure-marketplace-subscription}

詳細については、[Azure サブスクリプションおよび/またはリソースグループの変更](https://learn.microsoft.com/en-us/marketplace/saas-subscription-lifecycle-management#change-azure-subscription-andor-resource-group)を参照してください。

**請求概要**ページの**支払い方法**セクションで更新を確認できます。サブスクリプション ID をクリックし、サブスクリプションの**購入者 PUID** が新しい Marketplace アカウントに更新されているかどうかを確認します。

![view-azure-subscription-id](https://zdoc-images.s3.us-west-2.amazonaws.com/view-azure-subscription-id.png "view-azure-subscription-id")

### クレジットカード払いに切り替える{#switch-to-payment-credit-card}

<Procedures>

1. サブスクリプションに使用した Azure アカウントで Azure Marketplace にサインインします。

1. Zilliz Cloud サブスクリプションをキャンセルまたは削除します。詳細については、[サブスクリプションのキャンセル](https://learn.microsoft.com/en-us/marketplace/saas-subscription-lifecycle-management#cancel-subscription)および[サブスクリプションの削除](https://learn.microsoft.com/en-us/marketplace/saas-subscription-lifecycle-management#delete-subscription)を参照してください。

    <Admonition type="info" icon="📘" title="Note">

    <p>Azure Marketplace がキャンセルプロセスを完了するまでに数分かかります。</p>

    </Admonition>

1. [クレジットカードを追加して購読する](./subscribe-by-adding-credit-card#add-a-credit-card)の手順に従って、支払い用クレジットカードを追加します。

1. **請求概要**ページの**支払い方法**セクションで更新を確認します。

</Procedures>

## Azure Marketplace サブスクリプションをキャンセルする{#cancel-azure-marketplace-subscription}

<Procedures>

1. Azure Marketplace のホームページを開きます。

1. **すべてのリソース**をクリックするか、**リソース/最近**タブでサブスクリプションを見つけます。

    ![azure_all_resources](https://zdoc-images.s3.us-west-2.amazonaws.com/azure_all_resources.png "azure_all_resources")

1. キャンセルしたいサブスクリプションに移動します。**サブスクリプションのキャンセル**をクリックします。Azure Marketplace がプロセスを完了するまで数分待ちます。

    ![cancel_azure_subscription](https://zdoc-images.s3.us-west-2.amazonaws.com/cancel_azure_subscription.png "cancel_azure_subscription")

</Procedures>

Azure Marketplace でのサブスクリプションのキャンセル方法の詳細については、[こちら](https://learn.microsoft.com/en-us/marketplace/saas-subscription-lifecycle-management#cancel-subscription)を参照してください。

## Azure Marketplace の料金体系{#azure-marketplace-pricing-terms}

詳細については、[支払いと請求](./payment-billing#marketplace-pricing-terms)を参照してください。

## トラブルシューティング{#troubleshooting}

- **Azure Marketplace 経由で購読する際に「No plans are available for market '&lt;country_code&gt;'」と表示されるのはなぜですか？**

    このメッセージは、Zilliz Cloud がお客様の請求先の国または地域の Azure Marketplace でまだ利用できないために表示されます。詳細については、[サポートされている市場](./subscribe-on-azure-marketplace#before-you-start)を参照してください。エラーメッセージのスクリーンショットと市場コードを添えて[サポートに連絡](http://support.zilliz.com)してください。代替ソリューションを提供したり、利用可能性を更新したりできる場合があります。

- **マーケットプレイスのサブスクリプションを Zilliz Cloud にリンクする際に、利用可能な組織がない場合はどうすればよいですか？**

    いくつかの理由が考えられます。

    - **権限不足**

        これは、十分な権限がない場合に発生する可能性があります。利用できない組織の横に**「権限不足」**タグが表示されます。

        ![insufficient-permission-subscription](https://zdoc-images.s3.us-west-2.amazonaws.com/insufficient-permission-subscription.png "insufficient-permission-subscription")

        マーケットプレイスのサブスクリプションと組織をリンクするには、**組織の所有者**または**組織の請求管理者**である必要があります。組織のメンバーであるだけでは、必要な権限がありません。組織の所有者に連絡して支援を求めてください。

    - **すべての組織が既にマーケットプレイスのサブスクリプションに正常にリンクされている**

        これは、すべての組織が既にマーケットプレイスのサブスクリプションにリンクされている場合に発生する可能性があります。利用できない組織の横に**「マーケットプレイスにリンク済み」**タグが表示されます。

        ![marketplace-already-linked-subscription](https://zdoc-images.s3.us-west-2.amazonaws.com/marketplace-already-linked-subscription.png "marketplace-already-linked-subscription")

        この場合、

        - 既存のマーケットプレイスのサブスクリプションを更新する必要がある場合は、まず組織の現在のサブスクリプションを[リンク解除](./subscribe-on-aws-marketplace#cancel-aws-marketplace-subscription)してから、新しいサブスクリプションを設定してください。

        - 異なるマーケットプレイスのサブスクリプションに複数の組織が必要な場合は、次のことができます。

            - 新しい Zilliz Cloud アカウントを[登録](./register-with-zilliz-cloud)して新しい組織を作成します。次に、組織の所有者を新しい組織に[招待](./organization-users#invite-a-user-to-your-organization)します。この組織の所有者は複数の組織に属し、各組織に異なるマーケットプレイスのサブスクリプションを設定できます。

            - [サポートチケットを作成](http://support.zilliz.com)して、新しい組織を作成してもらいます。現在、Zilliz Cloud はユーザーによる組織の手動作成をサポートしていません。

    - **リストに組織がない**

        これは、アカウントが閉鎖されたか、すべての組織を離れた場合に発生する可能性があります。UI は次のようになります。

        ![no-organization-during-subcription](https://zdoc-images.s3.us-west-2.amazonaws.com/no-organization-during-subcription.png "no-organization-during-subcription")

        この場合、次のことができます。

        - 新しい組織を作成します。

        - 他のユーザーに、自分の組織に[招待](./organization-users#invite-a-user-to-your-organization)してもらい、組織の所有者の役割を付与してもらいます。

        - [サポートチケットを作成](https://support.zilliz.com/hc/en-us)して、新しい組織を作成してもらいます。

## 関連トピック{#related-topics}

- [クレジットカードを追加して購読する](./subscribe-by-adding-credit-card)

- [AWS Marketplace で購読する](./subscribe-on-aws-marketplace)

- [GCP Marketplace で購読する](./subscribe-on-gcp-marketplace)

- [請求書を表示する](./view-invoice)

 