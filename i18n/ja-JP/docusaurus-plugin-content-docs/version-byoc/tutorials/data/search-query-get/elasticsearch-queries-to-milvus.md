---
title: "Elasticsearch クエリから Milvus へ | BYOC"
slug: /elasticsearch-queries-to-milvus
sidebar_label: "Elasticsearch クエリから Milvus へ"
beta: FALSE
notebook: FALSE
description: "Apache Lucene をベースに構築された Elasticsearch は、主要なオープンソース検索エンジンです。しかし、高い更新コスト、劣悪なリアルタイム性能、非効率な shard 管理、クラウドネイティブではない設計、過剰なリソース要求など、現代の AI アプリケーションにおいて課題に直面しています。クラウドネイティブなベクトルデータベースである Milvus は、ストレージとコンピューティングの分離、高次元データに対する効率的なインデックス作成、最新のインフラストラクチャとのシームレスな統合により、これらの問題を克服します。AI ワークロードに対して優れた性能とスケーラビリティを提供します。 | BYOC"
type: origin
token: OFl9wHXpriM8aEkoONScpU1lnIf
sidebar_position: 15
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - collection
  - データ
  - フィルター
  - フィルタリング式
  - フィルタリング
  - elasticsearch クエリ
  - クエリマッピング
  - 情報検索
  - 次元削減
  - hnsw アルゴリズム
  - ベクトル類似性検索

---

import Admonition from '@theme/Admonition';


# Elasticsearch クエリから Milvus へ

Apache Lucene 上に構築された Elasticsearch は、主要なオープンソース検索エンジンです。しかし、現代の AI アプリケーションでは、高い更新コスト、貧弱なリアルタイム性能、非効率なシャード管理、クラウドネイティブではない設計、過剰なリソース要求といった課題に直面しています。クラウドネイティブなベクトルデータベースである Milvus は、ストレージとコンピューティングの分離、高次元データに対する効率的なインデックス作成、最新のインフラストラクチャとのシームレスな統合により、これらの問題を克服します。AI ワークロードに対して優れた性能とスケーラビリティを提供します。

この記事は、Elasticsearch から Milvus へのコードベースの移行を容易にすることを目的としており、クエリの変換に関する様々な例を提供します。

## 概要{#overview}

Elasticsearch では、クエリコンテキストでの操作は関連性スコアを生成しますが、フィルターコンテキストでの操作は生成しません。同様に、Milvus の検索は類似性スコアを生成しますが、フィルターのようなクエリは生成しません。Elasticsearch から Milvus へコードベースを移行する際の主要な原則は、Elasticsearch のクエリコンテキストで使用されるフィールドをベクトルフィールドに変換して、類似性スコアの生成を可能にすることです。

以下の表は、Elasticsearch のクエリパターンと Milvus での対応する同等物をいくつか示しています。

<table>
   <tr>
     <th><p>Elasticsearch クエリ</p></th>
     <th><p>Milvus の同等物</p></th>
     <th><p>備考</p></th>
   </tr>
   <tr>
     <td colspan="3"><p><strong>全文クエリ</strong></p></td>
   </tr>
   <tr>
     <td><p><a href="./elasticsearch-queries-to-milvus#match-query">Match クエリ</a></p></td>
     <td><p>Full-text search</p></td>
     <td><p>両方とも同様の機能セットを提供します。</p></td>
   </tr>
   <tr>
     <td colspan="3"><p><strong>タームレベルクエリ</strong></p></td>
   </tr>
   <tr>
     <td><p><a href="./elasticsearch-queries-to-milvus#ids">IDs</a></p></td>
     <td><p><code>in</code> 演算子</p></td>
     <td rowspan="6"><p>これらの Elasticsearch クエリがフィルターコンテキストで使用される場合、両方とも同じまたは類似の機能セットを提供します。</p></td>
   </tr>
   <tr>
     <td><p><a href="./elasticsearch-queries-to-milvus#prefix-query">Prefix クエリ</a></p></td>
     <td><p><code>like</code> 演算子</p></td>
   </tr>
   <tr>
     <td><p><a href="./elasticsearch-queries-to-milvus#range-query">Range クエリ</a></p></td>
     <td><p><code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code> のような比較演算子</p></td>
   </tr>
   <tr>
     <td><p><a href="./elasticsearch-queries-to-milvus#term-query">Term クエリ</a></p></td>
     <td><p><code>==</code> のような比較演算子</p></td>
   </tr>
   <tr>
     <td><p><a href="./elasticsearch-queries-to-milvus#terms-query">Terms クエリ</a></p></td>
     <td><p><code>in</code> 演算子</p></td>
   </tr>
   <tr>
     <td><p><a href="./elasticsearch-queries-to-milvus#wildcard-query">Wildcard クエリ</a></p></td>
     <td><p><code>like</code> 演算子</p></td>
   </tr>
   <tr>
     <td><p><a href="./elasticsearch-queries-to-milvus#boolean-query">Boolean クエリ</a></p></td>
     <td><p><code>AND</code> のような論理演算子</p></td>
     <td><p>フィルターコンテキストで使用される場合、両方とも同様の機能セットを提供します。</p></td>
   </tr>
   <tr>
     <td colspan="3"><p><strong>ベクトルクエリ</strong></p></td>
   </tr>
   <tr>
     <td><p><a href="./elasticsearch-queries-to-milvus#knn-query">kNN クエリ</a></p></td>
     <td><p>Search</p></td>
     <td><p>Milvus はより高度なベクトル検索機能を提供します。</p></td>
   </tr>
   <tr>
     <td><p><a href="./elasticsearch-queries-to-milvus#reciprocal-rank-fusion">Reciprocal rank fusion</a></p></td>
     <td><p>Hybrid Search</p></td>
     <td><p>Milvus は複数の再ランキング戦略をサポートしています。</p></td>
   </tr>
</table>

## 全文クエリ{#full-text-queries}

Elasticsearch では、全文クエリを使用すると、メールの本文などの分析されたテキストフィールドを検索できます。クエリ文字列は、インデックス作成時にフィールドに適用されたのと同じアナライザーを使用して処理されます。

### Match クエリ{#match-query}

Elasticsearch では、match クエリは、提供されたテキスト、数値、日付、またはブール値に一致するドキュメントを返します。提供されたテキストは、マッチングの前に分析されます。

以下は、match クエリを含む Elasticsearch 検索リクエストの例です。

```bash
resp = client.search(
    query={
        "match": {
            "message": {
                "query": "this is a test"
            }
        }
    },
)

```

Milvus は、フルテキスト検索機能を通じて同じ機能を提供します。上記の Elasticsearch クエリは、次のように Milvus に変換できます。

```python
res = client.search(
    collection_name="my_collection",
    data=['How is the weather in Jamaica?'],
    anns_field="message_sparse",
    output_fields=["id", "message"]
)
```

上記の例では、`message_sparse` は `message` という名前の VarChar フィールドから派生した疎ベクトルフィールドです。Milvus は BM25 埋め込みモデルを使用して、`message` フィールドの値を疎ベクトル埋め込みに変換し、それらを `message_sparse` フィールドに保存します。検索リクエストを受信すると、Milvus は同じ BM25 モデルを使用してプレーンテキストクエリペイロードを埋め込み、疎ベクトル検索を実行し、`output_fields` パラメータで指定された `id` および `message` フィールドと、対応する類似度スコアを返します。

この機能を使用するには、`message` フィールドで analyzer を有効にし、そこから `message_sparse` フィールドを派生させる関数を定義する必要があります。Milvus で analyzer を有効にし、派生関数を作成する方法の詳細については、[Full Text Search](./full-text-search) を参照してください。

## タームレベルクエリ{#term-level-queries}

Elasticsearch では、タームレベルクエリは、日付範囲、IPアドレス、価格、製品IDなどの構造化データ内の正確な値に基づいてドキュメントを検索するために使用されます。このセクションでは、Milvus における一部の Elasticsearch タームレベルクエリの可能な同等物について概説します。このセクションのすべての例は、Milvus の機能に合わせてフィルターコンテキスト内で動作するように調整されています。

### ID{#ids}

Elasticsearch では、フィルターコンテキストで ID に基づいてドキュメントを検索できます。

```python
resp = client.search(
    query={
        "bool": {
            "filter": {
                "ids": {
                    "values": [
                        "1",
                        "4",
                        "100"
                    ]
                }            
            }
        }
    },
)
```

Milvus では、ID に基づいてエンティティを検索することもできます。

```python
# Use the filter parameter
res = client.query(
    collection_name="my_collection",
    filter="id in [1, 4, 100]",
    output_fields=["id", "title"]
)

# Use the ids parameter
res = client.query(
    collection_name="my_collection",
    ids=[1, 4, 100],
    output_fields=["id", "title"]
)
```

Elasticsearch の例は、[このページ](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-ids-query.html)で確認できます。Milvus のクエリと取得リクエスト、およびフィルター式の詳細については、[クエリ](./get-and-scalar-query)と[フィルタリング](./filtering)を参照してください。

### プレフィックスクエリ{#prefix-query}

Elasticsearch では、フィルターコンテキストで指定されたフィールドに特定のプレフィックスを含むドキュメントを次のように見つけることができます。

```python
resp = client.search(
    query={
        "bool": {
            "filter": {
                 "prefix": {
                    "user": {
                        "value": "ki"
                    }
                }           
            }
        }
    },
)

```

Milvus では、指定されたプレフィックスで始まる値を持つエンティティを次のように検索できます。

```python
res = client.query(
    collection_name="my_collection",
    filter='user like "ki%"',
    output_fields=["id", "user"]
)
```

Elasticsearchの例は[このページ](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-prefix-query.html)で確認できます。Milvusの`like`演算子の詳細については、[パターンマッチングに`LIKE`を使用する](./basic-filtering-operators#example-2-using-like-for-pattern-matching)を参照してください。

### 範囲クエリ{#range-query}

Elasticsearchでは、指定された範囲内の用語を含むドキュメントを次のように検索できます。

```python
resp = client.search(
    query={
        "bool": {
            "filter": {
                "range": {
                    "age": {
                        "gte": 10,
                        "lte": 20
                    }
                }           
            }
        }
    },
)

```

Milvus では、特定のフィールドの値が指定された範囲内にあるエンティティを次のように検索できます。

```python
res = client.query(
    collection_name="my_collection",
    filter='10 <= age <= 20',
    output_fields=["id", "user", "age"]
)
```

Elasticsearch の例は、[このページ](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html)で確認できます。Milvus の比較演算子の詳細については、[比較演算子](./basic-filtering-operators#comparison-operators)を参照してください。

### Term query\{#term-query}

Elasticsearch では、指定されたフィールドに**正確な**用語を含むドキュメントを次のように検索できます。

```python
resp = client.search(
    query={
        "bool": {
            "filter": {
                "term": {
                    "status": {
                        "value": "retired"
                    }
                }            
            }
        }
    },
)

```

Milvus では、指定されたフィールドの値が指定された用語と完全に一致するエンティティを次のように検索できます。

```python
# use ==
res = client.query(
    collection_name="my_collection",
    filter='status=="retired"',
    output_fields=["id", "user", "status"]
)

# use TEXT_MATCH
res = client.query(
    collection_name="my_collection",
    filter='TEXT_MATCH(status, "retired")',
    output_fields=["id", "user", "status"]
)
```

Elasticsearch の例は、[このページ](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html)で確認できます。Milvus の比較演算子の詳細については、[比較演算子](./basic-filtering-operators#comparison-operators)を参照してください。

### Terms クエリ{#terms-query}

Elasticsearch では、指定されたフィールドに 1 つ以上の**正確な**用語を含むドキュメントを次のように見つけることができます。

```python
resp = client.search(
    query={
        "bool": {
            "filter": {
                "terms": {
                    "degree": [
                        "graduate",
                        "post-graduate"
                    ]
                }        
            }
        }
    }
)

```

Milvus にはこれと完全に同等のものはありません。ただし、指定されたフィールドの値が指定された用語のいずれかであるエンティティは、次のように見つけることができます。

```python
# use in
res = client.query(
    collection_name="my_collection",
    filter='degree in ["graduate", "post-graduate"]',
    output_fields=["id", "user", "degree"]
)

# use TEXT_MATCH
res = client.query(
    collection_name="my_collection",
    filter='TEXT_MATCH(degree, "graduate post-graduate")',
    output_fields=["id", "user", "degree"]
)
```

Elasticsearch の例は、[このページ](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html)で確認できます。Milvus の範囲演算子の詳細については、[範囲演算子](./basic-filtering-operators#range-operators)を参照してください。

### ワイルドカードクエリ{#wildcard-query}

Elasticsearch では、ワイルドカードパターンに一致する用語を含むドキュメントを次のように見つけることができます。

```python
resp = client.search(
    query={
        "bool": {
            "filter": {
                "wildcard": {
                    "user": {
                        "value": "ki*y"
                    }
                }          
            }
        }
    },
)

```

Milvusはフィルタリング条件でワイルドカードをサポートしていません。ただし、`like`演算子を使用することで、以下のように同様の効果を得ることができます。

```python
res = client.query(
    collection_name="my_collection",
    filter='user like "ki%" AND user like "%y"',
    output_fields=["id", "user"]
)
```

Elasticsearch の例は、[このページ](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html)で確認できます。Milvus の範囲演算子の詳細については、[範囲演算子](./basic-filtering-operators#range-operators)を参照してください。

## ブールクエリ{#boolean-query}

Elasticsearch では、ブールクエリは、他のクエリのブール結合に一致するドキュメントを照合するクエリです。

次の例は、Elasticsearch ドキュメントの[このページ](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html)の例を改変したものです。このクエリは、名前に `kimchy` が含まれ、`production` タグを持つユーザーを返します。

```python
resp = client.search(
    query={
        "bool": {
            "filter": {
                "term": {
                    "user": "kimchy"
                }
            },
            "filter": {
                "term": {
                    "tags": "production"
                }
            }
        }
    },
)

```

Milvusでは、以下のように同様のことができます。

```python
filter = 

res = client.query(
    collection_name="my_collection",
    filter='user like "%kimchy%" AND ARRAY_CONTAINS(tags, "production")',
    output_fields=["id", "user", "age", "tags"]
)
```

上記の例では、ターゲットコレクションに **VarChar** 型の `user` フィールドと **Array** 型の `tags` フィールドがあることを前提としています。このクエリは、名前に `kimchy` が含まれ、`production` タグを持つユーザーを返します。

## ベクトルクエリ{#vector-queries}

Elasticsearchでは、ベクトルクエリはベクトルフィールドで機能する特殊なクエリであり、セマンティック検索を効率的に実行します。

### Knn クエリ{#knn-query}

Elasticsearchは、近似kNNクエリと正確なブルートフォースkNNクエリの両方をサポートしています。類似度メトリックで測定されるように、クエリベクトルに最も近い*k*個のベクトルを次のいずれかの方法で見つけることができます。

```python
resp = client.search(
    index="my-image-index",
    size=3,
    query={
        "knn": {
            "field": "image-vector",
            "query_vector": [
                -5,
                9,
                -12
            ],
            "k": 10
        }
    },
)

```

特殊なベクトルデータベースである Milvus は、ベクトル検索を最適化するためにインデックスタイプを使用します。通常、高次元ベクトルデータに対しては、近似最近傍 (ANN) 検索を優先します。FLAT インデックスタイプを使用したブルートフォース kNN 検索は正確な結果をもたらしますが、時間とリソースを大量に消費します。対照的に、AUTOINDEX またはその他のインデックスタイプを使用した ANN 検索は、速度と精度のバランスを取り、kNN よりもはるかに高速でリソース効率の高いパフォーマンスを提供します。インデックスタイプと AUTOINDEX の詳細については、[インデックスの管理](./manage-indexes)および[AUTOINDEX の解説](./autoindex-explained)を参照してください。

Milvus における上記のベクトルクエリと同様の等価性は次のとおりです。

```python
res = client.search(
    collection_name="my_collection",
    anns_field="image-vector"
    data=[[-5, 9, -12]],
    limit=10
)
```

Elasticsearch の例は、[このページ](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-knn-query.html)で確認できます。Milvus における ANN 検索の詳細については、[基本的な ANN 検索](./single-vector-search)を参照してください。

### Reciprocal Rank Fusion\{#reciprocal-rank-fusion}

Elasticsearch は、Reciprocal Rank Fusion (RRF) を提供し、異なる関連性指標を持つ複数の結果セットを単一のランク付けされた結果セットに結合します。

次の例は、従来の用語ベースの検索と k-近傍 (kNN) ベクトル検索を組み合わせて、検索の関連性を向上させる方法を示しています。

```python
client.search(
    index="my_index",
    size=10,
    query={
        "retriever": {
            "rrf": {
                "retrievers": [
                    {
                        "standard": {
                            "query": {
                                "term": {
                                    "text": "shoes"
                                }
                            }
                        }
                    },
                    {
                        "knn": {
                            "field": "vector",
                            "query_vector": [1.25, 2, 3.5],  # Example vector; replace with your actual query vector
                            "k": 50,
                            "num_candidates": 100
                        }
                    }
                ],
                "rank_window_size": 50,
                "rank_constant": 20
            }
        }
    }
)
```

この例では、RRF は 2 つのリトリーバーからの結果を結合します。

- `text` フィールドに `"shoes"` という用語を含むドキュメントに対する標準的な用語ベースの検索。

- 提供されたクエリベクトルを使用した `vector` フィールドに対する kNN 検索。

各リトリーバーは最大 50 件のトップマッチを提供し、これらは RRF によって再ランク付けされ、最終的なトップ 10 の結果が返されます。

Milvus では、複数のベクトルフィールドにわたる検索を組み合わせ、再ランク付け戦略を適用し、結合されたリストからトップ K の結果を取得することで、同様のハイブリッド検索を実現できます。Milvus は RRF と重み付け再ランク付け戦略の両方をサポートしています。詳細については、[Reranking](./reranking) を参照してください。

以下は、上記の Elasticsearch の例を Milvus で非厳密に同等にしたものです。

```python
search_params_dense = {
    "data": [[1.25, 2, 3.5]],
    "anns_field": "vector",
    "param": {
        "metric_type": "IP",
        
    },
    "limit": 100
}

req_dense = ANNSearchRequest(**search_params_dense)

search_params_sparse = {
    "data": ["shoes"],
    "anns_field": "text_sparse",
    "param": {
        "metric_type": "BM25",
    }
}

req_sparse = ANNSearchRequest(**search_params_sparse)

res = client.hybrid_search(
    collection_name="my_collection",
    reqs=[req_dense, req_sparse],
    reranker=RRFRanker(),
    limit=10
)
```

この例では、以下の要素を組み合わせたMilvusでのハイブリッド検索を示します。

1. **密ベクトル検索**: `vector`フィールドで近似最近傍 (ANN) 検索に内積 (IP) メトリックを使用します。

1. **疎ベクトル検索**: `text_sparse`フィールドでBM25類似度メトリックを使用します。

これらの検索結果は個別に実行され、結合され、Reciprocal Rank Fusion (RRF) ランカーを使用して再ランク付けされます。ハイブリッド検索は、再ランク付けされたリストから上位10エンティティを返します。

ElasticsearchのRRFランキングが標準のテキストベースクエリとkNN検索の結果をマージするのとは異なり、Milvusは疎ベクトル検索と密ベクトル検索の結果を組み合わせ、マルチモーダルデータに最適化された独自のハイブリッド検索機能を提供します。

## まとめ\{#recap}

この記事では、一般的なElasticsearchクエリをMilvusの同等なクエリに変換する方法について説明しました。これには、タームレベルクエリ、ブールクエリ、全文検索クエリ、ベクトルクエリが含まれます。他のElasticsearchクエリの変換についてさらに質問がある場合は、お気軽にお問い合わせください。