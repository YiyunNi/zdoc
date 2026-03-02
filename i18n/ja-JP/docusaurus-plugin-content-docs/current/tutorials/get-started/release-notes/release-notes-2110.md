---
title: "リリースノート (2024年11月6日) | Cloud"
slug: /release-notes-2110
sidebar_label: "2024年11月6日"
beta: FALSE
notebook: FALSE
description: "今回のリリースには、新しいWebコンソールユーザーインターフェース、Qdrant、Pinecone Serverless、Tencent VectorDBからのデータ移行のサポート、よりスムーズな支払いプロセス、および詳細な支払い情報を含む刷新された請求書ページが含まれています。 | Cloud"
type: origin
token: HwWfwN9SViqU0Ukcv68cufBAnBe
sidebar_position: 13
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート
  - 埋め込みモデル
  - 画像類似性検索
  - コンテキストウィンドウ
  - 自然言語検索

---

import Admonition from '@theme/Admonition';


# リリースノート (2024年11月6日)

今回のリリースには、新しいウェブコンソールユーザーインターフェース、Qdrant、Pinecone Serverless、Tencent VectorDB からのデータ移行のサポート、よりスムーズな支払いプロセス、詳細な支払い情報を含む刷新された請求書ページが含まれています。

## Milvus 互換性{#milvus-compatibility}

このリリースは **Milvus 2.4.x** と互換性があります。

## 真新しいウェブコンソールユーザーインターフェース{#a-brand-new-web-console-user-interface}

今回のリリースで、Zilliz Cloud は完全にアップグレードされたウェブコンソール UI を導入します。使い慣れたワークフローを維持しつつ、新しいインターフェースはユーザーのインタラクティブな体験と視覚的な体験の両方を大幅に向上させます。

[Zilliz Cloud](https://cloud.zilliz.com) アカウントにログインして、新しいインターフェースをぜひお試しください！

## 拡張されたソースサポートによるデータ移行の強化{#enhanced-data-migration-with-expanded-source-support}

今回のリリースで、Zilliz Cloud はデータ移行機能をアップグレードし、以下の追加データソースをサポートしました。

- Qdrant

- Pinecone Serverless

- Tencent VectorDB

これらの機能強化により、これらのベンダーから Zilliz Cloud へデータを簡単に移行し、Zilliz Cloud が提供する独自の機能と能力を活用できます。これらのソースからのデータ移行に関する詳細な手順については、[Qdrant から Zilliz Cloud へ移行する](./migrate-from-qdrant)、[Pinecone から Zilliz Cloud へ移行する](./migrate-from-pinecone)、および [Tencent Cloud から Zilliz Cloud へ移行する](./migrate-from-tencent-cloud) を参照してください。

## 支払いプロセスの改善と請求書ページのデザイン変更{#improved-payment-process-and-redesigned-invoice-page}

今回のリリースで、Zilliz Cloud は支払いプロセスを合理化し、請求書ページを刷新しました。これにより、コスト管理の明確さと利便性が向上しました。主な更新内容は以下の通りです。

- 支払期日が来た際のタイムリーな通知

- 拡張された請求サイクルをサポートし、支払い条件を企業の財務ワークフローに合わせることで、中断のないサービスを保証

- コストの内訳とダウンロードオプションを備えた明細化された請求書

これらの更新の詳細については、[請求書](./view-invoice) を参照してください。

### 強化点{#enhancements}

- replica の設定プロセスを最適化しました。この新しいバージョンでは、ユーザーは事前にすべての collection を release する必要なく、replica の数を直接調整できるようになりました。

