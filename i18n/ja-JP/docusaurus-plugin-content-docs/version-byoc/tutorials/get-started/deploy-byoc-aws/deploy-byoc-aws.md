---
title: "AWS で BYOC をデプロイ | BYOC"
slug: /deploy-byoc-aws
sidebar_key: deploy-byoc-aws
sidebar_label: "AWS で BYOC をデプロイ"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud コンソールとカスタム AWS 設定を使用して、お客様の AWS Virtual Private Cloud (VPC) に完全に管理された Bring-Your-Own-Cloud (BYOC) データプレーンを手動で作成する方法について説明します。 | BYOC"
type: origin
token: DsqzwjegpiYSdtk1k75c1zXsnZc
sidebar_position: 3
keywords: 
  - zilliz
  - byoc
  - aws
  - milvus
  - ベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# AWS 上に BYOC をデプロイ

このページでは、Zilliz Cloud コンソールとカスタム AWS 設定を使用して、AWS Virtual プライベート Cloud (VPC) 内に完全に管理された Bring-Your-Own-Cloud (BYOC) データプレーンを手動で作成する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

- Zilliz BYOC は現在 **一般 Availability** で提供されています。アクセスと実装の詳細については、[Zilliz Cloud 営業](https://zilliz.com/contact-sales)までお問い合わせください。

- このガイドでは、AWS コンソール上で必要なリソースを段階的に作成する方法を示します。Terraform スクリプトを使用してインフラストラクチャをプロビジョニングする場合は、[Terraform Provider](./terraform-provider) を参照してください。

</Admonition>

## 前提条件\{#prerequisites}

- BYOC 組織オーナーである必要があります。

## 手順\{#procedure}

AWS 上に BYOC をデプロイするには、Zilliz Cloud がお客様に代わってカスタマー管理 VPC 内の S3 バケットと EKS クラスターにアクセスするために、特定のロールを引き受ける必要があります。その結果、Zilliz Cloud はこれらのインフラストラクチャリソースにアクセスするために必要なロールとともに、S3 バケット、EKS クラスター、VPC に関する情報を収集する必要があります。

BYOC 組織内で、**Create Project and Deploy データプレーン** ボタンをクリックしてデプロイを開始します。

![XtlJbBTIboHNbixzfqpc7H3nnvb](https://zdoc-images.s3.us-west-2.amazonaws.com/xtljbbtibohnbixzfqpc7h3nnvb.png "XtlJbBTIboHNbixzfqpc7H3nnvb")

### ステップ 1: プロジェクトを作成する\{#step-1-create-a-project}

このステップでは、プロジェクト名の設定、クラウドプロバイダーとリージョンおよび初期プロジェクトサイズの決定、Zilliz Cloud がプロジェクトを作成してデータプレーンをデプロイする方法の選択を行う必要があります。

![Jo6Rw1WoBhBchRbBOMmcRBC3nsd](https://zdoc-images.s3.us-west-2.amazonaws.com/Jo6Rw1WoBhBchRbBOMmcRBC3nsd.png)

<Procedures>

1. **プロジェクト名** を設定します。

1. **クラウドプロバイダー** と **Region** を選択します。

1. **AWS プライベートLink** を有効にするかどうかを決定します。

    このオプションにより、現在のプロジェクト内のクラスターへのプライベート接続が可能になります。このオプションを有効にする場合は、プライベート接続用の VPC エンドポイントを作成する必要があります。詳細については、[クラスター接続の準備](./prepare-for-cluster-connection#private-endpoint-access) を参照してください。

1. **Architecture** で、アプリケーションに合ったアーキテクチャタイプを選択します。

    これにより、使用する Zilliz BYOC イメージのアーキテクチャタイプが決定されます。利用可能なオプションは **X86** と **ARM** です。

1. **リソース設定** では、以下を行う必要があります。

    1. **オートスケーリング** を有効または無効にして、Zilliz Cloud がプロジェクトのワークロードに基づいて定義された範囲内で EC2 インスタンスの数を自動的に調整できるようにし、効率的なリソース使用を確保します。

    1. **初期プロジェクトサイズ** を構成します。

        BYOC プロジェクトでは、クエリノード、階層クエリノード、インデックスサービス、Milvus コンポーネント、および依存関係が異なるタイプの EC2 インスタンスを使用します。これらのサービスとコンポーネントのインスタンスタイプと数を個別に設定できます。

        **オートスケーリング** が無効の場合は、各プロジェクトコンポーネントに必要な EC2 インスタンスの数を対応する **Count** フィールドで指定するだけです。

        ![MliHb3dF5oJYGPxvhpfcLT1vnfd](https://zdoc-images.s3.us-west-2.amazonaws.com/mlihb3df5ojygpxvhpfclt1vnfd.png "MliHb3dF5oJYGPxvhpfcLT1vnfd")

        **オートスケーリング** が有効になると、対応する **Min** フィールドと **Max** フィールドを設定することで、実際のプロジェクトワークロードに基づいて Zilliz Cloud が EC2 インスタンスの数を自動的にスケーリングする範囲を指定する必要があります。

        ![QQ4Gb1IyiowJPQxCViGcMb8pnHb](https://zdoc-images.s3.us-west-2.amazonaws.com/qq4gb1iyiowjpqxcvigcmb8pnhb.png "QQ4Gb1IyiowJPQxCViGcMb8pnHb")

        リソース設定を容易にするために、4 つの定義済みプロジェクトサイズオプションがあります。次の表は、これらのプロジェクトサイズオプションとプロジェクト内に作成できるクラスターの数、およびこれらのクラスターが含めることができるエンティティの数との対応関係を示しています。

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
             <td><p>8 ～ 16 CU のクラスター 3 つ</p></td>
             <td><p>1,000 万 ～ 2,500 万</p></td>
             <td><p>4,000 万 ～ 8,000 万</p></td>
           </tr>
           <tr>
             <td><p>中</p></td>
             <td><p>16 ～ 64 CU のクラスター 7 つ</p></td>
             <td><p>2,500 万 ～ 1 億</p></td>
             <td><p>8,000 万 ～ 3.5 億</p></td>
           </tr>
           <tr>
             <td><p>大</p></td>
             <td><p>64 ～ 192 CU のクラスター 12 つ</p></td>
             <td><p>1 億 ～ 3 億</p></td>
             <td><p>3.5 億 ～ 10 億</p></td>
           </tr>
           <tr>
             <td><p>特大</p></td>
             <td><p>192 ～ 576 CU のクラスター 17 つ</p></td>
             <td><p>3 億 ～ 9 億</p></td>
             <td><p>10 億 ～ 30 億</p></td>
           </tr>
        </table>

        **初期プロジェクトサイズ** で **Custom** を選択し、すべてのデータプレーンコンポーネントの EC2 インスタンスタイプと数を調整することで、設定をカスタマイズすることもできます。希望する EC2 インスタンスタイプがリストにない場合は、さらなるサポートのために [Zilliz サポートにお問い合わせ](https://zilliz.com/contact) ください。

    1. **Tiered Query Node** を有効にするかどうかを決定します。

        このオプションにより、階層ストレージクラスターを作成できるかどうかが決まります。このオプションを選択すると、階層クエリノードのインスタンスタイプと数を設定できます。

        ![LWMFbm73GoM8mFxjajCcaGqPnMO](https://zdoc-images.s3.us-west-2.amazonaws.com/lwmfbm73gom8mfxjajccagqpnmo.png "LWMFbm73GoM8mFxjajCcaGqPnMO")

        <Admonition type="info" icon="📘" title="Notes">

        - **Project Size** での選択は、**Tiered Storage Node** の設定に影響しません。

        - **オートスケーリング** が無効の場合、**Default Query Node** の数と **Tiered Query Node** の数の合計は正の整数である必要があります。

        - **オートスケーリング** が有効の場合、**Default Query Node** と **Tiered Query Node** の両方の **Min** 値の合計は正の整数である必要があります。

        </Admonition>

1. **Deploy 方法** で、Zilliz Cloud がタスクを実行する方法を選択します。

    AWS 上の BYOC プロジェクト用のインフラストラクチャをプロビジョニングするためのオプションは 3 つあります。

    - **AWS CloudFormation を使用してインフラストラクチャをプロビジョニングする。**

        AWS CloudFormation を使用してプロジェクトのデータプレーンインフラストラクチャをプロビジョニングする場合は、**Deploy 方法** セクションで **クイックスタート** タイルを選択します。これは、BYOC プロジェクトを開始するための推奨方法でもあります。

        AWS CloudFormation を使用することを決定した場合、**Next** をクリックすると、プロジェクトを新しい VPC にデプロイするか既存の VPC にデプロイするかを選択するための次のダイアログボックスが表示されます。

        ![EWCsb9An2oM6dkxjCuOcM5hRnCe](https://zdoc-images.s3.us-west-2.amazonaws.com/ewcsb9an2om6dkxjcuocm5hrnce.png "EWCsb9An2oM6dkxjCuOcM5hRnCe")

        次に、**Create Stack with CloudFormation** をクリックしてプロジェクトのデプロイを開始できます。

    - **Terraform スクリプトを使用してインフラストラクチャをプロビジョニングする。**

        Terraform スクリプトを使用してインフラストラクチャをプロビジョニングする場合は、スクリプトの出力を Zilliz Cloud にコピーして貼り付ける必要があります。詳細については、[Terraform Provider](./terraform-provider) を参照してください。

        [認証情報設定](./deploy-byoc-aws#step-2-set-up-credentials) および [ネットワーク設定](./deploy-byoc-aws#step-3-configure-network-settings) で指定されているように、Terraform スクリプトから返された情報を Zilliz Cloud コンソールに入力する必要があることに注意してください。

    - **AWS コンソールを使用して**、**必要なリソースとロールを作成する。**

        AWS コンソール上で、ストレージバケットやいくつかの IAM ロールなどの必要なリソースを作成する必要があります。次に、それらの名前と ID を Zilliz Cloud コンソールにコピーして貼り付けます。この方法でプロジェクトを作成することを希望する場合は、**Deploy 方法** セクションで **手動で** タイルを選択し、**Next** をクリックします。

        Zilliz Cloud は、設定を容易にするために、このプロセスを [認証情報設定](./deploy-byoc-aws#step-2-set-up-credentials) と [ネットワーク設定](./deploy-byoc-aws#step-3-configure-network-settings) に分割しています。

1. 認証情報を設定するために **Next** をクリックします。

</Procedures>

### ステップ 2: 認証情報を設定する\{#step-2-set-up-credentials}

**認証情報設定** では、ストレージアクセス、EKS クラスター管理、およびデータプレーンデプロイメント用のいくつかの IAM ロールを設定する必要があります。

![LEGhbUbZwoPdwSx1PjxcHBjQnab](https://zdoc-images.s3.us-west-2.amazonaws.com/leghbubzwopdwsx1pjxchbjqnab.png "LEGhbUbZwoPdwSx1PjxcHBjQnab")

<Procedures>

1. **ストレージ設定** で、AWS から取得した **バケット名** と **IAM ロール ARN** を設定します。

    Zilliz Cloud は、指定されたバケットをデータプレーンストレージとして使用し、指定された IAM ロールを使用してお客様に代わってアクセスします。

     S3 バケットの作成手順の詳細については、[S3 バケットと IAM ロールの作成](./create-bucket-and-role) をお読みください。

1. **EKS設定** で、EKS 管理用の **IAM ロール ARN** を設定します。

    Zilliz Cloud は、指定されたロールを使用してお客様に代わって EKS クラスターをデプロイし、EKS クラスター内にデータプレーンをデプロイします。

    EKS ロールの作成手順の詳細については、[EKS IAM ロールの作成](./create-eks-role) をお読みください。

1. **クロスアカウント設定** で、データプレーンデプロイメント用の **IAM ロール ARN** を設定します。

    ダイアログボックスに表示される **外部ID** をコピーする必要があります。Zilliz Cloud は、指定されたロールを使用して Zilliz Cloud BYOC プロジェクトのデータプレーンをデプロイします。

    クロスアカウントロールの作成手順の詳細については、[クロスアカウント IAM ロールの作成](./create-cross-account-role) をお読みください。

1. ネットワーク設定を構成するために **Next** をクリックします。

</Procedures>

### ステップ 3: ネットワーク設定を構成する\{#step-3-configure-network-settings}

**ネットワーク設定** で、VPC を作成し、VPC 内にサブネット、セキュリティグループ、およびオプションの VPC エンドポイントなど、いくつかのタイプのリソースを作成します。

![NeKmbmKVhoNWcOx18IjcC1eLnDb](https://zdoc-images.s3.us-west-2.amazonaws.com/nekmbmkvhonwcox18ijcc1elndb.png "NeKmbmKVhoNWcOx18IjcC1eLnDb")

<Procedures>

1. **ネットワーク設定** で、**VPC ID**、**サブネットID**、**セキュリティグループID**、およびオプションの **VPCエンドポイントID** を設定します。

    指定された VPC で、Zilliz Cloud は以下を必要とします。

    - パブリックサブネット 1 つとプライベートサブネット 3 つ。

    - セキュリティグループ 1 つ、および

    - オプションの VPC エンドポイント。

    **VPC エンドポイントID** は、上記の **一般設定** で **AWS プライベートLink** をオンにした場合にのみ利用可能であることに注意してください。VPC とその関連リソースの作成手順の詳細については、[カスタマー管理 VPC の構成](./configure-vpc) を参照してください。

1. 概要を表示するために **Next** をクリックします。

1. **デプロイ概要** で、構成設定を確認します。

1. すべてが期待どおりであれば、**Create** をクリックします。

</Procedures>

## デプロイ詳細を表示する\{#view-deployment-details}

プロジェクトを作成した後、プロジェクトページでそのステータスを確認できます。

![Bw2Xb6wIKoXWAuxU4jOcDdAnn2e](https://zdoc-images.s3.us-west-2.amazonaws.com/bw2xb6wikoxwauxu4jocddann2e.png "Bw2Xb6wIKoXWAuxU4jOcDdAnn2e")

プロジェクトのデータプレーンをデプロイし、クラスターを作成した後、これらのクラスターには直接 VPC アクセスまたは AWS プライベートLink 経由で接続できます。詳細については、[BYOC クラスターへの接続](./prepare-for-cluster-connection) を参照してください。

## 一時停止と再開\{#suspend-and-resume}

プロジェクトを一時停止すると、データプレーンが停止し、プロジェクトをサポートする EKS クラスターに関連付けられたすべての EC2 インスタンスが終了します。この操作は、プロジェクト内の一時停止された Zilliz Cloud クラスターに影響を与えず、データプレーンが復元されると再開できます。

![BN8KbqawgoErlZxtNYFcEvrjne4](https://zdoc-images.s3.us-west-2.amazonaws.com/bn8kbqawgoerlzxtnyfcevrjne4.png "BN8KbqawgoErlZxtNYFcEvrjne4")

プロジェクト内にクラスターがないか、すべてのクラスターがすでに一時停止されている場合にのみ、実行中のプロジェクトを一時停止できます。

![QXK1bRewYoasCzx1AHNcpbSBnhe](https://zdoc-images.s3.us-west-2.amazonaws.com/qxk1brewyoasczx1ahncpbsbnhe.png "QXK1bRewYoasCzx1AHNcpbSBnhe")

プロジェクトカードのステータスタグが **一時停止ed** と表示されると、プロジェクト内のクラスターを操作できなくなります。この場合、**Resume** をクリックしてプロジェクトを再開できます。ステータスタグが再び **Running** に変わると、プロジェクト内のクラスターの操作を続行できます。

## テクニカルサポートアクセス\{#technical-support-access}

トラブルシューティングとメンテナンス操作を支援するために、Zilliz Cloud はデフォルトでテクニカルサポートがプロジェクトのデータプレーンにアクセスできるようにしています。

![K1qzbwdxXoge0exlN6NcClN7nfh](https://zdoc-images.s3.us-west-2.amazonaws.com/k1qzbwdxxoge0exln6nccln7nfh.png "K1qzbwdxXoge0exlN6NcClN7nfh")

対象プロジェクトのドロップダウンメニューから **テクニカルサポートアクセス** をクリックして、現在の設定を表示します。

![YYOabQl2ioTl6AxIVLwcwjWqnBc](https://zdoc-images.s3.us-west-2.amazonaws.com/yyoabql2iotl6axivlwcwjwqnbc.png "YYOabQl2ioTl6AxIVLwcwjWqnBc")

データガバナンスとセキュリティ要件を満たすために、これを無効にすることができます。

## 手順\{#procedures}



import DocCardList from '@theme/DocCardList';

<DocCardList />