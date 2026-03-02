---
title: "ホーム | Cloud"
slug: /home
sidebar_label: "ホーム"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud Developer Hub のホームぺージです。 | Cloud"
type: origin
token: KXgEwDH8yifWxukkXXFctMdLnpg
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - 入門
  - 開発者ハブ
  - ホームページ
  - ホーム
  - ベクトル類似性検索
  - 近似最近傍探索
  - DiskANN
  - Sparse vector

hide_title: true
hide_table_of_contents: true
---

import Admonition from '@theme/Admonition';



import Hero from '@site/src/components/Hero';


import Bars from '@site/src/components/Bars';


import Blocks from '@site/src/components/Blocks';


import Cards from '@site/src/components/Cards';


import Stories from '@site/src/components/Stories';


import Banner from '@site/src/components/Banner';



<Hero>

# Zilliz Cloud ドキュメントへようこそ{#welcome-to-zilliz-cloud-docs}

Zilliz Cloud は、完全に管理された Milvus サービスを提供し、セキュリティを考慮したベクトル検索アプリケーションのデプロイとスケーリングを簡素化し、複雑なインフラストラクチャを構築および維持する必要がありません。[詳細はこちら](./get-started)。

![H1i9wA7f9huNQDbDat4cf813nig](https://zdoc-images.s3.us-west-2.amazonaws.com/H1i9wA7f9huNQDbDat4cf813nig.png)

</Hero>

<Bars>

プロジェクトの[プラン](./select-zilliz-cloud-service-plans)を選択し、プロジェクト内に異なるデプロイオプションのクラスターを作成します。

- [Free](./create-cluster#create-a-free-cluster)

- [Serverless](./create-cluster#create-a-serverless-cluster)

- [Dedicated](./create-cluster#create-a-dedicated-cluster)

 [どのデプロイオプションを選択すればよいかわからない場合はこちら](https://zilliz.com/pricing)

</Bars>

<Stories>

# Zilliz Cloud でデータを操作する{#work-with-your-data-in-zilliz-cloud}

## 独自のベクトルを使用する{#bring-your-own-vectors}

1. クラスターを作成して接続します。

    希望するコンピューティングおよびストレージリソースで[クラスターを作成](./create-cluster)し、それに[接続](./connect-to-cluster)します。

1. collection を作成します。

    collection は、固定列と可変行を持つ2次元テーブルです。データを操作するために[collection を作成](./manage-collections-sdks)します。

1. データをインポートします。

    ローカルファイルまたはオブジェクトストレージバケットから[データをインポート](./data-import)します。

1. ベクトル類似性検索を実行します。

    [基本的なベクトル類似性検索](./single-vector-search)は、最も類似した結果を見つけるのに役立ちます。

## 他のデータインフラから移行する{#migrate-from-other-data-infra}

1. データソースに接続します。

    Zilliz Cloud は、Pinecone、MongoDB、Qdrant、PostgreSQL など、さまざまなデータソースをサポートしています。[移行ガイド](./migrations)を参照してください。

1. 移行元と移行先を設定します。

    データソース情報を確認し、移行先を設定します。

1. マッピングを確認します。

    ソースとターゲットデータの schema 間のマッピングを設定し、確認します。

## バックアップと復元{#backup-and-restore}

1. クラスターまたは collection のバックアップを作成します。

    バックアップは、クラスターまたは collection の特定の時点のコピーです。[手動でバックアップを作成](./create-snapshot)するか、スケジュールされたバックアップのために[バックアップポリシーを設定](./schedule-automatic-backups)できます。災害復旧機能を向上させるために、[バックアップを他のリージョンにコピー](/docs/backup-to-other-regions)することもできます。

1. (オプション) バックアップをオブジェクトストレージサービスにエクスポートします。

    作成した[バックアップファイルを AWS S3 または Azure Blob Storage にエクスポート](./export-backup-files)できます。

1. データを復元します。

    予期せぬシステム障害やデータ損失が発生した場合に[データを復元](./restore-from-snapshot)します。

</Stories>

<Cards>

# Zilliz Cloud をさらに活用する{#go-further-with-zilliz-cloud}

- [監視とアラート](./metrics-and-alerts)

    クラスターを監視し、時間通りにアラートを受け取ります。

- [アクセス制御](./access-control)

    きめ細かなアクセス制御でデータを保護します。

- [プライベートネットワーク](./setup-a-private-link)

    クラスターをプライベートネットワークに接続します。

- break

- [請求](./payment-billing)

    使用した分だけ支払い、初期費用はかかりません。

- [統合](./integrate-with-third-parties)

    既存のツールやワークフローと統合します。

</Cards>

<Blocks>

# お好みの言語で構築を開始する{#start-building-with-your-preferred-language}

- [Python](/reference/python)

- [Java](/reference/java)

- [Go](/reference/go)

- [Node.js](/reference/nodejs)

- [RESTful API](/reference/restful)

</Blocks>

<Banner bannerText="お探しのものが見つかりませんか？" bannerLinkText="Ask AI を試す" />

