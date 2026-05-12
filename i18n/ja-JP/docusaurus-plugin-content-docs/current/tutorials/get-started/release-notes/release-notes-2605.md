---
title: "2026年5月リリースノート | Cloud"
slug: /release-notes-2605
sidebar_key: release-notes-2605
sidebar_label: "2026年5月"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud の2026年5月のリリースノートです。"
type: origin
token: NRF1wGr3AiWWC1kVfWucZD6Xneb
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - リリースノート

---

import Admonition from '@theme/Admonition';


import Grid from '@site/src/components/Grid';

# 2026年5月リリースノート

<Grid columnSize="2" widthRatios="14,85">

    <div>

        **2026-05-09**

    </div>

    <div>

        ## Vector Lakebase パブリックプレビュー\{#vector-lakebase-public-preview}

        このメジャーリリースにより、Zilliz Cloud はベクトルデータベース製品から Vector Lakebase プラットフォームへと進化します。

        アップグレード後、従来のベクトルデータベースサービスはレイテンシ重視のワークロード向けのリアルタイムサービングレイヤーとなり、プラットフォーム全体のデータおよびコンピューティング機能が拡張され、現代の AI およびエージェントアプリケーションに必要なセマンティック検索および分析ワークフローループをより効果的にサポートします。

        Vector Lakebase は、S3 ベースの統合データ基盤の上に構築され、3 つのアクセスモードで AI およびエージェントワークロードを実現します。

        - **Real-time Retrieval** — レイテンシ重視の本番サービング向け

        - **Iterative Discovery** — インタラクティブおよび多段階の探索向け

        - **Batch Analytics** — オフラインのマイニングおよびデータセット最適化向け

        Vector Lakebase は、完全に分離されたストレージ・コンピュートアーキテクチャの上に構築されています。データは データベース に保存されます — データベース はプロジェクトレベルのベクトルストアであり、あらゆるコンピュートクラスターから独立しています — チームは無制限のベクトルを、テキスト、JSON、ラベル、地理空間データ、その他の属性タイプとともに保存できます。

        特に、Zilliz Vector Lakebase には以下の主要な機能が導入されています。

        **On-Demand Search**

        インタラクティブな探索およびバッチ分析は、オンラインサービングよりも 1〜3 オーダー大規模なデータセット上で動作することが多く、フィードバックデータ、ログ、エージェントノート、クロール済みコーパスなどが含まれます。これらのワークロードは通常、タスク駆動型であり継続的にアクティブではなく、コンピュートリソースは 97% 以上の時間がアイドル状態です。その結果、大規模な常時稼働ベクトルデータベースクラスターを使用することは、コストの観点からしばしば正当化が困難です。

        Zilliz On-Demand Search は、オブジェクトストレージおよびオンデマンドコンピューティングに対して直接課金します — AWS Lambda と同様に、価格は主に割り当てられたリソースサイズおよび実行時間に基づき、ストレージコストは基盤となる S3 コストに近い水準を維持します。

        これらの非常時稼働ワークロードでは、On-Demand Search と Serverless の両方が従量課金モデルに従います。しかし、当社の実験が示すように、月間の累積アクティブコンピュート時間が 10 時間の 10 億ベクトルワークロードの場合、On-Demand Search の総コストは Serverless の約 1/15 に抑えられます（&#36;318 対 &#36;4,937）。

        詳細については、[クイックスタート to On-Demand Search](./quick-start-to-on-demand-search) および [On-Demand Compute Cost](./on-demand-compute-cost) を参照してください。

        **External データ Lake Search**

        Zilliz Vector Lakebase は、完全にマネージドされたストレージおよびクエリコンピュートを提供するとともに、既存のデータレイクインフラストラクチャおよびガバナンスパイプラインを持つお客様もサポートします。

        AI ワークロードにおける重要な課題は、レイクデータの上で効率的な検索およびセマンティック探索を直接可能にすることです。Spark や Ray などの従来のシステムは、インデックス加速されたセマンティック検索ではなく、フルデータスキャンおよびマップリデュース計算に最適化されています。

        これに対処するため、Zilliz は External Collection モードを提供します — これは、お客様が所有するレイクテーブルへのゼロコピーロジカルマッピングであり、その上に高性能なインデックス作成およびフルスペクトラム検索機能が構築されています。

        既存のデータレイクのインデックス作成および加速方法については、[クイックスタート to External データ Lake Search](./quick-start-to-external-data-lake-search) を参照してください。

        Vector Lakebase は、Zilliz Cloud コンソール、REST API、PyMilvus、および Zilliz CLI を通じてアクセスできます。コンピュート、ストレージ、およびストレージリクエストを含む従量課金制の課金を導入しています — Query CU、インデックス作成 CU、Project データベース Storage、および Storage Requests が含まれます。

        ## Milvus 3.0 パブリックプレビュー\{#milvus-30-public-preview}

        Vector Lakebase のローンチとともに、Zilliz は Milvus 3.0 のパブリックプレビューもリリースします。このバージョンでは、Milvus はオープンデータフォーマットおよび既存のデータレイクおよび大規模データ処理エンジンとのより広範な統合を通じて、ベクトルデータベース機能を AI データインフラストラクチャスタックへと拡張します。

        <Admonition type="info" icon="📘" title="Notes">

        このリリースでは、Milvus 3.0 の機能は On-demand Cluster のみでサポートされています。Serving Cluster はまだサポートされていません。

        </Admonition>

        **外部データおよびストレージフォーマット**

        - **External Collection** — データを Milvus にコピーすることなく、オブジェクトストレージ上のデータ（Parquet、Lance、Vortex、および Iceberg）を直接参照します。Milvus はスキーマ、インデックス、およびクエリ実行のみを管理します。インクリメンタル Refresh により、ソースファイルの変更にコレクションを同期させ、単一のデータセットを複数のインスタンスから同時に提供できます。

            詳細については、[External Collection](./external-collection) を参照してください。

        - **External Backfill** *(プライベートプレビュー)* — ライブコレクションでダウンタイムなしに埋め込みモデルをアップグレードします。`AddCollectionField` を介して新しいベクトルフィールドを追加し、Snapshot で一貫した開始点を固定し、埋め込みジョブをオフラインで実行し、通常の取り込みパスを通じて値を書き戻します。アプリケーションは、新しいカラムがインデックス作成されると切り替わります。

            *External Backfill のプライベートプレビューに参加するには、[お問い合わせ](https://zilliz.com/contact-sales)ください。*

        **スキーマおよびデータモデリング**

        - **Null Vector** — すべての 6 つのベクトルタイプでベクトルフィールドを NULL許容 にできます。NULL の行は検索時に自動的にスキップされ、検索品質に影響を与えず、NULL ベクトルは事実上ストレージを消費しません。既存のコレクションは、リビルドなしで `AddCollectionField` を介してオンラインで新しい NULL許容 ベクトルカラムを追加できます。

            詳細については、[NULL許容 フィールド](./nullable-fields) および [デフォルト値](./default-fields) を参照してください。

        - **EmbList + DiskANN** — エンティティごとに可変長のベクトルリストを保存し、DiskANN を介してディスク上にインデックス化します。長文書、ColBERT のような late-interaction モデル、およびマルチモーダルエンティティに適しており、大規模コーパスサイズで RAM を抑制します。

            詳細については、[構造体配列](./use-array-of-structs) および [構造体配列 オペレーター](./struct-array-filtering) を参照してください。

        - **MinHash DIDO (Doc-in, Doc-out)** — MINHASH_LSH にサーバーサイドの MinHash 関数を追加します。Milvus は、挿入、バルク挿入、および検索中に自動的にシグネチャを計算します — 重複排除、フィンガープリンティング、および盗作検出ワークフローにアプリケーション側の前処理は不要です。

            詳細については、[MinHash 関数](./minhash-function) を参照してください。

        **検索およびランキング制御**

        - **Query / Search Order By** — 検索およびクエリ結果のマルチフィールド順序付けで、フィールドごとの ASC / DESC をカーネルにプッシュダウンします。複合ランキングのためのオーバーフェッチおよびクライアントサイドの再ソートが不要になります。

            詳細については、[基本的なベクトル検索](./single-vector-search#sort-search-results-by-scalar-fields-or-private)、[グルーピング検索](./grouping-search#order-groups-by-a-scalar-field-or-private)、および [クエリ](./get-and-scalar-query#sort-query-results-or-private) を参照してください。

        **データライフサイクルおよび運用**

        - **Snapshot** — コレクションの特定時点の読み取り専用ビューで、既存のセグメントを参照しデータをコピーしません。バッチジョブは MVCC スタイルの分離下で実行され、ライブコレクションは書き込みを継続します — A/B 評価、重複排除、およびバックフィル検証に適しています。

            詳細については、[Snapshots](./snapshots) および [Snapshot の管理](./manage-snapshots) を参照してください。

        - **Entity TTL (行レベル TTL)** — `Timestamptz` TTL フィールドによる行ごとの有効期限切れ。期限切れの行は自動的に回収され、保持コンプライアンス、セッションデータ、および会話履歴をカバーします — アプリケーション側のクリーンアップは不要です。

             詳細については、[コレクション TTL の設定](./set-collection-ttl) を参照してください

        - **Force Merge** — オフピーク時間帯にセグメントの圧縮を明示的にトリガーします（同期または非同期）、セグメントの断片化によるクエリレイテンシのジッターおよびストレージオーバーヘッドを削減します。

        **テキストおよび Spark 駆動のデータ処理**

        - **カスタム辞書およびトークナイザー** *(プライベートプレビュー)* — FileResource メカニズムを介して、カスタムトークナイザー辞書、類義語リスト、ストップワードリスト、および decompounder ルールを登録します。BM25、analyzer、および Text Match に反映されます — アプリケーションコードに散在するのではなく、一元管理されたバージョン管理が可能です。

        - **Spark Semantic Dedup** *(プライベートプレビュー)* — 大規模 Spark データ処理でのセマンティック重複排除をサポートします。

        - **Spark 異常 検出** *(プライベートプレビュー)* — Spark ベースのデータ処理中に 異常 なレコードまたはパターンを検出します。

            *上記のいずれかの機能のプライベートプレビューに参加するには、[お問い合わせ](https://zilliz.com/contact-sales)ください。*

        ## External ボリュームs\{#external-volumes}

        Zilliz Cloud は、Managed ボリュームs に加えて External ボリュームs をサポートするようになりました。External ボリューム は、お客様のクラウドオブジェクトストレージ内のバケットまたはパスへの読み取り専用参照であり、Zilliz Cloud がデータを事前にコピーすることなく、インポート、移行、および外部コレクションワークフローのためにソースデータをその場で読み取ることができます。

        - **データが既に存在する場所で使用** — External ボリューム を AWS S3 または Google Cloud Storage のパスに向けます。データはお客様のバケットに残り、Zilliz Cloud は必要なときにのみ読み取ります。

        - **制御された、リージョン単位のアクセス** — アクセスは ストレージ統合 および Zilliz Cloud RBAC を通じて管理され、承認されたプロジェクトユーザーのみが External ボリューム を作成または管理できます。

        詳細については、[External ボリュームs](https://docs.cloud-uat3.zilliz.com/docs/external-volume) を参照してください。

        ## 大 TopK\{#large-topk}

        大 TopK がコレクションレベルでサポートされるようになり、有効化されたコレクションでの返却エンティティの最大数が 16,384 から 1,000,000 に拡張されました。Serving Cluster および On-demand Compute の両方で利用可能であり、データマイニングおよびバッチ分析ワークロードに最適です — 候補生成、モデル評価、および大規模類似性検索などのユースケースで、より広範な候補リコールを可能にします。

        詳細については、[大 TopK の使用](https://docs.cloud-uat3.zilliz.com/docs/use-large-topk) を参照してください。

        ## 機能強化\{#enhancements}

        - **リージョン対応のプロジェクトガバナンス** — プロジェクトにデータレジデンシーを管理し、リージョンのデータプレーンアクセスを明確に保つためのリージョン制約が含まれるようになりました。リージョンモデルは、Zilliz Cloud コンソールおよび API の両方に反映されています。

        - **Zilliz CLI の更新** — Zilliz CLI は、このリリースの変更をカバーするよう更新されました。Lakebase、External ボリュームs、リージョン対応の運用、および価格関連の更新が含まれます。詳細については、[Zilliz CLI](https://github.com/zilliztech/zilliz-cli) のエクスペリエンスを参照してください。

    </div>

</Grid>

