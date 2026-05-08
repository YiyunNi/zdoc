---
title: "GCP でカスタマー管理 VPC を構成する | BYOC"
slug: /configure-vpc-gcp
sidebar_key: configure-vpc-gcp
sidebar_label: "GCP でカスタマー管理 VPC を構成する"
beta: CONTACT SALES
notebook: FALSE
description: "Zilliz Cloud の Bring-Your-Own-Cloud（BYOC）ソリューションを使用すると、お客様自身の Virtual Private Cloud（VPC）内にプロジェクトをセットアップできます。カスタマー管理 VPC で動作する Zilliz Cloud プロジェクトにより、ネットワーク構成をより細かく制御でき、組織が求める特定のクラウドセキュリティおよびガバナンス基準を満たすことができます。 | BYOC"
type: origin
token: C94rw7r38ij0eCkvQKBcEFJ1n0e
sidebar_position: 4
keywords: 
  - zilliz
  - byoc
  - byoc-i
  - gcp
  - 権限
  - 最小限の権限
  - milvus
  - ベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# GCP でカスタマー管理 VPC を構成する

Zilliz Cloud の Bring-Your-Own-Cloud (BYOC) ソリューションを使用すると、独自の Virtual プライベート Cloud (VPC) 内にプロジェクトを設定できます。カスタマー管理 VPC で実行される Zilliz Cloud プロジェクトでは、ネットワーク構成をより細かく制御できるため、組織で必要とされる特定のクラウドセキュリティおよびガバナンス基準を満たすことができます。

このページでは、これらの要件を満たすカスタマー管理 VPC で Zilliz Cloud BYOC プロジェクトをホストするための最低要件を列挙します。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz BYOC は現在 <strong>一般提供</strong> されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloud 営業</a>までお問い合わせください。</p>

</Admonition>

## VPC 要件\{#vpc-requirements}

Zilliz Cloud プロジェクトをホストするには、VPC がこのセクションで列挙された要件を満たしている必要があります。既存の VPC を BYOC プロジェクトに使用する場合は、その VPC がこれらの要件を満たしていることを確認してください。

**要件**

- [VPC リージョン](./configure-vpc-gcp#vpc-regions)

- [VPC IP アドレス範囲](./configure-vpc-gcp#vpc-ip-address-ranges)

- [サブネット](./configure-vpc-gcp#subnets)

- [Cloud Router と NAT](./configure-vpc-gcp#cloud-router-and-nat)

- [ファイアウォール ルール](./configure-vpc-gcp#firewall-rules)

- [プライベート Service Connect (PSC)](./configure-vpc-gcp#private-service-connect-psc-endpoint)

### VPC リージョン\{#vpc-regions}

次の表は、Zilliz Cloud BYOC ソリューションがサポートする Google Cloud Platform (GCP) リージョンを示しています。Zilliz Cloud コンソールでご利用のクラウド リージョンが見つからない場合は、support@zilliz.com までお問い合わせください。

<table>
   <tr>
     <th><p>GCP リージョン</p></th>
     <th><p>ロケーション</p></th>
   </tr>
   <tr>
     <td><p>us-west1</p></td>
     <td><p>Oregon</p></td>
   </tr>
</table>

### VPC IP アドレス範囲\{#vpc-ip-address-ranges}

Zilliz Cloud では、VPC の IPv4 CIDR 設定に **/18** ネットマスクを使用することを推奨しています。これにより、CIDR ブロックからパブリック サブネットと 3 つのプライベート サブネットを作成できます。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloud は現在、IPv4 CIDR ブロックのみをサポートしています。</p>

</Admonition>

### サブネット\{#subnets}

Zilliz Cloud BYOC プロジェクトには、プライマリ IPv4 範囲と 2 つのセカンダリ IPv4 範囲を持つプライマリ サブネット、および別個のロード バランシング サブネットが必要です。

### Cloud Router と NAT\{#cloud-router-and-nat}

VPC と他のネットワーク間で動的なルート交換を可能にするには、Google Cloud Router が必要です。また、VPC 上の VM およびコンテナ ポッドが Zilliz Cloud の VPC ネットワークと通信できるように、NAT ゲートウェイを追加する必要があります。

### ファイアウォール ルール\{#firewall-rules}

2 つのイングレス ファイアウォール ルールを作成する必要があります。1 つは Zilliz Cloud が BYOC プロジェクト内のクラスタに対してヘルス チェックを実行するためのもので、もう 1 つは VPC ネットワーク内の VM インスタンス間で相互に通信するためのものです。

### プライベート Service Connect (PSC) エンドポイント\{#private-service-connect-psc-endpoint}

PSC エンドポイントはオプションであり、BYOC クラスタのプライベート エンドポイントを構成する際に使用されます。

## 手順\{#procedure}

GCP ダッシュボードで、[VPC 要件](./configure-vpc-gcp#vpc-requirements)に列挙された VPC および関連リソースを作成できます。または、Zilliz Cloud が提供する Terraform スクリプトを使用して、GCP 上の Zilliz Cloud プロジェクトのインフラストラクチャをブートストラップすることもできます。詳細については、[Terraform Provider](./terraform-provider) を参照してください。

### ステップ 1: VPC ネットワークを作成し、プライマリ サブネットを追加する\{#step-1-create-a-vpc-network-and-add-the-primary-subnet}

このステップでは、VPC ネットワークを作成し、プライマリ サブネットを追加します。プライマリ サブネットには、コンテナ ポッドとサービス用のプライマリ IPv4 アドレス範囲と 2 つのセカンダリ IPv4 アドレス範囲が含まれます。

<Supademo id="cmbhlqpyr5ovksn1rjtbv93bt" title=""  />

VPC ネットワークを作成し、プライマリ サブネットを追加する手順は以下のとおりです。

<Procedures>

1. GCP コンソールで **VPC ネットワーク** を検索して をクリック します。

1. **VPC ネットワークを作成** をクリック します。

1. 作成する VPC とプライマリ サブネットの名前を設定します。

    このデモでは、`primary-subnet` に設定するか、命名規則に従ってサブネットに名前を付けることができます。

1. プライマリ サブネットのリージョンを選択します。

    リージョンは、Zilliz BYOC プロジェクトと同じである必要があります。

1. プライマリ サブネットのプライマリ IPv4 範囲を設定します。

    このデモでは、`10.7.0.0/18` に設定するか、計画したネットワーク セグメントを使用できます。後で参照できるよう、名前と IPv4 範囲を覚えておくことをお勧めします。

1. コンテナ ポッド用のセカンダリ IPv4 範囲の名前と IPv4 アドレス範囲を設定します。

    このデモでは、名前を `pod-subnet`、範囲を `10.7.64.0/18` に設定するか、命名規則とネットワーク計画に従うことができます。後で参照できるよう、名前と IPv4 範囲を覚えておくことをお勧めします。

1. **セカンダリ IPv4 範囲を追加** をクリック して、サービス用のセカンダリ IPv4 範囲を追加し、その名前と範囲を設定します。

    このデモでは、名前を `service-subnet`、範囲を `10.7.128.0/18` に設定するか、命名規則とネットワーク計画に従うことができます。

1. その他の設定はデフォルトのままにして、**作成** をクリック します。

</Procedures>

### ステップ 2: ロード バランシング サブネットを追加する\{#step-2-add-the-load-balancing-subnet}

このステップでは、リージョン アプリケーション ロード バランサー専用のプロキシ専用サブネットを追加します。

<Supademo id="cmbhmkul05p81sn1r161bhqiy" title=""  />

このサブネットを追加する手順は以下のとおりです。

<Procedures>

1. GCP コンソールで **VPC ネットワーク** を検索して をクリック します。

1. 前のステップで作成した VPC ネットワークをフィルタリングします。

1. その名前をクリックして詳細を表示します。

1. **サブネット** タブに切り替え、**サブネットを追加** をクリック します。

1. 作成するサブネットの名前を設定します。

    このデモでは、`lb-subnet` に設定するか、命名規則に従ってサブネットに名前を付けることができます。

1. プライマリ サブネットのリージョンを選択します。

    リージョンは、Zilliz BYOC プロジェクトと同じである必要があります。

1. **目的** で **リージョン マネージド プロキシ** を選択します。

    このオプションとプロキシ専用サブネットの詳細については、[このドキュメント](https://cloud.google.com/load-balancing/docs/proxy-only-subnets) を参照してください。

1. このサブネットのプライマリ IPv4 範囲を設定します。

    このデモでは、`10.7.192.0/18` に設定するか、計画したネットワーク セグメントを使用できます。

1. **追加** をクリック します。

</Procedures>

### ステップ 3: Cloud Router と NAT ゲートウェイを設定する\{#step-3-set-up-the-cloud-router-and-nat-gateway}

このステップでは、Cloud Router と NAT ゲートウェイを構成して、VPC と Zilliz Cloud の VPC 間のトラフィックのネットワーク アドレス変換を有効にします。

<Supademo id="cmbhobhu95slrsn1r9uig4txt" title=""  />

Cloud Router と NAT ゲートウェイを設定する手順は以下のとおりです。

<Procedures>

1. GCP コンソールで **ネットワーク接続** を検索して をクリック します。

1. 左側のナビゲーション ペインで **Cloud Router** を選択します。

1. **ルーターを作成** をクリック します。

1. 作成するルーターの名前を設定します。

    このデモでは `your-org-byoc-router` に設定するか、命名規則に従います。

1. 前のステップで作成した VPC ネットワークを選択します。

    このデモでは、`your-org-byoc-vpc` を選択します。

1. 作成するルーターのリージョンを選択します。

    このデモでは、`us-west1 (Oregon)` を選択します。

1. **作成** をクリック します。

1. **ルーター** リストに表示されたルーターの名前をクリック します。

1. 下にスクロールして **Cloud NAT ゲートウェイを追加** をクリック します。

1. 作成する NAT ゲートウェイの名前を設定します。

    このデモでは `your-org-byoc-nat` に設定するか、命名規則に従います。

1. **Cloud NAT IP アドレス** で **手動** を選択します。

    新しい IP アドレスを次のように作成する必要があります。

    1. **IP アドレス 1** のドロップダウン リストから **IP アドレスを作成** を選択します。

    1. 表示されたダイアログ ボックスで、予約する IP アドレスの名前を設定し、**予約** をクリック します。

        このデモでは `your-org-byoc-nat-ip` に設定するか、命名規則に従います。

1. NAT ゲートウェイ用に新しい IP アドレスが予約されたら、**作成** をクリック します。

</Procedures>

### ステップ 4: ファイアウォール ルールを追加する\{#step-4-add-firewall-rules}

このステップでは、2 つのファイアウォール ルールを追加します。1 つ目のルールは、VPC ネットワークにデプロイされた BYOC クラスタに対するヘルス チェックを有効にするためのもので、2 つ目は、ターゲット タグ `zilliz-byoc` を持つすべての VM 間の通信を有効にするためのものです。

<Supademo id="cmbj0hb9p7c84sn1r5q4o16k0" title=""  />

これらのファイアウォール ルールを追加する手順は以下のとおりです。

<Procedures>

1. GCP コンソールで **VPC ネットワーク** を検索して をクリック します。

1. 前のステップで作成した VPC ネットワークをフィルタリングします。

1. VPC ネットワークの名前をクリックして詳細を表示します。

1. **ファイアウォール** タブに切り替えます。

1. **ファイアウォール ルールを追加** をクリック します。

    - BYOC クラスタに対するヘルス チェック用のファイアウォール ルール

        <table>
           <tr>
             <th><p><strong>名前</strong></p></th>
             <th><p>ingress-rule-for-health-checks</p></th>
           </tr>
           <tr>
             <td><p><strong>ターゲット</strong></p></td>
             <td><p>ネットワーク内のすべてのインスタンス</p></td>
           </tr>
           <tr>
             <td><p><strong>ソース IPv4 範囲</strong></p></td>
             <td><p><code>130.211.0.0/22</code>, <code>35.191.0.0/16</code></p></td>
           </tr>
           <tr>
             <td><p><strong>プロトコルとポート</strong></p></td>
             <td><p>指定したプロトコルとポート</p></td>
           </tr>
           <tr>
             <td><p><strong>TCP</strong></p></td>
             <td><p><code>19530</code></p></td>
           </tr>
        </table>

    - VPC ネットワーク上のタグ付き VM 間のローカル トラフィック用のファイアウォール ルール

        <table>
           <tr>
             <th><p><strong>名前</strong></p></th>
             <th><p>ingress-rule-for-local-traffic</p></th>
           </tr>
           <tr>
             <td><p><strong>ターゲット</strong></p></td>
             <td><p>指定したターゲット タグ</p></td>
           </tr>
           <tr>
             <td><p><strong>ターゲット タグ</strong></p></td>
             <td><p><code>zilliz-byoc</code></p></td>
           </tr>
           <tr>
             <td><p><strong>ソース IPv4 範囲</strong></p></td>
             <td><p><code>10.7.0.0/18</code> (または、<a href="./configure-vpc-gcp#step-1-create-a-vpc-network-and-add-the-primary-subnet">このセクション</a>のステップ 5 を参照して、計画したものを使用してください。)</p></td>
           </tr>
           <tr>
             <td><p><strong>プロトコルとポート</strong></p></td>
             <td><p>すべて許可</p></td>
           </tr>
        </table>

</Procedures>

### ステップ 5: (オプション) PSC エンドポイントを作成する\{#step-5-optional-create-a-psc-endpoint}

このステップでは、PSC エンドポイントを追加して、VPC と Zilliz Cloud 間の通信がインターネットを経由しないようにします。

<Supademo id="cmbj22gip7cyqsn1r4kes9547" title=""  />

PSC エンドポイントを作成する手順は以下のとおりです。

<Procedures>

1. GCP コンソールで **ネットワークサービス** を検索して をクリック します。

1. 左側のナビゲーション ペインから **プライベート Service Connect** を選択します。

1. **エンドポイントに接続** をクリック します。

1. **ターゲット** で **公開済みサービス** を選択します。

1. Zilliz Cloud が提供するサービス アタッチメント ID を **ターゲットの詳細** に入力します。

    次の表は、利用可能な各クラウド リージョンに固有のサービス アタッチメント ID を示しています。

    <table>
       <tr>
         <th><p>リージョン</p></th>
         <th><p>サービス アタッチメント ID</p></th>
       </tr>
       <tr>
         <td><p>us-west1</p></td>
         <td><p><code>projects/vdc-prod/regions/us-west1/serviceAttachments/zilliz-byoc-psc-service</code></p></td>
       </tr>
    </table>

1. エンドポイント サービスの名前を設定します。

1. 前のステップで作成した VPC ネットワークとそのプライマリ サブネットを選択します。

1. エンドポイントに IP アドレスを割り当てます。

    表示されたダイアログ ボックスで、以下のように操作します。

    1. **IP アドレスを作成** をクリック します。

    1. IP アドレスの名前を設定します。

    1. **静的IPアドレス** で **自動で割り当て** を選択します。

    1. **予約** を作成します。

1. **エンドポイントを追加** をクリック します。

</Procedures>