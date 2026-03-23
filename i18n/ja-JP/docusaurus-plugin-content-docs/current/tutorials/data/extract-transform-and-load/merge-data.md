---
title: "データのマージ | Cloud"
slug: /merge-data
sidebar_label: "データのマージ"
beta: PRIVATE
notebook: FALSE
description: "既存のZilliz Cloudコレクションのデータと、ローカルファイルまたは外部オブジェクトストレージバケットのデータをマージして、両方のソースのデータを組み合わせたコレクションを作成できます。これはデータマージ操作と呼ばれ、既存のコレクションにデータを含むフィールドを追加する回避策として使用できます。 | Cloud"
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
  - データマージ

---

import Admonition from '@theme/Admonition';


# データのマージ

既存のZilliz Cloudコレクションのデータと、ローカルファイルまたは外部オブジェクトストレージバケットのデータをマージして、両方のソースのデータを組み合わせたコレクションを作成できます。これはデータマージ操作と呼ばれ、既存のコレクションにデータを持つフィールドを追加する回避策として使用できます。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li>この機能は現在、**プライベートプレビュー**段階です。この機能にご興味があり、お試しになりたい場合は、お気軽に<a href="https://support.zilliz.com/hc/en-us">Zilliz Cloudサポート</a>までお問い合わせください。</li>
</ul>

</Admonition>

## 概要\{#overview}

データマージ操作は、リレーショナルデータベースのLEFT JOIN操作に似ており、コレクションのデータと指定されたデータソースからのすべての一致するレコードを結合し、マージされたデータを新しいコレクションに保存します。

データソースは、Zilliz Cloudボリュームまたはオブジェクトストレージバケットに保存されているPARQUETファイルのセットである必要があります。

次の図に示すように、`id`フィールドを主キーとする3つのフィールドを含むコレクションがあります。さらに、`id`と`date`という2つのフィールドを持つPARQUETファイルがあります。`id`フィールドはマージキーとして機能し、その値はソースコレクションの値と一致する必要があります。`date`フィールドは追加されるフィールドです。

![Gfduwu9hGh8CGkbcJ1JccREunRf](https://zdoc-images.s3.us-west-2.amazonaws.com/Gfduwu9hGh8CGkbcJ1JccREunRf.png)

PARQUETファイルをZilliz Cloudボリュームまたはオブジェクトストレージバケットにアップロードすると、[Merge データ API](/reference/restful/merge-data-v2)を使用して、両方のソースのデータを保存するターゲットコレクションを作成できます。

データソースはオプションです。データソースを指定せずにMerge データ APIを使用して、既存のコレクションにフィールドを追加する回避策として使用することもできます。

このガイドでは、Merge データ APIを使用して、データの有無にかかわらずフィールドを追加する方法を説明します。

## データを持つフィールドの追加\{#add-fields-with-data}

データを持つフィールドを追加するには、ソースコレクション、データソース、およびターゲットコレクションに追加する新しいフィールドを指定する必要があります。

データソースは、Zilliz CloudボリュームまたはAWS S3バケットのいずれかにあるPARQUETファイルのセットである必要があります。

### ボリュームの使用\{#use-volume}

ボリュームを使用してデータマージ操作を実行するには、まずボリュームを作成し、ローカルファイルシステムからデータをアップロードします。それが完了したら、データマージ操作を実行して、既存のコレクションとボリュームの両方からデータを結合した新しいコレクションを作成できます。

次のコードスニペットは、ボリュームを使用してデータマージ操作を実行する方法を示しています。ボリュームの作成方法とデータのアップロード方法の詳細については、[ステージの管理](./manage-stages)を参照してください。

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

上記のコマンドを実行する前に、注意すべきフィールドがいくつかあります。

- `dbName` と `collectionName`

    これらの2つのパラメータは、データマージ操作のソースコレクションを決定します。

- `destDbName` と `destCollectionName`

    これらの2つのパラメータは、データマージ操作後に生成されるターゲットコレクションを決定します。ターゲットコレクションは、ソースコレクションと同じクラスター内にある必要があります。

- `dataSource`

    このパラメータはオプションで、データソースタイプや、列指向データを含むParquetファイルへのパスなど、データソース設定が含まれます。これらのデータは、ソースコレクションのデータとマージされ、ターゲットコレクションに保存されます。

    ボリュームを中間ストレージとして使用する場合、`type` を `volume` に設定した後、`volumeName` と `dataPath` を設定する必要があります。

    <Admonition type="info" icon="📘" title="Notes">

    <ul>
    <li><code>dataPath</code> パラメータの値は、ボリュームのルートからのファイルの絶対パス、または複数のParquetファイルを含むボリューム内のフォルダのいずれかです。値がフォルダを指す場合、フォルダ内のParquetファイルが同じデータ構造であることを確認してください。</li>
    </ul>
    <p>例えば、値は <code>path/to/your/file.parquet</code> (ファイル) または <code>path/to/your/folder/</code> (フォルダ) のようになります。</p>
    <ul>
    <li>データなしでフィールドを追加したいだけであれば、このパラメータを指定しないことも可能です。</li>
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

### オブジェクトストレージを使用する\{#use-object-storage}

オブジェクトストレージバケットを使用してデータマージ操作を実行するには、まずオブジェクトストレージバケットを作成し、そこにデータをアップロードします。それが完了したら、データマージ操作を実行して、既存のコレクションとバケットの両方からのデータを組み合わせた新しいコレクションを作成できます。

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

上記のコマンドを実行する前に、注意すべきフィールドがいくつかあります。

- `dbName` および `collectionName`

    これら2つのパラメータは、データマージ操作のソースコレクションを決定します。

- `destDbName` および `destCollectionName`

    これら2つのパラメータは、データマージ操作後に生成されるターゲットコレクションを決定します。ターゲットコレクションは、ソースコレクションと同じクラスター内にある必要があります。

- `dataSource`

    このパラメータはオプションで、データソースタイプや、列指向データを含むParquetファイルへのパスなど、データソース設定が含まれます。このデータはソースコレクションのデータとマージされ、ターゲットコレクションに保存されます。

    S3互換のオブジェクトストレージバケットを中間ストレージとして使用する場合、`type`を`s3`に設定した後、`dataPath`と`credential`を設定する必要があります。

    <Admonition type="info" icon="📘" title="Notes">

    <ul>
    <li><code>dataPath</code>パラメータの値は、バケットのルートからのファイルの絶対パス、または複数のParquetファイルを含むバケット内のフォルダのいずれかです。値がフォルダを指す場合、フォルダ内のParquetファイルが同じデータ構造であることを確認してください。</li>
    </ul>
    <p>例えば、値は<code>s3://path/to/your/file.parquet</code>（ファイル）または<code>s3://path/to/your/folder/</code>（フォルダ）のようになります。</p>
    <ul>
    <li>データなしでフィールドを追加したい場合は、このパラメータを未指定のままにすることができます。</li>
    </ul>

    </Admonition>

- `mergeField`

    データマージ操作は、リレーショナルデータベースシステムのLEFT JOIN操作に似ており、マージフィールドはソースコレクションと列指向データを含むParquetファイル間の共有キーとして機能します。

- `newFields`

    これは、データマージ操作後にターゲットコレクションに追加するフィールドのスキーマのリストです。サポートされるデータ型は、VARCHAR、INT8、INT16、INT32、INT64、FLOAT、DOUBLE、およびBOOLです。

上記のコマンドは、データマージジョブを作成し、そのIDを返します。 

```json
{
    "code": 0,
    "data": {
        "jobId": "job-xxxxxxxxxxxxxxxxxxxxx"
    }
}
```

## データなしでフィールドを追加する\{#add-fields-without-data}

既存のコレクションにフィールドを追加する回避策として、Merge データ API を使用することもできます。この場合、データソースを設定する必要はありません。

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

## 結果の検証\{#verify-the-results}

データマージジョブのIDを取得した後、[ジョブの記述](/reference/restful/describe-job-v2)または[プロジェクトジョブの管理](./job-center)に記載されている手順を使用して、そのステータスを詳細に確認できます。

データマージジョブが完了したら、ターゲットコレクションのスキーマとターゲットコレクション内のエンティティ数が期待どおりであるかを確認できます。

## トラブルシューティング\{#troubleshooting}

1. **Parquetファイルの行に、ソースコレクション内のどのエンティティとも一致しないマージキーがある場合、どのように処理すればよいですか？**

    リレーショナルデータベースシステムの左結合操作と同様に、データマージ操作は、ソースコレクションのすべての行と、指定されたParquetファイルの一致する行を結合します。これにより、ソースのすべてのフィールド、`newFields`で定義されたフィールド、および結合されたデータを含む新しい宛先コレクションが作成されます。

    ソースコレクション内のマージキーと一致するParquetファイルの行のみがマージされます。マージキーがソースコレクション内のどのエンティティとも一致しない行はスキップされます。Parquetファイルのどの行もどのエンティティとも一致しない場合、`newFields`で指定されたフィールドのみが、設定されていればnull値で作成されます。