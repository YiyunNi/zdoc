---
title: "バックアップの作成 | BYOC"
slug: /create-snapshot
sidebar_label: "バックアップの作成"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudでは、バックアップはデータのコピーであり、データ損失やシステム障害が発生した場合に、クラスター全体または特定のcollectionを復元できます。 | BYOC"
type: origin
token: HHXewT7wTiM1zqkySjHcMNX5n9b
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - バックアップ
  - ベクトルデータベースとは
  - ベクトルデータベース比較
  - Faiss
  - 動画検索

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# バックアップの作成

Zilliz Cloudでは、バックアップはデータのコピーであり、データ損失やシステム障害が発生した場合に、クラスター全体または特定のコレクションを復元できます。

このガイドでは、**手動でバックアップを作成する方法**について説明します。バックアップ作成を自動化するには、[自動バックアップのスケジュール設定](./schedule-automatic-backups)を参照してください。

## 制限事項{#limits}

- **アクセス制御**: **プロジェクト管理者**、**組織所有者**、またはバックアップ権限を持つ**カスタムロール**である必要があります。

- **バックアップから除外されるもの**:

    - コレクションのTTL設定

    - デフォルトユーザー`db_admin`のパスワード（[復元](./restore-from-snapshot)時に新しいパスワードが生成されます）

    - クラスターの動的およびスケジュールされたスケーリング設定

- **クラスターシャード設定**: バックアップされますが、クラスターのCUサイズが縮小された場合、CUあたりのシャード制限により、復元時に調整されることがあります。詳細については、[Zilliz Cloudの制限事項](./limits#shards)を参照してください。

- **バックアップジョブの制限**:

    - 一度にアクティブまたは保留中の**手動バックアップ**は1つだけです。

    - **自動バックアップ**が有効な場合:

        - 自動バックアップが進行中の間は、手動バックアップを開始できません。

        - 手動バックアップがすでに進行中でも、自動バックアップは実行されます。

## クラスターバックアップの作成{#create-cluster-backup}

クラスター全体のバックアップを作成し、後でクラスター全体または選択したコレクションを復元できます。

### Webコンソール経由{#via-web-console}

以下のデモは、Zilliz Cloud Webコンソールでクラスターバックアップを作成する方法を示しています。

<Supademo id="cmcske0x90dpa9st802gnvbz9" title="" />

### RESTful API経由{#via-restful-api}

以下の例では、クラスター`in01-xxxxxxxxxxxxxx`のバックアップを作成します。RESTful APIの詳細については、[バックアップの作成](/reference/restful/create-backup-v2)を参照してください。

```bash
curl --request POST \
     --url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/create" \
     --header "Authorization: Bearer ${TOKEN}" \
     --header "Content-Type: application/json" \
     --data-raw '{
            "backupType": "CLUSTER"
      }'
```

以下は出力例です。バックアップジョブが生成され、[プロジェクトジョブセンター](./job-center)で進捗状況を確認できます。

```bash
{
  "code": 0,
  "data": {
    "backupId": "backup0_c7b18539b97xxxx",
    "backupName": "Dedicated-01_backup2",
    "jobId": "job-031a8e3587ba7zqkadxxxx"
  }
}
```

## コレクションバックアップの作成{#create-collection-backup}

クラスター内の特定のコレクションまたはコレクションのサブセットをバックアップするには、コレクションレベルのバックアップを作成します。

### Webコンソール経由{#via-web-console}

以下のデモは、Webコンソールでコレクションバックアップを作成する方法を示しています。

<Supademo id="cmcskksub0dra9st8cy34b2vi" title="" />

### RESTful API経由{#via-restful-api}

以下の例では、クラスター`in01-xxxxxxxxxxxxxx`内のコレクション`medium_articles`のバックアップを作成します。RESTful APIの詳細については、[バックアップの作成](/reference/restful/create-backup-v2)を参照してください。

```bash
curl --request POST \
--url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "backupType": "COLLECTION",
    "dbCollections": [
        {
            "collectionNames": [
                "medium_articles"
            ]
        }
    ]
}'
```

以下は出力例です。バックアップジョブが生成され、[プロジェクトジョブセンター](./job-center)で進捗状況を確認できます。

```bash
{
  "code": 0,
  "data": {
    "backupId": "backup0_c7b18539b97xxxx",
    "backupName": "Dedicated-01_backup2",
    "jobId": "job-031a8e3587ba7zqkadxxxx"
  }
}
```

## よくある質問{#faqs}

**バックアップジョブにはどのくらいの時間がかかりますか？**

バックアップの所要時間は、データのサイズによって異なります。参考として、700 MBのバックアップには通常約1秒かかります。クラスターに1,000を超えるコレクションが含まれている場合、プロセスにはもう少し時間がかかる場合があります。

**バックアップ中にDDL（データ定義言語）操作を実行できますか？**

バックアップの進行中に、コレクションの作成や削除などの主要なDDL（データ定義言語）操作は避けることをお勧めします。これらの操作はプロセスを妨げたり、一貫性のない結果につながる可能性があります。

**元のクラスターが削除された場合、バックアップファイルも削除されますか？**

これはバックアップファイルの作成方法によって異なります。すべての[自動バックアップ](./schedule-automatic-backups)は、元のクラスターとともに削除されます。しかし、手動のクラスターバックアップは永続的に保持され、クラスターが削除されても削除されません。不要になった場合は、手動で削除する必要があります。

