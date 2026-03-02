---
title: "組織設定の管理 | BYOC"
slug: /organization-settings
sidebar_label: "組織設定"
beta: FALSE
notebook: FALSE
description: "組織のオーナーであれば、組織設定を管理する権限があります。 | BYOC"
type: origin
token: AAqUwQW3qia3akkjfDNc0kwanlh
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 組織
  - 設定
  - ベクトルデータベース オープンソース
  - オープンソース ベクトルDB
  - ベクトルデータベース 例
  - rag ベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# 組織設定の管理

組織の所有者である場合、組織設定を管理する権限があります。

このガイドでは、組織設定を管理する手順を説明します。

## 組織の表示{#view-organizations}

Zilliz Cloud にサインアップすると、デフォルトの組織が作成されます。新しい組織を作成することはできませんが、招待によって他のユーザーの組織に参加できます。

[Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインすると、参加している組織を一覧表示するページが表示されます。これらの組織を確認して入力できます。

参加しているすべての組織をすばやく表示するには、左上隅の **All Organizations** をクリックします。

![view-organizations](https://zdoc-images.s3.us-west-2.amazonaws.com/view-organizations.png "view-organizations")

## 組織名の変更{#rename-an-organization}

組織名を変更するには、[組織の所有者](./organization-users)である必要があります。

![edit-organization-name-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/edit-organization-name-byoc.png "edit-organization-name-byoc")

## タイムゾーンの管理{#manage-timezone}

システムタイムゾーンは、最初のログインが発生した場所に設定され、Zilliz Cloud に表示されるすべての時刻文字列に適用されます。

現在のタイムゾーンを表示するには、組織の所有者または組織のメンバーである必要があります。組織内の役割の詳細については、[組織ユーザーの管理](./organization-users)を参照してください。

![byoc-timezone-settings](https://zdoc-images.s3.us-west-2.amazonaws.com/byoc-timezone-settings.png "byoc-timezone-settings")

システムタイムゾーンを変更するには、[組織の所有者](./organization-users)である必要があります。**Edit** をクリックして **Time Zone Settings** ダイアログボックスを開き、ドロップダウンリストからタイムゾーンを選択します。タイムゾーンの名前を入力して、目的のタイムゾーンをすばやくフィルタリングすることもできます。

## メンテナンスウィンドウの設定{#set-up-maintenance-window}

メンテナンスウィンドウを設定して、Zilliz Cloud がホストされているクラスターのメンテナンスをスケジュールできるようにすることができます。これにより、影響の大きいメンテナンスイベントがより予測可能になり、ワークロードへの影響が少なくなります。

現在、メンテナンスウィンドウの設定はグローバルであり、Zilliz Cloud でホストされているすべてのクラスターに適用されます。

デフォルトでは、Zilliz Cloud は、ピーク時のビジネス時間中の混乱を避けるため、毎日午前 0 時から午後 2 時まで、ほとんどの影響の大きい更新をブロックします。特定の日の今後のメンテナンスイベントについて、事前に通知を受け取ります。その日、Zilliz Cloud は優先ウィンドウ時間中にアクションを実行します。

メンテナンスイベントは通常 2 時間続き、サービスの中断を引き起こす可能性があります。デフォルトのメンテナンスウィンドウは、現地時間の午前 2 時から午前 4 時までです。ニーズに合わせて、「System Maintenance Window」でオプションを選択してメンテナンスウィンドウを調整できます。

メンテナンスイベントが終了すると、別の通知を受け取ります。Zilliz Cloud は、通知を見逃した場合に備えて、「Activities」にすべてのメンテナンスイベントの開始と終了をリストアップします。

現在のタイムゾーンを表示するには、左側のナビゲーションペインから **Settings** を選択し、**System Maintenance Window** エリアで現在適用されているメンテナンスウィンドウ時間を見つけます。

システムメンテナンスウィンドウ時間を変更するには、**Edit** をクリックして Edit System Maintenance Window ダイアログボックスを開き、**System Maintenance Window** ドロップダウンリストから時間ウィンドウを選択します。

![byoc-maintenance-window](https://zdoc-images.s3.us-west-2.amazonaws.com/byoc-maintenance-window.png "byoc-maintenance-window")

## 組織の削除{#delete-organization}

開始する前に、次の条件が満たされていることを確認してください。

- 現在の組織内のすべてのクラスターが[削除されている](./manage-cluster)。

- ターゲット組織で[組織の所有者](./organization-users)ロールが付与されている。

- 残りの前払い資金はすべて払い戻される必要がある。

組織を削除するには：

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインします。

1. 削除したい組織に入ります。

1. 左側のナビゲーションペインで、**Settings** をクリックします。

1. **System Settings** ページで、**Delete Organization** エリアを見つけてボタンをクリックします。

1. ポップアップウィンドウの指示に従い、ボタンをクリックして組織の削除を完了します。

</Procedures>

<Admonition type="caution" icon="🚧" title="Warning">

<p>組織を削除する操作は元に戻せません。この操作には細心の注意を払ってください。</p>

</Admonition>

![byoc-delete-organization](https://zdoc-images.s3.us-west-2.amazonaws.com/byoc-delete-organization.png "byoc-delete-organization")

