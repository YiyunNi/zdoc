---
title: "リリースノート (2023年9月13日) | Cloud"
slug: /release-notes-220
sidebar_label: "2023年9月13日"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudのリリースを発表できることを嬉しく思います。このリリースでは、Zilliz Cloudクラスター間およびElasticSearchからのデータ移行、新しいチケットシステムの稼働開始、データインポート機能の強化など、ユーザーエクスペリエンスを向上させるために設計された一連の新機能が搭載されています。 | Cloud"
type: origin
token: GqyhwKVspiYRwDk8OaucNfgJnhd
sidebar_position: 26
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - リリースノート

---

import Admonition from '@theme/Admonition';


# リリースノート (2023年9月13日)

Zilliz Cloud のリリースを発表できることを嬉しく思います。Zilliz Cloud クラスター間および ElasticSearch からのデータ移行、新しいチケットシステムの稼働、データインポート機能の強化など、ユーザーエクスペリエンスを向上させるための一連の新機能を誇っています。

## Milvus 互換性\{#milvus-compatibility}

このリリースは **Milvus 2.2.x** と互換性があります。

## 概要\{#overview}

このリリースでは、迅速かつ効率的なサポートを保証する新しいチケットシステムを導入しました。さらに、更新されたデータインポートおよび移行ツールにより、Zilliz Cloud クラスター間のシームレスな移行が可能になり、複数のファイルを一度にインポートするためのサポートが改善されました。これらのツールを探索し、その利点を直接体験してください。

## Zilliz Cloud クラスター間のデータ移行\{#data-migration-across-zilliz-cloud-clusters}

このリリースでは、ユーザーは Zilliz Cloud 内でデータを簡単に移行できる合理化された機能を利用でき、効率的なデータ統合、構成、およびバランス調整を保証します。

- 簡単な移行: 複数の Zilliz Cloud クラスター間でデータをシームレスに移行します。

- 強化されたセキュリティ: 移行中のデータセキュリティを強化し、データの整合性と機密性を保護します。

- リアルタイム監視: ユーザーが移行の進行状況を監視し、ステータス更新を即座に受け取るための直感的な UI。

詳細は [クラスター間の移行](./offline-migration) を参照してください。

## ElasticSearch から Zilliz Cloud への簡単な移行\{#easy-migration-from-elasticsearch-to-zilliz-cloud}

ElasticSearch から Zilliz Cloud への移行がこれまでになく簡単になりました。包括的なドキュメントと組み込みツールで補完されたパスを作成し、スムーズな切り替えと移行後の一貫したデータを体験できるようにしました。詳細は [Elasticsearch からの移行](./migrate-from-elasticsearch) を参照してください。

## 新しいチケットシステムの稼働\{#new-ticket-system-go-live}

当社の新しいチケットシステムは、Zilliz Cloud ユーザーに当社のチームへの直接チャネルを提供します。フィードバックの送信、問題の報告、専門家によるサポートのいずれの場合でも、効率性と明確性を考慮してシステムを設計しました。[今すぐチケットシステムを探索し、合理化されたサポートを体験してください。](https://support.zilliz.com/hc/en-us/)

## 強化されたデータインポート機能\{#enhanced-data-import-capabilities}

Zilliz Cloud へのデータインポート方法を革新しました。

- フォルダーインポート: 以前の単一ファイルモードの制約から解放されます。ファイル全体のフォルダーを使用してデータをインポートできるようになり、大量のデータ取り込みが合理化されます。

- インポートタスク監視: Zilliz Cloud Web コンソールを介してデータインポートタスクをリアルタイムで監視し、データアップロードの透明性と制御を確保します。

詳細は [データインポートの準備](./prepare-data-import) を参照してください。