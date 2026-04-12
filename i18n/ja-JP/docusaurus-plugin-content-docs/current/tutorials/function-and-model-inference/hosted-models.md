---
title: "ホスト型モデル | Cloud"
slug: /hosted-models
sidebar_label: "ホスト型モデル"
beta: PRIVATE
notebook: FALSE
description: "Zilliz Cloudは、Zillizが管理するインフラストラクチャ上で埋め込みモデルと再ランキングモデルをホストできます。専用のフルマネージドモデルインスタンスをデプロイし、Zilliz Cloudから直接使用することで、安定した高性能な推論を実現できます。"
type: origin
token: DMrCwn4LXi1uKBkbHGfcpGnsnyh
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - モデル
  - 推論
  - ホスト型モデル

---

import Admonition from '@theme/Admonition';


# ホスト型モデル

Zilliz Cloudは、Zillizが管理するインフラストラクチャ上で**埋め込み**モデルと**再ランキング**モデルをホストできます。専用の完全に管理されたモデルインスタンスをデプロイし、Zilliz Cloudから直接使用して、安定した高性能な推論を行うことができます。

管理されたモデルインスタンスを使用すると、生データをコレクションに挿入できます。Zilliz Cloudは、取り込み中にデプロイされたモデルでベクトル埋め込みを自動的に生成します。セマンティック検索の場合、生のクエリテキストを提供するだけです。Zilliz Cloudは同じモデルを使用してクエリベクトルを作成し、保存されたベクトルと比較して、最も関連性の高い結果を返します。

次の図は、ホスト型モデルを使用する手順を示しています。

![NkgEwmrJDhyXiubY6HpcssaynHg](https://zdoc-images.s3.us-west-2.amazonaws.com/NkgEwmrJDhyXiubY6HpcssaynHg.png)

## モデルをデプロイする\{#deploy-a-model}

現在、Zilliz Cloudは以下のリージョン、インスタンスタイプ、モデルをサポートしています。

<Admonition type="info" icon="📘" title="Notes">

<p>ホスト型モデルに関する特定の要件がある場合は、<a href="http://support.zilliz.com">お問い合わせください</a>。</p>

</Admonition>

### サポートされているリージョン\{#supported-regions}

モデルのデプロイリージョンは、クラスターのリージョンと一致している必要があります。利用可能なオプションは次のとおりです。

<table>
   <tr>
     <th><p><strong>リージョン</strong></p></th>
     <th><p><strong>ロケーション</strong></p></th>
   </tr>
   <tr>
     <td><p>aws-us-west-2</p></td>
     <td><p>オレゴン州、米国</p></td>
   </tr>
</table>

### サポートされているインスタンスタイプ\{#supported-instance-type}

インスタンスタイプは、利用可能なコンピューティングリソースを決定します。利用可能なオプションは次のとおりです。

<table>
   <tr>
     <th><p><strong>インスタンスタイプ</strong></p></th>
     <th><p><strong>リソース</strong></p></th>
   </tr>
   <tr>
     <td><p>g6.xlarge </p></td>
     <td><ul><li><p>1 Nvidia L4 GPU</p></li><li><p>8 vCPU</p></li><li><p>32 GB RAM</p></li></ul></td>
   </tr>
</table>

### サポートされているモデル\{#supported-models}

利用可能なオプションは次のとおりです。

<table>
   <tr>
     <th><p><strong>タイプ</strong></p></th>
     <th><p><strong>モデル</strong></p></th>
   </tr>
   <tr>
     <td rowspan="9"><p>Embedding</p></td>
     <td><p>Qwen/Qwen3-Embedding-0.6B</p></td>
   </tr>
   <tr>
     <td><p>Qwen/Qwen3-Embedding-4B</p></td>
   </tr>
   <tr>
     <td><p>Qwen/Qwen3-Embedding-8B</p></td>
   </tr>
   <tr>
     <td><p>BAAI/bge-small-en-v1.5</p></td>
   </tr>
   <tr>
     <td><p>BAAI/bge-small-zh-v1.5</p></td>
   </tr>
   <tr>
     <td><p>BAAI/bge-base-en-v1.5</p></td>
   </tr>
   <tr>
     <td><p>BAAI/bge-base-zh-v1.5</p></td>
   </tr>
   <tr>
     <td><p>BAAI/bge-large-en-v1.5</p></td>
   </tr>
   <tr>
     <td><p>BAAI/bge-large-zh-v1.5</p></td>
   </tr>
   <tr>
     <td rowspan="5"><p>Reranking</p></td>
     <td><p>BAAI/bge-reranker-base</p></td>
   </tr>
   <tr>
     <td><p>BAAI/bge-reranker-large</p></td>
   </tr>
   <tr>
     <td><p>Qwen/Qwen3-Reranker-0.6B</p></td>
   </tr>
   <tr>
     <td><p>Qwen/Qwen3-Reranker-4B</p></td>
   </tr>
   <tr>
     <td><p>Qwen/Qwen3-Reranker-8B</p></td>
   </tr>
   <tr>
     <td><p>Semantic ハイライター</p></td>
     <td><p>zilliz/semantic-highlight-bilingual-v1</p></td>
   </tr>
</table>

## デプロイメントIDを取得する\{#obtain-a-deployment-id}

お客様から提供された情報に基づき、Zillizがモデルをデプロイします。これには約15分かかります。デプロイの準備が整うと、Zilliz Cloudサポートから**デプロイメントID**が返されます。このIDは、埋め込み関数または再ランキング関数を作成する際に使用します。

```bash
"deploymentId": "68f8889be4b01215a275972a"
```

## 関数でデプロイされたモデルを使用する\{#use-the-deployed-model-in-a-function}

**デプロイメントID**を取得したら、埋め込み関数または再ランキング関数を介して、デプロイされたモデルを使用するコレクションを作成できます。

### 埋め込み関数を使用する\{#use-an-embedding-function}

1. 埋め込み関数を使用してコレクションを作成します。

    - 生のテキスト用に少なくとも1つの`VARCHAR`フィールドを定義します。

    - モデルによって生成された埋め込みベクトル用に少なくとも1つのベクトルフィールドを定義します。

    - ベクトルフィールドの次元をモデルの出力次元と一致するように設定します。

    ```python
    schema = milvus_client.create_schema()
    schema.add_field("id", DataType.INT64, is_primary=True, auto_id=False)
    schema.add_field("document", DataType.VARCHAR, max_length=9000)
    schema.add_field("dense", DataType.FLOAT_VECTOR, dim=384) # important, the dimension must be supported by the deployed model.
    
    # define embedding function
    text_embedding_function = Function(
        name="zilliz-bge-small-en-v1.5",
        function_type=FunctionType.TEXTEMBEDDING,
        input_field_names=["document"], # Scalar field(s) containing text data to embed
        output_field_names="dense", # Vector field(s) for storing embeddings
     # highlight-start
        params={
            "provider": "zilliz",
            "model_deployment_id": "...", # Use the model deployment ID we provide you
            "truncation": True, # Optional: if true, inputs greater than the max supported input length of the model will be truncated
            "dimension": "384",                # Optional: Shorten the output vector dimension, only if supported by the model
        }
    # highlight-end
    )
    
    schema.add_function(text_embedding_function)
    
    index_params = milvus_client.prepare_index_params()
    index_params.add_index(
        field_name="dense",
        index_name="dense_index",
        index_type="AUTOINDEX",
        metric_type="IP",
    )
    
    ret = milvus_client.create_collection(collection_name, schema=schema, index_params=index_params, consistency_level="Strong")
    ```

1. 生のテキストデータを挿入します。

    生のテキストのみをコレクションに挿入します。Zilliz Cloud は自動的に埋め込み関数を呼び出し、ベクトルフィールドにデータを投入します。

    ```python
    rows = [
            {"id": 1, "document": "Artificial intelligence was founded as an academic discipline in 1956."},
            {"id": 2, "document": "Alan Turing was the first person to conduct substantial research in AI."},
            {"id": 3, "document": "Born in Maida Vale, London, Turing was raised in southern England."},
    ]
    
    insert_result = milvus_client.insert(collection_name, rows, progress_bar=True)
    
    ```

1. 生のテキストデータで類似性検索を実行します。

    クエリは生のテキストとして提供します。Zilliz Cloud は同じモデルを使用してクエリベクトルを生成し、類似性検索を実行します。

    ```python
    search_params = {
        "params": {"nprobe": 10},
    }
    queries = ["When was artificial intelligence founded", 
               "Where was Alan Turing born?"]
    
    result = milvus_client.search(collection_name, data=queries, anns_field="dense", search_params=search_params, limit=3, output_fields=["document"], consistency_level="Strong")
    ```

### リランキング関数を使用する\{#use-a-reranking-function}

デプロイされたモデルを使用して検索結果をリランキングするリランキング関数を設定することもできます。

```python
import numpy as np
rng = np.random.default_rng(seed=19530)
vectors_to_search = rng.random((1, dim))

# define reranking function
ranker = Function(
    name="model_rerank_fn",
    input_field_names=["document"],
    function_type=FunctionType.RERANK,
    params={
        "reranker": "model", 
        "provider": "zilliz",
        "model_deployment_id": "...", # Use the model deployment ID we provide you,
        "queries": ["machine learning for time series"] * len(vectors_to_search),  # Query text, the number of query strings must match exactly the number of queries in your search operation
    }
)

# Use it during search
result = milvus_client.search(collection_name, vectors_to_search, limit=3, output_fields=["*"], ranker=ranker)
```

### セマンティックハイライター機能を使用する\{#use-a-semantic-highlighter-function}

検索中、ホストされたハイライターモデルを使用して、ユーザーのクエリと意味的に関連するテキストセグメントを強調表示することで、検索結果を後処理できます。  

```python
from pymilvus import SemanticHighlighter

# Define the search query
queries = ["When was artificial intelligence founded"]

# Configure semantic highlighter
# highlight-start
highlighter = SemanticHighlighter(
    queries,
    ["document"],                           # Fields to highlight
    pre_tags=["<mark>"],                    # Tag before highlighted text
    post_tags=["</mark>"],                  # Tag after highlighted text
    model_deployment_id="YOUR_MODEL_ID",    # Deployed highlight model ID
)
# highlight-end

# Perform search with highlighting
results = milvus_client.search(
    collection_name,
    data=queries,
    anns_field="dense",
    search_params={"params": {"nprobe": 10}},
    limit=3,
    output_fields=["document"],
    highlighter=highlighter
)

# Process results
for hits in results:
    for hit in hits:
        highlight = hit.get("highlight", {}).get("document", {})
        print(f"ID: {hit['id']}")
        print(f"Search Score: {hit['distance']:.4f}")      # Vector similarity score
        print(f"Fragments: {highlight.get('fragments', [])}")
        print(f"Highlight Confidence: {highlight.get('scores', [])}")  # Semantic relevance score
        print()
```

## 請求\{#billing}

ホスト型モデルを使用する場合、関数およびモデルサービスの料金のみが発生します。推論はZilliz Cloud内で実行されるため、データがパブリックインターネットを通過することはありません。したがって、データ転送料金は発生しません。

地域ごとのモデル単価については、[営業担当者にお問い合わせください](http://zilliz.com/contact-sales)。

### コスト計算\{#cost-calculation}

```plaintext
Function and Model Services Cost = Model Unit Price x Usage Time
```

- **モデル単価**: 詳細については、[営業担当者にお問い合わせください](http://zilliz.com/contact-sales)。

- **使用時間**: モデルがアクティブに使用されているかどうかに関わらず、モデルデプロイメントが実行されている合計時間（時間単位）。

