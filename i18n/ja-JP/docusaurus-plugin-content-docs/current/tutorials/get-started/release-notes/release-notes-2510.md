---
title: "2025年10月 リリースノート | Cloud"
slug: /release-notes-2510
sidebar_label: "2025年10月"
beta: FALSE
notebook: FALSE
description: "2025年10月 リリースノート | Cloud"
type: origin
token: PmaowiSUaiTa8ckPMYJcqdRYnQg
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート
  - ベクトルデータベースとは
  - vectordb
  - マルチモーダルベクトルデータベース検索
  - Retrieval Augmented Generation

---

import Admonition from '@theme/Admonition';


import Grid from '@site/src/components/Grid';

# 2025年10月リリースノート

<Grid columnSize="2" widthRatios="15,84">

    <div>

        **2025-10-09**

    </div>

    <div>

        ## Milvus v2.6.x パブリックプレビュー\{#milvus-v26x-public-preview}

        今回のリリースにより、Zilliz Cloudで**Milvus v2.6.x クラスター**が**パブリックプレビュー**として利用可能になりました。安定性、効率性、柔軟性を向上させる複数の機能強化と最適化が特徴です。

        - **ダウンタイムなしのフィールド追加** — スキーマの回避策なしに、コレクションに新しいフィールドをオンザフライで追加できます。詳細については、[既存のコレクションへのフィールド追加](./add-fields-to-an-existing-collection)を参照してください。

        - **強化されたフルテキスト検索** — Elasticsearchよりも最大**4倍高速**で、多言語サポートとフレーズマッチ機能が備わっています。詳細については、[多言語アナライザー](./multi-language-analyzers)、[フレーズマッチ](./phrase-match)、および[ユースケースに適したアナライザーの選択](./choose-the-right-analyzer-for-your-use-case)を参照してください。

        - **高速化されたJSONフィルタリング** — **JSONインデックス作成**と**shredding**により、複雑なネストされたメタデータクエリを最大**100倍高速**に実行できます。詳細については、[JSONインデックス作成](./json-indexing)と[JSON Shredding](./json-shredding)を参照してください。

        - **新しい再ランキング機能** — **Boost Ranker**と**Decay Ranker**は、セマンティックな類似性と文脈の関連性を組み合わせることで、検索結果を洗練します。詳細については、[Boost Ranker](./boost-ranker)と[Decay Ranker](./decay-ranker)を参照してください。

        - **INT8ベクターサポート** — 軽量なディープラーニング推論のために量子化されたベクターを保存します。詳細については、[Dense Vector](./use-dense-vector)を参照してください。

        - **MINHASH_LSHインデックス** — MinHashとLocality-Sensitive Hashingを搭載した効率的な大規模な重複排除と類似性チェックを実行します。この機能は**プライベートプレビュー**で利用可能であり、ご興味のある方は[お問い合わせください](https://support.zilliz.com/hc/en-us)。詳細については、[MINHASH_LSH](./minhash-lsh)を参照してください。

        - **部分的なupsert** — レコード全体を書き換えることなく、特定のフィールドを更新します。詳細については、[エンティティのUpsert](./upsert-entities#upsert-in-merge-mode-or-public)を参照してください。

        **パブリックプレビュー**を有効にするには、Zilliz Cloudコンソールの**Cluster Overview**ページで**Try Preview Features**を選択して、クラスターをMilvus v2.6.xにアップグレードできます。アップグレード後も、Milvus v2.5.xの機能は引き続き利用可能です。

        ## 階層型ストレージのアップグレード\{#tiered-storage-upgrade}

        Zilliz Cloudの階層型ストレージがアップグレードされ、パフォーマンスとコスト効率が最適化されました。すべてのExtended Capacityクラスターは新しいアーキテクチャに移行され、以下の主要な改善が提供されます。

        - **スマートデータ管理**: アクセスパターンに基づいて、データがホット（メモリ）、ウォーム（SSD）、コールド（オブジェクトストレージ）の各層間で自動的に移動され、パフォーマンスとコスト効率の両方が向上します。

        - **高いキャッシュヒット率**: 90%を超えるキャッシュヒット率で、ほとんどのクエリが高速な層から提供されます。

        - **コスト削減**: コンピューティングコストが25%削減され、ストレージコストは1GBあたり月額0.30ドルから0.04ドルへと87%削減されます。10TBのデータセットの場合、月額ストレージコストは3,000ドルから400ドルに削減され、高いパフォーマンスを維持します。

        ## クロスリージョンバックアップ\{#cross-region-backup}

        Zilliz Cloudは、Dedicated Clusters向けのクロスリージョンバックアップをサポートし、災害復旧機能を強化しました。この機能は、バックアップを他のリージョンに自動的に複製することで、クラウドリージョンの完全な障害に対する回復力を保証します。

        **主な機能**

        - **自動レプリケーション:** バックアップポリシーを一度設定するだけで、Zilliz Cloudが選択した宛先リージョンへの継続的なレプリケーションを自動的に処理します。

        - **地理的冗長性:** 元のバックアップとは物理的に離れた場所にバックアップコピーを保存することで、リージョン障害から保護します。

        - **迅速な復旧:** クロスリージョンバックアップから新しいクラスターにデータを迅速に復元し、ダウンタイムを最小限に抑え、Recovery Time Objective (RTO) を大幅に改善します。

        詳細については、[他のリージョンへのバックアップ](./backup-to-other-regions)を参照してください。

        ## インデックスビルドレベル\{#index-build-level}

        Milvus 2.6.xと次世代の量子化エンジンにより、検索精度（recall）とデータ容量のトレードオフをアプリケーションのニーズに合わせて微調整できます。Zilliz Cloudの新しいIndex Build Level機能は、インデックス作成時に3つのレベルを提供することで、ベクター検索のパフォーマンスを制御できます。

        - **精度優先 (Precision-first):** 精度が最重要となるミッションクリティカルなアプリケーション向けに、検索精度を最大化します。

        - **バランス (Balanced) (デフォルト):** ほとんどのユースケースに推奨される設定で、recall、パフォーマンス、容量の理想的なバランスを提供します。

        - **容量優先 (Capacity-first):** データ密度に最適化されており、クエリのrecallは低下しますが、予算内でより多くのベクターを保存できます。

        詳細については、[インデックスビルドレベルの調整](./tune-index-build-level)を参照してください。

        ## 強化された機能\{#enhancements}

        - **Analyzer GUI**を使用して、**言語固有のテンプレート**でアナライザーを迅速に設定し、結果を**テスト**できるようになりました。これにより、アナライザーの設定がトークン化にどのように影響し、最終的にフルテキスト検索結果にどのように影響するかをユーザーが理解するのに役立ちます。デモンストレーションについては、[アナライザーの概要](./analyzer-overview#example-use-on-the-zilliz-cloud-console)を参照してください。

        - より明確なエラーメッセージと強化されたエクスペリエンスにより、ユーザーは**接続の問題を診断**し、移行のためのソースデータベースをより簡単に設定できるようになりました。

        - データなしでコレクションをクローンする際に、スキーマを編集し、コレクション設定を変更できるようになりました。

        ## 非推奨のお知らせ\{#deprecation-notice}

        - Pipeline機能は非推奨となり、現在オフラインです。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="24,75">

    <div>

        **2025-09-20**

    </div>

    <div>

        ## Azure North Europe (Ireland) のサポート\{#support-azure-north-europe-ireland}

    </div>

</Grid>

