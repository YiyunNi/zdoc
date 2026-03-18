---
title: "リリースノート (2025年4月24日) | Cloud"
slug: /release-notes-2150
sidebar_label: "2025年4月24日"
beta: FALSE
notebook: FALSE
description: "Zilliz BYOCにはいくつかの機能強化が導入され、BYOCプロジェクトのインスタンス設定を構成したり、クラスターのAWS PrivateLinkを有効にしたりできるようになりました。 | Cloud"
type: origin
token: JPNiwF6rPiNe0pkx460cr321nTc
sidebar_position: 10
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート

---

import Admonition from '@theme/Admonition';


# リリースノート (2025年4月24日)

Zilliz BYOCはいくつかの機能強化を導入し、BYOCプロジェクトのインスタンス設定を構成したり、クラスターのAWS プライベートLinkを有効にしたりできるようになりました。

## Milvus互換性\{#milvus-compatibility}

このリリースは**Milvus v2.5.x**と互換性があります。

- このリリース以降に作成されたすべてのZilliz Cloudクラスターは、Milvus v2.5.xと互換性があります。

- このリリース以前に作成されたクラスターの場合、Milvus v2.5.xの機能をお試しいただくには、以下の図に示す黄色の四角で囲まれたボタンをクリックする必要がある場合があります。

現在、すべてのMilvus v2.5.x機能はまだ**パブリックプレビュー**です。

![GeJSbANVto14OtxFg6zcPFAYnZz](https://zdoc-images.s3.us-west-2.amazonaws.com/gejsbanvto14otxfg6zcpfaynzz.png "GeJSbANVto14OtxFg6zcPFAYnZz")

## インスタンス設定とAWS プライベートLinkサポートで強化されたBYOC\{#byoc-enhanced-with-instance-settings-and-aws-privatelink-support}

Zilliz BYOCプロジェクトでは、サービスは**検索サービス**、**その他のデータベースコンポーネント**、**コアサポートサービス**のいくつかのグループに編成されています。このリリースでは、プロジェクト作成時に各サービスグループのインスタンスタイプと数量を定義できるようになりました。

設定を簡素化するために、Zilliz BYOCは**小**、**中**、**大**、**特大**の4つの事前定義されたプロジェクトサイズを提供しており、ワークロード要件に最適なオプションを選択できます。

このリリースでは、VPCからZilliz Cloud コントロールプレーンへの安全なプライベート接続のために**AWS プライベートLink**を有効または無効にする機能も導入されています。プライベートLinkはデフォルトで有効になっています。

設定手順の詳細については、[AWSへのBYOCのデプロイ](/docs/byoc/deploy-byoc-aws)および[AWSへのBYOC-Iのデプロイ](/docs/byoc/deploy-byoc-i-aws)を参照してください。

## JSONフィールド内のきめ細かなフィルタリング\{#fine-granular-filtering-within-a-json-field}

以前は、JSONフィールドはインデックス化されておらず、すべてのフィルタークエリは各エンティティのJSONフィールド全体をスキャンする必要がありました。このリリースでは、JSONフィールド内の特定のパスに転置インデックスを作成して、クエリを高速化できるようになりました。
JSONフィールドをインデックス化するには、インデックスタイプを**INVERTED**に設定し、最適化したいJSONパスを指定し、その値を適切なデータ型にキャストします。メタデータフィルタリング中、Zilliz Cloudは各JSONフィールド値内の指定されたパスのみをスキャンするため、解析時間を大幅に短縮し、フィルタリングパフォーマンスを向上させます。

JSONフィールドのインデックス化方法とその考慮事項の詳細については、[JSONフィールドの使用](./use-json-fields)を参照してください。

## その他の機能強化\{#other-enhancements}

クラスターのレプリカ数変更のための新しいRESTful APIエンドポイントが追加されました。詳細については、[クラスターレプリカの変更](/reference/restful/modify-cluster-replica-v2)を参照してください。

