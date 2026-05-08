---
title: "BITMAP | BYOC"
slug: /bitmap-index-type
sidebar_key: bitmap-index-type
sidebar_label: "BITMAP"
beta: FALSE
notebook: FALSE
description: "ビットマップインデックスは、低カーディナリティのスカラーフィールドに対するクエリ性能を向上させるための効率的なインデックス手法です。カーディナリティとは、フィールド内の異なる値の数を指します。異なる要素の数が少ないフィールドは、低カーディナリティと見なされます。 | BYOC"
type: origin
token: SkJtwgkCDiGYeOkakIgcLT46nee
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - スカラーフィールド
  - bool
  - bitmap

---

import Admonition from '@theme/Admonition';


# BITMAP

ビットマップインデックスは、低カーディナリティのスカラーフィールドに対するクエリパフォーマンスを向上させるために設計された効率的なインデックス手法です。カーディナリティとは、フィールド内の異なる値の数を指します。異なる要素が少ないフィールドは、低カーディナリティと見なされます。

このインデックスタイプは、フィールド値をコンパクトなバイナリ形式で表現し、それに対して効率的なビット演算を実行することで、スカラークエリの取得時間を短縮するのに役立ちます。他のタイプのインデックスと比較して、ビットマップインデックスは通常、低カーディナリティのフィールドを扱う際に、より高い空間効率とより速いクエリ速度を持っています。

## 概要\{#overview}

**Bitmap** という用語は、**Bit** と **Map** の2つの単語を組み合わせたものです。ビットは、コンピュータ内の最小のデータ単位を表し、**0** または **1** の値しか持つことができません。マップは、この文脈では、0と1にどの値を割り当てるべきかに従ってデータを変換・整理するプロセスを指します。

ビットマップインデックスは、主に2つのコンポーネントで構成されています：ビットマップとキー。キーは、インデックス付きフィールド内の一意の値を表します。各一意の値に対して、対応するビットマップが存在します。これらのビットマップの長さは、コレクション内のレコード数と等しくなります。ビットマップ内の各ビットは、コレクション内のレコードに対応します。レコード内のインデックス付きフィールドの値がキーと一致する場合、対応するビットは **1** に設定されます。一致しない場合は **0** に設定されます。

**Category** フィールドと **Public** フィールドを持つドキュメントのコレクションを考えてみましょう。**Tech** カテゴリに属し、**Public** に公開されているドキュメントを取得したいとします。この場合、ビットマップインデックスのキーは **Tech** と **Public** になります。

![S5cHwsXsPhOLfQb3Tatc4jqAn9e](https://zdoc-images.s3.us-west-2.amazonaws.com/S5cHwsXsPhOLfQb3Tatc4jqAn9e.png)

図に示されているように、**Category** と **Public** のビットマップインデックスは以下の通りです：

- **Tech**: [1, 0, 1, 0, 0] — これは、1番目と3番目のドキュメントのみが **Tech** カテゴリに属していることを示しています。

- **Public**: [1, 0, 0, 1, 0] — これは、1番目と4番目のドキュメントのみが **Public** に公開されていることを示しています。

両方の条件に一致するドキュメントを見つけるために、これら2つのビットマップに対してビット単位のAND演算を実行します：

- **Tech** AND **Public**: [1, 0, 0, 0, 0]

結果のビットマップ [1, 0, 0, 0, 0] は、最初のドキュメント（**ID** **1**）のみが両方の条件を満たしていることを示しています。ビットマップインデックスと効率的なビット演算を使用することで、検索範囲を迅速に絞り込むことができ、データセット全体をスキャンする必要がなくなります。

## ビットマップインデックスの作成\{#create-a-bitmap-index}

Zilliz Cloud でビットマップインデックスを作成するには、`create_index()` メソッドを使用し、`index_type` パラメータを `"BITMAP"` に設定します。

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
)

index_params = client.create_index_params() # Prepare an empty IndexParams object, without having to specify any index parameters
index_params.add_index(
    field_name="category", # Name of the scalar field to be indexed
    index_type="BITMAP", # Type of index to be created
    index_name="category_bitmap_index" # Name of the index to be created
)

client.create_index(
    collection_name="my_collection", # Specify the collection name
    index_params=index_params
)
```

この例では、`my_collection` コレクションの `category` フィールドにビットマップインデックスを作成します。`add_index()` メソッドを使用して、フィールド名、インデックスタイプ、およびインデックス名を指定します。

ビットマップインデックスが作成されると、クエリ操作で `filter` パラメータを使用して、インデックス付きフィールドに基づくスカラー絞り込みを実行できます。これにより、ビットマップインデックスを使用して検索結果を効率的に絞り込むことができます。詳細については、[フィルタリングの解説](./filtering-overview) を参照してください。

## インデックスの削除\{#drop-an-index}

`drop_index()` メソッドを使用して、コレクションから既存のインデックスを削除します。

<Admonition type="info" icon="📘" title="Notes">

<p><strong>Milvus v2.6.x</strong> 互換のクラスタでは、スカラーインデックスが不要になったら、コレクションを解放する必要なく、直接削除できます。</p>

</Admonition>

```python
client.drop_index(
    collection_name="my_collection",   # Name of the collection
    index_name="category_bitmap_index" # Name of the index to drop
)
```

## 制限\{#limits}

- ビットマップインデックスは、主キーではないスカラーフィールドのみでサポートされます。

- フィールドのデータ型は、以下のいずれかでなければなりません：

    - `BOOL`、`INT8`、`INT16`、`INT32`、`INT64`、`VARCHAR`

    - `ARRAY`（要素は以下のいずれかでなければなりません：`BOOL`、`INT8`、`INT16`、`INT32`、`INT64`、`VARCHAR`）

- ビットマップインデックスは、以下のデータ型をサポートしません：

    - `FLOAT`、`DOUBLE`: 浮動小数点型は、ビットマップインデックスのバイナリ特性と互換性がありません。

    - `JSON`: JSON データ型は構造が複雑であり、ビットマップインデックスを使用して効率的に表現することはできません。

- ビットマップインデックスは、カーディナリティが高いフィールド（つまり、異なる値の数が非常に多いフィールド）には適していません。

    - 一般的なガイドラインとして、ビットマップインデックスはフィールドのカーディナリティが 500 未満の場合に最も効果的です。

    - カーディナリティがこの閾値を超えて増加すると、ビットマップインデックスのパフォーマンス上の利点は低下し、ストレージのオーバーヘッドが顕著になります。

    - 高カーディナリティのフィールドについては、特定のユースケースとクエリ要件に応じて、転置インデックスなどの代替インデックス手法の使用を検討してください。

