---
title: "バックアップファイルの管理 | Cloud"
slug: /manage-backup-files
sidebar_label: "バックアップファイルの管理"
beta: FALSE
notebook: FALSE
description: "このガイドでは、既存のバックアップファイルを表示、名前変更、削除する方法を説明します。 | Cloud"
type: origin
token: Ml6dwBPTfiQOY9koK24cT1Sznge
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - バックアップ
  - 管理
  - k近傍法
  - ANNS
  - ベクトル検索
  - knnアルゴリズム

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# バックアップファイルの管理

このガイドでは、既存のバックアップファイルを表示、名前変更、削除する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Dedicated</strong> クラスターでのみ利用可能です。</p>

</Admonition>

## 制限事項{#limits}

- **アクセス制御**: プロジェクト管理者、組織所有者、またはバックアップ権限を持つカスタムロールである必要があります。

## バックアップファイルの表示{#view-backup-files}

完了済みまたは進行中のすべてのバックアップファイルのリストを表示し、その詳細を検査できます。

### ウェブコンソール経由{#via-web-console}

Zilliz Cloud ウェブコンソールですべてのバックアップファイルとその詳細を表示するには、左側のナビゲーションで「Backups」をクリックします。

![Cdf2b3by2o6SlOxUhKXcbMrMnth](https://zdoc-images.s3.us-west-2.amazonaws.com/cdf2b3by2o6sloxuhkxcbmrmnth.png "Cdf2b3by2o6SlOxUhKXcbMrMnth")

### RESTful API 経由{#via-restful-api}

- すべてのバックアップファイルを表示する

    以下の例では、プロジェクトIDもクラスターIDも指定されていないため、現在の組織内のすべてのバックアップファイルをリストします。特定のプロジェクトまたはクラスターのバックアップを表示するには、リクエストに対応するプロジェクトIDまたはクラスターIDを含めます。RESTful API の詳細については、[List Backups](/reference/restful/list-backups-v2) を参照してください。

    ```bash
    curl --request GET \
         --url "${BASE_URL}/v2/backups" \
         --header "Authorization: Bearer ${TOKEN}" \
         --header "Accept: application/json"
    ```

以下は出力例です。

- バックアップファイルの表示

    以下の例では、バックアップファイルの詳細を確認します。RESTful API の詳細については、[バックアップの記述](/reference/restful/describe-backup-v2)を参照してください。

    ```bash
    curl --request GET \
         --url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/${BACKUP_ID}" \
         --header "Authorization: Bearer ${TOKEN}" \
         --header "Accept: application/json"
    ```

    以下は出力例です。

    ```bash
    {
      "code": 0,
      "data": {
        "clusterId": "in01-3e5ad8adc38xxxx",
        "clusterName": "Dedicated-01",
        "regionId": "aws-us-west-2",
        "projectId": "proj-20e13e974c7d659a83xxxx",
        "backupId": "backup1_0b9d15a0ddexxxx",
        "backupName": "Dedicated-01_backup3",
        "backupType": "CLUSTER",
        "creationMethod": "AUTO",
        "status": "AVAILABLE",
        "size": 0,
        "collections": [],
        "createTime": "2024-08-26T02:27:51Z",
        "expireTime": "2024-09-02T02:27:51Z"
      }
    }
    ```

## バックアップファイルの名前変更\{#rename-backup-files}

現在、バックアップファイルの名前変更はWebコンソールからのみサポートされています。

以下のデモは、Zilliz Cloud Webコンソールでバックアップファイルの名前を変更する方法を示しています。

<Supademo id="cmcsspyv70hpq9st8rz5ro3qa" title=""  />

## バックアップファイルの削除\{#delete-backup-files}

Zilliz Cloudは、バックアップが作成された方法に基づいて削除を異なる方法で処理します。

- **手動バックアップ**は、クラスターが削除された場合でも永続的に保持されます。コストを削減するために、不要になったバックアップは手動で削除することをお勧めします。

- **自動バックアップ**は、保持期間が終了するか、関連するクラスターが削除されると自動的に削除されます。いつでも手動で削除することもできます。

### Webコンソール経由\{#via-web-console}

以下のデモは、Zilliz Cloud Webコンソールでバックアップファイルを削除する方法を示しています。

<Supademo id="cmcst9z5t0ics9st8bbvsrqkk" title=""  />

### RESTful API経由\{#via-restful-api}

以下の例は、バックアップファイルを削除します。RESTful APIの詳細については、[Delete Backup](/reference/restful/delete-backup-v2)を参照してください。

```bash
curl --request DELETE \
     --url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/${BACKUP_ID}" \
     --header "Authorization: Bearer ${TOKEN}" \
     --header "Accept: application/json" \
     --header "Content-type: application/json"
```

以下は出力例です。

```bash
{
  "code": 0,
  "data": {
    "backupId": "backup11_dbf5a40a6e5xxxx",
    "backupName": "medium_articles_backup4"
  }
}
```

