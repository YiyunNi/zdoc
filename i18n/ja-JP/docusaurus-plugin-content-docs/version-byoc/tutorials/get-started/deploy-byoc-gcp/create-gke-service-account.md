---
title: "GKE サービスアカウントの作成 | BYOC"
slug: /create-gke-service-account
sidebar_key: create-gke-service-account
sidebar_label: "GKE サービスアカウントを作成"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud プロジェクト用に Google Kubernetes Engine（GKE）クラスタをデプロイするためのサービスアカウントを作成・設定する方法について説明します。 | BYOC"
type: origin
token: JkXDwmB2QijMfvkLoWEclz9Nnbe
sidebar_position: 2
keywords: 
  - zilliz
  - byoc
  - byoc-i
  - gcp
  - 権限
  - 最小限の権限
  - milvus
  - ベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# GKE サービスアカウントの作成

このページでは、Zilliz Cloud プロジェクト用に Google Kubernetes Engine (GKE) クラスタをデプロイするための Zilliz Cloud のサービスアカウントを作成および構成する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

Zilliz BYOC は現在 **一般提供** されています。アクセスおよび実装の詳細については、[Zilliz Cloud セールス](https://zilliz.com/contact-sales) までお問い合わせください。

</Admonition>

## 手順\{#procedure}

GCP ダッシュボードを使用して EKS ロールを作成することもできます。または、Zilliz Cloud が提供する Terraform スクリプトを使用して、GCP 上の Zilliz Cloud プロジェクト用のインフラストラクチャをブートストラップすることもできます。詳細については、[Terraform Provider](./terraform-provider) を参照してください。

<Supademo id="cmc1oadayjm7fsn1rqyu2h33u" title=""  />

サービスアカウントを作成する手順は以下の通りです：

<Procedures>

1. GCP コンソールで **IAMと管理** を探して をクリック します。

1. 左側のナビゲーションペインで **サービスアカウント** を選択します。

1. **Create service account** をクリックします。

1. 作成するサービスアカウントの適切な名前を設定します。

    このデモでは、`your-org-gke-node-sa` に設定できます。サービスアカウント ID は、サービスアカウント名の先頭 18 文字である必要があります。手動で適切な値に設定できます。

1. **Create and continue** をクリックします。

1. **Permissions** セクションで、**Select a role** ドロップダウンリストから **Kubernetes Engine Default Node Service アカウント** を選択します。

1. **Add IAM condition** をクリックし、条件のタイトルを設定し、**条件エディタ** に条件式を入力します。条件は以下の通りです：

    ```json
    resource.name.startsWith("projects/PROJECT_ID/locations/REGION/clusters/CLUSTER_NAME")
    ```

    <Admonition type="info" icon="📘" title="Notes">

    上記の式内の 3 つのプレースホルダーを実際の値に置き換える必要があります:

    - `PROJECT_ID`

        GCP プロジェクト ID を指定してください。

    - `REGION`

        BYOC プロジェクトのクラウドリージョンを指定してください。

    - `CLUSTER_NAME`

        Zilliz Cloud がお客様に代わって作成する GKE クラスターの名前を指定してください。

    </Admonition>

1. **Save** をクリックします。

1. 設定した権限を付与するために、再度 **Save** をクリックします。

</Procedures>