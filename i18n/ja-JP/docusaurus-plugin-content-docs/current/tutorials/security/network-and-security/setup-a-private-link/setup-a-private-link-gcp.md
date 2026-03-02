---
title: "Private Service Connect (GCP) のセットアップ | Cloud"
slug: /setup-a-private-link-gcp
sidebar_label: "Private Service Connect (GCP) のセットアップ"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloud クラスターから異なる GCP VPC でホストされているサービスへのプライベートリンクをセットアップする手順を説明します。"
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
  - nlp検索
  - hallucinations llm
  - マルチモーダル検索
  - ベクトル検索アルゴリズム

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# Private Service Connect (GCP) をセットアップする

このガイドでは、Zilliz Cloud クラスターから異なる GCP VPC でホストされているサービスへのプライベートリンクをセットアップする手順を説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Dedicated</strong> クラスターでのみ利用可能です。</p>

</Admonition>

プライベートリンクはプロジェクトレベルで設定され、同じクラウドプロバイダーとリージョンにデプロイされたすべてのクラスターに有効です。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloud はプライベートリンクに対して課金しません。ただし、クラウドプロバイダーは、Zilliz Cloud にアクセスするために作成する<a href="https://cloud.google.com/vpc/pricing#psc-forwarding-rule-service">各エンドポイントに対して課金する</a>場合があります。</p>

</Admonition>

## 開始する前に{#before-you-start}

以下の条件が満たされていることを確認してください。

- サービスと Zilliz Cloud クラスターが異なるリージョンにあり、サービスが Private Service Connect エンドポイントを介してクラスターにアクセスしたい場合、エンドポイント作成時にグローバルアクセスを有効にする必要があります。

## プライベートエンドポイントを作成する{#create-private-endpoint}

Zilliz Cloud は、プライベートエンドポイントを追加するための直感的なウェブコンソールを提供します。ターゲットプロジェクトに移動し、左側のナビゲーションで **Network > Private Endpoint** をクリックします。**+ Private Endpoint** をクリックします。

![Yz5Cb5PMooxAIExRkEvcoBr9noc](https://zdoc-images.s3.us-west-2.amazonaws.com/yz5cb5pmooxaiexrkevcobr9noc.png "Yz5Cb5PMooxAIExRkEvcoBr9noc")

### クラウドプロバイダーとリージョンを選択する{#select-a-cloud-provider-and-region}

GCP リージョンにデプロイされたクラスターのプライベートエンドポイントを作成するには、**Cloud Provider** ドロップダウンリストから **GCP** を選択します。**Region** で、プライベートにアクセスしたいクラスターを収容するリージョンを選択します。**Next** をクリックします。

利用可能なクラウドプロバイダーとリージョンの詳細については、[Cloud Providers & Regions](./cloud-providers-and-regions) を参照してください。

![F8jBbJcdnoqMBBxMQZZcJfvKnny](https://zdoc-images.s3.us-west-2.amazonaws.com/f8jbbjcdnoqmbbxmqzzcjfvknny.png "F8jBbJcdnoqMBBxMQZZcJfvKnny")

### エンドポイントを作成する{#create-an-endpoint}

エンドポイントは、Google Cloud ダッシュボード（**UI コンソール経由**）または gCloud CLI（**CLI 経由**）のいずれかで作成できます。以下の手順に従う前に、VPC を作成し、その VPC 内で Zilliz Cloud に接続する必要があるサービスを実行していることを確認してください。

#### UI コンソール経由{#via-ui-console}

![CicmbETm0oALKkxGh3Xc2wz0nVa](https://zdoc-images.s3.us-west-2.amazonaws.com/cicmbetm0oalkkxgh3xc2wz0nva.png "CicmbETm0oALKkxGh3Xc2wz0nVa")

Zilliz Cloud コンソールで **Copy and Go** をクリックして GCP の Private Service Connect リストを開き、以下の手順に従ってエンドポイントを作成します。

<Procedures>

1. 開いた [Private Service Connect](https://console.cloud.google.com/net-services/psc) ページで、**+ Connect endpoint** をクリックします。

1. **Target** で、**Published service** を選択します。

1. **Target Service** に、Zilliz Cloud コンソールからコピーしたものを貼り付けます。

1. **Endpoint name** に、エンドポイントに使用する名前を入力します。

1. エンドポイントの **Network** を選択します。Zilliz Cloud クラスターに接続する必要があるサービスは、指定された VPC 内で実行されている必要があります。

1. エンドポイントの **Subnetwork** を選択します。

1. エンドポイントの **IP address** を選択するか、新しいものを作成します。

1. サービスとターゲットの Zilliz Cloud クラスターが異なるリージョンにあり、サービスが Private Service Connect エンドポイントを介してクラスターにアクセスしたい場合、エンドポイントの **Enable global access** を選択します。

1. ドロップダウンリストから **Namespace** を選択するか、新しい名前空間を作成します。

1. **Add endpoint** をクリックします。

1. エンドポイント名をコピーし、Zilliz Cloud コンソールに戻ります。

</Procedures>

#### CLI 経由{#via-cli}

![OurbbN4HdodjSNx9ph2cWTwWnIc](https://zdoc-images.s3.us-west-2.amazonaws.com/ourbbn4hdodjsnx9ph2cwtwwnic.png "OurbbN4HdodjSNx9ph2cWTwWnIc")

<Procedures>

1. **Via CLI** タブに切り替えます。

1. **Project ID** を入力します。

    Google Cloud プロジェクト ID を取得するには、

    1. [Google Cloud ダッシュボード](https://console.cloud.google.com/home/dashboard) を開きます。

    1. 目的のプロジェクト ID を見つけて、その ID をコピーします。

    1. この ID を Zilliz Cloud の Google Cloud Project ID に入力します。

1. **VPC Name** を入力します。

    VPC エンドポイントを作成する前に、GCP コンソールに VPC が必要です。VPC を表示するには、次のようにします。

    1. [Google Cloud VPC ダッシュボード](https://console.cloud.google.com/networking/networks/list) を開きます。

    1. ナビゲーションペインで、**VPC networks** を選択します。

    1. 目的の VPC を見つけて、その名前をコピーします。

    1. この名前を Zilliz Cloud の **VPC Name** に入力します。

    VPC ネットワークを作成するには、[VPC ネットワークの作成と管理](https://cloud.google.com/vpc/docs/create-modify-vpc-networks) を参照してください。

1. **Subnet Name** を入力します。

    サブネットは VPC のサブディビジョンです。作成するプライベートリンクと同じリージョンに存在するサブネットが必要です。サブネットを表示するには、次のようにします。

    1. [VPC ネットワークリスト](https://console.cloud.google.com/networking/networks/list) を開きます。

    1. ナビゲーションペインで、**VPC networks** を選択します。

    1. 目的の VPC の名前をクリックします。

    1. 目的のサブネットを見つけて、その名前をコピーします。

    1. この名前を Zilliz Cloud の **Subnet Name** に入力します。

1. **Private Service Connect Endpoint Prefix** を入力します。

    便宜上、**Private Service Connect Endpoint prefix** にエンドポイントプレフィックスを設定する必要があります。これにより、作成するすべての転送ルールにこのプレフィックスが適用されます。

1. コードブロックのコピーアイコンをクリックし、Google Cloud Console に移動します。

    上部のナビゲーションで Google Cloud Cloud Shell を起動します。Zilliz Cloud からコピーした CLI コマンドを Cloud Shell で実行します。

    ![vpc_networks_gcp](https://zdoc-images.s3.us-west-2.amazonaws.com/vpc_networks_gcp.png "vpc_networks_gcp")

    エンドポイントが作成されたら、[Google Cloud Private Service Connect ページ](https://console.cloud.google.com/net-services/psc/list/consumers) に移動し、作成したエンドポイントの名前をコピーします。

</Procedures>

### エンドポイントを承認する{#authorize-your-endpoint}

Google Cloud コンソールから取得したエンドポイント ID とプロジェクト ID を、Zilliz Cloud の **Endpoint ID** と **Project ID** ボックスにそれぞれ貼り付けます。**Create** をクリックします。

![VOy4blyfmoi7RLxO0GWcXmzDnFe](https://zdoc-images.s3.us-west-2.amazonaws.com/voy4blyfmoi7rlxo0gwcxmzdnfe.png "VOy4blyfmoi7RLxO0GWcXmzDnFe")

## プライベートリンクを取得する{#obtain-a-private-link}

送信した上記の属性を検証して承認した後、Zilliz Cloud はこのエンドポイントにプライベートリンクを割り当てます。このプロセスには約5分かかります。

プライベートリンクの準備が整うと、Zilliz Cloud の **Private Link** ページで表示できます。

## ファイアウォールルールと DNS レコードを設定する{#set-up-firewall-rules-and-a-dns-record}

Zilliz Cloud によって割り当てられたプライベートリンクを介してクラスターにアクセスする前に、DNS ゾーンに CNAME レコードを作成して、プライベートリンクを VPC エンドポイントの DNS 名に解決する必要があります。

### ファイアウォールルールを作成する{#create-firewall-rules}

マネージドクラスターへのプライベートアクセスを許可するには、適切なファイアウォールルールを追加します。次のスニペットは、TCP ポート 22 を介したトラフィックを許可する方法を示しています。**VPC_NAME** を VPC の名前に設定する必要があることに注意してください。

```bash
VPC_NAME={{vpc-name}};

gcloud compute firewall-rules create psclab-iap-consumer --network $VPC_NAME --allow tcp:22 --source-ranges=35.235.240.0/20 --enable-logging
```

### Cloud DNS を使用してホストゾーンを作成する{#create-a-hosted-zone-using-cloud-dns}

GCP コンソールで [Cloud DNS](https://console.cloud.google.com/net-services/dns/zones) に移動し、DNS ゾーンを作成します。

![V0XRbvlgLoHRPexZSzEcFB5rn17](https://zdoc-images.s3.us-west-2.amazonaws.com/v0xrbvlglohrpexzszecfb5rn17.png "V0XRbvlgLoHRPexZSzEcFB5rn17")

<Procedures>

1. **ゾーンタイプ**で**プライベート**を選択します。

1. **ゾーン名**を `zilliz-privatelink-zone` または適切な値に設定します。

1. **DNS 名**をステップ 7 で取得したプライベートリンクに設定します。

    有効な DNS 名は `in01-xxxxxxxxxxxxxxx.gcp-us-west1.vectordb.zillizcloud.com` のようになります。

1. **ネットワーク**で適切な VPC ネットワークを選択します。

1. **作成**をクリックします。

</Procedures>

### ホストゾーンにレコードを作成する{#create-a-record-in-the-hosted-zone}

<Procedures>

1. 上記で作成したゾーンで、**レコードセット**タブの**標準を追加**をクリックします。

1. **レコードセットの作成**ページで、デフォルト設定の**A**レコードを作成します。

    ![Zys4bZxploNNTex5h2OcGGwnnYd](https://zdoc-images.s3.us-west-2.amazonaws.com/zys4bzxplonntex5h2ocggwnnYd.png "Zys4bZxploNNTex5h2OcGGwnnYd")

1. **IPv4 アドレス**の**IP アドレスを選択**をクリックし、エンドポイントの IP アドレスを選択します。

    ![Uh1sbVdLSok8N6xyRMhcildDn7f](https://zdoc-images.s3.us-west-2.amazonaws.com/uh1sbvdlsok8n6xyrmhcilddn7f.png "Uh1sbVdLSok8N6xyRMhcilddn7f")

1. **作成**をクリックします。

</Procedures>

## クラスターへのインターネットアクセスを管理する{#manage-internet-access-to-your-clusters}

プライベートエンドポイントを設定した後、クラスターのパブリックエンドポイントを無効にして、プロジェクトへのインターネットアクセスを制限することを選択できます。パブリックエンドポイントを無効にすると、ユーザーはプライベートリンクを使用してのみクラスターに接続できます。

パブリックエンドポイントを無効にするには：

<Procedures>

1. ターゲットクラスターの**クラスター詳細**ページに移動します。

1. **接続**セクションに移動します。

1. クラスターのパブリックエンドポイントの横にある設定アイコンをクリックします。

1. 情報を読み、**パブリックエンドポイントを無効にする**ダイアログボックスで**無効にする**をクリックします。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>プライベートエンドポイントは、<a href="/reference/restful/data-plane-v2">データプレーン</a>アクセスにのみ影響します。<a href="/reference/restful/control-plane-v2">コントロールプレーン</a>は引き続きパブリックインターネット経由でアクセスできます。</p></li>
<li><p>パブリックエンドポイントを再度有効にした後、パブリックエンドポイントにアクセスできるようになるまで、ローカル DNS キャッシュが期限切れになるまで待つ必要がある場合があります。</p></li>
</ul>

</Admonition>

![disable_public_endpoint](https://zdoc-images.s3.us-west-2.amazonaws.com/disable_public_endpoint.png "disable_public_endpoint")

## FAQ{#faq}

### GCP でプライベートリンクを ping すると、常に `Name or service not known` と報告されるのはなぜですか？{#why-does-it-always-report-name-or-service-not-known-when-i-ping-the-private-link-on-gcp}

[ファイアウォールルールと DNS レコードを設定する](./setup-a-private-link-gcp#set-up-firewall-rules-and-a-dns-record)を参照して、DNS 設定を確認してください。

- 設定が正しい場合、プライベートリンクを ping すると、次のように表示されます。

    ![private_link_gcp_ts_01](https://zdoc-images.s3.us-west-2.amazonaws.com/private_link_gcp_ts_01.png "private_link_gcp_ts_01")

- 設定が正しくない場合、プライベートリンクを ping すると、次のように表示されることがあります。

    ![private_link_gcp_ts_02](https://zdoc-images.s3.us-west-2.amazonaws.com/private_link_gcp_ts_02.png "private_link_gcp_ts_02")

### 既存のクラスターにプライベートエンドポイントを作成できますか？{#can-i-create-a-private-endpoint-for-an-existing-cluster}

はい。プライベートエンドポイントを作成すると、同じリージョンとプロジェクトに存在する既存および将来のすべての Dedicated (Enterprise) クラスターに適用されます。異なるクラスターに対して異なる DNS レコードを追加するだけで済みます。