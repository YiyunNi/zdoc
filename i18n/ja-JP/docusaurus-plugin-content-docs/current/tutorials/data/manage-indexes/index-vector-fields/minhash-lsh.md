---
title: "MINHASH_LSH | Cloud"
slug: /minhash-lsh
sidebar_label: "MINHASH_LSH"
beta: FALSE
notebook: FALSE
description: "効率的な重複排除と類似性検索は、大規模な機械学習データセット、特に大規模言語モデル（LLM）のトレーニングコーパスのクリーニングなどのタスクにおいて重要です。数百万または数十億のドキュメントを扱う場合、従来の厳密なマッチングは遅すぎ、コストがかかりすぎます。 | Cloud"
type: origin
token: BYtDwHuOXiG7imkyIjHcWa6fnlb
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - ベクトルフィールド
  - インデックス
  - minhash

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MINHASH_LSH

大規模な機械学習データセット、特に大規模言語モデル（LLM）のトレーニングコーパスのクリーニングなどのタスクでは、効率的な重複排除と類似性検索が不可欠です。数百万または数十億のドキュメントを扱う場合、従来の厳密なマッチングは遅すぎ、コストがかかりすぎます。

Zilliz Cloudの**MINHASH_LSH**インデックスは、2つの強力な技術を組み合わせることで、高速でスケーラブルかつ正確な近似重複排除を可能にします。

- [MinHash](https://en.wikipedia.org/wiki/MinHash): ドキュメントの類似性を推定するために、コンパクトなシグネチャ（または「フィンガープリント」）を迅速に生成します。

- [Locality-Sensitive ハッシュ化 (LSH)](https://en.wikipedia.org/wiki/Locality-sensitive_hashing): MinHashシグネチャに基づいて、類似するドキュメントのグループを迅速に検索します。

このガイドでは、Zilliz CloudでMINHASH_LSHを使用するための概念、前提条件、セットアップ、およびベストプラクティスについて説明します。

## 概要\{#overview}

### Jaccard類似度\{#jaccard-similarity}

Jaccard類似度は、2つの集合AとBの重なりを測定し、次のように正式に定義されます。

$$
J(A, B) = \frac\{|A \cap B|}\{|A \cup B|}
$$

その値は0（完全に分離）から1（同一）の範囲です。

しかし、大規模データセット内のすべてのドキュメントペア間でJaccard類似度を正確に計算することは、計算コストが高く、**n**が大きい場合、時間とメモリの両方で**O(n²)**になります。このため、LLMトレーニングコーパスのクリーニングやウェブスケールのドキュメント分析などのユースケースでは、実現不可能です。

### MinHashシグネチャ: Jaccard類似度の近似\{#minhash-signatures-approximate-jaccard-similarity}

[MinHash](https://en.wikipedia.org/wiki/MinHash)は、Jaccard類似度を推定するための効率的な方法を提供する確率的技術です。各集合をコンパクトな**シグネチャベクトル**に変換し、集合の類似度を効率的に近似するのに十分な情報を保持することで機能します。

**核となるアイデア**:

2つの集合が似ているほど、MinHashシグネチャが同じ位置で一致する可能性が高くなります。この特性により、MinHashは集合間のJaccard類似度を近似することができます。

この特性により、MinHashは完全な集合を直接比較することなく、集合間の**Jaccard類似度を近似する**ことができます。

MinHashプロセスには以下が含まれます。

1. **シャイングリング**: ドキュメントを重複するトークンシーケンス（シャイングリング）の集合に変換します。

1. **ハッシュ化**: 各シャイングリングに複数の独立したハッシュ関数を適用します。

1. **最小選択**: 各ハッシュ関数について、すべてのシャイングリングの中で**最小**のハッシュ値を記録します。

プロセス全体を以下に示します。

![CCzEwT7uchMqI6bsxRJcK1qenEh](https://zdoc-images.s3.us-west-2.amazonaws.com/CCzEwT7uchMqI6bsxRJcK1qenEh.png)

<Admonition type="info" icon="📘" title="Notes">

<p>使用されるハッシュ関数の数は、MinHashシグネチャの次元を決定します。次元が高いほど近似精度は向上しますが、ストレージと計算量が増加します。</p>

</Admonition>

### MinHashのためのLSH\{#lsh-for-minhash}

MinHashシグネチャは、ドキュメント間の厳密なJaccard類似度を計算するコストを大幅に削減しますが、すべてのシグネチャベクトルペアを網羅的に比較することは、大規模では依然として非効率です。

これを解決するために、[LSH](https://zilliz.com/learn/Local-Sensitivity-ハッシュ化-A-Comprehensive-Guide)が使用されます。LSHは、類似するアイテムが高い確率で同じ「バケット」にハッシュされるようにすることで、高速な近似類似性検索を可能にします。これにより、すべてのペアを直接比較する必要がなくなります。

プロセスには以下が含まれます。

1. **シグネチャのセグメンテーション:**

    *n*次元のMinHashシグネチャは、*b*個のバンドに分割されます。各バンドには*r*個の連続するハッシュ値が含まれるため、合計シグネチャ長は*n = b × r*を満たします。

    たとえば、128次元のMinHashシグネチャ（*n = 128*）があり、それを32個のバンド（*b = 32*）に分割する場合、各バンドには4個のハッシュ値（*r = 4*）が含まれます。

1. **バンドレベルのハッシュ化:**

    セグメンテーション後、各バンドは標準のハッシュ関数を使用して独立して処理され、バケットに割り当てられます。2つのシグネチャがバンド内で同じハッシュ値を生成する場合、つまり同じバケットに分類される場合、それらは潜在的な一致と見なされます。

1. **候補の選択:**

    少なくとも1つのバンドで衝突するペアが類似性候補として選択されます。

<Admonition type="info" icon="📘" title="Notes">

<p>なぜ機能するのか？</p>
<p>数学的に、2つのシグネチャがJaccard類似度$s$を持つ場合、</p>
<ul>
<li><p>1つの行（ハッシュ位置）で同一である確率は$s$です。</p></li>
<li><p>バンドのすべての$r$行で一致する確率は$s^r$です。</p></li>
<li><p><strong>少なくとも1つのバンド</strong>で一致する確率は&#36;1 - (1 - s^r)^b$です。</p></li>
</ul>
<p>詳細については、<a href="https://en.wikipedia.org/wiki/Locality-sensitive_hashing">Locality-sensitive hashing</a>を参照してください。</p>

</Admonition>

128次元のMinHashシグネチャを持つ3つのドキュメントを考えてみましょう。

![E1dewMnqshua0ib7aHmcL10lnIe](https://zdoc-images.s3.us-west-2.amazonaws.com/E1dewMnqshua0ib7aHmcL10lnIe.png)

まず、LSHは128次元のシグネチャを、それぞれ4つの連続する値を持つ32個のバンドに分割します。

![PhSMwS74rh25oybv9Docmfionze](https://zdoc-images.s3.us-west-2.amazonaws.com/PhSMwS74rh25oybv9Docmfionze.png)

次に、各バンドはハッシュ関数を使用して異なるバケットにハッシュされます。バケットを共有するドキュメントペアは、類似性候補として選択されます。以下の例では、ドキュメントAとドキュメントBは、ハッシュ結果が**バンド0**で衝突するため、類似性候補として選択されます。

![RfmMwNkIvhlUFSb11alcP8fqnmf](https://zdoc-images.s3.us-west-2.amazonaws.com/RfmMwNkIvhlUFSb11alcP8fqnmf.png)

<Admonition type="info" icon="📘" title="Notes">

<p>バンドの数は<code>mh_lsh_band</code>パラメータによって制御されます。詳細については、<a href="./minhash-lsh#index-building-params">インデックス構築パラメータ</a>を参照してください。</p>

</Admonition>

### MHJACCARD: MinHashシグネチャの比較\{#mhjaccard-comparing-minhash-signatures}

MinHashシグネチャは、固定長のバイナリベクトルを使用して集合間のJaccard類似度を近似します。しかし、これらのシグネチャは元の集合を保持しないため、`JACCARD`、`L2`、`COSINE`などの標準的なメトリックを直接適用して比較することはできません。

この問題に対処するため、Zilliz CloudはMinHashシグネチャの比較専用に設計された`MHJACCARD`という特殊なメトリックタイプを導入しています。

Zilliz CloudでMinHashを使用する場合：

- ベクトルフィールドは`BINARY_VECTOR`タイプである必要があります。

- `index_type`は`MINHASH_LSH`（または`BIN_FLAT`）である必要があります。

- `metric_type`は`MHJACCARD`に設定する必要があります。

他のメトリックを使用すると、無効になるか、誤った結果が生成されます。

このメトリックタイプに関する詳細については、[MHJACCARD](./search-metrics-explained#mhjaccard)を参照してください。

### 重複排除ワークフロー\{#deduplication-workflow}

MinHash LSHを搭載した重複排除プロセスにより、Zilliz Cloudは、コレクションに挿入する前に、ほぼ重複するテキストまたは構造化レコードを効率的に識別してフィルタリングできます。

![NuokbSgbroyVPQx14fKcm37bnoh](https://zdoc-images.s3.us-west-2.amazonaws.com/nuokbsgbroyvpqx14fkcm37bnoh.png "NuokbSgbroyVPQx14fKcm37bnoh")

1. **チャンク化と前処理**: 入力テキストデータまたは構造化データ（例：レコード、フィールド）をチャンクに分割します。必要に応じてテキストを正規化（小文字化、句読点の削除）し、ストップワードを削除します。

1. **特徴量構築**: MinHashに使用するトークンセットを構築します（例：テキストからのシャイングリング、構造化データ用の連結されたフィールドトークン）。

1. **MinHashシグネチャ生成**: 各チャンクまたはレコードのMinHashシグネチャを計算します。

1. **バイナリベクトル変換**: シグネチャをMilvusと互換性のあるバイナリベクトルに変換します。

1. **挿入前の検索**: MinHash LSHインデックスを使用して、ターゲットコレクションで入力アイテムのほぼ重複を検索します。

1. **挿入と保存**: 一意のアイテムのみをコレクションに挿入します。これらは将来の重複排除チェックのために検索可能になります。

## 前提条件\{#prerequisites}

Zilliz CloudでMinHash LSHを使用する前に、まず**MinHashシグネチャ**を生成する必要があります。これらのコンパクトなバイナリシグネチャは、集合間のJaccard類似度を近似し、Zilliz Cloudでの`MHJACCARD`ベースの検索に必要です。

### MinHashシグネチャを生成する方法を選択する\{#choose-a-method-to-generate-minhash-signatures}

ワークロードに応じて、以下を選択できます。

- シンプルさのためにPythonの[`datasketch`](https://ekzhu.github.io/datasketch/)を使用する（プロトタイプ作成に推奨）

- 大規模データセットには分散ツール（例：Spark、Ray）を使用する

- パフォーマンスチューニングが重要である場合はカスタムロジック（NumPy、C++など）を実装する

このガイドでは、シンプルさとZilliz Cloud入力形式との互換性のために`datasketch`を使用します。

### 必要なライブラリをインストールする\{#install-required-libraries}

この例に必要なパッケージをインストールします。

```bash
pip install pymilvus datasketch numpy
```

### MinHashシグネチャの生成\{#generate-minhash-signatures}

256次元のMinHashシグネチャを生成します。各ハッシュ値は64ビット整数で表されます。これは`MINHASH_LSH`に期待されるベクトル形式と一致します。

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

各シグネチャは256 × 64ビット = 2048バイトです。このバイト文字列は、`BINARY_VECTOR`フィールドに直接挿入できます。Zilliz Cloudで使用されるバイナリベクタの詳細については、[バイナリベクタ](./use-binary-vector)を参照してください。

### (オプション) 生のトークンセットを準備する (洗練された検索用)\{#optional-prepare-raw-token-sets-for-refined-search}

デフォルトでは、Zilliz CloudはMinHashシグネチャとLSHインデックスのみを使用して近似近傍を検索します。これは高速ですが、誤検知を返したり、近い一致を見逃したりする可能性があります。

**正確なJaccard類似度**が必要な場合、Zilliz Cloudは元のトークンセットを使用する洗練された検索をサポートしています。これを有効にするには：

- トークンセットを別の`VARCHAR`フィールドとして保存します。

- [インデックスパラメータを構築し、コレクションを作成する](./minhash-lsh#build-index-parameters-and-create-collection)際に、`"with_raw_data": True`を設定します。

- そして、[類似性検索を実行する](./minhash-lsh#perform-similarity-search)際に、`"mh_search_with_jaccard": True`を有効にします。

**トークンセット抽出の例**:

```python
def extract_token_set(text: str) -> str:
    tokens = set(text.lower().split())
    return " ".join(tokens)
```

## MinHash LSH を使用する\{#use-minhash-lsh}

MinHash ベクトルと元のトークンセットの準備ができたら、`MINHASH_LSH` を使用して Zilliz Cloud でそれらを保存、インデックス作成、検索できます。

### クラスターに接続する\{#connect-to-your-cluster}

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

以下のスキーマを定義します。

- プライマリキー

- MinHashシグネチャ用の`BINARY_VECTOR`フィールド

- 元のトークンセット用の`VARCHAR`フィールド（詳細検索が有効な場合）

- オプションで、元のテキスト用の`document`フィールド

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

Jaccardリファインメントを有効にして`MINHASH_LSH`インデックスを構築します。

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

各ドキュメントについて、以下を準備します。

- バイナリMinHashシグネチャ

- シリアライズされたトークンセット文字列

- (オプション) オリジナルテキスト

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

Zilliz Cloudは、MinHash LSHを使用した類似性検索の2つのモードをサポートしています。

- **近似検索** — MinHashシグネチャとLSHのみを使用して、高速だが確率的な結果を得ます。

- **絞り込み検索** — 精度を向上させるために、元のトークンセットを使用してJaccard類似度を再計算します。

#### 5.1 クエリの準備\{#51-prepare-the-query}

類似性検索を実行するには、クエリドキュメントのMinHashシグネチャを生成します。このシグネチャは、データ挿入時に使用されたものと同じ次元とエンコーディング形式に一致する必要があります。

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

これは高速でスケーラブルですが、近い一致を見逃したり、誤検知を含んだりする可能性があります。

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

#### 5.3 絞り込み検索 (精度重視の場合に推奨):\{#53-refined-search-recommended-for-accuracy}

これは、Zilliz Cloud に保存されている元のトークンセットを使用して、正確な Jaccard 比較を可能にします。若干遅くなりますが、品質が重視されるタスクには推奨されます。

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

## インデックスパラメータ\{#index-params}

このセクションでは、インデックスの構築とインデックスに対する検索の実行に使用されるパラメータの概要を説明します。

### インデックス構築パラメータ\{#index-building-params}

次の表は、[インデックスを構築する](./minhash-lsh#build-index-parameters-and-create-collection)際に`params`で設定できるパラメータを示しています。

<table>
   <tr>
     <th><p>パラメータ</p></th>
     <th><p>説明</p></th>
     <th><p>値の範囲</p></th>
     <th><p>チューニングの提案</p></th>
   </tr>
   <tr>
     <td><p><code>mh_element_bit_width</code></p></td>
     <td><p>MinHashシグネチャ内の各ハッシュ値のビット幅。8で割り切れる必要があります。</p></td>
     <td><p>8, 16, 32, 64</p></td>
     <td><p>バランスの取れたパフォーマンスと精度には<code>32</code>を使用します。大規模なデータセットでより高い精度を得るには<code>64</code>を使用します。許容できる精度損失でメモリを節約するには<code>16</code>を使用します。</p></td>
   </tr>
   <tr>
     <td><p><code>mh_lsh_band</code></p></td>
     <td><p>LSHのためにMinHashシグネチャを分割するバンドの数。再現率とパフォーマンスのトレードオフを制御します。</p></td>
     <td><p>[1, <em>signature_length</em>]</p></td>
     <td><p>128次元シグネチャの場合：32バンド（4値/バンド）から始めます。再現率を高めるには64に増やし、パフォーマンスを向上させるには16に減らします。シグネチャ長を均等に分割する必要があります。</p></td>
   </tr>
   <tr>
     <td><p><code>mh_lsh_code_in_mem</code></p></td>
     <td><p>LSHハッシュコードを匿名メモリに保存するか（<code>true</code>）、メモリマッピングを使用するか（<code>false</code>）。</p></td>
     <td><p>true, false</p></td>
     <td><p>メモリ使用量を削減するために、大規模なデータセット（100万セット以上）には<code>false</code>を使用します。最大の検索速度を必要とする小規模なデータセットには<code>true</code>を使用します。</p></td>
   </tr>
   <tr>
     <td><p><code>with_raw_data</code></p></td>
     <td><p>元のMinHashシグネチャをLSHコードと一緒に保存して、洗練するかどうか。</p></td>
     <td><p>true, false</p></td>
     <td><p>高い精度が必要で、ストレージコストが許容できる場合は<code>true</code>を使用します。わずかな精度低下でストレージオーバーヘッドを最小限に抑えるには<code>false</code>を使用します。</p></td>
   </tr>
   <tr>
     <td><p><code>mh_lsh_bloom_false_positive_prob</code></p></td>
     <td><p>LSHバケット最適化で使用されるブルームフィルタの偽陽性確率。</p></td>
     <td><p>[0.001, 0.1]</p></td>
     <td><p>バランスの取れたメモリ使用量と精度には<code>0.01</code>を使用します。低い値（<code>0.001</code>）は偽陽性を減らしますが、メモリを増やします。高い値（<code>0.05</code>）はメモリを節約しますが、精度が低下する可能性があります。</p></td>
   </tr>
</table>

### インデックス固有の検索パラメータ\{#index-specific-search-params}

次の表は、[インデックスを検索する](./minhash-lsh#perform-similarity-search)際に`search_params.params`で設定できるパラメータを示しています。

<table>
   <tr>
     <th><p>パラメータ</p></th>
     <th><p>説明</p></th>
     <th><p>値の範囲</p></th>
     <th><p>チューニングの提案</p></th>
   </tr>
   <tr>
     <td><p><code>mh_search_with_jaccard</code></p></td>
     <td><p>洗練のために候補結果に対して正確なJaccard類似度計算を実行するかどうか。</p></td>
     <td><p>true, false</p></td>
     <td><p>高い精度を必要とするアプリケーション（例：重複排除）には<code>true</code>を使用します。わずかな精度損失が許容できる場合は、より高速な近似検索のために<code>false</code>を使用します。</p></td>
   </tr>
   <tr>
     <td><p><code>refine_k</code></p></td>
     <td><p>Jaccard洗練の前に取得する候補の数。<code>mh_search_with_jaccard</code>が<code>true</code>の場合にのみ有効です。</p></td>
     <td><p>[<em>top_k</em>, <em>top_k &ast; 10</em>]</p></td>
     <td><p>良好な再現率とパフォーマンスのバランスのために、目的の<em>top_k</em>の2〜5倍に設定します。値が高いほど再現率は向上しますが、計算コストが増加します。</p></td>
   </tr>
   <tr>
     <td><p><code>mh_lsh_batch_search</code></p></td>
     <td><p>複数の同時クエリのバッチ最適化を有効にするかどうか。</p></td>
     <td><p>true, false</p></td>
     <td><p>スループットを向上させるために、複数のクエリを同時に検索する場合は<code>true</code>を使用します。メモリオーバーヘッドを削減するために、単一クエリのシナリオでは<code>false</code>を使用します。</p></td>
   </tr>
</table>
