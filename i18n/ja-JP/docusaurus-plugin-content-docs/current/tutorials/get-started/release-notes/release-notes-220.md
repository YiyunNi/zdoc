---
title: "リリースノート (2023年9月13日) | Cloud"
slug: /release-notes-220
sidebar_label: "2023年9月13日"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、Zilliz Cloudクラスター間およびElasticSearchからのデータ移行、新しいチケットシステムの稼働、強化されたデータインポート機能など、ユーザーエクスペリエンスを向上させるために設計された一連の新機能を誇るリリースを発表できることを嬉しく思います。 | Cloud"
type: origin
token: GqyhwKVspiYRwDk8OaucNfgJnhd
sidebar_position: 25
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート
  - ベクトル検索
  - 音声類似性検索
  - Elastic ベクトルデータベース
  - Pinecone vs Milvus

---

import Admonition from '@theme/Admonition';


# リリースノート (2023年9月13日)

Zilliz Cloudのリリースを発表できることを嬉しく思います。Zilliz Cloudクラスター間およびElasticSearchからのデータ移行、新しいチケットシステムの稼働、データインポート機能の強化など、ユーザーエクスペリエンスを向上させるために設計された一連の新機能が搭載されています。

## Milvus互換性{#milvus-compatibility}

このリリースは **Milvus 2.2.x** と互換性があります。

## 概要{#overview}

このリリースでは、新しく立ち上げられたチケットシステムが導入され、迅速かつ効率的なサポートが保証されます。さらに、更新されたデータインポートおよび移行ツールにより、Zilliz Cloudクラスター間のシームレスな移行が可能になり、複数のファイルを一度にインポートするためのサポートが改善されました。これらのツールを探索し、その利点を直接体験していただくことをお勧めします。

## Zilliz Cloudクラスター間のデータ移行{#data-migration-across-zilliz-cloud-clusters}

このリリースでは、ユーザーはZilliz Cloud内でデータを簡単に移行できる合理化された機能を利用でき、効率的なデータ統合、構成、およびバランスを確保できます。

- 簡単な移行: 複数のZilliz Cloudクラスター間でデータをシームレスに移行します。

- セキュリティの強化: 移行中のデータセキュリティを強化し、データの整合性と機密性を保護します。

- リアルタイム監視: ユーザーが移行の進行状況を監視し、ステータス更新を即座に受け取るための直感的なUI。

詳細は[クラスター間の移行](./offline-migration)をご覧ください。

## ElasticSearchからZilliz Cloudへの簡単な移行{#easy-migration-from-elasticsearch-to-zilliz-cloud}

ElasticSearchからZilliz Cloudへの移行がこれまでになく簡単になりました。包括的なドキュメントと組み込みツールで補完されたパスを作成し、スムーズな切り替えと移行後の一貫したデータを保証します。詳細は[Elasticsearchからの移行](./migrate-from-elasticsearch)をご覧ください。

## 新しいチケットシステムの稼働{#new-ticket-system-go-live}

当社の新しいチケットシステムは、Zilliz Cloudユーザーに当社のチームへの直接チャネルを提供します。フィードバックの送信、問題の報告、専門家によるサポートのいずれの場合でも、効率性と明確性を考慮してシステムを設計しました。[今すぐチケットシステムを探索し、合理化されたサポートを体験してください。](https://support.zilliz.com/hc/en-us/)

## データインポート機能の強化{#enhanced-data-import-capabilities}

Zilliz Cloudへのデータのインポート方法を革新しました。

- フォルダーインポート: 以前の単一ファイルモードの制約から解放されます。ファイル全体のフォルダーを使用してデータをインポートできるようになり、大量のデータ取り込みが合理化されます。

- インポートタスク監視: Zilliz Cloud Webコンソールを介してデータインポートタスクをリアルタイムで監視し、データアップロードの透明性と制御を確保します。

詳細は[データインポートの準備](./prepare-data-import)をご覧ください。