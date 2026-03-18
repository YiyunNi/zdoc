---
title: "Prometheus との統合 | BYOC"
slug: /prometheus-monitoring
sidebar_label: "Prometheus"
beta: FALSE
notebook: FALSE
description: "Prometheus は、設定されたターゲットから指定された間隔でメトリクスを収集し、ルール式を評価して結果を表示し、特定の条件に基づいてアラートをトリガーできる監視システムです。| BYOC"
type: origin
token: Ex99woZlsico4FkfwxGckjRRnqf
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - third-party
  - services
  - prometheus

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# Prometheus との統合

[Prometheus](https://prometheus.io/) は、設定されたターゲットから指定された間隔でメトリクスを収集し、ルール式を評価して結果を表示し、特定の条件に基づいてアラートをトリガーできる監視システムです。

Zilliz Cloud を Prometheus と統合することで、Zilliz Cloud デプロイメントに関連するメトリクスを収集および監視できます。

## Zilliz Cloud メトリクスをスクレイプするための Prometheus の設定\{#configure-prometheus-to-scrape-zilliz-cloud-metrics}

Prometheus で Zilliz Cloud クラスターを監視するには、次の手順に従ってください。

<Procedures>

1. Prometheus サーバー上の `Prometheus.yml` 設定ファイルにアクセスします。詳細については、[設定](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#configuration) を参照してください。

1. `Prometheus.yml` ファイルの `scrape_configs` セクションに以下のスニペットを追加します。プレースホルダーを適切な値に置き換えてください。

    - `{{apiキー}}`: クラスターメトリクスにアクセスするための Zilliz Cloud API キー。

    - `{{clusterId}}`: 監視対象の Zilliz Cloud クラスターの ID。

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
         <th><p>パラメーター</p></th>
         <th><p>説明</p></th>
       </tr>
       <tr>
         <td><p><code>job_name</code></p></td>
         <td><p>スクレイプされたメトリクスに割り当てられる人間が読めるラベル。</p></td>
       </tr>
       <tr>
         <td><p><code>scheme</code></p></td>
         <td><p>Zilliz Cloud エンドポイントからメトリクスをスクレイプするために使用されるプロトコルスキームで、<code>https</code> に設定されます。</p></td>
       </tr>
       <tr>
         <td><p><code>metrics_path</code></p></td>
         <td><p>メトリクスデータを提供するターゲットサービス上のパス。</p></td>
       </tr>
       <tr>
         <td><p><code>authorization.type</code></p></td>
         <td><p>Zilliz Cloud メトリクスへのアクセスに使用される認証タイプ。値を <code>Bearer</code> に設定します。</p></td>
       </tr>
       <tr>
         <td><p><code>authorization.credentials</code></p></td>
         <td><p>Zilliz Cloud メトリクスエンドポイントへのアクセス権限付与に使用される API キー。</p></td>
       </tr>
       <tr>
         <td><p><code>static_configs.targets</code></p></td>
         <td><p>Prometheus がスクレイプする静的ターゲットで、Zilliz Cloud RESTful API のホストアドレスである <code>api.cloud.zilliz.com</code> である必要があります。</p></td>
       </tr>
    </table>

1. `Prometheus.yml` ファイルへの変更を保存します。

</Procedures>

詳細については、[Prometheus 公式ドキュメント](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) を参照してください。

## スクレイプされたメトリクスの例\{#example-scraped-metrics}

以下は、Zilliz Cloud の `/metrics/export` エンドポイントからスクレイプされた Prometheus メトリクスの例です：

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

## Zilliz Cloud メトリックラベル\{#zilliz-cloud-metric-labels}

Zilliz Cloud によって公開されるメトリックには、以下の識別子がラベルとして付与されます。

<table>
   <tr>
     <th><p>ラベル名</p></th>
     <th><p>説明</p></th>
     <th><p>値</p></th>
   </tr>
   <tr>
     <td><p><code>cluster_id</code></p></td>
     <td><p>メトリックの送信元である Zilliz Cloud クラスターの ID。</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p><code>org_id</code></p></td>
     <td><p>Zilliz Cloud クラスターを所有する組織の ID。</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p><code>project_id</code></p></td>
     <td><p>クラスターが所属する、組織内のプロジェクトの ID。</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p><code>collection_name</code></p></td>
     <td><p>監視対象となっているコレクションの名前。</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p><code>request_type</code></p></td>
     <td><p>データに対して実行された操作の種類。</p></td>
     <td><p><code>insert</code>, <code>upsert</code>, <code>delete</code>, <code>bulk_insert</code>, <code>flush</code>, <code>search</code>, <code>query</code></p></td>
   </tr>
   <tr>
     <td><p><code>status</code></p></td>
     <td><p>データ操作の結果。</p></td>
     <td><p><code>success</code>, <code>fail</code></p></td>
   </tr>
</table>

## 利用可能なメトリック\{#available-metrics}

以下の表は、Zilliz Cloud で利用可能なメトリックを、そのタイプ、説明、関連するラベルとともに示しています。

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
     <td><p>現在の計算容量の使用率。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_cluster_capacity</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>現在のストレージ容量の使用率。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_storage_bytes</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>使用されているストレージ領域の総量。</p></td>
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
     <td><p>すべてのリクエストを通じて操作されたベクトルの総数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code>, <code>request_type</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_request_duration_seconds_bucket</code></p></td>
     <td><p>Histogram</p></td>
     <td><p>処理されたリクエストのレイテンシ分布。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code>, <code>request_type</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_slow_queries_total</code></p></td>
     <td><p>Counter</p></td>
     <td><p>レイテンシ閾値を超えたクエリの数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_entities</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>保存されているエンティティの総数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code>, <code>collection_name</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_loaded_entities</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>現在メモリ上にロードされているエンティティの数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code>, <code>collection_name</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_indexed_entities</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>インデックス化が完了したエンティティの数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code>, <code>collection_name</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_collections</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>コレクションの総数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code></p></td>
   </tr>
   <tr>
     <td><p><code>zilliz_unloaded_collections</code></p></td>
     <td><p>Gauge</p></td>
     <td><p>ロードされていないコレクションの数。</p></td>
     <td><p><code>cluster_id</code>, <code>org_id</code>, <code>project_id</code></p></td>
   </tr>
</table>

## Prometheus クエリの例\{#example-prometheus-queries}

以下は、Prometheus を使用して Zilliz Cloud のメトリックを分析するために使用できるクエリの例です。

- insert QPS を計算する

    ```plaintext
    rate(zilliz_requests_total{cluster_id='in01-xxxxx',request_type='insert'}[$__rate_interval])
    ```

- 挿入 VPS を計算する

    ```plaintext
    rate(zilliz_request_vectors_total{cluster_id='in01-xxxxx',request_type='insert'}[$__rate_interval])
    ```

- 70 パーセンタイルの挿入レイテンシを計算する

    ```plaintext
    histogram_quantile(
        0.70, 
        sum(
            rate(zilliz_request_duration_seconds_bucket{cluster_id='in01-xxxxx',request_type='insert'}[$__rate_interval])
        ) by (le) 
    )
    ```

- 挿入リクエストの失敗率を計算する

    ```plaintext
    rate(zilliz_requests_total{cluster_id=?,status!='success'}[$__rate_interval])
    /
    rate(zilliz_requests_total{cluster_id=?}[$__rate_interval])
    ```

- 1 分あたりのスロークエリ数を計算する

    ```plaintext
    sum(increase(zilliz_slow_queries_total{cluster_id=?}[1m]))
    ```

- 5 分ごとのスロークエリ数を計算する

    ```plaintext
    sum(increase(zilliz_slow_queries_total{cluster_id=?}[5m]))
    ```

    