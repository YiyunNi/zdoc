---
title: "GCP での BYOC のデプロイ | BYOC"
slug: /deploy-byoc-gcp
sidebar_label: "GCP での BYOC のデプロイ"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud コンソールとカスタム GCP 設定を使用して、Google Cloud Platform (GCP) の Virtual Private Cloud (VPC) 内に、完全に管理された Bring-Your-Own-Cloud (BYOC) データプレーンを手動で作成する方法について説明します。| BYOC"
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

sidebar_key: "get-started/deploy-byoc-gcp"
---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# GCP での BYOC デプロイ

このページでは、Zilliz Cloud コンソールとカスタム GCP 構成を使用して、Google Cloud Platform (GCP) Virtual プライベート Cloud (VPC) 内に完全に管理された Bring-Your-Own-Cloud (BYOC) データプレーンを手動で作成する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>Zilliz BYOC は現在<strong>一般提供</strong>されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloud 営業担当者</a>までお問い合わせください。</p></li>
<li><p>このガイドでは、AWS コンソールで必要なリソースを段階的に作成する方法を示しています。Terraform スクリプトを使用してインフラストラクチャをプロビジョニングする場合は、「<a href="./terraform-provider">Terraform Provider</a>」をご覧ください。</p></li>
</ul>

</Admonition>

## 前提条件\{#prerequisites}

- BYOC 組織オーナーである必要があります。

- [必要な GCP API サービス](./required-api-services-gcp) を有効にしている必要があります。

## 手順\{#procedure}

GCP で BYOC をデプロイするには、Zilliz Cloud が顧客管理下の VPC 内にある Cloud Storage バケットと GKE クラスターにアクセスするために、特定のロールを引き受ける必要があります。その結果、Zilliz Cloud はお客様の Cloud Storage バケット、GKE クラスター、VPC に関する情報と、これらのインフラリソースにアクセスするために必要なロールを取得する必要があります。

BYOC 組織内で、**プロジェクトの作成とデータプレーンのデプロイ**ボタンをクリックしてデプロイを開始します。

![Cl50bi7eVoxSoHxk4jrcclh6n5O](https://zdoc-images.s3.us-west-2.amazonaws.com/cl50bi7evoxsohxk4jrcclh6n5o.png "Cl50bi7eVoxSoHxk4jrcclh6n5O")

### ステップ 1: プロジェクトの作成\{#step-1-create-a-project}

このステップでは、Zilliz BYOC プロジェクト名を設定し、クラウドプロバイダーとリージョン、およびデプロイの初期プロジェクトサイズを決定します。

![TfcXwnfruhqRRIbF90QcTxHqnTh](https://zdoc-images.s3.us-west-2.amazonaws.com/TfcXwnfruhqRRIbF90QcTxHqnTh.png)

<Procedures>

1. **Zilliz BYOC プロジェクト名**を設定します。

1. **クラウドプロバイダー**と**クラウドリージョン**を選択します。

1. **GCP プライベート Service Connect**を有効にするかどうかを決定します。

    このオプションにより、現在のプロジェクト内のクラスターへのプライベート接続が可能になります。このオプションを有効にする場合は、プライベート接続用に プライベート Service Connect エンドポイントを作成する必要があります。詳細については、[クラスター接続の準備](./prepare-for-cluster-connection#private-endpoint-access) を参照してください。

1. **アーキテクチャ**で、アプリケーションに適合するアーキテクチャタイプを選択します。

    これにより、使用する Zilliz BYOC イメージのアーキテクチャタイプが決定されます。利用可能なオプションは**X86**と**ARM**です。

1. **リソース設定**で、以下の操作を行います。

    1. **オートスケーリング**を有効または無効にして、Zilliz Cloud がプロジェクトのワークロードに基づいて定義された範囲内で EC2 インスタンスの数を自動的に調整できるようにし、リソースの効率的な使用を確保します。

    1. **初期プロジェクトサイズ**を構成します。

        BYOC プロジェクトでは、クエリノード、インデックスサービス、Milvus コンポーネント、および依存関係が異なる Google Compute Engine (GCE) インスタンスを使用します。これらのサービスとコンポーネントのインスタンスタイプを設定できます。

        **オートスケーリング**が無効になっている場合は、対応する**カウント**フィールドに各プロジェクトコンポーネントに必要な GCE インスタンスの数を指定するだけです。

        ![WE7pb7cgro9OTNxsK97covglnob](https://zdoc-images.s3.us-west-2.amazonaws.com/we7pb7cgro9otnxsk97covglnob.png "WE7pb7cgro9OTNxsK97covglnob")

        **オートスケーリング**が有効になると、対応する**最小**および**最大**フィールドを設定することで、実際のプロジェクトワークロードに基づいて GCE インスタンスの数を Zilliz Cloud が自動的にスケールするための範囲を指定する必要があります。

        ![AUPubLBBwo2ehQxBbCUcoC3UnDe](https://zdoc-images.s3.us-west-2.amazonaws.com/aupublbbwo2ehqxbbcucoc3unde.png "AUPubLBBwo2ehQxBbCUcoC3UnDe")

        リソース設定を容易にするために、4 つの事前定義されたプロジェクトサイズオプションがあります。以下の表は、これらのプロジェクトサイズオプションと、プロジェクト内で作成できるクラスターの数、およびこれらのクラスターが含めることができるエンティティ数のマッピングを示しています。

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
             <td><p>8〜16 CU の 3 クラスター</p></td>
             <td><p>1,000 万〜2,500 万</p></td>
             <td><p>4,000 万〜8,000 万</p></td>
           </tr>
           <tr>
             <td><p>中</p></td>
             <td><p>16〜64 CU の 7 クラスター</p></td>
             <td><p>2,500 万〜1 億</p></td>
             <td><p>8,000 万〜3 億 5,000 万</p></td>
           </tr>
           <tr>
             <td><p>大</p></td>
             <td><p>64〜192 CU の 12 クラスター</p></td>
             <td><p>1 億〜3 億</p></td>
             <td><p>3 億 5,000 万〜10 億</p></td>
           </tr>
           <tr>
             <td><p>特大</p></td>
             <td><p>192〜576 CU の 17 クラスター</p></td>
             <td><p>3 億〜9 億</p></td>
             <td><p>10 億〜30 億</p></td>
           </tr>
        </table>

        また、**初期プロジェクトサイズ**で**カスタム**を選択し、すべてのデータプレーンコンポーネントの GCE インスタンスタイプと数を調整することで、設定をカスタマイズすることもできます。希望する GCE インスタンスタイプが一覧に表示されていない場合は、さらなるサポートが必要な場合、[Zilliz サポート](https://zilliz.com/contact) にお問い合わせください。

    1. **ティアードクエリノード**を有効にするかどうかを決定します。

        このオプションは、ティアードストレージクラスターを作成できるかどうかを決定します。このオプションを選択すると、ティアードクエリノードのインスタンスタイプと数を設定できます。

        ![T3wbbSnZBoGlJjxPoWpcBiX9nmb](https://zdoc-images.s3.us-west-2.amazonaws.com/t3wbbsnzbogljjxpowpcbix9nmb.png "T3wbbSnZBoGlJjxPoWpcBiX9nmb")

        <Admonition type="info" icon="📘" title="Notes">

        <ul>
        <li><p><strong>プロジェクトサイズ</strong>での選択は、<strong>ティアードストレージノード</strong>の設定に影響しません。</p></li>
        <li><p><strong>オートスケーリング</strong>が無効の場合、<strong>デフォルトクエリノード</strong>のカウントと<strong>ティアードクエリノード</strong>のカウントの合計は正の整数である必要があります。</p></li>
        <li><p><strong>オートスケーリング</strong>が有効の場合、<strong>デフォルトクエリノード</strong>と<strong>ティアードクエリノード</strong>の両方の<strong>最小</strong>値の合計は正の整数である必要があります。</p></li>
        </ul>

        </Admonition>

1. **次へ**をクリックして認証情報を設定します。

</Procedures>

### ステップ 2: 認証情報の設定\{#step-2-set-up-credentials}

**認証情報設定**では、ストレージアクセス、GKE クラスター管理、およびデータプレーンデプロイ用のストレージと複数のサービスアカウントを設定する必要があります。

![BbOOboWZAo5eu2xplJWcXyLonph](https://zdoc-images.s3.us-west-2.amazonaws.com/bboobowzao5eu2xpljwcxylonph.png "BbOOboWZAo5eu2xplJWcXyLonph")

<Procedures>

1. **Google Cloud Platform プロジェクト ID**に、GCP プロジェクトの ID を入力します。

1. **ストレージ設定**で、GCP から取得した**バケット名**と**サービスアカウントメール**を設定します。

    Zilliz Cloud は、指定されたバケットをデータプレーンストレージとして使用し、指定されたサービスアカウントを使用してお客様に代わってアクセスします。

    バケットのセットアップとサービスアカウントの作成の詳細については、[Cloud Storage バケットとサービスアカウントの作成](./create-bucket-and-service-account) を参照してください。

1. **GKE 設定**で、GKE 管理用の**GKE クラスター名**と**サービスアカウントメール**を設定します。

    Zilliz Cloud は、指定されたサービスアカウントを使用して、指定された名前の GKE クラスターをお客様に代わってデプロイし、その GKE クラスター内にデータプレーンをデプロイします。

    サービスアカウントの作成の詳細については、[GKE サービスアカウントの作成](./create-gke-service-account) を参照してください。

1. **クロスアカウント設定**で、データプレーンデプロイ用の**サービスアカウント名**を設定します。

    サービスアカウントの準備ができたら、下の読み取り専用テキストボックスに表示される Zilliz BYOC プリンシパルをコピーし、GCP コンソールに貼り付けて、Zilliz Cloud BYOC プロジェクトのデータプレーンをデプロイするために必要な権限を Zilliz BYOC に付与します。

    クロスアカウントサービスアカウントの作成の詳細については、[クロスアカウントサービスアカウントの作成](./create-cross-account-sa) を参照してください。

1. **次へ**をクリックしてネットワーク設定を構成します。

</Procedures>

### ステップ 3: ネットワーク設定の構成\{#step-3-configure-network-settings}

**ネットワーク設定**では、VPC と、サブネット名やオプションの プライベート Service Connect エンドポイントなどのいくつかのリソースタイプを作成します。

![YVPNbLCjOoCkDTx9TEMcbV9LnPd](https://zdoc-images.s3.us-west-2.amazonaws.com/yvpnblcjoockdtx9temcbv9lnpd.png "YVPNbLCjOoCkDTx9TEMcbV9LnPd")

<Procedures>

1. **ネットワーク設定**で、**VPC 名**、**サブネット名**、およびオプションの**プライベート Service Connect エンドポイント**を設定します。

    指定された VPC 内で、Zilliz Cloud には以下が必要です。

    - 2 つのセカンダリサブネットを持つプライマリサブネット、

    - ロードバランサーサブネット、および

    - オプションの プライベート Service Connect エンドポイント。

    **プライベート Service Connect エンドポイント**は、上記の**一般設定**で**GCP プライベート Service Connect**をオンにした場合にのみ利用可能です。

1. **次へ**をクリックして概要を表示します。

1. **デプロイ概要**で、構成設定を確認します。

1. すべての設定が预期通りであれば、**作成**をクリックします。

</Procedures>

## デプロイ詳細の表示\{#view-deployment-details}

プロジェクトを作成した後、プロジェクトページでそのステータスを表示できます。

![BE13bnOpGo9ZAVxTx3acX2J8nEe](https://zdoc-images.s3.us-west-2.amazonaws.com/be13bnopgo9zavxtx3acx2j8nee.png "BE13bnOpGo9ZAVxTx3acX2J8nEe")

プロジェクトのデータプレーンをデプロイし、クラスターを作成したら、直接 VPC アクセスまたは GCP プライベート Service Connect を介してこれらのクラスターに接続できます。詳細については、[BYOC クラスターへの接続](./prepare-for-cluster-connection) を参照してください。

## 一時停止と再開\{#suspend-and-resume}

プロジェクトを一時停止すると、データプレーンが停止し、プロジェクトをサポートする GKE クラスターに関連付けられたすべての GCE インスタンスが終了します。このアクションは、プロジェクト内の一時停止された Zilliz Cloud クラスターには影響せず、データプレーンが復元されれば再開できます。

![YC2YbM9oyo6IcUxDQ5Bc3AzDnPc](https://zdoc-images.s3.us-west-2.amazonaws.com/yc2ybm9oyo6icuxdq5bc3azdnpc.png "YC2YbM9oyo6IcUxDQ5Bc3AzDnPc")

プロジェクト内にクラスターが存在しない場合、またはすべてのクラスターがすでに一時停止されている場合にのみ、実行中のプロジェクトを一時停止できます。

![SVLQbgURIoRqHBx2tWwc5caWnx7](https://zdoc-images.s3.us-west-2.amazonaws.com/svlqbguriorqhbx2twwc5cawnx7.png "SVLQbgURIoRqHBx2tWwc5caWnx7")

プロジェクトカードのステータスタグが**一時停止**と表示されている場合、プロジェクト内のクラスターを操作することはできません。その場合は、**再開**をクリックしてプロジェクトを再開できます。ステータスタグが再び**実行中**に戻ると、プロジェクト内のクラスターの操作を続行できます。

![EQKqbumOxoT1tVxw1ZRcZahXnDd](https://zdoc-images.s3.us-west-2.amazonaws.com/eqkqbumoxot1tvxw1zrczahxndd.png "EQKqbumOxoT1tVxw1ZRcZahXnDd")

## テクニカルサポートアクセス\{#technical-support-access}

トラブルシューティングとメンテナンス操作を支援するため、Zilliz Cloud はデフォルトでテクニカルサポートがプロジェクトのデータプレーンにアクセスできるようにしています。

![LxiUbIQCqoJf2Zx7pincPOCnnyf](https://zdoc-images.s3.us-west-2.amazonaws.com/lxiubiqcqojf2zx7pincpocnnyf.png "LxiUbIQCqoJf2Zx7pincPOCnnyf")

対象プロジェクトのドロップダウンメニューから**テクニカルサポートアクセス**をクリックして、現在の設定を表示します。

![WbyNbPrfioPvmpxTe9ocowainnh](https://zdoc-images.s3.us-west-2.amazonaws.com/wbynbprfiopvmpxte9ocowainnh.png "WbyNbPrfioPvmpxTe9ocowainnh")

データガバナンスとセキュリティ要件を満たすために、これを無効にすることができます。

## 手順\{#procedures}



import DocCardList from '@theme/DocCardList';

<DocCardList />