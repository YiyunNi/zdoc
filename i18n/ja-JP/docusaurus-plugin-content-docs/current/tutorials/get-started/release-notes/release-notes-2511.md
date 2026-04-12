---
title: "2025 年 11 月リリースノート | Cloud"
slug: /release-notes-2511
sidebar_label: "2025 年 11 月"
beta: FALSE
notebook: FALSE
description: "2025 年 11 月の Zilliz Cloud リリースノートです。"
type: origin
token: CK0ewQWC2iz6lakP0kscqogbnGh
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - リリースノート

---

import Admonition from '@theme/Admonition';


import Grid from '@site/src/components/Grid';

# 2025年11月リリースノート

<Grid columnSize="2" widthRatios="16,83">

    <div>

        **2025-11-06**

    </div>

    <div>

        ## ビジネスクリティカルプランの提供開始\{#business-critical-plan-availability}

        Zilliz Cloudでは、最高レベルのセキュリティ、コンプライアンス、可用性を必要とする組織向けに、**ビジネスクリティカル**プランを新たに提供しています。既存のHIPAAおよびSOC 2 Type II対応に加え、このプランではグローバルクラスター、自動フェイルオーバー付きマルチリージョンレプリケーション、ポイントインタイムリカバリ（PITR）などの高度な機能を提供し、グローバル規模での強固なデータ保護、規制要件への適合、運用レジリエンスを実現します。詳細情報や、このプランがお客様の環境に適しているかどうかの評価については、[お問い合わせ](https://zilliz.com/contact-sales)ください。

        ## Milvus v2.6.xの新機能\{#milvus-v26x-new-features}

        - **ジオメトリデータ型サポート** — ジオスペーシャル検索、ジオフェンシング、ルーティング、地図ベースアプリケーション向けに、複雑な空間形状（POINT、LINESTRING、POLYGON）を保存・検索できます。詳細は、[ジオメトリ Field](./use-geometry-field)をご参照ください。

        - **構造体データ型サポート** — ネストされた多属性レコードをより自然にモデリングすることで、スキーマ設計を簡素化し、メタデータが豊富なAIワークロードにおけるクエリ性能を向上させます。詳細は、[配列 of 構造体s](./use-array-of-structs)をご参照ください。

        - **既存コレクションでのDynamic Fieldの有効化** — コレクションを再作成せずにDynamic Fieldサポートを有効化でき、ビジネス属性の進化に合わせてスキーマの柔軟性を確保できます。詳細は、[Modify Collection](./modify-collections#example-4-enable-dynamic-field)をご参照ください。

        - **ロード中ステータス下でのスカラーインデックス削除サポート** — コレクションがロード中の状態でも、スカラーインデックスの削除および再構築が可能になりました。

        ## プランがプロジェクトレベルに移行\{#plan-moved-to-the-project-level}

        今回のリリースにより、サブスクリプションプランの管理が**Cluster**レベルから**Project**レベルに変更されました。これにより、特に複数のクラスターを運用する組織において、設定の一貫性が向上し、機能ガバナンスが簡素化されます。

        既存のワークロード、機能、課金には一切影響なく、設定の更新も不要です。

        今後、**新規プロジェクト**を作成する際にはプラン（Standard、Enterprise、またはビジネスクリティカル）を選択する必要があり、一方で**Cluster**ではデプロイメントオプション（Free、Serverless、またはDedicated）を選択することになります。

        詳細については、[Detailed Plan Comparison](./select-zilliz-cloud-service-plans)をご参照ください。

        ## 機能強化\{#enhancements}

        - **フルテキスト検索を有効化するマイグレーションサポート** — 人気のあるベクトルデータベースから移行する際に、Milvusが提供するフルテキスト検索機能を最大限活用できるよう、BM25関数を有効化できるようになりました。詳細は、[Migrate from Milvus to Zilliz Cloud Via Endpoint](./via-endpoint#getting-started)および[External Migration 基本](./external-migration-basics#configure-full-text-search-for-text-data)をご参照ください。

        - **アラート通知間隔のカスタマイズ** — 継続中のアラートについて通知間隔をカスタマイズできるようになり、通知が目立つ一方で過剰に煩わしくならないように調整できます。新規アラートのデフォルト通知間隔は1時間です。詳細は、[Manage プロジェクトアラート](./manage-project-alerts#alert-settings)をご参照ください。

    </div>

</Grid>

