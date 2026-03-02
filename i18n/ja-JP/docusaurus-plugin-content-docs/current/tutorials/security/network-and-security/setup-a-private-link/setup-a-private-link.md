---
title: "プライベートエンドポイントをセットアップする | Cloud"
slug: /setup-a-private-link
sidebar_label: "プライベートエンドポイントをセットアップする"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、プライベートリンクを介してクラスターへのプライベートアクセスを提供します。これは、クラスターのトラフィックをインターネット経由で送信したくない場合に便利です。"
type: origin
token: O5W3wHvmbiVSoLkzKgHcvB9XnUb
sidebar_position: 3
keywords: 
  - zilliz
  - ベクターデータベース
  - クラウド
  - プライベートリンク
  - プライベートエンドポイント
  - aws
  - gcp
  - azure
  - 動画類似性検索
  - ベクター検索
  - 音声類似性検索
  - エラスティックベクターデータベース

---

import Admonition from '@theme/Admonition';


# プライベートエンドポイントのセットアップ

Zilliz Cloudは、プライベートリンクを介してクラスターへのプライベートアクセスを提供します。これは、クラスターのトラフィックをインターネット経由で送信したくない場合に役立ちます。

Zilliz Cloud上のクラスターへのプライベートクライアントアクセスを有効にするには、アプリケーションのVPC内の各サブネットにエンドポイントを作成する必要があります。次に、VPC、サブネット、およびエンドポイントをZilliz Cloudに登録して、プライベートリンクを割り当て、プライベートリンクをエンドポイントにマッピングするDNSレコードを設定できるようにします。

次の図は、その仕組みを示しています。

![BkbRwb8YhhqePCpZn2Kc8lWknNc](https://zdoc-images.s3.us-west-2.amazonaws.com/BkbRwb8YhhqePCZZn2Kc8lWknNc.png)

このガイドでは、クラスターのプライベートエンドポイントを設定する手順を説明します。

import DocCardList from '@theme/DocCardList';

<DocCardList />