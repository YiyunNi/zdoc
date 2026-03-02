---
title: "NumPyファイルからのインポート | BYOC"
slug: /data-import-numpy
sidebar_label: "NumPy"
beta: NEAR DEPRECATE
notebook: FALSE
description: "`.npy`形式は、NumPyの標準バイナリ形式（https://numpy.org/devdocs/reference/generated/numpy.lib.format.html）で、単一の配列をその形状とdtype情報を含めて保存し、異なるマシンで正しく再構築できるようにします。生データをParquetファイルに準備するには、BulkWriterツールを使用することをお勧めします。以下の図は、生データを一連の`.npy`ファイルにマッピングする方法を示しています。 | BYOC"
type: origin
token: FOwZwuxaWiuthnkZdedcGbJOnZf
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - データインポート
  - milvus
  - フォーマットオプション
  - numpy
  - 語彙検索
  - 近傍検索
  - Agentic RAG
  - rag llm アーキテクチャ

---

import Admonition from '@theme/Admonition';


# NumPyファイルからのインポート

`.npy` 形式は、単一の配列を保存するための[NumPyの標準バイナリ形式](https://numpy.org/devdocs/reference/generated/numpy.lib.format.html)であり、その形状とdtype情報を含み、異なるマシンで正しく再構築できることを保証します。生データをParquetファイルに準備するには、[BulkWriterツール](./use-bulkwriter)を使用することをお勧めします。以下の図は、生データがどのように`.npy`ファイルのセットにマッピングされるかを示しています。

<Admonition type="danger" icon="🚧" title="Caution">

<p>この機能は非推奨です。本番環境での使用は推奨されません。</p>

</Admonition>

![numpy_file_structure](https://zdoc-images.s3.us-west-2.amazonaws.com/numpy_file_structure.png "numpy_file_structure")

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><strong>AutoIDを有効にするかどうか</strong></li>
</ul>
<p><strong>id</strong>フィールドはコレクションのプライマリフィールドとして機能します。プライマリフィールドを自動的にインクリメントするには、スキーマで<strong>AutoID</strong>を有効にできます。この場合、ソースデータ内の各行から<strong>id</strong>フィールドを除外する必要があります。</p>
<ul>
<li><strong>動的フィールドを有効にするかどうか</strong></li>
</ul>
<p>ターゲットコレクションが動的フィールドを有効にしている場合、事前定義されたスキーマに含まれていないフィールドを保存する必要がある場合は、書き込み操作中に<strong>&#36;meta</strong>列を指定し、対応するキーと値のデータを提供できます。</p>
<ul>
<li><strong>大文字と小文字の区別</strong></li>
</ul>
<p>辞書のキーとコレクションのフィールド名は大文字と小文字を区別します。データ内の辞書キーがターゲットコレクションのフィールド名と正確に一致することを確認してください。ターゲットコレクションに<strong>id</strong>という名前のフィールドがある場合、各エンティティ辞書には<strong>id</strong>という名前のキーが必要です。<strong>ID</strong>または<strong>Id</strong>を使用するとエラーが発生します。</p>

</Admonition>

## ディレクトリ構造{#directory-structure}

データをNumPyファイルとして準備するには、同じサブセットのすべてのファイルを1つのフォルダーに入れ、次にこれらのフォルダーをソースフォルダー内にグループ化します。以下のツリー図を参照してください。

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

## データのインポート{#import-data}

データが準備できたら、以下のいずれかの方法でZilliz Cloud collectionにインポートできます。

- [NumPyファイルフォルダのリストからファイルをインポートする（推奨）](./data-import-numpy#import-files-from-a-list-of-numpy-file-folders-recommended)

- [NumPyファイルフォルダからファイルをインポートする](./data-import-numpy#import-files-from-a-numpy-file-folder)

<Admonition type="info" icon="📘" title="Notes">

<p>ファイルが比較的小さい場合は、フォルダまたは複数パスの方法を使用して一度にすべてインポートすることをお勧めします。このアプローチにより、インポートプロセス中に内部最適化が可能になり、後でリソース消費を削減するのに役立ちます。</p>

</Admonition>

Zilliz CloudコンソールでMilvus SDKを使用してデータをインポートすることもできます。詳細については、[データのインポート（コンソール）](./import-data-on-web-ui)および[データのインポート（SDK）](./import-data-via-sdks)を参照してください。

### NumPyファイルフォルダのリストからファイルをインポートする（推奨）{#import-files-from-a-list-of-numpy-file-folders-recommended}

複数のパスからファイルをインポートする場合、各NumPyファイルフォルダパスを個別のリストに含め、それらのリストをすべて上位レベルのリストにグループ化します。以下のコード例を参照してください。

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

### NumPyファイルフォルダーからファイルをインポートする\{#import-files-from-a-numpy-file-folder}

ソースフォルダーにインポートするNumPyファイルフォルダーのみが含まれている場合、次のようにリクエストにソースフォルダーを含めることができます。

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

<p>フォルダに複数の形式のファイルが含まれている場合、リクエストは失敗します。</p>

</Admonition>

## ストレージパス{#storage-paths}

Zilliz Cloudは、クラウドストレージからのデータインポートをサポートしています。以下の表は、データファイルの可能なストレージパスを示しています。

<table>
   <tr>
     <th><p><strong>クラウド</strong></p></th>
     <th><p><strong>簡単な例</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>AWS S3</strong></p></td>
     <td><p>s3://<em>bucket-name</em>/<em>numpy-folder</em>/</p></td>
   </tr>
   <tr>
     <td><p><strong>Google Cloud Storage</strong></p></td>
     <td><p>gs://<em>bucket-name</em>/<em>numpy-folder</em>/</p></td>
   </tr>
   <tr>
     <td><p><strong>Azure Bolb</strong></p></td>
     <td><p><em>https:</em>//<em>myaccount</em>.blob.core.windows.net/<em>bucket-name</em>/<em>numpy-folder</em>/</p></td>
   </tr>
</table>

## 制限事項{#limits}

クラウドストレージからNumPyファイルでデータをインポートする際には、いくつかの制限事項があります。

<Admonition type="info" icon="📘" title="Notes">

<p>有効なNumPyファイルのセットは、ターゲットcollectionのschemaのフィールド名にちなんで名付けられ、その中のデータは対応するフィールド定義と一致する必要があります。</p>

</Admonition>

<table>
   <tr>
     <th><p><strong>インポート方法</strong></p></th>
     <th><p><strong>インポートあたりの最大サブディレクトリ数</strong></p></th>
     <th><p><strong>サブディレクトリあたりの最大サイズ</strong></p></th>
     <th><p><strong>合計インポートの最大サイズ</strong></p></th>
   </tr>
   <tr>
     <td><p>ローカルファイルから</p></td>
     <td colspan="3"><p>サポートされていません</p></td>
   </tr>
   <tr>
     <td><p>オブジェクトストレージから</p></td>
     <td><p>1,000サブディレクトリ</p></td>
     <td><p>10 GB</p></td>
     <td><p>1 TB</p></td>
   </tr>
</table>

[データファイルの準備](https://milvus.io/docs/bulk_insert.md#Prepare-the-data-file)を参照して自分でデータを再構築するか、[BulkWriterツール](./use-bulkwriter)を使用してソースデータファイルを生成することができます。[上記の図のschemaに基づいた準備済みのサンプルデータをダウンロードするには、ここをクリックしてください](https://assets.zilliz.com/prepared_numpy_data.zip)。