---
title: "クラスターの作成 | BYOC"
slug: /create-cluster
sidebar_label: "クラスターの作成"
beta: FALSE
notebook: FALSE
description: "このトピックでは、クラスターを作成する方法について説明します。 | BYOC"
type: origin
token: KrbjwFhy3iojF3k97XmcvvXMnW7
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - クラスター
  - 作成
  - 動画検索
  - AIの幻覚
  - AIエージェント
  - セマンティック検索

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# クラスターの作成

このトピックでは、クラスターの作成方法について説明します。

## 前提条件{#prerequisites}

以下を確認してください。

- BYOC プロジェクト。手順については、[AWS への BYOC のデプロイ](./deploy-byoc-aws)を参照してください。

- クラスターを確立する組織またはプロジェクトの所有権。ロールと権限の詳細については、[アクセス制御](./access-control)を参照してください。

## クラスターの作成{#create-a-cluster}

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"cURL","value":"Bash"}]}>

<TabItem value="Cloud Console">

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインします。

1. 目的の組織とプロジェクトを入力します。

1. **Create Cluster** をクリックします。

    ![create-cluster-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/create-cluster-byoc.png "create-cluster-byoc")

1. **Create New Cluster** ページで、関連するパラメーターを入力します。

    ![cluster-cluster-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/cluster-cluster-byoc.png "cluster-cluster-byoc")

    - **Cluster Name**: クラスターの一意の識別子を割り当てます。

    - **Cluster Settings**:

        - **Cluster Type**: クラスターのパフォーマンス要件に合ったクラスタータイプを選択します。詳細については、[適切な CU の選択](./cu-types-explained)を参照してください。

        - **Query CU**: クラスターのクエリ CU の数を選択します。

        - **Topology**: クラスターの構造を示すグラフィカルな表現。これには、さまざまなノードのロールとコンピューティングリソースの指定が含まれます。

            - **Proxy**: ユーザー接続を管理し、ロードバランサーでサービスアドレスを合理化するステートレスノード。

            - **Query Node**: ハイブリッドベクトル検索とスカラー検索、および増分データ更新を担当します。

            - **Coordinator**: オーケストレーションセンターであり、ワーカーノード全体にタスクを分散します。

            - **Data Node**: データ変更と永続性のためのログからスナップショットへの変換を処理します。

    - (オプション) **Backup Policy**: 作成するクラスターのバックアップ頻度を決定します。Zilliz Cloud は、クラスターが作成された直後にバックアップを作成します。その後のバックアップは、指定されたスケジュールに従います。

1. **Create Cluster** をクリックします。

    プロジェクトのリソースクォータを確認するよう求められます。リソースが十分な場合、確認が完了するとダイアログボックスは消えます。そうでない場合は、次のことができます。

    - **Go To Project Resource Settings** をクリックして、プロジェクトのリソース設定を編集するか、

    - **Back to Last Step** をクリックして、クラスター設定を変更します。

    ![ZHZqbofKioaBqNxkeSYcXgtnnwc](https://zdoc-images.s3.us-west-2.amazonaws.com/zhzqbofkioabqnxkesycxgtnnwc.png "ZHZqbofKioaBqNxkeSYcXgtnnwc")

    <Admonition type="info" icon="📘" title="Notes">

    <p>ローリングには追加のリソースが必要になります。これらのリソースは使用後に解放されます。</p>

    </Admonition>

    その後、クラスターアクセス用のパブリックエンドポイントとトークンを示すダイアログにリダイレクトされます。これらの詳細は安全に保管してください。

</TabItem>

<TabItem value="Bash">

リクエストは次の例のようになります。`{API_KEY}` は認証に使用される API キーです。

次の `POST` リクエストは、リクエストボディを受け取り、1 つのクエリ [CU](./cu-types-explained) を持つ `cluster-02` という名前のパフォーマンス最適化されたクラスターを作成します。

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

- `cuType`: クラスターのタイプ。有効な値: Performance-optimized、Capacity-optimized。

- `cuSize`: クラスターに使用されるクエリ CU の数。値の範囲: 1 から 256。

詳細については、[Create Dedicated Cluster](/reference/restful/create-dedicated-cluster-v2) を参照してください。

</TabItem>

</Tabs>

