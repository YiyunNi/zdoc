---
title: "クエリCUのスケーリング | BYOC"
slug: /scale-query-cu
sidebar_key: scale-query-cu
sidebar_label: "クエリCUをスケーリング"
beta: FALSE
notebook: FALSE
description: "ワークロードの増加やデータの書き込み量が多くなると、サービングクラスターが容量上限に達する可能性があります。このような場合、読み取り操作は引き続き機能しますが、新しい書き込み操作が失敗する可能性があります。 | BYOC"
type: origin
token: ExUFwDY1siCa2Bkp4incCvxFnlh
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - cluster
  - scale
  - manage
  - query cu

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# クエリCUのスケーリング

ワークロードの増加とデータの書き込みが進むにつれて、サービングクラスターは容量の限界に達する可能性があります。このような場合、読み取り操作は引き続き機能しますが、新しい書き込み操作は失敗する可能性があります。

これを事前に管理するために、[メトリクス](./metrics-alerts-reference) ページで **Query** **CU容量** を監視し、クエリCUのスケーリングが必要なタイミングを判断できます。ビジネスニーズとパターンに基づいて、クラスター容量を拡張するためにクエリCU数を増やしたり、需要が減少した際にコストを削減するために減らしたりすることができます。

1〜12 CUのサービングクラスターでは、クエリCUを直接スケーリングできます。12 CUを超えるサービングクラスターの場合は、[レプリカ](./manage-replica) を増やしてください。

このガイドでは、変化するワークロードに合わせてサービングクラスターのサイズを変更する方法について説明します。

## 考慮事項\{#considerations}

- **リソースの制限**: 

    - **スケールアップ**

        - Dedicated (Standard) クラスター: 最大32 CU

            Dedicated (Enterprise) クラスター: 最大1,024 CU

        - **クエリCU数** × **レプリカ数** の積は10,240を超えてはいけません

        より大きなクエリCUが必要な場合は、[営業に問い合わせ](http://zilliz.com/contact-sales) てください。

    - **スケールダウン**

        - レプリカを持つクラスターは12 CU未満にスケールダウンできません

        - スケールダウンのリクエストは、以下の条件を満たす場合のみ成功します:

            - 現在のデータ量 < 新しいCUサイズのCU容量の80%

            - 現在のコレクション数とパーティション数 < 新しいCUサイズで許可される[コレクションとパーティションの最大数](./limits#collections)

- **スケーリング中**: クラスターのステータスが「変更中」に変わり、この間は操作を実行できません。複数のスケーリングタスクがトリガーされた場合、トリガー時刻に基づいて順次処理されます。完了時間はデータ量に依存します。

- **パフォーマンスへの影影響**: スケーリングにより、わずかなサービスの揺らぎが発生する可能性があります。

- **バックアップの制限**: 動的およびスケジュールされたスケーリング設定は、[バックアップ](./create-snapshot) に含まれません。クラスターを復元した後、これらの設定を手動で再構成してください。

## 手動スケーリング\{#manual-scaling}

Zilliz Cloud コンソールまたは RESTful API を使用して、クラスターを手動でスケールアップまたはスケールダウンできます。

以下のデモでは、Zilliz Cloud Web コンソールでクラスターを手動でスケールアップおよびスケールダウンする方法を示しています。

<Supademo id="cmd2r0jc634jlc4kju69onxyh?utm_source=link" title=""  />

<Admonition type="info" icon="📘" title="Notes">

**Scale Query Node CU** ダイアログボックスで **Save** をクリックすると、プロジェクトのリソースクォータを確認するよう求められます。リソースが十分であれば、確認が完了するとダイアログボックスが消えます。そうでない場合は、以下のいずれかを選択できます。

- **Go To Project リソース設定** をクリックして、プロジェクトのリソース設定を編集するか、

- **前のステップに戻る** をクリックして、クラスター設定を変更します。

このプロセス中、ローリングに追加のリソースが必要になります。これらのリソースは使用後に解放されます。

</Admonition>

さらに、RESTful API を使用してクエリCUを手動でスケーリングすることもできます。

以下の例では、既存のクラスターを2 CUにスケーリングします。詳細については、[クラスターの変更](/reference/restful/modify-cluster-v2) を参照してください。

```bash
export TOKEN="YOUR_API_KEY"
export CLUSTER_ID="inxx-xxxxxxxxxxxxxxx"

curl --request POST \
--url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/modify" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Accept: application/json" \
--header "Content-Type: application/json" \
-d '{
    "cuSize": 2
}'
```

