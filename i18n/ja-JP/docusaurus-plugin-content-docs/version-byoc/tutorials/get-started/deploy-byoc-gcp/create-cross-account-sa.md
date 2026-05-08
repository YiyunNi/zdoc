---
title: "クロスアカウント サービスアカウントの作成 | BYOC"
slug: /create-cross-account-sa
sidebar_key: create-cross-account-sa
sidebar_label: "クロスアカウント サービスアカウントを作成"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud がプロジェクトのデータプレーンをブートストラップするためのクロスアカウント サービスアカウントを作成・設定する方法を説明します。このサービスアカウントにより、Zilliz Cloud はお客様に代わって VPC リソースを管理するために必要な権限を取得します。 | BYOC"
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

<p>Zilliz BYOC は現在<strong>一般提供</strong>されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloud 営業</a>までお問い合わせください。</p>

</Admonition>

## 手順\{#procedures}

GCP ダッシュボードを使用して EKS ロールを作成できます。または、Zilliz Cloud が提供する Terraform スクリプトを使用して、GCP 上の Zilliz Cloud プロジェクトのインフラストラクチャをブートストラップすることもできます。詳細については、[Terraform Provider](./terraform-provider) を参照してください。

### ステップ 1: カスタムロールの作成\{#step-1-create-custom-roles}

クロスアカウントサービスアカウントを作成する前に、サービスアカウントに割り当てる必要があるいくつかのカスタムロールを作成する必要があります。

#### インスタンスグループマネージャーカスタムロールの作成\{#create-an-instance-group-manager-custom-role}

インスタンスグループマネージャーカスタムロールを作成し、上記で作成したサービスアカウントにカスタムロールを割り当てます。これにより、サービスアカウントは GKE ノードを管理するために必要な最小限の権限を持つことになります。

<Supademo id="cmbgb65fo4klnsn1rfs4be7qd" title=""  />

インスタンスグループマネージャーカスタムロールを作成する手順は以下の通りです：

<Procedures>

1. GCP コンソールで **IAMと管理** を検索してクリックします。

1. 左側のナビゲーションペインから **ロールs** を選択します。

1. **Create role** をクリックします。

1. 作成するカスタムロールのタイトルと説明を設定します。

    このデモでは、**Zilliz Cloud Custom ロール for GKE Management** を使用できます。

1. **ロールの起動段階** を **アルファ** から **一般 Availability** に変更します。

1. **Add permissions** をクリックします。このステップで追加する権限は以下の通りです：

    - **compute.instanceGroupManagers.get**

    - **compute.instanceGroupManagers.update**

1. **Create** をクリックします。

</Procedures>

#### IAM カスタムロールの作成\{#create-an-iam-custom-role}

IAM カスタムロールを作成し、上記で作成したサービスアカウントにカスタムロールを割り当てます。これにより、サービスアカウントは IAM ポリシーを管理するために必要な最小限の権限を持つことになります。

<Supademo id="cmbri7b73cdexsn1r99xrvvfd" title=""  />

カスタムロールを作成する手順は以下の通りです：

<Procedures>

1. GCP コンソールで **IAMと管理** を検索してクリックします。

1. 左側のナビゲーションペインから **ロールs** を選択します。

1. **Create role** をクリックします。

1. 作成するカスタムロールのタイトルと説明を設定します。

    このデモでは、**IAM カスタムロール** を使用できます。

1. **ロールの起動段階** を **アルファ** から **一般 Availability** に変更します。

1. **Add permissions** をクリックします。このステップで追加する権限は以下の通りです：

    - **iam.serviceアカウントs.getIamPolicy**

    - **iam.serviceアカウントs.setIamPolicy**

1. **Create** をクリックします。

</Procedures>

### ステップ 2: サービスアカウントの作成\{#step-2-create-a-service-account}

このステップでは、Zilliz Cloud がお客様に代わって VPC リソースを管理するためのサービスアカウントを作成し、サービスアカウントのメールアドレスを Zilliz Cloud コンソールに貼り付けます。

<Supademo id="cmc1pq4ikjo9nsn1rzuxbs1p0" title=""  />

サービスアカウントを作成する手順は以下の通りです：

<Procedures>

1. GCP コンソールで **IAMと管理** を検索してクリックします。

1. 左側のナビゲーションペインから **Service アカウントs** を選択します。

1. **Create service account** をクリックします。

1. 作成するサービスアカウントの適切な名前を設定します。

    このデモでは、`your-org-cross-account-sa` に設定できます。サービスアカウント ID はサービスアカウント名の先頭 18 文字です。手動で適切な値に設定することもできます。

1. **Create and continue** をクリックします。

1. **Permissions** セクションで、前のステップで作成したカスタムロールといくつかの GCP 管理ロールをサービスアカウントに追加します。

    以下の表は、サービスアカウントに割り当てるロールを一覧表示しています。

    <table>
       <tr>
         <th><p>ロール</p></th>
         <th><p>Type</p></th>
         <th><p>Condition</p></th>
       </tr>
       <tr>
         <td><p><a href="./create-cross-account-sa">Instance group manager カスタムロール</a></p></td>
         <td><p>Custom</p></td>
         <td><p><code>resource.name.extract("projects/&lt;name&gt;").startsWith("PROJECT_ID") &&resource.name.extract("zones/&lt;name&gt;").startsWith("REGION") &&resource.name.extract("instanceGroupManagers/&lt;name&gt;").startsWith("gke-CLUSTER_NAME")</code></p></td>
       </tr>
       <tr>
         <td><p><a href="./create-cross-account-sa">IAM カスタムロール</a></p></td>
         <td><p>Custom</p></td>
         <td><p><code>api.getAttribute("iam.googleapis.com/modifiedGrantsByロール", []).hasOnly(["roles/iam.workloadIdentityUser"])</code></p></td>
       </tr>
       <tr>
         <td><p>Kubernetes Engine Admin</p></td>
         <td><p>GCP-managed</p></td>
         <td><p>N/A</p></td>
       </tr>
       <tr>
         <td><p>Storage Object Viewer</p></td>
         <td><p>GCP-managed</p></td>
         <td><p><code>resource.name.startsWith("projects/_/buckets/YOUR_BUCKET_NAME")</code></p></td>
       </tr>
    </table>

    <Admonition type="info" icon="📘" title="Notes">

    <p>上記の式にある 3 つのプレースホルダーを実際の値に置き換える必要があります：</p>
    <ul>
    <li><code>PROJECT_ID</code></li>
    </ul>
    <p>これは GCP プロジェクト ID です。</p>
    <ul>
    <li><code>REGION</code></li>
    </ul>
    <p>これは BYOC プロジェクトのクラウドリージョンです。</p>
    <ul>
    <li><code>CLUSTER_NAME</code></li>
    </ul>
    <p>これは Zilliz Cloud がお客様に代わって作成する GKE クラスターの名前です。</p>
    <p>Google Cloud はクラスター名の前に <code>gke-</code> プレフィックスを追加することに注意してください。したがって、条件には <code>gke-</code> プレフィックスを保持し、<code>CLUSTER_NAME</code> のみを実際の名前に置き換えてください。</p>
    <ul>
    <li><code>YOUR_BUCKET_NAME</code> </li>
    </ul>
    <p>これは前のステップで作成したバケットの名前です。</p>

    </Admonition>

1. **Save** をクリックします。

</Procedures>

#### 他のサービスアカウントへのアクセス権の付与\{#grant-access-to-other-service-accounts}

前のステップで作成したクロスアカウントサービスアカウントに、いくつかの他のサービスアカウントへのアクセス権を付与します。

<Supademo id="cmbq9hdfjbatwsn1rv37dqcnr" title=""  />

以下の手順に従って、クロスアカウントサービスアカウントにこれらのサービスアカウントへのアクセス権を付与します。

<Procedures>

1. GCP コンソールで **Service アカウント** を検索してクリックします。

1. リストから以下のサービスアカウントを検索してクリックします。

    <table>
       <tr>
         <th></th>
         <th><p>Description</p></th>
       </tr>
       <tr>
         <td><p><code>PROJECT_NUMBER-compute@developer.gserviceaccount.com</code></p></td>
         <td><p>このサービスアカウントは、Compute Engine API を有効にしたときに自動的に作成されます。</p></td>
       </tr>
    </table>

    <Admonition type="info" icon="📘" title="Notes">

    <p>GCP プロジェクトにはプロジェクト ID とプロジェクト番号があります：プロジェクト ID は GCP コンソールでプロジェクトを作成するときに入力した文字列であり、プロジェクト番号は GCP がプロジェクトの作成時に割り当てる文字列です。</p>
    <p><code>PROJECT_NUMBER</code> を独自の GCP プロジェクト番号に置き換える必要があります。</p>

    </Admonition>

1. **アクセス権を持つプリンシパル** タブに切り替えて **Grant access** をクリックします。

1. **Add principals** > **新しいプリンシパル** に前のステップで作成したクロスアカウントサービスアカウントを入力します。

1. **Assign roles** > **ロール** で **Service アカウント User** を選択します。

</Procedures>

#### Zilliz Cloud のサービスアカウントの権限借用\{#impersonate-zilliz-clouds-service-account}

クロスアカウントサービスアカウントに、Zilliz Cloud コンソールで提供された Zilliz Cloud のサービスアカウントを権限借用させます。

<Supademo id="cmbhbv9xj5iuasn1rj0od2qzt" title=""  />

Zilliz Cloud が提供するサービスアカウントを権限借用する手順は以下の通りです：

<Procedures>

1. Zilliz Cloud コンソールで、Zilliz Cloud が提供するサービスアカウントをコピーします。

1. GCP コンソールに移動し、**IAMと管理** を検索してクリックします。

1. 左側のナビゲーションペインから **Service アカウントs** を選択します。

1. クロスアカウントサービスアカウントをフィルタリングし、その名前をクリックして詳細を表示します。

1. **アクセス権を持つプリンシパル** タブに切り替えて **Grant access** をクリックします。

1. **Add principals** > **新しいプリンシパル** に Zilliz Cloud コンソールからコピーしたサービスアカウントを貼り付けます。

1. **Assign roles** > **ロール** で **Service アカウント Token Creator** を選択します。

1. **Save** をクリックします。

</Procedures>