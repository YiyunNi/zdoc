---
title: "Microsoft Azure への BYOC-I のデプロイ | BYOC"
slug: /deploy-byoc-i-azure
sidebar_key: deploy-byoc-i-azure
sidebar_label: "Microsoft Azure への BYOC-I のデプロイ"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Microsoft Azure Virtual Network に BYOC エージェントを持つ Bring-Your-Own-Cloud (BYOC) データプレーンをデプロイする方法を説明します。 | BYOC"
type: origin
token: QuBiwrIJdiDw3ckVDKBcPofinfe
sidebar_position: 5
keywords: 
  - zilliz
  - byoc
  - byoc-i
  - microsoft azure
  - 権限
  - 最小限の権限
  - milvus
  - ベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# Microsoft Azure 上での BYOC-I のデプロイ

このページでは、Microsoft Azure Virtual ネットワーク 内に BYOC エージェントを持つ Bring-Your-Own-Cloud (BYOC) データプレーンをデプロイする方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

- Zilliz BYOC は現在 **一般提供** で利用可能です。アクセスおよび実装の詳細については、[Zilliz Cloud サポート](https://zilliz.com/contact-sales) までお問い合わせください。

- このガイドでは、Microsoft Azure コンソール上で必要なリソースを段階的に作成する方法を説明します。インフラストラクチャのプロビジョニングに Terraform スクリプトを使用する場合は、[Terraform Provider](./terraform-provider) を参照してください。

</Admonition>

## 前提条件\{#prerequisites}

以下を確認してください。

- BYOC-I 組織のオーナーであること。

- [必要な権限](./deploy-byoc-i-aws#required-permissions) に記載された権限が付与されていること。

## 手順\{#procedures}

### ステップ 1: デプロイ環境の準備\{#step-1-prepare-the-deployment-environment}

デプロイ環境とは、Terraform 構成ファイルを実行し、BYOC-I プロジェクトのデータプレーンをデプロイするように構成されたローカルマシン、仮想マシン (VM)、または CI/CD パイプラインです。このステップでは、以下が必要です。

- **Microsoft Azure 認証情報の構成**

    Microsoft Azure 認証情報には、サブスクリプション ID とリソースグループ名が含まれます。

    **Azure Portal (UI)**

    - **サブスクリプション ID:**

        ![UCcVbQX7boMNMLxoiK8ccyM9ngd](https://zdoc-images.s3.us-west-2.amazonaws.com/uccvbqx7bomnmlxoik8ccym9ngd.png "UCcVbQX7boMNMLxoiK8ccyM9ngd")

        <Procedures>

        1. 上部の検索バーまたはホームページから **サブスクリプション** に移動します。

        1. サブスクリプションを選択します。

        1. 概要ページの **Essentials** セクションで `Subscription ID` を確認します。

        </Procedures>

    - **リソースグループ名:**

        リソースグループは、Azure ソリューションの関連リソースを保持するコンテナです。

        ![HY2ybEyBHoOrwTxvvsxcvBDFnOe](https://zdoc-images.s3.us-west-2.amazonaws.com/hy2ybeybhoorwtxvvsxcvbdfnoe.png "HY2ybEyBHoOrwTxvvsxcvBDFnOe")

        <Procedures>

        1. 左側のメニューから **リソースグループ** に移動します。

        1. 名前は **Name** 列に表示されます。

            何も表示されていない場合は、リソースグループを作成して Zilliz Cloud に提供する必要があります。後で Terraform スクリプトを実行すると、仮想マシン (VM)、仮想ネットワーク (VNet)、Azure Kubernetes Service (AKS) クラスターを含むすべての必要なリソースがリソースグループに追加されます。

        </Procedures>

- **アクセス制御 (IAM) 権限の追加**

    Terraform スクリプトを実行するロールに **Contributor** および **User Access Administrator** 権限を割り当てます。

    ![P0NbbtVyTofpGmxtk1jcpQYsnTe](https://zdoc-images.s3.us-west-2.amazonaws.com/p0nbbtvytofpgmxtk1jcpqysnte.png "P0NbbtVyTofpGmxtk1jcpQYsnTe")

    <Procedures>

    1. 左側のメニューから **アクセス制御 (IAM)** に移動します。

    1. **+ 追加** をクリックし、ドロップダウンリストから **ロールの割り当ての追加** を選択します。

    1. **ロール** タブで **Privileged administrator roles** をクリックし、**Contributor** でフィルタリングして **Next** をクリックします。

    1. **メンバー** タブで、**アクセスの割り当て先** で **User, group, or service principal** または **Managed entity** を選択し、**+ メンバーの選択** をクリックします。

        Terraform スクリプトを実行するためにユーザー、グループ、またはサービスプリンシパルを使用する場合は **User, group, or service principal** を選択します。それ以外の場合は **Managed entity** を選択します。

    1. **Next** をクリックし、設定を確認して **Review + assign** をクリックして保存します。

    1. 上記の手順を **User Access Administrator** ロールについても繰り返します。

    </Procedures>

- **最新の Terraform バイナリのインストール**

    Terraform のインストールの詳細については、[このドキュメント](https://developer.hashicorp.com/terraform/install?product_intent=terraform) を参照してください。

### ステップ 2: プロジェクトの作成\{#step-2-create-a-project}

BYOC-I 組織内で、**Create Project and Deploy データプレーン** ボタンをクリックしてデプロイを開始します。

![YYgcbgENMo6672xja9ucq9Dsnne](https://zdoc-images.s3.us-west-2.amazonaws.com/yygcbgenmo6672xja9ucq9dsnne.png "YYgcbgENMo6672xja9ucq9Dsnne")

### ステップ 3: 一般設定の構成\{#step-3-set-up-the-general-settings}

**一般設定** で、プロジェクト名を設定し、Zilliz Cloud がプロジェクトのデータプレーンをデプロイするクラウドプロバイダーとリージョンを決定する必要があります。

![Ugm3bsxb9oCsxzxqOYkclb7ZnRb](https://zdoc-images.s3.us-west-2.amazonaws.com/ugm3bsxb9ocsxzxqoykclb7znrb.png "Ugm3bsxb9oCsxzxqOYkclb7ZnRb")

<Procedures>

1. **プロジェクト名** を設定します。

1. **クラウドプロバイダー** と **リージョン** を選択します。

1. **Azure プライベート Service Connect** を有効にするかどうかを決定します。

    このオプションにより、現在のプロジェクト内のクラスターへのプライベート接続が可能になります。このオプションを有効にする場合は、プライベート接続用の VPC エンドポイントを作成する必要があります。

1. [ステップ 1](./deploy-byoc-i-azure#step-1-prepare-the-deployment-environment) で取得した Azure の **サブスクリプション ID** と **リソースグループ名** を入力します。

1. **Architecture** で、アプリケーションに合ったアーキテクチャタイプを選択します。

    これにより、使用する Zilliz BYOC イメージのアーキテクチャタイプが決定されます。利用可能なオプションは **X86** と **ARM** です。

1. **リソース設定** では、以下が必要です。

    1. **オートスケーリング** を有効または無効にして、Zilliz Cloud がプロジェクトのワークロードに基づいて定義された範囲内で VM インスタンスの数を自動的に調整し、効率的なリソース使用を確保できるようにします。

    1. **初期プロジェクトサイズ** を構成します。

        BYOC プロジェクトでは、クエリノード、インデックスサービス、Milvus コンポーネント、および依存関係が異なるタイプの VM インスタンスを使用します。これらのサービスとコンポーネントのインスタンスタイプと数を個別に設定できます。

        **オートスケーリング** が無効の場合は、各プロジェクトコンポーネントに必要な VM インスタンス数を対応する **Count** フィールドに指定するだけです。

        ![Ut9fbvTUDoXYxOxfp99cZIAGnMd](https://zdoc-images.s3.us-west-2.amazonaws.com/ut9fbvtudoxyxoxfp99cziagnmd.png "Ut9fbvTUDoXYxOxfp99cZIAGnMd")

        **オートスケーリング** を有効にすると、実際のプロジェクトワークロードに基づいて Zilliz Cloud が VM インスタンスの数を自動的にスケーリングする範囲を、対応する **Min** および **Max** フィールドを設定して指定する必要があります。

        ![VS2UbJ1cDoIqj0x3fiKc4vhMnLg](https://zdoc-images.s3.us-west-2.amazonaws.com/vs2ubj1cdoiqj0x3fikc4vhmnlg.png "VS2UbJ1cDoIqj0x3fiKc4vhMnLg")

        リソース設定を容易にするために、4 つの定義済みプロジェクトサイズオプションがあります。次の表は、これらのプロジェクトサイズオプションとプロジェクト内で作成できるクラスターの数、および各クラスターが含めることができるエンティティの数との対応関係を示しています。

        <table>
           <tr>
             <th rowspan="2"><p>サイズ</p></th>
             <th rowspan="2"><p>最大クラスター数</p></th>
             <th colspan="2"><p>最大エンティティ数（百万）</p></th>
           </tr>
           <tr>
             <td><p>パフォーマンス最適化済み CU</p></td>
             <td><p>容量最適化済み CU</p></td>
           </tr>
           <tr>
             <td><p>小</p></td>
             <td><p>8 ～ 16 CU のクラスター 3 個</p></td>
             <td><p>1,000 万 ～ 2,500 万</p></td>
             <td><p>4,000 万 ～ 8,000 万</p></td>
           </tr>
           <tr>
             <td><p>中</p></td>
             <td><p>16 ～ 64 CU のクラスター 7 個</p></td>
             <td><p>2,500 万 ～ 1 億</p></td>
             <td><p>8,000 万 ～ 3 億 5,000 万</p></td>
           </tr>
           <tr>
             <td><p>大</p></td>
             <td><p>64 ～ 192 CU のクラスター 12 個</p></td>
             <td><p>1 億 ～ 3 億</p></td>
             <td><p>3 億 5,000 万 ～ 10 億</p></td>
           </tr>
           <tr>
             <td><p>特大</p></td>
             <td><p>192 ～ 576 CU のクラスター 17 個</p></td>
             <td><p>3 億 ～ 9 億</p></td>
             <td><p>10 億 ～ 30 億</p></td>
           </tr>
        </table>

        **初期プロジェクトサイズ** で **Custom** を選択し、すべてのデータプレーンコンポーネントの VM インスタンスタイプと数を調整して、設定をカスタマイズすることもできます。希望する VM インスタンスタイプがリストにない場合は、[Zilliz サポートにお問い合わせ](https://zilliz.com/contact) ください。

1. **Next** をクリックします。

</Procedures>

### ステップ 4: データプレーンのデプロイ\{#step-4-deploy-the-data-plane}

ダイアログに表示される手順に従って、現在作成したプロジェクトのデータプレーンをデプロイします。

![X3s2bYas0o5ICVxZ18rcta5TnLd](https://zdoc-images.s3.us-west-2.amazonaws.com/x3s2byas0o5icvxz18rcta5tnld.png "X3s2bYas0o5ICVxZ18rcta5TnLd")

上記の Terraform スクリプトの実行の詳細については、[Zilliz Cloud BYOC-I プロジェクト設定ガイド](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/create-a-byoc-i-project) を参照してください。

プロジェクトのデータプレーンをデプロイし、クラスターを作成したら、直接 VPC アクセスまたは Azure プライベート Link を介してこれらのクラスターに接続できます。詳細については、[BYOC クラスターへの接続](./prepare-for-cluster-connection) を参照してください。

## プロジェクトの管理\{#manage-projects}

![J3Xibh9vtozuRHxt8Hjc0SqwnYg](https://zdoc-images.s3.us-west-2.amazonaws.com/j3xibh9vtozurhxt8hjc0sqwnyg.png "J3Xibh9vtozuRHxt8Hjc0SqwnYg")

### デプロイ解除タグの付いたプロジェクト\{#projects-with-an-undeploy-tag}

プロジェクトカードの右上隅のステータスタグが **デプロイ解除** と表示されている場合は、プロジェクトカードの **Deploy データプレーン** ボタンをクリックしていつでも再度開くことができます。プロジェクトの名前を変更または削除するには、プロジェクトカードの **...** ボタンをクリックし、ドロップダウンメニューから **Rename** または **Delete** を選択します。

### デプロイ中タグの付いたプロジェクト\{#projects-with-a-deploying-tag}

デプロイ環境の準備が完了し、表示されたコマンドを実行したら、BYOC エージェントがアクティブ化されるまで待つ必要があります。プロジェクトカードのステータスタグが **デプロイ中** と表示され、進行状況のパーセンテージが表示されている場合、データプレーンが整うまでプロジェクトの名前を変更または削除することはできません。

### 実行中タグの付いたプロジェクト\{#projects-with-a-running-tag}

プロジェクトカードのステータスタグが **Running** と表示されると、プロジェクト内でクラスターの作成を開始できます。実行中のプロジェクトの名前を変更または削除するには、プロジェクト内にクラスターが存在しないことを確認してください。

## テクニカルサポートアクセス\{#technical-support-access}

トラブルシューティングおよびメンテナンス操作を支援するために、Zilliz Cloud はデフォルトでテクニカルサポートがプロジェクトのデータプレーンにアクセスできるようにしています。

![LozAb735eoX00UxLYAKcWqY2nkG](https://zdoc-images.s3.us-west-2.amazonaws.com/lozab735eox00uxlyakcwqy2nkg.png "LozAb735eoX00UxLYAKcWqY2nkG")

対象プロジェクトのドロップダウンメニューから **テクニカルサポートアクセス** をクリックして、現在の設定を表示します。

![NdnSbwFbkokOPpxaW1ocGwklnab](https://zdoc-images.s3.us-west-2.amazonaws.com/ndnsbwfbkokoppxaw1ocgwklnab.png "NdnSbwFbkokOPpxaW1ocGwklnab")

データガバナンスおよびセキュリティ要件を満たすために、これを無効にすることができます。

