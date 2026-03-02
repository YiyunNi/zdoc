---
title: "クエリCUのスケーリング | Cloud"
slug: /scale-query-cu
sidebar_label: "クエリCUのスケーリング"
beta: FALSE
notebook: FALSE
description: "ワークロードが増加し、より多くのデータが書き込まれるにつれて、クラスターが容量制限に達する可能性があります。そのような場合、読み取り操作は引き続き機能しますが、新しい書き込み操作は失敗する可能性があります。 | Cloud"
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
  - 異常検知
  - sentence transformers
  - レコメンダーシステム
  - 情報検索

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# クエリCUのスケーリング

ワークロードが増加し、より多くのデータが書き込まれると、クラスターが容量制限に達する可能性があります。このような場合、読み取り操作は引き続き機能しますが、新しい書き込み操作は失敗する可能性があります。

これを事前に管理するために、[メトリクス](./metrics-alerts-reference)ページで**クエリCU容量**を監視し、クエリCUのスケーリングが必要な時期を判断できます。ビジネスニーズとパターンに基づいて、クラスター容量を拡張するためにクエリCUの数を増やすか、需要が減少したときにコストを節約するために減らすことができます。

1〜8 CUのクラスターの場合、クエリCUを直接スケーリングできます。8 CUを超えるクラスターの場合、[レプリカ](./manage-replica)を増やしてください。

このガイドでは、変化するワークロードに合わせてクラスターのサイズを変更する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Dedicated</strong>クラスターでのみ利用可能です。</p>

</Admonition>

## 考慮事項{#considerations}

- **リソースの制限**:

    - **スケールアップ**

        - Dedicated (Standard) クラスター: 最大32 CU

            Dedicated (Enterprise) クラスター: 最大256 CU

        - **クエリCU数** × **レプリカ数** の積は256を超えてはなりません。

        より大きなクエリCUについては、[営業担当者にお問い合わせください](http://zilliz.com/contact-sales)。

    - **スケールダウン**

        - レプリカを持つクラスターは、8 CU未満にスケールダウンできません。

        - スケールダウン要求は、次の場合にのみ成功します。

            - 現在のデータ量 < 新しいCUサイズのCU容量の80%。

            - 現在のコレクションとパーティションの数 < 新しいCUサイズで許可される[コレクションとパーティションの最大数](./limits#collections)。

- **スケーリング中**: クラスターのステータスは「変更中」に変わり、その間は操作を実行できません。複数のスケーリングタスクがトリガーされた場合、それらはトリガータイムスタンプに基づいて順次処理されます。完了時間はデータ量に依存します。

- **パフォーマンスへの影響**: スケーリングにより、わずかなサービスジッターが発生する可能性があります。

- **バックアップの制限**: 動的およびスケジュールされたスケーリング設定は、[バックアップ](./create-snapshot)には含まれません。クラスターを復元した後、これらの設定を手動で再構成してください。

## 手動スケーリング{#manual-scaling}

Zilliz CloudコンソールまたはRESTful APIを介して、クラスターを手動でスケールアップまたはスケールダウンできます。

次のデモは、Zilliz Cloudウェブコンソールでクラスターを手動でスケールアップおよびスケールダウンする方法を示しています。

<Supademo id="cmd2r0jc634jlc4kju69onxyh?utm_source=link" title=""  />

さらに、RESTful APIを使用してクエリCUを手動でスケーリングできます。

次の例では、既存のクラスターを2 CUにスケーリングします。詳細については、[クラスターの変更](/reference/restful/modify-cluster-v2)を参照してください。

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

## スケジュールスケーリング{#scheduled-scaling}

<Admonition type="info" icon="📘" title="説明">

<p>この機能は、<strong>Enterprise</strong>プロジェクトの <strong>Dedicated</strong> クラスターでのみ利用可能です。</p>

</Admonition>

スケジュールの間隔は30分以上である必要があります。

高度なモードでcron式を記述する方法の詳細については、[Cron式](./cron-expression)を参照してください。

<Supademo id="cmj8904vh05581w0jubkrtlqk" title=""  />

さらに、以下のようにスケジュールスケーリングを有効にすることもできます。詳細については、[クラスターの変更](/reference/restful/modify-cluster-v2)を参照してください。

```bash
export TOKEN="YOUR_API_KEY"
export CLUSTER_ID="inxx-xxxxxxxxxxxxxxx"

curl --request POST \
--url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/modify" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Accept: application/json" \
--header "Content-Type: application/json" \
-d '{
    "autoscaling": {
        "cu": {
            "schedules": [
                {
                    "cron": "10 0 0 0 0 ?",
                    "target": 2
                }
            ]
        }
    }
}'
```

## 動的スケーリング{#dynamic-scaling}

<Admonition type="info" icon="📘" title="説明">

<p>この機能は、<strong>エンタープライズ版</strong>プロジェクトの <strong>Dedicated</strong> クラスターでのみ利用可能です。</p>

</Admonition>

Zilliz Cloudは、手動介入を排除しながらパフォーマンスを維持するのに役立つ動的スケーリングをサポートしています。有効にすると、システムはリアルタイムの**CU容量**メトリックに基づいて**クエリCU**リソースを自動的に調整し、サービス中断なしにワークロードが効率的に処理されるようにします。

動的スケーリングを設定する際、以下の境界を構成できます。

- **最小クエリCU**: 現在のサイズがデフォルトです。

- **最大クエリCU**: 現在のCUサイズの4倍がデフォルトです。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>現在の値より小さい最大クエリCUを選択すると、即座にスケールダウンがトリガーされます。</p></li>
<li><p>現在の値より大きい最小クエリCUを選択すると、即座にスケールアップがトリガーされます。</p></li>
</ul>

</Admonition>

### トリガー条件{#trigger-conditions}

- スケールアップ: CU容量が10分間80%を超えた場合にトリガーされます。または、CU容量が100%に達した場合、即座にスケールアップがトリガーされます。

- スケールダウン: CU容量が30分間60%を下回った場合にトリガーされます。

- スケールアップイベント間には10分間、スケールダウンイベント間には30分間のクールダウン期間が適用されます。スケールダウンは、目標メトリック値が達成されるまで、サイズごとに実行されます。

### スケーリングサイズの計算{#scaling-size-calculation}

以下の式は、Zilliz Cloudが動的スケーリングイベントのターゲットクエリCU数をどのように計算するかを説明しています。動的スケーリングの式は、CU容量を70%の目標値に維持することを目指しています。

```plaintext
Target Query CU Number = Current Query CU Number × (Current Metric Value / Target Metric Value) 
```

<table>
   <tr>
     <th><p>変数名</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>Target Query CU Number</p></td>
     <td><p>システムがクラスターをスケールする目標とする新しいサイズ。</p></td>
   </tr>
   <tr>
     <td><p>Current Query CU Number</p></td>
     <td><p>クラスターの現在のクエリCU数。</p></td>
   </tr>
   <tr>
     <td><p>Current Metric Value</p></td>
     <td><p>CU容量メトリックの現在の測定値。</p></td>
   </tr>
   <tr>
     <td><p>Target Metric Value</p></td>
     <td><p>スケーリング後の予想CU容量値。70です。</p></td>
   </tr>
</table>

例えば、クエリCUの動的スケーリングが有効で、以下の条件が満たされている場合：

- **Current Query CU Number:** 60 CU

- **Cluster CU Capacity:** 10分間80%以上

動的スケーリングイベントがトリガーされます。目標クエリCU数は次のように計算されます。

```plaintext
60 × (80 / 70) ≈ 68.57 CU
```

この値は、次に利用可能なCU数に切り上げられ、新しいサイズは**72 CU**になります。

### 手順{#procedures}

以下のデモは、Zilliz Cloudウェブコンソールで動的オートスケーリングを設定する方法を示しています。

<Supademo id="cmd2r7eqb34nbc4kj3wly357s?utm_source=link" title=""  />

さらに、RESTful APIを使用して動的スケーリングを設定することもできます。詳細については、「[Modify Cluster](/reference/restful/modify-cluster-v2)」を参照してください。

```bash
export TOKEN="YOUR_API_KEY"
export CLUSTER_ID="inxx-xxxxxxxxxxxxxxx"

curl --request POST \
--url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/modify" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Accept: application/json" \
--header "Content-Type: application/json" \
-d '{
    "autoscaling": {
        "cu": {
            "min": 1,
            "max": 2
        }
    }
}'
```

## スケーリングの進捗状況の確認{#view-scaling-progress}

手動スケーリングリクエストが送信されたり、スケジュールされたスケーリングイベントや動的スケーリングイベントがトリガーされると、ジョブレコードが生成されます。[ジョブ](./job-center)ページで進捗状況を確認できます。

スケーリングジョブが進行中の場合、クラスターのステータスは「Modifying」に変わります。スケーリングジョブが成功すると、クラスターのステータスは「Running」に変わります。

## FAQ{#faq}

1. **クラスターをスケールダウンする際の制限は何ですか？**

    replicaを持つクラスターは、8 CU未満にスケールダウンすることはできません。

    スケールダウンリクエストは、以下の両方の条件が満たされた場合にのみ成功します。

    - 現在のデータ量が、新しいCUサイズの容量の80%未満であること。

    - collectionとpartitionの数が、新しいCUサイズで許可される制限内であること。

