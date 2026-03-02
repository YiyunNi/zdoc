---
title: "クエリCUのスケーリング | BYOC"
slug: /scale-query-cu
sidebar_label: "クエリCUのスケーリング"
beta: FALSE
notebook: FALSE
description: "ワークロードが増加し、より多くのデータが書き込まれるにつれて、クラスターはその容量制限に達する可能性があります。そのような場合、読み取り操作は引き続き機能しますが、新しい書き込み操作は失敗する可能性があります。 | BYOC"
type: origin
token: ExUFwDY1siCa2Bkp4incCvxFnlh
sidebar_position: 1
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - クラスター
  - スケーリング
  - 管理
  - クエリCU
  - ベクトルデータベース比較
  - Faiss
  - 動画検索
  - AIハルシネーション

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# クエリCUをスケーリングする

ワークロードが増加し、より多くのデータが書き込まれるにつれて、クラスターはその容量制限に達する可能性があります。このような場合、読み取り操作は引き続き機能しますが、新しい書き込み操作は失敗する可能性があります。

これを事前に管理するために、[メトリクス](./metrics-alerts-reference)ページで**クエリCU容量**を監視し、クエリCUスケーリングが必要な時期を判断できます。ビジネスニーズとパターンに基づいて、クラスター容量を拡張するためにクエリCUの数を増やすか、需要が減少したときにコストを節約するために減らすことができます。

1〜8 CUのクラスターの場合、クエリCUを直接スケーリングできます。8 CUを超えるクラスターの場合、[レプリカ](./manage-replica)を増やしてください。

このガイドでは、変化するワークロードに合わせてクラスターのサイズを変更する方法について説明します。

## 考慮事項{#considerations}

- **リソースの制限**:

    - **スケールアップ**

        - Dedicated (Standard) クラスター: 最大32 CU

            Dedicated (Enterprise) クラスター: 最大256 CU

        - **クエリCUの数** × **レプリカ数** の積は256を超えてはなりません

        より大きなクエリCUについては、[営業担当者にお問い合わせください](http://zilliz.com/contact-sales)。

    - **スケールダウン**

        - レプリカを持つクラスターは、8 CU未満にスケールダウンできません

        - スケールダウン要求は、次の場合にのみ成功します。

            - 現在のデータ量 < 新しいCUサイズのCU容量の80%。

            - 現在のコレクションとパーティションの数 < 新しいCUサイズで許可される[コレクションとパーティションの最大数](./limits#collections)。

- **スケーリング中**: クラスターのステータスは「変更中」に変わり、その間は操作を実行できません。複数のスケーリングタスクがトリガーされた場合、それらはトリガータイムスタンプに基づいて順次処理されます。完了時間はデータ量に依存します。

- **パフォーマンスへの影響**: スケーリングにより、サービスにわずかなジッターが発生する可能性があります。

- **バックアップの制限**: 動的およびスケジュールされたスケーリング設定は、[バックアップ](./create-snapshot)には含まれません。クラスターを復元した後、これらの設定を手動で再構成してください。

## 手動スケーリング{#manual-scaling}

Zilliz CloudコンソールまたはRESTful APIを介して、クラスターを手動でスケールアップまたはスケールダウンできます。

以下のデモは、Zilliz Cloudウェブコンソールでクラスターを手動でスケールアップおよびスケールダウンする方法を示しています。

<Supademo id="cmd2r0jc634jlc4kju69onxyh?utm_source=link" title=""  />

<Admonition type="info" icon="📘" title="Notes">

<p><strong>Scale Query Node CU</strong>ダイアログボックスで<strong>Save</strong>をクリックすると、プロジェクトのリソースクォータを確認するよう求められます。リソースが十分な場合、チェックが完了するとダイアログボックスは消えます。そうでない場合は、</p>
<ul>
<li><p><strong>Go To Project Resource Settings</strong>をクリックして、プロジェクトのリソース設定を編集するか、</p></li>
<li><p><strong>Back to Last Step</strong>をクリックして、クラスター設定を変更できます。</p></li>
</ul>
<p>このプロセス中、ローリングのために追加のリソースが必要になります。これらのリソースは使用後に解放されます。</p>

</Admonition>

さらに、RESTful APIを使用してクエリCUを手動でスケーリングできます。

次の例では、既存のクラスターを2 CUにスケーリングします。詳細については、[Modify Cluster](/reference/restful/modify-cluster-v2)を参照してください。

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

