---
title: "クロスアカウントサービスアカウントの作成 | BYOC"
slug: /create-cross-account-sa
sidebar_label: "クロスアカウントサービスアカウントの作成"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloudがプロジェクトのデータプレーンをブートストラップするために、クロスアカウントサービスアカウントを作成および設定する方法について説明します。このサービスアカウントは、Zilliz CloudにVPCリソースを管理するために必要な権限を付与します。 | BYOC"
type: origin
token: GeaswUCLVi04xQkLl4vc7cbdnVh
sidebar_position: 3
keywords: 
  - zilliz
  - byoc
  - byoc-i
  - gcp
  - 権限
  - 最小権限
  - milvus
  - ベクターデータベース
  - ベクトルデータベース
  - IVF
  - knn
  - 画像検索

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# クロスアカウントサービスアカウントの作成

このページでは、Zilliz Cloudがプロジェクトのデータプレーンをブートストラップするために、クロスアカウントサービスアカウントを作成および設定する方法について説明します。このサービスアカウントは、Zilliz Cloudに代わってVPCリソースを管理するために必要な権限をZilliz Cloudに付与します。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz BYOCは現在、**一般提供**されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloudの営業担当者</a>にお問い合わせください。</p>

</Admonition>

## 手順{#procedures}

Google Cloud Platform (GCP) ダッシュボードを使用してEKSロールを作成できます。または、Zilliz Cloudが提供するTerraformスクリプトを使用して、GCP上のZilliz Cloudプロジェクトのインフラストラクチャをブートストラップすることもできます。詳細については、[Terraform Provider](./terraform-provider)を参照してください。

### ステップ1: カスタムロールの作成{#step-1-create-custom-roles}

クロスアカウントサービスアカウントを作成する前に、サービスアカウントに割り当てる必要のあるいくつかのカスタムロールを作成する必要があります。

#### インスタンスグループマネージャーのカスタムロールの作成{#create-an-instance-group-manager-custom-role}

インスタンスグループマネージャーのカスタムロールを作成し、作成したサービスアカウントにカスタムロールを割り当てることで、サービスアカウントがGKEノードを管理するために必要な最小限の権限を持つようにします。

<Supademo id="cmbgb65fo4klnsn1rfs4be7qd" title=""  />

インスタンスグループマネージャーのカスタムロールを作成する手順は次のとおりです。

<Procedures>

1. GCPコンソールで、**IAMと管理**を見つけてクリックします。

1. 左側のナビゲーションペインから**ロール**を選択します。

1. **ロールを作成**をクリックします。

1. 作成するカスタムロールのタイトルと説明を設定します。

    このデモでは、**Zilliz Cloud Custom Role for GKE Management**を使用できます。

1. **ロールの起動ステージ**を**アルファ**から**一般提供**に変更します。

1. **権限を追加**をクリックします。このステップで追加する権限は次のとおりです。

    - **compute.instanceGroupManagers.get**

    - **compute.instanceGroupManagers.update**

1. **作成**をクリックします。

</Procedures>

#### IAMカスタムロールの作成{#create-an-iam-custom-role}

IAMカスタムロールを作成し、作成したサービスアカウントにカスタムロールを割り当てることで、サービスアカウントがIAMポリシーを管理するために必要な最小限の権限を持つようにします。

<Supademo id="cmbri7b73cdexsn1r99xrvvfd" title=""  />

カスタムロールを作成する手順は次のとおりです。

<Procedures>

1. GCPコンソールで、**IAMと管理**を見つけてクリックします。

1. 左側のナビゲーションペインから**ロール**を選択します。

1. **ロールを作成**をクリックします。

1. 作成するカスタムロールのタイトルと説明を設定します。

    このデモでは、**IAMカスタムロール**を使用できます。

1. **ロールの起動ステージ**を**アルファ**から**一般提供**に変更します。

1. **権限を追加**をクリックします。このステップで追加する権限は次のとおりです。

    - **iam.serviceAccounts.getIamPolicy**

    - **iam.serviceAccounts.setIamPolicy**

1. **作成**をクリックします。

</Procedures>

### ステップ2: サービスアカウントの作成{#step-2-create-a-service-account}

このステップでは、Zilliz Cloudがユーザーに代わってVPCリソースを管理するためのサービスアカウントを作成し、そのサービスアカウントのメールアドレスをZilliz Cloudコンソールに貼り付けます。

<Supademo id="cmc1pq4ikjo9nsn1rzuxbs1p0" title=""  />

サービスアカウントを作成する手順は次のとおりです。

<Procedures>

1. GCPコンソールで、**IAMと管理**を見つけてクリックします。

1. 左側のナビゲーションペインで**サービスアカウント**を選択します。

1. **サービスアカウントを作成**をクリックします。

1. 作成するサービスアカウントに適切な名前を設定します。

    このデモでは、`your-org-cross-account-sa`に設定できます。サービスアカウントIDは、サービスアカウント名の最初の18文字です。手動で適切な値に設定できます。

1. **作成して続行**をクリックします。

1. **権限**セクションで、前のステップで作成したカスタムロールといくつかのGCP管理ロールをサービスアカウントに追加します。

    次の表に、サービスアカウントに割り当てるロールを示します。

    <table>
       <tr>
         <th><p>ロール</p></th>
         <th><p>タイプ</p></th>
         <th><p>条件</p></th>
       </tr>
       <tr>
         <td><p><a href="./create-cross-account-sa">インスタンスグループマネージャーのカスタムロール</a></p></td>
         <td><p>カスタム</p></td>
         <td><p><code>resource.name.extract("projects/&lt;name&gt;").startsWith("PROJECT_ID") &&resource.name.extract("zones/&lt;name&gt;").startsWith("REGION") &&resource.name.extract("instanceGroupManagers/&lt;name&gt;").startsWith("gke-CLUSTER_NAME")</code></p></td>
       </tr>
       <tr>
         <td><p><a href="./create-cross-account-sa">IAMカスタムロール</a></p></td>
         <td><p>カスタム</p></td>
         <td><p><code>api.getAttribute("iam.googleapis.com/modifiedGrantsByRole", []).hasOnly(["roles/iam.workloadIdentityUser"])</code></p></td>
       </tr>
       <tr>
         <td><p>Kubernetes Engine 管理者</p></td>
         <td><p>GCP管理</p></td>
         <td><p>N/A</p></td>
       </tr>
       <tr>
         <td><p>ストレージオブジェクト閲覧者</p></td>
         <td><p>GCP管理</p></td>
         <td><p><code>resource.name.startsWith("projects/_/buckets/YOUR_BUCKET_NAME")</code></p></td>
       </tr>
    </table>

    <Admonition type="info" icon="📘" title="Notes">

    <p>上記の式にある3つのプレースホルダーを実際の値に置き換える必要があります。</p>
    <ul>
    <li><code>PROJECT_ID</code></li>
    </ul>
    <p>これはGCPプロジェクトIDである必要があります。</p>
    <ul>
    <li><code>REGION</code></li>
    </ul>
    <p>これはBYOCプロジェクトのクラウドリージョンである必要があります。</p>
    <ul>
    <li><code>CLUSTER_NAME</code></li>
    </ul>
    <p>これは、Zilliz Cloudがユーザーに代わって作成するGKEクラスターの名前である必要があります。</p>
    <p>Google Cloudはクラスター名の前にプレフィックス<code>gke-</code>を追加することに注意してください。したがって、条件に<code>gke-</code>プレフィックスを保持し、<code>CLUSTER_NAME</code>を実際の名前で置き換えるだけです。</p>
    <ul>
    <li><code>YOUR_BUCKET_NAME</code></li>
    </ul>
    <p>これは、前のステップで作成したバケットの名前である必要があります。</p>

    </Admonition>

1. **保存**をクリックします。

</Procedures>

#### 他のサービスアカウントへのアクセス権の付与{#grant-access-to-other-service-accounts}

前のステップで作成したクロスアカウントサービスアカウントに、他のいくつかのサービスアカウントへのアクセス権を付与します。

<Supademo id="cmbq9hdfjbatwsn1rv37dqcnr" title=""  />

クロスアカウントサービスアカウントにこれらのサービスアカウントへのアクセス権を付与するには、以下の手順に従います。

<Procedures>

1. GCPコンソールで、**サービスアカウント**を見つけてクリックします。

1. リストから次のサービスアカウントを見つけてクリックします。

    <table>
       <tr>
         <th></th>
         <th><p>説明</p></th>
       </tr>
       <tr>
         <td><p><code>PROJECT_NUMBER-compute@developer.gserviceaccount.com</code></p></td>
         <td><p>このサービスアカウントは、Compute Engine APIを有効にすると自動的に作成されます。</p></td>
       </tr>
    </table>

    <Admonition type="info" icon="📘" title="Notes">

    <p>GCPプロジェクトには、プロジェクトIDとプロジェクト番号があります。プロジェクトIDは、GCPコンソールでプロジェクトを作成するときに入力した文字列であり、プロジェクト番号は、GCPがプロジェクトの作成時にプロジェクトに割り当てる文字列です。</p>
    <p><code>PROJECT_NUMBER</code>を独自のGCPプロジェクト番号に置き換える必要があります。</p>

    </Admonition>

1. **アクセス権を持つプリンシパル**タブに切り替えて、**アクセス権を付与**をクリックします。

1. **プリンシパルを追加** > **新しいプリンシパル**に、前のステップで作成したクロスアカウントサービスアカウントを入力します。

1. **ロールを割り当てる** > **ロール**で**サービスアカウントユーザー**を選択します。

</Procedures>

#### Zilliz Cloudのサービスアカウントの偽装{#impersonate-zilliz-clouds-service-account}

クロスアカウントサービスアカウントに、Zilliz Cloudコンソールで提供されるZilliz Cloudのサービスアカウントを偽装させます。

<Supademo id="cmbhbv9xj5iuasn1rj0od2qzt" title=""  />

Zilliz Cloudが提供するサービスアカウントを偽装する手順は次のとおりです。

<Procedures>

1. Zilliz Cloudコンソールで、Zilliz Cloudが提供するサービスアカウントをコピーします。

1. GCPコンソールに移動し、**IAMと管理**を見つけてクリックします。

1. 左側のナビゲーションペインで**サービスアカウント**を選択します。

1. クロスアカウントサービスアカウントをフィルタリングし、その名前をクリックして詳細を表示します。

1. **アクセス権を持つプリンシパル**タブに切り替えて、**アクセス権を付与**をクリックします。

1. **プリンシパルを追加** > **新しいプリンシパル**に、Zilliz Cloudコンソールからコピーしたサービスアカウントを貼り付けます。

1. **ロールを割り当てる** > **ロール**で**サービスアカウントトークン作成者**を選択します。

1. **保存**をクリックします。

</Procedures>