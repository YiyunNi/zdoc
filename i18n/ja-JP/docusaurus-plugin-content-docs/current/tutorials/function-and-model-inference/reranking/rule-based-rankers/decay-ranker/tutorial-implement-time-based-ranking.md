---
title: "チュートリアル: 時間ベースのランキングを実装する | Cloud"
slug: /tutorial-implement-time-based-ranking
sidebar_label: "チュートリアル: 時間ベースのランキングを実装する"
beta: FALSE
notebook: FALSE
description: "多くの検索アプリケーションでは、コンテンツの鮮度はその関連性と同じくらい重要です。ニュース記事、製品リスト、ソーシャルメディアの投稿、研究論文はすべて、セマンティックな関連性と新しさを両立させるランキングシステムから恩恵を受けます。このチュートリアルでは、decay rankerを使用してZilliz Cloudで時間ベースのランキングを実装する方法を説明します。 | Cloud"
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
  - decay
  - decay ranker
  - チュートリアル
  - 時間ベースのランキング
  - milvus benchmark
  - managed milvus
  - Serverless vector database
  - milvus open source

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

## ステップ1: スキーマを設計する{#step-1-design-the-schema}

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

## ステップ5：異なる減衰ランカーを設定する{#step-5-configure-different-decay-rankers}

次に、3つの異なる減衰ランカーを作成し、それぞれの違いを強調するために異なるパラメータを設定します。

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

異なる動作のためにこれらの関数をどのように調整できるかを示すために、異なるパラメータで指数ランク付けを設定したことに注意してください。

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

Zilliz Cloud は、クラウド環境でベクトルデータベースをデプロイ、スケーリング、管理する複雑さを抽象化します。Zilliz Cloud を使用すると、インフラストラクチャの管理ではなく、アプリケーションの構築に集中できます。

Zilliz Cloud は、以下のような様々な機能を提供します。

- **フルマネージドサービス**: Zilliz Cloud は、ベクトルデータベースのデプロイ、スケーリング、管理を自動的に行います。
- **高可用性**: Zilliz Cloud は、高可用性と耐久性を備えています。
- **スケーラビリティ**: Zilliz Cloud は、必要に応じてスケールアップまたはスケールダウンできます。
- **セキュリティ**: Zilliz Cloud は、データのセキュリティを確保するための様々な機能を提供します。
- **使いやすさ**: Zilliz Cloud は、使いやすいインターフェースとAPIを提供します。

Zilliz Cloud を使用すると、以下のようなアプリケーションを構築できます。

- **類似画像検索**: 画像の類似度に基づいて画像を検索します。
- **レコメンデーションシステム**: ユーザーの行動に基づいて商品をレコメンドします。
- **自然言語処理**: テキストの類似度に基づいてテキストを検索します。
- **不正検出**: 不正な取引を検出します。

Zilliz Cloud の詳細については、[Zilliz Cloud のドキュメント](https://zilliz.com/cloud/doc) を参照してください。

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

Zilliz Cloud は、Milvus のすべての機能を提供し、さらに多くの機能を提供します。Zilliz Cloud は、次のような機能を提供します。

- フルマネージドサービス: Zilliz Cloud は、Milvus のデプロイ、管理、スケーリングをすべて処理します。
- 高可用性: Zilliz Cloud は、高可用性アーキテクチャで構築されており、データが常に利用可能であることを保証します。
- スケーラビリティ: Zilliz Cloud は、必要に応じて簡単にスケールアップまたはスケールダウンできます。
- セキュリティ: Zilliz Cloud は、データのセキュリティを確保するためのさまざまなセキュリティ機能を提供します。
- 監視とアラート: Zilliz Cloud は、Milvus クラスターのパフォーマンスを監視し、問題が発生したときにアラートを送信します。

Zilliz Cloud は、次のようなさまざまなアプリケーションで使用できます。

- 類似画像検索
- レコメンデーションシステム
- 自然言語処理
- 異常検出
- ゲノム配列解析

Zilliz Cloud の詳細については、[Zilliz Cloud のドキュメント](https://zilliz.com/cloud/doc) を参照してください。

## Zilliz Cloud の概念

Zilliz Cloud を使用する前に、いくつかの重要な概念を理解しておく必要があります。

### クラスター

Zilliz Cloud クラスターは、ベクトルデータベースのデプロイメントです。クラスターは、Milvus インスタンス、ストレージ、およびその他のコンポーネントで構成されます。

### コレクション

コレクションは、ベクトルデータの論理的なグループです。コレクションは、テーブルに似ており、スキーマとデータが含まれています。

### スキーマ

スキーマは、コレクション内のデータの構造を定義します。スキーマは、フィールド名、データ型、およびその他のプロパティで構成されます。

### フィールド

フィールドは、コレクション内のデータの属性です。フィールドは、ベクトル、数値、文字列などのさまざまなデータ型を持つことができます。

### ベクトル

ベクトルは、高次元空間内のデータポイントを表す数値の配列です。ベクトルは、類似性検索に使用されます。

### インデックス

インデックスは、ベクトル検索のパフォーマンスを向上させるために使用されるデータ構造です。インデックスは、ベクトルデータを効率的に検索できるようにします。

### パーティション

パーティションは、コレクション内のデータを論理的に分割する方法です。パーティションは、データの管理と検索を容易にするために使用されます。

### レプリカ

レプリカは、コレクションのコピーです。レプリカは、高可用性とスケーラビリティを提供するために使用されます。

### シャード

シャードは、コレクションのサブセットです。シャードは、データの分散と並列処理を可能にするために使用されます。

### mmap

mmap は、メモリマップドファイルのことです。mmap は、ディスク上のファイルをメモリに直接マッピングすることで、I/O パフォーマンスを向上させるために使用されます。

### アナライザー

アナライザーは、テキストデータをトークンに分割し、それらを正規化するために使用されるコンポーネントです。アナライザーは、フルテキスト検索に使用されます。

### フルテキスト検索

フルテキスト検索は、テキストデータ内のキーワードを検索する機能です。フルテキスト検索は、アナライザーを使用してテキストデータを処理し、インデックスを作成します。

### エンティティ

エンティティは、コレクション内の単一のデータレコードです。エンティティは、ベクトル、フィールド、およびその他のプロパティで構成されます。

### ダイナミックフィールド

ダイナミックフィールドは、スキーマで事前に定義されていないフィールドです。ダイナミックフィールドは、柔軟なデータモデルを可能にします。

### ロード

ロードは、コレクションをメモリにロードする操作です。ロードは、コレクションを検索可能にするために必要です。

### リリース

リリースは、コレクションをメモリから解放する操作です。リリースは、メモリを解放するために使用されます。

## Zilliz Cloud の使用方法

Zilliz Cloud を使用するには、次の手順を実行します。

1. Zilliz Cloud アカウントを作成します。
2. Zilliz Cloud クラスターを作成します。
3. コレクションを作成します。
4. データをコレクションに挿入します。
5. コレクションを検索します。

Zilliz Cloud の詳細については、[Zilliz Cloud のドキュメント](https://zilliz.com/cloud/doc) を参照してください。

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

Zilliz Cloud は、オープンソースのベクトルデータベースである Milvus をベースに構築されています。Milvus は、大規模なベクトル検索アプリケーションを構築するために設計された、高性能でスケーラブルなベクトルデータベースです。

Zilliz Cloud は、Milvus のすべての機能を提供し、さらに多くの機能を提供します。Zilliz Cloud は、以下のような機能を提供します。

- フルマネージドサービス: Zilliz Cloud は、Milvus のデプロイ、管理、スケーリングを自動的に行います。
- 高可用性: Zilliz Cloud は、高可用性を実現するために、複数のアベイラビリティゾーンにデプロイされます。
- スケーラビリティ: Zilliz Cloud は、必要に応じてスケールアップまたはスケールダウンできます。
- セキュリティ: Zilliz Cloud は、データのセキュリティを確保するために、さまざまなセキュリティ機能を提供します。
- 監視とアラート: Zilliz Cloud は、システムのパフォーマンスを監視し、問題が発生したときにアラートを送信します。

Zilliz Cloud は、以下のようなユースケースに適しています。

- 類似画像検索
- 類似動画検索
- 類似音声検索
- 推薦システム
- 自然言語処理
- 異常検知

Zilliz Cloud の詳細については、[Zilliz Cloud のドキュメント](https://zilliz.com/cloud/doc)を参照してください。

## Zilliz Cloud のアーキテクチャ

Zilliz Cloud は、以下のようなコンポーネントで構成されています。

- **Milvus クラスター**: Milvus クラスターは、ベクトルデータを保存し、ベクトル検索を実行します。
- **Zilliz Cloud コントロールプレーン**: Zilliz Cloud コントロールプレーンは、Milvus クラスターのデプロイ、管理、スケーリングを自動的に行います。
- **Zilliz Cloud API**: Zilliz Cloud API は、Zilliz Cloud のすべての機能にアクセスするための RESTful API です。

## Zilliz Cloud の料金

Zilliz Cloud は、使用量に基づいて課金されます。料金の詳細については、[Zilliz Cloud の料金ページ](https://zilliz.com/cloud/pricing)を参照してください。

## Zilliz Cloud の始め方

Zilliz Cloud を始めるには、以下の手順を実行します。

1. Zilliz Cloud アカウントを作成します。
2. Zilliz Cloud コンソールにログインします。
3. Milvus クラスターを作成します。
4. Milvus クラスターにデータをインポートします。
5. ベクトル検索を実行します。

Zilliz Cloud の詳細については、[Zilliz Cloud のドキュメント](https://zilliz.com/cloud/doc)を参照してください。

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

Zilliz Cloud は、オープンソースのベクトルデータベースである Milvus をベースに構築されています。Zilliz Cloud は、Milvus のすべての機能と、クラウドネイティブなスケーラビリティ、信頼性、セキュリティを提供します。

Zilliz Cloud は、以下のような様々なユースケースで利用できます。

- 類似画像検索
- レコメンデーションシステム
- 自然言語処理
- 異常検知
- ゲノム解析

Zilliz Cloud は、開発者がベクトル検索アプリケーションを簡単に構築できるように、使いやすいインターフェースと豊富なドキュメントを提供しています。

Zilliz Cloud の詳細については、[Zilliz Cloud のウェブサイト](https://zilliz.com/cloud)をご覧ください。

## Zilliz Cloud の機能

Zilliz Cloud は、以下のような様々な機能を提供しています。

- **フルマネージドサービス**: Zilliz Cloud は、ベクトルデータベースのフルマネージドサービスです。ユーザーは、インフラストラクチャの管理やメンテナンスについて心配する必要はありません。
- **スケーラビリティ**: Zilliz Cloud は、クラウドネイティブなスケーラビリティを提供します。ユーザーは、必要に応じてデータベースのサイズを簡単に拡張できます。
- **信頼性**: Zilliz Cloud は、高い信頼性を提供します。データは複数のアベイラビリティゾーンに複製され、自動的にバックアップされます。
- **セキュリティ**: Zilliz Cloud は、高いセキュリティを提供します。データは暗号化され、アクセス制御が適用されます。
- **使いやすいインターフェース**: Zilliz Cloud は、使いやすいインターフェースを提供します。ユーザーは、ウェブコンソール、CLI、または SDK を使用してデータベースを操作できます。
- **豊富なドキュメント**: Zilliz Cloud は、豊富なドキュメントを提供します。ユーザーは、ドキュメントを参照して、Zilliz Cloud の使い方を学ぶことができます。

## Zilliz Cloud の料金

Zilliz Cloud の料金は、使用量に基づいて課金されます。詳細については、[Zilliz Cloud の料金ページ](https://zilliz.com/cloud/pricing)をご覧ください。

## Zilliz Cloud のサポート

Zilliz Cloud は、24 時間 365 日のサポートを提供しています。ユーザーは、サポートチームに連絡して、質問や問題を解決できます。

## Zilliz Cloud の始め方

Zilliz Cloud を始めるには、以下の手順に従ってください。

1. [Zilliz Cloud のウェブサイト](https://zilliz.com/cloud)にアクセスし、アカウントを作成します。
2. データベースを作成します。
3. データをインポートします。
4. ベクトル検索アプリケーションを構築します。

詳細については、[Zilliz Cloud のドキュメント](https://zilliz.com/cloud/docs)をご覧ください。

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

Zilliz Cloud は、オープンソースのベクトルデータベースである Milvus をベースに構築されています。Milvus は、大規模なベクトル検索アプリケーションを構築するための強力な機能を提供します。

Zilliz Cloud は、Milvus のすべての機能に加えて、次のような追加機能を提供します。

- フルマネージドサービス: Zilliz Cloud は、Milvus のデプロイ、管理、スケーリングを自動的に行います。
- 高可用性: Zilliz Cloud は、高可用性を実現するために、複数のアベイラビリティーゾーンにデプロイされます。
- セキュリティ: Zilliz Cloud は、データのセキュリティを保護するために、さまざまなセキュリティ機能を提供します。
- スケーラビリティ: Zilliz Cloud は、必要に応じて Milvus クラスターを自動的にスケーリングします。

Zilliz Cloud を使用すると、ベクトル検索アプリケーションを簡単に構築できます。Zilliz Cloud は、次のようなさまざまなユースケースで使用できます。

- 類似画像検索
- 類似動画検索
- 類似音声検索
- 類似テキスト検索
- レコメンデーションシステム
- 不正検出

Zilliz Cloud の詳細については、[Zilliz Cloud のドキュメント](https://zilliz.com/cloud/doc)を参照してください。

## Zilliz Cloud の機能

Zilliz Cloud は、ベクトル検索アプリケーションを構築するためのさまざまな機能を提供します。

- **ベクトル検索**: Zilliz Cloud は、大規模なベクトルデータセットに対して高速なベクトル検索を実行できます。
- **データ管理**: Zilliz Cloud は、ベクトルデータの挿入、更新、削除、クエリをサポートします。
- **スケーラビリティ**: Zilliz Cloud は、必要に応じて Milvus クラスターを自動的にスケーリングします。
- **高可用性**: Zilliz Cloud は、高可用性を実現するために、複数のアベイラビリティーゾーンにデプロイされます。
- **セキュリティ**: Zilliz Cloud は、データのセキュリティを保護するために、さまざまなセキュリティ機能を提供します。
- **監視とアラート**: Zilliz Cloud は、Milvus クラスターのパフォーマンスを監視し、問題が発生したときにアラートを送信します。
- **バックアップと復元**: Zilliz Cloud は、Milvus クラスターのバックアップと復元をサポートします。

## Zilliz Cloud の利点

Zilliz Cloud を使用すると、次のような利点があります。

- **開発時間の短縮**: Zilliz Cloud は、Milvus のデプロイ、管理、スケーリングを自動的に行うため、開発者はアプリケーションの構築に集中できます。
- **コスト削減**: Zilliz Cloud は、Milvus クラスターの管理と運用にかかるコストを削減します。
- **パフォーマンスの向上**: Zilliz Cloud は、大規模なベクトルデータセットに対して高速なベクトル検索を実行できます。
- **信頼性の向上**: Zilliz Cloud は、高可用性を実現するために、複数のアベイラビリティーゾーンにデプロイされます。
- **セキュリティの向上**: Zilliz Cloud は、データのセキュリティを保護するために、さまざまなセキュリティ機能を提供します。

## Zilliz Cloud の料金

Zilliz Cloud の料金は、使用するリソースとデータ量によって異なります。詳細については、[Zilliz Cloud の料金ページ](https://zilliz.com/cloud/pricing)を参照してください。

## Zilliz Cloud の開始方法

Zilliz Cloud の開始方法については、[Zilliz Cloud のドキュメント](https://zilliz.com/cloud/doc)を参照してください。

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
- **RESTful API**: Zilliz Cloud は、RESTful API を提供します。これにより、任意のプログラミング言語からデータベースにアクセスできます。
- **SDK**: Zilliz Cloud は、Python、Java、Go などのプログラミング言語向けの SDK を提供します。

## Zilliz Cloud のアーキテクチャ

Zilliz Cloud は、以下のようなコンポーネントで構成されています。

- **Milvus**: Zilliz Cloud のコアとなるベクトルデータベースです。
- **Kubernetes**: Milvus クラスターを管理するためのコンテナオーケストレーションプラットフォームです。
- **オブジェクトストレージ**: ベクトルデータを保存するためのストレージサービスです。
- **メッセージキュー**: Milvus クラスター内のコンポーネント間でメッセージを送信するためのサービスです。

## Zilliz Cloud の料金

Zilliz Cloud の料金は、使用量に基づいて課金されます。詳細については、[Zilliz Cloud の料金ページ](https://zilliz.com/cloud/pricing) を参照してください。

## Zilliz Cloud の始め方

Zilliz Cloud を始めるには、以下の手順に従います。

1. Zilliz Cloud アカウントを作成します。
2. Zilliz Cloud コンソールにログインします。
3. 新しい Milvus クラスターを作成します。
4. Milvus クラスターにデータをインポートします。
5. ベクトル検索アプリケーションを構築します。

詳細については、[Zilliz Cloud のクイックスタートガイド](https://zilliz.com/cloud/doc/quickstart) を参照してください。

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

Milvusで減衰関数を使用した時間ベースのランキングは、セマンティックな関連性と新しさを両立させる強力な方法を提供します。適切な減衰関数とパラメータを設定することで、セマンティックな関連性を尊重しつつ、新しいコンテンツを強調する検索エクスペリエンスを作成できます。

このアプローチは、特に以下の分野で価値があります。

- ニュースおよびメディアプラットフォーム

- Eコマース製品リスト

- ソーシャルメディアコンテンツフィード

- ナレッジベースおよびドキュメントシステム

- 研究論文リポジトリ

減衰関数の背後にある数学を理解し、さまざまなパラメータを試すことで、特定のユースケースに合わせて関連性と鮮度の最適なバランスを提供するように検索システムを微調整できます。