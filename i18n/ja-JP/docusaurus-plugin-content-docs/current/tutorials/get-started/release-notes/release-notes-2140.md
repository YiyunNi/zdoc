---
title: "リリースノート (2025年3月27日) | Cloud"
slug: /release-notes-2140
sidebar_label: "2025年3月27日"
beta: FALSE
notebook: FALSE
description: "このリリースでは、PRIVATE PREVIEWで2つの新機能が導入されます。1つはBYOC-Iと呼ばれる新しいBYOCデプロイオプションで、もう1つはデータプレーン監査ログ機能です。前者は、クロスアカウントIAM認証なしで完全なデータ主権を保証するように設計されており、後者は、データプレーンで実行されたアクションの詳細なログを提供することでデータセキュリティを強化することを目的としています。これらの機能のリリースに加えて、Zilliz Cloudはクレジット戦略も改訂しました。 | Cloud"
type: origin
token: FSUqwEEIii9k2sklkcLcIFJJnbf
sidebar_position: 10
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - リリースノート
  - 動画類似性検索
  - ベクトル検索
  - 音声類似性検索
  - エラスティックベクトルデータベース

---

import Admonition from '@theme/Admonition';


# リリースノート (2025年3月27日)

今回のリリースでは、2つの新機能が**PRIVATE PREVIEW**として導入されます。1つはBYOC-Iと呼ばれる新しいBYOCデプロイオプションで、もう1つはデータプレーン監査ログ機能です。前者は、クロスアカウントIAM認証なしで完全なデータ主権を保証するように設計されており、後者は、データプレーンで実行されたアクションの詳細なログを提供することでデータセキュリティを強化することを目的としています。これらの機能のリリースに加えて、Zilliz Cloudはクレジット戦略も改訂しました。

## Milvus互換性\{#milvus-compatibility}

このリリースは**Milvus v2.4.x**と互換性があります。

クラスターを**Public Preview**にアップグレードしたい場合は、アップグレード後に**Milvus 2.5.x**の機能が利用可能になります。Zilliz Cloudコンソールの**Cluster Details**ページで**Try Preview Features**をクリックすると、**Public Preview**の機能について詳しく知ることができます。

![Koy0bfMhuoaJ2ZxtVJfcUSl9n6d](https://zdoc-images.s3.us-west-2.amazonaws.com/koy0bfmhuoaj2zxtvjfcusl9n6d.png "Koy0bfMhuoaJ2ZxtVJfcUSl9n6d")

## BYOC-I: 強化されたプロジェクト管理機能で完全なデータ主権を提供する新しいデプロイオプション\{#byoc-i-a-new-deployment-option-that-provides-complete-data-sovereignty-with-enhanced-project-management-capabilities}

BYOC-Iの追加により、Zilliz BYOCは標準の**BYOC**と**BYOC-I**の2つのデプロイオプションを提供するようになりました。

クロスアカウント認証を必要とする標準のBYOCとは異なり、BYOC-Iは、ZillizのVPC内のコントロールパネルと顧客管理VPC内のデータプレーン間の単一の連絡先として、顧客管理VPCにデプロイされたエージェントを使用します。

Zilliz BYOCは、金融、ヘルスケア、リソース、教育、Eコマースなど、厳格なコンプライアンス要件に直面する業界全体でデータガバナンスとコンプライアンスをサポートします。より厳格な規制措置を必要とする企業や組織にとって、BYOC-Iは完全なデータ主権を達成するための理想的なデプロイオプションです。

このリリースでは、標準のBYOCデプロイオプションを使用してデプロイされたプロジェクトの管理も改善され、**Suspend**および**Resume**機能が追加されました。データプレーンを一時停止し、EKSクラスターに関連付けられたEC2インスタンスを解放してインフラストラクチャコストを削減し、必要に応じてデータプレーンを復元することができます。

このリリースでは、Zilliz BYOCが一般提供されます。ご興味のある方は、価格について知りたい場合やこの機能をリクエストしたい場合は、[お問い合わせください](https://support.zilliz.com/hc/en-us)。

Zilliz BYOCデプロイオプションの詳細については、[BYOC概要](/docs/byoc/byoc-intro)を参照してください。デプロイ手順と強化されたプロジェクト管理機能については、[AWSへのBYOCデプロイ](/docs/byoc/deploy-byoc-aws)および[AWSへのBYOC-Iデプロイ](/docs/byoc/deploy-byoc-i-aws)を参照してください。

## データプレーン監査ログ: 監査のための包括的なアクションログでデータ操作を保護\{#data-plane-audit-logs-protect-your-data-operations-with-comprehensive-action-logs-for-auditing}

監査ログは、管理者がZilliz Cloudクラスター上のユーザー主導の操作とAPI呼び出しを監視および追跡できるようにします。この機能は、ベクトル検索、クエリ実行、インデックス管理、さまざまなデータ操作などの**データプレーン**アクティビティの包括的な記録を提供します。また、セキュリティ監査、コンプライアンスレビュー、問題解決のためにデータがどのようにアクセスおよび管理されているかについての洞察と可視性も提供します。

この機能を有効にすると、Zilliz Cloudは監査ログを指定されたオブジェクトストレージバケットにストリーミングします。その後、Snowflakeなどのサードパーティのデータウェアハウスサービスを使用して監査分析を行い、クラスターの規制コンプライアンス、データセキュリティ、運用監視を強化できます。

この機能は現在**PRIVATE PREVIEW**です。ご興味のある方は、価格について知りたい場合やこの機能をリクエストしたい場合は、[お問い合わせください](https://support.zilliz.com/hc/en-us)。

クラスターで監査ログを有効にする手順の詳細については、[監査ログ](./audit-logs)を参照してください。Snowflakeなどのサードパーティのデータウェアハウスサービスを使用して収集された監査ログからより深い洞察を得るには、[Automating Snowpipe for Amazon S3](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-auto-s3)を参照してください。

Zilliz Cloudは現在、コレクション、データベース、エンティティ (Search、HybridSearch、Insert、Upsert、Delete)、インデックス、パーティション、エイリアスに関連する70種類以上のアクションとイベントのログをサポートしています。今後のリリースでさらに多くのイベントが追加される予定です。適用されるアクションとイベントの詳細については、[監査ログリファレンス](./audit-logs-ref)を参照してください。

## その他の機能強化\{#other-enhancements}

今回のリリース以降、Zilliz Cloudはクレジット戦略を調整しました。新しいクレジット戦略の詳細については、[Zilliz Cloudを無料で試す](./free-trials)を参照してください。

