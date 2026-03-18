---
title: "バックアップファイルからの復元 | Cloud"
slug: /restore-from-snapshot
sidebar_label: "バックアップファイルからの復元"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudの復元機能を使用すると、偶発的なデータ損失、破損、またはシステム障害が発生した場合に、バックアップファイルからデータを復元し、ビジネスの継続性を確保できます。これは、インシデントからの復旧、意図しない変更の元に戻し、または最小限の混乱でテスト用のクラスターをクローンするための信頼できる方法です。 | Cloud"
type: origin
token: Dd6jwYIGiiz6HWkEPJqcpMA3n6g
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - バックアップ
  - 復元

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# バックアップファイルからの復元

Zilliz Cloudの復元機能を使用すると、偶発的なデータ損失、破損、またはシステム障害が発生した場合に、バックアップファイルからデータを回復でき、ビジネスの継続性を確保できます。これは、インシデントからの回復、意図しない変更の元に戻し、または最小限の中断でテスト用のクラスターをクローンするための信頼できる方法です。

このガイドでは、バックアップファイルからクラスター全体または一部を復元する方法を説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Dedicated</strong>クラスターでのみ利用可能です。</p>

</Admonition>

## 制限事項\{#limits}

- **アクセス制御**: プロジェクト管理者、組織オーナー、またはバックアップ権限を持つカスタムロールである必要があります。

## クラスター全体を復元する\{#restore-a-full-cluster}

すべてのデータベースとコレクションを含むクラスター全体を**新しいクラスター**に復元できます。これは、テストやリカバリのために環境をクローンするのに役立ちます。クラスター全体を復元するには、バックアップファイルがクラスターバックアップである必要があります。

復元中に、RBAC設定を含めるかどうかを選択できます。

<Admonition type="info" icon="📘" title="Notes">

<p>RBACの復元は現在、ウェブコンソール経由でのみサポートされており、RESTful APIではまだサポートされていません。</p>

</Admonition>

復元後、`db_admin`ユーザーの**新しいパスワード**が生成されます。このパスワードを使用して、復元されたクラスターに接続します。

### ウェブコンソール経由\{#via-web-console}

以下のデモは、Zilliz Cloudウェブコンソールでクラスター全体を復元する方法を示しています。

<Supademo id="cmcsruzjd0gyo9st8kcjye30i" title=""  />

### RESTful API経由\{#via-restful-api}

以下の例は、既存のバックアップファイルから`Dedicated-01-backup`という名前の新しいクラスターにクラスター全体を復元します。RESTful APIの詳細については、[Restore Cluster Backup](/reference/restful/restore-cluster-backup-v2)を参照してください。

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

## 部分的なクラスターを復元する\{#restore-a-partial-cluster}

特定のデータベースとコレクションのみを**既存のクラスター**に復元することもできます。

### ウェブコンソール経由\{#via-web-console}

以下のデモは、Zilliz Cloud ウェブコンソールでクラスター内の特定のデータベースとコレクションを復元する方法を示しています。

<Supademo id="cmcss7xi00h8c9st8qsqnutnn" title=""  />

### RESTful API経由\{#via-restful-api}

以下の例は、バックアップファイルから既存のクラスター `in01-3e5ad8adc38xxxx` にコレクションを復元します。RESTful API の詳細については、[Restore Collection Backup](/reference/restful/restore-collection-backup-v2) を参照してください。

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

## 暗号化されたバックアップファイルからの復元\{#restore-from-an-encrypted-backup-file}

暗号化されたバックアップを新しいクラスターに復元する場合、Zilliz Cloudはバックアップファイルに関連付けられたKMSキーを使用して、復元前にデータを復号します。したがって、暗号化の有無にかかわらず、バックアップを新しいクラスターに復元できます。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>ビジネスクリティカル</strong>プロジェクトの<strong>Dedicated</strong>クラスターでのみ利用可能です。</p>

</Admonition>

![WaApbDlaYoywaMxxUMxcQLAOnDe](https://zdoc-images.s3.us-west-2.amazonaws.com/waapbdlayoywamxxumxcqlaonde.png "WaApbDlaYoywaMxxUMxcQLAOnDe")

暗号化されたバックアップからの復元手順は、**Encryption at Rest with CMEK**を有効にするかどうかを除いて、通常の復元とほぼ同じです。

![V1QJb3SK1oGa11xLljhcxKQEnkc](https://zdoc-images.s3.us-west-2.amazonaws.com/v1qjb3sk1oga11xlljhcxkqenkc.png "V1QJb3SK1oGa11xLljhcxKQEnkc")

- このオプションが有効な場合、復元後に作成されるクラスターは、以下で指定されたKMSキーを使用して暗号化されます。

- このオプションが無効な場合、復元後に作成されるクラスターは暗号化されません。

