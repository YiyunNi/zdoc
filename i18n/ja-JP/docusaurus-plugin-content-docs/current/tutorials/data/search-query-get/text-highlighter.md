---
title: "語彙ハイライター | Cloud"
slug: /text-highlighter
sidebar_label: "語彙ハイライター"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud のハイライターは、テキストフィールド内で一致した用語をカスタマイズ可能なタグで囲むことで注釈を付けます。ハイライト表示は、ドキュメントが一致する理由を説明し、結果の可読性を向上させ、検索およびRAGアプリケーションでのリッチレンダリングをサポートします。 | Cloud"
type: origin
token: BJCjwpj8JizP0nkI11uci1pPndh
sidebar_position: 12
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - データ
  - フィルター
  - フィルタリング式
  - フィルタリング
  - テキストマッチ
  - 語彙

---

import Admonition from '@theme/Admonition';


# 語彙ハイライター

Zilliz Cloud のハイライターは、テキストフィールド内のマッチした用語をカスタマイズ可能なタグで囲むことで注釈を付けます。ハイライト表示は、ドキュメントが一致する理由を説明し、結果の可読性を向上させ、検索および RAG アプリケーションでのリッチなレンダリングをサポートします。

ハイライト表示は、最終的な検索結果セットに対する後処理ステップとして実行されます。候補の取得、フィルタリングロジック、ランキング、スコアリングには影響しません。

ハイライターは、3つの独立した制御ディメンションを提供します。

- **強調表示される用語**

    強調表示される用語の出所を選択できます。たとえば、**BM25全文検索**で使用される検索用語、または**テキストベースのフィルタリング式**（`TEXT_MATCH`条件など）で指定されたクエリ用語を強調表示できます。

- **強調表示される用語のレンダリング方法**

    各一致の前後に挿入されるタグを設定することで、強調表示出力で一致した用語がどのように表示されるかを制御できます。たとえば、`{}`のような単純なマーカーや、リッチなレンダリングのための`<em></em>`のようなHTMLタグを使用できます。

- **強調表示されたテキストの返却方法**

    フラグメントとして強調表示された結果がどのように返されるかを制御できます。これには、フラグメントの開始位置、長さ、返されるフラグメントの数などが含まれます。

以下のセクションでは、これらのシナリオについて説明します。

## BM25全文検索における検索語のハイライト表示\{#search-term-highlighting-in-bm25-full-text-search}

BM25全文検索を実行する際、返された結果の**検索語**を強調表示することで、ドキュメントがクエリに一致する理由を説明するのに役立ちます。BM25全文検索の詳細については、[全文検索](./full-text-search)を参照してください。

このシナリオでは、強調表示される用語はBM25全文検索で使用される検索語から直接取得されます。ハイライターはこれらの用語を使用して、最終結果の一致したテキストに注釈を付けます。

次のコンテンツがテキストフィールドに保存されていると仮定します。

```plaintext
Milvus supports full text search. Use BM25 for keyword relevance. Filters can narrow results.
```

**ハイライター設定**

BM25全文検索で検索語句をハイライト表示するには、`Lexicalハイライター`を作成し、BM25全文検索の検索語句のハイライト表示を有効にします。

```python
from pymilvus import LexicalHighlighter

highlighter = LexicalHighlighter(
    pre_tags=["{"],              # Tag inserted before each highlighted term
    post_tags=["}"],             # Tag inserted after each highlighted term
    highlight_search_text=True   # Enable search term highlighting for BM25 full text search
)
```

この例では、以下のように設定されています。

- `pre_tags` と `post_tags` は、ハイライトされたテキストが出力でどのように表示されるかを制御します。この場合、一致した用語は `{}` で囲まれます（例： `{term}`）。タグのリストを複数指定することもできます（例： `["<b>", "<i>"]`）。複数の用語がハイライトされる場合、タグは一致シーケンスによって順番に適用され、ローテーションされます。

- `highlight_search_text=True` は、Zilliz Cloud に BM25全文検索の検索語をハイライトされた語のソースとして使用するように指示します。

ハイライターオブジェクトが作成されたら、その設定を BM25全文検索リクエストに適用します。

```python
results = client.search(
    ...,
    data=["BM25"],      # Search term used in BM25 full text search
    # highlight-next-line
    highlighter=highlighter # Pass highlighter config here
)
```

**ハイライト出力**

ハイライトが有効な場合、Zilliz Cloudはハイライトされたテキストを専用の`highlight`フィールドで返します。デフォルトでは、ハイライト出力は最初の一致した用語から始まるフラグメントとして返されます。

この例では、検索語は`"BM25"`であるため、返された結果でハイライトされます。

```json
{
    ...,
    "highlight": {
        "text": [
            "{BM25} for keyword relevance. Filters can narrow results."
        ]
    }
}
```

返されるフラグメントの位置、長さ、および数を制御するには、[ハイライトされたテキストをフラグメントとして返す](./text-highlighter#fragment-based-highlighting-output)を参照してください。

## フィルタリングにおけるクエリ用語のハイライト表示\{#query-term-highlighting-in-filtering}

検索用語のハイライト表示に加えて、テキストベースのフィルタリング式で使用される用語をハイライト表示できます。

<Admonition type="info" icon="📘" title="Notes">

<p>現在、クエリ用語のハイライト表示には<code>TEXT_MATCH</code>フィルタリング条件のみがサポートされています。詳細については、<a href="./text-match">テキストマッチ</a>を参照してください。</p>

</Admonition>

このシナリオでは、ハイライト表示される用語はテキストベースのフィルタリング式から取得されます。フィルタリングはどのドキュメントが一致するかを決定し、ハイライターは一致したテキストスパンに注釈を付けます。

次のコンテンツがテキストフィールドに保存されていると仮定します。

```python
This document explains how text filtering works in Milvus.
```

**ハイライター設定**

フィルタリングに使用されるクエリ用語をハイライト表示するには、`Lexicalハイライター` を作成し、フィルタリング条件に対応する `highlight_query` を定義します。

```python
from pymilvus import Collection
from pymilvus.model.hybrid import Lexicalハイライター

# This is the collection you are querying.
collection = Collection("your_collection_name") 

# Define the highlight_query based on your filtering condition.
# For example, if your filter is "book_name like 'The%'", then highlight_query should be "The".
highlight_query = "The" 

# Create a Lexicalハイライター instance.
highlighter = Lexicalハイライター(
    collection=collection,
    highlight_query=highlight_query,
    output_field="book_name",  # The field whose content you want to highlight.
    # If you want to highlight multiple fields, you can pass a list of field names.
    # output_field=["book_name", "book_intro"], 
    # If you want to highlight all fields, you can set output_field to "__all__".
    # output_field="__all__",
    # The prefix and suffix to add to the highlighted terms.
    prefix="<b>",
    suffix="</b>",
    # The maximum number of highlighted snippets to return.
    max_snippets=1,
    # The maximum length of each highlighted snippet.
    max_snippet_offset=128,
)

# Perform a search with the highlighter.
# The 'data' field in the search results will contain the highlighted content.
res = collection.search(
    data=[[0.1, 0.2]], 
    anns_field="book_intro", 
    param={},
    limit=4, 
    output_fields=["book_name", "book_intro"],
    highlighter=highlighter
)

# Print the highlighted results.
for hit in res[0]:
    print(hit.entity.get("book_name"))
    print(hit.entity.get("book_intro"))
```

```python
from pymilvus import LexicalHighlighter

highlighter = LexicalHighlighter(
    pre_tags=["{"],              # Tag inserted before each highlighted term
    post_tags=["}"],             # Tag inserted after each highlighted term
    highlight_query=[{
        "type": "TextMatch",     # Text filtering type
        "field": "text",         # Target text field
        "text": "text filtering" # Terms to highlight
    }]
)
```

この設定では、次のようになります。

- `pre_tags` と `post_tags` は、ハイライトされたテキストが出力でどのように表示されるかを制御します。この場合、一致した用語は `{}` で囲まれます (例: `{term}`)。複数のタグをリストとして提供することもできます (例: `["<b>", "<i>"]`)。複数の用語がハイライトされる場合、タグは一致シーケンスによって順番に適用され、ローテーションされます。

- `highlight_query` は、どのフィルタリング用語をハイライトするかを定義します。

ハイライター オブジェクトが作成されたら、同じフィルタリング式とハイライター設定を検索リクエストに適用します。

```python
results = client.search(
    ...,
    filter='TEXT_MATCH(text, "text filtering")',
    # highlight-next-line
    highlighter=highlighter # Pass highlighter config here
)
```

**ハイライト出力**

クエリ用語のハイライトがフィルタリングのために有効になっている場合、Zilliz Cloudは専用の`highlight`フィールドにハイライトされたテキストを返します。デフォルトでは、ハイライトされた出力は最初の一致した用語から始まるフラグメントとして返されます。

この例では、最初の一致した用語は`"text"`であるため、返されるハイライトされたテキストはその位置から始まります。

```json
{
    ...,
    "highlight": {
        "text": [
            "{text} {filtering} works in Milvus."
        ]
    }
}
```

返されるフラグメントの位置、長さ、および数を制御するには、[フラグメントベースのハイライト出力としてハイライトされたテキストを返す](./text-highlighter#fragment-based-highlighting-output)を参照してください。

## フラグメントベースのハイライト出力\{#fragment-based-highlighting-output}

デフォルトでは、Zilliz Cloud は、最初に一致した用語から始まるフラグメントとしてハイライトされたテキストを返します。フラグメント関連の設定を使用すると、どの用語がハイライトされるかを変更することなく、フラグメントがどのように返されるかをさらに制御できます。

次のコンテンツがテキストフィールドに保存されていると仮定します。

```plaintext
Milvus supports full text search. Use BM25 for keyword relevance. Filters can narrow results.
```

**ハイライター設定**

ハイライトされたフラグメントの形状を制御するには、`Lexicalハイライター` でフラグメント関連のオプションを設定します。

```python
from pymilvus import LexicalHighlighter

highlighter = LexicalHighlighter(
    pre_tags=["{"],
    post_tags=["}"],
    highlight_search_text=True,
    fragment_offset=5,     # Number of characters to reserve before the first matched term
    fragment_size=60,      # Max. length of each fragment to return
    num_of_fragments=1     # Max. number of fragments to return
)
```

この設定では、次のようになります。

- `fragment_offset` は、最初のハイライトされた用語の前に先行するコンテキストを予約します。

- `fragment_size` は、各フラグメントに含まれるテキストの量を制限します。

- `num_of_fragments` は、返されるフラグメントの数を制御します。

ハイライター オブジェクトが作成されたら、ハイライター設定を検索リクエストに適用します。

```python
results = client.search(
    ...,
    data=["BM25"],
    # highlight-next-line
    highlighter=highlighter # Pass highlighter config here
)
```

**ハイライト出力**

フラグメントベースのハイライトが有効になっている場合、Zilliz Cloudはハイライトされたテキストを`highlight`フィールドにフラグメントとして返します。

```json
{
    ...,
    "highlight": {
        "text": [
            "Use {BM25} for keyword relevance. Filters can narrow results."
        ]
    }
}
```

この出力では、以下が該当します。

- `fragment_offset`が設定されているため、フラグメントは正確に`{BM25}`から開始しません。

- `num_of_fragments`が1であるため、1つのフラグメントのみが返されます。

- フラグメントの長さは`fragment_size`によって制限されます。

## 例\{#examples}

### 準備\{#preparation}

ハイライターを使用する前に、コレクションが適切に設定されていることを確認してください。

以下の例では、BM25全文検索と`TEXT_MATCH`クエリをサポートするコレクションを作成し、サンプルドキュメントを挿入します。

<details>

<summary><strong>コレクションを準備する</strong></summary>

```python
from pymilvus import (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
    LexicalHighlighter,
)

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")
COLLECTION_NAME = "highlighter_demo"

# Clean up existing collection
if client.has_collection(COLLECTION_NAME):
    client.drop_collection(COLLECTION_NAME)

# Define schema
schema = client.create_schema(enable_dynamic_field=False)
schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True, auto_id=True)
schema.add_field(
    field_name="text",
    datatype=DataType.VARCHAR,
    max_length=2000,
    enable_analyzer=True,  # Required for BM25
    enable_match=True,     # Required for TEXT_MATCH
)
schema.add_field(field_name="sparse_vector", datatype=DataType.SPARSE_FLOAT_VECTOR)

# Add BM25 function
schema.add_function(Function(
    name="text_bm25",
    function_type=FunctionType.BM25,
    input_field_names=["text"],
    output_field_names=["sparse_vector"],
))

# Create index
index_params = client.prepare_index_params()
index_params.add_index(
    field_name="sparse_vector",
    index_type="SPARSE_INVERTED_INDEX",
    metric_type="BM25",
    params={"inverted_index_algo": "DAAT_MAXSCORE", "bm25_k1": 1.2, "bm25_b": 0.75},
)

client.create_collection(collection_name=COLLECTION_NAME, schema=schema, index_params=index_params)

# Insert sample documents
docs = [
    "my first test doc",
    "my second test doc",
    "my first test doc. Milvus is an open-source vector database built for GenAI applications.",
    "my second test doc. Milvus is an open-source vector database that suits AI applications "
    "of every size from running a demo chatbot to building web-scale search.",
]
client.insert(collection_name=COLLECTION_NAME, data=[{"text": t} for t in docs])
print(f"✓ Collection created with {len(docs)} documents\n")

# Helper for search params
SEARCH_PARAMS = {"metric_type": "BM25", "params": {"drop_ratio_search": 0.0}}

# Expected output:
# ✓ Collection created with 4 documents
```

</details>

### 例1：BM25全文検索で検索語をハイライト表示する\{#example-1-highlight-search-terms-in-bm25-full-text-search}

この例では、BM25全文検索で検索語をハイライト表示する方法を示します。

- BM25全文検索では、検索語として`"test"`を使用します。

- ハイライターは、「test」のすべての出現箇所を`{`と`}`タグで囲みます。

```python
# highlight-start
highlighter = LexicalHighlighter(
    pre_tags=["{"],
    post_tags=["}"],
    highlight_search_text=True,  # Highlight BM25 query terms
)
# highlight-end

results = client.search(
    collection_name=COLLECTION_NAME,
    data=["test"],
    anns_field="sparse_vector",
    limit=10,
    search_params=SEARCH_PARAMS,
    output_fields=["text"],
    # highlight-next-line
    highlighter=highlighter,
)

for hit in results[0]:
    print(f"  {hit.get('highlight', {}).get('text', [])}")
print()
```

<details>

<summary>期待される出力</summary>

```plaintext
['{test} doc']
['{test} doc']
['{test} doc. Milvus is an open-source vector database built for GenAI applications.']
['{test} doc. Milvus is an open-source vector database that suits AI applications of every size from run']
```

</details>

### 例2：フィルタリングでクエリ用語をハイライトする\{#example-2-highlight-query-terms-in-filtering}

この例では、`TEXT_MATCH`フィルターによって一致した用語をハイライトする方法を示します。

- BM25全文検索は、クエリ用語として`"test"`を使用します。

- `queries`パラメータは、ハイライトリストに`"my doc"`を追加します。

- ハイライターは、一致したすべての用語（`"my"`、`"test"`、`"doc"`）を`{`と`}`で囲みます。

```python
# highlight-start
highlighter = LexicalHighlighter(
    pre_tags=["{"],
    post_tags=["}"],
    highlight_search_text=True,   # Also highlight BM25 term
    highlight_query=[                     # Additional TEXT_MATCH terms to highlight
        {"type": "TextMatch", "field": "text", "text": "my doc"},
    ],
)
# highlight-end

results = client.search(
    collection_name=COLLECTION_NAME,
    data=["test"],
    anns_field="sparse_vector",
    limit=10,
    search_params=SEARCH_PARAMS,
    output_fields=["text"],
    # highlight-next-line
    highlighter=highlighter,
)

for hit in results[0]:
    print(f"  {hit.get('highlight', {}).get('text', [])}")
print()
```

<details>

<summary>期待される出力</summary>

```plaintext
['{my} first {test} {doc}']
['{my} second {test} {doc}']
['{my} first {test} {doc}. Milvus is an open-source vector database built for GenAI applications.']
['{my} second {test} {doc}. Milvus is an open-source vector database that suits AI applications of every siz']
```

</details>

### 例 3: ハイライトをフラグメントとして返す\{#example-3-return-highlights-as-fragments}

この例では、クエリは「Milvus」を検索し、以下の設定でハイライトフラグメントを返します。

- `fragment_offset` は、最初のハイライトされたスパンの前の最大 20 文字を先行コンテキストとして保持します (デフォルトは 0)。

- `fragment_size` は、各フラグメントを約 60 文字に制限します (デフォルトは 100)。

- `num_of_fragments` は、テキスト値ごとに返されるフラグメントの数を制限します (デフォルトは 5)。

```python
# highlight-start
highlighter = LexicalHighlighter(
    pre_tags=["{"],
    post_tags=["}"],
    highlight_search_text=True,
    fragment_offset=20,  # Keep 20 chars before match
    fragment_size=60,    # Max ~60 chars per fragment
)
# highlight-end

results = client.search(
    collection_name=COLLECTION_NAME,
    data=["Milvus"],
    anns_field="sparse_vector",
    limit=10,
    search_params=SEARCH_PARAMS,
    output_fields=["text"],
    # highlight-next-line
    highlighter=highlighter,
)

for i, hit in enumerate(results[0]):
    frags = hit.get('highlight', {}).get('text', [])
    print(f"  Doc {i+1}: {frags}")
print()
```

<details>

<summary>期待される出力</summary>

```plaintext
Doc 1: ['my first test doc. {Milvus} is an open-source vector database ']
Doc 2: ['my second test doc. {Milvus} is an open-source vector database']
```

</details>

### 例4：複数クエリのハイライト表示\{#example-4-multi-query-highlighting}

BM25全文検索で複数のクエリを検索する場合、各クエリの結果は個別にハイライト表示されます。最初のクエリの結果にはその検索語のハイライトが含まれ、2番目のクエリの結果にはその検索語のハイライトが含まれる、といった具合です。各クエリは同じ`highlighter`設定を使用しますが、それを個別に適用します。

以下の例では：

- 最初のクエリは結果セット内の`"test"`をハイライト表示します。

- 2番目のクエリは結果セット内の`"Milvus"`をハイライト表示します。

```python
# highlight-start
highlighter = LexicalHighlighter(
    pre_tags=["{"],
    post_tags=["}"],
    highlight_search_text=True,
)
# highlight-end

results = client.search(
    collection_name=COLLECTION_NAME,
    data=["test", "Milvus"],  # Two queries
    anns_field="sparse_vector",
    limit=2,
    search_params=SEARCH_PARAMS,
    output_fields=["text"],
    # highlight-next-line
    highlighter=highlighter,
)

for nq_idx, hits in enumerate(results):
    query_term = ["test", "Milvus"][nq_idx]
    print(f"  Query '{query_term}':")
    for hit in hits:
        print(f"    {hit.get('highlight', {}).get('text', [])}")
print()
```

<details>

<summary>期待される出力</summary>

```plaintext
Query 'test':
  ['{test} doc']
  ['{test} doc']
Query 'Milvus':
  ['{Milvus} is an open-source vector database built for GenAI applications.']
  ['{Milvus} is an open-source vector database that suits AI applications of every size from running a dem']
```

</details>

### 例 5: カスタム HTML タグ\{#example-5-custom-html-tags}

Web UI の HTML セーフタグなど、ハイライト表示には任意のタグを使用できます。これは、検索結果をブラウザでレンダリングする場合に便利です。

```python
# highlight-start
highlighter = LexicalHighlighter(
    pre_tags=["<mark>"],
    post_tags=["</mark>"],
    highlight_search_text=True,
)
# highlight-end

results = client.search(
    collection_name=COLLECTION_NAME,
    data=["test"],
    anns_field="sparse_vector",
    limit=2,
    search_params=SEARCH_PARAMS,
    output_fields=["text"],
    # highlight-next-line
    highlighter=highlighter,
)

for hit in results[0]:
    print(f"  {hit.get('highlight', {}).get('text', [])}")
print()
```

<details>

<summary>期待される出力</summary>

```plaintext
['<mark>test</mark> doc']
['<mark>test</mark> doc']
```

</details>

