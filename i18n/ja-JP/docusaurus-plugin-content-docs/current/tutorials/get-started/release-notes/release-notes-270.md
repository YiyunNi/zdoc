---
title: "リリースノート (2024年4月3日) | Cloud"
slug: /release-notes-270
sidebar_label: "2024年4月3日"
beta: FALSE
notebook: FALSE
description: "今回のアップデートでは、Zilliz Cloud に強力なツールと機能強化が導入されました。オブジェクトストレージなどのソースから簡単にデータを取り込むための新しいコネクタ、検索関連性を向上させるためのリランカー、詳細なシステム状態分析のためのメトリクス監視API、そしてAWS S3、Google Cloud Storage、Azure Blob Storageからベクトルデータベースインスタンスに直接インポートできるクロスクラウドデータインポート機能が含まれます。これらの機能は、データ取り込み、検索精度、運用洞察を向上させ、クラウドでのベクトルデータベースの管理を効率化します。"
type: origin
token: S7PMwgqGOiURCpkTFT4cTnTjnAc
sidebar_position: 19
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート
  - ベクトル検索
  - knnアルゴリズム
  - HNSW
  - 非構造化データとは

---

import Admonition from '@theme/Admonition';


# リリースノート (2024年4月3日)

今回のアップデートでは、Zilliz Cloudに強力なツールと機能強化が導入されました。Object Storageなどのソースから簡単にデータを取り込むための新しいコネクタ、検索関連性を向上させるReranker、詳細なシステム状態分析のためのMetrics Monitoring API、そしてAWS S3、Google Cloud Storage、Azure Blob Storageからベクトルデータベースインスタンスに直接インポートできるCross Cloud Data Import機能です。これらの機能は、データ取り込み、検索精度、運用上の洞察力を高め、クラウドでのベクトルデータベースの管理を効率化します。

### Milvus互換性{#milvus-compatibility}

このリリースは **Milvus 2.3.x** と互換性があります。

### Azure Marketplace{#azure-marketplace}

Zilliz CloudがAzure Marketplaceで利用可能になり、ユーザーはAzure上で当社の高度なフルマネージドベクトルデータベースサービスにこれまで以上に簡単にアクセスできるようになりました。この新しい統合は、スケーラブルなAIアプリケーションの必要性が高まり続ける重要な時期に登場しました。Zilliz CloudがAzure Marketplaceで利用可能になったことで、ユーザーはAIアプリケーションを迅速に構築・拡張できるようになります。Azure上のZilliz Cloudの力を活用して、AIプロジェクトを今すぐ加速させましょう。[Azure MarketplaceのZilliz Cloud](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/zillizinc1703056661329.zilliz_cloud?tab=PlansAndPrice)をご覧ください。

### コネクタ{#connectors}

コネクタは、Object Storage、Kafka（近日対応予定）、その他複数のデータソースからZilliz Cloudにデータをストリーミングするために設計された組み込みツールです。例えば、Object Storageコネクタは、特定のオブジェクトストレージバケットを監視し、PDFやHTMLなどのファイルをZilliz Cloud Ingestion Pipelinesに自動的に同期する機能を備えています。このプロセスにより、これらのファイルはベクトル表現に変換され、検索機能を強化するために当社のベクトルデータベースに効率的にロードできるようになります。

### Reranker{#rerankers}

RerankerがSearch Pipelineに統合され、検索結果の関連性を洗練し、検索品質を向上させたいユーザー向けにオプションの機能強化が提供されるようになりました。このリリースでは、以下のRerankerオプションを導入します。

- zilliz/bge-reranker-base

### メトリクス監視用API{#api-for-metrics-monitoring}

このリリースから、Zilliz Cloudはメトリクス監視専用のAPIを提供します。この新しく導入されたAPIは、30以上のメトリクスを含む包括的なスイートへのアクセスを許可し、システムのパフォーマンスと効率にとって重要なさまざまな側面を全体的に把握できます。

主なメトリクスは以下の通りです。

- リソース使用率の追跡：Compute Unit (CU) リソースの使用率に関する深い洞察を得て、コンピューティング使用率とストレージ容量を追跡できます。

- 検索およびデータ挿入パフォーマンスメトリクス：検索クエリとデータ挿入プロセスのパフォーマンスを評価し、特にレイテンシとスループットに焦点を当てます。

- リクエスト失敗率：リクエストの失敗率を監視して、潜在的な問題を迅速に特定しトラブルシューティングを行い、信頼性の高いアプリケーションパフォーマンスを確保します。

- collectionおよびentity統計：collectionおよびentityに関する詳細な統計にアクセスし、データ管理を改善します。

[APIの詳細はこちら](/reference/restful/query-metrics)。

### クロスクラウドデータインポートと移行の強化{#cross-cloud-data-import-and-migration-enhancement}

Zilliz Cloudユーザーは、AWS S3、Google Cloud Storage、Azure Blob Storageから、Zilliz Cloud上の任意のベクトルデータベースインスタンスに、その場所に関係なく、データを簡単にインポートまたは移行できるようになりました。

詳細については、Zilliz Cloudドキュメントの[データインポート](./data-import)と[移行](./migrations)を参照してください。