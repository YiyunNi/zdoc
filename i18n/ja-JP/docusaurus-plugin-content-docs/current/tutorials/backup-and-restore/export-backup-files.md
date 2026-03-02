---
title: "バックアップファイルのエクスポート | Cloud"
slug: /export-backup-files
sidebar_label: "バックアップファイルのエクスポート"
beta: PRIVATE
notebook: FALSE
description: "Zilliz Cloud コンソールを使用して、バックアップファイルをオブジェクトストレージにエクスポートできます。"
type: origin
token: QUTDwkbTTiA2UlkWYDlc796ensf
sidebar_position: 5
keywords: 
  - zilliz
  - ベクターデータベース
  - クラウド
  - バックアップ
  - エクスポート
  - 統合
  - オブジェクト
  - ストレージ
  - DiskANN
  - Sparse vector
  - Vector Dimension
  - ANN Search

---

import Admonition from '@theme/Admonition';


# バックアップファイルのエクスポート

Zilliz Cloud コンソールを使用して、バックアップファイルをオブジェクトストレージにエクスポートできます。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Enterprise</strong> プロジェクトの <strong>Dedicated</strong> クラスター向けの <strong>Private Preview</strong> です。この機能を有効にする、または関連するコストについて知るには、<a href="https://support.zilliz.com/hc/en-us">Zilliz Cloud サポート</a>にお問い合わせください。</p>

</Admonition>

## 開始する前に{#before-you-start}

- Zilliz Cloud とオブジェクトストレージを統合していること。詳細な手順については、[AWS S3 との統合](./integrate-with-aws-s3)、[Azure Blob Storage との統合](./integrate-with-azure-blob-storage)、または [Google Cloud Storage との統合](./integrate-with-gcp)を参照してください。

- プロジェクトへの **Organization Owner** または **Project Admin** アクセス権があること。必要な権限がない場合は、Zilliz Cloud 管理者にお問い合わせください。

## 手順{#procedure}

Zilliz Cloud からバックアップファイルをエクスポートするには、Zilliz Cloud コンソールまたは RESTful API を使用できます。

### Zilliz Cloud コンソール経由でエクスポート{#export-via-zilliz-cloud-console}

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインします。

1. 左側のナビゲーションペインで、**Backups** を選択します。

1. 表示されたページで、対象のバックアップファイルを見つけ、**Actions** 列の **...** をクリックし、**Export** を選択します。

    <Admonition type="info" icon="📘" title="Notes">

    <p><strong>Available</strong> ステータスのバックアップファイルのみエクスポートできます。</p>

    </Admonition>

1. **Export Backup File** ダイアログボックスで、バックアップ設定を構成します。

    - **Cloud Region of Cluster in Backup File**: バックアップファイルが作成されたクラウドリージョンを表示します。

    - **Integration**: Zilliz Cloud と統合されているオブジェクトストレージプロバイダーを選択します。

    - **Integration Configuration**: バックアップエクスポート用に構成した特定のバケットを選択します。

    - **Directory**: エクスポートされたバックアップファイルが保存されるオブジェクトストレージバケット内のディレクトリパスを入力します。

1. 次に、**Export** をクリックします。

![export-backup-file](https://zdoc-images.s3.us-west-2.amazonaws.com/export-backup-file.png "export-backup-file")

### RESTful API 経由でエクスポート{#export-through-restful-api}

[Export Backup Files](/reference/restful/export-backup-files-v2) RESTful API エンドポイントを介して Zilliz Cloud からバックアップファイルをエクスポートする前に、AWS S3 バケットのいずれかを Zilliz Cloud と統合し、その統合 ID を取得する必要があります。詳細については、[統合 ID の取得](./integrate-with-aws-s3#obtain-the-integration-id)を参照してください。

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

上記リクエストへの応答は、以下のジョブIDとなります。

```bash
{
    "code": 0,
    "data": {
        "jobId": "job-0396450098cglufig6afm9"
    }
}
```

## エクスポートの進捗状況を監視する{#monitor-export-progress}

**エクスポート**をクリックすると、エクスポートジョブが自動的に生成されます。

1. 左側のナビゲーションペインで[ジョブ](https://docs.cloud-uat3.zilliz.com/docs/job-center)ページに移動します。

1. ジョブの**ステータス**を監視します。

    - **IN PROGRESS**: ファイルがエクスポート中です。

    - **SUCCESSFUL**: バックアップファイルが正常にエクスポートされました。指定したS3バケットでアクセスできます。

    - **ERROR**: ジョブが失敗しました。これは、エクスポートプロセスで使用されるリソース（Role ARNやバックアップファイルなど）がジョブ実行中に削除された場合に発生する可能性があります。

![monitor-export-job](https://zdoc-images.s3.us-west-2.amazonaws.com/monitor-export-job.png "monitor-export-job")

## エクスポートジョブをキャンセルする{#cancel-export-job}

ジョブが**IN PROGRESS**ステータスのままで、続行しないと判断した場合は、**アクション**列の**キャンセル**をクリックしてジョブをキャンセルできます。

<Admonition type="info" icon="📘" title="Notes">

<p>途中でキャンセルしても、すでにバケットにアップロードされたデータは削除されません。</p>

</Admonition>

