---
title: "RTREE | Cloud"
slug: /rtree-index-type
sidebar_key: rtree-index-type
sidebar_label: "RTREE"
beta: FALSE
notebook: FALSE
description: "`RTREE` インデックスは、Zilliz Cloud の `GEOMETRY` フィールドに対するクエリを高速化するツリー構造のデータ構造です。コレクションにポイント、ライン、ポリゴンなどの幾何オブジェクトを Well-known text (WKT) 形式で格納しており、空間フィルタリングを高速化したい場合、`RTREE` が最適な選択です。"
type: origin
token: RlY2wylVQiZswikT0G2cBHVznTf
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - スカラーフィールド
  - geometry
  - rtree

---

import Admonition from '@theme/Admonition';


# RTREE

`RTREE` インデックスは、Zilliz Cloud で `GEOMETRY` フィールドのクエリを高速化するツリーベースのデータ構造です。コレクションに [Well-known text (WKT)](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) 形式で点、線、ポリゴンなどの幾何オブジェクトが格納されており、空間フィルタリングを高速化したい場合、`RTREE` は理想的な選択です。

## 仕組み\{#how-it-works}

Zilliz Cloud は `RTREE` インデックスを使用して、幾何データを効率的に整理およびフィルタリングします。これは2段階のプロセスに従います：

### フェーズ 1: インデックスの構築\{#phase-1-build-the-index}

1. **リーフノードの作成:** 各幾何オブジェクトについて、[Minimum Bounding Rectangle](https://en.wikipedia.org/wiki/Minimum_bounding_rectangle)（MBR、オブジェクトを完全に含む最小の矩形）を計算し、リーフノードとして格納します。

1. **より大きなボックスへのグループ化:** 近くのリーフノードをクラスタリングし、各グループを新しい MBR で囲んで内部ノードを形成します。例えば、グループ **B** は **D** と **E** を含み、グループ **C** は **F** と **G** を含みます。

1. **ルートノードの追加:** すべての内部グループをカバーする MBR を持つルートノードを追加し、高さが平衡なツリー構造を形成します。

![Asy8w0umqh9jJ1biNUHcialonfd](https://zdoc-images.s3.us-west-2.amazonaws.com/Asy8w0umqh9jJ1biNUHcialonfd.png)

### フェーズ 2: クエリの高速化\{#phase-2-accelerate-queries}

1. **クエリ MBR の形成:** クエリの幾何オブジェクトの MBR を計算します。

1. **ブランチの剪定:** ルートから開始し、クエリ MBR を各内部ノードと比較します。クエリ MBR と交差しない MBR を持つブランチはスキップします。

1. **候補の収集:** 交差するブランチを降りて、候補となるリーフノードを収集します。

1. **完全一致:** 各候補に対して、厳密な空間述語を実行して真の一致を判定します。

## RTREE インデックスの作成\{#create-an-rtree-index}

コレクションスキーマで定義された `GEOMETRY` フィールドに `RTREE` インデックスを作成できます。

```python
from pymilvus import MilvusClient

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT") # Replace with your server address

# Assume you have defined a GEOMETRY field named "geo" in your collection schema

# Prepare index parameters
index_params = client.prepare_index_params()

# Add RTREE index on the "geo" field
# highlight-start
index_params.add_index(
    field_name="geo",
    index_type="RTREE",      # Spatial index for GEOMETRY
    index_name="rtree_geo",  # Optional, name your index
    params={}                # No extra params needed
)
# highlight-end

# Create the index on the collection
client.create_index(
    collection_name="geo_demo",
    index_params=index_params
)
```

## RTREE を使用したクエリ\{#query-with-rtree}

`filter` 式でジオメトリ演算子を使用してフィルタリングします。対象の `GEOMETRY` フィールドに `RTREE` が存在する場合、Zilliz Cloud は自動的にこれを使用して候補を剪定します。インデックスがない場合、フィルタはフルスキャンにフォールバックします。

使用可能なジオメトリ固有の演算子の完全なリストについては、[ジオメトリ演算子](./geometry-operators) を参照してください。

### 例 1: フィルタのみ\{#example-1-filter-only}

指定されたポリゴン内にあるすべてのジオメトリオブジェクトを検索します:

```python
filter_expr = "ST_CONTAINS(geo, 'POLYGON ((0 0, 10 0, 10 10, 0 10, 0 0))')"

res = client.query(
    collection_name="geo_demo",
    filter=filter_expr,
    output_fields=["id", "geo"],
    limit=10
)
print(res)   # Expected: a list of rows where geo is entirely inside the polygon
```

### 例 2: ベクトル検索 + 空間フィルタ\{#example-2-vector-search-spatial-filter}

線と交差する最も近いベクトルを検索します：

```python
# Assume you've also created an index on "vec" and loaded the collection.
query_vec = [[0.1, 0.2, 0.3, 0.4, 0.5]]
filter_expr = "ST_INTERSECTS(geo, 'LINESTRING (1 1, 2 2)')"

hits = client.search(
    collection_name="geo_demo",
    data=query_vec,
    limit=5,
    filter=filter_expr,
    output_fields=["id", "geo"]
)
print(hits)  # Expected: top-k by vector similarity among rows whose geo intersects the line
```

`GEOMETRY` フィールドの使用方法の詳細については、[ジオメトリ フィールド](./use-geometry-field) を参照してください。

## インデックスを削除する\{#drop-an-index}

`drop_index()` メソッドを使用して、コレクションから既存のインデックスを削除します。

<Admonition type="info" icon="📘" title="Notes">

<p><strong>Milvus v2.6.x</strong> 互換のクラスタでは、不要になったスカラー インデックスを直接削除できます。事前にコレクションをリリースする必要はありません。</p>

</Admonition>

```python
client.drop_index(
    collection_name="geo_demo",   # Name of the collection
    index_name="rtree_geo" # Name of the index to drop
)
```
