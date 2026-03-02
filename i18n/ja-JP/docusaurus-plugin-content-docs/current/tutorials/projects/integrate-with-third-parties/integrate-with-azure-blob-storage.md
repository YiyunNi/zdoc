---
title: "Azure Blob Storage との統合 | Cloud"
slug: /integrate-with-azure-blob-storage
sidebar_label: "Azure Blob Storage"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud を使用すると、Azure Blob Storage と統合して、バックアップファイルや監査ログを指定されたコンテナにエクスポートできます。"
type: origin
token: IzXPwUlJ5isTa4kH9KTcC6SfnvZ
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - サードパーティ
  - サービス
  - azure
  - blob
  - storage
  - rag ベクトルデータベース
  - ベクトルDBとは
  - ベクトルデータベースとは
  - ベクトルデータベース比較

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# Azure Blob Storage との統合

Zilliz Cloud を使用すると、[Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs) と統合して、バックアップファイルや監査ログを指定されたコンテナにエクスポートできます。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Enterprise</strong> プロジェクトの <strong>Dedicated</strong> クラスターでのみ利用可能です。</p>

</Admonition>

以下の図は、Zilliz Cloud と Azure Portal で必要な手順を示しています。

![EFqDwDiAIhoOPXbvLBDcO7DrnJd](https://zdoc-images.s3.us-west-2.amazonaws.com/EFqDwDiAIhoOPXbvLBDcO7DrnJd.png)

## 開始する前に{#before-you-start}

- Zilliz Cloud を Azure Blob と統合するには、プロジェクトに対する **Organization Owner** または **Project Admin** のアクセス権が必要です。必要な権限がない場合は、Zilliz Cloud 管理者にお問い合わせください。

- Azure Portal への管理者アクセス権があること。

## ステップ 1: Zilliz Cloud で統合を開始する{#step-1-start-integration-on-zilliz-cloud}

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインします。

1. プロジェクトページで、左側のナビゲーションペインから **Integrations** に移動します。

1. **Azure Blob Storage** セクションの下にある **+ Integration** をクリックします。

    ![Pxw7bG0keosOCDxfVdmcCC1rnBg](https://zdoc-images.s3.us-west-2.amazonaws.com/pxw7bg0keosocdxfvdmccc1rnbg.png "Pxw7bG0keosOCDxfVdmcCC1rnBg")

1. 表示されるダイアログボックスで、**Basic Settings** を完了します。

    - **Integration Name**: この統合の一意の名前 (例: `container_for_backup`)。

    - **Integration Description** *(オプション)*: この統合の説明 (例: `for backupfile export`)。

    次に、**Next** をクリックして続行します。

</Procedures>

## ステップ 2: Azure Portal でコンテナを作成する{#step-2-create-a-container-on-azure-portal}

<Procedures>

1. [Azure Portal](https://portal.azure.com/#home) にログインします。

1. 検索バーに「**Storage accounts**」と入力し、オプションを選択します。

    ![integrate-with-azure-blob-1](https://zdoc-images.s3.us-west-2.amazonaws.com/integrate-with-azure-blob-1.png "integrate-with-azure-blob-1")

1. **Storage accounts** ページで、既存のストレージアカウントを選択するか、**+ Create** をクリックして新しいストレージアカウントを設定します。**注:** ストレージアカウントは、Zilliz Cloud クラスターと同じリージョンにある必要があります。

    ![integrate-with-azure-blob-2](https://zdoc-images.s3.us-west-2.amazonaws.com/integrate-with-azure-blob-2.png "integrate-with-azure-blob-2")

1. ストレージアカウントの詳細ページで、**Data Storage** > **Containers** に移動し、**+ Container** をクリックします。

    ![S3Evbdfp1o5JWnxhCkEcUZktnme](https://zdoc-images.s3.us-west-2.amazonaws.com/s3evbdfp1o5jwnxhckecuzktnme.png "S3Evbdfp1o5JWnxhCkEcUZktnme")

1. 表示されるパネルで、コンテナ名を入力します。このコンテナ名は、Zilliz Cloud コンソールで必要となるため、メモしておいてください。

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)に戻り、**Create Azure Blob Storage Container** ステップで設定を完了します。

    - **Zilliz Cloud Cluster Region**: Zilliz Cloud クラスターが存在するクラウドリージョンを選択します。

    - **Storage Account Name**: Azure ストレージアカウント名を入力します。

    - **Container Name**: 作成したコンテナの名前を入力します。

    次に、**Next** をクリックして続行します。

    ![integrate-with-azure-blob-3](https://zdoc-images.s3.us-west-2.amazonaws.com/integrate-with-azure-blob-3.png "integrate-with-azure-blob-3")

</Procedures>

## ステップ 3: アプリケーションを登録し、資格情報を追加する{#step-3-register-an-application-and-add-credential}

<Procedures>

1. [Azure Portal](https://portal.azure.com/#home) に戻り、「**App registrations**」を検索して選択します。

    ![integrate-with-azure-blob-4](https://zdoc-images.s3.us-west-2.amazonaws.com/integrate-with-azure-blob-4.png "integrate-with-azure-blob-4")

1. **Application registrations** ページで、**+ New registration** をクリックします。

    ![integrate-with-azure-blob-5](https://zdoc-images.s3.us-west-2.amazonaws.com/integrate-with-azure-blob-5.png "integrate-with-azure-blob-5")

1. **Register an application** パネルで、アプリケーションの名前を入力し、他のフィールドはデフォルト設定のままにして、**Register** をクリックします。

    ![RLaubwh94oRrLqxf8R4cd3xvnPg](https://zdoc-images.s3.us-west-2.amazonaws.com/rlaubwh94orrlqxf8r4cd3xvnpg.png "RLaubwh94oRrLqxf8R4cd3xvnPg")

1. アプリケーションの **Overview** ページで、**Application (client) ID** と **Directory (tenant) ID** をコピーします。これらの値は Zilliz Cloud コンソールで必要になります。

    ![Dgwnbb77ToK38Vx8WHdcN2ylnSh](https://zdoc-images.s3.us-west-2.amazonaws.com/dgwnbb77tok38vx8whdcn2ylnsh.png "Dgwnbb77ToK38Vx8WHdcN2ylnSh")

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)に戻り、コピーした **Application (client) ID** と **Directory (tenant) ID** を **Register a New Application** ステップに入力します。

    また、Zilliz Cloud から提供される **Cluster Issuer URL**、**Service Name**、および **Service Account Name** をメモしておいてください。これらの値は Azure Portal で必要になります。

1. [Azure Portal](https://portal.azure.com/#home) のアプリケーションページに戻ります。**Manage** > **Certificates & secrets** > **Federated credentials** に移動し、**Add credential** をクリックします。

    ![UGgmb9dKnoPlk9xtrFvcDl3Dnfd](https://zdoc-images.s3.us-west-2.amazonaws.com/uggmb9dknoplk9xtrfvcdl3dnfd.png "UGgmb9dKnoPlk9xtrFvcDl3Dnfd")

1. **Add a credential** パネルで、資格情報の設定を構成します。

    - **Federated credential scenario**: **Kubernetes accessing Azure resources** を選択します。

    - **Cluster issuer URL**: Zilliz Cloud から提供された値を入力します。

    - **Namespace**: **milvus-tool** に設定します。

    - **Service account name**: **milvus-bucket** に設定します。

    - **Name**: カスタム名を入力します (例: 明確にするために **zilliz** を含める)。

    - **Audience**: デフォルト値を使用します。

    次に、**Add** をクリックして資格情報を保存します。

    ![integrate-with-azure-blob-7](https://zdoc-images.s3.us-west-2.amazonaws.com/integrate-with-azure-blob-7.png "integrate-with-azure-blob-7")

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)に戻り、**Next** をクリックして続行します。

</Procedures>

## ステップ 4: ロールの割り当てを追加する{#step-4-add-role-assignment}

<Procedures>

1. [Azure Portal](https://portal.azure.com/#home) で、**Access Control (IAM)** > **+ Add** > **Add role assignment** に移動します。

    ![integrate-with-azure-blob-6](https://zdoc-images.s3.us-west-2.amazonaws.com/integrate-with-azure-blob-6.png "integrate-with-azure-blob-6")

1. **Job function roles** タブで、**Storage Blob Data Contributor** ロールを選択します。

    ![CXjcbs7q9oitdRxKzkhcrhnznh0](https://zdoc-images.s3.us-west-2.amazonaws.com/cxjcbs7q9oitdrxkzkhcrhnznh0.png "CXjcbs7q9oitdRxKzkhcrhnznh0")

1. **Members** タブで、登録したアプリケーションを選択してロールを割り当てます。

    ![SbSgbe9tzo45z3xtKLicm64ingc](https://zdoc-images.s3.us-west-2.amazonaws.com/sbsgbe9tzo45z3xtklicm64ingc.png "SbSgbe9tzo45z3xtKLicm64ingc")

1. **Review + assign** タブで、**Review + assign** をクリックして確認します。

</Procedures>

## ステップ 5: 統合を検証して作成する{#step-5-validate-and-create-integration}

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)で、**Validate Integration** をクリックして、コンテナとロールの割り当て設定が有効であることを確認します。

1. 検証が成功したら、**Create** をクリックして統合を完了します。

</Procedures>

これで、Azure Blob Storage が Zilliz Cloud と統合され、バックアップファイルのエクスポートが可能になりました。詳細については、[バックアップファイルのエクスポート](./export-backup-files)を参照してください。

## 統合の管理{#manage-integrations}

統合が追加されたら、その詳細を表示したり、必要に応じて統合を削除したりできます。

![DN2GbaT6momqNzxZeLwc0fe2nuh](https://zdoc-images.s3.us-west-2.amazonaws.com/dn2gbat6momqnzxzelwc0fe2nuh.png "DN2GbaT6momqNzxZeLwc0fe2nuh")

## トラブルシューティング{#troubleshooting}

- **検証エラー:**

    統合の検証が失敗した場合は、以下を確認してください。

    - Azure Storage アカウントと Zilliz Cloud クラスターのリージョンが一致していること。

    - すべてのアプリケーション ID、テナント ID、および資格情報の詳細が正しいこと。

- **権限の問題:**

    Zilliz Cloud と Azure Portal の両方で必要な権限があることを確認してください。