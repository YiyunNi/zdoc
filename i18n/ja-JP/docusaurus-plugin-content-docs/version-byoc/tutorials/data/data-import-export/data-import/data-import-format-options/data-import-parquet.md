---
title: "Parquet ファイルからのインポート | BYOC"
slug: /data-import-parquet
sidebar_key: data-import-parquet
sidebar_label: "Parquet（推奨）"
beta: FALSE
notebook: FALSE
description: "Apache Parquet は、効率的なデータ保存と取得のために設計された、オープンソースの列指向データファイル形式です。高パフォーマンスの圧縮およびエンコーディング方式を提供し、大量の複雑なデータを管理でき、さまざまなプログラミング言語や分析ツールでサポートされています。 | BYOC"
type: origin
token: WtkSwXgDdiB0eTkEkorcDCFlnme
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - データインポート
  - milvus
  - 形式オプション
  - parquet

---

import Admonition from '@theme/Admonition';


# Parquet ファイルからのインポート

[Apache Parquet](https://parquet.apache.org/docs/overview/) は、効率的なデータストレージと取得のために設計された、オープンソースのカラム指向データファイル形式です。高パフォーマンスの圧縮とエンコーディングスキームを提供し、大量の複雑なデータを管理でき、さまざまなプログラミング言語や分析ツールでサポートされています。

生データを Parquet ファイルに準備するには、[BulkWriter ツール](./use-bulkwriter) の使用を推奨します。以下の図は、生データを Parquet ファイルにマッピングする方法を示しています。

![parquet_file_structure_en](https://zdoc-images.s3.us-west-2.amazonaws.com/parquet_file_structure_en.png "parquet_file_structure_en")

<Admonition type="info" icon="📘" title="Notes">

- **AutoID を有効にするかどうか**

    **id** フィールドはコレクションのプライマリフィールドとして機能します。プライマリフィールドを自動的にインクリメントするには、スキーマで **AutoID** を有効にできます。この場合、ソースデータの各行から **id** フィールドを除外する必要があります。

- **動的フィールドを有効にするかどうか**

    ターゲットコレクションで動的フィールドが有効になっている場合、事前定義されたスキーマに含まれていないフィールドを保存する必要がある場合は、書き込み操作時に **&#36;meta** カラムを指定し、対応するキーと値のデータを提供できます。

- **大文字小文字の区別**

    ディクショナリキーとコレクションフィールド名は大文字小文字を区別します。データ内のディクショナリキーが、ターゲットコレクションのフィールド名と完全に一致していることを確認してください。ターゲットコレクションに **id** という名前のフィールドがある場合、各エンティティディクショナリには **id** という名前のキーが必要です。**ID** や **Id** を使用するとエラーが発生します。

</Admonition>

## ディレクトリ構造\{#directory-structure}

データを Parquet ファイルに準備する場合は、以下のツリーダイアグラムに示すように、すべての Parquet ファイルをソースデータフォルダに直接配置してください。

```plaintext
├── parquet-folder
│       ├── 1.parquet
│       └── 2.parquet 
```

## データのインポート\{#import-data}

データの準備ができたら、以下のいずれかの方法を使用して、Zilliz Cloud コレクションにインポートできます。

- [複数のパスからファイルをインポートする（推奨）](./data-import-parquet#import-files-from-multiple-paths-recommended)

- [ソースフォルダからファイルをインポートする](./data-import-parquet#import-files-from-a-folder)

- [単一ファイルをインポートする](./data-import-parquet#import-a-single-file)

<Admonition type="info" icon="📘" title="Notes">

ファイルが比較的小さい場合は、フォルダまたは複数パス方式を使用して一度にすべてインポートすることをお勧めします。このアプローチでは、インポートプロセス中に内部最適化が行われ、後のリソース消費を削減するのに役立ちます。

</Admonition>

データのインポートは、Zilliz Cloud コンソールで Milvus SDK を使用して行うこともできます。詳細については、[データのインポート（コンソール）](./import-data-on-web-ui) および [データのインポート（SDK）](./import-data-via-sdks) を参照してください。

### 複数のパスからファイルをインポートする（推奨）\{#import-files-from-multiple-paths-recommended}

複数のパスからファイルをインポートする場合は、各 Parquet ファイルのパスを個別のリストに含め、次にすべてのリストを以下のコード例のように上位レベルのリストにグループ化します。

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

### フォルダからファイルをインポートする\{#import-files-from-a-folder}

ソースフォルダにインポート対象のParquetファイルのみが含まれている場合、リクエストにソースフォルダを以下のように指定できます。

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

フォルダに複数の形式のファイルが含まれている場合、リクエストは失敗します。

</Admonition>

### 単一ファイルのインポート\{#import-a-single-file}

準備したデータファイルが単一の Parquet ファイルの場合、以下のコード例に示すようにインポートします。

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

Zilliz Cloud は、クラウドストレージからのデータインポートをサポートしています。以下の表に、データファイルの可能なストレージパスを示します。

<table>
   <tr>
     <th><p><strong>Cloud</strong></p></th>
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
     <td><p><strong>Azure Blob</strong></p></td>
     <td><p><em>https:</em>//<em>myaccount</em>.blob.core.windows.net/<em>bucket-name</em>/<em>parquet-folder</em>/</p><p><em>https:</em>//myaccount.blob.core.windows.net/<em>bucket-name</em>/<em>parquet-folder</em>/<em>data.parquet</em></p></td>
   </tr>
</table>

## 制限\{#limits}

ローカルの Parquet ファイルまたはクラウドストレージの Parquet ファイルからデータをインポートする際に、遵守すべき制限がいくつかあります。

<table>
   <tr>
     <th><p><strong>方法</strong></p></th>
     <th><p><strong>インポートあたりの最大ファイル数</strong></p></th>
     <th><p><strong>最大ファイルサイズ</strong></p></th>
     <th><p><strong>最大合計インポートサイズ</strong></p></th>
   </tr>
   <tr>
     <td><p>ローカルファイルから</p></td>
     <td><p>1 ファイル</p></td>
     <td><p>1 GB</p></td>
     <td><p>1 GB</p></td>
   </tr>
   <tr>
     <td><p>オブジェクトストレージから</p></td>
     <td><p>1,000 ファイル</p></td>
     <td><p>10 GB</p></td>
     <td><p>1 TB</p></td>
   </tr>
</table>

生データを Parquet ファイルに準備するには、[BulkWriter ツール](./use-bulkwriter) の使用を推奨します。[上記のスキーマに基づいて準備されたサンプルデータはこちらからダウンロードできます](https://assets.zilliz.com/prepared_parquet_data.parquet)。