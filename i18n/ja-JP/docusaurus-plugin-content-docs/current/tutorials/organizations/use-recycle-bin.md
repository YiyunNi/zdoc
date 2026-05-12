---
title: "ごみ箱を使用 | Cloud"
slug: /use-recycle-bin
sidebar_key: use-recycle-bin
sidebar_label: "ごみ箱を使用"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud のごみ箱機能は、意図的に削除された場合や、トライアルの期限切れやサービスの停止によって削除された場合を含め、すべての Serverless および Dedicated クラスターの削除記録を保持することで、データを保護します。気が変わった場合や誤ってクラスターを削除した場合、ごみ箱ではクラスターの復元に30日間の猶予期間が提供されます。"
type: origin
token: JQvjwCDxhiMcj0kpaWicqXsTn1e
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - ごみ箱

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# ごみ箱の使用

Zilliz Cloud のごみ箱機能は、意図的に削除された場合やトライアルの期限切れ、サービスの停止の結果として削除された場合を含め、すべての Serverless および Dedicated クラスターの記録を保持することで、データを保護します。気が変わった場合や誤ってクラスターを削除した場合、ごみ箱はクラスターの復元のための 30 日間の猶予期間を提供します。

ごみ箱を使用するには、**組織オーナー**である必要があります。

## 前提条件\{#prerequisites}

ごみ箱内のクラスターを復元するには、[支払い方法の追加](/docs/payment-billing)が必要です。

## ごみ箱内の削除済みクラスターの復元\{#restore-a-dropped-cluster-in-the-recycle-bin}

![use-recycle-bin](https://zdoc-images.s3.us-west-2.amazonaws.com/use-recycle-bin.png "use-recycle-bin")

<Procedures>

1. 削除されたクラスターが属する組織に移動します。

1. 左側のナビゲーションメニューまたは上部のナビゲーションアイコンから **ごみ箱** にアクセスします。

1. 復元するクラスターを見つけます。**アクション** ドロップダウンから **クラスターの復元** を選択します。

1. 復元するクラスターを構成します。

    1. この組織内の別のプロジェクトにクラスターを復元することはできますが、別のクラウドリージョンには復元できません。

    1. クラスターの名前を変更し、クエリ CU の数をリセットできます。

    <Admonition type="info" icon="📘" title="Notes">

    クラスター内のコレクションのロード状態は保持されます。

    </Admonition>

1. **復元** をクリックします。Zilliz Cloud は、指定された属性でクラスターの作成を開始し、作成されたクラスターにデータを復元します。

1. 新しい復元ジョブが生成されます。[ジョブ](./job-center) ページでクラスターの復元進捗を確認できます。ジョブのステータスが **IN PROGRESS** から **SUCCESSFUL** に変わると、復元は完了です。

</Procedures>