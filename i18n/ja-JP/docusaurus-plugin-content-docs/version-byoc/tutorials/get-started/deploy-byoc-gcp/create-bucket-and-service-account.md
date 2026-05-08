---
title: "Cloud Storage Bucket と Service Account の作成 | BYOC"
slug: /create-bucket-and-service-account
sidebar_key: create-bucket-and-service-account
sidebar_label: "Cloud Storage Bucket と Service Account を作成"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Bring-Your-Own-Cloud (BYOC) プロジェクトのルートストレージを適切な権限で作成・設定する手順について説明します。 | BYOC"
type: origin
token: RymGwWsFMi3VV1kXGmHckc2WnKc
sidebar_position: 1
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

# Cloud Storage バケットとサービスアカウントの作成

このページでは、Bring-Your-Own-Cloud (BYOC) プロジェクトのルートストレージを適切な権限で作成・設定する手順について説明します。

<Admonition type="info" icon="📘" title="Notes">

Zilliz BYOC は現在 **一般提供** されています。アクセスおよび実装の詳細については、[Zilliz Cloud 営業](https://zilliz.com/contact-sales) までお問い合わせください。

</Admonition>

## Cloud Storage バケットのベストプラクティス\{#best-practices-for-the-cloud-storage-bucket}

プロジェクトのデプロイ時に指定するバケットは、プロジェクト内で作成されたクラスタのルートストレージとして使用されます。Cloud Storage バケットを作成する前に、以下のベストプラクティスを確認してください。

- バケットは、プロジェクトのデプロイと同じ Google Cloud Platform (GCP) リージョンに存在する必要があります。

- プロジェクト内のすべてのクラスタは、プロジェクトのデプロイ時に作成された Cloud Storage バケットを共有します。Zilliz Cloud では、プロジェクト専用の Cloud Storage バケットを使用し、他のサービスやリソースと共有しないことを推奨しています。

## 手順\{#procedure}

GCP ダッシュボードを使用してバケットとサービスアカウントを作成できます。または、Zilliz Cloud が提供する Terraform スクリプトを使用して、GCP 上の Zilliz Cloud プロジェクトのインフラストラクチャをブートストラップすることもできます。詳細については、[Terraform Provider](./terraform-provider) を参照してください。

### ステップ 1: Cloud Storage バケットの作成\{#step-1-create-a-cloud-storage-bucket}

このステップでは、BYOC プロジェクトのデプロイ用に GCP 上に Cloud Storage バケットを作成します。既存のバケットを使用する場合は、バケットが BYOC プロジェクトと同じリージョンにあることを確認してください。作成後、Zilliz Cloud コンソールの **ストレージ設定** にバケット名を入力します。

<Supademo id="cmbg4ro374d54sn1rdnv6ca32" title=""  />

バケットを作成する手順は以下の通りです。

<Procedures>

1. GCP コンソールで **Cloud Storage** を検索してクリックします。

1. **バケットを作成** をクリックします。

    このデモでは、`zilliz-byoc-your-org-bucket` に設定するか、命名規則に従ってください。

1. 作成するバケットの説明的な名前を設定します。

1. **ロケーションタイプ** で **リージョン** を選択し、単一リージョン内での最低レイテンシーを確保し、表示されるドロップダウンリストで BYOC プロジェクトのリージョンを選択します。

    このデモでは、`us-west (Oregon)` に設定できます。この値が BYOC プロジェクトの値と同じであることを確認してください。

1. **続行** をクリックします。

1. **アクセス制御** で **きめ細かい** を選択し、きめ細かいパブリックアクセス防止を有効にします。

1. **続行** をクリックします。

1. デフォルト設定のまま、**作成** をクリックします。

1. 表示されたダイアログボックスで **確認** をクリックし、作成するバケットへのパブリックアクセス防止を確認します。

</Procedures>

### ステップ 2: バケットにアクセスするためのサービスアカウントの作成\{#step-2-create-a-service-account-to-access-the-bucket}

このステップでは、サービスアカウントを作成し、サービスアカウントにいくつかのロールを関連付け、Zilliz Cloud が上記で作成したバケットにアクセスできるようにサービスアカウントを Zilliz Cloud に提供します。

<Supademo id="cmc1mg9bvjk4bsn1r8awkyndh" title=""  />

ストレージサービスアカウントを作成する手順は以下の通りです。

<Procedures>

1. GCP コンソールで **IAMと管理** を検索してクリックします。

1. 左側のナビゲーションペインで **サービスアカウント** を選択します。

1. **サービスアカウントを作成** をクリックします。

1. 作成するサービスアカウントの名前を設定します。

    このデモでは、`your-org-storage-sa` に設定できます。サービスアカウント ID は、サービスアカウント名の先頭 18 文字である必要があります。手動で適切な値に設定できます。

1. **作成して続行** をクリックします。

1. **権限** で、条件付きで 2 つのロールを追加します。

    1. ドロップダウンリストから **Storage Object Admin** を選択します。

    1. **IAM 条件を追加** をクリックし、条件のタイトルを設定し、**条件エディタ** に以下の条件を入力します。

        ```json
        resource.name.startsWith("projects/_/buckets/YOUR_BUCKET_NAME")
        ```

        <Admonition type="info" icon="📘" title="Notes">

        前のステップで作成したバケットの名前に `YOUR_BUCKET_NAME` を置き換える必要があります。

        </Admonition>

    1. **Save** をクリックします。

    1. **Add another role** をクリックします。

    1. ドロップダウンリストから **Storage バケット Viewer** を選択します。

    1. **Add IAM condition** をクリックし、条件のタイトルを設定して、**条件エディタ**に以下の条件を入力します。

        ```json
        resource.name.startsWith("projects/_/buckets/YOUR_BUCKET_NAME")
        ```

        <Admonition type="info" icon="📘" title="Notes">

        **Condition builder** と **条件エディタ** は、条件を設定する等価な方法です。いずれの場合も、`YOUR_BUCKET_NAME` を前のステップで作成したバケットの名前に置き換える必要があります。

        </Admonition>

    1. **Save** をクリックします

1. **Done** をクリックします。

</Procedures>