---
title: "ごみ箱を使用する | Cloud"
slug: /use-recycle-bin
sidebar_label: "ごみ箱を使用する"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud のごみ箱機能は、意図的であるか、試用期間の終了またはサービスの一時停止の結果であるかにかかわらず、削除されたすべての Serverless および Dedicated クラスターの記録を保持することで、データを保護します。気が変わった場合や、誤ってクラスターを削除してしまった場合でも、ごみ箱はクラスター復元のために 30 日間の猶予期間を提供します。 | Cloud"
type: origin
token: JQvjwCDxhiMcj0kpaWicqXsTn1e
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - ごみ箱
  - ベクトル化
  - k近傍法
  - ANNS
  - ベクトル検索

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# ごみ箱を使用する

Zilliz Cloudのごみ箱機能は、意図的に削除されたか、試用期間の終了またはサービス停止の結果として削除されたかに関わらず、すべてのServerlessおよびDedicatedクラスターの記録を保持することでデータを保護します。気が変わった場合や誤ってクラスターを削除した場合でも、ごみ箱はクラスター復元のために30日間の猶予期間を提供します。

ごみ箱を使用するには、**Organization Owner**である必要があります。

## 前提条件{#prerequisites}

ごみ箱内のクラスターを復元するには、[支払い方法を追加する](/docs/payment-billing)必要があります。

## ごみ箱で削除されたクラスターを復元する{#restore-a-dropped-cluster-in-the-recycle-bin}

![use-recycle-bin](https://zdoc-images.s3.us-west-2.amazonaws.com/use-recycle-bin.png "use-recycle-bin")

<Procedures>

1. 削除されたクラスターが属する組織に移動します。

1. 左側のナビゲーションメニューまたは上部のナビゲーションアイコンから**Recycle Bin**にアクセスします。

1. 復元するクラスターを見つけます。**Actions**ドロップダウンから**Restore Cluster**を選択します。

1. 復元されたクラスターを設定します。

    1. クラスターをこの組織内の別のプロジェクトに復元できますが、別のクラウドリージョンには復元できません。

    1. クラスターの名前を変更し、クエリCUの数をリセットできます。

    <Admonition type="info" icon="📘" title="Notes">

    <p>クラスター内のcollectionのロード状態は保持されます。</p>

    </Admonition>

1. **Restore**をクリックします。Zilliz Cloudは、指定された属性でクラスターの作成を開始し、作成されたクラスターにデータを復元します。

1. 新しい復元ジョブが生成されます。[Jobs](./job-center)ページでクラスターの復元進行状況を確認できます。ジョブステータスが**IN PROGRESS**から**SUCCESSFUL**に切り替わると、復元は完了です。

</Procedures>