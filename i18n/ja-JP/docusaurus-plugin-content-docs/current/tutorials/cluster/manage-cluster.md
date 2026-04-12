---
title: "クラスターの管理 | Cloud"
slug: /manage-cluster
sidebar_label: "クラスターの管理"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloud コンソールを最大限に活用して目標を達成できるよう、クラスターのライフサイクルについて説明します。"
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

このガイドでは、クラスターのライフサイクルについて説明し、Zilliz Cloud コンソールを最大限に活用して目標を達成できるようにします。

## クラスターの名前変更\{#rename-cluster}

ターゲットクラスターの **クラスターの詳細** ページに移動し、以下の手順に従ってクラスターの名前を変更します。

<Supademo id="cm9tp57ye0ri911m7ljrn1yg6" title=""  />

## クラスターの一時停止\{#suspend-cluster}

Dedicatedの実行 クラスターの場合、CU とストレージの両方に対して課金されます。コストを削減するには、クラスターの一時停止を検討してください。Dedicated クラスターが一時停止されている間は、ストレージ料金のみが適用されます。

一時停止中は、クラスターに対して他の操作を実行できないことに注意してください。

クラスターは、Web コンソールまたはプログラムで一時停止できます。

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"cURL","value":"Bash"}]}>

<TabItem value="Cloud Console">

ターゲットクラスターの **クラスターの詳細** ページに移動し、以下の手順に従って Dedicated クラスターを一時停止します。

<Supademo id="cm9tqgxt30snl11m7twwj7xia" title=""  />

</TabItem>

<TabItem value="Bash">

リクエストは、認証に使用される API キーである `{API_KEY}` を含む次の例のようになるはずです。

次の `POST` リクエストは、リクエストボディを受け取り、Dedicated クラスターを一時停止します。

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

上記のコマンドでは、

- `{API_KEY}`: APIリクエストの認証に使用される認証情報。値を自分のものに置き換えてください。

- `{CLUSTER_ID}`: 一時停止するDedicatedクラスターのID。

詳細については、[クラスターの一時停止](/reference/restful/suspend-cluster-v2)を参照してください。

</TabItem>

</Tabs>

一時停止操作が成功すると、ジョブレコードが生成されます。[ジョブ](./job-center)ページで進行状況を確認できます。

## クラスターの再開\{#resume-cluster}

Freeクラスターは7日間アクティビティがないと自動的に一時停止され、いつでも再開できます。

Serverlessクラスターは、一時停止および再開操作をサポートしていません。

一時停止されたDedicatedクラスターも、必要に応じて手動で再開できます。

再開中は、クラスターに対して他の操作を実行できないことに注意してください。

Webコンソールまたはプログラムでクラスターを再開できます。

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"cURL","value":"Bash"}]}>

<TabItem value="Cloud Console">

ターゲットクラスターの**クラスターの詳細**ページに移動し、以下の指示に従ってクラスターを再開します。

<Supademo id="cm9tr2hze0t1j11m7ijth1pr5" title=""  />

</TabItem>

<TabItem value="Bash">

リクエストは次の例のようになります。ここで、`{API_KEY}`は認証に使用されるAPIキーです。

次の`POST`リクエストはリクエストボディを受け取り、クラスターを再開します。

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

- `{API_KEY}`: APIリクエストの認証に使用される認証情報。値を自分のものに置き換えてください。

- `{CLUSTER_ID}`: 再開するクラスターのID。

詳細については、[Resume Cluster](/reference/restful/resume-cluster-v2)を参照してください。

</TabItem>

</Tabs>

再開操作が成功すると、ジョブレコードが生成されます。[ジョブ](./job-center)ページで進行状況を確認できます。

## デプロイオプションのアップグレード\{#upgrade-deployment-option}

一部の機能はDedicatedクラスターに限定されているため、これらの機能を使用するには、クラスターのデプロイオプションをアップグレードすることをお勧めします。

<table>
   <tr>
     <th><p><strong>デプロイオプションのアップグレード</strong></p></th>
     <th><p><strong>注意</strong></p></th>
   </tr>
   <tr>
     <td><p>FreeからServerlessへ</p></td>
     <td><p>FreeクラスターはServerlessデプロイオプションにアップグレードされます。クラスターがアップグレードされると、ダウングレードすることはできません。</p></td>
   </tr>
   <tr>
     <td><p>FreeからDedicatedへ</p></td>
     <td><p>新しいDedicatedクラスターが作成され、既存のFreeクラスターからのデータは自動的に移行されます。Freeクラスターはそのまま残ります。</p><p>アプリケーションコード内のクラスターエンドポイントを更新することを忘れないでください。</p></td>
   </tr>
   <tr>
     <td><p>ServerlessからDedicatedへ</p></td>
     <td><p>新しいDedicatedクラスターが作成され、既存のServerlessクラスターからのデータは自動的に移行されます。Serverlessクラスターはそのまま残ります。</p><p>アプリケーションコード内のクラスターエンドポイントを更新することを忘れないでください。</p></td>
   </tr>
</table>

以下のデモでは、FreeからDedicatedへのアップグレードを例に、クラスターのデプロイオプションをアップグレードする方法を示します。

<Supademo id="cmfnfgviq0il71d3n2up3lci1?utm_source=link" title=""  />

## プレビュー機能のクラスターをアップグレードする\{#upgrade-cluster-for-preview-features}

最新のプレビュー機能を試すには、専用クラスターの互換性のあるMilvusバージョンをアップグレードする必要があります。

![upgrade-to-preview-version](https://zdoc-images.s3.us-west-2.amazonaws.com/upgrade-to-preview-version.png "upgrade-to-preview-version")

## グローバルクラスターへの変換\{#convert-to-a-global-cluster}

既存のDedicatedクラスターを[グローバルクラスター](./global-cluster-explained)に変換する必要がある場合は、以下の手順に従ってください。

<Supademo id="cmm5p53sh3hogdtfhemesjhv0" title=""  />

## クラスターの削除\{#drop-cluster}

クラスターが不要になった場合は、削除できます。クラスターは、ウェブコンソールまたはプログラムで削除できます。

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"cURL","value":"Bash"}]}>

<TabItem value="Cloud Console">

ターゲットクラスターの**クラスターの詳細**ページに移動し、以下の指示に従ってクラスターを削除します。

<Supademo id="cm9trwi5n0txr11m7otr902sk" title=""  />

</TabItem>

<TabItem value="Bash">

リクエストは、認証に使用されるAPIキーである`{API_KEY}`を含む以下の例のようになるはずです。

以下の`DELETE`リクエストは、リクエストボディを受け取り、クラスターを削除します。

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

上記のコマンドでは、

- `{API_KEY}`: APIリクエストの認証に使用されるクレデンシャル。値を自分のものに置き換えてください。

- `{CLUSTER_ID}`: 削除するDedicatedクラスターのID。

詳細については、[クラスターの削除](/reference/restful/drop-cluster-v2)を参照してください。

</TabItem>

</Tabs>

