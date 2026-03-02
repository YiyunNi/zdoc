---
title: "クロスリージョンバックアップ | Cloud"
slug: /backup-to-other-regions
sidebar_label: "クロスリージョンバックアップ"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud のクロスリージョンバックアップは、バックアップを複数のクラウドリージョンにコピーすることでデータ保護を強化します。リージョン障害から保護し、局所的な障害によるリスクを最小限に抑えることで、災害復旧、事業継続、高可用性をサポートします。 | Cloud"
type: origin
token: ESVGwTkn8iLfUakSSrkc5dWJnye
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - バックアップ
  - ファイル
  - 表示
  - knn
  - 画像検索
  - LLMs
  - 機械学習

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# クロスリージョンバックアップ

Zilliz Cloud のクロスリージョンバックアップは、バックアップを複数のクラウドリージョンにコピーすることでデータ保護を強化します。これにより、リージョン全体の障害から保護し、ローカライズされた障害によるリスクを最小限に抑えることで、災害復旧、事業継続性、高可用性をサポートします。

このガイドでは、Zilliz Cloud でクロスリージョンバックアップを使用する方法を説明します。

現在、Azure 上のクラスターはクロスリージョンバックアップをサポートしていません。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Dedicated</strong> クラスターでのみ利用可能です。</p>

</Admonition>

## 制限事項{#limits}

- **アクセス制御**: **プロジェクト管理者**、**組織所有者**、またはバックアップ権限を持つ**カスタムロール**である必要があります。

- **バックアップから除外されるもの**:

    - collection の TTL 設定

    - デフォルトユーザー `db_admin` のパスワード（[リストア](./restore-from-snapshot)時に新しいパスワードが生成されます）

    - クラスターの動的およびスケジュールされたスケーリング設定

- **クラスター shard 設定**: バックアップされますが、クラスターの CU サイズが縮小された場合、CU あたりの shard 制限により、リストア時に調整されることがあります。詳細は [Zilliz Cloud Limits](./limits#shards) を参照してください。

- **バックアップジョブの制限**: クロスリージョンバックアップコピーのジョブは、元のバックアップジョブが完了した後に開始されます。

## 手順{#procedures}

クロスリージョンバックアップは、[手動でバックアップを作成する](./create-snapshot)際、または[自動バックアップをスケジュールする](./schedule-automatic-backups)際に有効にできます。

- **手動バックアップ**: 手動作成時にクロスリージョンバックアップを選択した場合、コピーされたすべてのバックアップは永続的に保持されます。

- **スケジュールされたバックアップ**: スケジュールされたバックアップ時にクロスリージョンバックアップを選択した場合、各リージョンでコピーされたバックアップファイルの保持期間を設定する必要があります。

<Admonition type="info" icon="📘" title="Notes">

<p>元のリージョンと同じクラウドプロバイダーのリージョンのみを選択できます。</p>

</Admonition>

以下のデモは、手動でバックアップを作成する際にクロスリージョンバックアップを使用する方法を示しています。自動バックアップをスケジュールする際にクロスリージョンバックアップを使用する方法の詳細については、[自動バックアップをスケジュールする](./schedule-automatic-backups)を参照してください。

<Supademo id="cmgkg6um62deokrn973s89qfx?utm_source=link" title=""  />

Zilliz Cloud RESTful API を使用して、ターゲットクラスターと同じリージョンに作成されたバックアップのクロスリージョンコピーを手動で作成することもできます。

```bash
export TOKEN="YOUR_API_KEY"
export CLUSTER_ID="inxx-xxxxxxxxxxxxxxx"

curl --request POST \
--url "${BASE_URL}/v2/clusters/${CLUSTER_ID}/backups/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "backupType": "COLLECTION",
    "dbCollections": [
        {
            "dbName": "my_database",
            "collectionNames": [
                "collection_1",
                "collection_2"
            ]
        }
    ],
    "crossRegionCopies": [
        {
            "regionId": "aws-us-west-2"
        },
        {
            "regionId": "aws-us-east-1"
        }
    ]
}'
```

出力は以下のようになります。

```markdown
# Zilliz Cloud V2.0.0 Release Notes

This document describes the release notes for Zilliz Cloud V2.0.0.

## Version

V2.0.0

## Release Date

2024-01-20

## New Features

### 1. Zilliz Cloud now supports role-based access control (RBAC).

Zilliz Cloud now supports role-based access control (RBAC). You can grant different roles to different users to control their access to Zilliz Cloud resources. For more information, see [RBAC](https://docs.zilliz.com/rbac).

### 2. Zilliz Cloud now supports data encryption at rest.

Zilliz Cloud now supports data encryption at rest. You can encrypt your data at rest to protect your data from unauthorized access. For more information, see [Data Encryption](https://docs.zilliz.com/data-encryption).

### 3. Zilliz Cloud now supports data encryption in transit.

Zilliz Cloud now supports data encryption in transit. You can encrypt your data in transit to protect your data from unauthorized access. For more information, see [Data Encryption](https://docs.zilliz.com/data-encryption).

## Improvements

### 1. Improved the performance of data import.

We have improved the performance of data import. You can now import data faster than before.

### 2. Improved the performance of data export.

We have improved the performance of data export. You can now export data faster than before.

### 3. Improved the performance of data query.

We have improved the performance of data query. You can now query data faster than before.

## Bug Fixes

### 1. Fixed a bug that caused data import to fail.

We have fixed a bug that caused data import to fail. You can now import data without any issues.

### 2. Fixed a bug that caused data export to fail.

We have fixed a bug that caused data export to fail. You can now export data without any issues.

### 3. Fixed a bug that caused data query to fail.

We have fixed a bug that caused data query to fail. You can now query data without any issues.
```

```json
{
    "code": 0,
    "data": {
        "backupId": "backupx_xxxxxxxxxxxxxxx",
        "backupName": "Dedicated_01",
        "jobId": "job-xxxxxxxxxxxxxxxxxxxxxx"
    }
}
```

[ジョブ](./job-center) リストには、まず元のバックアップジョブが表示されます。完了すると、選択した各リージョンにバックアップファイルをコピーするための追加ジョブが、リージョンごとに1つのレコードで表示されます。

## 課金への影響{#billing-implications}

クロスリージョンバックアップを選択すると、2種類の料金が発生する可能性があります。

- **ストレージ費用:** コピーされたバックアップファイルが保存されているリージョンに基づいて計算されます。ストレージ費用の計算方法については、[ストレージ費用](./storage-cost) を参照してください。

- **データ転送費用:** ソースリージョンとターゲットリージョン間のトラフィックに基づいて計算されます。ストレージ費用の計算方法については、[データ転送費用](./data-transfer-cost) を参照してください。

詳細な料金については、[料金ガイド](https://zilliz.com/pricing/pricing-guide) を参照してください。

### 例{#example}

クラスターが **GCP us-west1 (オレゴン)** にデプロイされており、このクラスターのバックアップファイルを2つの異なるリージョン、**GCP us-east4 (バージニア、米国)** と **GCP europe-west3 (フランクフルト)** にコピーする必要があるとします。

- **元のバックアップファイルサイズ**: 20 GB

- **コピーされたバックアップの保持期間**: 1ヶ月

- **単価**:

    - GCPでのバックアップストレージの単価は、**1ヶ月あたり0.02ドル/GB** です。

    - GCP us-west1 (オレゴン) から GCP us-central1 (アイオワ) へのデータ転送は、同一大陸のクロスリージョン料金で **0.02ドル/GB** で課金されます。

    - GCP us-west1 (オレゴン) から GCP europe-west3 (フランクフルト) へのデータ転送は、異なる大陸のクロスリージョン料金で **0.08ドル/GB** で課金されます。

以下は費用計算です。

- **ストレージ費用:** `20 GB × $0.02/GB/月 × 1ヶ月 × 2コピー = $0.80`

- **データ転送費用:** `(20 GB × $0.02/GB) + (20 GB × $0.08/GB) = $2.00`

- **合計費用:** `$0.80 (ストレージ) + $2.00 (データ転送) = $2.80`

