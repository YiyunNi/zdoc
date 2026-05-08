---
title: "カスタマー管理型暗号化キー | Cloud"
slug: /cmek
sidebar_key: cmek
sidebar_label: "CMEK"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、デフォルトで 256 ビットの Advanced Encryption Standard（AES-256）アルゴリズムを使用して、ディスクおよびオブジェクトストレージ上のデータを保存時に暗号化します。最高レベルのセキュリティ要件を持つお客様のために、Zilliz Cloud は、お客様のクラウドプロバイダーの Key Management Service（KMS）と Zilliz Cloud の Customer-Managed Encryption Key（CMEK）機能を組み合わせることで、さらなるセキュリティ層を追加します。 | Cloud"
type: origin
token: GLxhwO5vWiWkTBkoNCPcg4ahnbe
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - cmek
  - カスタマー管理型キー

---

import Admonition from '@theme/Admonition';


# カスタマーマネージド暗号化キー

Zilliz Cloud は、デフォルトで 256 ビット Advanced Encryption Standard (AES-256) アルゴリズムを使用して、ディスク/オブジェクトストレージ上のデータを保存時に暗号化します。最高レベルのセキュリティ要件を持つお客様のために、Zilliz Cloud は、お客様のクラウドプロバイダーの キー Management Service (KMS) と Zilliz Cloud の Customer-Managed Encryption キー (CMEK) 機能を組み合わせることで、追加のセキュリティレイヤーを提供します。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>ビジネスクリティカル</strong> プロジェクトの <strong>Dedicated</strong> クラスターでのみ利用可能です。</p>

</Admonition>

## 暗号化の仕組み\{#how-encryption-works}

Zilliz Cloud では、カスタマーマネージド暗号化キーは、お客様のクラウドプロバイダーの KMS で作成された暗号化キーであり、クラスター内のデータを保護するために使用されます。KMS キーを Zilliz Cloud のビジネスクリティカル プロジェクトに追加した後、ディスク、オブジェクトストレージ、およびメッセージキューに保存されるデータの暗号化に使用できます。

![Ehcyw7EZphWQO0bTJMDchzTYnIf](https://zdoc-images.s3.us-west-2.amazonaws.com/Ehcyw7EZphWQO0bTJMDchzTYnIf.png)

上記の図に示すように、Zilliz Cloud は暗号化キーを階層的に管理し、ユーザーが提供した KMS キーを **ルートキー** として使用します。

クラスター内では、各データベースは **Encryption Zone (EZ)** に関連付けられており、Zilliz Cloud は各ゾーンに対して暗号化キーを作成します。これを **Encryption Zone キー (EZK)** と呼びます。EZK を保護するために、Zilliz Cloud はルートキーを使用して EZK を暗号化し、暗号化された EZK を保存します。

各データベースファイルに対して、Zilliz Cloud は **データ Encryption キー (DEK)** を生成し、それを使用してファイルを暗号化します。DEK を保護するために、Zilliz Cloud は EZK を使用して DEK を暗号化し、暗号化された DEK と暗号化されたファイルの両方を保存します。

ファイルにアクセスする際、Zilliz Cloud は暗号化された EZK を KMS に送信して復号し、復号された EZK を使用して暗号化された DEK を復号し、復号された DEK を使用してファイルを復号します。

## 暗号化の範囲\{#encryption-scope}

以下の場所に保存されるすべてのデータ関連ファイルが暗号化されます。

- オブジェクトストレージ（binlog およびインデックスファイルを含む）

- ローカルディスク

- メッセージキュー内の挿入/削除メッセージ

## 制限\{#limitations}

- カスタマーマネージド暗号化キーはプロジェクトレベルで管理されます。

- 各プロジェクトに追加できる一意のキーは最大 20 個までです。重複するキーを追加すると失敗します。

- クラスターが暗号化されると、データベース間でのコレクションの移行は禁止されます。

- KMS キーのクラウドプロバイダーおよびリージョンが、そのキーを使用する Zilliz Cloud クラスターのものと一致していることを常に確認してください。

- Milvus v2.5.x 互換の既存クラスターで CMEK を有効にするには、データをバックアップし、Milvus v2.6.x 互換の新しいクラスターに復元してください。クラスターのアップグレードでは、アップグレード前のデータは暗号化されません。

<Admonition type="info" icon="📘" title="Notes">

<p>現在、CMEK は AWS リージョンでのみ利用可能です。その他のリージョンについては、<a href="https://support.zilliz.com/hc/en-us">お問い合わせ</a>ください。</p>

</Admonition>

## サポートされる KMS プロバイダー\{#supported-kms-providers}

以下の key management service (KMS) プロバイダーが利用可能です。



import DocCardList from '@theme/DocCardList';

<DocCardList />