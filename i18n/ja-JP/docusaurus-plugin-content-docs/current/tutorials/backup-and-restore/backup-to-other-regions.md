---
title: "クロスリージョンバックアップ | Cloud"
slug: /backup-to-other-regions
sidebar_label: "クロスリージョンバックアップ"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudのクロスリージョンバックアップは、バックアップを複数のクラウドリージョンにコピーすることでデータ保護を強化します。リージョン障害から保護し、局所的な障害によるリスクを最小限に抑えることで、災害復旧、事業継続性、高可用性をサポートします。"
type: origin
token: ESVGwTkn8iLfUakSSrkc5dWJnye
sidebar_position: 3
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - バックアップ
  - ファイル
  - 表示

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# クロスリージョンバックアップ

Zilliz Cloudのクロスリージョンバックアップは、バックアップを複数のクラウドリージョンにコピーすることでデータ保護を強化します。これにより、リージョン障害から保護し、局所的な障害によるリスクを最小限に抑えることで、災害復旧、事業継続性、高可用性をサポートします。

このガイドでは、Zilliz Cloudでクロスリージョンバックアップを使用する方法を説明します。

現在、Azure上のクラスターはクロスリージョンバックアップをサポートしていません。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Dedicated</strong>クラスターでのみ利用可能です。</p>

</Admonition>

## 制限事項\{#limits}

- **アクセス制御**: **プロジェクト管理者**、**組織オーナー**、またはバックアップ権限を持つ**カスタムロール**である必要があります。

- **バックアップから除外**:

    - コレクションTTL設定

    - デフォルトユーザー`db_admin`のパスワード（[復元](./restore-from-snapshot)時に新しいパスワードが生成されます）

    - クラスターの動的およびスケジュールされたスケーリング設定

- **クラスターシャード設定**: バックアップされますが、クラスターのCUサイズが縮小された場合、CUあたりのシャードの制限により、復元時に調整されることがあります。詳細は[Zilliz Cloud 制限s](./limits#shards)を参照してください。

- **バックアップジョブの制限**: クロスリージョンバックアップコピーのジョブは、元のバックアップジョブが完了した後に開始されます。

## 手順\{#procedures}

クロスリージョンバックアップは、[手動でバックアップを作成する](./create-snapshot)際、または[自動バックアップをスケジュールする](./schedule-automatic-backups)際に有効にできます。

- **手動バックアップ:** 手動作成時にクロスリージョンバックアップを選択した場合、コピーされたすべてのバックアップは永続的に保持されます。

- **スケジュールされたバックアップ:** スケジュールされたバックアップ時にクロスリージョンバックアップを選択した場合、各リージョンでコピーされたバックアップファイルの保持期間を設定する必要があります。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li>元のリージョンと同じクラウドプロバイダーのリージョンのみを選択できます。</li>
</ul>
<p></p>

</Admonition>

以下のデモでは、手動でバックアップを作成する際にクロスリージョンバックアップを使用する方法を示します。自動バックアップをスケジュールする際にクロスリージョンバックアップを使用する方法の詳細については、[自動バックアップをスケジュールする](./schedule-automatic-backups)を参照してください。

<Supademo id="cmgkg6um62deokrn973s89qfx?utm_source=link" title=""  />

Zilliz Cloud RESTful APIを使用して、ターゲットクラスターと同じリージョンで作成されたバックアップのクロスリージョンコピーを手動で作成することもできます。

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

[ジョブ](./job-center) リストには、まず元のバックアップジョブが表示されます。それが完了すると、選択された各リージョンにバックアップファイルをコピーするための追加ジョブが、リージョンごとに1つのレコードとして表示されます。

## 請求への影響\{#billing-implications}

クロスリージョンバックアップを選択すると、2種類の料金が発生する可能性があります。

- **ストレージコスト:** コピーされたバックアップファイルが保存されるリージョンに基づきます。ストレージコストの計算方法については、[ストレージコスト](./storage-cost) を参照してください。

- **データ転送料金:** ソースリージョンとターゲットリージョン間のトラフィックに基づきます。ストレージコストの計算方法については、[データ転送料金](./data-transfer-cost) を参照してください。

詳細な料金については、[料金ガイド](https://zilliz.com/pricing/pricing-guide) を参照してください。

### 例\{#example}

クラスターが **GCP us-west1 (オレゴン)** にデプロイされており、このクラスターのバックアップファイルを **GCP us-east4 (バージニア、米国)** と **GCP europe-west3 (フランクフルト)** の2つの異なるリージョンにコピーする必要があるとします。

- **元のバックアップファイルサイズ**: 20 GB

- **コピーされたバックアップの保持期間**: 1ヶ月

- **単価**:

    - GCPでのバックアップストレージの単価は、**月額 &#36;0.02/GB** です。

    - GCP us-west1 (オレゴン) から GCP us-central1 (アイオワ) へのデータ転送は、同一大陸のクロスリージョン料金である **&#36;0.02/GB** で課金されます。

    - GCP us-west1 (オレゴン) から GCP europe-west3 (フランクフルト) へのデータ転送は、異なる大陸のクロスリージョン料金である **&#36;0.08/GB** で課金されます。

以下はコスト計算です。

- **ストレージコスト:** `20 GB × $0.02/GB (月額) × 1ヶ月 × 2コピー = $0.80`

- **データ転送料金:** `(20 GB × $0.02/GB) + (20 GB × $0.08/GB) = $2.00`

- **合計コスト:** `$0.80 (ストレージ) + $2.00 (データ転送) = $2.80`

