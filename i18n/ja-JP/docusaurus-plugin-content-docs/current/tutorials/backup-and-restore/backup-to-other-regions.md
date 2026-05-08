---
title: "リージョン間バックアップ | Cloud"
slug: /backup-to-other-regions
sidebar_key: backup-to-other-regions
sidebar_label: "リージョン間バックアップ"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud のリージョン間バックアップは、バックアップを複数のクラウドリージョンにコピーすることでデータ保護を強化します。リージョン全体の停止に対する保護、災害復旧、ビジネス継続性、および高可用性をサポートし、局所的な障害によるリスクを最小限に抑えます。"
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

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# クロスリージョンバックアップ

Zilliz Cloud のクロスリージョンバックアップは、バックアップを複数のクラウドリージョンにコピーすることでデータ保護を強化します。これにより、リージョン全体の停止に対する保護、ディザスタリカバリー、ビジネス継続性、および高可用性が実現され、局所的な障害によるリスクを最小限に抑えることができます。

このガイドでは、Zilliz Cloud でクロスリージョンバックアップを使用する方法について説明します。

現在、Azure 上のクラスターはクロスリージョンバックアップをサポートしていません。

<Admonition type="info" icon="📘" title="Notes">

この機能は、**ビジネスクリティカル** プロジェクトの **Dedicated** クラスターでのみ利用可能です。

</Admonition>

## 制限\{#limits}

- **アクセス制御**: **プロジェクト管理者**、**組織オーナー**、またはバックアップ権限を持つ **カスタムロール** である必要があります。

- **バックアップから除外**:

    - コレクションの TTL 設定

    - デフォルトユーザー `db_admin` のパスワード（[復元](./restore-from-snapshot)時に新しいパスワードが生成されます）

    - クラスターの動的およびスケジュールされたスケーリング設定

- **クラスターシャード設定**: バックアップされますが、クラスターの CU サイズが縮小される場合、CU あたりのシャード数の制限により、復元時に調整される可能性があります。詳細については、[Zilliz Cloud 制限s](./limits#shards) を参照してください。

- **バックアップジョブの制限**: クロスリージョンバックアップのコピージョブは、元のバックアップジョブが完了した後に開始されます。

## 手順\{#procedures}

クロスリージョンバックアップは、[手動でバックアップを作成する](./create-snapshot) 際、または [自動バックアップをスケジュールする](./schedule-automatic-backups) 際に有効にすることができます。

- **手動バックアップ:** 手動作成時にクロスリージョンバックアップを選択した場合、コピーされたすべてのバックアップが永久に保持されます。

- **スケジュールされたバックアップ:** スケジュールされたバックアップ時にクロスリージョンバックアップを選択した場合、各リージョンでコピーされたバックアップファイルの保持期間を設定する必要があります。

<Admonition type="info" icon="📘" title="Notes">

- 選択できるリージョンは、元のリージョンと同じクラウドプロバイダーのものに限ります。

</Admonition>

以下のデモでは、手動でバックアップを作成する際にクロスリージョンバックアップを使用する方法を示します。自動バックアップをスケジュールする際にクロスリージョンバックアップを使用する方法の詳細については、[自動バックアップのスケジュール](./schedule-automatic-backups) を参照してください。

<Supademo id="cmgkg6um62deokrn973s89qfx?utm_source=link" title=""  />

また、Zilliz Cloud RESTful API を使用して、ターゲットクラスターと同じリージョンで手動作成されたバックアップのクロスリージョンコピーを以下のように作成することもできます。

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

[ジョブ](./job-center) リストでは、まず元のバックアップ ジョブが表示されます。完了すると、選択した各リージョンにバックアップ ファイルをコピーするための追加ジョブが表示され、リージョンごとに 1 件のレコードが作成されます。

## 請求への影響\{#billing-implications}

クロスリージョン バックアップを選択すると、2 種類の料金が発生する場合があります。

- **ストレージ コスト:** コピーされたバックアップ ファイルが保存されるリージョンに基づきます。ストレージ コストの計算方法については、[ストレージ コスト](./storage-cost) を参照してください。

- **データ転送コスト:** ソース リージョンとターゲット リージョン間のトラフィックに基づきます。ストレージ コストの計算方法については、[データ転送コスト](./data-transfer-cost) を参照してください。

詳細な料金については、[料金ガイド](https://zilliz.com/pricing/pricing-guide) を参照してください。

### 例\{#example}

クラスターが **GCP us-west1 (Oregon)** にデプロイされており、このクラスターのバックアップ ファイルを 2 つの異なるリージョン、**GCP us-east4 (Virginia, USA)** と **GCP europe-west3 (Frankfurt)** にコピーする必要があるとします。

- **元のバックアップファイルサイズ**: 20 GB

- **コピーされたバックアップの保持期間**: 1 か月

- **単価**: 

    - GCP のバックアップ ストレージの単価は **&#36;0.02/GB 月** です。

    - GCP us-west1 (Oregon) から GCP us-central1 (Iowa) へのデータ転送は、同一大陸のクロスリージョン レート **&#36;0.02/GB** で請求されます。

    - GCP us-west1 (Oregon) から GCP europe-west3 (Frankfurt) へのデータ転送は、異大陸のクロスリージョン レート **&#36;0.08/GB** で請求されます。

以下はコスト計算です。

- **ストレージ コスト:** `20 GB × $0.02/GB 月 × 1 か月 × 2 コピー = $0.80`

- **データ転送コスト:** `(20 GB × $0.02/GB) + (20 GB × $0.08/GB) = $2.00`

- **合計コスト:** `$0.80 (ストレージ) + $2.00 (データ転送) = $2.80`

