---
title: "適切なクラスタータイプの選択 | BYOC"
slug: /cu-types-explained
sidebar_label: "クラスタータイプ"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud でクラスターを作成する際、適切なコンピュートユニット (CU) を選択することは重要なステップです。CU はデータの並列処理に使用されるコンピューティングリソースの基本単位であり、異なるクラスタータイプは CPU、メモリ、ストレージのさまざまな組み合わせで構成されています。 | BYOC"
type: origin
token: UgqvwKh2QiKE1kkYNLJcaHt0nkg
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - cu
  - 選択

---

import Admonition from '@theme/Admonition';


# 適切なクラスタータイプの選択

Zilliz Cloud でクラスターを作成する際、適切なコンピュートユニット (CU) を選択することは重要なステップです。CU はデータの並列処理に使用されるコンピューティングリソースの基本単位であり、異なるクラスタータイプは CPU、メモリ、ストレージのさまざまな組み合わせで構成されています。

## クラスタータイプの理解\{#understand-cluster-types}

Zilliz Cloud では、**パフォーマンス最適化済み, 容量最適化済み**、および **Tiered-storage** のクラスタータイプを提供しています。

以下の表は、3 つのクラスタータイプをさまざまな側面から簡単に比較したものです。クラスタータイプ間の容量とパフォーマンスの詳細な比較については、[最適なクラスタータイプの選択](./cu-types-explained#select-an-optimal-cluster-type) に進んでください。

<table>
   <tr>
     <th><p>クラスタータイプ</p></th>
     <th><p>Search QPS</p></th>
     <th><p>Search Latency</p></th>
     <th><p>Per Query CU容量</p></th>
     <th><p>Cost per Million Vectors</p></th>
   </tr>
   <tr>
     <td><p><strong>パフォーマンス最適化済み</strong></p></td>
     <td><p>500~1500</p></td>
     <td><p>sub-10 ms</p></td>
     <td><p>1.5 million 768-dim vectors</p></td>
     <td><p>from &#36;65/mo.</p></td>
   </tr>
   <tr>
     <td><p><strong>容量最適化済み</strong></p></td>
     <td><p>100~300</p></td>
     <td><p>tens-ms</p></td>
     <td><p>5 million 768-dim vectors</p></td>
     <td><p>from &#36;20/mo.</p></td>
   </tr>
   <tr>
     <td><p><strong>Tiered-storage</strong></p></td>
     <td><p>5~20</p></td>
     <td><p>hundreds-ms</p></td>
     <td><p>20 million 768-dim vectors</p></td>
     <td><p>from &#36;7/mo.</p></td>
   </tr>
</table>

### パフォーマンス最適化済み クラスター\{#performance-optimized-cluster}

- 低レイテンシーと高スループットを重視するシナリオ向けに設計されています。

- 生成 AI、推薦システム、チャットボットなどのリアルタイムアプリケーションに最適です。

### 容量最適化済み クラスター\{#capacity-optimized-cluster}

- 大規模なデータセットの処理のために作られており、検索パフォーマンスは抑えられているものの、パフォーマンス最適化済み クラスターの 5 倍のデータ容量を誇ります。

- 大規模な非構造化データ検索、著作権検出、本人確認などに最適です。

## 最適なクラスタータイプの選択\{#select-an-optimal-cluster-type}

クラスタータイプを選択する際は、データ量、パフォーマンスの期待値、予算を考慮してください。ベクトル数と次元数の両方におけるベクトルデータの規模は、クラスターのリソース配分を決定する上で極めて重要な役割を果たします。

### 容量の評価\{#assess-capacity}

クラスターが収容できるエンティティ数は、クラスターのクエリ CU 容量に依存します。

以下の参照表は、ベクトル次元と総ベクトル数を考慮し、1 クエリ CU を持つ パフォーマンス最適化済み および 容量最適化済み クラスターの容量を示しています。データ量に必要なクエリ CU 数の見積もりについては、[計算ツール](https://zilliz.com/pricing#calculator) をご利用ください。

<table>
   <tr>
     <th><p>Vector Dimensions</p></th>
     <th><p>パフォーマンス最適化済み (Max. Vectors per query CU)</p></th>
     <th><p>容量最適化済み (Max. Vectors per query CU)</p></th>
     <th><p>Tiered-storage (Max. Vectors per query CU)</p></th>
   </tr>
   <tr>
     <td><p>128</p></td>
     <td><p>7.5 million</p></td>
     <td><p>25 million</p></td>
     <td><p>100 million</p></td>
   </tr>
   <tr>
     <td><p>256</p></td>
     <td><p>4.5 million</p></td>
     <td><p>15 million</p></td>
     <td><p>60 million</p></td>
   </tr>
   <tr>
     <td><p>512</p></td>
     <td><p>2.25 million</p></td>
     <td><p>7.5 million</p></td>
     <td><p>30 million</p></td>
   </tr>
   <tr>
     <td><p>768</p></td>
     <td><p>1.5 million</p></td>
     <td><p>5 million</p></td>
     <td><p>20 million</p></td>
   </tr>
   <tr>
     <td><p>1024</p></td>
     <td><p>1.125 million</p></td>
     <td><p>3.75 million</p></td>
     <td><p>15 million</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>上記の指標は、主キーとベクトルのみを考慮したテストに基づいています。データセットに追加のスカラーフィールド（例：id、ラベル、キーワード）がある場合、実際の容量は異なる可能性があります。正確な評価のためには、独自にテストを行うことをお勧めします。</p>

</Admonition>

### パフォーマンスの評価\{#evaluate-performance}

レイテンシーや 1 秒あたりのクエリ数 (QPS) などのパフォーマンス指標は重要です。

パフォーマンス最適化済み クラスターは、特に 10 から 250 の範囲の標準的な `top-k` 値において、レイテンシーとスループットの面で 容量最適化済み クラスターを明確に上回ります。

以下の表は、パフォーマンス最適化済み クラスターと 容量最適化済み クラスターが QPS においてどのように機能するかを示すテスト結果です。

<table>
   <tr>
     <th><p>top_k</p></th>
     <th><p>QPS for パフォーマンス最適化済み cluster (768-dim 1M vectors)</p></th>
     <th><p>QPS for 容量最適化済み cluster (768-dim 5M vectors)</p></th>
   </tr>
   <tr>
     <td><p>10</p></td>
     <td><p>520</p></td>
     <td><p>100</p></td>
   </tr>
   <tr>
     <td><p>100</p></td>
     <td><p>440</p></td>
     <td><p>80</p></td>
   </tr>
   <tr>
     <td><p>250</p></td>
     <td><p>270</p></td>
     <td><p>60</p></td>
   </tr>
   <tr>
     <td><p>1000</p></td>
     <td><p>150</p></td>
     <td><p>40</p></td>
   </tr>
</table>

以下の表は、各クラスタータイプがレイテンシーにおいてどのように機能するかを示すテスト結果です。

<table>
   <tr>
     <th><p>top_k</p></th>
     <th><p>Latency of パフォーマンス最適化済み cluster (768-dim 1M vectors)</p></th>
     <th><p>Latency of 容量最適化済み cluster (768-dim 5M vectors)</p></th>
   </tr>
   <tr>
     <td><p>10</p></td>
     <td><p>&lt; 10 ms</p></td>
     <td><p>&lt; 50 ms</p></td>
   </tr>
   <tr>
     <td><p>100</p></td>
     <td><p>&lt; 10 ms</p></td>
     <td><p>&lt; 50 ms</p></td>
   </tr>
   <tr>
     <td><p>250</p></td>
     <td><p>&lt; 10 ms</p></td>
     <td><p>&lt; 50 ms</p></td>
   </tr>
   <tr>
     <td><p>1000</p></td>
     <td><p>10 - 20 ms</p></td>
     <td><p>50 - 100 ms</p></td>
   </tr>
</table>

## シナリオの内訳\{#scenario-breakdown}

800 万枚の画像ライブラリを持つ画像推薦アプリケーションを構築していると仮定します。ライブラリ内の各画像は、768 次元の埋め込みベクトルで表現されています。あなたの目標は、1,000 QPS の推薦リクエストを迅速に処理し、30 ミリ秒未満で上位 100 件の画像推薦を提供することです。

この要件に適したクラスタータイプとクエリ CU を選択するには、以下の手順に従ってください。

1. **レイテンシーの評価**: 30 ミリ秒のレイテンシー要件を満たすのは、パフォーマンス最適化済み クラスターのみです。

1. **容量の評価**: 1 クエリ CU を持つ単一の パフォーマンス最適化済み クラスターは、150 万個の 768 次元ベクトルを収容できます。800 万個すべてのベクトルを保存するには、少なくとも 6 つのクエリ CU が必要です。

1. **スループットの確認**: `top-k` 設定を 100 にすると、パフォーマンス最適化済み クラスターは 440 QPS を達成できます。一貫して 1,000 QPS を維持するには、レプリカ数を 3 倍にする必要があります。

結論として、このシナリオでは パフォーマンス最適化済み クラスターが最良の選択肢です。6 つのクエリ CU で構成される各レプリカを 3 つ持つ構成が、完璧に機能するはずです。

