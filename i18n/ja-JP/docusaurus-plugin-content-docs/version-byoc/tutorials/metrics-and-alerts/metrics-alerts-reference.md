---
title: "メトリクスリファレンス | BYOC"
slug: /metrics-alerts-reference
sidebar_label: "メトリクスリファレンス"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、メトリクスを組織とプロジェクトの2つのレベルに分類します | BYOC"
type: origin
token: KnnBwce9JifxvXkd070cvgUPnag
sidebar_position: 1
keywords:
  - zilliz
  - ベクトルデータベース
  - クラウド
  - メトリクス
  - アラート

---

import Admonition from '@theme/Admonition';


# メトリクスリファレンス

Zilliz Cloud は、メトリクスを**組織**と**プロジェクト**の2つのレベルに分類します。

- **組織レベルのメトリクス**: すべてのプロジェクトにわたるアカウント全体のステータス（例：ライセンスクレジット、使用状況）を反映します。

- **プロジェクトレベルのメトリクス**: 単一プロジェクト内のクラスターリソース、容量、パフォーマンス、およびデータを反映します。

<Admonition type="info" icon="📘" title="Notes">
<p>ほとんどのメトリクスはアラートをサポートしています。アラートは、一定期間にわたって条件（演算子 + しきい値）に対してメトリクスを評価し、条件が満たされたときに通知します。設定については、<a href="./manage-organization-alerts">組織アラートの管理</a>および<a href="./manage-project-alerts">プロジェクトアラートの管理</a>を参照してください。</p>
</Admonition>

## 組織レベルのメトリクス\{#organization-level-metrics}

組織レベルのメトリクスは、組織内のすべてのプロジェクトにわたるライセンス関連の問題を追跡するのに役立ちます。

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>単位</p></th>
     <th><p>説明</p></th>
     <th><p>推奨されるアクション</p></th>
   </tr>
   <tr>
     <td><p>ライセンスの有効性</p></td>
     <td><p>日</p></td>
     <td><p>組織ライセンスの有効期限が切れるまでの残り日数。</p></td>
     <td>
       <ul>
         <li><p><strong>60日未満</strong>: 更新プロセスを開始します。</p></li>
         <li><p><strong>期限切れ</strong>: 完全な機能（例：クラスターの作成/スケールアップ）を復元するために、直ちに更新/アップグレードします。</p></li>
       </ul>
     </td>
   </tr>
   <tr>
     <td><p>ライセンスコア使用率</p></td>
     <td><p>%</p></td>
     <td><p>使用済みCPUコアの総ライセンスコアに対する割合。</p></td>
     <td>
       <ul>
         <li><p><strong>&gt; 70%</strong>: 将来のニーズを評価し、更新/アップグレードを計画します。</p></li>
         <li><p><strong>100%</strong>: サービス中断を避けるために、直ちに更新/アップグレードします。</p></li>
       </ul>
     </td>
   </tr>
</table>

## プロジェクトレベルのメトリクス（クラスターメトリクス）\{#project-level-metrics-cluster-metrics}

これらのメトリクスは、プロジェクトのクラスター内のリソース使用量とパフォーマンスを記述します。

<Admonition type="info" icon="📘" title="Notes">
<p>このセクションでは、<strong>可用性</strong>はプロジェクトプランとデプロイオプションを指します。詳細なプラン比較については、<a href="./select-zilliz-cloud-service-plans">詳細なプラン比較</a>を参照してください。</p>
</Admonition>

### Pod & コンテナリソース\{#pod-and-container-resources}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>単位</p></th>
     <th><p>説明</p></th>
     <th><p>推奨されるアクション</p></th>
     <th><p>可用性</p></th>
   </tr>
   <tr>
     <td><p>CPU使用率</p></td>
     <td><p>コア</p></td>
     <td><p>Podが使用するCPUコアの数。</p></td>
     <td><p>トレンドを追跡し、持続的な増加やスパイクを調査します。</p></td>
     <td><p>BYOC</p></td>
   </tr>
   <tr>
     <td><p>CPU使用率（制限値に対する）</p></td>
     <td><p>%</p></td>
     <td><p>PodのCPU使用率の制限値に対する割合。</p></td>
     <td><p>上昇傾向にある場合は、ワークロードを最適化するか、制限値を増やします。</p></td>
     <td><p>BYOC</p></td>
   </tr>
   <tr>
     <td><p>メモリ使用量</p></td>
     <td><p>MB</p></td>
     <td><p>Pod内のコンテナのメモリ使用量（キャッシュを除く）。</p></td>
     <td><p>安定した増加や疑わしいメモリリークを調査します。</p></td>
     <td><p>BYOC</p></td>
   </tr>
   <tr>
     <td><p>メモリ使用率（制限値に対する）</p></td>
     <td><p>%</p></td>
     <td><p>Podのメモリ使用率の制限値に対する割合。</p></td>
     <td><p>継続的に高い場合は、メモリを最適化するか、制限値を引き上げます。</p></td>
     <td><p>BYOC</p></td>
   </tr>
   <tr>
     <td><p>ネットワークインバウンドフロー</p></td>
     <td><p>Mbps</p></td>
     <td><p>Podのネットワークインバウンドフロー。</p></td>
     <td><p>輻輳に注意し、帯域幅のサイジングを検証します。</p></td>
     <td><p>BYOC</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアウトバウンドフロー</p></td>
     <td><p>Mbps</p></td>
     <td><p>Podのネットワークアウトバウンドフロー。</p></td>
     <td><p>輻輳に注意し、帯域幅のサイジングを検証します。</p></td>
     <td><p>BYOC</p></td>
   </tr>
</table>

### リソース\{#resources}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>単位</p></th>
     <th><p>説明</p></th>
     <th><p>推奨されるアクション</p></th>
     <th><p>可用性</p></th>
   </tr>
   <tr>
     <td><p>Query CU計算</p></td>
     <td><p>%</p></td>
     <td><p>CUの総計算能力に対する利用された計算能力の尺度。</p></td>
     <td><blockquote><p>60%: レプリカのスケールアウトを推奨します。</p></blockquote></td>
     <td><p>Dedicated / BYOC</p></td>
   </tr>
   <tr>
     <td><p>Query CU容量</p></td>
     <td><p>%</p></td>
     <td><p>CUの総容量に対する使用された容量の尺度。</p></td>
     <td><blockquote><p>80%: クエリCUのスケールアップを推奨します。</p></blockquote></td>
     <td><p>Dedicated / BYOC</p></td>
   </tr>
   <tr>
     <td><p>Total Query CU</p></td>
     <td><p>カウント</p></td>
     <td><p>現在のクラスター内の総クエリCU。これは、クラスタークエリCUの数とレプリカの数の積として計算されます。（例：クラスターに2つのクエリCUと2つのレプリカがある場合、ここに表示される総クエリCUは4です。）</p></td>
     <td><p>クエリCUのスケーリングイベントを特定するために追跡します。</p></td>
     <td><p>Dedicated / BYOC</p></td>
   </tr>
   <tr>
     <td><p>Replica</p></td>
     <td><p>カウント</p></td>
     <td><p>クラスターレプリカの数。</p></td>
     <td><p>レプリカのスケーリングイベントを特定するために追跡します。</p></td>
     <td><p>Dedicated / BYOC</p></td>
   </tr>
   <tr>
     <td><p>ストレージ</p></td>
     <td><p>GB</p></td>
     <td><p>データとインデックスによって消費される永続ストレージの総量。</p></td>
     <td><p>ストレージ使用量を監視するために<a href="./manage-project-alerts">アラートを設定</a>します。</p></td>
     <td><p>すべて</p></td>
   </tr>
</table>

### パフォーマンス\{#performance}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>単位</p></th>
     <th><p>説明</p></th>
     <th><p>推奨されるアクション</p></th>
     <th><p>可用性</p></th>
   </tr>
   <tr>
     <td><p>QPS (Read)</p></td>
     <td><p>-</p></td>
     <td><p>1秒あたりの読み取りリクエスト（検索およびクエリ）の数。</p></td>
     <td><p>システムパフォーマンスの監視については、<a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a>を参照してください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>QPS (Write)</p></td>
     <td><p>-</p></td>
     <td><p>1秒あたりの書き込みリクエスト（挿入、一括挿入、更新、削除）の数。</p></td>
     <td><p>システムパフォーマンスの監視については、<a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a>を参照してください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>Search NQ per Second</p></td>
     <td><p>-</p></td>
     <td><p>各検索リクエストが1秒あたりに運ぶクエリベクトルの数。</p></td>
     <td><p>システムパフォーマンスの監視については、<a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a>を参照してください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>Write Throughput (Entities/sec)</p></td>
     <td><p>-</p></td>
     <td><p>すべての書き込み操作（挿入、更新、一括挿入、削除）で1秒あたりに書き込まれるエンティティの数を測定します。</p></td>
     <td><p>システムパフォーマンスの監視については、<a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a>を参照してください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>Latency (Read)</p></td>
     <td><p>ms</p></td>
     <td><p>クライアントが読み取りリクエスト（検索およびクエリリクエスト）をサーバーに送信してから、クライアントが応答を受信するまでの経過時間。平均レイテンシとP99レイテンシが含まれます。</p></td>
     <td><p>-</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>Latency (Write)</p></td>
     <td><p>ms</p></td>
     <td><p>クライアントが書き込みリクエスト（挿入および更新リクエスト）をサーバーに送信してから、クライアントが応答を受信するまでの経過時間。平均レイテンシとP99レイテンシが含まれます。</p></td>
     <td><p>-</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>Request Failure Rate (Read)</p></td>
     <td><p>%</p></td>
     <td><p>1秒あたりのすべてのリクエストにおける、失敗した読み取りリクエストの割合。</p></td>
     <td><p>読み取りリクエストの失敗率を監視するために<a href="./manage-project-alerts">アラートを設定</a>します。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>Request Failure Rate (Write)</p></td>
     <td><p>%</p></td>
     <td><p>1秒あたりのすべてのリクエストにおける、失敗した書き込みリクエストの割合。</p></td>
     <td><p>書き込みリクエストの失敗率を監視するために<a href="./manage-project-alerts">アラートを設定</a>します。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>Slow Query Count</p></td>
     <td><p>カウント/分</p></td>
     <td><p>実行に異常に時間がかかるクエリの数。</p></td>
     <td><p>問題のあるクエリを特定し、必要に応じてクラスター構成を調整してパフォーマンスをチューニングします。</p></td>
     <td><p>Dedicated (Enterprise or ビジネスクリティカル) / BYOC</p></td>
   </tr>
   <tr>
     <td><p>Cluster Write パフォーマンス Capacity</p></td>
     <td><p>%</p></td>
     <td><p>クラスター書き込みパフォーマンス容量 = 現在の書き込み操作レート / 書き込みレート制限。80%を超えると、書き込み操作（挿入および更新）のレートを減らすことを推奨します。</p></td>
     <td><p>現在のレートが高すぎる場合（80%を超えることが推奨されます）、書き込みレートを下げることを推奨します。</p></td>
     <td><p>Dedicated (Enterprise or ビジネスクリティカル) / BYOC</p></td>
   </tr>
   <tr>
     <td><p>Number of Flush 運用</p></td>
     <td><p>カウント/分</p></td>
     <td><p>クラスター上のフラッシュ操作の数。</p></td>
     <td><p>フラッシュ操作を頻繁に行いすぎると、クラスター全体のパフォーマンスに悪影響を与える可能性があります。詳細については、<a href="https://docs.cloud-uat3.zilliz.com/docs/limits#flush">Zilliz Cloud 制限</a>を参照してください。</p></td>
     <td><p>Dedicated (Enterprise or ビジネスクリティカル) / BYOC</p></td>
   </tr>
   <tr>
     <td><p>Cache Hit Rate</p></td>
     <td><p>%</p></td>
     <td><p>クラスター内のすべてのクエリの平均キャッシュヒット率。計算式：クエリごとのキャッシュヒット率 = (スキャンされた総データ量 - スキャンされたコールドデータ量) / スキャンされた総データ量。</p></td>
     <td><p>クラスタークエリのパフォーマンスを特定するために追跡します。</p></td>
     <td>
       <p>Dedicated (Tiered-storage) / BYOC</p>
       <p><em>*このメトリクスは、Milvus 2.6.xと互換性のある階層型ストレージクラスターでのみ利用可能です。このメトリクスにアクセスするには、<a href="http://support.zilliz.com">お問い合わせ</a>いただき、クラスターのMilvusバージョンをアップグレードしてください。</em></p>
     </td>
   </tr>
</table>

### データ\{#data}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>単位</p></th>
     <th><p>説明</p></th>
     <th><p>推奨されるアクション</p></th>
     <th><p>可用性</p></th>
   </tr>
   <tr>
     <td><p>Collection Count</p></td>
     <td><p>カウント</p></td>
     <td><p>クラスター内に作成されたコレクションの数。</p></td>
     <td><p>増加を監視し、必要に応じてプロジェクトごとの制限を適用します。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>エンティティ数</p></td>
     <td><p>カウント</p></td>
     <td><p>単一挿入と一括挿入の両方を含む、クラスターに挿入されたエンティティの総数。</p></td>
     <td><p>予期せぬ増加を調査し、ストレージとインデックス作成を計画します。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>ロードされたエンティティ (Approx.)</p></td>
     <td><p>カウント</p></td>
     <td><p>ロードされた（アクティブにサービスされている）エンティティのおおよその数。</p></td>
     <td><p>より正確でリアルタイムな値については、コレクション概要ページの「ロードされたエンティティ」値を参照するか、<a href="./single-vector-search">count(*)</a>を使用してください。</p></td>
     <td><p>Dedicated / BYOC</p></td>
   </tr>
   <tr>
     <td><p>Number of Unloaded Collections</p></td>
     <td><p>カウント</p></td>
     <td><p>クラスター内のアンロードされたコレクションの数。</p></td>
     <td><p>重要なコレクションをロードし、メモリのヘッドルームを確認します。</p></td>
     <td><p>Dedicated (Enterprise or ビジネスクリティカル) / BYOC</p></td>
   </tr>
</table>

### その他\{#others}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>単位</p></th>
     <th><p>説明</p></th>
     <th><p>推奨されるアクション</p></th>
     <th><p>可用性</p></th>
   </tr>
   <tr>
     <td><p>Cluster is 異常</p></td>
     <td><p>N/A</p></td>
     <td><p>ターゲットクラスターのステータスが異常な場合。</p></td>
     <td><p>クラスターのステータスを調査し、それに応じて対策を講じます。</p></td>
     <td><p>Dedicated (Enterprise or ビジネスクリティカル) / BYOC</p></td>
   </tr>
   <tr>
     <td><p>CMEK is Unavailable</p></td>
     <td><p>N/A</p></td>
     <td><p>Zilliz Cloudに追加されたKMSキーのいずれかが利用できなくなった場合。</p></td>
     <td><p>報告されたキーがまだ利用可能かどうかを確認するために、KMSキーをチェックします。</p></td>
     <td><p>Dedicated (Enterprise or ビジネスクリティカル) / BYOC</p></td>
   </tr>
   <tr>
     <td><p>Writes to Cluster Are Disabled</p></td>
     <td><p>N/A</p></td>
     <td><p>エラーまたは保護メカニズムにより、ターゲットクラスターへの書き込みが無効になっている場合。</p></td>
     <td><p>クラスターのステータス、最近の構成またはメンテナンス操作、および関連するアラートを確認し、根本原因を解決して書き込み機能を復元します。</p></td>
     <td><p>Dedicated (Enterprise or ビジネスクリティカル) / BYOC</p></td>
   </tr>
</table>

## 関連トピック\{#related-topics}

- [クラスターメトリクスチャートの表示](./view-cluster-metric-charts)

- [組織アラートの管理](./manage-organization-alerts)

- [プロジェクトアラートの管理](./manage-project-alerts)