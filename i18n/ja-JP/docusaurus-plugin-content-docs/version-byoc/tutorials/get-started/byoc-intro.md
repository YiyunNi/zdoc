---
title: "BYOC 概要 | BYOC"
slug: /byoc-intro
sidebar_key: byoc-intro
sidebar_label: "BYOC 概要"
beta: CONTACT SALES
notebook: FALSE
description: "Bring Your Own Cloud（BYOC）は、組織がアプリケーションとデータを Zilliz Cloud のインフラストラクチャではなく、独自のクラウドアカウントでホストするためのデプロイメントオプションです。このソリューションは、データの完全な管理と主権を維持することが求められる特定のセキュリティ要件や規制コンプライアンスのニーズを持つ組織に最適です。 | BYOC"
type: origin
token: RZqzw4UPkiikHOkdoa4chGDgnWX
sidebar_position: 1
keywords: 
  - zilliz
  - byoc
  - milvus
  - ベクトルデータベース

---

import Admonition from '@theme/Admonition';


# BYOC 概要

Bring Your Own Cloud (BYOC) は、組織が Zilliz Cloud のインフラストラクチャではなく、独自のクラウドアカウントでアプリケーションとデータをホストするためのデプロイメントオプションです。このソリューションは、完全なデータコントロール主権の維持を必要とする特定のセキュリティ要件や規制コンプライアンスのニーズを持つ組織に最適です。

<Admonition type="info" icon="📘" title="Notes">

Zilliz BYOC は現在 **一般提供** されています。アクセスおよび実装の詳細については、[Zilliz Cloud サポート](https://zilliz.com/contact-sales) までお問い合わせください。

</Admonition>

## Zilliz BYOC を使用する理由\{#why-use-zilliz-byoc}

Zilliz BYOC は、独自のデプロイメントオプションを提供し、データの完全なコントロールを維持しながら、以下のメリットで運用オーバーヘッドを排除します。

- **運用**

    - [Zilliz Cloud コンソール](https://cloud.zilliz.com) で BYOC プロジェクトを作成し、インフラストラクチャをデプロイできます。

    - プロジェクト内の BYOC クラスターの監視のために、最適化されたメトリクスとアラート設定を使用できます。

- **スケーラビリティ**

    - ライセンスを追加購入することで、BYOC プロジェクトをいつでもスケールできます。

    - BYOC プロジェクト内のクラスターは、手動および自動スケーリングメカニズムでスケール可能です。

- **データ管理とセキュリティ**

    - 組織、プロジェクト、およびクラスターレベルでのロールベースアクセスコントロール (RBAC)。

    - すべてのデータは、お客様のクラウドアカウント内で安全に保存および処理されます。

## 仕組み\{#how-it-works}

BYOC では、Milvus と共に、Zilliz が管理するバックエンドサービス（アップグレードワークフロー、リソーススケジューラ、Open API サービス、Web コンソールなど）を、お客様のクラウド環境内、通常は独自の Virtual プライベート Cloud (VPC) 内にデプロイします。この設定により、データはお客様自身のインフラストラクチャ内で保存および処理されます。

Zilliz BYOC は、多様な企業ガバナンス要件に適応するため、2 つのデプロイメントモードを実装しています。

- [BYOC](./byoc-intro#byoc)

- [BYOC-I](./byoc-intro#byoc-i)

### BYOC\{#byoc}

この Zilliz BYOC の完全管理モードでは、クラウドプロバイダーが提供するクロスアカウントロール引き受けメカニズムを使用し、Zilliz Cloud が EKS クラスターと EC2 インスタンスを管理する権限を引き受けることができます。

![PCAOw33vKhCLHubzOiCciDDMnGg](https://zdoc-images.s3.us-west-2.amazonaws.com/PCAOw33vKhCLHubzOiCciDDMnGg.png)

上記のアーキテクチャに従い、Zilliz Cloud が EKS クラスターを起動し、Milvus Operator、Import/Backup ツール、Grafana および Prometheus を含む監視スタック、および Milvus インスタンスなどの必要なコンポーネントをお客様に代わってデプロイするために、VPC、S3 バケット、および最小限の権限を提供する必要があります。

監視スタックは、Zilliz Cloud コントロールプレーンではなく、BYOC インフラストラクチャ内にローカルに統合されていることに注意してください。監視統合の有効化および設定については、[Zilliz テクニカルサポート](https://support.zilliz.com/hc/en-us) までお問い合わせください。

さらに、Zilliz Cloud は、お客様の VPC にデプロイされたコンポーネントとの通信のために、2 つの独立したプレーンを確立します。

- **コントロールプレーン**

    コントロールプレーンは、リソースのスケジューリング、Milvus インスタンスのアップグレード、および Zilliz Cloud コンソールとコントロールプレーンの Open API サービスへのアクセス提供のために、Zilliz Cloud とお客様の VPC にデプロイされたコンポーネント間の通信を促進します。

- **データプレーン**

    データプレーンは、データの保存および取得を目的として、お客様のアプリケーション/サービスとお客様の VPC にデプロイされた Milvus インスタンス間の通信を可能にします。

### BYOC-I\{#byoc-i}

このモードでは、完全管理型の Zilliz BYOC デプロイメントで使用されるクロスアカウントロール引き受け方法の代わりに、包括的な運用および保守機能を提供する BYOC エージェントをお客様の環境にデプロイします。Cloud Plane と BYOC エージェント間に、暗号化されたポイントツーポイント (P2P) リバーストンネルが作成され、通信セキュリティが向上します。

![UyVBwtva2hZaAMbP1zicQeRHnah](https://zdoc-images.s3.us-west-2.amazonaws.com/UyVBwtva2hZaAMbP1zicQeRHnah.png)

BYOC-I モードでは、Zilliz はインフラストラクチャリソースをお客様に代わって管理するためのクロスアカウント権限を要求するのではなく、インフラストラクチャ管理を完全にお客様に委ねることで、データコントロール主権を強化します。

ただし、必要に応じて Zilliz がインフラストラクチャ管理を支援できるよう、エージェントに必要な権限を付与することを選択することもできます。

## セキュリティ保証\{#security-assurance}

Zilliz Cloud は、包括的な暗号化と厳格なアクセスコントロールを通じて、ネットワーク境界を越えた安全な通信を確保します。

### ネットワークセキュリティ\{#network-security}

- **内部トラフィック**: クラスターセキュリティグループ内での完全な TCP/UDP 通信。

- **外部トラフィック**: ポート 443 での暗号化されたアウトバウンド専用 TCP 接続により、以下が可能になります。

    - Zilliz コントロールプレーンへの接続。

    - データソースおよびイメージリポジトリへのアクセス。

- **同じセキュリティグループ**: クラスター内通信のための TCP/UDP 接続が許可されています。

### アクセスコントロール\{#access-control}

- Zilliz エンジニア向けの安全な VPN および、ジャストインタイムの証明書ベース認証。

- すべてのアクセスには承認が必要であり、監査のためにログが記録されます。

- コントロールプレーンは、アウトバウンド専用 TCP 接続を通じてメトリクスを監視および収集します。

これらの堅牢な対策により、データの整合性と機密性が保護され、クラウドでの安全で信頼性の高い運用が確保されます。

### 転送中の暗号化\{#encryption-in-transit}

クライアントは、Zilliz Cluster への HTTPS または gRPC 接続を確立します。HTTPS/gRPC 接続は、TLS 1.2（またはそれ以上）プロトコルと AES-256（256 ビット Advanced Encryption Standard）を使用して、転送中のユーザーデータを暗号化します。

### 保存時の暗号化\{#encryption-at-rest}

Zilliz Cloud のデータプレーンは、AWS S3 に保存されたデータを AES-256（256 ビット Advanced Encryption Standard）暗号化アルゴリズムを使用して暗号化します。

## コスト管理\{#cost-management}

Zilliz BYOC は、リソース管理を通じて BYOC プロジェクトで使用するサービスに対して課金します。ただし、以下の図に示すように、クラウドサービスプロバイダーからのインフラストラクチャ費用は依然として発生します。

![TudFwgMGthlQmvbeH9qcXx0jnzn](https://zdoc-images.s3.us-west-2.amazonaws.com/TudFwgMGthlQmvbeH9qcXx0jnzn.png)

