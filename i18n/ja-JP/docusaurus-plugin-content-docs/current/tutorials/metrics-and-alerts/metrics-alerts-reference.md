---
title: "メトリクスリファレンス | Cloud"
slug: /metrics-alerts-reference
sidebar_label: "メトリクスリファレンス"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、メトリクスを組織レベルとプロジェクトレベルの 2 つに分類しています。"
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

Zilliz Cloud は、メトリクスを**組織**レベルと**プロジェクト**レベルの 2 つに分類します。

- **組織レベルのメトリクス**: すべてのプロジェクトにわたるアカウント全体のステータス（例：ライセンスクレジット、使用量）を反映します。

- **プロジェクトレベルのメトリクス**: 単一プロジェクト内のクラスターリソース、容量、パフォーマンス、およびデータを反映します。

<Admonition type="info" icon="📘" title="Notes">

<p>ほとんどのメトリクスはアラートをサポートしています。アラートは、時間ウィンドウ内で条件（演算子 + しきい値）に対してメトリクスを評価し、条件が満たされた場合に通知します。設定については、<a href="./manage-organization-alerts">組織アラートの管理</a>および<a href="./manage-project-alerts">プロジェクトアラートの管理</a>をご参照ください。</p>

</Admonition>

## 組織レベルのメトリクス\{#organization-level-metrics}

組織レベルのメトリクスは、組織内のすべてのプロジェクトにわたる請求関連の問題を追跡するのに役立ちます。

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>単位</p></th>
     <th><p>説明</p></th>
     <th><p>推奨アクション</p></th>
   </tr>
   <tr>
     <td><p>過去 1 日の使用量</p></td>
     <td><p>$</p></td>
     <td><p>過去 1 日間の累積使用料金。</p></td>
     <td><p>予算と比較して監視し、必要に応じて使用量を最適化するか予算を調整してください。</p></td>
   </tr>
   <tr>
     <td><p>クレジットの有効期限</p></td>
     <td><p>日</p></td>
     <td><p>無料クレジットの有効期限が切れるまでの残り日数。</p></td>
     <td><p>有効期限が切れる前にクレジットを使用または延長してください。</p></td>
   </tr>
   <tr>
     <td><p>残高クレジット</p></td>
     <td><p>$</p></td>
     <td><p>無料クレジットの残高。</p></td>
     <td><p>アカウント機能を維持するために、残量が少なくなったらチャージしてください。</p></td>
   </tr>
   <tr>
     <td><p>クレジットカードの有効期限</p></td>
     <td><p>日</p></td>
     <td><p>保存されたカードの有効期限が切れるまでの日数。</p></td>
     <td><p>支払い失敗を防ぐために、有効期限が切れる前にカードを更新または交換してください。</p></td>
   </tr>
   <tr>
     <td><p>前払い残高</p></td>
     <td><p>$</p></td>
     <td><p>残っている前払い資金。</p></td>
     <td><p>サービス中断を防ぐために、残量が少なくなったら資金を追加してください。</p></td>
   </tr>
</table>

## プロジェクトレベルのメトリクス（クラスターメトリクス）\{#project-level-metrics-cluster-metrics}

これらのメトリクスは、プロジェクトのクラスター内でのリソース使用状況とパフォーマンスを記述します。

<Admonition type="info" icon="📘" title="Notes">

<p>このセクションでは、<strong>可用性</strong>はプロジェクトプランおよびデプロイメントオプションを指します。プランの詳細な比較については、<a href="./select-zilliz-cloud-service-plans">詳細なプラン比較</a>をご参照ください。</p>

</Admonition>

### リソース\{#resources}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>単位</p></th>
     <th><p>説明</p></th>
     <th><p>推奨アクション</p></th>
     <th><p>可用性</p></th>
   </tr>
   <tr>
     <td><p>読み取り vCU</p></td>
     <td><p>カウント</p></td>
     <td><p>検索およびクエリ操作の vCU 消費量の指標です。</p><p>注：このメトリクスはアラートをサポートしていません。</p></td>
     <td><p>読み取りコスト/スループットを理解するために傾向を監視してください。</p></td>
     <td><p>Free / Serverless</p></td>
   </tr>
   <tr>
     <td><p>書き込み vCU</p></td>
     <td><p>カウント</p></td>
     <td><p>挿入、削除、およびアップサート操作の vCU 消費量の指標です。</p><p>注：このメトリクスはアラートをサポートしていません。</p></td>
     <td><p>書き込みコスト/スループットを理解するために傾向を監視してください。</p></td>
     <td><p>Free / Serverless</p></td>
   </tr>
   <tr>
     <td><p>クエリ CU計算</p></td>
     <td><p>%</p></td>
     <td><p>CU の総計算容量に対する利用された計算力の指標です。</p></td>
     <td><blockquote>  <p>60%: <a href="./manage-replica">レプリカのスケーリングアウト</a> を推奨します</p></blockquote></td>
     <td><p>Dedicated / BYOC</p></td>
   </tr>
   <tr>
     <td><p>クエリ CU容量</p></td>
     <td><p>%</p></td>
     <td><p>CU の総容量に対する使用容量の指標です。</p></td>
     <td><blockquote>  <p>80%: <a href="./scale-query-cu">クエリ CU のスケールアップ</a> を推奨します</p></blockquote></td>
     <td><p>Dedicated / BYOC</p></td>
   </tr>
   <tr>
     <td><p>合計クエリ CU</p></td>
     <td><p>カウント</p></td>
     <td><p>現在のクラスター内の合計クエリ CU です。これは、クラスターのクエリ CU 数とレプリカ数の積として計算されます。（例：クラスターに 2 つのクエリ CU と 2 つのレプリカがある場合、ここに表示される合計クエリ CU は 4 です。）</p></td>
     <td><p>クエリ CU のスケーリングイベントを特定するために追跡してください。</p></td>
     <td><p>Dedicated / BYOC</p></td>
   </tr>
   <tr>
     <td><p>レプリカ</p></td>
     <td><p>カウント</p></td>
     <td><p>クラスターレプリカの数。</p></td>
     <td><p>レプリカのスケーリングイベントを特定するために追跡してください。</p></td>
     <td><p>Dedicated / BYOC</p></td>
   </tr>
   <tr>
     <td><p>ストレージ</p></td>
     <td><p>GB</p></td>
     <td><p>データとインデックスによって消費される永続ストレージの総量。</p></td>
     <td><p>ストレージ使用状況を監視するために<a href="./manage-project-alerts">アラートを構成</a>してください。</p></td>
     <td><p>すべて</p></td>
   </tr>
</table>

### パフォーマンス\{#performance}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>単位</p></th>
     <th><p>説明</p></th>
     <th><p>推奨アクション</p></th>
     <th><p>可用性</p></th>
   </tr>
   <tr>
     <td><p>QPS (Read)</p></td>
     <td><p>-</p></td>
     <td><p>1 秒あたりの読み取りリクエスト（検索およびクエリ）の数。</p></td>
     <td><p>システムパフォーマンスの監視については、<a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a>をご参照ください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>QPS (Write)</p></td>
     <td><p>-</p></td>
     <td><p>1 秒あたりの書き込みリクエスト（挿入、一括挿入、アップサート、および削除）の数。</p></td>
     <td><p>システムパフォーマンスの監視については、<a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a>をご参照ください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>Search NQ per Second</p></td>
     <td><p>-</p></td>
     <td><p>各検索リクエストが 1 秒間に運ぶクエリベクトルの数。</p></td>
     <td><p>システムパフォーマンスの監視については、<a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a>をご参照ください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>書き込みスループット (Entities/sec)</p></td>
     <td><p>-</p></td>
     <td><p>すべての書き込み操作（挿入、アップサート、一括挿入、および削除）において、1 秒間に書き込まれるエンティティ数を測定します。</p></td>
     <td><p>システムパフォーマンスの監視については、<a href="https://zilliz.com/vector-database-benchmark-tool">ベンチマーク</a>をご参照ください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>レイテンシ (Read)</p></td>
     <td><p>ms</p></td>
     <td><p>クライアントがサーバーに読み取りリクエスト（検索およびクエリリクエスト）を送信してから、クライアントが応答を受信するまでの経過時間です。平均レイテンシと P99 レイテンシが含まれます。</p></td>
     <td><p>-</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>レイテンシ (Write)</p></td>
     <td><p>ms</p></td>
     <td><p>クライアントがサーバーに書き込みリクエスト（挿入およびアップサートリクエスト）を送信してから、クライアントが応答を受信するまでの経過時間です。平均レイテンシと P99 レイテンシが含まれます。</p></td>
     <td><p>-</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>リクエスト失敗率 (Read)</p></td>
     <td><p>%</p></td>
     <td><p>1 秒あたりの全リクエストにおける失敗した読み取りリクエストの割合。</p></td>
     <td><p>読み取りリクエストの失敗率を監視するために<a href="./manage-project-alerts">アラートを構成</a>してください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>リクエスト失敗率 (Write)</p></td>
     <td><p>%</p></td>
     <td><p>1 秒あたりの全リクエストにおける失敗した書き込みリクエストの割合。</p></td>
     <td><p>書き込みリクエストの失敗率を監視するために<a href="./manage-project-alerts">アラートを構成</a>してください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>低速クエリ数</p></td>
     <td><p>カウント/分</p></td>
     <td><p>実行に異常に長い時間がかかるクエリの数。</p></td>
     <td><p>問題のあるクエリを特定し、必要に応じてクラスター構成を調整してパフォーマンスをチューニングしてください。</p></td>
     <td><p>Dedicated (Enterprise または ビジネスクリティカル) / BYOC</p></td>
   </tr>
   <tr>
     <td><p>クラスター書き込みパフォーマンス容量</p></td>
     <td><p>%</p></td>
     <td><p>クラスター書き込みパフォーマンス容量 = 現在の書き込み操作レート/書き込みレート制限。80% を超えた場合は、書き込み操作（挿入およびアップサート）のレートを低下させることを推奨します。</p></td>
     <td><p>現在のレートが高すぎる場合（80% を超えることが推奨されます）、書き込みレートを下げることを推奨します。</p></td>
     <td><p>Dedicated (Enterprise または ビジネスクリティカル) / BYOC</p></td>
   </tr>
   <tr>
     <td><p>フラッシュ操作数</p></td>
     <td><p>カウント/分</p></td>
     <td><p>クラスター上のフラッシュ操作の数。</p></td>
     <td><p>フラッシュ操作を頻繁に行うと、クラスター全体のパフォーマンスに悪影響を与える可能性があります。詳細については、<a href="https://docs.cloud-uat3.zilliz.com/docs/limits#flush">Zilliz Cloud の制限</a>をご参照ください。</p></td>
     <td><p>Dedicated (Enterprise または ビジネスクリティカル) / BYOC</p></td>
   </tr>
   <tr>
     <td><p>キャッシュヒット率</p></td>
     <td><p>%</p></td>
     <td><p>クラスター内のすべてのクエリの平均キャッシュヒット率で、次のように計算されます：クエリごとのキャッシュヒット率 = (スキャンされた総データ − スキャンされたコールドデータ) / スキャンされた総データ。</p></td>
     <td><p>クラスターのクエリパフォーマンスを特定するために追跡してください。</p></td>
     <td><p>Dedicated (Tiered-storage) / BYOC</p><p><em>&ast;このメトリクスは、Milvus 2.6.x と互換性のあるティアードストレージクラスターでのみ利用可能です。このメトリクスにアクセスするには、クラスターの Milvus バージョンをアップグレードするため<a href="http://support.zilliz.com">お問い合わせ</a>ください。</em></p></td>
   </tr>
</table>

### データ\{#data}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>単位</p></th>
     <th><p>説明</p></th>
     <th><p>推奨アクション</p></th>
     <th><p>可用性</p></th>
   </tr>
   <tr>
     <td><p>コレクション数</p></td>
     <td><p>カウント</p></td>
     <td><p>クラスター内に作成されたコレクションの数。</p></td>
     <td><p>成長を監視し、必要に応じてプロジェクトごとの制限を適用してください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>エンティティ数</p></td>
     <td><p>カウント</p></td>
     <td><p>単一挿入と一括挿入の両方を含む、クラスターに挿入されたエンティティの総数。</p></td>
     <td><p>予期せぬ成長を調査し、ストレージとインデックスを計画してください。</p></td>
     <td><p>すべて</p></td>
   </tr>
   <tr>
     <td><p>ロードされたエンティティ (Approx.)</p></td>
     <td><p>カウント</p></td>
     <td><p>ロードされた（アクティブに提供されている）エンティティの概数。</p></td>
     <td><p>より正確でリアルタイムな値については、コレクション概要ページの「ロードされたエンティティ」値を参照するか、<a href="./single-vector-search">count(&ast;)</a> を使用してください。</p></td>
     <td><p>Dedicated / BYOC</p></td>
   </tr>
   <tr>
     <td><p>アンロードされたコレクション数</p></td>
     <td><p>カウント</p></td>
     <td><p>クラスター内のアンロードされたコレクションの数。</p></td>
     <td><p>重要なコレクションをロードし、メモリの余裕を確認してください。</p></td>
     <td><p>Dedicated (Enterprise または ビジネスクリティカル) / BYOC</p></td>
   </tr>
</table>

### その他\{#others}

<table>
   <tr>
     <th><p>メトリクス</p></th>
     <th><p>単位</p></th>
     <th><p>説明</p></th>
     <th><p>推奨アクション</p></th>
     <th><p>可用性</p></th>
   </tr>
   <tr>
     <td><p>クラスターが 異常</p></td>
     <td><p>N/A</p></td>
     <td><p>対象クラスターのステータスが異常な場合。</p></td>
     <td><p>クラスターのステータスを調査し、それに応じて対策を講じてください。</p></td>
     <td><p>Dedicated (Enterprise または ビジネスクリティカル) / BYOC</p></td>
   </tr>
   <tr>
     <td><p>CMEK が利用不可</p></td>
     <td><p>N/A</p></td>
     <td><p>Zilliz Cloud に追加された KMS キーのいずれかが利用できなくなった場合。</p></td>
     <td><p>報告されたキーがまだ利用可能かどうかを判断するために、KMS キーを確認してください。</p></td>
     <td><p>Dedicated (Enterprise または ビジネスクリティカル) / BYOC</p></td>
   </tr>
   <tr>
     <td><p>クラスターへの書き込みが無効</p></td>
     <td><p>N/A</p></td>
     <td><p>エラーまたは保護メカニズムにより、対象クラスターへの書き込みが無効になった場合。</p></td>
     <td><p>クラスターのステータス、最近の構成またはメンテナンス操作、および関連するアラートを確認し、根本原因を解決して書き込み機能を復元してください。</p></td>
     <td><p>Dedicated (Enterprise または ビジネスクリティカル) / BYOC</p></td>
   </tr>
</table>

## 関連トピック\{#related-topics}

- [クラスターメトリクスチャートの表示](./view-cluster-metric-charts)

- [組織アラートの管理](./manage-organization-alerts)

- [プロジェクトアラートの管理](./manage-project-alerts)

