---
title: "バックアップファイルからの復元 | BYOC"
slug: /restore-from-snapshot
sidebar_key: restore-from-snapshot
sidebar_label: "バックアップファイルから復元"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud の復元機能を使用すると、誤ったデータの消失、破損、またはシステム障害の場合にバックアップファイルからデータを復旧でき、ビジネスの継続性を確保します。インシデントからの復旧、意図しない変更の巻き戻し、または最小限の中断でテスト用にクラスターをクローンするための信頼性の高い方法です。 | BYOC"
type: origin
token: Dd6jwYIGiiz6HWkEPJqcpMA3n6g
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - バックアップ
  - 復元

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# バックアップファイルからの復元

Zilliz Cloud の復元機能を使用すると、誤ったデータの消失や破損、システム障害などの場合にバックアップファイルからデータを復元でき、ビジネスの継続性を確保できます。これは、インシデントからの復旧、意図しない変更の巻き戻し、または最小限の中断でテスト用にクラスターをクローンするための信頼性の高い方法です。

このガイドでは、バックアップファイルからクラスター全体または一部を復元する方法について説明します。

## 制限\{#limits}

- **アクセス制御**: プロジェクト管理者、組織オーナー、またはバックアップ権限を持つカスタムロールである必要があります。

## クラスター全体の復元\{#restore-a-full-cluster}

クラスター全体（すべてのデータベースとコレクションを含む）を**新しいクラスター**に復元できます。これは、テストや復旧のために環境をクローンする場合に便利です。クラスター全体を復元するには、バックアップファイルがクラスターバックアップである必要があります。

復元中に、RBAC 設定を含めるかどうかを選択できます。

<Admonition type="info" icon="📘" title="Notes">

RBAC の復元は現在、ウェブコンソール経由でのみサポートされています。RESTful API ではまだサポートされていません。

</Admonition>

復元後、**新しいパスワード**が `db_admin` ユーザーに生成されます。このパスワードを使用して、復元されたクラスターに接続してください。

### ウェブコンソール経由\{#via-web-console}

以下のデモでは、Zilliz Cloud ウェブコンソールでクラスター全体を復元する方法を示しています。

<Supademo id="cmcsruzjd0gyo9st8kcjye30i" title=""  />

### RESTful API経由\{#via-restful-api}

以下の例では、既存のバックアップファイルから `Dedicated-01-backup` という名前の新しいクラスターにクラスター全体を復元します。RESTful API の詳細については、[クラスターバックアップの復元](/reference/restful/restore-cluster-backup-v2) を参照してください。

```bash
export API_KEY="YOUR_API_KEY"
export BASE_URL="https://api.cloud.zilliz.com"
export CLUSTER_ID="your-cluster-id"

curl --request POST \
     --url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/${BACKUP_ID}/restoreCluster" \
     --header "Authorization: Bearer ${API_KEY}" \
     --header "Accept: application/json" \
     --header "Content-type: application/json" \
     --data-raw '{
        "targetProjectId": "proj-20e13e974c7d659a83xxxx",
        "clusterName": "Dedicated-01-backup",
        "cuSize": 1,
        "collectionStatus": "KEEP"
      }'
```

復元ジョブが生成され、進捗状況は [プロジェクトジョブセンター](./job-center) で確認できます。

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

## クラスタの一部を復元する\{#restore-a-partial-cluster}

特定のデータベースとコレクションのみを**既存のクラスタ**に復元することも選択できます。

### ウェブコンソール経由\{#via-web-console}

以下のデモでは、Zilliz Cloud ウェブコンソールでクラスタ内の特定のデータベースとコレクションを復元する方法を示しています。

<Supademo id="cmcss7xi00h8c9st8qsqnutnn" title=""  />

### RESTful API経由\{#via-restful-api}

以下の例では、バックアップファイルからコレクションを既存のクラスタ `in01-3e5ad8adc38xxxx` に復元します。RESTful API の詳細については、[コレクションバックアップの復元](/reference/restful/restore-collection-backup-v2) を参照してください。

```bash
curl --request POST \
--url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/${BACKUP_ID}/restoreCollection" \
--header "Authorization: Bearer ${API_KEY}" \
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

復元ジョブが生成され、進捗状況は [プロジェクトジョブセンター](./job-center) で確認できます。

```bash
{
  "code": 0,
  "data": {
    "jobId": "job-04bf9335838dzkeydpxxxx"
  }
}
```

## FAQ\{#faq}

**復元されたクラスターはどの Milvus バージョンで実行されますか？**

復元されたクラスターは、バックアップ作成時に使用されたバージョンに関係なく、復元時点で Zilliz Cloud がサポートする最新の Milvus バージョンで実行されます。例えば、Milvus 2.5.x クラスターのバックアップを作成し、プラットフォームが 2.6.x にアップグレードされた後に復元した場合、復元されたクラスターは Milvus 2.6.x で実行されます。バックアップファイルにはデータのみが含まれており、クラスターのバージョンはプラットフォームによって決定されます。           