---
title: "プライベートリンクのセットアップ (Azure) | Cloud"
slug: /setup-a-private-link-azure
sidebar_label: "プライベートリンクのセットアップ (Azure)"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloud クラスターから異なる Microsoft Azure VPC でホストされているサービスへのプライベートリンクをセットアップする手順を説明します。 | Cloud"
type: origin
token: W2fZwrrhVibvpGkd0MbcQGJQnib
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - プライベートリンク
  - privatelink
  - プライベートエンドポイント
  - プライベートサービス接続
  - aws
  - gcp
  - azure
  - ANNS
  - ベクトル検索
  - knnアルゴリズム
  - HNSW

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# プライベートリンクのセットアップ (Azure)

このガイドでは、Zilliz Cloud クラスターから異なる Microsoft Azure VPC でホストされているサービスへのプライベートリンクをセットアップする手順を説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Dedicated</strong> クラスターでのみ利用可能です。</p>

</Admonition>

プライベートリンクはプロジェクトレベルで設定され、同じクラウドプロバイダーとリージョンにデプロイされたすべてのクラスターに適用されます。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloud はプライベートリンクに対して料金を請求しません。ただし、クラウドプロバイダーは、Zilliz Cloud にアクセスするために作成する<a href="https://azure.microsoft.com/en-us/pricing/details/private-link/">各エンドポイントに対して料金を請求する</a>場合があります。</p>

</Admonition>

## 開始する前に{#before-you-start}

以下の条件が満たされていることを確認してください。

- このガイドで作成されるプライベートエンドポイントはグローバルにアクセス可能です。ターゲットの Zilliz Cloud クラスターとは異なるリージョンのサービスでも、クラスターに接続できます。

## プライベートエンドポイントの作成{#create-private-endpoint}

Zilliz Cloud は、プライベートエンドポイントを追加するための直感的なウェブコンソールを提供します。ターゲットプロジェクトに移動し、左側のナビゲーションで **Network > Private Endpoint** をクリックします。**+ Private Endpoint** をクリックします。

![PYylbfopjoFkiZxFlbucIFHkn8g](https://zdoc-images.s3.us-west-2.amazonaws.com/pyylbfopjofkizxflbucifhkn8g.png "PYylbfopjoFkiZxFlbucIFHkn8g")

### ステップ1: クラウドプロバイダーとリージョンの選択{#step-1-select-a-cloud-provider-and-region}

Azure リージョンにデプロイされたクラスターのプライベートエンドポイントを作成するには、**Cloud Provider** ドロップダウンリストから **Azure** を選択します。**Region** で、プライベートにアクセスしたいクラスターが配置されているリージョンを選択します。**Next** をクリックします。

利用可能なクラウドプロバイダーとリージョンの詳細については、[Cloud Providers & Regions](./cloud-providers-and-regions) を参照してください。

![CguAbg90loxAJ4x0cl6c58rqnvO](https://zdoc-images.s3.us-west-2.amazonaws.com/cguabg90loxaj4x0cl6c58rqnvo.png "CguAbg90loxAJ4x0cl6c58rqnvO")

### ステップ2: エンドポイントサービスの確立{#step-2-establish-an-endpoint-service}

![Z54SboHLyoKB1QxAG4Dcw7bEnOh](https://zdoc-images.s3.us-west-2.amazonaws.com/z54sbohlyokb1qxag4dcw7benoh.png "Z54SboHLyoKB1QxAG4Dcw7bEnOh")

[Microsoft Azure サブスクリプションページ](https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBladeV1)からコピーしたサブスクリプションIDを入力します。以下に例を示します。

![KmCYbkbpDoJHAkxDzN9cV1LOnng](https://zdoc-images.s3.us-west-2.amazonaws.com/kmcybkbpdojhakxdzn9cv1lonng.png "KmCYbkbpdoJHAkxDzN9cV1LOnng")

### ステップ3: エンドポイントの作成{#step-3-create-an-endpoint}

このステップは、クラウドプロバイダーのコンソールで完了する必要があります。

<Procedures>

1. [Private Link Center](https://portal.azure.com/#view/Microsoft_Azure_Network/PrivateLinkCenterBlade/~/privateendpoints) に移動し、**+ Create** をクリックします。

    ![TQB9bT5KKojscoxcOZbcZ4Q6nNf](https://zdoc-images.s3.us-west-2.amazonaws.com/tqb9bt5kkojscoxcozbcz4q6nnf.png "TQB9bT5KKojscoxcOZbcZ4Q6nNf")

1. 作成するプライベートエンドポイントの基本情報を入力します。

    ![ECcPbN4Kaog5bdxyed3cyP3HnHe](https://zdoc-images.s3.us-west-2.amazonaws.com/eccpbn4kaog5bdxyed3cyp3hnhe.png "ECcPbN4Kaog5bdxyed3cyp3hnhe")

1. **Next: Resource >** をクリックし、**Connect to an Azure resource by resource ID or alias** を選択します。次に、Zilliz Cloud コンソールからコピーしたものを **Resource ID or alias** に貼り付けます。

    ![TDJVb0pkWoxVPIxCThvct9Hpnae](https://zdoc-images.s3.us-west-2.amazonaws.com/tdjvb0pkwoxvpixcthvct9hpnae.png "TDJVb0pkWoxVPIxCThvct9Hpnae")

1. **Virtual network** と **Subnet** で適切な値を選択し、このタブの他の設定はデフォルトのままにします。

    ![SNdZbzo0EoP7PYxg1z4clUijnQg](https://zdoc-images.s3.us-west-2.amazonaws.com/sndzbzo0eop7pyxg1z4cluijnqg.png "SNdZbzo0EoP7PYxg1z4cluijnqg")

1. **Review + create** タブに到達するまで **Next** をクリックします。検証が成功したら、**Create** をクリックしてプライベートエンドポイントを作成します。

    ![FJ95b4S4voMavqxFWEac3JdinAc](https://zdoc-images.s3.us-west-2.amazonaws.com/fj95b4s4vomavqxfweac3jdinac.png "FJ95b4S4voMavqxFWEac3JdinAc")

1. デプロイが成功すると、以下が表示されます。

    ![QNHubedZWoJFe7xkX5ac5TOInzg](https://zdoc-images.s3.us-west-2.amazonaws.com/qnhubedzwojfe7xkx5ac5toinzg.png "QNHubedZWoJFe7xkX5ac5TOInzg")

1. **Go to resource** をクリックし、作成されたプライベートエンドポイントの概要ページを表示します。

1. **Overview** ページの右上隅にある **JSON View** をクリックします。**Connection Status** が **Pending** と表示されていることに注意してください。

    ![YYrobZKr4oFJJ8xNRYicL2PZnde](https://zdoc-images.s3.us-west-2.amazonaws.com/yyrobzkr4ofjj8xnryicl2pznde.png "YYrobZKr4oFJJ8xNRYicL2PZnde")

    **Resource JSON** パネルで、`name` と `properties.resourceGuid` の値をコピーします。エンドポイントIDは、これら2つの値をピリオド (`.`) で結合したものです。

    ![Vm7pbEGggo2tx6xirE3c9ZyRnSg](https://zdoc-images.s3.us-west-2.amazonaws.com/vm7pbegggo2tx6xire3c9zyrnsg.png "Vm7pbEGggo2tx6xirE3c9ZyRnSg")

    たとえば、`name` の値が `zilliz` で、`properties.resourceGuid` の値が `d73e9b55-7b9c-4f8d-8f0a-40e737f1ccbf` の場合、プライベートエンドポイントIDは `zilliz.d73e9b55-7b9c-4f8d-8f0a-40e737f1ccbf` となります。

</Procedures>

### ステップ4: エンドポイントの承認{#step-4-authorize-your-endpoint}

Azure コンソールから取得したエンドポイントIDを Zilliz Cloud の **Endpoint ID** ボックスに貼り付けます。**Create** をクリックします。

## プライベートリンクの取得{#obtain-a-private-link}

Zilliz Cloud は、お客様が提出した上記の属性を確認し、承認した後、このエンドポイントのプライベートリンクを割り当てます。このプロセスには約5分かかります。

プライベートリンクの準備が整うと、Zilliz Cloud の **Private Link** ページで確認できます。

## DNSのセットアップ{#set-up-dns}

Zilliz Cloud によって割り当てられたプライベートリンクを介してクラスターにアクセスする前に、DNS をセットアップする必要があります。

### ステップ1: Azure ポータルでプライベートDNSゾーンを作成する{#step-1-create-a-private-dns-zone-on-the-azure-portal}

<Procedures>

1. 作成したプライベートエンドポイントの **Overview** ページで、**Settings** > **DNS configuration** を選択し、プライベートエンドポイントとともに作成されたネットワークインターフェースの **IP address** をコピーします。

    ![GC9jbsUp2oXgCZxkojbcrmJanJb](https://zdoc-images.s3.us-west-2.amazonaws.com/gc9jbsup2oxgczxkojbcrmjanjb.png "GC9jbsUp2oXgCZxkojbcrmJanJb")

    上記のスクリーンショットの例の値は **10.0.0.4** です。

1. [プライベートDNSゾーンの作成](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FprivateDnsZones) に移動し、**+ Create** をクリックしてプロセスを開始します。

1. **Basics** タブで、上記で使用したサブスクリプションとリソースグループを選択し、Zilliz Cloud コンソールからコピーしたプライベートリンクURIを **Instance details** > **Name** に貼り付けます。次に、**Review create** をクリックします。

    ![QweWbLRSioY9Cix8nMUc0Q75n1e](https://zdoc-images.s3.us-west-2.amazonaws.com/qwewblrsioy9cix8nmuc0q75n1e.png "QweWbLRSioY9Cix8nMUc0Q75n1e")

1. 検証が成功したら、Create をクリックしてプロセスを開始します。

    ![LsmabNzrwoz9lvxJpKac2gEdnGG](https://zdoc-images.s3.us-west-2.amazonaws.com/lsmabnzrwoz9lvxjpkac2gedngg.png "LsmabNzrwoz9lvxjpkac2gedngg")

1. デプロイが成功すると、以下が表示されます。

    ![LGB3bC80FoQnXIxx527cVkTMnAe](https://zdoc-images.s3.us-west-2.amazonaws.com/lgb3bc80foqnxixx527cvktmnae.png "LGB3bC80FoQnXIxx527cVkTMnAe")

1. **Go to resource** をクリックして、作成されたプライベートDNSゾーンの **Overview** ページを表示します。

    ![M401b0RiNoauaHxbBH6crLXlnXc](https://zdoc-images.s3.us-west-2.amazonaws.com/m401b0rinoauahxbbh6crlxlnxc.png "M401b0RiNoauaHxbBH6crLXlnXc")

</Procedures>

### ステップ2: プライベートDNSゾーンを仮想ネットワークにリンクする{#step-2-link-the-private-dns-zone-to-your-virtual-network}

<Procedures>

1. 作成したプライベートDNSゾーンの概要ページで、左側のナビゲーションペインで **Settings** > **DNS Management** を選択します。

1. **+ Add** をクリックします。**Add virtual network link** ダイアログボックスで、**Link name** を入力し、上記で使用した **Subscription** と **Virtual network** を選択します。**Configuration** セクションで、**Enable auto registration** も選択します。

    ![KQZ2bvbbUodBlAxV98ccbrwxnWg](https://zdoc-images.s3.us-west-2.amazonaws.com/kqz2bvbbuodblaxv98ccbrwxnwg.png "KQZ2bvbbUodBlAxV98ccbrwxnWg")

    すべてが期待通りに設定されたら、**OK** をクリックして続行します。作成された仮想ネットワークリンクのリンクステータスは、デプロイが成功すると **Completed** に変わります。

    ![R84pbAxcKo24pDxQvlKcyxV7n4b](https://zdoc-images.s3.us-west-2.amazonaws.com/r84pbaxcko24pdxqvlkcyxv7n4b.png "R84pbAxcKo24pDxQvlKcyxV7n4b")

1. 左側のナビゲーションペインで **Overview** をクリックして、プライベートDNSゾーンの **Overview** ページに戻ります。

    ![S4bTb3ICwoWnlgxqSFrcYwEInvh](https://zdoc-images.s3.us-west-2.amazonaws.com/s4btb3icwownlgxqsfrcyweinvh.png "S4bTb3ICwoWnlgxqSFrcYwEInvh")

1. **+ Record set** をクリックします。**Add record set** ダイアログボックスで、**Name** にクラスターIDの末尾に `-privatelink` を付けたものを入力し、**Type** で **A - Address record** を選択し、**TTL** を **10 Minutes** に設定します。リストされているIPアドレスがメモしたものと一致するかどうかを確認します。

    ![DtFQb18jloG9JDxYg0AcSlRsn75](https://zdoc-images.s3.us-west-2.amazonaws.com/dtfqb18jlog9jdxyg0acslrsn75.png "DtFQb18jlog9jdxyg0acslrsn75")

    **OK** をクリックしてレコードセットを保存します。

    ![YWSZbd4qEoAW64xf9gHcamC8nyd](https://zdoc-images.s3.us-west-2.amazonaws.com/ywszbd4qeoaw64xf9ghcamc8nyd.png "YWSZbd4qEoAW64xf9gHcamC8nyd")

1. Azure ポータルの作成されたプライベートエンドポイントの概要ページに戻ると、プライベートエンドポイントの **Connection Status** が **Pending** から **Approved** に変わっていることがわかります。

    ![CqAEbOjDUogQGdxl3gjclaPAn1e](https://zdoc-images.s3.us-west-2.amazonaws.com/cqaebojduogqgdxl3gjclapan1e.png "CqAEbOjDUogQGdxl3gjclapan1e")

    これで、Azure 仮想ネットワーク内のリソースは、Zilliz Cloud クラスターにプライベートにアクセスできるようになります。

</Procedures>

## クラスターへのインターネットアクセスを管理する{#manage-internet-access-to-your-clusters}

プライベートエンドポイントを設定した後、クラスターのパブリックエンドポイントを無効にして、プロジェクトへのインターネットアクセスを制限することができます。パブリックエンドポイントを無効にすると、ユーザーはプライベートリンクを使用してのみクラスターに接続できます。

パブリックエンドポイントを無効にするには：

<Procedures>

1. ターゲットクラスターの **Cluster Details** ページに移動します。

1. **Connection** セクションに移動します。

1. クラスターのパブリックエンドポイントの横にある設定アイコンをクリックします。

1. 情報を読み、**Disable Public Endpoint** ダイアログボックスで **Disable** をクリックします。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>プライベートエンドポイントは、<a href="/reference/restful/data-plane-v2">データプレーン</a>アクセスにのみ影響します。<a href="/reference/restful/control-plane-v2">コントロールプレーン</a>は、引き続きパブリックインターネット経由でアクセスできます。</p></li>
<li><p>パブリックエンドポイントを再度有効にした後、パブリックエンドポイントにアクセスできるようになるまで、ローカルDNSキャッシュが期限切れになるのを待つ必要がある場合があります。</p></li>
</ul>

</Admonition>

![disable_public_endpoint](https://zdoc-images.s3.us-west-2.amazonaws.com/disable_public_endpoint.png "disable_public_endpoint")

## FAQ{#faq}

### 既存のクラスターにプライベートエンドポイントを作成できますか？{#can-i-create-a-private-endpoint-for-an-existing-cluster}

はい。プライベートエンドポイントを作成すると、同じリージョンとプロジェクトに存在する既存および将来のすべてのDedicated (Enterprise) クラスターに適用されます。異なるクラスターには異なるDNSレコードを追加するだけです。