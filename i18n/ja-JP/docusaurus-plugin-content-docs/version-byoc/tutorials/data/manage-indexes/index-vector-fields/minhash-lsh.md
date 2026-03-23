---
title: "MINHASH_LSH | BYOC"
slug: /minhash-lsh
sidebar_label: "MINHASH_LSH"
beta: FALSE
notebook: FALSE
description: "大規模な機械学習データセット、特に大規模言語モデル（LLM）のトレーニング用コーパスのクリーニングなどのタスクにおいて、効率的な重複排除と類似性検索は不可欠です。数百万から数十億のドキュメントを扱う場合、従来の完全一致では速度とコストの面で非現実的になります。 | BYOC"
type: origin
token: BYtDwHuOXiG7imkyIjHcWa6fnlb
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - vector field
  - index
  - minhash

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MINHASH_LSH

大規模な機械学習データセットにおいて、効率的な重複排除と類似検索は極めて重要です。特に大規模言語モデル（LLM）のトレーニングコーパスのクリーニングなどのタスクではその重要性が顕著です。数百万〜数十億ものドキュメントを扱う場合、従来の完全一致方式は遅すぎてコストがかかりすぎます。

Zilliz Cloud の **MINHASH_LSH** インデックスは、以下の2つの強力な技術を組み合わせることで、高速かつスケーラブルで高精度な近似重複排除を実現します。

- [MinHash](https://en.wikipedia.org/wiki/MinHash)：文書の類似度を推定するためのコンパクトなシグネチャ（または「フィンガープリント」）を迅速に生成します。

- [Locality-Sensitive ハッシュ化 (LSH)](https://en.wikipedia.org/wiki/Locality-sensitive_hashing)：MinHashシグネチャに基づいて類似文書のグループを素早く特定します。

このガイドでは、Zilliz Cloud における MINHASH_LSH の概念、前提条件、セットアップ方法、ベストプラクティスについて説明します。

## 概要\{#overview}

### Jaccard類似度\{#jaccard-similarity}

Jaccard類似度は、2つの集合 A と B の重複度合いを測定する指標で、次のように定義されます。

$$
J(A, B) = \frac\{|A \cap B|}\{|A \cup B|}
$$

その値は 0（完全に互いに素）から 1（同一）の範囲を取ります。

しかし、大規模データセット内のすべての文書ペア間で Jaccard類似度を正確に計算するのは計算コストが非常に高く、**n** が大きい場合、時間およびメモリの計算量は **O(n²)** になります。これは、LLMトレーニングコーパスのクリーニングやウェブスケールの文書分析といったユースケースでは非現実的です。

### MinHashシグネチャ：Jaccard類似度の近似\{#minhash-signatures-approximate-jaccard-similarity}

[MinHash](https://en.wikipedia.org/wiki/MinHash) は確率的手法であり、Jaccard類似度を効率的に推定する手段を提供します。各集合をコンパクトな**シグネチャベクトル**に変換することで、集合の類似度を効率的に近似するのに十分な情報を保持します。

**基本的なアイデア**：

2つの集合がより類似しているほど、それらのMinHashシグネチャが同じ位置で一致する可能性が高くなります。この性質により、MinHashは集合間のJaccard類似度を近似することができるのです。

この性質により、MinHashは集合全体を直接比較することなく、**Jaccard類似度を近似する**ことが可能になります。

MinHashの処理手順は以下の通りです。

1. **シャイングリング**：文書を重複するトークン列（シャインル）の集合に変換します。

1. **ハッシュ化**：各シャインルに複数の独立したハッシュ関数を適用します。

1. **最小選択**：各ハッシュ関数に対して、すべてのシャインルの中から**最小**のハッシュ値を記録します。

下図に全体のプロセスを示します。

![CCzEwT7uchMqI6bsxRJcK1qenEh](https://zdoc-images.s3.us-west-2.amazonaws.com/CCzEwT7uchMqI6bsxRJcK1qenEh.png)

<Admonition type="info" icon="📘" title="Notes">

<p>使用するハッシュ関数の数がMinHashシグネチャの次元数を決定します。次元数を増やすと近似精度は向上しますが、ストレージと計算コストも増加します。</p>

</Admonition>

### MinHash用のLSH\{#lsh-for-minhash}

MinHashシグネチャは文書間の正確なJaccard類似度の計算コストを大幅に削減しますが、すべてのシグネチャベクトルのペアを網羅的に比較するのは依然として大規模データでは非効率です。

これを解決するために、[LSH](https://zilliz.com/learn/Local-Sensitivity-ハッシュ化-A-Comprehensive-Guide) が使用されます。LSHは、類似アイテムが同じ「バケット」に高い確率でハッシュされるように設計されており、すべてのペアを直接比較する必要をなくして高速な近似類似検索を可能にします。

処理手順は以下の通りです。

1. **シグネチャの分割**：

    *n* 次元のMinHashシグネチャを *b* 個のバンドに分割します。各バンドは連続する *r* 個のハッシュ値を含み、全体のシグネチャ長は *n = b × r* を満たします。

    例えば、128次元のMinHashシグネチャ（*n = 128*）を32バンド（*b = 32*）に分割すると、各バンドは4個のハッシュ値（*r = 4*）を含みます。

1. **バンド単位のハッシュ化**：

    分割後、各バンドを標準的なハッシュ関数で独立に処理し、バケットに割り当てます。2つのシグネチャが同じバンド内で同じハッシュ値を生成した場合（つまり同じバケットに入った場合）、潜在的なマッチ候補とみなされます。

1. **候補の選択**：

    少なくとも1つのバンドで衝突（collision）が発生したペアが類似候補として選択されます。

<Admonition type="info" icon="📘" title="Notes">

<p>なぜうまくいくのか？</p>
<p>数学的には、2つのシグネチャのJaccard類似度が $s$ のとき、</p>
<ul>
<li><p>1つの行（ハッシュ位置）で一致する確率は $s$</p></li>
<li><p>1つのバンド内のすべての $r$ 行で一致する確率は $s^r$</p></li>
<li><p><strong>少なくとも1つのバンドで一致する</strong>確率は &#36;1 - (1 - s^r)^b$</p></li>
</ul>
<p>詳細については、<a href="https://en.wikipedia.org/wiki/Locality-sensitive_hashing">Locality-sensitive hashing</a> を参照してください。</p>

</Admonition>

128次元のMinHashシグネチャを持つ3つの文書を考えてみましょう。

![E1dewMnqshua0ib7aHmcL10lnIe](https://zdoc-images.s3.us-west-2.amazonaws.com/E1dewMnqshua0ib7aHmcL10lnIe.png)

まず、LSHは128次元のシグネチャを、それぞれ4つの連続値からなる32バンドに分割します。

![PhSMwS74rh25oybv9Docmfionze](https://zdoc-images.s3.us-west-2.amazonaws.com/PhSMwS74rh25oybv9Docmfionze.png)

次に、各バンドをハッシュ関数で異なるバケットにハッシュします。同じバケットを共有する文書ペアが類似候補として選択されます。以下の例では、文書Aと文書Bが**バンド0**でハッシュ結果が衝突しているため、類似候補として選ばれています。

![RfmMwNkIvhlUFSb11alcP8fqnmf](https://zdoc-images.s3.us-west-2.amazonaws.com/RfmMwNkIvhlUFSb11alcP8fqnmf.png)

<Admonition type="info" icon="📘" title="Notes">

<p>バンド数は <code>mh_lsh_band</code> パラメータで制御されます。詳細については、<a href="./minhash-lsh#index-building-params">Index building params</a> を参照してください。</p>

</Admonition>

### MHJACCARD：MinHashシグネチャの比較\{#mhjaccard-comparing-minhash-signatures}

MinHashシグネチャは、固定長のバイナリベクトルを使用して集合間のJaccard類似度を近似します。しかし、これらのシグネチャは元の集合を保持しないため、`JACCARD`、`L2`、`COSINE` などの標準的なメトリックを直接適用することはできません。

これを解決するために、Zilliz Cloud では MinHashシグネチャ専用に設計された特殊なメトリックタイプ `MHJACCARD` を導入しています。

Zilliz Cloud で MinHash を使用する際には、以下の設定が必要です。

- ベクトルフィールドの型は `BINARY_VECTOR` であること

- `index_type` は `MINHASH_LSH`（または `BIN_FLAT`）であること

- `metric_type` は `MHJACCARD` に設定すること

他のメトリックを使用すると、無効になるか誤った結果を返す可能性があります。

このメトリックタイプの詳細については、[MHJACCARD](./search-metrics-explained#mhjaccard) を参照してください。

### 重複排除ワークフロー\{#deduplication-workflow}

MinHash LSH を活用した重複排除プロセスにより、Zilliz Cloud はコレクションへの挿入前に近似的な重複テキストや構造化レコードを効率的に識別・フィルタリングできます。

![NuokbSgbroyVPQx14fKcm37bnoh](https://zdoc-images.s3.us-west-2.amazonaws.com/nuokbsgbroyvpqx14fkcm37bnoh.png "NuokbSgbroyVPQx14fKcm37bnoh")

1. **チャンク化と前処理**：入力テキストデータまたは構造化データ（例：レコード、フィールド）をチャンクに分割し、テキストの正規化（小文字化、句読点の除去）、必要に応じてストップワードの除去を行います。

1. **特徴量構築**：MinHashに使用するトークン集合を構築します（例：テキストからのシャインル、構造化データの連結フィールドトークン）。

1. **MinHashシグネチャ生成**：各チャンクまたはレコードに対してMinHashシグネチャを計算します。

1. **バイナリベクトル変換**：シグネチャをMilvusと互換性のあるバイナリベクトルに変換します。

1. **挿入前の検索**：MinHash LSHインデックスを使用して、対象コレクション内で入力アイテムの近似重複を検索します。

1. **挿入と保存**：一意なアイテムのみをコレクションに挿入します。これにより、将来の重複チェックで検索可能になります。

## 前提条件\{#prerequisites}

Zilliz Cloud で MinHash LSH を使用する前に、まず **MinHashシグネチャ** を生成する必要があります。これらのコンパクトなバイナリシグネチャは集合間のJaccard類似度を近似するものであり、Zilliz Cloud での `MHJACCARD` ベースの検索に必須です。

### MinHashシグネチャの生成方法の選択\{#choose-a-method-to-generate-minhash-signatures}

ワークロードに応じて、以下のいずれかを選択できます。

- シンプルさを求める場合は Python の [`datasketch`](https://ekzhu.github.io/datasketch/) を使用（プロトタイピングに推奨）

- 大規模データセットの場合は分散処理ツール（例：Spark、Ray）を使用

- パフォーマンスチューニングが重要な場合はカスタム実装（NumPy、C++ など）を使用

本ガイドでは、シンプルさと Zilliz Cloud 入力フォーマットとの互換性の観点から `datasketch` を使用します。

### 必要なライブラリのインストール\{#install-required-libraries}

この例で必要なパッケージをインストールします。

```bash
pip install pymilvus datasketch numpy
```

### MinHashシグネチャの生成\{#generate-minhash-signatures}

256次元のMinHashシグネチャを生成します。各ハッシュ値は64ビット整数で表現されます。これは`MINHASH_LSH`に期待されるベクトル形式と一致しています。

```python
from datasketch import MinHash
import numpy as np

MINHASH_DIM = 256
HASH_BIT_WIDTH = 64

def generate_minhash_signature(text, num_perm=MINHASH_DIM) -> bytes:
    m = MinHash(num_perm=num_perm)
    for token in text.lower().split():
        m.update(token.encode("utf8"))
    return m.hashvalues.astype('>u8').tobytes()  # Returns 2048 bytes
```

各シグネチャは 256 × 64 ビット = 2048 バイトです。このバイト列は、そのまま `BINARY_VECTOR` フィールドに挿入できます。Zilliz Cloud で使用されるバイナリベクトルの詳細については、[Binary Vector](./use-binary-vector) を参照してください。

### （オプション）生のトークンセットを準備する（精緻化検索用）\{#optional-prepare-raw-token-sets-for-refined-search}

デフォルトでは、Zilliz Cloud は MinHash シグネチャと LSH インデックスのみを使用して近似近傍を検索します。これは高速ですが、誤検出（false positives）が発生したり、近い一致を見逃す可能性があります。

**正確なJaccard類似度** を求めたい場合、Zilliz Cloud は元のトークンセットを使用した精緻化検索をサポートしています。これを有効にするには、以下の手順を実行します。

- トークンセットを別の `VARCHAR` フィールドとして格納する

- [インデックスパラメータの作成時](./minhash-lsh#build-index-parameters-and-create-collection) に `"with_raw_data": True` を設定する

- [類似度検索の実行時](./minhash-lsh#perform-similarity-search) に `"mh_search_with_jaccard": True` を有効にする

**トークンセット抽出の例**:

```python
def extract_token_set(text: str) -> str:
    tokens = set(text.lower().split())
    return " ".join(tokens)
```

## MinHash LSH の使用\{#use-minhash-lsh}

MinHash ベクトルと元のトークンセットの準備が整ったら、Zilliz Cloud で `MINHASH_LSH` を使ってそれらを保存・インデックス作成・検索できます。

### クラスターへの接続\{#connect-to-your-cluster}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")  # Update if your URI is different
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

### コレクションスキーマの定義\{#define-collection-schema}

以下の要素を含むスキーマを定義します：

- 主キー

- MinHashシグネチャ用の `BINARY_VECTOR` フィールド

- 精緻化検索が有効な場合の元のトークンセット用の `VARCHAR` フィールド

- （オプション）元のテキスト用の `document` フィールド

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import DataType

VECTOR_DIM = MINHASH_DIM * HASH_BIT_WIDTH  # 256 × 64 = 8192 bits

schema = client.create_schema(auto_id=False, enable_dynamic_field=False)
schema.add_field("doc_id", DataType.INT64, is_primary=True)
schema.add_field("minhash_signature", DataType.BINARY_VECTOR, dim=VECTOR_DIM)
schema.add_field("token_set", DataType.VARCHAR, max_length=1000)  # required for refinement
schema.add_field("document", DataType.VARCHAR, max_length=1000)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

### インデックスの構築パラメータとコレクションの作成\{#build-index-parameters-and-create-collection}

Jaccardリファインメントを有効にして`MINHASH_LSH`インデックスを構築します：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
index_params = client.prepare_index_params()
index_params.add_index(
    field_name="minhash_signature",
    index_type="MINHASH_LSH",
    metric_type="MHJACCARD",
    params={
        "mh_element_bit_width": HASH_BIT_WIDTH,  # Must match signature bit width
        "mh_lsh_band": 16,                       # Band count (128/16 = 8 hashes per band)
        "with_raw_data": True                    # Required for Jaccard refinement
    }
)

client.create_collection("minhash_demo", schema=schema, index_params=index_params)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

インデックス構築パラメータの詳細については、[インデックス構築パラメータ](./minhash-lsh#index-building-params)を参照してください。

### データの挿入\{#insert-data}

各ドキュメントについて、以下のものを準備します:

- バイナリ形式の MinHash 署名

- シリアライズされたトークンセット文字列

- （オプション）元のテキスト

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
documents = [
    "machine learning algorithms process data automatically",
    "deep learning uses neural networks to model patterns"
]

insert_data = []
for i, doc in enumerate(documents):
    sig = generate_minhash_signature(doc)
    token_str = extract_token_set(doc)
    insert_data.append({
        "doc_id": i,
        "minhash_signature": sig,
        "token_set": token_str,
        "document": doc
    })

client.insert("minhash_demo", insert_data)
client.flush("minhash_demo")
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

### 類似性検索の実行\{#perform-similarity-search}

Zilliz Cloud は、MinHash LSH を使用した類似性検索を次の2つのモードでサポートしています。

- **近似検索** — MinHashシグネチャとLSHのみを使用し、高速ではあるが確率的な結果を返します。

- **絞り込み検索** — 元のトークンセットを用いてJaccard類似度を再計算し、精度を向上させます。

#### 5.1 クエリの準備\{#51-prepare-the-query}

類似性検索を実行するには、クエリ文書の MinHash シグネチャを生成します。このシグネチャは、データ挿入時と同じ次元数およびエンコード形式と一致している必要があります。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
query_text = "neural networks model patterns in data"
query_sig = generate_minhash_signature(query_text)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

#### 5.2 近似検索 (LSHのみ)\{#52-approximate-search-lsh-only}

これは高速かつスケーラブルですが、近い一致を逃すか、誤検出を含む可能性があります：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# highlight-start
search_params={
    "metric_type": "MHJACCARD", 
    "params": {}
}
# highlight-end

approx_results = client.search(
    collection_name="minhash_demo",
    data=[query_sig],
    anns_field="minhash_signature",
    # highlight-next-line
    search_params=search_params,
    limit=3,
    output_fields=["doc_id", "document"],
    consistency_level="Strong"
)

for i, hit in enumerate(approx_results[0]):
    sim = 1 - hit['distance']
    print(f"{i+1}. Similarity: {sim:.3f} | {hit['entity']['document']}")
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

#### 5.3 絞り込み検索 (精度重視のタスクに推奨):\{#53-refined-search-recommended-for-accuracy}

これは、Zilliz Cloud に保存されている元のトークンセットを使用して正確な Jaccard 比較を実行します。若干遅くなりますが、品質が重要なタスクには推奨されます：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# highlight-start
search_params = {
    "metric_type": "MHJACCARD",
    "params": {
        "mh_search_with_jaccard": True,  # Enable real Jaccard computation
        "refine_k": 5                    # Refine top 5 candidates
    }
}
# highlight-end

refined_results = client.search(
    collection_name="minhash_demo",
    data=[query_sig],
    anns_field="minhash_signature",
    # highlight-next-line
    search_params=search_params,
    limit=3,
    output_fields=["doc_id", "document"],
    consistency_level="Strong"
)

for i, hit in enumerate(refined_results[0]):
    sim = 1 - hit['distance']
    print(f"{i+1}. Similarity: {sim:.3f} | {hit['entity']['document']}")
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

## Index params\{#index-params}

このセクションでは、インデックスの構築およびインデックス上での検索に使用されるパラメータの概要を説明します。

### Index building params\{#index-building-params}

次の表は、[インデックスの構築](./minhash-lsh#build-index-parameters-and-create-collection)時に `params` で設定可能なパラメータの一覧です。

<table>
   <tr>
     <th><p>Parameter</p></th>
     <th><p>Description</p></th>
     <th><p>Value Range</p></th>
     <th><p>Tuning 提案</p></th>
   </tr>
   <tr>
     <td><p><code>mh_element_bit_width</code></p></td>
     <td><p>MinHashシグネチャ内の各ハッシュ値のビット幅。8で割り切れる必要があります。</p></td>
     <td><p>8, 16, 32, 64</p></td>
     <td><p>バランスの取れたパフォーマンスと精度には <code>32</code> を使用してください。大規模データセットでより高い精度が必要な場合は <code>64</code> を使用し、メモリを節約して許容範囲内の精度低下を受け入れる場合は <code>16</code> を使用してください。</p></td>
   </tr>
   <tr>
     <td><p><code>mh_lsh_band</code></p></td>
     <td><p>LSHのためにMinHashシグネチャを分割するバンド数。リコールとパフォーマンスのトレードオフを制御します。</p></td>
     <td><p>[1, <em>signature_length</em>]</p></td>
     <td><p>128次元のシグネチャの場合：最初は32バンド（1バンドあたり4値）から始めます。リコールを高めるには64に増やし、パフォーマンスを優先する場合は16に減らします。シグネチャ長を均等に割り切れる値である必要があります。</p></td>
   </tr>
   <tr>
     <td><p><code>mh_lsh_code_in_mem</code></p></td>
     <td><p>LSHハッシュコードを匿名メモリに格納するか（<code>true</code>）、メモリマッピング（mmap）を使用するか（<code>false</code>）を指定します。</p></td>
     <td><p>true, false</p></td>
     <td><p>大規模データセット（&gt;100万セット）ではメモリ使用量を削減するために <code>false</code> を使用してください。小規模データセットで最大限の検索速度が必要な場合は <code>true</code> を使用してください。</p></td>
   </tr>
   <tr>
     <td><p><code>with_raw_data</code></p></td>
     <td><p>LSHコードとともに元のMinHashシグネチャを保存してリファインメントに使用するかどうかを指定します。</p></td>
     <td><p>true, false</p></td>
     <td><p>高精度が求められ、ストレージコストが許容できる場合は <code>true</code> を使用してください。<code>false</code> を使用するとストレージオーバーヘッドを最小限に抑えられますが、精度が若干低下します。</p></td>
   </tr>
   <tr>
     <td><p><code>mh_lsh_bloom_false_positive_prob</code></p></td>
     <td><p>LSHバケット最適化で使用されるブルームフィルタの偽陽性確率。</p></td>
     <td><p>[0.001, 0.1]</p></td>
     <td><p>メモリ使用量と精度のバランスを取るには <code>0.01</code> を使用してください。低い値（<code>0.001</code>）は偽陽性を減らしますがメモリ使用量が増えます。高い値（<code>0.05</code>）はメモリを節約しますが精度が低下する可能性があります。</p></td>
   </tr>
</table>

### Index-specific search params\{#index-specific-search-params}

次の表は、[インデックス上での検索](./minhash-lsh#perform-similarity-search)時に `search_params.params` で設定可能なパラメータの一覧です。

<table>
   <tr>
     <th><p>Parameter</p></th>
     <th><p>Description</p></th>
     <th><p>Value Range</p></th>
     <th><p>Tuning 提案</p></th>
   </tr>
   <tr>
     <td><p><code>mh_search_with_jaccard</code></p></td>
     <td><p>候補結果に対して正確なJaccard類似度計算を実行してリファインメントを行うかどうかを指定します。</p></td>
     <td><p>true, false</p></td>
     <td><p>高精度が求められるアプリケーション（例：重複排除）では <code>true</code> を使用してください。わずかな精度低下が許容できる高速な近似検索の場合は <code>false</code> を使用してください。</p></td>
   </tr>
   <tr>
     <td><p><code>refine_k</code></p></td>
     <td><p>Jaccardリファインメント前に取得する候補数。<code>mh_search_with_jaccard</code> が <code>true</code> の場合にのみ有効です。</p></td>
     <td><p>[<em>top_k</em>, <em>top_k &ast; 10</em>]</p></td>
     <td><p>リコールとパフォーマンスのバランスを取るために、目的の <em>top_k</em> の2〜5倍に設定してください。値を大きくするとリコールが向上しますが、計算コストも増加します。</p></td>
   </tr>
   <tr>
     <td><p><code>mh_lsh_batch_search</code></p></td>
     <td><p>複数の同時クエリに対してバッチ最適化を有効にするかどうかを指定します。</p></td>
     <td><p>true, false</p></td>
     <td><p>複数クエリを同時に検索する場合はスループット向上のために <code>true</code> を使用してください。単一クエリのシナリオではメモリオーバーヘッドを削減するために <code>false</code> を使用してください。</p></td>
   </tr>
</table>
