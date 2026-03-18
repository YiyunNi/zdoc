---
title: "リリースノート (2024年11月6日) | Cloud"
slug: /release-notes-2110
sidebar_label: "2024年11月6日"
beta: FALSE
notebook: FALSE
description: "今回のリリースには、新しいWebコンソールユーザーインターフェース、Qdrant、Pinecone Serverless、Tencent VectorDBからのデータ移行のサポート、よりスムーズな支払いプロセス、詳細な支払い情報を含む刷新された請求書ページが含まれています。 | Cloud"
type: origin
token: HwWfwN9SViqU0Ukcv68cufBAnBe
sidebar_position: 14
keywords: 
  - Zilliz
  - ベクトルデータベース
  - cloud
  - リリースノート

---

import Admonition from '@theme/Admonition';


# リリースノート (2024年11月6日)

今回のリリースには、新しいWebコンソールユーザーインターフェース、Qdrant、Pinecone Serverless、Tencent VectorDBからのデータ移行のサポート、よりスムーズな支払いプロセス、詳細な支払い情報を含む刷新された請求書ページが含まれています。

## Milvus互換性\{#milvus-compatibility}

このリリースは**Milvus 2.4.x**と互換性があります。

## 真新しいWebコンソールユーザーインターフェース\{#a-brand-new-web-console-user-interface}

今回のリリースで、Zilliz Cloudは完全にアップグレードされたWebコンソールUIを導入します。使い慣れたワークフローを維持しつつ、新しいインターフェースはユーザーのインタラクティブな体験と視覚的な体験の両方を大幅に向上させます。

[Zilliz Cloud](https://cloud.zilliz.com)アカウントにログインして、新しいインターフェースをぜひお試しください！

## 拡張されたソースサポートによるデータ移行の強化\{#enhanced-data-migration-with-expanded-source-support}

今回のリリースで、Zilliz Cloudはデータ移行機能をアップグレードし、以下の追加データソースをサポートしました。

- Qdrant

- Pinecone Serverless

- Tencent VectorDB

これらの機能強化により、これらのベンダーからZilliz Cloudへデータを簡単に移行し、Zilliz Cloudが提供する独自の機能と能力を活用できます。これらのソースからのデータ移行に関する詳細な手順については、[QdrantからZilliz Cloudへの移行](./migrate-from-qdrant)、[PineconeからZilliz Cloudへの移行](./migrate-from-pinecone)、および[Tencent CloudからZilliz Cloudへの移行](./migrate-from-tencent-cloud)をお読みください。

## 支払いプロセスの改善と請求書ページのデザイン変更\{#improved-payment-process-and-redesigned-invoice-page}

今回のリリースで、Zilliz Cloudは支払いプロセスを合理化し、請求書ページを刷新しました。これにより、コスト管理の明確さと利便性が向上しました。主な更新は以下の通りです。

- 支払期日が来た際のタイムリーな通知

- 拡張された請求サイクルのサポート。エンタープライズの財務ワークフローに支払い条件を合わせ、中断のないサービスを保証します。

- コストの可視化とダウンロードオプションを備えた明細化された請求書

これらの更新の詳細については、[請求書](./view-invoice)をお読みください。

### 強化点\{#enhancements}

- レプリカ設定プロセスを最適化しました。この新バージョンでは、ユーザーは事前にすべてのコレクションを解放することなく、レプリカ数を直接調整できるようになりました。

