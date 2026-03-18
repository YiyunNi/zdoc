---
title: "Cohere ランカー | Cloud"
slug: /cohere-model-ranker
sidebar_label: "Cohere ランカー"
beta: FALSE
notebook: FALSE
description: "Cohere ランカーは、Cohere の再ランクモデルを活用し、取得された候補に対してセマンティックな再ランキングを適用することで、結果の順序を改善します。| Cloud"
type: origin
token: Mtxfwvu2fiOLwXkcURCcJxDPnLd
sidebar_position: 4
keywords:
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - data
  - 検索結果の再ランキング
  - 結果の再ランキング
  - 再ランキングモデル
  - モデルランカー
  - cohere

---

import Admonition from '@theme/Admonition';


# Cohere ランカー

Cohere ランカーは、[Cohere](https://cohere.com/) の再ランクモデルを活用し、取得された候補に対してセマンティックな再ランクを適用することで、結果の順序付けを改善します。

検索や埋め込み（embedding）関数とは異なり、Cohere ランカーは **取得後ステップ** として実行されます。このステップでは、クエリとドキュメントテキスト間のセマンティックな関連性を評価し、それに応じて候補結果を並べ替えます。

Cohere ランカーは、以下のケースで特に有用です。

- 取得された結果は関連性があるものの、理想的な順序になっていない場合
- ベクトル距離だけでなく、セマンティックな関連性が重要となる場合
- 多言語または長文テキストに対する再ランクが必要な場合

## 利用前の準備\{#before-you-start}

Cohere ランカーを使用する前に、以下の前提条件を満たしていることを確認してください。

- **再ランクモデルを選択**

    `rerank-english-v3.0` のような Cohere の再ランクモデルをどれにするか決定します。選択したモデルによって、再ランク時のセマンティック関連性の評価方法が決まります。詳細については、[Cohere 公式ドキュメント](https://docs.cohere.com/docs/models#rerank) を参照してください。

- **Cohere と統合し、統合IDを取得**

    Cohere ランカーを使用するには、まず [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) で Cohere をモデルプロバイダーとして統合する必要があります。手順の詳細については、[モデルプロバイダーとの統合](./integrate-with-model-providers) を参照してください。

- **再ランク可能なテキストフィールドを含むコレクションスキーマを設計**

    コレクションに、再ランク対象のテキストを含む `VARCHAR` 型のフィールドが1つ含まれていることを確認してください。

## Cohere ランカーの使用\{#use-cohere-ranker}

このセクションでは、検索時に Cohere ランカーを適用して取得結果を再ランクする方法を説明します。

Cohere ランカーは検索時に定義・適用されるため、クエリごとに再ランクを有効化または無効化できます。

### 準備\{#preparations}

以下のセットアップにより、検索および再ランク用のコレクションとサンプルデータを準備します。

<details>

<summary><strong>サンプルデータ付きコレクションを準備</strong></summary>

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(
    uri="YOUR_ZILLIZ_CLOUD_URI",
    token="YOUR_ZILLIZ_CLOUD_TOKEN",
)

collection_name = "cohere_rerank_demo"

# コレクションスキーマを定義
schema = client.create_schema()

schema.add_field("id", DataType.INT64, is_primary=True, auto_id=False)
schema.add_field("document", DataType.VARCHAR, max_length=1000)
schema.add_field("dense", DataType.FLOAT_VECTOR, dim=4)

# インデックスを設定
index_params = client.prepare_index_params()

index_params.add_index(
    field_name="dense",
    index_type="AUTOINDEX",
    metric_type="COSINE"
)

# コレクションを作成
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)

# サンプルデータを挿入
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

### 再ランク関数の定義\{#define-the-rerank-function}

Cohere ランカーは、コレクションスキーマの一部としてではなく、**検索時**に定義されます。

再ランク関数は以下の内容を指定します：

- 再ランク対象のテキストフィールド（`VARCHAR`）

- 使用する Cohere 再ランクモデル

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

<p><code>queries</code> 内の文字列の数は、検索リクエストで発行されたクエリの数と一致している必要があります。</p>

</Admonition>

### 再ランク機能を使用した検索\{#search-with-the-rerank-function}

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

この検索の際に、以下の処理が行われます。

1. Zilliz Cloud はベクトル検索を用いて候補を取得します。

1. Cohere ランカーが各候補のセマンティック関連性を評価します。

1. 結果セットは返却前に並べ替えられます。

## 次のステップ\{#next-steps}

Cohere ランカーはハイブリッド検索でも使用できます。

通常の検索とハイブリッド検索では、ランカーの適用方法は同じです。

いずれの場合も、検索時に `ranker` パラメータ経由で再ランク関数を渡します。

詳細については、[Multi-Vector Hybrid Search](./hybrid-search) を参照してください。