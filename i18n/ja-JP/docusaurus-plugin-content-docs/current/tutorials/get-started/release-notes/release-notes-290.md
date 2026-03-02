---
title: "リリースノート (2024年6月18日) | Cloud"
slug: /release-notes-290
sidebar_label: "2024年6月18日"
beta: FALSE
notebook: FALSE
description: "今回のリリースでは、Zilliz CloudはMilvus 2.4を基盤とした様々な新機能を発表しました。これには、疎ベクトルサポート、強化されたマルチベクトルおよびハイブリッド検索、高速クエリのための転置インデックスとファジーマッチング、ドキュメントレベルのリコールを実現するグループ化検索が含まれます。また、検索効率を向上させるためにFloat16およびBFloat16データ型も導入されました。さらに、Pipelines機能は、データ取り込みおよび検索リクエストごとにトークン使用統計を追跡し、パフォーマンス監視を効率化します。詳細な統計は請求書ページで確認できます。 | Cloud"
type: origin
token: GanXwLnJkiymKVkNPhecdi9MnGf
sidebar_position: 17
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート
  - Zilliz Cloud
  - Milvusとは
  - Milvusデータベース
  - Milvus Lite

---

import Admonition from '@theme/Admonition';


# リリースノート (2024年6月18日)

今回のリリースでは、Zilliz CloudはMilvus 2.4をベースとした新しい機能群を発表しました。これには、疎ベクトルサポート、強化されたマルチベクトルおよびハイブリッド検索、高速クエリのための転置インデックスとファジーマッチング、ドキュメントレベルのリコールを実現するグループ化検索が含まれます。また、検索効率を向上させるためにFloat16およびBFloat16データ型も導入されました。さらに、Pipelines機能は、データ取り込みおよび検索リクエストごとにトークン使用量統計を追跡し、パフォーマンス監視を効率化します。詳細な統計は請求書ページで確認できます。

### Milvus互換性{#milvus-compatibility}

このリリースは**Milvus 2.3.x**と互換性があります。

クラスターをBETAにアップグレードする場合、アップグレード後に**Milvus 2.4.x**の機能が利用可能になります。

## Zilliz Cloudで利用可能なMilvus 2.4.xの新機能{#milvus-24x-new-features-available-on-zilliz-cloud}

Milvus 2.4は、RAGおよびマルチモーダルデータ検索のための多くの効率的な機能を提供します。これらの新機能を試したい場合は、クラスターをBETAに更新できます。

<Admonition type="info" icon="📘" title="Notes">

<p>Milvus 2.4は安定版に達していません。本番環境でMilvus 2.4の機能を採用する際には注意してください。</p>

</Admonition>

### 疎ベクトル{#sparse-vector}

疎ベクトルは、非ゼロの要素がごくわずかであるにもかかわらず、密ベクトルよりも桁違いに高い次元を持つ傾向がある点で異なります。この機能は、用語ベースの性質により解釈性が高く、特定のドメインでより効果的である可能性があります。SPLADEv2/BGE-M3などの学習済み疎モデルは、一般的な初期段階のランキングタスクに有用であることが証明されています。この新機能の主なユースケースは、SPLADEv2/BGE-M3などのニューラルモデルやBM25アルゴリズムなどの統計モデルによって生成された疎ベクトルに対する効率的な近似セマンティック最近傍検索を可能にすることです。Zilliz Cloudは、疎ベクトルの効率的かつ高性能なストレージ、インデックス作成、および検索（MIPS、最大内積検索）をサポートするようになりました。

詳細については、[疎ベクトル](./use-sparse-vector)ガイドと[hello_sparse.py](https://github.com/milvus-io/pymilvus/blob/2.4/examples/hello_sparse.py)のサンプルコードを参照してください。*サンプルコード内の接続詳細をZilliz Cloudクラスターの認証情報で更新してください。*

### マルチ埋め込みとハイブリッド検索{#multi-embedding-and-hybrid-search}

マルチベクトルサポートは、マルチモデルデータ処理や密ベクトルと疎ベクトルの組み合わせを必要とするアプリケーションの基礎となります。マルチベクトルサポートにより、次のことが可能になります。

- 複数のモデルから生成された非構造化テキスト、画像、またはオーディオサンプルのベクトル埋め込みを保存します。

- 各エンティティに複数のベクトルを持つコレクションに対してANN検索を実行します。

- 異なる埋め込みモデルに重みを割り当てることで、検索戦略をカスタマイズします。

- さまざまな埋め込みモデルを試して、最適なモデルの組み合わせを見つけます。

マルチベクトルサポートにより、FLOAT_VECTORやSPARSE_FLOAT_VECTORなど、異なるタイプの複数のベクトルフィールドをコレクションに保存、インデックス作成、および再ランキング戦略を適用できます。現在、2つの再ランキング戦略が利用可能です。**Reciprocal Rank Fusion (RRF)**と**Average Weighted Scoring**です。どちらの戦略も、異なるベクトルフィールドからの検索結果を統合された結果セットに結合します。最初の戦略は、さまざまなベクトルフィールドからの検索結果に一貫して表示されるエンティティを優先し、もう一方の戦略は、各ベクトルフィールドからの検索結果に重みを割り当てて、最終結果セットでの重要性を決定します。

詳細については、[基本的なANN検索](./single-vector-search)と[ハイブリッド検索](./hybrid-search)ガイド、および[hybrid_search.py](https://github.com/milvus-io/pymilvus/blob/2.4/examples/hybrid_search.py)のサンプルコードを参照してください。*サンプルコード内の接続詳細をZilliz Cloudクラスターの認証情報で更新してください。*

### 転置インデックスとファジーマッチ{#inverted-index-and-fuzzy-match}

以前のMilvusリリースでは、スカラーフィールドのインデックス作成にメモリベースの二分探索インデックスとMarisa Trieインデックスが使用されていました。しかし、これらの方法はメモリを大量に消費しました。Zilliz Cloudの最新リリースでは、これらのメカニズムを最適化するためにオートインデックスが採用されており、すべての数値および文字列データ型に適用できます。この新しいインデックスはスカラークエリのパフォーマンスを劇的に向上させ、文字列内のキーワードのクエリを10倍に削減します。さらに、転置インデックスは、データ圧縮と内部インデックス構造のメモリマップストレージ（MMap）メカニズムにおける追加の最適化により、メモリ消費量が少なくなります。

このリリースでは、プレフィックス、インフィックス、およびサフィックスを使用したスカラーフィルタリングでのファジーマッチもサポートしています。

詳細については、[バイナリベクトル](./use-binary-vector)、[インデックススカラーフィールド](./index-scalar-fields)、および[演算子の使用](./basic-filtering-operators#example-2-using-like-for-pattern-matching)[`like`](./basic-filtering-operators#example-2-using-like-for-pattern-matching)ガイド、および[inverted_index_example.py](https://github.com/milvus-io/pymilvus/blob/2.4/examples/inverted_index_example.py)と[fuzzy_match.py](https://github.com/milvus-io/pymilvus/blob/2.4/examples/fuzzy_match.py)のサンプルコードを参照してください。*サンプルコード内の接続詳細をZilliz Cloudクラスターの認証情報で更新し、代わりにAUTOINDEXを使用してください。*

### グループ化検索{#grouping-search}

特定のスカラーフィールドの値で検索結果を集計できるようになりました。これにより、RAGアプリケーションはドキュメントレベルのリコールを実装できます。ドキュメントのコレクションを考えてみましょう。各ドキュメントはさまざまなパッセージに分割されます。各パッセージは1つのベクトル埋め込みで表され、1つのドキュメントに属します。散らばったパッセージではなく、最も関連性の高いドキュメントを見つけるには、**search()**操作に**group_by_field**引数を含めて、ドキュメントIDで結果をグループ化できます。

詳細については、[グループ化検索](./grouping-search)ガイドと[example_group_by.py](https://github.com/milvus-io/pymilvus/blob/2.4/examples/example_group_by.py)のサンプルコードを参照してください。*サンプルコード内の接続詳細をZilliz Cloudクラスターの認証情報で更新してください。*

### Float16およびBFloat- ベクトルデータ型{#float16-and-bfloat-vector-datatype}

機械学習やニューラルネットワークでは、Float16やBFloat-などの半精度データ型がよく使用されます。これらのデータ型はクエリ効率を向上させ、メモリ使用量を削減できますが、精度が低下するというトレードオフがあります。このリリースにより、Zilliz Cloudはベクトルフィールドでこれらのデータ型をサポートするようになりました。

詳細については、[検索と再ランキング](./search-query-get)と、[float16_example.py](https://github.com/milvus-io/pymilvus/blob/2.4/examples/datatypes/float16_example.py)および[bfloat16_example.py](https://github.com/milvus-io/pymilvus/blob/2.4/examples/datatypes/bfloat16_example.py)のサンプルコードを参照してください。*サンプルコード内の接続詳細をZilliz Cloudクラスターの認証情報で更新してください。*

### 洗練されたMilvusClientインターフェース{#refined-milvusclient-interfaces}

MilvusClientは、ORMモジュールに代わる使いやすいインターフェースです。サーバーとのやり取りを簡素化するために、純粋な関数型アプローチを採用しています。接続プールを維持する代わりに、各MilvusClientはサーバーへのgRPC接続を確立します。MilvusClientモジュールは、ORMモジュールのほとんどの機能を実装しています。MilvusClientモジュールの詳細については、[pymilvus](https://github.com/milvus-io/pymilvus)と[リファレンスドキュメント](/reference/python)を参照してください。

## パイプライン{#pipelines}

Zilliz Cloudは、パイプラインリクエストのトークン使用量を監視するようになり、詳細は請求書ページと各API応答で確認できます。ただし、この機能が一般提供されるまでは課金されません。

画像埋め込みモデルは、より幅広い要件を満たすために、以前の`clip-vit-base-patch16`から`clip-vit-base-patch32`にアップグレードされました。さらに、多言語テキスト埋め込みのサポートも近日中に実装される予定です。

### 強化点{#enhancements}

このリリースには、一連の機能強化も含まれています。

- 専用クラスターをセルフサービスで256 CUまでスケールできるようになりました。さらに大規模なクラスターについては、お問い合わせください。

