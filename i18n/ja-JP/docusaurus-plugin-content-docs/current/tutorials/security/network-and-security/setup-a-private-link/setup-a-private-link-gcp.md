---
title: "Private Service Connect (GCP) のセットアップ | Cloud"
slug: /setup-a-private-link-gcp
sidebar_key: setup-a-private-link-gcp
sidebar_label: "Private Service Connect (GCP) をセットアップ"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloud クラスターから異なる GCP VPC にホストされたサービスへのプライベートリンクを設定する手順を説明します。"
type: origin
token: IojuwADAwiRK0hkl4pgcvC2QnQd
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - プライベートリンク
  - privatelink
  - プライベートエンドポイント
  - private service connect
  - aws
  - gcp
  - azure

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# プライベート Service Connect (GCP) の設定

このガイドでは、異なる GCP VPC にホストされているサービスから Zilliz Cloud クラスターへのプライベートリンクを設定する手順を説明します。

<Admonition type="info" icon="📘" title="Notes">

この機能は **Dedicated** クラスターでのみ利用可能です。

</Admonition>

プライベートリンクはプロジェクトレベルで設定され、このプロジェクト内の同じクラウドプロバイダーおよびリージョンにデプロイされたすべてのクラスターに有効です。

<Admonition type="info" icon="📘" title="Notes">

Zilliz Cloud はプライベートリンクに対して料金を請求しません。ただし、クラウドプロバイダーは Zilliz Cloud にアクセスするために作成した [各エンドポイントに対して料金を請求する](https://cloud.google.com/vpc/pricing#psc-forwarding-rule-service) 場合があります。

</Admonition>

## 開始前に\{#before-you-start}

以下の条件が満たされていることを確認してください：

- サービスと Zilliz Cloud クラスターが異なるリージョンにあり、サービスが プライベート Service Connect エンドポイントを介してクラスターにアクセスする必要がある場合は、エンドポイントの作成時にグローバルアクセスを有効にする必要があります。

## プライベートエンドポイントの作成\{#create-private-endpoint}

Zilliz Cloud は、プライベートエンドポイントを追加するための直感的な Web コンソールを提供しています。対象のプロジェクトに移動し、左側のナビゲーションから **ネットワーク > プライベートエンドポイント** をクリックします。**+ プライベートエンドポイント** をクリックします。

![Yz5Cb5PMooxAIExRkEvcoBr9noc](https://zdoc-images.s3.us-west-2.amazonaws.com/yz5cb5pmooxaiexrkevcobr9noc.png "Yz5Cb5PMooxAIExRkEvcoBr9noc")

### クラウドプロバイダーとリージョンの選択\{#select-a-cloud-provider-and-region}

GCP リージョンにデプロイされたクラスターのプライベートエンドポイントを作成するには、**クラウドプロバイダー** ドロップダウンリストから **GCP** を選択します。**リージョン** では、プライベートにアクセスしたいクラスターが配置されているリージョンを選択します。**次へ** をクリックします。

利用可能なクラウドプロバイダーとリージョンの詳細については、[クラウドプロバイダーとリージョン](./cloud-providers-and-regions) を参照してください。

![F8jBbJcdnoqMBBxMQZZcJfvKnny](https://zdoc-images.s3.us-west-2.amazonaws.com/f8jbbjcdnoqmbbxmqzzcjfvknny.png "F8jBbJcdnoqMBBxMQZZcJfvKnny")

### エンドポイントの作成\{#create-an-endpoint}

エンドポイントは、Google Cloud Dashboard（**UIコンソール経由**）または gCloud CLI（**CLI経由**）のいずれかで作成できます。以下の手順に従う前に、すでに VPC を作成し、その VPC 内で Zilliz Cloud に接続する必要があるサービスを実行していることを確認してください。

#### UIコンソール経由\{#via-ui-console}

![CicmbETm0oALKkxGh3Xc2wz0nVa](https://zdoc-images.s3.us-west-2.amazonaws.com/cicmbetm0oalkkxgh3xc2wz0nva.png "CicmbETm0oALKkxGh3Xc2wz0nVa")

Zilliz Cloud コンソールで **コピーして移動** をクリックし、GCP の プライベート Service Connect リストを開き、以下の手順に従ってエンドポイントを作成します：

<Procedures>

1. 開いた [プライベート Service Connect](https://console.cloud.google.com/net-services/psc) ページで、**+ エンドポイントに接続** をクリックします。

1. **ターゲット** では、**公開済みサービス** を選択します。

1. **ターゲットサービス** には、Zilliz Cloud コンソールからコピーしたものを貼り付けます。

1. **エンドポイント名** には、エンドポイントに使用する名前を入力します。

1. エンドポイントの **ネットワーク** を選択します。Zilliz Cloud クラスターに接続する必要があるサービスは、指定された VPC 内で実行されている必要があります。

1. エンドポイントの **サブネットワーク** を選択します。

1. エンドポイントの **IPアドレス** を選択するか、新しいものを作成します。

1. サービスと対象の Zilliz Cloud クラスターが異なるリージョンにあり、サービスが プライベート Service Connect エンドポイントを介してクラスターにアクセスする必要がある場合は、エンドポイントの **グローバルアクセスを有効にする** を選択します。

1. ドロップダウンリストから **Namespace** を選択するか、新しい名前空間を作成します。

1. **エンドポイントを追加** をクリックします。

1. エンドポイント名をコピーし、Zilliz Cloud コンソールに戻ります。

</Procedures>

#### CLI経由\{#via-cli}

![OurbbN4HdodjSNx9ph2cWTwWnIc](https://zdoc-images.s3.us-west-2.amazonaws.com/ourbbn4hdodjsnx9ph2cwtwwnic.png "OurbbN4HdodjSNx9ph2cWTwWnIc")

<Procedures>

1. **CLI経由** タブに切り替えます。

1. **プロジェクトID** を入力します。

    Google Cloud プロジェクト ID を取得するには、

    1. [Google Cloud Dashboard](https://console.cloud.google.com/home/dashboard) を開きます。

    1. 目的のプロジェクト ID を見つけ、その ID をコピーします。

    1. この ID を Zilliz Cloud の Google Cloud プロジェクトID に入力します。

1. **VPC名** を入力します。

    VPC エンドポイントを作成する前に、GCP コンソール上に VPC が必要です。VPC を表示するには、以下のように行います：

    1. [Google Cloud VPC Dashboard](https://console.cloud.google.com/networking/networks/list) を開きます。

    1. ナビゲーションペインで **VPCネットワーク** を選択します。

    1. 目的の VPC を見つけ、その Name をコピーします。

    1. この名前を Zilliz Cloud の **VPC名** に入力します。

    VPC ネットワークの作成については、[VPC ネットワークの作成と管理](https://cloud.google.com/vpc/docs/create-modify-vpc-networks) を参照してください。

1. **サブネット名** を入力します。

    サブネットは VPC の細分化です。作成するプライベートリンクと同じリージョンに存在するサブネットが必要です。サブネットを表示するには、以下のように行います：

    1. [VPC ネットワークリスト](https://console.cloud.google.com/networking/networks/list) を開きます。

    1. ナビゲーションペインで **VPCネットワーク** を選択します。

    1. 目的の VPC の名前をクリックします。

    1. 目的のサブネットを見つけ、その名前をコピーします。

    1. この名前を Zilliz Cloud の **サブネット名** に入力します。

1. **プライベート Service Connect エンドポイント プレフィックス** を入力します。

    利便性のため、**プライベート Service Connect Endpoint prefix** にエンドポイントプレフィックスを設定する必要があります。これにより、作成する転送ルールはすべてこのプレフィックスを持つようになります。

1. コードブロックのコピーアイコンをクリックし、Google Cloud Console に移動します。

    上部のナビゲーションで Google Cloud Cloud Shell を起動します。Cloud Shell で、Zilliz Cloud からコピーした CLI コマンドを実行します。

    ![vpc_networks_gcp](https://zdoc-images.s3.us-west-2.amazonaws.com/vpc_networks_gcp.png "vpc_networks_gcp")

    エンドポイントが作成されたら、[Google Cloud プライベート Service Connect ページ](https://console.cloud.google.com/net-services/psc/list/consumers) に移動し、作成したエンドポイントの名前をコピーします。

</Procedures>

### エンドポイントの承認\{#authorize-your-endpoint}

Google Cloud コンソールから取得したエンドポイント ID とプロジェクト ID を、Zilliz Cloud の **エンドポイントID** および **プロジェクトID** ボックスにそれぞれ貼り付けます。**作成** をクリックします。

![VOy4blyfmoi7RLxO0GWcXmzDnFe](https://zdoc-images.s3.us-west-2.amazonaws.com/voy4blyfmoi7rlxo0gwcxmzdnfe.png "VOy4blyfmoi7RLxO0GWcXmzDnFe")

## プライベートリンクの取得\{#obtain-a-private-link}

送信した属性を確認して承認すると、Zilliz Cloud はこのエンドポイントにプライベートリンクを割り当てます。このプロセスには約 5 分かかります。

プライベートリンクの準備ができたら、Zilliz Cloud の **プライベートリンク** ページで確認できます。

## ファイアウォールルールと DNS レコードの設定\{#set-up-firewall-rules-and-a-dns-record}

Zilliz Cloud が割り当てたプライベートリンクを介してクラスターにアクセスする前に、DNS ゾーンに CNAME レコードを作成し、プライベートリンクを VPC エンドポイントの DNS名 に解決する必要があります。

### ファイアウォールルールの作成\{#create-firewall-rules}

管理クラスターへのプライベートアクセスを許可するには、適切なファイアウォールルールを追加します。以下のスニペットは、TCP ポート 22 経由のトラフィックを許可する方法を示しています。**VPC_NAME** は VPC の名前に設定する必要があることに注意してください。

```bash
VPC_NAME={{vpc-name}};

gcloud compute firewall-rules create psclab-iap-consumer --network $VPC_NAME --allow tcp:22 --source-ranges=35.235.240.0/20 --enable-logging
```

### Cloud DNS を使用してホストゾーンを作成する\{#create-a-hosted-zone-using-cloud-dns}

GCP コンソールの [Cloud DNS](https://console.cloud.google.com/net-services/dns/zones) に移動し、DNS ゾーンを作成します。

![V0XRbvlgLoHRPexZSzEcFB5rn17](https://zdoc-images.s3.us-west-2.amazonaws.com/v0xrbvlglohrpexzszecfb5rn17.png "V0XRbvlgLoHRPexZSzEcFB5rn17")

<Procedures>

1. **ゾーンタイプ** で **プライベート** を選択します。

1. **ゾーン名** を `zilliz-privatelink-zone` または適切な値に設定します。

1. **DNS名** をステップ 7 で取得したプライベートリンクに設定します。

    有効な DNS 名は `in01-xxxxxxxxxxxxxxx.gcp-us-west1.vectordb.zillizcloud.com` のような形式です。

1. **ネットワーク** で適切な VPCネットワーク を選択します。

1. **CREATE** をクリックします。

</Procedures>

### ホストゾーンにレコードを作成する\{#create-a-record-in-the-hosted-zone}

<Procedures>

1. 上記で作成したゾーンで、**RECORD SETS** タブの **ADD STANDARD** をクリックします。

1. **Create record set** ページで、デフォルト設定で **A** レコードを作成します。

    ![Zys4bZxploNNTex5h2OcGGwnnYd](https://zdoc-images.s3.us-west-2.amazonaws.com/zys4bzxplonntex5h2ocggwnnyd.png "Zys4bZxploNNTex5h2OcGGwnnYd")

1. **IPv4アドレス** の **SELECT IP ADDRESS** をクリックし、エンドポイントの IPアドレス を選択します。

    ![Uh1sbVdLSok8N6xyRMhcildDn7f](https://zdoc-images.s3.us-west-2.amazonaws.com/uh1sbvdlsok8n6xyrmhcilddn7f.png "Uh1sbVdLSok8N6xyRMhcildDn7f")

1. **CREATE** をクリックします。

</Procedures>

## クラスターへのインターネットアクセスを管理する\{#manage-internet-access-to-your-clusters}

プライベートエンドポイントの設定後、プロジェクトへのインターネットアクセスを制限するためにクラスターのパブリックエンドポイントを無効化できます。パブリックエンドポイントを無効化すると、ユーザーはプライベートリンクを使用してのみクラスターに接続できます。

パブリックエンドポイントを無効化するには：

<Procedures>

1. 対象クラスターの **クラスターの詳細** ページに移動します。

1. **接続** セクションに移動します。

1. クラスターのパブリックエンドポイントの横にある設定アイコン をクリックします。

1. 情報を確認し、**Disable Public Endpoint** ダイアログボックスで **Disable** をクリックします。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

- プライベートエンドポイントは [data plane](/reference/restful/data-plane-v2) アクセスにのみ影響します。[Control plane](/reference/restful/control-plane-v2) は引き続きパブリックインターネット経由でアクセスできます。

- パブリックエンドポイントを再度有効化した後、パブリックエンドポイントにアクセスできるようになるまで、ローカルの DNS キャッシュが期限切れになるのを待つ必要がある場合があります。

</Admonition>

![disable_public_endpoint](https://zdoc-images.s3.us-west-2.amazonaws.com/disable_public_endpoint.png "disable_public_endpoint")

## FAQ\{#faq}

### GCP でプライベートリンクに ping を実行すると、なぜ常に `Name or service not known` と報告されるのですか？\{#why-does-it-always-report-name-or-service-not-known-when-i-ping-the-private-link-on-gcp}

[Set up firewall rules and a DNS record](./setup-a-private-link-gcp#set-up-firewall-rules-and-a-dns-record) を参照して DNS 設定を確認してください。

- 設定が正しい場合、プライベートリンクに ping を実行すると、以下のように表示されます。

    ![private_link_gcp_ts_01](https://zdoc-images.s3.us-west-2.amazonaws.com/private_link_gcp_ts_01.png "private_link_gcp_ts_01")

- 設定が正しくない場合、プライベートリンクに ping を実行すると、以下のように表示される可能性があります。

    ![private_link_gcp_ts_02](https://zdoc-images.s3.us-west-2.amazonaws.com/private_link_gcp_ts_02.png "private_link_gcp_ts_02")

### 既存のクラスターにプライベートエンドポイントを作成できますか？\{#can-i-create-a-private-endpoint-for-an-existing-cluster}

はい。プライベートエンドポイントを作成すると、同じリージョンとプロジェクト内のすべての既存および将来の Dedicated (Enterprise) クラスターに適用されます。必要なのは、異なるクラスターに対して異なる DNS レコードを追加することだけです。