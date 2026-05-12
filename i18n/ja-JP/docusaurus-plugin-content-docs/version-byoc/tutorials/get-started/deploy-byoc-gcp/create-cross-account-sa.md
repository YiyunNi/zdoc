---
title: "クロスアカウントのサービスアカウントを作成 | BYOC"
slug: /create-cross-account-sa
sidebar_key: create-cross-account-sa
sidebar_label: "クロスアカウントのサービスアカウントを作成"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud がプロジェクトのデータプレーンをブートストラップするためのクロスアカウントのサービスアカウントを作成・構成する方法を説明します。このサービスアカウントにより、Zilliz Cloud はお客様に代わって VPC リソースを管理するために必要な権限を取得します。 | BYOC"
type: origin
token: GeaswUCLVi04xQkLl4vc7cbdnVh
sidebar_position: 3
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

# クロスアカウントサービスアカウントの作成

このページでは、Zilliz Cloud のプロジェクトデータプレーンをブートストラップするためのクロスアカウントサービスアカウントの作成と設定方法について説明します。このサービスアカウントは、Zilliz Cloud がお客様に代わって VPC リソースを管理するために必要な権限を付与します。

<Admonition type="info" icon="📘" title="Notes">

Zilliz BYOC は現在 **一般提供** されています。アクセスおよび実装の詳細については、[Zilliz Cloud 営業](https://zilliz.com/contact-sales)にお問い合わせください。

</Admonition>

## 手順\{#procedures}

GCP ダッシュボードを使用して EKS ロールを作成することもできます。または、Zilliz Cloud が提供する Terraform スクリプトを使用して、GCP 上の Zilliz Cloud プロジェクトのインフラストラクチャをブートストラップすることもできます。詳細については、[Terraform Provider](./terraform-provider) を参照してください。

### ステップ 1: カスタムロールの作成\{#step-1-create-custom-roles}

クロスアカウントサービスアカウントを作成する前に、サービスアカウントに割り当てる必要があるいくつかのカスタムロールを作成する必要があります。

#### インスタンスグループマネージャーカスタムロールの作成\{#create-an-instance-group-manager-custom-role}

インスタンスグループマネージャーカスタムロールを作成し、上記で作成したサービスアカウントにカスタムロールを割り当てます。これにより、サービスアカウントは GKE ノードを管理するために必要な最小限の権限を持つことになります。

<Supademo id="cmbgb65fo4klnsn1rfs4be7qd" title=""  />

インスタンスグループマネージャーカスタムロールを作成する手順は以下の通りです：

<Procedures>

1. GCP コンソールで **IAMと管理** を検索してクリックします。

1. 左側のナビゲーションペインから **ロール** を選択します。

1. **ロールを作成** をクリックします。

1. 作成するカスタムロールのタイトルと説明を設定します。

    このデモでは、**Zilliz Cloud Custom ロール for GKE Management** を使用できます。

1. **ロールの起動段階** を **アルファ** から **一般提供** に変更します。

1. **権限を追加** をクリックします。このステップで追加する権限は以下の通りです：

    - **compute.instanceGroupManagers.get**

    - **compute.instanceGroupManagers.update**

1. **作成** をクリックします。

</Procedures>

#### IAMカスタムロールの作成\{#create-an-iam-custom-role}

IAMカスタムロールを作成し、上記で作成したサービスアカウントにカスタムロールを割り当てます。これにより、サービスアカウントは IAM ポリシーを管理するために必要な最小限の権限を持つことになります。

<Supademo id="cmbri7b73cdexsn1r99xrvvfd" title=""  />

カスタムロールを作成する手順は以下の通りです：

<Procedures>

1. GCP コンソールで **IAMと管理** を検索してクリックします。

1. 左側のナビゲーションペインから **ロール** を選択します。

1. **ロールを作成** をクリックします。

1. 作成するカスタムロールのタイトルと説明を設定します。

    このデモでは、**IAM カスタムロール** を使用できます。

1. **ロールの起動段階** を **アルファ** から **一般提供** に変更します。

1. **権限を追加** をクリックします。このステップで追加する権限は以下の通りです：

    - **iam.serviceアカウントs.getIamPolicy**

    - **iam.serviceアカウントs.setIamPolicy**

1. **作成** をクリックします。

</Procedures>

### ステップ 2: サービスアカウントの作成\{#step-2-create-a-service-account}

このステップでは、Zilliz Cloud がお客様に代わって VPC リソースを管理するためのサービスアカウントを作成し、サービスアカウントのメールアドレスを Zilliz Cloud コンソールに貼り付けます。

<Supademo id="cmc1pq4ikjo9nsn1rzuxbs1p0" title=""  />

サービスアカウントを作成する手順は以下の通りです：

<Procedures>

1. GCP コンソールで **IAMと管理** を検索してクリックします。

1. 左側のナビゲーションペインで **サービスアカウント** を選択します。

1. **サービスアカウントを作成** をクリックします。

1. 作成するサービスアカウントの適切な名前を設定します。

    このデモでは、`your-org-cross-account-sa` に設定できます。サービスアカウント ID は、サービスアカウント名の先頭 18 文字です。手動で適切な値に設定することもできます。

1. **作成して続行** をクリックします。

1. **権限** セクションで、前のステップで作成したカスタムロールといくつかの GCP 管理ロールをサービスアカウントに追加します。

    以下の表に、サービスアカウントに割り当てるロールを示します。

    <table>
       <tr>
         <th><p>ロール</p></th>
         <th><p>タイプ</p></th>
         <th><p>条件</p></th>
       </tr>
       <tr>
         <td><p><a href="./create-cross-account-sa">インスタンスグループマネージャーカスタムロール</a></p></td>
         <td><p>カスタム</p></td>
         <td><p><code>resource.name.extract("projects/&lt;name&gt;").startsWith("PROJECT_ID") &&resource.name.extract("zones/&lt;name&gt;").startsWith("REGION") &&resource.name.extract("instanceGroupManagers/&lt;name&gt;").startsWith("gke-CLUSTER_NAME")</code></p></td>
       </tr>
       <tr>
         <td><p><a href="./create-cross-account-sa">IAMカスタムロール</a></p></td>
         <td><p>カスタム</p></td>
         <td><p><code>api.getAttribute("iam.googleapis.com/modifiedGrantsByロール", []).hasOnly(["roles/iam.workloadIdentityUser"])</code></p></td>
       </tr>
       <tr>
         <td><p>Kubernetes Engine Admin</p></td>
         <td><p>GCP管理</p></td>
         <td><p>N/A</p></td>
       </tr>
       <tr>
         <td><p>Storage Object Viewer</p></td>
         <td><p>GCP管理</p></td>
         <td><p><code>resource.name.startsWith("projects/_/buckets/YOUR_BUCKET_NAME")</code></p></td>
       </tr>
    </table>

    <Admonition type="info" icon="📘" title="Notes">

    上記の式にある 3 つのプレースホルダーを実際の値に置き換える必要があります：

    - `PROJECT_ID`

        これはお客様の GCP プロジェクト ID です。

    - `REGION`

        これはお客様の BYOC プロジェクトのクラウドリージョンです。

    - `CLUSTER_NAME`

        これは Zilliz Cloud がお客様に代わって作成する GKE クラスターの名前です。

        Google Cloud はクラスター名の前に `gke-` というプレフィックスを追加することに注意してください。したがって、条件には `gke-` プレフィックスを保持し、`CLUSTER_NAME` のみを実際の名前に置き換えてください。

    - `YOUR_BUCKET_NAME` 

        これは前のステップで作成したバケットの名前です。

    </Admonition>

1. **保存** をクリックします。

</Procedures>

#### 他のサービスアカウントへのアクセス権の付与\{#grant-access-to-other-service-accounts}

前のステップで作成したクロスアカウントサービスアカウントに、いくつかの他のサービスアカウントへのアクセス権を付与します。

<Supademo id="cmbq9hdfjbatwsn1rv37dqcnr" title=""  />

以下の手順に従って、クロスアカウントサービスアカウントにこれらのサービスアカウントへのアクセス権を付与します。

<Procedures>

1. GCP コンソールで **サービスアカウント** を検索してクリックします。

1. リストから以下のサービスアカウントを検索してクリックします。

    <table>
       <tr>
         <th></th>
         <th><p>説明</p></th>
       </tr>
       <tr>
         <td><p><code>PROJECT_NUMBER-compute@developer.gserviceaccount.com</code></p></td>
         <td><p>このサービスアカウントは、Compute Engine API を有効にしたときに自動的に作成されます。</p></td>
       </tr>
    </table>

    <Admonition type="info" icon="📘" title="Notes">

    GCP プロジェクトにはプロジェクト ID とプロジェクト番号があります：プロジェクト ID は GCP コンソールでプロジェクトを作成するときに入力した文字列であり、プロジェクト番号は GCP がプロジェクト作成時に割り当てる文字列です。

    `PROJECT_NUMBER` をお客様の GCP プロジェクト番号に置き換える必要があります。

    </Admonition>

1. **アクセス権を持つプリンシパル** タブに切り替えて **アクセスを付与** をクリックします。

1. **プリンシパルを追加** > **新しいプリンシパル** に、前のステップで作成したクロスアカウントサービスアカウントを入力します。

1. **ロールを割り当て** > **ロール** で **サービスアカウントユーザー** を選択します。

</Procedures>

#### Zilliz Cloud のサービスアカウントの権限借用\{#impersonate-zilliz-clouds-service-account}

クロスアカウントサービスアカウントに、Zilliz Cloud コンソールで提供された Zilliz Cloud のサービスアカウントを権限借用させます。

<Supademo id="cmbhbv9xj5iuasn1rj0od2qzt" title=""  />

Zilliz Cloud が提供するサービスアカウントを権限借用する手順は以下の通りです：

<Procedures>

1. Zilliz Cloud コンソールで、Zilliz Cloud が提供するサービスアカウントをコピーします。

1. GCP コンソールに移動し、**IAMと管理** を検索してクリックします。

1. 左側のナビゲーションペインで **サービスアカウント** を選択します。

1. クロスアカウントサービスアカウントをフィルタリングし、その名前をクリックして詳細を表示します。

1. **アクセス権を持つプリンシパル** タブに切り替えて **アクセスを付与** をクリックします。

1. **プリンシパルを追加** > **新しいプリンシパル** に、Zilliz Cloud コンソールからコピーしたサービスアカウントを貼り付けます。

1. **ロールを割り当て** > **ロール** で **サービスアカウントトークン作成者** を選択します。

1. **保存** をクリックします。

</Procedures>