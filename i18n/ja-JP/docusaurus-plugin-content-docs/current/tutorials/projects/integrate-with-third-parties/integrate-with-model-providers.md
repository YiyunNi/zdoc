---
title: "モデルプロバイダーとの連携 | Cloud"
slug: /integrate-with-model-providers
sidebar_key: integrate-with-model-providers
sidebar_label: "モデルプロバイダー"
beta: FALSE
notebook: FALSE
description: "モデルプロバイダー連携は、Zilliz Cloud をサードパーティーのモデルサービスに接続し、そのプロバイダーの機能をプロジェクトで利用できるようにします。 | Cloud"
type: origin
token: B1cSwfWcri4VJLkCR20cHIs6nCf
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - サードパーティー
  - サービス
  - モデル
  - プロバイダー

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# モデルプロバイダーとの連携

**モデルプロバイダー連携**は、Zilliz Cloudをサードパーティのモデルサービスに接続し、プロバイダーの機能をプロジェクトで利用できるようにするものです。

連携では以下のことが行われます。

- モデルプロバイダーにアクセスするために必要な認証情報を保存する

- モデルプロバイダーがサポートする機能を確認する（例：テキスト埋め込みやリランキング）

## モデルプロバイダー連携が必要な場合\{#when-you-need-a-model-provider-integration}

モデルプロバイダー連携を作成する必要があるのは、Zilliz Cloudで**モデルベースの機能を使用したい場合のみ**です。

- **テキスト埋め込み関数**: 外部モデルを使用して生テキストを密ベクトルに変換します。詳細については、[テキスト埋め込み関数](./model-based-functions) を参照してください。

- **モデルベースのランカー**: 外部のリランキングモデルを使用して検索結果を再ランキングします。詳細については、[モデルベースのランカー](./model-ranker) を参照してください。

BM25、ハイブリッドランカー、ルールベースのランカーなどのローカル機能は、モデルプロバイダー連携を**必要としません**。

## 請求に関する考慮事項\{#billing-considerations}

モデルプロバイダー連携の作成自体には料金は発生しません。ただし、外部のモデルプロバイダーを使用すると、以下を含む追加コストが発生する場合があります。

- モデルプロバイダーからの料金

- 埋め込みやリランキングのためにデータが送信される際のデータ転送費用。詳細については、[データ転送費用](./data-transfer-cost) を参照してください。

請求は、モデルベースの関数またはランカーが実行された場合にのみ適用されます。

## 開始前の準備\{#before-you-start}

モデルプロバイダー連携を作成する前に、以下を確認してください。

- 対象のZilliz Cloudプロジェクトで、**組織オーナー**または**プロジェクト管理者**の権限を持っていること。十分な権限がない場合は、Zilliz Cloudの組織オーナーに問い合わせてください。

- 連携したいモデルプロバイダーの有効な**APIキー**を持っていること。

## モデルプロバイダー連携の作成\{#create-a-model-provider-integration}

<Supademo id="cmj9f3j6u0johf6zpk5kdyx3u" title=""  />

モデルプロバイダー連携を作成するには：

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) にログインします。

1. プロジェクトページで、左側のナビゲーションペインから **Integrations** に移動します。

1. **モデルプロバイダー** セクションで、**+ Integration** をクリックします。

1. 表示されたダイアログボックスで、**基本設定** を構成します。

    - **モデルプロバイダー**: 連携するモデルプロバイダーを選択します。

    - **統合名**: この連携の一意の名前（例：`test`）。

    - **統合の説明** *(オプション)*: この連携の説明（例：`for model provider`）。

1. **Next** をクリックします。**認証情報** ステップにリダイレクトされます。

    1. **APIキー** フィールドに、モデルプロバイダーへのアクセス用APIキーを入力します。

    1. **統合の検証** をクリックして接続を確認します。ステータスが「成功」に変わったら、次のステップに進みます。

1. **Add** をクリックします。

</Procedures>

作成後、連携はモデルベースの関数およびランカーで使用できるようになります。

## 連携の管理\{#manage-integrations}

連携が作成された後、**Integrations** ページから管理できます。

- 統合IDの取得

    テキスト埋め込み関数やリランキング関数を使用する際に、統合IDが必要になります。

- 連携詳細の表示

- 連携名または説明の編集

- 不要になった連携の削除

<Admonition type="info" icon="📘" title="Notes">

<p>連携が削除されたり無効になったりすると、それを参照しているコレクションやランカーは、連携が更新または置き換えられるまで、挿入や検索操作で失敗する可能性があります。</p>

</Admonition>

<Supademo id="cmjcjqyk3017cw10i8dbm2ret" title="" isShowcase />

## 次のステップ\{#next-steps}

モデルプロバイダー連携を作成した後、以下が可能です。

- **テキスト埋め込み関数** とともに使用して、テキストを密ベクトルに変換する

- **モデルベースのランカー** とともに使用して、検索結果を再ランキングする

詳細な手順については、以下を参照してください。

- [テキスト埋め込み関数](./model-based-functions)

- [リランキング関数](./reranking)

