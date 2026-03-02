---
title: "NGRAM | Cloud"
slug: /ngram-index-type
sidebar_label: "NGRAM"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud の `NGRAM` インデックスは、`VARCHAR` フィールド、または `JSON` フィールド内の特定の JSON パスに対する `LIKE` クエリを高速化するために構築されています。インデックスを構築する前に、Zilliz Cloud はテキストを固定長 n の短い重複する部分文字列（n-gram と呼ばれる）に分割します。たとえば、n = 3 の場合、「Milvus」という単語は「Mil」、「ilv」、「lvu」、「vus」という 3-gram に分割されます。これらの n-gram は、各グラムが出現するドキュメント ID にマッピングする転置インデックスに保存されます。クエリ時には、このインデックスにより Zilliz Cloud は検索を少数の候補に素早く絞り込むことができ、クエリ実行が大幅に高速化されます。 | Cloud"
type: origin
token: Q0wpw4xZiimaUsk4GvScAg2un1d
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - スカラフィールド
  - varchar
  - ngram
  - RAG
  - NLP
  - ニューラルネットワーク
  - ディープラーニング

---

import Admonition from '@theme/Admonition';


# NGRAM

Zilliz Cloud の `NGRAM` インデックスは、`VARCHAR` フィールドまたは `JSON` フィールド内の特定の JSON パスに対する `LIKE` クエリを高速化するために構築されています。インデックスを構築する前に、Zilliz Cloud はテキストを固定長 *n* の短い重複する部分文字列（*n-gram* と呼ばれる）に分割します。たとえば、*n = 3* の場合、単語「"Milvus"」は 3-gram の「"Mil"」、「"ilv"」、「"lvu"」、「"vus"」に分割されます。これらの n-gram は、各グラムが出現するドキュメント ID にマッピングする転置インデックスに保存されます。クエリ時に、このインデックスにより Zilliz Cloud は検索を少数の候補に素早く絞り込むことができ、クエリ実行が大幅に高速化されます。

以下のような高速なプレフィックス、サフィックス、インフィックス、またはワイルドカードフィルタリングが必要な場合に使用します。

- `name LIKE "data%"`

- `title LIKE "%vector%"`

- `path LIKE "%json"`

<Admonition type="info" icon="📘" title="Notes">

<p>フィルター式の構文の詳細については、<a href="./basic-filtering-operators#range-operators">基本演算子</a>を参照してください。</p>

</Admonition>

## 仕組み{#how-it-works}

Zilliz Cloud は、`NGRAM` インデックスを2段階のプロセスで実装しています。

1. **インデックスの構築**: 各ドキュメントの n-gram を生成し、取り込み中に転置インデックスを構築します。

1. **クエリの高速化**: インデックスを使用して少数の候補セットにフィルタリングし、正確な一致を検証します。

### フェーズ 1: インデックスの構築{#phase-1-build-the-index}

データ取り込み中に、Zilliz Cloud は次の2つの主要なステップを実行して NGRAM インデックスを構築します。

1. **テキストを n-gram に分解する**: Zilliz Cloud は、ターゲットフィールドの各文字列に *n* のウィンドウをスライドさせ、重複する部分文字列、つまり *n-gram* を抽出します。これらの部分文字列の長さは、設定可能な範囲 `[min_gram, max_gram]` 内に収まります。

    - `min_gram`: 生成する最短の n-gram。これは、インデックスの恩恵を受けることができる最小のクエリ部分文字列の長さも定義します。

    - `max_gram`: 生成する最長の n-gram。クエリ時には、長いクエリ文字列を分割する際の最大ウィンドウサイズとしても使用されます。

    たとえば、`min_gram=2` および `max_gram=3` の場合、文字列「"AI database"」は次のように分解されます。

![QZqlwniNDhE82ZbzE09cd7uHnWd](https://zdoc-images.s3.us-west-2.amazonaws.com/QZqlwniNDhE82ZbzE09cd7uHnWd.png)

    - **2-gram:** `AI`, `I_`, `_d`, `da`, `at`, ...

    - **3-gram:** `AI_`, `I_d`, `_da`, `dat`, `ata`, ...

    <Admonition type="info" icon="📘" title="Notes">

    <ul>
    <li><p>範囲 <code>[min_gram, max_gram]</code> の場合、Zilliz Cloud は両方の値（両端を含む）間のすべての長さの n-gram を生成します。たとえば、<code>[2,4]</code> と単語 <code>"text"</code> の場合、Zilliz Cloud は以下を生成します。</p></li>
    <li><p><strong>2-gram:</strong> <code>te</code>, <code>ex</code>, <code>xt</code></p></li>
    <li><p><strong>3-gram:</strong> <code>tex</code>, <code>ext</code></p></li>
    <li><p><strong>4-gram:</strong> <code>text</code></p></li>
    <li><p>N-gram 分解は文字ベースであり、言語に依存しません。たとえば、中国語の <code>"向量数据库"</code> は、<code>min_gram = 2</code> の場合、<code>"向量"</code>, <code>"量数"</code>, <code>"数据"</code>, <code>"据库"</code> に分解されます。</p></li>
    <li><p>スペースと句読点は分解中に文字として扱われます。</p></li>
    <li><p>分解は元のケースを保持し、マッチングは大文字と小文字を区別します。たとえば、<code>"Database"</code> と <code>"database"</code> は異なる n-gram を生成し、クエリ中に正確なケースマッチングを必要とします。</p></li>
    </ul>

    </Admonition>

1. **転置インデックスの構築**: 各生成された n-gram を、それを含むドキュメント ID のリストにマッピングする**転置インデックス**が作成されます。

    たとえば、2-gram の「"AI"」が ID 1、5、6、8、9 のドキュメントに出現する場合、インデックスは `{"AI": [1, 5, 6, 8, 9]}` を記録します。このインデックスは、クエリ時に検索範囲を素早く絞り込むために使用されます。

![BVPlwaN7Lh7UZibGopwcAcYQn1d](https://zdoc-images.s3.us-west-2.amazonaws.com/BVPlwaN7Lh7UZibGopwcAcYQn1d.png)

    <Admonition type="info" icon="📘" title="Notes">

    <p><code>[min_gram, max_gram]</code> の範囲が広いほど、より多くのグラムとより大きなマッピングリストが作成されます。メモリが逼迫している場合は、非常に大きなポスティングリストに対して mmap モードを検討してください。詳細については、<a href="./use-mmap">mmap の使用</a>を参照してください。</p>

    </Admonition>

### フェーズ 2: クエリの高速化{#phase-2-accelerate-queries}

`LIKE` フィルターが実行されると、Zilliz Cloud は NGRAM インデックスを使用して次のステップでクエリを高速化します。

![XKwRwOPv6hqzpTb3ue8cbM8WnGe](https://zdoc-images.s3.us-west-2.amazonaws.com/XKwRwOPv6hqzpTb3ue8cbM8WnGe.png)

1. **クエリ用語の抽出:** ワイルドカードを含まない連続した部分文字列が `LIKE` 式から抽出されます（例: `"%database%"` は `"database"` になります）。

1. **クエリ用語の分解:** クエリ用語は、その長さ（`L`）と `min_gram` および `max_gram` の設定に基づいて *n-gram* に分解されます。

    - `L < min_gram` の場合、インデックスは使用できず、クエリはフルスキャンにフォールバックします。

    - `min_gram ≤ L ≤ max_gram` の場合、クエリ用語全体が単一の n-gram として扱われ、それ以上の分解は不要です。

    - `L > max_gram` の場合、クエリ用語は `max_gram` と等しいウィンドウサイズを使用して重複するグラムに分解されます。

    たとえば、`max_gram` が `3` に設定され、クエリ用語が長さ **8** の `"database"` の場合、それは `"dat"`、`"ata"`、`"tab"` などの 3-gram 部分文字列に分解されます。

1. **各グラムの検索と交差**: Zilliz Cloud は、転置インデックス内の各クエリグラムを検索し、結果として得られるドキュメント ID リストを交差させて、少数の候補ドキュメントセットを見つけます。これらの候補には、クエリからのすべてのグラムが含まれています。

1. **結果の検証と返却:** 元の `LIKE` フィルターは、正確な一致を見つけるために、少数の候補セットに対してのみ最終チェックとして適用されます。

## NGRAM インデックスの作成{#create-an-ngram-index}

`VARCHAR` フィールドまたは `JSON` フィールド内の特定のパスに NGRAM インデックスを作成できます。

### 例 1: VARCHAR フィールドに作成{#example-1-create-on-a-varchar-field}

`VARCHAR` フィールドの場合、`field_name` を指定し、`min_gram` と `max_gram` を設定するだけです。

```python
from pymilvus import MilvusClient

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT") # Replace with your server address

# Assume you have defined a VARCHAR field named "text" in your collection schema

# Prepare index parameters
index_params = client.prepare_index_params()

# Add NGRAM index on the "text" field
# highlight-start
index_params.add_index(
    field_name="text",   # Target VARCHAR field
    index_type="NGRAM",           # Index type is NGRAM
    index_name="ngram_index",     # Custom name for the index
    min_gram=2,                   # Minimum substring length (e.g., 2-gram: "st")
    max_gram=3                    # Maximum substring length (e.g., 3-gram: "sta")
)
# highlight-end

# Create the index on the collection
client.create_index(
    collection_name="Documents",
    index_params=index_params
)
```

この設定は、`text`内の各文字列に対して2-gramと3-gramを生成し、それらを転置インデックスに保存します。

### 例2：JSONパス上に作成する{#example-2-create-on-a-json-path}

`JSON`フィールドの場合、gram設定に加えて、以下も指定する必要があります。

- `params.json_path` – インデックスを作成したい値を指すJSONパス。

- `params.json_cast_type` – NGRAMインデックス作成は文字列に対して動作するため、`"varchar"`（大文字小文字を区別しない）である必要があります。

```python
# Assume you have defined a JSON field named "json_field" in your collection schema, with a JSON path named "body"

# Prepare index parameters
index_params = client.prepare_index_params()

# Add NGRAM index on a JSON field
# highlight-start
index_params.add_index(
    field_name="json_field",              # Target JSON field
    index_type="NGRAM",                   # Index type is NGRAM
    index_name="json_ngram_index",        # Custom index name
    min_gram=2,                           # Minimum n-gram length
    max_gram=4,                           # Maximum n-gram length
    params={
        "json_path": "json_field[\"body\"]",  # Path to the value inside the JSON field
        "json_cast_type": "varchar"                  # Required: cast the value to varchar
    }
)
# highlight-end

# Create the index on the collection
client.create_index(
    collection_name="Documents",
    index_params=index_params
)
```

この例では、以下のように動作します。

- `json_field["body"]` の値のみがインデックスされます。

- 値はn-gramトークン化の前に `VARCHAR` にキャストされます。

- Zilliz Cloud は長さ2から4のサブストリングを生成し、それらを転置インデックスに保存します。

JSONフィールドのインデックス方法の詳細については、[JSONインデックス](json-indexing)を参照してください。

## NGRAMによって高速化されるクエリ{#queries-accelerated-by-ngram}

NGRAMインデックスが適用されるには、以下の条件を満たす必要があります。

- クエリが `NGRAM` インデックスを持つ `VARCHAR` フィールド（またはJSONパス）を対象としていること。

- `LIKE` パターンのリテラル部分が `min_gram` 文字以上であること。
*(例: 最短のクエリ用語が2文字と想定される場合、インデックス作成時に min_gram=2 を設定します。)*

サポートされているクエリタイプ：

- **前方一致**

    ```python
    # Match any string that starts with the substring "database"
    filter = 'text LIKE "database%"'
    ```

- **後方一致**

    ```python
    # Match any string that ends with the substring "database"
    filter = 'text LIKE "%database"'
    ```

- **中間一致**

    ```python
    # Match any string that contains the substring "database" anywhere
    filter = 'text LIKE "%database%"'
    ```

- **ワイルドカードマッチ**

    Zilliz Cloudは、`%`（ゼロ個以上の文字）と`_`（正確に1文字）の両方をサポートしています。

    ```python
    # Match any string where "st" appears first, and "um" appears later in the text 
    filter = 'text LIKE "%st%um%"'
    ```

- **JSON パス クエリ**

    ```python
    filter = 'json_field["body"] LIKE "%database%"'
    ```

フィルター式の構文の詳細については、[基本演算子](./basic-filtering-operators)を参照してください。

## インデックスを削除する{#drop-an-index}

既存のインデックスをコレクションから削除するには、`drop_index()` メソッドを使用します。

<Admonition type="info" icon="📘" title="Notes">

<p><strong>Milvus v2.6.x</strong>と互換性のあるクラスターでは、不要になったスカラーインデックスを直接削除できます。最初にコレクションをリリースする必要はありません。</p>

</Admonition>

```python
client.drop_index(
    collection_name="Documents",   # Name of the collection
    index_name="ngram_index" # Name of the index to drop
)
```

## 使用上の注意点{#usage-notes}

- **フィールドタイプ**: `VARCHAR` および `JSON` フィールドでサポートされています。JSON の場合、`params.json_path` と `params.json_cast_type="varchar"` の両方を提供します。

- **Unicode**: NGRAM 分解は文字ベースで言語に依存せず、空白と句読点を含みます。

- **スペースと時間のトレードオフ**: 広いグラム範囲 `[min_gram, max_gram]` は、より多くのグラムとより大きなインデックスを生成します。メモリが不足している場合は、大きなポスティングリストに対して `mmap` モードを検討してください。詳細については、[mmap の使用](./use-mmap)を参照してください。

- **不変性**: `min_gram` と `max_gram` はその場で変更できません。これらを調整するにはインデックスを再構築する必要があります。

## ベストプラクティス{#best-practices}

- **検索動作に合わせて min_gram と max_gram を選択する**

    - `min_gram=2`、`max_gram=3` から始めます。

    - `min_gram` は、ユーザーが入力すると予想される最短のリテラルに設定します。

    - `max_gram` は、意味のある部分文字列の一般的な長さに近い値に設定します。`max_gram` を大きくするとフィルタリングが向上しますが、スペースが増加します。

- **選択性の低いグラムを避ける**

    繰り返しが多いパターン (例: `"aaaaaa"`) はフィルタリングが弱く、得られる効果が限定的である可能性があります。

- **一貫して正規化する**

    ユースケースで必要とされる場合、取り込まれたテキストとクエリリテラルに同じ正規化 (例: 小文字化、トリミング) を適用します。

