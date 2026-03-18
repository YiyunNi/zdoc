---
title: "埋め込みリストによる検索 | BYOC"
slug: /search-with-embeddinglist
sidebar_label: "埋め込みリスト"
beta: FALSE
notebook: FALSE
description: "このページでは、Zilliz Cloud の構造体配列を使用して ColBERT テキスト検索システムと ColPali テキスト検索システムを設定する方法について説明します。これにより、ドキュメントとそのベクトル化されたチャンクを埋め込みリストに格納できます。| BYOC"
type: origin
token: Mf7GwGwgQiLCcykOi69cvaD8ncz
sidebar_position: 15
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - data
  - embeddinglist
  - search
  - colbert
  - colpali

---

import Admonition from '@theme/Admonition';


# Embedding リストによる検索

このページでは、Zilliz Cloud の構造体の配列（配列 of 構造体s）を使用して ColBERT テキスト検索システムおよび ColPali テキスト検索システムを設定する方法について説明します。これにより、ドキュメントとそのベクトル化されたチャンクを embedding リストとして一緒に保存できます。

## 概要\{#overview}

テキスト検索システムを構築する際には、特に長いドキュメントにおいて全文埋め込みを行うと意味的な特異性が希薄化されたり、モデルの入力制限を超えたりする可能性があるため、ドキュメントをチャンクに分割し、各チャンクとその埋め込みをベクトルデータベース内のエンティティとして保存することで精度と正確性を確保する必要があります。

しかし、チャンク単位でデータを保存すると、検索結果もチャンク単位となり、検索初期段階では一貫した*ドキュメント*ではなく関連する*セグメント*が特定されることになります。これを解決するには、検索後の追加処理が必要です。

ColBERT（arXiv: [2004.12832](https://arxiv.org/abs/2004.12832)）は、BERT 上でのコンテキスト化された late interaction（後方相互作用）を通じて効率的かつ効果的なパッセージ検索を実現するテキスト-テキスト検索システムです。クエリとドキュメントをそれぞれ独立してトークン単位でエンコードし、それらの類似度を計算します。

### トークン単位のエンコード\{#token-wise-encoding}

ColBERT におけるデータ取り込み時、各ドキュメントはトークンに分割され、その後ベクトル化されて embedding リストとして保存されます。これは次のように表されます：  
$d \rightarrow E_d = [e_{d1}, e_{d2}, \dots, e_{dn}] ∈ \R^\{n×d}$。  
クエリが到着すると、同様にトークン化・ベクトル化され、embedding リストとして保存されます：  
$q \rightarrow E_q = [e_{q1}, e_{q2}, \dots, e_{qm}] ∈ \R^\{m×d}$。

上記の式において、

- $d$: ドキュメント
- $q$: クエリ
- $E_d$: ドキュメントを表す embedding リスト
- $E_q$: クエリを表す embedding リスト
- $[e_{d1}, e_{d2}, \dots, e_{dn}] ∈ \R^\{n×d}$: ドキュメントを表す embedding リスト内のベクトル埋め込み数は $\R^\{n×d}$ の範囲内にある
- $[e_{q1}, e_{q2}, \dots, e_{qm}] ∈ \R^\{m×d}$: クエリを表す embedding リスト内のベクトル埋め込み数は $\R^\{m×d}$ の範囲内にある

### Late interaction（後方相互作用）\{#late-interaction}

ベクトル化が完了すると、クエリの embedding リストと各ドキュメントの embedding リストがトークン単位で比較され、最終的な類似度スコアが算出されます。

![BqBlwM4OOh6hM9bmNwbc2xUUnxc](https://zdoc-images.s3.us-west-2.amazonaws.com/BqBlwM4OOh6hM9bmNwbc2xUUnxc.png)

上記の図では、クエリに「machine」と「learning」の2つのトークンが含まれており、ウィンドウ内のドキュメントには「neural」「network」「python」「tutorial」の4つのトークンが含まれています。これらのトークンがベクトル化されると、各クエリトークンのベクトル埋め込みがドキュメント内のベクトル埋め込みと比較され、類似度スコアのリストが得られます。その後、各スコアリストから最も高いスコアを取り出し、それらを合計して最終スコアを算出します。このドキュメントの最終スコアを決定するプロセスは、最大類似度（**MAX_SIM**）と呼ばれます。最大類似度の詳細については、[Maximum similarity](./search-metrics-explained#maximum-similarity) を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<p>Milvus で ColBERT に類似したテキスト検索システムを実装する場合、ドキュメントをトークンに分割する必要はありません。</p>
<p>代わりに、ドキュメントを適切なサイズのセグメントに分割し、各セグメントを埋め込んで embedding リストを作成し、その埋め込まれたセグメントとともにドキュメントをエンティティとして保存できます。</p>

</Admonition>

### ColPali 拡張\{#colpali-extension}

ColBERT を基盤として、ColPali（arXiv: [2407.01449](https://arxiv.org/abs/2407.01449?spm=a2ty_o01.29997173.0.0.31c4c9217HFv28&file=2407.01449)）は、Vision-言語 Models（VLM）を活用した視覚的に豊かなドキュメント検索の新しいアプローチを提案しています。データ取り込み時、各ドキュメントページは高解像度画像にレンダリングされ、トークン化される代わりにパッチに分割されます。例えば、448 x 448 ピクセルのドキュメントページ画像は、14 x 14 ピクセルの 1,024 個のパッチを生成できます。

この手法により、テキストのみの検索システムでは失われるドキュメントのレイアウト、画像、テーブル構造などの非テキスト情報を保持できます。

![SuHjwmWiDhLs79buw22cw9aAnqf](https://zdoc-images.s3.us-west-2.amazonaws.com/SuHjwmWiDhLs79buw22cw9aAnqf.png)

ColPali で使用される VLM は PaliGemma（arXiv: [2407.07726](https://arxiv.org/html/2407.07726v2#S1)）と呼ばれ、画像エンコーダ（**SigLIP-400M**）、デコーダ専用言語モデル（**Gemma2-2B**）、および画像エンコーダの出力を言語モデルのベクトル空間に投影する線形層で構成されています（上記の図を参照）。

データ取り込み時、生画像として表現されたドキュメントページは複数の視覚的パッチに分割され、各パッチが埋め込まれてベクトル埋め込みのリストが生成されます。その後、これらは言語モデルのベクトル空間に投影され、最終的な embedding リストが得られます：  
$d \rightarrow E_d = [e_{d1}, e_{d2}, \dots, e_{dn}] ∈ \R^\{n×d}$。  
クエリが到着すると、トークン化され、各トークンが埋め込まれてベクトル埋め込みのリストが生成されます：  
$q \rightarrow E_q = [e_{q1}, e_{q2}, \dots, e_{qm}] ∈ \R^\{m×d}$。  
その後、**MAX_SIM** が適用され、2つの embedding リストを比較してクエリとドキュメントページ間の最終スコアが得られます。

## ColBERT テキスト検索システム\{#colbert-text-retrieval-system}

このセクションでは、Milvus の 配列 of 構造体s を使用して ColBERT テキスト検索システムを設定します。その前に、Cohere のアクセストークンを取得してください。

### ステップ 1: 依存関係のインストール\{#step-1-install-the-dependencies}

次のコマンドを実行して依存関係をインストールします。

```shell
pip install --upgrade huggingface-hub transformers datasets pymilvus cohere
```

### ステップ 2: Cohere データセットの読み込み\{#step-2-load-the-cohere-dataset}

この例では、Cohere の Wikipedia データセットを使用し、最初の 10,000 件のレコードを取得します。このデータセットに関する情報は、[このページ](https://huggingface.co/datasets/Cohere/wikipedia-2023-11-embed-multilingual-v3)で確認できます。

```python
from datasets import load_dataset

lang = "simple"
docs = load_dataset(
    "Cohere/wikipedia-2023-11-embed-multilingual-v3", 
    lang, 
    split="train[:10000]"
)
```

上記のスクリプトを実行すると、データセットがローカルに存在しない場合にダウンロードされます。このデータセットの各レコードは、Wikipediaページからの段落です。次の表は、このデータセットの構造を示しています。

<table>
   <tr>
     <th><p>カラム名</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>_id</code></p></td>
     <td><p>レコードID</p></td>
   </tr>
   <tr>
     <td><p><code>url</code></p></td>
     <td><p>現在のレコードのURL。</p></td>
   </tr>
   <tr>
     <td><p><code>title</code></p></td>
     <td><p>ソースドキュメントのタイトル。</p></td>
   </tr>
   <tr>
     <td><p><code>text</code></p></td>
     <td><p>ソースドキュメントからの段落。</p></td>
   </tr>
   <tr>
     <td><p><code>emb</code></p></td>
     <td><p>ソースドキュメントのテキストの埋め込み（embeddings）。</p></td>
   </tr>
</table>

### ステップ3: タイトルごとに段落をグループ化する\{#step-3-group-paragraphs-by-title}

段落ではなくドキュメント単位で検索できるようにするため、タイトルごとに段落をグループ化する必要があります。

```python
df = docs.to_pandas()
groups = df.groupby('title')

data = []

for title, group in groups:
  data.append({
      "title": title,
      "paragraphs": [{
          "text": row['text'],
          'emb': row['emb']
      } for _, row in group.iterrows()]
  })
```

このコードでは、グループ化された段落をドキュメントとして保存し、`data` リストに含めます。各ドキュメントには `paragraphs` キーがあり、これは段落のリストです。各段落オブジェクトには `text` および `emb` キーが含まれています。

### Step 4: Create a collection for the Cohere dataset\{#step-4-create-a-collection-for-the-cohere-dataset}

データの準備ができたら、コレクションを作成します。このコレクションには `paragraphs` という名前のフィールドがあり、これは 構造体 の 配列 です。

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# Create collection schema
schema = client.create_schema()

schema.add_field('id', DataType.INT64, is_primary=True, auto_id=True)
schema.add_field('title', DataType.VARCHAR, max_length=512)

# Create struct schema
struct_schema = client.create_struct_field_schema()
struct_schema.add_field('text', DataType.VARCHAR, max_length=65535)
struct_schema.add_field('emb', DataType.FLOAT_VECTOR, dim=512)

schema.add_field('paragraphs', DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=200)

# Create index parameters
index_params = client.prepare_index_params()
index_params.add_index(
    field_name="paragraphs[emb]",
    index_type="AUTOINDEX",
    metric_type="MAX_SIM_COSINE"
)

# Create a collection
client.create_collection(
    collection_name='wiki_documents', 
    schema=schema, 
    index_params=index_params
)
```

### Step 5: Insert Cohere dataset に collection\{#step-5-insert-cohere-dataset-into-the-collection}

これで、上記で作成したコレクションに準備したデータを挿入できます。

```python
client.insert(
    collection_name='wiki_documents', 
    data=data
)
```

### ステップ 6: Cohere データセット内での検索\{#step-6-search-within-the-cohere-dataset}

ColBERT の設計に従い、クエリテキストはトークン化された後、EmbeddingList に埋め込まれます。このステップでは、Wikipedia データセット内の段落の埋め込みを生成するために Cohere が使用したのと同じモデルを使用します。

```python
import cohere

co = cohere.ClientV2("COHERE_API_KEY")

query_inputs = [
    {
        'content': [
            {'type': 'text', 'text': 'Adobe'},
        ]
    },
    {
        'content': [
            {'type': 'text', 'text': 'software'}
        ]
    }
]

embeddings = co.embed(
    inputs=query_inputs,
    model='embed-multilingual-v3.0',
    input_type="classification",
    embedding_types=["float"],
)
```

コードでは、クエリテキストが `query_inputs` 内でトークンに整理され、浮動小数点数のベクトルリストに埋め込まれます。その後、Milvus の EmbeddingList を使用して以下のように類似性検索を実行できます。

```python
from pymilvus.client.embedding_list import EmbeddingList

query_emb_list = EmbeddingList()

if (embeddings.embeddings.float):
  query_emb_list.add_batch(embeddings.embeddings.float)

results = client.search(
    collection_name="wiki_documents",
    data=[query_emb_list],
    anns_field="paragraphs[emb]",
    search_params={
        "metric_type": "MAX_SIM_COSINE"
    },
    limit=10,
    output_fields=["title"]
)

for hit in results[0]:
  print(f"Document {hit['entity']['title']}: {hit['distance']:.4f}")
```

上記コードの出力は、以下と同様です:

```python
# Document Software: 2.3035
# Document Application: 2.1875
# Document Adobe Illustrator: 2.1167
# Document Open source: 2.0542
# Document Computer: 1.9811
# Document Microsoft: 1.9784
# Document Web browser: 1.9655
# Document Program: 1.9627
# Document Website: 1.9594
# Document Computer science: 1.9460
```

コサイン類似度スコアの範囲は `-1` から `1` までであり、上記の出力における類似度スコアは、複数のトークンレベルの類似度スコアの合計を明確に示しています。

## ColPali テキスト検索システム\{#colpali-text-retrieval-system}

このセクションでは、Milvus の 配列 of 構造体s を使用して ColPali ベースのテキスト検索システムを構築します。その前に、 をセットアップしてください。

### ステップ 1: 依存関係のインストール\{#step-1-install-the-dependencies}

```shell
pip install --upgrade huggingface-hub transformers datasets pymilvus 'colpali-engine>=0.3.0,<0.4.0'
```

### ステップ 2: Vidore データセットの読み込み\{#step-2-load-the-vidore-dataset}

このセクションでは、**vidore_v2_finance_en** という名前の Vidore データセットを使用します。このデータセットは、銀行業界の年次報告書のコーパスであり、長文ドキュメント理解タスクを対象としています。これは ViDoRe v3 ベンチマークを構成する 10 のコーパスの 1 つです。このデータセットの詳細については、[このページ](https://huggingface.co/datasets/vidore/vidore_v3_finance_en) で確認できます。 

```python
from datasets import load_dataset

ds = load_dataset("vidore/vidore_v3_finance_en", "corpus")
df = ds['test'].to_pandas()
```

上記のスクリプトを実行すると、データセットがローカルに存在しない場合にダウンロードされます。データセットの各レコードは財務報告書の 1 ページです。次の表はこのデータセットの構造を示しています。

<table>
   <tr>
     <th><p>Column Name</p></th>
     <th><p>Description</p></th>
   </tr>
   <tr>
     <td><p><code>corpus_id</code></p></td>
     <td><p>A record in the corpus</p></td>
   </tr>
   <tr>
     <td><p><code>image</code></p></td>
     <td><p>The page image in bytes.</p></td>
   </tr>
   <tr>
     <td><p><code>doc_id</code></p></td>
     <td><p>The descriptive document ID.</p></td>
   </tr>
   <tr>
     <td><p><code>page_number_in_doc</code></p></td>
     <td><p>The page number of the current page in the doc.</p></td>
   </tr>
</table>

### ステップ 3: ページ画像の埋め込みを生成する\{#step-3-generate-embeddings-for-the-page-images}

[概要](./search-with-embeddinglist#colpali-extension) セクションで説明したように、ColPali モデルは画像をテキストモデルのベクトル空間に投影する VLM です。このステップでは、最新の ColPali モデルである **vidore/colpali-v1.3** を使用します。このモデルの詳細については、[このページ](https://huggingface.co/vidore/colpali-v1.3) で確認できます。 

```python
import torch
from typing import cast
from colpali_engine.models import ColPali, ColPaliProcessor

model_name = "vidore/colpali-v1.3"

model = ColPali.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map="cuda:0",  # or "mps" if on Apple Silicon
).eval()

processor = ColPaliProcessor.from_pretrained(model_name)
```

モデルの準備が整ったら、次のようにして特定の画像のパッチ生成を試すことができます。

```python
from PIL import Image
from io import BytesIO

# Use the iterrow() generator to get the first row
row = next(df.iterrows())[1]

# Include the image in the above row in a list
images = [ Image.open(row['image']['bytes'] ]
patches = processor.process_images(images).to(model.device)
patches_embeddings = model(**patches_in_pixels)[0]

# Check the shape of the embeddings generated for the patches
print(patches_embeddings.shape)

# [1031, 128]
```

上記のコードでは、ColPali モデルが画像を 448 x 448 ピクセルにリサイズし、それをそれぞれ 14 x 14 ピクセルのパッチに分割します。最後に、これらのパッチはそれぞれ 128 次元を持つ 1,031 個の埋め込みベクトルに変換されます。

以下のループを使用して、すべての画像の埋め込みベクトルを生成できます。

```python
data = []

for index, row in df.iterrows():
  row = next(df.iterrows())[1]
  corpus_id = row['corpus_id']
  
  images = [Image.open(BytesIO(row['image']['bytes']))]
  batch_images = processor.process_images(images).to(model.device)
  patches = model(**batch_images)[0]

  doc_id = row['doc_id']
  markdown = row['markdown']
  page_number_in_doc = row['page_number_in_doc']

  data.append({
      "corpus_id": corpus_id,
      "patches": [ {"emb": emb} for emb in patches ],
      "doc_id": markdown,
      "page_number_in_doc": row['page_number_in_doc']
  })
```

<Admonition type="info" icon="📘" title="Notes">

<p>このステップは、埋め込む必要があるデータ量が膨大であるため、比較的時間がかかります。</p>

</Admonition>

### ステップ 4: 財務報告書データセット用のコレクションを作成する\{#step-4-create-a-collection-for-the-financial-reports-dataset}

データの準備が整ったら、コレクションを作成します。このコレクション内では、`patches` というフィールドが構造体の配列です。

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(
    uri=YOUR_CLUSTER_ENDPOINT,
    token=YOUR_API_KEY
)

schema = client.create_schema()

schema.add_field(
    field_name="corpus_id",
    datatype=DataType.INT64,
    is_primary=True
)

patch_schema = client.create_struct_field_schema()

patch_schema.add_field(
    field_name="emb",
    datatype=DataType.FLOAT_VECTOR,
    dim=128
)

schema.add_field(
    field_name="patches",
    datatype=DataType.ARRAY,
    element_type=DataType.STRUCT,
    struct_schema=patch_schema,
    max_capacity=1031
)

schema.add_field(
    field_name="doc_id",
    datatype=DataType.VARCHAR,
    max_length=512
)

schema.add_field(
    field_name="page_number_in_doc",
    datatype=DataType.INT64
)

index_params = client.prepare_index_params()

index_params.add_index(
    field_name="patches[emb]",
    index_type="AUTOINDEX",
    metric_type="MAX_SIM_COSINE"
)

client.create_collection(
    collection_name="financial_reports",
    schema=schema,
    index_params=index_params
)
```

### ステップ 5: 財務報告をコレクションに挿入する\{#step-5-insert-the-financial-reports-into-the-collection}

これで、準備した財務報告をコレクションに挿入できます。

```python
client.insert(
    collection_name="financial_reports",
    data=data
)
```

出力から、Vidore データセットのすべてのページが挿入されていることがわかります。

### ステップ 6: 財務報告書内での検索\{#step-6-search-within-the-financial-reports}

データの準備が整ったら、以下のようにコレクション内のデータに対して検索を実行できます。

```python
from pymilvus.client.embedding_list import EmbeddingList

queries = [
    "quarterly revenue growth chart"
]

batch_queries = processor.process_queries(queries).to(model.device)

with torch.no_grad():
  query_embeddings = model(**batch_queries)

query_emb_list = EmbeddingList()
query_emb_list.add_batch(query_embeddings[0].cpu())

results = client.search(
    collection_name="financial_reports",
    data=[query_emb_list],
    anns_field="patches[emb]",
    search_params={
        "metric_type": "MAX_SIM_COSINE"
    },
    limit=10,
    output_fields=["doc_id", "page_number_in_doc"]
)

```
