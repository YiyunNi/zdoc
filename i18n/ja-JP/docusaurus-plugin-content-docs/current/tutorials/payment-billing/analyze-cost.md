---
title: "コスト分析 | Cloud"
slug: /analyze-cost
sidebar_label: "コスト分析"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudの「使用状況」ページでは、視覚化されたコスト分析ツールが提供されており、Zilliz Cloudの使用状況と費用を複数の側面から確認・追跡できます。"
type: origin
token: LJplw7Q9Gi09GMkiy8PcbYp6nrg
sidebar_position: 8
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 請求書
  - 表示
  - ベクトルデータベースの仕組み
  - ベクトルDB比較
  - openai ベクトルDB
  - 自然言語処理データベース

---

import Admonition from '@theme/Admonition';


# コスト分析

Zilliz Cloudの**Usage**ページは、Zilliz Cloudの使用状況と費用を多角的に表示および追跡できる視覚化されたコスト分析ツールを提供します。

## 前提条件{#prerequisites}

Zilliz CloudのUsageページからコストにアクセスして分析するには、**Organization Owner**または**Billing Admin**の権限が必要です。

## 手順{#procedures}

Zilliz Cloudでコストを分析する方法は2つあります。

- [Web UI経由](./analyze-cost#via-web-ui): コストの傾向を視覚化する必要がある場合は、Web UIを使用することをお勧めします。Web UIの使用状況の詳細は、**小数点以下10桁**に丸められます。

- [RESTful API経由](./analyze-cost#via-restful-api): 日々の使用状況についてより詳細な洞察が必要な場合は、RESTful APIを使用することをお勧めします。RESTful APIから取得される使用状況の詳細は、**小数点以下10桁**まで正確です。

### Web UI経由{#via-web-ui}

**Billing**ページで、**Usage**タブに切り替えます。さまざまな側面から使用状況とコストの傾向を監視できます。

<Admonition type="info" icon="📘" title="Notes">

<p>使用状況データは1時間ごとに更新されます。</p>

</Admonition>

![analyze_cost](https://zdoc-images.s3.us-west-2.amazonaws.com/analyze_cost.png "analyze_cost")

- **プロジェクト別**

    異なるビジネスや部門向けに複数のプロジェクトを作成している場合、特定のプロジェクトの使用状況とコストをフィルタリングして表示できます。

    たとえば、Default Project（R&D部門向け）とProject_01（マーケティング部門向け）の2つのプロジェクトを作成している場合、プロジェクトフィルターでDefault Projectを選択して、過去1か月間のR&D部門の使用状況とコストを分析できます。

    Usage Amount棒グラフは日々の使用状況の変化を視覚的に表し、Usage Amount Detailsテーブルはデータを表形式で提供します。

- **クラスター別**

    ビジネスに基づいて複数の異なるクラスターを作成している場合、クラスターに応じて特定のクラスターの使用状況とコストをフィルタリングして表示できます。

    たとえば、ユーザー情報と注文情報用に2つの異なるクラスターを作成している場合、注文情報を保存しているクラスターの使用状況とコストを確認する必要があるときは、フィルターで対応するクラスターを選択できます。

- **期間別**

    特定の期間の使用状況とコストの傾向を確認するには、フィルターで期間を選択します。

    デフォルトの期間は1か月で、最大2か月間です。

    たとえば、2024年8月の日々の使用状況と費用を分析するには、日付フィルターで2024年8月1日から2024年8月31日までを選択します。Usage Amount棒グラフは、選択した期間の日々のコスト傾向を表示します。

- **コストタイプ別**

    特定のコストタイプについて使用状況とコストの傾向を調べるには、フィルターで目的の請求項目を選択します。

    利用可能なコストタイプには、CU Costs、Write Costs、Read Costs、Storage Costs (Serverless)、Storage Costs (Dedicated)、Backup Costs、およびPipelines Costsが含まれます。

    たとえば、過去1か月間のすべてのプロジェクトにおける合計バックアップコストを分析するには、コストタイプフィルターでBackup Costsを選択します。Usage Amount棒グラフは、選択した期間の合計日次バックアップコストを表示します。

- **クラウドリージョン別**

    複数のクラウドリージョンにサービスをデプロイしている場合、クラウドリージョンでフィルタリングして、リージョン固有の使用状況とコストを表示できます。

    たとえば、AWS us-east-1 (Virginia)とGCP europe-west3 (Frankfurt)の両方にクラスターをデプロイしている場合、AWS us-east-1 (Virginia)リージョンの使用状況とコストをフィルタリングして表示できます。

分析のニーズに基づいて複数のフィルターを組み合わせて、視覚化された使用状況とコストデータを表示できます。たとえば、プロジェクト、期間、コストタイプ、およびリージョンでフィルタリングして、使用状況の傾向とコストを包括的に理解できます。

### RESTful API経由{#via-restful-api}

<Admonition type="info" icon="📘" title="Notes">

<p>Query Daily Usage RESTful APIは現在パブリックプレビュー中です。このAPIを使用するには、<a href="http://support.zilliz.com">お問い合わせください</a>。</p>

</Admonition>

[Query Daily Usage](/reference/restful/query-daily-usage-v2) APIを使用して、組織の日々の使用状況を照会することもできます。このRESTful APIから取得する使用状況の詳細は、小数点以下8桁まで正確です。日々のコストがどのように累積され、小数点以下2桁に丸められるかを理解する必要がある場合は、RESTful APIを使用することをお勧めします。日々の使用状況を合計することで、小数点以下8桁まで正確な合計使用量が得られます。次に、この合計使用量を小数点以下2桁に丸めます（例：&#36;60.56724390は&#36;60.57に丸められます）。最終的な合計使用量は、請求書に表示される数値と一致する必要があります。

次の例は、組織の日々の使用状況を照会する方法を示しています。

```bash
curl --request POST \
--url "https://api.cloud.zilliz.com/v2/usage/query" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "start": "2024-01-01",
    "end": "2024-02-01"
}'
```

上記のコマンドでは、

- `start`: クエリ期間の開始時刻を`YYYY-MM-DD`形式で指定します。

- `end`: クエリ期間の終了時刻を`YYYY-MM-DD`形式で指定します。

## FAQ{#faq}

**Zilliz Cloudの利用状況詳細に表示される金額の精度はどのくらいですか？**

Zilliz Cloudは、**小数点以下10桁**の精度で料金を計算し、すべての請求はこの精度で計算されます。日次料金はまず小数点以下10桁で計算され、その後、請求処理中に合計され、小数点以下10桁に丸められます。

- **RESTful API**: すべての数値（例：単価、使用量、使用金額）は常に小数点以下10桁で返されます。値が小数点以下10桁未満の場合、10桁になるように末尾にゼロが埋められます。RESTful APIの使用方法の詳細については、[Query Daily Usage](/reference/restful/query-daily-usage-v2)を参照してください。

- **Web Console UI**: 表示される金額はAPIの値と一致しますが、読みやすさのために末尾のゼロは省略されます。たとえば、`0.1234000000`はUIでは`0.1234`と表示されます。

