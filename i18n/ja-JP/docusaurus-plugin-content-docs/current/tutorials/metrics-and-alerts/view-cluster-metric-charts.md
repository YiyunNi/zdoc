---
title: "メトリクスチャートの表示 | Cloud"
slug: /view-cluster-metric-charts
sidebar_key: view-cluster-metric-charts
sidebar_label: "メトリクスチャートを表示"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、クラスタレベルとコレクションレベルの両方でメトリクスを監視するためのダッシュボードを提供しています。メトリクスチャートでは、特定の時間範囲内のリソース使用量、1秒あたりのクエリ数（QPS）、レイテンシ、およびデータ操作に関するパフォーマンスデータを確認できます。"
type: origin
token: DbPIw4jLOiEabCk5uptc6EZ1nbf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - メトリクス
  - アラート
  - 表示

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# メトリクスチャートの表示

Zilliz Cloud では、クラスターとコレクションの両方のレベルでメトリクスを監視するためのダッシュボードを提供しています。メトリクスチャートは、特定の時間範囲内でのリソース使用量、1秒あたりのクエリ数（QPS）、レイテンシ、およびデータ操作に関するパフォーマンスデータを提供します。

## クラスターメトリクスの表示\{#view-cluster-metrics}

クラスター全体のメトリクスを表示するには、[Zilliz Cloud コンソール](https://cloud.zilliz.com/login) でクラスターに移動し、**Metrics** タブを選択します。

Zilliz Cloud のメトリクスチャートは、リソース使用量、1秒あたりのクエリ数（QPS）、リクエスト結果、およびデータ操作に関するパフォーマンスデータを提供し、特定の時間範囲内での詳細な分析を可能にします。

<Admonition type="info" icon="📘" title="Notes">

フリークラスターでは、読み取りおよび書き込み vCU のみが利用可能です。さまざまな高度なメトリクスを利用するには、[プランのティアをアップグレード](./manage-cluster#upgrade-deployment-option) してください。

</Admonition>

<Supademo id="cmn429im00fjyz3qmh6bt98w5" title=""  />

クラスターメトリクスチャートは、以下のグループに分類されています：

### リソース\{#resources}

これらのチャートは、CU計算、CU容量、およびストレージを含むクラスターのリソース使用量を示します。リソースメトリクスの完全なリストについては、[メトリクスリファレンス](./metrics-alerts-reference#resources) を参照してください。

### パフォーマンス\{#performance}

これらのチャートは、QPS、レイテンシ、リクエスト失敗率、およびスループットを含むクラスターのパフォーマンスを示します。パフォーマンスメトリクスの完全なリストについては、[メトリクスリファレンス](./metrics-alerts-reference#performance) を参照してください。

### データ\{#data}

これらのチャートは、コレクション数、エンティティ数、およびロード済みエンティティ数を含むクラスターのデータステータスを示します。データメトリクスの完全なリストについては、[メトリクスリファレンス](./metrics-alerts-reference#data) を参照してください。

右側の **View Alerts Settings** をクリックすると、**アラート設定** ページにリダイレクトされ、アラートを管理するためのショートカットが提供されます。

## コレクションメトリクスの表示\{#view-collection-metrics}

クラスターメトリクスの一部は、**コレクションレベル** でも利用可能であり、個別のコレクションのパフォーマンス問題を特定し、容量を計画するのに役立ちます。

コレクションレベルのメトリクスを表示するには、[Zilliz Cloud コンソール](https://cloud.zilliz.com/login) でコレクションに移動し、**Metrics** タブを選択します。

<Supademo id="cmn42p79v0gcpz3qmql1xx412" title=""  />

チャートのレイアウトと時間範囲のコントロールは、クラスターの **Metrics** タブと同じです。各チャートは、クラスター全体ではなく選択されたコレクションにスコープされた同じメトリクス定義を表示します。

## カーブウィンドウサイズの変更\{#modify-curve-window-size}

**Metrics** タブでは、2種類のウィンドウサイズを使用できます。

- **相対範囲**: 現在時刻からの相対的な事前定義された時間帯から選択します。相対時間範囲を使用すると、特定の開始時刻と終了時刻を入力する必要なく、定期的かつ便利にメトリクスを確認できます。選択肢には以下が含まれます：

    - 過去10分間

    - 過去1時間

    - 過去6時間

    - 過去12時間

    - 過去1日間

    - 過去1週間

    - 過去1か月間

- **絶対範囲**: 正確な開始時刻と終了時刻を入力します。絶対範囲を使用すると、表示するメトリクスをより細かく制御できます。

    - 開始時刻と終了時刻の時間差は10分以上である必要があります。

## 関連トピック\{#related-topics}

- [組織アラートの管理](./manage-organization-alerts)

- [プロジェクトアラートの管理](./manage-project-alerts)

- [メトリクスとアラートのリファレンス](./metrics-alerts-reference)

