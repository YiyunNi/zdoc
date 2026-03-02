---
title: "AWS に BYOC をデプロイ | BYOC"
slug: /deploy-byoc-aws
sidebar_label: "AWS に BYOC をデプロイ"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud コンソールとカスタム AWS 設定を使用して、AWS Virtual Private Cloud (VPC) にフルマネージドの Bring-Your-Own-Cloud (BYOC) データプレーンを手動で作成する方法について説明します。 | BYOC"
type: origin
token: DsqzwjegpiYSdtk1k75c1zXsnZc
sidebar_position: 3
keywords: 
  - zilliz
  - byoc
  - aws
  - milvus
  - ベクトルデータベース
  - 動画の重複排除
  - 動画の類似性検索
  - ベクトル検索
  - 音声の類似性検索

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# AWS上でのBYOCのデプロイ

このページでは、Zilliz CloudコンソールとカスタムAWS設定を使用して、AWS Virtual Private Cloud (VPC)内に完全に管理されたBring-Your-Own-Cloud (BYOC)データプレーンを手動で作成する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>Zilliz BYOCは現在、**一般提供**されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloudの営業担当者</a>にお問い合わせください。</p></li>
<li><p>このガイドでは、AWSコンソールで必要なリソースを段階的に作成する方法を説明します。Terraformスクリプトを使用してインフラストラクチャをプロビジョニングする場合は、<a href="./terraform-provider">Terraform Provider</a>を参照してください。</p></li>
</ul>

</Admonition>

## 前提条件{#prerequisites}

- BYOC組織の所有者である必要があります。

## 手順{#procedure}

AWSにBYOCをデプロイするために、Zilliz Cloudは、お客様が管理するVPC内のS3バケットとEKSクラスターにアクセスするために特定のロールを引き受ける必要があります。したがって、Zilliz Cloudは、S3バケット、EKSクラスター、VPCに関する情報、およびこれらのインフラストラクチャリソースにアクセスするために必要なロールを収集する必要があります。

BYOC組織内で、**Create Project and Deploy Data Plane**ボタンをクリックしてデプロイを開始します。

![XtlJbBTIboHNbixzfqpc7H3nnvb](https://zdoc-images.s3.us-west-2.amazonaws.com/xtljbbtibohnbixzfqpc7h3nnvb.png "XtlJbBTIboHNbixzfqpc7H3nnvb")

### ステップ1：プロジェクトの作成{#step-1-create-a-project}

このステップでは、プロジェクト名を設定し、クラウドプロバイダーとリージョン、初期プロジェクトサイズを決定し、Zilliz Cloudがプロジェクトを作成してデータプレーンをデプロイする方法を選択する必要があります。

![ObsWbiWhxo4IQHx7pPacHUl2nuh](https://zdoc-images.s3.us-west-2.amazonaws.com/obswbiwhxo4iqhx7ppachul2nuh.png "ObsWbiWhxo4IQHx7pPacHUl2nuh")

<Procedures>

1. **Project Name**を設定します。

1. **Cloud Provider**と**Region**を選択します。

1. **AWS PrivateLink**を有効にするかどうかを決定します。

    このオプションは、現在のプロジェクト内のクラスターへのプライベート接続を可能にします。このオプションを有効にする場合は、プライベート接続のためにVPCエンドポイントを作成する必要があります。

1. **Architecture**で、アプリケーションに合ったアーキテクチャタイプを選択します。

    これは、使用するZilliz BYOCイメージのアーキテクチャタイプを決定します。利用可能なオプションは**X86**と**ARM**です。

1. **Resource Settings**で、次の操作を行う必要があります。

    1. **Auto-scaling**を有効または無効にして、Zilliz Cloudがプロジェクトのワークロードに基づいて定義された範囲内でEC2インスタンスの数を自動的に調整し、効率的なリソース使用を確保できるようにします。

    1. **Initial Project Size**を設定します。

        BYOCプロジェクトでは、クエリノード、インデックスサービス、Milvusコンポーネント、および依存関係は異なる種類のEC2インスタンスを使用します。これらのサービスとコンポーネントのインスタンスタイプと数を個別に設定できます。

        **Auto-scaling**が無効になっている場合は、対応する**Count**フィールドに各プロジェクトコンポーネントに必要なEC2インスタンスの数を指定するだけです。

        ![V1r0b6PDzokWRqxaA4ccrTs2nEd](https://zdoc-images.s3.us-west-2.amazonaws.com/v1r0b6pdzokwrqxaa4ccrts2ned.png "V1r0b6PDzokWRqxaA4ccrTs2nEd")

        **Auto-scaling**が有効になっている場合は、対応する**Min**および**Max**フィールドを設定して、Zilliz Cloudが実際のプロジェクトワークロードに基づいてEC2インスタンスの数を自動的にスケーリングする範囲を指定する必要があります。

        ![XYW9bj1qfoKEXMx9L4DchlE7nHh](https://zdoc-images.s3.us-west-2.amazonaws.com/xyw9bj1qfokexmx9l4dchle7nhh.png "XYW9bj1qfoKEXMx9L4DchlE7nHh")

        リソース設定を容易にするために、4つの事前定義されたプロジェクトサイズオプションがあります。次の表は、これらのプロジェクトサイズオプションと、プロジェクトで作成できるクラスターの数、およびこれらのクラスターが含むことができるエンティティの数のマッピングを示しています。

        <table>
           <tr>
             <th rowspan="2"><p>サイズ</p></th>
             <th rowspan="2"><p>最大クラスター数</p></th>
             <th colspan="2"><p>最大エンティティ数（百万）</p></th>
           </tr>
           <tr>
             <td><p>パフォーマンス最適化CU</p></td>
             <td><p>容量最適化CU</p></td>
           </tr>
           <tr>
             <td><p>小</p></td>
             <td><p>8〜16 CUの3クラスター</p></td>
             <td><p>1000万〜2500万</p></td>
             <td><p>4000万〜8000万</p></td>
           </tr>
           <tr>
             <td><p>中</p></td>
             <td><p>16〜64 CUの7クラスター</p></td>
             <td><p>2500万〜1億</p></td>
             <td><p>8000万〜3億5000万</p></td>
           </tr>
           <tr>
             <td><p>大</p></td>
             <td><p>64〜192 CUの12クラスター</p></td>
             <td><p>1億〜3億</p></td>
             <td><p>3億5000万〜10億</p></td>
           </tr>
           <tr>
             <td><p>特大</p></td>
             <td><p>192〜576 CUの17クラスター</p></td>
             <td><p>3億〜9億</p></td>
             <td><p>10億〜30億</p></td>
           </tr>
        </table>

        **Initial Project Size**で**Custom**を選択し、すべてのデータプレーンコンポーネントのEC2インスタンスタイプと数を調整することで、設定をカスタマイズすることもできます。ご希望のEC2インスタンスタイプがリストにない場合は、[Zillizサポートにお問い合わせください](https://zilliz.com/contact)。

1. **Deploy Method**で、Zilliz Cloudがタスクを実行する方法を選択します。

    AWSでBYOCプロジェクトのインフラストラクチャをプロビジョニングするには、3つのオプションがあります。次のいずれかを選択できます。

    - **AWS CloudFormationを使用してインフラストラクチャをプロビジョニングします。**

        AWS CloudFormationを使用してプロジェクトのデータプレーンインフラストラクチャをプロビジョニングする場合は、**Deploy Method**セクションで**Quickstart**タイルを選択します。これは、BYOCプロジェクトを開始するための推奨される方法でもあります。

        AWS CloudFormationを使用することを決定した場合は、**Next**をクリックすると、プロジェクトを新しいVPCにデプロイするか、既存のVPCにデプロイするかを選択する次のダイアログボックスが表示されます。

        ![EWCsb9An2oM6dkxjCuOcM5hRnCe](https://zdoc-images.s3.us-west-2.amazonaws.com/ewcsb9an2om6dkxjcuocm5hrnce.png "EWCsb9An2oM6dkxjCuOcM5hRnCe")

        次に、**Create Stack with CloudFormation**をクリックしてプロジェクトのデプロイを開始できます。

    - **Terraformスクリプトを使用してインフラストラクチャをプロビジョニングします。**

        Terraformスクリプトを使用してインフラストラクチャをプロビジョニングする場合は、スクリプトの出力をZilliz Cloudにコピーして貼り付ける必要があります。詳細については、[Terraform Provider](./terraform-provider)を参照してください。

        Terraformスクリプトによって返された情報を、[Credential Settings](./deploy-byoc-aws#step-2-set-up-credentials)および[Network Settings](./deploy-byoc-aws#step-3-configure-network-settings)で指定されているように、Zilliz Cloudコンソールに入力する必要があることに注意してください。

    - **AWSコンソールを使用して必要なリソースとロールを作成します。**

        ストレージバケットやいくつかのIAMロールなどの必要なリソースをAWSコンソールで作成する必要があります。次に、それらの名前とIDをZilliz Cloudコンソールにコピーして貼り付けます。この方法でプロジェクトを作成する場合は、**Deploy Method**セクションで**Manually**タイルを選択し、**Next**をクリックします。

        Zilliz Cloudは、設定を容易にするためにプロセスを[Credential Settings](./deploy-byoc-aws#step-2-set-up-credentials)と[Network Settings](./deploy-byoc-aws#step-3-configure-network-settings)に分割します。

1. **Next**をクリックして認証情報を設定します。

</Procedures>

### ステップ2：認証情報の設定{#step-2-set-up-credentials}

**Credential Settings**では、ストレージアクセス、EKSクラスター管理、データプレーンデプロイのためのストレージといくつかのIAMロールを設定する必要があります。

![LEGhbUbZwoPdwSx1PjxcHBjQnab](https://zdoc-images.s3.us-west-2.amazonaws.com/leghbubzwopdwsx1pjxchbjqnab.png "LEGhbUbZwoPdwSx1PjxcHBjQnab")

<Procedures>

1. **Storage settings**で、AWSから取得した**Bucket Name**と**IAM Role ARN**を設定します。

    Zilliz Cloudは、指定されたバケットをデータプレーンストレージとして使用し、指定されたIAMロールを使用してアクセスします。

    S3バケットの作成手順の詳細については、[S3バケットとIAMロールの作成](./create-bucket-and-role)を参照してください。

1. **EKS Settings**で、EKS管理用の**IAM Role ARN**を設定します。

    Zilliz Cloudは、指定されたロールを使用してEKSクラスターをデプロイし、EKSクラスターにデータプレーンをデプロイします。

    EKSロールの作成手順の詳細については、[EKS IAMロールの作成](./create-eks-role)を参照してください。

1. **Cross-Account Settings**で、データプレーンデプロイ用の**IAM Role ARN**を設定します。

    ダイアログボックスに表示される**External ID**をコピーする必要があります。Zilliz Cloudは、指定されたロールを使用してZilliz Cloud BYOCプロジェクトのデータプレーンをデプロイします。

    クロスアカウントロールの作成手順の詳細については、[クロスアカウントIAMロールの作成](./create-cross-account-role)を参照してください。

1. **Next**をクリックしてネットワーク設定を構成します。

</Procedures>

### ステップ3：ネットワーク設定の構成{#step-3-configure-network-settings}

**Network Settings**では、VPC内にVPCと、サブネット、セキュリティグループ、オプションのVPCエンドポイントなどのいくつかの種類のリソースを作成します。

![NeKmbmKVhoNWcOx18IjcC1eLnDb](https://zdoc-images.s3.us-west-2.amazonaws.com/nekmbmkvhonwcox18ijcc1elndb.png "NeKmbmKVhoNWcOx18IjcC1eLnDb")

<Procedures>

1. **Network Settings**で、**VPC ID**、**Subnet IDs**、**Security Group ID**、およびオプションの**VPC endpoint ID**を設定します。

    指定されたVPCでは、Zilliz Cloudは次のものを必要とします。

    - パブリックサブネットと3つのプライベートサブネット。

    - セキュリティグループ、および

    - オプションのVPCエンドポイント。

    **VPC Endpoint ID**は、上記の**General Settings**で**AWS PrivateLink**をオンにした場合にのみ利用可能であることに注意してください。VPCとその関連リソースの作成手順の詳細については、[顧客管理VPCの構成](./configure-vpc)を参照してください。

1. **Next**をクリックして概要を表示します。

1. **Deployment Summary**で、構成設定を確認します。

1. すべてが期待どおりであれば、**Create**をクリックします。

</Procedures>

## デプロイの詳細を表示{#view-deployment-details}

プロジェクトを作成した後、プロジェクトページでそのステータスを表示できます。

![Bw2Xb6wIKoXWAuxU4jOcDdAnn2e](https://zdoc-images.s3.us-west-2.amazonaws.com/bw2xb6wikoxwauxu4jocddann2e.png "Bw2Xb6wIKoXWAuxU4jOcDdAnn2e")

## 一時停止と再開{#suspend-and-resume}

プロジェクトを一時停止すると、データプレーンが停止し、プロジェクトをサポートするEKSクラスターに関連付けられたすべてのEC2インスタンスが終了します。このアクションは、プロジェクト内の一時停止されたZilliz Cloudクラスターには影響しません。データプレーンが復元されると、これらのクラスターは再開できます。

![BN8KbqawgoErlZxtNYFcEvrjne4](https://zdoc-images.s3.us-west-2.amazonaws.com/bn8kbqawgoerlzxtnyfcevrjne4.png "BN8KbqawgoErlZxtNYFcEvrjne4")

プロジェクト内にクラスターがない場合、またはすべてのクラスターがすでに一時停止されている場合にのみ、実行中のプロジェクトを一時停止できます。

![QXK1bRewYoasCzx1AHNcpbSBnhe](https://zdoc-images.s3.us-west-2.amazonaws.com/qxk1brewyoasczx1ahncpbsbnhe.png "QXK1bRewYoasCzx1AHNcpbSBnhe")

プロジェクトカードのステータスタグが**Suspended**と表示されている場合、プロジェクト内のクラスターを操作することはできません。そのような場合は、**Resume**をクリックしてプロジェクトを再開できます。ステータスタグが再び**Running**に変わると、プロジェクト内のクラスターの操作を続行できます。

## テクニカルサポートアクセス{#technical-support-access}

トラブルシューティングとメンテナンス操作を支援するために、Zilliz Cloudはデフォルトでテクニカルサポートがプロジェクトのデータプレーンにアクセスできるようにします。

![K1qzbwdxXoge0exlN6NcClN7nfh](https://zdoc-images.s3.us-west-2.amazonaws.com/k1qzbwdxxoge0exln6nccln7nfh.png "K1qzbwdxXoge0exlN6NcClN7nfh")

対象プロジェクトのドロップダウンメニューから**Technical Support Access**をクリックすると、現在の設定が表示されます。

![YYOabQl2ioTl6AxIVLwcwjWqnBc](https://zdoc-images.s3.us-west-2.amazonaws.com/yyoabql2iotl6axivlwcwjwqnbc.png "YYOabQl2ioTl6AxIVLwcwjWqnBc")

データガバナンスとセキュリティ要件を満たすために無効にすることができます。

## 手順{#procedures}



import DocCardList from '@theme/DocCardList';

<DocCardList />