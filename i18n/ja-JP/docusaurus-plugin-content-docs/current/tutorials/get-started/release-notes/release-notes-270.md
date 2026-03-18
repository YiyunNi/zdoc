---
title: "リリースノート (2024年4月3日) | Cloud"
slug: /release-notes-270
sidebar_label: "2024年4月3日"
beta: FALSE
notebook: FALSE
description: "今回のアップデートでは、Zilliz Cloudに強力なツールと機能強化が導入されました。オブジェクトストレージなどのソースから簡単にデータを取り込むための新しいコネクタ、検索関連性を向上させるためのReranker、詳細なシステム状態分析のためのMetrics Monitoring API、AWS S3、Google Cloud Storage、Azure Blob Storageからベクトルデータベースインスタンスへの直接インポートを可能にするCross Cloud Data Import機能が含まれます。これらの機能は、データインジェスト、検索精度、運用上の洞察を向上させ、クラウドでのベクトルデータベースの管理を効率化します。 | Cloud"
type: origin
token: S7PMwgqGOiURCpkTFT4cTnTjnAc
sidebar_position: 20
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート

---

import Admonition from '@theme/Admonition';


# リリースノート (2024年4月3日)

今回のアップデートでは、Zilliz Cloud に強力なツールと機能強化が導入されました。オブジェクトストレージなどのソースから簡単にデータを取り込むための新しいコネクタ、検索関連性を向上させるリランカー、詳細なシステム状態分析のためのメトリクス監視 API、AWS S3、Google Cloud Storage、Azure Blob Storage からベクトルデータベースインスタンスへの直接インポートを可能にするクロスクラウドデータインポート機能などです。これらの機能は、データインジェスト、検索精度、運用インサイトを向上させ、クラウドでのベクトルデータベースの管理を効率化します。

### Milvus 互換性\{#milvus-compatibility}

このリリースは **Milvus 2.3.x** と互換性があります。

### Azure Marketplace\{#azure-marketplace}

Zilliz Cloud が Azure Marketplace で利用可能になり、ユーザーは Azure 上で当社の高度なフルマネージドベクトルデータベースサービスにこれまで以上に簡単にアクセスできるようになりました。この新しい統合は、スケーラブルな AI アプリケーションの必要性が高まり続ける重要な時期に登場しました。Zilliz Cloud が Azure Marketplace で利用可能になったことで、ユーザーは AI アプリケーションを迅速かつ簡単に構築・拡張できるようになりました。Azure 上の Zilliz Cloud のパワーを活用して、AI プロジェクトを今すぐ加速させましょう。[Azure Marketplace の Zilliz Cloud](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/zillizinc1703056661329.zilliz_cloud?tab=PlansAndPrice) をご覧ください。

### コネクタ\{#connectors}

コネクタは、オブジェクトストレージ、Kafka (近日対応予定)、その他を含む複数のデータソースから Zilliz Cloud にストリーミングデータを取り込むために設計された組み込みツールです。例えば、オブジェクトストレージコネクタは、指定されたオブジェクトストレージバケットを監視し、PDF や HTML などのファイルを Zilliz Cloud インジェストパイプラインに自動的に同期させることができます。このプロセスにより、これらのファイルはベクトル表現に変換され、検索機能を強化するために当社のベクトルデータベースに効率的にロードされます。

### リランカー\{#rerankers}

リランカーが検索パイプラインに統合され、検索結果を関連性によって洗練させ、検索品質を向上させたいユーザー向けにオプションの機能強化が提供されるようになりました。このリリースでは、以下のリランカーオプションを導入します。

- zilliz/bge-reranker-base

### メトリクス監視用 API\{#api-for-metrics-monitoring}

このリリースから、Zilliz Cloud はメトリクス監視専用の API を提供します。この新しく導入された API は、30 以上のメトリクスを含む包括的なスイートへのアクセスを許可し、システムのパフォーマンスと効率にとって重要なさまざまな側面を全体的に把握できます。

主なメトリクスは以下の通りです。

- リソース使用率の追跡: コンピュートユニット (CU) のリソース使用率に関する深い洞察を得て、コンピュート使用率とストレージ容量を追跡できます。

- 検索およびデータ挿入パフォーマンスメトリクス: 検索クエリとデータ挿入プロセスのパフォーマンスを評価し、特にレイテンシとスループットに焦点を当てます。

- リクエスト失敗率: リクエストの失敗率を監視して、潜在的な問題を迅速に特定しトラブルシューティングを行い、信頼性の高いアプリケーションパフォーマンスを確保します。

- コレクションおよびエンティティ統計: コレクションおよびエンティティに関する詳細な統計にアクセスし、データ管理を改善します。

[API の詳細はこちら](/reference/restful/query-metrics)をご覧ください。

### クロスクラウドデータインポートと移行の強化\{#cross-cloud-data-import-and-migration-enhancement}

Zilliz Cloud ユーザーは、AWS S3、Google Cloud Storage、Azure Blob Storage から、Zilliz Cloud 上の任意のベクトルデータベースインスタンスに、その場所に関係なく、データを簡単にインポートまたは移行できるようになりました。

詳細については、Zilliz Cloud ドキュメントの[データインポート](./data-import)と[移行](./migrations)を参照してください。