---
title: "ごみ箱の使用 | BYOC"
slug: /use-recycle-bin
sidebar_label: "ごみ箱の使用"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudのごみ箱機能は、意図的であるか、試用期間の終了またはサービスの一時停止の結果であるかにかかわらず、削除されたすべてのクラスターの記録を保持することでデータを保護します。気が変わった場合や誤ってクラスターを削除してしまった場合でも、ごみ箱はクラスターの復元のために30日間の猶予期間を提供します。 | BYOC"
type: origin
token: JQvjwCDxhiMcj0kpaWicqXsTn1e
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - ごみ箱
  - RAG
  - NLP
  - ニューラルネットワーク
  - ディープラーニング

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# ごみ箱を使用する

Zilliz Cloud のごみ箱機能は、意図的に削除されたか、試用期間の終了またはサービスの一時停止の結果として削除されたかに関わらず、削除されたすべてのクラスターの記録を保持することでデータを保護します。気が変わった場合や、誤ってクラスターを削除してしまった場合でも、ごみ箱はクラスターの復元に30日間の猶予期間を提供します。

ごみ箱を使用するには、**組織の所有者**である必要があります。

## ごみ箱で削除されたクラスターを復元する{#restore-a-dropped-cluster-in-the-recycle-bin}

![byoc-use-recycle-bin](https://zdoc-images.s3.us-west-2.amazonaws.com/byoc-use-recycle-bin.png "byoc-use-recycle-bin")

<Procedures>

1. 削除されたクラスターが属する組織に移動します。

1. 左側のナビゲーションメニューまたは上部のナビゲーションアイコンから**ごみ箱**にアクセスします。

1. 復元するクラスターを見つけます。**アクション**ドロップダウンから**クラスターの復元**を選択します。

1. 復元されたクラスターを設定します。

    1. クラスターをこの組織内の別のプロジェクトに復元することはできますが、別のクラウドリージョンには復元できません。

    1. クラスターの名前を変更し、クエリCUの数をリセットできます。

    <Admonition type="info" icon="📘" title="Notes">

    <p>クラスター内のコレクションのロード状態は保持されます。</p>

    </Admonition>

1. **復元**をクリックします。Zilliz Cloud は、指定された属性でクラスターの作成を開始し、作成されたクラスターにデータを復元します。

1. 新しい復元ジョブが生成されます。[ジョブ](./job-center)ページでクラスターの復元進行状況を確認できます。ジョブの状態が**IN PROGRESS**から**SUCCESSFUL**に切り替わると、復元は完了です。

</Procedures>