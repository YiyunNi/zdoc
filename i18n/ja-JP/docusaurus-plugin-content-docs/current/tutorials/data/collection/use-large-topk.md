---
title: "大 TopK の使用 | Cloud"
slug: /use-large-topk
sidebar_key: use-large-topk
sidebar_label: "大 TopK"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud のコレクションでは、検索またはクエリ結果として最大 16,384 件のエンティティを取得できます。topK の制限を超えてより多くのエンティティを取得するには、クエリモードを設定して、複雑で時間のかかるイテレータを使用する代わりに、Zilliz Cloud で 1 回の検索またはクエリ結果に数百万件のエンティティを含めることができます。"
type: origin
token: RH6MwFlaCig6LRkR6Qec206OnUc
sidebar_position: 14
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - large TopK

---

import Admonition from '@theme/Admonition';


# 大 TopK を使用する

Zilliz Cloud コレクションでは、検索またはクエリ結果で最大 16,384 エンティティを取得できます。topK の制限を超えてより多くのエンティティを取得するには、クエリモードを設定して、複雑で時間のかかるイテレータを使用する代わりに、Zilliz Cloud が単一の検索またはクエリ結果に数百万のエンティティを含めることを許可できます。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、Milvus v2.6.x と互換性のある Zilliz Cloud クラスターで利用可能です。この機能をお試しになりたい場合は、<a href="https://support.zilliz.com/hc/en-us">お問い合わせください</a>。</p>

</Admonition>

## 概要\{#overview}

デフォルトでは、Zilliz Cloud コレクションは検索またはクエリ操作で最大 **16,384** の topK をサポートしています。単一のリクエストでより多くのエンティティを取得する必要がある場合（バッチ類似検索やデータマイニングのシナリオなど）、コレクションの `query_mode` プロパティを `large_topk` に設定して **大 TopK** モードを有効にすることができます。これにより、topK の制限が **1,000,000**（100万）エンティティに引き上げられます。

大 TopK を有効にすると、基盤となるインデックス戦略がデフォルトの Auto Index から **IVF（Inverted File Index）** と **RaBitQ** ディープ圧縮に変更されます。これは高リコール、大範囲取得に最適化されていますが、small-K クエリのパフォーマンスは低下します。

## 大 TopK を使用するタイミング\{#when-to-use-large-topk}

大 TopK は、単一の検索で非常に大量の類似エンティティを取得する必要があるシナリオ向けに設計されています。例えば：

- **バッチ類似検索**: 指定されたクエリベクトルに対して、上位 100,000 または 1,000,000 の最も類似したアイテムを見つける。

- **データマイニングと分析**: 下流の処理、フィルタリング、またはモデルトレーニング用に大規模な候補セットを抽出する。

- **回帰テストの準備**: シミュレーションチーム用のテストコーパスを構築するために、大規模な結果セットを取得する。

small topK（上位 10 や上位 100 など）での対話型、レイテンシーに敏感なオンラインクエリの場合は、デフォルトのクエリモードを推奨します。

## 前提条件とトレードオフ\{#prerequisites-and-trade-offs}

大 TopK を有効にする前に、以下のトレードオフに注意してください：

- **小-K パフォーマンスの低下**: `large_topk` に切り替えた後、small-K クエリ（K < 16,384）はデフォルトモードと比較してレイテンシーが増加し、リコールが低下します。

- **クエリレイテンシー**: 大 TopK クエリは標準クエリよりも大幅に高いレイテンシーを持ちます。topK 100,000 は数秒かかる場合があり、topK 1,000,000 は数分かかる場合があります。

- **リソース使用量**: 単一の large TopK クエリは、結果のソートに数ギガバイトのメモリを消費する可能性があります。Perf クラスターでは、これにより同じクラスターで実行されている他のクエリに影響を与える可能性があります。

- **オフラインでの推奨**: バッチワークロードの場合、On-demand Compute データベースの使用を検討してください。データベースはオンデマンド CU を使用し、オンラインサービスには影響しません。

- **インデックスの再構築が必要**: コレクションに既にベクトルインデックスがある場合、大 TopK を有効にする前に既存のインデックスをリリースして削除する必要があります。再構築中は検索が利用できません。

## 大 TopK を有効にする\{#enable-large-topk}

### コレクション作成時（推奨）\{#during-collection-creation-recommended}

コレクションで 大 TopK が必要になることがわかっている場合は、作成時に指定して、後で切り替えるコストを回避してください：

```python
from pymilvus import MilvusClient

client = MilvusClient(uri="your_uri", token="your_token")

client.create_collection(
    collection_name="scenarios_corpus",
    schema=schema,
    index_params=index_params,
    properties={"query_mode": "large_topk"}
)

```

### 既存のコレクション\{#on-an-existing-collection}

ベクトルインデックスがない既存のコレクションでは、大 TopK を直接有効にできます:

```python
client.alter_collection_properties(
    collection_name="scenarios_corpus",
    properties={"query_mode": "large_topk"}
)

```

既存のコレクションで、**ベクトルインデックスが設定されている場合**は、まずインデックスを削除し、次にモードを有効化し、最後にインデックスを再作成する必要があります。

```python
# 1. Release and drop the existing index
client.release_collection(collection_name="scenarios_corpus")
client.drop_index(collection_name="scenarios_corpus", index_name="vector_idx")

# 2. Enable Large TopK
client.alter_collection_properties(
    collection_name="scenarios_corpus",
    properties={"query_mode": "large_topk"}
)

# 3. Recreate the index (will use IVF + RaBitQ automatically)
client.create_index(
    collection_name="scenarios_corpus",
    index_params=index_params
)
client.load_collection(collection_name="scenarios_corpus")

```

### 現在のクエリモードを確認する\{#check-current-query-mode}

```python
info = client.describe_collection(collection_name="scenarios_corpus")
query_mode = info["properties"].get("query_mode")  # None means default mode

```

### 大 TopK の無効化\{#disable-large-topk}

デフォルトのクエリモードに戻すには、`query_mode` プロパティを削除します。これには、既存のインデックスを解放して削除することも必要であることに注意してください。

```python
client.drop_collection_properties(
    collection_name="scenarios_corpus",
    property_keys=["query_mode"]
)

```

## 大 TopK 検索を実行する\{#perform-a-large-topk-search}

大 TopK を有効にしたら、標準の `search` メソッドを使用して大きな `limit` 値を指定します:

### オンライン検索 (Serving Cluster)\{#online-search-serving-cluster}

```python
results = client.search(
    collection_name="scenarios_serving",
    data=[query_vector],
    limit=500000
)

```

### オフライン検索 (On-demand Compute)\{#offline-search-on-demand-compute}

```python
results = client.search(
    collection_name="scenarios_corpus",
    data=[query_vector],
    limit=500000
)

```

## 検索結果のエクスポート\{#export-search-results}

大 TopK 結果をエクスポートするための専用 API はありません。既存の機能を組み合わせて、結果をマネージド ボリュームに書き込むことができます。

```python
import pyarrow as pa
import pyarrow.parquet as pq

writer = None
try:
    for i, qvec in enumerate(query_vectors):
        results = client.search(
            collection_name="corpus",
            data=[qvec],
            limit=100000,
            output_fields=["scenario_id", "title"]
        )

        table = pa.Table.from_pylist([
            {"query_id": i, "rank": j, **r}
            for j, r in enumerate(results)
        ])

        if writer is None:
            writer = pq.ParquetWriter("/tmp/results.parquet", table.schema)
        writer.write_table(table)
finally:
    if writer is not None:
        writer.close()

volume_file_manager.upload_file_to_volume(
    source_file_path="/tmp/results.parquet",
    target_volume_path="results/batch.parquet"
)

```

## パフォーマンスの期待値\{#performance-expectations}

以下の表は、大 TopK クエリのパフォーマンス特性をまとめたものです：

<table>
   <tr>
     <th><p>メトリック</p></th>
     <th><p>デフォルトモード</p></th>
     <th><p>大 TopK モード</p></th>
   </tr>
   <tr>
     <td><p>TopK 制限</p></td>
     <td><p>16,384</p></td>
     <td><p>1,000,000</p></td>
   </tr>
   <tr>
     <td><p>小-K レイテンシ</p></td>
     <td><p>ミリ秒</p></td>
     <td><p>高い（低下）</p></td>
   </tr>
   <tr>
     <td><p>大-K レイテンシ</p></td>
     <td><p>サポートされていない</p></td>
     <td><p>数秒から数分</p></td>
   </tr>
   <tr>
     <td><p>クエリあたりのメモリ</p></td>
     <td><p>低</p></td>
     <td><p>最大数GB</p></td>
   </tr>
   <tr>
     <td><p>同時実行性</p></td>
     <td><p>高</p></td>
     <td><p>制限あり（キューイング）</p></td>
   </tr>
   <tr>
     <td><p>最適な用途</p></td>
     <td><p>オンラインインタラクション</p></td>
     <td><p>バッチ、データマイニング</p></td>
   </tr>
</table>

Zilliz Cloud は、リソース枯渇を防ぐため、大 TopK クエリに対して同時実行制御を適用します。同時実行制限を超えるリクエストはキューに入れられ、リソースが利用可能になった時点で処理されます。

## 制限事項\{#limitations}

- クエリモードの切り替えには、ベクトルインデックスの再構築が必要です。再構築中は、コレクションに対する検索が利用できません。

- 大 TopK はコレクションレベルの設定です。コレクション上のすべてのインデックスに影響します。

- 3つのクラスタータイプ（パフォーマンス最適化済み、容量最適化済み、および階層型ストレージ）すべてが 大 TopK をサポートしています。

## FAQ\{#faq}

**Q: 頻繁に切り替えたり戻したりできますか？**

技術的には可能ですが、推奨されません。切り替えのたびに、インデックスの解放、削除、および再作成が必要であり、その間は検索が利用できません。オンデマンドクラスターの場合、再構築のたびにインデックス構築 CU 料金も発生します。