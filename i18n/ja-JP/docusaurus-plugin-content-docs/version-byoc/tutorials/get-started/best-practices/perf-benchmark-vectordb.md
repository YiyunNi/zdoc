---
title: "VectorDBBench を使用したパフォーマンスベンチマーク | BYOC"
slug: /perf-benchmark-vectordb
sidebar_label: "VectorDBBench を使用"
beta: FALSE
notebook: FALSE
description: "VectorDBBench は、ベクトルデータベース専用に設計されたオープンソースのベンチマークツールです。"
type: origin
token: Za3QwAcfjiSSvxk8UzUcTPmfnmb
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - milvus
  - パフォーマンス
  - ベンチマーク
  - RAG
  - NLP
  - ニューラルネットワーク
  - ディープラーニング

---

import Admonition from '@theme/Admonition';


import Grid from '@site/src/components/Grid';

# VectorDBBench を用いたパフォーマンスベンチマーク

[VectorDBBench](https://github.com/zilliztech/VectorDBBench) は、ベクトルデータベース専用に設計されたオープンソースのベンチマークツールです。

このトピックでは、VectorDBBench を使用して Zilliz Cloud のパフォーマンステスト結果を再現する方法について説明します。

## 概要{#overview}

VectorDBBench は、主要なベクトルデータベースとクラウドサービスのベンチマーク結果を提供するだけでなく、究極のパフォーマンスと費用対効果を比較するためのツールでもあります。

VectorDBBench は直感的なビジュアルインターフェースを提供します。これにより、ユーザーは簡単にベンチマークを開始できるだけでなく、比較結果レポートを表示し、ベンチマーク結果を簡単に再現できます。

VectorDBBench は、実際の運用環境を綿密に模倣し、挿入、検索、フィルタリングされた検索など、多様なテストシナリオを設定しています。信頼できるデータを提供するために、VectorDBBench は、[SIFT](http://corpus-texmex.irisa.fr/)、[GIST](http://corpus-texmex.irisa.fr/)、[Cohere](https://huggingface.co/datasets/Cohere/wikipedia-22-12/tree/main/en) などの実際の運用シナリオからの公開データセットや、オープンソースの [raw dataset](https://huggingface.co/datasets/allenai/c4) から OpenAI が生成したデータセットも含まれています。

## ベンチマークメトリクス{#benchmark-metrics}

<table>
   <tr>
     <th><p><strong>メトリクス</strong></p></th>
     <th><p><strong>説明</strong></p></th>
     <th><p><strong>テストシナリオ</strong></p></th>
   </tr>
   <tr>
     <td><p>Max_load_count</p></td>
     <td><p>ベクトルデータベースの容量。VectorDBBench は、データベースが失敗するか、挿入リクエストを 10 回以上拒否するまでベクトルデータをベクトルデータベースに挿入し続け、挿入されたエンティティの最大数を記録します。</p><p>Max_load_count の値が高いほど、ベクトルデータベースのパフォーマンスが優れていることを示します。</p></td>
     <td><p>挿入</p></td>
   </tr>
   <tr>
     <td><p>QPS</p></td>
     <td><p>ベクトルデータベースが 1 秒あたりに処理できる同時クエリの能力。VectorDBBench は、複数回トップ 100 検索を使用し、最高の QPS 値を最終結果として選択します。</p><p>QPS の値が高いほど、ベクトルデータベースのパフォーマンスが優れていることを示します。</p></td>
     <td><p>検索とフィルタリングされた検索</p></td>
   </tr>
   <tr>
     <td><p>Recall</p></td>
     <td><p>検索結果をグラウンドトゥルースと比較することによる検索精度の測定。</p><p>Recall の値が高いほど、ベクトルデータベースのパフォーマンスが優れていることを示します。</p></td>
     <td><p>検索とフィルタリングされた検索</p></td>
   </tr>
   <tr>
     <td><p>Load_duration</p></td>
     <td><p>Zilliz Cloud がエンティティの挿入とインデックスの構築プロセスを完了するのにかかる時間。</p><p>Load_duration の値が低いほど、ベクトルデータベースのパフォーマンスが優れていることを示します。</p></td>
     <td><p>検索とフィルタリングされた検索</p></td>
   </tr>
   <tr>
     <td><p>Serial_latancy_p99</p></td>
     <td><p>クエリの 99% が完了するのにかかる時間。VectorDBBench は、各トップ 100 検索の検索レイテンシを記録し、99 パーセンタイル平均を最終結果として使用します。</p><p>Serial_latancy_p99 の値が低いほど、ベクトルデータベースのパフォーマンスが優れていることを示します。</p></td>
     <td><p>検索とフィルタリングされた検索</p></td>
   </tr>
</table>

## 前提条件{#prerequisites}

- [Zilliz Cloud アカウントを登録済みであること](/docs/register-with-zilliz-cloud)。

- [少なくとも 1 つのクラスターを作成済みであること](/docs/create-cluster)。

- Python 3.11 以降がインストールされていること。

## 手順{#procedures}

### テスト環境のセットアップ{#set-up-testing-environment}

1. マシンをプロビジョニングします。

    Zilliz Cloud の究極のパフォーマンスをテストするには、複数のスレッドを確保するために、8 vCPU を超えるクライアントマシンをプロビジョニングすることをお勧めします。

1. ネットワークを設定します。

    ネットワーク通信はテスト結果に影響を与えます。特にクエリテストシナリオでは顕著です。ネットワークレイテンシの影響を軽減するために、次のことをお勧めします。

    - クライアントを Zilliz Cloud クラスターと同じクラウドプロバイダーおよびリージョンにデプロイします。

### VectorDBBench のインストールと起動{#install-and-start-vectordbbench}

```bash
# Install VectorDBBench
$ pip install vectordb-bench

# Start VectorDBBench
$ init_bench
```

以下は出力例です。出力にはローカルURLが含まれています。これを使用してVectorDBBenchのWebユーザーインターフェースを開いてください。

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

ホームページでは、VectorDBBenchが提供する事前定義されたテストデータセットを確認し、それらを使用して迅速なパフォーマンスベンチマークを行うことができます。

ウェブページを一番下までスクロールし、**Run Your Test >** をクリックして、独自のベンチマークテストを設定します。

![AATGbLxqwo32yexKYzPcdYVTnph](https://zdoc-images.s3.us-west-2.amazonaws.com/aatgblxqwo32yexkyzpcdyvtnph.png "AATGbLxqwo32yexKYzPcdYVTnph")

### ベンチマークテストの設定{#configure-your-benchmarking-test}

### ベンチマーク結果の表示{#view-benchmarking-results}

**Results** をクリックして、ベンチマーク結果を表示および分析します。以下にいくつかの結果例を示します。

![LWa7bJGzOo9qKJx0ZNicjLXjnJh](https://zdoc-images.s3.us-west-2.amazonaws.com/lwa7bjgzoo9qkjx0znicjlxjnjh.png "LWa7bJGzOo9qKJx0ZNicjLXjnJh")

![DJBibk5puoOLxYxxnH3chlxcnAd](https://zdoc-images.s3.us-west-2.amazonaws.com/djbibk5puoolxyxxnh3chlxcnad.png "DJBibk5puoOLxYxxnH3chlxcnAd")

オプションで、左側のナビゲーションペインで **DB Filter** と **Case Filter** を設定して、事前定義されたベクトルデータベースとケースのベンチマーク結果を比較できます。

<Admonition type="info" icon="📘" title="Notes">

<p>データベースは [database<em>name]-[db</em>label] の形式で命名されます。</p>

</Admonition>

<Grid columnSize="2" widthRatios="53,46">

    <div>

        ![ZBqQb11SEoYbYyxxtAYcKzv9nSc](https://zdoc-images.s3.us-west-2.amazonaws.com/zbqqb11seoybyyxxtayckzv9nsc.png "ZBqQb11SEoYbYyxxtAYcKzv9nSc")

    </div>

    <div>

        ![Wg3eb5C1AoEcRUxqO0Vcc4hSntd](https://zdoc-images.s3.us-west-2.amazonaws.com/wg3eb5c1aoecruxqo0vcc4hsntd.png "Wg3eb5C1AoEcRUxqO0Vcc4hSntd")

    </div>

</Grid>
