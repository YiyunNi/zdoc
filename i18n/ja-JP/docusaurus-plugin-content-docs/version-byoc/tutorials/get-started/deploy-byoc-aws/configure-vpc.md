---
title: "AWS で顧客管理 VPC を構成する | BYOC"
slug: /configure-vpc
sidebar_label: "AWS で顧客管理 VPC を構成する"
beta: CONTACT SALES
notebook: FALSE
description: "Zilliz Cloud の Bring-Your-Own-Cloud (BYOC) ソリューションを使用すると、独自の Virtual Private Cloud (VPC) 内にプロジェクトをセットアップできます。顧客管理 VPC で実行される Zilliz Cloud プロジェクトを使用すると、ネットワーク構成をより詳細に制御できるようになり、組織が必要とする特定のクラウドセキュリティおよびガバナンス標準を満たすことができます。 | BYOC"
type: origin
token: U3mEwtr42i7GJsk25nzcc4KonUc
sidebar_position: 4
keywords: 
  - zilliz
  - byoc
  - aws
  - vpc
  - セキュリティグループ
  - vpc エンドポイント
  - サブネット
  - milvus
  - ベクトルデータベース
  - hnsw アルゴリズム
  - ベクトル類似性検索
  - 近似最近傍検索
  - DiskANN

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# AWS で顧客管理型 VPC を構成する

Zilliz Cloud Bring-Your-Own-Cloud (BYOC) ソリューションを使用すると、独自の Virtual Private Cloud (VPC) 内にプロジェクトをセットアップできます。顧客管理型 VPC で実行される Zilliz Cloud プロジェクトを使用すると、ネットワーク構成をより詳細に制御できるようになり、組織が必要とする特定のクラウドセキュリティおよびガバナンス標準を満たすことができます。

このページでは、これらの要件を満たす顧客管理型 VPC で Zilliz Cloud BYOC プロジェクトをホストするための最小要件を列挙します。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz BYOC は現在、<strong>一般提供</strong>されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloud 営業</a>にお問い合わせください。</p>

</Admonition>

## VPC 要件{#vpc-requirements}

Zilliz Cloud プロジェクトをホストするには、VPC がこのセクションに列挙されている要件を満たしている必要があります。BYOC プロジェクトに既存の VPC を使用する場合は、VPC がこれらの要件を満たしていることを確認してください。

**要件**

- [VPC リージョン](./configure-vpc#vpc-regions)

- [VPC IP アドレス範囲](./configure-vpc#vpc-ip-address-ranges)

- [サブネット](./configure-vpc#subnets)

- [DNS サポート](./configure-vpc#dns-support)

- [NAT ゲートウェイ](./configure-vpc#nat-gateway)

- [セキュリティグループ](./configure-vpc#security-group)

- [VPC エンドポイント](./configure-vpc#vpc-endpoint)

### VPC リージョン{#vpc-regions}

次の表に、Zilliz Cloud BYOC ソリューションがサポートする AWS クラウドリージョンを示します。Zilliz Cloud コンソールでクラウドリージョンが見つからない場合は、support@zilliz.com までお問い合わせください。

<table>
   <tr>
     <th><p>AWS リージョン</p></th>
     <th><p>場所</p></th>
   </tr>
   <tr>
     <td><p>us-west-2</p></td>
     <td><p>オレゴン</p></td>
   </tr>
   <tr>
     <td><p>eu-central-1</p></td>
     <td><p>フランクフルト</p></td>
   </tr>
</table>

### VPC IP アドレス範囲{#vpc-ip-address-ranges}

Zilliz Cloud は、VPC の IPv4 CIDR 設定で **/16** ネットマスクを使用することを推奨しています。これにより、CIDR ブロックからパブリックサブネットと 3 つのプライベートサブネットを作成できます。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloud は現在、IPv4 CIDR ブロックのみをサポートしています。</p>

</Admonition>

### サブネット{#subnets}

Zilliz Cloud プロジェクトには、1 つのパブリックサブネットと 3 つのプライベートサブネットが必要です。各プライベートサブネットは異なるアベイラビリティゾーンに配置されます。

パブリックサブネットは NAT ゲートウェイをホストし、**/24** のネットマスクを持ちます。各プライベートサブネットは **/18** のネットマスクを持ち、EKS クラスター内で Application Load Balancer (ALB) Ingress ルーティングを使用できるように `kubernetes.io/role/internal-elb=1` でタグ付けする必要があります。

ALB が EKS クラスター内の Pod のアプリケーションおよび HTTP トラフィックをルーティングする方法の詳細については、[この記事](https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html)を参照してください。

### DNS サポート{#dns-support}

VPC は DNS ホスト名と DNS 解決が有効になっている必要があります。

### NAT ゲートウェイ{#nat-gateway}

Zilliz Cloud は、プライベートサブネット内のリソースがインターネットに到達できるように、パブリックサブネットに単一の NAT ゲートウェイをセットアップします。ただし、外部サービスはプライベートサブネット内のリソースとの接続を開始できません。

### セキュリティグループ{#security-group}

インバウンドルールはポート 443 を開く必要があります。セキュリティグループの作成の詳細については、[ステップ 2: セキュリティグループを作成する](./configure-vpc#step-2-create-a-security-group)を参照してください。

### VPC エンドポイント{#vpc-endpoint}

VPC エンドポイントはオプションであり、BYOC クラスターのプライベートエンドポイントを構成する必要がある場合に使用されます。セキュリティグループの作成の詳細については、[ステップ 3: (オプション) VPC エンドポイントを作成する](./configure-vpc#step-3-optional-create-a-vpc-endpoint)を参照してください。

## 手順{#procedure}

AWS コンソールを使用して VPC と関連リソースを作成できます。または、Zilliz Cloud が提供する Terraform スクリプトを使用して、AWS 上の Zilliz Cloud プロジェクトのインフラストラクチャをブートストラップすることもできます。詳細については、[Terraform プロバイダー](./terraform-provider)を参照してください。

### ステップ 1: VPC とリソースを作成する{#step-1-create-vpc-and-resources}

AWS コンソールで、[VPC 要件](./configure-vpc#vpc-requirements)に列挙されている VPC と関連リソースを作成できます。

<Procedures>

1. AWS の VPC ダッシュボードに移動します。

1. 右上隅のリージョンドロップダウンでクラウドリージョンを確認します。Zilliz Cloud プロジェクトと同じリージョンに変更します。

1. **VPC を作成**ボタンをクリックします。

1. **VPC 設定**で、次のスナップショットに示すように設定します。

    ![create-aws-vpc-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/create-aws-vpc-byoc.png "create-aws-vpc-byoc")

    1. **VPC とその他**をクリックします。**名前タグの自動生成**で、プロジェクトの名前を入力します。

    1. **IPv4 CIDR ブロック**で、ネットマスクが **/16** であることを確認します。

    1. **アベイラビリティゾーン (AZ) の数**で、**3** をクリックします。**AZ をカスタマイズ**を展開して、利用可能なアベイラビリティゾーンを確認できます。

    1. **パブリックサブネットの数**で、**3** をクリックします。これらのサブネットは、このエディターで NAT ゲートウェイを有効にするために必要です。

    1. **プライベートサブネットの数**で、**3** をクリックします。これらのサブネットは、Zilliz Cloud BYOC プロジェクトに必要です。

    1. **サブネット CIDR ブロックをカスタマイズ**を展開し、各パブリックサブネットのネットワークマスクが **/24** (例: **10.0.0.0/24**、**10.0.16.0/24**、**10.0.32.0/24**) であり、各プライベートサブネットのネットワークマスクが **/18** (例: **10.0.64.0/18**、**10.0.128.0/18**、**10.0.192.0/18**) であることを確認します。

    1. **NAT ゲートウェイ**で、**1 AZ 内**をクリックします。

    1. **DNS オプション**で、両方のオプションが選択されていることを確認します。

    1. **追加タグ**で、**新しいタグを追加**をクリックします。**キー**を `Vendor` に、**値**を `zilliz-byoc` に設定します。

1. **VPC を作成**をクリックします。

1. VPC が作成されたら、詳細をスクロールダウンし、**VPC を表示**をクリックします。

1. **詳細**セクションで、VPC ID をコピーし、Zilliz Cloud に貼り付けます。

    ![Rkj2bzxw0ocgLzxE63AcJ0VEnHe](https://zdoc-images.s3.us-west-2.amazonaws.com/rkj2bzxw0ocglzxe63acj0venhe.png "Rkj2bzxw0ocgLzxE63AcJ0VEnHe")

1. **リソースマップ**セクションで、各プライベートサブネットの末尾にある外部リンクアイコンをクリックして、その詳細を表示します。

    ![VecQbx7epoBqABx8vKOcaIS7nDd](https://zdoc-images.s3.us-west-2.amazonaws.com/vecqbx7epobqabx8vkocais7ndd.png "VecQbx7epoBqABx8vKOcaIS7nDd")

1. **サブネット詳細**ページで、サブネット ID をコピーします。

    ![GPimbEY2Aoz5UtxUCxkcqrAYnjc](https://zdoc-images.s3.us-west-2.amazonaws.com/gpimbey2aoz5utxucxkcqraynjc.png "GPimbEY2Aoz5UtxUCxkcqrAYnjc")

1. 次に、**タグを管理**をクリックします。表示されたページで、**新しいタグを追加**をクリックし、新しいタグリストエントリの**キー**を `kubernetes.io/role/internal-elb` に、**値**を `1` に設定します。次に、**保存**をクリックします。

    ![HZdBb4d4QoLEUzxrkxpcqro4nTe](https://zdoc-images.s3.us-west-2.amazonaws.com/hzdbb4d4qoleuzxrkxpcqro4nte.png "HZdBb4d4QoLEUzxrkxpcqro4nte")

</Procedures>

### ステップ 2: セキュリティグループを作成する{#step-2-create-a-security-group}

VPC のセキュリティグループは、インバウンドおよびアウトバウンドトラフィックを制御することで AWS リソースを保護し、EC2 インスタンスの仮想ファイアウォールとして機能します。セキュリティグループは次のように作成できます。

<Procedures>

1. AWS の VPC ダッシュボードに移動します。

1. 左側のナビゲーションペインで**セキュリティ** > **セキュリティグループ**を見つけ、右側のペインの右上隅にある**セキュリティグループを作成**をクリックします。

1. **セキュリティグループ名**と**説明**を設定し、VPC ドロップダウンリストから以前に作成した VPC を選択します。

    ![W6n9b4BRVoVi8PxgrLUcajOtnSc](https://zdoc-images.s3.us-west-2.amazonaws.com/w6n9b4brvovi8pxgrlucajotnsc.png "W6n9b4BRVoVi8PxgrLUcajOtnSc")

1. **インバウンドルール**セクションで**ルールを追加**をクリックして、インバウンドルールを作成します。

1. **ソース**で**任意の場所-IPv4**を選択するか、**ソース**ドロップダウンの右側にあるテキストボックスにアクセスが許可される CIDR ブロックを入力します。

    ![Z6SObL7FYofXBuxk46WcuRsbnLb](https://zdoc-images.s3.us-west-2.amazonaws.com/z6sobl7fyofxbuxk46wcursbnlb.png "Z6SObL7FYofXBuxk46WcuRsbnLb")

1. レコードを追加し、**タイプ**で**HTTPS**を、**宛先**で**任意の場所-IPv4**を選択するか、**宛先**ドロップダウンの右側にあるテキストボックスにアクセスが許可される CIDR ブロックを入力します。

    ![N0B8bIiXdobTjUxp1AVc76Xcnsc](https://zdoc-images.s3.us-west-2.amazonaws.com/n0b8biixdobtjuxp1avc76xcnsc.png "N0B8bIiXdobTjUxp1AVc76Xcnsc")

1. **タグ**セクションで、次のスクリーンショットに示すようにキーと値のペアを追加します。

    ![FlaPbHes2oLjZ8xO1X9cppYTnyc](https://zdoc-images.s3.us-west-2.amazonaws.com/flapbhes2oljz8xo1x9cppytnyc.png "FlaPbHes2oLjZ8xO1X9cppYTnyc")

1. **セキュリティグループを作成**をクリックして、セキュリティグループを保存します。

1. セキュリティグループ ID を Zilliz Cloud にコピーして戻します。

    ![KMuWbhLTVoiyCjx1HXjcGERunZd](https://zdoc-images.s3.us-west-2.amazonaws.com/kmuwbhltvoiycjx1hxjcgerunzd.png "KMuWbhLTVoiyCjx1HXjcGERunZd")

</Procedures>

### ステップ 3: (オプション) VPC エンドポイントを作成する{#step-3-optional-create-a-vpc-endpoint}

VPC エンドポイントは、安全なクラスター接続リレーを保証し、Zilliz Cloud REST API へのプライベート呼び出しを可能にします。AWS マネジメントコンソールで VPC エンドポイントを管理する方法については、AWS マネジメントコンソールの [AWS の記事「VPC エンドポイントを作成する」](https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html)を参照するか、次の手順を使用してください。

<Admonition type="info" icon="📘" title="Notes">

<p>このセクションで作成された VPC エンドポイントは、AWS PrivateLink をセットアップするために使用されます。VPC エンドポイントの準備ができたら、ホストゾーンを作成し、いくつかの DNS レコードを追加する必要があります。詳細については、<a href="./setup-a-private-link-aws">PrivateLink をセットアップする (AWS)</a>を参照してください。</p>

</Admonition>

<Procedures>

1. AWS の**VPC ダッシュボード**に移動します。

1. 左側のナビゲーションペインで**PrivateLink と Lattice** > **エンドポイント**を見つけ、右側のペインの右上隅にある**エンドポイントを作成**をクリックします。

1. **名前タグ**を設定するか、空白のままにして AWS に自動生成させます。**タイプ**には、**NLB と GWLB を使用するエンドポイントサービス**を選択します。

    ![GRIrbg4sYoN75oxCnRsci3JnnLO](https://zdoc-images.s3.us-west-2.amazonaws.com/grirbg4syon75oxcnrsci3jnnlo.png "GRIrbg4sYoN75oxCnRsci3JnnLO")

1. **サービス設定**で、**サービス名**にリージョンの Zilliz Cloud VPC エンドポイントを入力し、**サービスを確認**をクリックします。

    次の表に、現在利用可能なクラウドリージョンを示します。クラウドリージョンが表にない場合は、support@zilliz.com までお問い合わせください。

    <table>
       <tr>
         <th><p>AWS リージョン</p></th>
         <th><p>場所</p></th>
         <th><p>Zilliz Cloud VPC エンドポイント</p></th>
       </tr>
       <tr>
         <td><p>us-west-2</p></td>
         <td><p>オレゴン</p></td>
         <td><p><code>com.amazonaws.vpce.us-west-2.vpce-svc-0654fb016640c364a</code></p></td>
       </tr>
       <tr>
         <td><p>eu-central-1</p></td>
         <td><p>フランクフルト</p></td>
         <td><p><code>com.amazonaws.vpce.eu-central-1.vpce-svc-0d5ce1ec4decbc7df</code></p></td>
       </tr>
    </table>

    ![VYLlboU8fofvUPx6NYUcGztpn3s](https://zdoc-images.s3.us-west-2.amazonaws.com/vyllbou8fofvupx6nyucgztpn3s.png "VYLlboU8fofvUPx6NYUcGztpn3s")

1. **ネットワーク設定**で、[上記で作成した VPC](./configure-vpc#step-1-create-vpc-and-resources) を選択し、**DNS 名を有効にする**を選択します。

    ![DyH3b9kOro2wf6xGcsUcD2DbnVo](https://zdoc-images.s3.us-west-2.amazonaws.com/dyh3b9koro2wf6xgcsucd2dbnvo.png "DyH3b9kOro2wf6xGcsUcD2DbnVo")

1. **サブネット**で、[VPC とともに作成されたプライベートサブネット](./configure-vpc#step-1-create-vpc-and-resources)を選択します。

    ![IdcebwU1Ao4QffxGwYTceh9AnVe](https://zdoc-images.s3.us-west-2.amazonaws.com/idcebwu1ao4qffxgwytceh9anve.png "IdcebwU1Ao4QffxGwYTceh9AnVe")

1. **セキュリティグループ**で、[上記で作成したセキュリティグループ](./configure-vpc#step-2-create-a-security-group)を選択します。

1. **エンドポイントを作成**をクリックして、上記の設定を保存します。

1. **エンドポイント**リストで作成した VPC エンドポイント ID をクリックして、その詳細を表示します。

    ![KhRBbAbSAoU2X0xdnMtc0Gmunvf](https://zdoc-images.s3.us-west-2.amazonaws.com/khrbbabsaou2x0xdnmtc0gmunvf.png "KhRBbAbSAoU2X0xdnMtc0Gmunvf")

1. **プライベート DNS 名**の値が `*.aws-{region}.byoc.cloud.zilliz.com` と類似しているかどうかを確認します。

    1. その場合は、**エンドポイント ID** をコピーして Zilliz Cloud コンソールに貼り付けます。

        ![BUejbgXWJoXi5jxDmZnc7Ogdnah](https://zdoc-images.s3.us-west-2.amazonaws.com/buejbgxwjoxi5jxdmznc7ogdnah.png "BUejbgXWJoXi5jxDmZnc7Ogdnah")

    1. そうでない場合は、設定を確認し、必要な変更を加えます。

</Procedures>

### ステップ 4: VPC 情報を Zilliz Cloud に送信する{#step-4-submit-vpc-information-to-zilliz-cloud}

AWS で上記の手順を完了したら、Zilliz Cloud に戻り、**ネットワーク設定**に VPC ID、サブネット ID、セキュリティグループ ID、およびオプションの VPC エンドポイント ID を入力し、**次へ**をクリックしてプロジェクト展開プロセス全体の概要を表示します。すべてが期待どおりに構成されている場合は、**展開**をクリックしてプロセスを開始します。

![VDXYbAfS2oQ04YxcMs0cEETbn2c](https://zdoc-images.s3.us-west-2.amazonaws.com/vdxybafs2oq04yxcms0ceetbn2c.png "VDXYbAfS2oQ04YxcMs0cEETbn2c")

