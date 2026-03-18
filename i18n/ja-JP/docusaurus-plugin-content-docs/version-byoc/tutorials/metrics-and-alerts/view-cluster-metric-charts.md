---
title: "クラスターメトリクスチャートの表示 | BYOC"
slug: /view-cluster-metric-charts
sidebar_label: "クラスターメトリクスチャートの表示"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、クラスター固有のメトリクスを観察するためのダッシュボードを提供しています。この機能にアクセスするには、いずれかのクラスター内の [Metrics] タブに移動してください。| BYOC"
type: origin
token: DbPIw4jLOiEabCk5uptc6EZ1nbf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - メトリクス
  - アラート
  - 表示

---

import Admonition from '@theme/Admonition';


# クラスターメトリクスチャートの表示

Zilliz Cloud は、クラスター固有のメトリクスを観察するためのダッシュボードを提供します。この機能にアクセスするには、いずれかのクラスター内の **Metrics** タブに移動します。

![view_metric_charts](https://zdoc-images.s3.us-west-2.amazonaws.com/view_metric_charts.png "view_metric_charts")

## クラスターメトリクスチャートへのアクセス\{#access-cluster-metric-charts}

[Zilliz Cloud コンソール](https://cloud.zilliz.com/login) で、対象のクラスターを見つけて **Metrics** タブを選択します。

Zilliz Cloud のメトリクスチャートは、リソース使用量、秒間クエリ数 (QPS)、リクエスト結果、データ操作に関するパフォーマンスデータを提供し、特定の時間範囲内できめ細かい分析を可能にします。

<Admonition type="info" icon="📘" title="Notes">

<p>右側の <strong>View Alerts Settings</strong> をクリックすると、<strong>アラート設定</strong> ページにリダイレクトされ、アラートを管理するためのショートカットが提供されます。</p>

</Admonition>

各メトリクスチャートの詳細については、[メトリクスチャートの表示](./view-cluster-metric-charts#view-metric-charts) を参照してください。

## カーブウィンドウサイズの変更\{#modify-curve-window-size}

**Metrics** タブでは、2 種類のウィンドウサイズを使用できます。

- **相対範囲**: 現在の時刻からの相対的な事前定義された期間から選択します。相対時間範囲を使用すると、特定の開始時刻と終了時刻を入力せずに、定期的かつ便利な方法でメトリクスを確認できます。選択肢は以下の通りです。

    - 過去 10 分

    - 過去 1 時間

    - 過去 6 時間

    - 過去 12 時間

    - 過去 1 日

    - 過去 1 週間

    - 過去 1 か月

- **絶対範囲**: 正確な開始時刻と終了時刻を入力します。絶対範囲を使用すると、表示されるメトリクスをより細かく制御できます。

    - 開始時刻と終了時刻の差は 10 分より大きくなければなりません。

## メトリクスチャートの表示\{#view-metric-charts}

Zilliz Cloud は、さまざまな側面からクラスターのパフォーマンスを監視するためのメトリクスチャートを提供します。

### Pod リソース\{#pod-resources}

Pod リソースの消費量を効果的に追跡するには、**Metrics** タブを選択し、**Pod リソース** エリアを参照してください。ここでは、各 Pod の CPU、ストレージ、ネットワークの使用状況を表示する簡潔なグラフが見つかります。利用可能なメトリクスの概要については、[メトリクスとアラートのリファレンス](./metrics-alerts-reference#project-level-metrics-cluster-metrics) を参照してください。

### リソース\{#resources}

リソース使用量のメトリクスチャートを表示するには、**Metrics** タブを選択し、**リソース** エリアを参照してください。これらのチャートは、計算、容量、ストレージを含むクラスターのリソース使用状況のスナップショットを提供します。利用可能なメトリクスの概要については、[メトリクスとアラートのリファレンス](./metrics-alerts-reference#project-level-metrics-cluster-metrics) を参照してください。

### パフォーマンス\{#performance}

パフォーマンスのメトリクスチャートを表示するには、**Metrics** タブを選択し、**パフォーマンス** エリアを参照してください。これらのチャートは、QPS、VPS、レイテンシ、リクエストを含むクラスターのパフォーマンスのスナップショットを提供します。利用可能なメトリクスの概要については、[メトリクスとアラートのリファレンス](./metrics-alerts-reference#project-level-metrics-cluster-metrics) を参照してください。

### データ\{#data}

ビジネスデータのメトリクスチャートを表示するには、**Metrics** タブを選択し、**データ** エリアを参照してください。これらのチャートは、クラスター内のコレクション数、エンティティ数、ロードされたエンティティ数を示すことで、クラスターのエンティティデータのスナップショットを提供します。利用可能なメトリクスの概要については、[メトリクスとアラートのリファレンス](./metrics-alerts-reference#project-level-metrics-cluster-metrics) を参照してください。

## 関連トピック\{#related-topics}

- [組織アラートの管理](./manage-organization-alerts)

- [プロジェクトアラートの管理](./manage-project-alerts)

- [メトリクスとアラートのリファレンス](./metrics-alerts-reference)

