---
title: "クラスターの管理 | BYOC"
slug: /manage-cluster
sidebar_label: "クラスターの管理"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloud コンソールを最大限に活用して目標を達成できるよう、クラスターのライフサイクルについて説明します。| BYOC"
type: origin
token: PharwAysCiBzvgkuqqecmNzunQf
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - クラスター
  - 管理

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Supademo from '@site/src/components/Supademo';

# クラスターの管理

このガイドでは、クラスターのライフサイクルについて説明し、Zilliz Cloud コンソールを最大限に活用して目標を達成する方法を示します。

## クラスターの名前変更\{#rename-cluster}

対象のクラスターの**クラスターの詳細**ページに移動し、以下の手順に従ってクラスターの名前を変更します。

<Supademo id="cm9tp57ye0ri911m7ljrn1yg6" title=""  />

## クラスターの一時停止\{#suspend-cluster}

クラスターは、Web コンソールまたはプログラム経由で一時停止できます。

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"cURL","value":"Bash"}]}>

<TabItem value="Cloud Console">

対象のクラスターの**クラスターの詳細**ページに移動し、以下の手順に従って Dedicated クラスターを一時停止します。

<Supademo id="cm9tqgxt30snl11m7twwj7xia" title=""  />

</TabItem>

<TabItem value="Bash">

リクエストは以下の例のようになり、`{API_KEY}` は認証に使用する API キーです。

以下の `POST` リクエストはリクエストボディを受け取り、Dedicated クラスターを一時停止します。

```bash
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/clusters/${CLUSTER_ID}/suspend" \
     --header "Authorization: Bearer ${API_KEY}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \

# {
#     "code": 0,
#     "data": {
#         "clusterId": "inxx-xxxxxxxxxxxxxxx",
#         "prompt": "Successfully Submitted. The cluster will not incur any computing costs when suspended. You will only be billed for the storage costs during this time."
#     }
# }     
```

上記のコマンドにおいて、

- `{API_KEY}`: API リクエストの認証に使用される資格情報。この値を独自のものに置き換えてください。

- `{CLUSTER_ID}`: 一時停止する Dedicated クラスターの ID。

詳細については、[クラスターの一時停止](/reference/restful/suspend-cluster-v2) を参照してください。

</TabItem>

</Tabs>

一時停止操作が成功すると、ジョブ記録が生成されます。[ジョブ](./job-center) ページで進捗状況を確認できます。

## クラスターの再開\{#resume-cluster}

再開中は、クラスターに対して他の操作を実行できないことに注意してください。

クラスターは、Web コンソールまたはプログラムを通じて再開できます。

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"cURL","value":"Bash"}]}>

<TabItem value="Cloud Console">

対象のクラスターの**クラスターの詳細**ページに移動し、以下の手順に従ってクラスターを再開してください。

<Supademo id="cm9tr2hze0t1j11m7ijth1pr5" title=""  />

<Admonition type="info" icon="📘" title="Notes">

<p><strong>クラスターの再開</strong> ダイアログボックスで<strong>再開</strong>をクリックすると、プロジェクトのリソースクォータを確認するよう促されます。リソースが十分であれば、確認完了後にダイアログボックスは閉じます。そうでない場合は、</p>
<ul>
<li><p><strong>プロジェクトのリソース設定へ移動</strong> をクリックしてプロジェクトのリソース設定を編集するか、</p></li>
<li><p><strong>前のステップに戻る</strong> をクリックしてクラスター設定を変更してください。</p></li>
</ul>
<p>プロセス中に、ローリングのために追加のリソースが必要になります。これらのリソースは使用後に解放されます。</p>

</Admonition>

</TabItem>

<TabItem value="Bash">

リクエストは以下の例のようになります。ここで、`{API_KEY}` は認証に使用する API キーです。

以下の `POST` リクエストはリクエストボディを受け取り、クラスターを再開します。

```bash
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/clusters/${CLUSTER_ID}/resume" \
     --header "Authorization: Bearer ${API_KEY}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \

# {
#     "code": 0,
#     "data": {
#         "clusterId": "inxx-xxxxxxxxxxxxxxx",
#         "prompt": "successfully Submitted. Cluster is being resumed, which is expected to takes several minutes. You can access data about the creation progress and status of your cluster by DescribeCluster API. Once the cluster status is RUNNING, you may access your vector database using the SDK."
#     }
# }     
```

上記のコマンドでは、

- `{API_KEY}`: API リクエストの認証に使用される資格情報。この値を独自のものに置き換えてください。

- `{CLUSTER_ID}`: 再開対象のクラスターの ID。

詳細については、[クラスターの再開](/reference/restful/resume-cluster-v2) を参照してください。

</TabItem>

</Tabs>

再開操作が成功すると、ジョブレコードが生成されます。進行状況は [ジョブ](./job-center) ページで確認できます。

## クラスターの削除\{#drop-cluster}

クラスターが不要になった場合、それを削除できます。クラスターは Web コンソールまたはプログラム経由で削除できます。

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"cURL","value":"Bash"}]}>

<TabItem value="Cloud Console">

対象のクラスターの **クラスターの詳細** ページに移動し、以下の手順に従ってクラスターを削除してください。

<Supademo id="cm9trwi5n0txr11m7otr902sk" title=""  />

</TabItem>

<TabItem value="Bash">

リクエストは以下の例のようになり、`{API_KEY}` は認証に使用する API キーです。

以下の `DELETE` リクエストはリクエストボディを受け取り、クラスターを削除します。

```bash
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/clusters/${CLUSTER_ID}/drop" \
     --header "Authorization: Bearer ${API_KEY}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \

# {
#     "code": 0,
#     "data": {
#         "clusterId": "inxx-xxxxxxxxxxxxxxx",
#         "prompt": "The cluster has been deleted. If you consider this action to be an error, you have the option to restore the deleted cluster from the recycle bin within a 30-day period. Kindly note, this recovery feature does not apply to free clusters."
#     }
# }     
```

上記のコマンドにおいて、

- `{API_KEY}`: API リクエストを認証するために使用される認証情報です。この値を自身のものに置き換えてください。

- `{CLUSTER_ID}`: 削除する Dedicated クラスターの ID です。

詳細については、[Drop Cluster](/reference/restful/drop-cluster-v2) を参照してください。

</TabItem>

</Tabs>

