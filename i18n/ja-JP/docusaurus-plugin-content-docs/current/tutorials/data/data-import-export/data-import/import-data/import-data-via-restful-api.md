---
title: "データのインポート (RESTful API) | Cloud"
slug: /import-data-via-restful-api
sidebar_label: "RESTful API"
beta: FALSE
notebook: FALSE
description: "このページでは、Zilliz Cloud RESTful API を介して準備されたデータをインポートする方法について説明します。 | Cloud"
type: origin
token: ZOikw2pIUiAZj9kuLYRcdhLnnoc
sidebar_position: 2
keywords: 
  - zilliz
  - ベクターデータベース
  - cloud
  - データインポート
  - restful
  - Elastic ベクターデータベース
  - Pinecone vs Milvus
  - Chroma vs Milvus
  - Annoy ベクター検索

---

import Admonition from '@theme/Admonition';


# データのインポート (RESTful API)

このページでは、Zilliz Cloud RESTful API を介して準備されたデータをインポートする方法について説明します。

## 始める前に{#before-you-start}

以下の条件が満たされていることを確認してください。

- クラスターの API キーを取得していること。詳細については、「[API キーの管理](./manage-api-keys)」を参照してください。

- サポートされているいずれかの形式でデータを準備していること。

    データの準備方法の詳細については、「[ストレージオプション](./data-import-storage-options)」および「[フォーマットオプション](./data-import-format-options)」を参照してください。また、エンドツーエンドのノートブック「[データインポートハンズオン](./data-import-zero-to-hero)」も参照してください。

- 例のデータセットと一致するスキーマを持つコレクションを作成していること。

     コレクションの作成の詳細については、「[コレクションの管理 (コンソール)](./manage-collections-console)」を参照してください。

## ボリュームを介したデータのインポート{#import-data-via-volume}

ボリュームを介してファイルからデータをインポートするには、まずボリュームを作成し、そこにファイルをアップロードする必要があります。それが完了したら、ボリューム内のファイルへのパスを取得します。詳細については、「[ボリュームの管理 (SDK)](./manage-stages)」を参照してください。

その後、アップロードされたデータを次のように特定のコレクションにインポートできます。

```bash
curl --request POST \
--url "https://api.cloud.zilliz.com/v2/vectordb/jobs/import/create" \
--header "Authorization: Bearer ${TOKEN}" \
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

特定のパーティションにデータをインポートするには、リクエストに`partitionName`を含める必要があります。

Zilliz Cloudが上記のリクエストを処理した後、ジョブIDを受け取ります。このジョブIDを使用して、以下のコマンドでインポートの進捗を監視します。

```bash
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/vectordb/jobs/import/getProgress" \
     --header "Authorization: Bearer ${TOKEN}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     -d '{
        "clusterId": "inxx-xxxxxxxxxxxxxxx",
        "jobId": "job-xxxxxxxxxxxxxxxxxxxxx"
    }'
```

## 外部ストレージ経由でデータをインポートする{#import-data-via-external-storage}

外部ストレージ経由でファイルからデータをインポートするには、まずファイルをAWS S3やGoogle Cloud Storage (GCS)などのオブジェクトストレージバケットにアップロードする必要があります。アップロード後、リモートバケット内のファイルへのパスと、Zilliz Cloudがバケットからデータをプルするためのバケット認証情報を取得します。サポートされているオブジェクトパスの詳細については、[ストレージオプション](./data-import-storage-options)を参照してください。

データのセキュリティ要件に基づいて、データインポート中に長期または短期の認証情報のいずれかを使用できます。

認証情報の取得に関する詳細については、以下を参照してください。

- Amazon S3: [長期認証情報を使用した認証](https://docs.aws.amazon.com/sdkref/latest/guide/access-iam-users.html)

- Google Cloud Storage: [サービスアカウントのHMACキーの管理](https://cloud.google.com/storage/docs/authentication/managing-hmackeys)

- Azure Blob Storage: [アカウントアクセスキーの表示](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys)

セッショントークンの使用に関する詳細については、[このFAQ](/docs/faq-data-import#can-i-use-short-term-credentials-when-importing-data-from-an-object-storage-service)を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<p>データインポートを成功させるには、ターゲットコレクションの実行中または保留中のインポートジョブが10,000未満であることを確認してください。</p>

</Admonition>

オブジェクトパスとバケット認証情報が取得されたら、次のようにAPIを呼び出します。

```bash
# replace url and token with your own
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/vectordb/jobs/import/create" \
     --header "Authorization: Bearer ${TOKEN}" \
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

特定のパーティションにデータをインポートするには、リクエストに`partitionName`を含める必要があります。

Zilliz Cloudが上記のリクエストを処理した後、ジョブIDを受け取ります。このジョブIDを使用して、以下のコマンドでインポートの進捗を監視します。

```bash
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/vectordb/jobs/import/getProgress" \
     --header "Authorization: Bearer ${TOKEN}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     -d '{
        "clusterId": "inxx-xxxxxxxxxxxxxxx",
        "jobId": "job-xxxxxxxxxxxxxxxxxxxxx"
    }'
```

詳細については、[インポート](/reference/restful/create-import-jobs-v2)と[インポートの進捗状況の取得](/reference/restful/get-import-job-progress-v2)を参照してください。

## 結果の検証{#verify-the-result}

コマンド出力が以下のようであれば、インポートジョブは正常に送信されています。

```bash
{
    "code": 0,
    "data": {
        "jobId": "job-xxxxxxxxxxxxxxxxxxxxx"
    }
}
```

現在のインポートジョブの進捗状況を取得したり、すべてのインポートジョブを一覧表示したりするには、RESTful API を呼び出すこともできます。詳細については、[現在のインポートジョブの進捗状況を取得する](/reference/restful/get-import-job-progress-v2) および [すべてのインポートジョブを一覧表示する](/reference/restful/list-import-jobs-v2) を参照してください。または、Zilliz Cloud コンソールの [ジョブセンター](./job-center) にアクセスして、結果とジョブの詳細を表示することもできます。

