---
title: "ジオメトリ演算子 | BYOC"
slug: /geometry-operators
sidebar_label: "ジオメトリ演算子"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、GEOMETRYフィールドに対する空間フィルタリングのための演算子セットをサポートしており、これはジオメトリデータの管理と分析に不可欠です。これらの演算子を使用すると、オブジェクト間のジオメトリ関係に基づいてエンティティを取得できます。 | BYOC"
type: origin
token: SOgiwzPxpisy8MkhtuecZqFbnaf
sidebar_position: 7
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - collection
  - データ
  - フィルター
  - フィルタリング式
  - フィルタリング
  - ジオメトリ
  - DiskANN
  - Sparse vector
  - Vector Dimension
  - ANN Search

---

import Admonition from '@theme/Admonition';


# Geometry Operators

Zilliz Cloud は、`GEOMETRY` フィールドの空間フィルタリング用の一連の演算子をサポートしており、これは幾何学的データの管理と分析に不可欠です。これらの演算子を使用すると、オブジェクト間の幾何学的関係に基づいてエンティティを取得できます。

すべてのジオメトリ演算子は、2つの幾何学的引数を取ることによって機能します。1つはコレクション schema で定義された `GEOMETRY` フィールドの名前、もう1つは [Well-Known Text](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) (WKT) 形式で表現されたターゲットジオメトリオブジェクトです。

## 構文の使用方法{#use-syntax}

`GEOMETRY` フィールドでフィルタリングするには、式でジオメトリ演算子を使用します。

- 一般的な形式: `{operator}(geo_field, '{wkt}')`

- 距離ベースの形式: `ST_DWITHIN(geo_field, '{wkt}', distance)`

ここで、

- `operator` はサポートされているジオメトリ演算子のいずれかです (例: `ST_CONTAINS`, `ST_INTERSECTS`)。演算子名はすべて大文字またはすべて小文字である必要があります。サポートされている演算子のリストについては、[サポートされているジオメトリ演算子](./geometry-operators#supported-geometry-operators)を参照してください。

- `geo_field` は `GEOMETRY` フィールドの名前です。

- `'{wkt}'` はクエリ対象のジオメトリの WKT 表現です。

- `distance` は `ST_DWITHIN` 専用のしきい値です。

Zilliz Cloud の `GEOMETRY` フィールドの詳細については、[Geometry Field](./use-geometry-field) を参照してください。

## サポートされているジオメトリ演算子{#supported-geometry-operators}

次の表に、Zilliz Cloud で利用可能なジオメトリ演算子を示します。

<Admonition type="info" icon="📘" title="Notes">

<p>演算子名は、<strong>すべて大文字</strong>または<strong>すべて小文字</strong>である必要があります。同じ演算子名内で大文字と小文字を混在させないでください。</p>

</Admonition>

<table>
   <tr>
     <th><p>演算子</p></th>
     <th><p>説明</p></th>
     <th><p>例</p></th>
   </tr>
   <tr>
     <td><p><code>ST_EQUALS(A, B)</code> / <code>st_equals(A, B)</code></p></td>
     <td><p>2つのジオメトリが空間的に同一である場合、つまり同じ点の集合と次元を持つ場合に TRUE を返します。</p></td>
     <td><p>2つのジオメトリ (A と B) は空間的に完全に同じですか？</p></td>
   </tr>
   <tr>
     <td><p><code>ST_CONTAINS(A, B)</code> / <code>st_contains(A, B)</code></p></td>
     <td><p>ジオメトリ A がジオメトリ B を完全に含み、それらの内部が少なくとも1つの共通点を持つ場合に TRUE を返します。</p></td>
     <td><p>都市の境界 (A) は特定の公園 (B) を含んでいますか？</p></td>
   </tr>
   <tr>
     <td><p><code>ST_CROSSES(A, B)</code> / <code>st_crosses(A, B)</code></p></td>
     <td><p>ジオメトリ A と B が部分的に交差するが、互いを完全に含まない場合に TRUE を返します。</p></td>
     <td><p>2つの道路 (A と B) は交差点で交差していますか？</p></td>
   </tr>
   <tr>
     <td><p><code>ST_INTERSECTS(A, B)</code> / <code>st_intersects(A, B)</code></p></td>
     <td><p>ジオメトリ A と B が少なくとも1つの共通点を持つ場合に TRUE を返します。これは最も一般的で広く使用されている空間クエリです。</p></td>
     <td><p>検索エリア (A) は店舗の場所 (B) のいずれかと交差していますか？</p></td>
   </tr>
   <tr>
     <td><p><code>ST_OVERLAPS(A, B)</code> / <code>st_overlaps(A, B)</code></p></td>
     <td><p>ジオメトリ A と B が同じ次元であり、部分的に重なり、どちらも他方を完全に含まない場合に TRUE を返します。</p></td>
     <td><p>2つの土地 (A と B) は重なっていますか？</p></td>
   </tr>
   <tr>
     <td><p><code>ST_TOUCHES(A, B)</code> / <code>st_touches(A, B)</code></p></td>
     <td><p>ジオメトリ A と B が共通の境界を共有するが、それらの内部が交差しない場合に TRUE を返します。</p></td>
     <td><p>2つの隣接するプロパティ (A と B) は境界を共有していますか？</p></td>
   </tr>
   <tr>
     <td><p><code>ST_WITHIN(A, B)</code> / <code>st_within(A, B)</code></p></td>
     <td><p>ジオメトリ A がジオメトリ B 内に完全に含まれ、それらの内部が少なくとも1つの共通点を持つ場合に TRUE を返します。これは <code>ST_Contains(B, A)</code> の逆です。</p></td>
     <td><p>特定の関心点 (A) は定義された検索半径 (B) 内にありますか？</p></td>
   </tr>
   <tr>
     <td><p><code>ST_DWITHIN(A, B, distance)</code> / <code>st_dwithin(A, B, distance)</code></p></td>
     <td><p>ジオメトリ A とジオメトリ B の間の距離が指定された距離以下である場合に TRUE を返します。</p><p><strong>注</strong>: ジオメトリ B は現在、点のみをサポートしています。距離単位はメートルです。</p></td>
     <td><p>特定の点 (B) から 5000 メートル以内にあるすべての点を見つけます。</p></td>
   </tr>
</table>

## ST_EQUALS / st_equals{#stequals-stequals}

`ST_EQUALS` 演算子は、2つのジオメトリが空間的に同一である場合、つまり同じ点の集合と次元を持つ場合に TRUE を返します。これは、2つの格納されたジオメトリオブジェクトがまったく同じ場所と形状を表しているかどうかを確認するのに役立ちます。

**例**

格納されたジオメトリ (点やポリゴンなど) がターゲットジオメトリとまったく同じであるかどうかを確認したいとします。たとえば、格納された点を特定の関心点と比較できます。

```python
# The filter expression to check if a geometry matches a specific point
filter = "ST_EQUALS(geo_field, 'POINT(10 20)')"
```

## ST_CONTAINS / st_contains\{#stcontains-stcontains}

`ST_CONTAINS` 演算子は、最初のジオメトリが2番目のジオメトリを完全に含んでいる場合にTRUEを返します。これは、ポリゴン内の点や、より大きなポリゴン内の小さなポリゴンを見つけるのに役立ちます。

**例**

都市の地区のcollectionがあり、特定の地区の境界内にあるレストランなどの特定の関心地点を見つけたいとします。

```python
# The filter expression to find geometries completely within a specific polygon.
filter = "ST_CONTAINS(geo_field, 'POLYGON ((0 0, 10 0, 10 10, 0 10, 0 0))')"
```

## ST_CROSSES / st_crosses\{#stcrosses-stcrosses}

`ST_CROSSES` 演算子は、2つのジオメトリの交差が元のジオメトリよりも低い次元のジオメトリを形成する場合に `TRUE` を返します。これは通常、線がポリゴンまたは別の線を横切る場合に適用されます。

**例**

特定の境界線（別の線文字列）を横切る、または保護区域（ポリゴン）に入るすべてのハイキングコース（線文字列）を見つけたいとします。

```python
# The filter expression to find geometries that cross a line string.
filter = "ST_CROSSES(geo_field, 'LINESTRING(5 0, 5 10)')"
```

## ST_INTERSECTS / st_intersects\{#stintersects-stintersects}

`ST_INTERSECTS` 演算子は、2つのジオメトリが境界または内部のいずれかの点を共有する場合に `TRUE` を返します。これは、あらゆる形式の空間的な重なりを検出するための汎用演算子です。

**例**

道路のcollectionがあり、提案された新しい道路を表す特定のラインストリングと交差または接触するすべての道路を見つけたい場合、`ST_INTERSECTS` を使用できます。

```python
# The filter expression to find geometries that intersect with a specific line string.
filter = "ST_INTERSECTS(geo_field, 'LINESTRING (1 1, 2 2)')"
```

## ST_OVERLAPS / st_overlaps\{#stoverlaps-stoverlaps}

`ST_OVERLAPS` 演算子は、同じ次元の2つのジオメトリが部分的に交差し、その交差自体が元のジオメトリと同じ次元でありながら、どちらのジオメトリとも等しくない場合に `TRUE` を返します。

**例**

重複する販売地域がいくつかあり、新しく提案された販売ゾーンと部分的に重複するすべての地域を見つけたいとします。

```python
# The filter expression to find geometries that partially overlap with a polygon.
filter = "ST_OVERLAPS(geo_field, 'POLYGON((0 0, 0 10, 10 10, 10 0, 0 0))')"
```

## ST_TOUCHES / st_touches\{#sttouches-sttouches}

`ST_TOUCHES` オペレーターは、2つのジオメトリの境界が接しているが、内部が交差していない場合に `TRUE` を返します。これは隣接関係を検出するのに役立ちます。

**例**

不動産区画の地図があり、公共公園と直接隣接しており、重複がないすべての区画を見つけたい場合。

```python
# The filter expression to find geometries that only touch a line string at their boundaries.
filter = "ST_TOUCHES(geo_field, 'LINESTRING(0 0, 1 1)')"
```

## ST_WITHIN / st_within\{#stwithin-stwithin}

`ST_WITHIN` 演算子は、最初のジオメトリが2番目のジオメトリの内部または境界内に完全に含まれている場合に `TRUE` を返します。これは `ST_CONTAINS` の逆です。

**例**

指定されたより大きな公園エリア内に完全に位置するすべての小さな住宅地を見つけたいとします。

```python
# The filter expression to find geometries that are completely within a larger polygon.
filter = "ST_WITHIN(geo_field, 'POLYGON((110 38, 115 38, 115 42, 110 42, 110 38))')"
```

`GEOMETRY` フィールドの使用方法の詳細については、[Geometry Field](./use-geometry-field) を参照してください。

## ST_DWITHIN / st_dwithin\{#stdwithin-stdwithin}

`ST_DWITHIN` 演算子は、ジオメトリ A とジオメトリ B の間の距離が指定された値 (メートル単位) 以下である場合に `TRUE` を返します。現在、ジオメトリ B は点である必要があります。

**例**

店舗の場所のコレクションがあり、特定の顧客の場所から 5,000 メートル以内にあるすべての店舗を見つけたいとします。

```python
# Find all stores within 5000 meters of the point (120 30)
filter = "ST_DWITHIN(geo_field, 'POINT(120 30)', 5000)"
```
