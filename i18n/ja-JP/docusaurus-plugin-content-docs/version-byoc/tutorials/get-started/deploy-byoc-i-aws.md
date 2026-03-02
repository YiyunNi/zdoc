---
title: "AWSへのBYOC-Iのデプロイ | BYOC"
slug: /deploy-byoc-i-aws
sidebar_label: "AWSへのBYOC-Iのデプロイ"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、BYOCエージェントを使用してBring-Your-Own-Cloud (BYOC) データプレーンをAWS Virtual Private Cloud (VPC) にデプロイする方法について説明します。 | BYOC"
type: origin
token: D1E4wLr5xiuHoFkJgblcHZ1FnLb
sidebar_position: 4
keywords: 
  - zilliz
  - byoc
  - byoc-i
  - aws
  - 権限
  - 最小権限
  - milvus
  - ベクトルデータベース
  - コサイン距離
  - ベクトルデータベースとは
  - vectordb
  - マルチモーダルベクトルデータベース検索

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# AWS で BYOC-I をデプロイする

このページでは、AWS Virtual Private Cloud (VPC) に BYOC エージェントを使用して Bring-Your-Own-Cloud (BYOC) データプレーンをデプロイする方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>Zilliz BYOC は現在、<strong>一般提供</strong>されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloud サポート</a>にお問い合わせください。</p></li>
<li><p>このガイドでは、AWS コンソールで必要なリソースを段階的に作成する方法を説明します。Terraform スクリプトを使用してインフラストラクチャをプロビジョニングする場合は、<a href="./terraform-provider">Terraform プロバイダー</a>を参照してください。</p></li>
</ul>

</Admonition>

## 前提条件{#prerequisites}

以下を確認してください。

- BYOC-I 組織の所有者であること。

- [必要な権限](./deploy-byoc-i-aws#required-permissions)に記載されている権限が付与されていること。

## 手順{#procedures}

### ステップ 1: デプロイ環境を準備する{#step-1-prepare-the-deployment-environment}

デプロイ環境とは、Terraform 設定ファイルを実行し、BYOC-I プロジェクトのデータプレーンをデプロイするように構成されたローカルマシン、仮想マシン (VM)、または CI/CD パイプラインのことです。このステップでは、以下を行う必要があります。

- **AWS 認証情報 (AWS プロファイルまたはアクセスキー) を設定する。**

    AWS 認証情報の設定方法の詳細については、[このドキュメント](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)を参照してください。

- **最新の Terraform バイナリをインストールする。**

    Terraform のインストール方法の詳細については、[このドキュメント](https://developer.hashicorp.com/terraform/install?product_intent=terraform)を参照してください。

### ステップ 2: プロジェクトを作成する{#step-2-create-a-project}

BYOC-I 組織内で、**Create Project and Deploy Data Plane** ボタンをクリックしてデプロイを開始します。

![Xd4ObksJao97jdxSFVTclO4Fno6](https://zdoc-images.s3.us-west-2.amazonaws.com/xd4obksjao97jdxsfvtclo4fno6.png "Xd4ObksJao97jdxSFVTclO4Fno6")

### ステップ 3: 一般設定を行う{#step-3-set-up-the-general-settings}

**General Settings** で、プロジェクト名を設定し、Zilliz Cloud がプロジェクトのデータプレーンをデプロイするクラウドプロバイダーとリージョンを決定する必要があります。

![Xejfbdz6PockHsxn5uacw3OTnVc](https://zdoc-images.s3.us-west-2.amazonaws.com/xejfbdz6pockhsxn5uacw3otnvc.png "Xejfbdz6PockHsxn5uacw3otnvc")

<Procedures>

1. **Project Name** を設定します。

1. **Cloud Provider** と **Region** を選択します。

1. **AWS PrivateLink** を有効にするかどうかを決定します。

    このオプションにより、現在のプロジェクト内のクラスターへのプライベート接続が可能になります。このオプションを有効にする場合は、プライベート接続のために VPC エンドポイントを作成する必要があります。

1. **Architecture** で、アプリケーションに合ったアーキテクチャタイプを選択します。

    これにより、使用する Zilliz BYOC イメージのアーキテクチャタイプが決まります。利用可能なオプションは **X86** と **ARM** です。

1. **Resource Settings** で、以下を行う必要があります。

    1. **Auto-scaling** を有効または無効にして、Zilliz Cloud がプロジェクトのワークロードに基づいて定義された範囲内で EC2 インスタンスの数を自動的に調整し、効率的なリソース使用を確保できるようにします。

    1. **Initial Project Size** を設定します。

        BYOC プロジェクトでは、クエリノード、インデックスサービス、Milvus コンポーネント、および依存関係は異なる種類の EC2 インスタンスを使用します。これらのサービスとコンポーネントのインスタンスタイプと数を個別に設定できます。

        **Auto-scaling** が無効になっている場合は、対応する **Count** フィールドに各プロジェクトコンポーネントに必要な EC2 インスタンスの数を指定するだけです。

        ![VHLHbZrT1oNG03xAJMgcFVKAnCh](https://zdoc-images.s3.us-west-2.amazonaws.com/vhlhbzrt1ong03xajmgcfvkanch.png "VHLHbZrT1oNG03xAJMgcFVKAnCh")

        **Auto-scaling** が有効になっている場合は、Zilliz Cloud が実際のプロジェクトワークロードに基づいて EC2 インスタンスの数を自動的にスケーリングするための範囲を、対応する **Min** および **Max** フィールドを設定して指定する必要があります。

        ![VVjXbGaS3ovyZdxEPcacd6Vnnkh](https://zdoc-images.s3.us-west-2.amazonaws.com/vvjxbgas3ovyzdxepcacd6vnnkh.png "VVjXbGaS3ovyZdxEPcacd6Vnnkh")

        リソース設定を容易にするために、4 つの事前定義されたプロジェクトサイズオプションがあります。次の表は、これらのプロジェクトサイズオプションと、プロジェクトで作成できるクラスターの数、およびこれらのクラスターが格納できるエンティティの数のマッピングを示しています。

        <table>
           <tr>
             <th rowspan="2"><p>サイズ</p></th>
             <th rowspan="2"><p>最大クラスター数</p></th>
             <th colspan="2"><p>最大エンティティ数 (百万)</p></th>
           </tr>
           <tr>
             <td><p>パフォーマンス最適化 CU</p></td>
             <td><p>容量最適化 CU</p></td>
           </tr>
           <tr>
             <td><p>小</p></td>
             <td><p>8 ～ 16 CU の 3 クラスター</p></td>
             <td><p>1,000 万 ～ 2,500 万</p></td>
             <td><p>4,000 万 ～ 8,000 万</p></td>
           </tr>
           <tr>
             <td><p>中</p></td>
             <td><p>16 ～ 64 CU の 7 クラスター</p></td>
             <td><p>2,500 万 ～ 1 億</p></td>
             <td><p>8,000 万 ～ 3 億 5,000 万</p></td>
           </tr>
           <tr>
             <td><p>大</p></td>
             <td><p>64 ～ 192 CU の 12 クラスター</p></td>
             <td><p>1 億 ～ 3 億</p></td>
             <td><p>3 億 5,000 万 ～ 10 億</p></td>
           </tr>
           <tr>
             <td><p>特大</p></td>
             <td><p>192 ～ 576 CU の 17 クラスター</p></td>
             <td><p>3 億 ～ 9 億</p></td>
             <td><p>10 億 ～ 30 億</p></td>
           </tr>
        </table>

        **Initial Project Size** で **Custom** を選択し、すべてのデータプレーンコンポーネントの EC2 インスタンスタイプと数を調整して、設定をカスタマイズすることもできます。ご希望の EC2 インスタンスタイプがリストにない場合は、[Zilliz サポート](https://zilliz.com/contact)にお問い合わせください。

1. **Next** をクリックします。

</Procedures>

### ステップ 4: データプレーンをデプロイする{#step-4-deploy-the-data-plane}

ダイアログに表示される手順に従って、現在作成されているプロジェクトのデータプレーンをデプロイします。

![GHGqbw4UroKPu7xoEWmcDQaDnEd](https://zdoc-images.s3.us-west-2.amazonaws.com/ghgqbw4urokpu7xoewmcdqadned.png "GHGqbw4UroKPu7xoEWmcDQaDnEd")

上記の Terraform スクリプトの実行の詳細については、[Zilliz Cloud BYOC-I Project Setup Guide](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/create-a-byoc-i-project) を参照してください。

## プロジェクトを管理する{#manage-projects}

![AHEybTRhto0gcKxnKIucbm3inte](https://zdoc-images.s3.us-west-2.amazonaws.com/aheybtrhto0gckxnkiucbm3inte.png "AHEybTRhto0gcKxnKIucbm3inte")

### Undeploy タグが付いたプロジェクト{#projects-with-an-undeploy-tag}

プロジェクトカードの右隅にあるステータスタグが **Undeploy** と表示されている場合、プロジェクトカードの **Deploy Data Plane** ボタンをクリックしていつでも再開できます。プロジェクトの名前を変更または削除するには、プロジェクトカードの **...** ボタンをクリックし、ドロップダウンメニューから **Rename** または **Delete** を選択します。

### Deploying タグが付いたプロジェクト{#projects-with-a-deploying-tag}

デプロイ環境を準備し、表示されたコマンドを実行したら、BYOC エージェントがアクティブになるのを待つ必要があります。プロジェクトカードのステータスタグが **Deploying** と表示され、進行状況のパーセンテージが表示されている場合、データプレーンが配置されるまでプロジェクトの名前を変更したり削除したりすることはできません。

### Running タグが付いたプロジェクト{#projects-with-a-running-tag}

プロジェクトカードのステータスタグが **Running** と表示されたら、プロジェクトでクラスターの作成を開始できます。実行中のプロジェクトの名前を変更または削除するには、プロジェクトにクラスターがないことを確認してください。

## テクニカルサポートアクセス{#technical-support-access}

トラブルシューティングとメンテナンス作業を支援するために、Zilliz Cloud はデフォルトでテクニカルサポートがプロジェクトのデータプレーンにアクセスできるようにします。

![XThkbwy5hoho7Ixpgg5ctUp1nRe](https://zdoc-images.s3.us-west-2.amazonaws.com/xthkbwy5hoho7ixpgg5ctup1nre.png "XThkbwy5hoho7Ixpgg5ctUp1nRe")

対象プロジェクトのドロップダウンメニューから **Technical Support Access** をクリックすると、現在の設定が表示されます。

![Z4L2bIrA0onlxPxFNUNcYv78nIe](https://zdoc-images.s3.us-west-2.amazonaws.com/z4l2bira0onlxpxfnuncyv78nie.png "Z4L2bIrA0onlxPxFNUNcYv78nIe")

データガバナンスとセキュリティ要件を満たすために、これを無効にすることができます。

## 必要な権限{#required-permissions}

このセクションでは、AWS に BYOC-I をデプロイするために必要なすべての主要な権限について説明します。

### VPC およびネットワークリソースの権限{#vpc-and-networking-resource-permissions}

- **VPC 管理**: VPC の作成、変更、説明、削除

- **サブネット操作**: サブネットの作成と削除

- **セキュリティグループ**: セキュリティグループとそのルールの作成、変更、削除

- **ルートテーブル**: ルートテーブルの作成、関連付け、管理

- **インターネットゲートウェイ**: インターネットゲートウェイの作成、アタッチ、デタッチ

- **NAT ゲートウェイ**: Elastic IP を使用した NAT ゲートウェイの作成と削除

- **VPC エンドポイント**: AWS サービス用の VPC エンドポイントの作成と削除

- **起動テンプレート**: EC2 起動テンプレートの作成と削除

- **Route53**: ホストゾーンへの VPC の関連付け

- **タグ付け**: VPC リソースへのタグの作成と削除

### IAM ロールと BYOC-I デプロイの権限{#iam-roles-and-byoc-i-deployment-permissions}

- **ロール管理**: IAM ロールの作成、取得、リスト、ポリシーのアタッチ/デタッチ、削除

- **ポリシー管理**: IAM ポリシーの作成、取得、バージョンリスト、削除

- **タグ付け**: ロールとポリシーのタグ付けとタグ解除

- **ID 検証**: 呼び出し元 ID の取得 (STS)

### S3 バケットの権限{#s3-bucket-permissions}

- **バケット操作**: S3 バケットの作成、リスト、設定の取得、削除

- **バケット設定**: バケットのタグ付け、ポリシー、ACL、CORS、バージョン管理、暗号化、パブリックアクセス設定の管理

- **オブジェクトタグ付け**: オブジェクトタグの配置、取得、削除

- **バケットリスト**: アカウント内のすべてのバケットをリスト

### EKS クラスターおよび関連リソースの権限{#eks-cluster-and-related-resource-permissions}

- **サービスリンクロール**: クラスターおよびノードグループ管理用の EKS サービスリンクロールの作成

- **OIDC プロバイダー**: OpenID Connect プロバイダーの作成、タグ付け、取得、削除 ( `Vendor=zilliz-byoc` タグ要件あり)

- **IAM ロール管理**: EKS ロールの読み取りと EKS サービスへのロールの引き渡し

- **EC2 リソース**: 起動テンプレートの作成、インスタンスの実行、タグの管理 ( `Vendor=zilliz-byoc` タグ要件あり)

- **EKS クラスター操作**: EKS クラスターの作成、更新、説明、タグ付け、削除

- **ノードグループ操作**: EKS ノードグループの作成、更新、説明、削除

- **アドオン管理**: EKS アドオンの作成、更新、説明、削除

- **アクセスエントリ管理**: EKS アクセスエントリと Pod ID 関連付けの作成、更新、説明、削除

