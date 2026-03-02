---
title: "データセキュリティ | BYOC"
slug: /data-security
sidebar_label: "データセキュリティ"
beta: FALSE
notebook: FALSE
description: "データセキュリティはZilliz Cloudにとって不可欠です。このドキュメントでは、Zilliz Cloudがお客様のデータを包括的に保護するために実装している主要な対策とポリシーを要約しています。 | BYOC"
type: origin
token: SIhBwKFJri4u2CkyD3ucnO7an3g
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - データ
  - セキュリティ
  - サーバーレスベクトルデータベース
  - milvus オープンソース
  - milvus の仕組み
  - Zilliz ベクトルデータベース

---

import Admonition from '@theme/Admonition';


# データセキュリティ

データセキュリティはZilliz Cloudにとって不可欠な要素です。このドキュメントでは、Zilliz Cloudがお客様のデータを包括的に保護するために実装している主要な対策とポリシーを要約しています。

## アカウントとプライバシー保護{#account-and-privacy-protection}

Zilliz Cloudは、登録時からユーザーデータを保護するために、以下の対策を講じています。

- 高度な暗号化アルゴリズム（SHA-256、bcrypt）を使用。

- ユーザー名とパスワードの内部保存に対する厳格なポリシーを遵守。

## BYOCにおけるVPC分離{#vpc-isolation-in-byoc}

Zillizは、BYOCソリューションにおけるデータセキュリティを確保するため、お客様のVPCと当社のVPC間の分離を実装しています。詳細については、[BYOC概要](/docs/byoc/byoc-intro)の[セキュリティ保証](/docs/byoc/byoc-intro#security-assurance)をご参照ください。

## データ分離とデータレジデンシー{#data-isolation-and-residency}

Zilliz Cloudは、お客様のクラスターに対して堅牢な分離と保護を提供します。

- **複数のデータレジデンシーオプション**: お客様は、ご希望のクラウドプロバイダーとリージョンでクラスターを作成できます。

- **専用の名前空間**: 各専用クラスターは、カスタマイズされたネットワークポリシーを持つ分離された名前空間で動作します。

- **独立したストレージ**: データは、専用のオブジェクトストレージバケットに個別に保存されます。

- **個別のVPCまたはサブネット**: **コントロールプレーン**（管理タスク）と**データプレーン**（運用処理）は、分離された個別のVPCまたはサブネットに配置されます。

## 認証{#authentication}

Zilliz Cloudは、安全なユーザー認証のためにOAuth0を利用しています。

- シングルサインオン（SSO）をサポート。

- 多要素認証（MFA）をサポート。

- APIキーとクラスター認証情報によるクラスターアクセスを提供。

詳細については、[認証](./authentication)をご参照ください。

## アクセス制御{#access-control}

きめ細かくロールベースのアクセス制御：

- 階層的な権限（組織、プロジェクト、クラスター）。

- 権限割り当てを簡素化するための事前定義されたロール。

- コンソールでの直感的な操作と、アプリケーションからのプログラムによるアクセスの両方が利用可能。

詳細については、[アクセス制御](./access-control)をご参照ください。

## 安全なネットワークアクセス{#secure-network-access}

Zilliz Cloudは、以下の方法でネットワークインタラクションを保護します。

- **IP許可リスト**: 許可されたIP範囲（CIDRブロック）を定義してアクセスを制限します。

- **プライベートリンク**: お客様のVPCとZilliz Cloudコントロールプレーン間の安全なプライベート接続を確立します。

## データ暗号化{#data-encryption}

### 転送中{#in-transit}

- TLS 1.2+を使用したHTTPS/gRPC。

- AES-256暗号化により、安全なデータ転送を保証します。

### 保存時{#at-rest}

- ディスク/オブジェクトストレージに保存されたデータは、AES-256（256ビットAdvanced Encryption Standard）暗号化アルゴリズムを使用して暗号化されます。

## 監査ログと監視{#audit-logging-and-monitoring}

監査ログを通じて可視性と説明責任を維持します。

- コントロールプレーンとデータプレーンの両方でアクティビティを記録します。

- ログをストレージソリューションに直接ストリーミングします。

- ログ分析のためにサードパーティツールを活用します。

詳細については、[監査](./auditing)をご参照ください。

## データ整合性とバックアップ{#data-integrity-and-backup}

データの可用性と回復を保証します。

- 自動および手動バックアップオプション。

- データ復元のためのごみ箱機能（定義された保持期間あり）。

詳細については、[バックアップと復元](./backup-and-restore)および[ごみ箱の使用](./use-recycle-bin)をご参照ください。

## 証明書とTLS{#certificates-and-tls}

Zilliz Cloudは安全な接続を保証します。

- SSL証明書にはLet's EncryptとAWS Certificate Managerを使用します。

- 有効期限の30日前に証明書を自動更新します（有効期間：90日）。

- TLS 1.2以降のみをサポートします。

<Admonition type="info" icon="📘" title="Notes">

<p>双方向TLS（mTLS）は現在利用できません。</p>

</Admonition>

## まとめ{#summary}

Zilliz Cloudは常にデータセキュリティを最優先事項としています。包括的な暗号化、厳格な認証、堅牢なアクセス制御、プライベートネットワーク、および一貫した監査慣行を通じてデータセキュリティを重視し、データの機密性、整合性、可用性を維持しています。