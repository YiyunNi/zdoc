---
title: "GKE サービスアカウントの作成 | BYOC"
slug: /create-gke-service-account
sidebar_label: "GKE サービスアカウントの作成"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud プロジェクト用の Google Kubernetes Engine (GKE) クラスターをデプロイするために、Zilliz Cloud のサービスアカウントを作成および設定する方法について説明します。 | BYOC"
type: origin
token: JkXDwmB2QijMfvkLoWEclz9Nnbe
sidebar_position: 2
keywords: 
  - zilliz
  - byoc
  - byoc-i
  - gcp
  - 権限
  - 最小権限
  - milvus
  - ベクトルデータベース
  - マルチモーダルベクトルデータベース検索
  - 検索拡張生成
  - 大規模言語モデル
  - ベクトル化

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# GKE サービスアカウントの作成

このページでは、Zilliz Cloud が Google Kubernetes Engine (GKE) クラスターを Zilliz Cloud プロジェクトにデプロイするために、サービスアカウントを作成および設定する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz BYOC は現在、<strong>一般提供</strong>されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloud 営業</a>にお問い合わせください。</p>

</Admonition>

## 手順{#procedure}

GCP ダッシュボードを使用して EKS ロールを作成できます。または、Zilliz Cloud が提供する Terraform スクリプトを使用して、GCP 上の Zilliz Cloud プロジェクトのインフラストラクチャをブートストラップすることもできます。詳細については、[Terraform Provider](./terraform-provider) を参照してください。

<Supademo id="cmc1oadayjm7fsn1rqyu2h33u" title=""  />

サービスアカウントを作成する手順は次のとおりです。

<Procedures>

1. GCP コンソールで、**IAM と管理**を見つけてクリックします。

1. 左側のナビゲーションペインで**サービスアカウント**を選択します。

1. **サービスアカウントを作成**をクリックします。

1. 作成するサービスアカウントに適切な名前を設定します。

    このデモでは、`your-org-gke-node-sa` に設定できます。サービスアカウント ID は、サービスアカウント名の最初の 18 文字である必要があります。手動で適切な値に設定できます。

1. **作成して続行**をクリックします。

1. **権限**セクションで、**ロールを選択**ドロップダウンリストから**Kubernetes Engine デフォルトノードサービスアカウント**を選択します。

1. **IAM 条件を追加**をクリックし、条件のタイトルを設定し、条件式を**条件エディタ**に入力します。条件は次のとおりです。

    ```json
    resource.name.startsWith("projects/PROJECT_ID/locations/REGION/clusters/CLUSTER_NAME")
    ```

    <Admonition type="info" icon="📘" title="Notes">

    <p>上記の式にある3つのプレースホルダーを実際の値に置き換える必要があります。</p>
    <ul>
    <li><code>PROJECT_ID</code></li>
    </ul>
    <p>これはあなたのGCPプロジェクトIDです。</p>
    <ul>
    <li><code>REGION</code></li>
    </ul>
    <p>これはあなたのBYOCプロジェクトのクラウドリージョンです。</p>
    <ul>
    <li><code>CLUSTER_NAME</code></li>
    </ul>
    <p>これはZilliz Cloudがあなたのために作成するGKEクラスターの名前です。</p>

    </Admonition>

1. **Save** をクリックします。

1. 設定された権限を付与するために、もう一度 **Save** をクリックします。

</Procedures>