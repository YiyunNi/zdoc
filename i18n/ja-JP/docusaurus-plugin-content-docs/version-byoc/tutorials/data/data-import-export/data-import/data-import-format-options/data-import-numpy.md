---
title: "NumPy ファイルからのインポート | BYOC"
slug: /data-import-numpy
sidebar_key: data-import-numpy
sidebar_label: "NumPy"
beta: NEAR DEPRECATE
notebook: FALSE
description: "`.npy` 形式は、NumPy の標準的なバイナリ形式](https//numpy.org/devdocs/reference/generated/numpy.lib.format.html)であり、単一の配列を保存する際にその形状と dtype 情報を含めて保存するため、異なるマシン上でも正しく再構築できます。生データを Parquet ファイルに準備するには、[BulkWriter ツールの使用を推奨します。以下の図は、生データを一連の `.npy` ファイルにどのようにマッピングできるかを示しています。 | BYOC"
type: origin
token: FOwZwuxaWiuthnkZdedcGbJOnZf
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - データインポート
  - milvus
  - 形式オプション
  - numpy

---

import Admonition from '@theme/Admonition';


# NumPy ファイルからのインポート

`.npy` 形式は、単一の配列を保存するための [NumPy の標準バイナリ形式](https://numpy.org/devdocs/reference/generated/numpy.lib.format.html) で、形状と dtype 情報を含み、異なるマシン上で正しく再構築できることを保証します。生データを Parquet ファイルに準備するには、[BulkWriter ツール](./use-bulkwriter) の使用を推奨します。次の図は、生データを一連の `.npy` ファイルにどのようにマッピングできるかを示しています。

<Admonition type="danger" icon="🚧" title="Caution">

この機能は非推奨となりました。本番環境での使用は推奨されません。

</Admonition>

![numpy_file_structure](https://zdoc-images.s3.us-west-2.amazonaws.com/numpy_file_structure.png "numpy_file_structure")

<Admonition type="info" icon="📘" title="Notes">

- **AutoID を有効にするかどうか**

    **id** フィールドはコレクションのプライマリフィールドとして機能します。プライマリフィールドを自動的にインクリメントするには、スキーマで **AutoID** を有効にできます。この場合、ソースデータの各行から **id** フィールドを除外する必要があります。

- **動的フィールドを有効にするかどうか**

    ターゲットコレクションで動的フィールドが有効になっている場合、事前定義されたスキーマに含まれていないフィールドを保存する必要がある場合は、書き込み操作時に **&#36;meta** 列を指定し、対応するキーと値のデータを提供できます。

- **大文字と小文字の区別**

    辞書のキーとコレクションのフィールド名は大文字と小文字が区別されます。データ内の辞書キーがターゲットコレクションのフィールド名と完全に一致していることを確認してください。ターゲットコレクションに **id** という名前のフィールドがある場合、各エンティティ辞書には **id** という名前のキーが必要です。**ID** や **Id** を使用するとエラーが発生します。

</Admonition>

## ディレクトリ構造\{#directory-structure}

データを NumPy ファイルとして準備するには、同じサブセットのすべてのファイルをフォルダに配置し、これらのフォルダをソースフォルダ内にグループ化します。以下のツリー図に示すように。

```bash
├── numpy-folders
│       ├── 1
│       │   ├── id.npy
│       │   ├── vector.npy
│       │   ├── scalar_1.npy
│       │   ├── scalar_2.npy
│       │   └── $meta.npy 
│       └── 2
│           ├── id.npy
│           ├── vector.npy
│           ├── scalar_1.npy
│           ├── scalar_2.npy
│           └── $meta.npy  
```

## データのインポート\{#import-data}

データの準備ができたら、以下のいずれかの方法を使用して、Zilliz Cloud コレクションにインポートできます。

- [NumPy ファイルフォルダのリストからファイルをインポートする（推奨）](./data-import-numpy#import-files-from-a-list-of-numpy-file-folders-recommended)

- [NumPy ファイルフォルダからファイルをインポートする](./data-import-numpy#import-files-from-a-numpy-file-folder)

<Admonition type="info" icon="📘" title="Notes">

ファイルが比較的小さい場合は、フォルダまたは複数パスを使用して一度にインポートすることを推奨します。このアプローチにより、インポートプロセス中に内部最適化が行われ、後のリソース消費を削減できます。

</Admonition>

Zilliz Cloud コンソールで Milvus SDK を使用してデータをインポートすることもできます。詳細については、[データのインポート（コンソール）](./import-data-on-web-ui) および [データのインポート（SDK）](./import-data-via-sdks) を参照してください。

### NumPy ファイルフォルダのリストからファイルをインポートする（推奨）\{#import-files-from-a-list-of-numpy-file-folders-recommended}

複数のパスからファイルをインポートする場合は、各 NumPy ファイルフォルダのパスを個別のリストに含め、すべてのリストを上位レベルのリストにグループ化します。以下のコード例を参照してください。

```bash
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
            ["s3://bucket-name/numpy-folder-1/1/"],
            ["s3://bucket-name/numpy-folder-2/1/"],
            ["s3://bucket-name/numpy-folder-3/1/"]
         ],
        "accessKey": "",
        "secretKey": ""
    }'
```

### NumPyファイルフォルダからファイルをインポートする\{#import-files-from-a-numpy-file-folder}

ソースフォルダにインポートするNumPyファイルフォルダのみが含まれている場合、リクエストに次のようにしてソースフォルダをそのまま含めることができます:

```bash
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
            ["s3://bucket-name/numpy-folder/1/"]
         ],
        "accessKey": "",
        "secretKey": ""
    }'
```

<Admonition type="info" icon="📘" title="Notes">

フォルダに複数の形式のファイルが含まれている場合、リクエストは失敗します。

</Admonition>

## ストレージパス\{#storage-paths}

Zilliz Cloud はクラウドストレージからのデータインポートをサポートしています。以下の表に、データファイルの可能なストレージパスを示します。

<table>
   <tr>
     <th><p><strong>Cloud</strong></p></th>
     <th><p><strong>クイック例</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>AWS S3</strong></p></td>
     <td><p>s3://<em>バケット名</em>/<em>numpyフォルダ</em>/</p></td>
   </tr>
   <tr>
     <td><p><strong>Google Cloud Storage</strong></p></td>
     <td><p>gs://<em>バケット名</em>/<em>numpyフォルダ</em>/</p></td>
   </tr>
   <tr>
     <td><p><strong>Azure Blob</strong></p></td>
     <td><p><em>https:</em>//<em>マイアカウント</em>.blob.core.windows.net/<em>バケット名</em>/<em>numpyフォルダ</em>/</p></td>
   </tr>
</table>

## 制限\{#limits}

クラウドストレージから NumPy ファイルをインポートする際に遵守する必要がある制限がいくつかあります。

<Admonition type="info" icon="📘" title="Notes">

有効な NumPy ファイルセットは、ターゲットコレクションのスキーマ内のフィールド名に基づいて命名する必要があり、ファイル内のデータは対応するフィールド定義と一致している必要があります。

</Admonition>

<table>
   <tr>
     <th><p><strong>インポート方法</strong></p></th>
     <th><p><strong>インポートあたりの最大サブディレクトリ数</strong></p></th>
     <th><p><strong>サブディレクトリあたりの最大サイズ</strong></p></th>
     <th><p><strong>インポート合計の最大サイズ</strong></p></th>
   </tr>
   <tr>
     <td><p>ローカルファイルから</p></td>
     <td colspan="3"><p>サポートされていません</p></td>
   </tr>
   <tr>
     <td><p>オブジェクトストレージから</p></td>
     <td><p>1,000 サブディレクトリ</p></td>
     <td><p>10 GB</p></td>
     <td><p>1 TB</p></td>
   </tr>
</table>

[データファイルの準備](https://milvus.io/docs/bulk_insert.md#Prepare-the-data-file) を参照して独自にデータを再構築するか、[BulkWriter ツール](./use-bulkwriter) を使用してソースデータファイルを生成することができます。[上記の図のスキーマに基づいて準備されたサンプルデータはこちらからダウンロードしてください](https://assets.zilliz.com/prepared_numpy_data.zip)。