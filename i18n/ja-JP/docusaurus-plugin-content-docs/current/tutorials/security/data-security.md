---
title: "データセキュリティ | Cloud"
slug: /data-security
sidebar_key: data-security
sidebar_label: "データセキュリティ"
beta: FALSE
notebook: FALSE
description: "データセキュリティは Zilliz Cloud において不可欠な要素です。本ドキュメントでは、Zilliz Cloud がお客様のデータを包括的に保護するために実施している主要な対策とポリシーについてまとめています。"
type: origin
token: SIhBwKFJri4u2CkyD3ucnO7an3g
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - データ
  - セキュリティ

---

import Admonition from '@theme/Admonition';


# データセキュリティ

データセキュリティは Zilliz Cloud に不可欠な要素です。このドキュメントでは、Zilliz Cloud がお客様のデータを包括的に保護するために実施している主な対策とポリシーについて概要を説明します。

## アカウントとプライバシーの保護\{#account-and-privacy-protection}

Zilliz Cloud は、登録時からユーザーデータを以下の方法で保護します。

- 高度な暗号化アルゴリズム（SHA-256、bcrypt）の使用。

- ユーザー名とパスワードの内部保存に対する厳格なポリシーの遵守。

## データの分離とレジデンシー\{#data-isolation-and-residency}

Zilliz Cloud は、クラスターに対して堅牢な分離と保護を提供します。

- **複数のデータレジデンシーオプション**: お好みのクラウドプロバイダーとリージョンにクラスターを作成できます。詳細については、[クラウドプロバイダーとリージョン](./cloud-providers-and-regions) を参照してください。

- **専用ネームスペース:** 各専用クラスターは、カスタマイズされたネットワークポリシーで分離されたネームスペースで動作します。

- **分離されたストレージ:** データは専用のオブジェクトストレージバケットに分離して保存されます。

- **個別の VPC またはサブネット:** **コントロールプレーン**（管理タスク）と**データプレーン**（運用処理）は、分離された個別の VPC またはサブネットに配置されます。

## 認証\{#authentication}

Zilliz Cloud は、安全なユーザー認証のために OAuth0 を利用します。

- シングルサインオン（SSO）をサポート。

- 多要素認証（MFA）をサポート。

- API キーとクラスター認証情報によるクラスターアクセスを提供。

詳細については、[認証](./authentication) を参照してください。

## アクセス制御\{#access-control}

きめ細かくロールベースのアクセス制御：

- 階層型の権限（組織、プロジェクト、クラスター）。

- 権限割り当てを簡素化するための事前定義済みロール。

- コンソールでの直感的な操作と、アプリケーションからのプログラマティックなアクセスの両方が利用可能。

詳細については、[アクセス制御](./access-control) を参照してください。

## 安全なネットワークアクセス\{#secure-network-access}

Zilliz Cloud は、以下の方法でネットワークのやり取りを保護します。

- **コンソール IP 許可リスト:** 許可された IP 範囲（CIDR ブロック）によるコンソールアクセスの制限。

- **クラスター IP 許可リスト**: IP 範囲によるクラスターデータプレーンネットワークアクセスの制限。

- **プライベートリンク:** お客様の VPC と Zilliz Cloud コントロールプレーン間の安全なプライベート接続の確立。

詳細については、[許可リストの設定](./setup-whitelist) と [プライベートエンドポイントの設定](./setup-a-private-link) を参照してください。

## データ暗号化\{#data-encryption}

### 転送中\{#in-transit}

- TLS 1.2+ を使用した HTTPS/gRPC。

- AES-256 暗号化により、安全なデータ転送を確保。

### 保存時\{#at-rest}

- ディスク/オブジェクトストレージに保存されたデータは、AES-256（256 ビット Advanced Encryption Standard）暗号化アルゴリズムを使用して暗号化されます。

## 監査ログとモニタリング\{#audit-logging-and-monitoring}

監査ログを通じて可視性と説明責任を維持：

- コントロールプレーンとデータプレーンの両方でアクティビティを記録。

- ログをストレージソリューションに直接ストリーミング。

- ログ分析のためにサードパーティツールを活用。

詳細については、[監査](./auditing) を参照してください。

## データの整合性とバックアップ\{#data-integrity-and-backup}

データの可用性と復旧を確保：

- 自動および手動のバックアップオプション。

- データ復元のためのごみ箱機能（定義された保持期間あり）。

詳細については、[バックアップと復元](./backup-and-restore) と [ごみ箱の使用](./use-recycle-bin) を参照してください。

## 証明書と TLS\{#certificates-and-tls}

Zilliz Cloud は、安全な接続を確保します。

- SSL 証明書に Let's Encrypt と AWS Certificate Manager を使用。

- 証明書の有効期限（90 日）の 30 日前に自動更新。

- TLS 1.2 以上のみをサポート。

<Admonition type="info" icon="📘" title="Notes">

双方向 TLS（mTLS）は現在利用できません。

</Admonition>

## 概要\{#summary}

Zilliz Cloud は常にデータセキュリティを最優先事項としています。包括的な暗号化、厳格な認証、堅牢なアクセス制御、プライベートネットワーク、そして一貫した監査の実践を通じて、データの機密性、整合性、可用性を維持し、データセキュリティを重視しています。