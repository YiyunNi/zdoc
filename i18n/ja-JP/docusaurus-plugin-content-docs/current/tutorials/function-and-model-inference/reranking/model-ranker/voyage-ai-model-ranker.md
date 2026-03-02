---
title: "Voyage AI Ranker | Cloud"
slug: /voyage-ai-model-ranker
sidebar_label: "Voyage AI Ranker"
beta: FALSE
notebook: FALSE
description: "Voyage AI Ranker は、Voyage AI と検索アプリケーションを活用します。| Cloud"
type: origin
token: PpGlwYU6PiSsfVkZ7doco50vnKg
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - データ
  - 検索結果の再ランキング
  - 結果の再ランキング
  - 再ランキングモデル
  - モデルランカー
  - voyage ai
  - マルチモーダル検索
  - ベクトル検索アルゴリズム
  - 質問応答システム
  - llm-as-a-judge

---

import Admonition from '@theme/Admonition';


# Voyage AI Ranker

Voyage AI Ranker は、[Voyage AI](https://www.voyageai.com/) の専門的なリランカーを活用して、セマンティックなリランキングを通じて検索の関連性を高めます。これは、検索拡張生成 (RAG) および検索アプリケーション向けに最適化された、高性能なリランキング機能を提供します。

Voyage AI Ranker は、特に次のようなアプリケーションで役立ちます。

- リランキングタスクのために特別にトレーニングされたモデルによる高度なセマンティック理解

- 本番ワークロード向けに最適化された推論による高性能処理

- さまざまなドキュメント長に対応するための柔軟な切り捨て制御

- さまざまなモデルバリアント (rerank-2、rerank-lite など) 全体で微調整されたパフォーマンス

## 開始する前に{#before-you-start}

Voyage AI Ranker を使用する前に、以下の前提条件が満たされていることを確認してください。

- **リランクモデルを選択する**

    `rerank-2.5` など、使用する Cohere リランクモデルを決定します。選択したモデルによって、リランキング中にセマンティックな関連性がどのように評価されるかが決まります。詳細については、[Voyage AI 公式ドキュメント](https://docs.voyageai.com/docs/reranker)を参照してください。

- **Voyage AI と統合し、統合 ID を取得する**

    Voyage AI Ranker を使用するには、まず [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)で Voyage AI をモデルプロバイダーとして統合する必要があります。

    統合後、Zilliz Cloud は**統合 ID** を生成します。これは、リランク関数を定義する際に参照します。詳細な手順については、[モデルプロバイダーとの統合](./integrate-with-model-providers)を参照してください。

- **リランキング可能なテキストフィールドを持つコレクションスキーマを計画する**

    コレクションに、リランキングするテキストを含む `VARCHAR` フィールドが 1 つ含まれていることを確認してください。

## Voyage AI Ranker を使用する{#use-voyage-ai-ranker}

このセクションでは、検索中に Voyage AI Ranker を適用して、取得した結果をリランキングする方法を示します。

リランク関数は検索時に定義および適用され、クエリごとにリランキング動作を有効、無効、または変更できます。

### 準備{#preparations}

以下の設定は、検索とリランキングのためのコレクションとサンプルデータを準備します。

<details>

<summary><strong>サンプルデータを含むコレクションを準備する</strong></summary>

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(
    uri="YOUR_ZILLIZ_CLOUD_URI",
    token="YOUR_ZILLIZ_CLOUD_TOKEN",
)

collection_name = "voyage_rerank_demo"

# Define collection schema
schema = client.create_schema()
schema.add_field("id", DataType.INT64, is_primary=True, auto_id=False)
schema.add_field("document", DataType.VARCHAR, max_length=1000)
schema.add_field("dense", DataType.FLOAT_VECTOR, dim=4)

# Configure index
index_params = client.prepare_index_params()
index_params.add_index(
    field_name="dense",
    index_type="AUTOINDEX",
    metric_type="COSINE"
)

# Create collection
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)

# Insert sample data
data = [
    {
        "id": 1,
        "document": "Recent renewable energy developments include improved solar efficiency.",
        "dense": [0.10, 0.20, 0.30, 0.40],
    },
    {
        "id": 2,
        "document": "Climate policy and carbon markets have evolved rapidly in recent years.",
        "dense": [0.11, 0.19, 0.28, 0.39],
    },
    {
        "id": 3,
        "document": "New battery technology helps stabilize wind and solar power generation.",
        "dense": [0.90, 0.10, 0.05, 0.02],
    },
    {
        "id": 4,
        "document": "Vector databases support similarity search for machine learning applications.",
        "dense": [0.01, 0.02, 0.03, 0.04],
    },
]

client.insert(collection_name, data)
```

</details>

### リランク関数の定義{#define-the-rerank-function}

Voyage AI Rankerは、コレクションのschemaの一部としてではなく、**検索時に**定義されます。

リランク関数は以下を指定します。

- リランクするテキストフィールド（`VARCHAR`）

- 使用するVoyage AIモデル

- クエリとドキュメントがどのように切り詰められるか、または検証されるか

```python
from pymilvus import Function, FunctionType

voyage_ranker = Function(
    name="voyage_semantic_ranker",
    input_field_names=["document"],
    function_type=FunctionType.RERANK,
    params={
        "reranker": "model",
        "provider": "voyageai",
        "model_name": "rerank-2.5",
        "queries": ["renewable energy developments"],
        "truncation": True,

        "integration_id": "YOUR_INTEGRATION_ID",

    }
)
```

<Admonition type="info" icon="📘" title="Notes">

<p><code>queries</code> 内の文字列の数は、検索リクエストで発行されたクエリの数と一致する必要があります。</p>

</Admonition>

### rerank 関数を使用した検索{#search-with-the-rerank-function}

```python
query_vector = [0.12, 0.21, 0.29, 0.41]

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field="dense",
    limit=3,
    output_fields=["document"],
    # highlight-next-line
    ranker=voyage_ranker,
)

print(results)
```

この検索中：

1. ベクトル検索を使用して候補が取得されます。

1. Voyage AI Ranker は、各候補のセマンティックな関連性を評価します。

1. 結果セットは、返される前に並べ替えられます。

## 次のステップ{#next-steps}

Voyage AI Ranker は、ハイブリッド検索でも使用できます。

検索とハイブリッド検索は、同じ方法でランカーを適用します。

どちらの場合も、検索時に `ranker` パラメーターを介して rerank 関数を渡します。

詳細については、「[Multi-Vector Hybrid Search](./hybrid-search)」を参照してください。