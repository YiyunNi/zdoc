---
title: "Cohere Ranker | Cloud"
slug: /cohere-model-ranker
sidebar_key: cohere-model-ranker
sidebar_label: "Cohere Ranker"
beta: FALSE
notebook: FALSE
description: "Cohere Ranker は、Cohere のリランクモデルを活用し、取得した候補に対してセマンティックリランキングを適用することで、結果の順序を改善します。 | Cloud"
type: origin
token: Mtxfwvu2fiOLwXkcURCcJxDPnLd
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - データ
  - 検索結果のリランキング
  - 結果のリランキング
  - リランキングモデル
  - モデルランカー
  - cohere

---

import Admonition from '@theme/Admonition';


# Cohere Ranker

Cohere Ranker は [Cohere](https://cohere.com/) のリランクモデルを活用し、取得した候補に対してセマンティックリランキングを適用することで、結果の順序を改善します。

retrieval や embedding 関数とは異なり、Cohere Ranker は **取得後ステップ** として実行されます。クエリとドキュメントテキスト間のセマンティック関連性を評価し、候補結果をそれに応じて並べ替えます。

Cohere Ranker は特に以下の場合に有用です：

- 取得結果は関連しているが、理想的な順序になっていない場合

- ベクトル距離だけでなく、セマンティック関連性が重要な場合

- 多言語または長文のリランキングが必要な場合

## 始める前に\{#before-you-start}

Cohere Ranker を使用する前に、以下の前提条件が満たされていることを確認してください。

- **リランクモデルを選択**

    使用する Cohere のリランクモデルを決定します。例：`rerank-english-v3.0`。選択したモデルが、リランキング時のセマンティック関連性の評価方法を決定します。詳細については、[Cohere 公式ドキュメント](https://docs.cohere.com/docs/models#rerank) を参照してください。

- **Cohere と統合し、統合ID を取得する**

    Cohere Ranker を使用するには、まず [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) で Cohere をモデルプロバイダーとして統合する必要があります。詳細な手順については、[モデルプロバイダーとの統合](./integrate-with-model-providers) を参照してください。

- **リランク可能なテキストフィールドを含むコレクションスキーマを計画する**

    コレクションに、リランキング対象のテキストを含む `VARCHAR` フィールドが1つ含まれていることを確認してください。

## Cohere Ranker を使用する\{#use-cohere-ranker}

このセクションでは、検索時に Cohere Ranker を適用して取得結果をリランクする方法を説明します。

Cohere Ranker は **検索時** に定義および適用され、クエリごとにリランキングの有効化/無効化を行うことができます。

### 準備\{#preparations}

以下のセットアップでは、検索およびリランキング用のコレクションとサンプルデータを準備します。

<details>

<summary><strong>サンプルデータを含むコレクションを準備する</strong></summary>

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(
    uri="YOUR_ZILLIZ_CLOUD_URI",
    token="YOUR_ZILLIZ_CLOUD_TOKEN",
)

collection_name = "cohere_rerank_demo"

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

### リランク関数の定義\{#define-the-rerank-function}

Cohere Ranker は、コレクションスキーマの一部としてではなく、**検索時**に定義されます。

リランク関数は以下の内容を指定します：

- リランク対象のテキストフィールド（`VARCHAR`）

- 使用する Cohere リランクモデル

- 関連性を評価するクエリテキスト

```python
from pymilvus import Function, FunctionType

cohere_ranker = Function(
    name="cohere_semantic_ranker",
    input_field_names=["document"],
    # highlight-next-line
    function_type=FunctionType.RERANK,
    params={
        "reranker": "model",
        "provider": "cohere",
        "model_name": "rerank-english-v3.0",
        "queries": ["renewable energy developments"],

        "integration_id": "YOUR_INTEGRATION_ID",

    }
)
```

<Admonition type="info" icon="📘" title="Notes">

`queries` 内の文字列の数は、検索リクエストで発行されたクエリの数と一致している必要があります。

</Admonition>

### rerank 関数を使用した検索\{#search-with-the-rerank-function}

```python
query_vector = [0.12, 0.21, 0.29, 0.41]

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field="dense",
    limit=3,
    output_fields=["document"],
    # highlight-next-line
    ranker=cohere_ranker,
)

print(results)
```

この検索中：

1. Zilliz Cloud はベクトル検索を使用して候補を取得します。

1. Cohere Ranker は各候補のセマンティック関連性を評価します。

1. 結果セットは返される前に並べ替えられます。

## 次のステップ\{#next-steps}

Cohere Ranker はハイブリッド検索でも使用できます。

検索とハイブリッド検索では、ランカーの適用方法は同じです。

いずれの場合も、検索時に `ranker` パラメーターで rerank 関数を渡します。

詳細については、[マルチベクトルハイブリッド検索](./hybrid-search) を参照してください。

