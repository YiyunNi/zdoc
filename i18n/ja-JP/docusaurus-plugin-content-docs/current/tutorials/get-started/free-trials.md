---
title: "Zilliz Cloud を無料で試す | Cloud"
slug: /free-trials
sidebar_label: "Zilliz Cloud を無料で試す"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、強力なベクトルデータベース機能を評価またはテストし、Zilliz Cloud の使用コストを見積もるのに役立つ無料クラスターと無料トライアルの両方を提供しています。開始するには、Zilliz Cloud でアカウントを登録するだけです。支払い情報は必要ありません。 | Cloud"
type: origin
token: LMfdwRwKIiJtywkwbHVcGnOFnRf
sidebar_position: 8
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 無料トライアル
  - milvus
  - knnアルゴリズム
  - HNSW
  - 非構造化データとは
  - ベクトル埋め込み

---

import Admonition from '@theme/Admonition';


# Zilliz Cloud を無料で試す

Zilliz Cloud は、強力なベクトルデータベース機能を評価またはテストし、Zilliz Cloud の使用コストを見積もるのに役立つ**無料クラスター**と**無料トライアル**の両方を提供しています。開始するには、Zilliz Cloud で[アカウントを登録する](./register-with-zilliz-cloud)だけです。支払い情報は必要ありません。

## 無料クラスター{#free-cluster}

Zilliz Cloud は、基本的なベクトルデータベース機能を無料で利用できる無料クラスターを提供しています。無料クラスターでは、以下が提供されます。

- 5 GB のストレージ (100万個の768次元ベクトルに十分な容量)

- 月あたり250万 vCU

- 最大5つのコレクション

より多くのリソースが必要な場合や、高度な機能にアクセスしたい場合は、Serverless および Dedicated クラスターの[無料トライアル](./free-trials#free-trial)をご利用ください。

## 無料トライアル{#free-trial}

Zilliz Cloud は、クラスターとベクトルデータベース機能の無料トライアルを提供しています。以下のセクションでは、クラスターのクレジットベースの無料トライアルについて説明します。構造化テーブルまたは非構造化データファイルのコレクションを保持するオブジェクトストレージであるボリューム機能を試したい場合は、[ボリュームの説明](./volume-explained#free-trial-volume)を参照してください。

### 無料トライアルを利用する{#use-free-trial}

仕事用メールアドレスで Zilliz Cloud にサインアップすると、組織の請求アカウントに**100ドル**の無料クレジットが追加されます。これらのクレジットは**30日**後に期限切れとなり、Serverless および Dedicated クラスターを探索するために使用できます。クレジットが使い果たされるか期限切れになると、無料トライアルは終了します。

トライアル終了後、組織は凍結されます。この間、Serverless および Dedicated クラスターは[ごみ箱](./use-recycle-bin)に移動され、これらのクラスターに固有の機能 (例: バックアップと復元、アラートなど) にアクセスできなくなります。

組織の凍結を解除するには、[支払い方法を追加する](./payment-billing)だけです。これにより、ごみ箱から削除されたデータを復元できるようになります。凍結から30日以内に支払い方法を追加しない場合、Serverless および Dedicated クラスターは永久に削除されますが、組織は保持されます。

### クレジットを獲得し、クレジットの有効期限を延長する{#earn-credits-and-extend-credit-expiration}

仕事用メールアドレスで登録すると、100ドルの無料クレジットを受け取ります。Zilliz Cloud で[支払い方法を追加する](./payment-billing)ことで、さらに100ドルを獲得できます。さらに、支払い方法を追加すると、クレジットの有効期限が**1年間**に延長されます。

追加のクレジットが必要な場合や、トライアル期間を延長したい場合は、[営業担当者にお問い合わせください](https://zilliz.com/contact-sales)。

### クレジット残高を表示する{#view-credit-balance}

左側のナビゲーションペインの下部で、残りのクレジットとその有効期限をすばやく確認できます。

または、**Billing Overview** ページの**Credits**セクションに移動します。

![view-credit-balance](https://zdoc-images.s3.us-west-2.amazonaws.com/view-credit-balance.png "view-credit-balance")

<Admonition type="info" icon="📘" title="Notes">

<p>意図しないクレジットの使用を避けるため、使用していないクラスターは手動で一時停止することをお勧めします。</p>

</Admonition>

### 無料トライアル通知{#free-trial-notifications}

無料トライアル期間中、Zilliz Cloud からそのステータスに関するいくつかのメール通知が届きます。これらのメールは組織の所有者に送信され、以下のイベントによってトリガーされます。

- クレジットが付与されてから最初の3日以内にクレジットが消費されない場合。

- クレジットの60%が消費された場合。

- クレジットの有効期限が3日未満の場合。

- 有効な支払い方法がないため、トライアルの期限切れにより組織が凍結された場合。

- トライアル終了に伴い、Serverless および Dedicated クラスターがまもなく削除される場合。

- トライアル終了後、Serverless および Dedicated クラスターがごみ箱に移動された場合。

- すべてのクレジットが使い果たされた場合。

## 関連トピック{#related-topics}

- [Zilliz Cloud に登録する](./register-with-zilliz-cloud)

- [クラスターを作成する](./create-cluster)

