---
title: "組織アラートの管理 | Cloud"
slug: /manage-organization-alerts
sidebar_label: "組織アラートの管理"
beta: FALSE
notebook: FALSE
description: "組織アラートは、Zilliz Cloud組織全体の請求およびアカウント関連のメトリクスを監視します。クラスターのパフォーマンスに焦点を当てるプロジェクトアラートとは異なり、組織アラートはクレジット残高、支払い方法、使用パターンを追跡し、中断のないサービスを確保し、予期せぬ請求の問題を防ぐのに役立ちます。クレジットの枯渇、支払いの失敗、使用量しきい値に関するタイムリーな通知を受け取ることで、アカウントの健全性に関する情報を常に把握し、サービスの中断を回避できます。 | Cloud"
type: origin
token: UPg7wiU71ioeELk8I8KcLDYqncb
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 組織
  - アラート
  - openai vector db
  - 自然言語処理データベース
  - 安価なベクトルデータベース
  - マネージドベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# 組織アラートの管理

組織アラートは、Zilliz Cloud組織全体の請求およびアカウント関連のメトリクスを監視します。クラスターのパフォーマンスに焦点を当てるプロジェクトアラートとは異なり、組織アラートはクレジット残高、支払い方法、使用パターンを追跡し、サービスの中断を防ぎ、予期せぬ請求問題を回避するのに役立ちます。クレジットの枯渇、支払い失敗、使用量しきい値に関するタイムリーな通知を受け取ることで、アカウントの状態を把握し、サービスの中断を回避できます。

## 開始する前に{#before-you-start}

組織アラートを表示または管理する前に、以下を確認してください。

- **組織所有者**ロールアクセス

## 組織アラートの表示{#view-organization-alerts}

左側のサイドバーで**組織アラート**に移動し、組織アラートダッシュボードにアクセスして、アカウントの財務状況を監視します。

<Supademo id="cmb66uk3u3fadppkplclhnmdd" title="Zilliz Cloud - View Organization Alerts Demo" />

### アラート履歴{#alert-history}

**履歴**タブを使用して、過去のアラートアクティビティを調査し、請求パターンを理解します。これは、支出傾向の分析、クレジット使用量の確認、または利害関係者へのアカウント管理のデモンストレーションに役立ちます。

### アラート設定{#alert-settings}

**設定**タブを使用して、すべての請求関連アラートの現在のステータスを監視します。組織を保護しているアラートを確認し、その構成を確認する必要がある場合は、ここをチェックしてください。

アラートを表示すると、次の構成項目が表示されます。

<table>
   <tr>
     <th><p>フィールド</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>名前</p></td>
     <td><p>請求イベントを説明するアラート識別子（例：「クレジット残高不足」、「支払い方法の期限切れ」）</p></td>
   </tr>
   <tr>
     <td><p>ステータス</p></td>
     <td><p>現在のアラート状態：有効（アクティブな監視）または無効（通知なし）</p></td>
   </tr>
   <tr>
     <td><p>ターゲット</p></td>
     <td><p>監視対象スコープ - 組織全体</p></td>
   </tr>
   <tr>
     <td><p>メトリクスと条件</p></td>
     <td><p>クレジットしきい値、支払いステータス、使用制限を含むトリガーパラメーター</p></td>
   </tr>
   <tr>
     <td><p>重大度レベル</p></td>
     <td><p>影響分類</p><ul><li><p><strong>警告：</strong>制限に近づいています</p></li><li><p><strong>クリティカル：</strong>即座の注意が必要です</p></li></ul></td>
   </tr>
   <tr>
     <td><p>受信者</p></td>
     <td><p>設定されたメールアドレスと通信チャネルを含む通知受信者</p></td>
   </tr>
   <tr>
     <td><p>アクション</p></td>
     <td><p>利用可能な管理オプション：編集、クローン</p></td>
   </tr>
</table>

## 組織アラートの管理{#manage-organization-alerts}

組織のニーズと通知設定に合った効果的な請求監視を確実にするために、既存のアラートを変更および維持します。

<Supademo id="cmb67wl2i00ys1b0i2hcg3ls7" title="Manage Organization Alerts" isShowcase="true" />

### アラートの無効化または有効化{#disable-or-enable-an-alert}

アラート設定を失うことなく、アクティブな監視を制御します。

- **無効なアラート：**すべての設定を保持しますが、監視と通知を停止します

- **有効なアラート：**請求メトリクスを積極的に監視し、条件が満たされたときに通知を送信します

### アラートの編集{#edit-an-alert}

既存のアラートの通知受信者をカスタマイズし、トリガー条件を変更します。

### アラートのクローン作成{#clone-an-alert}

異なる通知設定またはしきい値の変更で同様のアラートを作成します。

## アラート受信者設定の構成{#configure-alert-receiver-settings}

新しいアラートに自動的に適用される組織全体のデフォルト通知設定を設定し、組織全体で一貫した請求通知プラクティスを確保します。

<Supademo id="cmb67pjbs3g31ppkpfd4l8mcv" title="Configure Alert Receiver Settings"/>

## FAQ{#faq}

### アラートがトリガーされた場合、アラート通知はどのくらいの頻度で届きますか？{#how-often-will-i-receive-alert-notifications-when-an-alert-is-triggered}

アラート通知は、自動頻度パターンに従います。

- **最初の通知**: アラートしきい値を超えるとすぐに送信されます

- **2番目の通知**: 条件が継続する場合、1時間後に送信されます

- **その後の通知**: アラート条件がアクティブな間、毎日1回送信されます

通知が頻繁すぎると思われる場合は、次のことができます。

- [アラートを編集](./manage-organization-alerts#edit-an-alert)して、条件しきい値または期間要件を調整します

- [アラートを一時的に無効にする](./manage-organization-alerts#disable-or-enable-an-alert)ことで、設定を保持しながらすべての通知を停止します

