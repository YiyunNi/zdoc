---
title: "レプリカのスケール | BYOC"
slug: /manage-replica
sidebar_label: "レプリカのスケール"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudはクラスターレベルのレプリケーションをサポートしています。各replicaは、クラスター内のリソースとデータの正確なコピーです。replicaを使用することで、クエリのスループットと可用性を向上させることができます。 | BYOC"
type: origin
token: W8Mhwa4faiQqtRkH4t9cdexCnlf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - クラスター
  - 管理
  - milvus vector db
  - Zilliz Cloud
  - what is milvus
  - milvus database

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# レプリカのスケール

Zilliz Cloudはクラスターレベルのレプリケーションをサポートしています。各レプリカは、クラスター内のリソースとデータの正確なコピーです。レプリカを使用することで、クエリのスループットと可用性を向上させることができます。

QPSのボトルネックを経験しているユーザーは、レプリカを追加することでクエリのワークロードを分散させ、全体的なクエリのスループットを向上させることができます。パフォーマンスを積極的に最適化するために、[メトリクス](./metrics-alerts-reference)ページで**Query CU Computation**を監視し、レプリカのスケーリングが必要な時期を判断できます。

レプリカを追加してもクラスターの容量は増加しません。容量は各クラスターのクエリCUの数によってのみ決定されるためです。クラスターの容量を増やしたい場合は、[クラスターのスケール](./scale-query-cu)を参照してください。

このガイドでは、Zilliz Cloudでクラスターのレプリカを設定する手順を説明します。

## 制限事項{#limits}

既存のDedicatedクラスターのレプリカは、以下の条件が満たされている限り設定できます。

- クラスターが8クエリCU以上であること

- クラスターのクエリCU数 x レプリカ数の積が256を超えないこと。

<Admonition type="caution" icon="🚧" title="警告">

<p>レプリカの設定を更新すると、サービスにわずかなジッターが発生する可能性があります。ご注意ください。</p>

</Admonition>

## 手動スケーリング{#manual-scaling}

既存のDedicatedクラスターのレプリカ数は、コンソールで手動で、またはプログラムで調整できます。

以下のデモは、Zilliz Cloudウェブコンソールでレプリカを設定する方法を示しています。

<Supademo id="cmd2rwczv35ktc4kjyxwa5xwr" title=""  />

<Admonition type="info" icon="📘" title="注記">

<p><strong>Scale Cluster Replicas</strong>ダイアログボックスで<strong>Save</strong>をクリックすると、プロジェクトのリソースクォータを確認するよう求められます。リソースが十分な場合、チェックが完了するとダイアログボックスは消えます。そうでない場合は、以下のいずれかを行うことができます。</p>
<ul>
<li><p><strong>Go To Project Resource Settings</strong>をクリックして、プロジェクトのリソース設定を編集する。</p></li>
<li><p><strong>Back to Last Step</strong>をクリックして、クラスター設定を変更する。</p></li>
</ul>
<p>このプロセス中、ローリングのために追加のリソースが必要になります。これらのリソースは使用後に解放されます。</p>

</Admonition>

RESTful APIを使用して、クラスター内のレプリカ数を手動で調整することもできます。詳細については、[Modify Cluster Replica](/reference/restful/modify-cluster-replica-v2)を参照してください。

```bash
export TOKEN="YOUR_API_KEY"
export CLUSTER_ID="inxx-xxxxxxxxxxxxxxx"

curl --request POST \
--url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/modify" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Accept: application/json" \
--header "Content-Type: application/json" \
-d '{
    "replica": 2
}'
```

## スケジュールスケーリング{#scheduled-scaling}

Zilliz Cloud ウェブコンソールまたは RESTful API を介して、事前定義された時間スケジュールに基づいてレプリカのスケーリングを設定できます。

スケジュールの間隔は 30 分以上である必要があります。

cron 式の記述に高度なモードを使用する方法の詳細については、[Cron 式](./cron-expression)を参照してください。

次のデモは、レプリカの自動スケーリングを有効にする方法を示しています。

<Supademo id="cmd2s33ac35zhc4kjj2zemejj" title="" />

RESTful API を使用してレプリカのスケジュールスケーリングを設定することもできます。詳細については、[クラスターの変更](/reference/restful/modify-cluster-v2)を参照してください。

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
        "replica": {
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

Zilliz Cloudは、レプリカの動的スケーリングをサポートしており、手動での介入を排除しながらパフォーマンスを維持するのに役立ちます。有効にすると、システムはリアルタイムの**CU計算**メトリックに基づいて**レプリカ数**を自動的に調整し、サービスの中断なしにワークロードが効率的に処理されるようにします。

動的スケーリングを設定する際、以下の範囲を設定できます。

- **最小レプリカ**: 現在の数にデフォルト設定されます。

- **最大レプリカ**: 現在のCUサイズの1倍にデフォルト設定されます。最大レプリカは10を超えることはできません。この制限を増やす必要がある場合は、[サポートにお問い合わせください](http://support.zilliz.com)。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>現在の値より小さい最大レプリカを選択すると、即座にスケールインがトリガーされます。</p></li>
<li><p>現在の値より大きい最小レプリカを選択すると、即座にスケールアウトがトリガーされます。</p></li>
</ul>

</Admonition>

### トリガー条件{#trigger-conditions}

- スケールアウト: CU計算が2分間60%を超えた場合にトリガーされます。

- スケールイン: CU計算が10分間40%を下回った場合にトリガーされます。

### スケーリングサイズの計算{#scaling-size-calculation}

以下の式は、Zilliz Cloudが動的スケーリングイベントのターゲットレプリカ数をどのように計算するかを説明しています。動的スケーリングの式は、CU計算をターゲット値である50%に維持することを目指しています。

```plaintext
Target Replica Count = Current Replica Count × (Current Metric Value / Target Metric Value) 
```

<table>
   <tr>
     <th><p>変数名</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>Target Replica Count</p></td>
     <td><p>システムがスケールしようとしている新しいレプリカ数。</p></td>
   </tr>
   <tr>
     <td><p>Current Replica Count</p></td>
     <td><p>クラスターの現在のレプリカ数。</p></td>
   </tr>
   <tr>
     <td><p>Current Metric Value</p></td>
     <td><p>CU計算メトリックの現在の測定値。</p></td>
   </tr>
   <tr>
     <td><p>Target Metric Value</p></td>
     <td><p>スケーリング後の予想CU計算値。これは50%です。</p></td>
   </tr>
</table>

例えば、レプリカの動的スケーリングが有効で、以下の条件が満たされている場合：

- **Current Replica Count: 1**

- **Cluster CU Computation:** 10分間60%以上

動的スケーリングイベントがトリガーされます。ターゲットクエリCU数は次のように計算されます。

```plaintext
1 × (60 / 50) = 1.2
```

この値は切り上げられて2になり、新しいレプリカ数は**2**になります。

### 手順{#procedures}

以下のデモでは、Zilliz Cloudウェブコンソールで動的オートスケーリングを設定する方法を示します。

<Supademo id="cmk2agfmh01n4zk0iy6iu4vix" title="" />

さらに、RESTful APIを使用して動的スケーリングを設定することもできます。詳細については、[Modify Cluster](/reference/restful/modify-cluster-v2)を参照してください。

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
        "replica": {
            "min": 1,
            "max": 2
        }
    }
}'
```

## スケーリングの進行状況を表示する{#view-scaling-progress}

手動スケーリングリクエストが送信されたり、スケジュールされたスケーリングイベントまたは動的スケーリングイベントがトリガーされると、ジョブレコードが生成されます。[ジョブ](./job-center)ページで進行状況を確認できます。

スケーリングジョブが進行中の場合、クラスターのステータスは「Modifying」に変わります。スケーリングジョブが成功すると、クラスターのステータスは「Running」に変わります。