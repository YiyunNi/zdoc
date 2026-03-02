---
title: "GCP で BYOC をデプロイ | BYOC"
slug: /deploy-byoc-gcp
sidebar_label: "GCP で BYOC をデプロイ"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud コンソールとカスタム GCP 構成を使用して、Google Cloud Platform (GCP) Virtual Private Cloud (VPC) にフルマネージドの Bring-Your-Own-Cloud (BYOC) データプレーンを手動で作成する方法について説明します。 | BYOC"
type: origin
token: KmYgwHNOFiPQ9sk4bSDcMuIHnjC
sidebar_position: 5
keywords: 
  - zilliz
  - byoc
  - byoc-i
  - gcp
  - 権限
  - 最小権限
  - milvus
  - ベクターデータベース
  - オープンソース ベクターデータベース
  - ベクターインデックス
  - ベクターデータベース オープンソース
  - オープンソース ベクター DB

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# GCPへのBYOCのデプロイ

このページでは、Zilliz CloudコンソールとカスタムGCP構成を使用して、Google Cloud Platform（GCP）Virtual Private Cloud（VPC）に完全に管理されたBring-Your-Own-Cloud（BYOC）データプレーンを手動で作成する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>Zilliz BYOCは現在、<strong>一般提供</strong>されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloudの営業担当者</a>にお問い合わせください。</p></li>
<li><p>このガイドでは、AWSコンソールで必要なリソースを段階的に作成する方法を説明します。Terraformスクリプトを使用してインフラストラクチャをプロビジョニングする場合は、<a href="./terraform-provider">Terraform Provider</a>を参照してください。</p></li>
</ul>

</Admonition>

## 前提条件{#prerequisites}

- BYOC組織のオーナーである必要があります。

- [必要なGCP APIサービス](./required-api-services-gcp)を有効にしている必要があります。

## 手順{#procedure}

GCPにBYOCをデプロイするために、Zilliz Cloudは、お客様に代わってCloud Storageバケットとお客様が管理するVPC内のGKEクラスターにアクセスするために特定のロールを引き受ける必要があります。したがって、Zilliz Cloudは、Cloud Storageバケット、GKEクラスター、VPCに関する情報、およびこれらのインフラストラクチャリソースにアクセスするために必要なロールを収集する必要があります。

BYOC組織内で、**Create Project and Deploy Data Plane**ボタンをクリックしてデプロイを開始します。

![Cl50bi7eVoxSoHxk4jrcclh6n5O](https://zdoc-images.s3.us-west-2.amazonaws.com/cl50bi7evoxsohxk4jrcclh6n5o.png "Cl50bi7eVoxSoHxk4jrcclh6n5O")

### ステップ1：プロジェクトの作成{#step-1-create-a-project}

このステップでは、Zilliz BYOCプロジェクト名を設定し、クラウドプロバイダーとリージョン、およびデプロイの初期プロジェクトサイズを決定する必要があります。

![A8VVbPbJgobXzzxEdumcpxJ4nMg](https://zdoc-images.s3.us-west-2.amazonaws.com/a8vvbpbjgobxzzxedumcpxj4nmg.png "A8VVbPbJgobXzzxEdumcpxJ4nMg")

<Procedures>

1. **Zilliz BYOC Project Name**を設定します。

1. **Cloud Provider**と**Cloud Region**を選択します。

1. **GCP Private Service Connect**を有効にするかどうかを決定します。

    このオプションを使用すると、現在のプロジェクト内のクラスターへのプライベート接続が可能になります。このオプションを有効にする場合は、プライベート接続のためにPrivate Service Connectエンドポイントを作成する必要があります。

1. **Architecture**で、アプリケーションに合ったアーキテクチャタイプを選択します。

    これにより、使用するZilliz BYOCイメージのアーキテクチャタイプが決まります。利用可能なオプションは**X86**と**ARM**です。

1. **Resource Settings**で、次の操作を行う必要があります。

    1. **Auto-scaling**を有効または無効にして、Zilliz Cloudがプロジェクトのワークロードに基づいて定義された範囲内でEC2インスタンスの数を自動的に調整し、効率的なリソース使用を確保できるようにします。

    1. **Initial Project Size**を設定します。

        BYOCプロジェクトでは、クエリノード、インデックスサービス、Milvusコンポーネント、および依存関係は異なるGoogle Compute Engine（GCE）インスタンスを使用します。これらのサービスとコンポーネントのインスタンスタイプを設定できます。

        **Auto-scaling**が無効になっている場合は、対応する**Count**フィールドに各プロジェクトコンポーネントに必要なGCEインスタンスの数を指定するだけです。

        ![CxACbbwtYo2dMNxG33qcMIyinBe](https://zdoc-images.s3.us-west-2.amazonaws.com/cxacbbwtyo2dmnxg33qcmiyinbe.png "CxACbbwtYo2dMNxG33qcMIyinBe")

        **Auto-scaling**が有効になっている場合は、Zilliz Cloudが実際のプロジェクトワークロードに基づいてGCEインスタンスの数を自動的にスケーリングするための範囲を、対応する**Min**フィールドと**Max**フィールドを設定して指定する必要があります。

        ![QzCHbFIFRoyCUex6u8vcoEZMn6f](https://zilliz-images.s3.us-west-2.amazonaws.com/qzchbfifroycuex6u8vcoezmn6f.png "QzCHbFIFRoyCUex6u8vcoEZMn6f")

        リソース設定を容易にするために、4つの事前定義されたプロジェクトサイズオプションがあります。次の表は、これらのプロジェクトサイズオプションと、プロジェクトで作成できるクラスターの数、およびこれらのクラスターが格納できるエンティティの数のマッピングを示しています。

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
             <td><p>8～16 CUの3クラスター</p></td>
             <td><p>1000万～2500万</p></td>
             <td><p>4000万～8000万</p></td>
           </tr>
           <tr>
             <td><p>中</p></td>
             <td><p>16～64 CUの7クラスター</p></td>
             <td><p>2500万～1億</p></td>
             <td><p>8000万～3億5000万</p></td>
           </tr>
           <tr>
             <td><p>大</p></td>
             <td><p>64～192 CUの12クラスター</p></td>
             <td><p>1億～3億</p></td>
             <td><p>3億5000万～10億</p></td>
           </tr>
           <tr>
             <td><p>特大</p></td>
             <td><p>192～576 CUの17クラスター</p></td>
             <td><p>3億～9億</p></td>
             <td><p>10億～30億</p></td>
           </tr>
        </table>

        **Initial Project Size**で**Custom**を選択し、すべてのデータプレーンコンポーネントのGCEインスタンスタイプと数を調整することで、設定をカスタマイズすることもできます。ご希望のGCEインスタンスタイプがリストにない場合は、[Zillizサポート](https://zilliz.com/contact)にお問い合わせください。

1. **Next**をクリックして資格情報を設定します。

</Procedures>

### ステップ2：資格情報の設定{#step-2-set-up-credentials}

**Credential Settings**では、ストレージアクセス、GKEクラスター管理、データプレーンデプロイのために、ストレージといくつかのサービスアカウントを設定する必要があります。

![BbOOboWZAo5eu2xplJWcXyLonph](https://zdoc-images.s3.us-west-2.amazonaws.com/bboobowzao5eu2xpljwcxylonph.png "BbOOboWZAo5eu2xplJWcXyLonph")

<Procedures>

1. **Google Cloud Platform Project ID**に、GCPプロジェクトのIDを入力します。

1. **Storage settings**で、GCPから取得した**Bucket Name**と**Service Account Email**を設定します。

    Zilliz Cloudは、指定されたバケットをデータプレーンストレージとして使用し、指定されたサービスアカウントを使用してお客様に代わってアクセスします。

    バケットの設定とサービスアカウントの作成の詳細については、[Cloud Storageバケットとサービスアカウントの作成](./create-bucket-and-service-account)を参照してください。

1. **GKE Settings**で、GKE管理用の**GKE Cluster Name**と**Service Account Email**を設定します。

    Zilliz Cloudは、指定されたサービスアカウントを使用して、指定された名前のGKEクラスターをお客様に代わってデプロイし、GKEクラスターにデータプレーンをデプロイします。

    サービスアカウントの作成の詳細については、[GKEサービスアカウントの作成](./create-gke-service-account)を参照してください。

1. **Cross-Account Settings**で、データプレーンデプロイ用の**Service Account Name**を設定します。

    サービスアカウントの準備ができたら、以下の読み取り専用テキストボックスに表示されているZilliz BYOCプリンシパルをコピーし、GCPコンソールに貼り付けて、Zilliz BYOCにZilliz Cloud BYOCプロジェクトのデータプレーンをデプロイするために必要な権限を付与します。

    クロスアカウントサービスアカウントの作成の詳細については、[クロスアカウントサービスアカウントの作成](./create-cross-account-sa)を参照してください。

1. **Next**をクリックしてネットワーク設定を構成します。

</Procedures>

### ステップ3：ネットワーク設定の構成{#step-3-configure-network-settings}

**Network Settings**では、VPCと、サブネット名やオプションのPrivate Service ConnectエンドポイントなどのいくつかのタイプのリソースをVPC内に作成します。

![YVPNbLCjOoCkDTx9TEMcbV9LnPd](https://zdoc-images.s3.us-west-2.amazonaws.com/yvpnblcjoockdtx9temcbv9lnpd.png "YVPNbLCjOoCkDTx9TEMcbV9LnPd")

<Procedures>

1. **Network Settings**で、**VPC Name**、**Subnet Names**、およびオプションの**Private Service Connect Endpoint**を設定します。

    指定されたVPCでは、Zilliz Cloudは次のものを必要とします。

    - 2つのセカンダリサブネットを持つプライマリサブネット

    - ロードバランサーサブネット

    - オプションのPrivate Service Connectエンドポイント

    **Private Service Connect Endpoint**は、上記の**General Settings**で**GCP Private Service Connect**をオンにした場合にのみ利用可能です。

1. **Next**をクリックして概要を表示します。

1. **Deployment Summary**で、構成設定を確認します。

1. すべてが期待どおりであれば、**Create**をクリックします。

</Procedures>

## デプロイの詳細を表示{#view-deployment-details}

プロジェクトを作成した後、プロジェクトページでそのステータスを表示できます。

![BE13bnOpGo9ZAVxTx3acX2J8nEe](https://zdoc-images.s3.us-west-2.amazonaws.com/be13bnopgo9zavxtx3acx2j8nee.png "BE13bnOpGo9ZAVxTx3acX2J8nEe")

## 一時停止と再開{#suspend-and-resume}

プロジェクトを一時停止すると、データプレーンが停止し、プロジェクトをサポートするGKEクラスターに関連付けられているすべてのGCEインスタンスが終了します。このアクションは、プロジェクト内の一時停止されたZilliz Cloudクラスターには影響しません。データプレーンが復元されると、これらのクラスターは再開できます。

![YC2YbM9oyo6IcUxDQ5Bc3AzDnPc](https://zdoc-images.s3.us-west-2.amazonaws.com/yc2ybm9oyo6icuxdq5bc3azdnpc.png "YC2YbM9oyo6IcUxDQ5Bc3AzDnPc")

プロジェクト内にクラスターがない場合、またはすべてのクラスターがすでに一時停止されている場合にのみ、実行中のプロジェクトを一時停止できます。

![SVLQbgURIoRqHBx2tWwc5caWnx7](https://zdoc-images.s3.us-west-2.amazonaws.com/svlqbguriorqhbx2twwc5cawnx7.png "SVLQbgURIoRqHBx2tWwc5caWnx7")

プロジェクトカードのステータスタグが**Suspended**と表示されている場合、プロジェクト内のクラスターを操作することはできません。そのような場合は、**Resume**をクリックしてプロジェクトを再開できます。ステータスタグが再び**Running**に変わると、プロジェクト内のクラスターの操作を続行できます。

![EQKqbumOxoT1tVxw1ZRcZahXnDd](https://zdoc-images.s3.us-west-2.amazonaws.com/eqkqbumoxot1tvxw1zrczahxndd.png "EQKqbumOxoT1tVxw1ZRcZahXnDd")

## テクニカルサポートアクセス{#technical-support-access}

トラブルシューティングとメンテナンス作業を支援するために、Zilliz Cloudはデフォルトでテクニカルサポートがプロジェクトのデータプレーンにアクセスできるようにします。

![LxiUbIQCqoJf2Zx7pincPOCnnyf](https://zdoc-images.s3.us-west-2.amazonaws.com/lxiubiqcqojf2zx7pincpocnnyf.png "LxiUbIQCqoJf2Zx7pincPOCnnyf")

対象プロジェクトのドロップダウンメニューから**Technical Support Access**をクリックして、現在の設定を表示します。

![WbyNbPrfioPvmpxTe9ocowainnh](https://zdoc-images.s3.us-west-2.amazonaws.com/wbynbprfiopvmpxte9ocowainnh.png "WbyNbPrfioPvmpxTe9ocowainnh")

データガバナンスとセキュリティ要件を満たすために、これを無効にすることができます。

## 手順{#procedures}



import DocCardList from '@theme/DocCardList';

<DocCardList />