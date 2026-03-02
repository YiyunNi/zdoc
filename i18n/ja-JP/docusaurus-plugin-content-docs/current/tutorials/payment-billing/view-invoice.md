---
title: "請求書 | Cloud"
slug: /view-invoice
sidebar_label: "請求書"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud の請求は組織レベルで行われます。請求書にアクセスするには、組織オーナーまたは請求管理者権限が必要です。"
type: origin
token: PBEbwjRu9iyyaFkZnuzcINHCnke
sidebar_position: 7
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 請求書
  - 表示
  - LLMs
  - 機械学習
  - RAG
  - NLP

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Procedures from '@site/src/components/Procedures';

# 請求書

Zilliz Cloud は組織レベルで課金されます。請求書にアクセスするには、**組織所有者**または**請求管理者**のいずれかの権限が必要です。

このガイドでは、請求書の表示、支払い、ダウンロード方法、および請求書の詳細の解釈方法について説明します。

<Admonition type="info" icon="📘" title="注記">

<p>マーケットプレイスで購読している場合、Zilliz Cloud の使用に対する請求書はマーケットプレイスを通じて受け取ります。</p>

</Admonition>

## 請求書を理解する{#understand-your-invoices}

各請求書はいくつかの主要なコンポーネントで構成されています。このセクションでは、各要素を理解するのに役立つ請求書の例を説明します。

![example-invoice](https://zdoc-images.s3.us-west-2.amazonaws.com/example-invoice.png "example-invoice")

### 請求サイクル{#billing-cycle}

請求書の上部に表示される請求サイクルは、料金が計算される期間と支払い期日を示します。

![Vp6Rwz3Eph1IuXbQgKScVcSEnZg](https://zdoc-images.s3.us-west-2.amazonaws.com/Vp6Rwz3Eph1IuXbQgKScVcSEnZg.png)

- **請求サイクル:** 通常、前月の1日00:00:00 (UTC) から始まり、その月の最終日23:59:59 (UTC) に終わる1ヶ月間です。たとえば、Zilliz Cloud は2024年8月の請求書を2024年9月1日に発行し、請求期間は2024年8月1日00:00:00 (UTC) から2024年8月31日23:59:59 (UTC) までとなります。この期間中の使用量に対して料金が累積され、請求書のステータスは「**未請求**」のままです。

- **発行日:** 請求書が生成される日付です。この日、請求書のステータスは「**未払い**」に変更され、支払いが可能になります。支払い方法（例：クレジットカードまたはマーケットプレイスのサブスクリプション）を追加している場合、自動的に請求されます。支払いが成功すると、請求書のステータスは「**支払い済み**」に更新されます。支払いが失敗した場合は、**組織所有者**および**請求管理者**に通知メールが送信されます。

- **期日:** 支払いを完了する最終日です。この日までに支払いが受領されない場合、請求書は**猶予期間**に入ります。

- **猶予期間:** 支払いがまだ可能な14日間の期間です。この期間中、毎日メールリマインダーが送信され、支払いが成功するまで請求書のステータスは「**未払い**」のままです。

- **延滞日:** 支払いが未払いのままの場合、請求書のステータスは「**延滞**」になります。翌日には組織が凍結される可能性があるため、速やかに支払うことをお勧めします。凍結後1日以内に支払いがなければ、すべてのクラスター（ServerlessおよびDedicated）は自動的に[ごみ箱](./use-recycle-bin)に移動され、30日間保持されます。

### 請求書のステータス{#invoice-status}

Zilliz Cloud では、請求書のステータスは支払いプロセスの異なる段階を表します。次の表は、各可能なステータスを説明しています。

<table>
   <tr>
     <th><p><strong>ステータス</strong></p></th>
     <th><p><strong>定義</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>未請求</strong></p></td>
     <td><p>請求サイクル後、明細書が生成される前に発生した取引。これらの金額はすぐに支払う必要はありませんが、次の請求サイクルに含まれます。</p></td>
   </tr>
   <tr>
     <td><p><strong>未払い</strong></p></td>
     <td><p>請求書が発行され、期日内です。</p></td>
   </tr>
   <tr>
     <td><p><strong>延滞</strong></p></td>
     <td><p>請求書が発行されましたが、期日内に支払われませんでした。</p></td>
   </tr>
   <tr>
     <td><p><strong>支払い済み</strong></p></td>
     <td><p>支払いが完了し、未払い額はありません。</p></td>
   </tr>
   <tr>
     <td><p><strong>無料</strong></p></td>
     <td><p>すべての未払い額がクレジットで支払われました。</p></td>
   </tr>
</table>

### 請求書の概要{#invoice-summary}

概要セクションでは、請求書に記載されている料金の概要が示されます。

- **使用量:** すべての課金対象項目（CU、ストレージ、バックアップ、パイプライン、読み書きコストを含む）の月間合計。

- **クレジット:** 支払いに対して適用されたクレジット。

- **小計:** 小計 = 使用量 - クレジット。

- **税金:** 税金 = 小計 × 税率。税率は請求先住所の国に基づきます。

- **合計金額:** 合計金額 = 小計 + 税金。

- **前払い:** 支払いを相殺するために使用された前払い額。

- **支払い期日/支払い済み金額:** 支払う必要がある、または支払った最終金額。

### クラスタープラン別の概要{#summary-by-cluster-plan}

Zilliz Cloud は、Free、Serverless、Dedicated の3種類のクラスターを提供しています。料金は Serverless および Dedicated クラスターにのみ適用されます。

- **Dedicated クラスター:** 使用量に基づいて課金されます。料金は `クラスターコスト = クラスターCUサイズ × 実行時間 × 単価` として計算されます。Serverless クラスターとは異なり、Dedicated クラスターでは、専用のリソース割り当てのため、アクティブな読み書き操作がなくても料金が発生します。

    <Admonition type="info" icon="📘" title="注記">

    <p>Dedicated クラスターのコストについて、実行時間はクラスターのステータスが「<strong>Running</strong>」、「<strong>Modifying</strong>」、「<strong>Frozen</strong>」などの期間として定義されます。以下の4つのステータスのクラスターは課金されません：「<strong>Creating</strong>」、「<strong>Suspending</strong>」、「<strong>Resuming</strong>」、または「<strong>Suspended</strong>」。</p>

    </Admonition>

- **Serverless クラスター:** 読み書き操作中の vCU 消費量に対して従量課金されます。コストは `読み書きコスト = vCU使用量 × vCU単価` として計算されます。操作が発生しない場合、ストレージ料金のみが課金されます。

追加料金には以下が含まれます。

- **バックアップコスト:** `バックアップファイルサイズ × バックアップ保持期間` として計算され、「GB-月」で測定されます。これは、1ヶ月間保持される1GBのバックアップファイルの使用量を指します。**バックアップは、保持期間が短い場合でも最低1日分が課金されます。** これは、バックアップファイルが作成されて1日未満で保持された場合でも、1日分の料金が課金されることを意味します。

- **ストレージコスト:** `現在のストレージサイズ × クラスター実行時間` として計算され、「GB-時間」で測定されます。これは、1時間保存される1GBのデータ使用量を指します。**ストレージは、保存期間が短い場合でも最低1時間分が課金されます。**

    <Admonition type="info" icon="📘" title="注記">

    <p>ストレージコストについて、実行時間はクラスターのステータスが「<strong>Running</strong>」、「<strong>Modifying</strong>」、「<strong>Frozen</strong>」などの期間として定義されます。以下のステータスのクラスターは課金されません：「<strong>Creating</strong>」。</p>

    </Admonition>

### 請求書の詳細{#invoice-details}

このセクションでは、各課金対象項目の料金の内訳が詳細に示されます。

### 請求プロファイル{#billing-profile}

請求プロファイルには、請求書の発行先と宛先に関する詳細が含まれます。Zilliz Cloud では、関連する請求メールは組織所有者、組織請求管理者、および請求プロファイルに追加されたメールアドレスに送信されます。したがって、請求書の受取人を追加するには、請求プロファイルにメールアドレスを追加するか、[ユーザーを招待](./organization-users)して組織請求管理者として組織に参加させることができます。

請求プロファイルを編集するには、[クレジットカードを追加して購読する](./subscribe-by-adding-credit-card#edit-billing-profile)を参照してください。

## 請求書を管理する{#manage-invoices}

組織所有者または請求管理者である場合、請求書を表示、支払い、ダウンロードできます。

### すべての請求書を一覧表示する{#list-all-invoices}

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"cURL","value":"Bash"}]}>

<TabItem value="Cloud Console">

![view-invoices](https://zdoc-images.s3.us-west-2.amazonaws.com/view-invoices.png "view-invoices")

<Procedures>

1. 左側のナビゲーションで**Billing**をクリックします。

1. **Invoices**タブに切り替えます。現在および過去のすべての請求書が表示されます。

</Procedures>

</TabItem>

<TabItem value="Bash">

<Admonition type="info" icon="📘" title="注記">

<p>List Invoices RESTful API は現在パブリックプレビュー中です。この API を使用するには、<a href="http://support.zilliz.com">お問い合わせください</a>。</p>

</Admonition>

リクエストは次の例のようになるはずです。ここで `{TOKEN}` は、[組織所有者または請求管理者ロール](./organization-users#organization-roles)を持つ認証 API キーです。次の `GET` リクエストは、組織のすべての請求書を一覧表示します。

```bash
curl --request GET \
--url "https://api.cloud.zilliz.com/v2/invoices" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json"

# {
#     "code": 0,
#     "data": {
#         "count": 1,
#         "currentPage": 1,
#         "pageSize": 10,
#         "invoices": [
#             {
#                 "id": "inv-12312io23810o291",
#                 "orgId": "org-xxxxxx",
#                 "periodStart": "2024-01-01T00:00:00Z",
#                 "periodEnd": "2024-02-01T00:00:00Z",
#                 "invoiceDate": "2024-02-01T00:00:00Z",
#                 "dueDate": "2024-02-01T00:00:00Z",
#                 "currency": "USD",
#                 "status": "unpaid",
#                 "usageAmount": 52400,
#                 "creditsApplied": 12400,
#                 "alreadyBilledAmount": 0,
#                 "subtotal": 40000,
#                 "tax": 5000,
#                 "total": 45000,
#                 "advancePayAmount": 0,
#                 "amountDue": 45000
#             }
#         ]
#     }
# }
```

<Admonition type="info" icon="📘" title="Notes">

<p>APIによって返される結果では、すべての金額はセント単位です。</p>

</Admonition>

</TabItem>

</Tabs>

### 特定の請求書の詳細を表示する{#view-the-details-of-a-specific-invoice}

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"cURL","value":"Bash"}]}>

<TabItem value="Cloud Console">

![view-invoice-detail](https://zdoc-images.s3.us-west-2.amazonaws.com/view-invoice-detail.png "view-invoice-detail")

<Procedures>

1. 左側のナビゲーションで **Billing** をクリックします。

1. **Invoices** タブに切り替えます。

1. 対象の請求書の請求期間をクリックして、その詳細を表示します。

</Procedures>

</TabItem>

<TabItem value="Bash">

<Admonition type="info" icon="📘" title="Notes">

<p>Describe Invoice RESTful API は現在パブリックプレビュー中です。このAPIを使用するには、<a href="http://support.zilliz.com">お問い合わせください</a>。</p>

</Admonition>

リクエストは以下の例のようになります。ここで `{TOKEN}` は、[Organization Owner または Billing Admin ロール](./organization-users#organization-roles)を持つ認証APIキーです。以下の `GET` リクエストは、指定された請求書を記述します。

```bash
curl --request GET \
--url "https://api.cloud.zilliz.com/v2/invoices/${INVOICE_ID}" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json"

# {
#     "code": 0,
#     "data": {
#         "id": "inv-12312io23810o291",
#         "orgId": "org-xxxxxx",
#         "periodStart": "2024-01-01T00:00:00Z",
#         "periodEnd": "2024-02-01T00:00:00Z",
#         "invoiceDate": "2024-02-01T00:00:00Z",
#         "dueDate": "2024-02-01T00:00:00Z",
#         "currency": "USD",
#         "status": "unpaid",
#         "usageAmount": 52400,
#         "creditsApplied": 12400,
#         "alreadyBilledAmount": 0,
#         "subtotal": 40000,
#         "tax": 5000,
#         "total": 45000,
#         "advancePayAmount": 0,
#         "amountDue": 45000
#     }
# }
```

上記のコマンドでは、

- `{API_KEY}`: APIリクエストの認証に使用される認証情報。値を自分のものに置き換えてください。

- `{INVOICE_ID}`: 説明する請求書のID。

<Admonition type="info" icon="📘" title="Notes">

<p>APIによって返される結果では、すべての金額はセント単位です。</p>

</Admonition>

</TabItem>

</Tabs>

### 請求書の支払い{#pay-invoice}

請求書が期限切れになった場合、まず支払い方法を確認して更新し、Zilliz Cloudウェブコンソールから支払いを再試行できます。

![pay-invoice](https://zdoc-images.s3.us-west-2.amazonaws.com/pay-invoice.png "pay-invoice")

### 請求書のダウンロード{#download-invoice}

請求書をダウンロードするには、Zilliz Cloudウェブコンソールで対象の請求書の横にあるダウンロードアイコンをクリックします。

![download-invoices](https://zdoc-images.s3.us-west-2.amazonaws.com/download-invoices.png "download-invoices")

## トラブルシューティング / FAQ{#troubleshooting-faq}

1. **請求書の開始時刻と終了時刻はいつですか？**

    **説明:** 請求期間は、前月の1日の00:00:00 (UTC) に始まり、その月の最終日の23:59:59 (UTC) に終了します。

    **例:** Zilliz Cloudは、2024年9月1日に8月分の請求書を発行します。請求期間は、2024年8月1日00:00:00 (UTC) から2024年8月31日23:59:59 (UTC) までです。

1. **Zilliz Cloudの使用状況詳細に表示される金額の精度はどのくらいですか？**

    Zilliz Cloudは、**小数点以下10桁**の精度で料金を計算し、すべての請求はこの精度で計算されます。日次料金はまず小数点以下10桁で計算され、その後、請求処理中に合計され、小数点以下10桁に丸められます。

    - **RESTful API**: すべての数値（例：単価、使用量、使用金額）は、常に小数点以下10桁で返されます。値が小数点以下10桁未満の場合、末尾にゼロが埋められて10桁になります。RESTful APIの使用方法の詳細については、[Query Daily Usage](/reference/restful/query-daily-usage-v2)を参照してください。

    - **WebコンソールUI**: 表示される金額はAPIの値と一致しますが、読みやすさのために末尾のゼロは省略されます。たとえば、`0.1234000000`はUIでは`0.1234`と表示されます。

1. **請求書が届かないのはなぜですか？**

    **考えられる原因:** **組織の所有者**または**請求管理者**のみが請求書にアクセスできます。

    **解決策:** 必要な権限があることを確認してください。請求書にアクセスできない場合は、組織の所有者または請求管理者に連絡してください。

1. **支払い方法が失敗した場合はどうなりますか？**

    **考えられる原因:** 提供された支払い方法（例：クレジットカード）の有効期限が切れているか、資金が不足している可能性があります。

    **解決策:** 支払いが失敗した場合、Zilliz Cloudは**組織の所有者**と**請求管理者**にメールで通知します。組織の所有者と請求管理者は、**請求プロファイル**ページで組織の支払い方法を更新し、**14日間の猶予期間**内に支払いを再試行できます。

1. **猶予期間とは何ですか？**

    **説明:** **猶予期間**とは、支払い期日後14日間の期間で、請求書が期限切れになる前に支払いを完了できる期間です。

    **ヒント:** この期間中、毎日メールでリマインダーが届き、支払いが完了するまで請求書のステータスは未払いのままになります。

1. **期限日を過ぎても支払いをしなかった場合はどうなりますか？**

    **説明:** **猶予期間**内に支払いがされなかった場合：

    - **期限日**に、請求書は期限切れとしてマークされます。

    - **期限日**の翌日に、組織は**凍結**され、Zilliz Cloudサービスへのアクセスが制限されます。

    - 組織が凍結された翌日になっても支払いがされない場合、すべてのクラスター（ServerlessおよびDedicated）は自動的に削除されます。

    **解決策:** サービスの中断やデータ損失を避けるため、**期限日**までに支払いを解決してください。

1. **Serverlessクラスターで操作がないのに課金されるのはなぜですか？**

    **説明:** Serverlessクラスターで読み取りまたは書き込み操作が行われなくても、ストレージに対して課金されます。ストレージ費用は、保存されたデータのサイズとZilliz Cloudに保持された時間に基づいて計算されます。

    **解決策:** ストレージ費用を最小限に抑えるには、未使用のデータを削除することを検討してください。

1. **組織が凍結されたというメールを受け取りました。どうすればよいですか？**

    **説明:** 組織が凍結されたというメールを受け取った場合、それは支払いが期限切れであり、Zilliz Cloudサービスへのアクセスが制限されていることを意味します。

    **解決策:**

    組織を凍結解除するには：

    - クラスターの自動削除を防ぐため、凍結後1日以内に必要な支払いを行ってください。

    - 支払いが処理されると、組織は凍結解除され、クラスターへの完全なアクセスが復元されます。

1. **期限切れの請求書のために自動的に削除されたクラスターを回復するにはどうすればよいですか？**

    **説明:** クラスターが自動的に削除された場合、組織が凍結された後も支払いが失敗したことを意味します。

    **解決策:**

    自動的に削除されたクラスターを復元するには、

    - まず支払いを行って組織を凍結解除します。

    - 支払いが成功したら、ごみ箱に移動して削除されたクラスターを復元します。

    **ヒント:**

    - 削除されたクラスターは、ごみ箱に30日間保持されます。クラスターがまだ必要な場合は、クラスター削除から30日以内に期限切れの支払いを行ってください。

    - 支払いやクラスターの復元に関して問題がある場合は、[サポートチケットを提出してください](http://support.zilliz.com)。

