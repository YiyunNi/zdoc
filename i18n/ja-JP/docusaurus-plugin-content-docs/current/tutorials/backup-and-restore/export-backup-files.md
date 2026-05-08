---
title: "バックアップファイルのエクスポート | Cloud"
slug: /export-backup-files
sidebar_key: export-backup-files
sidebar_label: "バックアップファイルをエクスポート"
beta: PRIVATE
notebook: FALSE
description: "Zilliz Cloud コンソールを使用して、バックアップファイルをオブジェクトストレージにエクスポートできます。"
type: origin
token: QUTDwkbTTiA2UlkWYDlc796ensf
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - バックアップ
  - エクスポート
  - 統合
  - オブジェクト
  - ストレージ

---

import Admonition from '@theme/Admonition';


# バックアップファイルのエクスポート

Zilliz Cloud コンソールを使用して、バックアップファイルをオブジェクトストレージにエクスポートできます。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Enterprise</strong> プロジェクトの <strong>Dedicated</strong> クラスターにおいて <strong>プライベートプレビュー</strong> として提供されています。この機能を有効にする場合や、関連するコストについては、<a href="https://support.zilliz.com/hc/en-us">Zilliz Cloud サポート</a>までお問い合わせください。</p>

</Admonition>

## 開始前の準備\{#before-you-start}

- Zilliz Cloud とオブジェクトストレージの統合が完了していること。詳細な手順については、[AWS S3 との統合](./integrate-with-aws-s3)、[Azure Blob Storage との統合](./integrate-with-azure-blob-storage)、または [Google Cloud Storage との統合](./integrate-with-gcp) を参照してください。

- プロジェクトに対する **組織オーナー** または **プロジェクト管理者** のアクセス権限を持っていること。必要な権限がない場合は、Zilliz Cloud 管理者にお問い合わせください。

## 手順\{#procedure}

Zilliz Cloud からバックアップファイルをエクスポートするには、Zilliz Cloud コンソールまたは RESTful API を使用します。

### Zilliz Cloud コンソールからのエクスポート\{#export-via-zilliz-cloud-console}

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) にログインします。

1. 左側のナビゲーションペインで、**Backups** を選択します。

1. 表示されたページで、対象のバックアップファイルを見つけ、**Actions** 列の **...** をクリックし、**Export** を選択します。

    <Admonition type="info" icon="📘" title="Notes">

    <p><strong>Available</strong> ステータスのバックアップファイルのみエクスポートできます。</p>

    </Admonition>

1. **Export Backup File** ダイアログボックスで、バックアップ設定を構成します。

    - **クラウドリージョン of Cluster in Backup File**: バックアップファイルが作成されたクラウドリージョンが表示されます。

    - **Integration**: Zilliz Cloud と統合したオブジェクトストレージプロバイダーを選択します。

    - **統合設定**: バックアップエクスポート用に構成した特定のバケットを選択します。

    - **Directory**: エクスポートされたバックアップファイルを保存するオブジェクトストレージバケット内のディレクトリパスを入力します。

1. 次に、**Export** をクリックします。

![export-backup-file](https://zdoc-images.s3.us-west-2.amazonaws.com/export-backup-file.png "export-backup-file")

### RESTful API を使用したエクスポート\{#export-through-restful-api}

[Export Backup Files](/reference/restful/export-backup-files-v2) RESTful API エンドポイントを使用して Zilliz Cloud からバックアップファイルをエクスポートする前に、AWS S3 バケットのいずれかを Zilliz Cloud と統合し、その統合IDを取得する必要があります。詳細については、[統合IDの取得](./integrate-with-aws-s3#obtain-the-integration-id) を参照してください。

```bash
export BASE_URL="https://api.cloud.zilliz.com"
export TOKEN="YOUR_API_KEY"
export CLUSTER_ID="inxx-xxxxxxxxxxxxxxx"
export BACKUP_ID="backup-xxxxxxxxxxxxxxx"

curl --request POST \
--url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/${BACKUP_ID}/export" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "integrationId": "inter-xxxxxxx",
    "directory": "destdir/"
}'
```

上記リクエストに対するレスポンスは、以下のようなジョブIDになります。

```bash
{
    "code": 0,
    "data": {
        "jobId": "job-0396450098cglufig6afm9"
    }
}
```

## エクスポートの進行状況を監視する\{#monitor-export-progress}

**Export** をクリックすると、エクスポート ジョブが自動的に生成されます。

1. 左側のナビゲーション ペインで [ジョブ](https://docs.cloud-uat3.zilliz.com/docs/job-center) ページに移動します。

1. ジョブの **Status** を監視します。

    - **IN PROGRESS**: ファイルをエクスポート中です。

    - **SUCCESSFUL**: バックアップ ファイルのエクスポートが正常に完了しました。指定した S3 バケットでアクセスできます。

    - **ERROR**: ジョブが失敗しました。これは、エクスポート処理で使用されるリソース（ロール ARN やバックアップ ファイルなど）がジョブ実行中に削除された場合に発生する可能性があります。

![monitor-export-job](https://zdoc-images.s3.us-west-2.amazonaws.com/monitor-export-job.png "monitor-export-job")

## エクスポート ジョブをキャンセルする\{#cancel-export-job}

ジョブが **IN PROGRESS** 状態のままとなり、続行しないことを決定した場合は、**Actions** 列の **Cancel** をクリックしてジョブをキャンセルできます。

<Admonition type="info" icon="📘" title="Notes">

<p>途中でキャンセルしても、すでにバケットにアップロードされたデータは削除されません。</p>

</Admonition>

