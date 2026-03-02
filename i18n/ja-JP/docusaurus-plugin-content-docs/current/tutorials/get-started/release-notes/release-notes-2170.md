---
title: "リリースノート (2025年6月9日) | Cloud"
slug: /release-notes-2170
sidebar_label: "2025年6月9日"
beta: FALSE
notebook: FALSE
description: "今回のリリースでは、Zilliz Cloudの複数の機能において、より洗練された直感的なユーザーエクスペリエンスを提供します。再設計された移行コンソールから、ポリシーベースのアラート機能、改善されたmmapコントロールに至るまで、ワークフローをより高速に、より柔軟に、より管理しやすくすることに注力しました。新しいAIアシスタント機能とGCPでのBYOCのサポートにより、インフラストラクチャの管理、環境の監視、サポートの利用など、プラットフォームのパワーと使いやすさがさらに向上します。 | Cloud"
type: origin
token: DF8HwUTD6iScNQkVzs8cZTr8n8b
sidebar_position: 8
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート
  - ベクトルデータベースの仕組み
  - ベクトルDB比較
  - OpenAI ベクトルDB
  - 自然言語処理データベース

---

import Admonition from '@theme/Admonition';


# リリースノート (2025年6月9日)

今回のリリースでは、Zilliz Cloud の複数の機能において、より洗練された直感的なユーザーエクスペリエンスを提供します。再設計された移行コンソールから、ポリシーベースのアラート、改善された mmap コントロールまで、ワークフローをより高速に、より柔軟に、より管理しやすくすることに重点を置きました。新しい AI アシスタント機能と GCP での BYOC のサポートにより、インフラストラクチャの管理、環境の監視、サポートの検索など、プラットフォームの機能と使いやすさがさらに拡張されます。

## Milvus 互換性{#milvus-compatibility}

このリリース以降に作成されたすべての Zilliz Cloud クラスターは **Milvus v2.5.x** と互換性があり、Milvus v2.5.x のすべての機能は **一般提供 (GA)** されています。

## 洗練されたユーザーインターフェースとベストプラクティスドキュメントにより、移行エクスペリエンスを向上{#refined-user-interface-and-best-practice-docs-improving-the-migration-experience}

- **新しいコンソールユーザーインターフェース:** クリーンで直感的な GUI で、データソースをすばやく見つけ、適切な移行方法を選択できます。

    ![M3K4bSnIeoqBKExPdaPcd6j7nVb](https://zdoc-images.s3.us-west-2.amazonaws.com/m3k4bsnieoqbkexpdapcd6j7nvb.png "M3K4bSnIeoqBKExPdaPcd6j7nVb")

    Zilliz Cloud は、Zilliz Cloud クラスター間、Milvus インスタンスから、およびいくつかの外部ソースからの移行をサポートしています。可能なデータソースの詳細については、[移行](./migrations)を参照してください。

- **高度な collection & 構成ツール:** 改善されたデータ型サポート、動的から固定フィールドへの変換、フィールドおよび shard 設定を構成するための直感的なコントロールにより、複雑な collection およびフィールドマッピングを自信を持って処理できます。これらはすべて、応答性の高いユーザーフレンドリーなインターフェース内で提供されます。

    ![O3AebUiCjonYFSxLrbucDp5SnOb](https://zdoc-images.s3.us-west-2.amazonaws.com/o3aebuicjonyfsxlrbucdp5snob.png "O3AebUiCjonYFSxLrbucDp5SnOb")

    外部ソースからの移行の一般的な手順については、[外部移行の基本](./external-migration-basics)を参照し、[Pinecone](./migrate-from-pinecone)、[Qdrant](./migrate-from-qdrant)、[Elasticsearch](./migrate-from-elasticsearch)、[PostgreSQL](./migrate-from-pgvector)、[Tencent Cloud](./migrate-from-tencent-cloud)、[OpenSearch](./migrate-from-opensearch) などの特定の外部ソースの要件と一般的な問題処理ルールについて学ぶことができます。

## きめ細かく柔軟な監視のためのポリシーベースのアラート{#policy-based-alerts-for-granular-and-flexible-monitoring}

このアラートシステムアップグレードでは、よりきめ細かく柔軟な監視のために **アラートポリシー** が導入されました。

- **ポリシーベースのアラート:** 精度監視のために特定のクラスターをターゲットにできるようになりました。

- **ポリシーのクローン作成:** クリックするだけで既存のポリシーを複製して時間を節約できます。

- **OpenAPI サポート:** プログラムによるアクセスを介してアラート管理を自動化します。

- **シームレスな移行:** すべてのレガシーアラートは、中断することなく新しいフレームワークに移行されました。

ポリシーベースのアラートの詳細については、[プロジェクトアラートの管理](./manage-project-alerts)と、アラートルールの[作成](/reference/restful/create-alert-rule-v2)、[更新](/reference/restful/update-alert-rule-v2)、[一覧表示](/reference/restful/list-alert-rules-v2)、[削除](/reference/restful/delete-alert-rule-v2)に関する RESTful API リファレンスページを参照してください。

## mmap 設定の UI サポート{#ui-support-for-mmap-settings}

Zilliz Cloud は、CU タイプとプランに基づいて [クラスターレベルのデフォルト](./use-mmap#global-mmap-strategy) に従います。このリリース以降、collection およびフィールドレベルでグラフィカルユーザーインターフェース (GUI) から直接 **mmap 設定** を管理できます。

- **Collection レベルの構成:** 必要に応じて、mmap 設定を raw データに簡単に適用できます。

- **フィールドレベルの制御:** 特定のフィールドの raw データとインデックスデータの mmap 設定を有効、無効、または削除できます。

![JspDbBt12o4ra2x353ycjG1Mn7b](https://zdoc-images.s3.us-west-2.amazonaws.com/jspdbbt12o4ra2x353ycjg1mn7b.png "JspDbBt12o4ra2x353ycjG1Mn7b")

## BYOC が GCP で利用可能に{#byoc-now-available-on-gcp}

Zilliz Cloud **Bring Your Own Cloud (BYOC)** が **Google Cloud Platform (GCP)** をサポートするようになりました。

- **データプレーンのデプロイ:** 独自の GCP 環境で Zilliz Cloud データプレーンを実行し、データとセキュリティを完全に制御できます。

- **柔軟なセットアップオプション:** IaC 自動化のために Terraform プロバイダーを使用するか、ネットワーク、認証ルール、プロジェクトを構成するためのステップバイステップの手動ガイドに従ってください。

詳細については、手動ガイドについては [GCP で BYOC をデプロイ](/docs/byoc/deploy-byoc-gcp) を、IaC 自動化については [Terraform プロバイダー](/docs/byoc/terraform-provider) を参照してください。

## よく設計された AI アシスタンスが Zilliz サポートに直接接続{#well-designed-ai-assistance-connects-you-directly-to-zilliz-supports}

このリリースでは、Zilliz Cloud AI アシスタンスの視覚デザインが強化され、より直感的で快適なユーザーエクスペリエンスが提供され、2つの新しいスマート機能が導入されました。

- **サポートへのエスカレート:** 人間によるサポートのリクエストを自動的に検出し、迅速にルーティングします。

- **販売シグナルの検出:** 購入意図と販売関連の合図を特定し、タイムリーなフォローアップを行います。

![OQTSbop2WoTH2px3o5tcbDmmnYf](https://zdoc-images.s3.us-west-2.amazonaws.com/oqtsbop2woth2px3o5tcbdmmnyf.png "OQTSbop2WoTH2px3o5tcbDmmnYf")

## その他の改善点{#other-improvements}

- アラート設定とアラート履歴表示の改善。

- **招待登録** と **パスワード回復** のワークフローを合理化。

