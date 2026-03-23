---
title: "リリースノート (2025年6月9日) | Cloud"
slug: /release-notes-2170
sidebar_label: "2025年6月9日"
beta: FALSE
notebook: FALSE
description: "今回のリリースでは、Zilliz Cloud の複数の機能において、より洗練された直感的なユーザーエクスペリエンスを提供します。再設計された移行コンソールから、ポリシーベースのアラート、改善された mmap コントロールに至るまで、ワークフローをより高速に、より柔軟に、より管理しやすくすることに注力しました。新しい AI アシスタント機能と GCP での BYOC のサポートにより、インフラストラクチャの管理、環境の監視、サポートのいずれにおいても、プラットフォームのパワーと使いやすさがさらに向上します。 | Cloud"
type: origin
token: DF8HwUTD6iScNQkVzs8cZTr8n8b
sidebar_position: 9
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - リリースノート

---

import Admonition from '@theme/Admonition';


# リリースノート (2025年6月9日)

今回のリリースでは、Zilliz Cloudの複数の機能において、より洗練された直感的なユーザーエクスペリエンスを提供します。再設計された移行コンソールから、ポリシーベースのアラート、改善されたmmapコントロールまで、ワークフローをより速く、より柔軟に、より管理しやすくすることに重点を置きました。新しいAIアシスタント機能とGCPでのBYOCのサポートにより、インフラストラクチャの管理、環境の監視、サポートの検索など、プラットフォームのパワーと使いやすさがさらに拡張されます。

## Milvus互換性\{#milvus-compatibility}

このリリース以降に作成されたすべてのZilliz Cloudクラスターは、**Milvus v2.5.x**と互換性があり、Milvus v2.5.xのすべての機能は**一般提供**されています。

## 洗練されたユーザーインターフェースとベストプラクティスドキュメントにより、移行エクスペリエンスを向上\{#refined-user-interface-and-best-practice-docs-improving-the-migration-experience}

- **新しいコンソールユーザーインターフェース:** クリーンで直感的なGUIで、データソースを素早く特定し、適切な移行方法を選択できます。

    ![M3K4bSnIeoqBKExPdaPcd6j7nVb](https://zdoc-images.s3.us-west-2.amazonaws.com/m3k4bsnieoqbkexpdapcd6j7nvb.png "M3K4bSnIeoqBKExPdaPcd6j7nVb")

    Zilliz Cloudは、Zilliz Cloudクラスター間、Milvusインスタンスから、およびいくつかの外部ソースからの移行をサポートしています。可能なデータソースの詳細については、[移行](./migrations)を参照してください。

- **高度なコレクションと設定ツール:** 改善されたデータ型サポート、動的から固定フィールドへの変換、フィールドとシャード設定を構成するための直感的なコントロールにより、複雑なコレクションとフィールドマッピングを自信を持って処理できます。これらはすべて、応答性の高いユーザーフレンドリーなインターフェース内で実行されます。

    ![O3AebUiCjonYFSxLrbucDp5SnOb](https://zdoc-images.s3.us-west-2.amazonaws.com/o3aebuicjonyfsxlrbucdp5snob.png "O3AebUiCjonYFSxLrbucDp5SnOb")

    外部ソースからの移行の一般的な手順については、[外部移行の基本](./external-migration-basics)を読み、[Pinecone](./migrate-from-pinecone)、[Qdrant](./migrate-from-qdrant)、[Elasticsearch](./migrate-from-elasticsearch)、[PostgreSQL](./migrate-from-pgvector)、[Tencent Cloud](./migrate-from-tencent-cloud)、[OpenSearch](./migrate-from-opensearch)を含む特定の外部ソースの要件と一般的な問題処理ルールについて学ぶことができます。

## きめ細かく柔軟な監視のためのポリシーベースのアラート\{#policy-based-alerts-for-granular-and-flexible-monitoring}

このアラートシステムアップグレードでは、よりきめ細かく柔軟な監視のために**アラートポリシー**が導入されました。

- **ポリシーベースのアラート:** 精度監視のために特定のクラスターをターゲットにできるようになりました。

- **ポリシーのクローン:** 既存のポリシーをワンクリックで複製することで時間を節約できます。

- **OpenAPIサポート:** プログラムによるアクセスを介してアラート管理を自動化します。

- **シームレスな移行:** すべてのレガシーアラートは、中断することなく新しいフレームワークに移行されました。

ポリシーベースのアラートの詳細については、[プロジェクトアラートの管理](./manage-project-alerts)と、アラートルールの[作成](/reference/restful/create-alert-rule-v2)、[更新](/reference/restful/update-alert-rule-v2)、[リスト表示](/reference/restful/list-alert-rules-v2)、[削除](/reference/restful/delete-alert-rule-v2)に関するRESTful APIリファレンスページを参照してください。

## mmap設定のUIサポート\{#ui-support-for-mmap-settings}

Zilliz Cloudは、CUタイプとプランに基づいて[クラスターレベルのデフォルト](./use-mmap#global-mmap-strategy)に従います。このリリース以降、コレクションレベルとフィールドレベルでグラフィカルユーザーインターフェース (GUI) から直接**mmap設定**を管理できます。

- **コレクションレベルの設定:** 必要に応じて、mmap設定を未加工データに簡単に適用できます。

- **フィールドレベルの制御:** 特定のフィールドの未加工データとインデックスデータのmmap設定を有効、無効、または削除できます。

![JspDbBt12o4ra2x353ycjG1Mn7b](https://zdoc-images.s3.us-west-2.amazonaws.com/jspdbbt12o4ra2x353ycjg1mn7b.png "JspDbBt12o4ra2x353ycjG1Mn7b")

## BYOCがGCPで利用可能に\{#byoc-now-available-on-gcp}

Zilliz Cloudの**Bring Your Own Cloud (BYOC)**が**Google Cloud Platform (GCP)**をサポートするようになりました。

- **データプレーンのデプロイ:** 独自のGCP環境でZilliz Cloud データプレーンを実行し、データとセキュリティを完全に制御できます。

- **柔軟なセットアップオプション:** IaC自動化のためにTerraformプロバイダーを使用するか、ネットワーク、認証ルール、プロジェクトを設定するためのステップバイステップの手動ガイドに従ってください。

詳細については、手動ガイドについては[GCPにBYOCをデプロイ](/docs/byoc/deploy-byoc-gcp)を、IaC自動化については[Terraformプロバイダー](/docs/byoc/terraform-provider)を参照してください。

## Zillizサポートに直接接続する優れたAIアシスタンス\{#well-designed-ai-assistance-connects-you-directly-to-zilliz-supports}

このリリースでは、Zilliz Cloud AIアシスタンスの視覚デザインが強化され、より直感的で快適なユーザーエクスペリエンスが実現し、2つの新しいスマート機能が導入されました。

- **サポートへのエスカレート:** 人間によるサポートのリクエストを自動的に検出し、迅速にルーティングします。

- **販売シグナルの検出:** 購入意図と販売関連の合図を特定し、タイムリーなフォローアップを行います。

![OQTSbop2WoTH2px3o5tcbDmmnYf](https://zdoc-images.s3.us-west-2.amazonaws.com/oqtsbop2woth2px3o5tcbdmmnyf.png "OQTSbop2WoTH2px3o5tcbdmmnyf")

## その他の改善点\{#other-improvements}

- アラート設定とアラート履歴表示の改善。

- **招待登録**と**パスワード回復**のワークフローを合理化。

