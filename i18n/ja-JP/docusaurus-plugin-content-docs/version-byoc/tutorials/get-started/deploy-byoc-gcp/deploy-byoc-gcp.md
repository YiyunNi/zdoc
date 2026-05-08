---
title: "GCP で BYOC をデプロイ | BYOC"
slug: /deploy-byoc-gcp
sidebar_key: deploy-byoc-gcp
sidebar_label: "GCP で BYOC をデプロイ"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud コンソールとカスタム GCP 構成を使用して、Google Cloud Platform（GCP）Virtual Private Cloud（VPC）内に完全に管理された Bring-Your-Own-Cloud（BYOC）データプレーンを手動で作成する方法について説明します。 | BYOC"
type: origin
token: KmYgwHNOFiPQ9sk4bSDcMuIHnjC
sidebar_position: 6
keywords: 
  - zilliz
  - byoc
  - byoc-i
  - gcp
  - 権限
  - 最小権限
  - milvus
  - ベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# GCP 上で BYOC をデプロイ

このページでは、Zilliz Cloud コンソールとカスタム GCP 構成を使用して、Google Cloud Platform (GCP) Virtual プライベート Cloud (VPC) 内に完全に管理された Bring-Your-Own-Cloud (BYOC) データプレーンを手動で作成する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

- Zilliz BYOC は現在 **一般提供** で利用可能です。アクセスと実装の詳細については、[Zilliz Cloud 営業](https://zilliz.com/contact-sales) までお問い合わせください。

- このガイドでは、AWS コンソールで必要なリソースを段階的に作成する方法を示します。Terraform スクリプトを使用してインフラストラクチャをプロビジョニングする場合は、[Terraform Provider](./terraform-provider) を参照してください。

</Admonition>

## 前提条件\{#prerequisites}

- BYOC 組織オーナーである必要があります。

- [必要な GCP API サービス](./required-api-services-gcp) を有効化している必要があります。

## 手順\{#procedure}

GCP 上で BYOC をデプロイするために、Zilliz Cloud はお客様が管理する VPC 内の Cloud Storage バケットと GKE クラスターにアクセスするための特定のロールを引き受ける必要があります。その結果、Zilliz Cloud はこれらのインフラストラクチャリソースにアクセスするために必要なロールとともに、Cloud Storage バケット、GKE クラスター、VPC に関する情報を収集する必要があります。

BYOC 組織内で、**プロジェクトの作成とデータプレーンのデプロイ** ボタンをクリックして、デプロイを開始します。

![Cl50bi7eVoxSoHxk4jrcclh6n5O](https://zdoc-images.s3.us-west-2.amazonaws.com/cl50bi7evoxsohxk4jrcclh6n5o.png "Cl50bi7eVoxSoHxk4jrcclh6n5O")

### ステップ 1: プロジェクトを作成する\{#step-1-create-a-project}

このステップでは、Zilliz BYOC プロジェクト名を設定し、クラウドプロバイダーとリージョン、およびデプロイの初期プロジェクトサイズを決定する必要があります。

![A8VVbPbJgobXzzxEdumcpxJ4nMg](https://zdoc-images.s3.us-west-2.amazonaws.com/a8vvbpbjgobxzzxedumcpxj4nmg.png "A8VVbPbJgobXzzxEdumcpxJ4nMg")

<Procedures>

1. **Zilliz BYOC プロジェクト名** を設定します。

1. **クラウドプロバイダー** と **クラウドリージョン** を選択します。

1. **GCP プライベート Service Connect** を有効化するかどうかを決定します。

    このオプションにより、現在のプロジェクト内のクラスターへのプライベート接続が可能になります。このオプションを有効にする場合は、プライベート接続のために プライベート Service Connect エンドポイントを作成する必要があります。詳細については、[クラスター接続の準備](./prepare-for-cluster-connection#private-endpoint-access) を参照してください。

1. **アーキテクチャ** で、アプリケーションに一致するアーキテクチャタイプを選択します。

    これにより、使用する Zilliz BYOC イメージのアーキテクチャタイプが決定されます。利用可能なオプションは **X86** と **ARM** です。

1. **リソース設定** では、以下を行う必要があります。

    1. **オートスケーリング** を有効化または無効化して、Zilliz Cloud がプロジェクトのワークロードに基づいて定義された範囲内で EC2 インスタンスの数を自動的に調整し、効率的なリソース使用を確保できるようにします。

    1. **初期プロジェクトサイズ** を構成します。

        BYOC プロジェクトでは、クエリノード、インデックスサービス、Milvus コンポーネント、および依存関係が異なる Google Compute Engine (GCE) インスタンスを使用します。これらのサービスとコンポーネントのインスタンスタイプを設定できます。

        **オートスケーリング** が無効の場合は、各プロジェクトコンポーネントに必要な GCE インスタンスの数を対応する **Count** フィールドに指定するだけです。

        ![CxACbbwtYo2dMNxG33qcMIyinBe](https://zdoc-images.s3.us-west-2.amazonaws.com/cxacbbwtyo2dmnxg33qcmiyinbe.png "CxACbbwtYo2dMNxG33qcMIyinBe")

        **オートスケーリング** が有効になると、対応する **Min** フィールドと **Max** フィールドを設定して、実際のプロジェクトワークロードに基づいて Zilliz Cloud が GCE インスタンスの数を自動的にスケーリングする範囲を指定する必要があります。

        ![QzCHbFIFRoyCUex6u8vcoEZMn6f](https://zdoc-images.s3.us-west-2.amazonaws.com/qzchbfifroycuex6u8vcoezmn6f.png "QzCHbFIFRoyCUex6u8vcoEZMn6f")

        リソース設定を容易にするために、4 つの定義済みプロジェクトサイズオプションがあります。次の表は、これらのプロジェクトサイズオプションとプロジェクト内で作成できるクラスターの数、およびこれらのクラスターが含めることができるエンティティの数の対応関係を示しています。

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
             <td><p>8,000 万 ～ 3.5 億</p></td>
           </tr>
           <tr>
             <td><p>大</p></td>
             <td><p>64 ～ 192 CU のクラスター 12 個</p></td>
             <td><p>1 億 ～ 3 億</p></td>
             <td><p>3.5 億 ～ 10 億</p></td>
           </tr>
           <tr>
             <td><p>特大</p></td>
             <td><p>192 ～ 576 CU のクラスター 17 個</p></td>
             <td><p>3 億 ～ 9 億</p></td>
             <td><p>10 億 ～ 30 億</p></td>
           </tr>
        </table>

        **初期プロジェクトサイズ** で **カスタム** を選択し、すべてのデータプレーンコンポーネントの GCE インスタンスタイプと数を調整して、設定をカスタマイズすることもできます。希望する GCE インスタンスタイプがリストにない場合は、さらなるサポートのために [Zilliz サポートにお問い合わせ](https://zilliz.com/contact) ください。

1. 認証情報を設定するには **次へ** をクリックします。

</Procedures>

### ステップ 2: 認証情報を設定する\{#step-2-set-up-credentials}

**認証情報設定** では、ストレージと、ストレージアクセス、GKE クラスター管理、およびデータプレーンデプロイメント用のいくつかのサービスアカウントを設定する必要があります。

![BbOOboWZAo5eu2xplJWcXyLonph](https://zdoc-images.s3.us-west-2.amazonaws.com/bboobowzao5eu2xpljwcxylonph.png "BbOOboWZAo5eu2xplJWcXyLonph")

<Procedures>

1. **Google Cloud Platform プロジェクト ID** に、GCP プロジェクトの ID を入力します。

1. **ストレージ設定** で、GCP から取得した **バケット名** と **サービスアカウントメール** を設定します。

    Zilliz Cloud は、指定されたバケットをデータプレーンストレージとして使用し、指定されたサービスアカウントを使用してお客様に代わってアクセスします。

    バケットの設定とサービスアカウントの作成の詳細については、[Cloud Storage バケットとサービスアカウントの作成](./create-bucket-and-service-account) を参照してください。

1. **GKE 設定** で、GKE 管理用の **GKE クラスター名** と **サービスアカウントメール** を設定します。

    Zilliz Cloud は、指定されたサービスアカウントを使用して、指定された名前の GKE クラスターをお客様に代わってデプロイし、GKE クラスター内にデータプレーンをデプロイします。

    サービスアカウントの作成の詳細については、[GKE サービスアカウントの作成](./create-gke-service-account) を参照してください。

1. **クロスアカウント設定** で、データプレーンデプロイメント用の **サービスアカウント名** を設定します。

    サービスアカウントの準備ができたら、下の読み取り専用テキストボックスに表示された Zilliz BYOC プリンシパルをコピーし、GCP コンソールに貼り付けて、Zilliz Cloud BYOC プロジェクトのデータプレーンをデプロイするために必要な権限を Zilliz BYOC に付与します。

    クロスアカウントサービスアカウントの作成の詳細については、[クロスアカウントサービスアカウントの作成](./create-cross-account-sa) を参照してください。

1. ネットワーク設定を構成するには **次へ** をクリックします。

</Procedures>

### ステップ 3: ネットワーク設定を構成する\{#step-3-configure-network-settings}

**ネットワーク設定** で、VPC と、サブネット名やオプションの プライベート Service Connect エンドポイントなど、いくつかのタイプのリソースを作成します。

![YVPNbLCjOoCkDTx9TEMcbV9LnPd](https://zdoc-images.s3.us-west-2.amazonaws.com/yvpnblcjoockdtx9temcbv9lnpd.png "YVPNbLCjOoCkDTx9TEMcbV9LnPd")

<Procedures>

1. **ネットワーク設定** で、**VPC名**、**サブネット名**、およびオプションの **プライベート Service Connect エンドポイント** を設定します。

    指定された VPC で、Zilliz Cloud は以下を必要とします。

    - 2 つのセカンダリサブネットを持つプライマリサブネット、

    - ロードバランサーサブネット、および

    - オプションの プライベート Service Connect エンドポイント。

    **プライベート Service Connect エンドポイント** は、上記の **一般設定** で **GCP プライベート Service Connect** をオンにした場合にのみ利用可能であることに注意してください。

1. 概要を表示するには **次へ** をクリックします。

1. **デプロイ概要** で、構成設定を確認します。

1. すべてが期待どおりであれば、**作成** をクリックします。

</Procedures>

## デプロイ詳細を表示する\{#view-deployment-details}

プロジェクトを作成した後、プロジェクトページでそのステータスを確認できます。

![BE13bnOpGo9ZAVxTx3acX2J8nEe](https://zdoc-images.s3.us-west-2.amazonaws.com/be13bnopgo9zavxtx3acx2j8nee.png "BE13bnOpGo9ZAVxTx3acX2J8nEe")

プロジェクトのデータプレーンをデプロイし、クラスターを作成した後、これらのクラスターに直接 VPC アクセスまたは GCP プライベート Service Connect を介して接続できます。詳細については、[BYOC クラスターへの接続](./prepare-for-cluster-connection) を参照してください。

## 一時停止と再開\{#suspend-and-resume}

プロジェクトを一時停止すると、データプレーンが停止し、プロジェクトをサポートする GKE クラスターに関連付けられたすべての GCE インスタンスが終了します。この操作は、プロジェクト内で一時停止された Zilliz Cloud クラスターには影響せず、データプレーンが復元されると再開できます。

![YC2YbM9oyo6IcUxDQ5Bc3AzDnPc](https://zdoc-images.s3.us-west-2.amazonaws.com/yc2ybm9oyo6icuxdq5bc3azdnpc.png "YC2YbM9oyo6IcUxDQ5Bc3AzDnPc")

プロジェクト内にクラスターがないか、すべてのクラスターがすでに一時停止されている場合にのみ、実行中のプロジェクトを一時停止できます。

![SVLQbgURIoRqHBx2tWwc5caWnx7](https://zdoc-images.s3.us-west-2.amazonaws.com/svlqbguriorqhbx2twwc5cawnx7.png "SVLQbgURIoRqHBx2tWwc5caWnx7")

プロジェクトカードのステータスタグが **一時停止** と表示されると、プロジェクト内のクラスターを操作できなくなります。この場合、**再開** をクリックしてプロジェクトを再開できます。ステータスタグが再度 **実行中** に変わると、プロジェクト内のクラスターの操作を続行できます。

![EQKqbumOxoT1tVxw1ZRcZahXnDd](https://zdoc-images.s3.us-west-2.amazonaws.com/eqkqbumoxot1tvxw1zrczahxndd.png "EQKqbumOxoT1tVxw1ZRcZahXnDd")

## テクニカルサポートアクセス\{#technical-support-access}

トラブルシューティングとメンテナンス操作を支援するために、Zilliz Cloud はデフォルトでテクニカルサポートがプロジェクトのデータプレーンにアクセスできるようにします。

![LxiUbIQCqoJf2Zx7pincPOCnnyf](https://zdoc-images.s3.us-west-2.amazonaws.com/lxiubiqcqojf2zx7pincpocnnyf.png "LxiUbIQCqoJf2Zx7pincPOCnnyf")

対象プロジェクトのドロップダウンメニューから **テクニカルサポートアクセス** をクリックして、現在の設定を表示します。

![WbyNbPrfioPvmpxTe9ocowainnh](https://zdoc-images.s3.us-west-2.amazonaws.com/wbynbprfiopvmpxte9ocowainnh.png "WbyNbPrfioPvmpxTe9ocowainnh")

データガバナンスとセキュリティ要件を満たすために、これを無効化できます。

## 手順\{#procedures}



import DocCardList from '@theme/DocCardList';

<DocCardList />