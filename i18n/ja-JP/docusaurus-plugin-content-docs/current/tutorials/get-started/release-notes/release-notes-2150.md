---
title: "リリースノート (2025年4月24日) | Cloud"
slug: /release-notes-2150
sidebar_label: "2025年4月24日"
beta: FALSE
notebook: FALSE
description: "Zilliz CloudでZero-Downtime Migrationがプライベートプレビューで利用可能になりました！クラスターのアップグレードや、Capacity-optimized Compute Units (CU) から別のオプションへの切り替えなど、デプロイメントに変更を加える必要がある場合でも、サービスを中断することなくデータを簡単に移行できます。さらに、Zilliz BYOCにはいくつかの機能強化が導入され、BYOCプロジェクトのインスタンス設定を構成したり、クラスターのAWS PrivateLinkを有効にしたりできるようになりました。 | Cloud"
type: origin
token: JPNiwF6rPiNe0pkx460cr321nTc
sidebar_position: 9
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート
  - Annoy ベクトル検索
  - milvus
  - Zilliz
  - milvus ベクトルデータベース

---

import Admonition from '@theme/Admonition';


# リリースノート (2025年4月24日)

Zilliz CloudでZero-Downtime Migrationが**プライベートプレビュー**で利用可能になりました！クラスターのアップグレードが必要な場合でも、デプロイメントに変更を加える場合でも、例えばCapacity-optimized Compute Units (CU)から別のオプションに切り替える場合でも、サービスを中断することなくデータを簡単に移行できます。さらに、Zilliz BYOCにはいくつかの機能強化が導入され、BYOCプロジェクトのインスタンス設定を構成したり、クラスターのAWS PrivateLinkを有効にしたりできるようになりました。

## Milvus互換性{#milvus-compatibility}

このリリースは**Milvus v2.5.x**と互換性があります。

- このリリース以降に作成されたすべてのZilliz Cloudクラスターは、Milvus v2.5.xと互換性があります。

- このリリースより前に作成されたクラスターの場合、Milvus v2.5.xの機能と特徴を試すには、以下の図に示す黄色の四角で囲まれたボタンをクリックする必要がある場合があります。

現在、すべてのMilvus v2.5.x機能はまだ**パブリックプレビュー**です。

![GeJSbANVto14OtxFg6zcPFAYnZz](https://zdoc-images.s3.us-west-2.amazonaws.com/gejsbanvto14otxfg6zcpfaynzz.png "GeJSbANVto14OtxFg6zcPFAYnZz")

## サービス中断を最小限に抑えたシームレスなデータ移行{#seamless-data-migration-with-minimal-service-interruption}

以前のリリースでは、クラスター間のデータ移行には慎重に計画されたダウンタイムが必要であり、厳格な可用性要件を持つビジネスにとって障害となっていました。Zero-Downtime Migrationにより、Zilliz Cloudはこの複雑さを解消し、シームレスで完全に管理された移行エクスペリエンスを提供します。

この機能は、バックアップツールとChange Data Capture (CDC)という2つのコンポーネントを組み合わせたデュアルスタック戦略を使用します。バックアップツールはソースクラスターの一貫したスナップショットをキャプチャし、CDCは新しい書き込みをリアルタイムでターゲットクラスターに継続的に追跡およびレプリケートします。

Zilliz Cloudのネイティブ移行フローは以下を保証します。

- 履歴データとリアルタイム更新の一貫性、

- 正しいイベント順序と堅牢なフォールトトレランス、

- 書き込み競合、競合状態、スキーマの不一致からの保護、および

- 移行プロセス全体におけるソースクラスターとターゲットクラスター間のスムーズな状態遷移。

Zero-Downtime Migrationは、Zilliz Cloudコンソールで**プライベートプレビュー**として利用可能になりました。ログインして最初の移行を開始してください。ダウンタイムは不要です。詳細な操作手順と制限については、[Zero Downtime Migration](./zero-downtime-migration)を参照してください。

## インスタンス設定とAWS PrivateLinkサポートで強化されたBYOC{#byoc-enhanced-with-instance-settings-and-aws-privatelink-support}

Zilliz BYOCプロジェクトでは、サービスは**Search Services**、**Other Database Components**、**Core Support Services**を含むいくつかのグループに編成されています。このリリースにより、プロジェクト作成時に各サービスグループのインスタンスタイプと数量を定義できるようになりました。

設定を簡素化するために、Zilliz BYOCは**Small**、**Medium**、**Large**、**X-Large**の4つの事前定義されたプロジェクトサイズを提供しており、ワークロード要件に最適なオプションを選択できます。

このリリースでは、VPCからZilliz Cloud Control Planeへの安全でプライベートな接続のために**AWS PrivateLink**を有効または無効にする機能も導入されています。PrivateLinkはデフォルトで有効になっていることに注意してください。

設定手順の詳細については、[Deploy BYOC on AWS](/docs/byoc/deploy-byoc-aws)および[Deploy BYOC-I on AWS](/docs/byoc/deploy-byoc-i-aws)を参照してください。

## JSONフィールド内のきめ細かいフィルタリング{#fine-granular-filtering-within-a-json-field}

以前は、JSONフィールドはインデックス化されておらず、すべてのフィルタークエリは各entity内のJSONフィールド全体をスキャンする必要がありました。このリリースにより、JSONフィールド内の特定のパスに転置インデックスを作成して、クエリを高速化できるようになりました。
JSONフィールドをインデックス化するには、インデックスタイプを**INVERTED**に設定し、最適化したいJSONパスを指定し、その値を適切なデータ型にキャストします。メタデータフィルタリング中、Zilliz Cloudは各JSONフィールド値内の指定されたパスのみをスキャンするため、解析時間を大幅に短縮し、フィルタリングパフォーマンスを向上させます。

JSONフィールドのインデックス化方法とその考慮事項の詳細については、[Index a JSON field](./use-json-fields)を参照してください。

## その他の機能強化{#other-enhancements}

クラスターのreplica数を変更するための新しいRESTful APIエンドポイントが追加されました。詳細については、[Modify Cluster Replica](/reference/restful/modify-cluster-replica-v2)を参照してください。

