---
title: "プラットフォーム監査ログを表示 | Cloud"
slug: /view-activities
sidebar_key: view-activities
sidebar_label: "プラットフォーム監査ログを表示"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud のプラットフォーム監査ログ機能は、特定の Zilliz Cloud 組織に関連するログを包括的に表示します。これには、請求ログとアクセスログが含まれます。"
type: origin
token: NeUWwqRl2iwn4HkZg3ocjLjmnth
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - アクティビティ
  - 表示

---

import Admonition from '@theme/Admonition';


# プラットフォーム監査ログの表示

Zilliz Cloud の **プラットフォーム監査ログ** 機能は、特定の Zilliz Cloud 組織に関連するログを包括的に表示します。これには、請求ログとアクセスログが含まれます。

## プラットフォーム監査ログの表示\{#view-platform-audit-logs}

組織ページで、左側のナビゲーションペインから **プラットフォーム監査ログ** をクリックします。ここでは、プラットフォームログの概要、各ログが記録された時刻、および関与したオペレーターの識別情報を確認できます。

![view-activities-saas](https://zdoc-images.s3.us-west-2.amazonaws.com/view-activities-saas.png "view-activities-saas")

## プラットフォーム監査ログのフィルタリング\{#filter-platform-audit-logs}

プラットフォーム監査ログのナビゲーションをより効率的に制御するため、タイプと時間範囲でフィルタリングを適用できます。これらのフィルタリング条件を組み合わせることで、より適切な表示が可能になります。

- **時間範囲でフィルタリング**

    開始日と終了日を選択して、特定の期間内に発生したログを表示します。希望の時間範囲を設定した後、**適用** をクリックして、この期間内のすべてのログを表示します。

    <Admonition type="info" icon="📘" title="Notes">

    <p>選択した開始日と終了日の間の期間が30日を超えないようにしてください。</p>

    </Admonition>

    ![filter-by-time-range](https://zdoc-images.s3.us-west-2.amazonaws.com/filter-by-time-range.png "filter-by-time-range")

- **タイプでフィルタリング**

    リストから希望のログタイプを選択します。Zilliz Cloud はプラットフォーム監査ログを3つのタイプに分類しています: **情報**、**警告**、および **エラー**。

    <table>
       <tr>
         <th><p><strong>アクティビティタイプ</strong></p></th>
         <th><p><strong>説明</strong></p></th>
       </tr>
       <tr>
         <td><p>情報</p></td>
         <td><p>クラスター、アクセス、または請求に関連する一般情報。</p><p>例: クラスター in01-xxxxxxxxxxxxxxx が作成されました。</p></td>
       </tr>
       <tr>
         <td><p>警告</p></td>
         <td><p>注意が必要なリソース状態に関する更新。</p><p>例: 「クラスター in01-xxxxxxxxxxxxxxx が削除されました。」</p></td>
       </tr>
       <tr>
         <td><p>エラー</p></td>
         <td><p>即時の注意または対応が必要な支払い失敗またはその他のシステム障害の通知。</p><p>例: 「請求書 invo-xxxxxxxxxxxxxxxxxxxxxxxx の支払いが失敗しました。」</p></td>
       </tr>
    </table>

    ![filter-by-activity-type](https://zdoc-images.s3.us-west-2.amazonaws.com/filter-by-activity-type.png "filter-by-activity-type")

- **監査ログでフィルタリング**

    ![filter-by-activity](https://zdoc-images.s3.us-west-2.amazonaws.com/filter-by-activity.png "filter-by-activity")

