---
title: "クラスターメトリックチャートの表示 | BYOC"
slug: /view-cluster-metric-charts
sidebar_label: "クラスターメトリックチャートの表示"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、クラスター固有のメトリックを監視するためのダッシュボードを提供します。この機能にアクセスするには、いずれかのクラスター内の「Metrics」タブに移動します。 | BYOC"
type: origin
token: DbPIw4jLOiEabCk5uptc6EZ1nbf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - メトリック
  - アラート
  - 表示
  - rag vector database
  - what is vector db
  - what are vector databases
  - vector databases comparison

---

import Admonition from '@theme/Admonition';


# クラスターメトリックチャートの表示

Zilliz Cloudは、クラスター固有のメトリックを監視するためのダッシュボードを提供します。この機能にアクセスするには、クラスターのいずれかにある**Metrics**タブに移動します。

![view_metric_charts](https://zdoc-images.s3.us-west-2.amazonaws.com/view_metric_charts.png "view_metric_charts")

## クラスターメトリックチャートへのアクセス{#access-cluster-metric-charts}

[Zilliz Cloudコンソール](https://cloud.zilliz.com/login)で、ターゲットクラスターを見つけて**Metrics**タブを選択します。

Zilliz Cloudのメトリックチャートは、リソース使用量、1秒あたりのクエリ数（QPS）、リクエスト結果、データ操作に関するパフォーマンスデータを提供し、特定の時間範囲内で詳細な分析を可能にします。

<Admonition type="info" icon="📘" title="Notes">

<p>右側の<strong>View Alerts Settings</strong>をクリックすると、<strong>Alert Settings</strong>ページにリダイレクトされ、アラートを管理するためのショートカットが提供されます。</p>

</Admonition>

各メトリックチャートの詳細については、[メトリックチャートの表示](./view-cluster-metric-charts#view-metric-charts)を参照してください。

## カーブウィンドウサイズの変更{#modify-curve-window-size}

**Metrics**タブでは、2種類のウィンドウサイズを設定できます。

- **相対範囲**: 現在時刻を基準とした、事前に定義された期間のセットから選択します。相対時間範囲を使用すると、特定の開始時刻と終了時刻を入力することなく、定期的かつ便利な方法でメトリックを確認できます。選択肢は次のとおりです。

    - 過去10分

    - 過去1時間

    - 過去6時間

    - 過去12時間

    - 過去1日

    - 過去1週間

    - 過去1ヶ月

- **絶対範囲**: 正確な開始時刻と終了時刻を入力します。絶対範囲を使用すると、表示されるメトリックをより細かく制御できます。

    - 開始時刻と終了時刻の差は10分以上である必要があります。

## メトリックチャートの表示{#view-metric-charts}

Zilliz Cloudは、さまざまな側面からクラスターのパフォーマンスを監視するためのメトリックチャートを提供します。

### Podリソース{#pod-resources}

Podリソースの消費量を効果的に追跡するには、**Metrics**タブを選択し、**Pod Resources**領域を参照してください。ここでは、各PodのCPU、ストレージ、ネットワーク使用量を表示する簡潔なグラフが見つかります。利用可能なメトリックの概要については、[Metrics & Alerts Reference](./metrics-alerts-reference#project-level-metrics-cluster-metrics)を参照してください。

### リソース{#resources}

リソース使用量のメトリックチャートを表示するには、**Metrics**タブを選択し、**Resources**領域を参照してください。これらのチャートは、計算、容量、ストレージを含むクラスターのリソース使用量のスナップショットを提供します。利用可能なメトリックの概要については、[Metrics & Alerts Reference](./metrics-alerts-reference#project-level-metrics-cluster-metrics)を参照してください。

### パフォーマンス{#performance}

パフォーマンスのメトリックチャートを表示するには、**Metrics**タブを選択し、**Performance**領域を参照してください。これらのチャートは、QPS、VPS、レイテンシ、リクエストを含むクラスターパフォーマンスのスナップショットを提供します。利用可能なメトリックの概要については、[Metrics & Alerts Reference](./metrics-alerts-reference#project-level-metrics-cluster-metrics)を参照してください。

### データ{#data}

ビジネスデータのメトリックチャートを表示するには、**Metrics**タブを選択し、**Data**領域を参照してください。これらのチャートは、クラスター内のcollection、entity、およびロードされたentityの数を示すことで、クラスターのentityデータのスナップショットを提供します。利用可能なメトリックの概要については、[Metrics & Alerts Reference](./metrics-alerts-reference#project-level-metrics-cluster-metrics)を参照してください。

## 関連トピック{#related-topics}

- [組織アラートの管理](./manage-organization-alerts)

- [プロジェクトアラートの管理](./manage-project-alerts)

- [メトリックとアラートのリファレンス](./metrics-alerts-reference)

