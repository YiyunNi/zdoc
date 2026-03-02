---
title: "2025年11月 リリースノート | Cloud"
slug: /release-notes-2511
sidebar_label: "2025年11月"
beta: FALSE
notebook: FALSE
description: "2025年11月 リリースノート | Cloud"
type: origin
token: CK0ewQWC2iz6lakP0kscqogbnGh
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート
  - マルチモーダル検索
  - ベクトル検索アルゴリズム
  - 質問応答システム
  - llm-as-a-judge

---

import Admonition from '@theme/Admonition';


import Grid from '@site/src/components/Grid';

# 2025年11月リリースノート

<Grid columnSize="2" widthRatios="16,83">

    <div>

        **2025-11-06**

    </div>

    <div>

        ## Business Criticalプランの提供開始\{#business-critical-plan-availability}

        Zilliz Cloudは、最高のセキュリティ、コンプライアンス、可用性要件を持つ組織向けに設計された**Business Critical**プランの提供を開始しました。既存のHIPAAおよびSOC 2 Type IIへの対応に加え、このプランは、グローバルクラスター、自動フェイルオーバーによるマルチリージョンレプリケーション、ポイントインタイムリカバリ（PITR）などの高度な機能を提供し、グローバル規模でより強力なデータ保護、規制への適合、運用回復力を実現します。詳細については、またはこのプランがお客様の環境に適しているかどうかを評価するには、[お問い合わせください](https://zilliz.com/contact-sales)。

        ## Milvus v2.6.xの新機能\{#milvus-v26x-new-features}

        - **Geometryデータ型のサポート** — 地理空間検索、ジオフェンシング、ルーティング、マップベースのアプリケーション向けに、複雑な空間形状（POINT、LINESTRING、POLYGON）を保存およびクエリできます。詳細については、[Geometry Field](./use-geometry-field)を参照してください。

        - **Structデータ型のサポート** — ネストされた多属性レコードをより自然にモデル化し、スキーマ設計を簡素化し、メタデータが豊富なAIワークロードでのクエリを改善します。詳細については、[Array of Structs](./use-array-of-structs)を参照してください。

        - **既存のcollectionでのDynamic Fieldの有効化** — collectionを再作成することなくdynamic fieldサポートを有効にでき、ビジネス属性の進化に合わせてスキーマの柔軟性を可能にします。詳細については、[Modify Collection](./modify-collections#example-4-enable-dynamic-field)を参照してください。

        - **ロード中のScalar Indexの削除をサポート** — collectionがロード中の状態でも、scalar indexの削除と再構築を許可します。

        ## プランがプロジェクトレベルに移動\{#plan-moved-to-the-project-level}

        今回のリリースにより、サブスクリプションプランはクラスターレベルではなく**プロジェクト**レベルで管理されるようになり、特に複数のクラスターを運用する組織にとって、構成の一貫性が向上し、機能のガバナンスが簡素化されます。

        既存のワークロード、機能、請求に変更はなく、構成の更新は不要です。

        今後、**新しいプロジェクト**ではプランの選択（Standard、Enterprise、またはBusiness Critical）が必要となり、**クラスター**ではデプロイオプション（Free、Serverless、またはDedicated）を選択することになります。

        詳細については、[Detailed Plan Comparison](./select-zilliz-cloud-service-plans)を参照してください。

        ## 強化\{#enhancements}

        - **フルテキスト検索を有効にする移行サポート** - 人気のあるベクトルデータベースから移行する際に、Milvusが提供するフルテキスト検索機能を最大限に活用するためにBM25機能を有効にできるようになりました。詳細については、[MilvusからZilliz Cloudへのエンドポイント経由の移行](./via-endpoint#getting-started)および[外部移行の基本](./external-migration-basics#configure-full-text-search-for-text-data)を参照してください。

        - **アラートサポート間隔設定** - 進行中のアラートの通知間隔をカスタマイズして、邪魔にならずに目立つようにすることができます。新しいアラートはデフォルトで1時間間隔です。詳細については、[プロジェクトアラートの管理](./manage-project-alerts#alert-settings)を参照してください。

    </div>

</Grid>

