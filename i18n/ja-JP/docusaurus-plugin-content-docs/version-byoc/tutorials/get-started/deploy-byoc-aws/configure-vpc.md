---
title: "AWS でカスタマー管理型 VPC を構成する | BYOC"
slug: /configure-vpc
sidebar_key: configure-vpc
sidebar_label: "AWS でカスタマー管理型 VPC を構成する"
beta: CONTACT SALES
notebook: FALSE
description: "Zilliz Cloud の Bring-Your-Own-Cloud（BYOC）ソリューションを使用すると、独自の Virtual Private Cloud（VPC）内にプロジェクトを設定できます。カスタマー管理型 VPC で実行される Zilliz Cloud プロジェクトにより、ネットワーク構成をより細かく制御でき、組織が求める特定のクラウドセキュリティおよびガバナンス基準を満たすことができます。 | BYOC"
type: origin
token: U3mEwtr42i7GJsk25nzcc4KonUc
sidebar_position: 4
keywords: 
  - zilliz
  - byoc
  - aws
  - vpc
  - security group
  - vpc endpoint
  - subnet
  - milvus
  - ベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# AWS でカスタマー管理 VPC を構成する

Zilliz Cloud の Bring-Your-Own-Cloud (BYOC) ソリューションを使用すると、独自の Virtual プライベート Cloud (VPC) 内にプロジェクトを設定できます。カスタマー管理 VPC で実行される Zilliz Cloud プロジェクトでは、ネットワーク構成をより細かく制御できるため、組織が求める特定のクラウドセキュリティおよびガバナンス基準を満たすことができます。

このページでは、これらの要件を満たすカスタマー管理 VPC で Zilliz Cloud BYOC プロジェクトをホストするために必要な最低要件を列挙しています。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz BYOC は現在 <strong>一般提供</strong>されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloud 営業</a>までお問い合わせください。</p>

</Admonition>

## VPC 要件\{#vpc-requirements}

Zilliz Cloud プロジェクトをホストするには、VPC がこのセクションで列挙されている要件を満たしている必要があります。既存の VPC を BYOC プロジェクトに使用する場合は、その VPC がこれらの要件を満たしていることを確認してください。

**要件**

- [VPC リージョン](./configure-vpc#vpc-regions)

- [VPC IP アドレス範囲](./configure-vpc#vpc-ip-address-ranges)

- [サブネット](./configure-vpc#subnets)

- [DNS サポート](./configure-vpc#dns-support)

- [NAT ゲートウェイ](./configure-vpc#nat-gateway)

- [セキュリティグループ](./configure-vpc#security-group)

- [VPC エンドポイント](./configure-vpc#vpc-endpoint)

### VPC リージョン\{#vpc-regions}

次の表は、Zilliz Cloud BYOC ソリューションがサポートする AWS クラウドリージョンを示しています。Zilliz Cloud コンソールでご利用のクラウドリージョンが見つからない場合は、support@zilliz.com までお問い合わせください。

<table>
   <tr>
     <th><p>AWS Region</p></th>
     <th><p>Location</p></th>
   </tr>
   <tr>
     <td><p>us-west-2</p></td>
     <td><p>Oregon</p></td>
   </tr>
   <tr>
     <td><p>eu-central-1</p></td>
     <td><p>Frankfurt</p></td>
   </tr>
</table>

### VPC IP アドレス範囲\{#vpc-ip-address-ranges}

Zilliz Cloud は、VPC の IPv4 CIDR 設定で **/16** のネットマスクを使用することを推奨しています。これにより、CIDR ブロックからパブリックサブネット 1 つとプライベートサブネット 3 つを作成できます。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloud は現在、IPv4 CIDR ブロックのみをサポートしています。</p>

</Admonition>

### サブネット\{#subnets}

Zilliz Cloud プロジェクトには、パブリックサブネット 1 つとプライベートサブネット 3 つが必要であり、各プライベートサブネットは異なるアベイラビリティゾーンに配置する必要があります。

パブリックサブネットには NAT ゲートウェイがホストされ、ネットマスクは **/24** です。各プライベートサブネットのネットマスクは **/18** で、`kubernetes.io/role/internal-elb=1` のタグを付ける必要があります。これにより、EKS クラスター内で Application Load Balancer (ALB) Ingress ルーティングを使用できるようになります。

ALB が EKS クラスター内のポッドのアプリケーションおよび HTTP トラフィックをどのようにルーティングするかの詳細については、[この記事](https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html)を参照してください。

### DNS サポート\{#dns-support}

VPC では、DNS ホスト名および DNS 解決が有効になっている必要があります。

### NAT ゲートウェイ\{#nat-gateway}

Zilliz Cloud は、パブリックサブネットに単一の NAT ゲートウェイを設定し、プライベートサブネット内のリソースがインターネットに到達できるようにします。ただし、外部サービスはプライベートサブネット内のリソースとの接続を開始できません。

### セキュリティグループ\{#security-group}

イングレスルールではポート 443 を開放する必要があります。セキュリティグループの作成の詳細については、[ステップ 2: セキュリティグループの作成](./configure-vpc#step-2-create-a-security-group)を参照してください。

### VPC エンドポイント\{#vpc-endpoint}

VPC エンドポイントはオプションであり、BYOC クラスターのプライベートエンドポイントを構成する必要がある場合に使用されます。セキュリティグループの作成の詳細については、[ステップ 3: (オプション) VPC エンドポイントの作成](./configure-vpc#step-3-optional-create-a-vpc-endpoint)を参照してください。

## 手順\{#procedure}

AWS コンソールを使用して VPC および関連リソースを作成できます。または、Zilliz Cloud が提供する Terraform スクリプトを使用して、AWS 上の Zilliz Cloud プロジェクトのインフラストラクチャをブートストラップすることもできます。詳細については、[Terraform Provider](./terraform-provider)を参照してください。

### ステップ 1: VPC とリソースの作成\{#step-1-create-vpc-and-resources}

AWS コンソール上で、[VPC 要件](./configure-vpc#vpc-requirements)に列挙されている VPC および関連リソースを作成できます。

<Procedures>

1. AWS の VPC ダッシュボードに移動します。

1. 右上のリージョンドロップダウンでクラウドリージョンを確認します。Zilliz Cloud プロジェクトのリージョンと同じものに変更します。

1. **Create VPC** ボタンをクリックします。

1. **VPC設定** で、次のスナップショットに示すように設定します。

    ![create-aws-vpc-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/create-aws-vpc-byoc.png "create-aws-vpc-byoc")

    1. **VPCなど** をクリックします。**名前タグの自動生成** に、プロジェクトの名前を入力します。

    1. **IPv4 CIDRブロック** で、ネットマスクが **/16** であることを確認します。

    1. **Number of Availability Zones (AZ)** で、**3** をクリックします。**Customize AZs** を展開して、利用可能なアベイラビリティゾーンを確認できます。

    1. **パブリックサブネット数** で、**3** をクリックします。これらのサブネットは、このエディターで NAT ゲートウェイを有効にするために必要です。

    1. **プライベートサブネット数** で、**3** をクリックします。これらのサブネットは、Zilliz Cloud BYOC プロジェクトに必要です。

    1. **サブネットCIDRブロックのカスタマイズ** を展開し、各パブリックサブネットのネットマスクが **/24**（例: **10.0.0.0/24**、**10.0.16.0/24**、**10.0.32.0/24**）、各プライベートサブネットのネットマスクが **/18**（例: **10.0.64.0/18**、**10.0.128.0/18**、**10.0.192.0/18**）であることを確認します。

    1. **NATゲートウェイ** で、**1つのAZ内** をクリックします。

    1. **DNSオプション** で、両方のオプションが選択されていることを確認します。

    1. **追加タグ** で、**Add new tag** をクリックします。**キー** を `Vendor`、**Value** を `zilliz-byoc` に設定します。

1. **Create VPC** をクリックします。

1. VPC の作成が完了したら、詳細を下にスクロールし、**View VPC** をクリックします。

1. **Details** セクションで、VPC ID をコピーし、Zilliz Cloud に貼り付けます。

    ![Rkj2bzxw0ocgLzxE63AcJ0VEnHe](https://zdoc-images.s3.us-west-2.amazonaws.com/rkj2bzxw0ocglzxe63acj0venhe.png "Rkj2bzxw0ocgLzxE63AcJ0VEnHe")

1. **リソースマップ** セクションで、各プライベートサブネットの末尾にある外部リンクアイコンをクリックして、その詳細を表示します。

    ![VecQbx7epoBqABx8vKOcaIS7nDd](https://zdoc-images.s3.us-west-2.amazonaws.com/vecqbx7epobqabx8vkocais7ndd.png "VecQbx7epoBqABx8vKOcaIS7nDd")

1. **サブネット Details** ページで、サブネット ID をコピーします。

    ![GPimbEY2Aoz5UtxUCxkcqrAYnjc](https://zdoc-images.s3.us-west-2.amazonaws.com/gpimbey2aoz5utxucxkcqraynjc.png "GPimbEY2Aoz5UtxUCxkcqrAYnjc")

1. 次に **Manage tags** をクリックします。表示されたページで **Add new tag** をクリックし、新しいタグリストエントリの **キー** を `kubernetes.io/role/internal-elb`、**Value** を `1` に設定します。次に **Save** をクリックします。

    ![HZdBb4d4QoLEUzxrkxpcqro4nTe](https://zdoc-images.s3.us-west-2.amazonaws.com/hzdbb4d4qoleuzxrkxpcqro4nte.png "HZdBb4d4QoLEUzxrkxpcqro4nTe")

</Procedures>

### ステップ 2: セキュリティグループの作成\{#step-2-create-a-security-group}

VPC 内のセキュリティグループは、インバウンドおよびアウトバウンドトラフィックを制御することで AWS リソースを保護し、EC2 インスタンスの仮想ファイアウォールとして機能します。セキュリティグループは次のように作成できます。

<Procedures>

1. AWS の VPC ダッシュボードに移動します。

1. 左側のナビゲーションペインで **Security** > **セキュリティグループ** を見つけ、右側のペインの右上にある **Create security group** をクリックします。

1. **セキュリティグループ名** と **Description** を設定し、VPC ドロップダウンリストから以前作成した VPC を選択します。

    ![W6n9b4BRVoVi8PxgrLUcajOtnSc](https://zdoc-images.s3.us-west-2.amazonaws.com/w6n9b4brvovi8pxgrlucajotnsc.png "W6n9b4BRVoVi8PxgrLUcajOtnSc")

1. **インバウンドルール** セクションで **Add rule** をクリックして、インバウンドルールを作成します。

1. **Source** で **任意の場所-IPv4** を選択するか、**Source** ドロップダウンの右側のテキストボックスにアクセスを許可する CIDR ブロックを入力します。

    ![Z6SObL7FYofXBuxk46WcuRsbnLb](https://zdoc-images.s3.us-west-2.amazonaws.com/z6sobl7fyofxbuxk46wcursbnlb.png "Z6SObL7FYofXBuxk46WcuRsbnLb")

1. レコードを追加し、**Type** で **HTTPS** を選択し、**送信先** で **任意の場所-IPv4** を選択するか、**送信先** ドロップダウンの右側のテキストボックスにアクセスを許可する CIDR ブロックを入力します。

    ![N0B8bIiXdobTjUxp1AVc76Xcnsc](https://zdoc-images.s3.us-west-2.amazonaws.com/n0b8biixdobtjuxp1avc76xcnsc.png "N0B8bIiXdobTjUxp1AVc76Xcnsc")

1. **タグ** セクションで、次のスクリーンショットに示すようにキーと値のペアを追加します。

    ![FlaPbHes2oLjZ8xO1X9cppYTnyc](https://zdoc-images.s3.us-west-2.amazonaws.com/flapbhes2oljz8xo1x9cppytnyc.png "FlaPbHes2oLjZ8xO1X9cppYTnyc")

1. **Create security group** をクリックして、セキュリティグループを保存します。

1. セキュリティグループ ID をコピーして、Zilliz Cloud に貼り付けます。

    ![KMuWbhLTVoiyCjx1HXjcGERunZd](https://zdoc-images.s3.us-west-2.amazonaws.com/kmuwbhltvoiycjx1hxjcgerunzd.png "KMuWbhLTVoiyCjx1HXjcGERunZd")

</Procedures>

### ステップ 3: (オプション) VPC エンドポイントの作成\{#step-3-optional-create-a-vpc-endpoint}

VPC エンドポイントは、安全なクラスター接続リレーを確保し、Zilliz Cloud RESTful API へのプライベート呼び出しを可能にします。AWS Management Console で VPC エンドポイントを管理する方法については、AWS Management Console の [AWS 記事 Create VPC endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html) を参照するか、次の手順を使用してください。

<Admonition type="info" icon="📘" title="Notes">

<p>このセクションで作成する VPC エンドポイントは、AWS プライベートLink の設定に使用されます。VPC エンドポイントの準備ができたら、ホストゾーンを作成し、いくつかの DNS レコードを追加する必要があります。詳細については、<a href="./setup-a-private-link-aws">Set up a プライベートLink (AWS)</a> を参照してください。</p>

</Admonition>

<Procedures>

1. AWS の **VPCダッシュボード** に移動します。

1. 左側のナビゲーションペインで **プライベートLink and Lattice** > **Endpoints** を見つけ、右側のペインの右上にある **Create endpoint** をクリックします。

1. **名前タグ** を設定するか、空白のままにして AWS に自動生成させます。**Type** では、**Endpoint services that use NLBs and GWLBs** を選択します。

    ![GRIrbg4sYoN75oxCnRsci3JnnLO](https://zdoc-images.s3.us-west-2.amazonaws.com/grirbg4syon75oxcnrsci3jnnlo.png "GRIrbg4sYoN75oxCnRsci3JnnLO")

1. **サービス設定** で、**サービス名** にご利用のリージョンの Zilliz Cloud VPC エンドポイントを入力し、**Verify service** をクリックします。

    次の表は、現在利用可能なクラウドリージョンを示しています。ご利用のクラウドリージョンが表に記載されていない場合は、support@zilliz.com までお問い合わせください。

    <table>
       <tr>
         <th><p>AWS Region</p></th>
         <th><p>Location</p></th>
         <th><p>Zilliz Cloud VPC endpoint</p></th>
       </tr>
       <tr>
         <td><p>us-west-2</p></td>
         <td><p>Oregon</p></td>
         <td><p><code>com.amazonaws.vpce.us-west-2.vpce-svc-0654fb016640c364a</code></p></td>
       </tr>
       <tr>
         <td><p>eu-central-1</p></td>
         <td><p>Frankfurt</p></td>
         <td><p><code>com.amazonaws.vpce.eu-central-1.vpce-svc-0d5ce1ec4decbc7df</code></p></td>
       </tr>
    </table>

    ![VYLlboU8fofvUPx6NYUcGztpn3s](https://zdoc-images.s3.us-west-2.amazonaws.com/vyllbou8fofvupx6nyucgztpn3s.png "VYLlboU8fofvUPx6NYUcGztpn3s")

1. **ネットワーク settings** で、[上記で作成した VPC](./configure-vpc#step-1-create-vpc-and-resources) を選択し、**Enable DNS名** を選択します。

    ![DyH3b9kOro2wf6xGcsUcD2DbnVo](https://zdoc-images.s3.us-west-2.amazonaws.com/dyh3b9koro2wf6xgcsucd2dbnvo.png "DyH3b9kOro2wf6xGcsUcD2DbnVo")

1. **サブネット** で、[VPC とともに作成したプライベートサブネット](./configure-vpc#step-1-create-vpc-and-resources) を選択します。

    ![IdcebwU1Ao4QffxGwYTceh9AnVe](https://zdoc-images.s3.us-west-2.amazonaws.com/idcebwu1ao4qffxgwytceh9anve.png "IdcebwU1Ao4QffxGwYTceh9AnVe")

1. **セキュリティグループ** で、[上記で作成したセキュリティグループ](./configure-vpc#step-2-create-a-security-group) を選択します。

1. **Create endpoint** をクリックして、上記の設定を保存します。

1. **Endpoints** リストで、作成された VPC エンドポイント ID をクリックして、その詳細を表示します。

    ![KhRBbAbSAoU2X0xdnMtc0Gmunvf](https://zdoc-images.s3.us-west-2.amazonaws.com/khrbbabsaou2x0xdnmtc0gmunvf.png "KhRBbAbSAoU2X0xdnMtc0Gmunvf")

1. **プライベート DNS名s** の値が `*.aws-{region}.byoc.cloud.zilliz.com` と類似しているかどうかを確認します。

    1. 類似している場合は、**エンドポイントID** をコピーして、Zilliz Cloud コンソールに貼り付けます。

        ![BUejbgXWJoXi5jxDmZnc7Ogdnah](https://zdoc-images.s3.us-west-2.amazonaws.com/buejbgxwjoxi5jxdmznc7ogdnah.png "BUejbgXWJoXi5jxDmZnc7Ogdnah")

    1. 類似していない場合は、設定を確認し、必要な変更を加えます。

</Procedures>

### ステップ 4: VPC 情報を Zilliz Cloud に送信する\{#step-4-submit-vpc-information-to-zilliz-cloud}

AWS で上記の手順を完了したら、Zilliz Cloud に戻り、**ネットワーク settings** に VPC ID、サブネット ID、セキュリティグループ ID、およびオプションの VPC エンドポイント ID を入力し、**Next** をクリックして、プロジェクト全体のデプロイメントプロセスの概要を表示します。すべてが期待どおりに構成されている場合は、**Deploy** をクリックしてプロセスを開始します。

![VDXYbAfS2oQ04YxcMs0cEETbn2c](https://zdoc-images.s3.us-west-2.amazonaws.com/vdxybafs2oq04yxcms0ceetbn2c.png "VDXYbAfS2oQ04YxcMs0cEETbn2c")

