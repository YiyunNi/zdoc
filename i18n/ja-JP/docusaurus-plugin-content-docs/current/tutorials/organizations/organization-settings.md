---
title: "組織設定の管理 | Cloud"
slug: /organization-settings
sidebar_label: "組織設定"
beta: FALSE
notebook: FALSE
description: "組織のオーナーである場合、組織設定を管理する権限があります。"
type: origin
token: AAqUwQW3qia3akkjfDNc0kwanlh
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 組織
  - 設定
  - Faiss vector database
  - Chroma vector database
  - nlp search
  - hallucinations llm

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# 組織設定の管理

組織の所有者である場合、組織設定を管理する権限があります。

このガイドでは、組織設定を管理する手順を説明します。

## 組織の表示{#view-organizations}

Zilliz Cloud にサインアップすると、デフォルトの組織が作成されます。新しい組織を作成することはできませんが、招待によって他のユーザーの組織に参加することはできます。

[Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインすると、参加している組織を一覧表示するページが表示されます。これらの組織を確認して入ることができます。

参加しているすべての組織をすばやく表示するには、左上隅の **All Organizations** をクリックします。

![view-organizations](https://zdoc-images.s3.us-west-2.amazonaws.com/view-organizations.png "view-organizations")

## 組織名の変更{#rename-an-organization}

組織名を変更するには、[組織の所有者](./organization-users)である必要があります。

組織名を変更するには、次のいずれかの方法があります。

- 組織リストページで組織名を変更する:

    ![rename-organization](https://zdoc-images.s3.us-west-2.amazonaws.com/rename-organization.png "rename-organization")

- 組織に入り、**System Settings** ページで組織名を変更する:

    ![edit-organization-name](https://zdoc-images.s3.us-west-2.amazonaws.com/edit-organization-name.png "edit-organization-name")

## タイムゾーンの管理{#manage-timezone}

システムタイムゾーンは、最初のログインが発生した場所に設定され、Zilliz Cloud に表示されるすべての時刻文字列に適用されます。

現在のタイムゾーンを表示するには、組織の所有者または組織のメンバーである必要があります。組織内の役割の詳細については、[組織ユーザーの管理](./organization-users)を参照してください。

![timezone-settings](https://zdoc-images.s3.us-west-2.amazonaws.com/timezone-settings.png "timezone-settings")

システムタイムゾーンを変更するには、[組織の所有者](./organization-users)である必要があります。**Edit** をクリックして **Time Zone Settings** ダイアログボックスを開き、ドロップダウンリストからタイムゾーンを選択します。タイムゾーンの名前を入力して、目的のタイムゾーンをすばやくフィルタリングすることもできます。

## メンテナンスウィンドウの設定{#set-up-maintenance-window}

Zilliz Cloud がホストされているクラスターのメンテナンスをスケジュールできるように、メンテナンスウィンドウを設定できます。これにより、影響の大きいメンテナンスイベントがより予測可能になり、ワークロードへの影響が少なくなります。

現在、メンテナンスウィンドウの設定はグローバルであり、Zilliz Cloud でホストされているすべてのクラスターに適用されます。

デフォルトでは、Zilliz Cloud は、ピーク時のビジネス時間中の混乱を避けるため、毎日午前0時から午後2時までのほとんどの影響の大きい更新をブロックします。特定の日の今後のメンテナンスイベントについては、事前に通知が届きます。その日、Zilliz Cloud は優先ウィンドウ時間中にアクションを実行します。

メンテナンスイベントは通常2時間続き、サービスの中断を引き起こす可能性があります。デフォルトのメンテナンスウィンドウは現地時間の午前2時から午前4時です。ニーズに合わせて「System Maintenance Window」のオプションを選択することで、メンテナンスウィンドウを調整できます。

メンテナンスイベントが終了すると、別の通知が届きます。Zilliz Cloud は、通知を見逃した場合に備えて、すべてのメンテナンスイベントの開始と終了を「Activities」にリストアップし、さらに確認できるようにします。

現在のタイムゾーンを表示するには、左側のナビゲーションペインから **Settings** を選択し、**System Maintenance Window** エリアで現在適用されているメンテナンスウィンドウ時間を見つけます。

システムメンテナンスウィンドウ時間を変更するには、**Edit** をクリックして Edit System Maintenance Window ダイアログボックスを開き、**System Maintenance Window** ドロップダウンリストから時間ウィンドウを選択します。

![maintenance-window](https://zdoc-images.s3.us-west-2.amazonaws.com/maintenance-window.png "maintenance-window")

## 組織の削除{#delete-organization}

開始する前に、次の条件が満たされていることを確認してください。

- 現在の組織内のすべてのクラスターが[削除されている](./manage-cluster)。

- 現在の組織内のすべてのボリュームが[削除されている](./manage-volumes-via-console#delete-a-volume)。

- すべての組織の[請求書](./view-invoice)が支払われている。

- ターゲット組織で[組織の所有者](./organization-users)の役割が付与されている。

- 残りの前払い資金はすべて返金する必要がある。

- サードパーティの[マーケットプレイスサブスクリプションをキャンセルする必要がある](./subscribe-on-aws-marketplace#cancel-aws-marketplace-subscription)。

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

![delete-organization-en](https://zdoc-images.s3.us-west-2.amazonaws.com/delete-organization-en.png "delete-organization-en")

