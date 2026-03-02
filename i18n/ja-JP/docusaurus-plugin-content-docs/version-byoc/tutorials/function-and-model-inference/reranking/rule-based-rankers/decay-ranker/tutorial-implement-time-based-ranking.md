---
title: "チュートリアル: 時間ベースのランキングを実装する | BYOC"
slug: /tutorial-implement-time-based-ranking
sidebar_label: "チュートリアル: 時間ベースのランキングを実装する"
beta: FALSE
notebook: FALSE
description: "多くの検索アプリケーションでは、コンテンツの鮮度はその関連性と同じくらい重要です。ニュース記事、製品リスト、ソーシャルメディアの投稿、研究論文はすべて、セマンティックな関連性と新しさを両立させるランキングシステムから恩恵を受けます。このチュートリアルでは、Zilliz Cloudでディケイランカーを使用して時間ベースのランキングを実装する方法を説明します。 | BYOC"
type: origin
token: Dj2NwrlqTiYlmDkwfAbcJNWSntd
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - データ
  - 検索結果の再ランキング
  - 結果の再ランキング
  - ディケイ
  - ディケイランカー
  - チュートリアル
  - 時間ベースのランキング
  - 非構造化データ
  - ベクトルデータベース
  - IVF
  - knn

---

import Admonition from '@theme/Admonition';


# チュートリアル: 時間ベースのランキングを実装する

多くの検索アプリケーションでは、コンテンツの鮮度はその関連性と同じくらい重要です。ニュース記事、製品リスト、ソーシャルメディアの投稿、研究論文はすべて、意味的な関連性と新しさを両立させるランキングシステムから恩恵を受けます。このチュートリアルでは、減衰ランカーを使用してZilliz Cloudで時間ベースのランキングを実装する方法を説明します。

## 減衰ランカーを理解する{#understand-decay-rankers}

減衰ランカーを使用すると、参照点に対する数値（タイムスタンプなど）に基づいてドキュメントをブーストまたはペナルティを課すことができます。時間ベースのランキングの場合、これは、意味的な関連性が類似している場合でも、新しいドキュメントが古いドキュメントよりも高いスコアを受け取ることを意味します。

Zilliz Cloudは、3種類の減衰ランカーをサポートしています。

- **ガウス** (`gauss`): 滑らかで緩やかな減衰を提供するベル型の曲線

- **指数** (`exp`): 最近のコンテンツを強く強調するために、より急な初期の落ち込みを作成します

- **線形** (`linear`): 予測可能で理解しやすい直線的な減衰

各ランカーには、さまざまなユースケースに適した異なる特性があります。詳細については、[減衰ランカーの概要](./decay-ranker-oveview)を参照してください。

## 時間認識型検索システムを構築する{#build-a-time-aware-search-system}

関連性と時間の両方に基づいてコンテンツを効果的にランク付けする方法を示すニュース記事検索システムを作成します。実装から始めましょう。

```python
import datetime
import matplotlib.pyplot as plt
import numpy as np
from pymilvus import (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
    AnnSearchRequest,
)

# Create connection to Milvus
milvus_client = MilvusClient("YOUR_CLUSTER_ENDPOINT")

# Define collection name
collection_name = "news_articles_tutorial"

# Clean up any existing collection with the same name
milvus_client.drop_collection(collection_name)
```

## ステップ1: スキーマの設計{#step-1-design-the-schema}

時間ベースの検索では、コンテンツとともに公開タイムスタンプを保存する必要があります。

```python
# Create schema with fields for content and temporal information
schema = milvus_client.create_schema(enable_dynamic_field=False, auto_id=True)
schema.add_field("id", DataType.INT64, is_primary=True)
schema.add_field("headline", DataType.VARCHAR, max_length=200, enable_analyzer=True)
schema.add_field("content", DataType.VARCHAR, max_length=2000, enable_analyzer=True)
schema.add_field("dense", DataType.FLOAT_VECTOR, dim=1024)  # For dense embeddings
schema.add_field("sparse_vector", DataType.SPARSE_FLOAT_VECTOR)  # For sparse (BM25) search
schema.add_field("publish_date", DataType.INT64)  # Timestamp for decay ranking
```

## ステップ2: 埋め込み関数の設定{#step-2-set-up-embedding-functions}

ここでは、密（セマンティック）と疎（キーワード）の両方の埋め込み関数を設定します。

```python
# Create embedding function for semantic search
text_embedding_function = Function(
    name="siliconflow_embedding",
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=["content"],
    output_field_names=["dense"],
    params={
        "provider": "siliconflow",
        "model_name": "BAAI/bge-large-en-v1.5",
        "credential": "your-api-key"
    }
)
schema.add_function(text_embedding_function)

# Create BM25 function for keyword search
bm25_function = Function(
    name="bm25",
    input_field_names=["content"],
    output_field_names=["sparse_vector"],
    function_type=FunctionType.BM25,
)
schema.add_function(bm25_function)
```

## ステップ3：インデックスパラメータの設定{#step-3-configure-index-parameters}

高速なベクトル検索のために、適切なインデックスパラメータを設定しましょう。

```python
# Set up indexes for fast search
index_params = milvus_client.prepare_index_params()

# Dense vector index
index_params.add_index(field_name="dense", index_type="AUTOINDEX", metric_type="L2")

# Sparse vector index
index_params.add_index(
    field_name="sparse_vector",
    index_name="sparse_inverted_index",
    index_type="AUTOINDEX",
    metric_type="BM25",
)

# Create the collection with our schema and indexes
milvus_client.create_collection(
    collection_name,
    schema=schema,
    index_params=index_params,
    consistency_level="Strong"
)
```

## ステップ4：サンプルデータを準備する{#step-4-prepare-sample-data}

このチュートリアルでは、異なる発行日のニュース記事のセットを作成します。ここでは、減衰ランキング効果を明確に示すために、ほぼ同じ内容で日付が異なる記事のペアを含めていることに注目してください。

```python
# Get current time
current_time = int(datetime.datetime.now().timestamp())
current_date = datetime.datetime.fromtimestamp(current_time)
print(f"Current time: {current_date.strftime('%Y-%m-%d %H:%M:%S')}")

# Sample news articles spanning different dates
articles = [
    {
        "headline": "AI Breakthrough Enables Medical Diagnosis Advancement",
        "content": "Researchers announced a major breakthrough in AI-based medical diagnostics, enabling faster and more accurate detection of rare diseases.",
        "publish_date": int((current_date - datetime.timedelta(days=120)).timestamp())  # ~4 months ago
    },
    {
        "headline": "Tech Giants Compete in New AI Race",
        "content": "Major technology companies are investing billions in a new race to develop the most advanced artificial intelligence systems.",
        "publish_date": int((current_date - datetime.timedelta(days=60)).timestamp())  # ~2 months ago
    },
    {
        "headline": "AI Ethics Guidelines Released by International Body",
        "content": "A consortium of international organizations has released new guidelines addressing ethical concerns in artificial intelligence development and deployment.",
        "publish_date": int((current_date - datetime.timedelta(days=30)).timestamp())  # 1 month ago
    },
    {
        "headline": "Latest Deep Learning Models Show Remarkable Progress",
        "content": "The newest generation of deep learning models demonstrates unprecedented capabilities in language understanding and generation.",
        "publish_date": int((current_date - datetime.timedelta(days=15)).timestamp())  # 15 days ago
    },
    # Articles with identical content but different dates
    {
        "headline": "AI Research Advancements Published in January",
        "content": "Breakthrough research in artificial intelligence shows remarkable advancements in multiple domains.",
        "publish_date": int((current_date - datetime.timedelta(days=90)).timestamp())  # ~3 months ago
    },
    {
        "headline": "New AI Research Results Released This Week",
        "content": "Breakthrough research in artificial intelligence shows remarkable advancements in multiple domains.",
        "publish_date": int((current_date - datetime.timedelta(days=5)).timestamp())  # Very recent - 5 days ago
    },
    {
        "headline": "AI Development Updates Released Yesterday",
        "content": "Recent developments in artificial intelligence research are showing promising results across various applications.",
        "publish_date": int((current_date - datetime.timedelta(days=1)).timestamp())  # Just yesterday
    },
]

# Insert articles into the collection
milvus_client.insert(collection_name, articles)
print(f"Inserted {len(articles)} articles into the collection")
```

## Step 5: さまざまなディケイランカーを設定する{#step-5-configure-different-decay-rankers}

次に、3つの異なるディケイランカーを作成し、それぞれの違いを強調するために異なるパラメータを設定します。

```python
# Use current time as reference point
print(f"Using current time as reference point")

# Create a Gaussian decay ranker
gaussian_ranker = Function(
    name="time_decay_gaussian",
    input_field_names=["publish_date"],
    function_type=FunctionType.RERANK,
    params={
        "reranker": "decay",
        "function": "gauss",           # Gaussian/bell curve decay
        "origin": current_time,        # Current time as reference point
        "offset": 7 * 24 * 60 * 60,    # One week (full relevance)
        "decay": 0.5,                  # Articles from two weeks ago have half relevance 
        "scale": 14 * 24 * 60 * 60     # Two weeks scale parameter
    }
)

# Create an exponential decay ranker with different parameters
exponential_ranker = Function(
    name="time_decay_exponential",
    input_field_names=["publish_date"],
    function_type=FunctionType.RERANK,
    params={
        "reranker": "decay",
        "function": "exp",             # Exponential decay
        "origin": current_time,        # Current time as reference point
        "offset": 3 * 24 * 60 * 60,    # Shorter offset (3 days vs 7 days)
        "decay": 0.3,                  # Steeper decay (0.3 vs 0.5) 
        "scale": 10 * 24 * 60 * 60     # Different scale (10 days vs 14 days)
    }
)

# Create a linear decay ranker
linear_ranker = Function(
    name="time_decay_linear",
    input_field_names=["publish_date"],
    function_type=FunctionType.RERANK,
    params={
        "reranker": "decay",
        "function": "linear",          # Linear decay
        "origin": current_time,        # Current time as reference point
        "offset": 7 * 24 * 60 * 60,    # One week (full relevance)
        "decay": 0.5,                  # Articles from two weeks ago have half relevance
        "scale": 14 * 24 * 60 * 60     # Two weeks scale parameter
    }
)
```

上記のコードでは、以下を設定しています。

- `reranker`: 時間ベースの減衰関数には`decay`を設定します。

- `function`: 減衰関数のタイプ（gauss、exp、またはlinear）

- `origin`: 参照点（通常は現在時刻）

- `offset`: ドキュメントが完全な関連性を維持する期間

- `scale`: オフセットを超えて関連性が低下する速度を制御します。

- `decay`: offset+scaleでの減衰係数（例：0.5は半分の関連性を意味します）

異なる動作のためにこれらの関数をどのように調整できるかを示すために、異なるパラメータで指数ランク付けを設定したことに注目してください。

## ステップ6：減衰ランク付けを視覚化する{#step-6-visualize-the-decay-rankers}

検索を実行する前に、これらの異なる設定の減衰ランク付けがどのように動作するかを視覚的に比較してみましょう。

```python
# Visualize the decay functions with different parameters
days = np.linspace(0, 90, 100)
# Gaussian: offset=7, scale=14, decay=0.5
gaussian_values = [1.0 if d <= 7 else (0.5 ** ((d - 7) / 14)) for d in days]
# Exponential: offset=3, scale=10, decay=0.3
exponential_values = [1.0 if d <= 3 else (0.3 ** ((d - 3) / 10)) for d in days]
# Linear: offset=7, scale=14, decay=0.5
linear_values = [1.0 if d <= 7 else max(0, 1.0 - ((d - 7) / 14) * 0.5) for d in days]

plt.figure(figsize=(10, 6))
plt.plot(days, gaussian_values, label='Gaussian (offset=7, scale=14, decay=0.5)')
plt.plot(days, exponential_values, label='Exponential (offset=3, scale=10, decay=0.3)')
plt.plot(days, linear_values, label='Linear (offset=7, scale=14, decay=0.5)')
plt.axhline(y=0.5, color='gray', linestyle='--', alpha=0.5, label='Half relevance')
plt.xlabel('Days ago')
plt.ylabel('Relevance factor')
plt.title('Decay Functions Comparison')
plt.legend()
plt.grid(True)
plt.savefig('decay_functions.png')
plt.close()

# Print numerical representation
print("\n=== TIME DECAY EFFECT VISUALIZATION ===")
print("Days ago | Gaussian | Exponential | Linear")
print("-----------------------------------------")
for days in [0, 3, 7, 10, 14, 21, 30, 60, 90]:
    # Calculate decay factors based on the parameters in our rankers
    gaussian_decay = 1.0 if days <= 7 else (0.5 ** ((days - 7) / 14))
    exponential_decay = 1.0 if days <= 3 else (0.3 ** ((days - 3) / 10))
    linear_decay = 1.0 if days <= 7 else max(0, 1.0 - ((days - 7) / 14) * 0.5)
    
    print(f"{days:2d} days | {gaussian_decay:.4f}   | {exponential_decay:.4f}     | {linear_decay:.4f}")
```

Zilliz Cloud は、ベクトルデータベースのフルマネージドサービスです。Zilliz Cloud を使用すると、ベクトル検索アプリケーションを簡単に構築できます。

Zilliz Cloud は、オープンソースのベクトルデータベースである Milvus をベースに構築されています。Zilliz Cloud は、Milvus のすべての機能と、クラウドネイティブなスケーラビリティ、信頼性、セキュリティを提供します。

Zilliz Cloud は、以下のような様々なユースケースで利用できます。

- 類似画像検索
- レコメンデーションシステム
- 自然言語処理
- 異常検知
- ゲノム解析

Zilliz Cloud の詳細については、[Zilliz Cloud のドキュメント](https://zilliz.com/cloud/doc) を参照してください。

## Zilliz Cloud の機能

Zilliz Cloud は、以下のような主要な機能を提供します。

- **フルマネージドサービス**: Zilliz Cloud は、ベクトルデータベースのフルマネージドサービスです。インフラストラクチャの管理やメンテナンスについて心配する必要はありません。
- **スケーラビリティ**: Zilliz Cloud は、クラウドネイティブなスケーラビリティを提供します。必要に応じて、データベースを簡単にスケールアップまたはスケールダウンできます。
- **信頼性**: Zilliz Cloud は、高い信頼性を提供します。データは複数のアベイラビリティゾーンに複製され、自動的にバックアップされます。
- **セキュリティ**: Zilliz Cloud は、強力なセキュリティ機能を提供します。データは暗号化され、アクセス制御が適用されます。
- **Milvus 互換**: Zilliz Cloud は、オープンソースのベクトルデータベースである Milvus と互換性があります。既存の Milvus アプリケーションを Zilliz Cloud に簡単に移行できます。
- **RESTful API**: Zilliz Cloud は、RESTful API を提供します。任意のプログラミング言語からデータベースにアクセスできます。
- **SDK**: Zilliz Cloud は、Python、Java、Go などのプログラミング言語用の SDK を提供します。

## Zilliz Cloud のアーキテクチャ

Zilliz Cloud は、以下のようなコンポーネントで構成されています。

- **Milvus**: Zilliz Cloud のコアとなるベクトルデータベースです。
- **Kubernetes**: Milvus をデプロイおよび管理するためのコンテナオーケストレーションプラットフォームです。
- **オブジェクトストレージ**: ベクトルデータを保存するためのストレージサービスです。
- **メッセージキュー**: Milvus のコンポーネント間でメッセージを送信するためのサービスです。
- **ロードバランサー**: クライアントからのリクエストを Milvus のインスタンスに分散するためのサービスです。

## Zilliz Cloud の料金

Zilliz Cloud の料金は、使用量に基づいて課金されます。詳細については、[Zilliz Cloud の料金ページ](https://zilliz.com/cloud/pricing) を参照してください。

## Zilliz Cloud の始め方

Zilliz Cloud を始めるには、以下の手順に従います。

1. Zilliz Cloud のアカウントを作成します。
2. Zilliz Cloud のコンソールにログインします。
3. 新しいクラスターを作成します。
4. クラスターにデータをインポートします。
5. ベクトル検索アプリケーションを構築します。

詳細については、[Zilliz Cloud のクイックスタートガイド](https://zilliz.com/cloud/doc/quickstart) を参照してください。

```python
=== TIME DECAY EFFECT VISUALIZATION ===
Days ago | Gaussian | Exponential | Linear
-----------------------------------------
 0 days | 1.0000   | 1.0000     | 1.0000
 3 days | 1.0000   | 1.0000     | 1.0000
 7 days | 1.0000   | 0.6178     | 1.0000
10 days | 0.8620   | 0.4305     | 0.8929
14 days | 0.7071   | 0.2660     | 0.7500
21 days | 0.5000   | 0.1145     | 0.5000
30 days | 0.3202   | 0.0387     | 0.1786
60 days | 0.0725   | 0.0010     | 0.0000
90 days | 0.0164   | 0.0000     | 0.0000
```

## ステップ7: 結果表示のためのヘルパー関数{#step-7-helper-function-for-results-display}

```python
# Helper function to format search results with dates and scores
def print_search_results(results, title):
    print(f"\n=== {title} ===")
    for i, hit in enumerate(results[0]):
        publish_date = datetime.datetime.fromtimestamp(hit.get('publish_date'))
        days_from_now = (current_time - hit.get('publish_date')) / (24 * 60 * 60)
        
        print(f"{i+1}. {hit.get('headline')}")
        print(f"   Published: {publish_date.strftime('%Y-%m-%d')} ({int(days_from_now)} days ago)")
        print(f"   Score: {hit.score:.4f}")
        print()
```

## ステップ8: 標準検索と減衰ベース検索の比較{#step-8-compare-standard-vs-decay-based-search}

それでは、検索クエリを実行し、減衰ランキングの有無による結果を比較してみましょう。

```python
# Define our search query
query = "artificial intelligence advancements"

# 1. Search without decay ranking (purely based on semantic relevance)
standard_results = milvus_client.search(
    collection_name,
    data=[query],
    anns_field="dense",
    limit=7,  # Get all our articles
    output_fields=["headline", "content", "publish_date"],
    consistency_level="Strong"
)
print_search_results(standard_results, "SEARCH RESULTS WITHOUT DECAY RANKING")

# Store original scores for later comparison
original_scores = {}
for hit in standard_results[0]:
    original_scores[hit.get('headline')] = hit.score

# 2. Search with each decay function
# Gaussian decay
gaussian_results = milvus_client.search(
    collection_name,
    data=[query],
    anns_field="dense",
    limit=7,
    output_fields=["headline", "content", "publish_date"],
    ranker=gaussian_ranker,
    consistency_level="Strong"
)
print_search_results(gaussian_results, "SEARCH RESULTS WITH GAUSSIAN DECAY RANKING")

# Exponential decay
exponential_results = milvus_client.search(
    collection_name,
    data=[query],
    anns_field="dense",
    limit=7,
    output_fields=["headline", "content", "publish_date"],
    ranker=exponential_ranker,
    consistency_level="Strong"
)
print_search_results(exponential_results, "SEARCH RESULTS WITH EXPONENTIAL DECAY RANKING")

# Linear decay
linear_results = milvus_client.search(
    collection_name,
    data=[query],
    anns_field="dense",
    limit=7,
    output_fields=["headline", "content", "publish_date"],
    ranker=linear_ranker,
    consistency_level="Strong"
)
print_search_results(linear_results, "SEARCH RESULTS WITH LINEAR DECAY RANKING")
```

Zilliz Cloud は、ベクトルデータベースのフルマネージドサービスです。Zilliz Cloud を使用すると、ベクトル検索アプリケーションを簡単に構築できます。

Zilliz Cloud は、オープンソースのベクトルデータベースである Milvus をベースに構築されています。Milvus は、大規模なベクトル検索アプリケーション向けに設計された、高性能でスケーラブルなベクトルデータベースです。

Zilliz Cloud は、Milvus のすべての機能を提供し、さらに多くの機能を提供します。Zilliz Cloud は、以下のような機能を提供します。

- フルマネージドサービス: Zilliz Cloud は、データベースの管理、スケーリング、バックアップ、リカバリをすべて処理します。
- 高可用性: Zilliz Cloud は、高可用性アーキテクチャで設計されており、データベースが常に利用可能であることを保証します。
- スケーラビリティ: Zilliz Cloud は、必要に応じてデータベースを簡単にスケーリングできます。
- セキュリティ: Zilliz Cloud は、データのセキュリティを確保するために、さまざまなセキュリティ機能を提供します。
- 監視とアラート: Zilliz Cloud は、データベースのパフォーマンスを監視し、問題が発生したときにアラートを送信します。

Zilliz Cloud は、以下のようなさまざまなアプリケーションで使用できます。

- 類似画像検索
- 類似動画検索
- 類似音声検索
- 類似テキスト検索
- レコメンデーションシステム
- 不正検出
- 異常検出

Zilliz Cloud は、ベクトル検索アプリケーションを構築するための強力なプラットフォームです。

## Zilliz Cloud の機能 {#zilliz-cloud-features}

Zilliz Cloud は、ベクトル検索アプリケーションを構築するためのさまざまな機能を提供します。

### スケーラブルなベクトルデータベース {#scalable-vector-database}

Zilliz Cloud は、オープンソースのベクトルデータベースである Milvus をベースに構築されています。Milvus は、大規模なベクトル検索アプリケーション向けに設計された、高性能でスケーラブルなベクトルデータベースです。

Zilliz Cloud は、Milvus のすべての機能を提供し、さらに多くの機能を提供します。Zilliz Cloud は、以下のような機能を提供します。

- フルマネージドサービス: Zilliz Cloud は、データベースの管理、スケーリング、バックアップ、リカバリをすべて処理します。
- 高可用性: Zilliz Cloud は、高可用性アーキテクチャで設計されており、データベースが常に利用可能であることを保証します。
- スケーラビリティ: Zilliz Cloud は、必要に応じてデータベースを簡単にスケーリングできます。
- セキュリティ: Zilliz Cloud は、データのセキュリティを確保するために、さまざまなセキュリティ機能を提供します。
- 監視とアラート: Zilliz Cloud は、データベースのパフォーマンスを監視し、問題が発生したときにアラートを送信します。

### 開発者ツール {#developer-tools}

Zilliz Cloud は、ベクトル検索アプリケーションを構築するためのさまざまな開発者ツールを提供します。

- SDK: Zilliz Cloud は、Python、Java、Go、Node.js などのさまざまな言語の SDK を提供します。
- RESTful API: Zilliz Cloud は、RESTful API を提供しており、任意の言語からデータベースにアクセスできます。
- CLI: Zilliz Cloud は、データベースを管理するための CLI ツールを提供します。
- コンソール: Zilliz Cloud は、データベースを管理するための Web ベースのコンソールを提供します。

### セキュリティとコンプライアンス {#security-and-compliance}

Zilliz Cloud は、データのセキュリティとコンプライアンスを確保するために、さまざまなセキュリティ機能を提供します。

- 認証と認可: Zilliz Cloud は、認証と認可をサポートしており、データベースへのアクセスを制御できます。
- 暗号化: Zilliz Cloud は、保存中および転送中のデータを暗号化します。
- 監査ログ: Zilliz Cloud は、データベースへのすべてのアクセスを監査ログに記録します。
- コンプライアンス: Zilliz Cloud は、GDPR、HIPAA、SOC 2 などのさまざまなコンプライアンス標準に準拠しています。

## Zilliz Cloud の料金 {#zilliz-cloud-pricing}

Zilliz Cloud は、従量課金制の料金モデルを提供しています。使用したリソースに対してのみ料金を支払います。

Zilliz Cloud の料金は、以下の要素によって決まります。

- ストレージ: データベースに保存するデータの量
- コンピューティング: データベースが実行するクエリの数と複雑さ
- ネットワーク: データベースとの間で転送されるデータの量

Zilliz Cloud の料金の詳細については、[Zilliz Cloud の料金ページ](https://zilliz.com/cloud/pricing)を参照してください。

## Zilliz Cloud の開始方法 {#get-started-with-zilliz-cloud}

Zilliz Cloud の開始方法は簡単です。

1. Zilliz Cloud アカウントを作成します。
2. Zilliz Cloud コンソールにログインします。
3. 新しいクラスターを作成します。
4. データをクラスターにインポートします。
5. ベクトル検索アプリケーションを構築します。

Zilliz Cloud の開始方法の詳細については、[Zilliz Cloud のドキュメント](https://zilliz.com/cloud/docs)を参照してください。

## Zilliz Cloud のサポート {#zilliz-cloud-support}

Zilliz Cloud は、さまざまなサポートオプションを提供しています。

- ドキュメント: Zilliz Cloud は、詳細なドキュメントを提供しており、データベースの使用方法を学ぶことができます。
- フォーラム: Zilliz Cloud は、コミュニティフォーラムを提供しており、他のユーザーと質問したり、回答したりできます。
- サポートチケット: Zilliz Cloud は、サポートチケットシステムを提供しており、Zilliz Cloud サポートチームに直接連絡できます。

Zilliz Cloud のサポートの詳細については、[Zilliz Cloud のサポートページ](https://zilliz.com/cloud/support)を参照してください。

```python
=== SEARCH RESULTS WITHOUT DECAY RANKING ===
1. AI Development Updates Released Yesterday
   Published: 2025-05-14 (1 days ago)
   Score: 0.3670

2. AI Research Advancements Published in January
   Published: 2025-02-14 (90 days ago)
   Score: 0.4315

3. New AI Research Results Released This Week
   Published: 2025-05-10 (5 days ago)
   Score: 0.4316

4. Tech Giants Compete in New AI Race
   Published: 2025-03-16 (60 days ago)
   Score: 0.6671

5. Latest Deep Learning Models Show Remarkable Progress
   Published: 2025-04-30 (15 days ago)
   Score: 0.6674

6. AI Breakthrough Enables Medical Diagnosis Advancement
   Published: 2025-01-15 (120 days ago)
   Score: 0.7279

7. AI Ethics Guidelines Released by International Body
   Published: 2025-04-15 (30 days ago)
   Score: 0.7661

=== SEARCH RESULTS WITH GAUSSIAN DECAY RANKING ===
1. Latest Deep Learning Models Show Remarkable Progress
   Published: 2025-04-30 (15 days ago)
   Score: 0.5322

2. New AI Research Results Released This Week
   Published: 2025-05-10 (5 days ago)
   Score: 0.4316

3. AI Development Updates Released Yesterday
   Published: 2025-05-14 (1 days ago)
   Score: 0.3670

4. AI Ethics Guidelines Released by International Body
   Published: 2025-04-15 (30 days ago)
   Score: 0.1180

5. Tech Giants Compete in New AI Race
   Published: 2025-03-16 (60 days ago)
   Score: 0.0000

6. AI Research Advancements Published in January
   Published: 2025-02-14 (90 days ago)
   Score: 0.0000

7. AI Breakthrough Enables Medical Diagnosis Advancement
   Published: 2025-01-15 (120 days ago)
   Score: 0.0000

=== SEARCH RESULTS WITH EXPONENTIAL DECAY RANKING ===
1. AI Development Updates Released Yesterday
   Published: 2025-05-14 (1 days ago)
   Score: 0.3670

2. New AI Research Results Released This Week
   Published: 2025-05-10 (5 days ago)
   Score: 0.3392

3. Latest Deep Learning Models Show Remarkable Progress
   Published: 2025-04-30 (15 days ago)
   Score: 0.1574

4. AI Ethics Guidelines Released by International Body
   Published: 2025-04-15 (30 days ago)
   Score: 0.0297

5. Tech Giants Compete in New AI Race
   Published: 2025-03-16 (60 days ago)
   Score: 0.0007

6. AI Research Advancements Published in January
   Published: 2025-02-14 (90 days ago)
   Score: 0.0000

7. AI Breakthrough Enables Medical Diagnosis Advancement
   Published: 2025-01-15 (120 days ago)
   Score: 0.0000

=== SEARCH RESULTS WITH LINEAR DECAY RANKING ===
1. Latest Deep Learning Models Show Remarkable Progress
   Published: 2025-04-30 (15 days ago)
   Score: 0.4767

2. New AI Research Results Released This Week
   Published: 2025-05-10 (5 days ago)
   Score: 0.4316

3. AI Ethics Guidelines Released by International Body
   Published: 2025-04-15 (30 days ago)
   Score: 0.3831

4. AI Development Updates Released Yesterday
   Published: 2025-05-14 (1 days ago)
   Score: 0.3670

5. AI Breakthrough Enables Medical Diagnosis Advancement
   Published: 2025-01-15 (120 days ago)
   Score: 0.3640

6. Tech Giants Compete in New AI Race
   Published: 2025-03-16 (60 days ago)
   Score: 0.3335

7. AI Research Advancements Published in January
   Published: 2025-02-14 (90 days ago)
   Score: 0.2158
```

## ステップ9：スコア計算を理解する{#step-9-understand-score-calculation}

元の関連性と減衰係数を組み合わせて最終スコアがどのように計算されるかを詳しく見ていきましょう。

```python
# Add a detailed breakdown for the first 3 results from Gaussian decay
print("\n=== SCORE CALCULATION BREAKDOWN (GAUSSIAN DECAY) ===")
for item in gaussian_results[0][:3]:
    headline = item.get('headline')
    publish_date = datetime.datetime.fromtimestamp(item.get('publish_date'))
    days_ago = (current_time - item.get('publish_date')) / (24 * 60 * 60)
    
    # Get the original score
    original_score = original_scores.get(headline, 0)
    
    # Calculate decay factor
    decay_factor = 1.0 if days_ago <= 7 else (0.5 ** ((days_ago - 7) / 14))
    
    # Show breakdown
    print(f"Item: {headline}")
    print(f"  Published: {publish_date.strftime('%Y-%m-%d')} ({int(days_ago)} days ago)")
    print(f"  Original relevance score: {original_score:.4f}")
    print(f"  Decay factor (Gaussian): {decay_factor:.4f}")
    print(f"  Expected final score = Original × Decay: {original_score * decay_factor:.4f}")
    print(f"  Actual final score: {item.score:.4f}")
    print()
```

Zilliz Cloud は、ベクトルデータベースのフルマネージドサービスです。Zilliz Cloud を使用すると、ベクトル検索アプリケーションを簡単に構築できます。

Zilliz Cloud は、オープンソースのベクトルデータベースである Milvus をベースに構築されています。Zilliz Cloud は、Milvus のすべての機能に加えて、スケーラビリティ、信頼性、セキュリティなどのエンタープライズグレードの機能を提供します。

Zilliz Cloud は、以下のような様々なユースケースで利用できます。

- 類似画像検索
- レコメンデーションシステム
- 自然言語処理
- 異常検知
- ゲノム解析

Zilliz Cloud の詳細については、[Zilliz Cloud のドキュメント](https://zilliz.com/cloud/doc) を参照してください。

## Zilliz Cloud の機能

Zilliz Cloud は、以下のような主要な機能を提供します。

- **フルマネージドサービス**: Zilliz Cloud は、ベクトルデータベースのフルマネージドサービスです。ユーザーは、インフラストラクチャの管理やメンテナンスについて心配する必要はありません。
- **スケーラビリティ**: Zilliz Cloud は、水平スケーリングをサポートしており、大量のデータを処理できます。
- **信頼性**: Zilliz Cloud は、データの耐久性と可用性を保証するために、複数のアベイラビリティゾーンにデータを複製します。
- **セキュリティ**: Zilliz Cloud は、データの暗号化、アクセス制御、監査ログなどのセキュリティ機能を提供します。
- **RESTful API**: Zilliz Cloud は、RESTful API を提供しており、様々なプログラミング言語からアクセスできます。
- **SDK**: Zilliz Cloud は、Python、Java、Go などのプログラミング言語向けの SDK を提供しています。

## Zilliz Cloud の料金

Zilliz Cloud の料金は、使用量に基づいて課金されます。詳細については、[Zilliz Cloud の料金ページ](https://zilliz.com/cloud/pricing) を参照してください。

## Zilliz Cloud の始め方

Zilliz Cloud を始めるには、以下の手順に従います。

1. Zilliz Cloud のアカウントを作成します。
2. Zilliz Cloud のコンソールにログインします。
3. クラスターを作成します。
4. コレクションを作成し、データをインポートします。
5. ベクトル検索を実行します。

詳細については、[Zilliz Cloud のクイックスタートガイド](https://zilliz.com/cloud/doc/quickstart) を参照してください。

```python
=== SCORE CALCULATION BREAKDOWN (GAUSSIAN DECAY) ===
Item: Latest Deep Learning Models Show Remarkable Progress
  Published: 2025-04-30 (15 days ago)
  Original relevance score: 0.6674
  Decay factor (Gaussian): 0.6730
  Expected final score = Original × Decay: 0.4491
  Actual final score: 0.5322

Item: New AI Research Results Released This Week
  Published: 2025-05-10 (5 days ago)
  Original relevance score: 0.4316
  Decay factor (Gaussian): 1.0000
  Expected final score = Original × Decay: 0.4316
  Actual final score: 0.4316

Item: AI Development Updates Released Yesterday
  Published: 2025-05-14 (1 days ago)
  Original relevance score: 0.3670
  Decay factor (Gaussian): 1.0000
  Expected final score = Original × Decay: 0.3670
  Actual final score: 0.3670
```

## ステップ10：時間減衰を伴うハイブリッド検索{#step-10-hybrid-search-with-time-decay}

より複雑なシナリオでは、ハイブリッド検索を使用して、密（セマンティック）ベクトルと疎（キーワード）ベクトルを組み合わせることができます。

```python
# Set up hybrid search (combining dense and sparse vectors)
dense_search = AnnSearchRequest(
    data=[query],
    anns_field="dense",  # Search dense vectors
    param={},
    limit=7
)

sparse_search = AnnSearchRequest(
    data=[query],
    anns_field="sparse_vector",  # Search sparse vectors (BM25)
    param={},
    limit=7
)

# Execute hybrid search with each decay function
# Gaussian decay
hybrid_gaussian_results = milvus_client.hybrid_search(
    collection_name,
    [dense_search, sparse_search],
    ranker=gaussian_ranker,
    limit=7,
    output_fields=["headline", "content", "publish_date"]
)
print_search_results(hybrid_gaussian_results, "HYBRID SEARCH RESULTS WITH GAUSSIAN DECAY RANKING")

# Exponential decay
hybrid_exponential_results = milvus_client.hybrid_search(
    collection_name,
    [dense_search, sparse_search],
    ranker=exponential_ranker,
    limit=7,
    output_fields=["headline", "content", "publish_date"]
)
print_search_results(hybrid_exponential_results, "HYBRID SEARCH RESULTS WITH EXPONENTIAL DECAY RANKING")
```

Zilliz Cloud は、ベクトルデータベースのフルマネージドサービスです。Zilliz Cloud を使用すると、ベクトル検索アプリケーションを簡単に構築できます。

Zilliz Cloud は、オープンソースのベクトルデータベースである Milvus をベースに構築されています。Milvus は、大規模なベクトル検索アプリケーション向けに設計された、高性能でスケーラブルなベクトルデータベースです。

Zilliz Cloud は、Milvus のすべての機能を提供し、さらに多くの機能を提供します。Zilliz Cloud は、次のような機能を提供します。

- フルマネージドサービス: Zilliz Cloud は、Milvus のデプロイ、管理、スケーリングを自動的に行います。
- 高可用性: Zilliz Cloud は、高可用性を提供するために、複数のアベイラビリティーゾーンにデプロイされます。
- スケーラビリティ: Zilliz Cloud は、必要に応じて自動的にスケーリングされます。
- セキュリティ: Zilliz Cloud は、データのセキュリティを保護するために、さまざまなセキュリティ機能を提供します。
- 監視とアラート: Zilliz Cloud は、監視とアラート機能を提供し、システムの健全性を監視できます。

Zilliz Cloud は、次のようなさまざまなアプリケーションで使用できます。

- 類似画像検索
- レコメンデーションシステム
- 自然言語処理
- 異常検出
- ゲノム配列解析

Zilliz Cloud の詳細については、[Zilliz Cloud のドキュメント](https://zilliz.com/cloud/doc) を参照してください。

## Zilliz Cloud の機能

Zilliz Cloud は、ベクトル検索アプリケーションを構築するためのさまざまな機能を提供します。

### ベクトルデータベース

Zilliz Cloud は、ベクトルデータベースのフルマネージドサービスです。Zilliz Cloud を使用すると、ベクトル検索アプリケーションを簡単に構築できます。

### スケーラビリティ

Zilliz Cloud は、必要に応じて自動的にスケーリングされます。これにより、アプリケーションの成長に合わせて、データベースを簡単に拡張できます。

### 高可用性

Zilliz Cloud は、高可用性を提供するために、複数のアベイラビリティーゾーンにデプロイされます。これにより、データベースが常に利用可能であることが保証されます。

### セキュリティ

Zilliz Cloud は、データのセキュリティを保護するために、さまざまなセキュリティ機能を提供します。これには、暗号化、アクセス制御、ネットワークセキュリティが含まれます。

### 監視とアラート

Zilliz Cloud は、監視とアラート機能を提供し、システムの健全性を監視できます。これにより、問題が発生した場合に迅速に対応できます。

## Zilliz Cloud のユースケース

Zilliz Cloud は、次のようなさまざまなアプリケーションで使用できます。

### 類似画像検索

Zilliz Cloud を使用すると、類似画像検索アプリケーションを構築できます。これにより、ユーザーは画像に基づいて類似画像を検索できます。

### レコメンデーションシステム

Zilliz Cloud を使用すると、レコメンデーションシステムを構築できます。これにより、ユーザーの行動に基づいて、関連するアイテムを推奨できます。

### 自然言語処理

Zilliz Cloud を使用すると、自然言語処理アプリケーションを構築できます。これにより、テキストに基づいて、関連する情報を検索できます。

### 異常検出

Zilliz Cloud を使用すると、異常検出アプリケーションを構築できます。これにより、データ内の異常を検出できます。

### ゲノム配列解析

Zilliz Cloud を使用すると、ゲノム配列解析アプリケーションを構築できます。これにより、ゲノム配列に基づいて、関連する情報を検索できます。

## Zilliz Cloud の料金

Zilliz Cloud は、使用量に基づいて課金されます。料金の詳細については、[Zilliz Cloud の料金ページ](https://zilliz.com/cloud/pricing) を参照してください。

## Zilliz Cloud の開始方法

Zilliz Cloud の開始方法については、[Zilliz Cloud のドキュメント](https://zilliz.com/cloud/doc) を参照してください。

```python
=== HYBRID SEARCH RESULTS WITH GAUSSIAN DECAY RANKING ===
1. New AI Research Results Released This Week
   Published: 2025-05-10 (5 days ago)
   Score: 2.1467

2. AI Development Updates Released Yesterday
   Published: 2025-05-14 (1 days ago)
   Score: 0.7926

3. Latest Deep Learning Models Show Remarkable Progress
   Published: 2025-04-30 (15 days ago)
   Score: 0.5322

4. AI Ethics Guidelines Released by International Body
   Published: 2025-04-15 (30 days ago)
   Score: 0.1180

5. Tech Giants Compete in New AI Race
   Published: 2025-03-16 (60 days ago)
   Score: 0.0000

6. AI Research Advancements Published in January
   Published: 2025-02-14 (90 days ago)
   Score: 0.0000

7. AI Breakthrough Enables Medical Diagnosis Advancement
   Published: 2025-01-15 (120 days ago)
   Score: 0.0000

=== HYBRID SEARCH RESULTS WITH EXPONENTIAL DECAY RANKING ===
1. New AI Research Results Released This Week
   Published: 2025-05-10 (5 days ago)
   Score: 1.6873

2. AI Development Updates Released Yesterday
   Published: 2025-05-14 (1 days ago)
   Score: 0.7926

3. Latest Deep Learning Models Show Remarkable Progress
   Published: 2025-04-30 (15 days ago)
   Score: 0.1574

4. AI Ethics Guidelines Released by International Body
   Published: 2025-04-15 (30 days ago)
   Score: 0.0297

5. Tech Giants Compete in New AI Race
   Published: 2025-03-16 (60 days ago)
   Score: 0.0007

6. AI Research Advancements Published in January
   Published: 2025-02-14 (90 days ago)
   Score: 0.0001

7. AI Breakthrough Enables Medical Diagnosis Advancement
   Published: 2025-01-15 (120 days ago)
   Score: 0.0000
```

## ステップ11：異なるパラメータ値で実験する{#step-11-experiment-with-different-parameter-values}

スケールパラメータを調整すると、ガウス減衰関数がどのように影響を受けるかを見てみましょう。

```python
# Create variations of the Gaussian decay function with different scale parameters
print("\n=== PARAMETER VARIATION EXPERIMENT: SCALE ===")
for scale_days in [7, 14, 30]:
    scaled_ranker = Function(
        name=f"time_decay_gaussian_{scale_days}",
        input_field_names=["publish_date"],
        function_type=FunctionType.RERANK,
        params={
            "reranker": "decay",
            "function": "gauss",
            "origin": current_time,
            "offset": 7 * 24 * 60 * 60,  # Fixed offset of 7 days
            "decay": 0.5,                # Fixed decay of 0.5
            "scale": scale_days * 24 * 60 * 60  # Variable scale
        }
    )
    
    # Get results
    scale_results = milvus_client.search(
        collection_name,
        data=[query],
        anns_field="dense",
        limit=7,
        output_fields=["headline", "content", "publish_date"],
        ranker=scaled_ranker,
        consistency_level="Strong"
    )
    
    print_search_results(scale_results, f"SEARCH WITH GAUSSIAN DECAY (SCALE = {scale_days} DAYS)")
```

Zilliz Cloud は、ベクトルデータベースのフルマネージドサービスです。Zilliz Cloud を使用すると、ベクトル検索アプリケーションを簡単に構築できます。

このドキュメントでは、Zilliz Cloud の RESTful API V2 を使用して、Zilliz Cloud のコレクションを管理する方法について説明します。

## コレクションの作成 {#create-a-collection}

コレクションを作成するには、`POST /v2/collections` エンドポイントを使用します。

```http
POST /v2/collections
```

### リクエストの本文 {#request-body}

| フィールド名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `collectionName` | 文字列 | はい | 作成するコレクションの名前。 |
| `dimension` | 整数 | はい | コレクションのベクトルの次元。 |
| `primaryFieldName` | 文字列 | はい | 主キーフィールドの名前。 |
| `vectorFieldName` | 文字列 | はい | ベクトルフィールドの名前。 |
| `metricType` | 文字列 | いいえ | ベクトル検索に使用する距離計算方法。デフォルトは `COSINE`。 |
| `description` | 文字列 | いいえ | コレクションの説明。 |

### 例 {#example}

```json
{
    "collectionName": "my_collection",
    "dimension": 128,
    "primaryFieldName": "id",
    "vectorFieldName": "vector",
    "metricType": "COSINE",
    "description": "My first collection"
}
```

## コレクションの記述 {#describe-a-collection}

コレクションを記述するには、`GET /v2/collections/{collectionName}` エンドポイントを使用します。

```http
GET /v2/collections/{collectionName}
```

### パスパラメータ {#path-parameters}

| フィールド名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `collectionName` | 文字列 | はい | 記述するコレクションの名前。 |

### 例 {#example-1}

```json
{
    "collectionName": "my_collection",
    "dimension": 128,
    "primaryFieldName": "id",
    "vectorFieldName": "vector",
    "metricType": "COSINE",
    "description": "My first collection",
    "rowCount": 0,
    "autoID": false
}
```

## コレクションの削除 {#delete-a-collection}

コレクションを削除するには、`DELETE /v2/collections/{collectionName}` エンドポイントを使用します。

```http
DELETE /v2/collections/{collectionName}
```

### パスパラメータ {#path-parameters-1}

| フィールド名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `collectionName` | 文字列 | はい | 削除するコレクションの名前。 |

### 例 {#example-2}

```json
{}
```

## コレクションのリスト表示 {#list-collections}

コレクションをリスト表示するには、`GET /v2/collections` エンドポイントを使用します。

```http
GET /v2/collections
```

### 例 {#example-3}

```json
[
    {
        "collectionName": "my_collection",
        "dimension": 128,
        "primaryFieldName": "id",
        "vectorFieldName": "vector",
        "metricType": "COSINE",
        "description": "My first collection",
        "rowCount": 0,
        "autoID": false
    }
]
```

```python
=== PARAMETER VARIATION EXPERIMENT: SCALE ===

=== SEARCH WITH GAUSSIAN DECAY (SCALE = 7 DAYS) ===
1. New AI Research Results Released This Week
   Published: 2025-05-10 (5 days ago)
   Score: 0.4316

2. AI Development Updates Released Yesterday
   Published: 2025-05-14 (1 days ago)
   Score: 0.3670

3. Latest Deep Learning Models Show Remarkable Progress
   Published: 2025-04-30 (15 days ago)
   Score: 0.2699

4. AI Ethics Guidelines Released by International Body
   Published: 2025-04-15 (30 days ago)
   Score: 0.0004

5. Tech Giants Compete in New AI Race
   Published: 2025-03-16 (60 days ago)
   Score: 0.0000

6. AI Research Advancements Published in January
   Published: 2025-02-14 (90 days ago)
   Score: 0.0000

7. AI Breakthrough Enables Medical Diagnosis Advancement
   Published: 2025-01-15 (120 days ago)
   Score: 0.0000

=== SEARCH WITH GAUSSIAN DECAY (SCALE = 14 DAYS) ===
1. Latest Deep Learning Models Show Remarkable Progress
   Published: 2025-04-30 (15 days ago)
   Score: 0.5322

2. New AI Research Results Released This Week
   Published: 2025-05-10 (5 days ago)
   Score: 0.4316

3. AI Development Updates Released Yesterday
   Published: 2025-05-14 (1 days ago)
   Score: 0.3670

4. AI Ethics Guidelines Released by International Body
   Published: 2025-04-15 (30 days ago)
   Score: 0.1180

5. Tech Giants Compete in New AI Race
   Published: 2025-03-16 (60 days ago)
   Score: 0.0000

6. AI Research Advancements Published in January
   Published: 2025-02-14 (90 days ago)
   Score: 0.0000

7. AI Breakthrough Enables Medical Diagnosis Advancement
   Published: 2025-01-15 (120 days ago)
   Score: 0.0000

=== SEARCH WITH GAUSSIAN DECAY (SCALE = 30 DAYS) ===
1. Latest Deep Learning Models Show Remarkable Progress
   Published: 2025-04-30 (15 days ago)
   Score: 0.6353

2. AI Ethics Guidelines Released by International Body
   Published: 2025-04-15 (30 days ago)
   Score: 0.5097

3. New AI Research Results Released This Week
   Published: 2025-05-10 (5 days ago)
   Score: 0.4316

4. AI Development Updates Released Yesterday
   Published: 2025-05-14 (1 days ago)
   Score: 0.3670

5. Tech Giants Compete in New AI Race
   Published: 2025-03-16 (60 days ago)
   Score: 0.0767

6. AI Research Advancements Published in January
   Published: 2025-02-14 (90 days ago)
   Score: 0.0021

7. AI Breakthrough Enables Medical Diagnosis Advancement
   Published: 2025-01-15 (120 days ago)
   Score: 0.0000
```

## ステップ12：異なるクエリでのテスト{#step-12-testing-with-different-queries}

減衰ランキングが異なる検索クエリでどのように機能するかを見てみましょう。

```python
# Try different queries with Gaussian decay
for test_query in ["machine learning", "neural networks", "ethics in AI"]:
    print(f"\n=== TESTING QUERY: '{test_query}' WITH GAUSSIAN DECAY ===")
    test_results = milvus_client.search(
        collection_name,
        data=[test_query],
        anns_field="dense",
        limit=4,
        output_fields=["headline", "content", "publish_date"],
        ranker=gaussian_ranker,
        consistency_level="Strong"
    )
    print_search_results(test_results, f"TOP 4 RESULTS FOR '{test_query}'")
```

Zilliz Cloud は、ベクトルデータベースのフルマネージドサービスです。Zilliz Cloud を使用すると、ベクトル検索アプリケーションを簡単に構築できます。

Zilliz Cloud は、[Milvus](https://milvus.io/) をベースに構築されています。Milvus は、オープンソースのベクトルデータベースであり、大規模なベクトル検索アプリケーションを構築するための基盤を提供します。Zilliz Cloud は、Milvus のすべての機能を提供し、さらに、スケーラビリティ、信頼性、セキュリティなどのエンタープライズグレードの機能を追加しています。

Zilliz Cloud は、以下のような様々なユースケースで利用できます。

- **AI を活用した検索**: 関連性の高い検索結果を返すことで、ユーザーエクスペリエンスを向上させます。
- **レコメンデーションエンジン**: ユーザーの行動に基づいて、パーソナライズされたレコメンデーションを提供します。
- **異常検知**: 異常なパターンを特定し、潜在的な脅威を検出します。
- **画像検索**: 類似の画像を検索し、視覚的な検索エクスペリエンスを向上させます。
- **動画検索**: 動画コンテンツを検索し、関連性の高い動画を特定します。
- **音声検索**: 音声コンテンツを検索し、関連性の高い音声を特定します。
- **自然言語処理**: テキストデータを分析し、意味のある情報を抽出します。

Zilliz Cloud は、開発者がベクトル検索アプリケーションを簡単に構築できるように、様々なツールとサービスを提供しています。

- **Zilliz Cloud コンソール**: Zilliz Cloud のリソースを管理するためのウェブベースのインターフェースです。
- **Zilliz Cloud SDK**: Zilliz Cloud の API を操作するためのプログラミングライブラリです。
- **Zilliz Cloud CLI**: Zilliz Cloud のリソースをコマンドラインから管理するためのツールです。

Zilliz Cloud は、ベクトル検索アプリケーションを構築するための強力なプラットフォームです。Zilliz Cloud を使用すると、開発者は、スケーラブルで信頼性の高いベクトル検索アプリケーションを簡単に構築できます。

## Zilliz Cloud の機能 {#zilliz-cloud-features}

Zilliz Cloud は、ベクトル検索アプリケーションを構築するための様々な機能を提供しています。

- **フルマネージドサービス**: Zilliz Cloud は、ベクトルデータベースのフルマネージドサービスです。これにより、インフラストラクチャの管理に時間を費やすことなく、アプリケーションの構築に集中できます。
- **スケーラビリティ**: Zilliz Cloud は、大規模なデータセットと高負荷のワークロードに対応できるように設計されています。必要に応じて、リソースを簡単にスケールアップまたはスケールダウンできます。
- **信頼性**: Zilliz Cloud は、高可用性と耐久性を提供します。データは複数のアベイラビリティゾーンに複製され、自動フェイルオーバーがサポートされています。
- **セキュリティ**: Zilliz Cloud は、データのセキュリティを保護するための様々な機能を提供します。これには、暗号化、アクセス制御、ネットワークセキュリティが含まれます。
- **RESTful API**: Zilliz Cloud は、RESTful API を提供しており、様々なプログラミング言語からアクセスできます。
- **SDK**: Zilliz Cloud は、Python、Java、Go などのプログラミング言語用の SDK を提供しています。
- **CLI**: Zilliz Cloud は、コマンドラインインターフェース (CLI) を提供しており、Zilliz Cloud のリソースを管理できます。
- **コンソール**: Zilliz Cloud は、ウェブベースのコンソールを提供しており、Zilliz Cloud のリソースを管理できます。

## Zilliz Cloud のアーキテクチャ {#zilliz-cloud-architecture}

Zilliz Cloud は、Milvus をベースに構築されています。Milvus は、オープンソースのベクトルデータベースであり、大規模なベクトル検索アプリケーションを構築するための基盤を提供します。Zilliz Cloud は、Milvus のすべての機能を提供し、さらに、スケーラビリティ、信頼性、セキュリティなどのエンタープライズグレードの機能を追加しています。

Zilliz Cloud のアーキテクチャは、以下の主要なコンポーネントで構成されています。

- **プロキシ**: プロキシは、クライアントからのリクエストを受け取り、適切なコンポーネントにルーティングします。
- **クエリノード**: クエリノードは、ベクトル検索クエリを実行します。
- **データノード**: データノードは、ベクトルデータを保存および管理します。
- **インデックスノード**: インデックスノードは、ベクトルデータにインデックスを作成します。
- **ルートコーディネーター**: ルートコーディネーターは、Zilliz Cloud クラスター全体の調整を担当します。
- **クエリコーディネーター**: クエリコーディネーターは、クエリノードの調整を担当します。
- **データコーディネーター**: データコーディネーターは、データノードの調整を担当します。
- **インデックスコーディネーター**: インデックスコーディネーターは、インデックスノードの調整を担当します。
- **メタデータサービス**: メタデータサービスは、Zilliz Cloud クラスターのメタデータを保存および管理します。
- **メッセージキュー**: メッセージキューは、Zilliz Cloud クラスター内のコンポーネント間の通信を可能にします。
- **オブジェクトストレージ**: オブジェクトストレージは、ベクトルデータを保存します。

Zilliz Cloud のアーキテクチャは、スケーラビリティ、信頼性、セキュリティを考慮して設計されています。各コンポーネントは独立してスケールでき、障害が発生した場合でもシステム全体の可用性を維持できます。

## Zilliz Cloud の概念 {#zilliz-cloud-concepts}

Zilliz Cloud を使用する前に、いくつかの重要な概念を理解しておく必要があります。

- **クラスター**: クラスターは、Zilliz Cloud のリソースの論理的なグループです。クラスターは、複数のノードで構成され、ベクトル検索アプリケーションをサポートします。
- **コレクション**: コレクションは、ベクトルデータの論理的なグループです。コレクションは、スキーマを定義し、ベクトルデータを保存します。
- **スキーマ**: スキーマは、コレクション内のフィールドの構造を定義します。スキーマは、フィールド名、データ型、およびその他のプロパティを指定します。
- **エンティティ**: エンティティは、コレクション内の個々のデータレコードです。エンティティは、ベクトルデータとその他の属性で構成されます。
- **ベクトル**: ベクトルは、数値の配列であり、オブジェクトの特徴を表します。ベクトルは、類似性検索に使用されます。
- **インデックス**: インデックスは、ベクトル検索のパフォーマンスを向上させるために使用されます。インデックスは、ベクトルデータを効率的に検索できるように整理します。
- **パーティション**: パーティションは、コレクションを論理的なサブグループに分割します。パーティションは、データの管理と検索のパフォーマンスを向上させるために使用されます。
- **レプリカ**: レプリカは、コレクションのコピーです。レプリカは、データの可用性と耐久性を向上させるために使用されます。
- **シャード**: シャードは、コレクションの物理的なサブグループです。シャードは、データの分散と検索のパフォーマンスを向上させるために使用されます。
- **動的フィールド**: 動的フィールドは、スキーマで事前に定義されていないフィールドです。動的フィールドは、柔軟なデータモデルをサポートするために使用されます。
- **mmap**: mmap は、メモリマップドファイルです。mmap は、ディスク上のファイルをメモリに直接マッピングすることで、I/O パフォーマンスを向上させます。
- **アナライザー**: アナライザーは、テキストデータを処理し、検索可能なトークンに変換します。アナライザーは、フルテキスト検索に使用されます。
- **フルテキスト検索**: フルテキスト検索は、テキストデータ内のキーワードを検索します。フルテキスト検索は、関連性の高い検索結果を返すために使用されます。
- **ロード**: ロードは、コレクションをメモリにロードする操作です。ロードは、検索のパフォーマンスを向上させるために使用されます。
- **リリース**: リリースは、コレクションをメモリから解放する操作です。リリースは、メモリリソースを解放するために使用されます。

これらの概念を理解することで、Zilliz Cloud を効果的に使用し、ベクトル検索アプリケーションを構築できます。

```python
=== TESTING QUERY: 'machine learning' WITH GAUSSIAN DECAY ===

=== TOP 4 RESULTS FOR 'machine learning' ===
1. New AI Research Results Released This Week
   Published: 2025-05-10 (5 days ago)
   Score: 0.8208

2. AI Development Updates Released Yesterday
   Published: 2025-05-14 (1 days ago)
   Score: 0.7287

3. Latest Deep Learning Models Show Remarkable Progress
   Published: 2025-04-30 (15 days ago)
   Score: 0.6633

4. AI Research Advancements Published in January
   Published: 2025-02-14 (90 days ago)
   Score: 0.0000

=== TESTING QUERY: 'neural networks' WITH GAUSSIAN DECAY ===

=== TOP 4 RESULTS FOR 'neural networks' ===
1. New AI Research Results Released This Week
   Published: 2025-05-10 (5 days ago)
   Score: 0.8509

2. AI Development Updates Released Yesterday
   Published: 2025-05-14 (1 days ago)
   Score: 0.7574

3. Latest Deep Learning Models Show Remarkable Progress
   Published: 2025-04-30 (15 days ago)
   Score: 0.6364

4. AI Research Advancements Published in January
   Published: 2025-02-14 (90 days ago)
   Score: 0.0000

=== TESTING QUERY: 'ethics in AI' WITH GAUSSIAN DECAY ===

=== TOP 4 RESULTS FOR 'ethics in AI' ===
1. New AI Research Results Released This Week
   Published: 2025-05-10 (5 days ago)
   Score: 0.7977

2. AI Development Updates Released Yesterday
   Published: 2025-05-14 (1 days ago)
   Score: 0.7322

3. AI Ethics Guidelines Released by International Body
   Published: 2025-04-15 (30 days ago)
   Score: 0.0814

4. AI Research Advancements Published in January
   Published: 2025-02-14 (90 days ago)
   Score: 0.0000
```

## 結論{#conclusion}

Milvusで減衰関数を使用して時間ベースのランキングを行うと、セマンティックな関連性と新しさを強力に両立させることができます。適切な減衰関数とパラメータを設定することで、セマンティックな関連性を尊重しつつ、新しいコンテンツを強調する検索エクスペリエンスを作成できます。

このアプローチは、特に以下の分野で価値があります。

- ニュースおよびメディアプラットフォーム

- Eコマース製品リスト

- ソーシャルメディアコンテンツフィード

- ナレッジベースおよびドキュメントシステム

- 研究論文リポジトリ

減衰関数の背後にある数学を理解し、さまざまなパラメータを試すことで、特定のユースケースに合わせて関連性と鮮度の最適なバランスを提供するように検索システムを微調整できます。