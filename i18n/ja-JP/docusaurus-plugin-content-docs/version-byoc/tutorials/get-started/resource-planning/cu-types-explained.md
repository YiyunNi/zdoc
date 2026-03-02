---
title: "適切なクラスタータイプの選択 | BYOC"
slug: /cu-types-explained
sidebar_label: "クラスタータイプ"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudでクラスターを作成する際、適切なCompute Unit (CU) を選択することは非常に重要です。CUは、データの並列処理に使用されるコンピューティングリソースの基本単位であり、異なるクラスタータイプはCPU、メモリ、ストレージのさまざまな組み合わせで構成されています。 | BYOC"
type: origin
token: UgqvwKh2QiKE1kkYNLJcaHt0nkg
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - cu
  - 選択
  - コンテキストウィンドウ
  - 自然言語検索
  - 類似性検索
  - マルチモーダルRAG

---

import Admonition from '@theme/Admonition';


# 適切なクラスタータイプの選択

Zilliz Cloudでクラスターを作成する際、適切なCompute Unit (CU) を選択することは非常に重要です。CUは、データの並列処理に使用されるコンピューティングリソースの基本単位であり、異なるクラスタータイプは、CPU、メモリ、ストレージのさまざまな組み合わせで構成されています。

## クラスタータイプを理解する{#understand-cluster-types}

Zilliz Cloudは、**Performance-optimized**、**Capacity-optimized**、**Tiered-storage**のクラスタータイプを提供しています。

以下の表は、3つのクラスタータイプをさまざまな側面で簡単に比較したものです。クラスタータイプ間の容量とパフォーマンスに関する詳細な比較については、[最適なクラスタータイプの選択](./cu-types-explained#select-an-optimal-cluster-type)に進んでください。

<table>
   <tr>
     <th><p>クラスタータイプ</p></th>
     <th><p>検索QPS</p></th>
     <th><p>検索レイテンシー</p></th>
     <th><p>クエリCUあたりの容量</p></th>
     <th><p>100万ベクトルあたりのコスト</p></th>
   </tr>
   <tr>
     <td><p><strong>Performance-optimized</strong></p></td>
     <td><p>500~1500</p></td>
     <td><p>10ミリ秒未満</p></td>
     <td><p>150万 768次元ベクトル</p></td>
     <td><p>月額&#36;65から</p></td>
   </tr>
   <tr>
     <td><p><strong>Capacity-optimized</strong></p></td>
     <td><p>100~300</p></td>
     <td><p>数十ミリ秒</p></td>
     <td><p>500万 768次元ベクトル</p></td>
     <td><p>月額&#36;20から</p></td>
   </tr>
   <tr>
     <td><p><strong>Tiered-storage</strong></p></td>
     <td><p>5~20</p></td>
     <td><p>数百ミリ秒</p></td>
     <td><p>2000万 768次元ベクトル</p></td>
     <td><p>月額&#36;7から</p></td>
   </tr>
</table>

### Performance-optimized クラスター{#performance-optimized-cluster}

- 低レイテンシーと高スループットを重視するシナリオ向けに調整されています。

- 生成AI、レコメンデーションシステム、チャットボットなどのリアルタイムアプリケーションに最適です。

### Capacity-optimized クラスター{#capacity-optimized-cluster}

- 大規模なデータセットを処理するために設計されており、Performance-optimized クラスターの5倍のデータ容量を誇りますが、検索パフォーマンスは控えめです。

- 大規模な非構造化データ検索、著作権検出、本人確認に最適です。

## 最適なクラスタータイプの選択{#select-an-optimal-cluster-type}

クラスタータイプを選択する際には、データ量、パフォーマンスの期待値、予算を考慮してください。ベクトルデータの規模（ベクトル数と次元の両方）は、クラスターのリソース割り当てを決定する上で重要な役割を果たします。

### 容量の評価{#assess-capacity}

クラスターが収容できるentityの数は、クラスターのクエリCU容量に依存します。

以下の参照表は、1つのクエリCUを持つPerformance-optimizedおよびCapacity-optimizedクラスターの容量を、ベクトル次元と総ベクトル数を考慮して示しています。データ量に必要なクエリCU数の見積もりについては、[当社の計算ツール](https://zilliz.com/pricing#calculator)をご利用ください。

<table>
   <tr>
     <th><p>ベクトル次元</p></th>
     <th><p>Performance-optimized (クエリCUあたりの最大ベクトル数)</p></th>
     <th><p>Capacity-optimized (クエリCUあたりの最大ベクトル数)</p></th>
     <th><p>Tiered-storage (クエリCUあたりの最大ベクトル数)</p></th>
   </tr>
   <tr>
     <td><p>128</p></td>
     <td><p>750万</p></td>
     <td><p>2500万</p></td>
     <td><p>1億</p></td>
   </tr>
   <tr>
     <td><p>256</p></td>
     <td><p>450万</p></td>
     <td><p>1500万</p></td>
     <td><p>6000万</p></td>
   </tr>
   <tr>
     <td><p>512</p></td>
     <td><p>225万</p></td>
     <td><p>750万</p></td>
     <td><p>3000万</p></td>
   </tr>
   <tr>
     <td><p>768</p></td>
     <td><p>150万</p></td>
     <td><p>500万</p></td>
     <td><p>2000万</p></td>
   </tr>
   <tr>
     <td><p>1024</p></td>
     <td><p>112.5万</p></td>
     <td><p>375万</p></td>
     <td><p>1500万</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>上記のメトリクスは、プライマリキーとベクトルのみを考慮したテストに基づいています。データセットに余分なスカラーフィールド（例：id、label、keywords）がある場合、実際の容量は異なる場合があります。正確な評価のためには、個人的なテストを実施することが賢明です。</p>

</Admonition>

### パフォーマンスの評価{#evaluate-performance}

パフォーマンスメトリクス、特にレイテンシーと1秒あたりのクエリ数（QPS）は非常に重要です。

Performance-optimized クラスターは、特に10から250の標準的な`top-k`値において、レイテンシーとスループットでCapacity-optimized クラスターを明らかに上回ります。

以下の表は、Performance-optimized クラスターとCapacity-optimized クラスターがQPSに関してどのように動作するかを示すテスト結果です。

<table>
   <tr>
     <th><p>top_k</p></th>
     <th><p>Performance-optimized クラスターのQPS (768次元 1Mベクトル)</p></th>
     <th><p>Capacity-optimized クラスターのQPS (768次元 5Mベクトル)</p></th>
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

以下の表は、各クラスタータイプがレイテンシーに関してどのように動作するかを示すテスト結果です。

<table>
   <tr>
     <th><p>top_k</p></th>
     <th><p>Performance-optimized クラスターのレイテンシー (768次元 1Mベクトル)</p></th>
     <th><p>Capacity-optimized クラスターのレイテンシー (768次元 5Mベクトル)</p></th>
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

## シナリオの内訳{#scenario-breakdown}

800万枚の画像を格納する画像レコメンデーションアプリケーションを構築しているとします。ライブラリ内の各画像は、768次元の埋め込みベクトルで表現されています。目標は、1,000 QPSのレコメンデーションリクエストを迅速に処理し、30ミリ秒以内に上位100件の画像レコメンデーションを提供することです。

この要件に合った適切なクラスタータイプとクエリCUを選択するには、以下の手順に従います。

1. **レイテンシーの評価**: Performance-optimized クラスターは、30ミリ秒のレイテンシー要件を満たす唯一のタイプです。

1. **容量の評価**: 1つのクエリCUを持つPerformance-optimized クラスターは、150万の768次元ベクトルを収容します。800万のベクトルすべてを保存するには、少なくとも6つのクエリCUが必要です。

1. **スループットの確認**: `top-k`設定が100の場合、Performance-optimized クラスターは440 QPSを達成できます。一貫して1,000 QPSを維持するには、replicaの数を3倍にする必要があります。

結論として、このシナリオではPerformance-optimized クラスターが最適です。各replicaが6つのクエリCUで構成される3つのreplicaの構成が、完璧に機能するはずです。

