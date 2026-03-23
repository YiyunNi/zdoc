---
title: "Parquetファイルからのインポート | Cloud"
slug: /data-import-parquet
sidebar_label: "Parquet (推奨)"
beta: FALSE
notebook: FALSE
description: "Apache Parquetは、効率的なデータストレージと検索のために設計された、オープンソースの列指向データファイル形式です。大量の複雑なデータを管理するための高性能な圧縮およびエンコーディングスキームを提供し、さまざまなプログラミング言語や分析ツールでサポートされています。 | Cloud"
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

---

import Admonition from '@theme/Admonition';


# Parquet ファイルからのインポート

[Apache Parquet](https://parquet.apache.org/docs/overview/) は、効率的なデータストレージと取得のために設計されたオープンソースの列指向データファイル形式です。大量の複雑なデータを管理するための高性能な圧縮およびエンコードスキームを提供し、さまざまなプログラミング言語や分析ツールでサポートされています。

生データを Parquet ファイルに準備するには、[BulkWriter ツール](./use-bulkwriter)を使用することをお勧めします。次の図は、生データが Parquet ファイルにどのようにマッピングされるかを示しています。

![parquet_file_structure_en](https://zdoc-images.s3.us-west-2.amazonaws.com/parquet_file_structure_en.png "parquet_file_structure_en")

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><strong>AutoID を有効にするかどうか</strong></li>
</ul>
<p><strong>id</strong> フィールドはコレクションのプライマリフィールドとして機能します。プライマリフィールドを自動的にインクリメントするには、スキーマで <strong>AutoID</strong> を有効にできます。この場合、ソースデータの各行から <strong>id</strong> フィールドを除外する必要があります。</p>
<ul>
<li><strong>動的フィールドを有効にするかどうか</strong></li>
</ul>
<p>ターゲットコレクションが動的フィールドを有効にしている場合、事前定義されたスキーマに含まれていないフィールドを保存する必要がある場合は、書き込み操作中に <strong>&#36;meta</strong> 列を指定し、対応するキーと値のデータを提供できます。</p>
<ul>
<li><strong>大文字と小文字の区別</strong></li>
</ul>
<p>辞書キーとコレクションフィールド名は大文字と小文字を区別します。データ内の辞書キーがターゲットコレクションのフィールド名と正確に一致していることを確認してください。ターゲットコレクションに <strong>id</strong> という名前のフィールドがある場合、各エンティティ辞書には <strong>id</strong> という名前のキーが必要です。<strong>ID</strong> または <strong>Id</strong> を使用するとエラーが発生します。</p>

</Admonition>

## ディレクトリ構造\{#directory-structure}

データを Parquet ファイルに準備する場合は、以下のツリー図に示すように、すべての Parquet ファイルをソースデータフォルダに直接配置します。

```plaintext
├── parquet-folder
│       ├── 1.parquet
│       └── 2.parquet 
```

## データインポート\{#import-data}

データが準備できたら、以下のいずれかの方法を使用してZilliz Cloudコレクションにインポートできます。

- [複数のパスからファイルをインポートする（推奨）](./data-import-parquet#import-files-from-multiple-paths-recommended)

- [ソースフォルダからファイルをインポートする](./data-import-parquet#import-files-from-a-folder)

- [単一ファイルをインポートする](./data-import-parquet#import-a-single-file)

<Admonition type="info" icon="📘" title="Notes">

<p>ファイルが比較的小さい場合は、フォルダまたは複数パスの方法を使用して一度にすべてインポートすることをお勧めします。このアプローチにより、インポートプロセス中に内部最適化が可能になり、後のリソース消費を削減できます。</p>

</Admonition>

Zilliz CloudコンソールでMilvus SDKを使用してデータをインポートすることもできます。詳細については、[データインポート（コンソール）](./import-data-on-web-ui)および[データインポート（SDK）](./import-data-via-sdks)を参照してください。

### 複数のパスからファイルをインポートする（推奨）\{#import-files-from-multiple-paths-recommended}

複数のパスからファイルをインポートする場合、各Parquetファイルのパスを個別のリストに含め、それらのリストをすべて上位レベルのリストにグループ化します。以下のコード例を参照してください。

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

### フォルダーからファイルをインポートする\{#import-files-from-a-folder}

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

### 単一ファイルのインポート\{#import-a-single-file}

準備したデータファイルが単一のParquetファイルである場合は、以下のコード例に示すようにインポートします。

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

## ストレージパス\{#storage-paths}

Zilliz Cloudは、クラウドストレージからのデータインポートをサポートしています。以下の表は、データファイルの可能なストレージパスをリストしています。

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

## 制限\{#limits}

ローカルのParquetファイルまたはクラウドストレージからのParquetファイルをインポートする際には、いくつかの制限に注意する必要があります。

<table>
   <tr>
     <th><p><strong>インポート方法</strong></p></th>
     <th><p><strong>クラスタプラン</strong></p></th>
     <th><p><strong>インポートあたりの最大ファイル数</strong></p></th>
     <th><p><strong>最大ファイルサイズ</strong></p></th>
     <th><p><strong>最大合計インポートサイズ</strong></p></th>
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
     <td><p>無料</p></td>
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

生データをParquetファイルに準備するには、[BulkWriterツール](./use-bulkwriter)を使用することをお勧めします。[上記の図のスキーマに基づいた準備済みサンプルデータをダウンロードするには、ここをクリックしてください](https://assets.zilliz.com/prepared_parquet_data.parquet)。