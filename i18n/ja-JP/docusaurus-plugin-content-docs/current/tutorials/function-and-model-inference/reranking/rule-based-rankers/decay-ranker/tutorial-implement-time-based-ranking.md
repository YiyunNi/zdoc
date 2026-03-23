---
title: "チュートリアル: 時間ベースのランキングを実装する | Cloud"
slug: /tutorial-implement-time-based-ranking
sidebar_label: "チュートリアル: 時間ベースのランキングを実装する"
beta: FALSE
notebook: FALSE
description: "多くの検索アプリケーションでは、コンテンツの鮮度はその関連性と同じくらい重要です。ニュース記事、製品リスト、ソーシャルメディアの投稿、研究論文はすべて、セマンティックな関連性と新しさを両立させるランキングシステムから恩恵を受けます。このチュートリアルでは、ディケイランカーを使用してZilliz Cloudで時間ベースのランキングを実装する方法を説明します。 | Cloud"
type: origin
token: Dj2NwrlqTiYlmDkwfAbcJNWSntd
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - データ
  - 検索結果の再ランキング
  - 結果の再ランキング
  - ディケイ
  - ディケイランカー
  - チュートリアル
  - 時間ベースのランキング

---

import Admonition from '@theme/Admonition';


# チュートリアル: 時間ベースのランキングを実装する

多くの検索アプリケーションでは、コンテンツの鮮度はその関連性と同じくらい重要です。ニュース記事、製品リスト、ソーシャルメディアの投稿、研究論文はすべて、セマンティックな関連性と新しさを両立させるランキングシステムから恩恵を受けます。このチュートリアルでは、減衰ランカーを使用してZilliz Cloudで時間ベースのランキングを実装する方法を説明します。

## 減衰ランカーを理解する\{#understand-decay-rankers}

減衰ランカーを使用すると、参照点に対する数値（タイムスタンプなど）に基づいてドキュメントをブーストまたはペナルティを課すことができます。時間ベースのランキングの場合、これは、セマンティックな関連性が類似している場合でも、新しいドキュメントが古いドキュメントよりも高いスコアを受け取る可能性があることを意味します。

Zilliz Cloudは、3種類の減衰ランカーをサポートしています。

- **ガウス** (`gauss`): 滑らかで緩やかな減衰を提供するベル型の曲線

- **指数** (`exp`): 最近のコンテンツを強く強調するために、より急激な初期の落ち込みを作成します

- **線形** (`linear`): 予測可能で理解しやすい直線的な減衰

各ランカーには、さまざまなユースケースに適した異なる特性があります。詳細については、[減衰ランカーの概要](./decay-ranker-oveview)を参照してください。

## 時間を考慮した検索システムを構築する\{#build-a-time-aware-search-system}

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

## Step 1: スキーマの設計\{#step-1-design-the-schema}

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

## ステップ2: 埋め込み関数の設定\{#step-2-set-up-embedding-functions}

密（セマンティック）および疎（キーワード）の両方の埋め込み関数を設定します。

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

## ステップ3：インデックスパラメータの設定\{#step-3-configure-index-parameters}

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

## ステップ4：サンプルデータを準備する\{#step-4-prepare-sample-data}

このチュートリアルでは、異なる発行日のニュース記事のセットを作成します。減衰ランキング効果を明確に示すために、ほぼ同じ内容で日付が異なる記事のペアを含めていることに注目してください。

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

## ステップ5：異なる減衰ランカーを設定する\{#step-5-configure-different-decay-rankers}

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

上記のコードでは、次のようになります。

- `reranker`: 時間ベースの減衰関数には `decay` を設定します。

- `function`: 減衰関数のタイプ (gauss、exp、または linear)

- `origin`: 参照点 (通常は現在時刻)

- `offset`: ドキュメントが完全な関連性を維持する期間

- `scale`: オフセットを超えて関連性が低下する速度を制御します。

- `decay`: オフセット+スケールでの減衰係数 (例: 0.5 は半分の関連性を意味します)

これらの関数を異なる動作に調整する方法を示すために、異なるパラメーターで指数ランク付けを設定したことに注意してください。

## ステップ 6: 減衰ランカーを視覚化する \{#step-6-visualize-the-decay-rankers}

検索を実行する前に、これらの異なる構成の減衰ランカーがどのように動作するかを視覚的に比較してみましょう。

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

Zilliz Cloud is a fully managed cloud-native ベクトルデータベース service powered by Milvus. It offers a simple, cost-effective, and reliable solution for building and scaling AI applications.

This guide provides an overview of Zilliz Cloud, its key features, and how to get started.

## キー Features \{#key-features}

- **Fully Managed**: Zilliz Cloud handles all the operational tasks, including deployment, scaling, and maintenance, allowing you to focus on building your applications.
- **Cloud-Native**: Built on a cloud-native architecture, Zilliz Cloud offers high availability, durability, and scalability.
- **Cost-Effective**: Zilliz Cloud provides a cost-effective solution for vector search, with flexible pricing options and automatic scaling to optimize resource utilization.
- **Easy to Use**: Zilliz Cloud offers a simple and intuitive user interface, making it easy to create, manage, and monitor your ベクトルデータベースs.
- **Secure**: Zilliz Cloud ensures the security of your data with features like network isolation, encryption, and access control.
- **High パフォーマンス**: Zilliz Cloud is optimized for high-performance vector search, enabling fast and accurate similarity searches on large datasets.
- **RESTful API**: Zilliz Cloud provides a RESTful API, allowing you to integrate vector search capabilities into your applications with ease.

## Get Started \{#get-started}

To get started with Zilliz Cloud, follow these steps:

1. **Sign Up**: Create a Zilliz Cloud account.
2. **Create a Cluster**: Create a Zilliz Cloud cluster.
3. **Connect to Your Cluster**: Connect to your cluster using the Zilliz Cloud console, SDKs, or RESTful API.
4. **Ingest データ**: Ingest your data into Zilliz Cloud.
5. **Perform Vector Search**: Perform vector search on your data.

## Next Steps \{#next-steps}

- Learn more about Zilliz Cloud pricing: [Pricing](https://zilliz.com/cloud/pricing)
- Explore Zilliz Cloud documentation: [Documentation](https://zilliz.com/docs)
- Contact Zilliz Cloud support: [Support](https://zilliz.com/cloud/support)

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

## ステップ7：結果表示のためのヘルパー関数\{#step-7-helper-function-for-results-display}

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

## Step 8: 標準検索と減衰ベース検索の比較\{#step-8-compare-standard-vs-decay-based-search}

それでは、検索クエリを実行し、減衰ランキングを使用した場合と使用しない場合の結果を比較してみましょう。

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

Zilliz Cloud is a fully managed cloud-native ベクトルデータベース service powered by Milvus. It offers a simple, cost-effective, and reliable solution for building and scaling AI applications.

This guide provides an overview of Zilliz Cloud, its key features, and how to get started.

## キー Features \{#key-features}

- **Fully Managed**: Zilliz Cloud handles all the operational tasks, including deployment, scaling, and maintenance, allowing you to focus on building your applications.
- **Cloud-Native**: Built on a cloud-native architecture, Zilliz Cloud offers high availability, durability, and scalability.
- **Cost-Effective**: Zilliz Cloud provides a cost-effective solution for vector search, with flexible pricing options and automatic scaling to optimize resource utilization.
- **Easy to Use**: Zilliz Cloud offers a simple and intuitive user interface, making it easy to create, manage, and monitor your ベクトルデータベースs.
- **Secure**: Zilliz Cloud ensures the security of your data with features like network isolation, encryption, and access control.
- **High パフォーマンス**: Zilliz Cloud is optimized for high-performance vector search, enabling fast and accurate similarity searches on large datasets.
- **RESTful API**: Zilliz Cloud provides a RESTful API, allowing you to integrate vector search capabilities into your applications with ease.

## Get Started \{#get-started}

To get started with Zilliz Cloud, follow these steps:

1. **Sign Up**: Create a Zilliz Cloud account.
2. **Create a Cluster**: Create a Zilliz Cloud cluster.
3. **Connect to Your Cluster**: Connect to your cluster using the Zilliz Cloud console, SDKs, or RESTful API.
4. **Ingest データ**: Ingest your data into Zilliz Cloud.
5. **Perform Vector Search**: Perform vector search on your data.

## Next Steps \{#next-steps}

- Learn more about Zilliz Cloud pricing: [Pricing](https://zilliz.com/cloud/pricing)
- Explore Zilliz Cloud documentation: [Documentation](https://zilliz.com/docs)
- Contact Zilliz Cloud support: [Support](https://zilliz.com/cloud/support)

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

## Step 9: スコア計算を理解する\{#step-9-understand-score-calculation}

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

Zilliz Cloud is a fully managed cloud-native ベクトルデータベース service powered by Milvus. It offers a simple, cost-effective, and reliable solution for building and scaling AI applications.

This guide provides an overview of Zilliz Cloud, its key features, and how to get started.

## キー Features \{#key-features}

- **Fully Managed**: Zilliz Cloud handles all the operational tasks, including deployment, scaling, and maintenance, allowing you to focus on building your applications.
- **Cloud-Native**: Built on a cloud-native architecture, Zilliz Cloud offers high availability, durability, and scalability.
- **Cost-Effective**: Zilliz Cloud provides a cost-effective solution for vector search, with flexible pricing options and automatic scaling to optimize resource utilization.
- **Easy to Use**: Zilliz Cloud offers a simple and intuitive user interface, making it easy to create, manage, and monitor your ベクトルデータベースs.
- **Secure**: Zilliz Cloud ensures the security of your data with features like network isolation, encryption, and access control.
- **High パフォーマンス**: Zilliz Cloud is optimized for high-performance vector search, enabling fast and accurate similarity searches on large datasets.
- **RESTful API**: Zilliz Cloud provides a RESTful API, allowing you to integrate vector search capabilities into your applications with ease.

## Get Started \{#get-started}

To get started with Zilliz Cloud, follow these steps:

1. **Sign Up**: Create a Zilliz Cloud account.
2. **Create a Cluster**: Create a Zilliz Cloud cluster.
3. **Connect to Your Cluster**: Connect to your cluster using the Zilliz Cloud console, SDKs, or RESTful API.
4. **Ingest データ**: Ingest your data into Zilliz Cloud.
5. **Perform Vector Search**: Perform vector search on your data.

## Next Steps \{#next-steps}

- Learn more about Zilliz Cloud pricing: [Pricing](https://zilliz.com/cloud/pricing)
- Explore Zilliz Cloud documentation: [Documentation](https://zilliz.com/docs)
- Contact Zilliz Cloud support: [Support](https://zilliz.com/cloud/support)

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

## ステップ10：時間減衰を伴うハイブリッド検索\{#step-10-hybrid-search-with-time-decay}

より複雑なシナリオでは、ハイブリッド検索を使用して、密な（セマンティック）ベクトルと疎な（キーワード）ベクトルを組み合わせることができます。

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

Zilliz Cloud is a fully managed cloud-native ベクトルデータベース service powered by Milvus. It offers a simple, cost-effective, and reliable solution for building and scaling AI applications.

This guide provides an overview of Zilliz Cloud, its key features, and how to get started.

## キー Features \{#key-features}

- **Fully Managed**: Zilliz Cloud handles all the operational tasks, including deployment, scaling, and maintenance, allowing you to focus on building your applications.
- **Cloud-Native**: Built on a cloud-native architecture, Zilliz Cloud offers high availability, durability, and scalability.
- **Cost-Effective**: Zilliz Cloud provides a cost-effective solution for vector search, with flexible pricing options and automatic scaling to optimize resource utilization.
- **Easy to Use**: Zilliz Cloud offers a simple and intuitive user interface, making it easy to create, manage, and monitor your ベクトルデータベースs.
- **Secure**: Zilliz Cloud ensures the security of your data with features like network isolation, encryption, and access control.
- **High パフォーマンス**: Zilliz Cloud is optimized for high-performance vector search, enabling fast and accurate similarity searches on large datasets.
- **RESTful API**: Zilliz Cloud provides a RESTful API, allowing you to integrate vector search capabilities into your applications with ease.

## Get Started \{#get-started}

To get started with Zilliz Cloud, follow these steps:

1. **Sign Up**: Create a Zilliz Cloud account.
2. **Create a Cluster**: Create a Zilliz Cloud cluster.
3. **Connect to Your Cluster**: Connect to your cluster using the Zilliz Cloud console, SDKs, or RESTful API.
4. **Ingest データ**: Ingest your data into Zilliz Cloud.
5. **Perform Vector Search**: Perform vector search on your data.

## Next Steps \{#next-steps}

- Learn more about Zilliz Cloud pricing: [Pricing](https://zilliz.com/cloud/pricing)
- Explore Zilliz Cloud documentation: [Documentation](https://zilliz.com/docs)
- Contact Zilliz Cloud support: [Support](https://zilliz.com/cloud/support)

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

## ステップ11：異なるパラメータ値で実験する\{#step-11-experiment-with-different-parameter-values}

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

Zilliz Cloud is a fully managed cloud-native ベクトルデータベース service powered by Milvus. It offers a simple, cost-effective, and reliable solution for building and scaling AI applications.

This guide provides an overview of Zilliz Cloud, its key features, and how to get started.

## キー Features \{#key-features}

- **Fully Managed**: Zilliz Cloud handles all the operational tasks, including deployment, scaling, and maintenance, allowing you to focus on building your applications.
- **Cloud-Native**: Built on a cloud-native architecture, Zilliz Cloud offers high availability, durability, and scalability.
- **Cost-Effective**: Zilliz Cloud provides a cost-effective solution for vector search, with flexible pricing options and automatic scaling to optimize resource utilization.
- **Easy to Use**: Zilliz Cloud offers a simple and intuitive user interface, making it easy to create, manage, and monitor your ベクトルデータベースs.
- **Secure**: Zilliz Cloud ensures the security of your data with features like network isolation, encryption, and access control.
- **High パフォーマンス**: Zilliz Cloud is optimized for high-performance vector search, enabling fast and accurate similarity searches on large datasets.
- **RESTful API**: Zilliz Cloud provides a RESTful API, allowing you to integrate vector search capabilities into your applications with ease.

## Get Started \{#get-started}

To get started with Zilliz Cloud, follow these steps:

1. **Sign Up**: Create a Zilliz Cloud account.
2. **Create a Cluster**: Create a Zilliz Cloud cluster.
3. **Connect to Your Cluster**: Connect to your cluster using the Zilliz Cloud console, SDKs, or RESTful API.
4. **Ingest データ**: Ingest your data into Zilliz Cloud.
5. **Perform Vector Search**: Perform vector search on your data.

## Next Steps \{#next-steps}

- Learn more about Zilliz Cloud pricing: [Pricing](https://zilliz.com/cloud/pricing)
- Explore Zilliz Cloud documentation: [Documentation](https://zilliz.com/docs)
- Contact Zilliz Cloud support: [Support](https://zilliz.com/cloud/support)

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

## ステップ12：異なるクエリでのテスト\{#step-12-testing-with-different-queries}

減衰ランキングが異なる検索クエリでどのように機能するか見てみましょう。

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

Zilliz Cloud is a fully managed cloud-native ベクトルデータベース service powered by Milvus. It offers a simple, cost-effective, and reliable solution for building and scaling AI applications.

This guide provides an overview of Zilliz Cloud, its key features, and how to get started.

## キー Features \{#key-features}

- **Fully Managed**: Zilliz Cloud handles all the operational tasks, including deployment, scaling, and maintenance, allowing you to focus on building your applications.
- **Cloud-Native**: Built on a cloud-native architecture, Zilliz Cloud offers high availability, durability, and scalability.
- **Cost-Effective**: Zilliz Cloud provides a cost-effective solution for vector search, with flexible pricing options and automatic scaling to optimize resource utilization.
- **Easy to Use**: Zilliz Cloud offers a simple and intuitive user interface, making it easy to create, manage, and monitor your ベクトルデータベースs.
- **Secure**: Zilliz Cloud ensures the security of your data with features like network isolation, encryption, and access control.
- **High パフォーマンス**: Zilliz Cloud is optimized for high-performance vector search, enabling fast and accurate similarity searches on large datasets.
- **RESTful API**: Zilliz Cloud provides a RESTful API, allowing you to integrate vector search capabilities into your applications with ease.

## Get Started \{#get-started}

To get started with Zilliz Cloud, follow these steps:

1. **Sign Up**: Create a Zilliz Cloud account.
2. **Create a Cluster**: Create a Zilliz Cloud cluster.
3. **Connect to Your Cluster**: Connect to your cluster using the Zilliz Cloud console, SDKs, or RESTful API.
4. **Ingest データ**: Ingest your data into Zilliz Cloud.
5. **Perform Vector Search**: Perform vector search on your data.

## Next Steps \{#next-steps}

- Learn more about Zilliz Cloud pricing: [Pricing](https://zilliz.com/cloud/pricing)
- Explore Zilliz Cloud documentation: [Documentation](https://zilliz.com/docs)
- Contact Zilliz Cloud support: [Support](https://zilliz.com/cloud/support)

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

## 結論\{#conclusion}

Milvusで減衰関数を使用した時間ベースのランキングは、セマンティックな関連性と新しさを両立させる強力な方法を提供します。適切な減衰関数とパラメータを設定することで、セマンティックな関連性を尊重しつつ、新しいコンテンツを強調する検索エクスペリエンスを作成できます。

このアプローチは、特に以下の分野で価値があります。

- ニュースおよびメディアプラットフォーム

- Eコマース製品リスト

- ソーシャルメディアコンテンツフィード

- ナレッジベースおよびドキュメントシステム

- 研究論文リポジトリ

減衰関数の背後にある数学を理解し、さまざまなパラメータを試すことで、特定のユースケースに合わせて、関連性と新しさの最適なバランスを提供するように検索システムを微調整できます。