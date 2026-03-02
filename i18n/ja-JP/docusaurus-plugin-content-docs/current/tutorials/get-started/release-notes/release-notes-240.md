---
title: "リリースノート (2023年12月11日) | Cloud"
slug: /release-notes-240
sidebar_label: "2023年12月11日"
beta: FALSE
notebook: FALSE
description: "Zilliz CloudサービスがAzureで利用可能になりました。まずは米国東部リージョンから提供を開始します。さらに、非構造化データをベクトル埋め込みに変換し、取り込みと検索を可能にするZilliz Cloud Pipelines (ベータ版) を導入します。今回のリリースでは、クラスター内のRBACと認証情報管理も改善され、ユーザー管理のために3つの事前定義されたロール (admin、read-write、read-only) が追加されました。その他の更新には、エラーメッセージの内容の改善と、より信頼性の高いサービスのための安定性の向上が含まれます。 | Cloud"
type: origin
token: A5lpwIZcZiTLqakdt6rcCmPcnEe
sidebar_position: 22
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート
  - マルチモーダルRAG
  - LLMの幻覚
  - ハイブリッド検索
  - レキシカル検索

---

import Admonition from '@theme/Admonition';


# リリースノート (2023年12月11日)

Zilliz CloudサービスがAzureで利用可能になりました。まずは米国東部リージョンから提供を開始します。さらに、非構造化データをベクトル埋め込みに変換して取り込みと検索を行うZilliz Cloud Pipelines (ベータ版) を導入します。このリリースでは、クラスター内のRBACと認証情報管理も改善され、ユーザー管理のために3つの事前定義されたロール (管理者、読み書き、読み取り専用) が追加されました。その他の更新には、エラーメッセージの内容の改善と、より信頼性の高いサービスのための安定性向上が含まれます。

## Milvus互換性{#milvus-compatibility}

このリリースは、**Milvus 2.2.x** および **Milvus 2.3.x (ベータ版)** と互換性があります。

## Azure上のZilliz Cloud{#zilliz-cloud-on-azure}

Zilliz CloudサービスがAzureで利用可能になり、まずは米国東部リージョンから提供を開始することをお知らせできることを大変嬉しく思います。これは、当社のプラットフォームがAWS、GCP、Azureの3つの主要なパブリッククラウドとシームレスに統合され、複数の環境で一貫した統一されたユーザーエクスペリエンスを保証する重要なマイルストーンとなります。Azure米国東部以外のリージョンでのデプロイが必要な場合は、[お問い合わせください](https://support.zilliz.com/hc/en-us)。

## パイプライン{#pipelines}

本日、Zilliz CloudにZilliz Cloud Pipelines (ベータ版) を導入できることを大変嬉しく思います。Pipelinesは、非構造化データをベクトル埋め込みにシームレスに変換し、Zilliz Cloudに取り込んで保存および検索することで、非構造化データの可能性を解き放つように設計されています。このソリューションは、埋め込み、取り込み、保存、検索などのプロセスを統合することでデータワークフローを簡素化し、最先端の[Retrieval Augmented Generation (RAG)](https://zilliz.com/use-cases/llm-retrieval-augmented-generation)などの最新の検索アプリケーションを構築する際に、複数のスタックを統合するのに苦労する開発者にとって歓迎すべき救済策となります。

Zilliz Cloud Pipelinesは、取り込み、検索、削除の3つの特定のパイプラインで構成されています。

- **取り込みパイプライン**は、非構造化データを処理し、検索可能なベクトル埋め込みに変換して、Zilliz Vector Databaseに取り込み、保存および検索を行う主力です。

- **検索パイプライン**は、クエリ文字列をベクトル埋め込みに変換し、Zilliz Cloudに送信して上位K個の最も類似したベクトルを取得することで、セマンティック検索を容易にします。

- **削除パイプライン**を使用すると、指定されたドキュメント内のすべてのチャンクをZilliz Cloud collectionから削除でき、独自のデータを完全に制御し、Zilliz collectionのストレージ容量を解放できます。

## クラスター内のRBACと認証情報管理{#rbac-and-credential-management-in-your-clusters}

このリリースでは、各クラスター内でRBAC (ロールベースアクセス制御) と認証情報を管理するための機能が強化されました。この合理化されたアプローチにより、ユーザーはクラスターユーザーを効率的に管理できます。これらの機能にアクセスするには、「Clusters」セクションに移動し、「your_cluster」を選択してから、「Users」タブに進みます。このリリースには、簡素化されたユーザー管理のために「admin」、「read-write」、「read-only」の3つの事前定義されたロールが含まれており、それぞれ異なるレベルのアクセスと制御のニーズに合わせて調整されています。これらの新しい機能の利用に関するより包括的な詳細とガイダンスについては、[ドキュメント](./access-control)を参照してください。

## 新しいクラスター操作APIエンドポイント{#new-cluster-manipulation-api-endpoints}

このリリースでは、クラスターの作成、変更、削除、およびプロジェクトのリスト表示を行うための新しいRESTful APIエンドポイントのセットも導入しました。詳細については、[リファレンスドキュメント](/reference/restful/cluster-operations)を参照してください。

## 強化{#enhancements}

このリリースには、一連の機能強化も含まれています。

- 一連のエラーメッセージの内容を改善しました。

- 安定性の向上: 既知の問題に対処し、サービスの信頼性をさらに向上させました。

