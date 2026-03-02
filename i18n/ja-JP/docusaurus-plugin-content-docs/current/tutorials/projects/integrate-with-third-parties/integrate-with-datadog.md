---
title: "Datadog との統合 | Cloud"
slug: /integrate-with-datadog
sidebar_label: "Datadog"
beta: FALSE
notebook: FALSE
description: "Datadog は、アプリケーションのパフォーマンス、インフラストラクチャ、ログ管理に関するリアルタイムの洞察を提供するクラウド監視および分析プラットフォームです。Zilliz Cloud を Datadog と統合することで、Zilliz Cloud クラスターに関するメトリックデータを Datadog ダッシュボードに送信できます。 | Cloud"
type: origin
token: JGFQwMcVmiikeOkhepGcQ8Ken0e
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - サードパーティ
  - サービス
  - datadog
  - llm-as-a-judge
  - ハイブリッドベクトル検索
  - 動画の重複排除
  - 動画類似性検索

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# Datadog との連携

[Datadog](https://www.datadoghq.com/) は、アプリケーションのパフォーマンス、インフラストラクチャ、ログ管理に関するリアルタイムの洞察を提供するクラウド監視および分析プラットフォームです。Zilliz Cloud と Datadog を統合することで、Zilliz Cloud クラスターに関するメトリックデータを Datadog ダッシュボードに送信できます。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Enterprise</strong> プロジェクトの <strong>Dedicated</strong> クラスターでのみ利用可能です。</p>

</Admonition>

## 開始する前に{#before-you-start}

- Datadog と連携するには、プロジェクトへの **Organization Owner** または **Project Admin** アクセス権が必要です。必要な権限がない場合は、Zilliz Cloud 管理者にお問い合わせください。

- Datadog アカウントと Datadog API キーが必要です。API キーへのアクセス方法については、[API およびアプリケーションキー](https://docs.datadoghq.com/account_management/api-app-keys/#application-keys) を参照してください。

## 手順{#procedure}

![integrate-with-datadog-1](https://zdoc-images.s3.us-west-2.amazonaws.com/integrate-with-datadog-1.png "integrate-with-datadog-1")

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) にログインします。

1. プロジェクトページの左側のナビゲーションペインで、**Integrations** をクリックします。

1. **Datadog** セクションを見つけ、その横にある **+ Configuration** をクリックします。

1. 表示されるダイアログボックスで、Datadog をプロジェクトにリンクし、メトリックデータを収集するクラスターを割り当てます。

    1. **Configure Datadog Integration** ステップで、Datadog 設定を構成します。

        1. **Configuration Name** に、統合の名前を入力します (例: `DG_configuration`)。

        1. **Datadog API Key** に、Datadog API キーを入力します。

        1. **Datadog Site** で、Datadog サイトを選択します。Zilliz Cloud は以下の Datadog サイトをサポートしています。

            <table>
               <tr>
                 <th><p>サイト</p></th>
                 <th><p>サイト URL</p></th>
                 <th><p>サイトパラメータ</p></th>
                 <th><p>場所</p></th>
               </tr>
               <tr>
                 <td><p><code>US1</code></p></td>
                 <td><p><code><i>http</i>s://app.datadoghq.com</code></p></td>
                 <td><p><code>datadoghq.com</code></p></td>
                 <td><p>米国</p></td>
               </tr>
               <tr>
                 <td><p><code>US3</code></p></td>
                 <td><p><code><i>http</i>s://us3.datadoghq.com</code></p></td>
                 <td><p><code>us3.datadoghq.com</code></p></td>
                 <td><p>米国</p></td>
               </tr>
               <tr>
                 <td><p><code>US5</code></p></td>
                 <td><p><code><i>http</i>s://us5.datadoghq.com</code></p></td>
                 <td><p><code>us5.datadoghq.com</code></p></td>
                 <td><p>米国</p></td>
               </tr>
               <tr>
                 <td><p><code>EU1</code></p></td>
                 <td><p><code><i>http</i>s://app.datadoghq.eu</code></p></td>
                 <td><p><code>datadoghq.eu</code></p></td>
                 <td><p>EU (ドイツ)</p></td>
               </tr>
               <tr>
                 <td><p><code>AP1</code></p></td>
                 <td><p><code><i>http</i>s://ap1.datadoghq.com</code></p></td>
                 <td><p><code>ap1.datadoghq.com</code></p></td>
                 <td><p>日本</p></td>
               </tr>
            </table>

            Datadog サイトの詳細については、[Datadog サイトへのアクセス](https://docs.datadoghq.com/getting_started/site/#access-the-datadog-site) を参照してください。

        1. **Test Integration** をクリックして、Zilliz Cloud と Datadog 間の接続を確認します。テストが成功したら、クラスターの割り当てに進みます。

    1. **Assign Configuration to Zilliz Cloud Cluster(s)** ステップで、メトリックデータが Datadog にプッシュされるクラスターを 1 つ以上選択します。

        <Admonition type="info" icon="📘" title="Notes">

        <p><strong>Dedicated-Enterprise</strong> プランティアのクラスターのみ選択できます。</p>

        </Admonition>

    1. **Create** をクリックします。

</Procedures>

## 統合の進捗状況を監視する{#monitor-integration-progress}

セットアップ後、**Integrations** ページに戻り、Datadog 統合が提供された構成詳細とともにリストされていることを確認します。ステータスが **Active** に変わったら、統合は成功です。Zilliz Cloud は、ほぼリアルタイムの更新を保証するために、分単位の頻度で Datadog にデータをプッシュします。

統合の横にある外部リンクアイコンをクリックすると、関連する Datadog ダッシュボードを開いて、選択した Zilliz Cloud クラスターからプッシュされたクラスターメトリックを表示できます。

![integrate-with-datadog-2](https://zdoc-images.s3.us-west-2.amazonaws.com/integrate-with-datadog-2.png "integrate-with-datadog-2")

## 統合を管理する{#manage-integrations}

Datadog 統合を管理するには、**Actions** 列を使用します。

- **Edit**: 必要に応じて、監視クラスターを更新したり、統合設定を変更したりします。

- **Remove**: 不要になった統合を削除します。

![integrate-with-datadog-3](https://zdoc-images.s3.us-west-2.amazonaws.com/integrate-with-datadog-3.png "integrate-with-datadog-3")

## Datadog で利用可能なパフォーマンスメトリック{#performance-metrics-available-to-datadog}

[Datadog](https://www.datadoghq.com/) は、Zilliz Cloud クラスターの以下のメトリックデータを追跡します。括弧内のメトリック名は、Datadog UI で使用される名前です。

### リソース{#resource}

<table>
   <tr>
     <th><p>メトリック名</p></th>
     <th><p>メトリックタイプ</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>CU Computation</p><p>(<code>zilliz.cluster.cu.computation.current</code>)</p></td>
     <td><p>ゲージ</p></td>
     <td><p>CU の総容量に対する使用容量の測定値。0 から 1 の範囲。</p></td>
   </tr>
   <tr>
     <td><p>CU Capacity</p><p>(<code>zilliz.cluster.cu.capacity.current</code>)</p></td>
     <td><p>ゲージ</p></td>
     <td><p>CU の総計算能力に対する利用された計算能力の測定値。0 から 1 の範囲。</p></td>
   </tr>
   <tr>
     <td><p>Storage</p><p>(<code>zilliz.cluster.storage.bytes.current</code>)</p></td>
     <td><p>ゲージ</p></td>
     <td><p>データとインデックスによって消費される永続ストレージの総量。</p></td>
   </tr>
</table>

### パフォーマンス{#performance}

<table>
   <tr>
     <th><p>メトリック名</p></th>
     <th><p>メトリックタイプ</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>Cluster Write Performance Capacity</p><p>(<code>zilliz.cluster.write.performance.capacity.current</code>)</p></td>
     <td><p>ゲージ</p></td>
     <td><p>書き込みレート制限に対する現在の書き込み操作レートの測定値。0 から 1 の範囲。</p></td>
   </tr>
   <tr>
     <td><p>Slow Query Count</p><p>(<code>zilliz.request.slow.queries.total</code>)</p></td>
     <td><p>カウント</p></td>
     <td><p>低速クエリリクエストの総数。</p></td>
   </tr>
   <tr>
     <td><p>QPS, Request Failure Rate, Number of Flush Operations</p><p>(<code>zilliz.requests.total</code>)</p></td>
     <td><p>カウント</p></td>
     <td><p>処理されたリクエストの総数。</p></td>
   </tr>
   <tr>
     <td><p>VPS</p><p>(<code>zilliz.request.vectors.total</code>)</p></td>
     <td><p>カウント</p></td>
     <td><p>すべてのリクエストで操作されたベクトルの総数。</p></td>
   </tr>
   <tr>
     <td><p>Latency</p><p>(<code>zilliz.request.latency.milliseconds.average</code>, <code>zilliz.request.latency.milliseconds.p99</code>)</p></td>
     <td><p>ゲージ</p></td>
     <td><p>処理されたリクエストの平均/P99 レイテンシ。</p></td>
   </tr>
</table>

### データ{#data}

<table>
   <tr>
     <th><p>メトリック名</p></th>
     <th><p>メトリックタイプ</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>Entity Count</p><p>(<code>zilliz.entities.current</code>)</p></td>
     <td><p>ゲージ</p></td>
     <td><p>エンティティの数。</p></td>
   </tr>
   <tr>
     <td><p>Loaded Entities</p><p>(<code>zilliz.loaded.entities.current</code>)</p></td>
     <td><p>ゲージ</p></td>
     <td><p>ロードされたエンティティの数。</p></td>
   </tr>
   <tr>
     <td><p>Collection Count</p><p>(<code>zilliz.collections.current</code>)</p></td>
     <td><p>ゲージ</p></td>
     <td><p>コレクションの数。</p></td>
   </tr>
   <tr>
     <td><p>Number of Unloaded Collections</p><p>(<code>zilliz.unloaded.collections.current</code>)</p></td>
     <td><p>ゲージ</p></td>
     <td><p>アンロードされたコレクションの数。</p></td>
   </tr>
</table>

## Datadog で利用可能なタグ{#tags-available-to-datadog}

Datadog は、リソースをよりよく理解し、整理し、識別するために、特定のメトリックに以下のタグを送信します。

<table>
   <tr>
     <th><p>タグ名</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>org_id</code></p></td>
     <td><p>メトリックに関連付けられた Zilliz Cloud 組織の ID。</p></td>
   </tr>
   <tr>
     <td><p><code>project_id</code></p></td>
     <td><p>メトリックに関連付けられた Zilliz Cloud プロジェクトの ID。</p></td>
   </tr>
   <tr>
     <td><p><code>cluster_id</code></p></td>
     <td><p>メトリックに関連付けられた Zilliz Cloud クラスターの ID。</p></td>
   </tr>
   <tr>
     <td><p><code>request_type</code></p></td>
     <td><p>監視されている操作のタイプ。可能な値: <code>insert</code>, <code>upsert</code>, <code>delete</code>, <code>bulk_insert</code>, <code>flush</code>, <code>search</code>, <code>query</code></p></td>
   </tr>
   <tr>
     <td><p><code>status</code></p></td>
     <td><p>操作の結果。可能な値: <code>success</code>, <code>fail</code></p></td>
   </tr>
</table>
