---
title: "VectorDB 監査ログ | BYOC"
slug: /audit-logs
sidebar_label: "VectorDB 監査ログ"
beta: FALSE
notebook: FALSE
description: "監査ログ機能により、管理者は Zilliz Cloud クラスターにおけるユーザー操作や API コールを追跡・監視できます。この機能は、ベクトル検索、クエリ実行、インデックス管理、その他のデータ操作など、ベクトルデータベースのアクティビティの詳細な記録を提供します。| BYOC"
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

監査ログにより、管理者は Zilliz Cloud クラスターにおけるユーザー駆動型の運用および API コールを追跡・監視できます。この機能は、ベクトル検索、クエリ実行、インデックス管理、その他のデータ操作を含む、vector db アクティビティの詳細な記録を提供します。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>監査ログは、<strong>Enterprise</strong> プロジェクト以上のプラン階層にある<strong>Dedicated</strong> クラスターでのみ利用可能です。</p></li>
<li><p>監査ログは、Milvus 2.5.x を実行している Zilliz Cloud クラスターでのみサポートされています。</p></li>
<li><p>監査ログは、<a href="./integrate-with-aws-s3">AWS S3</a>、<a href="./integrate-with-azure-blob-storage">Azure Blob Storage</a>、または <a href="./integrate-with-gcp">Google Cloud Storage</a> に転送できます。</p></li>
<li><p>監査ログを有効にすると料金が発生します。詳細については、<a href="./audit-log-cost">監査ログ</a>をご覧ください。</p></li>
</ul>

</Admonition>

## 概要\{#overview}

監査ログは、データプレーン上の幅広い運用を追跡します。これには以下が含まれます：

- **検索およびクエリ運用**: ベクトル検索、ハイブリッド検索、およびクエリ操作。

- **データ管理**: インデックス作成、コレクション作成、パーティション管理、および挿入、削除、アップサートなどのエンティティ操作。

- **システムイベント**: ユーザーアクセス試行、認証チェック、およびその他の事前定義されたアクション。

<Admonition type="info" icon="📘" title="Notes">

<p>移行、バックアップ、リストアなどのクラスターレベルのデータジョブは、監査ログを生成しません。これらのアクティビティ記録を確認するには、<a href="./view-activities">アクティビティの表示</a> を参照してください。</p>

</Admonition>

監査ログは、定期的な間隔でユーザーが指定したオブジェクトストレージバケットに直接転送されます。ログは、容易なアクセスと管理のために構造化されたファイルパスおよび命名形式で保存されます：

- **ファイルパス**: `/<クラスターID>/<Log type>/<Date>`

- **ファイル命名規則**: *HH:MM:SS-&#36;UUID* 形式の `<File name><File name suffix>`。ここで、*HH:MM:SS* は UTC 時間の時刻を表し、*&#36;UUID* は固有のランダム文字列です。例：`09:16:53-jz5l7D8Q`。

以下は、バケットに転送された監査ログエントリーの例です：

- **コレクションの作成**

    ```json
    {
      "action": "CreateCollection",
      "cluster_id": "in01-0045a626277eafb",
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
      "cluster_id": "in01-0045a626277eafb",
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
      "cluster_id": "in01-0045a626277eafb",
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

詳細なサポート対象アクションと対応するログフィールドの一覧については、[監査ログリファレンス](./audit-logs-ref) を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<p>監査ログは、データプレーンのデプロイ時に設定されたオブジェクトストレージバケットに直接転送されます。</p>
<p>ログをログシステムにエクスポートしてさらに分析を行うには、<a href="https://support.zilliz.com/hc/en-us/requests/new">お問い合わせください</a>。</p>

</Admonition>

