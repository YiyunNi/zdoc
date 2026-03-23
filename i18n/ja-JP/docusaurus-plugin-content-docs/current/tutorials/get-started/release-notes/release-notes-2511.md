---
title: "2025年11月 リリースノート | Cloud"
slug: /release-notes-2511
sidebar_label: "2025年11月"
beta: FALSE
notebook: FALSE
description: "2025年11月のリリースノート | Cloud"
type: origin
token: CK0ewQWC2iz6lakP0kscqogbnGh
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート

---

import Admonition from '@theme/Admonition';


import Grid from '@site/src/components/Grid';

# 2025年11月 リリースノート

<Grid columnSize="2" widthRatios="16,83">

    <div>

        **2025-11-06**

    </div>

    <div>

        ## ビジネスクリティカルプランの提供開始\{#business-critical-plan-availability}

        Zilliz Cloudは、最高のセキュリティ、コンプライアンス、可用性要件を持つ組織向けに設計された**ビジネスクリティカル**プランの提供を開始しました。既存のHIPAAおよびSOC 2 Type II対応に加え、このプランは、グローバルクラスター、自動フェイルオーバーによるマルチリージョンレプリケーション、ポイントインタイムリカバリ（PITR）などの高度な機能を提供し、グローバル規模でより強力なデータ保護、規制順守、運用回復力を実現します。詳細については、またはこのプランがお客様の環境に適しているかどうかを評価するには、[お問い合わせください](https://zilliz.com/contact-sales)。

        ## Milvus v2.6.xの新機能\{#milvus-v26x-new-features}

        - **ジオメトリデータ型サポート** — 地理空間検索、ジオフェンシング、ルーティング、マップベースのアプリケーション向けに、複雑な空間形状（POINT、LINESTRING、POLYGON）を保存およびクエリします。詳細については、[ジオメトリフィールド](./use-geometry-field)を参照してください。

        - **構造体データ型サポート** — ネストされた多属性レコードをより自然にモデル化し、スキーマ設計を簡素化し、メタデータが豊富なAIワークロードでのクエリを改善します。詳細については、[構造体の配列](./use-array-of-structs)を参照してください。

        - **既存のコレクションで動的フィールドを有効にする** — コレクションを再作成することなく動的フィールドのサポートを有効にし、ビジネス属性の進化に合わせてスキーマの柔軟性を可能にします。詳細については、[コレクションの変更](./modify-collections#example-4-enable-dynamic-field)を参照してください。

        - **ロード中のスカラーインデックスの削除をサポート** — コレクションがロード中の状態でも、スカラーインデックスの削除と再構築を許可します。

        ## プランがプロジェクトレベルに移動しました\{#plan-moved-to-the-project-level}

        このリリースにより、サブスクリプションプランはクラスターレベルではなく**プロジェクト**レベルで管理されるようになり、特に複数のクラスターを運用する組織にとって、構成の一貫性が向上し、機能ガバナンスが簡素化されます。

        既存のワークロード、機能、請求は変更されず、構成の更新は必要ありません。

        今後、**新規プロジェクト**ではプランの選択（Standard、Enterprise、またはビジネスクリティカル）が必要となり、**クラスター**ではデプロイオプション（Free、Serverless、またはDedicated）を選択することになります。

        詳細については、[詳細なプラン比較](./select-zilliz-cloud-service-plans)を参照してください。

        ## 強化点\{#enhancements}

        - **全文検索を有効にする移行サポート** - 人気のあるベクトルデータベースから移行する際に、Milvusが提供する全文検索機能を最大限に活用するために、BM25関数を有効にできるようになりました。詳細については、[エンドポイント経由でMilvusからZilliz Cloudへ移行する](./via-endpoint#getting-started)および[外部移行の基本](./external-migration-basics#configure-full-text-search-for-text-data)を参照してください。

        - **アラートサポート間隔設定** - 進行中のアラートの通知間隔をカスタマイズして、邪魔にならずに目立つようにすることができます。新しいアラートはデフォルトで1時間間隔です。詳細については、[プロジェクトアラートの管理](./manage-project-alerts#alert-settings)を参照してください。

    </div>

</Grid>

