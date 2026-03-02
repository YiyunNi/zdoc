---
title: "関数とモデル推論の概要 | Cloud"
slug: /function-and-model-inference-overview
sidebar_label: "概要"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、セマンティック検索、語彙検索、ハイブリッド検索、インテリジェントな再ランキングなど、最新のリトリーバルシステムを構築するための統合検索アーキテクチャを提供します。これらの機能を個別の機能として公開するのではなく、Zilliz Cloudはそれらを単一のコア抽象化である「関数」を中心に整理しています。 | Cloud"
type: origin
token: BanBwAm53iaLimkfLm3cFh0Fncb
sidebar_position: 1
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - 関数
  - モデル
  - 推論
  - 概要
  - 音声検索
  - セマンティック検索とは
  - Embedding model
  - 画像類似性検索

---

import Admonition from '@theme/Admonition';


# Functionとモデル推論の概要

Zilliz Cloudは、セマンティック検索、レキシカル検索、ハイブリッド検索、インテリジェントなリランキングなど、最新のリトリーバルシステムを構築するための統一された検索アーキテクチャを提供します。これらの機能を個別の機能として公開するのではなく、Zilliz Cloudはそれらを単一のコア抽象化である**Function**を中心に構成します。

## Functionとは？{#what-is-a-function}

Zilliz Cloudにおいて、**Function**は、検索ワークフローの定義された段階で特定の操作を適用する、設定可能な実行単位です。

Functionは、3つの実用的な質問に答えます。

- **この操作はいつ実行されますか？** 検索前または検索後。

- **何を入力として操作しますか？** 生のテキスト、ベクトル表現、または取得された候補結果。

- **どのような出力を生成しますか？** リトリーバルに使用されるベクトル埋め込み、またはユーザーに返される並べ替えられた結果。

ワークフローの観点から見ると、Functionは検索の2つの異なる段階で参加します。

- **検索前**: Functionは検索前に実行され、テキストをベクトル表現に変換します。これらのベクトルは、どの候補が取得されるかを決定します。

- **検索後**: Functionは候補取得後に実行され、候補セットを変更せずに結果の順序を調整します。

以下の図は、検索ワークフローにおけるFunctionの動作の抽象化を示しています。

![HF6JwTJVfhXMmdb3qx3cm2YdnMe](https://zdoc-images.s3.us-west-2.amazonaws.com/HF6JwTJVfhXMmdb3qx3cm2YdnMe.png)

すべての検索リクエストは、同じ高レベルのフローに従います。

1. **検索前Function**は、入力テキストからベクトル表現を生成します。

1. 検索エンジンは、それらのベクトルに基づいて候補結果を取得します。

1. (オプション) **検索後Function**は、取得された候補をリランキングします。

## Functionのカテゴリ{#function-categories}

Zilliz CloudのFunctionは、**検索ワークフローでいつ実行されるか**と**どのような役割を果たすか**に基づいて分類されます。大まかに言えば、Functionは2つのグループに分けられます。

- テキストをベクトル埋め込みに変換し、候補の取得を決定する**検索前Function**

- 取得された候補の順序を調整する**検索後Function**

### 検索前Function: テキストをベクトル埋め込みに変換する{#pre-search-functions-convert-text-to-vector-embeddings}

**検索前Function**は、候補取得前に実行されます。その役割は、生のテキスト（保存されたドキュメントと受信クエリの両方）を、検索エンジンが関連する候補を識別するために使用するベクトル表現に変換することです。

異なる検索前Functionは、異なる種類の埋め込みを生成し、それがリトリーバルの実行方法に直接影響します。

以下の表は、利用可能な検索前Functionをまとめたものです。

<table>
   <tr>
     <th><p>Functionタイプ</p></th>
     <th><p>ベクトルタイプ</p></th>
     <th><p>説明</p></th>
     <th><p>典型的なシナリオ</p></th>
   </tr>
   <tr>
     <td><p>BM25 Function</p></td>
     <td><p>疎な埋め込み</p></td>
     <td><p>用語の一致、用語の頻度、およびドキュメント長の正規化に基づいて語彙の関連性を計算します。</p><p>ローカルメカニズムとしてデータベースエンジン内で完全に実行されます。<strong><a href="./function-and-model-inference-overview#understand-model-inference">モデル推論</a>は不要です</strong>。</p></td>
     <td><p>キーワード駆動のfull text search、ドキュメントおよびコード検索、用語の一致、低レイテンシ、決定論的動作が重要なワークロード。</p></td>
   </tr>
   <tr>
     <td><p>モデルベースFunction</p></td>
     <td><p>密な埋め込み</p></td>
     <td><p>機械学習モデルを使用してテキストのセマンティックな意味をエンコードし、厳密なキーワードを超えた類似性ベースのリトリーバルを可能にします。</p><p>ホストされたモデルまたはサードパーティのモデルサービスを介した<strong><a href="./function-and-model-inference-overview#understand-model-inference">モデル推論</a>が必要です</strong>。</p></td>
     <td><p>セマンティック検索、自然言語クエリ、Q&AおよびRAGパイプライン、概念的な類似性が文字通りの用語の重複よりも重要なユースケース。</p></td>
   </tr>
</table>

すべての検索前Functionは、ドキュメントデータとクエリテキストの両方に一貫して適用され、リトリーバルが同じ表現空間内で実行されることを保証します。

### 検索後Function: 候補結果をリランキングする{#post-search-functions-rerank-candidate-results}

検索後Functionは、**候補取得後に**適用されます。その目的は、候補セットからアイテムを追加または削除することなく、**取得された候補のランキングを調整する**ことです。

これらのFunctionは、検索ステージによって返された結果のみを操作し、結果の品質を向上させるために追加のランキングロジックまたは関連性シグナルを適用します。これらは、インデックス作成、リトリーバル、またはフィルタリングの動作には影響しません。結果の最終的な順序付けのみに影響します。

以下の表は、利用可能な検索後Functionをまとめたものです。

<table>
   <tr>
     <th><p>Functionタイプ</p></th>
     <th><p>操作対象</p></th>
     <th><p>説明</p></th>
     <th><p>典型的なシナリオ</p></th>
   </tr>
   <tr>
     <td><p>ハイブリッド検索ランカー</p></td>
     <td><p>ハイブリッド検索から取得された複数の結果セット</p></td>
     <td><p><a href="./reranking-weighted-reranker">重み付けランキング</a>や<a href="./reranking-rrf">逆順位融合</a> (RRF) などの方法を使用して、異なるリトリーバル戦略から取得された結果を結合し、再バランスします。</p></td>
     <td><p>セマンティック検索とレキシカル検索を組み合わせ、バランスの取れた結果融合を必要とするハイブリッド検索シナリオ。</p></td>
   </tr>
   <tr>
     <td><p>ルールベースランカー</p></td>
     <td><p>単一ベクトルまたはハイブリッド検索からの候補結果</p></td>
     <td><p><a href="./boost-ranker">ブースト</a>や<a href="./decay-ranker-oveview">減衰ベース</a>のスコアリングなど、事前定義されたルールまたは数値シグナルに基づいてランキングを調整します。</p></td>
     <td><p>ビジネス駆動のランキングロジック、新しさや人気度のブースト、予測可能でMLを使用しないリランキングを必要とするシナリオ。</p></td>
   </tr>
   <tr>
     <td><p>モデルベースランカー</p></td>
     <td><p>単一ベクトルまたはハイブリッド検索からの候補結果</p></td>
     <td><p>機械学習モデルを使用して関連性を評価し、学習されたまたはセマンティックなシグナルに基づいて結果を並べ替えます。</p></td>
     <td><p>インテリジェントなリランキング、セマンティックな理解を使用した関連性の調整、LLMベースの関連性評価。</p></td>
   </tr>
</table>

検索後Functionは取得された候補のみを操作するため、結果の順序には影響しますが、リトリーバルの範囲には影響しない調整ステップです。

## モデル推論を理解する{#understand-model-inference}

Zilliz CloudのFunctionベースのアーキテクチャでは、**モデル推論はスタンドアロンの概念や実行ステージではありません**。代わりに、機械学習ベースのシグナルが必要な場合に特定のFunctionタイプで使用される実装の詳細です。

### モデル推論がどこに適合するか{#where-model-inference-fits-in}

モデル推論とは、機械学習モデルのランタイム実行を指し、次のようなセマンティックシグナルを生成します。

- テキストから派生した密なベクトル埋め込み

- 検索結果をリランキングするために使用される関連性スコア

Zilliz Cloud内では、モデル推論は**モデルベースFunction**のみで使用されます。これには以下が含まれます。

- 生のテキストを密なベクトル埋め込みに変換する[モデルベース検索前Function](./function-and-model-inference-overview#pre-search-functions-convert-text-to-vector-embeddings)

- 関連性を評価し、取得された候補を並べ替える[モデルベースランカー](./function-and-model-inference-overview#post-search-functions-rerank-candidate-results)

BM25 Functionやルールベースランカーなどの他のFunctionは、データベースエンジン内で完全に実行され、**モデル推論を必要としません**。

### モデル推論のソース{#sources-of-model-inference}

Zilliz Cloudは、モデル推論の2つのソースをサポートしています。どちらもモデルベースの機能を提供しますが、モデルのプロビジョニングと管理方法が異なります。

<table>
   <tr>
     <th><p>側面</p></th>
     <th><p>ホストされたモデル</p></th>
     <th><p>サードパーティモデルサービス</p></th>
   </tr>
   <tr>
     <td><p><strong>モデルの実行場所</strong></p></td>
     <td><p>Zilliz Cloud内</p></td>
     <td><p>外部モデルプロバイダー (OpenAI, Voyage AIなど)</p></td>
   </tr>
   <tr>
     <td><p><strong>モデルの管理責任者</strong></p></td>
     <td><p>Zilliz Cloud</p></td>
     <td><p>外部モデルプロバイダー</p></td>
   </tr>
   <tr>
     <td><p><strong>アクセス設定方法</strong></p></td>
     <td><p><a href="./hosted-models">ホストされたモデル</a>を参照</p></td>
     <td><p>ご自身で<a href="./integrate-with-model-providers">モデルプロバイダー統合</a>を介して</p></td>
   </tr>
   <tr>
     <td><p><strong>認証情報</strong></p></td>
     <td><p>Zilliz Cloudサポートとのオンボーディング時に提供</p></td>
     <td><p>お客様が提供 (例: APIキー)</p></td>
   </tr>
   <tr>
     <td><p><strong>典型的なユースケース</strong></p></td>
     <td><p>密接に統合されたデプロイメントまたはカスタマイズされたデプロイメント</p></td>
     <td><p>確立されたプロバイダーの標準モデルの使用</p></td>
   </tr>
   <tr>
     <td><p><strong>セットアップの複雑さ</strong></p></td>
     <td><p>高い (オンボーディングが必要)</p></td>
     <td><p>低い (既存のAPIキーを接続)</p></td>
   </tr>
</table>

**次の場合にホストされたモデルを選択してください**:

- Zilliz Cloudとの密接な統合が必要 (単一ベンダー、統一サポート)

- カスタムモデルのファインチューニングまたは特殊なモデルが必要

- 予測可能なパフォーマンスとレイテンシが必要

- 認証情報の管理を簡素化したい

**次の場合にサードパーティモデルサービスを選択してください**:

- 既存のモデルプロバイダーとの関係がある

- OpenAIなどのプロバイダーの最新モデルを活用したい

- プロバイダーを切り替える柔軟性を好む

### サポートされているモデルプロバイダー{#supported-model-providers}

Zilliz Cloudは、さまざまな機能を提供する主要なモデルプロバイダーと統合されています。以下の表は、どのプロバイダーがテキスト埋め込みとリランキングをサポートしているかを示しています。

<Admonition type="info" icon="📘" title="Notes">

<p>プロバイダーの可用性とサポートされる機能は、地域やリリースによって異なる場合があります。最新の情報については、プロバイダー固有のドキュメントを参照してください。</p>

</Admonition>

<table>
   <tr>
     <th><p>モデルプロバイダー</p></th>
     <th><p>テキスト埋め込み</p></th>
     <th><p>リランキング</p></th>
   </tr>
   <tr>
     <td><p>OpenAI</p></td>
     <td><p><a href="https://platform.openai.com/docs/guides/embeddings#embedding-models">はい</a></p></td>
     <td><p>いいえ</p></td>
   </tr>
   <tr>
     <td><p>Voyage AI</p></td>
     <td><p><a href="https://docs.voyageai.com/docs/embeddings">はい</a></p></td>
     <td><p><a href="https://docs.voyageai.com/docs/reranker">はい</a></p></td>
   </tr>
   <tr>
     <td><p>Cohere</p></td>
     <td><p><a href="https://docs.cohere.com/docs/cohere-embed">はい</a></p></td>
     <td><p><a href="https://docs.cohere.com/docs/rerank">はい</a></p></td>
   </tr>
</table>
