---
title: "PrivateLink（AWS）の設定 | Cloud"
slug: /setup-a-private-link-aws
sidebar_key: setup-a-private-link-aws
sidebar_label: "PrivateLink（AWS）を設定"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloud クラスターから異なる AWS VPC にホストされているサービスへのプライベートリンクを設定する手順を説明します。"
type: origin
token: GBY6wbUmwi9lLjkXSuKccODgnne
sidebar_position: 1
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

# プライベートLink（AWS）の設定

このガイドでは、Zilliz Cloud クラスターから、異なる AWS VPC にホストされているお客様のサービスへのプライベートリンクの設定手順を説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は <strong>Dedicated</strong> クラスターでのみ利用可能です。</p>

</Admonition>

プライベートリンクはプロジェクトレベルで設定され、このプロジェクト内の同じクラウドプロバイダーおよびリージョンにデプロイされたすべてのクラスターに有効です。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloud は、プライベートエンドポイントの作成および使用に対して料金を請求しません。ただし、クラウドプロバイダーは、Zilliz Cloud にアクセスするために作成した <a href="https://aws.amazon.com/privatelink/pricing/">各エンドポイントに対して料金を請求する場合があります</a>。</p>

</Admonition>

## 開始前に\{#before-you-start}

以下を確認してください。

- お客様のサービスと Zilliz Cloud クラスターが異なるリージョンにあり、サービスが AWS プライベートLink を介してクラスターにアクセスする必要がある場合は、[チケットを送信](https://support.zilliz.com/hc/en-us/requests/new) してください。リクエストを処理いたします。

## プライベートエンドポイントの作成\{#create-private-endpoint}

Zilliz Cloud では、直感的な Web コンソールを使用してプライベートエンドポイントを追加できます。対象のプロジェクトに移動し、左側のナビゲーションから **ネットワーク > プライベートエンドポイント** をクリックします。**+ プライベートエンドポイント** をクリックします。

![I02ibsAgioWpuLxwzHDcp1c2nge](https://zdoc-images.s3.us-west-2.amazonaws.com/i02ibsagiowpulxwzhdcp1c2nge.png "I02ibsAgioWpuLxwzHDcp1c2nge")

### ステップ 1: クラウドプロバイダーとリージョンの選択\{#step-1-select-a-cloud-provider-and-region}

AWS リージョンにデプロイされたクラスターのプライベートエンドポイントを作成するには、**クラウドプロバイダー** ドロップダウンリストから **AWS** を選択します。**リージョン** では、プライベートにアクセスしたいクラスターが配置されているリージョンを選択します。**次へ** をクリックします。

利用可能なクラウドプロバイダーとリージョンの詳細については、[クラウドプロバイダーとリージョン](./cloud-providers-and-regions) を参照してください。

![NxuFbXh41oA53VxB4sPcfR9snVg](https://zdoc-images.s3.us-west-2.amazonaws.com/nxufbxh41oa53vxb4spcfr9snvg.png "NxuFbXh41oA53VxB4sPcfR9snVg")

### ステップ 2: エンドポイントの作成\{#step-2-create-an-endpoint}

このステップは、UI コンソールまたは CLI を使用して、お客様のクラウドプロバイダーコンソールで完了する必要があります。

- **UIコンソール経由**

    ![AJlTbcoxNoXKBIxAxz6cYrkBnrc](https://zdoc-images.s3.us-west-2.amazonaws.com/ajltbcoxnoxkbixaxz6cyrkbnrc.png "AJlTbcoxNoXKBIxAxz6cYrkBnrc")

    <Procedures>

    1. **UIコンソール経由** タブに切り替え、**サービス名** をコピーします。

    1. AWS コンソールに移動し、右上隅でサービスが実行されているリージョンを選択します。次に、左側のナビゲーションから **エンドポイント** をクリックします。**エンドポイントの作成** をクリックします。

        <Admonition type="info" icon="📘" title="Notes">

        <p>Zilliz Cloud クラスターにアクセスする必要があるサービスが配置されているリージョンを常に使用する必要があります。</p>
        <ul>
        <li><p>お客様のサービスが Zilliz Cloud クラスターをホストしているリージョンと同じリージョンで実行されている場合は、そのリージョンを使用します。</p></li>
        <li><p>お客様のサービスが Zilliz Cloud クラスターをホストしているリージョンとは異なるリージョンで実行されている場合は、サービスが実行されているリージョンを使用します。</p></li>
        </ul>

        </Admonition>

        ![setup_private_link_window_aws](https://zdoc-images.s3.us-west-2.amazonaws.com/setup_private_link_window_aws.png "setup_private_link_window_aws")

    1. **エンドポイントの作成** ページで、エンドポイント **タイプ** として **NLB および GWLB を使用するエンドポイントサービス** を選択します。

        ![create_endpoint_type_gcp](https://zdoc-images.s3.us-west-2.amazonaws.com/create_endpoint_type_gcp.png "create_endpoint_type_gcp")

    1. AWS コンソールに切り替えます。**サービス設定** で、Zilliz Cloud Web コンソールからコピーした **サービス名** を **サービス名** フィールドに貼り付けます。次に **サービスの確認** をクリックします。

        ![enter_service_name_gcp](https://zdoc-images.s3.us-west-2.amazonaws.com/enter_service_name_gcp.png "enter_service_name_gcp")

        <Admonition type="info" icon="📘" title="Notes">

        <p>お客様のサービスが Zilliz Cloud クラスターがホストされているリージョンとは異なるリージョンで動作している場合は、<strong>クロスリージョンエンドポイントを有効化</strong> を選択し、Zilliz Cloud クラスターが実行されているリージョンを選択していることを確認してください。次に <strong>サービスの確認</strong> をクリックします。</p>
        <p>次の図では、Zilliz Cloud クラスターが <strong>欧州（フランクフルト）</strong> で実行されているものとして、お客様のサービスが別のリージョンで実行されています。</p>
        <p><img src="https://zdoc-images.s3.us-west-2.amazonaws.com/nx2abfqbfokf1axbn4lchjfznqs.png" alt="NX2AbfqBfokf1axbn4LchJfZnqS" title="NX2AbfqBfokf1axbn4LchJfZnqS" /></p>

        </Admonition>

    1. サービス名が確認されたら、ネットワーク設定、サブネット、セキュリティグループを完了し、**作成** をクリックします。

    1. エンドポイントが正常に作成されたら、エンドポイントID（"vpce-" で始まる）をコピーします。

    </Procedures>

- **CLI経由**

    ![TzQdb9ReToZlkTxGRVZcCdUbnOe](https://zdoc-images.s3.us-west-2.amazonaws.com/tzqdb9retozlktxgrvzccdubnoe.png "TzQdb9ReToZlkTxGRVZcCdUbnOe")

    <Procedures>

    1. **CLI経由** タブに切り替えます。

    1. **VPC ID** を入力します。

        お客様のVPC を表示するには、[Amazon VPC コンソール](https://console.aws.amazon.com/vpc/) に移動します。ナビゲーションペインで **お客様のVPC** を選択します。目的の VPC を見つけてその ID をコピーします。この ID を Zilliz Cloud の **VPC ID** に入力します。

        VPC を作成するには、[VPC の作成](https://docs.aws.amazon.com/vpc/latest/userguide/working-with-vpcs.html#Create-VPC) を参照してください。

    1. **サブネットID** を入力します。

        サブネットはお客様のVPC の細分化です。作成するプライベートエンドポイントと同じリージョンに存在するサブネットが必要です。サブネットを表示するには、[Amazon VPC コンソール](https://console.aws.amazon.com/vpc/) に移動します。現在のリージョンを、プライベートリンクの作成に指定したリージョンに変更します。ナビゲーションペインで **サブネット** を選択します。目的のサブネットを見つけてその ID をコピーします。この ID を Zilliz Cloud の **サブネットID** に入力します。

        サブネットを作成するには、[VPC にサブネットを作成する](https://docs.aws.amazon.com/vpc/latest/userguide/working-with-subnets.html#create-subnets) を参照してください。

    1. コードブロックのコピーアイコンをクリックし、AWS コンソールに移動します。

        上部のナビゲーションで AWS CloudShell を起動します。CloudShell で、Zilliz Cloud からコピーした CLI コマンドを実行します。

        ![setup_private_link_aws_cloud_shell](https://zdoc-images.s3.us-west-2.amazonaws.com/setup_private_link_aws_cloud_shell.png "setup_private_link_aws_cloud_shell")

        返されるメッセージは次のようになります。

        ```json
        {
            "VpcEndpoint": {
                # Copy this and fill it in "Your VPC Private Link ID"
                "VpcEndpointId": "vpce-0ce90d01341533a5c",
                "VpcEndpointType": "Interface",
                ...
                "DnsEntries": [
                    {
                        # Copy this one and use it as "VPCE_DNS" in the next step.
                        "DnsName": "vpce-0ce90d01341533a5c-ngbqfdnj.vpce-svc-0b62964bfd0edfb74.us-west-2.vpce.amazonaws.com",
                        "HostedZoneId": "Z1YSA3EXCYUU9Z"
                    },
                    {
                        "DnsName": "vpce-0ce90d01341533a5c-ngbqfdnj-us-west-2a.vpce-svc-0b62964bfd0edfb74.us-west-2.vpce.amazonaws.com",
                        "HostedZoneId": "Z1YSA3EXCYUU9Z"
                    }
                ]
        }
        ```

        返されたメッセージで、作成されたVPCエンドポイントのVpcEndpointId（"vpce-"で始まる）をコピーします。

    </Procedures>

### ステップ 3: エンドポイントを承認する\{#step-3-authorize-your-endpoint}

AWSコンソールから取得したエンドポイントIDを、Zilliz Cloudの**エンドポイントID**ボックスに貼り付けます。**Create** をクリックします。

![setup_private_link_aws_authorize_endpoint](https://zdoc-images.s3.us-west-2.amazonaws.com/setup_private_link_aws_authorize_endpoint.png "setup_private_link_aws_authorize_endpoint")

## プライベートリンクを取得する\{#obtain-a-private-link}

送信したVPCエンドポイントを確認して承認後、Zilliz Cloudはこのエンドポイント用にプライベートリンクを割り当てます。この処理には約5分かかります。

プライベートリンクの準備ができたら、Zilliz Cloudの**プライベート Link**ページで確認できます。

## DNSレコードを設定する\{#set-up-a-dns-record}

Zilliz Cloudが割り当てたプライベートリンクを介してクラスターにアクセスする前に、DNSゾーンにCNAMEレコードを作成し、プライベートリンクをVPCエンドポイントのDNS名に解決する必要があります。

- **Amazon Route 53を使用してホストゾーンを作成する**

    Amazon Route 53は、WebベースのDNSサービスです。ホストDNSゾーンを作成して、そこにDNSレコードを追加できるようにします。

    ![A1zxblLRPo96Kvx0zzccZ485nGb](https://zdoc-images.s3.us-west-2.amazonaws.com/a1zxbllrpo96kvx0zzccz485ngb.png "A1zxblLRPo96Kvx0zzccZ485nGb")

    <Procedures>

    1. AWSアカウントにログインし、[Hosted zones](https://us-east-1.console.aws.amazon.com/route53/v2/hostedzones#) に移動します。

    1. **Create hosted zone** をクリックします。

    1. **ホストゾーン設定**セクションで、以下のパラメータを設定します。

        <table>
           <tr>
             <th><p><strong>パラメータ名</strong></p></th>
             <th><p><strong>パラメータの説明</strong></p></th>
           </tr>
           <tr>
             <td><p><strong>Domain name</strong></p></td>
             <td><p>対象クラスター用にZilliz Cloudが割り当てたプライベートリンク。</p></td>
           </tr>
           <tr>
             <td><p><strong>Description</strong></p></td>
             <td><p>ホストゾーンを区別するための説明。</p></td>
           </tr>
           <tr>
             <td><p><strong>Type</strong></p></td>
             <td><p><strong>プライベート hosted zone</strong>を選択します。</p></td>
           </tr>
        </table>

    1. VPCs to associate with the hosted zoneセクションで、VPC IDを追加してホストゾーンに関連付けます。

    </Procedures>

- **ホストゾーンにエイリアスレコードを作成する**

    エイリアスレコードは、エイリアス名を実際の正規ドメイン名にマッピングするDNSレコードの一種です。エイリアスレコードを作成して、Zilliz Cloudが割り当てたプライベートリンクをVPCエンドポイントのDNS名にマッピングします。これにより、プライベートリンクを使用してクラスターにプライベートにアクセスできます。

    ![VoCsbJtTDo1glVx0vtGcqWPRnEd](https://zdoc-images.s3.us-west-2.amazonaws.com/vocsbjttdo1glvx0vtgcqwprned.png "VoCsbJtTDo1glVx0vtGcqWPRnEd")

    <Procedures>

    1. 作成したホストゾーンで、**Create record** をクリックします。

    1. **Create record**ページで、**エイリアス**をオンにし、Route traffic toを以下のように選択します：

        1. 最初のドロップダウンリストで、**VPCエンドポイントへのエイリアス**を選択します。

        1. 2番目のドロップダウンリストで、クラウドリージョンを選択します。

        1. 上記で作成したエンドポイントの名前を入力します。

    1. **Create records** をクリックします。

    </Procedures>

## クラスターへのインターネットアクセスを管理する\{#manage-internet-access-to-your-clusters}

プライベートエンドポイントを設定した後、クラスターのパブリックエンドポイントを無効にして、プロジェクトへのインターネットアクセスを制限することを選択できます。パブリックエンドポイントを無効にすると、ユーザーはプライベートリンクを使用してのみクラスターに接続できます。

パブリックエンドポイントを無効にするには：

<Procedures>

1. 対象クラスターの**クラスターの詳細**ページに移動します。

1. **Connect**セクションに移動します。

1. クラスターのパブリックエンドポイントの横にある設定アイコンをクリックします。

1. 情報を確認し、**Disable Public Endpoint**ダイアログボックスで**Disable** をクリックします。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>プライベートエンドポイントは<a href="/reference/restful/data-plane-v2">データプレーン</a>のアクセスにのみ影響します。<a href="/reference/restful/control-plane-v2">コントロールプレーン</a>は引き続きパブリックインターネット経由でアクセスできます。</p></li>
<li><p>パブリックエンドポイントを再度有効にした後、パブリックエンドポイントにアクセスできるようになるまで、ローカルのDNSキャッシュが期限切れになるのを待つ必要がある場合があります。</p></li>
</ul>

</Admonition>

![disable_public_endpoint](https://zdoc-images.s3.us-west-2.amazonaws.com/disable_public_endpoint.png "disable_public_endpoint")

## FAQ\{#faq}

### AWS上のプライベートリンクに接続すると、なぜ常にタイムアウトが報告されるのですか？\{#why-does-it-always-report-a-timeout-when-connecting-to-the-private-link-on-aws}

タイムアウトは通常、以下の理由で発生します：

- プライベートDNSレコードが存在しない。

    DNSレコードが存在する場合、以下のようにプライベートリンクをpingできます：

    ![QOanbDGrYovMXHxczXmcCbUcnsc](https://zdoc-images.s3.us-west-2.amazonaws.com/qoanbdgryovmxhxczxmccbucnsc.png "QOanbDGrYovMXHxczXmcCbUcnsc")

    <Admonition type="info" icon="📘" title="Notes">

    <p>pingリクエストの出力でVPCエンドポイントのIPアドレスが正しく解決されている場合、DNSレコードは正常に動作しています。 </p>

    </Admonition>

    以下が表示される場合は、[DNSレコードの設定](./setup-a-private-link-aws#set-up-a-dns-record)が必要です。

    ![X5ahblpw1oRxp8xKR3OczuD9nFf](https://zdoc-images.s3.us-west-2.amazonaws.com/x5ahblpw1orxp8xkr3oczud9nff.png "X5ahblpw1oRxp8xKR3OczuD9nFf")

- セキュリティグループのルールが存在しない、または無効である。

    AWSコンソールで、EC2インスタンスからVPCエンドポイントへのトラフィック用にセキュリティグループのルールを適切に設定する必要があります。VPC内の適切なセキュリティグループは、プライベートリンクに付加されたポート上でEC2インスタンスからのインバウンドアクセスを許可する必要があります。

    `curl`コマンドを使用して、プライベートリンクの接続性をテストできます。正常な場合、400レスポンスが返されます。

    ![ERtlbR2v7oA3Q4xXRlccM3VhnNc](https://zdoc-images.s3.us-west-2.amazonaws.com/ertlbr2v7oa3q4xxrlccm3vhnnc.png "ERtlbR2v7oA3Q4xXRlccM3VhnNc")

    以下のスクリーンショットのように、`curl`コマンドが応答なしでハングする場合は、[Create a VPC endpoint](https://docs.amazonaws.cn/en_us/vpc/latest/privatelink/create-interface-endpoint.html)のステップ9を参照して、適切なセキュリティグループのルールを設定する必要があります。

    ![KHj0bEy7ZojM6axnR0ocg1LPnue](https://zdoc-images.s3.us-west-2.amazonaws.com/khj0bey7zojm6axnr0ocg1lpnue.png "KHj0bEy7ZojM6axnR0ocg1LPnue")

    <Admonition type="info" icon="📘" title="Notes">

    <p>2つのセキュリティグループを設定する必要があります：1つはEC2インスタンス用で、プライベートリンクに関連付けられたポート上のトラフィックを許可する必要があり、もう1つはVPCエンドポイント用で、EC2インスタンスのIPアドレスからのトラフィックを許可し、指定されたポート番号を対象とする必要があります。</p>

    </Admonition>

### 既存のクラスターにプライベートエンドポイントを作成できますか？\{#can-i-create-a-private-endpoint-for-an-existing-cluster}

はい。プライベートエンドポイントを作成すると、同じリージョンとプロジェクト内にあるすべての既存および将来のDedicated（Enterprise）クラスターに適用されます。必要なのは、異なるクラスターに対して異なるDNSレコードを追加することだけです。

