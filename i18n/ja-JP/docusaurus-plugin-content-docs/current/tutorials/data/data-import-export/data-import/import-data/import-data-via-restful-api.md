---
title: "データのインポート (RESTful API) | Cloud"
slug: /import-data-via-restful-api
sidebar_label: "RESTful API"
beta: FALSE
notebook: FALSE
description: "このページでは、Zilliz Cloud RESTful API を使用して準備済みのデータをインポートする方法について説明します。| Cloud"
type: origin
token: ZOikw2pIUiAZj9kuLYRcdhLnnoc
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - データインポート
  - restful

---

import Admonition from '@theme/Admonition';


# データのインポート (RESTful API)

このページでは、Zilliz Cloud RESTful API を使用して準備済みのデータをインポートする方法を紹介します。

## 始める前に\{#before-you-start}

以下の条件が満たされていることを確認してください。

- クラスター用の APIキー を取得済みであること。詳細については、[APIキーs](./manage-api-keys) を参照してください。

- サポートされているいずれかの形式でデータを準備済みであること。

    データの準備方法の詳細については、[Storage Options](./data-import-storage-options) および [Format Options](./data-import-format-options) を参照してください。また、エンドツーエンドのノートブック [データインポート Hands-On](./data-import-zero-to-hero) も参考になります。

- サンプルデータセットに一致するスキーマを持つコレクションを作成済みであること。

     コレクションの作成方法の詳細については、[Manage Collections (Console)](./manage-collections-console) を参照してください。

## ボリューム経由でデータをインポートする\{#import-data-via-volume}

ボリューム経由でファイルからデータをインポートするには、まずボリュームを作成し、その中にファイルをアップロードする必要があります。完了後、ボリューム内のファイルパスを取得してください。詳細については、[Manage ボリュームs (SDK)](./manage-stages) を参照してください。

その後、以下のようにアップロード済みのデータを特定のコレクションにインポートできます。

```bash
curl --request POST \
--url "https://api.cloud.zilliz.com/v2/vectordb/jobs/import/create" \
--header "Authorization: Bearer ${API_KEY}" \
--header "Content-Type: application/json" \
-d '{
    "clusterId": "inxx-xxxxxxxxxxxxxxx",
    "dbName": "default",
    "collectionName": "medium_articles",
    "partitionName": "",
    "volumeName": "my_volume",
    "dataPaths": [
        [
            "json-folder/1.json"
        ]
    ]
}'
```

特定のパーティションにデータをインポートするには、リクエストに `partitionName` を含める必要があります。

Zilliz Cloud が上記のリクエストを処理した後、ジョブ ID が返されます。このジョブ ID を使用して、次のコマンドでインポートの進捗状況を監視できます。

```bash
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/vectordb/jobs/import/getProgress" \
     --header "Authorization: Bearer ${API_KEY}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     -d '{
        "clusterId": "inxx-xxxxxxxxxxxxxxx",
        "jobId": "job-xxxxxxxxxxxxxxxxxxxxx"
    }'
```

## 外部ストレージ経由でのデータインポート\{#import-data-via-external-storage}

外部ストレージ経由でファイルからデータをインポートするには、まずファイルを AWS S3 や Google Cloud Storage (GCS) などのオブジェクトストレージバケットにアップロードする必要があります。アップロード後、リモートバケット内のファイルパスと、Zilliz Cloud がお客様のバケットからデータを取得するために必要なバケット認証情報を取得してください。サポートされているオブジェクトパスの詳細については、[ストレージオプション](./data-import-storage-options) を参照してください。

データセキュリティ要件に応じて、データインポート時に長期認証情報または短期認証情報のいずれかを使用できます。

認証情報の取得方法の詳細については、以下を参照してください：

- Amazon S3: [長期認証情報を使って認証する](https://docs.aws.amazon.com/sdkref/latest/guide/access-iam-users.html)

- Google Cloud Storage: [サービスアカウントの HMAC キーを管理する](https://cloud.google.com/storage/docs/authentication/managing-hmackeys)

- Azure Blob Storage: [ストレージアカウントのアクセスキーを表示する](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys)

セッショントークンの使用方法については、[この FAQ](/docs/faq-data-import#can-i-use-short-term-credentials-when-importing-data-from-an-object-storage-service) を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<p>データインポートを成功させるには、ターゲットコレクションの実行中または保留中のインポートジョブが 10,000 件未満であることを確認してください。</p>

</Admonition>

オブジェクトパスおよびバケット認証情報を取得したら、次のように API を呼び出します：

```bash
# replace url and token with your own
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/vectordb/jobs/import/create" \
     --header "Authorization: Bearer ${API_KEY}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     -d '{
        "clusterId": "inxx-xxxxxxxxxxxxxxx",
        "collectionName": "medium_articles",
        "partitionName": "",
        "objectUrl": "https://assets.zilliz.com/docs/example-data-import.json",
        "accessKey": "",
        "secretKey": ""
    }'
```

特定のパーティションにデータをインポートするには、リクエストに `partitionName` を含める必要があります。

Zilliz Cloud が上記のリクエストを処理した後、ジョブ ID が返されます。このジョブ ID を使用して、次のコマンドでインポートの進捗状況を監視できます。

```bash
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/vectordb/jobs/import/getProgress" \
     --header "Authorization: Bearer ${API_KEY}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     -d '{
        "clusterId": "inxx-xxxxxxxxxxxxxxx",
        "jobId": "job-xxxxxxxxxxxxxxxxxxxxx"
    }'
```

詳細については、[インポート](/reference/restful/create-import-jobs-v2) および [インポート進捗の取得](/reference/restful/get-import-job-progress-v2) を参照してください。

## 結果の確認\{#verify-the-result}

コマンドの出力が以下と同様の場合、インポートジョブは正常に送信されています:

```bash
{
    "code": 0,
    "data": {
        "jobId": "job-xxxxxxxxxxxxxxxxxxxxx"
    }
}
```

RESTful API を呼び出して、[現在のインポートジョブの進捗を取得](/reference/restful/get-import-job-progress-v2)したり、[すべてのインポートジョブを一覧表示](/reference/restful/list-import-jobs-v2)して詳細情報を取得することもできます。別の方法として、Zilliz Cloud コンソールの [ジョブセンター](./job-center) にアクセスして、結果やジョブの詳細を確認することも可能です。

