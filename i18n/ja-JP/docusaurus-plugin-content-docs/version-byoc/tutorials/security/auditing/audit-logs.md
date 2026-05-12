---
title: "VectorDB 監査ログ | BYOC"
slug: /audit-logs
sidebar_key: audit-logs
sidebar_label: "VectorDB 監査ログ"
beta: FALSE
notebook: FALSE
description: "監査ログ機能により、管理者は Zilliz Cloud クラスター上でのユーザー主導の操作や API 呼び出しを追跡・監視できます。この機能は、ベクトル検索、クエリ実行、インデックス管理、その他のデータ操作など、ベクトルデータベースのアクティビティの詳細な記録を提供します。 | BYOC"
type: origin
token: M5dXwsGOOiPdAjkWLZUc2Pxonuh
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 監査
  - ログ
  - 設定

---

import Admonition from '@theme/Admonition';


# VectorDB 監査ログ

監査ログ機能により、管理者は Zilliz Cloud クラスター上のユーザー主導の運用と API 呼び出しを追跡・監視できます。この機能は、ベクトル検索、クエリ実行、インデックス管理、その他のデータ運用を含むベクトル DB アクティビティの詳細な記録を提供します。

<Admonition type="info" icon="📘" title="Notes">

- 監査ログ機能は、**Enterprise** プロジェクトまたはそれ以上のプラン層の **Dedicated** クラスターでのみ利用可能です。

- 監査ログ機能は、Milvus 2.5.x 以降を実行している Zilliz Cloud クラスターのみでサポートされています。

- BYOC デプロイメントでは、VDB 監査ログはデータプレーンのローカルオブジェクトストレージ（S3/Azure Blob Storage/GCS）に構成されたログバケットに直接書き込まれ、データがお客様のインフラストラクチャから流出しないようにしています。監査ログの有効化と構成については、[お問い合わせ](https://support.zilliz.com/hc/en-us) ください。

</Admonition>

## Overview\{#overview}

監査ログは、データプレーン上の幅広い運用を追跡します。これには以下が含まれます：

- **検索およびクエリ運用**: ベクトル検索、ハイブリッド検索、およびクエリ運用。

- **データ管理**: インデックス作成、コレクション作成、パーティション管理、および insert、delete、upsert などのエンティティ運用。

- **システムイベント**: ユーザーアクセス試行、認可チェック、その他の定義済みアクション。

<Admonition type="info" icon="📘" title="Notes">

クラスターレベルのデータジョブ（移行、バックアップ、リストアなど）は監査ログを生成しません。これらのアクティビティ記録を表示するには、[アクティビティの表示](./view-activities) を参照してください。

</Admonition>

監査ログは、定期的にユーザーが指定したオブジェクトストレージバケットに直接転送されます。ログは、アクセスと管理を容易にするため、構造化されたファイルパスおよび命名形式で保存されます：

- **ファイルパス**: `/<クラスターID>/<Log type>/<Date>`

- **ファイル命名規則**: `<File name><File name suffix>` の形式は *HH:MM:SS-&#36;UUID* で、*HH:MM:SS* は UTC の時刻、*&#36;UUID* は一意のランダム文字列を表します。例: `09:16:53-jz5l7D8Q`。

以下は、バケットに転送された監査ログエントリの例です：

- **コレクションの作成**

    ```json
    {
      "action": "CreateCollection",
      "cluster_id": "inxx-xxxxxxxxxxxxxxx",
      "connection_uid": 456912553983082500,
      "database": "default",
      "interface": "Grpc",
      "log_type": "AUDIT",
      "params": {
        "collection": "test_audit",
        "consistency_level": 2
      },
      "status": "Receive",
      "timestamp": 1742983070463,
      "trace_id": "216a8129c06fd3d93a47bd69fa0a65ad",
      "user": "key-hwjsxhwppegkatwjaivsgf"
    }
    ```

- **Create Index**

    ```json
    {
      "action": "CreateIndex",
      "cluster_id": "inxx-xxxxxxxxxxxxxxx",
      "connection_uid": 456912553983082500,
      "database": "default",
      "interface": "Grpc",
      "log_type": "AUDIT",
      "params": {
        "collection": "test_audit"
      },
      "status": "Receive",
      "timestamp": 1742983070645,
      "trace_id": "4402e7bfc498dd06be1408c7e6a7954d",
      "user": "key-hwjsxhwppegkatwjaivsgf"
    }
    ```

- **インデックスの削除**

    ```json
    {
      "action": "DropIndex",
      "cluster_id": "inxx-xxxxxxxxxxxxxxx",
      "connection_uid": 456912553983082500,
      "database": "default",
      "interface": "Grpc",
      "log_type": "AUDIT",
      "params": {
        "collection": "test_audit"
      },
      "status": "Receive",
      "timestamp": 1742983073378,
      "trace_id": "066ec33c3f55d3edbf7d01c6270024e2",
      "user": "key-hwjsxhwppegkatwjaivsgf"
    }
    ```

詳細なサポート対象アクションおよび対応するログフィールドの一覧については、[監査ログリファレンス](./audit-logs-ref) を参照してください。

<Admonition type="info" icon="📘" title="Notes">

監査ログは、データプレーンのデプロイ時に設定されたオブジェクトストレージバケットに直接転送されます。

ログをログシステムにエクスポートしてさらに分析するには、[お問い合わせ](https://support.zilliz.com/hc/en-us/requests/new) ください。

</Admonition>

