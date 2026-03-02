---
title: "Prometheus との統合 | BYOC"
slug: /prometheus-monitoring
sidebar_label: "Prometheus"
beta: FALSE
notebook: FALSE
description: "Prometheus は、設定されたターゲットから指定された間隔でメトリクスを収集し、ルール式を評価し、結果を表示し、特定の条件に基づいてアラートをトリガーできる監視システムです。 | BYOC"
type: origin
token: Ex99woZlsico4FkfwxGckjRRnqf
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - サードパーティ
  - サービス
  - prometheus
  - 近傍探索
  - Agentic RAG
  - rag llm アーキテクチャ
  - プライベート LLM

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# Prometheus との統合

[Prometheus](https://prometheus.io/) は、設定されたターゲットから指定された間隔でメトリクスを収集し、ルール式を評価し、結果を表示し、特定の条件に基づいてアラートをトリガーできる監視システムです。

Zilliz Cloud を Prometheus と統合することで、Zilliz Cloud デプロイメントに関連するメトリクスを収集および監視できます。

## Prometheus を設定して Zilliz Cloud メトリクスをスクレイピングする {#configure-prometheus-to-scrape-zilliz-cloud-metrics}

Prometheus で Zilliz Cloud クラスターを監視するには、次の手順に従います。

<Procedures>

1. Prometheus サーバー上の `Prometheus.yml` 設定ファイルにアクセスします。詳細については、[Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#configuration) を参照してください。

1. `Prometheus.yml` ファイルの `scrape_configs` セクションに次のスニペットを追加します。プレースホルダーを適切な値に置き換えます。

    - `{{apiKey}}`: クラスターメトリクスにアクセスするための Zilliz Cloud API キー。

    - `{{clusterId}}`: 監視したい Zilliz Cloud クラスターの ID。

    ```yaml
    scrape_configs:
      - job_name: in01-06b8404b623xxxx
        scheme: https
        metrics_path: /v2/clusters/{{clusterId}}/metrics/export
        authorization:
          type: Bearer
          credentials: {{apiKey}}
        
        static_configs:
            - targets: ["api.cloud.zilliz.com"]
    ```

    <table>
       <tr>
         <th><p>パラメータ</p></th>
         <th><p>説明</p></th>
       </tr>
       <tr>
         <td><p><code>job_name</code></p></td>
         <td><p>スクレイピングされたメトリクスに割り当てられた人間が読めるラベル。</p></td>
       </tr>
       <tr>
         <td><p><code>scheme</code></p></td>
         <td><p>Zilliz Cloud エンドポイントからメトリクスをスクレイピングするために使用されるプロトコルスキーム。<code>https</code> に設定されています。</p></td>
       </tr>
       <tr>
         <td><p><code>metrics_path</code></p></td>
         <td><p>メトリクスデータを提供するターゲットサービス上のパス。</p></td>
       </tr>
       <tr>
         <td><p><code>authorization.type</code></p></td>
         <td><p>Zilliz Cloud メトリクスにアクセスするために使用される認証タイプ。値を <code>Bearer</code> に設定します。</p></td>
       </tr>
       <tr>
         <td><p><code>authorization.credentials</code></p></td>
         <td><p>Zilliz Cloud メトリクスエンドポイントにアクセスするための認証に使用される API キー。</p></td>
       </tr>
       <tr>
         <td><p><code>static_configs.targets</code></p></td>
         <td><p>Prometheus がスクレイピングする静的ターゲット。Zilliz Cloud RESTful API のホストアドレスである <code>api.cloud.zilliz.com</code> である必要があります。</p></td>
       </tr>
    </table>

1. 変更を `Prometheus.yml` ファイルに保存します。

</Procedures>

詳細については、[Prometheus 公式ドキュメント](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)を参照してください。

## スクレイピングされたメトリクスの例{#example-scraped-metrics}

以下は、Zilliz Cloud の `/metrics/export` エンドポイントからスクレイピングされた Prometheus メトリクスの例です。

```plaintext
# HELP zilliz_cluster_capacity Cluster capacity ratio
# TYPE zilliz_cluster_capacity gauge
zilliz_cluster_capacity 0.88
# HELP zilliz_cluster_computation Cluster computation ratio
# TYPE zilliz_cluster_computation gauge
zilliz_cluster_computation 0.1
# HELP zilliz_cluster_storage_bytes Cluster storage usage
# TYPE zilliz_cluster_storage_bytes gauge
zilliz_cluster_storage_bytes 8.9342782E7
# HELP zilliz_request_vectors_total Total number of vectors in requests
# TYPE zilliz_request_vectors_total counter
zilliz_request_vectors_total{request_type="bulk_insert"} 1.0
zilliz_request_vectors_total{request_type="delete"} 1.0
zilliz_request_vectors_total{request_type="insert"} 1.0
zilliz_request_vectors_total{request_type="search"} 1.0
zilliz_request_vectors_total{request_type="upsert"} 1.0
```

## Zilliz Cloudメトリックラベル{#zilliz-cloud-metric-labels}

Zilliz Cloudによって公開されるメトリックには、以下の識別子がラベル付けされています。

<table>
   <tr>
     <th><p>ラベル名</p></th>
     <th><p>説明</p></th>
     <th><p>値</p></th>
   </tr>
   <tr>
     <td><p><code>cluster_id</code></p></td>
     <td><p>メトリックの取得元であるZilliz CloudクラスターのID。</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p><code>org_id</code></p></td>
     <td><p>Zilliz Cloudクラスターを所有する組織のID。</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p><code>project_id</code></p></td>
     <td><p>クラスターが属する組織内のプロジェクトのID。</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p><code>collection_name</code></p></td>
     <td><p>監視対象のcollectionの名前。</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p><code>request_type</code></p></td>
     <td><p>データに対して実行された操作のタイプ。</p></td>
     <td><p><code>insert</code>, <code>upsert</code>, <code>delete</code>, <code>bulk_insert</code>, <code>flush</code>, <code>search</code>, <code>query</code></p></td>
   </tr>
   <tr>
     <td><p><code>status</code></p></td>
     <td><p>データ操作の結果。</p></td>
     <td><p><code>success</code>, <code>fail</code></p></td>
   </tr>
</table>

## 利用可能なメトリック{#available-metrics}

以下の表は、Zilliz Cloudで利用可能なメトリックを、そのタイプ、説明、および関連するラベルとともに示しています。

<table>
   <tr>
     <th><p>メトリック名</p></th>
     <th><p>タイプ</p></th>
     <th><p>説明</p></th>
     <th><p>ラベル</p></th>
   </tr>
   <tr>
     <td><p><code>zilliz_cluster_computation</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>現在の計算能力使用率。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_cluster_capacity</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>現在のストレージ容量使用率。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_storage_bytes</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>使用されている総ストレージ容量。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_cluster_write_capacity</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>現在の書き込みスループット。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_requests_total</code></p></td>
     <td><p>Counter</p></td>
     <td><p>処理されたリクエストの総数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code>, <code>request_type</code>, <code>status</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_request_vectors_total</code></p></td>
     <td><p>Counter</p></td>
     <td><p>すべてのリクエストで操作されたベクトルの総数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code>, <code>request_type</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_request_duration_seconds_bucket</code></p></td>
     <td><p>Histogram</p></td>
     <td><p>処理されたリクエストのレイテンシー分布。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code>, <code>request_type</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_slow_queries_total</code></p></td>
     <td><p>Counter</p></td>
     <td><p>レイテンシーしきい値を超えたクエリの数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_entities</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>保存されているentityの総数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code>, <code>collection_name</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_loaded_entities</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>現在メモリにloadされているentityの数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code>, <code>collection_name</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_indexed_entities</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>インデックス化されたentityの数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code>, <code>collection_name</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_collections</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>collectionの総数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_unloaded_collections</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>unloaded collectionの数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code></p></td>
   </tr>
</table>

## Prometheusクエリの例{#example-prometheus-queries}

PrometheusでZilliz Cloudメトリックを分析するために使用できるクエリの例をいくつか示します。

- insert QPSを計算する

    ```plaintext
    rate(zilliz_requests_total{cluster_id='in01-xxxxx',request_type='insert'}[$__rate_interval])
    ```

- 挿入VPSの計算

    ```plaintext
    rate(zilliz_request_vectors_total{cluster_id='in01-xxxxx',request_type='insert'}[$__rate_interval])
    ```

- 挿入レイテンシーの70パーセンタイルを計算する

    ```plaintext
    histogram_quantile(
        0.70, 
        sum(
            rate(zilliz_request_duration_seconds_bucket{cluster_id='in01-xxxxx',request_type='insert'}[$__rate_interval])
        ) by (le) 
    )
    ```

- insert リクエストの失敗率を計算する

    ```plaintext
    rate(zilliz_requests_total{cluster_id=?,status!='success'}[$__rate_interval])
    /
    rate(zilliz_requests_total{cluster_id=?}[$__rate_interval])
    ```

- 1分あたりの低速クエリ数を計算する

    ```plaintext
    sum(increase(zilliz_slow_queries_total{cluster_id=?}[1m]))
    ```

- 5分あたりの低速クエリ数を計算する

    ```plaintext
    sum(increase(zilliz_slow_queries_total{cluster_id=?}[5m]))
    ```

    