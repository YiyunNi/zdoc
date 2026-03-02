---
title: "リリースノート (2024年3月13日) | Cloud"
slug: /release-notes-260
sidebar_label: "2024年3月13日"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、最新リリースで2つの主要な機能強化を導入しました。まず、Pipelinesが6つの最先端（SOTA）埋め込みモデルをサポートするようになり、データ処理能力が拡張されました。もう1つの主要な機能強化は、Collection Playground機能が追加され、オンボーディング体験が簡素化されたことです。この機能により、Zilliz Cloudコンソールから直接、基本的な作成、実行、更新、削除（CRUD）操作を簡単に実行でき、データインタラクションプロセスがより効率的になります。これらの新機能を今すぐお試しいただき、より効率的で効果的なワークフローをお楽しみください。 | Cloud"
type: origin
token: NmolwVTkCiQ2yZkXsJhcftyTnhc
sidebar_position: 20
keywords: 
  - zilliz
  - ベクターデータベース
  - cloud
  - リリースノート
  - ANNS
  - ベクター検索
  - knnアルゴリズム
  - HNSW

---

import Admonition from '@theme/Admonition';


# リリースノート (2024年3月13日)

Zilliz Cloudは、最新のリリースで2つの主要な機能強化を導入しました。まず、Pipelinesが6つの最先端（SOTA）埋め込みモデルをサポートするようになり、データ処理能力が拡張されました。もう1つの主要な機能強化は、Collection Playground機能が追加され、オンボーディング体験が簡素化されたことです。この機能により、Zilliz Cloudコンソールから直接基本的な作成、実行、更新、削除（CRUD）操作を簡単に実行でき、データインタラクションプロセスがより効率的になります。これらの新機能を今すぐお試しいただき、より効率的で効果的なワークフローをお楽しみください。

## Milvus互換性{#milvus-compatibility}

このリリースは **Milvus 2.3.x** と互換性があります。

## その他の埋め込みモデル{#more-embedding-models}

Zilliz Cloud Pipelineは、データ処理能力を広げるために、6つのSOTA埋め込みモデルをサポートするようになりました。

- **openai/text-embedding-3-small**

    OpenAIがホスト。この非常に効率的な埋め込みモデルは、前身のtext-embedding-ada-002よりも強力なパフォーマンスを持ち、推論コストと品質のバランスが取れています。

- **openai/text-embedding-3-large**

    OpenAIがホスト。これはOpenAIの最高のパフォーマンスを持つモデルです。**text-embedding-ada-002**と比較して、MTEBスコアは61.0%から64.6%に向上しました。

- **voyageai/voyage-2**

    Voyage AIがホスト。この汎用モデルは、記述テキストとコードを含む技術文書の検索に優れています。より効率的なバージョンであるvoyage-lite-02-instructは、MTEBリーダーボードでトップにランクされています。

- **voyageai/voyage-code-2**

    Voyage AIがホスト。このモデルはプログラミングコードに最適化されており、コードブロックの検索に優れた品質を提供します。

- **voyageai/voyage-large-2**

    Voyage AIがホスト。これはVoyage AIの最も強力な汎用埋め込みモデルです。16kのコンテキスト長（voyage-2の4倍）をサポートし、技術文書や長文コンテキスト文書を含む様々な種類のテキストに優れています。このモデルは、言語がENGLISHの場合にのみ利用可能です。

- **zilliz/bge-base-en-v1.5**

    BAAIによってリリースされたこのSOTAオープンソースモデルは、Zilliz Cloudでホストされ、ベクトルデータベースと併置されており、優れた品質と最高のネットワークレイテンシを提供します。これはデフォルトの埋め込みモデルです。

## Collection Playground{#collection-playground}

このリリースでは、Zilliz Cloudはオンボーディング体験を効率化するために設計されたCollection PlaygroundをZilliz Cloudに導入しました。Playgroundを使用すると、ユーザーはZilliz Cloudコンソールから直接、挿入、アップサート、検索、クエリ、取得、削除操作を含む基本的なCRUD操作をシームレスに実行できます。この新機能にアクセスするには、Zilliz Cloudコンソールのコレクション内のPlaygroundタブに移動してください。この機能強化を探索し、コレクションとの簡素化されたインタラクションをお楽しみください！