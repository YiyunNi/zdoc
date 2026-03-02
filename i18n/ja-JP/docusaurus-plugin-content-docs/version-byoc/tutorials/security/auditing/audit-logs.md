---
title: "VectorDB 監査ログ | BYOC"
slug: /audit-logs
sidebar_label: "VectorDB 監査ログ"
beta: FALSE
notebook: FALSE
description: "監査ロギングにより、管理者はZilliz Cloudクラスター上でのユーザー主導の操作とAPI呼び出しを追跡および監視できます。この機能は、ベクトル検索、クエリ実行、インデックス管理、その他のデータ操作を含む、ベクトルDBアクティビティの詳細な記録を提供します。 | BYOC"
type: origin
token: M5dXwsGOOiPdAjkWLZUc2Pxonuh
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 監査
  - ログ
  - 設定
  - Machine Learning
  - RAG
  - NLP
  - Neural Network

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# VectorDB 監査ログ

監査ログを使用すると、管理者はZilliz Cloudクラスター上でのユーザー主導の操作とAPI呼び出しを追跡および監視できます。この機能は、ベクトル検索、クエリ実行、インデックス管理、その他のデータ操作を含む、VectorDBアクティビティの詳細な記録を提供します。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>監査ログは、<strong>Enterprise</strong>プロジェクトまたはそれ以上のプランティアの<strong>Dedicated</strong>クラスターでのみ利用可能です。</p></li>
<li><p>監査ログは、Milvus 2.5.xを実行しているZilliz Cloudクラスターでのみサポートされています。</p></li>
<li><p>監査ログは、<a href="./integrate-with-aws-s3">AWS S3</a>、<a href="./integrate-with-azure-blob-storage">Azure Blob Storage</a>、または<a href="./integrate-with-gcp">Google Cloud Storage</a>に転送できます。</p></li>
<li><p>監査ログを有効にすると料金が発生します。詳細については、<a href="./audit-log-cost">監査ログ</a>を参照してください。</p></li>
</ul>

</Admonition>

## 概要{#overview}

監査ログは、データプレーン上の幅広い操作を追跡します。これには以下が含まれます。

- **検索およびクエリ操作**: ベクトル検索、ハイブリッド検索、およびクエリ操作。

- **データ管理**: インデックス作成、collection作成、partition管理、およびinsert、delete、upsertなどのentity操作。

- **システムイベント**: ユーザーアクセス試行、認証チェック、およびその他の事前定義されたアクション。

<Admonition type="info" icon="📘" title="Notes">

<p>移行、バックアップ、復元などのクラスターレベルのデータジョブは監査ログを生成しません。これらのアクティビティ記録を表示するには、<a href="./view-activities">アクティビティの表示</a>を参照してください。</p>

</Admonition>

監査ログは、定期的にユーザーが指定したオブジェクトストレージバケットに直接転送されます。ログは、アクセスと管理を容易にするために、構造化されたファイルパスと命名形式で保存されます。

- **ファイルパス**: `/<Cluster ID>/<Log type>/<Date>`

- **ファイル命名規則**: *HH:MM:SS-&#36;UUID* の形式で`<File name><File name suffix>`。ここで、*HH:MM:SS* はUTCでの時刻を表し、*&#36;UUID* は一意のランダムな文字列です。例: `09:16:53-jz5l7D8Q`。

以下は、バケットに転送された監査ログエントリの例です。

- **Collectionの作成**

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

- **インデックスの作成**

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

サポートされているアクションと対応するログフィールドの詳細なリストについては、[監査ログリファレンス](./audit-logs-ref)を参照してください。

## 監査ログを有効にする{#enable-audit-log}

Zilliz Cloudでの監査ロギングは、監査ログをストレージバケットに直接転送します。

### 開始する前に{#before-you-start}

- プロジェクトに対する**Organization Owner**または**Project Admin**アクセス権を持っていること。必要な権限がない場合は、Zilliz Cloud管理者にお問い合わせください。

### 手順{#procedure}

<Supademo id="cmei9fcd99br6h3pydbp52sv8" title="Zilliz Cloud - 監査ログを有効にする" />

<Procedures>

1. [Zilliz Cloudコンソール](https://cloud.zilliz.com/login)にログインします。

1. 左側のナビゲーションペインで、**Clusters**を選択します。

1. ターゲットクラスターの詳細ページに移動し、**Auditing**タブを選択します。このタブは、クラスターが**CREATING**、**DELETING**、または**DELETED**ステータスの場合、利用できません。

1. **Enable Audit Log**をクリックします。

1. **Enable Audit Logs**ダイアログボックスで、オブジェクトストレージ統合設定を指定します。

    - **Storage Integration**: 監査ログを保存するバケットを選択します。

        <Admonition type="info" icon="📘" title="Notes">

        <p>クラスターと同じリージョンにあるバケットのみがドロップダウンリストに表示されます。</p>

        </Admonition>

    - **Forward Directory**: 監査ログを保存するバケット内のディレクトリを指定します。

1. **Enable**をクリックします。**Audit Log**ステータスが**Active**になると、正常に有効化されています。ステータスが**Abnormal**の場合は、トラブルシューティングのために[FAQ](./audit-logs#faq)を参照してください。

</Procedures>

設定が完了すると、監査ログは約5分間隔でバケットに転送されます。必要に応じてバケットにアクセスしてログを表示または管理できます。

監査ログがS3バケットに転送されたら、S3ストレージを視覚化プラットフォームと統合して、監視と分析を強化できます。たとえば、Snowflakeを使用してより深い洞察を得たい場合は、[Automating Snowpipe for Amazon S3](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-auto-s3)を参照してください。

ログエントリのパラメータを理解するには、[監査ログ](./audit-logs-ref)を参照してください。

## 監査ログを管理する{#manage-audit-logs}

監査ログが有効になったら、必要に応じて設定を編集したり、無効にしたりできます。

![XyvNb9sf1oGSKox0XxWc2BFAnrg](https://zdoc-images.s3.us-west-2.amazonaws.com/xyvnb9sf1ogskox0xxwc2bfanrg.png "XyvNb9sf1oGSKox0XxWc2BFAnrg")

## FAQ{#faq}

このFAQでは、Zilliz Cloudでの監査ロギングに関する一般的な問題と質問について説明します。さらにサポートが必要な場合は、[Zilliz Cloudサポート](https://support.zilliz.com/hc/en-us)にお問い合わせください。

- **監査ログのステータスがAbnormalの場合、どうすればよいですか？**

    **Abnormal**ステータスは、監査ログに問題が発生していることを意味します。トラブルシューティングのために、次の手順に従ってください。

    1. **バケットを確認する:** 設定されたストレージバケットが正しく設定されており、必要な権限があることを確認します。

    1. **サポートに連絡する:** 問題が解決しない場合は、[Zilliz Cloudサポート](https://support.zilliz.com/hc/en-us)に連絡して、さらにサポートを受けてください。

- **クラスターのAbnormalステータスは監査ログサービスに影響しますか？**

    クラスターの異常なステータスは、クラスターがネットワーク接続の問題やZilliz Cloudサービスの障害などの問題を経験している可能性があることを示します。ただし、これらの問題は監査ログサービスには影響せず、監査ログサービスは通常どおり機能し、期待どおりにログを転送します。永続的な問題が発生した場合は、[Zilliz Cloudサポート](https://support.zilliz.com/hc/en-us)にお問い合わせください。

