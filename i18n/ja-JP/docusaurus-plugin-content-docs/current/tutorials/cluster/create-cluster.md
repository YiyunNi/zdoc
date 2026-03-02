---
title: "クラスターの作成 | Cloud"
slug: /create-cluster
sidebar_label: "クラスターの作成"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、お客様のビジネスニーズに合わせて様々なクラスターデプロイオプションを提供します。"
type: origin
token: KrbjwFhy3iojF3k97XmcvvXMnW7
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - クラスター
  - 作成
  - 画像検索
  - LLMs
  - 機械学習
  - RAG

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Supademo from '@site/src/components/Supademo';

# クラスターの作成

Zilliz Cloudは、さまざまなビジネスニーズに対応するために、多様なクラスターデプロイメントオプションを提供しています。

- **Free**: ストレージ、vCU消費、コレクション数に制限がありますが、学習や個人プロジェクトの出発点として利用できます。

- **Serverless**: ワークロードに合わせて自動的にスケーリングする共有環境を提供します。リソースをプロビジョニングする必要はありません。このオプションは、予測不能なトラフィックや急増するトラフィックに対して優れたコスト効率と弾力性を提供します。

- **Dedicated**: 一貫した予測可能なパフォーマンスを必要とする本番ワークロード向けに、分離された予約済み環境を提供します。このオプションは、持続的な高スループットと低レイテンシーのアプリケーションに最適です。

各デプロイメントオプションの詳細については、[Zilliz Cloud Pricing](https://zilliz.com/pricing)を参照してください。

このトピックでは、クラスターの作成方法について説明します。

## 前提条件{#prerequisites}

以下を確認してください。

- Zilliz Cloudへの登録。手順については、[Zilliz Cloudへの登録](./register-with-zilliz-cloud)を参照してください。

- クラスターを確立する組織またはプロジェクトの所有権。ロールと権限の詳細については、[アクセス制御](./access-control)を参照してください。

## Freeクラスターの作成{#create-a-free-cluster}

<Admonition type="info" icon="📘" title="Notes">

<p>各組織は1つのFreeクラスターのみを持つことができます。追加のクラスターが必要な場合は、ServerlessまたはDedicatedを選択してください。</p>

</Admonition>

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"cURL","value":"Bash"}]}>

<TabItem value="Cloud Console">

以下のデモは、**Free**クラスターの作成方法を示しています。

<Supademo id="cmhixdror61dofati1xmaai6j?utm_source=link" title=""  />

クラスターの作成中に、一度だけ表示されるクラスターの認証情報（ユーザー名とパスワード）を保存する必要があります。

クラスターのステータスが「Running」に変わると、クラスターは正常に作成されます。その後、クラスターのエンドポイントとトークンをコピーして、クラスターに[接続](./connect-to-cluster)できます。

</TabItem>

<TabItem value="Bash">

リクエストは以下の例のようになります。ここで`{API_KEY}`は認証に使用するAPIキーです。

以下の`POST`リクエストは、リクエストボディを受け取り、IDが`proj-xxxxxxxxxxxxxxxxxxxxx`のプロジェクトに`cluster-free`という名前のFreeクラスターを作成します。

```bash
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/clusters/createFree" \
     --header "Authorization: Bearer ${API_KEY}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     --data-raw '{
        "clusterName": "cluster-free",
        "projectId": "proj-xxxxxxxxxxxxxxxxxxxxxx",
        "regionId": "gcp-us-west1"
    }'
     
# {
#     "code": 0,
#     "data": {
#         "clusterId": "inxx-xxxxxxxxxxxxxxx",
#         "username": "db_xxxxxxxx",
#         "password": "*************",
#         "prompt": "successfully submitted, cluster is being created. You can access data about the creation progress and status of your cluster by DescribeCluster API. Once the cluster status is RUNNING, you may access your vector database using the SDK with the admin account and the initial password you specified."
#     }
# }
```

上記のコマンドでは、

- `{API_KEY}`: APIリクエストの認証に使用される認証情報。値を自分のものに置き換えてください。

- `clusterName`: 作成するクラスターの名前。

- `projectId`: クラスターを作成するプロジェクトのID。プロジェクトIDをリストするには、[List Projects](/reference/restful/list-projects-v2)操作を呼び出します。

- `regionId`: クラスターを作成するクラウドリージョンのID。現在、無料クラスターはGCPでのみ作成できます。利用可能なクラウドリージョンIDを取得するには、[List Cloud Regions](/reference/restful/list-cloud-regions-v2)操作を呼び出します。

詳細については、[Create Free Cluster](/reference/restful/create-free-cluster-v2)を参照してください。

</TabItem>

</Tabs>

## Serverlessクラスターの作成{#create-a-serverless-cluster}

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"cURL","value":"Bash"}]}>

<TabItem value="Cloud Console">

以下のデモは、**Serverless**クラスターを作成する方法を示しています。

<Supademo id="cmhixpd150ajjvc0i1t95ihdr?utm_source=link" title=""  />

クラスターの作成中に、一度だけ表示されるクラスターの認証情報（ユーザー名とパスワード）を保存する必要があります。

クラスターのステータスが「Running」に変わると、クラスターは正常に作成されます。その後、クラスターのエンドポイントとトークンをコピーして、クラスターに[接続](./connect-to-cluster)するために使用できます。

</TabItem>

<TabItem value="Bash">

リクエストは以下の例のようになります。ここで`{API_KEY}`は認証に使用されるAPIキーです。

以下の`POST`リクエストは、リクエストボディを受け取り、IDが`proj-xxxxxxxxxxxxxxxxxxxxx`のプロジェクトに`cluster-severless`という名前のserverlessクラスターを作成します。

```bash
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/clusters/createServerless" \
     --header "Authorization: Bearer ${API_KEY}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     --data-raw '{
        "clusterName": "cluster-serverless",
        "projectId": "proj-xxxxxxxxxxxxxxxxxxxxxxx",
        "regionId": "gcp-us-west1"
    }'
     
# {
#     "code": 0,
#     "data": {
#         "clusterId": "inxx-xxxxxxxxxxxxxxx",
#         "username": "db_xxxxxxxx",
#         "password": "***********",
#         "prompt": "successfully submitted, cluster is being created. You can access data about the creation progress and status of your cluster by DescribeCluster API. Once the cluster status is RUNNING, you may access your vector database using the SDK with the admin account and the initial password you specified."
#     }
# }
```

上記のコマンドでは、

- `{API_KEY}`: APIリクエストの認証に使用される認証情報。値を自分のものに置き換えてください。

- `clusterName`: 作成するクラスターの名前。

- `projectId`: クラスターを作成するプロジェクトのID。プロジェクトIDをリストするには、[List Projects](/reference/restful/list-projects-v2)操作を呼び出します。

- `regionId`: クラスターを作成するクラウドリージョンのID。現在、無料クラスターはGCPでのみ作成できます。利用可能なクラウドリージョンIDを取得するには、[List Cloud Regions](/reference/restful/list-cloud-regions-v2)操作を呼び出します。

詳細については、[Create Serverless Cluster](/reference/restful/create-serverless-cluster-v2)を参照してください。

</TabItem>

</Tabs>

## 専用クラスターの作成{#create-a-dedicated-cluster}

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"cURL","value":"Bash"}]}>

<TabItem value="Cloud Console">

以下のデモは、**Dedicated**クラスターを作成する方法を示しています。

<Supademo id="cmhixsdvu030hxj0imafwl2av?utm_source=link" title=""  />

Dedicatedクラスターの以下の情報を設定する必要があります。

- **クラスター名**: クラスターに一意の識別子を割り当てます。

- **クラスター設定**:

    - **クラスタータイプ**: クラスターのパフォーマンス要件に合ったクラスタータイプを選択します。詳細については、[適切なクラスタータイプの選択](./cu-types-explained)を参照してください。Tiered-storageクラスターを選択するには、クラスターに少なくとも8つのクエリCUが必要です。

    - **クエリCU**: クラスターのクエリCUの数を選択します。

- (オプション) **バックアップポリシー**: 作成するクラスターのバックアップ頻度を決定します。有効にすると、Zilliz Cloudはクラスター作成後すぐにバックアップを作成します。その後のバックアップは指定されたスケジュールに従います。

クラスターの作成中に、一度だけ表示されるクラスターの認証情報（ユーザー名とパスワード）を保存する必要があります。

クラスターのステータスが「Running」になると、クラスターは正常に作成されます。その後、クラスターのエンドポイントとトークンをコピーして、クラスターに[接続](./connect-to-cluster)するために使用できます。

</TabItem>

<TabItem value="Bash">

リクエストは以下の例のようになるはずです。ここで`{API_KEY}`は認証に使用するAPIキーです。

以下の`POST`リクエストは、リクエストボディを受け取り、1つのクエリ[CU](./cu-types-explained)を持つ`cluster-02`という名前の専用のパフォーマンス最適化クラスターを作成します。

```bash
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/clusters/createDedicated" \
     --header "Authorization: Bearer ${API_KEY}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     --data-raw '{
        "clusterName": "Cluster-02",
        "projectId": "proj-xxxxxxxxxxxxxxxxxxxxxx",
        "regionId": "aws-us-west-2",
        "plan": "Standard",
        "cuType": "Performance-optimized",
        "cuSize": 1
    }'
     
# {
#     "code": 0,
#     "data": {
#         "clusterId": "inxx-xxxxxxxxxxxxxxx",
#         "username": "db_admin",
#         "password": "****************",
#         "prompt": "successfully submitted, cluster is being created. You can access data about the creation progress and status of your cluster by DescribeCluster API. Once the cluster status is RUNNING, you may access your vector database using the SDK with the admin account and the initial password you specified."
#     }
# }
```

上記のコマンドでは、

- `{API_KEY}`: API リクエストの認証に使用される認証情報。値を自分のものに置き換えてください。

- `clusterName`: 作成するクラスターの名前。

- `projectId`: クラスターを作成するプロジェクトの ID。プロジェクト ID を一覧表示するには、[List Projects](/reference/restful/list-projects-v2) 操作を呼び出します。

- `regionId`: クラスターを作成するクラウドリージョンの ID。利用可能なクラウドリージョン ID を取得するには、[List Cloud Regions](/reference/restful/list-cloud-regions-v2) 操作を呼び出します。

- `cuType`: クラスターのタイプ。有効な値: Performance-optimized、Capacity-optimized、Tiered-storage。

- `cuSize`: クラスターに使用されるクエリ CU の数。値の範囲: 1 から 256。

詳細については、[Create Dedicated Cluster](/reference/restful/create-dedicated-cluster-v2) を参照してください。

</TabItem>

</Tabs>

