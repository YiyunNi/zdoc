---
title: "VectorDBBench を使ったパフォーマンスベンチマーク | Cloud"
slug: /perf-benchmark-vectordb
sidebar_key: perf-benchmark-vectordb
sidebar_label: "VectorDBBench を使用"
beta: FALSE
notebook: FALSE
description: "VectorDBBench は、ベクトルデータベース専用に設計されたオープンソースのベンチマークツールです。"
type: origin
token: Za3QwAcfjiSSvxk8UzUcTPmfnmb
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - milvus
  - パフォーマンス
  - ベンチマーク

---

import Admonition from '@theme/Admonition';


import Grid from '@site/src/components/Grid';

# VectorDBBench を使用したパフォーマンスベンチマーク

[VectorDBBench](https://github.com/zilliztech/VectorDBBench) は、ベクトルデータベース専用に設計されたオープンソースのベンチマークツールです。

このトピックでは、VectorDBBench を使用して Zilliz Cloud のパフォーマンステスト結果を再現する方法を紹介します。

## 概要\{#overview}

VectorDBBench は、主流のベクトルデータベースおよびクラウドサービスのベンチマーク結果を提供するだけでなく、究極のパフォーマンスとコスト効率性を比較するためのツールでもあります。

VectorDBBench は直感的なビジュアルインターフェースを提供します。これにより、ユーザーは簡単にベンチマークを開始できるだけでなく、比較結果レポートを表示して、ベンチマーク結果を簡単に再現することもできます。

実際の本番環境を忠実に模倣するために、VectorDBBench は挿入、検索、フィルタリング検索など、多様なテストシナリオを設定しています。信頼性の高いデータを提供するために、VectorDBBench には [SIFT](http://corpus-texmex.irisa.fr/)、[GIST](http://corpus-texmex.irisa.fr/)、[Cohere](https://huggingface.co/datasets/Cohere/wikipedia-22-12/tree/main/en)、およびオープンソースの [raw dataset](https://huggingface.co/datasets/allenai/c4) から OpenAI が生成したデータセットなど、実際の本番シナリオからの公開データセットも含まれています。

## ベンチマーク指標\{#benchmark-metrics}

<table>
   <tr>
     <th><p><strong>指標</strong></p></th>
     <th><p><strong>説明</strong></p></th>
     <th><p><strong>テストシナリオ</strong></p></th>
   </tr>
   <tr>
     <td><p>Max_load_count</p></td>
     <td><p>ベクトルデータベースの容量。VectorDBBench は、ベクトルデータベースにベクトルデータを挿入し続け、データベースが失敗するか、挿入リクエストを10回以上拒否するまで、挿入されたエンティティの最大数を記録します。</p><p>Max_load_count の値が高いほど、ベクトルデータベースのパフォーマンスが優れています。</p></td>
     <td><p>挿入</p></td>
   </tr>
   <tr>
     <td><p>QPS</p></td>
     <td><p>ベクトルデータベースが1秒あたりに同時クエリを処理する能力。VectorDBBench は複数回の top-100 検索を使用し、最も高い QPS 値を最終結果として選択します。</p><p>QPS の値が高いほど、ベクトルデータベースのパフォーマンスが優れています。</p></td>
     <td><p>検索 & フィルタリング検索</p></td>
   </tr>
   <tr>
     <td><p>Recall</p></td>
     <td><p>検索結果を ground truth と比較することで検索精度を測定します。</p><p>Recall の値が高いほど、ベクトルデータベースのパフォーマンスが優れています。</p></td>
     <td><p>検索 & フィルタリング検索</p></td>
   </tr>
   <tr>
     <td><p>Load_duration</p></td>
     <td><p>Zilliz Cloud がエンティティの挿入とインデックスの構築を完了するまでにかかる時間。</p><p>Load_duration の値が低いほど、ベクトルデータベースのパフォーマンスが優れています。</p></td>
     <td><p>検索 & フィルタリング検索</p></td>
   </tr>
   <tr>
     <td><p>Serial_latancy_p99</p></td>
     <td><p>99% のクエリが完了するまでにかかる時間。VectorDBBench は各 top-100 検索の検索レイテンシを記録し、99パーセンタイル平均を最終結果として使用します。</p><p>Serial_latancy_p99 の値が低いほど、ベクトルデータベースのパフォーマンスが優れています。</p></td>
     <td><p>検索 & フィルタリング検索</p></td>
   </tr>
</table>

## 前提条件\{#prerequisites}

- [Zilliz Cloud アカウントの登録](/docs/register-with-zilliz-cloud)が必要です。

- [少なくとも1つのクラスタを作成](/docs/create-cluster)してください。Zilliz Cloud は [無料](./free-trials)のクラスタを提供しており、すぐにオンボードして Zilliz Cloud ベクトルデータベースの探索を開始できます。

- Python 3.11 以降がインストールされている必要があります。

## 手順\{#procedures}

### テスト環境のセットアップ\{#set-up-testing-environment}

1. マシンをプロビジョニングします。

    Zilliz Cloud の究極のパフォーマンスをテストするために、8 vCPU 以上のクライアントマシンをプロビジョニングして、複数のスレッドを確保することをお勧めします。

1. ネットワークを構成します。

    ネットワーク通信はテスト結果に影響を与えます。特にクエリテストシナリオでは影響が大きくなります。ネットワークレイテンシの影響を軽減するために、以下をお勧めします。

    - クライアントを Zilliz Cloud クラスタと同じクラウドプロバイダーおよびリージョンにデプロイする。

    - クライアントが Zilliz Cloud クラスタと同じ VPC を共有するように構成する。パブリックインターネットと比較して、VPC はより低いレイテンシを実現できます。詳細については、[プライベートエンドポイントの設定](./setup-a-private-link) を参照してください。

### VectorDBBench のインストールと起動\{#install-and-start-vectordbbench}

```bash
# Install VectorDBBench
$ pip install vectordb-bench

# Start VectorDBBench
$ init_bench
```

以下は出力例です。出力にはローカルURLが表示されますので、これを使用してVectorDBBenchのWebユーザーインターフェースを開いてください。

```python

      👋 Welcome to Streamlit!

      If you’d like to receive helpful onboarding emails, news, offers, promotions,
      and the occasional swag, please enter your email address below. Otherwise,
      leave this field blank.

      Email:  
  You can find our privacy policy at https://streamlit.io/privacy-policy

  Summary:
  - This open source library collects usage statistics.
  - We cannot see and do not store information contained inside Streamlit apps,
    such as text, charts, images, etc.
  - Telemetry data is stored in servers in the United States.
  - If you'd like to opt out, add the following to ~/.streamlit/config.toml,
    creating that file if necessary:

    [browser]
    gatherUsageStats = false

  You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8501
  Network URL: http://172.16.20.46:8501
```

ホームページでは、VectorDBBench が提供する事前定義されたテストデータセットを確認し、クイックパフォーマンスベンチマークに使用できます。

Web ページの下部までスクロールし、**テストを実行 >** をクリックして独自のベンチマークテストを構成します。

![AATGbLxqwo32yexKYzPcdYVTnph](https://zdoc-images.s3.us-west-2.amazonaws.com/aatgblxqwo32yexkyzpcdyvtnph.png "AATGbLxqwo32yexKYzPcdYVTnph")

### ベンチマークテストの構成\{#configure-your-benchmarking-test}

### ベンチマーク結果の表示\{#view-benchmarking-results}

**結果** をクリックして、ベンチマーク結果を表示および分析します。以下は結果の例です。

![LWa7bJGzOo9qKJx0ZNicjLXjnJh](https://zdoc-images.s3.us-west-2.amazonaws.com/lwa7bjgzoo9qkjx0znicjlxjnjh.png "LWa7bJGzOo9qKJx0ZNicjLXjnJh")

![DJBibk5puoOLxYxxnH3chlxcnAd](https://zdoc-images.s3.us-west-2.amazonaws.com/djbibk5puoolxyxxnh3chlxcnad.png "DJBibk5puoOLxYxxnH3chlxcnAd")

オプションとして、左側のナビゲーションペインで **DBフィルター** と **ケースフィルター** を設定し、事前定義されたベクトルデータベースとケースのベンチマーク結果を比較できます。

<Admonition type="info" icon="📘" title="Notes">

データベースは [database_name]-[db_label] 形式で命名されています。

</Admonition>

<Grid columnSize="2" widthRatios="53,46">

    <div>

        ![ZBqQb11SEoYbYyxxtAYcKzv9nSc](https://zdoc-images.s3.us-west-2.amazonaws.com/zbqqb11seoybyyxxtayckzv9nsc.png "ZBqQb11SEoYbYyxxtAYcKzv9nSc")

    </div>

    <div>

        ![Wg3eb5C1AoEcRUxqO0Vcc4hSntd](https://zdoc-images.s3.us-west-2.amazonaws.com/wg3eb5c1aoecruxqo0vcc4hsntd.png "Wg3eb5C1AoEcRUxqO0Vcc4hSntd")

    </div>

</Grid>
