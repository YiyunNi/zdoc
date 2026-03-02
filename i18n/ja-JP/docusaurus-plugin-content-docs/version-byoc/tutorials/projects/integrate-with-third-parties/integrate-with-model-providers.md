---
title: "モデルプロバイダーとの統合 | BYOC"
slug: /integrate-with-model-providers
sidebar_label: "モデルプロバイダー"
beta: FALSE
notebook: FALSE
description: "モデルプロバイダー統合は、Zilliz Cloudをサードパーティのモデルサービスに接続し、プロバイダーの機能をプロジェクトで利用できるようにします。 | BYOC"
type: origin
token: B1cSwfWcri4VJLkCR20cHIs6nCf
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - サードパーティ
  - サービス
  - モデル
  - プロバイダー
  - ベクトルデータベースの例
  - RAG ベクトルデータベース
  - ベクトルDBとは
  - ベクトルデータベースとは

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# モデルプロバイダーとの統合

**モデルプロバイダー統合**は、Zilliz Cloudをサードパーティのモデルサービスに接続し、そのプロバイダーの機能をプロジェクトで利用できるようにします。

統合は次のことを行います。

- モデルプロバイダーにアクセスするために必要な認証情報を保存します。

- モデルプロバイダーがサポートする機能（例：テキスト埋め込みや再ランキング）を探索します。

## モデルプロバイダー統合が必要な場合{#when-you-need-a-model-provider-integration}

Zilliz Cloudで**モデルベースの機能を使用したい場合にのみ**、モデルプロバイダー統合を作成する必要があります。

- **テキスト埋め込み関数**: 外部モデルを使用して、生のテキストを密なベクトルに変換します。詳細については、[テキスト埋め込み関数](./model-based-functions)を参照してください。

- **モデルベースのランカー**: 外部の再ランキングモデルを使用して、検索結果を再ランキングします。詳細については、[モデルベースのランカー](./model-ranker)を参照してください。

BM25、ハイブリッドランカー、ルールベースのランカーなどのローカル機能は、モデルプロバイダー統合を**必要としません**。

## 課金に関する考慮事項{#billing-considerations}

モデルプロバイダー統合の作成自体には料金はかかりません。ただし、外部モデルプロバイダーを使用すると、追加費用が発生する可能性があります。これには以下が含まれます。

- モデルプロバイダーからの料金。

- 埋め込みまたは再ランキングのためにデータが送信される際のデータ転送費用。詳細については、[データ転送費用](./data-transfer-cost)を参照してください。

課金は、モデルベースの関数またはランカーが実行された場合にのみ適用されます。

## 開始する前に{#before-you-start}

モデルプロバイダー統合を作成する前に、以下のことを確認してください。

- ターゲットのZilliz Cloudプロジェクトに対して**Organization Owner**または**Project Admin**の権限を持っていること。十分な権限がない場合は、Zilliz Cloud Organization Ownerに連絡してください。

- 統合したいモデルプロバイダーの有効な**APIキー**を持っていること。

## モデルプロバイダー統合の作成{#create-a-model-provider-integration}

<Supademo id="cmj9f3j6u0johf6zpk5kdyx3u" title=""  />

モデルプロバイダー統合を作成するには：

<Procedures>

1. [Zilliz Cloudコンソール](https://cloud.zilliz.com/login)にログインします。

1. プロジェクトページで、左側のナビゲーションペインから**Integrations**に移動します。

1. **Model Providers**セクションの下にある**+ Integration**をクリックします。

1. 表示されるダイアログボックスで、**Basic Settings**を設定します。

    - **Model Provider**: 統合するモデルプロバイダーを選択します。

    - **Integration Name**: この統合の一意の名前（例：`test`）。

    - **Integration Description** *(オプション)*: この統合の説明（例：`for model provider`）。

1. **Next**をクリックします。**Credential Information**ステップにリダイレクトされます。

    1. **API Key**フィールドに、モデルプロバイダーアクセス用のAPIキーを入力します。

    1. **Validate Integration**をクリックして接続を確認します。ステータスがSuccessfulに変わったら、次のステップに進みます。

1. **Add**をクリックします。

</Procedures>

作成後、統合はモデルベースの関数やランカーで使用できるようになります。

## 統合の管理{#manage-integrations}

統合が作成された後、**Integrations**ページから管理できます。

- 統合IDの取得

    統合IDは、テキスト埋め込み関数または再ランキング関数を使用する際に必要になります。

- 統合の詳細の表示

- 統合名または説明の編集

- 不要になった統合の削除

<Admonition type="info" icon="📘" title="Notes">

<p>統合が削除されたり無効になったりすると、それを参照するコレクションやランカーは、統合が更新または置き換えられるまで、挿入または検索操作中に失敗する可能性があります。</p>

</Admonition>

<Supademo id="cmjcjqyk3017cw10i8dbm2ret" title="" isShowcase />

## 次のステップ{#next-steps}

モデルプロバイダー統合を作成した後、次のことができます。

- **テキスト埋め込み関数**で使用して、テキストを密なベクトルに変換する

- **モデルベースのランカー**で使用して、検索結果を再ランキングする

詳細な手順については、以下を参照してください。

- [テキスト埋め込み関数](./model-based-functions)

- [再ランキング関数](./reranking)

