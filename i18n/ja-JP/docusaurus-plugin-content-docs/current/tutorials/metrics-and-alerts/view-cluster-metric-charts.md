---
title: "クラスターメトリクスチャートの表示 | Cloud"
slug: /view-cluster-metric-charts
sidebar_label: "クラスターメトリクスチャートの表示"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、クラスター固有のメトリクスを観察するためのダッシュボードを提供します。この機能にアクセスするには、いずれかのクラスター内の [Metrics] タブに移動してください。| Cloud"
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


# クラスターメトリクスチャートの表示

Zilliz Cloud は、クラスター固有のメトリクスを観察するためのダッシュボードを提供します。この機能にアクセスするには、いずれかのクラスター内の **Metrics** タブに移動します。

<Admonition type="info" icon="📘" title="Notes">

<p>フリークラスターでは、読み取りおよび書き込み vCU のみ利用可能です。高度なメトリクスの範囲を解放するには、<a href="./manage-cluster#upgrade-deployment-option">プランティアをアップグレード</a>してください。</p>

</Admonition>

![view_metric_charts](https://zdoc-images.s3.us-west-2.amazonaws.com/view_metric_charts.png "view_metric_charts")

## クラスターメトリクスチャートへのアクセス\{#access-cluster-metric-charts}

[Zilliz Cloud コンソール](https://cloud.zilliz.com/login) で対象のクラスターを見つけ、**Metrics** タブを選択します。

Zilliz Cloud のメトリクスチャートは、リソース使用量、秒間クエリ数 (QPS)、リクエスト結果、データ操作に関するパフォーマンスデータを提供し、特定の時間範囲内で詳細な分析を可能にします。

<Admonition type="info" icon="📘" title="Notes">

<p>右側の <strong>View Alerts Settings</strong> をクリックすると、<strong>アラート設定</strong> ページにリダイレクトされ、アラートを管理するためのショートカットが提供されます。</p>

</Admonition>

各メトリクスチャートの詳細については、[メトリクスチャートの表示](./view-cluster-metric-charts#view-metric-charts) を参照してください。

## カーブウィンドウサイズの変更\{#modify-curve-window-size}

**Metrics** タブでは、2 種類のウィンドウサイズを利用できます。

- **相対範囲**: 現在の時刻からの相対的な事前定義された時間期間から選択します。相対時間範囲を使用することで、特定の開始時刻と終了時刻を入力することなく、定期的かつ便利な方法でメトリクスを確認できます。選択肢には以下が含まれます：

    - 過去 10 分

    - 過去 1 時間

    - 過去 6 時間

    - 過去 12 時間

    - 過去 1 日

    - 過去 1 週間

    - 過去 1 ヶ月

- **絶対範囲**: 正確な開始時刻と終了時刻を入力します。絶対範囲を使用することで、表示されるメトリクスをより細かく制御できます。

    - 開始時刻と終了時刻の時間差は 10 分より大きくなければなりません。

## メトリクスチャートの表示\{#view-metric-charts}

Zilliz Cloud は、さまざまな側面からクラスターのパフォーマンスを監視するためのメトリクスチャートを提供します。

### リソース\{#resources}

リソース使用量のメトリクスチャートを表示するには、**Metrics** タブを選択し、**リソース** エリアを参照してください。これらのチャートは、計算、容量、ストレージを含むクラスターのリソース使用量の概要を提供します。利用可能なメトリクスの概要については、[メトリクスとアラートのリファレンス](./metrics-alerts-reference#project-level-metrics-cluster-metrics) を参照してください。

### パフォーマンス\{#performance}

パフォーマンスのメトリクスチャートを表示するには、**Metrics** タブを選択し、**パフォーマンス** エリアを参照してください。これらのチャートは、QPS、VPS、レイテンシ、リクエストを含むクラスターのパフォーマンスの概要を提供します。利用可能なメトリクスの概要については、[メトリクスとアラートのリファレンス](./metrics-alerts-reference#project-level-metrics-cluster-metrics) を参照してください。

### データ\{#data}

ビジネスデータのメトリクスチャートを表示するには、**Metrics** タブを選択し、**データ** エリアを参照してください。これらのチャートは、クラスター内のコレクション数、エンティティ数、ロードされたエンティティ数を示すことで、クラスターのエンティティデータの概要を提供します。利用可能なメトリクスの概要については、[メトリクスとアラートのリファレンス](./metrics-alerts-reference#project-level-metrics-cluster-metrics) を参照してください。

## 関連トピック\{#related-topics}

- [組織アラートの管理](./manage-organization-alerts)

- [プロジェクトアラートの管理](./manage-project-alerts)

- [メトリクスとアラートのリファレンス](./metrics-alerts-reference)

