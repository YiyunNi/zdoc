---
title: "前払いの使用 | Cloud"
slug: /advance-pay
sidebar_key: advance-pay
sidebar_label: "前払い"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、クレジットカードの登録や AWS Marketplace へのサブスクリプションに代わる支払い方法として、前払い（銀行振込）もご利用いただけます。"
type: origin
token: K8hFwmeBQiCSO4ktT9ScD9zMnua
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 前払い

---

import Admonition from '@theme/Admonition';


# Advance Pay の利用

Zilliz Cloud では、クレジットカードの追加や AWS Marketplace での購読に代わる支払い方法として、Advance Pay（銀行振込）もご利用いただけます。

## Advance Pay に資金を追加する\{#add-funds-to-advance-pay}

現在、Advance Pay の残高に資金を追加するには、[お問い合わせ](https://zilliz.com/contact-sales) いただく必要があります。

<Admonition type="info" icon="📘" title="Note">

支払い方法の優先順位は以下の通りです: クレジット > Advance Pay > クレジットカード / AWS Marketplace 購読。

つまり、残りのクレジットがあり、かつ資金を追加済みでクレジットカードを登録しているか AWS Marketplace で購読している場合、使用料の支払いにはまずクレジットが差し引かれます。クレジットが不足する場合は、Advance Pay の資金が差し引かれます。資金とクレジットの両方で料金をカバーできない場合は、クレジットカードまたは AWS Marketplace アカウントへの請求となります。

</Admonition>

## Advance Pay の履歴を確認する\{#view-advance-pay-history}

銀行振込履歴を確認するには、上部ナビゲーションバーまたは左側ナビゲーションペインで **請求** をクリックします。次に、Advance Pay セクションの **履歴** をクリックします。**銀行振込履歴** ページでは、過去のすべての振込の詳細（振込日時、追加した資金の金額など）を確認できます。

![add-fund-en](https://zdoc-images.s3.us-west-2.amazonaws.com/add-fund-en.png "add-fund-en")

## Advance Pay 残高の監視を設定する\{#set-monitor-for-advance-pay-balance}

デフォルトでは、Advance Pay 残高の監視は無効になっています。ただし、有効にすることで、Advance Pay 残高が監視条件で指定した金額を下回った際に通知を受け取ることができます。詳細については、[組織アラートの管理](./manage-organization-alerts) を参照してください。

## Advance Pay 資金の返金\{#refund-advance-pay-funds}

現在、Zilliz Cloud では Web コンソールでの返金はサポートしていません。返金をご希望の場合は、お問い合わせいただくか、Zilliz Cloud の [サポートポータル](https://support.zilliz.com/hc/en-us) でリクエストを送信してください。

## 関連トピック\{#related-topics}

- [クレジットカードの追加による購読](./subscribe-by-adding-credit-card)

- [AWS Marketplace での購読](./subscribe-on-aws-marketplace)

- [GCP Marketplace での購読](./subscribe-on-gcp-marketplace)

- [請求書の確認](./view-invoice) 

