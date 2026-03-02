---
title: "バックアップファイルからの復元 | BYOC"
slug: /restore-from-snapshot
sidebar_label: "バックアップファイルからの復元"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudの復元機能は、偶発的なデータ損失、破損、システム障害が発生した場合に、バックアップファイルからデータを回復し、ビジネスの継続性を確保します。これは、インシデントからの回復、意図しない変更の元に戻す、または最小限の混乱でテスト用にクラスターをクローンするための信頼できる方法です。 | BYOC"
type: origin
token: Dd6jwYIGiiz6HWkEPJqcpMA3n6g
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - バックアップ
  - 復元
  - 動画類似性検索
  - ベクトル検索
  - 音声類似性検索
  - エラスティックベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# バックアップファイルからの復元

Zilliz Cloudの復元機能は、偶発的なデータ損失、破損、またはシステム障害が発生した場合に、バックアップファイルからデータを回復することを可能にし、ビジネスの継続性を保証します。これは、インシデントからの回復、意図しない変更の元に戻し、または最小限の混乱でテストのためにクラスターをクローンする信頼できる方法です。

このガイドでは、バックアップファイルからクラスター全体または一部を復元する方法を説明します。

## 制限事項{#limits}

- **アクセス制御**: プロジェクト管理者、組織所有者、またはバックアップ権限を持つカスタムロールである必要があります。

## クラスター全体を復元する{#restore-a-full-cluster}

すべてのデータベースとcollectionを含むクラスター全体を**新しいクラスター**に復元できます。これは、テストや回復のために環境をクローンするのに役立ちます。クラスター全体を復元するには、バックアップファイルがクラスターバックアップである必要があります。

復元中に、RBAC設定を含めるかどうかを選択できます。

<Admonition type="info" icon="📘" title="Notes">

<p>RBACの復元は現在、Webコンソール経由でのみサポートされており、RESTful APIではまだサポートされていません。</p>

</Admonition>

復元後、`db_admin`ユーザーの**新しいパスワード**が生成されます。このパスワードを使用して、復元されたクラスターに接続します。

### Webコンソール経由{#via-web-console}

以下のデモは、Zilliz Cloud Webコンソールでクラスター全体を復元する方法を示しています。

<Supademo id="cmcsruzjd0gyo9st8kcjye30i" title="" />

### RESTful API経由{#via-restful-api}

以下の例では、既存のバックアップファイルから`Dedicated-01-backup`という名前の新しいクラスターにクラスター全体を復元します。RESTful APIの詳細については、[Restore Cluster Backup](/reference/restful/restore-cluster-backup-v2)を参照してください。

```bash
curl --request POST \
     --url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/${BACKUP_ID}/restoreCluster" \
     --header "Authorization: Bearer ${TOKEN}" \
     --header "Accept: application/json" \
     --header "Content-type: application/json" \
     --data-raw '{
        "targetProjectId": "proj-20e13e974c7d659a83xxxx",
        "clusterName": "Dedicated-01-backup",
        "cuSize": 1,
        "collectionStatus": "KEEP"
      }'
```

以下は出力例です。リストアジョブが生成され、[プロジェクトジョブセンター](./job-center)で進捗状況を確認できます。

```bash
{
  "code": 0,
  "data": {
    "clusterId": "inxx-xxxxxxxxxxxxxxx",
    "username": "db_admin",
    "password": "xxxxxxxxx",
    "jobId": "job-xxxxxxxxxxxxxx"
  }
}
```

## 部分的なクラスターを復元する{#restore-a-partial-cluster}

特定のデータベースとコレクションのみを**既存のクラスター**に復元することもできます。

### Web コンソール経由{#via-web-console}

以下のデモは、Zilliz Cloud Web コンソールでクラスター内の特定のデータベースとコレクションを復元する方法を示しています。

<Supademo id="cmcss7xi00h8c9st8qsqnutnn" title=""  />

### RESTful API 経由{#via-restful-api}

以下の例は、バックアップファイルから既存のクラスター `in01-3e5ad8adc38xxxx` にコレクションを復元します。RESTful API の詳細については、[コレクションバックアップの復元](/reference/restful/restore-collection-backup-v2)を参照してください。

```bash
curl --request POST \
--url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/${BACKUP_ID}/restoreCollection" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "destClusterId": "in01-xxxxxxxxxxxxxx",
    "dbCollections": [
        {
            "collections": [
                {
                    "collectionName": "medium_articles",
                    "destCollectionName": "restore_medium_articles",
                    "destCollectionStatus": "LOADED"
                }
            ]
        }
    ]
}'
```

以下は出力例です。リストアジョブが生成され、[プロジェクトジョブセンター](./job-center)で進捗状況を確認できます。

```bash
{
  "code": 0,
  "data": {
    "jobId": "job-04bf9335838dzkeydpxxxx"
  }
}
```

