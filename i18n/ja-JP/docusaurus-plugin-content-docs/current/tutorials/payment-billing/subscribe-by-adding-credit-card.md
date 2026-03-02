---
title: "クレジットカードの追加によるサブスクリプション | Cloud"
slug: /subscribe-by-adding-credit-card
sidebar_label: "クレジットカード"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloud で組織の支払い用クレジットカードを追加する方法について、包括的な手順を説明します。 | Cloud"
type: origin
token: TVnkwXupUiX3zDkzYPWcxKP3nvg
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - クレジットカード
  - サブスクライブ
  - knnアルゴリズム
  - HNSW
  - 非構造化データとは
  - ベクトル埋め込み

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# クレジットカードを追加してサブスクライブする

このガイドでは、Zilliz Cloud で組織の支払い用クレジットカードを追加する方法について、包括的な手順を説明します。

<Admonition type="info" icon="📘" title="Note">

<ul>
<li><strong>課税:</strong> 請求書にかかる税金は、お客様が提供する請求先住所に基づいて計算されます。VAT または GST ID の入力が必要な企業は、<a href="http://support.zilliz.com">お問い合わせください</a>。</li>
</ul>

</Admonition>

## クレジットカードを追加する{#add-a-credit-card}

<Procedures>

1. アカウントを登録してログインした後、左側のメニューから **Billing** に移動して、請求概要にアクセスします。

1. 画面右下にある **Payment** **Method** セクションで、**Add Payment Method** をクリックします。開いたダイアログボックスで、**Credit Card** を選択します。

    ダイアログボックスが表示され、以下を入力するよう求められます。

    - クレジットカード情報:

        - **カード番号**

        - **有効期限**

        - **CVC**

    - 請求情報:

        - **名**

        - **姓**

        - **会社名**

        - **メールアドレス**

        - **番地**

            - 会社の住所を使用することをお勧めします。この住所は税金の計算に使用され、発行されるすべての請求書に記載されます。

        - **国/地域**

        - **都道府県**

        - **市区町村**

        - **郵便番号**

</Procedures>

上記のすべてのフィールドは必須です。完了すると、**Add** ボタンが有効になり、クレジットカード情報と請求情報を保存できます。

![add-credit-card](https://zdoc-images.s3.us-west-2.amazonaws.com/add-credit-card.png "add-credit-card")

## 支払い方法を編集する{#edit-your-payment-method}

支払い方法は、**Billing** **Overview** ページからいつでも表示および編集できます。

![payment-overivew](https://zdoc-images.s3.us-west-2.amazonaws.com/payment-overivew.png "payment-overivew")

クレジットカードの有効期限が近づくと、当社の[クレジットカード有効期限モニター](./manage-organization-alerts)から通知が届きます。支払い情報を更新するか、都合の良いときに [AWS Marketplace サブスクリプション](./subscribe-on-aws-marketplace)に切り替えることができます。

### **クレジットカードを編集する**{#edit-credit-card}

クレジットカード情報を更新するには、**Payment Method** エリアの鉛筆アイコンをクリックします。

 ダイアログボックスが表示され、以下を入力するよう求められます。

- クレジットカード情報:

    - **カード番号**

    - **有効期限**

    - **CVC**

- 請求情報:

    - **名**

    - **姓**

    - **会社名**

    - **メールアドレス**

    - **番地**

        - 会社の住所を使用することをお勧めします。この住所は税金の計算に使用され、発行されるすべての請求書に記載されます。

    - **国/地域**

    - **都道府県**

    - **市区町村**

    - **郵便番号**

上記のすべてのフィールドは必須です。完了すると、**Update** ボタンが有効になり、支払い方法を保存できます。

![update-payment-method](https://zdoc-images.s3.us-west-2.amazonaws.com/update-payment-method.png "update-payment-method")

### **請求プロファイルを編集する**{#edit-billing-profile}

請求プロファイルを更新するには、**Billing Profile** エリアの鉛筆アイコンをクリックします。

![edit-billing-profile](https://zdoc-images.s3.us-west-2.amazonaws.com/edit-billing-profile.png "edit-billing-profile")

### **Marketplace サブスクリプションに切り替える**{#switch-to-marketplace-subscription}

クレジットカード支払い方法から AWS、GCP、または Azure Marketplace サブスクリプションへの移行を希望する方は、対応する Marketplace にアクセスし、Zilliz Cloud サービスをサブスクライブしてください。詳細な手順については、[AWS Marketplace でサブスクライブする](./subscribe-on-aws-marketplace)、[GCP Marketplace でサブスクライブする](./subscribe-on-gcp-marketplace)、および [Azure Marketplace でサブスクライブする](./subscribe-on-azure-marketplace) のガイドを参照してください。

AWS Marketplace を介したサブスクリプションが成功すると、既存のクレジットカード情報が自動的に置き換えられます。**Billing Overview** ページの **Payment Method** セクションで更新を確認できます。

<Admonition type="info" icon="📘" title="Note">

<p>請求概要に反映されるまで数分かかります。</p>

</Admonition>

## 支払い用クレジットカードを削除する{#remove-payment-credit-card}

現在、Zilliz Cloud はウェブコンソールでの支払い用クレジットカードの削除をサポートしていません。リンクされたクレジットカードを削除する必要がある場合は、Zilliz Cloud の [サポートポータル](https://support.zilliz.com/hc/en-us) にお問い合わせいただき、チケットを提出してください。

## 関連トピック{#related-topics}

- [AWS Marketplace でサブスクライブする](./subscribe-on-aws-marketplace)

- [GCP Marketplace でサブスクライブする](./subscribe-on-gcp-marketplace)

- [請求書を表示する](./view-invoice) 

