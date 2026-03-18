---
title: "変更ログ | Cloud"
slug: /changelogs
sidebar_label: "変更ログ"
beta: FALSE
notebook: FALSE
description: "最終更新日：2026 年 2 月 9 日 | Cloud"
type: origin
token: MUL3wkn7Yi3YoFkYk59csf8bnNc
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 変更ログ

---

import Admonition from '@theme/Admonition';


import Grid from '@site/src/components/Grid';

# 変更ログ

**最終更新日:** 2026 年 2 月 9 日

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **次期リリース**

    </div>

    <div>

        - 多くの機能強化を伴うグローバルクラスター。

        - 外部ボリュームがまもなく利用可能になります。

    </div>

</Grid>

## 2026\{#2026}

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2 月 9 日](./release-notes-2602#sso-enforcement)[, 2026 年](./release-notes-2602#sso-enforcement)**

    </div>

    <div>

        - 🔐 [SSO の強制](./enforce-sso-in-your-organization) により、SSO 認証以外からのアクセスを制限します。

        - 👥 クラスターレベルのアクセス制御を [組織レベル](./organization-users#organization-role) および [プロジェクトレベル](./project-users#project-access) で構成し、きめ細かいデータアクセスを実現します。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2 月 4 日](./release-notes-2602#new-region-aws-ireland)[, 2026 年](./release-notes-2602#new-region-aws-ireland)**

    </div>

    <div>

        - **新しいリージョン**: 🇮🇪 AWS アイルランド (eu-west-1)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2026 年 1 月 29 日](./release-notes-2601#another-milvus-v26x-new-feature)**

    </div>

    <div>

        - 🚀   Zilliz Cloud でさらに新しい Milvus v2.6.x の機能が利用可能になりました

            - [プライマリキー検索](./primary-key-search)

        - 🔒 BYOC-I が [Microsoft Azure](/docs/byoc/deploy-byoc-i-azure) で利用可能になりました。

        - 🔐 [カスタマー管理暗号化キー](./cmek) が、Zilliz Cloud クラスター内の保存データの暗号化に利用可能になりました。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2026 年 1 月 23 日](./release-notes-2601#milvus-v26x-new-feature)**

    </div>

    <div>

        - 🚀   Zilliz Cloud で新しい Milvus v2.6.x の機能が利用可能になりました

            - [セマンティックハイライター](./semantic-highlighter)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2026 年 1 月 15 日](./release-notes-2601)**

    </div>

    <div>

        - 🚀   Zilliz Cloud で新しい Milvus v2.6.x の機能が利用可能になりました

            - [TIMESTAMPTZ フィールド](./use-timestamptz-field)

            - [テキストハイライター](./text-highlighter)

        - 🤖 [モデルベース埋め込み](./model-based-functions) および [リランキング関数](./model-ranker) がパブリックプレビューとなりました。

        - 🤖 [ホスト済みモデル](./hosted-models) がプライベートプレビューとなりました。

        - 🛠️ インテリジェントな [動的レプリカオートスケーリング](./manage-replica#dynamic-scaling)。

        - 📅 おなじみの cron 設定を備えた高度な [スケジュールされたスケーリング](./scale-query-cu#scheduled-scaling)。

        - 🌎 [グローバルクラスター](./global-cluster-explained) が稼働開始しました。アクセスするには [お問い合わせください](https://support.zilliz.com/hc/en-us)。

        - ☁️ 以下の機能強化により、BYOC がより使いやすくなりました：

            - [フルオートスケーリング機能](/docs/byoc/scale-cluster)

            - [技術サポートへのアクセス制御](/docs/byoc/deploy-byoc-aws#technical-support-access)

    </div>

</Grid>

## 2025\{#2025}

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025 年 12 月 26 日](./release-notes-2512#milvus-v26-ga)**

    </div>

    <div>

        - 🚀   Milvus v2.6.x が一般提供 (GA) となりました

        - 💾  階層型ストレージが GA となり、[課金が開始](./storage-cost) されました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,75">

    <div>

        **[2025 年 12 月 1 日](./release-notes-2512#volume-ga-formerly-stage)**

    </div>

    <div>

        - 📦  ステージ が [ボリューム](./volume-explained) に改名され、GA となりました

        - [🔐  組織レベルの IP ホワイトリスト](./setup-console-ip-allowlist) が利用可能になりました

        - [🔐  TOTP ベースの MFA](./multi-factor-auth) が利用可能になりました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025 年 11 月 6 日](./release-notes-2511#business-critical-plan-availability)**

    </div>

    <div>

        - 🚀  より多くのデータ型をサポートする Milvus v2.6.x が Zilliz Cloud で利用可能になりました：

            - [ジオメトリ](./use-geometry-field)、および

            - [構造体の配列](./use-array-of-structs)

        - 🔍  [移行](./via-endpoint#getting-started) 中に全文検索機能が利用可能になりました。

        - ⏰  繰り返しアラートを抑制するための [通知間隔](./manage-project-alerts#alert-settings) のカスタマイズ。

        - 🔧  コレクションの再作成なしで、[既存のコレクションに対して動的フィールドを有効化](./modify-collections#example-4-enable-dynamic-field) できるようになりました。

        - 💳  サブスクリプションプランがプロジェクトレベルに移行し、クラスターにはいくつかのデプロイオプションがあります。詳細は [詳細なプラン比較](./select-zilliz-cloud-service-plans) をご覧ください。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,75">

    <div>

        **[2025 年 10 月 9 日](./release-notes-2510#milvus-v26x-public-preview)**

    </div>

    <div>

        - 🚀  Milvus v2.6.x が Zilliz Cloud で利用可能になりました

            - ダウンタイムなしでの [フィールド追加](./add-fields-to-an-existing-collection)

            - [多言語アナライザー](./multi-language-analyzers) と [フレーズ一致](./phrase-match) による強化された全文検索

            - [JSON インデックス](./json-indexing) と [シュレッディング](./json-shredding) による高速化された JSON フィルタリング

            - 検索結果の洗練のための [ブーストランカー](./boost-ranker) および [ディケイランカー](./decay-ranker)

            - [INT8_VECTOR データ型](./use-dense-vector) のサポート

        - 💾  容量拡張クラスター向けの階層型ストレージのアップグレード

        - ビジネス継続性戦略のための [🔄 リージョン間バックアップ](./backup-to-other-regions)

        - シナリオに合わせてインデックス設定を調整するための [⚙️  インデックスビルドレベル](./tune-index-build-level)

        - 🚧 パイプラインは非推奨となりました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025 年 8 月 20 日](./release-notes-2508#autoscaling-upgrade)**

    </div>

    <div>

        - 設定が簡素化された [📈  オートスケーリングのアップグレード](./scale-query-cu#dynamic-scaling)

        - [📋  監査ログ](./audit-logs) が一般提供となりました

        - [🔐  SSO](./single-sign-on) のエクスペリエンスが向上しました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025 年 8 月 13 日](./release-notes-2508#support-aws-sydney-region)**

    </div>

    <div>

        - **新しいリージョン**: 🇦🇺 AWS シドニー (ap-southeast-2)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025 年 7 月 15 日](./release-notes-2180)**

    </div>

    <div>

        - スキーマ進化のための [🔗  マージデータ API](./merge-data)。

        - 移行とデータインポートのための共有ステージングレイヤーとしての [📦  ステージ](./manage-stages)

        - [📅  スケジュールベースのクラスターオートスケーリング](./scale-query-cu)

        - クラスターの [🔄  部分的な復元](./restore-from-snapshot#restore-a-partial-cluster)

        - Zilliz Cloud コンソール上の [⚙️  JSON インデックス](./json-indexing) 設定

        - 📊  BYOC プロジェクト向けのクォータ設定

        - 🔐  クラスター復元時の RBAC 設定の復元

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025 年 6 月 9 日](./release-notes-2170)**

    </div>

    <div>

        - [📚  移行ドキュメントとベストプラクティス](./migrations) のリファクタリング

        - きめ細かく柔軟な監視のための [🚨  ポリシーベースのアラート](./manage-project-alerts)

        - ⚙️  Zilliz Cloud コンソール上の mmap 設定

        - ☁️  BYOC が Google Cloud Platform (GCP) で利用可能になりました

        - 🤖  コマンドに対応するよく設計された AI アシスタント

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025 年 4 月 24 日](./release-notes-2150)**

    </div>

    <div>

        - ⚙️  BYOC プロジェクト向けのインスタンス設定および AWS プライベートLink サポート

        - 🔍  [JSON インデックス](./use-json-fields) を使用した JSON フィールド上のきめ細かいフィルタリング

        - 🛠️  RESTful API を使用して [クラスターのレプリカ数を変更](/reference/restful/modify-cluster-replica-v2) します。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025 年 3 月 27 日](./release-notes-2140)**

    </div>

    <div>

        - 🔒 BYOC-I により完全なデータ主権を提供します

        - [📋  クラスター用の監査ログ](./audit-logs) が利用可能になりました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2025 年 1 月 27 日](./release-notes-2130)**

    </div>

    <div>

        - 🚀  Milvus v2.5.x が Zilliz Cloud で利用可能になりました

        - 既存のセマンティック検索機能を補完する [🔍  全文検索](./full-text-search)

        - [📋  クラスター用の監査ログ](./audit-logs) が利用可能になりました

        - 強化されたセキュリティを備えた [☁️  AWS 上の BYOC](/docs/byoc/deploy-byoc-aws)

    </div>

</Grid>

## 2024\{#2024}

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024 年 12 月 26 日](./release-notes-2120)**

    </div>

    <div>

        - 🎯  [検索レベルを調整](./tune-recall-rate) することによる高い再現率

        - [🔐  コレクションレベルの RBAC サポート](./cluster-privileges#collection-level-privilege-groups)

        - データ容量拡大のための [💾  mmap](./use-mmap) サポート

        - マルチテナンシーのための [🗂️  データベース](/docs/database) が利用可能になりました

        - **新しいリージョン**: 🇺🇸 GCP us-central1 (アイオワ)

        - [☁️  BYOC](/docs/byoc/deploy-byoc-aws) が AWS で利用可能になりました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024 年 11 月 6 日](./release-notes-2110)**

    </div>

    <div>

        - 🎨  Zilliz Cloud コンソールのリファクタリング

        - 🔄  ソースを拡大したデータ移行： 

            - [Qdrant](./migrate-from-qdrant)、

            - [Pinecone](./migrate-from-pinecone)、および

            - [Tencent Cloud](./migrate-from-tencent-cloud)

        - 💳  支払いプロセスの改善と [請求書ページ](./view-invoice) の再設計

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024 年 10 月 14 日](./release-notes-2102)**

    </div>

    <div>

        - [📚  ノートブックギャラリー](https://zilliz.com/learn/milvus-notebooks) がオンラインになりました

        - ⚡  容量を拡大したパフォーマンス最適化済みクラスター

        - [🔄  マルチレプリカ](./manage-replica) が一般提供となりました

        - **新しいリージョン**: 🇯🇵 AWS 東京 (ap-northeast-1)

        - [📊  Prometheus との統合](./prometheus-monitoring)

        - Auth0 を使用した [🔑  シングルサインオン (SSO)](./single-sign-on)

        - 🎁  AWS Marketplace を使用した無料トライアル

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024 年 9 月 14 日](./release-notes-2100)**

    </div>

    <div>

        - ☁️  サーバーレスクラスターが一般提供となりました

        - [🔄  マルチレプリカ](./manage-replica) がパブリックプレビューとなりました

        - 📦  データを Zilliz Cloud に移行するための移行サービス：

            - [Milvus](./migrate-from-milvus)

            - [Elasticsearch](./migrate-from-elasticsearch)

            - [PostgreSQL](./migrate-from-pgvector)、および

            - [Zilliz Cloud クラスター間](./offline-migration)

        - 🛠️  バックアップ、復元、移行、ジョブ管理のための RESTful API エンドポイント

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024 年 7 月 23 日](./release-notes-291)**

    </div>

    <div>

        - 🛠️  RESTful API エンドポイントのリファクタリング

        - 🤖  情報取得を容易にするチャットボット

        - バックアップ、復元、移行、データインポートのための [📋  ワンストップジョブ監視](./job-center)

        - [📈  オートスケーリング](./manage-cluster) がプライベートプレビューとなりました

        - 🖼️  画像検索で強化されたパイプライン

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024 年 6 月 18 日](./release-notes-290)**

    </div>

    <div>

        - 🚀  Milvus v2.4.x が Zilliz Cloud で利用可能になりました

            - [スパースベクトル](./use-sparse-vector) データ型のサポート

            - Float16 および BFloat16 ベクトルデータ型のサポート

            - [マルチベクトルハイブリッド検索](./hybrid-search)

            - [転置インデックス](./index-scalar-fields) および [あいまい一致](./basic-filtering-operators#example-2-using-like-for-pattern-matching)

            - [グルーピング検索](./grouping-search)

            - 洗練された MilvusClient インターフェース

        - 📊  パイプラインがトークン使用量を監視するようになりました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024 年 5 月 15 日](./release-notes-280)**

    </div>

    <div>

        - ☁️  サーバーレスクラスターがベータ版となりました

        - **新しいリージョン**: 🇩🇪 Azure ドイツ西部中央 (フランクフルト)

        - **新しいリージョン**: 🇩🇪 GCP europe-west3 (フランクフルト) および 🇺🇸 us-east-4 (バージニア)

        - 🧠  テキストパイプラインおよび画像パイプラインが利用可能になりました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024 年 4 月 13 日](./release-notes-270)**

    </div>

    <div>

        - [🛒  Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/zillizinc1703056661329.zilliz_cloud?tab=PlansAndPrice) がオンラインになりました

        - 🔌  パイプラインがコネクターをサポートするようになりました

        - 🔄  パイプラインが検索パイプライン向けのリランカーを導入しました

        - [📊  RESTful API を通じたメトリック監視](/reference/restful/query-metrics) が利用可能になりました

        - 🌐  クロスクラウド [データインポート](./data-import) および [移行](./migrations)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024 年 3 月 13 日](./release-notes-260)**

    </div>

    <div>

        - 🧠  パイプラインがより多くの埋め込みモデルをサポートするようになりました

        - 🎮  コレクションプレイグラウンドが Zilliz Cloud コンソールで利用可能になりました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2024 年 1 月 18 日](./release-notes-250)**

    </div>

    <div>

        - Parquet ファイルからの [📥  データインポート](./data-import)

        - RBAC 原則で強化された [🔐  API キー](./manage-api-keys)

        - [📊  メトリックボードとアラートシステム](./metrics-and-alerts) のリファクタリング

    </div>

</Grid>

## 2023\{#2023}

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023 年 12 月 11 日](./release-notes-240)**

    </div>

    <div>

        - ☁️  Zilliz Cloud が Azure で以下のリージョンとともに利用可能になりました：

            - **新しいリージョン**: 🇺🇸  Azure East US

        - 🚀  パイプラインがベータ版として利用可能になりました

        - 🔐  クラスター内の RBAC および資格情報管理

        - 🛠️  クラスター関連の RESTful API エンドポイント

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023 年 10 月 17 日](./release-notes-230)**

    </div>

    <div>

        - **新しいリージョン**: 🇩🇪 AWS フランクフルト (aws-en-central-1)

        - 🚀  Milvus v2.3.x がパブリックプレビューとなりました

            - [範囲検索](./range-search)

            - [アップサート](./upsert-entities)

            - [コサインメトリックタイプ](./search-metrics-explained)

            - [アクセス制御](./access-control)

            - 返却される生ベクトル

            - [JSON_CONTAINS フィルター](./json-filtering-operators)

            - [エンティティ数](./count-entities)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023 年 9 月 27 日](./release-notes-221)**

    </div>

    <div>

        - 💰  前払いのサポート

        - **新しいリージョン**: 🇺🇸 AWS US East 1 (aws-us-east-1)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023 年 9 月 13 日](./release-notes-220)**

    </div>

    <div>

        - [🔄  Zilliz Cloud クラスター間のデータ移行](./offline-migration)

        - [🚀  Elasticsearch からの簡単な移行](./migrate-from-elasticsearch)

        - [📥  データインポートの機能強化](./prepare-data-import)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023 年 8 月 16 日](./release-notes-210)**

    </div>

    <div>

        - **新しいリージョン**: 🇸🇬 AWS シンガポール (ap-southeast-1)

        - **新しいリージョン**: 🇸🇬 GCP シンガポール (asia-southeast-1)

        - 🔄  サーバーレスクラスターから専用クラスターへの移行サポート

        - 📤  バルク挿入のサポート

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023 年 6 月 11 日](./release-notes-200)**

    </div>

    <div>

        - ☁️  サーバーレスクラスターが利用可能になりました

        - [💰  Zilliz Cloud プランティアの導入](https://zilliz.com/pricing)

        - 👥  [アクセス制御](./access-control) のための組織、コラボレーション、および RBAC

        - 🏷️  ネームスペースのためのパーティションキーの導入

        - 📝  動的スキーマが利用可能になりました

        - 📊  新しいデータ型：JSON

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023 年 4 月 6 日](./release-notes-110)**

    </div>

    <div>

        - [💰  価格計算機](https://zilliz.com/pricing#calculator)

        - GCP 上の [💾  バックアップ＆復元](./backup-and-restore)

        - [⏰  カスタムタイムゾーン](./organization-settings#manage-timezone)

        - [🔄  コレクションの名前変更](./manage-collections-console)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023 年 3 月 6 日](./release-notes-100)**

    </div>

    <div>

        - **新しいリージョン**: 🇺🇸 GCP オレゴン (us-west1)

        - ☁️  Zilliz Cloud が [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-iqbidum7feuio) で利用可能になりました

        - AWS 上で [💾  バックアップ＆復元](./backup-and-restore) が利用可能になりました

        - データ継続性戦略のための [🗑️  ごみ箱](./use-recycle-bin)

        - [🔄  Milvus からの移行](./migrations)

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023 年 2 月 13 日](./release-notes-011)**

    </div>

    <div>

        - 📧  E メール通知

        - 📚  初心者向けのインラインガイダンス

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2023 年 1 月 10 日](./release-notes-010)**

    </div>

    <div>

        - 👁️  コレクションのデータプレビュー

        - 📚  初心者がベクトルデータベースに慣れるのを助けるデモデータセット

    </div>

</Grid>

## 2022\{#2022}

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2022 年 12 月 5 日](./release-notes-009)**

    </div>

    <div>

        - 🎨  新しいデザインの Zilliz Cloud コンソール

        - **新しいリージョン**: 🇺🇸 AWS オハイオ (us-east-2)

        - [🔐  プライベートリンク](./setup-a-private-link) が利用可能になりました

        - [📥  データインポート](./data-import) が利用可能になりました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **[2022 年 11 月 18 日](./release-notes-008)**

    </div>

    <div>

        - 🚀  Zilliz Cloud が招待なしで一般公開されました

        - ⚡  容量最適化済み CU がオンラインになりました

        - 📊  QPS およびクエリレイテンシ用のリソースモニター

        - 🛠️  インデックス作成を簡素化する AUTOINDEX

        - ⚡  より良いユーザーエクスペリエンスのための UI パフォーマンスの最適化

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **2022 年 9 月 15 日**

    </div>

    <div>

        - 🎨  コレクションビューのリファクタリング

        - 🔍  ベクトル検索ビューのリファクタリング

        - 🧑‍💻  Google によるサインアップが利用可能になりました

        - [⚙️  システムメンテナンス設定](./organization-settings) が利用可能になりました

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **2022 年 8 月 30 日**

    </div>

    <div>

        - 📊  より大きな標準ベクトルデータベース。

        - ⚙️  Cloud UI 上でのコレクション管理。

        - ⚙️  Cloud UI 上でのインデックス管理。

        - 🔍  Cloud UI 上でのベクトル検索の実行。

        - 🔐  セキュリティ上の懸念から、インターネットからのデータベースアクセスをデフォルトで無効化。

        - 🔐  ホワイトリスト設定のエクスペリエンスを改善。

        - 💰  クレジットをサポート。

        - 🚀  より良いインタラクションのために Cloud UI を改善。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **2022 年 8 月 1 日**

    </div>

    <div>

        - 👁️  Cloud UI 上でのコレクション表示。

        - 👁️  Cloud UI 上でのコレクションスキーマ表示。

        - ➕  Cloud UI 上でのコレクション作成。

        - ➖  Cloud UI 上でのコレクション削除。

        - 👁️  Cloud UI 上でのインデックス表示。

        - 🚀  より良いインタラクションのための Cloud UI。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="25,74">

    <div>

        **2022 年 7 月 22 日**

    </div>

    <div>

        - **新しいリージョン**: 🇺🇸 AWS オレゴン (us-west-2)

        - ✅  すべてのコア Milvus 機能をサポート。

        - ⏸️  ベクトルデータベースの一時停止および再開をサポート。

        - 📊  基本的なベクトルデータベースメトリックの表示をサポート。

        - 👥  データベースユーザー管理をサポート。

        - ➕  複数のプロジェクトの作成をサポート。

        - 🔐  プロジェクトレベルでの IP ホワイトリスト設定をサポート。

        - 👁️  ユーザー操作イベントの表示をサポート。

        - 🔐  E メールによる MFA の有効化をサポート。

    </div>

</Grid>

