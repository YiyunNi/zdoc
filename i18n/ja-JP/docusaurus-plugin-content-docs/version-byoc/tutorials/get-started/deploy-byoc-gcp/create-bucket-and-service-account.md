---
title: "クラウドストレージバケットとサービスアカウントの作成 | BYOC"
slug: /create-bucket-and-service-account
sidebar_label: "クラウドストレージバケットとサービスアカウントの作成"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Bring-Your-Own-Cloud (BYOC) プロジェクトのルートストレージを適切な権限で作成および設定する手順について説明します。"
type: origin
token: RymGwWsFMi3VV1kXGmHckc2WnKc
sidebar_position: 1
keywords: 
  - zilliz
  - byoc
  - byoc-i
  - gcp
  - 権限
  - 最小権限
  - milvus
  - ベクターデータベース
  - ベクターストア
  - オープンソースベクターデータベース
  - ベクターインデックス
  - ベクターデータベースオープンソース

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# クラウドストレージバケットとサービスアカウントの作成

このページでは、Bring-Your-Own-Cloud (BYOC) プロジェクトのルートストレージを適切な権限で作成および構成する手順について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz BYOC は現在、**一般提供**されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloud の営業担当者</a>にお問い合わせください。</p>

</Admonition>

## クラウドストレージバケットのベストプラクティス{#best-practices-for-the-cloud-storage-bucket}

プロジェクトのデプロイ時に指定するバケットは、プロジェクトで作成されたクラスターのルートストレージとして使用されます。クラウドストレージバケットを作成する前に、以下のベストプラクティスを確認してください。

- バケットは、プロジェクトのデプロイと同じGoogle Cloud Platform (GCP) リージョンにある必要があります。

- プロジェクト内のすべてのクラスターは、プロジェクトのデプロイ時に作成されたクラウドストレージバケットを共有します。Zilliz Cloud は、プロジェクト専用のクラウドストレージバケットを使用し、他のサービスやリソースと共有しないことを推奨します。

## 手順{#procedure}

GCP ダッシュボードを使用して、バケットとサービスアカウントを作成できます。または、Zilliz Cloud が提供する Terraform スクリプトを使用して、GCP 上の Zilliz Cloud プロジェクトのインフラストラクチャをブートストラップすることもできます。詳細については、[Terraform Provider](./terraform-provider) を参照してください。

### ステップ 1: クラウドストレージバケットを作成する{#step-1-create-a-cloud-storage-bucket}

このステップでは、BYOC プロジェクトのデプロイ用に GCP にクラウドストレージバケットを作成します。既存のバケットを使用する場合は、そのバケットが BYOC プロジェクトと同じリージョンにあることを確認してください。作成後、Zilliz Cloud コンソールの**ストレージ設定**にバケット名を入力します。

<Supademo id="cmbg4ro374d54sn1rdnv6ca32" title=""  />

バケットを作成する手順は次のとおりです。

<Procedures>

1. GCP コンソールで、**Cloud Storage** を見つけてクリックします。

1. **バケットを作成**をクリックします。

    このデモでは、`zilliz-byoc-your-org-bucket` に設定するか、独自の命名規則に従うことができます。

1. 作成するバケットにわかりやすい名前を設定します。

1. **ロケーションタイプ**で**リージョン**を選択して、単一リージョン内で最低のレイテンシを確保し、表示されるドロップダウンリストから BYOC プロジェクトのリージョンを選択します。

    このデモでは、`us-west (Oregon)` に設定できます。この値が BYOC プロジェクトの値と同じであることを確認してください。

1. **続行**をクリックします。

1. **アクセス制御**で、**きめ細かい**を選択して、きめ細かい公開アクセス防止を有効にします。

1. **続行**をクリックします。

1. デフォルト設定のまま、**作成**をクリックします。

1. プロンプトが表示されたダイアログボックスで**確認**をクリックして、作成するバケットへの公開アクセス防止を確認します。

</Procedures>

### ステップ 2: バケットにアクセスするためのサービスアカウントを作成する{#step-2-create-a-service-account-to-access-the-bucket}

このステップでは、サービスアカウントを作成し、いくつかのロールをサービスアカウントに関連付け、Zilliz Cloud が上記で作成したバケットにアクセスできるように、サービスアカウントを Zilliz Cloud に提供します。

<Supademo id="cmc1mg9bvjk4bsn1r8awkyndh" title=""  />

ストレージサービスアカウントを作成する手順は次のとおりです。

<Procedures>

1. GCP コンソールで、**IAM と管理**を見つけてクリックします。

1. 左側のナビゲーションペインで**サービスアカウント**を選択します。

1. **サービスアカウントを作成**をクリックします。

1. 作成するサービスアカウントの名前を設定します。

    このデモでは、`your-org-storage-sa` に設定できます。サービスアカウント ID は、サービスアカウント名の最初の 18 文字である必要があります。適切な値に手動で設定できます。

1. **作成して続行**をクリックします。

1. **権限**で、条件付きで 2 つのロールを追加します。

    1. ドロップダウンリストから**ストレージオブジェクト管理者**を選択します。

    1. **IAM 条件を追加**をクリックし、条件のタイトルを設定し、**条件エディタ**に次の条件を入力します。

        ```json
        resource.name.startsWith("projects/_/buckets/YOUR_BUCKET_NAME")
        ```

        <Admonition type="info" icon="📘" title="Notes">

        <p><code>YOUR_BUCKET_NAME</code> は、前のステップで作成したバケット名に置き換える必要があります。</p>

        </Admonition>

    1. **Save** をクリックします。

    1. **Add another role** をクリックします。

    1. ドロップダウンリストから **Storage Bucket Viewer** を選択します。

    1. **Add IAM condition** をクリックし、条件のタイトルを設定し、**Condition editor** に以下の条件を入力します。

        ```json
        resource.name.startsWith("projects/_/buckets/YOUR_BUCKET_NAME")
        ```

        <Admonition type="info" icon="📘" title="Notes">

        <p><strong>Condition builder</strong> と <strong>Condition editor</strong> は、条件を設定するための同等の方法です。どちらの場合も、<code>YOUR_BUCKET_NAME</code> を前のステップで作成したバケットの名前に置き換える必要があります。</p>

        </Admonition>

    1. **Save** をクリックします。

1. **Done** をクリックします。

</Procedures>