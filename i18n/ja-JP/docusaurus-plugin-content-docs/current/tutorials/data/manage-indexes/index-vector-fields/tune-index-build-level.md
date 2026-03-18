---
title: "インデックス構築レベルの調整 | Cloud"
slug: /tune-index-build-level
sidebar_label: "構築レベルの調整"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、対象コレクションのストレージ容量と検索再現率のバランスを調整できる `buildlevel` というパラメータを導入しています。使用頻度が低いコレクションや、より多くのストレージスペースが必要なコレクションでは、わずかな再現率の低下と引き換えにストレージ容量を大幅に増やすことができ、その逆も可能です。このガイドでは、利用可能なオプションと、コレクションのインデックス構築にそれらを使用する方法について説明します。 | Cloud"
type: origin
token: WQvUw9c9lifskGkgz0fcmUWvnFb
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - ベクトルフィールド
  - インデックス
  - インデックス構築レベル

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# インデックスビルドレベルの調整

Zilliz Cloud では、`build_level` というパラメータを導入しており、ユーザーはこのパラメータを使用して、対象コレクションのストレージ容量と検索リコール率のバランスを調整できます。使用頻度が低いコレクションや、より多くのストレージ容量が必要なコレクションの場合、わずかなリコール率の低下を許容することで、大幅なストレージ容量の増加を得ることができます。逆もまた同様です。本ガイドでは、利用可能なオプションと、コレクションのインデックス作成におけるその使用方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は現在 <strong>PUBLIC REVIEW</strong> 段階にあり、以下の条件を満たす<strong>専用クラスター</strong>でのみ利用可能です。</p>
<ul>
<li><p>クラスターのタイプが <strong>パフォーマンス最適化済み</strong> または <strong>容量最適化済み</strong> であること、および</p></li>
<li><p>クラスターが <strong>Milvus v2.6.x</strong> と互換性があること。</p></li>
</ul>
<p>この機能を試すにはクラスターをアップグレードし、不明点がある場合は<a href="https://support.zilliz.com/hc/en-us/requests/new">お問い合わせください</a>。</p>

</Admonition>

## 概要\{#overview}

Zilliz Cloud のクラスタータイプによって、利用可能なストレージ容量には大きな違いがあります。パフォーマンス最適化済みクラスター内のコレクションが使用頻度が低かったり、追加のストレージを必要とする場合、コレクション内の **FLOAT_VECTOR**、**FLOAT16_VECTOR**、**BFLOAT16_VECTOR** などの浮動小数点ベクトル型のベクトルフィールドに対してインデックスを作成する際に、`build_level` を **容量優先**（容量優先）に設定することを検討してください。これによりリコール率が若干低下する可能性がありますが、ストレージ容量を **30%** ～ **40%** 向上させることができます。

`build_level` パラメータには、次の3つのオプションがあります：**精度優先**（精度優先）(2)、**バランス**（バランス）(1)、**容量優先**（容量優先）(0)。

- **バランス**（バランス）(1)

    これはデフォルトのオプションで、ほとんどのシナリオにおいて検索精度とストレージ容量のバランスを取ります。

- **精度優先**（精度優先）(2)

    このオプションは検索パフォーマンスと高いリコール率を優先し、高精度が求められるコレクションに適しています。

- **容量優先**（容量優先）(0)

    このオプションはストレージ容量を重視し、追加のストレージスペースが必要なコレクションに最適です。

社内ベンチマークテストによると、デフォルトオプションはクラスタータイプに関係なく、すべてのクラスターのストレージ容量を向上させます。特にパフォーマンス最適化済みクラスターでは、デフォルトオプションによりストレージ容量が **60%** 増加し、パフォーマンス（QPS）も **17%** 向上しました。

### パフォーマンス最適化済みクラスター\{#performance-optimized-clusters}

以下の表は、`build_level` 導入前後におけるパフォーマンス最適化済みクラスターの容量、QPS、リコール率を比較したものです。デフォルトオプションではリコール率を維持しつつ、QPS とストレージ容量の両方が向上していることがわかります。

<table>
   <tr>
     <th><p>Build Level Option</p></th>
     <th><p>Capacity</p></th>
     <th><p>QPS</p></th>
     <th><p>Recall</p></th>
   </tr>
   <tr>
     <td><p>容量優先 (0)</p></td>
     <td><p>2.1 million 768-dim vectors</p></td>
     <td><p>~ 2,850</p></td>
     <td><p>90% - 95%</p></td>
   </tr>
   <tr>
     <td><p>バランス (1)</p></td>
     <td><p>1.5 million 768-dim vectors</p></td>
     <td><p>~ 3,500</p></td>
     <td><p>91% - 97%</p></td>
   </tr>
   <tr>
     <td><p>Precison-first (2)</p></td>
     <td><p>1 million 768-dim vectors</p></td>
     <td><p>~ 3,000</p></td>
     <td><p>92% - 98% (↑)</p></td>
   </tr>
</table>

### 容量最適化済みクラスター\{#capacity-optimized-clusters}

以下の表は、`build_level` 導入前後における容量最適化済みクラスターの容量、QPS、リコール率を比較したものです。デフォルトオプションではリコール率を維持しつつ、QPS とストレージ容量の両方が向上していることがわかります。

<table>
   <tr>
     <th><p>Build Level Option</p></th>
     <th><p>Capacity</p></th>
     <th><p>QPS</p></th>
     <th><p>Recall</p></th>
   </tr>
   <tr>
     <td><p>容量優先 (0)</p></td>
     <td><p>7 million 768-dim vectors</p></td>
     <td><p>~ 300</p></td>
     <td><p>89% - 97%</p></td>
   </tr>
   <tr>
     <td><p>バランス (1)</p></td>
     <td><p>5 million 768-dim vectors</p></td>
     <td><p>~ 350</p></td>
     <td><p>93% - 98%</p></td>
   </tr>
   <tr>
     <td><p>精度優先 (2)</p></td>
     <td><p>3 million 768-dim vectors</p></td>
     <td><p>~ 345</p></td>
     <td><p>94% - 98%</p></td>
   </tr>
</table>

## 制限\{#limits}

操作を開始する前に、以下の制限事項を確認してください：

- Milvus 2.6.x と互換性のある、パフォーマンス最適化済みまたは容量最適化済みの専用クラスターでのみ、この設定が許可されます。

- コレクションのインデックス作成時に、**FLOAT_VECTOR**、**FLOAT16_VECTOR**、**BFLOAT16_VECTOR** などの浮動小数点ベクトル型のベクトルフィールドに対してのみ、このパラメータを設定できます。

- 一度設定すると、このパラメータは変更できません。ただし、必要に応じてインデックスを削除し、希望の設定で再度作成することは可能です。

- 移行またはバックアップを行うと、`build_level` の設定は削除されます。移行またはリストアが完了後、必要に応じてインデックスを削除し、希望の設定で再度作成できます。

## 手順\{#procedure}

ほとんどの場合、`build_level` を設定する必要はありません。デフォルト設定により、検索パフォーマンス、精度、ストレージ容量のバランスが自動的に取られます。

Zilliz Cloud では、`build_level` をプログラムで設定するか、Zilliz Cloud コンソールから設定することができます。

### プログラムによる build_level の設定\{#set-buildlevel-programmatically}

`build_level` を設定するには、**FLOAT_VECTOR**、**FLOAT16_VECTOR**、**BFLOAT16_VECTOR** などの浮動小数点ベクトル型の[ベクトルフィールドのインデックス作成時](./index-vector-fields#index-a-collection)に行う必要があります。

以下の例では、[準備手順](./index-vector-fields#preparations)をすでに完了していることを前提としています。`build_level` を `1` に設定すると、**バランス**（バランス）オプションが適用されます。

```python
# 4. Set up index
# 4.1. Set up the index parameters
index_params = MilvusClient.prepare_index_params()

# 4.2. Add an index on the vector field.
index_params.add_index(
    field_name="vector",
    metric_type="COSINE",
    index_type="AUTOINDEX",
    index_name="vector_index",
    # highlight-next-line
    build_level=1
)

# 4.4. Create an index file
client.create_index(
    collection_name="customized_setup",
    index_params=index_params
)

# 5. Describe index
res = client.list_indexes(
    collection_name="customized_setup"
)
```

### Zilliz Cloud コンソールで build_level を設定する\{#set-buildlevel-on-the-zilliz-cloud-console}

`build_level` をプログラムで設定する代わりに、コレクション作成時に Zilliz Cloud コンソール上で設定することもできます。

<Supademo id="cmfkua8whed1839ozdau9fzqp?utm_source=link" title=""  />

1. 対象クラスターの **Collection** タブで、**+ Create Collection** をクリックします。

1. **Create Collection** ページでスキーマを設定します。

    ベクトルフィールドのデータ型が、有効なオプション（**FLOAT_VECTOR**、**FLOAT16_VECTOR**、**BFLOAT16_VECTOR**）のいずれかであることを確認してください。

1. **Create Index** セクションで、**Edit Index** をクリックします。

1. 表示された **Edit Vector Index** フィールドで、**メトリックタイプ** と **Index Build Level** を設定できます。

