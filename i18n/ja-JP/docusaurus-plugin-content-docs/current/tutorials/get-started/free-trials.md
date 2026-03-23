---
title: "Zilliz Cloud を無料で試す | Cloud"
slug: /free-trials
sidebar_label: "Zilliz Cloud を無料で試す"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、強力なベクトルデータベース機能を評価またはテストし、Zilliz Cloud の使用コストを見積もるのに役立つフリークラスターと無料トライアルの両方を提供しています。開始するには、Zilliz Cloud でアカウントを登録するだけです。支払い情報は必要ありません。 | Cloud"
type: origin
token: LMfdwRwKIiJtywkwbHVcGnOFnRf
sidebar_position: 10
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 無料トライアル
  - milvus

---

import Admonition from '@theme/Admonition';


# Zilliz Cloudを無料で試す

Zilliz Cloudは、強力なベクトルデータベース機能を評価またはテストし、Zilliz Cloudの使用コストを見積もるのに役立つ**フリークラスター**と**無料トライアル**の両方を提供しています。開始するには、Zilliz Cloudに[アカウントを登録する](./register-with-zilliz-cloud)だけです。支払い情報は必要ありません。

## フリークラスター\{#free-cluster}

Zilliz Cloudは、基本的なベクトルデータベース機能を無料で利用できるフリークラスターを提供しています。フリークラスターは以下を提供します。

- 5 GBのストレージ（1Mの768次元ベクトルに十分な容量）

- 月あたり2.5M vCU

- 最大5つのコレクション

より多くのリソースが必要な場合、または高度な機能にアクセスしたい場合は、ServerlessおよびDedicatedクラスターの[無料トライアル](./free-trials#free-trial)をご利用ください。

## 無料トライアル\{#free-trial}

Zilliz Cloudは、クラスターとベクトルデータベース機能の無料トライアルを提供しています。以下のセクションでは、クラスターのクレジットベースの無料トライアルについて説明します。構造化テーブルまたは非構造化データファイルのコレクションを保持するオブジェクトストアであるボリューム機能を試したい場合は、[ボリュームの説明](./volume-explained#free-trial-volume)を参照してください。

### 無料トライアルを使用する\{#use-free-trial}

Zilliz Cloudに仕事用メールでサインアップすると、組織の請求アカウントに**100ドル**の無料クレジットが追加されます。これらのクレジットは**30日**後に失効し、ServerlessおよびDedicatedクラスターを探索するために使用できます。クレジットが使い果たされるか失効すると、無料トライアルは終了します。

トライアル後、組織は凍結されます。この間、ServerlessおよびDedicatedクラスターは[ごみ箱](./use-recycle-bin)に移動され、これらのクラスターに固有の機能（例：バックアップと復元、アラートなど）にはアクセスできなくなります。

組織の凍結を解除するには、[支払い方法を追加する](./payment-billing)だけです。これにより、ごみ箱から削除されたデータを復元できるようになります。凍結から30日以内に支払い方法を追加しない場合、ServerlessおよびDedicatedクラスターは永久に削除されますが、組織は保持されます。

### クレジットを獲得し、クレジットの有効期限を延長する\{#earn-credits-and-extend-credit-expiration}

仕事用メールで登録すると、100ドルの無料クレジットを受け取ります。Zilliz Cloudで[支払い方法を追加する](./payment-billing)ことで、さらに100ドルを獲得できます。さらに、支払い方法を追加すると、クレジットの有効期限が**1年間**に延長されます。

追加のクレジットが必要な場合、またはトライアル期間を延長したい場合は、[営業担当者にお問い合わせください](https://zilliz.com/contact-sales)。

### クレジット残高を表示する\{#view-credit-balance}

左側のナビゲーションペインの下部で、残りのクレジットとその有効期限をすばやく確認できます。

または、**請求概要**ページの**クレジット**セクションに移動します。

![view-credit-balance](https://zdoc-images.s3.us-west-2.amazonaws.com/view-credit-balance.png "view-credit-balance")

<Admonition type="info" icon="📘" title="Notes">

<p>意図しないクレジットの使用を避けるため、使用していないクラスターは手動で一時停止することをお勧めします。</p>

</Admonition>

### 無料トライアルの通知\{#free-trial-notifications}

無料トライアル中、Zilliz Cloudからそのステータスに関するいくつかのメール通知が届きます。これらのメールは組織オーナーに送信され、以下のイベントによってトリガーされます。

- クレジットが付与されてから最初の3日以内にクレジットが消費されない場合。

- クレジットの60%が消費された場合。

- クレジットの有効期限が3日未満の場合。

- 有効な支払い方法がないため、トライアルの有効期限切れにより組織が凍結された場合。

- トライアル終了に伴い、ServerlessおよびDedicatedクラスターの削除が近づいている場合。

- トライアル終了後、ServerlessおよびDedicatedクラスターがごみ箱に移動された場合。

- すべてのクレジットが使い果たされた場合。

## 関連トピック\{#related-topics}

- [Zilliz Cloudに登録する](./register-with-zilliz-cloud)

- [クラスターを作成する](./create-cluster)

