---
title: "AWS Marketplaceでサブスクライブ | Cloud"
slug: /subscribe-on-aws-marketplace
sidebar_label: "AWS Marketplace"
beta: FALSE
notebook: FALSE
description: "このガイドでは、AWS MarketplaceでのZilliz Cloudのサブスクリプションプロセスと価格条件について、ステップバイステップで説明します。"
type: origin
token: LDlOweEzmiLkdQkvPFec5lrcnbf
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - マーケットプレイス
  - aws
  - オープンソース ベクトルDB
  - ベクトルデータベースの例
  - RAG ベクトルデータベース
  - ベクトルDBとは

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# AWS Marketplace で購読する

このガイドでは、AWS Marketplace での Zilliz Cloud の購読プロセスと料金体系について、ステップバイステップで説明します。

<Admonition type="info" icon="📘" title="Note">

<p>購読すると、AWS Marketplace を通じて AWS クラスターの使用料金を支払うことができます。他のクラウドプロバイダーにデプロイされたクラスターがある場合でも、AWS Marketplace を使用して支払うことができます。</p>

</Admonition>

## 開始する前に{#before-you-start}

- AWS Marketplace アカウントを持っていることを確認してください。

- AWS バイヤー ID のデフォルトの支払い方法を請求プランに設定します。[デフォルトの支払い方法を変更する方法を学ぶ](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/manage-payment-method.html)。

- 既存の Zilliz Cloud ユーザーの場合は、AWS Marketplace で購読するために別のメールアドレスを使用してください。

- AWS アカウントが組織の一部である場合、請求管理者が購入を承認する必要があります。

## AWS Marketplace で購読する{#subscribe-on-aws-marketplace}

<Supademo id="cm9hwfyvq1zgoljv5tu13vdk6" title="Zilliz Cloud - AWS Marketplace Subscription Demo" />

[AWS Marketplace](https://aws.amazon.com/marketplace) にアクセスし、次のように Zilliz Cloud の購読を開始します。

<Procedures>

1. 検索ボックスで **Zilliz Cloud** を検索するか、[AWS Marketplace にアクセス](https://aws.amazon.com/marketplace/pp/prodview-iqbidum7feuio?trk=8d276e92-b310-40ce-908f-23a198ca7ffc&sc_channel=el&source=zilliz)して Zilliz Cloud ポータルページを表示します。

    ![search_for_zilliz_on_aws](https://zdoc-images.s3.us-west-2.amazonaws.com/search_for_zilliz_on_aws.png "search_for_zilliz_on_aws")

1. **Zilliz Cloud** をクリックします。

    サービスと料金について確認してください。

    すでに Zilliz Cloud を使用している場合は、**購入オプションを表示**をクリックします。

    Zilliz Cloud を使用したことがない場合は、AWS が提供する 30 日間の無料トライアルである **無料で試す** をクリックできます。無料トライアルが終了すると、Zilliz Cloud を引き続き使用するには[購読をアップグレードする](./subscribe-on-aws-marketplace#upgrade-to-paid-subscription-from-free-trial)必要があります。

    ![view_purchase_options](https://zdoc-images.s3.us-west-2.amazonaws.com/view_purchase_options.png "view_purchase_options")

1. ページを下にスクロールし、**購読**をクリックします。

    ![aws_flash_message](https://zdoc-images.s3.us-west-2.amazonaws.com/aws_flash_message.png "aws_flash_message")

1. プロンプトに従って、Zilliz Cloud で**アカウントを設定**します。

    ![set-up-account](https://zdoc-images.s3.us-west-2.amazonaws.com/set-up-account.png "set-up-account")

1. 新しいタブで、以下の手順に従って購読を完了します。

    1. すでに Zilliz Cloud アカウントをお持ちの場合は、ログインするだけです。そうでない場合は、[サインアップオプション](./register-with-zilliz-cloud)を選択し、プロセスに従ってください。AWS ID を Zilliz Cloud アカウントにリンクするために、URL 内のすべてのクエリ文字列が保持されていることを確認してください。

        <Admonition type="info" icon="📘" title="Notes">

        <p>AWS Marketplace は、URL 内のクエリ文字列を使用して、ID 情報を Zilliz Cloud に渡します。サインアップの失敗により、これらのクエリ文字列が失われる可能性があります。その結果、Zilliz Cloud は AWS ID を当社に登録されたアカウントに関連付けることができない場合があります。この場合、AWS Marketplace に戻り、再度<b>アカウントを設定</b>をクリックしてください。</p>

        </Admonition>

    1. 購読を既存の Zilliz Cloud 組織にリンクします。

        ![aws-marketplace-dialog](https://zdoc-images.s3.us-west-2.amazonaws.com/aws-marketplace-dialog.png "aws-marketplace-dialog")

    1. 認証を完了します。

1. **請求**に移動し、AWS Marketplace の購読が支払い方法として設定されていることを確認します。

    ![aws-marketplace-success](https://zdoc-images.s3.us-west-2.amazonaws.com/aws-marketplace-success.png "aws-marketplace-success")

</Procedures>

## 無料トライアルから有料購読へのアップグレード{#upgrade-to-paid-subscription-from-free-trial}

AWS Marketplace で Zilliz Cloud の無料トライアルを開始すると、通常の Zilliz Cloud 無料トライアルと同じ機能が利用できます。詳細については、[Zilliz Cloud を無料で試す](./free-trials#free-trial)を参照してください。

無料トライアル期間中、**請求概要**ページで AWS Marketplace 購読の横に「`Free Trial`」タグが表示されます。

より高度な機能を利用するには、いつでも有料の AWS 購読にアップグレードできます。アップグレードするには、前のセクションで説明した通常の購読プロセスに従うだけです。デモについては、[こちら](./subscribe-on-aws-marketplace#subscribe-on-aws-marketplace)をクリックしてください。

<Procedures>

1. AWS Marketplace の [Zilliz Cloud ページ](https://aws.amazon.com/marketplace/pp/prodview-iqbidum7feuio?sr=0-1&ref_=beagle&applicationId=AWSMPContessa)に移動します。

1. **購入オプションを表示**をクリックします。

1. ページを下にスクロールし、**購読**をクリックします。

1. プロンプトで**アカウントを設定**をクリックします。

1. Zilliz Cloud アカウントにログインし、AWS Marketplace の購読を Zilliz Cloud 組織にリンクします。

</Procedures>

アップグレードが成功したかどうかは、**請求概要**ページの**支払い方法**カードに移動して確認できます。AWS Marketplace 購読の横にある「`Free Trial`」タグが消えていれば、アップグレードは成功です。

## AWS Marketplace 購読の更新{#update-aws-marketplace-subscription}

AWS Marketplace から購読に成功した後、いつでも購読を更新できます。具体的には、購読に使用する AWS Marketplace アカウントを別のアカウントに変更したり、支払い方法を AWS Marketplace 購読からクレジットカードに切り替えたりすることができます。

### AWS Marketplace 購読アカウントの変更{#change-aws-marketplace-subscription-account}

<Procedures>

1. 購読に使用した元の AWS アカウントで AWS Marketplace にサインインします。

1. Zilliz Cloud の購読をキャンセルします。詳細については、[製品購読のキャンセル](https://docs.aws.amazon.com/marketplace/latest/buyerguide/cancel-subscription.html#cancel-saas-subscription)を参照してください。

    <Admonition type="info" icon="📘" title="Note">

    <p>購読をキャンセルしても、Zilliz Cloud のデータが削除されることはありませんのでご安心ください。</p>

    </Admonition>

    AWS Marketplace がキャンセルプロセスを完了するまでに数分かかります。

1. 元の AWS アカウントからサインアウトします。

1. 購読に使用したい別の AWS アカウントで AWS Marketplace にサインインします。

1. [AWS Marketplace で購読する](./subscribe-on-aws-marketplace#subscribe-on-aws-marketplace)セクションの手順 1 から 4 に従って、新しいアカウントで Zilliz Cloud の購読を完了します。

    <Admonition type="info" icon="📘" title="Note">

    <p>AWS Marketplace の購読を更新する際は、<b>アカウントを設定</b>ボタンをクリックして、新しい購読を Zilliz Cloud 組織にリンクする必要があります。</p>

    </Admonition>

1. **請求概要**ページの**支払い方法**セクションで更新を確認します。購読 ID をクリックし、購読の**アカウント ID** が新しい Marketplace アカウントに更新されていることを確認します。

    ![view-aws-subscription-id](https://zdoc-images.s3.us-west-2.amazonaws.com/view-aws-subscription-id.png "view-aws-subscription-id")

</Procedures>

<Admonition type="info" icon="📘" title="Note">

<p>サービスの中断を避けるため、1 時間以内に操作を完了することをお勧めします。</p>

</Admonition>

### 支払いクレジットカードへの切り替え{#switch-to-payment-credit-card}

<Supademo id="cm9i80zwc26e2ljv56y6iydeu" title="Zilliz Cloud - Change Payment Method Demo" />

<Procedures>

1. 購読に使用した元の AWS アカウントで AWS Marketplace にサインインします。

1. Zilliz Cloud の購読をキャンセルします。詳細については、[製品購読のキャンセル](https://docs.aws.amazon.com/marketplace/latest/buyerguide/cancel-subscription.html#cancel-saas-subscription)を参照してください。

    <Admonition type="info" icon="📘" title="Note">

    <p>購読をキャンセルしても、Zilliz Cloud のデータが削除されることはありませんのでご安心ください。</p>

    </Admonition>

    AWS Marketplace がキャンセルプロセスを完了するまでに数分かかります。

1. [支払い方法の追加](./subscribe-by-adding-credit-card#add-a-credit-card)の手順に従って、支払いクレジットカードを追加します。

1. **請求概要**ページの**支払い方法**セクションで更新を確認します。

</Procedures>

## AWS Marketplace 購読のキャンセル{#cancel-aws-marketplace-subscription}

AWS Marketplace の購読をキャンセルするには、AWS Marketplace コンソールを開き、[AWS ガイドの指示](https://docs.aws.amazon.com/marketplace/latest/buyerguide/cancel-subscription.html)に従う必要があります。

## AWS Marketplace の料金体系{#aws-marketplace-pricing-terms}

詳細については、[支払いと請求](./payment-billing#marketplace-pricing-terms)を参照してください。

## トラブルシューティング{#troubleshooting}

**マーケットプレイスの購読を Zilliz Cloud にリンクする際に、利用可能な組織がない場合、どうすればよいですか？**

いくつかの理由が考えられます。

- **権限不足**

    - これは、十分な権限がない場合に発生する可能性があります。利用できない組織の横に**「権限不足」**タグが表示されます。

    ![insufficient-permission-subscription](https://zdoc-images.s3.us-west-2.amazonaws.com/insufficient-permission-subscription.png "insufficient-permission-subscription")

    - マーケットプレイスの購読と組織をリンクするには、**組織オーナー**または**組織請求管理者**である必要があります。組織メンバーであるだけでは、必要な権限がありません。組織オーナーに連絡して支援を求めてください。

- **すべての組織がすでにマーケットプレイスの購読に正常にリンクされている**

    - これは、すべての組織がすでにマーケットプレイスの購読にリンクされている場合に発生する可能性があります。利用できない組織の横に**「マーケットプレイスにリンク済み」**タグが表示されます。

    ![marketplace-already-linked-subscription](https://zdoc-images.s3.us-west-2.amazonaws.com/marketplace-already-linked-subscription.png "marketplace-already-linked-subscription")

    この場合、

    - 既存のマーケットプレイスの購読を更新する必要がある場合は、まず組織の現在の購読を[リンク解除](./subscribe-on-aws-marketplace#cancel-aws-marketplace-subscription)してから、新しい購読を設定してください。

    - 異なるマーケットプレイスの購読に複数の組織が必要な場合は、次のことができます。

        - 新しい Zilliz Cloud アカウントを[登録](./register-with-zilliz-cloud)して新しい組織を作成します。次に、組織オーナーを新しい組織に[招待](./organization-users#invite-a-user-to-your-organization)します。この組織オーナーは複数の組織に属し、各組織に異なるマーケットプレイスの購読を設定できます。

        - [サポートチケットを作成](http://support.zilliz.com)して、新しい組織を作成してもらいます。現在、Zilliz Cloud はユーザーによる組織の手動作成をサポートしていません。

- **リストに組織がない**

    - これは、アカウントが閉鎖されたか、すべての組織を離れた場合に発生する可能性があります。UI は次のようになります。

    ![no-organization-during-subcription](https://zdoc-images.s3.us-west-2.amazonaws.com/no-organization-during-subcription.png "no-organization-during-subcription")

    この場合、次のことができます。

    - 新しい組織を作成します。

    - 他のユーザーにあなたを彼らの組織に[招待](./organization-users#invite-a-user-to-your-organization)してもらい、組織オーナーの役割を付与してもらいます。

    - [サポートチケットを送信](https://support.zilliz.com/hc/en-us)すると、新しい組織を作成します。

## 関連トピック{#related-topics}

- [クレジットカードを追加して購読する](./subscribe-by-adding-credit-card)

- [Azure Marketplace で購読する](./subscribe-on-azure-marketplace)

- [GCP Marketplace で購読する](./subscribe-on-gcp-marketplace)

- [請求書を表示する](./view-invoice) 

