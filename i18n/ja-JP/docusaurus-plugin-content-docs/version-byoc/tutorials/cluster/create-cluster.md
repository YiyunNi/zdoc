---
title: "クラスターの作成 | BYOC"
slug: /create-cluster
sidebar_key: create-cluster
sidebar_label: "クラスターを作成"
beta: FALSE
notebook: FALSE
description: "このトピックでは、クラスターを作成する方法について説明します。 | BYOC"
type: origin
token: KrbjwFhy3iojF3k97XmcvvXMnW7
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - クラスター
  - 作成

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# クラスターの作成

このトピックでは、クラスターの作成方法について説明します。

## 前提条件\{#prerequisites}

以下を確認してください。

- BYOC プロジェクト。手順については、[AWS への BYOC デプロイ](./deploy-byoc-aws) を参照してください。

- クラスターを作成する組織またはプロジェクトのオーナー権限。ロールと権限の詳細については、[アクセス制御](./access-control) を参照してください。

## クラスターの作成\{#create-a-cluster}

<Tabs groupId="cluster" defaultValue="Cloud Console" values={[{"label":"Cloud Console","value":"Cloud Console"},{"label":"cURL","value":"Bash"}]}>

<TabItem value="Cloud Console">

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) にログインします。

1. 目的の組織とプロジェクトに入ります。

1. **Create Cluster** をクリックします。

    ![create-cluster-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/create-cluster-byoc.png "create-cluster-byoc")

1. **Create New Cluster** ページで、関連するパラメータを入力します。

    ![cluster-cluster-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/cluster-cluster-byoc.png "cluster-cluster-byoc")

    - **クラスター名**: クラスターの一意の識別子を割り当てます。

    - **クラスター設定**:

        - **クラスタータイプ**: クラスターのパフォーマンス要件に合致するクラスタータイプを選択します。詳細については、[適切な CU の選択](./cu-types-explained) を参照してください。

        - **Query CU**: クラスターのクエリ CU 数を選択します。

        - **トポロジー**: クラスターの構造を示すグラフィカルな表現です。これには、さまざまなノードのロールとコンピューティングリソースの指定が含まれます。

            - **プロキシ**: ユーザー接続を管理し、ロードバランサーでサービスアドレスを効率化するステートレスノード。

            - **Query Node**: ハイブリッドベクトルおよびスカラー検索と増分データの更新を担当します。

            - **コーディネーター**: ワーカーノード間でタスクを配布するオーケストレーションセンター。

            - **データ Node**: データの変更とログからスナップショットへの変換を処理し、永続化を行います。

    - (オプション) **Backup Policy**: 作成するクラスターのバックアップ頻度を決定します。Zilliz Cloud は、クラスター作成直後にバックアップを作成します。その後のバックアップは、指定されたスケジュールに従って実行されます。

1. **Create Cluster** をクリックします。

    プロジェクトのリソースクォータを確認するよう求められます。リソースが十分であれば、チェック完了後にダイアログボックスが消えます。それ以外の場合は、以下のいずれかを選択できます。

    - **Go To Project リソース設定** をクリックして、プロジェクトのリソース設定を編集するか、

    - **前のステップに戻る** をクリックして、クラスター設定を変更します。

    ![ZHZqbofKioaBqNxkeSYcXgtnnwc](https://zdoc-images.s3.us-west-2.amazonaws.com/zhzqbofkioabqnxkesycxgtnnwc.png "ZHZqbofKioaBqNxkeSYcXgtnnwc")

    <Admonition type="info" icon="📘" title="Notes">

    ローリングのために追加のリソースが必要になります。これらのリソースは使用後に解放されます。

    </Admonition>

    その後、クラスターアクセス用のパブリックエンドポイントとトークンを表示するダイアログにリダイレクトされます。これらの詳細を安全に保管してください。

</TabItem>

<TabItem value="Bash">

リクエストは、以下の例のようになるはずです。ここで `{API_KEY}` は認証に使用する API キーです。

以下の `POST` リクエストは、リクエストボディを受け取り、1 つのクエリ [CU](./cu-types-explained) を持つ `cluster-02` という名前の パフォーマンス最適化済み クラスターを作成します。

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

- `{API_KEY}`: API リクエストの認証に使用される認証情報です。値を独自のものに置き換えてください。

- `clusterName`: 作成するクラスターの名前です。

- `projectId`: クラスターを作成したいプロジェクトの ID です。プロジェクト ID を一覧表示するには、[プロジェクトの一覧表示](/reference/restful/list-projects-v2) 操作を呼び出してください。

- `regionId`: クラスターを作成したいクラウドリージョンの ID です。利用可能なクラウドリージョン ID を取得するには、[クラウドリージョンの一覧表示](/reference/restful/list-cloud-regions-v2) 操作を呼び出してください。

- `cuType`: クラスターのタイプです。有効な値: パフォーマンス最適化、容量最適化。

- `cuSize`: クラスターに使用されるクエリ CU の数です。値の範囲: 1 から 256。

詳細については、[専用クラスターの作成](/reference/restful/create-dedicated-cluster-v2) を参照してください。

</TabItem>

</Tabs>

## FAQ\{#faq}

**クラスター作成時に Milvus バージョンを指定できますか？**

いいえ。Zilliz Cloud は、サポートされている最新の Milvus バージョンでクラスターを自動的にプロビジョニングし、マネージドローリングアップグレードを通じて最新の状態を維持します。特定のバージョンが必要な場合は、[サポートにお問い合わせ](https://support.zilliz.com/hc/en-us/requests/new) いただき、ユースケースをご説明ください。