---
title: "クラスター接続の準備 | BYOC"
slug: /prepare-for-cluster-connection
sidebar_key: prepare-for-cluster-connection
sidebar_label: "クラスター接続の準備"
beta: CONTACT SALES
notebook: FALSE
description: "すべての BYOC クラスターは、お客様の仮想ネットワーク（AWS VPC、GCP VPC、または Microsoft Azure VNet）上に完全にホストされており、パブリックエンドポイントを持ちません。このガイドでは、これらの BYOC クラスターに接続する 2 つのアプローチについて説明します。 | BYOC"
type: origin
token: Ah0DwMIWsilLa4kVbYocJGCMnlh
sidebar_position: 7
keywords: 
  - zilliz
  - byoc
  - byoc-i
  - 権限
  - 最小限の権限
  - milvus
  - ベクトルデータベース
  - データベースに接続
  - クラスターに接続

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Procedures from '@site/src/components/Procedures';

# クラスター接続の準備

すべての BYOC クラスターは、独自の仮想ネットワーク（AWS VPC、GCP VPC、または Microsoft Azure VNet）上に完全にホストされており、パブリックエンドポイントを持ちません。このガイドでは、これらの BYOC クラスターに接続するための 2 つのアプローチについて説明します。

<details>

<summary>クラウドプロバイダーが使用する規約とその対応関係</summary>

このガイドは、クラウドプロバイダーに関係なく、すべての BYOC クラスターに適用されます。用語の違いに対処し、説明を簡潔にするため、ガイドで使用する規約と、各プロバイダーが使用する規約との対応関係を以下に示します。

<table>
   <tr>
     <th><p>規約</p></th>
     <th><p>AWS</p></th>
     <th><p>GCP</p></th>
     <th><p>Azure</p></th>
   </tr>
   <tr>
     <td><p><strong>仮想ネットワーク</strong></p></td>
     <td><p>VPC</p></td>
     <td><p>VPC</p></td>
     <td><p>VNet</p></td>
   </tr>
   <tr>
     <td><p><strong>Security group</strong></p></td>
     <td><p>Security group</p></td>
     <td><p>Firewall rules</p></td>
     <td><p>ネットワーク Security Group (NSG)</p></td>
   </tr>
   <tr>
     <td><p><strong>Load balancer</strong></p></td>
     <td><p>ネットワーク Load Balancer (NLB)</p></td>
     <td><p>Cloud Load Balancer</p></td>
     <td><p>Load Balancer</p></td>
   </tr>
   <tr>
     <td><p><strong>プライベート endpoint</strong></p></td>
     <td><p>プライベートLink</p></td>
     <td><p>プライベート Service Connect (PSC)</p></td>
     <td><p>プライベート Link</p></td>
   </tr>
   <tr>
     <td><p><strong>仮想ネットワーク endpoint</strong></p></td>
     <td><p>VPC Endpoint</p></td>
     <td><p>PSC Endpoint</p></td>
     <td><p>プライベート Endpoint</p></td>
   </tr>
   <tr>
     <td><p><strong>仮想ネットワーク endpoint service</strong></p></td>
     <td><p>VPC Endpoint Service</p></td>
     <td><p>PSC Publishing</p></td>
     <td><p>プライベート Link Service</p></td>
   </tr>
</table>

</details>

## 利用可能な接続モード\{#available-connection-modes}

BYOC クラスターには、以下のいずれかのモードで接続できます。

- **[Direct VPC access](./prepare-for-cluster-connection#direct-vpc-access)**

    このモードでは、クライアント（通常は BYOC クラスターと連携するアプリケーション）は、BYOC クラスターと同じ仮想ネットワークに存在します。このモードはデフォルトの選択であり、追加のネットワーク設定は必要ありません。

    これを使用するには、**データプレーンのデプロイ時にプライベートエンドポイントを選択しないでください。**

- **[プライベート endpoint access](./prepare-for-cluster-connection#private-endpoint-access)**

    このモードでは、クライアントは複数の仮想ネットワークや異なるアカウントに存在する可能性があります。これには一度限りのセットアップが必要ですが、プライベートエンドポイントが整えば、新しいクラスターの追加や追加のクライアント仮想ネットワークの接続が簡単になります。

    これを使用するには、**データプレーンのデプロイ時にプライベートエンドポイントを有効にしてください。**

以下の表では、これら 2 つのモードをセットアップの複雑さ、可用性、クラスターごとのアクセス制御、クロスアカウント対応、およびマルチ仮想ネットワークのスケーラビリティの観点から比較しています。

<table>
   <tr>
     <th></th>
     <th><p><strong>Mode 1: Direct VPC Access</strong></p></th>
     <th><p><strong>Mode 2: プライベートLink Access</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>Best for</strong></p></td>
     <td><p>Clients in the same VPC as the data plane</p></td>
     <td><p>Clients in multiple VPCs or different accounts</p></td>
   </tr>
   <tr>
     <td><p><strong>Setup complexity</strong></p></td>
     <td><p>Low — works by default after deployment</p></td>
     <td><p>One-time setup; simpler to scale as 新しいクラスターs are added, automatically accessible via wildcard DNS</p></td>
   </tr>
   <tr>
     <td><p><strong>Availability</strong></p></td>
     <td><p>Default for all BYOC deployments</p></td>
     <td><p>Currently requires contacting Zilliz Support to enable (self-service coming soon)</p></td>
   </tr>
   <tr>
     <td><p><strong>Per-cluster access control</strong></p></td>
     <td><p>Security Group per cluster load balancer</p></td>
     <td><p>Kubernetes Envoy Gateway SecurityPolicy</p></td>
   </tr>
   <tr>
     <td><p><strong>Cross-account support</strong></p></td>
     <td><p>No</p></td>
     <td><p>Yes</p></td>
   </tr>
   <tr>
     <td><p><strong>Multi-virtual-network scalability</strong></p></td>
     <td><p>Low — each new client VPC requires a separate VPC Peering and routing configurations.</p></td>
     <td><p>High — new client VPCs connect via a single Endpoint Service; 新しいクラスターs are reachable immediately.</p></td>
   </tr>
</table>

## Direct VPC access\{#direct-vpc-access}

各 BYOC クラスターは実際には Kubernetes クラスターであり、エントリーポイントとしてロードバランサーを公開しています。ロードバランサーは、ポート 19530 でクラスターへの着信トラフィックを転送します。Zilliz はパブリックホストゾーンを介してクラスターエンドポイントを管理しているため、クライアントがロードバランサーとのレイヤー 3 接続を確立していれば、任意のネットワークからトラフィックを解決できます。

![WXXlwsQOfhAw5NbizaFcvEYJnBh](https://zdoc-images.s3.us-west-2.amazonaws.com/WXXlwsQOfhAw5NbizaFcvEYJnBh.png)

上図は、クライアントアプリケーションから BYOC クラスターへのトラフィックフローを示しています。ここでは、クラスター固有のロードバランサーが各クラスターの Milvus プロキシ にトラフィックを転送します。各クラスターには独自のロードバランサーがあり、クラスターレベルのアクセス制御を実装できます。

### 前提条件\{#prerequisites}

- クライアントアプリケーションが BYOC プロジェクトのデータプレーンと同じ仮想ネットワークで実行されているか、クライアントの仮想ネットワークとデータプレーンの仮想ネットワークが、適切なルートテーブルエントリを持つ仮想ネットワークピアリングを介して接続されていること。

- クライアントに関連付けられたセキュリティグループが、データプレーンの仮想ネットワークセグメントへの**ポート 19530 でのアウトバウンドトラフィック**を許可していること。

- データプレーンのセキュリティグループが、クライアントのネットワークセグメントまたはセキュリティグループからの**ポート 19530 でのインバウンドトラフィック**を許可していること。

### ステップ 1: クラスターエンドポイントを取得する\{#step-1-get-your-cluster-endpoint}

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com)を開きます。

1. BYOC プロジェクトに移動し、クラスターを選択します。

1. **クラスターの詳細**ページで、**接続**カードを見つけます。

1. **クラスターエンドポイント**をコピーします。形式は `<i>http</i>s://${cluster-id}-internal.${region}.byoc.vectordb.zillizcloud.com:19530` です。

    <Admonition type="info" icon="📘" title="Notes">

    <p>Terraform を使用してデプロイされた BYOC クラスターの場合、Terraform の出力からエンドポイントを取得することもできます。</p>

    </Admonition>

</Procedures>

### ステップ 2: クラスターに接続する\{#step-2-connect-to-the-cluster}

次に、コピーしたクラスターエンドポイントと認証情報を使用してクラスターに接続できます。詳細については、[クラスターへの接続](./connect-to-cluster)を参照してください。

## プライベート endpoint access\{#private-endpoint-access}

BYOC プロジェクトのデータプレーンのデプロイ時にプライベートエンドポイントを有効にした場合、データプレーンの仮想ネットワークに共有ゲートウェイがデプロイされ、エントリーポイントとして単一のロードバランサーが配置されます。ゲートウェイは TLS を終端し、リクエストのホスト名に基づいて正しいクラスターにトラフィックをルーティングします。

この場合、ロードバランサーを仮想ネットワークエンドポイントとして公開する必要があり、これにより、他のクラウドプロバイダーアカウントのものも含め、任意の数のクライアント仮想ネットワークがそのエンドポイントを介して BYOC クラスターに接続できるようになります。

![L0zPwoEePhJF9Bbgln3cQXFMn8e](https://zdoc-images.s3.us-west-2.amazonaws.com/L0zPwoEePhJF9Bbgln3cQXFMn8e.png)

上図に示すように、クライアントアプリケーションと BYOC クラスター間のトラフィックは、クライアントの仮想ネットワーク内の仮想ネットワークエンドポイント、仮想ネットワークエンドポイントサービス、Zilliz Gateway として機能するデータプレーンの仮想ネットワーク内の共有ロードバランサー、クラスター固有の TLS 終端ゲートウェイ、および各クラスターの Milvus プロキシ を経由します。

クラスターエンドポイント（`*.${region}.byoc.vectordb.zillizcloud.com`）は、Zilliz Cloud が管理するパブリックアドレスに解決されます。したがって、各クライアントの仮想ネットワークは、ワイルドカードドメインを仮想ネットワークのプライベート IP アドレスに向ける DNS レコードを追加することで、DNS 解決をオーバーライドする必要があります。

<Admonition type="info" icon="📘" title="Notes">

<p>データプレーンのデプロイ時にプライベートエンドポイントオプションを選択解除し、プライベートエンドポイントアクセスが必要な場合は、<a href="https://support.zilliz.com/hc/en-us/requests/new">お問い合わせ</a>いただき、データプレーンでのゲートウェイデプロイメントを有効にできるようお手伝いさせていただきます。</p>

</Admonition>

### 前提条件\{#prerequisites}

- BYOC プロジェクトがあり、Zilliz テクニカルサポートがゲートウェイのデプロイメントを確認していること。

- 仮想ネットワークエンドポイント、仮想ネットワークエンドポイントサービス、および DNS レコードを管理する権限があること。

- クライアントの仮想ネットワークが、BYOC プロジェクトのデータプレーンと同じリージョンにあること。

### ステップ 1: 仮想ネットワークエンドポイントサービスを作成する\{#step-1-create-a-virtual-network-endpoint-service}

<Tabs groupId="prepare-for-cluster-connection" defaultValue="aws" values={[{"label": "AWS", "value": "aws"},{"label": "GCP", "value": "gcp"},{"label": "Azure", "value": "azure"}]}>

<TabItem value="aws">

ロードバランサーは、データプレーン内で `zilliz-gateway` という名前です。このロードバランサーから仮想ネットワークエンドポイントサービスを作成し、クライアントの仮想ネットワークがそれに接続できるようにする必要があります。

3 つのオプションが利用可能です。AWS コンソール、AWS CloudShell、または Zilliz が提供する Terraform スクリプトを使用して、仮想ネットワークエンドポイントを作成できます。

#### AWS コンソールでの操作\{#on-aws-console}

<Procedures>

1. **VPC** コンソールに移動し、**プライベートLink and Lattice** > **Endpoint services** を選択します。

1. **Create endpoint service** をクリックします。

1. **Load balancer type** で、**ネットワーク** を選択します。

1. **Available load balancers** で、**`zilliz-gateway`** という名前の NLB を選択します。

1. **Acceptance required** を、アクセス制御の設定に応じて設定します（自動承認の場合は無効化）。

1. **Create endpoint service** をクリックします。

1. **サービス名**（例: `com.amazonaws.vpce.${region}.vpce-svc-xxxxxxxxxxxxxxxxx`）をメモします。これをすべてのクライアント VPC オーナーと共有します。

</Procedures>

#### AWS CloudShell での操作\{#in-aws-cloudshell}

以下のコマンドを実行して、仮想ネットワークエンドポイントを作成します。

```bash
# Get the ARN of the zilliz-gateway NLB
NLB_ARN=$(aws elbv2 describe-load-balancers \
  --query "LoadBalancers[?LoadBalancerName=='zilliz-gateway'].LoadBalancerArn" \
  --output text)

# Create the endpoint service
aws ec2 create-vpc-endpoint-service-configuration \
  --network-load-balancer-arns "$NLB_ARN" \
  --no-acceptance-required \
  --query "ServiceConfiguration.ServiceName" \
  --output text
```

#### Terraform の使用\{#using-terraform}

仮想ネットワークエンドポイントを作成するには、以下のコマンドを実行します。

```bash
data "aws_lb" "zilliz_gateway" {
  name = "zilliz-gateway"
}

resource "aws_vpc_endpoint_service" "zilliz_gateway" {
  network_load_balancer_arns = [data.aws_lb.zilliz_gateway.arn]
  acceptance_required        = false
}

output "endpoint_service_name" {
  value = aws_vpc_endpoint_service.zilliz_gateway.service_name
}
```

</TabItem>

<TabItem value="gcp">

#### GCP コンソール上で\{#on-the-gcp-console}

#### GCP Cloud Shell 内で\{#in-gcp-cloud-shell}

#### Terraform を使用して\{#using-terraform}

</TabItem>

<TabItem value="azure">

#### Azure コンソール上で\{#on-the-azure-console}

#### Azure Cloud Shell 内で\{#in-azure-cloud-shell}

#### Terraform を使用して\{#using-terraform}

</TabItem>

</Tabs>

### ステップ 2: 各クライアント仮想ネットワークに Virtual ネットワーク Endpoint を作成する\{#step-2-create-a-virtual-network-endpoint-in-each-client-virtual-network}

<Tabs groupId="prepare-for-cluster-connection" defaultValue="aws" values={[{"label": "AWS", "value": "aws"},{"label": "GCP", "value": "gcp"},{"label": "Azure", "value": "azure"}]}>

<TabItem value="aws">

#### AWS コンソール上で\{#on-aws-console}

BYOC クラスターに接続する必要のあるすべてのクライアント VPC について、以下の手順を繰り返してください。

<Procedures>

1. **VPC** コンソールに移動し、**プライベートLink and Lattice** > **Endpoints** を選択します。

1. **Create endpoint** をクリックします。

1. **Service category** で、**Other endpoint services** を選択します。

1. ステップ 1 の**サービス名**を貼り付け、**Verify service**をクリックします。

1. クライアントアプリケーションが実行されている**VPC**を選択します。

1. 使用する各アベイラビリティーゾーン内の**サブネット**を選択します。

1. ポート 19530 でのインバウンドトラフィックを許可する**セキュリティグループ**を割り当てます。

1. **Create endpoint** をクリックします。

1. エンドポイントのステータスが**Available**になるまで待ちます。

</Procedures>

上記で作成した各 VPC エンドポイントについて、各サブネットに割り当てられたプライベート IP アドレスを次のように取得します。

<Procedures>

1. **VPC** コンソールに移動し、**Endpoints**をクリックします。

1. エンドポイントを選択し、**サブネット**タブに移動します。

1. 各サブネットに記載されている**IPアドレス**を控えます。これらを A レコードのターゲットとして使用します。

</Procedures>

#### AWS CloudShell 内で\{#in-aws-cloudshell}

プレースホルダーを実際の値に置き換えてコマンドを実行します。

```bash
# Replace with your values
SERVICE_NAME="com.amazonaws.vpce.${region}.vpce-svc-xxxxxxxxxxxxxxxxx"
VPC_ID="vpc-xxxxxxxxxxxxxxxxx"
SUBNET_IDS="subnet-aaa subnet-bbb subnet-ccc"
SECURITY_GROUP_ID="sg-xxxxxxxxxxxxxxxxx"

aws ec2 create-vpc-endpoint \
  --vpc-endpoint-type Interface \
  --service-name "$SERVICE_NAME" \
  --vpc-id "$VPC_ID" \
  --subnet-ids $SUBNET_IDS \
  --security-group-ids "$SECURITY_GROUP_ID"
```

#### Terraform の使用\{#using-terraform}

プレースホルダーを実際の値に置き換えて、コマンドを実行してください。

```bash
resource "aws_vpc_endpoint" "zilliz_byoc" {
  vpc_id              = var.client_vpc_id
  service_name        = aws_vpc_endpoint_service.zilliz_gateway.service_name
  vpc_endpoint_type   = "Interface"
  subnet_ids          = var.client_subnet_ids
  security_group_ids  = [var.client_security_group_id]
}
```

</TabItem>

<TabItem value="gcp">

#### GCP コンソール上で\{#on-the-gcp-console}

#### GCP Cloud Shell 内で\{#in-gcp-cloud-shell}

#### Terraform を使用して\{#using-terraform}

</TabItem>

<TabItem value="azure">

#### Azure コンソール上で\{#on-the-azure-console}

#### Azure Cloud Shell 内で\{#in-azure-cloud-shell}

#### Terraform を使用して\{#using-terraform}

</TabItem>

</Tabs>

### ステップ 3: DNS レコードの設定\{#step-3-configure-dns-records}

<Tabs groupId="prepare-for-cluster-connection" defaultValue="aws" values={[{"label": "AWS", "value": "aws"},{"label": "GCP", "value": "gcp"},{"label": "Azure", "value": "azure"}]}>

<TabItem value="aws">

クラスターエンドポイントドメイン（`*.aws-${region}.byoc.vectordb.zillizcloud.com`）は、 publicly reachable な Zilliz 管理の IP アドレスに解決されます。これを VPC エンドポイントにリダイレクトするには、VPC 内での DNS 解決を上書きするプライベート Route 53 ホストゾーンを作成する必要があります。

BYOC クラスターに接続する必要のあるすべてのクライアント VPC について、以下の手順を繰り返してください。

<Procedures>

1. **Route 53** コンソールを開き、**Hosted zones** に移動します。

1. **Create hosted zone** をクリックします。

1. **Domain name** を `aws-${region}.byoc.vectordb.zillizcloud.com` に設定します（`${region}` をお使いの AWS リージョンに置き換えてください。例：`aws-us-west-2.byoc.vectordb.zillizcloud.com`）。

1. **Type** を **プライベート hosted zone** に設定します。

1. クライアント VPC に関連付けます。

1. **Create hosted zone** をクリックします。

1. ホストゾーン内で、**Create record** をクリックします。

1. **Record name** を `*`（ワイルドカード）に設定します。

1. **Record type** を **A** に設定します。

1. 上記のエンドポイント IP アドレスを入力します（マルチ値を使用する場合は 1 行に 1 つずつ入力します）。

1. **Create records** をクリックします。

</Procedures>

#### AWS CloudShell 内で\{#in-aws-cloudshell}

プレースホルダーを実際の値に置き換えて、コマンドを実行してください。

```bash
REGION="us-west-2"
VPC_ID="vpc-xxxxxxxxxxxxxxxxx"
HOSTED_ZONE_NAME="aws-${REGION}.byoc.vectordb.zillizcloud.com"
ENDPOINT_IPS='["10.0.1.x", "10.0.2.x", "10.0.3.x"]'  # Replace with your endpoint IPs

# Create the private hosted zone
HOSTED_ZONE_ID=$(aws route53 create-hosted-zone \
  --name "$HOSTED_ZONE_NAME" \
  --caller-reference "$(date +%s)" \
  --hosted-zone-config "PrivateZone=true" \
  --vpc "VPCRegion=${REGION},VPCId=${VPC_ID}" \
  --query "HostedZone.Id" \
  --output text)

# Add the wildcard A record
aws route53 change-resource-record-sets \
  --hosted-zone-id "$HOSTED_ZONE_ID" \
  --change-batch "{
    \"Changes\": [{
      \"Action\": \"CREATE\",
      \"ResourceRecordSet\": {
        \"Name\": \"*.${HOSTED_ZONE_NAME}\",
        \"Type\": \"A\",
        \"TTL\": 60,
        \"ResourceRecords\": $(echo $ENDPOINT_IPS | jq '[.[] | {\"Value\": .}]')
      }
    }]
  }"
```

同じホストゾーンに追加の VPC を関連付けるには:

```dart
aws route53 associate-vpc-with-hosted-zone \
  --hosted-zone-id "$HOSTED_ZONE_ID" \
  --vpc "VPCRegion=${REGION},VPCId=${ADDTIONAL_VPC_ID}"
```

#### Terraform の使用\{#using-terraform}

プレースホルダーを実際の値に置き換えて、コマンドを実行してください。

```bash
locals {
  region         = "us-west-2"
  endpoint_ips   = ["10.0.1.x", "10.0.2.x", "10.0.3.x"]  # Replace with your endpoint IPs
}

resource "aws_route53_zone" "zilliz_byoc" {
  name = "aws-${local.region}.byoc.vectordb.zillizcloud.com"

  vpc {
    vpc_id = var.client_vpc_id
  }
}

resource "aws_route53_record" "zilliz_byoc_wildcard" {
  zone_id = aws_route53_zone.zilliz_byoc.zone_id
  name    = "*.aws-${local.region}.byoc.vectordb.zillizcloud.com"
  type    = "A"
  ttl     = 60
  records = local.endpoint_ips
}

# Associate additional VPCs if needed
resource "aws_route53_zone_association" "additional_vpc" {
  for_each = toset(var.additional_vpc_ids)

  zone_id = aws_route53_zone.zilliz_byoc.zone_id
  vpc_id  = each.value
}
```

</TabItem>

<TabItem value="gcp">

#### GCP コンソール上\{#on-the-gcp-console}

#### GCP Cloud Shell 内\{#in-gcp-cloud-shell}

#### Terraform を使用\{#using-terraform}

</TabItem>

<TabItem value="azure">

#### Azure コンソール上\{#on-the-azure-console}

#### Azure Cloud Shell 内\{#in-azure-cloud-shell}

#### Terraform を使用\{#using-terraform}

</TabItem>

</Tabs>

### ステップ 4: クラスターへの接続\{#step-4-connect-to-the-cluster}

その後、コピーしたクラスターエンドポイントと認証情報を使用してクラスターに接続できます。詳細については、[クラスターへの接続](./connect-to-cluster) を参照してください。

## トラブルシューティング\{#troubshootings}

次の表に、準備中に発生する可能性のある一般的な問題を示します。

<table>
   <tr>
     <th><p><strong>症状</strong></p></th>
     <th><p><strong>考えられる原因</strong></p></th>
     <th><p><strong>解決方法</strong></p></th>
   </tr>
   <tr>
     <td><p>接続タイムアウト（モード 1）</p></td>
     <td><p>セキュリティグループがポート 19530 をブロックしている</p></td>
     <td><p>データプレーンのセキュリティグループでポート 19530 のインバウンドルールを追加するか、クライアントのセキュリティグループでアウトバウンドルールを追加してください。</p></td>
   </tr>
   <tr>
     <td><p>接続タイムアウト（モード 2）</p></td>
     <td><p>DNS が上書きされていない、または VPC エンドポイントが準備できていない</p></td>
     <td><p>ホストゾーンが正しい VPC に関連付けられていることを確認してください；エンドポイントのステータスが「利用可能」であることを確認してください</p></td>
   </tr>
   <tr>
     <td><p>DNS が誤った IP アドレス に解決される（モード 2）</p></td>
     <td><p>プライベート ホストゾーンがクライアントの VPC に関連付けられていない</p></td>
     <td><p>Route 53 ホストゾーンをすべてのクライアント VPC に関連付けてください</p></td>
   </tr>
   <tr>
     <td><p>TLS エラー</p></td>
     <td><p>SDK で <code>secure=True</code> / HTTPS が指定されていない</p></td>
     <td><p>エンドポイント URI が <code>https://</code> で始まっていることを確認してください</p></td>
   </tr>
</table>

