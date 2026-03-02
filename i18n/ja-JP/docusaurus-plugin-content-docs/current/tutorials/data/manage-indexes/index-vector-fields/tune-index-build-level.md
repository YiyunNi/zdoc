---
title: "インデックスビルドレベルの調整 | Cloud"
slug: /tune-index-build-level
sidebar_label: "インデックスビルドレベルの調整"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、`buildlevel`というパラメータを導入しており、ユーザーはターゲットcollectionのストレージ容量と検索再現率のバランスを取ることができます。使用頻度の低いcollectionや、より多くのストレージスペースを必要とするcollectionの場合、わずかな再現率の低下と引き換えにストレージ容量を大幅に増やすことができます。その逆も可能です。このガイドでは、利用可能なオプションと、それらを使用してcollectionのインデックスを構築する方法について説明します。 | Cloud"
type: origin
token: WQvUw9c9lifskGkgz0fcmUWvnFb
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - ベクトルフィールド
  - インデックス
  - インデックスビルドレベル
  - ベクトルデータベースとは
  - ベクトルデータベース比較
  - Faiss
  - ビデオ検索

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# インデックスビルドレベルの調整

Zilliz Cloudは、`build_level`というパラメータを導入しました。これにより、ユーザーはターゲットコレクションのストレージ容量と検索再現率のバランスを取ることができます。使用頻度が低い、またはより多くのストレージスペースを必要とするコレクションの場合、わずかな再現率の低下を犠牲にして、ストレージ容量を大幅に増やすことができます。このガイドでは、利用可能なオプションと、それらを使用してコレクションのインデックスを構築する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は現在<strong>パブリックレビュー</strong>中で、専用クラスターにのみ適用されます。ただし、以下の条件を満たす必要があります。</p>
<ul>
<li><p>クラスターが<strong>パフォーマンス最適化型</strong>または<strong>容量最適化型</strong>であること。</p></li>
<li><p>クラスターが<strong>Milvus v2.6.x</strong>と互換性があること。</p></li>
</ul>
<p>この機能をテストするためにクラスターをアップグレードし、さらに明確化が必要な場合は<a href="https://support.zilliz.com/hc/en-us/requests/new">お問い合わせください</a>。</p>

</Admonition>

## 概要{#overview}

Zilliz Cloudの異なるタイプのクラスターは、公称ストレージ容量が大きく異なります。パフォーマンス最適化型クラスター内のコレクションが使用頻度が低い、または追加のストレージを必要とする場合、コレクション内の**FLOAT_VECTOR**、**FLOAT16_VECTOR**、**BFLOAT16_VECTOR**などの浮動小数点ベクトル型のベクトルフィールドのインデックスを作成する際に、`build_level`を容量優先オプションに設定することを検討してください。これにより、再現率はわずかに低下する可能性がありますが、ストレージ容量を**30%**から**40%**増加させることができます。

`build_level`パラメータには、**Precision-first** (2)、**Balanced** (1)、**Capacity-first** (0)の3つのオプションがあります。

- **Balanced** (1)

    これはデフォルトのオプションで、ほとんどのシナリオで検索精度とストレージ容量のバランスを取ります。

- **Precision-first** (2)

    このオプションは、検索パフォーマンスと高い再現率を優先し、高い精度を必要とするコレクションに適しています。

- **Capacity-first** (0)

    このオプションはストレージ容量を重視し、追加のストレージスペースを必要とするコレクションに最適です。

内部ベンチマークテストで示されているように、デフォルトのオプションは、タイプに関係なくすべてのクラスターのストレージ容量を増加させます。パフォーマンス最適化型クラスターの場合、デフォルトのオプションはストレージ容量を**60%**増加させ、パフォーマンス（QPS）を**17%**向上させます。

### パフォーマンス最適化型クラスター{#performance-optimized-clusters}

以下の表は、`build_level`導入前後のパフォーマンス最適化型クラスターの容量、QPS、再現率を比較したものです。デフォルトのオプションが再現率を維持し、QPSとストレージ容量の両方を増加させていることがわかります。

<table>
   <tr>
     <th><p>ビルドレベルオプション</p></th>
     <th><p>容量</p></th>
     <th><p>QPS</p></th>
     <th><p>再現率</p></th>
   </tr>
   <tr>
     <td><p>容量優先 (0)</p></td>
     <td><p>210万 768次元ベクトル</p></td>
     <td><p>~ 2,850</p></td>
     <td><p>90% - 95%</p></td>
   </tr>
   <tr>
     <td><p>バランス (1)</p></td>
     <td><p>150万 768次元ベクトル</p></td>
     <td><p>~ 3,500</p></td>
     <td><p>91% - 97%</p></td>
   </tr>
   <tr>
     <td><p>精度優先 (2)</p></td>
     <td><p>100万 768次元ベクトル</p></td>
     <td><p>~ 3,000</p></td>
     <td><p>92% - 98% (↑)</p></td>
   </tr>
</table>

### 容量最適化型クラスター{#capacity-optimized-clusters}

以下の表は、`build_level`導入前後の容量最適化型クラスターの容量、QPS、再現率を比較したものです。デフォルトのオプションが再現率を維持し、QPSとストレージ容量の両方を増加させていることがわかります。

<table>
   <tr>
     <th><p>ビルドレベルオプション</p></th>
     <th><p>容量</p></th>
     <th><p>QPS</p></th>
     <th><p>再現率</p></th>
   </tr>
   <tr>
     <td><p>容量優先 (0)</p></td>
     <td><p>700万 768次元ベクトル</p></td>
     <td><p>~ 300</p></td>
     <td><p>89% - 97%</p></td>
   </tr>
   <tr>
     <td><p>バランス (1)</p></td>
     <td><p>500万 768次元ベクトル</p></td>
     <td><p>~ 350</p></td>
     <td><p>93% - 98%</p></td>
   </tr>
   <tr>
     <td><p>精度優先 (2)</p></td>
     <td><p>300万 768次元ベクトル</p></td>
     <td><p>~ 345</p></td>
     <td><p>94% - 98%</p></td>
   </tr>
</table>

## 制限事項{#limits}

操作を開始する前に、以下の制限事項を理解しておいてください。

- この設定は、Milvus 2.6.x互換のパフォーマンス最適化型または容量最適化型の専用クラスターでのみ許可されます。

- このパラメータは、コレクションのインデックス作成時に、**FLOAT_VECTOR**、**FLOAT16_VECTOR**、**BFLOAT16_VECTOR**を含む浮動小数点型のベクトルフィールドに設定する必要があります。

- 一度設定すると、このパラメータは変更できません。ただし、必要に応じてインデックスを削除し、目的の設定で別のインデックスを作成することはできます。

- 移行またはバックアップを行うと、`build_level`の設定は削除されます。移行または復元が完了した後、必要に応じてインデックスを削除し、目的の設定で別のインデックスを作成することができます。

## 手順{#procedure}

ほとんどの場合、`build_level`を設定する必要はありません。デフォルト設定は、検索パフォーマンス、精度、ストレージ容量のバランスを取るのに役立ちます。

Zilliz Cloudでは、プログラムで、またはZilliz Cloudコンソールで`build_level`を設定できます。

### プログラムでbuild_levelを設定する{#set-buildlevel-programmatically}

`build_level`を設定するには、**FLOAT_VECTOR**、**FLOAT16_VECTOR**、**BFLOAT16_VECTOR**などの浮動小数点型の[ベクトルフィールドにインデックスを作成する](./index-vector-fields#index-a-collection)際に設定する必要があります。

以下の例では、[準備](./index-vector-fields#preparations)の手順が完了していることを前提としています。`build_level`を`1`に設定すると、**Balanced**オプションが適用されることを示します。

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

### Zilliz Cloud コンソールで build_level を設定する{#set-buildlevel-on-the-zilliz-cloud-console}

`build_level` をプログラムで設定する代わりに、Zilliz Cloud コンソールでコレクションを作成する際に設定することもできます。

<Supademo id="cmfkua8whed1839ozdau9fzqp?utm_source=link" title="" />

1. ターゲットクラスターのコレクションタブで、**+ Create Collection** をクリックします。

1. **Create Collection** ページで、schema を設定します。

    ベクトルフィールドのデータ型が、**FLOAT_VECTOR**、**FLOAT16_VECTOR**、**BFLOAT16_VECTOR** のいずれかの有効なオプションであることを確認してください。

1. **Create Index** セクションで、**Edit Index** をクリックします。

1. 表示された Edit Vector Index フィールドで、**Metric Type** と **Index Build Level** を設定できます。

