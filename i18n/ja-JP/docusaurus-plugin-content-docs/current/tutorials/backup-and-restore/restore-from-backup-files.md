---
title: "バックアップファイルからの復元 | Cloud"
slug: /restore-from-backup-files
sidebar_key: restore-from-backup-files
sidebar_label: "バックアップファイルから復元"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud の復元機能を使用すると、誤ったデータの消失、破損、またはシステム障害が発生した場合にバックアップファイルからデータを復旧でき、ビジネスの継続性を確保します。インシデントからの復旧、意図しない変更の巻き戻し、または最小限の中断でテスト用にクラスターをクローン作成するための信頼性の高い方法です。"
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

Zilliz Cloud の復元機能を使用すると、誤ったデータの消失や破損、システム障害などの事態からバックアップファイルを使用してデータを回復でき、ビジネスの継続性を確保できます。これは、インシデントからの回復、意図しない変更の巻き戻し、または最小限の中断でテスト用にクラスターをクローンするための信頼性の高い方法です。

このガイドでは、バックアップファイルからクラスター全体または一部を復元する方法について説明します。

<Admonition type="info" icon="📘" title="Notes">

この機能は **Dedicated** クラスターでのみ利用可能です。

</Admonition>

## 制限\{#limits}

- **アクセス制御**: プロジェクト管理者、組織オーナー、またはバックアップ権限を持つカスタムロールである必要があります。

## クラスター全体の復元\{#restore-a-full-cluster}

すべてのデータベースとコレクションを含むクラスター全体を**新しいクラスター**に復元できます。これは、テストや復旧のために環境をクローンする際に役立ちます。クラスター全体を復元するには、バックアップファイルがクラスターバックアップである必要があります。

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

以下の例では、バックアップファイルから既存のクラスタ `inxx-xxxxxxxxxxxxxxx` にコレクションを復元します。RESTful API の詳細については、[コレクションバックアップの復元](/reference/restful/restore-collection-backup-v2) を参照してください。

```bash
curl --request POST \
--url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/${BACKUP_ID}/restoreCollection" \
--header "Authorization: Bearer ${API_KEY}" \
--header "Content-Type: application/json" \
-d '{
    "destClusterId": "inxx-xxxxxxxxxxxxxxx",
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

## 暗号化バックアップファイルからの復元\{#restore-from-an-encrypted-backup-file}

暗号化バックアップを新しいクラスターに復元する場合、Zilliz Cloud はバックアップファイルに関連付けられた KMS キーを使用して、復元前にデータを復号化します。そのため、暗号化の有無に関わらず、新しいクラスターにバックアップを復元できます。

<Admonition type="info" icon="📘" title="Notes">

この機能は、**ビジネスクリティカル** プロジェクトの **Dedicated** クラスターでのみ利用可能です。

</Admonition>

![WaApbDlaYoywaMxxUMxcQLAOnDe](https://zdoc-images.s3.us-west-2.amazonaws.com/waapbdlayoywamxxumxcqlaonde.png "WaApbDlaYoywaMxxUMxcQLAOnDe")

暗号化バックアップからの復元手順は、通常の復元とほぼ同じですが、**CMEK を使用した保存時の暗号化** を有効にするかどうかが異なります。

![V1QJb3SK1oGa11xLljhcxKQEnkc](https://zdoc-images.s3.us-west-2.amazonaws.com/v1qjb3sk1oga11xlljhcxkqenkc.png "V1QJb3SK1oGa11xLljhcxKQEnkc")

- このオプションを有効にすると、復元後に作成されるクラスターは、以下で指定された KMS キーを使用して暗号化されます。

- このオプションを無効にすると、復元後に作成されるクラスターは暗号化されません。

## FAQ\{#faq}

**復元されたクラスターはどの Milvus バージョンで動作しますか？**

復元されたクラスターは、復元時点で Zilliz Cloud がサポートする最新の Milvus バージョンで動作します。これは、バックアップ作成時に使用されたバージョンとは関係ありません。たとえば、Milvus 2.5.x のクラスターをバックアップし、プラットフォームが 2.6.x にアップグレードされた後に復元した場合、復元されたクラスターは Milvus 2.6.x で動作します。バックアップファイルにはデータのみが含まれており、クラスターのバージョンはプラットフォームによって決定されます。           