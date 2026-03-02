---
title: "自動バックアップのスケジュール | BYOC"
slug: /schedule-automatic-backups
sidebar_label: "自動バックアップのスケジュール"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudでは、クラスターの自動バックアップを有効にすることで、予期せぬ問題が発生した場合のデータ復旧を確実にします。自動バックアップはクラスター全体に適用され、個々のコレクションの自動バックアップはサポートされていません。 | BYOC"
type: origin
token: HDmKwGeGLi2P67kGdNXcigXDn3e
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - バックアップ
  - 自動
  - hnswアルゴリズム
  - ベクトル類似性検索
  - 近似最近傍探索
  - DiskANN

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# 自動バックアップのスケジュール設定

Zilliz Cloudでは、クラスターの**自動バックアップ**を有効にすることで、予期せぬ問題が発生した場合のデータ復旧を確実にします。自動バックアップは**クラスター全体**に適用され、個々のcollectionの自動バックアップはサポートされていません。

このガイドでは、Zilliz Cloudで自動バックアップをスケジュールする方法を説明します。オンデマンドバックアップを作成するには、[バックアップの作成](./create-snapshot)を参照してください。

## 制限事項{#limits}

- **アクセス制御**: **プロジェクト管理者**、**組織所有者**、またはバックアップ権限を持つ**カスタムロール**である必要があります。

- **バックアップから除外されるもの**:

    - collectionのTTL設定

    - デフォルトユーザー`db_admin`のパスワード（[復元](./restore-from-snapshot)時に新しいパスワードが生成されます）

    - クラスターの動的およびスケジュールされたスケーリング設定

- **クラスターshard設定**: バックアップされますが、クラスターのCUサイズが縮小された場合、CUあたりのshard制限により、復元時に調整されることがあります。詳細は[Zilliz Cloudの制限事項](./limits#shards)を参照してください。

- **バックアップジョブの制限**:

    - 自動バックアップの実行中は、手動バックアップを開始できません。

    - 手動バックアップがすでに実行中の場合でも、自動バックアップは実行されます。

## 自動バックアップの有効化{#enable-automatic-backup}

自動バックアップ設定はクラスター固有であり、**デフォルトでは無効**です。バックアップにはストレージコストがかかるため、Zilliz Cloudがバックアップを作成するタイミングと方法を制御できます。自動バックアップが有効になると、Zilliz Cloudはすぐに最初のバックアップを生成し、その後、指定されたスケジュールに基づいて定期的なバックアップを生成します。

### ウェブコンソール経由{#via-web-console}

ウェブコンソールで自動バックアップを有効にすると、Zilliz Cloudはデフォルトで以下の設定になります。

- **頻度:** 毎日バックアップを作成

- **バックアップ時間:** 午前8時から午前10時（UTC +08:00）の間

- **保持期間:** 各バックアップを7日間保持

これらの設定は、必要に応じて調整できます。

以下のデモは、自動バックアップを有効にして設定する方法を示しています。

<Supademo id="cmcsqvpfk0gns9st8bd3faaje?utm_source=link" title=""  />

### RESTful API経由{#via-restful-api}

以下の例は、クラスターの自動バックアップを有効にします。RESTful APIの詳細については、[バックアップポリシーの設定](/reference/restful/set-backup-policy-v2)を参照してください。

```bash
export TOKEN="YOUR_API_KEY"
export CLUSTER_ID="inxx-xxxxxxxxxxxxxxx"

curl --request POST \
--url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/policy" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "frequency": "1,2,3,5",
    "startTime": "02:00-04:00",
    "retentionDays": 7,
    "enabled": true
}'
```

上記ポリシーを使用して作成されたバックアップのクロスリージョンコピーも作成するには、次のようにします。

```bash
curl --request POST \
--url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/policy" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "frequency": "1,2,3,5",
    "startTime": "02:00-04:00",
    "retentionDays": 7,
    "enabled": true,
    "crossRegionPolicies": [
        {
            "regionId": "aws-us-west-2",
            "retentionDays": 7,
            "region": "us-west-2"
        },
        {
            "regionId": "aws-us-east-1",
            "retentionDays": 7,
            "region": "us-east-1"
        }
    ]
}'
```

以下は出力例です。自動バックアップが有効になると、すぐにバックアップジョブが生成されます。[プロジェクトジョブセンター](/docs/job-center)で進捗状況を確認できます。

```bash
{
    "code": 0,
    "data": {
        "clusterId": "inxx-xxxxxxxxxxxxxxx",
        "status": "ENABLED"
    }
}
```

## バックアップスケジュールを確認する{#check-backup-schedule}

自動バックアップが有効になっている場合、そのスケジュールを確認できます。

### ウェブコンソール経由{#via-web-console}

以下のデモは、Zilliz Cloud ウェブコンソールで自動バックアップスケジュールを確認する方法を示しています。

<Supademo id="cmcsr43kx02umxk0ih3i31jaq?utm_source=link" title=""  />

### RESTful API 経由{#via-restful-api}

以下の例は、クラスターの自動バックアップポリシーを確認します。RESTful API の詳細については、[Get Backup Policy](/reference/restful/get-backup-policy-v2) を参照してください。

```bash
curl --request GET \
--url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/policy" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json"
```

以下は出力例です。 

```bash
{
    "code": 0,
    "data": {
        "clusterId": "inxx-xxxxxxxxxxxxxxx",
        "status": "ENABLED",
        "startTime": "02:00-04:00",
        "frequency": "1,2,3,5",
        "retentionDays": 7,
        "crossRegionPolicies": [
            {
                "regionId": "aws-us-west-2",
                "retentionDays": 7,
                "region": "us-west-2"
            },
            {
                "regionId": "aws-us-east-1",
                "retentionDays": 7,
                "region": "us-east-1"
            }
        ]
    }
}
```

## 自動バックアップを無効にする{#disable-automatic-backup}

クラスターの自動バックアップを無効にすることもできます。

### ウェブコンソール経由{#via-web-console}

以下のデモは、Zilliz Cloud ウェブコンソールで自動バックアップスケジュールを確認する方法を示しています。

<Supademo id="cmcsr7chx0gu29st8s0obm37l?utm_source=link" title=""  />

### RESTful API 経由{#via-restful-api}

以下の例は、クラスターの自動バックアップを無効にします。RESTful API の詳細については、「[Set Backup Policy](/reference/restful/set-backup-policy-v2)」を参照してください。

```bash
curl --request POST \
--url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/policy" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "enabled": false
}'
```

以下は出力例です。 

```bash
{
    "code": 0,
    "data": {
        "clusterId": "inxx-xxxxxxxxxxxxxxx",
        "status": "DISABLED"
    }
}
```

## よくある質問{#faqs}

**バックアップジョブにはどのくらいの時間がかかりますか？**
バックアップにかかる時間は、データのサイズによって異なります。参考として、700 MBのバックアップには通常約1秒かかります。クラスターに1,000を超えるcollectionが含まれている場合、プロセスにはもう少し時間がかかる場合があります。

**バックアップ中にDDL（データ定義言語）操作を実行できますか？**
バックアップの進行中に、collectionの作成や削除などの主要なDDL（データ定義言語）操作を避けることをお勧めします。これらの操作はプロセスを妨害したり、一貫性のない結果につながる可能性があります。

**自動バックアップファイルの保持期間はどのくらいですか？**

自動バックアップのデフォルトの保持期間は7日間で、最大30日間まで調整できます。

**元のクラスターが削除された場合、バックアップファイルも削除されますか？**

これは、バックアップファイルの作成方法によって異なります。すべての自動バックアップは、元のクラスターとともに削除されます。しかし、[手動クラスターバックアップ](./create-snapshot)は永続的に保持され、クラスターが削除されても削除されません。不要になった場合は、手動で削除する必要があります。

