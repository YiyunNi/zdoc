---
title: "データのマージ | Cloud"
slug: /merge-data
sidebar_key: merge-data
sidebar_label: "データをマージ"
beta: NEAR DEPRECATE
notebook: FALSE
description: "既存の Zilliz Cloud コレクションのデータと、ローカルファイルまたは外部オブジェクトストレージバケットのデータをマージして、両方のソースからのデータを組み合わせたコレクションを作成できます。これをデータマージ操作と呼び、既存のコレクションにデータを持つフィールドを追加する回避策として使用できます。"
type: origin
token: Q2qwwliDki25vRkZrYxc7Rnnn4e
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - ETL
  - 抽出
  - 変換
  - 読み込み
  - データマージ
  - データのマージ

---

import Admonition from '@theme/Admonition';


# データのマージ

既存の Zilliz Cloud コレクションのデータと、ローカルファイルまたは外部オブジェクトストレージバケットのデータをマージして、両方のソースからのデータを組み合わせたコレクションを作成できます。これをデータマージ操作と呼び、既存のコレクションにデータを含むフィールドを追加する回避策として使用できます。

<Admonition type="info" icon="📘" title="Notes">

- この機能は現在 **PRIVATE PREVIEW** です。この機能に興味があり、試してみたい場合は、遠慮なく [Zilliz Cloud サポート](https://support.zilliz.com/hc/en-us) までお問い合わせください。

</Admonition>

## 概要\{#overview}

データマージ操作は、リレーショナルデータベースの LEFT JOIN 操作に似ており、コレクションのデータと指定されたデータソースからのすべての一致するレコードを組み合わせ、マージされたデータを新しいコレクションに保存します。

データソースは、Zilliz Cloud ボリュームまたはオブジェクトストレージバケットに保存された PARQUET ファイルのセットである必要があります。

次の図に示すように、3つのフィールドを含むコレクションがあり、`id` フィールドがプライマリキーとして機能しています。さらに、`id` と `date` という2つのフィールドを持つ PARQUET ファイルがあります。`id` フィールドはマージキーとして機能し、その値はソースコレクションの値と一致する必要があります。`date` フィールドは追加するフィールドです。

![Gfduwu9hGh8CGkbcJ1JccREunRf](https://zdoc-images.s3.us-west-2.amazonaws.com/Gfduwu9hGh8CGkbcJ1JccREunRf.png)

PARQUET ファイルを Zilliz Cloud ボリュームまたはオブジェクトストレージバケットにアップロードしたら、[Merge データ API](/reference/restful/merge-data-v2) を使用して、両方のソースからのデータを保存するターゲットコレクションを作成できます。

データソースはオプションです。データソースを指定せずに Merge データ API を使用して、既存のコレクションにフィールドを追加する回避策としても使用できます。

このガイドでは、Merge データ API を使用して、データを含むフィールドとデータを含まないフィールドを追加する方法を説明します。

## データを含むフィールドの追加\{#add-fields-with-data}

データを含むフィールドを追加するには、ソースコレクション、データソース、およびターゲットコレクションに追加する新しいフィールドを提供する必要があります。

データソースは、Zilliz Cloud ボリュームまたは AWS S3 バケット内の PARQUET ファイルのセットである必要があります。

### ボリュームの使用\{#use-volume}

ボリュームを使用してデータマージ操作を実行するには、まずボリュームを作成し、ローカルファイルシステムからデータをアップロードします。これが完了したら、データマージ操作を実行して、既存のコレクションとボリュームの両方からのデータを組み合わせた新しいコレクションを作成できます。

次のコードスニペットは、ボリュームを使用してデータマージ操作を実行する方法を示しています。ボリュームの作成方法とデータのアップロード方法の詳細については、ステージの管理を参照してください。

```bash
export BASE_URL="https://api.cloud.zilliz.com"
export TOKEN="YOUR_API_KEY"

curl --request POST \
--url "${BASE_URL}/v2/etl/merge" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "clusterId": "in00-xxxxxxxxxxxxxxx",
    "dbName": "my_database",
    "collectionName": "my_collection",
    "destDbName": "my_database",
    "destCollectionName": "my_merged_collection",
    "dataSource": {
        "type": "volume",
        "volumeName": "my_volume",
        "dataPath": "path/to/your/parquet.parquet"
    },
    "mergeField": "id",
    "newFields": [
        {
            "fieldName": "date",
            "dataType": "VARCHAR",
            "params": {
                "maxLength": 10
            }
        }
    ]
}'
```

上記のコマンドを実行する前に、いくつか注意が必要なフィールドがあります。

- `dbName` と `collectionName`

    これら 2 つのパラメーターは、データマージ操作のソースコレクションを決定します。

- `destDbName` と `destCollectionName`

    これら 2 つのパラメーターは、データマージ操作後に生成されるターゲットコレクションを決定します。ターゲットコレクションは、ソースコレクションと同じクラスター内に存在する必要があります。

- `dataSource`

    このパラメーターはオプションであり、データソースの設定を含みます。例えば、データソースのタイプや、列指向データを含む Parquet ファイルのパスなどです。このデータはソースコレクションのデータとマージされ、ターゲットコレクションに保存されます。

    ボリュームを中間ストレージとして使用する場合は、`type` を `volume` に設定した後、`volumeName` と `dataPath` を設定する必要があります。

    <Admonition type="info" icon="📘" title="Notes">

    - `dataPath` パラメーターの値は、ボリュームのルートからのファイルの絶対パス、または複数の Parquet ファイルを含むボリューム内のフォルダーにすることができます。値がフォルダーを指す場合は、そのフォルダー内の Parquet ファイルが同じデータ構造を持っていることを確認してください。

        例えば、値は `path/to/your/file.parquet`（ファイル）または `path/to/your/folder/`（フォルダー）とすることができます。

    - データなしでフィールドを追加したいだけの場合は、このパラメーターを未指定のままにすることができます。

    </Admonition>

- `mergeField`

    データマージ操作は、リレーショナルデータベースシステムでの LEFT JOIN 操作に似ており、マージフィールドはソースコレクションと列指向データを含む Parquet ファイル間の共有キーとして機能します。

- `newFields`

    これは、データマージ操作後にターゲットコレクションに追加するフィールドのスキーマのリストです。サポートされているデータ型は VARCHAR、INT8、INT16、INT32、INT64、FLOAT、DOUBLE、および BOOL です。

上記のコマンドはデータマージジョブを作成し、その ID を返します。 

```json
{
    "code": 0,
    "data": {
        "jobId": "job-xxxxxxxxxxxxxxxxxxxxx"
    }
}
```

### オブジェクトストレージの使用\{#use-object-storage}

オブジェクトストレージバケットを使用してデータマージ操作を実行するには、まずオブジェクトストレージバケットを作成し、そのバケットにデータをアップロードします。それが完了したら、既存のコレクションとバケットの両方からデータを結合した新しいコレクションを作成するデータマージ操作を実行できます。

次のコードスニペットは、オブジェクトストレージバケットを使用してデータマージ操作を実行する方法を示しています。バケットの作成方法やデータのアップロード方法については、ご利用のブロックストレージサービスプロバイダーのドキュメントをご参照ください。

```bash
export BASE_URL="https://api.cloud.zilliz.com"
export TOKEN="YOUR_API_KEY"

curl --request POST \
--url "${BASE_URL}/v2/etl/merge" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "clusterId": "in00-xxxxxxxxxxxxxxx",
    "dbName": "my_database",
    "collectionName": "my_collection",
    "destDbName": "my_database",
    "destCollectionName": "my_merged_collection",
    "dataSource": {
        "type": "s3",
        "dataPath": "s3://my_bucket/path/to/your/parquet.parquet",
        "credential": {
            "accessKey": "xxxx",
            "secretKey": "xxxx"
        }
    },
    "mergeField": "id",
    "newFields": [
        {
            "fieldName": "date",
            "dataType": "VARCHAR",
            "params": {
                "maxLength": 10
            }
        }
    ]
}'
```

上記のコマンドを実行する前に、いくつか注意が必要なフィールドがあります。

- `dbName` と `collectionName`

    これら 2 つのパラメータは、データマージ操作のソースコレクションを決定します。

- `destDbName` と `destCollectionName`

    これら 2 つのパラメータは、データマージ操作後に生成されるターゲットコレクションを決定します。ターゲットコレクションは、ソースコレクションと同じクラスタ内に存在する必要があることに注意してください。

- `dataSource`

    このパラメータはオプションで、データソースの設定を含みます。例えば、データソースのタイプや、列指向データを含む Parquet ファイルのパスなどです。このデータはソースコレクションのデータとマージされ、ターゲットコレクションに保存されます。

    S3 互換のオブジェクトストレージバケットを中間ストレージとして使用する場合、`type` を `s3` に設定した後、`dataPath` と `credential` を設定する必要があります。

    <Admonition type="info" icon="📘" title="Notes">

    - `dataPath` パラメータの値は、バケットのルートからのファイルへの絶対パス、または複数の Parquet ファイルを含むバケット内のフォルダーにすることができます。値がフォルダーを指す場合、フォルダー内の Parquet ファイルが同じデータ構造を持っていることを確認してください。

        例えば、値は `s3://path/to/your/file.parquet`（ファイル）または `s3://path/to/your/folder/`（フォルダー）とすることができます。

    - データなしでフィールドを追加したいだけの場合は、このパラメータを未指定のままにすることができます。

    </Admonition>

- `mergeField`

    データマージ操作は、リレーショナルデータベースシステムでの LEFT JOIN 操作に似ており、マージフィールドはソースコレクションと列指向データを含む Parquet ファイル間の共有キーとして機能します。

- `newFields`

    これは、データマージ操作後にターゲットコレクションに追加するフィールドのスキーマのリストです。サポートされているデータ型は VARCHAR、INT8、INT16、INT32、INT64、FLOAT、DOUBLE、および BOOL です。

上記のコマンドはデータマージジョブを作成し、その ID を返します。 

```json
{
    "code": 0,
    "data": {
        "jobId": "job-xxxxxxxxxxxxxxxxxxxxx"
    }
}
```

## データなしでフィールドを追加する\{#add-fields-without-data}

既存のコレクションにフィールドを追加するための回避策として、Merge データ API を使用することもできます。この場合、データソースを設定する必要はありません。

```bash
export BASE_URL="https://api.cloud.zilliz.com"
export TOKEN="YOUR_API_KEY"

curl --request POST \
--url "${BASE_URL}/v2/etl/merge" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "clusterId": "in00-xxxxxxxxxxxxxxx",
    "dbName": "my_database",
    "collectionName": "my_collection",
    "destDbName": "my_database",
    "destCollectionName": "my_merged_collection",
    "mergeField": "id",
    "newFields": [
        {
            "fieldName": "date",
            "dataType": "VARCHAR",
            "params": {
                "maxLength": 10
            }
        }
    ]
}'
```

上記のコマンドはデータマージジョブを作成し、そのIDを返します。 

```json
{
    "code": 0,
    "data": {
        "jobId": "job-xxxxxxxxxxxxxxxxxxxxx"
    }
}
```

## 結果の確認\{#verify-the-results}

データマージジョブの ID を取得した後、[Describe Job](/reference/restful/describe-job-v2) または [Manage Project ジョブ](./job-center) に記載されている手順を使用して、ジョブのステータスを詳細に確認できます。

データマージジョブが完了したら、ターゲットコレクションのスキーマとターゲットコレクション内のエンティティ数が期待どおりであるかどうかを確認できます。

## トラブルシューティング\{#troubleshooting}

1. **Parquet ファイル内の行のマージキーがソースコレクション内のいずれのエンティティとも一致しない場合、どのように対処すればよいですか？**

    リレーショナルデータベースシステムでの左結合操作と同様に、データマージ操作はソースコレクションのすべての行と、指定された Parquet ファイル内の一致する行を結合します。これにより、ソースのすべてのフィールド、`newFields` で定義されたフィールド、および結合されたデータを含む新しい宛先コレクションが作成されます。

    Parquet ファイル内の行のうち、ソースコレクション内のマージキーと一致する行のみがマージされます。マージキーがソースコレクション内のいずれのエンティティとも一致しない行はスキップされます。Parquet ファイル内の行がいずれもエンティティと一致しない場合、設定されている場合、`newFields` で指定されたフィールドのみが null 値で作成されます。