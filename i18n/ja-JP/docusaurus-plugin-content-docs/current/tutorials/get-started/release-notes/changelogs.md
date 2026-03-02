---
title: "変更履歴 | Cloud"
slug: /changelogs
sidebar_label: "変更履歴"
beta: FALSE
notebook: FALSE
description: "最終更新日：2026年1月15日 | Cloud"
type: origin
token: MUL3wkn7Yi3YoFkYk59csf8bnNc
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 変更履歴
  - ベクトルデータベースチュートリアル
  - ベクトルデータベースの仕組み
  - ベクトルDB比較
  - openai ベクトルDB

---

import Admonition from '@theme/Admonition';


import Grid from '@site/src/components/Grid';

# 変更履歴

**最終更新日:** 2026年1月15日

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **今後のリリース**

    </div>

    <div>

        - さらなる機能強化を伴うグローバルクラスター。

        - 外部ボリュームがまもなく利用可能になります。

    </div>

</Grid>

## 2026\{#2026}

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025年1月15日](./release-notes-2601)**

    </div>

    <div>

        - 🚀 Milvus v2.6.x の新機能が Zilliz Cloud で利用可能に

            - [TIMESTAMPTZ フィールド](./use-timestamptz-field)

            - [テキストハイライター](./text-highlighter)

        - 🤖 [モデルベースの埋め込み](./undefined)と[再ランキング機能](./model-ranker)がパブリックプレビューで利用可能に。

        - 🤖 [ホスト型モデル](./hosted-models)がプライベートプレビューで利用可能に。

        - 🛠️ インテリジェントな[動的レプリカ自動スケーリング](./manage-replica#dynamic-scaling)。

        - 📅 おなじみの cron 設定による高度な[スケジュールスケーリング](./scale-query-cu#scheduled-scaling)。

        - 🌎 [グローバルクラスター](./global-cluster-explained)がプライベートプレビューで稼働開始。

        - ☁️ BYOC が以下の機能強化によりさらに使いやすくなりました。

            - [完全な自動スケーリング機能](/docs/byoc/scale-cluster)

            - [テクニカルサポートアクセス制御](/docs/byoc/deploy-byoc-aws#technical-support-access)

    </div>

</Grid>

## 2025\{#2025}

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025年12月26日](./release-notes-2512#milvus-v26-ga)**

    </div>

    <div>

        - 🚀 Milvus v2.6.x が一般提供 (GA) 開始

        - 💾 階層型ストレージが GA になり、[課金が開始](./storage-cost)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,75">

    <div>

        **[2025年12月1日](./release-notes-2512#volume-ga-formerly-stage)**

    </div>

    <div>

        - 📦 Stage は[Volume](./volume-explained)に名称変更され、GA になりました。

        - [🔐 組織レベルのIPホワイトリスト](./setup-console-ip-allowlist)が利用可能になりました。

        - [🔐 TOTPベースのMFA](./multi-factor-auth)が利用可能になりました。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025年11月6日](./release-notes-2511#business-critical-plan-availability)**

    </div>

    <div>

        - 🚀 Milvus v2.6.x が Zilliz Cloud で利用可能になり、より多くのデータ型に対応しました。

            - [Geometry](./use-geometry-field)、および

            - [Array of Structs](./use-array-of-structs)

        - 🔍 [移行中](./via-endpoint#getting-started)に全文検索機能が利用可能になりました。

        - ⏰ 繰り返しのアラートを抑制するために[通知間隔](./manage-project-alerts#alert-settings)をカスタマイズできるようになりました。

        - 🔧 [既存のコレクションに対して動的フィールドを有効にできる](./modify-collections#example-4-enable-dynamic-field)ようになり、コレクションの再作成が不要になりました。

        - 💳 サブスクリプションプランがプロジェクトレベルに移行し、クラスターにはいくつかのデプロイオプションが用意されました。[詳細なプラン比較](./select-zilliz-cloud-service-plans)で詳細をご確認ください。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,75">

    <div>

        **[2025年10月9日](./release-notes-2510#milvus-v26x-public-preview)**

    </div>

    <div>

        - 🚀 Milvus v2.6.x が Zilliz Cloud で利用可能に

            - ダウンタイムなしの[フィールド追加](./add-fields-to-an-existing-collection)

            - [多言語アナライザー](./multi-language-analyzers)と[フレーズマッチ](./phrase-match)による強化された全文検索

            - [JSONインデックス](./json-indexing)と[Shredding](./json-shredding)によるJSONフィルタリングの高速化

            - 検索結果の絞り込みのための[ブーストランカー](./boost-ranker)と[ディケイランカー](./decay-ranker)

            - [INT8_VECTORデータ型](./use-dense-vector)のサポート

        - 💾 拡張容量クラスター向けの階層型ストレージのアップグレード

        - [🔄 事業継続戦略のためのクロスリージョンバックアップ](./backup-to-other-regions)

        - [⚙️ シナリオに合わせてインデックス設定を調整するためのインデックスビルドレベル](./tune-index-build-level)

        - 🚧 パイプラインは非推奨になりました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025年8月20日](./release-notes-2508#autoscaling-upgrade)**

    </div>

    <div>

        - [📈 設定が簡素化されたオートスケーリングのアップグレード](./scale-query-cu#dynamic-scaling)

        - [📋 監査ログ](./audit-logs)が一般提供開始

        - [🔐 SSO](./single-sign-on)エクスペリエンスが向上

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025年8月13日](./release-notes-2508#support-aws-sydney-region)**

    </div>

    <div>

        - **新しいリージョン**: 🇦🇺 AWS シドニー (ap-southeast-2)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025年7月15日](./release-notes-2180)**

    </div>

    <div>

        - [🔗 スキーマ進化のためのデータマージAPI](./merge-data)。

        - [📦 移行とデータインポートのための共有ステージングレイヤーとしてのステージ](./manage-stages)

        - [📅 スケジュールベースのクラスターオートスケーリング](./scale-query-cu)

        - [🔄 クラスターの部分的な復元](./restore-from-snapshot#restore-a-partial-cluster)

        - [⚙️ Zilliz Cloud コンソールでのJSONインデックス設定](./json-indexing)

        - 📊 BYOC プロジェクトのクォータ設定

        - 🔐 クラスター復元時のRBAC設定の復元

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025年6月9日](./release-notes-2170)**

    </div>

    <div>

        - [📚 移行ドキュメントとベストプラクティス](./migrations)を再構築

        - [🚨 きめ細かく柔軟な監視のためのポリシーベースのアラート](./manage-project-alerts)

        - ⚙️ Zilliz Cloud コンソールでの mmap 設定

        - ☁️ BYOC が Google Cloud Platform (GCP) で利用可能に

        - 🤖 コマンドに応じた適切に設計されたAIアシスタント

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025年4月24日](./release-notes-2150)**

    </div>

    <div>

        - [🔄 ゼロダウンタイム移行](./zero-downtime-migration)が利用可能になりました。

        - ⚙️ BYOC プロジェクトのインスタンス設定と AWS PrivateLink サポート。

        - 🔍 [JSON インデックス](./use-json-fields)を使用した JSON フィールドでのきめ細かいフィルタリング。

        - 🛠️ RESTful API を使用して[クラスターのレプリカ数を変更](/reference/restful/modify-cluster-replica-v2)できます。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025年3月27日](./release-notes-2140)**

    </div>

    <div>

        - 🔒 BYOC-I は完全なデータ主権を提供します。

        - [📋 クラスターの監査ログ](./audit-logs)が利用可能になりました。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025年1月27日](./release-notes-2130)**

    </div>

    <div>

        - 🚀 Milvus v2.5.x が Zilliz Cloud で利用可能に

        - [🔍 全文検索](./full-text-search)が既存のセマンティック検索機能を補完

        - [📋 クラスターの監査ログ](./audit-logs)が利用可能に

        - [☁️ 強化されたセキュリティを備えたAWS上のBYOC](/docs/byoc/deploy-byoc-aws)

    </div>

</Grid>

## 2024\{#2024}

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024年12月26日](./release-notes-2120)**

    </div>

    <div>

        - 🎯 [検索レベルを調整](./tune-recall-rate)することで高い再現率を実現

        - [🔐 コレクションレベルのRBACサポート](./cluster-privileges#collection-level-privilege-groups)

        - [💾 拡張データ容量のためのmmapサポート](./use-mmap)

        - [🗂️ マルチテナンシーのためのデータベース](/docs/database)が利用可能に

        - **新しいリージョン**: 🇺🇸 GCP us-central1 (アイオワ)

        - [☁️ AWSでBYOCが利用可能に](/docs/byoc/deploy-byoc-aws)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024年11月6日](./release-notes-2110)**

    </div>

    <div>

        - 🎨 Zilliz Cloud コンソールを再構築

        - 🔄 拡張されたソースからのデータ移行:

            - [Qdrant](./migrate-from-qdrant)、

            - [Pinecone](./migrate-from-pinecone)、および

            - [Tencent Cloud](./migrate-from-tencent-cloud)

        - 💳 支払いプロセスを改善し、[請求書ページ](./view-invoice)を再設計

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024年10月14日](./release-notes-2102)**

    </div>

    <div>

        - [📚 ノートブックギャラリー](https://zilliz.com/learn/milvus-notebooks)がオンラインに

        - ⚡ 容量を拡張したパフォーマンス最適化クラスター

        - [🔄 マルチレプリカ](./manage-replica)が一般提供開始

        - **新しいリージョン**: 🇯🇵 AWS 東京 (ap-northeast-1)

        - [📊 Prometheus との統合](./prometheus-monitoring)

        - [🔑 Auth0 を使用したシングルサインオン (SSO)](./single-sign-on)

        - 🎁 AWS Marketplace を利用した無料トライアル

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024年9月14日](./release-notes-2100)**

    </div>

    <div>

        - ☁️ サーバーレスクラスターが一般提供開始

        - [🔄 マルチレプリカ](./manage-replica)がパブリックプレビューで利用可能に

        - 📦 Zilliz Cloud へのデータ移行サービス:

            - [Milvus](./migrate-from-milvus)

            - [Elasticsearch](./migrate-from-elasticsearch)

            - [PostgreSQL](./migrate-from-pgvector)、および

            - [Zilliz Cloud クラスター間](./offline-migration)

        - 🛠️ バックアップ、復元、移行、ジョブ管理のための RESTful API エンドポイント

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024年7月23日](./release-notes-291)**

    </div>

    <div>

        - 🛠️ RESTful API エンドポイントを再構築

        - 🤖 簡単な情報検索のためのチャットボット

        - [📋 バックアップ、復元、移行、データインポートのためのワンストップジョブ監視](./job-center)

        - [📈 オートスケーリング](./manage-cluster)がプライベートプレビューで利用可能に

        - 🖼️ 画像検索で強化されたパイプライン

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024年6月18日](./release-notes-290)**

    </div>

    <div>

        - 🚀 Milvus v2.4.x が Zilliz Cloud で利用可能に

            - [疎ベクトル](./use-sparse-vector)データ型サポート

            - Float16 & BFloat16 ベクトルデータ型サポート

            - [マルチベクトルハイブリッド検索](./hybrid-search)

            - [転置インデックス](./index-scalar-fields)と[ファジーマッチ](./basic-filtering-operators#example-2-using-like-for-pattern-matching)

            - [グループ化検索](./grouping-search)

            - 洗練された MilvusClient インターフェース

        - 📊 パイプラインがトークン使用量を監視するようになりました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024年5月15日](./release-notes-280)**

    </div>

    <div>

        - ☁️ サーバーレスクラスターがベータ版になりました

        - **新しいリージョン**: 🇩🇪 Azure ドイツ西部中央 (フランクフルト)

        - **新しいリージョン**: 🇩🇪 GCP ヨーロッパ西部3 (フランクフルト) および 🇺🇸 米国東部4 (バージニア)

        - 🧠 テキストパイプラインと画像パイプラインが利用可能になりました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024年4月13日](./release-notes-270)**

    </div>

    <div>

        - [🛒 Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/zillizinc1703056661329.zilliz_cloud?tab=PlansAndPrice)がオンラインになりました

        - 🔌 パイプラインがコネクタをサポートするようになりました

        - 🔄 パイプラインが検索パイプラインにリランカーを導入しました

        - [📊 RESTful API を介したメトリック監視](/reference/restful/query-metrics)が利用可能です

        - 🌐 クロスクラウド[データインポート](./data-import)と[移行](./migrations)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024年3月13日](./release-notes-260)**

    </div>

    <div>

        - 🧠 パイプラインがより多くの埋め込みモデルをサポートするようになりました

        - 🎮 Zilliz Cloud コンソールでコレクションプレイグラウンドが利用可能になりました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024年1月18日](./release-notes-250)**

    </div>

    <div>

        - [📥 Parquet ファイルからのデータインポート](./data-import)

        - [🔐 RBAC 原則で強化された API キー](./manage-api-keys)

        - [📊 メトリックボードとアラートシステム](./metrics-and-alerts)を再構築

    </div>

</Grid>

## 2023\{#2023}

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023年12月11日](./release-notes-240)**

    </div>

    <div>

        - ☁️ Zilliz Cloud が以下のリージョンで Azure で利用可能になりました。

            - **新しいリージョン**: 🇺🇸 Azure 東部米国

        - 🚀 パイプラインがベータ版で利用可能になりました

        - 🔐 クラスターでの RBAC と認証情報管理

        - 🛠️ クラスター関連の RESTful API エンドポイント

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023年10月17日](./release-notes-230)**

    </div>

    <div>

        - **新しいリージョン**: 🇩🇪 AWS フランクフルト (aws-en-central-1)

        - 🚀 Milvus v2.3.x がパブリックプレビューで利用可能に

            - [範囲検索](./range-search)

            - [Upsert](./upsert-entities)

            - [コサインメトリックタイプ](./search-metrics-explained)

            - [アクセス制御](./access-control)

            - 生のベクトルを返す

            - [JSON_CONTAINS フィルター](./json-filtering-operators)

            - [エンティティ数](./count-entities)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023年9月27日](./release-notes-221)**

    </div>

    <div>

        - 💰 前払いサポート

        - **新しいリージョン**: 🇺🇸 AWS 米国東部1 (aws-us-east-1)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023年9月13日](./release-notes-220)**

    </div>

    <div>

        - [🔄 Zilliz Cloud クラスター間のデータ移行](./offline-migration)

        - [🚀 Elasticsearch からの簡単な移行](./migrate-from-elasticsearch)

        - [📥 データインポートの強化](./prepare-data-import)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023年8月16日](./release-notes-210)**

    </div>

    <div>

        - **新しいリージョン**: 🇸🇬 AWS シンガポール (ap-southeast-1)

        - **新しいリージョン**: 🇸🇬 GCP シンガポール (asia-southeast-1)

        - 🔄 サーバーレスクラスターから専用クラスターへの移行サポート

        - 📤 一括挿入サポート

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023年6月11日](./release-notes-200)**

    </div>

    <div>

        - ☁️ サーバーレスクラスターが利用可能になりました

        - [💰 Zilliz Cloud プランティアが導入されました](https://zilliz.com/pricing)

        - 👥 [アクセス制御](./access-control)のための組織、コラボレーション、RBAC

        - 🏷️ 名前空間のためのパーティションキーが導入されました

        - 📝 動的スキーマが利用可能になりました

        - 📊 新しいデータ型: JSON

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023年4月6日](./release-notes-110)**

    </div>

    <div>

        - [💰 料金計算ツール](https://zilliz.com/pricing#calculator)

        - [💾 GCP でのバックアップと復元](./backup-and-restore)

        - [⏰ カスタムタイムゾーン](./organization-settings#manage-timezone)

        - [🔄 コレクション名の変更](./manage-collections-console)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023年3月6日](./release-notes-100)**

    </div>

    <div>

        - **新しいリージョン**: 🇺🇸 GCP オレゴン (us-west1)

        - ☁️ Zilliz Cloud が [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-iqbidum7feuio) で利用可能になりました

        - [💾 AWS でバックアップと復元](./backup-and-restore)が利用可能になりました

        - [🗑️ データ継続性戦略のためのごみ箱](./use-recycle-bin)

        - [🔄 Milvus からの移行](./migrations)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023年2月13日](./release-notes-011)**

    </div>

    <div>

        - 📧 メール通知

        - 📚 初心者向けインラインガイダンス

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023年1月10日](./release-notes-010)**

    </div>

    <div>

        - 👁️ コレクションのデータプレビュー

        - 📚 初心者がベクトルデータベースに慣れるためのデモデータセット

    </div>

</Grid>

## 2022\{#2022}

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2022年12月5日](./release-notes-009)**

    </div>

    <div>

        - 🎨 新しいデザインの Zilliz Cloud コンソール

        - **新しいリージョン**: 🇺🇸 AWS オハイオ (us-east-2)

        - [🔐 Private Link](./setup-a-private-link) が利用可能に

        - [📥 データインポート](./data-import) が利用可能に

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2022年11月18日](./release-notes-008)**

    </div>

    <div>

        - 🚀 Zilliz Cloud が招待なしで一般公開

        - ⚡ 容量最適化された CU がオンラインに

        - 📊 QPS とクエリレイテンシのリソースモニター

        - 🛠️ インデックス作成を簡素化する AUTOINDEX

        - ⚡ より良いユーザーエクスペリエンスのために UI パフォーマンスを最適化

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2022年9月15日](./undefined)**

    </div>

    <div>

        - 🎨 コレクションビューを再構築

        - 🔍 ベクトル検索ビューを再構築

        - 🧑‍💻 Google でのサインアップが利用可能に

        - [⚙️ システムメンテナンス設定](./organization-settings)が利用可能に

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2022年8月30日](./undefined)**

    </div>

    <div>

        - 📊 より大規模な標準ベクトルデータベース。

        - ⚙️ Cloud UI でのコレクション管理。

        - ⚙️ Cloud UI でのインデックス管理。

        - 🔍 Cloud UI でのベクトル検索の実行。

        - 🔐 セキュリティ上の懸念から、デフォルトでインターネットからのデータベースアクセスを無効化。

        - 🔐 ホワイトリストエクスペリエンスを改善。

        - 💰 クレジットをサポート。

        - 🚀 より良いインタラクションのために Cloud UI を改善。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2022年8月1日](./undefined)**

    </div>

    <div>

        - 👁️ Cloud UI でコレクションを表示。

        - 👁️ Cloud UI でコレクションスキーマを表示。

        - ➕ Cloud UI でコレクションを作成。

        - ➖ Cloud UI でコレクションを削除。

        - 👁️ Cloud UI でインデックスを表示。

        - 🚀 より良いインタラクションのための Cloud UI。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2022年7月22日](./undefined)**

    </div>

    <div>

        - **新しいリージョン**: 🇺🇸 AWS オレゴン (us-west-2)

        - ✅ すべてのコア Milvus 機能をサポート。

        - ⏸️ ベクトルデータベースの一時停止と再開をサポート。

        - 📊 基本的なベクトルデータベースメトリックの表示をサポート。

        - 👥 データベースユーザー管理をサポート。

        - ➕ 複数のプロジェクトの作成をサポート。

        - 🔐 プロジェクトレベルでの IP ホワイトリスト設定をサポート。

        - 👁️ ユーザー操作イベントの表示をサポート。

        - 🔐 メールによる MFA の有効化をサポート。

    </div>

</Grid>

