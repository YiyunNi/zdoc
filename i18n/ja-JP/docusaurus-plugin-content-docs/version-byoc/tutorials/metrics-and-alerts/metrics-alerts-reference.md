---
title: "メトリクスリファレンス | BYOC"
slug: /metrics-alerts-reference
sidebar_key: metrics-alerts-reference
sidebar_label: "メトリクスリファレンス"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud はメトリクスを以下のレベルに整理しています | BYOC"
type: origin
token: KnnBwce9JifxvXkd070cvgUPnag
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - メトリクス
  - アラート

---

import Admonition from '@theme/Admonition';


# メトリクスリファレンス

Zilliz Cloud はメトリクスを以下のレベルに分類しています：

- **組織レベルのメトリクス**: すべてのプロジェクトにわたるアカウント全体のステータス（例：ライセンスクレジット、使用量）を反映します。

- **クラスタレベルのメトリクス**: 個別のクラスタ内のリソース、パフォーマンス、データを反映します。

- **コレクションレベルのメトリクス**: クラスタメトリクスのサブセットで、コレクションごとに内訳を示し、個別のコレクションのパフォーマンス問題の特定や容量計画に役立ちます。

<Admonition type="info" icon="📘" title="Notes">

<p>ほとんどのメトリクスはアラートをサポートしています。アラートは、時間枠内でメトリクスを条件（演算子＋しきい値）と照合し、条件が満たされたときに通知します。設定については、<a href="./manage-organization-alerts">組織アラートの管理</a>および<a href="./manage-project-alerts">プロジェクトアラートの管理</a>を参照してください。</p>

</Admonition>

## 組織レベルのメトリクス\{#organization-level-metrics}

組織レベルのメトリクスは、組織内のすべてのプロジェクトにわたるライセンス関連の問題を追跡するのに役立ちます。

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>説明</p></th>
     <th><p>推奨アクション</p></th>
   </tr>
   <tr>
     <td><p>License Validity (day)</p></td>
     <td><p>組織のライセンスが失効するまでの残り日数。</p></td>
     <td><ul><li><p><strong>< 60 days</strong>: 更新プロセスを開始してください。</p></li><li><p><strong>Expired</strong>: 完全な機能（例：クラスタ作成/スケールアップ）を復元するために、直ちに更新/アップグレードしてください。</p></li></ul></td>
   </tr>
   <tr>
     <td><p>License Core Usage (%)</p></td>
     <td><p>使用済みCPUコア数に対する、ライセンス済み総コア数の割合。</p></td>
     <td><ul><li><p><strong>></strong> <strong>70%</strong>: 将来のニーズを評価し、更新/アップグレードを計画してください。</p></li><li><p><strong>100%</strong>: 中断を避けるため、直ちに更新/アップグレードしてください。</p></li></ul></td>
   </tr>
</table>

## クラスタおよびコレクションメトリクス\{#cluster-and-collection-metrics}

これらのメトリクスは、個別のクラスタ内のリソース、パフォーマンス、データを説明します。**✦** のマークが付いているメトリクスは、コレクションレベルでも利用可能です。コレクションレベルのメトリクスには、コンソールのコレクション詳細ページ、[Prometheus エンドポイント](./prometheus-monitoring)、または RESTful API からアクセスできます。

<Admonition type="info" icon="📘" title="Notes">

<p>このセクションでは、<strong>Availability</strong> はプロジェクトプランとデプロイメントオプションを指します。詳細なプラン比較については、<a href="./select-zilliz-cloud-service-plans">詳細なプラン比較</a>を参照してください。</p>

</Admonition>

### Pod & コンテナリソース\{#pod-and-container-resources}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>説明</p></th>
     <th><p>Availability</p></th>
     <th><p>推奨アクション</p></th>
   </tr>
   <tr>
     <td><p>CPU Usage (core)</p></td>
     <td><p>Pod によって使用される CPU コア数。</p></td>
     <td><p>BYOC</p></td>
     <td><p>トレンドを追跡してください。持続的な増加やスパイクを調査してください。</p></td>
   </tr>
   <tr>
     <td><p>CPU Usage Rate for 制限 (%)</p></td>
     <td><p>Pod の CPU 使用量が limit の値に対して占める割合。</p></td>
     <td><p>BYOC</p></td>
     <td><p>上昇傾向の場合は、ワークロードを最適化するか limit を増やしてください。</p></td>
   </tr>
   <tr>
     <td><p>Memory Usage (MB)</p></td>
     <td><p>Pod 内のコンテナのメモリ使用量（キャッシュを除く）。</p></td>
     <td><p>BYOC</p></td>
     <td><p>持続的な増加や疑わしいリークを調査してください。</p></td>
   </tr>
   <tr>
     <td><p>Memory Usage Rate for 制限 (%)</p></td>
     <td><p>Pod のメモリ使用量が limit の値に対して占める割合。</p></td>
     <td><p>BYOC</p></td>
     <td><p>一貫して高い場合は、メモリを最適化するか limit を引き上げてください。</p></td>
   </tr>
   <tr>
     <td><p>ネットワーク Inbound Flow (Mbps)</p></td>
     <td><p>Pod のネットワーク受信フロー。</p></td>
     <td><p>BYOC</p></td>
     <td><p>輻輳に注意してください。帯域幅のサイジングを検証してください。</p></td>
   </tr>
   <tr>
     <td><p>ネットワーク Outbound Flow (Mbps)</p></td>
     <td><p>Pod のネットワーク送信フロー。</p></td>
     <td><p>BYOC</p></td>
     <td><p>輻輳に注意してください。帯域幅のサイジングを検証してください。</p></td>
   </tr>
</table>

### リソース\{#resources}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>説明</p></th>
     <th><p>Availability</p></th>
     <th><p>推奨アクション</p></th>
   </tr>
   <tr>
     <td><p>Query CU計算 (%)</p></td>
     <td><p>CU の総計算容量に対する、使用された計算能力の割合。</p></td>
     <td><p>Dedicated / BYOC</p></td>
     <td><blockquote>  <p>60%: <a href="./manage-replica">レプリカのスケールアウト</a> を推奨</p></blockquote></td>
   </tr>
   <tr>
     <td><p>Query CU容量 %</p></td>
     <td><p>CU の総容量に対する、使用された容量の割合。</p></td>
     <td><p>Dedicated / BYOC</p></td>
     <td><blockquote>  <p>80%:  <a href="./scale-query-cu">クエリ CU のスケールアップ</a> を推奨</p></blockquote></td>
   </tr>
   <tr>
     <td><p>Total Query CU (count)</p></td>
     <td><p>現在のクラスタの総クエリ CU 数。クラスタのクエリ CU 数とレプリカ数の積として計算されます。（例：クラスタに 2 つのクエリ CU と 2 つのレプリカがある場合、ここに表示される Total Query CU は 4 となります。）</p></td>
     <td><p>Dedicated / BYOC</p></td>
     <td><p>クエリ CU のスケーリングイベントを特定するために追跡してください。</p></td>
   </tr>
   <tr>
     <td><p>Replica (count)</p></td>
     <td><p>クラスタレプリカの数。</p></td>
     <td><p>Dedicated / BYOC</p></td>
     <td><p>レプリカのスケーリングイベントを特定するために追跡してください。</p></td>
   </tr>
   <tr>
     <td><p>Storage (GB)</p></td>
     <td><p>データとインデックスによって消費される永続ストレージの総量。</p></td>
     <td><p>All</p></td>
     <td><p>ストレージ使用量の監視のために<a href="./manage-project-alerts">アラートを設定</a>してください。</p></td>
   </tr>
</table>

### パフォーマンス\{#performance}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>説明</p></th>
     <th><p>Availability</p></th>
     <th><p>推奨アクション</p></th>
   </tr>
   <tr>
     <td><p>QPS (Read) ✦</p></td>
     <td><p>1 秒あたりの読み取りリクエスト（search および query）の数。</p></td>
     <td><p>All</p></td>
     <td><p>システムパフォーマンスの監視については <a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a> を参照してください。</p></td>
   </tr>
   <tr>
     <td><p>QPS (Write) ✦</p></td>
     <td><p>1 秒あたりの書き込みリクエスト（insert、bulk insert、upsert、および delete）の数。</p></td>
     <td><p>All</p></td>
     <td><p>システムパフォーマンスの監視については <a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a> を参照してください。</p></td>
   </tr>
   <tr>
     <td><p>Search NQ per Second ✦</p></td>
     <td><p>1 秒あたりに各 search リクエストが含むクエリベクトルの数。</p></td>
     <td><p>All</p></td>
     <td><p>システムパフォーマンスの監視については <a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a> を参照してください。</p></td>
   </tr>
   <tr>
     <td><p>Write Throughput (Entities/sec) ✦</p></td>
     <td><p>すべての書き込み操作（insert、upsert、bulk insert、および delete）を通じて、1 秒あたりに書き込まれたエンティティ数を測定します。</p></td>
     <td><p>All</p></td>
     <td><p>システムパフォーマンスの監視については <a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a> を参照してください。</p></td>
   </tr>
   <tr>
     <td><p>Latency (Read) (ms) ✦</p></td>
     <td><p>クライアントが読み取りリクエスト（search および query リクエスト）をサーバーに送信してから、クライアントがレスポンスを受信するまでの経過時間。平均レイテンシと P99 レイテンシを含みます。</p></td>
     <td><p>All</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>Latency (Write) (ms) ✦</p></td>
     <td><p>クライアントが書き込みリクエスト（insert および upsert リクエスト）をサーバーに送信してから、クライアントがレスポンスを受信するまでの経過時間。平均レイテンシと P99 レイテンシを含みます。</p></td>
     <td><p>All</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>Request Failure Rate (Read) (%) ✦</p></td>
     <td><p>1 秒あたりのすべてのリクエストのうち、失敗した読み取りリクエストの割合。</p></td>
     <td><p>All</p></td>
     <td><p>読み取りリクエストの失敗率を監視するために<a href="./manage-project-alerts">アラートを設定</a>してください。</p></td>
   </tr>
   <tr>
     <td><p>Request Failure Rate (Write) (%) ✦</p></td>
     <td><p>1 秒あたりのすべてのリクエストのうち、失敗した書き込みリクエストの割合。</p></td>
     <td><p>All</p></td>
     <td><p>書き込みリクエストの失敗率を監視するために<a href="./manage-project-alerts">アラートを設定</a>してください。</p></td>
   </tr>
   <tr>
     <td><p>Slow Query Count (counts/min)</p></td>
     <td><p>異常に長い時間を要して実行されるクエリの数。</p><p>デフォルトでは、レイテンシが 5 秒を超えるクエリはスロークエリとみなされます。</p></td>
     <td><p>Dedicated (Enterprise or  ビジネスクリティカル) / BYOC</p></td>
     <td><p>問題のあるクエリを特定し、必要に応じてクラスタ構成を調整してパフォーマンスをチューニングしてください。</p></td>
   </tr>
   <tr>
     <td><p>Cluster Write パフォーマンス Capacity (%)</p></td>
     <td><p>クラスタ書き込みパフォーマンス容量 = 現在の書き込み操作レート / 書き込みレート制限。80% を超える場合、書き込み操作（insert および upsert）のレートを下げることを推奨します。</p></td>
     <td><p>Dedicated (Enterprise or  ビジネスクリティカル) / BYOC</p></td>
     <td><p>現在のレートが高すぎる場合（80% を超えることを推奨）、書き込みレートを下げることを推奨します。</p></td>
   </tr>
   <tr>
     <td><p>Number of Flush 運用 (counts/min)</p></td>
     <td><p>クラスタでの flush 操作の数。</p></td>
     <td><p>Dedicated (Enterprise or  ビジネスクリティカル) / BYOC</p></td>
     <td><p>flush 操作を頻繁に実行しすぎると、クラスタ全体のパフォーマンスに悪影響を与える可能性があります。詳細については、<a href="./limits#flush">Zilliz Cloud 制限s</a> を参照してください。</p></td>
   </tr>
   <tr>
     <td><p>Cache Hit Rate (%)</p></td>
     <td><p>クラスタ内のすべてのクエリの平均キャッシュヒット率。計算式：クエリあたりのキャッシュヒット率 =（総スキャンデータ − コールドデータスキャン）/ 総スキャンデータ。</p></td>
     <td><p>Dedicated (Tiered-storage) / BYOC</p><p><em>&ast;このメトリクスは、Milvus 2.6.x と互換性のある階層型ストレージクラスタでのみ利用可能です。このメトリクスにアクセスするには、<a href="http://support.zilliz.com">お問い合わせ</a>いただき、クラスタの Milvus バージョンをアップグレードしてください。</em></p></td>
     <td><p>クラスタのクエリパフォーマンスを特定するために追跡してください。</p></td>
   </tr>
</table>

### データ\{#data}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>説明</p></th>
     <th><p>Availability</p></th>
     <th><p>推奨アクション</p></th>
   </tr>
   <tr>
     <td><p>Collection Count</p></td>
     <td><p>クラスタに作成されたコレクションの数。</p></td>
     <td><p>All</p></td>
     <td><p>増加を監視してください。必要に応じてプロジェクトごとの制限を適用してください。</p></td>
   </tr>
   <tr>
     <td><p>エンティティ数 ✦</p></td>
     <td><p>クラスタまたはコレクションに挿入されたエンティティの総数。単一挿入と一括挿入の両方を含みます。</p></td>
     <td><p>All</p></td>
     <td><p>予期しない増加を調査してください。ストレージとインデックスを計画してください。</p></td>
   </tr>
   <tr>
     <td><p>ロードされたエンティティ (Approx.) ✦</p></td>
     <td><p>ロードされた（アクティブに提供されている）エンティティの概算数。</p></td>
     <td><p>Dedicated / BYOC</p></td>
     <td><p>より正確でリアルタイムの値については、コレクション概要ページの「ロードされたエンティティ」の値、または <a href="./single-vector-search">count(&ast;)</a> を参照してください。</p></td>
   </tr>
   <tr>
     <td><p>Number of Unloaded Collections</p></td>
     <td><p>クラスタ内のアンロードされたコレクションの数。</p></td>
     <td><p>Dedicated (Enterprise or  ビジネスクリティカル) / BYOC</p></td>
     <td><p>重要なコレクションをロードしてください。メモリの余裕を確認してください。</p></td>
   </tr>
</table>

### その他\{#others}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>説明</p></th>
     <th><p>Availability</p></th>
     <th><p>推奨アクション</p></th>
   </tr>
   <tr>
     <td><p>Cluster is 異常</p></td>
     <td><p>対象クラスタのステータスが異常な場合。</p></td>
     <td><p>Dedicated (Enterprise or  ビジネスクリティカル) / BYOC</p></td>
     <td><p>クラスタのステータスを調査し、適切な対策を講じてください。</p></td>
   </tr>
   <tr>
     <td><p>CMEK is Unavailable</p></td>
     <td><p>Zilliz Cloud に追加された KMS キーのいずれかが利用できなくなった場合。</p></td>
     <td><p>Dedicated (Enterprise or  ビジネスクリティカル) / BYOC</p></td>
     <td><p>KMS キーを確認し、報告されたキーがまだ利用可能かどうかを判断してください。</p></td>
   </tr>
   <tr>
     <td><p>Writes to Cluster Are Disabled</p></td>
     <td><p>エラーまたは保護メカニズムにより、対象クラスタへの書き込みが無効になった場合。</p></td>
     <td><p>Dedicated (Enterprise or  ビジネスクリティカル) / BYOC</p></td>
     <td><p>クラスタのステータス、最近の構成またはメンテナンスの運用、および関連するアラートを確認し、根本原因を解決して書き込み機能を復元してください。</p></td>
   </tr>
</table>

## 関連トピック\{#related-topics}

- [クラスタメトリクスチャートの表示](./view-cluster-metric-charts)

- [組織アラートの管理](./manage-organization-alerts)

- [プロジェクトアラートの管理](./manage-project-alerts)

