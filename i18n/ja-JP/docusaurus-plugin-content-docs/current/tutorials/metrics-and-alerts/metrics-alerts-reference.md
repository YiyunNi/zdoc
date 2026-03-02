---
title: "メトリクスリファレンス | Cloud"
slug: /metrics-alerts-reference
sidebar_label: "メトリクスリファレンス"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、メトリクスを組織とプロジェクトの2つのレベルに分類します。"
type: origin
token: KnnBwce9JifxvXkd070cvgUPnag
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - メトリクス
  - アラート
  - milvus db
  - milvus vector db
  - Zilliz Cloud
  - what is milvus

---

import Admonition from '@theme/Admonition';


# メトリクスリファレンス

Zilliz Cloudは、メトリクスを**組織**と**プロジェクト**の2つのレベルに分類します。

- **組織レベルのメトリクス**: すべてのプロジェクトにわたるアカウント全体のステータス（例：ライセンスクレジット、使用状況）を反映します。

- **プロジェクトレベルのメトリクス**: 単一プロジェクト内のクラスターリソース、容量、パフォーマンス、およびデータを反映します。

<Admonition type="info" icon="📘" title="Notes">

<p>ほとんどのメトリクスはアラートをサポートしています。アラートは、一定期間にわたってメトリクスを条件（演算子 + しきい値）と比較し、条件が満たされたときに通知します。設定については、<a href="./manage-organization-alerts">組織アラートの管理</a>および<a href="./manage-project-alerts">プロジェクトアラートの管理</a>を参照してください。</p>

</Admonition>

## 組織レベルのメトリクス{#organization-level-metrics}

組織レベルのメトリクスは、組織内のすべてのプロジェクトにわたる請求関連の問題を追跡するのに役立ちます。

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>単位</p></th>
     <th><p>説明</p></th>
     <th><p>推奨されるアクション</p></th>
   </tr>
   <tr>
     <td><p>過去1日の使用量</p></td>
     <td><p>$</p></td>
     <td><p>過去1日間の累積使用料金。</p></td>
     <td><p>予算と比較して監視し、必要に応じて使用量を最適化するか、予算を調整します。</p></td>
   </tr>
   <tr>
     <td><p>クレジットの有効性</p></td>
     <td><p>日</p></td>
     <td><p>無料クレジットの有効期限が切れるまでの残り日数。</p></td>
     <td><p>有効期限が切れる前にクレジットを使用または延長します。</p></td>
   </tr>
   <tr>
     <td><p>残りクレジット</p></td>
     <td><p>$</p></td>
     <td><p>無料クレジットの残高。</p></td>
     <td><p>アカウント機能を維持するために、残高が少なくなったらチャージします。</p></td>
   </tr>
   <tr>
     <td><p>クレジットカードの有効性</p></td>
     <td><p>日</p></td>
     <td><p>保存されたカードの有効期限が切れるまでの日数。</p></td>
     <td><p>支払い失敗を避けるために、有効期限が切れる前にカードを更新または交換します。</p></td>
   </tr>
   <tr>
     <td><p>前払い残高</p></td>
     <td><p>$</p></td>
     <td><p>残りの前払い資金。</p></td>
     <td><p>サービス中断を防ぐために、残高が少なくなったら資金を追加します。</p></td>
   </tr>
</table>

## プロジェクトレベルのメトリクス（クラスターメトリクス）{#project-level-metrics-cluster-metrics}

これらのメトリクスは、プロジェクトのクラスター内のリソース使用量とパフォーマンスを記述します。

<Admonition type="info" icon="📘" title="Notes">

<p>このセクションでは、<strong>可用性</strong>はプロジェクトプランとデプロイオプションを指します。詳細なプラン比較については、<a href="./select-zilliz-cloud-service-plans">詳細なプラン比較</a>を参照してください。</p>

</Admonition>

### リソース{#resources}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>単位</p></th>
     <th><p>説明</p></th>
     <th><p>推奨されるアクション</p></th>
     <th><p>可用性</p></th>
   </tr>
   <tr>
     <td><p>Read vCUs</p></td>
     <td><p>カウント</p></td>
     <td><p>検索およびクエリ操作のvCU消費量の測定。</p><p>注：このメトリクスはアラートをサポートしていません。</p></td>
     <td><p>読み取りコスト/スループットを理解するために傾向を監視します。</p></td>
     <td><p>Free / Serverless</p></td>
   </tr>
   <tr>
     <td><p>Write vCUs</p></td>
     <td><p>カウント</p></td>
     <td><p>insert、delete、およびupsert操作のvCU消費量の測定。</p><p>注：このメトリクスはアラートをサポートしていません。</p></td>
     <td><p>書き込みコスト/スループットを理解するために傾向を監視します。</p></td>
     <td><p>Free / Serverless</p></td>
   </tr>
   <tr>
     <td><p>Query CU Computation</p></td>
     <td><p>%</p></td>
     <td><p>CUの総計算能力に対する利用された計算能力の測定。</p></td>
     <td><blockquote>  <p>60%：<a href="./manage-replica">レプリカのスケールアウト</a>を推奨</p></blockquote></td>
     <td><p>Dedicated / BYOC</p></td>
   </tr>
   <tr>
     <td><p>Query CU Capacity</p></td>
     <td><p>%</p></td>
     <td><p>CUの総容量に対する使用された容量の測定。</p></td>
     <td><blockquote>  <p>80%：<a href="./scale-query-cu">クエリCUのスケールアップ</a>を推奨</p></blockquote></td>
     <td><p>Dedicated / BYOC</p></td>
   </tr>
   <tr>
     <td><p>Total Query CU</p></td>
     <td><p>カウント</p></td>
     <td><p>現在のクラスター内の総クエリCU。これは、クラスタークエリCUの数とレプリカの数の積として計算されます。（例：クラスターに2つのQuery CUと2つのReplicaがある場合、ここに表示されるTotal Query CUは4です。）</p></td>
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
     <td><p>Storage</p></td>
     <td><p>GB</p></td>
     <td><p>データとインデックスによって消費される永続ストレージの総量。</p></td>
     <td><p>ストレージ使用量を監視するために<a href="./manage-project-alerts">アラートを設定</a>します。</p></td>
     <td><p>すべて</p></td>
   </tr>
</table>

### パフォーマンス{#performance}

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
     <td><p>システムパフォーマンス監視については、<a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a>を参照してください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>QPS (Write)</p></td>
     <td><p>-</p></td>
     <td><p>1秒あたりの書き込みリクエスト（insert、bulk insert、upsert、およびdelete）の数。</p></td>
     <td><p>システムパフォーマンス監視については、<a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a>を参照してください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>Search NQ per Second</p></td>
     <td><p>-</p></td>
     <td><p>各検索リクエストが1秒あたりに運ぶクエリベクトルの数。</p></td>
     <td><p>システムパフォーマンス監視については、<a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a>を参照してください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>Write Throughput (Entities/sec)</p></td>
     <td><p>-</p></td>
     <td><p>すべての書き込み操作（insert、upsert、bulk insert、およびdelete）にわたって1秒あたりに書き込まれるentityの数を測定します。</p></td>
     <td><p>システムパフォーマンス監視については、<a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a>を参照してください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>Latency (Read)</p></td>
     <td><p>ms</p></td>
     <td><p>クライアントがサーバーに読み取りリクエスト（検索およびクエリリクエスト）を送信してから、クライアントが応答を受信するまでの経過時間。平均レイテンシとP99レイテンシが含まれます。</p></td>
     <td><p>-</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>Latency (Write)</p></td>
     <td><p>ms</p></td>
     <td><p>クライアントがサーバーに書き込みリクエスト（insertおよびupsertリクエスト）を送信してから、クライアントが応答を受信するまでの経過時間。平均レイテンシとP99レイテンシが含まれます。</p></td>
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
     <td><p>Dedicated (Enterprise または Business Critical) / BYOC</p></td>
   </tr>
   <tr>
     <td><p>Cluster Write Performance Capacity</p></td>
     <td><p>%</p></td>
     <td><p>クラスター書き込みパフォーマンス容量 = 現在の書き込み操作レート/書き込みレート制限。80%を超えた場合、書き込み操作（insertおよびupsert）のレートを減らすことを推奨します。</p></td>
     <td><p>現在のレートが高すぎる場合（80%を超えることが推奨されます）、書き込みレートを下げることを推奨します。</p></td>
     <td><p>Dedicated (Enterprise または Business Critical) / BYOC</p></td>
   </tr>
   <tr>
     <td><p>Number of Flush Operations</p></td>
     <td><p>カウント/分</p></td>
     <td><p>クラスター上のflush操作の数。</p></td>
     <td><p>flush操作を頻繁に実行しすぎると、クラスター全体のパフォーマンスに悪影響を与える可能性があります。詳細については、<a href="https://docs.cloud-uat3.zilliz.com/docs/limits#flush">Zilliz Cloud Limits</a>を参照してください。</p></td>
     <td><p>Dedicated (Enterprise または Business Critical) / BYOC</p></td>
   </tr>
   <tr>
     <td><p>Cache Hit Rate</p></td>
     <td><p>%</p></td>
     <td><p>クラスター内のすべてのクエリの平均キャッシュヒット率。次のように計算されます：クエリあたりのキャッシュヒット率 = (スキャンされた総データ量 − スキャンされたコールドデータ) / スキャンされた総データ量。</p></td>
     <td><p>クラスタークエリのパフォーマンスを特定するために追跡します。</p></td>
     <td><p>Dedicated (Tiered-storage) / BYOC</p><p><em>&ast;このメトリクスは、Milvus 2.6.xと互換性のある階層型ストレージクラスターでのみ利用可能です。このメトリクスにアクセスするには、クラスターのMilvusバージョンをアップグレードするために<a href="http://support.zilliz.com">お問い合わせ</a>ください。</em></p></td>
   </tr>
</table>

### データ{#data}

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
     <td><p>クラスター内に作成されたcollectionの数。</p></td>
     <td><p>成長を監視し、必要に応じてプロジェクトごとの制限を適用します。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>Entity Count</p></td>
     <td><p>カウント</p></td>
     <td><p>単一のinsertとbulk insertの両方を含む、クラスターに挿入されたentityの総数。</p></td>
     <td><p>予期しない成長を調査し、ストレージとインデックス作成を計画します。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>Loaded Entities (Approx.)</p></td>
     <td><p>カウント</p></td>
     <td><p>ロードされた（アクティブにサービスされている）entityのおおよその数。</p></td>
     <td><p>より正確でリアルタイムな値については、collection概要ページの「Loaded Entities」値を参照するか、<a href="./single-vector-search">count(&ast;)</a>を使用してください。</p></td>
     <td><p>Dedicated / BYOC</p></td>
   </tr>
   <tr>
     <td><p>Number of Unloaded Collections</p></td>
     <td><p>カウント</p></td>
     <td><p>クラスター内のアンロードされたcollectionの数。</p></td>
     <td><p>重要なcollectionをロードし、メモリの余裕を確認します。</p></td>
     <td><p>Dedicated (Enterprise または Business Critical) / BYOC</p></td>
   </tr>
</table>

## 関連トピック{#related-topics}

- [クラスターメトリクスチャートの表示](./view-cluster-metric-charts)

- [組織アラートの管理](./manage-organization-alerts)

- [プロジェクトアラートの管理](./manage-project-alerts)

