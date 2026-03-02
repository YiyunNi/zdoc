---
title: "データのマージ | Cloud"
slug: /merge-data
sidebar_label: "データのマージ"
beta: PRIVATE
notebook: FALSE
description: "既存の Zilliz Cloud collection のデータと、ローカルファイルまたは外部オブジェクトストレージバケットのデータをマージして、両方のソースのデータを組み合わせた collection を作成できます。これはデータマージ操作と呼ばれ、既存の collection にデータを含むフィールドを追加する回避策として使用できます。"
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
  - ロード
  - データマージ
  - データ結合
  - managed milvus
  - Serverless vector database
  - milvus open source
  - milvus の仕組み

---

import Admonition from '@theme/Admonition';


# データのマージ

既存の Zilliz Cloud collection のデータと、ローカルファイルまたは外部オブジェクトストレージバケットのデータをマージして、両方のソースのデータを組み合わせた collection を作成できます。これはデータマージ操作と呼ばれ、既存の collection にデータを含むフィールドを追加する回避策として使用できます。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li>この機能は現在、**プライベートプレビュー**段階です。この機能にご興味があり、試してみたい場合は、<a href="https://support.zilliz.com/hc/en-us">Zilliz Cloud サポート</a>までお気軽にお問い合わせください。</li>
</ul>

</Admonition>

## 概要{#overview}

データマージ操作は、リレーショナルデータベースの LEFT JOIN 操作に似ています。これは、collection のデータと、指定されたデータソースからのすべての一致するレコードを結合し、マージされたデータを新しい collection に保存します。

データソースは、Zilliz Cloud volume またはオブジェクトストレージバケットに保存されている PARQUET ファイルのセットである必要があります。

次の図に示すように、`id` フィールドが主キーとして機能する 3 つのフィールドを含む collection があります。さらに、`id` と `date` という 2 つのフィールドを持つ PARQUET ファイルがあります。`id` フィールドはマージキーとして機能し、その値はソース collection の値と一致する必要があります。`date` フィールドは追加されるフィールドです。

![Gfduwu9hGh8CGkbcJ1JccREunRf](https://zdoc-images.s3.us-west-2.amazonaws.com/Gfduwu9hGh8CGkbcJ1JccREunRf.png)

PARQUET ファイルを Zilliz Cloud volume またはオブジェクトストレージバケットにアップロードすると、[Merge Data API](/reference/restful/merge-data-v2) を使用して、両方のソースからのデータを保存するターゲット collection を作成できます。

データソースはオプションです。データソースを指定せずに Merge Data API を使用して、既存の collection にフィールドを追加する回避策として使用することもできます。

このガイドでは、Merge Data API を使用して、データを含むフィールドとデータを含まないフィールドを追加する方法を説明します。

## データを含むフィールドの追加{#add-fields-with-data}

データを含むフィールドを追加するには、ソース collection、データソース、およびターゲット collection に追加する新しいフィールドを指定する必要があります。

データソースは、Zilliz Cloud volume または AWS S3 バケットにある PARQUET ファイルのセットである必要があります。

### volume の使用{#use-volume}

volume を使用してデータマージ操作を実行するには、まず volume を作成し、ローカルファイルシステムからデータをアップロードします。それが完了したら、データマージ操作を実行して、既存の collection と volume の両方からのデータを組み合わせた新しい collection を作成できます。

次のコードスニペットは、volume を使用してデータマージ操作を実行する方法を示しています。volume の作成方法とデータのアップロード方法の詳細については、[ステージの管理](./manage-stages)を参照してください。

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

上記のコマンドを実行する前に、注意が必要なフィールドがいくつかあります。

- `dbName` と `collectionName`

    これらの2つのパラメータは、データマージ操作のソースコレクションを決定します。

- `destDbName` と `destCollectionName`

    これらの2つのパラメータは、データマージ操作後に生成されるターゲットコレクションを決定します。ターゲットコレクションは、ソースコレクションと同じクラスター内にある必要があります。

- `dataSource`

    このパラメータはオプションで、データソースタイプや、ソースコレクションからのデータとマージされ、ターゲットコレクションに保存される列指向データを含むParquetファイルへのパスなど、データソース設定が含まれます。

    ボリュームを中間ストレージスポットとして使用する場合、`type` を `volume` に設定した後、`volumeName` と `dataPath` を設定する必要があります。

    <Admonition type="info" icon="📘" title="Notes">

    <ul>
    <li><code>dataPath</code> パラメータの値は、ボリュームのルートに対するファイルの絶対パス、または複数のParquetファイルを含むボリューム内のフォルダのいずれかです。値がフォルダを指す場合、フォルダ内のParquetファイルが同じデータ構造であることを確認してください。</li>
    </ul>
    <p>たとえば、値は <code>path/to/your/file.parquet</code> (ファイル) または <code>path/to/your/folder/</code> (フォルダ) になります。</p>
    <ul>
    <li>データを伴わないフィールドを追加するだけの場合は、このパラメータを指定しないでおくことができます。</li>
    </ul>

    </Admonition>

- `mergeField`

    データマージ操作は、リレーショナルデータベースシステムのLEFT JOIN操作に似ており、マージフィールドはソースコレクションと列指向データを含むParquetファイル間の共有キーとして機能します。

- `newFields`

    これは、データマージ操作後にターゲットコレクションに追加するフィールドのスキーマのリストです。サポートされているデータ型は、VARCHAR、INT8、INT16、INT32、INT64、FLOAT、DOUBLE、およびBOOLです。

上記のコマンドは、データマージジョブを作成し、そのIDを返します。 

```json
{
    "code": 0,
    "data": {
        "jobId": "job-xxxxxxxxxxxxxxxxxxxxx"
    }
}
```

### オブジェクトストレージを使用する{#use-object-storage}

オブジェクトストレージバケットを使用してデータマージ操作を実行するには、まずオブジェクトストレージバケットを作成し、そこにデータをアップロードします。それが完了したら、データマージ操作を実行して、既存のcollectionとバケットの両方からのデータを結合する新しいcollectionを作成できます。

次のコードスニペットは、オブジェクトストレージバケットを使用してデータマージ操作を実行する方法を示しています。バケットを作成し、そこにデータをアップロードする方法については、ブロックストレージサービスプロバイダーのドキュメントを参照してください。

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

上記のコマンドを実行する前に、注意が必要なフィールドがいくつかあります。

- `dbName` および `collectionName`

    これら2つのパラメータは、データマージ操作のソースコレクションを決定します。

- `destDbName` および `destCollectionName`

    これら2つのパラメータは、データマージ操作後に生成されるターゲットコレクションを決定します。ターゲットコレクションは、ソースコレクションと同じクラスター内にある必要があります。

- `dataSource`

    このパラメータはオプションで、データソースタイプや、ソースコレクションのデータとマージされ、ターゲットコレクションに保存される列指向データを含むParquetファイルへのパスなど、データソース設定が含まれます。

    S3互換のオブジェクトストレージバケットを中間ストレージ場所として使用する場合、`type`を`s3`に設定した後、`dataPath`と`credential`を設定する必要があります。

    <Admonition type="info" icon="📘" title="Notes">

    <ul>
    <li><code>dataPath</code>パラメータの値は、バケットのルートに対するファイルの絶対パス、または複数のParquetファイルを含むバケット内のフォルダのいずれかです。値がフォルダを指す場合、フォルダ内のParquetファイルが同じデータ構造であることを確認してください。</li>
    </ul>
    <p>たとえば、値は<code>s3://path/to/your/file.parquet</code> (ファイル) または <code>s3://path/to/your/folder/</code> (フォルダ) になります。</p>
    <ul>
    <li>データなしでフィールドを追加したいだけの場合は、このパラメータを指定しないでおくことができます。</li>
    </ul>

    </Admonition>

- `mergeField`

    データマージ操作は、リレーショナルデータベースシステムのLEFT JOIN操作に似ており、マージフィールドはソースコレクションと列指向データを含むParquetファイル間の共有キーとして機能します。

- `newFields`

    これは、データマージ操作後にターゲットコレクションに追加するフィールドのスキーマのリストです。サポートされているデータ型は、VARCHAR、INT8、INT16、INT32、INT64、FLOAT、DOUBLE、およびBOOLです。

上記のコマンドは、データマージジョブを作成し、そのIDを返します。 

```json
{
    "code": 0,
    "data": {
        "jobId": "job-xxxxxxxxxxxxxxxxxxxxx"
    }
}
```

## データなしでフィールドを追加する{#add-fields-without-data}

Merge Data API を使用して、既存のコレクションにフィールドを追加することもできます。この場合、データソースを設定する必要はありません。

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

上記のコマンドは、データマージジョブを作成し、そのIDを返します。 

```json
{
    "code": 0,
    "data": {
        "jobId": "job-xxxxxxxxxxxxxxxxxxxxx"
    }
}
```

## 結果の検証{#verify-the-results}

データマージジョブのIDを取得した後、[Describe Job](/reference/restful/describe-job-v2)または[プロジェクトジョブの管理](./job-center)に記載されている手順を使用して、そのステータスを詳細に確認できます。

データマージジョブが完了したら、ターゲットcollectionのschemaとターゲットcollection内のentityの数が期待どおりであるかを確認できます。

## トラブルシューティング{#troubleshooting}

1. **Parquetファイルの行に、ソースcollection内のどのentityとも一致しないマージキーがある場合、どのように処理すればよいですか？**

    リレーショナルデータベースシステムにおける左結合操作と同様に、データマージ操作は、ソースcollectionのすべての行と、指定されたParquetファイルからの一致する行を結合します。これにより、ソースからのすべてのフィールド、`newFields`で定義されたフィールド、および結合されたデータを含む新しい宛先collectionが作成されます。

    Parquetファイル内の行のうち、マージキーがソースcollection内のものと一致するもののみがマージされます。マージキーがソースcollection内のどのentityとも一致しない行はスキップされます。Parquetファイル内のどの行もどのentityとも一致しない場合、`newFields`で指定されたフィールドのみが、設定されていればnull値で作成されます。