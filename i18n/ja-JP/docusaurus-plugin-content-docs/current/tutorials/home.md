---
title: "ホーム | Cloud"
slug: /home
sidebar_label: "ホーム"
beta: FALSE
notebook: FALSE
description: "これは Zilliz Cloud Developer Hub のホームページです。| Cloud"
type: origin
token: KXgEwDH8yifWxukkXXFctMdLnpg
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - はじめに
  - デベロッパーハブ
  - ホームページ
  - ホーム

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

# Zilliz Cloud ドキュメントへようこそ\{#welcome-to-zilliz-cloud-docs}

Zilliz Cloud は、完全に管理された Milvus サービスを提供し、セキュリティを考慮したベクトル検索アプリケーションのデプロイとスケーリングを簡素化し、複雑なインフラストラクチャの構築と維持の必要性を排除します。[詳細はこちら](./get-started)。

![H1i9wA7f9huNQDbDat4cf813nig](https://zdoc-images.s3.us-west-2.amazonaws.com/H1i9wA7f9huNQDbDat4cf813nig.png)

</Hero>

<Bars>

プロジェクトの [プラン](./select-zilliz-cloud-service-plans) を選択し、プロジェクト内で異なるデプロイオプションのクラスターを作成します。

- [無料](./create-cluster#create-a-free-cluster)

- [Serverless](./create-cluster#create-a-serverless-cluster)

- [専用](./create-cluster#create-a-dedicated-cluster)

 [どのデプロイオプションを選べばよいかわからないですか？](https://zilliz.com/pricing)

</Bars>

<Stories>

# Zilliz Cloud でデータを扱う\{#work-with-your-data-in-zilliz-cloud}

## 独自のベクトルを持ち込む\{#bring-your-own-vectors}

1. クラスターを作成し、接続します。

    必要なコンピューティングおよびストレージリソースで [クラスターを作成](./create-cluster) し、その後 [接続](./connect-to-cluster) します。

1. コレクションを作成します。

    コレクションは、固定列と可変行を持つ 2 次元テーブルです。データを扱うために [コレクションを作成](./manage-collections-sdks) します。

1. データをインポートします。

    ローカルファイルまたはオブジェクトストレージバケットから [データをインポート](./data-import) します。

1. ベクトル類似性検索を実行します。

    [基本的なベクトル類似性検索](./single-vector-search) を使用すると、最も類似した結果を見つけることができます。

## 統合埋め込み\{#integrated-embedding}

1. クラスターを作成し、接続します。

    必要なコンピューティングおよびストレージリソースで [クラスターを作成](./create-cluster) し、その後 [接続](./connect-to-cluster) します。

1. モデルプロバイダー連携を設定するか、ホスト済みモデルをデプロイします。

    サードパーティのモデルプロバイダーの認証情報を保存するための [連携を作成](./integrate-with-model-providers) します。または、ホスト済みモデルを [デプロイ](./hosted-models) することもできます。

1. コレクションを作成し、埋め込み関数を構成します。

    少なくとも 1 つのベクトルフィールドと 1 つの VARCHAR フィールドを含む [コレクションを作成](./manage-collections-sdks) し、テキスト埋め込み [関数](./model-based-functions) を定義します。

1. 生テキストデータを挿入します。

    生データを [挿入](./insert-entities) します。Zilliz Cloud は取り込み中に自動的にベクトル埋め込みを生成します。

1. 生テキストを使用して検索を実行します。

    生クエリテキストを提供します。Zilliz Cloud はクエリを埋め込み、保存されたベクトルと比較して、最も関連性の高い結果を [返却](./single-vector-search) します。

## 他のデータインフラからの移行\{#migrate-from-other-data-infra}

1. データソースに接続します。

    Zilliz Cloud は、Pinecone、MongoDB、Qdrant、PostgreSQL など、さまざまなデータソースをサポートしています。[移行ガイド](./migrations) をご覧ください。

1. 移行ソースとターゲットを構成します。

    データソース情報を確認し、移行ターゲットを構成します。

1. マッピングを確認します。

    ソースデータとターゲットデータのスキーマ間のマッピングを設定し、確認します。

## バックアップと復元\{#backup-and-restore}

1. クラスターまたはコレクションのバックアップを作成します。

    バックアップは、クラスターまたはコレクションの特定時点のコピーです。バックアップは [手動で作成](./create-snapshot) するか、スケジュールされたバックアップのために [バックアップポリシーを設定](./schedule-automatic-backups) できます。また、災害復旧機能を向上させるために、[バックアップを他のリージョンにコピー](/docs/backup-to-other-regions) することもできます。

1. (オプション) バックアップをオブジェクトストレージサービスにエクスポートします。

    作成した [バックアップファイルをエクスポート](./export-backup-files) して、AWS S3 または Azure Blob Storage に保存できます。

1. データを復元します。

    予期せぬシステム障害やデータ損失が発生した場合に、[データを復元](./restore-from-snapshot) します。

</Stories>

<Cards>

# Zilliz Cloud をさらに活用する\{#go-further-with-zilliz-cloud}

- [モニタリングとアラート](./metrics-and-alerts)

    クラスターを監視し、タイムリーにアラートを受け取ります。

- [アクセス制御](./access-control)

    きめ細かいアクセス制御でデータを保護します。

- [プライベートネットワーキング](./setup-a-private-link)

    クラスターをプライベートネットワークに接続します。

- break

- [請求](./payment-billing)

    前払い費用なしで使用した分だけ支払います。

- [連携](./integrate-with-third-parties)

    既存のツールやワークフローと連携します。

</Cards>

<Blocks>

# お好みの言語でビルディングを開始する\{#start-building-with-your-preferred-language}

- [Python](/reference/python)

- [Java](/reference/java)

- [Go](/reference/go)

- [Node.js](/reference/nodejs)

- [RESTful API](/reference/restful)

</Blocks>

<Banner bannerText="Can't find what you're looking for?" bannerLinkText="Try Ask AI" />

