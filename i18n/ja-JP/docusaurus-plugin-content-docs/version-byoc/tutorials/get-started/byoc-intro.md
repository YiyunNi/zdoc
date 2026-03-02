---
title: "BYOC の概要 | BYOC"
slug: /byoc-intro
sidebar_label: "BYOC の概要"
beta: CONTACT SALES
notebook: FALSE
description: "Bring Your Own Cloud (BYOC) は、組織が Zilliz Cloud のインフラストラクチャを使用する代わりに、自身のクラウドアカウントでアプリケーションとデータをホストするためのデプロイオプションです。このソリューションは、完全なデータ制御主権の維持を必要とする特定のセキュリティ要件や規制コンプライアンスのニーズを持つ組織に最適です。 | BYOC"
type: origin
token: RZqzw4UPkiikHOkdoa4chGDgnWX
sidebar_position: 1
keywords: 
  - zilliz
  - byoc
  - milvus
  - ベクトルデータベース
  - HNSW
  - 非構造化データとは
  - ベクトル埋め込み
  - ベクトルストア

---

import Admonition from '@theme/Admonition';


# BYOC の概要

Bring Your Own Cloud (BYOC) は、Zilliz Cloud のインフラストラクチャを使用する代わりに、組織が独自のクラウドアカウントでアプリケーションとデータをホストするためのデプロイオプションです。このソリューションは、完全なデータ制御主権を維持する必要がある特定のセキュリティ要件または規制コンプライアンス要件を持つ組織に最適です。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz BYOC は現在、**一般提供**されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloud サポート</a>にお問い合わせください。</p>

</Admonition>

## Zilliz BYOC を使用する理由{#why-use-zilliz-byoc}

Zilliz BYOC は、運用上のオーバーヘッドを排除しながら、データを完全に制御できる独自のデプロイオプションを提供します。その利点は次のとおりです。

- **運用**

    - BYOC プロジェクトを作成し、[Zilliz Cloud コンソール](https://cloud.zilliz.com)にインフラストラクチャをデプロイできます。

    - プロジェクト内の BYOC クラスターを監視するために、適切に調整されたメトリクスとアラート設定を使用できます。

- **スケーラビリティ**

    - より多くのライセンスを購入することで、BYOC プロジェクトを常にスケールできます。

    - BYOC プロジェクト内のクラスターは、手動および自動スケーリングメカニズムでもスケーラブルです。

- **データ管理とセキュリティ**

    - 組織、プロジェクト、クラスターレベルでのロールベースのアクセス制御 (RBAC)。

    - すべてのデータは、クラウドアカウント内に安全に保存および処理されます。

## 仕組み{#how-it-works}

BYOC は、Milvus を Zilliz が管理するバックエンドサービス (アップグレードワークフロー、リソーススケジューラ、Open API サービス、Web コンソールなど) とともに、クラウド環境 (通常は独自の Virtual Private Cloud (VPC) 内) にデプロイすることを伴います。この設定により、データが独自のインフラストラクチャ内に保存および処理されることが保証されます。

Zilliz BYOC は、多様な企業ガバナンス要件に適応するために、2 つのデプロイモードを実装しています。

- [BYOC](./byoc-intro#byoc)

- [BYOC-I](./byoc-intro#byoc-i)

### BYOC{#byoc}

Zilliz BYOC のこの完全に管理されたモードでは、クラウドプロバイダーが提供するクロスアカウントロール引き受けメカニズムを利用し、Zilliz Cloud が EKS クラスターと EC2 インスタンスを管理する権限を引き受けることを許可します。

![PCAOw33vKhCLHubzOiCciDDMnGg](https://zdoc-images.s3.us-west-2.amazonaws.com/PCAOw33vKhCLHubzOiCciDDMnGg.png)

上記のアーキテクチャに従って、VPC、S3 バケット、および Zilliz Cloud が EKS クラスターを起動し、Milvus Operator、Import/Backup ツール、Grafana と Prometheus を含む監視スタック、および Milvus インスタンスなどの必要なコンポーネントをデプロイするための最小限の権限を提供する必要があります。

さらに、Zilliz Cloud は、VPC にデプロイされたコンポーネントとの通信のために 2 つの個別のプレーンを確立します。

- **コントロールプレーン**

    コントロールプレーンは、Zilliz Cloud と VPC にデプロイされたコンポーネント間の通信を促進し、リソースのスケジューリング、Milvus インスタンスのアップグレード、Zilliz Cloud コンソールとコントロールプレーン Open API サービスへのアクセスを提供します。

- **データプレーン**

    データプレーンは、アプリケーション/サービスと VPC にデプロイされた Milvus インスタンス間の通信を可能にし、特にデータストレージと取得のために使用されます。

### BYOC-I{#byoc-i}

このモードでは、完全に管理された Zilliz BYOC デプロイでクロスアカウントロール引き受け方法を使用する代わりに、包括的な運用および保守機能のために BYOC エージェントを環境にデプロイします。Cloud Plane と BYOC エージェントの間には、通信セキュリティを向上させるために暗号化されたポイントツーポイント (P2P) リバーストンネルが作成されます。

![UyVBwtva2hZaAMbP1zicQeRHnah](https://zdoc-images.s3.us-west-2.amazonaws.com/UyVBwtva2hZaAMbP1zicQeRHnah.png)

BYOC-I モードでは、Zilliz は、インフラストラクチャリソースを管理するためのクロスアカウント権限を要求する代わりに、インフラストラクチャ管理を完全にユーザーに任せることで、データ制御の主権を強化します。

ただし、必要に応じて Zilliz がインフラストラクチャ管理を支援できるように、エージェントに必要な権限を付与することもできます。

## セキュリティ保証{#security-assurance}

Zilliz Cloud は、包括的な暗号化と厳格なアクセス制御を通じて、ネットワーク境界を越えた安全な通信を保証します。

### ネットワークセキュリティ{#network-security}

- **内部トラフィック**: クラスターセキュリティグループ内の完全な TCP/UDP 通信。

- **外部トラフィック**: ポート 443 での暗号化されたアウトバウンドのみの TCP 接続により、以下が可能になります。

    - Zilliz コントロールプレーンへの接続。

    - データソースとイメージリポジトリへのアクセス。

- **同じセキュリティグループ**: クラスター内通信のために TCP/UDP 接続が許可されます。

### アクセス制御{#access-control}

- Zilliz エンジニア向けの安全な VPN と、ジャストインタイムの証明書ベースの認証。

- すべてのアクセスには承認が必要であり、監査のためにログに記録されます。

- コントロールプレーンは、アウトバウンドのみの TCP 接続を通じてメトリクスを監視および収集します。

これらの堅牢な対策は、データの整合性と機密性を保護し、クラウドでの安全で信頼性の高い運用を保証します。

### 転送中の暗号化{#encryption-in-transit}

クライアントは、Zilliz クラスターへの HTTPS または gRPC 接続を確立します。HTTPS/gRPC 接続は、TLS 1.2 (またはそれ以上) プロトコルと AES-256 (256 ビット Advanced Encryption Standard) を使用して、転送中のユーザーデータを暗号化します。

### 保存時の暗号化{#encryption-at-rest}

Zilliz Cloud のデータプレーンは、AWS S3 に保存されたデータを AES-256 (256 ビット Advanced Encryption Standard) 暗号化アルゴリズムを使用して暗号化します。

## コスト管理{#cost-management}

Zilliz BYOC は、リソース管理を通じて BYOC プロジェクトで使用するサービスに対して課金します。ただし、次の図に示すように、クラウドサービスプロバイダーからのインフラストラクチャ費用は引き続き発生します。

![TudFwgMGthlQmvbeH9qcXx0jnzn](https://zdoc-images.s3.us-west-2.amazonaws.com/TudFwgMGthlQmvbeH9qcXx0jnzn.png)

