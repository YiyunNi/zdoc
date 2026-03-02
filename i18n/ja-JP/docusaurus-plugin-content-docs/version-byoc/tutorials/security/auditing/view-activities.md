---
title: "プラットフォーム監査ログの表示 | BYOC"
slug: /view-activities
sidebar_label: "プラットフォーム監査ログの表示"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudプラットフォーム監査ログ機能は、特定のZilliz Cloud組織に関連するログ（アクセスログを含む）の包括的なビューを提供します。| BYOC"
type: origin
token: NeUWwqRl2iwn4HkZg3ocjLjmnth
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - アクティビティ
  - 表示
  - Agentic RAG
  - rag llm アーキテクチャ
  - プライベート llms
  - nn search

---

import Admonition from '@theme/Admonition';


# プラットフォーム監査ログの表示

Zilliz Cloudの**プラットフォーム監査ログ**機能は、特定のZilliz Cloud組織に関連するログ（アクセスログを含む）の包括的なビューを提供します。

## プラットフォーム監査ログの表示{#view-platform-audit-logs}

組織ページで、左側のナビゲーションペインにある**プラットフォーム監査ログ**をクリックします。ここでは、プラットフォームログの概要、各ログが記録された時刻、および関与したオペレーターのIDを表示できます。

![view-activities-saas](https://zdoc-images.s3.us-west-2.amazonaws.com/view-activities-saas.png "view-activities-saas")

## プラットフォーム監査ログのフィルタリング{#filter-platform-audit-logs}

プラットフォーム監査ログのナビゲーションをより制御しやすくするために、タイプと時間範囲でフィルタを適用できます。これらのフィルタリング条件を組み合わせて使用​​すると、よりカスタマイズされたビューが得られます。

- **時間範囲でフィルタリング**

    開始日と終了日を選択して、特定の期間内に発生したログを表示します。希望の時間範囲を設定したら、**適用**をクリックしてこの期間内のすべてのログを表示します。

    <Admonition type="info" icon="📘" title="Notes">

    <p>選択した開始日と終了日の間の期間が30日を超えないようにしてください。</p>

    </Admonition>

    ![filter-by-time-range](https://zdoc-images.s3.us-west-2.amazonaws.com/filter-by-time-range.png "filter-by-time-range")

- **タイプでフィルタリング**

    リストから希望のログタイプを選択します。Zilliz Cloudは、プラットフォーム監査ログを**情報**、**警告**、**エラー**の3つのタイプに分類します。

    <table>
       <tr>
         <th><p><strong>アクティビティタイプ</strong></p></th>
         <th><p><strong>説明</strong></p></th>
       </tr>
       <tr>
         <td><p>情報</p></td>
         <td><p>クラスター、アクセス、または請求に関連する一般情報。</p><p>例：クラスターin01-xxxxxxxxxxxxxxxが作成されました。</p></td>
       </tr>
       <tr>
         <td><p>警告</p></td>
         <td><p>注意が必要なリソースの状態に関する更新。</p><p>例：「クラスターin01-xxxxxxxxxxxxxxxが削除されました。」</p></td>
       </tr>
       <tr>
         <td><p>エラー</p></td>
         <td><p>支払い失敗やその他のシステム障害の通知で、即座の注意またはアクションが必要です。</p><p>例：「請求書invo-xxxxxxxxxxxxxxxxxxxxxxxxの支払いが失敗しました。」</p></td>
       </tr>
    </table>

    ![filter-by-activity-type](https://zdoc-images.s3.us-west-2.amazonaws.com/filter-by-activity-type.png "filter-by-activity-type")

- **監査ログでフィルタリング**

    ![filter-by-activity](https://zdoc-images.s3.us-west-2.amazonaws.com/filter-by-activity.png "filter-by-activity")

