---
title: "PrivateLink (AWS) の設定 | Cloud"
slug: /setup-a-private-link-aws
sidebar_key: setup-a-private-link-aws
sidebar_label: "PrivateLink (AWS) の設定"
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
  - private link
  - privatelink
  - private endpoint
  - private service connect
  - aws
  - gcp
  - azure

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# プライベートLink（AWS）の設定

このガイドでは、異なるAWS VPCにホストされたお客様のサービスからZilliz Cloudクラスターへのプライベートリンクを設定する手順を説明します。

<Admonition type="info" icon="📘" title="Notes">

この機能は**Dedicated**クラスターでのみ利用可能です。

</Admonition>

プライベートリンクはプロジェクトレベルで設定され、このプロジェクト内の同じクラウドプロバイダーおよびリージョンにデプロイされたすべてのクラスターに有効です。

<Admonition type="info" icon="📘" title="Notes">

Zilliz Cloudは、プライベートエンドポイントの作成および使用に対して料金を請求しません。ただし、お客様のクラウドプロバイダーは、Zilliz Cloudにアクセスするために作成した[各エンドポイントに対して料金を請求する](https://aws.amazon.com/privatelink/pricing/)場合があります。

</Admonition>

## 開始前に\{#before-you-start}

以下を確認してください。

- お客様のサービスとZilliz Cloudクラスターが異なるリージョンにあり、サービスがAWS プライベートLinkを介してクラスターにアクセスする必要がある場合は、[チケットを送信](https://support.zilliz.com/hc/en-us/requests/new)してください。リクエストを処理いたします。

## プライベートエンドポイントの作成\{#create-private-endpoint}

Zilliz Cloudでは、直感的なWebコンソールでプライベートエンドポイントを追加できます。対象のプロジェクトに移動し、左側のナビゲーションで**ネットワーク > プライベートエンドポイント**をクリックします。**+ プライベートエンドポイント**をクリックします。

![I02ibsAgioWpuLxwzHDcp1c2nge](https://zdoc-images.s3.us-west-2.amazonaws.com/i02ibsagiowpulxwzhdcp1c2nge.png "I02ibsAgioWpuLxwzHDcp1c2nge")

### ステップ1: クラウドプロバイダーとリージョンの選択\{#step-1-select-a-cloud-provider-and-region}

AWSリージョンにデプロイされたクラスターのプライベートエンドポイントを作成するには、**クラウドプロバイダー**のドロップダウンリストから**AWS**を選択します。**リージョン**では、プライベートにアクセスしたいクラスターを収容しているリージョンを選択します。**次へ**をクリックします。

利用可能なクラウドプロバイダーとリージョンの詳細については、[クラウドプロバイダーとリージョン](./cloud-providers-and-regions)を参照してください。

![NxuFbXh41oA53VxB4sPcfR9snVg](https://zdoc-images.s3.us-west-2.amazonaws.com/nxufbxh41oa53vxb4spcfr9snvg.png "NxuFbXh41oA53VxB4sPcfR9snVg")

### ステップ2: エンドポイントの作成\{#step-2-create-an-endpoint}

このステップは、UIコンソールまたはCLIを使用して、お客様のクラウドプロバイダーコンソールで完了する必要があります。

- **UIコンソール経由**

    ![AJlTbcoxNoXKBIxAxz6cYrkBnrc](https://zdoc-images.s3.us-west-2.amazonaws.com/ajltbcoxnoxkbixaxz6cyrkbnrc.png "AJlTbcoxNoXKBIxAxz6cYrkBnrc")

    <Procedures>

    1. **UIコンソール経由**タブに切り替え、**サービス名**をコピーします。

    1. AWSコンソールに移動し、右上隅でサービスが実行されているリージョンを選択します。次に、左側のナビゲーションで**エンドポイント**をクリックします。**エンドポイントの作成**をクリックします。

        <Admonition type="info" icon="📘" title="Notes">

        Zilliz Cloudクラスターにアクセスする必要があるサービスが配置されているリージョンを常に使用する必要があります。

        - サービスがZilliz Cloudクラスターをホストしているリージョンと同じリージョンで実行されている場合は、そのリージョンを使用します。

        - サービスがZilliz Cloudクラスターをホストしているリージョンとは異なるリージョンで実行されている場合は、サービスが実行されているリージョンを使用します。

        </Admonition>

        ![setup_private_link_window_aws](https://zdoc-images.s3.us-west-2.amazonaws.com/setup_private_link_window_aws.png "setup_private_link_window_aws")

    1. **エンドポイントの作成**ページで、エンドポイントの**タイプ**として**NLBおよびGWLBを使用するエンドポイントサービス**を選択します。

        ![create_endpoint_type_gcp](https://zdoc-images.s3.us-west-2.amazonaws.com/create_endpoint_type_gcp.png "create_endpoint_type_gcp")

    1. AWSコンソールに切り替えます。**サービス設定**で、Zilliz Cloud Webコンソールからコピーした**サービス名**を**サービス名**フィールドに貼り付けます。次に**サービスの確認**をクリックします。

        ![enter_service_name_gcp](https://zdoc-images.s3.us-west-2.amazonaws.com/enter_service_name_gcp.png "enter_service_name_gcp")

        <Admonition type="info" icon="📘" title="Notes">

        サービスがZilliz Cloudクラスターがホストされているリージョンとは異なるリージョンで動作している場合は、**クロスリージョンエンドポイントを有効化**を選択し、Zilliz Cloudクラスターが実行されているリージョンを選択していることを確認してください。次に**サービスの確認**をクリックします。

        次の図では、Zilliz Cloudクラスターが**欧州（フランクフルト）**で実行されていると仮定し、お客様のサービスが別のリージョンで実行されています。

        ![NX2AbfqBfokf1axbn4LchJfZnqS](https://zdoc-images.s3.us-west-2.amazonaws.com/nx2abfqbfokf1axbn4lchjfznqs.png "NX2AbfqBfokf1axbn4LchJfZnqS")

        </Admonition>

    1. サービス名が確認されたら、ネットワーク設定、サブネット、セキュリティグループを完了し、**作成**をクリックします。

    1. エンドポイントが正常に作成されたら、エンドポイントID（"vpce-"で始まる）をコピーします。

    </Procedures>

- **CLI経由**

    ![TzQdb9ReToZlkTxGRVZcCdUbnOe](https://zdoc-images.s3.us-west-2.amazonaws.com/tzqdb9retozlktxgrvzccdubnoe.png "TzQdb9ReToZlkTxGRVZcCdUbnOe")

    <Procedures>

    1. **CLI経由**タブに切り替えます。

    1. **VPC ID**を入力します。

        VPCを表示するには、[Amazon VPCコンソール](https://console.aws.amazon.com/vpc/)に移動します。ナビゲーションペインで**お客様のVPC**を選択します。目的のVPCを見つけ、そのIDをコピーします。このIDをZilliz Cloudの**VPC ID**に入力します。

        VPCを作成するには、[VPCの作成](https://docs.aws.amazon.com/vpc/latest/userguide/working-with-vpcs.html#Create-VPC)を参照してください。

    1. **サブネットID**を入力します。

        サブネットはVPCの細分化です。作成するプライベートエンドポイントと同じリージョンに存在するサブネットが必要です。サブネットを表示するには、[Amazon VPCコンソール](https://console.aws.amazon.com/vpc/)に移動します。現在のリージョンを、プライベートリンクの作成に指定したリージョンに変更します。ナビゲーションペインで**サブネット**を選択します。目的のサブネットを見つけ、そのIDをコピーします。このIDをZilliz Cloudの**サブネットID**に入力します。

        サブネットを作成するには、[VPC内にサブネットを作成する](https://docs.aws.amazon.com/vpc/latest/userguide/working-with-subnets.html#create-subnets)を参照してください。

    1. コードブロックのコピーアイコンをクリックし、AWSコンソールに移動します。

        上部のナビゲーションでAWS CloudShellを起動します。CloudShellで、Zilliz CloudからコピーしたCLIコマンドを実行します。

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

        返されたメッセージにて、作成されたVPCエンドポイントのVpcEndpointId（"vpce-"で始まる）をコピーします。

    </Procedures>

### ステップ 3: エンドポイントを承認する\{#step-3-authorize-your-endpoint}

AWSコンソールから取得したエンドポイントIDを、Zilliz Cloudの**エンドポイントID**ボックスに貼り付けます。**Create** をクリックします。

![setup_private_link_aws_authorize_endpoint](https://zdoc-images.s3.us-west-2.amazonaws.com/setup_private_link_aws_authorize_endpoint.png "setup_private_link_aws_authorize_endpoint")

## プライベートリンクを取得する\{#obtain-a-private-link}

送信したVPCエンドポイントの確認と承認後、Zilliz Cloudはこのエンドポイントにプライベートリンクを割り当てます。この処理には約5分かかります。

プライベートリンクの準備が完了すると、Zilliz Cloudの**プライベート Link**ページで確認できます。

## DNSレコードを設定する\{#set-up-a-dns-record}

Zilliz Cloudが割り当てたプライベートリンク経由でクラスターにアクセスする前に、DNSゾーンにCNAMEレコードを作成し、プライベートリンクをVPCエンドポイントのDNS名に解決する必要があります。

- **Amazon Route 53を使用してホストゾーンを作成する**

    Amazon Route 53はWebベースのDNSサービスです。ホストDNSゾーンを作成し、そこにDNSレコードを追加できるようにします。

    ![A1zxblLRPo96Kvx0zzccZ485nGb](https://zdoc-images.s3.us-west-2.amazonaws.com/a1zxbllrpo96kvx0zzccz485ngb.png "A1zxblLRPo96Kvx0zzccZ485nGb")

    <Procedures>

    1. AWSアカウントにログインし、[Hosted zones](https://us-east-1.console.aws.amazon.com/route53/v2/hostedzones#)に移動します。

    1. **Create hosted zone** をクリックします。

    1. **ホストゾーン設定**セクションで、以下のパラメータを設定します。

        <table>
           <tr>
             <th><p><strong>パラメータ名</strong></p></th>
             <th><p><strong>パラメータの説明</strong></p></th>
           </tr>
           <tr>
             <td><p><strong>Domain name</strong></p></td>
             <td><p>対象クラスターに対してZilliz Cloudが割り当てたプライベート Link。</p></td>
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

    エイリアスレコードは、エイリアス名を実際の正規ドメイン名にマッピングするDNSレコードの一種です。エイリアスレコードを作成し、Zilliz Cloudが割り当てたプライベートリンクをVPCエンドポイントのDNS名にマッピングします。これにより、プライベートリンクを使用してクラスターにプライベートアクセスできます。

    ![VoCsbJtTDo1glVx0vtGcqWPRnEd](https://zdoc-images.s3.us-west-2.amazonaws.com/vocsbjttdo1glvx0vtgcqwprned.png "VoCsbJtTDo1glVx0vtGcqWPRnEd")

    <Procedures>

    1. 作成したホストゾーンで、**Create record** をクリックします。

    1. **Create record**ページで、**エイリアス**をオンにし、Route traffic toを以下のように選択します：

        1. 最初のドロップダウンリストで**エイリアス to VPC endpoint**を選択します。

        1. 2番目のドロップダウンリストでクラウドリージョンを選択します。

        1. 上記で作成したエンドポイントの名前を入力します。

    1. **Create records** をクリックします。

    </Procedures>

## クラスターへのインターネットアクセスを管理する\{#manage-internet-access-to-your-clusters}

プライベートエンドポイントの設定後、クラスターのパブリックエンドポイントを無効化してプロジェクトへのインターネットアクセスを制限することを選択できます。パブリックエンドポイントを無効化すると、ユーザーはプライベートリンクのみを使用してクラスターに接続できます。

パブリックエンドポイントを無効化するには：

<Procedures>

1. 対象クラスターの**クラスターの詳細**ページに移動します。

1. **Connect**セクションに移動します。

1. クラスターのパブリックエンドポイントの横にある設定アイコンをクリックします。

1. 情報を確認し、**Disable Public Endpoint**ダイアログボックスで**Disable** をクリックします。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

- プライベートエンドポイントは[data plane](/reference/restful/data-plane-v2)アクセスにのみ影響します。[Control plane](/reference/restful/control-plane-v2)は引き続きパブリックインターネット経由でアクセスできます。

- パブリックエンドポイントを再度有効化した後、パブリックエンドポイントにアクセスできるようになるまで、ローカルのDNSキャッシュが期限切れになるのを待つ必要がある場合があります。

</Admonition>

![disable_public_endpoint](https://zdoc-images.s3.us-west-2.amazonaws.com/disable_public_endpoint.png "disable_public_endpoint")

## FAQ\{#faq}

### AWS上のプライベートリンクに接続すると、なぜ常にタイムアウトが報告されるのですか？\{#why-does-it-always-report-a-timeout-when-connecting-to-the-private-link-on-aws}

タイムアウトは通常、以下の理由で発生します：

- プライベートDNSレコードが存在しない。

    DNSレコードが存在する場合、以下のようにプライベートリンクをpingできます：

    ![QOanbDGrYovMXHxczXmcCbUcnsc](https://zdoc-images.s3.us-west-2.amazonaws.com/qoanbdgryovmxhxczxmccbucnsc.png "QOanbDGrYovMXHxczXmcCbUcnsc")

    <Admonition type="info" icon="📘" title="Notes">

    pingリクエストの出力でVPCエンドポイントのIPアドレスが正しく解決されている場合、DNSレコードは正常に機能しています。

    </Admonition>

    以下が表示される場合は、[DNSレコードの設定](./setup-a-private-link-aws#set-up-a-dns-record)が必要です。

    ![X5ahblpw1oRxp8xKR3OczuD9nFf](https://zdoc-images.s3.us-west-2.amazonaws.com/x5ahblpw1orxp8xkr3oczud9nff.png "X5ahblpw1oRxp8xKR3OczuD9nFf")

- セキュリティグループルールが存在しない、または無効である。

    AWSコンソールで、EC2インスタンスからVPCエンドポイントへのトラフィックに対して、セキュリティグループルールを適切に設定する必要があります。VPC内の適切なセキュリティグループは、プライベートリンクに付加されたポート上でEC2インスタンスからのインバウンドアクセスを許可する必要があります。

    `curl`コマンドを使用してプライベートリンクの接続性をテストできます。正常な場合、400レスポンスが返されます。

    ![ERtlbR2v7oA3Q4xXRlccM3VhnNc](https://zdoc-images.s3.us-west-2.amazonaws.com/ertlbr2v7oa3q4xxrlccm3vhnnc.png "ERtlbR2v7oA3Q4xXRlccM3VhnNc")

    以下のスクリーンショットのように`curl`コマンドが応答なく停止する場合は、[Create a VPC endpoint](https://docs.amazonaws.cn/en_us/vpc/latest/privatelink/create-interface-endpoint.html)のステップ9を参照して、適切なセキュリティグループルールを設定する必要があります。

    ![KHj0bEy7ZojM6axnR0ocg1LPnue](https://zdoc-images.s3.us-west-2.amazonaws.com/khj0bey7zojm6axnr0ocg1lpnue.png "KHj0bEy7ZojM6axnR0ocg1LPnue")

    <Admonition type="info" icon="📘" title="Notes">

    2つのセキュリティグループを設定する必要があります：1つはEC2インスタンス用で、プライベートリンクに関連付けられたポート上のトラフィックを許可する必要があり、もう1つはVPCエンドポイント用で、EC2インスタンスのIPアドレスからのトラフィックを許可し、指定されたポート番号を対象とする必要があります。

    </Admonition>

### 既存のクラスターにプライベートエンドポイントを作成できますか？\{#can-i-create-a-private-endpoint-for-an-existing-cluster}

はい。プライベートエンドポイントを作成すると、同じリージョンとプロジェクト内のすべての既存および将来のDedicated (Enterprise)クラスターに適用されます。必要なのは、異なるクラスターに対して異なるDNSレコードを追加することだけです。

