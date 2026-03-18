---
title: "組織設定の管理 | BYOC"
slug: /organization-settings
sidebar_label: "組織設定"
beta: FALSE
notebook: FALSE
description: "組織オーナーの場合、組織設定を管理する権限があります。| BYOC"
type: origin
token: AAqUwQW3qia3akkjfDNc0kwanlh
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - organizations
  - settings

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# 組織設定の管理

組織オーナーである場合、組織設定を管理する権限があります。

このガイドでは、組織設定を管理する手順について説明します。

## 組織の表示\{#view-organizations}

Zilliz Cloud にサインアップすると、デフォルトの組織が作成されます。新しい組織を作成することはできませんが、招待を通じて他のユーザーの組織に参加することができます。

[Zilliz Cloud コンソール](https://cloud.zilliz.com/login) にログインすると、自分が所属している組織の一覧ページが表示されます。これらの組織を確認して進入することができます。

参加済みのすべての組織をすばやく表示するには、左上隅にある**すべての組織**をクリックしてください。

![view-organizations](https://zdoc-images.s3.us-west-2.amazonaws.com/view-organizations.png "view-organizations")

## 組織の名前変更\{#rename-an-organization}

組織の名前を変更するには、[組織オーナー](./organization-users) である必要があります。

![edit-organization-name-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/edit-organization-name-byoc.png "edit-organization-name-byoc")

## タイムゾーンの管理\{#manage-timezone}

システムタイムゾーンは、最初のログイン時に設定され、Zilliz Cloud に表示されるすべての時間文字列に適用されます。

現在のタイムゾーンを表示するには、組織オーナーまたは組織メンバーである必要があります。組織内の役割の詳細については、[組織ユーザーの管理](./organization-users) を参照してください。

![byoc-timezone-settings](https://zdoc-images.s3.us-west-2.amazonaws.com/byoc-timezone-settings.png "byoc-timezone-settings")

システムタイムゾーンを変更するには、[組織オーナー](./organization-users) である必要があります。**編集**をクリックして**タイムゾーン設定**ダイアログボックスを開き、ドロップダウンリストからタイムゾーンを選択します。また、タイムゾーン名を入力して、目的のタイムゾーンをすばやくフィルタリングすることもできます。

## メンテナンス期間の設定\{#set-up-maintenance-window}

メンテナンス期間を設定することで、Zilliz Cloud がホストされたクラスターのメンテナンスをスケジュールできるようにできます。これにより、影響の大きいメンテナンスイベントをより予測可能にし、ワークロードへの混乱を軽減できます。

現在、メンテナンス期間の設定はグローバルであり、Zilliz Cloud でホストされているすべてのクラスターに適用されます。

デフォルトでは、Zilliz Cloud はビジネスピーク時の混乱を避けるため、毎日現地時間の午前 0 時から午後 2 時まで、最も影響の大きい更新をブロックします。特定の日に行われる今後のメンテナンスイベントについては、事前に通知が届きます。その日、Zilliz Cloud は希望する期間中にアクションを実行します。

メンテナンスイベントは通常 2 時間続き、サービス中断を引き起こす可能性があります。デフォルトのメンテナンス期間は、現地時間の午前 2 時から午前 4 時の間です。「システムメンテナンス期間」でオプションを選択し、ニーズに合わせてメンテナンス期間を調整できます。

メンテナンスイベントが完了した後、再度通知が届きます。また、通知を見逃した場合に備えて、Zilliz Cloud は「アクティビティ」に各メンテナンスイベントの開始時刻と終了時刻を一覧表示します。

現在のタイムゾーンを表示するには、左側のナビゲーションペインから**設定**を選択し、**システムメンテナンス期間**エリアで現在適用されているメンテナンス期間を確認します。

システムメンテナンス期間を変更するには、**編集**をクリックして「システムメンテナンス期間の編集」ダイアログボックスを開き、**システムメンテナンス期間**ドロップダウンリストから時間枠を選択します。

![byoc-maintenance-window](https://zdoc-images.s3.us-west-2.amazonaws.com/byoc-maintenance-window.png "byoc-maintenance-window")

## 組織の削除\{#delete-organization}

開始する前に、以下の条件が満たされていることを確認してください。

- 現在の組織内のすべてのクラスターが[削除](./manage-cluster) されていること。

- 対象組織で [組織オーナー](./organization-users) の役割が付与されていること。

- 残っている前払い資金がすべて返金されていること。

組織を削除するには：

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) にログインします。

1. 削除したい組織に入ります。

1. 左側のナビゲーションペインで、**設定**をクリックします。

1. **システム設定**ページで、**組織の削除**エリアを見つけ、ボタンをクリックします。

1. ポップアップウィンドールの指示に従い、ボタンをクリックして組織の削除を完了します。

</Procedures>

<Admonition type="caution" icon="🚧" title="Warning">

<p>組織の削除操作は元に戻せません。この操作には十分ご注意ください。</p>

</Admonition>

![byoc-delete-organization](https://zdoc-images.s3.us-west-2.amazonaws.com/byoc-delete-organization.png "byoc-delete-organization")

