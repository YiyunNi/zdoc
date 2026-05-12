---
title: "VectorDB 監査ログ | Cloud"
slug: /audit-logs
sidebar_key: audit-logs
sidebar_label: "VectorDB 監査ログ"
beta: FALSE
notebook: FALSE
description: "監査ログ機能により、管理者は Zilliz Cloud クラスター上でのユーザー主導の操作や API 呼び出しを追跡・監視できます。この機能は、ベクトル検索、クエリ実行、インデックス管理、その他のデータ操作など、ベクトルデータベースのアクティビティの詳細な記録を提供します。 | Cloud"
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


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# VectorDB 監査ログ

監査ログ機能により、管理者は Zilliz Cloud クラスター上のユーザー主導の運用と API 呼び出しを追跡・監視できます。この機能は、ベクトル検索、クエリ実行、インデックス管理、その他のデータ運用を含むベクトル DB アクティビティの詳細な記録を提供します。

<Admonition type="info" icon="📘" title="Notes">

- 監査ログ機能は、**Enterprise** プロジェクトまたはそれ以上のプラン層の **Dedicated** クラスターでのみ利用可能です。

- 監査ログ機能は、Milvus 2.5.x 以降を実行している Zilliz Cloud クラスターのみでサポートされています。

- 監査ログは [AWS S3](./integrate-with-aws-s3)、[Azure Blob Storage](./integrate-with-azure-blob-storage)、または [Google Cloud Storage](./integrate-with-gcp) に転送できます。

- 監査ログの有効化には料金が発生します。詳細については、[監査ログ](./audit-log-cost) を参照してください。

</Admonition>

## 概要\{#overview}

監査ログは、データプレーン上の幅広い運用を追跡します。これには以下が含まれます：

- **検索およびクエリ運用**: ベクトル検索、ハイブリッド検索、およびクエリ運用。

- **データ管理**: インデックス作成、コレクション作成、パーティション管理、および insert、delete、upsert などのエンティティ運用。

- **システムイベント**: ユーザーアクセス試行、認可チェック、その他の定義済みアクション。

<Admonition type="info" icon="📘" title="Notes">

マイグレーション、バックアップ、リストアなどのクラスターレベルのデータジョブは監査ログを生成しません。これらのアクティビティ記録を表示するには、[アクティビティの表示](./view-activities) を参照してください。

</Admonition>

監査ログは、定期的にユーザーが指定したオブジェクトストレージバケットに直接転送されます。ログは、簡単なアクセスと管理のために構造化されたファイルパスおよび命名形式で保存されます：

- **ファイルパス**: `/<クラスターID>/<Log type>/<Date>`

- **ファイル命名規則**: `<File name><File name suffix>` は *HH:MM:SS-$UUID* の形式で、*HH:MM:SS* は UTC での時刻、*$UUID* は一意のランダム文字列を表します。例: `09:16:53-jz5l7D8Q`。

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

サポートされているアクションと対応するログフィールドの詳細な一覧については、[監査ログリファレンス](./audit-logs-ref) を参照してください。

## 監査ログを有効にする\{#enable-audit-log}

Zilliz Cloud の監査ログ機能は、監査ログをストレージバケットに直接転送します。

### 開始前の準備\{#before-you-start}

- Zilliz Cloud クラスターが **Dedicated-Enterprise** プラン以上で実行されていること。必要に応じて[プランをアップグレード](./manage-cluster)してください。

- 監査ログは設定後にバケットに転送されるため、Zilliz Cloud プロジェクトとオブジェクトストレージを統合していること。詳細な手順については、[AWS S3 との統合](./integrate-with-aws-s3)、[Azure Blob Storage との統合](./integrate-with-azure-blob-storage)、または [Google Cloud Storage との統合](./integrate-with-gcp) を参照してください。

- プロジェクトに対する **組織オーナー** または **プロジェクト管理者** のアクセス権を持っていること。必要な権限がない場合は、Zilliz Cloud 管理者に連絡してください。

### 手順\{#procedure}

<Supademo id="cmei9fcd99br6h3pydbp52sv8" title="Zilliz Cloud - Enable audit log" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) にログインします。

1. 左側のナビゲーションペインで **Clusters** を選択します。

1. 対象クラスターの詳細ページに移動し、**監査** タブを選択します。このタブは、クラスターが **CREATING**、**DELETING**、または **DELETED** ステータスの場合は使用できません。

1. **Enable 監査ログ** をクリックします。

1. **Enable 監査ログ** ダイアログボックスで、オブジェクトストレージ統合の設定を指定します。

    - **ストレージ統合**: 監査ログを保存するバケットを選択します。

        <Admonition type="info" icon="📘" title="Notes">

        クラスターと同じリージョンにあるバケットのみがドロップダウンリストに表示されます。

        </Admonition>

    - **転送ディレクトリ**: バケット内で監査ログを保存するディレクトリを指定します。

1. **Enable** をクリックします。**監査ログ** ステータスが **Active** になれば、正常に有効化されています。ステータスが **異常** の場合は、トラブルシューティングのために [FAQ](./audit-logs#faq) を参照してください。

</Procedures>

設定が完了すると、監査ログは約5分間隔でバケットに転送されます。必要に応じてバケットにアクセスして、ログの表示や管理を行うことができます。

監査ログが S3 バケットに転送されたら、S3 ストレージを可視化プラットフォームと統合して、監視と分析を強化することができます。例えば、Snowflake を使用してより深い洞察を得たい場合は、[Automating Snowpipe for Amazon S3](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-auto-s3) を参照してください。

ログエントリのパラメータについては、[監査ログ](./audit-logs-ref) を参照してください。

## 監査ログの管理\{#manage-audit-logs}

監査ログを有効にすると、必要に応じて設定を編集したり、無効化したりすることができます。

![XyvNb9sf1oGSKox0XxWc2BFAnrg](https://zdoc-images.s3.us-west-2.amazonaws.com/xyvnb9sf1ogskox0xxwc2bfanrg.png "XyvNb9sf1oGSKox0XxWc2BFAnrg")

## FAQ\{#faq}

この FAQ は、Zilliz Cloud の監査ログに関する一般的な問題と質問に対応しています。さらにサポートが必要な場合は、[Zilliz Cloud サポート](https://support.zilliz.com/hc/en-us) にお問い合わせください。

- **監査ログ ステータスが 異常 の場合はどうすればよいですか？**

    **異常** ステータスは、監査ログ に問題が発生していることを意味します。以下の手順でトラブルシューティングを行ってください：

    1. **バケットを確認する:** 設定されたストレージバケットが正しく設定されており、必要な権限があることを確認します。

    1. **サポートに連絡する:** 問題が解決しない場合は、さらなるサポートのために [Zilliz Cloud サポート](https://support.zilliz.com/hc/en-us) にお問い合わせください。

- **クラスターステータスが異常な場合、監査ログ サービスに影響しますか？**

    異常なクラスターステータスは、ネットワーク接続の問題や Zilliz Cloud サービスの中断など、クラスターに問題が発生している可能性があることを示します。ただし、これらの問題は 監査ログ サービスには影響せず、サービスは正常に機能し、ログの転送を期待通りに継続します。継続的な問題が発生する場合は、[Zilliz Cloud サポート](https://support.zilliz.com/hc/en-us) にお問い合わせください。

