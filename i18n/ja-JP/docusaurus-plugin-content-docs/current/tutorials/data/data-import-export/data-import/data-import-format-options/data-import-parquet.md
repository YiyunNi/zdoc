---
title: "Parquet ファイルからのインポート | Cloud"
slug: /data-import-parquet
sidebar_label: "Parquet (推奨)"
beta: FALSE
notebook: FALSE
description: "Apache Parquet は、効率的なデータストレージと取得のために設計されたオープンソースの列指向データファイル形式です。大量の複雑なデータを管理するための高性能な圧縮およびエンコードスキームを提供し、さまざまなプログラミング言語や分析ツールでサポートされています。 | Cloud"
type: origin
token: WtkSwXgDdiB0eTkEkorcDCFlnme
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - データインポート
  - milvus
  - フォーマットオプション
  - parquet
  - ベクトルデータベースチュートリアル
  - ベクトルデータベースの仕組み
  - ベクトルDB比較
  - openai ベクトルDB

---

import Admonition from '@theme/Admonition';


# Parquetファイルからのインポート

[Apache Parquet](https://parquet.apache.org/docs/overview/) は、効率的なデータストレージと取得のために設計されたオープンソースの列指向データファイル形式です。複雑なデータを大量に管理するための高性能な圧縮およびエンコードスキームを提供し、さまざまなプログラミング言語や分析ツールでサポートされています。

生データをParquetファイルに準備するには、[BulkWriterツール](./use-bulkwriter)を使用することをお勧めします。以下の図は、生データがParquetファイルにどのようにマッピングされるかを示しています。

![parquet_file_structure_en](https://zdoc-images.s3.us-west-2.amazonaws.com/parquet_file_structure_en.png "parquet_file_structure_en")

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><strong>AutoIDを有効にするかどうか</strong></li>
</ul>
<p><strong>id</strong>フィールドはcollectionの主キーフィールドとして機能します。主キーフィールドを自動インクリメントにするには、schemaで<strong>AutoID</strong>を有効にできます。この場合、ソースデータ内の各行から<strong>id</strong>フィールドを除外する必要があります。</p>
<ul>
<li><strong>動的フィールドを有効にするかどうか</strong></li>
</ul>
<p>ターゲットcollectionが動的フィールドを有効にしている場合、事前定義されたschemaに含まれていないフィールドを保存する必要がある場合は、書き込み操作中に<strong>&#36;meta</strong>列を指定し、対応するキーと値のデータを提供できます。</p>
<ul>
<li><strong>大文字と小文字の区別</strong></li>
</ul>
<p>辞書キーとcollectionフィールド名は大文字と小文字を区別します。データ内の辞書キーがターゲットcollectionのフィールド名と正確に一致していることを確認してください。ターゲットcollectionに<strong>id</strong>という名前のフィールドがある場合、各entity辞書には<strong>id</strong>という名前のキーが必要です。<strong>ID</strong>または<strong>Id</strong>を使用するとエラーが発生します。</p>

</Admonition>

## ディレクトリ構造{#directory-structure}

データをParquetファイルに準備する場合は、以下のツリー図に示すように、すべてのParquetファイルをソースデータフォルダに直接配置します。

```plaintext
├── parquet-folder
│       ├── 1.parquet
│       └── 2.parquet 
```

## データのインポート{#import-data}

データが準備できたら、以下のいずれかの方法を使用してZilliz Cloudコレクションにインポートできます。

- [複数のパスからファイルをインポートする（推奨）](./data-import-parquet#import-files-from-multiple-paths-recommended)

- [ソースフォルダからファイルをインポートする](./data-import-parquet#import-files-from-a-folder)

- [単一ファイルをインポートする](./data-import-parquet#import-a-single-file)

<Admonition type="info" icon="📘" title="Notes">

<p>ファイルが比較的小さい場合は、フォルダまたは複数パスの方法を使用して一度にすべてインポートすることをお勧めします。このアプローチにより、インポートプロセス中に内部最適化が可能になり、後のリソース消費を削減するのに役立ちます。</p>

</Admonition>

Milvus SDKを使用してZilliz Cloudコンソールでデータをインポートすることもできます。詳細については、[データのインポート（コンソール）](./import-data-on-web-ui)および[データのインポート（SDK）](./import-data-via-sdks)を参照してください。

### 複数のパスからファイルをインポートする（推奨）{#import-files-from-multiple-paths-recommended}

複数のパスからファイルをインポートする場合、各Parquetファイルのパスを個別のリストに含め、以下のコード例のようにすべてのリストを上位レベルのリストにグループ化します。

```python
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/vectordb/jobs/import/create" \
     --header "Authorization: Bearer ${TOKEN}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     -d '{
        "clusterId": "inxx-xxxxxxxxxxxxxxx",
        "collectionName": "medium_articles",
        "partitionName": "",
        "objectUrls": [
            ["s3://bucket-name/parquet-folder-1/1.parquet"],
            ["s3://bucket-name/parquet-folder-2/1.parquet"],
            ["s3://bucket-name/parquet-folder-3/"]
         ],
        "accessKey": "",
        "secretKey": ""
    }'
```

### フォルダーからファイルをインポートする{#import-files-from-a-folder}

ソースフォルダーにインポートするParquetファイルのみが含まれている場合、次のようにリクエストにソースフォルダーを含めることができます。

```python
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/vectordb/jobs/import/create" \
     --header "Authorization: Bearer ${TOKEN}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     -d '{
        "clusterId": "inxx-xxxxxxxxxxxxxxx",
        "collectionName": "medium_articles",
        "partitionName": "",
        "objectUrls": [
            ["s3://bucket-name/parquet-folder/"]
         ],
        "accessKey": "",
        "secretKey": ""
    }'
```

<Admonition type="info" icon="📘" title="Notes">

<p>フォルダに複数の形式のファイルが含まれている場合、リクエストは失敗します。</p>

</Admonition>

### 単一ファイルのインポート{#import-a-single-file}

準備したデータファイルが単一のParquetファイルである場合、以下のコード例に示すようにインポートします。

```python
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/vectordb/jobs/import/create" \
     --header "Authorization: Bearer ${TOKEN}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     -d '{
        "clusterId": "inxx-xxxxxxxxxxxxxxx",
        "collectionName": "medium_articles",
        "partitionName": "",
        "objectUrls": [
            ["s3://bucket-name/parquet-folder/1.parquet"]
         ],
        "accessKey": "",
        "secretKey": ""
    }'
```

## ストレージパス{#storage-paths}

Zilliz Cloudは、クラウドストレージからのデータインポートをサポートしています。以下の表は、データファイルのストレージパスの例を示しています。

<table>
   <tr>
     <th><p><strong>クラウド</strong></p></th>
     <th><p><strong>クイック例</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>AWS S3</strong></p></td>
     <td><p>s3://<em>bucket-name</em>/<em>parquet-folder</em>/</p><p>s3://<em>bucket-name</em>/<em>parquet-folder</em>/<em>data.parquet</em></p></td>
   </tr>
   <tr>
     <td><p><strong>Google Cloud Storage</strong></p></td>
     <td><p>gs://<em>bucket-name</em>/<em>parquet-folder</em>/</p><p>gs://<em>bucket-name</em>/<em>parquet-folder</em>/<em>data.parquet</em></p></td>
   </tr>
   <tr>
     <td><p><strong>Azure Bolb</strong></p></td>
     <td><p><em>https:</em>//<em>myaccount</em>.blob.core.windows.net/<em>bucket-name</em>/<em>parquet-folder</em>/</p><p><em>https:</em>//myaccount.blob.core.windows.net/<em>bucket-name</em>/<em>parquet-folder</em>/<em>data.parquet</em></p></td>
   </tr>
</table>

## 制限事項{#limits}

ローカルのParquetファイルまたはクラウドストレージからのParquetファイルをインポートする際には、いくつかの制限事項があります。

<table>
   <tr>
     <th><p><strong>インポート方法</strong></p></th>
     <th><p><strong>クラスタープラン</strong></p></th>
     <th><p><strong>インポートあたりの最大ファイル数</strong></p></th>
     <th><p><strong>最大ファイルサイズ</strong></p></th>
     <th><p><strong>インポート合計最大サイズ</strong></p></th>
   </tr>
   <tr>
     <td><p>ローカルファイルから</p></td>
     <td><p>すべてのプラン</p></td>
     <td><p>1ファイル</p></td>
     <td><p>1 GB</p></td>
     <td><p>1 GB</p></td>
   </tr>
   <tr>
     <td rowspan="2"><p>オブジェクトストレージから</p></td>
     <td><p>Free</p></td>
     <td><p>1,000ファイル</p></td>
     <td><p>1 GB</p></td>
     <td><p>1 GB</p></td>
   </tr>
   <tr>
     <td><p>Serverless & Dedicated</p></td>
     <td><p>1,000ファイル</p></td>
     <td><p>10 GB</p></td>
     <td><p>1 TB</p></td>
   </tr>
</table>

生のデータをParquetファイルに準備するには、[BulkWriterツール](./use-bulkwriter)を使用することをお勧めします。[上記の図のスキーマに基づいた準備済みサンプルデータをダウンロードするには、ここをクリックしてください](https://assets.zilliz.com/prepared_parquet_data.parquet)。