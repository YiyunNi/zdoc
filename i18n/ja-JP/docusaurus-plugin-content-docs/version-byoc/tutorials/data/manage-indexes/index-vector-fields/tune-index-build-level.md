---
title: "インデックス構築レベルの調整 | BYOC"
slug: /tune-index-build-level
sidebar_key: tune-index-build-level
sidebar_label: "構築レベルを調整"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、`buildlevel` というパラメータを導入しており、ユーザーは対象コレクションのストレージ容量と検索再現率のバランスを取ることができます。あまり使用されないコレクションや、より多くのストレージ容量が必要なコレクションでは、わずかな再現率の低下を犠牲にして、ストレージ容量を大幅に増やすことができ、その逆も可能です。このガイドでは、利用可能なオプションと、それらを使用してコレクションのインデックスを構築する方法について説明します。 | BYOC"
type: origin
token: WQvUw9c9lifskGkgz0fcmUWvnFb
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - ベクトルフィールド
  - index
  - インデックス構築レベル

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# インデックス構築レベルの調整

Zilliz Cloud では、`build_level` というパラメータが導入されており、ユーザーは対象コレクションのストレージ容量と検索再現率のバランスを取ることができます。あまり使用されないコレクションや、より多くのストレージ容量が必要なコレクションでは、わずかな再現率の低下を犠牲にして、ストレージ容量を大幅に増加させることができ、その逆も可能です。このガイドでは、利用可能なオプションと、それらを使用してコレクションのインデックスを構築する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

この機能は現在 **パブリックレビュー** 中であり、以下の条件を満たす専用クラスターにのみ適用されます。

- クラスターが **パフォーマンス最適化済み**、**容量最適化済み**、および **階層型ストレージ** タイプであること、および

- クラスターが **Milvus v2.6.x** と互換性があること。

この機能をテストするためにクラスターをアップグレードできます。さらに説明が必要な事項がある場合は、お問い合わせください。

</Admonition>

## 概要\{#overview}

Zilliz Cloud の異なるタイプのクラスターは、公称ストレージ容量に大きな差があります。パフォーマンス最適化済みクラスター内のコレクションがあまり使用されない場合や、追加のストレージが必要な場合は、コレクション内の **FLOAT_VECTOR**、**FLOAT16_VECTOR**、および **BFLOAT16_VECTOR** などの浮動小数点ベクトル型のベクトルフィールドにインデックスを作成する際に、`build_level` を容量優先オプションに設定することを検討してください。これにより再現率がわずかに低下する可能性がありますが、ストレージ容量を **30%** から **40%** 向上させることができます。

`build_level` パラメータには 3 つのオプションがあります: **精度優先** (2)、**バランス** (1)、および **容量優先** (0)。

- **バランス** (1)

    これはデフォルトのオプションで、ほとんどのシナリオで検索精度とストレージ容量のバランスを取ります。

- **精度優先** (2)

    このオプションは検索パフォーマンスと高い再現率を優先し、高い精度が必要なコレクションに適しています。

- **容量優先** (0)

    このオプションはストレージ容量を重視し、追加のストレージ容量が必要なコレクションに最適です。

内部ベンチマークテストで示されているように、デフォルトのオプションはクラスターのタイプに関わらず、すべてのクラスターのストレージ容量を増加させます。パフォーマンス最適化済みクラスターの場合、デフォルトのオプションはストレージ容量を **60%** 向上させ、パフォーマンス（QPS）を **17%** 改善することさえあります。

### パフォーマンス最適化済みクラスター\{#performance-optimized-clusters}

次の表は、`build_level` の導入前後のパフォーマンス最適化済みクラスターの容量、QPS、および再現率を比較したものです。デフォルトのオプションは再現率を維持し、QPS とストレージ容量の両方を増加させることがわかります。

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
     <td><p>&#126; 2,850</p></td>
     <td><p>90% - 95%</p></td>
   </tr>
   <tr>
     <td><p>バランス (1)</p></td>
     <td><p>1.5 million 768-dim vectors</p></td>
     <td><p>&#126; 3,500</p></td>
     <td><p>91% - 97%</p></td>
   </tr>
   <tr>
     <td><p>Precison-first (2)</p></td>
     <td><p>1 million 768-dim vectors</p></td>
     <td><p>&#126; 3,000</p></td>
     <td><p>92% - 98% (↑)</p></td>
   </tr>
</table>

### 容量最適化済みクラスター\{#capacity-optimized-clusters}

次の表は、`build_level` の導入前後の容量最適化済みクラスターの容量、QPS、および再現率を比較したものです。デフォルトのオプションは再現率を維持し、QPS とストレージ容量の両方を増加させることがわかります。

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
     <td><p>&#126; 300</p></td>
     <td><p>89% - 97%</p></td>
   </tr>
   <tr>
     <td><p>バランス (1)</p></td>
     <td><p>5 million 768-dim vectors</p></td>
     <td><p>&#126; 350</p></td>
     <td><p>93% - 98%</p></td>
   </tr>
   <tr>
     <td><p>精度優先 (2)</p></td>
     <td><p>3 million 768-dim vectors</p></td>
     <td><p>&#126; 345</p></td>
     <td><p>94% - 98%</p></td>
   </tr>
</table>

### 階層型ストレージクラスター\{#tiered-storage-clusters}

データの大部分が S3 に保存されるため、メモリはもはや主要なボトルネックではありません。その結果、クラスターの最大容量は比較的安定したままとなります。最も大きな影響は **再現率** に及び、異なる量子化レベルによるパフォーマンスのわずかな変動があります。

- **バランス (1):** これは現在の状態を表し、パフォーマンスは既存のベンチマークと一致したままです。

- **精度優先 (2):** Build Level を上げると、**再現率が約 3%–4% 改善**されますが、QPS がわずかに低下し、レイテンシがわずかに増加します。

- **容量優先 (0):** 利点が最小限であるため、この構成は稀であると予想されます。容量は変わりませんが、QPS とレイテンシのわずかな改善と引き換えに、**再現率が 3%–4% 低下**します。

## 制限\{#limits}

操作を開始する前に、以下の制限を確認してください。

- この設定を許可するのは、パフォーマンス最適化済みまたは容量最適化済みタイプの Milvus 2.6.x 互換の専用クラスターのみです。

- コレクションにインデックスを作成する際に、**FLOAT_VECTOR**、**FLOAT16_VECTOR**、および **BFLOAT16_VECTOR** を含む浮動小数点ベクトル型のベクトルフィールドにこのパラメータを設定する必要があります。

- 一度設定すると、このパラメータは変更できません。ただし、必要に応じてインデックスを削除し、希望の設定で別のインデックスを作成することができます。

- マイグレーションまたはバックアップにより、`build_level` の設定は削除されます。マイグレーションまたは復元が完了した後、必要に応じてインデックスを削除し、希望の設定で別のインデックスを作成することができます。

## 手順\{#procedure}

ほとんどの場合、`build_level` を設定する必要はありません。デフォルトの設定により、検索パフォーマンス、精度、およびストレージ容量のバランスを取ることができます。

Zilliz Cloud では、`build_level` をプログラムで設定するか、Zilliz Cloud コンソールで設定することができます。

### build_level をプログラムで設定する\{#set-buildlevel-programmatically}

`build_level` を設定するには、**FLOAT_VECTOR**、**FLOAT16_VECTOR**、および **BFLOAT16_VECTOR** などの浮動小数点型の [ベクトルフィールドにインデックスを作成する](./index-vector-fields#index-a-collection) 際に行う必要があります。

次の例では、[準備](./index-vector-fields#preparations) の手順を完了していることを前提としています。`build_level` を `1` に設定すると、**バランス** オプションが適用されることを示します。

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

