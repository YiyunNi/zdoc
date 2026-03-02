---
title: "PrivateLink (AWS) のセットアップ | Cloud"
slug: /setup-a-private-link-aws
sidebar_label: "PrivateLink (AWS) のセットアップ"
beta: FALSE
notebook: FALSE
description: "このガイドでは、Zilliz Cloud クラスターから異なる AWS VPC でホストされているサービスへのプライベートリンクを設定する手順を説明します。 | Cloud"
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
  - プライベートサービス接続
  - aws
  - gcp
  - azure
  - milvus
  - Zilliz
  - milvus ベクトルデータベース
  - milvus db

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# PrivateLink (AWS) をセットアップする

このガイドでは、Zilliz Cloud クラスターから異なる AWS VPC でホストされているサービスへのプライベートリンクをセットアップする手順を説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Dedicated</strong> クラスターでのみ利用可能です。</p>

</Admonition>

プライベートリンクはプロジェクトレベルで設定され、このプロジェクトの下で同じクラウドプロバイダーとリージョンにデプロイされたすべてのクラスターに有効です。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloud は、プライベートエンドポイントの作成と使用に対して課金しません。ただし、クラウドプロバイダーは、Zilliz Cloud にアクセスするために作成する各エンドポイントに対して<a href="https://aws.amazon.com/privatelink/pricing/">課金する</a>場合があります。</p>

</Admonition>

## 開始する前に{#before-you-start}

以下を確認してください。

- サービスと Zilliz Cloud クラスターが異なるリージョンにあり、サービスが AWS PrivateLink を介してクラスターにアクセスする必要がある場合は、[チケットを送信](https://support.zilliz.com/hc/en-us/requests/new)してください。当社がお客様のリクエストを処理します。

## プライベートエンドポイントを作成する{#create-private-endpoint}

Zilliz Cloud は、プライベートエンドポイントを追加するための直感的なウェブコンソールを提供します。ターゲットプロジェクトに移動し、左側のナビゲーションで **Network > Private Endpoint** をクリックします。**+ Private Endpoint** をクリックします。

![I02ibsAgioWpuLxwzHDcp1c2nge](https://zdoc-images.s3.us-west-2.amazonaws.com/i02ibsagiowpulxwzhdcp1c2nge.png "I02ibsAgioWpuLxwzHDcp1c2nge")

### ステップ 1: クラウドプロバイダーとリージョンを選択する{#step-1-select-a-cloud-provider-and-region}

AWS リージョンにデプロイされたクラスターのプライベートエンドポイントを作成するには、**Cloud Provider** ドロップダウンリストから **AWS** を選択します。**Region** で、プライベートにアクセスしたいクラスターを収容するリージョンを選択します。**Next** をクリックします。

利用可能なクラウドプロバイダーとリージョンの詳細については、[Cloud Providers & Regions](./cloud-providers-and-regions) を参照してください。

![NxuFbXh41oA53VxB4sPcfR9snVg](https://zdoc-images.s3.us-west-2.amazonaws.com/nxufbxh41oa53vxb4spcfr9snvg.png "NxuFbXh41oA53VxB4sPcfR9snVg")

### ステップ 2: エンドポイントを作成する{#step-2-create-an-endpoint}

このステップは、UI コンソールまたは CLI を使用して、クラウドプロバイダーコンソールで完了する必要があります。

- **UI コンソール経由**

    ![AJlTbcoxNoXKBIxAxz6cYrkBnrc](https://zdoc-images.s3.us-west-2.amazonaws.com/ajltbcoxnoxkbixaxz6cyrkbnrc.png "AJlTbcoxNoXKBIxAxz6cYrkBnrc")

    <Procedures>

    1. **Via UI Console** タブに切り替え、**Service Name** をコピーします。

    1. AWS コンソールに移動し、右上隅でサービスが実行されているリージョンを選択します。次に、左側のナビゲーションで **Endpoints** をクリックします。**Create Endpoint** をクリックします。

        <Admonition type="info" icon="📘" title="Notes">

        <p>Zilliz Cloud クラスターへのアクセスが必要なサービスが配置されているリージョンを常に使用する必要があります。</p>
        <ul>
        <li><p>サービスが Zilliz Cloud クラスターをホストしているリージョンと同じリージョンで実行されている場合は、そのリージョンを使用します。</p></li>
        <li><p>サービスが Zilliz Cloud クラスターをホストしているリージョンとは異なるリージョンで実行されている場合は、サービスが実行されているリージョンを使用します。</p></li>
        </ul>

        </Admonition>

        ![setup_private_link_window_aws](https://zdoc-images.s3.us-west-2.amazonaws.com/setup_private_link_window_aws.png "setup_private_link_window_aws")

    1. **Create Endpoint** ページで、エンドポイントの **Type** として **Endpoint services that use NLBs and GWLBs** を選択します。

        ![create_endpoint_type_gcp](https://zdoc-images.s3.us-west-2.amazonaws.com/create_endpoint_type_gcp.png "create_endpoint_type_gcp")

    1. AWS コンソールに切り替えます。**Service Settings** で、Zilliz Cloud ウェブコンソールからコピーした **Service Name** を **Service Name** フィールドに貼り付けます。次に、**Verify service** をクリックします。

        ![enter_service_name_gcp](https://zdoc-images.s3.us-west-2.amazonaws.com/enter_service_name_gcp.png "enter_service_name_gcp")

        <Admonition type="info" icon="📘" title="Notes">

        <p>サービスが Zilliz Cloud クラスターがホストされているリージョンとは異なるリージョンで動作している場合は、<strong>Enable Cross Region endpoint</strong> を選択し、Zilliz Cloud クラスターが実行されているリージョンを選択していることを確認してください。次に、<strong>Verify service</strong> をクリックします。</p>
        <p>次の図では、Zilliz Cloud クラスターは<strong>ヨーロッパ (フランクフルト)</strong> で実行されており、サービスは別のリージョンで実行されていると仮定しています。</p>
        <p><img src="https://zdoc-images.s3.us-west-2.amazonaws.com/nx2abfqbfokf1axbn4lchjfznqs.png" alt="NX2AbfqBfokf1axbn4LchJfZnqS" title="NX2AbfqBfokf1axbn4LchJfZnqS" /></p>

        </Admonition>

    1. サービス名が検証されたら、ネットワーク設定、サブネット、セキュリティグループを完了し、**Create** をクリックします。

    1. エンドポイントが正常に作成されたら、エンドポイント ID (「vpce-」で始まる) をコピーします。

    </Procedures>

- **CLI 経由**

    ![TzQdb9ReToZlkTxGRVZcCdUbnOe](https://zdoc-images.s3.us-west-2.amazonaws.com/tzqdb9retozlktxgrvzccdubnoe.png "TzQdb9ReToZlkTxGRVZcCdUbnOe")

    <Procedures>

    1. **Via CLI** タブに切り替えます。

    1. **VPC ID** を入力します。

        VPC を表示するには、[Amazon VPC コンソール](https://console.aws.amazon.com/vpc/)に移動します。ナビゲーションペインで、**Your VPCs** を選択します。目的の VPC を見つけて、その ID をコピーします。この ID を Zilliz Cloud の **VPC ID** に入力します。

        VPC を作成するには、[Create a VPC](https://docs.aws.amazon.com/vpc/latest/userguide/working-with-vpcs.html#Create-VPC) を参照してください。

    1. **Subnet IDs** を入力します。

        サブネットは VPC のサブディビジョンです。作成するプライベートエンドポイントと同じリージョンに存在するサブネットが必要です。サブネットを表示するには、[Amazon VPC コンソール](https://console.aws.amazon.com/vpc/)に移動します。現在のリージョンをプライベートリンク作成用に指定されたリージョンに変更します。ナビゲーションペインで、**Subnets** を選択します。目的のサブネットを見つけて、その ID をコピーします。この ID を Zilliz Cloud の **Subnet IDs** に入力します。

        サブネットを作成するには、[Create a Subnet in Your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/working-with-subnets.html#create-subnets) を参照してください。

    1. コードブロックのコピーアイコンをクリックし、AWS コンソールに移動します。

        上部のナビゲーションで、AWS CloudShell を起動します。Zilliz Cloud からコピーした CLI コマンドを CloudShell で実行します。

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

        返されたメッセージで、作成したVPCエンドポイントのVpcEndpointId（「vpce-」で始まる）をコピーします。

    </Procedures>

### ステップ3：エンドポイントを承認する{#step-3-authorize-your-endpoint}

AWSコンソールから取得したエンドポイントIDをZilliz Cloudの**Endpoint ID**ボックスに貼り付けます。**Create**をクリックします。

![setup_private_link_aws_authorize_endpoint](https://zdoc-images.s3.us-west-2.amazonaws.com/setup_private_link_aws_authorize_endpoint.png "setup_private_link_aws_authorize_endpoint")

## プライベートリンクを取得する{#obtain-a-private-link}

送信したVPCエンドポイントを確認して承認した後、Zilliz Cloudはこのエンドポイントにプライベートリンクを割り当てます。このプロセスには約5分かかります。

プライベートリンクの準備が整うと、Zilliz Cloudの**Private Link**ページで確認できます。

## DNSレコードを設定する{#set-up-a-dns-record}

Zilliz Cloudによって割り当てられたプライベートリンクを介してクラスターにアクセスする前に、プライベートリンクをVPCエンドポイントのDNS名に解決するために、DNSゾーンにCNAMEレコードを作成する必要があります。

- **Amazon Route 53を使用してホストゾーンを作成する**

    Amazon Route 53はウェブベースのDNSサービスです。DNSレコードを追加できるように、ホストされたDNSゾーンを作成します。

    ![A1zxblLRPo96Kvx0zzccZ485nGb](https://zdoc-images.s3.us-west-2.amazonaws.com/a1zxbllrpo96kvx0zzccz485ngb.png "A1zxblLRPo96Kvx0zzccZ485nGb")

    <Procedures>

    1. AWSアカウントにログインし、[Hosted zones](https://us-east-1.console.aws.amazon.com/route53/v2/hostedzones#)に移動します。

    1. **Create hosted zone**をクリックします。

    1. **Hosted zone configuration**セクションで、以下のパラメータを設定します。

        <table>
           <tr>
             <th><p><strong>パラメータ名</strong></p></th>
             <th><p><strong>パラメータの説明</strong></p></th>
           </tr>
           <tr>
             <td><p><strong>Domain name</strong></p></td>
             <td><p>ターゲットクラスター用にZilliz Cloudによって割り当てられたプライベートリンク。</p></td>
           </tr>
           <tr>
             <td><p><strong>Description</strong></p></td>
             <td><p>ホストゾーンを区別するために使用される説明。</p></td>
           </tr>
           <tr>
             <td><p><strong>Type</strong></p></td>
             <td><p><strong>Private hosted zone</strong>を選択します。</p></td>
           </tr>
        </table>

    1. ホストゾーンに関連付けるVPCのセクションで、VPC IDを追加してホストゾーンに関連付けます。

    </Procedures>

- **ホストゾーンにエイリアスレコードを作成する**

    エイリアスレコードは、エイリアス名を真のまたは正規のドメイン名にマッピングするDNSレコードの一種です。Zilliz Cloudによって割り当てられたプライベートリンクをVPCエンドポイントのDNS名にマッピングするエイリアスレコードを作成します。これにより、プライベートリンクを使用してクラスターにプライベートにアクセスできます。

    ![VoCsbJtTDo1glVx0vtGcqWPRnEd](https://zdoc-images.s3.us-west-2.amazonaws.com/vocsbjttdo1glvx0vtgcqwprned.png "VoCsbJtTDo1glVx0vtGcqWPRnEd")

    <Procedures>

    1. 作成したホストゾーンで、**Create record**をクリックします。

    1. **Create record**ページで、**Alias**をオンにし、Route traffic toを次のように選択します。

        1. 最初のドロップダウンリストで**Alias to VPC endpoint**を選択します。

        1. 2番目のドロップダウンリストでクラウドリージョンを選択します。

        1. 上記で作成したエンドポイントの名前を入力します。

    1. **Create records**をクリックします。

    </Procedures>

## クラスターへのインターネットアクセスを管理する{#manage-internet-access-to-your-clusters}

プライベートエンドポイントを設定した後、クラスターのパブリックエンドポイントを無効にして、プロジェクトへのインターネットアクセスを制限することができます。パブリックエンドポイントを無効にすると、ユーザーはプライベートリンクを使用してのみクラスターに接続できます。

パブリックエンドポイントを無効にするには：

<Procedures>

1. ターゲットクラスターの**Cluster Details**ページに移動します。

1. **Connect**セクションに移動します。

1. クラスターのパブリックエンドポイントの横にある設定アイコンをクリックします。

1. 情報を読み、**Disable Public Endpoint**ダイアログボックスで**Disable**をクリックします。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>プライベートエンドポイントは、<a href="/reference/restful/data-plane-v2">データプレーン</a>アクセスにのみ影響します。<a href="/reference/restful/control-plane-v2">コントロールプレーン</a>は引き続きパブリックインターネット経由でアクセスできます。</p></li>
<li><p>パブリックエンドポイントを再度有効にした後、パブリックエンドポイントにアクセスできるようになるまで、ローカルDNSキャッシュの期限切れを待つ必要がある場合があります。</p></li>
</ul>

</Admonition>

![disable_public_endpoint](https://zdoc-images.s3.us-west-2.amazonaws.com/disable_public_endpoint.png "disable_public_endpoint")

## FAQ{#faq}

### AWSでプライベートリンクに接続すると、常にタイムアウトが報告されるのはなぜですか？{#why-does-it-always-report-a-timeout-when-connecting-to-the-private-link-on-aws}

タイムアウトは通常、次の理由で発生します。

- プライベートDNSレコードが存在しない。

    DNSレコードが存在する場合、次のようにプライベートリンクをpingできます。

    ![QOanbDGrYovMXHxczXmcCbUcnsc](https://zdoc-images.s3.us-west-2.amazonaws.com/qoanbdgryovmxhxczxmccbucnsc.png "QOanbDGrYovMXHxczXmcCbUcnsc")

    <Admonition type="info" icon="📘" title="Notes">

    <p>pingリクエストの出力でVPCエンドポイントのIPアドレスが正しく解決されている場合、DNSレコードは機能しています。</p>

    </Admonition>

    次のような表示がある場合は、[DNSレコードを設定する](./setup-a-private-link-aws#set-up-a-dns-record)必要があります。

    ![X5ahblpw1oRxp8xKR3OczuD9nFf](https://zdoc-images.s3.us-west-2.amazonaws.com/x5ahblpw1orxp8xkr3oczud9nff.png "X5ahblpw1oRxp8xKR3OczuD9nFf")

- セキュリティグループのルールが存在しないか、無効である。

    AWSコンソールで、EC2インスタンスからVPCエンドポイントへのトラフィックに対するセキュリティグループのルールを適切に設定する必要があります。VPC内の適切なセキュリティグループは、EC2インスタンスからのインバウンドアクセスを、プライベートリンクにサフィックスされたポートで許可する必要があります。

    `curl`コマンドを使用して、プライベートリンクの接続をテストできます。通常の場合、400応答が返されます。

    ![ERtlbR2v7oA3Q4xXRlccM3VhnNc](https://zdoc-images.s3.us-west-2.amazonaws.com/ertlbr2v7oa3q4xxrlccm3vhnnc.png "ERtlbR2v7oA3Q4xXRlccM3VhnNc")

    次のスクリーンショットのように、`curl`コマンドが応答なしでハングアップする場合、[VPCエンドポイントを作成する](https://docs.amazonaws.cn/en_us/vpc/latest/privatelink/create-interface-endpoint.html)のステップ9を参照して、適切なセキュリティグループのルールを設定する必要があります。

    ![KHj0bEy7ZojM6axnR0ocg1LPnue](https://zdoc-images.s3.us-west-2.amazonaws.com/khj0bey7zojm6axnr0ocg1lpnue.png "KHj0bEy7ZojM6axnR0ocg1LPnue")

    <Admonition type="info" icon="📘" title="Notes">

    <p>2つのセキュリティグループを設定する必要があります。1つはEC2インスタンス用で、プライベートリンクに関連付けられたポートでのトラフィックを許可する必要があります。もう1つはVPCエンドポイント用で、EC2インスタンスのIPアドレスからのトラフィックを許可し、指定されたポート番号をターゲットにする必要があります。</p>

    </Admonition>

### 既存のクラスターにプライベートエンドポイントを作成できますか？{#can-i-create-a-private-endpoint-for-an-existing-cluster}

はい。プライベートエンドポイントを作成すると、同じリージョンおよびプロジェクトに存在するすべての既存および将来のDedicated (Enterprise) クラスターに適用されます。異なるクラスターに対して異なるDNSレコードを追加するだけで済みます。

